import { useState, useMemo, useCallback } from 'react';
import { CITIES_LIST, type CityLevel } from '@/lib/game-data';
import { useLocation } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';

const C = {
  skyBlue: '#87ceeb', cream: '#fff8e7', hotPink: '#ff3399', magenta: '#cc0066',
  yellow: '#ffee00', cobalt: '#0050cc', lime: '#44cc00', orange: '#ff8800',
  teal: '#00aaaa', purple: '#6600cc', black: '#111111', white: '#ffffff',
  grass1: '#66bb44', grass2: '#55aa33', grass3: '#449922', sand: '#ddcc88',
  water: '#4499bb', waterDark: '#337799', pathColor: '#eeddaa', pathDot: '#ccaa66',
};

const LEVEL_META: Record<number, { color: string; name: string }> = {
  1: { color: C.hotPink, name: 'L1 HIP HOP' },
  2: { color: C.orange, name: 'L2 REGGAETON' },
  3: { color: C.yellow, name: 'L3 BAILE FUNK' },
  4: { color: C.lime, name: 'L4 CUMBIA / TRAP' },
  5: { color: C.teal, name: 'L5 CORRIDOS / ELEC' },
  6: { color: C.purple, name: 'L6 TECHNO / HOUSE' },
};

const NODE_POSITIONS: Record<string, { x: number; y: number }> = {
  'new-york': { x: 280, y: 180 }, 'los-angeles': { x: 120, y: 220 },
  'puerto-rico': { x: 380, y: 320 }, 'dominican-republic': { x: 460, y: 350 },
  'medellin': { x: 340, y: 420 },
  'rio': { x: 420, y: 580 }, 'fortaleza': { x: 500, y: 520 }, 'sao-paulo': { x: 360, y: 620 },
  'bogota': { x: 260, y: 460 }, 'buenos-aires': { x: 320, y: 720 }, 'santiago': { x: 220, y: 700 },
  'mexico-city': { x: 160, y: 340 }, 'monterrey': { x: 140, y: 280 }, 'tulum': { x: 240, y: 360 },
  'berlin': { x: 700, y: 160 }, 'london': { x: 620, y: 140 }, 'newcastle': { x: 640, y: 100 }, 'brighton': { x: 660, y: 180 },
};

const PATH_CONNECTIONS: [string, string][] = [
  ['new-york', 'los-angeles'], ['new-york', 'puerto-rico'], ['los-angeles', 'monterrey'],
  ['puerto-rico', 'dominican-republic'], ['puerto-rico', 'medellin'], ['dominican-republic', 'medellin'],
  ['medellin', 'bogota'], ['medellin', 'rio'],
  ['rio', 'fortaleza'], ['rio', 'sao-paulo'], ['sao-paulo', 'buenos-aires'], ['buenos-aires', 'santiago'],
  ['bogota', 'mexico-city'], ['mexico-city', 'monterrey'], ['mexico-city', 'tulum'],
  ['tulum', 'london'],
  ['london', 'berlin'], ['london', 'newcastle'], ['london', 'brighton'], ['berlin', 'brighton'],
];

function shade(col: string, amt: number) {
  const c = col.startsWith('#') ? col.slice(1) : col;
  const num = parseInt(c, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amt));
  return '#' + ((b | (g << 8) | (r << 16)) >>> 0).toString(16).padStart(6, '0');
}

function CityLandmark({ cityId, color }: { cityId: string; color: string }) {
  const top = shade(color, 30);
  const right = shade(color, -30);
  const dark = shade(color, -50);

  switch (cityId) {
    case 'new-york':
      return (
        <g>
          <polygon points="-2,-30 0,-34 2,-30" fill="#44cc88" />
          <rect x="-1" y="-30" width="2" height="12" fill="#44cc88" />
          <rect x="-4" y="-18" width="8" height="4" fill={top} />
          <polygon points="-6,-14 -6,0 6,0 6,-14" fill={color} />
          <polygon points="6,-14 6,0 10,-2 10,-12" fill={right} />
          <rect x="-3" y="-10" width="2" height="2" fill="#ffee00" />
          <rect x="1" y="-10" width="2" height="2" fill="#ffee00" />
          <rect x="-3" y="-6" width="2" height="2" fill="#ffee00" />
          <rect x="1" y="-6" width="2" height="2" fill="#ffee00" />
        </g>
      );
    case 'los-angeles':
      return (
        <g>
          <line x1="-8" y1="-2" x2="-8" y2="-20" stroke="#885522" strokeWidth="2" />
          <ellipse cx="-8" cy="-22" rx="6" ry="4" fill="#44aa33" />
          <ellipse cx="-8" cy="-24" rx="5" ry="3" fill="#66cc44" />
          <line x1="6" y1="-2" x2="6" y2="-16" stroke="#885522" strokeWidth="2" />
          <ellipse cx="6" cy="-18" rx="5" ry="3" fill="#44aa33" />
          <ellipse cx="6" cy="-20" rx="4" ry="2.5" fill="#66cc44" />
          <rect x="-12" y="-2" width="24" height="3" fill={C.sand} />
        </g>
      );
    case 'puerto-rico':
      return (
        <g>
          <ellipse cx="0" cy="0" rx="14" ry="4" fill={C.sand} />
          <line x1="4" y1="-2" x2="4" y2="-18" stroke="#885522" strokeWidth="1.5" />
          <ellipse cx="4" cy="-20" rx="5" ry="3" fill="#44aa33" />
          <polygon points="-6,-8 -6,0 -2,0 -2,-8" fill="#ff6644" />
          <polygon points="-2,-10 -2,0 2,0 2,-10" fill="#ff8866" />
        </g>
      );
    case 'dominican-republic':
      return (
        <g>
          <polygon points="-8,0 -8,-12 8,-12 8,0" fill={color} />
          <polygon points="8,-12 8,0 12,-2 12,-10" fill={right} />
          <polygon points="-8,-12 0,-18 8,-12" fill={top} />
          <rect x="-2" y="-8" width="4" height="8" fill={dark} />
          <rect x="-6" y="-6" width="2" height="2" fill="#ffee00" />
          <rect x="4" y="-6" width="2" height="2" fill="#ffee00" />
        </g>
      );
    case 'medellin':
      return (
        <g>
          <polygon points="-10,0 0,-16 10,0" fill="#558844" />
          <polygon points="-6,0 0,-10 6,0" fill="#66aa55" />
          <rect x="-3" y="-6" width="6" height="6" fill={color} />
          <rect x="3" y="-6" width="4" height="4" fill={right} />
          <rect x="-1" y="-2" width="2" height="2" fill="#ffee00" />
        </g>
      );
    case 'rio':
      return (
        <g>
          <polygon points="0,-30 -3,-24 3,-24" fill="#ddddcc" />
          <rect x="-1" y="-24" width="2" height="8" fill="#ddddcc" />
          <line x1="-6" y1="-22" x2="0" y2="-26" stroke="#ddddcc" strokeWidth="1.5" />
          <line x1="6" y1="-22" x2="0" y2="-26" stroke="#ddddcc" strokeWidth="1.5" />
          <polygon points="-8,0 0,-16 8,0" fill="#558844" />
          <polygon points="-5,0 0,-10 5,0" fill="#66aa55" />
        </g>
      );
    case 'fortaleza':
      return (
        <g>
          <rect x="-2" y="-18" width="4" height="18" fill="#558844" />
          <ellipse cx="0" cy="-18" rx="3" ry="2" fill="#66bb44" />
          <line x1="-4" y1="-10" x2="-8" y2="-6" stroke="#558844" strokeWidth="2" />
          <line x1="4" y1="-12" x2="7" y2="-8" stroke="#558844" strokeWidth="2" />
          <line x1="-3" y1="-14" x2="-6" y2="-10" stroke="#558844" strokeWidth="2" />
          <ellipse cx="0" cy="0" rx="10" ry="3" fill={C.sand} />
        </g>
      );
    case 'sao-paulo':
      return (
        <g>
          <rect x="-8" y="-6" width="5" height="6" fill={color} />
          <rect x="-4" y="-14" width="6" height="14" fill={shade(color, 10)} />
          <rect x="2" y="-10" width="5" height="10" fill={right} />
          <rect x="7" y="-4" width="4" height="4" fill={dark} />
          <rect x="-3" y="-12" width="1" height="1" fill="#ffee00" />
          <rect x="-1" y="-12" width="1" height="1" fill="#ffee00" />
          <rect x="-3" y="-10" width="1" height="1" fill="#ffee00" />
          <rect x="3" y="-8" width="1" height="1" fill="#ffee00" />
          <rect x="5" y="-8" width="1" height="1" fill="#ffee00" />
        </g>
      );
    case 'bogota':
      return (
        <g>
          <polygon points="-10,0 0,-14 10,0" fill="#667755" />
          <polygon points="-6,0 0,-8 6,0" fill="#778866" />
          <rect x="-2" y="-20" width="4" height="6" fill="#ffffff" />
          <polygon points="-2,-20 0,-24 2,-20" fill="#ffffff" />
          <line x1="0" y1="-24" x2="0" y2="-26" stroke="#cc3300" strokeWidth="1" />
          <rect x="-0.5" y="-27" width="3" height="2" fill="#cc3300" />
        </g>
      );
    case 'buenos-aires':
      return (
        <g>
          <rect x="-1" y="-28" width="2" height="28" fill="#ddddcc" />
          <polygon points="-4,-28 0,-34 4,-28" fill="#ddddcc" />
          <rect x="-6" y="-2" width="12" height="3" fill={color} />
          <rect x="-4" y="-5" width="8" height="3" fill={shade(color, 10)} />
        </g>
      );
    case 'santiago':
      return (
        <g>
          <polygon points="-12,0 -4,-18 4,0" fill="#8899aa" />
          <polygon points="-4,0 2,-14 8,0" fill="#99aabb" />
          <polygon points="0,0 6,-10 12,0" fill="#7788aa" />
          <polygon points="-6,-10 -4,-18 -2,-10" fill="#ffffff" />
          <polygon points="4,-6 6,-10 8,-6" fill="#ffffff" />
        </g>
      );
    case 'mexico-city':
      return (
        <g>
          <polygon points="-10,0 -10,-4 10,-4 10,0" fill={color} />
          <polygon points="-8,-4 -8,-8 8,-8 8,-4" fill={shade(color, 10)} />
          <polygon points="-6,-8 0,-16 6,-8" fill={top} />
          <rect x="-1" y="-10" width="2" height="4" fill={dark} />
          <polygon points="10,-4 14,-2 14,2 10,0" fill={right} />
        </g>
      );
    case 'monterrey':
      return (
        <g>
          <polygon points="-10,0 0,-20 10,0" fill="#887766" />
          <polygon points="-4,0 0,-12 4,0" fill="#998877" />
          <polygon points="0,-20 -2,-18 2,-18" fill="#776655" />
          <rect x="-6" y="-2" width="12" height="2" fill={color} />
        </g>
      );
    case 'tulum':
      return (
        <g>
          <polygon points="-8,0 -8,-8 8,-8 8,0" fill="#bbaa88" />
          <polygon points="-6,-8 -6,-12 6,-12 6,-8" fill="#ccbb99" />
          <polygon points="-4,-12 -4,-14 4,-14 4,-12" fill="#ddccaa" />
          <rect x="-2" y="-6" width="4" height="6" fill="#998877" />
          <line x1="8" y1="-2" x2="8" y2="-18" stroke="#885522" strokeWidth="1.5" />
          <ellipse cx="8" cy="-20" rx="4" ry="3" fill="#44aa33" />
        </g>
      );
    case 'berlin':
      return (
        <g>
          <rect x="-10" y="-14" width="4" height="14" fill={color} />
          <rect x="-6" y="-10" width="12" height="10" fill={shade(color, 10)} />
          <rect x="6" y="-14" width="4" height="14" fill={color} />
          <rect x="-10" y="-16" width="4" height="2" fill={top} />
          <rect x="6" y="-16" width="4" height="2" fill={top} />
          <rect x="-6" y="-12" width="12" height="2" fill={top} />
          <rect x="-2" y="-8" width="4" height="8" fill={dark} />
        </g>
      );
    case 'london':
      return (
        <g>
          <rect x="-3" y="-28" width="6" height="28" fill={color} />
          <rect x="-5" y="-30" width="10" height="4" fill={top} />
          <polygon points="0,-34 -3,-30 3,-30" fill={top} />
          <rect x="-8" y="-14" width="16" height="4" fill={shade(color, 10)} />
          <circle cx="0" cy="-22" r="4" fill="none" stroke={top} strokeWidth="1.5" />
          <line x1="-2" y1="-22" x2="2" y2="-22" stroke={top} strokeWidth="1" />
          <line x1="0" y1="-24" x2="0" y2="-20" stroke={top} strokeWidth="1" />
        </g>
      );
    case 'newcastle':
      return (
        <g>
          <rect x="-10" y="-12" width="4" height="12" fill={color} />
          <rect x="6" y="-12" width="4" height="12" fill={color} />
          <path d="M-6,-8 Q0,-16 6,-8" fill="none" stroke={top} strokeWidth="2" />
          <rect x="-4" y="-6" width="8" height="6" fill={shade(color, -20)} />
        </g>
      );
    case 'brighton':
      return (
        <g>
          <ellipse cx="0" cy="0" rx="12" ry="3" fill={C.sand} />
          <rect x="-8" y="-8" width="16" height="8" fill={color} />
          <polygon points="-8,-8 -4,-14 0,-8" fill={top} />
          <polygon points="0,-8 4,-14 8,-8" fill={shade(top, -10)} />
          <rect x="-2" y="-4" width="4" height="4" fill={dark} />
          <line x1="-12" y1="0" x2="-20" y2="-2" stroke="#886644" strokeWidth="1" />
          <line x1="12" y1="0" x2="20" y2="-2" stroke="#886644" strokeWidth="1" />
        </g>
      );
    default:
      return (
        <g>
          <rect x="-6" y="-10" width="12" height="10" fill={color} />
          <rect x="6" y="-8" width="4" height="8" fill={right} />
          <polygon points="-6,-10 0,-14 6,-10" fill={top} />
        </g>
      );
  }
}

function CityNode({ city, levelColor, isUnlocked, isCurrent, isCompleted, isHovered, onHover, onClick }: {
  city: CityLevel; levelColor: string; isUnlocked: boolean; isCurrent: boolean; isCompleted: boolean;
  isHovered: boolean; onHover: (id: string | null) => void; onClick: () => void;
}) {
  const pos = NODE_POSITIONS[city.id] || { x: 400, y: 400 };
  const isLocked = !isUnlocked && !isCurrent;

  return (
    <g
      transform={`translate(${pos.x}, ${pos.y})`}
      style={{ cursor: isLocked ? 'default' : 'pointer', opacity: isLocked ? 0.35 : 1 }}
      onMouseEnter={() => !isLocked && onHover(city.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => !isLocked && onClick()}
    >
      {isCurrent && (
        <circle cx="0" cy="0" r="22" fill="none" stroke={C.white} strokeWidth="2" strokeDasharray="4 3" opacity="0.8">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite" />
        </circle>
      )}

      <CityLandmark cityId={city.id} color={levelColor} />

      {isCompleted && (
        <g transform="translate(-2, -22)">
          <rect x="0" y="0" width="5" height="8" fill={C.white} stroke={C.black} strokeWidth="0.5" />
          <polygon points="5,0 12,4 5,4" fill={levelColor} stroke={C.black} strokeWidth="0.5" />
        </g>
      )}

      {isCurrent && (
        <g transform="translate(-3, -36)">
          <polygon points="3,0 6,6 0,6" fill={C.yellow} stroke={C.black} strokeWidth="0.5">
            <animate attributeName="opacity" values="1;0.4;1" dur="0.6s" repeatCount="indefinite" />
          </polygon>
        </g>
      )}

      <text x="0" y="14" textAnchor="middle" fontSize="6" fontFamily="'Press Start 2P', monospace" fill={isLocked ? '#666' : C.white} stroke={C.black} strokeWidth="2" paintOrder="stroke" strokeLinejoin="round">
        {city.name.toUpperCase().slice(0, 12)}
      </text>
      <text x="0" y="22" textAnchor="middle" fontSize="5" fontFamily="'Press Start 2P', monospace" fill={isLocked ? '#555' : levelColor} stroke={C.black} strokeWidth="1.5" paintOrder="stroke" strokeLinejoin="round">
        {city.genre.toUpperCase()}
      </text>

      {isHovered && !isLocked && (
        <g transform="translate(20, -40)">
          <rect x="0" y="0" width="110" height="50" fill={C.cream} stroke={C.black} strokeWidth="2" />
          <rect x="0" y="0" width="110" height="12" fill={levelColor} stroke={C.black} strokeWidth="2" />
          <text x="6" y="9" fontSize="5" fontFamily="'Press Start 2P', monospace" fill={C.black}>{city.emoji} {city.name.toUpperCase()}</text>
          <text x="6" y="24" fontSize="4.5" fontFamily="'Press Start 2P', monospace" fill={C.cobalt}>{city.genre.toUpperCase()}</text>
          <text x="6" y="34" fontSize="4" fontFamily="'Press Start 2P', monospace" fill={C.black}>L{city.level} · {city.defaultBpm || 120} BPM</text>
          <text x="6" y="44" fontSize="4" fontFamily="'Press Start 2P', monospace" fill={C.lime}>▶ ENTER STUDIO</text>
        </g>
      )}
    </g>
  );
}

export function WorldMap() {
  const [, setLocation] = useLocation();
  const { state, updateState } = useGameState();
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [didDrag, setDidDrag] = useState(false);

  const isoTiles = useMemo(() => {
    const tiles: { x: number; y: number; color: string }[] = [];
    const tW = 32, tH = 16;
    for (let row = 0; row < 60; row++) {
      for (let col = 0; col < 35; col++) {
        const px = (col - row) * tW * 0.5 + 450;
        const py = (col + row) * tH * 0.5 - 100;
        const noise = Math.sin(col * 0.7) * Math.cos(row * 0.5);
        let color = C.grass1;
        if (noise > 0.5) color = C.grass2;
        else if (noise > 0.2) color = C.grass3;
        else if (noise < -0.6) color = C.water;
        else if (noise < -0.3) color = C.sand;
        tiles.push({ x: px, y: py, color });
      }
    }
    return tiles;
  }, []);

  const treeClusters = useMemo(() => {
    const trees: { x: number; y: number; h: number; color: string }[] = [];
    for (let i = 0; i < 40; i++) {
      const tx = 50 + Math.random() * 750;
      const ty = 50 + Math.random() * 750;
      let blocked = false;
      for (const pos of Object.values(NODE_POSITIONS)) {
        if (Math.abs(tx - pos.x) < 40 && Math.abs(ty - pos.y) < 40) { blocked = true; break; }
      }
      if (!blocked) {
        const g = ['#338833', '#44aa33', '#228822', '#55cc44'][Math.floor(Math.random() * 4)];
        trees.push({ x: tx, y: ty, h: 4 + Math.random() * 6, color: g });
      }
    }
    return trees;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    setDidDrag(false);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragging) {
      const dx = e.clientX - dragStart.x - pan.x;
      const dy = e.clientY - dragStart.y - pan.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) setDidDrag(true);
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  }, [dragging, dragStart, pan]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  return (
    <div
      className="relative w-screen h-screen select-none overflow-hidden uppercase"
      style={{ backgroundColor: '#3388aa', fontFamily: "'Press Start 2P', monospace", cursor: dragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <svg
        width="100%" height="100%"
        viewBox={`${-pan.x * 0.8 - 50} ${-pan.y * 0.8 - 50} 900 850`}
        style={{ imageRendering: 'pixelated' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="map-shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="1" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        {isoTiles.map((tile, i) => {
          const tW = 32, tH = 16;
          return (
            <polygon
              key={i}
              points={`${tile.x},${tile.y} ${tile.x + tW * 0.5},${tile.y + tH * 0.5} ${tile.x},${tile.y + tH} ${tile.x - tW * 0.5},${tile.y + tH * 0.5}`}
              fill={tile.color}
              stroke={shade(tile.color, -15)}
              strokeWidth="0.5"
            />
          );
        })}

        {treeClusters.map((tree, i) => (
          <g key={`tree-${i}`}>
            <polygon
              points={`${tree.x},${tree.y} ${tree.x + 4},${tree.y + 2} ${tree.x + 4},${tree.y + 2 + tree.h} ${tree.x},${tree.y + tree.h}`}
              fill={tree.color}
            />
            <polygon
              points={`${tree.x},${tree.y} ${tree.x + 4},${tree.y - 2} ${tree.x + 8},${tree.y} ${tree.x + 4},${tree.y + 2}`}
              fill={shade(tree.color, 30)}
            />
          </g>
        ))}

        {PATH_CONNECTIONS.map(([from, to], i) => {
          const a = NODE_POSITIONS[from];
          const b = NODE_POSITIONS[to];
          if (!a || !b) return null;
          const fromCity = CITIES_LIST.find(c => c.id === from);
          const toCity = CITIES_LIST.find(c => c.id === to);
          const fromUnlocked = fromCity && fromCity.level <= state.currentLevel;
          const toUnlocked = toCity && toCity.level <= state.currentLevel;
          const pathActive = fromUnlocked || toUnlocked;

          return (
            <g key={`path-${i}`}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.black} strokeWidth="5" opacity="0.2" />
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={pathActive ? C.pathColor : '#666'}
                strokeWidth="3"
                strokeDasharray="6 4"
                opacity={pathActive ? 0.9 : 0.3}
              />
              {pathActive && Array.from({ length: 5 }).map((_, di) => {
                const t = (di + 1) / 6;
                const dx = a.x + (b.x - a.x) * t;
                const dy = a.y + (b.y - a.y) * t;
                return <circle key={di} cx={dx} cy={dy} r="2" fill={C.pathDot} stroke={C.black} strokeWidth="0.5" />;
              })}
            </g>
          );
        })}

        {CITIES_LIST.map((city) => {
          const isUnlocked = city.level <= state.currentLevel;
          const isCurrent = state.currentCity === city.id;
          const isCompleted = state.completedCities.includes(city.id);
          const levelColor = LEVEL_META[city.level]?.color || '#fff';

          return (
            <CityNode
              key={city.id}
              city={city}
              levelColor={levelColor}
              isUnlocked={isUnlocked}
              isCurrent={isCurrent}
              isCompleted={isCompleted}
              isHovered={hoveredCity === city.id}
              onHover={setHoveredCity}
              onClick={() => { if (!didDrag) { updateState({ currentCity: city.id }); setLocation(`/studio/${city.id}`); } }}
            />
          );
        })}
      </svg>

      <div className="absolute top-4 left-4 z-30 bg-[#fff8e7] border-[3px] border-[#111] p-3 px-4" style={{ boxShadow: '4px 4px 0 #111' }}>
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#ccbbaa]" />
        <div className="text-[#ff3399] text-[10px] ml-1" style={{ textShadow: '1px 1px 0 #111' }}>BEATWORLD</div>
        <div className="text-[#0050cc] text-[6px] ml-1 mt-1">DRAG TO PAN · CLICK A CITY</div>
      </div>

      <div className="absolute top-4 right-4 z-30 bg-[#fff8e7] border-[3px] border-[#111] flex" style={{ boxShadow: '4px 4px 0 #111' }}>
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#ccbbaa]" />
        <div className="p-2 px-3 ml-1">
          <div className="text-[#888] text-[5px]">PRODUCER</div>
          <div className="text-[#111] text-[8px]">{state.playerName.toUpperCase()}</div>
        </div>
        <div className="w-[2px] bg-[#111] my-1" />
        <div className="p-2 px-3">
          <div className="text-[#888] text-[5px]">CLOUT</div>
          <div className="text-[#ff3399] text-[8px]" style={{ textShadow: '1px 1px 0 #111' }}>{String(state.clout).padStart(6, '0')}</div>
        </div>
        <div className="w-[2px] bg-[#111] my-1" />
        <div className="p-2 px-3">
          <div className="text-[#888] text-[5px]">CITIES</div>
          <div className="text-[#44cc00] text-[8px]">{state.completedCities.length}/18</div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        <button className="bg-[#0050cc] text-white text-[8px] px-4 py-2 border-2 border-[#111] relative overflow-hidden hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px]" style={{ boxShadow: '3px 3px 0 #111' }} onClick={(e) => { e.stopPropagation(); setLocation('/social'); }}>
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#003399]" />
          <span className="ml-1">🎵 GRAMMCHAT</span>
        </button>
        <button className="bg-[#ffee00] text-[#111] text-[8px] px-4 py-2 border-2 border-[#111] relative overflow-hidden hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px]" style={{ boxShadow: '3px 3px 0 #111' }} onClick={(e) => { e.stopPropagation(); setLocation('/leaderboard'); }}>
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#ccaa00]" />
          <span className="ml-1">🏆 LEADERBOARD</span>
        </button>
        <button className="bg-[#ff3399] text-white text-[8px] px-4 py-2 border-2 border-[#111] relative overflow-hidden hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px]" style={{ boxShadow: '3px 3px 0 #111' }} onClick={(e) => { e.stopPropagation(); setLocation('/profile'); }}>
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#cc0066]" />
          <span className="ml-1">👤 PROFILE</span>
        </button>
      </div>

      <div className="absolute bottom-4 right-4 z-30 bg-[#fff8e7] border-[3px] border-[#111] p-2" style={{ boxShadow: '4px 4px 0 #111' }}>
        <div className="text-[#111] text-[6px] mb-1 border-b border-[#111] pb-1">LEVELS</div>
        {Object.entries(LEVEL_META).map(([key, level]) => (
          <div key={key} className="flex items-center gap-1 mt-1">
            <div className="w-[8px] h-[8px] border border-[#111]" style={{ backgroundColor: level.color }} />
            <div className="text-[5px] text-[#111]">{level.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
