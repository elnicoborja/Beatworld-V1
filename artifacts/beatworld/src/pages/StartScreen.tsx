import { useLocation } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';

const GLOBE_PIXELS = [
  "      11111111      ",
  "    111112211111    ",
  "   11111222211111   ",
  "  1111122221111111  ",
  " 111111222111111111 ",
  " 111111111111122211 ",
  "11111111111111222211",
  "11111111111111222211",
  "11111111111111122111",
  "11111111111111111111",
  "11111111111111111111",
  " 111111111112221111 ",
  " 111111111112221111 ",
  "  1111111111221111  ",
  "   11111111111111   ",
  "    111111111111    ",
  "      11111111      ",
];

export default function StartScreen() {
  const [, setLocation] = useLocation();
  const { state } = useGameState();
  const hasSave = state.completedCities.length > 0 || state.currentCity !== null;

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a1a] text-[#e0e0ff] uppercase overflow-hidden" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      <style>{`
        @keyframes titlePulse {
          0%, 100% { text-shadow: 0 0 10px #ff00ff, 0 0 30px #ff00ff, 3px 3px 0px #000; }
          50% { text-shadow: 0 0 20px #ff00ff, 0 0 50px #ff00ff, 3px 3px 0px #000; }
        }
        .animate-title-pulse { animation: titlePulse 2s infinite ease-in-out; }

        @keyframes globeSpin {
          0% { transform: rotateY(0deg); }
          100% { transform: rotateY(360deg); }
        }
        .animate-globe { animation: globeSpin 40s infinite linear; transform-style: preserve-3d; }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 15s infinite linear; display: inline-block; white-space: nowrap; }

        @keyframes buttonBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-blink { animation: buttonBlink 1s infinite; }

        @keyframes crtFlicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }

        .scanlines-overlay {
          background: repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px);
          animation: crtFlicker 0.1s infinite;
          pointer-events: none;
        }

        .grid-bg {
          background-image: linear-gradient(rgba(255,0,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,255,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }

        .radial-vignette {
          background: radial-gradient(circle at center, transparent 0%, #0a0a1a 100%);
          pointer-events: none;
        }

        .btn-hover:hover { filter: brightness(1.2); }
        .btn-active:active { transform: translate(2px, 2px); box-shadow: 2px 2px 0px #000 !important; }
      `}</style>

      {/* SVG Pixel Art Globe */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.18] z-0 overflow-hidden">
        <svg
          viewBox="0 0 20 17"
          className="w-[420px] h-auto animate-globe mix-blend-screen"
          style={{ imageRendering: 'pixelated' }}
        >
          {GLOBE_PIXELS.map((row, y) =>
            row.split('').map((char, x) => {
              if (char === '1') return <rect key={`${x}-${y}`} x={x} y={y} width="1.05" height="1.05" fill="#0050ff" />;
              if (char === '2') return <rect key={`${x}-${y}`} x={x} y={y} width="1.05" height="1.05" fill="#00ff00" />;
              return null;
            })
          )}
        </svg>
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 grid-bg z-10" />
      <div className="absolute inset-0 scanlines-overlay z-20" />
      <div className="absolute inset-0 radial-vignette z-30" />

      {/* Main Content */}
      <main className="relative z-40 flex flex-col items-center justify-center min-h-screen px-4 pb-16">
        {/* Music notes */}
        <div className="text-[#ff00ff] text-base mb-6 tracking-[8px]" style={{ textShadow: '0 0 8px #ff00ff' }}>
          ♩ ♪ ♩
        </div>

        {/* Title */}
        <h1 className="text-[36px] md:text-[64px] text-[#ff00ff] animate-title-pulse text-center leading-tight">
          BEATWORLD
        </h1>

        {/* Subtitle */}
        <p className="text-[10px] text-[#00ffff] mt-4 tracking-[3px] text-center max-w-md leading-relaxed" style={{ textShadow: '0 0 8px #00ffff' }}>
          BEAT THE WORLD · ONE CITY AT A TIME
        </p>

        {/* Divider */}
        <div className="w-[200px] h-[2px] bg-[#ff00ff] my-[32px] mx-auto" style={{ boxShadow: '0 0 8px #ff00ff' }} />

        {/* Buttons */}
        <div className="w-[240px] flex flex-col gap-4">
          <button
            onClick={() => setLocation('/creator')}
            className="w-full bg-[#ff00ff] text-[#0a0a1a] border-2 border-[#ff00ff] text-[11px] py-4 px-6 uppercase btn-hover btn-active transition-all outline-none focus:ring-2 focus:ring-[#ffff00] focus:ring-offset-2 focus:ring-offset-[#0a0a1a]"
            style={{ boxShadow: '4px 4px 0px #000' }}
          >
            NEW GAME
          </button>

          {hasSave && (
            <button
              onClick={() => setLocation('/map')}
              className="w-full bg-transparent text-[#00ffff] border-2 border-[#00ffff] text-[11px] py-4 px-6 uppercase btn-hover btn-active animate-blink transition-all outline-none focus:ring-2 focus:ring-[#ffff00] focus:ring-offset-2 focus:ring-offset-[#0a0a1a]"
              style={{ textShadow: '0 0 8px #00ffff', boxShadow: '0 0 8px inset #00ffff, 4px 4px 0px #000' }}
            >
              CONTINUE
            </button>
          )}

          <button
            onClick={() => setLocation('/leaderboard')}
            className="w-full bg-transparent text-[#0050ff] border-2 border-[#0050ff] text-[11px] py-4 px-6 uppercase btn-hover btn-active transition-all outline-none focus:ring-2 focus:ring-[#ffff00] focus:ring-offset-2 focus:ring-offset-[#0a0a1a]"
            style={{ boxShadow: '4px 4px 0px #000' }}
          >
            LEADERBOARD
          </button>
        </div>

        {/* Player info */}
        {hasSave && (
          <div className="mt-8 text-[8px] text-[#444466] text-center space-y-1">
            <p>PRODUCER: <span className="text-[#00ffff]">{state.playerName}</span></p>
            <p>CLOUT: <span className="text-[#ffff00]">{state.clout}</span> · CITIES: <span className="text-[#00ff88]">{state.completedCities.length}/18</span></p>
          </div>
        )}
      </main>

      {/* Bottom Ticker */}
      <div className="fixed bottom-0 left-0 w-full bg-[#111133] border-t border-[#ff00ff] h-8 flex items-center overflow-hidden z-50">
        <div className="animate-marquee whitespace-nowrap text-[#ffff00] text-[8px] tracking-widest" style={{ textShadow: '0 0 4px #ffff00' }}>
          <span className="inline-block pr-8">
            ♩ BEATWORLD v1.0 · 18 CITIES · 6 LEVELS · BECOME THE TOP PRODUCER · NEW YORK · LOS ANGELES · PUERTO RICO · MEDELLÍN · RIO · SÃO PAULO · BOGOTÁ · BUENOS AIRES · MEXICO CITY · TULUM · BERLIN · LONDON · NEWCASTLE · BRIGHTON · ♩
          </span>
          <span className="inline-block pr-8">
            ♩ BEATWORLD v1.0 · 18 CITIES · 6 LEVELS · BECOME THE TOP PRODUCER · NEW YORK · LOS ANGELES · PUERTO RICO · MEDELLÍN · RIO · SÃO PAULO · BOGOTÁ · BUENOS AIRES · MEXICO CITY · TULUM · BERLIN · LONDON · NEWCASTLE · BRIGHTON · ♩
          </span>
        </div>
      </div>
    </div>
  );
}
