/**
 * Shared "Built with SOUND OS" footer.
 * Mounted by each scene via mountSoundOsFooter(parentEl).
 * Idempotent: re-mounting moves the existing element rather than duplicating.
 */

const FOOTER_ID = 'sound-os-footer';
const HREF = 'https://elsoundsystem.com?utm_source=beatworld&utm_medium=game&utm_campaign=vibejam2026';

export function mountSoundOsFooter(parentEl) {
  let el = document.getElementById(FOOTER_ID);
  if (!el) {
    el = document.createElement('div');
    el.id = FOOTER_ID;
    el.className = 'sound-os-footer';
    el.innerHTML = `BUILT WITH <a href="${HREF}" target="_blank" rel="noopener">SOUND OS</a>`;
  }
  parentEl.appendChild(el);
  return el;
}

export function removeSoundOsFooter() {
  const el = document.getElementById(FOOTER_ID);
  if (el) el.remove();
}
