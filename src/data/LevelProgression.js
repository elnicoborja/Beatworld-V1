/**
 * LEVEL_PROGRESSION — single source of truth for the 6 levels (Level 1 vertical slice).
 * Used by LevelSelectScene, SoundsystemRevealScene, ShareArtifact, DirectoryScene.
 *
 * Per-level neon color drives the level number glow on cards + the unlocked piece halo.
 */
export const LEVEL_PROGRESSION = [
  {
    level: 1,
    region: 'NEW YORK',
    genre: 'HIP HOP',
    piece: 'BOOMBOX',
    pieceSprite: '/assets/sprites/soundsystem/boombox.png',
    cityId: 'new-york',
    color: '#ff3399',
    unlocked: true,
  },
  {
    level: 2,
    region: 'CARIBBEAN',
    genre: 'REGGAETON',
    piece: 'PICÓ STACK',
    pieceSprite: '/assets/sprites/soundsystem/pico.png',
    cityId: 'puerto-rico',
    color: '#00ddff',
    unlocked: false,
  },
  {
    level: 3,
    region: 'BRAZIL',
    genre: 'BAILE FUNK',
    piece: 'BAILE FUNK TRUCK',
    pieceSprite: '/assets/sprites/soundsystem/baile-funk.png',
    cityId: 'rio',
    color: '#ffaa00',
    unlocked: false,
  },
  {
    level: 4,
    region: 'ANDEAN',
    genre: 'TECH HOUSE',
    piece: 'BASS CABINET',
    pieceSprite: '/assets/sprites/soundsystem/bass-cabinet.png',
    cityId: 'bogota',
    color: '#00cc44',
    unlocked: false,
  },
  {
    level: 5,
    region: 'MEXICO',
    genre: 'CUMBIA',
    piece: 'SONIDERO RIG',
    pieceSprite: '/assets/sprites/soundsystem/sonidero.png',
    cityId: 'mexico-city',
    color: '#ff00c8',
    unlocked: false,
  },
  {
    level: 6,
    region: 'BERLIN UNDERGROUND',
    genre: 'TECHNO',
    piece: 'WAREHOUSE STACK',
    pieceSprite: '/assets/sprites/soundsystem/warehouse.png',
    cityId: 'berlin',
    color: '#ff3344',
    unlocked: false,
  },
];

export function levelByNumber(n) {
  return LEVEL_PROGRESSION.find(l => l.level === n);
}
