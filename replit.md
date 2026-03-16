# BeatWorld — Global 8-Bit Producer Game

## Overview

A pixel art music production game built with React + Vite, Three.js, Web Audio API, and a PostgreSQL backend. Players travel the world producing genre-specific beats, performing at iconic venues, and building clout on the in-game social platform GRAMMCHAT.

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
- **Audio**: Web Audio API (8-bit synthesized instruments)
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

## Structure

```text
artifacts/
├── beatworld/              # Main game frontend (React + Vite)
│   └── src/
│       ├── App.tsx         # Router + providers
│       ├── index.css       # Pixel art theme (dark navy, neon colors)
│       ├── lib/
│       │   ├── game-data.ts # All cities, genres, instruments
│       │   └── audio.ts     # Web Audio API 8-bit engine
│       ├── hooks/
│       │   └── use-game-state.tsx # GameContext + localStorage persistence
│       ├── components/
│       │   ├── IsometricSprite.tsx   # 4-direction isometric character (SE/SW/NW/NE), IsoBox prisms
│       │   ├── map/WorldMap.tsx      # Mario 3-style node-path map with isometric tiles
│       │   └── ui/PixelButton.tsx, PixelPanel.tsx
│       └── pages/
│           ├── StartScreen.tsx
│           ├── CharacterCreator.tsx
│           ├── MapScreen.tsx
│           ├── StudioScreen.tsx   # Beat sequencer
│           ├── PerformanceScreen.tsx
│           ├── ReviewScreen.tsx
│           ├── SocialScreen.tsx   # GRAMMCHAT
│           └── LeaderboardScreen.tsx
├── api-server/             # Express API server
└── mockup-sandbox/         # Design prototyping
lib/
├── api-spec/openapi.yaml   # API contract
├── api-client-react/       # Generated React Query hooks
├── api-zod/                # Generated Zod schemas
└── db/src/schema/index.ts  # DB: game_saves, social_posts, post_ratings
```

## Data Architecture
- Game state saved in **localStorage** (`beatworld_save`) for offline play
- Server-side persistence for cloud saves via `POST /api/game/save`
- Social features (posts, ratings, leaderboard) via API + PostgreSQL

## Visual Design
- **Font**: Press Start 2P (Google Fonts)
- **Background**: Dark navy (#0a0a1a)
- **Primary**: Neon Magenta
- **Secondary**: Neon Cyan
- **Accent**: Neon Yellow
- **Levels**: Each level has a distinct neon color on the world map
- **Aesthetic**: eboy.com isometric pixel art influence

## Audio System
- Web Audio API: oscillators (square, sawtooth, triangle, sine)
- Kick: frequency sweep from 150Hz → near zero
- Snare: noise burst + triangle oscillator
- Hi-Hat: band-pass filtered noise
- Bass/Lead/Pad: pitch-based oscillators using minor pentatonic scale

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
