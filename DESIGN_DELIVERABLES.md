# Beat World 2.0 — Design Deliverables

**Last updated:** 2026-04-13
**Deadline:** May 1, 2026 (submit before 13:37 UTC)
**Style:** Pixel art — dark navy base (#0a0a1e), neon accents (cyan/pink/gold)
**Reference:** V1 assets in `replit-V1/artifacts/beatworld/public/images/`
**Output folder:** `beat-world-2026/assets/` → subfolders by type
**Font in all UI mockups:** Press Start 2P (Google Fonts)

---

## Art Style Guide

All assets must follow the V1 established style:

- **Palette base:** Deep navy (#0a0a1e, #121228), dark cobalt (#003399, #002266)
- **Accent neons:** Hot pink (#ff3399), cyan (#00ffff), gold/amber (#ffaa00), lime (#44cc00)
- **Secondary:** Orange (#ff8800), red (#cc3300), purple (#aa44ff, #6600cc)
- **Neutrals:** Dark gray (#334455), mid gray (#888899), cream (#fff8e7), white (#ffffff)
- **Rendering:** Visible pixels at zoom but clean at display resolution. Not extreme low-res (8×8) — more detailed pixel art (studio-bg.png is the reference: ~480p with visible pixel edges)
- **Lighting:** Neon glow effects, light bleed on edges, dark backgrounds with high-contrast subjects
- **Mood:** Underground music culture, global, energetic, slightly futuristic

---

## 1. WORLD MAP

### 1A. World Map Background

| Spec | Value |
|------|-------|
| **File** | `assets/maps/world-map-bg.png` |
| **Size** | 1920×1080 px |
| **Format** | PNG-24, transparent ocean areas OK |
| **Priority** | 🔴 CRITICAL — Week 1 |

**Description:** Top-down/slight-isometric world map showing all continents. Dark ocean, colored land masses. This replaces the V1 holographic globe (which was 2D backdrop). The Three.js scene renders 3D continent blocks on top, so this can be flat or serve as the ocean floor texture.

**Design notes:**
- Ocean: deep navy (#1a4558) with subtle grid lines (#1d5468 at 15% opacity)
- Continents should be recognizable but stylized (pixel art, not photorealistic)
- Land colors: green variants (#3d8b3d, #5aad5a, #2a6a2a) by region
- Include subtle latitude/longitude grid lines (neon cyan, very low opacity)
- Optional: small iconic landmarks at city locations (Statue of Liberty for NYC, Eiffel Tower for Paris, etc.)

### 1B. City Markers / Icons (23 cities)

| Spec | Value |
|------|-------|
| **Files** | `assets/sprites/city-icons/{city-id}.png` (one per city) |
| **Size** | 32×32 px each |
| **Format** | PNG-32 with transparency |
| **Priority** | 🟡 MEDIUM — Week 2 |

**Description:** Iconic pixel art markers for each city on the world map. Each should reflect the city's genre/culture. Color-coded by level.

**Level → Color mapping:**
- Level 1 (pink #ff3399): New York, Los Angeles, Detroit
- Level 2 (orange #ff8800): Puerto Rico, Dominican Republic, Medellín
- Level 3 (green #44cc00): Rio de Janeiro, Fortaleza, São Paulo, Luanda
- Level 4 (cyan #00ccff): Bogotá, Buenos Aires, Santiago
- Level 5 (yellow #ffee00): Mexico City, Monterrey, Tulum
- Level 6+ (various): London, Newcastle, Brighton, Amsterdam, Paris, Berlin, Moscow, Sydney

**Per-city icon suggestions:**

| City | Genre | Icon idea |
|------|-------|-----------|
| New York | Hip Hop | Boombox / turntable |
| Los Angeles | West Coast | Lowrider / palm tree |
| Detroit | Techno | Gear / circuit |
| Puerto Rico | Reggaeton | Palm + speaker |
| Dominican Republic | Fast Dembow | Drum |
| Medellín | Reggaeton | Flower + beat |
| Rio de Janeiro | Baile Funk | Carnival mask |
| Fortaleza | Psytrance | Cactus + spiral |
| São Paulo | Minimal Techno | Skyline |
| Luanda | Kuduro | Djembe drum |
| Bogotá | Drum & Bass | Mountain + wave |
| Buenos Aires | Tech House | Tango + EQ |
| Santiago | Trap | Andes + 808 |
| Mexico City | Cumbia | Mariachi hat + speaker |
| Monterrey | Tribal | Mountain + fire |
| Tulum | Organic House | Pyramid + leaf |
| London | Garage | Phone booth / crown |
| Newcastle | Jungle | Factory + vinyl |
| Brighton | Broken Beat | Beach + wave |
| Amsterdam | Trance | Windmill + laser |
| Paris | French Touch | Eiffel + disco ball |
| Berlin | Hard Techno | Wall + strobe |
| Moscow | Hard Techno | Star + synth |
| Sydney | Deep House | Opera house |

### 1C. Region Badges

| Spec | Value |
|------|-------|
| **Files** | `assets/sprites/regions/{region}.png` |
| **Size** | 64×24 px each |
| **Format** | PNG-32 with transparency |
| **Priority** | 🟢 LOW — Week 3 |

**Regions:** north-america, caribbean, south-america, central-america, europe, africa, oceania

---

## 2. CHARACTER SPRITES

### 2A. Player Character Base Sprite Sheet

| Spec | Value |
|------|-------|
| **File** | `assets/sprites/character/base-sheet.png` |
| **Frame size** | 48×64 px per frame |
| **Sheet layout** | Grid: rows = variants, columns = animation frames |
| **Format** | PNG-32 with transparency |
| **Priority** | 🔴 CRITICAL — Week 1 |

**Description:** Modular character sprite system. The character creator allows these combinations:

**Skin tones (5 rows):**

| # | Face | Shadow | Label |
|---|------|--------|-------|
| 1 | #ffe0bd | #d4a97a | Light |
| 2 | #f1c27d | #c8903a | Medium-Light |
| 3 | #c68642 | #9a6020 | Medium |
| 4 | #8d5524 | #6b3a10 | Medium-Dark |
| 5 | #3d1c02 | #2a1000 | Dark |

**Hair styles (12 options):** FADE, DREADS, SPIKES, BUZZ, MOP, PONYTAIL, AFRO, BRAIDS, MOHAWK, LONG, BUN, BALD

**Hair colors (12 options):** #111111, #443322, #884411, #ddaa55, #ffee00, #ffffff, #ff3399, #00ffff, #ff0000, #00cc00, #9900cc, #ff8800

**Top styles (6):** TEE, HOODIE, JACKET, TANK, JERSEY, SUIT

**Pants styles (6):** JEANS, CARGOS, SHORTS, TRACK, SWEATS, SLACKS

**Accessories (8):** NONE, HEADPHONES, SNAPBACK, SUNGLASSES, CHAIN, BANDANA, BEANIE, EARRING

**Approach options:**
- **Option A (Full sprite sheets):** Pre-render every combination. 5 skins × 12 hair × 6 tops × 6 pants = 2,160 combos. NOT feasible.
- **Option B (Layered parts) — RECOMMENDED:** Create separate layers that composite at runtime:
  - `body-{skinTone}.png` — 5 base body sprites (48×64 px)
  - `hair-{style}.png` — 12 hair sprites (48×32 px, positioned top)
  - `top-{style}.png` — 6 top sprites (48×32 px, positioned mid, tint-able)
  - `pants-{style}.png` — 6 pants sprites (48×32 px, positioned bottom, tint-able)
  - `acc-{accessory}.png` — 8 accessory overlays (48×64 px, positioned contextually)
  - Hair and clothing sprites should be WHITE/GRAY so the code can tint them to any palette color

**Animation frames (per part):** idle (2 frames), walk-down (4 frames)
- Minimum viable: just idle (2 frames bobbing)

### 2B. Guest Producer Portraits (23 NPCs)

| Spec | Value |
|------|-------|
| **Files** | `assets/sprites/producers/{city-id}.png` |
| **Size** | 128×128 px each |
| **Format** | PNG-32 with transparency |
| **Priority** | 🟡 MEDIUM — Week 2–3 |

**Description:** Each city has a guest producer NPC who introduces the genre and comments on your beats. These appear as portrait thumbnails in the studio intro and mastering screens.

**Style:** Same as V1's critic-1.png — vibrant pixel art portrait, bust/headshot, dark background, neon lighting. Each should have:
- Distinct personality matching their genre
- Skin tone as specified in game data
- Accessory as specified (headphones, bandana, or none)
- Top color as specified

**Full NPC list:**

| City | Name | Skin | Top Color | Accessory |
|------|------|------|-----------|-----------|
| New York | DJ PRIMO | #8d5524 | #111133 | headphones |
| Los Angeles | DR. SYNTH | #6f4e37 | #ffffff | bandana |
| Detroit | JUAN ATKINZ | #6f4e37 | #222244 | headphones |
| Puerto Rico | LUNY | #c68642 | #ff3399 | none |
| Dominican Republic | BLIN BLIN | #8d5524 | #ffee00 | none |
| Medellín | TAINY 2.0 | #c68642 | #0050cc | headphones |
| Rio | MC VOLTAGEM | #6f4e37 | #44cc00 | bandana |
| Fortaleza | SHIVA BASS | #f1c27d | #6600cc | none |
| São Paulo | ANNA TECH | #f1c27d | #111133 | headphones |
| Luanda | DJ ZNOBIA | #6f4e37 | #ff3300 | none |
| Bogotá | JUNGLE JC | #c68642 | #ff8800 | bandana |
| Buenos Aires | HERNAN C | #f1c27d | #cc3300 | headphones |
| Santiago | PABLITO MIX | #c68642 | #6600cc | bandana |
| Mexico City | NORTEC COLLECTIVE | #c68642 | #44cc00 | none |
| Monterrey | DJ TRIBAL MX | #8d5524 | #ff0000 | bandana |
| Tulum | PACHANGA BOYS | #f1c27d | #228844 | none |
| London | MC SKEPTA 2.0 | #6f4e37 | #111133 | headphones |
| Newcastle | JUNGLE BROTHER UK | #6f4e37 | #006600 | bandana |
| Brighton | BONOBO 2.0 | #f1c27d | #335577 | headphones |
| Amsterdam | TIESTO JR | #ffe0bd | #ff8800 | headphones |
| Paris | DAFT PUNK III | #ffe0bd | #222222 | none |
| Berlin | BERGHAIN BOSS | #ffe0bd | #111111 | none |
| Moscow | HARD SLAVIC | #ffe0bd | #cc0000 | bandana |
| Sydney | FLUME 2.0 | #ffe0bd | #0066cc | headphones |

---

## 3. STUDIO / SEQUENCER SCREENS

### 3A. Studio Interior Backgrounds (23 cities)

| Spec | Value |
|------|-------|
| **Files** | `assets/sprites/studios/{city-id}-studio.png` |
| **Size** | 960×540 px (renders at 50% behind sequencer overlay) |
| **Format** | PNG-24 or JPEG (no transparency needed) |
| **Priority** | 🟡 MEDIUM — Week 2 |

**Description:** Background illustration behind the sequencer grid, visible in the top half of the screen. Each studio should reflect the city's vibe and genre.

**V1 reference:** `studio-bg.png` — dark room with mixing console, neon lights, keyboards, cables, character at center.

**Design approach:** Create 5–7 base studio templates (one per level/region), then color-shift/detail-swap for city variants:

| Template | Cities | Vibe |
|----------|--------|------|
| Basement Studio | New York, Detroit | Gritty, concrete walls, vinyl crates, boombox |
| Beach Studio | LA, Puerto Rico, Tulum, Brighton | Open windows, palm trees visible, white surfaces |
| Club Booth | São Paulo, Berlin, Amsterdam, Buenos Aires | DJ booth, LED walls, dark crowd below |
| Street Setup | Rio, Luanda, Dominican Republic, Medellín | Outdoor, speakers on ground, favela/barrio walls |
| High-Tech Lab | Fortaleza, Bogotá, London, Moscow | Futuristic, screens everywhere, minimal |
| Classic Room | Mexico City, Santiago, Paris, Newcastle | Vintage gear, wood paneling, warm lights |
| Rooftop | Sydney, Monterrey | City skyline visible, night sky, open air |

**Minimum viable:** One universal studio background (similar to V1's studio-bg.png) → swap to per-city in Week 3 if time allows.

### 3B. Sequencer Track Icons (10 instrument types)

| Spec | Value |
|------|-------|
| **Files** | `assets/sprites/instruments/{type}.png` |
| **Size** | 16×16 px each |
| **Format** | PNG-32 with transparency |
| **Priority** | 🟢 LOW — Week 3 |

**Types and colors:**

| Type | Color | Icon idea |
|------|-------|-----------|
| kick | #ff3344 | Speaker / kick drum |
| snare | #ff8800 | Snare drum top-down |
| hihat | #00ddff | Cymbal |
| perc | #44cc00 | Conga / shaker |
| bass | #aa44ff | Sub speaker / sine wave |
| lead | #ff3399 | Synthesizer |
| chord | #3366ff | Piano keys |
| arp | #00ccaa | Up-arrow wave |
| pad | #6688ff | Cloud / atmosphere |
| fx | #ff66aa | Lightning / star |

---

## 4. SOUND SYSTEM REWARDS

### 4A. Sound System Components (5 unlockable parts)

| Spec | Value |
|------|-------|
| **Files** | `assets/sprites/sound-system/{part}.png` |
| **Size** | 64×64 px each |
| **Format** | PNG-32 with transparency |
| **Priority** | 🟡 MEDIUM — Week 2–3 |

**Description:** Each stage/level completion unlocks a piece of your sound system rig. These display on a reward screen and accumulate in your profile.

| Level | Part | Description |
|-------|------|-------------|
| 1 | `speakers.png` | Pair of monitor speakers |
| 2 | `mixer.png` | DJ mixer / mixing console |
| 3 | `subwoofer.png` | Large subwoofer cabinet |
| 4 | `turntables.png` | Dual turntable setup |
| 5 | `stage-rig.png` | Full concert stage with lights |

**Also create:** `sound-system-combined.png` (192×128 px) — all 5 parts assembled as the complete setup, shown on profile/final screen.

---

## 5. BATTLE MODE

### 5A. Battle Arena Background

| Spec | Value |
|------|-------|
| **File** | `assets/sprites/battle/arena-bg.png` |
| **Size** | 960×540 px |
| **Format** | PNG-24 |
| **Priority** | 🟡 MEDIUM — Week 3 |

**Description:** Concert venue / battle stage backdrop. V1 reference: `venue-bg.png` — massive crowd, stage with speakers, laser lights, first-person POV from the stage.

**Design notes:** Dark with dramatic lighting, speaker stacks on both sides, EQ visualization in center, crowd silhouettes. Reusable across all battle encounters.

### 5B. Battle HUD Elements

| Spec | Value |
|------|-------|
| **Files** | `assets/sprites/battle/score-bar.png`, `battle/vs-badge.png`, `battle/win.png`, `battle/lose.png` |
| **Size** | Various (see below) |
| **Format** | PNG-32 with transparency |
| **Priority** | 🟢 LOW — Week 3 |

- `score-bar.png` — 300×20 px, health/score bar frame (gold border, empty interior)
- `vs-badge.png` — 64×64 px, "VS" emblem for battle intro
- `win.png` — 200×80 px, "YOU WIN!" victory text with effects
- `lose.png` — 200×80 px, "TRY AGAIN" defeat text

---

## 6. UI ELEMENTS

### 6A. Logo / Title Screen

| Spec | Value |
|------|-------|
| **File** | `assets/sprites/ui/logo.png` |
| **Size** | 480×120 px |
| **Format** | PNG-32 with transparency |
| **Priority** | 🔴 CRITICAL — Week 1 |

**Description:** "BEAT WORLD 2.0" pixel art logo. Gold (#ffaa00) main text with pink (#ff3399) drop shadow. Optionally include a small globe or speaker icon.

### 6B. Loading Screen Art

| Spec | Value |
|------|-------|
| **File** | `assets/sprites/ui/loading-art.png` |
| **Size** | 400×400 px |
| **Format** | PNG-32 with transparency |
| **Priority** | 🟢 LOW — Week 3 |

**Description:** Decorative art for the loading/splash screen. Could be a spinning vinyl, a globe with headphones, or a stylized speaker.

### 6C. Open Graph / Social Preview Image

| Spec | Value |
|------|-------|
| **File** | `public/opengraph.jpg` |
| **Size** | 1200×630 px |
| **Format** | JPEG, max 300KB |
| **Priority** | 🟡 MEDIUM — Week 3 |

**Description:** Social media preview when sharing the game URL. Should include: game title, pixel art world map, 2–3 character sprites, "VIBE JAM 2026" badge.

### 6D. Favicon

| Spec | Value |
|------|-------|
| **File** | `public/favicon.svg` + `public/favicon-32.png` |
| **Size** | SVG + 32×32 px PNG |
| **Priority** | 🟢 LOW — Week 3 |

**Description:** Miniature Beat World icon — a pixel speaker or musical note in gold on dark background.

---

## 7. VIBE JAM CONTEST SCREENSHOTS

### 7A. Submission Screenshots (3–5 required)

| Spec | Value |
|------|-------|
| **Files** | `assets/screenshots/screen-{1-5}.png` |
| **Size** | 1920×1080 px |
| **Format** | PNG |
| **Priority** | 🟡 MEDIUM — Week 4 (polish before submit) |

**Suggested shots:**
1. World map with several cities visible and one hovered
2. Character creator with a designed character
3. Studio sequencer mid-beat with active steps lit up
4. Battle/performance screen with crowd
5. Genre intro screen with guest producer quote

---

## PRODUCTION SUMMARY

### Week 1 — 🔴 Critical Path (Apr 13–19)

| # | Deliverable | Files | Method |
|---|-------------|-------|--------|
| 1 | Logo | 1 file | Image gen or Aseprite |
| 2 | World map background | 1 file | Image gen → pixel cleanup |
| 3 | Character body base (5 skin tones) | 5 files | Aseprite |
| 4 | Character hair (12 styles, white/tintable) | 12 files | Aseprite |

### Week 2 — 🟡 Core Assets (Apr 20–26)

| # | Deliverable | Files | Method |
|---|-------------|-------|--------|
| 5 | Character tops/pants/accessories | 20 files | Aseprite |
| 6 | Studio background (1 universal) | 1 file | Image gen → V1 reference |
| 7 | City icons (23) | 23 files | Image gen batch or Aseprite |
| 8 | Sound system parts (5) | 5 files | Image gen or Aseprite |

### Week 3 — 🟡 Polish (Apr 27–30)

| # | Deliverable | Files | Method |
|---|-------------|-------|--------|
| 9 | Guest producer portraits (23) | 23 files | Image gen batch |
| 10 | Battle arena background | 1 file | Image gen → V1 venue reference |
| 11 | OG image + favicon | 2 files | Composite from existing |
| 12 | Instrument icons (10) | 10 files | Aseprite |
| 13 | Battle HUD elements | 4 files | Aseprite |

### Week 4 — 🟢 Submission (May 1)

| # | Deliverable | Files | Method |
|---|-------------|-------|--------|
| 14 | Contest screenshots (5) | 5 files | In-game capture |
| 15 | Per-city studio variants (if time) | 7 templates | Color-shift from base |

**Total unique files:** ~125 files
**Minimum viable (Week 1–2 only):** ~42 files

---

## IMAGE GENERATION PROMPT TEMPLATES

For AI image generation, use these as starting prompts (adjust per tool):

**Studio background:**
> Pixel art interior of a music production studio, dark navy background (#0a0a1e), neon pink and cyan lighting, mixing console with glowing buttons, synthesizer keyboards, monitor speakers, cables on floor, character silhouette at center desk, retro-futuristic vibe, 16-bit style, 960x540

**Guest producer portrait:**
> Pixel art bust portrait of a music producer named [NAME], [SKIN TONE DESCRIPTION] skin, wearing [TOP COLOR] [TOP STYLE], [ACCESSORY], dark background with neon glow, vibrant colors, 128x128, retro game style, expressive face

**City icon:**
> Tiny pixel art icon 32x32, [CITY LANDMARK/SYMBOL], [LEVEL COLOR] dominant color, dark background, minimal detail, game map marker style

**World map:**
> Pixel art top-down world map, dark ocean (#1a4558), green continents, subtle cyan grid lines, neon city markers glowing, retro-futuristic, game overworld style, 1920x1080

**Sound system part:**
> Pixel art [PART NAME], 64x64 isolated on transparent background, neon glow, music equipment, retro game item sprite style
