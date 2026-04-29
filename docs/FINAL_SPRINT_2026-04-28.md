# Beat World — Final Sprint to May 1 Vibe Jam Ship

**Date:** 2026-04-28
**Deadline:** Friday May 1 8:37 AM Bogotá (UTC 13:37)

---

## Where we stand right now

**Code:** complete and live on `main` at `7e99fe1`. Vercel auto-deploys from `main` after the master/main untangling earlier today. Live site: `https://beatworld.nicoborja.com`.

**Sprites landed today:**
- All 12 character variants (boombap, gfunk, punk, beatmaker, otaku, feline × m/f) ✓
- L1 NYC venues + soundsystem + UI + critic ✓ (clean filenames)
- L2 PR venues + soundsystem ✓ (filenames have `.png.png` — rename before push)

**Sprites still needed:**
- **CRITICAL for May 1:** `critic-complex.png` (Young Miko portrait) + re-skinned `review-magazine-cover.png` (COMPLEX masthead). Brief: `docs/SPRITE_PROMPT_PACK_REVIEW_AND_BERLIN.md`.
- **Post-launch v1.1+:** Berlin warehouse + unlock cinematic. Brief: same doc.

**Audio still needed:**
- 20 NYC L1 samples (4 kicks, 4 snares, 4 hihats, 4 basses, 4 chord progressions). Spec: `docs/AUDIO_SAMPLE_SPECS.md`. Drop into `public/assets/audio/level-01-nyc/`.

---

## Outstanding asset list (canonical)

### CRITICAL — must ship by May 1

| # | Asset | Path | Status |
|---|---|---|---|
| 1 | Young Miko critic | `public/assets/sprites/characters/critic-complex.png` | TO GENERATE |
| 2 | COMPLEX magazine cover | `public/assets/sprites/ui/review-magazine-cover.png` | TO REGENERATE (re-skin) |
| 3 | NYC kick samples | `public/assets/audio/level-01-nyc/kick_01..04.mp3` | TO PRODUCE |
| 4 | NYC snare samples | `public/assets/audio/level-01-nyc/snare_01..04.mp3` | TO PRODUCE |
| 5 | NYC hihat samples | `public/assets/audio/level-01-nyc/hihat_01..04.mp3` | TO PRODUCE |
| 6 | NYC bass samples | `public/assets/audio/level-01-nyc/bass_01..04.mp3` | TO PRODUCE |
| 7 | NYC chord loops | `public/assets/audio/level-01-nyc/chord_progression_01..04.mp3` | TO PRODUCE |

### Filename fixes — do FIRST before any push

These are already on disk but with `.png.png` double-extensions. Will 404 in production.

```powershell
# In your already-open terminal at beat-world-2026/
Rename-Item public\assets\sprites\venues\studio-pr.png.png studio-pr.png
Rename-Item public\assets\sprites\venues\gig-pr-block-party.png.png gig-pr-block-party.png
Rename-Item public\assets\sprites\soundsystem\pico.png.png pico.png
Rename-Item public\assets\sprites\soundsystem\pico-silhouette.png.png pico-silhouette.png
```

### Post-launch v1.1+ (do not block May 1)

- `public/assets/sprites/soundsystem/warehouse.png` — Berlin monolith
- `public/assets/sprites/soundsystem/warehouse-unlock-berlin.png` — Berghain-coded cinematic
- `public/assets/audio/level-02-pr/*.mp3` — Puerto Rico audio bundle (20 samples)

---

## Final sprint plan — Tue night → Fri AM

Three remaining work blocks. Sequence matters.

### Block A — TONIGHT (Apr 28, ~3–4 hours)

**Owner:** Nico
**Goal:** all critical assets generated and in repo, push live.

1. **(15 min)** Rename the 4 `.png.png` PR files using the PowerShell commands above.
2. **(45 min)** Generate Young Miko critic via Gemini Gem. Use the prompt in `SPRITE_PROMPT_PACK_REVIEW_AND_BERLIN.md` §1. Iterate 3–4 variants, pick the strongest smirk. Drop at `public/assets/sprites/characters/critic-complex.png`.
3. **(45 min)** Re-generate COMPLEX magazine cover. Use the prompt in same doc §2. Verify the 5 stars stay empty. Drop at `public/assets/sprites/ui/review-magazine-cover.png` (overwrite existing).
4. **(2–3 hours)** Produce 20 audio samples in DAW. Export as MP3 to `public/assets/audio/level-01-nyc/`. The chord progressions are the load-bearing piece — drums and bass have synth fallbacks; chord loops do not.
5. **(5 min)** Single bundle push:
   ```powershell
   git add .
   git commit -m "assets: PR rename + Young Miko critic + COMPLEX cover + L1 NYC audio bundle"
   git push origin main
   ```
6. **(10 min QA)** Hard-refresh `beatworld.nicoborja.com` in incognito. Run through one full level: character pick → studio (verify chord loops play) → finish → review (verify Young Miko + COMPLEX read clean) → boombox unlock → directory.

**Done state:** every `/assets/...` URL in DevTools Network tab returns 200, no 404s.

### Block B — TOMORROW Wed Apr 29 (1–2 hours)

**Owner:** Nico
**Goal:** position-tuning + screenshots.

1. **(45 min)** Position-tune the three known offsets when art lands clean (per yesterday's status note):
   - Magazine star overlay in `ReviewScene.js` — `top:24px right:14px`. Adjust to align with the empty-star row on the new COMPLEX cover.
   - Hangar slot overlays in `SoundsystemRevealScene.js` — `bottom:18%`, 6 equal columns. Align with painted stages on `soundsystem-hangar.png`.
   - Performance spotlights in `PerformanceScene.js` — horizontal 28/42/58/72%, vertical 62%. Align with the boombox center-bottom on `gig-bk-court.png`.
2. **(30 min)** Vibe Jam screenshot capture (3–5 hero shots):
   - Character select grid (shows the 6×2 picker)
   - Studio mid-beat (shows the new mixer + tip bubble)
   - Performance scene with spotlights firing
   - Review scene (Young Miko + COMPLEX cover with stars filled)
   - Coney Island unlock cinematic OR directory grid
3. **(15 min)** If you want a polish round: optional Three.js bloom add-back on the performance scene per the original brief §10. Skip if running short.

### Block C — Wed PM / Thu (buffer)

**Owner:** Nico
**Goal:** Vibe Jam submission + buffer.

1. Submit at the Vibe Jam portal: title, screenshots, URL `https://beatworld.nicoborja.com`, short description. Lean into the soundsystem-as-reward mechanic and the "built in 5 days" angle. **Do NOT mention Sound OS or the marketing thesis** — that stays implicit.
2. Buffer day for any last-mile QA. If anything regresses, you have Thursday to fix.

### Friday May 1 morning

- Confirm site loads at `beatworld.nicoborja.com` from a phone (LTE, no caching).
- Tweet the share artifact with `#VibeJam2026`.
- Done.

---

## Risk register (refreshed)

| Risk | Likelihood | Mitigation |
|---|---|---|
| Audio samples slip past Tue EOD | Medium | Synth fallbacks cover drums + bass. Chord loops are the only must-have. If a chord loop is missing, that progression is silent — not broken, just thinner. |
| Young Miko critic likeness concerns | Low | The prompt says "Young Miko-coded" and "pixel-art interpreted" — original art, not photo-derived. Same approach as DJ Primo, KURUPT MC etc. — coded references, not real likeness. |
| Magazine cover star overlay misaligned | Low | Position-tunable in 5 min once art lands. See Block B step 1. |
| OneDrive sync locks files during push | Medium | Pause OneDrive sync for the project folder during commits if you see "EPERM" errors. |
| Sound Check beta May 1 collision | Medium | Sound Check stability takes priority per project memory. If forced to choose, ship Beat World in whatever state it's in — even partial. The point is the URL exists for Vibe Jam day. |

---

## What's deferred to v1.1 (do NOT chase before May 1)

- Level 2 Puerto Rico runtime wiring (the assets are in repo, but `LEVEL_PROGRESSION` still says `unlocked: false`. Leave it.)
- Berlin warehouse art
- Audio for any level beyond L1 NYC
- Level 2–6 audio bundles
- Custom domain on Sound Check side
- Klaviyo wiring on the directory CTA (currently mailto:)

---

## Cleanup tasks (defer to weekend after Vibe Jam)

- Delete the orphaned `critic-xxl.png` (kept temporarily as backup)
- Delete `master` branch + 4 codex/* branches on GitHub
- Make `main` the default branch on GitHub
- Update `BEATWORLD_SPRINT_STATUS.md` to reflect actual ship state
- Move strategic docs from `replit-V1/` (the old folder) — confirm nothing is still being referenced there

---

## Quick reference — paths + commands

```
# project root
C:\Users\nicob\OneDrive\Documentos\Claude\Projects\SOUND OS\04_SOUND_AGENCY\BEATWORLD-APP\beat-world-2026\

# sprite drops
public\assets\sprites\characters\critic-complex.png
public\assets\sprites\ui\review-magazine-cover.png

# audio drops
public\assets\audio\level-01-nyc\kick_01.mp3 ... kick_04.mp3
public\assets\audio\level-01-nyc\snare_01.mp3 ... snare_04.mp3
public\assets\audio\level-01-nyc\hihat_01.mp3 ... hihat_04.mp3
public\assets\audio\level-01-nyc\bass_01.mp3 ... bass_04.mp3
public\assets\audio\level-01-nyc\chord_progression_01.mp3 ... chord_progression_04.mp3

# the only push command you need
git add .
git commit -m "assets: <what landed>"
git push origin main

# verify
# open https://beatworld.nicoborja.com in incognito, hard-refresh (Ctrl+Shift+R)
```
