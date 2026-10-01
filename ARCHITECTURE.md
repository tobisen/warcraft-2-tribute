# Arkitektur

## Status och teknik

RTS-001 har implementerat en minimal bootstrap med Phaser 4.2.1, strict
TypeScript 7.0.2 och Vite 8.3.2. Appen körs i webbläsaren utan backend eller
konton. Gameplay finns ännu inte; ansvarsfördelningen nedan styr kommande arbete.

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
- [src/scenes/BootScene.ts](src/scenes/BootScene.ts) registrerar en tom scene.
  Den innehåller ingen gameplay, input, karta eller UI.
- [tsconfig.json](tsconfig.json) aktiverar strict och bundler-resolution samt
  typkontroll utan emittering. `skipLibCheck` hoppar över dependencies interna
  deklarationskontroll; projektkoden kontrolleras fortfarande med strict.
- [package.json](package.json) definierar dependencies och scripts;
  [package-lock.json](package-lock.json) låser installationen.
- [.gitignore](.gitignore) ignorerar dependencies, byggoutput och lokala loggar.

Vite använder standardinställningarna och behöver ingen separat configfil.
Ingen framtida systemstruktur eller gameplay-abstraktion har skapats. Scenes
är placerade separat från bootstrapen; gameplay-logik får en egen plats när
en task faktiskt inför den. Canvasstorleken avgör inga movement-beslut.

## Öppna frågor inför movement

Gridstorlek, koordinatmodell och tidsmodell är öppna beslut. Movement-tasken
måste ta ställning till dessa innan beroende beteende implementeras. Anta
inte ett visst grid, koordinatsystem eller fast/variabelt tidssteg nu.
Beslut och motiv ska registreras i [DECISIONS.md](DECISIONS.md).

## Verifiering

`npm run typecheck` kör `tsc --noEmit`. `npm run build` kör typkontroll och
`vite build`, med output i `dist/`. `npm run dev` startar lokal utveckling.
Installation görs med `npm ci`, se [README.md](README.md).

Bootstrapen verifieras genom browserkontroll av synlig canvas och runtime-fel.
Inga tester som speglar bootstrap-koden har skapats. Framtida gameplay-regler
ska ha relevanta beteendetester. Dokumentationsändringar verifieras genom
konsekvens och giltiga filreferenser.

Se [GAME_DESIGN.md](GAME_DESIGN.md) för MVP och [BACKLOG.md](BACKLOG.md) för scope.
