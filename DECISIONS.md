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
