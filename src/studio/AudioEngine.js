/**
 * AudioEngine — Tone.Sampler-aware playback with synth fallback.
 *
 * Layers, in order of precedence per slot:
 *   1. Loaded MP3 sample (Tone.Sampler) — used when assets/audio/{level}/*.mp3 loaded successfully.
 *   2. Built-in Tone.js synthesis — used when the sample failed to load (404 or decode fail).
 *
 * Chord progression loop:
 *   Tone.Player with loop:true, started/stopped by sequencer events.
 *   No synth fallback — chord progressions are the "song" of the level and synth versions sound generic.
 *   If files are missing, the chord layer is silent and console.warn is emitted.
 *
 * StudioScene calls:
 *   await audioEngine.loadLevel('level-01-nyc');
 *   audioEngine.setVariant('kick', 2);
 *   audioEngine.setChordProgression(1);
 *   audioEngine.startSequencer(grid, instruments, onStep); // unchanged API
 */
import * as Tone from 'tone';
import { getCityProfile } from './GenreAudio.js';

// ── Sample manifest (Level 1 / NYC) ─────────────────────────
const SAMPLE_PATHS = {
  kick:  ['kick_01.mp3',  'kick_02.mp3',  'kick_03.mp3',  'kick_04.mp3'],
  snare: ['snare_01.mp3', 'snare_02.mp3', 'snare_03.mp3', 'snare_04.mp3'],
  hihat: ['hihat_01.mp3', 'hihat_02.mp3', 'hihat_03.mp3', 'hihat_04.mp3'],
  bass:  ['bass_01.mp3',  'bass_02.mp3',  'bass_03.mp3',  'bass_04.mp3'],
};

export const CHORD_PROGRESSIONS = [
  { name: 'BOOM BAP',  file: 'chord_progression_01.mp3' },
  { name: 'G-FUNK',    file: 'chord_progression_02.mp3' },
  { name: 'TRAP',      file: 'chord_progression_03.mp3' },
  { name: 'SOUL LOOP', file: 'chord_progression_04.mp3' },
];

// Deterministic synth variation
function hashIdx(idx) {
  let h = idx * 2654435761;
  h = ((h >>> 16) ^ h) * 0x45d9f3b;
  return ((h >>> 16) ^ h) & 0x7fffffff;
}
function vary(base, idx, range) {
  const h = hashIdx(idx);
  const t = (h % 1000) / 1000;
  return base * (1 + (t - 0.5) * 2 * range);
}

// ── Track buses (per-instrument routing) ───────────────────
// Every instrument type that can play in any level gets its own bus, so
// L1 can use the four core slots (kick/snare/hihat/bass) and L2+ can use
// perc/lead/chord/arp/pad/fx without touching the engine again.
export const TRACK_BUS_KEYS = ['kick','snare','hihat','perc','bass','lead','chord','arp','pad','fx','chordLoop'];

// Default mix when GameState has nothing saved.
// Volumes are in dB (Tone convention). Sends are 0..1 gains.
export const DEFAULT_MIX = {
  master: 0,
  trackVol: {
    kick: 0, snare: 0, hihat: 0, perc: 0, bass: 0,
    lead: 0, chord: 0, arp: 0, pad: 0, fx: 0, chordLoop: -3,
  },
  reverbSend: {
    kick: 0, snare: 0.05, hihat: 0.1, perc: 0.15, bass: 0,
    lead: 0.2, chord: 0.3, arp: 0.15, pad: 0.5, fx: 0.3, chordLoop: 0.1,
  },
  delaySend: {
    kick: 0, snare: 0.0, hihat: 0.05, perc: 0.1, bass: 0,
    lead: 0.2, chord: 0, arp: 0.25, pad: 0, fx: 0.4, chordLoop: 0,
  },
  reverbWet: 1.0,
  delayWet: 1.0,
};

/**
 * TrackBus — one routing strip per instrument type.
 *
 *           ┌─────► trackVol ──► masterVol
 * input ────┼─────► reverbSend ─► reverbBus
 *           └─────► delaySend ──► delayBus
 *
 * input is a unity-gain node so callers can connect samplers / synths to a
 * stable point without juggling levels.
 */
class TrackBus {
  constructor(masterBus, reverbBus, delayBus) {
    this.input       = new Tone.Gain(1);
    this.trackVol    = new Tone.Volume(0);
    this.reverbSend  = new Tone.Gain(0);
    this.delaySend   = new Tone.Gain(0);

    this.input.connect(this.trackVol);
    this.trackVol.connect(masterBus);

    this.input.connect(this.reverbSend);
    this.reverbSend.connect(reverbBus);

    this.input.connect(this.delaySend);
    this.delaySend.connect(delayBus);
  }
  setVolumeDb(db) { this.trackVol.volume.value = clamp(db, -60, 6); }
  setReverbSend(level) { this.reverbSend.gain.value = clamp(level, 0, 1); }
  setDelaySend(level)  { this.delaySend.gain.value  = clamp(level, 0, 1); }
  dispose() {
    this.input.dispose(); this.trackVol.dispose();
    this.reverbSend.dispose(); this.delaySend.dispose();
  }
}

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export class AudioEngine {
  constructor() {
    this.ready = false;
    this.cityId = null;
    this.genre = 'Hip Hop';
    this.bpm = 90;
    this.playing = false;
    this.currentStep = 0;
    this.stepCallback = null;
    this.loopId = null;

    // Master / fx
    this.masterVol = null;
    this.reverb = null;
    this.delay = null;
    this.compressor = null;

    // Per-track buses (built in init())
    this.tracks = {}; // TRACK_BUS_KEYS → TrackBus

    // Sample state — populated by loadLevel()
    this.samples = { kick: [null,null,null,null], snare: [null,null,null,null], hihat: [null,null,null,null], bass: [null,null,null,null] };
    this.chordLoops = [null, null, null, null];   // Tone.Player[] for chord_progression_01..04
    this.currentChordPlayer = null;
    this.audioPrefs = {
      variants: { kick: 0, snare: 0, hihat: 0, bass: 0 },
      chordProgression: 0,
      mix: JSON.parse(JSON.stringify(DEFAULT_MIX)),
    };

    // Loading lifecycle
    this._levelLoadPromise = null;
    this._loadStatus = { total: 0, completed: 0, failed: 0 };
  }

  async init() {
    if (this.ready) return;
    await Tone.start();

    // Output chain: trackBuses → masterVol → compressor → Destination
    this.compressor = new Tone.Compressor({ threshold: -6, ratio: 4 }).toDestination();
    this.masterVol = new Tone.Volume(0).connect(this.compressor);

    // Reverb/delay are SENDS now (wet=1 — dry signal flows directly to master).
    // Their output gains feed master so the user can attenuate the whole bus.
    this.reverb = new Tone.Reverb({ decay: 1.8, wet: 1.0 }).connect(this.masterVol);
    this.delay  = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.32, wet: 1.0 }).connect(this.masterVol);

    // Build a TrackBus for each instrument type
    for (const key of TRACK_BUS_KEYS) {
      this.tracks[key] = new TrackBus(this.masterVol, this.reverb, this.delay);
    }

    // Apply persisted mix prefs (or DEFAULT_MIX if first run)
    this._applyMixPrefs(this.audioPrefs.mix);

    this.ready = true;
    console.log('[AudioEngine] Initialized with Tone.js (per-track mixer + sends)');
  }

  // ── Track-bus access for fallback synths ───────────────────
  // Returns the input node of the bus for this instrument type, falling back
  // to masterVol if the type doesn't have a dedicated bus (shouldn't happen).
  _busInput(type) {
    const bus = this.tracks[type] || this.tracks.fx;
    return bus ? bus.input : this.masterVol;
  }

  setCityId(cityId)   { this.cityId = cityId; }
  setGenre(genre)     { this.genre = genre; }
  setBpm(bpm)         { this.bpm = bpm; Tone.getTransport().bpm.value = bpm; }
  getProfile()        { return getCityProfile(this.genre, this.cityId); }
  isLevelLoaded()     { return this._levelLoadPromise && this._levelLoadPromise._resolved; }
  getLoadStatus()     { return { ...this._loadStatus }; }

  /**
   * Update player audio preferences (per-instrument variant + chord progression + mix).
   * Called by StudioScene whenever the player clicks a picker or moves a slider.
   */
  setAudioPrefs(prefs) {
    if (!prefs) return;
    if (prefs.variants) {
      Object.assign(this.audioPrefs.variants, prefs.variants);
    }
    if (typeof prefs.chordProgression === 'number') {
      this.setChordProgression(prefs.chordProgression);
    }
    if (prefs.mix) {
      this.audioPrefs.mix = {
        ...DEFAULT_MIX,
        ...prefs.mix,
        trackVol:    { ...DEFAULT_MIX.trackVol,    ...(prefs.mix.trackVol    || {}) },
        reverbSend:  { ...DEFAULT_MIX.reverbSend,  ...(prefs.mix.reverbSend  || {}) },
        delaySend:   { ...DEFAULT_MIX.delaySend,   ...(prefs.mix.delaySend   || {}) },
      };
      this._applyMixPrefs(this.audioPrefs.mix);
    }
  }

  // ── Mixer API (public) ─────────────────────────────────────
  // All level/send values are stored in audioPrefs.mix so StudioScene can
  // round-trip them through GameState; they're applied to live nodes
  // immediately if init() has run.
  setMasterVolume(db) {
    this.audioPrefs.mix.master = clamp(db, -60, 6);
    if (this.masterVol) this.masterVol.volume.value = this.audioPrefs.mix.master;
  }
  setInstrumentVolume(type, db) {
    if (!this.audioPrefs.mix.trackVol) this.audioPrefs.mix.trackVol = {};
    this.audioPrefs.mix.trackVol[type] = clamp(db, -60, 6);
    this.tracks[type]?.setVolumeDb(this.audioPrefs.mix.trackVol[type]);
  }
  setReverbSend(type, level) {
    if (!this.audioPrefs.mix.reverbSend) this.audioPrefs.mix.reverbSend = {};
    this.audioPrefs.mix.reverbSend[type] = clamp(level, 0, 1);
    this.tracks[type]?.setReverbSend(this.audioPrefs.mix.reverbSend[type]);
  }
  setDelaySend(type, level) {
    if (!this.audioPrefs.mix.delaySend) this.audioPrefs.mix.delaySend = {};
    this.audioPrefs.mix.delaySend[type] = clamp(level, 0, 1);
    this.tracks[type]?.setDelaySend(this.audioPrefs.mix.delaySend[type]);
  }
  setReverbWet(level) {
    this.audioPrefs.mix.reverbWet = clamp(level, 0, 1);
    if (this.reverb) this.reverb.wet.value = this.audioPrefs.mix.reverbWet;
  }
  setDelayWet(level) {
    this.audioPrefs.mix.delayWet = clamp(level, 0, 1);
    if (this.delay) this.delay.wet.value = this.audioPrefs.mix.delayWet;
  }
  setDelayTime(time) { if (this.delay) this.delay.delayTime.value = clamp(time, 0.05, 1.5); }
  getMix() { return JSON.parse(JSON.stringify(this.audioPrefs.mix)); }

  _applyMixPrefs(mix) {
    if (!this.ready || !mix) return;
    this.masterVol.volume.value = mix.master ?? 0;
    if (this.reverb) this.reverb.wet.value = mix.reverbWet ?? 1.0;
    if (this.delay)  this.delay.wet.value  = mix.delayWet  ?? 1.0;
    for (const key of TRACK_BUS_KEYS) {
      const bus = this.tracks[key];
      if (!bus) continue;
      bus.setVolumeDb(mix.trackVol?.[key] ?? 0);
      bus.setReverbSend(mix.reverbSend?.[key] ?? 0);
      bus.setDelaySend(mix.delaySend?.[key] ?? 0);
    }
  }

  setVariant(type, idx) {
    if (!this.audioPrefs.variants) this.audioPrefs.variants = {};
    this.audioPrefs.variants[type] = idx;
  }

  /**
   * Returns 'sample' if a real MP3 loaded for this slot,
   * 'synth' if it fell back, 'loading' if loadLevel() is still pending.
   */
  getVariantStatus(type, idx) {
    if (this._levelLoadPromise && !this._levelLoadPromise._resolved) return 'loading';
    return this.samples[type]?.[idx] ? 'sample' : 'synth';
  }

  getChordStatus(idx) {
    if (this._levelLoadPromise && !this._levelLoadPromise._resolved) return 'loading';
    return this.chordLoops[idx] ? 'sample' : 'missing';
  }

  /**
   * Load all sample assets for a level.
   * Resolves when every load has either completed or failed (graceful).
   * NEVER throws — failed slots fall back to synth on trigger.
   */
  loadLevel(levelId) {
    if (this._levelLoadPromise) return this._levelLoadPromise;

    const base = `/assets/audio/${levelId}/`;
    const tasks = [];
    this._loadStatus = { total: 0, completed: 0, failed: 0 };

    // Drums + bass
    for (const type of Object.keys(SAMPLE_PATHS)) {
      SAMPLE_PATHS[type].forEach((file, idx) => {
        this._loadStatus.total++;
        const url = base + file;
        const loader = (type === 'bass')
          ? this._loadBassSampler(url)
          : this._loadDrumSampler(url);
        tasks.push(loader.then(
          (sampler) => {
            sampler.connect(this._busInput(type));
            this.samples[type][idx] = sampler;
            this._loadStatus.completed++;
          },
          () => {
            console.warn(`[AudioEngine] Sample missing: ${file} — falling back to synth.`);
            this._loadStatus.failed++;
          }
        ));
      });
    }

    // Chord loops
    CHORD_PROGRESSIONS.forEach((cp, idx) => {
      this._loadStatus.total++;
      tasks.push(this._loadChordPlayer(base + cp.file).then(
        (player) => {
          player.connect(this._busInput('chordLoop'));
          this.chordLoops[idx] = player;
          this._loadStatus.completed++;
        },
        () => {
          console.warn(`[AudioEngine] Chord loop missing: ${cp.file} — chord layer will be silent for this slot.`);
          this._loadStatus.failed++;
        }
      ));
    });

    const all = Promise.all(tasks).then(() => {
      this._levelLoadPromise._resolved = true;
      console.log(`[AudioEngine] Level ${levelId} load complete — ${this._loadStatus.completed}/${this._loadStatus.total} sampled, ${this._loadStatus.failed} synth fallback.`);
    });
    all._resolved = false;
    this._levelLoadPromise = all;
    return all;
  }

  _withTimeout(promise, ms = 6000) {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('load timeout')), ms);
      promise.then(
        (v) => { clearTimeout(t); resolve(v); },
        (e) => { clearTimeout(t); reject(e); }
      );
    });
  }

  _loadDrumSampler(url) {
    return this._withTimeout(new Promise((resolve, reject) => {
      const sampler = new Tone.Sampler({
        urls: { 'C4': url },
        onload: () => resolve(sampler),
        onerror: reject,
      });
    }));
  }

  _loadBassSampler(url) {
    return this._withTimeout(new Promise((resolve, reject) => {
      const sampler = new Tone.Sampler({
        urls: { 'C2': url },
        onload: () => resolve(sampler),
        onerror: reject,
      });
    }));
  }

  _loadChordPlayer(url) {
    return this._withTimeout(new Promise((resolve, reject) => {
      const player = new Tone.Player({
        url,
        loop: true,
        autostart: false,
        onload: () => resolve(player),
        onerror: reject,
      });
    }));
  }

  // ── Chord loop control ─────────────────────────────────────
  setChordProgression(idx) {
    if (idx === this.audioPrefs.chordProgression) return;
    const wasPlaying = !!this.currentChordPlayer;
    if (wasPlaying) this.stopChordLoop();
    this.audioPrefs.chordProgression = idx;
    if (wasPlaying) this.startChordLoop();
  }

  startChordLoop() {
    const idx = this.audioPrefs.chordProgression || 0;
    const player = this.chordLoops[idx];
    if (!player) return; // no fallback for chords by design
    try {
      player.start();
      this.currentChordPlayer = player;
    } catch (e) {
      console.warn('[AudioEngine] startChordLoop failed:', e);
    }
  }

  stopChordLoop() {
    if (this.currentChordPlayer) {
      try { this.currentChordPlayer.stop(); } catch (_) {}
      this.currentChordPlayer = null;
    }
  }

  // ── Unified instrument trigger (sample → synth fallback) ───
  triggerInstrument(type, variantIndex, time, note = null) {
    if (!this.ready) return;
    const t = time !== undefined ? time : Tone.now();
    const idx = (variantIndex !== undefined) ? variantIndex : (this.audioPrefs.variants[type] || 0);

    const sampler = this.samples[type]?.[idx];
    if (sampler) {
      try {
        if (type === 'bass') {
          // Bass sample is recorded at C2. Pitch-shift to the requested note.
          sampler.triggerAttack(note || 'C2', t);
        } else {
          // Drums: always trigger source pitch (no shift).
          sampler.triggerAttack('C4', t);
        }
        return;
      } catch (e) {
        console.warn(`[AudioEngine] Sample trigger failed for ${type}[${idx}]:`, e);
      }
    }

    // Synth fallback
    if (type === 'kick' || type === 'snare' || type === 'hihat' || type === 'perc') {
      this.playDrum(type, t, 0.8, idx);
    } else if (type === 'bass') {
      // Synth bass uses scale-degree indexing — fall back to root note.
      this.playSynth('bass', 0, t, 0.6, idx);
    } else {
      this.playSynth(type, 0, t, 0.6, idx);
    }
  }

  // ── Synth fallbacks (preserved from V1) ────────────────────
  playDrum(type, time, volume = 0.8, instrumentIdx = 0) {
    if (!this.ready) return;
    const gp = this.getProfile();
    const now = time !== undefined ? time : Tone.now();

    if (type === 'kick') {
      const p = gp.kick;
      const freq = vary(p.frequency || 60, instrumentIdx, 0.12);
      const decay = vary(p.decay || 0.5, instrumentIdx, 0.15);
      const synth = new Tone.MembraneSynth({
        pitchDecay: decay * 0.6, octaves: 4,
        oscillator: { type: 'sine' },
        envelope: { attack: p.attack || 0.01, decay, sustain: 0, release: p.release || 0.1 },
        volume: Tone.gainToDb(volume),
      }).connect(this._busInput('kick'));
      synth.triggerAttackRelease(freq, decay, now);
      setTimeout(() => synth.dispose(), (decay + 0.5) * 1000);
    } else if (type === 'snare') {
      const p = gp.snare;
      const decay = vary(p.decay || 0.15, instrumentIdx, 0.15);
      const noise = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: p.attack || 0.005, decay, sustain: 0, release: p.release || 0.05 },
        volume: Tone.gainToDb(volume * 0.7),
      }).connect(this._busInput('snare'));
      const body = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.001, decay: decay * 0.8, sustain: 0, release: 0.05 },
        volume: Tone.gainToDb(volume * 0.5),
      }).connect(this._busInput('snare'));
      noise.triggerAttackRelease(decay, now);
      body.triggerAttackRelease(p.frequency || 180, decay * 0.8, now);
      setTimeout(() => { noise.dispose(); body.dispose(); }, (decay + 0.5) * 1000);
    } else if (type === 'hihat') {
      const p = gp.hat;
      const decay = vary(p.decay || 0.08, instrumentIdx, 0.25);
      const synth = new Tone.MetalSynth({
        frequency: vary(p.frequency || 400, instrumentIdx, 0.15),
        envelope: { attack: p.attack || 0.002, decay, release: p.release || 0.02 },
        harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5,
        volume: Tone.gainToDb(volume * 0.3),
      }).connect(this._busInput('hihat'));
      synth.triggerAttackRelease('16n', now);
      setTimeout(() => synth.dispose(), (decay + 0.5) * 1000);
    } else if (type === 'perc') {
      const p = gp.perc;
      const freq = vary(p.frequency || 2000, instrumentIdx, 0.15);
      const decay = vary(p.decay || 0.2, instrumentIdx, 0.2);
      const synth = new Tone.MembraneSynth({
        pitchDecay: 0.05, octaves: 2,
        oscillator: { type: 'square' },
        envelope: { attack: p.attack || 0.01, decay, sustain: 0, release: p.release || 0.1 },
        volume: Tone.gainToDb(volume * 0.5),
      }).connect(this._busInput('perc'));
      synth.triggerAttackRelease(freq, decay, now);
      setTimeout(() => synth.dispose(), (decay + 0.5) * 1000);
    }
  }

  playSynth(type, noteIndex, time, volume = 0.6, instrumentIdx = 0) {
    if (!this.ready) return;
    const gp = this.getProfile();
    const now = time !== undefined ? time : Tone.now();

    let octaveOffset = 0;
    if (type === 'lead' || type === 'fx') octaveOffset = 2;
    else if (type === 'arp') octaveOffset = 3;
    else if (type === 'chord' || type === 'pad') octaveOffset = 1;

    const scaleIdx = noteIndex % gp.scale.length;
    const semitones = gp.scale[scaleIdx] + octaveOffset * 12;
    const rootHz = gp.rootHz || 110;
    const freq = rootHz * Math.pow(2, semitones / 12);
    const vFreq = vary(freq, instrumentIdx, 0.02);

    if (type === 'bass') {
      const p = gp.bass;
      const decay = vary(p.decay || 0.3, instrumentIdx, 0.15);
      const synth = new Tone.FMSynth({
        harmonicity: 2, modulationIndex: p.fm || 20,
        oscillator: { type: 'sawtooth' },
        envelope: { attack: p.attack || 0.02, decay, sustain: p.sustain || 0.1, release: p.release || 0.15 },
        modulation: { type: 'square' },
        modulationEnvelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1 },
        volume: Tone.gainToDb(volume),
      }).connect(this._busInput('bass'));
      synth.triggerAttackRelease(vFreq, decay, now);
      setTimeout(() => synth.dispose(), (decay + 0.5) * 1000);
    } else if (type === 'lead') {
      const p = gp.lead;
      const decay = vary(p.decay || 0.4, instrumentIdx, 0.2);
      const synth = new Tone.FMSynth({
        harmonicity: 3, modulationIndex: (p.fm || 200) / 50,
        oscillator: { type: 'sawtooth' },
        envelope: { attack: p.attack || 0.05, decay, sustain: p.sustain || 0.3, release: p.release || 0.2 },
        volume: Tone.gainToDb(volume * 0.6),
      }).connect(this._busInput('lead'));
      synth.triggerAttackRelease(vFreq, decay, now);
      setTimeout(() => synth.dispose(), (decay + 0.5) * 1000);
    } else if (type === 'chord') {
      const p = gp.chord;
      const release = vary(p.release || 0.3, instrumentIdx, 0.2);
      [0, 4, 7].forEach((interval) => {
        const f = vFreq * Math.pow(2, interval / 12);
        const synth = new Tone.Synth({
          oscillator: { type: 'triangle' },
          envelope: { attack: p.attack || 0.08, decay: p.decay || 0.5, sustain: p.sustain || 0.4, release },
          volume: Tone.gainToDb(volume * 0.3),
        }).connect(this._busInput('chord'));
        synth.triggerAttackRelease(f, release * 0.8, now);
        setTimeout(() => synth.dispose(), (release + 0.5) * 1000);
      });
    } else if (type === 'arp') {
      const p = gp.arp;
      const gate = vary(p.decay || 0.25, instrumentIdx, 0.2);
      const synth = new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: p.attack || 0.02, decay: gate, sustain: p.sustain || 0.1, release: p.release || 0.15 },
        volume: Tone.gainToDb(volume * 0.4),
      }).connect(this._busInput('arp'));
      synth.triggerAttackRelease(vFreq, gate, now);
      setTimeout(() => synth.dispose(), (gate + 0.5) * 1000);
    } else if (type === 'pad') {
      const p = gp.pad;
      const release = vary(p.release || 0.96, instrumentIdx, 0.2);
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: p.attack || 0.48, decay: p.decay || 0.96, sustain: p.sustain || 0.76, release },
        volume: Tone.gainToDb(volume * 0.3),
      }).connect(this._busInput('pad'));
      synth.triggerAttackRelease([vFreq, vFreq * 2.01], release * 0.6, now);
      setTimeout(() => synth.dispose(), (release + 1) * 1000);
    } else {
      const synth = new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.06 },
        volume: Tone.gainToDb(volume * 0.35),
      }).connect(this._busInput('fx'));
      synth.triggerAttackRelease(vFreq * 3, 0.3, now);
      setTimeout(() => synth.dispose(), 1000);
    }
  }

  // ── Sequencer (StudioScene → here) ─────────────────────────
  /**
   * Bass step → note string. Cycles through a simple pentatonic shape so the bass
   * walks instead of mashing one note. C2/D2/F2/G2 — works under the L1 chord loops.
   */
  _bassNoteForStep(step) {
    const seq = ['C2', 'C2', 'D2', 'F2'];
    return seq[Math.floor(step / 4) % seq.length];
  }

  startSequencer(grid, instruments, onStep) {
    if (!this.ready || this.playing) return;
    this.playing = true;
    this.currentStep = 0;

    const transport = Tone.getTransport();
    transport.bpm.value = this.bpm;

    const totalSteps = grid[0]?.length || 16;
    this.stepCallback = onStep;

    this.loopId = new Tone.Loop((time) => {
      const step = this.currentStep;

      for (let trackIdx = 0; trackIdx < grid.length; trackIdx++) {
        if (grid[trackIdx] && grid[trackIdx][step]) {
          const inst = instruments[trackIdx];
          if (!inst) continue;
          const type = inst.type;
          if (type === 'bass') {
            this.triggerInstrument('bass', undefined, time, this._bassNoteForStep(step));
          } else if (type === 'kick' || type === 'snare' || type === 'hihat' || type === 'perc') {
            this.triggerInstrument(type, undefined, time);
          } else {
            // Other synth-only types (lead/chord/arp/pad/fx) use the legacy synth path
            this.playSynth(type, step % 8, time, 0.6, trackIdx);
          }
        }
      }

      if (this.stepCallback) {
        Tone.getDraw().schedule(() => this.stepCallback(step), time);
      }

      this.currentStep = (step + 1) % totalSteps;
    }, '16n');

    this.loopId.start(0);
    transport.start();
  }

  stopSequencer() {
    this.playing = false;
    if (this.loopId) {
      this.loopId.stop();
      this.loopId.dispose();
      this.loopId = null;
    }
    Tone.getTransport().stop();
    this.currentStep = 0;
  }

  toggleSequencer(grid, instruments, onStep) {
    if (this.playing) this.stopSequencer();
    else              this.startSequencer(grid, instruments, onStep);
    return this.playing;
  }

  // ── Legacy compatibility shims ─────────────────────────────
  // Older callers used setReverbLevel/setDelayLevel to control the master fx
  // wet — the send-style mixer treats those as bus-output gates instead.
  setReverbLevel(level) { this.setReverbWet(level); }
  setDelayLevel(level)  { this.setDelayWet(level); }

  dispose() {
    this.stopSequencer();
    this.stopChordLoop();
    for (const key of Object.keys(this.tracks)) {
      this.tracks[key]?.dispose?.();
    }
    this.tracks = {};
    if (this.reverb) this.reverb.dispose();
    if (this.delay) this.delay.dispose();
    if (this.masterVol) this.masterVol.dispose();
    if (this.compressor) this.compressor.dispose();
    for (const type of Object.keys(this.samples)) {
      this.samples[type].forEach(s => s?.dispose?.());
    }
    this.chordLoops.forEach(p => p?.dispose?.());
  }
}
