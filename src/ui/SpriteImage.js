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
 * Returns the primary URL for a character sprite.
 * style:        'boombap' | 'gfunk' | 'punk' | 'beatmaker' | 'otaku' | 'feline'
 * presentation: 'm' | 'f'
 */
export function characterUrl(style, presentation = 'm') {
  return `/assets/sprites/characters/${style}-${presentation}.png`;
}

/**
 * Character image with a 2-tier fallback chain so a missing presentation
 * still renders something useful instead of a placeholder rect:
 *   1. /assets/sprites/characters/{style}-{presentation}.png
 *   2. /assets/sprites/characters/{style}-m.png
 *   3. labelled placeholder rect
 *
 * Same return shape as spriteImage(): a wrapper div with fixed dims.
 */
export function characterImage(style, presentation, { width, height, className = '', style: cssStyle = '' } = {}) {
  const wrap = document.createElement('div');
  wrap.style.cssText = `
    width: ${dim(width)}; height: ${dim(height)};
    display: inline-block; position: relative;
    ${cssStyle}
  `;
  if (className) wrap.className = className;

  const label = `${style.toUpperCase()}-${(presentation || 'm').toUpperCase()}`;
  const primary = `/assets/sprites/characters/${style}-${presentation}.png`;
  const fallback = `/assets/sprites/characters/${style}-m.png`;

  const tryImg = (url, onFail) => {
    const img = new Image();
    img.src = url;
    img.style.cssText = 'width:100%; height:100%; display:block; image-rendering:pixelated;';
    img.alt = label;
    img.onload = () => { wrap.innerHTML = ''; wrap.appendChild(img); };
    img.onerror = onFail;
  };

  tryImg(primary, () => {
    if (primary === fallback) return renderPlaceholder();
    tryImg(fallback, renderPlaceholder);
  });

  function renderPlaceholder() {
    wrap.innerHTML = '';
    const ph = document.createElement('div');
    ph.className = 'sprite-placeholder';
    ph.style.cssText = 'width:100%; height:100%;';
    ph.textContent = `[${label}]`;
    wrap.appendChild(ph);
    console.warn(`[asset] missing: ${primary} (and fallback ${fallback}) — placeholder rendered`);
  }

  return wrap;
}
