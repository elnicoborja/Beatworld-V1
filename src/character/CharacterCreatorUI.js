/**
 * CharacterCreatorUI — HTML-based character creator overlay
 * Ported from V1 CharacterCreator.tsx — simplified for contest deadline
 */

const SKIN_TONES = [
  { face: '#ffe0bd', shadow: '#d4a97a', label: 'Light' },
  { face: '#f1c27d', shadow: '#c8903a', label: 'Medium-Light' },
  { face: '#c68642', shadow: '#9a6020', label: 'Medium' },
  { face: '#8d5524', shadow: '#6b3a10', label: 'Medium-Dark' },
  { face: '#3d1c02', shadow: '#2a1000', label: 'Dark' },
];

const HAIR_COLORS = [
  '#111111','#443322','#884411','#ddaa55','#ffee00','#ffffff',
  '#ff3399','#00ffff','#ff0000','#00cc00','#9900cc','#ff8800',
];

const HAIR_STYLES = ['FADE','DREADS','SPIKES','BUZZ','MOP','PONYTAIL','AFRO','BRAIDS','MOHAWK','LONG','BUN','BALD'];
const TOP_STYLES = ['TEE','HOODIE','JACKET','TANK','JERSEY','SUIT'];
const PANTS_STYLES = ['JEANS','CARGOS','SHORTS','TRACK','SWEATS','SLACKS'];
const ACCESSORIES = ['NONE','HEADPHONES','SNAPBACK','SUNGLASSES','CHAIN','BANDANA','BEANIE','EARRING'];

const PALETTE = [
  '#ff3399','#00ffff','#ffee00','#0050cc','#cc3300','#44cc00',
  '#ff8800','#00aaaa','#6600cc','#fff8e7','#888899','#111111',
];

export class CharacterCreatorUI {
  constructor(gameState, onComplete) {
    this.gameState = gameState;
    this.onComplete = onComplete;
    this.el = null;

    // State
    this.name = gameState.data.playerName === 'Producer' ? '' : gameState.data.playerName;
    this.skinIdx = 2;
    this.hairStyle = 'FADE';
    this.hairColor = '#111111';
    this.topStyle = 'HOODIE';
    this.topColor = '#0050ff';
    this.pantsStyle = 'JEANS';
    this.pantsColor = '#111133';
    this.accessory = 'HEADPHONES';
  }

  show(container) {
    this.el = document.createElement('div');
    this.el.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      background: linear-gradient(180deg, #0a0a1e 0%, #1a1040 100%);
      font-family: 'Press Start 2P', monospace; overflow-y: auto;
      padding: 20px;
    `;

    this.el.innerHTML = `
      <h1 style="font-size:16px;color:#ffaa00;margin-bottom:8px;text-shadow:2px 2px 0 #ff3399;">
        CREATE YOUR PRODUCER
      </h1>
      <p style="font-size:7px;color:#888;margin-bottom:20px;">CUSTOMIZE YOUR CHARACTER & ENTER BEAT WORLD</p>

      <div style="width:100%;max-width:500px;">
        <!-- Name -->
        <div style="margin-bottom:16px;">
          <label style="font-size:7px;color:#ffaa00;display:block;margin-bottom:6px;">PRODUCER NAME</label>
          <input id="cc-name" type="text" maxlength="16" placeholder="YOUR NAME" value="${this.name}"
            style="width:100%;padding:8px 12px;background:#121228;border:2px solid #ffaa00;color:#fff;
            font-family:'Press Start 2P',monospace;font-size:8px;outline:none;" />
        </div>

        <!-- Skin Tone -->
        <div style="margin-bottom:16px;">
          <label style="font-size:7px;color:#ffaa00;display:block;margin-bottom:6px;">SKIN TONE</label>
          <div id="cc-skin" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
        </div>

        <!-- Hair Style -->
        <div style="margin-bottom:16px;">
          <label style="font-size:7px;color:#ffaa00;display:block;margin-bottom:6px;">HAIR STYLE</label>
          <div id="cc-hair-style" style="display:flex;gap:4px;flex-wrap:wrap;"></div>
        </div>

        <!-- Hair Color -->
        <div style="margin-bottom:16px;">
          <label style="font-size:7px;color:#ffaa00;display:block;margin-bottom:6px;">HAIR COLOR</label>
          <div id="cc-hair-color" style="display:flex;gap:4px;flex-wrap:wrap;"></div>
        </div>

        <!-- Top -->
        <div style="margin-bottom:16px;">
          <label style="font-size:7px;color:#ffaa00;display:block;margin-bottom:6px;">TOP</label>
          <div style="display:flex;gap:8px;align-items:center;">
            <div id="cc-top-style" style="display:flex;gap:4px;flex-wrap:wrap;flex:1;"></div>
            <div id="cc-top-color" style="display:flex;gap:3px;flex-wrap:wrap;max-width:180px;"></div>
          </div>
        </div>

        <!-- Pants -->
        <div style="margin-bottom:16px;">
          <label style="font-size:7px;color:#ffaa00;display:block;margin-bottom:6px;">PANTS</label>
          <div style="display:flex;gap:8px;align-items:center;">
            <div id="cc-pants-style" style="display:flex;gap:4px;flex-wrap:wrap;flex:1;"></div>
            <div id="cc-pants-color" style="display:flex;gap:3px;flex-wrap:wrap;max-width:180px;"></div>
          </div>
        </div>

        <!-- Accessory -->
        <div style="margin-bottom:20px;">
          <label style="font-size:7px;color:#ffaa00;display:block;margin-bottom:6px;">ACCESSORY</label>
          <div id="cc-accessory" style="display:flex;gap:4px;flex-wrap:wrap;"></div>
        </div>

        <!-- Enter Button -->
        <button id="cc-enter" class="pixel-btn primary" style="width:100%;font-size:10px;padding:14px;">
          ENTER BEAT WORLD →
        </button>
      </div>
    `;

    container.appendChild(this.el);
    this._populateOptions();
    this._wireEvents();
  }

  _makeChip(text, isSelected, onClick) {
    const chip = document.createElement('div');
    chip.style.cssText = `
      padding:4px 8px; font-size:6px; cursor:pointer; border:1px solid ${isSelected ? '#ffaa00' : '#333'};
      background:${isSelected ? '#ffaa00' : '#1a1a3e'}; color:${isSelected ? '#111' : '#888'};
      font-family:'Press Start 2P',monospace; transition:all 0.1s;
    `;
    chip.textContent = text;
    chip.addEventListener('click', onClick);
    return chip;
  }

  _makeColorSwatch(color, isSelected, onClick) {
    const swatch = document.createElement('div');
    swatch.style.cssText = `
      width:20px; height:20px; cursor:pointer; border:2px solid ${isSelected ? '#fff' : '#333'};
      background:${color};
    `;
    swatch.addEventListener('click', onClick);
    return swatch;
  }

  _populateOptions() {
    // Skin tones
    const skinCont = this.el.querySelector('#cc-skin');
    SKIN_TONES.forEach((st, i) => {
      skinCont.appendChild(this._makeColorSwatch(st.face, i === this.skinIdx, () => {
        this.skinIdx = i;
        this._refreshSelections();
      }));
    });

    // Hair styles
    const hairCont = this.el.querySelector('#cc-hair-style');
    HAIR_STYLES.forEach(s => {
      hairCont.appendChild(this._makeChip(s, s === this.hairStyle, () => {
        this.hairStyle = s;
        this._refreshSelections();
      }));
    });

    // Hair colors
    const hcCont = this.el.querySelector('#cc-hair-color');
    HAIR_COLORS.forEach(c => {
      hcCont.appendChild(this._makeColorSwatch(c, c === this.hairColor, () => {
        this.hairColor = c;
        this._refreshSelections();
      }));
    });

    // Top styles
    const tsCont = this.el.querySelector('#cc-top-style');
    TOP_STYLES.forEach(s => {
      tsCont.appendChild(this._makeChip(s, s === this.topStyle, () => {
        this.topStyle = s;
        this._refreshSelections();
      }));
    });

    // Top colors
    const tcCont = this.el.querySelector('#cc-top-color');
    PALETTE.forEach(c => {
      tcCont.appendChild(this._makeColorSwatch(c, c === this.topColor, () => {
        this.topColor = c;
        this._refreshSelections();
      }));
    });

    // Pants styles
    const psCont = this.el.querySelector('#cc-pants-style');
    PANTS_STYLES.forEach(s => {
      psCont.appendChild(this._makeChip(s, s === this.pantsStyle, () => {
        this.pantsStyle = s;
        this._refreshSelections();
      }));
    });

    // Pants colors
    const pcCont = this.el.querySelector('#cc-pants-color');
    PALETTE.forEach(c => {
      pcCont.appendChild(this._makeColorSwatch(c, c === this.pantsColor, () => {
        this.pantsColor = c;
        this._refreshSelections();
      }));
    });

    // Accessories
    const accCont = this.el.querySelector('#cc-accessory');
    ACCESSORIES.forEach(a => {
      accCont.appendChild(this._makeChip(a, a === this.accessory, () => {
        this.accessory = a;
        this._refreshSelections();
      }));
    });
  }

  _refreshSelections() {
    // Re-render all options (simple approach for contest deadline)
    const sections = ['cc-skin','cc-hair-style','cc-hair-color','cc-top-style','cc-top-color','cc-pants-style','cc-pants-color','cc-accessory'];
    sections.forEach(id => {
      const el = this.el.querySelector(`#${id}`);
      if (el) el.innerHTML = '';
    });
    this._populateOptions();
  }

  _wireEvents() {
    this.el.querySelector('#cc-enter').addEventListener('click', () => {
      const name = this.el.querySelector('#cc-name').value.trim() || 'Producer';
      this.gameState.update({
        playerName: name,
        character: {
          skinTone: SKIN_TONES[this.skinIdx].face,
          hairStyle: this.hairStyle.toLowerCase(),
          hairColor: this.hairColor,
          topStyle: this.topStyle.toLowerCase(),
          topColor: this.topColor,
          pantsStyle: this.pantsStyle.toLowerCase(),
          pantsColor: this.pantsColor,
          accessory: this.accessory.toLowerCase(),
          expression: 'neutral',
        },
      });
      this.onComplete();
    });
  }

  hide() {
    if (this.el) {
      this.el.remove();
      this.el = null;
    }
  }
}
