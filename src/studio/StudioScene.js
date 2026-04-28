/**
 * StudioScene — half-screen layout: backdrop on top, sequencer on bottom.
 *
 * Sequencer panel includes:
 *   - 4 chord-progression buttons (BOOM BAP / G-FUNK / TRAP / SOUL LOOP)
 *   - 4-cell sequencer grid per instrument
 *   - Variant picker (1/2/3/4) next to each instrument label
 *   - PLAY / CLEAR / FINISH controls
 *
 * Calls audioEngine.loadLevel('level-01-nyc') in the background on mount.
 * Variant pickers show 'LOADING' until loadLevel() resolves, then mark each
 * slot 'sample' or 'synth' so the player knows what's playing.
 */
import { CITIES } from '../GameData.js';
import { CHORD_PROGRESSIONS } from './AudioEngine.js';
import { mountSoundOsFooter } from '../ui/SoundOsFooter.js';

const TRACK_COLORS = {
  kick: '#ff3344', snare: '#ff8800', hihat: '#00ddff', perc: '#44cc00',
  bass: '#aa44ff', lead: '#ff3399', chord: '#3366ff', arp: '#00ccaa',
  pad: '#6688ff', fx: '#ff66aa',
};

// Map level cityId to audio asset bundle id
const LEVEL_AUDIO_ID = {
  'new-york': 'level-01-nyc',
};

export class StudioScene {
  // Constructor signature is unchanged so main.js doesn't need a touch.
  constructor(scene, camera, gameState, audioEngine) {
    this.scene = scene;
    this.camera = camera;
    this.gameState = gameState;
    this.audioEngine = audioEngine;

    this.cityId = null;
    this.city = null;
    this.instruments = [];
    this.grid = [];
    this.totalSteps = 16;
    this.currentStep = -1;
    this.playing = false;

    this.el = null;
    this.gridCells = [];
    this.variantButtons = {}; // type → HTMLButtonElement[]
    this.chordButtons = [];
  }

  loadCity(cityId) {
    this.cityId = cityId;
    this.city = CITIES[cityId];
    if (!this.city) return;

    this.instruments = this.city.instruments.slice(0, this.city.numInstruments);
    this.totalSteps = 16;
    this.audioEngine.setGenre(this.city.genre);
    this.audioEngine.setBpm(this.city.defaultBpm || 90);

    const saved = this.gameState.data.tracks[cityId];
    if (saved && saved.length === this.instruments.length) {
      this.grid = saved.map(row => [...row]);
    } else {
      this.grid = this.instruments.map(() => new Array(this.totalSteps).fill(false));
    }

    // Restore audio prefs into engine
    this.audioEngine.setAudioPrefs(this.gameState.data.audioPrefs);

    // Kick off background sample load (no await — UI renders immediately)
    const audioId = LEVEL_AUDIO_ID[cityId];
    if (audioId) {
      this.audioEngine.loadLevel(audioId).then(() => this._refreshVariantStatus());
    }
  }

  show() {
    const container = document.getElementById('screen-container');
    this.el = document.createElement('div');
    this.el.className = 'scene-overlay';
    this.el.style.cssText = 'background:#0a0a1e;';

    // ── Top half: studio backdrop ────────────────────────────
    const top = document.createElement('div');
    top.style.cssText = `
      position:absolute; top:0; left:0; right:0; height:50%;
      background:#0a0a1e center/cover no-repeat;
      overflow:hidden;
    `;
    const bgImg = new Image();
    bgImg.src = '/assets/sprites/venues/studio-nyc.png';
    bgImg.style.cssText = 'width:100%; height:100%; object-fit:cover; image-rendering:pixelated; display:block;';
    bgImg.onload = () => top.appendChild(bgImg);
    bgImg.onerror = () => {
      const ph = document.createElement('div');
      ph.className = 'sprite-placeholder';
      ph.style.cssText = 'width:100%; height:100%; font-size:14px;';
      ph.textContent = '[STUDIO BACKDROP — NYC]';
      top.appendChild(ph);
    };
    this.el.appendChild(top);

    // ── Bottom half: sequencer panel ─────────────────────────
    const panel = document.createElement('div');
    panel.style.cssText = `
      position:absolute; bottom:0; left:0; right:0; height:50%;
      background:linear-gradient(180deg, rgba(10,10,30,0.96), rgba(10,10,30,1));
      border-top:2px solid #ff3399;
      box-shadow: 0 -8px 24px rgba(255,51,153,0.25), inset 0 1px 0 #00ddff;
      padding:12px 16px; overflow-y:auto;
      font-family:'Press Start 2P', monospace;
    `;
    panel.appendChild(this._buildHeader());
    panel.appendChild(this._buildChordPicker());
    panel.appendChild(this._buildSequencer());

    this.el.appendChild(panel);
    this.el.appendChild(this._buildPersistentExitButton());
    container.appendChild(this.el);

    // Update HUD
    document.getElementById('hud-city').textContent = this.city.name.toUpperCase();

    mountSoundOsFooter(this.el);
  }

  // Persistent fixed-position LEVELS button — gates an unsaved beat
  // behind a confirm modal so the player doesn't lose work by accident.
  _buildPersistentExitButton() {
    const btn = document.createElement('button');
    btn.className = 'pixel-btn cyan';
    btn.textContent = '← LEVELS';
    btn.style.cssText = `
      position:fixed; top:12px; left:12px; z-index:100;
      font-family:'Press Start 2P', monospace; font-size:8px;
      padding:8px 12px;
    `;
    btn.addEventListener('click', () => this._openExitConfirmModal());
    return btn;
  }

  _openExitConfirmModal() {
    document.getElementById('studio-exit-modal')?.remove();
    const modal = document.createElement('div');
    modal.id = 'studio-exit-modal';
    modal.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.85);
      display:flex; align-items:center; justify-content:center; z-index:9999;
      font-family:'Press Start 2P', monospace;
    `;
    modal.innerHTML = `
      <div style="
        background:#0a0a1e; border:2px solid #ff3344; padding:28px;
        max-width:440px; box-shadow: 0 0 32px #ff3344;
        display:flex; flex-direction:column; gap:18px; text-align:center;
      ">
        <div style="font-size:13px; color:#ff3344; text-shadow: 0 0 8px #ff3344; letter-spacing:2px;">
          ABANDON THIS BEAT?
        </div>
        <div style="font-size:8px; color:#aaa; line-height:1.7;">
          PROGRESS WILL BE LOST.
        </div>
        <div style="display:flex; gap:10px; justify-content:center;">
          <button class="pixel-btn danger" id="exit-yes" style="font-size:9px; padding:10px 16px;">YES, EXIT</button>
          <button class="pixel-btn primary" id="exit-no" style="font-size:9px; padding:10px 16px;">KEEP COOKING</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('#exit-yes').addEventListener('click', () => {
      modal.remove();
      this.audioEngine.stopChordLoop();
      this.audioEngine.stopSequencer();
      window.__beatworld.backToLevels();
    });
    modal.querySelector('#exit-no').addEventListener('click', () => modal.remove());
  }

  _buildHeader() {
    const header = document.createElement('div');
    header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;';
    header.innerHTML = `
      <div>
        <span style="color:#ffaa00;font-size:9px;">${this.city.emoji} ${this.city.name.toUpperCase()}</span>
        <span style="color:#888;font-size:6px;margin-left:8px;">${this.city.genre} · ${this.city.defaultBpm || 90} BPM</span>
      </div>
      <div style="display:flex;gap:6px;">
        <button class="pixel-btn primary" id="btn-play"  style="font-size:7px;padding:6px 12px;">▶ PLAY</button>
        <button class="pixel-btn secondary" id="btn-clear" style="font-size:7px;padding:6px 12px;">CLEAR</button>
        <button class="pixel-btn magenta" id="btn-finish" style="font-size:8px;padding:8px 14px;">✓ FINISH ▶</button>
        <button class="pixel-btn danger" id="btn-back"  style="font-size:7px;padding:6px 12px;">← LEVELS</button>
      </div>
    `;
    header.querySelector('#btn-play').addEventListener('click', () => this._togglePlay());
    header.querySelector('#btn-clear').addEventListener('click', () => this._clearGrid());
    header.querySelector('#btn-finish').addEventListener('click', () => this._finishBeat());
    header.querySelector('#btn-back').addEventListener('click', () => {
      this._stopAll();
      window.__beatworld.backToLevels();
    });
    return header;
  }

  _buildChordPicker() {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display:grid; grid-template-columns:auto 1fr; gap:10px;
      align-items:center; padding:8px 0; margin-bottom:10px;
      border-bottom:1px dashed #333;
    `;
    const label = document.createElement('div');
    label.style.cssText = 'font-size:7px; color:#00ddff; letter-spacing:1px;';
    label.innerHTML = 'CHORD<br/>STYLE';
    wrap.appendChild(label);

    const buttons = document.createElement('div');
    buttons.style.cssText = 'display:flex; gap:6px; flex-wrap:wrap;';
    this.chordButtons = [];
    const selected = this.gameState.data.audioPrefs.chordProgression || 0;
    CHORD_PROGRESSIONS.forEach((cp, idx) => {
      const btn = document.createElement('button');
      btn.className = 'pixel-btn';
      btn.dataset.idx = idx;
      btn.style.cssText = `
        font-size:8px; padding:8px 12px;
        background:${idx === selected ? '#ff3399' : '#1a1a3e'};
        color:${idx === selected ? '#fff' : '#888'};
        border:2px solid ${idx === selected ? '#ff3399' : '#333'};
        box-shadow:${idx === selected ? '0 0 8px #ff3399' : '2px 2px 0 #000'};
      `;
      btn.textContent = cp.name;
      btn.addEventListener('click', () => this._selectChord(idx));
      buttons.appendChild(btn);
      this.chordButtons.push(btn);
    });
    wrap.appendChild(buttons);
    return wrap;
  }

  _selectChord(idx) {
    this.audioEngine.setChordProgression(idx);
    this.gameState.setChordProgression(idx);
    this.chordButtons.forEach((btn, i) => {
      const on = (i === idx);
      btn.style.background = on ? '#ff3399' : '#1a1a3e';
      btn.style.color      = on ? '#fff'    : '#888';
      btn.style.borderColor = on ? '#ff3399' : '#333';
      btn.style.boxShadow   = on ? '0 0 8px #ff3399' : '2px 2px 0 #000';
    });
  }

  _buildSequencer() {
    const grid = document.createElement('div');
    // 1 col label + 1 col variant picker + 16 step cols
    grid.style.cssText = `
      display:grid; gap:3px; overflow-x:auto;
      grid-template-columns:80px 130px repeat(${this.totalSteps}, 1fr);
    `;
    this.gridCells = [];
    this.variantButtons = {};

    for (let trackIdx = 0; trackIdx < this.instruments.length; trackIdx++) {
      const inst = this.instruments[trackIdx];
      const trackColor = TRACK_COLORS[inst.type] || '#888';

      // Label cell
      const label = document.createElement('div');
      label.style.cssText = `
        font-size:6px; color:${trackColor}; display:flex; align-items:center;
        padding:2px 4px; white-space:nowrap;
      `;
      label.textContent = inst.name.toUpperCase();
      grid.appendChild(label);

      // Variant picker cell (4 small buttons)
      grid.appendChild(this._buildVariantPicker(inst.type, trackColor));

      // Step cells
      const rowCells = [];
      const selectedVariant = this.gameState.data.audioPrefs.variants[inst.type] || 0;
      for (let stepIdx = 0; stepIdx < this.totalSteps; stepIdx++) {
        const cell = document.createElement('div');
        const isBeat = stepIdx % 4 === 0;
        const active = this.grid[trackIdx][stepIdx];
        cell.style.cssText = `
          width:100%; min-width:18px; height:22px; cursor:pointer;
          border:1px solid ${isBeat ? '#444' : '#222'};
          background:${active ? trackColor : (isBeat ? '#1e3050' : '#1a2a4a')};
          opacity:${active ? 1 : 0.6};
          transition:background 0.1s;
        `;
        cell.addEventListener('click', () => {
          this.grid[trackIdx][stepIdx] = !this.grid[trackIdx][stepIdx];
          const isOn = this.grid[trackIdx][stepIdx];
          cell.style.background = isOn ? trackColor : (isBeat ? '#1e3050' : '#1a2a4a');
          cell.style.opacity = isOn ? 1 : 0.6;
          if (isOn) {
            // Preview using the active variant
            const variantIdx = this.gameState.data.audioPrefs.variants[inst.type] || 0;
            if (['kick','snare','hihat','perc'].includes(inst.type)) {
              this.audioEngine.triggerInstrument(inst.type, variantIdx);
            } else if (inst.type === 'bass') {
              this.audioEngine.triggerInstrument('bass', variantIdx, undefined, this.audioEngine._bassNoteForStep(stepIdx));
            } else {
              this.audioEngine.playSynth(inst.type, stepIdx % 8, undefined, 0.6, trackIdx);
            }
          }
        });
        grid.appendChild(cell);
        rowCells.push(cell);
      }
      this.gridCells.push(rowCells);
    }

    // Guest producer quote (kept from V1)
    const wrapper = document.createElement('div');
    wrapper.appendChild(grid);
    if (this.city.guestProducer) {
      const quote = document.createElement('div');
      quote.style.cssText = 'margin-top:10px; font-size:6px; color:#888; text-align:center; padding:6px; border-top:1px solid #333;';
      quote.textContent = `"${this.city.guestProducer.quote}" — ${this.city.guestProducer.name}`;
      wrapper.appendChild(quote);
    }
    return wrapper;
  }

  _buildVariantPicker(instType, trackColor) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex; gap:2px; align-items:center; padding:0 4px;';
    const buttons = [];
    const selected = this.gameState.data.audioPrefs.variants[instType] || 0;
    for (let i = 0; i < 4; i++) {
      const btn = document.createElement('button');
      btn.dataset.idx = i;
      btn.dataset.type = instType;
      btn.title = `${instType} variant ${i + 1}`;
      btn.style.cssText = `
        font-family:'Press Start 2P', monospace; font-size:7px;
        padding:4px 6px; cursor:pointer;
        background:${i === selected ? trackColor : '#1a1a3e'};
        color:${i === selected ? '#000' : '#888'};
        border:1px solid ${i === selected ? trackColor : '#333'};
      `;
      btn.textContent = String(i + 1);
      btn.addEventListener('click', () => this._selectVariant(instType, i, trackColor));
      wrap.appendChild(btn);
      buttons.push(btn);
    }
    this.variantButtons[instType] = buttons;
    return wrap;
  }

  _selectVariant(type, idx, trackColor) {
    this.audioEngine.setVariant(type, idx);
    this.gameState.setVariant(type, idx);
    this.variantButtons[type].forEach((btn, i) => {
      const on = (i === idx);
      btn.style.background  = on ? trackColor : '#1a1a3e';
      btn.style.color       = on ? '#000'     : '#888';
      btn.style.borderColor = on ? trackColor : '#333';
    });
    this._refreshVariantStatus();
  }

  _refreshVariantStatus() {
    // Re-tag each button with sample/synth state once loadLevel resolves.
    for (const type of Object.keys(this.variantButtons)) {
      const buttons = this.variantButtons[type];
      buttons.forEach((btn, i) => {
        const status = this.audioEngine.getVariantStatus(type, i);
        if (status === 'synth') {
          btn.title = `${type} variant ${i + 1} — synth fallback (sample missing)`;
          // Tiny visual cue: small dot in the corner
          btn.textContent = `${i + 1}*`;
        } else if (status === 'sample') {
          btn.title = `${type} variant ${i + 1} — MP3 sample`;
          btn.textContent = String(i + 1);
        } else {
          btn.title = `${type} variant ${i + 1} — loading…`;
        }
      });
    }
  }

  _togglePlay() {
    const btn = this.el.querySelector('#btn-play');
    this.playing = this.audioEngine.toggleSequencer(
      this.grid, this.instruments, (step) => this._onStep(step)
    );
    if (this.playing) {
      this.audioEngine.startChordLoop();
      btn.textContent = '■ STOP';
    } else {
      this.audioEngine.stopChordLoop();
      btn.textContent = '▶ PLAY';
    }
  }

  _onStep(stepIdx) {
    this.currentStep = stepIdx;
    for (let t = 0; t < this.gridCells.length; t++) {
      for (let s = 0; s < this.gridCells[t].length; s++) {
        const cell = this.gridCells[t][s];
        const active = this.grid[t][s];
        const isCurrent = s === stepIdx;
        const isBeat = s % 4 === 0;
        const trackColor = TRACK_COLORS[this.instruments[t]?.type] || '#888';
        if (isCurrent) {
          cell.style.background = active ? '#ffffff' : '#334466';
          cell.style.opacity = '1';
        } else {
          cell.style.background = active ? trackColor : (isBeat ? '#1e3050' : '#1a2a4a');
          cell.style.opacity = active ? '1' : '0.6';
        }
      }
    }
  }

  _clearGrid() {
    this.grid = this.instruments.map(() => new Array(this.totalSteps).fill(false));
    for (let t = 0; t < this.gridCells.length; t++) {
      for (let s = 0; s < this.gridCells[t].length; s++) {
        const isBeat = s % 4 === 0;
        this.gridCells[t][s].style.background = isBeat ? '#1e3050' : '#1a2a4a';
        this.gridCells[t][s].style.opacity = '0.6';
      }
    }
  }

  _finishBeat() {
    // Persist track + audioPrefs are already saved per-click
    this.gameState.saveTrack(this.cityId, this.grid);
    this._stopAll();
    window.__beatworld.finishBeat();
  }

  _stopAll() {
    this.audioEngine.stopSequencer();
    this.audioEngine.stopChordLoop();
    this.playing = false;
  }

  hide() {
    if (this.el) { this.el.remove(); this.el = null; }
    document.getElementById('studio-exit-modal')?.remove();
    this._stopAll();
    this.gridCells = [];
    this.variantButtons = {};
    this.chordButtons = [];
  }

  update() {
    // No 3D viz in V2 — sequencer is pure HTML. Kept for future.
  }
}
