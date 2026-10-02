# warcraft-2-tribute

Browserbaserat singleplayer-RTS inspirerat av Warcraft 2, Age of Empires 2 och
Command & Conquer. Phaser, strict TypeScript och Vite; local-first, gameplay
före grafik. Implementerat genom RTS-036 med placeholder-grafik.

## Installation och lokal start

Använd Node.js 20.19+ inom version 20, eller 22.12+ och npm:

```sh
npm ci
npm run dev
```

Öppna adressen Vite skriver ut, normalt http://localhost:5173/.
Världen är 1280 × 960 px, viewport 800 × 600. Dra med mittenmusknappen för
begränsad pan; zoom är 1. HUD ligger ovanför canvas och följer inte kameran.
Små fönster kan scrollas.

## Spela matchen

1. Välj två gröna workers och högerklicka på wood-noden vid (650,180).
   Välj den tredje, pan åt höger och högerklicka på guldgruvan vid (850,220).
   Workers samlar och levererar automatiskt till den blå basen vid (400,450).
2. Vid 40 levererade wood: välj en worker och ”Bygg barracks – 40 wood”. Placera grön
   preview, exempelvis vid (512,384) om platsen är fri. Escape/högerklick avbryter.
3. Efter 5 s byggarbete: ge builder ny gather-order. Välj barracks och träna orange soldiers för 20 wood + 5 gold och 5 gameplay-
   sekunder vardera. Välj basen för workers för 20 wood och 5 s. Tre FIFO-jobb per
   byggnad inklusive aktivt; bas och barracks kan producera samtidigt.
4. Välj soldiers och högerklicka på röda enemies för manuell attack. Ge nästa
   mål efter varje fiendedöd. Tre waves med 1/2/3 enemies anländer vid
   60/90/120 gameplay-sekunder. Träna förstärkningar vid förluster.
5. Alla enemies döda efter sista wave ger Victory; basens HP 0 ger Defeat.
   Defeat har företräde vid samtidig utgång. Simulation och gameplay-input
   stoppas; ”Starta om” återställer hela matchen, inklusive kamera och rally.

Vänsterklick väljer en unit eller bas/barracks. Units har företräde vid
överlapp; byggnadsval och unit-selection är exklusiva. Tom mark avmarkerar.
Drag ersätter selection med units vars centrum ligger i rektangeln, inklusive
kanten. Gester under 5 screen pixels är klick. Ringar/byggnadsram visar val.

Högerklick på mark med valda units ger separata nåbara slutpositioner kring
klickmålet med 160 px/s. Ny order ersätter föregående; avmarkering stoppar inte
rörelse/arbete. Stop avbryter valda units men bevarar last. Gul målring visar
aktiv order, röd ring blockerad route; HUD visar fas och felorsak.

Högerklick med vald bas/barracks sätter dess rally för framtida units. Grön
markör visar målet. Ogiltigt mål behåller föregående rally. Spawnade units
börjar omarkerade; utan rally är de idle, annars får de move. Worker-rally
innebär ingen automatisk gathering.

Wood-noden innehåller 400 wood, gruvan 300 gold. Rate är 1/s, lastkapacitet 5;
leverans/gathering sker inom 24 px från footprintens kant. Full last går till
basen; depletion levererar även partiallast. Saldo ökar först vid leverans.
Last innehåller en enda resurstyp. Byte typ med last levererar gammal last
först och går sedan till nya noden. Move/Stop bevarar last och typ. Soldiers
samlar inte; resource-klick i blandad selection ändrar endast workers-orders.

32-px-tiles visar grön mark, grå sten och blått vatten. Move, arbete och melee
använder kroppssäkra rutter runt terräng/byggnader. Attackrange mäts till
målfootprintens kant; skada går inte genom terrängväggar. Barracks är 64 × 64,
grid-snappad och får inte överlappa footprints/levande units eller skära av
tidigare nåbara arbets-/spawn-/wave-vägar. Ogiltig placering drar inga resurser.
Alla kostnader kontrolleras atomiskt; preview/cancel är gratis. Högst en barracks.
Om spawn-utgångar är upptagna väntar färdigt jobb på fri plats utan ny kostnad.

Workers, bas, barracks, farms och projekt kan angripas. Worker-cargo förloras
vid död; byggnadsdöd ger ingen refund och tar bort kö/rally/footprint. Soldiers angriper endast på kommando.
Units kan överlappa under gång; ingen full collision avoidance, avancerad AI,
ljud eller save/load finns. Balansen är preliminär; verifierade flöden finns i DEV_LOG.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

Vitest testar rena gameplay-/presentationregler i Node. Typecheck kör strict
TypeScript; build kontrollerar typer och skriver till `dist/`. Dependencies
låses i package-lock; `node_modules/` och `dist/` ignoreras. Den befintliga
varningen om stor Phaser-bundle kvarstår. Ingen deployment.

## Dokumentation

- [AGENTS.md](AGENTS.md): arbetsregler och Definition of Done.
- [BACKLOG.md](BACKLOG.md): tasks till RTS-060 och Current Focus.
- [GAME_DESIGN.md](GAME_DESIGN.md): regler och framtida mål.
- [ARCHITECTURE.md](ARCHITECTURE.md): faktisk struktur.
- [DECISIONS.md](DECISIONS.md): beslut och öppna frågor.
- [DEV_LOG.md](DEV_LOG.md): checks, speltester och märkta fixtures.
- [Implementer](.agents/implementer.md), [Reviewer](.agents/reviewer.md) och
  [Finisher](.agents/finisher.md): rollinstruktioner, inte automatiska agenter.

Nästa task är RTS-037, archer och projektiler. Multiplayer, backend,
konton, procedural generation, modding och deployment ingår inte.

RTS-031: välj worker innan placering. Barracks reserveras direkt och kräver
5 s arbete efter approach. Stop/ny order pausar utan refund. Högerklicka
ofärdigt bygge med vald worker för att återuppta; produktion kräver completion.
Builder blir idle när färdig – ge ny gather-order.

Population börjar på 3/8. Varje unit använder 1 och ett pågående jobb
reserverar 1. Vid full cap: välj worker och ”Bygg farm – 20 wood”; färdig farm
ger +5 efter 5 s arbete, högst tre farms. Stop/orderbyte pausar; högerklick
ofärdig farm återupptar. Godkända jobb och levande units behålls vid over-cap.

Produktionspanelen avbryter ett specifikt jobb: köat får 100 % återbetalning,
aktivt 50 %. Kostnad/population reserveras vid enqueue. Blockerad spawn
håller head och senare timers; cancel frigör plats. Game over låser cancel.

Idle soldiers försvarar automatiskt inom 140 px och fortsätter mot nästa
nåbara enemy. Högerklick på enemy ger prioriterad manuell attack. Stop håller
utan automatisk attack tills nytt Move/attack; vanlig Move avbryter striden.

## RTS-036 – Attack-move

Välj soldiers, tryck Attack-move och vänsterklicka destination. Enheter får
separata gruppmål, söker samma giltiga enemies som automatisk attack och
återupptar sina ursprungliga mål efter strid. Workers behåller arbete.
Stop, vanlig Move och manuell attack ersätter hela ordern. Escape/högerklick
avbryter väntande destination utan att ändra selection/orders. Blockerad
destination avslutar ordern med befintligt route-fel; game over spärrar input
och restart rensar både gameplay-state och kommandoläge.
