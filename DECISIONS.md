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
