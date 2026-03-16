import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';
import { CITIES } from '@/lib/game-data';
import { PixelButton } from '@/components/ui/PixelButton';
import { motion } from 'framer-motion';
import { audio } from '@/lib/audio';

export default function PerformanceScreen() {
  const { cityId } = useParams();
  const [, setLocation] = useLocation();
  const { state } = useGameState();
  const [done, setDone] = useState(false);
  const [showReviewBtn, setShowReviewBtn] = useState(false);

  const city = cityId ? CITIES[cityId] : null;
  const track = cityId ? state.tracks[cityId] : null;

  useEffect(() => {
    if (!city || !track) return;
    
    // Play sequence automatically for a few bars
    audio.init();
    let step = 0;
    const interval = setInterval(() => {
      const time = audio.getCurrentTime() + 0.05;
      city.instruments.forEach((inst, idx) => {
        if (track[idx][step]) {
          if (['kick', 'snare', 'hihat', 'perc'].includes(inst.type)) {
            audio.playDrum(inst.type, time);
          } else {
            audio.playSynth(inst.type as any, step, time);
          }
        }
      });
      step = (step + 1) % 16;
    }, (60000 / 120) / 4);

    // Stop after 8 seconds and show review button
    setTimeout(() => {
      clearInterval(interval);
      setDone(true);
      setTimeout(() => setShowReviewBtn(true), 1000);
    }, 8000);

    return () => clearInterval(interval);
  }, [city, track]);

  if (!city) return <div>Error</div>;

  return (
    <div className="w-full h-screen bg-black relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 scanlines z-30 pointer-events-none"></div>

      <motion.img 
        src={`${import.meta.env.BASE_URL}images/venue-bg.png`} 
        alt="Venue" 
        className="absolute inset-0 w-full h-full object-cover z-10"
        animate={{
          scale: [1, 1.05, 1],
          filter: ['brightness(1)', 'brightness(1.5) hue-rotate(90deg)', 'brightness(1)'],
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />
      
      {/* Flashing Lights Overlay */}
      <motion.div 
        className="absolute inset-0 bg-primary z-20 mix-blend-overlay"
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.25, repeat: Infinity }}
      />
      <motion.div 
        className="absolute inset-0 bg-secondary z-20 mix-blend-overlay"
        animate={{ opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 0.33, repeat: Infinity }}
      />

      <div className="z-40 text-center bg-black/60 p-8 pixel-borders backdrop-blur-sm">
        <h1 className="text-4xl text-white font-pixel neon-text-primary mb-4">
          LIVE AT {city.name.toUpperCase()}
        </h1>
        <p className="text-xl text-secondary">{city.genre}</p>

        {done && (
          <h2 className="text-2xl text-green-400 mt-8 mb-4 blink">PERFORMANCE COMPLETE!</h2>
        )}

        {showReviewBtn && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PixelButton 
              variant="accent" 
              size="lg" 
              className="mt-8"
              onClick={() => setLocation(`/review/${city.id}`)}
            >
              READ REVIEWS
            </PixelButton>
          </motion.div>
        )}
      </div>
    </div>
  );
}
