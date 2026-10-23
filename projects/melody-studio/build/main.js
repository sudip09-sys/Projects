/** Sudip Lab / Sudip Sah / original four-bar song sketches and a live piano. */
import { presets, stepEvents, midiFrequency, stepSeconds } from './presets.js';
const $ = (id) => document.getElementById(id);
const status = $('status'), play = $('play'), tempo = $('tempo'), loop = $('loop');
class StudioAudio {
    context = null;
    master;
    analyser;
    noise;
    delay = null;
    feedback = null;
    wet = null;
    voices = new Set();
    tracks = {};
    async ready() { if (!this.context) {
        const c = this.context = new AudioContext();
        this.master = c.createGain();
        this.master.gain.value = .65;
        const limiter = c.createDynamicsCompressor();
        limiter.threshold.value = -12;
        limiter.ratio.value = 5;
        this.analyser = c.createAnalyser();
        this.analyser.fftSize = 256;
        this.master.connect(limiter);
        limiter.connect(this.analyser);
        this.analyser.connect(c.destination);
        for (const name of ['melody', 'drums', 'bass']) {
            const g = c.createGain();
            g.connect(this.master);
            this.tracks[name] = g;
        }
        this.noise = c.createBuffer(1, c.sampleRate, c.sampleRate);
        const samples = this.noise.getChannelData(0);
        for (let i = 0; i < samples.length; i++)
            samples[i] = Math.random() * 2 - 1;
    } await this.context.resume(); this.mix(); this.effects(); }
    effects() { if (this.delay || !this.context)
        return; const c = this.context; this.delay = c.createDelay(1); this.feedback = c.createGain(); this.wet = c.createGain(); this.delay.delayTime.value = preset.echo ?? .13; this.feedback.gain.value = .26; this.wet.gain.value = preset.influence ? .22 : .07; this.tracks.melody.connect(this.delay); this.delay.connect(this.feedback); this.feedback.connect(this.delay); this.delay.connect(this.wet); this.wet.connect(this.master); }
    mix() { if (!this.context)
        return; this.master.gain.setTargetAtTime(Number($('volume').value) / 100, this.context.currentTime, .02); for (const [name, g] of Object.entries(this.tracks))
        g.gain.setTargetAtTime($(name + '-track').checked ? 1 : 0, this.context.currentTime, .015); }
    connect(source, gain, track, filter) { if (filter) {
        source.connect(filter);
        filter.connect(gain);
    }
    else
        source.connect(gain); gain.connect(this.tracks[track]); this.voices.add(source); source.onended = () => { this.voices.delete(source); source.disconnect(); gain.disconnect(); filter?.disconnect(); }; }
    note(midi, time, duration, volume, wave, track = 'melody', tone = 4200, attack = .008) { const c = this.context; const voice = c.createOscillator(), gain = c.createGain(), filter = c.createBiquadFilter(); voice.type = wave; voice.frequency.value = midiFrequency(midi); filter.type = 'lowpass'; filter.frequency.value = tone === 4200 && wave === 'sawtooth' ? 1400 : tone; gain.gain.setValueAtTime(0, time); gain.gain.linearRampToValueAtTime(volume, time + Math.min(attack, duration * .3)); gain.gain.exponentialRampToValueAtTime(.0001, time + duration); this.connect(voice, gain, track, filter); voice.start(time); voice.stop(time + duration + .02); }
    drum(kind, time) { const c = this.context, gain = c.createGain(); if (kind === 'kick') {
        const voice = c.createOscillator();
        voice.frequency.setValueAtTime(145, time);
        voice.frequency.exponentialRampToValueAtTime(42, time + .16);
        gain.gain.setValueAtTime(.7, time);
        gain.gain.exponentialRampToValueAtTime(.0001, time + .3);
        this.connect(voice, gain, 'drums');
        voice.start(time);
        voice.stop(time + .32);
    }
    else {
        const source = c.createBufferSource(), filter = c.createBiquadFilter();
        source.buffer = this.noise;
        filter.type = 'highpass';
        filter.frequency.value = kind === 'hat' ? 6500 : 1400;
        const length = kind === 'hat' ? .055 : .15;
        gain.gain.setValueAtTime(kind === 'hat' ? .1 : .23, time);
        gain.gain.exponentialRampToValueAtTime(.0001, time + length);
        this.connect(source, gain, 'drums', filter);
        source.start(time);
        source.stop(time + length + .01);
    } }
    stop() { for (const voice of this.voices) {
        try {
            voice.stop();
        }
        catch { }
    } this.voices.clear(); if (this.delay) {
        this.tracks.melody.disconnect(this.delay);
        this.delay.disconnect();
        this.feedback?.disconnect();
        this.wet?.disconnect();
        this.delay = null;
        this.feedback = null;
        this.wet = null;
    } }
}
const audio = new StudioAudio();
let preset = presets[0], running = false, cursor = 0, nextTime = 0, timer = null, generation = 0;
let queue = [], custom = null, customLoading = false;
const pianoNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'], pianoMidi = [60, 62, 64, 65, 67, 69, 71], bindings = ['a', 's', 'd', 'f', 'g', 'h', 'j'];
function announce(text) { status.textContent = text; }
function buttonState() { play.textContent = running ? 'Pause' : 'Play'; play.setAttribute('aria-pressed', String(running)); }
function pause() { generation++; if (running) {
    const future = queue.find(e => e.time > (audio.context?.currentTime ?? 0));
    if (future)
        cursor = future.step;
} running = false; if (timer !== null)
    clearInterval(timer); timer = null; queue = []; audio.stop(); $('level').value = 0; buttonState(); }
function reset() { pause(); cursor = 0; document.querySelectorAll('.step.current').forEach(e => e.classList.remove('current')); $('position').textContent = 'Ready / 4 bars'; $('level').value = 0; announce(custom ? 'JSON melody ready' : preset.name + ' ready'); }
function renderPattern() { const grid = $('sequencer'); grid.replaceChildren(); for (const track of ['kick', 'snare', 'hat', 'melody']) {
    const label = document.createElement('span');
    label.className = 'track-label';
    label.textContent = track;
    grid.append(label);
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('i');
        cell.className = 'step';
        cell.dataset.step = String(i);
        const event = stepEvents(preset, i);
        if (event[track])
            cell.classList.add('on', track);
        grid.append(cell);
    }
} }
function select(next) { pause(); custom = null; cursor = 0; tempo.disabled = false; preset = next; tempo.value = String(next.bpm); $('tempo-value').textContent = next.bpm + ' BPM'; $('selected-name').textContent = next.name; $('selected-style').textContent = next.style + (next.influence ? ' / ' + next.influence + '-inspired' : '') + ' / ' + (next.minor ? 'A minor' : 'C major') + ' / 4 bars'; document.querySelectorAll('[data-preset]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.preset === next.id))); $('melody').replaceChildren(); $('position').textContent = 'Ready / 4 bars'; renderPattern(); announce(next.name + ' selected. Press Play.'); }
function schedule(step, time) {
    if (custom) {
        const n = custom[step];
        audio.note(n.note, time, Math.max(.07, n.duration / 1000 * .85), .25, 'triangle');
        return n.duration / 1000;
    }
    const events = stepEvents(preset, step), seconds = stepSeconds(Number(tempo.value), preset.swing, step);
    if (events.kick)
        audio.drum('kick', time);
    if (events.snare)
        audio.drum('snare', time);
    if (events.hat)
        audio.drum('hat', time);
    if (events.melody)
        audio.note(events.melody, time, seconds * 2.5, .17, preset.wave, 'melody', preset.leadTone ?? 4200, preset.leadAttack ?? .008);
    if (events.bass)
        audio.note(events.bass, time, seconds * 2.8, .28, 'sine', 'bass');
    events.chord.forEach(n => audio.note(n, time, seconds * 13, .045, preset.padWave ?? 'sine', 'melody', preset.influence ? 1100 : 4200, preset.influence ? .09 : .008));
    return seconds;
}
function pump() {
    if (!running)
        return;
    const c = audio.context;
    const end = custom?.length ?? 64;
    // Skip a stalled timer instead of scheduling a burst of late notes after tab throttling.
    if (nextTime < c.currentTime - .1)
        nextTime = c.currentTime + .03;
    while (nextTime < c.currentTime + .16) {
        if (cursor >= end) {
            if (loop.checked)
                cursor = 0;
            else {
                if (c.currentTime >= nextTime) {
                    pause();
                    cursor = 0;
                    announce('Playback complete');
                }
                break;
            }
        }
        if (cursor >= end)
            break;
        const step = cursor++;
        queue.push({ step, time: nextTime });
        nextTime += schedule(step, nextTime);
    }
    let current;
    while (queue.length && queue[0].time <= c.currentTime)
        current = queue.shift().step;
    if (current !== undefined) {
        document.querySelectorAll('.step').forEach(cell => cell.classList.toggle('current', Number(cell.dataset.step) === current % 16));
        $('position').textContent = custom ? 'Note ' + (current + 1) + ' / ' + custom.length : 'Bar ' + (Math.floor(current / 16) + 1) + ' / 4 · Beat ' + (Math.floor(current % 16 / 4) + 1);
    }
    const samples = new Float32Array(audio.analyser.fftSize);
    audio.analyser.getFloatTimeDomainData(samples);
    $('level').value = Math.min(1, Math.sqrt(samples.reduce((a, n) => a + n * n, 0) / samples.length) * 3);
}
async function toggle() { if (running) {
    pause();
    announce('Paused · press Play to continue');
    return;
} if (customLoading)
    return; const token = ++generation; play.disabled = true; try {
    await audio.ready();
    if (token !== generation)
        return;
    running = true;
    nextTime = audio.context.currentTime + .04;
    buttonState();
    announce('Playing ' + (custom ? 'JSON melody' : preset.name));
    pump();
    timer = setInterval(pump, 35);
}
catch {
    announce('Audio unavailable. Try a browser with Web Audio support.');
}
finally {
    play.disabled = false;
} }
async function manual(index) { try {
    await audio.ready();
    audio.note(pianoMidi[index], audio.context.currentTime, .65, .25, 'triangle');
    const key = $('piano').children[index];
    key.classList.add('active');
    setTimeout(() => key.classList.remove('active'), 180);
    if (!running)
        announce('Playing ' + pianoNotes[index]);
}
catch {
    announce('Audio unavailable. Click Play to try again.');
} }
async function loadMelody() { pause(); cursor = 0; const token = generation; customLoading = true; $('load').disabled = true; const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 8000); try {
    const response = await fetch('melody.json', { signal: controller.signal });
    if (!response.ok)
        throw Error('HTTP ' + response.status);
    const value = await response.json();
    if (!Array.isArray(value) || value.length === 0 || value.length > 256 || !value.every(n => n && typeof n === 'object' && pianoNotes.includes(n.note) && Number.isFinite(n.duration) && n.duration >= 50 && n.duration <= 10000))
        throw Error('Invalid melody');
    if (token !== generation)
        return;
    custom = value.map(n => ({ note: pianoMidi[pianoNotes.indexOf(n.note)], duration: n.duration }));
    tempo.disabled = true;
    $('selected-name').textContent = 'JSON piano melody';
    $('selected-style').textContent = 'Piano only / original exercise';
    document.querySelectorAll('[data-preset]').forEach(b => b.setAttribute('aria-pressed', 'false'));
    const strip = $('melody');
    strip.replaceChildren();
    value.forEach(n => { const b = document.createElement('button'); b.textContent = n.note; b.addEventListener('click', () => void manual(pianoNotes.indexOf(n.note))); strip.append(b); });
    announce(value.length + ' notes loaded. Press Play.');
}
catch {
    if (token === generation)
        announce('Could not load melody.json. Choose a preset or try again.');
}
finally {
    clearTimeout(timeout);
    customLoading = false;
    $('load').disabled = false;
} }
for (const p of presets) {
    const b = document.createElement('button');
    b.className = 'preset';
    b.dataset.preset = p.id;
    b.setAttribute('aria-pressed', 'false');
    const style = document.createElement('small'), name = document.createElement('strong'), bpm = document.createElement('span');
    style.textContent = p.influence ?? p.style;
    name.textContent = p.name;
    bpm.textContent = p.style + ' · ' + p.bpm + ' BPM';
    b.append(style, name, bpm);
    b.addEventListener('click', () => select(p));
    $(p.influence ? 'sessions' : 'presets').append(b);
}
for (let i = 0; i < 7; i++) {
    const b = document.createElement('button');
    b.textContent = pianoNotes[i] + ' / ' + bindings[i].toUpperCase();
    b.setAttribute('aria-label', 'Play ' + pianoNotes[i]);
    b.addEventListener('click', () => void manual(i));
    $('piano').append(b);
}
play.addEventListener('click', () => void toggle());
$('reset').addEventListener('click', reset);
$('load').addEventListener('click', () => void loadMelody());
tempo.addEventListener('input', () => { $('tempo-value').textContent = tempo.value + ' BPM'; });
tempo.addEventListener('change', () => { if (running) {
    pause();
    void toggle();
} });
for (const id of ['volume', 'melody-track', 'drums-track', 'bass-track'])
    $(id).addEventListener('input', () => audio.mix());
document.addEventListener('keydown', event => { if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || event.target.closest('input,select,textarea,[contenteditable]'))
    return; const i = bindings.indexOf(event.key.toLowerCase()); if (i >= 0) {
    event.preventDefault();
    void manual(i);
} if (event.code === 'Space' && !event.target.closest('button,a')) {
    event.preventDefault();
    void toggle();
} });
document.addEventListener('visibilitychange', () => { if (document.hidden && running) {
    pause();
    announce('Paused while this tab is hidden.');
} });
window.addEventListener('pagehide', pause);
select(presets.find(p => p.id === 'afterglow'));
