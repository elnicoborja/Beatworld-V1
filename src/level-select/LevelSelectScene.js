/**
 * LevelSelectScene — vertical list of 6 level cards.
 * Replaces the V1 world map. L1 unlocked, L2-L6 visibly locked with COMING SOON.
 *
 * - Top-left: player character composite thumbnail + producer name
 * - Top-right: EDIT CHARACTER button → switchScene('characterSelect')
 * - Click L1 card → enterCity('new-york')
 */
import { LEVEL_PROGRESSION } from '../data/LevelProgression.js';
import { spriteImage, characterPartUrl } from '../ui/SpriteImage.js';

export class LevelSelectScene {
  constructor(gameState, switchScene, enterCity) {
    this.gameState = gameState;
    this.switchScene = switchScene;
    this.enterCity = enterCity;
    this.el = null;
  }

  show() {
    const container = document.getElementById('screen-container');
    this.el = document.createElement('div');
    this.el.className = 'scene-overlay';
    this.el.style.cssText = 'background: radial-gradient(ellipse at top, #1a1a3e 0%, #0a0a1e 60%);';

    // ── Header chrome (top-left identity, top-right edit) ──
    this.el.appendChild(this._buildIdentityChip());
    this.el.appendChild(this._buildEditButton());

    // ── Body: title + cards ──
    const body = document.createElement('div');
    body.className = 'scene-body';
    body.style.cssText = 'padding-top:80px; padding-bottom:48px;';

    const title = document.createElement('h1');
    title.className = 'scene-title';
    title.textContent = 'BEAT WORLD';
    body.appendChild(title);

    const subtitle = document.createElement('h2');
    subtitle.className = 'scene-subtitle';
    subtitle.textContent = 'BUILD YOUR SOUND SYSTEM.';
    body.appendChild(subtitle);

    const cards = document.createElement('div');
    cards.style.cssText = `
      display:flex; flex-direction:column; gap:16px;
      width:100%; max-width:720px; margin:0 auto;
    `;
    LEVEL_PROGRESSION.forEach(level => cards.appendChild(this._buildCard(level)));
    body.appendChild(cards);

    this.el.appendChild(body);
    container.appendChild(this.el);
  }

  _buildIdentityChip() {
    const chip = document.createElement('div');
    chip.style.cssText = `
      position:absolute; top:14px; left:14px;
      display:flex; align-items:center; gap:10px;
      background:rgba(0,0,0,0.6); border:1px solid #ff3399;
      padding:8px 12px; backdrop-filter:blur(4px);
      z-index:30;
    `;

    const parts = this.gameState.data.characterParts;
    const composite = document.createElement('div');
    composite.style.cssText = 'display:flex; flex-direction:column; width:32px; height:96px;';
    composite.appendChild(spriteImage(characterPartUrl('top', parts.head),    'HEAD',  { width: 32, height: 32 }));
    composite.appendChild(spriteImage(characterPartUrl('mid', parts.torso),   'TORSO', { width: 32, height: 32 }));
    composite.appendChild(spriteImage(characterPartUrl('bottom', parts.legs), 'LEGS',  { width: 32, height: 32 }));
    chip.appendChild(composite);

    const meta = document.createElement('div');
    meta.style.cssText = 'display:flex; flex-direction:column; gap:4px;';
    meta.innerHTML = `
      <div style="font-size:6px; color:#888;">PRODUCER</div>
      <div style="font-size:9px; color:#ffaa00; letter-spacing:1px;">${this.gameState.data.playerName}</div>
      <div style="font-size:6px; color:#888;">CLOUT</div>
      <div style="font-size:8px; color:#00ddff;">${(this.gameState.data.clout || 0).toLocaleString()}</div>
    `;
    chip.appendChild(meta);
    return chip;
  }

  _buildEditButton() {
    const btn = document.createElement('button');
    btn.className = 'pixel-btn cyan';
    btn.style.cssText = `
      position:absolute; top:14px; right:14px; z-index:30;
      font-size:8px; padding:8px 12px;
    `;
    btn.textContent = '✎ EDIT CHARACTER';
    btn.addEventListener('click', () => this.switchScene('characterSelect'));
    return btn;
  }

  _buildCard(level) {
    const isUnlocked = this.gameState.isLevelUnlocked(level.level);
    const isCompleted = this.gameState.isLevelCompleted(level.level);

    const card = document.createElement('div');
    card.style.cssText = `
      display:grid; grid-template-columns:80px 1fr 128px;
      gap:16px; align-items:center;
      padding:16px; border:2px solid ${isUnlocked ? level.color : '#333'};
      background:${isUnlocked ? 'rgba(20,20,50,0.85)' : 'rgba(10,10,20,0.7)'};
      cursor:${isUnlocked ? 'pointer' : 'not-allowed'};
      box-shadow:${isUnlocked ? `0 0 16px ${level.color}55, inset 0 0 8px ${level.color}33` : 'none'};
      transition: transform 0.1s, box-shadow 0.1s;
      opacity:${isUnlocked ? 1 : 0.55};
    `;

    // Level number
    const num = document.createElement('div');
    num.style.cssText = `
      font-size:32px; color:${isUnlocked ? level.color : '#555'};
      text-shadow:${isUnlocked ? `0 0 12px ${level.color}` : 'none'};
      text-align:center; letter-spacing:1px;
    `;
    num.textContent = String(level.level).padStart(2, '0');
    card.appendChild(num);

    // Info column
    const info = document.createElement('div');
    info.style.cssText = 'display:flex; flex-direction:column; gap:6px;';
    const tag = isCompleted ? '<span style="color:#00cc44;">✓ COMPLETE</span>'
              : isUnlocked  ? '<span style="color:#ffaa00;">▶ READY</span>'
                            : '<span style="color:#888;">🔒 COMING SOON</span>';
    info.innerHTML = `
      <div style="font-size:11px; color:${isUnlocked ? '#fff' : '#888'}; letter-spacing:1px;">
        ${level.region} · ${level.genre}
      </div>
      <div style="font-size:8px; color:${isUnlocked ? '#00ddff' : '#666'};">
        UNLOCKS: ${level.piece}
      </div>
      <div style="font-size:7px;">${tag}</div>
    `;
    card.appendChild(info);

    // Soundsystem piece sprite slot (placeholder until art lands)
    const pieceSlot = document.createElement('div');
    pieceSlot.style.cssText = 'width:128px; height:128px;';
    if (isUnlocked) {
      pieceSlot.appendChild(spriteImage(
        level.pieceSprite,
        `${level.piece} SPRITE`,
        { width: 128, height: 128 }
      ));
    } else {
      // Locked: solid silhouette placeholder
      const lockBox = document.createElement('div');
      lockBox.className = 'sprite-placeholder';
      lockBox.style.cssText = 'width:100%; height:100%; opacity:0.55; border-color:#444; color:#444;';
      lockBox.textContent = `🔒 ${level.piece}`;
      pieceSlot.appendChild(lockBox);
    }
    card.appendChild(pieceSlot);

    if (isUnlocked) {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translate(-2px, -2px)';
        card.style.boxShadow = `0 0 24px ${level.color}aa, inset 0 0 12px ${level.color}55`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = `0 0 16px ${level.color}55, inset 0 0 8px ${level.color}33`;
      });
      card.addEventListener('click', () => this.enterCity(level.cityId));
    }

    return card;
  }

  hide() {
    if (this.el) { this.el.remove(); this.el = null; }
  }

  update() {}
}
