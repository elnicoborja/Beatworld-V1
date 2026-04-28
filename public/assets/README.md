# Assets — drop files here

Vite serves everything under `public/` at the URL root, so files placed at
`public/assets/foo.png` are reachable at `/assets/foo.png` from the game.

This folder is the on-disk home for every asset the game loads at runtime.
The brief refers to paths as `assets/...` — those are URL paths. The on-disk
location is `public/assets/...`.

If a file is missing, the game renders a labelled placeholder rectangle and
keeps running — drop the real PNG/MP3 in and refresh, no code changes needed.

## Audio — `public/assets/audio/level-01-nyc/`

20 files total. See `AUDIO_SAMPLE_SPECS.md` (BEATWORLD-APP root) for full specs.

```
kick_01.mp3        snare_01.mp3       hihat_01.mp3       bass_01.mp3
kick_02.mp3        snare_02.mp3       hihat_02.mp3       bass_02.mp3
kick_03.mp3        snare_03.mp3       hihat_03.mp3       bass_03.mp3
kick_04.mp3        snare_04.mp3       hihat_04.mp3       bass_04.mp3
chord_progression_01.mp3   (Boom Bap)
chord_progression_02.mp3   (G-Funk)
chord_progression_03.mp3   (Trap)
chord_progression_04.mp3   (Soul Loop)
```

Bass samples MUST be recorded at C2 root (Tone.Sampler pitch-shifts from there).

## Sprites — `public/assets/sprites/`

See `ILLUSTRATION_PROMPTS_LEVEL_1.md` (BEATWORLD-APP root) for full specs.

```
soundsystem/
  boombox.png                          256x256, transparent
  boombox-unlock-coney-island.png      1920x1080, opaque
  pico.png                             post-launch (L2-L6)
  baile-funk.png                       post-launch
  bass-cabinet.png                     post-launch
  sonidero.png                         post-launch
  warehouse.png                        post-launch

characters/
  critic-xxl.png                       256x256, transparent
  parts/
    top-boombap.png    top-gfunk.png    top-punk.png    top-beatmaker.png
    mid-boombap.png    mid-gfunk.png    mid-punk.png    mid-beatmaker.png
    bottom-boombap.png bottom-gfunk.png bottom-punk.png bottom-beatmaker.png
    (each 256x128, transparent — sliced from 256x384 source per character)

venues/
  studio-nyc.png                       1920x540, opaque (top-half studio backdrop)
  gig-bk-court.png                     1920x1080, opaque (performance backdrop)

ui/
  review-magazine-cover.png            720x900, opaque (5 EMPTY star outlines — code overlays fills)
  soundsystem-hangar.png               1920x1080, opaque
```
