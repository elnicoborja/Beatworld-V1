/**
 * ShareArtifact — composes a 1080×1080 PNG of the player IN the unlock scene.
 *
 * Composition:
 *   - Background: the unlock cinematic for the player's most recently
 *     completed level (boombox-unlock-coney-island.png for L1, pico-unlock-vieques.png
 *     for L2, etc), centered-cropped from 1920x1080 → 1080x1080.
 *   - Foreground: the player's character standing in front of the soundsystem
 *     piece. The unlock image already contains the rig, so the character just
 *     needs to land on the visual baseline.
 *   - Bottom strip: BEAT NAME (large) + beatworld.nicoborja.com (small).
 *     Nothing else. The content is the brand.
 */
import { CITIES } from '../GameData.js';

const SIZE = 1080;

// Per-level cinematic background. Falls back to L1 if the city isn't mapped.
const UNLOCK_BG_BY_CITY = {
  'new-york':    '/assets/sprites/soundsystem/boombox-unlock-coney-island.png',
  'puerto-rico': '/assets/sprites/soundsystem/pico-unlock-vieques.png',
};

function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/**
 * Center-crop a wide image into a square fill. Source dims are typically
 * 1920×1080; we keep the vertical extent and crop the horizontal sides
 * symmetrically so the soundsystem (typically center-foreground) stays
 * intact. Pixel-art smoothing is disabled so edges stay crisp.
 */
function drawSquareCrop(ctx, img) {
  if (!img) return;
  ctx.imageSmoothingEnabled = false;
  const sw = img.naturalWidth, sh = img.naturalHeight;
  if (!sw || !sh) return;
  // Cover-fit: scale so the source fills SIZE×SIZE; crop overflow centrally.
  const scale = Math.max(SIZE / sw, SIZE / sh);
  const dw = sw * scale, dh = sh * scale;
  const dx = (SIZE - dw) / 2, dy = (SIZE - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function drawFallbackBg(ctx, cityName) {
  // Solid navy + radial accent so a missing background doesn't bleach to black.
  ctx.fillStyle = '#0a0a1e';
  ctx.fillRect(0, 0, SIZE, SIZE);
  const grad = ctx.createRadialGradient(SIZE * 0.5, SIZE * 0.55, 50, SIZE * 0.5, SIZE * 0.55, SIZE * 0.7);
  grad.addColorStop(0, 'rgba(255,51,153,0.30)');
  grad.addColorStop(0.6, 'rgba(0,221,255,0.10)');
  grad.addColorStop(1, 'rgba(10,10,30,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.fillStyle = '#666';
  ctx.font = "16px 'Press Start 2P', monospace";
  ctx.textAlign = 'center';
  ctx.fillText(`[UNLOCK SCENE — ${cityName?.toUpperCase() || 'CITY'}]`, SIZE / 2, SIZE * 0.45);
}

async function drawCharacter(ctx, gameState) {
  // Character placed at lower-center, scaled large so they read as standing
  // in front of the soundsystem. 360w × 540h slot, baseline near canvas-bottom.
  const style = gameState.data.style || 'boombap';
  const presentation = gameState.data.presentation || 'm';
  const w = 360, h = 540;
  const x = (SIZE - w) / 2;
  const y = SIZE - h - 110; // 110px padding above the bottom strip

  // 2-tier fallback: {style}-{presentation}.png → {style}-m.png → labelled rect
  let img = await loadImage(`/assets/sprites/characters/${style}-${presentation}.png`);
  if (!img && presentation !== 'm') {
    img = await loadImage(`/assets/sprites/characters/${style}-m.png`);
  }
  if (img) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, x, y, w, h);
  } else {
    // Subtle dashed outline only — no big "CHARACTER MISSING" graphic.
    ctx.fillStyle = 'rgba(255,170,0,0.08)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#ffaa00';
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);
  }
}

function drawBottomStrip(ctx, gameState) {
  // Strict minimal: BEAT NAME (large) + URL (small). No "BUILT WITH", no
  // "PRODUCED IN", no hashtag stamp. Content is the brand.
  const cityId = gameState.data.currentCity || 'new-york';
  const beat = (gameState.getBeat ? gameState.getBeat(cityId) : null) ||
               { beatName: 'UNTITLED BEAT' };
  const beatName = (beat.beatName || 'UNTITLED BEAT').slice(0, 24);

  // Dark band at the very bottom to anchor text against busy backgrounds.
  ctx.fillStyle = 'rgba(10, 10, 30, 0.78)';
  ctx.fillRect(0, SIZE - 96, SIZE, 96);

  ctx.textAlign = 'center';

  // Beat name
  ctx.fillStyle = '#ffaa00';
  ctx.shadowColor = '#ffaa00';
  ctx.shadowBlur = 14;
  ctx.font = "28px 'Press Start 2P', monospace";
  ctx.fillText(beatName, SIZE / 2, SIZE - 52);

  // URL
  ctx.fillStyle = '#00ddff';
  ctx.shadowColor = '#00ddff';
  ctx.shadowBlur = 8;
  ctx.font = "14px 'Press Start 2P', monospace";
  ctx.fillText('beatworld.nicoborja.com', SIZE / 2, SIZE - 22);

  ctx.shadowBlur = 0;
}

export async function generateShareImage(gameState) {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  // Pick the unlock cinematic for the player's current/most-recent city.
  const cityId = gameState.data.currentCity || 'new-york';
  const cityName = CITIES[cityId]?.name;
  const bgUrl = UNLOCK_BG_BY_CITY[cityId] || UNLOCK_BG_BY_CITY['new-york'];
  const bgImg = await loadImage(bgUrl);

  if (bgImg) {
    drawSquareCrop(ctx, bgImg);
  } else {
    drawFallbackBg(ctx, cityName);
  }

  await drawCharacter(ctx, gameState);
  drawBottomStrip(ctx, gameState);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

export async function generateAndDownloadShareImage(gameState) {
  const blob = await generateShareImage(gameState);
  if (!blob) {
    console.warn('[ShareArtifact] toBlob returned null');
    return;
  }
  const url = URL.createObjectURL(blob);

  // 1) Trigger download
  const safeName = (gameState.data.playerName || 'producer').toLowerCase().replace(/[^a-z0-9]/g, '');
  const a = document.createElement('a');
  a.href = url;
  a.download = `beatworld-${safeName}-rig.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  // 2) Show share modal with X + IG instructions
  _openShareModal(url, gameState);
}

function _openShareModal(blobUrl, gameState) {
  document.getElementById('share-modal')?.remove();

  const modal = document.createElement('div');
  modal.id = 'share-modal';
  modal.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,0.85);
    display:flex; align-items:center; justify-content:center; z-index:9999;
    font-family:'Press Start 2P', monospace;
  `;

  const cityId = gameState?.data?.currentCity || 'new-york';
  const beat = (gameState?.getBeat ? gameState.getBeat(cityId) : null) || { beatName: 'UNTITLED BEAT' };
  const beatName = (beat.beatName || 'UNTITLED BEAT');

  const tweetText = encodeURIComponent(`"${beatName}" — built it on beatworld.nicoborja.com 🔊 #VibeJam2026`);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

  modal.innerHTML = `
    <div style="
      background:#0a0a1e; border:2px solid #ff3399; padding:28px;
      max-width:520px; box-shadow: 0 0 32px #ff3399;
      display:flex; flex-direction:column; gap:16px;
    ">
      <div style="font-size:14px; color:#ff3399; text-shadow: 0 0 8px #ff3399; letter-spacing:2px;">
        IMAGE DOWNLOADED
      </div>
      <div style="font-size:8px; color:#fff; line-height:1.7;">
        1. CHECK YOUR DOWNLOADS FOLDER<br/>
        2. CLICK A BUTTON BELOW TO OPEN THE APP<br/>
        3. ATTACH THE IMAGE TO YOUR POST
      </div>
      <div style="display:flex; gap:10px;">
        <a class="pixel-btn cyan" href="${twitterUrl}" target="_blank" rel="noopener"
           style="font-size:9px; padding:10px 16px; text-decoration:none;">SHARE TO X →</a>
        <a class="pixel-btn magenta" href="https://www.instagram.com/" target="_blank" rel="noopener"
           style="font-size:9px; padding:10px 16px; text-decoration:none;">OPEN INSTAGRAM →</a>
        <button class="pixel-btn secondary" id="share-close" style="font-size:9px; padding:10px 16px;">CLOSE</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.querySelector('#share-close').addEventListener('click', () => {
    modal.remove();
    URL.revokeObjectURL(blobUrl);
  });
}
