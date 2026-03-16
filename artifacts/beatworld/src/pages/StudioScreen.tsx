import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useParams } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';
import { CITIES } from '@/lib/game-data';
import { audio } from '@/lib/audio';
import IsometricSprite from '@/components/IsometricSprite';

const C = {
  skyBlue: '#87ceeb', cream: '#fff8e7', hotPink: '#ff3399', magenta: '#cc0066',
  yellow: '#ffee00', cobalt: '#0050cc', brick: '#cc3300', lime: '#44cc00',
  orange: '#ff8800', teal: '#00aaaa', purple: '#6600cc', black: '#111111',
  gray: '#888899', asphalt: '#334455',
};

function shade(col: string, amt: number) {
  const c = col.startsWith('#') ? col.slice(1) : col;
  const num = parseInt(c, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amt));
  return '#' + ((b | (g << 8) | (r << 16)) >>> 0).toString(16).padStart(6, '0');
}

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
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      intervalRef.current = null;
      setCurrentStep(-1);
    }
    return () => { if (intervalRef.current !== null) clearInterval(intervalRef.current); };
  }, [isPlaying, bpm, playStep]);

  const handlePlayToggle = async () => { await ensureAudio(); setIsPlaying(p => !p); };

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
    if (['kick', 'snare', 'hihat', 'perc'].includes(inst.type)) audio.playDrum(inst.type, t);
    else audio.playSynth(inst.type as any, stepIdx, t);
  };

  const handleFinish = () => {
    if (!cityId) return;
    saveTrack(cityId, tracks);
    setLocation(`/performance/${cityId}`);
  };

  if (!city) return <div className="text-white p-8">City not found</div>;

  const charData = state.character || {};

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ backgroundColor: C.skyBlue, fontFamily: '"Press Start 2P", monospace', color: C.black }}
    >
      <style>{`
        .iso-grid {
          position:absolute;inset:0;
          background-image: linear-gradient(30deg,rgba(17,17,17,0.08) 1px,transparent 1px), linear-gradient(150deg,rgba(17,17,17,0.08) 1px,transparent 1px);
          background-size:32px 18px; pointer-events:none; z-index:0;
        }
        .halftone-overlay {
          position:absolute;inset:0;
          background-image:radial-gradient(circle,rgba(17,17,17,0.12) 1px,transparent 1px);
          background-size:6px 6px; pointer-events:none;
        }
        .graffiti-title {
          font-size:32px;
          background:linear-gradient(135deg,#ffaacc 0%,#ff3399 60%,#cc0066 100%);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          filter:drop-shadow(3px 4px 0px #cc0066) drop-shadow(2px 2px 0px #111) drop-shadow(-2px -2px 0px #111) drop-shadow(0px 8px 0px rgba(102,0,204,0.5));
          line-height:1.2; transform:rotate(-2deg);
        }
        .bw-panel { background-color:${C.cream}; border:2px solid ${C.black}; box-shadow:4px 4px 0px ${C.black}; position:relative; }
        .bw-btn {
          background-color:${C.hotPink}; color:${C.cream}; border:2px solid ${C.black};
          box-shadow:inset 0 2px 0 rgba(255,255,255,0.4),inset 0 -2px 0 rgba(0,0,0,0.2),3px 3px 0px ${C.black};
          text-transform:uppercase; cursor:pointer;
        }
        .bw-btn:hover { transform:translate(-1px,-1px); filter:brightness(1.1); box-shadow:inset 0 2px 0 rgba(255,255,255,0.4),inset 0 -2px 0 rgba(0,0,0,0.2),4px 4px 0px ${C.black}; }
        .bw-btn:active { transform:translate(2px,2px); box-shadow:inset 0 2px 0 rgba(255,255,255,0.4),inset 0 -2px 0 rgba(0,0,0,0.2),1px 1px 0px ${C.black}; }
        .seq-cell {
          width:100%; aspect-ratio:1; background-color:#1a3a6a; border:1px solid #0d2244;
          box-shadow:inset 1px 1px 0 #2a5a9a, inset -1px -1px 0 #0a1a3a; cursor:pointer; position:relative;
        }
        .seq-cell.active { background-color:#ddaa00; border:1px solid #aa8800; box-shadow:inset 0 0 4px #ffdd44; }
        .seq-cell.current { outline:2px solid #ffffff; box-shadow:0 0 8px #ffffff, inset 0 0 4px #ffdd44; z-index:10; }
        .led-text { color:${C.yellow}; text-shadow:0 0 6px ${C.yellow}; font-variant-numeric:tabular-nums; }
      `}</style>

      <svg className="hidden"><filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter></svg>
      <div className="iso-grid" />
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.08] mix-blend-multiply" style={{ filter: 'url(#grain)' }} />

      <div className="relative z-10 flex flex-col md:flex-row gap-6 p-4 md:p-8 max-w-7xl mx-auto min-h-screen">

        {/* LEFT: Profile & Stats */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
          <div className="mb-4 text-center md:text-left">
            <h1 className="graffiti-title m-0">BEAT<br/>WORLD</h1>
          </div>

          <div className="bw-panel p-4 flex flex-col items-center">
            <div className="halftone-overlay" />
            <div className="relative z-10 w-full">
              <div className="bg-[#87ceeb] border-2 border-[#111] h-48 w-full flex items-center justify-center relative overflow-hidden mb-4" style={{ boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.1)' }}>
                <IsometricSprite
                  skinTone={charData.skinTone || '#f1c27d'}
                  skinShadow={charData.skinTone ? shade(charData.skinTone, -30) : '#c8903a'}
                  hairColor={charData.hairColor || '#111111'}
                  hairStyle={(charData.hairStyle || 'fade').toUpperCase()}
                  topColor={charData.topColor || '#ff3399'}
                  pantsColor={charData.pantsColor || '#0050cc'}
                  accessory={(charData.accessory || 'none').toUpperCase()}
                  angle={45}
                  size={100}
                />
              </div>

              <div className="bg-[#111] text-[#fff8e7] p-2 border-2 border-[#111] mb-2 text-center text-[10px]">
                {state.playerName}
              </div>
              <div className="flex justify-between items-center text-[8px] border-b-2 border-[#111] pb-2 mb-2">
                <span className="text-[#888899]">LEVEL</span>
                <span className="text-[#cc0066]">{city.level}. {city.name.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center text-[8px] border-b-2 border-[#111] pb-2 mb-2">
                <span className="text-[#888899]">GENRE</span>
                <span className="text-[#0050cc]">{city.genre.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center text-[8px]">
                <span className="text-[#888899]">CLOUT</span>
                <span className="led-text text-[10px]">{state.clout}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setLocation('/map')}
            className="bw-btn px-4 py-3 text-[8px] w-full"
            style={{ backgroundColor: C.cobalt }}
          >
            ← BACK TO MAP
          </button>
        </div>

        {/* RIGHT: Sequencer Hardware */}
        <div className="flex-1 flex flex-col">
          <div className="bg-[#0050cc] border-2 border-[#111] p-2 md:p-4 flex-1 flex flex-col" style={{ boxShadow: '8px 8px 0px #111' }}>

            {/* Dashboard */}
            <div className="bg-[#fff8e7] border-2 border-[#111] p-3 mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="halftone-overlay" />
              <div className="relative z-10 flex gap-4 w-full md:w-auto">
                <button
                  onClick={handlePlayToggle}
                  className="bw-btn px-6 py-4 text-[10px] w-full md:w-auto"
                  style={{ backgroundColor: isPlaying ? C.brick : C.lime, borderTopColor: isPlaying ? '#ff6666' : '#88ff44' }}
                >
                  {isPlaying ? 'STOP ■' : 'PLAY ▶'}
                </button>
                <button
                  onClick={handleFinish}
                  className="bw-btn px-6 py-4 text-[10px] w-full md:w-auto"
                  style={{ backgroundColor: C.teal }}
                >
                  FINISH ✓
                </button>
              </div>

              <div className="relative z-10 flex items-center gap-4 bg-[#111] p-2 border-2 border-[#888899]">
                <span className="text-[#888899] text-[8px]">TEMPO</span>
                <button onClick={() => setBpm(b => Math.max(60, b - 1))} className="text-[#ff3399] hover:text-[#fff]">◀</button>
                <span className="led-text text-[14px] w-12 text-center">{bpm}</span>
                <button onClick={() => setBpm(b => Math.min(200, b + 1))} className="text-[#ff3399] hover:text-[#fff]">▶</button>
              </div>

              <div className="relative z-10 text-[8px] flex items-center gap-2">
                <div className={`w-2 h-2 ${audioReady ? 'bg-[#44cc00]' : 'bg-[#ffee00]'}`} style={{ boxShadow: audioReady ? '0 0 6px #44cc00' : '0 0 6px #ffee00' }} />
                <span style={{ color: audioReady ? C.lime : C.orange }}>{audioReady ? 'AUDIO OK' : 'CLICK TO ARM'}</span>
              </div>
            </div>

            {/* Sequencer Grid */}
            <div className="bg-[#0d1a33] border-2 border-[#111] p-2 flex-1 flex flex-col gap-1">
              {/* Beat ruler */}
              <div className="flex pl-[80px] md:pl-[120px] mb-2">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="flex-1 text-center text-[6px] md:text-[8px] text-[#888899]">
                    {i % 4 === 0 ? <span className="text-[#ff3399]">{i + 1}</span> : '·'}
                  </div>
                ))}
              </div>

              {/* Tracks */}
              {city.instruments.map((inst, trackIdx) => (
                <div key={inst.id} className={`flex items-stretch gap-2 p-1 ${trackIdx % 2 === 0 ? 'bg-[#111f3a]' : 'bg-[#0d1a33]'}`}>
                  <div className="w-[70px] md:w-[110px] flex-shrink-0 bg-[#003399] border border-[#111] flex items-center px-2" style={{ boxShadow: 'inset 1px 1px 0 #0050cc' }}>
                    <span className="text-[#fff8e7] text-[6px] md:text-[8px] truncate">{inst.name.toUpperCase()}</span>
                  </div>
                  <div className="flex flex-1 gap-1">
                    {Array(16).fill(0).map((_, stepIdx) => {
                      const isActive = tracks[trackIdx]?.[stepIdx];
                      const isCurrent = isPlaying && currentStep === stepIdx;
                      return (
                        <div
                          key={stepIdx}
                          onClick={() => toggleStep(trackIdx, stepIdx)}
                          className={`seq-cell ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-right text-[#fff8e7] text-[8px] opacity-80">
              {city.emoji} {city.venue.toUpperCase()} // VOLT-909
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
