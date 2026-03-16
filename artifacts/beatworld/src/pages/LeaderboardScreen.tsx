import { useLocation } from 'wouter';
import { useGetLeaderboard } from '@workspace/api-client-react';
import { PixelButton } from '@/components/ui/PixelButton';
import { PixelPanel } from '@/components/ui/PixelPanel';
import { useGameState } from '@/hooks/use-game-state';
import { ArrowLeft, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaderboardScreen() {
  const [, setLocation] = useLocation();
  const { state } = useGameState();
  const { data, isLoading } = useGetLeaderboard();

  const entries = data?.entries ?? [];

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center pb-20">
      <div className="absolute inset-0 scanlines pointer-events-none z-10"></div>

      {/* Header */}
      <div className="w-full max-w-lg bg-card border-b-4 border-accent p-4 flex items-center justify-between sticky top-0 z-30">
        <button onClick={() => setLocation('/map')} className="text-white hover:text-accent">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg text-accent neon-text-accent flex items-center gap-2">
          <Trophy size={20} />
          CLOUT BOARD
        </h1>
        <div className="text-xs text-primary">{state.clout} CLOUT</div>
      </div>

      <div className="w-full max-w-lg z-20 flex flex-col gap-3 p-4">
        {/* Player's rank */}
        <PixelPanel className="bg-primary/20 border-primary border-2 p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/40 flex items-center justify-center pixel-borders text-2xl">
              🎧
            </div>
            <div>
              <p className="text-primary text-xs">{state.playerName}</p>
              <p className="text-yellow-400 text-xs mt-1">{state.clout} CLOUT</p>
              <p className="text-gray-500 text-[8px] mt-1">{state.completedCities.length} CITIES COMPLETED</p>
            </div>
          </div>
        </PixelPanel>

        <div className="border-t-2 border-gray-800 pt-4 mt-2">
          <h2 className="text-xs text-gray-400 mb-4 text-center">TOP PRODUCERS</h2>

          {isLoading && (
            <div className="text-center text-gray-500 text-xs py-8">LOADING...</div>
          )}

          {!isLoading && entries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-xs">NO PRODUCERS YET</p>
              <p className="text-gray-600 text-[8px] mt-2">BE THE FIRST ON THE LEADERBOARD!</p>
            </div>
          )}

          {entries.map((entry, idx) => (
            <motion.div
              key={entry.playerId}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <PixelPanel
                className={`mb-3 p-3 flex items-center gap-4 ${
                  entry.playerId === state.playerId ? 'border-primary border-2' : ''
                }`}
              >
                <div className="text-xl w-8 text-center">
                  {medals[idx] || `#${idx + 1}`}
                </div>

                <div className="w-10 h-10 bg-gray-800 flex items-center justify-center pixel-borders text-xl">
                  🎧
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-xs truncate ${entry.playerId === state.playerId ? 'text-primary' : 'text-white'}`}>
                    {entry.playerName}
                  </p>
                  <p className="text-[8px] text-gray-500 mt-1">
                    {entry.completedCities} {entry.completedCities === 1 ? 'CITY' : 'CITIES'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-yellow-400 text-xs">{entry.clout}</p>
                  <p className="text-[8px] text-gray-600">CLOUT</p>
                </div>
              </PixelPanel>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-6 z-30">
        <PixelButton variant="secondary" onClick={() => setLocation('/social')}>
          GRAMMCHAT
        </PixelButton>
      </div>
    </div>
  );
}
