"""Offline neural timbre conversion of ORIGINAL dialogue, not pitch-only edits.

Optional authoring dependency OpenVoice V2 (MIT) in an external checkout.
First generate-unit-voices.py, then this converter, then export-voice-manifest.py.
Models/tools never enter the browser bundle. Dwarf-derived output stays BY-SA.
"""
from pathlib import Path
import argparse, hashlib, json, sys, time
import numpy as np
import soundfile as sf
import librosa
import torch

p=argparse.ArgumentParser()
p.add_argument('--checkout',type=Path,required=True)
p.add_argument('--model-dir',type=Path,required=True)
p.add_argument('--base-dir',type=Path,required=True)
p.add_argument('--pilot',action='store_true')
args=p.parse_args()
sys.path.insert(0,str(args.checkout))
from openvoice import utils
from openvoice.models import SynthesizerTrn
from openvoice.mel_processing import spectrogram_torch
torch.set_num_threads(4)
root=Path(__file__).resolve().parent.parent
manifest=root/'assets/sources/audio-identity/all-factions-voices.json'
data=json.loads(manifest.read_text())
h=utils.get_hparams_from_file(str(args.model_dir/'config.json'))
model=SynthesizerTrn(0,h.data.filter_length//2+1,n_speakers=0,**h.model).eval()
# Only the reviewed official checkpoint, loaded with PyTorch's restricted reader.
weights=torch.load(args.model_dir/'checkpoint.pth',map_location='cpu',weights_only=True)
result=model.load_state_dict(weights['model'],strict=False)
if result.missing_keys or result.unexpected_keys:raise ValueError(result)
rate=h.data.sampling_rate
refs={
 'clans':('Tim Rockk','orc-voice',['originals/tim-rockk/i_expected_better.wav','originals/tim-rockk/die_human_scum.wav'],'CC0-1.0'),
 'elves':('Hydroque','elf-from-dragnor',['originals/character-tones/elf-dragnor.ogg'],'CC0-1.0'),
 'dwarves':('MaximB','drunk-dwarf-voice-pack',['originals/character-tones/dwarf-greetings-1.ogg','originals/character-tones/dwarf-attack-1.ogg'],'CC-BY-SA-3.0'),
 'goblins':('artisticdude','goblins-sound-pack',['originals/character-tones/goblin-1.wav','originals/character-tones/goblin-3.wav','originals/character-tones/goblin-12.wav'],'CC0-1.0'),
}
def spec(path):
    y=librosa.load(str(path),sr=rate)[0]
    if len(y)<2048:raise ValueError(f'Reference too short: {path}')
    return spectrogram_torch(torch.from_numpy(y).unsqueeze(0),h.data.filter_length,rate,h.data.hop_length,h.data.win_length,center=False)
def embedding(paths):
    with torch.no_grad():return torch.stack([model.ref_enc(spec(path).transpose(1,2)).unsqueeze(-1) for path in paths]).mean(0)
directory=root/'assets/sources/audio-identity'
targets={f:embedding([directory/path for path in paths]) for f,(_,_,paths,_) in refs.items()}
source_embeddings={f:embedding([args.base_dir/f'{f}-worker-selection-01.wav',args.base_dir/f'{f}-soldier-move-01.wav',args.base_dir/f'{f}-archer-attack-01.wav']) for f in refs}
sha=lambda path:hashlib.sha256(path.read_bytes()).hexdigest()
provenance={'model':'OpenVoice V2 converter','modelSource':'https://huggingface.co/myshell-ai/OpenVoiceV2','modelLicense':'MIT','checkpointSha256':sha(args.model_dir/'checkpoint.pth'),'configSha256':sha(args.model_dir/'config.json'),'toolCommit':(args.checkout/'.git/shallow').read_text().strip(),'references':{},'entries':{},'listeningVerified':False}
for f,(author,slug,paths,license) in refs.items():
    provenance['references'][f]=dict(author=author,source='https://opengameart.org/content/'+slug,license=license,files=[dict(path=str((directory/path).relative_to(root)),sha256=sha(directory/path)) for path in paths])
out=root/'assets/audio/voices'
start=time.monotonic()
for e in data['entries']:
    f=e['faction']
    if f not in refs or args.pilot and not(e['role']=='worker' and e['action']=='selection' and e['id'].endswith('-01')):continue
    src=args.base_dir/f"{e['id']}.wav"
    s=spec(src)
    torch.manual_seed(2057+int(e['id'][-2:]))
    with torch.no_grad():x=model.voice_conversion(s,torch.LongTensor([s.size(-1)]),sid_src=source_embeddings[f],sid_tgt=targets[f],tau=.3)[0][0,0].numpy()
    if not np.isfinite(x).all():raise ValueError(f'Nonfinite conversion {e["id"]}')
    x=x.astype(np.float64);x-=x.mean()
    active=x[np.abs(x)>.004]
    if not len(active):raise ValueError(f'Silent conversion {e["id"]}')
    fade=min(round(.008*rate),len(x)//2)
    x[:fade]*=np.linspace(0,1,fade);x[-fade:]*=np.linspace(1,0,fade)
    gain=min(.13/float(np.sqrt(np.mean(active**2))),.6/float(np.max(np.abs(x))))
    x*=gain;x=np.concatenate([np.zeros(round(.02*rate)),x,np.zeros(round(.03*rate))])
    target=out/f"{e['id']}.wav";sf.write(target,x,rate,subtype='PCM_16')
    reference=provenance['references'][f]
    e.update(author=f"Project original dialogue/Kokoro base; neural tone derived from {reference['author']}",source=f"{reference['source']}; OpenVoiceV2 MIT https://huggingface.co/myshell-ai/OpenVoiceV2; Kokoro Apache-2.0 https://huggingface.co/hexgrad/Kokoro-82M",license=reference['license'],processing='Offline Kokoro original speech + OpenVoiceV2 learned reference-timbre conversion; no pitch shifting; DC removal;8ms fades; active speech RMS .13/peakcap .6;20/30ms margins;mono PCM16 22050Hz',listeningVerified=False)
    provenance['entries'][e['id']]=dict(baseSha256=sha(src),outputSha256=sha(target),peak=float(np.max(np.abs(x))),duration=len(x)/rate,rate=rate,gain=gain,reference=f,text=e['text'],listeningVerified=False)
    print(f"Converted {e['id']} {len(x)/rate:.2f}s",flush=True)
if not args.pilot:
    data['status']='Local recorded AI dialogue with licensed character timbres; activated by user; final listening unverified'
    manifest.write_text(json.dumps(data,indent=2)+'\n')
(directory/('converted-pilot.json' if args.pilot else 'converted-voices.json')).write_text(json.dumps(provenance,indent=2)+'\n')
print(f'Converted {len(provenance["entries"])} clips in {time.monotonic()-start:.1f}s; no auditory-quality claim.',flush=True)
