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

// Short culture/region prose shown on Stage B under the hero rig.
// One paragraph, 2-3 sentences — context, not lore-dump. Per-region.
const RIG_CULTURE_BY_CITY = {
  'new-york':    'THE BRONX-BORN ICON. TWIN CHROME SPEAKERS, DUAL CASSETTE DECKS, ANTENNA UP. THE PORTABLE RIG THAT GAVE HIP-HOP ITS FIRST SOUNDSYSTEM — BLOCK PARTIES, B-BOY CIRCLES, YOUR SHOULDER.',
  'puerto-rico': 'EL PICÓ — ALMA DE LA CALLE CARIBEÑA. HAND-PAINTED COLUMN STACK BORN IN THE CARIBBEAN, WEAPONIZED FOR PERREO. BORICUA STRIPES, COQUÍ FROG, PALM TREES. EL BLOQUE IS THE VENUE.',
  'rio':         'BAILE FUNK\'S MOTORIZED SOUNDSYSTEM. WHEELED HORN-LOADED SPEAKER TRUCK BORN IN RIO\'S FAVELAS — WHEELS IN THE STREETS, BASS IN THE AIR.',
  'bogota':      'ANDEAN BASS CABINET. UNDERGROUND TECH HOUSE FROM BOGOTÁ\'S CHAPINERO WAREHOUSES — DEEP, DARK, RELENTLESS.',
  'mexico-city': 'SONIDERO RIG. HAND-LETTERED SIGNAGE FRAMES THE STACK. ANNOUNCERS GIVE SHOUT-OUTS LIVE OVER CUMBIA — A MEXICO CITY STREET-PARTY INSTITUTION.',
  'kingston':    'DUB SHACK STACK. KING TUBBY\'S TRADITION. HAND-BUILT WOODEN CABINETS PAINTED RED-GOLD-GREEN. THE RIG IS SACRED — JAMAICA IS WHERE THE SOUNDSYSTEM BEGAN.',
};

// Per-level Stage A reveal — image, headline, piece label.
// New levels get added here without touching the rest of the scene.
const REVEAL_BY_CITY = {
  'new-york': {
    bg:        '/assets/sprites/soundsystem/boombox-unlock-coney-island.png',
    bgAlt:     'BOOMBOX UNLOCK — CONEY ISLAND',
    headline:  'BOOMBOX UNLOCKED',
    sub:       'ADDED TO YOUR SOUND SYSTEM',
    haloColor: '#ff3399',
  },
  'puerto-rico': {
    bg:        '/assets/sprites/soundsystem/pico-unlock-vieques.png',
    bgAlt:     'PICÓ UNLOCK — VIEQUES',
    headline:  'PICÓ STACK UNLOCKED',
    sub:       'AÑADIDO A TU SOUND SYSTEM',
    haloColor: '#00ddff',
  },
};

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

  // ── Stage A: per-level unlock cinematic ────────────────────
  _mountStageA() {
    const stage = document.createElement('div');
    stage.style.cssText = 'position:absolute; inset:0; cursor:pointer;';

    // Per-level reveal config (image + headline + sub + halo color)
    const cityId = this.gameState.data.currentCity || 'new-york';
    const reveal = REVEAL_BY_CITY[cityId] || REVEAL_BY_CITY['new-york'];

    // Background — direct img with object-fit:cover so the cinematic
    // fills the viewport regardless of aspect ratio (no white space).
    const bg = document.createElement('div');
    bg.style.cssText = 'position:absolute; inset:0; z-index:1; background:#0a0a1e;';
    const bgImg = new Image();
    bgImg.src = reveal.bg;
    bgImg.alt = reveal.bgAlt;
    bgImg.style.cssText = `
      position:absolute; inset:0;
      width:100%; height:100%; object-fit:cover; object-position:center;
      image-rendering:pixelated; display:block;
    `;
    bgImg.onerror = () => {
      const ph = document.createElement('div');
      ph.className = 'sprite-placeholder';
      ph.style.cssText = 'width:100%; height:100%; font-size:14px;';
      ph.textContent = `[${reveal.bgAlt}]`;
      bg.appendChild(ph);
    };
    bg.appendChild(bgImg);
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
    head.textContent = reveal.headline;
    head.style.cssText = `
      font-size:32px; color:${reveal.haloColor}; text-shadow: 0 0 24px ${reveal.haloColor}, 4px 4px 0 #000;
      letter-spacing:4px; opacity:0; transform:translateY(8px);
      transition: opacity 600ms ease-out, transform 600ms ease-out;
    `;
    text.appendChild(head);

    const sub = document.createElement('div');
    sub.textContent = reveal.sub;
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

  // ── Stage B: Hero rig + culture text + collection row ─────────
  // Drops the hangar background (alignment problems with painted stages).
  // Instead: clean dark gradient bg, the newly-unlocked rig as the hero,
  // a short culture/region paragraph, then a row of all 6 rigs (unlocked
  // ones full-color, locked ones as silhouettes). Fully responsive.
  _mountStageB() {
    this.el.innerHTML = '';
    const cityId = this.gameState.data.currentCity || 'new-york';
    const currentLevel = LEVEL_PROGRESSION.find(l => l.cityId === cityId) || LEVEL_PROGRESSION[0];

    const stage = document.createElement('div');
    stage.style.cssText = `
      position:absolute; inset:0;
      background:radial-gradient(ellipse at 50% 30%, ${currentLevel.color}22 0%, #0a0a1e 60%);
      overflow-y:auto; overflow-x:hidden;
      display:flex; flex-direction:column; align-items:center;
      padding:32px 16px 100px;
      box-sizing:border-box;
      font-family:'Press Start 2P', monospace;
    `;

    // Title
    const title = document.createElement('h1');
    title.style.cssText = `
      font-size:14px; color:#ffaa00; letter-spacing:4px;
      text-shadow: 0 0 12px #ffaa00, 4px 4px 0 #000;
      margin:0 0 20px;
    `;
    title.textContent = 'MY SOUND SYSTEM';
    stage.appendChild(title);

    // Hero rig (newly unlocked)
    const hero = document.createElement('div');
    hero.style.cssText = `
      display:flex; flex-direction:column; align-items:center; gap:10px;
      padding:24px; margin-bottom:24px;
      background:rgba(0,0,0,0.5);
      border:3px solid ${currentLevel.color};
      box-shadow: 0 0 32px ${currentLevel.color}aa, inset 0 0 24px ${currentLevel.color}33;
      max-width:90vw; width:380px;
    `;
    const heroLabel = document.createElement('div');
    heroLabel.style.cssText = `font-size:7px; color:#888; letter-spacing:3px;`;
    heroLabel.textContent = `LEVEL ${String(currentLevel.level).padStart(2,'0')} · UNLOCKED`;
    hero.appendChild(heroLabel);

    const heroImg = new Image();
    heroImg.src = currentLevel.pieceSprite;
    heroImg.alt = currentLevel.piece;
    heroImg.style.cssText = `
      width:200px; height:200px; max-width:60vw; max-height:60vw;
      image-rendering:pixelated;
      filter: drop-shadow(0 0 24px ${currentLevel.color});
      animation: bw-rig-float 3s ease-in-out infinite alternate;
    `;
    heroImg.onerror = () => {
      heroImg.style.display = 'none';
      const ph = document.createElement('div');
      ph.className = 'sprite-placeholder';
      ph.style.cssText = `width:200px; height:200px; border-color:${currentLevel.color}; color:${currentLevel.color};`;
      ph.textContent = `[${currentLevel.piece}]`;
      hero.appendChild(ph);
    };
    hero.appendChild(heroImg);

    if (!document.getElementById('bw-rig-float-kf')) {
      const kf = document.createElement('style');
      kf.id = 'bw-rig-float-kf';
      kf.textContent = `@keyframes bw-rig-float { from { transform: translateY(0); } to { transform: translateY(-6px); } }`;
      document.head.appendChild(kf);
    }

    const heroName = document.createElement('div');
    heroName.style.cssText = `
      font-size:18px; color:${currentLevel.color}; letter-spacing:3px;
      text-shadow: 0 0 14px ${currentLevel.color}, 2px 2px 0 #000;
      text-align:center;
    `;
    heroName.textContent = currentLevel.piece;
    hero.appendChild(heroName);

    const heroRegion = document.createElement('div');
    heroRegion.style.cssText = `font-size:9px; color:#00ddff; letter-spacing:2px;`;
    heroRegion.textContent = `${currentLevel.region} · ${currentLevel.genre}`;
    hero.appendChild(heroRegion);

    // Culture/region paragraph
    const culture = document.createElement('div');
    culture.style.cssText = `
      max-width:90vw; width:520px;
      padding:14px 18px; margin-bottom:24px;
      background:rgba(10,10,30,0.7); border:1px solid #444;
      font-size:8px; color:#fff; line-height:2;
      letter-spacing:0.8px; text-align:center; font-style:italic;
    `;
    culture.textContent = RIG_CULTURE_BY_CITY[cityId] || RIG_CULTURE_BY_CITY['new-york'];
    stage.appendChild(hero);
    stage.appendChild(culture);

    // Collection row — all 6 rigs, unlocked full-color, locked silhouetted
    const collection = document.createElement('div');
    collection.style.cssText = `
      display:flex; gap:8px; flex-wrap:wrap; justify-content:center;
      margin-bottom:24px; max-width:100vw;
    `;
    LEVEL_PROGRESSION.forEach(level => collection.appendChild(this._buildCollectionItem(level)));
    stage.appendChild(collection);

    const actions = document.createElement('div');
    actions.style.cssText = `display:flex; gap:10px; flex-wrap:wrap; justify-content:center;`;
    const shareBtn = document.createElement('button');
    shareBtn.className = 'pixel-btn cyan';
    shareBtn.style.cssText = 'font-size:10px; padding:12px 22px; box-shadow: 0 0 16px #00ddff;';
    shareBtn.textContent = '⎘ SHARE YOUR RIG';
    shareBtn.addEventListener('click', () => generateAndDownloadShareImage(this.gameState));
    actions.appendChild(shareBtn);
    const dirBtn = document.createElement('button');
    dirBtn.className = 'pixel-btn magenta';
    dirBtn.style.cssText = 'font-size:10px; padding:12px 22px; box-shadow: 0 0 16px #ff3399;';
    dirBtn.textContent = 'DIRECTORY ▶';
    dirBtn.addEventListener('click', () => this.switchScene('directory'));
    actions.appendChild(dirBtn);
    const backBtn = document.createElement('button');
    backBtn.className = 'pixel-btn';
    backBtn.style.cssText = 'font-size:8px; padding:12px 18px; background:#1a1a3e; color:#888; border:2px solid #333;';
    backBtn.textContent = '← LEVELS';
    backBtn.addEventListener('click', () => this.switchScene('levelSelect'));
    actions.appendChild(backBtn);
    stage.appendChild(actions);
    this.el.appendChild(stage);
    mountSoundOsFooter(this.el);
  }

  _buildCollectionItem(level) {
    const isUnlocked = this.gameState.data.unlockedPieces.includes(level.level);
    const cell = document.createElement('div');
    cell.style.cssText = `
      display:flex; flex-direction:column; align-items:center; gap:4px;
      width:80px; padding:8px;
      background:rgba(0,0,0,0.4);
      border:1px solid ${isUnlocked ? level.color : '#333'};
      ${isUnlocked ? `box-shadow: 0 0 8px ${level.color}66;` : 'opacity:0.45;'}
    `;
    const img = new Image();
    img.src = level.pieceSprite;
    img.alt = level.piece;
    img.style.cssText = `
      width:48px; height:48px; image-rendering:pixelated;
      ${isUnlocked ? '' : 'filter: brightness(0.2) contrast(2);'}
    `;
    img.onerror = () => {
      img.style.display = 'none';
      const ph = document.createElement('div');
      ph.style.cssText = `width:48px; height:48px; background:${isUnlocked ? level.color + '33' : '#222'}; border:1px dashed ${isUnlocked ? level.color : '#444'};`;
      cell.insertBefore(ph, cell.firstChild);
    };
    cell.appendChild(img);
    const lab = document.createElement('div');
    lab.style.cssText = `font-size:5px; color:${isUnlocked ? level.color : '#666'}; letter-spacing:1px; text-align:center;`;
    lab.textContent = `L${level.level}`;
    cell.appendChild(lab);
    cell.title = isUnlocked ? `${level.region} · ${level.piece} ✓` : `${level.region} · ${level.piece} 🔒`;
    return cell;
  }

  hide() {
    if (this._stageATimer) { clearTimeout(this._stageATimer); this._stageATimer = null; }
    if (this.el) { this.el.remove(); this.el = null; }
  }

  update() {}
}
