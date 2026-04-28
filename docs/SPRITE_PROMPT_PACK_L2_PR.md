# Beat World — Game Art & Sprite Prompt Pack — Level 2: Puerto Rico

**Status:** CANONICAL asset spec for Level 2 Puerto Rico (post-May-1 v1.1 release).
Companion to `SPRITE_PROMPT_PACK_v2.md` (Level 1 NYC). Re-uses the same Gemini Gem
system instructions, global negative prompt, color palette, and slicing rules — only the
content changes. If a section is not duplicated below, fall back to the v2 doc.

**Level 2 reference (from `LevelProgression.js`):**
- region: `CARIBBEAN`
- genre: `REGGAETON` (dembow rhythm, 90–98 BPM)
- piece: `PICÓ STACK`
- cityId: `puerto-rico`
- color: `#00ddff` (cyan — drives card glow + unlock halo)

**Cultural framing.** PR is reggaeton/perreo/dembow territory (San Juan, Loíza,
Santurce, Bayamón). The "picó" rig name has Colombian origins, but it has
crossed into wider Caribbean usage; we keep the term and paint the rig with PR
iconography (Boricua flag stripes, palm trees, El Coquí frog, Vieques sand colors,
Old San Juan blues and corals). This is a soundsystem story, not a tourist ad —
keep it street-level, hot, scrappy.

---

## 1. Production order (Level 2)

1. Generate the standalone **picó stack** sprite first — it appears in 3 places (hangar Stage 2, unlock cinematic, share artifact future v1.1).
2. Generate the **studio backdrop** (San Juan apartment).
3. Generate the **block-party performance scene** (the level-open-for-play hero).
4. Generate the **picó unlock cinematic** (Vieques boardwalk or El Morro at sunset).
5. (Optional) Generate the **hangar Stage 2 silhouette** if not auto-derivable from the standalone picó.

No new character source sprites required — the 12 existing character variants carry across all 6 regions. Same 4 chord-progression slots (BOOM BAP / G-FUNK / TRAP / SOUL LOOP) get swapped for Caribbean equivalents in audio, but visuals don't change.

---

## 2. Asset L2-1 — Studio Backdrop (San Juan apartment)

Path: `public/assets/sprites/venues/studio-pr.png`
Dimensions: 1920×540
Format: PNG opaque (16:5 ultra-wide)
Use: top half of the StudioScene when playing Level 2.
**The friend in this scene must sit slightly RIGHT of the upper-right third so the StudioScene can mount a CSS speech bubble above them. Do not draw any speech bubble in the image itself.**

```txt
Pixel art bedroom-studio interior in 3/4 isometric perspective, ultra-wide 16:5 aspect ratio, 1920x540. A small Old San Juan apartment studio at golden hour, seen from the producer's seated point of view, with the lower foreground left open for the sequencer UI overlay. Left third: tall narrow colonial-style window with painted wooden shutters open, view of a Cobalt-blue cobblestone street, pastel coral, mint, and butter-yellow building facades, a black wrought-iron balcony with a Boricua flag draped over the railing, tropical palm fronds reaching across the frame. Right third: friend character sitting on a low rattan stool or hammock chair holding a Medalla can, headphones around neck, bare feet, casually nodding to the beat — friend is positioned at upper-right so a speech bubble can float above them at runtime. Center area has negative space and desk edge implying the producer is the camera. Warm desk lamp glow #ffaa00 + thin strip of cyan #00ddff under-shelf LED creating a focused pool of light over the gear. Walls cluttered with reggaeton/dembow vinyl record sleeves (no real artist names), an MPC pad sampler, a stack of dembow rhythm flashcards, a small altar with a coquí frog figurine, a poster reading PICÓ in neon pixel lettering, faded Vieques beach postcard, plantain-shaped wall hook, drying laundry on a line outside the window. Small CRT TV on a milk crate, screen off. Vintage Caribbean column-style picó speaker peeking in the lower-right corner as foreshadowing. Lived-in, hot, scrappy, hopeful late-afternoon mood. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, visible individual pixels, dark navy #0a0a1e base, neon cyan #00ddff primary accent (replaces magenta of NYC), neon magenta #ff3399 secondary, neon yellow #ffaa00 lamp glow, hot pink #ff00c8 sunset peeks, subtle CRT scanlines.
```

Repair prompts:

```txt
Keep the same composition but pull the friend further right and clear a smaller negative-space halo above their head — we will overlay a speech bubble at runtime, the area above the friend's head must be empty.
```

```txt
Make the Caribbean identity unambiguous: visible Boricua flag, palm fronds, colonial pastel facades, cobblestone street. Do not turn it into a generic tropical scene.
```

```txt
Remove any visible reggaeton artist faces or real album art. Use only original pixel-art lettering and silhouettes.
```

---

## 3. Asset L2-2 — Block-Party Performance Scene (level open for play)

Path: `public/assets/sprites/venues/gig-pr-block-party.png`
Dimensions: 1920×1080
Format: PNG opaque (16:9)
Use: PerformanceScene background for Level 2. Functional twin to NYC's `gig-bk-court.png` — neighborhood-scale, picó-centric, a level the player just earned the right to play.

```txt
Pixel art outdoor Puerto Rican street block party at night, 16:9 wide aspect ratio, 1920x1080, 3/4 elevated perspective looking down a narrow Old San Juan-style cobblestone street that has been blocked off for the party. Center foreground: a tall stacked picó soundsystem column rig — the largest and most important object in the scene — three or four stacked speaker cabinets, hand-painted with a Boricua flag motif (red, white, blue stripes with the central star), El Coquí frog mascot painted on the side cabinet, palm tree silhouette across the front grille, neon cyan #00ddff and magenta #ff3399 strip lighting wrapping the rig, a small chrome amp head and sound man's crate at the base. Around the picó are 8 to 12 silhouetted neighborhood figures with neon cyan rim highlights: some perreo dancing in pairs, one with a boom-stance arms wide, one woman on a friend's shoulders, one kid on a bmx bike, two abuelitos sitting on plastic chairs at the side. Pastel coral, mint, and butter-yellow colonial building facades line both sides of the street, wrought-iron balconies above with neighbors leaning out, string lights zig-zagging overhead between balconies, a few Boricua flags hanging from poles. One old streetlight + the picó's own glow light the scene; the cobblestones reflect the neon. Background: a hint of Old San Juan's blue cobblestones receding toward El Morro fortress silhouette in the deep distance, tropical palm trees framing the upper corners. Pixel graffiti on a side wall reading PERREO and 787. Dark navy #0a0a1e night palette, cyan #00ddff dominant neon (level 2 color), magenta #ff3399 + yellow #ffaa00 accents, hot pink #ff00c8 distant sunset glow on the horizon. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, visible chunky pixels, CRT scanlines. Grassroots block party energy, not a stadium concert — sweaty, communal, late but still going.
```

Repair prompts:

```txt
Make the picó stack much taller and more heroic — clearly the focal point of the block party. The stacked cabinet column should rise to roughly half the canvas height, towering over the dancers.
```

```txt
Replace any stage/risers/festival elements. This is a closed-off neighborhood street, not a venue — the rig sits directly on the cobblestones.
```

```txt
Make sure the Boricua flag motif on the picó cabinets is clearly visible and reads at thumbnail size. No real artist logos or trademarks anywhere.
```

---

## 4. Asset L2-3 — Picó Stack Soundsystem Sprite

Path: `public/assets/sprites/soundsystem/pico.png`
Dimensions: 256×256
Format: PNG transparent
Use: hangar Stage 2 (when L2 unlocked), level-select piece slot, share artifact (post-L2), DirectoryScene mock cards.

```txt
Pixel art standalone tall stacked Caribbean picó soundsystem column, 256x256 square, transparent background. Front-facing with slight 3/4 angle for depth. A vertical stack of three speaker cabinets: bottom subwoofer cabinet largest with twin 18-inch woofer cones visible behind a metal grille, middle mid-range cabinet with two horn-loaded mid drivers, top tweeter cabinet with an array of small bullet tweeters and a brass horn flare. Each cabinet hand-painted with Caribbean iconography: bottom cabinet wears a Boricua flag motif (red, white, blue stripes with central star, no real flag photo, original pixel rendering); middle cabinet has a stylized El Coquí frog mascot in cyan #00ddff outline with magenta #ff3399 fill; top cabinet shows a palm tree silhouette and the word PICÓ in pixel lettering down the side. Wrap the rig in cyan #00ddff and magenta #ff3399 neon strip lighting at every cabinet seam. Small chrome amp head at top, telescoping antenna optional, a single coiled XLR cable falling from the bottom. Detailed but readable at 64x64 thumbnail. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, no background, no drop shadow. Hero object, iconic and reusable. Reads "Caribbean / Puerto Rico" instantly without spelling it out.
```

Repair prompts:

```txt
Make the column proportions taller — it should fill more vertical space in the 256x256 square, with the bottom subwoofer cabinet noticeably wider than the top tweeter cabinet for a clear pyramid silhouette.
```

```txt
Strengthen the Boricua flag motif on the bottom cabinet so it reads at 64x64 thumbnail size. No photographic flags, only original pixel-painted stripes and star.
```

---

## 5. Asset L2-4 — Picó Unlock Cinematic (level-end reveal Stage A)

Path: `public/assets/sprites/soundsystem/pico-unlock-vieques.png`
Dimensions: 1920×1080
Format: PNG opaque (16:9)
Use: SoundsystemRevealScene Stage A when player completes L2. Functional twin to L1's `boombox-unlock-coney-island.png`.

```txt
Pixel art Vieques bioluminescent bay coastline at deep dusk transitioning to night, 16:9 wide aspect ratio, 1920x1080, cinematic 3/4 perspective. Wooden pier or boardwalk planks dominate the foreground and run diagonally toward the horizon for depth. Center-left foreground: tall stacked picó soundsystem column — Caribbean style, painted with Boricua flag motif and palm-tree silhouette as described in the picó sprite spec, large and prominent, with a glowing cyan #00ddff halo behind it to signal newly unlocked. Mid-background: the calm bay water glowing soft cyan and aquamarine from bioluminescent algae, faint ripples around a small wooden rowboat moored to the pier. Right side: a low-slung pier-side bar with a hand-painted neon sign reading EL COQUÍ in pixel-art neon lettering glowing magenta #ff3399 and cyan #00ddff with a slight buzzing flicker, palm leaves brushing the roof. Far background: silhouette of distant Caribbean hills against a deep magenta #ff3399, hot pink #ff00c8, and orange #ffaa00 sunset sky melting into starry indigo above, a single planet visible. Quiet beach barely visible below the pier with footprints in sand, one stilt-walking heron at the waterline, optional distant walking silhouette for scale. Dark navy #0a0a1e shadows, subtle CRT scanlines, eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing. Cinematic, melancholic, reverent — the picó is the protagonist, the bay is the stage.
```

Repair prompts:

```txt
Make the bioluminescent glow on the bay water unambiguous — the water itself emits a soft cyan light that throws faint highlights onto the underside of the pier and the bottom of the picó.
```

```txt
Make the picó larger in the foreground and remove any foreground people — the rig is the only character at this stage.
```

```txt
Keep the EL COQUÍ neon sign readable; if the generator garbles letters, leave the bar as a glowing silhouette and we'll composite the sign manually.
```

---

## 6. Asset L2-5 — Hangar Stage 2 (optional, if not derivable)

Path: composited into `public/assets/sprites/ui/soundsystem-hangar.png` per the v2 doc, OR a standalone overlay sprite at `public/assets/sprites/soundsystem/pico-silhouette.png`.
Dimensions: 256×256 silhouette if standalone.
Format: PNG transparent.
Use: hangar Stage 2 slot, locked state.

```txt
Pure black solid silhouette of the picó stack column described above, 256x256 transparent PNG, exactly the same outline and proportions as the unlocked picó.png sprite, but rendered as a single flat #0a0a1e silhouette with no internal detail and no neon strips. Used as the locked-state placeholder in the hangar lineup until the player unlocks Level 2.
```

---

## 7. Audio brief — what the L2 audio bundle needs (informational)

Audio is OUTSIDE this art pack, but for alignment so Nico can produce parallel:

- Bundle ID: `level-01-pr` → suggested `level-02-pr`
- Drum slots (4 variants each): `kick_01..04.mp3` (deep dembow kick), `snare_01..04.mp3` (clap-snare hybrid, the classic dembow boom-ch-boom-chick), `hihat_01..04.mp3` (open Latin hat), `perc_01..04.mp3` (timbale rim, cowbell, congas) — note that L2 swaps the L1 4-slot template by replacing **bass with perc** because reggaeton is percussion-forward.
- Bass slots (4): `bass_01..04.mp3` (sub-808 reggaeton bass at C2 reference pitch).
- Chord progression loops (4): `chord_progression_01.mp3` DEMBOW BASE; `_02.mp3` PERREO MINOR; `_03.mp3` SAN JUAN PIANO; `_04.mp3` REGGAETON ROMÁNTICO.
- BPM target: 92.

The codebase auto-discovers `level-XX-pr` once `LEVEL_AUDIO_ID` in `StudioScene.js` is extended. Wire that in v1.1.

---

## 8. Path discipline (CRITICAL)

All paths above use `public/assets/...` (NOT `assets/...`). This is the on-disk
location. The URL in code is `/assets/...` (Vite serves files in `public/` at
root URL paths). Any drift breaks Image.onerror fallbacks. Reference:
`beat-world-2026/public/assets/README.md`.

---

## 9. Production checklist (Level 2)

```md
- [ ] studio-pr.png — 1920x540, opaque, friend at upper-right with bubble headroom
- [ ] gig-pr-block-party.png — 1920x1080, opaque, picó stack hero
- [ ] pico.png — 256x256, transparent, hero object
- [ ] pico-unlock-vieques.png — 1920x1080, opaque, cinematic
- [ ] pico-silhouette.png — 256x256, transparent, locked state (optional)
- [ ] No real flag photos — all Boricua iconography is original pixel art
- [ ] No real artist faces, album art, or trademarks
- [ ] Cyan #00ddff is the dominant neon (matches L2 card color)
- [ ] Pixel edges crisp at 4x zoom
- [ ] Friend in studio backdrop has empty headroom for runtime speech bubble
```

---

## 10. Cut order if time runs out

Critical (ship v1.1 with these only):
1. `pico.png` — required for hangar + unlock + share
2. `studio-pr.png` — required for StudioScene
3. `gig-pr-block-party.png` — required for PerformanceScene

High impact:
4. `pico-unlock-vieques.png` — drives the L2 reward beat

Optional:
5. `pico-silhouette.png` — fallback can be a CSS dark recolor of `pico.png`

---

## 11. Strategic note (post-May-1 wiring)

Code wiring for Level 2 is intentionally OUT OF SCOPE for the May 1 Vibe Jam ship.
Drop assets in `public/assets/sprites/{venues,soundsystem}/` and a `level-02-pr/`
audio bundle in `public/assets/audio/`. The runtime work to unlock the level
(updating `LEVEL_PROGRESSION` to `unlocked: true` + adding `puerto-rico` to
`CITIES` in `GameData.js` + adding `LEVEL_AUDIO_ID['puerto-rico']`) happens in the
v1.1 release the week after Vibe Jam. The May 1 build still ships NYC-only — locked
silhouette for L2 is the May 1 deliverable.
