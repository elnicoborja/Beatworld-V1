import { useState, useMemo } from 'react';
import { CITIES, CITIES_LIST, type CityLevel } from '@/lib/game-data';
import { useLocation } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';

const C = {
  skyBlue: '#87ceeb', oceanTeal: '#4499aa', oceanDark: '#4488bb', cream: '#fff8e7',
  hotPink: '#ff3399', yellow: '#ffee00', cobalt: '#0050cc', lime: '#44cc00',
  orange: '#ff8800', teal: '#00aaaa', purple: '#6600cc', black: '#111111', gray: '#888899',
  lowland: '#44aa44', highland: '#aa8844', desert: '#ddbb66', snow: '#eeeeff', coast: '#d4c090',
};

const LEVEL_META: Record<number, { color: string; name: string }> = {
  1: { color: C.hotPink, name: 'L1 HIP HOP' },
  2: { color: C.orange, name: 'L2 REGGAETON' },
  3: { color: C.yellow, name: 'L3 BAILE FUNK' },
  4: { color: C.lime, name: 'L4 CUMBIA / TRAP' },
  5: { color: C.teal, name: 'L5 CORRIDOS / ELEC' },
  6: { color: C.purple, name: 'L6 TECHNO / HOUSE' },
};

const CITY_POSITIONS: Record<string, { x: number; y: number }> = {
  'new-york': { x: 22, y: 28 }, 'los-angeles': { x: 12, y: 28 },
  'puerto-rico': { x: 28, y: 35 }, 'dominican-republic': { x: 27, y: 36 },
  'medellin': { x: 23, y: 44 }, 'rio': { x: 30, y: 60 },
  'fortaleza': { x: 33, y: 55 }, 'sao-paulo': { x: 28, y: 62 },
  'bogota': { x: 22, y: 45 }, 'buenos-aires': { x: 25, y: 70 },
  'santiago': { x: 21, y: 70 }, 'mexico-city': { x: 16, y: 33 },
  'monterrey': { x: 16, y: 30 }, 'tulum': { x: 19, y: 34 },
  'berlin': { x: 50, y: 22 }, 'london': { x: 46, y: 22 },
  'newcastle': { x: 46, y: 20 }, 'brighton': { x: 46, y: 23 },
};

const CITY_SHORTS: Record<string, string> = {
  'new-york': 'NYC', 'los-angeles': 'LAX', 'puerto-rico': 'SJU', 'dominican-republic': 'SDQ',
  'medellin': 'MDE', 'rio': 'GIG', 'fortaleza': 'FOR', 'sao-paulo': 'GRU',
  'bogota': 'BOG', 'buenos-aires': 'EZE', 'santiago': 'SCL', 'mexico-city': 'MEX',
  'monterrey': 'MTY', 'tulum': 'TQO', 'berlin': 'BER', 'london': 'LHR',
  'newcastle': 'NCL', 'brighton': 'BSH',
};

function shade(col: string, amt: number) {
  let c = col.startsWith('#') ? col.slice(1) : col;
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
      <polygon points={`0,0 ${w},${-w * 0.5} ${w + d},${-w * 0.5 + d * 0.5} ${d},${d * 0.5}`} fill="none" stroke={C.black} strokeWidth="0.5" />
      <polygon points={`0,0 ${d},${d * 0.5} ${d},${d * 0.5 + h} 0,${h}`} fill="none" stroke={C.black} strokeWidth="0.5" />
      <polygon points={`${d},${d * 0.5} ${w + d},${-w * 0.5 + d * 0.5} ${w + d},${-w * 0.5 + d * 0.5 + h} ${d},${d * 0.5 + h}`} fill="none" stroke={C.black} strokeWidth="0.5" />
    </g>
  );
}

function CityPin({ city, isUnlocked, isCurrent, levelColor, onClick }: {
  city: CityLevel; isUnlocked: boolean; isCurrent: boolean; levelColor: string; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pos = CITY_POSITIONS[city.id] || { x: 50, y: 50 };
  const isLocked = !isUnlocked && !isCurrent;
  const short = CITY_SHORTS[city.id] || city.id.slice(0, 3).toUpperCase();

  return (
    <div
      className={`absolute ${isLocked ? 'pointer-events-none' : 'cursor-pointer'} ${isCurrent ? 'z-40' : 'z-20'}`}
      style={{
        top: `${pos.y}%`, left: `${pos.x}%`,
        filter: isLocked ? 'saturate(0) brightness(0.4)' : undefined,
        transform: isCurrent ? 'scale(1.4)' : undefined,
      }}
      onMouseEnter={() => !isLocked && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => !isLocked && onClick()}
    >
      <div className="relative -translate-x-1/2 -translate-y-full flex flex-col items-center">
        <svg width="32" height="32" viewBox="0 0 32 32" className="overflow-visible" style={{ imageRendering: 'pixelated' }}>
          <IsoBlock x={12} y={18} w={8} d={8} h={8} color={levelColor} />
          <IsoBlock x={4} y={22} w={8} d={8} h={6} color={levelColor} />
          <IsoBlock x={18} y={14} w={8} d={8} h={12} color={levelColor} />
        </svg>

        <div
          className="absolute w-[4px] h-[4px] top-[4px] right-[8px] border border-[#111]"
          style={{
            animation: isCurrent ? 'beaconBlink 0.4s steps(2, start) infinite' : 'beaconBlink 1s steps(2, start) infinite',
            '--level-color': levelColor,
          } as React.CSSProperties}
        />

        <div className="mt-[-4px] px-1 py-[2px] border border-[#111111]" style={{ backgroundColor: levelColor, boxShadow: '1px 1px 0 #111' }}>
          <span className="text-[6px] text-[#111] whitespace-nowrap">{short}</span>
        </div>

        {hovered && !isLocked && (
          <div className="absolute bottom-full mb-2 bg-[#fff8e7] border-2 border-[#111] p-2 whitespace-nowrap flex flex-col gap-[6px] z-50" style={{ boxShadow: '3px 3px 0 #111' }}>
            <div className="text-[7px] text-[#111]">{city.emoji} {city.name.toUpperCase()}</div>
            <div className="text-[7px] text-[#0050cc]">{city.genre.toUpperCase()}</div>
            <div className="text-[7px] text-[#888899]">L{city.level} · {city.defaultBpm || 120} BPM</div>
            <div className="text-[7px] text-[#44cc00] mt-1">✓ ENTER STUDIO</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function WorldMap() {
  const [, setLocation] = useLocation();
  const { state } = useGameState();

  const waves = useMemo(() =>
    Array.from({ length: 200 }).map(() => ({ x: Math.random() * 100, y: Math.random() * 100 })), []);

  const handleCityClick = (city: CityLevel) => {
    setLocation(`/studio/${city.id}`);
  };

  return (
    <div
      className="relative w-screen h-screen select-none overflow-hidden uppercase text-[#111111]"
      style={{ background: `linear-gradient(to bottom, ${C.skyBlue} 50%, ${C.oceanTeal} 50%)`, fontFamily: "'Press Start 2P', monospace" }}
    >
      <style>{`
        @keyframes beaconBlink { 0%,100%{background-color:#ffffff} 50%{background-color:var(--level-color)} }
      `}</style>

      <svg className="hidden">
        <filter id="grain-wm">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
      </svg>
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.08]" style={{ filter: 'url(#grain-wm)', mixBlendMode: 'multiply' }} />

      {/* SVG MAP BACKGROUND */}
      <div className="absolute inset-0 z-0" style={{ backgroundColor: C.oceanDark }}>
        <svg width="100%" height="100%" preserveAspectRatio="none" style={{ imageRendering: 'pixelated' }}>
          {waves.map((w, i) => (
            <rect key={i} x={`${w.x}%`} y={`${w.y}%`} width="2" height="1" fill="#ffffff" opacity="0.6" />
          ))}

          {/* NORTH AMERICA */}
          <g transform="translate(100, 150) scale(1.5)">
            <rect x="0" y="0" width="120" height="90" fill={C.coast} />
            <rect x="5" y="-5" width="110" height="80" fill={C.lowland} />
            <rect x="15" y="-15" width="80" height="40" fill={C.highland} />
            <rect x="10" y="20" width="40" height="30" fill={C.desert} />
            <rect x="25" y="-20" width="50" height="15" fill={C.snow} />
            <IsoBlock x={30} y={-10} w={8} d={8} h={20} color="#aaa" />
            <IsoBlock x={70} y={40} w={6} d={6} h={15} color="#cc4444" />
          </g>

          {/* SOUTH AMERICA */}
          <g transform="translate(250, 350) scale(1.5)">
            <polygon points="0,0 80,0 60,120 20,120" fill={C.coast} />
            <polygon points="5,-5 75,-5 55,110 25,110" fill={C.lowland} />
            <polygon points="10,-10 30,-10 25,80 15,80" fill={C.highland} />
            <IsoBlock x={40} y={20} w={10} d={10} h={12} color="#44aaee" />
            <IsoBlock x={60} y={50} w={8} d={8} h={18} color="#ddaa22" />
          </g>

          {/* EUROPE & AFRICA */}
          <g transform="translate(500, 100) scale(1.5)">
            <rect x="0" y="0" width="140" height="160" fill={C.coast} />
            <rect x="10" y="-10" width="120" height="150" fill={C.lowland} />
            <rect x="10" y="60" width="120" height="70" fill={C.desert} />
            <rect x="40" y="-20" width="60" height="20" fill={C.snow} />
            <rect x="70" y="10" width="40" height="30" fill={C.highland} />
            <IsoBlock x={30} y={20} w={6} d={6} h={25} color="#888" />
            <IsoBlock x={80} y={80} w={12} d={12} h={8} color="#eecc66" />
            <IsoBlock x={40} y={110} w={8} d={8} h={10} color="#55aa77" />
          </g>
        </svg>
      </div>

      {/* CITY PINS */}
      <div className="absolute inset-0 z-20">
        {CITIES_LIST.map((city) => {
          const isUnlocked = city.level <= state.currentLevel;
          const isCurrent = state.currentCity === city.id;
          const levelColor = LEVEL_META[city.level]?.color || '#ffffff';

          return (
            <CityPin
              key={city.id}
              city={city}
              isUnlocked={isUnlocked}
              isCurrent={isCurrent}
              levelColor={levelColor}
              onClick={() => handleCityClick(city)}
            />
          );
        })}
      </div>

      {/* HUD: Title Panel */}
      <div className="absolute top-6 left-6 z-30 bg-[#fff8e7] border-[3px] border-[#111] p-3 px-4 flex flex-col gap-2" style={{ boxShadow: '5px 5px 0 #111' }}>
        <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#ccbbaa]" />
        <div className="text-[#ff3399] text-[11px] ml-1" style={{ textShadow: '1px 1px 0 #111' }}>BEATWORLD MAP</div>
        <div className="text-[#0050cc] text-[7px] ml-1">CLICK A CITY TO BEGIN</div>
      </div>

      {/* HUD: Stats Panel */}
      <div className="absolute top-6 right-6 z-30 bg-[#fff8e7] border-[3px] border-[#111] flex flex-row" style={{ boxShadow: '5px 5px 0 #111' }}>
        <div className="absolute left-0 top-0 bottom-0 w-[5px] bg-[#ccbbaa]" />
        <div className="p-3 px-4 flex flex-col gap-[6px] ml-1">
          <div className="text-[#888899] text-[6px]">PRODUCER</div>
          <div className="text-[#111111] text-[9px]">{state.playerName.toUpperCase()}</div>
        </div>
        <div className="w-[2px] bg-[#111111] my-2" />
        <div className="p-3 px-4 flex flex-col gap-[6px]">
          <div className="text-[#888899] text-[6px]">CLOUT</div>
          <div className="text-[#ff3399] text-[9px]" style={{ textShadow: '1px 1px 0 #111' }}>
            {String(state.clout).padStart(6, '0')}
          </div>
        </div>
      </div>

      {/* HUD: Action Buttons */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-4">
        <button
          className="bg-[#0050cc] text-white text-[9px] pl-4 pr-5 py-3 border-2 border-[#111] flex items-center relative overflow-hidden hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px]"
          style={{ boxShadow: '4px 4px 0 #111' }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-[#003399]" />
          <span className="relative z-10 ml-1">🎵 GRAMMCHAT</span>
        </button>
        <button
          className="bg-[#ffee00] text-[#111] text-[9px] pl-4 pr-5 py-3 border-2 border-[#111] flex items-center relative overflow-hidden hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px]"
          style={{ boxShadow: '4px 4px 0 #111' }}
        >
          <div className="absolute left-0 top-0 bottom-0 w-[6px] bg-[#ccaa00]" />
          <span className="relative z-10 ml-1">🏆 LEADERBOARD</span>
        </button>
      </div>

      {/* HUD: Legend */}
      <div className="absolute bottom-6 right-6 z-30 bg-[#fff8e7] border-[3px] border-[#111] p-3 flex flex-col gap-2" style={{ boxShadow: '5px 5px 0 #111' }}>
        <div className="text-[#111] text-[7px] mb-1 border-b-2 border-[#111] pb-1">LEVELS</div>
        {Object.entries(LEVEL_META).map(([key, level]) => (
          <div key={key} className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
              <IsoBlock x={2} y={4} w={6} d={6} h={6} color={level.color} />
            </svg>
            <div className="text-[7px] text-[#111]">{level.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
