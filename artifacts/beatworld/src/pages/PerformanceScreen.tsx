import { useEffect, useState, useMemo } from 'react';
import { useLocation, useParams } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';
import { CITIES } from '@/lib/game-data';
import { audio } from '@/lib/audio';

const NEON = ['#ff00ff', '#00ffff', '#ffff00', '#ff8800'];
const SKIN_TONES = ['#f1c27d', '#8d5524', '#c68642', '#6f4e37', '#e0ac69'];
const TOP_COLORS = ['#ff3399', '#0050cc', '#44cc00', '#ff8800', '#6600cc', '#00aaaa', '#ffee00', '#cc3300'];

function shade(col: string, amt: number) {
  const c = col.startsWith('#') ? col.slice(1) : col;
  const num = parseInt(c, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amt));
  return '#' + ((b | (g << 8) | (r << 16)) >>> 0).toString(16).padStart(6, '0');
}

function IsoNpc({ x, y, skinTone, topColor, dancing, delay }: { x: number; y: number; skinTone: string; topColor: string; dancing: boolean; delay: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <g className={dancing ? 'anim-dancer' : ''} style={{ animationDelay: `${delay}s` }}>
        <rect x="-4" y="-12" width="8" height="6" fill={skinTone} />
        <rect x="-2" y="-14" width="4" height="2" fill="#111" />
        <rect x="-2" y="-10" width="2" height="1" fill="#111" />
        <rect x="1" y="-10" width="2" height="1" fill="#111" />
        <rect x="-5" y="-6" width="10" height="8" fill={topColor} />
        <rect x="-7" y="-4" width="3" height="6" fill={topColor} />
        <rect x="5" y="-4" width="3" height="6" fill={topColor} />
        <rect x="-5" y="2" width="10" height="6" fill="#334455" />
        <rect x="-5" y="8" width="4" height="3" fill="#111" />
        <rect x="1" y="8" width="4" height="3" fill="#111" />
      </g>
    </g>
  );
}

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

  const npcs = useMemo(() => {
    const items: { id: string; x: number; y: number; skinTone: string; topColor: string; delay: number }[] = [];
    for (let row = 0; row < 5; row++) {
      const rowCount = 8 + row * 3;
      const rowY = 200 + row * 30;
      for (let c = 0; c < rowCount; c++) {
        const isoX = (c - row * 0.5) * 20 - rowCount * 10 + 200;
        const isoY = rowY + c * 2;
        items.push({
          id: `npc-${row}-${c}`,
          x: isoX,
          y: isoY,
          skinTone: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
          topColor: TOP_COLORS[Math.floor(Math.random() * TOP_COLORS.length)],
          delay: Math.random() * 0.5,
        });
      }
    }
    return items;
  }, []);

  const confetti = useMemo(() =>
    Array(40).fill(0).map((_, i) => ({
      id: i,
      color: NEON[Math.floor(Math.random() * NEON.length)],
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
        @keyframes dancerBob { 0%,100%{transform:translateY(0) scaleX(1)} 25%{transform:translateY(-3px) scaleX(0.95)} 50%{transform:translateY(0) scaleX(1)} 75%{transform:translateY(-2px) scaleX(1.05)} }
        .anim-dancer { animation: dancerBob 0.5s infinite steps(4); }
        @keyframes lightBeamFlash { 0%,100%{opacity:0.5} 50%{opacity:0.08} }
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
      `}</style>

      <div className="absolute inset-0 z-0 flex items-end justify-center overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 400 380" preserveAspectRatio="xMidYMid slice" style={{ imageRendering: 'pixelated' }}>
          <rect x="0" y="0" width="400" height="380" fill="#0d0d22" />

          <g>
            {[...Array(12)].map((_, row) => (
              [...Array(20)].map((_, col) => {
                const tileX = (col - row) * 20 + 200;
                const tileY = (col + row) * 10 + 120;
                const fill = (row + col) % 2 === 0 ? '#1a1a33' : '#151530';
                return (
                  <polygon
                    key={`stage-${row}-${col}`}
                    points={`${tileX},${tileY} ${tileX + 20},${tileY + 10} ${tileX},${tileY + 20} ${tileX - 20},${tileY + 10}`}
                    fill={fill}
                    stroke="#222244"
                    strokeWidth="0.5"
                  />
                );
              })
            ))}
          </g>

          <polygon points="120,130 200,90 280,130 200,170" fill="#222244" stroke="#333366" strokeWidth="1" />
          <polygon points="120,130 200,170 200,185 120,145" fill="#1a1a33" stroke="#333366" strokeWidth="0.5" />
          <polygon points="200,170 280,130 280,145 200,185" fill="#111128" stroke="#333366" strokeWidth="0.5" />

          <rect x="175" y="100" width="50" height="30" fill="#111133" stroke="#333366" strokeWidth="1" />
          <rect x="180" y="105" width="15" height="8" fill="#222244" />
          <rect x="180" y="105" width="15" height="8" fill="#222244" />
          {[...Array(4)].map((_, i) => (
            <rect key={`knob-${i}`} x={200 + i * 6} y={108} width="3" height="3" fill="#444466" />
          ))}
          <rect x="180" y="118" width="40" height="6" fill="#0a0a1a" />

          <rect x="10" y="60" width="30" height="60" fill="#0a0a1a" stroke="#333366" />
          <circle cx="25" cy="75" r="10" fill="#111133" />
          <circle cx="25" cy="105" r="10" fill="#111133" />

          <rect x="360" y="60" width="30" height="60" fill="#0a0a1a" stroke="#333366" />
          <circle cx="375" cy="75" r="10" fill="#111133" />
          <circle cx="375" cy="105" r="10" fill="#111133" />

          <polygon points="40,30 60,30 50,50" fill={NEON[0]} opacity="0.6" />
          <polygon points="140,30 160,30 150,50" fill={NEON[1]} opacity="0.6" />
          <polygon points="240,30 260,30 250,50" fill={NEON[2]} opacity="0.6" />
          <polygon points="340,30 360,30 350,50" fill={NEON[3]} opacity="0.6" />

          {npcs.map(npc => (
            <IsoNpc
              key={npc.id}
              x={npc.x}
              y={npc.y}
              skinTone={npc.skinTone}
              topColor={npc.topColor}
              dancing={isPlaying}
              delay={npc.delay}
            />
          ))}
        </svg>
      </div>

      {isPlaying && (
        <div className="absolute top-[30px] left-0 w-full h-[40vh] z-10 flex justify-between px-[5%] pointer-events-none mix-blend-screen">
          <div className="w-[100px] h-full bg-[#ff00ff] light-beam anim-beam-1 origin-top rotate-[15deg]" />
          <div className="w-[100px] h-full bg-[#00ffff] light-beam anim-beam-2 origin-top rotate-[5deg]" />
          <div className="w-[100px] h-full bg-[#ffff00] light-beam anim-beam-3 origin-top rotate-[-5deg]" />
          <div className="w-[100px] h-full bg-[#ff8800] light-beam anim-beam-4 origin-top rotate-[-15deg]" />
        </div>
      )}

      <div className="absolute inset-0 z-20 scanlines-pf" />

      <div className="relative z-40 flex flex-col items-center gap-6">
        <div className="bg-[#111133]/90 border-2 border-[#ff00ff] p-4 flex flex-col items-center gap-2 backdrop-blur-sm" style={{ boxShadow: '3px 3px 0px #000' }}>
          <h1 className="text-[#ff00ff] text-[11px] text-center" style={{ textShadow: '0 0 8px #ff00ff' }}>
            {city.emoji} {city.venue.toUpperCase()}
          </h1>
          <p className="text-[#00ffff] text-[7px] text-center tracking-widest" style={{ textShadow: '0 0 8px #00ffff' }}>
            {city.name.toUpperCase()} · {city.genre.toUpperCase()}
          </p>
        </div>

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
