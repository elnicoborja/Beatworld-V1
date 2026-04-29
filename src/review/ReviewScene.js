/**
 * ReviewScene — COMPLEX magazine review with Level-1 2-star cap.
 *
 * Locked design (2026-04-27 PM):
 *   - L1 reviews cap at 2 stars regardless of beat quality.
 *   - The critic is a system-honest gatekeeper, not a beat-quality evaluator.
 *   - Awards clout: 1★ = 25, 2★ = 50.
 *   - Marks level complete + unlocks soundsystem piece.
 *
 * The magazine cover sprite is a TEMPLATE with 5 EMPTY star outlines.
 * Filled stars are rendered as absolutely-positioned overlays in code.
 */
import { spriteImage } from '../ui/SpriteImage.js';
import { mountSoundOsFooter } from '../ui/SoundOsFooter.js';
import { CITIES } from '../GameData.js';

// Per-level review experience. Each city gets its own magazine + critic combo
// so the cultural arc lines up: NYC → XXXS / Charlamagne, PR → CORNPLEX / Young Miko.
// L3+ (Brazil, Andean, Mexico, Jamaica) post-launch — keys are placeholders.
const REVIEW_BY_CITY = {
  'new-york': {
    magazineLabel: 'XXXS',
    coverPath:     '/assets/sprites/ui/review-magazine-cover-xxxs.png',
    coverAltText:  'MAGAZINE COVER — XXXS',
    criticPath:    '/assets/sprites/characters/critic-xxxs.png',
    criticName:    'CHARLAMAGNE',
    outletDisplay: 'CHARLAMAGNE · XXXS',
    starCap:       2,           // L1 caps at 2 stars regardless of beat quality
    reviews: {
      1: [
        "WHACK. WELCOME TO NYC, KID.",
        "MID. THIS IS WHY YOU DON'T QUIT YOUR DAY JOB.",
        "FIRST BEATS ALWAYS HIT LIKE THIS. KEEP COOKING.",
      ],
      2: [
        "RESPECT — YOU FOUND THE POCKET. BUT IT'S STILL NYC. EARN YOUR THIRD STAR ELSEWHERE.",
        "THIS WOULD GO IN MIAMI. NOT HERE. NOT YET.",
        "DECENT FIRST TRY. NOBODY GETS PAST 2 STARS IN THE BRONX.",
      ],
    },
  },
  'puerto-rico': {
    magazineLabel: 'CORNPLEX',
    coverPath:     '/assets/sprites/ui/review-magazine-cover-cornplex.png',
    coverAltText:  'MAGAZINE COVER — CORNPLEX',
    criticPath:    '/assets/sprites/characters/critic-cornplex.png',
    criticName:    'YOUNG MIKO',
    outletDisplay: 'YOUNG MIKO · CORNPLEX',
    starCap:       3,           // L2 lets player up to 3 stars
    reviews: {
      1: [
        "NO ESTÁ MAL — PERO TIENES QUE PERREAR MÁS DURO.",
        "ESTO NO ES DEMBOW, MAMI. ESTO ES TAREA.",
        "PRIMERA VEZ EN LA ISLA. SE NOTA.",
      ],
      2: [
        "ESO YA ES PERREO. CON CONFIANZA. SIGUE.",
        "TIENE LO SUYO. PERO TODAVÍA NO ES UN HIT.",
        "EL SAN JUAN PIANO TE SALVÓ. ÚSALO MÁS.",
      ],
      3: [
        "FIRMA UN PERREO INTENSO. ESTO SE QUEDA EN EL PICÓ.",
        "ESO ES OTRA COSA. EL BLOQUE ENTERO TE OYE.",
        "PASASTE LA PRUEBA DE LA CALLE. RESPETO.",
      ],
    },
  },
};

// Fallback for any cityId that doesn't have a configured review experience yet.
const FALLBACK_REVIEW = REVIEW_BY_CITY['new-york'];

/**
 * Rate the beat using grid density + downbeat hit-rate. Capped per level.
 * starCap = 2 for L1 (NYC), 3 for L2 (PR), open for later levels.
 */
function computeRating(grid, starCap = 2) {
  if (!grid || !grid.length || !grid[0]) return 1;
  const totalCells = grid.length * grid[0].length;
  const activeCells = grid.flat().filter(Boolean).length;
  const density = activeCells / totalCells;

  let downbeatHits = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let s = 0; s < grid[i].length; s += 4) {
      if (grid[i][s]) downbeatHits++;
    }
  }
  const downbeatScore = downbeatHits / (grid.length * (grid[0].length / 4));
  const score = density * 0.5 + downbeatScore * 0.5;
  const raw = Math.max(1, Math.min(5, Math.ceil(score * 5)));
  return Math.min(starCap, raw);
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export class ReviewScene {
  constructor(gameState, switchScene) {
    this.gameState = gameState;
    this.switchScene = switchScene;
    this.el = null;
  }

  show() {
    const cityId = this.gameState.data.currentCity || 'new-york';
    const beat = this.gameState.getBeat(cityId);
    const grid = beat?.grid || [];
    const cfg = REVIEW_BY_CITY[cityId] || FALLBACK_REVIEW;
    const rating = computeRating(grid, cfg.starCap || 2);
    const reviewText = pick(cfg.reviews[rating] || cfg.reviews[1] || []);
    const cloutReward = rating * 25;

    // Persist the rating back onto the BeatRecord so the share card and
    // the directory producer card can show it later.
    this.gameState.setBeatRating(cityId, rating);

    // Award clout + mark level done. completeLevel + unlock are idempotent.
    this.gameState.addClout(cloutReward);
    // Level 1 is always 1; future levels should map cityId → level.
    const levelForCity = cityId === 'puerto-rico' ? 2 : 1;
    this.gameState.completeLevel(levelForCity);
    this.gameState.unlockSoundsystemPiece(levelForCity);

    const container = document.getElementById('screen-container');
    this.el = document.createElement('div');
    this.el.className = 'scene-overlay';
    this.el.style.cssText = 'background:#0a0a1e; overflow:hidden;';

    // ── Magazine cover as fullscreen background ──────────────
    // The cover is the hero artwork — it deserves the whole canvas.
    // Critic comment + scores + actions overlay on top of it.
    const coverBg = document.createElement('div');
    coverBg.style.cssText = `
      position:absolute; inset:0; z-index:1;
      display:flex; align-items:center; justify-content:center;
      background:#0a0a1e;
    `;
    const coverImg = new Image();
    coverImg.src = cfg.coverPath;
    coverImg.alt = cfg.coverAltText;
    coverImg.style.cssText = `
      max-width:100%; max-height:100%;
      width:auto; height:100%;
      object-fit:contain; image-rendering:pixelated;
      filter: drop-shadow(0 0 24px rgba(0,0,0,0.6));
    `;
    coverImg.onerror = () => {
      const ph = document.createElement('div');
      ph.className = 'sprite-placeholder';
      ph.style.cssText = 'width:60vmin; height:75vmin; font-size:14px;';
      ph.textContent = `[${cfg.coverAltText}]`;
      coverBg.appendChild(ph);
    };
    coverBg.appendChild(coverImg);

    // Filled-stars overlay (positioned over the cover's empty star row)
    const starsOverlay = this._buildStarsOverlay(rating, cfg);
    coverBg.appendChild(starsOverlay);
    this.el.appendChild(coverBg);

    // ── Critic comment box (bottom-left) ─────────────────────
    const criticBox = document.createElement('div');
    criticBox.style.cssText = `
      position:absolute; left:16px; bottom:16px; z-index:5;
      max-width:340px; min-width:240px; padding:14px;
      background:rgba(10,10,30,0.94); border:2px solid ${cfg.criticName === 'YOUNG MIKO' ? '#ff3399' : '#00ddff'};
      box-shadow: 0 0 24px rgba(0,0,0,0.85), 4px 4px 0 #000;
      display:flex; gap:12px; align-items:flex-start;
      font-family:'Press Start 2P', monospace;
    `;
    const criticPortrait = document.createElement('div');
    criticPortrait.style.cssText = 'flex-shrink:0;';
    criticPortrait.appendChild(spriteImage(
      cfg.criticPath, 'CRITIC PORTRAIT',
      { width: 64, height: 64, style: 'filter: drop-shadow(0 0 8px #ff3399);' }
    ));
    const criticText = document.createElement('div');
    criticText.style.cssText = 'display:flex; flex-direction:column; gap:6px; flex:1; min-width:0;';
    criticText.innerHTML = `
      <div style="font-size:7px; color:#00ddff; letter-spacing:2px;">${cfg.outletDisplay}</div>
      <div style="font-size:7px; color:#fff; line-height:1.7; letter-spacing:0.5px;">"${reviewText}"</div>
    `;
    criticBox.appendChild(criticPortrait);
    criticBox.appendChild(criticText);
    this.el.appendChild(criticBox);

    // ── Score / clout / actions panel (bottom-center-right) ──
    const scorePanel = document.createElement('div');
    scorePanel.style.cssText = `
      position:absolute; right:16px; bottom:16px; z-index:5;
      max-width:300px; padding:14px;
      background:rgba(10,10,30,0.94); border:2px solid #ffaa00;
      box-shadow: 0 0 24px rgba(0,0,0,0.85), 4px 4px 0 #000;
      display:flex; flex-direction:column; gap:10px;
      font-family:'Press Start 2P', monospace;
    `;
    scorePanel.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:10px;">
        <div>
          <div style="font-size:6px; color:#888; letter-spacing:1px;">RATING</div>
          <div style="font-size:18px; color:#ffaa00; text-shadow: 0 0 10px #ffaa00; letter-spacing:2px; margin-top:4px;">
            ${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:6px; color:#888; letter-spacing:1px;">+CLOUT</div>
          <div style="font-size:18px; color:#00cc44; text-shadow: 0 0 10px #00cc44; letter-spacing:2px; margin-top:4px;">+${cloutReward}</div>
        </div>
      </div>
      <div style="font-size:6px; color:#888; font-style:italic; line-height:1.6; padding-top:6px; border-top:1px dashed #444;">
        ${cityId === 'puerto-rico'
          ? 'TRES ESTRELLAS ES EL TECHO EN LA ISLA.'
          : 'EVEN THE GREATEST DONT GET MORE THAN 2 STARS IN NYC.'}
      </div>
    `;
    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex; gap:8px; padding-top:6px;';
    const backBtn = document.createElement('button');
    backBtn.className = 'pixel-btn cyan';
    backBtn.style.cssText = 'font-size:7px; padding:10px 12px;';
    backBtn.textContent = '← LEVELS';
    backBtn.addEventListener('click', () => this.switchScene('levelSelect'));
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pixel-btn magenta';
    nextBtn.style.cssText = 'font-size:9px; padding:10px 16px; flex:1; box-shadow: 0 0 12px #ff3399;';
    nextBtn.textContent = 'NEXT ▶';
    nextBtn.addEventListener('click', () => this.switchScene('soundsystemReveal'));
    actions.appendChild(backBtn);
    actions.appendChild(nextBtn);
    scorePanel.appendChild(actions);
    this.el.appendChild(scorePanel);
    container.appendChild(this.el);

    if (!document.getElementById('rev-pulse-kf')) {
      const style = document.createElement('style');
      style.id = 'rev-pulse-kf';
      style.textContent = `
        @keyframes pulse {
          0%   { box-shadow: 0 0 8px rgba(255,170,0,0.6); }
          100% { box-shadow: 0 0 22px rgba(255,170,0,1); }
        }
      `;
      document.head.appendChild(style);
    }

    mountSoundOsFooter(this.el);
  }

  // ── Star overlay positioned where the cover's empty star row sits ──
  // The cover's star row is in the upper-right ~10% from top, ~10% from right.
  // This overlay floats on top of the fullscreen cover.
  _buildStarsOverlay(rating) {
    const stars = document.createElement('div');
    stars.style.cssText = `
      position:absolute; top:8%; right:10%; z-index:3;
      display:flex; gap:6px; pointer-events:none;
      background:rgba(0,0,0,0.4); padding:6px 10px;
      border:1px solid rgba(255,170,0,0.4);
    `;
    for (let i = 0; i < 5; i++) {
      const s = document.createElement('span');
      const filled = i < rating;
      s.style.cssText = `
        font-size:24px; line-height:1;
        color:${filled ? '#ffaa00' : '#444'};
        text-shadow:${filled ? '0 0 12px #ffaa00' : 'none'};
      `;
      s.textContent = '★';
      stars.appendChild(s);
    }
    return stars;
  }

  hide() {
    if (this.el) { this.el.remove(); this.el = null; }
  }

  update() {}
}
