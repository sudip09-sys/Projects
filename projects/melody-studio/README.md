# Melody Studio

Built by **Sudip Sah** (@sudip09-sys), for Sudip Lab.

Twenty-six original instrumental sketches. Ten featured sessions explore two different moods for each of the user's requested influences: The Weeknd (dark synth-pop / neon disco-pop), Lana Del Rey (cinematic dream-pop / slow cinematic ballad), Billie Eilish (minimal alt-pop / sub-bass pop), Kendrick Lamar (jazz-rap / West Coast bounce), and Drake (late-night R&B / melodic trap). These are original compositions, not songs, samples, vocals, or artist performances. The existing sixteen genre grooves remain available.

Each sketch combines lead melody, chords, bass and synthesized drums. Featured sessions vary synth waveform, filtering, attack, bass rhythm and feedback echo. Effects are disconnected and cleared when playback stops. Tempo (55–190 BPM), volume, track mutes, looping, pause/resume, reset, a visual sequencer and output meter are included. Play live piano over the beat with A S D F G H J. The separate JSON exercise still works. Playback pauses while the document is hidden.

## Run
Serve the repository root over HTTP or open the app through Sudip Lab. Checked-in build files run directly on GitHub Pages without installing packages.

## Edit and check
Run npm install, npm run build and npm test in this folder. Source is in src/main.ts and src/presets.ts. Tests validate uniqueness, musical ranges, playable patterns, diatonic chords, tempo/swing duration and featured-session coverage. The piano uses C major / A minor. JSON melody timing is fixed and disables the tempo slider.
