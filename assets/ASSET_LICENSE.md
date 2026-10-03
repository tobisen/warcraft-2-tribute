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
