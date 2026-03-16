import { useState, type ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';

const C = {
  skyBlue: '#87ceeb', cream: '#fff8e7', hotPink: '#ff3399', magenta: '#cc0066',
  yellow: '#ffee00', cobalt: '#0050cc', black: '#111111', gray: '#888899',
};

interface SkinTone { face: string; shadow: string; depth: string }

const SKIN_TONES: SkinTone[] = [
  { face: '#ffe0bd', shadow: '#d4a97a', depth: '#c49060' },
  { face: '#f1c27d', shadow: '#c8903a', depth: '#b07830' },
  { face: '#c68642', shadow: '#9a6020', depth: '#804e10' },
  { face: '#8d5524', shadow: '#6b3a10', depth: '#522c08' },
  { face: '#3d1c02', shadow: '#2a1000', depth: '#1a0800' },
];

const HAIR_COLORS = [
  '#111111','#443322','#884411','#ddaa55','#ffee00','#ffffff',
  '#ff3399','#00ffff','#ff0000','#00cc00','#9900cc','#ff8800',
];

const PALETTE_COLORS = [
  '#ff3399','#00ffff','#ffee00','#0050cc','#cc3300','#44cc00',
  '#ff8800','#00aaaa','#6600cc','#fff8e7','#888899','#111111',
];

const HAIR_STYLES = ['FADE','DREADS','SPIKES','BUZZ','MOP','PONYTAIL','AFRO','BALD'];
const TOP_STYLES = ['TEE','HOODIE','JACKET','TANK','JERSEY','SUIT'];
const PANTS_STYLES = ['JEANS','CARGOS','SHORTS','TRACK','SWEATS','SLACKS'];
const ACCESSORIES = ['NONE','HEADPHONES','SNAPBACK','SUNGLASSES','CHAIN','BANDANA'];
const ACC_EMOJI: Record<string, string> = { NONE:'NONE', HEADPHONES:'🎧', SNAPBACK:'🧢', SUNGLASSES:'🕶️', CHAIN:'⛓️', BANDANA:'🩹' };

function SectionCard({ title, children, bgColorIndex }: { title: string; children: ReactNode; bgColorIndex: number }) {
  const bgColors = ['#e8f4ff','#fff8e7','#ffe8f4'];
  return (
    <div className="border-[2px] border-[#111111] p-4 mb-5" style={{ backgroundColor: bgColors[bgColorIndex % 3], boxShadow: `3px 3px 0 ${C.black}` }}>
      <h3 className="text-[8px] text-[#111111] mb-3 pb-2 border-b-2 border-[#111111] flex items-center gap-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
        <span className="w-[6px] h-[6px] bg-[#111] block" /> {title}
      </h3>
      {children}
    </div>
  );
}

function renderHair(hairStyle: string, hairColor: string, accessory: string) {
  if (hairStyle === 'BALD') return null;
  const isWearingHat = accessory === 'SNAPBACK';

  let backHair = <rect x="3" y="1" width="10" height="6" fill={hairColor} />;
  let topHair: ReactNode = <rect x="2" y="0" width="10" height="2" fill={hairColor} />;

  if (hairStyle === 'FADE' || hairStyle === 'BUZZ') {
    backHair = <rect x="3" y="1" width="10" height="4" fill={hairColor} />;
    topHair = <rect x="2" y="0" width="10" height="1" fill={hairColor} />;
  }
  if (hairStyle === 'AFRO') {
    backHair = <rect x="1" y="-1" width="14" height="9" fill={hairColor} />;
    topHair = <rect x="1" y="-2" width="14" height="4" fill={hairColor} />;
  }
  if (hairStyle === 'SPIKES') {
    topHair = (
      <>
        <rect x="2" y="-1" width="2" height="2" fill={hairColor} />
        <rect x="6" y="-2" width="2" height="3" fill={hairColor} />
        <rect x="10" y="-1" width="2" height="2" fill={hairColor} />
      </>
    );
  }
  if (hairStyle === 'DREADS' || hairStyle === 'PONYTAIL' || hairStyle === 'MOP') {
    backHair = <rect x="3" y="1" width="10" height="10" fill={hairColor} />;
  }

  return (
    <g>
      {!isWearingHat && backHair}
      {!isWearingHat && topHair}
    </g>
  );
}

function renderAccessory(accessory: string, topColor: string) {
  if (accessory === 'HEADPHONES') {
    return (
      <g>
        <rect x="3" y="0" width="9" height="2" fill="#555555" />
        <rect x="1" y="2" width="3" height="4" fill="#888888" />
        <rect x="11" y="2" width="3" height="4" fill="#888888" />
        <rect x="2" y="3" width="2" height="2" fill="#333333" />
        <rect x="11" y="3" width="2" height="2" fill="#333333" />
      </g>
    );
  }
  if (accessory === 'SNAPBACK') {
    return (
      <g>
        <rect x="1" y="1" width="13" height="2" fill={topColor} />
        <rect x="1" y="1" width="13" height="2" fill="#000" opacity="0.2" />
        <rect x="2" y="-1" width="10" height="3" fill={topColor} />
        <rect x="6" y="-2" width="2" height="1" fill={topColor} />
        <rect x="6" y="-2" width="2" height="1" fill="#000" opacity="0.3" />
        <rect x="5" y="0" width="4" height="2" fill={C.yellow} />
      </g>
    );
  }
  if (accessory === 'SUNGLASSES') {
    return (
      <g>
        <rect x="3" y="3" width="3" height="2" fill="#000088" opacity="0.85" />
        <rect x="8" y="3" width="3" height="2" fill="#000088" opacity="0.85" />
        <rect x="6" y="3" width="2" height="1" fill="#aaaaaa" />
      </g>
    );
  }
  if (accessory === 'CHAIN') {
    return (
      <g>
        <rect x="4" y="12" width="7" height="1" fill="#ffdd00" />
        <rect x="5" y="13" width="5" height="1" fill="#ffaa00" />
        <rect x="6" y="14" width="2" height="2" fill="#ffdd00" />
      </g>
    );
  }
  if (accessory === 'BANDANA') {
    return (
      <g>
        <rect x="2" y="4" width="10" height="3" fill={topColor} opacity="0.9" />
        <rect x="3" y="5" width="1" height="1" fill="#fff" />
        <rect x="6" y="4" width="1" height="1" fill="#fff" />
        <rect x="9" y="6" width="1" height="1" fill="#fff" />
        <rect x="10" y="5" width="1" height="1" fill="#fff" />
      </g>
    );
  }
  return null;
}

export default function CharacterCreator() {
  const [, setLocation] = useLocation();
  const { state, updateState } = useGameState();

  const existingChar = state.character;
  const findSkinTone = () => SKIN_TONES.find(t => t.face === existingChar.skinTone) || SKIN_TONES[1];

  const [name, setName] = useState(state.playerName === 'Producer' ? '' : state.playerName);
  const [skinTone, setSkinTone] = useState<SkinTone>(findSkinTone);
  const [hairStyle, setHairStyle] = useState(existingChar.hairStyle?.toUpperCase() || 'FADE');
  const [hairColor, setHairColor] = useState(existingChar.hairColor || '#111111');
  const [topStyle, setTopStyle] = useState(existingChar.topStyle?.toUpperCase() || 'TEE');
  const [topColor, setTopColor] = useState(existingChar.topColor || '#ff3399');
  const [pantsStyle, setPantsStyle] = useState(existingChar.pantsStyle?.toUpperCase() || 'JEANS');
  const [pantsColor, setPantsColor] = useState(existingChar.pantsColor || '#0050cc');
  const [accessory, setAccessory] = useState(existingChar.accessory?.toUpperCase() || 'NONE');

  const handleEnter = () => {
    const playerName = name.trim() || 'Producer';
    updateState({
      playerName,
      character: {
        skinTone: skinTone.face,
        hairStyle: hairStyle.toLowerCase(),
        hairColor,
        topStyle: topStyle.toLowerCase(),
        topColor,
        pantsStyle: pantsStyle.toLowerCase(),
        pantsColor,
        accessory: accessory.toLowerCase(),
      },
    });
    setLocation('/map');
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col md:flex-row relative uppercase overflow-hidden text-[#111111]"
      style={{ backgroundColor: C.skyBlue, fontFamily: "'Press Start 2P', monospace" }}
    >
      <style>{`
        .iso-floor-cc { position:absolute; bottom:0; left:0; width:100%; height:20%; z-index:0;
          background-image:
            linear-gradient(30deg,#99aabc 12%,transparent 12.5%,transparent 87%,#99aabc 87.5%,#99aabc),
            linear-gradient(150deg,#99aabc 12%,transparent 12.5%,transparent 87%,#99aabc 87.5%,#99aabc),
            linear-gradient(30deg,#99aabc 37%,transparent 37.5%,transparent 62%,#99aabc 62.5%,#99aabc),
            linear-gradient(150deg,#99aabc 37%,transparent 37.5%,transparent 62%,#99aabc 62.5%,#99aabc);
          background-size:64px 32px; background-color:#aabbcc; border-top:2px solid ${C.black};
        }
        .custom-scroll-cc::-webkit-scrollbar { width:16px; }
        .custom-scroll-cc::-webkit-scrollbar-track { background:${C.cream}; border-left:2px solid ${C.black}; }
        .custom-scroll-cc::-webkit-scrollbar-thumb { background:${C.hotPink}; border:2px solid ${C.black}; }
        .input-caret-cc { caret-color:${C.hotPink}; }
        .input-caret-cc:focus { outline:2px solid ${C.hotPink}; outline-offset:2px; }
        .opt-btn-cc {
          background-color:${C.cobalt}; color:#fff; border:2px solid ${C.black};
          box-shadow:inset 1px 1px 0 rgba(255,255,255,0.3), inset -1px -1px 0 rgba(0,0,0,0.2), 3px 3px 0 ${C.black};
          padding:12px 4px; text-align:center; font-size:7px; cursor:pointer;
          font-family:'Press Start 2P', monospace; text-transform:uppercase;
        }
        .opt-btn-cc:active { transform:translate(2px,2px); box-shadow:1px 1px 0 ${C.black}; }
        .opt-btn-cc.selected { background-color:${C.hotPink}; }
        .swatch-cc { border:2px solid ${C.black}; box-shadow:inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.2); cursor:pointer; }
        .swatch-cc.selected { border:3px solid ${C.hotPink}; box-shadow:0 0 0 2px ${C.black}, inset 0 2px 0 rgba(255,255,255,0.4); }
      `}</style>

      <svg className="hidden">
        <filter id="grain-cc">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        </filter>
      </svg>

      <div className="iso-floor-cc" />
      <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.08]" style={{ filter: 'url(#grain-cc)', mixBlendMode: 'multiply' }} />

      <button
        onClick={() => setLocation('/')}
        className="absolute top-4 left-4 z-50 text-[#0050cc] text-[8px] uppercase hover:text-[#ff3399] bg-transparent border-none cursor-pointer"
        style={{ textShadow: '1px 1px 0 #fff', fontFamily: "'Press Start 2P', monospace" }}
      >
        ← BACK
      </button>

      {/* LEFT PANEL - THE STAGE */}
      <div className="relative z-20 w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center items-center h-screen">
        <div className="w-full max-w-[340px] bg-[#fff8e7] border-[3px] border-[#111111] p-7 flex flex-col" style={{ boxShadow: `6px 6px 0 ${C.black}` }}>
          <h2 className="text-[#0050cc] text-[10px] text-center mb-6" style={{ filter: 'drop-shadow(1px 1px 0 #fff)' }}>
            YOUR PRODUCER
          </h2>

          {/* Sprite Stage */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-[140px] h-[280px] bg-[#334455] border-[3px] border-[#111111] relative flex flex-col items-center justify-end pb-8" style={{ boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.3), 4px 4px 0 #111' }}>
              <div className="absolute bottom-6 flex flex-col items-center justify-center pointer-events-none z-0">
                <div className="w-[60px] h-[6px] bg-[#221133] opacity-40 absolute" />
                <div className="w-[50px] h-[4px] bg-[#221133] opacity-50 absolute" />
                <div className="w-[40px] h-[2px] bg-[#221133] opacity-60 absolute" />
              </div>

              <svg width="80" height="20" className="absolute bottom-4 z-10" style={{ imageRendering: 'pixelated' }}>
                <rect x="0" y="0" width="80" height="8" fill="#cc9900" />
                <rect x="0" y="8" width="80" height="6" fill="#aa7700" />
                <rect x="0" y="8" width="10" height="6" fill="#996600" />
                <rect x="0" y="0" width="80" height="1" fill="#ffdd44" opacity="0.5" />
                <rect x="0" y="8" width="80" height="1" fill="#442200" opacity="0.3" />
              </svg>

              <svg viewBox="0 0 16 32" width="64" height="128" className="relative z-20 mb-2" style={{ imageRendering: 'pixelated', overflow: 'visible' }}>
                <g transform="translate(0, 2)">
                  {renderHair(hairStyle, hairColor, accessory)}
                  <rect x="2" y="1" width="10" height="6" fill={skinTone.face} />
                  <rect x="4" y="3" width="2" height="2" fill="#111111" />
                  <rect x="8" y="3" width="2" height="2" fill="#111111" />
                  <rect x="6" y="4" width="1" height="1" fill={skinTone.shadow} />
                  <rect x="5" y="5" width="3" height="1" fill="#cc3333" />
                  <rect x="5" y="7" width="5" height="2" fill={skinTone.face} />
                  <rect x="5" y="7" width="5" height="1" fill="#000" opacity="0.15" />
                  <rect x="2" y="9" width="12" height="11" fill={topColor} />
                  <rect x="1" y="10" width="2" height="10" fill="#000" opacity="0.2" />
                  <rect x="2" y="9" width="12" height="1" fill="#fff" opacity="0.2" />
                  <rect x="7" y="9" width="1" height="11" fill="#000" opacity="0.1" />
                  <rect x="0" y="10" width="3" height="9" fill={topColor} />
                  <rect x="0" y="18" width="3" height="3" fill={skinTone.face} />
                  <rect x="13" y="10" width="3" height="9" fill={topColor} />
                  <rect x="12" y="10" width="1" height="9" fill="#000" opacity="0.15" />
                  <rect x="13" y="18" width="3" height="3" fill={skinTone.face} />
                  <rect x="2" y="20" width="12" height="2" fill={pantsColor} />
                  <rect x="2" y="20" width="12" height="2" fill="#000" opacity="0.15" />
                  <rect x="2" y="22" width="5" height="7" fill={pantsColor} />
                  <rect x="8" y="22" width="5" height="7" fill={pantsColor} />
                  <rect x="1" y="23" width="2" height="6" fill="#000" opacity="0.2" />
                  <rect x="7" y="22" width="1" height="7" fill="#000" opacity="0.25" />
                  <rect x="1" y="29" width="6" height="3" fill="#222244" />
                  <rect x="7" y="29" width="6" height="3" fill="#222244" />
                  <rect x="1" y="31" width="6" height="1" fill="#000" />
                  <rect x="7" y="31" width="6" height="1" fill="#000" />
                  {renderAccessory(accessory, topColor)}
                </g>
              </svg>
            </div>
          </div>

          {/* Name Input */}
          <div className="flex flex-col mb-6">
            <label className="text-[#cc0066] text-[8px] mb-2" style={{ filter: 'drop-shadow(1px 1px 0 #fff)' }}>
              PRODUCER NAME
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={12}
              placeholder="ENTER NAME"
              className="bg-[#fff8e7] border-2 border-[#111111] text-[#111111] text-[10px] p-3 w-full uppercase input-caret-cc placeholder-[#888899]"
              style={{ boxShadow: `3px 3px 0 ${C.black}`, fontFamily: "'Press Start 2P', monospace" }}
            />
          </div>

          {/* Enter Button */}
          <button
            onClick={handleEnter}
            className="w-full relative bg-[#ff3399] text-[#ffffff] border-2 border-[#111111] text-[10px] p-4 uppercase flex overflow-hidden hover:brightness-110 active:translate-x-[2px] active:translate-y-[2px]"
            style={{ boxShadow: `4px 4px 0 ${C.black}`, fontFamily: "'Press Start 2P', monospace" }}
          >
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-[#cc0066]" />
            <span className="w-full text-center pl-1" style={{ filter: 'drop-shadow(1px 1px 0 #cc0066)' }}>
              ENTER BEATWORLD
            </span>
          </button>
        </div>
      </div>

      {/* RIGHT PANEL - CUSTOMIZATION OPTIONS */}
      <div className="relative z-20 w-full md:w-1/2 bg-[#fff8e7] md:border-l-[3px] border-[#111111] p-4 md:p-8 h-screen overflow-y-auto custom-scroll-cc" style={{ boxShadow: '-4px 0 12px rgba(0,0,0,0.1)' }}>

        <SectionCard title="SKIN TONE" bgColorIndex={0}>
          <div className="flex flex-wrap gap-3">
            {SKIN_TONES.map((tone, i) => (
              <button key={i} onClick={() => setSkinTone(tone)} className={`w-[40px] h-[40px] swatch-cc ${skinTone.face === tone.face ? 'selected' : ''}`} style={{ backgroundColor: tone.face }} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="HAIR STYLE" bgColorIndex={1}>
          <div className="grid grid-cols-2 gap-2">
            {HAIR_STYLES.map(style => (
              <button key={style} onClick={() => setHairStyle(style)} className={`opt-btn-cc ${hairStyle === style ? 'selected' : ''}`}>{style}</button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="HAIR COLOR" bgColorIndex={2}>
          <div className="flex flex-wrap gap-2">
            {HAIR_COLORS.map(color => (
              <button key={color} onClick={() => setHairColor(color)} className={`w-[28px] h-[28px] swatch-cc ${hairColor === color ? 'selected' : ''}`} style={{ backgroundColor: color }} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="TOP STYLE" bgColorIndex={0}>
          <div className="grid grid-cols-2 gap-2">
            {TOP_STYLES.map(style => (
              <button key={style} onClick={() => setTopStyle(style)} className={`opt-btn-cc ${topStyle === style ? 'selected' : ''}`}>{style}</button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="TOP COLOR" bgColorIndex={1}>
          <div className="flex flex-wrap gap-2">
            {PALETTE_COLORS.map(color => (
              <button key={color} onClick={() => setTopColor(color)} className={`w-[28px] h-[28px] swatch-cc ${topColor === color ? 'selected' : ''}`} style={{ backgroundColor: color }} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="PANTS STYLE" bgColorIndex={2}>
          <div className="grid grid-cols-2 gap-2">
            {PANTS_STYLES.map(style => (
              <button key={style} onClick={() => setPantsStyle(style)} className={`opt-btn-cc ${pantsStyle === style ? 'selected' : ''}`}>{style}</button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="PANTS COLOR" bgColorIndex={0}>
          <div className="flex flex-wrap gap-2">
            {PALETTE_COLORS.slice(0, 10).map(color => (
              <button key={color} onClick={() => setPantsColor(color)} className={`w-[28px] h-[28px] swatch-cc ${pantsColor === color ? 'selected' : ''}`} style={{ backgroundColor: color }} />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="ACCESSORY" bgColorIndex={1}>
          <div className="flex flex-wrap gap-2 pb-8">
            {ACCESSORIES.map(acc => (
              <button
                key={acc}
                onClick={() => setAccessory(acc)}
                className={`w-[40px] h-[40px] flex items-center justify-center border-2 border-[#111111] text-[16px] ${accessory === acc ? 'bg-[#ffee00]' : 'bg-[#fff8e7]'}`}
                style={{
                  boxShadow: accessory === acc ? '0 0 0 2px #111, inset 0 2px 0 rgba(255,255,255,0.4)' : 'inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.2)',
                  fontFamily: acc === 'NONE' ? "'Press Start 2P', monospace" : undefined,
                  fontSize: acc === 'NONE' ? '6px' : undefined,
                }}
              >
                {acc === 'NONE' ? 'NONE' : ACC_EMOJI[acc] || acc}
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
