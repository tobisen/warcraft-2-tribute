# Originalassets och användning

Projektets pixelkällor, exporter och syntetiserade ljud är framställda för
användning, ändring och distribution med warcraft-2-tribute. Ingen extern
spelgrafik, ljudinspelning eller originalspel-sprite har importerats.
Detta dokument ändrar inte projektets övergripande kodlicens.

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
