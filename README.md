# warcraft-2-tribute

Browserbaserat singleplayer-RTS inspirerat av Warcraft 2, Age of Empires 2
och Command & Conquer. Projektet är local-first och prioriterar gameplay före
grafik. Placeholders är tillåtna.

Planerad teknik: Phaser, strict TypeScript och Vite. Repot innehåller för
närvarande projektdokumentation; spelkod, dependencies och körkommandon är ännu
inte införda. Setup och verifierade kommandon dokumenteras när RTS-001 genomförs.

MVP omfattar en karta, drag selection, move commands, gathering, en bas, en
produktionsbyggnad, en stridsenhet, enkla fiendevågor samt win/loss.
Utvecklingsordningen är movement → selection → resources → buildings → combat → AI.

## Dokumentation

- [AGENTS.md](AGENTS.md): arbetsregler och Definition of Done.
- [GAME_DESIGN.md](GAME_DESIGN.md): spelidé, MVP och avgränsningar.
- [ARCHITECTURE.md](ARCHITECTURE.md): planerad struktur och tekniska principer.
- [BACKLOG.md](BACKLOG.md): styrande tasks och Current Focus.
- [DECISIONS.md](DECISIONS.md): beslut och öppna frågor.
- [DEV_LOG.md](DEV_LOG.md): genomfört arbete och verifiering.
- [Implementer](.agents/implementer.md), [Reviewer](.agents/reviewer.md) och
  [Finisher](.agents/finisher.md): rollinstruktioner.

Nästa steg är **RTS-001 – Initialize project structure**. Rollfilerna är
instruktioner och konfigurerar inte automatiskt några agenter.

Multiplayer, backend, konton, procedural generation, modding och deployment
ingår inte. Save/load planeras efter MVP.
