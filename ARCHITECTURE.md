# Arkitektur

## Status och teknik

Implementerat genom RTS-126 (historiska systembeskrivningar följer): archer/projectiles, catapult/splash och Forge/research, FIFO/refund, target-HP/destruktion, workerbygge, farms, population, kamera,
byggnadsselection, rally, Stop, gold och
atomiska kostnader ovanpå etapp 1:s HUD, handgjorda karta och navigation för
move/work/combat, separata gruppmål och säkra placement/spawn-regler.
De ursprungliga MVP-avsnitten nedan är historik; RTS-018–060-avsnitten längst
ned beskriver gällande ändringar av presentation, ranges och navigation.


RTS-001 har implementerat en minimal bootstrap med Phaser 4.2.1, strict
TypeScript 7.0.2 och Vite 8.3.2. Appen körs i webbläsaren utan backend eller
konton. RTS-002 inför movement, RTS-003 klickselection, RTS-004 dragselection
och gruppkommandon, RTS-005 gathering, RTS-006 bas och leverans samt RTS-007
arbetarproduktion, RTS-008 barracks-placering och RTS-009 soldier-produktion.
RTS-010–015 inför manuell melee, enemy AI, waves, win/loss och restart. Ansvarsfördelningen nedan styr
både nuvarande och kommande arbete.

## Ansvarsfördelning

- Tunna Phaser-scenes hanterar scenlivscykel, input och presentation.
- Gameplay-logik separeras från Phaser där praktiskt så att regler kan
  verifieras utan rendering.
- Stats definieras i enkla TypeScript-configobjekt. Inför inget modding- eller
  externt datasystem för detta.
- Grafik kan vara placeholders. Struktur och abstraktioner införs när aktuell
  task behöver dem, utan spekulativ refaktorering.

## Implementerad struktur

- [index.html](index.html) är Vites startpunkt med containern `#game` och
  separata DOM-kontroller för worker-/soldier-produktion och barracks-placering utanför canvasen.
- [src/main.ts](src/main.ts) skapar Phaser.Game med automatisk renderer, en
  mörk bakgrund och en canvas på 800 × 600 pixlar från viewportConfig.
- [src/scenes/BootScene.ts](src/scenes/BootScene.ts) presenterar tre gröna placeholders från createMatch
  (24 × 24 px) med ID unit-1, unit-2 och unit-3 vid (280, 300), (400, 300) och
  (520, 300). Varje arbetare har position, mål, order och selected-state separat från
  renderobjekten, som kopplas via en Map med ID som nyckel.
  Scenen adapterar pointer-input, visar dragrektangel och ringar, konverterar
  delta till sekunder och synkar rendering av enheter, HP, lasttext, bas, resursnod och saldo.
  Gameplay-steget delegeras till updateMatch.
  Gathering och produktion uppdateras med samma gameplay-delta. Nya arbetares
  renderobjekt skapas efter spawn. Input- och knapplyssnare tas bort vid shutdown.
- [src/gameplay/movement.ts](src/gameplay/movement.ts) är en ren funktion utan
  Phaser-beroende: normaliserad riktning × hastighet × delta i sekunder,
  begränsat till återstående avstånd. Samma start/mål och delta=0 är säkra.
- [src/gameplay/gathering.ts](src/gameplay/gathering.ts) innehåller WorkerOrder
  (idle/move/gather/deliver), last, ResourceNode och GatheringState samt fristående order-
  och uppdateringsfunktioner. Move använder arbetarnas target, gather refererar
  till nod-ID; deliver minns samma nod för återgång. Idle utför inget arbete. Endast markerade får nya order.
  Ny move-order ersätter arbetsloopen och bevarar last; selection-funktionerna
  bevarar order-state och last.
- [src/config/gathering.ts](src/config/gathering.ts) anger nu 400 initial wood,
  24 px gather-/leveransräckvidd, 1 wood/s, lastkapacitet 5, nodradie 20 px,
  nodposition (650, 180), basposition (400, 450) och basstorlek 48 px.
- [src/gameplay/gathering.test.ts](src/gameplay/gathering.test.ts) verifierar
  räckvidd, tidssteg, begränsad resurs, last, uttömning och orderbyte.
  [src/gameplay/delivery.test.ts](src/gameplay/delivery.test.ts) verifierar
  leverans, återgång, upprepade turer, totalbevarande och avbruten loop.
- [src/gameplay/production.ts](src/gameplay/production.ts) hanterar startspärr,
  omedelbar kostnad, countdown och exakt en spawn utan Phaser-beroende.
  ProductionState lagrar återstående tid (null när ledig) och nästa ID-nummer.
- [src/config/production.ts](src/config/production.ts) anger 20 wood,
  5 sekunders produktion och spawn-offset (60, 0) relativt basen.
- [src/gameplay/production.test.ts](src/gameplay/production.test.ts) verifierar
  startspärrar, kostnad, tid, spawn, unika ID:n och ny arbetares gameplay.
- [src/config/buildings.ts](src/config/buildings.ts) anger worldConfig 800 × 600,
  32 px tile-storlek, barracks 2 × 2 tiles och kostnad 40 wood.
- [src/gameplay/placement.ts](src/gameplay/placement.ts) hanterar placeringsläge,
  snapping, footprints, gränser, överlapp, saldo och max en barracks utan Phaser.
- [src/gameplay/placement.test.ts](src/gameplay/placement.test.ts) verifierar
  dessa regler inklusive negativa koordinater, kantkontakt och exakt en debitering.
- [src/config/unit.ts](src/config/unit.ts) anger hastighet 160 px/s och storlek 24 px.
- [src/gameplay/selection.ts](src/gameplay/selection.ts) hanterar selection och
  kommandon utan Phaser. Klick använder kvadratisk träffyta och ersätter selection
  med en enhet; vid överlapp väljs sist renderade enheten. Dragrektangeln
  normaliseras med min/max och väljer centrum inklusive kanten. Tomt urval
  avmarkerar alla. Gruppkommandon ändrar mål enbart på markerade enheter.
  Befintliga selection/command-tester behålls. Scenen använder nu orderUnits
  för idle/move/gather/deliver; selectUnitAt och selectUnitsInRectangle bevarar även
  arbetarnas utökade state via generisk typning.
- [src/gameplay/selection.test.ts](src/gameplay/selection.test.ts) och
  [src/gameplay/groupSelection.test.ts](src/gameplay/groupSelection.test.ts)
  verifierar klick, rektanglar, tröskel, ersatt selection och gruppkommandon.
- [src/gameplay/movement.test.ts](src/gameplay/movement.test.ts) verifierar
  movement-regler i Vitest utan browser eller rendering.
- [tsconfig.json](tsconfig.json) aktiverar strict och bundler-resolution samt
  typkontroll utan emittering. `skipLibCheck` hoppar över dependencies interna
  deklarationskontroll; projektkoden kontrolleras fortfarande med strict.
- [package.json](package.json) definierar dependencies och scripts;
  [package-lock.json](package-lock.json) låser installationen.
- [.gitignore](.gitignore) ignorerar dependencies, byggoutput och lokala loggar.

Vite använder standardinställningarna och behöver ingen separat configfil.
Ingen framtida systemstruktur har skapats. Movement ligger separat från
bootstrap och scene. World-config definierar 800 × 600-arenan; RTS-019 tillför terräng enligt avsnittet nedan.

## Koordinater och tid

Positioner och mål anges i world pixels. Byggplacering snappar till 32 × 32 px; något gameplay-
eller movement-grid finns inte. Scenen omvandlar Phasers delta till sekunder (`delta / 1000`);
movement använder delta-baserade steg utan fixed timestep. Funktionen arbetar
med ändliga positioner, icke-negativ hastighet och delta från scenen.
Högerklick ersätter målet på alla markerade enheter. Alla börjar omarkerade.
Avmarkering stoppar inte movement och ringarna är inte klickytor.
Vänsterknappens down/up avgränsar selection-gesten; selection ändras vid release.
Drag börjar när avståndet från start når 5 CSS/client-pixlar och förblir drag
även om musen återvänder. Kortare gester behandlas som klick vid releasepositionen.
Tröskeln använder DOM-eventets client-koordinater, oberoende av skalad canvas;
rektangeln och träfftesterna använder world pixels. Pointerup utanför canvas
avslutar också gesten. Scenen håller endast gest- och renderadapterstate.
Det finns ingen shift-selection, formation, collision avoidance, kontrollgrupp,
ekonomi-UI utöver enkla texter samt produktions-/byggknapp, pathfinding, hinderhantering
eller kameraimplementation. Enkel enemy AI beskrivs nedan.
Enheterna kan överlappa vid samma mål.
Se [DECISIONS.md](DECISIONS.md).

## Gathering och leverans (RTS-006)

Högerklick på nodens cirkel ger gather-order, övriga högerklick ger move-order.
Varje arbetare har kontinuerlig last (cargo) från 0 till 5 wood. Gathering
överför nod → last inom 24 px från nodcentrum med 1 wood/s. Full last byter
automatiskt till deliver. Inom 24 px från basens centrum överförs hela lasten
till gemensamt saldo; bara denna övergång krediterar saldot.

Deliver minns resursnodens ID. Efter leverans återgår arbetaren till noden om
wood finns, annars idle. Vid uttömning levereras även partiallast; tomma arbetare
blir idle. Ny gather-order med full last levererar först. Gather mot tom nod
levererar kvarvarande last eller blir idle om lasten är tom. Move avbryter
loopen utan att kasta eller leverera lasten, även om målet ligger vid basen.
Avmarkering ändrar varken order eller last.

Uppdateringen förbrukar delta över approach, gathering, leverans och återgång,
så ett långt steg kan innehålla flera övergångar. Arbetarna behandlas i stabil
listordning vid delning av den begränsade noden. Uttag begränsas både av nodens
mängd och ledig lastkapacitet. Summa nod + laster + saldo bevaras inom
flyttalstolerans. Depletion efter en senare arbetare dirigerar även tidigare
arbetares kvarvarande gather-order till slutleverans.

Basen är en fast blå placeholder. Text vid varje arbetare visar last/kapacitet
med en decimal, och saldotext visar wood och nodens mängd. Ingen manuell leveransorder eller collision införs i arbetsloopen. Den tidigare
direkta krediteringen från RTS-005 har ersatts av denna leveransmodell.

## Arbetarproduktion från basen (RTS-007)

En DOM-knapp ”Träna arbetare – 20 wood” ligger utanför canvasen. Den är disabled
när saldo är under 20 wood eller basen redan producerar. startProduction
kontrollerar samma regler oberoende av UI och drar kostnaden bara vid godkänd
start. Ett nytt klick under pågående produktion köas inte och debiterar inte.

updateProduction använder gameplay-delta i sekunder, samma delta som gathering.
Countdown visas med en decimal. Efter 5 sekunder skapas en arbetare vid basens
position + (60, 0), med cargo 0, idle och selected=false. Monotont nästa ID-nummer
samt kontroll mot befintliga ID:n förhindrar kollisioner. Ett avslutat steg
skapar bara en arbetare även med stort delta; resttid startar ingen ny produktion.
Nya arbetare går genom samma selection, movement, gathering och leverans som de
befintliga. Float-tolerans används enbart vid timeravslut.

Knappens click-handler anropar bara produktionslogiken. Canvas-input lyssnar på
canvasen; release över produktionskontrollerna avbryter en eventuell draggest
utan att ändra selection. UI-klick kan därför inte ge order eller avmarkera.
Scenen synkar knapp, tidstext och renderobjekt och tar bort DOM-lyssnaren vid
shutdown. Ingen kö, avbrytning/refund, rally point, eller population cap införs.

## Barracks-placering (RTS-008)

PlacementState håller active och en valfri barracks-footprint. Byggknappen
öppnar läget även vid lågt saldo så att preview kan visa varför platsen är
ogiltig. Vänsterklick validerar aktuellt saldo, footprint och världens gränser
innan en direkt placering debiterar 40 wood. Inga pengar reserveras vid start.
Escape/högerklick avslutar gratis. Bara en barracks tillåts; byggknappen spärras
när en redan finns. Reglerna kontrollerar också maxgränsen oberoende av UI.

Scenen visar en grön/röd preview med statustext och adapterar världspointer till
reglerna. Placement har företräde framför selection och unit-orders. Den release
som hör till placeringsklicket konsumeras även efter lyckad placering eller
högerklicksavbrott. Preview och unit-orderstate är separata. Basproduktion kan
fortgå och spendera saldo under placeringsläge; aktuellt saldo kontrolleras på nytt.

Se [DECISIONS.md](DECISIONS.md) för footprints: barracks 64 × 64 (övre vänster),
bas 48 × 48 centrerad och nodens bounding box 40 × 40. Kantkontakt tillåts,
positiv areaöverlapp förbjuds. Ingen byggtid, arbetarbyggande,
rivning, pathfinding, unit-collision eller generell byggmeny finns.

## Soldier-produktion och blandade enheter (RTS-009)

GatheringState.units innehåller Unit = Worker | Soldier med kind som typmarkör.
Workers har arbetsorder och last; soldiers har idle/move/attack och cargo är
alltid 0. orderUnits skickar movement till alla markerade, men resursklick ger
endast workers gather-order. Soldiers behåller tidigare mål och order.
updateGathering uppdaterar soldiers med samma rena movement-funktion utan
att delta i arbetsloopen. Selection-funktionerna bevarar båda enheternas state.

Den befintliga production-modulen tar en byggnadstyp och använder samma
start-/timer-/spawnflöde för bas och barracks. Scenen håller ett ProductionState
per byggnad, så produktionerna kan pågå samtidigt med gemensamt saldo.
nextUnitNumber kontrolleras mot alla befintliga enhets-ID:n vid spawn; separata
produktionsräknare kan därför inte skapa dubbletter.

[src/config/production.ts](src/config/production.ts) anger soldier-kostnad 20,
produktionstid 5 sekunder och 8 px mellan kropp och footprint vid spawn.
soldierSpawn prövar höger, vänster, nedanför och ovanför barracks och väljer
första position där hela enheten ligger inom världen. Ingen collision införs.
[src/config/unit.ts](src/config/unit.ts) anger soldierStats: 160 px/s, 24 px
storlek och orange färg; workers är gröna. Soldiers får etiketten Soldier.
Nya enheter börjar idle och omarkerade. Soldatknappen visas först efter placering,
spärras vid upptagen barracks/lågt saldo och har separat återstående tid.
DOM-input bevarar selection och orders enligt samma regler som basens knapp.

[src/gameplay/soldierProduction.test.ts](src/gameplay/soldierProduction.test.ts)
verifierar startvillkor, debitering, tid och exakt en spawn, samtidighet,
ID:n, spawn vid världens kanter samt blandad selection/movement/resursorder.
Combat och HP tillkommer genom RTS-010/011 nedan.

## Verifiering

`npm run typecheck` kör `tsc --noEmit`. `npm run build` kör typkontroll och
`vite build`, med output i `dist/`. `npm run dev` startar lokal utveckling.
Installation görs med `npm ci`, se [README.md](README.md).

`npm test` kör `vitest run` en gång i Node-miljö. Testfiler ligger intill
gameplay-logiken och omfattas även av typkontrollen. Ingen separat testconfig
behövs. Browserkontrollen kompletterar unit-testerna med input och rendering.
Inga tester som speglar bootstrap-koden har skapats. Dokumentationsändringar
verifieras genom konsekvens och giltiga filreferenser.

Se [GAME_DESIGN.md](GAME_DESIGN.md) för MVP och [BACKLOG.md](BACKLOG.md) för scope.

## Manuell combat (RTS-010)

[src/gameplay/combat.ts](src/gameplay/combat.ts) håller CombatState med enemies
(ID, position, HP) och baseHP. Soldier får hp och attack-order med enemyId.
Gathering uppdaterar endast soldier move; combat äger attack-approach och skada.
orderAttack/ enemyAt hanterar kommandon och träffyta utan Phaser. Restid till
32 px räckvidd dras från delta före skada. Döda targets tas bort och order
mot dem avslutas. Ny move ersätter attack. Bas-HP kopplas till defeat genom RTS-013 nedan.
[src/config/combat.ts](src/config/combat.ts) håller stats. Scenen adapterar
input, visar röda enemies/HP och förstör borttagna enheters renderobjekt.
[src/gameplay/combat.test.ts](src/gameplay/combat.test.ts) verifierar reglerna.
Tidigare RTS-009-avgränsning om combat/HP gäller bara den historiska slicen.

## Enemy AI (RTS-011)

updateCombat väljer nearest soldier inom config-aggro eller basen från samma
snapshot som soldier-attacker. approach delar delta i restid och tid i melee.
Skada ackumuleras per mål före samtidig applicering och filtrering av döda.
En död soldier försvinner från units, inklusive dess selection; scenens Map
städar kropp/ring/text. BaseHP klampas till 0 och visas. AI och damage ligger
helt utan Phaser i combat.ts; config innehåller hastighet, räckvidd, HP/skada.
Combat-tester täcker också basapproach, aggro, retargeting och simultan död.

## Ändliga waves och arena (RTS-012)

[src/gameplay/waves.ts](src/gameplay/waves.ts) hanterar WaveState med förfluten
gameplay-tid, nästa vågindex och monotont enemy-ID. updateWaves spawnar alla
konfigurerade vågor vars tid passerats, exakt en gång. En tom levande-lista
återställer aldrig progression. [src/config/waves.ts](src/config/waves.ts)
håller tre vågor och spawnpositioner; [src/gameplay/waves.test.ts](src/gameplay/waves.test.ts)
täcker gränser, tidssteg, sista vågen, ID:n, världens gränser och ekonomibudget.
Ingen övningsfiende finns längre. Scenen visar vågnummer och countdown.
Arenan är befintlig worldConfig 800 × 600 med bas/nod. gatheringConfig har nu
400 initial wood; de tidigare 100 gäller historiska gathering-slices.

## Matchuppdatering och defeat (RTS-013)

[src/gameplay/match.ts](src/gameplay/match.ts) samlar befintliga system i
MatchState och updateMatch; inget nytt generellt engine-lager. Uppdateringen
kör gathering, bas/barracks-produktion, combat och wave-klocka samt samordnar
nästa unit-ID mellan byggnader. Delta delas endast vid wave-gränser; enemies
spawnar efter tidigare segments simulation. resolveOutcome kontrollerar bas-HP
före och efter uppdatering. Defeat lämnar state fryst och avbryter placement.
Scenen delegerar simulation, adapterar state och blockerar alla gameplay-handlers
vid game over. Drag-/preview-rendering rensas och DOM-status visar Defeat.
[src/gameplay/match.test.ts](src/gameplay/match.test.ts) verifierar defeat,
fryst simulation, spawnålder och livstids-ID:n efter död.

## Victory (RTS-014)

resolveOutcome i match.ts kontrollerar först baseHP <= 0, därefter att
waves.nextWave == waveSchedule.length och enemies är tom. Samma game-over-
väg fryser båda outcomes. Match-tester verifierar tidig/korrekt victory,
fryst slutläge och simultan defeat/victory. Ett integrationstest spelar riktiga
gathering/leverans/placering/produktion/attack genom alla vågor och verifierar
victory samt wood-bevarande inklusive spenderade bygg-/produktionskostnader.

## Restart och state-ägande (RTS-015)

createMatch i match.ts är enda initialisering av gameplay-state. Den återanvänder
configvärden men äger nya objekt, arrays och positioner för varje match. Scenens
applyMatch adapterar initial- och uppdaterat state. Restart-knappen kallar
scene.restart bara vid game over med spärr för dubbla anrop. Shutdown tar bort
DOM-, pointer- och keyboard-handlers innan create återregistrerar en gång.
Phaser städar scenens displayobjekt; create rensar render-Maps, selectiongest,
previewPoint och placementClick samt bygger om presentationen. Ingen state från
föregående match återanvänds. Match-tester verifierar initialt state, från både
outcomes, oberoende objekt och ny fungerande produktion/ID:n.

DOM-kontroller kan flytta canvasen när restart-knappen visas/döljs eller raden
radbryts. syncVisuals uppdaterar därför Phasers canvasBounds efter DOM-synk,
så world-input fortsätter träffa rätt efter restart, layoutändring och scroll.
Detta verifieras i browser, utan mocktester som bara speglar Phaser-anropet.

## Framtida riktning – roadmap RTS-016–060 (ej implementerad)

Avsnitten ovan beskriver MVP-koden; kompletteringar RTS-016–019 beskrivs nedan.
Phaser-adaptern ligger i BootScene och rena funktioner i gameplay/config.
Navigation implementeras i RTS-020–024 nedan. Ingen gold-modell, större karta, fog, enemy-produktion, archer,
catapult, queue, save-format eller nya assets har skapats i planeringskörningen.

[BACKLOG.md](BACKLOG.md) anger leveranser och beroenden. Inför struktur endast
när aktuell task behöver den; inga tomma framtida system eller generell ECS-
refaktorering. Riktningen är att bygga vidare på följande faktiska gränser:

| Befintlig gräns | Planerad utökning, inte aktuell implementation |
| --- | --- |
| movement.ts och world-pixel-positioner | Tile/walkability-data, route/waypoint-följning, nåbara footprint-positioner och hinderrevision i RTS-019–024. Rendering av karta separat från rena sök-/route-regler. |
| gathering.ts med order/last | Gold/wood-typad ekonomi och arbetsrutter, därefter builder-orders i RTS-029–031. Ingen migration av dagens state i planeringskörningen. |
| placement.ts och footprints | Gemensamma terräng-/byggnadshinder, unit-kroppar, connectivity-validering och säker spawn. Hypotetisk placering valideras före atomisk kostnad/stateändring. |
| production.ts och per-building timers | Rally, supply/reservation och jobb/kö/cancel-policy i RTS-027/032/033; lifecycle vid byggnadsdöd i RTS-034. Budgetstyrd enemy-produktion återanvänder reglerna där praktiskt. |
| combat.ts med enemy-ID/HP | Giltiga targetreferenser och död-cleanup för alla mål, autoattack, attack-move, ranged-projectiles och splash i RTS-034–039. Damage förblir fristående från sprites/animation. |
| match.ts med outcome/restart | Explicit scenario-policy för survival/skirmish/uppdrag, senare pause och full reset. Separata mode-regler får inte skriva över MVP:s wave-victory eller defeat-prioritet. |
| BootScene/input och DOM-kontroller | Kamera, kontextpanel/minimap/hotkeys som adapters. Ett visibility-kontrakt filtrerar alla informationsytor innan spelarens fog aktiveras i RTS-049. |
| createMatch och config | Versionerad lokal snapshot/reconstruction i RTS-059; serialisera gameplay/config-referenser, inte Phaser-objekt, DOM, lyssnare eller sökcaches. |

Gemensamma invariants i planen: ID:n/targets kan inte leva vidare efter död,
ny order ersätter gammal route, ändrad hinderrevision validerar aktiv route,
last/ekonomi följer explicit policy och alla systems state ingår i restart,
game-over-stopp samt senare pause/save. Tests läggs vid rena regler; browser
verifierar koordinater, UI/input, visibility och presentation. Gruppmål löser
inte full unit-collision. Assetdimensioner/ankare ska passa spelmodellens
footprints och får inte tyst ändra navigation eller targeting.

Exakt dataschema/pathfinder/lagring ska väljas vid respektive task, se öppna
beslut i [DECISIONS.md](DECISIONS.md). Planerade system har därför inga
påhittade filreferenser. Wave-survival och skirmish ska finnas parallellt;
AI samlar armégrupper ur en verklig bank med startbudget och levererad income (RTS-071).

## MVP-baseline inför utökning (RTS-016)

Browserverifiering använder riktiga gameplay-tider och canvas-/DOM-input i
Chromium. En tillfällig scene-referens i browserns Vite-response möjliggör
state-asserts utan debug-API i projektet. Separata markerade fixtures används
för upprepade omstarter och kontrollradens radbrytning. Viewport-koordinater
från getBoundingClientRect jämförs med Phasers page-bounds efter scroll-offset;
båda beskriver samma canvas. Daterat protokoll finns i [DEV_LOG.md](DEV_LOG.md).

[src/config/balance.test.ts](src/config/balance.test.ts) verifierar finite waves,
positiva rates/tider/HP och survival-budget utan att låsa exakta configvärden.
RTS-017 behåller befintlig config efter jämförande naturliga speltester.

## HUD – RTS-018

[src/presentation/hud.ts](src/presentation/hud.ts) formar status och spärrskäl
från gameplay-state/config utan att ändra state. Produktionens startvalidering
ligger kvar i production.ts. [src/style.css](src/style.css) reserverar ytor för
status/selection/restart och radbryter DOM-kontroller. Canvasens dubbla ekonomi-/
wave-texter har ersatts av DOM-status; world-input synkar fortfarande page-bounds.
Pointerrelease över hela HUD avbryter draggesten utan nytt urval eller order.

## Handgjord karta – RTS-019

[src/config/arena.ts](src/config/arena.ts) anger handgjord terräng och fasta
starts/base/node/enemy-entry. [src/gameplay/map.ts](src/gameplay/map.ts) håller
WorldMap med bounds, tileSize, obstacles och revision; createMatch äger ny
kartstate vid restart. Konvertering, klippta tiles, footprint-rasterisering och
kroppskontroller är Phaser-fria. BootScene renderar samma config som tiles
bakom enheter. Ingen pathfinder eller hindertvingad movement finns ännu.

## Move-navigation – RTS-020

[src/gameplay/navigation.ts](src/gameplay/navigation.ts) gör bounded BFS,
kroppssäkra connectors/sweeps, strukturerade route-errors och waypoint-steg
med restdelta. [src/config/navigation.ts](src/config/navigation.ts) anger
kropp-clearance och sökbudget. Unit.navigation är route-state; order behåller
move-intention. Match skickar kartstate till gathering-uppdateringen för move;
scenen adapterar bara kommandot. Gather/attack är ännu raka och hanteras i
RTS-021/022. Svensk route-feedback finns i HUD för markerade enheter.

## Arbetsnavigation – RTS-021

[src/gameplay/approach.ts](src/gameplay/approach.ts) väljer nåbar position
utanför footprint och verifierar kantavstånd/interaktion utan Phaser.
createMatch lägger fasta bas/nod-footprints i map.obstacles; gathering använder
samma navigation och förbrukar restdelta över approach/gather/delivery/return.
Legacy-centerrange utan map behålls för de äldre isolerade regressionstesterna;
spelmatchen skickar alltid map och använder den nya footprintmodellen.
[src/gameplay/workNavigation.test.ts](src/gameplay/workNavigation.test.ts)
verifierar faktisk map-loop, blockerade sidor, cargo/conservation/depletion
och tidssteg. Attack/AI integreras i RTS-022.

## Combat-navigation – RTS-022

combat.ts använder approach.ts/navigation.ts för target-ID-bunden soldier-
pursuit och enemy/bas. Enemy.navigation och Unit.navigation äger route/retry;
position/range/revision triggar bounded replanning. Attack uppdaterar inga
workers-orders. Target-death rensar route/attack och enemy-cache mot död soldier.
Pure combatNavigation-tester täcker walls, range, moved target, death, base-
reachability och simultaneous defeat i faktisk footprint-match. Legacy no-map
combat används bara av äldre isolerade regressioner; match skickar alltid map.

## Gruppförflyttning – RTS-023

[src/gameplay/groupMovement.ts](src/gameplay/groupMovement.ts) genererar bounded
kandidater och tilldelar nåbara, unika route-destinationer per markerat ID.
Scenens markklick använder commandGroupMove; resource/enemy-input behåller
befintliga regler. Navigationstate återanvänds; ingen ny generell formation/
unit-collision. no-space visas i HUD och försöker inte fallback vid revision.

## Placering/spawn – RTS-024

placement.ts tar optional PlacementContext för world-map, aktuell ekonomi/
units och levande enemies. Hypotetiska connectivity-kontroller är rena;
placeBarracks returnerar placement/wood/map atomiskt. Scenen använder samma
validering för aktiv preview och slutklick, och gör ingen dold preview-sökning.
[src/gameplay/spawning.ts](src/gameplay/spawning.ts) delar bounded spawn-
kandidater, kroppsyta och utgångsquery med placerings-/produktionslogik.
Match skickar map/enemies till båda produktionsjobb i ordning; andra jobbet
ser första spawnen. ProductionState.blockedSpawnKey cacherar relevant state
vid väntan. [src/gameplay/safePlacement.test.ts](src/gameplay/safePlacement.test.ts)
täcker hypotetiska gateway/wave-vägar, atomicitet och blockerad/frigjord spawn.

## RTS-025 – Kamera och större värld

[src/config/camera.ts](src/config/camera.ts) skiljer viewport 800 × 600 från
worldConfig 1280 × 960. [src/presentation/camera.ts](src/presentation/camera.ts)
beräknar bounded pan och koordinatkonvertering utan Phaser; dess
[tester](src/presentation/camera.test.ts) verifierar gränser och selection/placement.
BootScene adapterar mittenmusdrag till kamerans scroll, använder aktuell kamera
för pointer-world och rensar gest/scroll vid restart. DOM-HUD ligger utanför
kameran. Befintliga gräns-/väggtester använder explicit fixturestorlek eller
aktuell world-storlek, så testväggarna fortfarande förseglar hela kartan.

## RTS-026 – Byggnadsselection

[src/gameplay/buildingSelection.ts](src/gameplay/buildingSelection.ts) innehåller
ren footprint-hit och exklusiv target-selection samt produktionsbehörighet.
BootScene äger det kortlivade byggnadsvalet och gul footprint-ram; create/reset
rensar båda. Unit-träff har företräde, byggnadsval avmarkerar units och drag
rensar byggnadsval. DOM-panelen visar endast vald byggnads produktion med
visibility:hidden för övriga reserverade slots. Click-handler kontrollerar
behörighet även för programmatisk aktivering; global build-knapp behålls.
[Tester](src/gameplay/buildingSelection.test.ts) täcker footprintkanter,
prioritet, orders, otillåtna targets och game-over-behörighet.

## RTS-027 – Rally

ProductionState äger optional rally/rallyError per byggnad.
[src/gameplay/rally.ts](src/gameplay/rally.ts) validerar destinationens statiska
nåbarhet från en säker möjlig spawn-utgång. Produktionssteget tilldelar endast
nyfödd unit mapped move utan att markera den. Giltig spawn är oberoende av
rally; en senare blockerad route väntar säkert. [Tester](src/gameplay/rally.test.ts)
täcker avvisat mål, separata samtidiga jobb, säker spawn och reset.
Navigation snappar exakt till waypoint när kvarvarande tid räcker; detta
rättar floating-point-rest vid ankomst som rally-regressionen upptäckte.

## RTS-028 – Stop och feedback

[src/gameplay/orders.ts](src/gameplay/orders.ts) gör enbart markerade units idle
och rensar target/route utan att ändra last/HP/saldo; game over är no-op.
[src/presentation/orders.ts](src/presentation/orders.ts) härleder målmarkörer
från aktuella orders och levande targets. Scenen diffar renderobjekt efter ID,
visar gula aktiva/röda blockerade ringar och städar completion/död/reset.
Stop-knappen är DOM-isolerad och dess listener tas bort vid shutdown.
[Tester](src/gameplay/orders.test.ts) täcker alla arbetsfaser och attack,
resource preservation, revisions-regression och marker lifecycle.

## RTS-029 – Två resurstypers arbetsloop

GatheringState behåller wood-noden och lägger till gold-nod/goldBalance.
ResourceType är wood/gold; order refererar nod-ID och last anger cargoType.
Legacy wood-only fixtures använder default wood. UpdateGathering arbetar på
lokala kopior av båda nodernas remaining och bokför per typ vid leverans.
Orderbyte med annan lasttyp går till bas först och minns den nya nodens ID.
Placement/navigation tar hänsyn till båda resursfootprints och bevarar
arbetarnas tidigare nåbarhet till båda. Gruvan renderas gul; HUD och lasttext
visar separata typer. [Tester](src/gameplay/gold.test.ts) täcker tidssteg,
partial/full switch, Stop/move, delad depletion, bevarande och blockerad gruva.

## RTS-030 – Gemensamma kostnader

[src/config/economy.ts](src/config/economy.ts) anger ResourceCost-objekt för
worker, soldier och barracks. [src/gameplay/economy.ts](src/gameplay/economy.ts)
validerar båda saldon och debiterar atomiskt; samma config ger knapptexter
och HUD-spärrorsaker. Produktionen debiterar en gång vid start och placering
vid giltigt slutklick. [Tester](src/gameplay/economy.test.ts) täcker ena
resursens brist, exakta gränser, dubbelstart och reset. Match-regressionen
samlar två resurser från fresh state och räknar bevarande per typ inklusive
spenderade kostnader genom alla waves.

## RTS-031 – Worker bygger barracks

PlacementState äger optional construction med återstående arbetstid och
builder-ID; den reserverade footprinten är omedelbart blockerande. Faktisk
placeBarracks-context kräver vald nåbar worker och returnerar atomiskt
gathering/map/placement. Legacy geometry-only fixtures utan context behåller
den tidigare direkta placeringsmodellen. WorkerOrder har build, som inte
bearbetas av gathering. [src/gameplay/construction.ts](src/gameplay/construction.ts)
uppdaterar approach, progress och completion innan produktion i matchsteget.
Endast aktiv build-order i räckvidd ger progress. Stop/orderbyte pausar;
högerklick med worker återupptar/tilldelar en builder. Barracks production
får ready=false tills färdig, både i UI och start/updateProduction.
[Tester](src/gameplay/construction.test.ts) täcker reservation, approaches,
tidssteg, paus/resume, builderbyte och blockerad plats.

## RTS-032 – Farms och härledd population

PlacementState lagrar farms med monotona ID:n, footprint och ConstructionJob.
placeBuilding/beginPlacement tar barracks/farm-typ, återanvänder giltighets-
och reservationsregler och skyddar även befintlig barracks spawn-utgång
och tilldelade builders tidigare nåbara vägar till ofärdiga sites.
Worker build-order refererar konkret site-ID; construction uppdaterar varje
site separat, så byte order pausar tidigare site och olika builders kan arbeta
samtidigt. [src/gameplay/population.ts](src/gameplay/population.ts) härleder
cap/used/reserved från färdiga farms, levande units och pågående produktionsjobb
inklusive färdig blockerad spawn. Start får explicit populationscontext i
scenens båda produktionshandlers; reservplats konverteras naturligt vid spawn.
Godkända jobb fullföljs även om cap senare minskar. Farm-knapp/status, render-
objekt och population-HUD följer samma lifecycle/reset som befintliga kontroller.
[Tester](src/gameplay/population.test.ts) täcker reservation, race mellan
byggnader, paus/completion, separata sites, maxantal, over-cap och reset.

## RTS-033 – FIFO-produktionskö

[src/gameplay/productionQueue.ts](src/gameplay/productionQueue.ts) äger enqueue,
canEnqueue, cancel och kösteget. ProductionJob lagrar byggnadsvis monotont ID,
unit-typ, kostnad och tid. ProductionState.queue har högst tre jobb; befintligt
remainingSeconds speglar head för befintliga timer-/spawnadaptrar. Kösteget
återanvänder säker updateProduction/spawn och förbrukar delta över FIFO-jobb;
blockerad head håller senare timers. Legacy single-job fixtures fortsätter
använda startProduction; scenen använder enqueue och matchen kösteget.
Population summerar samtliga jobb. Panelen har stabilt reserverat utrymme och
en delegerad cancel-listener, renderar endast vid ID/selection/outcome-ändring
så knappar inte byts varje frame. [Tester](src/gameplay/productionQueue.test.ts)
täcker cost/reservation, FIFO, tidssteg, head/middle refunds, samtidighet,
blockerad spawn, game-over och reset.

## RTS-034 – Target-snapshot och destruktion

[src/gameplay/targets.ts](src/gameplay/targets.ts) beskriver levande spelar-
targets med ID, ägare, HP och footprint. Enemy prioriterar närmaste target
i aggro, med soldier/worker/building/ID tie-break; bas är fallback.
Workers och producerade units har explicit player/HP, wave-enemies enemy.
Legacy worker-fixtures utan HP behåller sina tidigare isolerade regler.

[src/gameplay/destruction.ts](src/gameplay/destruction.ts) tar bort döda units,
bokför worker-cargo som lostCargo, pausar föräldralösa byggjobb och tar bort
byggnader/footprints. Döda byggnaders queue/rally töms utan refund; räknare
bevaras. Borttagna hinder ger en revision per transaktion. Targetrefs rensas
även vid delta=0. Matchordning: pre-cleanup → arbete/bygge → combat → cleanup
→ köproduktion → waves/outcome. Därmed kan ett döende producer inte spawna
samma frame. Basdöd stoppar båda producers och ger defeat med företräde.
Scenen rensar byggnadsval/ram, body/HP/cargo/rally/queue och farm-render efter
modellens levande IDs. [Tester](src/gameplay/destruction.test.ts) täcker
lastförlust, worker-/projekt-/byggnads-/basdöd, ghost-spawn, supply, pauser,
monotona räknare och öppnade rutter; ekonomi-regressionen använder HP-workers
och räknar lostCargo i totalbevarande.

## RTS-035 – Acquisition och orderprioritet

[acquisition.ts](src/gameplay/acquisition.ts) väljer mål före combat från
samma snapshot. EnemyVisibility-predicate är kontraktet för framtida fog;
default är fullt synligt. Reachability använder befintlig approachRoute.
Soldier autoOrigin begränsar jakt och möjliggör återgång; autoDisabled används
av Stop. Explicit Move/attack rensar origin och spärr. Aktuellt automål behålls
så länge det är giltigt; manuell attack ersätts inte av närhetsval.
[acquisition.test.ts](src/gameplay/acquisition.test.ts) täcker prioritet,
stabila ties, synlighet, otillgänglighet, återgång och flera kills.

## RTS-036 – Fortsatt grupporder

[attackMove.ts](src/gameplay/attackMove.ts) återanvänder gruppnavigation för
valda soldiers och lagrar attackMoveTarget separat från tillfälligt enemy-mål.
Gathering lämnar dessa soldiers till combat så samma delta inte flyttar dem
två gånger. Acquisition avbryter deras färd för giltiga enemies; combat rör
dem mot kvarvarande destination när striden är slut. Scene hanterar enbart
knapp/destination/cancel, med shutdown-cleanup och game-over-spärr.
[attackMove.test.ts](src/gameplay/attackMove.test.ts) täcker resa/strid/återgång,
orders, gruppmål, workers, dolt mål, blockering och enkel deltaförbrukning.

## RTS-037 – Ranged-variant och projektiler

Soldier är gameplay-klassen för stridsenheter; archetype=archer anger ranged
variant. [archer.ts](src/config/archer.ts) och combatUnitStats ger numeriska
värden utan Phaser. Queue-job lagrar archer-typ; completion väljer head-typ
även när olika typer delar barracks-kö. [projectiles.ts](src/gameplay/projectiles.ts)
flyttar fasta trajectories, kontrollerar LOS/target/lifetime och returnerar
impact-damage exakt en gång. Combat håller monotona matchlokala arrow-ID:n
och unit-cooldown, förbrukar approach-tid före skott och projektilflygtid
efter skott. Enemy-skada och impacts ingår i samtidig damage/cleanup.
Visibility-predicate tillämpas även på projectile-target; utan fog är kartan
synlig. Scene skapar/destroyar cirklar efter aktuella projectile-ID:n.
[archer.test.ts](src/gameplay/archer.test.ts) och
[projectiles.test.ts](src/gameplay/projectiles.test.ts) täcker slice/lifecycle.

## RTS-038 – Clearance och splash

[catapult.ts](src/config/catapult.ts) ger stats/cost/supply. WorldMap.bodyHalf
är tillfällig per-unit routing-context; den gemensamma matchkartan ändras inte.
FindRoute, sweep, approach, gruppnavigation och spawn respekterar clearance.
ProductionJob lagrar supply; population summerar faktiska units/reservations.
Projectile.splashRadius återanvänder fast trajectory/lifetime; impactdamage
beräknas endast för synliga Enemy-targets, inklusive optional footprint för
stationära byggnadsmål. Förstörda enemy-footprints konsumeras av samma
cleanup/revision som spelarbyggnader. [catapult.test.ts](src/gameplay/catapult.test.ts)
täcker kant/splash, byggnader, initialtarget-död, friendly fire, kropp/spawn,
supply och outcome. Ingen faktisk fiendebas införs före RTS-041.

## RTS-039 – Forge och research-state

Forge återanvänder placement/workerbygge, target-HP och death-cleanup.
[upgrades.ts](src/config/upgrades.ts) är det begränsade configträdet.
[research.ts](src/gameplay/research.ts) äger kostnads-/startspärrar, nivåer
och ett jobb. Match delar delta vid research-completion, uppdaterar research
efter combat-cleanup och använder föregående färdiga nivåer under intervallet.
En Forge som dör vid completion-boundary ger ingen bonus. Combat tillämpar
globala multipliers utan mutation av individuella grundstats; projectile
damage lagras vid skott. [research.test.ts](src/gameplay/research.test.ts)
täcker bygge, cost/time/duplicates, melee/ranged/armor och death/reset.

## RTS-040 – Upprepningsbara balansfixtures

[armyBalance.test.ts](src/gameplay/armyBalance.test.ts) kör melee-duel, ranged
support och siege-kluster genom verklig combat/projectile-logik. Assertions
jämför roller/invarianter i stället för att frysa ett godtyckligt DPS-tal.
Config behålls efter dessa fixtures och naturlig mixed-army-survival;
mätningar och browserbegränsningar finns i GAME_DESIGN/DEV_LOG.

## RTS-041 – Scenario-konfiguration och enemy-footprint

[scenarios.ts](src/config/scenarios.ts) deklarerar survival och siege-test.
CreateMatch klonar bas/footprint per match och registrerar hindret. Enemy.kind
base återanvänder stationärt footprint-target och befintliga attackorders/
projectiles/cleanup. Wave-outcome räknar levande wave-units, inte stationär
base. Scene läser tillfälligt siege-test från URL vid create/restart; ordinarie
val kommer senare. [enemyBase.test.ts](src/gameplay/enemyBase.test.ts) testar
ägare, fysisk kropp, alla army-attacker, cleanup och outcome-isolering.

## RTS-042 – Enemy-production-adapter

[enemyProduction.ts](src/gameplay/enemyProduction.ts) adapterar enemy-budget
och egna units till gemensam FIFO/cost/supply/spawn. Temporära queue-Unit-
objekt förs aldrig in i player gathering-state; completion översätts till
enemy-owned IDs enemy-produced-N och enemy-stats. Player-unit-kroppar ingår
i spawnkontrollen. Produktion stegdelas vid head-timers för olika delta;
blockerad head håller resten. [enemyProduction.ts](src/config/enemyProduction.ts)
är ändlig budget/roster-config. Enemy-base-död konsumerar reservations innan
produktionsfas; survival saknar adapter-state.
[enemyProduction.test.ts](src/gameplay/enemyProduction.test.ts) testar
budget, tidssteg, cap, blockerad spawn, simultan produktion och death/reset.

## RTS-043 – Medlemskap och dispatch

[enemyAI.ts](src/gameplay/enemyAI.ts) håller elapsed, monotona grupp-ID:n,
medlemmar, destinationspunkter och muster/ready/attack-faser. Bara lediga
producerade IDs rekryteras. Gruppnavigation återanvänder commandGroupMove;
Enemy muster flyttas med enemy speed i combat utan att attackera. Dispatch
byter en gång till attack-move mot player-bas.
[enemyAI.ts](src/config/enemyAI.ts) reglerar plats, storlek, timeout/grace/gap.
Cleanup rensar döda referenser även före outcome-freeze.
[enemyAI.test.ts](src/gameplay/enemyAI.test.ts) testar tidsregler, medlemskap,
navigation utan cache, timeout, två grupper och death/reset.

## RTS-044 – Försvarsöverföring

[enemyDefense.ts](src/gameplay/enemyDefense.ts) planerar reserve, threat och
borrowed-defenders före rekrytering/dispatch i enemyAI. Skyddade IDs undantas
från anfallsgrupper och rekrytering. Defender metadata sparar tidigare grupp/
destination; återgång återställer grupporder om plats finns. Enemy defend-order
har explicit player-target-ID och combat använder det i stället för lokal
fallback. Återkommande samma försvarsorder återställs inte varje frame.
PlayerVisibility är planeringskontraktet inför fog; reachability använder
24 px Enemy-approach. Cleanup tar bort döda member/target-referenser före
outcome-freeze. [enemyDefense.test.ts](src/gameplay/enemyDefense.test.ts)
täcker prioritet, unik membership, return, dold/onåbar raid, budget och reset.

## RTS-045 – Valbara matchlägen

Scenario-config i [scenarios.ts](src/config/scenarios.ts) styr enemy-base, waves
och outcome-policy. [match.ts](src/gameplay/match.ts) skapar separat state och
hoppar över wave-spawn och wave-tidsgränser i Skirmish. En gemensam gameplay-
klocka fortsätter driva ekonomi/produktion/AI. BootScene binder ett enkelt
DOM-val med shutdown-cleanup; restart behåller scenens val. URL-parametern
scenario används endast som initialt preview-val, inte vid varje restart.

## RTS-046 – Profilisolering

[difficulty.ts](src/config/difficulty.ts) innehåller immutable profiler.
MatchState sparar bara profil-ID; factory kopierar faktisk enemy-budget/cap/
produktionstid till state. Shared production debiterar samma verkliga priser.
AI får profilinställningar och waves tar en explicit schedule, med Normal
som default för isolerade regressioner. Outcome och HUD använder matchens
schedule. Inga globala configs muteras av factory, update eller restart.

## RTS-047 – Kameraöverblick

[minimap.ts](src/presentation/minimap.ts) ger rena koordinat-/clampfunktioner,
indikator och färska snapshots med explicit marker-visibility-filter för
RTS-049. [minimapView.ts](src/presentation/minimapView.ts) ritar en separat
200 × 150 DOM-canvas och binder enbart camera-click; tar hänsyn till CSS-
border vid koordinatkonvertering. BootScene skickar state/kamera och rensar
lyssnaren på shutdown. Frames ritas från aktuellt state, utan marker-cache.
Terrain använder aktuella footprints; full fog-datafiltrering kommer RTS-049.

## RTS-048 – Separat fog-grid

[fog.ts](src/gameplay/fog.ts) har oberoende boolean-arrayer visible/explored
per team, begränsade radius-sökningar och rock-LOS via befintlig segment-
geometri. [matchFog.ts](src/gameplay/matchFog.ts) härleder levande unit-/
färdig-building-observers och rock-blockers; [fog.ts](src/config/fog.ts)
ger radier. Matchfactory/update skapar och uppdaterar fog, efter spawn/
destruction och även vid delta 0 för färsk observer-death. Legacy-fixtures
utan fog ändras inte av zero-delta. Inga globala configs muteras.
[fogView.ts](src/presentation/fogView.ts) ritar preview-Graphics på depth 40
endast med märkt URL-fixture. Normal rendering/targeting påverkas inte förrän
RTS-049. Explored är bara terrain-minne, inga enemy-state-snapshots.

## RTS-049 – Aktivt visibility-kontrakt

[visibility.ts](src/gameplay/visibility.ts) definierar unit-center, building-
footprint, explored-resource och full-footprint-placement. Match beräknar
vision efter gathering/building, skickar samma player/enemy-predicates till
combat/AI och uppdaterar efter combat/production/spawn. Explored från dessa
steg bevaras; redundant fog-beräkning före varje positivt delta togs bort.
Delta 0/early outcome uppdaterar ändå death-vision.

Combat filtrerar explicit targets, acquisition, enemy local targets/defense
och projectile-impact. Förlorade explicit targets släpps; group/wave-AI kan
utforska mot ett konfigurerat mål utan att läsa dold unit-position. Renderer
filtrerar enemy bodies/HP/labels/order-markers och projectile-position; dolda
objekts visuals förstörs. Unknown-mask är opak, explored är mörk terrain.
Visible-minimap använder endast statisk terrain och filtrerade fresh markers,
plus fog-mask; hidden enemy-footprints kommer aldrig via obstacle-listan.
HUD visar own ekonomi, men hidden node-remaining är `?`; neutral icons
avslöjar inte dold depletion. Input gate: hidden enemy kan inte hit-testas,
resurs kräver explored, placement kräver current vision över hela footprint.
Own preview/drag-UI ligger ovanför fog. Inga live enemy-memory snapshots.

## RTS-050 – Selection-composition och gruppreferenser

[controlGroups.ts](src/gameplay/controlGroups.ts) kombinerar urval och binder/
återkallar/prunar ID:n utan order-mutation. MatchState.controlGroups är en
ren slot→IDs-map, fresh i factory och death-pruned av destruction före
outcome-freeze. [keyboard.ts](src/presentation/keyboard.ts) har ren focus/
repeat/game-over-guard. BootScene latchar Shift på pointerdown, binder en
group-key-listener med shutdown-cleanup och ger spelcanvas explicit fokus.
Recall ändrar endast selection och cancellerar UI-preview. Group-status
visar enbart egna gruppantal; hidden/foreign targets får inte återkallas.

Visibility-granskning rättade dessutom cleanup för det fasta `explore-goal`:
legitim navigationcache ska överleva även om det inte är ett levande target-ID.
Regression verifierar fortsatt waypoint-cache utan dold bas-skada.

## RTS-051 – En gemensam action-väg

[hotkeys.ts](src/presentation/hotkeys.ts) beskriver mapping/guide och ren
resolver/dispatcher. BootScene binder en action-listener med shutdown-cleanup
och dispatchar till samma aktiverade HTML-knapp som mouse-UI; inget parallellt
cost/order-system. Alla labels får samma config-suffix. Keyboard-context
blockerar UI/editable, repeat, modifierade bokstäver, pause och game over.
Escape går genom samma synkrona window-key-listener/cancel-handler; ingen
blandning med Phasers frame-kö för Escape. Pause-flaggan i
guarden kopplas till livscykel i RTS-052. Gruppsiffror har separat befintlig
slot-kontrakt, så samma event ger inte både action och group recall.

## RTS-052 – Session och gameplay-gate

[session.ts](src/gameplay/session.ts) har rena menu/playing/paused/ended-
övergångar, immutable startval och first-frame-delta-gate. MatchState.paused
returnerar före cleanup/simulation så samtliga clocks/orders/projectiles/AI
fryser. BootScene fortsätter view/render-menysteg; resume samlar ingen wall-
time och skippar första gameplay-frame. Alla handlers/keyboard/action-knappar
använder gameplayActive, och production-UI ligger i disabled-fieldset.
Minimapkamera/guide/session-meny är separat aktiva under pause.

Session start/restart köar fresh scene/match med pending-guard, fresh listeners
och camera-reset. Menyval kan inte mutera aktiv session; Start skapar rätt
scenario/profil. Canvas döljs i menu; vid show körs ScaleManager.refresh för
att återställa displayScale (updateBounds ensamt kan ge NaN efter hidden).
Meny-targets exkluderas från pointerup-selection. P/Escape går i samma key-
router med fokusguard; Escape ger preview-cancel före pause.

## RTS-053 – Reproducerbar native pixel-atlas

[world.mjs](assets/sources/world.mjs) handkomponerar tiles/noder med egna
integer-penslar i [pixelArt.mjs](scripts/pixelArt.mjs) och [palette.json](assets/palette.json).
[export-assets.mjs](scripts/export-assets.mjs) skriver PNG 8-bit RGBA/atlas/
manifest till public/assets. Inga raster-importer, nya dependencies eller
runtime-mapgeneratorer. [assets.ts](src/presentation/assets.ts) mappar
terrain/config och observed resource-state till stabila frames. BootScene
preloadar atlas; native tileImages och centerankrade nodeImages ersätter
rektanglar/cirklar. Phaser pixelArt/roundPixels gäller endast rendering.

NodeFrame 64 × 64, anchor (32,40), origin (.5,.625), oförändrad logical
footprint 40 × 40 kring world-node-center. Decorations utanför footprint
ändrar inte hit-test/hinder. Hidden depletion ger statisk available-symbol,
inte dold qty-state. [assets.test.mjs](tests/assets.test.mjs) validerar exporter
med Node fs/zlib utanför src:s strikta browser-TypeScript; inga Node-typdeps
införs. Produkt och gameplay-tester behåller strict TypeScript.

RTS-053-tillägg: native gräs med enhetlig grundton, pixelstrand/bergskanter endast vid exponerade patchkanter och egna skogs-/gruvresurser. Övergångar ändrar inte navigation eller footprints. Exporten omfattar 16 world-frames.

## RTS-054 – Byggnadssprites

Egen RGBA-atlas från assets/sources/buildings.mjs: bas, barracks, farm och Forge med blå/röd heraldik och tre statiska frames (grund, halvbygge, färdig). 128 px standard, farm 64 px; ankare är (.5,.75) vid logisk footprint-center. Native rendering utan skalning; befintliga footprints (spelbas 48 px, fiendebas 96 px, andra byggnader 64 px), HP och byggtid ändras inte. Foundation används över halva återstående byggtiden; halvbygge därefter, färdig vid noll. Enemy-varianter finns för alla typer men inga nya enemy-byggsystem införs. Fog/death tar bort renderobjekt; selection följer footprint, bas/fiendebas har synlig HP-text. Källor/palett/atlas/manifest exporteras med assets:export, ingen extern spelgrafik.

## RTS-055 – Enhetsanimationer

960 egna RGBA-frames i units-atlas från assets/sources/units.mjs: worker med verktyg, armored soldier/sköld, archer/båge och träcatapult. Blå/röda lagfärger, åtta riktningar (E, SE, S, SW, W, NW, N, NE), idle 1 och walk/attack/death 4 frames; worker gather/build 4. Humanframes 32 px med ankare (16,22), catapult 64 px (32,40). Walk/work/attack loopar i 8 FPS, death är en separat 0,5 s presentationsrest efter logical removal, utan HP/selection/target. Fog hiding skapar ingen död; dolda/dead renderobjekt och rests städas vid reset. Facing/state/frame väljs i presentation/animation.ts; simulationstiden styr bildtid, paus fryser även frames. Damage, gathering och construction drivs fortfarande enbart av gameplay-delta, aldrig animationsevents. Hitboxes/navigation/supply är oförändrade. Källor är egen originalkomposition, inga importerade spelsprites.

## RTS-056 – Eget ljud

16 s originalkomposition och command/impact/complete/victory/defeat från scripts/export-audio.py, PCM WAV-masters (mono 24 kHz/16 bit) och lokala Vorbis OGG med WAV-fallback. Manifest beskriver loop/duration/normaliseringsvolym. Appens enda Web Audio-graf skapas efter första klick/tangent eller Aktivera ljud; separata master/effects/music och mute verkar direkt, inställningar bevaras vid scene-restart. Pause suspenderar grafen; menu/game over/reset stoppar gamla källor. Musiken loopar exakt 16 s och exkluderar codec-padding. Throttle och looplängd finns i config/audio.ts. Public damage/completion hörs; enemy-händelser kräver syn både före och efter, och hidden removal/reveal är tyst. Saknat ljud blockerar inte gameplay.

Chromium-desktop är verifierad ljudprofil (OGG och WAV); andra browsermotorer är ännu inte verifierade. Exportverktyget soundfile används endast utanför projektets runtime/npm-dependencies: skapa en temporär Python-venv, installera soundfile där och kör scripts/export-audio.py, eller npm run audio:export med sådan miljö. Färdiga assets är incheckade; npm ci/build behöver inget Python-ljudverktyg.

## RTS-057 – Fantasy-HUD och effekter

Original trä-/mässingspanel med 16-px border, åtta 32-px ikoner och läsbara blå/röda lagfärger. Desktop (1280×900) har 280-px scrollande kommandopanel intill native 800×600 world; under 1120 px staplas world/HUD, inga worldkoordinater skalas. Georgia/systemfont är lokala standardfonts, inga externa font-/assetanrop. Hover/pressed/disabled/focus är olika; text/labels och keyboard-guide finns kvar, aria-pressed visar modes. HP är kompakta staplar; worker-last visas vid markerad worker, detaljer kvar i status.

Impact 32 px och splash 64 px har fyra egna frames i 8 FPS, 0,5 s bounded lifetime/max 64 effekter. Presentation visar synliga projektilers landningspunkt, även en synlig miss, utan att läsa dold HP eller driva damage. Fog/pause/reset styr effekternas syn/livstid; gameplay och inputfunktioner är oförändrade. Exportkälla assets/sources/ui.mjs, manifest/panel/atlas under public/assets.

## RTS-058 – Tre uppdrag

Startmenyn behåller Survival/Skirmish och lägger till Skogsvakten (besegra tre vågor, 20 wood/10 gold), Belägringen (förstör fiendebasen, 20/10) och Utposten (håll basen vid liv i 90 gameplay-sekunder, 40/10). Instruktion och start är explicita scenario-configs på befintlig handgjord arena. Utpostens normal-vågor är 30/60/80 s (1/2/2 fiender); Easy senare/färre och Hard tidigare/fler. Andra missions använder befintlig difficulty-pressure.

Måltid använder gameplay-delta; stora steg delas vid deadline så seger stannar exakt vid 90 s. Defeat har alltid företräde vid samma boundary. Levande fiender hindrar inte timerseger. Scenario/map/objective/start kan återställas individuellt och menuval påverkar först ny match; pause fryser även mål. Ingen kampanj, ny unittyp eller terränggenerator införs.

## RTS-059 – Lokal sparning

Spara lokalt skriver en manuell slot i denna browsers localStorage. Ladda sparning fungerar även från startmenyn och öppnar en levande match pausad; välj Återuppta. Ingen autosave eller filimport/export. Slot finns kvar efter restart/ny match och sidreload; privat läge/rensad webbläsarlagring kan göra den otillgänglig. Localhost och Pages har olika origins och delar inte sparningar.

Schema 1 / tribute-config-1 innehåller hela modellen, scenario/arena/tid/outcome/pause, resurslaster/saldo, units/orders/IDs/HP, byggtid, FIFO-kostnader/rally/reservationer, research, projektiler, AI-budget/grupper/waves och fog/explored samt kamera/byggnadsselection. Navigation och render/audio/listeners/blocked-spawn-cache lagras inte. Matchens dynamiska footprints valideras mot sparade byggnader/resurser; enheternas clearance, ID-referenser, queue/config och fog-form granskas innan state byts atomiskt. Navigation planeras om från orders, current vision räknas om medan explored bevaras.

Korrupt/okänd äldre/framtida schema eller annan config-version avvisas; ingen migration uppfinns. Aktiv match och tidigare slot förblir oförändrade vid load-/storagefel. Load rensar uncommitted previews och återskapar scenens render/listeners, ger ingen wall-time-bonus och laddar terminala matcher som terminala. save.ts och config/save.ts är Phaser-fria. Fog-factory sparar nu endast deklarerade worlddimensioner, inte oavsiktliga gamla map-obstacles.


## RTS-060 – Release och basrelativa assets

[vite.config.ts](vite.config.ts) behåller dev på `/` och använder `/warcraft-2-tribute/` för build/preview. BootScene atlas-loader använder `import.meta.env.BASE_URL`; audio gör redan det och Vite skriver om CSS-assets. Exportmanifest har relativa assetvägar. `preview` är lokal kontroll av dist, ingen runtime-server/backend i produktion. Pages använder samma dist efter npm ci/test/typecheck/build.

[src/gameplay/testHelpers/releaseBot.ts](src/gameplay/testHelpers/releaseBot.ts) är enbart teststrategi och importeras inte av appen: befintlig selection/order, fog, placement/construction och betald produktion, utan injicerad ekonomi/HP/units. [releaseMatrix.test.ts](src/gameplay/releaseMatrix.test.ts) kör fem scenarios × tre profiler, pause/save-roundtrip, terminal freeze, total resursbevarande och fresh factory. Ett valfritt observer-anrop användes för browserns accelererade rendering; naturliga UI-playthroughs redovisas separat i [releasekontrollerna](RELEASE_CHECKLIST.md).

Save-status rensas vid ny match/restart och ändras från pausad till fortsätter vid resume, så gamla DOM-meddelanden inte beskriver ny simulation felaktigt. Ingen gameplaybalans eller bundle-split ändrades i denna task. Browsermätning använder scene pre/post-update (inklusive HUD-synk), RAF-intervall och CDP-GC/heap, inte uppskattad FPS från gameplay-delta.

[Pages-workflow](.github/workflows/pages.yml) har separat build/deploy och pinade officiella actions: build-token contents/pages read, deploy-token pages/id-token write. Push main och workflow_dispatch delar concurrency pages utan avbruten pågående publicering. CI använder Node 22 och låst npm ci; deploy kör enbart godkänd dist.


## RTS-061: kvalitetsgranskning

[QA_REVIEW.md](QA_REVIEW.md) beskriver verifierad Pages, betald större blandad armé, prioriterade fynd och browser-/tillgänglighetsgränser. Inga blockerande/P1-regressioner; överlappning och resurs-trängsel hanteras i RTS-063/064. Ny godkänd etapp fortsätter till RTS-065; RTS-066–090 är endast planerade.


RTS-062: QA-granskningen gav ingen bekräftad P0/P1-fixlista; gameplay/save-format är oförändrade. Överlappning och köer hanteras taskvis i RTS-063/064 enligt QA_REVIEW.md.


## RTS-063: lokal separation

[separation.ts](src/gameplay/separation.ts) och [config](src/config/separation.ts) separerar kvadratiska unit-kroppar deterministiskt med max48 px/s correction, spatiala64px-celler/två pass/12 grannar. Terräng/world bounds respekteras; orders/last/selection/HP bevaras. Rörda pathcaches planeras om, blockerade kommandoresultat behålls utan automatisk fallback. Fog uppdateras efter separation; paus/game-over fryser. Save schema/config1 behålls utan ny persistent state. Kortvarig kontakt vid rörelse och omöjlig packning i trång terräng kan kvarstå; resource/passage-köer följer i RTS-064.

## RTS-064: härledda resurs- och passageköer

`gameplay/resourceQueue.ts` använder live gather/deliver-orders och matchens sparade gameplay-tid. Vid fler än tre workers på samma nod väljs högst tre nåbara kontaktpunkter, med kroppsstorlekens avstånd mellan punkterna; övriga får väntpunkter utanför arbetsräckvidden. Prioritet roterar var femte sekund. Upp till tre workers behåller tidigare approach-beteende. `config/traffic.ts` samlar gränserna. Delivery krediterar fortfarande ekonomin först vid basen.

`gameplay/traffic.ts` härleder smala, sammanhängande passager från kroppsgiltiga tilecentra med högst två fria grannar. En aktiv kropp i passagen får företräde; annars väljs en väntande entrant med roterande prioritet. `MovementGate` begränsar den del av delta som navigation får använda. Gather, build, move, attack-move och enemy movement delar samma gate. Väntan bevarar orders och waypoints; RTS-063:s mjuka separation gäller fortsatt.

Köer/reservationer sparas inte som nya refs: de återskapas från positioner, orders och tid. Idle/döda/borttagna kroppar behåller inga lås. Maprevision och obstacle-geometri invaliderar härledd passagecache. `updateMatch` delar även större delta vid resursrotation; ingen fixed timestep eller generell trafik/pathfinding-ombyggnad.

## RTS-065: profileringsmotiverad navigation

`approachRoute` använder rak avståndsgräns för att undvika BFS-kandidater som inte kan slå den funna rutten, med tidigare tie-ordning. Efter separation behålls moving-navigation när nästa segment har kroppsgiltig clearance; revisionsfel, blockerad sträcka och flyttad arrived-position ogiltigförklarar den. Det minskar upprepade combat-routesökningar utan nya system eller persistent state. Navigation är fortsatt cache och Load räknar om från sparade positioner. `testHelpers/loadFixture.ts` och `scripts/profile-browser.mjs` hör endast till verifiering, inte app-bootstrap/dist. Metod/budget/resultat finns i [PERFORMANCE.md](PERFORMANCE.md).

## RTS-066: fraktionsidentitet och typkatalog

[config/factions.ts](src/config/factions.ts) definierar stabila crown/clans-ID:n och unik typidentitet för fyra unitroller, fyra byggnadsroller och två uppgraderingsroller. Numeriska katalogvärden kommer från befintlig config, med separata costobjekt per fraktion. Katalogen är grunden för RTS-068; gameplay använder tills vidare tidigare stats och fiendeprofil. Team/owner är oberoende av fraktion.

`MatchState.factions` skapas av createMatch, kopieras per match och bevaras av BootScene-adapterns apply/currentMatch samt restart. Fältet är valfritt för befintliga isolerade gameplay-fixtures, med explicita standarder vid lookup/Save; verkliga nya matcher och v2-sparningar har båda teamens ID:n. Save v2/config2 migrerar endast v1/config1 genom att tillföra standardidentitet innan samma fulla atomiska validering. Förändrade, okända eller spooffält avvisas. Slotnyckeln behålls för att hitta tidigare saves; migration skriver inte i storage förrän användaren sparar. Ingen UI/art-/balansändring i denna task.

## RTS-067 – Fraktionspresentation

`config/factions.ts` innehåller namn och `factionsForPlayer` för nya matcher. Sessionens val är endast redigerbart i menyn; BootScene bevarar faktiska sparade faction-ID:n vid load/restart. Presentationens motion/death och buildingFrame väljer atlasvariant efter fraktion och team. Kronförbundet behåller befintliga frame-ID:n; Järnklanen har prefix `clans-`. Båda delar befintlig simulation, kostnader och geometri. Atlasexport och tester täcker 1 920 unit-frames och 48 byggframes; units-atlas är 2048×4096, buildings 1024×768. Gameplay drivs fortfarande av delta, inte animationer.

## RTS-068 – Gemensam fraktionsproduktion

`productionRecipe` hämtar kostnad/tid/supply/HP/size ur fraktionskatalogen för både direkt och FIFO-produktion. `GatheringState.faction` är härledd ägarcontext från createMatch/Load; isolerade äldre fixtures använder crown-baslinjen. Jobbet lagrar betald kostnad och återstående tid; refund och blocked spawn återanvänder befintlig logik. Enemy-adaptern anger fiendens faction och justerad difficulty-tid utan att föra tillfälliga units till player-state. Scene/HUD använder katalogens kostnader och spelarens max-HP; fraktionssystemen är Phaser-fria.

Config3-save validerar jobbrecept mot rätt sida. Migration från config2/v1 stämplar gamla ändrade soldierrecept och validerar deras gamla kostnad/tid innan atomisk Load. Den stämpeln bevaras bara i köjobbet; nyproduktion använder aktuell config. `factionProduction.test.ts` kontrollerar betalning, deadlines, HP, timesteps, blockering, refund, samtidig produktion, migration och ändlig enemy-budget. Äldre difficulty/AI-regressioner använder explicit crown-enemy för oförändrad baslinje; nya tester kontrollerar clans-receptet.

## RTS-069 – Fraktionsförmågor

[config/abilities.ts](src/config/abilities.ts) anger namn, effektfönster, cooldown och multiplikatorer. [gameplay/abilities.ts](src/gameplay/abilities.ts) hanterar endast markerade levande ready stridsenheter; orders/selection/workers bevaras. Ingen enemy/target-data läses vid aktivering. Combat kombinerar buffen med befintlig research; ranged/siege-projektiler lagrar damage vid skottet och ett skott vid exakt effektslut får ingen utgången bonus.

Matchupdate delar delta vid aktiv effektgräns och tickar unit-timers efter stegets combat. Pause/terminal state tickar inte. Scene-adaptern kopplar knapp/E och visar endast egna valda units timerstatus; listeners tas bort vid shutdown. Save config4 validerar active/cooldown inklusive deras tidsrelation och migrerar config3 utan buffar. Tidigare config1/config2-köjobbsmigration kvarstår. Ingen Phaser-import i förmågelogiken, inga nya assets eller enemy-AI-förmågor.

## RTS-070 – Fraktionsregression och speltest

`testHelpers/releaseBot.ts` kan välja faction och aktivera förmågor genom samma gameplay-command. Explicit fraktionsspeltest använder gold under byggtid, worker-skydd och fortsatt anfall efter störd ekonomi; ursprungliga release-kontrollen behåller tidigare strategi. `factionBalance.test.ts` kontrollerar 30 scenarios/difficulties/factions samt två legala defeat-/new-match-isoleringar med save/ledger/terminal freeze. Teststrategin importeras inte av appen; runtime-bundle är byte-identisk med RTS-069. Metod och naturliga browserresultat i [FACTION_BALANCE.md](FACTION_BALANCE.md).

## RTS-071: enemy gathering och delad ekonomi

[enemyGathering.ts](src/gameplay/enemyGathering.ts) adapterar enemy-worker-entiteter
till befintlig gathering för en simulationstick. Position/HP/work är auktoritativa
i combat.enemies; tillfälliga worker-vyer sparas inte i spelarens unit-array.
Basens 96 px-footprint skickas som härledd baseSize till samma approach/delivery.
prepareEnemyGathering ger idle-workers deras fasta resursorder före gemensam
servicekö och passageplanering. Matchupdate samlar först spelarens och sedan
fiendens last ur samma uppdaterade noder, aldrig separata kopior av resurserna.
Serviceplatser reserveras bara av gather-orders; leverans frigör arbetsplatser.

Enemy-production betalar verkliga banksaldot och bokför spent; extracted och
lostCargo bevarar resursbalansen inklusive levande laster. Arbetare ingår i
fog, fysisk separation, spawn-occupancy och passagekö, men inte army-cap,
attack eller AI-grupper. Dödade arbetare finns kvar till cleanDestroyeds
lastbokföring i samma tick. Basdöd tar bort arbetsorder innan terminal freeze.
[enemyEconomy.ts](src/config/enemyEconomy.ts) anger två arbetare, nodval och
20 s extra attack-grace för nya ekonomimatcher. Ingen passiv income.

Save config5 validerar worker-ID/HP/last/nodorder, militära referenser,
bank/extracted/spent/lostCargo och resursbalans mot noderna. Migration från
config4 bevarar tidigare modell utan nya entiteter/inkomster; spoofade nya
fält i gamla versioner avvisas. Derived baseSize och navigation lagras inte.
[enemyGathering.test.ts](src/gameplay/enemyGathering.test.ts) verifierar dessa
beteenden. Release-matrisens globala ledger inkluderar fiendens extraktion.
Kontrollerade load-fixtures behåller exakt 64/128 kroppar utan extra ekonomi.

## RTS-072: begränsad enemy-construction

[enemyConstruction.ts](src/gameplay/enemyConstruction.ts) härleder tillfällig
PlacementState/GatheringState ur enemy-entiteter och återanvänder placement,
resumeConstruction, workerbyggtid och populationState. Auktoritativa
Enemy-building-entiteter har footprint, HP, buildingType och construction.
MatchState.enemyConstruction lagrar endast retry-tid och markerar den nya
policyn; ingen dubbel persistent placement-modell.
[enemyConstruction.ts](src/config/enemyConstruction.ts) anger sex kandidater,
1s retry, en farm och supply-margin1. Placering betalar bank exakt en gång
och bokför spent. Shared regler validerar grid/world/obstacles/body/nåbar
worker och produktionsutgång; spelarens varierande body-storlekar kontrolleras
också innan placement. Död builder frigör site-reference; en levande worker
kan återuppta. Last bevaras under bygge och efteråt återgår worker till
resursordern. Bas-/byggnadsdöd rensar orders och fysiska hinder.

Enemy-production behöver färdig barracks i nya matcher och spawnar vid dess
footprint. Population är shared base8/farm+5, med workers/reservationer,
samt separat difficulty-army-cap. Vid supply-margin sparas bank till farm;
befintliga betalda jobb fortsätter. Construction rapporterar barracksReadyAfter
som transient resultat, så produktionen bara använder delta efter färdigt
bygge och aldrig samma tid två gånger. Ingen ändring av spelarens byggpolicy.

Save config6 validerar enemy-site/grid/HP/builder/order/obstacle och retry.
Config5/äldre migreras utan enemyConstruction eller gratis sites, och
fortsätter tidigare base-production; spoofade nya fält avvisas. Röda
byggnadsframes, HP och visionradius härleds efter fog.
[enemyConstruction.test.ts](src/gameplay/enemyConstruction.test.ts) täcker
betalning, blockering, ersättningsbuilder, tid, supply, save och destruktion.

## RTS-073: härledd enemy-budgetpolicy

[enemyPolicy.ts](src/gameplay/enemyPolicy.ts) härleder prioritet ur egen
levande armé, supply, sites och betald research.
[enemyPolicy.ts](src/config/enemyPolicy.ts) anger minimum tre stridsenheter.
MatchState.enemyPolicy innehåller endast auktoritativ ResearchState.
Forge använder samma enemy-building-vy/placement/construction som barracks;
research återanvänder spelarens kostnad/tid/krav och bokför spent.
EnemyProduction.startAllowed stoppar nya betalningar under besparing men
bevarar progression av betalda jobb. Aktiv betald research tillåter nya
army-jobb; armé under tre prioriteras före nästa uppgradering.
Idle/tomma gather-orders kan byta resurs efter budgetbehov, aldrig lastade
leverans-/byggorders. Workers och byggnader får inga combat-bonusar.

Combat.enemyUpgrades är en transient härledd cache; endast research sparas.
Match splittrar delta vid enemy-research-slut så buffs gäller efter
färdig forskning. Forge-/basdöd avbryter jobbet utan refund; lärda
nivåer består. Save schema2/config7 validerar research/site/referenser
och återskapar cache. Config6/äldre migreras utan policy, Forge eller
gratis nivåer. [enemyPolicy.test.ts](src/gameplay/enemyPolicy.test.ts)
täcker prioritet, betalning, tid, last, effekter och migration.

## RTS-074 – worker-återhämtning och extra resursbas

[enemyRecovery.ts](src/gameplay/enemyRecovery.ts) använder shared
enqueueProduction/updateQueuedProduction genom en tillfällig gathering-vy.
MatchState.enemyRecovery äger worker-produktionsstate; bank/ledger ägs
fortfarande av enemyProduction och enheter av combat.enemies. Population
omfattar båda byggnaders betalda reservationer. Worker-behov stoppar nya
army/research-starter, men befintliga jobb fortsätter. Enemy-worker-ID:n
ökar från3; endast en ersättning i taget till två levande workers.
Base-spawn använder GatheringState.baseSize för faktisk footprint;
spelarens befintliga48px-bas bevarar samma beteende.

Save config8 verifierar worker-job/recipe/timer/counter/supply-target och
levande bas. Config7/äldre migreras utan recovery-policy.
[enemyRecovery.test.ts](src/gameplay/enemyRecovery.test.ts) täcker betalning,
tid, flera förluster, blockerad spawn, supply, migration och reset.
[enemyExpansion.ts](src/gameplay/enemyExpansion.ts) placerar en extra96px
resursbas med configkostnad80/20 och10s shared updateSite-arbete.
[enemyExpansion.ts](src/config/enemyExpansion.ts) begränsar kandidater/
retry/HP/supply. Auktoritativ outpost är en enemy-building-entitet;
retry ligger i enemyRecovery. Ingen parallell persistent byggnadsmodell.
GatheringState.dropoffs är härledda levande färdiga footprints, aldrig
sparade. Leverans väljer närmaste nåbara footprint och återanvänder
giltig route; förstörelse/revision gör om valet. Population räknar +8
enbart efter färdigt bygge. Samma bas-sprites/byggstadier och fog används
med tydlig Resursbas-text. [enemyExpansion.test.ts](src/gameplay/enemyExpansion.test.ts)
täcker kostnad, blockering, tid, leverans, supply, builderbyte och Save.
Save config8 validerar96px-footprint/240HP/10s/outpost-order/retry.
Huvudbasens objective/workerproduktion ändras inte.

## RTS-075: egen observationsmodell

[enemyKnowledge.ts](src/gameplay/enemyKnowledge.ts) äger observerade
ResourceNode-kopior, sista basposition samt begränsade scout-index i
MatchState.enemyKnowledge. [enemyKnowledge.ts](src/config/enemyKnowledge.ts)
anger fasta terräng-sökrutter/ankomstgräns. observeEnemyKnowledge
använder endast enemy-fog vid synlig node/base; hidden memory bevaras.
Budget, nya gather-orders och expansion härleds från detta minne.
Faktisk updateGathering använder fortsatt shared finite node och ledger;
nodeVisible hindrar dold uttömning från att avbryta fjärran gather.
Kontakt validerar faktisk mängd utan gratis wood/gold.

En tom idle/move/gather-worker kan utforska; befintlig scout återanvänds.
Bygg-/lastade orders bevaras. Militär dispatch/defender-release får
sökpunkt eller minnesbas i stället för faktisk osedd spelarposition.
Sökpunkt ändras vid ankomst; observerad bas retargetar attack-orders.
Befintliga fog-filter för lokal attack bevaras. Fysisk hinder-/spawn-
validering behöver faktisk map; den representerar inte strategiskt minne.

Save config9 validerar index, unika kända noder/positioner/mängder och
explored-celler; config8/äldre behåller tidigare AI-policy utan tillagd
kunskap. [enemyKnowledge.test.ts](src/gameplay/enemyKnowledge.test.ts)
täcker dolda tillstånd, scouting, lokal upptäckt och migration.

## RTS-076: enkla kartprofiler

[maps.ts](src/config/maps.ts) definierar arena/forest/river med label,
ändlig wood/gold-stock och handgjorda terrain-patches. WorldMap.id är
profil-ID (äldre states utan ID betyder arena). createMap(id) bygger
fysiska hinder, createMatch(...,mapId) skapar profilens ursprungliga noder.
Bas-/nodpositioner och världsstorlek bevaras; inga genererade system.
Fog-LOS, tile-sprites/kanter och minimap tar samma profil som navigation.

MatchOptions.map använder MapId. Scenen läser sessionens kartval vid
Start/restart och laddad match vid Load. Befintligt enkelt menykartval
aktiveras endast i Skirmish; andra scenarios återgår till arena.
Save config10 validerar dokument/state-ID, scenario, terrain-refs och
profilens maxstock/ledger/minnesmängd. Config9/äldre migreras enbart som
arena; spoofad alternativ karta avvisas.
[maps.test.ts](src/gameplay/maps.test.ts) verifierar spawns, nåbarhet,
terrain/minimap, sex betalda fraktionsmatcher samt strikt map-save.

## RTS-077: validerade matchinställningar

[matchSettings.ts](src/gameplay/matchSettings.ts) validerar MatchOptions
och atomiska patches. Okända värden/fält och explicit icke-skirmish-
altkarta avvisas. Scenario-only byte till mission/Survival normaliserar
kartan till arena. createSession kräver giltiga options; changeOptions
använder samma validering och fungerar enbart i menu. Typad intern
siege-test-fixture bevaras men finns fortsatt inte i spelarens dropdown.
[matchSettings.ts](src/presentation/matchSettings.ts) sammanfattar vald
stock/fraktionsförmåga/fiendetryck utan gameplay-mutation. Scenen binder
befintliga dropdowns, visar sammanfattning i menyn och använder faktiska
sessionsval vid Start/restart.

[matchSettings.test.ts](src/gameplay/matchSettings.test.ts) verifierar
atomiska fel, mode-lock och18 verkliga factory/save/restart-kombinationer.
Ingen ny sparbar options-kopia eller schemaändring: Save config10 lagrar
fortsatt matchens faktiska scenario/map/factions/difficulty.

## RTS-078: härledda matchresultat

[matchStats.ts](src/gameplay/matchStats.ts) beräknar ren MatchStats från
profilstock, faktisk kvarvarande node, bankers/båda teams laster/loss,
enemy-extracted/spent och monotona spawn-counters. Spelarens insamlat =
initial node minus remaining minus enemy-extraction. Levererat = gathered
minus last/lostCargo. Netto spenderat = initial bank plus gathered minus
balance/cargo/lost; refunds reducerar detta, betalda jobb ingår direkt.
Enemy-ledger används direkt; legacy-budget utan income ger endast faktisk
initial budget minus balance som spenderat, ingen uppfunnen gathering.

Tillkomna units kommer från gemensam player-nextUnitNumber och enemy
wave/producer/recovery-counters, exklusive initiala workers. Unit-loss
= initial + spawned minus live bodies, exklusive byggnader; varje teams
loss motsvarar motståndarens besegrade enheter i nuvarande stridsmodell.
Ingen andra persistent score/event-modell och ingen Save-schemaändring.
[matchResults.ts](src/presentation/matchResults.ts) renderar outcome/tid
och9 avrundade rows endast vid ended. Oförändrat resultat renderas en
gång; restart/menu döljer och rensar DOM.
[matchStats.test.ts](src/gameplay/matchStats.test.ts) verifierar verklig
insamling/refund/produktion/död, paid victory och Save/freeze.

## RTS-079: skirmish-regressioner

[skirmishBalance.test.ts](src/gameplay/skirmishBalance.test.ts) kör18
betalda playthroughs med samma command-bot och verklig Save/load.
Enemy-bank + spent + last + lostCargo = initial budget + extraction
kontrolleras under matchen; shared finite stock och spelarens totala
kostnad verifieras. Sex passiva Normal-matcher verifierar terminal
defeat och freeze. Sökpunkter måste passa land på alla kartor.
EnemyExploration normaliserar gamla attack-move-destinationer till den
aktuella indexerade rutten utan ny kunskap eller Save-schemaändring.

## RTS-081: härledda rörelsedomäner

[terrainNavigation.ts](src/gameplay/terrainNavigation.ts) återanvänder
befintlig body/segment/BFS/route-motor. Landmap är originalet. Watermap
partitionerar världen vid terränggränser och blockerar vattenunionens
komplement plus dynamiska byggnader/noder. Hel square-body måste passa
och swept segment kan inte gena över land. Ingen kopia av domänmap
lagras i match eller Save; map-ID och revision är auktoritativa.
Kustfootprint kräver positiv area i båda domänerna, world bounds och
frånvaro av sten/dynamiska hinder. Placering, kustutgång och fartyg
kopplas in i RTS-082; inga nya entities/scenknappar i denna grundslice.
[terrainNavigation.test.ts](src/gameplay/terrainNavigation.test.ts) provar
storlek, vattenunion/separata dammar, swept route/order/revision, kust
och rekonstruktion efter Save/reset på alla tre kartor.

## RTS-082: hamn och fartyg

[navy.ts](src/gameplay/navy.ts) har separat valfri NavyState med en
harbor, ship-lista och befintlig ProductionState/FIFO-job-shape.
Fartyg ligger inte i gathering.units: ingen oavsiktlig landstrid eller
wood-last. WorkerOrder/updateSite accepterar harbor och bevarar last;
map.obstacles innehåller den auktoritativa footprintens fysiska hinder.
Kust/syn/builder-åtkomst/utgång kontrolleras vid betalad placering,
och arbetarens resursvägar samt befintliga produktionsutgångar bevaras.
PayCost, Population, spawn-candidates/exit, refundpolicy och route-motor
återanvänds; fartygsspecifik FIFO-completion använder vattenmap och
NavyState-spawn. MatchPopulation inkluderar land/fartyg och alla
reservations. Ships har monotona ship-ID:n, maprevisionstyrd movement,
vision/minimap och härledda resultat. Selection/drag/groups/Stop delar
befintliga SelectableUnit-helpers; scenen distribuerar tillbaka listorna.

Save schema2/config12 validerar coast/physical obstacles/builderrefs,
ship-ID/HP/domain/body, naval cost/time/supply/job IDs och selected harbor.
Config10 migrerar utan gratis NavyState; config1–9 behåller kedjan.
Route-cache serialiseras inte: vattenroute återskapas efter Load.
[navy.test.ts](src/gameplay/navy.test.ts) provar faktiskt betalda
byggnader, insamling, FIFO/refunds/supply/spawn, orders och Save.


## RTS-083: marina attacker

[navalCombat.ts](src/gameplay/navalCombat.ts) förbereder vattenrörelse och
fixed-aim-skott från samma levande snapshot som landcombat. Gemensam
combat/projectile-uppdatering applicerar damage före death-städning.
MarineFlightMap tar bort vattenblockerare men behåller sten och byggnader;
landprojektilernas befintliga regler ändras inte. Firing-contact använder
vattenadaptern och fog-syn; dolda mål rensar order. HP/cooldown/orders ligger
i NavyState, skott i CombatState.projectiles. Config12 sparar strict attack-
refs/cooldown/marine-recipe och migrerar11 utan att skapa stridsstate.
Fiender kan använda befintlig landapproach mot ship/harbor, utan ny sjö-AI.
[navalCombat.test.ts](src/gameplay/navalCombat.test.ts) täcker skott,
vattenkontakt, LOS/fog, samtidiga dödsfall, hamnens städning och Save.


## RTS-084: transport och passagerarnas ägarskap

[transport.ts](src/gameplay/transport.ts) hanterar omedelbar lastning och
atomisk landsättning utan Phaser. Transport använder samma hamn-FIFO,
vattenrörelse, ship-ID/counter, HP och supply som stridsfartyg; role transport
är obeväpnad. Ship.passengers är enda ägare till lastade Unit-objekt;
de finns inte samtidigt i GatheringState.units. ID/HP/archetype/resurslast
bevaras. Orders/selection/routes rensas, förmågetimers fryser med passageraren.
Landning planeras helt före mutation, med body clearance, syn, fri kontakt
och occupancy för varje kropp. Boarding städar builder-/enemy-/group-refs.

MatchPopulation och MatchStats inkluderar passagerare. CleanDestroyed
bokför last från sänkta passagerare en gång och tar bort deras supply.
Scenen visar ingen dödsanimation när en enhet bara går ombord. Save
schema2/config13 validerar ground+passenger-units med gemensamma unitregler,
unika ID/counters, kapacitet, inactive-state, carrier/recipe och refs.
Passagerare har ingen fysisk markposition; land clearance krävs efter
landsättning. Config12 migrerar utan att införa transport. Se
[transport.test.ts](src/gameplay/transport.test.ts).


## RTS-085: handgjorda Öarna

MapDefinition har valfri goldPosition/instruction och enemy-scout-waypoints.
Öarna använder samma1280x960/32px/render/fog/minimap, men vattenrects runt
världens kant och mellan x704–896 skiljer två landmassor. Profilens gold
ligger600300 på västra ön, wood650180;800wood/400gold. CreateMatch och
Save validerar profilens positioner. Ursprungsprofilerna är oförändrade.
EnemyKnowledge använder profilens offentliga terrain-waypoints på östra
ön, utan dold kunskap om spelarbasen. Ingen ny AI byggs i denna task.
Save config14 migrerar13 för äldre kartor; föregående format kan inte
utge sig för att redan stödja Öarna. Landkartornas gamla balansmatris
är fortsatt oförändrad, medan [islands.test.ts](src/gameplay/islands.test.ts)
verifierar verkligt betald transport+armé+landcombat till victory.

## RTS-086: separat enemy naval-controller

[src/gameplay/enemyNaval.ts](src/gameplay/enemyNaval.ts) styr betalt hamnbygge,
FIFO, befintlig armés samling, vattenrutt och atomisk landsättning.
[src/config/enemyNaval.ts](src/config/enemyNaval.ts) samlar kapital/tider/
terrängvägpunkter. EnemyNavalState.passengers är ensam canonical plats för
lastad enemy-armé; Combat.enemies håller fysiska markenheter och transport.
Markschemaläggaren utesluter ship; naval-adaptern använder befintliga
vattenrutter. Population/statistik/ledger inkluderar last och reservationer.
[src/gameplay/enemyBody.ts](src/gameplay/enemyBody.ts) delar korrekt32px
ship-kropp mellan acquisition, skjutkontakt och combat, mot24px markenhet.
Scene presenterar tillfällig röd transport; slutlig sjöart ligger i089.
Save schema2/config15 migrerar14 utan gratis kapital/flotta; strikta
passagerar-ID:n, fas/producer/route/domain/refs valideras. Restart skapar
ny finite profil. Landkartors bank och AI förblir oförändrade.

## RTS-088: konfigurering av fast sjöuppdrag

scenarioConfig.mission-sea återanvänder enemy-base-objectivet på Öarna.
scenarioMapAllowed delar kartregeln mellan Match, menyinställningar och
Save; endast Skirmish har fritt kartval. Scenario-only menybyte väljer
uppdragets fasta karta atomiskt; ogiltig scenario-patch avslås före uppslag.
Save schema2/config16 migrerar15 och nekar förfalskat nytt uppdrag i äldre
format. Presentation visar uppdragets instruktion framför kartans generella
Skirmishtext. Tester fortsätter både verklig betald produktion och sparad
överfart/projektilflykt; kanoncombat och fog-regler är oförändrade.

## RTS-089: naval art genom befintlig presentationsmodell

Motion/frames/deathEffect stödjer warship/transport med naval-atlas och64px
ankare, oförändrad kropp32px. Scene håller egna fartygsbilder och hamnsprite,
använder befintlig fog-filterlista för enemy-sprites, städar vid death/hide/
restart och visar ring/HP/last utan geometry-placeholder. Enemy boarding
är inte death. Hamn blir egen BuildingKind i frame-registry, inte ny
byggnadslogik. Fartygens animationer kan aldrig orsaka gameplay-events.
AudioSnapshot inkluderar ownShipHP, hamncompletion och marine-shot-ID:n;
ny synlig avfyrning ger cannon, tidigare dold/reloaded shot är tyst.
Endast verklig synlig shipDeath skapar splash genom deathEffect. Befintlig
appägda AudioContext laddar8 original ljud; inga separata musikloopar.

## RTS-090: verifieringsverktyg för land/sjö

scripts/profile-browser.mjs väljer med W2T_NAVAL_PROFILE=1 Öarna före
Start och den separata createNavalLoadFixture i gameplay/testHelpers.
Explicit extra HP/fartyg över supply är endast benchmarkdata och importeras
inte i appbygget; samma riktiga renderer, fog, vattenkontakt och kanonskott
mäts. Counts separerar land/fartyg/enemies. Befintlig landfixture är
oförändrad. Release och prestanda dokumenteras i
[RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) och [PERFORMANCE.md](PERFORMANCE.md).

## RTS-093 – Separat startsidenavigering

`presentation/homeMenu.ts` har en liten DOM-sidmodell och appägda listeners, initierade en gång i main. BootScene synkar sessionfas till sidan men hanterar samma start/load/save/actioncallbacks som tidigare. Scenario-ID:n/Saveformat är oförändrade; navigation filtrerar bara befintliga scenarioalternativ. CSS-riktningen följer VISUAL_DIRECTION.md. Gameplay och match-HUD är inte ombyggda i093.

## RTS-094 – Beskrivna matchval

`presentation/matchSettings.ts` exporterar karta-/svårighetsbeskrivningar och härleder detaljer från samma MatchOptions som start/Save/restart. Formuläret återanvänder gameplay/matchSettings-validation; konstant1× innebär ingen ny gameplay/Save-data. Nya värden får inte införas bara som UI utan faktisk tidsmodell108.

## RTS-095 – Responsiv spelvy

Startsida och `#game-toolbar` har exklusiv visibility; befintliga session/audio/save DOM-element flyttas mellan containrar utan nya handlers. `main.ts` observerar faktisk `#game`-yta och anropar Scale.resize med heltal, bara vid ändring och positiv storlek. `presentation/viewport.ts` håller kamera i1:1 world pixels och centrerar en ändlig karta när canvas är större. Scenens Scale-resize uppdaterar viewport/bounds/scroll, rensar pågående drag och avregistreras på shutdown. Input använder camera.updateWorldPoint; canvasram utanför kartkameran tar inga nya orders. Sidopanelen behålls till097–101, nya kameragester till102–103.

## RTS-096 – En enkel engelsk textkälla

[src/text.ts](src/text.ts) är en beroendefri TypeScript-tabell för statisk UI-copy, guide, fraktions-/kart-/uppdragsnamn och återanvändbara feedbacksträngar. Config/presentation/gameplay-feedback importerar samma text utan i18nframework. `data-ui-text` ger statiska HTML-kontroller fallbacktext och gemensam bootstrapcopy; dynamiska tal/state formateras där de redan presenterades. Resultattal använder en-US.

Save-schema/configversion och alla machine-ID:n bevaras. `LoadResult.code` skiljer missing/storage/version/invalid från visningsprosa; scenen använder en explicit awaitingLoadedResume-flagga. Gammal sparad rallyError används bara som error-state; den engelska UI-texten visas oavsett historiskt språk. Ingen balans eller gameplaytid ändrad.

## RTS-097 – Kompakt topprad

presentation/topBar.ts härleder levererat saldo och matchPopulation utan Phaser eller enemy/node-data. BootScene uppdaterar DOM; appägd Menu-listener öppnar befintlig pauspanel. Toppraden är48px, sessionpanelen visas endast paused/ended; gamla dubbla saldo/supplyrader döljs. Saveformat och gameplay är oförändrade.

## RTS-098 – Selection-information

presentation/selectionInfo.ts är Phaserfri panelmodell för befintliga valbara egna land-/sjöenheter och base/barracks/harbor. Den läser live HP/order/cargo och fraktionsrecept; stats märks Baseline stats eftersom tillfälliga förmågor/uppgraderingar inte ingår. Grupp har summerad HP, inga enemy/node-data. BootScene klipper befintlig atlasframe till DOM-canvas med pixelated rendering.170px bottenrad, ResizeObserver återanvänds; Save/selectionregler är oförändrade.

## RTS-099 – Kontextuella actions

presentation/actionPanel.ts härleder synliga actions och blockeringsskäl från befintliga recept/bank/supply/bygg-/research-/abilitystate. bindActionPanel reparentar samma DOM-controls en gång; BootScenes callbacks och shutdown är kvar. renderActionPanel körs efter befintlig disabled-sync och hotkeyetiketter; irrelevanta knappar blockeras även för hotkeys. Base ger researchåtkomst till forge utan att ändra BuildingSelection/Saveformat. Previewstart kräver bank, placering är fortfarande betalningstransaktionen.

## RTS-100 – Gruppikoner och queue-modell

presentation/selectionCollection.ts härleder egna markerade ikoner och aktuell selected-building FIFO med progress/refund/state utan Phaser. DOM återbyggs bara vid ID-byte, medan HP/etiketter/progress/disabled uppdateras varje sync. BootScene har en gemensam atlas-portrait-adapter för selection/grupp/kö; köcancellation använder samma delegerade callback och gameplayfunktion som tidigare. Timer/refund/Saveformat ändras inte.

## RTS-101 – Camera-only minimapoverlay

DOM-minimappen är en grid-overlay i worldytans nedre vänstra hörn, separat från Phaser-canvas och bottom actions. bindMinimap får explicit playingpredicate och tar bort click/contextmenu-listeners på shutdown. BootScene skickar currentMatch inklusive navy till befintlig fogfiltrerad datamodell; tidigare manuell snapshot saknade navy. Worlddrag-release på top/bottom/minimap/HUD avbryter drag utan selection.

## RTS-102 – Kamerainput och realtids-pan

camera.ts ger Phaserfri riktning/normaliserad diagonal/clamped pan. cameraInput.ts äger DOM held arrows/pointer/focus/blur och tar scene-adaptrar för geometry/phase/scroll. Camera update körs före gameplay med realdelta, max100ms; keys prioriterar edge. HUD/fokus/paus och aktiv drag blockerar automatisk pan, blur rensar input/gestures; alla listeners avregistreras på shutdown. Mittendrag och worldcoordinate-input bevaras.

## RTS-103 – Focus-genvägar och appägd camera-preference

cameraFocus.ts är Phaserfri modell för selected-own boundingcenter/base/building och clamped scroll; keyboardguard återanvänds utan actionkeykonflikter. cameraSettings.ts validerar config-hastigheter och edgeboolean, appägda listeners initieras en gång. cameraInput läser aktuell preference varje frame; Scene.registerShortcut äger endast adapter och shutdown. Preferences lever inom appsessionen, separat från matchstate/Save och119-localstorage.

## RTS-104 – Pausdialog och fullscreen

presentation/pauseMenu.ts har appägd main/settings/quit-navigation, backdrop och fokusfälla. syncHomeMenu reparentar befintliga controls utan listenerdubbling; new-match ligger stabilt i confirmation och samma Scene-session/Savecallbacks används. Phase-dialogen är fixed och ändrar inte worldviewport. Settings återanvänder audio/camera/display. fullscreen.ts anropar native enter/exit, synkar från faktisk fullscreenElement och visar failures/unsupported utan fabricerat state.

## Orderfeedback (RTS-105)

`presentation/orders.ts` härleder typade move/attack/work/blocked-markörer från verkliga orders, med redan fogfiltrerade enemies för land och navy. `config/feedback.ts` innehåller färger/storlek; scenen ritar ring, crosshair eller X. `presentation/commandFeedback.ts` ger ändringsstyrd aria-status för placement, modes, route/rallyfel. Actionpanelens resursbrist skiljer wood/gold/båda och supplygräns utan gameplaymutation.

## Attackvarningar (RTS-106)

`presentation/attackWarnings.ts` härleder skadevarningar från egna HP-snapshots, inklusive borttagna objekt och transportpassagerare. Snapshot innehåller inga enemies. Global3s gameplay-cooldown,4s transientvisning och ringconfig i `config/feedback.ts`. Scene adapterar status/ring och warningcue genom appägd GameAudio; befintligt original-command-buffer återanvänds med0.65 playbackRate och effects/mute. State återställs vid create/load/restart och sparas inte. Paus/end ger ingen cue/visning.

## Fyra svårighetsprofiler (RTS-107)

`config/difficulty.ts` är källa för Beginner/Easy/Normal/Hard inklusive custommissionjusteringar; scenarios använder samma config. EnemyNaval har fyra launchgränser. Session/URL/presentation/Save väljer från profilerna och ingen tidsskalning införs här. Saveformat16 bibehålls: enumutökning utan strukturell förändring, befintliga profiler/balansvärden oförändrade.

## Gemensam spelhastighet (RTS-108)

`config/gameSpeed.ts` validerar 0.75 och 1. Options och matchmetadata bevarar speed; scenen multiplicerar delta exakt en gång via gameplayDelta före updateMatch. updateMatch tar redan gameplaysekunder, så fristående callers, bot och tester får inte skala en andra gång. Animationer och varningar följer gameplay; kameran använder ursprunglig UI-delta och WebAudio använder AudioContexttid. Saveconfig 17 kräver speed; 16 och äldre migreras till 1. Saveproduktion validerar headtimer mot faktisk enemyprofilduration, inklusive Beginners 12/13 sekunder.

## Tutorial (RTS-109)

Campaign erbjuder `tutorial` på Arena. `config/tutorial.ts` definierar mål och trösklar; `gameplay/tutorial.ts` observerar faktisk selection, move-order, levererat wood, färdig barracks, producerad soldier och dött träningsmål. Progression kör före/efter gameplay-steget utan Phaser eller walltime. Byte av worker under movement-steget byter referensposition. Ingen enemyproduktion eller wave finns i tutorialen. Efter produktion väljs en ledig, giltig och synlig spawnposition från befintlig spawnmodell. Målet är idle; soldatens befintliga autoDisabled väntar på manuellt kommando.

`presentation/tutorial.ts` visar aktuellt mål, leveransprogress och genomförda steg. Scenen använder hela currentMatch för HUD så räknarna följer samma state. Saveconfig 18 validerar tutorialmilestones, workerreferens och target/counter; 17 och äldre migreras utan tutorial. Alla gamla releasebot-scenarier behålls; tutorialen har separata betalda genomspelningar för två fraktioner och två speeds.

## RTS-111 – Terrängvariation och kust

World-atlas är nu 256×192 RGBA med23 frames: fyra lågkontrast-gräsvarianter,
två vattenvarianter, rock, åtta exponerade kanter, fyra konkava kusthörn och
fyra resource states. terrainFrame bevarar patchernas rock/water-identitet;
terrainImageFrame väljer vattenvariation separat. Coordinatehash väljer
statiska gräsdetaljer; kartan genereras inte proceduralt. Vatten har gemensam
grundton utan tilebreda mörka ränder. Kanten har jord/foam och samma djup vid
tileändar; diagonala landkontakter får ett hörn även mellan två vattengrannar.
Utanför världen fortsätter samma terräng, så världskanten ger ingen falsk kust.
Skogskronor, stam och gruvsprickor har originaldetaljer från samma palett.

Navigation, resursmängder, hitboxes, 40px nodefootprint, ankare32,40, fog och
Saveformat ändras inte. Små grässtrån är dekor, aldrig hinder. Native32px,
nearest/roundPixels och repo-lokal källa/export/licens gäller fortfarande.

## RTS-112 – Byggnadstyper och synlig skada

Buildingatlas1024×1280 innehåller80 originalframes: fem byggnadstyper,
båda fraktioner/lag och foundation/building/complete/damaged. Warhut har
vapenställ och sköld, Stronghold benprydda torn, Smithy skorsten/anvil/ugn,
Cattlepen foder/staket och Harbor bryggdetaljer/lådor. Motsvarande Crown-
detaljer använder samma ljus från övre vänster, skala och blå/röd heraldik.

buildingFrame väljer damaged vid0<HP≤50% av typens befintliga maxHP, endast
när byggnaden är färdig. Tröskeln är presentationsconfig i buildingArt.ts.
Trasiga takbjälkar, sprickor och spillror är statiska; ingen eld, repair,
skadeberäkning eller timer tillkommer. Own portraits använder samma frame.
Synlig enemybase/outpost följer också HP; befintligt entityVisible-filter
körs före frameval, så dold skada avslöjas inte. Construction och removed/
dead/fog-renderobjekt följer befintlig lifecycle. Save behåller endast HP,
inte bildstate; frame härleds på load/restart. Ankare/footprints är oförändrade.

## RTS-113 – Läsbara enhetstyper och animationer

Worker har verktyg, brätte, rem och satchel; soldier har armor/axelplåtar,
Crown-hjälmprydnad/sköld eller Clans-axe/bone. Archer får hood/quiver och
animerad bågsträng i attack. Catapult har tydligare tvärbalk/teamplåt och
hjulekrar som följer gångposer. Naval hull/lastdäck/kanon/heraldik skiljer
roller och fraktioner; kanon får rekyl och gångvak har tre synliga faser.
Spiked Clans-bog respektive Crown-bogdetaljer renderas före vapen/last.

1920land- och832navalframes, stabilaID:n, åtta riktningar, native32/64px,
ankare16,22/32,40, palett och befintlig8FPS/0.5sdeath-lifecycle kvarstår.
Stats, gameplay, hitboxes, fog, selection, Save och eventtiming ändras inte.
Enbart egna repo-lokala pixelkällor, inga importerade bilder. Unitsmanifestets
width korrigeras från4096 till faktiskPNG2048; height4096 är oförändrad.
Rasterregressioner kontrollerar typ/riktningsvariation och minst tre olika
walk/attack/death-frames; icke-stridande transport har inget attackbeteende.

## RTS-114 – Begränsad combat-feedback

Presentation/effects.ts väljer arrow/stone/cannonball från befintlig projectile;
marine har företräde framför splash. Arrow har riktad14px shaft/fjäder/spets,
stone4px och cannonball3px har kort8px trail och highlight. Draw använder
PhaserGraphics i presentation; inga gameplayfält eller damageevents ändras.
Visible landningar/misses ger befintliga impact/splash. PublicHealth-samples
från own warningSnapshot och entityVisible-enemies ger hit endast vid faktiskt
minskad positivHP i två konsekutiva synliga snapshots; spawn/reveal/heal/hide/
remove/load är inte hits. Samples seedas om på reset och paus är tyst.

FX-sprites är glesa original32/64px med fyra8FPS-faser,0.5s livstid och
max64. Nearby samma kind mergeas inom8px/0.15s. Synlig faktisk death ger
land-dust eller befintlig naval-sinking; boarding/fog hiding ger ingen death.
Ground-effects/dead sprites på depth−1 underunits0; projectile5, selection6,
HP7 och fog40. Alpha0.8 och glesa sprites bevarar läsbarheten. UI-atlas512×160
med21frames. Save lagrar fortfarande inte temporära effekter: load/restart
rensar dem, paus fryser bildtid och terminal match stoppar simulationen.

## RTS-115 – Kartstorlek och ytterligare resursnoder

MapDefinition kan ange world, enemyBase och extraResources; createMap använder
kartans dimensioner och behåller 1280×960 som fallback för äldre kartor.
mapResources/mapResourceTotals är gemensam fast konfiguration för stock och
Savevalidering. GatheringState.extraNodes används endast där kartan har
expansioner; resourceNodes samlar primary wood/gold och extra noder. Gathering,
serviceköer, placement/navy-routesskydd, enemyknowledge/economy, minimap och
scenens hit/renderadapter använder samma noder och stabila ID:n.

Frontier Valley är 1600×1152 (50×36 tiles). Playerstart återanvänds, enemybase
ligger på (1312,96),96×96. Två extra noder: wood-2 (1216,896),200 och
gold-2 (1184,640),150. Tre landpassager runt floden, varav central96px.
Scene behåller befintliga order/gathering-regler; extra resourcebilder/text
följer samma known/visible-policy utan att visa dold återstående mängd.

Save config19 migrerar18/äldre utan att lägga nya noder i gamla matcher.
Kartkonfiguration styr world/fog-storlek, nod-ID/typ/position/stock, bas och
resourceledger. Alla koordinater/footprints valideras mot vald karta.
Camera lagras inom världen och clampas vid load/resize till aktuell viewport,
i stället för gamla fasta 480/360-gränser. Temporär rendering sparas inte.

## RTS-116 – Kvalitetskontroll av befintliga kartor

Kartornas instruktioner är presentationsdata i MapDefinition, visade av samma
scenadapter som Frontier Valley/Islands. Ingen ny spelregel eller topologi.
mapQuality.test.ts verifierar resursapproach, två lediga64×64-startplatser,
40px-catapultväg på tre landkartor respektive avskilt land/sjörutt/harbor på
Islands, och oförändrat kart-/resursstate efter config18→19-migration för
båda fraktionerna. Befintliga ekonomiska maps/islands/navalBalance-tester
fortsätter täcka betald Victory, landstigning och verkligt AI-angrepp.

## RTS-117 – Aktivitetsljud och begränsad mix

presentation/audioSnapshot.ts skapar en ren publik snapshot: egna gather-workers
med last, egna constructiontider, produktionscounters och caller-filtrerade
fiender. audioEvents jämför två snapshots; lastökning ger gather, minskad
positiv byggtid ger build och faktisk spawn-counterökning ger train. Leverans,
orderbyte, ny byggplats, paus och initial/load-snapshot ger ingen sådan cue.
Navy-counterns initiala1 normaliseras till0 så att harborplacering inte låter
som färdig produktion. Boarding/landstigning ändrar inte produktionscounter.

config/audio.ts har per-cue gain/cooldown: work-cues0.4gain/0.8s, train0.65/0.4s.
GameAudio har separata käll-gainnoder under befintlig effects-kanal. Vanliga
ljud får högst fyra samtidiga sources; två ytterligare slots reserveras för
warning/resultat, totalt högst sex. Musik är separat. End/reset stoppar sources
omedelbart och kopplar bort både source och gain; paus suspenderar grafen.
Alla11 lokala ljud har OGG/WAV-fallback; saknade ljud påverkar inte simulationen.

## RTS-118 – Lokal unit-voice-lane

config/voices.ts innehåller36 egna engelska repliker för sex befintliga roller,
selection/order och2.5s global cooldown. voicePolicy väljer en stabil egen
speaker per grupp och jämför order/target före/efter manuellt input; blockerade,
oförändrade och ej valda units är tysta. Scenen anropar bara adaptern kring
pointer-down/up, grupprecall och Stop; simulationens automatiska orderbyten
utlöser inga repliker. UI utan unit-order, camera/placementcancel är tysta.

UnitVoices använder browserns SpeechSynthesis med endast localService och
engelsk lang. Ingen remote TTS, inspelad asset eller gameplaydependency.
En aktiv utterance, ingen queue; busy/cooldown/mute/paus/end är gated.
Variation roterar utan omedelbar upprepning; reset rensar historia/cooldown.
Role/faction påverkar pitch, rate1.05. Gain följer master/effects tills119
inför separat voices-volym. GameAudio äger lane/lifecycle; mute avbryter tal.
Capability visas i ljudstatus om lokal engelsk röst saknas. Browserstöd och
inspelade assets skiljs från verifierad text/policy/input-funktion.

## RTS-119 – Separata lokala användarinställningar

preferences.ts har validering och en injicerbar store; schema1 lagras endast i
warcraft-2-tribute.preferences.v1. Audio master/effects/music/voices/mute,
camera speed/edgePan och game faction/difficulty/speed har säkra per-field
defaults. Ogiltig JSON/schema/enum/typ/range eller blockerad storage ger
funktionell session; writes sker bara vid explicita användarändringar.
Getter returnerar kopior. Read/updates rör aldrig warcraft-2-tribute:save:v1.

main initialiserar preferences före appbinders/Phaser-instans. Pure camera-
validering flyttas till cameraPreferences.ts och återexporteras från befintlig
cameraSettings.ts; bindern och kamera-input återanvänder samma validering.
Audio-controls visar fyra oberoende volymer och mute. UnitVoices följer
master/voices, inte effects; ändrad voice/master gain avbryter aktiv replik
så att inget gammalt gain fortsätter tills dess slut. Music/effects grafgains
ändras direkt. Skrivfel syns i settings-status utan att blockera UI/gameplay.

BootScene läser game-defaults vid första konstruktion, sparar explicita
menyval och återställer prefererade defaults vid återgång till ny-match-menyn.
Load/restart behåller sparad matchfaction/difficulty/speed och ändrar inte
preferenser. Match-Save config19/schema2 är oförändrat; ingen matchstate,
kamera-position, selection/order eller OS-fullscreen sparas som preferens.

## RTS-121 – Inventering inför presentation122–126

Faktisk utgångspunkt är implementation genom119 plus teknisk release120.
[presentation/matchResults](src/presentation/matchResults.ts) renderar idag
utfall/statistik i pauspanelen över synlig spelvärld. [session](src/gameplay/session.ts)
har ended-gate;122 återanvänder den, restart och new-match och byter bara
presentation. Resultatdata hämtas från MatchState, inte DOM.

[matchStats](src/gameplay/matchStats.ts) härleder unit/resource-statistik;
byggnader och egen borttagning saknar separata totals. Resourceberäkningen
använder primärnoden och missar Frontier-expansioner:123 måste summera alla
resourceNodes och lägga till auktoritativa bygg-/förlustcounters där
härledning inte bevarar historik. Save config19/schema2 bevaras eller migreras
testat vid nya counters; inga gissade historiska byggtotals i gamla saves.

[homeMenu](src/presentation/homeMenu.ts) återanvänds för resultatnavigation,
changelog och startsida. package.json har0.0.0, ingen release/buildkälla eller
changelog finns ännu.124 inför en gemensam releasekälla separat från build-ID.

[main](src/main.ts) resize:ar canvas till DOM-yta; HUD/top/bottom är DOM och
kameran pan:ar world pixels.125 måste därför skala hela spelytan/HUD tillsammans
med aspect-bevarande; det räcker inte att bara byta canvas-storlek. Fullscreen
är redan separat och preferences-slot finns. Karta/tile/world påverkas inte.

Originalatlaser för terrain/units/buildings/UI/FX och11 WAV/OGG-cues finns,
med exportkällor i assets/scripts. Inspelade unit voices saknas; lokal engelsk
SpeechSynthesis är befintlig fallback/capability och ingen inspelning hävdas.
126 saknar en original startsideskomposition med fem folk. Spelbara factions
är fortsatt endast Crown/Clans; Elves/Dwarves/Goblins får presenteras som
motiv men inte erbjudas som spelbara. Audio använder befintlig musik/gains,
reduced-motion måste stödjas. Användaren har skjutit upp perceptuella ljudtester.

## RTS-122 – Separat resultatpresentation

[resultScreen](src/presentation/resultScreen.ts) äger endast DOM/resultatnavigation:
summary/statistics, fokus och Play Again/Main Menu via befintliga sessionknappar.
BootScene synkar efter homeMenu och döljer avslutad canvas/HUD; inga nya
gameplay-/Savefält. matchResults ger summary med utfall/tid/karta/difficulty/
faction samt separat statistics-del. Terminal load använder samma presentation.
Save/load är fortsatt tillgängliga på resultatsidan; pauspanel gäller endast paused.

## RTS-123 – Matchstatistik och historik

[statLedger](src/gameplay/statLedger.ts) kompletterar härledd unit/resource-
redovisning med färdigställda/förstörda byggnader och separata owner-removal
counters. Completion registreras före combat för land/enemy, efter naval
construction för harbor; destruction i den befintliga cleanDestroyed-
transaktionen, inklusive foundation och base exakt en gång. Starting bases
räknas inte som byggda. Ingen egen borttagningsaction införs före147.

matchStats summerar alla resourceNodes mot mapResourceTotals, inklusive
Frontier-expansioner. Cargo/passengers/lostCargo och refunds räknas fortsatt
som tidigare; owner removals subtraheras från combatförluster/opponentkills.
Save schema2/config20 migrerar config19 (och tidigare kedja) med ledger noll
och legacy-flagga: historiska bygg-/borttagningstal före migration är okända,
inte rekonstruerade. Befintliga resurs-/unit-data bevaras, slot oförändrat.
Resultatstatistiken visar uttrycklig historikbegränsning för migrerade saves.

## RTS-124 – Release och build-identitet

[release](src/config/release.ts) är gemensam produktversionskälla och innehåller
changelogposter. [releaseInfo](src/presentation/releaseInfo.ts) visar samma
version i home/top bar och changelog utan gameplay-/Savefält. HomePage
changelog använder befintlig Back/Escape-navigation. Vite injicerar separat
__BUILD_ID__: HEAD short hash vid build, unknown utan git och local i dev.
UI validerar build-label och skriver textContent. package.json:s privata
verktygsversion0.0.0 är inte produktversion eller matchconfig.

## RTS-125 – Logisk viewport och gemensam skalning

[displayPolicy](src/presentation/displayPolicy.ts) definierar sex presets,
validering och aspect-bevarande fit. [displaySettings](src/presentation/displaySettings.ts)
ger #app en logisk storlek och gemensam CSS-transform med centrerad letterbox;
canvas, HUD och DOM-kontroller skalas tillsammans. Ingen uppskalning i preset-
läge. Adapt-to-window är separat/default och har minimum800×600 för HUD,
vilket skalas ned i mindre fönster. Fullscreen är fortfarande separat native
user gesture. CSS-layoutens viewportmått kommer från logiska dimensioner.

main resize använder game-containerns clientWidth/clientHeight, inte skalad
bounding rect. Phaser bounds refreshas efter display/resize, kamerageometri
förblir world pixels/zoom1 och mapstorlek oförändrad. Phaser pointermapping
används för selection/commands; edge-pan/minimap använder gemensam clientPoint
för physical→logical. Dragtröskeln är fortsatt5 verkliga screen pixels.
Preferences schema1 får validerat display-fält med defaults för äldre prefs;
match-Save/schema/config20 ändras inte och load bevarar aktuell display.

## RTS-126 – Original startsida och menyambience

Original illustration/master och provenance finns i
[home-fantasy-126](assets/sources/home-fantasy-126.md); JPEG-runtime i public.
Fem folk visas som motiv, metadata i [homeArt](src/config/homeArt.ts), utan
nya spelbara faction-ID:n. #home-art visas endast i menu och ligger under
DOM-title/navigation; object-fit contain bevarar hela bilden. Tre små CSS-
embers följer reduced-motion, påverkar inte matchstate och döljs med artwork.

GameAudio återanvänder befintlig16s musikloop i menu med config menuMusicGain
0.35. Unlock kräver fortfarande gesture, mute/master/music är gemensamma
preferences och home-toggle synkar Settings-checkbox. Menu/playing använder
en musiksource; pause suspenderar, ended reset stoppar och returnmenu startar
lågvolymsloopen igen. Ingen ny ljudfil/voice eller gameplay/Saveändring.
Perceptuell ljudbedömning är fortsatt uppskjuten enligt användaren.

## RTS-127 – Flera fyndigheter

Befintliga `mapResources` och `resourceNodes` från RTS-115 är gemensam källa för alla fyndigheter. Gathering/delivery refererar fyndigheter via `nodeId`; egna ändliga lager och Save-validering återanvänds. `src/gameplay/multipleResources.test.ts` täcker oberoende lager, mål över upprepade turer, uttömning och aktiva expansionorders efter Save/load. Ingen ny runtime-abstraktion behövdes.

## RTS-128 – Resursselection

`src/gameplay/resourceSelection.ts` återanvänder unit/building-hit och väljer därefter kända fyndigheter; egna entities har prioritet vid överlappning. BootScene håller ett lokalt selectedResource-ID, rensat av annan selection/grupprecall och scenrestart. Resursklick ersätter även Shift-selection utan gameplay-order. `selectionInfo` visar live stock endast inom aktuell vision; utforskade dolda noder visar namn/typ och Outside current vision. Save-schema ändras inte; denna presentationselection återställs vid Load.

## RTS-129 – Delade arbetsplatser

Återanvänder `resourceServices`, konfigurerade tre platser/femsekunders rotation och befintlig separation. Platser filtreras efter nåbarhet; överfulla cohorts får distinkta köpunkter. En gemensam snapshot för spelarens och fiendens workers används av matchuppdateringen. Tester kompletterar samtidiga oberoende wood/gold-köer och isolerad worker utan låsta platser; inget nytt köstate eller Save-format.

## RTS-130 – Härledd resursbemanning

`src/gameplay/resourceStaffing.ts` läser levande egna gather/deliver-workers per nodeId. Aktiv gathering kräver stock, lastutrymme, nådd navigation/servicepunkt och fysisk interaktion. Samma serviceberäkning inkluderar enemy-workers för korrekt delad admission, men endast egna workers räknas. SelectionInfo visar counts endast inom vision. Ingen ny simulationstate/Save-property eller arbetsplatsrendering.
