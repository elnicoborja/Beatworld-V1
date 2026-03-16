import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';
import { CITIES, CITIES_LIST } from '@/lib/game-data';
import { audio } from '@/lib/audio';

const C = {
  winampBg: '#232323',
  winampBorder: '#4a6e4a',
  winampTitle: '#00ff00',
  winampText: '#00cc00',
  winampDark: '#0a0a0a',
  winampButton: '#555555',
  hotPink: '#ff3399',
  cobalt: '#0050cc',
  yellow: '#ffee00',
  black: '#111111',
  cream: '#fff8e7',
  cyan: '#00ffff',
  green: '#44cc00',
};

function WinampPlayer({ tracks, completedCities }: { tracks: Record<string, boolean[][]>; completedCities: string[] }) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const playIntervalRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  const playableCities = completedCities.filter(id => tracks[id]);

  const handlePlay = useCallback(async () => {
    if (playableCities.length === 0) return;
    await audio.init();
    const cityId = playableCities[currentTrack % playableCities.length];
    const city = CITIES[cityId];
    const trackData = tracks[cityId];
    if (!city || !trackData) return;

    setIsPlaying(true);
    setElapsed(0);
    stepRef.current = 0;

    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const bpm = city.defaultBpm || 120;
    playIntervalRef.current = window.setInterval(() => {
      const step = stepRef.current;
      const time = audio.getCurrentTime();
      city.instruments.forEach((inst, idx) => {
        if (trackData[idx]?.[step]) {
          if (['kick', 'snare', 'hihat', 'perc'].includes(inst.type)) {
            audio.playDrum(inst.type, time);
          } else {
            audio.playSynth(inst.type as any, step, time);
          }
        }
      });
      stepRef.current = (step + 1) % 16;
    }, (60000 / bpm) / 4);

    intervalRef.current = window.setInterval(() => {
      setElapsed(p => p + 1);
    }, 1000);
  }, [playableCities, currentTrack, tracks]);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    playIntervalRef.current = null;
    intervalRef.current = null;
    setElapsed(0);
  }, []);

  const handlePrev = () => { handleStop(); setCurrentTrack(p => Math.max(0, p - 1)); };
  const handleNext = () => { handleStop(); setCurrentTrack(p => Math.min(playableCities.length - 1, p + 1)); };

  useEffect(() => { return () => { handleStop(); }; }, [handleStop]);

  const currentCity = playableCities[currentTrack % playableCities.length];
  const cityData = currentCity ? CITIES[currentCity] : null;
  const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const secs = (elapsed % 60).toString().padStart(2, '0');

  return (
    <div className="w-full max-w-[320px] border-2 border-[#4a6e4a] bg-[#232323] font-press-start" style={{ boxShadow: '4px 4px 0 #111' }}>
      <div className="bg-[#1a3a1a] px-[8px] py-[4px] flex justify-between items-center border-b border-[#4a6e4a]">
        <span className="text-[6px] text-[#00ff00]">BEATWORLD PLAYER</span>
        <div className="flex gap-[4px]">
          <div className="w-[8px] h-[8px] bg-[#555] border border-[#333]" />
          <div className="w-[8px] h-[8px] bg-[#555] border border-[#333]" />
        </div>
      </div>

      <div className="p-[8px]">
        <div className="bg-[#0a0a0a] border border-[#333] p-[8px] mb-[8px]">
          <div className="flex justify-between items-center mb-[4px]">
            <span className="text-[5px] text-[#00cc00]">{isPlaying ? '▶' : '■'} {cityData ? cityData.name.toUpperCase() : 'NO TRACKS'}</span>
            <span className="text-[6px] text-[#00ff00]">{mins}:{secs}</span>
          </div>
          <div className="text-[5px] text-[#008800]">{cityData ? cityData.genre.toUpperCase() : '---'}</div>

          <div className="flex gap-[1px] mt-[6px] h-[16px] items-end">
            {Array(20).fill(0).map((_, i) => {
              const h = isPlaying ? Math.random() * 100 : 10;
              return <div key={i} className="flex-1" style={{ height: `${h}%`, backgroundColor: h > 70 ? '#ff0000' : '#00ff00', transition: 'height 0.1s' }} />;
            })}
          </div>
        </div>

        <div className="flex justify-center gap-[4px]">
          <button onClick={handlePrev} className="px-[8px] py-[6px] text-[6px] text-[#ccc] bg-[#444] border border-[#222] hover:bg-[#555] active:translate-y-[1px]">⏮</button>
          <button onClick={isPlaying ? handleStop : handlePlay} className="px-[12px] py-[6px] text-[6px] text-[#ccc] bg-[#444] border border-[#222] hover:bg-[#555] active:translate-y-[1px]">
            {isPlaying ? '■' : '▶'}
          </button>
          <button onClick={handleNext} className="px-[8px] py-[6px] text-[6px] text-[#ccc] bg-[#444] border border-[#222] hover:bg-[#555] active:translate-y-[1px]">⏭</button>
        </div>
      </div>

      {playableCities.length > 0 && (
        <div className="border-t border-[#4a6e4a] max-h-[120px] overflow-y-auto">
          {playableCities.map((id, i) => {
            const c = CITIES[id];
            if (!c) return null;
            return (
              <div
                key={id}
                onClick={() => { handleStop(); setCurrentTrack(i); }}
                className="px-[8px] py-[4px] text-[5px] flex justify-between cursor-pointer border-b border-[#333] hover:bg-[#333]"
                style={{ backgroundColor: i === currentTrack ? '#1a3a1a' : 'transparent', color: i === currentTrack ? '#00ff00' : '#888' }}
              >
                <span>{i + 1}. {c.name.toUpperCase()}</span>
                <span>{c.genre.toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProfileScreen() {
  const [, setLocation] = useLocation();
  const { state } = useGameState();
  const [vuAnim, setVuAnim] = useState<number[]>(Array(8).fill(1));

  useEffect(() => {
    const iv = setInterval(() => {
      setVuAnim(Array(8).fill(0).map(() => Math.floor(Math.random() * 4) + 1));
    }, 300);
    return () => clearInterval(iv);
  }, []);

  const completedCityData = state.completedCities.map(id => CITIES[id]).filter(Boolean);
  const totalTracks = Object.keys(state.tracks).length;

  const shareText = encodeURIComponent(`I'm ${state.playerName.toUpperCase()} on BeatWorld! ${state.completedCities.length} cities completed, ${state.clout} CLOUT. #BeatWorld`);

  return (
    <div className="min-h-screen w-full relative font-press-start uppercase select-none overflow-x-hidden pb-[60px]" style={{ backgroundColor: '#0a0a1a', color: '#e0e0ff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        .font-press-start { font-family: 'Press Start 2P', monospace; }
        .grain-overlay {
          position: fixed; inset: 0; pointer-events: none; z-index: 50; opacity: 0.06;
          mix-blend-mode: screen;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        .bw-btn { border: 2px solid #111; box-shadow: 4px 4px 0 #111; cursor: pointer; }
        .bw-btn:hover { filter: brightness(1.1); }
        .bw-btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #111; }
      `}</style>

      <div className="grain-overlay" />

      <header className="relative z-20 flex justify-between items-center px-[24px] py-[12px] border-b-[3px] border-[#222]" style={{ backgroundColor: '#111133' }}>
        <div className="text-[10px] text-[#ff3399]" style={{ textShadow: '2px 2px 0 #111' }}>
          PRODUCER PROFILE
        </div>
        <button onClick={() => setLocation('/map')} className="bw-btn bg-[#334455] text-white px-[12px] py-[8px] text-[7px]">
          ← MAP
        </button>
      </header>

      <main className="w-full max-w-[620px] mx-auto px-[16px] pt-[24px] relative z-10 flex flex-col gap-[24px]">
        <div className="flex gap-[16px] items-start">
          <div className="bg-[#111133] border-2 border-[#222] p-[8px]" style={{ boxShadow: '4px 4px 0 #111' }}>
            <svg viewBox="0 0 32 48" width="64" height="96" style={{ imageRendering: 'pixelated' }}>
              <rect x="8" y="2" width="16" height="12" fill={state.character?.skinTone === 'medium' ? '#f1c27d' : state.character?.skinTone || '#f1c27d'} />
              <rect x="10" y="6" width="4" height="3" fill="#111" />
              <rect x="18" y="6" width="4" height="3" fill="#111" />
              <rect x="9" y="0" width="14" height="4" fill={state.character?.hairColor || '#111'} />
              <rect x="6" y="14" width="20" height="16" fill={state.character?.topColor || '#0050ff'} />
              <rect x="2" y="16" width="6" height="12" fill={state.character?.topColor || '#0050ff'} />
              <rect x="24" y="16" width="6" height="12" fill={state.character?.topColor || '#0050ff'} />
              <rect x="2" y="27" width="6" height="4" fill={state.character?.skinTone === 'medium' ? '#f1c27d' : '#f1c27d'} />
              <rect x="24" y="27" width="6" height="4" fill={state.character?.skinTone === 'medium' ? '#f1c27d' : '#f1c27d'} />
              <rect x="6" y="30" width="20" height="12" fill={state.character?.pantsColor || '#334455'} />
              <rect x="4" y="42" width="10" height="6" fill="#111" />
              <rect x="18" y="42" width="10" height="6" fill="#111" />
            </svg>
          </div>

          <div className="flex-1 flex flex-col gap-[8px]">
            <div className="text-[12px] text-[#ff3399]" style={{ textShadow: '2px 2px 0 #111' }}>
              {state.playerName.toUpperCase()}
            </div>
            <div className="bg-[#111133] border-2 border-[#222] p-[8px] flex flex-col gap-[6px]" style={{ boxShadow: '3px 3px 0 #111' }}>
              <div className="flex justify-between text-[6px]">
                <span className="text-[#556677]">CLOUT</span>
                <span className="text-[#ffee00]" style={{ textShadow: '0 0 8px #ffee00' }}>{state.clout.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[6px]">
                <span className="text-[#556677]">LEVEL</span>
                <span className="text-[#00ffff]">{state.currentLevel} / 6</span>
              </div>
              <div className="flex justify-between text-[6px]">
                <span className="text-[#556677]">CITIES</span>
                <span className="text-[#44cc00]">{state.completedCities.length} / 18</span>
              </div>
              <div className="flex justify-between text-[6px]">
                <span className="text-[#556677]">TRACKS</span>
                <span className="text-[#ff8800]">{totalTracks}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-[8px] text-[#556677] mb-[8px] border-b border-[#222] pb-[4px]">TRACK PLAYER</div>
          <WinampPlayer tracks={state.tracks} completedCities={state.completedCities} />
        </div>

        {completedCityData.length > 0 && (
          <div>
            <div className="text-[8px] text-[#556677] mb-[8px] border-b border-[#222] pb-[4px]">COMPLETED CITIES</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-[8px]">
              {completedCityData.map(city => (
                <div key={city.id} className="bg-[#111133] border border-[#222] p-[8px] flex flex-col gap-[4px]">
                  <div className="text-[6px] text-[#ff3399]">{city.emoji} {city.name.toUpperCase()}</div>
                  <div className="text-[5px] text-[#556677]">{city.genre.toUpperCase()}</div>
                  <div className="text-[5px] text-[#44cc00]">{city.venue.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="text-[8px] text-[#556677] mb-[8px] border-b border-[#222] pb-[4px]">SHARE YOUR STATS</div>
          <div className="flex gap-[8px]">
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bw-btn bg-[#1a1a2e] text-[#00ffff] px-[12px] py-[8px] text-[7px] no-underline"
            >
              X / TWITTER
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?quote=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bw-btn bg-[#1a1a2e] text-[#0050cc] px-[12px] py-[8px] text-[7px] no-underline"
            >
              FACEBOOK
            </a>
            <a
              href={`https://www.instagram.com/`}
              target="_blank"
              rel="noopener noreferrer"
              className="bw-btn bg-[#1a1a2e] text-[#ff3399] px-[12px] py-[8px] text-[7px] no-underline"
            >
              INSTAGRAM
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
