# Fem rasers lokala ljudpaket

315 aktiva egna engelska repliker, tre roller, sju actions och tre varianter.
Runtime: `public/audio/voices/manifest.json`; masters: `assets/audio/voices`.
[Manus och per-assetcredits](all-factions-voices.json),
[basgenerering](generated-voices.json), [slutkonvertering](converted-voices.json),
[13 materialeffekters lager/credits](material-effects.json).

Gratis offline authoring: `scripts/generate-unit-voices.py` använder Kokoro
(Apache-2.0-modell, MIT-verktyg); `scripts/convert-character-voices.py` använder
OpenVoice V2 (MIT) med separata rasreferenser. Modeller och Pythonmiljö ingår
inte i webbspelet. Basgenereringens hashes avser intermediärer; slutliga
icke-Human-masters är konverterade och verifieras mot converted-voices.json.
`npm run audio:export` exporterar lokala runtimefiler och licensnotices.
Ingen browser-TTS, ingen pitch-only-raskopia och inga externa ljudanrop.

Orc: Tim Rockk CC0; Elf: Hydroque CC0; Goblin: artisticdude CC0;
Dwarf: MaximB CC-BY-SA-3.0 (samtliga63 egna bearbetningar behåller licensen).
Kenney och Thimras materialeffekter CC0. Sparade licenstexter har normaliserade radslut/avslutande whitespace; villkoren är oförändrade.
Fulla originalkällor, upphov, licenser,
bearbetningar och SHA256 redovisas per asset i manifesten ovan.
[Distribuerade credits](../../../public/audio/credits.html).

[Lyssningssida för slutversionen](../../../artifacts/audio-identity/final/index.html).
Fem faktisk-match-PCM-captures använder slutliga lokala filer och slutmixens
kompressor; peak under0.436, ingen teknisk klippning. Detta bevisar inte hörbar
kvalitet. Slutversionen är **inte faktiskt provlyssnad** av agenten.
Användarens tidigare tonacceptans gäller riktningen. Inga nya mänskliga
röstinspelningar påstås; alla egna slutrepliker är neuralgenererade.

## Historiska prov och beslut — ersatta av status ovan

## Godkänd Orc-ton och nya inlästa rasprov2026-10-07

Användaren godkänner Tim Rockks Orc-ton. [Tio nya rasjämförelser](../../../artifacts/audio-identity/character-tones/index.html)
finns med samma Orc som riktmärke. Per-asset [proveniens](../../../artifacts/audio-identity/character-tones/manifest.json)
och [exportscript](../../../scripts/export-character-tones.py).
MaximBs dvärgprov är CC-BY-SA3.0 och bearbetningar behåller licensen;
artisticdude Goblin, xathien Minion/Archer och Hydroque Elf är CC0.
Detta är författarnas inlästa kandidater, ej projektets egna fulla paket.
Elf/gnome/dvärgton ej lyssningsgodkänd ännu. Goblins-identitet bevarad;
fråga ställd om användarens gnomes avser röstkaraktär eller faktiskt rasbyte.

## Ny källgranskning och inläst Orc-jämförelse2026-10-07

Prov2 är bättre men inte kvalitetsgodkänt av användaren. En separat
[CC0-inläst Orc-jämförelse](../../../artifacts/audio-identity/acted-orc/index.html)
av Tim Rockk finns lokalt med [per-assetlicens/källa/bearbetning](../../../artifacts/audio-identity/acted-orc/manifest.json).
Författarens repliker, inte egna projekttexter; ingen röstkloning eller
produktionsaktivering. Warcraft Wiki svarade403 för kategorin; fondlez är
filnamnslistor, inte ljud; Pixabay kräver per-assetkälla och kontroll av
standalone-distributionsförbud mot publik assetrepo. Inga ljud från dessa
referenser importerade. Alla fem rasers slutliga framförande återstår.

## Ljudprov2 — tidigare pilot underkänd2026-10-07

Användaren underkänner brus/sprak, melee/build och otillräcklig raskaraktär.
Ingen kvalitetsgodkänd pilot/femrasspridning. Ny [lyssningssida](../../../artifacts/audio-identity/revision-2/index.html)
med nio CC0-effektkandidater, fem rasers nya rösttexter (tre Orc-presets) och
två direkt PCM-fångade matchmixar finns. [Exportscript](../../../scripts/export-audio-revision.py)
och [per-assetproveniens](../../../artifacts/audio-identity/revision-2/manifest.json).
Modellen kan inte styra growlande acting; jämförelseprov, ej färdig Orc.
Matchcaptures PASS tekniskt med peak0.222/0.226 och0pageerrors; ej provlyssnade.
Tidigare beskrivning nedan är historik för första provet. Produktionsfiler
förblir tio äldre pilotklipp; inga nya effekter spridda till vanliga matcher.

# Ljudidentitet för fem raser — 2026-10-07

**In Progress: 315 verkliga lokalt AI-genererade kandidat-WAVs finns nu.
Pilotens faktiska lyssning återstår; endast tio Human/Orc-provrepliker är
aktiva. Ingen färdig kvalitetsgranskning, commit/push eller release hävdas.**
Användarens uppföljning omfattar alla fem raser; kart-/batch2arbete fortsätter
vara pausat.

## Manus och gemensam mappning

[all-factions-voices.json](all-factions-voices.json) är den gemensamma källan:
Human/crown, Orcs/clans, Elves, Dwarves, Goblins × worker/melee/ranged ×
selection/move/attack/gather/ready/error/humor × tre egna repliker = **315**.
Det är självständiga repliker per ras/roll, inte en generisk mening med ett
raspåhäng. Gather för stridsenheter betyder skydd av arbetet, inte en ny
resursförmåga. Samtliga315 har nu lokal recording, upphov/källa/licens/bearbetning;
listeningVerified är fortfarande false. [Genereringsproveniens](generated-voices.json)
redovisar modell-/röstdatahashes, röstval, tempo, mätvärden och hash per WAV.

Human: plikt och torr kontors-/soldathumor. Orc: burdus, ivrig och bokstavlig.
Elves: eleganta, självsäkra och lätt nedlåtande. Dwarves: korthuggna, envisa,
gruv-/hantverkshumor. Goblins: snabba, övermodiga uppfinnare och försäljare av
riskabla prototyper. Femte rasen följer [repot](../../../src/config/factions.ts).

[pilot-voices.json](pilot-voices.json) bevarar det första två-rassprovet med 84
Human/Orc-worker/soldierrepliker. Det är historiskt underlag; all-factions är
nu den kanoniska källan. Alla fem scripts förbereds utan att sprida oprövade
ljudfiler. Särskilda specialist/siege/naval/air-inspelningar ingår ännu inte.

## Implementerad teknisk kanal

[GameAudio](../../../src/presentation/audio.ts) återanvänder appens befintliga
AudioContext, gesture-unlock, lokala assets, mute, volymer, pause och reset.
[UnitVoices](../../../src/presentation/voices.ts) spelar lokala WAV-inspelningar
på en egen Voice-gain; ingen browser-TTS, pitchvariering eller kö. Saknade
röstfiler är tysta och UI visar `Unit voices unavailable`.
[Konfiguration](../../../src/config/voices.ts) validerar lokal inspelningsväg
mot ID och kräver deklarerad proveniens. Licensens rättigheter måste dessutom
verifieras vid assetimport; en godtycklig manifeststräng bevisar inte dessa.

[voicePolicy](../../../src/presentation/voicePolicy.ts) väljer en representativ
spelarenhet för grupporder. Uttrycklig unitfaction används framför spelarens
standardras. Oförändrade/blockerade order blir inte accepterade orderrepliker.
En röst i taget, 1.2s global cooldown och variantrotation per ras/roll/action.
Humor kräver var sjätte klick inom samma selectionserie, 15% slump och minst
45s sedan senast spelad humor. Saknad humor kan falla tillbaka till vanlig
selection. Röster fördröjer aldrig gameplayorder.

SFX dämpas till 45% av sin inställda nivå medan en röst spelas. Voice beror
på master/Voice/mute och fungerar även med SFX=0; Music är separat. Ändrad
Voice/master/mute avbryter aktiv röst. Pause, menu, game over och reset stoppar
röstkällor och rensar relevant historik. Sena ended-callbacks kan inte störa en
ny källa. Ready väljer en ny egen enhet per snapshot; initial/load/paused
snapshots är tysta. Error är kopplat till misslyckad ändrad blockerad order
eller misslyckad faktisk byggplacering. Inga gameplayregler ändras.

[Exportverktyget](../../../scripts/export-voice-manifest.py) skriver
[det lokala manifestet](../../../public/audio/voices/manifest.json). Kör
`python3 scripts/export-voice-manifest.py`. När röstunderlag finns: en mono
PCM16-master per ID i assets/audio/voices, deklarerad recording-väg
`audio/voices/<id>.wav`, upphov/källa/licens/bearbetning och ärlig lyssningsstatus
per asset i källmanifestet. Exporten kräver samtliga 315 slots men tillåter
explicit saknade inspelningar. `python3 scripts/export-voice-manifest.py --pilot`
aktiverar enbart tio Human/Orc-workerklipp för lyssningsgrinden; runtime
redovisar därför305 ännu ej aktiverade klipp trots315 färdiga kandidatmasters.
Full export utan `--pilot` görs efter pilotens kvalitetsgranskning.
Inga runtimeanrop till externa ljudtjänster tillkommer.

## Tre lokala effektprov

| Prov | Kenney-original | Material | WAV |
| --- | --- | --- | --- |
| melee | impactMetal_medium_000.ogg | vapenkontakt/metall | [metall](../../../artifacts/audio-identity/melee.wav) |
| build | impactWood_medium_000.ogg | byggande/träkontakt | [trä](../../../artifacts/audio-identity/build.wav) |
| mining | impactMining_002.ogg | hacka/stenkontakt | [gruvdrift](../../../artifacts/audio-identity/mining.wav) |

Upphovsperson **Kenney**; källa [Impact Sounds](https://kenney.nl/assets/impact-sounds),
**CC0-1.0**. Källsidan och [arkivets License.txt](originals/License.txt)
verifierade 2026-10-06. [CC0](https://creativecommons.org/publicdomain/zero/1.0/)
medger bearbetning och offentlig/kommersiell distribution. Original-OGG finns
lokalt i originals; inga externa ljudanrop under spel.

[Effektexport](../../../scripts/export-audio-pilot.py) använder samma valfria
soundfile-dependency som befintlig export: `python3 scripts/export-audio-pilot.py`.
Mono, försiktigt 5.5kHz lågpass, 5ms ändpunktsfades, RMS .05 med peaktak .65,
PCM16 WAV. [Manifest](../../../artifacts/audio-identity/manifest.json) redovisar
källa/upphov/licens/bearbetning/hashes/mätvärden per asset. Slutpeak
.3654/.4074/.6318; RMS .05 för alla tre. Gemensam RMS är ett tekniskt
startvärde, inte bevis för jämn upplevd ljudstyrka. Ingen production-SFX ersatt.
Vapen/projektiler/avverkning/skatt/byggnadsdestruktion utöver provet återstår.

## Röstunderlag och kvalitetsgrind

Användaren godkände ”kostnadsfria AI genererade tack” 2026-10-07. Kokoro-82M
v1.0 kördes lokalt med kokoro-onnx0.6.1, numpy2.5.3, soundfile0.14.0 i en
tillfällig Python3.12-miljö. Ingen modell, phonemizer eller Pythondependency
skickas till spelaren; inga abonnemang eller API-kostnader.

| Ras | Släppt röstpreset | Språk/grundtempo | Hörbart kandidatprov |
| --- | --- | --- | --- |
| Human | bm_george | en-gb/1.04 | [Human](../../../artifacts/audio-identity/preview-crown.wav) |
| Orc | am_fenrir | en-us/.94 | [Orc](../../../artifacts/audio-identity/preview-clans.wav) |
| Elves | bf_emma | en-gb/1.00 | [Elves](../../../artifacts/audio-identity/preview-elves.wav) |
| Dwarves | bm_fable | en-gb/.97 | [Dwarves](../../../artifacts/audio-identity/preview-dwarves.wav) |
| Goblins | am_puck | en-us/1.12 | [Goblins](../../../artifacts/audio-identity/preview-goblins.wav) |

Varje ras har sin egen röstembedding och självständiga repliker, inte
pitchändring av samma inspelning. Rolltempo modifieras med1/.98/1.03 för
worker/soldier/archer. Detta ger skilda röster/texter/tempo, men övertygande
fantasyskådespeleri och humorframförande kan inte bevisas genom filanalys.
Modellens fasta presets använder inga externa personreferensinspelningar.

[Generator](../../../scripts/generate-unit-voices.py):
`python3 scripts/generate-unit-voices.py --model-dir <modellkatalog> --pilot`
för tio klipp; utan `--pilot` skapas315 kandidater. Modeller ligger utanför
repot. Scriptet checkpointar och återanvänder identiska hashsäkrade resultat.
DC tas bort; tystnad trimmas med40/60ms marginaler,8ms fades och20/30ms
ändmarginaler. Aktiv-tal-RMS-mål .13 med peaktak .75, mono PCM16/24kHz.
Ingen hård limiter eller pitchshift.315 unika SHA256, inga helt tysta eller
clippade filer, nolländpunkter; längd .791–4.5265s. Generering179.8s.

Licens/ursprung: [officiell modellkälla](https://huggingface.co/hexgrad/Kokoro-82M)
och [kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx) anger Apache-2.0
för modellen, MIT för exportbiblioteket. Dessa är modell-/verktygslicenser,
inte ett påstående att varje syntetiskt output automatiskt blir Apache.
Projektets nya genererade ljud tillgängliggörs under **CC0-1.0** i den mån
projektet innehar rättigheter; modell-/verktygslicenserna består. Se
[outputvillkor](licenses/GENERATED-AUDIO.txt), [CC0](licenses/CC0-1.0.txt),
[Apache](licenses/Kokoro-Apache-2.0.txt), [MIT](licenses/kokoro-onnx-MIT.txt) och
[officiell modellkortskopia](licenses/Kokoro-model-card.md). Modellutgivare
hexgrad/rzvzn; verktygsupphov Ivan/thewh1teagle. Exakta nedladdningskällor och
bytehashes finns i generated-voices.json; ingen modell omlicensieras eller
distribueras. Modellkortets CC BY-träningsacknowledgements (Koniwa/SIWIS)
bevaras som provenance, inga originalinspelningar därifrån importerades.

Det lilla två-rassprovet gjordes först (10 klipp/5.2s generering). Faktiska
[Human-matchklippet](../../../artifacts/audio-identity/pilot-crown-match.wav) och
[Orc-matchklippet](../../../artifacts/audio-identity/pilot-clans-match.wav) är
fångade från matchens verkliga Voice/SFX-graf under löpande combatfixtur,
med presentationstriggade workerrepliker och metall/träprov i grafen.
MediaRecorder/Opus återexporterades till WAV för granskning; det är inte en
bitidentisk master. Mixpeak .361/.372, inga pageerrors.
[Protokoll](../../../artifacts/audio-identity/pilot-capture.json). **Ingen faktisk
lyssning utförd.** Kvalitetsfråga med klippen ställd till användaren, ännu inget
svar. Övriga305 masters förberedda som kandidater, inte spridda i aktivt
paket. Kandidatproven per ras är separata sex-klippsplaylists, inte matchlyssning.

[Tim Rockks CC0 Orc-röster](https://opengameart.org/content/orc-voice) har andra
färdiga repliker och täcker inte detta manus; inget importerades. Wowhead och
Epidemic används inte som assets. Nästa steg är faktisk Human/Orc-matchlyssning, justering efter feedback och
därefter full aktivering av de fem kandidatpaketen. Manus och
routing för alla fem är redan förberedda; oprövad ljudkvalitet sprids inte.

Automatiska routing/cooldown/mixertester och tysta browserfixturer verifierar
teknik. De får aldrig räknas som hörbara röster eller kvalitetsgodkännande.
Faktisk provlyssning, taltydlighet under strid och fem riktiga rasers ljudpaket
är **ej verifierade**.

Ny verifiering: riktade21/5 PASS426ms, slutlig unit484/88 PASS13.60s,
build inklusive strict typecheck PASS/Vite400ms med befintlig bundlevarning.
Historisk kontroll2026-10-06: export/source/runtimeparitet315 slots/0 inspelningar, scriptsyntax, diff och
lokala dokumentreferenser kontrolleras. [Chromiumprotokoll](../../../artifacts/audio-identity/browser-routing.json):
fem raser, fysisk selection/grupporder/snabbklick, Voice/SFX-mix, mute,
volym och pause/reset med tysta in-memorybuffertar. Det provar inte faktiska
voice-WAV-laddningar eller hörbar kvalitet. Harnessens tidiga canvas/phase/
AudioParam-getterfel och navigationstimeout räknas inte som PASS.
[Browserverktyget](../../../scripts/check-voice-routing.mjs) behöver samma
externa playwright-core/Chrome som befintliga browserchecks, ingen ny
projektdependency. Ange W2T_PLAYWRIGHT_MODULE/W2T_BROWSER_EXECUTABLE vid behov.

Ny teknisk kandidatkontroll2026-10-07:21/5 riktade tester PASS558ms; alla315
PCM/hashes/headroom/tystnadsgränser PASS. [Femras-browser](../../../artifacts/audio-identity/real-voice-routing.json)
läser riktiga315 WAV-masters via lokala kandidatfil-/manifestroutes och
verifierar decoding, fysisk selection/grupporder/klickspam, mixer/mute/volym/
pause och fysisk scene-restart med bevarad graf/volym. Ingen tyst mockbuffer
används i detta protokoll; actual listening är fortfarande false.
[Verktyg](../../../scripts/check-recorded-voices.mjs). Historiska tysta
fixturer ovan är separata belägg, inte dagens voice-fileloading.

Ytterligare sex Kenney/RPG Audio CC0-original är förberedda i
originals/rpg: chop, handleCoins, clothBelt, knifeSlice, creak1, doorClose_1.
[Källan](https://kenney.nl/assets/rpg-audio) och [arkivlicensen](originals/rpg/License.txt)
verifierade. Inga production-SFX-byten/materialrouting hävdas; dessa återstår
efter det lilla provets kvalitetsgrind.
