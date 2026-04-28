# Beat World — Game Art & Sprite Prompt Pack v2

**Status:** CANONICAL asset spec for Level 1 NYC. Supersedes `ILLUSTRATION_PROMPTS_LEVEL_1.md` (kept in repo for historical reference only). All Gemini Gem / Midjourney / DALL-E generations should follow THIS doc.

**Purpose:** production-ready prompt kit for generating Level 1 NYC game art assets, sprite sources, and sliced character parts. Use this as the Gemini Gem / Midjourney / DALL-E prompt operating doc, then hand finished PNGs to Claude Code in the expected asset paths.

---

## 1. Gemini Gem System Instructions

Paste this as the persistent Gem instruction before generating any individual asset.

```md
You are the art production assistant for Beat World, a pixel-art music game set in NYC Level 1.

Your job is to generate game-ready visual prompts and revise image-generation outputs toward consistent production assets.

GLOBAL VISUAL DNA
- Pixel art in the eboy.com / 32-bit Sega Genesis / SNES / Mega Drive tradition.
- Sharp pixel edges. No anti-aliasing. No smoothing. No blur.
- Isometric or 3/4 perspective unless an asset says otherwise.
- Low-resolution chunky detail with modern color depth.
- Subtle CRT scanline overlay where appropriate.
- Neon glow only on signs, light sources, UI accents, or unlock effects.
- Pixel borders, hard-edged shadows, visible individual pixels.

COLOR PALETTE
- Background dark navy: #0a0a1e
- Neon magenta primary: #ff3399
- Neon cyan secondary: #00ddff
- Neon yellow accent: #ffaa00
- Electric blue: #0050ff
- Bright red: #ff3344
- Lime green: #00cc44
- Hot pink: #ff00c8
- Skin tones: #8d5524, #a0734a, #c89372, #e0b896, #f5d8b8
- Wood tones: #6b3a1f, #a06b3a
- Concrete grey: #4a4a52

STRICT AVOID
- Photorealism
- Smooth vector art
- Anime
- Pixar / Disney look
- Painterly rendering
- Watercolor
- Soft gradients
- 3D render aesthetics
- Modern Apple devices unless explicitly requested
- Real brand logos or trademarked marks

OUTPUT DISCIPLINE
- Always follow requested dimensions and transparency.
- For opaque scenes, create full-frame background art.
- For sprites, use transparent background only.
- For character source sprites, keep identical pose, body proportions, crop, and baseline.
- For text-heavy assets, prioritize readable layout and leave text compositing to pixel editor if the generator garbles lettering.
```

---

## 2. Global Negative Prompt

Use this negative prompt for almost every asset.

```txt
photorealistic, high-resolution digital painting, smooth vector, soft gradients, blur, anti-aliasing, 3D render, Pixar style, Disney style, anime, watercolor, glossy UI, realistic lighting, cinematic realism, clean minimalist interior, modern Apple devices, brand logos, trademarked logos, illegible text, distorted typography, extra limbs, malformed hands, background on transparent sprite, drop shadow on sprite
```

---

## 3. Production Order

1. Generate standalone boombox and critic portrait first.
2. Generate the 4 full-body source characters using the same seed and identical pose language.
3. Slice the 4 characters into 12 parts.
4. Generate magazine cover and Coney Island unlock scene.
5. Generate studio backdrop and basketball court.
6. Generate hangar last, preferably as a composite rather than relying on a single generation.

---

## 4. Scene Prompts

### Asset 1 — Studio Backdrop: `public/assets/sprites/venues/studio-nyc.png`

Dimensions: 1920×540
Format: PNG opaque
Aspect: 16:5 ultra-wide
Use: Top half of Studio scene.

```txt
Pixel art bedroom-studio interior in 3/4 isometric perspective, ultra-wide 16:5 aspect ratio, 1920x540. A small New York apartment bedroom studio at dusk, seen from the player's seated point of view, with the lower foreground left open for the sequencer UI overlay. Left third: apartment window showing NYC skyline silhouette, water tower, fire escape edge, brick building across the street, and distant skyscrapers. Right third: friend character sitting on a worn couch or beanbag, holding a pizza slice, headphones around neck, casually nodding to the beat. Center area has negative space and desk edge implying the producer is the camera. Warm desk lamp glow #ffaa00 creates a focused pool of light. Walls are cluttered with posters, one readable poster says BEAT WORLD in neon pixel text, plus vinyl record outlines and boombox silhouettes. Small CRT TV on a milk crate, screen off, reflecting lamp light. Vintage boombox in the corner as foreshadowing. Small houseplant, cassette tapes, sticker-covered notebook, half-eaten Chinese takeout, messy creative clutter. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, visible individual pixels, dark navy #0a0a1e base, neon magenta #ff3399, neon cyan #00ddff, neon yellow #ffaa00 accents, subtle CRT scanlines. Lived-in, scrappy, hopeful, late-afternoon into evening mood.
```

Repair prompts:

```txt
Keep the same composition, but add more negative space in the center for UI overlay and remove any visible producer character.
```

```txt
Keep the same scene, but make the NYC identity clearer: visible rooftop water tower, fire escape, brick building, and skyline silhouette through the left window.
```

---

### Asset 2 — Basketball Court Gig: `public/assets/sprites/venues/gig-bk-court.png`

Dimensions: 1920×1080
Format: PNG opaque
Aspect: 16:9
Use: Performance scene background.

```txt
Pixel art outdoor NYC basketball court at night, 16:9 wide aspect ratio, 1920x1080, 3/4 elevated perspective looking down at a chain-link fenced asphalt court. Center court: a tricked-out oversized vintage boombox, the largest and most important object in the scene, twin chrome speakers, dual cassette decks, antenna up, glowing subtly with neon magenta #ff3399 and cyan #00ddff accents. Around it are 6 to 10 silhouetted neighborhood figures with neon rim highlights: some sitting on left-side bleachers, some standing, one in a backspin breakdance pose. One warm streetlight pole casts a cone of orange/yellow light #ffaa00 across the cracked asphalt. Faded paint lines, scattered leaves, weathered court texture. Basketball hoop on one side, rusted backboard, rim with no net. Background beyond fence: brownstones and tenement buildings with warm lit windows, faint steam rising from street vents. Pixel graffiti on wall reading BEAT WORLD and BK. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, visible chunky pixels, dark navy #0a0a1e night palette, CRT scanlines. Grassroots neighborhood happening, not a formal concert.
```

Repair prompts:

```txt
Make the boombox much larger and more heroic, clearly the focal point of the basketball court scene.
```

```txt
Remove arena/stage elements. This should feel like an informal neighborhood gathering around a boombox on asphalt.
```

---

### Asset 3 — Magazine Cover Roast: `public/assets/sprites/ui/review-magazine-cover.png`

Dimensions: 720×900
Format: PNG opaque
Aspect: 4:5
Use: Review screen centerpiece.

Important: this is a template. Star fills should be dynamic in code. Generate 5 empty grey star outlines only.

```txt
Pixel art hip-hop industry magazine cover template, 4:5 portrait aspect ratio, 720x900. Fake magazine called XXL MAG, stylized original pixel lettering, not the real logo. Top masthead: XXL MAG in large bold Press Start 2P style pixel font with neon magenta #ff3399 glow. Huge central headline: WHACK! in readable yellow #ffaa00 capital letters, placed over a jagged comic-book starburst in bright red #ff3344. Rating row near top-right or upper center: exactly 5 EMPTY grey star outlines, no filled stars, no yellow filled stars, because code will overlay rating later. Center: small dejected producer silhouette with slumped shoulders, head down, holding a sampler. Corner: smug critic character pointing and laughing, roast-battle energy. Bottom subhead text strip: FRESH FACE, STALE BEAT. Add smaller side article blocks that suggest hip-hop critique, but keep any small text secondary and graphic if unreadable. Slight magazine paper texture and worn pixel corners. Dark navy #0a0a1e shadows, neon magenta/cyan/yellow accents. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing. Funny, self-deprecating, not cruel.
```

Manual compositing note:

```md
If text is garbled, keep the generated cover art but manually add masthead, WHACK!, empty stars, and bottom subhead in a pixel editor. Text readability matters more than one-shot generation purity.
```

---

### Asset 4 — Boombox Unlock, Coney Island: `public/assets/sprites/soundsystem/boombox-unlock-coney-island.png`

Dimensions: 1920×1080
Format: PNG opaque
Aspect: 16:9
Use: First soundsystem piece reveal.

```txt
Pixel art Coney Island boardwalk at sunset, 16:9 wide aspect ratio, 1920x1080, cinematic 3/4 perspective. Wooden boardwalk planks dominate the foreground and run diagonally toward the horizon for depth. Center-left foreground: vintage hip-hop boombox hero object, large and prominent, with glowing magenta halo #ff3399 behind it to signal newly unlocked. Mid-background: Coney Island Cyclone wooden roller coaster, iconic lattice track silhouette clearly recognizable and prominent. Right side: pier-side arcade building with a readable neon sign saying F. SOCIETY ARCADE, pixel-art neon letters glowing magenta #ff3399 and cyan #00ddff, slight buzzing flicker feeling. Far background: Atlantic Ocean horizon, sunset clouds in deep magenta #ff3399, hot pink #ff00c8, orange #ffaa00. Quiet beach barely visible below boardwalk, faint footprints in sand, one pigeon on railing, optional distant walking silhouette for scale. Dark navy #0a0a1e shadows, subtle CRT scanlines, eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing. Cinematic, melancholic, reverent, the boombox is the protagonist.
```

Repair prompts:

```txt
Make the Cyclone roller coaster more recognizable: wooden lattice structure, sweeping track silhouette, clearly Coney Island.
```

```txt
Make the boombox larger in the foreground and remove foreground people stealing focus.
```

---

### Asset 5 — Soundsystem Hangar: `public/assets/sprites/ui/soundsystem-hangar.png`

Dimensions: 1920×1080
Format: PNG opaque
Aspect: 16:9
Use: Rig progress showcase.

Recommended approach: generate the hangar base first, then composite the six stages, labels, silhouettes, and boombox manually.

#### Base hangar prompt

```txt
Pixel art warehouse hangar interior, 16:9 wide aspect ratio, 1920x1080, 3/4 perspective. Large gritty music warehouse with high ceilings, exposed steel beams, concrete floor, dark navy #0a0a1e atmosphere, neon magenta #ff3399 strip lights along walls, subtle cyan #00ddff edge highlights, faint floor fog, six evenly spaced empty stage pedestals or floor marks arranged in a horizontal row across the floor. Ceiling spotlights aimed at each pedestal. Top banner area reserved for title text. No equipment yet, no labels yet, no characters. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, CRT scanlines. Aspirational, cinematic, quiet pride.
```

#### Composite layer instructions

```md
Add these elements manually or through separate generation passes:

Header: MY SOUND SYSTEM
Stage 1: Fully visible NYC boombox, magenta glow, label: L1 · NYC · BOOMBOX ✓
Stage 2: Solid dark silhouette, reggae bass stack, label: L2 · CARIBBEAN · BASS BOTTOM 🔒
Stage 3: Solid dark silhouette, wheeled baile funk speaker bus, label: L3 · BRAZIL · BAILE FUNK BUS 🔒
Stage 4: Solid dark silhouette, Colombian picó column, label: L4 · COLOMBIA · PICÓ STACK 🔒
Stage 5: Solid dark silhouette, Mexican sonidero rig with signage frame, label: L5 · MEXICO · SONIDERO RIG 🔒
Stage 6: Solid dark silhouette, Berlin warehouse stack, label: L6 · BERLIN · WAREHOUSE STACK 🔒
```

#### One-shot prompt, only if needed

```txt
Pixel art warehouse interior in 3/4 perspective, 16:9 wide aspect ratio, 1920x1080. A gritty music hangar with high ceilings, exposed beams, concrete floor, neon magenta #ff3399 strip lights, dark navy #0a0a1e atmosphere, subtle floor fog, faint ceiling spotlights. Six stage pedestals arranged horizontally across the floor. Stage 1 leftmost: fully rendered NYC hip-hop boombox with twin chrome speakers and cassette deck, magenta glow halo, unlocked. Stages 2 through 6: solid dark navy/black silhouettes only, no internal detail, each with a distinct shape: tall reggae bass stack with deep sub base; wheeled Brazilian baile funk speaker bus with horn-loaded speakers; Colombian picó column with asymmetric tall shape and horn tweeter outline; Mexican sonidero rig with signage frame on top; Berlin industrial monolithic warehouse speaker stack. Header banner at top reads MY SOUND SYSTEM in Press Start 2P pixel font, magenta neon glow. Keep locked rigs as silhouettes only. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, CRT scanlines. Aspirational and cinematic.
```

---

## 5. Sprite Prompts

### Sprite Global Rule

All four full-body character source sprites must be generated with the exact same crop, pose, proportions, and baseline.

```txt
Full-body isolated sprite, transparent background, 256x384, 2:3 aspect ratio. Neutral standing 3/4 pose facing camera. Both arms relaxed straight down at sides. Hands empty. Both feet planted slightly apart on one flat baseline. Top of head touches the same upper crop zone. Bottom of shoes touches the same lower crop zone. Same body width at waist. No props, no held instruments, no background, no drop shadow. Designed to be sliced into three horizontal 256x128 parts at y=128 and y=256.
```

### 6a — Boom Bap Producer Source

Output temporary source: `source-boombap-256x384.png`
Sliced outputs:
- `public/assets/sprites/characters/parts/top-boombap.png`
- `public/assets/sprites/characters/parts/mid-boombap.png`
- `public/assets/sprites/characters/parts/bottom-boombap.png`

```txt
Pixel art full-body character sprite, 256x384, 2:3 aspect ratio, transparent background. Neutral standing 3/4 pose facing camera, both arms relaxed straight down at sides, hands empty, both feet planted slightly apart on a flat baseline, same crop and proportions as a modular character sprite. Young hip-hop boom bap producer, medium racially ambiguous skin tone, mid-20s, calm focused expression. Wearing black hoodie with hood up, magenta #ff3399 drawstring tips, large over-ear DJ headphones hanging around neck, baggy dark blue/grey jeans, generic black-and-white classic sneakers with no brand logo. Subtle dark navy #0a0a1e outline. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, transparent background only. Designed for cadaver-exquisito slicing into top, torso, and legs.
```

### 6b — G-Funk DJ Source

Output temporary source: `source-gfunk-256x384.png`
Sliced outputs:
- `public/assets/sprites/characters/parts/top-gfunk.png`
- `public/assets/sprites/characters/parts/mid-gfunk.png`
- `public/assets/sprites/characters/parts/bottom-gfunk.png`

```txt
Pixel art full-body character sprite, 256x384, 2:3 aspect ratio, transparent background. Neutral standing 3/4 pose facing camera, both arms relaxed straight down at sides, hands empty, both feet planted slightly apart on a flat baseline, same crop and proportions as a modular character sprite. West coast G-funk DJ, lighter skin tone, late-20s, mustache, slight smirk. Wearing oversized white basketball jersey with no team logo, black snapback cap worn backward, gold chain necklace, khaki cargo shorts, high tube socks, generic black Chuck Taylor-style sneakers with no brand logo. Subtle dark navy #0a0a1e outline. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, transparent background only. Designed for cadaver-exquisito slicing into top, torso, and legs.
```

### 6c — Punk Producer Source

Output temporary source: `source-punk-256x384.png`
Sliced outputs:
- `public/assets/sprites/characters/parts/top-punk.png`
- `public/assets/sprites/characters/parts/mid-punk.png`
- `public/assets/sprites/characters/parts/bottom-punk.png`

```txt
Pixel art full-body character sprite, 256x384, 2:3 aspect ratio, transparent background. Neutral standing 3/4 pose facing camera, both arms relaxed straight down at sides, hands empty, both feet planted slightly apart on a flat baseline, same crop and proportions as a modular character sprite. Punk-rock crossover producer, pale skin tone, early-20s, defiant expression, septum piercing. Bright magenta #ff3399 mohawk. Wearing studded black leather jacket open over a generic band tee, red #ff3344 bandana tied around bicep not neck, ripped black skinny jeans, scuffed black combat boots. Subtle dark navy #0a0a1e outline. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, transparent background only. Designed for cadaver-exquisito slicing into top, torso, and legs.
```

### 6d — Studio Beatmaker Source

Output temporary source: `source-beatmaker-256x384.png`
Sliced outputs:
- `public/assets/sprites/characters/parts/top-beatmaker.png`
- `public/assets/sprites/characters/parts/mid-beatmaker.png`
- `public/assets/sprites/characters/parts/bottom-beatmaker.png`

```txt
Pixel art full-body character sprite, 256x384, 2:3 aspect ratio, transparent background. Neutral standing 3/4 pose facing camera, both arms relaxed straight down at sides, hands empty, both feet planted slightly apart on a flat baseline, same crop and proportions as a modular character sprite. Studio beatmaker, dark skin tone, early-30s, studious focused expression, short twists or locs, round black-frame glasses. Wearing oversized graphic tee with BEAT WORLD in pixel lettering on chest, neon cyan #00ddff jogger track pants, plain black slip-on shoes. Subtle dark navy #0a0a1e outline. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, transparent background only. Designed for cadaver-exquisito slicing into top, torso, and legs.
```

---

## 6. Slicing Instructions

Slice each 256×384 source character into three horizontal 256×128 PNGs.

```md
Top zone: y=0 to y=128
Mid zone: y=128 to y=256
Bottom zone: y=256 to y=384
```

Save exactly:

```txt
public/assets/sprites/characters/parts/top-boombap.png
public/assets/sprites/characters/parts/top-gfunk.png
public/assets/sprites/characters/parts/top-punk.png
public/assets/sprites/characters/parts/top-beatmaker.png
public/assets/sprites/characters/parts/mid-boombap.png
public/assets/sprites/characters/parts/mid-gfunk.png
public/assets/sprites/characters/parts/mid-punk.png
public/assets/sprites/characters/parts/mid-beatmaker.png
public/assets/sprites/characters/parts/bottom-boombap.png
public/assets/sprites/characters/parts/bottom-gfunk.png
public/assets/sprites/characters/parts/bottom-punk.png
public/assets/sprites/characters/parts/bottom-beatmaker.png
```

QA after slicing:

```md
Layer these test combinations to catch seams:
1. top-punk + mid-gfunk + bottom-beatmaker
2. top-boombap + mid-punk + bottom-gfunk
3. top-beatmaker + mid-boombap + bottom-punk

Reject and regenerate any source sprite where:
- neck does not align at y=128
- waist width does not align at y=256
- hands cross slice boundaries unpredictably
- shoes are cropped
- body scale differs visibly from the other three
```

---

## 7. Critic Portrait: `public/assets/sprites/characters/critic-xxl.png`

Dimensions: 256×256
Format: PNG transparent
Use: Review avatar.

```txt
Pixel art head-and-shoulders character portrait, 256x256 square, transparent background. Hip-hop industry critic in 3/4 angle, looking slightly toward viewer with smug confident expression, slight smirk, one raised eyebrow, intimidating but funny. Black snapback cap with stylized XXL white pixel lettering, original design not real brand logo. Prominent thick gold chain, black leather jacket over button-up shirt. Brown skin tone, full beard with subtle grey strands, mid-30s. Holding microphone raised slightly at bottom of frame as if broadcasting a review. Subtle magenta #ff3399 radial glow halo behind head, contained inside transparent PNG. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing. Critic-as-heel mood: smug, knowing, about to roast your beat.
```

Repair prompts:

```txt
Make the critic less friendly and more smug: raised eyebrow, slight smirk, about to roast the worst beat he has heard today.
```

---

## 8. Standalone Boombox: `public/assets/sprites/soundsystem/boombox.png`

Dimensions: 256×256
Format: PNG transparent
Use: Hangar Stage 1, unlock scene compositing, share artifact.

```txt
Pixel art standalone vintage 1980s NYC boombox, 256x256 square, transparent background. Front-facing with slight 3/4 angle for depth. Twin large chrome-rimmed speakers, central dual cassette deck with two cassette doors and visible tape sprockets, telescoping antenna pulled up to upper-right, large carrying handle on top, black plastic body, small magenta #ff3399 graffiti tag on side, cyan #00ddff tiny LED details, yellow #ffaa00 highlights on knobs. Detailed but readable at small sizes. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, no background, no drop shadow. Hero object, iconic and reusable.
```

---

## 9. Claude Code Handoff Checklist

Before dropping assets into repo:

```md
- [ ] File names exactly match expected paths.
- [ ] Scene files are opaque PNGs.
- [ ] Sprite files are transparent PNGs.
- [ ] Character parts are exactly 256×128.
- [ ] Character sources were sliced at y=128 and y=256.
- [ ] Boombox and critic are exactly 256×256.
- [ ] Studio backdrop is exactly 1920×540.
- [ ] Court, Coney Island, and hangar are exactly 1920×1080.
- [ ] Magazine cover is exactly 720×900.
- [ ] No real brand logos are visible.
- [ ] Pixel edges remain crisp at 4x zoom.
- [ ] Text that must be readable has been manually corrected if needed.
- [ ] Empty star outlines remain empty on magazine template.
```

---

## 10. Priority if Time Runs Out

Critical:
1. `public/assets/sprites/ui/soundsystem-hangar.png`
2. `public/assets/sprites/venues/studio-nyc.png`
3. `public/assets/sprites/soundsystem/boombox.png`

High impact:
4. `public/assets/sprites/soundsystem/boombox-unlock-coney-island.png`
5. `public/assets/sprites/characters/critic-xxl.png`

Medium:
6. `public/assets/sprites/ui/review-magazine-cover.png`
7. `public/assets/sprites/venues/gig-bk-court.png`

Can ship placeholders temporarily:
8. 4 character source sprites and 12 sliced character parts.

---

## 11. Fast Prompting Pattern

For each asset generation, use this sequence:

```md
1. Paste Gemini Gem system instructions.
2. Paste the exact asset prompt.
3. Paste global negative prompt if supported.
4. Generate 3-4 variants.
5. Choose the strongest composition, not the cleanest polish.
6. Use repair prompts for only the failed constraint.
7. Manually composite text and labels when needed.
8. Export exact dimensions and file path.
```

---

## 12. Path note (CRITICAL — Vite convention)

All paths above use `public/assets/...` (NOT `assets/...`). This is the on-disk location. The URL in code is `/assets/...` (Vite serves files in `public/` at root URL paths). Do not confuse the two. Reference: `beat-world-2026/public/assets/README.md`.
