/**
 * CharacterSelectScene — pick 1 of 6 styles × 2 presentations.
 *
 * Style cycle: boombap → gfunk → punk → beatmaker → otaku → feline → (loops)
 * Presentation pills: [ M ] [ F ]
 * 12 visual variants total. Style + presentation save immediately so
 * a refresh mid-customize is preserved. Name commits only on ENTER WORLD.
 *
 * TODO v1.1: replace fixed-style picker with user-uploaded character editor.
 * Spec: drag-drop a 256x384 transparent PNG, validate dimensions,
 * store in localStorage as base64, render directly.
 */
import { characterImage } from '../ui/SpriteImage.js';

const STYLES = ['boombap', 'gfunk', 'punk', 'beatmaker', 'otaku', 'feline'];
const STYLE_LABELS = {
  boombap: 'BOOMBAP',
  gfunk: 'G-FUNK',
  punk: 'PUNK',
  beatmaker: 'BEATMAKER',
  otaku: 'OTAKU',
  feline: 'FELINE',
};
const PRESENTATIONS = ['m', 'f'];
const PRESENTATION_LABELS = { m: 'M', f: 'F' };

export class CharacterSelectScene {
  constructor(gameState, switchScene) {
    this.gameState = gameState;
    this.switchScene = switchScene;
    this.el = null;
    this.previewWrap = null;
    this.styleLabel = null;
    this.presentationButtons = {};
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
    subtitle.textContent = 'PICK YOUR CHARACTER';
    body.appendChild(subtitle);

    // Live preview
    this.previewWrap = this._buildPreview();
    body.appendChild(this.previewWrap);

    // Style cycle row: ◀ STYLE_NAME ▶
    body.appendChild(this._buildStyleRow());

    // Presentation pills: [ M ]  [ F ]
    body.appendChild(this._buildPresentationRow());

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

    const enterBtn = document.createElement('button');
    enterBtn.className = 'pixel-btn primary';
    enterBtn.style.cssText = 'font-size:12px; padding:14px 28px; margin-top:8px;';
    enterBtn.textContent = 'ENTER WORLD ▶';
    body.appendChild(enterBtn);

    this.el.appendChild(body);
    container.appendChild(this.el);

    const nameInput = body.querySelector('#cs-name');
    nameInput.addEventListener('input', () => { nameInput.style.borderColor = '#ffaa00'; });
    nameInput.focus();
    nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') enterBtn.click(); });

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

  _buildStyleRow() {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex; align-items:center; gap:14px; margin-top:6px;';

    const leftBtn = document.createElement('button');
    leftBtn.className = 'pixel-btn cyan';
    leftBtn.style.cssText = 'padding:10px 14px; font-size:12px;';
    leftBtn.textContent = '◀';
    row.appendChild(leftBtn);

    this.styleLabel = document.createElement('div');
    this.styleLabel.style.cssText = `
      min-width:180px; text-align:center;
      font-size:14px; color:#ffaa00; letter-spacing:2px;
      text-shadow: 0 0 10px #ffaa00;
    `;
    this.styleLabel.textContent = STYLE_LABELS[this.gameState.data.style];
    row.appendChild(this.styleLabel);

    const rightBtn = document.createElement('button');
    rightBtn.className = 'pixel-btn cyan';
    rightBtn.style.cssText = 'padding:10px 14px; font-size:12px;';
    rightBtn.textContent = '▶';
    row.appendChild(rightBtn);

    leftBtn.addEventListener('click', () => this._cycleStyle(-1));
    rightBtn.addEventListener('click', () => this._cycleStyle(+1));
    return row;
  }

  _buildPresentationRow() {
    const row = document.createElement('div');
    // Slightly larger gap between the two pills (was 14px on the style row, 28px here)
    row.style.cssText = 'display:flex; align-items:center; gap:28px; margin-top:4px;';
    this.presentationButtons = {};
    const current = this.gameState.data.presentation;
    PRESENTATIONS.forEach((p) => {
      const btn = document.createElement('button');
      btn.className = 'pixel-btn';
      btn.dataset.p = p;
      btn.textContent = PRESENTATION_LABELS[p];
      btn.style.cssText = this._pillStyle(p === current);
      btn.addEventListener('click', () => this._selectPresentation(p));
      row.appendChild(btn);
      this.presentationButtons[p] = btn;
    });
    return row;
  }

  _pillStyle(active) {
    return `
      font-family:'Press Start 2P', monospace; font-size:12px;
      padding:10px 22px; cursor:pointer;
      background:${active ? '#ff3399' : '#1a1a3e'};
      color:${active ? '#fff' : '#888'};
      border:2px solid ${active ? '#ff3399' : '#333'};
      box-shadow:${active ? '0 0 10px #ff3399' : '2px 2px 0 #000'};
    `;
  }

  _selectPresentation(p) {
    this.gameState.setPresentation(p);
    Object.entries(this.presentationButtons).forEach(([key, btn]) => {
      btn.style.cssText = this._pillStyle(key === p);
    });
    this._fillPreview(this.previewWrap);
  }

  _buildPreview() {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display:flex; align-items:center; justify-content:center;
      width:256px; height:384px;
      filter: drop-shadow(0 0 18px rgba(255,51,153,0.45));
    `;
    this._fillPreview(wrap);
    return wrap;
  }

  _fillPreview(wrap) {
    wrap.innerHTML = '';
    const { style, presentation } = this.gameState.data;
    wrap.appendChild(characterImage(style, presentation, { width: 256, height: 384 }));
  }

  _cycleStyle(dir) {
    const current = this.gameState.data.style;
    const idx = STYLES.indexOf(current);
    const next = STYLES[(idx + dir + STYLES.length) % STYLES.length];
    this.gameState.setStyle(next);
    this.styleLabel.textContent = STYLE_LABELS[next];
    this._fillPreview(this.previewWrap);
  }

  hide() {
    if (this.el) { this.el.remove(); this.el = null; }
    this.previewWrap = null;
    this.styleLabel = null;
    this.presentationButtons = {};
  }

  update() {}
}
