/**
 * ShareArtifact — composes a 1080×1080 PNG of the player's beat + rig
 * suitable for X / Instagram. Triggers a download + opens the share intent.
 *
 * Composition (from top):
 *   - 0-360px: stylized waveform derived from the beat grid
 *   - 360-720px: character composite (left) + boombox sprite (right)
 *   - 720-1080px: metadata strip
 */
import { CHORD_PROGRESSIONS } from '../studio/AudioEngine.js';

const SIZE = 1080;

function dim(v, def = 0) { return (typeof v === 'number' && !isNaN(v)) ? v : def; }

function drawBackground(ctx) {
  // Base
  ctx.fillStyle = '#0a0a1e';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Magenta-cyan radial gradient
  const grad = ctx.createRadialGradient(SIZE * 0.5, SIZE * 0.5, 50, SIZE * 0.5, SIZE * 0.5, SIZE * 0.7);
  grad.addColorStop(0, 'rgba(255,51,153,0.25)');
  grad.addColorStop(0.6, 'rgba(0,221,255,0.10)');
  grad.addColorStop(1, 'rgba(10,10,30,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Faint CRT scanlines
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let y = 0; y < SIZE; y += 4) {
    ctx.fillRect(0, y, SIZE, 1);
  }
}

function drawWaveform(ctx, gameState) {
  const cityId = gameState.data.currentCity || 'new-york';
  const grid = gameState.data.tracks[cityId] || [];
  const steps = grid[0]?.length || 16;

  const x0 = 60, y0 = 60, w = SIZE - 120, h = 240;

  // Backdrop card
  ctx.strokeStyle = 'rgba(255,51,153,0.6)';
  ctx.lineWidth = 2;
  ctx.strokeRect(x0, y0, w, h);

  // 64 bars derived from grid density per slice
  const bars = 64;
  const barW = w / bars;
  for (let i = 0; i < bars; i++) {
    // Map bar i to step range
    const stepIdx = Math.floor((i / bars) * steps);
    let active = 0;
    for (let t = 0; t < grid.length; t++) {
      if (grid[t]?.[stepIdx]) active++;
    }
    const intensity = grid.length ? (active / grid.length) : 0;
    // Random-ish vertical jitter so even empty grids look like a waveform
    const seed = Math.sin(i * 1.7 + 0.3) * 0.5 + 0.5;
    const barH = (intensity * 0.7 + seed * 0.3) * h * 0.85;
    const colorMix = i % 2 === 0 ? '#ff3399' : '#00ddff';
    ctx.fillStyle = colorMix;
    ctx.fillRect(x0 + i * barW + 1, y0 + h / 2 - barH / 2, Math.max(1, barW - 2), barH);
  }
}

function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

async function drawCharacter(ctx, gameState) {
  const parts = gameState.data.characterParts;
  const x = 110, y = 380, w = 260, h = 390;

  const layers = [
    { sprite: 'top',    id: parts.head,  label: 'HEAD' },
    { sprite: 'mid',    id: parts.torso, label: 'TORSO' },
    { sprite: 'bottom', id: parts.legs,  label: 'LEGS' },
  ];
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const url = `/assets/sprites/characters/parts/${layer.sprite}-${layer.id}.png`;
    const img = await loadImage(url);
    const ly = y + i * (h / 3);
    if (img) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, x, ly, w, h / 3);
    } else {
      ctx.fillStyle = 'rgba(255,0,255,0.10)';
      ctx.fillRect(x, ly, w, h / 3);
      ctx.strokeStyle = '#ff00ff';
      ctx.setLineDash([6, 6]);
      ctx.strokeRect(x, ly, w, h / 3);
      ctx.setLineDash([]);
      ctx.fillStyle = '#ff00ff';
      ctx.font = "16px 'Press Start 2P', monospace";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`[${layer.id.toUpperCase()} ${layer.label}]`, x + w / 2, ly + h / 6);
    }
  }

  // Producer name below
  ctx.fillStyle = '#ffaa00';
  ctx.shadowColor = '#ffaa00';
  ctx.shadowBlur = 12;
  ctx.font = "20px 'Press Start 2P', monospace";
  ctx.textAlign = 'center';
  ctx.fillText(gameState.data.playerName || 'PRODUCER', x + w / 2, y + h + 36);
  ctx.shadowBlur = 0;
}

async function drawBoombox(ctx) {
  const x = SIZE - 110 - 260, y = 420, w = 260, h = 260;

  // Magenta halo behind
  const halo = ctx.createRadialGradient(x + w / 2, y + h / 2, 20, x + w / 2, y + h / 2, w * 0.7);
  halo.addColorStop(0, 'rgba(255,51,153,0.7)');
  halo.addColorStop(1, 'rgba(255,51,153,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(x - 40, y - 40, w + 80, h + 80);

  const img = await loadImage('/assets/sprites/soundsystem/boombox.png');
  if (img) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, x, y, w, h);
  } else {
    ctx.fillStyle = 'rgba(255,0,255,0.10)';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#ff00ff';
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(x, y, w, h);
    ctx.setLineDash([]);
    ctx.fillStyle = '#ff00ff';
    ctx.font = "20px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('[BOOMBOX]', x + w / 2, y + h / 2);
  }

  // Label
  ctx.fillStyle = '#00ddff';
  ctx.shadowColor = '#00ddff';
  ctx.shadowBlur = 10;
  ctx.font = "16px 'Press Start 2P', monospace";
  ctx.textAlign = 'center';
  ctx.fillText('MY SOUND SYSTEM', x + w / 2, y + h + 36);
  ctx.shadowBlur = 0;
}

function drawMetadata(ctx, gameState) {
  const cpIdx = gameState.data.audioPrefs.chordProgression || 0;
  const styleName = CHORD_PROGRESSIONS[cpIdx]?.name || 'BOOM BAP';

  const lines = [
    'PRODUCED IN BEAT WORLD 2.0',
    `STYLE: ${styleName}`,
    'BUILT WITH SOUND OS · beatworld.nicoborja.com',
  ];
  const colors = ['#ffaa00', '#ff3399', '#00ddff'];
  ctx.textAlign = 'center';
  for (let i = 0; i < lines.length; i++) {
    ctx.fillStyle = colors[i];
    ctx.shadowColor = colors[i];
    ctx.shadowBlur = 10;
    ctx.font = `${i === 0 ? 22 : 16}px 'Press Start 2P', monospace`;
    ctx.fillText(lines[i], SIZE / 2, 850 + i * 56);
  }
  ctx.shadowBlur = 0;
}

export async function generateShareImage(gameState) {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  drawBackground(ctx);
  drawWaveform(ctx, gameState);
  await drawCharacter(ctx, gameState);
  await drawBoombox(ctx);
  drawMetadata(ctx, gameState);

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
  _openShareModal(url);
}

function _openShareModal(blobUrl) {
  // Remove any existing modal
  document.getElementById('share-modal')?.remove();

  const modal = document.createElement('div');
  modal.id = 'share-modal';
  modal.style.cssText = `
    position:fixed; inset:0; background:rgba(0,0,0,0.85);
    display:flex; align-items:center; justify-content:center; z-index:9999;
    font-family:'Press Start 2P', monospace;
  `;

  const tweetText = encodeURIComponent('I built a boombox in Beat World 🔊 Make yours at beatworld.nicoborja.com #VibeJam2026');
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
