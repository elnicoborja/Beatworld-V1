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
  },

  // ── Cadaver Exquisito character parts (V2) ──────────────────
  characterParts: {
    head: 'boombap',   // top-{id}.png
    torso: 'boombap',  // mid-{id}.png
    legs: 'boombap',   // bottom-{id}.png
  },

  // ── 2-axis character identity (V2.1) ───────────────────────
  characterIdentity: {
    style: 'boombap',
    presentation: 'm',
  },

};

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
        // Deep-fill nested V2 shapes so partial saves don't crash callers
        merged.audioPrefs = {
          ...DEFAULT_STATE.audioPrefs,
          ...(parsed.audioPrefs || {}),
          variants: {
            ...DEFAULT_STATE.audioPrefs.variants,
            ...((parsed.audioPrefs && parsed.audioPrefs.variants) || {}),
          },
        };
        merged.characterParts = {
          ...DEFAULT_STATE.characterParts,
          ...(parsed.characterParts || {}),
        };
        merged.characterIdentity = {
          ...DEFAULT_STATE.characterIdentity,
          ...(parsed.characterIdentity || {}),
        };
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

  // ── V2 cadaver-exquisito character parts ────────────────────
  setCharacterPart(zone, identity) {
    // zone: 'head' | 'torso' | 'legs'
    // identity: 'boombap' | 'gfunk' | 'punk' | 'beatmaker'
    this.data.characterParts[zone] = identity;
    this._save();
  }

  setCharacterIdentity({ style, presentation }) {
    this.data.characterIdentity = {
      ...this.data.characterIdentity,
      ...(style ? { style } : {}),
      ...(presentation ? { presentation } : {}),
    };
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
