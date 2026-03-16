import { useLocation } from 'wouter';
import { WorldMap } from '@/components/map/WorldMap';
import { PixelButton } from '@/components/ui/PixelButton';
import { useGameState } from '@/hooks/use-game-state';

export default function MapScreen() {
  const [, setLocation] = useLocation();
  const { state } = useGameState();

  return (
    <div className="w-full h-screen relative flex flex-col">
      <div className="flex-1 relative">
        <WorldMap />
      </div>

      {/* Top Bar HUD */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none z-20">
        <div /> {/* Handled by WorldMap inside */}
        <div className="pointer-events-auto flex gap-4">
          <div className="bg-black/80 px-4 py-2 pixel-borders text-right">
            <p className="text-[10px] text-gray-400">PRODUCER</p>
            <p className="text-primary text-sm">{state.playerName}</p>
          </div>
          <div className="bg-black/80 px-4 py-2 pixel-borders text-right">
            <p className="text-[10px] text-gray-400">CLOUT</p>
            <p className="text-yellow-400 text-sm">{state.clout}</p>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-6 left-0 w-full px-8 flex justify-center gap-6 z-20">
        <PixelButton variant="secondary" onClick={() => setLocation('/social')}>
          GRAMMCHAT
        </PixelButton>
        <PixelButton variant="accent" onClick={() => setLocation('/leaderboard')}>
          LEADERBOARD
        </PixelButton>
      </div>
    </div>
  );
}
