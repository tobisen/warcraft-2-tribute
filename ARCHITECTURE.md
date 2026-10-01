# Arkitektur

## Status och teknik

RTS-001 har implementerat en minimal bootstrap med Phaser 4.2.1, strict
TypeScript 7.0.2 och Vite 8.3.2. Appen körs i webbläsaren utan backend eller
konton. RTS-002 inför movement och RTS-003 klickselection; ansvarsfördelningen nedan
styr både nuvarande och kommande arbete.

## Ansvarsfördelning

- Tunna Phaser-scenes hanterar scenlivscykel, input och presentation.
- Gameplay-logik separeras från Phaser där praktiskt så att regler kan
  verifieras utan rendering.
- Stats definieras i enkla TypeScript-configobjekt. Inför inget modding- eller
  externt datasystem för detta.
- Grafik kan vara placeholders. Struktur och abstraktioner införs när aktuell
  task behöver dem, utan spekulativ refaktorering.

## Implementerad struktur

- [index.html](index.html) är Vites startpunkt med containern `#game`.
- [src/main.ts](src/main.ts) skapar Phaser.Game med automatisk renderer, en
  mörk bakgrund och en canvas på 800 × 600 pixlar.
- [src/scenes/BootScene.ts](src/scenes/BootScene.ts) visar en grön 24 × 24 px
  placeholder-enhet som startar vid (400, 300). Scenen kopplar högerklick till
  senaste målet via pointer.worldX/worldY endast när enheten är markerad.
  Vänsterklick uppdaterar selection och en gul ring visar markering och följer
  enheten. Scenen förhindrar canvasens kontextmeny och
  synkar rendering med gameplay-positionen. Inputlyssnaren tas bort vid shutdown.
- [src/gameplay/movement.ts](src/gameplay/movement.ts) är en ren funktion utan
  Phaser-beroende: normaliserad riktning × hastighet × delta i sekunder,
  begränsat till återstående avstånd. Samma start/mål och delta=0 är säkra.
- [src/config/unit.ts](src/config/unit.ts) anger hastighet 160 px/s och storlek 24 px.
- [src/gameplay/selection.ts](src/gameplay/selection.ts) hanterar selection och
  command-state utan Phaser. `selectAt` träfftestar enhetens kvadratiska yta vid
  aktuell world-position inklusive kanterna och ändrar bara selected.
  `commandMove` ersätter målet bara vid markering. Avmarkering bevarar ordern.
- [src/gameplay/selection.test.ts](src/gameplay/selection.test.ts) verifierar
  träffar, tom mark, command-spärr, målbyte och bevarad rörelse efter avmarkering.
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
bootstrap och scene. Canvasstorleken avgör inte kartans storlek.

## Koordinater och tid

Positioner och mål anges i world pixels. Framtida tiles är 32 × 32 px, men inget
grid finns. Scenen omvandlar Phasers delta till sekunder (`delta / 1000`);
movement använder delta-baserade steg utan fixed timestep. Funktionen arbetar
med ändliga positioner, icke-negativ hastighet och delta från scenen.
Nytt högerklick ersätter målet omedelbart när enheten är markerad. Enheten börjar
omarkerad. Avmarkering stoppar inte movement och ringen är inte en klickyta.
Det finns ingen dragselection, flerenhetsselection,
pathfinding, hinderhantering, karta, kameraimplementation, resurser eller AI.
Se [DECISIONS.md](DECISIONS.md).

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
