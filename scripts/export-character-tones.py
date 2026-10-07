"""Export licensed acted comparisons. No production mapping or pitch shifting."""
from pathlib import Path
import hashlib, html, json
import numpy as np
import soundfile as sf

root=Path(__file__).resolve().parent.parent
out=root/'artifacts/audio-identity/character-tones'
out.mkdir(parents=True,exist_ok=True)
originals=root/'assets/sources/audio-identity/originals/character-tones'
specs=[
 ('dwarves','dwarf-greetings-1.ogg','MaximB','drunk-dwarf-voice-pack','CC-BY-SA-3.0','https://opengameart.org/sites/default/files/drunk-dwarf-pack.zip','greetings-1.ogg'),
 ('dwarves','dwarf-attack-1.ogg','MaximB','drunk-dwarf-voice-pack','CC-BY-SA-3.0','https://opengameart.org/sites/default/files/drunk-dwarf-pack.zip','attack-1.ogg'),
 ('dwarves','dwarf-crazy-1.ogg','MaximB','drunk-dwarf-voice-pack','CC-BY-SA-3.0','https://opengameart.org/sites/default/files/drunk-dwarf-pack.zip','crazy-1.ogg'),
 ('goblins','goblin-1.wav','artisticdude','goblins-sound-pack','CC0-1.0','https://opengameart.org/sites/default/files/goblins_0.zip','goblins/goblin-1.wav'),
 ('goblins','goblin-3.wav','artisticdude','goblins-sound-pack','CC0-1.0','https://opengameart.org/sites/default/files/goblins_0.zip','goblins/goblin-3.wav'),
 ('goblins','goblin-12.wav','artisticdude','goblins-sound-pack','CC0-1.0','https://opengameart.org/sites/default/files/goblins_0.zip','goblins/goblin-12.wav'),
 ('goblins','Minion_Sword_001.wav','xathien','steampunk-fantasy-voices','CC0-1.0','https://opengameart.org/sites/default/files/Minion_Sword_001.wav',None),
 ('elves','elf-dragnor.ogg','Hydroque','elf-from-dragnor','CC0-1.0','https://opengameart.org/sites/default/files/Remember_The_Elf_From_Dragnor.ogg',None),
 ('elves','Archer_Taunt_001.wav','xathien','steampunk-fantasy-voices','CC0-1.0','https://opengameart.org/sites/default/files/Archer_Taunt_001.wav',None),
 ('elves','Archer_Attack_001.wav','xathien','steampunk-fantasy-voices','CC0-1.0','https://opengameart.org/sites/default/files/Archer_Attack_001.wav',None),
]
entries=[]
for faction,name,author,slug,license,download,archive_member in specs:
    original=originals/name
    x,rate=sf.read(original,always_2d=True)
    x=x.mean(axis=1);x-=x.mean()
    active=x[np.abs(x)>.004]
    if not len(active):raise ValueError(f'Silent source: {name}')
    fade=min(round(rate*.008),len(x)//2)
    x[:fade]*=np.linspace(0,1,fade);x[-fade:]*=np.linspace(1,0,fade)
    gain=min(.085/float(np.sqrt(np.mean(active**2))),.45/float(np.max(np.abs(x))))
    x*=gain
    target=out/(Path(name).stem+'.wav');sf.write(target,x,rate,subtype='PCM_16')
    entries.append(dict(faction=faction,id=target.stem,author=author,source='https://opengameart.org/content/'+slug,download=download,archiveMember=archive_member,license=license,licenseUrl='https://creativecommons.org/'+('licenses/by-sa/3.0/' if license=='CC-BY-SA-3.0' else 'publicdomain/zero/1.0/'),original=str(original.relative_to(root)),originalSha256=hashlib.sha256(original.read_bytes()).hexdigest(),output=str(target.relative_to(root)),sha256=hashlib.sha256(target.read_bytes()).hexdigest(),sampleRate=rate,duration=len(x)/rate,peak=float(np.max(np.abs(x))),gain=gain,processing='Mono downmix; original sample rate; DC removal;8ms fades; active RMS .085/peakcap .45;PCM16; no pitch/formant shift',listeningVerified=False,dialogue='Original author performance; no transcription or project-action coverage verified'))
(out/'manifest.json').write_text(json.dumps(dict(status='Acted comparison candidates, not complete packs; Orc tone approved separately',entries=entries),indent=2)+'\n')
page='''<!doctype html><html lang="sv"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Karaktärsröster – jämförelse</title><style>body{font:18px system-ui;max-width:760px;margin:35px auto;padding:20px;background:#182024;color:#eee}audio{display:block;width:100%;margin:12px 0 25px}a{color:#a6d9fc}h2{margin-top:35px}small{display:block}</style><h1>Karaktärsröster – jämförelse</h1><p>Inlästa fria kandidatprov, inte färdiga röstpaket. Dvärg: jordnära och barsk. Goblin/gnome-riktning: nasal, snabb och uppfinnaraktig. Elf: elegant, säker och lätt nedlåtande. Etiketterna anger önskad riktning; kandidaternas faktiska ton behöver bedömas genom lyssning. Archer är en möjlig alternativ röst, inte uttryckligen inspelad som Elf.</p><h2>Orc – godkänd ton</h2><audio controls preload="none" src="../acted-orc/i_expected_better.wav"></audio>'''
for faction,label in [('dwarves','Dvärg – MaximB'),('goblins','Goblin / gnome-inspiration'),('elves','Elf – jämförelsekandidater')]:
    page+='<h2>'+label+'</h2>'
    for e in entries:
        if e['faction']!=faction:continue
        page+='<label>'+html.escape(e['id'])+'</label><small><a href="'+e['source']+'">'+html.escape(e['author'])+'</a> · <a href="'+e['licenseUrl']+'">'+e['license']+'</a> · bearbetat: mono, nivåjustering, DC-borttagning, ändtoningar</small><audio controls preload="none" src="'+e['id']+'.wav"></audio>'
page+='''<p>Dvärgoriginal och bearbetade versioner: CC-BY-SA 3.0. Övriga: CC0. Inga prov är mappade till vanliga matcher. Ingen röstkloning eller pitchvariation av Orc-inspelningen.</p></html>'''
(out/'index.html').write_text(page)
print(f'Exported {len(entries)} acted character-tone comparisons; listening unverified.')
