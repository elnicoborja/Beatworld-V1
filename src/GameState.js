/**
 * GameState — Central game state with localStorage persistence
 * Ported from V1 use-game-state.tsx
 */

const STORAGE_KEY = 'beatworld_save_v2';

const DEFAULT_STATE = {
  playerId: crypto.randomUUID ? crypto.randomUUID() : `bw-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  playerName: 'Producer',
  // Player's home city — display string (the OSM Nominatim display_name).
  playerCity: '',
  // Structured place data from Nominatim autocomplete: { displayName, lat, lon, placeId }.
  // Null until the user picks a result from the dropdown. Used by Klaviyo
  // (post-launch) + Google Maps deep links + the share artifact v1.1.
  playerCityData: null,
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
  tracks: {},
  soundSystem: [],
  unlockedPieces: [],
  completedLevels: [],
  audioPrefs: {
    variants: { kick: 0, snare: 0, hihat: 0, bass: 0 },
    chordProgression: 0,
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
        let migratedStyle = parsed.style ?? parsed.character;
        let migratedPresentation = parsed.presentation;
        if (!migratedStyle && parsed.characterParts) migratedStyle = parsed.characterParts.head;
        if (!VALID_STYLES.includes(migratedStyle)) migratedStyle = 'boombap';
        if (migratedPresentation === 'nb') migratedPresentation = 'f';
        if (!VALID_PRESENTATIONS.includes(migratedPresentation)) migratedPresentation = 'm';
        merged.style = migratedStyle;
        merged.presentation = migratedPresentation;

        if (merged.tracks && typeof merged.tracks === 'object') {
          for (const cityId of Object.keys(merged.tracks)) {
            const t = merged.tracks[cityId];
            if (Array.isArray(t)) {
              merged.tracks[cityId] = {
                grid: t,
                beatName: 'UNTITLED BEAT',
                bpm: 0, chordProgression: 0, chordProgressionName: '',
                variants: {}, mixSnapshot: null, rating: null,
                createdAt: '',
                producerName: merged.playerName || 'PRODUCER',
                cityId,
                density: 0,
              };
            }
          }
        }

        delete merged.characterParts;
        if (typeof merged.character === 'string') delete merged.character;
        return merged;
      }
    } catch (e) {
      console.warn('Failed to load save:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  _save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data)); }
    catch (e) { console.warn('Failed to save:', e); }
    this._notify();
  }

  _notify() { for (const fn of this.listeners) fn(this.data); }

  onChange(fn) { this.listeners.add(fn); return () => this.listeners.delete(fn); }

  update(partial) { Object.assign(this.data, partial); this._save(); }

  setCurrentCity(cityId) { this.data.currentCity = cityId; this._save(); }

  completeCity(cityId, cloutReward = 100) {
    if (this.data.completedCities.includes(cityId)) return;
    this.data.completedCities.push(cityId);
    this.data.clout += cloutReward;
    this.data.currentLevel = Math.min(5, 1 + Math.floor(this.data.completedCities.length / 3));
    this._save();
  }

  saveTrack(cityId, trackData) {
    if (Array.isArray(trackData)) {
      this.data.tracks[cityId] = {
        grid: trackData,
        beatName: this.data.tracks[cityId]?.beatName || 'UNTITLED BEAT',
        bpm: 0, chordProgression: 0, chordProgressionName: '',
        variants: {}, mixSnapshot: null, rating: null,
        createdAt: new Date().toISOString(),
        producerName: this.data.playerName || 'PRODUCER',
        cityId, density: 0,
      };
    } else {
      this.data.tracks[cityId] = trackData;
    }
    this._save();
  }

  getBeat(cityId) {
    const t = this.data.tracks[cityId];
    if (!t) return null;
    if (Array.isArray(t)) {
      return { grid: t, beatName: 'UNTITLED BEAT', cityId, rating: null,
               bpm: 0, chordProgression: 0, chordProgressionName: '',
               variants: {}, mixSnapshot: null, createdAt: '',
               producerName: this.data.playerName || 'PRODUCER', density: 0 };
    }
    return t;
  }

  getLatestBeat() {
    const all = Object.values(this.data.tracks)
      .map(t => Array.isArray(t) ? null : t)
      .filter(Boolean)
      .filter(b => b && b.createdAt);
    if (!all.length) return null;
    all.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return all[0];
  }

  setBeatRating(cityId, rating) {
    const t = this.data.tracks[cityId];
    if (!t || Array.isArray(t)) return;
    t.rating = rating;
    this._save();
  }

  unlockSoundSystemPart(partName) {
    if (!this.data.soundSystem.includes(partName)) {
      this.data.soundSystem.push(partName);
      this._save();
    }
  }

  isCityCompleted(cityId) { return this.data.completedCities.includes(cityId); }
  isCityUnlocked(cityId) { return true; }

  reset() {
    const id = this.data.playerId;
    this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.data.playerId = id;
    this._save();
  }

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
    // May 1 demo gate: only L1 + L2 are playable. L3-L6 are COMING SOON
    // regardless of progression — the locked-card preview modal handles them.
    if (level === 1) return true;
    if (level === 2) return this.data.completedLevels.includes(1);
    return false;
  }

  isLevelCompleted(level) { return this.data.completedLevels.includes(level); }

  setVariant(instrumentType, variantIndex) {
    if (!this.data.audioPrefs.variants) this.data.audioPrefs.variants = {};
    this.data.audioPrefs.variants[instrumentType] = variantIndex;
    this._save();
  }

  setChordProgression(index) { this.data.audioPrefs.chordProgression = index; this._save(); }

  setMixMaster(db) { this.data.audioPrefs.mix.master = db; this._save(); }
  setMixTrackVol(type, db) { this.data.audioPrefs.mix.trackVol[type] = db; this._save(); }
  setMixReverbSend(type, level) { this.data.audioPrefs.mix.reverbSend[type] = level; this._save(); }
  setMixDelaySend(type, level) { this.data.audioPrefs.mix.delaySend[type] = level; this._save(); }
  setMixReverbWet(level) { this.data.audioPrefs.mix.reverbWet = level; this._save(); }
  setMixDelayWet(level) { this.data.audioPrefs.mix.delayWet = level; this._save(); }

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

  setPlayerCity(city) {
    this.data.playerCity = (city || '').trim().slice(0, 80);
    this._save();
  }

  // Structured place data from the OSM Nominatim autocomplete dropdown.
  // Stored separately from playerCity so freely-typed values (when the
  // player skips the dropdown) don't poison structured fields.
  setPlayerCityData(data) {
    if (!data || typeof data !== 'object') { this.data.playerCityData = null; this._save(); return; }
    this.data.playerCityData = {
      displayName: String(data.displayName || '').slice(0, 200),
      lat: Number.isFinite(data.lat) ? data.lat : null,
      lon: Number.isFinite(data.lon) ? data.lon : null,
      placeId: data.placeId || null,
    };
    this._save();
  }

  getPlayerCityMapsUrl() {
    if (!this.data.playerCity) return '';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.data.playerCity)}`;
  }

  hasOnboarded() {
    return !!this.data.playerName && this.data.playerName !== 'Producer';
  }

  addClout(amount) { this.data.clout = (this.data.clout || 0) + amount; this._save(); }
}
