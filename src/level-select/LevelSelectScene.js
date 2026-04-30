/**
 * LevelSelectScene — vertical list of 6 level cards.
 * L1 unlocked, L2-L6 visibly locked. Locked cards open a COMING SOON
 * interstitial with email signup.
 */
import { LEVEL_PROGRESSION } from '../data/LevelProgression.js';
import { spriteImage, characterImage } from '../ui/SpriteImage.js';
import { subscribeBeatworldEmail } from '../utils/KlaviyoBeatworld.js';

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

    this.el.appendChild(this._buildIdentityChip());
    this.el.appendChild(this._buildEditButton());

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
    const { style, presentation } = this.gameState.data;
    chip.appendChild(characterImage(style, presentation, { width: 96, height: 144 }));
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
      cursor:pointer;
      box-shadow:${isUnlocked ? `0 0 16px ${level.color}55, inset 0 0 8px ${level.color}33` : 'none'};
      transition: transform 0.1s, box-shadow 0.1s;
      opacity:${isUnlocked ? 1 : 0.78};
    `;

    const num = document.createElement('div');
    num.style.cssText = `
      font-size:32px; color:${isUnlocked ? level.color : '#555'};
      text-shadow:${isUnlocked ? `0 0 12px ${level.color}` : 'none'};
      text-align:center; letter-spacing:1px;
    `;
    num.textContent = String(level.level).padStart(2, '0');
    card.appendChild(num);

    const info = document.createElement('div');
    info.style.cssText = 'display:flex; flex-direction:column; gap:6px;';
    const tag = isCompleted ? '<span style="color:#00cc44;">✓ COMPLETE</span>'
              : isUnlocked  ? '<span style="color:#ffaa00;">▶ READY</span>'
                            : '<span style="color:#888;">🔒 COMING SOON · TAP TO PREVIEW</span>';
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

    const pieceSlot = document.createElement('div');
    pieceSlot.style.cssText = 'width:128px; height:128px;';
    if (isUnlocked) {
      pieceSlot.appendChild(spriteImage(level.pieceSprite, `${level.piece} SPRITE`, { width: 128, height: 128 }));
    } else {
      const lockBox = document.createElement('div');
      lockBox.className = 'sprite-placeholder';
      lockBox.style.cssText = 'width:100%; height:100%; opacity:0.55; border-color:#444; color:#444;';
      lockBox.textContent = `🔒 ${level.piece}`;
      pieceSlot.appendChild(lockBox);
    }
    card.appendChild(pieceSlot);

    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translate(-2px, -2px)';
      card.style.boxShadow = `0 0 24px ${level.color}aa, inset 0 0 12px ${level.color}55`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = isUnlocked ? `0 0 16px ${level.color}55, inset 0 0 8px ${level.color}33` : 'none';
    });
    card.addEventListener('click', () => {
      if (isUnlocked) this.enterCity(level.cityId);
      else this._openPreviewModal(level);
    });

    return card;
  }

  // ── Coming-soon preview modal (locked levels) ───────────────
  _openPreviewModal(level) {
    document.getElementById('level-preview-modal')?.remove();
    const modal = document.createElement('div');
    modal.id = 'level-preview-modal';
    modal.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.92);
      display:flex; align-items:center; justify-content:center; z-index:9999;
      font-family:'Press Start 2P', monospace;
    `;
    const previewBgUrl = `/assets/sprites/venues/preview-${level.cityId}.png`;
    modal.innerHTML = `
      <div style="
        position:relative; width:90vw; max-width:780px; max-height:90vh;
        background:#0a0a1e; border:3px solid ${level.color};
        box-shadow: 0 0 40px ${level.color}aa, inset 0 0 24px ${level.color}33;
        display:flex; flex-direction:column; overflow:hidden;
      ">
        <div style="
          position:relative; width:100%; aspect-ratio: 16/9;
          background-image:url('${previewBgUrl}'), linear-gradient(135deg, ${level.color}33 0%, #0a0a1e 100%);
          background-size:cover; background-position:center;
          image-rendering:pixelated;
          display:flex; align-items:center; justify-content:center;
        ">
          <div style="
            position:absolute; inset:0;
            background:repeating-linear-gradient(45deg, rgba(0,0,0,0) 0 16px, rgba(0,0,0,0.18) 16px 32px);
          "></div>
          <div style="
            position:relative; z-index:2;
            font-size:36px; color:#fff;
            text-shadow: 0 0 24px ${level.color}, 4px 4px 0 #000;
            letter-spacing:6px; transform:rotate(-6deg);
            background:${level.color}; padding:12px 28px;
            border:3px solid #000; box-shadow: 6px 6px 0 #000;
          ">COMING SOON</div>
        </div>
        <div style="padding:22px 28px; display:flex; flex-direction:column; gap:14px;">
          <div style="font-size:10px; color:#888; letter-spacing:2px;">
            LEVEL ${String(level.level).padStart(2,'0')}
          </div>
          <div style="font-size:18px; color:${level.color}; letter-spacing:3px; text-shadow: 0 0 10px ${level.color};">
            ${level.region} · ${level.genre}
          </div>
          <div style="font-size:9px; color:#aaa; letter-spacing:1px;">
            UNLOCKS: <span style="color:#00ddff;">${level.piece}</span>
          </div>
          <div style="font-size:8px; color:#888; line-height:1.7; padding:8px 0;">
            BE THE FIRST TO KNOW WHEN ${level.region} OPENS.<br/>
            DROP YOUR EMAIL — WE'LL TELL YOU WHEN IT'S LIVE.
          </div>
          <input id="lv-preview-email" type="email" placeholder="YOU@EXAMPLE.COM"
            style="
              font-family:'Press Start 2P', monospace; font-size:9px;
              padding:10px 12px; background:#1a1a3e; color:${level.color};
              border:2px solid ${level.color}; outline:none;
              text-align:center; letter-spacing:1px;
            " />
          <div style="display:flex; gap:10px;">
            <button class="pixel-btn cyan" id="lv-preview-submit" style="font-size:10px; padding:10px 16px; flex:1;">
              SIGN UP FOR RELEASE →
            </button>
            <button class="pixel-btn secondary" id="lv-preview-close" style="font-size:9px; padding:10px 16px;">
              ← BACK
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector('#lv-preview-close').addEventListener('click', close);
    modal.querySelector('#lv-preview-submit').addEventListener('click', async () => {
      const input = modal.querySelector('#lv-preview-email');
      const submitBtn = modal.querySelector('#lv-preview-submit');
      const email = (input.value || '').trim();
      if (!email || !email.includes('@')) { input.style.borderColor = '#ff3344'; input.focus(); return; }

      submitBtn.disabled = true;
      const originalLabel = submitBtn.textContent;
      submitBtn.textContent = 'SUBSCRIBING…';
      input.style.borderColor = level.color;

      const result = await subscribeBeatworldEmail({
        email,
        firstName: this.gameState.data.playerName,
        customSource: `beatworld_l${level.level}_unlock`,
        properties: {
          requested_level: level.level,
          requested_region: level.region,
          requested_genre: level.genre,
          requested_piece: level.piece,
          producer_name: this.gameState.data.playerName || '',
          producer_city: this.gameState.data.playerCity || '',
          producer_maps_url: this.gameState.getPlayerCityMapsUrl?.() || '',
          current_clout: this.gameState.data.clout || 0,
        },
      });

      if (result.ok) {
        submitBtn.textContent = "✓ YOU'RE ON THE LIST";
        submitBtn.style.background = '#00cc44';
        submitBtn.style.color = '#000';
        setTimeout(close, 1400);
      } else {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
        input.style.borderColor = '#ff3344';
        // Surface a tiny inline error so the user knows it didn't go through.
        let err = modal.querySelector('#lv-preview-err');
        if (!err) {
          err = document.createElement('div');
          err.id = 'lv-preview-err';
          err.style.cssText = 'font-size:7px; color:#ff5566; text-align:center; padding-top:4px;';
          input.insertAdjacentElement('afterend', err);
        }
        err.textContent = result.error === 'invalid_email'
          ? 'CHECK YOUR EMAIL FORMAT'
          : 'SIGNUP FAILED — TRY AGAIN';
      }
    });
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  }

  hide() {
    if (this.el) { this.el.remove(); this.el = null; }
    document.getElementById('level-preview-modal')?.remove();
  }

  update() {}
}
