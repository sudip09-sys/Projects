export const ragas = [
    { id: 'bhoopali', name: 'Bhoopali', hindi: 'भूपाली', scale: [0, 2, 4, 7, 9], labels: ['Sa', 'Re', 'Ga', 'Pa', 'Dha'] },
    { id: 'yaman', name: 'Yaman', hindi: 'यमन', scale: [0, 2, 4, 6, 7, 9, 11], labels: ['Sa', 'Re', 'Ga', 'tivra Ma', 'Pa', 'Dha', 'Ni'] },
    { id: 'durga', name: 'Durga', hindi: 'दुर्गा', scale: [0, 2, 5, 7, 9], labels: ['Sa', 'Re', 'Ma', 'Pa', 'Dha'] },
    { id: 'bhairav', name: 'Bhairav', hindi: 'भैरव', scale: [0, 1, 4, 5, 7, 8, 11], labels: ['Sa', 'komal Re', 'Ga', 'Ma', 'Pa', 'komal Dha', 'Ni'] },
    { id: 'kafi', name: 'Kafi', hindi: 'काफी', scale: [0, 2, 3, 5, 7, 9, 10], labels: ['Sa', 'Re', 'komal Ga', 'Ma', 'Pa', 'Dha', 'komal Ni'] },
    { id: 'bhairavi', name: 'Bhairavi', hindi: 'भैरवी', scale: [0, 1, 3, 5, 7, 8, 10], labels: ['Sa', 'komal Re', 'komal Ga', 'Ma', 'Pa', 'komal Dha', 'komal Ni'] }
];
export const teentaal = ['Dha', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Dhin', 'Dhin', 'Dha', 'Dha', 'Tin', 'Tin', 'Ta', 'Ta', 'Dhin', 'Dhin', 'Dha'];
export const classicalPresets = ragas.flatMap(raga => {
    const ascending = [...raga.scale, 12], descent = raga.scale.slice().reverse(), line = [...ascending, ...descent];
    const slow = [...line];
    while (slow.length < 15)
        slow.push(raga.scale[(slow.length - line.length + 1) % (raga.scale.length - 1) + 1]);
    slow.length = 15;
    slow.push(0);
    const fast = Array.from({ length: 32 }, (_, i) => line[i % line.length]);
    fast[31] = 0;
    return [{ id: raga.id + '-sargam', raga, kind: 'Sargam', name: raga.name + ' · Sargam', bpm: 72, notes: slow }, { id: raga.id + '-taan', raga, kind: 'Taan', name: raga.name + ' · Taan', bpm: 96, notes: fast }];
});
export function classicalStep(p, step, tonic = 60) { const local = step % 64, beat = Math.floor(local / 4), stride = p.kind === 'Sargam' ? 4 : 2, note = local % stride === 0 ? tonic + p.notes[Math.floor(local / stride)] : 0, bol = local % 4 === 0 ? teentaal[beat] : ''; return { melody: note, bol, kick: bol === 'Dha' || bol === 'Dhin', snare: Boolean(bol), hat: false, drone: local % 16 === 0 ? [tonic - 12, tonic - 5] : [], beat }; }
export function swarLabel(raga, offset) { const index = raga.scale.indexOf((offset % 12 + 12) % 12); return index < 0 ? '—' : raga.labels[index] + (offset >= 12 ? '′' : ''); }
export function classicalKeyboard(raga, tonic) { return Array.from({ length: 7 }, (_, i) => { const octave = Math.floor(i / raga.scale.length), offset = raga.scale[i % raga.scale.length] + octave * 12; return { midi: tonic + offset, label: swarLabel(raga, offset) }; }); }
