/**
 * CharacterSelectScene — pick 1 of 6 styles × 2 presentations + name + city.
 * City uses OpenStreetMap Nominatim live autocomplete (free, no API key,
 * structured place data with lat/lon).
 */
import { characterImage } from '../ui/SpriteImage.js';

const STYLES = ['boombap', 'gfunk', 'punk', 'beatmaker', 'otaku', 'feline'];
const STYLE_LABELS = {
  boombap: 'BOOMBAP', gfunk: 'G-FUNK', punk: 'PUNK',
  beatmaker: 'BEATMAKER', otaku: 'OTAKU', feline: 'FELINE',
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

    this.previewWrap = this._buildPreview();
    body.appendChild(this.previewWrap);
    body.appendChild(this._buildStyleRow());
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

    // City input — Nominatim autocomplete dropdown
    const cityWrap = document.createElement('div');
    cityWrap.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:4px; margin-top:8px; position:relative;';
    const currentCity = this.gameState.data.playerCity || '';
    cityWrap.innerHTML = `
      <label style="font-size:8px; color:#888; letter-spacing:1px;">YOUR CITY (OPTIONAL)</label>
      <div style="position:relative; width:280px;">
        <input id="cs-city" type="text" maxlength="80" autocomplete="off" spellcheck="false"
          value="${currentCity.replace(/"/g, '&quot;')}"
          placeholder="START TYPING — E.G. BOGOTÁ"
          style="
            font-family:'Press Start 2P', monospace;
            font-size:9px; padding:8px 12px;
            background:#0a0a1e; color:#00ddff;
            border:2px solid #00ddff; text-align:center;
            text-transform:uppercase; width:100%; box-sizing:border-box;
            letter-spacing:1px; outline:none;
          " />
        <div id="cs-city-results" style="
          position:absolute; top:100%; left:0; right:0;
          margin-top:2px; max-height:200px; overflow-y:auto;
          background:#0a0a1e; border:2px solid #00ddff;
          z-index:100; display:none;
          font-family:'Press Start 2P', monospace;
        "></div>
      </div>
      <div id="cs-city-status" style="font-size:6px; color:#666; letter-spacing:1px; min-height:9px;"></div>
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
    const cityResults = body.querySelector('#cs-city-results');
    const cityStatus = body.querySelector('#cs-city-status');
    let cityFetchTimer = null;
    let selectedPlace = null;

    const renderResults = (places) => {
      cityResults.innerHTML = '';
      if (!places || !places.length) {
        cityResults.style.display = 'none';
        cityStatus.textContent = 'NO MATCHES — TYPE FREELY';
        cityStatus.style.color = '#888';
        return;
      }
      places.slice(0, 5).forEach(p => {
        const row = document.createElement('div');
        row.style.cssText = `
          padding:8px 10px; cursor:pointer;
          font-size:8px; color:#fff; line-height:1.5;
          border-bottom:1px solid #1a1a3e;
        `;
        row.textContent = p.display_name;
        row.addEventListener('mouseenter', () => { row.style.background = '#1a1a3e'; });
        row.addEventListener('mouseleave', () => { row.style.background = 'transparent'; });
        row.addEventListener('click', () => {
          cityInput.value = p.display_name;
          selectedPlace = { displayName: p.display_name, lat: parseFloat(p.lat), lon: parseFloat(p.lon), placeId: p.place_id };
          cityResults.style.display = 'none';
          cityStatus.textContent = `✓ ${p.display_name.slice(0, 40)}${p.display_name.length > 40 ? '…' : ''}`;
          cityStatus.style.color = '#00cc44';
        });
        cityResults.appendChild(row);
      });
      cityResults.style.display = 'block';
      cityStatus.textContent = '';
    };

    const fetchCitySuggestions = (q) => {
      cityStatus.textContent = 'SEARCHING…';
      cityStatus.style.color = '#888';
      fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&addressdetails=0`, {
        headers: { 'Accept': 'application/json' },
      })
        .then(r => r.json())
        .then(renderResults)
        .catch(() => {
          cityStatus.textContent = '⚠ COULD NOT REACH MAPS — TYPE FREELY';
          cityStatus.style.color = '#ffaa00';
        });
    };

    cityInput.addEventListener('input', () => {
      selectedPlace = null;
      const q = (cityInput.value || '').trim();
      if (cityFetchTimer) clearTimeout(cityFetchTimer);
      if (q.length < 3) {
        cityResults.style.display = 'none';
        cityStatus.textContent = '';
        return;
      }
      cityFetchTimer = setTimeout(() => fetchCitySuggestions(q), 350);
    });
    cityInput.addEventListener('focus', () => {
      if (cityResults.children.length) cityResults.style.display = 'block';
    });
    cityInput.addEventListener('blur', () => {
      setTimeout(() => { cityResults.style.display = 'none'; }, 200);
    });

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
      if (selectedPlace) this.gameState.setPlayerCityData(selectedPlace);
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
