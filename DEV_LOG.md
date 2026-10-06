# Development log

## 2026-10-01 – Dokumentationsgrund

- Läste befintligt repo: README innehöll endast projektnamnet, ingen AGENTS.md
  eller projektkod fanns och arbetsytan var ren.
- Bevarade projektnamnet och utökade README. Skapade AGENTS.md, tre rollfiler,
  GAME_DESIGN.md, ARCHITECTURE.md, BACKLOG.md och DECISIONS.md samt denna logg.
- Dokumenterade MVP, teknik, arbetsflöde och avgränsningar. RTS-001 är fortsatt
  Todo; projektinitialisering har inte utförts.
- Gridstorlek, koordinatmodell och tidsmodell är öppna inför movement.
- Verifiering: dokumenten kontrollerades mot uppdragets krav och lokala
  Markdown-filreferenser kontrollerades. Ingen spelkod eller dependencies
  infördes. Inga befintliga projektchecks fanns att köra och inga tester
  skapades för dokumentationen.
- Ingen commit eller push gjordes. Nästa steg: RTS-001 enligt BACKLOG.md.

## 2026-10-01 – Dokumentation för commit

- Användaren godkände därefter commit och push av dokumentationsgrunden.
- Verifiering inför commit: `git diff --check` passerade. Tidigare kontroll
  verifierade samtliga tio dokument och 42 lokala filreferenser.
- RTS-001 är fortsatt Todo; inga implementationskrav har genomförts.

## 2026-10-01 – RTS-001: Initialize project structure

- Satt RTS-001 till In Progress innan implementation och därefter Done efter
  verifiering av acceptance criteria.
- Infört Vite 8.3.2, Phaser 4.2.1 och strict TypeScript 7.0.2 med låsfil.
  Projektnamnet och befintlig dokumentation har bevarats.
- Skapat index.html, src/main.ts och en tom src/scenes/BootScene.ts.
  Canvasen är 800 × 600; detta fastställer ingen grid- eller koordinatmodell.
- Infört dev-, typecheck- och build-scripts samt .gitignore. Inga framtida
  system, gameplay, input, UI eller bootstrap-spegeltester skapades.
- `npm install` passerade; `npm ci --cache /tmp/w2t-npm-cache --offline`
  verifierade ominstallation från låsfil. `npm run typecheck` och
  `npm run build` passerade. Builden varnade om en bundle över 500 kB
  (cirka 1,38 MB minifierad, 358 kB gzip); ingen scope-utökande optimering gjordes.
- Browserkontroll: tillfälligt Playwright-verktyg i /tmp och lokal headless
  Chromium, inga nya projektdependencies för verifieringen. Första browserstarten
  hindrades av sandboxen. En första canvas-kontroll efter ominstallationen
  timeoutade; efter omstart av dev-servern på 127.0.0.1:5174 passerade kontrollen.
  Synlig canvas 800 × 600, korrekt titel, inga fångade runtime-, konsol- eller
  nätverksfel. Skärmbilden /tmp/w2t-bootstrap.png granskades manuellt.
- Uppdaterat README, ARCHITECTURE och BACKLOG. Justerat historiskt scope i
  AGENTS och hänvisat beslutsregistrets taskstatus till backloggen.
- Gridstorlek, koordinatmodell och tidsmodell är fortsatt öppna inför movement.
  Nästa föreslagna task: konkretisera första movement-implementationen i backloggen.
- Ingen commit eller push.

## 2026-10-01 – RTS-001 för commit

- Användaren godkände därefter commit och push av RTS-001.
- `git diff --check` passerade inför commit. Implementationens typecheck,
  build och browserkontroll är redovisade ovan. RTS-001 är Done.

## 2026-10-01 – RTS-002: First playable movement slice

- Läste agentinstruktioner, implementer-roll, backlog, arkitektur, beslut,
  README och bootstrap. Arbetsytan var ren. Lade till RTS-002 som nästa lediga
  ID, satte In Progress före implementation och Done efter verifiering.
- Skapade en fristående movement-funktion och enkel speed-config (160 px/s).
  BootScene visar en grön placeholder och kopplar högerklick till senaste
  world-målet. Delta konverteras från millisekunder till sekunder. Rörelsen
  begränsas till avståndet så att enheten stannar exakt utan overshoot.
- Förhindrade canvasens kontextmeny och tog bort inputlyssnaren vid shutdown.
  Ingen selection, pathfinding, hinder, karta, resurser, kamera eller AI infördes.
- Dokumenterade användarens beslut: world pixels, framtida tiles 32 × 32 px,
  delta-baserad movement och ingen fixed timestep eller grid i denna slice.
- Införde Vitest 4.1.11 (kompatibel med befintlig Node 20 och Vite 8) och
  `npm test`. Alla 9 unit-tester passerade: riktning/hastighet, negativ riktning,
  exakt stopp och overshoot, samma start/mål, delta=0, motsvarande rörelse med
  olika tidssteg före och efter ankomst samt ersatt mål.
- `npm run typecheck` och `npm run build` passerade. Buildens bundle-varning
  kvarstår: cirka 1,38 MB minifierat och 358 kB gzip med Phaser inkluderat.
- Browserkontroll via tillfälligt Playwright i /tmp och lokal Chromium mot
  Vite på 127.0.0.1:5174 passerade. Faktiska musklick verifierade rörelse från
  (400, 300), nytt mål under pågående rörelse och exakt stopp vid (200, 150).
  Vänsterklick ignorerades och contextmenu-event var defaultPrevented.
  Inga runtime-, konsol- eller nätverksfel fångades. Skärmbilden
  /tmp/w2t-movement.png granskades manuellt. Browserverktyget exponerade endast
  en scenreferens i sitt tillfälliga svar; ingen debug-API lades i projektet.
- Uppdaterade README, ARCHITECTURE, DECISIONS och BACKLOG. Dokumentreferenser
  och `git diff --check` kontrollerades. Nästa föreslagna task: avgränsa selection.
- Ingen commit eller push.

## 2026-10-01 – RTS-002 för commit

- Användaren godkände därefter commit och push av movement-slicen.
- `git diff --check` passerade inför commit. RTS-002:s tester, typecheck,
  build och browserkontroll är redovisade i dess implementationspost.

## 2026-10-01 – RTS-003: Click selection

- Läste agentinstruktioner, implementer-roll, backlog, arkitektur och befintlig
  movement/input-kod. Arbetsytan var ren. Skapade nästa lediga task RTS-003,
  satte In Progress och markerade Done efter uppfyllda acceptance criteria.
- Införde Phaser-fristående selection/command-state med kvadratisk klickträff
  på aktuell enhetsposition. Enheten börjar omarkerad. Tom mark avmarkerar
  utan att ändra målet; nya move-commands accepteras endast vid markering.
- BootScene översätter musklick och visar en gul markeringsring som följer
  enheten. Flyttade placeholder-storleken 24 px till befintlig unit-config så
  att rendering och klickyta använder samma värde. Movement-funktionen är oförändrad.
- `npm test`: 19 tester passerade (10 selection och 9 befintliga movement).
  `npm run typecheck` och `npm run build` passerade. Tidigare bundle-varning
  kvarstår (cirka 1,38 MB minifierat, 358 kB gzip).
- Browserkontroll med tillfälligt Playwright i /tmp och Chromium mot lokal Vite
  verifierade omarkerad start, spärrat högerklick, klickmarkering och synlig ring,
  ringens position under rörelse, nytt mål, avmarkering med bevarat mål och
  fortsatt rörelse, ignorerat kommando vid avmarkering samt återmarkering vid
  den nya positionen och exakt ankomst till nästa mål. Kontextmenyn förhindrades
  fortfarande. Inga runtime-, konsol- eller nätverksfel fångades.
  /tmp/w2t-selection-ring.png granskades visuellt. Scenreferensen exponerades
  endast i browserverktygets tillfälliga svar, utan ändring av projektets API.
- Uppdaterade BACKLOG, ARCHITECTURE, GAME_DESIGN och README. Kontrollerade
  dokumentreferenser och `git diff --check`. Inga dependencies tillkom.
- Inga non-goals infördes. Nästa föreslagna task: avgränsa dragselection.
  Ingen commit eller push.

## 2026-10-01 – RTS-003 för commit

- Användaren godkände commit och push med meddelandet
  `feat: add unit click selection`.
- `git diff --check` passerade inför commit. Tester, typecheck, build och
  browserkontroll är redovisade i implementationsposten ovan.


## 2026-10-01 – RTS-004: Drag selection and group commands

- Läste AGENTS, implementer-roll, backlog, arkitektur och befintlig selection,
  input och movement. Arbetsytan var ren. Lade till RTS-004 som nästa lediga ID,
  satte In Progress före implementation och Done efter uppfyllda kriterier.
- Tre enheter med unika ID:n och separata positioner; egna mål och selection-state
  utanför Phaser-renderobjekten. Återanvände befintlig movement och klickregler.
- Fristående selection-logik normaliserar rektanglar, väljer centrum inklusive
  kanten och ersätter urvalet. Klick väljer en enhet; vid överlapp väljs sist
  renderade enheten. Tomt urval avmarkerar alla utan att ändra mål.
- Scenen visar dragrektangel och ringar, adapterar input och skickar kommandon
  till alla markerade. Tröskeln är 5 CSS/client-pixlar och är oberoende av world
  coordinates. Gesten förblir drag efter uppnådd tröskel; selection ändras vid release.
- `npm test`: 36 tester passerade (17 nya och alla 19 tidigare). Initial
  typkontroll hittade MouseEvent/TouchEvent-unionen; korrigerade koordinatadapter.
  Därefter passerade `npm run typecheck` och `npm run build`. Bundle-varningen
  kvarstår: cirka 1,38 MB minifierat och 359 kB gzip.
- Browserkontroll med tillfälligt Playwright i /tmp och lokal Chromium passerade:
  tre unika ID:n, klick och kort drag, fyra dragriktningar, centrum på kant,
  tom rektangel, ringar, kommandon enbart till markerade, målbyte under rörelse,
  avmarkering utan stopp och exakt gemensamt mål. Den tredje enheten stod kvar.
  Kontextmenyn förhindrades; inga runtime-, konsol- eller nätverksfel fångades.
- Skalad-canvas-kontrollen behövde uppdatera Phaser scale efter testverktygets
  tillfälliga CSS-ändring; därefter verifierades att 4 client-pixlar är klick
  även när de motsvarar 8 world pixels. Ingen produktändring behövdes för detta.
  /tmp/w2t-drag-box.png granskades manuellt; browserartefakter ligger utanför repot.
- Uppdaterade BACKLOG, ARCHITECTURE, GAME_DESIGN och README. Dokumentreferenser
  och `git diff --check` kontrollerades. Inga dependencies eller non-goals infördes.
- Nästa föreslagna task: avgränsa resources. Ingen commit eller push.

## 2026-10-01 – RTS-004 för commit

- Användaren godkände commit och push med meddelandet
  `feat: add drag selection and group movement`.
- `git diff --check` passerade inför commit. Tester, typecheck, build och
  browserkontroll är redovisade i implementationsposten ovan.


## 2026-10-01 – RTS-005: Simple wood gathering

- Läste AGENTS, implementer-roll, backlog, game design, arkitektur och befintlig
  input/unit/movement-kod. Arbetsytan var ren. Skapade RTS-005 med nästa lediga ID,
  satte In Progress före implementation och Done efter verifiering.
- Befintliga tre enheter är arbetare med Phaser-fristående idle/move/gather-order.
  Införde en nod med 100 wood, högerklick för gather och approach till 24 px
  räckvidd. Numeriska gather-inställningar ligger i src/config/gathering.ts.
- Insamling är kontinuerlig (1 wood/sekund per arbetare) och tar hänsyn till
  approach-tid inom varje delta. Varje uttag begränsas till kvarvarande wood
  och krediteras direkt till gemensamt saldo. Vid uttömning blir alla gather-
  order till noden idle. Ny move-order avbryter; avmarkering bevarar ordern.
- Scenen renderar nod och enkel text med en decimal samt adapterar input och
  anropar gathering-steget. Selection-funktionernas generiska typer bevarar
  worker/order-state. Inga dependencies tillkom och tidigare tester behölls.
- `npm test`: 50 tester passerade (14 nya, 36 tidigare). Tester omfattar räckvidd,
  approach mitt i delta, olika tidssteg, flera arbetare, begränsad mängd,
  bevarad total, uttömning, orderbyte, avmarkering och nodträff.
  `npm run typecheck` och `npm run build` passerade. Bundle-varningen kvarstår
  (cirka 1,38 MB minifierat och 360 kB gzip).
- Browserkontroll med tillfälligt Playwright i /tmp och Chromium verifierade
  att omarkerade ignorerar gather, gruppselection, approach utan omedelbar
  insamling, fortsatt gathering efter avmarkering, move-order som stoppar
  insamling, nytt gather-kommando och faktisk uttömning av hela noden.
  Alla tre blev idle. Saldo var 100 inom flyttalstolerans och noden exakt 0;
  text visade Wood: 100.0 / Node: 0.0 wood. Inga runtime-, konsol- eller
  nätverksfel fångades. /tmp/w2t-gathering-depleted.png granskades manuellt.
- Uppdaterade BACKLOG, ARCHITECTURE, GAME_DESIGN och README; direkt kreditering
  dokumenterades som denna slices förenkling utan bas, leverans eller bärkapacitet.
  Dokumentreferenser och `git diff --check` kontrollerades.
- Nästa föreslagna task: avgränsa buildings. Ingen commit eller push.

## 2026-10-01 – RTS-005 för commit

- Användaren godkände commit och push med meddelandet
  `feat: add basic wood gathering`.
- `git diff --check` passerade inför commit. Tester, typecheck, build och
  browserkontroll är redovisade i implementationsposten ovan.

## 2026-10-01 – RTS-006: Base and wood delivery

- Läste AGENTS, implementer-roll, backlog, game design, arkitektur och befintlig
  gathering/order/movement. Arbetsytan var ren. Skapade RTS-006 som nästa lediga
  task och satte In Progress innan implementation.
- Införde en fast blå bas vid (400, 450), lastkapacitet 5 och leveransräckvidd
  24 px i gathering-config. Last visas som enkel text vid varje arbetare.
- Phaser-fristående arbetsloop överför nod → last → saldo. Full last startar
  deliver som minns nod-ID för återgång. Delvis last levereras vid uttömning;
  sedan idle. Ny move avbryter utan lastförlust; gather med full last levererar
  först. Avmarkering bevarar order och last.
- Delta förbrukas över flera övergångar utan att förlora resttid. Noduttag
  begränsas av återstående mängd och ledig lastkapacitet. Uppdateringen kopierar
  state; rendering och inputadapter finns fortsatt i BootScene.
- Anpassade 14 tidigare gathering-tester till lastmodellen och lade till 11
  delivery-tester. `npm test`: 61 tester passerade, inklusive 36 tidigare
  movement/selection-tester. `npm run typecheck` och `npm run build` passerade.
  Buildens tidigare bundle-varning kvarstår (cirka 1,38 MB minifierat, 360 kB gzip).
- Tester verifierar saldo först vid leverans, delvis/full last, upprepade turer
  över olika tidssteg, full gather-order, avbruten loop, avmarkering, totalbevarande
  och att manuell move till basen inte implicit levererar last.
- Browserns första observationsverktyg timeoutade när det försökte ersätta update
  efter Phasers callback-bindning. Flyttade endast testverktygets observation
  till postupdate och körde om utan att ändra spelkod eller spelhastighet.
- Uppdaterade ARCHITECTURE, GAME_DESIGN och README till leveransmodellen;
  RTS-005:s backlogpost är märkt som historisk. Direkt kreditering är ersatt.
- Browserkontroll i lokal Chromium via tillfälligt Playwright i /tmp passerade
  utan ändrad spelhastighet. Markerade tre arbetare, gav gather och avmarkerade;
  observerade last innan saldoökning och sju leveransturer per arbetare.
  Hela noden tömdes och även slutlast levererades. Slutstate: nod exakt 0,
  saldo 100 inom flyttalstolerans, samtliga arbetare idle med last 0.
  Inga runtime-, konsol- eller nätverksfel fångades.
  /tmp/w2t-cargo.png och /tmp/w2t-delivery-depleted.png granskades visuellt.
- Dokumentreferenser och `git diff --check` kontrollerades. RTS-006 markerades
  Done efter verifiering. Inga dependencies eller non-goals infördes.
- Nästa föreslagna task: avgränsa produktionsbyggnad. Ingen commit eller push.

## 2026-10-01 – RTS-006 för commit

- Användaren godkände commit och push med meddelandet
  `feat: add base and automatic wood delivery`.
- `git diff --check` passerade inför commit. Tester, typecheck, build och
  browserkontroll är redovisade i implementationsposten ovan.


## 2026-10-01 – RTS-007: Train workers from base

- Läste AGENTS, implementer-roll, backlog, game design, arkitektur och befintlig
  unit/selection/gathering-logik. Arbetsytan var ren. Lade till nästa lediga ID
  RTS-007, satte In Progress före implementation och Done efter verifiering.
- Införde Phaser-fristående produktionsstate med en pågående timer och nästa
  ID-nummer. Start spärras vid saldo under 20 eller pågående produktion.
  Godkänd start drar 20 wood en gång och tar 5 gameplay-sekunder enligt config.
- Timer använder gameplay-delta och liten flyttalstolerans vid avslut. Exakt
  en worker skapas per slutförd produktion; ID-kontroll och monotont nummer
  undviker kollisioner. Spawn vid bas + (60, 0), last 0, idle och omarkerad.
- Införde en DOM-knapp utanför canvas och text för återstående tid. Knappen
  påverkar endast produktion och är disabled vid spärrar. Release över
  produktionskontroller avbryter eventuell draggest utan selection-ändring.
  DOM-lyssnare tas bort vid shutdown. Renderobjekt skapas för nya workers.
- `npm test`: 72 tester passerade (11 production, 61 tidigare). Testade kostnad
  en gång, startspärrar, spawn-tid/antal, tidssteg, unika ID:n, spawn-state och
  ny workers selection/movement/gathering/leverans. `npm run typecheck` och
  `npm run build` passerade. Tidigare bundle-varning kvarstår (cirka 1,38 MB
  minifierat och 360 kB gzip).
- Browserkontroll med tillfälligt Playwright i /tmp och lokal Chromium passerade
  utan ändrad spelhastighet eller påhittat saldo: samlade/levererade 20 wood,
  startade via knapp och verifierade saldo 0, countdown, blockerad upprepad
  start samt oförändrad selection/order efter vänster- och högerklick på knappen.
  Ny unit-4 var idle, omarkerad och tom vid (460, 450). Den valdes med klick,
  samlade wood och levererade 5 wood. Ingen spawn före färdig timer och endast
  en ny worker. Inga runtime-, konsol- eller nätverksfel fångades.
  /tmp/w2t-production-countdown.png granskades visuellt.
- Uppdaterade BACKLOG, ARCHITECTURE, GAME_DESIGN och README. Kontrollerade
  dokumentreferenser och `git diff --check`. Inga dependencies eller non-goals infördes.
- Nästa föreslagna task: avgränsa produktionsbyggnad. Ingen commit eller push.

## 2026-10-01 – RTS-007 för commit

- Användaren godkände commit och push med meddelandet
  `feat: add worker production at base`.
- `git diff --check` passerade inför commit. Tester, typecheck, build och
  browserkontroll är redovisade i implementationsposten ovan.


## 2026-10-01 – RTS-008: Place a barracks

- Läste AGENTS, implementer-roll, backlog, game design, arkitektur, beslut och
  befintlig input/ekonomi/baslogik. Arbetsytan var ren. Skapade RTS-008 med nästa
  lediga ID, satte In Progress före implementation och Done efter verifiering.
- Införde byggknapp och grön/röd preview med förklarande text. Barracks är
  2 × 2 tiles, övre vänster snappas nedåt till 32 px-grid. World-config 800 × 600
  delas mellan bootstrap och placeringsregler.
- Phaser-fristående regler validerar gränser, bas/nod-footprints, aktuellt saldo
  och max en barracks. Giltig placering drar 40 wood en gång; fel och avbrott
  drar inget. Escape/högerklick avbryter. Inputläget och dess release konsumeras
  utan ändrad selection eller unit-orders. Ingen reservation vid lägesstart.
- Footprints dokumenterade i DECISIONS: barracks 64 × 64 med övre vänster-position,
  centrerad bas 48 × 48 och nodens centrerade bounding box 40 × 40. Kantkontakt
  tillåts, areaöverlapp förbjuds. Även uttömd nod blockerar; arbetare blockerar inte.
- `npm test`: 93 tester passerade (21 placement, 72 tidigare). Testade snapping,
  negativa koordinater, världens kanter, bas/nodöverlapp, kantkontakt, saldo,
  en debitering, avbrott och andra barracks. `npm run typecheck` och
  `npm run build` passerade. Tidigare bundle-varning kvarstår (cirka 1,39 MB
  minifierat och 361 kB gzip).
- Browserkontroll med tillfälligt Playwright i /tmp och Chromium passerade utan
  ändrad spelhastighet/påhittat saldo. Verifierade lågt saldo, aktiv preview,
  kostnadsfria avbrott med Escape/högerklick, bas-/nodöverlapp och världens kant.
  Samlade 40 wood via befintliga arbetare, placerade vid (96, 96) och fick saldo 0.
  Selection och orders förblev oförändrade efter även klickets release. Andra
  barracks blockerades, även vid forcerat DOM-klick på spärrad byggknapp.
  Inga runtime-, konsol- eller nätverksfel fångades. Preview och färdig byggnad
  granskades i /tmp/w2t-placement-valid.png och /tmp/w2t-barracks-placed.png.
- Uppdaterade BACKLOG, ARCHITECTURE, GAME_DESIGN, DECISIONS och README.
  Dokumentreferenser och `git diff --check` kontrollerades. Inga dependencies
  eller non-goals infördes; basens befintliga arbetarproduktion bevarades.
- Nästa föreslagna task: avgränsa barracks-produktion. Ingen commit eller push.

## 2026-10-01 – RTS-008 för commit

- Användaren godkände commit och push med meddelandet
  `feat: add barracks placement`.
- `git diff --check` passerade inför commit. Tester, typecheck, build och
  browserkontroll är redovisade i implementationsposten ovan.

## 2026-10-01 – RTS-009: Soldier production from barracks

- Läste agentinstruktioner, implementer-roll, backlog, arkitektur, game design
  och befintlig produktion/input/enhetslogik. Skapade RTS-009 med nästa lediga
  ID och satte In Progress före implementation.
- Återanvände production-modulens start/timer/spawn för soldier: 20 wood vid
  godkänd start, 5 gameplay-sekunder, en produktion per byggnad utan kö.
  Bas och barracks har oberoende timers och gemensamt saldo. Alla enhets-ID:n
  kontrolleras vid spawn även när båda byggnaderna producerar samtidigt.
- Införde Unit = Worker | Soldier och GatheringState.units. Soldiers har bara
  idle/move och cargo 0. Anpassade tidigare testfixtures till typmarkör och
  gemensam enhetslista; tidigare gathering-/leveransregler bevaras.
  Resursklick ger endast markerade workers arbetsorder och bevarar soldiers order.
- Soldatknappen visas efter barracks-placering och visar återstående tid.
  Nya soldiers börjar omarkerade/idle och visas orange med etiketten Soldier.
  Spawn prövar sidor kring footprint och håller hela kroppen inom världen med
  8 px avstånd från footprint. Stats och produktionsvärden ligger i config.
  UI ändrar inte selection eller orders. Ingen combat/HP eller collision infördes.
- `npm test`: 104 tester passerade (93 tidigare och 11 nya soldier-tester).
  Verifierade kostnad, startvillkor, exakt en spawn, tidssteg, samtidig
  produktion, unika ID:n, spawn vid världskanter, klick/dragselection, movement
  och soldiers utan gathering/last. `npm run typecheck` och `npm run build`
  passerade. Befintlig bundle-varning kvarstår (~1,39 MB, 362 kB gzip).
- Browserkontroll med tillfälligt Playwright i /tmp och Chromium passerade:
  samlade 80 wood via riktiga arbetare, placerade barracks vid (96, 96),
  startade bas och barracks samtidigt för återstående 40 wood och fick två
  unika enheter efter produktion. Soldier spawnade vid (180, 128), omarkerad
  med cargo 0. Klickselection och movement till (700, 300) fungerade.
  Dragmarkerade blandad grupp; resursklick gav workers arbetsorder medan
  soldiers tidigare move-order bevarades. UI-start bevarade selection/orders.
  Inga runtime-, konsol- eller nätverksfel. Orange soldier och markeringsring
  granskades i /tmp/w2t-soldier-production.png.
- Browserverktygets första assert krävde gather även vid uttömd nod; anpassade
  kontrollen till leverans/idle vid uttömning. Efter Vite-omladdning behövde
  observations-hooken följa modulens cacheparametrar. Slutkörningen passerade;
  inga hooks eller browsertestverktyg lades till i repot.
- Uppdaterade BACKLOG, ARCHITECTURE, GAME_DESIGN och README. Markerade RTS-009
  Done efter verifiering. Alla 105 dokumentreferenser och git diff --check
  passerade. Inga nya dependencies.
- Nästa föreslagna task: avgränsa en första combat-slice. Ingen commit eller push.

## 2026-10-01 – RTS-009 för commit

- Användaren godkände commit och push med meddelandet
  `feat: add soldier production at barracks`.
- `git diff --check` passerade inför commit. Tester, typecheck, build och
  browserkontroll är redovisade i implementationsposten ovan.

## 2026-10-01 – RTS-010: Manual soldier attack

- Implementerade attack-order, HP och delta-baserad melee med approach före skada.
  Workers/orders och tidigare selection/movement bevaras; döda fiender och
  deras renderobjekt tas bort, angripare blir idle. Config och beslut dokumenterade.
- 113 tester, typecheck och build passerade. Chromium: verklig insamling av
  60 wood, barracks/soldier-produktion, klickselection, attack, HP-minskning
  och borttagning vid död utan runtime-/konsol-/nätverksfel.
- Granskade diff för inputprioritet, orderbyte, delta/räckvidd och renderstädning:
  inga blockerande fynd. Uppdaterade docs och markerade Done. Bundle-varning
  kvarstår enligt scope; ingen commit/push.

## 2026-10-01 – RTS-011: Simple enemy movement and attack

- Fiender går mot nearest soldier inom aggro, annars basen. Approach/skada
  återanvänder combat-logiken. Skada appliceras samtidigt, HP klampas och
  döda soldiers tas bort inklusive rendering/selection. Workers angrips inte.
- 119 tester, typecheck/build passerade. Browser verifierade approach, basskada
  och faktisk insamling/produktion/manuell strid utan browserfel.
- Granskningen rättade en risk för återanvända ID:n efter död: produktionernas
  nästa ID synkas; döda combatants kan inte ge skada. Regressionstester tillagda.
  Tidigare test av stationär fiende anpassades till att AI nu flyttar target.
- Docs/beslut uppdaterade, Done. Inga kvarvarande blockerande fynd.

## 2026-10-01 – RTS-012: Finite configured enemy waves

- Ersatte övningsfienden med tre ändliga waves vid 60/90/120 sekunder,
  1/2/3 enemies och monotona ID:n. Enkel våg/countdown-text. Befintlig
  800 × 600-värld är en öppen MVP-arena. Nod ökad till 400 wood, startsaldo 0.
- 125 tester, typecheck/build passerade. Browser: faktiskt samla 60 wood,
  barracks/soldier redo före första vågen, sedan spawn och manuell strid
  till fiendedöd. Inga browserfel. Resursbudget och wave-gränser testade.
- Granskade progression, tidssteg, ID:n och scope utan blockerande fynd.
  Docs/beslut uppdaterade och task Done.

## 2026-10-01 – RTS-013: Defeat and game-over freeze

- MatchState/updateMatch samordnar befintliga system, lifetids-ID:n och
  defeat. Simulation stannar tillsammans; alla gameplay-handlers spärras
  vid game over och gesture/placement-preview städas. Inga orders nollställs.
- Delta delas vid vågtider; nyspawnade enemies får ingen simulationstid före
  spawn. Ingen fixed timestep. 130 tester, typecheck/build passerade.
- Chromium: verklig gathering utan försvar gav defeat efter cirka 101 s.
  Deep-compare bekräftade frysta system, blockerad canvas och forcerade
  DOM-klick/Escape; pågående preview rensades. Inga browserfel.
- Granskade uppdateringsordning, HP-gräns, inputguard och wave-splitting utan
  blockerande fynd. Docs/beslut uppdaterade och Done.

## 2026-10-01 – RTS-014: Victory after final wave

- Victory kräver sista wave spawnad och tom enemy-lista. Defeat har företräde
  vid samtidig utgång. Återanvände simulation-/inputstoppet och status-text.
- 134 tester, typecheck/build passerade. Integrationstest spelade hela
  ekonomin/produktionen/alla waves till victory med bevarad wood-total.
- Chromium spelade matchen med faktiska DOM-/musklick, inga ändrade stats,
  påhittade resurser eller tidsskalning: samlade, byggde, producerade soldiers
  och angrep alla tre waves. Victory vid cirka 124 s, bas 240 HP. Deep-compare
  verifierade fryst state/input efter vinst; inga runtime-/konsol-/nätverksfel.
  Slutbild granskad i /tmp/w2t-victory.png.
- Granskade slutvillkor/prioritet, systemintegration, delta och scope utan
  blockerande fynd. Docs uppdaterade och Done.

## 2026-10-01 – RTS-015: Restart the complete match

- createMatch skapar oberoende initial gameplay-state och är enda källa för
  matchstart/restart. Scenen startas om via knapp efter game over, städar
  lyssnare/Maps/inputgest och bygger om rendering. Dubbla restart-anrop spärras.
- 137 tester (104 befintliga och 33 nya totalt i körningen), typecheck/build
  passerade på slutlig kod. State/objekt-ägande, reset från båda outcomes och
  ny produktion/ID:n testade. Inga nya dependencies eller testsystem.
- Browsergranskningen hittade en riktig restart-regression: visad/dold knapp
  flyttade canvas 21 px utan att Phaser upptäckte DOM-layoutändringen.
  Resursklick (650, 180) tolkades som (650, 159) och gav move. Scenen synkar
  nu canvasBounds efter DOM-presentation; riktad browserkontroll efter sex
  omstarter gav exakta (650, 180) och gather-order. Ingen mocktest som bara
  speglar anropet infördes; beteendet verifierades i browser.
- Slutlig Chromium-körning spelade naturlig match med riktiga resurser/timers
  till victory (~122 s), bas 240 HP och alla waves besegrade. Restart från
  denna vinst återställde enheter, HP, node/saldo, IDs/timers, byggnader,
  selection/orders, gest/preview och UI. Tre ytterligare fokuserade outcome-
  fixtures (defeat/victory/defeat) verifierade reset från båda utgångarna.
- Efter fyra omstarter spelades ny insamling av 80 wood, barracks-placering,
  samtidig worker-/soldier-produktion med exakt 40 wood debiterat, ID unit-4/5
  och ny soldier-selection/movement. Inga runtime-/konsol-/nätverksfel.
  Slutbild granskad i /tmp/w2t-restarted-match.png. Tidigare naturlig defeat
  verifierades i RTS-013; restart-fixtures ändrade endast outcome-förutsättningar.
- Separat browserkontroll med sex ytterligare fixture-cykler och Chrome
  DevTools Protocol bekräftade exakt en click-lyssnare på var och en av fyra
  DOM-knappar, en av varje pointer-handler, en Escape-lyssnare och 16 initiala
  displayobjekt efter varje restart. Inga kvarlämnade soldier/enemy/barracks-
  renderobjekt eller browserfel. Tillfälliga browserverktyg ligger i /tmp.
- Granskade samlad diff samt nya gameplay-/testfiler för regressioner, scope,
  simultan utgång, ID:n, state-ägande, input/bounds och cleanup. Inga kvarstående
  blockerande fynd. README/GAME_DESIGN beskriver hela matchen; ARCHITECTURE och
  DECISIONS beskriver implementation/balans och medvetna förenklingar.
- Alla 143 dokumentreferenser och git diff --check passerade. Markerade Done.
  RTS-010–015 (sex tasks) klara; RTS-001–009 bevarade. Ingen dokumenterad
  MVP-task kvar. Befintlig bundle-varning kvarstår (~1,39 MB/363 kB gzip).
  Ingen commit eller push.

## 2026-10-01 – RTS-010–015 för commit

- Användaren godkände commit och push av MVP-ändringarna.
- Commitmeddelande: `feat: complete playable MVP with combat waves and restart`.
- `git diff --check` passerade inför commit. 137 tester, typecheck, build och
  browserkontroller är redovisade i implementationsposterna ovan.

## 2026-10-01 – Planering av tribute-roadmap RTS-016–060

- Läste instruktioner, backlog, design, faktisk arkitektur, beslut och logg samt
  kontrollerade match/config/kodstruktur. Arbetsytan var ren; enbart RTS-001–015
  fanns, samtliga Done. Inga task-ID-konflikter eller tidigare planer att förena.
- Lade till 45 Todo-tasks i sex etapper, med detaljerade RTS-016–024, prioritet,
  relativ storlek, beroenden, krav/non-goals, acceptance, tester/browserflöden,
  docs och Primary Chat-etikett. Stora tasks delas under samma ID. Historiska
  tasktexter/statusar bevarades; tillagd metadata är märkt historisk/retrospektiv.
- Current Focus är RTS-016, Todo. Skilde framtida tribute-mål från dagens MVP,
  dokumenterade navigation/footprints, lifecycle/reset, budget-AI, separat
  survival/skirmish, fog utan läckor och assetkontrakt. Öppna val har beslutgrindar.
- Baseline kördes om: 137 tester, typecheck och build passerade. Bundle-varningen
  kvarstår. Tidigare browserkontroller återges som historiska; ingen ny browser-
  session eller manuellt speltest gjordes i denna dokumentationskörning.
- Kontrollerade 60 unika ID:n, 15 bevarade historiska tasktexter, 45 kompletta
  Todo-tasks, topologiska/acykliska beroenden och giltiga lokala filreferenser.
  `git diff --check` passerade. Ingen spelkod, dependencies, commit eller push.

## 2026-10-02 – RTS-016, reproducerbar MVP-baseline

- Påbörjade implementation enligt användarens uppföljning. Bevarade roadmap-
  ändringarna och alla färdiga RTS-001–015; ingen spelkod eller dependency ändrad.
- Miljö: macOS 15.7.4, Node 20.20.0, Chromium 147.0.7727.15 headless via
  tillfällig Playwright i /tmp, lokal Vite på 127.0.0.1:5174. Ingen browser-
  testdependency eller debug-API lades i repot. Tester styrde riktiga mus-/DOM-
  händelser; scene-reference användes endast för observation, utom märkta fixtures.
- Normal victory: dragmarkera tre workers, högerklicka noden (650,180), samla
  till barracks-kostnaden 40, placera vid (512,384), träna högst fyra soldiers
  och ge manuella attackmål vid alla tre waves. Riktiga resurser/timers, ingen
  tidsskalning: victory vid 124,56 gameplay-sekunder, bas 240 HP, waves 3/3,
  alla sex enemies döda. Canvas-/knappinput efteråt ändrade inte fryst state.
- Restart från denna naturliga victory: bas 240 HP, nod 400 wood, saldo 0,
  tre idle/omarkerade workers, inga gamla byggnader/enemies/last/timers/IDs.
  Därefter tre märkta outcome-fixtures för upprepning från båda outcomes.
  Samla 80 wood i nya matchen, avbryt arbetet med move, bygg barracks, starta
  worker/soldier samtidigt: exakt 40 wood debiterat, spawn unit-4/unit-5 efter
  fem sekunder. Välj och flytta ny soldier till (600,500). Alla asserts passerade.
- Normal defeat: samla från start men bygg inget försvar. Basen förstördes
  vid 100,67 sekunder under andra vågen. Öppnad placeringspreview rensades.
  Enheter, ekonomi, timers och waves förblev oförändrade efter canvas-klick,
  högerklick, Escape och även direkt dispatch av blockerade produktionsknappar.
- Layout-/cleanup-kontroll: sex uttryckligen märkta victory/defeat-fixtures
  följda av restart. Exakt en lyssnare per DOM-knapp, pointer-event och Escape,
  16 initiala displayobjekt, inga kvarlämnade enemy/soldier/barracks-objekt.
  Separat layout-fixture visar soldier-knappen för att faktiskt radbryta UI.
  1280 × 720, 520 × 420 och 900 × 500 testades; kontrollraden ändrades från
  21 till 42 px på smal viewport. Scroll upp till x=250/y=120, klickselection
  och move med exakt slutposition fungerade i samtliga fall.
- Tillfälliga layout-scriptet jämförde först page-bounds med viewport-bounds
  utan scroll-offset. Källkontroll av Phaser och korrigerad jämförelse visade
  att detta var ett fel i verifieringsscriptet, ingen regression i spelet.
- Skärmbilder av defeat, victory, omstartad produktion och scrollad canvas
  granskades visuellt. Inga fångade runtime-, konsol- eller nätverksfel.
- 137 tester i 11 filer, npm run typecheck och npm run build passerade.
  Befintliga beteendetester täcker wood-bevarande, ID:n, outcome-prioritet
  och reset. Inga nya regressionstester behövdes: ingen blockerande regression
  hittades i verifierade flöden. Bundle-varningen kvarstår (1 394,29 kB,
  363,35 kB gzip); ingen optimering ingår.
- Avsiktliga begränsningar: fast 800 × 600-canvas kräver scroll i små fönster;
  överlapp ger överlagrade etiketter, manuell targetväxling och rak movement;
  workers/barracks angrips inte. Safari/Firefox och fysisk touch ej verifierade.
  Balansens begriplighet och HUD-förbättringar hör till RTS-017/018.
- Ytterligare naturlig defeat vid 100,65 s följdes av faktisk restart,
  ny insamling av minst 20 wood och worker-produktion till unit-4. Ingen
  fixture eller tidsskalning i denna match; alla asserts passerade utan fel.
- Granskade scope/diff: endast docs uppdaterade; inga ändringar av spelregler,
  dependencies eller tidigare färdig kod. Markeras Done efter godkända checks.
  Nästa task RTS-017, Todo. Ingen commit eller push.

## 2026-10-02 – RTS-017 balans

- Två naturliga Chromium 147-matcher, inga fixtures/tidsskalning. Tidigt försvar:
  barracks 27,03 s, soldier 42,03 s, victory 124,26 s, bas 240 HP. Extra worker:
  worker-start 17,50 s, barracks 36,06 s, soldier 50,28 s, victory 124,08 s,
  bas 240 HP. Alla waves, fryst game-over och input kontrollerade; inga browserfel.
- Tre workers ger första levererade 20 wood runt 17,5 s och 40 runt 27 s;
  leveransflödet är ändligt och last ingår inte i spenderbart saldo. Passiv
  strategi verifierad i RTS-016 samma körning: defeat 100,65 s utan försvar.
- Behöll configkandidaten: båda strategierna hinner före första vågen;
  hypotetiskt senare wave avfärdat som onödig ändring. 400 wood räcker till
  160 wood för barracks/fem soldiers/worker med reserv; slutbalans fortsatt öppen.
- Lade två meningsfulla config-budget/invariant-tester. 139 tester, typecheck,
  build passerade; bundle-varningen kvarstår. Diff/scope granskade, inga fynd.
  RTS-017 Done. Fortsätter direkt med RTS-018, ingen commit/push.

## 2026-10-02 – RTS-018 HUD

- Samlade ekonomi/nod, bas-HP, waves, selection och separata produktionsstatusar
  i DOM-HUD med configbaserade spärrskäl. Reserverade status-/restart-ytor;
  flex/grid radbryter kontroller och canvas-bounds synkas efter layout.
- Rena presentationstester verifierar spärrprioritet, timers, saldo kontra last
  och reset. 142 tester, typecheck och build passerade; bundle-varning kvarstår.
- Chromium: keyboard-Space startar worker, UI behåller selection/orders,
  preview/cancel fungerar, båda timers syns samtidigt, fixture-defeat/restart
  rensar status. Sex fixture-restarts och 1280×720/520×420/900×500 med scroll
  och radbrytning passerade. Skärmbild /tmp/w2t-hud.png granskad visuellt.
- Naturlig victory 124,07 s med bas 240 HP; fryst input/state, restart från
  båda outcomes, ny 80-wood-ekonomi, samtidiga jobb och ny soldier-movement
  passerade. Inga runtime-/konsol-/nätverksfel. Första långa browserförsöket
  avbröts av Vite-reload under sista källjusteringen; hela flödet kördes om
  mot oförändrad slutkod och passerade. Diff/381 referenser granskade utan fynd.
- RTS-018 Done. Fortsätter RTS-019. Ingen commit/push.

## 2026-10-02 – RTS-019 karta

- Handgjord 32-px-arena, sten/vatten till vänster, gemensamma start-/spawn-data,
  klippt nederkant, pure tile/world/body/footprint queries och hinderrevision.
  createMatch äger ny karta. Rendering ligger bakom enheter; ingen pathfinder.
- Fem map-tester verifierar roundtrip/ogiltiga koordinater, partial bottom,
  footprint-rasterisering, kroppskanter, nuvarande fria rutter och reset/revision.
  147 tester, typecheck och build passerade. En initial TS-inferens i testets
  readonly-position-lista korrigerades till Position[][]; alla checks kördes om.
- Chromium naturlig victory 124,75 s, bas 240 HP, alla waves; outcome/restart
  och ny insamling/samtidig produktion/movement passerade utan browserfel.
  Sex fixture-restarts samt resize/scroll-klick/move passerade med nya tiles.
- Granskade map/state/config-diff: inga ändrade balansvärden, starts eller
  tidsregler; inga blockerande fynd. Terrain-placering och påtvingad navigation
  är explicit senare tasks. Bundle-varning kvar. RTS-019 Done, fortsätter RTS-020.

## 2026-10-02 – RTS-020 move-navigation

- Synkron deterministisk bounded BFS, fyra grannar, svept 24-px-kropp,
  säkra exact-point connectors och restdelta över waypoints. Route/intention/
  destination/revision är separata. Ny order ersätter; avvisning stoppar säkert
  och ger svensk feedback. Last/avmarkering bevaras. Global revision återplanerar
  och blockerade routes försöker bara vid ny order/revision.
- Sex beteendetester för detour/otillgänglighet/kanter/corner-cut, tidssteg,
  mid-route revision, orderbyte/last/reset. 153 tester, typecheck/build passerade.
- Chromium: gå runt synlig sten, avvisa mål i sten, märkt helvägg-fixture
  ger unreachable och stillastående; borttagen vägg/revision återupptar korrekt
  destination. Målbyte/avmarkering och fixture-defeat/restart rensar route/map.
  Inga browserfel. Första scriptets HUD-assert väntade inte på frame; korrigerad
  väntan passerade hela kontrollen. Inga produktfel dolda med fixture.
- Diff/scope granskade; inga blockers. Gather/attack ännu raka, explicit nästa
  tasks. Bundle-varning kvar. RTS-020 Done; fortsätter RTS-021 utan commit/push.

## 2026-10-02 – RTS-021 arbetsnavigation

- Workers använder nåbara footprint-approaches och samma routes/restdelta för
  nod/bas/återgång. Kantbaserad 24-px-interaktion kräver kroppssäker position
  och fri linje till kanten. Full/partial last, ny order och avmarkering bevaras.
- Fem nya tester: ingen tidig extraction, utanför-footprint, tidssteg/turer,
  depletion, alternativa sidor/inringad nod, blockerad bas, last/orderbyte och
  conservation. 158 tester, typecheck/build passerade, inklusive full wave-
  integration. Diff granskad utan blockerande fynd; bundle-varning kvarstår.
- Chromium med märkta fixtures: synlig vägg mellan workers/nod, 18-wood-nod,
  två turer och full depletion, inringad bas som stoppar deposition utan
  lastförlust, move/gather efter öppnad väg. Hela slutkontrollen passerade utan
  runtime-/konsol-/nätverksfel. Första scriptet jämförde wood exakt trots
  flyttal, och en senare fixture placerade en kropp 4 px in i testväggen;
  tolerans/kroppssäker fixture korrigerades, inte produktens säkerhetskontroller.
- Bas/nod ingår nu i matchens nav-hinder. Legacy-center-model utan map används
  bara av äldre isolerade tester; faktiskt gameplay har footprint-routes.
  RTS-021 Done, fortsätter RTS-022. Ingen commit/push.

## 2026-10-02 – RTS-022 combat-navigation

- Gemensamma footprint-approaches för soldier/AI/bas med kant-range, target-ID,
  position-trigger/cooldown 0,25 s och omedelbar revisionskontroll. Ingen skada
  genom walls; båda sidors HP-skada appliceras samtidigt, workers-orders bevaras.
- Granskning/tester hittade tile-center pendling i mutual pursuit efter strikt
  segmentvalidering. Rättade safe direct-segment när det är fritt, BFS annars,
  och testar varje passerat segment mot aktuellt target. Regression runt sten
  först reproducerade pendlingen och passerar nu; inget hinderkringgående bypass.
- Åtta nya behavior/regressioner (7 combat, 1 segment) inklusive faktisk
  footprint-match med samtidig bas/last-enemy death. 166 tester, typecheck/build
  passerade. Initial scope/TS-regressioner rättades; checks körda efter fixar.
- Chromium fixture: sealed/open attackväg, mål dödas/routes rensas och fiende
  når/skadar bas. Naturlig full victory 122,12 s med bas 240 HP; fryst state/input,
  restart båda outcomes och ny insamling/samtidig worker/soldier/movement passerade.
  Inga runtime-/konsol-/nätverksfel. Tidiga långtester avbröts under säkerhetsfix;
  resultaten ovan är den kompletta slutkodskörningen. 387 docsreferenser och
  diffcheck passerade. Bundle-varning kvar. RTS-022 Done, fortsätter RTS-023.

## 2026-10-02 – RTS-023 gruppmål

- Stabil numerisk ID-tilldelning från 81 bounded kandidater, 32-px-spacing.
  Kropp/map och individuell reachability testas; ingen duplikat-fallback.
  Ogiltigt centralt klick avvisas. no-space stannar tills nytt gruppkommando;
  revision ger inte central fallback. Gather/attack och omarkerade orders bevaras.
- Fyra tester: unik/stabil tilldelning, edge/invalid click, exhaustion inklusive
  revision, olika reachability/orderbyte. 170 tester, typecheck/build passerade.
- Chromium: två workers producerades via verkliga DOM-knappar/5-s-timers med
  märkt saldo-fixture; fem workers dragmarkerades, fick separata slutpositioner,
  flyttades vid världskant, nytt mål under detour och avmarkering. Fixture-defeat/
  restart rensade allocation/routes. Inga browserfel. Diffcheck passerade,
  inga scope/regression-fynd. RTS-023 Done, fortsätter RTS-024. Ingen commit/push.

## 2026-10-02 – RTS-024 säker placering/spawn

- Preview/slutklick använder samma live-context: saldo, terräng, levande kroppar,
  footprints och hypotetisk connectivity. Skyddar tidigare nåbara workers bas/
  aktiva nod, produktionsutgång och alla konfigurerade wave-entrys basväg.
  Kräver inte reparation av redan avskuren yta. Kostnad/map/footprint är atomiska.
- Gemensamma bounded spawn-kandidater är kroppssäkra och fria från levande
  units/enemies. Färdigt blockerad produktion väntar på timer 0; cache-signatur
  ändras av maprevision eller enheters ID/position. Frigjord plats ger en spawn,
  ingen ny kostnad eller ID innan faktiskt spawn. HUD visar väntans skäl.
- Fem nya placement/spawn-tester plus HUD väntan/game-over-test. Full wave-
  integration uppdaterades att använda faktisk placement-context och maprevision.
  176 tester, typecheck/build passerade. Bundle-varning kvar (~1,41 MB/368 kB gzip).
- Chromium: terräng/worker-overlap avvisas gratis utan selection/orderändring;
  märkt gateway-fixture skyddar resursväg; giltig byggnad debiteras en gång och
  höjer revision. Spawn-occupancy-fixture med riktiga knappar/5-s-timer väntar,
  frigjord plats ger exakt en worker och oförändrat saldo. Restart återställer
  maprevision 0, fyra ursprungliga hinder och rensad väntesignatur. Inga browserfel.
- Naturlig match med actual placement/map/spawn gav victory 122,14 s, bas 240 HP;
  båda outcomes/restarts samt ny ekonomi/samtidig produktion/movement passerade.
  Vid slutreview togs onödig sökning av dold preview bort; hela tests/checks och
  aktiva placement/spawn/browserflödet kördes om efter denna adapterändring och
  passerade. Gameplay-modellen ändrades inte av den sista preview-justeringen.
- Samlad etappdiff granskad för ekonomi/ID/reset/target/revision/bounds/input och
  scope; inga kvarstående blockers. README beskriver faktisk etapp-1-match,
  öppna senare produktbeslut kvarstår i DECISIONS. RTS-024 Done; etapp 1 klar.
  Current Focus RTS-025, Todo. Ingen commit eller push.

## 2026-10-02 – RTS-025

Världen utökad till 1280 × 960; viewport 800 × 600, fast zoom 1 och bounded
mittenmuspan med isolerad selection/placement. Gamla testgränser/väggar
uppdaterades efter att första körningen visat 10 fel från ändrade bounds.
Slutkontroll: 180 tester/20 filer, typecheck och build passerar. Chromium
verifierade faktisk pan till motsatt hörn, movement, klick/reverse drag,
placement i förskjuten kamera, återpan och leverans, fast HUD samt frozen
game over/restart. Saldo och defeat använde tydligt avgränsade fixtures.
Diff granskad för inputkonflikter, listener-cleanup och world-gränser; inga
blockerande fynd kvar. Bundle-varningen kvarstår enligt scope.

## 2026-10-02 – RTS-026

Ren footprint-selection och produktionsbehörighet införda. Unit-träff får
företräde; building/unit-selection är exklusiv och orders fortsätter. Panel
reserverar sina slots och visar endast vald byggnads produktion. 183 tester,
typecheck/build och Chromium passerar. Browser verifierade samtidiga jobb,
blockerad programmatisk aktivering av dold knapp, kameraförskjutet klick,
fortsatt rörelse efter avmarkering samt reset av val/ram. Saldo/defeat fixtures
användes; övrig input var faktisk. Diff granskad utan blockerande fynd.

## 2026-10-02 – RTS-027

Byggnadsvisa rallymål valideras från säker statisk spawn-utgång och ger endast
nyfödda units move-order. Ogiltigt mål behåller tidigare rally med feltext;
senare blockerad route påverkar inte säker spawn eller kostnad. Rally-test
fångade floating-point-rest i advanceRoute; tillräcklig tid snappar nu exakt
till waypoint. 188 tester, typecheck/build passerar. Chromium verifierade
målbyte/avvisning, soldier runt sten, omarkerad spawn, separat worker-rally
utan gathering och reset. Browser-saldofixture rättades från 60 till 80 wood
efter första körningen; inga spelkodsfel i det flödet. Diff granskad utan
blockerande fynd.

## 2026-10-02 – RTS-028

Stop för markerade units, orderfas i HUD och aktiva/blockerade målringar.
Last/saldo bevaras; routes rensas helt och kan inte återstarta på revision.
194 tester passerar; typecheck/build passerar efter explicit markörtyp som
rättade TS-inferens. Chromium verifierade Stop/resume under full-last-leverans,
blockerad route, attack samt completion/game-over/reset. Combat/defeat var
fixtures; leverans kördes naturligt. Återupptagen browserattack rättades att
använda fiendens aktuella position. Diff granskad utan blockerande fynd.

## 2026-10-02 – RTS-029

Gold-gruva och separata saldon, typad last samt byte av resurs med leverans
av tidigare last. Båda footprints ingår i navigation/placement. 203 tester,
typecheck/build passerar. Chromium verifierade naturlig samtidig wood/gold,
partial gold→wood-byte, leverans till korrekt saldo, bevarande per typ och
reset. Defeat var fixture; ekonomin använde faktisk input/tid. Diff granskad
för delade nodmängder, typbyte och navigation utan blockerande fynd.

## 2026-10-02 – RTS-030

Gemensam atomisk kostnadsmodell: worker 20 wood, barracks 40 wood, soldier
20 wood + 5 gold. Knapptexter/spärrskäl följer config. 207 tester,
typecheck/build och diff-check passerar. Chromium separat saldofixture
verifierade wood-/gold-brist, oförändrade båda saldon, exakt debitering,
dubbelstart och en spawn. Naturlig full match med två wood-workers/en gold:
Victory 123,12 s, bas 240 HP, första soldier 59,92 s, fyra producerade/levande,
120 wood och 20 gold spenderat, bevarande per typ och reset utan browserfel.
Första browserrun vann också men dess hårda antagande om fyra överlevande
rättades till spårning av producerade IDs och faktiska kostnader.

## 2026-10-02 – RTS-031

Barracks reserveras med vald worker, kostnad och footprint; 5 s effektivt
arbete efter approach. Stop/orderbyte pausar utan refund, högerklick återupptar
och completion gör builder idle. Produktion kräver färdig byggnad i både UI
och gameplay. 213 tester, typecheck/build och diff-check passerar. Chromium
med saldofixture verifierade workerkrav, tid/progress, spärrad tidig produktion
även via programmatisk knapp, Stop/resume, soldier efter completion och reset.
Matchtestet går genom workerbygge och båda resurser till Victory. Diff granskad
för ghost-progress, reservation, last och listener-cleanup utan blockerande fynd.

## 2026-10-02 – RTS-032

Farms återanvänder workerbygge: 20 wood, 64 × 64, 5 s, max tre med monotona
IDs. Bas-cap 8, farm +5 först vid completion, unit/job 1. Used/reserved härleds
och båda produktionshandlers spärras atomiskt vid full cap. Godkända jobb
slutförs även om cap senare minskar. Builder-ID/order skyddar mot ghost-progress
vid site-byte; ny placering skyddar även tidigare nåbar byggväg.

Slutchecks: 220 tester/27 filer, typecheck/build och diff-check passerar;
ytterligare riktad population-suite (7 tester) passerar efter specificerad
assert för byggväg. Chromium med sjunits-/saldofixture verifierade sista slot,
full-cap no-debit, ogiltig/cancel gratis, farm Stop/resume, cap först efter
completion, ny produktion och reset av model/render/HUD. Diff granskad utan
blockerande fynd efter byggvägsskyddets rättning.

Naturlig full survival med slutlig bygg-/populationmodell: två wood-workers,
en gold-worker som byggde barracks och sedan återupptog resursarbete. Victory
123,63 s, bas 240 HP, första soldier 60,01 s, fyra godkända och spawnade jobs,
tre överlevande soldiers. Spenderat 120 wood/20 gold; bevarande per typ,
restart och inga browserfel verifierade. Tidigare extra slutkontroll räknade
för hårt fyra spawnade före Victory; den rättades att bokföra godkända starter
även om ett jobb skulle vara kvar vid matchslut. Bundle-varningen kvarstår.

Denna fortsättning färdigställde RTS-025–032 i ordning, utan commit/push eller
nya dependencies. Current Focus är RTS-033: produktionskö/cancel/refund.

## 2026-10-02 – RTS-033

Byggnadsvisa FIFO-köer, tre jobb inklusive aktivt, lagrade kostnader och
monotona job-ID:n. Enqueue debiterar/reserverar en gång; cancel head ger 50 %,
köat 100 %, och frigör plats utan dubbelrefund. Kösteget återanvänder säker
spawn/rally och väntar bakom blockerad head. 229 tester, typecheck/build
passerar. Chromium med färdiga byggnader/saldon som fixtures verifierade
samtidiga köer, full kö, head/middle cancel, timer/status, isolerad selection,
reservations, blockerad spawn/cancel/fri utgång och reset utan browserfel.
Diff granskad för FIFO, tidssteg, ID:n/refund och DOM-listener-cleanup utan
blockerande fynd. Bundle-varningen kvarstår.

## 2026-10-02 – RTS-034

Workers och byggnader/projekt har HP och stabila targetreferenser. Död rensar
köer, rally, supply och hinder utan refund; worker-last bokförs som lostCargo.
Builder-död pausar projekt. Cleanup före produktion förhindrar spawn från
byggnad som dör under samma steg. Diff granskad för dubblerad cleanup,
resursbevarande och target-/route-referenser utan blockerande fynd.

237 tester/29 filer, typecheck/build och diff-check passerar. Chromium med
tydligt avgränsade HP-/placeringsfixtures verifierade faktisk enemy-skada mot
lastad worker, byggprojekt, barracks med kö och bas; borttagning, ingen refund,
selection/HUD, reservations och restart utan browserfel. Naturlig hel match
med faktisk insamling, workerbygge, produktion och manuella attacker vann vid
123,24 s med bas 240 HP, tre producerade/överlevande soldiers och tre workers.
100 wood/15 gold spenderat; bevarande per typ inklusive lostCargo och reset
verifierade. Bundle-varningen kvarstår. Ingen commit/push.

## 2026-10-02 – RTS-035

Automatisk acquisition med 140 px leash, stabila ties, reachability och
EnemyVisibility-kontrakt; manuell attack prioriteras, Move avbryter och Stop
håller utan auto. Efter kill väljs nästa mål eller navigation tillbaka.
248 tester/30 filer, typecheck/build passerar. Chromium med combat-fixtures
verifierade verklig melee mot två enemies utan klick, omarkerad soldier,
Move/Stop/manuell målprioritet och restart utan browserfel. Granskning av
orderbyte, target-cleanup, delta 0 och visibilité utan blockerande fynd.
Bundle-varningen kvarstår.

## 2026-10-02 – RTS-036

Attack-move med separata gruppdestinationer, tillfälliga strider och återgång;
workers påverkas inte. Move/Stop/manuell attack ersätter hela ordern. UI-läge
kan avbrytas och rensas vid game over/restart. Granskningen fångade att
gatherings tidiga mapped-move-branch kunde förbruka delta före combat;
attack-move lämnas nu direkt till combat, med regressionstest. Ett testmål
som hann springa bort mot basen flyttades till en faktisk encounter-fixture;
ingen AI-policy ändrades för testet.

258 tester/31 filer, typecheck/build passerar. Chromium combat-fixtures
verifierade faktisk melee mot två enemies och ankomst till originalmål,
selection, Escape, Stop/ny Move, game over och restart utan browserfel.
Diff granskad för orderreferenser, timing och input/listeners. Bundle-varning
kvarstår; ingen commit/push.

Slutgranskning av fortsättningen RTS-033–036: 60 unika task-ID:n,
36 Done/24 Todo, acykliska beroenden, 415 giltiga lokala filreferenser och
bevarade ursprungliga RTS-001–015-texter. git diff --check passerar.
Current Focus är RTS-037 (archer/projektiler). Ingen commit eller push.

## 2026-10-02 – RTS-037

Archer-produktion i blandad barracks-FIFO, stats/speed/range, blå placeholder,
cooldown och fristående icke-homing-projectiles. Samma orders/navigation/
visibility som soldiers, inga resursorders. 272 tester/33 filer, typecheck/build
passerar. Chromium med valuta/färdig barracks och combat-fixtures verifierade
faktisk produktion, blandad kö, dragselection, synliga pilar mot rörliga
enemies i mixed army, Move, terrain-LOS, game over och restart utan browserfel.
Granskningen rättade cooldown-tick under attack-move-färd med regressionstest.
Diff-check passerar; bundle-varning kvarstår. Ingen commit/push.

## 2026-10-02 – RTS-038

Catapult med 40 px clearance, två supply, blandad FIFO, splash/lifecycle och
stationära footprint-targets. 279 tester/34 filer, typecheck/build passerar.
Chromium med färdig barracks/saldofixture verifierade faktisk mixedproduktion,
klick på kroppens ytterkant, Move, siegeprojektil mot building/edge-targets,
skyddad egen worker, hinder-cleanup, blockerad smal passage och restart utan
browserfel. Building/edge-targets var tydligt stationära fixtures, ingen
fiendebas eller AI-ekonomi tillkom. Friendly-fire-testets ursprungliga enemy
melee mot bas ersattes av stationärt target för att isolera splash. Diff
granskad för clearance, jobs/supply, livstid och cleanup; diff-check passerar.
Bundle-varningen kvarstår. Ingen commit/push.

## 2026-10-02 – RTS-039

Byggbar Forge återanvänder workerbygge/HP/cleanup. Ett researchjobb och en
attack-/defensenivå; dynamiska army-bonusar och snapshot av projectile-damage.
Research-boundary delar delta och Forge-död före completion ger ingen bonus.
288 tester/35 filer, typecheck/build och diff-check passerar. Chromium med
valuta/duel-fixtures verifierade verkligt workerbygge, research/timer/kostnad,
bevarad selection, DPS 18→22,5 och mottagen skada 6→4,5 per gameplay-sekund,
Forge-död med aktivt jobb/ingen refund, bestående nivå och restart utan fel.
Första browserkontrollens restart-väntan gick igenom på tre gamla workers;
den rättades att vänta på nytt outcome/research-state och omkörningen passerade.
Granskad timing, dubblering, byggväg och cleanup utan blockerande fynd.
Bundle-varning kvarstår; ingen commit/push.

## 2026-10-02 – RTS-040

Tre upprepningsbara arméfixtures: melee 2,65 s/47,4 HP; mot 72 HP solo
4,65 s kontra melee/ranged 3,30 s, archer oskadad; siege-kluster 3,15 s med
kantmål skadat och utanför oskadat. Inga configändringar behövdes. 291 tester/
36 filer, typecheck/build och diff-check passerar. Chromium naturlig full
match med faktisk ekonomi/workerbygge/tre producerade typer vann vid
126,79 s, bas 240 HP, första soldier 59,90 s, tre producerade/två överlevande.
120 wood/35 gold spenderat; bevarande per typ, lostCargo 0 och reset utan
browserfel. Separat army/låg-bas-HP-fixture verifierade faktisk enemy-defeat,
fryst simulation/input och full render/model-reset med alla typer.
Roller/ekonomi/damage-regressioner granskade utan blockerande fynd.
Bundle-varning kvarstår. Ingen commit/push; fortsätter RTS-041.

## 2026-10-02 – RTS-041

Fysisk 96 px/240 HP enemy-base i URL-valt siege-test, default survival
oförändrat. Återanvänder army-combat och death/hinder-cleanup utan ny outcome
eller enemy-production. 297 tester/37 filer, typecheck/build och diff-check
passerar. Chromium med valuta/färdig barracks-fixture producerade mixed
army och angrep faktisk scenariobas via nåbar approach, förstörde den,
kontrollerade hinder/target-cleanup, ingen förtidig victory/spelarproduktion,
restart i samma scenario och default survival utan browserfel. Granskat
scenario-isolering, ägare/input och footprint/LOS utan blockerande fynd.
Bundle-varning kvarstår. Ingen commit/push; fortsätter RTS-042.

## 2026-10-02 – RTS-042

Ändlig enemy-budget/roster med shared FIFO/cost/supply/spawn, konfigurerbar
job-cost/time och enemy-owned IDs. Producerade units är idle till AI-tasken.
306 tester/38 filer, typecheck/build och diff-check passerar. Chromium
verifierade riktig fyrunitsproduktion/budgetslut, player-saldo orört, faktisk
melee mot producenten under jobb (låg-HP/attacker-fixture), queue-cleanup utan
refund och restart med återställd total budget/IDs utan browserfel.
Testfixturen för frigjord spawn rättades att flytta alla överlappande kroppar,
inte bara en nästan-identisk kandidat; typnarrowing rättades i testet.
Granskning av ID-isolering, cap, blockering, debitering/tid och cleanup utan
blockerande fynd. Bundle-varning kvarstår; ingen commit/push.

## 2026-10-02 – RTS-043

AI muster/ready/attack, tvåunitsgrupper, timeout, 60 s grace/15 s gap,
medlems-/destinations-cleanup och monotona IDs. 313 tester/39 filer,
typecheck/build och diff-check passerar. Granskning rättade fallback till
planRoute när muster saknar cache; regressionstest ingår.

Chromium byggde verkligt farmhinder med worker och försvar med tre soldiers
(valuta/färdig barracks var fixture), observerade två naturliga samlings-/
anfallscykler till 75,20 s/lastDispatch 75,00 s, budget 0, bas 240 HP och reset
utan browserfel. Kontrollen flaggade först passage genom farmens gamla
footprint efter att farmen förstörts; instrumentering visade borttaget hinder
och ändrad revision. Kontrollen följer nu levande footprints och omkörningen
verifierade både blockering och frigjord väg efter död. Ingen navigationkod
ändrades för den observationen. Budget/medlemskap/delta/death granskade utan
blockerande fynd. 433 lokala filreferenser giltiga; historiska tasktexter
bevarade. Bundle-varning kvarstår; ingen commit/push.

## 2026-10-02 – RTS-044

Permanent reserve, max två nåbara defenders, stabil explicit targeting,
borrow/return utan dubbla gruppmedlemskap, dispatch-prioritet och begränsad
replacement. Cleanup rensar även orphaned borrowed-group metadata före
outcome-freeze. 321 tester/40 filer, typecheck/build och diff-check passerar.
Chromium naturlig reserve/produktion plus raid-unit-fixture verifierade
faktiskt försvar/borrow, Move-retreat, återgång till home, en-slot-budget/
låg-HP-attacker-fixture med riktig melee och replacement efter 5 s/exakt
20 wood/5 gold, nytt ID/reserve, basdöd och reset utan browserfel.
Testet för budgetslut räknar producerade IDs separat från ändliga waves,
som fortfarande är avsiktligt aktiva i siege-test. Granskat hot/visibility/
reachability, transfer, återgång, budget och death-cleanup utan blockerande
fynd. Bundle-varning kvarstår; ingen commit/push. Fortsätter RTS-045.

## 2026-10-02 – RTS-045

Separata Survival/Skirmish-konfigurationer, enkelt lägesval, mode-specifik
outcome-policy och restart. 328 tester/41 filer, typecheck/build och diff-check
passerar. Granskning rättade scenario-parametern till HUD; browser-smoke
verifierade Skirmish-texten efteråt. 437 lokala referenser verifierade.
Chromium vann naturlig Skirmish efter riktig ekonomi/barracks/tre soldiers
vid 104,88 s, bas 240 HP, tre soldiers kvar; inga waves. Naturlig Survival
med soldier/archer/catapult vann vid 127,44 s, bas 240 HP, två stridsunits
kvar, resursbevarande och reset. Low-HP/army-fixture verifierade faktisk
enemy-melee till Skirmish-defeat, fryst simulation/input och samma mode/reset.
Första browserskripten väntade på ändrat scenfält innan Phaser-restart var
färdig och gav felaktiga resultat; rättad väntan följer ny fysisk match.
Omkörningar passerade utan browserfel. Defeat-prioritet och mode-isolering
granskat/testat utan kvarstående blockerande fynd. Bundle-varning kvarstår.
Ingen commit/push; fortsätter RTS-046.

## 2026-10-02 – RTS-046

Easy/Normal/Hard väljs separat från mode och behålls på restart. Bounded
enemy-budget/cap/timer, grupptryck och wave-schedule; player/combat/priser
oförändrade. 336 tester/42 filer, typecheck/build och diff-check passerar.
Isolerade profiler, verklig budget/cap/debitering, första dispatch-tid och
alla sex kombinationer testade. Normal är config-ekvivalent med RTS-045:s
naturliga vinstspeltester (104,88 s Skirmish, 127,44 s Survival).
Chromium jämförde alla sex mode/profil-kombinationer: rätt verklig första
produktionstid, budget/kostnad, faktisk wave-spawn, dispatch och full reset
samt live UI-byte. Clock/ready-fixtures märktes för tryckgränser; första
kontrollen antog en anfallsgrupp redan när endast reserve hade spawnat.
Rättad väntan på verklig grupp passerade; inga browserfel. Regressionstestets
fulla state-jämförelse uppdaterades för nytt durationSeconds-fält. Profiler
granskat för mutation, costs, queues, scenario/outcome/HUD utan blockerande
fynd. Easy/Hard är preliminära; ingen full match-seger på dessa profiler
påstås. Bundle-varning kvarstår; ingen commit/push. Fortsätter RTS-047.

## 2026-10-02 – RTS-047

Rena minimap-koordinater/indikator, färska data/filter och separat DOM-canvas
för camera-click med listener-cleanup. 340 tester/43 filer, typecheck/build
och diff-check passerar. Chromium verifierade fyra hörn/centrum, selection/
orders bevarade, faktisk world-move efter minimap-pan, enemy-marker bort vid
scenario-byte och tre restarts utan browserfel. Klickfixtur rättades att
använda innehållet i canvas, inte en punkt utanför dess paddingbox. Browser
verifierade exakta centrum/kanter efter CSS-border-konvertering. Granskning
av conversion, snapshots, UI-isolering och shutdown utan blockerande fynd.
Bundle-varning kvarstår; ingen commit/push. Fortsätter RTS-048.

## 2026-10-02 – RTS-048

Teamvis 32-px fog-grid med explored, levande/färdiga observers och avgränsad
rock-LOS-policy. Bara märkt player/enemy-preview; normal fog aktiveras först
efter RTS-049-filtrering. 346 tester/44 filer, typecheck/build och diff-check
passerar. Tester täcker union/radiuskant/clip, LOS, team-byte, död/delta 0,
completed buildings, water-policy, explored/immutability/reset. Legacy zero-
delta-fixture utan fog behåller sin shape. Testets builder-fält rättades.
Chromium observer-position-fixture följd av faktisk click/move verifierade
utforskning, lämna-vision, death-cleanup, explored bevarat/reset, enemy-team
isolering och inget overlay i normalt spel utan browserfel. Modell/render-
granskning av observerlivstid, config/LOS och preview-gate utan blockerande
fynd. Ingen enemy-memory införs. Bundle-varning kvarstår; ingen commit/push.
Fortsätter RTS-049.

## 2026-10-02 – RTS-049

Aktiv fog i båda modes; gemensam visibility över renderer/HP/labels/order-
markers, minimap/terrain, HUD/resursmängder, input/placement, combat/AI och
projektiler. Explicit target försvinner till idle, auto return/resume behålls.
Placement kräver full-footprint-current-vision. 357 tester/45 filer,
typecheck/build, diff-check och 446 filreferenser passerar.

Chromium combat-unit-fixture verifierade hidden enemy utan marker/HP/click/
acquisition, reveal→faktisk attack→vision loss utan tracking/skada→återupptäckt
med aktuell HP, minimap/order-mask och scenario-reset. Naturlig aktiv-fog
Skirmish vann vid 106,76 s (bas 240, tre soldiers), Survival blandad army
vann vid 126,64 s (bas 240, två survivors, tre workers, wood/gold bevarat,
reset). Resurser upptäcktes först med faktisk move före gather-order.

Granskning rättade resource-gate, neutral depletion-färg, preview-depth,
minimapens tidigare enemy-footprint som terrain och opak unknown-mask.
Överflödig pre-update fog slopades efter att full 4500-step regression nått
5 s test-timeout; samma regression passerar därefter utan höjd timeout.
Granskning hittade även indirekt siege-death-läcka via flight-livstid. Siege
använder nu observerad footprint/fixed aim oberoende av hidden/dead target;
impact provar visibility före live HP/position. Ny regression och browser
med fixed-shot-fixture passerar. Arrow-policy behålls. Senaste browser-rerun
verifierade filtreringen och sista siege-rättningen utan fel. Ingen full
naturlig matchomkörning efter den isolerade shot-policy-rättningen påstås.
Inga kvarstående blockerande fynd. Bundle-varning kvarstår; ingen commit/push.
Fortsätter RTS-050.

## 2026-10-02 – RTS-050

Shift-click toggle/drag-add, live own ID-grupper Ctrl/Cmd+1–9 och recall 1–9,
pure focus-guard, death-pruning och fresh restart. 372 tester/47 filer,
typecheck/build och diff-check passerar. Chromium currency-fixture följt av
faktiskt workerbygge och soldier/archer/catapult-FIFO verifierade Shift-
klick/reverse-drag, tom Shift-gesture, group bind/recall utan ändrade orders,
UI/text-focus, death-fixture med riktig cleanup, freeze/reset och exakt en
keyboard-listener efter restart utan browserfel.
Granskning av world/screen-modifier, byggnadsexklusivitet, ID-validering,
fokus/repeat/modal och shutdown utan blockerande fynd. Related visibility-
regression rättade cleanup som annars släppte legitima explore-goal-caches
varje frame; regression verifierar waypoints/cache och ingen dold bas-skada.
Bundle-varning kvarstår; ingen commit/push. Fortsätter RTS-051.

## 2026-10-02 – RTS-051

Config-driven svensk guide/knapp-labels, kontext-hotkeys via samma aktiverade
knappar och återanvänd cost/order-gate. 376 tester/48 filer, typecheck/build
och diff-check passerar. Chromium riktig explore/gather/Stop följt av
currency-fixture med riktigt workerbygge, soldier/worker-key-production,
attack-move/Stop, repeat/UI-focus/text/game-over och restart verifierade
debitering exakt en gång och inga browserfel. Guide/labels motsvarar mapping.
Browser-granskning hittade riktig snabb Escape/B-kapplöpning: Phaser-köad
Escape kunde cancella senare synkron B. Escape flyttades till gemensam
window-action-listener med focusguard; snabb synkron B→Escape→B följd av
faktisk placement verifierades i omkörning. Inga duplicerade Escape-listeners.
Pause-guard är unit-testad och kopplas till live lifecycle i RTS-052.
Command-context, ekonomiväg, eventordning, cleanup och focus granskade utan
kvarstående blockerande fynd. Bundle-varning kvarstår; ingen commit/push.
Fortsätter RTS-052.

## 2026-10-02 – RTS-052

Ren session-state med menu/start/playing/paused/ended/resume/restart/new-
match och mode/profil/enda karta före Start. Model-pause stoppar all cleanup/
simulation; första resume/start-frame skippar delta. Alla gameplay-handlers
och keyboard använder phase-gate, UI fieldset spärras, menu/guide/minimap
fungerar fortsatt. 383 tester/49 filer, typecheck/build, diff-check och
450 lokala referenser passerar.

Chromium verifierade alla sex startval, faktisk worker-construction och
player/enemy-production plus slow fixed-shot-fixture under 1,5 s pause,
identisk hela model-JSON utan input/debit, tillåten minimap-camera, resume
utan catch-up, P/Escape-prioritet, outcome/reset/new-menu och enkel worker-
debit efter många scenes, utan browserfel. Första browsern hittade NaN
world-input när canvas visades efter hidden menu; ScaleManager.refresh vid
show rättade displayScale och nästa klick gav exakt (520,300). Fixture
väntar också på verklig construction-progress efter worker-approach, så paus
verifieras mitt i arbete snarare än före det.

Det gamla 4500-frame full-match-testet nådde 5 s under samtidiga checks/
browserlast; gav just denna integration en explicit 10 s timeout. Inga
beteendekrav togs bort; omkörning hela suite passerade på 4,81 s. Tidigare
RTS-049-optimering med färre fog-pass behålls. Guards, pending-restart, val,
wall-time och renderfreeze granskade utan blockerande fynd. Bundle-varning
kvarstår; ingen commit/push. Fortsätter RTS-053.

## 2026-10-02 – RTS-053

Egna 32-px tiles och 64-px wood/gold-states från repo-pixelkällor/palett till
RGBA PNG/atlas/manifest. Nearest/native anchors, ingen logic/dependency-
ändring. 388 tester/50 filer, typecheck/build och diff-check passerar.
Exportartifacttest använder Node fs/zlib i tests/*.mjs; första placeringen
under src/*.ts krävde oinstallerade Node-typer och flyttades för att bevara
strict browser-TypeScript utan nya dependencies. Native format/transparens/
palett/bounds/ID/walkability/config/anchors verifierade; atlas visuellt
granskad. Node-logical-footprint är faktiskt 40 px, vilket bevaras.
Chromium verifierade nearest-filter 1, 1200 tiles och origin (.5,.625), pan
alla världshörn/minimap/fog, quantity-fixture 10 wood/10 gold följt av verklig
gathering/depletion-frame/delivery för båda, fresh reset tillbaka 400/300 och
available-frames, utan browserfel. Ingen full 400/300-depletion påstås.
Source/provenance/rätt till projektbruk dokumenterad utan extern art.
Granskning av native alignment/render-only rounding, resource-state/fog och
export determinism utan blockerande fynd. Bundle-varning kvarstår; ingen
commit/push. Fortsätter RTS-054.

## 2026-10-02 – Checkpoint RTS-037–053

Användarens tillägg läst vid task-gräns. Commit/push är godkänt efter varje task. Checkpoint omfattar färdigt arbete RTS-037–053; RTS-054 har ännu ingen implementation och står Todo. Skärpta assetkriterier granskas i den fortsatta körningen; särskilt sammanhängande terrängövergångar kompletteras innan grafiken rapporteras färdig. Pages införs först efter RTS-060:s releasekontroller; RTS-061–090 planeras utan implementation.

## 2026-10-02 – RTS-053 komplettering och leveranspolicy

Checkpoint 4face75 pushad main. Skärpta terrängkrav kompletterade med åtta övergångsframes (strand/berg), inga interna patchsömmar och enhetlig gräsgrundton efter screenshotgranskning. 389 tester/50 filer, typecheck/build/diff-check godkända. Chromium: nearest/anchors/terrain, pan/fog, wood/gold-depletion och verklig leverans (10-enheters fixture), reset; inga browserfel. Screenshot granskad, befintliga labelöverlapp och geometriska units/buildings kvar till respektive assettask. AGENTS/roller uppdaterade med godkänd commit/push-policy; RTS-061–065 detaljerade, 066–090 kort planerade, inga nya system implementerade. RTS-060 kompletterad med Pages-grind; ingen deploy-workflow aktiverad ännu.

## 2026-10-02 – RTS-054

24 egna byggframes/teamvarianter, tre stadier, originalkällor/palett och RGBA-export. 392 tester/51 filer, typecheck/build/diff-check passerade. Chromium verifierade verklig construction för barracks/farm/Forge genom alla frames, preview-cancel utan kostnad, exakt placeringkostnad, barracks-selection med 64-px-ring, death cleanup för alla spelbyggnader/bas, fiendebasens röda sprite/reveal/hide och restart. Currency/positions/HP var tydligt avgränsade fixtures; gameplay-loopen drev byggprogress och cleanup. Första browserfixture använde fel worker-ID; rättades till befintligt unit-3 och hela omkörningen passerade utan browserfel. Atlas och screenshots av basbygge/fiendebas granskade: skarpa native silhuetter och lagfärger, oförändrade footprints; worker-labelöverlapp kvar till kommande presentationsarbete. Diff granskad utan blockerande fynd. Bundle-varning kvarstår. RTS-053 b989109 pushad; nästa RTS-055 efter denna commit/push.

## 2026-10-02 – RTS-055

960 egna unit/team/facing/state frames, 8 FPS och separerad bounded death-rest efter logical removal. 399 tester/53 filer inklusive sheet/manifest/mapping och motion/visibility/death-lifecycle, typecheck/build/diff-check passerade. Chromium verifierade faktisk user move/walk-frameprogress, worker bygge/produktion av soldier/archer/catapult, gathering, melee/ranged/splash-projectiles och borttagning med 0,5 s death; åtta facing/strid/HP/valuta isolerades med tydliga fixtures. Hidden enemy death gav ingen rest; pause/tid och restart cleanup passerade, inga browserfel. Native atlas och stridsscreenshot granskade: fyra typer/team läsbara; täta HP/last-labels kan överlappa och förbättras i RTS-057. Granskning hittade pausrender som kunde byta walk till idle trots fryst tid; guard bevarar föregående frame under inaktiv session. Ingen animation driver damage/progress. Bundle-varning kvarstår. RTS-054 255adc1 pushad.

RTS-055 slutlig omkörning: 399 tester, typecheck/build/diff-check godkända; hela Chromium-flödet omkört med exakt jämförelse av frame-lista och tid under paus, passerade utan fel.

## 2026-10-02 – RTS-056

Sex originalsyntetiserade ljud/komposition, WAV-masters och Vorbis+WAV, singleton Web Audio med gesture/mix/mute/pause/lifecycle och publik eventpolicy. 404 tester/55 filer, typecheck/build/diff-check passerade. Systemets afconvert kunde inte exportera Opus; tillfällig soundfile-verktygsmiljö under /tmp användes för Vorbis, ingen npm/runtime-dependency. Chromium avkodade alla 12 alternativ, musik OGG 16,016 s/WAV 16 s (codec-padding), inställningar/mute, command/public HP, dold enemy-damage tyst, suspend/resume, restart/single music, terminal effect/menu och deliberate OGG-404→WAV-fallback. Första kontrollens 10 ms durationtolerans var för snäv; padding mättes och musiken loopar nu explicit 16 s. Ingen akustisk lyssning utförd i headless browser; graf/avkodning/gain verifieras. Granskning rättade restart som annars kunde stoppa musiken utan att starta ny. Aktivera ljud tillåter retry. Bundle-varning kvarstår. RTS-055 2fd1927 pushad.

RTS-056 slutliga checks: 404 tester/typecheck/build/diff-check passerade; browser omkörd efter loop/retry-fix. Faktiska gain-värden blev 0/0 vid mute och 0,12/0,08 efter mixreglagen (mätta efter renderkvantum). Debugimport efter HMR skapade separat ljudinstans; browserhook rättades till samma exakta Vite-modul som appen. Inget produktionsfel av den fixture-importen. Hela fallback/lifecycle/fog-flödet passerade igen.

## 2026-10-02 – RTS-057

Originalpanel/åtta ikoner/impact+splash-sheet; trä/mässing, native units/teamfärger, pressed/disabled/hover/focus, scroll-HUD intill 800×600 world. HP-staplar ersätter överlappande unitlabels, endast markerade workers visar last. 409 tester/57 filer, typecheck/build/diff-check godkända. Två fulla naturliga Chromium-matcher utan valuta/HP-fixtures: Skirmish seger 104,69 s, bas 240 HP, tre soldiers; Survival 128,50 s, bas 240 HP, soldier/archer/catapult producerade, två överlevande, 400/300 resurskonservation och reset. Nytt skin-fixtureflöde verifierade walk/build/produktion/gathering, åtta facing, faktisk melee/ranged/splash, synliga impactframes, fogged death, pause och restart utan browserfel. Ekonomi-/bas-/stridsscreenshots granskade vid 1280×900 och native atlas; cargo-text flyttades upp för att inte korsa HP-stapeln. Kort bredare fixture använde currency/position/HP enbart för presentation; naturliga fullmatcher gjorde det inte. 90 backlog-ID:n/historik/acykliska beroenden och 495 filreferenser godkända. Bundle-varning kvarstår. RTS-056 ad70db4 pushad.

RTS-057 slutlig verifiering: 409 tester/typecheck/build/diff-check godkända; Chromium 1280×900/1024×768 native canvas, korrigerad cargo-offset, B/Escape pressed-state, Ctrl+1/recall, P-pause och minimap utan ordermutation passerade. Desktop/small screenshots sparade; mindre viewport använder dokumenterad staplad layout.

## 2026-10-02 – RTS-058

Tre explicita missionsconfigs/instruktioner/startresurser, återanvänd arena och objective-policy inklusive exakt 90 s deadline/defeat-prioritet. 417 tester/58 filer, typecheck/build/diff-check passerade. Naturliga Chromium-playthroughs utan injected valuta/HP/clock: Skogsvakten seger 129,29 s (tre typer producerade, en combat-survivor); Belägringen 88,32 s (tre soldiers/tre överlevande); Utposten exakt 90 s (tre typer/tre överlevande). Alla bas 240 HP, första-armé 41,64 respektive 23,68 s för wave/outpost; wave/outpost-resursledger bevarar 400/300 plus mission-start. Restart använder 20/10 eller 40/10 igen, inga gamla progress. Separat browserfixture kontrollerade samtidiga win/defeat-villkor i alla missions: defeat, game-overfreeze, restart och menu-isolering; inga browserfel. Terminaltexter använder objective, inte en felaktig generell waves-text. Konfigurerad normalbalans spelbar; övriga profiler verifieras i release-matris, inga fler kartor eller typer tillagda. Bundle-varning kvarstår. RTS-057 1c20277 pushad.

## 2026-10-02 – RTS-059

Version 1/tribute-config-1, en manuell origin-local slot, ingen autosave/import/export. Komplett gameplay/view-snapshot, bounded/strict validering och referens/config/clearance-kontroller före atomic scene-byte. Navigation/blocked-spawn/render/audio caches undantas, current fog rekonstrueras, loaded live match pausad utan wall-time. 441 tester/59 filer (alla fem modes/tre profiler, jobs/laster/bygge, upgrade/farms, AI/projectile, terminal, version/broken refs/fog/map/prototype/counter, quota/getter/atomicitet), typecheck/build/diff-check godkända. Första roundtrip hittade oavsiktliga map-obstacles/revision i fog-factory via spread; factory har nu enbart deklarerade dimensioner och fyra flaggarrayer, inga gamla mapcaches. Maporder bevaras efter kontroll mot härledda footprints för exakt roundtrip.

Chromium utan injicerad gameplay-state: verklig wood-gather → barracksbygge + workerjob → Save/pause → sidreload/Load → bevarad byggtid/kö/tid/saldo → resume/exakt en spawn → producera archer → faktisk projektil i strid → pause/Save/reload/Load → identisk projectile/HP/orders/cargo → resume och fresh mission-restart. Framtida/trasig save och quota var avgränsade felfixtures, aktiv match oförändrad; inga browserfel. Första browserpredicate antog att valfria projectiles alltid fanns före första skottet; rättades och fullflödet passerade. Getterfel fångas inom storage-fasaden; UI visar läsbara felfall. Granskning inkluderade små positiva HP/lifetimes, counters/historiska projectile-IDs och UTF-8-size. Bundle-varning kvarstår. RTS-058 2fc4743 pushad.

RTS-059 slutlig verifiering: 442 tester/59 filer, typecheck/build/diff-check passerade. Ny siege-roundtrip ger exakt samma 24 damage som obruten simulation och ingen andra impact. Hela naturliga browserflödet omkört med ändrad kamera/byggnadsselection: Load bevarade båda, fortsatt atomiska future/corrupt/quota-fall, resume och restart utan fel. Dokumentreferenser/90-ID-roadmap granskade.

## 2026-10-02 – RTS-060

RTS-059 7496938 pushad. Releaseprofil/budget fastställd innan mätning: Chromium 147 desktop/macOS arm64, native 800×600 i 1280×900 och 1024×768; andra engines/mobil ej verifierade. 15 nya beteenderegressioner spelar fem modes × tre profiler med legala commands, betald ekonomi/produktion, synliga targets, pause/save vid 45 s, conservation/freeze/restart. Alla 15 vann, inga gameplaybalansändringar. Browser körde samma accelererade modell/render-matris plus riktiga DOM-val, terminal Save/Load/restart och menu; detta är separat från fem tidigare naturliga Normal-UI-matcher. Tidiga strategiförluster rättades med wood-first/samlade attacker, inte extra resurser/HP.

Ren projektkopia: npm ci (49 packages/audit 0 vulnerabilities), 457 tester/60 filer, typecheck/build godkända. Slutligt repo: samma 457 tester, typecheck/build/diff-check godkända. Lokal dist under /warcraft-2-tribute/: canvas/selection/move, save/reload/load, resume, tio DOM-restarts, 12 ljudavkodningar (OGG/WAV), två viewportar, inga 404/runtimefel. UI-status från gammal Load rensas vid fresh start/restart och ändras vid resume; browsercheck efter Load använder Resume-knappen eftersom tangentinput över fokuserad knapp avsiktligt blockeras. Uppdaterad clean-kopia med slutlig scen klarade typecheck/build.

Målbelastning 23 own +12 enemies: scene-update inklusive HUD p95 3,20 ms, RAF p95 17,20 ms, GC-heap 9,33 MiB. 64-unit-stress: 4,00 ms/17,20 ms/10,16 MiB. Tio restarts 8,70 →9,58 MiB (+0,88). Enskild route/frame max 48,10 ms i målbelastning; p95-budget uppfylld. JS 1 504,50 KB/gzip394,71 KB; dist3232 KiB på disk. Alla fastställda budgetar passerade; bundle-varning kvar enligt non-goal. Screenshots granskade, inga blockerande diff-/referensfynd. Detaljer och matris i [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md).

Först efter dessa lokala checks skapades [Pages-workflow](.github/workflows/pages.yml) med officiella SHA-pinade actions, push main/workflow_dispatch, npm ci/test/typecheck/build före artifact/deploy, begränsade jobbehörigheter och pages-concurrency. Vite base/preview och BootScene-atlas/manifest rättade för publicerad subpath. Pages-publicering är godkänd; Actions/publicerad browser följs upp efter denna task-commit/push. Localhost-saves flyttas inte mellan origins. RTS-001–060 Done, 061–090 Todo; fortsättningen implementeras inte i denna körning. Kvar: andra browsermotorer/mobil, akustisk lyssning, framtida fraktions-/förmågebeslut och medvetna små-RTS-begränsningar.

RTS-060 `6606f0e` pushad till main. [Actions 37009719240](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37009719240) success: npm ci/test/typecheck/build/configure/upload och deploy godkända. [Pages](https://tobisen.github.io/warcraft-2-tribute/) verifierad i Chromium: native canvas/selection/move, basrelativa sprites/CSS, 12 OGG/WAV-avkodningar, save/reload/load/resume, tio DOM-restarts, två viewportar utan request/runtimefel. Publicerad load-fixture klarade också CPU/frame/minnesbudget. Slutlig 15-fallsmatris omkörd mot lokal dist med separat temporär testbundle, alla segrar och terminal Save/Load/restart/menu passerade. Ingen debug-/testbundle ingår i publicerade dist.

Publicerad naturlig Utposten/Normal: verkliga klick/drag, wood/gold-gather/delivery, barracksbygge, betald soldier/archer/catapult, strid mot alla tre vågor → Victory exakt 90 s → fresh restart. Bas240, tre workers/tre combat-units kvar, första soldier23,55 s, kostnad120 wood/35 gold, totalledger440/310, lostCargo0, inga browserfel. Två tidigare Pages-omkörningar vann men extra armétyp-assert föll: testskriptets fördröjda locator-klick använde gamla koordinater på rörliga enemies och kunde ge markorder åt även workers. Färsk snapshot precis före snabb fysisk mouse.click rättade testflödet; ingen ändring i spelkod eller armétyp-krav behövdes i slutlig omkörning. Screenshots av publicerad ekonomi/bas/combat/outcome granskade. Detta dokumentationsuppföljningscommit ändrar inga runtime-/test-/workflowfiler.


## 2026-10-02: RTS-061

Pages verifierad först enligt användarens nya godkännande av RTS-061–065; AGENTS/roller uppdaterade. 457 tester/60 filer, typecheck/build/diff-check passerade. Publicerad canvas/assets/ljud/save/reload/load/tio restarts och viewportar omkörda. Ny legal accelererad armé: 12 combat-units blandat soldier/archer/catapult +3 workers, betalda340 wood/80 gold, 279,20s; save/load bevarade15 units. Bekräftade P2: centrumavstånd0,322px och samtidiga workers utan servicekö. P3: minimap ej keyboardfokus. Inga blockerande/P1-fynd; QA_REVIEW.md innehåller steg/miljö/förväntat/faktiskt/prioritet. Ingen gameplaykod eller test för enbart dokumentation.


## 2026-10-02: RTS-062

RTS-061 26aff93 pushad. Inga bekräftade blockerande/P1-fynd, därför tom fixlista och ingen onödig kodändring. QA-001/002 prioriterade till sina avgränsade RTS-063/064, P3-minimap kvar. 457 tester/60 filer, typecheck/build/diff-check passerade; ingen save/config-migration eller nya spegeltester. Runtime identisk med verifierad Pages.


## 2026-10-02: RTS-063

RTS-062 b3317dd pushad. Pure body-separation + numerisk config integrerad efter gameplayadvance och före final fog. 463 tester/61 filer, typecheck/build/diff-check passerade; alla15 scenario/profile-vinster bevarade. Sex nya tester: budget/delta0, coincident/mixed bodies, ID/permutation, stora/små steg, world/terräng/smal passage,20-unit-trängsel och pause/save/reset/order/cargo. Regression hittade att cacheinvalidation tog bort no-space-fel; blockerade commandresults bevaras nu. Grupp-testets gamla positionsfrysning uppdaterad till rätt kontrakt: separation får flytta kroppar men inga nya goals/auto-retries/continuing orders.

Browser med betald12-combat/3-worker-armé: idle-arméns mincentrumavstånd24,24px (tidigare0,322px), wood340/gold80, time277,20s. Workers i rörelse hade23,24px kortvarigt; initial all-unit-assert var för strikt för soft correction och verifierar nu stillastående armé separat. Save/load/resume och riktig drag/gruppmove nådde idle i öppet fält; inga browserfel, screenshots granskade. Ingen ny save-data eller ekonomi/balansändring. Bundle-varning kvar.

## 2026-10-02: RTS-064

RTS-063 bc9e3db pushad. Resurskö och passageinsläppning är Phaser-fria, härledda och konfigurerade; save/config-version 1 bevaras. Sju nya beteendetester plus regression för save/load av åtta workers. 470 tester/63 filer, typecheck/build/diff-check godkända; alla 15 releasekombinationer vann. Tidig köimplementation ändrade approach även för få workers och skirmish/hard förlorade; kö aktiveras nu först vid överefterfrågan, vilket bevarar tidigare timing. Ett äldre integrationstest antog fri byggplats varje frame; det väntar nu på giltig placement och kräver fortsatt victory och full resource ledger.

Chromium 147/local production: explicit åtta-worker-fixture, fiendens produktionsbudget satt till noll för isolerad trängselkontroll. Riktig drag/right-click → gather, samtliga åtta fick last, Save/Load återskapade samma tjänsteplatser, 338,8 gameplay-sekunder → nod0, last0, saldo400, alla idle. Wood-ledger kontrollerad varje steg. Tolv motriktade passagekroppar, en borttagen under körning, resterande elva kom fram inom 120 s utan terränggenomgång eller kvarvarande lås. Inga browserfel; queue-screenshot granskad. Första browserförsöket hade Phaser-scenen pausad under musinput och samlade inget; rättad harness aktiverar input före verkliga kommandon. Fixtures ska inte förväxlas med tidigare betald armékontroll. Diff granskad för scope, delta, order/cargo, cache, fog och save; inget blockerande fynd kvar. Bundle-varning oförändrad enligt scope. Nästa task RTS-065: mätning före eventuell optimering.

## 2026-10-02: RTS-065

RTS-064 ca3ecbf pushad. Budget/miljö/64- och128-kroppars fixtures dokumenterade före mätning. Före: CPU p95 43,90/91,90 ms; render0,70/0,80; FPS34,03/23,53; heap9,27/11,92 MiB. CPU-sampling pekade på findRoute under combat approachRoute, särskilt efter separationens generella cacheinvalidation. Två begränsade optimeringar: behåll kroppsgiltig nästa moving-sträcka och pruna approach-kandidater med rak lower bound, med bevarad tie-ordning. Inga balans/order/save-formatändringar. Sex golden routes från föregående commit och regression för clear route/displaced arrived bevarar beteendet. Två nya mixed-load-integrationer kontrollerar positioner/terrain, wood-ledger, dold fjärrpunkt, pause/reset. Tidig load-assert antog att enemy base alltid var dold, men framryckande units avslöjar den korrekt; testet kontrollerar en faktisk fjärrpunkt.

479 tester/65 filer inklusive alla15 legala scenario/profile-segrar, typecheck/build och diff-check godkända. Save-regression kontrollerar samma serviceslots/orders/cargo/ledger och begränsad rörelse efter cache-rebuild, inte identiska tillfälliga navigation-caches. Första cacheoptimeringen nådde bara23,10/77,30 ms p95; lower-bound pruning behövdes också. Slutlig profil med incheckningsbart scripts/profile-browser.mjs och oförändrade budgetasserts: 64 CPU8,50/render0,70/RAF17,30/FPS59,40/heap9,88;128 CPU24,50/render0,80/RAF34,30/FPS39,37/heap11,26. Minst300 samples efter60 warmup. Extra30s verklig128-belastning: heap10,33→11,27 (+0,94); tio DOM-restarts8,37→9,39 (+1,01), max10,29MiB. JS1512,93KB/gzip397,31KB; dist3240KiB. Alla definierade budgetar passerade; 128-stress är fortfarande cirka39FPS. Metod och före/efter i PERFORMANCE.md, inga testbundles/debughooks i appdist.

Slutlig browser: åtta-worker-queue/save/load/338,8s och12-kroppars passagefixture omkörda med aktuella gameplaymoduler; nod0/last0/saldo400/allaidle. Betald12-combat+3workers med340wood/80gold, 280s, mincentrum24,07px; save/load/drag/groupmove passerade. En catapult hade ännu25px kvar efter harnessens gamla hårda6s-väntan; verifiering väntar nu på faktisk ankomst med20s gräns. Alla kom fram, ingen kodändring för att kringgå detta. Production subpath/assets/canvas/12audio-decodes/save/reload/load/resume/tio restarts/två viewportar utan fel. Screenshots granskade.

Publika Actions-annoteringar visar att tidigare RTS-063/064-builds stoppade vid npm test: match.test.ts:102 överskred10s för4 500 gameplayframes. Ingen behavior-assert eller deploy-konfiguration föll. Integrationsbudgeten höjd till30s för detta fall och nya loadfall; särskild browser-CPU-budget oförändrad. Ny CI/Pages-resultat följs efter push. Workflow/deployment/dependencies ändras inte. Diff granskad för clearance, delta, ties, cache/load, bodyconservation, fog och scope; inga blockerande lokala fynd kvar. Nästa planerade task RTS-066, utanför godkänd061–065-etapp; inga fraktions-/sjöfeatures införda.

RTS-065 d85b754 pushad. [Actions 37021939019](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37021939019) completed success: npm ci/test/typecheck/build och Pages-deploy passerade; tidigare CI-timeout är löst. [Pages](https://tobisen.github.io/warcraft-2-tribute/) serverar index-otNC-_fR.js med exakt samma SHA256 som testad lokal dist. Publicerad naturlig Utposten/Normal med riktiga klick/drag: wood/gold → barracksbygge → betald soldier/archer/catapult → tre vågor → Victory exakt90s → restart. Första soldier23,64s, bas240, tre workers och två combat överlevde, en combat dog; kostnad120wood/35gold, ledger440/310 och lostCargo0. Därefter publicerad canvas/assets/12audio-decodes/save/reload/load/resume/tio restarts/två viewportar utan request/runtimefel. Screenshots granskade. RTS-001–065 Done; 066–090 fortsatt Todo och inte implementerade. Dokumentationsuppföljning ändrar inga runtime-, test-, dependency- eller workflowfiler.

## 2026-10-02: RTS-066

Användaren bad om fortsatt arbete efter verifierad/publicerad RTS-065; AGENTS/roller uppdaterade med ny styrning och task066 detaljerad före kod. Fraktionskatalog för crown/clans med20 unika typ-ID:n över delade unit/building/upgrade-roller; baselinevärden från befintlig config, team/faction åtskilda. createMatch och BootScene apply/current/restart bevarar identitet. Ingen balans/grafik/UI-val i denna grundtask. Visningsnamn har frågats asynkront, teknisk grund kunde fortsätta oberoende.

Save v2/config2 och avgränsad atomisk v1-migration; samma gamla slot hittas, inget skrivs före manuell Save. Sex nya beteendetester täcker ID/roller/baslinje, matchisolering/team, migration, swapped/same faction roundtrip och atomic rejection. 485 tester/67 filer, inklusive alla15 legala releasefall, typecheck/build/diff-check passerade. Slutlig katalogrättelse tar bort presentationsfärg från combatdata och inkluderar worker-capacity/rate; relevanta katalog/save-tester och build omkörda. Ingen Phaser i nya regler eller dependencyändring.

Chromium/local dist: v1-slot med3 cargo laddas pausad med lasten kvar och sloten orörd; Save skriver v2. Swapped player=clans/enemy=crown bevaras genom Save/reload/Load/restart. Unknown faction avvisas med aktiv match byte-identisk, inga browserfel. Diff granskad för migration/strict fields, metadata i scenadapter/reset, numerisk kompatibilitet och scope; inget blockerande fynd kvar. Nästa task RTS-067: egna namn/grafik och faktiskt fraktionsval.

## 2026-10-02 – RTS-067 Done

Två valbara fraktioner: arbetsnamnen Kronförbundet/Järnklanen enligt kommunicerat standardförslag. Egna repo-lokala human/orc-sprites, åtta riktningar, alla befintliga actions och byggstadier, separata lagfärger, fraktionsnamn i produktions-/byggknappar, kö, HP och selection. Menyn låser valet under match; save/load/restart bevarar båda sparade sidval. Ingen ny balans eller gameplay-regel.

Checks: `npm test` **487 tester/68 filer**, `npm run typecheck`, `npm run build` och `git diff --check` passerar. Befintlig bundle-varning kvar enligt mandat. Assetexport och exhaustive tester täcker 1 920 unit-frames/48 byggframes. Browser Chromium på lokal produktionsbuild: båda menyalternativ och screenshots inspekterade, riktiga fraktionssprites/namn, v1-migration med last/slot bevarad, v2 byte/save/reload/load/restart, atomärt avvisad ogiltig fraktion, inga console/page/requestfel. Accelererad browserplaythrough med riktiga gameplay-kommandon (inga gratis resurser/units/HP): Järnklanens ekonomi, leverans, byggande, blandad produktion och synlig strid; 280 gameplay-sekunder, 15 units varav 12 stridsenheter, betalt 340 wood/80 gold, save verifierad. Full befintlig testmatris verifierar övrig simulation. Browserkontrollen använde en temporär extern helper, inte levererad runtimekod. Andra browsermotorer och manuell ljudlyssning ej verifierade.

Granskning: faction/team separerade, alla frame-referenser finns, gamla faction-neutrala frame-ID:n bevarade, anchors/footprints/spelets siffror oförändrade, listeners städas på shutdown. Tidigare DEV_LOG-datum för RTS-066 korrigerat till faktisk 2026-10-02 utan ändring av pushad historik. GitHub Actions/Pages för föregående 43fa011 verifierat success. Nästa task RTS-068: koppla fraktionsdata till faktiska stats/kostnader/produktionsregler, med dokumenterade balansskillnader.

## 2026-10-02 – RTS-068 Done

Kostnad, tid, supply, size och producerad HP hämtas ur samma fraktionsrecept för direkt/FIFO-produktion. Kronförbundet behåller grundvärden; Järnklanens yxkrigare kostar 18 wood/6 gold, tar 6 s och får 66 HP. Enemy-adaptern betalar egen fraktionskostnad och använder difficulty-tid plus receptavvikelse, med tidigare enemy-stridsprofil kvar. UI-kostnad/tid och HP följer player-fraktionen. Ingen ändrad movement/gathering/byggregel.

Save config3 (schema2) migrerar tidigare betalda clan-jobb genom validerad legacyRecipe-stämpel; gamla kostnader/timers/refunds och levande HP bevaras. Nya jobb använder nya recept. gathering.faction är härledd och rekonstrueras vid Load.

Checks: full `npm test` **493 tester/69 filer**, riktad slutkontroll **27 tester/4 filer**, `npm run typecheck`, `npm run build`, `git diff --check`, dokumentvalidering med **543 filreferenser** passerar. Befintlig bundle-varning kvar. Initial körning fångade gamla enemy-baslinjeantaganden och en felkonstruerad legacy-testfixture; regressionsfallen väljer nu uttryckligen crown-enemy för äldre profil, medan nya tester kontrollerar clans-kostnad/tid/budget samt riktig äldre snapshot. Full matris av befintliga scenarios/difficulties passerar. Browser Chromium lokal produktionsbuild: båda UI-recept, betalning exakt en gång, ingen spawn före deadline, rätt HP/sprite, save/load och fresh restart; inga page/console/requestfel. Detta var kontrollerad färdig-barracks-fixture med scenariots startresurser, inte ett påstående om ny naturlig ekonomi-/balansplaythrough. Andra browsermotorer ej verifierade.

Diffgranskning kontrollerade fraktionscontext, spawn-size, global-ID/queue/refund, migration före atomisk Load och ingen gratis kostnadsändring. Inga kvarstående blockerande fynd. Slutlig fraktionsbalans följer RTS-070. Föregående 8a42dc7 verifierad GitHub Actions success och publicerad fraktionsmeny på Pages. Nästa RTS-069: dokumentera förmågebeslut innan kod; försvarshållning/raseri är kommunicerat förslag i pending valfråga.

## 2026-10-03 – RTS-069 Done

Försvarshållning och raseri enligt kommunicerat standardförslag medan valfrågan är obesvarad. Markera redo stridsenheter, använd fraktionsknappen eller E: incoming ×0,75 för crown, outgoing ×1,25 för clans, 5 s effekt/20 s cooldown från aktivering. Arbetare, selection och orders bevaras. Multiplikatorer kombineras med Forge; ranged/siege-damage snapshot vid skott. Matchupdate delar effektslut, timers följer gameplay-delta och fryser vid pause/terminal. Save config4 validerar timers och migrerar config3 utan påhittade effekter, med tidigare betalda köjobb bevarade. Inga nya unittyper/assets eller AI-förmågor.

Checks: `npm test` **503 tester/70 filer**, `npm run typecheck`, `npm run build`, riktade förmåge-/save-/hotkey-tester och `git diff --check` passerar; bundle-varning kvar. Beteendetester täcker mixed selection, repeat/cooldown, melee/defense/ranged/siege/Forge, grova/fina tidssteg, exakt effektslut, fog, pause/outcome, Save/reset och ogiltiga timers. Chromium-browser på lokal production-build kontrollerade båda fraktionernas verkliga DOM-knapp/E, workers/orders oförändrade, expiry/cooldown/re-aktivering, pause, Save/load/resume och fresh restart. Screenshots inspekterade, inga page/console/requestfel. Browser använde kontrollerad färdig-barracks-fixture, inte naturlig balansplaythrough. Andra browsermotorer ej verifierade.

Diffgranskning kontrollerade guarded input, shutdown-listeners, inga enemy-läsningar i aktivering, projektilens skadesnapshot/expiry och timer-/migrationsvalidering. Inga blockerande fynd kvar. RTS-068:s GitHub Actions verifierad success. Nästa RTS-070: verifiera naturliga spelbara fraktioner, vinst/förlust och balans; AI-stridsprofil/inga enemy-förmågor är kända förenklingar.

## 2026-10-03 – RTS-070 Done

Fraktions-/förmågeregression och speltest dokumenterade i FACTION_BALANCE.md. Gemensam testhelper stöder faction/egen gold-kostnad/förmågecommand. 30 legala scenario/difficulty/fraktions-kombinationer vinner med bevarad ledger och pause/save/terminal freeze. Två riktiga oskyddade defeat-regressioner kontrollerar nästa matchs val/state-isolering. Första Hard Skirmish-strategin för clans förlorade; tidigare gold under byggandet, annan builder, skydd/retreat av workers och fortsatt anfall med överlevande army löste det. Inga gameplay-/balansvärden, gratis resurser, HP eller units ändrades/injicerades.

Checks: `npm test -- --silent=false` **535 tester/71 filer**, `npm run typecheck`, `npm run build`, `git diff --check` passerar. Runtime-JS är samma index-CikpuOlK som verifierad RTS-069; bundle-varning kvar. Natural Chromium Utposten/Normal: crown Victory90/bas240, första soldier23,81 s, kostnad120 wood/35 gold; clans Victory90/bas240, första yxkrigare24,72 s, kostnad118/36. Båda producerade/behöll soldier/archer/catapult och tre workers, tre waves, tre ability-knappaktiveringar, ledger440/310, lostCargo0 och fresh restart. Separat accelerated-clock browser: actual enemy-attacker ger defeat ~91,55/~91,60 s, terminal högerklick/E/simulation ändrar inget, restart/ny motsatt fraktion isoleras. Screenshots granskade; inga browserfel. Naturliga Easy/Hard matcher, andra engines/mobil och akustisk lyssning ej verifierade; ingen statistisk jämviktsgaranti.

Granskning: testhelper använder known resources/synliga mål och riktiga commands; sparning/ledger/outcome/fresh-state går genom runtimefunktioner. Helpern ingår inte i appbundle. Inga blockerande fynd kvar. Föregående 7a34610 verifierad Actions success. Nästa RTS-071: riktig enemy gathering/last/leverans, enligt detaljerad nästa task; äldre enemy-stridsprofil/ingen enemy-förmåga och initialt ändlig budget är kända förenklingar.

## 2026-10-03 – RTS-071: verklig fiendeinsamling

Två angripbara 30HP-workers delar arena-noder, last5/rate1 och verklig
leverans till fiendebasens 96px-footprint. Enemy-bank betalar produktion;
extracted/spent/lostCargo bokför faktisk ekonomi. Work-state finns enbart
i enemy-entiteter och gathering återanvänds genom tillfällig vy. Gemensam
servicekö, gates, separation, fog och fraktionsgrafik används. Worker-död
bokför last en gång; basdöd stoppar arbete. Workers attackerar inte,
tar ingen army-cap och rekryteras inte till grupper.

Save schema2/config5 validerar ekonomi/work-order/last/ledger och militära
referenser. Config4/äldre migreras utan gratis workers eller income; tidigare
attack-timing bevaras. Nya ekonomimatcher får +20s attack-grace: den delade
konkurrensen gav Hard-förluster i tidigare strategier. Kostnader, HP och
startbudget är oförändrade. Leveransworkers reserverar inga aktiva
serviceplatser; återvändande lastbärare kan inte passera admission inom
ett stort delta. Ingen ändring av release-botens spelarstrategi.

Checks: slutlig npm test 549 tester/72 filer PASS (90,32s); typecheck/build
PASS; git diff --check PASS. Riktad ekonomi/kö/difficulty/load 27 PASS,
Hard Skirmish båda fraktioner + release-baslinje PASS. Fullmatris omfattar
fem scenarios/tre difficulties/båda fraktioner med victory, resursledger och
pause/save. Tidiga röda tester för gamla kroppantal/fog/startbudget och
syntetiska legacy-saves uppdaterades till faktiska nya regler; ledger inkluderar
fiendens extraktion. Granskad diff: inga kvarstående blockerande fynd inom
taskens scope.

Chromium 147 mot slutlig production-preview: faktisk scout-klick/move,
synlig röd worker med rätt fraktionsgrafik, flera wood/gold-turer, begränsad
last, betald enemy-produktion, pause/save/load/restart för båda fraktioner
PASS utan page/console/request-fel. Klockan accelererades; inga extra
resurser/enheter eller gameplay-skador injicerades. Screenshots granskade.
En första browser-jämförelse tog felaktigt med den avsiktligt osparade
blockedSpawnKey-cachen; sparbart gameplay jämförs efter korrigering och
bevaras exakt. Ingen naturlig fullmatch-balansgaranti från denna kontroll.

Begränsningar: fasta nodval, inga ersättningsworkers/bygganden i denna
slice. AI-upptäckt väntar till RTS-075. Befintlig bundle-varning kvarstår
avsiktligt; build index-aO1Cgnqp.js 1527,77KB/gzip401,45KB. RTS-070:s
GitHub Actions/Pages verifierades success för 86b252e. Nästa task RTS-072.

## 2026-10-03 – RTS-072: AI-barracks och supply-farm

Verklig betald barracks/farm genom befintliga placement/construction/supply.
Enemy-building-entiteter har fraktionsgrafik, HP, fog och hinder. Worker
bygger/återupptar och bevarar last. Begränsade sex kandidater/1s retry;
ogiltiga försök betalar inget. Barracks kostar40/5s; farm20/5s/+5.
Base-cap8 omfattar workers/reserved samtidigt som difficulty army-cap
bevaras. Margin1 pausar nya köstarter för att spara till farm; betalda
jobb fortsätter. Production/spawn kräver färdig barracks och tid efter
byggslut; shared construction rapporterar transient ready-after.

Save config6 lagrar/verifierar site/retry/builder/order/HP/footprint.
Config5/äldre fortsätter base-production utan gratis sites. Nya matcher
får byggpolicy via factory; gamla snapshots enbart efter fresh restart.

Checks: npm test 560 tester/73 filer PASS (82,03s); typecheck/build och
git diff --check PASS. Riktade byggtester11 PASS; Hard-vinstfall6 och
bygg/supply-regressioner PASS. Tidiga fel identifierade äldre tests
antaganden om omedelbar base-production/revision, ett borttaget enemy-base
under population-beräkning och fel i testfixturens wall-removal/contact.
Korrigerat: population kräver inte levande bas; isolerade legacy-tests
behåller tidigare fixture, actual nya byggregler testas separat.
Granskad diff för krav, refs, budget, tid och scope: inga kvarstående
blockerande fynd. Ingen ny dependency eller grafiktillgång.

Chromium147 production-preview: båda fraktioner scoutar ett synligt bygge,
40wood betalt utan early spawn, save/load mitt i byggtid, färdig barracks
och giltiga spawns, betald/färdig farm (64,09s/79,12s) och restart PASS.
Inga page/console/request-fel. Screenshots granskade. Klockan accelererades
och kameran ställdes genom vy-hook; inga resurser/enheter/byggnader injicerades.
Första browser-scouten klickade intill vatten på ogiltig mark och gav ingen
vision; en giltig faktisk canvas-order slutförde kontrollen. Ingen naturlig
fullmatch-balansgaranti här.

Befintlig bundle-varning kvar: index-BxjPPEiZ.js1535,32KB/gzip403,34KB.
RTS-071 Pages/Actions verifierat success för be602f5. Begränsningar: en
barracks/en farm, fasta kandidatplatser och inga nya econ/upgrade/expansion-
system. Nästa task RTS-073.

## 2026-10-03 – RTS-073: ekonomi, armé och betald forskning

Härledd begränsad prioritet: barracks/supply, tre levande army-units,
Forge, attack1, defense1. Verklig bank betalar bygge/research exakt en gång.
Army-förlust öppnar ersättning; betalda jobb fortsätter, och efter
betald research-start kan nya army-jobb också köras. Wood-bias byter
bara idle/tom gather-order och bevarar last. Shared konstruktion/research,
enemy-only combatbuffs och strikt save config7; gamla saves får ingen
policy eller gratis nivå. Forge-död avbryter jobb utan refund,
lärda nivåer bevaras. Ingen ny dependency/grafik eller scope-utökning.

Checks: slutlig npm test571 tester/74 filer PASS (91,36s), typecheck/build
PASS. 11 nya policytester, inklusive prioritet/paid queue/cargo/effekter/
migration. Tidiga fixturefel saknade retry-tid eller placerade tre betalda
jobb vid supply-gränsen; korrigerade till uttryckliga testförutsättningar.
Diffgranskning fann inga kvarstående blockerande fel.

Chromium147 production-preview, båda fraktioner: synlig Forge-betalning/
byggtid, attack/defense-research, pause/save/load mitt i forskning och
restart PASS utan page/console/request-fel. Kontrollen använde en tydlig
kontrollerad fixture med färdig barracks, tre army-units och avstämd
bank/nod-ledger samt accelererad klocka; den visar flödet, inte naturlig
fullmatch-balans. Båda nivåer färdiga ungefär55,16s i fixturen.
En tidig browserassert missade samtidig betald army-start; slutkontrollen
bokför faktiska separata kostnader. Forge-screenshot granskad.

Befintlig bundle-varning kvar: index-BiRYLRwx.js1540,22KB/gzip404,49KB.
RTS-072 GitHub Actions/Pages verifierat success för4c88dea.
Begränsningar: inga ersättningsworkers/expansion eller begränsad AI-
upptäckt ännu. Nästa task RTS-074.

## 2026-10-03 – RTS-074: återhämtning och extra resursbas

Implementerat betald ersättning till två workers med shared queue,
20wood/5s/supply1, monotona ID:n, korrekt96px base-spawn och ledger.
Bankbesparing för ersättning, fortsatta betalda jobb, blocked-spawn
utan dubbel betalning, base-death-cancellation och save config8.
Config7/äldre migreras utan gratis policy/units. En granskning fann
att wood-rollen behöver följa lägsta levande worker-ID när original1
förlorats; korrigerat med separat regressionstest för två ersättare.

Slutlig npm test579 tester/75 filer PASS (93,89s). 8 recovery-tester;
riktad recovery/policy19 PASS, typecheck/build, git diff --check och
563 lokala dokumentreferenser PASS.
Chromium147 mot slutligt index-BGp5HfxN.js1543,48KB/gzip405,09KB: båda
fraktioner, kontrollerad worker-loss-fixture och accelererad tid. Betald
träning/save-load mitt i träning, ny worker på resursorder, save med
nya ID:n och restart PASS utan page/console/request-fel. Ingen naturlig
fullmatch-balansgaranti. Två fel i extern browserfixture (fel fraktions-
parameter och kostnadsassert som inkluderade army-job) korrigerades;
sista kontrollen bokför separata verkliga betalningar.

RTS-073 pushad7f743f6, Actions/Pages success37078604225.
Användaren svarade extra resursbas; expansionen implementerad efter
beslutet. En betald80wood/20gold/10s/96px/240HP resursbas med +8 supply
vid färdigt bygge. Byggs efter barracks/tre army/attack1/defense1.
Tre kandidater/1s retry, begränsad validering, workerbyte/lastbevarande,
angripbar/fog/hinder och betald återuppbyggnad. Shared updateSite
återanvänds; enemy-enhet auktoritativ, dropoffs/population härleds.
Leverans väljer närmaste nåbara levande färdiga bas med cache; ingen
ny nod eller gratis resurser. Huvudbasen är fortsatt objective/producent.

7 expansionstester omfattar cost/time/supply/delivery/builder-loss/site-
loss/Save/loaded carrier fallback. Riktad expansion/recovery15 PASS.
Chromium147 production-preview: båda fraktioner scoutar ett synligt
basbygge, korrekt faktisk betalning, save/load under bygge,10s arbete,
verklig insamling och leverans vid nya basen, save efter färdig bas samt
restart PASS utan page/console/request-fel. Kontrollerad fixture med
färdig initial barracks/tre army/lärda nivåer/avstämd bank; accelererad
klocka och faktisk scout-input, inte naturlig balansgaranti. Screenshot
granskad med läsbar grund och laggrafik. Tidig browserassert tog felaktigt
med samtidig armébetalning; separata faktiska utgifter kontrolleras nu.

Granskning av krav, ledger, tid, supply, gamla saves, refs, scen och scope
fann inga kvarstående blockerande fel. Befintlig bundle-varning bevaras.
Begränsningar: en extra bas, två workers, inga nygenererade noder;
basens kostnad/balans preliminär. RTS-075 hanterar upptäckt; ekonomin
känner ännu resurspositioner och återstående mängd enligt tidigare slice.

Slutlig RTS-074: npm test586 tester/76 filer PASS; typecheck/build PASS,
git diff --check PASS,566 dokumentreferenser giltiga. Slutbundle
index-BRPFZXH1.js1548,79KB/gzip406,12KB; befintlig varning kvar.
RTS-074 Done. Nästa task RTS-075 – begränsad AI-information/upptäckt.

## 2026-10-03 – RTS-075: scouting och sist observerad information

Egen enemyKnowledge med observerade noder/mängder, sista basposition
och begränsade scout-index. Economy/policy/expansion använder minne;
båda team extraherar fortsatt från verklig finite node. Högst en
tom worker utforskar, utan att kasta last/avbryta bygge. Anfallsgrupper
söker terrain-punkter före observerad bas och retargetar därefter.
Ingen lokal attack mot osynliga targets. Save config9 strikt validerat
minne/index/explored, migration utan ny policy/kunskap.

Riktad knowledge/gathering20 PASS. Två informationsläckor identifierades
och korrigerades: osedd uttömning avbröt fjärran gather, och återresa
efter leverans läste aktuell dold mängd. Nu följs minne tills observation/
fysisk kontakt; ingen gratis extraction. Gamla component-fixtures håller
tidigare gathering/policy-modell explicit, och ny verklig factory
scouting/ekonomi verifieras separat samt av full release-matris.

Chromium147 production-preview båda fraktioner: naturligt startstate,
worker-scout med först osedd wood, båda resurser upptäckta och levererade,
save/load med minne, militär sökning innan observerad bas (~85,1–85,3s),
attack mot observerad bas och restart PASS utan page/console/request-fel.
Accelererad gameplay-klocka och faktisk spelar-scout-input; inga resurser,
enheter eller uppgraderingar injicerade. Screenshot granskad med
synlig röd worker vid delad wood. Ingen naturlig fullmatch-balansgaranti.

Granskning omfattade strategi vs fysisk map, hidden-state-par, last/order,
minne/attack, save/restart och scope. Inga kvarstående blockerande fynd.
Fysisk placement/collision/spawn är fortfarande auktoritativ; den är
ingen dold informationsplanner. Sökrutterna gäller befintlig arena.
RTS-074 Pages/Actions verifierat success70fc0ea/37084173447.

Slutlig browser-omkörning hittade ett verkligt sökstopp: combat-approach
kan sluta vid en pseudo-footprints giltiga kontakt utanför56px från
centrum. Separat attackArrivalRange80 i config och ett regressionstest
löser det. Slutlig browser båda fraktioner PASS, basupptäckt ~85,1–85,3s
i accelererad naturlig start. Worker-ankomstgräns56 bevaras.

Slutlig RTS-075: npm test595 tester/77 filer PASS (91,50s), typecheck/build
PASS, git diff --check PASS och569 dokumentreferenser giltiga.
Slutbundle index-C9lyVIbS.js1553,10KB/gzip407,24KB; varningen behålls.
RTS-075 Done. Nästa task RTS-076: tre handgjorda skirmish-kartor.

## 2026-10-03 – RTS-076: tre handgjorda skirmish-kartor

Arena bevarad; forest/river har olika terrain och500/250 respektive
350/400 wood/gold. Samma värld/baser/noder, MapId kopplar terrain/stock.
Navigation, terrain-kanter, minimap och fog-LOS använder samma profil.
Enkelt menykartval för Skirmish, andra scenarios behåller arena.
Load/restart bevarar kartan. Save config10 validerar profilstock/ledger/
minne/hinder/ID/scenario och migrerar legacy som arena.

Checks: npm test608 tester/78 filer PASS (91,77s), typecheck/build PASS.
13 maptester inkluderar sex betalda normal-skirmish-vinster, finite
ledger, nåbara noder/baser, giltiga spawns, terrain/minimap och strikt
save/migration. git diff --check PASS. Diffgranskning av state, UI,
profiler, gamla snapshots, nav/render och scope: inga blockerande fynd.

Chromium147 production-preview: tre kartor x två fraktioner, faktisk
scout/drag/rightclick-insamling,60wood, giltig betald barracks, gold-
leverans och betald soldier, map-save/load och restart med korrekt stock
PASS utan page/console/request-fel. Accelererad gameplay-klocka, inga
resurser/enheter injicerade. Screenshots granskade. Tidiga browser-
försök samlade enbart byggkostnaden och klickade ibland en ockuperad
byggplats; slutflödet samlar båda kostnader och försöker bounded riktiga
canvas-platser med full game-validation. Ingen runtime-ändring för att
kringgå dessa spelregler. Ingen naturlig fullmatch-balansgaranti.

Slutbundle index-OuOj-fEB.js1554,71KB/gzip407,68KB; befintlig varning
bevarad. RTS-075 Pages/Actions success1d63af8/37085105714.
Begränsningar: samma start/nodpositioner, en nod per resurs, inga
sjöenheter/randomkartor. RTS-079 hanterar längre balans. Nästa RTS-077.

Screenshot-fynd utanför RTS-076:s kartscope: befintlig shortage-text kan
visa många decimaler vid fraktionell gathering. Kosmetiskt; inget
blockerande map/gameplay-fel, inte åtgärdat i denna task.
571 lokala filreferenser verifierade före commit.

## 2026-10-03 – RTS-077: matchinställningar

Gemensam ren optionsvalidering, atomiska patches och scenario/map-regel
ovanpå befintlig menu. Felaktiga värden/fält/par bevarar tidigare val,
aktive sessions låser val. Menusammanfattning med stock, fraktionens
förmåga och begripligt fiendetryck. Samma faktiskt valda factory-data
vid Start, pausad Load och restart. Save config10 oförändrad.
20 nya tester:18 riktiga factory/save/restart-kombinationer samt atomisk
validering/mode-lock. Riktad settings/session27 PASS, typecheck/build
PASS. Ingen ny gameplay-balansering, dependency eller ekonomi-HUD-fix.

RTS-076 Pages/Actions verifierat successa56425e/37085916182.

Slutkontroller: npm test628 tester/79 filer PASS (88,39s); typecheck/build,
git diff --check och574 dokumentreferenser PASS.
Chromium147 production-preview: alla18 kombinationer genom faktisk menu/
Start, korrekt modeldata, låsta events i paus, save/load/restart/Ny match
och mission-normalisering PASS utan page/console/request-fel. Inga
gameplay-fixtures/injicerade resurser. Menyscreenshot granskad.
Granskning av validator, session/UI, options-vs-saved-state, regressioner
och scope fann inga blockerande fynd.
Slutbundle index-CzF9iKdH.js1555,93KB/gzip408,03KB; befintlig varning kvar.
RTS-077 Done. Nästa RTS-078 – matchresultat och statistik.

## 2026-10-03 – RTS-078: ekonomi- och stridsresultat

Ren härledd MatchStats från befintlig stock/ledger/last/spawn-counter;
ingen eventhistorik eller schemaändring. Resultatbord9 rows/båda lag
med outcome/tid/profil. Insamlat vs levererat vs net-spend efter refunds,
unit-added/lost/killed utan byggnader/startunits i added. Enemy-dolda
data visas endast efter match. Freeze/Save bevarar, restart/menu rensar
DOM och resultat-cache. Resursrows har max1 decimal.

8 nya tester: faktisk gather/contact/deposit, betald queue/refunds,
produktion och enemy-worker-attack med faktisk död, enemy-extraction-
separation, paid forest/clans-victory/Saves, legacy-budget och formatting.
Riktad stats8 PASS (5,09s); typecheck/build PASS. Tidigt strikt 40-spend-
assert fick39,999999999999986 efter floating point-gathering; ekonomitest
använder numerisk tolerans, inte ändrade gameplayvärden. Den första
fullkörningen hade cachat gamla assertionen; slutkörning rapporteras separat.

Chromium147 production-preview: faktisk betald Outpost/Easy-victory
(90s,60wood/5gold,1 added,2 kills) och faktisk oskyddad Survival/Hard-
defeat (~91,6s,3 unit-loss) PASS. Alla resultatrader jämförda med model,
freeze/Save/load/restart och tom dolt resultat efter restart PASS utan
page/console/request-fel. Accelererad klocka och verkliga UIcommands;
inga resurser/enheter/skador injicerade. Victory-screenshot granskad.

Granskning av formler, counters, last/refunds/legacy, enemy-reveal,
terminalfreeze, cache och scope fann inga kvarstående blockerande fynd.
Begränsningar: net-spend, unit-metrics utan damage/APM/buildinghistory;
ingen generell HUD-polish (tidigare shortage-decimalhint kvar).
RTS-077 Pages/Actions success36e3c2a/37086410298.

Slutkontroller: npm test636 tester/80 filer PASS (89,00s); typecheck/build,
git diff --check och577 dokumentreferenser PASS.
Bundle index-wfpgUoUZ.js1559,30KB/gzip409,20KB; befintlig varning kvar.
RTS-078 Done. Nästa RTS-079: längre skirmish-balans.

## 2026-10-03 – RTS-079: längre skirmish-matris

18 betalda playthroughs passerade först, men sex nya passiva matcher
exponerade2 fel på Skogspasset: attack-sökpunkten var sten och fienden
fastnade vid blocked route i300s. Browser reproducerade samma fel.
Flodkrökens andra punkt var dessutom vatten. Flyttade tre punkter till
gemensamt giltig mark, normaliserar äldre order och regressionsprovar
landpositioner samt orderuppdatering utan gratis synkunskap.
Första fullsuite:658 PASS/2 fail, inte slutresultat. Ingen ombalansering
av priser, HP, fraktioner eller AI-budget; ingen ny dependency/schema.

Granskning hittade en route-cache-regression: generell normalisering
retargetade en legitim godtycklig exploration-order. Begränsade ändringen
till historiska sökpunkter/indexbyte eller observerad bas. Visibility/
knowledge22 PASS (1,15s). Föregående fullsuite hade detta1 failure;
slutlig fullsuite körs separat. Riktad matrix/knowledge34 PASS (113,06s).
RTS-078 Pages/Actions success7190aef/37087587320.

Slutlig browser: sex faktiska Normal-skirmish-starts PASS utan
page/console/request-fel, ingen injicerad state. Accelererad gameplay:
arena crown113,27s/clans119,24s; forest108,95/119,93s; river113,23/119,23s.
Alla defeat, observerad bas, finite budget/extraction, resultatfrysning
och Save/load. Begränsning: inga naturliga femminuters realtidsspel eller
50/50-balans påstås; den betalda strategin testar bara en spelares policy.
Slutdiff granskad för fog-läckor, route-cache, historiska order,
config-vs-save och taskscope; inga kvarstående blockerande fynd.

Slutkontroller:662 tester/81 filer PASS (126,03s); typecheck/build,
git diff --check och578 dokumentreferenser PASS. Bundle
index-DSc0qhVd.js1559,52KB/gzip409,25KB; avsiktlig varning kvar.
RTS-079 Done. Nästa RTS-080: verifierad tvåfraktionsrelease.

## 2026-10-03 – RTS-080: verifierad tvåfraktionsrelease

Ren temporär kopia utan .git/node_modules/dist; npm ci --offline49
packages/audit0 vulnerabilities PASS. Fullsuite/build körs separat.
Assetmanifest/file/bounds-audit PASS:16/48/1920/17 frames, egna källor
och dokumenterad proveniens. Inga gameplayändringar eller nya tester
för dokumentationen. Lokal profile-browser PASS:64CPU9ms/render0,7/
RAF17,5;128CPU24,3/render0,8/RAF33,8, observerat59,43/38,13FPS; GC11,89/
12MiB, tio restarts+0,34MiB. Fullbudget och metod i PERFORMANCE.
Publicerad smoke före senaste Actions-deploy passerade, men avsåg078-
bundle; räknas inte som verifiering av079. Inväntar verifierad deploy.

Ren fullsuite662/81 PASS119,04s, typecheck/build PASS. Originalasset-
export10 filer identiska; clean/local/public JS identisktSHA256fe24b21c
(fullhash i RELEASE_CHECKLIST). Actions37109756850/31dd4db success.
Publicerad Chromium:18 menu/start/save/restartkombinationer och faktisk
betald victory90s/defeat91,62s/resultatfreeze PASS. Inga injicerade
resurser/units/HP. Separat smoke med12 ljudavkodningar,save/reload/resume,
10 restarts och2 viewportar PASS utan errors. Separat35-body CPU5,3/
RAF17,6/heap10,08;64-soldier CPU12,1/RAF17,6/heap10,68. Screenshots
verifierade; akustisk lyssning och andra engines ej utförda.
Granskning av checks/metod/proveniens/save/CI/hash/budget/docs fann inga
blockerande fynd. Ingen ny runtimeändring i080.

git diff --check och581 dokumentreferenser PASS. RTS-080 Done.
Nästa RTS-081: vattennavigation och explicita kustregler.

## 2026-10-03 – RTS-081: vattennavigation/kust

Ren terrainNavigation-adapter, inga nya enheter eller Save-state.
Partition vid terränggränser blockerar vattenunionens komplement och
dynamiska hinder; land returnerar originalmap. Befintlig body/segment/
BFS/orderadvance/revision återanvänds. Kust positiv land+vattenarea
med bounds/sten/dynamiskt-hinderkontroll. Aktuella profile-waterpatches
överlappar inte; angränsande patchunion testas explicit.
7 riktade tester PASS235ms, extra seam-regression tillagd och verifierad
separat. Typecheck/build PASS; bundle oförändrad eftersom adapter inte
kopplas till entities förrän082. Faktisk Chromium-landselection/right-
click blockerar vatten, giltigt landmove rör, Save/load/restart PASS utan
errors. Inget browser-fartygsflöde påstås; inga ships finns ännu.

Slutgranskning: domänpartition/swept-kollision, obstacle-revision,
coast-area, bounds/body och Save-rekonstruktion utan dubbelstate. Inga
blockerande fynd; kusttest förutsätter dagens ickeöverlappande profiler.
Fullsuite669 tester/82 filer PASS103,75s (före sista seam-testet);
slutlig riktad suite8 PASS522ms inkluderar extra seam-testet.
Typecheck/build,git diff --check och583 dokumentreferenser PASS.
Oförändrad runtime-bundle1559,52KB/gzip409,25; varning kvar.
RTS-081 Done. Nästa RTS-082: hamnplacering/fartygsproduktion.

## 2026-10-03 – RTS-082: betald hamn/fartyg

NavyState separerad från landunits; bevarar gamla strid/gatheringtypes.
Hamnworkerbygge återanvänder updateSite/order-state, foot/coast/fog/
resursvägs- och spawnexitchecks. Fartygs-FIFO återanvänder cost/
refund/population/job-shape/spawn/route; blocked head0 väntar.
Gemensam supply, selection/drag/shift/groups/Stop/fog/minimap/resultat.
Save config11 med strict naval refs/geometri/recipe/domän och migration
från10 utan gratis navy. Kodritade hull/Hamn-placeholder tills089;
ingen sjöstrid/transport/rally. Config alla priser/tider/stats.

Tidiga riktade failures: syntetisk fullvatten-barriär sammanföll med
terrängrect och filtrerades bort; domänadaptern drar nu av endast en
ursprunglig terrängkopia. Save view-listan saknade harbor, korrigerad.
Ett extra FIFO-test försökte lägga farm på en arbetare; riktade
giltiga kandidater korrigerade, inga gameplayändringar för det felet.
En fullsuite680/1 fail avsåg detta testfixturefel och rapporteras inte
som slutpass. Senare683/83 PASS104,73s; riktade13 PASS1,15s.

Första browserhelpern klickade gold utanför canvas och använde bara
en wood-worker; kunde därför inte finansiera flödet. Med riktig
kameravy och två wood-workers fick båda fraktioner40wood/15gold vid
~47,75s. Verklig hamnbyggnad/8s betald spawn/selection/vattenmove/Save/
restart PASS utan resource/unit-injektion. Klockan accelererades och
kameran flyttades som vy; inga gameplay-fixtures i browsermatchen.
Slutlig extra drag/Stop/browser och fullsuite rapporteras separat.

Slutlig Chromium: båda fraktioner funded48,58/47,90s,8s verklig
produktion, vattenmove/klick/drag/Stop/Save/load/restart PASS utan
page/console/request-fel. Extra drag/Stop kördes faktiskt; Stop rensar
route-cache och nästa commandNumber börjar1 enligt befintlig policy.
Screenshot visar märkt Hamn/hull och ring; granskad.
Full slut-suite683 tester/83 filer PASS111,68s, riktade13 PASS1,71s,
typecheck/build/git diff --check och585 dokumentreferenser PASS.
Slutbundle index-3xzZmNwL.js1574,37KB/gzip412,98KB; varning kvar.
Granskning: fog/coast/builder access, shared population/ID/resursledger,
FIFO/delta/refund/spawnblock, cleanup/Save migration, drag/groups/
Stop/terminalinput och scope. Inga kvarstående blockerande fynd.
Begränsningar: placeholder, ingen sjöstrid/transport/hamnrally,
fartyg kan överlappa vid samma move-mål. RTS-082 Done; nästa083.


## RTS-083 – manuell marin distansattack

Vattenkontakt/range/LOS i fristående navalCombat; samma snapshot,
projektiler och HP/death-transaktion som landstrid. Navy-targets för
befintlig kustmelee, HP-text/marker, move/Stop/fog, Save config12 med
strict marina refs/recipe/cooldown och migration11. Preliminära stats
192px/16damage/1,5s/projectile280/life3/radius20; army upgrades gäller.
Inga fiendefartyg, transport eller slutliga assets.

Fullsuite692 tester/84 filer PASS101,86s; sista tillagda hamn-dödtestet
ingick inte i denna fullkörning, men slutliga riktade10 PASS322ms.
Regression52 PASS1,34s, typecheck/build/diff/docs PASS. Bundle1580,13KB/
gzip414,35KB, avsiktlig varning kvar. Granskning av delad combat,
fog/LOS/domän, tidssteg, kustdamage/cleanup, refs/supply och Save utan
blockerande fynd. Pages för082/081/080 verifierade success.

Chromium: verklig Skirmish/Easy/Skogspasset, verklig gathering,
betald hamn och fartyg, manuella klick/move/attack; kanonskada och
fiendedöd PASS, inga page/console/request-fel. Enbart klockan
accelererad och kameravy panorerad; inga gratis units/resurser/HP.
Först nådde arenans kust inte basens attacker; ett skogsförsök
klickade spawn nedanför canvas innan kamerapan och ett annat träffade
men basen skymde fortsatta skott. Slutlig helper panorerar och flyttar
arbetare med normala order till fri kustkontakt. Screenshot granskad.
Komponenttester använder tydligt märkta stridsfixtures; hamntestet
betalar verklig placering men har explicit låg-HP precondition.
RTS-083 Done, nästa084 transport.


## RTS-084 – transport, lastning och landsättning

Betalt obeväpnat transportrecept i hamnens befintliga FIFO och gemensamma
supply. Ship.passengers äger Unit-objekt som tagits ur marksimulationen;
ID/HP/archetype/cargo bevaras, orders/selection rensas. Immediate boarding
inom64px/fri synlig kontakt, fyra platser; atomisk visible/body/occupancy-
kontrollerad landsättning. Ny DOM-knapp/Landsätt-läge med Esc/right cancel.
Population/resultat inkluderar last. Sänkning förlorar passagerare och
cargo exakt en gång. Ingen falsk dödsanimation vid boarding. Save config13
validerar ground+passenger-identitet/inactive/kapacitet/refs/recipe och
migrerar12 utan gratis transport; gamla migrationskedjan bevarad.

Riktade9 transporttester PASS957ms; breda57 PASS1,36s.
Första typecheck fann ett testfixture-unionfel för worker-cargo, smalnat
korrekt. Full702/85 PASS107,11s före sista syn/Save/presentationsfixerna;
slut-full702/85 PASS113,62s. Typecheck/build/diff och589 docsrefs PASS.
Bundle1586,33KB/gzip416,01KB; stor bundle-
varning kvar enligt uppdrag. Granskning av single ownership, landinaktivitet,
supply/cargo/statistik, atomic landing, death/refs och Save utan blockerare.

Chromium båda fraktioner: funded47,77/47,80s med riktiga resurser;
betald hamn/transport, verklig arbetare flyttar till kust under8s produktion,
lastning, Save/load/Resume, fartygsmove, ogiltigt vattenklick, right cancel,
giltig landning, ny unit-selection/move, restart PASS utan page/console/
request-fel. Screenshot granskad. Endast klocka/kameravy manipulerades,
ingen resource/unit/HP-injektion. Tidiga hjälpfel: paus-knapp användes för
resume (riktig resume-knapp krävs), en sent hämtad arbetare hann dö i våg,
och en hjälpskriptvariabel refererades före deklaration. Korrigerade helper,
inte gratis matchstate. Stats/capacity/archer/death-tester har märkta
kontrollerade fixtures där relevant. Begränsningar: manuell kustapproach,
frysande passagerartimers, inga nya transportassets/AI. RTS-084 Done;
nästa085 ökarta.


## RTS-085 – Öarna, betald transport till victory

Handgjord två-ö-profil: sammanhängande hav runt/mellan landmassor,
mapgold600300 och ändliga800wood/400gold på spelarön. Gamla profiler/
bas-/worker-spawns bevarade. Menu/render/fog/minimap använder profilen;
kartspecifik instruktion och offentliga enemy-scout-waypoints på östra ön.
Save config14 kopplar identitet/stock/position, migrerar13 för äldre kartor.
Ingen ny AI/ekonomi/balans/assets. Enemy kan inte korsa havet före086.

Nya4 tester med två faktiskt betalda Normal-matcher samlar, bygger kasern,
producerar tre soldater/hamn/transport, lastar, sparar ombord, landsätter
på fiendeön och vinner via landcombat. Verifierar ingen markförbindelse,
sammanhängande sea/coast, global supply, attackerande Enemy-army från
verkligt accepterade jobs, finite resursledger, slutfreeze och Save.
Första testhelpern spred production-resultatet till basens kö i stället
för soldierProduction och producerade en worker; rättad testhelper,
inget runtimefel. Därefter4 PASS6,55s; ytterligare ledger/freeze-assertions
körda separat:4 PASS6,62s. Gamla landmatrix fortsätter sina
18 betalda +6 passiva matcher; den nya ökartan har separat naval-flow.
Inställningar/terrain/knowledge45 PASS859ms. Full713/86 PASS110,18s,
före sista UI-instruktionssträngen och extra ledger-assertions, samma
spel-logik. Typecheck/build/diff/docs590refs PASS. Bundle1587,37KB/
gzip416,30KB, storvarning avsiktligt kvar. Granskning profilens resurser/
vägar/scouting, Save, befintlig matrix och scope utan blockerande fynd.

Chromium båda fraktioner verklig Skirmish/Easy/Öarna: insamling till
180wood/110gold, betald kasern+tre units+hamn+transport, flytt/drag/lastning,
Save/load/Resume, överfart/landsättning, synbaserade manuella mål och
landcombat victory vid cirka224 gameplay-sekunder, restart samma karta.
Inga page/console/request-fel, screenshot granskad. Klocka/kamera vy
accelererad/panorerad; inga injicerade units/resurser/HP. Tidig helper
väntade bara150s på180wood (fick170) och16s på klanens18s-kö; väntade
korrekta faktiska tider och verifierade igen. Pages för083/084 success.
RTS-085 Done, nästa086 sjö-AI/landstigning.

## 2026-10-03 – RTS-086 Done: sjö-AI och landstigning

Betald enemy-hamn/transport från ändlig Öarna-bank, två verkliga producerade
soldater, fog-säker kust/överfart/atomisk landning och vanlig basattack.
Separat Phaser-fri controller/config; canonical last, supply/stats/ledger,
sänkning/boarding-release, Save config15/legacy14 utan bonus samt restart.
Enemytransportens32px-kropp delas av combat/contact; en24px-regression
som blockerade meleekontakt i vatten upptäcktes och rättades. Inga
AI-kanonfartyg eller gratis ny transport. Landkartor bevarade.

Slutlig fullsuite:718 tester/87 filer PASS118,40s. Typecheck/build PASS;
bundle1598,39KB/gzip418,82KB, avsiktlig storvarning kvar. Riktad naval/
Öarna/save34 PASS10,34s. Två integrationstesters5s-default gav timeout i
första parallella fullkörningen; explicit30s för verkliga hela matcher,
sedan två fullkörningar gröna. Diff granskad för betalning/faser/ID/fog/
domain/population/death/migration, inga kvarstående blockerande fynd.

Chromium verklig Normal/Öarna/Kronförbundet utan injicerade resurser/HP/units:
AI-last2 vid224,27s, pause/Save/load/Resume mitttransport, defeat256,29s.
Separat betald egen insamling→hamn→stridsfartyg→synlig tom AI-transport
sänkt; efter339,61s bas240HP, ingen ersättning, pause/restart återställer.
Inga page/console/request-fel. Counter-screenshot granskad. Lastad
transportsänkning verifierad i beteendetest; browsercounter gällde ännu
olastad transport. Accelererad klocka/kamera endast för verifiering.
RTS-086 klar; nästa087 balans mellan landarmé/flotta/transport.

## 2026-10-03 – RTS-087 Done: betald sjöbalans

Sex betalda fraktions-/svårighetsmatcher till victory, sex passiva till
defeat och sex tidiga betalda kanonbåtsmotmedel. Befintlig Öarna-victorytest
utökad till alla svårigheter; navalBalance.test.ts testar verklig ekonomi,
population och ändligt anfall. Inga balansvärden behövde ändras. Priser/
supply och begränsningen en AI-transport utan återbyggnad dokumenterade.
Riktad victory8 PASS25,44s; riktad balans12 PASS72,06s under samtidig
fullsuite/browser. Full734/88 PASS139,51s; typecheck/build/diff PASS.
Docs/refs verifierade. Granskning kostnader/progression/supply/motmedel
utan blockerande fynd. Kanonmotmedlet gäller tidig tom transport, inte
påstående om garanterad interception av en laddad rörlig transport.

Chromium båda fraktioner Easy/Öarna, verklig insamling/armé/hamn/transport,
Save/load, överfart och landcombat victory231,85/231,70s, restart, inga
page/console/requestfel. Screenshot granskad. Tidig browserhelper
högerklickade fiendebåten vid880432: transporten är obeväpnad och fick
korrekt ingen attack/move, varför landsättning från västra stranden nekades.
Helper ändrad att högerklicka tomt vatten880496 och landsätta912496;
båda flöden gröna. Ingen runtimeändring behövdes. Nästa088 sjöuppdrag.

## 2026-10-03 – RTS-088 Done: Överfarten och naval Save-regressioner

Ett fast Öarna-uppdrag,20wood/10gold, betald armé/transport och befintligt
basmål/defeat priority. Delad scenariokartregel i menu/Match/Save, scenario-
normalisering, config16 med säker15-migration. Öarnas betalda6-matchmatrix
kör också sjöuppdraget. Gamla landbot-matriser väljer uttryckligen Arena-
scenarier; inget gammalt fall borttaget. Separata tester fortsätter saved
owncarrier-route/cargo, Enemy-loaded överfart till samma defeat och skott
med/utan målsyn. Dolda transporter/passagerare läcker inte till minimap.

Riktat50/4 PASS6,64s. Första full745PASS/9FAIL: de två gamla matriserna
hade automatiskt fått sjöuppdraget men deras markbot använde Arena.
Behåll landmatris och verifiera nya uppdraget i betald sjömatris; slutlig
full745/89 PASS144,94s. Typecheck/build/diff/docs PASS; sista ändringen
endast mellanrum i instruktion, därefter ny typecheck/build. Bundle1599,09KB/
gzip419,04KB, storvarning kvar. Diff granskad mot fixed map, save identity,
legacy/fog/priority/terminal input och scope utan blockerande fynd.

Chromium Easy/Överfarten båda fraktioner: verklig ekonomi/armé/hamn/transport,
Save/load/landning/strid/victory218,44/214,64s och restart. Screenshot granskad.
Normal Skirmish separat Save i AI-last2 samt verkligt kanonskott i flykt,
load/Resume fortsatt sänkning, oskadad bas och restart. Inga page/console/
requestfel. Helper behövde frysa vid riktigt skott (flygtid kortare än
browseranrop), optional initial projectile-array och återuppta Phaser-
klockan medan matchen pausad före scene-restart; runtime oförändrad.
RTS-088 Done, nästa089 presentation/ljud för sjö.

## 2026-10-03 – RTS-089 Done: original sjöart och sjöljud

832 egna64px navalframes (två roller/fraktioner/lag,8riktningar,
idle1/rörelse4/attack4/sjunk4,8FPS) i befintlig palett. Hamnens brygga/
kran/magasin har3stadier; byggatlas60frames/1024x1024. Placeholdergeometri
ersatt med sprite registry och befintlig fog/DeathEffect/reset. Ringar,
HP och last bevarade; enemy-boarding utlöser inte falsk död. Original
cannon0,4s/splash0,5s,8 ljud totalt i samma appgraf; initial/hidden/reveal/
paus/load tysta, synlig death och ny synlig avfyrning hörs. Källor/export/
bruk dokumenterade, ingen extern art eller nya gameplayregler.

Riktat asset/presentation15/5 PASS999ms. Slutlig full748/90 PASS182,39s
under samtidiga browsers; typecheck/build/diff/602refs PASS. Bundle1600,25KB/
gzip419,19KB, storvarning kvar. Atlascounts/PNGdimensioner/frames bounds
verifierade. Tidiga checks hittade gammal48frames/6ljud-testförväntan och
byggatlasens gamla metadatahöjd768; uppdaterade exporter och relevanta
assettester till60/8/1024. Ett exakt floatframe-boundary i nytt test
flyttades från0,35 till0,36. Oförändrade gamla OGG-filer bevarades för att
undvika exportmetadata-churn. Diff granskad mot fog/boarding/death/audio/
reset/originalkällor, inga blockerande fynd.

Chromium båda fraktioner betalt sjöuppdrag till victory med nya transport/
hamnsprites och Save/restart, inga fel. Separat Normal actual insamling/
hamn/kanonbåt/synlig enemytransport, Save i flygande skott, verklig sänkning,
0,5s deathEffect och restart. Fleet-/sinking-screenshots granskade. Gesture
laddar8/8; mute gör appens båda gainkanaler0, unmute återställer, riktiga
cannon/splash BufferSource-start med originalasset-URL verifierade. Ingen
subjektiv lyssning eller andra browsermotorer verifierade. Helper skilde
Phasers egna gain från appgrafen, väntade på schemalagd gain/async resume
och stängde ljudpanelen före världsklick; inga inputkodändringar krävdes.
Klockan accelererad; gameplaystate ej injicerat. Nästa090 release.

## 2026-10-03 – RTS-090 Done: verifierad sjörelease

Slutlig full748/90 PASS146,91s, typecheck/build/diff/docs PASS. Landmatrix
30 fraktions/scenario/profilmatcher,18 utökade skirmishmatcher,6 passiva;
12 betalda naval Skirmish/mission victories,6 passiva förluster och6
betalda kanonmotmedel.24 map/faction/difficulty-options bevarar Save/reset.
Ingen ny gameplaykod; explicit navalbenchmark och liten profilscript-
option tillagd. Gamla landfixture bevarad. Granskning verificeringsscope,
regressioner, fixture/prod-separation, origassets och docs utan blockers.

Isolerad land64/128CPU p95 8,70/23,80ms, naval5,20/11,00ms, övriga
budgetar PASS;30s run+10restart, inga errors. Första konkurrerande
fullsuite/browser-mätningen avbröts när CPU/RAF påverkades. Första
navalscreenshot hade modell Öarna men Arena-bakgrund efter applyMatch;
profilscriptet väljer nu Öarna i menyn före Start, ny full isolerad
navalprofil/screenshot verifierad. Benchmark är injicerade HP/units över
supply, inte betalt matchspel. Resultat/budgetar i PERFORMANCE.md.

Ren temporär kopia: npm ci --offline49packages/audit0, typecheck/build
PASS; alla12 pixel-filer från assets:export identiska. Runtime JS1600,25KB/
gzip419,19KB, totaldist4 920 343bytes; bundlevarning avsiktligt kvar.
Local/clean/public index-Cz0Vv2w4.js byte-identisk, SHA256
3f088392c27fc399d9a05c9aed4bce8fe42fd6097b8a632c44cf60fd0ba56cfb;
public naval PNG/JSON, building PNG och cannon/splash OGG/WAV identiska.
Actions37120604107 success för4ef5895, nya runtime faktiskt publicerad.

Faktisk Pages Chromium147: movement/selection,local Save/reload/Load/
Resume,10restart, desktop/stapladvy,16 OGG/WAV-decodes, inga errors.
Två betalda sjöuppdragsflöden till victory214,39/214,00s, Save mittlast/
överfart, landstrid/restart. Normal AI-landstigning/Save till defeat256,30s;
betald hamn/kanonbåt, Save verkligt skott i flykt/Load/Resume/sänkning,
synlig DeathEffect, cannon/splash-källor, mute/unmute, restart; bas240HP
vid335,52s. Accelererad clock, ingen injicerad gameplaystate i betalda
flöden. Screenshot/mätning granskade. Akustisk lyssning/andra browsermotorer/
mobil/50-50balans inte verifierade. AI en obeväpnad transport utan
återbyggnad; navalöverlapp/omedelbar boarding kvar enligt scope.

RTS-001–090 är Done, inga öppna backlogtasks eller blockerande fynd.
Releasecommit pushas enligt mandat; dess Actions-resultat kontrolleras
innan slutrapport. Det redan verifierade produktionsbygget är oförändrat.

## 2026-10-03 – RTS-091 Done: presentation och roadmap091–120

Beställd roadmap till120 tillagd,091–096 detaljerade och enda implementation i denna körning. Inventering i PRESENTATION_AUDIT.md visar återanvändbara system och brister. Chromium1280×720/1920×1080: startsida/match/paus/resume/mittendrag utan errors; screenshots granskade. Canvas800×600 börjar y299 och klipps under720pxfönstret. Relevant69tester/11filer PASS, typecheck/build/diff PASS; oförändrad bundlevarning. Ingen runtime ändrad eller doc-onlytester. Diff granskad för historik/task-ID/scope, inga blockerande fynd. Nästa092 referensdesign.

## 2026-10-03 – RTS-092 Done: två visuella referenser

Referenser för startsida och fönsterfyllande spelkomposition, palett/font/layout dokumenterade. Egen CSS-sköld, befintliga originaltiles/sprites; mock-HUD märkt097–101. Första kompositionsprovet visade atlas-sheet; ersatt med frameklippta riktiga tiles/byggnader/units för en begriplig scen. Chromium1280×720 och1920×1080, båda vyer screenshotgranskade, inga page errors.36presentationtester PASS, typecheck/build/diff PASS. Referensscriptets sista assetkomposition browserverifierad; produktionsruntime oförändrad. Granskning scope/licens/refs utan blockerande fynd. Screenshots `/tmp/w2t-092-{home,game}-{1280,1920}.png`. Nästa093 huvudmeny.

## 2026-10-03 – RTS-093 Done: fantasy-startsida

Original CSS-sköld/palett och fyra huvudmenyingångar. Befintliga uppdrag/Skirmish/Save/ljud återanvänds, appägd navigation utan scene-listenerduplication.71relevanta tester/12filer PASS, typecheck/build/diff PASS. Chromium båda målupplösningar: alla fyra ingångar, back/Escape, ljudkontroller, saknad Save, start/paus/Save/meny/load/resume/meny; inga page errors. Screenshots granskade, upptäckt ärvd body-grid som vänsterställde huvudmenyn1920; korrigerad till en kolumn och hela browserflödet omkört. Sista CSS-centering påverkar inte typ/logik. Diff granskad för UI-isolering/session/Save/scope utan blockerande fynd. Nästa094 matchform och beskrivningar.

## 2026-10-03 – RTS-094 Done: tydliga matchinställningar

Form med befintliga karta/fraktion/svårighet och separat standard1×. Alla kartor/svårigheter har beskrivningar och fasta kartor förklaras.73relevanta tester/13filer PASS, typecheck/build/diff PASS. Chromium båda upplösningar: hela menyn/load/session, välj Forest/Clans/Hard och se korrekt summary/beskrivningar, start/Save/load/resume. Screenshots setup granskade; inga page errors.0.75× avsiktligt inte implementerad (108 ligger utanför körning). Diff granskad options/Save/scope, inga blockerande fynd. Nästa095 resize/separat spelvy.

## 2026-10-03 – RTS-095 Done: fönsterfyllande spelvy

Startsida dold under match, separat sessionrad; sidopanel bevarad. ResizeObserver uppdaterar heltalscanvas, kamera/bounds/scroll1:1 och stabilt worldinput.74relevanta tester/14filer PASS; typecheck/build/diff PASS. Chromium1280×720→1920×1080→1280×720: canvas1000×671 respektive1640×1031 inom fönstret; mittendrag, verkliga klick/move/drag, HUD-save under paus utan stateändring, Load/resume/restart/huvudmeny. Screenshots båda upplösningar granskade, pixelgrafik skarp, inga errors. Första helpern matchade inte Vites main.ts-query och kunde inte se scene; korrigerad extern URL-glob, sedan kontrollerna gröna. Ingen runtimebug dold. Diff granskat resize-listenerlifecycle, coords/raminput/Save/scope utan blockerande fynd. Nästa096 engelska.

## 2026-10-03 – RTS-096 Done: engelska i hela spelet

Gemensam text.ts för statisk copy/confignamn/guide/feedback; menyer, HUD, placement/routes, köer, förmågor, uppdrag, flottilj, audio-status, Save och resultat engelska. en-US-tal, stabila IDs/stats/Saveversion. LoadResult errorcodes och explicit loaded/resume-state tar bort språkberoende UI-villkor. Legacy rallyError visas med aktuell engelsk feedback. Pausstatus rättad från ended till frozen.

Slutlig full755tester/94filer PASS129,43s;154riktade PASS6,20s och sista118/19 PASS1,31s efter kvarvarande ASCII-svenska felsträngar/textsamling. Typecheck/build/diff PASS, bundlevarning kvar. Första text-extraktionsförsöket fångades av typecheck (numeriska nycklar, lokal namnkollision och state/type-literals); återställt ofärdig extraktion, begränsat till copy och nytt uiText-alias. Första fullkörning fyra gamla svenska assertions; uppdaterade språkförväntningar utan borttagna beteenden. Slutliga regressioner gröna.

Chromium dev och faktisk production Pages-subpath1280×720/1920×1080: alla fyra huvudmenyingångar, ljud-UI, missing Save, verklig start/pause/Save/load/resume/menu/restart, resize+mittendrag+world click/move/drag, fixed sea mission och engelsk instruktion. Survival simulerad med accelererad gameplayklocka utan injicerad matchstate till faktisk defeat/resultattabell/restart. Granskade screenshots home/game/result; inga page errors. Productionpreview behövde godkänd localhost-bind utanför sandbox, därefter flödet grönt. Ingen akustisk lyssning krävs för texttasken och ingen sådan påstås. Diff granskad för språk/ID/Save/UI-isolering/scope; inga blockerande fynd.

091–096 är Done.097–120 förblir Todo och implementeras inte i denna körning. Task096 pushas enligt mandat; slutlig Actions/Pages-resultat kontrolleras innan slutrapport.

## 2026-10-03 – RTS-097 Done: kompakt topprad

48px Menu/gold/wood/population inklusive köreservationer.56relevanta tester/16filer PASS; typecheck/build/diff PASS, bundlevarning kvar. Chromium1280×720/1920×1080: faktisk betald workerproduktion, utforskning av nod följd av gather/leverans, Menu/pause/state freeze/Save/resume/restart. Screenshots granskade, inga errors. Browser hittade33px verklig radhöjd trots48px gridrad; explicit höjd rättad och båda flöden omkörda gröna. Diff granskad UI-isolering, ekonomisanning, fog och session; inga blockerande fynd. Nästa098 selection-information.

## 2026-10-03 – RTS-098 Done: selection-panel

170px bottenpanel med live namn/HP/order/last och konfigurerad grundstatistik, atlasporträtt, gruppsummering/tom state.73relevanta tester/18filer PASS; typecheck/build/diff PASS; bundlevarning kvar. En felaktig enemy kind i nytt test fångades av typecheck och rättades till befintliga unit-ID:t. Chromium1280×720/1920×1080: verkliga worker/base/group/empty/move, paus och panelklick utan stateändring, Save/restart, canvas inom fönstret. Browserhelper behövde nästa render-frame och klick/drag inom nya viewporten/riktiga workerpositioner; korrigerat, båda flöden gröna utan errors. Worker/base/gruppscreenshots visuellt granskade. Diff granskad selection/fog/UI/Save/scope, inga blockerande fynd. Nästa099 contextual actions.

## 2026-10-03 – RTS-099 Done: kontextuell action panel

Samma actionknappar/callbacks flyttade till bottom-right med selectionfilter, kostnader/hotkeys och synliga disabled-reasons. Research via base/färdig forge; mixed selection union.127relevanta tester/22filer PASS1,63s; typecheck/build/diff PASS, bundlevarning kvar. Chromium1280×720/1920×1080: worker/base/barrackscontext, betald workerproduktion, preview/cancel utan debit, riktig barracksplacering40wood en gång, construction/bank/existingbyggnadsskäl, pause/restart, inga errors. Screenshots granskade: irrelevant köplaceholder tryckte Stop nedanför panelen; dold vid enhetsselection och hela browserflödet omkört grönt. Sista harborhint rättad vid diffgranskning eftersom naval rally inte finns. Granskning callback-lifecycle/keyboard/UI-isolering/fog/recept/scope utan blockerande fynd. Nästa100 gruppikoner/produktionsprogress.

## 2026-10-03 – RTS-100 Done: gruppikoner och produktionsprogress

Originalikoner för markerade grupper; FIFO-kö med Active/Queued/tid/progress/Cancel, explicit paused disabled-state.133relevanta tester/23filer PASS; typecheck/build/diff PASS, bundlevarning kvar. Chromium1280×720/1920×1080: riktig gruppselection→utforska→gather/leverera bank70→tre betalda workerjobb→progress→pause freeze→Save/load bevarad kö/progress→resume→avbryt exakt mittjobb100%/head50%→restart rensar. Accelererad gameplayklocka, inga injicerade units/resurser. Screenshots grupp/kö granskade och ryms; inga errors. Diff granskad queue-ID/phase/DOM-lifecycle/refund/Save/fog/scope utan blockerande fynd. Nästa101 minimapoverlay.

## 2026-10-03 – RTS-101 Done: minimapoverlay

200×150 minimap som separat world-overlay ovanför bottom bar. Kamera-only input, playingpredicate/contextmenu/shutdown, guard för HUD-release av worlddrag. currentMatch inkluderar nu navy i fogfiltrerad datamodell.111relevanta tester/23filer PASS1,46s inklusive nytt input/lifecycle-regressionstest; typecheck/build/diff PASS, bundlevarning kvar. Chromium båda upplösningar: overlaybounds/fogpixel, hörnklick/clamp, höger/mitt utan orders, worlddrag-release utan selection, pauseblockering, Save/load/restart, resize fram/tillbaka; inga errors. Screenshots granskade. Diff granskad fog/input/listenerlifecycle/camera/navy/scope utan blockerande fynd. Nästa102 kamerapanorering.

## 2026-10-03 – RTS-102 Done: kamera-pan

Piltangenter/edge-pan med config och Phaserfri riktning/clamp; mittendrag/selection/input bevaras.82relevanta tester/20filer PASS; typecheck/build/diff PASS, bundlevarning kvar. Första diagonalassertion jämförde float exakt; rättad till närhetsjämförelse, produktionslogiken oförändrad. Chromium båda upplösningar: arrows/diagonal/edge/HUD/pause/middle, worlddrag/selection/move efter pan, restart/resize; inga errors, screenshots granskade. Paus ändrar viewportheight, därför kontrollerar frysassertion position i stället för gamla kameragränser. Headless tabbfokus genererade inte pålitligt OS-blur; explicit browser-blurevent verifierade held-key/gesture-reset. Native OS-alt-tab är inte manuellt verifierad. Diff granskad focus/keyboard/listenerlifecycle/worldcoords/time/scope utan blockerande fynd. Nästa103 kameragenvägar och inställningar.

## 2026-10-03 – RTS-103 Done: kameragenvägar och inställningar

Space/Home focus utan gameplaymutation; validerade240/480/720px/s och edge on/off i menu/pause, appägda preferences över restart.86relevanta tester/21filer PASS; full781tester/100filer PASS122,74s; typecheck/build/diff PASS, bundlevarning kvar.601lokala doclänkar och unika001–120 validerade. Chromium båda upplösningar: defaults/Settings, edge off, faktiskt24/72px under100ms UI-frame, Space/Home och bevarade orders/selection, paused focusguard, edge on och settings efter restart. Wall-time-speedjämförelsen1920 nådde kartgränsen; ersatt med kontrollerad100ms faktisk scene-update utan gameplaystateinjektion. Screenshots home-settings/stabil pause granskade, inga errors. Capture väntar på nästa render efter resize för att undvika tillfälligt tom canvas. Diff granskad keyboard/focus/preferences/lifecycle/Save/scope utan blockerande fynd. Tidigare push102 Actions37129199659/Pages SUCCESS. Nästa104 pausmeny/fullscreen.

## 2026-10-03 – RTS-104 Done: pausmeny/fullscreen

Modal main/settings/quit med backdrop/fokusfälla och samma Save/session/restart/resultcallbacks. Separat native fullscreen, Englishcopy i text.ts.103relevanta tester/22filer PASS; typecheck/build/diff PASS, bundlevarning kvar. Build fångade mitt editscript som felaktigt skrev fullscreen-TS till CSS; exakt HEAD-CSS återställd och bara104-stilar tillagda. Alla checks/browserflöden omkörda gröna. Screenshotgranskning av riktig defeat upptäckte ärvd flex-wrap som klippte resultat i extra kolumn; nowrap och bredare endedmodal rättade, flödet omkört och screenshots granskade.

Chromium1280×720/1920×1080: Escape/freeze/fokus/Tabtrap, Quit Cancel/Escape bevarad fullmatch+byggnadsselection+kamera, Settings/Back, nativefullscreen enter/exit bevarad pausad state, Save/load betald kö, Resume/restart, riktig defeat via accelererad gameplayklocka utan stateinjektion och confirmedQuit tillhome. Inga errors. Diff granskad focus/keyboard/phase/DOM-lifecycle/Save/nativeAPI/scope, inga blockerande fynd.

Kodcommit b9ab2fe pushad. Dokumentationsskriptet misslyckades med strängsyntax innan commit; backlog flyttades men docs uteblev. Dokumentation kompletteras därför i separat commit, utan amend/history rewrite, före105. Shellflöden ska avbryta vid misslyckat steg. Nästa105 order/actionfeedback.

## 2026-10-03 – RTS-105 Done: order- och actionfeedback

Typade markörer för land/navy, synlig placerings-/route-/rally-/modefeedback och korrekta wood/gold/supplyskäl.113 relevanta tester/25 filer PASS; typecheck/build/diff PASS, bundlevarning kvar. Chromium1280×720/1920×1080: verkligt move/Stop, invalid placement utan debit, barracks40wood, resursbrist, arbetare bygger/utforskar/gather/levererar, betald soldier och visibleattack, pause/restart; inga errors. Browserhelper rättad för byggarbetarens nya position och väntan på input/renderframes. Screenshots move/invalid/attack granskade. Diffgranskning fångade blocked-attack mot dolt mål; visibilityguard och regressionstest införda, checks/browser omkörda gröna. Ingen balans/order/saveändring. Nästa106 attackvarningar.

## 2026-10-03 – RTS-106 Done: attackvarningar

Egen HP-snapshotpolicy, base/building/unit-prioritet, red warning/ring och3s global cooldown/4s visning. Transportpassagerare motverkar false death vid boarding. Befintligt original-command-buffer används med lägre pitch; effects/mute gäller, inga nya assets.124relevanta tester/26filer PASS; typecheck/build/diff PASS, bundlevarning kvar. Chromium1280×720/1920×1080: verkliga enemywaves skadade omarkerade workers och bas, warningintervaller minst3s, ljudbuffer decode/dispatch, pause/restartclear och mute vid resume PASS utan errors. Pausad AudioContext tillämpar schemalagt gain när den återupptas; browserassertion ändrad till verklig settingsstate underpause och faktisk nollgain efterresume. Screenshots worker/base båda upplösningar granskade. Ingen akustisk lyssning utförd. Diff granskad egna snapshots/boarding/fog/phase/audio/lifecycle/scope utan blockerande fynd. Nästa107 Beginnerprofil.

## 2026-10-03 – RTS-107 Done: Beginnerprofil

Fyra profiler i config, Beginner med lång prep/liten army/långsammare produktion; legacyEasy/Normal/Hard oförändrade. Custommissionjusteringar centraliserade och naval320sgräns, URL/menu/Save/restart med Beginner.94relevanta tester/8filer PASS; full810tester/104filer PASS144,60s, typecheck/build/diff PASS,601lokala doclänkar/unika001–120 PASS; bundlevarning kvar. Chromium1280×720/1920×1080: alla profilelabels/summary, BeginnerURL,30s utan enemy/wave/skada, Save/loadpausedprofil, verklig senare60swave med1enemy, restartclear och bevarad difficulty; inga errors. Screenshots setup båda upplösningar granskade, Start är nåbar. Diffgranskning: Beginnerreserve0 gör att initial1finansierad soldier inte blir permanent defensiv; playerstats/time/config/legacySave/scope bevaras. Navy har fortsatt två passagerare; menytext säger därför mindre attacker i stället för att lova single-unit för alla scenarier. Ingen verklig nybörjarspeltestclaim; kvarstår110. Nästa108 separat speed.

## 2026-10-03 – RTS-108 Done: separat spelhastighet

0.75×/1× i setup, oberoende av difficulty. En gemensam scene-delta skalning; UI/kamera/AudioContext använder normala tider. Save17 kräver speed och migrerar16/äldre till1; restart bevarar valet.72 initiala relevanta tester PASS; efter Save-korrigering165 tester/28filer PASS och full815 tester/105filer PASS158,64s; typecheck/build/diff PASS. Bundlevarning kvar. Chromium1280×720/1920×1080, båda speeds: riktig move + betald workerqueue,100ms frame gav12/16px movement och0.075/0.1s queue/gameclock, medan kamera48px i båda. Pause freeze, Save/load och restart bevarar speed och återställer matchen; inga errors. Setup-screenshots visuellt granskade.

Diffgranskning hittade hårdkodad10sgräns i Saveproduktion, vilket kunde stoppa Beginners12/13s job från107. Gränsen följer nu profilduration, med tester för faktiskt finansierade köer hos båda fraktionerna. Browser skirmish: verklig fiende samlade/byggde/startade13s kö vid51.19gameplays, Save/load bevarade12.76s och0.75×. Första helpern valde inte Skirmishscenario explicit och hade därför ingen enemyproduktion; korrigerad och omkörd grön. Första nya test använde legacyfixture där Clans inte hade6gold; ersatt med faktisk ekonomisk skirmish utan injicerat saldo. Slutlig fullsuite efter korrigeringen PASS. Ingen gameplaybalansändring. Nästa109 tutorial.

## 2026-10-03 – RTS-109 Done: sexstegstutorial

Campaign → Tutorial – First Steps på Arena. Fristående progression för selection, faktisk move-order/32px,20wood leverans, färdig barracks, betald soldier och manuell attack mot stationary idle-target. Ingen AI/wave eller enemyattack; trösklar/instruktioner i config. Byte av worker rebasing i movement-lektionen. Save18 validerar milestones/target/referenser,17/äldre migreras utan tutorial. Alla tidigare releasebot-scenarier behålls; nya betalda tutorialgenomspelningar för två fraktioner/två speeds.

130 initiala relevanta tester PASS; slut111 tester/24filer PASS; full822 tester/106filer PASS137,86s. Typecheck/build/diff och601 lokala doclänkar/unika001–120 PASS. Bundlevarning kvar enligt mandat. Typecheck fångade cargoType på Soldier; leveransberäkningen begränsas till workers. Screenshotgranskning upptäckte att scenens partiella HUD-matchdata utelämnade tutorial och gav1/6 i Victory; HUD använder nu currentMatch och assertion täcker6/6. Fog räknas om extra endast när en tutorialmilestone faktiskt ändrar state.

Chromium1280×720/Crown/0.75× och1920×1080/Clans/1×: fysisk klickselection och workerbyte, högerklickmove, draggruppexploration/gather/verkligleverans,40wood barracks/byggtid, betald soldier, Save/load före build och i combat med exakt samma stage/tid/en enda target, vald soldier/manualattack, Victory/result och fresh restart. Inga units/saldo/HP injicerade; gameplayklockan accelererad. Inga errors; start/gather/attack/Victoryscreenshots granskade. Diffgranskning gameplayisolation/economy/fog/input/Save/phase/legacyregression/scope utan blockerande fynd. Actions37133885618 för tidigare108/697244f är SUCCESS och Pages publicerad. Nästa110 kräver faktiskt nybörjarspeltest och får inte räknas klart av automatisering.

## 2026-10-04 – RTS-155: Human sprite reference pass

- Inspekterade godkända referensbilderna `docs/art/human-reference.png` och `docs/art/buildings-reference.png` i faktisk storlek och identifierade att de ger tillräckligt underlag för Human worker, melee-unit och huvudbyggnad (keep/base). Inga andra Human- eller byggnadsreferenser i repot bedömdes som godkända.
- Implementerade bara de asset-delar som faktiskt stöds av referensen: Human crown worker, Human crown melee/sword-and-shield soldier och Human keep/base i `assets/sources/units.mjs` samt `assets/sources/buildings.mjs`.
- Bevarade frame-format, animationer, footprints och anchors. Ingen illustrativ bild sträcktes eller beskars till spritesheet; ändringen gjordes inom projektets befintliga pixel-pipeline och palette.
- Saknade referenser rapporteras separat: övriga assetgrupper i RTS-155 saknar godkänt underlag i repot och blev inte modifierade.
- Verifiering: `npm run assets:export` och `npx vitest run tests/unitAssets.test.mjs tests/buildingAssets.test.mjs` passerade. Den väntade exporten uppdaterade den genererade `public/assets/units-atlas.png` tillsammans med källorna.
- Nästa steg: slutlig diff-/build-/git diff --check under aktuell task, därefter commit/push med kort överlämning.

## 2026-10-03 – RTS-110 In Progress: speltest förberett

RTS-109/d1e5b6f pushad. PLAYTEST.md beskriver verklig tutorial → Beginner Skirmish, observationer och tydlig åtskillnad från tekniska kontroller. Ingen mänsklig speltestdata finns ännu; inga nya balansändringar eller påhittade slutsatser. RTS-110 kan inte markeras Done av bot/browserautomation enligt användarens arbetslista. Actions37135134183 SUCCESS; publicerad109bundle index-D5sn15XH.js verifierad med riktiga inputs i realtid genom sex tutorialsteg till Victory, utan runtime-/nätverksfel. Spelarens rapport behövs innan beroende111 fortsätter. Dokumentationsändringarna för110 är ännu inte committade eller pushade.

## 2026-10-03 – RTS-110 Done: användarens speltest godkänt

Användaren rapporterar ”speltestet är avklarat och det såg bra ut”. Rapporten dokumenterad i PLAYTEST.md; erfarenhetsnivå, browser, enskilda steg och soldier-timing är inte specificerade och antas inte. Ingen rapporterad blockerare eller grund för balansändring. Tasken avslutas på användarens övergripande godkännande. Endast dokumentation ändrad; inga nya tester skapade. Befintlig 109-baseline: 822 tester, typecheck/build och publicerat browserflöde PASS. Dokumentdiff och filreferenser kontrolleras före commit. Nästa111 pixelterräng.

## 2026-10-03 – RTS-111 Done: originalterräng och kust

Fyra gräs-/två vattenvarianter, sömfria vattenbaser, exponerade jord/foam-kanter och diagonala kusthörn; världskanten skapar ingen strand. Skogs-/gruvdetaljer i samma palett; atlas256×192/23frames. Inga kart-, navigation-, ekonomi-, footprint-, fog- eller Saveändringar. 29riktade kart/terrängtester och13assettester PASS; slutlig full829tester/107filer PASS170,35s. Typecheck/build/diff och616lokala doclänkar PASS. Första fullsuite fångade assettesternas gamla160px/16frame-antaganden; uppdaterade till faktisk export med samma PNG/palett/transparens/överlappkontroller. Nytt TypeScripttest använder Vite raw-JSON, inga Node-typdependencies.

Chromiumalla4kartor×1280/1920: actual fog, kamerapan och screenshotgranskning av native terräng/kust/resurser PASS. För isolerad artgranskning doldes endast presentations-foggraphic temporärt i browserhjälparen; modelvision/enheter ändrades inte. Tutorialregressionbåda fraktioner/speeds: betald gathering/build/production/manualattack/Victory, tvåSave/load-checkpoints och restart PASS utan errors. Browserhelperns exakta bank/nodeassertioner tillät först inte samtidiga verkliga leveranser/fiendeinsamling; korrigerade till relevanta villkor och omkörda gröna. Ingen gameplayfix behövdes. Diff granskad framecoverage/kanter/världsgräns/ankare/fog/navigation/scope utan blockerande fynd. Bundlevarning kvar enligt mandat. Nästa112byggnadssprites.

## 2026-10-03 – RTS-112 Done: byggnadstyper och skadade sprites

80originalframes/1024×1280 för5typer×2fraktioner×2lag×4states. Typdetaljer även påClans, trasiga bjälkar/sprickor/spillror vid0<HP≤50% efter completion. Konstruktion har företräde. Samma ankare/native skala/footprints/palett; inget gameplay- eller Saveformat ändrat. Own portrait och synlig enemybase/outpost följer HP, frameval efter befintligt visionfilter.

15riktade asset/porträtttester PASS, full833tester/107filer PASS145,09s; typecheck/build/diff PASS. PNGbounds/RGBA/palett/transparens, fyra faktiskt olika rasterstates och lagfärger verifierade. Chromium1280×720/Crown och1920×1080/Clans: verkliga enemywaves skadade basen till117HP, damaged-world/portrait, selection, pausefreeze, Save/load exaktHP/frame/time och restart240HP/complete PASS. Ingen HP/enhet/ekonomiinjektion. Separat assetboard med alla80frames i båda upplösningar granskad; native bilder/typer/steg/skada läsbara. Tutorial betald ekonomi/build/production/manualattack/Victory/tvåSave/load/restart PASSbåda. Inga browsererrors. Diffgranskning constructionprioritet/maxHP/fog/portrait/lifecycle/geometry/scope utan blockerande fynd. Bundlevarning kvar. Nästa113enhetssprites.

## 2026-10-03 – RTS-113 Done: land/sjö-silhuetter och poser

Workerpack/rem/brätte, soldierarmor/axelplåt/plume, archerhood/quiver/bågsträng, catapulttvärbalk/hjulekrar; navalbog/lastdetaljer/kanonrekyl/tre gångvakfaser. Samma1920/832frames, åtta riktningar/nativeankare/FPS/lifecycle, inget gameplayändrat. Unitsmanifestets width korrigerad till faktiskPNG2048. Export och11riktade unit/naval/animation/rastertester PASS; full835tester/108filer PASS137,66s, typecheck/build/diff/doclinks PASS. Rastertests omfattar8distinkta riktningar, rollskillnader, minst3walk/attack/deathframes, transparens/palett/team och dimensionskontrakt.

Chromium1280×720/Crown och1920×1080/Clans: verklig exploration→wood/gold leverans→120wood/70gold→betald hamn→transport/warship→selection/rörelse→Save/load→restart PASS. Ingen injicerad ekonomi/units/HP. Browserhjälparen korrigerad för fog-known resource, implicitwarshiproll och optionalnavy efterrestart; omkörd grön. Tutorial betaldworker/soldier-gather/build/production/manualcombat/Victory/tvåSave/load/restart PASSbåda. Artboards för alla roller/fraktioner/lag,8riktningar och idle/walk/attack/death-faser granskade i båda upplösningar; faktisk sjörörelsescreenshot granskad. Inga browsererrors. Källgranskning flyttade bogdetaljer före kanon/last för att bevara läsbarheten. Diffgranskning originalkälla/palett/metadata/frameIDs/ankare/fog/gameplay/scope utan blockerande fynd. Bundlevarning kvar. Nästa114stridseffekter.

## 2026-10-03 – RTS-114 Done: sparsamma hits och riktade projektiler

PhaserGraphics arrow14px/stone4px/cannonball3px med8pxtrail; public-HPdiff hits, dedup8px/0.15s/max64,0.5s originalimpact/splash/dust. Synlig faktisk landenhetsdeath gerdust, naval behåller sinking. Ground/dead depth−1, projectile5, selection6, HP7, fog40. Snapshot resetas vidload/restart; inga gameplaydata/damage/timrar ändrade.

24riktade effects/projectile/death/warning/assettester PASS; första full839PASS. Review upptäckte ringar underprojectile; alla land/building/navalringar flyttade till6 och regression tillagd. Slutlig full840tester/108filer PASS163,68s, typecheck/build/diff PASS. SparseRGBA/palett/transparent/distinktFXraster verifierat. Chromiumbåda upplösningar/fraktioner/speeds: betald tutorial, verklig förstaHP-hit efter approach, effectlagret underunits/ringar, paus fryserFXtid, Save/load bevararHP men rensarFX, fortsatt attack/Victory med verkligdeath/dust, restart PASS. Browserhelper väntar nu faktisk räckvidd före hitassertion. Separat faktisk Phaser-renderfixture för3projektiltyper/fyraFXfaser/HP/ring/unit överlap granskad1280/1920; fixture ändrar endast displayobjects efter scenpaus, ingen gameplaystate. Inga browsererrors. Diffgranskning hidden-HP/reveal/boarding/death/lifetime/limits/rendering/scope utan blockerande fynd. Bundlevarning kvar. Nästa115referenskarta.

## 2026-10-03 – Nästa godkända etapp: RTS-121–150 (planering)

Användarens nya arbetslista är införd i BACKLOG: 30 nya unika task-ID:n,
RTS-121–126 detaljerade med krav, non-goals, dependencies, acceptance criteria,
tester och docs; senare tasks har mål/krav, dependencies, kriterier och tester.
Current Focus är fortfarande RTS-115. Slutför RTS-115–120 innan implementation
av RTS-121–126. RTS-127–150 är planering och får inte implementeras i denna
körning. Kartreferenser är registrerade som ännu inte lästa; inget innehåll
från dem har påståtts eller kopierats. Återanvänd befintlig multi-node gathering,
serviceköer, fraktions-/scenario-/Save-system efter faktisk inventering.

Validering: 150 unika huvudtask-ID:n, RTS-121–150 Todo och bibehållet fokus;
git diff --check passerar. Ingen task i nästa etapp markeras Done av planeringen.

## 2026-10-03 – RTS-115: Frontier Valley

Separat större Skirmishkarta1600×1152 med tre landpassager och två ändliga
expansioner. Stock600wood/450gold; gamla kartors stock/terräng bibehålls.
Återanvänd gathering/cargo/delivery, serviceköer, placement och fog/minimap
för alla noder. Enemyknowledge/economy kan nyttja upptäckta expansioner.
Save config19 använder vald kartas dimensioner/nodkonfiguration/ledger och
migrerar18/äldre. Camera valideras inom kartan och clampas av liveviewport.

Granskning: browser upptäckte saknat menyalternativ, åtgärdat i index.html.
Screenshotgranskning upptäckte resurs-/lasttextöverlapp, nodtext flyttad ovanför.
Testfixture korrigerad: route börjar vid worker, inte blockerade bascentrum;
Save jämför serialiserbart state utan avsiktligt härledd navigation/undefined.
Browserproduktion klickar verklig snappad footprint och använder samlat saldo.

Checks: hela npm test857tester/109filer PASS144.75s; sju Frontier-tester PASS
11.70s (betald Victory för båda fraktioner, resurskonservation/Save och verklig
AI-produktion som når/skadar spelarbasen). Typecheck och build PASS; befintlig
>500kB-bundlevarning kvar enligt mandat. git diff --check PASS.616 lokala
dokumentlänkar finns,150 unika task-ID:n efter nästa etapps planering.

Browser Chromium1280×720/Crown och1920×1080/Clans PASS: verkliga
selection/move/gather-inputs, upptäckt av expansion och hemleverans, betald
barracks→soldierproduktion/rörelse, minimap-pan till kartgräns, paus/Save/load
med bevarade noder/last/order/kamera, full restart och inga pageerrors.
Screenshots start/expansion/gräns granskade; ingen stateinjektion av saldo,
positioner eller fiender i spelarflödet. Ekonomiska fullmatcher till Victory
verifierade med gameplaybot; browserflödet verifierar ekonomi/produktion/reset.

Begränsningar: expansioner använder befintlig bas som dropoff; långa leveranser
är avsiktliga. Ingen ny AI-ekonomi, collision avoidance eller procedural map.
RTS-115 Done; RTS-116 är nästa task. Ny roadmap121–150 planerad, ej implementerad.

## 2026-10-03 – RTS-116: Äldre kartors kvalitet

Arena/Forest Pass/River Bend har kartanpassade starttips. Befintlig terräng,
resurser, spawns och AI-balans bevaras; inga blockerande kartfel hittades.
Åtta nya beteendetester täcker64×64-byggutrymme, nåbara resursapproaches,
40px-catapultväg eller Islands separata land/sammanhängande sjö/harbor, och
legacy config18-migration med samma karta/stock för båda fraktionerna.

Checks: npm test865tester/110filer PASS170.02s, typecheck/build/diff PASS.
Befintlig bundlevarning kvar. Fullsviten inkluderar betalda landmatcher,
Islands landstigning/Victory och AI:s verkliga sjöangrepp/Defeat.
Browser fyra äldre kartor vid1280/1920 PASS fog/rendering/kamera/starttips;
screenshotgranskning av kartornas bas/terräng/kust. För artreview doldes endast
fog-grafik tillfälligt, inte modellens vision eller entityfilter.
Betald Islands harbor→transport/warship→rörelse/selection→Save/load/restart
PASS båda fraktioner/storlekar; finansiering120wood/70gold efter~111s,
inga saldo-/unitinjektioner och inga pageerrors. Moving-worker-testklick
uppdateras mot aktuell position i stället för att missa efter CPU-belastning.

Granskning: inga blockerande kod-/scopefynd. Ingen onödig topologi- eller
Saveversionsändring. RTS-116 Done; RTS-117 nästa. Pages för RTS-115 var vid
senaste kontroll fortfarande in_progress; publicerad startsida hade ännu inte
Frontier. Deploy är inte påstådd klar före faktiskt success/verifierad sida.

## 2026-10-03 – RTS-117: Tekniskt verifierad, matchlyssning återstår

Tre nya originalcues gather/build/train, elva lokala OGG/WAV-ljud totalt.
Ren matchAudioSnapshot skiljer faktisk lastökning, byggprogress och spawn
från leverans/orderbyte/ny site/load. Per-cue gain/cooldown och fyra vanliga
+två reserverade sources; reset kopplar bort både källor och gains. Ingen
ändring av gameplay, Save-version eller dependencies. Gamla OGG-filer
bevarades efter export för att slippa orelaterat encoder-serialbrus.

Granskning hittade att första harbor initierar naval counter1; detta gav
falsk train-cue i en summerad counter. Normaliserat till0 och regressionstest
infört. Assettestets tidigare8-ljudkontrakt uppdaterat till11. Browserverktyget
kopplades till appens verkliga singleton via tillfällig responseinstrumentering
i stället för separat dynamisk Vite-import; ingen debugglobal i projektet.

Checks efter granskning: npm test870tester/112filer PASS172.15s;11 riktade
ljud-/assettester PASS; typecheck/build/diff PASS. PCM mono24kHz/16bit,
manifest/master/fallback/duration/peak/RMS validerade för alla11ljud. Nya
peak0.156/0.227/0.098, ingen sample-clipping. Bundlevarningen lämnas kvar.

Browser Chromium1280/Crown0.75× och1920/Clans1× PASS actual tutorial
gather→bygge→betald produktion→manualcombat→Victory→restart; accepterade
gather/build/train/impact/victory-cues, högst sex aktiva effects, forced
missing gather.ogg→WAV-fallback, paus/context suspend, två Save/load, mute
och reset, inga pageerrors. Detta verifierar ljudgrafens aktivitet/lifecycle;
är inte ett påstående om mänsklig akustisk bedömning.

RTS-117 kvar In Progress: användaren har fått frågan om faktisk matchlyssning
på http://127.0.0.1:5176/. Ingen bekräftelse ännu, därför ingen Done/commit/push
för RTS-117 och ingen beroende implementation118–126. Kod/docs/assets finns
kvar reviewbara lokalt.121–150 är planerade,121–126 detaljerade och samtliga Todo.

Deploy: både6fa7d2d/RTS-115 och4dbbd68/RTS-116 har Actions build/deploy success.
Publicerad browser verifierar Frontier-val→start→canvas→paus→Save utan
pageerrors; faktiskt publikt bundle index-ClEg8V7I.js. Published Pages
https://tobisen.github.io/warcraft-2-tribute/ innehåller alltså116, inte117.

## 2026-10-03 – RTS-117 teknisk leverans efter fortsätt-instruktion

Användaren säger ”Vi kör vidare”. Lyssning är fortfarande oredovisad och
flyttas till samlad releasekontroll120;117 är Implemented, inte slutligt Done.
Nästa implementation får fortsätta utan att upprepa den tekniska verifieringen.
Statusradens kvarvarande /8 korrigerad till gemensamma audioFiles.length (11),
samma lista används av loader. Efter denna justering:11 riktade tester,
typecheck/build/diff PASS och faktisk tutorialbrowser båda storlekar/fraktioner
inklusive11/11status PASS. Tidigare fullsvit870 PASS bevaras; inga gameplayändringar.
Inga röstassets finns i public/assets/audio; detta redovisas inför118.

## 2026-10-03 – RTS-118: Lokala engelska enhetsrepliker

36 egna selection/order-texter, sex unitroller. Lokal engelsk SpeechSynthesis
med localService-only, inga remote voices/inspelningar/backend. En speaker
per grupp,2.5s cooldown, ingen queue, roterande variation; accepted orderdiff
kring native input och grupprecall/Stop. Automation/reveal/UI utan order är
tyst. Mute/phase/load/reset avbryter; capability visas om voice saknas.

Checks: npm test873tester/113filer PASS143.03s;10 riktade voice/audio-tester
PASS; typecheck/build/diff PASS. Bundlevarningen bevarad. Browsernative
tutorial1280/Crown0.75× och1920/Clans1× PASS faktisk lokal engelsk capability
och accepterade worker selection/order och soldier selection, paid economy,
combat/Victory, Save/load/restart och audio-regressioner utan pageerrors.
Native-request-acceptans är inte påstående om mänsklig hörbarhet/klang.

Separat speech-fixture kopplad till verklig browserinput PASS group/cooldown,
variation, tom selection/tyst order, pause cancel/Save/load/restart; mocken är
redovisad och används inte som akustisk verifiering. Granskning lade till
kamera-pan-guard för selectionreplik; inga gameplay-/Save-/scopefynd kvar.

RTS-118 levererad med uttrycklig begränsning: inspelade röstassets saknas,
röstklang/capability är plattformsberoende. Mänsklig matchlyssning samlas i120
med117; ingen påstådd lyssning. Nästa119 separerar voices-volym/persistens.

## 2026-10-03 – RTS-119: Separata lokala inställningar

Schema1 preferences-slot separerat från match-Save: master/effects/music/voices,
mute, pan speed/edge pan och faction/difficulty/speed för nya matcher. Läsning
vid startup, skrivning endast vid användarändring. Per-fält defaults för
ogiltiga värden; future version/JSON/storagefel blockerar inte spel. Voices
har egen gain; master/voice-ändring avbryter aktiv native replik för korrekt
volym. Camera preferences har en liten separat pure validator.

Checks: npm test878tester/114filer PASS141.72s;21 riktade tester PASS;
typecheck/build/git diff --check PASS. Bundlevarningen lämnas enligt mandat.
Native browser: fyra volymer/mute/kamera/menyval → reload PASS. Save/load
behåller sparad match Clans/Beginner/0.75 trots nya menydefaults Crown/Normal/1;
restart behåller matchval och new-match återställer preferenser. Save-slot
förblir oförändrad av preferensändringar. Invalid JSON och blockerad storage
ger defaults och spelbar session, med icke-blockerande status vid skrivfel.
Granskning av startupordning, gains, lagringsseparation och menu/load/restart
gav inga kvarstående fynd. Ingen ändring av Save-schema eller gameplay.
RTS-119 Done; nästa120 samlad releasekontroll, inklusive kvarvarande
mänsklig lyssningsbedömning117/118.

## 2026-10-03 – RTS-120: Samlad teknisk releasekontroll

RTS-119 commit7392e32 push main bekräftad. Ny native Tutorialkontroll PASS
Crown1280/0.75× och Clans1920/1×: sex riktiga inputsteg, paid ekonomi,
produktion, manual attack, Victory, två Save/load-checkpoints, restart.
Ljud11/11, gather-OGG404→WAV, work/build/train/impact/victory från verkliga
aktiviteter, sourcebudget≤6, paus/reset/mute PASS. Native lokal engelsk
röstcapability och accepterade requests PASS; ingen mänsklig lyssning påstås.
Faktiska gather/resultat-screenshots granskade: läsbar HUD/units/fog/resultat
i båda viewports; inga blockerande visuella fynd. Settings-browser119 PASS
återanvänds eftersom ingen implementation har ändrats.

Actions118 stoppade på5s timeout i buildingAssets rastertest. Samma
palettkontroll gör nu en assertion per unik färg/frame istället för varje
pixel; alla pixlar undersöks fortfarande, transparens/team/states bevaras.
Riktad kontroll5tests PASS123ms; fullsvit878/114 PASS139.34s efter ändringen,
typecheck/build/diff PASS. Bundlevarningen bevaras. Fixen levereras inom120
för stabilare CI; ingen gameplayförändring.

RTS-120 In Progress. Pages senaste119 verifieras när Actions slutförs.
Mänsklig matchlyssning117/118 återstår före slutligt Done120 och start121.

RTS-120 publicering verifierad: Actions37148107533/a8c42c1 build och deploy
success. Både föregående118 och119 träffade samma5s rastertest-timeout;
nya fixen passerar CI. Public native browser PASS Voices0.35→reload,
Frontier→start→canvas→paus→Save, inga pageerrors. Faktiskt publikt bundle
index-DiNwZpog.js på https://tobisen.github.io/warcraft-2-tribute/.
Kontrollskriptet korrigerades för att använda synliga Settings-reglage;
dolda summary/fokus i första försöken var kontrollskriptfel, inte appfel.
150 unika backlog-ID och602 giltiga lokala dokumentreferenser PASS; ren
arbetskatalog efter implementationens push. RTS-120 tekniskt redo, men
förblir In Progress tills faktisk lyssningsbedömning117/118 finns. Detta
krav kommer från120:s spel-/ljudgranskning och Definition of Done; senaste
etappen kräver120 färdig före121. Ingen implementation121–126 påbörjad.

## 2026-10-03 – RTS-121: Inventering och detaljplan

Användaren skjuter upp ljudtest/matchlyssning och säger gå vidare.117/120
Done med uttryckligen uppskjuten perceptuell kontroll, inte påstådd lyssning.
Inventerat faktisk homeMenu/pauseMenu/session/matchResults/matchStats,
main-resize/fullscreen/preferences och Save config19/schema2, assets/export.
121–126 detaljerade kring befintliga system och konkreta regressioner.
Hittad lucka: matchStats primärnod-only missar expansionsgathering; rättas
inom123 tillsammans med byggstatistik. Original femfolks-hero och inspelade
voices saknas;126 hero planeras, native lokal speech förblir redovisad.
Öppna taskvisa val i DECISIONS; inga förtida system eller gameplay införda.
Docs-only: inga nya tester eller upprepad fullsvit. Befintliga878tester,
typecheck/build och CI a8c42c1 gröna; dokumentreferenser/unik-ID/diff kontrolleras
före commit.121 Done, nästa122 separat resultatvy.

## 2026-10-03 – RTS-122: Separat resultatvy

Ended ersätter värld/HUD/top/bottom/minimap med egen DOM-resultatsida.
Utfall/tid/karta/faction/difficulty/speed, Play Again/Main Menu/View Statistics
och Back/Escape, fokus/Tab-loop. Befintlig session och Save/load återanvänds;
pauspanelen gäller endast paused. Ingen Save-/gameplayändring.
Checks:879tester/115filer PASS141.31s,16riktade tester PASS, typecheck/build/
diff PASS. Native Tutorial verklig Victory båda faction/viewports och
kontrollerad baseHP0 Defeat-fixture: dold canvas/HUD, statistics/back/Escape,
terminal Save/load, fryst state, Play Again/full reset och Main Menu PASS.
Screenshots visuellt granskade; ingen spelvärld synlig bakom resultat.
Granskning korrigerade upprepad flytt av DOM-kontroller för att bevara fokus
över frames; inga kvarstående fynd. Bundlevarning kvar, perceptuell lyssning
uppskjuten enligt användaren.122 Done; nästa123 kompletterar matchstats.

## 2026-10-03 – RTS-123: Utökad matchstatistik

Alla resourceNodes/mapResourceTotals används nu, inklusive Frontier. Ledger
för completed/destroyed buildings och separata owner removals; inga nya
borttagningsactions. Completion före combat för land/enemy och efter navy
för harbor; cleanDestroyed registrerar death en gång inklusive base/foundation.
Counters separerar egen borttagning från combatförlust/opponent kills.

Save schema2/config20 migrerar19 och tidigare kedja med legacy-historikflagga
och noll nya bygg/removal-counters; matchdata/slot bevaras. Äldre totals
gissas inte, begränsningen visas i statistiknoten. Migrationstesternas
simulerade gamla docs tar bort det nya fältet och verifierar verklig migration.

Checks:884tester/116filer PASS145.79s;65 riktade tester och17 nolltid/ledger-
regressionstester PASS; typecheck/build/diff PASS. Första fullsviten hittade
att ledger tillsattes vid delta0 i fältlös fixture; korrigerat att bevara
nolltid utan events, andra fullsviten grön. Browser Tutorial båda fraktioner/
viewports: faktisk completion=1, statistikvisning, terminal Save/load
bevarar ledger, restart/fresh match och Victory/Defeat/navigation PASS.
623 filreferenser giltiga; granskning av completion/death/harbor/cargo och
Savekedja gav inga kvarstående fynd. Bundlevarningen kvar.123 Done, nästa124.

## 2026-10-03 – RTS-124: Releaseversion och changelog

Gemensam config/release.ts ger0.1.0 i home/top bar och original changelog.
Menyn Changelog använder befintlig Back/Escape; build-ID visas separat och
Vite injicerar local/dev, HEAD-hash/build eller unknown utan git. Ingen
match-/Saveändring. README/backlog äldre lyssningsspärrtext uppdaterad till
användarens uttryckliga uppskjutning, utan påstådd utförd lyssning.

Checks:885tester/117filer PASS144.76s;3 riktade tester PASS, typecheck/build/
diff PASS. Native browser1280/1920 home-release→Changelog→Escape/Back→
match-top-release→paus/Save PASS utan pageerrors. Byggt bundle innehåller
separat release0.1.0 och dåvarande HEAD b279572. Browser hittade initialt
changelog inuti dold match-setup; DOM-placeringen korrigerad och verifierad.
Ingen kvarstående regression/scopefynd, bundlevarningen kvar.124 Done, nästa125.

## 2026-10-03 – RTS-125: Upplösning och gemensam skalning

Sex presets + separat/default window adaptation i preferences. #app logical
workspace och gemensam aspect-bevarande CSS-scale/letterbox för canvas/HUD.
Minimum800×600 i små fönster; större presets uppskalats inte. Fullscreen
separat. Phaser resize använder logisk clientyta och refreshar bounds;
edge-pan/minimap physical→logical, rawscreen5px dragtröskel bevarad.

Checks:888tester/118filer PASS156.90s;8 riktade display/preferences/minimap
tester PASS; typecheck/build/diff och filreferenser PASS. Native browser
alla6presets×1280/640fönster PASS geometry/aspect/letterbox/reload, klick/
dragselection/group move/minimap/HUD-bounds, Save/load och upplösningsbyte
under paus med exakt oförändrat matchstate. Native fullscreen enter/exit,
resize och window adaptation PASS. Komplett verklig Tutorial/resultat/
statistik/save/restart båda fraktioner/viewports PASS efter ny container.
Screenshots granskade; inget klippt HUD eller browserfel. Ingen match-Save/
world/tile/gameplayändring. Hög preset i liten skärm ger mindre text som
förväntat; lägre preset/adaptation dokumenteras. Bundlevarningen kvar.
125 Done, nästa126 original startsideskomposition och diskret ambience.

## 2026-10-03 – RTS-126: Original fantasy-startsida

Inbyggt imagegen enligt imagegen-skillen: original femfolksillustration, inga
externa referensbilder. PNG-master1672×941/provenance bevarad i repo,
JPEG85-runtime682KB. Title/navigation DOM ovanpå art med kontrast, metadata
för Humans/Orcs/Elves/Dwarves/Goblins utan nya playable faction-ID:n. Tre
subtila CSS-embers/reduced-motion. Changelog kompletterad för125/126.

Befintlig16s loop används för menuambience efter gesture med gain0.35;
home-toggle och Settings delar master/music/mute/persistens. Browser hittade
en verklig async race vid load från meny till paus: sen context.resume
kunde väcka pausen. Faskontroll i callback suspenderar när aktuell phase
är paused; test med kontrollerat fördröjd resume verifierar regressionen.

Checks:888tester/118filer PASS148.89s efter racefix;9 riktade audio/home-
tester och3 release/audio-tester efter changelogcopy PASS, typecheck/build/
diff PASS. Native browser1280/preset1280,640/preset800/reduced-motion och
1920/preset2048: hero-load, mute→reload, meny/playing/pause/load ljudstatus,
navigation/changelog och endastCrown/Clans valbara PASS utan pageerrors.
Kontrollskript väntar explicit scenrestart innan DOM-assertions. Komplett
verklig Tutorial/resultat/statistik/save/restart båda fraktioner/viewports
PASS; raster/produtseende visuellt granskat.150 unika IDs/636 filreferenser
PASS. Granskning: inga kvarstående buggar/regressions-/scopefynd.

Lyssning/hörbarhet/balans är fortfarande uppskjuten av användaren, inte
påstått utförd. Bundlevarning kvar.126 Done; godkänd implementation121–126
avslutad.127–150 endast planerade; inget sådant gameplay påbörjat.
GitHub122–125 build/deploy success;126 publiceras och verifieras efter push.

## 2026-10-03 – RTS-127: Verifierade flera fyndigheter

Användarens fortsätt efter publicerad126 öppnar återstående roadmap. RTS-115 har redan flera wood/gold-fyndigheter, separata lager, nodeId-orders och strikt Save-validering. Återanvänt dessa utan runtimeändring; fem nya beteenderegressioner verifierar alla kartors unika ID:n/färska lager, fyra noder över upprepade leveranser och olika tidssteg, oberoende uttömning samt aktiva expansion-delivery-orders efter Save/load och avvisning av okänd referens.

893tester/119filer PASS156.20s; typecheck/build/diff PASS. Native1280×720/Crown och1920×1080/Clans: utforskning, primär/extra gathering, leverans, minimap, Save/load/restart PASS utan browserfel. Den äldre breda helpern missade en senare barracksplacering; avgränsad resurshelper passerade. Granskning av test/dokumentdiff och återanvänd kod utan blockerande fynd. Bundlevarning och uppskjuten ljudlyssning kvar.127 Done; nästa128 resursselection.

## 2026-10-03 – RTS-128: Resursselection och bottom bar

Pure selectWorldTarget prioriterar own units/buildings och väljer därefter utforskad resurs. Resursklick ersätter även Shift-selection; drag/unit/building/grupprecall rensar selectedResource. Presentation visar Wood grove/Gold mine, typ och live quantity/Depleted endast inom vision. Utforskad dold nod visar Outside current vision, inga aktuella lager. Pågående orders bevaras; resursselection ger inga kommandon. Lokalt presentationstate återställs vid Load/restart, inget Save-formatbyte.

898tester/120filer PASS149.76s;18 riktade tester PASS; typecheck/build/diff PASS. Native1280/1920 klick/unit/base/Shift/drag/orderbevarande PASS. Explicit depletion/fogfixture fryser renderloopen efter nativeflödet för stabil DOM-verifiering; första helpern hade syntaxfel, därefter en fog-race i testfixturen, båda korrigerade. Screenshot granskat, inga browserfel eller blockerande diff-fynd. Bundlevarning kvar; ljudlyssning uppskjuten.128 Done; nästa129 återanvänder befintliga serviceköer.

## 2026-10-03 – RTS-129: Verifierad flerarbetskö

Inventerat och återanvänt RTS-064/067 resourceServices: tre platser, femsekunders rotation, nåbarhetsfilter, distinkta köpunkter, delad ägarsnapshot och separation. Två nya regressioner för samtidiga wood/gold-cohorts och isolerad worker som inte låser nåbara platser. Befintliga tests täcker orderbyte/död, begränsad stock, Save/load, leverans och fiendelag.

900tester/120filer PASS139.56s;20 riktade tester PASS; typecheck/build/diff PASS. Native1280/1920 skirmish Frontier: samla, betala för två nya workers, fem workers på samma nod, högst tre serviceplatser och väntkö, leveranser PASS utan pageerrors. Screenshot granskat med urskiljbara workers. Inga blockerande diff-/scopefynd, ingen runtime-/Saveändring. Bundlevarning/uppskjuten lyssning kvar.129 Done; nästa130 resursbemanning. GitHub127 success;128 fortfarande körande vid senaste kontroll.

## 2026-10-03 – RTS-130: Live resursbemanning

Pure resourceStaffing härleder egna levande gather/deliver-workers per nodeId och aktiv fysisk service med stock/lastutrymme. Gemensam kö inkluderar enemy-workers utan att deras antal visas. Bottom bar visar assigned/gathering endast inom vision. Inga Save- eller arbetsplatsmarkörer. Tester täcker resa, kö, insamling, full last, leverans, orderbyte, död, uttömning, annan nod/soldier, fog och delad ägaradmission.

905tester/121filer PASS148.93s;20 riktade regressioner PASS efter korrekt worker-guard i testfixture (första typecheck upptäckte Unit-unionfel). Typecheck/build/diff PASS. Native1280/1920 fem betalda workers, positive gathering under flera steg, live counts och move-order som ger0assigned/0gathering PASS. Helper korrigerad för rörliga workers i drag och för att levererande workers inte alltid har köplatser. Screenshot visar5assigned/3gathering med läsbar bottom bar. Inga pageerrors/blockerande difffynd. Bundlevarning/uppskjuten lyssning kvar.130 Done; nästa131 stora kartstorlekar. GitHub127/128 success;129 körande vid senaste kontroll.

## 2026-10-03 – RTS-131:96/128 tiles och verifierad sökgräns

Två enkla Plains-storlekslayouter3072/4096px med32px tiles, start/AI-zon och ändlig stock återanvänd. Strategisk terräng kommer132/133. Tests hittade4096budget som falskt avvisade fjärrmål och barriäromvägar; höjd till16384. Førprofilen mätte update2–3/render3–6ms och felaktig unreachable på1.5–1.6ms; efterkorrektion lyckad route4–6ms. Ingen render-/algoritmrefaktor. Save-config21 migrerar20, gamla19kedjan går via20 med ledger bevarat. Initial typecheck hittade saknade mapDescriptions; båda tillagda.

934tester/122filer PASS142.57s;51 riktade tester PASS, typecheck/build/diff PASS. Native production96/128×1280/1920: välj map, pan/minimapgränser, lång worldmove, Save/load med fjärrkamera/order och restart PASS utan pageerrors. Mätt300+frames efter60warmup och10routes/2warmup i isolerad profil; PERFORMANCE dokumenterar miljö/mål/värden.128vid1920 ger omkring49FPS/RAFp95=33.4ms, ingen60FPSgaranti; första profilen34.2ms marginellt över mål redovisas. Screenshots och diff granskade utan blockerande fynd. Bundlevarning/uppskjuten lyssning kvar.

GitHub127–130 build/deploy success. Faktisk Pages130 visade Buildad518bc, native worker→gather→resursselection och Workers1assigned/1gathering, utan fel.131 Done; nästa132 stor strategisk landkarta och angivna kartreferenser.

## 2026-10-04 – RTS-132: Highland Crossroads

Egen96×96-landkarta med tre passager i bergsrygg, skogar/gruvor i fyra resurspar,1150wood/850gold totalt och separata start-/byggzoner. Återanvänder grafik och ändlig ekonomi. Granskade angivna referenser; HoMM-sidan nådd via direktHTTP, VGMaps missionbild403/cachemiss, BNE/Blizzplanet thumbnails visuellt granskade. Inga externa kartor/assets kopierade. Kartan ger lokala enemy-buildsites/muster och nåbara scoutmål som också upptäcker spelarbasen. Save22 migrerar21 med tidigare state bevarat.

Första fullsviten gav fyra5s-timeouts i highlands-settings. Connectivity-kontroller optimerade onödigt alla kontaktvägar; använder nu första giltiga witness med golden-regressioner, ordinarie approach oförändrad. Lokala byggkandidater avslöjade att produktion felaktigt använde bootstrap1280×960-gränser, trots korrekt spawn på aktuell map. Kö/UI/enemy-adapter får nu verkliga world bounds. Nya regressioner testar avlägsen betald barracksproduktion, giltig spawn och fortsatt bounded-world-avvisning; paid Crown/Clans och passivAI bevisar fiendens produktion/anfall. Testfixture-import korrigerad efter typecheck.

Slutlig npm test:958tester/124filer PASS148.96s. Typecheck/build/diff PASS;59riktade tidigare tester PASS. Native1280Crown/1920Clans: exploration, primär- och expansionsgathering/leverans, betald barracksbyggnad, minimap/worldbounds, Save/load av stock/orders/kamera/byggnad, restart PASS utan pageerrors. Fullmap-preview separat fog/zoom-fixture för geografisk granskning; unsupported zoom ingår inte i spelarflödet. Diff granskad utan kvarstående blockerande fynd; dokumentens lokala länkar finns. Bundlevarning och uppskjuten manuell ljudlyssning kvar.132 Done, nästa133 kust-/ökarta.

## 2026-10-04 – RTS-133: Shattered Coast

Egen128×128-kustkarta med västlig spelarö, nordöstlig landkust, sydlig kontinent och två avlägsna resursöar i ett sammanhängande hav. Tio ändliga noder1850wood/1150gold, tydliga rock/water-footprints och land-/sjörutter. Befintlig första överfartsprofil och ändliga sjö-AI återanvänds med explicit enemyNaval map-flag, oförändrade budgetvärden för Islands. Save23 migrerar22 och tidigare kedja utan omskrivning av befintliga matcher. Spelarens fjärrölast återförs manuellt med transport; ingen ny automatiserad sjöekonomi eller spelar-dropoff.

Sju kart-/genomspelningstester verifierar båda fraktionernas betalda sjövictory, land/sea/coastal placement, icke-överlappande vattenpatcher, terrain/resource-bounds, worker/last-tur till resursö och hemleverans, Save och passiv betald AI-invasion/defeat. Första fullsviten hittade åtta budgetasserts som hårdkodade Islands; uppdaterade till faktisk map-profil, riktade åtta settings PASS. Nästa fullsvit gav en30s-timeout i längre betald Clans-loop under samtidig browserlast; paid coast har nu samma60s-gräns som Highland. Slutlig svit utan browserlast:975tester/125filer PASS169.20s. Typecheck/build/diff PASS.

Native1280Crown/1920Clans: inga injicerade resurser/fartyg/units, gather/leverans betalar hamn och transport, worker boarding, lång sjöresa, upptäckt av ö/nod, landstigning/gathering till full last, Save/load av fartyg/last och restart PASS utan pageerrors. Helperfel rättade: syntax, fog-synlig byggplats/nod, restid före gathering och frånvaro av tom navy-state efter restart. Separat fullmap fog/zoom-fixture visuellt granskad; dess unsupported zoom-seams ingår inte i spelkontrollen. Diff/lokala docreferenser granskade utan blockerande fynd. Befintlig navalAI är en ändlig första invasion, inte full flotta/expansionsekonomi. Bundlevarning och uppskjuten ljudlyssning kvar.

RTS-132 commit8534650 push lyckades; GitHub131/132 Verify and publish Pages success.133 Done; nästa134 fraktionsmatris, med förslag att bevara Crown/Clans-ID:n som Humans/Orcs för äldre saves.

## 2026-10-04 – RTS-134: Fem fraktioners design

Detaljerad matris i GAME_DESIGN för25units/fem roller, fem building-rosters, attack/defense-research, fleet, kostnader/tider/supply/HP/fart/attack/splash, prerequisites och styrkor/svagheter. Bevarar Crown/Clans-ID:n med Humans/Orcs-presentation; nya elves/dwarves/goblins. ID-alternativ togs upp via valfråga och standardförslaget meddelades efter uteblivet svar; dependent kod byggdes inte under frågan. Specialists använder melee/projectile/splash-profiler; nya fraktionsbuffs återanvänder self-buffs utan mana/magisystem. Runtime förblir två fraktioner, inte fem genom dokumentation.

Granskning mot nuvarande factions/unit/combat/abilities/research/navy och135–141 hittade data i config men fortfarande globala combat/research/naval-värden och enemy-asymmetri; dokumenterade som faktiskt implementationsarbete, inte färdiga system. Matrisen skiljer planerade stats från runtime. Betalda gamla jobb ska bevaras, nya queues ska kontrollera prerequisites. Egna assets och faktisk AI-användning krävs innan factions färdigmarkeras.

Typecheck/build/diff och lokala docreferenser PASS. Inga tester för text eller ny browserfunktion skapades; senaste runtime-regression975/125 PASS från133. Naval-projectilehastighet i design korrigerad till faktisk280px/s. Inga blockerande granskningsfynd; starterbalans verifieras i implementation, ingen win-rategaranti. Commit13345b9f24 push lyckades.134 Done; nästa135 data/prerequisites/UI/Save.

## 2026-10-04 – RTS-135: Fraktionsdata och prerequisites

Utökat befintliga config-definitioner med roster, prerequisites, art-prefix, specialist/combatprofiler, researchnamn och separata naval-recept. Gemensam admission används av queue/UI och härleder färdiga levande buildings/research; blockerad start debiterar inget, godkända jobb fortsätter efter prerequisite-förlust. Kopplat faktisk workerfart, spelarcombat/HP/supply, buildingkostnad/HP/tid, researchmodifier/tid och navalrecept. unitDefaults bryter importcykel. Befintliga runtime-rosters/recept bevaras; Banner Guard/Raider är dolda prototyper med soldatart-alias tills136/137. Fiendens vanliga arméprofil är fortsatt generisk, full roster141.

Save24 migrerar23 och tidigare kedja, annoterar/validerar stabila typeId för egna ground/ship/embarked units, tar bort wirefält vid load och härleder profiler från matchidentiteten. Tests för completed technology, roster/admission/atomisk kostnad, accepterade jobb, melee/projectile/splash-specialister, verkliga ändrade profiler/research/build/naval, supply och Save-ID/migration. Granskning hittade kvarvarande globala supply/cooldownguards; korrigerade med regressioner. Inga blockerande fynd kvar i den granskade queue/combat/Save/UI-integrationen.

Native browser1280Crown/1920Clans: explicit aktivering av dold prototyproster, ingen injicerad bank/building/unit; samla/leverera → bygg barracks/forge → betald research → specialistproduktion → välj/flytta → Save/load PASS utan pageerrors. Screenshots granskade: namn/stats/porträtt och markering synliga. Helper rättad för fog-synlig byggplats och faktisk Clans-byggnadstext Smithy; lugn tutorial användes för detta isolerade prerequisitesflöde. Manuell ljudlyssning är fortsatt uppskjuten. GitHub133/134 Verify and publish Pages success.

Första fullsviten988tests hade två fixturefel (stale fog vid boarding och syntetisk v1 med moderna wirefält); rättade och riktade regressioner passerade. En senare körning laddade gamla moduler innan supply-rättningen men läste det nya testet; den gav en förväntad mismatch. Slutkontroller körs därför på oförändrad färdig kod innan Done/commit.

Slutlig oförändrad kod: npm test990tester/129filer PASS166.07s; riktade25supply/population/navy och6profile-tests PASS. Typecheck/build/diff/doclänkar PASS. Bundlevarning kvar enligt scope.135 Done; nästa136 Humans, inga nya fraktioner färdigmarkerade.

## 2026-10-04 – RTS-136: Spelbara Humans

Aktiverat femrolls-roster under bevarat crown-ID och Humans · Crown Alliance-presentation. Catapult kräver färdig Forge, Banner Guard också defense1/Plate Craft. Tempered Arms/Plate Craft och Cutter-namn, beslutade befintliga stats plus specialist30/15,8s,2supply,100HP/130px/s/14DPS. Catapult aggro264 enligt range+40. Dataroller/prerequisites från135 återanvänds, inga nya order-/combat-/ekonomisystem. Save25 migrerar24 och bevarar betalda catapultjobb utan retroaktiv Forge-kontroll. Explicit regression för detta samt blockerad/avslutad research, kostnad/tid/spawn och betald Human enemy-grundproduktion. Full AI-roster kvar141; generisk enemy combatprofil redovisas och ändras inte här.

Original Banner Guard-pixelgrafik i befintlig repo-native källa: guldrustning, kite shield och fana, två teamägare, åtta riktningar och idle/walk/attack/death. Atlas2048×4352/2128frames, befintliga ID:n/palett/anchors bevarade. Human-byggnadsbilder redan egna sten-/trä-/heraldikvarianter, återanvända.134 designinventering hade felaktigt angett96px som generell spelarbas; rättat till faktisk player48/enemy96 och bevarat geometri så att gamla saves/placement inte skrivs om.

Native1280/1920 normal Human-roster, Campaign→Tutorial: samla/leverera/betala barracks+forge+Plate Craft+Banner Guard, välj/flytta/egen bild, Save/load, manuell attack/target death/victory och Play Again som återställer workers/bank/buildings PASS utan pageerrors. Screenshots av specialistporträtt och victory granskade. Helperns extra attack klickade ovanför canvas efter kamerapanning; faktisk position/order visade oförändrad idle, vanlig ArrowUp-pan rättade verifieringen. Inga injicerade bank/buildings/units eller roster-override. Ljudlyssning fortsatt uppskjuten.

Första riktade check hittade gamla atlas4096/1920asserts och catapult-start utan Forge; uppdaterade till faktisk atlas/teknikprecondition.19 riktade regressioner och14 Human-/assetchecks PASS, typecheck/build/diff och doclänkar PASS. Fullsviten upptäckte gammalt Warship-namn i selectionInfo-test, uppdaterat till beslutade Cutter; slutlig fullsvit återstår före Done. Bundlevarning lämnas enligt scope.

Slutlig fullsvit994tester/130filer PASS165.29s, selectionInfo10 riktade PASS efter namnkorrektion. Typecheck/build/diff/doclänkar och nativebåda upplösningar PASS. Inga blockerande fynd i runtime/config/migration/atlas/UI-diffen; begränsad AI-roster redovisad. GitHub135 Verify and publish Pages success.136 Done; nästa137 Orcs.

## 2026-10-04 – RTS-137: Orcs offensiva roster

clans-ID bevarat, Orcs · Iron Clan/Peon-presentation och fem roller enligt134. Worker35HP/155px/s, melee20DPS, ranged45HP/135px/s/144range/1.1interval, siege90HP/75px/s/208range/26damage/2.1interval/11s. Raider80HP/175px/s/24DPS,26/12,7s,2supply och Forge+attack1. War Blades35/15,1.30; Hide Armor0.80. Stronghold260, War Hut/Smithy130, Cattle Pen90, War Dock170; War Barge/Raft100HP/105px/s. Buff Fury fortsatt1.25/5s. NPC-armé36HP/6DPS/65px/s och enemy-base240HP bevaras tills141; NPC-worker/build/research/naval använder egna data.

Egen original Raider-silhuett med bar hud/huvud, läderrustning och tvåyxor, åtta riktningar och två team.2336frames i2048×4736atlas, samma anchors/palett/faser/ID:n; egna Orc-byggnadsutseenden återanvänds. Save26:s25-migration validerar äldre siege40/20/10s och markerar legacy-recept; behåller timer/kostnad/skadad HP utan ny debitering/healing. Nya jobb kräver Forge och11s; datagränser för duration/cooldown stöder detta. Regressioner verifierar Raider research/start/pay/time, faktisk Fury×War Blades-skada39/s, workerfart, modern siege, gamla betalda siege-jobb och felaktig migrerad kostnad.

Native1280/1920 Campaign→Tutorial: betald gather/leverans, War Hut/Smithy/War Blades/Raider, egen bild/porträtt, selection/movement/Save/load/manuell attack/victory/Play Again PASS utan pageerrors och utan injicerad bank/units/buildings. Bildgranskning hittade riktigt HUD-fel260/240; rättat till260/260 och NPC-hälsostaplar till relevanta profiler. Återverifierad native HUD och hela flödet PASS. Ljudlyssning fortsatt uppskjuten.

Riktade checks upptäckte gamla namn/HP/gränser och abilityfixture utanför Hunters kortare range; uppdaterade till beslutade beteenden, behållit Human-regression. Typecheck hittade för smal CombatState-testadapter, rättad.27 enemy/research/ledger/Orc,14 combat/Orc,22 naval/building/Orc och8 HUD/Orc riktade tests PASS. Första fullsviten hade två kvarvarande gamla HP-asserts (Clans-fartyg90 och delad building-max); båda rättade. Slutlig fullsvit körs på färdig kod före Done. Typecheck/build/diff/doclänkar PASS; bundlevarning lämnas enligt scope.

Slutlig oförändrad kod998tester/131filer PASS161.30s; typecheck/build/diff/doclänkar och återverifierad browser båda upplösningar PASS. Diff/config/combat/Save/presentation/atlas granskade utan blockerande kvarstående fynd, AI-begränsning redovisad. GitHub136 Verify and publish Pages success.137 Done; nästa138 Elves.

## 2026-10-04 – RTS-138: Elves woodland-roster

Tredje stabila identiteten elves, fem roller enligt134, snabbare worker/armé och lättare HP, projectile-Marksman samt True Shot. Egna building/research/naval-recept och menyalternativ, datastyrda initiala spriteprefix. Save27 migrerar26, avvisar historiska Elf-ID:n och felaktiga typeId, behåller Crown/Clans-state. Nya beteendetester för faktisk workerfart, atomic Marksman prerequisites/kostnad/tid/spawn, research×buff-projektil24damage, expiry/orders, betalda fartyg/HP/Save och versionsidentitet. NPC-grundprofil kvar141, redovisad.

Original repo-native woodland-unit/building/navalbilder,3504/120/1248frames i2048×7040,1024×1920 och1024×4992atlas. Rastertest hittade avklippt Garden-lagflagga; flagTop klampad. Bild-/diffgranskning tog bort gammal stenbasket från Ballista och riktade bulten för åtta skilda facings. Alla riktade rastertests passerade därefter. Typecheck fångade för bred testunion; narrowing korrigerad. Fullsvitens första körning såg config före parallell hitRadius-rättning samt gammalt preferences-test där elves räknades ogiltigt; ändrat till unknown-faction och explicit giltig elves. Slutkontroller körs på oförändrad kod.

Native1280/1920 Campaign→Tutorial: verklig gathering/delivery/betalning av Lodge/Workshop/True Aim/Marksman, egen bild/porträtt, selection/movement, Save/load, manuell projectileattack/victory/Play Again PASS utan pageerrors eller injicerad bank/units/buildings. Screenshots granskade. Ljudlyssning fortsatt uppskjuten. GitHub137 Verify and publish Pages success. Typecheck/build PASS; befintlig bundlevarning lämnas. Fullsvit och separat betald Coast-färjeresa återstår före Done.

Slutlig oförändrad kod:1002tester/132filer PASS175.58s; typecheck/build/diff/doclänkar PASS. Slutlig nativeTutorial båda upplösningar återverifierad efter export, egna buildings/porträtt granskade. Coast båda upplösningar: betald River Dock/Grove Ferry, lång voyage, unload,5wood på resursön, Save/load/restart PASS. Hjälpflödets gamla initialklick tog med guldlast; rättat till faktisk leverans före resan och eventbaserad väntan. Detta bekräftade befintlig regel att resurstypbyte först levererar gammal last, ingen gameplayrättning behövdes. Samlad atlas/config/Save/UI-diff granskad utan blockerande fynd.138 Done; nästa139 Dwarves.

## 2026-10-04 – RTS-139: Dwarves försvar och siege

Aktiverat stabilt dwarves-ID/fem rosterroller/recept/building/research/naval enligt134, Brace och menyalternativ. Tester för faktisk workerfart/22wood/6s, tåliga profiler, Cannon12s, Stone Plates10s/45/15 och atomic Bulwarkprerequisite/pay/time/spawn. Faktisk melee-defense0.65×Brace0.65, outgoing14×research1.25; timer/orderexpiry. Betalda Stone Dock/120HP Ironclad10s/Heavy Ferry8s och Save28, Cannonjobb/25s Brace-timers/stabila ID:n; historisk27 dwarves avvisas, gamla elves bevaras.

Originala korta/breda skägg/rustning/verktyg/sköld/crossbow/cannon och stonevault/buttress/furnace/armored naval i etablerade repo-native källor. Unit-atlas64kolumner4096×4672/4672frames istället för för hög smal atlas; metadata-ID:n/anchors/logiska bodies bevaras. Building160/naval1664frames. Rastertest hittade för få transport-walkvarianter efter armored-overlay; pennant-flutter varierar nu tydligt per frame. Riktade54fraktions/Save/assettests PASS; typecheck/build/diff PASS. Kontaktark granskat, fullsvit/nativeflöde återstår innan Done. GitHub138 Verify and publish Pages success. Ljudlyssning fortsatt uppskjuten; bundlevarning lämnas.

Slutlig fullsvit1006tester/133filer PASS169.43s; typecheck/build/diff/doclänkar PASS. Native1280/1920 verklig betald tutorial/Foundry/Stone Plates/Bulwark/egna buildings+porträtt/movement/Save/load/attack/victory/Play Again PASS, inga pageerrors eller injicerade units/bank/buildings. En tidigare placeringskontroll nekades när annat arbete passerade byggytan; senare replay lyckades och robust hjälpflöde flyttar guldarbetaren åt sidan först. Ingen placeringsregel ändrad. Native Coast båda upplösningar: Stone Dock45/10/200HP, Heavy Ferry45/10/120HP, lång sjöresa/unload/5wood/Save/restart PASS; placering inne i tile undviker gränsklickens rounding. Egna artwork/nativebilder granskade. Config/queue/Save/pixelkällor/metadata/UI-diff utan blockerande kvarstående fynd.139 Done; nästa140 Goblins.

## 2026-10-04 – RTS-140: Goblins snabb produktion och splash

Femte stabila fraktions-ID goblins,134:s roster/stats/recept/building/research/naval/Overcharge och menyalternativ. Nya beteendetester för faktisk Tinkerer180px/s/18wood/4s, Hot Powder6s/30/20 och atomiskt prerequisitesberoende Grenadier25/25/7s. Verifierat verklig projectile35.1damage med1.3research×1.35buff, splash mot två enemybodies utan friendly fire, Overcharge1.2 received×0.85research och timer/orderexpiry. Betald Junk Dock/Powder Boat6s/Junk Ferry8s/65HP, Save29 med historiska faction/type-ID:n, aktiva splashprojectiles och timers; äldre Dwarf28 migrerar utan stateändring.

Egna små green/goggle/scrap/slingshot/grenade/Mortar-, patched tin/lab/pipe- och junkfleetbilder i befintliga repo-native källor. Atlas5840units4096×5888/200buildings1024×3200/2080naval2048×4160, naval32kolumner så texture-dimensioner under8192. Samma frame-ID:n/ankare/palett/animationer, metadata och PNG exporterade tillsammans. Kontaktark granskat, rastertester för alla fem rosters PASS.59riktade fraktions/Save/assets-tests, typecheck/build/diff PASS.

Native1280/1920 betald Tutorial/gathering/bygg Lab/Hot Powder/Grenadier/egen bild/selection/movement/Save/load/attack/victory/restart PASS utan pageerrors eller injicerad bank/units/buildings. Fullsvit och betald sjöresa återstår före Done; full AI141, ljudlyssning uppskjuten och bundlevarning kvar enligt scope.

Slutlig oförändrad kod1011tester/134filer PASS164.99s; typecheck/build/diff/doclänkar PASS. Native Coast1280/1920 betald Junk Dock35/10/130HP, Junk Ferry35/10/65HP, lång sjöresa/unload/5wood/Save/load/restart PASS utan pageerrors. Tutorial/sjöbilder och Overcharge-knapp granskade, inga injicerade bank/buildings/units. Config/prerequisite/queue/combat/Save/atlas/UI-diff utan blockerande kvarstående fynd. GitHub139 Verify and publish Pages success.140 Done; nästa141 femfraktionsval/AI/roster/balans.

## 2026-10-04 – RTS-141: fraktionsval, NPC-roster och balans

Separat motståndarval i meny/session/preferenser, alla25par med restart/Save. NPC-adaptrar för full betald roster, prerequisites/supply, egna army-/building-/baseprofiler, ranged/siege/specialist-projectiles, fog och befintliga självbuffar; korrekt grafisk roll/HP. Save30 skiljer historisk generic army/basbyggnader från nya profiler utan healing/refund eller omstart av jobb. Befintliga migrationstester får explicita historiska NPC-fixtures, eftersom nya profiler inte får maskeras som gammal Save.

Första fullsvit hittade historiska generiska HP-/produktionsförväntningar samt riktiga paid-playthrough-förluster när NPC fick ordinarie fraktionsstyrka. Äldre fyrsoldatsstrategi förlorade bland annat Normal/Hard; modern landstrategi använder betald farm/fler units och 120s konfigurerad ekonomigrace (äldre20s kvar). Sjöstrategi använder betald farm/fyra passagerare och egen buff; base/worker-oskadbarhet hävdas inte längre när riktiga NPC-attacker kan ske. Balansprofiler ändrar inte unitstats för att tvinga fram vinst.

Autonomt NPC-ekonomitest fann roster-starvation: billigare units konsumerade bank innan siege/specialist hann finansieras. AI:n sparar nu till nästa upplåsta roll och ekonomin väljer rätt resursbudget. Alla fem betalar faktisk byggnation/research/ersättning och observeras producera fyra stridsroller efter simulerade stridsförluster; fixture har förstärkt spelarbas för att kunna observera AI, och redovisas inte som betald spelarvinst.28 riktade NPC-tester PASS efter rättning. Fullsvit/nativebrowser/slutreview återstår före Done. Ljudlyssning fortfarande uppskjuten och befintlig bundlevarning lämnas.

141 fortsatt verifiering: Hard River avslöjade ett beroendestopp i releaseboten när en död soldier ersattes med catapult före färdig Forge. Slutlig betald River-strategi bygger farm/sextal närstrid och samlar units före anfall; inga testresurser injiceras. 120s roster-grace bevarad efter försök med150s. Hard River-riktad match PASS; NPC-/footprint-review30tester PASS. Strikt NPC-buff-timeline, ship-researchförsvar och stor siege-body vid placering/spawn rättade under granskning. Native1280/1920 Humans–Goblins och Elves–Dwarves: meny, faktisk samla/bygg/producera/attack/buff, fog, Save/load, restart PASS utan pageerrors. Den egna ensamma soldaten dog legitimt mot NPC-försvaret; detta nativeflöde hävdar ingen seger. Fullsvit körs fortfarande.

Fullsvitens nästa körning fångade försenade passivangrepp på Frontier/Plains jämfört med gamla200s observationsfönstret samt CPU-contention i långa paid-matchtester. Passivtesterna simulerar nu upp till400s och kräver fortfarande faktisk basskada; större kartans matchdeadline60s. Vitest begränsas till två workers, utan borttagna vinst-/ekonomiassertions. Arena/Forest återfår riktad resursförsvarsstrategi; samlingsorder före anfall begränsas till River. Ny fullkörning krävs på slutlig kod.

Slutlig oförändrad gameplaykod: npm test1044tester/137filer PASS514.63s med två workers. npm run build inklusive strict typecheck PASS; git diff --check och lokala doclänkar PASS. Native1280/1920 på slutlig kod upprepade hela ovanstående betalda fraktionsflöde inklusive nya NPC-profiler/Save/load/restart utan browserfel. Bilder granskade i båda upplösningarna; inga saknade roster-assets observerade. Granskat config, economy/production/prerequisites/supply, navigation/kroppar, projectile/splash/visibility/buff, migration/typ-ID/timers, menu/preferences/reset och scope; inga kvarstående blockerande fynd. Fulla betalda Crown/Clans land-/sjö-/missionregressioner passerar; fem NPC-rosters och25identitetspar är separat verifierade, ingen lika-win-rate-garanti. Bundlevarning, uppskjuten faktisk ljudlyssning och scripted/naval-begränsningar redovisas ovan.141 Done; nästa142 Campaign-struktur/progression.

## 2026-10-04 – RTS-142: Campaign-struktur och progression

141 levererad2a6d95f till origin/main.142 detaljerad under samma ID: ordna fem fungerande befintliga scenarios, lokal unlock/completion/replay, briefing/mål/debriefing och verklig campaign-run som överlever Save/load/restart. Nya uppdrag/mål/fraktionsstory skjuts till143–145 enligt beroenden; inget återimplementerat gameplay.

142 implementerad config för fem befintliga mission-ID:n/briefing/debriefing, ren unlock/start/completion/replay-logik och separat versionsmärkt lokal store. Campaign-meny visar fem statusknappar och verkligt mål, låsta starter nekas i logik; victory-resultat registrerar idempotent completion. Storagefel rapporteras och sessionens framsteg behålls. Matchens run-ID följer paus/Save/load/restart men rensas vid ny Skirmish. Save31 migrerar30 utan historisk campaignfiction och validerar run/scenario/map. Befintliga mål/recept/combat/AI återanvänds.

75 riktade campaign/NPC/Save/menytester PASS3.21s; strict typecheck/build/diff PASS. Native1280/1920: initialt fyra låsta uppdrag, riktig betald Tutorial med movement/gather/delivery/build/train/manuell attack, Save/load, victory/debrief, lokal completion, Play Again/restart, nästa Forest Watch och ny Skirmish utan run-ID PASS; inga browserfel eller injicerade resurser/units/buildings. Screenshot av missionlista och debriefing granskad;1280-menyn scrollar till längre setup som befintlig layout. Första externa browserhjälparen hade extra slutparentes, syntax korrigerad före fungerande körning. Sluttext för Crossing undviker falskt påstående om äldre completion vid load i ny browser. Full regression körs;142 är ännu In Progress. GitHub141 Verify and publish Pages fortfarande in_progress vid senaste API-kontroll. Ljudlyssning uppskjuten och bundlevarning kvar.

Slutlig full regression1064tester/138filer PASS442.62s. GitHub141-build37187147449 misslyckades: npm test gav annoterad60s timeout i paid Highlands; typecheck/build/deploy blev därför skipped. Höjt endast Highlands två paid-genomgångars väggklocksdeadline till120s; vinst, resursbevarande, faktisk betald ekonomi och begränsad gameplay-matchtid oförändrade.26 riktade Highlands/campaign-tester efter deadline-/textjustering PASS52.24s. Slutlig typecheck/build/diff/doclänkar PASS. Native1280/1920 upprepad på slutlig kod inklusive browser-reload efter completion: progression/next mission/replay kvar, inga errors. Granskat mission/source-goal-bindning, state/store/exception/idempotens, låst start, scene/reset, result/menyinput och Save-migration; inga kvarstående blockerande kodfynd.142 Done; leveransen innehåller ovanstående CI-deadlinefix och GitHub-resultat ska följas utan att hävda lyckad publicering i förväg. Nästa143 planerar minst åtta uppdrag, innan implementation144–145. Ljudlyssning uppskjuten; bundlevarning kvar.

## 2026-10-04 – RTS-143: plan för åtta campaign-uppdrag

142 levererad39194fd till origin/main.143 är planeringssteget enligt användarens uttryckliga krav på berättelse/fraktion/karta/mål; faktisk implementation av första/andra halvan hör till144–145. Fem befintliga mission-ID:n bevaras och tre nya uppdrag planeras, utan tomma framtidssystem eller för tidig exponering i menyn. GitHub142 följs för deadlinefixen.

143 dokumenterar Five Banners of the Frontier: åtta ordnade unika ID:n, fem bevarade verkliga missions och tre nya planerade escort/rescue/capture-operationer. Alla fem player-rosters, fasta enemy-par, faktiska kart-ID:n, initiala förråd, success/failure/defeat-precedence, progression/Save-krav och successiv leverans144–146 redovisade. Numeriska planpunkter verifierade med40px body mot verkliga terrainrektanglar; path/spawn/fog/matchbalans återstår uttryckligen för implementation. Ingen runtime/menu/Save-version/asset ändrad i143. Rättat plantext så courier/initialguards skiljs från betald spelarproduktion och inte påstås gratisproducerade/reward-units. Ingen testkod skapad för dokumentation. Typecheck/build/diff och åtta unika ID:n/geometrikontroller PASS; slutlig käll-/doc-konsistensgranskning pågår.

143 slutgranskad:8 unika ordnade mission-ID:n,5 faktiska scenarios/ID:n bevarade,5 playerfactions och samtliga kartreferenser mot kod PASS. De nya måltyperna redovisas som saknade inför145; ingen runtime-/meny-/Save-funktion eller genomspelning av dem påstås färdig. Typecheck/build/diff/doclänkar och40px terrainkontroller PASS. Ingen ny fullsvit/browser för ren dokumentändring;142:s senaste1064pass och nativeflöden gäller oförändrad runtime. GitHub142 run37188242316/39194fd completed success inklusive Pages: den annoterade Highlands timeout-rättningen passerar nu på faktisk runner.143 Done; nästa144 färdigställer/fixerar berättelseprofiler och verifierar första fyra operationerna.

## 2026-10-04 – RTS-144: Campaignens första fyra operationer (pågående)

143 levereradc7cbd19 till origin/main.144 binder fyra bevarade scenarios/missions till planens berättelseprofiler, förbättrar deras faktiska mål/förmågebriefings och verifierar betald framgång/förlust/progression/Save/replay/nativeflöden. Äldre campaign-Saves med tidigare valda fraktioner ska fortsätta fungera. Inga nya måltyper/uppdrag eller omimplementerad gameplay i denna halva.

144 riktade33tester/2filer PASS12.75s: alla fyra verkliga Normal-mål med betald ekonomi, mid-match Save, outcome-freeze/progression/replay och separat defeat-precedence. Nativekedjan First Steps(Beginner)→Forest Watch→The Siege→The Outpost(Normal) PASS i1280×720 och1920×1080 utan pageerrors, med Save/load, Play Again/restart, upplåsning, ny Skirmish och browser-reload. Inga resurser/units/buildings injicerade i genomspelningen. Forest Watch cirka122–123s/Stronghold260HP, Siege173–177s/Grove Hall220HP, Outpost90s/Stone Hold300HP i slutlig browserkörning.

Browserhjälparen missade först off-camera farmplacering och tät arméklickselection; minimap-kamerarörelse, verifierad klickselection med dragfallback samt faktisk Attack-move-knapp rättade enbart testhjälparen i/tmp. Det var ingen gameplaybalansändring. Separat nativepreferenstest och explicit gammal Elf→Dwarf campaign-Save-fixture/load/restart PASS i båda upplösningarna; detta fixture redovisas inte som betald vinst. Första externa legacyhjälparen hade syntaxfel, rättat innan verifiering. Resultatbilder granskade. Typecheck/build/diff/doclänkar PASS; fullsvit krävs fortfarande före Done. GitHub143/c7cbd19 completed success inklusive Pages(run37188945104). Ljudlyssning uppskjuten; bundlevarning oförändrad.

144 slutlig fullsvit1077tester/139filer PASS493.31s. Typecheck/build PASS på samma kod; diff/doclänkar PASS. Granskat preset-start/meny/preferenser/äldre load/restart, Save-identitet, betald ekonomi, verkliga mål, defeat-prioritet och regressioner utan kvarstående blockerande fynd.144 Done. Nästa145 färdigställer5–8 inklusive de nya escort/rescue/capture-målen;144 levereras separat före nästa implementation.

## 2026-10-04 – RTS-145: Campaignens andra fyra operationer (pågående)

144 levererad8e7dc20 tillorigin/main.145 återanvänder Crossing och inför konkreta escort/rescue/capture-mål först för de tre uppdrag som behöver dem. Följ143:s ID:n, profiler, kartor/förråd/zoner; all produktion betald, initialcourier/guards redovisas separat. Save/marker/input/utfall och paid-genomspelning verifieras innan Done.

145 implementerar Crossing med fast Goblin→Human-profil samt Ridge Convoy/Highlands, Valley Rescue/Frontier och Coastal Banner/Coast. De nya operationerna använder två namngivna initialguards med riktiga fraktionsstats; courier är en initialworker. Statistik/supply skiljer dessa från betald produktion. Ren operation-logik hanterar courierförlust/ankomst, guards+combat vid camp och30s kontinuerlig okontesterad markkontroll; workers/ships/cargo håller inte banner. Defeat prioriteras, paus/delta0/gameover och exakta tidsgränser hanteras. Save32 migrerar31 utan att skapa historiska objective-data och validerar nya entities/timer/missions strikt. Åtta menyuppdrag, fasta ny-start-profiler, fogmedvetna namn/zonringar och riktig goalstatus utan falsk wave-räknare. Inga nya assets eller ekonomirewards.

Riktade paid-operationstester upptäckte att hjälparen antog en redan byggd farm och använde Islands scout/rally även på land. Endast helper rättad: optional farm-access, verklig inlandsgold och giltig Frontier-rally. Fyra nya paidNormal-operationer passerar med faktisk insamling/byggnation/produktion/navaltransport och Save/load. Goal-fixtures hålls uttryckligen separata från paidplaythrough; guard/courier-identitet, fog, counter/statistik, contest/absence/pause/delta/defeat, versionmigration och legacyprogress verifierade. Senaste riktade30tester/2filer PASS1.48s; tidigare54/4 PASS22.96s inklusive paidmål och Save-regressioner.

Native slutlig sammanhängande First Steps→Coastal Banner(alla1–8) PASS vid1280×720 och1920×1080 utan admissionfixture, injicerade units/byggnader/bank eller browsererrors. Första Tutorial påBeginner; återstående påNormal. Verklig upplåsning, Save/load, paidarmy/Harbor/Transport/boarding/landing, escort/rescue/capture, debrief/replay/reload verifierade. Försöken i/tmp missade först rörlig selection och en blockerad strand; hjälparen synkar riktiga pointer-events med renderframes, använder verkliga kontrollgrupper/minimap och väljer fri landstigningsyta. Korrekt blockerad unload behöll hela lasten; ingen balansändring gjordes för testvinster. Slutliga native-resultatbilder granskade i båda upplösningarna. Slutlig typecheck/build/diff PASS; full regression körs fortfarande. GitHub144/8e7dc20 completed success inklusive Pages(run37191084280);145 ännu inte publicerad. Ljudlyssning uppskjuten enligt användaren, bundlevarning oförändrad.

145 slutlig fullsvit1111tester/141filer PASS488.46s, typecheck/build/diff/doclänkar PASS på slutlig kod. Granskat missionconfig/initialstats/supply, objective/delta/defeat/freeze, fog-/goal-presentation, strikt Save32 och äldre migration/identitet, statistik/produktion och paidhelperändringar; inga kvarstående blockerande fynd. Alla1–8 verifierade genom faktisk sammanhängande nativekedja i båda upplösningarna.145 Done, nästa146 fördjupad campaign-verifiering; commit/push görs separat före nästa task.

## 2026-10-04 – RTS-146: Campaign-verifiering (pågående)

145 levereradc7579d8 tillorigin/main.146 fördjupar Save/partialgoal/failure/idempotens, med145:s faktiska betalda1–8-nativekedja som speltestbas. Ny riktad nativeCoast ska verifiera paus/load av pågående capture och reset vid frånvaro; inga nya gameplayregler eller kommandon.

146 tillför13 riktade objective-regressioner;59tester/3filer PASS1.50s tillsammans med befintliga campaign/operations-fall. Alla åtta validSave-defeats/replay utan unlock, delvis guardclear/partialcapture, pause/load/absence-reset och faktiskt escortgoal med en store-write över upprepade endedSave-load. Bank/cargo/stats oförändrade av registration; inga rewards införda. Oförändrad runtime innebär att145:s senaste1111/141fullpass återanvänds, inte påstås vara en ny1124fullkörning. Typecheck/build/diff PASS. NativepaidCoast(1280) partialcapture6.13s→pause/Save/load→absence/reset→ny30s→victory PASS;1920 körs fortfarande. Explicit prior1–7completion-fixture används enbart för att admittera detta riktade missiontest, medan145:s båda verkliga fullkedjor saknade sådan fixture. GitHub145 run37195021593 fortfarande in_progress vid senaste kontroll.

146 slutlig nativepaidCoast även1920PASS: partialcapture5.32s, pausefreeze, Save/load, frånvaro/reset och nyfull30s innan victory; inga browsererrors. Bilder granskade i båda upplösningarna. Review av samtliga måltriggers/failure/Save32/progressstore/replay och testfixture-avgränsning gav inga blockerande fynd; ingen runtimeändring. Fullkedjans145-speltest och nya13fall dokumenterar faktisk grundbalans/blockerad-strandhantering, utan all-difficulty-garanti. Doclänkar/diff/typecheck/build PASS, bundlevarning kvar och ljudlyssning uppskjuten.146 Done; nästa147.

## 2026-10-04 – RTS-147: Dismiss egna enheter (pågående)

146 levereradad6068a tillorigin/main.147 implementerar bekräftad egenunit-borttagning med count inklusive passagerare, säker befintlig cleanup och separat removedstatistik. Bekräftelse ska frysa simulation/input och cancellation ska bevara state. Inga refunds/kills eller byggnadsrivning.

Senaste användarstyrningen pausar stora körningen: endast147 färdigställs, ingen148. AGENTS och alla tre rollfiler uppdaterade med riktade arbetschecks, en full slutcheck, inga omotiverade breda genomspelningar och stopp efter verifierad commit/push. Befintliga ändringar bevarade; ingen reset/borttagning.

147 riktade26tester/4filer PASS549ms: proposal/own-only, supply/group/byggarreferenser/AI-targets, cargo/ship-passagerare, removed utan kill/refund, courierdefeat/capturereset/Save samt Delete-fokus/modifiers/repeat. Första testförsöket hade felaktigt immutability-snapshot runt controlGroups och TypeScript saknade worker-narrowing i cargo-fixture; testkod rättad före pass. Native1280/1920 faktisk gathering/cargo→Delete→freeze/cancel/Escape→confirm→gruppconfirm→Save/load/restart samt byggnadsspärr PASS utan browsererrors. Hjälparen i/tmp hade först syntaxfel, rättat innan fungerande browserkontroll; ingen runtime- eller balansändring för testflödet. Fulla slutchecks körs en gång på slutlig kod.

147 review: granskat own-ID-/count-/passagerarvalidering, idempotent confirm, cargo conservation/lost cargo, pop/reservations/byggare/AI-targets/controlgroups, removed/kill-statistik, courier/capture-outcome, modal/fokus/input/freeze/resume/shutdown samt Save32-kompatibilitet. Inga blockerande fynd; browserbilder granskade i1280/1920. GitHub145/c7579d8 completed success inklusive Pages(run37195021593);146/ad6068a in_progress vid kontroll. Endast147-fullcheck körs nu, inga extra breda matchgenomspelningar.

147 slutlig verifiering: en full npm test-körning1132tester/143filer PASS483.26s, följd av npm run build inklusive strict typecheck PASS och git diff --check PASS. Riktad browserkontroll och26 arbets-/regressionstester enligt ovan; inga extra breda matchsimuleringar eller omkörda fullchecks. Befintlig bundlevarning lämnad och ljudlyssning fortsatt uppskjuten.147 Done. Den stora körningen är pausad,148 inte påbörjad. Efter taskvis commit/push lämnas kort överlämning och arbetet stannar.

## Verifieringsinstruktion efter levererad RTS-147

Git var ren;147 Done/b79e3fc pushad och säker taskgräns uppnådd. Senaste checkstyrningen läst och införs i AGENTS/roller: hela unit-testsuiten och en slutlig typecheck/build/diff, relevanta integrationer/browser/simuleringar, full regression vid etappslut och inga omotiverade omkörningar. Nuvarande npm test innehåller breda matchsimuleringar; den skillnaden dokumenterad, inga scripts eller gameplay ändrade. Endast instruktioner/beslutslogg ändras här. Kontroll av textkonsistens, lokala doclänkar och diff; tidigare147-fullchecks återanvänds uttryckligen, ingen ny test-/browserkörning för ren dokumentation.148 inte påbörjad; tidigare paus kvarstår.

## 2026-10-04 – RTS-148: grupperade actions och snabbkommandon (pågående)

Arbetet återupptaget enligt användarens senaste mandat genom150;147/b79e3fc och checkregler/4850670 redan levererade, git ren vid start.148 är UI/input/presentation utan ekonomi-/combatändringar. Gruppera befintliga actions och synka keys/tooltip/help, inventera unit vs sammansatta integrationer och verifiera fokuserat enligt effektivare regler. Efter150 stopp före151.

148 riktade UI22tester/4filer PASS669ms; berörda input/order/controlgroup-integrationer14tester/2filer PASS337ms. Native1280/1920 grupper, samtliga hotkeylabels/tooltip/help, verklig B/Escape-placement, Ctrl/browser-/Home-camera-skydd och blockedResearch PASS utan browsererrors. Första helperkontrollen läste innerText i stängd details och felade; textContent samt explicita assertions i/tmp gav pass utan runtimeändring. Testinventeringen upptäckte även7asset-mjs i tests/, alla inkluderade:75unit+68integration=143filer. Alla assertions bevarade; mixedfiler explicitintegration, full npm test/CI kvar. Slutlig unit/build/diff körs en gång.

148 slutlig unit-suite424tester/75filer PASS6.35s, build inklusive strict typecheck PASS, diff/doclänkar PASS. Review av actiongrupper/kontext/handlers/disabled reasons, unique18keys/fokus/modifiers/camera/browser, dynamiska tooltips/guide och komplett143filers testpartition utan blockerande fynd. Nativebilder granskade i båda upplösningar. Inga ekonomi-/combat-/AI-/navigation-/mål-/tidsregler ändrade och inga breda matchsims körda. Bundlevarning oförändrad, lyssning uppskjuten.148 Done; nästa149 lokala highscores.

## 2026-10-04 – RTS-149: lokala highscores (pågående)

148 levererad6906f4a tillorigin/main.149 lägger score/storage/resultat/meny och Save-identitet, utan ändrad simulation/ekonomi/combat. Score är outcome+gameplaytid; statistik/fraktion/config/speed/difficulty bevaras och grupper separeras. Äldre Saves måste fortsatt kunna spelas men saknar säker highscore-identitet. Riktad paidTutorial räcker för native registrering/Save/replay, fullregression hör150.

149 riktade36tester/5filer PASS580ms och24 UI/operationstester PASS1.58s. Native1280/1920 två verkligt betalda Tutorial-segrar, partial/ended Save/load/reload, båda listvyerna, första resultatets dedup och nytt replay-ID PASS utan browsererrors; bilder granskade. Hjälparen antog först att ended-load stängde highscore-undersidan; endast hjälparen rättad till Back→Highscores. Första unit431/76pass följdes av typecheckfel: toSorted stöds inte av befintlig TS-target. Filterresultatet är en ny array och sort ersätter metoden utan mutation av input; slutchecks upprepas på rättad kod.

149 slutliga checks efter kompatibel sort:431unit/76filer PASS5.60s, build inklusive strict typecheck/diff/doclänkar PASS. Review av scoring/partitioner/metadata, exakt-en-ID/storage/copies/top10/capacity, Save33/migration/scene/replay och safeDOM/nav gav inga blockerande fynd. Nativebilder granskade. Matchsimuleringar ej omkörda för oförändrad gameplay; full regression150.149 Done, nästa150 samlat speltest/release.

## 2026-10-04 – RTS-150: samlat speltest och release (pågående)

149/e22a444 levererad.150 delas i inventering/version/changelog, faktisk native slutetapp, full slutregression och publicering/överlämning. Produkt/package0.2.0, historisk0.1.0 behålls. CI använder buildens strict typecheck och tar bort endast dubbel separat typecheck; full npm test kvar. Ingen gameplay-/balansändring. Faktisk ljudlyssning uppskjuten av användaren, tekniska checks och grafikgranskning ingår. Releasekandidat pushas efter kodchecks;150 kvar In Progress tills faktisk Pages verifierats.

150 native aktuell sammanhängande paidCampaign1–8 PASS både1280×720 och1920×1080 utan admissionfixture, injicerad ekonomi eller browsererrors. TutorialBeginner, övrigaNormal; Save/load/unlock/briefing/resultat/replay och faktisk escort/rescue/30s-capture verifierade.149:s båda score/list/dedup/reload/replayflöden återanvänds för oförändrat scoresystem.150-karthelper rättades först för syntax och dold summary (Settings redan öppen), sedan för avsiktligt osparad navigationscache; persistent units/orders/cargo jämförs exakt, ingen runtimeändring. Slutlig kart-/rendering-/teknisk audiokontroll fortsätter. GitHub148/6906f4a success37196986059;149/e22a444 full npm test fortfarande pågår i CI vid kontroll.

150 slutlig native releasekontroll PASS1280/1920: alla sex renderingstorlekar inom viewport, version/changelog, Humans/Orcs/Elves/Dwarves/Goblins på Highlands/Frontier/Coast/Plains96/Plains128, fysisk selection/move/betald woodleverans, stor kartas minimap-pan, exakt persistent unit/order/cargo-state genom Save/load och ny restartidentitet. Teknisk GameAudio laddar/avkodar11filer, mute och paus/suspend PASS; ingen lyssning. Bilder av samtliga fem fraktioners bas/worker/HUD och kampanjresultat granskade. Befintlig närliggande last-/nodtext kan överlappa, inget blockerande grafikfynd. Full npm test startad en gång på slutlig releasekod; omfattar alla76unit- och69integrationfiler, alltså ingen extra separat unit-/matchkörning.

150 CI paths-ignore omfattar endast Markdown/rollinstruktioner; blandad kod/config/asset/workflow och manuellt workflow_dispatch kör fortfarande full regression/build. Slutlig publiceringsöverlämning ändrar enbart docs och återanvänder verifierad kod; ingen onödig extra fullmatchkörning/publicering för samma kod.

150 slutlig lokal fullregression1142tester/145filer PASS652.08s, enda fullkörningen i150. En build inklusive strict typecheck PASS, diff/doclänkar/release-packageidentitet PASS. Review av release/changelog/package-lock-identitet, oförändrad gameplay/Save33, testinventering/CI paths-ignore och technical-audio-vs-listening-belägg utan blockerande fynd. CI-filterexempel validerade för rootMarkdown/roller kontra kod/package/assets/workflow. Bundlevarning kvar, etikettöverlapp/uppskjuten lyssning redovisade. Releasekandidaten kan pushas för CI-publicering;150 kvar In Progress tills publicerad version/build verifierats. Lokal build innehåller dåvarandeHEAD e22a444, Pages får kandidatens faktiska hash.

## RTS-150 – publicerad0.2.0 och slutlig överlämning

Kandidat53267ef pushad. GitHub run37199039458 completed success för full npm test, build med strict typecheck och Pages-deploy. Faktisk publicerad URL https://tobisen.github.io/warcraft-2-tribute/ visar v0.2.0 och Build53267ef. Native på publik produktion utan kodinstrumentering PASS1280/1920: release/changelog, highscoremeny,8campaignkort, artwork/canvas, fysisk selection/move, Save33/identitet/load/restart. Inga HTTP- eller browsererrors; publika screenshots granskade.

Klart:148/6906f4a commands/keys/testurval,149/e22a444 lokala highscores/Save33 och150/53267ef samlat speltest/release. Hela etappen genom150 Done. Lokala slutchecks: full npm test1142/145 PASS652.08s, build inklusive strict typecheck PASS, diff/doclänkar/packageidentitet PASS. Aktuell paidCampaign1–8 och femfraktions-/storkarts-/sex-resolution-/Save-restart-flöden PASS i1280/1920. Relevanta149-integrationer och native score/dedup/replay återanvänds för oförändrad runtime; inga extra matchsimuleringar under slutlig dokumentation.

Kvar/ej kontrollerat: faktisk ljudlyssning och matchlyssning uppskjutna av användaren. Tekniskt audio11decode/mute/pause och asset/engine-regression verifierade, ingen mixgaranti. Känd bundlevarning och mindre närliggande nod-/lastetikettöverlapp kvar; inga blockerande fynd. Balansbelägg gäller redovisade flöden, inte identisk winrate på alla svårigheter/fraktionspar. Nästa task är RTS-151 i en ny definierad etapp; ingen sådan task är påbörjad här. Stopp före151.

Slutlig docscommit uppdaterar status/överlämning/agenternas etappgräns. Endast Markdown/rollfiler ändras efter verifierad kodpublicering; textkonsistens, lokala länkar och git diff --check kontrolleras. Tidigare kodchecks återanvänds uttryckligen, inga tester för enbart docs. Pages-code/build förblir53267ef eftersom docs-only-push är undantagen enligt150:s verifierade workflow.

## 2026-10-04 – RTS-151: återställd roadmap och kvalitetsinventering

Nytt uppdrag ersätter stopp före151. Ren main/origin git@github.com:tobisen/warcraft-2-tribute.git;
HEAD0d9cf64, publicerad runtime53267ef. Roadmap151–180 återställd från användarens
lista utan att ändra001–150;151–154 detaljerade och senare mål/kriterier planerade.
AGENTS senaste mandat uppdaterat, äldre rolltexter lästa som historik enligt nytt uppdrag.
QUALITY_REVIEW.md skiljer observation/kodfynd/antagande/ej lyssnat och kopplar prioriteringar.
Ny browser1280/1920 med fem fraktioner/stora kartor, selection/move/betald leverans,
minimap/fokus, Save/load/restart, sex upplösningar och11audio-decode/mute/pause.
431unit/76filer PASS5.72s, npm run build inklusive strict typecheck PASS.
Chromium krävde sandboxeskalering för MachPort-start; första startfel följt av lyckad kontroll.
Ingen ny gameplaykod eller bred simulation; RTS-150:s ljudundantag/kända bundlevarning kvar.
Review: scope/historik och källhänvisningar kontrollerade; inga blockerande fynd i docs.

151 browser: första matrisen missade exakt move-endpoint i sista Goblin1920-fallet;
separat omkörning av samma fall passerade med endpoint600/240 och hela flödet.
Det är en intermittent kontroll; ingen runtimeorsak fastställd, ingen kodändring.
Diffkontroll PASS. Roadmap-ID:n151–180 finns exakt en gång; docsreferenser kontrollerade.

## 2026-10-04 – RTS-152: alla byggnader kan inspekteras

151/29b49e7 pushad origin/main. Implementerat gameplayfri inspektionsmodell för
farm-ID/forge och levande enemybyggnader med aktuell vision. Unit-hitprioritet,
resource/shift/drag bevaras; enemy och passiva byggnader kan inte ändra rally/kö.
HP/ring/fokus rensas vid död/fog. Funktion/supply/research/prerequisites och kö
visas för egna; enemy får bara publika data. Save33 oförändrat, nya inspektionsval transient.
31riktade/5filer PASS,32selection/Save-tester PASS(2filer; inputState-filen finns ej),
433unit/76filer PASS6.46s; build inklusive strict typecheck PASS. Browser1280/1920
fixtures med fysiska klick för base/barracks/farm1/farm2/forge/harbor/enemy,
no-orders/fog/död/unit/resource och giltig restart/Save-load. Fixturekontrollen
rättades för fraktionsnamn och full navy/enemyconstruction; dessa var testhelperfel.
Ingen ny betald matchgenomspelning; fixture redovisas separat. Review av diff,
producerhandler-skydd, synlighet, Savekompatibilitet och docs utan blockerande fynd.
Bundlevarningen och faktisk lyssning kvarstår.

## 2026-10-04 – RTS-153: Native Size och Fit to Window

152/b8291ca pushad origin/main. Vald upplösning är fast renderingslayout; CSS
skalas separat. Native(default) cappar1; Fit fyller proportionellt. Båda centrerar
/skalar ned. Fullscreenchange/resize behåller preset/mode, preferences migrerar
äldre adaptflagga. Containerqueries följer logisk menystorlek, pixelated canvas kvar.
435unit/76filer PASS5.91s; build inklusive strict typecheck PASS;10riktade display/
preferences/viewport-tester och18selection/input/minimap/fokus-tester PASS.
Browser48geometrier(six presets × four windows × two modes), fullscreen API båda,
persistens/reload och faktisk selection/move/building/minimap/Home/HUD i800Native,
800Fit vid1920/640 och2048Native nedskalat till1280 PASS utan browsererrors.
Helper rättad: Home-fokus före offcamera baseklick och målkoordinattolerans3worldpx
vid nedskalning(cirka en fysisk pixel; observerat1.36worldpx), ingen runtimefix behövdes.
Screenshots granskade, review geometri/migration/input/CSS och docs utan blockerande fynd.
Ingen full matchsimulation för layouttasken; full regression efter154. Bundlevarning kvar;
headlessfullscreen är API-/layoutbelägg, ingen mänsklig faktisk monitorcheck.

153/71938fb pushad. Slutlig bildgranskning identifierade klippt rubrik på den längre
byggnadsinformationen vid800Native. Komplettering inom153: info max144px/overflowauto,
porträtt64px och actionbredd320px vid logisk bredd≤900. Omkörning motiverad av faktisk
CSS-ändring:435unit PASS5.54s, build/strict typecheck PASS och samma48geometrier/
fullscreens/input/minimap/HUD/reload-flöden PASS. Uppdaterad bild granskad: rubrik,
funktion/HP synliga, längre stats rullbara. Diffkontroll PASS, ingen gameplayändring.

## 2026-10-04 – RTS-154: Iron & Timber (slutregression pågår)

153/58bf3fe pushad. Index/browser title visar Iron & Timber — A Tribute to Warcraft II;
egen typografisk järn/trä-identitet och I/T-monogram i befintlig meny. Inga repo,
remote, package/storagekeys/Pages eller gameplayändringar. Arbetstitel utan juridisk granskning.
Fyra devbrowserlayouter(800Native/Fit1920,1280Native1280,2048Fit640) PASS:
titel/undertitel, alla sex menylänkar, åtta campaignkort, start/pause/quit utan browsererrors.
Två byggda subpath-previewlayouter800Native1920/800Fit1280 PASS samma flöden;
produktionsassets och titeln är kontrollerade. Native800-menyns footer kan kräva
scroll, alla menylänkar är åtkomliga. Screenshots granskade.
6riktade meny/text/release-tester PASS. Initial435unit PASS7.03s, build inklusive
strict typecheck PASS. Review av ändrade testfiler klassificerade resourceSelection
som integration eftersom filen nu kombinerar MatchState/fog/inspektion/actionPanel;
manifestkorrigering utan raderade assertions. Slutligt uniturval428tester/75filer
PASS8.55s; fullregressionsurvalet oförändrat(alla filer) och redan pågående körning
behöver inte startas om. npm test full regression återstår före Done/commit.
Markdownreferenser/diffkontroll PASS. Review av titel, menyåteranvändning, remote/
storageidentitet och docs utan blockerande fynd. Lokal preview behövde sandbox-
eskalering för lyssningsport. gh CLI saknas; ingen ny CI-/Pages-status påstås verifierad.

154 slutlig full regression: npm test1146tester/145filer PASS499.66s inklusive alla
integrationer och matchsimuleringar. Slutligt uniturval428/75 PASS8.55s, npm run
build(strict typecheck inkluderad) PASS. Diff/Markdownreferenser/testmanifest PASS.
Runtime/css/index oförändrade sedan dessa checks; efterföljande status-/överlämningstext
är dokumentation.154 Done,151–154-etappen avslutad; stanna före155. HANDOFF.md anger
nästa task, commits151–153, nya/återanvända belägg och begränsningar. Ingen senarefeature,
ny releaseversion eller verifierad ny CI-/Pages-publicering påstås. Sista taskcommit/push
följer enligt nytt uppdrag; faktisk hash och pushresultat rapporteras till användaren.

## 2026-10-04 – Bugfix: HUD-layout – bottom bar horisontell layout och kompakt build-menu

CSS-baserad layout-fix utan gameplay-ändringar. Bottom bar konverterad från flex-rad till
3-kolumn grid (portrait | selection-info | actions). Action-grid utökat från 3 till 4
kolumner för kompaktare ikonlayout. Gruppöverskrifter dolda för att spara plats. Responsiva
justeringar för mindre viewports: 3 kolumner vid 800×600.

Ändringar:
- `src/style.css`: `#bottom-bar` display:grid med grid-template-columns:128px auto 1fr;
  `#selection-portrait/info/action-panel` explicit grid-positioning; `#action-panel
  #gameplay-controls` repeat(4,minmax(0,1fr)); `#action-panel [data-action-group] h3`
  display:none; containerquery för 900px max-width med 64px-portrait, 3-kolumn-grid.

Verifiering:
- `npm run typecheck` PASS.
- `npm run build` PASS (strict typecheck inkluderad).
- `npm test` 1146/1146 tester PASS (145 filer) – alla integrationer och matchsimuleringar.
- `git diff --check` PASS.
- Ingen beröring av BootScene HUD-event-guards eller display-modes.
- Layout-test manuell: panelerna sitter horisontellt, alla byggalternativ synliga vid
  testad viewports (800×600, 1280×720, 1920×1080), hover/disabled-states fungerar.

BACKLOG.md och denna logg uppdaterad. Ingen ny RTS-ID eller gameplay-ändringar.


## 2026-10-04 – UI-BUGFIX-BOTTOM-BAR

- Separat UI-bugfix enligt användarens mandat, utan ändrade RTS-ID:n eller
  gameplayregler. Branch main, befintlig origin kontrollerad. Otrackade docs/
  fanns före arbetet och lämnas orörda/utanför commit.
- Undersökte HUD-bindningen och faktisk browser-DOM. Ursprungsworker vid800×600:
  Build var display:flex/flex-direction:column med289px höjd; actionpanelen
  scrollHeight323/clientHeight150. Kön var ett barn på egen rad i fieldset;
  selection hade auto-kolumn och långa beskrivningar. Ursprungsbild:
  /tmp/w2t-bottom-bar/before-worker.png.
- Reparentade befintliga kontroller med samma handlers: selection/portrait,
  Orders, gemensam Build/Train/Research-yta, kö och minimap får explicita
  kolumner på samma rad. Ingen flex-wrap på huvudraden. CSS Grid/min-width:0,
  160px totalhöjd,32px befintliga atlasikoner i40px knappar. Disabled,
  hover/fokus och markerat placeringsläge behålls, även när knappen spärras.
  Köikoner/progress/status ryms; namn/kostnad/hotkey/spärr och längre
  selectiondata nås via tooltips/tillgängliga knappetiketter.
- Ny browserregression: scripts/check-bottom-bar.mjs, körd med extern
  W2T_PLAYWRIGHT_MODULE/W2T_BROWSER_EXECUTABLE.12 layoutfall PASS:
  tre Native-upplösningar800×600/1280×720/1920×1080 samt800×600 Fit på1920×1080,
  vardera worker med alla fyra finansierade byggval, bas med research/full kö,
  och aktiv research/full kö. Screenshots och metrics.json i
  /tmp/w2t-bottom-bar. Visuell granskning av båda selectiontyperna vid samtliga
  tre Native-storlekar samt Fit; inga klippta/överlappande kontroller.
  scrollWidth≤clientWidth och scrollHeight≤clientHeight (+1px avrundning),
  samma y-position och disjunkta panelrektanglar verifierade. Vid800×600
  får spelvärlden392px höjd efter48px top bar och160px bottom bar.
- Browserinput PASS: build farm via fysisk knapp, selected-state, Escape,
  bevarad worker-selection, full kö via tre produktionsklick, researchstart,
  disabled forskningsalternativ och fysisk köavbrytning. Tooltipkostnad/hotkey
  och hover kontrollerade; inga pageerrors. Hoverkontrollen justerades till att
  invänta100ms CSS-transition. En tillfällig originalmodul-interception fungerade
  inte; grundorsaken verifierades därefter med separat Vite-server som läste HEAD.
- Checks på slutlig kod: npm test -- src/gameplay/buildingSelection.test.ts
  src/presentation/actionPanel.test.ts src/presentation/selectionCollection.test.ts
  src/presentation/selectionInfo.test.ts src/presentation/hud.test.ts
  src/presentation/hotkeys.test.ts:36 tests/6 filer PASS. npm run test:unit:
  428 tests/75 filer PASS. npm run build (inkluderar strict typecheck):PASS,
  endast befintlig bundle-storleksvarning. git diff --check:PASS.
  Slutchecks upprepades efter sista CSS-ändringen för kompakta knappar/selected
  och bibehållen sidopanel för missions-/commandfeedback.
- Diff granskad mot scope, DOM/inputägarskap och acceptance criteria; inga
  blockerande fynd. Dokumentlänkar kontrollerade. Inga campaign-simuleringar
  eller ny CI-/Pages-kontroll. Historiska releasebelägg återanvänds inte som
  verifiering av denna fix. Commit/push enligt uppdraget; stanna därefter.


## 2026-10-04 – RTS-155: Human-korrigering och faktisk visuell granskning

- Nytt avgränsat mandat: korrigera/granska155, pausa senare tasks. main/origin
  kontrollerade. Endast docs/ var otrackad före arbetet; Human/buildingreferenserna
  i docs/art lästes, SHA-256 dokumenterades och filerna lämnas orörda/otrackade.
  Bottom bar-commit879c1e6 är separat och dess CSS/DOM/actionbindning ändras inte.
- Den bifogade skärmbilden visar enkla gamla assets. Tidigare Current Focus Done
  motsade155 Todo och saknade designbelägg. Tasken återöppnas In Progress;
  användarens bedömning av det nya resultatet återstår.
- Faktisk orsak:32px generisk worker/soldier med små rektangulära övermålningar,
  base fortfarande generisk tvåtornskomposition. Godkända lokala referenser visar
  andra, tydligare kläder/silhuetter/material/heraldik. Audit mot HEAD879c1e6
  visar noll source/exportmismatchar före korrigeringen; rätt typer/frames,
  atlasrektanglar/ankare/skala och nearest-neighbor-rendering var korrekta.
- Egen humans.mjs:64px worker med ljus skjorta/byxor, blå väst, hår/skägg/pung och
  tvåhandsverktyg; soldier med stål, plym, blå tabard och guldkantad sköld/svärd.
  Åtta riktningar, fyra walk/attack/death och worker gather/build; egna fallposer,
  ingen illustration/crop eller nedskalad idlebild som animation.128px base med
  flera torn/tak, masonry/timber/portal/trappor/torch/fanor samt bygg/damagedbilder.
  Paletten utökas med materialnyanser. Source/PNG/metadata/manifest exporteras ihop.
- Rendering: högre Human-silhuetter krävde HP48/cargo68 ovanför world-center.
  Övriga fraktioners offsets, bodies, footprint/ranges/navigation/selection och
  gameplay är bevarade. Atlasjämförelsen visar544 ändrade Human-unit- och8 baseframes,
  noll ändrade andra frames och alla stabila ID:n bevarade. Ingen stale atlas eller
  cache/mappingförklaring används för det tidigare designproblemet.
- Browser i Chromium: samma Arena-fixture, kamera(120,180), worker(340,300),
  soldier(440,300), base(400,450), Native800×600 och1280×720 före/efter. Fysiska
  klick verifierar Worker/Guard/Keep selection. Movement genom faktisk update;
  drawScale1/atlasrektanglar/origin/pixelated och portraitSmoothing=false PASS.
  Gather/build/attack/death-poser väljs explicit ur laddade Phaser-frames och
  verifieras vid screenshot; inte påstådd betald gameplay/deathregression.
  Contact sheets visar alla åtta riktningar och animationsframes/base-stadier.
  Före-bilder använder879c1e6:s atlaser och gamla labeloffsets via temporär routing.
- Browserfixturen korrigerades under granskning: borttagna gamla units gav
  transient dödsgrafik/HP-varning; fixture använder stabila unit-ID:n och nollställer
  endast denna verifieringsstate. Phaser sys.sceneUpdate fryses mellan bilder;
  en extra HUD-sync efter movement återställde idlepose och togs bort för att
  fånga faktiskt walk-frame. Slutliga före/efterkörningar PASS utan pageerrors.
  Inga debughookar/fixtureändringar skickas i appen.
- Visuell granskning: worker/porträtt, soldier/porträtt, tillsammans, base,
  movement och alla pose-/contact-sheetbilder i båda upplösningarna. HP/cargo är
  ovanför silhuetten, inga klippta transparenta framekanter, tydligt olika typer
  mot gräs. Källor/atlas/browser hålls skilda i protokollet; mer detaljerade bilder
  ersätter tidigare enkla figurer. Referensillustrationen har fortsatt fler
  mikrodetaljer än64px-adaptionen; ingen slutlig användarapproval hävdas.
- Evidens incheckad i artifacts/rts-155, index.html jämför exakt samma spelvy.
  source-export-audit.json och before-/after-rendering.json redovisar mätningar.
  Reproducerbara scripts/check-human-art.mjs och audit-human-art.mjs med
  extern Playwright/Chromium respektive repoegna källor/git-baseline.
- Arbetscheck17 riktade asset/animation-tester i5filer PASS före sista overlay/
  gångstegsändringarna. Slutlig npm run test:unit431tests/76filer PASS; npm run
  build inklusive strict typecheck PASS; git diff --check PASS. Sista unit/build
  kördes efter slutlig ryggvy/stridejustering; tidigare PASS återanvänds inte som
  slutbelägg. Befintlig bundlevarning kvar. Inga campaign-/matchsimuleringar.
- Diff/scope/inputägarskap/source-export/footprints granskade utan blockerande
  tekniska fynd. Dokumentlänkar och referenshashar kontrollerade. BACKLOG/README/
  DECISIONS/protokoll uppdaterade. Human-slicen implementerad och visuellt granskad;
 155 hålls In Progress för användarens bedömning, övriga artgrupper ej uppdaterade.
  Ingen ny CI-/Pages-verifiering eller fysisk monitorgranskning. Commit/push enligt
  mandatet, stanna därefter;156+ startas inte.

## 2026-10-04 – RTS-155: accepterad Human-slice och nya referenser

- Användaren accepterar Human-korrigeringen som tillräckligt bra för tillfället. Tidigare anteckning om väntande användarbedömning är därmed ersatt.
- Åtta nya lokala bilder granskade: enhets-/byggnadspar för Orcs, Elves, Dwarves och teknikerfraktionen. Exakta filnamn/hashar och visuella kännetecken registrerade i [referenskatalogen](assets/sources/faction-references.md). Originalfiler och andra ändringar bevarade.
- Teknikerbilderna visar vita skägg/goggles, vilket behöver kopplas uttryckligen till befintliga Goblins eller Gnomes. Frågan är ställd; ingen ny fraktion eller gameplayändring antas. Sjöunderlag saknas i bildgruppen.
- Ren inventering/statusuppdatering: ingen källgrafik, atlas eller runtime-kod ändrad. Ingen ny browser-, unit-, typecheck- eller buildverifiering körd; historiska Human-checks ovan gäller endast föregående leverans. Nya fraktionsassets är inte färdiga eller visuellt verifierade. RTS-155 In Progress,156+ ej startade.

## 2026-10-04 – RTS-155: fyra worker/melee/base-slices från nya bilder

- Användaren bekräftade uttryckligen teknikerreferensen för Goblins och att namnen behålls. Orcs/Elves/Dwarves/Goblins får egna pixelkompositioner för worker, melee och huvudbyggnad. Ingen ny fraktion, typ eller gameplayfunktion; namn/config/stats/selection/input/footprints och separat bottom bar-fix bevaras. Referensoriginalen i otrackade docs/ ändras inte eller tas med i commit.
- Egna64px figurer med fraktionsspecifika kroppar/huvuden, skägg/hår/goggles, yxa/hacka/skiftnyckel/svärd/sköld, materialskuggor, blue/red ägarfält, åtta riktningar och befintliga actionposer.128px huvudbyggnader har betar/röda timmertak, levande träd/gröna tak, tung sten/koppar/blå tak eller turkos/mässing/dome/kugghjul. Foundation/building/complete/damaged och footprints48/96 bevaras. Human-materialpenslar återanvänds utan att ändra Human-rastren; andra roller/byggnader/naval är oförändrade.
- Grundproblemet är äldre källgrafik, inte fel sprite-ID/atlasexport. audit-faction-art.mjs jämför källor från c5b3c71 och nya källor mot exporter:2176 ändrade unitframes och32 baseframes, noll source/exportmismatchar före/efter, noll orelaterade rasterändringar; frame-ID:n bevarade. HP/cargo48/68 håller labels över nya silhuetter; assettest kontrollerar även HP-avstånd i alla levande poser.
- Browser före/efter i samma arena/kamera/fixture, fyra fraktioner vid Native800×600 och1280×720: fysisk selection av worker/melee/base, porträtt utan smoothing, tillsammans idle, verklig movement/walk, explicit gather/build/attack/death-poser, kontaktblad med båda lag och base-stadier. Slutlig körning PASS utan pageerrors och screenshots visuellt granskade. Galleriet kontrollerat i Chromium. [Före/efter](artifacts/rts-155/factions/index.html), PNG/JSON i fraktionsmapparna och [protokoll](assets/sources/faction-references.md). Lokal Vite-server på5179.
- Under arbetet upptäcktes klippning i en höjd attackpose och förbättrades sidoprofil/rustningskontinuitet vid död. Slutlig export och unit/build kördes efter dessa assetändringar. En separat screenshotfixture använde inledningsvis Human HP60 för alla soldater; rätt maxHP hämtas nu från befintlig fraktionsconfig. Före/efter-browserkontrollen upprepades för korrekta slutbilder, utan ändring i spelkod. Inga tester likställs med estetiskt godkännande från användaren.
- Riktade13/4 asset/animation-checks PASS under första passet;9/3 asset/readability/building-checks PASS efter team-/attackjustering. Slutlig npm run test:unit433/77 PASS och npm run build inklusive strict typecheck PASS en gång efter sista runtime/assetändringen. Dokument/screenshotfixture ändrades därefter; dessa tekniska belägg återanvänds med oförändrad runtime/export. Slutlig git diff --check och Markdown-länkkontroll PASS. Befintlig bundlevarning kvar. Inga campaign-/matchsimuleringar eller nya CI/Pages-checks.
- RTS-155 kvarstår In Progress för ranged/specialist/siege, övriga byggnader och sjöassets (sjöreferenser saknas). De fyra beställda referensslices är implementerade och visuellt granskade; slutlig användarbedömning av deras utseende är inte förutsatt. Docs/backlog/decision/provenance uppdaterade före separat commit/push. RTS-156+ startas inte.

## 2026-10-04 – RTS-155: hela landreferensgruppen färdig

- Senaste mandat: använd alla motiv i samtliga rasers referenser, behåll namn, commit/push. Ranged/specialist/siege och barracks/farm/forge är adapterade för fem raser. Separat ranged-byggnads motiv finns i barracks ranged-del. Ingen ny gameplaytyp; Elf-specialistens båge och Goblin Grenadiers granatattack behålls med referensens kläder/rustning. Sjömotiv saknas och sjöassets är oförändrade. Användarens otrackade docs/ bevaras utanför commit.
- Grundorsak var äldre enkla källkompositioner. Nya egna64px unitbilder och64/128px byggnader, åtta riktningar, befintliga action-/byggnadsstadier, lagfärg och silhuettanpassade HP/cargo. Atlas-ID:n, logiska footprints, selection/input och bottom bar bevaras. Audit3120 unitframes/120 buildingframes: noll source/exportmismatchar och noll orelaterade rasterändringar; tidigare worker/melee/base och naval bevarade.
- Faktisk Chromium/Phaser före/efter för fem raser i samma arena/kamera vid Native800×600 och1280×720 PASS utan pageerrors: roster, fysisk selection/porträtt, verklig movement/walk, explicit attack/death-poser och kontaktblad för alla riktningar/lag/byggnadsstadier. Slutbilder visuellt granskade. [Galleri](artifacts/rts-155/complete/index.html), PNG/JSON och [protokoll](assets/sources/complete-references.md). Tester betyder inte slutlig användarapproval av utseendet.
- Under arbetet korrigerades täckt Orc-lagfärg, katapultsten vid framekant och siege-besättningens huvudbonader/Goblin-specialistens röda mössa. Assettestets onödigt många individuella assertions samlades utan minskad täckning efter timeout. Slutlig export/audit/unit/build kördes efter sista runtime/assetändringen. Browserfixture/kontaktbladstext och docs ändrades därefter; runtime/export är oförändrade.
- Slutlig npm run test:unit435tester/78filer PASS; npm run build inklusive strict typecheck PASS; git diff --check och dokumentlänkkontroll PASS. Befintlig bundlevarning kvar. Inga campaign-/matchsimuleringar, nya CI-/Pages-checks eller fysisk monitorgranskning. RTS-155 Done enligt senaste landreferensmandatet;156+ startas inte. Commit/push utan force enligt uppdrag.

## 2026-10-04 – RTS-156 kartgrafik och RTS-155-avstämning

- Nytt mandat156–159 registrerat; användarens otrackade docs/ bevaras.155 Human och alla landreferenser redan visuellt granskade/typecheckade i0b0e338; beläggen återanvänds uttryckligen, inget nytt155-assetpass. Återstående sjöfart saknar stilunderlag och redovisas separat i assets/sources/remaining-sprites.md.
- Originalpalett, förbättrat gräs/vatten/kust, jordspår, blommor/ormbunkar och blockerad skogsgrafik;30 worldframes i256×256. Spår/dekor bara på grass, skog bara på befintliga Forest Pass rockceller. Navigation, byggplatser/resurser/fog/input bevaras. Ingen ny kartreferens tillförd; befintlig stil/palett används och arena är granskningskarta.
- Arena granskad före övriga kartor. Faktisk Chromium18 native-vyer (nio kartor ×800/1280) PASS utan pageerrors, slutbilder visuellt granskade med fokus arena/forest/islands/frontier. Explicit revealed-map-fixture; inga runtime debughookar. Första fixturen tog bild innan restart klart; väntan korrigerades och bilder ersattes. Före-arena använder0b0e338:s atlas, samma kamera.
- Riktade19tester/2filer PASS. Slutlig unit436/78 PASS och build inklusive strict typecheck PASS, befintlig bundlevarning. git diff --check PASS. Ingen ny campaign-/matchsimulering eller CI/Pages. Commit/push taskvis;157 härnäst.

## 2026-10-04 – RTS-157 teknisk attackljudsdel; lyssning återstår

- Fyra nya egna synteseffekter och befintliga kanon/träffljud, WAV-masters/OGG-fallback med provenance. Oförändrade elva äldre exporter bevaras. combatAudio återanvänder synliga snapshots/projectiles/cooldown/HP, separat byggnadsträff, avståndsgain256–1400 och familjcoalescing/maxkällor/cooldown. Inga gameplayregler ändrade.
- Riktade7/3 engine/policy/assets och7/2 snapshot/policy PASS; slutlig unit439/79 och build/strict typecheck PASS en gång på slutlig runtime. git diff --check PASS. Actual Chromium-stridsfixture15 mot12 plus base och navy:180 accepterade cues med samtliga sex attack/skadefamiljer,15 dekodade filer, offline-mixpeak0.352. Screenshot och lyssningsklipp i artifacts/rts-157.
- Inledande fixture tog bort enemybase och gav omedelbar victory; separat dynamic import skapade fel audioinstans vid Vite timestamp. Fixturen korrigerades att behålla base och instrumentera appens faktiska singleton. Omkörning PASS; runtime ändrades inte efter slutliga unit/build. Ingen broad campaign/matchsimulation.
- Faktisk lyssning är inte utförd: agenten har ingen hörselåtkomst. Användaren har fått lokal länk och lyssningsfråga.157 In Progress, tekniskt verifierad del committas/pushas tydligt separat; oberoende158/159 fortsätter. Ingen CI/Pages verifierad.

## 2026-10-04 – RTS-158 dialogdel verifierad; inspelningar saknas

-380 egna engelska repliker för fem rasers sju roller och fem aktiviteter, specialistroll/raspersonlighet, actionrouting och tredje selectionklicket som repeat. Historik per faction/role/action, befintlig cooldown/ingen kö/local English/separat röstvolym/mute/pause/reset. Inga inspelningar skapas eller hävdas.380 recording/license-null i exakt manus i assets/sources/voice-recording-script.json; saknade filer/metadata blockerar inspelad del och Done.
- Riktade8/2 före kompletterande tester PASS; ny repeat-test förväntade fel andra replik trots första repeatvariant, assertion korrigerad. Slutlig unit441/79 och build/strict typecheck PASS; browser fysisk canvas-routing select/repeat/move/work/attack PASS med uttalad speech-testadapter. Diffcheck PASS; inga campaign-simuleringar eller röstlyssning. Scriptet exporterar manus från faktisk config; testadapter skeppas inte i appen.
-158 In Progress med verifierad kod/textdel; oberoende159 fortsätter enligt mandat. Ingen slutlig röstdel, inga nya CI/Pages-belägg.

## 2026-10-04 – RTS-159 levande värld och stopp efter159

- Egna original32px hjort/kanin/räv, två idle/fyra walkposer, stock/svamp/gräs-/vass.51 worldframes256×384, tidigare sprites/buildings/naval bevarade. Inga externa referensbilder importerade. Upp till48 deterministiska habitats, lokalt wander, inget gameplay/HP/collision/occupancy/selection/jakt/ekonomi/minimap/fogobserver. Synliga sprites filtreras mot aktuella obstacles och playerfog.
- Befintlig sparad waves.elapsedSeconds bestämmer exakt pose; Saveversion oförändrad. Pause tyst/frozen, restart nollställer, scene-create rensar visuella maps. Granskningen korrigerade habitat-/propsgeneration att använda statisk terräng även efter Load; byggnadskartan får bara dölja. Sista diffreview fann fel worldmanifestwidth vid height-replacement; width256 återställd och PNG/metadata-invariant tillagd. Unit/build upprepades därför efter konkreta ändringar; inga tidigare PASS används som slutcheck för ändrad kod.
- Riktade10/3 PASS. Slutlig unit444/80 och build inklusive strict typecheck PASS efter sista metadatafix. Integration38/3 Save/visibility/wildlifeSave PASS och resourceSelection7/1 PASS; ett första kommandourval hade fel sökväg för resourceSelection, den riktiga filen kördes separat. wildlifeSave klassificeras i integrationsmanifestet; --list validerar disjunkta urval. Inga breda campaign-/matchsimuleringar eller full npm test enligt uttrycklig grafik/ljudavgränsning.
- Faktisk Chromium800Native/1280Native PASS: normala fog-vyer och separata revealed-vyer, idle/wander, fysisk worker/animal-klickselection, oförändrad vision/roster/obstacles, fysisk Save/Load exakt tid/pose och paused update, restart utan duplicering och byggnadstäckning. Kontaktblad/spelbilder visuellt granskade. Metadatafix ändrade inte raster/runtimepose, så denna senaste browserkontroll återanvänds uttryckligen. Artifacts/rts-159 och sources/wildlife-159.md dokumenterar. Slutlig diff-/länkkontroll PASS.
-159 Done och156 Done.157 attackljud tekniskt klart men faktisk lyssning saknas;158380 repliker/routing tekniskt klara men380 inspelnings-/licensposter saknas. Inga falska röst-/spritefärdigmarkeringar. HANDOFF uppdateras med klart/kvar/blockerat, taskcommits och lokala verifieringsbelägg. Ingen ny CI/Pages eller fysisk monitor-/ljudgranskning. Stoppa efter159;160+ inte startade. Användarens docs/ bevaras utanför commit.

## RTS-160 – huvudbyggnad i tre nivåer

Implementerat kostnader80/60→120/100, tider20→30s, köpaus/exakt återupptagning, guarded I-action, nivåporträtt och80 nya atlasframes från befintliga godkända fraktionsdelar. Save config34 med strikt nivå/tidsvalidering och33-migration. RTS-159s Done matchar implementationen. User-CSS/orelaterade docs bevarade.

Riktade40 tester PASS. Browser native800×600/1280×720: start, pausad kö, fysisk save/load bevarar nivå/kö/selection, nivå2/3 och maxnivåknapp; screenshots granskade i artifacts/rts-160 och browser.json. Inga kampanjsimuleringar. Ingen separat godkänd nivå2/3-referens, CI/Pages ej granskade. Slutlig unit/build/diff nedan.

Slutchecks: första unitkörningen upptäckte tre föråldrade assertions för config33; ändrade dem till34 och körde om unit/build på slutlig kod. Riktade40 PASS, slutlig unit444/80 PASS, build med strict typecheck PASS, diffcheck PASS. Ingen full campaign-regression i160.

## RTS-161 – gemensamt tech tree

Återanvänder fraktionsdefinitionerna och unitAvailability. Building/upgrade-definitioner anger prerequisites; samma evaluator används i placement, research, actions och tech tree. Nivåkrav stöds för senare försvarsuppgraderingar utan att hitta på nya lås för dagens roster. Byggnadsnamn och saknade requirements visas; accepterade köjobb behåller sina recipes efter kravförlust. RTS-160 commit/push7d7290c.

Riktade20 tester PASS. Browser native800/1280: tech tree, research-tooltip Complete Forge, upplåsning av färdig Forge, fysisk forskningsstart och spärr under pågående jobb; screenshots granskade i artifacts/rts-161. Ingen ny grafik eller kampanjsimulering. Slutlig unit/build/diff redovisas efter finalkontroll.

Slutlig unit445/80 PASS, build inklusive strict typecheck PASS. Diffcheck hittade en blankrad med whitespace i index.html; rättad och diffcheck PASS. Därefter endast docs/whitespace ändrade, kodchecks återanvänds. Ingen full campaign-regression.

## RTS-162 – byggbara försvarstorn

Återanvänder placement-route/spawnkontroller, worker-konstruktion, playerTargets/AI, fog, befintliga projektiler och stridsskador.50/20,8s,160HP;176px/10damage/1.2s. Tier2 kräver bas2/Forge,40/30 och10s,208px/16damage. Armerat på aktuell nivå under upgrade. Skott lämnar egen footprint men stoppas av andra hinder, fast aim kan missa rörligt mål. Nybyggen skjuter först efter faktisk färdigtid; uppgraderingsskada/räckvidd börjar efter färdigtid. Destruction tar bort kolliderande footprint/konstruktionsreferenser. Minimap, vision, stats och befintliga bow-cues återanvänds. Strikt Save35/34-migration.

58 riktade tester PASS (torn, construction, AI-defense, save, UI, atlas, combatAudio). Browser native800/1280: fysisk workerselection/build/placering, konstruktion, tornselection/spärr, uppgradering och save, synlig projektil/impact; screenshots granskade artifacts/rts-162. Browser upptäckte återaktiveringsfel för ny knapp; rättat/verifierat. Separat godkänd tornreferens saknas; originalpixeldelar från godkända huvudbyggnaden används, inga illustrativa cropframes. Actual audio-listening/CI/Pages ej utfört. Ingen bred campaign-regression i162; slutchecks nedan.

Slutlig unit445/80 PASS, build inklusive strict typecheck PASS, git diff --check PASS. Befintlig src/style.css är byte-identisk med starten; otrackade docs bevarade. RTS-161 commit/push b7439ae.

## RTS-163 – murar och ägarstyrda portar

Murar10wood/180HP/3s, portar30wood+5gold/240HP/5s. Återanvänder fortifications/worker-konstruktion/AI-targeting/destruction. X-toggle och ikon, öppen/stängd värld och porträtt. Öppen fysisk passage reserveras för player-laget via härledd enemy-navigation, inklusive enemy-workers/construction/scouting/naval landning/production och separation. Placement skyddar allas nödvändiga connectivity samt spawn/delivery; close över enhet eller routes spärras. Saves36 migrerar35 och återskapar cache från gate-state, validerar grid/type/cost-relevant HP/construction/owner/counter.90 nya pixelatlasframes från approved building parts; ingen separat godkänd mur/portreferens.

Riktade81 tests/9files PASS (gate/tower, enemy naval/construction/gathering, separation, Save, UI, atlas). Browser native800/1280: fysisk workerplacering av gate/wall, konstruktion/selection, open, fysisk move genom egen gate, spärrad close medan worker passerar, close efter passage och faktisk lokal save. Screenshots granskade i artifacts/rts-163, browser.json. Extra slutlig browserkörning för korrigerat öppet porträtt/spawn-skydd. Ingen bred campaign-simulering i163, ingen CI/Pages. RTS-162 commit/push4658a0d. Slutchecks nedan.

Första slutliga unitkörningen upptäckte ett gammalt hotkey-test som antog X var oanvänd; X är nu gate-toggle. Testet kontrollerar i stället P (som fortsatt hanteras av pause-flödet, inte action-hotkeys). Slutchecks körs om på slutlig kod.

Slutlig unit445/80 PASS, build inklusive strict typecheck PASS, git diff --check PASS. Slutlig browser800/1280 PASS. User-CSS fortsatt byte-identisk. Ingen ny full regression ännu; planeras en gång vid etappslut eftersom164 påverkar strid/ekonomi/navigation.

## RTS-164 – reparation och försvarsbalans

Betald4HP/s-reparation, max tre workers per byggnad, exakt gångtidsremainder och endast faktiskt HP debiteras. Navigation, cargo, selection, orders/Stop, pause, cleanup och fysisk Save/Load återanvänds. Z/Repair/högerklick och befintlig build-animation. Save37 med36-migration och strikt egen byggnadsreferens/projektilbonus. Tier2-torn192px och siege1.5× mot endast fortifications; inga breda roster-/kampanjstats ändras. RTS-163 commit/push efbdd7d.

Riktade77tester/8filer PASS. Första testfixturen ställde workers i basens footprint; korrigerad att stå utanför, utan ändrade navigationsregler. Elf-siege behövde längre counter-test eftersom tre repairers överlever liten splash; testbudgeten80s täcker den faktiska profilen. Fem rasers counters, flera workers, samtliga egna byggnadstyper, otillräcklig bank, full HP, avbrott, död och Save validerade.

Faktisk Chromium800Native/1280Native: fysisk selection/Repair/building-click, build-animation, kostnadsdelta, fysisk Stop, lokal Save/Load återupptagen order, full HP och idle samt faktisk siege-strid. Kontrollerad stridsfixture använder befintlig outpost för fiendens vision och vanliga fog-/projektilregler, ingen skeppad debug-API. Screenshots i artifacts/rts-164 visuellt granskade; noll pageerrors. Ingen ny grafik eller separat assetreferens hävdas. Ingen faktisk ljudlyssning, ny CI/Pages eller mänsklig helmatchbalans. Unit/full regression/build körs en gång vid denna etappgräns eftersom160–164 ändrar ekonomi, AI, navigation och strid. Slutresultat nedan.

Första fulla regressionen:1191/1193 PASS, två tidsgränsfel i frontier/highlands (5s respektive30s); inga misslyckade beteendeassertions rapporterades. Första builden hittade ett strikt uniontypfel i siege-testfixturen; worker-ordern görs nu bara på worker-grenen. Regressionen blottade dessutom onödig extra BFS i RTS-163:s AI-byggkontroll: ordinary placement kontrollerar redan nåbarhet. Den separata enemy-vyn kontrolleras nu bara när öppna portar faktiskt finns. Inga tidsgränser höjdes och inga gameplayassertions försvagades.

Riktad omkontroll46tester/5filer (repair/gates/enemyConstruction/frontier/highlands) PASS på54.76s. Build inklusive strict typecheck PASS på korrigerad slutlig kod; återanvänds utan ytterligare kodändringar. Browsercheck-gates och check-repair återkörda800/1280 PASS, deterministiska portbilder oförändrade. Slutlig unit445/80 PASS. Full regression körs därför om efter den konkreta korrigeringen; slutresultat kompletteras nedan.

Slutlig full regression1193/155 PASS på korrigerad slutlig kod; unit445/80 PASS. Build med strict typecheck efter fixture-/AI-korrigeringen PASS, inga ytterligare kodändringar därefter. Full regression upprepades endast efter upptäckta fel och ändrad kod. HANDOFF/BACKLOG uppdaterade:160–164 Done, stopp före165. git diff --check och lokala Markdownlänkar PASS; befintlig CSS och användarens otrackade docs bevarade. Ingen ny CI/Pages-verifiering.

## RTS-165 – specialistmana och verifierad avstämning160–164

160–164 Done och pushade7d7290c/b7439ae/4658a0d/efbdd7d/874f761; tidigare full1193/155 och browserbelägg inventerade, inga återimplementationer. Nytt bifogat mandat beskriver165–173 men uttryckligt etappstopp efter169 följs. CSS/orelaterade docs bevaras.

Kompletterar fem befintliga specialister enligt uttalat arbetsantagande efter designfråga till användaren; inga nya namn/stats/sprites. Mana i fraktionsdefinitioner och Soldiers/Enemy, verklig initialmana vid produktion, spel-tidsregen inkl transports, HP-rad i HUD, strikt Save38/37-migration. Nya mage-/cast-/luftreferenser saknas; konkret inventory assets/sources/magic-165.md. Spells hör till166/167.

Riktade52/4 och fraktions18/4 PASS. Första mana-Save-fixturen hade fel nextUnitNumber; rättad, inga Save-regler försvagade. Ett första riktat urval nämnde två obefintliga rosterfilnamn; verkliga factionProduction/factionSave/factionProfiles/config-factions kördes separat. Tidig typecheck hittade unknown-index i nya enemy-mana-validatorn; typad FactionId rättad. Slutlig unit445/80 och build inklusive strict typecheck PASS. Browsernative800/1280 samtliga fem raser: locked/unlocked specialist, fysisk betald träning/selection, initial/HUD/regen/pause, lokal Save/Load exakt mana och max. Browserfixturens manuella barracksOwner rättades efter strikt Save-fel. Visuell review fann för nära fixture-worker; separat casterplacering och fysisk selection kontrolleras i slutlig körning. Ingen broad campaign-regression i165; full regression vid169 enligt etappgräns. Ingen ny CI/Pages eller ljudlyssning.

Slutlig browser165 fem raser ×800/1280 PASS, tio screenshots och rapport i artifacts/rts-165. Alla fem slutliga native800-bilder och större Elf-vy visuellt granskade; ingen mana-klippning eller panelhöjdsändring. Fysisk selection i den sista fixturekorrigeringen PASS. Endast browserharness och docs ändrades efter slutliga unit/build; dessa kodchecks återanvänds uttryckligen. Diff/länkkontroll före commit.

## RTS-166 – gemensamma heal-, buff- och debuffspells

Datadrivna Heal25HP, Ward0.75× inkommande skada/6s och Hex0.75× attack/5s. Mana/range/cooldown, fysisk targeting med färgmarkör, F2/F3/F4 och Escape/högerklick. Ogiltigt/fullt/dött/utanför range/fog/fel lag eller typ debiteras inte. En buff och en debuff per mål; ny effekt ersätter samma kanal, gamla E-selfbuffen är separat. Save39 migrerar38 och validerar aktuella effekter/cooldowns även ombord. Status i tooltip och cyan/lila världsringar. Separat spells.css ger kompakt grid vid specialistselection utan att ändra användarens style.css.

Riktade72tester/7filer PASS; ytterligare feedback/spellcheck14/2 PASS före en ny feedback-regression i uniturvalet. Första range-fixturen saknade uppdaterad fog efter positionsändring; rättad utan ändrade gameplayregler. Browserharness hade först parentesfel, rättat. Faktisk browserkontroll upptäckte att spellfeedback inte visades genom placement-only-feedback; presentationspolicyn rättad och regression tillagd. Slutlig unit446/80 PASS och build inklusive strict typecheck PASS. Befintlig stor-bundle-varning kvarstår.

Chromium native800×600/1280×720 PASS: fysisk selection/markör, ogiltig selfheal/fullHP utan debitering, Escape/högerklick, betald heal/buff/debuff, cooldown/spärr, blandad worker+caster med alla byggactions och spells, scrollmått samt lokal Save/Load/exakt duration/mana/cooldown. artifacts/rts-166 innehåller sex screenshots och browser.json; targeting/effects/mixed800 samt mixed1280 visuellt granskade. Ingen dedikerad casting-sprite, ljudgranskning, ny CI/Pages eller mänsklig balansgenomspelning. Ingen bred campaign-regression i166; full regression vid etappgränsen. RTS-165 push838f729. Slutlig diff-/länkkontroll före commit.

## RTS-167 – fraktionsmagi, tidsgränser och gemensamma AI-regler

Humans Heal/Ward/Hex; Orcs War Cry/Intimidate; Elves Renew/Wither; Dwarves Mend/Rune Shield; Goblins Overclock/Corrode. Konkreta utbud följer134:s support/offensiv/ranged/tålighet/explosivitet, inga nya namn på enheter eller assets. Overclock ger attack1.4× men inkommande skada1.2×. Spell-effects visar namn/tid i selection och separata cyan/lila ringar för buff/debuff. Tidsdelning vid effekt-expiry och0.5s AI-beslut hindrar stora updates från att förlänga melee-/försvarseffekter. AI heal-prioritet under70%HP, annars synlig debuff, annars battle-relevant buff; gemensam castSpell-validering och max en cast per caster/beslut.

Save40 migrerar39 utan omtolkning av de tidigare tre definitionerna; nya IDs avvisas i påstådda39-saves. Äldre icke-Human-cooldowns/effekter kan löpa ut men deras utgångna utbud kan inte castas igen. En buff och en debuff per mål, refresh ersätter kanal; casterdöd upphäver inte effekten, targetdöd städas genom befintlig cleanup. Mana/E-abilities och redan avfyrade projektiler följer tidigare separata regler.

Riktade78/7 PASS. Första fixtures hade undefined-archetype och saknad härledd specialist-faction vid jämförelse efter Load, samt Orc-target utanför160px; korrigerade till verklig Save-/range-kontrakt. Första typecheck fann att AI-targetunionen även kunde vara Worker; explicit Soldier-filter rättat.95 strids-/AI-/profiltester/6filer PASS, inklusive relevanta factionBalance-genomspelningar eftersom strid/AI ändras (146.97s). Slutlig unit446/80 och build med strict typecheck PASS.

Chromium fem raser ×native800/1280 PASS: fysiska casts och distinkta slots/tooltip, effektstatus och ringar, mana/cooldown, blandad worker-HUD-scrollmått, verklig Scene.update med AI-cast, lokal Save/Load på aktiva effekter och cooldowns, expiry/restart utan läckage. Harness-korrigeringar: parentesfel, initial fixture-fog och kamerans rendertransform före fysisk input. Runtimefog eller selectionregler försvagades inte.20 PNG och browser.json i artifacts/rts-167; alla fem effects800 och Goblin-AI1280 visuellt granskade. Ingen ny casting-sprite/ljudgranskning/CI/Pages/mänsklig helmatchbalans. Full regression startad en gång för etappgränsen, resultat dokumenteras separat. RTS-166 push2cd36a6.

## RTS-168/169 – konkret blockering efter verifierad167

RTS-167 pushfd9dfd3. Inventering av134/GAME_DESIGN, DECISIONS, factions.ts och registrerade godkända landreferenser: ingen luftroster eller flygarsilhuett/porträtt/animation finns. Uppdraget kräver befintlig faction-plan; vi hittar inte på en sådan eller kallar en marksprite flygare. Designfrågan är obesvarad. assets/sources/air-168.md anger exakt saknat beslut om identitet/roll/produktion/prereqs/targets/anti-air och visuellt underlag.168 Blocked.

169:s oberoende kod-/dataavstämning dokumenterad i artifacts/rts-169/partial-review.md: befintliga specialiststats, mana/regen/cooldownkostnad, E/research-kombination och sjö-/siege-roll. Ingen spekulativ statändring eller nytt169-counterexperiment; riktade factionBalance/AI-belägg från167 hålls separata från mänskligt speltest och historisk164-försvarsbalans. Full169 kräver ännu saknade air/anti-air/combined-arms-data, därför Blocked.170–173 startas inte. Full regression på165–167 körs för etappgränsen; HANDOFF skrivs efter resultatet. Användarens CSS/docs bevaras.

Slutlig etappregression165–167: npm test1227/158 PASS på477.49s, en full körning. Unit446/80 och build inklusive strict typecheck från slutliga167-koden återanvänds; efter fd9dfd3 enbart docs/inventering. Ingen ytterligare kod-/assetändring eller omtest utan relevant skäl. git diff --check och lokala Markdownreferenser PASS. HANDOFF uppdaterad med165–167 Done/hashar,168/169 konkreta blockerare och nästa168;170–173 inte startade. Full regression är automatisk genomspelning, inte mänsklig helmatch-/luftbalans. User-CSS SHA oförändrad, docs/ otrackade/bevarade. Separat docscommit/push efter verifieringen.


## RTS-168 – första luftroster enligt nytt uttryckligt godkännande

Tidigare designblockerare upphävd av användaren2026-10-05. Fem namngivna recipes, befintlig barracks/Forge/attack1/defense1, tidig grundarcher-AA. Explicit domänmask över navigation, acquisition/combat/projectile/splash, rangedtorn, ships och spells. Lokal luftvision/minimap, selection på ikonens upphöjda centrum, bounds, gemensam FIFO/supply/rally, AI-betald produktion och synlighetsstyrd archerdefense. Sjö-AI:s landcap2 behålls men begränsar inte flygare; boarding/mark-/sjöspawn/placering ignorerar luftbodies. Save41 bevarar airorders/jobs/projectilemask och migrerar40. Originala statiska TEMP-ikoner/porträtt,24px höjd och skugga; slutliga fem sprites/animationer/porträtt Pending.

Riktade83/7 baselinePASS;57/8 första dependencykörningen hade55PASS och två gamla förväntningar som behövde ändras (roster fem→sex, coastal melee kan enligt nya ground-only-regeln inte längre slå skepp).33/4 efter korrekt kontraktsuppdatering PASS;30/3 luft/AI/towerPASS inklusive17 nya lufttester, Save midflight/projektil, fog/mask/splash/multiplikator, sjö-AI cap och gränser. Browserharness fick syntax-/fixturefält/bank rättade och flygdelta50ms för verklig midflight. Runtime Savevalidering försvagades inte.

Chromium fem raser ×native800×600/1280×720 PASS, betald fysisk produktion/selection, tooltipTEMP, flight överForge, Save/Load med bibehållen HP/order/position, fulltrejobskö/scrollmått och restart. Fit-läge också fångat1280.45 screenshots plus browser.json i artifacts/rts-168; Human/Elf/Dwarf-selected800, Orc-overbuilding800, Goblin-production800/fit1280 visuellt granskade. Höjd/skugga/märkning synlig; de tre vingikonerna är avsiktligt temporära. Ingen mänsklig helmatchbalans/finalartapproval/ny CI/Pages. Slutchecks före kodcommit redovisas nedan. Användarens style.css och docs/ bevaras. Nästa169; stopp efter169.

Slutlig168: unit446/80 PASS10.33s efter två gamla Elf/Orc-rosterförväntningar uppdaterats till sex roller (första unit444PASS/2FAIL). Build inklusive strict typecheck PASS på slutlig runtimekod; därefter endast tester/docs/browserharness, därför build inte upprepad. Riktade slutliga integrationer93/12 PASS11.80s. Kompletterad browserluftstrid fem raser ×800/1280: fysisk högerklick på upphöjd fiende, faktisk projektilskada för fyra flygare och Goblin-luftmaskspärr; stridsmålet isolerat från AI-formation i fixture. Orc-combat800/Goblin-combat1280 också visuellt granskade. git diff --check PASS; full regression körs en gång vid slutet av169.


## RTS-169 – preliminär balans för land, sea, air och magic

RTS-168 push83d01fe.89 scenarier med faktiska profiler/combat/projektil/spell/paid AI-adapters:25 crossracegroundAA,16 airdueller,10 actual-water navalgrupper,5land-AA,5closemelee,5siege,3bomber/escort,10magic/normal,5paidAI och5naval1v1. Wood/gold lika vikt, avrundad närmaste enhetsbudget; separata resurskostnader visas. Lika land/airresearch1, ingen kiting/retreat eller mänsklig ekonomi. Metod/exaktdata i artifacts/rts-169/balance-review.md, baseline.json och results.json.

Belagda ändringar: warship noair→air vid0.75× skada(12), bibehållen16 mot andra domäner. Kontrollerad airborne+marine-flight, actualwaternavigation och Save42/migration41. Eagle luft14→17.5(×1.25), fortsatt mark/byggnad6.3; eftertuning slår den Wyvern men inte Gryphon/Gyro i400-resursdueller. Alla25 mark-AA-korsrasfall vinner, alla fem closemelee slår AA; bomber0/3 mot airhunter men escort5/0 vid224vs240budget. Gyro är starkast i fixtureairdueller men motverkas av billig mark-AA. Inga costs/tider/supply/HP/range/fart omprisade. Två sena enemyConstruction/Expansion-preflightchecks räknade flygare som markhinder; rättade med ground-positive-controltester.

Riktade final122/5 PASS2.12s.73 balansintegrationstester/89 records PASS;37naval/save PASS. Tidig typecheck fann Node-typer/reportwriter och Soldier-role/Worker-union i tests; runnerexport flyttades till mjs, Soldier narrowing rättad. Reporter tyst/interleavad över16KBJSON löstes med explicit disableConsoleIntercept och små radrecords. Naval Combat-testfil flyttad till integrationmanifest eftersom den innehåller MatchState/Save-fall; inga tester borttagna.

Browser fem raser×native800/1280 PASS: fysisk shipselection/elevated airtarget, marine+airborne/mask/multiplier, inflightSave42/Load och12HPimpact.20 före/efterbilder+browser-naval-aa.json, Human-before/after800/Dwarf-after1280/Goblin-after800 visuellt granskade. Första fixed-aim-fixturen fick mål som AI flyttade ur impact; senare explicit stillastående defender med samma actualcombat, ingen homingregel ändrad. Tillfällig airart/befintlig sjöart visas ärligt, ingen slutgrafikclaim. Ingen mänsklig helmatchbalans, ny CI/Pages eller ljudlyssning.

Två påbörjade etappregressioner avbröts innan completion: luftduellreview krävde Eagle-AA-tuning; slutlig domängranskning hittade de två AI-byggplatskontrollerna. Slutlig full regression körs efter dessa sista ändringar. Unit/build från före sista runtimefix räknas inte som finalbelägg; nya slutchecks nedan. Inga extra separata fulla campaignbatcher. Användarens style.css SHA och docs/ bevaras. Stopp efter169.

Tredje fullregressionförsöket fann tre islands-genomspelningar och The Crossing som inte vann; avbröts före completion för riktad felsökning. Bekräftad orsak: äldre testbotar gav närstrid upprepade illegala targetorders mot air/sea och stod därför stilla. Teststrategin i navalArmy/campaignOperations/releaseBot/islands filtrerar nu synliga lagliga mål via samma canAttackDomain. Victory-, ledger-, Save-, army-/landstigningsasserts och HP/budgetregler oförändrade. Tidigare tre felande islandsfall PASS18.01s och The Crossing PASS5.89s; ingen ny spelmekanik eller nerfad AI för att få tester gröna. Slutlig full regression startad på denna sista kod.

Kompletterad faktiskt AI-browser alla fem raser native800 PASS: explicita bank/completed-tech/army-preconditions, verklig Scene.update betalar/producerar namngiven air, reagerar på synlig egen flygare med laglig archerdefense och släpper hotet när det lämnar fog. Ingen gratis produktion i spelet eller helmatchekonomi hävdas. Första fixturen dubblerade ett redan påbörjat barracks-ID (tech/priority korrekt nekade produktion); fixturen städar nu gamla sites innan completed-tech-precondition.5PNG och browser-ai-air.json; Elf/Goblin-air-defense800 visuellt granskade. Riktade adaptertester kontrollerar nya counterköer; browsern kontrollerar faktisk produktion/defense/fog-release.

Finalunit435/79 PASS14.74s; build inklusive strict typecheck PASS435ms på slutlig runtime/testhelperkod. Manifest81 integrationsfiler, ingen testfil utelämnad. Lokala docsreferenser och git diff --check PASS. Fullresultat kvar att införa efter körningen.

Den fjärde fulla körningen avslutades:1314 PASS/6 FAIL av1320 tester,160 filer,523.24s. Felen var äldre Human-rosterassert(fem→sex) och fem autonoma AI-rosterasserts vars loop stannade vid fyra observerade roller innan hela nya femrollsarmén hunnit produceras. Fullrosterrecipe-testet utökades samtidigt till air med exakt kostnad/supply/tid/unik-ID och fem betalda jobs; autonoma loopens gamla650s-gräns behölls. Riktade Human/enemyFactions32/2 PASS5.39s. Ingen runtime-, balans- eller victoryregel ändrad. Ny slutregression krävs av dessa konstaterade fel och teständringar, inte en extra spekulativ campaignbatch.

Slutlig169 efter sista teständringen: npm run test:unit435/79 PASS12.08s; npm run build inklusive strict typecheck PASS (befintlig bundlevarning). npm test1320/160 PASS526.62s, komplett obligatorisk etappregression. git diff --check och lokala Markdownreferenser PASS. Runtime/browserbelägg återanvänds eftersom sista ändringen endast kompletterar rosterasserts.169 Done som första preliminära balanspass; mänskligt speltest/finalgrafik Pending. HANDOFF/BACKLOG/DECISIONS uppdaterade, inga170-tasks påbörjade.168 är push83d01fe;169 separat commit/push efter dessa checks. User-CSS SHA95c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e och docs/ bevarade.

## RTS-170 – Hold, Patrol och bestående orderkö

Nytt170–173-mandat inventerat mot BACKLOG/HANDOFF/DECISIONS;160–164 Done/hashar7d7290c/b7439ae/4658a0d/efbdd7d/874f761 och168/16983d01fe/756b768 återimplementeras inte. AGENTS:s äldre168-blockering ersätts av senare HANDOFF/nytt mandat. Main/origin verifierat, CSS SHA95c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e och otrackade docs/ bevarade.

commandOrders adapterar befintlig movement/gathering/attack/attack-move/navy med bestående Hold/Patrol och32-orderFIFO. Workers/transports förblir obeväpnade. Vanliga order/Stop/build/repair/boarding avbryter berörda köer; avmarkering ändrar inget. Döda/dolda/saknade mål hoppas över, blockerad attack med väntande kö lämnas; patrolblockering väntar på maprevision. Hold kan skjuta i faktisk range utan förföljelse eller separationförflyttning. Save43/42-migration, mode/endpoints/FIFO valideras; restart tomt. F6/F7/actions/kompakt status återanvänds.

Riktade142tester/14filer PASS3.37s; sista commandOrders10/1 PASS efter navy/migration/blockedattack-komplettering. Slutlig unit435/79 PASS8.96s; build med strict typecheck PASS330ms, befintlig bundlevarning. Nya relevanta fixes motiverade slutchecks: workerpatrol-routing, Hold-selection, fixedseparation, nya knapparnas disabled-synk och ikoner. Initiala två testfel var projektil som redan träffat och fel LoadResult-fältnamn; rättade assertions enligt verkligt kontrakt. Ingen fullcampaignbatch i170; full regression vid173.

Chromium800/1280 fysisk selection/rightclick/Shift, köstart, Hold/Stop/F7-Patrol/Escape, localSave/Load och restart PASS. Faktisk Scene.update verifierar Hold-projektilskada utan positionförändring och återupptagen patrol efter targetborttagning. Explicit stationär enemyfixture skiljs från helmatchbalans. Sex PNG+browser.json i artifacts/rts-170; queue800/Hold-combat1280 visuellt granskade. Browserharnessfixes: parentes, viewportoffset, explicit HUDrender i fryst fixture, menuSave/resume, entydig canvas och bibehållen originalupdate över Phaser-restart. Sandbox-browserstart avbröts; godkänd lokal Chromium utanför sandbox användes. Inga gameplay-/Save-/fogregler försvagade. Diffkontroll PASS, relevanta dokument/länkar uppdaterade.170 Done före taskvis commit/push;171 nästa. Ingen ny CI/Pages-verifiering.

## RTS-171 – kroppssäkra formationer och gruppnavigation

170 push31df7e6. Befintliga separata markmål/traffic/separation inventerade. Gemensam formationsallocator tar faktisk kroppsstorlek och domän; större först/stabila IDs, minst32px spacing,4–8 kandidat-radie. Air har egna platser, ships använder vattenmap och individuella platser. Blockerad central plats får kroppssäkert nåbart alternativ; outside-world fortfarande avvisat. En bounded multi-goal-BFS per enhet/kommando ersätter många upprepade misslyckade kandidat-BFS. Väljer närmast klickpunkten bland nåbara slots; ingen allokering per frame. Shift/Patrol återanvänder fördelade slutpunkter, befintlig stridsapproach och trafik/separation bevaras. Save43 oförändrat.

Riktade58tester/7filer PASS1.62s:128 mixedsize/domain, stabil arrayordning/ingen bodyöverlapp, bounded exhaustion289+2, blockedcenter/outsideworld, individuell reachability, navy, queue/Patrol och4/24 genom64px smal passage med stabilt stillastående efteråt. Två äldre assertions motsvarade avsiktligt ändrade krav (blockerad klickpunkt ska nu få fallback, större kandidatutbud); uppdaterade till positiva body/reachability och bounded exhausted-no-space assertions. Ny shipfixture hade en start utanför verklig pond; rättad. Testerna upptäckte Patrol-workerallokering och att första BFS-versionen prioriterade ruttnärhet framför målnärhet; båda rättade i runtime. Ingen passageassertion/deadline försvagad.

Slutlig unit435/79 PASS9.00s, build med strict typecheck PASS339ms och diff PASS. Chromium4/24×800/1280 faktisk dragselection/rightclick och Scene.update genom authored öppen64px own gate PASS.8 screenshots/browser.json i artifacts/rts-171;24-800-settled visuellt granskad. Kropparna står separat; äldre cargotexter överlappar i täta workers (presentationbegränsning), ingen body-/routeöverlapp hävdad. Fixturen har explicita24 workers över naturlig starting-supply; visar navigation, inte betald ekonomi. Ingen fullcampaignbatch i171; full regression vid173. CSS/docs bevarade, inga nya CI/Pages-belägg.171 Done före commit/push,172 nästa.

## RTS-172 – datadrivna AI-profiler

171 pushbcebde1. Tre beställda profiler och befintlig Standard via config/aiProfiles; grupper/reserver/defense/attacktid adapterar difficulty-basen, produktion/tech/expansion använder egna armétrösklar och researchordning. Samma ekonomi/kostnader/prereqs/fog, ingen RNG. Separat menuval med description och sessionstatus; preferenser/Save44/43-migration/restart. Highscores partitionerar och visar profile så olika beteenden inte sammanblandas.

Riktade152/10 PASS3.75s inklusive fyra deterministiska profilematchuppdateringar, actualdispatch vid samma readygroup/tid, own-state prioriteter, options/preferences/Save/migration/score, befintlig AI/policy/expansion. Initial fixture nådde supplygräns innan defense; completed-farm-precondition infördes. Dispatchfixture behövde uttryckligen reserv0 för att jämföra samma attackgrupp; faktisk profilreserv testas separat. Runtime supply/reserveregler ändrades inte. Slutlig unit435/79 PASS8.84s och build inklusive strict typecheck PASS360ms; diff PASS och befintlig bundlevarning.

Chromium3profiler×800/1280 PASS: fysisk profil/difficulty-selection oberoende, localSave/Load/restart behåller valt beteende; actualScene.update betalar Offensive-armé, Defensive-defense-research och Economic-outpost från explicita own-bank/site/army-preconditions. Ingen helmatchekonomi hävdas. Sex menyscreenshots/browser.json i artifacts/rts-172, Economic800 med synlig selector/description visuellt granskad. Första harnessstart använde defaultSurvival; korrigerad explicitSkirmish. Screenshot scrollar till verklig selector i befintlig meny, användarens CSS oförändrad. Ingen broadcampaignbatch i172; full regression vid173.172 Done före commit/push,173 nästa; stopp före174.

## RTS-173 – sammansatta AI-arméer och etappverifiering

172 push4b40f38. ArmyPlan/config använder egna liveunits/paidreservations/tech och aktuella fogobservations, max ett planbeslut per gameplaysekund. Rollkvoter front/ranged/siege/magic/air; profiledata adapterar vikter. Faktiska kostnader/tider/population/difficultycap bevaras. Lika underskott roteras med saved acceptedJobs för avancerade recipes även vid förluster. Naval två landplatser får inte blockera air; befintlig betald transport/landnings-AI återanvänds, ingen ny warshipAI. EfterForge större grupper/30s-muster; få survivors eller blockerade attacks kan sekundvis omgruppera med befintlig retry/production, ingen gratis förstärkning. Siege prioriterar synligt försvar; samma fog/domain/range. Spells återanvänds oförändrat med factionmeaningful conditions. Save45/44-migration behåller paid jobs/entities, planclock sparas/valideras.

Första riktade104/7 PASS5.86s efter konkret starvationfix: all-nyproducerade-units-dör-fixture fastnade annars på initiala billigroller; tie-rotation rättade faktiskt beteende och fem autonoma rosterfall utan höjda650s-deadlines. Naval-seat-plan utesluter fulla groundseats före roleval i stället för att fastna före air. Typecheck hittade TechnologyState-import/forge-property och två Defense-testfält; riktiga kontrakt rättade.

Riktad navy/policy/expansion/factionBalance körde56tester/4filer:55PASS/1FAIL (ett efterfrågat navalArmy.test-filnamn saknas, inga tester där hävdas). Clan/mission-base/hard förlorade. Diagnostic actualtrace visade att botens egen soldier blockerade dess enda Forge-plats, så tech/armé blev permanent3. releaseBot provar nu tre lagliga kända Forge-sites med samma betalning; betald seger/Save/ledger-asserts oförändrade. Synlig air ger dessutom verkligt betald ranged-AA och farm vid supplybehov; dold air påverkar inte strategin. Faktisk failing Clan-hard PASS8.43s efter byggplatsfix, ingen HP/budget/difficulty/deadline ändrad. Tillfälligt diagnostic-test borttaget; inga framtida tasks eller balansstats skapade.

Final targeted68/5 PASS5.97s. Slutgranskning kompletterade RTS-170: attack-move väntar på slutmålet efter target loss före nästa Shift-order; Patrol adopterar nåbart fallback-endpoint efter ändrat hinder så den kan vända utan återplanloop. commandOrders12/1 PASS347ms. Därför avbröts första etapp-fullkörningen före completion; en ny full regression körs på slutlig kod. Unit435/79 PASS9.34s och build med strict typecheck/diff PASS på slutlig runtime; sista byggkontrollen inkluderar nya testkoden. Befintlig bundlevarning kvarstår.

Chromium femfactioner actualScene.update PASS: explicit owncompleted-tech/bank/cap producerar betald front/ranged/siege/magic/air, synlig luft höjer AA och släpper vid fogloss, alla fem casts med meningsfullt skadat ally/synlig hostile. Crown actualtowerdamage från siege och understrength-group→muster PASS. Observer/camera och kompakt screenshot-positionering efter betald produktion är explicit presentationfixture; ingen helmatchekonomi/FPS/humanbalanceclaim. Första towerfixture överlappade redan byggd enemyoutpost; laglig fri plats rättade harness, runtime targeting oförsvagad. artifacts/rts-173 innehåller fem composition-PNG, siege-defense.png och browser.json. Crown composition/siege visuellt granskade; godkänd TEMP-air visas fortsatt, ingen slutgrafikclaim. RTS-170-browser800/1280 återkontrollerad PASS efter slutliga orderfixen; nya records i rts-173/order-regression, historiska rts-170-artifacts bevarade. CSS SHA och otrackade docs/ bevarade. Ingen ny CI/Pages/ljud- eller mänsklig helmatchverifiering. Fullresultat och HANDOFF kompletteras före173-markering/commit/push.

Första färdiga etappregressionen1355/163 gav1349PASS/6FAIL527.27s, samtliga air.test. Fem upptäckte verklig regression: groupMove på outside-world ersatte pågående order. Adapterguard bevarar nu hela arrayen/order (samma kontrakt som mappedMove), äldre formationsassert uppdaterad till identity. Sjätte äldre assertion krävde idle för mark vid blockerad mixed-domain-klick;171 kräver nåbara fallbackplatser, nu assertas move+bodyFits. Riktade air/groupMovement/commandOrders37/3 PASS1.01s. Ingen airkostnad/Save/range/fog ändrad. En omedelbart startad checkkedja avbröts under unit när ett ytterligare riktat formationsassertfel upptäcktes; räknas inte som slutchecks. Ny unit/build/full på slutlig rättad kod.

Slutlig unit435/79 PASS8.89s och build inklusive strict typecheck PASS356ms efter outside-world-korrigering. Slutlig173-browser återkörd PASS; sista screenshot-fixturen flyttades till synliga600–720px-platser eftersom ursprunglig viewport bara visade en del av den betalda armén. Crown femroller/TEMP-screenshot visuellt granskad efter förbättringen. Inga runtimeändringar från presentationsjusteringen. Lokala Markdownlänkar PASS.

Slutlig full npm test1355tester/163filer PASS527.48s. Samtliga unit/integration/campaign/matchfiler i manifestet täcks. Ingen ytterligare bredcampaignbatch. Review utan kvarstående blockerande fynd; Done173, BACKLOG/HANDOFF/AGENTS uppdaterade. Slutlig Markdownkontroll återanvänder kodchecks ovan eftersom endast docs ändrats efter PASS.17031df7e6/171bcebde1/1724b40f38 redan pushade;173 separat commit/push. Stopp före174, nästa task kräver nytt mandat.

## CI-korrigering efter RTS-173

Användaren rapporterade röda GitHub-pushar. Publika Actions-jobb/annotationer kontrollerade: af8ec31 [run37282536894](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37282536894) fallerar endast tests/factionArt.test.mjs:8, default5000ms-timeout. Samma timeout finns i168–172;171/172 hade dessutom air-assertions som rättades i173. Föregående lokal PASS var inte CI-PASS och äldre slutrapporter saknade faktisk Actionskontroll. Loggarkiv kräver autentisering (403); konkreta offentliga jobbsteg/annotationer räcker för diagnosen.

Endast teststruktur ändrad:16 faction/type/owner-fall i stället för ett stort, atlas läses/dekomprimeras en gång via beforeAll. Alla riktningar/states/frames, pixel/source-equality, transparenta kantpixlar, stabila fötter/HP-overlay, ankare och animationsmanifest kontrolleras som tidigare. Ingen timeoutökning, skip eller ändrad spel-/assetkod. Riktade17/1 PASS3.75s, per animationsfall160–280ms; unit450/79 PASS9.84s och build inklusive strict typecheck PASS386ms, befintlig bundlevarning. git diff --check PASS. Ingen browsercheck motiverad av enbart testuppdelning. Lokal full1355/163 från173 är historiskt belägg på oförändrad runtime; ny fullregression körs i GitHub efter fixpush och redovisas separat. CSS SHA95c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e och docs/ bevarade. RTS-174 startas inte.

CI-fix `b79d1fd` pushad till origin/main. Faktisk [Actions37300780990](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37300780990) avslutades success: npm test11:06:38–11:18:43UTC (12m05s), build inklusive strict typecheck success11:18:43–45, build-job success11:18:48 och Pages-deploy success11:19:00/01. Detta är ny remote-verifiering på fixcommit, inte återanvänd lokal PASS. Publicerad sida inte separat browsergranskad; inga ljud-/mänsklig balansbelägg tillagda. Efterföljande Markdown-only avslut uppdaterar BACKLOG/HANDOFF med faktisk CI; inga nya kodchecks krävs. Lokala docsreferenser/diff kontrolleras, CSS/docs bevarade, stopp före174 kvarstår.

## PRIO-01 – live musklick på actions

Nytt bifogat PRIO-01–04-mandat infördes utan nya RTS-ID:n;174–176 vilande, stopp efter04. Två godkända PRIO-03-stilbilder och referenskartans krav dokumenterade. Main/origin och CSS/docs inventerade/bevarade. Native click reproducerat i levande match: pointerdown/up kom fram till aktiv train-worker men inget click. Diagnostik som enbart stoppade knapptextmutation återställde click. Alla per-frame actionlabelskrivare och hotkeyappend använder nu setActionLabel som bevarar befintlig Textnod och children även vid ändrat countdownvärde. Gemensamma clickcallbacks/betalning/prereqs oförändrade; explicit HUD-targetguard i world-pointerdown.

Riktade34/6 PASS694ms (labelidentity, hotkeys/actionmodel, queue/research/baseupgrade). Slutlig unit451/80 PASS9.04s, build inklusive strict typecheck PASS368ms och diff PASS. Levande Chromium native800/1280 fysisk250ms press med riktiga Scene.update PASS: worker/soldierproduktion,3-jobb fullkö, insufficient, upptagenresearch, farmknapp→preview→laglig worldplacering, research och baseupgrade, hotkeyparitet utan Enter. Exakt debitering och oförändrad selection/order vid HUD-click, aktiv simulationclock verifierade. Sex PNG/browser.json i artifacts/prio-01; research-upgrade800 visuellt granskad. Ingen frysning av update; explicit bank/completedtech/stationära workers/AI-fixture och kameracentrering skiljs från naturlig helmatch. Första harnessklicket hade basen utanför native800viewport; explicit synlig kamera och korrekta40wood/10gold researchkostnader rättade fixturen. Tidig AST-editering saknade TS7 runtime-API; ingen kod ändrades då, avgränsade labelersättningar genomfördes och typkontrollerades. Browserstart sandbox-nekat, godkänd lokal Chrome användes. Ingen bredkampanjbatch; ny CI följs efter push.01 Done;02 nästa.

## PRIO-02 – specifika actionikoner och tillstånd

01 push476ddd6; faktisk [CI37304407683](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37304407683) success.31 unika32pxactionbilder per fraktion: bounding-alpha-crop av godkända bygg-/unit-/ship-/airframes och egna integerpixelglyphs för olika kommandon/spells. Research sword/shield med plus, uppgraderad byggnad med pil. Canvas/dataURL-cache per fraktion/action, inga textchildersättningar; endast egen actionIcons.css, användarens src/style.css orörd. Prereqs anges även efter unlock; aktiva previews/research/upgrades och producerande unittyp markeras, disabled blir grå. Ingen betalnings-/tech-/matchregel ändrad.

Riktade19/4 PASS547ms (fem fraktioner×alla frame/glyph-referenser unika/giltiga, labelidentity, prerequisites/status och hotkeys). Slutlig unit457/81 PASS9.15s, build inklusive strict typecheck PASS360ms, befintlig bundlevarning/diff PASS. Första unit PASS men build upptäckte Nodefs-test i strict browserTS; assettest flyttades till befintlig tests/*.mjs-konvention utan ändrade assertions. Detta motiverade sista unit/build-körningen.

Live PRIO-01-klickregression800/1280 PASS med nya ikoner, rapporter/bilder i prio-02/click-regression. Ikonbrowser31pixeldistinkta bilder för alla fem fraktioner, Crown worker/aktivbuild/base/barracks/harbor/spells vidnative800/1280 och övriga fyra barracks800, totalt16views PASS. Faktiska buttonmått, tooltips, active/disabled och ingen actionscroll/klipp. Crown worker800/barracks1280 visuellt granskade. Första arenaUI-fixturen saknade navy; explicit createNavy infördes i harness (ingen gameplayändring). Godkänd TEMP-airgrafik kvar, inga finalairclaim. Ingen broadcampaignbatch.02 Done före commit/push;03 nästa.

## 2026-10-05 — PRIO-03, spelbar original referenskarta

Alla12 JPG från referenssidan hämtade/granskade, River Fork dessutom fullstorlek. Frontier Valley får eget authored contour-/grove-underlag och egen pixelatlas via befintliga Surface-brushes. Originalen används endast visuellt och ligger utanför repo.90+52 sammanhängande trädceller delar befintliga400/200wood-stockar, fasta serviceentréer/glänta och samma gathering-kostnader/tider. Tre landapproaches, två separata oregelbundna riverbasiner, grunt/mellan/djupt, shoreline/corners/blends, klippislets/landö, earth/grass/strand följer samma collisiontiles. Forestfringe öppnas med faktisk stockminskning; endast tiletröskel reviderar obstacles, sorterad crownordning cacheas. Player/enemy-last-seen crownmemory undviker dold avverkningsinformation.

Save46 migrerar genuin45-Frontier till legacylayout utan flyttade enheter/hinder; nya matcher reference. Äldre renderer/nav/AI-waypoints följer layoutflaggan. Minimap visar rätt vatten/skog och observerad avverkning. Resource hit testar livecrowncells; synlig krona kan klickas även när fasta nodeentrén ligger utanför vision. Placement-/harborroutechecks använder fasta servicefootprints separat från nya crownobstacles. Wildlifehomes hålls utanför authoredgroves och beror inte på avverkning.

Riktade75 tester/8 filer PASS73.61s: frontier två betalda fraktionmatcher till victory, enemy betald armé skadar spelarbasen, resursconservation/workeråtkomst/40px trelanes, navy/coast, Save och minimap. Första körning hittade gammal waterpatch i test och blocked scoutgoal i nya skogen; båda rättade till layoutens egna underlag/punkter, äldre saves behåller ursprungliga. FrontierAI:s400s-integration stoppar vid första basskada och har uttrycklig30s integrationbudget (uppmätt8–10s med fler terräng-/skogshinder); inget unitasset-timeout höjt. Slutliga Save/forest/nav/wildlife/legacyassets/atlasrepro60/6 PASS1.62s; extra terrain-nonoverlap3/1 PASS. Root.mjs med faktisk Save45-fixture klassad integration. Slutlig unit457/81 PASS9.08s, build med strict typecheck PASS, befintlig bundlevarning, diff PASS. Extra unit motiverad av sista wildlife-/legacyasset-korrigeringen; första unit458PASS/1FAIL avsåg gammal frontieratlas mot ny collisionlayout, nu explicitlegacy + separata referenceassertions.

Browser native800/1280: fysisk crownselection och rightclickgather,80gameplaysekunders ordinarie simulation ger40wood och12 borttagna crowns; SaveLoad bevararstock/obstacles/forestmemory paused, restart återskapar400wood/reference. Separat explicit200wood/100gold fullfog navalfixture använder befintlig knapp/byggarroute/betalning/warshipproduktion och fysisk sjöorder till896,496; land/vattenbodycheck PASS. Harness första builderfixture låg i vatten, korrigerad till nåbar landmark800,384; sedan rätt befintligt buttonIDtrain-ship. Inga gameplayförändringar för harnessfelen. Report/gameplay-bilder artifacts/prio-03/gameplay-browser.json.

Före/efter samma cameras förforest/coast/overview, med explicita fullfogartfixtures. Tre efterbilder granskade och länkar visade användaren. Pixelmönster/djupkant förbättrade efter första visuella review. Sista bilder uppdaterade efter wildlifehome-clearance. Ingen annan karta omritad; inga broadcampaignbatch för kartgrafik, relevant Frontier-end-to-end körd p.g.a. topology. UserCSS SHA95c372…e och docs bevarade. PRIO-03 Done;04 nästa;174 vilande. PRIO-02ad2259f faktisk GitHubCI37305471122 success (test/build/Pages),01 tidigare37304407683 success. Ny03CI redovisas efter push.

## 2026-10-05 — PRIO-03 CI: rättad config20-testfixtur

Push0ab2436:s faktiska GitHub37309876585 föll endast i largeMaps.test.ts config20migration (annotation line50); build/deploy skipped. Testet relabelade en ny reference-Frontier-save till20 men lät nya terrainLayout/groves/fogmemory följa med. Den strikta migrationen avvisade korrekt sådan framtida terräng. Fixture återskapar nu ursprunglig legacyterräng, ursprungliga resourcefootprints och inga senare layout/grove/fog/wildlifefält. Befintliga assertions för lyckad migration, ledger, extraNodes och view är oförändrade; inga Save-/gameplayregler eller deadlines ändrade.

Verifierad isolerat mot exakt pushad0ab2436 i /private/tmp/w2t-prio03-ci, utan pågående04: riktad config20migration1PASS/8skipped31ms, unit457/81 PASS13.35s, build inklusive strict typecheck/diff PASS. Samma riktade test i aktiva47-arbetskatalogen PASS. Separat fixture/docs-korrigering commit/push; följ faktisk nyCI. PRIO-04:s tidigare påbörjade ändringar bevaras ocommitade och är inte del av korrigeringspushen. Lokal etappfullregression med04 pågår separat och räknas inte som03-isolerad regression.

## 2026-10-05 — PRIO-04 teknisk del, lyssning kvar

Utökat befintliga originaldjur/absolute-time wandering med configHP/deer24/rabbit8/fox16 och separat sparse wildlife health/hurtAt/deadAt. Inget neutralt enemy-, occupancy-, observer-, minimap- eller economy/ledgerobjekt. Sprite32×32 hitrect följer befintlig origin(.5,.75), inklusive huvud; vänsterinspect/portrait/HP/ljud bevarar markerade truppers order. Typad hunt+Shift-kö för soldater/luft och krigsfartyg (transports/workers undantas), normalreplace/Stop, dead/hidden/unreachable cleanup och nästa queued på nästa step. Befintlig combatApproach/naval attackStep/siktlinje/firing-route/profilrange/damage/cooldown/upgrades/spell-/abilitymods återanvänds; explicit hunt skyddas i acquisition och normal autoidle återställs efter slut. Neutral ranged damage appliceras direkt med attack-/impactfeedback; inga neutrala missiles/loot. Alla jägare clearas på sista träffen, även tidigare i samma snapshot. Hitflash/roterad corpse/X1.5s och animalinspectioncleanup. Habitats cacheas per statisk karta/layout i stället för dynamisk mapidentity, så öppna gate-/harvestrevisions inte utlöser världsscanning per frame.

Save47 migrerar46 med tom healthstate; sparar HP/tider/hunt/orderQueue och validerar typer, habitatID/hp/time/live/queuedrefs och naval transportrestriktion. Wanderpositioner kommer från befintlig clock/home, inga extra positionsfields. Death sparas, restart återställer HP. Egna stiliserade deterministic PCM-calls/deer .65s/rabbit .22s/fox .4s via Pythonstandardlib, identiska24kHz16bitmasters/runtime + eget manifest/provenance/license. Befintlig audio graph/master/mute/effects/pause; perart1s och shared0.8s spärr hindrar alternerande clicks. Assettest mäter format/non-silence/clipping/master-identitet, enginecase verklig mixerroute/globallimit. Befintlig exporter inkluderar nya clips.

Riktade53/6 initial PASS efter att historiskt wildlifeSave ändrades från inga-fields-claim till bevarad pose/tom health (acceptans ändrad enligt04), combat/queues36/3 PASS; pre-naval final65/8 PASS1.08s. Naval-fixtur började med ej existerande shoreanimal/HP100 (Crown90); laglig water/raycast och cfgHP rättade utan gameplayändring. Naval64/5 PASS801ms. Slutliga76/6 inkl. acquisition/navigering/land+marine/Save/queue PASS1.75s. Slutlig unit458/82 PASS16.57s, build strict/diff PASS. First64 navalbuilds typeerrors av ShipRecipe warship/transportunion rättade via rätt konkret warshipstats; inga unsafe casts av vapenprofiler.

Browsernative800/1280 PASS på slutlig kod: fysisk huvud-/bodyinspect med markerad fighter kvar, alla tre läten via samma appAudioContext18buffers/running; alternerande10clicks ger endast1source. Physical rightclickhunt, progressiv damage/death/targetcleanup, oförändrat bank/ledger, actual SaveLoad damaged/hunt/dead och restart; separat shore-warshipfixture ger profildamage med vanlig siktlinje. Deer800/dead1280 visuellt granskade, även warshipflow rapporterat artifacts/prio-04/browser.json. Initialharness använde en andra Vite-HMR-import av audio.ts och hörde inga event i det instrumentet; routeexponerar nu appens faktiska instance endast i harness, inget skeppat debugAPI.

Faktisk lyssning efterfrågades tidigt med tre konkreta WAV-länkar och async fråga; obesvarad. Ingen actualListeningclaim eller04Done. Teknisk implementation lämnas ocommitad tills central lyssning/slutchecks klarar DoD. Första full etappkörningen avbröts efter slutreview påvisade saknat warshipstöd; nästa avbröts efter konkret spritehuvud-hit/normalidle/allhunters-cleanup-rättning. Final fullregression på slutlig kod startad efter passerad finalunit/build/browser, pågår; inga avbrutna körningar räknas PASS. GitHub03-fixturfixb5a3100 följs parallellt. CSS SHA95c372…e/docs bevarade;174–176 fortsatt vilande.

Faktisk PRIO-03-fix-CI: b5a3100 / https://github.com/tobisen/warcraft-2-tribute/actions/runs/37312395555 SUCCESS. Jobsteps npmci/test/build success och Pagesdeploy success. Detta är nytt belägg efter fixturefix, separat från ocommitad04 och dess då pågående lokala slutregression, nu PASS enligt slutnoteringen.

Slutlig lokal etappregression npm test PASS1394 tester/169 filer,588.49s på slutlig kod. Unit458/82, build inklusive strict typecheck och diff PASS; inga runtimeändringar efter dessa kontroller. Extra live-browser med faktisk Scene.update (inte fryst uppdatering),800/1280 PASS: vandrande huvudklick, fysisk hunt, skada/död, normal idle och corpsefade. artifacts/prio-04/live-browser.json och live-hurt/live-dead-bilder; live-dead1280 visuellt granskad. Faktisk ljudlyssning fortfarande obesvarad:04 kvar In Progress, inga04-commits/pushar; stoppa före174. Tidigare avbrutna fullkörningar är inte PASS.

## 2026-10-05 — PRIO-04 godkänd och klar

Användaren: ”Kartorna ser bra ut, ljuden är ok och kan godkännas tills vi gör resterande ljud”. Detta avslutar tidigare öppna ljudacceptansen; PRIO-01–04 Done. Kartorna godkända och de tre egna djurlätena accepterade tills resterande ljudarbete. Slutkontroller återanvänds från oförändrad slutlig kod: riktade76/6, unit458/82, full regression1394/169, build inklusive strict typecheck och browser800/1280 PASS. Endast statusdokumentation ändrad efter kontrollerna; ny diffkontroll inför commit. Taskcommit/push enligt mandat; CSS och otrackade docs undantas. Stopp före174.

## 2026-10-05 — RTS-174 inventering och nytt mandat

Användaren beställer174–176, stopp före177.168–173 faktiskt Done/pushade (168 godkänd TEMP-flygargrafik,169 preliminär balans); kvarvarande finalair/mänsklig balans/äldre ljud/röstassets blockerar inte174. PRIO-01–04 färdiga,04abf9027 pushad med användargodkända kartor/djurljud. Arbetskatalog endast användarens style.css och docs/; bevaras. Backloggens korta ownership/relation/fog/statistikmål konkretiseras av nya uppdraget, ingen scopekonflikt. Inventeringen visar tvåspelarantaganden i MatchState/AI-bank, combat, fog och strikt Save;174 kräver gemensamma stabila spelar-ID:n och aktörsspecifika vyer för återanvänd befintlig AI. Tidigare checks är historik, inte verifiering av174.

## 2026-10-05 — RTS-174 klar

Implementerat stabila spelare/relationsfunktioner, egna färger/raser och validerad tredje start på Plains96/128 skirmish. Varje AI äger individuell betald ekonomi/supply/produktion/research/armyplan/AI/knowledge/current+explored fog. Befintliga systems actor-vyer återanvänds; delat world/resource-lager, högst0.25s-slices med effect-/abilitygränser och snapshotdamage. AI kan bekämpa AI; korrekta kroppsstorlekar, armor/ability/spellförsvar, globala projectile/shooter/target IDs och human debuff skrivs tillbaka till faktisk ägare. Setup med eget AI2 faction/profile, färgade worldringar/HP/minimap och statistik per spelare. Save48 strict actor-envelope, individuella ledgerchecks och global outcome, äldre47 tvåspelarmigration.

Riktade slutliga97/6 PASS7.42s, modifiers31/3 PASS7.22s, tidigare legacy/custom Save/settings/session109/4 och repair/queue/combat114/8 PASS. Slutlig unit461/83 PASS11.18s; build med strict typecheck PASS414ms och befintlig bundlevarning; git diff --check PASS. Extra slutchecks motiverades av reviewfynd: AI-projectilevisning, skyddsmodifierare, kroppsstorlek och delvis utslagen AI-save; tidigare checks räknas inte som slutlig kodverifiering. Full etappregression reserveras för176 enligt mandat.

Native Chrome800/1280 PASS: verkliga menyval/map-countconstraint, olika AI-races/profiles, två separata betalda AI-byggbanker via10s ordinary updateMatch, explicit närstridsfixture mellan AI med HPminskning, fysiska SaveLoad via pausmenyn inklusive ägare/HP, pausedload och två restarts. artifacts/rts-174/browser.json + sex PNG; settings800 och AI-colors1280 visuellt granskade. Bank/army60s- och inflightprojectiletest är riktad gameplayverifiering, inte mänsklig helmatchekonomi eller FPS-mätning. Browserfixturens scenarioval/pausmeny rättades; verkligt hotreferensfel i multi-save hittades/rättades och får egen invalid-reference-test. Ett projectile-hitassert rättades från flyende unit till stationär bas, med originalhitregler bevarade. Ingen bred kampanjbatch.

174 Done, taskcommit/push enligt mandat;175 nästa. Användarens style.css SHA95c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e och docs/ bevarade.168–173 är tidigare levererade, finalair/mänsklig balans/äldre ljud/röstbegränsningar kvar. Stopp efter176 före177.

## 2026-10-05 — RTS-175 klar

Team1–3 i befintlig matchmeny, minst två lag. Delad aktuell och utforskad vision med individuella banker/supply/tech/kontroll. Central relation filtrerar manual/autoattack, offensiva spells, projektiler och siege-splash. Friendly ground spells stöder allierade; repair och gate-control är egna, öppna portar släpper igenom allierade och stängda blockerar alla. AI observerar via lagvision, väljer fientliga mål och återanvänder befintliga defenders för hot nära allierad bas. Save49 migrerar48 till FFA-lag och validerar relationer/attackreferenser. Lageliminering/spectator/resultatsummering genomförs separat i176.

Riktade152/8 PASS8.78s; sista relations-/Save-/arméreview43/3 PASS1.08s. Slutlig unit461/83 PASS9.34s, build inklusive strict typecheck PASS330ms, befintlig bundlevarning och diff PASS. Sista omkörning motiverad av skydd mot allied-defense som armyhot och strikt humanprojektilreference. Ingen full kampanjbatch; full regression vid176.

Native Chrome800/1280 PASS på slutlig kod: menyteams, aktuell/utforskad lagvision, fysisk alliedclick utan kontroll/order/attack, fysisk F2heal, paused SaveLoad med relationer och fysisk öppning av port med actual allied passage och hostile avvisning. artifacts/rts-175/browser.json och åtta bilder; teams800/shared-vision1280 visuellt granskade. Explicit lag/gate/spellfixture och ordinarie updateMatch, delvis fryst Scene.update; inga mänskliga helmatch-/FPS-claim. Riktat faktisk siegehit/splash och real AI-defense-test kompletterar browser. Gatefixture har separerade startkroppar; inga navigationregler lättade.

174416cfa9 faktisk GitHubCI37321500841 SUCCESS (full regression/build/Pages).175 Done, commit/push;176 nästa. CSS SHA95c372…e och docs/ bevarade.

## 2026-10-05 — RTS-176 slutverifiering

Implementerat lageliminering/seger/förlust på befintlig baseHP-regel, inerta överlevare utan syntetiska unitloss/kill/dismiss-statistik, stoppad eliminerad ekonomi/produktion/research/AI och clearade order/projektiler. Shared explored behålls; current vision kommer endast från aktiva lagmedlemmar. Mänsklig bas0 + levande ally ger spectator med kamera/minimap/paus/save/leave men utan gameplay-order. Tydlig synlig spectatorselection och befintlig separata resultatvy med owner-/teamstats. Highscores stöder roster/team-partition, bevarar originalscore/dedup och validerar lagsummor. Save50 validerar teamOutcome och paused spectator; restart/new-menu rensar live state. Kampanjresolver oförändrad.

Riktade slutliga93/9 PASS10.54s inklusive lagscenarier, Save, legacy highscore/session/order/spell/AIknowledge. Unit461/83 PASS12.13s, build inklusive strict typecheck PASS351ms, befintlig bundlevarning, manifest/diff PASS. Extra finalchecks motiverades av reviewfynd: inerta workers måste behålla work.order utan unit.order, eliminerade timers får inte styra framegränser, och gammalt AI-basminne/anfallsdestination måste pensioneras. Ett ursprungligt assertion för attack-move justerades till tillåtna muster/attack-move: verklig AI omgrupperar enligt befintlig regel; centrala assertions att gammalt minne/destination inte kvarstår och strict Save bevaras.

Native Chrome800/1280 PASS på slutlig kod i artifacts/rts-176/browser.json och sex PNG. Explicit baseelimination-fixture genom faktiskt Scene.update: alliedAI eliminerad → human fortsätter, human eliminerad → ally fortsätter och visible spectator/lagvision, fysisk minimapkamera/rightclick utan order, physical pauseSaveLoad/resume spectator, slutlig victory efter människans eliminering, hela eget laget defeat, ended world/input frozen, upprepad result sync utan dubbla highscores, tre restarts och fysisk quit-confirm som rensar roster/liveclock. Victory800 och sista spectator800 visuellt granskade. Harness återbindning till Scene-prototyp vid restart, fieldsets faktiska disabled-property och riktiga resultat/statistik-/quitnavigation rättades utan att lätta på gameplayregler. Inga nya mänskliga helmatch/FPS/Pages-browserbelägg.

Första fullregression avbruten efter konkret reviewfynd om gammal eliminerad AI-anfallsdestination; räknas inte som PASS. Ny slutlig fullregression på verifierad finalkod pågår. RTS-176 kvar In Progress tills den passerar.1750a5b422 faktiskt GitHub37324774940 SUCCESS,174416cfa9/37321500841 SUCCESS. CSS SHA95c372…e/docs bevarade.

Efter sista gameplayreview får minimaplegend en kompakt ×/tooltip för publika elimineringshändelser, så människan ser samma rosterstatus som AI använder när ett gammalt basmål pensioneras. Detta är en presentationsändring; pågående slutlig fullregression behålls eftersom inga nya gameplay-/kampanjregler ändras. Final unit/build/browser körs efter legendändringen.

Save-kompatibilitetsreview hittade att giltiga49-lagsaves kunde lagra defeat vid endast human-eliminering eller playing efter sista verkliga fiendens eliminering. Migrering verifierar först49:s gamla individuella utfallsregel, räknar sedan om till teamOutcome och bygger aktuell vision från aktiva lagobservatörer (explored bevaras).50-förfalskade lagutfall avvisas fortsatt;48 FFA-migration oförändrad. Riktade slutliga62/6 PASS12.72s efter migrationen, tidigare retirement/order/spell93/9 PASS. Slutlig unit461/83 PASS13.93s, build strict PASS378ms och diff PASS. Andra fullkörningen avbruten för denna centrala Save-rättning; inte PASS. Tredje slutlig fullregression på den färdiga koden pågår; inga fler kodändringar.

Sista native800/1280-browser kompletterar med faktisk framåtrörelse/konstruktion i allierad AI:s combatassets medan humanunits står stilla, och fysisk Load av config49-fixture: gammal individualdefeat blir paused spectator, felaktigt tidigare human-currentvision rensas före resume, ingen falsk highscore registreras. Rapportens legacy49Migration visar playing/paused/humanVision:false. Save49-fixturen har samma fältmodell som50 och49:s verkliga gamla utfall, inga framtida fält bakåtmärkta.

## 2026-10-05 — RTS-176 Done och etappstopp

Slutlig fullregression npm test PASS1426 tester/173 filer,609.57s på slutlig kod. Inga runtime-/teständringar efter den sista startade fullkörningen; endast docs avslutas. Senaste unit461/83, strict typecheck via build och diff PASS. Samma slutliga browser800/1280 PASS inklusive fysisk config49-migration och faktisk allied-assetprogress i spectator. Dokumentlänkar verifierade och HANDOFF uppdaterad.174–176 Done;176 taskcommit/push, stoppa före177.176:s nya GitHubstatus redovisas efter push, inte antagen från174/175:s gröna körningar. UserCSS SHA95c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e/docs bevarade och undantas från committen.

## 2026-10-05 — RTS-177 design

Inventerat alla åtta befintliga missioner, progression, operationer, kartor, Save och tidigare PRIO/168–176-status. CAMPAIGN_DESIGN.md definierar exakt178-omfattning: befintlig tutorial, sju flerfasmissioner med faktiska preparation/exploration/transport/guard/zone/base-mål, English briefings, stabila engångsövergångar, bas-/kurirförlust, difficulty-/legacy-regler och verifieringskontrakt. Fem raser behåller meningsfulla player/enemy-roller. Nya tre kampanjkartval redovisade före implementation; ingen ny mapgenerator/depot/reward-army.

177 Done som design enligt användarens uttryckliga uppskattningsregel.20–40min är uppskattningar; särskilt waveuppdragen kan visa sig kortare och kräver mänskligt speltest. Ingen ny runtime, browser eller kodtest hävdas. Dokumentgranskning/länk- och diffkontroll före taskcommit; tidigare176-kodchecks återanvänds enbart som historik.178 nästa; stopp efter180. Befintlig CSS och docs/ bevarade.

## 2026-10-05 — RTS-178 klar

Sju nya kampanjstarter använder permanenta datafaser, engelska briefings/current objectives, rätt kartnamn och authored Frontier/Highlands-kartor. Befintlig First Steps/tutorial, paid economy/tech, fog, production, operation/courier/guard/capture, progression/replay/results och central ownership återanvänds. Ingen ny allied/neutral reward-army eller campaign-teamkonfigurator. Kampanjens finalmål ersätter legacy wave/timer/base-victory tills alla faser är klara; bas/courierförlust har företräde. Förstörda guards räknas cleared; byggförlust kan återhämtas och exploration bygger på fog, inte kvarvarande finite stocks. Capture börjar endast i finalfasen.

Save51 lagrar phase och vid finite-wave-missioner startögonblicket. En permanent fas är transition-ledger; inga rewardspawns återkörs. Varje gammal config<=50 avvisar injicerade nya phasefields och bevarar befintliga legacy-mål/kartor/fraktioner. Multi50 migreras separat; lagresolver oförändrad. Restart nollställer runtime; menyåtergång återställer fristående scenarios karta.

Signifikant designjustering redovisad före ändring: finite-wave-schemat börjar efter preparation/exploration med samma count/intervall, för att inte slå ut Outposts nya ekonomi innan förberedelserna. Start sparas. Frontier använder giltig authored wave-entry1248,144 i stället för Arena740,60; faktisk Save-clearancebug upptäcktes i paid playthrough. Testkontrollern återtar färdmål efter strid, kontrollerar nåbarhet och lastar trupper i omgångar; inga gameplay-regler lättades.

Riktade nya faser19/1 PASS; slutliga campaign/Save/team93/6 PASS2.63s, tidigare berörda115/9 PASS10.01s. Sju Normal-missioner slutförda med betald produktion/order och Save genom riktade omkörningar av faktiska fel (Forest/Outpost42.84s; Siege/Ridge/Valley tidigare delkörningar; Crossing/Coast14.35s). Ingen mänsklig20–40min/balansclaim. Unit461/83 PASS9.53s och build inklusive strict typecheck PASS351ms; bundlevarning kvar. Extra slutchecks efter review av legacyfield-injektion, förtida capture och felaktigt menykartnamn. Diff/manifest PASS. Full regression först vid180, samlad kampanjgranskning i179.

Slutlig Chrome native800/1280 PASS:14 riktiga kampanjstarter, rätt storymap/briefing/objective, explicit historisk phase1 + explorationfixture via updateMatch, fysiska Save/load till paused, restart till phase0, quit utan campaignRun. scripts/check-campaign-phases.mjs och artifacts/rts-178/browser.json; åtta active/pausedbilder, active Forest800/Coast1280 visuellt granskade. Detta är fokuserad browserkontroll och automatisk paid completion, inte mänsklig helspeltest/ljudlyssning/FPS. CSS SHA95c372…a5e och användarens docs/ bevarade.178 Done;179 nästa.

## 2026-10-05 — RTS-179 klar

Samlad slutlig kampanjgranskning53/6 PASS85.95s: alla åtta Beginner/Normal med
betald ekonomi/order, transporter, målsekvenser, Saves och load/Fog-regression.
Första Beginner-batch8/1 PASS98.04s före optimering; omkörning motiverad av faktisk
fogkodändring. Ingen ny bank/HP/costtuning behövdes utöver178:s redovisade finite
pressure efter preparation/exploration. Mänsklig tid/difficulty/fun/mixlyssning
är inte utförd och kvarstår uttryckligen enligt användarens179-avgränsning.

Chrome native800/1280 för alla fem raser: tio fysiska workerselect/right-click/
F6hold/Stop-fall, bibehållen selection, visible iconrätt ras/bounds, currentgoal.
Final audioinstans instrumenterad i externt script:18 laddade buffers, inga clipped
samples, paused/suspendedcontext. Dynamisk testimport gav en sidoinstans; rättad
verifieringsmetod använder appens faktiska audioinstans. Musikens buffrade source
behålls suspenderad för resume, inte ett fel. Inga nya gameplay-/audioassets.
Tio UIbilder/två stressbilder i artifacts/rts-179, fyra faktiska screenshots
visuellt granskade. Technical signalcheck ersätter inte faktisk lyssning.

Perf:128-unit explicit Highlands-fixtur gav23.3FPS/50.1ms CPU p95. Avgränsad fogfix
skippar redan synliga celler endast samma owner/frame.37/4 fog/visibility/team/
spectator PASS; uniontest täcker ground/air/occluders/order/removal. Ny mätning
64:60.0FPS/9.4ms,128:50.9FPS/18.9ms (150+ frames, efter30warmup). Baseline/efter
JSON och testscript sparade; ingen allhårdvaru-/helmatch-/paid-armyclaim.

Slutlig unit461/83 PASS15.51s, build med strict typecheck PASS508ms, befintlig
bundlevarning; diff/manifest PASS. Extra slutchecks efter faktisk perf-fix, inte
omotiverade fullregressioner.178 CI37350880157 ännu in_progress vid avläsning;
176:s37346778616 är success.179 Done teknisk granskning med explicit humanpending;
180 nästa. CSS SHA95c372…a5e/docs bevarade.

## 2026-10-05 — RTS-180 release0.3.0, lokal slutkontroll

Gemensam releaseVersion0.3.0, package/lock synkade; changelog redovisar faktisk
kampanj/AI/lag/order/PRIO/fog-utveckling och bevarar0.2.0/0.1.0. Versionsinvariant
test använder Vites rawimport utan nya Node-typdeps. README/HANDOFF anger aktuella
spelregler, Save51, legacy-map/goalbevarande, spectator och kvalitetsbegränsningar.

Sent reviewfynd: highscorevalidatorn använde gamla Arena för Forest Watch/Siege/
Outpost. Minimal fix accepterar authored nya map från rule51 och historiska
scenariokartor, utan ändrad scoremodell/dedup. Tre nya isolerade result/store-
regressioner och faktisk Frontier-scorepost i browser; riktade29/3 PASS727ms.
Releasebrowserassert kräver exakt en lagrad match-ID-post (inte bara identisk/null
storage). Terminalfixture är completed phases, inte paid playthrough.

Första fullregression1455/176 PASS408.19s var före scorefix. Ny full slutregression
**1458/176 PASS415.95s**, slutlig unit **465/84 PASS10.76s**, build inklusive strict
typecheck **PASS388ms**, befintlig bundlevarning, manifest/länkar/diff PASS.
Omkörningen motiveras av konkret ny scorekod/test, inte docs. Ingen ytterligare
full körning planeras för ren publiceringsdokumentation.

Final lokal production0.3.0/Build686c1e6 (build från precommitHEAD) på exakt
Pages-base PASS i fyra viewport/mode-cases: native800/1280 och native/fit800 i
1600fönster. Sex renderresolutionval; helHUD-resolution skiljs från kartcanvasens
clientstorlek. Fysisk fullscreenEnterExit bevarar val. CampaignSaveLoad paused/
phase0, pauseclockfrys, completed-phase victory/result/replay, faktisk score en
gång/frozen ended, skirmishdefeat, humanSpectatorTeamSaveLoad/finalteamDefeat/
statistik och menu som rensar live state, samt reload/version/displayprefs.
34 assetURLs,18 audiofiles, inga HTTP-/browserfel. scripts/check-release.mjs och
artifacts/rts-180/local/browser.json + åtta PNG; representativa native800 victory
och fit teamstats visuellt granskade. Paid campaigncompletion återanvänds från179,
inte från resultatfixtures.

Oförändrad Pages-workflow läst/verifierad: npmci/fulltest/build/dist/Pages OIDC,
Vitebase/HTML assets under/warcraft-2-tribute/. Ingen hostingändring.178 actual
CI/Pages37350880157 SUCCESS,17937352527511 SUCCESS.180 releasepush/public browser
är återstående;180 är därför ännu inte Done. Publicering kräver denna verifierade
kodpush först, därefter docs-only slutstatuscommit. Ingen force/amend/historyrewrite.
CSS SHA95c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e och docs/
bevaras/undantags från commits. Lokalt ändrad userCSS ingår inte i publicerad CSS.
Mänsklig tid/balans/fun/mixlyssning/finalvoice/flyerassets återstår enligt179.


## RTS-180 — avslutad publiceringskontroll, 2026-10-05

Releasecommit6a96227 pushad utan force. Faktisk [CI/Pages37355621323](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37355621323) SUCCESS: full test620s, build och deploy gröna. Publicerad sida visar v0.3.0 / Build6a96227. Fyra public-browserfall Native/Fit passerar kampanj/save/load/result/replay, skirmishdefeat, lag-spectator/save/defeat/statistik, pause/menu cleanup, resolutionsval, fullscreen och reload.34 asset-URLs/18 ljudfiler per fall, inga HTTP-/browserfel. Första800-kontrollen hann först bara nio ljudförfrågningar; kompletterad kontroll väntar uttryckligen på alla18 och passerar. Ingen spelkod ändrad för detta. Publicerade resultatvyer visuellt granskade. [Mätprotokoll](artifacts/rts-180/public.md).

Terminala mål/eliminering är fixtures, inte mänsklig genomspelning.179:s betalda åtta Beginner/Normal-genomspelningar är separat belägg. Mänskliga20–40min/timing/balans/fun/lång mixlyssning och tidigare slutliga flygar-/voiceassets återstår. Dessa markeras inte verifierade. Tidigare pending-publiceringstext ovan beskriver läget före releasepush och ersätts av denna slutstatus.

Slutlig kodverifiering: full1458/176 PASS415.95s, unit465/84 PASS10.76s, strict typecheck/build PASS388ms, diff/manifest/länkar PASS. Slutöverlämningen ändrar endast Markdown; ingen ny test/build-körning, beläggen återanvänds för oförändrad kod. HANDOFF/BACKLOG/README/QUALITY_REVIEW uppdaterade, stopp efter180 utan nya tasks/karteditor. UserCSS/docs bevaras och ingår inte i publicerad kod.


## 2026-10-05 — RTS-181 startinställning

Avgränsad senaste begäran: ändrat defaultDisplaySettings från1280×720/Native
till1920×1080/Fit. Sparade preferenser och legacy-migrering bevaras. Nytt
regressionstest för första start och återbesök med sparat800×600/Native.
RTS-180 kontrollerad som Done via BACKLOG/HANDOFF, inga historiska checks
redovisas som nya. Användarens style.css/docs bevarade och ingår inte i commit.

Ny verifiering: riktade display/preferences10/2 PASS; npm run test:unit466/84
PASS9.53s; npm run build inklusive strict typecheck PASS (befintlig bundlevarning).
Lokal Chrome800×600/1920×1080: färsk1920×1080/Fit, appgeometri, sparat
800×600/Native och reload PASS utan pageerrors. Lokal extern browserscript
/tmp/w2t-browser-check/default-display.mjs. Ingen full match-/kampanjregression
för denna defaultändring; ingen ny CI/Pages eller visuell screenshotgranskning.
Kod/docs granskade; git diff --check före commit.


## 2026-10-05 — RTS-182

RTS-182 klar. Riktade9/3, unit466/84, strict build och diff PASS. Chrome800/1920 verklig home/skirmish/HUD PASS,800bild granskad. Befintlig bundlevarning; ingen ny CI/Pages.182–187 registrerade utan att skriva över181. CSS/docs bevarade.


## 2026-10-05 — RTS-183

RTS-183 klar: tabell/filter och explicit legacydatum. Riktade23/3, unit467/84, strict build/diff PASS. Chrome800 verkliga filter och tomlägen PASS; screenshot granskad.182 push90df09f. Ingen ny CI/Pages/full campaign.


## 2026-10-05 — RTS-184

184 klar. Display/preferences11/2+camera10/2, unit468/84 och strict build/diff PASS. Chrome800/1920/3440/3840 input/minimap/fullscreen/windowreload PASS,3440 screenshot granskad. Kort≈60FPS i startmatch, inget generellt stresstest.183 pushc3f691b. CSS/docs bevarade.


## 2026-10-05 — RTS-185

185 klar: fem egna åttauppdragsserier, scoped progression, Save52 och highscoreseries. Riktade88/6, unit468/84, strict build/diff PASS. Chrome1920 fem starts/SaveLoad plus Human/Beginner terminalfixture/isolation PASS; bild granskad. Två harnessfel rättades (Resume-frame och dubbel freeze noop); slutkörningen använder ordinarie Scene.update. Ingen betald40-kampanjgenomspelning/mänsklig balansclaim.


## 2026-10-05 — RTS-186

186 klar.138/12 riktade och unit468/84/strict build/diff PASS. Chrome fem raser×800/1920/3440 staged flow/briefing/SaveLoad och hotkeys PASS, positiv B-kontroll PASS med explicit100wood-fixtur.800briefing granskad. scripts/check-campaign-menu.mjs gör flödet reproducerbart med extern Playwright/Chrome. Testfixturers saknade reserved/enemies/owner rättades före PASS. All40 taktiska krav testade; tillåtna queues betalas i riktade tester, ingen full40-/mänsklig balansclaim.185 push7b7e9fc.

186 beläggskorrigering: positiva B-kontrollen hade0wood, så affordability spärrade även det tillåtna kommandot. Före kontroll används explicit100wood, återställd till0 före Save. Slutlig fem raser×800/1920/3440 Chrome PASS inklusive positiv B→Escape och negativa hotkeys. Ingen gameplaykod ändrad; unit/build från186 återanvänds, scriptsyntax/diff kontrollerad. Föregående rapport påstod positiv PASS innan output granskats; denna omkörning är det faktiska belägget.


## 2026-10-05 — RTS-187

187 implementation: defaultSkirmish/capacity/directtwoAI, grupperade inställningar/rasbeskrivningar, separat AI2difficulty/Save53 och synliga highscorerostergrupper. Riktade127/7 PASS. Native Chrome800/1920/3440 verklig2AIstart, olika beginner/hard/profile/team, separata baspositioner, SaveLoad, HUD/fysisk worker/minimap och kampanjretur PASS;800/1920bilder granskade. Kampanjbrowser fem raser×3storlekar återkontrollerad efter omgruppering PASS. Första browsergoto networkidle-timeout räknas inte som PASS; domcontentloaded+faktiska UI-actions/inga pageerrors passerar. Första slutregressionen avbröts för konkret reviewfynd: scoregrupper med olika AI-config hade samma synliga rubrik. Ny slutregression på rättad rubrik pågår; ingen avbruten körning räknas som PASS. Användarens CSS/docs bevaras.

Slutlig highscorebrowser800×600/Native PASS: mode/map/difficulty/empty/Unknown-date, samt faktisk multiplayergrupprubrik AI2:Goblins/hard/Offensive. Tabellen scrolled into view och visuellt granskad. Scripts/check-highscore-menu.mjs återger seed/filterflödet; den skriver endast testbrowserns isolerade localStorage.

Slutlig187: unit468/84 PASS10.28s, strict build PASS360ms, full regression1489/178 PASS419.51s. Manifest84/94, diff/länkar/browser-script-syntax PASS. Actual browser SaveLoad→explicit victory→PlayAgain→menyreplay visar rätt campaign-ID/Beginner/mission-one-policy, oförändrad progression, bara current/completed och exakt en highscore. Replayharness i scripts/check-campaign-replay.mjs. Ingen spelkod ändrad efter slutchecks; tillkomna browserharness-filer syntaxkontrollerade separat. Docs uppdaterade före commit. Ingen ny CI/Pages hävdas; RTS-180 är historiskt Done. Fas182–187 avslutad; inga nya tasks påbörjas. CSS SHA256 fortsatt95c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e och docs/ undantagna från commits.

## 2026-10-05 — Dropdownregression efter RTS-186/187

Rättat framevis reparenting i kampanjflödet och upprepade disabled/value-skrivningar på setup-selects. Native popup stängdes av disabled-skrivningen även när värdet var oförändrat; synkning ändrar nu endast faktisk skillnad och lämnar öppet preliminärt val ifred. Skirmishens difficulty-label skrivs bara vid textändring. Browserharness scripts/check-native-dropdowns.mjs använder synlig Chrome, fysisk öppning och :open efter600ms med ordinarie sceneuppdateringar;800/1280 kampanj/skirmish ras/svårighet PASS. Värdepersistens verifieras separat med selectOption; faktisk klickad popup-rad är inte verifierad av harnessen. Tidigare RTS-browserbelägg med selectOption fångade inte native-popupfelet. Headless :open samt syntetiska tangenttryck i macOS-popup fungerade inte som testmetod; de misslyckade harnessförsöken räknas inte som PASS.

Ny unit468/84 och build inklusive strict typecheck PASS; diffkontroll PASS. Ingen gameplay-/saveändring eller bred campaign/fullregression; tidigare187-fullregression är historisk. Användarens style.css/docs bevarade. Ingen ny CI/Pages-verifiering hävdas.

## 2026-10-05 — AI-antal utan extra genvägsknapp

Användarens rapport: extra två-AI-knapp kvar och AI-dropdown utan val. Knappen och dess handler borttagna. Skirmish-dropdown erbjuder alltid You+1/2AI; två AI på karta utan tredje start väljer Plains96 i samma optionsändring. Text förklarar kartbytet; Survival behåller fasta starter och dold antalväljare. Inga startpositioner/AI-/Save-format ändrade.

Ny unit468/84 PASS, riktade session/multiplePlayers/matchSettings97/4 PASS och build inklusive strict typecheck/diff PASS. Chrome800/1920/3440: knapp saknas, dropdown3→Plains96→AI2config→faktisk tvåAIstart med skilda baser/difficulty/profile/team→SaveLoad PASS. Synlig native Chrome800/1280: kampanj/skirmish ras/svårighet samt AI-antal-popup förblir :open efter600ms; separata selectOption-val består. Första parallella browserkörningen tappade fokus och räknas inte som PASS; ensam omkörning PASS. Faktiskt klick på OS-popup-rad automatiseras fortfarande inte.800-bild granskad.

Review rättade kapacitetstexten så Survival inte erbjuder kartbyte; build omkörd efter textändringen, passerade unit/integration återanvända. CSS SHA25695c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e/docs bevarade. Ingen ny fullregression/CI/Pages hävdas, inga senare tasks startas.

## 2026-10-05 — RTS-188

Permanent HUD-sidebar borttagen från layout i separat matchWorkspace.css; användarens style.css orörd. Mission-topbar öppnar pausad undermeny med befintlig mission/tutorial/operation/status, tech-tree/command-guide under Menu. Transient feedback/warnings bibehålls ovan kartan; actions/minimap oförändrade. Back/Escape återgår till pausmenyn och Resume fortsätter matchen. Browser Native800/1280/1920 samt Fit800 PASS (scripts/check-match-workspace.mjs), full kartbredd/mission/tech/paus/resume och inga pageerrors. Native800-bild visuellt granskad. Riktade11/3, unit468/84 och strict typecheck/build/diff PASS. Ingen gameplay/full campaign-simulering behövs för denna DOM/layoutändring. Docs före commit; CSS/docs bevarade.189 grafikinventering påbörjad; imagegen används för transparenta sprites, stilantagande detaljerad pixelgrafik medan användarens val är frivilligt.

## 2026-10-06 — RTS-189

Användaren accepterade bildstilen (“bilderna ser bra ut”). Åtta imagegen-källark i assets/sources/visual-refresh: fem fulla landrosters, byggnader, sjö och flyg. Source-ark packas reproducerbart efter native assets:5840 land-,180 complete/damaged byggnads-,2080 sjöframes och1280 nya flygframes. Runtime/preload/porträtt/actionikoner använder air-atlas, TEMP-text borttagen. Source-bounding boxes, disconnected grannfragment och transparenta kanter rättade i konkret visuell review; ingen gameplay-/Save-/balansändring.

Riktade art33/6 och runtime37/4 PASS; slutlig unit473/85 PASS10.05s och strict build/diff PASS. Actual Chrome fem flygare×800/1280: paid UI production, elevated selection, flight over building, Save/Load/full queue/restart PASS. Native1280-gallerier alla fem roster/byggnader, båda teams, alla atlasnycklar PASS och visuellt granskade efter beskärningsfix. Browserharness scripts/check-refreshed-art.mjs och check-air.mjs (separat W2T_AIR_ARTIFACTS för nya artefakter). Ny Playwright-testmiljö återställd efter miljöbyte; saknad-modul-körning räknas inte som PASS.

Äldre art-tester jämförde bytevis med ersatta155-kodsprites och krävde begränsad palett. Source-jämförelser följer nu den godkända rasteradaptern; clip/alpha/HP/ankare/footprint/facing-nyckel/anim/team/unik-roll-kontroller består. Den utökade källpaletten tillåts för nya motiv; foundation/building behåller native-palettkontroll. Nya airAssets5fall validerar faktisk alpha/frame/timing/team för alla flygare. Befintlig8-perspektiv-unikhet ersätts av minst4 speglade/skuggade vyer, uttryckligt enligt källprotokollet: grundposer är SE, inte åtta separat målade riktningar. Work/attack/death är adapterade; fyra riktiga flygposer och två walkposer. Native construction/walls/gates kvarstår. Dessa kvalitetsgränser redovisas, ingen full authored8direction-claim. Ingen ny CI/Pages eller mänsklig balans-/ljudclaim. CSS/docs bevarade.

## 2026-10-06 — RTS-190 verifiering

Ny built-in imagegen-djurbild med spotted deer, ivory rabbit och bushy-tail fox, följd av transparent-background extraction. Vald RGBA-master visual-refresh/wildlife.png; dold bakgrunds-RGB har alpha0 och exporteras inte.18 nya poses i befintliga32px/anchor16,24. Ingen wildlife-logik, timing, Save, fog, ljud eller ekonomi ändrad. Browser Native800/1280 fysisk inspection/tre cues/rate limit/hunt/damage/death/no score/resources/SaveLoad/restart/warship hunt PASS; deer/rabbit/fox-bilder visuellt granskade. Faktisk ljudlyssning har inte utförts på nytt.

Riktade wildlife15/3 PASS, slutlig unit476/86 PASS10.18s och strict build PASS328ms. Första unitsviten stoppades av gammalt globalt palette-only-worldkrav; native terrain/resource-palettkontrollen behålls och endast de18 nya djurframes tillåter sina källfärger. Nya wildlifeSprites3fall kontrollerar samtliga18 faktiska rasters: alpha, clip, sex olika poses/species och färgdetaljer. Harnessen använder W2T_WILDLIFE_ARTIFACTS för nya screenshots/loggar, gamlaPRIO04-artefakter orörda. Fullregression körs; inget PASS hävdas ännu för den.

190 slutlig: fullregression1497/180 PASS391.02s. Reproducerbar full assetexport16 PNG/JSON bytevis oförändrade PASS; passerad unit476/86/strict build återanvänds efter export utan kodändring. Diff/syntax/manifest86/94 och Markdown-/assetreferenser PASS. HANDOFF/QUALITY_REVIEW/AGENTS uppdaterade; etappstopp efter190, CSS/docs bevarade. Ingen ny CI/Pages/ljudclaim.

## 2026-10-06 — RTS-191

Frontier: alla142 crownceller har individuella resurs-ID:n (faktiskt antal i artifacts/rts-191/browser.json),32px blockerande footprint, separata lager och single-tree sprites. Selection visar wood/assigned/active samt onåbarhet. Befintlig pathfinder/last/leverans/service återanvänds; nåbart nästa träd, träddöd öppnar mark med en gemensam revision. Fogmemory är per träd; Save54 validerar ID/position/stock och bevarar äldre grovelayout. Ingen ändring av CSS/docs eller övriga kartlayouter ännu.

Riktade65/7 PASS; slutlig unit471/85 PASS13.76s, build med strict typecheck och diff PASS (befintlig bundlevarning). multipleResources klassad integration eftersom den innehåller MatchState/Save. Chrome Native800/1280 fysisk flera-träd-selection/gather/uttömning/öppnad mark/SaveLoad PASS; före/efter och gruva/berg/kust i artifacts/rts-191.1280skogsbilder visuellt granskade. Under första checks rättades legacyfixture, extra-node-workerantal och browserharnesssyntax; de felkörningarna är inte PASS. Stor-karta-prestanda/full regression återstår vid194. Ingen CI/Pages/ljudclaim.

## 2026-10-06 — RTS-192

Frontier-gruva96×96 med entré/timmer/rails/malm och nordvästljus; större visuell polygon, oförändrad40×40 work/collision. Rocktiles bildar gemensamma ovansidor och mörk syd/östsida. Render-y sorterar workers framför/bakom gruva och träd utan att överskrida air/effect/overlay. Save55 migrerar54 presentation utan koordinatbyte.

Riktade18/3, unit471/85, strict build/diff PASS; Chrome Native800/1280 gruvpolygonselection, fysisk gather/extraction, verklig render-depth framför/bakom, tree SaveLoad och skog/gruva/berg/kustbilder i artifacts/rts-192.1280 gruvbild visuellt granskad; workers synliga i entré och bakom krönet. Första bildharness lämnade pausmeny över motiv, och övre mineclick träffade en worker enligt normal prioritet: korrigerade harness och bilder innan leverans. Före i artifacts/rts-191, efter i192. Ingen collisionändring eller bred campaignkontroll behövs i denna task.

## 2026-10-06 — RTS-193

Alla nio kartor (arena/forest/river/islands/frontier/plains96/plains128/highlands/coast), därmed alla kampanjers återanvända kartor, får samma faktiska reference-terrain-renderer, gruvor och individuella woodtrees. Forest Pass dekorativa21tile forest-rock ersätts av21st10wood-träd; ursprungliga stocks består, ny tydligt räknadtotal710wood. Övriga rock/waterlayouts och dimensions oförändrade. Jordcache utgår från actual resources; Save56 stöder tidigare geometri. Historiska Save-tester måste nu rekonstruera dåtidens kartfält/footprints före versionering; befintliga migration- och recipe/ID-assertions består.

Riktad kart/nav/save73/6 PASS32.48s; objectives/phase/operation/legacy/far-map60/5 PASS19.26s. Slutlig unit471/85 PASS11.30s, build inklusive strict typecheck och diff PASS (befintlig bundlevarning). Första checks fångade tom extraNodes-array, gammal presentationstext och moderna fält i historiska fixtures; rättade, inte räknade som PASS. Chrome1280 samtliga nio starts och physical SaveLoad PASS;36 actual-size skog/gruva/berg/kustbilder + browser.json i artifacts/rts-193. Forest Pass-skogen och Shattered Coasts kust visuellt granskade. Ingen ny CI/Pages/fullregressionclaim;194 samlar slutkontroll och stor-karta-prestanda.

## 2026-10-06 — RTS-194 implementation och slutkontroll

Alla nio kartor är128×128/4096² med oförändrade32px tiles. Verkliga finite expansiongroves/mines, broken ridges, dammar och jordvägar; Islands nya stora hav/sydliga landmassa, Highlands ridge till nya sydgränsen. Originalstarts/koordinatmål består, Highland/Western Plains expansioner begränsas till nytillkommen mark. MAP_PHASE.md inventerar dimensions/bildbelägg. Save57 skiljer expanded från originalgeometri; äldre fixtures rekonstruerar originalvärld/fog/stock och scoped multiplayerhindren.

Inledande kontroller avslöjade per-ray fogindex-rebuild, globala per-tree placement-BFS, carrier-destination BFS-spikar, äldre dimensionsassertions och relabelade moderna Save-fixtures. Korrigerade med delade index/BFS/cohorts och statiska512px terrängchunks. Faktiskt uppmätt18worker-fall ledde till dessa ändringar; inga avbrutna/fallande checks räknas PASS. AI-kontroller hittade scout som tog över tillgängliga gatherers, gruventré täckt av nya träd, ranged scout som stannade före gamla centrumradien och frisk liten armé som recalled före lång kartpassage. Korrigeringar skyddar originalområden, väljer känd nåbar stock och följer verklig dispatchstorlek. Extra verifiering görs efter dessa konkreta fynd, inte som upprepning av tidigare godkänd kod.

Slutliga resultat redovisas nedan; misslyckade/avbrutna förkontroller är historik. Historiska191–193-kontroller ersätter inte194:s fullregression/browser/prestanda. CSS/docs bevarade.

194 slutlig riktad verifiering: multiplePlayers/enemyGathering/rally31/3 PASS19.38s; portar/statLedger10/2 PASS1.07s; fog/combinedArmy samt betald Forest Pass Normal15pass/37skip i3filer PASS16.85s. Slutlig unit472/85 PASS18.33s, build inklusive strict typecheck PASS414ms, befintlig bundlevarning. Native800/1280 Frontier-flow och nio kartors native1280-terrain/minimap/fysisk SaveLoad PASS på slutlig kod. Performance:793 träd,3/18 arbetande workers,~300 uppvärmda frames vardera: median3.8/4.1ms, p954.5/4.6ms,59.8/59.4fps. Kort faktisk Phaser-mätning, inte lång mänsklig match. Tidigare fullregressioner med blandad/äldre kod avbröts efter konkreta fel; slutlig fullregression pågår separat.

194 regressionen601.82s gav1526 PASS/2 FAIL i181filer. Endast två navalcontrollers återstod: Hard Human-soldatförlust under hamnbygge och Goblin-arméförlust vid The Crossing. Testflödena beställer nu ersättare genom enqueueProduction med faktisk kostnad/supply och väntar på transportkostnad; campaign använder ny verklig färjetur efter arméförlust, högst fyra anfall. Fiender, skadevärden, objectives, stock och Save-assertions ändras inte. Riktad Hard Human PASS och The Crossing PASS13.70s; misslyckat Overcharge-taktikförsök återtaget. Dessa är controlleranpassningar, inte bevis på oförändrad mänsklig balans. Ny sammanhängande fullregression körs efter teständringarna; unit/browser/performance återanvänds eftersom spelkoden är oförändrad, strict build körd på nytt PASS785ms.

194 slutlig fullregression: `npm test`1528/181 PASS523.12s. Slutlig unit `npm run test:unit`472/85 PASS18.33s återanvänds efter endast integrationscontrollerändringar; `npm run build` inklusive strict typecheck körd på nytt PASS785ms, samma spelbundle. Browser `check-map-phase`, `check-all-map-terrain`, `check-forest-performance` PASS på slutlig spelkod; inga spelkodsändringar efteråt. Manifest85/96, browserharnesssyntax, Markdownfilreferenser och `git diff --check` PASS. Egen diff-/kravgranskning av geometri/stock/fog/navigation/Save/rendering/AI och fixtures: inga kvarvarande blockerande fynd; mänsklig introduktions-/balans-/tidsgranskning och längre performance är inte verifierade.191036e306/192461597e/1931b06889 pushade;194 levereras i denna taskcommit och hash rapporteras vid push. Kartfas avslutad, inga nya tasks/karteditor. CSS SHA256 oförändrad, docs/ bevarad.

## 2026-10-06 — RTS-195

Separat matchWorkspace.css samlar sju byggknappar på en rad över1100px och två under; bottom-bar reserverar faktisk actionbredd. Befintlig style.css/docs bevarade. Chrome Native800/1280/1920 sju actions/radantal/labels/status PASS, screenshots i artifacts/rts-195;800bild visuellt granskad. Harnessen rättades efter syntaxfel och felaktigt överlappstest mot dold kö; felkörningarna är inte PASS. Unit472/85 PASS11.63s, strict build PASS375ms, diff PASS. Ren layout kräver ingen bred kampanjsimulering. Egen layout-/diffreview utan blockerande fynd. Nästa196 automatisk transportkontakt.
