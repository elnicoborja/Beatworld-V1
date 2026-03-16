import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';
import { motion } from 'framer-motion';

function AnimatedEqualizer() {
  const [bars, setBars] = useState([100, 80, 60, 90, 75, 85, 95, 70, 65, 80, 90, 100]);
  useEffect(() => {
    const id = setInterval(() => {
      setBars(prev => prev.map(b => {
        const delta = (Math.random() - 0.5) * 30;
        return Math.max(20, Math.min(100, b + delta));
      }));
    }, 200);
    return () => clearInterval(id);
  }, []);

  const colors = [
    '#00FFFF','#00FFFF','#00FFFF','#00FFFF',
    '#0050FF','#0050FF',
    '#FF00FF','#FF00FF','#FF00FF','#FF00FF',
    '#00FFFF','#00FFFF',
  ];

  return (
    <div
      className="w-[320px] md:w-[400px] h-10 bg-[#111133] flex items-end p-1 gap-[2px]"
      style={{ border: '2px solid #0050FF', boxShadow: '3px 3px 0px #000' }}
    >
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 transition-all duration-150"
          style={{ height: `${h}%`, backgroundColor: colors[i] }}
        />
      ))}
    </div>
  );
}

export default function StartScreen() {
  const [, setLocation] = useLocation();
  const { state } = useGameState();
  const hasSave = state.completedCities.length > 0 || state.currentCity !== null;

  return (
    <div
      className="w-full h-screen bg-[#0A0A1A] relative overflow-hidden"
      style={{ imageRendering: 'pixelated', fontFamily: "'Press Start 2P', monospace" }}
    >
      {/* Grid Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#FF00FF 1px, transparent 1px), linear-gradient(90deg, #FF00FF 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.03,
        }}
      />

      {/* CRT Scanlines */}
      <div
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
        }}
      />

      {/* Isometric Cityscape Background */}
      <svg className="absolute inset-0 w-full h-full z-0 opacity-80" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <rect x="0" y="700" width="1600" height="200" fill="#0A0A1A" />
        <rect x="0" y="600" width="1600" height="100" fill="#111133" />

        <rect x="100" y="600" width="200" height="300" fill="#111133" stroke="#0050FF" strokeWidth="2" />
        <rect x="110" y="610" width="10" height="10" fill="#FFFF00" />
        <rect x="130" y="610" width="10" height="10" fill="#FFFF00" />
        <rect x="150" y="610" width="10" height="10" fill="#00FFFF" />
        <rect x="110" y="630" width="10" height="10" fill="#FFFF00" />
        <rect x="110" y="650" width="10" height="10" fill="#FFFF00" />
        <rect x="130" y="650" width="10" height="10" fill="#00FFFF" />
        <rect x="150" y="650" width="10" height="10" fill="#FF00FF" />
        <rect x="110" y="670" width="10" height="10" fill="#FFFF00" />
        <rect x="130" y="670" width="10" height="10" fill="#FFFF00" />

        <rect x="350" y="550" width="150" height="350" fill="#111133" stroke="#0050FF" strokeWidth="2" />
        <rect x="360" y="560" width="10" height="10" fill="#FFFF00" />
        <rect x="380" y="560" width="10" height="10" fill="#FF8800" />
        <rect x="400" y="560" width="10" height="10" fill="#FFFF00" />
        <rect x="360" y="580" width="10" height="10" fill="#00FFFF" />
        <rect x="380" y="580" width="10" height="10" fill="#FFFF00" />
        <rect x="400" y="600" width="10" height="10" fill="#FF00FF" />
        <rect x="360" y="620" width="10" height="10" fill="#FFFF00" />

        <rect x="600" y="450" width="400" height="450" fill="#111133" stroke="#FF8800" strokeWidth="2" />
        <rect x="620" y="470" width="30" height="30" fill="#FF8800" />
        <rect x="670" y="470" width="30" height="30" fill="#FF00FF" />
        <rect x="720" y="470" width="30" height="30" fill="#00FFFF" />
        <rect x="770" y="470" width="30" height="30" fill="#FFFF00" />
        <rect x="820" y="470" width="30" height="30" fill="#FF00FF" />
        <rect x="870" y="470" width="30" height="30" fill="#00FFFF" />
        <rect x="920" y="470" width="30" height="30" fill="#FFFF00" />
        <rect x="610" y="510" width="380" height="2" fill="#FF8800" />
        <rect x="620" y="530" width="20" height="20" fill="#FFFF00" />
        <rect x="660" y="530" width="20" height="20" fill="#FFFF00" />
        <rect x="700" y="530" width="20" height="20" fill="#00FFFF" />
        <rect x="740" y="530" width="20" height="20" fill="#FF00FF" />
        <rect x="780" y="530" width="20" height="20" fill="#FFFF00" />
        <rect x="820" y="530" width="20" height="20" fill="#00FFFF" />
        <rect x="860" y="530" width="20" height="20" fill="#FF8800" />
        <rect x="620" y="570" width="20" height="20" fill="#FFFF00" />
        <rect x="660" y="570" width="20" height="20" fill="#00FFFF" />
        <rect x="700" y="570" width="20" height="20" fill="#FFFF00" />

        <rect x="1100" y="500" width="250" height="400" fill="#111133" stroke="#00FFFF" strokeWidth="2" />
        <rect x="1120" y="520" width="80" height="20" fill="#00FFFF" />
        <rect x="1220" y="520" width="20" height="20" fill="#00FFFF" />
        <rect x="1120" y="550" width="210" height="30" fill="#111133" stroke="#00FFFF" strokeWidth="1" />
        <rect x="1130" y="560" width="10" height="10" fill="#00FFFF" />
        <rect x="1150" y="560" width="10" height="10" fill="#00FFFF" />
        <rect x="1170" y="560" width="10" height="10" fill="#00FFFF" />
        <rect x="1190" y="560" width="10" height="10" fill="#00FFFF" />
        <rect x="1120" y="600" width="20" height="20" fill="#FFFF00" />
        <rect x="1150" y="600" width="20" height="20" fill="#FF00FF" />
        <rect x="1180" y="600" width="20" height="20" fill="#FFFF00" />
        <rect x="1210" y="600" width="20" height="20" fill="#00FFFF" />

        <rect x="150" y="570" width="30" height="30" fill="#0050FF" />
        <circle cx="165" cy="585" r="10" fill="#00FFFF" stroke="#E0E0FF" strokeWidth="1" />
        <rect x="190" y="570" width="30" height="30" fill="#0050FF" />
        <circle cx="205" cy="585" r="10" fill="#00FFFF" stroke="#E0E0FF" strokeWidth="1" />

        <rect x="900" y="350" width="10" height="100" fill="#0050FF" />
        <rect x="895" y="340" width="20" height="10" fill="#00FFFF" stroke="#E0E0FF" strokeWidth="1" />
        <rect x="898" y="330" width="14" height="10" fill="#FF00FF" stroke="#E0E0FF" strokeWidth="1" />

        <rect x="1200" y="400" width="150" height="80" fill="#111133" stroke="#FF00FF" strokeWidth="2" />
        <text x="1215" y="445" fill="#FF00FF" fontSize="16" fontFamily="'Press Start 2P', cursive">GROOVE</text>
        <text x="1215" y="465" fill="#FF00FF" fontSize="16" fontFamily="'Press Start 2P', cursive">DISTRICT</text>

        <line x1="200" y1="600" x2="600" y2="450" stroke="#0050FF" strokeWidth="2" opacity="0.5" />
        <line x1="900" y1="450" x2="1100" y2="500" stroke="#0050FF" strokeWidth="2" opacity="0.5" />
        <line x1="300" y1="700" x2="600" y2="900" stroke="#0050FF" strokeWidth="2" opacity="0.3" />
        <line x1="1350" y1="700" x2="1600" y2="900" stroke="#0050FF" strokeWidth="2" opacity="0.3" />

        {/* Extra small buildings for depth */}
        <rect x="50" y="650" width="40" height="250" fill="#111133" stroke="#0050FF" strokeWidth="1" opacity="0.4" />
        <rect x="520" y="620" width="60" height="280" fill="#111133" stroke="#0050FF" strokeWidth="1" opacity="0.4" />
        <rect x="1400" y="580" width="80" height="320" fill="#111133" stroke="#00FFFF" strokeWidth="1" opacity="0.4" />
        <rect x="1500" y="620" width="60" height="280" fill="#111133" stroke="#0050FF" strokeWidth="1" opacity="0.3" />
      </svg>

      {/* Main UI Layer */}
      <div className="absolute inset-0 z-30 flex flex-col items-center justify-between p-6 md:p-8">
        {/* Logo */}
        <motion.div
          className="text-center mt-8 md:mt-12"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className="text-5xl md:text-8xl text-[#FF00FF] p-3 md:p-4 bg-[#0A0A1A]/90"
            style={{ textShadow: '0 0 8px #FF00C8, 0 0 20px #FF00FF44', boxShadow: '3px 3px 0px #000' }}
          >
            BEATWORLD
          </h1>
          <p
            className="mt-4 md:mt-6 text-sm md:text-xl text-[#E0E0FF] tracking-wider"
          >
            BUILD THE CITY. DROP THE BEAT.
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex flex-col items-center gap-5 md:gap-6 mb-16 md:mb-24"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <button
            className="w-72 md:w-96 p-5 md:p-8 bg-[#111133] text-[#00FFFF] text-xl md:text-3xl hover:text-[#FFFF00] active:scale-95 transition-all"
            style={{ border: '2px solid #00FFFF', boxShadow: '3px 3px 0px #000' }}
            onClick={() => setLocation('/creator')}
          >
            START
          </button>
          {hasSave && (
            <button
              className="w-72 md:w-96 p-5 md:p-8 bg-[#111133] text-[#0050FF] text-xl md:text-3xl hover:text-[#00FFFF] active:scale-95 transition-all"
              style={{ border: '2px solid #0050FF', boxShadow: '3px 3px 0px #000' }}
              onClick={() => setLocation('/map')}
            >
              CONTINUE
            </button>
          )}
          <button
            className="w-72 md:w-96 p-5 md:p-8 bg-[#111133] text-[#0050FF] text-xl md:text-3xl hover:text-[#00FFFF] active:scale-95 transition-all"
            style={{ border: '2px solid #0050FF', boxShadow: '3px 3px 0px #000' }}
            onClick={() => setLocation('/leaderboard')}
          >
            LEADERBOARD
          </button>
        </motion.div>

        {/* Bottom UI Row */}
        <motion.div
          className="w-full flex flex-col md:flex-row justify-between items-end gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {/* Status Panel */}
          <div
            className="bg-[#111133] p-3 text-[8px] md:text-[10px] space-y-1"
            style={{ border: '2px solid #0050FF', boxShadow: '3px 3px 0px #000' }}
          >
            <p className="flex items-center gap-2">AUDIO LINK: <span className="text-[#00FF00]">READY</span></p>
            <p className="text-[#666688]">CITY SEED: BX-2099</p>
            <p className="text-[#666688]">VERSION: ALPHA 0.1</p>
          </div>

          {/* Animated Equalizer */}
          <div className="hidden md:block">
            <AnimatedEqualizer />
          </div>

          {/* Info Panel */}
          <div
            className="bg-[#111133] p-3 text-[8px] md:text-[10px]"
            style={{ border: '2px solid #0050FF', boxShadow: '3px 3px 0px #000' }}
          >
            <p className="blink text-[#E0E0FF]">PRESS START TO ENTER STUDIO DISTRICT</p>
          </div>
        </motion.div>
      </div>

      {/* Top-right Player Panel */}
      <motion.div
        className="absolute top-4 right-4 md:top-8 md:right-8 z-30"
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <div
          className="bg-[#111133] p-3 text-[8px] md:text-[10px] flex flex-col items-center gap-1"
          style={{ border: '2px solid #00FFFF', boxShadow: '3px 3px 0px #000' }}
        >
          <div className="w-6 h-6 bg-[#0050FF] flex items-center justify-center">
            <svg viewBox="0 0 10 10" className="w-4 h-4" fill="#00FFFF">
              <rect x="0" y="0" width="10" height="2" />
              <rect x="0" y="4" width="10" height="2" />
              <rect x="0" y="8" width="10" height="2" />
            </svg>
          </div>
          <p className="text-[#E0E0FF]">{state.playerName || 'PLAYER 1'}</p>
          <p className="text-[#FFFF00]">♦ {state.clout}</p>
        </div>
      </motion.div>
    </div>
  );
}
