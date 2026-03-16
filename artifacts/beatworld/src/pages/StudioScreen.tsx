import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useParams } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';
import { CITIES } from '@/lib/game-data';
import { audio } from '@/lib/audio';
import { PixelButton } from '@/components/ui/PixelButton';
import { PixelPanel } from '@/components/ui/PixelPanel';
import { Play, Square } from 'lucide-react';

export default function StudioScreen() {
  const { cityId } = useParams();
  const [, setLocation] = useLocation();
  const { state, saveTrack } = useGameState();

  const city = cityId ? CITIES[cityId] : null;

  const [tracks, setTracks] = useState<boolean[][]>(() => {
    if (cityId && state.tracks[cityId]) return state.tracks[cityId];
    return Array(city?.numInstruments || 4).fill(null).map(() => Array(16).fill(false));
  });

  // Always-fresh ref so the playback interval never reads stale state
  const tracksRef = useRef(tracks);
  useEffect(() => { tracksRef.current = tracks; }, [tracks]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(city?.defaultBpm || 120);
  const [currentStep, setCurrentStep] = useState(-1);
  const [audioReady, setAudioReady] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const stepRef = useRef(0);

  // Initialize audio on first user interaction with the page
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
      const stepTime = Math.round((60_000 / bpm) / 4); // 16th-note in ms
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
    // Immediate preview sound
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

  const BEAT_COLORS = [
    '#ff00ff', '#00ffff', '#ffff00', '#ff8800',
    '#00ff88', '#ff0088', '#8800ff', '#00ccff',
    '#ff4444', '#44ff44', '#ff88ff', '#88ffff',
    '#ffcc00', '#cc00ff', '#00ff44', '#ff0044',
  ];

  return (
    <div id="studio-capture" className="min-h-screen bg-background relative flex flex-col">
      <div className="absolute inset-0 scanlines z-10 pointer-events-none" />

      {/* Studio background */}
      <img
        src={`${import.meta.env.BASE_URL}images/studio-bg.png`}
        alt="Studio"
        className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 pointer-events-none" />

      {/* ── Header ── */}
      <div className="relative z-20 flex justify-between items-center px-6 py-3 bg-black/70 border-b-2 border-primary/50">
        <div>
          <h1
            className="text-lg neon-text-primary"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            {city.emoji} {city.name.toUpperCase()} STUDIO
          </h1>
          <p
            className="text-[9px] text-secondary mt-1"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            {city.genre} · {city.instruments.length} TRACKS · {bpm} BPM
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* BPM */}
          <div className="flex items-center gap-2">
            <span className="text-[8px] text-gray-400" style={{ fontFamily: "'Press Start 2P', monospace" }}>BPM</span>
            <input
              type="range" min="60" max="200" value={bpm}
              onChange={e => setBpm(Number(e.target.value))}
              className="w-20 accent-primary"
            />
            <span className="text-[10px] text-white w-8" style={{ fontFamily: "'Press Start 2P', monospace" }}>{bpm}</span>
          </div>

          {/* Play / Stop */}
          <button
            onClick={handlePlayToggle}
            className="px-4 py-2 transition-all duration-100 active:scale-95"
            style={{
              background: isPlaying ? '#ff0000' : '#ff00ff',
              border: `2px solid ${isPlaying ? '#ff8888' : '#ff88ff'}`,
              boxShadow: `0 0 12px ${isPlaying ? '#ff000088' : '#ff00ff88'}`,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '10px',
              color: '#000',
            }}
          >
            {isPlaying ? '■ STOP' : '▶ PLAY'}
          </button>

          {/* Finish */}
          <button
            onClick={handleFinish}
            className="px-4 py-2 transition-all duration-100 active:scale-95"
            style={{
              background: '#00ffff',
              border: '2px solid #88ffff',
              boxShadow: '0 0 12px #00ffff88',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '10px',
              color: '#000',
            }}
          >
            FINISH →
          </button>
        </div>
      </div>

      {/* ── Sequencer ── */}
      <div className="relative z-20 flex-1 flex flex-col px-4 py-4 overflow-x-auto">
        {/* Beat number ruler */}
        <div className="flex items-center mb-1 pl-36">
          {Array(16).fill(0).map((_, i) => (
            <div
              key={i}
              className="flex-1 text-center text-[7px]"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                color: i % 4 === 0 ? '#ff00ff' : '#333',
              }}
            >
              {i % 4 === 0 ? i / 4 + 1 : '·'}
            </div>
          ))}
        </div>

        {/* Track rows */}
        <div
          className="flex flex-col gap-1 min-w-[700px]"
          style={{ border: '1px solid #333', background: 'rgba(0,0,0,0.7)', padding: '8px' }}
        >
          {city.instruments.map((inst, trackIdx) => {
            const trackColor = BEAT_COLORS[trackIdx % BEAT_COLORS.length];
            return (
              <div key={inst.id} className="flex items-center h-9">
                {/* Label */}
                <div className="w-36 flex items-center gap-2 pr-2 shrink-0">
                  <div
                    className="w-2 h-2 shrink-0"
                    style={{ background: trackColor, boxShadow: `0 0 4px ${trackColor}` }}
                  />
                  <span
                    className="text-[8px] truncate"
                    style={{ fontFamily: "'Press Start 2P', monospace", color: trackColor }}
                    title={inst.name}
                  >
                    {inst.name}
                  </span>
                </div>

                {/* Step buttons */}
                <div className="flex-1 flex gap-[2px] h-full">
                  {Array(16).fill(0).map((_, stepIdx) => {
                    const isActive = tracks[trackIdx]?.[stepIdx];
                    const isCurrent = currentStep === stepIdx;
                    const isDownbeat = stepIdx % 4 === 0;

                    return (
                      <button
                        key={stepIdx}
                        onClick={() => toggleStep(trackIdx, stepIdx)}
                        className="flex-1 h-full transition-all duration-75"
                        style={{
                          background: isActive
                            ? trackColor
                            : isCurrent
                              ? '#222'
                              : isDownbeat
                                ? '#111'
                                : '#0a0a0a',
                          border: `1px solid ${isActive ? trackColor : isCurrent ? '#555' : '#222'}`,
                          boxShadow: isActive
                            ? `0 0 6px ${trackColor}, inset 0 0 4px ${trackColor}88`
                            : isCurrent
                              ? '0 0 8px #ffffff44'
                              : 'none',
                          transform: isCurrent && isActive ? 'scaleY(1.1)' : 'scaleY(1)',
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Status bar */}
        <div className="mt-3 flex items-center gap-4">
          <div
            className="text-[8px] px-3 py-1 border"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              color: audioReady ? '#00ff88' : '#ffff00',
              borderColor: audioReady ? '#00ff8844' : '#ffff0044',
            }}
          >
            {audioReady ? '◉ AUDIO READY' : '○ CLICK TO ENABLE AUDIO'}
          </div>
          {isPlaying && (
            <div
              className="text-[8px] px-3 py-1 border border-primary/40"
              style={{ fontFamily: "'Press Start 2P', monospace", color: '#ff00ff' }}
            >
              ► PLAYING · STEP {currentStep + 1}/16
            </div>
          )}
        </div>
      </div>

      {/* Back */}
      <div className="relative z-20 px-4 pb-4">
        <PixelButton size="sm" onClick={() => setLocation('/map')}>
          ← MAP
        </PixelButton>
      </div>
    </div>
  );
}
