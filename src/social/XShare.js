/**
 * XShare — Twitter/X sharing via Web Intent API (no auth needed)
 */

export function shareToX({ cityName, genre, bpm, clout }) {
  const text = [
    `🎛️ Just produced a beat in Beat World 2.0!`,
    `📍 ${cityName} · ${genre} · ${bpm} BPM`,
    clout ? `🔥 Clout: ${clout}` : '',
    `🎮 Play it: https://beatworld.nicoborja.com`,
    `#VibeJam2026 #BeatWorld`,
  ].filter(Boolean).join('\n');

  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'width=550,height=420');
}

/**
 * Create a share button element
 */
export function createShareButton(container, getShareData) {
  const btn = document.createElement('button');
  btn.className = 'pixel-btn secondary';
  btn.style.cssText = 'font-size:7px; padding:6px 12px;';
  btn.textContent = '𝕏 SHARE';
  btn.addEventListener('click', () => {
    const data = getShareData();
    shareToX(data);
  });
  container.appendChild(btn);
  return btn;
}
