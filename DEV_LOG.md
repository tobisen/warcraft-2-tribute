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
