import { useState } from 'react';
import { CITIES_LIST, CityLevel } from '@/lib/game-data';
import { useLocation } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';

const CITY_POSITIONS: Record<string, { x: number; y: number }> = {
  'new-york':           { x: 22, y: 28 },
  'los-angeles':        { x: 12, y: 28 },
  'puerto-rico':        { x: 28, y: 35 },
  'dominican-republic': { x: 27, y: 36 },
  'medellin':           { x: 23, y: 44 },
  'rio':                { x: 30, y: 60 },
  'fortaleza':          { x: 33, y: 55 },
  'sao-paulo':          { x: 28, y: 62 },
  'bogota':             { x: 22, y: 45 },
  'buenos-aires':       { x: 25, y: 70 },
  'santiago':           { x: 21, y: 70 },
  'mexico-city':        { x: 16, y: 33 },
  'monterrey':          { x: 16, y: 30 },
  'tulum':              { x: 19, y: 34 },
  'berlin':             { x: 50, y: 22 },
  'london':             { x: 46, y: 22 },
  'newcastle':          { x: 46, y: 20 },
  'brighton':           { x: 46, y: 23 },
};

const LEVEL_META: Record<number, { color: string; name: string }> = {
  1: { color: '#ff00ff', name: 'L1 HIP HOP' },
  2: { color: '#ff8800', name: 'L2 REGGAETON' },
  3: { color: '#ffff00', name: 'L3 BAILE FUNK' },
  4: { color: '#00ff88', name: 'L4 CUMBIA / TRAP' },
  5: { color: '#00ffff', name: 'L5 CORRIDOS / ELECTRONIC' },
  6: { color: '#ff00c8', name: 'L6 TECHNO / HOUSE' },
};

function CityPin({ city, isUnlocked, isCurrent, onClick }: {
  city: CityLevel; isUnlocked: boolean; isCurrent: boolean; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pos = CITY_POSITIONS[city.id] || { x: 50, y: 50 };
  const color = LEVEL_META[city.level]?.color || '#ffffff';
  const isLocked = !isUnlocked && !isCurrent;

  return (
    <div
      className="absolute group"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div
        className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-4 border-2"
        style={{
          borderColor: isLocked ? '#444466' : color,
          boxShadow: isLocked ? 'none' : `0 0 8px ${color}, inset 0 0 4px ${color}`,
          backgroundColor: 'transparent',
          cursor: isLocked ? 'not-allowed' : 'pointer',
          opacity: isLocked ? 0.5 : 1,
          animation: isCurrent ? 'pinPulse 1s infinite ease-in-out' : 'none',
        }}
      >
        <div className="w-[6px] h-[6px]" style={{ backgroundColor: isLocked ? '#222244' : color }} />
      </div>

      {hovered && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 whitespace-nowrap z-50 flex flex-col gap-[6px] p-2 px-3 border pointer-events-none bg-[#111133]"
          style={{ borderColor: color, boxShadow: '3px 3px 0px #000' }}
        >
          <div className="text-[#ffffff] text-[7px]">{city.emoji} {city.name.toUpperCase()}</div>
          <div className="text-[#00ffff] text-[7px]">{city.genre.toUpperCase()}</div>
          <div className={`text-[7px] ${isLocked ? 'text-[#444466]' : 'text-[#00ff00]'}`}>
            {isLocked ? '🔒 LOCKED' : isCurrent ? '▶ CURRENT' : '✓ AVAILABLE'}
          </div>
        </div>
      )}
    </div>
  );
}

export function WorldMap() {
  const [, setLocation] = useLocation();
  const { state, updateState } = useGameState();

  const handleCityClick = (city: CityLevel) => {
    if (city.level <= state.currentLevel || state.completedCities.includes(city.id)) {
      updateState({ currentCity: city.id });
      setLocation(`/studio/${city.id}`);
    }
  };

  return (
    <div
      className="relative w-screen h-screen bg-[#0a0a1a] text-[#e0e0ff] uppercase overflow-hidden select-none"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      <style>{`
        @keyframes pinPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1.3); }
          50% { transform: translate(-50%, -50%) scale(1.6); }
        }
      `}</style>

      {/* SVG Pixel Art Map */}
      <div className="absolute inset-0 z-0 bg-[#050518]">
        <svg width="100%" height="100%" preserveAspectRatio="none" style={{ imageRendering: 'pixelated' }}>
          <defs>
            <pattern id="landPattern" width="2" height="2" patternUnits="userSpaceOnUse">
              <rect width="2" height="2" fill="#1a2a3a" />
              <rect width="1" height="1" fill="#15202d" />
            </pattern>
          </defs>
          <g fill="url(#landPattern)">
            <rect x="5%" y="10%" width="30%" height="5%" />
            <rect x="8%" y="15%" width="25%" height="10%" />
            <rect x="10%" y="25%" width="20%" height="8%" />
            <rect x="12%" y="33%" width="10%" height="5%" />
            <rect x="15%" y="38%" width="12%" height="4%" />
          </g>
          <g fill="url(#landPattern)">
            <rect x="20%" y="42%" width="10%" height="8%" />
            <rect x="22%" y="50%" width="14%" height="12%" />
            <rect x="24%" y="62%" width="8%" height="10%" />
            <rect x="25%" y="72%" width="4%" height="10%" />
          </g>
          <g fill="url(#landPattern)">
            <rect x="42%" y="15%" width="15%" height="5%" />
            <rect x="45%" y="20%" width="12%" height="8%" />
            <rect x="40%" y="28%" width="18%" height="6%" />
            <rect x="46%" y="22%" width="4%" height="4%" />
          </g>
          <g fill="url(#landPattern)">
            <rect x="42%" y="35%" width="16%" height="10%" />
            <rect x="45%" y="45%" width="14%" height="12%" />
            <rect x="48%" y="57%" width="10%" height="15%" />
          </g>
        </svg>
      </div>

      {/* Radial vignette */}
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 20%, rgba(10,10,26,0.9) 100%)' }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,0,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,255,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
        }}
      />

      {/* City pins */}
      <div className="absolute inset-0 z-40">
        {CITIES_LIST.map(city => {
          const isUnlocked = state.completedCities.includes(city.id) || city.level <= state.currentLevel;
          const isCurrent = state.currentCity === city.id;
          return (
            <CityPin
              key={city.id}
              city={city}
              isUnlocked={isUnlocked}
              isCurrent={isCurrent}
              onClick={() => handleCityClick(city)}
            />
          );
        })}
      </div>

      {/* HUD: Top-Left */}
      <div className="absolute top-6 left-6 z-50 bg-[#111133] border-2 border-[#ff00ff] p-3 px-4 flex flex-col gap-2" style={{ boxShadow: '3px 3px 0px #000' }}>
        <div className="text-[#ff00ff] text-[10px]" style={{ textShadow: '0 0 8px #ff00ff' }}>BEATWORLD MAP</div>
        <div className="text-[#00ffff] text-[7px]">CLICK A CITY TO ENTER STUDIO</div>
      </div>

      {/* HUD: Top-Right */}
      <div className="absolute top-6 right-6 z-50 flex flex-col md:flex-row gap-4">
        <div className="bg-[#111133] border-2 border-[#ffff00] p-3 px-4 flex flex-col gap-[6px]" style={{ boxShadow: '3px 3px 0px #000' }}>
          <div className="text-[#888888] text-[7px]">PRODUCER</div>
          <div className="text-[#ffff00] text-[9px]">{state.playerName}</div>
        </div>
        <div className="bg-[#111133] border-2 border-[#ffff00] p-3 px-4 flex flex-col gap-[6px]" style={{ boxShadow: '3px 3px 0px #000' }}>
          <div className="text-[#888888] text-[7px]">CLOUT</div>
          <div className="text-[#ffff00] text-[9px]" style={{ textShadow: '0 0 10px #ffff00' }}>{String(state.clout).padStart(6, '0')}</div>
        </div>
      </div>

      {/* HUD: Bottom-Center Buttons */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex gap-4">
        <button
          onClick={() => setLocation('/grammchat')}
          className="bg-[#00ffff] text-[#0a0a1a] text-[9px] px-5 py-3 uppercase hover:brightness-110 active:translate-y-[2px] active:translate-x-[2px] transition-none"
          style={{ boxShadow: '3px 3px 0px #000' }}
        >
          GRAMMCHAT
        </button>
        <button
          onClick={() => setLocation('/leaderboard')}
          className="bg-[#ffff00] text-[#0a0a1a] text-[9px] px-5 py-3 uppercase hover:brightness-110 active:translate-y-[2px] active:translate-x-[2px] transition-none"
          style={{ boxShadow: '3px 3px 0px #000' }}
        >
          LEADERBOARD
        </button>
      </div>

      {/* HUD: Bottom-Right Legend */}
      <div className="absolute bottom-6 right-6 z-50 bg-[#111133] bg-opacity-90 border border-[#444466] p-3 flex flex-col gap-2" style={{ boxShadow: '3px 3px 0px #000' }}>
        <div className="text-[#ffffff] text-[7px] mb-1">LEVELS</div>
        {Object.values(LEVEL_META).map(level => (
          <div key={level.name} className="flex items-center gap-2">
            <div className="w-2 h-2 border border-[#0a0a1a]" style={{ backgroundColor: level.color }} />
            <div className="text-[7px]" style={{ color: level.color }}>{level.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
