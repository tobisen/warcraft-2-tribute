# Backlog

## Current Focus

**RTS-100 – Gruppselection och produktionskö** — **Todo**.

RTS-001–090 är klara. Ny beställd roadmap091–120 följer nedan. 091–096 är levererade. Användaren har därefter sagt fortsätt; fortsätt återstående roadmap i ordning enligt taskvisa checks/commit/push.

Denna fil styr arbetet. En task åt gången. RTS-001–015 är historiskt färdiga;
RTS-016–060 är en ny, användarbeställd roadmap efter MVP. Ingen gammal backlog
har återuppstått. RTS-001–090 är nu implementerade och verifierade. Rollfiler innebär inte automatisk agentstart.

## Planeringskonventioner

- Status: Done för färdigt arbete, Todo för planerat och In Progress för aktuell task. P0 = nästa etapps grind,
  P1 = kärna i tribute-målet, P2 = senare komplettering/presentation.
  Priority ändrar inte beroendeordningen; blockerande prerequisites går först.
- Storlek: S = en liten slice, M = flera samverkande beteenden, L = måste delas
  i verifierbara subtasks under samma ID. Det är relativa uppskattningar, inte
  timmar/löften. Historiska storlekar är retrospektiva, inte tidsrapporter.
- Primary Chat anger taskens avsedda arbetschatt/överlämningsetikett. Inga nya
  chattar har skapats och inga chattlänkar finns; fältet är inte agentkonfiguration.
- Dependencies är task-ID:n som ska vara Done före start. Öppna beslut i
  DECISIONS tas inom angiven task innan berörd kod; scopeändring kräver ny plan.
- Gemensam DoD: relevanta beteende/regressionstester, `npm test`,
  `npm run typecheck`, `npm run build`, beskrivet browserflöde och diffgranskning.
  Redovisa ej utförda browserchecks. Uppdatera docs/DEV_LOG före Done.
- Alla nya system ska återställas av restart och respektera game-over-stopp;
  nya reset-regressioner ingår i respektive task. UI får inte ge gameplay-orders.
- Balansvärden är preliminära tills speltestade; inga assetbyten före etapp 6.
  Full dynamisk unit-collision, multiplayer, backend, sjöstrid, andra fulla
  fraktionen, procedural generation och modding ingår inte i denna roadmap.
  Releaseverifiering innebär lokal build/testning, ingen deployment.

## Roadmap och ordning

| Etapp | Tasks | Leverans/grind |
| --- | --- | --- |
| 1 – Stabilisering och navigation | RTS-016–024 | Verifierad MVP, HUD, handgjord karta, nåbara orders och säkert basbygge. |
| 2 – Kontroller och basbygge | RTS-025–034 | Kamera, byggnadsorders, guld/trä, byggtid, population, köer och förstörbara mål. |
| 3 – Armé och combat | RTS-035–040 | Autoattack, attack-move, archer/catapult, uppgraderingar och balanserade strider. |
| 4 – Fiendebas och skirmish | RTS-041–046 | Budgetstyrd enemy AI och separat skirmish-scenario. |
| 5 – Överblick och spelkontroller | RTS-047–052 | Minimap, fog/synlighet, grupper, hotkeys, pause och scenario-val. |
| 6 – Presentation och release | RTS-053–060 | Egna assets/ljud, tre uppdrag, lokal save/load och verifierad lokal release. |

Taskordningen nedan är topologisk. Etapperna anger målbild; detaljerade
Dependencies styr vad som måste vara klart. Etapp 1 detaljplaneras här;
Återstående Todo-tasks behöver konkretiseras före implementation utan nya task-ID:n.

## Historik: RTS-001–015


## RTS-001 – Initialize project structure

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** S (retrospektiv).

**Dependencies:** Inga task-prerequisites.

**Primary Chat:** RTS-001 – Initialize project structure (historisk taskreferens; chattlänk saknas).

**Verifierat 2026-10-01:** Installation med `npm ci`, `npm run typecheck` och
`npm run build` passerade. Lokal dev-start verifierades i Chromium: synlig
800 × 600-canvas, inga fångade runtime-, konsol- eller nätverksfel. Skärmbilden
granskades manuellt. Builden gav en icke-blockerande varning om bundle-storlek.

**Mål:** Etablera ett minimalt körbart projektskelett för det kommande spelet.
Tasken genomförs som separat implementation efter dokumentationsgrunden.

**Krav:**

- Initiera Phaser, strict TypeScript och Vite.
- Skapa en minimal webbläsarstart och tunn scene med placeholder-presentation.
- Lägg en enkel grund för separation mellan scene och framtida gameplay-logik,
  utan att implementera framtida system.
- Etablera och dokumentera kommandon för lokal utveckling, typkontroll och build.
- Bevara projektdokumentationen och anpassa den till faktisk struktur.

**Non-goals:** Movement, selection, gathering, buildings, combat och AI;
beslut om gridstorlek, koordinatmodell eller tidsmodell; färdig grafik;
save/load; multiplayer, backend, konton, procedural generation, modding och
deployment.

**Acceptance criteria:**

- Dokumenterad installation och lokal start fungerar från en ren checkout.
- En minimal Phaser-scene visas i webbläsaren utan rapporterade runtime-fel.
- TypeScript strict är aktiverat och typkontroll passerar.
- Produktionsbuild kan skapas med dokumenterat kommando; detta innebär ingen
  deployment.
- README beskriver verifierade kommandon och ARCHITECTURE faktisk struktur.
- Relevanta checks och manuell verifiering är redovisade; backlog och dev log
  är uppdaterade enligt Definition of Done i [AGENTS.md](AGENTS.md).

**Tester och verifiering:** Kör etablerad typkontroll och build, gör en manuell
smoke check av browserstarten och kontrollera dokumentationens filreferenser.
Lägg beteendetester om tasken inför logik som behöver dem; skapa inga tomma
tester eller tester som enbart speglar konfigurationen.

**Relevanta docs:** [README.md](README.md), [AGENTS.md](AGENTS.md),
[GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md),
[DECISIONS.md](DECISIONS.md) och [DEV_LOG.md](DEV_LOG.md).

## RTS-002 – First playable movement slice

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** S (retrospektiv).

**Dependencies:** RTS-001.

**Primary Chat:** RTS-002 – First playable movement slice (historisk taskreferens; chattlänk saknas).

**Verifierat 2026-10-01:** `npm test` (9 tester), `npm run typecheck` och
`npm run build` passerade. Chromium-kontroll verifierade högerklick,
ersatt mål under rörelse, exakt stopp, att vänsterklick inte ger kommando
och att kontextmenyn förhindras. Inga fångade browserfel. Skärmbilden granskades.
Buildens tidigare varning om bundle-storlek kvarstår och blockerar inte build.

**Mål:** Spelaren kan styra en synlig placeholder-enhet till ett nytt mål.

**Krav:**

- Högerklick på canvas anger mål i world pixels och ersätter föregående mål.
- Enheten rör sig rakt mot målet med hastighet i pixlar/sekund och delta i
  sekunder; stanna exakt vid målet utan overshoot.
- Förhindra kontextmenyn över canvas. Håll scenen tunn och movement-logiken
  fristående från Phaser.
- Dokumentera world pixels, framtida tiles 32 × 32 px och delta-baserad
  movement utan fixed timestep. Inför inget gridsystem.
- Inför en enkel unit-testlösning och dokumentera testkommandot.

**Non-goals:** Selection, pathfinding, hinder, karta, resurser, kamera, AI,
gridsystem, fixed timestep och save/load.

**Acceptance criteria:**

- En synlig enhet flyttar sig vid högerklick och följer ett nytt mål när
  kommandot ändras under rörelse. Kontextmenyn visas inte över canvas.
- Movement följer riktning och hastighet oberoende av uppdelning i tidssteg,
  hanterar samma start/mål och delta=0 samt stannar utan overshoot.
- Unit-tester, typecheck och build passerar. Browserkontroll redovisas ärligt.
- README, ARCHITECTURE, DECISIONS och DEV_LOG beskriver faktisk implementation.

**Tester:** Riktning/hastighet, stopp utan overshoot, samma start/mål,
delta=0 och motsvarande rörelse över olika tidssteg. Browser-smoke check av
högerklick, målbyte och förhindrad kontextmeny om miljön tillåter.

**Relevanta docs:** [AGENTS.md](AGENTS.md), [README.md](README.md),
[ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md),
[DEV_LOG.md](DEV_LOG.md).

## RTS-003 – Click selection

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** S (retrospektiv).

**Dependencies:** RTS-002.

**Primary Chat:** RTS-003 – Click selection (historisk taskreferens; chattlänk saknas).

**Verifierat 2026-10-01:** Alla 19 tester (10 selection, 9 movement),
typecheck och build passerade. Chromium verifierade omarkerad start, klickträff,
ring som följer enheten, kommandon endast vid markering, målbyte, avmarkering
utan stopp och återmarkering på ny position. Inga fångade browserfel.
Ringens skärmbild granskades. Tidigare bundle-varning kvarstår.

**Mål:** Markera den befintliga enheten med klick och ge kommandon till den.

**Krav:** Enheten börjar omarkerad. Vänsterklick på enheten markerar och visar
en enkel ring; vänsterklick på tom mark avmarkerar. Högerklick ger endast
move-command när enheten är markerad. Avmarkering ändrar inte pågående order.
Behåll målbyte och movement-beteende; håll selection-state fristående från
Phaser där praktiskt.

**Non-goals:** Dragselection, flera enheter, shift-selection, grupper och HUD.

**Acceptance criteria:** Klickträff markerar, tom mark avmarkerar och ringen
följer enheten endast när den är markerad. Omarkerad enhet tar inte emot nya
move-commands men fortsätter sin befintliga rörelse. Markerad enhet kan byta
mål. Tester, typecheck, build och browserkontroll passerar och docs uppdateras.

**Tester:** Klickträff/tom mark, kommandon kräver markering och avmarkering
bevarar move-order. Befintliga movement-tester ska fortsätta passera.
Browserkontroll av klick, ring, målbyte och rörelse efter avmarkering.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md),
[GAME_DESIGN.md](GAME_DESIGN.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).


## RTS-004 – Drag selection and group commands

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-003.

**Primary Chat:** RTS-004 – Drag selection and group commands (historisk taskreferens; chattlänk saknas).

**Verifierat 2026-10-01:** 36 tester passerade, inklusive alla 19 befintliga.
Typecheck och build passerade. Chromium verifierade klick, alla dragriktningar,
kantträff, tomt urval, skalad canvas-tröskel, ringar, gruppkommandon och bevarad
rörelse vid avmarkering. Inga fångade browserfel. Dragrektangeln granskades
visuellt. Tidigare bundle-varning kvarstår.

**Mål:** Markera och styra flera av tre synliga enheter med unika ID:n.

**Krav:** Bevara klickselection. Vänsterdrag visar en rektangel; vid release
ersätts selection med enheter vars centrum ligger inom rektangeln inklusive
kanten. Alla dragriktningar stöds. Drag under 5 screen pixels behandlas som
klick. Tom rektangel avmarkerar alla. Varje markerad enhet har en ring och
högerklick skickar samma move-command till alla markerade. Avmarkering bevarar
pågående rörelse. Selection-logik ska vara fristående från Phaser.

**Non-goals:** Shift-selection, formationer, collision avoidance, pathfinding,
kontrollgrupper och HUD. Enheter får överlappa vid samma mål.

**Acceptance criteria:** Tre enheter på separata startpositioner med unika ID:n;
klick och drag ersätter selection korrekt; tröskeln mäts i screen pixels;
ringar följer selection; gruppkommandon påverkar bara markerade enheter;
avmarkering bevarar order. Tester, typecheck, build och browserkontroll passerar.
Dokumentation beskriver faktisk implementation.

**Tester:** Alla dragriktningar, centrum på kant, flera/inga träffar,
ersatt selection, klick/drag-tröskel och kommandon bara till markerade.
Befintliga tester ska passera. Browserkontroll av klick, drag och gruppförflyttning.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md),
[GAME_DESIGN.md](GAME_DESIGN.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).


## RTS-005 – Simple wood gathering

Historisk slice: direkt kreditering har ersatts av leveransmodellen i RTS-006.

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-004.

**Primary Chat:** RTS-005 – Simple wood gathering (historisk taskreferens; chattlänk saknas).

**Verifierat 2026-10-01:** 50 tester passerade (14 gathering och 36 tidigare),
typecheck och build passerade. Chromium verifierade selection, approach,
gathering efter avmarkering, avbrott med move-order, återupptagen gathering,
faktisk uttömning av 100 wood och idle för alla arbetare. Saldotext och grå
uttömd nod granskades visuellt. Inga fångade browserfel. Tidigare bundle-varning kvarstår.

**Mål:** Befintliga placeholder-enheter fungerar som arbetare och samlar wood.

**Krav:** Synlig nod med 100 wood; högerklick på nod ger gather-order till
markerade arbetare. De går till noden och samlar inom 24 world pixels med
1 wood/sekund per arbetare. Wood krediteras direkt till gemensamt saldo.
Enkel text visar saldo och återstående mängd. Flera arbetare delar noden utan
negativ mängd; vid uttömning blir samlande arbetare idle. Ny move-order avbryter
gathering, avmarkering gör det inte. Gathering/order-state är Phaser-fristående
med numeriska inställningar i enkel config.

**Non-goals:** Bas, leverans, bärkapacitet, animationer, collision, pathfinding,
byggnader och ekonomi-UI utöver den begärda enkla texten.

**Acceptance criteria:** Hela flödet från selection och nodkommando till approach,
gathering, saldo och uttömning fungerar. Ingen insamling utanför räckvidden;
resursöverföring bevarar totalen och orderbyte fungerar. Tester, typecheck,
build och browserkontroll passerar. Direkt kreditering dokumenteras som
slicespecifik förenkling.

**Tester:** Räckvidd, mängd över tid/olika tidssteg, flera arbetare med begränsad
mängd, saldo kontra nodminskning, uttömning och orderbyte. Tidigare tester ska
passera. Browserkontroll av hela gather-flödet.

**Relevanta docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md),
[README.md](README.md), [DEV_LOG.md](DEV_LOG.md).


## RTS-006 – Base and wood delivery

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-005.

**Primary Chat:** RTS-006 – Base and wood delivery (historisk taskreferens; chattlänk saknas).

**Verifierat 2026-10-01:** Alla 61 tester, typecheck och build passerade.
Chromium verifierade sju turer per arbetare, uttömning av hela noden och
slutleverans med saldo 100 inom flyttalstolerans. Alla arbetare var idle med
last 0 efteråt, trots avmarkering. Bas, lasttext och sluttext granskades visuellt.
Inga fångade browserfel. Tidigare bundle-varning kvarstår.

**Mål:** Arbetare transporterar wood till en fast placeholder-bas.

**Krav:** Last högst 5 wood per arbetare. Gathering överför nod → last;
full last startar automatisk leverans. Inom 24 px från bascentrum överförs last
till saldo. Återgå till noden om wood finns. Vid uttömning levereras även
partiallast innan idle. Move avbryter loop men bevarar last; gather med full
last levererar först. Avmarkering påverkar inte loopen. Visa last vid arbetaren.
Phaser-fristående logik och numeriska värden i config.

**Non-goals:** Byggplacering, produktion, kostnader, fler resurser, pathfinding,
collision och manuell leveransorder.

**Acceptance criteria:** Synlig fast bas; saldo ökar bara vid leverans;
upprepade turer och slutleverans fungerar utan överfyllnad eller förlust.
Orderbyte och avmarkering bevarar last. Alla tester, typecheck, build och
browserkontroll av minst två turer samt uttömning passerar. Docs beskriver
leveransmodellen i stället för direkt kreditering.

**Tester:** Leverans först i räckvidd, full och delvis last, återgång och flera
turer, orderbyte/full last, totalbevarande mellan nod/laster/saldo. Tidigare
gathering-tester anpassas; andra tester ska passera.

**Relevanta docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md),
[README.md](README.md), [DEV_LOG.md](DEV_LOG.md).


## RTS-007 – Train workers from base

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** S (retrospektiv).

**Dependencies:** RTS-006.

**Primary Chat:** RTS-007 – Train workers from base (historisk taskreferens; chattlänk saknas).

**Verifierat 2026-10-01:** Alla 72 tester, typecheck och build passerade.
Chromium verifierade samla/leverera 20 wood, start med exakt kostnad, countdown,
spärrat dubbelklick, en ny idle/omarkerad arbetare efter produktion samt dess
selection, insamling och leverans. Knappinteraktion ändrade inte selection eller
order. Inga fångade browserfel. Knapp/countdown granskades visuellt.
Tidigare bundle-varning kvarstår.

**Mål:** Producera en arbetare från befintlig bas efter resursleverans.

**Krav:** Enkel knapp ”Träna arbetare – 20 wood”. Godkänd start kostar 20 wood
omedelbart och tar 5 gameplay-sekunder. En pågående produktion, ingen kö;
blockera start vid otillräckligt saldo eller upptagen bas. Visa återstående tid.
Spawn nära basen med unikt ID, tom last, idle och omarkerad. Nya arbetare
stöder befintlig selection, movement och gathering/leverans. Knappinteraktion
ska inte ändra selection eller ge order. Phaser-fristående produktion och configvärden.

**Non-goals:** Produktionsbyggnad, byggplacering, stridsenheter, produktionskö,
avbrytning/refund, rally point och population cap.

**Acceptance criteria:** Start blockerad/med exakt kostnad, countdown i gameplay-
tid, en spawn först vid färdig produktion; upprepade produktioner har unika ID:n.
Ny arbetare kan väljas och samla/leverera. Knappen är isolerad från spelinput.
Alla tester, typecheck, build och browserflödet samla → producera → välj → samla
passerar. Dokumentation beskriver implementationen.

**Tester:** Kostnad en gång, spärrar, spawn-tid/antal, olika tidssteg, unika ID:n
vid upprepning samt ny arbetares selection/gather/leverans. Alla befintliga tester.
Browserkontroll av hela flödet och knappens inputisolering.

**Relevanta docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md),
[README.md](README.md), [DEV_LOG.md](DEV_LOG.md).


## RTS-008 – Place a barracks

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-006.

**Primary Chat:** RTS-008 – Place a barracks (historisk taskreferens; chattlänk saknas).

**Verifierat 2026-10-01:** Alla 93 tester, typecheck och build passerade.
Chromium verifierade preview, snapping, ogiltiga platser/lågt saldo, Escape och
högerklick, exakt kostnad 40 vid placering samt max en barracks. Selection och
unit-orders bevarades. Inga fångade browserfel. Preview/byggnad granskades visuellt.
Tidigare bundle-varning kvarstår.

**Mål:** Spelaren placerar en barracks för levererat wood.

**Krav:** Knapp ”Bygg barracks – 40 wood” aktiverar placeringsläge med preview.
Övre vänstra hörnet snappas till 32 px-grid; footprint 2 × 2 tiles. Vänsterklick
på giltig plats placerar direkt. Helt inom världen, ingen överlapp med bas
eller resursnod. Ogiltigt visas tydligt utan debitering. Saldo kontrolleras vid
placering och kostnaden 40 dras exakt en gång. Escape/högerklick avbryter gratis.
Placeringsinput ändrar inte selection eller unit-orders. Högst en barracks.
Phaser-fristående regler, enkla configvärden och dokumenterad footprint-modell.

**Non-goals:** Byggtid, byggande arbetare, barracks-produktion, rivning,
pathfinding, unit-collision och generell byggmeny. Befintlig basproduktion bevaras.

**Acceptance criteria:** Preview med giltig/ogiltig status; korrekt snapping,
världsgränser och footprint-spärrar. Giltig placering debiterar exakt en gång.
Felplats, lågt saldo, avbrott och andra barracks ändrar inte saldo/byggnader.
Selection/order-input är isolerad. Tester, typecheck, build och browserkontroll
passerar; docs uppdateras.

**Tester:** Snapping/gränser, bas/nodöverlapp, kantkontakt, giltig kostnad,
ogiltig placering, otillräckligt saldo, avbrytning och max en barracks.
Alla befintliga tester. Browserkontroll av preview, placering och båda avbrotten.

**Relevanta docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md),
[DECISIONS.md](DECISIONS.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).


## RTS-009 – Soldier production from barracks

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-007, RTS-008.

**Primary Chat:** RTS-009 – Soldier production from barracks (historisk taskreferens; chattlänk saknas).

**Mål:** Producera en soldier som kan väljas och flyttas.

**Krav:** Knapp ”Träna soldier – 20 wood” tillgänglig efter barracks-placering.
Kostnad vid start, 5 gameplay-sekunder, en produktion per byggnad utan kö.
Bas/barracks kan producera samtidigt med gemensamt saldo. Återanvänd produktion
praktiskt. Soldier: unikt ID, idle, omarkerad, spawn utanför footprint inom
världen, visuellt skild från worker. Klick/dragselection och movement fungerar;
soldier kan inte samla/bära wood. Resursklick vid blandad selection ger workers
gather och bevarar soldiers order. UI bevarar selection/orders. Configvärden.

**Non-goals:** Combat, HP, fiender, rally point, kö, population cap, collision
och pathfinding.

**Acceptance criteria:** Korrekt kostnad/startspärr/tid/exakt en spawn,
parallella timers och unika ID:n. Spawn-position giltig, soldier tydlig och
styrbar, workers-only gather. Tester, typecheck, build och browserflöde
samla → bygg barracks → producera → flytta soldier passerar. Docs uppdateras.

**Tester:** Kostnad, startvillkor, tid, en spawn, samtidig produktion, unika ID:n,
giltig spawn nära även världskanter, selection/movement och blandade order.
Alla befintliga tester och browserkontroll.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md),
[README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

**Verifiering:** 104 tester passerade, typecheck och build passerade.
Chromium verifierade samla → bygg barracks → samtidig worker-/soldier-produktion
→ välj/flytta soldier, samt blandad selection och bevarade UI-orders utan fel.
Befintlig bundle-varning kvarstår. Nästa föreslagna scope är en första combat-slice;
ingen ytterligare task har skapats eller implementerats.

## RTS-010 – Manual soldier attack

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-009.

**Primary Chat:** RTS-010 – Manual soldier attack (historisk taskreferens; chattlänk saknas).

**Mål:** Markerade soldiers kan angripa en synlig stillastående fiende.

**Krav och acceptance criteria:** Högerklick på fiende ger soldiers attack-order och bevarar workers orders. Soldiers går rakt till melee-räckvidd, gör tidsbaserad skada och har HP. Fiende med 0 HP tas bort; attack mot dött mål blir idle; nytt move ersätter attack. Visa HP och städa renderobjekt vid död. Fristående gameplay-logik och configvärden. Alla tester, typecheck, build och relevant browserflöde verifieras; docs uppdateras.

**Non-goals:** Enemy AI, waves, game over och restart. Gemensamma non-goals gäller också.

**Tester:** Räckvidd, delta=0, skada över tidssteg, död, saknat mål, markeringskrav och orderbyte. Browser: producera soldier → angrip → fiende försvinner. Befintliga regressionstester.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

**Verifiering:** 113 tester, typecheck och build passerade. Chromium verifierade verklig insamling/produktion/attack och borttagna renderobjekt utan fel. Diff granskad utan blockerande fynd.

## RTS-011 – Simple enemy movement and attack

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-010.

**Primary Chat:** RTS-011 – Simple enemy movement and attack (historisk taskreferens; chattlänk saknas).

**Mål:** Fiender kan gå mot och skada soldiers eller spelarens bas.

**Krav och acceptance criteria:** Fiende väljer närmaste soldier inom config-aggro, annars bas. Rak approach och melee-skada; både sidor tar skada i samma steg. Döda soldiers tas bort och selection-rendering städas. Bas-HP visas. Fristående gameplay-logik och configvärden. Alla tester, typecheck, build och relevant browserflöde verifieras; docs uppdateras.

**Non-goals:** Avancerad AI, worker-/barracks-attacker, waves och game over. Gemensamma non-goals gäller också.

**Tester:** Approach utan skada utanför räckvidd, aggro/targetbyte, soldatdöd, basskada och samtidig död. Browser: fiende approach/strid och basens HP minskar. Befintliga regressionstester.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

**Verifiering:** 119 tester, typecheck/build och browserkontroll passerade. Fiende gick till bas, skadade den och besegrades av producerad soldier. Granskning rättade livstids-ID:n och uteslöt döda angripare.

## RTS-012 – Finite configured enemy waves

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** S (retrospektiv).

**Dependencies:** RTS-011.

**Primary Chat:** RTS-012 – Finite configured enemy waves (historisk taskreferens; chattlänk saknas).

**Mål:** En ändlig match med tydlig vågprogression och resurser för försvar.

**Krav och acceptance criteria:** Ersätt tillfällig fiende med ändliga config-waves i gameplay-tid. Unika enemy-ID:n, ingen dubbelspawn, visa våg/countdown. Tillräcklig wood-nod och första vågen ger tid att samla/bygga/producera. Befintliga 800 × 600-världen är MVP:s öppna arena. Fristående gameplay-logik och configvärden. Alla tester, typecheck, build och relevant browserflöde verifieras; docs uppdateras.

**Non-goals:** Oändliga waves, procedural generation och terräng/pathfinding. Gemensamma non-goals gäller också.

**Tester:** Spawn-gränser, flera passerade tider, tidssteg, unika ID:n, sista vågen och resursbudget. Browser: samla/bygga/producera före första vågen samt vågspawn. Befintliga regressionstester.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

**Verifiering:** 125 tester, typecheck/build och Chromium passerade. Verkligt försvar producerades före första vågen; första vågen spawnade och besegrades. Diff granskad utan blockerande fynd.

## RTS-013 – Defeat and game-over freeze

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-012.

**Primary Chat:** RTS-013 – Defeat and game-over freeze (historisk taskreferens; chattlänk saknas).

**Mål:** Matchen förloras när basens HP når 0.

**Krav och acceptance criteria:** Defeat vid bas-HP 0. Visa förlust. Stoppa hela simulationen och canvas-/produktions-/placeringsinput; rensa pågående gest/preview utan orders. Fristående gameplay-logik och configvärden. Alla tester, typecheck, build och relevant browserflöde verifieras; docs uppdateras.

**Non-goals:** Victory och restart. Gemensamma non-goals gäller också.

**Tester:** Bas-HP-gräns, stopp för gathering/movement/produktion/waves/combat och blockerad input. Browser: förlust, fryst state och avvisade gameplay-klick. Befintliga regressionstester.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

**Verifiering:** 130 tester, typecheck/build passerade. Chromium verifierade naturlig defeat (~101 s), fryst state, avvisad canvas/forcerad UI-input och rensad preview utan fel. Diff granskad utan blockerande fynd.

## RTS-014 – Victory after final wave

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** S (retrospektiv).

**Dependencies:** RTS-013.

**Primary Chat:** RTS-014 – Victory after final wave (historisk taskreferens; chattlänk saknas).

**Mål:** Vinst när alla ändliga vågor och fiender klarats.

**Krav och acceptance criteria:** Victory bara när sista vågen spawnat och inga fiender återstår. Defeat har företräde när båda villkoren uppstår samtidigt. Samma simulation/input-stopp som defeat. Fristående gameplay-logik och configvärden. Alla tester, typecheck, build och relevant browserflöde verifieras; docs uppdateras.

**Non-goals:** Nya objectives, extra banor och restart. Gemensamma non-goals gäller också.

**Tester:** Inte för tidig victory, sista fiendens död, simultan defeat/victory och fryst vinst. Browser: besegra hela vågserien och få victory. Befintliga regressionstester.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

**Verifiering:** 134 tester, typecheck/build passerade. Chromium spelade ekonomi, produktion och alla waves till victory vid ~124 s med bas-HP 240; simulation/input fryst utan browserfel. Diff granskad utan blockerande fynd.

## RTS-015 – Restart the complete match

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-014.

**Primary Chat:** RTS-015 – Restart the complete match (historisk taskreferens; chattlänk saknas).

**Mål:** En ny match kan startas från game over utan omladdning.

**Krav och acceptance criteria:** Restart-knapp efter vinst/förlust. Återställ hela gameplay-state, timers, ID:n, saldo/nod, bas-HP, enheter, waves, byggnader, selection, inputgest och presentation. Inga dubbla DOM-/inputlyssnare. Dokumentera hela spelgången. Fristående gameplay-logik och configvärden. Alla tester, typecheck, build och relevant browserflöde verifieras; docs uppdateras.

**Non-goals:** Persistens, deployment och grafikpolish. Gemensamma non-goals gäller också.

**Tester:** Ny oberoende initial state, restart från båda outcomes, ny ekonomi/produktion/placering och flera restart-cykler. Browser: vinst/förlust → restart → ny fungerande match. Befintliga regressionstester.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

**Verifiering:** 137 tester, typecheck/build passerade. Chromium: naturlig victory,
restart från båda outcomes, fyra cykler och ny faktisk ekonomi/placering/samtidig
produktion/movement passerade. Sex ytterligare fixture-cykler verifierade exakt
oförändrade DOM/pointer/keyboard-lyssnare och rena renderobjekt. Canvas-bounds-
regression efter DOM-layoutändring rättad och verifierad. Inga browserfel.
Slutdiff granskad utan kvarstående blockerande fynd. Alla docs/filreferenser kontrollerade.

## MVP-status efter RTS-015

RTS-001–015 är Done. Sex nya tasks slutfördes i denna körning. Befintlig MVP
kan spelas från ekonomi/produktion till waves och win/loss samt startas om.
Inga återstående tasks inom den avslutade MVP:n; den nya tribute-roadmapen nedan utökar målet. Avsiktliga begränsningar: öppen arena,
placeholders, manuell soldier-attack, rak movement/överlapp och enkel AI som
angriper soldiers/bas. Non-goals kvarstår; bundle-varningen är inte åtgärdad.
Den tidigare MVP-körningen omfattade inga ytterligare tasks, dependencies, commit eller push.
Planeringskörningen efteråt definierar RTS-016–060 nedan.

## RTS-016 – Manuellt MVP-speltest och regressioner

**Status:** Done.

**Verifierat 2026-10-02:** 137 tester, typecheck och build passerade.
Naturlig victory (~125 s) och defeat (~101 s), fryst input/simulation,
restart från båda och ny ekonomi/produktion verifierades i Chromium 147.
Scroll, radbrytning och sex ytterligare fixture-restarts passerade.
Inga blockerande regressioner hittades; protokoll i [DEV_LOG.md](DEV_LOG.md).

**Priority:** P0.

**Uppskattad storlek:** M.

**Goal:** Etablera en reproducerbar nulägesbaseline innan nya system införs.

**Dependencies:** RTS-015.

**Requirements:**

- Läs dagens regler/kod och speltesta normal start, ekonomi/leverans, placering,
  samtidig produktion, selection, combat, samtliga waves, båda outcomes och restart.
- Testa UI/canvas efter scroll, kontrollradens radbrytning och upprepade restarts.
  Använd riktiga resurser/tider i minst en hel vinst/förlust; märk fixture-kontroller.
- Registrera konkreta fel med repro, förväntat/faktiskt beteende och allvarlighet.
  Åtgärda endast bekräftade blockerande MVP-regressioner med beteendetester.
- Dokumentera reproduktionssteg, miljö och kända begränsningar; befintlig bundle-
  varning är ett känt fynd, ingen implicit optimeringsuppgift.

**Non-goals:** Nya features, navigation, balansändring eller grafikpolish.

**Acceptance criteria:**

- Ett daterat protokoll redovisar både naturlig victory/defeat, fryst simulation
  och ny fungerande ekonomi/produktion efter restart.
- Confirmed blockerande regressioner är rättade/verifierade eller tasken lämnas
  ofärdig med exakt hinder. Avsiktliga MVP-begränsningar skiljs från buggar.
- Dagens 137 tester är baseline, inte ett krav på oförändrat testantal. Alla
  checks passerar; browserresultat innehåller faktiska miljödata och utfall.

**Tester:** Bevara befintliga tester. Lägg endast regressioner som reproducerar hittade beteendefel; kontrollera ID:n, resursbevarande, outcome-prioritet och reset.

**Browserflöde:** Spela samla → barracks → flera soldiers → tre waves → victory; ny match utan försvar → defeat; restart båda gånger, resize/scroll och ge nya orders.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-016 – Manuellt MVP-speltest och regressioner (planerad implementationschatt).

## RTS-017 – Balansera ekonomi, produktion och waves

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** M.

**Goal:** Göra nuvarande wave-survival begripligt och möjligt att vinna med rimlig förberedelse.

**Dependencies:** RTS-016.

**Requirements:**

- Speltesta flera dokumenterade strategier: tidigt försvar, extra worker och
  passivt spel. Mät tid till barracks/första soldier, resursflöde och HP-förlust.
- Justera endast befintliga ekonomi-, produktions-, combat- och wave-configs.
  Dokumentera kandidater och den speltestade profil som väljs; framtida guld-
  och armévärden är fortfarande öppna.
- Säkerställ resurser för försvar och ersättning utan att ge oändlig ekonomi.
  Behåll ändliga waves, manuell attack och defeat-företräde.

**Non-goals:** Nya enhetstyper, autoattack, svårighetsval, ny ekonomi eller AI-regler.

**Acceptance criteria:**

- Minst två kompletta aktiva speltester vinner utan fixtures/tidsskalning;
  passivt spel demonstrerar faktisk risk för defeat. Strategier/tider redovisas.
- Kostnader/tider är icke-negativa, resource-budget och spawnförberedelse räcker
  för den dokumenterade strategin; automatisk vinst utlovas inte.
- Tests för gameplay-invarianter passerar även när balansvärden ändras.
  README:s faktiska siffror och designens preliminära balansprofil överensstämmer.

**Tester:** Budget, debitering en gång, spawn/timer, begränsad nod, normal wave-progression; avlägsna obefogade testantaganden om gamla balanskonstanter.

**Browserflöde:** Samla och vinn med vald profil, speltesta worker-investering och förlora utan försvar. Redovisa alla balansvärden som kandidater tills dessa tester passerat.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-017 – Balansera ekonomi, produktion och waves (planerad implementationschatt).

## RTS-018 – Tydlig HUD för resurser, HP, waves och produktion

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** M.

**Goal:** Ge spelaren tillräcklig information utan att behöva tolka överlappande placeholder-texter.

**Dependencies:** RTS-017.

**Requirements:**

- Visa levererat wood, basens HP, vågprogression/countdown och separat
  produktionstid/startspärr för bas och barracks. Visa begripliga skäl vid fel.
- Behåll minimalt DOM/Phaser-upplägg; samla presentation utan att flytta regler
  till HUD. Last/HP för markerade enheter får förtydligas med enkel text.
- Reservera tydliga ytor för controls/status så små viewportar och game over
  inte gör inputkoordinater fel. Alla UI-interaktioner är isolerade från orders.
- Gör budget/tid från config läsbara och visa game over/restart tydligt.

**Non-goals:** Fantasy-skin, minimap, byggnadsselection/command panel, fog eller nya gameplay-regler.

**Acceptance criteria:**

- Spelaren kan avläsa ekonomi, bas-HP, nästa wave och båda produktionsjobb
  samtidigt; varje spärrat kommando har ett begripligt skäl.
- UI-klick/keyboard-focus ändrar inte selection/orders. Nodklick träffar rätt
  efter resize/scroll, placeringspreview och game over/restart.
- Restart visar reset-data utan gamla labels/timers; viewportfallen från RTS-016
  har inga blockerande överlapp mellan HUD och aktiva kontroller.

**Tester:** Presentation av modellvärden/spärrskäl där meningsfullt; ekonomi/produktion och input/reset-regressioner. Inga snapshottester som bara speglar markup.

**Browserflöde:** Producera i båda byggnaderna, placera/avbryt, resize/scroll, klicka nod/enheter, spela till outcome och restart; kontrollera status/HP/knappar.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-018 – Tydlig HUD för resurser, HP, waves och produktion (planerad implementationschatt).

## RTS-019 – Handgjord tile-karta med terräng och hinder

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** L.

**Goal:** Lägga en enkel handgjord karta och ett testbart hinderkontrakt inför navigation.

**Dependencies:** RTS-018.

**Requirements:**

- Använd 32 × 32 world-pixel-tiles och en liten lokalt definierad karta med
  gångbar mark och blockerad terräng; placeholders tills RTS-053.
- Definiera tile/world-konvertering, bounds, fasta bas/nod-footprints och
  walkability-data fristående från Phaser. Ange hur 800 × 600-världens partiella
  nederkant hanteras; ändra inte godtyckligt till en större värld före RTS-025.
- Lägg startpositioner och enemy-spawns på giltiga platser i samma kartdata.
  Markera terräng/blockering tydligt utan att hitta på en fungerande pathfinder.
- Skapa data/kontrakt för hinderrevision inför senare ändrade byggnader. Beskriv
  tile-clearance och kandidatregler som RTS-020 måste fastställa.
- Håll dagens wave-survival spelbart under övergången: inga blockerade tiles
  får skära dokumenterade direkta MVP-rutter innan RTS-020–022 tar över dem.

**Non-goals:** Procedural generation, editor, pathfinding, kamera, fog och pixelassets.

**Acceptance criteria:**

- Konvertering/bounds fungerar på kanter och med ogiltiga koordinater enligt
  dokumenterad policy. Karta/footprints/spawn-data ger inga enheter inne i hinder.
- Hinder är synliga och querybara utan Phaser. Grid/world-data är samma källa
  för rendering och kommande navigation, med dokumenterad revisionsmekanism.
- Bas/nod/enemy-spawns och aktuella raka MVP-rutter är verifierat fria;
  normal match och restart fungerar. Navigation runt terräng påstås inte finnas.

**Tester:** Tile/world roundtrip, kanter/partiella tiles, walkability, footprint-rasterisering, start/spawn/route-fixtures och reset av kartstate.

**Browserflöde:** Se terräng/hinder, markera/flytta/samla längs bevarade rutter, bygg enligt nuvarande regler och verifiera wave-match/restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-019 – Handgjord tile-karta med terräng och hinder (planerad implementationschatt).

**Subtasks under samma ID:**

1. Fastställ kartdata/bounds och testa konvertering.
2. Rita placeholder-karta och förankra starts/footprints/spawns.
3. Verifiera övergångskartan, kartrevision/reset och dokumentera navigationens öppna val.

## RTS-020 – Pathfinding för move-orders

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** L.

**Goal:** Flytta enheter genom gångbar terräng utan att gå genom blockerade tiles.

**Dependencies:** RTS-019.

**Requirements:**

- Inför en enkel deterministisk pathfinder och waypoint-följning fristående
  från Phaser. Fastställ 4/8 grannar, diagonal-/clearance-policy före kod och
  dokumentera valet i DECISIONS; välj inga framtida algoritmer i förväg.
- Order-id/intention, destination, rutt och hinderrevision hålls tydligt isär.
  Nytt move ersätter gammal rutt. Följ waypoints med befintlig px/s och delta
  utan overshoot; förbruka resttid även när flera waypoints nås i ett steg.
- Avvisa blockerade/utanför/otillgängliga mål med strukturerat skäl och feedback,
  utan teleportering eller evig retry. Automatisk närmaste-fallback ingår inte.
- Vid ändrad hinderrevision validera/planera om återstående rutt från aktuell
  giltig position. Saknas ny rutt: stoppa säkert, behåll begripligt blockerat
  orderresultat och försök igen bara vid nytt kommando/relevant revision.
- Integrera endast move-orders för workers/soldiers. Testa ny rutt utan att
  ännu påstå att gathering/attack är navigationssäkra.

**Non-goals:** Gather-/attack-navigation, full dynamisk unit-collision, formationer, smoothing eller pathfinding-dependency.

**Acceptance criteria:**

- Nåbart mål runt testhinder nås med giltiga waypoints; enhetskroppens clearance
  och vald diagonalregel förhindrar corner-cutting genom hinder.
- Otillgängligt/utanför mål ger en tydlig avvisning utan blockerad förflyttning.
  Ett nytt giltigt kommando återställer normal rörelse.
- Modifierat hinder på aktiv rutt leder till omplanering eller säkert stopp;
  gammal rutt kan inte återupptas av ett sent resultat efter orderbyte.
- Likvärdig statisk rörelse över olika delta-steg slutar på samma destination;
  avmarkering och game over/reset bevarar tidigare beteende.

**Tester:** Nåbar/otillgänglig rutt, samma tile, världskanter, kropp-clearance, diagonala hörn, determinism, restdelta, ersatt order och revision efter mid-route-blockering.

**Browserflöde:** Flytta kring ett hinder, klicka otillgänglig plats, ge nytt mål, ändra hinder i märkt testfixture och observera omplanering/stopp; restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-020 – Pathfinding för move-orders (planerad implementationschatt).

**Subtasks under samma ID:**

1. Dokumentera grannar/clearance och bygg sökning med felresultat.
2. Integrera waypoint-följning i move-orders och feedback.
3. Inför revisionsvalidering/orderbyte och regressioner.

## RTS-021 – Navigation för gathering och leverans

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** M.

**Goal:** Bevara arbetsloopen när nod och bas har blockerande footprints.

**Dependencies:** RTS-020.

**Requirements:**

- Reservera nod/bas-footprints som hinder för workers arbetsrutter; välj nåbar
  arbets-/leveransposition utanför footprint med tillräcklig kropp-clearance.
- Planeringskontrakt: gathering/leveransräckvidd mäts till footprintens kant,
  inte centrum inne i blockerad byggnad. Dokumentera övergången från dagens
  centrumavstånd; balansräckvidd ligger fortsatt i config.
- Följ samma pathfinder/waypoints för approach, delivery och återgång med
  bevarad last, resursbevarande, uttömning, ny order och avmarkering.
- Välj annan nåbar kandidat om en kantposition är blockerad. Ingen kandidat/
  rutt ger säkert blockerat arbetsläge/feedback, inga uttag/depositioner på avstånd
  och ingen lastförlust. Revision/noduttömning/orderbyte validerar rätt destination.

**Non-goals:** Guld, nya drop-off-byggnader, slot-reservation mellan workers eller dynamisk collision.

**Acceptance criteria:**

- Workers går runt terräng och stannar utanför bas/nod; endast nådd giltig
  arbetsposition tillåter gather/deposit. Ingen byggnadsgenomgång förekommer.
- Full och partial last levereras, återgång fungerar och nod+last+saldo bevaras.
- Helt inringad nod/bas ger feedback/stopp utan ghost-gather eller tappad last;
  ändrade hinder eller ny order kan åter göra en nåbar position användbar.
- Nuvarande ekonomi/produktion och wave-match fungerar med hinder och restart.

**Tester:** Nåbara sidor, en/alla blockerade approach-positioner, ändrad rutt, full/partial last, depletion, orderbyte, restdelta och totalbevarande.

**Browserflöde:** Placera hinder mellan workers/nod/bas i karta/fixture, kör två leveransturer och uttömning; blockera drop-off och ge nytt move/gather utan lastförlust.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-021 – Navigation för gathering och leverans (planerad implementationschatt).

**Subtasks under samma ID:**

1. Testa nåbara arbetspositioner vid footprints.
2. Integrera alla arbetsloopens rutter.
3. Verifiera blockerade mål/revision, ekonomi och reset.

## RTS-022 – Navigation för attack-orders och enemy AI

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** M.

**Goal:** Göra pursuit och basskada möjliga utan att angripare går genom terräng eller byggnader.

**Dependencies:** RTS-021.

**Requirements:**

- Soldier-attack och enemy AI använder gemensam navigation till nåbar melee-
  position utanför targetfootprint. Soldiers/enemies har kroppsyta; bas har
  blockerande footprint. Attackrange mäts till målfootprintens kant.
- Rutt för attack följer target-ID och giltig position, inte en fryst pointer.
  Flyttat/förstört mål eller hinderrevision validerar rutt och omplanering.
- Begränsa replanning till dokumenterade target-/revisionstriggers; ingen
  obegränsad full sökning varje frame. Inget skadande genom terrängväggar.
- Saknas nåbar melee-position: ingen skada, säkert blockerat tillstånd/feedback.
  Enemy omvärderar giltiga mål enligt enkel dokumenterad AI-policy.
- Bevara simultan damage/outcome-prioritet, manuella soldier-orders och workers-
  orders vid enemy-klick. Finite waves måste fortfarande kunna nå försvar/bas.

**Non-goals:** Autoattack, attack-move, ranged units, line-of-sight-system och avancerad targettaktik.

**Acceptance criteria:**

- Soldier och enemy når mål runt hinder utan footprintintrång; skada sker
  bara från nåbar position inom kantbaserad räckvidd.
- Mål bakom stängd vägg skadas inte; öppnad rutt/revision åter möjliggör attack.
  Ett flyttat mål följs och ett dött mål rensar attack/rutt utan ID-återanvändning.
- Basskada, soldatdöd och defeat-företräde fungerar i full wave-match;
  game over/restart avslutar alla nya routes/replanningstates.

**Tester:** Pursuit kring vägg, flyttat target, inringad bas, kropp/range, ingen damage genom vägg, förstört target, retargeting, simultan död och reset.

**Browserflöde:** Angrip enemy kring hinder; låt wave nå/skada bas via öppning, stäng/öppna testväg, döda target och ge nytt kommando; spela outcome/restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-022 – Navigation för attack-orders och enemy AI (planerad implementationschatt).

**Subtasks under samma ID:**

1. Gemensamma nåbara melee-positioner/range-tester.
2. Integrera soldier pursuit och enemy-basmål.
3. Triggerstyrd omplanering och full wave-regression.

## RTS-023 – Gruppförflyttning med separata målpositioner

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** M.

**Goal:** Minska överlapp vid gruppkommandon utan att införa full unit-collision.

**Dependencies:** RTS-022.

**Requirements:**

- Fördela markerade enheters move till separata gångbara slutpositioner runt
  klickmålet, stabilt per ID och med configavstånd/kropp-clearance.
- Kandidater får inte ligga i terräng/byggnad/utanför världen eller vara
  otillgängliga från respektive start. Begränsa kandidatantal/sökområde.
- Vid platsbrist: flytta bara enheter med giltigt tilldelat mål och rapportera
  övriga som blockerade; använd aldrig samma mål som dold fallback.
- Befintlig klick/dragselection, nytt mål, avmarkering och mixed-unit-regler
  bevaras. Detta ändrar move-destinationer, inte gather/attack till formationer.

**Non-goals:** Full dynamisk collision avoidance, flocking, kontrollgrupper, formationstyper eller militär taktik.

**Acceptance criteria:**

- En grupp på öppen mark får distinkta nåbara slutpositioner och nås utan
  att ändra omarkerade enheters orders. Tilldelning är reproducerbar per ID.
- Kant/hinder/trång yta resulterar bara i giltiga mål eller tydligt blockerat
  resultat; ingen oändlig sökning och ingen tyst destination i hinder.
- Enheter får fortfarande överlappa under gång; dokumentationen lovar inte
  collision. Ny order och restart rensar gammal tilldelning/rutt.

**Tester:** Unika/deterministiska mål, fler enheter än platser, världskant, blockerade kandidater, individuell nåbarhet, orderbyte och omarkerade units.

**Browserflöde:** Flytta minst fem producerade enheter på öppen yta och vid smal passage/kant; byt mål mitt i rörelse, avmarkera och restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-023 – Gruppförflyttning med separata målpositioner (planerad implementationschatt).

**Subtasks under samma ID:**

1. Kandidatgenerering och stabil tilldelning.
2. Individuell nåbarhet och platsbrist.
3. Gruppinput/feedback och regressionsflöden.

## RTS-024 – Byggnader som hinder och säkra placeringsregler

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** L.

**Goal:** Låta spelaren bygga utan inträngda enheter eller avskurna nödvändiga arbets-/spawnvägar.

**Dependencies:** RTS-023.

**Requirements:**

- Rasterisera placerade bas/barracks-footprints i samma navigationshinderdata.
  Giltig placering uppdaterar ekonomi, byggnadsstate och hinderrevision atomiskt.
- Preview/klick använder samma validering: terräng/världsgräns, byggnader/noder,
  alla levande enhetskroppar (inklusive enemies), saldo och dagens max en barracks.
- Avvisa placering över enheter; flytta dem inte automatiskt. Kontrollera aktuell
  position/saldo vid klick, även om preview nyss var giltig.
- Testa hypotetiskt hinder före debit: bevara befintliga arbetarenheters tillgång
  till nåbar bas-drop-off och aktiv nod samt varje produktionsbyggnads nåbara
  spawn/utgång till gångbar yta och wave-entryns nödvändiga väg mot basområdet.
  Kontrollen ska inte kräva att redan otillgängliga områden blir nåbara.
- Spawn väljer ledig gångbar kroppssäker position utanför footprint. Om alla
  kandidater är blockerade håll färdig produktion väntande utan dubbel debitering
  eller extra spawn, med tydlig status; pröva igen vid relevant ändring.
- Aktiva routes omplaneras via revision; Escape/högerklick/ogiltig plats drar
  inga resurser eller ändrar selection/orders. Restart återställer hinderdata.

**Non-goals:** Flera barracks, byggtid, automatisk eviction, rivning, farms eller dynamisk collision.

**Acceptance criteria:**

- Preview och slutkontroll avvisar enhets-/footprint-/terrängöverlapp och
  avskurna nödvändiga vägar med skäl, utan saldo/hinder/byggnadsändring.
- Giltig placering debiterar en gång, blockerar footprint och invaliderar rutter;
  omplanering ger giltig rutt eller säkert stopp, aldrig passage genom byggnaden.
- Producerad unit spawnar utanför footprint inom världen på gångbar yta; blockad
  utgång visar väntan, frigjord utgång ger exakt en spawn utan ny betalning.
- Normal karta och wave-survival går att spela till outcome och restart;
  placerings-/hinder-/route-/produktionsstate är rent efter omstart.

**Tester:** Bas/nod/terräng/unitöverlapp, klick efter preview, partiella kanter, hypotetisk connectivity, arbetardrop-off, wave-entry, blockerad/fri spawn, revision och ekonomi-atomicitet.

**Browserflöde:** Försök bygga över worker och stänga nod-/bas-/spawnväg, bygg på giltig plats under pågående orders; blockera/frigör spawn och kontrollera en producerad unit samt restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-024 – Byggnader som hinder och säkra placeringsregler (planerad implementationschatt).

**Subtasks under samma ID:**

1. Gemensamma statiska/dynamiska footprints och revisionsintegration.
2. Preview/klick och hypotetisk connectivity med dokumenterad väglista.
3. Gångbar spawn/väntande produktion.
4. Wave-/ekonomi-/gruppregression och reset.

## RTS-025 – Större karta och kamerapanorering

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Spela på en karta större än viewporten utan ändrade world-orders.

**Dependencies:** RTS-024.

**Requirements:** Världen utökas till 1280 × 960 px med två ytterligare handgjorda terrängpatcher; viewporten är fortsatt 800 × 600. Zoom är 1. Mittenmusdrag panorerar begränsat till världen och får inte ändra selection/orders eller placera byggnad. Pan under vänsterdrag ignoreras. UI står kvar utanför canvas; worldPoint använder aktuell kamera. Game over stoppar pan; restart börjar vid (0,0).

**Non-goals:** Minimap, fog, zoomsystem utöver vald minsta policy och procedural generation.

**Acceptance criteria:** Kameran kan nå hela kartan men inte utanför bounds. Klick/drag/placement/move använder rätt world-position vid alla kanter; HUD står still. Restart återställer karta, kamera och input.

**Tester:** World/screen-konvertering vid samtliga hörn, begränsat drag även när viewport är större än världen, selection/placement i förskjutna koordinater, befintliga tester och browser-reset.

**Browserflöde:** Pan till motsatt hörn; flytta en vald arbetare dit, klick/drag-välj och bygg där. Pan tillbaka till resursnoden och samla. Kontrollera pan under preview, game over och restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-025 – Större karta och kamerapanorering (planerad implementationschatt).

## RTS-026 – Byggnadsselection och kontextuell command panel

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Styra vald byggnads tillgängliga kommandon utan att blanda dem med unit-orders.

**Dependencies:** RTS-025, RTS-018.

**Requirements:** Välj spelarens bas/barracks via footprint; visa rätt produktionskommandon och status. Unit-träff har företräde framför barracks och bas. Building/unit-selection är exklusiv: klick på tom mark eller drag rensar byggnadsval; byggnadsval avmarkerar units utan att stoppa orders. Markera vald footprint med gul ram. Endast vald egen produktionsbyggnad visar sin knapp/status; dolda knappar skyddas också i click-handler. Byggknappen för barracks är global. Behåll panelens utrymme så canvas inte hoppar; game over blockerar produktion och restart rensar val.

**Non-goals:** Rally, kö, hotkeys och fantasy-skin.

**Acceptance criteria:** Rätt commands/felorsaker visas för valt mål; tomt klick avmarkerar enligt dokumenterad policy. Panelklick skapar varken move eller ändrad selection. Selection-ID:n/reset är rena.

**Tester:** Träff/priority, övergång building/unit, tillåtna commands och reset.

**Browserflöde:** Välj bas/barracks, starta båda produktionerna och växla till units under kamerapan.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-026 – Byggnadsselection och kontextuell command panel (planerad implementationschatt).

## RTS-027 – Rally points

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Ge nyproducerade units en avsedd destination.

**Dependencies:** RTS-026, RTS-024.

**Requirements:** Rally lagras per spelarproduktionsbyggnad. Högerklick i building-selection sätter world-mål via navigation. Grön rallymarkör visas för vald byggnad. Ogiltig destination avvisas med text och behåller tidigare giltigt rally. Validera statiskt nåbar route från möjlig spawn-utgång, oberoende av tillfällig unit-occupancy. Ny unit spawnar giltigt och får rally-move; arbetare får inga implicita gather-orders i denna slice.

**Non-goals:** Attack-/gather-rally, formationsrally och kö.

**Acceptance criteria:** Olika byggnaders rally hålls isär; unit-selection ger fortsatt vanlig move. Blockerat rally/spawn ger tydlig policy och ingen footprintinträngning. Om senare hinder blockerar rally spawnar unit säkert men får blockerad route och väntar på ny order/hinderrevision; kostnad/spawn påverkas inte. Restart rensar rally/error.

**Tester:** Spawn+rally, blockerad destination, byggnadsvis state och inputisolering.

**Browserflöde:** Välj barracks, sätt/byt rally, producera och följ unit runt hinder.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-027 – Rally points (planerad implementationschatt).

## RTS-028 – Stop-command och orderfeedback

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** S.

**Goal:** Avbryta markerade enheters arbete/rörelse med begriplig respons.

**Dependencies:** RTS-027, RTS-022.

**Requirements:** Stop avslutar route/attack/gather-delivery för markerade units och gör dem idle utan att kasta last. Global Stop-knapp är aktiv endast med valda units under spel. Målring visas för valda units: gul för aktiv move/gather/deliver/attack, röd för blockerad route. HUD visar orderfas och felorsak. Avmarkering döljer ring utan att ändra order; completion/död/reset tar bort den. Stop rensar även blockerad navigation så revision inte återstartar arbetet. Produktionsavbrytning ingår först i RTS-033.

**Non-goals:** Attack-move, orderkö och generella effekter.

**Acceptance criteria:** Endast markerade stannar; last och saldo bevaras. Ordermarkörer speglar aktiva/avvisade orders och försvinner vid completion/död/reset. Game over avvisar Stop.

**Tester:** Stop i varje orderfas, delta/orderbyte, markeringskrav och lastbevarande.

**Browserflöde:** Stop mitt i leverans och attack, återuppta och verifiera ny feedback.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-028 – Stop-command och orderfeedback (planerad implementationschatt).

## RTS-029 – Guldgruva och guldinsamling

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Lägga till gold med samma leveransmodell som wood.

**Dependencies:** RTS-028, RTS-021, RTS-026.

**Requirements:** Synlig ändlig gruva, resurstyp i config/order/last och gemensamt gold-saldo vid basleverans. Gruvan ligger vid (850,220), har 300 gold, radie 20, rate 1/s och samma capacity/range som wood. Last har en resurstyp; byte med partial/full last levererar tidigare last först och går sedan till nya noden. Move/Stop bevarar lasttyp. Saldo börjar gold=0. Uttömning levererar sista lasten. Ingen resurs får bytas bort. Nåbara arbetspositioner gäller även gruvan.

**Non-goals:** Guldpriser, handel, tredje resurs och AI-workers.

**Acceptance criteria:** Workers samlar/levererar båda typerna utan sammanblandning eller negativ nod; totalsumman per typ bevaras. Soldiers samlar inte. Uttömning, orderbyte och reset fungerar.

**Tester:** Typad last, resursbyte med partial/full last, depletion, nåbarhet och bevarande per typ.

**Browserflöde:** Samla gold/wood med olika workers, byt mål med last och avläs separata saldon.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-029 – Guldgruva och guldinsamling (planerad implementationschatt).

## RTS-030 – Kostnader i guld och trä

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Använda en gemensam atomisk kostnadsmodell för två resurser.

**Dependencies:** RTS-029, RTS-026.

**Requirements:** Kostnadsconfig för befintlig produktion/byggande och HUD. Preliminärt worker 20 wood, barracks 40 wood, soldier 20 wood + 5 gold. Behåll 5 s produktion och befintliga waves; speltesta två wood-workers och en gold-worker. Gemensam ResourceCost-config och canAfford/payCost används av produktion och placering; båda saldon valideras innan något dras. Avbruten preview kostar inget.

**Non-goals:** Uppgraderingar, kö/refund och nya byggnader.

**Acceptance criteria:** Godkänd start drar varje kostnad exakt en gång; otillräcklig ena resurs lämnar båda oförändrade. Priser/spärrskäl i panel matchar config; wave-survival har fungerande resursbudget.

**Tester:** Tvåresurs-atomicitet, exakta gränser, dubbelstart och ekonomi/reset-regression.

**Browserflöde:** Försök producera utan gold respektive wood; samla båda och bygg/producera.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-030 – Kostnader i guld och trä (planerad implementationschatt).

## RTS-031 – Byggande arbetare och byggtid

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Låta worker resa till och färdigställa ett placerat bygge.

**Dependencies:** RTS-030, RTS-024, RTS-021.

**Requirements:** Barracks kräver minst en vald worker; lägsta ID bland valda får build-order. Högst en barracks, 5 s arbete inom 24 px från footprintens utsida. Last/typ bevaras. Ingen refund/rivning: Stop/move/gather pausar, högerklick på ofärdig barracks tilldelar en vald worker och återupptar kvarvarande progress. Ett bygge har högst en aktiv builder; byte builder stoppar föregående build-order. Completion gör builder idle. Giltig placering reserverar footprint och drar kostnad enligt RTS-030; worker når utsida och arbetar. Produktionen aktiveras först vid färdig byggnad.

**Non-goals:** Reparation, flera builders som accelererar samma bygge, rivningsmeny och automatiskt fullrefund.

**Acceptance criteria:** Bygge kan inte starta utan giltig worker/resurser/position; arbetaren går inte in i footprint. Orders/Stop/otillgänglighet ger dokumenterat paus/avbrott utan ghost-progress. Unfinished building producerar inte och reset rensar allt.

**Tester:** Approach/byggtid, footprintreservation, orderbyte/Stop, kostnadsatomicitet och completion en gång.

**Browserflöde:** Placera barracks med worker, stoppa/återuppta och producera först efter completion.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-031 – Byggande arbetare och byggtid (planerad implementationschatt).

**Subtasks under samma ID:** 31a Placering/reservation och builder-order. 31b Byggprogress/paus/completion. 31c Commands och regressioner.

## RTS-032 – Farms och population cap

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Ge basbygget en begriplig kapacitetsgräns för armén.

**Dependencies:** RTS-031, RTS-030.

**Requirements:** Byggbar farm med footprint/byggtid och supply-config. Farm kostar 20 wood, footprint 2 × 2 tiles, byggtid 5 s, samma builder/pausmodell som barracks. Högst tre farms, med unika match-ID:n. Bas-cap 8, färdig farm +5; workers/soldiers använder 1 var. Aktivt/klart väntande produktionsjobb reserverar 1 direkt vid godkänd start. Ofärdig/pausad farm ger ingen cap. Om cap senare minskar behålls units och redan godkända jobb får slutföras; nya starter blockeras tills used+reserved+1 ≤ cap. Ny farmplacering får inte skära av tilldelade builders tidigare nåbara vägar till ofärdiga sites, även pausade. Ingen förstörelsemekanik före RTS-034. Inga befintliga units försvinner enbart av minskad cap.

**Non-goals:** Upkeep, matsamling, hunger eller automatisk unit-kill.

**Acceptance criteria:** Cap/used/reserved visas och spärrar produktion utan kostnad vid full cap. Färdig farm ökar cap en gång; ofärdig gör det inte. Alla units/aktiva jobb räknas korrekt; reset återställer supply.

**Tester:** Cap-gräns, reservation/completion, flera farms, pausad byggtid och över-cap-policy.

**Browserflöde:** Fyll cap, försök producera, bygg farm och fortsätt produktion.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-032 – Farms och population cap (planerad implementationschatt).

## RTS-033 – Produktionskö, avbrytning och återbetalning

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Köa och avbryta produktion per byggnad med korrekt ekonomi/supply.

**Dependencies:** RTS-032, RTS-027.

**Requirements:** Max tre jobb per byggnad inklusive aktivt; debitera båda resurser och reservera supply vid godkänd enqueue. Job-ID:n är monotona per byggnad. FIFO; endast head arbetar. Cancel på köat jobb ger 100 % av lagrad kostnad, aktivt jobb (även färdig blockerad spawn) ger 50 %. Cancel frigör jobbets reservation direkt och head-byte börjar nästa fulla timer; ingen retroaktiv arbetstid. Game over avvisar enqueue/cancel. Jobs har ID/order, tid och reserverad supply; olika byggnader tickar samtidigt. Blockerad spawn väntar utan duplicate-job/refund.

**Non-goals:** Automatiska oändliga repeat-orders, bonusproduktion och nya units.

**Acceptance criteria:** Köordning är stabil, varje job debiteras/spawnar/refundas högst en gång. Avbryt rätt job, frigör korrekt supply/resurser och visa timer/kö. UI/input, blockerad utgång och reset är konsekventa.

**Tester:** Flera jobb/tidssteg, queue-limit, cancel head/tail, refund-gränser, supply och blockerad spawn.

**Browserflöde:** Köa workers/soldiers samtidigt, avbryt mitt/första job och frigör blockerad utgång.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-033 – Produktionskö, avbrytning och återbetalning (planerad implementationschatt).

**Subtasks under samma ID:** 33a Job-/resurs-/supply-kontrakt. 33b Kö/timer/spawn. 33c Avbrytning/refund och panel.

## RTS-034 – HP, targeting och förstörelse för workers och byggnader

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Göra hela basen/arbetskraften till giltiga combat-mål med komplett cleanup.

**Dependencies:** RTS-033, RTS-031, RTS-022.

**Requirements:** HP/ägare/targeting för workers, bas, barracks, farms och byggprojekt. Worker HP 30, barracks 120, farm 80; projekt har samma HP som färdig byggnad, utan heal vid completion. Ägare är player/enemy. Enemy väljer närmaste levande player-target inom 140 px; lika distans prioriterar soldier, worker, byggnad och stabilt ID, annars bas. Cargo förloras vid worker-död och bokförs per typ som lostCargo. Ingen refund vid byggnads-/projektdöd; alla dess köjobb/reservations/rally rensas. Builder-död pausar kvarvarande projekt med builderId=null. Förstörelse/cleanup körs före produktion så död byggnad aldrig spawnar. Rensa selection, targetorders, rally, bygge/produktion, supply och hinderrevision; bevara jämförbara ID:n.

**Non-goals:** Reparation, ruiner som permanenta hinder, nya combattyper och full AI-ekonomi.

**Acceptance criteria:** HP 0 tar bort mål exakt en gång. Orders mot förstört mål upphör/omplaneras; inga jobs spawnar från död byggnad. Frigjort hinder möjliggör nya rutter; economy/supply följer dokumenterad döds-policy. Basdöd ger fortsatt defeat med företräde.

**Tester:** Död av varje måltyp i aktiva arbets-/bygg-/produktionsfaser, ID-referenser, refund/supply, route-revision och samtidig basdöd.

**Browserflöde:** Förstör lastad worker, underbygge och byggnad med kö; kontrollera panel, routes, supply och outcome.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-034 – HP, targeting och förstörelse för workers och byggnader (planerad implementationschatt).

**Subtasks under samma ID:** 34a HP/targetreferenser. 34b Worker/bygge/byggnadsdöd. 34c Kö/ekonomi/supply/rutt-cleanup.

## RTS-035 – Automatisk target acquisition och attack

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Minska behovet av nytt manuellt mål efter varje kill.

**Dependencies:** RTS-034, RTS-022.

**Requirements:** Idle soldiers söker levande, synliga och nåbara enemies inom 140 px från automatisk strids utgångspunkt. Närmaste centrum väljs, lika distans använder numeriskt stabilt enemy-ID; giltigt aktuellt mål behålls. Explicit attack ersätter automatisk strid och följs till död; Move ersätter jakt och tillåter auto efter arrival; Stop spärrar auto tills nytt Move/attack. Efter kill väljs nästa tillåtna mål; utan sådant återgår soldier till utgångspunkt via befintlig navigation. Osynligt, onåbart eller utanför leash avbryter automatisk jakt. EnemyVisibility-predicate förbereder fog; dagens default är fullt synlig karta. Delta 0 initierar ingen ny strid.

**Non-goals:** Attack-move, smart formations-AI och ranged units.

**Acceptance criteria:** Efter kill kan tillåten unit välja nästa giltiga target utan dold/otillgänglig jakt. Tie-break är stabil; Move/Stop/manuell order följer dokumenterad prioritet. Förstörda mål/reset lämnar inga attackreferenser.

**Tester:** Targetval, distans/tie-break, död/otillgänglighet, command-prioritet och visibility-predicate.

**Browserflöde:** Kämpa mot flera enemies utan nytt klick, avbryt med Move/Stop och ange manuellt target.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-035 – Automatisk target acquisition och attack (planerad implementationschatt).

## RTS-036 – Attack-move

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Kombinera destination och tillfälliga strider.

**Dependencies:** RTS-035, RTS-023.

**Requirements:** Knapp aktiverar destination med vänsterklick; Escape/högerklick avbryter utan orderbyte. Explicit attack-move behåller separat långsiktigt mål, angriper giltig enemy enligt RTS-035 och återupptar navigation efter strid. Endast selected soldiers får separata gruppdestinationer; workers behåller arbete. Move/Stop/manuell attack ersätter hela ordern. Otillgänglig destination avslutas med route-fel, ingen oändlig retry.

**Non-goals:** Patrol, orderscript, formationssystem och dynamisk collision.

**Acceptance criteria:** Unit stannar för strid och når sedan ursprungligt mål; Stop/ny move ersätter hela attack-move. Dött/blockerat/dolt target orsakar inte oändlig jakt. UI och reset rensar state.

**Tester:** Avbrott/återgång, targetbyte, blockering, gruppmål och orderprioritet.

**Browserflöde:** Attack-move över kartan förbi flera enemies, avbryt och jämför vanlig Move.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-036 – Attack-move (planerad implementationschatt).

## RTS-037 – Archer med distansattack och projektiler

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Lägga till en tydligt spelbar ranged-unit.

**Dependencies:** RTS-035, RTS-033, RTS-030.

**Requirements:** Träningsbar archer med config för pris, tid, supply, HP, range, hastighet och attackintervall. Fristående projectile/hit-logik. Fastställ line-of-sight, targettap/livstid och projektilpolicy före kod; framtida fog använder samma giltighetskontroll.

**Non-goals:** Homing-specialförmågor, ballistiksimulering och egna sprites.

**Acceptance criteria:** Archer kan produceras, väljas/flyttas och anfalla på avstånd utan damage utanför vald policy. Projektiler träffar/dör en gång, hanterar dött target och reset/game over. Archer samlar inte resurser.

**Tester:** Range/LOS, intervall, projectile-hit/lifetime, död target, tvåresurs/supply och reset.

**Browserflöde:** Producera archer, skjut rörligt mål runt hinder och spela mixed army-strid.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-037 – Archer med distansattack och projektiler (planerad implementationschatt).

**Subtasks under samma ID:** 37a Config/produktion/enhet. 37b Ranged/projektilregler. 37c Rendering/input/regressioner.

## RTS-038 – Catapult med områdesskada

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Lägga till en långsam siege-unit med testbar splash.

**Dependencies:** RTS-037, RTS-034.

**Requirements:** Produktion/stats/supply och nåbarhet för större kropp i config. Ange impactpunkt, splashradie/falloff, friendly-fire-policy och byggnadsskada innan kod. Återanvänd projectile-lifecycle; placeholders.

**Non-goals:** Specialammo, byggnadskollaps-animationer och avancerad siege-AI.

**Acceptance criteria:** Ett impact applicerar definierad områdesskada exakt en gång till giltiga mål; targets utanför radie skadas inte. Catapult navigerar/spawnar utan footprintintrång och samlar inte. Projectile/death/outcome/reset är konsekventa.

**Tester:** Radie/kant/friendly-fire, flera mål/buildings, större clearance, miss/död target och simultan basdöd.

**Browserflöde:** Producera catapult och bombardera grupp/byggnad; jämför kantmål och smal passage.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-038 – Catapult med områdesskada (planerad implementationschatt).

**Subtasks under samma ID:** 38a Stor unit/produktion/navigation. 38b Impact/splash. 38c Blandad armé och reset.

## RTS-039 – Uppgraderingsbyggnad för attack och försvar

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Ge en liten armé långsiktig progression.

**Dependencies:** RTS-038, RTS-031, RTS-030.

**Requirements:** Forge återanvänder workerbygge (40 wood/10 gold, 64 px, 5 s, HP 120, max en). Attack/defense max en nivå vardera, 40 wood/10 gold och 8 s, ett researchjobb utan kö. Attack ×1,25 damage och defense ×0,75 mottagen unit-damage gäller dynamiskt gamla/nya combat-units, inte workers/byggnader; ingen heal. Projektil behåller damage vid skott. Forge-död avbryter research utan refund, färdiga nivåer består vid rebuild. Global research-UI bevarar selection/orders; reset rensar nivåer och jobb.

**Non-goals:** Omfattande tech tree, spellcasters och flera tidsåldrar.

**Acceptance criteria:** Godkänd research betalar en gång och completion ger en bonus en gång till avsedda units. Spärrar/byggnadsdöd och restart följer dokumenterad policy; nya och befintliga units har konsekventa stats.

**Tester:** Research-cost/time/duplicates, statstackning, gamla/nya units och death/reset.

**Browserflöde:** Bygg, uppgradera och jämför attack/HP-regler före/efter i en liten strid.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-039 – Uppgraderingsbyggnad för attack och försvar (planerad implementationschatt).

## RTS-040 – Enhetsbalans och arméstrider

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Speltesta worker/soldier/archer/catapult som en liten armé.

**Dependencies:** RTS-039, RTS-036, RTS-017.

**Requirements:** Definiera upprepningsbara duel-/grupp-/siege-fixtures och speltesta priser, supply, HP, range, skada och produktionstid. Justera config efter observationer; markera valsiffror som speltestade, ej universellt slutbalanserade.

**Non-goals:** Nya units, full andra fraktionen och taktiska AI-omskrivningar.

**Acceptance criteria:** Minst tre dokumenterade matchup-/armétester ger begripliga roller och en ekonomi som kan spela wave-survival. Båda outcomes och reset fungerar med samtliga unittyper; inga nya balance-values saknar motivering.

**Tester:** Combat/economy-invarianter och repeatable matchup-regressioner utan att frysa godtyckliga DPS-tal.

**Browserflöde:** Spela melee/ranged/siege och full wave-match med blandad armé.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-040 – Enhetsbalans och arméstrider (planerad implementationschatt).

## RTS-041 – Attackbar och förstörbar fiendebas

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Introducera en fysisk fiendebas som kan belägras.

**Dependencies:** RTS-040, RTS-034, RTS-024.

**Requirements:** Fiendeägd bas med footprint/HP och giltiga attack-positioner. Spelarunits kan attackera/förstöra den med befintlig combat. Separat scenario/config förbereds; waves-segervillkor ändras inte.

**Non-goals:** Fiendeproduktion, AI-workers och skirmish-seger.

**Acceptance criteria:** Fiendebasen blockar navigation och tar korrekt skada; förstörd bas rensar alla target-/hinderreferenser. Spelaren får inga enemy-produktionscommands och wave-survival saknar oavsiktligt nytt victory-villkor.

**Tester:** Ägare/targeting, footprint/range, melee/ranged/splash och target/hinder-cleanup.

**Browserflöde:** Angrip fiendebas via nåbar väg och förstör den; jämför wave-scenariot.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-041 – Attackbar och förstörbar fiendebas (planerad implementationschatt).

## RTS-042 – Fiendeproduktion med begränsad resursbudget

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Låta fiendebasen producera utan gratis oändliga units.

**Dependencies:** RTS-041, RTS-033, RTS-030.

**Requirements:** En begränsad gold/wood-budget i enemy-config; använd gemensam produktion/kö/supply där tillämpligt. Produktionstid, kostnad och tillåtna units kommer från config. Ingen full worker-ekonomi eller dold budgetåterfyllning.

**Non-goals:** AI-insamling, obegränsade budgetar och flera fulla fraktioner.

**Acceptance criteria:** Varje enemy-job betalas/spawnar en gång; tom budget/full cap/blockad spawn ger säkert stopp/väntan. Basdöd stoppar active/köad produktion enligt RTS-034; restart återställer budget/timers.

**Tester:** Budget-atomicitet, simultan produktion, IDs, supply/spawn och död kö.

**Browserflöde:** Observera enemy-produktion tills budgeten tar slut och förstör basen under jobb.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-042 – Fiendeproduktion med begränsad resursbudget (planerad implementationschatt).

## RTS-043 – AI samlar och skickar anfallsgrupper

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Organisera producerad armé i begripliga anfall.

**Dependencies:** RTS-042, RTS-036.

**Requirements:** AI samlar stridsenheter i grupper, inte resurser med workers. Configstyrd samlingsplats, gruppstorlek/timeout och attack-move mot spelaren; grupper har explicit state/ID. Budgetmodellen från RTS-042 bevaras.

**Non-goals:** Full worker-ekonomi, avancerad scouting, formationer och oändlig resursinkomst.

**Acceptance criteria:** En unit tillhör högst en grupp; klar grupp skickas en gång och går runt hinder. Underbemannad grupp hanteras av dokumenterad timeout utan gratis units; död/reset städar medlem-/målreferenser.

**Tester:** Gruppstorlek/timer, medlemskap, orderutskick, döda medlemmar och slut på budget.

**Browserflöde:** Bygg försvar, observera minst två samlings-/anfallscykler och avskär deras väg.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-043 – AI samlar och skickar anfallsgrupper (planerad implementationschatt).

## RTS-044 – AI försvarar basen och ersätter förluster

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Ge fienden ett enkelt lokalt försvar utan att bryta ekonomin.

**Dependencies:** RTS-043, RTS-035.

**Requirements:** Hotnära-bas trigger, försvarsgrupp/reserv och config för prioritet mellan anfall/försvar. Ersätt förluster bara när budget/supply/tid medger det. Definiera gruppöverlämning och återgång; ingen omniscient fog-AI efter RTS-049.

**Non-goals:** AI-byggande, nya budgetkällor och avancerad strategisökning.

**Acceptance criteria:** Hot ger högst en aktuell försvarsorder per unit; inga dubbla gruppmedlemskap. Återgång fungerar efter hot, replacement drar faktisk budget och upphör vid slut/basdöd. Restart återställer AI-state.

**Tester:** Hottrigger, prioritet, grupptransfer, budgetbegränsad replacement och döda mål.

**Browserflöde:** Raid enemy-bas, dra dig tillbaka och följ försvar/ersättningsproduktion.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-044 – AI försvarar basen och ersätter förluster (planerad implementationschatt).

## RTS-045 – Skirmish med basförstörelse som segervillkor

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Erbjuda skirmish utan att ersätta färdigt wave-survival.

**Dependencies:** RTS-044, RTS-014, RTS-015.

**Requirements:** Separat scenario-config/mode för skirmish och wave-survival samt enkel valmöjlighet; full startmeny kommer i RTS-052. Skirmish-seger vid fiendebas förstörd, förlust vid spelarbas förstörd med defeat-företräde. Waves finns endast i wave-scenario.

**Non-goals:** Multiplayer, nya kartgeneratorer och kampanjpersistens.

**Acceptance criteria:** Valt scenario startar rätt ekonomi/AI/villkor. Skirmish kan vinnas/förloras utan wave-trigger; survival behåller ändliga waves och sitt victory-villkor. Game over fryser båda modes; restart återskapar valt scenario.

**Tester:** Policy per scenario, simultaneous base deaths, ingen wave/skirmish-korsläcka och full reset.

**Browserflöde:** Spela en skirmish-vinst/förlust och survival-vinst, restart respektive valt mode.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-045 – Skirmish med basförstörelse som segervillkor (planerad implementationschatt).

**Subtasks under samma ID:** 45a Scenario-data och minsta val. 45b Outcome-policy. 45c Båda mode-flödena och reset.

## RTS-046 – Konfigurerade svårighetsgrader

**Status:** Done.

**Priority:** P2.

**Uppskattad storlek:** M.

**Goal:** Ge begripligt valbar utmaning utan nya AI-system.

**Dependencies:** RTS-045, RTS-040.

**Requirements:** Preliminära easy/normal/hard-profiler för startbudget, produktion/grupptryck och survival-waves. Sätt gräns för vilka stats ändras och visa valet; speltesta utan hidden cheats.

**Non-goals:** Dynamisk svårighetsanpassning och ny AI-ekonomi.

**Acceptance criteria:** Vald profil ger rätt config i rätt scenario utan att mutera andra profiler. Normalprofil är verifierat spelbar; utmaningsskillnad dokumenteras med speltest. Restart behåller valet och återställer faktisk budget.

**Tester:** Config-isolering, scenario/profil-kombinationer, resursregler och reset.

**Browserflöde:** Jämför normal/easy/hard i båda modes och kontrollera budget/spawn/intervall.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-046 – Konfigurerade svårighetsgrader (planerad implementationschatt).

## RTS-047 – Minimap med kameraindikator och klicknavigation

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Visa kartöverblick och snabbt flytta kameran.

**Dependencies:** RTS-025, RTS-045, RTS-018.

**Requirements:** En enkel karta med terrain/byggregions/enhetsmarkörer och kameraindikator. Klick flyttar endast kamera via korrekt world/minimap-konvertering. Förbered visibility-filtrering inför RTS-049, inte egna gameplay-orders.

**Non-goals:** Fog-policy, minimap-orders, zoom och fantasy-art.

**Acceptance criteria:** Indikator/mapkoordinater är korrekta vid worldkanter; minimap-click ändrar varken selection eller orders. Restart/scenario-byte uppdaterar mapdata och kamera utan gamla markörer.

**Tester:** Koordinatskalning/clamp, kameraindikator, UI-isolering och state-refresh.

**Browserflöde:** Klicka i minimapens hörn, följ kamera och ge sedan move på main canvas.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-047 – Minimap med kameraindikator och klicknavigation (planerad implementationschatt).

## RTS-048 – Fog of war och utforskad terräng

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Beräkna teamvis synlighet och ihågkommen terräng.

**Dependencies:** RTS-047, RTS-040.

**Requirements:** Fristående fog-grid med aktuell visibility och persistent explored-data per team. Bestäm vision-radius, terräng/LOS och ev minne av buildings före kod. Overlay/fixture-rendering för validering; aktivera inte spelarens fog-läge före RTS-049:s fulla filtrering.

**Non-goals:** Fog som enbart visuell mask med informationsläckor, avancerad stealth och nätverkssynk.

**Acceptance criteria:** Vision från levande units/buildings uppdaterar korrekt; explored kvarstår när vision försvinner men återställs vid ny match. Död/ägare/scenario hanteras. Inget ofärdigt fog-läge levereras som döljer terrain men läcker enemy-data i panel/minimap.

**Tester:** Vision-union, kanter, LOS-policy, team-isolering, död/reset och explored-persistens under match.

**Browserflöde:** I märkt testfixture: utforska, lämna, döda observer och kontrollera explored/visible-overlay.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-048 – Fog of war och utforskad terräng (planerad implementationschatt).

**Subtasks under samma ID:** 48a Vision-/minnespolicy och griddata. 48b Uppdatering från units/buildings. 48c Overlay/testfixture; spelares aktivering väntar på RTS-049.

## RTS-049 – Synlighet styr rendering, targeting och minimap

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Göra fog till en konsekvent spelregel utan dolda enemy-läckor.

**Dependencies:** RTS-048, RTS-035, RTS-037, RTS-044.

**Requirements:** Gemensamt visibility-kontrakt filtrerar world-rendering, HP/labels, selection/target-acquisition, orders, HUD/command panel, AI-information och minimap. Definiera targettap/projectile-impact och ev last-seen-building-data; använd aldrig live HP/position för osynligt mål.

**Non-goals:** Mer avancerad fog-AI, stealth och informationsfusk.

**Acceptance criteria:** Dold enemy avslöjas inte via markör, HUD, targetdata, enemy-budget eller klickträff. Förlorad vision rensar/följer dokumenterad target-policy utan exakt dold tracking. Utforskad terrain kan visas; eventuella minnesmarkörer använder endast observerat state. Fog-läge är nu spelbart i båda scenarierna.

**Tester:** End-to-end visibility på alla informationsytor, hidden-click/acquisition, last-seen/destroyed target, projectile-policy, AI-team och reset.

**Browserflöde:** Upptäck enemy, lämna vision och prova klick/panel/minimap/autoattack; återvänd och jämför faktiska avslöjanden.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-049 – Synlighet styr rendering, targeting och minimap (planerad implementationschatt).

**Subtasks under samma ID:** 49a Render/HUD/minimap-filter. 49b Input/combat/AI-filter. 49c Targettap och full scenario-regression.

## RTS-050 – Shift-selection och kontrollgrupper

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Välja och återkalla grupper med tydliga modifierare.

**Dependencies:** RTS-049, RTS-026.

**Requirements:** Shift klick/drag adderar eller togglar enligt dokumenterad policy; grupper binder levande egna unit-ID:n. Återkalla grupp utan orders; döda/förstörda/dolda eller främmande targets filtreras enligt selection-regler.

**Non-goals:** Formation-editor, gruppspecifika stats och macros.

**Acceptance criteria:** Normal selection bevaras, modifierare fungerar i alla dragriktningar och grupper återkallar bara giltiga units. UI-input/camera/restart hanterar rätt state; inga ID-referenser överlever matchbyte.

**Tester:** Modifierad selection, gruppbind/recall, död ID, keyboard-focus och reset.

**Browserflöde:** Bygg blandad armé, add/toggle urval, bind/återkalla grupp efter förlust av en unit.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-050 – Shift-selection och kontrollgrupper (planerad implementationschatt).

## RTS-051 – Hotkeys och lättillgänglig kommandoguide

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Göra kommandon lättare att hitta och använda utan dubbel input.

**Dependencies:** RTS-050, RTS-028, RTS-036, RTS-033.

**Requirements:** Dokumenterad tangentmappning för selection/grupper, Stop, attack-move och kontextuella bygg-/produktionskommandon. Synliga labels/guide och keyboard-focus-hantering; välj språk/mappning före kod. Samma validering som knappar.

**Non-goals:** Macro-scripting, gamepad och omfattande rebinding-system.

**Acceptance criteria:** Hotkey och knapp ger samma order/kostnad en gång; textfält/pause/game over spärrar gameplay-input. Guide matchar faktisk mappning och felorsaker. Restart duplicerar inga keyboard-lyssnare.

**Tester:** Fokus/kontext/guard, repeat-key/debit, groups och listener/reset.

**Browserflöde:** Spela ekonomi/attack/Stop via tangentbord och kontrollera guide samt UI-focus.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-051 – Hotkeys och lättillgänglig kommandoguide (planerad implementationschatt).

## RTS-052 – Pause, matchstart och scenario-val

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Ge kompletta lokala start-/pause-/restart-flöden.

**Dependencies:** RTS-051, RTS-046, RTS-045.

**Requirements:** Välj survival/skirmish, karta där stödd och difficulty innan match. Pause fryser alla gameplay-timers/orders/projektiler/AI men tillåter meny-input enligt dokumenterad policy. Resume tillför inte elapsed wall-time; restart behåller val.

**Non-goals:** Konton, serverlobby, matchmaking och campaign-save.

**Acceptance criteria:** Alla scenario/profil-val ger korrekt initial state. Pause/resume bevarar matchen utan bonusprogress/damage och duplikatlyssnare; outcome/restart/new match går via tydliga stateövergångar.

**Tester:** Pause alla system, inputprioritet, lång wall-time-resume, configval och återstart.

**Browserflöde:** Starta båda modes, pausa mitt i bygge/projektil/produktion, vänta, resume och restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-052 – Pause, matchstart och scenario-val (planerad implementationschatt).

**Subtasks under samma ID:** 52a Startval. 52b Pause/resume/input. 52c Outcome/restart-menyer och regressioner.

## RTS-053 – Egna pixeltiles för terräng och resurser

**Status:** Done.

**Priority:** P2.

**Uppskattad storlek:** L.

**Goal:** Ersätta terräng/resurs-placeholders med egna pixelassets.

**Dependencies:** RTS-052, RTS-019, RTS-029.

**Requirements:** Egna PNG RGBA-tiles på 32 × 32 px, atlas och lokalt manifest med tile-ID/origin; nearest-neighbor och inga gameplayändringar. Wood/gold-nodframes 64 × 64 px med transparent bakgrund och dokumenterat ankare mot befintlig footprint. Enkla resource-states: tillgänglig/uttömd (en frame vardera); inget animationskrav.

**Non-goals:** Lånade originalspel-assets, nytt terrängsystem och map editor.

**Acceptance criteria:** Format/dimensioner/ankare är validerade; varje aktuell terrain/resource-ID har eget korrekt renderasset. Logic/walkability/nodmängd är oförändrade. Källor/exportfiler/palett och rätt att använda egna assets dokumenteras lokalt.

**Tester:** Manifest/frame-bounds/ID-mapping där meningsfullt och kart-/resursregressioner; inga pixel-snapshots som enda beteendebevis.

**Browserflöde:** Pan hela karta/minimap, samla båda resurserna till depletion och kontrollera fog/rendering.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-053 – Egna pixeltiles för terräng och resurser (planerad implementationschatt).

**Subtasks under samma ID:** 53a Palett och terrain-set. 53b Wood/gold-states. 53c Exportmanifest/integration.

## RTS-054 – Byggnadssprites och byggstadier

**Status:** Done.

**Priority:** P2.

**Uppskattad storlek:** L.

**Goal:** Göra basbygget läsbart genom egna sprites.

**Dependencies:** RTS-053, RTS-031, RTS-034, RTS-039.

**Requirements:** PNG RGBA för bas/barracks/farm/uppgraderingsbyggnad och enemy-varianter som delar logik. Standardframe 128 × 128 px (farm 64 × 64), native 32 px tile-skala och explicit footprint/ankare. Minst tre statiska byggframes (grund, halvbyggd, färdig); färdig frame är idle utan animationskrav.

**Non-goals:** Förändrade footprints/HP, andra fulla fraktionen och destruktionsfysik.

**Acceptance criteria:** Alla byggnadstyper/stadier/ägare har korrekt frame och ankare utan att ändra placement/hinder. HP/selection/fog överlappar inte vilseledande; förstörd byggnad lämnar ingen target/renderläcka. Export/source-manifest finns.

**Tester:** State→frame, ankare/frame-bounds, bygge/completion/death/fog-regressioner.

**Browserflöde:** Bygg/avbryt/färdigställ/förstör varje typ och verifiera selection/minimap/fog.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-054 – Byggnadssprites och byggstadier (planerad implementationschatt).

**Subtasks under samma ID:** 54a Byggnadsset/ägarmarkering. 54b Byggstadier. 54c Integration och footprint-regression.

## RTS-055 – Enhetssprites och animationer

**Status:** Done.

**Priority:** P2.

**Uppskattad storlek:** L.

**Goal:** Ge alla fyra unittyper egna läsbara pixelanimationer.

**Dependencies:** RTS-054, RTS-038, RTS-034.

**Requirements:** PNG RGBA-sheets: worker/soldier/archer 32 × 32 px per frame, catapult 64 × 64. Åtta riktningar, minst idle 1 frame, walk 4, attack 4 och death 4; worker dessutom gather/build 4 vardera. Manifest med frame-grid, anchor, facing, FPS/loop. Renderframe får inte tyst ändra hitbox/navigation-clearance; death-animation är presentation efter logical removal.

**Non-goals:** Nya combatregler, andra fulla fraktionen, skeletal-animation och grafikpolish utöver läsbarhet.

**Acceptance criteria:** Varje relevant unit-state/riktning har egna frames och tydlig teammarkering. Damage/byggprogress styrs av gameplay-tid, aldrig animationsevents. Dead/fogged units läcker inte selection/HP; restart städar animationsobjekt.

**Tester:** State/facing→animation, sheet-bounds, death-effect-lifecycle och combat/gather/reset-regressioner.

**Browserflöde:** Flytta i åtta riktningar, samla/bygg och melee/ranged/splash-strid; död och fog kontrolleras.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-055 – Enhetssprites och animationer (planerad implementationschatt).

**Subtasks under samma ID:** 55a Worker/soldier-set. 55b Archer/catapult-set. 55c Facing/animation/render-integration.

## RTS-056 – Ljudeffekter, musik och volymkontroller

**Status:** Done.

**Priority:** P2.

**Uppskattad storlek:** M.

**Goal:** Lägga till ett litet eget lokalt ljudpaket.

**Dependencies:** RTS-055, RTS-052.

**Requirements:** Lokal egen effekt/musik, master WAV och runtime-export OGG med validerad fallback enligt beslutat browserstöd; manifest anger loop/duration/volym. Separat master/effect/music-volym och mute. Starta ljud efter user gesture, hantera pause/outcome/restart och undvik effekter från dolda events som avslöjar enemy.

**Non-goals:** Tredjepartstjänster, voice acting och omfattande adaptiv soundtrack.

**Acceptance criteria:** Valda runtimeformat avkodas i stödda browsers utan autoplayfel; mute/volym fungerar direkt. Pause/game over/restart ger ingen dubbel musik eller gamla ljudevents och inga fog-läckor. Saknat ljud blockerar inte gameplay.

**Tester:** Volym/mute/eventguard och lifecycle där testbart; decode/user-gesture i browser.

**Browserflöde:** Starta match, mute/byta volym, pausa/resume, bli attackerad under fog och restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-056 – Ljudeffekter, musik och volymkontroller (planerad implementationschatt).

## RTS-057 – Fantasy-HUD och visuella stridseffekter

**Status:** Done.

**Priority:** P2.

**Uppskattad storlek:** M.

**Goal:** Ge presentationen en sammanhållen egen fantasy-stil utan att ändra spelregler.

**Dependencies:** RTS-056, RTS-049, RTS-018.

**Requirements:** Egna PNG RGBA-UI-ikoner 32 × 32, paneldelar med dokumenterade 16 px hörn/borders och originalpalett. Effektsheet 32 × 32 impact respektive 64 × 64 splash, minst 4 frames/effekt med explicit FPS/lifetime. Läsbara HP/order/range-signaler, keyboard-focus och HUD-layout.

**Non-goals:** Gameplay-omskrivning, kopierad Warcraft-HUD och effekter som driver damage.

**Acceptance criteria:** Alla kontroller/status är minst lika läsbara som tidigare HUD i valda viewportar. Fog döljer känsliga effekter/labels; effects slutar och städas vid death/reset. Klick/hotkeys/world-bounds fungerar efter skin.

**Tester:** Effect-lifecycle/visibility/input och återkommande HUD-regressioner.

**Browserflöde:** Full ekonomi/arméstrid i båda modes med pan/fog/keyboard och game over/restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-057 – Fantasy-HUD och visuella stridseffekter (planerad implementationschatt).

## RTS-058 – Tre korta uppdrag med olika mål

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Erbjuda tre handgjorda korta scenarier med begripliga objectives.

**Dependencies:** RTS-057, RTS-052, RTS-045.

**Requirements:** Planera tre uppdrag: överlev ändliga waves, förstör fiendebas och ett tredje mål som beslutas före kod (t.ex. försvara utpost under begränsad tid). Konfigurerade kartor/starts/objectives, tydlig instruktion och individuell reset; skirmish/survival kvar i valmenyn. Längd/mål/balans är preliminära tills speltestade.

**Non-goals:** Stor kampanj, nya units, nätverk och procedural generation.

**Acceptance criteria:** Tre valbara uppdrag med olika verifierbara win-conditions, förlust och defeat-företräde kan slutföras. Minst ett dokumenterat naturligt playthrough per uppdrag; start/restart läcker inte progress till annat scenario.

**Tester:** Objective-policy, timer/goal-gränser, simultaneous defeat och scenario-isolering.

**Browserflöde:** Spela alla tre från instruktion till win/loss, återstarta och växla scenario.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-058 – Tre korta uppdrag med olika mål (planerad implementationschatt).

**Subtasks under samma ID:** 58a Mål/kart/startdesign. 58b Tre objektiv-configs/integration. 58c Playthroughs/balans.

## RTS-059 – Lokal save/load med versionshanterat sparformat

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Återuppta en lokal match med korrekt komplett gameplay-state.

**Dependencies:** RTS-058, RTS-052, RTS-049, RTS-044.

**Requirements:** Versionerat validerat JSON-format och lokal lagring; antal slots/manual-autosave/export-policy beslutas före kod. Snapshot innehåller scenario/map/config-version, matchtid/outcome/pause, resurser/laster, units/HP/orders/IDs, byggprojekt, kö/rally/supply/research, projectiles, AI-budget/grupper, wave-progress och fog/explored. Navigation återvalideras mot laddade footprints; inga Phaser-objekt/listeners/caches serialiseras.

**Non-goals:** Cloud, backend, konton, cross-version-garanti utan migration och godtycklig extern kod i saves.

**Acceptance criteria:** Spara/ladda under arbete/produktion/strid ger motsvarande state utan dubbla kostnader/impact/spawns eller wall-time-bonus. Korrupt/okänd framtida version avvisas atomiskt utan att skada aktiv match; stödda versioner har dokumenterad migration/avvisning. Load/restart städar UI/render/listeners/fog och skapar giltiga referenser.

**Tester:** Roundtrip för varje system, mid-projectile/mid-job, validering/broken ID, migrations-fixtures, kvotfel, atomicitet och reset.

**Browserflöde:** Spara mitt i leverans/bygge/kö/strid/fog, reload sidan och ladda; prova trasigt/okänt save och starta ny match.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-059 – Lokal save/load med versionshanterat sparformat (planerad implementationschatt).

**Subtasks under samma ID:** 59a Schema/version/validering. 59b Snapshot/rekonstruktion/lagring. 59c UI/felfall/migration och full roundtrip.

## RTS-060 – Slutbalans, prestanda, regressioner och releaseverifiering

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Verifiera den lilla kompletta tributen inför lokal release.

**Dependencies:** RTS-059, RTS-046, RTS-040.

**Requirements:** Definiera browser-/viewport-/enhetsbudget och stödd releaseprofil innan mätning. Speltesta survival/skirmish/tre uppdrag, alla difficulty-profiler och save/load; dokumentera balans och uppmätta CPU/frame/minne/bundle. Bedöm kvarstående bundle-varning mot budget, inte automatisk omskrivning. Verifiera clean-install/build lokalt och kända begränsningar.

**Non-goals:** Multiplayer, nya gameplayfeatures och spekulativ stor refaktorering. GitHub Pages-publicering ingår enligt användarens tillägg.

**Acceptance criteria:** Alla checks/full playthroughs och save/reset-regressioner redovisas med miljö/resultat. Uppmätta budgets uppfylls eller tasken lämnas öppen med konkreta hinder; inga okända blockerande fel. Assets/ljud/formats fungerar från lokal production-build, docs och release-checklista är aktuella.

**Tester:** Alla suites, clean-install/typecheck/build, scenariomatris, lång match/reset/heap och save-kompatibilitet.

**Browserflöde:** Spela lokal byggoutput i valda browsers/viewportar, alla modes/uppdrag/difficulties, pause/save/load/outcome/restart och belastningsfall.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-060 – Slutbalans, prestanda, regressioner och releaseverifiering (planerad implementationschatt).

**Pages:** Först efter godkända releasekontroller: Actions på push main/workflow_dispatch, npm ci/test/typecheck/build, officiella Pages-actions, minimala permissions/concurrency, Vite base /warcraft-2-tribute/ och basrelativa assets. Verifiera lokal produktion under subpath samt Actions/publicerad sida när åtkomst finns; rapportera annars ej kontrollerat. Localhost-saves flyttas inte mellan origins.

**Subtasks under samma ID:** 60a Mät-/releasekriterier. 60b Slutspeltest/balans. 60c Konkreta regressioner/prestandafynd. 60d Lokal releaseverifiering/dokumentation.

## Etapp 7–11 – Planerad fortsättning (ingen implementation i denna körning)

Fraktionsnamn, specialförmågor och exakta balansvärden är öppna beslut. Nya system måste inkludera restart, save/load och teamvisibilitet där relevant. Befintliga system återanvänds.

## RTS-061 – Speltest och kvalitetsgranskning av första versionen

**Status:** Done.

**Goal:** Dokumentera reproducerbara fynd från publicerad och lokal release.

**Requirements:** Spela ekonomi, basbygge, strid, missions, save/load och båda modes. Bedöm läsbarhet, tillgänglighet och verkliga större arméer. Ingen featureimplementation.

**Non-goals:** Features utanför målet, deploymentändring och fraktions-/sjöimplementation.

**Dependencies:** RTS-060.

**Acceptance criteria:** Prioriterad fyndlista med reproduktionssteg, miljö, förväntat/faktiskt beteende och severity; inga obekräftade buggar rapporteras som fakta.

**Tester:** Browsermatris och befintlig regression; dokumentationsgranskning.

**Docs:** [BACKLOG.md](BACKLOG.md), [DEV_LOG.md](DEV_LOG.md), [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md).

## RTS-062 – Prioriterade buggar och regressioner från granskningen

**Status:** Done.

**Goal:** Rätta bekräftade blockerande/högt prioriterade fynd.

**Requirements:** Välj begränsad fyndlista från RTS-061, ett reproduktionsfall och regression per beteendefel; bevara save-kompatibilitet eller dokumentera version.

**Non-goals:** Features utanför målet, deploymentändring och fraktions-/sjöimplementation.

**Dependencies:** RTS-061.

**Acceptance criteria:** Valda fynd är åtgärdade och verifierade; övriga fynd står kvar med prioritet.

**Tester:** Regression för varje fix, alla suites/typecheck/build och browser-repro.

**Docs:** [BACKLOG.md](BACKLOG.md), [DEV_LOG.md](DEV_LOG.md), [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md).

## RTS-063 – Förbättrad unit-separation och trängselhantering

**Status:** Done.

**Goal:** Minska överlappning utan att blockera orders.

**Requirements:** Besluta lokal separation med kroppsstorlek, determinism och begränsad beräkningskostnad; bevara pathfinding/orders/fog.

**Non-goals:** Features utanför målet, deploymentändring och fraktions-/sjöimplementation.

**Dependencies:** RTS-062.

**Acceptance criteria:** Större blandade grupper separeras; inga NaN, teleporteringar eller permanent stopp i öppet fält; restart/save/load korrekt.

**Tester:** Öppet fält, olika kroppsstorlekar, trängsel, tidssteg, save/reset och browser.

**Docs:** [BACKLOG.md](BACKLOG.md), [DEV_LOG.md](DEV_LOG.md), [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md).

## RTS-064 – Köbildning vid resurser och smala passager

**Status:** Done.

**Goal:** Låta arbetare och arméer ta sig fram i trängsel.

**Requirements:** Avgränsa köpolicy vid noder och passager; rättvis framdrift, avbrytning och döda refs. Ingen ny resursekonomi.

**Non-goals:** Features utanför målet, deploymentändring och fraktions-/sjöimplementation.

**Dependencies:** RTS-063.

**Acceptance criteria:** Begränsad genomströmning utan deadlock; resurser och last bevaras; nya orders bryter kön och saves återställs.

**Tester:** Kö/avbrytning/death, wood-konservation, smal passage och långt browserfall.

**Docs:** [BACKLOG.md](BACKLOG.md), [DEV_LOG.md](DEV_LOG.md), [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md).

## RTS-065 – Uppmätt prestandapass med större arméer

**Status:** Done.

**Goal:** Verifiera beräkningsbudget för större matcher.

**Requirements:** Definiera och mät konkreta unit-tal på dokumenterad enhet; profile gameplay/render/minne före optimering. Ingen spekulativ refaktor.

**Non-goals:** Features utanför målet, deploymentändring och fraktions-/sjöimplementation.

**Dependencies:** RTS-064.

**Acceptance criteria:** Före/efter-resultat med FPS/frame CPU/minne; budget klar eller konkreta hinder redovisas; gameplay/save/fog lika.

**Tester:** Belastning, långt spel/reset/heap, alla regressioner och production browser.

**Docs:** [BACKLOG.md](BACKLOG.md), [DEV_LOG.md](DEV_LOG.md), [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md).

## RTS-066 – Fraktionsdata för units, buildings och upgrades

**Status:** Done.

**Goal:** Införa två stabila fraktions-ID:n och fraktionsspecifika typ-ID:n ovanpå befintliga gemensamma gameplay-roller.

**Requirements:** Enkel TypeScript-katalog för worker/soldier/archer/catapult, base/barracks/farm/forge och attack/defense. Fraktion är skild från team/owner. Matchstart, restart och save/load bevarar teamens fraktion. Befintliga stats/kostnader och system behålls; inga kopierade fraktionssystem.

**Non-goals:** Fraktionsval i UI, ny grafik, fraktionsbalans, nya förmågor, AI-ekonomi och sjöstrid; dessa har egna efterföljande tasks.

**Dependencies:** RTS-065.

**Acceptance criteria:** Båda fraktioner har unika typ-ID:n med samma delade roller och kompletta data. Matchen lagrar player/enemy-fraktion oberoende av owner. Save v1 migreras atomiskt till v2 med tidigare standardfraktioner; okända/ogiltiga fraktioner/versioner avvisas tydligt. Befintliga matchflöden och numeriska värden är oförändrade.

**Tester:** Katalogens roller/ID:n och baslinjevärden, team/fraktionsoberoende, start/reset, save v1-migration/v2-roundtrip och avvisning utan mutation. Alla regressioner, typecheck/build och browserkontroll av migrerad Save/Load/start/restart.

**Docs:** [BACKLOG.md](BACKLOG.md), [DECISIONS.md](DECISIONS.md), [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

## RTS-067 – Andra spelbara fraktionen med egna namn och assets

**Status:** Done.

**Goal:** Göra Kronförbundet och Järnklanen valbara med egna namn och urskiljbara originalsprites.

**Requirements:** Menyval för player-fraktion, motsatt enemy-fraktion i nya matcher. Egna human/orc-unit- och byggnadssprites för båda lagfärgerna, befintliga animationer/byggstadier. Fraktionsnamn i UI. Save/load/restart och ny match isolerar val; fog/death/selection/HP följer befintliga regler.

**Non-goals:** Fraktionsstats/kostnadsskillnader, nya förmågor, AI-ekonomi, nya kartor och sjöstrid.

**Dependencies:** RTS-066.

**Acceptance criteria:** Båda val kan starta, producera, samla/flytta/strida, laddas och startas om. Fraktionen syns som egen human/orc-silhuett/presentation oberoende av lagfärg. Alla erforderliga frames/byggstadier finns och tillåten ursprungs/licens dokumenteras. Inga saknade sprites eller fog-/inputregressioner.

**Tester:** Fraktionsval/state-isolering, namn/frame-val, båda fraktioner/teams/directions/actions/stadier i assetvalidering, save/reset och befintliga regressioner. Browser: båda menyalternativ, riktig ekonomi/produktion, animation/strid, Load/restart och screenshots.

**Docs:** [BACKLOG.md](BACKLOG.md), [DECISIONS.md](DECISIONS.md), [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md), [assets/README.md](assets/README.md).

## RTS-068 – Fraktionsspecifika stats, kostnader och produktionsregler

**Status:** Done.

**Goal:** Koppla båda fraktionernas unitrecept till gemensam betald produktion.

**Requirements:** Kostnad, tid, supply och producerad HP kommer från fraktionsconfig. Kronförbundet behåller baslinjen. Järnklanens yxkrigare har 66 HP, kostar 18 wood/6 gold och tar 6 s. Gemensamma kö-, refund-, spawn- och ID-regler återanvänds; bas/barracks kan producera samtidigt. Fiendens ändliga budget betalar egen fraktionskostnad, med difficulty-tid plus receptets avvikelse från 5 s. Befintlig svagare enemy-stridsprofil kvarstår. UI visar faktisk kostnad, tid och max-HP. Äldre betalda köjobb behåller originalkostnad/tid efter validerad migration. Nya jobb använder valt recept; restart är färsk.

**Non-goals:** Nya units/förmågor, AI-ekonomi, ändrad movement/gathering/footprints eller generell systemrefaktorering.

**Dependencies:** RTS-067.

**Acceptance criteria:** Båda fraktioner betalar och spawnar efter eget recept exakt en gång; otillräcklig ekonomi/population/kö blockerar. Refund använder betald kostnad. Save/load/restart bevarar fraktion och giltiga köjobb, avvisar manipulerad kostnad/tid. Browser visar båda receptens kostnad/tid/HP med fungerande produktion.

**Tester:** Båda fraktioners kostnad, tid, HP, timestep-equivalence, blockerad start, refund, samtidig produktion, ändlig enemy-budget och legacy/new save-validering. Befintliga tester, typecheck, build, browser och diffgranskning.

**Docs:** BACKLOG.md, DECISIONS.md, GAME_DESIGN.md, ARCHITECTURE.md, README.md och DEV_LOG.md.

## RTS-069 – En särskild enhet eller förmåga per fraktion

**Status:** Done.

**Goal:** Aktiverbara försvarshållning/raseri för markerade stridsenheter.

**Requirements:** Kronförbundet: 25 % mindre inkommande skada. Järnklanen: 25 % mer utgående skada, även ranged/siege vid skott. Effekt 5 gameplay-s, cooldown 20 s från aktivering, inga resurser. Knapp och E-hotkey använder samma guarded command; bara markerade levande combat-units utan cooldown aktiveras. Blandad selection påverkar inte workers. Selection/orders bevaras; UI visar namn och valda units effekt/cooldown. Inga dolda mål behövs; befintlig fog-filtered combat kvarstår. Timers fryser vid paus/game over, save/load bevarar dem och restart återställer. Stora delta delas vid effektslut och använder rätt damage per tidsdel. Config innehåller balansvärden.

**Non-goals:** Nya unittyper/assets, mana, AI-aktivering, AoE-buffs, nya målregler och generell combatrefaktorering.

**Dependencies:** RTS-068.

**Acceptance criteria:** Båda förmågor ger rätt skademultiplikator under exakt effektfönster, återaktivering blockeras tills cooldown slut, workers/andra units/orders påverkas inte. Ranged skada bevaras på avfyrad projektil. Pause/terminal och fog ger ingen extra effekt eller dold information; Save/load/restart fungerar.

**Tester:** Aktivering/mixed selection/repeat/cooldown, melee/ranged/defense och upgrades, tidssteg/expiry, fog, paus/outcome/save/reset och ogiltiga timers. Alla tidigare tester, typecheck/build, browserinput/diffgranskning.

**Docs:** BACKLOG.md, DECISIONS.md, GAME_DESIGN.md, ARCHITECTURE.md, README.md och DEV_LOG.md.

## RTS-070 – Fraktionsval och balans

**Status:** Done.

**Goal:** Verifiera att båda fraktionerna kan spelas till vinst/förlust med riktiga resurser och isolerade matchval.

**Requirements:** Speltestmatris över befintliga fem scenarios/tre svårigheter med båda fraktionerna; egna kostnader och förmågor, fog-begränsade kommandon, paus/save/load, bevarade resursledger och fresh restart. Inaktivt försvar ska kunna förlora utan injicerad skada. Browser: naturlig Utposten/Normal med economy/build/produktion/attack/förmåga för båda val; fraktionsbyte/reset och terminal input/freeze kontrolleras. Dokumentera faktiska tider, kostnader, HP, begränsningar och eventuella balansändringar. Ändra bara verifierade blockerande balansvärden om testen kräver det.

**Non-goals:** Nya regler, enheter, AI-ekonomi, nya kartor, skillnivågaranti och grafikpolish.

**Dependencies:** RTS-069.

**Acceptance criteria:** Båda fraktioner har dokumenterade legala vinster och verklig defeat från enemy-attacker; val/state isoleras mellan nya matcher. Befintlig regressionssvit, typecheck/build och browser passerar. Preliminär balans redovisas utan påstående om statistiskt bevisad jämnhet.

**Tester:** Båda fraktioners beteendematris, naturlig defeat, förmågeanvändning, resursledger, Save/pause/terminal freeze och faction/state-isolering. Browser och diffgranskning.

**Docs:** BACKLOG.md, DEV_LOG.md, DECISIONS.md, GAME_DESIGN.md, ARCHITECTURE.md, README.md och RELEASE_CHECKLIST.md.

## RTS-071 – Fiendearbetare samlar guld och trä

**Status:** Done.

**Goal:** Riktig fiendeekonomi genom delade ändliga noder, last och leverans.

**Requirements:** Två initiala synliga/angripbara enemy-workers i Skirmish/Belägringen, en för wood och en för gold. Återanvänd samma movement/gathering/capacity/rate/delivery-regler med enemy-basens faktiska footprint. Noderna är gemensamma; workers och båda saldon kan inte skapa resurser eller gå negativa. Enemy-production betalar sin kostnad ur banksaldo inklusive verkliga leveranser. Ingen ny automatisk income. Global servicekö/separation/fog gäller båda sidor; enemy-workers attackerar inte eller tas i stridsgrupper. Död bokför förlorad last; basdöd stoppar arbetet. Save/load/pause/game-over/reset fungerar; äldre snapshots får inga gratis nya workers vid Load. Developer-fixturen siege-test behåller den äldre isolerade budgetprofilen.

**Non-goals:** Worker-produktion, nya noder, byggande, expansion, retreat, ekonomiprioriteringar och vision-begränsad resursupptäckt (senare tasks).

**Dependencies:** RTS-070.

**Acceptance criteria:** Enemy-workers går till riktiga noder, samlar högst 5 och levererar inom 24 px från bas-footprint. Saldot ökar först vid leverans; delade resurser och alla laster/saldon/kostnader/lostCargo bevaras. Nyproduktion betalas av faktisk enemy-ekonomi. Workers är synliga med rätt fraktionssprite endast enligt fog och kan dö av spelarattacker. Load bevarar last/orders/bank utan extra income/units.

**Tester:** Delad nod/range/capacity/delivery/ledger, depletion/base death/worker death, betald produktion efter leverans, save/migration/freeze/reset/fog och båda fraktioner; tidigare regressioner/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DEV_LOG.md, DECISIONS.md, GAME_DESIGN.md, ARCHITECTURE.md och README.md.

## RTS-072 – AI bygger farms och produktionsbyggnader

**Status:** Done.

**Goal:** Betald AI-barracks och supply-farm med verkligt worker-bygge.

**Requirements:** Nya Skirmish/Belägringen-matcher bygger en barracks först (40 wood, 64px, 5s arbete); production kräver färdig barracks och spawn sker där. AI bygger högst en farm (20 wood, 64px, 5s, +5 supply) när used+reserved närmar sig bas-cap8. Workers räknas i fysisk population; difficulty army-cap kvarstår som ytterligare gräns. Återanvänd placement/cost/construction/supply. Bounded kandidatlista och retry; ogiltig plats drar inget. Builder byter till bygge och bevarar last; efteråt gathering. Död/blocked builder kan ersättas av levande worker; en site byggs i taget. Byggnader är enemy-owned, fog-filtrerade, angripbara och riktiga hinder. Save/load/pause/terminal/restart; gamla saves får inga gratis byggnader och behåller base-production tills restart. Siege-test behåller isolerad legacy-modell.

**Non-goals:** Forge/upgrades, flera produktionsbyggnader/farms, nya units/worker-produktion, expansion, ekonomiprioritering utöver barracks/supply och nya grafiktillgångar.

**Dependencies:** RTS-071.

**Acceptance criteria:** Kostnader betalas exakt en gång; giltiga footprints utan body-överlapp eller blockerad worker-väg. Byggtid tickar bara vid nåbar worker-kontakt. Ingen ny production/spawn före färdig barracks; verklig supply begränsar köstarter och färdig farm ger +5. Blockering/död bevarar site/kostnad och begränsade retries kan återuppta. Load ger inga gratis enheter/byggnader/resurser.

**Tester:** Betalning/ogiltig placement/byggkontakt/tid, blockerad och död builder, lastbevarande, barracks-gated production/spawn, used/reserved/farm-cap, byggnadsdöd/obstacle cleanup, save/migration/reset/freeze och regressioner/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DEV_LOG.md, DECISIONS.md, GAME_DESIGN.md, ARCHITECTURE.md och README.md.

## RTS-073 – AI prioriterar ekonomi, armé och uppgraderingar

**Status:** Done.

**Goal:** En verifierbar begränsad budgetpolicy för AI-ekonomi, armé och Forge.

**Requirements:** Barracks och nödvändig supply behåller prioritet. Bygg en betald Forge (40 wood/10 gold, 5s arbete) efter minst tre levande army-units; en site åt gången. Spara resurser för Forge, sedan attack1 och defense1 (40/10, 8s vardera), medan redan betalda köjobb fortsätter. Om levande armé sjunker under tre prioriteras ersättningsarmé före nya uppgraderingar. Två befintliga workers prioriterar wood när gold-riktvärdet är fyllt och wood saknas; byt bara idle/tomma gather-orders och bevara last. Återanvänd kostnad, bygge, research och configmultiplikatorer. Enemy-upgrades påverkar endast enemy-stridsenheter, aldrig workers/byggnader/spelaren. Fog-filter och begränsade retries kvarstår. Save/load/pause/terminal/reset och betald ledger; gamla saves får ingen ny policy eller gratis Forge/levels.

**Non-goals:** Nya units, worker-produktion, expansion, ny fraktionsbalans, obegränsad planering, debug-HUD och spelarens research-policy.

**Dependencies:** RTS-072.

**Acceptance criteria:** Dokumenterad prioritet växlar utan oändliga loops. Cost dras en gång, Forge/research kräver verkligt bank/builder/tid, buff först efter research. Betalda jobs fortsätter under budget-reservation. Arméförlust öppnar nyrekrytering. Last/wood/gold bevaras under resursbyte och alla betalningar. Båda fraktioner och äldre saves fungerar.

**Tester:** Prioritetsgränser/supply/army-loss, budget/cost/time, Forge-required och cancellation vid död, korrekt enemy-only attack/defense, workers resursbyte/last/ledger, save/migration/freeze/reset samt tidigare tester/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DEV_LOG.md, DECISIONS.md, GAME_DESIGN.md, ARCHITECTURE.md och README.md.

## RTS-074 – AI expanderar och återhämtar sig efter förluster

**Status:** Done.

**Goal:** Betald återhämtning av AI-ekonomin och avgränsad expansion.

**Requirements:** Basen ersätter förlorade workers till initialt två med spelarens worker-kostnad20 wood/träning5s, en betald produktion i taget, verklig supply och giltig spawn. Unika monotona ID:n, idle/tom last, inga gratis units. Ersättningsbehov prioriteras före nya army/research-betalningar; betalda jobb fortsätter. Befintlig byggpolicy återuppbygger förlorade sites med nya kostnader. Basdöd/game-over stoppar återhämtning. Save/load/restart bevarar/resetter verklig produktion och ledger. Användaren har valt extra resursbas: högst en enemy-outpost nära befintliga noder,80wood/20gold,96px-footprint/240HP,10s arbetarbygge. Betald efter färdig barracks, minst tre levande army och attack1/defense1; befintliga noder måste ha resurser. Färdig resursbas ger en alternativ närmaste nåbar leveranspunkt och +8 supply. Tre begränsade kandidater/1s retry. Ingen worker-produktion från extra basen; huvudbasens död behåller tidigare victory-villkor. Angripbar/fog/hinder, builderbyte, kostnadsbelagd återuppbyggnad, save/reset.

**Non-goals:** Gratis income/enheter, nya resursarter, obegränsad expansion, avancerad ekonomi, ersättning efter matchslut och information-systemet i RTS-075.

**Dependencies:** RTS-073.

**Acceptance criteria:** Betald ersättning efter en/båda worker-förluster utan dubbel kostnad/spawn, fungerande nytt arbete/bygge och supply. Byggnadsförlust kan återhämtas med verkliga resurser. Betald resursbas kräver byggtid; supply/leverans gäller enbart färdig levande bas. Förstörelse tar bort dessa effekter och återuppbyggnad kostar igen. Ingen gratis ny policy vid migration.

**Tester:** Worker-kostnad/tid/supply/ID/spawnblockering, betalda jobb och prioritet, ledger/last/död, återuppbyggnad, expansion, save/migration/pause/reset samt tidigare tester/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DECISIONS.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md och README.md.

## RTS-075 – AI utforskar och använder begränsad information

**Status:** Done.

**Goal:** AI-ekonomi och strategiska anfall utgår från egen upptäckt, inte dolda spelartillstånd.

**Requirements:** Ny match har enemyKnowledge med sist observerade noder och spelarbasposition. Uppdatera minne enbart från enemy-teamets syn; ingen uppdatering av dold nodmängd. Workers söker resurser via avgränsade fasta terräng-waypoints innan gather-order mot okänd nod. Ekonomi/budget/expansion använder kända nodvärden; faktisk extraction fortsätter följa fysisk nod och ger inga extra resurser. Anfallsgrupper söker via fasta terräng-waypoints tills spelarbasen observerats, sedan mot senaste kända plats. Inga attacker på osynliga targets. Egen ekonomi och statisk arena-terrain är kända; fysisk collision/placement/spawn-validering är fortsatt auktoritativ, inte strategiskt minne. Högst en scouting-worker, lastad/buildande worker avbryts inte. Save/load/pause/restart; äldre snapshots behåller sin policy utan tillagd gratis kunskap.

**Non-goals:** Slumpmässig planner, generell scouting-armé, avancerad information/AI-ekonomi, ändrad fog för spelaren och nya kartor.

**Dependencies:** RTS-074.

**Acceptance criteria:** Dolda nodmängder/spelarpositioner ändrar inte strategiska orders/minne; synlig upptäckt gör det. Begränsat scoutflöde upptäcker resurs och bas i befintlig arena. Förlorad scout ersätts med befintlig betald recovery. Fog/attack-filter och resource ledger bevaras. Sparbart minne valideras och restart rensar det.

**Tester:** Hidden-state-par, observerad uppdatering/sista kända position, scout-order/last/begränsning, grupp-anfall utan känd bas, ekonomi/expansion-policy, save/migration/paused/restart och tidigare tester/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DECISIONS.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md och README.md.

## RTS-076 – Tre skirmish-kartor med olika terräng och resurser

**Status:** Done.

**Goal:** Tre handgjorda skirmish-kartor med olika landterräng och resursfördelning.

**Requirements:** Befintlig arena bevaras; lägg till Skogspasset och Flodkröken som enkla TS-profiler. Samma1280x960/32px, startpositioner och wood/gold-nodpositioner; tydligt olika rock/water-patches och ändliga wood/gold-mängder (arena400/300, skog500/250, flod350/400). Ingen ny stock under match. Giltiga worker/army-spawns och vägar mellan baser/noder. Terränggrafik, minimap, fog-LOS och fysisk map måste använda samma profil. Enkelt kartval i Skirmish-menyn; övriga scenarios behåller arena. Båda fraktioner, befintlig ekonomi/produktion/AI, restart och save/load bevarar kartval/stock. Gamla saves migreras som arena; okända/inconsistent map-ID:n avvisas atomiskt.

**Non-goals:** Större värld, fler noder/resursarter, slumpkartor, editor, sjönavigation, nya missions och inställningspolish i RTS-077.

**Dependencies:** RTS-075.

**Acceptance criteria:** Tre spelbara distinkta profiler; båda fraktioner kan samla/bygga/producera/anfall i varje karta. Body-clearance/nåbarhet och finite ledger verifieras. Rendering/minimap/LOS matchar nav-hinder. Save/load och restart behåller karta utan att någon profilstock blandas med annan.

**Tester:** Profilstock/terrain, spawns/resources/routes/byggplatser, fraktionsekonomi och paid fullmatch-flöde, map-save/strict migration/restart samt tidigare tester/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DECISIONS.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md och README.md.

## RTS-077 – Matchinställningar för karta, fraktion och svårighet

**Status:** Done.

**Goal:** Befintliga val appliceras konsekvent och presenteras tydligt före Start.

**Requirements:** Återanvänd befintliga dropdowns. Ren atomisk validering av scenario/map/faction/difficulty; okända värden/fält och ogiltiga par avvisas utan att ändra session. Bara menu tillåter val. Scenario-byte från skirmish till mission/survival återgår till arena; explicit alternativ karta i icke-skirmish avvisas. Visa menyns aktuella profilstock, fraktionsförmåga och begriplig difficulty-beskrivning. Start använder samma val; aktiva val låses. Pause/load/restart bevarar faktiska val och Ny match kan välja nya. Båda fraktioner x tre kartor x tre difficulties fungerar vid initiering/save/restart; äldre missionflöden bevaras.

**Non-goals:** Nya spelvärden, balans, ekonomi-HUD-polish, fler inställningar, seed/editor, persistence av menypreferenser och implementering av resultatsystemet i RTS-078.

**Dependencies:** RTS-076.

**Acceptance criteria:** Validerade val motsvarar riktig factory-data; sammanfattning följer menuval, inga dolda inkonsistenta map/scenario-par. Felaktigt event/input eller ändring under match ändrar inte val/state. Save/load/restart bevarar scenario/map/faction/difficulty och Ny match isolerar förra matchens state.

**Tester:** Atomiska invalid-patches, giltiga kombinationer/normalisering, menylåsning,18 factory/save/restart-kombinationer, faktisk browser-menu/Start/pause/load/restart och tidigare tester/typecheck/build/diff.

**Docs:** BACKLOG.md, DECISIONS.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md och README.md.

## RTS-078 – Matchresultat med ekonomi- och stridsstatistik

**Status:** Done.

**Goal:** Visa matchresultat och verifierbar ekonomi/strid efter game over.

**Requirements:** Ren härledd statistik från befintlig finite stock/banker/last/loss-ledger och monotona spawn-counter; ingen separat eventhistorik eller dubbel persistent state. Visa outcome, gameplay-tid, scenario/map/fraktion/difficulty och båda teams insamlat, levererat och netto spenderat wood/gold, tillkomna enheter, enhetsförluster och besegrade enheter. Netto spenderat inkluderar avdrag minus refunds, även betalda ofärdiga jobb; enhetsstatistik utesluter byggnader och initiala units i tillkomna. Resultatvyn syns endast efter terminal outcome, aldrig dold enemy-ekonomi under match. Game-over freeze bevarar resultat; Save/load återskapar samma vy och restart/Ny match döljer/resetter den. Legacy-saves visar enbart data som kan härledas utan hittad historik. Bas/våg/producer/dead-worker-counters och ledger används enligt verkligt state. Tydlig decimalavrundning i resultatvyn.

**Non-goals:** Gross spend/refund-eventhistorik, damage/APM, byggnads-killhistorik, konto/highscore, export, match-arkiv, ombalansering och generell HUD-polish.

**Dependencies:** RTS-077.

**Acceptance criteria:** Verklig insamling/leverans/spending/refund och produktion/död ger korrekta totals; enemy-metrics duplicerar inte shared stock. UIresultat stämmer med model efter victory/defeat och bevaras under freeze/Save/load. Start/restart har noll nya units/insamling/spend/förluster och korrekt profil. Legacy utan ekonomi-ledger ges inga gratis incomesiffror.

**Tester:** Last vs leverans, betald/refunderad queue/site, verklig spawn/death/waves/recovery, finite resource-ledger, terminal/Save/restart, UI-presenter och tidigare tester/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DECISIONS.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md och README.md.

## RTS-079 – Balans för längre skirmish-matcher

**Status:** Done.

**Goal:** Verifiera spelbar och ändlig skirmish-ekonomi över längre matcher på alla tre kartor.

**Requirements:** Kör betalda spelarstrategier för tre kartor, två fraktioner och tre svårighetsgrader. Följ faktisk insamling, leverans, kostnader, laster och förluster genom hela matchen; ingen injicerad ekonomi eller HP. Kontrollera långvarigt passivt spel och att terminal simulation fryser. Dokumentera matchtider och utfall samt begränsningen till testade strategier. Justera endast config om konkreta balansfel påvisas. Behåll budget-/fog-/kostnadsregler, ingen gratis AI-inkomst. Save/load mitt i match och resultat vid slut ingår.

**Non-goals:** Nya enheter eller system, optimal AI, multiplayerbalans, garanterad lika vinstchans, schemaändring, grafik/HUD-polish och bundle-varningen.

**Dependencies:** RTS-078.

**Acceptance criteria:** Alla 18 konfigurationer har en betald vinnande strategi inom fem gameplay-minuter; ekonomin bevaras vid observationer och matchslut. Passivt spel ger dokumenterat terminalt utfall utan gratis resurser eller oändlig simulation. Faktiska längre browserflöden verifieras om möjligt. Balansvärden ändras endast med reproducerbar grund.

**Tester:** 18 hela command-baserade matcher med kontinuerlig resource-ledger och Save/load, passiva matcher och terminalfreeze; tidigare tester, typecheck/build, browser och diffgranskning.

**Docs:** BACKLOG.md, DEV_LOG.md, GAME_DESIGN.md, DECISIONS.md, ARCHITECTURE.md och README.md.

## RTS-080 – Verifierad release av tvåfraktionsversionen

**Status:** Done.

**Goal:** Verifiera och publicera den befintliga tvåfraktionsversionen.

**Requirements:** Sammanställ aktuell scenario/fraktion/difficulty- och skirmish/karta-matris. Kör befintliga tester/typecheck/build i ren kopia. Verifiera originalassets, manifester och licens/proveniens samt Save-migrationstester. Kontrollera publicerad Pages-version mot lokal dist och browser-menu/selection/orders/save/restart/assets/ljud. Mät befintliga belastningsfixtures och budget; dokumentera faktisk metod och begränsningar. Återanvänd tidigare kontroller utan påståenden om ännu ej testade browsers eller naturlig fullmatris.

**Non-goals:** Nya gameplay-system, nya assets, extern licensiering, andra browsermotorer/mobil, deploymentplattform-byte och bundle-varningsfix.

**Dependencies:** RTS-079.

**Acceptance criteria:** Ren installation och alla checks passerar; publicerad runtime motsvarar verifierad build; tvåfraktionsflöden, save-kompatibilitet, assets och prestandabudget redovisas korrekt utan blockerande fynd.

**Tester:** Befintlig fullsuite och Save/asset-regressioner, clean install/typecheck/build, lokal/public browser och befintlig profile-browser. Dokumentation-only kräver inga nya spegeltester.

**Docs:** BACKLOG.md, DEV_LOG.md, RELEASE_CHECKLIST.md, PERFORMANCE.md, README.md och assets/README.md vid behov.

## RTS-081 – Vattennavigation och kustregler

**Status:** Done.

**Goal:** Explicita och återanvändbara land/vatten/kustregler för nästa hamnslice.

**Requirements:** Härled vatten från kartprofilens verkliga terräng. Återanvänd befintlig square-body/swept-segment/BFS för en vattenadapter; vattenkroppar måste helt ligga i vatten, landkroppar behåller reglerna. World bounds, kroppsstorlek, sammanhängande vatten och byggnadsobstacles gäller. Definiera kustfootprint som inom världen, positiv area på både land och vatten, utan sten eller befintlig byggnad. Inga självständigt sparade terrängkopior. Save/load/reset rekonstruerar samma regler från befintlig map-ID. Testa orderplan/advance/replan och land-regressioner. Browser verifierar befintliga landorders vid vatten.

**Non-goals:** Fartygsenheter/UI/produktion (RTS-082), sjöstrid, transport, ny karta, diagonalnavigation och ändrad Save-schema.

**Dependencies:** RTS-080.

**Acceptance criteria:** Vattenroute når exakta mål inom sammanhängande vatten utan att korsa land, sten eller byggnader; fel domän/storlek/gränser blockerar. Kust har tydliga geometriska villkor och ingen påverkan på landnavigationen. Save/load/reset ger samma härledda routes, tidigare beteenden bevaras.

**Tester:** Domängränser/storlek/swept segments, anslutna/separerade vattenområden, giltig/ogiltig kust, route/order/revision, Save/reset och befintliga landnavigationstest; fullsuite/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, DECISIONS.md, GAME_DESIGN.md och README.md.

## RTS-082 – Hamnplacering och fartygsproduktion

**Status:** Done.

**Goal:** Bygg en hamn vid synlig kust och producera ett styrbart fartyg med verklig ekonomi.

**Requirements:** En hamn per spelare,64x64/grid32,40 wood/10 gold,160HP och5s faktiskt workerbygge. Använd befintligt placement-preview/cancel, builder/order-state och kustregler; giltig workeråtkomst samt fri vattenutgång krävs. Fartyg40 wood/15 gold,8s,2 supply,32px kropp/110px/s/90HP; båda fraktioner samma preliminära recipe. Befintlig FIFO max3 och refundpolicy återanvänds, kostnad dras vid enqueue. Blockerad spawn väntar utan extra kostnad. Fartyg har unika ship-ID:n, börjar idle/omarkerat, stöder klick/drag och högerklickmove i vatten; land/gather/attack stöds inte i denna slice. UI bevarar selection/orders. Global supply omfattar land och fartyg inklusive alla reservations. Save/load/pause/game-over/restart omfattar hamn/job/ships utan duplicerad ekonomi. Placeholder-hamn/fartyg tydligt märkta tills RTS-089.

**Non-goals:** Sjöstrid (RTS-083), transport, sjö-AI, nya kartor, fraktionsbalans och färdiga sjöassets.

**Dependencies:** RTS-081.

**Acceptance criteria:** Faktiskt gather→kustbygge→betald produktion→vattenspawn→selection/move fungerar för båda fraktioner. Felaktig placering/start kostar inget, FIFO/refunds/supply och blockerad utgång är konsekventa. Save/load och restart bevarar/resetter hela aktuella state. Befintliga landflöden passerar.

**Tester:** Kust/builder/exit, kostnad och construction, queue/tid/refund/pop/spawn, ID/selection/orders, Save och reset, tidigare fullsuite/typecheck/build samt browser.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, DECISIONS.md, GAME_DESIGN.md och README.md.

## RTS-083 – Stridsfartyg med distansattack

**Status:** Done.

**Goal:** Manuell fog-säker fartygsattack och verkliga motmedel vid kusten.

**Requirements:** Markerade fartyg får attack-order vid högerklick på synlig befintlig fiende. Range192 world px till target-footprint,16 damage/1,5s, projektilspeed280/lifetime3/hitRadius20; båda fraktioner samma preliminära värden. Fartyg söker giltig vattenkontakt inom range och fri skottlinje; de går aldrig upp på land. Återanvänd befintliga fixed-aim/projectile/HP/delta-regler. Vatten blockerar inte marina projektiler, sten/byggnader gör det. Dolda/ogiltiga mål tas bort från order utan informationsläcka; målbyte/move/Stop fungerar och avmarkering avbryter inte attack. Fartyg och hamn blir giltiga mål för befintliga fiender; attacker kräver deras syn och fysisk kontakt från land. Befintliga army-upgrades gäller fartyg; fraktionsförmågan för landunits gör det inte. Döda fartyg/hamn städas med supply/refs/jobs/obstacles, projektilsaves återställs och terminal freeze bevaras. Visa HP med enkel text/placeholder-projektil.

**Non-goals:** Fiendeflotta/sjö-AI (RTS-086), transport, nya kartor, automatiska marina patrol/attack-move-orders, splash och slutliga assets/ljud.

**Dependencies:** RTS-082.

**Acceptance criteria:** Betalt fartyg kan skada/döda synlig fiende med tids/range/LOS-regler. Rörelse till skjutkontakt förblir i vatten och skott skadar inte osynliga mål. Fartyg kan skadas/dö från riktiga kustattacker och hamnens death städar korrekt. Match/save/reset/input och tidigare landcombat bevaras.

**Tester:** Range/movement/contact/cooldown, fixed aim/LOS/fog/projectiles, kustdamage/death/cleanup, delta-equivalence, orderbyten, Save/migration/terminalfreeze och tidigare fullsuite/typecheck/build/browser.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, DECISIONS.md, GAME_DESIGN.md och README.md.

## RTS-084 – Transportfartyg med lastning och landsättning

**Status:** Done.

**Goal:** Betalt transportfartyg som bär befintliga egna landenheter över vatten.

**Requirements:** Hamnens delade FIFO kan producera obeväpnad transport:40wood/10gold,8s,2supply,90HP,110px/s,32px body. Fyra passagerarplatser, alla befintliga egna landtyper. Flytta markerade landenheter till synlig kust inom64px och högerklicka transporten för omedelbar lastning; ingen automatisk boarding-kö. Giltig kropp/rak fri lastkontakt krävs, annars oförändrat. Lastade enheter behåller ID/HP/archetype/wood/gold-last men blir idle/omarkerade, tas ur marksimulation/syn/selection och behåller supply. Välj transport, Landsätt, vänsterklicka synlig fri landpunkt inom64px; atomisk placering av alla passagerare på giltiga separata landkroppar, annars ingen förändring. Escape/högerklick avbryter mode. Last påverkar inte andra orders. Transport kan röra sig men inte attackera. Sänkning dödar passagerarna och bokför förlorad resurslast en gång. Save/load/restart, grupper, statistik och freeze bevaras.

**Non-goals:** Automatisk boarding/pursuit, transport-AI, ny karta, särskilda transportassets/ljud, formationer eller ändrade landcombat-regler.

**Dependencies:** RTS-083.

**Acceptance criteria:** Betald transport lastar/förflyttar/lämnar av befintliga units utan dubblering, ID-förlust eller supply-exploit. Ogiltig/full/fjärran lastning och ogiltig landsättning är säkra. Loaded units simuleras inte på land. Sänkning och Save behåller korrekta cargo/refs/resultat.

**Tester:** Betalning/FIFO/spawn, lastkapacitet/range/LOS/selection, giltig/ogiltig landsättning/occupancy, identitet/last/supply, death/save/migration/freeze; alla tester/typecheck/build och browser.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md.

## RTS-085 – Ökarta med land- och sjöstrid

**Status:** Done.

**Goal:** Handgjord skirmish-karta där vatten skiljer baserna och en betald transport kan föra armén till fiendeön.

**Requirements:** Ny karta Öarna i menyn,1280x960/32px, två åtskilda landmassor och sammanhängande vatten runt/mellan dem. Befintliga bas-/worker-spawns, wood650180; gold flyttas på denna profil till600300. Ändliga800wood/400gold på spelarön gör hamn/transport/armé möjliga utan gratis resurser. Egna giltiga kustplatser, vattenrutter och enemy-öns landningsplatser. Inga markrutter över vattnet. Terräng/fog/minimap/Save/restart använder samma profil. Enemy land-scout-waypoints hålls på fiendeön utan dold basinformation. Verifiera faktiskt betald produktion/lastning/landstigning/landstrid till victory för båda fraktioner; befintliga landkartor bevaras.

**Non-goals:** Procedural generation, fler resursnoder, transport-/sjö-AI (RTS-086), nya balanssystem eller assets. Enemy använder befintligt ändligt startkapital och kan inte ta sig över före086.

**Dependencies:** RTS-084.

**Acceptance criteria:** Öarna kan slutföras med transport och landstrid utan fastlåst resurs-/supply-progression; vatten hindrar markväg men tillåter flotta, synlig giltig landning och full Save/restart.

**Tester:** Land/vatten-connectivity/coast/spawns/finite stock/profile positions, betald transport+armé+strid för båda fraktioner, Save/migration/minimap/fog/settings; tidigare landmatrix/typecheck/build och verkligt browserflöde.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md.

## RTS-086 – Sjö-AI och landstigningsanfall

**Status:** Done.

**Goal:** Ett verkligt betalt, fog-säkert AI-landstigningsanfall på Öarna.

**Requirements:** Färsk Öarna-match ger AI konfigurerat ändligt extra startkapital120wood/30gold för hamn/transport/landarmé, aldrig passiv inkomst. AI bygger hamn864320 med verklig worker-kontakt och betalar befintliga priser. Hamnens FIFO producerar högst en obeväpnad transport med samma8s/40wood/10gold/2supply som spelaren; verklig bank/supply/spawn används. Två befintliga betalda stridsenheter går till synlig kust, lastas, korsar vatten och landsätts på giltig synlig landpunkt. Preliminär starttid Easy260/Normal220/Hard190 gameplay-sekunder. Publika terrängvägpunkter styr utforskning innan en spelarbas faktiskt observerats; mål/skott/input lämnar inte dold state. Landstigna enheter använder befintlig landstrid och kan förstöra spelarbasen. Spelarens stridsfartyg kan sänka transporten; passagerare/counters/supply/refs/resultat städas utan gratis ersättning. Save/load mitt i bygge/kö/transport/landstigning och restart/gameover fungerar. Äldre saves får inte gratis kapital eller flotta.

**Non-goals:** AI-stridsfartyg/automatisk kanonflotta, flera samtidiga transporter, återuppbyggnad av sänkt transport, workertransport/resursnoder, ny generell AI-ekonomi eller nya slutliga assets. Balans följer087.

**Dependencies:** RTS-085.

**Acceptance criteria:** Betald AI-transport lastar riktiga producerade units och genomför ett fog-säkert landstigningsanfall till basdamage/defeat. Spelaren kan stoppa anfallet genom riktig skada på transporten. Inga enhets-/resurs-/supply-duplicationer och äldre landkartor/matchsaves bevaras.

**Tester:** Verkliga priser/kontakt/timer/supply/spawn/ID och resource-ledger, boarding/landing/HP/death/städning, begränsad syn/terrängvägpunkter, mellanfas-saves/legacy migration/restart/freeze, fullsuite/typecheck/build och browserattack/counterplay.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md.

## RTS-087 – Balans mellan landarmé, flotta och transporter

**Status:** Done.

**Goal:** Verifiera ändlig ekonomi, supply och fungerande motmedel på Öarna.

**Requirements:** Spela båda fraktioner × Easy/Normal/Hard med verklig insamling och betald kasern/armé/hamn/transport till victory. Verifiera passiv defeat och betalt kanonfartyg som stoppar landstigning. Dokumentera tider, resurskostnader och supply. Ändra endast configbalans om faktiskt blockerande resultat kräver det; inga gratis resurser eller enheter. Befintliga landkartor bevaras.

**Non-goals:** AI-kanonflotta, fler transporter, nya ekonomisystem, formationer, pathfindingändringar och grafikpolish.

**Dependencies:** RTS-086.

**Acceptance criteria:** Sex fraktions-/svårighetskombinationer kan vinna med betald transportarmé; passivt spel förlorar; betalt stridsfartyg kan stoppa transporten. Resurs-/supplykostnader och balansens begränsningar är dokumenterade.

**Tester:** Betalda sexmatchers victory/counter-matriser och sex passiva matcher, resource-ledger, tidsgränser, fullsuite/typecheck/build och verkligt browserflöde.

**Docs:** BACKLOG.md, DEV_LOG.md, GAME_DESIGN.md, DECISIONS.md och README.md.

## RTS-088 – Sjöuppdrag och save/load-/fog-of-war-regressioner

**Status:** Done.

**Goal:** Ett spelbart sjöuppdrag med säkert sparat transport-/stridstillstånd.

**Requirements:** Uppdrag4 – Överfarten använder fast Öarna-profil, befintlig betald transport/armé och målet förstörd fiendebas med egen bas vid liv. Startkapital20wood/10gold och samma ändliga naval-AI; inga nya objectivesystem. Meny/restart/save bevarar uppdrag/map/fraktion/svårighet. Save mitt i own/enemy-transport och marineprojektilflykt ska ge samma fortsatta resultat, utan fog-läckor. Paus/terminalfreeze/defeat priority och gamla saves bevaras.

**Non-goals:** Kampanj, nya kartor, gratis startflotta, escortsystem och nya combatregler.

**Dependencies:** RTS-087.

**Acceptance criteria:** Uppdraget kan vinnas med betald landstigning och förloras av basdöd; samtidig defeat prioriteras. Sparad överfart/skott återställs med samma last/ID/order och synliga mål; dold state visas inte efter load.

**Tester:** Meny/map-normalisering, båda fraktioners betalda uppdragsflöde, victory/defeat/priority/freeze, transport-/projektilresume/fog, migration, tidigare fullsuite/typecheck/build och browseruppdrag/save.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md.

## RTS-089 – Presentation och ljud för fartyg och kust

**Status:** Done.

**Goal:** Sammanhängande original pixelpresentation för befintlig sjöstrid.

**Requirements:** Ersätt geometriska own/Enemy-fartyg och hamnplaceholder med repoegna assets i befintlig palett. Strids-/transportfartyg har skilda silhuetter, åtta riktningar, idle/rörelse/attack/sjunkframes, lag- och fraktionsvarianter. Hamn har tre byggstadier. HP/selection/last/projektiler förblir läsbara. Befintlig kustterräng bevaras. Lägg original kanon-/sjunkljud genom befintliga gesture/mute/volym/paus-regler; dolda händelser/reveal/hide är tysta. Reset/fog städar sprites/effects utan simulationsevents från animationer. Dokumentera källor/licens/export.

**Non-goals:** Nya gameplayregler, AI-kanonfartyg, fraktionsbalans, vattenfysik och ny renderpipeline.

**Dependencies:** RTS-088.

**Acceptance criteria:** Betalda fartyg/hamn visas med läsbara original sprites/byggstadier och riktad rörelse/attack/sjunkning, korrekt lag/fog/reset. Sjöljud fungerar i browser efter gesture och följer mute/paus utan dold informationsläcka.

**Tester:** Frames/riktning/freeze/death, naval audio-eventvisibility/throttle och assetexport; fullsuite/typecheck/build, screenshots och browseranimation/ljudkontroll.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, README.md, assets/README.md och assets/licensdokument.

## RTS-090 – Verifierad release med sjöstrid

**Status:** Done.

**Goal:** Publicerad och verifierad sjörelease, med bevarad landversion.

**Requirements:** Slutlig fullsuite med land/sjö/fraktion/map/uppdrag/save/fog/restart-matriser; strict typecheck/build. Produktionsbrowser under Pages-subpath med korrekta assets/ljud, betalda navalflöden och lokal save/reload. Mät64/128 arméer samt naval render/combat med uttryckliga loadfixtures, JSheap och10restart. Behåll befintliga budgetar och bundlevarning. Granska diff/docs/refs och publicerad runtime/Actions. Dokumentera faktisk browserprofil, resultat och begränsningar.

**Non-goals:** Nytt gameplay, balanssystem, grafikpolish, fler browsermotorer och bundle-splitting.

**Dependencies:** RTS-089.

**Acceptance criteria:** Checks gröna; land- och navalmatris samt betald browsermatch/save fungerar. Uppmätt CPU/render/frame/heap och reset ligger inom befintliga budgetar. Pages-deploy lyckas och publicerade assets/runtime motsvarar verifierat bygge; dokumentation beskriver korrekt spel/release.

**Tester:** Fullsuite/typecheck/build/diff/docs, produktions-subpath/browser/saveload/audio och betalade sjömatcher,64/128 land/navalprofil och10restart, Actions/publicruntime-kontroll.

**Docs:** BACKLOG.md, DEV_LOG.md, README.md, GAME_DESIGN.md, ARCHITECTURE.md, RELEASE_CHECKLIST.md och PERFORMANCE.md.

## Milstolpe RTS-091–120 – Spelkänsla, design och användbarhet

Gemensamt: HUD/menyer fångar input; vänsterdrag selection, mittendrag kamera. Layout verifieras1280×720 och1920×1080, paus stoppar simulation, nya gameplay-inställningar bevaras av Save/restart. Skarp pixelgrafik och dokumenterat assetursprung/licens. Visuella tasks kräver granskade screenshots, ljudtasks faktisk lyssning. Saknade assets eller ej utförda checks får inte markeras klara. Taskvis checks, docs, granskning, commit/push utan force. Endast091–096 genomförs i denna körning.

## RTS-091 – Inventera befintlig presentation och kontroller

**Status:** Done.

**Goal:** Dokumentera brister och återanvändbara funktioner i UI, grafik, ljud, kamera och input.

**Requirements:** Dokumentera nuvarande UI/grafik/ljud/kamera/input med konkreta filreferenser, återanvändning, brister och prioritering.

**Non-goals:** Ingen runtimeändring, nya kontroller eller balans.

**Dependencies:** RTS-090

**Acceptance criteria:** Inventeringen skiljer faktiskt fungerande från planerat; täcker meny, HUD, assets, ljud, kamera, input, två upplösningar och tidigare verifieringsbegränsningar.

**Tester:** Dokumentgranskning, befintliga presentation/sessiontester, typecheck/build/diff; browserinventering med screenshots.

**Docs:** PRESENTATION_AUDIT.md, BACKLOG.md, DEV_LOG.md

## RTS-092 – Bestäm visuell riktning

**Status:** Done.

**Goal:** Skapa två referensvyer: startsida och spelvy. Definiera färgpalett, typografi och HUD-layout. Stil: klassiskt fantasy-RTS inspirerat av Warcraft 2, med egen identitet och egna eller licensierade assets.

**Requirements:** Skapa två granskningsbara referensvyer för startsida/spelvy. Definiera färgpalett, font-stack, HUD-layout och egen fantasyidentitet med befintliga originalassets.

**Non-goals:** Ingen spelimplementation, nya gameplayregler, kopierade originalassets eller extern fontdependency.

**Dependencies:** RTS-091

**Acceptance criteria:** Båda referensvyerna går att öppna, visar konsekvent typografi/palett/layout i båda målupplösningar och är granskade som screenshots. Framtida HUD-delar märks som planerade.

**Tester:** Visuell browsergranskning1280×720/1920×1080, inga doc-onlytester; relevanta befintliga tester/typecheck/build/diff.

**Docs:** VISUAL_DIRECTION.md, design/references.html, DECISIONS.md, BACKLOG.md, DEV_LOG.md

## RTS-093 – Skapa fantasy-startsida

**Status:** Done.

**Goal:** Sammanhängande design med titel och huvudmeny: Campaign, Skirmish, Load Game och Settings.

**Requirements:** Sammanhängande fantasy-startsida med Campaign, Skirmish, Load Game och Settings. Återanvänd fyra fristående uppdrag utan påhittad kampanjprogression, befintlig Save och ljudkontroller. Tangentåtkomst/back återställer menyn.

**Non-goals:** Nya uppdrag, kampanjprogression, HUD-ombyggnad, nya ljud eller persistens.

**Dependencies:** RTS-092

**Acceptance criteria:** Alla fyra ingångar fungerar; Campaign visar befintliga uppdrag, Skirmish befintliga lägen; Load använder validerad Save; Settings använder befintligt ljud. Menyinput ger inga orders och matchens paus/resultat förblir nåbara.

**Tester:** Menynavigationsbeteenden och sessionregressioner; browser fyra ingångar, load-fel, start/paus/återgång, screenshots i båda upplösningar; typecheck/build/diff.

**Docs:** README.md, GAME_DESIGN.md, ARCHITECTURE.md, BACKLOG.md, DEV_LOG.md

## RTS-094 – Matchinställningar

**Status:** Done.

**Goal:** Låt spelaren välja karta, fraktion, svårighet och spelhastighet. Visa kort beskrivning av karta och svårighetsgrad.

**Requirements:** Matchformulär med karta/fraktion/svårighet och separat spelhastighetsval. Visa karta/svårighetsbeskrivningar, bevara låsta uppdragskartor och validerade startval. I denna task är endast1× tillgängligt;0.75× införs funktionellt i108.

**Non-goals:** Beginner/balans107, tidskalning108, settingspersistens119, nya kartor.

**Dependencies:** RTS-093

**Acceptance criteria:** Startval motsvarar verklig match; kartlås och beskrivningar korrekta. Speed visar1× och förklarar framtida0.75× utan fungerande låtsasval. Save/restart behåller existerande options.

**Tester:** Options/sessiontester, beskrivningar/invalid/fixed map; browser fraktion/map/difficulty/start/restart, båda upplösningar; typecheck/build/diff.

**Docs:** README.md, GAME_DESIGN.md, ARCHITECTURE.md, DECISIONS.md, BACKLOG.md, DEV_LOG.md

## RTS-095 – Spelvy som fyller webbläsarfönstret

**Status:** Done.

**Goal:** Dölj startsidan helt när matchen börjar. Anpassa canvas och HUD vid resize. Verifiera korrekta input-koordinater efter storleksändring.

**Requirements:** Separat start- och spelvy; spelområdet använder fönstrets tillgängliga yta med responsiv canvas och nuvarande HUD. Resize uppdaterar Phaser-kamera/skalning utan att ändra world pixels/32pxgrid eller matchstate. Sessionknappar får egen spelverktygsrad.

**Non-goals:** Slutlig top/bottom HUD097–101, zoom, nya kameragester102–103 och fullscreen104.

**Dependencies:** RTS-094

**Acceptance criteria:** Startsida helt dold under match, canvas/HUD inom viewport i båda målupplösningar och efter resize; korrekta klick/drag/move/worldcoords med pan. Ingen gameplayinput genom HUD och paus/gameover bevaras.

**Tester:** Layoutmått/camerabounds och befintlig inputregression; browser resize medan playing/paused, klick/drag/move, HUD-isolering och Save/restart; screenshots; typecheck/build/diff.

**Docs:** README.md, ARCHITECTURE.md, DECISIONS.md, BACKLOG.md, DEV_LOG.md

## RTS-096 – Engelska i hela spelet

**Status:** Done.

**Goal:** Översätt menyer, HUD, tooltips, felmeddelanden, uppdrag, tutorial och resultat. Samla UI-texter på ett enkelt, konsekvent sätt.

**Requirements:** Engelska i all synlig meny/HUD/tooltips/feedback/uppdrag/tutorialguide/resultat samt dynamisk gameplayfeedback. Samla texter enkelt i konsekvent TypeScript-textmodul; stabila IDs och Saveformat bevaras. Docs kan vara svenska.

**Non-goals:** Nytt tutorialsyst109, i18nframework, nya språkval eller gameplayförändring.

**Dependencies:** RTS-095

**Acceptance criteria:** Synlig UI och användarvända fel är engelska; båda fraktioner/alla befintliga uppdrag/queue/resultat/Savefel omfattas. Inga språkberoende villkor eller bruten Save/ID.

**Tester:** Presentation/config/feedback/Save-sessionregressioner och textinventering; browser menu/match/paus/Savefel/resultat/uppdragsguide/screenshot; typecheck/build/diff.

**Docs:** README.md, GAME_DESIGN.md, ARCHITECTURE.md, DECISIONS.md, BACKLOG.md, DEV_LOG.md

## RTS-097 – Top bar

**Status:** Done.

**Goal:** Visa menyknapp, gold, wood och använd/max population utan att dominera världen.

**Requirements:**48px topprad med Menu, levererat gold/wood och population. Visa reserverad supply separat; inkludera fartyg/passagerare enligt befintlig matchPopulation, aldrig enemy/dolda resurser. Menu öppnar befintlig pausad sessionkontroll; playing visar bara kompakt rad. HUD-input får inte påverka selection/orders; pause/Save/restart/resize bevaras. Engelska texter och originalpalett.

**Non-goals:** Ny pausmeny104, bottom/action/grupp/minimap098–101, balans eller nya ekonomiregler.

**Dependencies:** RTS-096.

**Acceptance criteria:** Raden är läsbar och ryms1280×720/1920×1080, verklig insamling/produktion uppdaterar saldo/supply; Menu pausar och ger åtkomst till befintliga controls utan gameplayläckage. Inga dubbla fullstora ekonomirader i sidopanelen; detaljstatus kan vara kvar.

**Tester:** Bank vs cargo/fog, reserverad supply/ships, paus/Save/reset; relevanta presentation/session/economytester, typecheck/build/diff. Browser två upplösningar, gather/train/Menu/pause/Save/restart och granskade screenshots.

**Docs:** BACKLOG.md, DEV_LOG.md, README.md, GAME_DESIGN.md, ARCHITECTURE.md.

## RTS-098 – Bottom bar: selection-information

**Status:** Done.

**Goal:** Visa vald enhets eller byggnads namn, porträtt, HP och relevant statistik. Hantera tom selection.

**Requirements:**170px bottom bar med befintligt originalporträtt/frame, engelskt fraktionsnamn, aktuell/max HP och konfigurerad speed/supply/range/damage eller last/byggstatus. Befintliga valbara base/barracks/harbor och alla land-/sjöroller omfattas. Grupper visar antal och gemensam HP; inga nya selectionregler. Tom selection visar tydlig instruktion utan gammal data. Uppdateras vid damage/order/selection/restart; panelen får inte ge worldinput.

**Non-goals:** Gruppikoner/kö100, actions099, ny byggnadsselection, nya assets/stats/balans, enemyinspektion.

**Dependencies:** RTS-097.

**Acceptance criteria:** Läsbar170pxpanel1280×720/1920×1080 med canvas inom fönstret. Rätt fraktions-/rollnamn, porträtt och HP/stats för befintliga typer. Klick/drag/tom selection och buildingselection uppdaterar utan orders eller selectionläckage. Paus/Save/restart bevaras.

**Tester:** Pure panelmodel: empty/group, faction/roles, live HP/cargo, ships/buildings/missing selection, no hidden enemy data. Relevanta presentation/selection/Save/sessiontester; typecheck/build/diff. Browser två upplösningar, worker/base/group/empty/order/restart och granskade screenshots.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, README.md.

## RTS-099 – Kontextuell action panel

**Status:** Done.

**Goal:** Visa rätt actions för aktuell selection: bygga, träna, uppgradera och ge orders. Visa kostnader, hotkeys och orsaker till disabled actions.

**Requirements:** Befintliga knappar/callbacks flyttas till höger i bottom bar. Worker visar build/stop; landcombat attack-move/ability/stop; transport unload/stop; warship stop och befintlig right-click attack. Base visar workertraining samt forge-research (ingen ny forge-selection); barracks/harbor visar sina recept. Blandad selection visar unionen av relevanta actions. Visa faktiska kostnader, befintliga hotkeys och synlig disabled-reason. Ingen ny ordermekanik; instruktion för right-click move/gather/attack. Paus/outcome blockerar allt gameplay. Ny preview kräver tillräcklig bank; kostnaden dras fortfarande bara vid giltig placering.

**Non-goals:** Ny byggnadsselection, kö/grupp100, nya ordertyper/balans/assets, minimap101.

**Dependencies:** RTS-098.

**Acceptance criteria:** Inga irrelevanta actions för tom selection/annan roll. Kostnad/hotkey och blockeringsskäl stämmer med config/produktion/supply/byggstatus/ability. Panelen ryms båda målupplösningar; klick/hotkeys använder samma callbacks utan selection/orderläckage eller dubbel betalning. Research är tillgänglig via vald base och befintlig forge.

**Tester:** Context union och tom state, bank/supply/queue/construction/unique-building/research/cooldown/pause; relevanta action/production/placement/hotkey/sessiontester. Typecheck/build/diff. Browser worker/base/paidtraining/build/cancel/context/pause/restart och screenshot1280×720/1920×1080.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md, README.md.

## RTS-100 – Gruppselection och produktionskö

**Status:** Todo.

**Goal:** Visa enhetsikoner för grupper samt produktionskö, progress och möjlighet att avbryta. Definiera hur blandad selection presenteras.

**Dependencies:** RTS-099.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-101 – Minimap ovanpå spelvyn

**Status:** Todo.

**Goal:** Placera minimap som overlay i nedre vänstra hörnet. Bevara kameraindikator, fog of war och klicknavigation. Undvik överlapp med actions och inputläckage till spelvärlden.

**Dependencies:** RTS-100.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-102 – Kamerapanorering

**Status:** Todo.

**Goal:** Inför kantpanorering, tangentbord och mittenknappsdrag. Behåll vänsterdrag för enhetsselection. Begränsa kameran till kartans gränser. Panorera inte när menyer eller HUD fångar input.

**Dependencies:** RTS-101.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-103 – Kameragenvägar och inställningar

**Status:** Todo.

**Goal:** Space centrerar på selection. Home centrerar på spelarens bas. Låt spelaren justera panoreringshastighet och kantpanorering. Undvik konflikter med befintliga hotkeys.

**Dependencies:** RTS-102.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-104 – Pausmeny och fullscreen

**Status:** Todo.

**Goal:** Esc öppnar pausmenyn: Resume, Save, Load, Settings och Quit to Main Menu. Erbjud separat fullscreen-val. Avbruten återgång till huvudmenyn ska bevara matchen.

**Dependencies:** RTS-103.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-105 – Order- och actionfeedback

**Status:** Todo.

**Goal:** Visa tydliga move- och attack-markeringar. Ge begripliga besked, exempelvis: “Not enough gold”, “Population limit reached” och “Cannot build here”.

**Dependencies:** RTS-104.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-106 – Attackvarningar

**Status:** Todo.

**Goal:** Signalera hot mot bas och enheter visuellt och med ljud. Begränsa upprepning så varningar inte spammar.

**Dependencies:** RTS-105.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-107 – Svårighetsgrader

**Status:** Todo.

**Goal:** Definiera Beginner, Easy, Normal och Hard i config. Beginner ska ge längre förberedelsetid, mindre anfall och långsammare AI-utveckling. Dokumentera skillnaderna.

**Dependencies:** RTS-106.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-108 – Separat spelhastighet

**Status:** Todo.

**Goal:** Inför 0.75× och 1× som separata val från svårighetsgrad. Använd en gemensam skalning av gameplay-tid. Movement, combat, gathering, production och AI-timers ska påverkas konsekvent. UI och ljuduppspelning förblir normala.

**Dependencies:** RTS-107.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-109 – Tutorial-uppdrag

**Status:** Todo.

**Goal:** Lär ut selection, movement, gathering, byggande, produktion och strid i små steg. Ingen tidig anfallspress. Visa tydligt aktuellt mål och när det är uppfyllt.

**Dependencies:** RTS-108.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-110 – Speltest av Beginner

**Status:** Todo.

**Goal:** Verifiera att en ny spelare hinner förstå kontrollerna, bygga ekonomi och producera ett försvar. Dokumentera speltest och justera balans utifrån resultatet. Automatiserade tester ersätter inte användarens speltest.

**Dependencies:** RTS-109.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-111 – Förbättrad pixelterräng

**Status:** Todo.

**Goal:** Förbättra gräs, skog, vatten, kust och resurser. Skapa sammanhängande övergångar och lagom variation. Dekorationer ska inte förväxlas med blockerande terräng.

**Dependencies:** RTS-110.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-112 – Förbättrade byggnadssprites

**Status:** Todo.

**Goal:** Gör byggnadstyper, byggstadier och skador tydliga. Behåll konsekvent skala, ljusriktning och lagfärger.

**Dependencies:** RTS-111.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-113 – Förbättrade enhetssprites

**Status:** Todo.

**Goal:** Förtydliga typer, riktningar, rörelse, attack och död. Enheter ska kunna särskiljas utan selection. Inkludera befintliga fartyg och båda fraktionerna.

**Dependencies:** RTS-112.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-114 – Förbättrade stridseffekter

**Status:** Todo.

**Goal:** Förtydliga projektiler, träffar och död. Effekter får inte skymma units, HP eller selection.

**Dependencies:** RTS-113.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-115 – En större referenskarta

**Status:** Todo.

**Goal:** Skapa en handgjord karta med: basområden, expansionsresurser, alternativa vägar, strategiska passager och genomtänkta avstånd. Verifiera navigation, AI och kamerakontroller.

**Dependencies:** RTS-114.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-116 – Förbättra övriga kartor

**Status:** Todo.

**Goal:** Använd referenskartans kvalitetsnivå. Verifiera startpositioner, resurser, navigation, AI och land-/sjövägar på relevanta kartor.

**Dependencies:** RTS-115.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-117 – Nya ljudeffekter och ljudmix

**Status:** Todo.

**Goal:** Förbättra ljud för gathering, byggande, produktion och combat. Balansera volymer och begränsa samtidiga upprepningar. Lyssna igenom resultatet i en faktisk match.

**Dependencies:** RTS-116.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-118 – Humoristiska engelska enhetsröster

**Status:** Todo.

**Goal:** Inför korta selection- och order-repliker med personlighet. Använd variation, cooldown och begränsad upprepning. Återanvänd inte originalspelets inspelningar. Om röstassets saknas ska det rapporteras tydligt.

**Dependencies:** RTS-117.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-119 – Inställningar och persistens

**Status:** Todo.

**Goal:** Spara volymer, kameraval och spelpreferenser lokalt. Separata volymer för musik, effekter och röster. Hantera saknade eller ogiltiga sparade inställningar.

**Dependencies:** RTS-118.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.

## RTS-120 – Samlat speltest och publicering

**Status:** Todo.

**Goal:** Verifiera startsida → matchval → spel → paus → resultat → ny match samt save/load. Granska grafik och lyssna igenom ljud. Verifiera GitHub Pages-versionen och publicera när checks passerar.

**Dependencies:** RTS-119.

**Detaljering:** Krav, non-goals, acceptance criteria, tester och relevanta docs konkretiseras före framtida implementation.
