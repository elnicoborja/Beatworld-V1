import { useState } from 'react';
import { useLocation } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';

const SKIN_TONES = ['#ffe0bd', '#f1c27d', '#c68642', '#8d5524', '#3d1c02'];
const HAIR_COLORS = [
  '#000000', '#444466', '#e0e0ff', '#ffff00',
  '#ff8800', '#ff0000', '#ff00c8', '#ff00ff',
  '#00ffff', '#0050ff', '#00ff00', '#3d1c02',
];
const PALETTE_COLORS = [
  '#ff00ff', '#00ffff', '#ffff00', '#0050ff',
  '#ff0000', '#00ff00', '#ff00c8', '#ff8800',
  '#e0e0ff', '#444466', '#0a0a1a', '#ffffff',
];

const HAIR_STYLES = ['FADE', 'DREADS', 'SPIKES', 'BUZZ', 'MOP', 'PONYTAIL', 'AFRO', 'BALD'];
const TOP_STYLES = ['TEE', 'HOODIE', 'JACKET', 'TANK', 'JERSEY', 'SUIT'];
const PANTS_STYLES = ['JEANS', 'CARGOS', 'SHORTS', 'TRACK', 'SWEATS', 'SLACKS'];
const ACCESSORIES = ['NONE', 'HEADPHONES', 'SNAPBACK', 'SUNGLASSES', 'GOLD CHAIN', 'BANDANA', 'MASK'];

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-[6px] h-[6px] bg-[#ffffff]" style={{ boxShadow: '0 0 4px #fff' }} />
      <span className="text-[#ffffff] text-[8px] uppercase tracking-wider">{title}</span>
    </div>
  );
}

function renderHair(hairStyle: string, hairColor: string) {
  if (hairStyle === 'BALD') return null;
  if (hairStyle === 'SPIKES') {
    return (
      <>
        <rect x="6" y="2" width="12" height="2" fill={hairColor} />
        <rect x="6" y="0" width="2" height="2" fill={hairColor} />
        <rect x="10" y="0" width="2" height="2" fill={hairColor} />
        <rect x="14" y="0" width="2" height="2" fill={hairColor} />
      </>
    );
  }
  if (hairStyle === 'AFRO') {
    return <rect x="4" y="0" width="16" height="6" fill={hairColor} />;
  }
  if (hairStyle === 'DREADS') {
    return (
      <>
        <rect x="6" y="1" width="12" height="3" fill={hairColor} />
        <rect x="5" y="4" width="2" height="6" fill={hairColor} />
        <rect x="8" y="4" width="2" height="8" fill={hairColor} />
        <rect x="14" y="4" width="2" height="8" fill={hairColor} />
        <rect x="17" y="4" width="2" height="6" fill={hairColor} />
      </>
    );
  }
  if (hairStyle === 'MOP') {
    return (
      <>
        <rect x="5" y="1" width="14" height="4" fill={hairColor} />
        <rect x="5" y="5" width="4" height="3" fill={hairColor} />
        <rect x="15" y="5" width="4" height="3" fill={hairColor} />
      </>
    );
  }
  if (hairStyle === 'PONYTAIL') {
    return (
      <>
        <rect x="6" y="1" width="12" height="3" fill={hairColor} />
        <rect x="16" y="3" width="4" height="2" fill={hairColor} />
        <rect x="18" y="5" width="4" height="6" fill={hairColor} />
      </>
    );
  }
  return <rect x="6" y="1" width="12" height="3" fill={hairColor} />;
}

function renderTop(topStyle: string, topColor: string, skinTone: string) {
  const sleeveLen = topStyle === 'TANK' ? 2 : topStyle === 'HOODIE' ? 10 : 5;
  return (
    <>
      <rect x="5" y="12" width="14" height="16" fill={topColor} />
      <rect x="3" y="13" width="2" height={sleeveLen} fill={topColor} />
      <rect x="19" y="13" width="2" height={sleeveLen} fill={topColor} />
      {topStyle !== 'HOODIE' && (
        <>
          <rect x="3" y={13 + sleeveLen} width="2" height={12 - sleeveLen} fill={skinTone} />
          <rect x="19" y={13 + sleeveLen} width="2" height={12 - sleeveLen} fill={skinTone} />
        </>
      )}
      {topStyle === 'HOODIE' && <rect x="6" y="12" width="12" height="4" fill={topColor} opacity="0.8" />}
      {topStyle === 'JACKET' && <rect x="11" y="12" width="2" height="16" fill="#0a0a1a" opacity="0.5" />}
      {topStyle === 'JERSEY' && (
        <>
          <rect x="7" y="14" width="4" height="6" fill="#0a0a1a" opacity="0.3" />
          <rect x="13" y="14" width="4" height="6" fill="#0a0a1a" opacity="0.3" />
        </>
      )}
      {topStyle === 'SUIT' && (
        <>
          <rect x="11" y="12" width="2" height="16" fill="#0a0a1a" opacity="0.4" />
          <rect x="9" y="12" width="6" height="3" fill="#0a0a1a" opacity="0.3" />
        </>
      )}
    </>
  );
}

function renderPants(pantsStyle: string, pantsColor: string, skinTone: string) {
  const isShorts = pantsStyle === 'SHORTS';
  const legH = isShorts ? 4 : 8;
  return (
    <>
      <rect x="5" y="28" width="14" height="4" fill={pantsColor} />
      <rect x="5" y="32" width="6" height={legH} fill={pantsColor} />
      <rect x="13" y="32" width="6" height={legH} fill={pantsColor} />
      {isShorts && (
        <>
          <rect x="5" y="36" width="6" height="4" fill={skinTone} />
          <rect x="13" y="36" width="6" height="4" fill={skinTone} />
        </>
      )}
      {pantsStyle === 'CARGOS' && (
        <>
          <rect x="5" y="34" width="2" height="4" fill={pantsColor} opacity="0.7" />
          <rect x="17" y="34" width="2" height="4" fill={pantsColor} opacity="0.7" />
        </>
      )}
    </>
  );
}

function renderAccessory(accessory: string, topColor: string) {
  if (accessory === 'HEADPHONES') {
    return (
      <>
        <rect x="4" y="5" width="2" height="4" fill="#aaaaaa" />
        <rect x="18" y="5" width="2" height="4" fill="#aaaaaa" />
        <rect x="4" y="3" width="16" height="2" fill="#aaaaaa" />
      </>
    );
  }
  if (accessory === 'SNAPBACK') {
    return (
      <>
        <rect x="5" y="1" width="14" height="3" fill={topColor} />
        <rect x="15" y="3" width="6" height="1" fill={topColor} />
      </>
    );
  }
  if (accessory === 'SUNGLASSES') return <rect x="7" y="7" width="10" height="2" fill="#000088" />;
  if (accessory === 'GOLD CHAIN') {
    return (
      <>
        <rect x="8" y="12" width="2" height="2" fill="#ffff00" />
        <rect x="14" y="12" width="2" height="2" fill="#ffff00" />
        <rect x="10" y="14" width="4" height="2" fill="#ffff00" />
      </>
    );
  }
  if (accessory === 'BANDANA') return <rect x="6" y="10" width="12" height="3" fill="#ff00c8" />;
  if (accessory === 'MASK') {
    return (
      <>
        <rect x="7" y="10" width="10" height="3" fill="#ffffff" />
        <rect x="5" y="10" width="2" height="1" fill="#aaaaaa" />
        <rect x="17" y="10" width="2" height="1" fill="#aaaaaa" />
      </>
    );
  }
  return null;
}

export default function CharacterCreator() {
  const [, setLocation] = useLocation();
  const { updateState } = useGameState();
  const [name, setName] = useState('');
  const [skinTone, setSkinTone] = useState(SKIN_TONES[1]);
  const [hairStyle, setHairStyle] = useState(HAIR_STYLES[0]);
  const [hairColor, setHairColor] = useState(HAIR_COLORS[0]);
  const [topStyle, setTopStyle] = useState(TOP_STYLES[0]);
  const [topColor, setTopColor] = useState(PALETTE_COLORS[0]);
  const [pantsStyle, setPantsStyle] = useState(PANTS_STYLES[0]);
  const [pantsColor, setPantsColor] = useState(PALETTE_COLORS[9]);
  const [accessory, setAccessory] = useState(ACCESSORIES[0]);

  const handleStart = () => {
    updateState({
      playerName: name || 'PRODUCER',
      character: { skinTone, hairStyle, hairColor, topStyle, topColor, pantsStyle, pantsColor, accessory },
    });
    setLocation('/map');
  };

  return (
    <div
      className="min-h-screen w-full bg-[#0a0a1a] text-[#e0e0ff] uppercase overflow-hidden flex flex-col md:flex-row relative"
      style={{ fontFamily: "'Press Start 2P', monospace" }}
    >
      <style>{`
        .scanlines-cc {
          background: repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px);
          pointer-events: none;
        }
        .grid-cc {
          background-image: linear-gradient(rgba(255,0,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,255,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }
        .custom-scroll::-webkit-scrollbar { width: 12px; }
        .custom-scroll::-webkit-scrollbar-track { background: #0a0a1a; border-left: 2px solid #444466; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #00ffff; border: 2px solid #000; }
      `}</style>

      <div className="absolute inset-0 grid-cc z-0" />
      <div className="absolute inset-0 scanlines-cc z-10" />

      <button
        onClick={() => setLocation('/')}
        className="absolute top-4 left-4 z-50 text-[#00ffff] text-[8px] uppercase hover:text-[#ffffff]"
      >
        ← BACK
      </button>

      {/* LEFT PANEL — Preview */}
      <div className="relative z-20 w-full md:w-1/2 bg-[#111133] border-b-2 md:border-b-0 md:border-r-2 border-[#ff00ff] p-8 flex flex-col pt-16 md:pt-8 md:h-screen justify-center">
        <h2 className="text-[#00ffff] text-[9px] mb-6 uppercase" style={{ textShadow: '0 0 8px #00ffff' }}>
          YOUR PRODUCER
        </h2>

        <div className="flex flex-col items-center mb-8">
          <div
            className="w-[120px] h-[240px] bg-[#0a0a1a] border-2 border-[#ff00ff] flex items-center justify-center relative"
            style={{ boxShadow: '0 0 20px #ff00ff40' }}
          >
            <svg viewBox="0 0 24 48" width="96" height="192" style={{ imageRendering: 'pixelated' }}>
              {(hairStyle === 'PONYTAIL' || hairStyle === 'DREADS') && (
                <rect x="4" y="2" width="16" height="12" fill={hairColor} />
              )}
              <rect x="6" y="4" width="12" height="8" fill={skinTone} />
              <rect x="8" y="7" width="1" height="1" fill="#000" />
              <rect x="14" y="7" width="1" height="1" fill="#000" />
              {accessory !== 'SNAPBACK' && renderHair(hairStyle, hairColor)}
              {renderTop(topStyle, topColor, skinTone)}
              {renderPants(pantsStyle, pantsColor, skinTone)}
              <rect x="5" y="40" width="4" height="8" fill="#222244" />
              <rect x="15" y="40" width="4" height="8" fill="#222244" />
              {renderAccessory(accessory, topColor)}
            </svg>
          </div>
          <div className="w-[140px] h-[20px] bg-[#ff00ff] opacity-20 mt-4" style={{ borderRadius: '50%', filter: 'blur(4px)' }} />
        </div>

        <div className="w-full flex flex-col gap-2">
          <label className="text-[#ffff00] text-[8px] uppercase" style={{ textShadow: '0 0 4px #ffff00' }}>
            PRODUCER NAME
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value.toUpperCase())}
            maxLength={12}
            className="bg-[#0a0a1a] border-2 border-[#00ffff] text-[#00ffff] text-[10px] p-3 w-full uppercase focus:outline-none"
            style={{ caretColor: '#00ffff' }}
            placeholder="ENTER NAME"
          />
        </div>

        <button
          onClick={handleStart}
          className="w-full mt-6 bg-[#ff00ff] text-[#0a0a1a] border-2 border-[#ff00ff] text-[10px] p-4 uppercase hover:brightness-110 active:translate-y-[2px] active:translate-x-[2px] transition-none focus:outline-none focus:ring-2 focus:ring-[#ffff00]"
          style={{ boxShadow: '4px 4px 0px #000' }}
        >
          ENTER BEATWORLD
        </button>
      </div>

      {/* RIGHT PANEL — Options */}
      <div className="relative z-20 w-full md:w-1/2 bg-[#0a0a1a] p-6 md:h-screen overflow-y-auto custom-scroll flex flex-col gap-8 pb-16">
        <section>
          <SectionHeader title="SKIN TONE" />
          <div className="flex flex-wrap gap-3">
            {SKIN_TONES.map(color => (
              <button
                key={color}
                onClick={() => setSkinTone(color)}
                className={`w-8 h-8 border-2 focus:outline-none ${skinTone === color ? 'border-[#ffff00]' : 'border-[#444466]'}`}
                style={{ backgroundColor: color, boxShadow: skinTone === color ? 'inset 0 0 8px #ffff00' : 'none' }}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="HAIR STYLE" />
          <div className="grid grid-cols-2 gap-2">
            {HAIR_STYLES.map(style => (
              <button
                key={style}
                onClick={() => setHairStyle(style)}
                className={`text-[7px] uppercase py-3 border focus:outline-none transition-none ${hairStyle === style ? 'bg-[#2a0a2a] border-[#ff00ff] text-[#ff00ff]' : 'bg-[#111133] border-[#444466] text-[#e0e0ff]'}`}
                style={hairStyle === style ? { boxShadow: '2px 2px 0px #000' } : undefined}
              >
                {style}
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="HAIR COLOR" />
          <div className="flex flex-wrap gap-2">
            {HAIR_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setHairColor(color)}
                className={`w-6 h-6 border-2 focus:outline-none ${hairColor === color ? 'border-[#ffffff]' : 'border-[#444466]'}`}
                style={{ backgroundColor: color, boxShadow: hairColor === color ? '0 0 4px #fff' : 'none' }}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="TOP STYLE" />
          <div className="grid grid-cols-2 gap-2">
            {TOP_STYLES.map(style => (
              <button
                key={style}
                onClick={() => setTopStyle(style)}
                className={`text-[7px] uppercase py-3 border focus:outline-none transition-none ${topStyle === style ? 'bg-[#2a0a2a] border-[#ff00ff] text-[#ff00ff]' : 'bg-[#111133] border-[#444466] text-[#e0e0ff]'}`}
                style={topStyle === style ? { boxShadow: '2px 2px 0px #000' } : undefined}
              >
                {style}
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="TOP COLOR" />
          <div className="flex flex-wrap gap-2">
            {PALETTE_COLORS.map(color => (
              <button
                key={color}
                onClick={() => setTopColor(color)}
                className={`w-6 h-6 border-2 focus:outline-none ${topColor === color ? 'border-[#ffffff]' : 'border-[#444466]'}`}
                style={{ backgroundColor: color, boxShadow: topColor === color ? '0 0 4px #fff' : 'none' }}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="PANTS STYLE" />
          <div className="grid grid-cols-2 gap-2">
            {PANTS_STYLES.map(style => (
              <button
                key={style}
                onClick={() => setPantsStyle(style)}
                className={`text-[7px] uppercase py-3 border focus:outline-none transition-none ${pantsStyle === style ? 'bg-[#2a0a2a] border-[#ff00ff] text-[#ff00ff]' : 'bg-[#111133] border-[#444466] text-[#e0e0ff]'}`}
                style={pantsStyle === style ? { boxShadow: '2px 2px 0px #000' } : undefined}
              >
                {style}
              </button>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="PANTS COLOR" />
          <div className="flex flex-wrap gap-2">
            {PALETTE_COLORS.slice(0, 10).map(color => (
              <button
                key={color}
                onClick={() => setPantsColor(color)}
                className={`w-6 h-6 border-2 focus:outline-none ${pantsColor === color ? 'border-[#ffffff]' : 'border-[#444466]'}`}
                style={{ backgroundColor: color, boxShadow: pantsColor === color ? '0 0 4px #fff' : 'none' }}
              />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="ACCESSORY" />
          <div className="flex flex-wrap gap-2">
            {ACCESSORIES.map(acc => (
              <button
                key={acc}
                onClick={() => setAccessory(acc)}
                className={`text-[7px] uppercase py-3 px-4 border focus:outline-none transition-none ${accessory === acc ? 'bg-[#2a0a2a] border-[#ff00ff] text-[#ff00ff]' : 'bg-[#111133] border-[#444466] text-[#e0e0ff]'}`}
                style={accessory === acc ? { boxShadow: '2px 2px 0px #000' } : undefined}
              >
                {acc}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
