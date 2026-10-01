# warcraft-2-tribute

Browserbaserat singleplayer-RTS inspirerat av Warcraft 2, Age of Empires 2
och Command & Conquer. Projektet är local-first och prioriterar gameplay före
grafik. Placeholders är tillåtna.

Teknik: Phaser, strict TypeScript och Vite. En spelbar singleplayer-match
med ekonomi, produktion, manuell melee och tre enemy-waves använder placeholders.

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
wood (400 initialt, 1 per sekund och arbetare inom 24 px). Arbetarna bär högst 5 wood,
levererar automatiskt inom 24 px från den blå basen vid (400, 450) och återgår
till noden. Saldo ökar först vid leverans; last visas vid arbetarna. Move-order
avbryter loopen men bevarar last, avmarkering påverkar inte loopen. Vid uttömning
levereras partiallast innan idle.
Efter leverans av minst 20 wood: klicka ”Träna arbetare – 20 wood”. Kostnaden
dras direkt och en arbetare skapas nära basen efter 5 gameplay-sekunder.
Endast en produktion per byggnad pågår åt gången. Markera den nya arbetaren för nya order;
produktionsknappen ändrar inte selection. Återstående tid visas vid knappen.
”Bygg barracks – 40 wood” öppnar placeringsläge. Flytta musen för grön/röd
preview och klicka på en giltig plats för att bygga direkt. Escape eller
högerklick avbryter gratis. 64 × 64 px footprint snappar till 32 px-grid;
placera inom världen utan överlapp med bas/nod. Högst en barracks.
Efter placering: ”Träna soldier – 20 wood” producerar en orange soldier på
5 gameplay-sekunder. Bas och barracks kan producera samtidigt. Markera den
nya soldaten och högerklicka för movement. Soldiers kan inte samla wood;
resursklick med blandad selection ger bara workers gather-order.
Markera soldier och högerklicka på en röd enemy för manuell melee-attack.
HP visas och fiender försvinner vid 0 HP. Move ersätter attack.
Arenan är 800 × 600 utan hinder. Tre enemy-waves med 1, 2 och 3 fiender
kommer efter 60, 90 och 120 gameplay-sekunder; countdown visas. Samla och
producera försvar innan första vågen. Basens HP 0 ger Defeat och stoppar
simulation samt gameplay-input. Besegra alla enemies efter sista vågen för
Victory; defeat har företräde vid samtidig utgång. Ge soldiers ett nytt
attackmål efter varje död. ”Starta om” visas efter vinst/förlust och
återställer hela matchen utan sidomladdning. Inget movement-grid finns.

```sh
npm test
npm run typecheck
npm run build
```

`test` kör movement-, selection-, gathering-, delivery-, production-, placement-, combat-, wave- och match-tester en gång med Vitest i Node, utan browser.
`typecheck` kontrollerar projektkoden och testerna med strict TypeScript utan att skriva
filer. `build` kör först typkontroll och skapar sedan byggoutput i `dist/`.
`node_modules/` och `dist/` ignoreras av Git. Paketversioner låses med
`package-lock.json`. Builden kan ge en varning om stor bundle eftersom Phaser
ingår; varningen är dokumenterad och builden passerar.

MVP omfattar en karta, drag selection, move commands, gathering, en bas, en
produktionsbyggnad, en stridsenhet, enkla fiendevågor samt win/loss.
Utvecklingsordningen är movement → selection → resources → buildings → combat → AI.

## Spela matchen

1. Dragmarkera startarbetarna och högerklicka på wood-noden för automatisk
   insamling/leverans. Låt dem fortsätta arbeta när du avmarkerar.
2. Bygg barracks för 40 wood, exempelvis vid (512, 384), och träna flera
   soldiers för 20 wood och 5 sekunder vardera. Första vågen kommer efter 60 s.
3. Markera soldiers och högerklicka på enemies. Ge nästa attackmål efter varje
   fiendedöd. Waves innehåller 1/2/3 enemies efter 60/90/120 s.
4. Besegra alla sex enemies för victory; bas-HP 0 ger defeat. Klicka ”Starta om”
   efter game over för en ny match.

Workers och barracks angrips inte. Soldiers angriper endast på kommando.
Rak movement tillåter överlapp; ingen pathfinding, collision avoidance,
formation eller avancerad AI finns. Bundle-varningen kvarstår.

## Dokumentation

- [AGENTS.md](AGENTS.md): arbetsregler och Definition of Done.
- [GAME_DESIGN.md](GAME_DESIGN.md): spelidé, MVP och avgränsningar.
- [ARCHITECTURE.md](ARCHITECTURE.md): faktisk struktur och tekniska principer.
- [BACKLOG.md](BACKLOG.md): styrande tasks och Current Focus.
- [DECISIONS.md](DECISIONS.md): beslut och öppna frågor.
- [DEV_LOG.md](DEV_LOG.md): genomfört arbete och verifiering.
- [Implementer](.agents/implementer.md), [Reviewer](.agents/reviewer.md) och
  [Finisher](.agents/finisher.md): rollinstruktioner.

RTS-001–015 är Done. MVP-matchen omfattar ekonomi/produktion, combat, enemy AI,
ändliga waves, win/loss och restart; verifiering följs i BACKLOG.
Rollfilerna är instruktioner och konfigurerar inte automatiskt några agenter.

Multiplayer, backend, konton, procedural generation, modding och deployment
ingår inte. Save/load planeras efter MVP.
