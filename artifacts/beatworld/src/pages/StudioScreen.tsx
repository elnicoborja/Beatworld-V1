import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useParams } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';
import { CITIES } from '@/lib/game-data';
import { audio } from '@/lib/audio';

const INSTRUMENT_COLORS = [
  '#ff00ff', '#00ffff', '#ffff00', '#ff8800', '#00ff00', '#ff0000',
  '#ff00c8', '#0050ff', '#aaffaa', '#ffaaaa', '#aaaaff', '#ffffaa',
  '#ff6600', '#00ffcc', '#ff0066', '#66ffff',
];

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

  return (
    <div
      className="relative flex flex-col w-screen h-screen bg-[#0a0a1a] text-[#e0e0ff] uppercase overflow-hidden select-none"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
      onClick={() => { if (!audioReady) ensureAudio(); }}
    >
      <style>{`
        .scanlines-st {
          background: repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px);
          pointer-events: none;
        }
        .grid-st {
          background-image: linear-gradient(rgba(255,0,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,255,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }
        input[type=range].bpm-slider { -webkit-appearance: none; width: 100%; background: transparent; }
        input[type=range].bpm-slider::-webkit-slider-thumb {
          -webkit-appearance: none; height: 12px; width: 12px; background: #ff00ff; cursor: pointer; margin-top: -4px;
          box-shadow: 0 0 8px #ff00ff;
        }
        input[type=range].bpm-slider::-webkit-slider-runnable-track { width: 100%; height: 4px; cursor: pointer; background: #444466; }
        .step-cell:hover { filter: brightness(1.3); }
        .step-cell:active { filter: brightness(2); }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .blinking { animation: blink 1s step-end infinite; }
      `}</style>

      {/* Background SVG Studio */}
      <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none flex items-end justify-center">
        <svg width="100%" height="60%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" style={{ imageRendering: 'pixelated' }}>
          <rect x="50" y="100" width="300" height="100" fill="#444466" stroke="#0a0a1a" strokeWidth="2" />
          <rect x="60" y="110" width="280" height="80" fill="#111133" />
          {[...Array(12)].map((_, i) => (
            <g key={i} transform={`translate(${80 + i * 20}, 120)`}>
              <rect x="0" y="0" width="4" height="60" fill="#0a0a1a" />
              <rect x="-2" y={10 + (i % 3) * 10} width="8" height="12" fill="#e0e0ff" />
            </g>
          ))}
          <rect x="20" y="40" width="60" height="80" fill="#111133" stroke="#ff00ff" strokeWidth="2" />
          <circle cx="50" cy="70" r="15" fill="#0a0a1a" />
          <circle cx="50" cy="100" r="8" fill="#0a0a1a" />
          <rect x="320" y="40" width="60" height="80" fill="#111133" stroke="#00ffff" strokeWidth="2" />
          <circle cx="350" cy="70" r="15" fill="#0a0a1a" />
          <circle cx="350" cy="100" r="8" fill="#0a0a1a" />
          <rect x="150" y="20" width="100" height="30" fill="none" stroke="#ffff00" strokeWidth="2" />
          <text x="200" y="42" fill="#ffff00" fontSize="16" fontFamily="'Press Start 2P'" textAnchor="middle">ON AIR</text>
        </svg>
      </div>

      <div className="absolute inset-0 z-10 grid-st" />
      <div className="absolute inset-0 z-20 scanlines-st" />

      <div className="relative z-30 flex flex-col h-full w-full">
        <button
          onClick={() => setLocation('/map')}
          className="absolute top-2 left-2 text-[#00ffff] text-[8px] z-50 hover:text-[#ffffff] bg-[#0a0a1a] p-1 border border-[#00ffff]"
        >
          ← MAP
        </button>

        {/* HEADER BAR */}
        <header className="bg-[#111133] border-b-2 border-[#ff00ff] px-6 py-3 flex flex-col md:flex-row justify-between items-center gap-4 z-40">
          <div className="flex flex-col items-center md:items-start ml-0 md:ml-12 mt-4 md:mt-0">
            <div className="text-[#ff00ff] text-[12px] mb-2" style={{ textShadow: '0 0 8px #ff00ff' }}>
              {city.emoji} {city.name.toUpperCase()} STUDIO
            </div>
            <div className="flex items-center gap-3 text-[#00ffff] text-[8px]">
              <span>{city.genre.toUpperCase()}</span>
              <span className="text-[#444466]">|</span>
              <span>{city.instruments.length} TRACKS</span>
              <span className="text-[#444466]">|</span>
              <span className="flex items-center gap-1">
                BPM: <span className="text-[#ffff00] text-[10px]" style={{ textShadow: '0 0 6px #ffff00' }}>{bpm}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col w-[200px] gap-2">
            <div className="flex justify-between text-[#444466] text-[7px]">
              <span>60</span>
              <span className="text-[#00ffff]">TEMPO</span>
              <span>200</span>
            </div>
            <input
              type="range" min="60" max="200" value={bpm}
              onChange={e => setBpm(parseInt(e.target.value))}
              className="bpm-slider"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handlePlayToggle}
              className={`px-4 py-3 text-[9px] text-[#0a0a1a] border-2 outline-none active:translate-y-[2px] active:translate-x-[2px] transition-none w-[100px] ${isPlaying ? 'bg-[#ff0000] border-[#ff0000]' : 'bg-[#ff00ff] border-[#ff00ff]'}`}
              style={{ boxShadow: '3px 3px 0px #000' }}
            >
              {isPlaying ? '■ STOP' : '▶ PLAY'}
            </button>
            <button
              onClick={handleFinish}
              className="px-4 py-3 bg-[#00ffff] text-[#0a0a1a] border-2 border-[#00ffff] text-[9px] outline-none hover:brightness-110 active:translate-y-[2px] active:translate-x-[2px] transition-none"
              style={{ boxShadow: '3px 3px 0px #000' }}
            >
              ✓ FINISH
            </button>
          </div>
        </header>

        {/* BEAT RULER */}
        <div className="bg-[#0a0a1a] border-b border-[#ff00ff] border-opacity-40 flex px-6 py-1 z-30">
          <div className="w-[140px] flex-shrink-0" />
          <div className="flex flex-grow justify-between gap-[2px]">
            {[...Array(16)].map((_, i) => (
              <div key={i} className="flex-1 flex justify-center items-center min-w-[28px]">
                {i % 4 === 0 ? (
                  <span className="text-[#ff00ff] text-[7px]">{i + 1}</span>
                ) : (
                  <span className="text-[#444466] text-[7px]">·</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SEQUENCER GRID */}
        <main className="flex-1 overflow-y-auto px-6 py-4 z-30 flex flex-col gap-1">
          {city.instruments.map((inst, rowIdx) => {
            const instColor = INSTRUMENT_COLORS[rowIdx % INSTRUMENT_COLORS.length];
            return (
              <div key={inst.id} className="flex items-center h-[44px] gap-2">
                <div className="w-[140px] flex-shrink-0 flex items-center gap-2 overflow-hidden">
                  <div className="w-2 h-2 flex-shrink-0" style={{ backgroundColor: instColor, boxShadow: `0 0 6px ${instColor}` }} />
                  <span className="text-[#ffffff] text-[7px] truncate">{inst.name.toUpperCase()}</span>
                </div>

                <div className="flex flex-grow justify-between gap-[2px] h-full items-center">
                  {Array(16).fill(0).map((_, stepIdx) => {
                    const isActive = tracks[rowIdx]?.[stepIdx];
                    const isDownbeat = stepIdx % 4 === 0;
                    const isCurrent = isPlaying && currentStep === stepIdx;

                    const style: React.CSSProperties = {};
                    if (isActive) {
                      style.backgroundColor = instColor;
                      style.border = `2px solid ${instColor}`;
                      style.boxShadow = `inset 0 0 6px rgba(255,255,255,0.3), 0 0 8px ${instColor}`;
                    }
                    if (isCurrent) {
                      style.outline = '2px solid #ffffff';
                      style.boxShadow = (style.boxShadow ? style.boxShadow + ', ' : '') + '0 0 12px #ffffff';
                      style.zIndex = 10;
                    }

                    return (
                      <button
                        key={stepIdx}
                        onClick={() => toggleStep(rowIdx, stepIdx)}
                        className={`step-cell flex-1 h-full min-w-[28px] min-h-[28px] max-w-[44px] relative transition-none ${
                          isActive ? '' : isDownbeat ? 'bg-[#151530]' : 'bg-[#0d0d22]'
                        } ${isActive ? '' : 'border border-[#1a1a3a]'}`}
                        style={style}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </main>

        {/* STATUS BAR */}
        <footer className="bg-[#111133] border-t-2 border-[#ff00ff] px-6 py-2 flex justify-between items-center z-40 mt-auto flex-shrink-0">
          <div className="text-[7px]">
            {audioReady ? (
              <span className="text-[#00ff00]">◉ AUDIO READY</span>
            ) : (
              <span className="text-[#ffff00] blinking">○ CLICK TO ENABLE AUDIO</span>
            )}
          </div>
          <div className="text-[#ff00ff] text-[7px]">
            {isPlaying ? (
              <span>► PLAYING · STEP {currentStep + 1}/16</span>
            ) : (
              <span className="text-[#444466]">■ STOPPED</span>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
