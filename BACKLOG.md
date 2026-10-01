# Backlog

## Current Focus

**RTS-007 – Train workers from base** — **Done**.

Ingen ny task är aktiv. Nästa föreslagna task är att avgränsa produktionsbyggnad;
ingen sådan implementation ingår här.

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


## RTS-004 – Drag selection and group commands

**Status:** Done.

**Verifierat 2026-10-01:** 36 tester passerade, inklusive alla 19 befintliga.
Typecheck och build passerade. Chromium verifierade klick, alla dragriktningar,
kantträff, tomt urval, skalad canvas-tröskel, ringar, gruppkommandon och bevarad
rörelse vid avmarkering. Inga fångade browserfel. Dragrektangeln granskades
visuellt. Tidigare bundle-varning kvarstår.

**Mål:** Markera och styra flera av tre synliga enheter med unika ID:n.

**Krav:** Bevara klickselection. Vänsterdrag visar en rektangel; vid release
ersätts selection med enheter vars centrum ligger inom rektangeln inklusive
kanten. Alla dragriktningar stöds. Drag under 5 screen pixels behandlas som
klick. Tom rektangel avmarkerar alla. Varje markerad enhet har en ring och
högerklick skickar samma move-command till alla markerade. Avmarkering bevarar
pågående rörelse. Selection-logik ska vara fristående från Phaser.

**Non-goals:** Shift-selection, formationer, collision avoidance, pathfinding,
kontrollgrupper och HUD. Enheter får överlappa vid samma mål.

**Acceptance criteria:** Tre enheter på separata startpositioner med unika ID:n;
klick och drag ersätter selection korrekt; tröskeln mäts i screen pixels;
ringar följer selection; gruppkommandon påverkar bara markerade enheter;
avmarkering bevarar order. Tester, typecheck, build och browserkontroll passerar.
Dokumentation beskriver faktisk implementation.

**Tester:** Alla dragriktningar, centrum på kant, flera/inga träffar,
ersatt selection, klick/drag-tröskel och kommandon bara till markerade.
Befintliga tester ska passera. Browserkontroll av klick, drag och gruppförflyttning.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md),
[GAME_DESIGN.md](GAME_DESIGN.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).


## RTS-005 – Simple wood gathering

Historisk slice: direkt kreditering har ersatts av leveransmodellen i RTS-006.

**Status:** Done.

**Verifierat 2026-10-01:** 50 tester passerade (14 gathering och 36 tidigare),
typecheck och build passerade. Chromium verifierade selection, approach,
gathering efter avmarkering, avbrott med move-order, återupptagen gathering,
faktisk uttömning av 100 wood och idle för alla arbetare. Saldotext och grå
uttömd nod granskades visuellt. Inga fångade browserfel. Tidigare bundle-varning kvarstår.

**Mål:** Befintliga placeholder-enheter fungerar som arbetare och samlar wood.

**Krav:** Synlig nod med 100 wood; högerklick på nod ger gather-order till
markerade arbetare. De går till noden och samlar inom 24 world pixels med
1 wood/sekund per arbetare. Wood krediteras direkt till gemensamt saldo.
Enkel text visar saldo och återstående mängd. Flera arbetare delar noden utan
negativ mängd; vid uttömning blir samlande arbetare idle. Ny move-order avbryter
gathering, avmarkering gör det inte. Gathering/order-state är Phaser-fristående
med numeriska inställningar i enkel config.

**Non-goals:** Bas, leverans, bärkapacitet, animationer, collision, pathfinding,
byggnader och ekonomi-UI utöver den begärda enkla texten.

**Acceptance criteria:** Hela flödet från selection och nodkommando till approach,
gathering, saldo och uttömning fungerar. Ingen insamling utanför räckvidden;
resursöverföring bevarar totalen och orderbyte fungerar. Tester, typecheck,
build och browserkontroll passerar. Direkt kreditering dokumenteras som
slicespecifik förenkling.

**Tester:** Räckvidd, mängd över tid/olika tidssteg, flera arbetare med begränsad
mängd, saldo kontra nodminskning, uttömning och orderbyte. Tidigare tester ska
passera. Browserkontroll av hela gather-flödet.

**Relevanta docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md),
[README.md](README.md), [DEV_LOG.md](DEV_LOG.md).


## RTS-006 – Base and wood delivery

**Status:** Done.

**Verifierat 2026-10-01:** Alla 61 tester, typecheck och build passerade.
Chromium verifierade sju turer per arbetare, uttömning av hela noden och
slutleverans med saldo 100 inom flyttalstolerans. Alla arbetare var idle med
last 0 efteråt, trots avmarkering. Bas, lasttext och sluttext granskades visuellt.
Inga fångade browserfel. Tidigare bundle-varning kvarstår.

**Mål:** Arbetare transporterar wood till en fast placeholder-bas.

**Krav:** Last högst 5 wood per arbetare. Gathering överför nod → last;
full last startar automatisk leverans. Inom 24 px från bascentrum överförs last
till saldo. Återgå till noden om wood finns. Vid uttömning levereras även
partiallast innan idle. Move avbryter loop men bevarar last; gather med full
last levererar först. Avmarkering påverkar inte loopen. Visa last vid arbetaren.
Phaser-fristående logik och numeriska värden i config.

**Non-goals:** Byggplacering, produktion, kostnader, fler resurser, pathfinding,
collision och manuell leveransorder.

**Acceptance criteria:** Synlig fast bas; saldo ökar bara vid leverans;
upprepade turer och slutleverans fungerar utan överfyllnad eller förlust.
Orderbyte och avmarkering bevarar last. Alla tester, typecheck, build och
browserkontroll av minst två turer samt uttömning passerar. Docs beskriver
leveransmodellen i stället för direkt kreditering.

**Tester:** Leverans först i räckvidd, full och delvis last, återgång och flera
turer, orderbyte/full last, totalbevarande mellan nod/laster/saldo. Tidigare
gathering-tester anpassas; andra tester ska passera.

**Relevanta docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md),
[README.md](README.md), [DEV_LOG.md](DEV_LOG.md).


## RTS-007 – Train workers from base

**Status:** Done.

**Verifierat 2026-10-01:** Alla 72 tester, typecheck och build passerade.
Chromium verifierade samla/leverera 20 wood, start med exakt kostnad, countdown,
spärrat dubbelklick, en ny idle/omarkerad arbetare efter produktion samt dess
selection, insamling och leverans. Knappinteraktion ändrade inte selection eller
order. Inga fångade browserfel. Knapp/countdown granskades visuellt.
Tidigare bundle-varning kvarstår.

**Mål:** Producera en arbetare från befintlig bas efter resursleverans.

**Krav:** Enkel knapp ”Träna arbetare – 20 wood”. Godkänd start kostar 20 wood
omedelbart och tar 5 gameplay-sekunder. En pågående produktion, ingen kö;
blockera start vid otillräckligt saldo eller upptagen bas. Visa återstående tid.
Spawn nära basen med unikt ID, tom last, idle och omarkerad. Nya arbetare
stöder befintlig selection, movement och gathering/leverans. Knappinteraktion
ska inte ändra selection eller ge order. Phaser-fristående produktion och configvärden.

**Non-goals:** Produktionsbyggnad, byggplacering, stridsenheter, produktionskö,
avbrytning/refund, rally point och population cap.

**Acceptance criteria:** Start blockerad/med exakt kostnad, countdown i gameplay-
tid, en spawn först vid färdig produktion; upprepade produktioner har unika ID:n.
Ny arbetare kan väljas och samla/leverera. Knappen är isolerad från spelinput.
Alla tester, typecheck, build och browserflödet samla → producera → välj → samla
passerar. Dokumentation beskriver implementationen.

**Tester:** Kostnad en gång, spärrar, spawn-tid/antal, olika tidssteg, unika ID:n
vid upprepning samt ny arbetares selection/gather/leverans. Alla befintliga tester.
Browserkontroll av hela flödet och knappens inputisolering.

**Relevanta docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md),
[README.md](README.md), [DEV_LOG.md](DEV_LOG.md).
