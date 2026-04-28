const PALETTE = {
  bgDark: '#0a0a1e',
  magenta: '#ff3399',
  cyan: '#00ddff',
  yellow: '#ffaa00',
  red: '#ff3344',
  woodWarm: '#a06b3a',
  concrete: '#4a4a52',
  skinDark: '#8d5524',
  skinBrown: '#a0734a',
  skinLightBrown: '#c89372',
  skinLight: '#e0b896',
  skinPale: '#f5d8b8'
};

function svg(w, h, size, rects) {
  const body = rects.map(([x, y, rw, rh, c]) => `<rect x="${x}" y="${y}" width="${rw}" height="${rh}" fill="${c}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${size}" height="${size}" shape-rendering="crispEdges">${body}</svg>`;
}

function add(arr, x, y, w, h, c) { arr.push([x, y, w, h, c]); }

const RIG_BUILDERS = {
  boombox(r) {
    add(r, 3, 3, 18, 2, PALETTE.concrete); add(r, 2, 5, 20, 10, PALETTE.concrete);
    add(r, 4, 7, 5, 5, PALETTE.bgDark); add(r, 15, 7, 5, 5, PALETTE.bgDark);
    add(r, 10, 7, 4, 4, PALETTE.bgDark); add(r, 10, 11, 4, 2, PALETTE.magenta);
    add(r, 4, 15, 16, 2, PALETTE.red); add(r, 19, 1, 1, 4, PALETTE.yellow);
  },
  'pico-stack'(r) {
    add(r, 4, 4, 6, 14, PALETTE.concrete); add(r, 10, 8, 8, 10, PALETTE.concrete);
    add(r, 5, 6, 4, 4, PALETTE.bgDark); add(r, 11, 10, 6, 6, PALETTE.bgDark);
    add(r, 3, 2, 8, 2, PALETTE.magenta); add(r, 12, 5, 5, 2, PALETTE.yellow);
    add(r, 16, 6, 3, 2, PALETTE.yellow);
  },
  'baile-funk-truck'(r) {
    add(r, 2, 9, 20, 8, PALETTE.concrete); add(r, 4, 7, 14, 2, PALETTE.woodWarm);
    add(r, 4, 11, 4, 4, PALETTE.bgDark); add(r, 9, 11, 4, 4, PALETTE.bgDark); add(r, 14, 11, 4, 4, PALETTE.bgDark);
    add(r, 5, 16, 4, 2, PALETTE.yellow); add(r, 15, 16, 4, 2, PALETTE.red);
    add(r, 4, 17, 3, 3, PALETTE.bgDark); add(r, 17, 17, 3, 3, PALETTE.bgDark);
  },
  'warehouse-stack'(r) {
    add(r, 6, 4, 12, 14, PALETTE.concrete); add(r, 7, 6, 10, 4, PALETTE.bgDark);
    add(r, 7, 11, 10, 3, PALETTE.bgDark); add(r, 7, 15, 10, 2, PALETTE.bgDark);
    add(r, 5, 17, 14, 2, PALETTE.magenta); add(r, 8, 3, 8, 1, PALETTE.yellow);
  },
  'bass-bottom'(r) {
    add(r, 7, 3, 10, 4, PALETTE.concrete); add(r, 6, 7, 12, 5, PALETTE.concrete);
    add(r, 5, 12, 14, 7, PALETTE.concrete); add(r, 8, 4, 8, 2, PALETTE.bgDark);
    add(r, 7, 8, 10, 3, PALETTE.bgDark); add(r, 7, 13, 10, 5, PALETTE.bgDark);
    add(r, 7, 18, 10, 1, PALETTE.yellow);
  },
  'sonidero-rig'(r) {
    add(r, 5, 2, 14, 3, PALETTE.magenta); add(r, 6, 5, 12, 13, PALETTE.concrete);
    add(r, 8, 7, 3, 3, PALETTE.bgDark); add(r, 13, 7, 3, 3, PALETTE.bgDark);
    add(r, 8, 11, 8, 5, PALETTE.bgDark); add(r, 4, 4, 1, 14, PALETTE.yellow); add(r, 19, 4, 1, 14, PALETTE.yellow);
  }
};

const AVATAR_BUILDERS = {
  'dj-primo'(r) {
    add(r, 4, 2, 12, 3, PALETTE.concrete); add(r, 6, 5, 8, 7, PALETTE.skinBrown);
    add(r, 4, 7, 2, 3, PALETTE.concrete); add(r, 14, 7, 2, 3, PALETTE.concrete);
    add(r, 7, 8, 2, 1, PALETTE.bgDark); add(r, 11, 8, 2, 1, PALETTE.bgDark);
    add(r, 8, 10, 4, 1, PALETTE.red); add(r, 5, 12, 10, 2, PALETTE.yellow);
    add(r, 4, 14, 12, 5, PALETTE.concrete); add(r, 7, 14, 6, 2, PALETTE.bgDark);
  },
  'marcela-bass'(r) {
    add(r, 3, 2, 14, 10, PALETTE.bgDark); add(r, 5, 4, 10, 8, PALETTE.skinLightBrown);
    add(r, 7, 7, 2, 1, PALETTE.bgDark); add(r, 11, 7, 2, 1, PALETTE.bgDark);
    add(r, 8, 9, 4, 1, PALETTE.red); add(r, 15, 8, 1, 1, PALETTE.yellow);
    add(r, 4, 12, 12, 7, PALETTE.magenta); add(r, 2, 10, 2, 7, PALETTE.bgDark); add(r, 16, 10, 2, 7, PALETTE.bgDark);
  },
  'tokyo-breaker'(r) {
    add(r, 4, 2, 12, 4, PALETTE.bgDark); add(r, 5, 6, 10, 7, PALETTE.skinLight);
    add(r, 6, 7, 3, 2, PALETTE.cyan); add(r, 11, 7, 3, 2, PALETTE.cyan);
    add(r, 9, 8, 2, 1, PALETTE.bgDark); add(r, 8, 10, 4, 1, PALETTE.red);
    add(r, 4, 13, 12, 6, PALETTE.concrete); add(r, 8, 13, 4, 2, PALETTE.magenta);
  },
  'berlin-ghost'(r) {
    add(r, 4, 2, 12, 3, PALETTE.bgDark); add(r, 6, 5, 8, 7, PALETTE.skinPale);
    add(r, 7, 7, 2, 1, PALETTE.bgDark); add(r, 11, 7, 2, 1, PALETTE.bgDark);
    add(r, 8, 10, 4, 1, PALETTE.concrete); add(r, 4, 12, 12, 7, PALETTE.bgDark);
    add(r, 6, 14, 8, 2, PALETTE.concrete);
  },
  'sofia-system'(r) {
    add(r, 2, 1, 16, 11, PALETTE.bgDark); add(r, 5, 5, 10, 7, PALETTE.skinDark);
    add(r, 7, 7, 2, 1, PALETTE.yellow); add(r, 11, 7, 2, 1, PALETTE.yellow);
    add(r, 8, 9, 4, 1, PALETTE.magenta); add(r, 4, 12, 12, 7, PALETTE.magenta);
    add(r, 7, 13, 6, 2, PALETTE.bgDark);
  }
};

export function renderRigThumbnail(rigType, { size = 96 } = {}) {
  const rects = [];
  (RIG_BUILDERS[rigType] || RIG_BUILDERS.boombox)(rects);
  return svg(24, 24, size, rects);
}

export function renderProducerAvatar(seed, { size = 64 } = {}) {
  const rects = [];
  (AVATAR_BUILDERS[seed] || AVATAR_BUILDERS['dj-primo'])(rects);
  return svg(20, 20, size, rects);
}
