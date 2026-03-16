import { useState } from 'react';
import { useLocation } from 'wouter';
import { useGameState } from '@/hooks/use-game-state';

// ── eboy/Sega Genesis 32-bit color palette ──────────────────────────────────
const SKIN_TONES = [
  { id: 'light',    hex: '#ffd9b5', shadow: '#e8b896', label: 'LIGHT'    },
  { id: 'medium',   hex: '#d4956a', shadow: '#b87840', label: 'MEDIUM'   },
  { id: 'tan',      hex: '#c07840', shadow: '#9a5820', label: 'TAN'      },
  { id: 'brown',    hex: '#8b4513', shadow: '#6b2e08', label: 'BROWN'    },
  { id: 'dark',     hex: '#4a2208', shadow: '#2d1205', label: 'DARK'     },
];

const HAIR_STYLES = [
  { id: 'fade',       label: 'FADE'      },
  { id: 'afro',       label: 'AFRO'      },
  { id: 'dread',      label: 'DREADS'    },
  { id: 'mohawk',     label: 'MOHAWK'    },
  { id: 'braids',     label: 'BRAIDS'    },
  { id: 'bun',        label: 'BUN'       },
  { id: 'straight',   label: 'STRAIGHT'  },
  { id: 'caesar',     label: 'CAESAR'    },
];

const HAIR_COLORS = [
  '#1a0a00', '#3d2200', '#8b4513', '#c8a87a',
  '#ffff00', '#ff00ff', '#00ffff', '#ff4444',
  '#00ff88', '#7744ff', '#ffffff', '#ff8800',
];

const TOPS = [
  { id: 'hoodie',     label: 'HOODIE'    },
  { id: 'jersey',     label: 'JERSEY'    },
  { id: 'tracksuit',  label: 'TRACKSUIT' },
  { id: 'tee',        label: 'OVERSIZED TEE' },
  { id: 'windbreaker',label: 'WINDBREAKER' },
  { id: 'bomber',     label: 'BOMBER'    },
];

const PANTS = [
  { id: 'baggy',  label: 'BAGGY'  },
  { id: 'jogger', label: 'JOGGER' },
  { id: 'cargo',  label: 'CARGO'  },
  { id: 'jeans',  label: 'JEANS'  },
  { id: 'shorts', label: 'SHORTS' },
  { id: 'tights', label: 'TIGHTS' },
];

const ACCESSORIES = [
  { id: 'none',       label: 'NONE',       emoji: '—'  },
  { id: 'headphones', label: 'HEADPHONES', emoji: '🎧' },
  { id: 'cap',        label: 'SNAPBACK',   emoji: '🧢' },
  { id: 'glasses',    label: 'GLASSES',    emoji: '🕶️' },
  { id: 'chain',      label: 'CHAIN',      emoji: '⛓️' },
  { id: 'bandana',    label: 'BANDANA',    emoji: '🔴' },
];

const TOP_COLORS = [
  '#0050ff','#ff0000','#00cc00','#ff00cc','#ff8800',
  '#00ffff','#ffff00','#ffffff','#111111','#7700ff',
  '#ff4488','#44aaff',
];

const PANTS_COLORS = [
  '#111133','#1a1a1a','#003388','#550022','#2a4a00',
  '#888888','#ff00ff','#00ffff','#ff8800','#ffffff',
];

// ── Character SVG Sprite ─────────────────────────────────────────────────────
function CharacterSprite({ char }: { char: CharacterState }) {
  const s = SKIN_TONES.find(x => x.id === char.skinTone) ?? SKIN_TONES[0];
  const skin = s.hex;
  const skinShadow = s.shadow;
  const hair = char.hairColor;
  const top = char.topColor;
  const pants = char.pantsColor;

  // Pixel size: each "pixel" = 4px in an 80×160 canvas → renders at 2x
  return (
    <svg
      width="96"
      height="192"
      viewBox="0 0 24 48"
      style={{ imageRendering: 'pixelated' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Shoes ── */}
      <rect x="5"  y="44" width="5" height="3" fill="#222" />
      <rect x="14" y="44" width="5" height="3" fill="#222" />
      <rect x="5"  y="46" width="6" height="1" fill="#444" />
      <rect x="13" y="46" width="6" height="1" fill="#444" />

      {/* ── Pants ── */}
      {char.pantsStyle === 'baggy' && <>
        <rect x="4"  y="30" width="7"  height="14" fill={pants} />
        <rect x="13" y="30" width="7"  height="14" fill={pants} />
        <rect x="4"  y="30" width="16" height="5"  fill={pants} />
        <rect x="5"  y="31" width="5"  height="12" fill="#00000020" />
      </>}
      {char.pantsStyle === 'jogger' && <>
        <rect x="5"  y="30" width="6"  height="13" fill={pants} />
        <rect x="13" y="30" width="6"  height="13" fill={pants} />
        <rect x="5"  y="30" width="14" height="5"  fill={pants} />
        <rect x="5"  y="41" width="6"  height="2"  fill="#00000040" />
        <rect x="13" y="41" width="6"  height="2"  fill="#00000040" />
      </>}
      {char.pantsStyle === 'cargo' && <>
        <rect x="5"  y="30" width="6"  height="14" fill={pants} />
        <rect x="13" y="30" width="6"  height="14" fill={pants} />
        <rect x="5"  y="30" width="14" height="5"  fill={pants} />
        <rect x="6"  y="36" width="4"  height="3"  fill="#00000040" />
        <rect x="14" y="36" width="4"  height="3"  fill="#00000040" />
      </>}
      {(char.pantsStyle === 'jeans' || !['baggy','jogger','cargo','shorts','tights'].includes(char.pantsStyle)) && <>
        <rect x="5"  y="30" width="6"  height="14" fill={pants} />
        <rect x="13" y="30" width="6"  height="14" fill={pants} />
        <rect x="5"  y="30" width="14" height="5"  fill={pants} />
        <rect x="10" y="30" width="4"  height="14" fill="#00000020" />
      </>}
      {char.pantsStyle === 'shorts' && <>
        <rect x="5"  y="30" width="6"  height="7"  fill={pants} />
        <rect x="13" y="30" width="6"  height="7"  fill={pants} />
        <rect x="5"  y="30" width="14" height="5"  fill={pants} />
        <rect x="5"  y="37" width="6"  height="7"  fill={skinShadow} />
        <rect x="13" y="37" width="6"  height="7"  fill={skinShadow} />
      </>}
      {char.pantsStyle === 'tights' && <>
        <rect x="6"  y="30" width="5"  height="14" fill={pants} />
        <rect x="13" y="30" width="5"  height="14" fill={pants} />
        <rect x="6"  y="30" width="12" height="5"  fill={pants} />
      </>}

      {/* ── Top / body ── */}
      {char.topStyle === 'hoodie' && <>
        <rect x="4"  y="18" width="16" height="14" fill={top} />
        <rect x="1"  y="20" width="5"  height="10" fill={top} />
        <rect x="18" y="20" width="5"  height="10" fill={top} />
        {/* Pocket */}
        <rect x="9"  y="26" width="6"  height="4"  fill="#00000030" />
        {/* Hood fold */}
        <rect x="8"  y="18" width="8"  height="2"  fill="#00000025" />
        {/* Cuffs */}
        <rect x="1"  y="29" width="5"  height="2"  fill="#00000030" />
        <rect x="18" y="29" width="5"  height="2"  fill="#00000030" />
      </>}
      {char.topStyle === 'jersey' && <>
        <rect x="4"  y="18" width="16" height="14" fill={top} />
        <rect x="1"  y="20" width="5"  height="10" fill={top} />
        <rect x="18" y="20" width="5"  height="10" fill={top} />
        {/* Side stripes */}
        <rect x="4"  y="19" width="2"  height="13" fill="#00000025" />
        <rect x="18" y="19" width="2"  height="13" fill="#00000025" />
        {/* Number */}
        <rect x="10" y="22" width="4"  height="6"  fill="#ffffff30" />
      </>}
      {char.topStyle === 'tracksuit' && <>
        <rect x="4"  y="18" width="16" height="14" fill={top} />
        <rect x="1"  y="20" width="5"  height="10" fill={top} />
        <rect x="18" y="20" width="5"  height="10" fill={top} />
        {/* Stripes on arms */}
        <rect x="2"  y="22" width="3"  height="2"  fill="#ffffff50" />
        <rect x="19" y="22" width="3"  height="2"  fill="#ffffff50" />
        <rect x="2"  y="25" width="3"  height="2"  fill="#ffffff50" />
        <rect x="19" y="25" width="3"  height="2"  fill="#ffffff50" />
        {/* Zipper */}
        <rect x="11" y="18" width="2"  height="14" fill="#00000030" />
      </>}
      {(char.topStyle === 'tee' || !['hoodie','jersey','tracksuit','windbreaker','bomber'].includes(char.topStyle)) && <>
        <rect x="5"  y="18" width="14" height="13" fill={top} />
        <rect x="2"  y="20" width="5"  height="9"  fill={top} />
        <rect x="17" y="20" width="5"  height="9"  fill={top} />
        {/* Wrinkle detail */}
        <rect x="10" y="22" width="4"  height="1"  fill="#00000020" />
        <rect x="8"  y="26" width="8"  height="1"  fill="#00000020" />
      </>}
      {char.topStyle === 'windbreaker' && <>
        <rect x="4"  y="18" width="16" height="14" fill={top} />
        <rect x="1"  y="20" width="5"  height="10" fill={top} />
        <rect x="18" y="20" width="5"  height="10" fill={top} />
        {/* Panel contrast */}
        <rect x="4"  y="18" width="8"  height="14" fill={top} />
        <rect x="12" y="18" width="8"  height="14" fill="#00000030" />
        <rect x="11" y="18" width="2"  height="14" fill="#ffffff40" />
      </>}
      {char.topStyle === 'bomber' && <>
        <rect x="4"  y="18" width="16" height="13" fill={top} />
        <rect x="1"  y="20" width="5"  height="9"  fill={top} />
        <rect x="18" y="20" width="5"  height="9"  fill={top} />
        {/* Ribbed cuffs & collar */}
        <rect x="1"  y="28" width="5"  height="2"  fill="#00000040" />
        <rect x="18" y="28" width="5"  height="2"  fill="#00000040" />
        <rect x="4"  y="30" width="16" height="2"  fill="#00000040" />
      </>}

      {/* ── Neck ── */}
      <rect x="10" y="15" width="4" height="4" fill={skin} />

      {/* ── Head ── */}
      <rect x="7"  y="7"  width="10" height="9"  fill={skin}       />
      <rect x="6"  y="8"  width="12" height="7"  fill={skin}       />
      {/* Face shadow side */}
      <rect x="15" y="8"  width="2"  height="7"  fill={skinShadow} />
      {/* Eyes */}
      <rect x="9"  y="10" width="2"  height="2"  fill="#1a0a00"    />
      <rect x="13" y="10" width="2"  height="2"  fill="#1a0a00"    />
      {/* Eye shine */}
      <rect x="9"  y="10" width="1"  height="1"  fill="#ffffff"    />
      <rect x="13" y="10" width="1"  height="1"  fill="#ffffff"    />
      {/* Nose */}
      <rect x="11" y="12" width="2"  height="1"  fill={skinShadow} />
      {/* Mouth */}
      <rect x="10" y="14" width="4"  height="1"  fill={skinShadow} />

      {/* ── Hair (style-dependent) ── */}
      {char.hairStyle === 'fade' && <>
        <rect x="7"  y="4"  width="10" height="5"  fill={hair} />
        <rect x="6"  y="5"  width="12" height="4"  fill={hair} />
        <rect x="8"  y="7"  width="8"  height="2"  fill={hair} />
      </>}
      {char.hairStyle === 'afro' && <>
        <rect x="5"  y="2"  width="14" height="9"  fill={hair} />
        <rect x="4"  y="4"  width="16" height="7"  fill={hair} />
        <rect x="3"  y="6"  width="18" height="5"  fill={hair} />
        <rect x="5"  y="2"  width="2"  height="2"  fill="#00000020" />
        <rect x="17" y="2"  width="2"  height="2"  fill="#00000020" />
      </>}
      {char.hairStyle === 'dread' && <>
        <rect x="6"  y="3"  width="12" height="5"  fill={hair} />
        {/* Dreads hanging */}
        <rect x="6"  y="8"  width="2"  height="8"  fill={hair} />
        <rect x="9"  y="8"  width="2"  height="10" fill={hair} />
        <rect x="12" y="8"  width="2"  height="9"  fill={hair} />
        <rect x="15" y="8"  width="2"  height="7"  fill={hair} />
        <rect x="4"  y="8"  width="2"  height="6"  fill={hair} />
      </>}
      {char.hairStyle === 'mohawk' && <>
        <rect x="10" y="1"  width="4"  height="8"  fill={hair} />
        <rect x="9"  y="3"  width="6"  height="6"  fill={hair} />
        {/* Shaved sides */}
        <rect x="6"  y="7"  width="3"  height="2"  fill={skinShadow} />
        <rect x="15" y="7"  width="3"  height="2"  fill={skinShadow} />
      </>}
      {char.hairStyle === 'braids' && <>
        <rect x="6"  y="3"  width="12" height="5"  fill={hair} />
        {/* Braid rows */}
        <rect x="7"  y="8"  width="3"  height="9"  fill={hair} />
        <rect x="11" y="8"  width="3"  height="10" fill={hair} />
        <rect x="15" y="8"  width="2"  height="7"  fill={hair} />
        <rect x="7"  y="9"  width="3"  height="1"  fill="#00000030" />
        <rect x="7"  y="12" width="3"  height="1"  fill="#00000030" />
        <rect x="11" y="10" width="3"  height="1"  fill="#00000030" />
        <rect x="11" y="13" width="3"  height="1"  fill="#00000030" />
      </>}
      {char.hairStyle === 'bun' && <>
        <rect x="8"  y="4"  width="8"  height="5"  fill={hair} />
        <rect x="7"  y="5"  width="10" height="4"  fill={hair} />
        {/* Bun knot */}
        <rect x="10" y="2"  width="4"  height="4"  fill={hair} />
        <rect x="11" y="2"  width="2"  height="2"  fill="#00000030" />
      </>}
      {char.hairStyle === 'straight' && <>
        <rect x="6"  y="4"  width="12" height="5"  fill={hair} />
        {/* Side lengths */}
        <rect x="6"  y="9"  width="2"  height="7"  fill={hair} />
        <rect x="16" y="9"  width="2"  height="7"  fill={hair} />
        {/* Fringe */}
        <rect x="8"  y="6"  width="8"  height="2"  fill={hair} />
      </>}
      {char.hairStyle === 'caesar' && <>
        <rect x="7"  y="5"  width="10" height="4"  fill={hair} />
        <rect x="6"  y="6"  width="12" height="3"  fill={hair} />
        {/* Caesar line */}
        <rect x="6"  y="8"  width="12" height="1"  fill="#00000040" />
      </>}

      {/* ── Accessory ── */}
      {char.accessory === 'headphones' && <>
        <rect x="4"  y="6"  width="3"  height="6"  fill="#222"    />
        <rect x="17" y="6"  width="3"  height="6"  fill="#222"    />
        <rect x="3"  y="8"  width="4"  height="4"  fill="#444"    />
        <rect x="17" y="8"  width="4"  height="4"  fill="#444"    />
        <rect x="7"  y="4"  width="10" height="2"  fill="#333"    />
        {/* Cushion */}
        <rect x="3"  y="9"  width="4"  height="3"  fill="#666"    />
        <rect x="17" y="9"  width="4"  height="3"  fill="#666"    />
      </>}
      {char.accessory === 'cap' && <>
        <rect x="6"  y="4"  width="12" height="4"  fill="#0050ff" />
        <rect x="5"  y="5"  width="14" height="3"  fill="#0050ff" />
        {/* Brim */}
        <rect x="4"  y="7"  width="16" height="2"  fill="#003acc" />
        {/* Logo */}
        <rect x="11" y="5"  width="2"  height="2"  fill="#ffffff" />
      </>}
      {char.accessory === 'glasses' && <>
        <rect x="8"  y="10" width="3"  height="2"  fill="#000000aa" />
        <rect x="13" y="10" width="3"  height="2"  fill="#000000aa" />
        <rect x="8"  y="9"  width="3"  height="1"  fill="#444"    />
        <rect x="13" y="9"  width="3"  height="1"  fill="#444"    />
        <rect x="11" y="10" width="2"  height="1"  fill="#555"    />
        <rect x="6"  y="10" width="2"  height="1"  fill="#555"    />
        <rect x="16" y="10" width="2"  height="1"  fill="#555"    />
      </>}
      {char.accessory === 'chain' && <>
        <rect x="9"  y="17" width="6"  height="1"  fill="#ffcc00" />
        <rect x="10" y="18" width="4"  height="1"  fill="#ffcc00" />
        <rect x="11" y="19" width="2"  height="2"  fill="#ffcc00" />
        {/* Pendant */}
        <rect x="11" y="21" width="2"  height="2"  fill="#ffaa00" />
      </>}
      {char.accessory === 'bandana' && <>
        <rect x="6"  y="9"  width="12" height="3"  fill="#ff0000aa" />
        <rect x="7"  y="9"  width="10" height="2"  fill="#ff000080" />
      </>}
    </svg>
  );
}

// ── Swatch Row ───────────────────────────────────────────────────────────────
function SwatchRow({ colors, selected, onSelect }: {
  colors: string[];
  selected: string;
  onSelect: (c: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {colors.map(c => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className="w-6 h-6 transition-all duration-75 hover:scale-110"
          style={{
            background: c,
            border: selected === c ? '2px solid #fff' : '1px solid #444',
            boxShadow: selected === c ? `0 0 8px ${c}` : 'none',
            imageRendering: 'pixelated',
          }}
        />
      ))}
    </div>
  );
}

// ── Option Row ───────────────────────────────────────────────────────────────
function StyleRow({ options, selected, onSelect }: {
  options: { id: string; label: string; emoji?: string }[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {options.map(o => (
        <button
          key={o.id}
          onClick={() => onSelect(o.id)}
          className="px-2 py-1 text-[7px] transition-all duration-75 hover:scale-105 active:scale-95"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            background: selected === o.id ? '#ff00ff' : '#111',
            color: selected === o.id ? '#000' : '#aaa',
            border: selected === o.id ? '1px solid #ff88ff' : '1px solid #333',
            boxShadow: selected === o.id ? '0 0 8px #ff00ff88' : 'none',
          }}
        >
          {o.emoji ? `${o.emoji} ` : ''}{o.label}
        </button>
      ))}
    </div>
  );
}

// ── Section Label ────────────────────────────────────────────────────────────
function Label({ children }: { children: string }) {
  return (
    <p className="text-[8px] text-secondary mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>
      {children}
    </p>
  );
}

// ── Character State Type ─────────────────────────────────────────────────────
export interface CharacterState {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  topStyle: string;
  topColor: string;
  pantsStyle: string;
  pantsColor: string;
  accessory: string;
}

const DEFAULT_CHARACTER: CharacterState = {
  skinTone: 'medium',
  hairStyle: 'fade',
  hairColor: '#1a0a00',
  topStyle: 'hoodie',
  topColor: '#0050ff',
  pantsStyle: 'baggy',
  pantsColor: '#111133',
  accessory: 'headphones',
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function CharacterCreator() {
  const [, setLocation] = useLocation();
  const { state, updateState } = useGameState();

  const [char, setChar] = useState<CharacterState>(
    (state.character as any)?.skinTone ? (state.character as any) : DEFAULT_CHARACTER
  );
  const [name, setName] = useState(state.playerName || '');

  const set = (key: keyof CharacterState, val: string) =>
    setChar(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    if (!name.trim()) return;
    updateState({ character: char as any, playerName: name.trim() });
    setLocation('/map');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-6 px-4 relative overflow-y-auto">
      <div className="absolute inset-0 scanlines pointer-events-none z-10" />

      {/* Grid bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,255,255,0.04) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,0,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <h1
        className="text-xl neon-text-primary mb-6 z-20 text-center"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        CREATE PRODUCER
      </h1>

      <div className="flex flex-col md:flex-row gap-8 z-20 w-full max-w-4xl">
        {/* ── Left: Preview ── */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          {/* Character display */}
          <div
            className="relative flex items-center justify-center"
            style={{
              width: 160,
              height: 240,
              background: 'linear-gradient(180deg, #0a0a2a 0%, #141428 100%)',
              border: '2px solid #ff00ff44',
              boxShadow: '0 0 24px #ff00ff22, inset 0 0 30px #00000080',
            }}
          >
            {/* Platform shadow */}
            <div
              className="absolute bottom-6 w-20 h-3 rounded-full"
              style={{ background: 'radial-gradient(ellipse, #ff00ff33 0%, transparent 70%)' }}
            />
            {/* Character */}
            <div className="mb-4">
              <CharacterSprite char={char} />
            </div>
            {/* Floor line */}
            <div
              className="absolute bottom-8 w-24 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #ff00ff66, transparent)' }}
            />
          </div>

          {/* Name */}
          <div className="w-full" style={{ maxWidth: 160 }}>
            <Label>PRODUCER NAME</Label>
            <input
              type="text"
              value={name}
              maxLength={12}
              onChange={e => setName(e.target.value.toUpperCase())}
              placeholder="YOUR NAME"
              className="w-full bg-black text-white px-2 py-2 text-[9px] focus:outline-none"
              style={{
                fontFamily: "'Press Start 2P', monospace",
                border: '2px solid #ff00ff',
                boxShadow: '0 0 8px #ff00ff44',
              }}
            />
            <p className="text-[6px] text-gray-600 mt-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              {name.length}/12 CHARS
            </p>
          </div>

          {/* Enter */}
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="w-full py-3 text-[9px] transition-all duration-100 active:scale-95"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              background: name.trim() ? '#ff00ff' : '#333',
              color: name.trim() ? '#000' : '#666',
              border: name.trim() ? '2px solid #ff88ff' : '2px solid #444',
              boxShadow: name.trim() ? '0 0 16px #ff00ff88' : 'none',
              maxWidth: 160,
            }}
          >
            ENTER WORLD →
          </button>
        </div>

        {/* ── Right: Customization ── */}
        <div
          className="flex-1 flex flex-col gap-4 p-4"
          style={{ background: '#050510', border: '1px solid #222' }}
        >
          {/* Skin */}
          <div>
            <Label>SKIN TONE</Label>
            <div className="flex gap-2 flex-wrap">
              {SKIN_TONES.map(s => (
                <button
                  key={s.id}
                  onClick={() => set('skinTone', s.id)}
                  className="flex flex-col items-center gap-1 transition-all hover:scale-105"
                >
                  <div
                    className="w-8 h-8"
                    style={{
                      background: s.hex,
                      border: char.skinTone === s.id ? '2px solid #fff' : '1px solid #333',
                      boxShadow: char.skinTone === s.id ? `0 0 8px ${s.hex}` : 'none',
                    }}
                  />
                  <span className="text-[6px] text-gray-500" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                    {s.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Hair style */}
          <div>
            <Label>HAIR STYLE</Label>
            <StyleRow options={HAIR_STYLES} selected={char.hairStyle} onSelect={v => set('hairStyle', v)} />
          </div>

          {/* Hair color */}
          <div>
            <Label>HAIR COLOR</Label>
            <SwatchRow colors={HAIR_COLORS} selected={char.hairColor} onSelect={v => set('hairColor', v)} />
          </div>

          {/* Top */}
          <div>
            <Label>TOP STYLE</Label>
            <StyleRow options={TOPS} selected={char.topStyle} onSelect={v => set('topStyle', v)} />
          </div>

          {/* Top color */}
          <div>
            <Label>TOP COLOR</Label>
            <SwatchRow colors={TOP_COLORS} selected={char.topColor} onSelect={v => set('topColor', v)} />
          </div>

          {/* Pants */}
          <div>
            <Label>PANTS STYLE</Label>
            <StyleRow options={PANTS} selected={char.pantsStyle} onSelect={v => set('pantsStyle', v)} />
          </div>

          {/* Pants color */}
          <div>
            <Label>PANTS COLOR</Label>
            <SwatchRow colors={PANTS_COLORS} selected={char.pantsColor} onSelect={v => set('pantsColor', v)} />
          </div>

          {/* Accessory */}
          <div>
            <Label>ACCESSORY</Label>
            <StyleRow options={ACCESSORIES} selected={char.accessory} onSelect={v => set('accessory', v)} />
          </div>
        </div>
      </div>
    </div>
  );
}
