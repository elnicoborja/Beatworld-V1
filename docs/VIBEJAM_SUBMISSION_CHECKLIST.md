# Beat World 2.0 — Vibe Jam 2026 Submission Runbook

**Deadline:** Friday May 1, 2026 · 8:37 AM Bogotá
**Live URL:** https://beatworld.nicoborja.com
**Repo:** `elnicoborja/Beatworld-V1` (production branch: `main`)

Work top-to-bottom. Don't skip the smoke test.

---

## 0. Final state (what shipped this session)

- City autocomplete via OpenStreetMap Nominatim (no API key, 350ms debounce, 5-result dropdown)
- Stars overlay removed from review (score panel already shows ★★★★★)
- Track header column locked at 152px with `box-sizing:border-box` — no more overlap with grid
- L3+ hard-gated to COMING SOON modal with email capture
- Voice-stealing on bass + lead samplers (no overlapping notes)
- Quantized chord progression swap on bar 0 boundary
- Soundsystem reveal: per-level cinematic + 6-rig collection row + culture prose per city
- Share artifact: 1080×1080 PNG, character composited on unlock backdrop
- Build clean at **907.98 kB JS / 226.78 kB gzip**

---

## 1. Push (5 min)

From `C:\Users\nicob\OneDrive\Documentos\Claude\Projects\SOUND OS\04_SOUND_AGENCY\BEATWORLD-APP\beat-world-2026\`:

```powershell
# Verify nothing broken before commit
npx vite build --outDir dist --emptyOutDir

# If OneDrive corrupted any file with null bytes, strip them first:
# (only needed if build fails with "unexpected character" errors)
# Get-ChildItem -Recurse -Path src -Include *.js | ForEach-Object {
#   (Get-Content $_.FullName -Raw) -replace "`0","" | Set-Content $_.FullName -NoNewline
# }

git add .
git status                                  # eyeball — no surprise files
git commit -m "Final ship — city autocomplete, stars cleanup, L3+ gate, voice-stealing"
git push origin main
```

Vercel auto-deploys from `main`. Watch https://vercel.com/elnicoborja/beatworld for the deploy. ~60 seconds.

---

## 2. Smoke test (10 min) — production URL only

Open https://beatworld.nicoborja.com in **Chrome incognito** (no localStorage carryover).

**Character select**
- [ ] Name input accepts text
- [ ] City input — type "Bogo" → dropdown shows Bogotá, Colombia within ~1s
- [ ] Click result → input fills with full display name
- [ ] Cycle through 6 styles, both presentations (m/f)
- [ ] Continue → level select

**Level select**
- [ ] L1 NYC unlocked, L2 locked until L1 done
- [ ] Click L3 → COMING SOON modal with email field
- [ ] Email signup → mailto opens
- [ ] Click L1 → studio loads

**L1 NYC studio (full loop)**
- [ ] 4 tracks render (kick, snare, hihat, bass)
- [ ] Variant cycle button works on each track
- [ ] [S] [M] buttons toggle solo/mute, solo wins
- [ ] Volume fader audibly changes that track only
- [ ] Place beats, hit PLAY — hear pattern
- [ ] Chord picker (4 colored circles) cycles chord — quantized to bar 0
- [ ] Beat tracking bar moves with playhead, downbeat marks visible
- [ ] FINISH BEAT → name modal → save
- [ ] Performance scene plays back ~28s with neon spotlight pulses
- [ ] SEE REVIEWS → magazine cover + Charlamagne critic + score panel top-right (no duplicate stars)
- [ ] Continue → soundsystem cinematic (boombox unlock, no white space)
- [ ] Stage B shows hero rig + culture prose + collection row (1/6 owned)
- [ ] Continue → directory shows YOU card with 📍 city link to Google Maps

**L2 PR full loop**
- [ ] Studio loads with 5 tracks (kick, snare, hihat, perc, bass) + synth lead
- [ ] Reggaeton chord progression options play
- [ ] Full loop → CORNPLEX cover + Young Miko critic
- [ ] Soundsystem reveal: picó unlock at Vieques, collection now 2/6

**Mobile (iPhone 14 Pro Max via Chrome devtools)**
- [ ] Mixer track headers don't clash with step grid
- [ ] Performance/Review/Soundsystem buttons fit on screen

**Share artifact**
- [ ] From review or directory → SHARE button → 1080×1080 PNG downloads
- [ ] Image shows character + unlock backdrop + beat name + URL footer

If any item fails → fix → repeat from `git add` in step 1.

---

## 3. Vibe Jam submission

Portal: **https://jam.pieter.com** (Vibe Jam 2026 entry form)

**Required fields**

| Field | Value |
|---|---|
| Title | Beat World 2.0 |
| URL | https://beatworld.nicoborja.com |
| Author | Nicolás Borja |
| Twitter/X | (your handle) |

**Tagline (60 char)**
```
A pixel-art beatmaking RPG. Cook beats, get reviews, earn rigs.
```

**Description (longer)**
```
Beat World 2.0 is a pixel-art music production game. You move from city
to city — NYC boom-bap, Puerto Rican reggaetón, and beyond — building
beats on a real Tone.js sequencer with per-track samples. Finish a track,
hit the stage, get reviewed by a city critic, and unlock the local
soundsystem rig. Every beat you make is saved. Every rig you earn joins
your collection. Built for #VibeJam2026.
```

**Tags (if available):** `music`, `pixel-art`, `rhythm`, `creative-tool`, `vanilla-js`, `three.js`, `tone.js`

**Screenshots — capture 3 in this order:**
1. Studio scene mid-beat (L1 or L2) with chord picker visible
2. Magazine review with critic + score panel
3. Soundsystem Stage B (hero rig + collection row)

Save as `submission/screenshot-01-studio.png`, `submission/screenshot-02-review.png`, `submission/screenshot-03-soundsystem.png`.

---

## 4. Launch tweet

Attach the share artifact PNG OR a 30-second screen recording (Studio → Performance → Review).

```
Cooked Beat World 2.0 for #VibeJam2026 🎛️

Pixel-art beatmaking RPG. Real Tone.js sequencer. Build a beat in NYC,
get rated by Charlamagne, unlock the boombox. Then fly to PR for
reggaetón and the picó.

Made by an architect who DJs weddings.

→ https://beatworld.nicoborja.com
```

Spanish version (post 2h later for LATAM timezone):

```
Lanzamiento: Beat World 2.0 🎛️ Mi entrada para #VibeJam2026

Un RPG pixelado para cocinar beats. Empiezas en NYC con boom-bap,
desbloqueas el boombox. Luego viajas a PR, prendes el picó y haces
reggaetón. Cada track que haces queda guardado.

Made in Bogotá.

→ https://beatworld.nicoborja.com
```

---

## 5. Post-submission (optional — only if time)

These are nice-to-haves. Submit first, then come back.

**A. L3-L6 city preview thumbnails** — if any of these are missing in `public/assets/sprites/levels/`, the level select shows a placeholder:
- `preview-rio.png` — Rio favela skyline at dusk, pixel art, baile-funk vibe
- `preview-andean.png` — Andean cordillera silhouette, terraced houses, pixel art
- `preview-mexico.png` — Mexico City rooftop with sonidero rig, pixel art, dusk
- `preview-jamaica.png` — Kingston yard with dub-shack stack, palm tree silhouette, pixel art

Gemini/Nano Banana prompt template:
```
Pixel art city preview thumbnail, 256x256, 16-bit SNES era,
{CITY} skyline at {TIME OF DAY}, {GENRE-SPECIFIC ELEMENT},
warm color palette ({GENRE} mood), no text, no UI,
clean transparent or solid sky background. Match the style of
the existing NYC and PR preview thumbnails.
```

**B. Loading screen between level select and studio** — deferred. A 1-2s pixel-art "DIGGING IN THE CRATES…" with a record-spinning sprite would smooth the asset-load wait. Add post-jam.

**C. Pokemon-card aesthetic for YOU card** — deferred. Replace flat directory card with bordered "trainer card" frame, holo gradient, type badges (genre + city). Post-jam.

**D. Multiple MPC sprite sizes** — deferred. `mpc-chrome-sm.png` for mobile would prevent the chrome strip from squishing on narrow viewports. Post-jam.

---

## 6. Submission checklist (final pass)

- [ ] `git push origin main` succeeded
- [ ] Vercel deploy ✅ green at beatworld.nicoborja.com
- [ ] Smoke test §2 all green
- [ ] 3 screenshots captured
- [ ] Vibe Jam portal form submitted
- [ ] Tweet posted (English)
- [ ] Tweet pinned to profile
- [ ] DM the Vibe Jam tweet from @levelsio with your entry link (optional but visible)
- [ ] Spanish tweet queued for +2h

**Submitted state saved here:** Once you submit, write back the timestamp + portal entry URL to this file under a `## Submitted` heading. Future-you will want the receipt.

---

## Emergency contacts (if things break post-submit)

- **Vercel deploy stuck:** dashboard → redeploy from latest commit
- **OneDrive corruption recurring:** pause OneDrive sync on `BEATWORLD-APP/` folder during dev
- **Audio not loading on mobile:** Tone.js requires user gesture — already wired via the START button. If it ever silently fails, check console for `AudioContext was not allowed to start`.
- **Nominatim rate-limit (1 req/sec):** the 350ms debounce already handles it. If users complain, fall back to plain text input — gracefully handled in CharacterSelectScene.

---

**Ship it. Beat the deadline. Pin the tweet. Drink something.**
