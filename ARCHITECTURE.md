# Arkitektur

## Status och teknik

Implementerat genom RTS-066: archer/projectiles, catapult/splash och Forge/research, FIFO/refund, target-HP/destruktion, workerbygge, farms, population, kamera,
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
