# Originalassets och användning

Aktuell ljudleverans2026-10-07:315 egna neuralgenererade engelska repliker,
med fri Kokoro/OpenVoice authoring och licensierade karaktärsreferenser.
63 dvärgderivat CC-BY-SA-3.0 (MaximB); övriga nya röstoutputs CC0 med
modellnotices separat. 13 materialeffektfamiljer använder Kenney/Thimras CC0.
[Per-assetmanifest och bearbetningar](sources/audio-identity/README.md) och
[distribuerade credits](../public/audio/credits.html) är aktuella.
Inga Blizzard-, Soundsnap- eller prenumerationsljud har importerats.
Äldre ursprungsbeskrivningar nedan avser historiska exporter.


Projektets pixelkällor, exporter och syntetiserade ljud är framställda för
användning, ändring och distribution med warcraft-2-tribute. Ingen extern
spelgrafik, ljudinspelning eller originalspel-sprite har importerats.
Detta dokument ändrar inte projektets övergripande kodlicens. Ovanstående
originalursprung avser den tidigare leveransen; nya externa Foley-prov nedan
har separata CC0-villkor.

Sjöassets: [sources/naval.mjs](sources/naval.mjs) och hamnkompositionen i
[sources/buildings.mjs](sources/buildings.mjs); gemensam [palette.json](palette.json).
Kanon/sjunkljud: [export-audio.py](../scripts/export-audio.py), med PCM-masters
i assets/audio och OGG/WAV-exporter i public/audio. Övriga originalkällor
och tekniska exportvillkor finns i [README.md](README.md). Ingen extern
attribution tillkommer för denna etapp.

RTS-111: gräs-/vattenvarianter, kusthörn och nya skogs-/gruvdetaljer är egna repo-lokala pixelkompositioner i assets/sources/world.mjs. Samma användningsvillkor gäller; inga externa rasterbilder eller attributioner tillkommer.

RTS-112: byggnadsdetaljer och damaged-varianter är originalkompositioner i assets/sources/buildings.mjs, samma projektvillkor. Ingen extern spelgrafik, röst eller font importerad.

RTS-113: utrustningsdetaljer, riktade poser, kanonrekyl, bog och gångvak i assets/sources/units.mjs och naval.mjs är egna originalpixelkompositioner. Samma villkor för ändring/distribution, ingen extern attribution.

RTS-114: sparse impact/splash/dust i assets/sources/ui.mjs och riktade pixelprimitiver i presentation/effects.ts är originalgrafik i projektpaletten. Samma tillåtna användning/ändring/distribution; inga externa bilder eller ljud.

RTS-117: gather/build/train är egna deterministiskt syntetiserade ljud från
scripts/export-audio.py; WAV-masters och OGG/WAV-runtimeassets följer samma
projektvillkor. Inga externa inspelningar, enhetsröster eller attributioner.

RTS-118: config/voices.ts innehåller egna originaltextrepliker. Inga inspelade
röstassets finns eller distribueras. Browser/OS tillhandahåller eventuell
lokal speech voice; projektet kopierar eller licensierar inte dess röstmodell.

RTS-126: [home-fantasy-126 provenance](sources/home-fantasy-126.md) redovisar
projektgenererad originalillustration med inbyggt imagegen och utan externa
referensbilder. Full PNG-master och JPEG-export finns i repot. Ingen extern
spelfil, röstinspelning eller tredjepartsreferens har importerats. Övriga
assetvillkor och ljudkällor ovan är oförändrade.

RTS-136: Human Banner Guard med fana, guldrustning och sköld är en egen originalpixelkomposition i sources/units.mjs. Samma projektvillkor gäller källan och exporterna; ingen Warcraft-grafik, extern bild, röst eller annan attribution tillkommer.

RTS-137: Orc Raider/tvåyxor/lätt rustning i sources/units.mjs är egen originalpixelkomposition och följer samma projektvillkor. Ingen extern spelgrafik eller inspelning har importerats.

RTS-138: Elf leaf-/bow-/ballista-, root/canopy/garden/workshop- och naval-kompositioner i sources/units.mjs, buildings.mjs och naval.mjs är egna originalpixelkällor/exporter med samma projektvillkor. Inga externa bilder, sprites eller inspelningar importerade.

RTS-139: Dwarf beard/armor/crossbow/cannon-, stonevault/foundry- och ironclad/ferrybilder i sources/units.mjs, buildings.mjs och naval.mjs är egna originalpixelkompositioner med samma projektvillkor. Ingen extern spelgrafik, rasterreferens eller inspelning tillförd.

RTS-140: Goblin goggles/scrap/slingshot/grenade/mortar-, patchwork-tin/lab- och junkfleet-kompositioner i sources/units.mjs, buildings.mjs och naval.mjs är egna originalpixelkällor/exporter med samma projektvillkor. Inga externa rasterbilder, spelsprites eller inspelningar tillförda.


RTS-155-korrigering: Human-worker/soldier/base i [sources/humans.mjs](sources/humans.mjs)
är egna integer-pixelkompositioner enligt projektvillkoren. Användarens befintliga
lokala stilreferenser har granskats, men inga illustrationscrops eller externa
spel-spritefiler har importerats i atlaserna. [Protokollet](sources/humans.md)
skiljer underlag, skapade assets, export och faktisk visuell verifiering.

RTS-155 fraktionspass: faction-people.mjs och faction-bases.mjs är originalkompositioner i integer-pixel-kod, baserade på användarens lokala stilreferenser (identifierade/hashade i sources/faction-references.md). Referensillustrationerna är inte importerade, nedskalade eller beskurna in i runtime-atlaserna. Goblins följer teknikerreferensen enligt uttrycklig instruktion; fraktionsnamnet behålls.

RTS-155 slutligt landreferenspass: [roster-complete.mjs](sources/roster-complete.mjs) och [settlement-complete.mjs](sources/settlement-complete.mjs) är egna integer-pixelkompositioner enligt projektvillkoren. De lokala referenserna används som stilunderlag, inte importerade rastercrops. [Provenance/mapping](sources/complete-references.md) och auditen redovisar källor/exporter.


RTS-157: melee/bow/siege/buildingHit är egna deterministiska synteskompositioner i scripts/export-audio.py enligt samma projektvillkor. Ingen extern Foley- eller röstinspelning används.


RTS-159: hjort/kanin/räv och stock/svamp/gräsdetaljer i sources/wildlife.mjs är original integer-pixelkompositioner enligt projektvillkoren. Ingen extern djurbild eller spelasset importerad.

PRIO-04: djurlätena i scripts/export-wildlife-audio.py är egna deterministiska
synteskompositioner, med PCM-masters/runtime-WAV och separat wildlife-manifest.
Samma projektvillkor för användning, ändring och distribution gäller. Inga
externa inspelningar, kommersiella ljudeffekter eller attributioner tillkommer.
Faktisk provlyssning redovisas separat från fil- och uppspelningskontroller.

RTS-205: [resources-205.png](sources/visual-refresh/resources-205.png) är
projektgenererad originalgrafik med inbyggt imagegen och faktisk alpha.
Prompt och exporter dokumenteras i [provenance](sources/visual-refresh/README.md).
Inga externa spelassets har importerats; samma projektvillkor gäller.

RTS-205 inkluderar även [fortifications-205.png](sources/visual-refresh/fortifications-205.png),
projektgenererad originalgrafik för fem fraktioners academy/wall/gate med
inbyggt imagegen. Samma villkor och provenance gäller.

Ljudidentitetsprov 2026-10-06: Kenney / Impact Sounds, CC0-1.0.
Tre original-OGG och arkivets licens i [audio-identity](sources/audio-identity/README.md).
Varje fil har källa, upphovsperson, licens, bearbetning och hashes i
[provmanifestet](../artifacts/audio-identity/manifest.json). Inga runtimeassets
ersatta. Det historiska84-replikers Human/Orc-provet och det nya gemensamma
315-replikers femrasmanuset är egna textunderlag enligt projektvillkoren;
2026-10-07 finns315 lokalt AI-genererade kandidatmasters, med tio aktiva
pilotklipp i public/audio/voices. Per-asset upphov, modell/källa, licens,
bearbetning och hash finns i källmanifesten i audio-identity.

Kokoro-82M (hexgrad/rzvzn) är Apache-2.0; kokoro-onnx (Ivan/thewh1teagle)
är MIT. Modeller/bibliotek ingår inte i distributionen. Projektets nya
ljudoutput erbjuds under CC0-1.0 i den mån projektet innehar rättigheterna;
modellens licens är skild från outputvillkoren. [Notis](sources/audio-identity/licenses/GENERATED-AUDIO.txt),
[Apache-2.0](sources/audio-identity/licenses/Kokoro-Apache-2.0.txt),
[MIT](sources/audio-identity/licenses/kokoro-onnx-MIT.txt) och
[modellkort](sources/audio-identity/licenses/Kokoro-model-card.md) bevaras.
Ingen OS-röstmodell kopieras och browser-TTS-fallback är borttagen.

Kenney RPG Audio: CC0-1.0, upphov Kenney; originalen chop, handleCoins,
clothBelt, knifeSlice, creak1 och doorClose_1 samt arkivets licens finns i
sources/audio-identity/originals/rpg. Källa: https://kenney.nl/assets/rpg-audio.
Dessa är ännu oanvända kandidater; production-SFX är inte ersatta.

Revision2: ytterligare fem Kenney Impact Sounds-original (CC0-1.0):
impactMetal_light_000, impactMetal_heavy_002, impactPunch_heavy_000,
impactPlank_medium_000, impactWood_light_001. Källa/upphov/hash och alla
lager/bearbetningar anges per kandidat i
[revisionmanifestet](../artifacts/audio-identity/revision-2/manifest.json).
Nya AI-röstjämförelser använder samma Kokoro/outputnotiser ovan.
Inga Wowhead/Blizzard- eller Epidemic-ljud importerade. Referenslicenser:
[Blizzard Legal FAQ](https://www.blizzard.com/en-us/legal/28d5ebbf-c245-4408-8ba9-043dd5f056bf/legal-faq),
[Epidemic licenskrav](https://help.epidemicsound.com/hc/en-us/articles/26194113349010-Is-Epidemic-Sound-s-music-available-for-free).

Inläst Orc-jämförelse2026-10-07: Tim Rockk, CC0-1.0, källa
https://opengameart.org/content/orc-voice. Original i_expected_better.wav och
die_human_scum.wav finns i sources/audio-identity/originals/tim-rockk.
[Per-assetlicens/källa/hash/bearbetning](../artifacts/audio-identity/acted-orc/manifest.json).
Detta är författarens repliker för framförandejämförelse, inte färdigt
projektmanus/röstpaket. Inga Warcraft Wiki/fondlez/Pixabay-ljud importerade.

Karaktärstonjämförelser2026-10-07:
- MaximB, Drunk Dwarf Voice Pack, vald licens CC-BY-SA3.0. Tre original och
  mono/nivå/fade-bearbetningar distribueras under samma licens. Attribution
  och licenslänk finns även på lyssningssidan; [licenstext](sources/audio-identity/licenses/CC-BY-SA-3.0.txt).
- artisticdude, Goblins Sound Pack, CC0-1.0: goblin-1/3/12.
- xathien, Steampunk Fantasy Voices, CC0-1.0: Minion_Sword_001,
  Archer_Taunt_001, Archer_Attack_001.
- Hydroque, Elf From Dragnor, CC0-1.0: Remember_The_Elf_From_Dragnor.

Alla källor/downloads/original- och exporthashar, upphov och bearbetning per
fil i [manifestet](../artifacts/audio-identity/character-tones/manifest.json).
Original i sources/audio-identity/originals/character-tones. Kandidater, inte
kompletta paket; inga Soundsnap-assets importerade eller abonnemang startade.
