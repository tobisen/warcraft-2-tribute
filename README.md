# warcraft-2-tribute

Browserbaserat singleplayer-RTS inspirerat av Warcraft 2, Age of Empires 2
och Command & Conquer. Projektet är local-first och prioriterar gameplay före
grafik. Placeholders är tillåtna.

Teknik: Phaser, strict TypeScript och Vite. Bootstrapen har nu en första
spelbar movement-slice med tre synliga placeholder-enheter.

## Installation och lokal utveckling

Använd Node.js 20.19+ inom version 20, eller 22.12+ och npm. Kravet följer
[Vites Node-stöd](https://vite.dev/guide/). Kör från repots rot:

```sh
npm ci
npm run dev
```

Öppna adressen Vite skriver ut (normalt http://localhost:5173/). Startsidan
visar en mörk Phaser-canvas på 800 × 600 pixlar med tre gröna enheter.
Vänsterklicka på en enhet eller vänsterdra en rektangel för att ersätta
markeringen. Markerade enheter får gula ringar. Högerklicka sedan på canvas
för att flytta alla markerade enheter till samma mål med 160 px/s.
Ett nytt högerklick ersätter tidigare mål, även under rörelse. Vänsterklick på
tom mark avmarkerar utan att stoppa rörelsen. Omarkerade enheter ignorerar nya
move-commands. Kontextmenyn är förhindrad över canvas.
Markera arbetare och högerklicka på den bruna noden vid (650, 180) för att samla
wood (100 initialt, 1 per sekund och arbetare inom 24 px). Arbetarna bär högst 5 wood,
levererar automatiskt inom 24 px från den blå basen vid (400, 450) och återgår
till noden. Saldo ökar först vid leverans; last visas vid arbetarna. Move-order
avbryter loopen men bevarar last, avmarkering påverkar inte loopen. Vid uttömning
levereras partiallast innan idle.
Efter leverans av minst 20 wood: klicka ”Träna arbetare – 20 wood”. Kostnaden
dras direkt och en arbetare skapas nära basen efter 5 gameplay-sekunder.
Endast en produktion pågår åt gången. Markera den nya arbetaren för nya order;
produktionsknappen ändrar inte selection. Återstående tid visas vid knappen.
Canvasstorleken är tillfällig; inget kart- eller gridsystem finns.

```sh
npm test
npm run typecheck
npm run build
```

`test` kör movement-, selection-, gathering-, delivery- och production-unit-tester en gång med Vitest i Node, utan browser.
`typecheck` kontrollerar projektkoden och testerna med strict TypeScript utan att skriva
filer. `build` kör först typkontroll och skapar sedan byggoutput i `dist/`.
`node_modules/` och `dist/` ignoreras av Git. Paketversioner låses med
`package-lock.json`. Builden kan ge en varning om stor bundle eftersom Phaser
ingår; varningen är dokumenterad och builden passerar.

MVP omfattar en karta, drag selection, move commands, gathering, en bas, en
produktionsbyggnad, en stridsenhet, enkla fiendevågor samt win/loss.
Utvecklingsordningen är movement → selection → resources → buildings → combat → AI.

## Dokumentation

- [AGENTS.md](AGENTS.md): arbetsregler och Definition of Done.
- [GAME_DESIGN.md](GAME_DESIGN.md): spelidé, MVP och avgränsningar.
- [ARCHITECTURE.md](ARCHITECTURE.md): faktisk struktur och tekniska principer.
- [BACKLOG.md](BACKLOG.md): styrande tasks och Current Focus.
- [DECISIONS.md](DECISIONS.md): beslut och öppna frågor.
- [DEV_LOG.md](DEV_LOG.md): genomfört arbete och verifiering.
- [Implementer](.agents/implementer.md), [Reviewer](.agents/reviewer.md) och
  [Finisher](.agents/finisher.md): rollinstruktioner.

RTS-007 är Done. Nästa föreslagna task är att avgränsa produktionsbyggnad
enligt utvecklingsordningen; den är inte implementerad.
Rollfilerna är instruktioner och konfigurerar inte automatiskt några agenter.

Multiplayer, backend, konton, procedural generation, modding och deployment
ingår inte. Save/load planeras efter MVP.
