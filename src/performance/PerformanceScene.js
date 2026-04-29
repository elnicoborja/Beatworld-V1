/**
 * PerformanceScene — basketball-court playback with neon overlay.
 *
 * Per §10 cut list, the 3D PointLight bloom overlay was simplified to
 * CSS radial-gradient "spotlights" that pulse on the beat via mix-blend-mode
 * screen. Achieves the killer-screenshot moment with no shader cost and
 * no need to thread a separate EffectComposer into the shared renderer.
 *
 * Plays the player's saved beat (drums+bass) on top of their chord loop
 * for ~4 loops (~28s @ 90 BPM, 16 steps), then auto-advances. Player can
 * click SEE REVIEWS to skip ahead.
 */
import { CITIES } from '../GameData.js';
import { mountSoundOsFooter } from '../ui/SoundOsFooter.js';

const NEON_SPOTS = [
  { color: '#ff3399', x: 28 },  // magenta
  { color: '#00ddff', x: 42 },  // cyan
  { color: '#ffaa00', x: 58 },  // yellow
  { color: '#00cc44', x: 72 },  // lime
];
const TOTAL_LOOPS = 4;

export class PerformanceScene {
  // Constructor signature unchanged so main.js wiring stays put.
  constructor(scene, camera, gameState, audioEngine, switchScene) {
    this.threeScene = scene;
    this.camera = camera;
    this.gameState = gameState;
    this.audioEngine = audioEngine;
    this.switchScene = switchScene;
    this.el = null;
    this.glows = [];
    this.loopCount = 0;
    this.done = false;
  }

  show() {
    this.done = false;
    this.loopCount = 0;
    this.glows = [];

    const cityId = this.gameState.data.currentCity || 'new-york';
    const city = CITIES[cityId];
    // Tracks are now BeatRecord objects; pull the grid out of the wrapper.
    const beatRecord = this.gameState.getBeat ? this.gameState.getBeat(cityId) : this.gameState.data.tracks[cityId];
    const grid = beatRecord?.grid || (Array.isArray(beatRecord) ? beatRecord : []);
    const instruments = city ? city.instruments.slice(0, city.numInstruments) : [];

    const container = document.getElementById('screen-container');
    this.el = document.createElement('div');
    this.el.className = 'scene-overlay';
    this.el.style.cssText = 'background:#0a0a1e; overflow:hidden;';

    // ── Background image (full bleed) ────────────────────────
    const bg = document.createElement('div');
    bg.style.cssText = 'position:absolute; inset:0; z-index:1;';
    const img = new Image();
    // Per-level performance backdrop. NYC=basketball court, PR=block party, etc.
    img.src = city?.performanceBackdrop || '/assets/sprites/venues/gig-bk-court.png';
    img.style.cssText = 'width:100%; height:100%; object-fit:cover; image-rendering:pixelated; display:block;';
    img.onload = () => bg.appendChild(img);
    img.onerror = () => {
      const ph = document.createElement('div');
      ph.className = 'sprite-placeholder';
      ph.style.cssText = 'width:100%; height:100%; font-size:16px;';
      ph.textContent = `[GIG SCENE — ${city?.name?.toUpperCase() || 'CITY'}]`;
      bg.appendChild(ph);
    };
    this.el.appendChild(bg);

    // ── Neon spotlights (CSS replacement for PointLights) ────
    NEON_SPOTS.forEach((spot) => {
      const dot = document.createElement('div');
      dot.style.cssText = `
        position:absolute; left:${spot.x}%; top:62%;
        width:160px; height:160px; transform:translate(-50%,-50%);
        background: radial-gradient(circle, ${spot.color}cc 0%, ${spot.color}66 35%, transparent 70%);
        mix-blend-mode: screen; pointer-events:none; z-index:2;
        opacity: 0.35; transition: opacity 90ms ease-out, transform 120ms ease-out;
        will-change: opacity, transform; border-radius:50%;
      `;
      this.el.appendChild(dot);
      this.glows.push(dot);
    });

    // ── Top banner ───────────────────────────────────────────
    const banner = document.createElement('div');
    banner.style.cssText = `
      position:absolute; top:24px; left:0; right:0; text-align:center;
      font-family:'Press Start 2P', monospace; pointer-events:none; z-index:10;
    `;
    banner.innerHTML = `
      <div style="font-size:16px; color:#ff3399; text-shadow: 0 0 14px #ff3399; letter-spacing:2px;">
        FIRST SHOW
      </div>
      <div style="font-size:8px; color:#00ddff; margin-top:8px; letter-spacing:1px;">
        ${city ? city.name.toUpperCase() : 'NYC'} · ${city ? city.genre.toUpperCase() : 'HIP HOP'}
      </div>
    `;
    this.el.appendChild(banner);

    // ── SEE REVIEWS button ───────────────────────────────────
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pixel-btn magenta';
    nextBtn.style.cssText = `
      position:absolute; bottom:48px; left:50%; transform:translateX(-50%);
      font-size:11px; padding:14px 28px; z-index:20;
      box-shadow: 0 0 24px #ff3399;
    `;
    nextBtn.textContent = 'SEE REVIEWS ▶';
    nextBtn.addEventListener('click', () => this._goToReview());
    this.el.appendChild(nextBtn);

    // ── Persistent LEVELS exit (immediate — no progress to lose) ──
    const exitBtn = document.createElement('button');
    exitBtn.className = 'pixel-btn cyan';
    exitBtn.textContent = '← LEVELS';
    exitBtn.style.cssText = `
      position:fixed; top:12px; left:12px; z-index:100;
      font-family:'Press Start 2P', monospace; font-size:8px;
      padding:8px 12px;
    `;
    exitBtn.addEventListener('click', () => {
      this.done = true;
      this.audioEngine.stopSequencer();
      this.audioEngine.stopChordLoop();
      this.switchScene('levelSelect');
    });
    this.el.appendChild(exitBtn);

    container.appendChild(this.el);
    mountSoundOsFooter(this.el);

    // ── Start playback ───────────────────────────────────────
    this.audioEngine.setAudioPrefs(this.gameState.data.audioPrefs);
    if (grid.length > 0) {
      this.audioEngine.startSequencer(grid, instruments, (step) => this._onStep(step));
    }
    this.audioEngine.startChordLoop();
  }

  _onStep(step) {
    // Pulse one spotlight per beat (every 4th 16th-note)
    if (step % 4 === 0) {
      const beatIdx = (step / 4) % this.glows.length;
      const glow = this.glows[beatIdx];
      if (glow) {
        glow.style.opacity = '1';
        glow.style.transform = 'translate(-50%,-50%) scale(1.5)';
        setTimeout(() => {
          if (glow.isConnected) {
            glow.style.opacity = '0.35';
            glow.style.transform = 'translate(-50%,-50%) scale(1)';
          }
        }, 130);
      }
    }

    // End-of-loop detection: when we hit the last step we've completed loop N
    if (step === 15) {
      this.loopCount++;
      if (this.loopCount >= TOTAL_LOOPS) {
        setTimeout(() => this._goToReview(), 600);
      }
    }
  }

  _goToReview() {
    if (this.done) return;
    this.done = true;
    this.audioEngine.stopSequencer();
    this.audioEngine.stopChordLoop();
    this.switchScene('review');
  }

  hide() {
    if (this.el) { this.el.remove(); this.el = null; }
    this.glows = [];
  }

  update() {}
}
