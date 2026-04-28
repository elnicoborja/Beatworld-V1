/**
 * spriteImage(url, label, options)
 *
 * Returns an HTMLElement that renders the image at `url` if it loads,
 * or a labelled placeholder rectangle if it 404s. Both use the same
 * computed width/height so layout stays stable.
 *
 * Usage:
 *   container.appendChild(spriteImage(
 *     '/assets/sprites/characters/critic-xxl.png',
 *     'CRITIC PORTRAIT',
 *     { width: 256, height: 256 }
 *   ));
 */
function dim(v) {
  return (typeof v === 'number') ? `${v}px` : (v || 'auto');
}

export function spriteImage(url, label, { width, height, className = '', style = '' } = {}) {
  // Wrap in a div so we can swap content on load failure without re-parenting
  const wrap = document.createElement('div');
  wrap.style.cssText = `
    width: ${dim(width)}; height: ${dim(height)};
    display: inline-block; position: relative;
    ${style}
  `;
  if (className) wrap.className = className;

  const img = new Image();
  img.src = url;
  img.style.cssText = `
    width: 100%; height: 100%; display: block;
    image-rendering: pixelated;
  `;
  img.alt = label;
  img.onload = () => {
    wrap.appendChild(img);
  };
  img.onerror = () => {
    const ph = document.createElement('div');
    ph.className = 'sprite-placeholder';
    ph.style.cssText = `width: 100%; height: 100%;`;
    ph.textContent = `[${label}]`;
    wrap.appendChild(ph);
    console.warn(`[asset] missing: ${url} — placeholder rendered`);
  };

  return wrap;
}

/**
 * Returns the URL for one character zone sprite.
 * zone: 'top' | 'mid' | 'bottom'
 * identity: 'boombap' | 'gfunk' | 'punk' | 'beatmaker'
 */
export function characterPartUrl(zone, identity) {
  return `/assets/sprites/characters/parts/${zone}-${identity}.png`;
}
