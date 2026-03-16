import type { ReactNode } from 'react';

interface SpriteProps {
  skinTone: string;
  skinShadow: string;
  hairColor: string;
  hairStyle: string;
  topColor: string;
  pantsColor: string;
  accessory: string;
  angle: number;
  size?: number;
}

function shade(col: string, amt: number) {
  const c = col.startsWith('#') ? col.slice(1) : col;
  const num = parseInt(c, 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0xff) + amt));
  return '#' + ((b | (g << 8) | (r << 16)) >>> 0).toString(16).padStart(6, '0');
}

function IsoBox({ x, y, w, d, h, topC, leftC, rightC }: {
  x: number; y: number; w: number; d: number; h: number; topC: string; leftC: string; rightC: string;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <polygon points={`0,0 ${w},${-w * 0.5} ${w + d},${-w * 0.5 + d * 0.5} ${d},${d * 0.5}`} fill={topC} />
      <polygon points={`0,0 ${d},${d * 0.5} ${d},${d * 0.5 + h} 0,${h}`} fill={leftC} />
      <polygon points={`${d},${d * 0.5} ${w + d},${-w * 0.5 + d * 0.5} ${w + d},${-w * 0.5 + d * 0.5 + h} ${d},${d * 0.5 + h}`} fill={rightC} />
    </g>
  );
}

function renderDirection(props: SpriteProps, dir: 'SE' | 'SW' | 'NW' | 'NE'): ReactNode {
  const { skinTone, skinShadow, hairColor, hairStyle, topColor, pantsColor, accessory } = props;
  const topDark = shade(topColor, -30);
  const topLight = shade(topColor, 20);
  const pantsDark = shade(pantsColor, -30);
  const pantsLight = shade(pantsColor, 20);
  const shoeDark = '#1a1a2e';
  const shoeLight = '#2a2a44';
  const shoeTop = '#333355';

  const showFace = dir === 'SE' || dir === 'SW';
  const flipX = dir === 'SW' || dir === 'NW';

  const faceLeft = showFace ? skinTone : skinShadow;
  const faceRight = showFace ? skinShadow : skinTone;
  const faceTop = skinTone;

  const bodyLeft = flipX ? topLight : topDark;
  const bodyRight = flipX ? topDark : topLight;

  const pantsLeft = flipX ? pantsLight : pantsDark;
  const pantsRight = flipX ? pantsDark : pantsLight;

  const hairTop = hairStyle === 'BALD' ? faceTop : hairColor;
  const hairShow = hairStyle !== 'BALD';
  const hairTall = hairStyle === 'AFRO' || hairStyle === 'SPIKES';
  const hairLong = hairStyle === 'DREADS' || hairStyle === 'PONYTAIL' || hairStyle === 'MOP';

  return (
    <g transform={flipX ? 'scale(-1,1) translate(-40,0)' : ''}>
      {/* Shadow on ground */}
      <ellipse cx="20" cy="48" rx="10" ry="4" fill="#000" opacity="0.2" />

      {/* SHOES */}
      <IsoBox x={6} y={42} w={7} d={7} h={3} topC={shoeTop} leftC={shoeDark} rightC={shoeLight} />
      <IsoBox x={18} y={36} w={7} d={7} h={3} topC={shoeTop} leftC={shoeDark} rightC={shoeLight} />

      {/* LEGS */}
      <IsoBox x={8} y={34} w={6} d={6} h={8} topC={pantsColor} leftC={pantsLeft} rightC={pantsRight} />
      <IsoBox x={18} y={30} w={6} d={6} h={6} topC={pantsColor} leftC={pantsLeft} rightC={pantsRight} />

      {/* TORSO */}
      <IsoBox x={6} y={18} w={14} d={14} h={14} topC={topColor} leftC={bodyLeft} rightC={bodyRight} />

      {/* CENTER SEAM */}
      <line x1="13" y1="18" x2="13" y2="32" stroke="#000" strokeWidth="0.3" opacity="0.15" />

      {/* ARMS */}
      <IsoBox x={0} y={20} w={5} d={5} h={12} topC={topColor} leftC={bodyLeft} rightC={bodyRight} />
      <IsoBox x={0} y={32} w={4} d={4} h={3} topC={faceTop} leftC={faceLeft} rightC={faceRight} />
      <IsoBox x={22} y={14} w={5} d={5} h={12} topC={topColor} leftC={bodyLeft} rightC={bodyRight} />
      <IsoBox x={22} y={26} w={4} d={4} h={3} topC={faceTop} leftC={faceLeft} rightC={faceRight} />

      {/* NECK */}
      <IsoBox x={11} y={14} w={6} d={6} h={4} topC={faceTop} leftC={faceLeft} rightC={faceRight} />

      {/* HEAD */}
      <IsoBox x={8} y={2} w={10} d={10} h={12} topC={faceTop} leftC={faceLeft} rightC={faceRight} />

      {/* HAIR */}
      {hairShow && (
        <>
          <IsoBox x={7} y={hairTall ? -4 : 0} w={12} d={12} h={hairTall ? 6 : 3} topC={hairColor} leftC={shade(hairColor, -20)} rightC={shade(hairColor, -40)} />
          {!showFace && hairLong && (
            <IsoBox x={9} y={6} w={8} d={8} h={10} topC={shade(hairColor, -10)} leftC={shade(hairColor, -30)} rightC={shade(hairColor, -50)} />
          )}
        </>
      )}

      {/* FACE DETAILS (only on front-facing views) */}
      {showFace && (
        <>
          {/* Eyes */}
          <rect x="11" y="7" width="2" height="2" fill="#111" />
          <rect x="16" y="5" width="2" height="2" fill="#111" />
          <rect x="11" y="7" width="1" height="1" fill="#fff" />
          <rect x="16" y="5" width="1" height="1" fill="#fff" />
          {/* Mouth */}
          <rect x="12" y="10" width="3" height="1" fill="#cc3333" />
        </>
      )}

      {/* ACCESSORIES */}
      {accessory === 'HEADPHONES' && (
        <>
          <IsoBox x={6} y={3} w={14} d={2} h={2} topC="#666" leftC="#555" rightC="#444" />
          <IsoBox x={5} y={5} w={3} d={3} h={5} topC="#888" leftC="#666" rightC="#555" />
          <IsoBox x={21} y={1} w={3} d={3} h={5} topC="#888" leftC="#666" rightC="#555" />
        </>
      )}
      {accessory === 'SNAPBACK' && (
        <IsoBox x={6} y={-2} w={14} d={14} h={3} topC={topColor} leftC={shade(topColor, -20)} rightC={shade(topColor, -40)} />
      )}
      {accessory === 'SUNGLASSES' && showFace && (
        <>
          <rect x="10" y="5" width="4" height="3" fill="#000088" opacity="0.85" rx="0" />
          <rect x="15" y="3" width="4" height="3" fill="#000088" opacity="0.85" rx="0" />
          <rect x="14" y="5" width="1" height="1" fill="#aaa" />
        </>
      )}
      {accessory === 'CHAIN' && (
        <>
          <rect x="10" y="22" width="8" height="1" fill="#ffdd00" />
          <rect x="12" y="23" width="4" height="3" fill="#ffaa00" />
          <rect x="13" y="24" width="2" height="2" fill="#ffdd00" />
        </>
      )}
      {accessory === 'BANDANA' && (
        <>
          <rect x="8" y="6" width="12" height="3" fill={topColor} opacity="0.9" />
          <rect x="9" y="7" width="1" height="1" fill="#fff" />
          <rect x="12" y="6" width="1" height="1" fill="#fff" />
          <rect x="16" y="8" width="1" height="1" fill="#fff" />
          <rect x="18" y="7" width="1" height="1" fill="#fff" />
        </>
      )}
    </g>
  );
}

export default function IsometricSprite({ skinTone, skinShadow, hairColor, hairStyle, topColor, pantsColor, accessory, angle, size = 128 }: SpriteProps) {
  const normalizedAngle = ((angle % 360) + 360) % 360;

  let dir: 'SE' | 'SW' | 'NW' | 'NE';
  if (normalizedAngle < 90) dir = 'SE';
  else if (normalizedAngle < 180) dir = 'SW';
  else if (normalizedAngle < 270) dir = 'NW';
  else dir = 'NE';

  return (
    <svg viewBox="-5 -10 50 65" width={size} height={size * 1.2} style={{ imageRendering: 'pixelated', overflow: 'visible' }}>
      {renderDirection({ skinTone, skinShadow, hairColor, hairStyle, topColor, pantsColor, accessory, angle }, dir)}
    </svg>
  );
}
