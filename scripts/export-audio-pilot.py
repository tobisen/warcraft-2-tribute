"""Export only the small audition; does not replace the game's production audio.

Use the same optional soundfile export dependency as export-audio.py.
"""
from pathlib import Path
import hashlib
import json
import math
import soundfile as sf

root = Path(__file__).resolve().parent.parent
source = root / 'assets/sources/audio-identity'
output = root / 'artifacts/audio-identity'
output.mkdir(parents=True, exist_ok=True)
entries = []
for cue, filename, material in [
    ('melee', 'impactMetal_medium_000.ogg', 'metal weapon contact'),
    ('build', 'impactWood_medium_000.ogg', 'wood construction contact'),
    ('mining', 'impactMining_002.ogg', 'pickaxe/stone contact'),
]:
    original = source / 'originals' / filename
    samples, rate = sf.read(original, always_2d=True)
    samples = samples.mean(axis=1)
    # Mild one-pole low-pass softens sharp transients without a pitch change.
    alpha = 1 - math.exp(-2 * math.pi * 5500 / rate)
    previous = 0.0
    for i, value in enumerate(samples):
        previous += alpha * (value - previous)
        samples[i] = previous
    fade = min(round(rate * .005), len(samples) // 2)
    for i in range(fade):
        samples[i] *= i / fade
        samples[-1-i] *= i / fade
    peak = float(abs(samples).max())
    rms = math.sqrt(float((samples * samples).mean()))
    # Common RMS target with conservative peak headroom; no limiter/clipping.
    gain = min(.05 / rms, .65 / peak) if rms and peak else 1
    samples *= gain
    destination = output / f'{cue}.wav'
    sf.write(destination, samples, rate, subtype='PCM_16')
    entries.append({
        'cue': cue, 'material': material,
        'source': 'https://kenney.nl/assets/impact-sounds',
        'author': 'Kenney', 'license': 'CC0-1.0',
        'licenseUrl': 'https://creativecommons.org/publicdomain/zero/1.0/',
        'original': str(original.relative_to(root)),
        'originalSha256': hashlib.sha256(original.read_bytes()).hexdigest(),
        'export': str(destination.relative_to(root)),
        'exportSha256': hashlib.sha256(destination.read_bytes()).hexdigest(),
        'processing': 'mono downmix; 5.5kHz one-pole low-pass; 5ms endpoint fades; RMS target .05, peak cap .65; PCM16 WAV',
        'gain': gain, 'sampleRate': rate, 'duration': len(samples)/rate,
        'peak': float(abs(samples).max()),
        'rms': math.sqrt(float((samples*samples).mean())),
        'listeningVerified': False,
    })
(output / 'manifest.json').write_text(json.dumps({
    'status': 'audition only; no production replacement or listening approval',
    'entries': entries,
}, indent=2) + '\n')
print('Exported three CC0 Foley audition WAVs; listening remains required.')
