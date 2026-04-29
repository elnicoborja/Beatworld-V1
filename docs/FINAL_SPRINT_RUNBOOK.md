# Beat World — Final Sprint Runbook

**Date:** 2026-04-28 EOD → 2026-05-01 8:37 AM Bogotá ship
**Status:** all code shipped. Only assets + QA + submission remain.

---

## 1. File-name + location manifest (asset drops)

Every path below is **on-disk**, relative to `beat-world-2026/`. URLs in code are the same with `/assets/...` prefix (Vite serves `public/` at root).

### 1.1 Sprite renames (DO FIRST — current files have `.png.png`)

In PowerShell at the project folder:

```powershell
cd "C:\Users\nicob\OneDrive\Documentos\Claude\Projects\SOUND OS\04_SOUND_AGENCY\BEATWORLD-APP\beat-world-2026"
Rename-Item public\assets\sprites\venues\studio-pr.png.png studio-pr.png
Rename-Item public\assets\sprites\venues\gig-pr-block-party.png.png gig-pr-block-party.png
Rename-Item public\assets\sprites\soundsystem\pico.png.png pico.png
Rename-Item public\assets\sprites\soundsystem\pico-silhouette.png.png pico-silhouette.png
```

### 1.2 Sprites to GENERATE (Gemini Gem prompts in `SPRITE_PROMPT_PACK_REVIEW_AND_JAMAICA.md`)

| File | Path | Source prompt |
|---|---|---|
| `critic-xxxs.png` | `public/assets/sprites/characters/` | §1 (Charlamagne, 256×256, transparent) |
| `critic-cornplex.png` | `public/assets/sprites/characters/` | §3 (Young Miko, 256×256, transparent) |
| `review-magazine-cover-xxxs.png` | `public/assets/sprites/ui/` | §2 (XXXS template, 720×900, opaque, **5 EMPTY stars**) |
| `review-magazine-cover-cornplex.png` | `public/assets/sprites/ui/` | §4 (CORNPLEX, 720×900, opaque, **regen with all 5 stars empty**) |

Optional (post-Vibe-Jam, briefs in §5–§6 of the same pack):
- `dub-shack.png` (256×256) — Jamaica Dub Shack Stack
- `dub-shack-unlock-kingston.png` (1920×1080) — Kingston unlock cinematic

### 1.3 Audio bundles

```
public/assets/audio/level-01-nyc/
  kick_01.mp3, kick_02.mp3, kick_03.mp3, kick_04.mp3
  snare_01.mp3, snare_02.mp3, snare_03.mp3, snare_04.mp3
  hihat_01.mp3, hihat_02.mp3, hihat_03.mp3, hihat_04.mp3
  bass_01.mp3, bass_02.mp3, bass_03.mp3, bass_04.mp3
  chord_progression_01.mp3, chord_progression_02.mp3,
  chord_progression_03.mp3, chord_progression_04.mp3

public/assets/audio/level-02-pr/
  kick_01.mp3 ... kick_04.mp3
  snare_01.mp3 ... snare_04.mp3
  hihat_01.mp3 ... hihat_04.mp3
  perc_01.mp3 ... perc_04.mp3              (← guiro, NEW for PR)
  bass_01.mp3 ... bass_04.mp3
  chord_progression_01.mp3 ... chord_progression_04.mp3
```

**Specs (recap):**
- One-shots: MP3 128 kbps mono, ~5–30 KB per file, sample-tail length only.
- Loops: MP3 128 kbps stereo 44.1 kHz, **~10.5s = 4 bars** at the level's BPM (NYC 90, PR 92), ~150–220 KB per file. Bounce exactly at bar boundaries, no fade-in/out, no silence padding.

### 1.4 What's already on disk (don't touch)

```
public/assets/sprites/characters/
  beatmaker-{m,f}.png  boombap-{m,f}.png  feline-{m,f}.png
  gfunk-{m,f}.png      otaku-{m,f}.png    punk-{m,f}.png
  critic-xxl.png  ← orphaned, can delete after ship

public/assets/sprites/venues/
  studio-nyc.png  gig-bk-court.png

public/assets/sprites/soundsystem/
  boombox.png  boombox-unlock-coney-island.png

public/assets/sprites/ui/
  review-magazine-cover.png   ← orphaned (replaced by *-xxxs.png)
  soundsystem-hangar.png
```

---

## 2. Codex / Cursor polish snippets

These are the only code knobs left. All three are POSITION TUNES that depend on the new art landing — so do them after the assets are in repo and visible at the deployed URL. Drop these into Codex/Cursor as targeted edits.

### 2.1 Magazine star overlay alignment

**File:** `src/review/ReviewScene.js` (around line 251)
**When to tune:** after `review-magazine-cover-xxxs.png` and `-cornplex.png` ship.
**Symptom:** filled stars float in the wrong spot relative to the cover's empty star row.

```js
// Find this block:
const stars = document.createElement('div');
stars.style.cssText = `
  position:absolute; top:24px; right:14px;
  display:flex; gap:4px; pointer-events:none;
`;
```

**Codex prompt:**
> The magazine cover image at `/assets/sprites/ui/review-magazine-cover-xxxs.png` has an empty 5-star row positioned somewhere near the top-right of the 720×900 cover. The current overlay sits at `top:24px; right:14px;` of a 280×350 scaled cover container. Open the cover image, eyeball where the empty star row lands proportionally (e.g. "10% from top, 8% from right"), and update the `stars.style.cssText` to use percentage-based positioning so it survives the 280×350 scaling. Keep `gap:4px` and `font-size:18px` unless they no longer fit. Apply the same percentage to the CORNPLEX cover by also checking `review-magazine-cover-cornplex.png` and ensuring both align (they share the same template layout per the prompt pack).

### 2.2 Hangar slot offsets

**File:** `src/soundsystem/SoundsystemRevealScene.js` (Stage B, around line 230)
**When to tune:** if the hangar art's painted stages don't align with the 6 equally-spaced hover slots.

**Codex prompt:**
> Open `public/assets/sprites/ui/soundsystem-hangar.png`. Six painted stages are visible across its width. The current Stage B overlay code distributes 6 slots evenly across the canvas at `bottom:18%`. If the painted stages aren't at exactly 1/6, 2/6, ... 6/6 horizontal positions, tune the `slot.style.left` and `bottom` values per slot index. Print the new x-percentages in a comment so future reviewers can re-derive them. Don't break the click-handler or the magenta-pulse highlight — only the geometry.

### 2.3 Performance scene spotlights

**File:** `src/performance/PerformanceScene.js` (around line 70, `NEON_SPOTS` array)
**When to tune:** if the cone of light from the spotlights doesn't hit the boombox / picó on the level's gig backdrop.

**Codex prompt:**
> The CSS spotlights in PerformanceScene are positioned at horizontal `28%, 42%, 58%, 72%` and a fixed vertical `top:62%`. They were aligned for the NYC `gig-bk-court.png` boombox. The level can now be NYC OR PR (`gig-pr-block-party.png` shows a picó stack at a different position). Read both images, compute the rig's center for each, and split `NEON_SPOTS` into a per-cityId map: `SPOTS_BY_CITY = { 'new-york': [...], 'puerto-rico': [...] }`. Use the player's `gameState.data.currentCity` in `show()` to pick. Fall back to the NYC array if a city isn't mapped.

---

## 3. Claude Code prompt — finalize sprint (single command)

Use Claude Code (CLI) when you've dropped all assets and want one agent to bundle the commits, smoke-test, and verify the deploy. From your terminal in `beat-world-2026/`:

```bash
claude
```

Then paste this single prompt:

> You're closing the May 1 Vibe Jam sprint for Beat World. The current branch is `main`. All code is shipped. Audio + magazine + critic art was just dropped by the producer.
>
> **Verify and finalize, in this order. Stop and report if any step fails.**
>
> 1. **OneDrive null-byte sweep.** Every `src/**/*.js` file has been edited through OneDrive sync today. Run `for f in $(find src -name '*.js'); do tr -d '\0' < "$f" > "/tmp/$(basename "$f").stripped" && cp "/tmp/$(basename "$f").stripped" "$f"; done` to strip any trailing null bytes that would crash the build parser. Re-check with `grep -l $'\0' src/**/*.js`. The grep may flag files even after stripping due to OneDrive re-corruption — confirm by running the build, not by trusting grep.
>
> 2. **Asset manifest check.** Confirm these files exist with non-zero sizes:
>    - `public/assets/sprites/characters/critic-xxxs.png`
>    - `public/assets/sprites/characters/critic-cornplex.png`
>    - `public/assets/sprites/ui/review-magazine-cover-xxxs.png`
>    - `public/assets/sprites/ui/review-magazine-cover-cornplex.png`
>    - `public/assets/audio/level-01-nyc/{kick,snare,hihat,bass}_{01,02,03,04}.mp3`
>    - `public/assets/audio/level-01-nyc/chord_progression_{01,02,03,04}.mp3`
>    - `public/assets/audio/level-02-pr/{kick,snare,hihat,perc,bass}_{01,02,03,04}.mp3`
>    - `public/assets/audio/level-02-pr/chord_progression_{01,02,03,04}.mp3`
>
>    Also confirm there are no `.png.png` or `.mp3.mp3` files anywhere under `public/assets/`. Flag any missing or double-extension files.
>
> 3. **Build verification.** Run `npx vite build --outDir /tmp/bw-dist --emptyOutDir`. Expect ~20 modules transformed, JS bundle around 880 KB, no errors. If the build fails on a syntax error in `src/**/*.js`, re-run step 1 (the OneDrive nulls have come back) and try again. Report the final bundle size.
>
> 4. **Single commit + push.** Stage everything (`git add .`), commit with message `assets: L1 NYC + L2 PR audio + XXXS/CORNPLEX magazines + Charlamagne/Young Miko critics`, push to `origin main`. Vercel auto-deploys.
>
> 5. **Wait for Vercel.** Poll the Vercel deployment via the Vercel MCP if available, or wait 60s. Confirm `https://beatworld.nicoborja.com` returns 200 and the deployed bundle hash differs from before the push (check the `<script>` tag in the served HTML).
>
> 6. **Functional smoke.** Use the Chrome MCP if available to load `https://beatworld.nicoborja.com` in an incognito tab. Click through: character select → enter NYC → confirm studio backdrop is NYC + chord buttons say BOOM BAP / G-FUNK / TRAP / SOUL LOOP + mixer panel exists + tip bubble cycles. Click FINISH BEAT → confirm Name Your Beat modal appears → confirm beat name. Confirm review screen shows XXXS magazine cover + Charlamagne critic + outlet text "CHARLAMAGNE · XXXS". Confirm boombox unlock cinematic plays. Confirm directory YOU card shows the latest beat name + rating. Confirm SHARE downloads a 1080×1080 PNG with the unlock cinematic background, character composited in front, and only "BEAT NAME / beatworld.nicoborja.com" at the bottom (no "Built with", no "Produced in", no waveform).
>
>    Repeat the loop for L2 by going back to level select → entering Puerto Rico → confirming studio backdrop is PR + chord buttons say DEMBOW BASE / PERREO MINOR / SAN JUAN PIANO / REGGAETON ROMÁNTICO + 6 instrument tracks including GUIRO and SYNTH HOOK + 92 BPM + Daddy Yankee quote. Confirm review screen shows CORNPLEX cover + Young Miko critic + outlet text "YOUNG MIKO · CORNPLEX" + Spanish review copy. Confirm picó-Vieques unlock cinematic plays.
>
> 7. **Vibe Jam screenshot capture.** Take 5 screenshots and save them to `docs/vibejam-screenshots/`:
>    1. Character select 6×2 grid
>    2. NYC studio mid-beat (with mixer expanded + tip bubble)
>    3. NYC review with XXXS cover + Charlamagne
>    4. PR review with CORNPLEX cover + Young Miko
>    5. Share artifact for a 2-star NYC beat
>
> 8. **Final report.** Summarize: bundle size delta, any 404s in the Network tab, any console errors, any visual issues that would benefit from a Wednesday position-tune pass. List the 5 screenshot paths.
>
> Do NOT modify any prompts in `docs/`, do NOT regenerate art, do NOT touch the `master` branch, do NOT modify the `mediaOutlet` field in GameData.js (the per-level review config in ReviewScene.js is canonical).

---

## 4. Tuesday EOD → Wednesday → Friday checklist

```md
TUESDAY EOD (TONIGHT):
- [ ] Rename 4 PR sprites with .png.png → .png
- [ ] Generate critic-xxxs.png (Charlamagne, prompt §1)
- [ ] Generate critic-cornplex.png (Young Miko, prompt §3)
- [ ] Generate review-magazine-cover-xxxs.png (5 empty stars, prompt §2)
- [ ] Re-generate review-magazine-cover-cornplex.png (5 empty stars, prompt §4)
- [ ] Cut/produce 20 NYC audio one-shots + 4 NYC chord loops
- [ ] Cut/produce 20 PR audio one-shots (incl. guiro perc) + 4 PR chord loops
- [ ] Run the Claude Code prompt above → single push → Vercel deploy
- [ ] Hard-refresh beatworld.nicoborja.com in incognito → click full L1 + L2 loop

WEDNESDAY:
- [ ] Run Codex polish snippets if any visuals need alignment
- [ ] 5 Vibe Jam screenshots captured
- [ ] Submit to Vibe Jam portal (URL: beatworld.nicoborja.com)

THURSDAY:
- [ ] Buffer day. Re-test on phone (LTE, no cache). Fix any regressions.

FRIDAY May 1:
- [ ] Confirm site loads. Tweet share artifact with #VibeJam2026.
```

---

## 5. Cleanup tasks (post-Vibe-Jam, weekend)

```md
- [ ] Delete orphaned critic-xxl.png and review-magazine-cover.png
- [ ] Delete `master` branch + 4 codex/* branches on GitHub
- [ ] Make `main` the default branch on GitHub
- [ ] Diagnose OneDrive null-byte append issue (probable cause: another sync app — Google Drive Desktop, Dropbox, or a file-watcher — also indexing the OneDrive folder concurrently)
- [ ] If OneDrive corruption keeps happening: move project out of OneDrive entirely to a plain `~/code/beatworld/` folder. Re-link with `vercel link` and re-add `git remote`.
```

---

## 6. Hazard reference (if anything breaks during sprint)

**Build fails with "Failed to parse source for import analysis":**
- Cause: OneDrive corrupted a `src/**/*.js` file with trailing null bytes.
- Fix: `tr -d '\0' < src/path/to/file.js > /tmp/clean && cp /tmp/clean src/path/to/file.js`. Re-run build.

**Live site shows yesterday's UI:**
- Cause: browser cache or wrong Vercel project receiving the domain.
- Fix: incognito + hard-refresh (Ctrl+Shift+R). If still wrong, check Vercel → Settings → Domains → confirm domain is on the `beatworld` project NOT the orphaned old one.

**404 on `/assets/sprites/...` or `/assets/audio/...`:**
- Cause: file is at `assets/...` (project root) or has `.png.png` / `.mp3.mp3` double extension.
- Fix: move to `public/assets/...` and verify exact filename (no double extensions).

**`git push` rejected for non-fast-forward:**
- Cause: Vercel auto-deploy or another agent pushed first.
- Fix: `git pull --rebase origin main` then `git push origin main`.
