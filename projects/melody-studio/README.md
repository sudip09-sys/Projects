# Melody Studio

Built by **Sudip Sah** (@sudip09-sys), for Sudip Lab.

Sixteen original four-bar musical sketches: lo-fi, boom bap, trap, house, techno, synth-pop, afrobeat, reggaeton, drum & bass, funk, disco, R&B, acoustic pop, cinematic, Latin pop, and UK garage.

Each sketch combines a lead melody, diatonic chord progression, bass, kick, snare, and hi-hat. All sound is synthesized with Web Audio; no song recordings are included. Play/pause, stop/reset, looping, 55–190 BPM tempo, volume, track mutes, a step display, and an output meter are included. The seven-key piano and JSON piano exercise remain available.

## Run
Serve the repository root over HTTP, or open the app through Sudip Lab. The checked-in `build/` runs directly on GitHub Pages.

## Edit and check
TypeScript sources are in `src/main.ts` and `src/presets.ts`. Run `npm install`, `npm run build`, and `npm test` from this folder. Preset tests validate uniqueness, musical ranges, diatonic chords, drum patterns, bar duration, swing, and loop boundaries.

Select a sketch, then press Play. Space plays/pauses outside a form control; A S D F G H J play the piano. Tempo changes preserve the next unplayed step. Reset starts from bar one. Playback pauses when the document is hidden. JSON exercise durations are fixed, so its tempo slider is disabled. Preset sketches are original genre-inspired compositions, not reproductions of particular songs.
