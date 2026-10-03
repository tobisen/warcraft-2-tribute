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

## RTS-058 – Uppdragsbeslut före implementation

Tre korta handkonfigurerade uppdrag på befintlig arena: Skogsvakten (tre ändliga difficulty-vågor), Belägringen (förstör fiendebas), Utposten (behåll basen i 90 gameplay-sekunder trots vågor 30/60/80 s). Utpostens tidsgräns är tredje målet; levande fiender vid 90 s hindrar inte seger, men basdöd samma steg ger defeat. Uppdrag har 20/10 respektive 20/10 och 40/10 initial wood/gold för att fokusera första armén; normala modes behåller 0/0. Kartval arena är explicit config; ingen andra karta, resurs eller unittyp införs. Pause fryser måltid och restart återställer missionconfig. Balans är preliminär tills naturliga playthroughs passerar.

## RTS-059 – Save-policy före implementation

En manuell localStorage-slot, ingen autosave eller filimport/export i första formatet. Schema version 1 och explicit config-version; okända/äldre versioner avvisas utan migration tills en faktisk migration finns. Snapshot bevarar matchens scenario/map, tid/outcome/pause, ekonomi/last, orders/HP/IDs, byggprojekt/kö/rally/supply/research, projectiles, AI och waves/fog samt kamera/byggnadsselection. Cache-navigation och render/listeners/animation/audio serialiseras inte. Load valideras atomiskt före scene-restart, rekonstruerar karta/fog och öppnar levande match pausad utan wall-time-bonus; terminal match förblir terminal. Uncommitted preview/modes avbryts. Storagefel ändrar varken match eller tidigare slot. Sparningar är origin-lokala: localhost följer inte till Pages.

## RTS-060 – Releaseprofil och budget före mätning

Verifierad primärprofil är installerad desktop Chromium/Chrome på denna macOS 15.7.4 arm64-miljö, Node 20.20/npm 10.8. Native 800×600 world i 1280×900 och alternativ staplad 1024×768-layout. Andra browsermotorer/mobil är ännu ej verifierade och ingår inte i godkänd releaseprofil. Normal MVP-belastning är upp till 23 egna units (base + tre farms) och 12 enemies; mät även ett avgränsat 64-unit-stressfall och upprepade restarts.

Budget: gameplay CPU p95 ≤16,7 ms, observerat frame-intervall p95 ≤33,4 ms under målbelastning; JS heap efter GC ≤128 MiB och ≤16 MiB tillväxt över tio resetcykler. JS build ≤1,7 MB/minified, ≤450 KB/gzip; total dist ≤5 MB. Initial assets hämtas lokalt/basrelativt, inga 404/runtimefel. Bundle-varningen accepteras endast om dessa budgetar håller; ingen split/refaktor för varningen i denna körning. Dokumentera headless/clock/GC-metod och skilj naturliga UI-playthroughs från accelererad gameplay-matris. Alla fem modes × tre profiler, save/load/pause/outcome/restart, assets/ljud och clean-install ska kontrolleras. Pages-workflow aktiveras först efter att dessa lokala releasekontroller passerat.

RTS-060 release: inga stats/AI/waves/startresurser ändrades efter full matris. Vite dev behåller `/`, build/preview använder `/warcraft-2-tribute/`; alla atlaspaths och manifest är basrelativa. Officiella Pages-actions pinas till verifierade commit-SHA, Node 22 i CI, npm ci/test/typecheck/build före artifact. Build har contents/pages read, deploy endast pages/id-token write; ingen PAT eller ny credential behövs. Concurrency pages/cancel-in-progress false låter pågående deploy slutföras utan kollision. Pages-källan måste vara GitHub Actions; faktiskt resultat redovisas efter push.


## RTS-061: kvalitetsgranskning

[QA_REVIEW.md](QA_REVIEW.md) beskriver verifierad Pages, betald större blandad armé, prioriterade fynd och browser-/tillgänglighetsgränser. Inga blockerande/P1-regressioner; överlappning och resurs-trängsel hanteras i RTS-063/064. Ny godkänd etapp fortsätter till RTS-065; RTS-066–090 är endast planerade.


RTS-062: QA-granskningen gav ingen bekräftad P0/P1-fixlista; gameplay/save-format är oförändrade. Överlappning och köer hanteras taskvis i RTS-063/064 enligt QA_REVIEW.md.

## RTS-063 – Separation före browserverifiering

Lokala kvadratiska kroppar enligt navigationens befintliga storlekar, inte ny fysikmotor. Deterministisk ID-sortering, spatiala 64-px-celler, högst12 närmaste neighbors och två pass. Korrektionsbudget48 px/s per kropp och delta, även sammanlagt över pass; inga slumpvärden eller sparade separationstimers. Static swept clearance/world bounds godkänner varje correction. Primärt minsta penetration, alternativ fri axel vid trängsel; kvarvarande överlappning tillåts om terräng/budget gör packning omöjlig. Orders/HP/cargo/selection bevaras, ändrad position ogiltigförklarar navigation så worker/combat approach planeras om. Player/enemy-units deltar; byggnader är fasta footprints. Fog räknas om efter correction. Pause/terminal states får inga corrections. Save schema/config1 är kompatibelt eftersom ingen ny persistent state införs. Smala passager och serviceslots får egen policy i RTS-064.

## RTS-064 – Köpolicy före implementation

Högst tre samlande workers per nod. Vid fler gather/deliver-orders aktiveras servicekö med nåbara kardinalpunkter och tilecentra inom arbetsräckvidd, separerade med worker-clearance. Upp till tre workers behåller tidigare approach. Prioritet roterar stabila live worker-ID:n var femte gameplay-sekund; gather/deliver-loopar behåller deltagande, avbrutna/dead refs försvinner direkt. Ej tilldelade workers går till separata fria väntpunkter utanför gathering-range och samlar inte. Ingen ny ekonomi eller lasttyp. Smala sammanhängande passager (walkable cell med högst två fria grannar) får en aktiv kropp åt gången; kropp inne prioriteras, nya contenders får roterande prioritet per gameplay-sekund och väntar före entry. Idle/dead units håller inget reservationslås. Orders fortsätter; lokal soft separation gäller fortfarande och är inte hård generell collision. Navigationens advance får begränsad tillåten rörelsetid, inte teleportering eller clearing av order. Policy härleds från model/tid vid varje steg, ingen ny saved queue-state. Save schema/config1 rekonstruerar policyn från befintlig elapsed/orders/positions. Stora delta delas även vid resource-prioritetsgränser; köväntan kan ge olika travel-throughput vid grova tidssteg, men resurs/last bevaras.

## RTS-065 – Mätbudget före profilering

Primärmiljö: MacBook Air/macOS 15.7.4 arm64, Chromium 147.0.7727.15 headless, 1280×900 desktop med native 800×600 canvas, lokal production-build. Mål: 64 kroppar (8 workers +44 blandade melee/ranged/siege +12 enemies) med gathering, movement/strid, fog och HUD aktiva. Stress: 128 (8+108+12). Dessa är avsiktliga belastningsfixtures utöver normal supply, inte legala arméköp eller ny balans.

Budget före mätning: 64-kroppars scene-update inklusive model/presentation/HUD CPU p95 ≤16,7 ms, render CPU p95 ≤16,7 ms och observerad RAF p95 ≤33,4 ms. 128-kroppars stress: update CPU p95 ≤33,4 ms; FPS rapporteras som observerad, inte garanti om alla enheter. GC-heap ≤128 MiB och tillväxt ≤16 MiB efter tio restarts. Minst 300 mätframes efter warmup och separat långkörning/reset. Befintliga bundlegränser kvar: JS ≤1,7 MB, gzip ≤450 KB, dist ≤5 MiB. Profilera före optimering och gör endast ändringar som mätning motiverar; om budgeten redan hålls redovisas samma implementation i före/efter, utan påhittad förbättring. Gameplay-, fog- och save-regressioner ska fortsatt passera.

RTS-065: CPU-sampling visade findRoute/approachRoute som flaskhals. Rak distans är säker lower bound; endast kandidater som kan förbättra den funna rutten söks, med ursprunglig tie-ordning. Separation behåller clear moving-route men invaliderar maprevision/blocked next segment eller flyttad arrived-position. Detta preciserar RTS-063:s tidigare generella cacheinvalidation. Inget nytt routesystem eller persistent state. Load återskapar cache och kan ta likvärdig annan väg; samma orders/cargo/serviceprioritet och resource ledger krävs, inte byte-identiska waypoints efter cacheförlust. Uppföljning/budget i PERFORMANCE.md.

## RTS-066 – Fraktions- och savebeslut

Användaren har efter publicerad RTS-065 bett om fortsatt arbete. Den tidigare etappgränsen är upphävd; återstående backlog följs taskvis med samma commit/push/checks. Tekniska fraktions-ID:n crown/clans, separata från team/owner; egna typ-ID:n över gemensamma roller, inga kopierade gameplay-system. Numeriska grunddata hämtas från befintlig config; fraktionsskillnader i stats hör till RTS-068. Visningsnamn och egna andra-fraktionsassets är öppna inför RTS-067 (förslag Kronförbundet/Järnklanen har frågats till användaren); förmågor förblir öppna inför RTS-069.

Save schema2/config tribute-config-2. Endast tidigare schema1/config1 migreras, genom standardidentiteter utan att ändra gameplaydata, följt av full atomisk validering. Okända versioner eller fraktioner avvisas; v1 med spoofat fraktionsfält accepteras inte. Befintlig slotnyckel warcraft-2-tribute:save:v1 behålls som lagringsnyckel, inte schemaetikett. Load ändrar inte storage; nästa manuella Save skriver v2. Ingen generell migrationsram eller ny persistence-dependency.

## RTS-067 – Fraktionernas presentation

Arbetsnamnen är Kronförbundet (människor, `crown`) och Järnklanen (orcher, `clans`), enligt det kommunicerade standardförslaget medan namnfrågan är obesvarad. Menyval väljer spelarens fraktion; en ny match får motsatt fiendefraktion. Laddning och restart bevarar sparade sidval, även samma fraktion på båda sidor. Ägarskap och blå/röd lagfärg är separata från fraktion. Stats/kostnader är fortsatt identiska i denna slice; skillnader hör till RTS-068. Originalgrafiken använder repo-lokala pixelkällor, inga importerade Warcraft-assets.

## RTS-068 – Första balansskillnaden och betalda recept

Kronförbundets numeriska baslinje bevaras. Järnklanens yxkrigare har 66 HP, kostar 18 wood/6 gold och tar 6 gameplay-sekunder; supply 1, damage 18/s och speed 160 kvarstår. Detta är en liten preliminär tålighet/wood mot gold/tid-avvägning, inte påstående om slutbalans. Övriga enhetsrecept är identiska men lookup för kostnad/tid/supply/producerad HP använder vald fraktion. Byggnader, uppgraderingar, footprints, arbetarlast och navigation behåller befintliga värden.

Fiendens ändliga ekonomi använder egen fraktionskostnad. Produktionstiden är difficulty-profilens 7/5/4 s plus receptets avvikelse från 5 s (Järnklanen +1 s). Befintlig fiendestridsprofil 36 HP/65 px/s/6 damage/s förblir separat från spelarens fulla enhetsstats tills senare AI-/balansetapper. Waves är oförändrade och använder ingen ekonomi.

Save schema 2, config tribute-config-3; slotnyckeln oförändrad. Föregående config2 och v1/config1 migreras genom validering av tidigare betalda Järnklan-jobb mot den faktiska gamla kostnaden 20/5 och gamla player-/difficulty-tiden. Ett explicit legacyRecipe-fält bevarar dessa jobbs kostnad/tid över nästa Save. Ingen ytterligare kostnad, gratis refund eller förlorad tid vid Load; nya jobb får det nya receptet och färdiga enheter får aktuell HP-config. Existerande enheters HP förändras inte. Härledd gathering.faction återskapas från matchens player-ID och lagras inte som en andra auktoritet.

## RTS-069 – Förmågebeslut före kod

Efter rimlig svarstid används det kommunicerade standardförslaget medan valfrågan är obesvarad: Kronförbundets försvarshållning ger inkommande damage ×0,75; Järnklanens raseri ger utgående damage ×1,25. Befintliga spelarstridsenheter, inklusive ranged/siege, kan aktiveras individuellt genom gemensam knapp/E för markerade enheter. Effekt 5 gameplay-s, cooldown 20 s från aktivering, ingen resurskostnad. Bara ready units påverkas i mixed selection; orders/selection bevaras. Multiplikatorn kombineras med befintlig Forge-upgrade. Projektiler lagrar modifierad damage vid avfyrning; effektslut ändrar inte skott som redan är i luften. Ingen enemy-AI-aktivering eller nya unittyper i denna slice. Aktivering kräver inga dolda mål och ändrar inte befintliga fog-regler.

Effekt/cooldown är unit-state och följer gameplay-delta, paus, terminal freeze, Save/load och restart. Matchupdate delar delta vid effektslut så buff inte sträcker sig över sin varaktighet. Save config4 (schema2) validerar dessa timerfält; config3 och äldre verifierade migrationer har inga buffar och behåller sin tidigare state. Balans är preliminär inför RTS-070.

## RTS-070 – Spelbarhetskontroll före balansändring

Båda fraktioner kontrolleras på samma arena i fem scenarios/tre difficulties, med egna recept och aktiverade förmågor. Naturliga Utposten/Normal-matcher och verkliga oskyddade defeat-körningar kompletterar den accelererade kommandomatrisen. En förlust hos första Hard Skirmish-strategin motiverade förbättrad gold-/worker-/anfallsplan i testhelpern; slutliga 30 kombinationer vann utan ändrade spelvärden. Behåll därför RTS-068/069:s preliminära balans inför AI-ekonomietappen. Detta bevisar vinstvägar, inte statistisk fraktionsjämvikt. Rapport/metod/begränsningar i FACTION_BALANCE.md.

## RTS-071 – Enemy-ekonomi före implementation

Två initiala enemy-workers i spelbara matcher med fiendebas: en wood, en gold. Båda använder befintliga gemensamma world-noder, last5, rate1/s och leverans24 från basens faktiska footprint (enemy96). Startbudget från difficulty behålls; all ytterligare income kommer från lastleverans. Enemy-workers är angripbara/fog-filtrerade, har worker30HP och attackerar inte eller rekryteras till army. Ingen worker-produktion eller ny nod i denna task. Global servicekö härleds över båda lagens arbetare. Lastförlust, extraherade resurser och betalda produktionskostnader bokförs för bevarande. Siege-test är en äldre utvecklarfixture för isolerade ändliga budgetregressioner, inte spelbart scenario. Äldre saves bevarar befintliga enheter/ekonomi och får inga nya workers vid Load; fresh restart följer nya starter. Resursupptäckt för AI är fortfarande den tidigare förenklingen och hanteras i RTS-075.

RTS-071:s regression gav ett avgränsat balansbeslut: +20 s till första
gruppanfall endast i den nya enemy-ekonomimodellen. Difficulty-startbudget,
HP, kostnader och army-cap behålls. Äldre saves och siege-test behåller tidigare
timing. Leveransworkers frigör globala serviceplatser; annars höll fjärran
leveransturer nodens begränsade platser utan att samla. Save schema2/config5
validerar verkligt fiendearbete och bankledger; config4 migreras utan nya
arbetare/inkomster och utan att acceptera spoofade nya economy-fält.

## RTS-072 – avgränsad AI-byggpolicy före kod

En barracks först, sedan högst en farm vid supply-behov. Samma 40/20 wood,
64px-footprints, 5s worker-arbete och bas8/farm+5 som spelaren. Difficulty
army-cap förblir separat övre gräns. En begränsad lista gridplatser och
1s retry runt enemy-base; inget generellt planeringssystem. Auktoritativa
byggnadsentiteter/HP/construction finns i combat.enemies; tillfällig
placement/gathering-vy återanvänder befintliga regler. Gamla snapshots
fortsätter sin betalda base-production; endast fresh restart aktiverar den
nya policyn, utan migration som skänker byggnader. RTS-073 hanterar bredare
prioriteringar och RTS-074 återhämtning/expansion.

RTS-072 implementerar supply-margin1: när used+reserved når cap-1 sparas
wood till farm i stället för fler nya arméjobb; betalda jobb fortsätter.
Det undviker att armékostnaden permanent svälter farmbygget. Sex fasta
kandidater och 1s retry; nya byggnader kostar alltid resurser, även efter
förlust. Save schema2/config6 introducerar site/retry-state utan gratis
byggnader i migration. Enemy-barracks får endast produktionstid efter den
faktiska byggsluttiden inom delta; samma tid kan inte bli både bygge och
träning. Vid basdöd bibehålls terminal freeze och betalda kostnaders ledger.

## RTS-073 – avgränsad policy före kod

Ordning: barracks/supply, minst tre levande army-units, Forge, attack1,
defense1, sedan fortsatt armé. Arméförlust under tre öppnar ersättning
före nya research-starter; redan betalda research/job fortsätter. Samma
40wood/10gold Forge och researchkostnad, 5s bygge/8s forskning, en nivå
och samma multiplikatorer som spelarens config. Inga gratis stats.
De två befintliga workers kan prioritera wood när gold-riktvärdet redan
är fyllt, enbart mellan idle/tomma gather-orders för att bevara lasten.
Nya matcher aktiverar policyn; äldre snapshots fortsätter sin modell
utan gratis Forge/uppgraderingar. Expansion/replacement-workers väntar
till RTS-074.

RTS-073: när research redan betalats tillåts också nya army-jobb;
bankbesparing avser obetalda mål. Enemy-bonus använder samma 1,25/0,75
som spelaren men svag enemy-grundprofil bevaras. Ingen gratis HP.
Forge-död avbryter aktiv forskning utan refund och bevarar lärda nivåer.
Auktoritativ enemy-research sparas i config7; combat-cache härleds och
serialiseras aldrig. Äldre config6/under får ingen ny policy vid Load.

## RTS-074 – återhämtning och öppet expansionsbeslut

Ersätt initialt två enemy-workers med betald base-produktion: samma
20wood/5s/supply1 som spelaren, högst ett jobb, monotona ID:n och giltig
spawn vid basens faktiska96px-footprint. Behövs en worker sparas banken
före nya army/research-starter; betalda jobb fortsätter. Basdöd avbryter
jobbet utan refund. Ingen magisk återhämtning om bank saknar20 och alla
workers är döda. Gamla config7/under får ingen ny policy vid Load.

Användaren valde extra resursbas. En avgränsad AI-outpost vid befintliga
ändliga noder:80wood/20gold,96px/240HP/10s arbetarbygge/+8 supply.
Betald efter färdig barracks, tre levande army och båda uppgraderingarna;
förlorad ekonomi/armé återhämtas först. Tre gridkandidater/1s retry,
full world/obstacle/body/kontakt/spawn-exit-kontroll. Ingen ny resursstock
eller gratis income; färdig bas kortar befintlig leverans. Högst en extra
bas, huvudbasen behåller objective/workerproduktion. Gamla saves får
ingen ny policy. Grundbalansen är preliminär inför RTS-079.

## RTS-075 – avgränsad upptäckt

Ny enemyKnowledge minns bara senast synliga noder/mängder och observerad
spelarbasposition. Hidden resource amount uppdaterar aldrig minnet. Egen
bank/enheter och statisk terrain är kända. En tom worker utforskar
via tre fasta terräng-waypoints; lastade/buildande workers avbryts inte.
Anfallsgrupper söker via tre fasta terräng-waypoints tills basen setts,
sedan mot senaste observerade plats. Ingen strategisk läsning av dold
spelarposition/resursmängd. Collision/spawn/placement är fysisk
auktoritativ validering, inte en information-planner. Kontakt med en
uttömd nod ger ingen extraction; osedd uttömning avbryter inte fjärran
gather-order. Save config9 bevarar strikt observerat minne; config8/under
migreras utan ny knowledge-policy, fresh restart använder nya regler.

## RTS-076: avgränsad map-data

Tre fasta TS-profiler, gemensam värld/spawns/nodpositioner. Olika
terrain och finite stock: arena400/300, forest500/250, river350/400.
Det uppfyller kartvariationen utan att införa ny nodmodell, generering
eller större värld. Rendering/fog/minimap/navigation har samma profil.
Kartval endast i Skirmish i denna slice; kombinationer och inställnings-
presentation vidareutvecklas i RTS-077. Save config10 kopplar stock och
terrain till validerat map-ID; legacy9/under är alltid arena.
Balansmängder är preliminära inför RTS-079.

## RTS-077: atomiska options

Befintliga matchval kompletteras med en gemensam ren validator och
menysammanfattning. Scenario-only byte från skirmish till icke-skirmish
återgår till arena; explicit alternativ karta i det scenariot avvisas.
Options ändras bara i menu, och faktisk sparad match styr Load/restart.
Ingen separat persistent menupreferens/options-snapshot eller ny schema-
version. Alla18 fraktion/map/difficulty-kombinationer är giltiga men
full balans utvärderas i RTS-079.

## RTS-078: statistik utan dubbel bokföring

Statistik härleds från befintliga finite stocks, bank/last/loss-ledgers
och spawn-counters. Visa net spend efter refunds snarare än att införa
gross-spend/eventhistorik. Enhetssiffror räknar kroppar, inte supply
eller byggnader; wave-fiender räknas som tillkomna. Resultat endast
efter terminal outcome, båda lag, maximalt en decimal i resursrows.
Save config10 räcker; Load återskapar samma statistik ur faktisk match.
Legacy utan enemy-income-ledger ges inga påhittade inkomster.

## RTS-079: gemensam giltig sökrutt

Sökpunkterna704/480,448/480 och208/384 är terrängpositioner som
passar alla tre befintliga kartor. Tidigare704/400 låg i Skogspassets
sten och448/528 i Flodkrökens vatten. Ingen dold basposition läses;
observerad bas fortsätter vara målet först efter synkontakt.
Tidigare sparade attack-move-order normaliseras vid nästa simulation.
Inga kostnads-/HP-/tryckändringar utan påvisat behov; Save config10 kvar.

## RTS-081: land/vatten/kust

Rörelsedomänen är explicit land eller vatten. Samma square-body,
fyra-grannars BFS och world-pixel/delta-modell används. Landenheter
korsar inte vatten; vattenkroppar korsar inte land/sten och måste
rymmas helt, inklusive worldgräns och dynamiska byggnader. Vatten från
handgjord mapprofil bildar en geometrisk union; angränsande patchkanter
är inte hinder. Kustbyggnad straddlar land/vatten med positiv area i
båda, utan sten/byggnader. Kustutgång och recipe bestäms i RTS-082.
Ingen ny sparad terrängkopia, schema eller fartygsstate i RTS-081.

## RTS-082: preliminär hamn-/fartygsrecipe

Gemensamma konfigvärden för båda fraktioner: hamn64x64/grid32,
40wood/10gold,160HP,5s workerarbete/range24. Fartyg40wood/15gold,
8s produktion,2 supply,32px square-body,110px/s,90HP. Dessa är
implementationens preliminära värden, inte en balansgaranti;087
provar sjöbalansen. Max en hamn; FIFO max3 med befintlig full queued/
halv aktiv refund. Blockerad spawn väntar vid0 utan ny kostnad.

NavyState är separat från land-unit/gathering och använder egna
ship-ID:n; supply/ekonomi/selection/fog/resultat är gemensamma.
Ingen sjöstrid eller lastning i082. Fartyg får överlappa vid samma
move-mål; spawn beaktar kroppar. Egen kodritad märkt hamn/hull
är avsiktliga placeholders tills089. Save config11, gammal10 utan
navy migrerar utan extra byggnader/enheter/resurser.


## RTS-083: gemensam strid, separata rörelse-/skottplan

Naval attacker är manuella och använder befintliga syn/HP/fixed-aim-regler.
Vatten är farbart för fartyg och marina skott; mark är ofarbart för fartyg,
sten/byggnader blockerar skott. Range192 mäts mot footprint; preliminära
16damage/1,5s, projectile280/life3/radius20 i navyConfig. Landfiender får
fysiskt nåbara kustmål ship/harbor; ingen gratis fiendeflotta introduceras.
Army-upgrades gäller, landfraktionsförmågor inte. Samma levande snapshot
möjliggör samtidiga dödsfall; hamndöd rensar jobs/foot utan refund.
Save schema2/config12 migrerar11 utan att uppfinna attack-state.
Transport och sjö-AI förblir084/086; balans087 och assets089.


## RTS-084: omedelbar boarding och atomisk landsättning

Transportrecept40wood/10gold,8s,2supply, fyra platser delas av båda
fraktioner före balans087. Hull följer grundfartygets HP/hastighet/body.
Spelaren flyttar markunits till fri kustkontakt inom64px före högerklick
på båten; automatisk approach/boarding-kö introduceras inte. Högst
återstående platser lastas i befintlig unitordning. Last är Unit-objekt
med oförändrad identitet/HP/archetype/cargo, men utan aktiv order/selection.
Endast båten simuleras; passagerartimers fryser. Supply/resultat räknar
lastade units som levande; sänkning dödar dem och bokför förlorad cargo.
Landsättning är atomisk: giltig synlig landpunkt inom64px, fri kontakt,
och separata kroppsplatser runt klicket (kandidater inom48px).
Config13 återanvänder strict unit-validation för ground och passengers,
inklusive global ID-unikhet/counters. Inga nya kartor/transport-AI/assets.


## RTS-085: profilbestämd ökarta utan resursdeadlock

Öarna är två handritade landmassor i oförändrad värld, med sammanhängande
hav via fem icke överlappande vattenrects. Två stenpartier kvarstår på land.
Bas-/worker-/enemy-spawns och wood-position bevaras; gold600300 på
spelarön gör det möjligt att betala hamn/transport före första överfarten.
Ändliga800wood/400gold finansierar slice-flödet, utan ändrade priser eller
passiv inkomst. Enemy terräng-scouting hålls på östra ön; inga dolda
resurs-/baspositioner lämnas ut. Enemy har ännu inget sätt att korsa havet:
naval AI tillkommer086. Gamla landkartor behåller ekonomi och slutflöde.
Save schema2/config14 kopplar map-id till faktisk profilposition/stock.

## RTS-086: avgränsad ändlig sjö-AI

Endast färska Skirmish/Öarna får extra120wood/30gold och en betald transport.
Ingen passiv inkomst, AI-kanonflotta eller återuppbyggnad efter sänkning.
Två riktiga producerade soldater används; inga gratis passagerare. Preliminär
launch Easy260/Normal220/Hard190 sekunder ligger i config och verifieras087.
Harbor86432064x64, kust912432, vatten880432→720432 och land688432 är publika
kartvägpunkter, aldrig dold basinformation. Observerad bas ersätter
utforskningsmålet. Last är exklusiv EnemyNavalState, ej samtidig markarmé;
sänkning förlorar last en gång. Gamla config14-saves får varken bonus eller
flotta; restart krävs för nya profilens ekonomi. Enemytransport har32px
kropp även i markanfallens range/contactberäkning.

## RTS-087: verifierad sjöbalans

Båda fraktioner × Easy/Normal/Hard klarar verklig insamling, kasern, tre
soldater, hamn, transport och landstrid till victory. Priserna behålls:
Kronförbundet180wood/35gold totalt, klanerna174wood/38gold. Tre workers +
tre soldater + transportens2supply =8/8; ingen farm krävs. Transporten är
obeväpnad och kan bära4 units. Ett tidigt stridsfartyg kräver inklusive
hamn80wood/25gold och ger5/8 använd supply med de tre startarbetarna.

AI anfaller tidigast260/220/190s för Easy/Normal/Hard med två betalda
soldater. Passivt spel förlorar inom350s i alla sex kombinationer. En betald
tidig kanonbåt kan sänka den ännu tomma transporten vid fiendens kust och
hålla basen oskadad till350s. Det är ett avsiktligt enkelt motmedel; AI har
bara en transport, inga kanonbåtar och ingen återuppbyggnad. Sänkning ger
inte victory: fiendebasen måste fortfarande förstöras. Inga balansvärden
ändrades eftersom de verifierade progressionerna fungerar. Resultaten
är deterministiska scenarioflöden, inte ett statistiskt balanspåstående.

## RTS-088: ett sjöuppdrag utan nytt objectivesystem

Överfarten använder Öarna,20wood/10gold och det befintliga basmålet; egen
bas måste överleva. Ingen eskort, gratis flotta eller ny tidsseger införs.
ScenarioDefinition.map styr fasta uppdrag; Skirmish kan fortsatt välja
alla kartor. Save config16 skiljer nya uppdragssaves från15, medan gamla
matchers ekonomi/map/objektiv bevaras vid migration.

## RTS-092 – Visuell riktning för nästa etapp

Egen skogsgrön/mässingsfantasy, Georgia/system-ui utan fontdependency, originalrepoassets. Två HTML/CSS/canvas-referenser i [design/references.html](design/references.html), palett och komposition i [VISUAL_DIRECTION.md](VISUAL_DIRECTION.md). Top/bottom-HUD är framtida097–101;095 behåller funktionell sidopanel. Campaign093 återanvänder fyra fristående uppdrag, ingen progression. Separat speedval094 visar verkliga1×;0.75× tidsmodell införs först108. Inga främmande assets eller gameplayändringar i referenserna.

## RTS-094 – Separat matchform och speed-scope

Karta/fraktion/svårighet återanvänder validerade options och låsta scenariokartor. Korta karta/svårighetsbeskrivningar separeras från hela sammanfattningen. Game speed är separat och visar enda fungerande1×.0.75× införs i108, inte i094, eftersom körningen uttryckligen inte får implementera097–120. Ingen ny Save-property behövs för konstant1×.

## RTS-095 – Resize utan worldscale

Canvas använder återstående fönsteryta efter befintlig280px HUD och sessionrad. Kartstorlek/grid/gameplay ändras inte vid resize. Kamera maximeras till kartans mått och centreras vid större fönster, utan zoom eller utsträckta pixlar; ramklick ignoreras. Resize avbryter bara oavslutad musdraggest, inte orders/selection. Nya top/bottom-HUD ingår först097–101.

## RTS-096 – Engelska utan nytt språk-/Save-system

Spelarvänd copy och visningsnamn är engelska. En enkel beroendefri texttabell används av config, feedback och DOM; inga locale-val eller externa dependencies. Machine IDs/orderkinds, stats och Saveversion bevaras. Nya Save-errorcodes och explicit load/resume-state ersätter textbaserade UI-villkor. Befintlig svensk sparad rally-prosa exponeras inte. Resultattal följer en-US. Dokumentation och historiska slice-texter får vara svenska.

## RTS-099 – Researchåtkomst i contextual HUD

Behåll befintlig BuildingSelection (base/barracks/harbor). Attack/defense research visas vid vald base och kräver fortfarande den befintliga färdiga forgen. Ingen ny forge-selection eller Save-migration i denna presentationstask. Blandad unitselection visar union av rollernas actions; varje callback filtrerar enligt tidigare gameplay. Previewknappar blockeras vid otillräcklig bank; saldo dras först vid giltig placering.

## RTS-100 – Grupp- och köpresentation

Gruppikoner är read-only; inga nya selection/subgruppgester. Blandad land/navyselection visar alla markerade ikoner med summerad HP och union av tidigare actions. Active head har gameplaybaserad progress; queued jobb har0%, färdig blockerad head100%. Befintliga refunds50%/100% och callbacks återanvänds.

## RTS-102 – Kamera är UI-tid

Piltangenter används för camera pan; WASD införs inte eftersom A/S/W/D redan är actions.480px/s,16pxedge och max100ms frame-delta ligger i camera-config. Kamera använder realdelta, inte gameplay-speed. Diagonal normaliseras; keyboard prioriterar edge, HUD/drag/phase/focus blockerar. Space/Home/preferences följer103.

## RTS-103 – Camera preferences före persistence

Pan speed valideras mot240/480/720 och edge-pan mot boolean. Standard480/on enligt102; lämplig enkel appsessionstate, ingen match-Save-schemaändring eller prematurelocalstorage.119 hanterar persistence. Space använder selected-player boundingcenter; Home egen bas. Ctrl/Meta/Alt/repeat/focused UI avvisas och A/S/W/D är fortsatt actions.

## RTS-104 – Modal UI återanvänder session

Pausens subpages är appägd UI-state, inte match/Save. Quit-confirm använder befintlig new-match först efter uttrycklig Confirm; Cancel/Back/Escape gör ingen sessiontransition. Native browser fullscreen med faktisk state/felkvitto, separat från gameplay. Befintlig Escape-previewcancel prioriteras före paus. Modal har backdrop/fokusfälla och håller worldviewport stabil.

## Beginnerprofil – RTS-107, 2026-10-03

Beginner får längre förberedelse, enhetsgrupper om1, lägre initialbudget/armycap och12s soldierproduktion. Reserve0/maxdefenders1 gör att den enda initialt finansierade soldaten faktiskt kan ingå i ett anfall. Player combatstats/gather är lika; svårighet påverkar ingen global gameplayspeed. Outpost hålltid90s och navalbonus/passagerarantal bevaras, men attacker skjuts fram. Detta är en preliminär configprofil inför verkligt nybörjarspeltest110; exakta jämförelser finns i GAME_DESIGN.md.

## Separat gameplayspeed – RTS-108, 2026-10-03

Tidsskalning sker enbart vid scenens gameplay-delta-ingång; updateMatch får gameplaysekunder och skalar inte metadatafältet speed igen. UIcamera använder originaldelta och ljud använder AudioContexttid. Options speed är optional för gamla callers med1×default; nya Save17snaphots kräver validerad speed. Äldre16migreras1× utan walltimecatchup. Ingen live speedändring i denna slice.

## Guidat tutorialuppdrag – RTS-109, 2026-10-03

Tutorialen återanvänder Arena och befintlig ekonomi, input, byggande, produktion och combat. Progression mäts i verkligt utförda handlingar och leveranser, inte tid eller gratistilldelning. Ett stillastående idle-mål och soldier autoDisabled i stridslektionen ger utrymme för manuell attack; ordinarie andra matcher ändras inte. Tutorial får en egen victory-typ och Saveconfig 18 med validerade milestones. Inget generellt tutorialframework eller inputlås införs. Verkligt nybörjarspeltest kvarstår i RTS-110.

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

## RTS-115 – Handgjord referenskarta och ändliga expansioner

Frontier Valley läggs till som separat större Skirmish-kartval,1600×1152,
med befintliga32px tiles. Äldre kartor behåller dimensioner/terräng/stock.
Handritade water/rock-footprints ger norra flank, central96px landpassage och
södra flank. De två expansionsnoderna använder samma40×40-resourcefootprints,
5-capacity last, gathering/delivery och fog-policy som primarynoder.

Total tillgänglig stock är600wood/450gold; inga automatiska credits och inga
nya dropoffbyggnader. Arbetare transporterar till befintlig bas. Enemy delar
samma ändliga noder och får bara välja upptäckta resurser; kartan tillför
scouting/attack-waypoints men ändrar inte AI-ekonomins grundregler.

Save config19 validerar lager och koordinater mot den identifierade kartan.
Config18/äldre migreras endast med deras tidigare karta/nodmodell. En sparad
camera behöver inte passa en historisk viewport; scene clampas mot den
aktuella viewporten, vilket också tillåter gamla kartors giltiga bottom-pan.

## RTS-117 – Ljudmix är presentation

Gather/build/train är tre nya egna syntetiserade cues, utan gameplaytimrar,
externa inspelningar eller nya Savefält. Aktivitetsdiff följer faktiskt egen
last/byggtid/spawn-counter; mängder från dolda fiender läses inte för ljud.
Per-cue repetition/gain och sourcebudget ligger i config. Fyra vanliga sources
plus två reserverade alerts/resultat minskar överlapp; game over städar gamla
sources innan resultatcue. Musik/pitch använder verklig Web Audio-tid, inte
ändrad gameplayhastighet. Arbetets ljudbudget valideras tekniskt i browser;
mänsklig bedömning av mixen redovisas separat före taskens Done-status.

## RTS-118 – Röstassets saknas; lokal syntes som redovisad ersättning

Inga inspelade enhetsröster finns. Egna korta engelska textrepliker syntetiseras
lokalt av browsern om lokal engelsk röst tillhandahålls. Ingen server, hämtad
inspelning eller originalspelsreplik används. Saknad native capability ger
synlig otillgänglighet och tyst fallback, utan gameplayeffekt. Existerande
OS/browser-röster distribueras inte som projektassets. Faktisk röstklang är
plattformberoende; den samlade hörbarhets-/mixbedömningen kvarstår i120.

## RTS-119 – Preferences är inte en matchsave

Versionerat separat preferences-slot, utan backend. Master/music/effects/
voices/mute, camera pan/edge och meny-defaults faction/difficulty/game speed
sparas vid faktisk ändring och läses vid startup. Map/scenario och aktiv match
lagras inte i preferences. Säker fallback per fält; future-schema ignoreras
utan automatisk överskrivning vid läsning. Nya explicita val får spara schema1.

Voices-volym skiljs från effects och följer master/mute. Native speech kan
inte mixas i appens AudioContext: byte av aktuell voice/master gain avbryter
pågående tal, nästa replik använder nytt gain. Load behåller sparad matchs
options, framtida meny-defaults behålls separat. Befintlig Save-key/version
ändras inte. Preferences gäller browser/origin, inte mellan localhost/Pages.

## RTS-121 – Etappavgränsning och senare verifiering

Användaren skjuter uttryckligen upp ljudtester och matchlyssning till senare.
117/120 kan avslutas med befintlig teknisk verifiering; ingen fysisk
lyssningskontroll hävdas. Detta gäller även senare ljudpresentation i126.
Spelbara fraktioner för122–126 förblir Crown/Clans. Ingen gameplay/roster eller
kartändring ingår.122 återanvänder sessionens ended/restart/new-match;123
återanvänder resurs-/unit-accounting och kompletterar verkliga luckor.

Öppna implementationval löses inom respektive task:123 counter-save-migration
och hantering av äldre historik;124 releaseformat/build-ID-källa;125
renderingsviewport och gemensam DOM/canvas-skalning;126 kompositionens
assetformat. Dessa är ännu inte implementerade beslut. Inspelade röster
krävs inte här; plattformsberoende lokala röster redovisas fortsatt.

## RTS-123 – Statistikdefinitioner och äldre saves

Buildings completed räknar faktisk färdigställning, inte placement eller
starting bases. Buildings destroyed omfattar även ofärdiga sites och baser.
Units removed by owner är separat från combat losses/enemy kills; action för
egen borttagning ingår först147 och är fortfarande otillgänglig. Spending
är fortsatt Net spent (betalda kostnader minus refunds).

Config20/schema2 inför ledger; migration från19 behåller speldata och markerar
bygg-/owner-removal-historik som ofullständig med räknare från migrationen.
Vi gissar inte äldre byggda/förstörda totals från kvarvarande byggnader.
Resursstatistik summerar alla noder, så expansionswood/gold räknas korrekt.

## RTS-124 – Versionskälla

Första presenterade produktrelease är0.1.0, definierad endast i config/release.ts.
Changelog beskriver samlade användarsynliga funktioner och inte varje task
som en egen release. Build-ID är separat HEAD commit-hash vid build, local
i dev, unknown om git saknas. Release, build-ID och Saveconfig är olika
värden med olika syfte; inga commits/amend eller match-Saveändringar.

## RTS-125 – Renderingsupplösning

Preset anger hela logiska spelytan inklusive DOM-HUD, inte bara världscanvas.
800×600,1024×768,1280×720,1600×900,1920×1080,2048×1332 stöds. Gemensam
CSS-scale är min(1,windowWidth/logicalWidth,windowHeight/logicalHeight),
centrerad letterbox och ingen sträckning. Fönsteranpassning är separat och
default; under800×600 behålls minsta logiska HUD och skalas ned. Presetval
bevaras när adaptation slås på, och fullscreen är separat/on-demand.

Kartan påverkas inte; större logisk canvas visar mer world via befintlig
kamera, små fönster skalar ned samma vy. Settings sparas i preferences-slot,
inte i match-Save. Mycket högt preset på liten skärm ger förväntat liten
text/grafik; välj fönsteranpassning eller lägre preset för större visning.

## RTS-126 – Original komposition och ambience

Startsidan använder en projektgenererad rasterillustration med human/orc/elf/
dwarf/goblin, skapad med inbyggt imagegen utan externa referensbilder. PNG-
master och prompt/provenance bevaras; JPEG85 runtime-export. Bilden är
ornament, title/menu är DOM och Crown/Clans enda spelbara. Illustrationens
fem folk innebär inget gameplay-/fraktionsbeslut inför134.

Diskreta embers har reduced-motion-fallback. Befintlig musik återanvänds som
menuambience med0.35gain, efter gesture och med samma master/music/mute.
Ingen separat autoplay eller dubbla musikloopar. Faktisk hörbarhet/balans
är inte bedömd; användaren har uttryckligen skjutit upp ljudtest/matchlyssning.

## RTS-127 – Återanvänd flera fyndigheter

Behåll RTS-115:s författade kartdata och ID-baserade gather/deliver-orders. Fyndigheter har separata ändliga lager; ingen automatisk omdirigering vid uttömning. Regressionstäckning kompletteras utan att omstrukturera fungerande resource-state.

## RTS-128 – Resursinformation och fog

Utforskade fyndigheter får väljas, men aktuell mängd/uttömning kräver vision. Ingen ny stock-minnesmodell införs; dolda noder visar Outside current vision. Egna units/byggnader har klickprioritet vid överlappning. Resursselection är exklusiv, även med Shift, och hålls som lokal presentation utan Save-formatändring; Load/restart rensar den.

## RTS-129 – Behåll servicekön

Återanvänd tidigare tre serviceplatser och femsekunders rotation från traffic-config. Kö härleds från levande workers, orders och gameplaytid, delas mellan ägare och återställs deterministiskt efter Save/load. Ingen separat persisterad kö eller nytt resursregelsystem införs.

## RTS-130 – Vad bemanningen räknar

Visa spelarens tilldelade och faktiskt samlande workers, inte fiendens antal. Gemensam serviceadmission tar dock hänsyn till fiendens arbetare. Leverans behåller assigned men räknas inte som gathering; full last, resa och kö räknas inte som aktiv gathering. Counts härleds, sparas inte och döljs utanför vision.

## RTS-131 – Storlek och sökbudget

Behåll32px tiles/world-pixelkoordinater.96/128 tiles ger3072/4096px. Två enkla Plains-layouter verifierar storleksstöd; detaljerad strategisk terräng införs separat. Höj befintlig BFS-budget till16384, högst ett besök per cell på största stödda karta, eftersom4096 gav falska unreachable på nåbara stora omvägar. Mät före optimering: routep95≤100ms, update/renderp95≤16.7ms, RAFp95≤33.4ms för dokumenterad liten baseline. Ingen renderoptimering behövdes;1920/128-kartan ligger nära RAF-gränsen och garanterar inte60FPS. Save-config21 migrerar20 utan modellegenskapsbyte; nya kartor kan inte utges för äldre saves.

## RTS-132 – Egen landgeografi och kartanpassad AI

Highland96×96 använder tre160px/bredare passager i en128px bergsrygg. Åtta noder ligger utanför terrängblockers, med rimligt basbyggutrymme och ändliga lager. Map-config kan ange enemyMuster; annars gäller äldre default. Sista scout/anfallspunkt måste både vara walkable och kunna leda till upptäckt av spelarbas, inte bara ligga nära på minimap. Config22 migrerar21. Referenser granskas geografiskt och återanvänds aldrig som spelassets/layoutkopior.

Byggkandidater och samlingspunkt är karta-specifika där startzonen flyttats. Spawnkontroller använder aktuell värld, inte bootstrap-världens gamla1280×960-gräns. Connectivity-frågor får stanna vid första giltiga route; själva arbets-/stridsrutterna fortsätter välja tidigare bästa kontaktpunkt.

## RTS-133 – Shattered Coast

Behåll128×128/32px tiles och befintlig naval/cargo-modell. Coast använder uttrycklig enemyNaval-profil med samma första hamn-/överfartskoordinater som Islands; detta behåller verifierad invasionslogik medan kartan öppnar längre resursresor. Endast kartor med denna profil får naval-state i Save23.22 migreras utan ändrad ekonomi eller state; ny Coast kan inte utges för äldre saves.

## RTS-134 – Fraktionsdesign

Bevara crown/clans som stabila ID:n för Humans/Orcs; elves/dwarves/goblins är nya identiteter. Fraktionsmatrisen i GAME_DESIGN.md anger initiala kostnader/stats/prerequisites för25 units, fem building-rosters, attack/defense-research och fleet. Specialist är en separat roll med melee/projectileprofil, inte ett nytt magisystem. Nya buffs återanvänder befintliga self-buff-regler. Siege kräver färdig researchbyggnad; specialist också vald research1. Befintliga betalda jobb grandfatheras via kontrollerad migration, nya jobs kontrolleras atomiskt. Balansvärden verifieras vid respektive implementation, inga nya factions anses spelbara genom designen.

## RTS-135 – Roster-admission och stabila wire-ID:n

Utöka befintliga configobjekt och återanvänd queue/order/combat; inför inget generellt tech-tree-system. Prerequisites är enkla building/research-listor som kontrolleras atomiskt vid enqueue. Avslutade levande byggnader och färdig research räknas; in-progress jobb räknas inte. Godkända produktionsjobb behåller sin betalning och fortsätter efter prerequisite-förlust.

Specialist är en Soldier-archetype med datastyrd melee eller projectile/splash och ett befintligt art-alias tills egna assets införs. Publicerade rosters är oförändrade i135. Save24 använder explicita stabila typeId för egna mark-/sjöenheter inklusive passagerare, härledda från matchens stabila fraktions-ID och roll. Migration23 lägger till dem, loader avvisar felaktig identitet och runtime härleder profiler från matchen. Schema/lagringsslot är oförändrade. Enemy-arméns gamla asymmetriska grundprofil bevaras tills faktiskt rosterarbete; inga fem spelbara fraktioner hävdas genom denna grund.
