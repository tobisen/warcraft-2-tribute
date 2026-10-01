# Arkitektur

## Status och teknik

RTS-001 har implementerat en minimal bootstrap med Phaser 4.2.1, strict
TypeScript 7.0.2 och Vite 8.3.2. Appen körs i webbläsaren utan backend eller
konton. RTS-002 inför movement, RTS-003 klickselection och RTS-004 dragselection/gruppkommandon; ansvarsfördelningen nedan
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
- [src/scenes/BootScene.ts](src/scenes/BootScene.ts) skapar tre gröna placeholders
  (24 × 24 px) med ID unit-1, unit-2 och unit-3 vid (280, 300), (400, 300) och
  (520, 300). Varje enhet har position, mål och selected-state separat från
  renderobjekten, som kopplas via en Map med ID som nyckel.
  Scenen adapterar pointer-input, visar dragrektangel och ringar, konverterar
  delta till sekunder och synkar rendering. Inputlyssnare tas bort vid shutdown.
- [src/gameplay/movement.ts](src/gameplay/movement.ts) är en ren funktion utan
  Phaser-beroende: normaliserad riktning × hastighet × delta i sekunder,
  begränsat till återstående avstånd. Samma start/mål och delta=0 är säkra.
- [src/config/unit.ts](src/config/unit.ts) anger hastighet 160 px/s och storlek 24 px.
- [src/gameplay/selection.ts](src/gameplay/selection.ts) hanterar selection och
  kommandon utan Phaser. Klick använder kvadratisk träffyta och ersätter selection
  med en enhet; vid överlapp väljs sist renderade enheten. Dragrektangeln
  normaliseras med min/max och väljer centrum inklusive kanten. Tomt urval
  avmarkerar alla. Gruppkommandon ändrar mål enbart på markerade enheter.
  De befintliga selectAt/commandMove-reglerna återanvänds och testas fortsatt.
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
bootstrap och scene. Canvasstorleken avgör inte kartans storlek.

## Koordinater och tid

Positioner och mål anges i world pixels. Framtida tiles är 32 × 32 px, men inget
grid finns. Scenen omvandlar Phasers delta till sekunder (`delta / 1000`);
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
HUD, pathfinding, hinderhantering, karta, kameraimplementation, resurser eller AI.
Enheterna kan överlappa vid samma mål.
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
