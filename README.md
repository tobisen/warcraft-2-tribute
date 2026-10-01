# warcraft-2-tribute

Browserbaserat singleplayer-RTS inspirerat av Warcraft 2, Age of Empires 2
och Command & Conquer. Projektet är local-first och prioriterar gameplay före
grafik. Placeholders är tillåtna.

Teknik: Phaser, strict TypeScript och Vite. RTS-001 har etablerat en minimal
bootstrap med en tom Phaser-scen. Ingen gameplay är implementerad ännu.

## Installation och lokal utveckling

Använd Node.js 20.19+ inom version 20, eller 22.12+ och npm. Kravet följer
[Vites Node-stöd](https://vite.dev/guide/). Kör från repots rot:

```sh
npm ci
npm run dev
```

Öppna adressen Vite skriver ut (normalt http://localhost:5173/). Startsidan
visar en tom mörk Phaser-canvas på 800 × 600 pixlar. Storleken är en tillfällig
presentationsstorlek, inte ett beslut om karta, grid eller koordinatmodell.

```sh
npm run typecheck
npm run build
```

`typecheck` kontrollerar projektkoden med strict TypeScript utan att skriva
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

RTS-001 är Done. Nästa föreslagna task är att konkretisera första movement-
implementationen och dess öppna beslut i BACKLOG.md; den är inte implementerad.
Rollfilerna är instruktioner och konfigurerar inte automatiskt några agenter.

Multiplayer, backend, konton, procedural generation, modding och deployment
ingår inte. Save/load planeras efter MVP.
