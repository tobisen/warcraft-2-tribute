"""Original composed fantasy miniature and synthesized effects, deterministic PCM masters.
Optional export tooling only: python3 + soundfile (libsndfile/Vorbis), no runtime dependency.
"""
from pathlib import Path
import math, random, wave, struct, json, sys
try:
 import soundfile as sf
except ImportError:
 raise SystemExit('Audio export requires optional Python soundfile; install into a temporary environment (see assets/README.md).')
root=Path(__file__).resolve().parent.parent
master=root/'assets/audio';out=root/'public/audio';master.mkdir(exist_ok=True);out.mkdir(exist_ok=True)
rate=24000
noise=random.Random(2056)
def hz(note):return 440*2**((note-69)/12)
def music(t):
 beat=2/3;notes=[62,65,69,67,65,62,60,62,69,72,74,72,69,67,65,62,60,64,67,69,65,64,62,57]
 n=int(t/beat)%24;phase=(t%beat)/beat;f=hz(notes[n]);mel=(math.sin(2*math.pi*f*t)+.22*math.sin(4*math.pi*f*t))*.13*math.sin(math.pi*phase)**.65
 chord=[50,46,53,48,55,50][n//4];pad=sum(math.sin(2*math.pi*hz(chord+x)*t) for x in [0,7,12])*.035
 drum=math.sin(2*math.pi*(65-30*phase)*t)*math.exp(-phase*24)*.055
 return (mel+pad+drum)*min(1,t/.1,(16-t)/.1)
def sample(kind,t,duration):
 env=math.sin(math.pi*t/duration)*math.exp(-t*4)
 if kind=='melee':return (noise.uniform(-1,1)*.35*math.exp(-t*25)+sum(math.sin(2*math.pi*f*t) for f in [730,1137,1720])*.075)*env
 if kind=='bow':return (noise.uniform(-1,1)*.18*math.exp(-t*10)+math.sin(2*math.pi*(980-1300*t)*t)*.13)*env
 if kind=='siege':return (noise.uniform(-1,1)*.14+math.sin(2*math.pi*(180-110*t)*t)*.26+math.sin(2*math.pi*510*t)*.06)*env
 if kind=='buildingHit':return (noise.uniform(-1,1)*.4+math.sin(2*math.pi*85*t)*.26)*env
 if kind=='cannon':return (noise.uniform(-1,1)*.25+math.sin(2*math.pi*(95-70*t)*t)*.45)*env
 if kind=='splash':return noise.uniform(-1,1)*.28*env+math.sin(2*math.pi*(220-180*t)*t)*.09*env
 if kind=='gather':return (math.sin(2*math.pi*680*t)*.12+noise.uniform(-1,1)*.08)*env
 if kind=='build':return (math.sin(2*math.pi*260*t)*.2+noise.uniform(-1,1)*.12)*env
 if kind=='train':return sum(math.sin(2*math.pi*hz(n)*t) for n in [69,74])*env*.09
 if kind=='command':return math.sin(2*math.pi*(480+900*t)*t)*env*.16
 if kind=='impact':return (noise.uniform(-1,1)*.3+math.sin(2*math.pi*170*t)*.2)*env
 if kind=='complete':return sum(math.sin(2*math.pi*hz(n)*t) for n in [74,77,81])*.09*env
 if kind=='victory':return sum(math.sin(2*math.pi*hz(n)*t) for n in [62,66,69,74])*.075*env
 return sum(math.sin(2*math.pi*hz(n)*t) for n in [38,41,44])*.085*env
entries={}
for kind,duration in [('music',16),('command',.14),('impact',.18),('complete',.5),('victory',1),('defeat',1),('cannon',.4),('splash',.5),('gather',.12),('build',.16),('train',.35),('melee',.22),('bow',.2),('siege',.5),('buildingHit',.38)]:
 samples=[max(-.85,min(.85,music(n/rate) if kind=='music' else sample(kind,n/rate,duration))) for n in range(round(duration*rate))]
 data=b''.join(struct.pack('<h',round(v*32767)) for v in samples)
 unchanged=(master/f'{kind}.wav').exists() and (master/f'{kind}.wav').read_bytes()[44:]==data
 for path in [master/f'{kind}.wav',out/f'{kind}.wav']:
  with wave.open(str(path),'wb') as f:f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(data)
 if not unchanged or not (out/f'{kind}.ogg').exists():sf.write(str(out/f'{kind}.ogg'),samples,rate,format='OGG',subtype='VORBIS')
 entries[kind]={'ogg':f'audio/{kind}.ogg','fallback':f'audio/{kind}.wav','master':f'assets/audio/{kind}.wav','duration':duration,'loop':kind=='music','volume':1}
(out/'manifest.json').write_text(json.dumps({'version':1,'origin':'Original deterministic composition/synthesis in scripts/export-audio.py; no external recordings','sampleRate':rate,'entries':entries},indent=2)+'\n')
print('Exported fifteen original PCM WAV masters + Vorbis OGG/WAV runtime alternatives.')
