# BeatWorld — Game Summary & UI Screen Design Brief

## Game Overview

**BeatWorld** is a pixel art music production game where players travel the world as a beat producer, creating genre-specific tracks across 18 cities in 6 levels. The game combines a beat sequencer, character customization, live performances, media reviews, and an in-game social platform called **GRAMMCHAT** with a clout rating system.

### Visual Style
- **Aesthetic**: eboy.com pixel art — isometric, rich detail, 32-bit Sega Genesis era fidelity
- **Font**: "Press Start 2P" (Google Fonts) — used everywhere
- **Background**: Dark navy (#0a0a1a)
- **Primary color**: Neon Magenta (#ff00ff)
- **Secondary color**: Neon Cyan (#00ffff)
- **Accent color**: Neon Yellow (#ffff00)
- **Additional palette**: Electric Blue (#0050ff), Bright Red (#ff0000), Lime Green (#00ff00), Hot Pink (#ff00c8), Orange (#ff8800)
- **Effects**: CRT scanlines overlay, neon glow text shadows, pixel borders (no border-radius), grid line backgrounds

### Tech Stack
- React + Vite + TypeScript
- Tailwind CSS (no border-radius — everything is sharp pixel edges)
- Web Audio API (FM synthesis — Sega Genesis YM2612-inspired sounds)
- SVG-based pixel art character sprites
- PostgreSQL backend for social features
- localStorage for game save state

---

## Game Flow

```
Start Screen → Character Creator → World Map
     ↓                                  ↓
  (New Game / Continue)         Click a city pin
                                        ↓
                                  Studio (Beat Sequencer)
                                        ↓
                                  Performance (Live show)
                                        ↓
                                  Review (Critic score)
                                        ↓
                              Back to Map / Post to GRAMMCHAT
```

---

## Levels & Cities

| Level | Region | Cities | Tracks | Genre | Default BPM |
|-------|--------|--------|--------|-------|-------------|
| 1 | Hip Hop (USA) | New York (4 tracks), Los Angeles (6) | 4–6 | Hip Hop, West Coast | 90–100 |
| 2 | Latin Caribbean | Puerto Rico (6), Santo Domingo (8), Medellín (8) | 6–8 | Reggaeton, Fast Dembow | 95–110 |
| 3 | South American | Rio (8), Fortaleza (10), São Paulo (10) | 8–10 | Baile Funk, Psytrance, Minimal Techno | 130–145 |
| 4 | Andean / Southern Cone | Bogotá (10), Buenos Aires (12), Santiago (12) | 10–12 | DnB, Tech House, Trap | 128–174 |
| 5 | Mexico | Mexico City (12), Monterrey (14), Tulum (14) | 12–14 | Cumbia, Tribal, Organic House | 100–124 |
| 6 | European Underground | Berlin (14), London (14), Newcastle (16), Brighton (16) | 14–16 | Techno, DnB, Jungle, Broken Beat | 140–174 |

Each city has genre-accurate instruments (808 Kick, Dembow Snare, G-Funk Bass, Timbal, Conga, etc.).

---

## UI Screens to Design

### 1. Start Screen
- **Route**: `/`
- **Purpose**: Title screen / main menu
- **Elements**:
  - Large "BEATWORLD" title with neon magenta glow
  - Pixel art globe/world background image
  - "NEW GAME" button (magenta)
  - "CONTINUE" button (cyan, only if save exists)
  - CRT scanline overlay
  - Tagline or subtitle text
- **Design notes**: Should feel like a retro game boot screen. Dark, moody, the globe image sits behind everything at low opacity. Title pulses with neon glow animation.

### 2. Character Creator
- **Route**: `/creator`
- **Purpose**: Build your producer avatar
- **Layout**: Two-column — left side has live SVG sprite preview + name input + "ENTER WORLD" button; right side has all customization controls
- **Customization options**:
  - **Skin Tone**: 5 tones (light → dark) with shadow shading
  - **Hair Style**: 8 options — Fade, Afro, Dreads, Mohawk, Braids, Bun, Straight, Caesar
  - **Hair Color**: 12 swatches (naturals + neons: magenta, cyan, red, green, purple, white, orange)
  - **Top Style**: 6 options — Hoodie, Jersey, Tracksuit, Oversized Tee, Windbreaker, Bomber
  - **Top Color**: 12 eboy palette swatches
  - **Pants Style**: 6 options — Baggy, Jogger, Cargo, Jeans, Shorts, Tights
  - **Pants Color**: 10 swatches
  - **Accessory**: None, Headphones, Snapback Cap, Sunglasses, Gold Chain, Bandana
- **Sprite**: SVG pixel art drawn at 24×48 viewBox, rendered at 96×192px with `image-rendering: pixelated`. Each option changes the SVG rects visible on the sprite.
- **Design notes**: The sprite preview sits in a dark panel with a subtle magenta glow platform shadow beneath the character. Name input is uppercase-only, max 12 chars.

### 3. World Map
- **Route**: `/map`
- **Purpose**: Navigate between cities, access social features
- **Elements**:
  - Full-screen pixel art globe/world map background
  - 18 city pins positioned by percentage coordinates over the map
  - Each pin is colored by level (L1=magenta, L2=orange, L3=yellow, L4=green, L5=cyan, L6=pink)
  - Locked cities appear dark gray; unlocked cities glow with their level color
  - Hover tooltip shows: city emoji + name, genre, lock status
  - Current city pin pulses/scales up
  - Top-left: "BEATWORLD MAP" title + "CLICK A CITY TO ENTER STUDIO" subtitle
  - Top-right HUD: Producer name box + Clout score box
  - Bottom-right: Level color legend
  - Bottom-center: "GRAMMCHAT" button (cyan) + "LEADERBOARD" button (yellow)
  - Grid line overlay (magenta/cyan at low opacity)
  - Dark radial gradient overlay for contrast
- **Design notes**: The map should feel alive — glowing city pins, subtle grid, dark atmospheric. City positions are hardcoded percentages mapping real-world locations.

### 4. Studio (Beat Sequencer)
- **Route**: `/studio/:cityId`
- **Purpose**: Core gameplay — make beats on a step sequencer
- **Layout**: Full-screen with header bar, sequencer grid, status bar, back button
- **Header**:
  - City emoji + "CITY NAME STUDIO" in neon magenta
  - Genre + track count + BPM info in cyan
  - BPM slider (range 60–200)
  - PLAY/STOP button (magenta when play, red when stop)
  - FINISH button (cyan)
- **Sequencer Grid**:
  - Beat ruler at top showing beat numbers 1–4 in magenta, dots between
  - Each row = one instrument, labeled with a colored dot + instrument name (e.g. "808 Kick", "Sub Bass")
  - 16 step columns per row
  - Active steps light up in the instrument's assigned color with inner glow + box shadow
  - Current playback step highlights with white glow
  - Downbeat steps (every 4th) have slightly lighter background
  - Instrument colors cycle through a palette of 16 neon colors
- **Status Bar**:
  - Audio status indicator: "○ CLICK TO ENABLE AUDIO" (yellow) → "◉ AUDIO READY" (green)
  - Playing indicator: "► PLAYING · STEP X/16" (magenta)
- **Background**: Pixel art studio interior at low opacity, dark gradient overlay
- **Design notes**: The sequencer is the heart of the game. Grid cells should feel tactile — clicking a cell previews the sound immediately. Each city loads different instruments (4 for NY up to 16 for Brighton).

### 5. Performance Screen
- **Route**: `/performance/:cityId`
- **Purpose**: Animated live show playback after finishing a track
- **Elements**:
  - Venue name header (e.g. "MADISON SQUARE GARDEN")
  - Animated stage/crowd visualization
  - The player's beat plays back automatically
  - Flashing neon lights / crowd reaction effects
  - "SEE REVIEWS" button appears after performance ends
- **Design notes**: This should be a celebratory moment — confetti, stage lights, the crowd going wild. The pixel art venue background should match the city's vibe.

### 6. Review Screen
- **Route**: `/review/:cityId`
- **Purpose**: Show critic feedback and score
- **Elements**:
  - "MEDIA REVIEWS" header
  - Critic card with:
    - Pixel art critic avatar/portrait
    - Media outlet name (e.g. "PITCHFORK MAG", "XXL MAG", "ROLLING STONE")
    - "Listening..." state while evaluating
    - Star rating (1–5 stars, filled yellow / empty gray)
    - Written review text (generated based on track quality)
    - Clout awarded amount
  - "POST TO GRAMMCHAT" button
  - "BACK TO MAP" button
- **Design notes**: The critic should feel like a character — give them personality through pixel art portraits and snarky/praising review text.

### 7. Social Screen (GRAMMCHAT)
- **Route**: `/social`
- **Purpose**: In-game social media feed
- **Elements**:
  - Header: "GRAMMCHAT" in magenta neon + Clout display
  - Back arrow button
  - Feed of posts, each showing:
    - Producer name + city + genre
    - Track name / caption
    - Star rating received
    - Heart/like button with count
    - Timestamp
  - Empty state: "NO POSTS YET. BE THE FIRST!"
  - Compose area to post your latest track
  - Share buttons (Web Share API → Instagram/X/Facebook)
- **Design notes**: Should feel like a retro pixel art version of Instagram. Dark cards with neon accents. Posts are generated from actual gameplay.

### 8. Leaderboard Screen
- **Route**: `/leaderboard`
- **Purpose**: Ranked clout standings
- **Elements**:
  - "CLOUT BOARD" header in neon
  - Ranked list of players showing:
    - Rank number (#1, #2, etc.)
    - Producer name
    - Number of cities completed
    - Total clout score
  - Current player highlighted
  - Top 3 have special crown/medal indicators
- **Design notes**: Classic arcade leaderboard feel — gold/silver/bronze for top 3, scrollable list.

### 9. 404 / Not Found
- **Route**: Fallback
- **Purpose**: Error page
- **Elements**:
  - "404" in large neon text
  - "Page Not Found" message
  - "BACK TO MAP" button
- **Design notes**: Keep it on-brand with the pixel art theme.

---

## Shared UI Components

### PixelButton
- Sharp rectangular button with no border-radius
- Variants: primary (magenta), secondary (cyan), accent (yellow)
- Pixel border + box shadow
- Hover: slight brightness increase
- Active: scale down

### PixelPanel
- Dark semi-transparent container
- 2px solid border in theme color
- No border-radius
- Used to wrap content sections

### Character Sprite (SVG)
- 24×48 SVG viewBox rendered with `image-rendering: pixelated`
- Built from colored `<rect>` elements
- Responds to character state: skin tone, hair style/color, top style/color, pants style/color, accessory
- Used in: Character Creator preview, Studio background, Performance stage, Social posts

---

## Audio System (Reference)

- **Engine**: Web Audio API with FM synthesis
- **Drum sounds**: FM kick (frequency sweep), noise-based snare (bandpass filter + triangle tone), metallic hi-hat (5 detuned square oscillators through highpass), sine conga/perc
- **Synth sounds**: FM bass (carrier + modulator), detuned square lead, sawtooth chord, filtered square arp, triangle pad, sawtooth FX sweep
- **Scale**: Minor pentatonic starting at C2 (65.41 Hz)
- **Timing**: 16th note grid, BPM adjustable 60–200

---

## Data Model

### Game State (localStorage)
```json
{
  "playerId": "uuid",
  "playerName": "string (max 12)",
  "currentLevel": 1,
  "currentCity": "city-id | null",
  "completedCities": ["city-id", ...],
  "clout": 0,
  "character": {
    "skinTone": "medium",
    "hairStyle": "fade",
    "hairColor": "#1a0a00",
    "topStyle": "hoodie",
    "topColor": "#0050ff",
    "pantsStyle": "baggy",
    "pantsColor": "#111133",
    "accessory": "headphones"
  },
  "tracks": {
    "city-id": [[true, false, ...], ...]
  }
}
```

### API Endpoints
- `POST /api/game/save` — persist game state to server
- `GET /api/game/load/:playerId` — load game state
- `GET /api/social/posts` — list GRAMMCHAT posts
- `POST /api/social/posts` — create a post
- `POST /api/social/posts/:id/rate` — rate a post (1–5)
- `GET /api/social/leaderboard` — ranked clout standings
