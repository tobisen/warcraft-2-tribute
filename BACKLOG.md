# Backlog

## Current Focus

**RTS-003 – Click selection** — **Done**.

Ingen ny task är aktiv. Nästa föreslagna task är att avgränsa dragselection;
den är inte implementerad här.

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

## RTS-002 – First playable movement slice

**Status:** Done.

**Verifierat 2026-10-01:** `npm test` (9 tester), `npm run typecheck` och
`npm run build` passerade. Chromium-kontroll verifierade högerklick,
ersatt mål under rörelse, exakt stopp, att vänsterklick inte ger kommando
och att kontextmenyn förhindras. Inga fångade browserfel. Skärmbilden granskades.
Buildens tidigare varning om bundle-storlek kvarstår och blockerar inte build.

**Mål:** Spelaren kan styra en synlig placeholder-enhet till ett nytt mål.

**Krav:**

- Högerklick på canvas anger mål i world pixels och ersätter föregående mål.
- Enheten rör sig rakt mot målet med hastighet i pixlar/sekund och delta i
  sekunder; stanna exakt vid målet utan overshoot.
- Förhindra kontextmenyn över canvas. Håll scenen tunn och movement-logiken
  fristående från Phaser.
- Dokumentera world pixels, framtida tiles 32 × 32 px och delta-baserad
  movement utan fixed timestep. Inför inget gridsystem.
- Inför en enkel unit-testlösning och dokumentera testkommandot.

**Non-goals:** Selection, pathfinding, hinder, karta, resurser, kamera, AI,
gridsystem, fixed timestep och save/load.

**Acceptance criteria:**

- En synlig enhet flyttar sig vid högerklick och följer ett nytt mål när
  kommandot ändras under rörelse. Kontextmenyn visas inte över canvas.
- Movement följer riktning och hastighet oberoende av uppdelning i tidssteg,
  hanterar samma start/mål och delta=0 samt stannar utan overshoot.
- Unit-tester, typecheck och build passerar. Browserkontroll redovisas ärligt.
- README, ARCHITECTURE, DECISIONS och DEV_LOG beskriver faktisk implementation.

**Tester:** Riktning/hastighet, stopp utan overshoot, samma start/mål,
delta=0 och motsvarande rörelse över olika tidssteg. Browser-smoke check av
högerklick, målbyte och förhindrad kontextmeny om miljön tillåter.

**Relevanta docs:** [AGENTS.md](AGENTS.md), [README.md](README.md),
[ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md),
[DEV_LOG.md](DEV_LOG.md).

## RTS-003 – Click selection

**Status:** Done.

**Verifierat 2026-10-01:** Alla 19 tester (10 selection, 9 movement),
typecheck och build passerade. Chromium verifierade omarkerad start, klickträff,
ring som följer enheten, kommandon endast vid markering, målbyte, avmarkering
utan stopp och återmarkering på ny position. Inga fångade browserfel.
Ringens skärmbild granskades. Tidigare bundle-varning kvarstår.

**Mål:** Markera den befintliga enheten med klick och ge kommandon till den.

**Krav:** Enheten börjar omarkerad. Vänsterklick på enheten markerar och visar
en enkel ring; vänsterklick på tom mark avmarkerar. Högerklick ger endast
move-command när enheten är markerad. Avmarkering ändrar inte pågående order.
Behåll målbyte och movement-beteende; håll selection-state fristående från
Phaser där praktiskt.

**Non-goals:** Dragselection, flera enheter, shift-selection, grupper och HUD.

**Acceptance criteria:** Klickträff markerar, tom mark avmarkerar och ringen
följer enheten endast när den är markerad. Omarkerad enhet tar inte emot nya
move-commands men fortsätter sin befintliga rörelse. Markerad enhet kan byta
mål. Tester, typecheck, build och browserkontroll passerar och docs uppdateras.

**Tester:** Klickträff/tom mark, kommandon kräver markering och avmarkering
bevarar move-order. Befintliga movement-tester ska fortsätta passera.
Browserkontroll av klick, ring, målbyte och rörelse efter avmarkering.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md),
[GAME_DESIGN.md](GAME_DESIGN.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).
