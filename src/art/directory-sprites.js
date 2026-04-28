const PALETTE = {
  bgDark: '#0a0a1e',
  magenta: '#ff3399',
  cyan: '#00ddff',
  yellow: '#ffaa00',
  red: '#ff3344',
  concrete: '#4a4a52',
};

function svg({ width, height, size, label, rects, circles = [] }) {
  const rectMarkup = rects
    .map(([x, y, w, h, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`)
    .join('');
  const circleMarkup = circles
    .map(([cx, cy, r, c]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${c}"/>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${size}" height="${size}" shape-rendering="crispEdges" role="img" aria-label="${label}"><title>${label}</title>${rectMarkup}${circleMarkup}</svg>`;
}

function addRect(target, x, y, w, h, color) {
  target.push([x, y, w, h, color]);
}

function addCircle(target, cx, cy, r, color) {
  target.push([cx, cy, r, color]);
}

function drawBoombox(rects, circles) {
  addRect(rects, 8, 12, 48, 36, PALETTE.concrete);
  addRect(rects, 10, 14, 44, 32, PALETTE.bgDark);
  addRect(rects, 26, 22, 12, 8, PALETTE.concrete);
  addRect(rects, 24, 32, 16, 6, PALETTE.red);
  addRect(rects, 12, 14, 8, 2, PALETTE.magenta);
  addRect(rects, 44, 14, 8, 2, PALETTE.cyan);
  addRect(rects, 51, 4, 2, 10, PALETTE.yellow);
  addCircle(circles, 18, 32, 8, PALETTE.concrete);
  addCircle(circles, 46, 32, 8, PALETTE.concrete);
  addCircle(circles, 18, 32, 5, PALETTE.bgDark);
  addCircle(circles, 46, 32, 5, PALETTE.bgDark);
}

const RIG_DRAWERS = {
  boombox(rects, circles) {
    drawBoombox(rects, circles);
  },
  pico(rects) {
    addRect(rects, 28, 10, 40, 10, PALETTE.magenta);
    addRect(rects, 24, 20, 50, 62, PALETTE.concrete);
    addRect(rects, 10, 34, 18, 48, PALETTE.concrete);
    addRect(rects, 20, 82, 58, 10, PALETTE.bgDark);
    addRect(rects, 14, 82, 12, 10, PALETTE.yellow);
    addRect(rects, 48, 28, 12, 12, PALETTE.bgDark);
    addRect(rects, 34, 44, 26, 22, PALETTE.bgDark);
    addRect(rects, 6, 42, 10, 8, PALETTE.yellow);
  },
  'baile-funk-truck'(rects, circles) {
    addRect(rects, 10, 58, 76, 20, PALETTE.concrete);
    addRect(rects, 20, 34, 56, 24, PALETTE.bgDark);
    addRect(rects, 16, 54, 64, 4, PALETTE.cyan);
    addRect(rects, 24, 38, 10, 6, PALETTE.yellow);
    addRect(rects, 62, 38, 10, 6, PALETTE.yellow);
    addCircle(circles, 28, 78, 8, PALETTE.bgDark);
    addCircle(circles, 68, 78, 8, PALETTE.bgDark);
    addCircle(circles, 32, 50, 6, PALETTE.concrete);
    addCircle(circles, 48, 50, 6, PALETTE.concrete);
    addCircle(circles, 64, 50, 6, PALETTE.concrete);
  },
  'warehouse-stack'(rects) {
    addRect(rects, 20, 14, 56, 24, PALETTE.concrete);
    addRect(rects, 18, 38, 60, 24, PALETTE.concrete);
    addRect(rects, 16, 62, 64, 24, PALETTE.concrete);
    addRect(rects, 24, 20, 44, 12, PALETTE.bgDark);
    addRect(rects, 22, 44, 48, 12, PALETTE.bgDark);
    addRect(rects, 20, 68, 52, 12, PALETTE.bgDark);
    addRect(rects, 80, 14, 2, 72, PALETTE.cyan);
  },
  'bass-bottom'(rects, circles) {
    addRect(rects, 24, 16, 48, 18, PALETTE.concrete);
    addRect(rects, 20, 34, 56, 20, PALETTE.concrete);
    addRect(rects, 16, 54, 64, 30, PALETTE.concrete);
    addRect(rects, 28, 20, 36, 10, PALETTE.bgDark);
    addRect(rects, 24, 40, 48, 10, PALETTE.bgDark);
    addCircle(circles, 48, 70, 14, PALETTE.bgDark);
    addRect(rects, 16, 84, 64, 4, PALETTE.magenta);
    addRect(rects, 16, 88, 64, 4, PALETTE.yellow);
  },
  sonidero(rects) {
    addRect(rects, 20, 6, 56, 10, PALETTE.yellow);
    addRect(rects, 16, 16, 64, 72, PALETTE.concrete);
    addRect(rects, 24, 24, 48, 56, PALETTE.bgDark);
    addRect(rects, 8, 16, 6, 72, PALETTE.magenta);
    addRect(rects, 82, 16, 6, 72, PALETTE.magenta);
    addRect(rects, 28, 30, 16, 16, PALETTE.concrete);
    addRect(rects, 52, 30, 16, 16, PALETTE.concrete);
    addRect(rects, 28, 54, 40, 20, PALETTE.concrete);
  },
};

const AVATAR_DRAWERS = {
  1(rects) {
    addRect(rects, 10, 8, 44, 12, PALETTE.concrete);
    addRect(rects, 16, 20, 32, 22, PALETTE.bgDark);
    addRect(rects, 6, 40, 52, 18, PALETTE.concrete);
    addRect(rects, 20, 44, 24, 8, PALETTE.magenta);
  },
  2(rects) {
    addRect(rects, 8, 6, 48, 16, PALETTE.bgDark);
    addRect(rects, 16, 20, 32, 22, PALETTE.concrete);
    addRect(rects, 6, 42, 52, 16, PALETTE.magenta);
    addRect(rects, 22, 24, 20, 4, PALETTE.cyan);
  },
  3(rects) {
    addRect(rects, 6, 10, 52, 10, PALETTE.yellow);
    addRect(rects, 14, 20, 36, 22, PALETTE.concrete);
    addRect(rects, 4, 42, 56, 16, PALETTE.bgDark);
    addRect(rects, 22, 46, 20, 6, PALETTE.red);
  },
  4(rects) {
    addRect(rects, 10, 6, 44, 18, PALETTE.bgDark);
    addRect(rects, 16, 22, 32, 20, PALETTE.concrete);
    addRect(rects, 6, 42, 52, 16, PALETTE.concrete);
    addRect(rects, 12, 44, 40, 4, PALETTE.cyan);
  },
  5(rects) {
    addRect(rects, 10, 6, 44, 14, PALETTE.magenta);
    addRect(rects, 16, 20, 32, 22, PALETTE.concrete);
    addRect(rects, 6, 42, 52, 16, PALETTE.bgDark);
    addRect(rects, 18, 24, 28, 4, PALETTE.yellow);
  },
};

export function renderDirectoryRigIcon(type, { size = 96, ariaLabel } = {}) {
  const rects = [];
  const circles = [];
  const key = type in RIG_DRAWERS ? type : 'boombox';
  RIG_DRAWERS[key](rects, circles);
  return svg({
    width: key === 'boombox' ? 64 : 96,
    height: key === 'boombox' ? 64 : 96,
    size,
    label: ariaLabel || `${key} rig icon`,
    rects,
    circles,
  });
}

export function renderDirectoryAvatar(variant, { size = 64, ariaLabel } = {}) {
  const rects = [];
  const key = AVATAR_DRAWERS[variant] ? variant : 1;
  AVATAR_DRAWERS[key](rects);
  return svg({ width: 64, height: 64, size, label: ariaLabel || `mock avatar ${key}`, rects });
}

// Backwards-compatible exports used by older call sites.
export const renderRigThumbnail = (rigType, options) => renderDirectoryRigIcon(rigType, options);
export const renderProducerAvatar = (seed, options) => {
  const seedToVariant = {
    'dj-primo': 1,
    'marcela-bass': 2,
    'tokyo-breaker': 3,
    'berlin-ghost': 4,
    'sofia-system': 5,
  };
  return renderDirectoryAvatar(seedToVariant[seed] || 1, options);
};
