# Melody Studio

Built by **Sudip Sah** (@sudip09-sys), for Sudip Lab.

Sixteen original four-bar musical sketches: lo-fi, boom bap, trap, house, techno, synth-pop, afrobeat, reggaeton, drum & bass, funk, disco, R&B, acoustic pop, cinematic, Latin pop, and UK garage.

Each sketch combines a lead melody, diatonic chord progression, bass, kick, snare, and hi-hat. All sound is synthesized with Web Audio; no song recordings are included. Play/pause, stop/reset, looping, 55–190 BPM tempo, volume, track mutes, a step display, and an output meter are included. The seven-key piano and JSON piano exercise remain available.

## Run
Serve the repository root over HTTP, or open the app through Sudip Lab. The checked-in `build/` runs directly on GitHub Pages.

## Edit and check
TypeScript sources are in `src/main.ts` and `src/presets.ts`. Run `npm install`, `npm run build`, and `npm test` from this folder. Preset tests validate uniqueness, musical ranges, diatonic chords, drum patterns, bar duration, swing, and loop boundaries.

Select a sketch, then press Play. Space plays/pauses outside a form control; A S D F G H J play the piano. Tempo changes preserve the next unplayed step. Reset starts from bar one. Playback pauses when the document is hidden. JSON exercise durations are fixed, so its tempo slider is disabled. Preset sketches are original genre-inspired compositions, not reproductions of particular songs.

## Hindustani riyaaz
The additional library contains six ragas (Bhoopali, Yaman, Durga, Bhairav, Kafi, Bhairavi), each with a 16-note sargam exercise and a 32-note straight taan across one 16-matra Teentaal cycle. The melody and keyboard follow the selected Sa from C3 to C4. The accompaniment uses a synthesized Sa–Pa drone and tabla-inspired pulses; it does not use Western chord changes. The display marks the 4+4+4+4 divisions, sam, claps and khali, plus the current swara. All 16 modern grooves remain available.

These are original equal-tempered pitch/speed exercises, not recorded performances or a full model of raga grammar, meend, or andolan. Yaman uses tivra Ma; Bhoopali and Durga use their five-note sets; Bhairav, Kafi and Bhairavi expose their komal swaras explicitly. Tests verify note sets, scale membership, Sa transposition, final Sa, note density and Teentaal boundaries.

Note-set verification: [Artium Academy raga curriculum](https://betareact.artiumacademy.com/music-theory/hindustani-classical/ragas) and [David Courtney's raga guide](https://chandrakantha.com/music-and-dance/i-class-music/index-of-rags/). Teentaal reference: [Nrityanvita Kathak Academy](https://anvitasharma.com/pages/curriculum). No explanatory prose or musical recordings were copied from these references.
