# RTS-060 – Releasekontroller, 2026-10-02

## Profil och metod

Budget fastställd före mätning i [DECISIONS.md](DECISIONS.md). macOS 15.7.4 arm64, Node 20.20.0/npm 10.8.2, headless Chromium 147.0.7727.15. Native worldviewport 800×600 i desktop 1280×900 och staplad 1024×768. Chromium är enda verifierade browsermotor; mobil/Firefox/WebKit ingår inte i godkänd profil. Mätningarna gäller denna maskin, inte alla spelarens datorer.

## Scenarier

Alla rader vann med legal kommandostrategi och delta 0,05 s: vanlig startstock, upptäckta resursnoder, arbetare/leverans, betald barracks/produktion, synliga attackmål. Ingen injicerad ekonomi, HP, units eller fiendekunskap. Matrisen kördes som gameplay-integrationstester och i browser med accelererad modell/rendering. Browserns DOM valde varje mode/profil och kontrollerade terminal save/load och restart. Detta ersätter inte naturlig UI-speltid; fem sådana Normal-flöden redovisas under tabellen. Varje matrisrad inkluderar pause/save-roundtrip vid 45 s, resursledger, terminal freeze och fresh restart.

| Scenario | Easy, sekunder | Normal, sekunder | Hard, sekunder |
| --- | ---: | ---: | ---: |
| Wave-survival | 146,45 | 122,10 | 121,70 |
| Skirmish | 94,75 | 97,70 | 131,50 |
| Skogsvakten | 146,20 | 121,85 | 113,10 |
| Belägringen | 78,05 | 77,65 | 94,70 |
| Utposten | 90,00 | 90,00 | 90,00 |

Basen hade 240 HP kvar i samtliga slutliga matrisrader. Förbrukning var 120 wood/20 gold (barracks + fyra soldiers), utom Hard Skirmish 100/15. Resterande wood/gold i noder, saldo, last och lostCargo summerade exakt till starttotal minus kostnader. Första strategiversionerna förlorade vid oskyddad gold och tidigt splittrat anfall; wood-first och samlade anfall klarade alla profiler utan balansändringar.

Naturliga UI-playthroughs utan injicerad gameplay-state i RTS-057/058: Normal Skirmish 104,69 s; Survival 128,50 s; Skogsvakten 129,29 s; Belägringen 88,32 s; Utposten 90 s. RTS-059 verifierade naturlig gathering → bygge + workerjob → pause/save/reload/load → exakt en spawn → archer → faktisk projektil → save/reload/load → resume/restart. Ingen full naturlig Easy/Hard UI-match påstås genomförd.

## Produktionsbrowser och budget

Lokal dist under `/warcraft-2-tribute/`, inga root-assetanrop, 404 eller runtimefel. Canvas, selection/move, pause/save/reload/load, tio DOM-restarts och båda viewportarna godkända. Alla sex ljudassets avkodades som både OGG och WAV; tidigare kontroll omfattade verkliga AudioContext-gains/mute, gesture unlock, pause/resume och fallback. Akustisk lyssning utfördes inte i headless browser.

Belastningsfixtures är uttryckligen separat från betald playthrough: 23 egna soldiers + 12 enemies vid målbelastning, därefter 64 egna soldiers. Fem sekunder/ungefär 300 samples per fall, scene pre/post-update inklusive HUD-sync och RAF-intervall. En enskild route/frame kan vara långsammare än p95; maxvärde redovisas. Tio resetcykler mättes med CDP HeapProfiler.collectGarbage/Runtime.getHeapUsage; detta är JS heap, inte total process/GPU-minne.

| Mått | Budget | Uppmätt målbelastning | 64-unit-stress |
| --- | ---: | ---: | ---: |
| Update CPU p95 | ≤16,7 ms | 3,20 ms | 4,00 ms |
| RAF-intervall p95 | ≤33,4 ms | 17,20 ms | 17,20 ms |
| Update CPU max (ingen maxbudget) | – | 48,10 ms | 10,00 ms |
| JS heap efter GC | ≤128 MiB | 9,33 MiB | 10,16 MiB |
| Heapförändring, tio restarts | ≤16 MiB | 8,70 → 9,58 MiB (+0,88) | – |
| Minifierad JS | ≤1,7 MB | 1,505 MB | – |
| Gzip JS | ≤450 KB | 394,71 KB | – |
| Total dist | ≤5 MB | 3 232 KiB på disk | – |

Vites varning över 500 kB kvarstår. Den ryms i fastställd budget och åtgärdas inte genom split/refaktor i denna körning.

## Checks och granskning

- Ren kopia utan node_modules/dist/.git: npm ci (49 packages, audit 0 vulnerabilities), 457 tester/60 filer, typecheck och build godkända.
- Befintligt repo: samma tester/typecheck/build och git diff --check; nya 15 regressioner gäller beteende, ingen spegeltest av bootstrap eller dokumentation.
- Validerade 90 unika task-ID:n, bevarade historiska tasktexter, acykliska beroenden och lokala filreferenser. RTS-001–060 Done; RTS-061–090 Todo.
- Granskning: base/asset/export-paths, kostnad/referenser/visibility i matrisstrategi, save-status över resume/restart, workflowpermissions och deploymentsubpath. Inga kvarstående blockerande fynd; ingen ändring av gameplaybalans eller scope.
- Egna atlaser, originalkällor och ljudlicens/proveniens beskrivs i [assets/README.md](assets/README.md). Screenshots av ekonomi, bas, combat och de två releaseviewportarna granskade.

## Publicering och kvarstående begränsningar

Pages ingår i godkännandet efter lokala checks. Workflow kör npm ci/test/typecheck/build, officiella pinade actions och separat deploy-job med pages/id-token-behörigheter. Trigger push main/workflow_dispatch; concurrency undviker samtidiga publiceringar. Publiceringsresultat/länk anges i [DEV_LOG.md](DEV_LOG.md) efter faktisk push; lokal verifiering är inte påstående om genomförd publicering.

En handgjord arena, enkel AI, begränsad separat gruppnavigation utan collision avoidance. Endast desktop Chromium verifierat; ingen akustisk lyssning, andra engines/mobil, multiplayer eller backend. Save schema/config 1 utan migration, en origin-local slot som inte delas mellan localhost och Pages. Nya fraktionsnamn/förmågor/balans är öppna framtidsbeslut. Nästa implementerbara task är RTS-061, men ingen task efter RTS-060 implementeras i denna körning.
