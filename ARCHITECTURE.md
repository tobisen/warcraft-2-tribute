# Arkitektur

## Status och teknik

Implementerat genom RTS-036: FIFO/refund, target-HP/destruktion, workerbygge, farms, population, kamera,
byggnadsselection, rally, Stop, gold och
atomiska kostnader ovanpå etapp 1:s HUD, handgjorda karta och navigation för
move/work/combat, separata gruppmål och säkra placement/spawn-regler.
De ursprungliga MVP-avsnitten nedan är historik; RTS-018–036-avsnitten längst
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
AI samlar armégrupper ur ändlig budget utan ny full worker-ekonomi.

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
