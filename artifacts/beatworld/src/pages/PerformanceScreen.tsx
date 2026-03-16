import { useEffect, useState, useMemo } from 'react';
import { useLocation, useParams } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';
import { CITIES } from '@/lib/game-data';
import { audio } from '@/lib/audio';

const CYCLE_COLORS = ['#ff00ff', '#00ffff', '#ffff00', '#ff8800'];

export default function PerformanceScreen() {
  const { cityId } = useParams();
  const [, setLocation] = useLocation();
  const { state } = useGameState();
  const [isPlaying, setIsPlaying] = useState(true);
  const [vuLevels, setVuLevels] = useState<number[]>(Array(16).fill(1));

  const city = cityId ? CITIES[cityId] : null;
  const track = cityId ? state.tracks[cityId] : null;

  useEffect(() => {
    if (!city || !track) return;
    audio.init();
    let step = 0;
    const bpm = city.defaultBpm || 120;
    const interval = setInterval(() => {
      const time = audio.getCurrentTime() + 0.005;
      city.instruments.forEach((inst, idx) => {
        if (track[idx]?.[step]) {
          if (['kick', 'snare', 'hihat', 'perc'].includes(inst.type)) {
            audio.playDrum(inst.type, time);
          } else {
            audio.playSynth(inst.type as any, step, time);
          }
        }
      });
      step = (step + 1) % 16;
    }, (60000 / bpm) / 4);

    const endTimer = setTimeout(() => {
      clearInterval(interval);
      setIsPlaying(false);
    }, 8000);

    return () => { clearInterval(interval); clearTimeout(endTimer); };
  }, [city, track]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setVuLevels(Array(16).fill(0).map(() => Math.floor(Math.random() * 4) + 1));
      }, 150);
    } else {
      setVuLevels(Array(16).fill(1));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const crowd = useMemo(() => {
    const items: { id: string; x: number; y: number; delay: number; color: string }[] = [];
    for (let r = 0; r < 4; r++) {
      const rowY = 160 + r * 15;
      for (let c = 0; c < 35; c++) {
        items.push({
          id: `h-${r}-${c}`,
          x: c * 14 - 20 + (r % 2) * 6,
          y: rowY,
          delay: Math.random() * 0.5,
          color: CYCLE_COLORS[Math.floor(Math.random() * CYCLE_COLORS.length)],
        });
      }
    }
    return items;
  }, []);

  const confetti = useMemo(() =>
    Array(40).fill(0).map((_, i) => ({
      id: i,
      color: CYCLE_COLORS[Math.floor(Math.random() * CYCLE_COLORS.length)],
      tx: (Math.random() - 0.5) * 400,
      ty: (Math.random() - 1) * 300 - 50,
      delay: Math.random() * 0.2,
    })), []);

  if (!city) return <div className="text-white p-8">City not found</div>;

  return (
    <div
      className="relative w-screen h-screen bg-[#0a0a1a] text-[#e0e0ff] uppercase overflow-hidden select-none flex flex-col items-center justify-center"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      <style>{`
        @keyframes crowdBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        .anim-crowd { animation: crowdBob 0.4s infinite steps(2); }
        @keyframes lightBeamFlash { 0%,100%{opacity:0.6} 50%{opacity:0.1} }
        .anim-beam-1 { animation: lightBeamFlash 0.3s infinite steps(2); }
        .anim-beam-2 { animation: lightBeamFlash 0.3s infinite steps(2) 0.1s; }
        .anim-beam-3 { animation: lightBeamFlash 0.3s infinite steps(2) 0.2s; }
        .anim-beam-4 { animation: lightBeamFlash 0.3s infinite steps(2) 0.15s; }
        @keyframes stageGlowPulse {
          0%{box-shadow:0 -20px 40px -10px #ff00ff;border-top-color:#ff00ff}
          33%{box-shadow:0 -20px 40px -10px #00ffff;border-top-color:#00ffff}
          66%{box-shadow:0 -20px 40px -10px #ffff00;border-top-color:#ffff00}
          100%{box-shadow:0 -20px 40px -10px #ff8800;border-top-color:#ff8800}
        }
        .anim-stage-glow { animation: stageGlowPulse 1.2s infinite steps(4); }
        @keyframes textBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        .anim-blink { animation: textBlink 1s infinite steps(2); }
        @keyframes confettiFly { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0.5);opacity:0} }
        .anim-confetti { animation: confettiFly 1.5s ease-out forwards; }
        .light-beam { clip-path: polygon(calc(50% - 30px) 0, calc(50% + 30px) 0, calc(50% + 100px) 100%, calc(50% - 100px) 100%); }
        .scanlines-pf { background: repeating-linear-gradient(to bottom,rgba(0,0,0,0) 0px,rgba(0,0,0,0) 2px,rgba(0,0,0,0.1) 2px,rgba(0,0,0,0.1) 4px); pointer-events:none; }
        .grid-pf { background-image:linear-gradient(rgba(255,0,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,0,255,0.03) 1px,transparent 1px); background-size:32px 32px; pointer-events:none; }
      `}</style>

      {/* Background SVG venue */}
      <div className="absolute inset-0 z-0 bg-[#0d0d22] flex items-end justify-center">
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMax slice" style={{ imageRendering: 'pixelated' }}>
          <rect x="150" y="40" width="100" height="40" fill="#111133" />
          <rect x="160" y="50" width="80" height="20" fill="#0a0a1a" />
          <rect x="0" y="20" width="400" height="10" fill="#0a0a1a" stroke="#444466" strokeWidth="2" />
          <polygon points="40,30 60,30 50,50" fill="#ff00ff" />
          <polygon points="140,30 160,30 150,50" fill="#00ffff" />
          <polygon points="240,30 260,30 250,50" fill="#ffff00" />
          <polygon points="340,30 360,30 350,50" fill="#ff8800" />
          {crowd.map(person => (
            <g key={person.id} className={isPlaying ? 'anim-crowd' : ''} style={{ animationDelay: `${person.delay}s` }}>
              <rect x={person.x} y={person.y} width="12" height="8" fill={person.color} opacity="0.8" />
              <rect x={person.x + 2} y={person.y - 2} width="8" height="4" fill="#0a0a1a" />
            </g>
          ))}
          <g transform="translate(10,140)">
            <rect x="0" y="0" width="40" height="80" fill="#0a0a1a" stroke="#444466" strokeWidth="2" />
            <circle cx="20" cy="20" r="12" fill="#111133" /><circle cx="20" cy="60" r="12" fill="#111133" />
          </g>
          <g transform="translate(350,140)">
            <rect x="0" y="0" width="40" height="80" fill="#0a0a1a" stroke="#444466" strokeWidth="2" />
            <circle cx="20" cy="20" r="12" fill="#111133" /><circle cx="20" cy="60" r="12" fill="#111133" />
          </g>
        </svg>
      </div>

      {/* Stage floor */}
      <div className={`absolute bottom-0 w-full h-[30%] bg-[#0a0a1a] border-t-2 z-10 flex flex-col ${isPlaying ? 'anim-stage-glow' : 'border-[#444466]'}`}>
        <div className="w-full h-1 bg-[#111133] mt-2 opacity-50" />
        <div className="w-full h-1 bg-[#111133] mt-4 opacity-40" />
        <div className="w-full h-1 bg-[#111133] mt-6 opacity-30" />
        <div className="w-full h-1 bg-[#111133] mt-8 opacity-20" />
      </div>

      {/* Light beams */}
      {isPlaying && (
        <div className="absolute top-[30px] left-0 w-full h-[40vh] z-10 flex justify-between px-[5%] pointer-events-none mix-blend-screen">
          <div className="w-[100px] h-full bg-[#ff00ff] light-beam anim-beam-1 origin-top rotate-[15deg]" />
          <div className="w-[100px] h-full bg-[#00ffff] light-beam anim-beam-2 origin-top rotate-[5deg]" />
          <div className="w-[100px] h-full bg-[#ffff00] light-beam anim-beam-3 origin-top rotate-[-5deg]" />
          <div className="w-[100px] h-full bg-[#ff8800] light-beam anim-beam-4 origin-top rotate-[-15deg]" />
        </div>
      )}

      {/* Overlays */}
      <div className="absolute inset-0 z-20 grid-pf" />
      <div className="absolute inset-0 z-30 scanlines-pf" />

      {/* Center HUD */}
      <div className="relative z-40 flex flex-col items-center gap-6">
        <div className="bg-[#111133]/90 border-2 border-[#ff00ff] p-4 flex flex-col items-center gap-2 backdrop-blur-sm" style={{ boxShadow: '3px 3px 0px #000' }}>
          <h1 className="text-[#ff00ff] text-[11px] text-center" style={{ textShadow: '0 0 8px #ff00ff' }}>
            {city.emoji} {city.venue.toUpperCase()}
          </h1>
          <p className="text-[#00ffff] text-[7px] text-center tracking-widest" style={{ textShadow: '0 0 8px #00ffff' }}>
            {city.name.toUpperCase()} · {city.genre.toUpperCase()}
          </p>
        </div>

        {/* VU Meter */}
        <div className="bg-[#111133] border border-[#444466] p-2 flex gap-1 items-end h-[60px]" style={{ boxShadow: '3px 3px 0px #000' }}>
          {vuLevels.map((level, i) => {
            const h = { 1: '25%', 2: '50%', 3: '75%', 4: '100%' }[level] || '25%';
            let color = '#ff00ff';
            if (level === 2) color = '#ffff00';
            if (level >= 3) color = '#ff0000';
            return (
              <div
                key={i}
                className="w-2 transition-all duration-75"
                style={{ height: h, backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
              />
            );
          })}
        </div>
      </div>

      {/* Performance Complete Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a1a]/80 backdrop-blur-sm">
          <h2
            className="text-[#ffff00] text-[24px] md:text-[36px] text-center mb-8 anim-blink leading-tight"
            style={{ textShadow: '0 0 12px #ffff00' }}
          >
            PERFORMANCE<br />COMPLETE!
          </h2>

          <button
            onClick={() => setLocation(`/review/${city.id}`)}
            className="bg-[#ff00ff] text-[#0a0a1a] border-2 border-[#ff00ff] px-6 py-4 text-[10px] uppercase hover:brightness-110 active:translate-y-[2px] active:translate-x-[2px] transition-none outline-none focus:ring-2 focus:ring-[#ffff00]"
            style={{ boxShadow: '3px 3px 0px #000' }}
          >
            SEE REVIEWS
          </button>

          {/* Confetti */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {confetti.map(c => (
              <div
                key={c.id}
                className="absolute w-1 h-1 anim-confetti"
                style={{
                  backgroundColor: c.color,
                  boxShadow: `0 0 4px ${c.color}`,
                  '--tx': `${c.tx}px`,
                  '--ty': `${c.ty}px`,
                  animationDelay: `${c.delay}s`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
