/**
 * GameState — Central game state with localStorage persistence
 * Ported from V1 use-game-state.tsx
 */

const STORAGE_KEY = 'beatworld_save_v2';

const DEFAULT_STATE = {
  playerId: crypto.randomUUID ? crypto.randomUUID() : `bw-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  playerName: 'Producer',
  currentLevel: 1,
  currentCity: null,
  completedCities: [],
  clout: 0,
  character: {
    skinTone: '#c68642',
    hairStyle: 'fade',
    hairColor: '#1a0a00',
    topStyle: 'hoodie',
    topColor: '#0050ff',
    pantsStyle: 'baggy',
    pantsColor: '#111133',
    accessory: 'headphones',
    expression: 'neutral',
  },
  tracks: {},      // cityId -> boolean[][]
  soundSystem: [], // unlocked sound system parts (legacy V1 — string ids)

  // ── Linear progression (V2) ─────────────────────────────────
  unlockedPieces: [],   // level numbers of unlocked rig pieces, e.g. [1] after L1 win
  completedLevels: [],  // level numbers of completed levels, e.g. [1]

  // ── Per-player audio prefs (V2) ─────────────────────────────
  audioPrefs: {
    variants: { kick: 0, snare: 0, hihat: 0, bass: 0 }, // 0-3 per instrument
    chordProgression: 0,                                 // 0-3 (boombap/gfunk/trap/soul)
    // Mixer state — persisted so the player's mix decisions survive reload.
    // Defaults match AudioEngine.DEFAULT_MIX so both layers stay in sync.
    mix: {
      master: 0,
      trackVol:    { kick: 0,    snare: 0,    hihat: 0,    perc: 0,    bass: 0,
                     lead: 0,    chord: 0,    arp: 0,      pad: 0,     fx: 0,    chordLoop: -3 },
      reverbSend:  { kick: 0,    snare: 0.05, hihat: 0.1,  perc: 0.15, bass: 0,
                     lead: 0.2,  chord: 0.3,  arp: 0.15,   pad: 0.5,   fx: 0.3,  chordLoop: 0.1 },
      delaySend:   { kick: 0,    snare: 0,    hihat: 0.05, perc: 0.1,  bass: 0,
                     lead: 0.2,  chord: 0,    arp: 0.25,   pad: 0,     fx: 0.4,  chordLoop: 0 },
      reverbWet: 1.0,
      delayWet:  1.0,
    },
  },

  // ── Character (V2 — 6 styles × 2 presentations = 12 variants) ──
  // style:        'boombap' | 'gfunk' | 'punk' | 'beatmaker' | 'otaku' | 'feline'
  // presentation: 'm' | 'f'
  // PNG path:     /assets/sprites/characters/{style}-{presentation}.png
  // Fallback:     {style}-m.png, then labelled placeholder.
  // Future v1.1 will add a user-uploaded character editor.
  style: 'boombap',
  presentation: 'm',
};

const VALID_STYLES = ['boombap', 'gfunk', 'punk', 'beatmaker', 'otaku', 'feline'];
const VALID_PRESENTATIONS = ['m', 'f'];

export class GameState {
  constructor() {
    this.listeners = new Set();
    this.data = this._load();
  }

  _load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...DEFAULT_STATE, ...parsed };
        // Deep-fill audio prefs so partial saves don't crash callers
        const parsedMix = (parsed.audioPrefs && parsed.audioPrefs.mix) || {};
        merged.audioPrefs = {
          ...DEFAULT_STATE.audioPrefs,
          ...(parsed.audioPrefs || {}),
          variants: {
            ...DEFAULT_STATE.audioPrefs.variants,
            ...((parsed.audioPrefs && parsed.audioPrefs.variants) || {}),
          },
          mix: {
            ...DEFAULT_STATE.audioPrefs.mix,
            ...parsedMix,
            trackVol:   { ...DEFAULT_STATE.audioPrefs.mix.trackVol,   ...(parsedMix.trackVol   || {}) },
            reverbSend: { ...DEFAULT_STATE.audioPrefs.mix.reverbSend, ...(parsedMix.reverbSend || {}) },
            delaySend:  { ...DEFAULT_STATE.audioPrefs.mix.delaySend,  ...(parsedMix.delaySend  || {}) },
          },
        };
        // ── Character migration ─────────────────────────────────
        // Three legacy shapes can land here:
        //   1. Cadaver exquisito  : { characterParts: { head, torso, legs } }
        //   2. Single character   : { character: 'boombap' }
        //   3. Presentation w/ NB : { style, presentation: 'nb' } → migrate to 'f' silently
        let migratedStyle = parsed.style ?? parsed.character;
        let migratedPresentation = parsed.presentation;

        if (!migratedStyle && parsed.characterParts) {
          migratedStyle = parsed.characterParts.head;
        }
        if (!VALID_STYLES.includes(migratedStyle)) migratedStyle = 'boombap';
        if (migratedPresentation === 'nb') migratedPresentation = 'f';
        if (!VALID_PRESENTATIONS.includes(migratedPresentation)) migratedPresentation = 'm';

        merged.style = migratedStyle;
        merged.presentation = migratedPresentation;

        // Strip legacy keys so future writes stay clean.
        // Only strip `character` when it's the V2 string form — leave the
        // V1 attribute-customizer object alone in case CharacterCreatorUI is reactivated.
        delete merged.characterParts;
        if (typeof merged.character === 'string') delete merged.character;
        return merged;
      }
    } catch (e) {
      console.warn('Failed to load save:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE)); // fresh deep clone
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save:', e);
    }
    this._notify();
  }

  _notify() {
    for (const fn of this.listeners) fn(this.data);
  }

  onChange(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  update(partial) {
    Object.assign(this.data, partial);
    this._save();
  }

  setCurrentCity(cityId) {
    this.data.currentCity = cityId;
    this._save();
  }

  completeCity(cityId, cloutReward = 100) {
    if (this.data.completedCities.includes(cityId)) return;
    this.data.completedCities.push(cityId);
    this.data.clout += cloutReward;
    // Level up every 3 cities
    this.data.currentLevel = Math.min(5, 1 + Math.floor(this.data.completedCities.length / 3));
    this._save();
  }

  saveTrack(cityId, trackData) {
    this.data.tracks[cityId] = trackData;
    this._save();
  }

  unlockSoundSystemPart(partName) {
    if (!this.data.soundSystem.includes(partName)) {
      this.data.soundSystem.push(partName);
      this._save();
    }
  }

  isCityCompleted(cityId) {
    return this.data.completedCities.includes(cityId);
  }

  isCityUnlocked(cityId) {
    // Import CITIES dynamically to avoid circular deps
    // For now, use level-based unlocking
    return true; // Will be gated by city level vs player level
  }

  reset() {
    const id = this.data.playerId;
    this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.data.playerId = id;
    this._save();
  }

  // ── V2 linear progression ───────────────────────────────────
  unlockSoundsystemPiece(level) {
    if (!this.data.unlockedPieces.includes(level)) {
      this.data.unlockedPieces.push(level);
      this._save();
    }
  }

  completeLevel(level) {
    if (!this.data.completedLevels.includes(level)) {
      this.data.completedLevels.push(level);
      this._save();
    }
  }

  isLevelUnlocked(level) {
    if (level === 1) return true;
    return this.data.completedLevels.includes(level - 1);
  }

  isLevelCompleted(level) {
    return this.data.completedLevels.includes(level);
  }

  // ── V2 audio prefs ──────────────────────────────────────────
  setVariant(instrumentType, variantIndex) {
    if (!this.data.audioPrefs.variants) this.data.audioPrefs.variants = {};
    this.data.audioPrefs.variants[instrumentType] = variantIndex;
    this._save();
  }

  setChordProgression(index) {
    this.data.audioPrefs.chordProgression = index;
    this._save();
  }

  // ── Mixer persistence (V2) ─────────────────────────────────
  setMixMaster(db) {
    this.data.audioPrefs.mix.master = db;
    this._save();
  }
  setMixTrackVol(type, db) {
    this.data.audioPrefs.mix.trackVol[type] = db;
    this._save();
  }
  setMixReverbSend(type, level) {
    this.data.audioPrefs.mix.reverbSend[type] = level;
    this._save();
  }
  setMixDelaySend(type, level) {
    this.data.audioPrefs.mix.delaySend[type] = level;
    this._save();
  }
  setMixReverbWet(level) {
    this.data.audioPrefs.mix.reverbWet = level;
    this._save();
  }
  setMixDelayWet(level) {
    this.data.audioPrefs.mix.delayWet = level;
    this._save();
  }

  // ── V2 character (style + presentation) ────────────────────
  setStyle(style) {
    if (!VALID_STYLES.includes(style)) return;
    this.data.style = style;
    this._save();
  }

  setPresentation(presentation) {
    if (!VALID_PRESENTATIONS.includes(presentation)) return;
    this.data.presentation = presentation;
    this._save();
  }

  setPlayerName(name) {
    this.data.playerName = (name || 'PRODUCER').toUpperCase().slice(0, 12);
    this._save();
  }

  // True when a returning player has at least picked a name once
  hasOnboarded() {
    return !!this.data.playerName && this.data.playerName !== 'Producer';
  }

  addClout(amount) {
    this.data.clout = (this.data.clout || 0) + amount;
    this._save();
  }
}
