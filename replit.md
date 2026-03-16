# BeatWorld — Global 8-Bit Producer Game

## Overview

A pixel art music production game built with React + Vite, Web Audio API, and a PostgreSQL backend. Players travel the world producing genre-specific beats, performing at iconic venues, and building clout on the in-game social platform GRAMMCHAT.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/beatworld)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Audio**: Web Audio API (FM synthesis, per-note gain/filter chains)
- **Graphics**: SVG isometric pixel art (eboy aesthetic), no Three.js
- **Styling**: Tailwind CSS + Press Start 2P pixel font
- **Animations**: Pure CSS animations (no framer-motion dependency)

## Game Structure

### Levels & Cities
- **Level 1**: Hip Hop — New York (4 tracks), Los Angeles (6 tracks)
- **Level 2**: Reggaeton/Dembow — Puerto Rico (6), Santo Domingo (8), Medellín (8)
- **Level 3**: Baile Funk / Psytrance / Minimal Techno — Rio (8), Fortaleza (10), São Paulo (10)
- **Level 4**: DnB / Tech House / Trap — Bogotá (10), Buenos Aires (12), Santiago (12)
- **Level 5**: Cumbia / Tribal / Organic House — Mexico City (12), Monterrey (14), Tulum (14)
- **Level 6 (Final)**: Techno / DnB / Jungle / Broken Beat — Berlin (14), London (14), Newcastle (16), Brighton (16)

### Game Flow
1. Start Screen → Character Creator → World Map
2. Click city → Studio (beat sequencer) → Performance at venue → Media review
3. Post to GRAMMCHAT social platform → earn CLOUT → leaderboard
4. View Profile with Winamp-style track player → share stats on social media

### Guest Producers
Each of the 18 cities has a unique guest producer NPC with pixel portrait, name, and speech bubble quote displayed in the studio sidebar. Examples: DJ Primo (NY), Dr. Beats (LA), Maluma Jr (Medellín), Ben Klock Jr (Berlin), etc.

## Structure

```text
artifacts/
├── beatworld/              # Main game frontend (React + Vite)
│   └── src/
│       ├── App.tsx         # Router + providers
│       ├── index.css       # Pixel art theme (dark navy, neon colors)
│       ├── lib/
│       │   ├── game-data.ts # All cities, genres, instruments, guest producers
│       │   └── audio.ts     # Web Audio API engine with volume/filter per note
│       ├── hooks/
│       │   └── use-game-state.tsx # GameContext + localStorage persistence
│       ├── components/
│       │   ├── IsometricSprite.tsx   # 4-direction isometric character (SE/SW/NW/NE), IsoBox prisms
│       │   ├── map/WorldMap.tsx      # Mario 3-style node-path map with city-specific SVG landmarks
│       │   └── ui/PixelButton.tsx, PixelPanel.tsx
│       └── pages/
│           ├── StartScreen.tsx
│           ├── CharacterCreator.tsx
│           ├── MapScreen.tsx
│           ├── StudioScreen.tsx      # Hammerhead-style sequencer with mute/solo/vol/filter
│           ├── PerformanceScreen.tsx  # Isometric stage with NPC dancers
│           ├── ReviewScreen.tsx
│           ├── SocialScreen.tsx      # GRAMMCHAT
│           ├── LeaderboardScreen.tsx  # 23+ simulated entries
│           └── ProfileScreen.tsx     # Winamp player + social sharing
├── api-server/             # Express API server
└── mockup-sandbox/         # Design prototyping
lib/
├── api-spec/openapi.yaml   # API contract
├── api-client-react/       # Generated React Query hooks
├── api-zod/                # Generated Zod schemas
└── db/src/schema/index.ts  # DB: game_saves, social_posts, post_ratings
```

## Routes
- `/` — Start Screen
- `/creator` — Character Creator
- `/map` — World Map with draggable isometric tile grid
- `/studio/:cityId` — Beat sequencer (Hammerhead style)
- `/performance/:cityId` — Isometric venue performance
- `/review/:cityId` — Newspaper-style media review
- `/social` — GRAMMCHAT social feed
- `/leaderboard` — Clout Board (ranked producers)
- `/profile` — Producer Profile with Winamp player

## Data Architecture
- Game state saved in **localStorage** (`beatworld_save`) for offline play
- Default state: `currentLevel: 6` (all 18 cities unlocked for review)
- Simulated leaderboard with 23 diverse entries ranked by clout
- Server-side persistence for cloud saves via `POST /api/game/save`
- Social features (posts, ratings, leaderboard) via API + PostgreSQL

## Visual Design
- **Font**: Press Start 2P (Google Fonts)
- **NO border-radius** anywhere, **NO framer-motion**
- **Screen-specific palettes**:
  - **StartScreen/PerformanceScreen**: Dark nighttime neon (#0a0a1a bg, magenta/cyan/yellow neons)
  - **WorldMap/CharacterCreator**: Bright eboy daytime (sky blue #87ceeb, cream #fff8e7, hot pink #ff3399, cobalt #0050cc)
  - **StudioScreen**: Dark Hammerhead hardware (#0a0a1e bg, blue step grid, amber/gold accents)
  - **ReviewScreen**: Newspaper critic (cream #fff8e7, black #111 masthead, animated star rating)
  - **LeaderboardScreen**: Trophy table (yellow #ffee00 bg, bubble graffiti title, trophy SVGs)
  - **ProfileScreen**: Dark navy #0a0a1a with green Winamp accents
- **Aesthetic**: eboy.com isometric pixel art influence, Sega Genesis 32-bit

## World Map Features
- Draggable isometric tile grid with 4px drag threshold to prevent accidental navigation
- City-specific SVG landmarks: Statue of Liberty (NY), palm trees (LA), Cristo Redentor (Rio), Big Ben (London), Brandenburg Gate (Berlin), pyramids (Tulum), mountain ranges (Santiago/Monterrey), etc.
- HUD with producer name, clout, cities count
- Bottom navigation: GRAMMCHAT, LEADERBOARD, PROFILE buttons
- Level legend with color-coded genre categories

## Studio Features (Hammerhead Style)
- 16-step sequencer grid with beat numbering (1-4)
- Per-channel MUTE (M) and SOLO (S) buttons
- Channel detail panel with VOL fader and FILTER slider
- Volume/filter wired to audio engine via refs (prevents stale closures)
- Guest producer sidebar with pixel portrait and speech bubble (dismissible)
- BPM slider, PLAY/FINISH/MAP controls

## Audio System
- Web Audio API: oscillators (square, sawtooth, triangle, sine)
- `playDrum(type, volume, filterFreq)` and `playSynth(type, freq, volume, filterFreq)` accept per-note params
- Private `getOutput()` helper creates per-note GainNode + BiquadFilterNode chain
- Kick: frequency sweep from 150Hz → near zero
- Snare: noise burst + triangle oscillator
- Hi-Hat: band-pass filtered noise
- Bass/Lead/Pad: pitch-based oscillators using minor pentatonic scale

## Performance Screen
- Isometric tile floor SVG with alternating colors
- `IsoNpc` animated pixel-art dancer components in staggered rows
- Isometric speaker stacks and DJ booth backdrop
- Animated crowd with bobbing motion

## Profile Screen
- WinampPlayer component plays saved city tracks via Web Audio API
- Character sprite with stats (clout, level, cities, tracks)
- Social sharing: Twitter intent URL, Facebook sharer, Instagram link
- Completed cities grid

## Root Scripts
- `pnpm run build` — runs `typecheck` first, then recursively runs `build`
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly`

## API Endpoints
- `GET /api/healthz` — health check
- `POST /api/game/save` — save game state
- `GET /api/game/load/:playerId` — load game state
- `GET /api/social/posts` — list GRAMMCHAT posts
- `POST /api/social/posts` — create post
- `POST /api/social/posts/:id/rate` — rate a post (1-5 stars)
- `GET /api/social/leaderboard` — clout leaderboard
