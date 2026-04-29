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

    // City input — free-text + a verify-on-Google-Maps preview link.
    // Stored as gameState.playerCity; used in producer card, mailto bodies,
    // and a future Klaviyo profile when newsletter wiring lands.
    const cityWrap = document.createElement('div');
    cityWrap.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:6px; margin-top:8px;';
    const currentCity = this.gameState.data.playerCity || '';
    cityWrap.innerHTML = `
      <label style="font-size:8px; color:#888; letter-spacing:1px;">YOUR CITY (OPTIONAL)</label>
      <input id="cs-city" type="text" maxlength="60" autocomplete="address-level2" spellcheck="false"
        value="${currentCity.replace(/"/g, '&quot;')}"
        placeholder="E.G. BOGOTÁ, COLOMBIA"
        style="
          font-family:'Press Start 2P', monospace;
          font-size:9px; padding:8px 12px;
          background:#0a0a1e; color:#00ddff;
          border:2px solid #00ddff; text-align:center;
          text-transform:uppercase; width:280px;
          letter-spacing:1px; outline:none;
        " />
      <a id="cs-city-verify" target="_blank" rel="noopener"
         style="
           font-size:6px; color:#888; letter-spacing:1px;
           text-decoration:underline; cursor:pointer;
           ${currentCity ? '' : 'visibility:hidden;'}
         ">
        VERIFY ON GOOGLE MAPS ↗
      </a>
    `;
    body.appendChild(cityWrap);

    const enterBtn = document.createElement('button');
    enterBtn.className = 'pixel-btn primary';
    enterBtn.style.cssText = 'font-size:12px; padding:14px 28px; margin-top:8px;';
    enterBtn.textContent = 'ENTER WORLD ▶';
    body.appendChild(enterBtn);

    this.el.appendChild(body);
    container.appendChild(this.el);

    const nameInput = body.querySelector('#cs-name');
    const cityInput = body.querySelector('#cs-city');
    const cityVerify = body.querySelector('#cs-city-verify');
    const updateVerifyLink = () => {
      const v = (cityInput.value || '').trim();
      if (v) {
        cityVerify.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v)}`;
        cityVerify.style.visibility = 'visible';
      } else {
        cityVerify.style.visibility = 'hidden';
      }
    };
    updateVerifyLink();
    cityInput.addEventListener('input', updateVerifyLink);
    nameInput.addEventListener('input', () => { nameInput.style.borderColor = '#ffaa00'; });
    nameInput.focus();
    nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') cityInput.focus(); });
    cityInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') enterBtn.click(); });

    enterBtn.addEventListener('click', () => {
      const name = (nameInput.value || '').trim();
      if (!name) {
        nameInput.style.borderColor = '#ff3344';
        nameInput.focus();
        return;
      }
      this.gameState.setPlayerName(name);
      this.gameState.setPlayerCity(cityInput.value || '');
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
    PRESENTATIONS.forEach(p => {
      const btn = document.createElement('button');
      const isActive = this.gameState.data.presentation === p;
      btn.style.cssText = `
        font-family:'Press Start 2P', monospace; font-size:14px;
        padding:10px 18px; cursor:pointer;
        background:${isActive ? '#ff3399' : '#1a1a3e'};
        color:${isActive ? '#fff' : '#888'};
        border:2px solid ${isActive ? '#ff3399' : '#333'};
        box-shadow:${isActive ? '0 0 8px #ff3399' : '2px 2px 0 #000'};
      `;
      btn.textContent = PRESENTATION_LABELS[p];
      btn.addEventListener('click', () => this._setPresentation(p));
      row.appendChild(btn);
      this.presentationButtons[p] = btn;
    });
    return row;
  }

  _buildPreview() {
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      width:200px; height:300px;
      display:flex; align-items:center; justify-content:center;
      margin:0 auto;
    `;
    const img = characterImage(this.gameState.data.style, this.gameState.data.presentation, { width: 192, height: 288 });
    wrap.appendChild(img);
    return wrap;
  }

  _cycleStyle(dir) {
    const cur = STYLES.indexOf(this.gameState.data.style);
    const next = STYLES[(cur + dir + STYLES.length) % STYLES.length];
    this.gameState.setStyle(next);
    this.styleLabel.textContent = STYLE_LABELS[next];
    this._refreshPreview();
  }

  _setPresentation(p) {
    this.gameState.setPresentation(p);
    PRESENTATIONS.forEach(other => {
      const btn = this.presentationButtons[other];
      const on = (other === p);
      btn.style.background = on ? '#ff3399' : '#1a1a3e';
      btn.style.color      = on ? '#fff'    : '#888';
      btn.style.borderColor = on ? '#ff3399' : '#333';
      btn.style.boxShadow   = on ? '0 0 8px #ff3399' : '2px 2px 0 #000';
    });
    this._refreshPreview();
  }

  _refreshPreview() {
    if (!this.previewWrap) return;
    this.previewWrap.innerHTML = '';
    const img = characterImage(this.gameState.data.style, this.gameState.data.presentation, { width: 192, height: 288 });
    this.previewWrap.appendChild(img);
  }

  hide() {
    if (this.el) { this.el.remove(); this.el = null; }
  }

  update() {}
}
