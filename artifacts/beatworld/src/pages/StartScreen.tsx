import { useLocation } from 'wouter';
import { PixelButton } from '@/components/ui/PixelButton';
import { motion } from 'framer-motion';

export default function StartScreen() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 scanlines z-10"></div>
      
      <img 
        src={`${import.meta.env.BASE_URL}images/map-backdrop.png`} 
        alt="Map background" 
        className="absolute inset-0 w-full h-full object-cover opacity-30" 
      />

      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="z-20 text-center"
      >
        <h1 className="text-6xl md:text-8xl font-pixel text-transparent bg-clip-text bg-gradient-to-b from-primary to-secondary neon-text-primary mb-4">
          BEATWORLD
        </h1>
        <p className="text-xl text-white tracking-widest neon-text-secondary mt-8 mb-16">
          GLOBAL 8-BIT PRODUCER
        </p>
      </motion.div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="z-20 flex flex-col gap-6 w-full max-w-xs"
      >
        <PixelButton 
          variant="primary" 
          size="lg" 
          className="w-full text-xl"
          onClick={() => setLocation('/creator')}
        >
          NEW GAME
        </PixelButton>
        <PixelButton 
          variant="secondary" 
          size="lg" 
          className="w-full text-xl"
          onClick={() => setLocation('/map')}
        >
          CONTINUE
        </PixelButton>
      </motion.div>

      <div className="absolute bottom-8 text-[10px] text-gray-500 z-20 text-center">
        <p>© {new Date().getFullYear()} PIXEL BEATS INC.</p>
        <p className="mt-2 text-yellow-500">PRESS START TO PLAY</p>
      </div>
    </div>
  );
}
