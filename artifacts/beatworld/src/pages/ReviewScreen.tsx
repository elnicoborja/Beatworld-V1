import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';
import { CITIES } from '@/lib/game-data';
import { PixelButton } from '@/components/ui/PixelButton';
import { PixelPanel } from '@/components/ui/PixelPanel';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReviewScreen() {
  const { cityId } = useParams();
  const [, setLocation] = useLocation();
  const { unlockCity } = useGameState();
  const [rating, setRating] = useState(0);

  const city = cityId ? CITIES[cityId] : null;

  useEffect(() => {
    // Generate a random rating 3-5 for now 
    // (In a real game, this would analyze track density)
    setTimeout(() => {
      setRating(Math.floor(Math.random() * 3) + 3);
      if (cityId) unlockCity(cityId);
    }, 1500);
  }, [cityId]);

  if (!city) return null;

  const getReviewText = () => {
    if (rating === 5) return `"ABSOLUTE FIRE! The ${city.genre} scene will never be the same. 10/10."`;
    if (rating === 4) return `"Solid groove, definitely got the crowd moving. Great production."`;
    return `"A bit repetitive but has potential. Needs more cowbell."`;
  };

  return (
    <div className="w-full min-h-screen bg-background p-8 flex flex-col items-center justify-center relative">
      <div className="absolute inset-0 scanlines pointer-events-none z-10"></div>
      
      <h1 className="text-3xl text-primary mb-12 z-20">MEDIA REVIEWS</h1>

      <div className="max-w-2xl w-full z-20 flex flex-col gap-8">
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <PixelPanel className="flex items-start gap-6 bg-card border-secondary border-l-8">
            <img src={`${import.meta.env.BASE_URL}images/critic-1.png`} className="w-24 h-24 pixel-borders bg-gray-800" alt="Critic" />
            <div className="flex-1">
              <h3 className="text-secondary text-lg mb-2">PITCHFORK MAG</h3>
              <p className="text-xs text-gray-300 leading-relaxed leading-6">
                {rating ? getReviewText() : 'Listening...'}
              </p>
            </div>
          </PixelPanel>
        </motion.div>

        {rating > 0 && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center mt-8"
          >
            <h2 className="text-xl text-white mb-4">FINAL RATING</h2>
            <div className="flex gap-2 mb-8">
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star} 
                  size={48} 
                  className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"} 
                />
              ))}
            </div>
            
            <p className="text-primary mb-8 blink">+100 CLOUT GAINED!</p>

            <div className="flex gap-4">
              <PixelButton variant="primary" onClick={() => setLocation('/map')}>
                RETURN TO MAP
              </PixelButton>
              <PixelButton variant="secondary" onClick={() => setLocation('/social')}>
                POST TO GRAMMCHAT
              </PixelButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
