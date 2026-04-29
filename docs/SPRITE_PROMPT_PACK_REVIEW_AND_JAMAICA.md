# Beat World — Sprite Prompt Pack: XXXS/Charlamagne + CORNPLEX/Young Miko + Jamaica L6

**Status:** companion to `SPRITE_PROMPT_PACK_v2.md` (L1 NYC) and `SPRITE_PROMPT_PACK_L2_PR.md` (L2 PR). Supersedes the earlier `SPRITE_PROMPT_PACK_REVIEW_AND_BERLIN.md` (Berlin was swapped for Jamaica as L6).

This pack covers the per-level review experience for the demo (L1 + L2) and the Jamaica L6 dub-shack-stack assets that will land in v1.1 post-Vibe-Jam.

Re-uses the same Gemini Gem instructions, global negative prompt, color palette, and slicing rules from `SPRITE_PROMPT_PACK_v2.md` §1–§2.

**Brand-likeness note.** The magazines are deliberate parodies — XXXS riffs on XXL, CORNPLEX riffs on Complex. Original pixel art only. The critics are coded to public personas (Charlamagne, Young Miko) but rendered as pixel-art interpretations, not photo-derived likeness. Same approach as DJ Primo / KURUPT MC / DADDY YANKEE in `GameData.js`.

**Per-level review mapping (already wired in `ReviewScene.js`):**

| Level | City | Magazine | Critic |
|---|---|---|---|
| L1 | NYC | XXXS | Charlamagne-coded |
| L2 | PR  | CORNPLEX | Young Miko-coded |
| L3+ | future | TBD | TBD |

---

## 1. Asset L1-A — Charlamagne Critic Portrait

**Path:** `public/assets/sprites/characters/critic-xxxs.png`
**Dimensions:** 256×256
**Format:** PNG transparent
**Use:** L1 NYC ReviewScene critic avatar.

```txt
Pixel art head-and-shoulders character portrait, 256x256 square, transparent background. Hip-hop industry critic-host in 3/4 angle, looking slightly toward viewer with smug confident smirk, slight raised eyebrow, intimidating-but-funny — about to deliver a 2-star verdict. Black male, mid-30s, brown skin, full dark beard with a hint of grey strands, smooth fade haircut close to the scalp, no hat — bald-fade-coded, NOT bucket-hat-coded. Wide expressive eyes with a knowing look, slight smirk pulling the right side of the mouth up, raised right eyebrow. Wearing a black or charcoal grey crew-neck pullover or simple zip hoodie with NO branding, NO graphic, NO logos. Single thin gold chain visible at the collar. Holding a chrome microphone raised slightly at the bottom of the frame as if mid-broadcast — radio-host posture, not stage-rapper posture. Subtle magenta #ff3399 radial glow halo behind head, contained inside the transparent PNG. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, visible chunky pixels. Mood: smug radio-host who has heard ten thousand rapper demos this year and is about to roast yours on air.
```

Repair prompts:

```txt
Make him clearly identifiable as a radio-roast-host: bald-fade haircut, full beard with grey accents, microphone in hand, smug raised-eyebrow smirk. NOT a stage rapper, NOT a bucket-hat producer. The microphone is critical.
```

```txt
Lose any branded apparel — no Power 105 logos, no Breakfast Club marks, no real radio show graphics. Plain black or charcoal pullover, single thin gold chain only.
```

```txt
Strengthen the smug-roast smirk on the right side of the mouth and the raised right eyebrow. He's not laughing, he's about to dismiss you.
```

---

## 2. Asset L1-B — XXXS Magazine Cover

**Path:** `public/assets/sprites/ui/review-magazine-cover-xxxs.png`
**Dimensions:** 720×900
**Format:** PNG opaque, 4:5 portrait
**Use:** L1 NYC ReviewScene cover. **CRITICAL:** 5 stars must remain EMPTY — code overlays the rating dynamically. NO baked-in filled stars.

```txt
Pixel art original-style hip-hop trade magazine cover template, 4:5 portrait aspect ratio, 720x900. Fake magazine called XXXS — stylized original pixel lettering, blocky bold pixel-art sans-serif masthead, NOT the real XXL Mag logo. Top masthead: XXXS in large bold Press Start 2P style pixel font with neon magenta #ff3399 glow, tracked tight, in a dark navy bar across the top of the cover. Center-large: a Charlamagne-coded pixel cover star portrait — Black male mid-30s, bald-fade haircut, full dark beard with grey accents, smug knowing smirk, single thin gold chain, plain charcoal pullover, microphone raised at chest level. Subject occupies the lower 60 percent of the cover, head and torso visible, magazine-cover framing. Huge headline crashing across the top of the subject in bright yellow #ffaa00: WHACK! in readable pixel capital letters, placed over a jagged comic-book starburst in bright red #ff3344, intentional collision with the cover star's silhouette. Rating row near top-right or upper center: exactly 5 EMPTY grey star outlines, NO filled stars, NO yellow stars, ALL FIVE OUTLINES ONLY — code overlays the rating later. Side cover-line text strips suggesting hip-hop critique: top-left small block reads NEW SCHOOL VS OLD HEADS, top-right small block reads BRONX BURNING, bottom-left small block reads RIG RANKINGS — keep small text secondary, graphic-feel if fully unreadable. Bottom subhead text strip across the lower 12 percent of the cover in dark navy bar: FRESH FACE, STALE BEAT in white pixel lettering. Slight magazine paper texture, faint creases at corners, magazine-spine drop on the left edge in dark navy. Dark navy #0a0a1e shadows under subject, neon magenta/cyan/yellow accents, hot pink #ff00c8 highlights. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing. Roast energy.
```

Repair prompts:

```txt
The 5 stars in the rating row MUST be empty grey outlines only. No filled yellow stars. No partial fill. Pure outlines. The runtime overlays filled stars on top.
```

```txt
The cover star must read as a radio-roast-host (bald-fade, beard, microphone), NOT a rapper. NOT a stage performer. NOT bucket-hat-coded.
```

```txt
Replace any real-XXL-magazine layout cues with original fictional cover lines: NEW SCHOOL VS OLD HEADS, BRONX BURNING, RIG RANKINGS.
```

---

## 3. Asset L2-A — Young Miko Critic Portrait (CORNPLEX critic)

**Path:** `public/assets/sprites/characters/critic-cornplex.png`
**Dimensions:** 256×256
**Format:** PNG transparent
**Use:** L2 PR ReviewScene critic avatar.

```txt
Pixel art head-and-shoulders character portrait, 256x256 square, transparent background. Young Puerto Rican female music critic in 3/4 angle, looking slightly toward viewer with smug confident smirk, slight raised eyebrow, intimidating but funny — about to deliver a 2-or-3-star verdict on a reggaeton beat. Long platinum-silver hair worn in tight side braids or loose long hair falling over one shoulder. Light skin with subtle freckles across the bridge of the nose. White bucket hat with no real brand mark — keep it iconic and clean. Pink #ff3399 and hot pink #ff00c8 eyeshadow swept across both eyelids, distinctive and readable. Septum nose ring rendered as small magenta dot. Single eyebrow piercing on the right brow rendered as a tiny cyan #00ddff stud. Pink lips. Hot pink #ff3399 sleeveless graphic tank top with original pixel-art logo on chest reading PINKS in bold pixel lettering — original art, no real brand or trademark. Visible right arm full sleeve tattoos rendered as readable pixel-art motifs (small flowers, abstract line work, cherub silhouette) in dark navy #0a0a1e ink against light skin. Cross necklace in chrome rendered as 3 pixels. Holding a small chrome microphone raised slightly at the bottom of the frame. Subtle cyan #00ddff radial glow halo behind head, contained inside the transparent PNG. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, visible chunky pixels. Critic-as-heel mood: smug, knowing, about to roast your reggaeton attempt in Spanish.
```

Repair prompts: see same notes as Charlamagne portrait — read-at-thumbnail, smug not friendly, no real-brand trademarks.

---

## 4. Asset L2-B — CORNPLEX Magazine Cover

**Path:** `public/assets/sprites/ui/review-magazine-cover-cornplex.png`
**Dimensions:** 720×900
**Format:** PNG opaque, 4:5 portrait
**Use:** L2 PR ReviewScene cover. **CRITICAL: 5 stars must be EMPTY.**

(Re-use the prompt from `SPRITE_PROMPT_PACK_REVIEW_AND_BERLIN.md` §2 with these adjustments:)

- Masthead reads **CORNPLEX** (not COMPLEX).
- Cover star is the Young Miko-coded portrait described in §3 above.
- Headline: **TIENE LO SUYO** in big yellow capital letters.
- Side cover-lines: NEW SCHOOL VS OLD HEADS / PERREO TAKEOVER / RIG RANKINGS.
- Bottom subhead bar: **NO ESTÁ MAL** in white pixel lettering.
- **All 5 stars empty.** The current generation Nico shipped had 1 star pre-filled — that needs regen.

---

## 5. Asset L6-1 — Jamaica Dub Shack Stack standalone

**Path:** `public/assets/sprites/soundsystem/dub-shack.png`
**Dimensions:** 256×256
**Format:** PNG transparent
**Use:** Hangar Stage 6 (when L6 unlocks), level-select piece slot, share artifact (post-L6 v1.5+), DirectoryScene Jamaica mock card.

**Cultural framing.** This is the soundsystem origin point. King Tubby, Lee "Scratch" Perry, Jah Shaka — 1970s Kingston dub. The rig is hand-built from mismatched cabinets painted in red/gold/green Rasta colors, with a vacuum-tube amplifier visible at the top. Reads "Trench Town" not "Jamaican tourism poster."

```txt
Pixel art standalone Jamaican dub shack soundsystem stack, 256x256 square, transparent background. Front-facing with slight 3/4 angle for depth. A vertical stack of three hand-built mismatched wooden speaker cabinets: bottom subwoofer cabinet largest with two 18-inch black woofer cones behind a hand-painted wooden grille, middle cabinet a wide horn-loaded mid-bass bin with two horizontal horn flares painted matte black, top cabinet a smaller cabinet with multiple small high-frequency horns clustered like a flower. Each cabinet hand-painted with original pixel-art Rastafari iconography: bottom cabinet wears red, gold, and green horizontal stripes with a small Lion of Judah silhouette in pixel-art black, middle cabinet has stylized DUB lettering in bold pixel font and a small palm-tree silhouette, top cabinet has a faded JAH RULE pixel inscription and a sun ray. A vintage chrome vacuum-tube amplifier head sits at the very top of the stack with two glowing orange #ffaa00 valve indicators visible through round windows. A coiled XLR cable falling from the bottom-right, slightly frayed. Faded chalk hash marks scrawled on the side of the bottom cabinet. Detailed but readable at 64x64 thumbnail. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, no background, no drop shadow. Hero object — hand-built, lived-in, sacred. Reads "Kingston / dub origin" instantly without spelling it out.
```

Repair prompts:

```txt
The cabinets are hand-built and mismatched, not factory-finished — visible wood grain, slightly off-aligned panels, faded paint. NOT a clean industrial monolith. Opposite aesthetic of the Berlin warehouse stack we cut.
```

```txt
Strengthen the Rastafari color stripes on the bottom cabinet so they read at 64x64 thumbnail size. Red on top, gold middle, green bottom. The Lion of Judah silhouette is small and central.
```

```txt
The vacuum-tube amplifier head is the visual focal point at the top — two glowing orange valves visible. This is what tells the player "this rig has soul."
```

---

## 6. Asset L6-2 — Jamaica Dub Shack Unlock Cinematic

**Path:** `public/assets/sprites/soundsystem/dub-shack-unlock-kingston.png`
**Dimensions:** 1920×1080
**Format:** PNG opaque (16:9)
**Use:** SoundsystemRevealScene Stage A when player completes L6.

```txt
Pixel art Trench Town Kingston yard at deep dusk transitioning to night, 16:9 wide aspect ratio, 1920x1080, cinematic 3/4 perspective. A small concrete-and-corrugated-metal yard between two low colorful Caribbean buildings, painted in faded turquoise, salmon, and butter yellow, with red, gold, and green Rasta flag bunting strung between rooflines. The yard's dirt and concrete floor stretches diagonally toward the horizon for depth. Center-left foreground: the Jamaican dub shack stack — hand-built three-cabinet stack as described in the dub-shack.png sprite spec, scaled large, with a glowing red-gold-green halo behind it: a soft red #ff3344 ring under a gold #ffaa00 ring under a green #00cc44 ring, layered to signal newly unlocked. Mid-background: a small unpainted wooden shack with a corrugated metal roof, propped door slightly ajar, single yellow light bulb glowing inside. A vintage analog mixing console silhouette visible on a low concrete shelf next to the stack. A coil of cable lying on the dirt floor in the foreground. Right side: a tall mango tree with hanging ripe fruit, broad leaves silhouetted against the sky, small pixel painted-up fruit truck in the deep background just outside the yard. Far background: distant Kingston hills silhouetted against a deep magenta #ff3399, hot pink #ff00c8, and orange #ffaa00 sunset sky melting into starry indigo above. A single distant moth-or-bird silhouette in the upper sky for scale. Quiet street sounds implied — no human figures in the foreground, just the rig as the protagonist. Dark navy #0a0a1e shadows under the cabinets, subtle CRT scanlines. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing. Cinematic, reverent, melancholic — the soundsystem is at home in its birthplace.
```

Repair prompts:

```txt
This is Trench Town intimate, NOT a tourism scene. No beach, no cruise ship, no luxury, no reggae festival crowd. A small yard between two buildings, the rig is the only protagonist, the shack and mango tree frame it.
```

```txt
Strengthen the red/gold/green halo under the rig — it should read as three concentric rings of color, not a single mixed glow. The Rastafari color order matters for cultural signal.
```

```txt
Keep the yard floor dirt-and-concrete, faded paint on the buildings, faded bunting overhead, slightly weathered everything. This is a working yard, not a postcard.
```

---

## 7. Code-side updates already shipped (informational)

| File | Change | Status |
|---|---|---|
| `src/GameData.js` | NYC `mediaOutlet: 'XXXS'`, `defaultBpm: 90`, `studioBackdrop`, `performanceBackdrop`, `chordProgressionNames` added | ✓ |
| `src/GameData.js` | PR `mediaOutlet: 'CORNPLEX'`, `defaultBpm: 92`, `studioBackdrop`, `performanceBackdrop`, `chordProgressionNames` added | ✓ |
| `src/data/LevelProgression.js` | L6 swapped from Berlin Underground → Jamaica · DUB & BASS · DUB SHACK STACK · cityId `kingston` · color `#00cc44` | ✓ |
| `src/review/ReviewScene.js` | Per-level critic + magazine + reviews + star cap (REVIEW_BY_CITY map) | ✓ |
| `src/studio/StudioScene.js` | Per-level studio backdrop + per-city chord progression names | ✓ |
| `src/performance/PerformanceScene.js` | Per-level performance backdrop | ✓ |
| `src/soundsystem/SoundsystemRevealScene.js` | Per-level Stage A reveal config (REVEAL_BY_CITY map) | ✓ |
| `src/studio/AudioEngine.js` | `perc` added to SAMPLE_PATHS so PR's guiro plays from MP3 instead of synth tom fallback | ✓ |
| `src/studio/AudioEngine.js` | Per-track mixer (volumes, reverb send, delay send, master, FX bus returns) | ✓ |
| `src/social/ShareArtifact.js` | Rewrite — no waveform, unlock cinematic background, character composited, minimal URL + beat-name footer | ✓ |
| `src/GameState.js` | BeatRecord schema + migration + `getBeat()`, `getLatestBeat()`, `setBeatRating()` | ✓ |
| `src/studio/StudioScene.js` | NAME YOUR BEAT modal intercepts FINISH BEAT | ✓ |
| `src/directory/DirectoryScene.js` | YOU card shows latest beat name + rating + city + rig | ✓ |

---

## 8. Production order (rest-of-week, refreshed)

### Critical for May 1 ship (in order)

1. **Audio loops + samples for L1 NYC + L2 PR.** You said samples are cut; just need 4 loops per level. Specs in chat.
2. **`critic-xxxs.png`** (Charlamagne-coded) — L1 critic.
3. **`review-magazine-cover-xxxs.png`** — L1 magazine, all 5 stars empty.
4. **`critic-cornplex.png`** (Young Miko-coded) — L2 critic.
5. **`review-magazine-cover-cornplex.png`** — L2 magazine, all 5 stars empty (regenerate the one you shipped, since it has 1 baked-in filled star).

### Post-Vibe-Jam v1.1+

6. `dub-shack.png` (Jamaica L6 standalone)
7. `dub-shack-unlock-kingston.png` (L6 cinematic)
8. L6 audio bundle (later)

---

## 9. Production checklist

```md
- [ ] critic-xxxs.png — 256x256, transparent, Charlamagne-coded, microphone, smug smirk, NO bucket hat
- [ ] critic-cornplex.png — 256x256, transparent, Young Miko-coded, white bucket hat, pink eyeshadow, sleeveless tank, sleeve tats
- [ ] review-magazine-cover-xxxs.png — 720x900, opaque, XXXS masthead, ALL 5 STARS EMPTY
- [ ] review-magazine-cover-cornplex.png — 720x900, opaque, CORNPLEX masthead, ALL 5 STARS EMPTY (regen — current has 1 filled)
- [ ] No real magazine logos, no real radio-show marks, no real Powerpuff graphics
- [ ] No real-person likeness verbatim — coded references rendered as original pixel art
- [ ] Pixel edges crisp at 4x zoom
- [ ] Filenames exactly as listed, no .png.png double-extensions
- [ ] (post-Vibe-Jam) dub-shack.png — 256x256, transparent, Rasta colors, hand-built look
- [ ] (post-Vibe-Jam) dub-shack-unlock-kingston.png — 1920x1080, opaque, Trench Town yard
```
