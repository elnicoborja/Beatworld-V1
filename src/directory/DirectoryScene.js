/**
 * DirectoryScene — global producer directory.
 *
 * 6 cards: 5 mock + 1 YOU card showing the player's character composite + boombox.
 * Single CTA to join via mailto (real Klaviyo wiring is post-launch — see TODO below).
 */
import { spriteImage, characterPartUrl } from '../ui/SpriteImage.js';
import { mountSoundOsFooter } from '../ui/SoundOsFooter.js';
import { CHORD_PROGRESSIONS } from '../studio/AudioEngine.js';
import { renderDirectoryAvatar, renderDirectoryRigIcon } from '../art/directory-sprites.js';

// TODO: switch to Klaviyo POST when list is provisioned.
const JOIN_EMAIL_TO = 'hola@nicoborja.com';
const JOIN_SUBJECT = 'Beat World — Join the Directory';

const MOCK_PRODUCERS = [
  { name: 'DJ PRIMO',        city: 'NEW YORK, USA',     rig: 'BOOMBOX',          rigType: 'boombox',           avatarVariant: 1,      bio: 'Boom bap loyalist building a Bronx-style rig.' },
  { name: 'MARCELA BASS',    city: 'CARTAGENA, COL',    rig: 'PICÓ STACK',       rigType: 'pico',        avatarVariant: 2,  bio: 'Custom picó painter mixing champeta and reggaeton.' },
  { name: 'TOKYO BREAKER',   city: 'TOKYO, JPN',        rig: 'BOOMBOX',          rigType: 'boombox',           avatarVariant: 3, bio: 'Late-night chops in a 6-tatami bedroom studio.' },
  { name: 'BERLIN GHOST',    city: 'BERLIN, DEU',       rig: 'WAREHOUSE STACK',  rigType: 'warehouse-stack',   avatarVariant: 4,  bio: 'Function-One disciple. Industrial techno only.' },
  { name: 'SOFIA SYSTEM',    city: 'SÃO PAULO, BRA',    rig: 'BAILE FUNK TRUCK', rigType: 'baile-funk-truck',  avatarVariant: 5,  bio: 'Wheels in the favela, bass in the air.' },
];

export class DirectoryScene {
  constructor(gameState, switchScene) {
    this.gameState = gameState;
    this.switchScene = switchScene;
    this.el = null;
  }

  show() {
    const container = document.getElementById('screen-container');
    this.el = document.createElement('div');
    this.el.className = 'scene-overlay';
    this.el.style.cssText = 'background: radial-gradient(ellipse at top, #1a1a3e 0%, #0a0a1e 70%);';

    const body = document.createElement('div');
    body.className = 'scene-body';
    body.style.cssText = 'padding:32px 24px; gap:18px;';

    const title = document.createElement('h1');
    title.className = 'scene-title';
    title.textContent = 'GLOBAL SOUND SYSTEM DIRECTORY';
    title.style.fontSize = '18px';
    body.appendChild(title);

    const subtitle = document.createElement('h2');
    subtitle.className = 'scene-subtitle';
    subtitle.textContent = 'PRODUCERS BUILDING THEIR RIGS.';
    body.appendChild(subtitle);

    // Cards grid
    const grid = document.createElement('div');
    grid.style.cssText = `
      display:grid; gap:12px; width:100%; max-width:780px; margin:0 auto;
      grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));
    `;
    // YOU card first
    grid.appendChild(this._buildYouCard());
    // Then mock producers
    MOCK_PRODUCERS.forEach((p) => grid.appendChild(this._buildMockCard(p)));
    body.appendChild(grid);

    // Action row
    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex; gap:14px; margin-top:24px; flex-wrap:wrap; justify-content:center;';

    const joinBtn = document.createElement('button');
    joinBtn.className = 'pixel-btn cyan';
    joinBtn.style.cssText = 'font-size:10px; padding:14px 20px; box-shadow: 0 0 16px #00ddff;';
    joinBtn.textContent = '+ JOIN THE DIRECTORY';
    joinBtn.addEventListener('click', () => this._openJoinForm());
    actions.appendChild(joinBtn);

    const backBtn = document.createElement('button');
    backBtn.className = 'pixel-btn magenta';
    backBtn.style.cssText = 'font-size:10px; padding:14px 20px;';
    backBtn.textContent = '← BACK TO LEVELS';
    backBtn.addEventListener('click', () => this.switchScene('levelSelect'));
    actions.appendChild(backBtn);

    body.appendChild(actions);

    this.el.appendChild(body);
    container.appendChild(this.el);
    mountSoundOsFooter(this.el);
  }

  _buildYouCard() {
    const card = document.createElement('div');
    card.style.cssText = `
      padding:14px; border:2px solid #ffaa00;
      background:rgba(255,170,0,0.08);
      box-shadow: 0 0 16px rgba(255,170,0,0.4), inset 0 0 8px rgba(255,170,0,0.2);
      display:flex; flex-direction:column; gap:10px;
    `;
    const tag = document.createElement('div');
    tag.style.cssText = 'font-size:7px; color:#ffaa00; letter-spacing:2px;';
    tag.textContent = 'YOU ★';
    card.appendChild(tag);

    // Header row: character composite (small) + name/city
    const head = document.createElement('div');
    head.style.cssText = 'display:flex; gap:10px; align-items:center;';
    const parts = this.gameState.data.characterParts;
    const comp = document.createElement('div');
    comp.style.cssText = 'display:flex; flex-direction:column; width:48px; height:144px; flex-shrink:0;';
    comp.appendChild(spriteImage(characterPartUrl('top', parts.head),    'HEAD',  { width: 48, height: 48 }));
    comp.appendChild(spriteImage(characterPartUrl('mid', parts.torso),   'TORSO', { width: 48, height: 48 }));
    comp.appendChild(spriteImage(characterPartUrl('bottom', parts.legs), 'LEGS',  { width: 48, height: 48 }));
    head.appendChild(comp);

    const meta = document.createElement('div');
    meta.style.cssText = 'display:flex; flex-direction:column; gap:4px;';
    const cpName = CHORD_PROGRESSIONS[this.gameState.data.audioPrefs.chordProgression || 0]?.name || 'BOOM BAP';
    meta.innerHTML = `
      <div style="font-size:9px; color:#fff; letter-spacing:1px;">${this.gameState.data.playerName}</div>
      <div style="font-size:7px; color:#888;">YOUR CITY</div>
      <div style="font-size:7px; color:#00ddff;">RIG: BOOMBOX</div>
      <div style="font-size:6px; color:#888;">STYLE: ${cpName}</div>
    `;
    head.appendChild(meta);
    card.appendChild(head);

    // Boombox slot
    const piece = document.createElement('div');
    piece.style.cssText = 'width:100%; height:100px; display:flex; justify-content:center; align-items:center;';
    piece.appendChild(spriteImage(
      '/assets/sprites/soundsystem/boombox.png',
      'BOOMBOX',
      { width: 100, height: 100, style: 'filter: drop-shadow(0 0 8px #ff3399);' }
    ));
    card.appendChild(piece);

    const bio = document.createElement('div');
    bio.style.cssText = 'font-size:6px; color:#aaa; line-height:1.6; font-style:italic;';
    bio.textContent = '"FIRST BEAT. FIRST RIG. THE START OF SOMETHING."';
    card.appendChild(bio);

    return card;
  }

  _buildMockCard(p) {
    const card = document.createElement('div');
    card.style.cssText = `
      padding:14px; border:1px solid #333;
      background:rgba(20,20,50,0.5);
      display:flex; flex-direction:column; gap:10px;
      transition: border-color 0.15s;
    `;
    card.addEventListener('mouseenter', () => { card.style.borderColor = '#00ddff'; });
    card.addEventListener('mouseleave', () => { card.style.borderColor = '#333'; });

    const head = document.createElement('div');
    head.style.cssText = 'display:flex; gap:10px; align-items:flex-start;';
    const avatar = document.createElement('div');
    avatar.style.cssText = 'width:48px; height:48px; flex-shrink:0; display:flex; align-items:center; justify-content:center;';
    avatar.innerHTML = renderDirectoryAvatar(p.avatarVariant, { size: 48, ariaLabel: `${p.name} avatar` });
    head.appendChild(avatar);

    const meta = document.createElement('div');
    meta.style.cssText = 'display:flex; flex-direction:column; gap:3px;';
    meta.innerHTML = `
      <div style="font-size:9px; color:#fff; letter-spacing:1px;">${p.name}</div>
      <div style="font-size:6px; color:#888;">${p.city}</div>
      <div style="font-size:7px; color:#00ddff;">RIG: ${p.rig}</div>
    `;
    head.appendChild(meta);
    card.appendChild(head);

    const piece = document.createElement('div');
    piece.style.cssText = 'width:100%; height:100px; display:flex; align-items:center; justify-content:center;';
    piece.innerHTML = renderDirectoryRigIcon(p.rigType, { size: 92, ariaLabel: `${p.rig} icon` });
    card.appendChild(piece);

    const bio = document.createElement('div');
    bio.style.cssText = 'font-size:6px; color:#888; line-height:1.6; font-style:italic;';
    bio.textContent = `"${p.bio}"`;
    card.appendChild(bio);

    return card;
  }

  _openJoinForm() {
    document.getElementById('join-modal')?.remove();
    const modal = document.createElement('div');
    modal.id = 'join-modal';
    modal.style.cssText = `
      position:fixed; inset:0; background:rgba(0,0,0,0.85);
      display:flex; align-items:center; justify-content:center; z-index:9999;
      font-family:'Press Start 2P', monospace;
    `;
    modal.innerHTML = `
      <div style="
        background:#0a0a1e; border:2px solid #00ddff; padding:28px;
        max-width:480px; box-shadow: 0 0 32px #00ddff;
        display:flex; flex-direction:column; gap:14px;
      ">
        <div style="font-size:13px; color:#00ddff; text-shadow: 0 0 8px #00ddff; letter-spacing:2px;">
          JOIN THE DIRECTORY
        </div>
        <div style="font-size:7px; color:#aaa; line-height:1.7;">
          DROP YOUR EMAIL. WE'LL ADD YOU WHEN LEVEL 2 SHIPS.
        </div>
        <input id="join-email" type="email" placeholder="YOU@EXAMPLE.COM"
          style="
            font-family:'Press Start 2P', monospace; font-size:9px;
            padding:10px 12px; background:#1a1a3e; color:#ffaa00;
            border:2px solid #ffaa00; outline:none;
            text-align:center; letter-spacing:1px;
          " />
        <div style="display:flex; gap:10px;">
          <button class="pixel-btn cyan" id="join-submit" style="font-size:9px; padding:10px 16px; flex:1;">SEND →</button>
          <button class="pixel-btn secondary" id="join-cancel" style="font-size:9px; padding:10px 16px;">CANCEL</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('#join-cancel').addEventListener('click', close);
    modal.querySelector('#join-submit').addEventListener('click', () => {
      const input = modal.querySelector('#join-email');
      const email = (input.value || '').trim();
      if (!email || !email.includes('@')) {
        input.style.borderColor = '#ff3344';
        input.focus();
        return;
      }
      const body = encodeURIComponent(`Email: ${email}\nProducer: ${this.gameState.data.playerName}`);
      const subject = encodeURIComponent(JOIN_SUBJECT);
      window.location.href = `mailto:${JOIN_EMAIL_TO}?subject=${subject}&body=${body}`;
      close();
    });
  }

  hide() {
    if (this.el) { this.el.remove(); this.el = null; }
    document.getElementById('join-modal')?.remove();
  }

  update() {}
}
