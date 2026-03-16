import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useParams } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';
import { CITIES } from '@/lib/game-data';
import { audio } from '@/lib/audio';

const C = {
  bgDeep: '#0a0a1e',
  panelBg: '#121228',
  cobalt: '#003399',
  cobaltDark: '#002266',
  cobaltLight: '#3366cc',
  amber: '#ffaa00',
  gold: '#ddaa00',
  goldLight: '#ffdd44',
  goldDark: '#aa7700',
  stepOff: '#1a2a4a',
  stepOffBeat: '#1e3050',
  stepOn: '#0066ff',
  stepOnBright: '#3399ff',
  pink: '#ff3399',
  cyan: '#00ffff',
  yellow: '#ffee00',
  orange: '#ff8800',
  red: '#cc3300',
  redBright: '#ff0000',
  green: '#44cc00',
  black: '#111111',
  grayDark: '#334455',
  grayMid: '#888899',
  white: '#ffffff',
  muteBg: '#442200',
  muteActive: '#ff8800',
  soloBg: '#002244',
  soloActive: '#00ccff',
};

export default function StudioScreen() {
  const { cityId } = useParams();
  const [, setLocation] = useLocation();
  const { state, saveTrack } = useGameState();
  const city = cityId ? CITIES[cityId] : null;

  const channelCount = city?.numInstruments || 4;
  const channels = city ? city.instruments.slice(0, channelCount) : [];

  const [tracks, setTracks] = useState<boolean[][]>(() => {
    if (cityId && state.tracks[cityId]) return state.tracks[cityId];
    return Array(channelCount).fill(null).map(() => Array(16).fill(false));
  });
  const tracksRef = useRef(tracks);
  useEffect(() => { tracksRef.current = tracks; }, [tracks]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(city?.defaultBpm || 120);
  const [currentStep, setCurrentStep] = useState(-1);
  const [audioReady, setAudioReady] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  const [volumes, setVolumes] = useState<number[]>(Array(channelCount).fill(80));
  const [mutes, setMutes] = useState<boolean[]>(Array(channelCount).fill(false));
  const [solos, setSolos] = useState<boolean[]>(Array(channelCount).fill(false));
  const [filterValues, setFilterValues] = useState<number[]>(Array(channelCount).fill(100));

  const volumesRef = useRef(volumes);
  const mutesRef = useRef(mutes);
  const solosRef = useRef(solos);
  const filterRef = useRef(filterValues);
  useEffect(() => { volumesRef.current = volumes; }, [volumes]);
  useEffect(() => { mutesRef.current = mutes; }, [mutes]);
  useEffect(() => { solosRef.current = solos; }, [solos]);
  useEffect(() => { filterRef.current = filterValues; }, [filterValues]);

  const [showProducer, setShowProducer] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState(0);

  const ensureAudio = useCallback(async () => {
    await audio.init();
    setAudioReady(audio.isReady());
  }, []);

  const playStep = useCallback((step: number) => {
    if (!city) return;
    const time = audio.getCurrentTime();
    const hasSolo = solosRef.current.some(s => s);
    city.instruments.forEach((inst, idx) => {
      if (idx >= channelCount) return;
      if (mutesRef.current[idx]) return;
      if (hasSolo && !solosRef.current[idx]) return;
      if (!tracksRef.current[idx]?.[step]) return;
      const vol = volumesRef.current[idx] / 100;
      const fVal = filterRef.current[idx];
      const filterFreq = fVal < 100 ? 200 + (fVal / 100) * 19800 : undefined;
      if (['kick', 'snare', 'hihat', 'perc'].includes(inst.type)) {
        audio.playDrum(inst.type, time, vol, filterFreq);
      } else {
        audio.playSynth(inst.type as any, step, time, vol, filterFreq);
      }
    });
  }, [city, channelCount]);

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
    const vol = volumes[trackIdx] / 100;
    const t = audio.getCurrentTime();
    if (['kick', 'snare', 'hihat', 'perc'].includes(inst.type)) audio.playDrum(inst.type, t, vol);
    else audio.playSynth(inst.type as any, stepIdx, t, vol);
  };

  const handleFinish = () => {
    if (!cityId) return;
    saveTrack(cityId, tracks);
    setLocation(`/performance/${cityId}`);
  };

  const toggleMute = (idx: number) => {
    const m = [...mutes];
    m[idx] = !m[idx];
    setMutes(m);
  };

  const toggleSolo = (idx: number) => {
    const s = [...solos];
    s[idx] = !s[idx];
    setSolos(s);
  };

  if (!city) return <div className="text-white p-8">City not found</div>;

  const producer = city.guestProducer;
  const hasSolo = solos.some(s => s);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none uppercase font-press-start flex flex-col"
      style={{ backgroundColor: C.bgDeep, color: C.white }}
      onClick={() => { if (!audioReady) ensureAudio(); }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .font-press-start { font-family: 'Press Start 2P', monospace; }
        .grain-overlay {
          position: absolute; inset: 0; pointer-events: none; z-index: 50; opacity: 0.06;
          mix-blend-mode: screen;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        .iso-bevel {
          box-shadow: inset 2px 2px 0 rgba(255,255,255,0.3), inset -2px -2px 0 rgba(0,0,0,0.4), 2px 2px 0 ${C.black};
        }
        .iso-bevel:active {
          box-shadow: inset 2px 2px 0 rgba(0,0,0,0.4), inset -2px -2px 0 rgba(255,255,255,0.2);
          transform: translate(2px, 2px);
        }
        .led-text { color: ${C.amber}; text-shadow: 0 0 8px ${C.amber}; }
        input[type=range].bpm-slider {
          -webkit-appearance: none; background: ${C.grayDark}; height: 6px;
          border: 1px solid ${C.black}; width: 100px;
        }
        input[type=range].bpm-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 12px; height: 16px; background: ${C.gold};
          border: 1px solid ${C.black};
          box-shadow: inset 1px 1px 0 ${C.goldLight}, inset -1px -1px 0 ${C.goldDark};
          cursor: pointer;
        }
        input[type=range].vol-slider {
          -webkit-appearance: none; background: #222; height: 4px; width: 60px;
        }
        input[type=range].vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none; width: 10px; height: 18px; background: ${C.grayMid};
          border: 1px solid ${C.black};
          box-shadow: inset 0 8px 0 rgba(255,255,255,0.2), inset 0 -2px 0 rgba(0,0,0,0.4);
          cursor: pointer;
        }
        ::-webkit-scrollbar { height: 10px; width: 10px; }
        ::-webkit-scrollbar-track { background: ${C.bgDeep}; }
        ::-webkit-scrollbar-thumb { background: ${C.cobalt}; border: 2px solid ${C.black}; }
      `}</style>

      <div className="grain-overlay" />

      <header className="relative z-30 flex justify-between items-center px-[16px] py-[10px] border-b-[3px] border-[#111] flex-shrink-0" style={{ backgroundColor: C.cobalt }}>
        <div className="flex items-center gap-[12px]">
          <div className="text-[9px] text-white drop-shadow-[2px_2px_0_#111]">
            {city.emoji} {city.name.toUpperCase()}
          </div>
          <span className="bg-[#002266] px-[6px] py-[3px] border border-[#111] text-[7px] text-[#87ceeb]">{city.genre.toUpperCase()}</span>
        </div>

        <div className="flex items-center gap-[8px]">
          <span className="text-[7px] text-[#87ceeb]">BPM</span>
          <span className="led-text text-[10px]">{bpm.toString().padStart(3, '0')}</span>
          <input type="range" min="60" max="200" value={bpm} onChange={(e) => setBpm(parseInt(e.target.value))} className="bpm-slider" />
        </div>

        <div className="flex gap-[8px]">
          <button onClick={handlePlayToggle} className="px-[12px] py-[8px] text-[7px] text-white border-[2px] border-[#111] iso-bevel outline-none transition-none" style={{ backgroundColor: isPlaying ? C.redBright : C.green }}>
            {isPlaying ? '■ STOP' : '▶ PLAY'}
          </button>
          <button onClick={handleFinish} className="px-[12px] py-[8px] text-[7px] text-white border-[2px] border-[#111] iso-bevel outline-none transition-none" style={{ backgroundColor: C.cobaltLight }}>
            FINISH ►
          </button>
          <button onClick={() => setLocation('/map')} className="px-[12px] py-[8px] text-[7px] text-white border-[2px] border-[#111] iso-bevel outline-none transition-none" style={{ backgroundColor: C.grayDark }}>
            ← MAP
          </button>
        </div>
      </header>

      <main className="relative z-20 flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-auto p-[12px]">
          <div className="flex mb-[2px]">
            <div className="w-[120px] flex-shrink-0" />
            <div className="flex-1 flex gap-[2px] min-w-[512px]">
              {[...Array(16)].map((_, i) => {
                const isBeat = i % 4 === 0;
                const beatNum = Math.floor(i / 4) + 1;
                const colors = [C.pink, C.cyan, C.yellow, C.orange];
                return (
                  <div key={`ruler-${i}`} className="flex-1 flex justify-center items-center text-[7px] py-[4px]" style={{ color: isBeat ? colors[beatNum - 1] : '#334455' }}>
                    {isBeat ? beatNum : '·'}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-[2px] bg-[#0a0a18] border-2 border-[#222] p-[4px]" style={{ boxShadow: '4px 4px 0 #000' }}>
            {tracks.map((track, tIdx) => {
              const inst = channels[tIdx];
              if (!inst) return null;
              const isMuted = mutes[tIdx];
              const isSoloed = solos[tIdx];
              const isActive = !isMuted && (!hasSolo || isSoloed);
              const isSelected = selectedTrack === tIdx;

              return (
                <div key={`track-${tIdx}`} className="flex gap-[2px] items-center" style={{ opacity: isActive ? 1 : 0.4 }}>
                  <div
                    className="w-[120px] flex-shrink-0 flex items-center gap-[4px] px-[4px] py-[2px] border border-[#222] cursor-pointer"
                    style={{ backgroundColor: isSelected ? '#1a2a4a' : '#0d0d20' }}
                    onClick={() => setSelectedTrack(tIdx)}
                  >
                    <button onClick={(e) => { e.stopPropagation(); toggleMute(tIdx); }} className="px-[4px] py-[2px] text-[5px] border border-[#111]" style={{ backgroundColor: isMuted ? C.muteActive : C.muteBg, color: isMuted ? '#000' : '#886644' }}>
                      M
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toggleSolo(tIdx); }} className="px-[4px] py-[2px] text-[5px] border border-[#111]" style={{ backgroundColor: isSoloed ? C.soloActive : C.soloBg, color: isSoloed ? '#000' : '#446688' }}>
                      S
                    </button>
                    <span className="text-[5px] truncate flex-1" style={{ color: isSelected ? C.cyan : '#778899' }}>{inst.name.toUpperCase()}</span>
                  </div>

                  <div className="flex-1 flex gap-[2px] min-w-[512px]">
                    {track.map((isOn, sIdx) => {
                      const isDownbeat = sIdx % 4 === 0;
                      const isCurrent = isPlaying && currentStep === sIdx;
                      let bg = isOn ? C.stepOn : (isDownbeat ? C.stepOffBeat : C.stepOff);
                      if (isCurrent && isOn) bg = C.stepOnBright;
                      else if (isCurrent) bg = '#2a3a5a';
                      return (
                        <button
                          key={`step-${tIdx}-${sIdx}`}
                          onClick={() => toggleStep(tIdx, sIdx)}
                          className="flex-1 h-[18px] border border-[#0a0a14] outline-none transition-none relative"
                          style={{
                            backgroundColor: bg,
                            boxShadow: isOn ? `inset 1px 1px 0 ${C.stepOnBright}, 0 0 4px ${C.stepOn}` : `inset 1px 1px 0 rgba(255,255,255,0.05)`,
                          }}
                        >
                          {isCurrent && <div className="absolute inset-0 border border-white opacity-60" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-[8px] mt-[12px]">
            <div className="flex-1 bg-[#0d0d20] border-2 border-[#222] p-[8px]" style={{ boxShadow: '3px 3px 0 #000' }}>
              <div className="text-[6px] text-[#556677] mb-[6px] border-b border-[#222] pb-[4px]">
                CH {selectedTrack + 1}: {channels[selectedTrack]?.name.toUpperCase() || '---'}
              </div>
              <div className="flex gap-[12px] items-end">
                <div className="flex flex-col items-center gap-[4px]">
                  <span className="text-[5px] text-[#556677]">VOL</span>
                  <input type="range" min="0" max="100" value={volumes[selectedTrack]} onChange={(e) => { const v = [...volumes]; v[selectedTrack] = parseInt(e.target.value); setVolumes(v); }} className="vol-slider" />
                  <span className="text-[6px] led-text">{volumes[selectedTrack]}</span>
                </div>
                <div className="flex flex-col items-center gap-[4px]">
                  <span className="text-[5px] text-[#556677]">FILTER</span>
                  <input type="range" min="0" max="100" value={filterValues[selectedTrack]} onChange={(e) => { const f = [...filterValues]; f[selectedTrack] = parseInt(e.target.value); setFilterValues(f); }} className="vol-slider" />
                  <span className="text-[6px] led-text">{filterValues[selectedTrack]}</span>
                </div>
                <div className="flex gap-[6px]">
                  <button onClick={() => toggleMute(selectedTrack)} className="px-[8px] py-[6px] text-[6px] border-2 border-[#111] iso-bevel" style={{ backgroundColor: mutes[selectedTrack] ? C.muteActive : C.muteBg, color: mutes[selectedTrack] ? '#000' : '#886644' }}>
                    MUTE
                  </button>
                  <button onClick={() => toggleSolo(selectedTrack)} className="px-[8px] py-[6px] text-[6px] border-2 border-[#111] iso-bevel" style={{ backgroundColor: solos[selectedTrack] ? C.soloActive : C.soloBg, color: solos[selectedTrack] ? '#000' : '#446688' }}>
                    SOLO
                  </button>
                </div>
              </div>
            </div>

            {showProducer && producer && (
              <div className="w-[220px] bg-[#0d0d20] border-2 border-[#222] p-[8px] flex gap-[8px] relative" style={{ boxShadow: '3px 3px 0 #000' }}>
                <button onClick={() => setShowProducer(false)} className="absolute top-[2px] right-[4px] text-[6px] text-[#556677] hover:text-white">X</button>
                <svg viewBox="0 0 24 40" width="36" height="60" style={{ imageRendering: 'pixelated', flexShrink: 0 }}>
                  <rect x="6" y="2" width="12" height="10" fill={producer.skinTone} />
                  <rect x="8" y="5" width="3" height="2" fill="#111" />
                  <rect x="13" y="5" width="3" height="2" fill="#111" />
                  <rect x="7" y="0" width="10" height="3" fill="#111" />
                  <rect x="4" y="12" width="16" height="14" fill={producer.topColor} />
                  <rect x="2" y="14" width="4" height="10" fill={producer.topColor} />
                  <rect x="18" y="14" width="4" height="10" fill={producer.topColor} />
                  <rect x="2" y="23" width="4" height="3" fill={producer.skinTone} />
                  <rect x="18" y="23" width="4" height="3" fill={producer.skinTone} />
                  <rect x="6" y="26" width="12" height="10" fill="#334455" />
                  <rect x="4" y="36" width="7" height="4" fill="#111" />
                  <rect x="13" y="36" width="7" height="4" fill="#111" />
                  {producer.accessory === 'headphones' && (
                    <>
                      <rect x="4" y="1" width="3" height="6" fill="#333" />
                      <rect x="17" y="1" width="3" height="6" fill="#333" />
                      <rect x="5" y="0" width="14" height="2" fill="#333" />
                    </>
                  )}
                  {producer.accessory === 'bandana' && (
                    <rect x="6" y="1" width="12" height="3" fill="#cc3300" />
                  )}
                </svg>
                <div className="flex-1 flex flex-col gap-[4px]">
                  <div className="text-[6px] text-[#ff3399]">{producer.name}</div>
                  <div className="bg-[#1a1a2e] border border-[#334455] p-[4px] text-[5px] text-[#87ceeb] leading-[8px] relative">
                    <div className="absolute -left-[4px] top-[6px] w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[4px] border-r-[#334455]" />
                    "{producer.quote}"
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="relative z-30 bg-[#111] border-t-[3px] border-[#222] px-[16px] py-[6px] flex justify-between items-center flex-shrink-0">
        <div className="text-[6px]">
          {audioReady ? (
            <span className="text-[#44cc00] drop-shadow-[0_0_4px_#44cc00]">◉ AUDIO READY</span>
          ) : (
            <span className="text-[#ffee00] animate-pulse">○ CLICK TO ENABLE</span>
          )}
        </div>
        <div className="text-[6px] text-[#87ceeb]">
          {city.emoji} {city.venue.toUpperCase()} // HAMMERHEAD-909
        </div>
        <div className="text-[6px]">
          {isPlaying ? (
            <span className="text-[#ff3399] drop-shadow-[0_0_4px_#ff3399]">► STEP {(currentStep + 1).toString().padStart(2, '0')}/16</span>
          ) : (
            <span className="text-[#888899]">■ STOPPED</span>
          )}
        </div>
      </footer>
    </div>
  );
}
