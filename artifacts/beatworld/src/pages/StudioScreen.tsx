import { useState, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';
import { CITIES } from '@/lib/game-data';
import { audio } from '@/lib/audio';
import { PixelButton } from '@/components/ui/PixelButton';
import { PixelPanel } from '@/components/ui/PixelPanel';
import { Play, Square, Save, Music } from 'lucide-react';

export default function StudioScreen() {
  const { cityId } = useParams();
  const [, setLocation] = useLocation();
  const { state, saveTrack } = useGameState();
  
  const city = cityId ? CITIES[cityId] : null;
  
  // Track state: matrix of numInstruments x 16 steps
  const [tracks, setTracks] = useState<boolean[][]>(() => {
    if (cityId && state.tracks[cityId]) {
      return state.tracks[cityId];
    }
    return Array(city?.numInstruments || 4).fill([]).map(() => Array(16).fill(false));
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [currentStep, setCurrentStep] = useState(0);
  
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Init Audio Context on first mount
    const handleInit = () => audio.init();
    window.addEventListener('click', handleInit, { once: true });
    return () => window.removeEventListener('click', handleInit);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const stepTime = (60000 / bpm) / 4; // 16th notes
      intervalRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          const next = (prev + 1) % 16;
          playStep(next);
          return next;
        });
      }, stepTime);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCurrentStep(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, bpm, tracks]);

  const playStep = (step: number) => {
    if (!city) return;
    const time = audio.getCurrentTime() + 0.05; // slightly in future for tight scheduling
    
    city.instruments.forEach((inst, idx) => {
      if (tracks[idx][step]) {
        if (['kick', 'snare', 'hihat', 'perc'].includes(inst.type)) {
          audio.playDrum(inst.type, time);
        } else {
          // Pass a simple note sequence based on step to make it sound musical
          audio.playSynth(inst.type as any, step, time);
        }
      }
    });
  };

  const toggleStep = (trackIdx: number, stepIdx: number) => {
    audio.init(); // Ensure audio ctx is awake
    const newTracks = [...tracks];
    newTracks[trackIdx] = [...newTracks[trackIdx]];
    newTracks[trackIdx][stepIdx] = !newTracks[trackIdx][stepIdx];
    setTracks(newTracks);
    
    // Preview sound if activating
    if (newTracks[trackIdx][stepIdx] && city) {
      const inst = city.instruments[trackIdx];
      const time = audio.getCurrentTime();
      if (['kick', 'snare', 'hihat', 'perc'].includes(inst.type)) {
        audio.playDrum(inst.type, time);
      } else {
        audio.playSynth(inst.type as any, stepIdx, time);
      }
    }
  };

  const handleFinish = () => {
    if (!cityId) return;
    saveTrack(cityId, tracks);
    setLocation(`/performance/${cityId}`);
  };

  if (!city) return <div className="text-white p-8">City not found</div>;

  return (
    <div id="studio-capture" className="min-h-screen bg-background relative flex flex-col p-4 md:p-8">
      <div className="absolute inset-0 scanlines z-10 pointer-events-none"></div>
      
      <img 
        src={`${import.meta.env.BASE_URL}images/studio-bg.png`} 
        alt="Studio" 
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" 
      />

      {/* Header */}
      <div className="flex justify-between items-center z-20 mb-8 bg-black/60 p-4 pixel-borders">
        <div>
          <h1 className="text-2xl text-primary neon-text-primary">{city.name} STUDIO</h1>
          <p className="text-xs text-secondary mt-2">GENRE: {city.genre}</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">BPM</span>
            <input 
              type="range" min="80" max="180" value={bpm} 
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-24 accent-primary"
            />
            <span className="text-sm text-white w-8">{bpm}</span>
          </div>
          <PixelButton variant="primary" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Square size={16} /> : <Play size={16} className="ml-1" />}
          </PixelButton>
          <PixelButton variant="secondary" onClick={handleFinish}>
            FINISH TRACK
          </PixelButton>
        </div>
      </div>

      {/* Sequencer Grid */}
      <div className="flex-1 z-20 flex flex-col gap-2 max-w-6xl w-full mx-auto overflow-x-auto pb-8">
        <PixelPanel className="bg-black/80 flex flex-col gap-3 min-w-[800px]">
          
          <div className="flex pl-32 mb-2">
            {Array(16).fill(0).map((_, i) => (
              <div key={i} className="flex-1 text-center text-[8px] text-gray-600">
                {(i % 4 === 0) ? (i / 4) + 1 : ''}
              </div>
            ))}
          </div>

          {city.instruments.map((inst, trackIdx) => (
            <div key={inst.id} className="flex items-center h-10 w-full">
              <div className="w-32 flex items-center pr-4">
                <div className={`w-3 h-3 ${inst.color} mr-2 pixel-borders`}></div>
                <span className="text-[10px] text-gray-300 truncate" title={inst.name}>{inst.name}</span>
              </div>
              
              <div className="flex-1 flex gap-1 h-full">
                {Array(16).fill(0).map((_, stepIdx) => {
                  const isActive = tracks[trackIdx][stepIdx];
                  const isCurrent = isPlaying && currentStep === stepIdx;
                  const isBeat = stepIdx % 4 === 0;
                  
                  return (
                    <div 
                      key={stepIdx}
                      onClick={() => toggleStep(trackIdx, stepIdx)}
                      className={`
                        flex-1 h-full cursor-pointer transition-all duration-75
                        ${isActive ? inst.color : isBeat ? 'bg-gray-800' : 'bg-gray-900'}
                        ${isCurrent ? 'brightness-150 scale-110 z-10 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : ''}
                        ${isActive ? 'pixel-borders border-opacity-50' : 'border border-gray-800'}
                        hover:brightness-125
                      `}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </PixelPanel>
      </div>
      
      <PixelButton className="absolute bottom-4 left-4 z-20" size="sm" onClick={() => setLocation('/map')}>
        BACK TO MAP
      </PixelButton>
    </div>
  );
}
