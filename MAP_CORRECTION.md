# Kart-/HUD-korrigering 2026-10-06

A: `4bd5737`. B: `509fb79`. C: färdig, knappar och samlad slutverifiering.

Tidigare bifogade Warcraft II-kartbilder saknas i projektet och har inte granskats. Dokumenterad Battle.net River Fork har hämtats och granskats; egna pixelpenslar används. Berg/skog/kust har mer volym/övergångar, men resultatet är fortfarande enklare och mer regelbundet än originalets målade kvalitet.

## Kartinventering

Alla nio kartor använder samma terrängatlas och konturregler. Fem kampanjserier använder åtta uppdrag var (40 starter/Save kontrollerade av campaignSeries.test).

| Karta | Storlek | Nåbar landväg före → efter, px | Kampanj i varje serie |
|---|---|---|---|
| arena | 2048×2048 | 464 → 1790 | first-steps |
| forest | 3072×3072 | 464 → 3320 | Skirmish |
| river | 4096×4096 | 464 → 5919 | Skirmish |
| islands | 4096×4096 | transport krävs → transport krävs | the-crossing |
| frontier | 4096×4096 | 979 → 4817 | forest-watch, the-outpost, valley-rescue |
| plains96 | 4096×4096 | 464 → 5197 | Skirmish |
| plains128 | 4096×4096 | 464 → 4654 | Skirmish |
| highlands | 4096×4096 | 2421 → 3066 | the-siege, ridge-convoy |
| coast | 4096×4096 | transport krävs → transport krävs | coastal-banner |

Standalone Tutorial/Survival/waves/base/outpost använder Arena, Sea Islands, Escort Highlands, Rescue Frontier och Capture Coast; samma terrängkod gäller.

Färdväg mäts från tredje startworker till huvudbasens kontaktkant med faktisk landnavigation. Islands/Coast har separat verifierad vattenrutt 720,432→880,432 och uppmätt östlig landväg 960,480→basen: Islands272→2250px, Coast272→2057px ([naval-paths.json](artifacts/map-correction/part-C/naval-paths.json)); en komplett sammanvägd transporttid hävdas inte. Baserna är utanför startvision. Arena/Forest är mindre introduktionskartor; övriga är4096². Uttryckliga guard/wave/hold/escort/rescue-mål behåller sina briefingpunkter. `siege-test` är en historisk utvecklingsfixture; äldre laddade sparningar behåller gammal geometri.

AI använder befintlig betald utpost (80wood/20gold,10s workerbyggande), lokala ändliga skogar/minor och byggytor. Produktion/gathering/försvar använder färdig utpost; huvudbasens förlust avslutar inte matchen medan utposten lever. Normal första dispatch får90s extra ekonomitid; explicit kampanjvågtryck är oförändrat. Naturlig economic/Normal Frontier-utpost byggdes vid80.5s med ursprunglig bank; detta är en accelererad teknisk kontroll, inte mänsklig balans. Pointer vid kartkant flyttar inte kameran; pilar/minikarta/mittknappsdrag fungerar. Save64 bevarar layout;4MB/200000-noder behövs för dense/multiplayer-fog.

## Bilder och verifiering

[Frontier faktisk grafik före A](artifacts/map-correction/before-overview.png) · [efter](artifacts/map-correction/part-B/after-frontier.png) · [berg](artifacts/map-correction/after-A-mountain.png) · [AI-utpost](artifacts/map-correction/part-B/paid-ai-expansion.png). Alla nio före/efterbilder och faktiska vägdata: [maps.json](artifacts/map-correction/part-B/maps.json). Browserens betalda byggande/avverkning/öppnad mark/kamera/AI: [gameplay.json](artifacts/map-correction/part-B/gameplay.json). B:s before-bilder rekonstruerar gammal geografi med den gemensamma nya atlasen/HUD; faktisk grafik före A länkas separat. Artöversikter använder explicit full fog; humanbyggande använder bankfixture. AI-ekonomin har inga gratisresurser.

B: mapRegions/campaignSeries/campaignPhases40 tester PASS; senare mapRegions/enemyNaval17/2 PASS. Unit475/85 PASS15.96s; strict build PASS400ms. Historiska positions-/finite-budgettester använder uttryckliga classic-fixtures; nya layouttester kontrollerar alla starter, nåbara resurser, baser och Save. Befintlig bundlevarning kvarstår. Full regression1603/188 PASS efter C.

## C: native-knappar

44×44 klickytor och36px ikoner vid800; breda kontextknappar64×64 med40px ikoner och kortnamn. Befintliga individuella byggnads-/unit-/researchbilder återanvänds. Selectionpanelen begränsas till240px; huvudpanelerna ligger bredvid varandra. Tooltip behåller kostnad/hotkey/krav, disabled-ikoner har högre synlighet. Ingen ändring av användarens style.css.

Native800×600 och3440×1440 faktisk browser PASS: nio byggknappar,44px-gräns, två/en rad, tooltip, fysisk farmknapp utan genomsläppt worldorder, tre betalda workerjobb med44px cancelkontroller, fem Barracks-trainactions, inga errors. Bilder visuellt granskade: [800 byggande](artifacts/map-correction/part-C/build-800.png), [3440 byggande](artifacts/map-correction/part-C/build-3440.png), [800 kö](artifacts/map-correction/part-C/queue-800.png), [800 army](artifacts/map-correction/part-C/army-800.png). [Browsermått](artifacts/map-correction/part-C/browser.json).

Slutreview hittade sjö-AI-hamnens nya avstånd: en riktig worker söker nu hamnplatsen innan betalt byggande. Riktade Islands/Coast-scenarier bygger hamnen med ursprunglig bank inom180s och Savevaliderar; naval dispatch får också90s extra. MapRegions14 PASS8.83s. Fullregressionens historiska finite-budget releasecontroller använder explicit classic-layout, medan nya region-/kampanjstarter kontrolleras separat. Första samlade kontrollen avbröts efter upptäckten av den gamla controllerns fasta anfallspunkt; Den kompletta felsökande körningen gav1397PASS/205FAIL (188filer,639.36s). Felen var fasta historiska positioner/budget-/deadlinefixtures samt verkliga fynd: blockerad vågspawn, gamla resurstotaler i matchStats, oåtkomliga fyndplatser och ändrade organic63-regler. Dessa är rättade; assertions kvarstår och gamla positionskontroller använder uttrycklig classic-layout. Slutlig full körning1603/188 PASS551.00s.

Utpostens naturliga betalda armé försvarar ett explicit spelarhot inom faktisk teamfog, både med huvudbasen kvar och efter dess förlust: [outpost-defense.json](artifacts/map-correction/part-C/outpost-defense.json). Fyndplatser väljs per sparad design; nya positioner är initialt dolda/kroppsgiltiga, äldre kartor behåller originalen. Save63 Frontier-terrain/resurs-ID:n/basposition testade separat. Nya art-/gameplay-/knappbrowserkontroller omkörda efter geometrierättningar, PASS; oförändrad bildstilgranskning återanvänds med aktuell Frontier-/800bild kontroll.

Riktade slutsystem: component147/15, metadata149/7, discoveries/organic/mapRegions24/3 och verklig kampanjquality8/1 PASS. Final unit475/85 PASS20.92s; build inklusive strict typecheck PASS425ms. Befintlig bundlevarning. Browserkontroller är tekniska belägg, inga mänskliga tempo-/balans-/ljudclaims. Den ursprungliga CI-timeoutkorrigeringen370cf02 har faktiskt grönt [GitHub-resultat](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37506597746); det bevisar inte kartkorrigeringens nya CI.

Fysisk workerutforskning till den flyttade Frontier-rekryten, båda engångsbelöningarna och Save/load PASS vid800/1280 utan errors: [fyndbrowser](artifacts/map-correction/part-C/discoveries/browser.json). Ingen fog-/bankfixture används i denna kontroll.

Egen slutreview av geometri, faktisk navigation, AI-ekonomi/utpost/defense, objectives, design-/versionsberoende Save/fynd/stats och HUD/input utan kvarstående blockerande kodfynd. git diff --check, manifest85unit+103integration, scriptsyntax och15 dokumentreferenser PASS. Endast docs ändras efter slutliga kodkontroller. A/B/C avslutas; inga nya roadmaptasks. Ny C-CI/Pages rapporteras separat.
