# AGENTS.md — Beat World 2.0

**Read this entire file before doing any work in this repository.** This is the persistent context document for any AI coding agent (Codex, Claude Code, etc.) working on Beat World 2.0.

---

## What this is

**Beat World 2.0** is a Three.js + Tone.js music-production game submitted to Vibe Jam 2026 (deadline 2026-05-01 13:37 UTC / 8:37 AM Bogotá). Player travels through cities making beats on a step sequencer, builds a custom soundsystem rig over time. Strategic role: proof-of-concept marketing for SOUND OS (`elsoundsystem.com`).

**Repo location:** `SOUND OS/04_SOUND_AGENCY/BEATWORLD-APP/beat-world-2026/`
**Domain (target):** `beatworld.nicoborja.com` (CNAME to Vercel, pending DNS configuration)
**Vite dev port:** 3001 (NOT 3000 — port 3000 is reserved for the PSA-template dev server in the parent project)

---

## Stack and conventions

### Stack (locked — do not add dependencies)

- **Three.js** `^0.170.0` — 3D rendering for performance scene (light spotlights overlay)
- **Tone.js** `^15.0.4` — audio engine (Tone.Sampler for sample playback + Tone.Synth for fallback + Tone.Player for chord progression loops)
- **Vite** `^6.0.0` — build + dev server
- **Vanilla JavaScript modules** — NO React, NO TypeScript, NO build-time JSX, NO Tailwind, NO any other framework

### Code conventions

- ES modules (`import`/`export`), no CommonJS
- File extension `.js` for source files
- One default export per scene class (e.g., `class StudioScene { ... } export { StudioScene };`)
- DOM manipulation via plain `document.createElement` and `innerHTML` template strings — no virtual DOM
- Three.js scenes use a shared renderer + camera defined in `main.js`
- Audio routing through the shared `AudioEngine` instance defined in `main.js`
- State persistence via `gameState` (localStorage) — accessed via `window.__beatworld?.gameState` in browser console for debugging
- Use Press Start 2P font (Google Fonts, already loaded in `index.html`) for ALL game-facing text
- Use the locked color palette in `index.html` style block — never invent new neon colors

### Asset path convention (CRITICAL — get this wrong and assets 404)

**Vite serves files in `public/` at root URL paths.** This means:

- File on disk: `public/assets/sprites/soundsystem/boombox.png`
- URL in code: `/assets/sprites/soundsystem/boombox.png`

**DO NOT put assets in `assets/` at the repo root.** That directory is not served by Vite. The only correct location is `public/assets/...`.

Reference: `public/assets/README.md` documents the layout.

---

## Repository structure

```
beat-world-2026/
├── AGENTS.md                          ← THIS FILE
├── index.html                         ← Entry point + loading screen + Vibe Jam widget + global CSS
├── package.json                       ← three + tone + vite (do not add deps)
├── vite.config.js                     ← port 3001, appType:'mpa', strictPort
├── vercel.json                        ← static deploy config (no SPA rewrite — Beat World has no router)
├── public/
│   └── assets/
│       ├── README.md                  ← Asset path convention docs
│       ├── audio/
│       │   └── level-01-nyc/          ← 20 MP3 files (4 kicks/snares/hihats/basses + 4 chord progression loops)
│       └── sprites/
│           ├── soundsystem/           ← Soundsystem rig PNGs (boombox + 5 silhouettes + Coney Island unlock scene)
│           ├── characters/
│           │   ├── critic-xxl.png     ← XXL Mag critic portrait
│           │   ├── boombap-m.png      ← 12 character sprites: 6 styles × 2 presentations
│           │   ├── boombap-f.png      ← (256×384, transparent)
│           │   ├── gfunk-m.png        ← Naming: {style}-{presentation}.png
│           │   ├── gfunk-f.png        ← Styles: boombap | gfunk | punk | beatmaker | otaku | feline
│           │   ├── punk-m.png         ← Presentations: m | f
│           │   ├── punk-f.png         ← Fallback chain on missing presentation:
│           │   ├── beatmaker-m.png    ←   1. {style}-{presentation}.png
│           │   ├── beatmaker-f.png    ←   2. {style}-m.png
│           │   ├── otaku-m.png        ←   3. labelled placeholder rect
│           │   ├── otaku-f.png        ← Feline = anthropomorphic human-sized cat character
│           │   ├── feline-m.png       ←   (biped, wears clothing, visually distinct from the
│           │   └── feline-f.png       ←    5 human styles)
│           ├── venues/                ← studio-nyc.png, gig-bk-court.png
│           └── ui/                    ← review-magazine-cover.png, soundsystem-hangar.png
└── src/
    ├── main.js                        ← Scene state machine + Three.js bootstrap + audio init
    ├── GameState.js                   ← localStorage persistence (audioPrefs, style, presentation, completedLevels, unlockedPieces, clout, playerName) + migration from cadaver-exquisito / single-character / NB-presentation legacy shapes
    ├── GameData.js                    ← 24 city definitions (only 'new-york' is active in vertical slice)
    ├── data/
    │   └── LevelProgression.js        ← 6-level region→soundsystem-piece mapping (used by LevelSelect, SoundsystemReveal, ShareArtifact)
    ├── ui/
    │   ├── HUD.js                     ← Producer name + clout + city HUD overlay
    │   ├── SpriteImage.js             ← Helper: loads PNG, falls back to labeled placeholder rect on 404
    │   └── SoundOsFooter.js           ← Persistent "Built with SOUND OS" footer with utm tracking
    ├── character-select/
    │   └── CharacterSelectScene.js    ← Pick 1 of 6 styles × 2 presentations = 12 variants. Style cycle arrows + [M] [F] presentation pills. Future v1.1 will replace this with a user-uploaded character editor.
    ├── level-select/
    │   └── LevelSelectScene.js        ← 6 level cards, only L1 unlocked, EDIT CHARACTER button
    ├── studio/
    │   ├── StudioScene.js             ← Half-screen layout: backdrop top, sequencer bottom + chord picker + variant pickers
    │   ├── AudioEngine.js             ← Tone.Sampler with synth fallback + chord loop API + 6s load timeout
    │   └── GenreAudio.js              ← 22 genre profiles (Tone.js synthesis fallback configurations)
    ├── world/
    │   └── WorldMapScene.js           ← LEGACY (open-world map, NOT used in vertical slice — keep file but don't reference)
    ├── character/
    │   └── CharacterCreatorUI.js      ← LEGACY (full attribute customizer, replaced by CharacterSelectScene — keep file but don't reference)
    ├── performance/
    │   └── PerformanceScene.js        ← Beat playback + CSS spotlights overlay (basketball court backdrop)
    ├── review/
    │   └── ReviewScene.js             ← Magazine cover + 1-2 star overlay (Level 1 cap) + system-honest critic text
    ├── soundsystem/
    │   └── SoundsystemRevealScene.js  ← 2-stage: Coney Island cinematic → hangar showcase
    ├── directory/
    │   └── DirectoryScene.js          ← 6 mock producer cards including YOU + JOIN form (mailto for now)
    └── social/
        ├── ShareArtifact.js           ← 1080×1080 canvas exporter for X/IG sharing
        └── XShare.js                  ← Twitter Web Intent helper
```

---

## Visual style — LOCKED palette and conventions

**Aesthetic:** eboy.com pixel art + 32-bit Sega Genesis fidelity. Sharp pixel edges, no anti-aliasing, integer pixel grid, visible chunky pixels.

**Typography:** Press Start 2P (loaded in `index.html` from Google Fonts).

**Color palette — anchor every sprite/scene to these hex codes:**

| Role | Hex | Use case |
|---|---|---|
| Background dark navy | `#0a0a1e` | Primary scene background, dark void |
| Neon magenta (primary brand) | `#ff3399` | Headers, primary CTAs, magenta glow halos |
| Neon cyan (secondary) | `#00ddff` | Secondary CTAs, accent highlights |
| Neon yellow (accent) | `#ffaa00` | Star ratings, lamp glow, lime warning highlights |
| Electric blue | `#0050ff` | Tertiary accent, hoodie color |
| Bright red | `#ff3344` | Kick drum color, critic burst, danger states |
| Lime green | `#00cc44` | Success states, completed level checkmark |
| Hot pink | `#ff00c8` | Sunset clouds, secondary magenta |
| Wood tones | `#6b3a1f` (dark) / `#a06b3a` (warm) | Boardwalk planks, vintage furniture |
| Concrete grey | `#4a4a52` | Asphalt, urban surfaces |

**Effects:** CRT scanline overlay (subtle), neon glow text-shadow (no soft blur), pixel borders (no border-radius anywhere).

**NEVER do:**
- Soft gradients (use stepped color quantization if shading is needed)
- Blur, drop shadows, anti-aliasing
- Border-radius on any element
- Vector smoothness (Bezier curves) — everything should be axis-aligned rectangles or hard diagonals
- Pixar / Disney / anime / watercolor / painterly aesthetics

---

## Current implementation state (as of 2026-04-27 LATE PM)

**Code complete per Claude Code single-session execution.** All 27 acceptance criteria addressed. Production build clean: 857 KB JS bundle, 982 modules. Awaiting:

1. Manual click-through verification by Nico
2. Asset production (22 PNGs + 20 MP3 files) by Tuesday EOD
3. Position-tuning of star/hangar/spotlight overlays once real art lands
4. Vercel deploy + CNAME wiring

**Known position-tuning items (ONLY adjust when real art is in place):**

- Magazine star overlay (`src/review/ReviewScene.js`) currently `top:24px right:14px` — adjust to align with cover's empty star outlines
- Hangar slot overlays (`src/soundsystem/SoundsystemRevealScene.js`) currently `bottom:18%` with 6 equal columns — align with painted stages in hangar PNG
- Performance spotlights (`src/performance/PerformanceScene.js`) currently horizontal 28/42/58/72%, vertical 62% — assumes boombox sits center-bottom in basketball court image

**Persistent navigation:** Every game scene needs a "← LEVELS" button (top-left, position:fixed) for the player to return to LevelSelect at any point. (May or may not be already added depending on session timing — check `src/character-select/`, `src/studio/`, `src/performance/`, `src/review/`, `src/soundsystem/`, `src/directory/` scenes.)

---

## What you can / cannot do

### CAN do (and should, when asked)

- Add new sprites and visual assets (procedurally via SVG/Canvas in code, or by referencing PNG paths in `public/assets/sprites/`)
- Refactor scene classes for clarity / fix bugs in existing scenes
- Add visual polish (animations, transitions, particle effects) using existing Three.js + CSS
- Extend the AudioEngine for new playback modes (per-step callbacks, beat slicing, etc.) — but keep the synth fallback intact
- Add new scenes for post-launch v1.1 features (e.g., Level 2 Caribbean, sample pack browser) — but flag them clearly as `// post-launch` in code comments
- Improve accessibility (ARIA labels, keyboard navigation, contrast checks)
- Add unit tests if the change is risky enough to warrant them (use Vitest, no other test framework)
- Update `vite.config.js` if the change is necessary for asset loading or bundle optimization
- Generate procedural pixel art via SVG `<rect>` compositions or Canvas 2D — this is the V1 design brief precedent ("SVG-based pixel art character sprites")

### CANNOT do (without explicit user instruction)

- Add NPM dependencies beyond `three` and `tone`
- Rewrite anything in React, TypeScript, or any other framework
- Add a backend, API calls, authentication, or any networked persistence
- Implement features that are post-launch (GRAMMCHAT social, leaderboards, battle mode, user-uploaded character editor — see v1.1 TODO in `CharacterSelectScene.js`)
- Refactor `GameData.js` city data — the 24 cities stay intact even though only NYC is active in the vertical slice
- Remove `WorldMapScene.js` or `CharacterCreatorUI.js` — they're legacy code paths kept for post-launch reactivation
- Change the locked color palette
- Replace Press Start 2P with another font
- Add ad serving, tracking pixels, or third-party analytics beyond the Vibe Jam widget

---

## Key documents (read these too if relevant to your task)

All in `SOUND OS/04_SOUND_AGENCY/BEATWORLD-APP/`:

| Doc | When to read |
|---|---|
| `BEATWORLD_SPRINT_STATUS.md` | Original handoff — historical context, references some files (`DESIGN_DELIVERABLES.md`, V1 reference images) that don't exist on disk |
| `SCOPE_CALL_2026-04-27.md` | First scope call (open-world recommendation, partly superseded) |
| `SCOPE_CALL_2026-04-27_v2_AMENDMENT.md` | **CURRENT TRUTH** — vertical slice scope, soundsystem.world cultural reference, Sound OS PoC framing |
| `CLAUDE_CODE_BRIEF_LEVEL_1.md` | Detailed implementation brief used by Claude Code in initial build |
| `AUDIO_SAMPLE_SPECS.md` | Spec for the 20 audio files Nico delivers (file format, naming, target sizes, chord progression definitions) |
| `SPRITE_PROMPT_PACK_v2.md` | **CANONICAL asset spec.** Gemini Gem operating doc with the exact prompts for all 7 scenes + 4 character source sprites + critic portrait + standalone boombox. Use this as the visual quality target for any procedural sprite generation work. |
| `ILLUSTRATION_PROMPTS_LEVEL_1.md` | LEGACY — superseded by SPRITE_PROMPT_PACK_v2.md. Kept for historical context only. |
| `CODEX_SPRITE_GENERATION_PROMPT.md` | Codex-specific brief for generating procedural SVG fallback sprites (when Gemini PNGs aren't yet in place). |

---

## Strategic context (so you can make good judgment calls)

**Beat World is NOT just a contest entry.** It's a working demonstration of the SOUND OS thesis: "music marketing isn't video clips anymore — it's playable scenes." Every design decision should reinforce this:

- The **soundsystem-as-reward mechanic** ties the brand metaphor (SOUND = SoundSystem) to the player's progression. Each region they conquer adds a region-specific rig piece. By Level 6 they have a global mashup (NYC boombox + Caribbean picó + Brazil baile funk truck + Andean bass cabinet + Mexico sonidero + Berlin warehouse stack).
- The **directory glimpse screen** at the end of Level 1 channels the soundsystem.world cultural archive aesthetic — real-world reggae/dub soundsystem directory. Game players see they're part of a community, not just a singleplayer experience.
- The **character system** lets the player pick 1 of 6 styles × 2 presentations = 12 variants. Styles: boombap | gfunk | punk | beatmaker | otaku | feline. Presentations: m | f. Each variant is a single transparent PNG at `/assets/sprites/characters/{style}-{presentation}.png` with a 2-tier fallback (presentation 404 → `{style}-m.png` → labelled placeholder rect). State stored in `gameState.data.style` and `gameState.data.presentation`. Feline is an anthropomorphic human-sized cat producer (biped, wears clothing) — visually distinct from the 5 human styles. Future v1.1 will add a user-uploaded character editor.
- The **2-star Level 1 cap** with system-honest critic framing makes the gatekeeping the joke, not the player's beat. This is on-brand for hip-hop critique culture.
- The **"Built with SOUND OS" footer link** is the only explicit Sound OS marketing in the game. Everything else is implicit. Show, don't tell.

**Cut order if deadline pressure forces decisions** (sacrifice from top down):
1. Share artifact (1080×1080 canvas exporter) → defer to v1.1
2. Directory "JOIN THE DIRECTORY" form → just show cards
3. Three.js bloom post-processing → CSS spotlights only
4. Soundsystem reveal Stage A cinematic → jump to Stage B
5. CharacterSelect picker → single default avatar (boombap)
6. Audio samples → synth-only fallback
7. Performance scene 3D overlay → static dark background

**Never cut:** LevelSelect, Studio (with chord progression picker), Review with rating, SoundsystemReveal Stage B (the hangar), "Built with SOUND OS" footer. Without these, Beat World is just a sequencer demo and the brand metaphor disappears.

---

## How to debug at runtime

In the browser DevTools console at `http://localhost:3001/`:

```javascript
// Inspect saved state
console.log(window.__beatworld?.gameState?.data);

// Wipe state to retest first-run flow
window.__beatworld?.gameState?.reset?.(); location.reload();

// Manual scene jump
window.__beatworld?.switchScene?.('soundsystemReveal');
// Valid scenes: 'characterSelect' | 'levelSelect' | 'studio' | 'performance' | 'review' | 'soundsystemReveal' | 'directory'

// Force-complete Level 1
window.__beatworld?.gameState?.completeLevel?.(1);
window.__beatworld?.gameState?.unlockSoundsystemPiece?.(1);
location.reload();

// Watch audio sample fallback warnings
// Look in Console for: "[AudioEngine] Sample missing: ... — falling back to synth."
```

---

## When you finish work

Always run before declaring done:

```bash
npm run build
```

Verify the bundle compiles cleanly (no errors, no warnings). Note bundle size in your report — it should stay under ~2 MB total (current baseline 857 KB JS + ~1 MB audio assets when delivered).

Then report:
- What you changed (file-by-file delta)
- Any deviations from the requested approach (with reasoning)
- Bundle size after build
- TODOs left in code (intentional or otherwise)
- Suggested manual verification steps for Nico

---

## Owner / contact

Repo owner: Nico Borja (`hola@nicoborja.com`)
Strategic / planning lead: Claude (Cowork mode, instance separate from this repo agent)
Implementation history: original V1 was a React/Replit prototype (`replit-V1/`), rebuilt as vanilla JS + Three.js for Vibe Jam 2026.
