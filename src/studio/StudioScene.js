/**
 * StudioScene — DAW-style sequencer panel.
 *
 * Layout (top → bottom):
 *   1. Backdrop (50% height) with friend speech bubble
 *   2. Mixer chrome strip (decorative, mimics top of analog mixer)
 *   3. Header (city · BPM · transport buttons)
 *   4. Chord style picker (quantized to bar boundary on swap)
 *   5. Beat tracking bar with downbeat markers + playhead + loop position
 *   6. Track strips (one per instrument, ~64px tall):
 *      [NAME · S · M · VOL] [VARIANTS 1234] [STEP CELLS x16]
 *   7. Mixer panel (collapsible — reverb/delay sends + master + bus returns)
 *
 * Key behaviors:
 *   - Cell clicks toggle silently (no preview audio).
 *   - Chord swap is QUEUED to next bar 0 by the audio engine.
 *   - Solo wins over mute, multi-solo allowed.
 *   - Pixel-art rectangular faders (custom CSS injected once).
 */
import { CITIES } from '../GameData.js';
import { mountSoundOsFooter } from '../ui/SoundOsFooter.js';

const TRACK_COLORS = {
  kick: '#ff3344', snare: '#ff8800', hihat: '#00ddff', perc: '#44cc00',
  bass: '#aa44ff', lead: '#ff3399', chord: '#3366ff', arp: '#00ccaa',
  pad: '#6688ff', fx: '#ff66aa',
};

const LEVEL_AUDIO_ID = {
  'new-york':    'level-01-nyc',
  'puerto-rico': 'level-02-pr',
};

const DEFAULT_CHORD_NAMES = ['BOOM BAP', 'G-FUNK', 'TRAP', 'SOUL LOOP'];

const FRIEND_TIPS = [
  'CHOP THE SAMPLE,\nDON\'T LOOP IT.',
  'KICK ON 1 AND 9,\nSNARE ON 5 AND 13.',
  'OPEN HATS ARE LIKE\nSALT — A LITTLE GOES FAR.',
  'TURN UP THE BASS\nUNTIL THE WALLS COMPLAIN.',
  'BREAK THE GRID\nONCE PER LOOP.',
  'TRY MORE REVERB\nON THE SNARE.',
];

// Cell + lane sizing — bumped from V1 (22px) to ~64px for finger-friendly tap.
const LANE_HEIGHT = 110;
const STEP_CELL_HEIGHT = 44;

// One-shot CSS injection so we get pixel-art rectangular fader thumbs across
// all <input type=range> elements inside the studio.
function injectFaderStyles() {
  if (document.getElementById('bw-fader-styles')) return;
  const style = document.createElement('style');
  style.id = 'bw-fader-styles';
  style.textContent = `
    .bw-fader { -webkit-appearance: none; appearance: none; height: 14px;
      background: linear-gradient(180deg, #0a0a1e 0%, #1a1a3e 50%, #0a0a1e 100%);
      border: 2px solid #000; border-radius: 0;
      box-shadow: inset 0 1px 0 #333, inset 0 -1px 0 #555;
      cursor: pointer; outline: none;
    }
    .bw-fader::-webkit-slider-thumb {
      -webkit-appearance: none; appearance: none;
      width: 18px; height: 26px;
      background: linear-gradient(180deg, #cccccc 0%, #888 45%, #555 55%, #aaa 100%);
      border: 2px solid #000; border-radius: 0;
      box-shadow: 0 0 0 1px #fff, 2px 2px 0 #000;
      cursor: pointer;
    }
    .bw-fader::-moz-range-thumb {
      width: 18px; height: 26px;
      background: linear-gradient(180deg, #cccccc 0%, #888 45%, #555 55%, #aaa 100%);
      border: 2px solid #000; border-radius: 0;
      box-shadow: 0 0 0 1px #fff, 2px 2px 0 #000;
      cursor: pointer;
    }
    .bw-fader-cyan::-webkit-slider-thumb { background: linear-gradient(180deg, #aaffff 0%, #00ddff 45%, #0099bb 55%, #66e5ff 100%); }
    .bw-fader-cyan::-moz-range-thumb     { background: linear-gradient(180deg, #aaffff 0%, #00ddff 45%, #0099bb 55%, #66e5ff 100%); }
    .bw-fader-magenta::-webkit-slider-thumb { background: linear-gradient(180deg, #ffaadd 0%, #ff3399 45%, #aa1166 55%, #ff66bb 100%); }
    .bw-fader-magenta::-moz-range-thumb     { background: linear-gradient(180deg, #ffaadd 0%, #ff3399 45%, #aa1166 55%, #ff66bb 100%); }
    .bw-fader-yellow::-webkit-slider-thumb { background: linear-gradient(180deg, #ffe599 0%, #ffaa00 45%, #aa6600 55%, #ffcc44 100%); }
    .bw-fader-yellow::-moz-range-thumb     { background: linear-gradient(180deg, #ffe599 0%, #ffaa00 45%, #aa6600 55%, #ffcc44 100%); }

    .bw-tbtn {
      width: 22px; height: 22px;
      font-family: 'Press Start 2P', monospace; font-size: 7px;
      background: #1a1a3e; color: #888;
      border: 2px solid #333; cursor: pointer;
      box-shadow: 2px 2px 0 #000;
      display: flex; align-items: center; justify-content: center;
      padding: 0;
    }
    .bw-tbtn.on-mute { background: #ff8800; color: #0a0a1e; border-color: #ff8800; box-shadow: 0 0 6px #ff8800, 2px 2px 0 #000; }
    .bw-tbtn.on-solo { background: #00cc44; color: #0a0a1e; border-color: #00cc44; box-shadow: 0 0 6px #00cc44, 2px 2px 0 #000; }
  `;
  document.head.appendChild(style);
}

export class StudioScene {
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
    this.variantButtons = {};
    this.chordButtons = [];
    this.tipBubble = null;
    this.tipTimer = null;
    this.tipIdx = 0;
    this.mixerExpanded = false;
    this.beatName = '';

    // New refs
    this.beatBarCells = [];     // step cells in the tracking bar (highlighted by playhead)
    this.loopPosEl = null;      // textual position display (BAR 1.1.1 etc)
    this.loopCount = 0;         // sequencer wraps since PLAY (used for 4-bar chord cycle indicator)
    this.muteButtons = {};      // type → button el
    this.soloButtons = {};      // type → button el
    this.trackVolFaders = {};   // type → input el
  }

  loadCity(cityId) {
    this.cityId = cityId;
    this.city = CITIES[cityId];
    if (!this.city) return;

    this.instruments = this.city.instruments.slice(0, this.city.numInstruments);
    this.totalSteps = 16;
    this.audioEngine.setGenre(this.city.genre);
    this.audioEngine.setBpm(this.city.defaultBpm || 90);

    const savedBeat = this.gameState.getBeat(cityId);
    const savedGrid = savedBeat?.grid;
    if (savedGrid && savedGrid.length === this.instruments.length) {
      this.grid = savedGrid.map(row => [...row]);
    } else {
      this.grid = this.instruments.map(() => new Array(this.totalSteps).fill(false));
    }
    this.beatName = savedBeat?.beatName || '';

    this.audioEngine.setAudioPrefs(this.gameState.data.audioPrefs);

    const audioId = LEVEL_AUDIO_ID[cityId];
    if (audioId) {
      this.audioEngine.loadLevel(audioId).then(() => this._refreshVariantStatus());
    }
  }

  show() {
    injectFaderStyles();

    const container = document.getElementById('screen-container');
    this.el = document.createElement('div');
    this.el.className = 'scene-overlay';
    this.el.style.cssText = 'background:#0a0a1e;';

    // Top half: backdrop + tip bubble
    const top = document.createElement('div');
    top.style.cssText = `
      position:absolute; top:0; left:0; right:0; height:50%;
      background:#0a0a1e center/cover no-repeat; overflow:hidden;
    `;
    const bgImg = new Image();
    bgImg.src = this.city.studioBackdrop || '/assets/sprites/venues/studio-nyc.png';
    bgImg.style.cssText = 'width:100%; height:100%; object-fit:cover; image-rendering:pixelated; display:block;';
    bgImg.onload = () => top.appendChild(bgImg);
    bgImg.onerror = () => {
      const ph = document.createElement('div');
      ph.className = 'sprite-placeholder';
      ph.style.cssText = 'width:100%; height:100%; font-size:14px;';
      ph.textContent = `[STUDIO BACKDROP — ${this.city.name?.toUpperCase() || 'CITY'}]`;
      top.appendChild(ph);
    };
    top.appendChild(this._buildFriendBubble());
    this.el.appendChild(top);

    // Bottom half: panel
    const panel = document.createElement('div');
    panel.style.cssText = `
      position:absolute; bottom:0; left:0; right:0; height:50%;
      background:linear-gradient(180deg, rgba(10,10,30,0.96), rgba(10,10,30,1));
      border-top:2px solid #ff3399;
      box-shadow: 0 -8px 24px rgba(255,51,153,0.25), inset 0 1px 0 #00ddff;
      padding:0 16px 12px; overflow-y:auto;
      font-family:'Press Start 2P', monospace;
    `;
    panel.appendChild(this._buildMixerChrome());        // decorative top strip (replaces quote)
    panel.appendChild(this._buildHeader());
    panel.appendChild(this._buildChordPicker());        // Simon-style 4-button cycler
    panel.appendChild(this._buildChordVolumeStrip());   // chord-loop volume always visible
    panel.appendChild(this._buildBeatTrackingBar());
    panel.appendChild(this._buildSequencer());
    panel.appendChild(this._buildMixerPanel());

    this.el.appendChild(panel);
    this.el.appendChild(this._buildPersistentExitButton());
    container.appendChild(this.el);

    document.getElementById('hud-city').textContent = this.city.name.toUpperCase();
    mountSoundOsFooter(this.el);
  }

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

  // ── MPC-style chrome strip (CHAKAI ESS2026XS) ──
  // Sprite-driven now (replaces the CSS fake-knob version). Drop a wide
  // PNG at /assets/sprites/ui/mpc-chrome.png — see prompt pack for spec.
  // Falls back to a pixel-styled placeholder strip if the asset is missing.
  _buildMixerChrome() {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      margin:0 -16px; padding:0;
      background:#0a0a1e; border-bottom:1px solid #333;
      overflow:hidden; height:96px;
      display:flex; align-items:center; justify-content:center;
    `;
    const img = new Image();
    img.src = '/assets/sprites/ui/mpc-chrome.png';
    img.style.cssText = `
      width:100%; height:100%; object-fit:cover; object-position:center;
      image-rendering:pixelated; display:none;
    `;
    img.onload = () => { img.style.display = 'block'; };
    img.onerror = () => {
      // Fallback: solid dark bar with the brand text so the layout still
      // reads "this is the top of a sampler" until the sprite ships.
      const ph = document.createElement('div');
      ph.style.cssText = `
        width:100%; height:100%;
        display:flex; align-items:center; justify-content:space-between;
        padding:0 24px; box-sizing:border-box;
        background:linear-gradient(180deg, #1a1a2e 0%, #0a0a1e 100%);
        font-family:'Press Start 2P', monospace;
      `;
      ph.innerHTML = `
        <div style="font-size:18px; color:#ffaa00; letter-spacing:3px; text-shadow: 0 0 8px #ffaa00;">CHAKAI</div>
        <div style="font-size:10px; color:#888; letter-spacing:2px;">[MPC HEADER SPRITE — drop mpc-chrome.png]</div>
        <div style="font-size:14px; color:#00ddff; letter-spacing:2px; text-shadow: 0 0 6px #00ddff;">ESS2026XS</div>
      `;
      wrap.appendChild(ph);
    };
    wrap.appendChild(img);
    return wrap;
  }

  _buildHeader() {
    const header = document.createElement('div');
    header.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin:10px 0;';
    header.innerHTML = `
      <div>
        <span style="color:#ffaa00;font-size:14px;letter-spacing:2px;text-shadow: 0 0 6px #ffaa00;">${this.city.emoji} ${this.city.name.toUpperCase()}</span>
        <span style="color:#aaa;font-size:9px;margin-left:12px;letter-spacing:1px;">${this.city.genre} · ${this.city.defaultBpm || 90} BPM</span>
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

  // ── Simon-style chord picker ──────────────────────────────
  // 4 colored circular buttons, one letter each, big and tappable while playing.
  // Active chord glows + pulses; the active chord's full name is shown to the
  // right so the player can read what's playing without parsing letters.
  _buildChordPicker() {
    // Simon-coded chord palette (red/yellow/green/blue), in slot order 0..3.
    const SIMON_COLORS = ['#ff3344', '#ffaa00', '#00cc44', '#0066ff'];

    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display:grid; grid-template-columns:auto 1fr auto; gap:14px;
      align-items:center; padding:10px 0; margin-bottom:6px;
      border-bottom:1px dashed #333;
    `;
    // Left label
    const label = document.createElement('div');
    label.style.cssText = 'font-size:7px; color:#00ddff; letter-spacing:1px; line-height:1.5;';
    label.innerHTML = 'CHORD<br/>STYLE';
    wrap.appendChild(label);

    // 4 Simon buttons in a row
    const row = document.createElement('div');
    row.style.cssText = 'display:flex; gap:14px; align-items:center; justify-content:flex-start;';
    this.chordButtons = [];
    const selected = this.gameState.data.audioPrefs.chordProgression || 0;
    const chordNames = (this.city.chordProgressionNames && this.city.chordProgressionNames.length === 4)
      ? this.city.chordProgressionNames
      : DEFAULT_CHORD_NAMES;

    // Active-name readout (right side) — updates immediately when the
    // player taps a new button, even though audio waits for bar 0.
    const nameReadout = document.createElement('div');
    nameReadout.style.cssText = `
      font-size:10px; color:#ffaa00; letter-spacing:2px;
      text-shadow: 0 0 8px #ffaa00; min-width:200px; text-align:right;
      padding:4px 10px; background:rgba(0,0,0,0.4);
      border:1px solid #ffaa00;
    `;
    nameReadout.textContent = chordNames[selected] || chordNames[0];

    chordNames.forEach((name, idx) => {
      const color = SIMON_COLORS[idx];
      const letter = (name.match(/[A-Z]/)?.[0]) || String(idx + 1);
      const btn = document.createElement('button');
      btn.dataset.idx = idx;
      btn.title = name;
      btn.style.cssText = `
        width:52px; height:52px; border-radius:50%;
        font-family:'Press Start 2P', monospace; font-size:18px;
        font-weight:bold;
        background:radial-gradient(circle at 30% 30%, ${color}ff, ${color}88 60%, #000);
        color:#fff; text-shadow: 0 0 6px #000, 2px 2px 0 #000;
        border:3px solid #000; cursor:pointer;
        box-shadow: ${idx === selected
          ? `0 0 14px ${color}, inset -3px -3px 0 rgba(0,0,0,0.5)`
          : `inset -3px -3px 0 rgba(0,0,0,0.5), 2px 2px 0 #000`};
        transition: transform 0.1s, box-shadow 0.15s;
        opacity:${idx === selected ? '1' : '0.55'};
      `;
      btn.textContent = letter;
      btn.addEventListener('mouseenter', () => { btn.style.transform = 'translate(-1px,-1px)'; });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
      btn.addEventListener('click', () => {
        this._selectChord(idx);
        nameReadout.textContent = chordNames[idx];
      });
      row.appendChild(btn);
      this.chordButtons.push(btn);
    });

    wrap.appendChild(row);
    wrap.appendChild(nameReadout);
    this._chordNameReadout = nameReadout;
    return wrap;
  }

  _selectChord(idx) {
    // Simon palette mirrors what _buildChordPicker uses (must stay in sync).
    const SIMON_COLORS = ['#ff3344', '#ffaa00', '#00cc44', '#0066ff'];
    // Quantized: defer until next bar 0 if sequencer is running.
    this.audioEngine.queueChordProgression(idx);
    this.gameState.setChordProgression(idx);
    // Visual state: active glows + full opacity, others dimmed.
    this.chordButtons.forEach((btn, i) => {
      const color = SIMON_COLORS[i];
      const on = (i === idx);
      btn.style.boxShadow = on
        ? `0 0 14px ${color}, inset -3px -3px 0 rgba(0,0,0,0.5)`
        : `inset -3px -3px 0 rgba(0,0,0,0.5), 2px 2px 0 #000`;
      btn.style.opacity = on ? '1' : '0.55';
    });
    if (this._chordNameReadout) {
      const chordNames = (this.city.chordProgressionNames && this.city.chordProgressionNames.length === 4)
        ? this.city.chordProgressionNames
        : DEFAULT_CHORD_NAMES;
      this._chordNameReadout.textContent = chordNames[idx] || '';
    }
  }

  // ── Chord-loop volume strip ───────────────────────────────
  // The chord progression is its own audio layer (Tone.Player loop) routed
  // through the chordLoop bus. Players were missing a way to balance it
  // against the drums without opening the collapsible mixer panel.
  _buildChordVolumeStrip() {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display:grid; grid-template-columns:80px 1fr 60px;
      gap:10px; align-items:center; padding:6px 0; margin-bottom:6px;
      border-bottom:1px dashed #333;
    `;
    const lab = document.createElement('div');
    lab.style.cssText = 'font-size:7px; color:#00ddff; letter-spacing:1px;';
    lab.textContent = 'CHORD VOL';
    wrap.appendChild(lab);

    const initial = this.gameState.data.audioPrefs.mix.trackVol?.chordLoop ?? -3;
    const valEl = document.createElement('div');
    valEl.style.cssText = 'font-size:6px; color:#00ddff; text-align:right;';
    valEl.textContent = `${initial.toFixed(0)} dB`;

    const fader = this._fader(-36, 6, 0.5, initial, 'bw-fader-cyan', (v) => {
      this.audioEngine.setInstrumentVolume('chordLoop', v);
      this.gameState.setMixTrackVol('chordLoop', v);
      valEl.textContent = `${v.toFixed(0)} dB`;
    });
    wrap.appendChild(fader);
    wrap.appendChild(valEl);
    return wrap;
  }

  // ── Beat tracking bar — playhead + downbeat markers + bar position ──
  _buildBeatTrackingBar() {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display:grid; grid-template-columns:152px repeat(${this.totalSteps}, 1fr);
      gap:3px; align-items:center; padding:6px 0 8px 0; margin-bottom:14px; border-bottom:1px dashed #444;
      border-bottom:1px dashed #333;
    `;

    // Single first-column cell now holds both BEAT label and position readout
    // (variant column was removed). Stacked vertically so the 88px column
    // doesn't blow out vertically.
    const labWrap = document.createElement('div');
    labWrap.style.cssText = 'display:flex; flex-direction:column; gap:2px; padding:2px 4px;';
    const lab = document.createElement('div');
    lab.style.cssText = 'font-size:6px; color:#888; letter-spacing:1px;';
    lab.textContent = '▶ BEAT';
    const pos = document.createElement('div');
    pos.style.cssText = `
      font-size:7px; color:#ffaa00; letter-spacing:1px;
      padding:1px 4px; background:rgba(0,0,0,0.4); border:1px solid #444;
      text-align:center;
    `;
    pos.textContent = '1.1.1';
    this.loopPosEl = pos;
    labWrap.appendChild(lab);
    labWrap.appendChild(pos);
    wrap.appendChild(labWrap);

    this.beatBarCells = [];
    for (let s = 0; s < this.totalSteps; s++) {
      const cell = document.createElement('div');
      const isDownbeat = s % 4 === 0;
      const beatNum = Math.floor(s / 4) + 1;
      cell.style.cssText = `
        height:18px; min-width:18px;
        display:flex; align-items:center; justify-content:center;
        background:${isDownbeat ? 'rgba(255,170,0,0.15)' : 'transparent'};
        border:1px solid ${isDownbeat ? '#666' : '#222'};
        font-size:6px; color:${isDownbeat ? '#ffaa00' : '#444'};
        letter-spacing:0;
      `;
      cell.textContent = isDownbeat ? String(beatNum) : '·';
      this.beatBarCells.push(cell);
      wrap.appendChild(cell);
    }
    return wrap;
  }

  _buildSequencer() {
    const grid = document.createElement('div');
    grid.style.cssText = `
      display:grid; gap:4px; column-gap:8px; overflow-x:auto;
      grid-template-columns:152px repeat(${this.totalSteps}, 1fr);
    `;
    this.gridCells = [];
    this.variantButtons = {};
    this.muteButtons = {};
    this.soloButtons = {};
    this.trackVolFaders = {};

    for (let trackIdx = 0; trackIdx < this.instruments.length; trackIdx++) {
      const inst = this.instruments[trackIdx];
      const trackColor = TRACK_COLORS[inst.type] || '#888';

      // Column 1 — name + S + M + inline VOL fader + variant cycle button
      // (variant lives inside the header cell now, below S/M and at the
      // end of the volume fader — no separate variant column).
      grid.appendChild(this._buildTrackHeaderCell(inst, trackColor));

      // Columns 2..N — step cells, taller
      const rowCells = [];
      for (let stepIdx = 0; stepIdx < this.totalSteps; stepIdx++) {
        const cell = document.createElement('div');
        const isBeat = stepIdx % 4 === 0;
        const active = this.grid[trackIdx][stepIdx];
        cell.style.cssText = `
          width:100%; min-width:28px; height:${STEP_CELL_HEIGHT}px; cursor:pointer;
          border:1px solid ${isBeat ? '#444' : '#222'};
          background:${active ? trackColor : (isBeat ? '#1e3050' : '#1a2a4a')};
          opacity:${active ? 1 : 0.6};
          transition:background 0.1s, opacity 0.1s;
        `;
        cell.addEventListener('click', () => {
          // Silent toggle — no preview audio.
          this.grid[trackIdx][stepIdx] = !this.grid[trackIdx][stepIdx];
          const isOn = this.grid[trackIdx][stepIdx];
          cell.style.background = isOn ? trackColor : (isBeat ? '#1e3050' : '#1a2a4a');
          cell.style.opacity = isOn ? 1 : 0.6;
        });
        grid.appendChild(cell);
        rowCells.push(cell);
      }
      this.gridCells.push(rowCells);
    }

    return grid;
  }

  _buildTrackHeaderCell(inst, trackColor) {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display:grid; grid-template-rows: auto auto auto; gap:6px;
      padding:6px 6px; min-height:${LANE_HEIGHT}px;
      box-sizing:border-box; border-left:3px solid ${trackColor}; border-right:4px solid #ff3399;
      background:rgba(255,255,255,0.02);
      align-content:center;
    `;
    // Row 1 — track name (left) + variant cycle button (right).
    // justify-content: space-between pins them to opposite edges so the
    // variant always sits at the end of the name row regardless of name length.
    const row1 = document.createElement('div');
    row1.style.cssText = 'display:flex; align-items:center; justify-content:space-between; gap:8px; padding-right:6px;';
    const nameEl = document.createElement('div');
    nameEl.style.cssText = `
      font-size:8px; color:${trackColor}; letter-spacing:1px;
      text-shadow: 0 0 4px ${trackColor}66;
      flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    `;
    nameEl.textContent = inst.name.toUpperCase();
    row1.appendChild(nameEl);
    row1.appendChild(this._buildVariantButton(inst.type, trackColor));
    wrap.appendChild(row1);

    // Row 2 — [S] [M] left-aligned on their own dedicated row
    const row2controls = document.createElement('div');
    row2controls.style.cssText = 'display:flex; align-items:center; gap:6px;';
    const muted = this.audioEngine.isMuted?.(inst.type);
    const soloed = this.audioEngine.isSoloed?.(inst.type);

    const sBtn = document.createElement('button');
    sBtn.className = `bw-tbtn${soloed ? ' on-solo' : ''}`;
    sBtn.textContent = 'S';
    sBtn.title = `Solo ${inst.name}`;
    sBtn.addEventListener('click', () => this._toggleSolo(inst.type, sBtn));

    const mBtn = document.createElement('button');
    mBtn.className = `bw-tbtn${muted ? ' on-mute' : ''}`;
    mBtn.textContent = 'M';
    mBtn.title = `Mute ${inst.name}`;
    mBtn.addEventListener('click', () => this._toggleMute(inst.type, mBtn));

    row2controls.appendChild(sBtn);
    row2controls.appendChild(mBtn);
    this.soloButtons[inst.type] = sBtn;
    this.muteButtons[inst.type] = mBtn;
    wrap.appendChild(row2controls);

    // Row 3 — volume fader spans the full width of the cell
    const row3vol = document.createElement('div');
    row3vol.style.cssText = 'display:flex; align-items:center;';
    const vol = this.gameState.data.audioPrefs.mix.trackVol?.[inst.type] ?? 0;
    const volFader = document.createElement('input');
    volFader.type = 'range';
    volFader.min = '-36'; volFader.max = '6'; volFader.step = '0.5';
    volFader.value = String(vol);
    volFader.className = 'bw-fader';
    volFader.style.cssText = 'width:100%;';
    volFader.title = `Track volume: ${vol.toFixed(0)} dB`;
    volFader.addEventListener('input', () => {
      const v = parseFloat(volFader.value);
      this.audioEngine.setInstrumentVolume(inst.type, v);
      this.gameState.setMixTrackVol(inst.type, v);
      volFader.title = `Track volume: ${v.toFixed(0)} dB`;
    });
    row3vol.appendChild(volFader);
    this.trackVolFaders[inst.type] = volFader;
    wrap.appendChild(row3vol);

    return wrap;
  }

  // Compact 32×32 Simon-cycle variant button — used inline inside the
  // track header cell (replaces the old separate variant column).
  _buildVariantButton(instType, trackColor) {
    const SIMON_COLORS = ['#ff3344', '#ffaa00', '#00cc44', '#0066ff'];
    const selected = this.gameState.data.audioPrefs.variants[instType] || 0;
    const btn = document.createElement('button');
    btn.dataset.type = instType;
    const renderBtn = (idx) => {
      const color = SIMON_COLORS[idx];
      btn.style.cssText = `
        width:28px; height:28px; border-radius:50%;
        font-family:'Press Start 2P', monospace; font-size:10px; font-weight:bold;
        background:radial-gradient(circle at 30% 30%, ${color}ff, ${color}88 60%, #000);
        color:#fff; text-shadow: 0 0 4px #000, 1px 1px 0 #000;
        border:2px solid #000; cursor:pointer; padding:0;
        box-shadow: 0 0 4px 88, inset -2px -2px 0 rgba(0,0,0,0.5), 1px 1px 0 #000;
        transition: transform 0.08s, box-shadow 0.15s;
      `;
      btn.textContent = String(idx + 1);
      btn.dataset.idx = idx;
      btn.title = `${instType} variant ${idx + 1} — tap to cycle`;
    };
    renderBtn(selected);
    btn.addEventListener('mouseenter', () => { btn.style.transform = 'translate(-1px,-1px)'; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    btn.addEventListener('click', () => {
      const cur = parseInt(btn.dataset.idx || '0', 10);
      const next = (cur + 1) % 4;
      this._selectVariant(instType, next, trackColor);
      renderBtn(next);
    });
    this.variantButtons[instType] = [btn];
    this._variantRender = this._variantRender || {};
    this._variantRender[instType] = renderBtn;
    return btn;
  }

  _toggleMute(type, btn) {
    const next = !this.audioEngine.isMuted?.(type);
    this.audioEngine.setMute(type, next);
    btn.classList.toggle('on-mute', next);
  }

  _toggleSolo(type, btn) {
    const next = !this.audioEngine.isSoloed?.(type);
    this.audioEngine.setSolo(type, next);
    btn.classList.toggle('on-solo', next);
  }

  // Single Simon-style cycle button — replaces the 4-button variant row
  // that visually crashed with the inline volume fader. Click cycles
  // 0→1→2→3→0 through the variants. Color + number change every tap.
  _buildVariantPicker(instType, trackColor) {
    const SIMON_COLORS = ['#ff3344', '#ffaa00', '#00cc44', '#0066ff'];
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex; gap:6px; align-items:center; justify-content:center; padding:0 4px;';

    const selected = this.gameState.data.audioPrefs.variants[instType] || 0;

    const btn = document.createElement('button');
    btn.dataset.type = instType;
    btn.title = `${instType} variant ${selected + 1}`;
    const renderBtn = (idx) => {
      const color = SIMON_COLORS[idx];
      btn.style.cssText = `
        width:42px; height:42px; border-radius:50%;
        font-family:'Press Start 2P', monospace; font-size:14px; font-weight:bold;
        background:radial-gradient(circle at 30% 30%, ${color}ff, ${color}88 60%, #000);
        color:#fff; text-shadow: 0 0 6px #000, 2px 2px 0 #000;
        border:3px solid #000; cursor:pointer;
        box-shadow: 0 0 10px ${color}aa, inset -2px -2px 0 rgba(0,0,0,0.5), 2px 2px 0 #000;
        transition: transform 0.08s, box-shadow 0.15s;
      `;
      btn.textContent = String(idx + 1);
      btn.dataset.idx = idx;
    };
    renderBtn(selected);
    btn.addEventListener('mouseenter', () => { btn.style.transform = 'translate(-1px,-1px)'; });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    btn.addEventListener('click', () => {
      const cur = parseInt(btn.dataset.idx || '0', 10);
      const next = (cur + 1) % 4;
      this._selectVariant(instType, next, trackColor);
      renderBtn(next);
    });

    wrap.appendChild(btn);
    // Single button, but keep this an array so existing _refreshVariantStatus
    // can iterate without branching. Index 0 is the visible cycle button.
    this.variantButtons[instType] = [btn];
    this._variantRender = this._variantRender || {};
    this._variantRender[instType] = renderBtn;
    return wrap;
  }

  _selectVariant(type, idx /* , trackColor */) {
    // Single-button cycler — render handled by the button's own renderBtn,
    // we just push the choice into the engine + state and update the title.
    this.audioEngine.setVariant(type, idx);
    this.gameState.setVariant(type, idx);
    this._refreshVariantStatus();
  }

  _refreshVariantStatus() {
    // With the single Simon-cycle button per track, only update title
    // (sample vs synth fallback vs loading) on the active variant.
    for (const type of Object.keys(this.variantButtons)) {
      const btn = this.variantButtons[type]?.[0];
      if (!btn) continue;
      const idx = parseInt(btn.dataset.idx || '0', 10);
      const status = this.audioEngine.getVariantStatus(type, idx);
      if (status === 'synth') {
        btn.title = `${type} variant ${idx + 1} — synth fallback (sample missing)`;
      } else if (status === 'sample') {
        btn.title = `${type} variant ${idx + 1} — MP3 sample`;
      } else {
        btn.title = `${type} variant ${idx + 1} — loading…`;
      }
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
      this.loopCount = 0;
    } else {
      this.audioEngine.stopChordLoop();
      btn.textContent = '▶ PLAY';
      this._clearPlayhead();
    }
  }

  _onStep(stepIdx) {
    this.currentStep = stepIdx;
    // Bar wrap detection
    if (stepIdx === 0) this.loopCount++;
    // Update position readout: BAR.BEAT.SUB
    const bar = this.loopCount || 1;
    const beat = Math.floor(stepIdx / 4) + 1;
    const sub  = (stepIdx % 4) + 1;
    if (this.loopPosEl) {
      this.loopPosEl.textContent = `${bar}.${beat}.${sub}`;
      // Pulse the readout when a new bar starts
      if (stepIdx === 0) {
        this.loopPosEl.style.boxShadow = '0 0 12px #ffaa00';
        setTimeout(() => { if (this.loopPosEl) this.loopPosEl.style.boxShadow = 'none'; }, 180);
      }
    }
    // Highlight beat tracking bar
    for (let s = 0; s < this.beatBarCells.length; s++) {
      const c = this.beatBarCells[s];
      const isDownbeat = s % 4 === 0;
      if (s === stepIdx) {
        c.style.background = '#ffaa00';
        c.style.color = '#0a0a1e';
        c.style.borderColor = '#ffaa00';
      } else {
        c.style.background = isDownbeat ? 'rgba(255,170,0,0.15)' : 'transparent';
        c.style.color = isDownbeat ? '#ffaa00' : '#444';
        c.style.borderColor = isDownbeat ? '#666' : '#222';
      }
    }
    // Highlight step cells in each track
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

  _clearPlayhead() {
    if (this.loopPosEl) this.loopPosEl.textContent = '1.1.1';
    for (let s = 0; s < this.beatBarCells.length; s++) {
      const c = this.beatBarCells[s];
      const isDownbeat = s % 4 === 0;
      c.style.background = isDownbeat ? 'rgba(255,170,0,0.15)' : 'transparent';
      c.style.color = isDownbeat ? '#ffaa00' : '#444';
      c.style.borderColor = isDownbeat ? '#666' : '#222';
    }
    for (let t = 0; t < this.gridCells.length; t++) {
      for (let s = 0; s < this.gridCells[t].length; s++) {
        const cell = this.gridCells[t][s];
        const active = this.grid[t][s];
        const isBeat = s % 4 === 0;
        const trackColor = TRACK_COLORS[this.instruments[t]?.type] || '#888';
        cell.style.background = active ? trackColor : (isBeat ? '#1e3050' : '#1a2a4a');
        cell.style.opacity = active ? '1' : '0.6';
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
    this._stopAll();
    this._openNameBeatModal();
  }

  _openNameBeatModal() {
    document.getElementById('name-beat-modal')?.remove();
    const modal = document.createElement('div');
    modal.id = 'name-beat-modal';
    modal.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.85);
      display:flex; align-items:center; justify-content:center; z-index:9999;
      font-family:'Press Start 2P', monospace;
    `;
    const defaultName = this.beatName || `BEAT ${(this.gameState.data.completedLevels.length + 1).toString().padStart(2,'0')}`;
    modal.innerHTML = `
      <div style="
        background:#0a0a1e; border:2px solid #ffaa00; padding:28px;
        max-width:480px; box-shadow: 0 0 32px #ffaa00;
        display:flex; flex-direction:column; gap:16px;
      ">
        <div style="font-size:13px; color:#ffaa00; text-shadow: 0 0 8px #ffaa00; letter-spacing:2px;">
          NAME YOUR BEAT
        </div>
        <div style="font-size:7px; color:#aaa; line-height:1.7;">
          GIVE IT A TITLE. THIS GOES ON THE COVER, THE SHARE CARD,<br/>
          AND YOUR PRODUCER PAGE.
        </div>
        <input id="beat-name-input" type="text" maxlength="24" placeholder="UNTITLED BEAT"
          value="${defaultName.replace(/"/g, '&quot;')}"
          style="
            font-family:'Press Start 2P', monospace; font-size:11px;
            padding:12px 14px; background:#1a1a3e; color:#ffaa00;
            border:2px solid #ffaa00; outline:none;
            text-align:center; letter-spacing:1px; text-transform:uppercase;
          " />
        <div style="display:flex; gap:10px;">
          <button class="pixel-btn magenta" id="beat-name-confirm" style="font-size:10px; padding:12px 18px; flex:1;">✓ FINISH ▶</button>
          <button class="pixel-btn secondary" id="beat-name-cancel" style="font-size:10px; padding:12px 18px;">← BACK</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const input = modal.querySelector('#beat-name-input');
    input.focus(); input.select();
    const close = () => modal.remove();
    modal.querySelector('#beat-name-cancel').addEventListener('click', close);
    modal.querySelector('#beat-name-confirm').addEventListener('click', () => {
      const name = (input.value || '').trim().toUpperCase().slice(0, 24) || 'UNTITLED BEAT';
      close();
      this._commitBeatAndFinish(name);
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') modal.querySelector('#beat-name-confirm').click();
      else if (e.key === 'Escape') close();
    });
  }

  _commitBeatAndFinish(beatName) {
    const totalCells = this.grid.length * (this.grid[0]?.length || 0);
    const activeCells = this.grid.flat().filter(Boolean).length;
    const density = totalCells ? activeCells / totalCells : 0;
    const cpIdx = this.gameState.data.audioPrefs.chordProgression || 0;
    const chordNames = this.city.chordProgressionNames || DEFAULT_CHORD_NAMES;
    const cpName = chordNames[cpIdx] || '';

    const beatRecord = {
      grid: this.grid,
      beatName,
      bpm: this.city.defaultBpm || 90,
      chordProgression: cpIdx,
      chordProgressionName: cpName,
      variants: { ...(this.gameState.data.audioPrefs.variants || {}) },
      mixSnapshot: JSON.parse(JSON.stringify(this.gameState.data.audioPrefs.mix || {})),
      rating: null,
      createdAt: new Date().toISOString(),
      producerName: this.gameState.data.playerName || 'PRODUCER',
      cityId: this.cityId,
      density,
    };

    this.gameState.saveTrack(this.cityId, beatRecord);
    this.beatName = beatName;
    window.__beatworld.finishBeat();
  }

  _stopAll() {
    this.audioEngine.stopSequencer();
    this.audioEngine.stopChordLoop();
    this.playing = false;
    this._clearPlayhead();
  }

  _buildFriendBubble() {
    const bubble = document.createElement('div');
    bubble.style.cssText = `
      position:absolute; top:8%; right:6%;
      max-width:240px; padding:10px 12px;
      background:rgba(255,255,255,0.94); color:#0a0a1e;
      border:2px solid #ffaa00;
      box-shadow: 4px 4px 0 #0a0a1e, 0 0 16px rgba(255,170,0,0.4);
      font-family:'Press Start 2P', monospace; font-size:7px;
      line-height:1.7; letter-spacing:0.5px; white-space:pre-line;
      cursor:pointer; user-select:none;
      transition: opacity 0.3s, transform 0.3s;
      z-index:10;
    `;
    const tail = document.createElement('div');
    tail.style.cssText = `
      position:absolute; bottom:-10px; right:24px;
      width:0; height:0;
      border-left:8px solid transparent;
      border-right:8px solid transparent;
      border-top:10px solid #ffaa00;
    `;
    bubble.appendChild(tail);
    const text = document.createElement('div');
    text.style.cssText = 'position:relative; z-index:1;';
    text.textContent = FRIEND_TIPS[0];
    bubble.appendChild(text);
    bubble.addEventListener('click', () => this._advanceTip());
    this.tipBubble = { el: bubble, textEl: text };
    this.tipIdx = 0;
    this.tipTimer = setInterval(() => this._advanceTip(), 6000);
    return bubble;
  }

  _advanceTip() {
    if (!this.tipBubble) return;
    this.tipIdx = (this.tipIdx + 1) % FRIEND_TIPS.length;
    const { el, textEl } = this.tipBubble;
    el.style.opacity = '0';
    el.style.transform = 'translateY(-4px)';
    setTimeout(() => {
      textEl.textContent = FRIEND_TIPS[this.tipIdx];
      el.style.opacity = '1';
      el.style.transform = '';
    }, 250);
  }

  // ── Mixer panel (collapsible — sends + master + bus returns) ──
  _buildMixerPanel() {
    const wrap = document.createElement('div');
    wrap.style.cssText = `margin-top:14px; padding-top:0; border-top:2px solid #ffaa00;`;
    const header = document.createElement('div');
    // Bigger font + glowing border + obvious tap-to-open affordance.
    header.style.cssText = `
      display:flex; justify-content:space-between; align-items:center;
      cursor:pointer; padding:12px 14px; margin-top:-2px;
      background:linear-gradient(180deg, rgba(255,170,0,0.15) 0%, rgba(255,170,0,0.05) 100%);
      border:2px solid #ffaa00;
      box-shadow: 0 0 12px rgba(255,170,0,0.35), inset 0 0 8px rgba(255,170,0,0.1);
      transition: box-shadow 0.2s, transform 0.1s;
    `;
    header.addEventListener('mouseenter', () => { header.style.boxShadow = '0 0 18px rgba(255,170,0,0.6), inset 0 0 12px rgba(255,170,0,0.2)'; });
    header.addEventListener('mouseleave', () => { header.style.boxShadow = '0 0 12px rgba(255,170,0,0.35), inset 0 0 8px rgba(255,170,0,0.1)'; });
    const titleEl = document.createElement('div');
    titleEl.style.cssText = `
      font-size:14px; color:#ffaa00; letter-spacing:3px; font-weight:bold;
      text-shadow: 0 0 10px #ffaa00, 2px 2px 0 #000;
    `;
    titleEl.textContent = '🎛  SENDS · MASTER · FX BUSES';

    // Tap-to-open affordance — animated arrow + label.
    const cta = document.createElement('div');
    cta.style.cssText = `
      display:flex; align-items:center; gap:8px;
      font-size:9px; color:#0a0a1e; letter-spacing:2px;
      background:#ffaa00; padding:6px 12px;
      border:2px solid #000; box-shadow: 2px 2px 0 #000;
    `;
    const ctaText = document.createElement('span');
    ctaText.textContent = this.mixerExpanded ? 'TAP TO CLOSE' : 'TAP TO OPEN';
    const arrow = document.createElement('span');
    arrow.style.cssText = 'font-size:14px; line-height:1;';
    arrow.textContent = this.mixerExpanded ? '▼' : '▶';
    cta.appendChild(ctaText);
    cta.appendChild(arrow);

    header.appendChild(titleEl);
    header.appendChild(cta);
    const body = document.createElement('div');
    body.style.cssText = `display:${this.mixerExpanded ? 'flex' : 'none'}; flex-direction:column; gap:6px; padding:10px 0;`;
    header.addEventListener('click', () => {
      this.mixerExpanded = !this.mixerExpanded;
      body.style.display = this.mixerExpanded ? 'flex' : 'none';
      arrow.textContent = this.mixerExpanded ? '▼' : '▶';
      ctaText.textContent = this.mixerExpanded ? 'TAP TO CLOSE' : 'TAP TO OPEN';
    });
    body.appendChild(this._buildMasterStrip());
    for (const inst of this.instruments) body.appendChild(this._buildSendStrip(inst));
    body.appendChild(this._buildFxReturnStrip('reverb', 'REVERB BUS'));
    body.appendChild(this._buildFxReturnStrip('delay',  'DELAY BUS'));
    wrap.appendChild(header);
    wrap.appendChild(body);
    return wrap;
  }


  _buildMasterStrip() {
    const row = document.createElement('div');
    row.style.cssText = `
      display:grid; grid-template-columns:80px 1fr 60px;
      gap:8px; align-items:center;
      padding:6px 8px; background:rgba(255,170,0,0.06);
      border-left:3px solid #ffaa00;
    `;
    const label = document.createElement('div');
    label.style.cssText = 'font-size:7px; color:#ffaa00; letter-spacing:1px;';
    label.textContent = 'MASTER';
    row.appendChild(label);
    const valEl = document.createElement('div');
    valEl.style.cssText = 'font-size:6px; color:#ffaa00; text-align:right;';
    valEl.textContent = `${(this.gameState.data.audioPrefs.mix.master ?? 0).toFixed(0)} dB`;
    const slider = this._fader(-36, 6, 0.5,
      this.gameState.data.audioPrefs.mix.master ?? 0,
      'bw-fader-yellow',
      (v) => {
        this.audioEngine.setMasterVolume(v);
        this.gameState.setMixMaster(v);
        valEl.textContent = `${v.toFixed(0)} dB`;
      });
    row.appendChild(slider); row.appendChild(valEl);
    return row;
  }

  _buildSendStrip(inst) {
    const row = document.createElement('div');
    const trackColor = TRACK_COLORS[inst.type] || '#888';
    row.style.cssText = `
      display:grid; grid-template-columns:80px 1fr 1fr;
      gap:8px; align-items:center;
      padding:5px 8px; background:rgba(255,255,255,0.02);
      border-left:3px solid ${trackColor};
    `;
    const label = document.createElement('div');
    label.style.cssText = `font-size:6px; color:${trackColor}; letter-spacing:1px;`;
    label.textContent = inst.name.toUpperCase();
    row.appendChild(label);
    const mix = this.gameState.data.audioPrefs.mix;
    row.appendChild(this._labeledFader('REV', 0, 1, 0.01, mix.reverbSend[inst.type] ?? 0, 'bw-fader-cyan',
      (v) => { this.audioEngine.setReverbSend(inst.type, v); this.gameState.setMixReverbSend(inst.type, v); },
      (v) => `${Math.round(v * 100)}`));
    row.appendChild(this._labeledFader('DLY', 0, 1, 0.01, mix.delaySend[inst.type] ?? 0, 'bw-fader-magenta',
      (v) => { this.audioEngine.setDelaySend(inst.type, v); this.gameState.setMixDelaySend(inst.type, v); },
      (v) => `${Math.round(v * 100)}`));
    return row;
  }

  _buildFxReturnStrip(kind, label) {
    const row = document.createElement('div');
    const color = kind === 'reverb' ? '#00ddff' : '#ff3399';
    const cls = kind === 'reverb' ? 'bw-fader-cyan' : 'bw-fader-magenta';
    row.style.cssText = `
      display:grid; grid-template-columns:80px 1fr 60px;
      gap:8px; align-items:center;
      padding:4px 8px; background:rgba(255,255,255,0.015);
      border-left:3px dashed ${color};
    `;
    const lab = document.createElement('div');
    lab.style.cssText = `font-size:6px; color:${color}; letter-spacing:1px;`;
    lab.textContent = label;
    row.appendChild(lab);
    const initial = kind === 'reverb' ? this.gameState.data.audioPrefs.mix.reverbWet : this.gameState.data.audioPrefs.mix.delayWet;
    const valEl = document.createElement('div');
    valEl.style.cssText = `font-size:6px; color:${color}; text-align:right;`;
    valEl.textContent = `${Math.round(initial * 100)}%`;
    const slider = this._fader(0, 1, 0.01, initial, cls, (v) => {
      if (kind === 'reverb') { this.audioEngine.setReverbWet(v); this.gameState.setMixReverbWet(v); }
      else { this.audioEngine.setDelayWet(v); this.gameState.setMixDelayWet(v); }
      valEl.textContent = `${Math.round(v * 100)}%`;
    });
    row.appendChild(slider); row.appendChild(valEl);
    return row;
  }

  _fader(min, max, step, value, colorClass, onInput) {
    const inp = document.createElement('input');
    inp.type = 'range';
    inp.min = String(min); inp.max = String(max); inp.step = String(step);
    inp.value = String(value);
    inp.className = `bw-fader ${colorClass || ''}`.trim();
    inp.style.cssText = 'width:100%;';
    inp.addEventListener('input', () => onInput(parseFloat(inp.value)));
    return inp;
  }

  _labeledFader(prefix, min, max, step, value, colorClass, onInput, fmt) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:grid; grid-template-columns:24px 1fr 28px; gap:4px; align-items:center;';
    const lab = document.createElement('div');
    lab.style.cssText = `font-size:5px; color:#aaa; letter-spacing:1px;`;
    lab.textContent = prefix;
    const val = document.createElement('div');
    val.style.cssText = 'font-size:5px; color:#888; text-align:right;';
    val.textContent = fmt(value);
    const sl = this._fader(min, max, step, value, colorClass, (v) => { onInput(v); val.textContent = fmt(v); });
    wrap.appendChild(lab); wrap.appendChild(sl); wrap.appendChild(val);
    return wrap;
  }

  hide() {
    if (this.el) { this.el.remove(); this.el = null; }
    document.getElementById('studio-exit-modal')?.remove();
    document.getElementById('name-beat-modal')?.remove();
    if (this.tipTimer) { clearInterval(this.tipTimer); this.tipTimer = null; }
    this.tipBubble = null;
    this.gridCells = [];
    this.beatBarCells = [];
    this.variantButtons = {};
    this.chordButtons = [];
    this.muteButtons = {};
    this.soloButtons = {};
    this.trackVolFaders = {};
  }

  update() {}
}
