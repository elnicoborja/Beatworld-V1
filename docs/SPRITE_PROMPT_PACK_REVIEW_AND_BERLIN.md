# Beat World — Sprite Prompt Pack: COMPLEX/Young Miko Review + Berlin L6

**Status:** add-on companion to `SPRITE_PROMPT_PACK_v2.md` (Level 1 NYC) and `SPRITE_PROMPT_PACK_L2_PR.md` (Level 2 PR).

This doc covers two distinct concerns:

1. **Re-skin the NYC review experience** — swap the XXL/generic-critic combo for a **COMPLEX magazine + Young Miko critic** combo. Same review mechanic, same 2-star L1 cap, fresher culturally-rooted skin. Code already updated to expect `critic-complex.png` and `COMPLEX` copy; the magazine-cover filename stays generic at `review-magazine-cover.png`.
2. **Brief the missing Berlin L6 soundsystem unlock + standalone rig** — completes the 6-region rig roster post-Vibe-Jam.

Re-uses the same Gemini Gem instructions, global negative prompt, color palette, and slicing rules from `SPRITE_PROMPT_PACK_v2.md` §1–§2.

**Cultural framing for Young Miko (do not skip).** Young Miko is the Puerto Rican rapper anchoring the new Latin reggaeton wave. Reference photos: white bucket hat, platinum/silver braided or loose hair, pink/magenta eyeshadow, sleeveless pink graphic jersey (Powerpuff-girls-coded), heavy right-arm tattoo sleeve, neck ink, septum + eyebrow piercings, freckles. The pixel-art critic should read as *her at thumbnail size* — not a generic blonde rapper. Her vibe in this game is confident-smug-roasting-you, not stage-performance-joy. Smirk, not grin.

---

## 1. Asset L1-A — Young Miko Critic Portrait

**Path:** `public/assets/sprites/characters/critic-complex.png`
**Dimensions:** 256×256
**Format:** PNG transparent
**Use:** ReviewScene critic avatar. Replaces the deprecated `critic-xxl.png` — that file can be deleted once `critic-complex.png` ships.

```txt
Pixel art head-and-shoulders character portrait, 256x256 square, transparent background. Young Puerto Rican female music critic in 3/4 angle, looking slightly toward viewer with smug confident smirk, slight raised eyebrow, intimidating but funny — about to roast the player's beat. Long platinum-silver hair worn in tight side braids or loose long hair falling forward over one shoulder. Light skin with subtle freckles across the bridge of the nose. White bucket hat with no real brand mark — keep it iconic and clean. Pink #ff3399 and hot pink #ff00c8 eyeshadow swept across both eyelids, distinctive and readable. Septum nose ring rendered as small magenta dot. Single eyebrow piercing on the right brow rendered as a tiny cyan #00ddff stud. Pink lips. Hot pink #ff3399 sleeveless graphic tank top with original pixel-art logo on chest reading PINKS in bold pixel lettering — original art, no real brand or trademark. Visible right arm full sleeve tattoos rendered as readable pixel-art motifs (small flowers, abstract line work, cherub silhouette) in dark navy #0a0a1e ink against light skin. Cross necklace in chrome rendered as 3 pixels. Holding a small chrome microphone raised slightly at the bottom of the frame as if broadcasting a roast. Subtle magenta #ff3399 radial glow halo behind head, contained inside the transparent PNG. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, visible chunky pixels, no smoothing. Critic-as-heel mood: smug, knowing, about to deliver a 2-star verdict.
```

Repair prompts:

```txt
Make her clearly recognizable as Young Miko at thumbnail size: white bucket hat, platinum-silver hair, pink eyeshadow, sleeveless pink graphic tank, right-arm tattoo sleeve. No real brand logos.
```

```txt
Make the smirk smug, not friendly — she's about to roast the player's first beat. Slight raised eyebrow, mouth corner tilted up, eyes half-lidded with confidence.
```

```txt
Strengthen the right-arm tattoo sleeve so it reads at small sizes — keep the motifs simple (flowers + abstract line work) rather than dense, so they survive at 64x64 thumbnail.
```

```txt
Replace any Powerpuff Girls or copyrighted graphic on the tank with original pixel lettering reading PINKS or DEMBOW.
```

---

## 2. Asset L1-B — COMPLEX Magazine Cover (Roast Edition)

**Path:** `public/assets/sprites/ui/review-magazine-cover.png` (overwrite the existing XXL-template file — same path)
**Dimensions:** 720×900
**Format:** PNG opaque, 4:5 portrait
**Use:** ReviewScene centerpiece. **Important:** this is a TEMPLATE. The 5-star rating row at top must remain as 5 EMPTY grey star outlines — code overlays filled stars dynamically per rating.

```txt
Pixel art original-style hip-hop / streetwear magazine cover template, 4:5 portrait aspect ratio, 720x900. Fake magazine called COMPLEX — stylized original pixel lettering, blocky bold pixel-art masthead, NOT the real Complex magazine logo. Top masthead: COMPLEX in large bold Press Start 2P style pixel font with neon magenta #ff3399 glow, tracked tight, in dark navy bar across the top of the cover. Center-large: a Young Miko-style pixel cover star portrait — long platinum-silver hair, white bucket hat, pink #ff3399 sleeveless graphic tank with pixel-art chest lettering reading PINKS, right-arm tattoo sleeve visible, smug knowing smirk, looking slightly off-camera. Subject occupies the lower 60 percent of the cover, head and torso visible, magazine-cover framing. Huge headline crashing across the top of the subject in bright yellow #ffaa00: WHACK! in readable pixel capital letters, placed over a jagged comic-book starburst in bright red #ff3344, intentionally collision with the cover star's silhouette like a real Complex cover. Rating row near top-right or upper center: exactly 5 EMPTY grey star outlines, NO filled stars, NO yellow filled stars — code overlays the rating later. Side cover-line text strips suggesting hip-hop feature articles: top-left small block reads NEW SCHOOL VS OLD HEADS, top-right small block reads PERREO TAKEOVER, bottom-left small block reads RIG RANKINGS — keep small text secondary, graphic-feel if fully unreadable is fine. Bottom subhead text strip across the lower 12 percent of the cover in dark navy bar: FRESH FACE, STALE BEAT in white pixel lettering. Slight magazine paper texture, faint creases at corners, magazine-spine drop on the left edge in dark navy. Dark navy #0a0a1e shadows under subject, neon magenta/cyan/yellow accents, hot pink #ff00c8 highlights. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing. Roast energy, not cruel — the cover is mocking the player but with a wink.
```

Repair prompts:

```txt
Keep the 5 star outlines completely empty — do not fill any of them with yellow or color, code will overlay filled stars at runtime.
```

```txt
Make the COMPLEX masthead unmistakable as a magazine title: bold blocky pixel sans-serif, magenta glow, full width across the top.
```

```txt
Replace any real-Complex-magazine layout cues (real cover lines, real rappers) with original fictional cover lines: NEW SCHOOL VS OLD HEADS, PERREO TAKEOVER, RIG RANKINGS.
```

Manual compositing note:

```md
If text is garbled, keep the generated cover art but manually add COMPLEX masthead, WHACK!, the empty 5 stars, side cover-lines, and FRESH FACE, STALE BEAT subhead in a pixel editor afterward. Text readability matters more than one-shot purity.
```

---

## 3. Asset L6-1 — Berlin Warehouse Stack standalone

**Path:** `public/assets/sprites/soundsystem/warehouse.png`
**Dimensions:** 256×256
**Format:** PNG transparent
**Use:** hangar Stage 6 (when L6 unlocked), level-select piece slot, share artifact (post-L6 v1.5+), DirectoryScene Berlin Ghost mock card.

```txt
Pixel art standalone Berlin warehouse-techno monolithic speaker stack, 256x256 square, transparent background. Front-facing with slight 3/4 angle for depth. A vertical monolith of four matte-black industrial speaker cabinets stacked dead-center: bottom subwoofer cabinet largest with single massive 21-inch black woofer cone behind a thick steel grille, second cabinet a wide horn-loaded mid cabinet with two horizontal horn flares, third cabinet a tall mid-high cabinet with vertical line-array of compression drivers, top cabinet a small rotated tweeter horn pointing slightly outward. Brutalist clean lines, no decoration, no painted graphics, no flag motifs — opposite aesthetic of the Caribbean picó. Industrial cyan #00ddff strip lighting along every cabinet seam emitting cool blue light. A single thick chrome amplifier rack mounted at the very top of the stack with three rack-unit faceplates visible, no labels. Single coiled black power cable falling from the bottom-left. Tiny industrial nameplate on the bottom cabinet reading SCHWARZ in pixel font (original word, German for black, no trademark). Detailed but readable at 64x64 thumbnail. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, no background, no drop shadow. Hero object — austere, monolithic, intimidating. Reads "Berlin / industrial techno" instantly.
```

Repair prompts:

```txt
Make the cabinets cleaner and more brutalist — no graffiti, no flags, no painted logos, just black grille fabric and steel edges. Cyan strip lighting only at the cabinet seams.
```

```txt
Make the silhouette visibly different from the Caribbean picó stack: wider squat base, narrower tall middle, single rotated horn at top — a monolith, not a column.
```

---

## 4. Asset L6-2 — Berlin Warehouse Soundsystem Unlock Cinematic

**Path:** `public/assets/sprites/soundsystem/warehouse-unlock-berlin.png`
**Dimensions:** 1920×1080
**Format:** PNG opaque (16:9)
**Use:** SoundsystemRevealScene Stage A when player completes L6. Functional twin to L1 Coney Island and L2 Vieques.

```txt
Pixel art Berlin Berghain-coded warehouse interior at peak hour transitioning to deep night, 16:9 wide aspect ratio, 1920x1080, cinematic 3/4 perspective. Massive industrial concrete warehouse hall, exposed steel beams crisscrossing the high ceiling, a single skylight far above showing a cold blue sky barely visible through condensation. The dance floor stretches diagonally toward the horizon with a polished concrete surface reflecting cool blue light. Center-left foreground: the Berlin warehouse stack monolith — austere matte-black industrial speaker stack as described in the warehouse.png sprite spec, scaled large, with a glowing cyan #00ddff halo behind it to signal newly unlocked. Mid-background: scattered fog at floor level rolling slowly, hard cyan and magenta laser beams cutting horizontally through the fog from off-screen sources, single high-mounted strobe firing a frozen pulse of pure white light from the upper-right corner. Right side: a tall industrial steel staircase climbing into the upper darkness, a small heavy steel door at the bottom of the frame slightly ajar with cold blue light bleeding out, a graffiti-covered bouncer silhouette at the door reading clipboard. Background detail: brutalist concrete columns receding in perspective, exposed conduit and chain-hoists, a single industrial fan rotating slowly mid-air, faint chalk hash marks on the floor counting hours. No crowd visible — the system itself is the protagonist. Far upper area: a dark Berlin pre-dawn sky barely visible through skylight, a single distant TV-tower silhouette implying horizon. Dark navy #0a0a1e shadows dominating the palette, cyan #00ddff laser primary, magenta #ff3399 secondary laser, hot pink #ff00c8 reserved for the rig's halo, neon yellow #ffaa00 only on the bouncer's clipboard light. eboy.com 32-bit Sega Genesis pixel art fidelity, sharp pixel edges, no anti-aliasing, subtle CRT scanlines. Cinematic, austere, reverent — Berghain-coded mood without naming it.
```

Repair prompts:

```txt
Strip warmth — this is a cold scene. Cyan/magenta lasers only, no orange, no warm windows, no candle light. The only warm tone is the bouncer's clipboard.
```

```txt
Remove all crowd figures — the warehouse is empty so the rig is the only character. The bouncer at the door is the single human silhouette and stays small and back-lit.
```

```txt
Make the rig proportionally larger in the foreground so its monolithic silhouette dominates the lower-left third of the frame. The stack is the protagonist.
```

```txt
Strengthen the brutalist architecture: massive concrete columns receding in perspective, exposed steel beams, raw poured-concrete walls. No decorative elements, no posters, no warmth.
```

---

## 5. Code-side updates already shipped (informational)

The following code changes were made as part of this re-skin and are already in `main`:

| File | Change | Status |
|---|---|---|
| `src/GameData.js` | `mediaOutlet: 'XXL Mag'` → `'COMPLEX'` | ✓ |
| `src/review/ReviewScene.js` | Doc comment XXL → COMPLEX | ✓ |
| `src/review/ReviewScene.js` | `critic-xxl.png` path → `critic-complex.png` | ✓ |
| `src/review/ReviewScene.js` | Outlet text `'DJ XXL · XXL MAG'` → `'YOUNG MIKO · COMPLEX'` | ✓ |
| `src/review/ReviewScene.js` | Magazine alt-text → `'MAGAZINE COVER — COMPLEX'` | ✓ |

Until `critic-complex.png` exists in the repo, ReviewScene falls back to a labelled placeholder rect. The current `critic-xxl.png` is now orphaned — keep it as a backup until the new sprite is verified, then delete it in a cleanup commit.

---

## 6. Production order (rest-of-week)

1. **CRITICAL — generate Young Miko critic-complex.png first.** Without it the critic well is a placeholder rect at thumbnail size. Drop in `public/assets/sprites/characters/`.
2. **CRITICAL — re-generate review-magazine-cover.png with COMPLEX masthead.** Same path, overwrite the file.
3. (Post-Vibe-Jam, v1.1+) Berlin warehouse.png + warehouse-unlock-berlin.png. Not blocking May 1 ship.

---

## 7. Path discipline (CRITICAL — same as v2 doc)

- All paths use `public/assets/...` on disk.
- Filenames are exactly as listed. **No `.png.png` double-extensions.** If you see `critic-complex.png.png` after export, rename before committing.
- Critic and magazine sprites are **transparent PNG** (critic) and **opaque PNG** (magazine).

---

## 8. Production checklist

```md
- [ ] critic-complex.png — 256x256, transparent, Young Miko-coded, smug smirk
- [ ] review-magazine-cover.png — 720x900, opaque, COMPLEX masthead, 5 EMPTY stars
- [ ] No real brand logos (no real Complex masthead, no Powerpuff Girls)
- [ ] No real-person likeness verbatim — Young-Miko-coded but pixel-art interpreted, original
- [ ] Pixel edges crisp at 4x zoom
- [ ] Filenames exactly as listed, no double-extensions
- [ ] (post-Vibe-Jam) warehouse.png — 256x256, transparent, monolith
- [ ] (post-Vibe-Jam) warehouse-unlock-berlin.png — 1920x1080, opaque, cold cinematic
```

---

## 9. Cut order if time runs out

Critical for May 1 ship:
1. `critic-complex.png` — visible every L1 review.
2. `review-magazine-cover.png` (re-skin) — visible every L1 review.

Non-blocking for May 1:
3. `warehouse.png` (L6 standalone) — only matters when L6 unlocks (post-launch).
4. `warehouse-unlock-berlin.png` — only matters when L6 unlocks (post-launch).

If you only have time for ONE of the two critical assets: prioritize `critic-complex.png`. The magazine cover is a textured background with text overlays; the critic is the focal point at 200×200 in the live scene.
