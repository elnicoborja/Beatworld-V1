/**
 * spriteImage(url, label, options)
 *
 * Returns an HTMLElement that renders the image at `url` if it loads,
 * or a labelled placeholder rectangle if it 404s. Both use the same
 * computed width/height so layout stays stable.
 */
function dim(v) {
  return (typeof v === 'number') ? `${v}px` : (v || 'auto');
}

const warnedAssetUrls = new Set();

function logMissingOnce(url) {
  if (warnedAssetUrls.has(url)) return;
  warnedAssetUrls.add(url);
  console.warn(`[asset] missing: ${url} — trying fallback/placeholder`);
}

function createSpriteWrapper({ width, height, className = '', style = '' } = {}) {
  const wrap = document.createElement('div');
  wrap.style.cssText = `
    width: ${dim(width)}; height: ${dim(height)};
    display: inline-block; position: relative;
    ${style}
  `;
  if (className) wrap.className = className;
  return wrap;
}

function appendPlaceholder(wrap, label) {
  const ph = document.createElement('div');
  ph.className = 'sprite-placeholder';
  ph.style.cssText = 'width:100%; height:100%;';
  ph.textContent = `[${label}]`;
  wrap.appendChild(ph);
}

export function spriteImage(url, label, options = {}) {
  return spriteImageWithFallback([url], label, options);
}

export function spriteImageWithFallback(urls, label, options = {}) {
  const wrap = createSpriteWrapper(options);
  const candidates = (Array.isArray(urls) ? urls : [urls]).filter(Boolean);

  const tryAt = (index) => {
    if (index >= candidates.length) {
      appendPlaceholder(wrap, label);
      return;
    }

    const img = new Image();
    img.src = candidates[index];
    img.style.cssText = 'width:100%; height:100%; display:block; image-rendering:pixelated;';
    img.alt = label;
    img.onload = () => wrap.appendChild(img);
    img.onerror = () => {
      logMissingOnce(candidates[index]);
      tryAt(index + 1);
    };
  };

  tryAt(0);
  return wrap;
}

/**
 * Returns the URL for one character zone sprite.
 * zone: 'top' | 'mid' | 'bottom'
 * identity: arbitrary style id, usually boombap/gfunk/punk/beatmaker/otaku
 */
export function characterPartUrl(zone, identity) {
  return `/assets/sprites/characters/parts/${zone}-${identity}.png`;
}

/**
 * Returns candidates for the 2-axis character portrait naming migration.
 * style: e.g. boombap, gfunk, punk, beatmaker, otaku
 * presentation: m | f | nb
 */
export function characterPortraitUrlCandidates(style, presentation = 'm') {
  const safeStyle = String(style || '').trim().toLowerCase();
  const safePresentation = String(presentation || 'm').trim().toLowerCase();
  if (!safeStyle) return [];

  return [
    `/assets/sprites/characters/${safeStyle}-${safePresentation}.png`,
    `/assets/sprites/characters/${safeStyle}-m.png`,
    `/assets/sprites/characters/${safeStyle}.png`,
  ];
}

export function characterPortraitImage(style, presentation, label, options = {}) {
  return spriteImageWithFallback(characterPortraitUrlCandidates(style, presentation), label, options);
}
