# Beatworld — Scope Call v2 (Amendment) — 2026-04-27

**Supersedes parts of `SCOPE_CALL_2026-04-27.md`. Read this second.**

This amendment captures the redirect from Nico late on 2026-04-27: linear progression replacing open-world, soundsystem-build as the brand-tied reward loop, soundsystem.world as the cultural reference, and the framing of Beat World as proof-of-concept marketing for Sound OS.

---

## Decisions locked (confirmed via AskUserQuestion)

1. **Game shape:** Vertical slice for May 1. One level (NYC / Hip Hop), full loop, soundsystem reveal, "coming soon" tease for levels 2-6.
2. **Code execution:** Claude Code (CLI agent). Cowork stays as planning/orchestration layer. I write the brief; Claude Code ships it.
3. **Soundsystem visual style:** Evolves by region. NYC boombox → Caribbean picó stack → Brazil baile funk truck → Andean bass cabinet → Mexico cumbia rig → Berlin warehouse stack. Final form is a global mashup that visibly tells the story of the player's journey.

---

## What soundsystem.world actually is (and what it isn't)

I fetched and analyzed the site before responding. Important to ground the reference:

**What it is:**
- The first worldwide interactive map of original Reggae & Dub soundsystems
- A cultural archive — real rigs pinned on a globe, each with a name, photo, bio, weblink
- Built by "passionate soundsystem lovers, DJs, vinyl collectors, promoters & soundsystem activists"
- Includes Colombian Picó culture (Druidiscos example)
- Submission-based — registered users add their rig to the directory
- Has /map, /soundsystems, /submit, /submit-sessions, /about, /soundsystems/[slug] pages

**What it isn't:**
- Not a 3D customizer
- Not a game
- Not a synthesizer or audio tool
- Not a marketplace

**What this means for the reference:** Nico isn't asking us to clone a configurator UI. He's pointing at a *vibe* — the cultural celebration of real soundsystems, the directory aesthetic, the sense of global community. The game's job is to **let amateur producers participate in that culture by building digital rigs that look and feel like the real ones in the directory.**

The soundsystem.world reference unlocks a sharper design move: **at the end of Level 1, briefly surface a "global directory" view — fake/mock entries showing other producers' rigs around a globe.** Sets up the community vision in one screen. Doesn't require a backend. Becomes the "wow, this could be huge" moment for contest judges.

---

## The bigger vision payload (Nico's words, paraphrased)

> "A new way of creating community and showing music to the world. A new type of marketing — gaming, not video clips. Digital experiences. That's what El Sound System and the Sound OS are about. If you have the Sound OS you can build something like this and take advantage of all the data, build a real community and share it with the rest of the world — like digital scenes, for real."

**Strategic frame:** Beat World 2.0 isn't a contest entry that happens to mention SOUND. **It's a working demonstration of the Sound OS thesis.** The pitch becomes:

> "This game took 4 days to build for a contest. Imagine what real artists can build on top of Sound OS infrastructure. Music marketing isn't video clips anymore — it's playable scenes. Welcome to digital scene-building."

This makes Beat World a **paid lead-magnet for Sound OS**, not a side project. It changes the May 1 launch math:
- Vibe Jam contest visibility = top of funnel for indie game / music-tech crowd
- Beat World → "Built with Sound OS" footer link → Sound OS waitlist / Sound Check / Course 1
- Every share to X/IG of a finished beat = organic distribution of the Sound OS narrative
- The soundsystem-as-identity mechanic = blueprint for what artists can build on Sound OS for their own fans

**This reframe stays internal** — don't put it in the Vibe Jam submission copy or it reads as marketing. Show, don't tell. The game does the work.

---

## Vertical slice — revised with the vision payload

The original slice was: 1 city → studio → performance → review → first soundsystem piece + coming-soon teaser. The vision payload adds two surfaces.

### Final slice for May 1

| # | Screen | New / Revised | Estimated build time |
|---|---|---|---|
| 1 | Loading / Start | Keep current `index.html` | 0 (done) |
| 2 | Skip character creator | **Cut for slice.** Use default avatar preset. Defer customization to post-launch. | 0 (cut) |
| 3 | Level Select (replaces World Map) | **NEW** — vertical list of 6 levels, only Level 1 unlocked, rest show silhouette of next soundsystem piece + region label. | 1.5 hr |
| 4 | Studio (NYC, 4 instruments, 16-step grid) | Keep current `StudioScene.js`. Wire per-instrument color theming. | 0.5 hr (theming only) |
| 5 | Performance Screen | **NEW** — Three.js stage with crowd silhouettes parallax, beat plays back automatically, ~30s, neon stage lights. | 2 hr |
| 6 | Review Screen | **NEW** — XXL Mag critic portrait, 3-5 star rating based on grid density + downbeat hits, 1-line generated review, "+50 CLOUT" reveal. | 1.5 hr |
| 7 | Soundsystem Reveal | **NEW** — Pixel-art "your rig so far" hangar. Boombox unlocked + sitting alone. 5 silhouettes labeled by region. | 1.5 hr |
| 8 | Global Directory Glimpse | **NEW** — One screen with 5-6 mock producer cards (avatar + soundsystem thumbnail + city + 1-line bio), styled after soundsystem.world cards. "JOIN THE DIRECTORY" CTA → email signup → Klaviyo. | 1.5 hr |
| 9 | Share artifact | **NEW** — Canvas-rendered image of the player's beat + soundsystem, exported as PNG, X/IG share intent attaches the image. | 2 hr |
| 10 | "Built with SOUND OS" footer link | **NEW** — Always present. Links to elsoundsystem.com with utm tracking. | 0.25 hr |

**Total Claude Code build time: ~10.75 hours.** Spread over Apr 28-29, that's ambitious but achievable IF assets land Apr 28 and Sound Check firefighting doesn't pull Nico off-task.

### What the slice cuts (vs. original handoff plan)

- 23 of 24 cities (only NYC active for May 1)
- Character creator (default avatar)
- GRAMMCHAT social platform
- Leaderboard
- Battle mode
- Per-city studio backgrounds (use studio neon-grid backdrop only)
- Guest producer intro screens
- Multiple critics per review (1 critic, 1 paragraph)
- Stage completion logic beyond the simple "you played, here's the score" trigger
- 42-asset pixel-art spec (cut to 5 illustrations — see §5 below)

---

## Soundsystem progression — region-evolving (locked)

Confirmed style: "Evolves by region. NYC = boombox → Caribbean = picó → Brazil = baile funk truck → Berlin = warehouse rig."

### Level → Soundsystem piece map

| Level | Region | Genre lead | Soundsystem piece unlocked | Cultural reference |
|---|---|---|---|---|
| 1 | New York | Hip Hop | **Boombox** (single unit, twin speakers, cassette deck) | 80s NYC park boomboxes, breakdance circles |
| 2 | Caribbean | Reggaeton / Dembow | **Picó stack** (hand-painted column of speakers + tweeter horns) | Colombian/Caribbean picó culture (referenced in soundsystem.world) |
| 3 | Brazil | Baile Funk / Psytrance | **Baile funk truck speaker wall** (mounted on a wheeled frame) | Rio baile funk arrastões |
| 4 | Andean / Southern Cone | DnB / Tech House | **Bass cabinet + sub stack** (modular wooden cabinets) | Buenos Aires underground rave culture |
| 5 | Mexico | Cumbia / Tribal | **Sonidero rig** (multi-speaker tower with hand-painted signage) | Mexico City sonidero tradition |
| 6 | European Underground | Techno / Jungle | **Warehouse function-one stack** (industrial monolith, fog, strobes) | Berghain / Berlin warehouse parties |

**Final form:** All six pieces visible together in the soundsystem hangar = the player's "global rig." Each piece retains its regional identity but shares a coherent visual base (matte black wood, painted accents, neon labels).

**This becomes the player's identity in the future global directory.** Two players who both finished the game still have meaningfully different rigs based on which order/style they explored.

---

## Illustration list — 5 hero assets for May 1 (your Gemini Gem + GPT workflow)

These replace the 42-asset minimum-viable spec. Each one earns its place in the slice.

### Asset 1 — Soundsystem Piece #1: Boombox (HERO ASSET)

**Why it matters:** First reward the player ever sees. Has to feel meaningful or the entire mechanic falls flat.
**Spec:** Pixel art, ~256×256 px, 32-bit Sega Genesis fidelity, isometric perspective, clear silhouette. Boombox with twin speakers, cassette deck, antenna, carrying handle. NYC graffiti aesthetic — could have a tag spray-painted on the side.
**Suggested prompt for your Gemini Gem:** *"Isometric pixel art of an 80s NYC boombox, twin chrome-rimmed speakers, cassette deck with two tape doors, telescoping antenna up-right, carrying handle, black plastic body with subtle graffiti tag in magenta on the side. eboy.com style, 32-bit fidelity, ~256px square, transparent background, sharp pixel edges, no anti-aliasing."*

### Asset 2 — Soundsystem Hangar (the empty stage)

**Why it matters:** The player sees this every time they unlock a piece. It's the "look at what I'm building" surface that has to feel aspirational.
**Spec:** Pixel art, ~1280×720 px, isometric or 3/4 perspective. Empty warehouse interior, dark navy walls, neon strip lights along the floor. 6 silhouette outlines on the floor labeled "LEVEL 1: BOOMBOX", "LEVEL 2: PICÓ", "LEVEL 3: BAILE FUNK TRUCK", "LEVEL 4: BASS CABINET", "LEVEL 5: SONIDERO RIG", "LEVEL 6: WAREHOUSE STACK". Title at top: "MY SOUND SYSTEM."
**Suggested prompt:** *"Isometric pixel art warehouse interior, dark navy walls, neon magenta floor strips, 6 dark silhouettes of soundsystem rigs in a row on the floor (boombox, picó column, truck speaker wall, bass cabinet, sonidero tower, warehouse stack), each with a small neon label below. eboy.com style, 32-bit fidelity, 1280x720 widescreen, dark moody atmosphere, slight CRT scanline effect."*

### Asset 3 — NYC Performance venue (Madison Square Garden vibe)

**Why it matters:** The performance screen is the "show off the beat you made" moment. Background sets the stakes.
**Spec:** Pixel art, ~1920×600 px (wide aspect for parallax). Stage view from audience perspective. Looking at: a stage with two stacks of speakers, DJ booth in center, dark crowd silhouettes in foreground (parallax foreground layer), neon stage lights overhead, hint of NYC skyline as backdrop.
**Suggested prompt:** *"Pixel art view of a hip-hop concert stage from audience perspective, two large speaker stacks flanking a central DJ booth, dark silhouettes of a crowd in foreground (separate layer for parallax), neon magenta and cyan stage lights overhead, NYC skyline silhouette in distant background, dark navy night sky. eboy.com style, 32-bit fidelity, 1920x600 wide aspect ratio, layered for parallax."*

### Asset 4 — XXL Mag critic portrait

**Why it matters:** The critic is a character. They need personality. Player will see this every time they finish a beat.
**Spec:** Pixel art, ~256×256 px, head-and-shoulders portrait. NYC hip-hop journalist energy — could be a Black or Latino character with a snapback, gold chain, "XXL" embroidered on the cap. Smug expression. Microphone in hand (optional).
**Suggested prompt:** *"Pixel art portrait of a hip-hop journalist, head and shoulders, wearing a black snapback with 'XXL' embroidered in white, gold chain, leather jacket, smug confident expression, brown skin tone, beard. eboy.com style, 32-bit fidelity, 256x256 square, dark background with subtle magenta glow halo."*

### Asset 5 — Default player character (since we're cutting the creator)

**Why it matters:** The player needs an avatar to project onto. Without the customizer we need ONE good default.
**Spec:** Pixel art, ~96×192 px (twice as tall as wide), full body. A producer character: hoodie, headphones, baggy jeans, sneakers, racially-ambiguous (let players project), neutral skin tone. Holding a sampler or laptop.
**Suggested prompt:** *"Full-body pixel art character of a young music producer, wearing a black hoodie with magenta drawstring, large over-ear headphones, baggy dark blue jeans, white sneakers, holding a small drum machine sampler. Racially-ambiguous medium skin tone, short fade haircut. eboy.com style, 32-bit fidelity, 96x192 portrait orientation, transparent background."*

### Asset 6 (BONUS — only if time permits) — Mock global directory cards

**Why it matters:** The "soundsystem.world-style directory glimpse" benefits from 5-6 small mock thumbnails of OTHER fictional producers' rigs. Each ~128×128. If you can batch-generate these, the directory screen looks real instead of empty.

---

## "Built with SOUND OS" footer — the load-bearing brand link

Every screen has a small footer: `Built with [SOUND OS](https://elsoundsystem.com?utm_source=beatworld&utm_medium=game&utm_campaign=vibejam2026)`.

This is the *only* explicit Sound OS marketing in the game. Everything else is implicit — the soundsystem mechanic, the directory glimpse, the cultural references. Show, don't tell.

**Klaviyo list separation flag from v1 still applies:** The "JOIN THE DIRECTORY" CTA on the global directory screen MUST go to a separate Klaviyo list (or at minimum a separate tag like `source:beatworld`) to avoid polluting Sound Check beta data on May 1.

---

## What I'm writing next

Two files coming:

1. `04_SOUND_AGENCY/BEATWORLD-APP/CLAUDE_CODE_BRIEF_LEVEL_1.md` — self-contained implementation brief Nico can paste into Claude Code. Includes: scope, file-by-file changes, scene state machine refactor, asset placeholder strategy (so Claude Code can build with placeholder rectangles and Nico drops in real art when ready), acceptance criteria.

2. (Once you've reviewed v2 and approved) — A queued plan-v1 revision pass on `00_plan_to_june30_v0.md` for SOUND OS Phase 1, since that doc didn't anticipate the Beat-World-as-marketing-engine framing.

---

## Sources

- [soundsystem.world](https://www.soundsystem.world/) — first worldwide interactive map of original Reggae & Dub soundsystems
- [soundsystem.world — Soundsystems Archive](https://www.soundsystem.world/soundsystems/) — directory of submitted rigs
- [soundsystem.world — Submit](https://www.soundsystem.world/submit/) — submission form pattern
- [Druidiscos SoundSystem entry](https://www.soundsystem.world/soundsystems/druidiscos-soundsystem/) — example merging Jamaican & Colombian Picó cultures
