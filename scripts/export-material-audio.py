"""Recorded-material replacements in the existing local audio graph.

Optional offline numpy/scipy/soundfile; no runtime framework or service.
Credits and processing are exported per sound, including each original layer.
"""
from pathlib import Path
import hashlib, json, math
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly, butter, sosfilt

root=Path(__file__).resolve().parent.parent
originals=root/'assets/sources/audio-identity/originals'
rate=24000
# Original filename, onset in output, layer gain. No generated white noise.
recipes={
 'melee':('metal weapon strike and body contact',.45,[('impactMetal_light_000.ogg',0,.65),('impactPunch_heavy_000.ogg',.012,.7)]),
 'build':('hammering timber with a small frame creak',.75,[('impactWood_light_001.ogg',0,1),('impactWood_light_001.ogg',.24,.75),('rpg/creak1.ogg',.12,.15)]),
 'bow':('bow release and arrow flight',.4,[('rpg/clothBelt.ogg',0,.7),('rpg/knifeSlice.ogg',.035,.45)]),
 'siege':('heavy wooden mechanism launch',.65,[('impactPlank_medium_000.ogg',0,1),('impactWood_medium_000.ogg',.05,.45)]),
 'buildingHit':('stone masonry hit',.9,[('thimras/cannon_hit_wall_no_splash.ogg',0,.65),('impactMining_002.ogg',.06,.35)]),
 'impact':('body/armour contact',.4,[('impactPunch_heavy_000.ogg',0,1)]),
 'mining':('pickaxe striking stone',.6,[('impactMining_002.ogg',0,1)]),
 'chop':('axe biting wood',.6,[('rpg/chop.ogg',0,1)]),
 'gather':('legacy generic work contact',.6,[('impactMining_002.ogg',0,1)]),
 'treasure':('coins handled in a treasure chest',1.1,[('rpg/handleCoins.ogg',0,1)]),
 'destruction':('timber failure and falling masonry',1.6,[('impactPlank_medium_000.ogg',0,.7),('impactWood_medium_000.ogg',.11,.8),('thimras/cannon_hit_wall_no_splash.ogg',.18,.7),('impactMining_002.ogg',.48,.35)]),
 'cannon':('gunpowder cannon discharge',1.5,[('thimras/cannon_fire_1.ogg',0,1)]),
 'splash':('projectile landing in water',1.1,[('thimras/cannon_miss_1.ogg',0,1)]),
}
def source_info(name):
    if name.startswith('thimras/'):
        return {'author':'Thimras','source':'https://opengameart.org/content/battle-at-sea','download':'https://opengameart.org/sites/default/files/'+Path(name).name,'license':'CC0-1.0'}
    return {'author':'Kenney','source':'https://kenney.nl/assets/'+('rpg-audio' if name.startswith('rpg/') else 'impact-sounds'),'license':'CC0-1.0'}
entries={}
for cue,(material,duration,layers) in recipes.items():
    x=np.zeros(round(duration*rate));sources=[]
    for name,delay,gain in layers:
        p=originals/name;y,sr=sf.read(p,always_2d=True);y=y.mean(axis=1)
        divisor=math.gcd(sr,rate);y=resample_poly(y,rate//divisor,sr//divisor)
        # Preserve actual contact onset, skip only initial silence.
        active=np.flatnonzero(np.abs(y)>.003)
        if not len(active):raise ValueError(f'Silent source {name}')
        y=y[max(0,int(active[0])-round(.01*rate)):]
        at=round(delay*rate);length=min(len(y),len(x)-at)
        x[at:at+length]+=y[:length]*gain
        sources.append(dict(original=str(p.relative_to(root)),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),delay=delay,gain=gain,**source_info(name)))
    x-=x.mean();x=sosfilt(butter(2,6500,fs=rate,output='sos'),x)
    fade_in=min(round(.006*rate),len(x)//2);fade_out=min(round(.06*rate),len(x)//2)
    x[:fade_in]*=np.linspace(0,1,fade_in);x[-fade_out:]*=np.linspace(1,0,fade_out)
    active=x[np.abs(x)>.003]
    if not len(active):raise ValueError(f'Silent mix {cue}')
    normalization=min(.085/float(np.sqrt(np.mean(active**2))),.5/float(np.max(np.abs(x))))
    x*=normalization
    master=root/f'assets/audio/{cue}.wav';sf.write(master,x,rate,subtype='PCM_16')
    fallback=root/f'public/audio/{cue}.wav';fallback.write_bytes(master.read_bytes())
    ogg=root/f'public/audio/{cue}.ogg';sf.write(ogg,x,rate,format='OGG',subtype='VORBIS')
    entries[cue]=dict(material=material,author='Project arrangement of Kenney/Thimras recordings',license='CC0-1.0',sources=sources,master=str(master.relative_to(root)),masterSha256=hashlib.sha256(master.read_bytes()).hexdigest(),oggSha256=hashlib.sha256(ogg.read_bytes()).hexdigest(),fallbackSha256=hashlib.sha256(fallback.read_bytes()).hexdigest(),duration=duration,sampleRate=rate,peak=float(np.max(np.abs(x))),activeRms=float(np.sqrt(np.mean(x[np.abs(x)>.003]**2))),normalization=normalization,processing='Recorded-material layers; antialiased mono resample24k; DC removal;6.5kHz 2-pole low-pass;6ms onset/60ms tail fades; active RMS .085/peakcap .5; PCM16 master+fallback and Vorbis; no noise synthesis',listeningVerified=False)
provenance=dict(status='Activated by user; final rendered quality not independently listened',entries=entries)
(root/'assets/sources/audio-identity/material-effects.json').write_text(json.dumps(provenance,indent=2)+'\n')
path=root/'public/audio/manifest.json';manifest=json.loads(path.read_text())
for name,entry in entries.items():manifest['entries'][name]=dict(ogg=f'audio/{name}.ogg',fallback=f'audio/{name}.wav',master=entry['master'],duration=entry['duration'],loop=False,volume=1,author=entry['author'],license=entry['license'],provenance='assets/sources/audio-identity/material-effects.json#'+name)
manifest['origin']='Original music/UI/wildlife; licensed CC0 recorded-material gameplay effects. See assets/ASSET_LICENSE.md.'
path.write_text(json.dumps(manifest,indent=2)+'\n')
print(f'Exported {len(entries)} licensed material effects into the existing local SFX lane.')
