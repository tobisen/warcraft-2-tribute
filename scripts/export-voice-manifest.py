"""Export the shared five-faction recording manifest; never fabricate missing voices.

Local PCM masters, when provided, live in assets/audio/voices/<id>.wav.
No network, TTS, model installation or runtime dependency.
"""
from pathlib import Path
import json
import argparse
import wave

parser=argparse.ArgumentParser()
parser.add_argument('--pilot',action='store_true',help='Activate only ten Human/Orc worker clips for the required listening gate.')
args=parser.parse_args()
root = Path(__file__).resolve().parent.parent
source = root / 'assets/sources/audio-identity/all-factions-voices.json'
data = json.loads(source.read_text())
entries = [dict(e) for e in data['entries']]
if args.pilot:
    for e in entries:
        selected=e['faction'] in ['crown','clans'] and e['role']=='worker' and e['action'] in ['selection','move','attack','gather','humor'] and e['id'].endswith('-01')
        if not selected:
            for key in ['recording','author','source','license','processing']: e[key]=None
            e['listeningVerified']=False
factions = ['crown', 'clans', 'elves', 'dwarves', 'goblins']
roles = ['worker', 'soldier', 'archer']
actions = ['selection', 'move', 'attack', 'gather', 'ready', 'error', 'humor']
expected = {f'{f}-{r}-{a}-{i:02}' for f in factions for r in roles for a in actions for i in range(1, 4)}
if len(entries) != len(expected) or {e['id'] for e in entries} != expected:
    raise SystemExit('Expected exactly 315 unique five-faction/role/action recording slots.')
output = root / 'public/audio/voices'
output.mkdir(parents=True, exist_ok=True)
recordings = []
for e in entries:
    if not isinstance(e['text'], str) or not e['text'].strip():
        raise SystemExit(f"Missing original dialogue: {e['id']}")
    if e['recording'] is None:
        if e['listeningVerified'] or e['license'] is not None:
            raise SystemExit(f"Missing recording cannot be licensed/listened: {e['id']}")
        continue
    if e['recording'] != f"audio/voices/{e['id']}.wav":
        raise SystemExit(f"Non-local or mismatched recording: {e['id']}")
    if not all(isinstance(e.get(k), str) and e[k].strip() for k in ['author', 'source', 'license', 'processing']):
        raise SystemExit(f"Missing provenance: {e['id']}")
    master = root / 'assets' / e['recording']
    with wave.open(str(master)) as wav:
        if wav.getnchannels() != 1 or wav.getsampwidth() != 2:
            raise SystemExit(f"Expected mono PCM16 master: {e['id']}")
    recordings.append((master, output / master.name))
# Validate every recording before changing any runtime file.
for master, destination in recordings:
    destination.write_bytes(master.read_bytes())
(output / 'manifest.json').write_text(json.dumps({'version': 1, 'entries': entries}, indent=2) + '\n')
for license_name in ['CC-BY-SA-3.0.txt','CC0-1.0.txt','GENERATED-AUDIO.txt']:
    (output/license_name).write_bytes((source.parent/'licenses'/license_name).read_bytes())
print(f'Exported {len(entries)} script entries; {len(recordings)} local voice WAVs, {len(entries)-len(recordings)} explicitly missing.')
