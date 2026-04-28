# Beat World — Level 1 (NYC) Audio Sample Specs

**Owner:** Nico (record/produce + deliver)
**Recipient:** Claude Code (integrate into AudioEngine.js)
**Hard deadline:** Tuesday 2026-04-28, 23:59 Bogotá
**If files are not in place by deadline:** AudioEngine falls back to current Tone.js synthesis per missing file (no crash, just less authentic sound). Don't ship late samples — better to launch with synth fallback and update post-launch.

---

## 1. Format & technical specs

| Parameter | Value | Why |
|---|---|---|
| File format | **MP3** | Universal browser support, decodes fast in Tone.Sampler, familiar to producers, small file size. |
| Bitrate | **192 kbps CBR** | Imperceptible quality loss for short percussive samples; ~8x smaller than WAV. |
| Sample rate | **44.1 kHz** | Web standard. Don't use 48k — adds size with zero perceptible benefit at this scale. |
| Bit depth | **16-bit** | Standard for MP3 source. |
| Channels | **Mono for drums; stereo for bass + chord loops** | Mono drums are half the size and lose nothing musically. Stereo bass and chords matter for width. |
| Normalize | **-1 dBFS peak** | Prevents clipping when layered. Don't compress them to -0.1 — leaves no headroom for the live sequencer mix. |
| Silence trim | **Tight head; let tails ring naturally** | Cut leading silence (so triggers feel snappy). Let release tails decay naturally — don't chop them. |

**Why not WAV:** ~10x file size for zero audible benefit at this scale. Bundle bloats past ~2MB.
**Why not OGG Vorbis:** Smaller than MP3 by ~20% but worse authoring tool support. Not worth the friction.

---

## 2. The 20 files (delivery list)

### 2a. Drum / Bass samples — 16 files

Each sample is a **single hit** at the natural pitch (no pitch information needed — Tone.Sampler will pitch-shift the bass to match grid steps).

| File name | Type | Variant character | Length target | File size target | Channels |
|---|---|---|---|---|---|
| `kick_01.mp3` | Kick | 808 Sub Kick — long sub tail, hip-hop staple | 200-400 ms | 25-50 KB | mono |
| `kick_02.mp3` | Kick | Boom Bap Kick — short dusty thump, vinyl-warm | 100-200 ms | 15-30 KB | mono |
| `kick_03.mp3` | Kick | Trap Kick — punchy mid + sub blend, modern | 200-400 ms | 25-50 KB | mono |
| `kick_04.mp3` | Kick | Soul Loop Kick — jazz drum kit kick, soft attack | 150-300 ms | 20-40 KB | mono |
| `snare_01.mp3` | Snare | Crisp Snare — modern hip-hop, bright snap | 100-200 ms | 20-35 KB | mono |
| `snare_02.mp3` | Snare | Boom Bap Snare — sampled jazz snare, rim noise | 150-300 ms | 25-45 KB | mono |
| `snare_03.mp3` | Snare | Trap Snare — tight, layered with clap | 100-150 ms | 15-30 KB | mono |
| `snare_04.mp3` | Snare | Rim Shot — sharp click, used for accents | 50-100 ms | 10-20 KB | mono |
| `hihat_01.mp3` | Hi-hat | Closed Hat — tight, crisp, modern | 50-120 ms | 10-20 KB | mono |
| `hihat_02.mp3` | Hi-hat | Open Hat — sustained, bleed-y | 200-400 ms | 25-45 KB | mono |
| `hihat_03.mp3` | Hi-hat | Trap Hat — pitched up, fast | 30-80 ms | 8-15 KB | mono |
| `hihat_04.mp3` | Hi-hat | Vintage Hat — drum machine 909-style | 80-150 ms | 12-25 KB | mono |
| `bass_01.mp3` | Bass | Sub Bass — sine-wave style, plays at C2 (65.41 Hz) | 400-800 ms | 50-100 KB | stereo |
| `bass_02.mp3` | Bass | 808 Bass — long with slight pitch slide, plays at C2 | 600-1200 ms | 80-150 KB | stereo |
| `bass_03.mp3` | Bass | P-Funk Bass — synth bass with mod, plays at C2 | 400-800 ms | 50-100 KB | stereo |
| `bass_04.mp3` | Bass | Upright Bass Pluck — acoustic-style, plays at C2 | 500-1000 ms | 70-120 KB | stereo |

**CRITICAL for bass samples:** Record at **C2 (65.41 Hz)** as the root note. The Tone.js Sampler pitch-shifts based on the difference between the recorded pitch and the playback pitch. If you record at a different pitch, the in-game playback will be wrong octaves.

### 2b. Chord progression loops — 4 files

Each is a **fully-arranged chord loop** that plays underneath the player's drums + bass. Player picks one before sequencing. The loop becomes the "song" the beat is built on.

| File name | Style | Chord progression | Tempo | Length | File size target | Channels |
|---|---|---|---|---|---|---|
| `chord_progression_01.mp3` | Boom Bap (Premier) | Cm7 → Fm7 → Bb7 → Ebmaj7 | 90 BPM | 4 bars (~10.6s) | 150-220 KB | stereo |
| `chord_progression_02.mp3` | G-Funk (Dre) | Am → Em → Dm → Am | 95 BPM | 4 bars (~10.1s) | 150-220 KB | stereo |
| `chord_progression_03.mp3` | Trap (modern) | Cm → Ab → Bb → Cm | 90 BPM | 4 bars (~10.6s) | 150-220 KB | stereo |
| `chord_progression_04.mp3` | Soul Loop (Kanye) | Em7 → A9 → Cmaj7 → Bm7 | 90 BPM | 4 bars (~10.6s) | 150-220 KB | stereo |

**Production guidelines for the chord loops:**

- **Each is a self-contained backing track.** Should sound good on its own with NO drums or bass.
- **Include just the harmony layer** (piano + pad / strings / sample chops, your choice). Do NOT include drums, bass, or melody — the player adds those.
- **Loop seamlessly** — no fade in/out, no silence at start/end. The loop should butt-edit cleanly to itself.
- **Pre-quantize** — make sure the first downbeat is at sample 0 with no leading silence.
- **Keep dynamic headroom** — peak at -3 dBFS to leave room for drums + bass on top.
- **Emotional vibes per progression:**
  - **Boom Bap:** dusty, jazzy, vinyl crackle is a plus, sampled-feel
  - **G-Funk:** smooth, summer, Moog-like synth strings, talk-box vibes optional
  - **Trap:** dark, minor, sparse, pad-heavy, almost cinematic
  - **Soul Loop:** warm, soulful chops, Rhodes/Wurly piano feel, slight pitch-down for that Kanye/Madlib aesthetic

### 2c. Total bundle add

| Category | Count | Size |
|---|---|---|
| Drum + bass samples | 16 | ~480 KB |
| Chord progression loops | 4 | ~600 KB |
| **Total** | **20** | **~1.08 MB** |

Current bundle: 828 KB. Projected after audio: ~1.9 MB. Acceptable for a music-production game.

---

## 3. File structure & naming convention

Drop all 20 files into:

```
beat-world-2026/
└── assets/
    └── audio/
        └── level-01-nyc/
            ├── kick_01.mp3
            ├── kick_02.mp3
            ├── kick_03.mp3
            ├── kick_04.mp3
            ├── snare_01.mp3
            ├── snare_02.mp3
            ├── snare_03.mp3
            ├── snare_04.mp3
            ├── hihat_01.mp3
            ├── hihat_02.mp3
            ├── hihat_03.mp3
            ├── hihat_04.mp3
            ├── bass_01.mp3
            ├── bass_02.mp3
            ├── bass_03.mp3
            ├── bass_04.mp3
            ├── chord_progression_01.mp3
            ├── chord_progression_02.mp3
            ├── chord_progression_03.mp3
            └── chord_progression_04.mp3
```

**Naming rules:**
- Lowercase with underscores. No spaces, no parentheses, no special characters.
- Two-digit zero-padded variant numbers (01-04). Easier to sort and reference in code.
- Folder named by level so we can add `level-02-caribbean/`, `level-03-brazil/`, etc. without collisions.

---

## 4. AudioEngine integration plan (for Claude Code)

Claude Code will refactor `src/studio/AudioEngine.js` to support sampler playback alongside the existing Tone.js synthesis. The integration plan:

1. **On Studio scene mount,** `AudioEngine.loadLevel('level-01-nyc')` is called. It:
   - Pre-loads all 20 audio files using `Tone.ToneAudioBuffer` or `Tone.Sampler`
   - Creates 4 `Tone.Player` instances per drum/bass type (one per variant), all routed through the master mix
   - Creates 1 `Tone.Player` for the chord progression loop, set to `loop: true`
   - Registers a fallback synth for each instrument type — if a sample file fails to load, the synth takes over silently

2. **The sequencer grid plays back via:** `audioEngine.triggerInstrument(instrumentType, variantIndex)` where `variantIndex` is 0-3 (which of the 4 options the player picked).

3. **Bass triggers are pitched** based on the grid step's note (C, D, E, F in pentatonic) using `Tone.Sampler`'s pitch-shift capability.

4. **Chord progression loops** start on Studio scene mount + auto-stop on Studio scene unmount. They play continuously underneath the sequencer.

5. **Player UI for variant selection:** added to Studio scene as 4 small buttons next to each instrument label. Clicking a button sets the active variant. Default = variant 1 (`*_01.mp3`).

6. **Player UI for chord progression selection:** added at the top of the Studio scene as 4 large buttons. Player picks one before clicking PLAY. Selection persists per session via `gameState.data.audioPrefs`.

7. **Fallback behavior** — if any file fails to load:
   - Console warning: `"[AudioEngine] Sample missing: kick_02.mp3 — falling back to synth."`
   - Player UI shows a small "(synth)" tag next to that variant's button
   - Game does NOT crash; instrument plays using existing synthesis

**This means:** you can deploy with 12 of 20 files ready and the rest synth — game still works, just sounds half-sampled. Don't delay the deadline waiting for the perfect sample library.

---

## 5. Recording / production tips (from a brutal honesty perspective)

**Your fastest path:** if you have a sample library on your machine (Splice, Output, Native Instruments, anything with one-shots), pull from there. Don't record from scratch unless you have to. The samples just need to be good — not original.

**For the chord loops specifically:** record/produce them in your DAW at 90 BPM, 4 bars, export as stereo MP3. Most DAWs (Ableton, FL Studio, Logic, Bitwig) export MP3 directly — don't waste time exporting WAV → converting.

**Test the chord loops by themselves before delivering** — open them in any audio player and confirm they loop seamlessly. If you hear a click at the loop point, the sample isn't truly seamless and the loop will sound broken in the game.

**Drums vs. chord loops vs. bass — split the work:**
- Drums: 12 files, ~1 hour of sample-pack curation if you're pulling from existing
- Chord loops: 4 files, 2-3 hours to produce well in a DAW
- Bass: 4 files, ~30 min to record/grab + pitch correctly

**If time crunch hits Tuesday:** prioritize delivering the 4 chord progression loops first. Those are the hardest to fall back to (synth chord progressions sound generic; sampled chord progressions are the "song" of the level). Drums + bass can fall back to synth and still feel like the game.

---

## 6. Quality checklist before delivery

Before you `git add` the audio folder and tell Claude Code to integrate:

- [ ] All 20 files present in `beat-world-2026/assets/audio/level-01-nyc/` with exact names from §3
- [ ] All files MP3, 192 kbps, 44.1 kHz, 16-bit
- [ ] All drum samples mono; bass + chord loops stereo
- [ ] All files normalize to -1 dBFS peak (check in your DAW or Audacity)
- [ ] All chord progression loops are exactly 4 bars at the BPM listed, butt-edit seamlessly
- [ ] Bass samples recorded at C2 root pitch
- [ ] No leading silence on any file (tight heads)
- [ ] Total folder size under 1.5 MB

---

## 7. Sources / references

- Tone.js Sampler docs: https://tonejs.github.io/docs/15.0.4/classes/Sampler
- MP3 encoding for web audio: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Audio_codecs#mp3_mpeg-1_audio_layer_iii
- Per-sample specs informed by: typical hip-hop production samples in Splice / Native Instruments Maschine factory libraries
