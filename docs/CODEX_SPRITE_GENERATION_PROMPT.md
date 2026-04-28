# Codex Prompt — Procedural Sprite Generation for Beat World 2.0

**How to use this:** Open Codex in your terminal at `beat-world-2026/` (Codex will auto-discover and read `AGENTS.md`). Paste the entire CONTENTS BELOW THE LINE OF DASHES into Codex as the opening message. Codex generates `src/art/sprites.js` + updates `src/ui/SpriteImage.js` to wire procedural fallback. ~30-60 minutes of agent work.

**Strategy:** Procedural SVG sprites (eboy.com style — built from `<rect>` elements per the V1 design brief precedent). Tiny file size (~5-15 KB total for all sprites combined), infinite scaling, runtime-modifiable colors, no asset loading.

**Hybrid with Gemini Gem:** Codex generates the structurally-clean sprites listed below. The atmospheric scenes (Coney Island sunset, basketball court night, NYC studio bedroom) stay as PNGs from the Gemini Gem workflow specified in `BEATWORLD-APP/SPRITE_PROMPT_PACK_v2.md` (CANONICAL asset spec) — those benefit from organic textures procedural code can't easily produce.

**Visual quality benchmark for procedural sprites:** Match the prompt language and visual targets in `SPRITE_PROMPT_PACK_v2.md` exactly. The procedural sprites are FALLBACKS for when Gemini PNGs aren't yet in place — they should aspire to the same aesthetic that the Gemini prompts describe. If the Gemini prompt for the boombox calls for "twin chrome-rimmed speakers, dual cassette deck, magenta graffiti tag" — your procedural boombox must include all those elements too.

---

```
ROLE: You are a senior pixel-art game developer and SVG specialist working on Beat World 2.0, a Three.js + Tone.js music-production game submitted to Vibe Jam 2026 (deadline May 1, 2026, 13:37 UTC).

PRE-READING (in this order):
1. AGENTS.md in this repo — locked palette, conventions, constraints, current implementation state
2. ../SPRITE_PROMPT_PACK_v2.md — the CANONICAL asset spec describing what the final aesthetic looks like (it's a Gemini Gem prompt operating doc). Your procedural sprites must match the visual targets described there. Specifically read sections 1 (Visual DNA), 4 (Scene Prompts) for the asset descriptions you'll be replicating procedurally, 5 (Sprite Prompts) for character details, 7 (Critic Portrait), and 8 (Standalone Boombox).

Both docs are non-negotiable for your work. Do not proceed without reading them.

GOAL

Create a single new module `src/art/sprites.js` that exports procedural SVG-based pixel art sprite functions for every structurally-clean asset Beat World needs. Each function returns a self-contained SVG string that can be injected into the DOM via `innerHTML` or `<img src="data:image/svg+xml,...">`.

Then, modify `src/ui/SpriteImage.js` to wire this fallback chain: try the requested PNG first → on load failure, render the procedural sprite if available → final fallback to the existing labeled placeholder rectangle.

This means: Nico's Gemini-generated PNGs will take precedence when they arrive in `public/assets/sprites/...`. If they don't arrive (or are slow to land), the procedural sprites ship as a polished mid-tier fallback — way better than placeholder rectangles, and good enough for contest screenshots.

APPROACH — SVG technique

Use SVG with a tight viewBox sized to the design pixel grid (e.g., `viewBox="0 0 32 32"` for a 32x32 design rendered at any display size). Each pixel = one `<rect>` element of 1x1 (or larger) viewBox units. Set `shape-rendering="crispEdges"` on the root `<svg>` to force no anti-aliasing. This produces crisp pixel art at any rendered size via CSS scaling.

EXAMPLE — boombox stub (DO NOT use this exact code, but follow this structure):

```js
export function renderBoombox({ size = 256, glow = false } = {}) {
  const halo = glow ? `<rect x="-2" y="-2" width="36" height="36" fill="#ff3399" opacity="0.3" />` : '';
  return `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" style="width:${size}px;height:${size}px;image-rendering:pixelated">
    ${halo}
    <rect x="2" y="8" width="28" height="20" fill="#1a1a1a"/>
    <rect x="4" y="10" width="9" height="16" fill="#222"/>
    <rect x="19" y="10" width="9" height="16" fill="#222"/>
    <rect x="5" y="11" width="7" height="14" fill="#888"/>
    <rect x="20" y="11" width="7" height="14" fill="#888"/>
    <rect x="6" y="12" width="5" height="12" fill="#1a1a1a"/>
    <rect x="21" y="12" width="5" height="12" fill="#1a1a1a"/>
    <rect x="13" y="13" width="6" height="10" fill="#000"/>
    <rect x="14" y="14" width="4" height="3" fill="#222"/>
    <rect x="11" y="6" width="10" height="2" fill="#1a1a1a"/>
    <rect x="26" y="2" width="1" height="6" fill="#888"/>
    <rect x="3" y="22" width="3" height="2" fill="#ff3399"/>
  </svg>`;
}
```

This boombox is intentionally minimal. Your final boombox should be richer (cassette tape sprockets visible, button row, antenna with telescoping segments, magenta graffiti tag, carrying handle properly modeled). Aim for ~30-60 `<rect>` elements per hero sprite.

REUSABLE SUB-COMPONENTS

To stay DRY, create internal helper functions for common shapes:
- `_drawSpeakerCone(x, y, size, color)` — used in boombox + soundsystem silhouettes
- `_drawCassetteSlot(x, y, color)` — used in boombox
- `_drawHornTweeter(x, y, color)` — used in picó + sonidero silhouettes
- `_drawCabinet(x, y, w, h, color, accent)` — used in bass bottom + warehouse stack
- `_drawNeonLabel(x, y, text, color)` — used for hangar stage labels
- `_drawStarOutline(x, y, size)` — used in magazine cover (5 empty outlines)
- `_drawCRTScanlines(width, height)` — overlay applied to large scenes
- `_drawPixelText(x, y, text, color, scale)` — basic Press Start 2P-style block letters using rect compositions for headers like "MY SOUND SYSTEM"

Keep these as non-exported helpers in the same file. Your final exports list is what scenes call.

LOCKED PALETTE — anchor every sprite to these:

```js
const PALETTE = {
  bgDark: '#0a0a1e',
  magenta: '#ff3399',
  cyan: '#00ddff',
  yellow: '#ffaa00',
  blue: '#0050ff',
  red: '#ff3344',
  lime: '#00cc44',
  pink: '#ff00c8',
  woodDark: '#6b3a1f',
  woodWarm: '#a06b3a',
  concrete: '#4a4a52',
  // Skin tones (use contextually)
  skin1: '#8d5524',  // dark
  skin2: '#a0734a',
  skin3: '#c89372',
  skin4: '#e0b896',
  skin5: '#f5d8b8',  // light
};
```

Export PALETTE as well so other code can reuse the colors.

INTEGRATION with SpriteImage.js

Modify the existing `src/ui/SpriteImage.js` `spriteImage()` helper. Current behavior (per AGENTS.md):
1. Load PNG from `path`
2. On error, render placeholder rect with `[LABEL]`

New behavior:
1. Load PNG from `path`
2. On 404/error: check if a procedural sprite is registered for this `path`. If yes, render the procedural SVG. If no, render the placeholder rect.
3. If `path` is null/undefined but a procedural sprite KEY is provided, render the procedural directly without trying PNG.

Map paths to procedural sprite functions:

```js
const PROCEDURAL_MAP = {
  '/assets/sprites/soundsystem/boombox.png': () => renderBoombox({ size: 256 }),
  '/assets/sprites/soundsystem/boombox-glow.png': () => renderBoombox({ size: 256, glow: true }),
  '/assets/sprites/ui/soundsystem-hangar.png': () => renderHangar({ width: 1920, height: 1080 }),
  '/assets/sprites/ui/review-magazine-cover.png': () => renderMagazineCover({ width: 720, height: 900 }),
  '/assets/sprites/characters/critic-xxl.png': () => renderCriticPortrait({ size: 256 }),
  '/assets/sprites/characters/parts/top-boombap.png': () => renderCharacterZone('top', 'boombap'),
  '/assets/sprites/characters/parts/top-gfunk.png': () => renderCharacterZone('top', 'gfunk'),
  '/assets/sprites/characters/parts/top-punk.png': () => renderCharacterZone('top', 'punk'),
  '/assets/sprites/characters/parts/top-beatmaker.png': () => renderCharacterZone('top', 'beatmaker'),
  '/assets/sprites/characters/parts/mid-boombap.png': () => renderCharacterZone('mid', 'boombap'),
  // ... all 12 character zones
  // ... 5 silhouettes (used as overlay images on the hangar — render at silhouette spot)
};
```

Sprite injection in DOM uses one of two methods:
- **For HTML containers:** set `el.innerHTML = renderBoombox()` directly
- **For `<img>` tags:** convert SVG string to data URL: `el.src = 'data:image/svg+xml;base64,' + btoa(svgString)` (use `btoa(unescape(encodeURIComponent(svgString)))` if the SVG contains non-ASCII chars like emoji 🔒)

Decide which method per use site. For SpriteImage helper, the data-URL `<img>` approach is cleaner since it slots into existing `<img>` elements without DOM restructuring.

SPRITE SPECS — what to generate, in priority order

Generate these in the order listed. Each must be exported from `src/art/sprites.js`. After generating each, run `npm run build` to verify the bundle compiles.

═══════════════════════════════════════════════════════════════════════════════
SPRITE 1 — `renderBoombox({ size, glow })`
═══════════════════════════════════════════════════════════════════════════════

Hero asset. Used in 4 places: hangar slot 1, share artifact, character HUD chip, Coney Island unlock cinematic (if Gemini PNG isn't ready).

ViewBox: 32x32. Default size: 256px. `glow=true` adds a magenta halo behind the body.

Subject: 1980s NYC boombox, 3/4 perspective, twin chrome-rimmed speakers flanking a dual cassette deck.

MUST include:
- Black/dark grey body (mix of #1a1a1a and #222)
- Twin speaker housings with visible chrome rims (#888) and dark cone centers (#1a1a1a)
- Inner cone highlights (small lighter rect) for depth
- Central cassette deck panel (#000) with two visible cassette windows (#222) and tiny tape sprockets (#666)
- Row of small button accents below cassette deck
- Carrying handle on top (curved appearance via 2 stepped rects)
- Telescoping antenna pulled up to upper right (#888, single thin rect)
- Magenta graffiti tag accent on side body (#ff3399, ~3 rects forming a small "tag" shape)
- When glow=true: magenta halo `<rect>` extends 2px outside the body in all directions, opacity 0.3

═══════════════════════════════════════════════════════════════════════════════
SPRITE 2 — `renderSilhouette(rigType, { width, height })`
═══════════════════════════════════════════════════════════════════════════════

Used in hangar stages 2-6 + as compact previews in LevelSelect cards.

ViewBox: 32x48 (taller than wide). Default size: 256x384.

`rigType` enum: 'bass-bottom' | 'baile-funk-bus' | 'pico' | 'sonidero' | 'warehouse-stack'

Each silhouette is a SOLID dark navy (#0a0a1e) shape on transparent background. NO internal detail — the shape itself must be distinctive enough to identify the rig type by silhouette alone.

bass-bottom (Caribbean reggae bass stack):
- Tall vertical column composed of 3-4 stacked speaker boxes
- Each box wider than tall (cabinet aspect)
- Top box smallest (tweeters), middle boxes medium (mids), bottom box biggest (sub) and slightly wider than the rest
- Total height ~36 viewBox units, width ~16

baile-funk-bus (Brazilian baile funk truck speaker wall):
- Horizontal wheeled frame at the bottom (rectangle on 2 small wheel circles approximated as squares)
- 3-4 horn-loaded speakers stacked horizontally on top of the frame
- Each horn flares outward (trapezoid shape via stepped rects)
- Total appearance: wide and squat, like a parade float speaker rig

pico (Colombian picó column):
- Asymmetric tall column
- Wide subwoofer base (rectangle, widest element)
- Multiple narrow vertical speaker stacks rising above the base
- 2-3 small horn tweeters protruding from the top at angles
- Total appearance: hand-built, asymmetric, dramatic

sonidero (Mexican sonidero rig):
- Multi-speaker tower (3-4 speaker boxes stacked vertically)
- A rectangular signage frame on top (like a marquee)
- The signage frame is wider than the speaker tower itself
- Could include a small antenna or flag pole detail at top

warehouse-stack (Berlin Function-One style):
- Industrial monolithic stack — 3 large cabinets stacked vertically
- Symmetrical, clean rectangles with no asymmetry
- Each cabinet identical width
- Slight offset between cabinets to suggest stacking
- Total appearance: brutal, modular, professional

═══════════════════════════════════════════════════════════════════════════════
SPRITE 3 — `renderHangar({ width, height })`
═══════════════════════════════════════════════════════════════════════════════

The soundsystem hangar showcase. Used in SoundsystemRevealScene Stage B.

ViewBox: 192x108 (16:9 aspect). Default size: 1920x1080.

Reference (Nico's refined Gemini Gem prompt — match this aesthetic):
> Pixel art warehouse hangar interior, 16:9, 3/4 perspective. Large gritty music warehouse with high ceilings, exposed steel beams, concrete floor, dark navy #0a0a1e atmosphere, neon magenta #ff3399 strip lights along walls, subtle cyan #00ddff edge highlights, faint floor fog, six evenly spaced empty stage pedestals or floor marks arranged in a horizontal row across the floor. Ceiling spotlights aimed at each pedestal. Top banner area reserved for title text. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, CRT scanlines.

MUST include (in layered render order, back to front):
- Background fill: dark navy #0a0a1e
- Ceiling area (top 30%): exposed steel beam silhouettes (#1a1a2e), 3-4 horizontal beams crossing
- Wall edges left and right: vertical magenta #ff3399 strip lights (long thin rects, low opacity)
- Floor area (bottom 60%): concrete grey #4a4a52 with subtle perspective lines (3-4 horizontal lines getting closer together toward center for depth)
- 6 stage pedestals arranged across the floor at horizontal positions 16%, 30%, 44%, 58%, 72%, 86% (viewBox X). Each pedestal: ~6x2 viewBox units, dark grey #2a2a32, with a small magenta strip light along the front edge
- 6 ceiling spotlights aimed at each pedestal: thin trapezoidal cones of pale yellow (#ffaa00 with low opacity 0.2), originating from the ceiling and widening as they reach the floor. Use a sequence of stacked rects with decreasing width.
- Subtle floor fog: scattered low-opacity white rects along the floor base (~10-15 rects, all with opacity 0.1)
- Top banner area (top 10%): empty space reserved for title text (text rendered separately by the scene, not in this sprite)
- DO NOT render the actual rig pieces or labels here. The scene composites those over the hangar via separate `renderBoombox()` and `renderSilhouette()` calls positioned at each stage.
- CRT scanline overlay: thin horizontal rects every 2 viewBox units, opacity 0.05

═══════════════════════════════════════════════════════════════════════════════
SPRITE 4 — `renderMagazineCover({ width, height })`
═══════════════════════════════════════════════════════════════════════════════

Review screen template. Star fills overlaid by ReviewScene.js separately.

ViewBox: 72x90 (4:5 portrait). Default size: 720x900.

MUST include:
- Background: cream/off-white paper texture (#e8e2d8) with subtle worn-corner darkening (#c4baa8 in corners)
- "XXL MAG" masthead at top: large block-style pixel letters (use `_drawPixelText()` helper) in magenta #ff3399, with a subtle dark navy outline. Spans top ~8 viewBox units.
- Big "WHACK!" headline below masthead: even bigger block letters in yellow #ffaa00 with red #ff3344 burst rays radiating outward (5-6 jagged triangle rects per side). Spans next ~15 viewBox units.
- Star rating row near top-right: 5 EMPTY star outlines (use `_drawStarOutline()` helper). Each star ~4x4 viewBox units, outline color dark grey #4a4a52, NO fill. Position them so ReviewScene.js can overlay filled yellow stars on top by absolute positioning.
- Center area: small dejected producer character silhouette (~10x16 viewBox units) — slumped shoulders, head down, holding a small sampler. Use dark navy silhouette only, no facial detail.
- Critic character silhouette in corner (~8x12 viewBox units) — finger pointing toward the producer, mocking pose. Dark silhouette with one magenta-glowing accent (the gold chain).
- Subhead text strip at bottom: black bar with white pixel text reading "FRESH FACE, STALE BEAT — DJ XXL DESTROYS THE NEW KID"
- Side-article text teasers at left and right margins: smaller pixel text reading things like "HOW NOT TO MIX YOUR DRUMS", "10 REASONS YOUR HOOK SUCKS", "WHY NOBODY GETS PAST 2 STARS IN NYC". Use abbreviated block-letter renders or generic horizontal lines if full text is too detailed at this resolution.
- Magazine paper wear: 4 subtle darker rects in the corners suggesting curl/wear

═══════════════════════════════════════════════════════════════════════════════
SPRITE 5 — `renderCriticPortrait({ size })`
═══════════════════════════════════════════════════════════════════════════════

XXL Mag critic avatar. Used in ReviewScene.

ViewBox: 32x32. Default size: 256.

Subject: head-and-shoulders portrait, 3/4 angle, smug confident expression.

MUST include:
- Background: transparent
- Subtle magenta #ff3399 radial halo behind head (use stepped opacity rects in concentric square pattern, opacity 0.1-0.3)
- Brown skin tone face (#a0734a base)
- Black snapback cap with WHITE "XXL" lettering on the front (3-4 small white rects forming "XXL" pixel text)
- Beard — short black/brown stubble pattern (small dark rects scattered along jawline)
- Smug expression — one slightly raised eyebrow (single rect at angle), slight smirk (asymmetric mouth pixel)
- Black leather jacket lapels visible at shoulders (#1a1a1a)
- White button-up shirt collar peeking under jacket
- Thick gold chain across chest (#ffaa00 chain links)
- Microphone in lower-right area, raised toward bottom of frame (suggests "I'm broadcasting") — handle (#1a1a1a) with mesh grille top (#666)

═══════════════════════════════════════════════════════════════════════════════
SPRITE 6 — `renderCharacterZone(zone, identity, { width, height })`
═══════════════════════════════════════════════════════════════════════════════

The cadaver exquisito system: 12 character zones (top/mid/bottom × 4 identities). Used in CharacterSelectScene + LevelSelect chip + Directory YOU card + Share artifact.

ViewBox: 32x16 per zone (256x128 default render size).

`zone` enum: 'top' | 'mid' | 'bottom'
`identity` enum: 'boombap' | 'gfunk' | 'punk' | 'beatmaker'

CRITICAL: All 4 identities must have the SAME body width at the join lines (top-mid and mid-bottom) so the player's mix-match never looks broken. Recommend body silhouette of width 14 viewBox units (roughly center 7-21 of 32) consistently across all 12 sprites.

═══ TOP zone (head + neck + collarbone) ═══════════════════════════════════════

top-boombap:
- Hood UP over head (dark navy #0a0a1e hood, magenta #ff3399 drawstring tips visible at neckline)
- Calm focused face partially shadowed under hood
- Large over-ear DJ headphones around neck (visible at the bottom edge of the zone — black housings, chrome rim)
- Skin tone: medium #c89372

top-gfunk:
- Backward black snapback cap
- Short fade haircut visible at sides
- Lighter skin tone #e0b896
- Black mustache (small horizontal rect under nose)
- Slight smirk
- Small earring detail (gold dot)

top-punk:
- Magenta mohawk hair (tall vertical strip, #ff3399, several stacked rects of decreasing width toward top)
- Pale skin tone #f5d8b8
- Septum piercing (single white pixel at nose)
- Defiant expression — slight scowl
- Visible jacket collar at neckline (studded leather, #1a1a1a with small white stud dots)

top-beatmaker:
- Round black-frame eyeglasses (two small dark squares with internal lens highlights)
- Short twists/locs hair pattern (multiple small dark rects stacked, dark brown #4a2a14)
- Dark skin tone #8d5524
- Studious neutral expression
- Visible tee neckline (oversized, color matches mid-beatmaker)

═══ MID zone (torso + arms + waist + clothing) ═══════════════════════════════

mid-boombap:
- Black hoodie body (#1a1a1a)
- Magenta drawstring tips visible at chest
- Arms relaxed at sides (sleeves end at hip line, hands not visible)
- Hoodie kangaroo pocket suggested by single horizontal line near belly

mid-gfunk:
- Oversized white basketball jersey body (#f0f0f0, no team logo)
- Gold chain across chest (#ffaa00, visible at top)
- Visible body armholes (jersey cut)
- Arms relaxed at sides

mid-punk:
- Studded black leather jacket open over band tee (#1a1a1a jacket sides, dark grey #2a2a2a tee in middle)
- Small white stud dots scattered along jacket lapels
- Red bandana #ff3344 tied around bicep (left arm)
- Arms relaxed at sides

mid-beatmaker:
- Oversized graphic tee (cyan #00ddff base color)
- "BEAT WORLD" text in black pixel letters across chest (use `_drawPixelText()` smaller scale)
- Arms relaxed at sides

═══ BOTTOM zone (hips + legs + feet + pants + shoes) ═══════════════════════════

bottom-boombap:
- Baggy dark blue jeans (#1a1f3e, wider than the body width at hips, narrowing slightly toward ankles)
- Black-and-white Air Force 1 silhouette sneakers (#000 body with #f0f0f0 sole stripe at base)

bottom-gfunk:
- Khaki cargo shorts (#a08660, ending at mid-thigh)
- Tube socks pulled high (#f0f0f0 vertical strips covering shins)
- Black Chuck Taylor sneakers (#000 body with white #f0f0f0 sole stripe)

bottom-punk:
- Ripped black skinny jeans (#0a0a0a, narrow silhouette, with 2-3 horizontal "rip" gaps showing skin tone underneath)
- Scuffed black combat boots (#1a1a1a body with multiple small grey scuffs, slight chunky heel)

bottom-beatmaker:
- Neon cyan jogger track pants (#00ddff, slightly tapered at ankles)
- White ankle socks visible
- Plain black slip-on shoes (#000)

═══════════════════════════════════════════════════════════════════════════════
ACCEPTANCE CRITERIA
═══════════════════════════════════════════════════════════════════════════════

Run through this before declaring done:

- [ ] `npm run build` completes without errors or warnings
- [ ] `src/art/sprites.js` exports: PALETTE, renderBoombox, renderSilhouette, renderHangar, renderMagazineCover, renderCriticPortrait, renderCharacterZone, PROCEDURAL_MAP
- [ ] `src/ui/SpriteImage.js` updated: PNG-first → procedural fallback → placeholder rect chain
- [ ] All 5 silhouette types render distinct shapes (visually verifiable side-by-side — generate a test page if needed)
- [ ] All 12 character zones (3 zones × 4 identities) render with matching body widths at zone joins
- [ ] Boombox with `glow: true` shows a visible magenta halo
- [ ] Hangar renders the 6 stage spots at the documented horizontal positions (so SoundsystemRevealScene's overlay positioning still aligns)
- [ ] Magazine cover renders with 5 EMPTY star outlines (no fills) so ReviewScene can overlay
- [ ] Critic portrait has the smug expression + visible XXL cap text + gold chain
- [ ] No external dependencies added beyond three + tone (PALETTE is defined inline)
- [ ] Total sprites.js file size under 50 KB
- [ ] Bundle size growth from this change under +20 KB (SVG strings are tiny — if growth is bigger, you're being too verbose)
- [ ] All scenes that previously showed `[LABEL]` placeholders now show procedural sprites (when no PNG present)
- [ ] When a real PNG IS in place, it overrides the procedural sprite (verify by dropping any test PNG in `public/assets/sprites/soundsystem/boombox.png` and reloading)

═══════════════════════════════════════════════════════════════════════════════
ORDER OF OPERATIONS (suggested)
═══════════════════════════════════════════════════════════════════════════════

1. Read AGENTS.md fully. Read `src/ui/SpriteImage.js` to understand current placeholder rendering.
2. Create `src/art/sprites.js` with PALETTE export + helper sub-component stubs.
3. Build SPRITE 1 (boombox) end-to-end. Wire it into SpriteImage.js. Verify in dev server (`npm run dev`, navigate to soundsystemReveal scene).
4. Build SPRITE 5 (critic portrait) — small, high-impact, used in ReviewScene.
5. Build SPRITE 4 (magazine cover) — needs the star outline helper which is reusable.
6. Build SPRITE 6 (12 character zones) — biggest scope, do all 12 in sequence to maintain consistency.
7. Build SPRITE 2 (5 silhouettes) — needed for hangar stages 2-6.
8. Build SPRITE 3 (hangar) — biggest single sprite, do last so all sub-components are mature.
9. Run `npm run build`. Verify bundle size.
10. Manual test: temporarily delete (or rename) any test PNG in `public/assets/sprites/...` and verify procedural fallback renders. Restore the PNG and verify it overrides.

═══════════════════════════════════════════════════════════════════════════════
CUT ORDER if scope balloons or quality bar isn't met
═══════════════════════════════════════════════════════════════════════════════

Sacrifice from top down (least load-bearing first):

1. Reduce hangar detail (drop the perspective floor lines, drop the floor fog, drop CRT scanlines)
2. Simplify magazine cover side-article text to generic horizontal lines (don't render full text)
3. Reduce silhouette internal detail (e.g., bass-bottom = 3 stacked rects instead of 4)
4. Skip character zone fine details (keep clothing color + shape, skip drawstring tips, scuffs, stud dots, jersey armholes)

Do NOT cut: boombox (hero asset), 12 character zones (the cadaver exquisito mechanic depends on these), 5 silhouettes (the hangar mechanic depends on these distinct shapes), magazine cover empty stars (ReviewScene depends on the overlay alignment).

═══════════════════════════════════════════════════════════════════════════════
WHEN YOU FINISH — REPORT BACK
═══════════════════════════════════════════════════════════════════════════════

Report to Nico (who pasted this prompt) with:

1. Confirmation: all acceptance criteria status (✅ or ⚠️ + reason for any not met)
2. Bundle size delta after build
3. File size of `src/art/sprites.js` (should be 30-50 KB)
4. Any deviations from this brief and why
5. List of which SPRITE numbers are fully done vs. partial
6. Suggested manual verification steps for Nico (specifically: which scenes to load to see each procedural sprite)
7. Any TODOs left in code

DO NOT modify scenes outside `src/art/sprites.js` and `src/ui/SpriteImage.js` unless absolutely necessary. If a scene has a structural bug that surfaces during testing, surface it in your report rather than fixing it in this session — keeps the change scope tight.
```

---

## After Codex finishes

1. **Live test:** `npm run dev` → `localhost:3001`. Click through every scene — each PNG-less position should now render a procedural sprite instead of a `[LABEL]` placeholder.
2. **PNG override test:** drop ONE Gemini-generated PNG into the matching path (e.g., `public/assets/sprites/soundsystem/boombox.png`). Reload. The PNG should win over the procedural sprite. This proves the fallback chain.
3. **Build:** `npm run build` — verify clean and check bundle size delta. Procedural sprites should add +5-15 KB total.
4. **Iterate selectively:** if any specific procedural sprite looks weak (e.g., the hangar pedestals look off), feed Codex a follow-up prompt with the specific sprite name + what to fix. Don't re-run the whole thing.

## What this unlocks for the May 1 deadline

- **Guaranteed visual baseline.** Even if zero Gemini PNGs land Tuesday, every screen has on-brand pixel art. Beat World ships looking polished, not placeholder-y.
- **Asset production becomes optional polish, not critical path.** Frees you to focus on the atmospheric scenes (Coney Island, basketball court, NYC studio) where Gemini Gem actually wins.
- **Iteration speed jumps.** Tweaking a sprite color = changing one hex code in `sprites.js`. Tweaking a Gemini PNG = re-prompt + re-generate + re-export.
- **Future levels (post-launch) inherit the system.** Level 2 picó stack, Level 3 baile funk truck, etc. are already silhouettes in this file — just upgrade to detailed sprites when those levels ship.

Sources:
- [eboy.com](https://hello.eboy.com/) — pixel art reference for the rect-composition aesthetic
- [Codex documentation on AGENTS.md](https://platform.openai.com/docs/codex) — repo-level context discovery convention