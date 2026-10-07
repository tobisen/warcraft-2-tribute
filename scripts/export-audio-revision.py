"""Small revised auditions only. Never activates unreviewed assets in production.

Run with the temporary Kokoro environment and --model-dir. Source licenses
and output notices are in assets/sources/audio-identity/licenses.
"""
from pathlib import Path
import argparse, hashlib, json, math
import numpy as np
import soundfile as sf
import onnxruntime as ort
ort.disable_telemetry_events()
from kokoro_onnx import Kokoro

parser=argparse.ArgumentParser()
parser.add_argument('--model-dir',type=Path,required=True)
args=parser.parse_args()
root=Path(__file__).resolve().parent.parent
out=root/'artifacts/audio-identity/revision-2'
out.mkdir(parents=True,exist_ok=True)
originals=root/'assets/sources/audio-identity/originals'
rate=24000
entries=[]
def prepare(x):
    x=np.asarray(x,dtype=np.float64);x-=x.mean()
    fade=min(192,len(x)//2)
    x[:fade]*=np.linspace(0,1,fade);x[-fade:]*=np.linspace(1,0,fade)
    active=x[np.abs(x)>.004]
    if not len(active):raise ValueError('Silent audition')
    x*=min(.085/math.sqrt(float(np.mean(active**2))),.45/float(np.max(np.abs(x))))
    return np.concatenate([np.zeros(480),x,np.zeros(720)])
def read(name):
    x,sr=sf.read(originals/name,always_2d=True);x=x.mean(axis=1)
    # Export-only resampling; no browser processing dependency.
    return np.interp(np.arange(round(len(x)*rate/sr))*sr/rate,np.arange(len(x)),x)
def layer(parts):
    x=np.zeros(max(round(delay*rate)+len(data) for data,delay,gain in parts))
    for data,delay,gain in parts:
        at=round(delay*rate);x[at:at+len(data)]+=data*gain
    return x
def save(name,x,metadata):
    x=prepare(x);path=out/(name+'.wav');sf.write(path,x,rate,subtype='PCM_16')
    entries.append(dict(id=name,path=str(path.relative_to(root)),sha256=hashlib.sha256(path.read_bytes()).hexdigest(),peak=float(np.max(np.abs(x))),duration=len(x)/rate,listeningVerified=False,**metadata))
    return x
specs={
 'melee':[('impactMetal_light_000.ogg',0,.65),('impactPunch_heavy_000.ogg',.012,.7)],
 'build':[('impactWood_light_001.ogg',0,1),('impactWood_light_001.ogg',.24,.75),('rpg/creak1.ogg',.12,.15)],
 'bow':[('rpg/clothBelt.ogg',0,.7),('rpg/knifeSlice.ogg',.035,.45)],
 'siege':[('impactPlank_medium_000.ogg',0,1),('impactMining_002.ogg',.05,.45)],
 'buildingHit':[('impactWood_medium_000.ogg',0,.6),('impactMining_002.ogg',.06,.7)],
 'impact':[('impactPunch_heavy_000.ogg',0,1)],
 'mining':[('impactMining_002.ogg',0,1)],
 'chop':[('rpg/chop.ogg',0,1)],
 'treasure':[('rpg/handleCoins.ogg',0,1)],
}
for cue,parts in specs.items():
    save(cue,layer([(read(name),delay,gain) for name,delay,gain in parts]),dict(author='Kenney; project arrangement',license='CC0-1.0',sources=[dict(file='assets/sources/audio-identity/originals/'+name,sha256=hashlib.sha256((originals/name).read_bytes()).hexdigest(),url='https://kenney.nl/assets/'+('rpg-audio' if name.startswith('rpg/') else 'impact-sounds'),delay=delay,gain=gain) for name,delay,gain in parts],processing='Recorded-material layers; mono resample24k; DC removal;8ms fades; active RMS .085/peakcap .45;20/30ms silence; no white-noise synthesis'))
engine=Kokoro(str(args.model_dir/'kokoro-v1.0.onnx'),str(args.model_dir/'voices-v1.0.bin'))
# Fixed presets cannot act a directed growl. These are comparisons, not final Orcs.
profiles=[
 ('crown','bm_george','en-gb',1.02,['Orders received. Paperwork regrettably follows.','Moving out, sir.','The enemy has declined our polite request.']),
 ('clans-adam','am_adam','en-us',.93,['What do you want, runt?','Move your arse. I am coming through.','Shut your mouth. I have skulls to crack.']),
 ('clans-onyx','am_onyx','en-us',.93,['What do you want, runt?','Move your arse. I am coming through.','Shut your mouth. I have skulls to crack.']),
 ('clans-fenrir','am_fenrir','en-us',.93,['What do you want, runt?','Move your arse. I am coming through.','Shut your mouth. I have skulls to crack.']),
 ('elves','bf_isabella','en-gb',.98,['Yes? Do try to make this worth my time.','I shall choose the tasteful route.','Your formation is an aesthetic offence.']),
 ('dwarves','bm_fable','en-gb',.92,['Spit it out. The forge is waiting.','Aye. Boots on stone.','Your armour is shoddy. I will demonstrate.']),
 ('goblins','am_puck','en-us',1.16,['Boss! The warranty has already expired.','Coming! Keep a fire extinguisher handy.','Kaboom first. Invoice later.']),
]
for name,voice,lang,speed,lines in profiles:
    clips=[]
    for i,line in enumerate(lines,1):
        x,sr=engine.create(line,voice=voice,lang=lang,speed=speed)
        assert sr==rate
        clips.append(save(f'{name}-{i}',x,dict(text=line,voice=voice,language=lang,speed=speed,author='Project, locally generated with Kokoro/hexgrad',source='https://huggingface.co/hexgrad/Kokoro-82M',modelSha256=hashlib.sha256((args.model_dir/'kokoro-v1.0.onnx').read_bytes()).hexdigest(),license='CC0-1.0 project output; Apache-2.0 model',processing='Separate neural preset; no pitch shift; DC removal;8ms fades; active RMS .085/peakcap .45;20/30ms margins')))
    sf.write(out/f'preview-{name}.wav',np.concatenate([np.concatenate([c,np.zeros(6000)]) for c in clips]),rate,subtype='PCM_16')
(out/'manifest.json').write_text(json.dumps(dict(status='Revision auditions; previous match quality rejected; no production activation',entries=entries),indent=2)+'\n')
print('Revised SFX and seven voice comparisons exported; auditory quality unverified.')
