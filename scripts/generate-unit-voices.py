"""Offline asset authoring only. No model or synthesis engine is shipped to players.

python generate-unit-voices.py --model-dir /temporary/model --pilot
python generate-unit-voices.py --model-dir /temporary/model
Dependencies: kokoro-onnx==0.6.1, numpy==2.5.3, soundfile==0.14.0.
"""
from pathlib import Path
import argparse, hashlib, json, math, time
import numpy as np
import soundfile as sf
import onnxruntime as ort
ort.disable_telemetry_events()
from kokoro_onnx import Kokoro

parser=argparse.ArgumentParser()
parser.add_argument('--model-dir',type=Path,required=True)
parser.add_argument('--pilot',action='store_true')
args=parser.parse_args()
root=Path(__file__).resolve().parent.parent
source=root/'assets/sources/audio-identity/all-factions-voices.json'
data=json.loads(source.read_text())
model=args.model_dir/'kokoro-v1.0.onnx';styles=args.model_dir/'voices-v1.0.bin'
model_hash=hashlib.sha256(model.read_bytes()).hexdigest()
styles_hash=hashlib.sha256(styles.read_bytes()).hexdigest()
cast={
 'crown':{'voice':'bm_george','lang':'en-gb','speed':1.04,'direction':'Professional British English; measured, dry delivery'},
 'clans':{'voice':'am_fenrir','lang':'en-us','speed':.94,'direction':'Weighty direct American English; blunt literal phrases'},
 'elves':{'voice':'bf_emma','lang':'en-gb','speed':1.0,'direction':'Composed British English; precise, assured phrases'},
 'dwarves':{'voice':'bm_fable','lang':'en-gb','speed':.97,'direction':'Grounded British English; terse craft/mining phrases'},
 'goblins':{'voice':'am_puck','lang':'en-us','speed':1.12,'direction':'Brisk American English; excited sales/prototype phrasing'},
}
# Direction is an authoring brief, not a claim that this fixed-voice model obeys emotional prompts.
engine=Kokoro(str(model),str(styles))
master=root/'assets/audio/voices';master.mkdir(parents=True,exist_ok=True)
provenance_path=root/'assets/sources/audio-identity/generated-voices.json'
provenance=json.loads(provenance_path.read_text()) if provenance_path.exists() else {'entries':{}}
provenance.update({'model':'Kokoro-82M v1.0','modelSource':'https://huggingface.co/hexgrad/Kokoro-82M',
 'modelLicense':'Apache-2.0','modelSha256':model_hash,'voiceStylesSha256':styles_hash,
 'modelDownload':'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/kokoro-v1.0.onnx',
 'voiceStylesDownload':'https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.1/voices-v1.0.bin',
 'tool':'kokoro-onnx 0.6.1 (MIT), numpy 2.5.3, soundfile 0.14.0','cast':cast,
 'outputLicense':'CC0-1.0, project-generated audio; model license remains Apache-2.0',
 'listeningVerified':False})
selected=[e for e in data['entries'] if not args.pilot or (e['faction'] in ['crown','clans'] and e['role']=='worker' and e['action'] in ['selection','move','attack','gather','humor'] and e['id'].endswith('-01'))]
start=time.monotonic()
for index,e in enumerate(selected,1):
 target=master/f"{e['id']}.wav";profile=cast[e['faction']]
 speed=profile['speed']*({'worker':1,'soldier':.98,'archer':1.03}[e['role']])
 identity={'text':e['text'],'voice':profile['voice'],'lang':profile['lang'],'speed':speed,
  'modelSha256':model_hash,'stylesSha256':styles_hash,'processingVersion':1}
 old=provenance['entries'].get(e['id'])
 if not (target.exists() and old and old.get('identity')==identity and hashlib.sha256(target.read_bytes()).hexdigest()==old.get('sha256')):
  samples,rate=engine.create(e['text'],voice=profile['voice'],speed=speed,lang=profile['lang'])
  samples=np.asarray(samples,dtype=np.float64)
  if len(samples)<round(.15*rate) or not np.isfinite(samples).all():raise RuntimeError(f"Invalid voice output: {e['id']}")
  active=np.flatnonzero(np.abs(samples)>.004)
  if not len(active):raise RuntimeError(f"Silent voice output: {e['id']}")
  # Keep margins around speech; never crop tightly at the first consonant.
  samples=samples[max(0,int(active[0])-round(.04*rate)):min(len(samples),int(active[-1])+round(.06*rate)+1)]
  samples-=samples.mean()
  fade=min(round(.008*rate),len(samples)//2)
  ramp=np.linspace(0,1,fade);samples[:fade]*=ramp;samples[-fade:]*=ramp[::-1]
  speech=samples[np.abs(samples)>.004]
  rms=math.sqrt(float(np.mean(speech**2)));peak=float(np.max(np.abs(samples)))
  gain=min(.13/rms,.75/peak)
  samples*=gain
  samples=np.concatenate([np.zeros(round(.02*rate)),samples,np.zeros(round(.03*rate))])
  sf.write(target,samples,rate,subtype='PCM_16')
  provenance['entries'][e['id']]={'identity':identity,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),
   'master':str(target.relative_to(root)),'duration':len(samples)/rate,'sampleRate':rate,
   'peak':float(np.max(np.abs(samples))),'speechRmsBeforeGain':rms,'gain':gain,'listeningVerified':False}
 e.update({'recording':f"audio/voices/{e['id']}.wav",'author':'warcraft-2-tribute project, AI audio authored locally with Kokoro/hexgrad',
  'source':f"https://huggingface.co/hexgrad/Kokoro-82M; voice={profile['voice']}; modelSha256={model_hash}",
  'license':'CC0-1.0 (project-generated output); Apache-2.0 (Kokoro model)',
  'processing':f"Neural offline synthesis, {profile['voice']}, {profile['lang']}, speed {speed:.4f}; speech-RMS target .13/peakcap .75; DC removal; 8ms fades; 20/30ms silence margins; mono PCM16 24kHz. No pitch shifting.",
  'listeningVerified':False})
 # Checkpoint after each clip; resume without repeating completed expensive inference.
 source.write_text(json.dumps(data,indent=2)+'\n')
 provenance_path.write_text(json.dumps(provenance,indent=2)+'\n')
 print(f"{index}/{len(selected)} {e['id']} {provenance['entries'][e['id']]['duration']:.2f}s",flush=True)
data['status']='Local AI-generated recordings; actual listening unverified; not human performances'
source.write_text(json.dumps(data,indent=2)+'\n')
print(f'Finished {len(selected)} selected recordings in {time.monotonic()-start:.1f}s; actual listening NOT performed.',flush=True)
