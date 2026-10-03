# RTS-060 – Releasekontroller, 2026-10-02

## Profil och metod

Budget fastställd före mätning i [DECISIONS.md](DECISIONS.md). macOS 15.7.4 arm64, Node 20.20.0/npm 10.8.2, headless Chromium 147.0.7727.15. Native worldviewport 800×600 i desktop 1280×900 och staplad 1024×768. Chromium är enda verifierade browsermotor; mobil/Firefox/WebKit ingår inte i godkänd profil. Mätningarna gäller denna maskin, inte alla spelarens datorer.

## Scenarier

Alla rader vann med legal kommandostrategi och delta 0,05 s: vanlig startstock, upptäckta resursnoder, arbetare/leverans, betald barracks/produktion, synliga attackmål. Ingen injicerad ekonomi, HP, units eller fiendekunskap. Matrisen kördes som gameplay-integrationstester och i browser med accelererad modell/rendering, både dev och lokal dist under produktionssubpath. En separat temporär testbundle användes vid dist-kontrollen; teststrategin ingår inte i appbygget. Browserns DOM valde varje mode/profil och kontrollerade terminal save/load och restart. Detta ersätter inte naturlig UI-speltid; fem sådana Normal-flöden redovisas under tabellen. Varje matrisrad inkluderar pause/save-roundtrip vid 45 s, resursledger, terminal freeze och fresh restart.

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

Pages ingår i godkännandet efter lokala checks. Workflow kör npm ci/test/typecheck/build, officiella pinade actions och separat deploy-job med pages/id-token-behörigheter. Trigger push main/workflow_dispatch; concurrency undviker samtidiga publiceringar. Commit `6606f0e` pushad till main. [Actions 37009719240](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37009719240) klarade alla build- och deploy-steg. [Publicerad sida](https://tobisen.github.io/warcraft-2-tribute/) kontrollerad i Chromium: canvas/selection/movement, 12 OGG/WAV-avkodningar, save/reload/load/resume, tio restarts och båda viewportarna utan request-/runtimefel. Även publicerad belastningskontroll klarade budget (CPU p95 3,40 ms, RAF 17,40 ms, GC-heap 10,10 MiB vid målbelastning). Det faktiska resultatet anges även i [DEV_LOG.md](DEV_LOG.md).

Hel naturlig match på Pages: Utposten/Normal, vanliga klick/drag/gather/build/produktion/attack utan injicerad gameplay-state, Victory vid 90 s och restart. Soldier/archer/catapult alla producerade; tre workers och tre combat-units överlevde, bas240. Kostnad120 wood/35 gold och ledger440/310. Första soldier23,55 s; inga request/runtimefel. Testklick använder färska målkoordinater så rörliga enemies inte missas mellan snapshot och click.

En handgjord arena, enkel AI, begränsad separat gruppnavigation utan collision avoidance. Endast desktop Chromium verifierat; ingen akustisk lyssning, andra engines/mobil, multiplayer eller backend. Save schema/config 1 utan migration, en origin-local slot som inte delas mellan localhost och Pages. Nya fraktionsnamn/förmågor/balans är öppna framtidsbeslut. Nästa implementerbara task är RTS-061, men ingen task efter RTS-060 implementeras i denna körning.

## Uppföljning RTS-061–065

Pages verifierades publicerad före den godkända etappen. QA-001/002 fick lokal body-separation respektive härledda service-/passageköer; QA-003 minimap-keyboard förblir P3 utanför etappen. [PERFORMANCE.md](PERFORMANCE.md) dokumenterar nya 64/128-fixtures, före/efter-profiler och uppfyllda budgetar efter avgränsad navigationoptimering. 479 tester/65 filer inklusive alla 15 releasekombinationer, typecheck och build godkända. Det är större belastningsfixtures, inte ändrad supply eller balans. Fortsatt kvar: andra browsermotorer/mobil, akustisk lyssning, medveten bundle-varning och mjuk separations begränsning i tät trängsel.

RTS-065 `d85b754` publicerad: [Actions 37021939019](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37021939019) success inklusive tester/typecheck/build/deploy. Publik JS-SHA256 matchar testad lokal dist. [Pages](https://tobisen.github.io/warcraft-2-tribute/) klarade naturlig Utposten/Normal med alla tre betalda armétyper, tre vågor, Victory90s/bas240 och restart; tre workers och två combat överlevde. Publicerade assets/ljud och save/reload/load/resume/tio restarts/båda viewportar passerade utan browserfel. Se DEV_LOG för detaljer; RTS-066–090 förblir planerade.

## Uppföljning RTS-066–070

Fraktionsval, egna sprites, fraktionsproduktion och försvarshållning/raseri är införda. [FACTION_BALANCE.md](FACTION_BALANCE.md) dokumenterar 30 betalda gameplaykombinationer med förmågor, båda fraktioners naturliga Utposten/Normal-vinster och accelererade verkliga defeat-/terminal-input-/fraktionsbytekontroller. 535 tester/71 filer, typecheck och build passerar. Inga runtime-balansvärden ändrades i RTS-070; teststrategin hanterar tidigare gold och störd ekonomi. Save schema2/config4 migrerar tidigare configversioner. Föregående RTS-069-push verifierad Actions success; denna tasks Pages-publicering redovisas efter push.

## RTS-080: tvåfraktionsrelease 2026-10-03

Denna uppföljning ersätter tidigare releasebeskrivningars aktuella
status: två fraktioner och tre skirmish-kartor finns nu; Save schema2/
config10 migrerar tidigare konfigurationer utan gratis ekonomi. Äldre
texter ovan är historiska kontroller, inte dagens funktionsbegränsningar.

Aktuell fullsuite inkluderar30 scenario/fraktion/difficulty-matcher och
18 skirmish/karta/fraktion/difficulty-matcher via betalda command-policy.
De använder0,05s delta, faktisk fog/insamling/leverans/kostnader, Save/load
och terminalfreeze. Ingen naturlig browser-fullmatris eller lika
vinstchans påstås. RTS-079 verifierade dessutom sex faktiska passiva
Normal-browsermatcher (109–120 gameplay-sekunder med accelererad klocka),
defeat/resultat/Save/load och att AI-banker bevarar finite ekonomin.

Assetmanifest audit:16 world-,48 byggnads-,1920 enhets- och17 UI-frames;
alla atlasfiler och frame-gränser giltiga. Originalkällor/proveniens i
[assets/README.md](assets/README.md); egna kompositioner, inget importerat
spelart eller externa typsnitt. Ingen ny övergripande licens antas eller
införs. Ljud finns som sex OGG/WAV-par med dokumenterad originalkälla.

Lokal prestanda/heap/bundlesize PASS enligt [PERFORMANCE.md](PERFORMANCE.md).
Desktop Chromium är verifierad engine; andra engines/mobil, akustisk
lyssning, 50/50-balans och optimal AI är fortsatt obevisade. Bundlevarning
kvarstår avsiktligt.

Ren offlineinstallation49 packages/audit0;662 tester/81 filer PASS
(119,04s), typecheck/build PASS. Deterministisk assetexport i kopian
matchar10 originalfiler exakt. Ren/local/public runtime byte-identisk:
index-DSc0qhVd.js, SHA256
fe24b21ca9993cd56b1059977b376fe397e5b393250bb9e6eb330324c7e21af9.

[Actions37109756850](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37109756850)
success för31dd4db. [Publicerad version](https://tobisen.github.io/warcraft-2-tribute/)
verifierad efter deploy:18 faktiska menu/Start/pause/save/load/restart-
kombinationer, faktisk betald Utposten/Easy-victory90s och oskyddad
Survival/Hard-defeat91,62s, resultatrader/freeze/save/reset PASS.
Accelererad clock men ingen injicerad matchstate i dessa flöden.
Smoke:selection/move,save/reload/load/resume,tio restarts,1280x900/
1024x768 och12 OGG/WAV-avkodningar PASS utan request/runtimefel.
Separat injicerad35-body-profil CPU5,30ms/RAF17,60/heap10,08MiB;
64-soldier-stress CPU12,10ms/RAF17,60/heap10,68MiB. Ingen full
realtidsmatris eller akustisk lyssning påstås.

## RTS-090 – Verifierad sjörelease, 2026-10-03

Aktuell fullsuite748 tester/90 filer PASS146,91s; strict typecheck/build/
diff och docs/refs PASS. Inga checks utelämnade för aktuell task. Bundle-
varningen är kvar enligt mandat och verifierade budgetar i
[PERFORMANCE.md](PERFORMANCE.md). Ren temporär checkout-kopia:
`npm ci --offline`49packages/audit0, typecheck/build PASS, samma runtime.
Alla12 pixelatlas-/manifest-/panel-filer från ny `assets:export` är identiska.
Nya originalassets832naval/60building frames och8 OGG/WAV-par har
källor/bruk i [assets/README.md](assets/README.md) och
[assets/ASSET_LICENSE.md](assets/ASSET_LICENSE.md).

Matrisen omfattar gamla fem landscenarier × båda fraktioner × tre
svårigheter; tre land-Skirmishkartor × två fraktioner × tre svårigheter
(18 betalda matcher och6 passiva förluster). Öarna-Skirmish och Överfarten
× två fraktioner × tre svårigheter ger12 betalda överfartssegrar;6 passiva
sjömatcher förlorar,6 tidiga betalda kanonmotmedel stoppar transporten.
24 Skirmish-menyval kontrollerar fresh model/Save/restart; fixed mission
normaliserar till Öarna. Transportlast/ID/supply, loaded own/enemy Save,
flygande skott, fog/minimap/ljud, death cleanup, defeat priority och
terminalfreeze omfattas av beteende-/regressionstester. Ingen gratis
produktion eller dold målinformation används i de betalda flödena.

[Actions37120604107](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37120604107)
success för4ef5895. Public runtime index-Cz0Vv2w4.js SHA256
3f088392c27fc399d9a05c9aed4bce8fe42fd6097b8a632c44cf60fd0ba56cfb
är byte-identisk med lokal/cleanbuild. Public naval-atlas PNG/JSON,
byggatlas PNG och cannon/splash OGG/WAV jämförda byte för byte.

Faktisk [Pages-sida](https://tobisen.github.io/warcraft-2-tribute/) i Chromium:
selection/move,local Save→page reload→Load/Resume,10restart,desktop/
staplad vy och16 OGG/WAV-avkodningar utan request/console/runtimefel.
Båda fraktioner Easy/Överfarten: verklig betald gathering→kasern/armé→hamn/
transport→Save/load→överkorsning/landning→landstrid/victory214,39/214,00s,
restart. Normal/Öarna: faktisk AI-passagerarlast2, Save mittöverfart,
landstigning/defeat256,30s. Betalt eget kanonfartyg sänker synlig tom
AI-transport; verkligt skott sparat i flykt, Load/Resume, synlig deathEffect,
cannon/splash BufferSources, mute/unmute, restart; bas240HP vid335,52s.
Gameplayklockan accelererad; inga injicerade resurser/HP/units i dessa
matchflöden. Särskilda loadfixtures används enbart för prestanda.

Verifierat: headless Chromium147 på macOS, inga subjektiva ljudlyssningar,
Firefox/WebKit/mobil eller full naturlig realtidsmatris. Balansen är
progressionstest, ingen50/50-garanti. AI har en betald obeväpnad transport,
ingen återbyggnad/kanonflotta. Fartyg får överlappa; lastning är omedelbar
inom64px, ingen boarding-kö. Lokal sparning är originbunden; localhost-
saves flyttas inte automatiskt till Pages. Inga blockerande fel kvar.
