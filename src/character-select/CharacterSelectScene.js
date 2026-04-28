/**
 * CharacterSelectScene — "Cadaver Exquisito" 3-zone picker.
 *
 * Player swaps head/torso/legs independently across 4 identities
 * (boombap / gfunk / punk / beatmaker) → 64 combinations.
 * Picks land in gameState.characterParts immediately so partial state
 * survives a refresh. Name only commits on ENTER WORLD.
 */
import { spriteImage, characterPartUrl } from '../ui/SpriteImage.js';

const IDENTITIES = ['boombap', 'gfunk', 'punk', 'beatmaker'];
const IDENTITY_LABELS = {
  boombap: 'BOOMBAP',
  gfunk: 'G-FUNK',
  punk: 'PUNK',
  beatmaker: 'BEATMAKER',
};
const ZONES = [
  { key: 'head',  label: 'HEAD',  sprite: 'top'    },
  { key: 'torso', label: 'TORSO', sprite: 'mid'    },
  { key: 'legs',  label: 'LEGS',  sprite: 'bottom' },
];

export class CharacterSelectScene {
  constructor(gameState, switchScene) {
    this.gameState = gameState;
    this.switchScene = switchScene;
    this.el = null;
    this.compositeEl = null;
  }

  show() {
    const container = document.getElementById('screen-container');
    this.el = document.createElement('div');
    this.el.className = 'scene-overlay';
    this.el.style.cssText = 'background: radial-gradient(ellipse at center, #1a1a3e 0%, #0a0a1e 70%);';

    const body = document.createElement('div');
    body.className = 'scene-body';
    body.style.cssText = 'gap:18px; padding:24px; padding-bottom:40px;';

    const title = document.createElement('h1');
    title.className = 'scene-title';
    title.textContent = 'CHOOSE YOUR PRODUCER';
    body.appendChild(title);

    const subtitle = document.createElement('h2');
    subtitle.className = 'scene-subtitle';
    subtitle.textContent = 'MIX & MATCH — 64 COMBINATIONS';
    body.appendChild(subtitle);

    // Pickers row
    const pickersRow = document.createElement('div');
    pickersRow.style.cssText = 'display:flex; gap:32px; align-items:flex-start; justify-content:center; flex-wrap:wrap;';
    ZONES.forEach(zone => pickersRow.appendChild(this._buildPickerColumn(zone)));
    body.appendChild(pickersRow);

    // Live composite
    this.compositeEl = this._buildComposite();
    body.appendChild(this.compositeEl);

    // Name input
    const nameWrap = document.createElement('div');
    nameWrap.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:8px; margin-top:8px;';
    nameWrap.innerHTML = `
      <label style="font-size:8px; color:#888; letter-spacing:1px;">PRODUCER NAME</label>
      <input id="cs-name" type="text" maxlength="12" autocomplete="off" spellcheck="false"
        value="${this._currentName()}"
        placeholder="ENTER NAME"
        style="
          font-family:'Press Start 2P', monospace;
          font-size:14px; padding:10px 14px;
          background:#0a0a1e; color:#ffaa00;
          border:2px solid #ffaa00; text-align:center;
          text-transform:uppercase; width:240px;
          letter-spacing:3px; outline:none;
        " />
    `;
    body.appendChild(nameWrap);

    // ENTER WORLD button
    const enterBtn = document.createElement('button');
    enterBtn.className = 'pixel-btn primary';
    enterBtn.style.cssText = 'font-size:12px; padding:14px 28px; margin-top:8px;';
    enterBtn.textContent = 'ENTER WORLD ▶';
    body.appendChild(enterBtn);

    this.el.appendChild(body);
    container.appendChild(this.el);

    // Wire up
    const nameInput = body.querySelector('#cs-name');
    nameInput.addEventListener('input', () => {
      nameInput.style.borderColor = '#ffaa00';
    });
    nameInput.focus();
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') enterBtn.click();
    });

    enterBtn.addEventListener('click', () => {
      const name = (nameInput.value || '').trim();
      if (!name) {
        nameInput.style.borderColor = '#ff3344';
        nameInput.focus();
        return;
      }
      this.gameState.setPlayerName(name);
      this.switchScene('levelSelect');
    });
  }

  _currentName() {
    const n = this.gameState.data.playerName;
    return (n && n !== 'Producer') ? n : '';
  }

  _buildPickerColumn(zone) {
    const col = document.createElement('div');
    col.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:8px; min-width:160px;';

    const label = document.createElement('div');
    label.style.cssText = 'font-size:10px; color:#00ddff; letter-spacing:1px; text-shadow: 0 0 6px #00ddff;';
    label.textContent = zone.label;
    col.appendChild(label);

    const row = document.createElement('div');
    row.style.cssText = 'display:flex; align-items:center; gap:8px;';

    const leftBtn = document.createElement('button');
    leftBtn.className = 'pixel-btn cyan';
    leftBtn.style.cssText = 'padding:8px 10px; font-size:10px;';
    leftBtn.textContent = '◀';
    row.appendChild(leftBtn);

    const thumbWrap = document.createElement('div');
    thumbWrap.style.cssText = 'width:96px; height:64px;';
    thumbWrap.appendChild(this._thumb(zone, this.gameState.data.characterParts[zone.key]));
    row.appendChild(thumbWrap);

    const rightBtn = document.createElement('button');
    rightBtn.className = 'pixel-btn cyan';
    rightBtn.style.cssText = 'padding:8px 10px; font-size:10px;';
    rightBtn.textContent = '▶';
    row.appendChild(rightBtn);

    col.appendChild(row);

    const idLabel = document.createElement('div');
    idLabel.style.cssText = 'font-size:8px; color:#ffaa00; letter-spacing:1px;';
    idLabel.textContent = IDENTITY_LABELS[this.gameState.data.characterParts[zone.key]];
    col.appendChild(idLabel);

    leftBtn.addEventListener('click', () => this._cycleZone(zone, -1, thumbWrap, idLabel));
    rightBtn.addEventListener('click', () => this._cycleZone(zone, +1, thumbWrap, idLabel));

    return col;
  }

  _thumb(zone, identity) {
    return spriteImage(
      characterPartUrl(zone.sprite, identity),
      `${IDENTITY_LABELS[identity]} ${zone.label}`,
      { width: 96, height: 64 }
    );
  }

  _cycleZone(zone, dir, thumbWrap, idLabel) {
    const current = this.gameState.data.characterParts[zone.key];
    const idx = IDENTITIES.indexOf(current);
    const next = IDENTITIES[(idx + dir + IDENTITIES.length) % IDENTITIES.length];
    this.gameState.setCharacterPart(zone.key, next);

    thumbWrap.innerHTML = '';
    thumbWrap.appendChild(this._thumb(zone, next));
    idLabel.textContent = IDENTITY_LABELS[next];

    this._refreshComposite();
  }

  _buildComposite() {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display:flex; flex-direction:column; align-items:center;
      width:256px;
      filter: drop-shadow(0 0 18px rgba(255,51,153,0.45));
    `;
    this._fillComposite(wrap);
    return wrap;
  }

  _fillComposite(wrap) {
    wrap.innerHTML = '';
    const parts = this.gameState.data.characterParts;
    const layers = [
      { sprite: 'top',    id: parts.head,  label: 'HEAD'  },
      { sprite: 'mid',    id: parts.torso, label: 'TORSO' },
      { sprite: 'bottom', id: parts.legs,  label: 'LEGS'  },
    ];
    for (const layer of layers) {
      wrap.appendChild(spriteImage(
        characterPartUrl(layer.sprite, layer.id),
        `${IDENTITY_LABELS[layer.id]} ${layer.label}`,
        { width: 256, height: 128 }
      ));
    }
  }

  _refreshComposite() {
    if (this.compositeEl) this._fillComposite(this.compositeEl);
  }

  hide() {
    if (this.el) { this.el.remove(); this.el = null; }
    this.compositeEl = null;
  }

  update() {}
}
