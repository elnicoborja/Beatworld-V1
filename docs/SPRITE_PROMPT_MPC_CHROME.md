# Beat World — MPC Header Chrome Sprite (CHAKAI ESS2026XS)

**Asset path:** `public/assets/sprites/ui/mpc-chrome.png`
**Dimensions:** 1920×128 (15:1 wide strip)
**Format:** PNG opaque
**Use:** decorative top-of-panel chrome below the studio backdrop. Replaces the CSS-rendered fake-knob strip. Sprite is loaded by `StudioScene._buildMixerChrome()` and renders full-width, cropped center if needed.

**Cultural reference:** AKAI MPC2000XL top panel — the iconic mid-90s/early-2000s sampler hardware. Black plastic body, recessed white screen, encoder knobs, transport buttons, brand badge. The pixel parody is **CHAKAI** (replaces AKAI) and **ESS2026XS** (replaces MPC2000XL — "ESS" hints at El Sound System, "2026XS" rhymes with the original model number).

**Brand-likeness note:** parody only. Original pixel-art lettering, no real AKAI logo, no real screen artwork. Same approach as XXXS/CORNPLEX magazines.

---

## Prompt

```txt
Pixel art horizontal photograph-style top panel of a vintage hip-hop sampler/groovebox in the AKAI MPC2000XL tradition, ultra-wide 15:1 strip, 1920x128. Captures the upper face of a black plastic professional sampler unit as if photographed straight-on from above the front edge — viewer sees the top horizontal band only, NOT the pads. Layout from left to right:

LEFT SECTION — brand badge:
- Black plastic textured surface with subtle scratched patina.
- Bold pixel-art masthead reading CHAKAI in white blocky sans-serif lettering with thin red #ff3344 underline accent. Original parody mark, NOT the real AKAI logo. Small red LED dot above the K letter, glowing.

CENTER-LEFT SECTION — LCD screen:
- Recessed dark grey rectangular LCD window with thin black bezel.
- Inside the LCD: green-on-dark-grey monospace text reading PROJECT: BEAT-WORLD on line 1, BPM 90  4/4  16ST on line 2. Faded scanline texture inside the screen suggesting old monochrome display.

CENTER SECTION — encoder + jog wheel cluster:
- One large circular DATA WHEEL on the right side of the LCD, dark grey plastic with a single white pointer notch at 12 o'clock and concentric ring detail. Subtle drop shadow.
- Three small encoder knobs above or beside the wheel, dark grey with single white pointer marks at varying angles. NO neon glow — keep them muted hardware grey.

CENTER-RIGHT SECTION — transport buttons:
- Six small rectangular grey/black plastic buttons in a horizontal row, labelled in tiny pixel text: REC, PLAY, STOP, |<<, >>|, OVERDUB. White silkscreen lettering on black caps. One button (REC) has a small red LED dot embedded in its corner.

RIGHT SECTION — model badge + meter LEDs:
- Model number badge in pixel-art chrome lettering reading ESS2026XS, slightly raised inset look, with thin gold #ffaa00 underline.
- Strip of 6 small vertical LED meter rectangles right of the badge: green / green / green / yellow / yellow / red, lit at varying levels suggesting a peaking signal meter.

GLOBAL VISUAL DNA:
- Black plastic chassis dominant, with subtle dust/scratch wear texture.
- Hard-edged pixel art, eboy.com 32-bit Sega Genesis fidelity, sharp pixel edges, no anti-aliasing, visible chunky pixels at 1920×128 native.
- All lettering is original pixel-painted, no real AKAI/Roland/Korg logos, no real-product photos.
- Slight CRT scanline overlay across the whole strip for unified texture.
- Mood: lived-in pro-studio gear that has been pushed all night. Working hardware, not a render.
- Background of the strip is opaque dark grey/black; can extend a few pixels off the top/bottom edge into pure black for safe centering when the runtime crops.

Do NOT include: drum pads (those are below the chrome strip and out of frame), full sampler body (only the top horizontal band shown), real AKAI/MPC trademarks, neon glow on knobs (keep them muted hardware), text in non-pixel fonts.
```

---

## Repair prompts (use only if the first generation misses)

```txt
Tighten the brand mark — CHAKAI in bold blocky pixel sans-serif, white letters, thin red underline, original art that parodies the AKAI logo without copying it. The mark should sit clearly on the left third.
```

```txt
Make the LCD screen unmistakable: dark grey recessed rectangle, green monospace pixel text inside reading PROJECT: BEAT-WORLD and BPM 90  4/4  16ST. No real AKAI screen content.
```

```txt
The data wheel and encoders should be muted hardware-grey plastic with single white pointer notches — not glowing neon. The neon belongs in the rest of the UI, not on this hardware strip.
```

```txt
Replace any real model number with ESS2026XS in pixel-chrome lettering on the right side, with a thin gold underline.
```

```txt
Strip is horizontal only — no drum pads, no full sampler body. Just the top band as if cropping the upper 80px of the unit.
```

---

## Production checklist

```md
- [ ] mpc-chrome.png — 1920×128, opaque PNG
- [ ] CHAKAI brand mark left, ESS2026XS model badge right
- [ ] LCD screen with green-on-grey original pixel text
- [ ] Data wheel + 3 encoders, muted grey (NOT neon)
- [ ] 6 transport buttons with REC LED
- [ ] 6-segment LED meter on the right
- [ ] No real AKAI/MPC trademarks
- [ ] Pixel edges crisp at 4x zoom
- [ ] Drop in: public/assets/sprites/ui/mpc-chrome.png
```

Once the file is in place, the runtime auto-uses it (the CSS placeholder vanishes). No code change needed.
