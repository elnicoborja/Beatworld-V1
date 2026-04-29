/**
 * DirectoryScene — global producer directory.
 *
 * 6 cards: 5 mock + 1 YOU card showing the player's character composite + boombox.
 * Single CTA to join via mailto (real Klaviyo wiring is post-launch — see TODO below).
 */
import { spriteImage, characterImage } from '../ui/SpriteImage.js';
import { mountSoundOsFooter } from '../ui/SoundOsFooter.js';
import { CHORD_PROGRESSIONS } from '../studio/AudioEngine.js';

// TODO: switch to Klaviyo POST when list is provisioned.
const JOIN_EMAIL_TO = 'hola@nicoborja.com';
const JOIN_SUBJECT = 'Beat World — Join the Directory';

// Mock producers shown alongside the player's YOU card.
// `style` + `presentation` reuse the 12 character sprites already on disk
// so each card has a real portrait instead of a placeholder rect.
// `rigSprite` reuses existing soundsystem art when possible, falls back to
// a labelled placeholder for rigs we haven't drawn yet (L3+).
const MOCK_PRODUCERS = [
  {
    name: 'DJ PRIMO',
    city: 'BRONX, NYC',
    rig: 'BOOMBOX',
    rigSprite: '/assets/sprites/soundsystem/boombox.png',
    style: 'gfunk', presentation: 'm',
    chord: 'BOOM BAP', bpm: 88,
    badge: '★ FEATURED',
    badgeColor: '#ffaa00',
    bio: 'Boom bap loyalist. Chops only soul records pressed before 1974.',
    quote: 'IF THE KICK DON\'T HIT YOU IN THE CHEST, IT\'S NOT DONE.',
  },
  {
    name: 'MARCELA BASS',
    city: 'SAN JUAN, PR',
    rig: 'PICÓ STACK',
    rigSprite: '/assets/sprites/soundsystem/pico.png',
    style: 'beatmaker', presentation: 'f',
    chord: 'DEMBOW',  bpm: 92,
    badge: '🌴 LEVEL 2',
    badgeColor: '#00ddff',
    bio: 'Custom picó painter mixing perreo, dembow, and Old San Juan plena.',
    quote: 'EL PERREO ES SAGRADO. NO LO TOQUES SI NO LO RESPETAS.',
  },
  {
    name: 'TOKYO BREAKER',
    city: 'SHIBUYA, JP',
    rig: 'BOOMBOX',
    rigSprite: '/assets/sprites/soundsystem/boombox.png',
    style: 'otaku',   presentation: 'm',
    chord: 'LOFI',    bpm: 86,
    badge: '🌸 NEW',
    badgeColor: '#ff66aa',
    bio: 'Late-night chops in a 6-tatami bedroom studio. MPC + ramen.',
    quote: 'THE QUIET SAMPLES HIT THE LOUDEST.',
  },
  {
    name: 'BERLIN GHOST',
    city: 'KREUZBERG, DE',
    rig: 'WAREHOUSE STACK',
    rigSprite: '/assets/sprites/soundsystem/warehouse.png',
    style: 'punk',    presentation: 'f',
    chord: 'TECHNO',  bpm: 132,
    badge: null,
    badgeColor: null,
    bio: 'Function-One disciple. Industrial techno only. No melodies.',
    quote: 'IF THE BASSLINE IS TOO MELODIC, DELETE IT.',
  },
  {
    name: 'SOFIA SYSTEM',
    city: 'SÃO PAULO, BR',
    rig: 'BAILE FUNK TRUCK',
    rigSprite: '/assets/sprites/soundsystem/baile-funk.png',
    style: 'feline',  presentation: 'f',
    chord: 'BAILE FUNK', bpm: 130,
    badge: '🇧🇷 BR',
    badgeColor: '#00cc44',
    bio: 'Wheels in the favela, bass in the air. The truck IS the venue.',
    quote: 'THE STREET IS THE ONLY VENUE THAT MATTERS.',
  },
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

    // Cards grid — wider so the larger YOU card and full mock cards have
    // room to breathe. Min track is 280px to keep avatars readable.
    const grid = document.createElement('div');
    grid.style.cssText = `
      display:grid; gap:14px; width:100%; max-width:1080px; margin:0 auto;
      grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));
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
      padding:18px; border:2px solid #ffaa00;
      background:rgba(255,170,0,0.08);
      box-shadow: 0 0 20px rgba(255,170,0,0.45), inset 0 0 10px rgba(255,170,0,0.2);
      display:flex; flex-direction:column; gap:12px;
      position:relative;
    `;
    const tag = document.createElement('div');
    tag.style.cssText = `
      position:absolute; top:-9px; left:14px;
      background:#ffaa00; color:#0a0a1e;
      font-size:7px; padding:3px 8px; letter-spacing:2px;
    `;
    tag.textContent = 'YOU ★';
    card.appendChild(tag);

    // ── Hero portrait ─ character is the focal point.
    // 192×288 (1.5x what it was) lets the sprite read at full detail.
    const { style, presentation } = this.gameState.data;
    const portraitWrap = document.createElement('div');
    portraitWrap.style.cssText = `
      width:100%; height:288px;
      display:flex; justify-content:center; align-items:center;
      background:rgba(0,0,0,0.25);
      border:1px dashed rgba(255,170,0,0.35);
      position:relative; overflow:hidden;
    `;
    const portrait = characterImage(style, presentation, { width: 192, height: 288 });
    portraitWrap.appendChild(portrait);

    // Floating producer name overlay (bottom-left of portrait)
    const nameOverlay = document.createElement('div');
    nameOverlay.style.cssText = `
      position:absolute; bottom:8px; left:8px;
      background:rgba(10,10,30,0.85);
      color:#ffaa00; font-size:9px; padding:4px 8px;
      letter-spacing:1px; border-left:2px solid #ffaa00;
    `;
    nameOverlay.textContent = this.gameState.data.playerName;
    portraitWrap.appendChild(nameOverlay);

    card.appendChild(portraitWrap);

    // Meta row — driven by the player's most recent finished beat when one exists,
    // otherwise falls back to "your city / boombox / your-current-chord-style".
    const latestBeat = this.gameState.getLatestBeat ? this.gameState.getLatestBeat() : null;
    const cpIdx = latestBeat?.chordProgression ?? (this.gameState.data.audioPrefs.chordProgression || 0);
    const cpName = latestBeat?.chordProgressionName
      || CHORD_PROGRESSIONS[cpIdx]?.name
      || 'BOOM BAP';
    // Prefer the player's stored home city; fall back to last-beat region.
    const cityName = (this.gameState.data.playerCity || '').toUpperCase()
      || (latestBeat?.cityId === 'puerto-rico' ? 'SAN JUAN, PR'
       : latestBeat?.cityId === 'new-york'    ? 'NEW YORK, USA'
       : 'YOUR CITY');
    const cityMapsUrl = this.gameState.getPlayerCityMapsUrl?.() || '';
    const rigName  = latestBeat?.cityId === 'puerto-rico' ? 'PICÓ STACK'
                   : latestBeat?.cityId === 'new-york'    ? 'BOOMBOX'
                   : 'BOOMBOX';
    const bpm      = latestBeat?.bpm || 90;

    const meta = document.createElement('div');
    meta.style.cssText = 'display:grid; grid-template-columns:1fr 1fr; gap:6px 12px;';
    meta.innerHTML = `
      <div><div style="font-size:6px; color:#888;">CITY</div>
           <div style="font-size:8px; color:#fff;">${cityName}${cityMapsUrl ? ` <a href="${cityMapsUrl}" target="_blank" rel="noopener" style="color:#00ddff; text-decoration:none; font-size:6px; margin-left:4px;">📍</a>` : ''}</div></div>
      <div><div style="font-size:6px; color:#888;">RIG</div>
           <div style="font-size:8px; color:#00ddff;">${rigName}</div></div>
      <div><div style="font-size:6px; color:#888;">STYLE</div>
           <div style="font-size:8px; color:#ff3399;">${cpName}</div></div>
      <div><div style="font-size:6px; color:#888;">CLOUT</div>
           <div style="font-size:8px; color:#ffaa00;">${(this.gameState.data.clout || 0).toLocaleString()}</div></div>
    `;
    card.appendChild(meta);

    // Latest-beat block: only renders if the player has finished a beat.
    if (latestBeat?.beatName) {
      const beatBlock = document.createElement('div');
      beatBlock.style.cssText = `
        padding:8px 10px; background:rgba(0,0,0,0.35);
        border-left:3px solid #ffaa00; display:flex; flex-direction:column; gap:4px;
      `;
      const ratingStr = latestBeat.rating ? `${'★'.repeat(latestBeat.rating)}${'☆'.repeat(5 - latestBeat.rating)}` : '—';
      beatBlock.innerHTML = `
        <div style="font-size:6px; color:#888; letter-spacing:1px;">LATEST BEAT</div>
        <div style="font-size:9px; color:#ffaa00; letter-spacing:1px;">"${latestBeat.beatName}"</div>
        <div style="font-size:6px; color:#aaa;">${bpm} BPM · ${ratingStr}</div>
      `;
      card.appendChild(beatBlock);
    }

    // Soundsystem sprite + label row
    const rigRow = document.createElement('div');
    rigRow.style.cssText = `
      display:flex; align-items:center; gap:14px;
      padding-top:10px; border-top:1px dashed rgba(255,170,0,0.3);
    `;
    const rigSprite = latestBeat?.cityId === 'puerto-rico'
      ? '/assets/sprites/soundsystem/pico.png'
      : '/assets/sprites/soundsystem/boombox.png';
    rigRow.appendChild(spriteImage(
      rigSprite,
      rigName,
      { width: 80, height: 80, style: 'filter: drop-shadow(0 0 8px #ff3399); flex-shrink:0;' }
    ));
    const rigLabel = document.createElement('div');
    rigLabel.style.cssText = 'font-size:6px; color:#aaa; line-height:1.7; font-style:italic;';
    rigLabel.textContent = latestBeat?.beatName
      ? `"${latestBeat.producerName || this.gameState.data.playerName} · ${latestBeat.beatName}"`
      : '"FIRST BEAT. FIRST RIG. THE START OF SOMETHING."';
    rigRow.appendChild(rigLabel);
    card.appendChild(rigRow);

    return card;
  }

  _buildMockCard(p) {
    const card = document.createElement('div');
    card.style.cssText = `
      padding:14px; border:1px solid #333;
      background:rgba(20,20,50,0.55);
      display:flex; flex-direction:column; gap:10px;
      transition: border-color 0.15s, transform 0.15s;
      position:relative;
    `;
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = '#00ddff';
      card.style.transform = 'translateY(-2px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.borderColor = '#333';
      card.style.transform = '';
    });

    // Optional badge corner
    if (p.badge && p.badgeColor) {
      const badge = document.createElement('div');
      badge.style.cssText = `
        position:absolute; top:-8px; right:10px;
        background:${p.badgeColor}; color:#0a0a1e;
        font-size:6px; padding:2px 6px; letter-spacing:1px;
      `;
      badge.textContent = p.badge;
      card.appendChild(badge);
    }

    // Head row: real character avatar + name/city
    const head = document.createElement('div');
    head.style.cssText = 'display:flex; gap:12px; align-items:flex-start;';
    const avatarWrap = document.createElement('div');
    avatarWrap.style.cssText = 'width:80px; height:120px; flex-shrink:0;';
    avatarWrap.appendChild(characterImage(p.style, p.presentation, { width: 80, height: 120 }));
    head.appendChild(avatarWrap);

    const meta = document.createElement('div');
    meta.style.cssText = 'display:flex; flex-direction:column; gap:4px; flex:1; min-width:0;';
    meta.innerHTML = `
      <div style="font-size:9px; color:#fff; letter-spacing:1px;">${p.name}</div>
      <div style="font-size:6px; color:#888;">${p.city}</div>
      <div style="font-size:7px; color:#00ddff;">RIG: ${p.rig}</div>
      <div style="font-size:6px; color:#ff3399;">${p.chord} · ${p.bpm} BPM</div>
    `;
    head.appendChild(meta);
    card.appendChild(head);

    // Rig sprite slot — uses real sprite if present, falls back to placeholder
    const piece = document.createElement('div');
    piece.style.cssText = 'width:100%; height:90px; display:flex; justify-content:center; align-items:center;';
    piece.appendChild(spriteImage(
      p.rigSprite,
      p.rig,
      { width: 90, height: 90, style: 'filter: drop-shadow(0 0 6px #00ddff); opacity:0.85;' }
    ));
    card.appendChild(piece);

    // Quote — first the quote, then the descriptive bio (smaller)
    const quote = document.createElement('div');
    quote.style.cssText = 'font-size:6px; color:#fff; line-height:1.7; font-style:italic; padding:6px 8px; background:rgba(0,0,0,0.25); border-left:2px solid #00ddff;';
    quote.textContent = `"${p.quote}"`;
    card.appendChild(quote);

    const bio = document.createElement('div');
    bio.style.cssText = 'font-size:6px; color:#888; line-height:1.6;';
    bio.textContent = p.bio;
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
      const body = encodeURIComponent(`Email: ${email}\nProducer: ${this.gameState.data.playerName}\nCity: ${this.gameState.data.playerCity || ''}\nMaps: ${this.gameState.getPlayerCityMapsUrl?.() || ''}`);
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
