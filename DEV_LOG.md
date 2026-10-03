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
