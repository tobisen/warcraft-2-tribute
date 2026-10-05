"""Original deterministic stylized woodland calls; no samples or recordings imported."""
from pathlib import Path
import math,struct,wave,json
root=Path(__file__).resolve().parent.parent
rate=24000
for kind,duration in [('deer',.65),('rabbit',.22),('fox',.4)]:
    data=[]
    for i in range(round(duration*rate)):
        t=i/rate;u=t/duration
        if kind=='deer':
            f=260+70*math.sin(math.pi*u)+18*math.sin(2*math.pi*17*t)
            signal=sum(math.sin(2*math.pi*f*t*n)/n for n in [1,2,3,4,5])*.12
            env=math.sin(math.pi*u)**.6
        elif kind=='rabbit':
            f=1500-550*u
            signal=(math.sin(2*math.pi*f*t)+.3*math.sin(2*math.pi*2*f*t))*.14
            env=math.sin(math.pi*u)**1.5
        else:
            f=440-220*u
            signal=sum(math.sin(2*math.pi*f*t*n)/n for n in [1,2,3,5,7])*.17
            env=math.sin(math.pi*u)*math.exp(-4*u)
        data.append(round(max(-.8,min(.8,signal*env))*32767))
    for folder in ['assets/audio','public/audio']:
        path=root/folder/f'animal-{kind}.wav';path.parent.mkdir(exist_ok=True)
        with wave.open(str(path),'wb') as file:
            file.setnchannels(1);file.setsampwidth(2);file.setframerate(rate);file.writeframes(b''.join(struct.pack('<h',v) for v in data))

manifest={'version':1,'origin':'Original deterministic synthesized animal calls; no imported recordings','source':'scripts/export-wildlife-audio.py','entries':{kind:{'file':f'audio/animal-{kind}.wav','master':f'assets/audio/animal-{kind}.wav','duration':duration,'rate':rate,'channels':1,'bits':16} for kind,duration in [('deer',.65),('rabbit',.22),('fox',.4)]}}
(root/'public/audio/wildlife-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
