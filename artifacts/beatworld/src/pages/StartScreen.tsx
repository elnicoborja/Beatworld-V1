import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';

const C = {
  skyBlue: '#87ceeb', hotPink: '#ff3399', magenta: '#cc0066', yellow: '#ffee00',
  black: '#111111', white: '#ffffff', nightNavy: '#0d1b2a', bgCenter: '#1a2a4a', bgEdge: '#0a0a1a',
  shadowBlob: 'rgba(51, 34, 68, 0.5)',
};

function TickerContent() {
  const words = [
    '♩','BEATWORLD','♩','18 CITIES','♩','6 LEVELS','♩','NEW YORK','·',
    'LONDON','·','BERLIN','·','RIO','·','MEDELLÍN','·','TULUM','♩',
    'BECOME THE TOP PRODUCER','♩',
  ];
  return (
    <div className="flex pr-8">
      {words.map((word, i) => (
        <span key={i} className={`mr-2 ${i % 2 === 0 ? 'text-[#ffee00]' : 'text-[#87ceeb]'}`} style={{ textShadow: '1px 1px 0 #000' }}>
          {word}
        </span>
      ))}
    </div>
  );
}

export default function StartScreen() {
  const [, setLocation] = useLocation();
  const { state } = useGameState();
  const hasSave = state.completedCities.length > 0 || state.currentCity !== null;

  const stars = useMemo(() =>
    Array.from({ length: 45 }).map((_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 55, opacity: Math.random() * 0.5 + 0.3,
    })), []);

  const windows = useMemo(() =>
    Array.from({ length: 60 }).map((_, i) => ({
      id: i, x: Math.floor(Math.random() * 100), y: Math.floor(Math.random() * 40),
      color: Math.random() > 0.5 ? C.yellow : C.white,
    })), []);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden select-none uppercase"
      style={{ background: `radial-gradient(circle at center, ${C.bgCenter} 0%, ${C.bgEdge} 100%)`, color: C.white, fontFamily: "'Press Start 2P', monospace" }}
    >
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(-4px)} 50%{transform:translateY(0px)} }
        .anim-float { animation: float 3s ease-in-out infinite; }
        @keyframes marquee { 0%{transform:translateX(100vw)} 100%{transform:translateX(-200%)} }
        .anim-marquee { animation: marquee 20s linear infinite; display:inline-block; white-space:nowrap; }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .anim-blink { animation: blink 1s steps(2, start) infinite; }
        .scanlines-ss { position:absolute;inset:0; background:repeating-linear-gradient(to bottom,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 4px); pointer-events:none; z-index:50; }
        .btn-new {
          background-color:${C.hotPink}; color:${C.white}; border:2px solid ${C.black};
          box-shadow:inset 4px 0 0 ${C.magenta}, 4px 4px 0 ${C.black};
        }
        .btn-new:hover { filter:brightness(1.15); transform:translate(-1px,-1px); box-shadow:inset 4px 0 0 ${C.magenta}, 5px 5px 0 ${C.black}; }
        .btn-new:active { transform:translate(2px,2px); box-shadow:inset 4px 0 0 ${C.magenta}, 1px 1px 0 ${C.black}; }
        .btn-continue {
          background-color:${C.yellow}; color:${C.black}; border:2px solid ${C.black};
          box-shadow:inset 4px 0 0 #cca800, 4px 4px 0 ${C.black};
        }
        .btn-continue:hover { filter:brightness(1.1); transform:translate(-1px,-1px); box-shadow:inset 4px 0 0 #cca800, 5px 5px 0 ${C.black}; }
        .btn-continue:active { transform:translate(2px,2px); box-shadow:inset 4px 0 0 #cca800, 1px 1px 0 ${C.black}; }
        .neon-magenta { box-shadow:0 0 15px 5px rgba(255,51,153,0.4); background:rgba(255,51,153,0.6); }
        .neon-cyan { box-shadow:0 0 15px 5px rgba(135,206,235,0.4); background:rgba(135,206,235,0.6); }
        .neon-yellow { box-shadow:0 0 15px 5px rgba(255,238,0,0.4); background:rgba(255,238,0,0.6); }
      `}</style>

      <div className="scanlines-ss" />

      {/* Stars */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {stars.map(star => (
          <div key={star.id} className="absolute bg-white w-[2px] h-[2px]" style={{ left: `${star.x}%`, top: `${star.y}%`, opacity: star.opacity, boxShadow: '0 0 2px #fff' }} />
        ))}
      </div>

      {/* Skyline */}
      <div className="absolute bottom-8 left-0 w-full h-[40%] z-10 pointer-events-none flex items-end opacity-90">
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 left-0 w-full h-4 bg-[#0d1b2a]" />
          <svg width="100%" height="100%" preserveAspectRatio="none" style={{ imageRendering: 'pixelated' }}>
            <rect x="5%" y="40%" width="12%" height="60%" fill={C.nightNavy} />
            <rect x="15%" y="20%" width="8%" height="80%" fill={C.nightNavy} />
            <rect x="25%" y="50%" width="15%" height="50%" fill={C.nightNavy} />
            <rect x="38%" y="15%" width="10%" height="85%" fill={C.nightNavy} />
            <rect x="50%" y="30%" width="14%" height="70%" fill={C.nightNavy} />
            <rect x="65%" y="10%" width="9%" height="90%" fill={C.nightNavy} />
            <rect x="75%" y="45%" width="12%" height="55%" fill={C.nightNavy} />
            <rect x="85%" y="25%" width="10%" height="75%" fill={C.nightNavy} />
            <rect x="15%" y="20%" width="8%" height="3%" fill="#13263b" />
            <rect x="38%" y="15%" width="10%" height="3%" fill="#13263b" />
            <rect x="65%" y="10%" width="9%" height="3%" fill="#13263b" />
            {windows.map(win => (
              <rect key={win.id} x={`${win.x}%`} y={`${win.y + 40}%`} width="2" height="2" fill={win.color} opacity={0.5} />
            ))}
          </svg>
          <div className="absolute top-[30%] left-[18%] w-[10px] h-[30px] neon-magenta" />
          <div className="absolute top-[20%] left-[42%] w-[20px] h-[10px] neon-cyan" />
          <div className="absolute top-[50%] left-[80%] w-[15px] h-[15px] neon-yellow" />
          <div className="absolute top-[15%] left-[68%] w-[8px] h-[40px] neon-magenta" />
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-30 flex flex-col items-center justify-center min-h-[90vh] px-4 pt-10">
        {/* Bubble Graffiti Title */}
        <div className="w-full max-w-[500px] h-[160px] relative flex justify-center items-center anim-float mb-4">
          <svg viewBox="0 0 500 160" width="100%" height="100%" style={{ overflow: 'visible' }}>
            <defs>
              <linearGradient id="bubbleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffccee" />
                <stop offset="50%" stopColor={C.hotPink} />
                <stop offset="100%" stopColor={C.magenta} />
              </linearGradient>
              <filter id="shadowBlobBlur">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" fontSize="64" fontFamily="'Press Start 2P', monospace" fill={C.shadowBlob} transform="translate(6, 8)" filter="url(#shadowBlobBlur)">BEATWORLD</text>
            <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" fontSize="64" fontFamily="'Press Start 2P', monospace" fill={C.magenta} stroke={C.black} strokeWidth="6" transform="translate(4, 5)" strokeLinejoin="round">BEATWORLD</text>
            <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" fontSize="64" fontFamily="'Press Start 2P', monospace" fill="url(#bubbleGradient)" stroke={C.black} strokeWidth="6" strokeLinejoin="round">BEATWORLD</text>
            <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" fontSize="64" fontFamily="'Press Start 2P', monospace" fill="transparent" stroke="#ffeeee" strokeWidth="1" transform="translate(-2, -2)">BEATWORLD</text>
            <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" fontSize="64" fontFamily="'Press Start 2P', monospace" fill="url(#bubbleGradient)">BEATWORLD</text>
          </svg>
        </div>

        {/* Subtitle */}
        <div className="bg-[#111133] border border-[#ffffff30] px-6 py-3 mb-12" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          <p className="text-[9px] text-[#87ceeb] m-0 tracking-[2px] text-center" style={{ textShadow: '1px 1px 0 #000' }}>
            BEAT THE WORLD · ONE CITY AT A TIME
          </p>
        </div>

        {/* Buttons */}
        <div className="w-[260px] flex flex-col gap-4">
          <button
            onClick={() => setLocation('/creator')}
            className="btn-new w-full text-[11px] py-4 px-6 flex items-center justify-center gap-3 outline-none focus:ring-2 focus:ring-[#87ceeb]"
          >
            <span className="text-white text-[10px]">▶</span> NEW GAME
          </button>

          {hasSave && (
            <button
              onClick={() => setLocation('/map')}
              className="btn-continue w-full text-[11px] py-4 px-6 flex items-center justify-center gap-2 outline-none focus:ring-2 focus:ring-[#87ceeb]"
            >
              <span className="text-[#111] text-[10px] anim-blink">►</span>
              <div className="flex flex-col items-start leading-tight">
                <span>CONTINUE</span>
                <span className="text-[7px] opacity-80 mt-1 anim-blink">SAVE FOUND</span>
              </div>
            </button>
          )}
        </div>

        {/* Player info */}
        {hasSave && (
          <div className="mt-8 text-[8px] text-[#ffffff55] text-center space-y-1">
            <p>PRODUCER: <span className="text-[#87ceeb]">{state.playerName}</span></p>
            <p>CLOUT: <span className="text-[#ffee00]">{state.clout}</span> · CITIES: <span className="text-[#44cc00]">{state.completedCities.length}/18</span></p>
          </div>
        )}
      </main>

      {/* Bottom Ticker */}
      <div className="fixed bottom-0 left-0 w-full h-8 bg-[#0d1b2a] border-t-2 border-[#ff3399] flex items-center overflow-hidden z-40">
        <div className="anim-marquee flex gap-2 text-[8px] tracking-widest whitespace-nowrap">
          <TickerContent />
          <TickerContent />
          <TickerContent />
        </div>
      </div>
    </div>
  );
}
