/**
 * SoundsystemRevealScene — 2-stage scene.
 *
 *   Stage A: Coney Island boombox unlock cinematic (4s + click-to-skip)
 *   Stage B: Soundsystem hangar showcase with 6 slots (1 unlocked + 5 locked)
 *
 * The hangar background sprite already includes the 6 stage labels per
 * the illustration spec — the interactive overlays are positioned slots
 * with hover tooltips. SHARE YOUR RIG triggers the ShareArtifact module.
 */
import * as Tone from 'tone';
import { spriteImage } from '../ui/SpriteImage.js';
import { mountSoundOsFooter } from '../ui/SoundOsFooter.js';
import { LEVEL_PROGRESSION } from '../data/LevelProgression.js';
import { generateAndDownloadShareImage } from '../social/ShareArtifact.js';

const STAGE_A_MS = 4000;

export class SoundsystemRevealScene {
  constructor(gameState, switchScene) {
    this.gameState = gameState;
    this.switchScene = switchScene;
    this.el = null;
    this._stageATimer = null;
  }

  show() {
    const container = document.getElementById('screen-container');
    this.el = document.createElement('div');
    this.el.className = 'scene-overlay';
    this.el.style.cssText = 'background:#0a0a1e; overflow:hidden;';

    container.appendChild(this.el);
    this._mountStageA();
    mountSoundOsFooter(this.el);
  }

  // ── Stage A: Coney Island cinematic ────────────────────────
  _mountStageA() {
    const stage = document.createElement('div');
    stage.style.cssText = 'position:absolute; inset:0; cursor:pointer;';

    // Background
    const bg = document.createElement('div');
    bg.style.cssText = 'position:absolute; inset:0; z-index:1;';
    bg.appendChild(spriteImage(
      '/assets/sprites/soundsystem/boombox-unlock-coney-island.png',
      'BOOMBOX UNLOCK — CONEY ISLAND',
      { width: window.innerWidth, height: window.innerHeight, style: 'object-fit:cover;' }
    ));
    stage.appendChild(bg);

    // Centered text
    const text = document.createElement('div');
    text.style.cssText = `
      position:absolute; inset:0; display:flex; flex-direction:column;
      justify-content:center; align-items:center; text-align:center;
      pointer-events:none; z-index:5;
      font-family:'Press Start 2P', monospace;
    `;
    const head = document.createElement('div');
    head.textContent = 'BOOMBOX UNLOCKED';
    head.style.cssText = `
      font-size:32px; color:#ff3399; text-shadow: 0 0 24px #ff3399, 4px 4px 0 #000;
      letter-spacing:4px; opacity:0; transform:translateY(8px);
      transition: opacity 600ms ease-out, transform 600ms ease-out;
    `;
    text.appendChild(head);

    const sub = document.createElement('div');
    sub.textContent = 'ADDED TO YOUR SOUND SYSTEM';
    sub.style.cssText = `
      font-size:9px; color:#00ddff; text-shadow: 0 0 8px #00ddff;
      letter-spacing:2px; margin-top:18px; opacity:0;
      transition: opacity 600ms ease-out 600ms;
    `;
    text.appendChild(sub);

    const skip = document.createElement('div');
    skip.textContent = 'CLICK TO CONTINUE';
    skip.style.cssText = `
      position:absolute; bottom:48px; font-size:7px; color:#666;
      letter-spacing:2px; animation: blink 1.6s infinite;
    `;
    text.appendChild(skip);

    stage.appendChild(text);
    this.el.appendChild(stage);

    // Trigger fade-in on next frame, ka-ching on text show
    requestAnimationFrame(() => {
      head.style.opacity = '1';
      head.style.transform = 'translateY(0)';
      sub.style.opacity = '1';
      this._kaChing();
    });

    // Auto-advance OR click-to-skip
    const advance = () => {
      stage.removeEventListener('click', advance);
      if (this._stageATimer) clearTimeout(this._stageATimer);
      this._mountStageB();
    };
    stage.addEventListener('click', advance);
    this._stageATimer = setTimeout(advance, STAGE_A_MS);
  }

  _kaChing() {
    try {
      // Tiny synth flourish — no sample needed
      const synth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.3, sustain: 0, release: 0.4 },
        volume: -10,
      }).toDestination();
      const now = Tone.now();
      synth.triggerAttackRelease('C5', '16n', now);
      synth.triggerAttackRelease('E5', '16n', now + 0.1);
      synth.triggerAttackRelease('G5', '16n', now + 0.2);
      synth.triggerAttackRelease('C6', '4n', now + 0.3);
      setTimeout(() => synth.dispose(), 1500);
    } catch (e) { /* audio not ready — silent */ }
  }

  // ── Stage B: Hangar showcase ───────────────────────────────
  _mountStageB() {
    // Wipe stage A and replace with stage B — keep this.el container
    this.el.innerHTML = '';

    const stage = document.createElement('div');
    stage.style.cssText = 'position:absolute; inset:0;';

    // Background (hangar img or 6-slot placeholder grid)
    const bg = document.createElement('div');
    bg.style.cssText = 'position:absolute; inset:0; z-index:1;';
    const img = new Image();
    img.src = '/assets/sprites/ui/soundsystem-hangar.png';
    img.style.cssText = 'width:100%; height:100%; object-fit:cover; image-rendering:pixelated; display:block;';
    img.onload = () => bg.appendChild(img);
    img.onerror = () => bg.appendChild(this._buildHangarPlaceholder());
    stage.appendChild(bg);

    // Header banner
    const header = document.createElement('div');
    header.style.cssText = `
      position:absolute; top:24px; left:0; right:0; text-align:center; z-index:10;
      font-family:'Press Start 2P', monospace;
      font-size:18px; color:#ff3399; text-shadow: 0 0 16px #ff3399, 2px 2px 0 #000;
      letter-spacing:3px; pointer-events:none;
    `;
    header.textContent = 'MY SOUND SYSTEM';
    stage.appendChild(header);

    // 6 interactive slot overlays (positioned across the bottom 60% of the screen)
    const slots = document.createElement('div');
    slots.style.cssText = `
      position:absolute; bottom:18%; left:0; right:0;
      display:grid; grid-template-columns:repeat(6, 1fr);
      gap:0; z-index:5; padding:0 4%;
    `;
    LEVEL_PROGRESSION.forEach(level => slots.appendChild(this._buildSlot(level)));
    stage.appendChild(slots);

    // Action buttons
    const actions = document.createElement('div');
    actions.style.cssText = `
      position:absolute; bottom:36px; left:0; right:0;
      display:flex; gap:14px; justify-content:center; z-index:20;
    `;

    const shareBtn = document.createElement('button');
    shareBtn.className = 'pixel-btn cyan';
    shareBtn.style.cssText = 'font-size:10px; padding:12px 22px; box-shadow: 0 0 16px #00ddff;';
    shareBtn.textContent = '⎘ SHARE YOUR RIG';
    shareBtn.addEventListener('click', () => generateAndDownloadShareImage(this.gameState));
    actions.appendChild(shareBtn);

    const dirBtn = document.createElement('button');
    dirBtn.className = 'pixel-btn magenta';
    dirBtn.style.cssText = 'font-size:10px; padding:12px 22px; box-shadow: 0 0 16px #ff3399;';
    dirBtn.textContent = 'SEE THE DIRECTORY ▶';
    dirBtn.addEventListener('click', () => this.switchScene('directory'));
    actions.appendChild(dirBtn);

    const backBtn = document.createElement('button');
    backBtn.className = 'pixel-btn cyan';
    backBtn.style.cssText = 'font-size:8px; padding:12px 18px;';
    backBtn.textContent = '← BACK TO LEVELS';
    backBtn.addEventListener('click', () => this.switchScene('levelSelect'));
    actions.appendChild(backBtn);

    stage.appendChild(actions);
    this.el.appendChild(stage);
    mountSoundOsFooter(this.el);
  }

  _buildHangarPlaceholder() {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      width:100%; height:100%; padding:120px 40px 200px;
      display:grid; grid-template-columns:repeat(6, 1fr); gap:12px;
      background:linear-gradient(180deg, #0a0a1e 0%, #1a1a3e 60%, #0a0a1e 100%);
      box-sizing:border-box;
    `;
    LEVEL_PROGRESSION.forEach(level => {
      const slot = document.createElement('div');
      slot.className = 'sprite-placeholder';
      slot.style.cssText = `
        height:100%; flex-direction:column; gap:8px; font-size:10px;
        border-color:${level.unlocked ? level.color : '#444'};
        color:${level.unlocked ? level.color : '#444'};
      `;
      slot.innerHTML = `<div>L${level.level}</div><div style="font-size:7px;">${level.region}</div><div style="font-size:8px;">${level.unlocked ? '✓' : '🔒'} ${level.piece}</div>`;
      wrap.appendChild(slot);
    });
    return wrap;
  }

  _buildSlot(level) {
    const isUnlocked = this.gameState.data.unlockedPieces.includes(level.level);
    const slot = document.createElement('div');
    slot.style.cssText = `
      height:140px; cursor:${isUnlocked ? 'default' : 'not-allowed'};
      position:relative;
      ${isUnlocked
        ? `border:2px solid ${level.color}; box-shadow: inset 0 0 24px ${level.color}55, 0 0 18px ${level.color}aa; background:${level.color}11;`
        : 'border:1px dashed #333; background:rgba(0,0,0,0.2);'}
    `;
    const tip = isUnlocked
      ? `L${level.level} · ${level.region} · ${level.piece} ✓ — BUILT FROM YOUR FIRST BEAT`
      : `L${level.level} · ${level.region} · ${level.piece} 🔒 — UNLOCK BY COMPLETING LEVEL ${level.level - 1}`;
    slot.title = tip;

    if (isUnlocked) {
      slot.appendChild(spriteImage(
        level.pieceSprite,
        level.piece,
        { width: '100%', height: '100%', style: 'object-fit:contain;' }
      ));
      // Pulsing border via animation
      slot.style.animation = 'slot-pulse 1.6s ease-in-out infinite alternate';
      if (!document.getElementById('ss-pulse-kf')) {
        const style = document.createElement('style');
        style.id = 'ss-pulse-kf';
        style.textContent = `@keyframes slot-pulse { from { filter: brightness(1); } to { filter: brightness(1.3); } }`;
        document.head.appendChild(style);
      }
    }
    return slot;
  }

  hide() {
    if (this._stageATimer) { clearTimeout(this._stageATimer); this._stageATimer = null; }
    if (this.el) { this.el.remove(); this.el = null; }
  }

  update() {}
}
