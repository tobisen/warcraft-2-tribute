"""CC0 acted Orc comparison only; not our dialogue or a complete voice pack."""
from pathlib import Path
import hashlib, json
import numpy as np
import soundfile as sf

root=Path(__file__).resolve().parent.parent
out=root/'artifacts/audio-identity/acted-orc'
out.mkdir(parents=True,exist_ok=True)
entries=[]
for name,text in [('i_expected_better','I expected better.'),('die_human_scum','Die, human scum.')]:
    original=root/f'assets/sources/audio-identity/originals/tim-rockk/{name}.wav'
    samples,rate=sf.read(original,always_2d=True)
    samples=samples.mean(axis=1)
    samples-=samples.mean()
    fade=min(round(rate*.008),len(samples)//2)
    samples[:fade]*=np.linspace(0,1,fade)
    samples[-fade:]*=np.linspace(1,0,fade)
    active=samples[np.abs(samples)>.004]
    if not len(active):raise ValueError('Silent recording')
    gain=min(.085/float(np.sqrt(np.mean(active**2))),.45/float(np.max(np.abs(samples))))
    samples*=gain
    target=out/f'{name}.wav'
    sf.write(target,samples,rate,subtype='PCM_16')
    entries.append(dict(id=name,text=text,author='Tim Rockk',source='https://opengameart.org/content/orc-voice',download=f'https://opengameart.org/sites/default/files/{name}.wav',license='CC0-1.0',licenseUrl='https://creativecommons.org/publicdomain/zero/1.0/',original=str(original.relative_to(root)),originalSha256=hashlib.sha256(original.read_bytes()).hexdigest(),output=str(target.relative_to(root)),sha256=hashlib.sha256(target.read_bytes()).hexdigest(),processing='Mono downmix at original sample rate; DC removal;8ms fades; active RMS .085/peakcap .45;PCM16; no pitch/formant shift',sampleRate=rate,gain=gain,peak=float(np.max(np.abs(samples))),duration=len(samples)/rate,listeningVerified=False))
(out/'manifest.json').write_text(json.dumps(dict(status='Acted CC0 comparison; author dialogue, not original project script or complete pack',entries=entries),indent=2)+'\n')
(out/'index.html').write_text('''<!doctype html><html lang="sv"><meta charset="utf-8"><title>Inläst Orc – jämförelse</title><style>body{font:18px system-ui;max-width:700px;margin:35px auto;background:#182024;color:#eee;padding:20px}audio{display:block;margin:15px 0 30px;width:100%}</style><h1>Inläst Orc – jämförelse</h1><p>Tim Rockk, CC0. Riktiga inspelningar bearbetade av upphovspersonen i Audacity. Detta är ett framförandeprov med författarens repliker, inte våra egna repliker eller ett färdigt paket.</p><label>I expected better.</label><audio controls src="i_expected_better.wav"></audio><label>Die, human scum.</label><audio controls src="die_human_scum.wav"></audio><p><a href="../revision-2/index.html">Jämför tidigare AI- och effektprov</a></p></html>''')
print('Two CC0 acted comparisons exported; listening unverified.')
