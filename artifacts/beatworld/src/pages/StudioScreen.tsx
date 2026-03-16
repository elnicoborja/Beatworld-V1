import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useParams } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';
import { CITIES } from '@/lib/game-data';
import { audio } from '@/lib/audio';

const IsoBuilding = ({ x, y, width, depth, height, topColor, leftColor, rightColor }: any) => {
  const pTop = `${x},${y} ${x + width},${y - width * 0.5} ${x + width + depth},${y - width * 0.5 + depth * 0.5} ${x + depth},${y + depth * 0.5}`;
  const pLeft = `${x},${y} ${x + depth},${y + depth * 0.5} ${x + depth},${y + depth * 0.5 + height} ${x},${y + height}`;
  const pRight = `${x + depth},${y + depth * 0.5} ${x + width + depth},${y - width * 0.5 + depth * 0.5} ${x + width + depth},${y - width * 0.5 + depth * 0.5 + height} ${x + depth},${y + depth * 0.5 + height}`;
  return (
    <g style={{ imageRendering: 'pixelated' }}>
      <polygon points={pTop} fill={topColor} stroke="#000" strokeWidth="1" />
      <polygon points={pLeft} fill={leftColor} stroke="#000" strokeWidth="1" />
      <polygon points={pRight} fill={rightColor} stroke="#000" strokeWidth="1" />
    </g>
  );
};

const LEVEL_ACCENT: Record<number, string> = {
  1: '#ff00ff', 2: '#ff8800', 3: '#ffff00', 4: '#00ff88', 5: '#00ffff', 6: '#ff0088',
};

export default function StudioScreen() {
  const { cityId } = useParams();
  const [, setLocation] = useLocation();
  const { state, saveTrack } = useGameState();
  const city = cityId ? CITIES[cityId] : null;

  const [tracks, setTracks] = useState<boolean[][]>(() => {
    if (cityId && state.tracks[cityId]) return state.tracks[cityId];
    return Array(city?.numInstruments || 4).fill(null).map(() => Array(16).fill(false));
  });

  const tracksRef = useRef(tracks);
  useEffect(() => { tracksRef.current = tracks; }, [tracks]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(city?.defaultBpm || 120);
  const [currentStep, setCurrentStep] = useState(-1);
  const [audioReady, setAudioReady] = useState(false);
  const [fxValues, setFxValues] = useState([12, 45, 78]);

  const intervalRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  const ensureAudio = useCallback(async () => {
    await audio.init();
    setAudioReady(audio.isReady());
  }, []);

  const playStep = useCallback((step: number) => {
    if (!city) return;
    const time = audio.getCurrentTime();
    city.instruments.forEach((inst, idx) => {
      if (tracksRef.current[idx]?.[step]) {
        if (['kick', 'snare', 'hihat', 'perc'].includes(inst.type)) {
          audio.playDrum(inst.type, time);
        } else {
          audio.playSynth(inst.type as any, step, time);
        }
      }
    });
  }, [city]);

  useEffect(() => {
    if (isPlaying) {
      stepRef.current = 0;
      const stepTime = Math.round((60_000 / bpm) / 4);
      intervalRef.current = window.setInterval(() => {
        const s = stepRef.current;
        setCurrentStep(s);
        playStep(s);
        stepRef.current = (s + 1) % 16;
      }, stepTime);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentStep(-1);
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, bpm, playStep]);

  const handlePlayToggle = async () => {
    await ensureAudio();
    setIsPlaying(p => !p);
  };

  const toggleStep = async (trackIdx: number, stepIdx: number) => {
    await ensureAudio();
    const newTracks = tracks.map((row, i) =>
      i === trackIdx ? row.map((v, j) => (j === stepIdx ? !v : v)) : row
    );
    setTracks(newTracks);
    if (!newTracks[trackIdx][stepIdx]) return;
    const inst = city?.instruments[trackIdx];
    if (!inst) return;
    const t = audio.getCurrentTime();
    if (['kick', 'snare', 'hihat', 'perc'].includes(inst.type)) {
      audio.playDrum(inst.type, t);
    } else {
      audio.playSynth(inst.type as any, stepIdx, t);
    }
  };

  const handleFinish = () => {
    if (!cityId) return;
    saveTrack(cityId, tracks);
    setLocation(`/performance/${cityId}`);
  };

  if (!city) return <div className="text-white p-8">City not found</div>;

  const accent = LEVEL_ACCENT[city.level] || '#ff00ff';
  const TRACK_COLORS = [
    '#ff00ff','#00ffff','#ffff00','#00ff00',
    '#ff8800','#0050ff','#ff00c8','#ff0000',
    '#00ff88','#7744ff','#ff4488','#44aaff',
    '#ffcc00','#cc00ff','#00ff44','#ff0044',
  ];

  return (
    <div
      className="min-h-screen bg-[#0a0a1a] text-[#e0e0ff] uppercase overflow-hidden relative select-none p-3 md:p-6 flex flex-col gap-4"
      style={{ fontFamily: '"Press Start 2P", monospace' }}
    >
      <style>{`
        .crt-overlay {
          background: repeating-linear-gradient(rgba(0,0,0,0) 0, rgba(0,0,0,0) 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px);
          pointer-events: none; z-index: 50; position: absolute; inset: 0;
        }
        .grid-overlay {
          background-image: linear-gradient(rgba(255,0,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,255,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none; z-index: 10; position: absolute; inset: 0;
        }
        .pixel-shadow { box-shadow: 3px 3px 0px #000; }
        .text-glow-magenta { text-shadow: 0 0 8px #ff00ff; }
        .text-glow-cyan { text-shadow: 0 0 8px #00ffff; }
        .text-glow-yellow { text-shadow: 0 0 8px #ffff00; }
        input[type=range] { -webkit-appearance: none; background: transparent; }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 14px; width: 6px;
          background: #00ffff; border: 2px solid #000; box-shadow: 2px 2px 0px #000;
          cursor: pointer; margin-top: -5px;
        }
        input[type=range]::-webkit-slider-runnable-track {
          width: 100%; height: 4px; cursor: pointer; background: #444466; border-bottom: 2px solid #e0e0ff;
        }
      `}</style>

      <div className="crt-overlay" />
      <div className="grid-overlay" />

      {/* Header */}
      <header className="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 pb-3 gap-3" style={{ borderColor: accent }}>
        <div>
          <h1 className="text-2xl md:text-4xl text-glow-magenta pixel-shadow" style={{ color: accent }}>
            {city.emoji} {city.name.toUpperCase()}
          </h1>
          <p className="text-[10px] text-[#00ffff] text-glow-cyan tracking-widest mt-1">
            SYS.VER: YM2612 // {city.genre.toUpperCase()} · {city.instruments.length} TRACKS
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#111133] border-2 border-[#00ffff] p-2 pixel-shadow flex flex-col items-center">
            <span className="text-[8px] text-[#00ffff] mb-1">CLOUT</span>
            <span className="text-lg text-[#ffff00] text-glow-yellow">{state.clout.toLocaleString()}</span>
          </div>
          <div className="bg-[#111133] border-2 p-2 pixel-shadow flex flex-col items-center" style={{ borderColor: accent }}>
            <span className="text-[8px] mb-1" style={{ color: accent }}>LEVEL</span>
            <span className="text-lg text-[#e0e0ff]">{city.level}</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden">

        {/* Left: Transport + Module Tweak */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Transport */}
          <div className="bg-[#111133] border-2 border-[#e0e0ff] p-3 pixel-shadow">
            <h2 className="text-[#00ffff] text-[10px] mb-3 border-b-2 border-[#444466] pb-1">TRANSPORT</h2>
            <div className="flex gap-3 mb-4">
              <button
                onClick={handlePlayToggle}
                className="flex-1 py-3 border-2 pixel-shadow transition-all active:translate-y-[2px] active:translate-x-[2px] active:shadow-[1px_1px_0px_#000] text-sm"
                style={{
                  background: isPlaying ? '#00ff00' : '#ff0000',
                  borderColor: '#0a0a1a',
                  color: isPlaying ? '#0a0a1a' : '#e0e0ff',
                  boxShadow: isPlaying ? '0 0 15px #00ff00, 3px 3px 0px #000' : '3px 3px 0px #000',
                }}
              >
                {isPlaying ? '■ STOP' : '▶ PLAY'}
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 border-2 pixel-shadow transition-all active:translate-y-[2px] active:translate-x-[2px] text-sm"
                style={{
                  background: '#00ffff',
                  borderColor: '#0a0a1a',
                  color: '#0a0a1a',
                  boxShadow: '0 0 10px #00ffff44, 3px 3px 0px #000',
                }}
              >
                FINISH →
              </button>
            </div>

            <div className="flex justify-between items-center bg-[#0a0a1a] border-2 border-[#444466] p-2 mb-3">
              <span className="text-[#e0e0ff] text-[9px]">TEMPO</span>
              <div className="flex items-center gap-2">
                <button onClick={() => setBpm(b => Math.max(60, b - 1))} className="text-[#ff00ff] hover:text-[#00ffff] text-xs">◀</button>
                <span className="text-[#ffff00] text-glow-yellow w-10 text-center text-sm">{bpm}</span>
                <button onClick={() => setBpm(b => Math.min(200, b + 1))} className="text-[#ff00ff] hover:text-[#00ffff] text-xs">▶</button>
              </div>
            </div>

            <div className="flex justify-between items-center bg-[#0a0a1a] border-2 border-[#444466] p-2">
              <span className="text-[#e0e0ff] text-[9px]">SHUFFLE</span>
              <div className="w-14 h-3 border-2 border-[#444466] relative bg-[#111133]">
                <div className="absolute left-0 top-0 h-full w-1/3 bg-[#00ffff]" />
              </div>
            </div>

            <div className="mt-3 text-[8px] flex items-center gap-2">
              <div className={`w-2 h-2 ${audioReady ? 'bg-[#00ff00] shadow-[0_0_6px_#00ff00]' : 'bg-[#ffff00]'}`} />
              <span style={{ color: audioReady ? '#00ff00' : '#ffff00' }}>
                {audioReady ? 'AUDIO LINK: READY' : 'CLICK TO ENABLE AUDIO'}
              </span>
            </div>
          </div>

          {/* Module Tweak */}
          <div className="bg-[#111133] border-2 border-[#0050ff] p-3 pixel-shadow flex-1">
            <h2 className="text-[#0050ff] text-[10px] mb-3 border-b-2 border-[#0050ff] pb-1">MODULE TWEAK</h2>
            <div className="space-y-4">
              {['DISTORTION', 'RESONANCE', 'CUTOFF'].map((fx, i) => (
                <div key={fx}>
                  <div className="flex justify-between text-[8px] mb-1 text-[#00ffff]">
                    <span>{fx}</span>
                    <span className="text-[#ff00ff]">{fxValues[i]}%</span>
                  </div>
                  <input
                    type="range" min="0" max="100" value={fxValues[i]}
                    onChange={e => setFxValues(prev => prev.map((v, j) => j === i ? Number(e.target.value) : v))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-4 gap-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-full"
                  style={{
                    background: i < Math.ceil(fxValues[0] / 12.5) ? '#ff0000' : '#444466',
                    boxShadow: i < Math.ceil(fxValues[0] / 12.5) ? '0 0 6px #ff000088' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: World Viewer + Sequencer */}
        <div className="lg:col-span-9 flex flex-col gap-4">

          {/* Isometric World Viewer */}
          <div className="bg-[#111133] border-2 border-[#ff00ff] p-1 pixel-shadow relative h-40 md:h-52 overflow-hidden">
            <div className="absolute top-2 left-2 z-10 bg-[#0a0a1a] border-2 border-[#ff00ff] px-2 py-1 text-[8px] text-[#ff00ff] text-glow-magenta pixel-shadow">
              LIVE: {city.venue.toUpperCase()}
            </div>
            <svg width="100%" height="100%" viewBox="0 0 300 150" className="bg-[#0a0a1a]">
              <defs>
                <pattern id="isoGrid" width="20" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 20 5 L 10 10 L 0 5 Z" fill="none" stroke="#111133" strokeWidth="0.5" />
                </pattern>
                <filter id="neonGlowM"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="neonGlowC"><feGaussianBlur stdDeviation="2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <rect width="100%" height="100%" fill="url(#isoGrid)" />
              <g transform="translate(150, 70)">
                <IsoBuilding x={-60} y={10} width={30} depth={30} height={15} topColor="#111133" leftColor="#0050ff" rightColor="#0a0a1a" />
                <IsoBuilding x={-40} y={0} width={40} depth={40} height={20} topColor="#111133" leftColor="#0050ff" rightColor="#0a0a1a" />
                <IsoBuilding x={0} y={0} width={40} depth={40} height={20} topColor="#111133" leftColor="#444466" rightColor="#0a0a1a" />
                <IsoBuilding x={40} y={10} width={25} depth={25} height={12} topColor="#111133" leftColor="#444466" rightColor="#0a0a1a" />
                <IsoBuilding x={-20} y={-20} width={20} depth={20} height={40} topColor={accent} leftColor="#ff00c8" rightColor="#444466" />
                <IsoBuilding x={0} y={-20} width={20} depth={20} height={30} topColor="#00ffff" leftColor="#0a0a1a" rightColor="#0050ff" />
                <IsoBuilding x={-50} y={-10} width={15} depth={15} height={25} topColor="#ffff00" leftColor="#444466" rightColor="#0a0a1a" />
                <polygon points="-20,-20 -20,-40 -10,-35 -10,-15" fill="#ffff00" filter="url(#neonGlowM)" />
                <polygon points="10,-15 10,-30 20,-25 20,-10" fill="#00ffff" filter="url(#neonGlowC)" />
                <polygon points="-50,-10 -45,-12 -40,-10 -45,-8" fill="#ff0000" filter="url(#neonGlowM)">
                  <animateTransform attributeName="transform" type="translate" from="0 0" to="100 -50" dur="4s" repeatCount="indefinite" />
                </polygon>
                <polygon points="30,20 35,18 40,20 35,22" fill="#00ff00" filter="url(#neonGlowC)">
                  <animateTransform attributeName="transform" type="translate" from="0 0" to="-80 -40" dur="6s" repeatCount="indefinite" />
                </polygon>
              </g>
            </svg>
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none" />

            {isPlaying && (
              <div className="absolute bottom-2 right-2 z-10 bg-[#0a0a1a] border-2 border-[#00ff00] px-2 py-1 text-[8px] text-[#00ff00] pixel-shadow">
                ► STEP {currentStep + 1}/16
              </div>
            )}
          </div>

          {/* Sequencer */}
          <div className="bg-[#111133] border-2 border-[#e0e0ff] p-3 pixel-shadow flex-1 overflow-y-auto">
            <div className="flex justify-between items-end mb-3 border-b-2 border-[#444466] pb-1">
              <h2 className="text-[#00ffff] text-[10px]">PATTERN SEQ</h2>
              <div className="hidden md:flex gap-[2px] text-[7px] text-[#444466]">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="w-7 text-center" style={{ color: i % 4 === 0 ? '#e0e0ff' : '#444466' }}>
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {city.instruments.map((inst, tIdx) => {
                const tColor = TRACK_COLORS[tIdx % TRACK_COLORS.length];
                return (
                  <div key={inst.id} className="flex flex-col md:flex-row items-start md:items-center gap-2">
                    {/* Track info */}
                    <div className="flex items-center gap-2 w-full md:w-40 bg-[#0a0a1a] border-2 border-[#444466] p-1.5 shrink-0">
                      <div className="flex flex-col gap-[2px] mr-1">
                        <button className="w-3 h-3 bg-[#ff0000] border border-[#000] text-[5px] flex items-center justify-center hover:bg-[#ff00c8]">M</button>
                        <button className="w-3 h-3 bg-[#ffff00] border border-[#000] text-[5px] flex items-center justify-center text-[#000] hover:bg-[#fff]">S</button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[8px] mb-0.5 truncate" style={{ color: tColor }}>{inst.name}</div>
                        <input type="range" min="0" max="100" defaultValue={75} className="w-full h-1" />
                      </div>
                    </div>

                    {/* Step buttons */}
                    <div className="flex gap-[2px] flex-1 overflow-x-auto pb-1 md:pb-0">
                      {Array(16).fill(0).map((_, sIdx) => {
                        const isActive = tracks[tIdx]?.[sIdx];
                        const isCurrent = currentStep === sIdx;
                        const isDownbeat = sIdx % 4 === 0;

                        return (
                          <button
                            key={sIdx}
                            onClick={() => toggleStep(tIdx, sIdx)}
                            className="relative flex-1 min-w-[20px] h-8 md:h-10 flex-shrink-0 border-2 transition-none"
                            style={{
                              backgroundColor: isActive ? tColor : isDownbeat ? '#1a1a3a' : '#0a0a1a',
                              borderColor: isActive ? '#fff' : isCurrent ? '#ffffff' : '#444466',
                              boxShadow: isActive
                                ? `0 0 10px ${tColor}, inset 2px 2px 0 rgba(255,255,255,0.4)`
                                : isCurrent
                                  ? '0 0 8px #ffffff44'
                                  : 'inset 2px 2px 0 rgba(0,0,0,0.5)',
                              outline: isCurrent ? '2px solid #fff' : 'none',
                              outlineOffset: '-1px',
                            }}
                          >
                            <div
                              className="absolute top-[2px] left-1/2 -translate-x-1/2 w-2 h-[2px]"
                              style={{ background: isActive ? '#fff' : '#000' }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 flex justify-between items-center text-[7px] text-[#444466]">
        <button onClick={() => setLocation('/map')} className="text-[#0050ff] hover:text-[#00ffff] text-[8px]">
          ← BACK TO MAP
        </button>
        <div>BEATWORLD V1.0 · PIXEL ENGINE ACTIVE</div>
        <div>MEM: 640K OK</div>
      </footer>
    </div>
  );
}
