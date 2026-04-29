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
    this.el.style.cssText = 'background: radial-gradient(ellipse at top, #1a1a3e 0%, #0a0a1e 70%);';

    const body = document.createElement('div');
    body.className = 'scene-body';
    body.style.cssText = 'padding:32px 24px; gap:18px;';

    const title = document.createElement('h1');
    title.className = 'scene-title';
    title.textContent = 'MEDIA REVIEWS';
    body.appendChild(title);

    // ── Cover + critic row ───────────────────────────────────
    const row = document.createElement('div');
    row.style.cssText = 'display:flex; gap:24px; align-items:flex-start; flex-wrap:wrap; justify-content:center;';

    // Magazine cover with star overlay (per-level)
    row.appendChild(this._buildCoverWithStars(rating, cfg));

    // Critic column (per-level)
    const criticCol = document.createElement('div');
    criticCol.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:10px; min-width:256px;';
    criticCol.appendChild(spriteImage(
      cfg.criticPath,
      'CRITIC PORTRAIT',
      { width: 200, height: 200, style: 'filter: drop-shadow(0 0 12px #ff3399);' }
    ));
    const outlet = document.createElement('div');
    outlet.style.cssText = 'font-size:9px; color:#00ddff; letter-spacing:2px; text-align:center;';
    outlet.textContent = cfg.outletDisplay;
    criticCol.appendChild(outlet);

    const reviewBox = document.createElement('div');
    reviewBox.style.cssText = `
      max-width:300px; padding:14px;
      background:rgba(0,0,0,0.5); border:1px solid #ffaa00;
      font-size:8px; color:#fff; line-height:1.6; letter-spacing:1px;
      text-align:center;
    `;
    reviewBox.textContent = reviewText;
    criticCol.appendChild(reviewBox);

    row.appendChild(criticCol);
    body.appendChild(row);

    // ── Clout reveal ─────────────────────────────────────────
    const clout = document.createElement('div');
    clout.style.cssText = `
      font-family:'Press Start 2P', monospace; text-align:center;
      padding:14px 24px; border:2px solid #ffaa00;
      background:rgba(255,170,0,0.1);
      animation: pulse 1.4s ease-in-out infinite alternate;
    `;
    clout.innerHTML = `
      <div style="font-size:7px; color:#888; letter-spacing:1px;">+CLOUT EARNED</div>
      <div style="font-size:24px; color:#ffaa00; text-shadow: 0 0 16px #ffaa00; margin-top:8px; letter-spacing:2px;">+${cloutReward}</div>
    `;
    body.appendChild(clout);

    // ── System-honest footer ─────────────────────────────────
    const honesty = document.createElement('div');
    honesty.style.cssText = `
      font-size:7px; color:#888; font-style:italic; text-align:center;
      max-width:520px; line-height:1.6; padding:0 16px;
    `;
    honesty.textContent = cityId === 'puerto-rico'
      ? "TRES ESTRELLAS ES EL TECHO EN LA ISLA. EL CUARTO LO GANAS EN EL PRÓXIMO BLOQUE."
      : "EVEN THE GREATEST DON'T GET MORE THAN 2 STARS IN NYC. EARN YOUR REPUTATION.";
    body.appendChild(honesty);

    // ── Action buttons ───────────────────────────────────────
    // BACK TO LEVELS skips the soundsystem reveal cinematic — the
    // unlocked piece is already saved, so the player can revisit it
    // any time from levelSelect → directory.
    const actions = document.createElement('div');
    actions.style.cssText = 'display:flex; gap:14px; flex-wrap:wrap; justify-content:center;';

    const backBtn = document.createElement('button');
    backBtn.className = 'pixel-btn cyan';
    backBtn.style.cssText = 'font-size:8px; padding:14px 20px;';
    backBtn.textContent = '← BACK TO LEVELS';
    backBtn.addEventListener('click', () => this.switchScene('levelSelect'));
    actions.appendChild(backBtn);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'pixel-btn magenta';
    nextBtn.style.cssText = 'font-size:11px; padding:14px 28px; box-shadow: 0 0 16px #ff3399;';
    nextBtn.textContent = 'NEXT ▶';
    nextBtn.addEventListener('click', () => this.switchScene('soundsystemReveal'));
    actions.appendChild(nextBtn);

    body.appendChild(actions);

    this.el.appendChild(body);
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

  _buildCoverWithStars(rating, cfg) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:relative; width:280px; height:350px;';
    wrap.appendChild(spriteImage(
      cfg.coverPath,
      cfg.coverAltText,
      { width: 280, height: 350 }
    ));
    const stars = document.createElement('div');
    stars.style.cssText = `
      position:absolute; top:24px; right:14px;
      display:flex; gap:4px; pointer-events:none;
    `;
    for (let i = 0; i < 5; i++) {
      const s = document.createElement('span');
      const filled = i < rating;
      s.style.cssText = `
        font-size:18px; line-height:1;
        color:${filled ? '#ffaa00' : '#444'};
        text-shadow:${filled ? '0 0 8px #ffaa00' : 'none'};
      `;
      s.textContent = '★';
      stars.appendChild(s);
    }
    wrap.appendChild(stars);
    return wrap;
  }

  hide() {
    if (this.el) { this.el.remove(); this.el = null; }
  }

  update() {}
}
