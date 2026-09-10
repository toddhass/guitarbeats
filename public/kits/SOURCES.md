# Kit sources

We do **not** ship Beat Buddy `.drm` files.

## Currently loaded at runtime (not vendored)

Tone.js example drums, hosted by the Tone project:

- Room kit: https://tonejs.github.io/audio/drum-samples/acoustic-kit/
- Dry kit: https://tonejs.github.io/audio/drum-samples/electro/

Licenses live in that repo's per-folder notes. If Tone moves them, the app falls back to the oscillator synth.

## CC0 shortlist to vendor later (Freesound)

Download only **CC0** one-shots, then drop into `public/kits/dry` and `public/kits/room` as:

`kick.wav` `snare.wav` `hat.wav` `openhat.wav` `crash.wav` `tom.wav` `stick.wav`

Candidates (verify CC0 on the sound page before download):

- Kick: soneproject 459280, NoirPantalon 102130
- Hat: soneproject 459202
- Crash: soneproject 459256
- Toms: soneproject 459226 / 459224
- Stick/rim: search Freesound `rimshot CC0`

Breviceps and holizna also mark many hits CC0; still check each file.
