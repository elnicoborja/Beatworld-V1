import { useState } from 'react';
import { useLocation } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';
import { PixelButton } from '@/components/ui/PixelButton';
import { PixelPanel } from '@/components/ui/PixelPanel';

const COLORS = {
  skin: ['#ffcc99', '#d2b48c', '#a67b5b', '#7b4b3a', '#4a2511'],
  hair: ['#000000', '#4a2511', '#ffff00', '#ff00ff', '#00ffff', '#ff0000'],
  shirt: ['#ff00ff', '#00ffff', '#ffff00', '#ffffff', '#ff0000', '#00ff00'],
  pants: ['#00ffff', '#0000ff', '#000000', '#555555', '#ff00ff'],
};

export default function CharacterCreator() {
  const [, setLocation] = useLocation();
  const { state, updateState } = useGameState();
  
  const [character, setCharacter] = useState(state.character);
  const [name, setName] = useState(state.playerName);

  const handleSave = () => {
    updateState({ character, playerName: name });
    setLocation('/map');
  };

  return (
    <div className="min-h-screen bg-background p-8 relative flex flex-col items-center justify-center">
      <div className="absolute inset-0 scanlines pointer-events-none"></div>

      <h1 className="text-3xl text-primary neon-text-primary mb-8 z-10 text-center">CREATE PRODUCER</h1>

      <div className="flex flex-col md:flex-row gap-12 z-10 w-full max-w-4xl justify-center items-center">
        {/* Sprite Preview */}
        <PixelPanel className="w-64 h-64 flex items-center justify-center bg-black/50">
          <div className="relative w-32 h-48" style={{ imageRendering: 'pixelated' }}>
            {/* Simple CSS block character representation */}
            {/* Head/Hair */}
            <div className="absolute top-0 left-4 w-24 h-8" style={{ backgroundColor: character.hair }} />
            {/* Face */}
            <div className="absolute top-8 left-4 w-24 h-16" style={{ backgroundColor: character.skin }}>
              <div className="absolute top-4 left-4 w-4 h-4 bg-black" />
              <div className="absolute top-4 right-4 w-4 h-4 bg-black" />
            </div>
            {/* Shirt */}
            <div className="absolute top-24 left-2 w-28 h-16" style={{ backgroundColor: character.shirt }} />
            {/* Arms */}
            <div className="absolute top-24 left-0 w-6 h-12" style={{ backgroundColor: character.skin }} />
            <div className="absolute top-24 right-0 w-6 h-12" style={{ backgroundColor: character.skin }} />
            {/* Pants */}
            <div className="absolute top-40 left-4 w-10 h-8" style={{ backgroundColor: character.pants }} />
            <div className="absolute top-40 right-4 w-10 h-8" style={{ backgroundColor: character.pants }} />
          </div>
        </PixelPanel>

        {/* Controls */}
        <PixelPanel className="w-full max-w-md flex flex-col gap-6">
          <div>
            <label className="text-xs text-gray-400 block mb-2">PRODUCER NAME</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-input text-white p-3 pixel-borders focus:outline-none focus:ring-2 focus:ring-primary font-pixel text-sm"
              maxLength={12}
            />
          </div>

          {(Object.keys(COLORS) as Array<keyof typeof COLORS>).map((part) => (
            <div key={part}>
              <label className="text-xs text-gray-400 block mb-2 uppercase">{part}</label>
              <div className="flex gap-2">
                {COLORS[part].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 pixel-borders cursor-pointer ${character[part] === color ? 'border-4 border-white' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setCharacter(prev => ({ ...prev, [part]: color }))}
                  />
                ))}
              </div>
            </div>
          ))}

          <PixelButton variant="primary" className="mt-4 w-full" onClick={handleSave}>
            ENTER BEATWORLD
          </PixelButton>
        </PixelPanel>
      </div>
    </div>
  );
}
