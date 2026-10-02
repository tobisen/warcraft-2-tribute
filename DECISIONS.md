# Beslut

## Fastställda beslut

| Beslut | Innebörd och motiv |
| --- | --- |
| Browserbaserat singleplayer-RTS | Inspiration från Warcraft 2, AoE2 och C&C; scope hålls till en lokal spelupplevelse. |
| Phaser + strict TypeScript + Vite | Fastställd teknik för kommande implementation. |
| Local-first, gameplay före grafik | Funktion verifieras tidigt; placeholders är tillåtna. |
| Tunna scenes | Separera gameplay-logik från Phaser där praktiskt för tydliga ansvar och verifierbara regler. |
| Stats i enkla TypeScript-configobjekt | Håll datadefinitioner enkla utan extra konfigurationssystem. |
| MVP | En karta, drag selection, move commands, gathering, bas, produktionsbyggnad, stridsenhet, enkla fiendevågor och win/loss. |
| Utvecklingsordning | Movement → selection → resources → buildings → combat → AI, efter projektinitialisering. |
| Första task | RTS-001 – Initialize project structure; aktuell status följs i BACKLOG.md. |
| Save/load efter MVP | Persistens utökar inte MVP. Local-first innebär inte att save/load redan finns. |
| Avgränsningar | Ingen multiplayer, backend, konton, procedural generation, modding eller deployment. |
| Agentarbete | BACKLOG styr; en task åt gången; inga scope-utökningar eller spekulativ refaktorering. Relevanta tester och docs ingår i Definition of Done. |
| Rollfiler | Implementer bygger och testar, Reviewer granskar utan kodändringar, Finisher verifierar och uppdaterar docs. Filerna konfigurerar inte automatiskt agenter. |

## Movement-beslut – RTS-002, 2026-10-01

| Beslut | Motiv och konsekvenser |
| --- | --- |
| Positioner i world pixels | Input konverteras till world coordinates; gameplay-funktionen använder vanliga x/y-tal utan Phaser-beroende. |
| Framtida tiles: 32 × 32 px | Fastställd framtida tile-storlek; inget grid, snapping eller tilesystem införs i denna slice. |
| Delta-baserad movement | Hastighet anges i pixlar/sekund. Scenen omvandlar Phasers delta från millisekunder till sekunder. Ingen fixed timestep införs. |
| Rakt mot senaste målet | Nytt kommando ersätter målet. Steget begränsas till återstående avstånd för exakt stopp utan overshoot. Ingen pathfinding eller hinderhantering. |
| Vitest 4.1.11 för unit-tester | Enkel Node-baserad testning av fristående movement-logik, kompatibel med projektets Node 20 och Vite 8. Ingen Phaser-rendering behövs för unit-testerna. |

De tidigare öppna gridstorleks-, koordinat- och tidsfrågorna har avgjorts av
användaren inför denna slice. Se
[ARCHITECTURE.md](ARCHITECTURE.md) och [BACKLOG.md](BACKLOG.md).


## Placement-footprints – RTS-008, 2026-10-01

- Barracks har en axis-aligned rektangulär footprint på 2 × 2 tiles (64 × 64 px).
  Positionen är dess övre vänstra hörn, snappat nedåt med floor till 32 px-grid.
  Snapping gäller bara byggplacering; enhetspositioner förblir world pixels.
- Världen är i denna slice 800 × 600 world pixels, samma som canvasens config.
  Hela footprinten måste ligga inom gränserna; koordinater klampas inte till
  en giltig plats. De sista 24 pixlarna längst ned är inte en hel gridrad.
- Basens footprint är den befintliga synliga 48 × 48-rektangeln centrerad på
  (400, 450), alltså övre vänster (376, 426). Basen flyttas eller snappas inte.
- Resursnodens footprint är dess cirkels bounding box: 40 × 40 px centrerad på
  (650, 180), alltså övre vänster (630, 160). Även uttömd nod blockerar placering.
- Positiv areaöverlappning förbjuds; enbart kantkontakt är tillåten. Arbetare,
  ringar och texter är inte placeringshinder. Footprints används enbart för
  byggplacering och inför ingen movement-collision eller pathfinding.
- Högst en barracks och kostnad 40 wood kontrolleras vid själva placeringen.
  Placeringsläget kan öppnas utan tillräckligt saldo för att visa preview;
  otillräckligt saldo gör den ogiltig. Escape/högerklick avbryter gratis.

## Melee combat – RTS-010, 2026-10-01

- Manuell attack: högerklick på fiendens kropp ger attack-order bara till
  markerade soldiers. Workers behåller sin order. Move ersätter attack;
  resursklick och avmarkering gör det inte. Inget automatiskt soldier-aggro.
- HP är kontinuerliga tal och skada anges i HP/sekund för enkel delta-baserad
  melee utan projektiler, cooldownsystem eller animationer. Approach förbrukar
  restid innan skada; centrumavstånd används för räckvidd (32 px).
- Soldiers har 60 HP och gör 18 HP/s; enemies har 36 HP. Värden ligger i
  combatConfig. HP klampas till 0; döda fiender tas bort och angripare blir idle.
- Denna slices stillastående övningsfiende ersätts av waves i RTS-012.

## Enkel enemy AI – RTS-011, 2026-10-01

- Varje fiende väljer närmaste levande soldier inom 140 px från sitt centrum,
  annars spelarbasen. Lika avstånd avgörs av stabil enhetsordning. Targets
  omprövas varje steg. Workers och barracks är inte attackmål i MVP.
- En enemy går rakt med 65 px/s och gör 6 HP/s inom 32 px från targetcentrum.
  Basen har 240 HP. Soldiers angriper bara enligt manuell order.
- Skada från båda sidor beräknas från samma levande snapshot och appliceras
  tillsammans, så båda kan dö i samma steg. HP går aldrig under 0.
  Rak pursuit har ingen pathfinding/collision. Normala browser-deltan används;
  ingen fixed timestep införs och targetbyten under stora steg approximeras.

## Arena, vågor och ekonomi – RTS-012, 2026-10-01

- MVP:s enda karta är den befintliga öppna 800 × 600-arenan med fast bas och
  wood-nod. Ingen terräng, hinder eller kamera tillkommer.
- Tre ändliga vågor vid 60, 90 och 120 gameplay-sekunder innehåller 1, 2 och
  3 enemies. De spawnar vid (740, 60 + index × 40), helt inom världen.
  Vågindex och nästa enemy-ID sparas oberoende av levande enemies.
- Nodens initiala mängd ökas från 100 till 400 wood, startsaldo är fortfarande 0.
  Det räcker till barracks och 18 soldiers om inga extra workers produceras.
  Första vågens 60 sekunder ger startarbetarna tid att samla och producera försvar.
- Tider/counts/spawn finns i waves-config, HP/skada i combat-config. Ändliga
  vågor ersätter övningsfienden; inga oändliga spawns eller AI-ekonomi.

## Matchstopp – RTS-013, 2026-10-01

- Defeat när basens HP når 0. Game over är ett gameplay-state och stoppar
  gathering, movement, produktion, combat och wave-tid tillsammans.
- Efter game over avvisas canvas-, bygg-, produktions- och Escape-input både
  i handlers och genom spärrade knappar. Selection/orders fryses; aktuell
  draggest och placeringspreview städas. Rendering fortsätter visa slutläget.
- Matchuppdateringen delar delta vid vågtider, så enemies inte simuleras före
  sin spawn. Detta är händelsegränser, inte en fixed timestep.

## Victory och företräde – RTS-014, 2026-10-01

- Victory kräver att sista konfigurerade vågen har spawnat och att alla enemies
  är döda. En tom enemy-lista mellan vågor ger aldrig victory.
- Defeat kontrolleras först. Om basen når HP 0 samtidigt som sista enemy dör
  blir resultatet defeat. Båda outcomes fryser samma simulation och input.

## Restart – RTS-015, 2026-10-01

- ”Starta om” visas bara efter game over. Den startar om Phaser-scenen och
  createMatch skapar helt nya arrays, positioner, states och timers.
- Bas 240 HP, nod 400 wood, saldo 0, tre omarkerade idle-workers, ingen barracks,
  inga enemies, vågtid/index 0 och initiala ID-räknare återställs varje match.
- Scene shutdown tar bort DOM-, pointer- och keyboard-lyssnare; create bygger
  ny presentation och rensar Map-referenser/drag/preview. Dubbel restart spärras
  medan scenbytet väntar. Ingen reload, persistens eller matchhistorik införs.

- Canvasens DOM-bounds synkas efter UI-presentation, eftersom kontrollernas
  höjd kan ändras vid game over/restart. Inputkoordinater följer verklig canvas
  även när sidan scrollar eller kontrollraden radbryts.

## Tribute-roadmap – beslutad riktning, planerad implementation (2026-10-01)

Användaren har beställt RTS-016–060 efter avslutad MVP. Detta ändrar framtida
scope men inte färdiga tasks eller dagens gameplay. [BACKLOG.md](BACKLOG.md)
är genomförandeordning; ingen task har startats i planeringskörningen.

| Beslutad riktning | Konsekvens i planen, ännu inte implementerad |
| --- | --- |
| Liten komplett singleplayer-tribute | Basbygge, guld/trä, worker/soldier/archer/catapult, fiendebas/skirmish, minimap/fog, egna pixelassets, tre korta uppdrag och lokal save/load. |
| Stabilisering före utökning | RTS-016 speltestar MVP och RTS-017 balanserar befintlig config före HUD/karta/navigation. |
| Handgjorda tiles, world pixels och delta | 32 × 32 px behålls; ingen ogrundad ändring till fixed timestep. Algoritm/grannar/clearance väljs innan navigation implementeras. |
| Nåbara positioner utanför footprints | Planerad gathering/leverans/melee-räckvidd mäts till målfootprintens kant. Dagens centrumavstånd ändras först i RTS-021/022. |
| Otillgängliga move-mål avvisas | RTS-020 ger tydligt fel/säkert stopp; ingen implicit teleportering/närmaste-fallback. Routes valideras vid orderbyte och hinderrevision. |
| Separata gruppmål före collision | RTS-023 fördelar nåbara slutpositioner. Full dynamisk unit-collision följer inte automatiskt. |
| Säker placering och spawn | RTS-024 hanterar enhetskroppar/footprints och bevarade nödvändiga vägar; blockerad produktionsutgång väntar utan ny debitering eller duplicate-spawn. |
| Alla mål/system har lifecycle | RTS-034 rensar selection, orders, byggande/produktion och hinder vid död. Varje task utökar restart/game-over-regressioner för sitt state. |
| Wave-survival bevaras | RTS-045 inför skirmish som separat scenario, inte ersättning av MVP. Defeat har fortsatt företräde vid simultan utgång. |
| Budgetstyrd enemy AI | RTS-042 använder ändlig resursbudget, inte full worker-ekonomi. RTS-043 samlar armégrupper; RTS-044 replacement betalas ur samma budget. |
| Fog utan informationsläckor | Spelarens fog aktiveras först med RTS-049:s gemensamma filtering för rendering/targeting/HUD/minimap/AI-information. Ljud måste också följa visibility. |
| Placeholders tills etapp 6 | Asset-tasks definierar PNG RGBA/native 32 px tiles, sprites/ankare/animationer; exportformat ändrar inte gameplay-footprints. |
| Balans är preliminär | Configvärden ändras efter dokumenterade speltester; verifierade MVP-siffror är ingen slutbalans för tribute-målet. |
| Lokal releaseverifiering | RTS-060 verifierar lokal production-build, prestanda och scenarier. Ingen deployment, backend eller nya dependencies ingår i planeringen. |

## Öppna beslut och när de ska tas

Dessa är inte redan fastställda. Ta dem i angiven task innan berörd kod och
uppdatera detta register. Om beslutet utökar beställt scope: stanna och förankra
en ny plan. Tekniska alternativ får jämföras inom samma task/subtasks.

| ID | Öppet beslut | Grind/task |
| --- | --- | --- |
| O-01 | Initial verifieringsmiljö vald i RTS-016: macOS 15.7.4, Chromium 147 headless, desktop 1280 × 720 samt resize/scroll vid 520 × 420 och 900 × 500. Blockerande fel innebär brutet normalt matchflöde, ekonomi, input, outcome eller reset. Överlapp och fast canvas är avsiktliga MVP-begränsningar. Slutliga browserstöd och enhets-/frame-/minnesbudgetar är fortfarande öppna. | RTS-060 slutprofil/budget. |
| O-02 | Preliminära ekonomi/DPS/tider och mätbara balansmål; senare gold/wood-kostnader, supply och difficulty-budgetar. | RTS-017, RTS-030, RTS-032, RTS-040, RTS-046 före respektive balansimplementation. |
| O-03 | RTS-019 fastställer handgjord layout, klippt 24 px-nederkant, positiv footprint-rasterisering och immutable hinderrevision. RTS-025 fastställer 1280 × 960 px world, 800 × 600 viewport, zoom 1 och mittenmusdrag. | RTS-025. |
| O-04 | Fastställt i RTS-020–022: bounded BFS fyra grannar, svept 24-px-kropp, safe direct segment, revisions-/fas-/target-triggers och 0,25 s pursuit-cooldown. RTS-038 tillför faktisk 40 px clearance för catapult; senare kartstorlek kan kräva ny uppmätt sökbudget. | RTS-025/060 vid behov. |
| O-05 | RTS-026 fastställer exklusiv unit/building-selection och unit-klickprioritet; RTS-029 fastställer en lasttyp och leverans av tidigare last före nodbyte. | RTS-026, RTS-029. |
| O-06 | RTS-031: en barracks, 5 s arbete, paus utan byggrefund. RTS-032: högst tre farms, cap 8 +5/farm, unit/job 1 och reservation vid start. RTS-033 fastställer tre FIFO-jobb, 50 % aktiv refund och 100 % köad refund. | RTS-031, RTS-032, RTS-033. |
| O-07 | Supply över cap fastställs i RTS-032. RTS-034 fastställer förlust av cargo, ingen refund vid byggnads-/jobbdöd och cleanup före produktion. RTS-039: aktiv research avbryts utan refund, färdiga nivåer består efter Forge-död. | RTS-034, RTS-039; grundregler måste vara klara innan systems kod. |
| O-08 | Fastställt RTS-035–039: explicit attack prioriteras, Stop håller; ranged LOS och fasta projectile-aimpoints/lifetime; catapult flat splash utan friendly fire, supply 2; en nivå attack ×1,25/defense ×0,75. Fog-aktivering återstår i O-10. | RTS-035, RTS-037, RTS-038, RTS-039. |
| O-09 | Enemy-budget/roster, group-size/timeout, försvar/reserv och difficulty-profiler. Full AI-worker-ekonomi ligger utanför plan. | RTS-042–046. |
| O-10 | Fog-grid/radier/LOS, minne av enemy-buildings, targettap och synlighetsregler för projektilevents; offentlig wave-info kontra dold enemy-info. Inga läckor tillåtna oavsett val. | RTS-048 modell, RTS-049 aktiveringsgrind. |
| O-11 | Tangentmappning/språk, modifierad selection, pause-input och startmeny/sceneövergångar. | RTS-050–052. |
| O-12 | Art/palett/teammarkering och exakta playback-FPS; audio-export/fallback för valda browsers och uppdrag 3:s objective/längd. Format/dimensionsminima finns i asset-tasks. | RTS-053–058 före respektive produktion. |
| O-13 | Save-slots/manual/autosave/export-UX, lokal lagringsmekanism/kvothantering, schema-version/config-kompatibilitet och supported migrations. Ingen molnlagring. | RTS-059. |

Primary Chat i backloggen är en planerad tasketikett, inte ett faktiskt chatt-ID
eller en konfigurerad agent. Ingen ID-konflikt upptäcktes: repot hade enbart
RTS-001–015 före kompletteringen.

## Survival-balans – RTS-017, 2026-10-02

Behåll nuvarande kandidat efter två naturliga aktiva Chromium-speltester.
Jämförda strategier var tidig barracks och extra worker före barracks. Båda
hinner skapa första soldier före 60 s; passivt försvarslöst spel förlorar.
Alternativet senare första wave behövdes inte och ändrades inte. Wood-budget
160 för barracks + fem soldiers + worker ryms i nodens ändliga 400. Framtida
Gold/supply har preliminära priser i RTS-030/032; senare army/difficulty-balans i O-02 är fortfarande öppen.

## HUD – RTS-018, 2026-10-02

Använd separat DOM-statusyta med vanliga knappar och configbaserade spärrskäl.
Behåll fast 800 × 600 world-canvas och scroll i smala fönster; ingen kamera
eller worldskalning införs. Soldier-kontrollen är synlig men spärrad före
barracks så skälet kan avläsas. Reserverad status/restart-yta begränsar layoutflytt.

## Kartdata – RTS-019, 2026-10-02

Världen förblir 800 × 600. 25 kolumner och 19 rader à 32 px; sista raden
klipps till 24 px och dess center är y=588. Höger/nederkant är exklusiva
för point→tile, kroppen får tangera världens gräns. Ogiltiga koordinater
avvisas utan clamping. Positiv footprintöverlapp rasteriseras som blockerad
tile; exakta kroppskontroller använder geometri. Kartrevision börjar på 0
och immutable obstacle replacement ökar revisionen. Fasta starts/base/node/
enemy-entry finns i arenaConfig; sten/vatten i vänster arena skär inte de
nuvarande ekonomi-/försvarsrutterna. Pathfinder/grannar väljs i RTS-020.

## Move-navigation – RTS-020, 2026-10-02

Deterministisk synkron BFS med fyra grannar (upp/höger/ned/vänster), högst
4096 besök. Kroppen är 24 × 24; sweep mot utvidgade hinder validerar varje
segment. Exakta start/mål ansluts via högst nio närliggande tile-centers,
endast med kroppssäkra segment. Dessa korta connectors kan vara diagonala;
grafens kanter är ortogonala och ingen corner-cutting/smoothing införs.
Move avvisar ogiltigt mål med enumskäl, stoppar gammal order och bevarar last.
Route har commandNumber, destination, waypoints och revision separat från
order-intention. Sökningen är synkron: inga sena resultat kan återställa gammal
rutt. Global hinderrevision omplanerar från aktuell position, också efter
blockering; oförändrad revision försöker inte igen varje frame.

## Arbetsnavigation – RTS-021, 2026-10-02

Bas/nod blockerar kroppen. Gathering/delivery-range mäts till footprintens
kant (fortfarande 24 px), inte centrum. Arbetsposition väljs bland fyra
kroppssäkra kantpunkter och närliggande tile-centers: kortaste nåbara BFS-rutt,
stabil tie-ordning. Ingen slotreservation. Positionen måste nås och en fri
interaktionslinje till kanten krävs; ingen remote extraction/deposit.
Work-route cachas efter orderfas, node-ID/position och hinderrevision; blockerad
loop behåller cargo/order och söker först vid ny order/fas/revision.

## Pursuit och melee – RTS-022, 2026-10-02

Attackrange mäts till targetfootprintens kant (32 px). Gemensamma approaches
kräver kroppssäker position och fri interaktionslinje till kanten. Target-ID
byts/rensas vid order/death. Targetposition ändrad eller förlorad range
utlöser omplanering högst var 0,25 s; hinderrevision omplanerar direkt.
Oförändrat avskuret mål försöker inte varje frame. Enemy väljer närmaste live
soldier inom 140 px från gemensam start-snapshot, annars bas; skada appliceras
samtidigt efter båda sidors uppdatering. Enemy-approach använder vald soldiers
uppdaterade position för att stanna utanför målet. Full unit-collision saknas.

Regressionsfynd: tile-connector backtracking kunde ge pursuit-pendling när
positionen ändrades mellan omplaneringar. Pathfinder använder nu direkt exact-
point-segment när hela sweepen är fri; annars BFS. Ingen efterhands-smoothing
eller diagonal hörnskärning. Varje passerat segment valideras även mot det
aktuella targetfootprintet. Endast nådd giltig range får skada.

## Gruppmål – RTS-023, 2026-10-02

81 kandidater runt giltigt klickmål, 32 px spacing och högst 4 offsets per
axel. Stabil numerisk ID-ordning, närmaste kandidat först med row/column ties.
Varje kandidat testas mot kropp/map och individuell nåbarhet; tilldelade
positioner används en gång. Blockerat centralt klick avvisas som i RTS-020.
Platsbrist ger explicit no-space och stopp, ingen duplicerad mål-fallback;
ytt gruppkommando behövs för ny tilldelning. Revision omplanerar redan
tilldelad destination, men ger inte no-space units central fallback.
Gather/attack är inte formationer och transitöverlapp är fortsatt tillåten.

## Säker placering och spawn – RTS-024, 2026-10-02

Preview/klick validerar aktuellt saldo, terräng, alla levande kroppar och
footprints. Hypotetisk barracks måste bevara varje workers tidigare nåbara
bas/aktiva nod, basens och nya barracks spawn-utgång samt alla konfigurerade
wave-entrys tidigare nåbara basväg. Redan avskurna områden måste inte repareras.
Kostnad, footprint och map.revision uppdateras tillsammans; invalid/cancel
ändrar inget. En barracks kvarstår som gräns.

Spawn använder fyra sidopositioner plus begränsade perimeter-tile-centers,
kroppssäkra i världen och fria från units/enemies. Basens gamla spawn-offset
prövas först. Statisk utgång till annan gångbar position krävs. Färdigt jobb
med blockerad spawn hålls på timer 0, ingen ny kostnad/ID/spawn; maprevision
eller ändrad enhetslista/position gör nytt försök. Game over fryser även väntan,
restart rensar väntesignatur och hinder. Ingen generell unit-collision.

## RTS-025 – World och kamera

World är 1280 × 960 px (40 × 30 tiles); viewport är 800 × 600 och zoom 1.
Mittenmusdrag panorerar relativt gestens start och begränsas till scroll
(0–480, 0–360). Vänsterdrag får företräde; pan ändrar inte selection/orders.
Pan fungerar under placement men placerar aldrig en byggnad. Game over
stoppar pan och restart återställer scroll och gest. Bas, nod, starters och
wave-entry behålls; två handgjorda patcher utökar terrängen. BFS-budgeten 4096
är större än kartans 1200 tiles; ingen ny sökmodell behövs för denna etapp.

## RTS-026 – Exklusivt spelarval

Units har klickprioritet framför barracks och bas. Byggnadsselection ägs
av presentationens inputstate, separat från simulationens produktionsjobb.
Footprintkanter inkluderas. Drag väljer endast units; tomt klick rensar allt.
Produktion får startas endast från vald egen byggnad under aktiv match; både
DOM-synlighet och click-handler upprätthåller detta. Panelens slots behålls
så canvas inte flyttas vid val. Inga enemy-byggnader/fog finns ännu.

## RTS-027 – Rally utan arbetsorder

Rally är ett world-pixel-mål per ProductionState, utan implicit gather/attack.
Validering söker från statiska säkra spawn-kandidater och ignorerar tillfälliga
unit-kroppar. Avvisat mål ersätter inte föregående giltigt rally. Spawnens
aktuella occupancy kontrolleras fortsatt separat; rallyroute planeras från
faktisk spawnposition och kan avvisas om hinder senare har ändrats. Inga
formationsmål tilldelas rally-units; överlapp vid gemensamt mål tillåts.

## RTS-028 – Stop utan resursförlust

Stop rensar navigation helt, inklusive blockerade routes som annars kan
återplanera på hinderrevision. Unit blir idle med target vid aktuell position;
cargo, selection och HP bevaras. Feedback är härledd från befintliga orders
och visas endast för valda units, utan separat historik eller effekt-timers.
Stop styr inte produktionsjobb; cancel/refund tillhör RTS-033.

## RTS-029 – Typad last och gruva

Gruvan vid (850,220) innehåller 300 gold. Rate/radius/capacity/ranges följer
wood: 1/s, 20 px nodradie, 5 last, 24 px arbetsrange. Båda saldon börjar 0.
Arbetarens last har en enda resurstyp. Ny gather-order till annan typ levererar
all gammal last först, även partiallast, och fortsätter sedan till ny nod.
Move/Stop behåller last och typ; depletion levererar resten. Inga goldkostnader
införs före RTS-030. Legacy wood-only fixtures kan utelämna type/gold och
använder då wood som default; nya matchstate anger typer och saldo explicit.

## RTS-030 – Atomiska kostnader

Preliminärt worker 20 wood/0 gold, barracks 40 wood/0 gold och soldier
20 wood/5 gold. Båda resurser kontrolleras innan något dras; produktion debiterar
vid godkänd start, byggnad vid giltig placering. Preview/cancel är gratis.
Priser är gemensamma TypeScript-configobjekt; legacy numeriska woodfält pekar
på samma config för äldre beteendetester. Survivalbudget: 400 wood och 300 gold
räcker till barracks, workers och defenders; faktiskt timingflöde speltestas.

## RTS-031 – Reserverat bygge och paus

Barracks tar 5 s effektivt arbete inom 24 px från utsidan. Minst en vald worker
krävs; lägsta ID väljs deterministiskt och last behålls. Kostnad/footprint
reserveras vid giltig placering. En builder åt gången; ny tilldelning avslutar
tidigare builders build-order. Stop/move/gather pausar återstående tid utan
rivning/refund. Högerklick på ofärdig barracks med vald worker återupptar.
Färdig worker blir idle; spelaren ger nästa order. Ingen progress utan nåbar
arbetsposition och aktiv builder. Produktion kräver färdig byggnad.

## RTS-032 – Farms och supply

Bas-cap 8, varje worker/soldier använder 1. Farm kostar 20 wood, är 64 × 64,
tar 5 s builder-arbete och ger +5 endast efter completion. Högst tre farms
med monotona farm-ID:n per match; samma approach/pausmodell som barracks.
Used och reserved härleds från levande units och godkända pågående/klart
väntande jobb. En start kräver used+reserved+1 ≤ cap innan kostnad dras.
Om en farm senare försvinner minskar cap, men inga units tas bort och redan
reserverade jobb får slutföras. Nya starter blockeras vid over-cap. Förstörelse
implementeras först i RTS-034. Restart nollställer farms/ID:n/jobs och cap=8.

## RTS-033 – Produktionskö och refund

FIFO-kö med högst tre jobb inklusive aktivt per byggnad. Varje godkänt jobb
debiteras direkt och reserverar 1 population; kostnad lagras i jobbet.
Monotona byggnadsvisa job-ID:n förhindrar sammanblandning/refund efter borttagning.
Köat jobb återbetalar 100 %, aktivt/head-jobb 50 %, även efter färdig tid om
spawn är blockerad. Cancel head börjar nästa jobb med dess fulla tid utan
retroaktiv progress. Blockerad spawn håller head och alla reservationer.
Rally används från byggnadens aktuella inställning vid spawn. Game over
stoppar kö och avvisar enqueue/cancel; restart rensar kö och job-ID-räknare.

## RTS-034 – HP och döds-policy

Workers 30 HP, barracks 120, farm 80; projekt startar med samma fulla HP och
completion läker inte. Units/bas/byggnader anger player och enemies enemy.
Enemy väljer närmaste levande spelar-target i 140 px aggro; tie-break soldier,
worker, byggnad och stabilt ID, annars bas. Melee använder fortsatt nåbar
kant-position och samtidig skada. Worker-cargo förloras, bokförd per typ som
lostCargo. Byggnads-/projektdöd refundar inte byggkostnad eller köjobb; jobb,
reservations och rally rensas. Builder-död pausar projekt med tom builder.
Förstörelse rensar målrefs/render/selection och frigör footprint med en
hinderrevision per cleanup. Combat/cleanup sker före produktion; redan döda
objekt rensas även före simulation. Base HP 0 ger defeat med företräde.

## RTS-035 – Automatisk attack

Idle soldiers söker levande, synliga, nåbara enemies inom 140 px. Närmaste
centrum väljs, med numeriskt enemy-ID vid lika distans; ett giltigt aktuellt
mål behålls. Efter kill kan nästa enemy väljas utan klick. Automatisk jakt
är begränsad till 140 px från utgångspunkten; utan giltigt mål återgår enheten
via navigation. Manuell attack har prioritet och följs tills målet dör.
Vanlig Move avbryter striden och tillåter automatisk försvar efter arrival.
Stop avbryter och håller utan auto tills nytt Move/attack; avmarkering påverkar
inte striden. Ingen acquisition vid delta 0. Fog är ännu inte aktiverad.

## RTS-036 – Attack-move

Välj soldiers, tryck Attack-move och vänsterklicka destination. Enheter får
separata gruppmål, söker samma giltiga enemies som automatisk attack och
återupptar sina ursprungliga mål efter strid. Workers behåller arbete.
Stop, vanlig Move och manuell attack ersätter hela ordern. Escape/högerklick
avbryter väntande destination utan att ändra selection/orders. Blockerad
destination avslutar ordern med befintligt route-fel; game over spärrar input
och restart rensar både gameplay-state och kommandoläge.

## RTS-037 – Archer-policy före implementation

Archer är en combat-unit-variant med 24 px kropp, 40 HP, speed 140, range
160 från target-footprint, aggro 200, 12 damage/1 s, supply 1. Kostnad
20 wood/10 gold, träning 6 s. Projektiler går mot fast aim point vid avfyrning
med speed 300, lifetime 2 s och hit-radius 16. Ingen homing: rörligt mål kan
missas. LOS krävs vid skott och längs projektilsegment; hinder stoppar skott.
Dött/osynligt mål tar bort projektilen utan damage. Ett impact förbrukar
projektilen exakt en gång. Fog använder samma visibility-predicate som
acquisition. Värden är första speltestsvärden, inte slutlig balans.

## RTS-038 – Catapult-policy före implementation

40 px kropp, speed 80, HP 80, supply 2; kostnad 40 wood/20 gold och
träning 10 s. Range 224, aggro 260, skott var 2 s. Fast aim point, speed
180/lifetime 3 s återanvänder projectile-lifecycle. Impact ger 24 damage
inom 48 px inklusive kanten, utan falloff, endast fiendemål. Avstånd till
byggnads-footprint används; byggnader får samma damage som units. Ingen
friendly fire. Ett dött initialmål avbryter inte siege-projektilen: fast
impact kan fortfarande skada andra mål. Hinder/LOS stoppar skott. Alla
navigations- och spawnkontroller använder faktisk 40 px clearance; ingen
collision avoidance införs. En verklig fiendebas kommer först i RTS-041;
byggnadsskada verifieras här med footprint-target-fixtures.

## RTS-039 – Forge och research-policy före implementation

Forge: max en, 64 px footprint, workerbygge 5 s/range 24, HP 120,
40 wood/10 gold. Attack och defense har max en nivå vardera, 40 wood/10 gold
och 8 s per research, ett jobb åt gången utan kö/cancel. Attack multiplicerar
combat-unit damage med 1,25; defense multiplicerar mottagen unit damage med
0,75. Workers och byggnader får ingen bonus. Gäller gamla/nya combat-units
dynamiskt; redan avfyrad projektil behåller damage vid skott. Ingen HP-heal
eller HP-max-ändring. Forge-död avbryter aktiv research utan refund men
färdiga bonusar består; rebuild tillåts och dubblerar aldrig nivåer. Restart
rensar allt. Research-knappar är globala och ändrar inte selection/orders.

## RTS-040 – Speltestade arméroller

Preliminära configvärden behålls efter tre upprepningsbara fixtures
(0,05 s steg, öppen karta): soldier vinner 36-HP melee-duel på 2,65 s med
47,4 HP kvar. Mot 72 HP tar ensam soldier 4,65 s; soldier + archer bakom
tar 3,30 s, soldier 43,5 HP och archer oskadad 40 HP. Catapult förstör två
48-HP stationära footprint-targets inom splash på 3,15 s, själv 80 HP; mål
utanför splash behåller 48 HP. Dessa mätningar visar tank/support/area-roller
och är inte universell slutbalans.

Naturlig full wave-match: två wood-workers och en gold-worker som bygger
barracks och återupptar gold. Soldier först, sedan archer och catapult,
manuella attackorders till blandad armé. Victory 126,79 s, bas 240 HP, tre
producerade typer och två överlevande combat-units. Spenderat 120 wood/35 gold
inklusive barracks, inget lostCargo; balans/resursbevarande och restart
verifierade. Separat låg-bas-HP-fixture verifierar defeat, input/simulation-
freeze och reset med samtliga army-typer. Ingen config ändrades utan mätbehov.

## RTS-041 – Fiendebas och tillfälligt belägringsscenario

Survival är fortsatt default utan fiendebas. ?scenario=siege-test skapar
en fysisk enemy-base (96 px footprint vid 960,96, HP 240) för belägring med
befintlig ekonomi/armé. Ingen produktion eller ny victory-policy införs;
waves och defeat-prioritet behålls och stationär fiendebas påverkar inte
wave-survival-villkoret. Basens ägare är enemy; endast attack är tillåten,
aldrig spelarproduktion/rally. Skirmish och dess riktiga val/outcome kommer
i RTS-045. Footprint/range/LOS och death-revision återanvänder RTS-038.

## RTS-042 – Ändlig enemy-budget

Siege-test startar med 80 wood/20 gold, cap 6 och endast soldier-liknande
enemies (20 wood/5 gold, 5 s, supply 1, gemensam FIFO max 3). Högst fyra
produceras ur budgeten, ingen refill/worker-ekonomi. Shared queue debiterar
varje jobb/reserverar supply, adapter skapar enemy-owned IDs i egen namnrymd.
Waves förblir separata och debiteras inte ur basbudgeten; survival har ingen
enemy-production. Spawn väntar säkert på kropp/utgång och upptagna units från
båda sidor. Basdöd tar bort jobb/reservations utan refund. Restart återställer
budget/ID/timers. Producerade enemies är idle i denna slice; samling/anfall kommer i RTS-043.

## RTS-043 – Samling och anfall

Endast enemy-produced-N ingår i AI-grupper; wave-enemies behåller sin policy.
Två medlemmar samlas nära 896,320 med separata säkra destinationspunkter.
Full grupp med ankomna medlemmar är ready; 15 s timeout gör överlevande
underbemannad/blockerad grupp ready utan nya units. Första dispatch tidigast
60 gameplay-s för att ge ekonomin starttid, därefter minst 15 s mellan grupper.
Ready-grupp skickas en gång med attack-move mot player-bas via befintlig
navigation/lokalt enemy-targetval. Döda medlemmar/destinationsreferenser rensas;
tomma grupper tas bort, ID-räknare återanvänds inte. Budgeten är fortfarande
ändlig och varje unit tillhör högst en grupp. Ingen formation/collision AI.

## RTS-044 – Lokalt försvar och återgång

En producerad unit hålls som permanent reserve nära enemy-base. Hot är
levande synliga player-combat-units inom 256 px från basens footprint;
workers räknas inte som hot. Högst två nåbara defenders: reserve först, sedan
befintliga defenders/närmaste tillgängliga units med stabilt ID. Befintligt
giltigt target behålls. Borrowed unit tas ur anfallsgruppen, återgår till
ursprunglig grupp när möjligt, annars till ny samling. Reserve återgår till
säkert home utanför basen. Dispatch pausas under hot; redan skickade grupper
fortsätter förutom borrowed defenders. Replacement använder samma ändliga
budget och supply/timer – efter budgetslut finns ingen replacement. Player-
visibility-predicate förbereder fog; inga hidden targets används när den
är inkopplad. Basdöd släpper reserve till befintlig grupp-AI och stoppar
produktion. Restart rensar försvar/target/home-referenser.

## RTS-045 – Valbart scenario och outcome

Survival är default: ändliga waves, victory först när sista wave spawnat och
alla wave-enemies dött. Skirmish har enemy-bas/ändlig budget/AI men inga waves;
victory när enemy-basen förstörs även om enemy-armé överlever. Player-bas 0
ger defeat med företräde vid simultan basdöd. Båda startar samma initiala
player-ekonomi, karta och army-system. Scenario-dropdown startar en ny match
direkt; restart behåller valt scenario och återskapar allt state. URL-val är
validerat och används bara för initial mode; siege-test behålls för tidigare
regressioner. Full startmeny kommer RTS-052.

## RTS-046 – Avgränsade profiler

Endast enemy-budget/cap/produktionstid, gruppstorlek/first/gap och Survival-
schedule varierar enligt [difficulty.ts](src/config/difficulty.ts). Normal
är exakt tidigare configs; player-start, priser och alla combat-stats hålls
lika. Easy/Hard är preliminära tryckprofiler, inte hidden cheats. Varje
producerad enemy betalas ur synligt konfigurerad ändlig budget. Initialt
URL-val valideras; UI-byte startar ny match och restart behåller båda ID:n.

## RTS-047 – Minimap som separat kamera-UI

Separat 200 × 150 DOM-canvas med axelvis world-skalning och samma viewport-
clamp som huvudkameran. Endast vänsterklick/navigation; inga minimap-orders.
Vit indikator visar world-viewport inklusive kant-clamp. Aktuella snapshots
ritas utan gameplay-mutation/marker-cache; visibility-filter finns inför
RTS-049 men fog aktiveras inte ännu. Listener rensas på scene-shutdown.

## RTS-048 – Vision-policy före implementation

Fog-grid 32 px, separat aktuell visible och persistent explored per player/
enemy-team. Celler provas i centrum, inklusive radiuskanten: worker 160 px,
combat/enemy-unit 192 px, färdig bas 256 px, färdig barracks/Forge 192 px,
färdig farm 128 px. Byggnadsradie mäts från footprint-kanten. Endast levande
observers; ofärdiga byggnader ger ingen vision. Rock blockerar rak vision;
water och byggnader gör det inte. Rock-cellen själv kan avslöjas genom att
dess eget footprint undantas från LOS; bakom rock förblir dolt.

Explored gäller terrain under matchen och nollställs på restart. Inget minne
av enemy-building/unit/HP införs. Factory/update håller grid fristående från
Phaser. URL `fog-preview=player` eller `enemy` är uttryckligen en märkt
modellfixture, inte ett spelbart fog-läge: mask/synlighet granskas där medan
övrig information ännu inte filtreras. Normal visning aktiveras först RTS-049.

## RTS-049 – Gemensamt visibility-kontrakt

Units syns med centrumcellens current-visible; byggnad avslöjas om någon av
footprint-cellerna är current-visible. Då visas hela objektet med aktuell HP.
Ingen last-seen enemy-marker/HP-memory. Förlorad vision släpper explicit
attack till idle utan fortsatt dold positionstracking; autoattack återgår
som tidigare till origin/attack-move. Enemy-team använder samma union av egen
vision för local targeting/defense. Anfallsgrupper/waves kan förflytta sig mot
kartans konfigurerade basmål, men skadar endast synliga targets och följer
inte dold unit-position. Ingen dold budget/timer visas i player-UI.

Pilar tas bort om mål blir osynligt. Siege flyger till sin fasta siktpunkt
oberoende av om initial target blivit dold eller dött; båda fallen ger samma
flight, utan dold HP/position-läsning. Ingen
splash-skada på osynliga enemies. Om skytten dött används fortfarande
lagets vision för redan skjutna projektiler. Renderad projektil kräver aktuell
vision vid projektilens punkt. Minimap filtrerar enemy-objekt och maskerar
okänd/explored terrain; inget live enemy-footprint används som terrängdata.
Resurser kan beordras efter att terrängen utforskats, men återstående mängd
visas endast vid aktuell vision. Own saldo/units/orders/buildings är egna
uppgifter. Rock-LOS/radier från RTS-048 behålls. Utforska innan första order
till en ännu okänd resurs; normal fog aktiveras nu i båda modes.

RTS-049: Byggplacering kräver current vision i samtliga footprint-celler innan
occupancy granskas, så preview/kostnad inte avslöjar dold unit närvaro. Unknown
world-mask är opak; egna placement/drag-preview ligger ovanför masken.

RTS-049 granskning: Siege flight använder endast fast siktpunkt och target-
footprint observerad vid avfyrning. Dold target-position/HP får inte styra
flight; hidden och dead initial target ger identiska synliga skottbanor.
Splash provar synlighet före live victim-position/HP. Arrow drop-policy är
oförändrad. Detta undviker indirekt dödsläcka genom en synlig projektil.

## RTS-050 – Avgränsad selection/group-policy

Shift-click toggle, Shift-drag add, empty modifier bevarar selection; Shift
latchas vid pointerdown. Byggnadsklick är exklusivt även med Shift. Ctrl/Cmd
+1–9 skriver över en slot med valid own selected IDs, vanliga 1–9 recall-
ersätter unit-selection. Empty slot avmarkerar. Recall filtrerar nuvarande
HP/ägare/vision och ändrar inte orders/kamera; cancellerar aktiva UI-preview.
Death-pruning sker i cleanup även före freeze; grupper hör till MatchState,
inte global app-state. Fokus på INPUT/TEXTAREA/SELECT/BUTTON/A/editable,
repeat och Alt blockerar keys. Scene-shutdown tar bort listener och restart
skapar fresh grupper. Spelcanvas är fokuserbar och pointerdown ger fokus.

## RTS-051 – Svensk guide och tangentmappning före implementation

Synliga svenska kommandobeskrivningar med befintliga unit-namn. S Stop, A
attack-move, B barracks, F farm, G Forge, W worker (vald bas), T soldier/R
archer/C catapult (vald barracks), U attack-research/D defense-research
(färdig Forge). Shift/grupper enligt RTS-050; Escape cancellerar UI-mode.
Varje action använder samma aktiverade knapp/validering, inte separat ekonomi.
Inga actions vid repeat, Ctrl/Cmd/Alt-letter, UI/editable-fokus, pause eller
game over. Slots Ctrl/Cmd+1–9 fortsätter hanteras av gruppkontraktet. Guide
visar kontext och hänvisar till samma knappar/status för blockeringsorsaker.

RTS-051 browsergranskning: Escape flyttas till samma window-key-listener som
nya actions, med samma fokusguard. Snabb B→Escape→B måste bevara eventordning
och nästa placement; undvik att Phaser-köad Escape cancellerar en senare
synkron action. Ingen separat/duplicerad Escape-listener behålls.

## RTS-052 – Livscykel-policy före implementation

Första laddning visar startmeny. Välj Survival/Skirmish och Easy/Normal/Hard;
enda stödda karta är den handgjorda arenan. Start skapar fresh match. Session
har tydliga menu/playing/paused/ended-faser. Scenario/profil ändras bara i
menu, aldrig i aktiv match. Pause fryser MatchState före någon simulation/
cleanup/timer. Kamera via minimap, guide och session-meny fungerar i pause;
selection/orders/ekonomi och huvudcanvas-input är spärrade. Ocommitterade
placement/attack-mode/drag-preview cancelleras när pause/menu öppnas.

P togglar pause/resume. Escape cancellerar aktiv preview först, annars pause;
i paused återupptar Escape. UI/editable/modifierade bokstäver/repeat skyddas
som tidigare. Resume skippar första gameplay-delta och samlar aldrig pausens
wall-time. Restart från pause/outcome behåller val och skapar allt state på
nytt; Ny match öppnar menu med bevarade val, Start ersätter gamla matchen.
Ingen ny karta, lobby eller persistent campaign införs.

RTS-052 browsergranskning: när spelcanvas visas efter menu måste Phaser
ScaleManager.refresh köras, så displayScale räknas om från synliga canvas-
bounds. updateBounds ensamt räcker inte efter display:none och kan annars
ge NaN i world-input. Samma synlighetsövergång används efter varje menu.

## RTS-053 – Pixelkällor och ankare

Egna repo-lokala heltalskompositioner, begränsad palette och deterministic
PNG RGBA-export med Node built-ins. Ingen lånad art och ingen ny dependency/
runtime-procedural map. Atlas 256 × 128, fyra terrainframes 32 px och fyra
resourceframes 64 px, no trim/rotation. Texture nearest; roundPixels endast
visuellt. Resource-anchor (32,40) för befintlig center/radius20-footprint40.
Originalsprite/palett/export/provenance dokumenteras i [assets/README.md](assets/README.md).
World logic, resource amount/cost och fog-policy behålls. Artifact-validation
är .mjs Node-test i tests/, så browser-tsconfig slipper Node-typdependencies.

RTS-053-tillägg: native gräs med enhetlig grundton, pixelstrand/bergskanter endast vid exponerade patchkanter och egna skogs-/gruvresurser. Övergångar ändrar inte navigation eller footprints. Exporten omfattar 16 world-frames.

Användaren har godkänt taskvisa commits/push och GitHub Pages inom verifierad RTS-060. RTS-061–090 är framtida roadmap, endast planering i denna körning. Öppna beslut: fraktionernas namn/identitet, specialförmågor och balans.
