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
  rockGray: '#99887a', rockDark: '#776655',
};

const LEVEL_META: Record<number, { color: string; name: string; bg: string }> = {
  1: { color: C.hotPink, name: 'L1 HIP HOP', bg: C.grass1 },
  2: { color: C.orange, name: 'L2 REGGAETON', bg: '#cc9944' },
  3: { color: C.yellow, name: 'L3 BAILE FUNK', bg: '#44aa66' },
  4: { color: C.lime, name: 'L4 CUMBIA / TRAP', bg: '#88aa44' },
  5: { color: C.teal, name: 'L5 CORRIDOS / ELEC', bg: '#aa8855' },
  6: { color: C.purple, name: 'L6 TECHNO / HOUSE', bg: '#888899' },
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

function IsoBlock({ x, y, w, h, d, color }: { x: number; y: number; w: number; h: number; d: number; color: string }) {
  const top = shade(color, 30);
  const right = shade(color, -30);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <polygon points={`0,0 ${w},${-w * 0.5} ${w + d},${-w * 0.5 + d * 0.5} ${d},${d * 0.5}`} fill={top} />
      <polygon points={`0,0 ${d},${d * 0.5} ${d},${d * 0.5 + h} 0,${h}`} fill={color} />
      <polygon points={`${d},${d * 0.5} ${w + d},${-w * 0.5 + d * 0.5} ${w + d},${-w * 0.5 + d * 0.5 + h} ${d},${d * 0.5 + h}`} fill={right} />
      <polygon points={`0,0 ${w},${-w * 0.5} ${w + d},${-w * 0.5 + d * 0.5} ${d},${d * 0.5}`} fill="none" stroke={C.black} strokeWidth="0.5" opacity="0.3" />
      <polygon points={`0,0 ${d},${d * 0.5} ${d},${d * 0.5 + h} 0,${h}`} fill="none" stroke={C.black} strokeWidth="0.5" opacity="0.3" />
      <polygon points={`${d},${d * 0.5} ${w + d},${-w * 0.5 + d * 0.5} ${w + d},${-w * 0.5 + d * 0.5 + h} ${d},${d * 0.5 + h}`} fill="none" stroke={C.black} strokeWidth="0.5" opacity="0.3" />
    </g>
  );
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

      <IsoBlock x={-12} y={-8} w={8} d={8} h={isCompleted ? 6 : 10} color={levelColor} />
      <IsoBlock x={-4} y={-12} w={8} d={8} h={isCompleted ? 10 : 16} color={shade(levelColor, -15)} />
      <IsoBlock x={4} y={-6} w={6} d={6} h={isCompleted ? 4 : 8} color={shade(levelColor, 15)} />

      {isCompleted && (
        <g transform="translate(-2, -22)">
          <rect x="0" y="0" width="5" height="8" fill={C.white} stroke={C.black} strokeWidth="0.5" />
          <polygon points="5,0 12,4 5,4" fill={levelColor} stroke={C.black} strokeWidth="0.5" />
        </g>
      )}

      {isCurrent && (
        <g transform="translate(-3, -28)">
          <polygon points="3,0 6,6 0,6" fill={C.yellow} stroke={C.black} strokeWidth="0.5">
            <animate attributeName="opacity" values="1;0.4;1" dur="0.6s" repeatCount="indefinite" />
          </polygon>
        </g>
      )}

      <text x="0" y="20" textAnchor="middle" fontSize="6" fontFamily="'Press Start 2P', monospace" fill={isLocked ? '#666' : C.white} stroke={C.black} strokeWidth="2" paintOrder="stroke" strokeLinejoin="round">
        {city.name.toUpperCase().slice(0, 12)}
      </text>
      <text x="0" y="28" textAnchor="middle" fontSize="5" fontFamily="'Press Start 2P', monospace" fill={isLocked ? '#555' : levelColor} stroke={C.black} strokeWidth="1.5" paintOrder="stroke" strokeLinejoin="round">
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
  const { state } = useGameState();
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
            <IsoBlock x={tree.x} y={tree.y} w={4} d={4} h={tree.h} color={tree.color} />
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
              onClick={() => { if (!didDrag) setLocation(`/studio/${city.id}`); }}
            />
          );
        })}
      </svg>

      {/* HUD: Title */}
      <div className="absolute top-4 left-4 z-30 bg-[#fff8e7] border-[3px] border-[#111] p-3 px-4" style={{ boxShadow: '4px 4px 0 #111' }}>
        <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#ccbbaa]" />
        <div className="text-[#ff3399] text-[10px] ml-1" style={{ textShadow: '1px 1px 0 #111' }}>BEATWORLD</div>
        <div className="text-[#0050cc] text-[6px] ml-1 mt-1">DRAG TO PAN · CLICK A CITY</div>
      </div>

      {/* HUD: Stats */}
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

      {/* HUD: Action Buttons */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        <button className="bg-[#0050cc] text-white text-[8px] px-4 py-2 border-2 border-[#111] relative overflow-hidden hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px]" style={{ boxShadow: '3px 3px 0 #111' }} onClick={(e) => e.stopPropagation()}>
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#003399]" />
          <span className="ml-1">🎵 GRAMMCHAT</span>
        </button>
        <button className="bg-[#ffee00] text-[#111] text-[8px] px-4 py-2 border-2 border-[#111] relative overflow-hidden hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px]" style={{ boxShadow: '3px 3px 0 #111' }} onClick={(e) => e.stopPropagation()}>
          <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#ccaa00]" />
          <span className="ml-1">🏆 LEADERBOARD</span>
        </button>
      </div>

      {/* HUD: Legend */}
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
