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

    // Sample state — populated by loadLevel()
    this.samples = { kick: [null,null,null,null], snare: [null,null,null,null], hihat: [null,null,null,null], bass: [null,null,null,null] };
    this.chordLoops = [null, null, null, null];   // Tone.Player[] for chord_progression_01..04
    this.currentChordPlayer = null;
    this.audioPrefs = {
      variants: { kick: 0, snare: 0, hihat: 0, bass: 0 },
      chordProgression: 0,
    };

    // Loading lifecycle
    this._levelLoadPromise = null;
    this._loadStatus = { total: 0, completed: 0, failed: 0 };
  }

  async init() {
    if (this.ready) return;
    await Tone.start();

    this.compressor = new Tone.Compressor({ threshold: -6, ratio: 4 }).toDestination();
    this.masterVol = new Tone.Volume(-3).connect(this.compressor);

    this.reverb = new Tone.Reverb({ decay: 1.5, wet: 0.25 }).connect(this.compressor);
    this.delay  = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.3, wet: 0.2 }).connect(this.compressor);

    this.ready = true;
    console.log('[AudioEngine] Initialized with Tone.js');
  }

  setCityId(cityId)   { this.cityId = cityId; }
  setGenre(genre)     { this.genre = genre; }
  setBpm(bpm)         { this.bpm = bpm; Tone.getTransport().bpm.value = bpm; }
  getProfile()        { return getCityProfile(this.genre, this.cityId); }
  isLevelLoaded()     { return this._levelLoadPromise && this._levelLoadPromise._resolved; }
  getLoadStatus()     { return { ...this._loadStatus }; }

  /**
   * Update player audio preferences (per-instrument variant + chord progression).
   * Called by StudioScene whenever the player clicks a picker button.
   */
  setAudioPrefs(prefs) {
    if (!prefs) return;
    if (prefs.variants) {
      Object.assign(this.audioPrefs.variants, prefs.variants);
    }
    if (typeof prefs.chordProgression === 'number') {
      this.setChordProgression(prefs.chordProgression);
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
            sampler.connect(this.masterVol || Tone.getDestination());
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
          player.connect(this.masterVol || Tone.getDestination());
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
      }).connect(this.masterVol);
      synth.triggerAttackRelease(freq, decay, now);
      setTimeout(() => synth.dispose(), (decay + 0.5) * 1000);
    } else if (type === 'snare') {
      const p = gp.snare;
      const decay = vary(p.decay || 0.15, instrumentIdx, 0.15);
      const noise = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: p.attack || 0.005, decay, sustain: 0, release: p.release || 0.05 },
        volume: Tone.gainToDb(volume * 0.7),
      }).connect(this.masterVol);
      const body = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.001, decay: decay * 0.8, sustain: 0, release: 0.05 },
        volume: Tone.gainToDb(volume * 0.5),
      }).connect(this.masterVol);
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
      }).connect(this.masterVol);
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
      }).connect(this.masterVol);
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
      }).connect(this.masterVol);
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
      }).connect(this.masterVol);
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
        }).connect(this.masterVol);
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
      }).connect(this.masterVol);
      synth.triggerAttackRelease(vFreq, gate, now);
      setTimeout(() => synth.dispose(), (gate + 0.5) * 1000);
    } else if (type === 'pad') {
      const p = gp.pad;
      const release = vary(p.release || 0.96, instrumentIdx, 0.2);
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: { attack: p.attack || 0.48, decay: p.decay || 0.96, sustain: p.sustain || 0.76, release },
        volume: Tone.gainToDb(volume * 0.3),
      }).connect(this.reverb);
      synth.triggerAttackRelease([vFreq, vFreq * 2.01], release * 0.6, now);
      setTimeout(() => synth.dispose(), (release + 1) * 1000);
    } else {
      const synth = new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.3, sustain: 0, release: 0.06 },
        volume: Tone.gainToDb(volume * 0.35),
      }).connect(this.delay);
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

  // ── Effects controls ───────────────────────────────────────
  setReverbLevel(level) { if (this.reverb) this.reverb.wet.value = Math.max(0, Math.min(1, level)); }
  setDelayLevel(level)  { if (this.delay)  this.delay.wet.value  = Math.max(0, Math.min(1, level)); }
  setDelayTime(time)    { if (this.delay)  this.delay.delayTime.value = Math.max(0.05, Math.min(1.5, time)); }

  dispose() {
    this.stopSequencer();
    this.stopChordLoop();
    if (this.masterVol) this.masterVol.dispose();
    if (this.reverb) this.reverb.dispose();
    if (this.delay) this.delay.dispose();
    if (this.compressor) this.compressor.dispose();
    for (const type of Object.keys(this.samples)) {
      this.samples[type].forEach(s => s?.dispose?.());
    }
    this.chordLoops.forEach(p => p?.dispose?.());
  }
}
