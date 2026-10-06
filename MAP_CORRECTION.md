# Kart-/HUD-korrigering 2026-10-06

A: `4bd5737`. B: kartregioner/AI. C: knappar/slutchecks.

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

Färdväg mäts från tredje startworker till huvudbasens kontaktkant med faktisk landnavigation. Islands/Coast har separat verifierad vattenrutt 720,432→880,432 och nåbar östlig landväg 960,480→basen; en komplett sammanvägd transporttid hävdas inte. Baserna är utanför startvision. Arena/Forest är mindre introduktionskartor; övriga är4096². Uttryckliga guard/wave/hold/escort/rescue-mål behåller sina briefingpunkter. `siege-test` är en historisk utvecklingsfixture; äldre laddade sparningar behåller gammal geometri.

AI använder befintlig betald utpost (80wood/20gold,10s workerbyggande), lokala ändliga skogar/minor och byggytor. Produktion/gathering/försvar använder färdig utpost; huvudbasens förlust avslutar inte matchen medan utposten lever. Normal första dispatch får90s extra ekonomitid; explicit kampanjvågtryck är oförändrat. Naturlig economic/Normal Frontier-utpost byggdes vid80.5s med ursprunglig bank; detta är en accelererad teknisk kontroll, inte mänsklig balans. Pointer vid kartkant flyttar inte kameran; pilar/minikarta/mittknappsdrag fungerar. Save64 bevarar layout;4MB/200000-noder behövs för dense/multiplayer-fog.

## Bilder och verifiering

[Frontier före](artifacts/map-correction/part-B/before-frontier.png) · [efter](artifacts/map-correction/part-B/after-frontier.png) · [berg](artifacts/map-correction/after-A-mountain.png) · [AI-utpost](artifacts/map-correction/part-B/paid-ai-expansion.png). Alla nio före/efterbilder och faktiska vägdata: [maps.json](artifacts/map-correction/part-B/maps.json). Browserens betalda byggande/avverkning/öppnad mark/kamera/AI: [gameplay.json](artifacts/map-correction/part-B/gameplay.json). Artöversikter använder explicit full fog; humanbyggande använder bankfixture. AI-ekonomin har inga gratisresurser.

B: mapRegions/campaignSeries/campaignPhases40 tester PASS; senare mapRegions/enemyNaval17/2 PASS. Unit475/85 PASS15.96s; strict build PASS400ms. Historiska positions-/finite-budgettester använder uttryckliga classic-fixtures; nya layouttester kontrollerar alla starter, nåbara resurser, baser och Save. Befintlig bundlevarning kvarstår. Full regression efter C.
