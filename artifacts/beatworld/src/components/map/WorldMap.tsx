import { useState } from 'react';
import { CITIES_LIST, CityLevel } from '@/lib/game-data';
import { useLocation } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';

// 2D isometric-style pixel world map with CSS positioning
// City positions are mapped to percentage-based screen coordinates
const CITY_SCREEN_POSITIONS: Record<string, { x: number; y: number }> = {
  'new-york':           { x: 22, y: 32 },
  'los-angeles':        { x: 12, y: 36 },
  'puerto-rico':        { x: 26, y: 43 },
  'dominican-republic': { x: 27, y: 44 },
  'medellin':           { x: 24, y: 53 },
  'rio':                { x: 30, y: 66 },
  'fortaleza':          { x: 33, y: 58 },
  'sao-paulo':          { x: 29, y: 68 },
  'bogota':             { x: 22, y: 52 },
  'buenos-aires':       { x: 26, y: 78 },
  'santiago':           { x: 22, y: 78 },
  'mexico-city':        { x: 16, y: 42 },
  'monterrey':          { x: 15, y: 38 },
  'tulum':              { x: 18, y: 42 },
  'berlin':             { x: 53, y: 22 },
  'london':             { x: 48, y: 22 },
  'newcastle':          { x: 48, y: 20 },
  'brighton':           { x: 49, y: 24 },
};

const LEVEL_COLORS: Record<number, string> = {
  1: '#ff00ff',
  2: '#ff8800',
  3: '#ffff00',
  4: '#00ff88',
  5: '#00ffff',
  6: '#ff0088',
};

function CityPin({ city, isUnlocked, isCurrent, onClick }: {
  city: CityLevel;
  isUnlocked: boolean;
  isCurrent: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const pos = CITY_SCREEN_POSITIONS[city.id] || { x: 50, y: 50 };
  const color = LEVEL_COLORS[city.level] || '#ffffff';

  return (
    <div
      className="absolute cursor-pointer select-none"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Pin dot */}
      <div
        className="w-3 h-3 transition-all duration-200"
        style={{
          backgroundColor: isUnlocked || isCurrent ? color : '#333333',
          boxShadow: (hovered || isCurrent) ? `0 0 12px ${color}, 0 0 24px ${color}` : 'none',
          border: `2px solid ${isUnlocked || isCurrent ? color : '#555'}`,
          transform: hovered ? 'scale(1.6)' : isCurrent ? 'scale(1.4)' : 'scale(1)',
          animation: isCurrent ? 'none' : undefined,
        }}
      />

      {/* Tooltip on hover */}
      {hovered && (
        <div
          className="absolute left-4 top-0 z-50 pointer-events-none"
          style={{ minWidth: '120px' }}
        >
          <div
            className="px-2 py-1 text-[8px] whitespace-nowrap"
            style={{
              backgroundColor: 'rgba(0,0,0,0.92)',
              border: `1px solid ${color}`,
              boxShadow: `0 0 8px ${color}55`,
              color: color,
              fontFamily: "'Press Start 2P', monospace",
            }}
          >
            <div>{city.emoji} {city.name}</div>
            <div style={{ color: '#aaa', marginTop: 2 }}>{city.genre}</div>
            <div style={{ color: '#666', marginTop: 2 }}>
              {isUnlocked ? '✓ UNLOCKED' : isCurrent ? '▶ CURRENT' : `LVL ${city.level}`}
            </div>
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
    <div className="w-full h-full relative overflow-hidden bg-background">
      {/* Scanlines overlay */}
      <div className="absolute inset-0 scanlines z-10 pointer-events-none" />

      {/* Background: AI-generated map image */}
      <img
        src={`${import.meta.env.BASE_URL}images/map-backdrop.png`}
        alt="World Map"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.6, imageRendering: 'pixelated' }}
      />

      {/* Dark overlay for contrast */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,20,0.3) 0%, rgba(0,0,20,0.7) 100%)' }}
      />

      {/* Grid lines for eboy aesthetic */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,0,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* City pins — positioned over the map */}
      <div className="absolute inset-0 z-20">
        {CITIES_LIST.map((city) => {
          const isUnlocked = state.completedCities.includes(city.id);
          const isCurrent = state.currentCity === city.id;
          return (
            <CityPin
              key={city.id}
              city={city}
              isUnlocked={isUnlocked || city.level <= state.currentLevel}
              isCurrent={isCurrent}
              onClick={() => handleCityClick(city)}
            />
          );
        })}
      </div>

      {/* Top-left title */}
      <div className="absolute top-4 left-4 z-30 pointer-events-none">
        <h2
          className="text-sm neon-text-secondary"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          BEATWORLD MAP
        </h2>
        <p
          className="text-[8px] mt-2"
          style={{ color: '#666', fontFamily: "'Press Start 2P', monospace" }}
        >
          CLICK A CITY TO ENTER STUDIO
        </p>
      </div>

      {/* Level legend */}
      <div className="absolute bottom-20 right-4 z-30 bg-black/80 p-3 pointer-events-none"
        style={{ border: '1px solid #333' }}
      >
        {Object.entries(LEVEL_COLORS).map(([level, color]) => (
          <div key={level} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2" style={{ backgroundColor: color }} />
            <span style={{ color, fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }}>
              LVL {level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
