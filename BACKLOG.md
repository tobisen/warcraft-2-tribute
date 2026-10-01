# Backlog

## Current Focus

**RTS-001 – Initialize project structure** — **Done**.

Ingen ny task är aktiv. Nästa föreslagna task är en första movement-
implementation. Konkretisera mål, krav, non-goals, acceptance criteria, tester
och docs samt lös relevanta öppna beslut innan den tasken påbörjas.

Denna fil styr arbetet. En task åt gången. Framtida tasks konkretiseras med
underlag i utvecklingsordningen movement → selection → resources → buildings
→ combat → AI. Ingen tidigare RTS-002–017-backlog har återskapats.

## RTS-001 – Initialize project structure

**Status:** Done.

**Verifierat 2026-10-01:** Installation med `npm ci`, `npm run typecheck` och
`npm run build` passerade. Lokal dev-start verifierades i Chromium: synlig
800 × 600-canvas, inga fångade runtime-, konsol- eller nätverksfel. Skärmbilden
granskades manuellt. Builden gav en icke-blockerande varning om bundle-storlek.

**Mål:** Etablera ett minimalt körbart projektskelett för det kommande spelet.
Tasken genomförs som separat implementation efter dokumentationsgrunden.

**Krav:**

- Initiera Phaser, strict TypeScript och Vite.
- Skapa en minimal webbläsarstart och tunn scene med placeholder-presentation.
- Lägg en enkel grund för separation mellan scene och framtida gameplay-logik,
  utan att implementera framtida system.
- Etablera och dokumentera kommandon för lokal utveckling, typkontroll och build.
- Bevara projektdokumentationen och anpassa den till faktisk struktur.

**Non-goals:** Movement, selection, gathering, buildings, combat och AI;
beslut om gridstorlek, koordinatmodell eller tidsmodell; färdig grafik;
save/load; multiplayer, backend, konton, procedural generation, modding och
deployment.

**Acceptance criteria:**

- Dokumenterad installation och lokal start fungerar från en ren checkout.
- En minimal Phaser-scene visas i webbläsaren utan rapporterade runtime-fel.
- TypeScript strict är aktiverat och typkontroll passerar.
- Produktionsbuild kan skapas med dokumenterat kommando; detta innebär ingen
  deployment.
- README beskriver verifierade kommandon och ARCHITECTURE faktisk struktur.
- Relevanta checks och manuell verifiering är redovisade; backlog och dev log
  är uppdaterade enligt Definition of Done i [AGENTS.md](AGENTS.md).

**Tester och verifiering:** Kör etablerad typkontroll och build, gör en manuell
smoke check av browserstarten och kontrollera dokumentationens filreferenser.
Lägg beteendetester om tasken inför logik som behöver dem; skapa inga tomma
tester eller tester som enbart speglar konfigurationen.

**Relevanta docs:** [README.md](README.md), [AGENTS.md](AGENTS.md),
[GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md),
[DECISIONS.md](DECISIONS.md) och [DEV_LOG.md](DEV_LOG.md).
