# Backlog

## Current Focus

**Aktuellt kartmandat RTS-191–194:** Fyra beställda kartförbättringar, en i taget. Frontier träd/gruva/berg färdigställs och browsergranskas först. Taskvisa checks/docs/commit/push till origin/main. Bevara style.css/docs; ingen delegering. Stanna efter194. Tidigare grafikfas är historisk status.

**Nytt grafik-/layoutmandat RTS-188–190:** Användaren beställer tydligare spelyta, bättre fullständig enhets-/byggnadsgrafik inklusive flyg och roligare djur. En task i taget med browser/checks/docs/commit/push. Bevara style.css/docs och gameplay/balans/Save. Ingen delegering.188 push0779d8b,189 push9af4724,190 Done; etappen avslutas här. Full regression1497/180, unit476/86, strict build/diff och browser PASS. HANDOFF styr överlämningen; inga nya tasks.

### RTS-191 — Individuellt skördbara skogsträd — Done
- Ersätt dekorativa skogskronor i nya matcher med individuella resurser: stabilt ID, position, wood, selection och högerklicksorder.
- Nåbara arbetsplatser, tät blockerande skog, tydlig onåbarhet; uttömning öppnar collision/navigation och visar stubbe. Nåbart nästa träd, befintlig last/leverans, fog och strikt Save-kompatibilitet.
- Frontier först; riktade flera-träd/workers/uttömning/passage/Save-tester och browser. Gemensamt underlag för övriga kartor i193. Ingen separat tung per-träd-tick.

### RTS-192 — Detaljerad gruva och sammanhängande berg — Done
- Frontier först: egna större gruvassets med entré, klippvolym/material och konsekvent ljus. Klickyta följer motiv; workers/entré nåbara och synliga, korrekt djupsortering.
- Separera visuell storlek från footprint; ändra collision endast vid behov med navigation/byggbarhetsbelägg. Selection visar stock. Före/efter och browser i faktisk spelstorlek.

### RTS-193 — Gemensam terräng på alla spelkartor — In Progress
- Inventera nio skirmishkartor och kampanjens faktiska kartval. Sprid Frontiers gräs/jord/skog/kust/vatten/gruva/berg med individuella träd; bevara layout och strategisk variation.
- Grafik/collision/byggbarhet/land och sjö stämmer; riktade navigation/objective-tester och visuell browsergranskning.

### RTS-194 — Minst128×128 spelbara tiles på alla kartor — Todo
- Befintligt maximum Plains128/Shattered Coast:128×128 tiles,4096×4096px,32px tiles. Utvidga mindre kartors verkliga terräng med meningsfulla expansioner, skogar, vägar, kust och passager.
- Anpassa starts/resurser/AI/kamera/minimap; bevara introduktion/missionsmål/triggers, verifiera koordinater och Save-version. Ingen skalning av tiles/sprites eller tom utfyllnad.
- Stor tät skog/flera workers prestandamäts; samlade slutchecks och BACKLOG/DECISIONS/DEV_LOG/HANDOFF. Taskvis commit/push; stanna efter194 utan nya tasks/karteditor.

### RTS-188 — Frigör spelytan — Done
- Ta bort permanent sidebar från matchlayout; karta använder hela bredden.
- Tech tree i undermeny under matchmenyn. Mission-knapp i top bar öppnar uppdrag, mål och status.
- Behåll actions, minimap, feedback, paus/fokus/Escape och live uppdragsuppdateringar. Fungerar Native800/1280/1920 och Fit.
- Non-goals: nya gameplayregler, ändring av användarens style.css, nya uppdrag.

### RTS-189 — Sammanhängande och komplett spelgrafik — Done
- Inventera samtliga fem fraktioners roster och byggnader; ersätt otillräckliga/saknade motiv med tydliga detaljerade sprites, även Gryphon/Wyvern/Eagle/Gyrocopter/Airship.
- Bevara riktningar, relevanta animationer, teamfärg, ankare, fog/selection/porträtt och logical footprints. Kontrollera alla motiv i spelbrowser; inga flygtextikoner som slutgrafik.
- Dokumentera källor/prompt/export och faktiska belägg. Non-goals: balans-/rosterändringar.

### RTS-190 — Livfulla djur — Done
- Ny särskiljbar design för deer/rabbit/fox med igenkännbara poser och befintlig idle/walk/jakt/skadad/död-presentation.
- Bevara interaktion, sparning, fog, ljud och gameplay. Visuell browserkontroll och riktade regressioner.
- Samlade slutchecks och HANDOFF efter190; inga nya tasks.

**AI-antalbugfix efter187:** Done. Extra knapp borttagen; dropdown1/2AI med förklarat Plains96-byte när tredje start saknas. Ny browser/native-popup, unit468/84, riktade97/4 och strict build/diff PASS. Inga nya roadmaptasks. CSS/docs bevaras.

**Dropdownbugfix efter186/187:** Done. Ras-/svårighetsmenyer bevarar native popup mellan bildrutor; inga senare roadmaptasks startas. Ny synlig Chrome800/1280-popupkontroll, separat värdepersistens, unit468/84 och strict build/diff PASS. Se DEV_LOG/HANDOFF för testmetodens begränsningar. CSS/docs bevaras.

**Nytt mandat RTS-182–187 (2026-10-05):** Bilagans sex meny-/kampanjuppgifter, en i taget med riktad/browser-verifiering, docs och commit/push. RTS-180 är historiskt Done/publicerad;181 redan Done.182 Done/push90df09f,183 Done/pushc3f691b,184 Done/push289cc9f,185 Done/push7b7e9fc,186 Done/pushae5e361 + beläggsf43688d,187 Done; fasen avslutad, inga nya tasks startas. Stanna efter187. CSS/docs bevaras.

**Aktuellt avgränsat uppdrag RTS-181:** Done. Startinställning1920×1080/Fit to Window. Tidigare180 Done enligt HANDOFF; historiska releasebelägg återanvänds endast som status. Bilagans bredare meny-/kampanjfas genomförs inte i denna avgränsade ändring. CSS/docs bevaras.

**Avslutad etapp RTS-177–180:**177 Done/push8fafce5;178 Done/push598478f;179 Done/push686c1e6;180 Done/release6a96227. Publicerad0.3.0/Build6a96227 och faktisk CI/Pages/browser PASS. Full regression1458/176, unit465/84, strict typecheck/build och diff PASS. HANDOFF/QUALITY_REVIEW redovisar återstående mänsklig tids-/balans-/ljudgranskning och assets. Stopp efter180; inga nya tasks eller karteditor. CSS/docs bevaras.

**Aktuellt mandat RTS-174–176:** Användaren återupptar174–176 efter färdiga PRIO-01–04.174 Done/push416cfa9;175 Done/push0a5b422,176 Done. Etappen avslutad; stanna före177. En task åt gången, riktade tester/browser, slutchecks/docs och commit/push. HANDOFF efter176; stopp före177. CSS/docs bevaras.

**Nytt prioriterat mandat PRIO-01–04:** RTS-174–176 pausade enligt användarens nya uppdrag. PRIO-01–04 Done. Användaren har godkänt kartorna och djurljuden tills resterande ljudarbete genomförs. En task åt gången, docs/checks/browser/commit/push; stopp efter04,174 startas inte. PRIO-03:s två bildreferenser är godkända; referenskarta verifieras före spridning. Användarens CSS/docs bevaras.

**CI-korrigering efter RTS-173 (2026-10-05):** Användaren rapporterar flera röda pushar. Senaste GitHub-jobbet fallerar enbart på femsekunderstimeout i factionArt-testet; äldre air-assertions är rättade i173. Samma uttömmande assetkontroller delas i16 faction/type/owner-fall, utan höjd timeout eller ändrade assets/runtime. Riktade17/1, unit450/79 och build/strict typecheck/diff PASS lokalt. Fix `b79d1fd` pushad. Ny [GitHub-fullregression/build/Pages-deploy](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37300780990) PASS; teststeget12m05s.174 startas inte.

**Aktuellt mandat RTS-170–173:** Nytt uttryckligt uppdrag ersätter stoppet efter169.170–173 Done; etappen avslutad före174. En task åt gången med riktade tester/browser, slutchecks, docs och commit/push till origin/main. Stopp efter173 med HANDOFF;174 startas inte.160–164 och165–169 återimplementeras inte. Befintlig style.css och otrackade docs/ bevaras.

**Nytt mandat RTS-165–169:**165 Done (`838f729`),166 Done (`2cd36a6`),167 Done (`fd9dfd3`),168 Done gameplay (`83d01fe`, pushad);169 Done som preliminärt första balanspass. Slutlig flygargrafik återstår separat. Användarens bifogade uppdrag för165–173 anger etappstopp efter169 och ny chatt170–173.160–164 är verifierade och pushade;164 `874f761`. Befintliga ändringar bevaras.

**UI-BUGFIX-BOTTOM-BAR – Horisontell bottom bar** — **Done** (2026-10-04).
Separat beställd UI-bugfix; befintliga RTS-ID:n/statusar bevaras. Uppdraget
avslutas efter denna fix; ingen senare roadmap-task startas.

- Grundorsak verifierad i ursprunglig browser-DOM: actiongrupper var vertikala
  flexkolumner; workerpanelen hade scrollHeight323/clientHeight150 vid800×600.
  Kön låg på separat rad och automatiska selectionbredden pressade actions.
- En explicit CSS Grid-rad: selection | orders | build/train/research | kö,
  med en femte reserverad minimapkolumn.160px hög, min-width:0, kompakta
  ikonknappar i flerkolumnsgrid. Långa beskrivningar/kostnader/spärrar i tooltips;
  inga interna scrollområden eller klippning som layoutlösning.
- Verifierat i Chromium:800×600,1280×720,1920×1080 Native samt800×600 Fit i
  1920×1080-fönster. Worker med alla fyra byggval och tillräcklig bank, bas med
  tillgänglig research och full3-jobbskö, samt aktiv research/full kö:12 fall.
  Screenshots visuellt granskade; panel-/knappmått visar ingen scroll/överlapp.
- Browserregression i [scripts/check-bottom-bar.mjs](scripts/check-bottom-bar.mjs):
  fysisk bygg-/research-/köinput, Escape, bibehållen selection, disabled,
  hover/selected och tooltips. Extern Playwright/Chromium via miljövariabler;
  W2T_UI_URL anger dev-server, W2T_SCREENSHOTS anger artefaktkatalog.
- Ny verifiering: riktade UI/selection-tests36/6 och unit428/75 PASS;
  build inklusive strict typecheck PASS; git diff --check PASS.
  Inga campaign-/matchsimuleringar. Screenshots/mätningar lokalt i
  /tmp/w2t-bottom-bar; ingen ny CI-/Pages-verifiering hävdas.


**Aktuellt mandat RTS-160–164:** RTS-159 accepteras som Done och implementationen har inventerats.160 Done (`7d7290c`),161 Done (`b7439ae`),162 Done (`4658a0d`),163 Done (`efbdd7d`),164 Done (committen med denna överlämning). Etappen är avslutad; RTS-165 är nästa Todo och kräver nytt mandat. Stanna efter164 och uppdatera HANDOFF.157 lyssning och158 inspelningar kvarstår enligt historisk överlämning; återstående sprites dokumenteras separat.

Efter publicerad RTS-126 har användaren sagt ”fortsätt”. Fortsätt återstående roadmap i ordning med samma taskvisa checks, dokumentation och commit/push; tidigare etappstopp vid126 gäller inte längre. Ljudlyssning är fortsatt uppskjuten.

RTS-001–090 är klara. Ny beställd roadmap091–120 följer nedan. 091–096 är levererade. Användaren har därefter sagt fortsätt; fortsätt återstående roadmap i ordning enligt taskvisa checks/commit/push.

Denna fil styr arbetet. En task åt gången. RTS-001–015 är historiskt färdiga;
RTS-016–060 är en ny, användarbeställd roadmap efter MVP. Ingen gammal backlog
har återuppstått. RTS-001–090 är nu implementerade och verifierade. Rollfiler innebär inte automatisk agentstart.

## Planeringskonventioner

- Status: Done för färdigt arbete, Todo för planerat och In Progress för aktuell task. P0 = nästa etapps grind,
  P1 = kärna i tribute-målet, P2 = senare komplettering/presentation.
  Priority ändrar inte beroendeordningen; blockerande prerequisites går först.
- Storlek: S = en liten slice, M = flera samverkande beteenden, L = måste delas
  i verifierbara subtasks under samma ID. Det är relativa uppskattningar, inte
  timmar/löften. Historiska storlekar är retrospektiva, inte tidsrapporter.
- Primary Chat anger taskens avsedda arbetschatt/överlämningsetikett. Inga nya
  chattar har skapats och inga chattlänkar finns; fältet är inte agentkonfiguration.
- Dependencies är task-ID:n som ska vara Done före start. Öppna beslut i
  DECISIONS tas inom angiven task innan berörd kod; scopeändring kräver ny plan.
- Gemensam DoD: relevanta beteende/regressionstester, `npm test`,
  `npm run typecheck`, `npm run build`, beskrivet browserflöde och diffgranskning.
  Redovisa ej utförda browserchecks. Uppdatera docs/DEV_LOG före Done.
- Alla nya system ska återställas av restart och respektera game-over-stopp;
  nya reset-regressioner ingår i respektive task. UI får inte ge gameplay-orders.
- Balansvärden är preliminära tills speltestade; inga assetbyten före etapp 6.
  Full dynamisk unit-collision, multiplayer, backend, sjöstrid, andra fulla
  fraktionen, procedural generation och modding ingår inte i denna roadmap.
  Releaseverifiering innebär lokal build/testning, ingen deployment.

## Roadmap och ordning

| Etapp | Tasks | Leverans/grind |
| --- | --- | --- |
| 1 – Stabilisering och navigation | RTS-016–024 | Verifierad MVP, HUD, handgjord karta, nåbara orders och säkert basbygge. |
| 2 – Kontroller och basbygge | RTS-025–034 | Kamera, byggnadsorders, guld/trä, byggtid, population, köer och förstörbara mål. |
| 3 – Armé och combat | RTS-035–040 | Autoattack, attack-move, archer/catapult, uppgraderingar och balanserade strider. |
| 4 – Fiendebas och skirmish | RTS-041–046 | Budgetstyrd enemy AI och separat skirmish-scenario. |
| 5 – Överblick och spelkontroller | RTS-047–052 | Minimap, fog/synlighet, grupper, hotkeys, pause och scenario-val. |
| 6 – Presentation och release | RTS-053–060 | Egna assets/ljud, tre uppdrag, lokal save/load och verifierad lokal release. |

Taskordningen nedan är topologisk. Etapperna anger målbild; detaljerade
Dependencies styr vad som måste vara klart. Etapp 1 detaljplaneras här;
Återstående Todo-tasks behöver konkretiseras före implementation utan nya task-ID:n.

## Historik: RTS-001–015


## RTS-001 – Initialize project structure

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** S (retrospektiv).

**Dependencies:** Inga task-prerequisites.

**Primary Chat:** RTS-001 – Initialize project structure (historisk taskreferens; chattlänk saknas).

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

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** S (retrospektiv).

**Dependencies:** RTS-001.

**Primary Chat:** RTS-002 – First playable movement slice (historisk taskreferens; chattlänk saknas).

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

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** S (retrospektiv).

**Dependencies:** RTS-002.

**Primary Chat:** RTS-003 – Click selection (historisk taskreferens; chattlänk saknas).

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

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-003.

**Primary Chat:** RTS-004 – Drag selection and group commands (historisk taskreferens; chattlänk saknas).

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

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-004.

**Primary Chat:** RTS-005 – Simple wood gathering (historisk taskreferens; chattlänk saknas).

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

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-005.

**Primary Chat:** RTS-006 – Base and wood delivery (historisk taskreferens; chattlänk saknas).

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

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** S (retrospektiv).

**Dependencies:** RTS-006.

**Primary Chat:** RTS-007 – Train workers from base (historisk taskreferens; chattlänk saknas).

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


## RTS-008 – Place a barracks

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-006.

**Primary Chat:** RTS-008 – Place a barracks (historisk taskreferens; chattlänk saknas).

**Verifierat 2026-10-01:** Alla 93 tester, typecheck och build passerade.
Chromium verifierade preview, snapping, ogiltiga platser/lågt saldo, Escape och
högerklick, exakt kostnad 40 vid placering samt max en barracks. Selection och
unit-orders bevarades. Inga fångade browserfel. Preview/byggnad granskades visuellt.
Tidigare bundle-varning kvarstår.

**Mål:** Spelaren placerar en barracks för levererat wood.

**Krav:** Knapp ”Bygg barracks – 40 wood” aktiverar placeringsläge med preview.
Övre vänstra hörnet snappas till 32 px-grid; footprint 2 × 2 tiles. Vänsterklick
på giltig plats placerar direkt. Helt inom världen, ingen överlapp med bas
eller resursnod. Ogiltigt visas tydligt utan debitering. Saldo kontrolleras vid
placering och kostnaden 40 dras exakt en gång. Escape/högerklick avbryter gratis.
Placeringsinput ändrar inte selection eller unit-orders. Högst en barracks.
Phaser-fristående regler, enkla configvärden och dokumenterad footprint-modell.

**Non-goals:** Byggtid, byggande arbetare, barracks-produktion, rivning,
pathfinding, unit-collision och generell byggmeny. Befintlig basproduktion bevaras.

**Acceptance criteria:** Preview med giltig/ogiltig status; korrekt snapping,
världsgränser och footprint-spärrar. Giltig placering debiterar exakt en gång.
Felplats, lågt saldo, avbrott och andra barracks ändrar inte saldo/byggnader.
Selection/order-input är isolerad. Tester, typecheck, build och browserkontroll
passerar; docs uppdateras.

**Tester:** Snapping/gränser, bas/nodöverlapp, kantkontakt, giltig kostnad,
ogiltig placering, otillräckligt saldo, avbrytning och max en barracks.
Alla befintliga tester. Browserkontroll av preview, placering och båda avbrotten.

**Relevanta docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md),
[DECISIONS.md](DECISIONS.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).


## RTS-009 – Soldier production from barracks

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-007, RTS-008.

**Primary Chat:** RTS-009 – Soldier production from barracks (historisk taskreferens; chattlänk saknas).

**Mål:** Producera en soldier som kan väljas och flyttas.

**Krav:** Knapp ”Träna soldier – 20 wood” tillgänglig efter barracks-placering.
Kostnad vid start, 5 gameplay-sekunder, en produktion per byggnad utan kö.
Bas/barracks kan producera samtidigt med gemensamt saldo. Återanvänd produktion
praktiskt. Soldier: unikt ID, idle, omarkerad, spawn utanför footprint inom
världen, visuellt skild från worker. Klick/dragselection och movement fungerar;
soldier kan inte samla/bära wood. Resursklick vid blandad selection ger workers
gather och bevarar soldiers order. UI bevarar selection/orders. Configvärden.

**Non-goals:** Combat, HP, fiender, rally point, kö, population cap, collision
och pathfinding.

**Acceptance criteria:** Korrekt kostnad/startspärr/tid/exakt en spawn,
parallella timers och unika ID:n. Spawn-position giltig, soldier tydlig och
styrbar, workers-only gather. Tester, typecheck, build och browserflöde
samla → bygg barracks → producera → flytta soldier passerar. Docs uppdateras.

**Tester:** Kostnad, startvillkor, tid, en spawn, samtidig produktion, unika ID:n,
giltig spawn nära även världskanter, selection/movement och blandade order.
Alla befintliga tester och browserkontroll.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md),
[README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

**Verifiering:** 104 tester passerade, typecheck och build passerade.
Chromium verifierade samla → bygg barracks → samtidig worker-/soldier-produktion
→ välj/flytta soldier, samt blandad selection och bevarade UI-orders utan fel.
Befintlig bundle-varning kvarstår. Nästa föreslagna scope är en första combat-slice;
ingen ytterligare task har skapats eller implementerats.

## RTS-010 – Manual soldier attack

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-009.

**Primary Chat:** RTS-010 – Manual soldier attack (historisk taskreferens; chattlänk saknas).

**Mål:** Markerade soldiers kan angripa en synlig stillastående fiende.

**Krav och acceptance criteria:** Högerklick på fiende ger soldiers attack-order och bevarar workers orders. Soldiers går rakt till melee-räckvidd, gör tidsbaserad skada och har HP. Fiende med 0 HP tas bort; attack mot dött mål blir idle; nytt move ersätter attack. Visa HP och städa renderobjekt vid död. Fristående gameplay-logik och configvärden. Alla tester, typecheck, build och relevant browserflöde verifieras; docs uppdateras.

**Non-goals:** Enemy AI, waves, game over och restart. Gemensamma non-goals gäller också.

**Tester:** Räckvidd, delta=0, skada över tidssteg, död, saknat mål, markeringskrav och orderbyte. Browser: producera soldier → angrip → fiende försvinner. Befintliga regressionstester.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

**Verifiering:** 113 tester, typecheck och build passerade. Chromium verifierade verklig insamling/produktion/attack och borttagna renderobjekt utan fel. Diff granskad utan blockerande fynd.

## RTS-011 – Simple enemy movement and attack

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-010.

**Primary Chat:** RTS-011 – Simple enemy movement and attack (historisk taskreferens; chattlänk saknas).

**Mål:** Fiender kan gå mot och skada soldiers eller spelarens bas.

**Krav och acceptance criteria:** Fiende väljer närmaste soldier inom config-aggro, annars bas. Rak approach och melee-skada; både sidor tar skada i samma steg. Döda soldiers tas bort och selection-rendering städas. Bas-HP visas. Fristående gameplay-logik och configvärden. Alla tester, typecheck, build och relevant browserflöde verifieras; docs uppdateras.

**Non-goals:** Avancerad AI, worker-/barracks-attacker, waves och game over. Gemensamma non-goals gäller också.

**Tester:** Approach utan skada utanför räckvidd, aggro/targetbyte, soldatdöd, basskada och samtidig död. Browser: fiende approach/strid och basens HP minskar. Befintliga regressionstester.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

**Verifiering:** 119 tester, typecheck/build och browserkontroll passerade. Fiende gick till bas, skadade den och besegrades av producerad soldier. Granskning rättade livstids-ID:n och uteslöt döda angripare.

## RTS-012 – Finite configured enemy waves

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** S (retrospektiv).

**Dependencies:** RTS-011.

**Primary Chat:** RTS-012 – Finite configured enemy waves (historisk taskreferens; chattlänk saknas).

**Mål:** En ändlig match med tydlig vågprogression och resurser för försvar.

**Krav och acceptance criteria:** Ersätt tillfällig fiende med ändliga config-waves i gameplay-tid. Unika enemy-ID:n, ingen dubbelspawn, visa våg/countdown. Tillräcklig wood-nod och första vågen ger tid att samla/bygga/producera. Befintliga 800 × 600-världen är MVP:s öppna arena. Fristående gameplay-logik och configvärden. Alla tester, typecheck, build och relevant browserflöde verifieras; docs uppdateras.

**Non-goals:** Oändliga waves, procedural generation och terräng/pathfinding. Gemensamma non-goals gäller också.

**Tester:** Spawn-gränser, flera passerade tider, tidssteg, unika ID:n, sista vågen och resursbudget. Browser: samla/bygga/producera före första vågen samt vågspawn. Befintliga regressionstester.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

**Verifiering:** 125 tester, typecheck/build och Chromium passerade. Verkligt försvar producerades före första vågen; första vågen spawnade och besegrades. Diff granskad utan blockerande fynd.

## RTS-013 – Defeat and game-over freeze

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-012.

**Primary Chat:** RTS-013 – Defeat and game-over freeze (historisk taskreferens; chattlänk saknas).

**Mål:** Matchen förloras när basens HP når 0.

**Krav och acceptance criteria:** Defeat vid bas-HP 0. Visa förlust. Stoppa hela simulationen och canvas-/produktions-/placeringsinput; rensa pågående gest/preview utan orders. Fristående gameplay-logik och configvärden. Alla tester, typecheck, build och relevant browserflöde verifieras; docs uppdateras.

**Non-goals:** Victory och restart. Gemensamma non-goals gäller också.

**Tester:** Bas-HP-gräns, stopp för gathering/movement/produktion/waves/combat och blockerad input. Browser: förlust, fryst state och avvisade gameplay-klick. Befintliga regressionstester.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

**Verifiering:** 130 tester, typecheck/build passerade. Chromium verifierade naturlig defeat (~101 s), fryst state, avvisad canvas/forcerad UI-input och rensad preview utan fel. Diff granskad utan blockerande fynd.

## RTS-014 – Victory after final wave

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** S (retrospektiv).

**Dependencies:** RTS-013.

**Primary Chat:** RTS-014 – Victory after final wave (historisk taskreferens; chattlänk saknas).

**Mål:** Vinst när alla ändliga vågor och fiender klarats.

**Krav och acceptance criteria:** Victory bara när sista vågen spawnat och inga fiender återstår. Defeat har företräde när båda villkoren uppstår samtidigt. Samma simulation/input-stopp som defeat. Fristående gameplay-logik och configvärden. Alla tester, typecheck, build och relevant browserflöde verifieras; docs uppdateras.

**Non-goals:** Nya objectives, extra banor och restart. Gemensamma non-goals gäller också.

**Tester:** Inte för tidig victory, sista fiendens död, simultan defeat/victory och fryst vinst. Browser: besegra hela vågserien och få victory. Befintliga regressionstester.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

**Verifiering:** 134 tester, typecheck/build passerade. Chromium spelade ekonomi, produktion och alla waves till victory vid ~124 s med bas-HP 240; simulation/input fryst utan browserfel. Diff granskad utan blockerande fynd.

## RTS-015 – Restart the complete match

**Status:** Done.

**Priority:** Avslutad; ingen aktiv prioritet.

**Uppskattad storlek:** M (retrospektiv).

**Dependencies:** RTS-014.

**Primary Chat:** RTS-015 – Restart the complete match (historisk taskreferens; chattlänk saknas).

**Mål:** En ny match kan startas från game over utan omladdning.

**Krav och acceptance criteria:** Restart-knapp efter vinst/förlust. Återställ hela gameplay-state, timers, ID:n, saldo/nod, bas-HP, enheter, waves, byggnader, selection, inputgest och presentation. Inga dubbla DOM-/inputlyssnare. Dokumentera hela spelgången. Fristående gameplay-logik och configvärden. Alla tester, typecheck, build och relevant browserflöde verifieras; docs uppdateras.

**Non-goals:** Persistens, deployment och grafikpolish. Gemensamma non-goals gäller också.

**Tester:** Ny oberoende initial state, restart från båda outcomes, ny ekonomi/produktion/placering och flera restart-cykler. Browser: vinst/förlust → restart → ny fungerande match. Befintliga regressionstester.

**Relevanta docs:** [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

**Verifiering:** 137 tester, typecheck/build passerade. Chromium: naturlig victory,
restart från båda outcomes, fyra cykler och ny faktisk ekonomi/placering/samtidig
produktion/movement passerade. Sex ytterligare fixture-cykler verifierade exakt
oförändrade DOM/pointer/keyboard-lyssnare och rena renderobjekt. Canvas-bounds-
regression efter DOM-layoutändring rättad och verifierad. Inga browserfel.
Slutdiff granskad utan kvarstående blockerande fynd. Alla docs/filreferenser kontrollerade.

## MVP-status efter RTS-015

RTS-001–015 är Done. Sex nya tasks slutfördes i denna körning. Befintlig MVP
kan spelas från ekonomi/produktion till waves och win/loss samt startas om.
Inga återstående tasks inom den avslutade MVP:n; den nya tribute-roadmapen nedan utökar målet. Avsiktliga begränsningar: öppen arena,
placeholders, manuell soldier-attack, rak movement/överlapp och enkel AI som
angriper soldiers/bas. Non-goals kvarstår; bundle-varningen är inte åtgärdad.
Den tidigare MVP-körningen omfattade inga ytterligare tasks, dependencies, commit eller push.
Planeringskörningen efteråt definierar RTS-016–060 nedan.

## RTS-016 – Manuellt MVP-speltest och regressioner

**Status:** Done.

**Verifierat 2026-10-02:** 137 tester, typecheck och build passerade.
Naturlig victory (~125 s) och defeat (~101 s), fryst input/simulation,
restart från båda och ny ekonomi/produktion verifierades i Chromium 147.
Scroll, radbrytning och sex ytterligare fixture-restarts passerade.
Inga blockerande regressioner hittades; protokoll i [DEV_LOG.md](DEV_LOG.md).

**Priority:** P0.

**Uppskattad storlek:** M.

**Goal:** Etablera en reproducerbar nulägesbaseline innan nya system införs.

**Dependencies:** RTS-015.

**Requirements:**

- Läs dagens regler/kod och speltesta normal start, ekonomi/leverans, placering,
  samtidig produktion, selection, combat, samtliga waves, båda outcomes och restart.
- Testa UI/canvas efter scroll, kontrollradens radbrytning och upprepade restarts.
  Använd riktiga resurser/tider i minst en hel vinst/förlust; märk fixture-kontroller.
- Registrera konkreta fel med repro, förväntat/faktiskt beteende och allvarlighet.
  Åtgärda endast bekräftade blockerande MVP-regressioner med beteendetester.
- Dokumentera reproduktionssteg, miljö och kända begränsningar; befintlig bundle-
  varning är ett känt fynd, ingen implicit optimeringsuppgift.

**Non-goals:** Nya features, navigation, balansändring eller grafikpolish.

**Acceptance criteria:**

- Ett daterat protokoll redovisar både naturlig victory/defeat, fryst simulation
  och ny fungerande ekonomi/produktion efter restart.
- Confirmed blockerande regressioner är rättade/verifierade eller tasken lämnas
  ofärdig med exakt hinder. Avsiktliga MVP-begränsningar skiljs från buggar.
- Dagens 137 tester är baseline, inte ett krav på oförändrat testantal. Alla
  checks passerar; browserresultat innehåller faktiska miljödata och utfall.

**Tester:** Bevara befintliga tester. Lägg endast regressioner som reproducerar hittade beteendefel; kontrollera ID:n, resursbevarande, outcome-prioritet och reset.

**Browserflöde:** Spela samla → barracks → flera soldiers → tre waves → victory; ny match utan försvar → defeat; restart båda gånger, resize/scroll och ge nya orders.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-016 – Manuellt MVP-speltest och regressioner (planerad implementationschatt).

## RTS-017 – Balansera ekonomi, produktion och waves

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** M.

**Goal:** Göra nuvarande wave-survival begripligt och möjligt att vinna med rimlig förberedelse.

**Dependencies:** RTS-016.

**Requirements:**

- Speltesta flera dokumenterade strategier: tidigt försvar, extra worker och
  passivt spel. Mät tid till barracks/första soldier, resursflöde och HP-förlust.
- Justera endast befintliga ekonomi-, produktions-, combat- och wave-configs.
  Dokumentera kandidater och den speltestade profil som väljs; framtida guld-
  och armévärden är fortfarande öppna.
- Säkerställ resurser för försvar och ersättning utan att ge oändlig ekonomi.
  Behåll ändliga waves, manuell attack och defeat-företräde.

**Non-goals:** Nya enhetstyper, autoattack, svårighetsval, ny ekonomi eller AI-regler.

**Acceptance criteria:**

- Minst två kompletta aktiva speltester vinner utan fixtures/tidsskalning;
  passivt spel demonstrerar faktisk risk för defeat. Strategier/tider redovisas.
- Kostnader/tider är icke-negativa, resource-budget och spawnförberedelse räcker
  för den dokumenterade strategin; automatisk vinst utlovas inte.
- Tests för gameplay-invarianter passerar även när balansvärden ändras.
  README:s faktiska siffror och designens preliminära balansprofil överensstämmer.

**Tester:** Budget, debitering en gång, spawn/timer, begränsad nod, normal wave-progression; avlägsna obefogade testantaganden om gamla balanskonstanter.

**Browserflöde:** Samla och vinn med vald profil, speltesta worker-investering och förlora utan försvar. Redovisa alla balansvärden som kandidater tills dessa tester passerat.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-017 – Balansera ekonomi, produktion och waves (planerad implementationschatt).

## RTS-018 – Tydlig HUD för resurser, HP, waves och produktion

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** M.

**Goal:** Ge spelaren tillräcklig information utan att behöva tolka överlappande placeholder-texter.

**Dependencies:** RTS-017.

**Requirements:**

- Visa levererat wood, basens HP, vågprogression/countdown och separat
  produktionstid/startspärr för bas och barracks. Visa begripliga skäl vid fel.
- Behåll minimalt DOM/Phaser-upplägg; samla presentation utan att flytta regler
  till HUD. Last/HP för markerade enheter får förtydligas med enkel text.
- Reservera tydliga ytor för controls/status så små viewportar och game over
  inte gör inputkoordinater fel. Alla UI-interaktioner är isolerade från orders.
- Gör budget/tid från config läsbara och visa game over/restart tydligt.

**Non-goals:** Fantasy-skin, minimap, byggnadsselection/command panel, fog eller nya gameplay-regler.

**Acceptance criteria:**

- Spelaren kan avläsa ekonomi, bas-HP, nästa wave och båda produktionsjobb
  samtidigt; varje spärrat kommando har ett begripligt skäl.
- UI-klick/keyboard-focus ändrar inte selection/orders. Nodklick träffar rätt
  efter resize/scroll, placeringspreview och game over/restart.
- Restart visar reset-data utan gamla labels/timers; viewportfallen från RTS-016
  har inga blockerande överlapp mellan HUD och aktiva kontroller.

**Tester:** Presentation av modellvärden/spärrskäl där meningsfullt; ekonomi/produktion och input/reset-regressioner. Inga snapshottester som bara speglar markup.

**Browserflöde:** Producera i båda byggnaderna, placera/avbryt, resize/scroll, klicka nod/enheter, spela till outcome och restart; kontrollera status/HP/knappar.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-018 – Tydlig HUD för resurser, HP, waves och produktion (planerad implementationschatt).

## RTS-019 – Handgjord tile-karta med terräng och hinder

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** L.

**Goal:** Lägga en enkel handgjord karta och ett testbart hinderkontrakt inför navigation.

**Dependencies:** RTS-018.

**Requirements:**

- Använd 32 × 32 world-pixel-tiles och en liten lokalt definierad karta med
  gångbar mark och blockerad terräng; placeholders tills RTS-053.
- Definiera tile/world-konvertering, bounds, fasta bas/nod-footprints och
  walkability-data fristående från Phaser. Ange hur 800 × 600-världens partiella
  nederkant hanteras; ändra inte godtyckligt till en större värld före RTS-025.
- Lägg startpositioner och enemy-spawns på giltiga platser i samma kartdata.
  Markera terräng/blockering tydligt utan att hitta på en fungerande pathfinder.
- Skapa data/kontrakt för hinderrevision inför senare ändrade byggnader. Beskriv
  tile-clearance och kandidatregler som RTS-020 måste fastställa.
- Håll dagens wave-survival spelbart under övergången: inga blockerade tiles
  får skära dokumenterade direkta MVP-rutter innan RTS-020–022 tar över dem.

**Non-goals:** Procedural generation, editor, pathfinding, kamera, fog och pixelassets.

**Acceptance criteria:**

- Konvertering/bounds fungerar på kanter och med ogiltiga koordinater enligt
  dokumenterad policy. Karta/footprints/spawn-data ger inga enheter inne i hinder.
- Hinder är synliga och querybara utan Phaser. Grid/world-data är samma källa
  för rendering och kommande navigation, med dokumenterad revisionsmekanism.
- Bas/nod/enemy-spawns och aktuella raka MVP-rutter är verifierat fria;
  normal match och restart fungerar. Navigation runt terräng påstås inte finnas.

**Tester:** Tile/world roundtrip, kanter/partiella tiles, walkability, footprint-rasterisering, start/spawn/route-fixtures och reset av kartstate.

**Browserflöde:** Se terräng/hinder, markera/flytta/samla längs bevarade rutter, bygg enligt nuvarande regler och verifiera wave-match/restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-019 – Handgjord tile-karta med terräng och hinder (planerad implementationschatt).

**Subtasks under samma ID:**

1. Fastställ kartdata/bounds och testa konvertering.
2. Rita placeholder-karta och förankra starts/footprints/spawns.
3. Verifiera övergångskartan, kartrevision/reset och dokumentera navigationens öppna val.

## RTS-020 – Pathfinding för move-orders

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** L.

**Goal:** Flytta enheter genom gångbar terräng utan att gå genom blockerade tiles.

**Dependencies:** RTS-019.

**Requirements:**

- Inför en enkel deterministisk pathfinder och waypoint-följning fristående
  från Phaser. Fastställ 4/8 grannar, diagonal-/clearance-policy före kod och
  dokumentera valet i DECISIONS; välj inga framtida algoritmer i förväg.
- Order-id/intention, destination, rutt och hinderrevision hålls tydligt isär.
  Nytt move ersätter gammal rutt. Följ waypoints med befintlig px/s och delta
  utan overshoot; förbruka resttid även när flera waypoints nås i ett steg.
- Avvisa blockerade/utanför/otillgängliga mål med strukturerat skäl och feedback,
  utan teleportering eller evig retry. Automatisk närmaste-fallback ingår inte.
- Vid ändrad hinderrevision validera/planera om återstående rutt från aktuell
  giltig position. Saknas ny rutt: stoppa säkert, behåll begripligt blockerat
  orderresultat och försök igen bara vid nytt kommando/relevant revision.
- Integrera endast move-orders för workers/soldiers. Testa ny rutt utan att
  ännu påstå att gathering/attack är navigationssäkra.

**Non-goals:** Gather-/attack-navigation, full dynamisk unit-collision, formationer, smoothing eller pathfinding-dependency.

**Acceptance criteria:**

- Nåbart mål runt testhinder nås med giltiga waypoints; enhetskroppens clearance
  och vald diagonalregel förhindrar corner-cutting genom hinder.
- Otillgängligt/utanför mål ger en tydlig avvisning utan blockerad förflyttning.
  Ett nytt giltigt kommando återställer normal rörelse.
- Modifierat hinder på aktiv rutt leder till omplanering eller säkert stopp;
  gammal rutt kan inte återupptas av ett sent resultat efter orderbyte.
- Likvärdig statisk rörelse över olika delta-steg slutar på samma destination;
  avmarkering och game over/reset bevarar tidigare beteende.

**Tester:** Nåbar/otillgänglig rutt, samma tile, världskanter, kropp-clearance, diagonala hörn, determinism, restdelta, ersatt order och revision efter mid-route-blockering.

**Browserflöde:** Flytta kring ett hinder, klicka otillgänglig plats, ge nytt mål, ändra hinder i märkt testfixture och observera omplanering/stopp; restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-020 – Pathfinding för move-orders (planerad implementationschatt).

**Subtasks under samma ID:**

1. Dokumentera grannar/clearance och bygg sökning med felresultat.
2. Integrera waypoint-följning i move-orders och feedback.
3. Inför revisionsvalidering/orderbyte och regressioner.

## RTS-021 – Navigation för gathering och leverans

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** M.

**Goal:** Bevara arbetsloopen när nod och bas har blockerande footprints.

**Dependencies:** RTS-020.

**Requirements:**

- Reservera nod/bas-footprints som hinder för workers arbetsrutter; välj nåbar
  arbets-/leveransposition utanför footprint med tillräcklig kropp-clearance.
- Planeringskontrakt: gathering/leveransräckvidd mäts till footprintens kant,
  inte centrum inne i blockerad byggnad. Dokumentera övergången från dagens
  centrumavstånd; balansräckvidd ligger fortsatt i config.
- Följ samma pathfinder/waypoints för approach, delivery och återgång med
  bevarad last, resursbevarande, uttömning, ny order och avmarkering.
- Välj annan nåbar kandidat om en kantposition är blockerad. Ingen kandidat/
  rutt ger säkert blockerat arbetsläge/feedback, inga uttag/depositioner på avstånd
  och ingen lastförlust. Revision/noduttömning/orderbyte validerar rätt destination.

**Non-goals:** Guld, nya drop-off-byggnader, slot-reservation mellan workers eller dynamisk collision.

**Acceptance criteria:**

- Workers går runt terräng och stannar utanför bas/nod; endast nådd giltig
  arbetsposition tillåter gather/deposit. Ingen byggnadsgenomgång förekommer.
- Full och partial last levereras, återgång fungerar och nod+last+saldo bevaras.
- Helt inringad nod/bas ger feedback/stopp utan ghost-gather eller tappad last;
  ändrade hinder eller ny order kan åter göra en nåbar position användbar.
- Nuvarande ekonomi/produktion och wave-match fungerar med hinder och restart.

**Tester:** Nåbara sidor, en/alla blockerade approach-positioner, ändrad rutt, full/partial last, depletion, orderbyte, restdelta och totalbevarande.

**Browserflöde:** Placera hinder mellan workers/nod/bas i karta/fixture, kör två leveransturer och uttömning; blockera drop-off och ge nytt move/gather utan lastförlust.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-021 – Navigation för gathering och leverans (planerad implementationschatt).

**Subtasks under samma ID:**

1. Testa nåbara arbetspositioner vid footprints.
2. Integrera alla arbetsloopens rutter.
3. Verifiera blockerade mål/revision, ekonomi och reset.

## RTS-022 – Navigation för attack-orders och enemy AI

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** M.

**Goal:** Göra pursuit och basskada möjliga utan att angripare går genom terräng eller byggnader.

**Dependencies:** RTS-021.

**Requirements:**

- Soldier-attack och enemy AI använder gemensam navigation till nåbar melee-
  position utanför targetfootprint. Soldiers/enemies har kroppsyta; bas har
  blockerande footprint. Attackrange mäts till målfootprintens kant.
- Rutt för attack följer target-ID och giltig position, inte en fryst pointer.
  Flyttat/förstört mål eller hinderrevision validerar rutt och omplanering.
- Begränsa replanning till dokumenterade target-/revisionstriggers; ingen
  obegränsad full sökning varje frame. Inget skadande genom terrängväggar.
- Saknas nåbar melee-position: ingen skada, säkert blockerat tillstånd/feedback.
  Enemy omvärderar giltiga mål enligt enkel dokumenterad AI-policy.
- Bevara simultan damage/outcome-prioritet, manuella soldier-orders och workers-
  orders vid enemy-klick. Finite waves måste fortfarande kunna nå försvar/bas.

**Non-goals:** Autoattack, attack-move, ranged units, line-of-sight-system och avancerad targettaktik.

**Acceptance criteria:**

- Soldier och enemy når mål runt hinder utan footprintintrång; skada sker
  bara från nåbar position inom kantbaserad räckvidd.
- Mål bakom stängd vägg skadas inte; öppnad rutt/revision åter möjliggör attack.
  Ett flyttat mål följs och ett dött mål rensar attack/rutt utan ID-återanvändning.
- Basskada, soldatdöd och defeat-företräde fungerar i full wave-match;
  game over/restart avslutar alla nya routes/replanningstates.

**Tester:** Pursuit kring vägg, flyttat target, inringad bas, kropp/range, ingen damage genom vägg, förstört target, retargeting, simultan död och reset.

**Browserflöde:** Angrip enemy kring hinder; låt wave nå/skada bas via öppning, stäng/öppna testväg, döda target och ge nytt kommando; spela outcome/restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-022 – Navigation för attack-orders och enemy AI (planerad implementationschatt).

**Subtasks under samma ID:**

1. Gemensamma nåbara melee-positioner/range-tester.
2. Integrera soldier pursuit och enemy-basmål.
3. Triggerstyrd omplanering och full wave-regression.

## RTS-023 – Gruppförflyttning med separata målpositioner

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** M.

**Goal:** Minska överlapp vid gruppkommandon utan att införa full unit-collision.

**Dependencies:** RTS-022.

**Requirements:**

- Fördela markerade enheters move till separata gångbara slutpositioner runt
  klickmålet, stabilt per ID och med configavstånd/kropp-clearance.
- Kandidater får inte ligga i terräng/byggnad/utanför världen eller vara
  otillgängliga från respektive start. Begränsa kandidatantal/sökområde.
- Vid platsbrist: flytta bara enheter med giltigt tilldelat mål och rapportera
  övriga som blockerade; använd aldrig samma mål som dold fallback.
- Befintlig klick/dragselection, nytt mål, avmarkering och mixed-unit-regler
  bevaras. Detta ändrar move-destinationer, inte gather/attack till formationer.

**Non-goals:** Full dynamisk collision avoidance, flocking, kontrollgrupper, formationstyper eller militär taktik.

**Acceptance criteria:**

- En grupp på öppen mark får distinkta nåbara slutpositioner och nås utan
  att ändra omarkerade enheters orders. Tilldelning är reproducerbar per ID.
- Kant/hinder/trång yta resulterar bara i giltiga mål eller tydligt blockerat
  resultat; ingen oändlig sökning och ingen tyst destination i hinder.
- Enheter får fortfarande överlappa under gång; dokumentationen lovar inte
  collision. Ny order och restart rensar gammal tilldelning/rutt.

**Tester:** Unika/deterministiska mål, fler enheter än platser, världskant, blockerade kandidater, individuell nåbarhet, orderbyte och omarkerade units.

**Browserflöde:** Flytta minst fem producerade enheter på öppen yta och vid smal passage/kant; byt mål mitt i rörelse, avmarkera och restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-023 – Gruppförflyttning med separata målpositioner (planerad implementationschatt).

**Subtasks under samma ID:**

1. Kandidatgenerering och stabil tilldelning.
2. Individuell nåbarhet och platsbrist.
3. Gruppinput/feedback och regressionsflöden.

## RTS-024 – Byggnader som hinder och säkra placeringsregler

**Status:** Done.

**Priority:** P0.

**Uppskattad storlek:** L.

**Goal:** Låta spelaren bygga utan inträngda enheter eller avskurna nödvändiga arbets-/spawnvägar.

**Dependencies:** RTS-023.

**Requirements:**

- Rasterisera placerade bas/barracks-footprints i samma navigationshinderdata.
  Giltig placering uppdaterar ekonomi, byggnadsstate och hinderrevision atomiskt.
- Preview/klick använder samma validering: terräng/världsgräns, byggnader/noder,
  alla levande enhetskroppar (inklusive enemies), saldo och dagens max en barracks.
- Avvisa placering över enheter; flytta dem inte automatiskt. Kontrollera aktuell
  position/saldo vid klick, även om preview nyss var giltig.
- Testa hypotetiskt hinder före debit: bevara befintliga arbetarenheters tillgång
  till nåbar bas-drop-off och aktiv nod samt varje produktionsbyggnads nåbara
  spawn/utgång till gångbar yta och wave-entryns nödvändiga väg mot basområdet.
  Kontrollen ska inte kräva att redan otillgängliga områden blir nåbara.
- Spawn väljer ledig gångbar kroppssäker position utanför footprint. Om alla
  kandidater är blockerade håll färdig produktion väntande utan dubbel debitering
  eller extra spawn, med tydlig status; pröva igen vid relevant ändring.
- Aktiva routes omplaneras via revision; Escape/högerklick/ogiltig plats drar
  inga resurser eller ändrar selection/orders. Restart återställer hinderdata.

**Non-goals:** Flera barracks, byggtid, automatisk eviction, rivning, farms eller dynamisk collision.

**Acceptance criteria:**

- Preview och slutkontroll avvisar enhets-/footprint-/terrängöverlapp och
  avskurna nödvändiga vägar med skäl, utan saldo/hinder/byggnadsändring.
- Giltig placering debiterar en gång, blockerar footprint och invaliderar rutter;
  omplanering ger giltig rutt eller säkert stopp, aldrig passage genom byggnaden.
- Producerad unit spawnar utanför footprint inom världen på gångbar yta; blockad
  utgång visar väntan, frigjord utgång ger exakt en spawn utan ny betalning.
- Normal karta och wave-survival går att spela till outcome och restart;
  placerings-/hinder-/route-/produktionsstate är rent efter omstart.

**Tester:** Bas/nod/terräng/unitöverlapp, klick efter preview, partiella kanter, hypotetisk connectivity, arbetardrop-off, wave-entry, blockerad/fri spawn, revision och ekonomi-atomicitet.

**Browserflöde:** Försök bygga över worker och stänga nod-/bas-/spawnväg, bygg på giltig plats under pågående orders; blockera/frigör spawn och kontrollera en producerad unit samt restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-024 – Byggnader som hinder och säkra placeringsregler (planerad implementationschatt).

**Subtasks under samma ID:**

1. Gemensamma statiska/dynamiska footprints och revisionsintegration.
2. Preview/klick och hypotetisk connectivity med dokumenterad väglista.
3. Gångbar spawn/väntande produktion.
4. Wave-/ekonomi-/gruppregression och reset.

## RTS-025 – Större karta och kamerapanorering

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Spela på en karta större än viewporten utan ändrade world-orders.

**Dependencies:** RTS-024.

**Requirements:** Världen utökas till 1280 × 960 px med två ytterligare handgjorda terrängpatcher; viewporten är fortsatt 800 × 600. Zoom är 1. Mittenmusdrag panorerar begränsat till världen och får inte ändra selection/orders eller placera byggnad. Pan under vänsterdrag ignoreras. UI står kvar utanför canvas; worldPoint använder aktuell kamera. Game over stoppar pan; restart börjar vid (0,0).

**Non-goals:** Minimap, fog, zoomsystem utöver vald minsta policy och procedural generation.

**Acceptance criteria:** Kameran kan nå hela kartan men inte utanför bounds. Klick/drag/placement/move använder rätt world-position vid alla kanter; HUD står still. Restart återställer karta, kamera och input.

**Tester:** World/screen-konvertering vid samtliga hörn, begränsat drag även när viewport är större än världen, selection/placement i förskjutna koordinater, befintliga tester och browser-reset.

**Browserflöde:** Pan till motsatt hörn; flytta en vald arbetare dit, klick/drag-välj och bygg där. Pan tillbaka till resursnoden och samla. Kontrollera pan under preview, game over och restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-025 – Större karta och kamerapanorering (planerad implementationschatt).

## RTS-026 – Byggnadsselection och kontextuell command panel

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Styra vald byggnads tillgängliga kommandon utan att blanda dem med unit-orders.

**Dependencies:** RTS-025, RTS-018.

**Requirements:** Välj spelarens bas/barracks via footprint; visa rätt produktionskommandon och status. Unit-träff har företräde framför barracks och bas. Building/unit-selection är exklusiv: klick på tom mark eller drag rensar byggnadsval; byggnadsval avmarkerar units utan att stoppa orders. Markera vald footprint med gul ram. Endast vald egen produktionsbyggnad visar sin knapp/status; dolda knappar skyddas också i click-handler. Byggknappen för barracks är global. Behåll panelens utrymme så canvas inte hoppar; game over blockerar produktion och restart rensar val.

**Non-goals:** Rally, kö, hotkeys och fantasy-skin.

**Acceptance criteria:** Rätt commands/felorsaker visas för valt mål; tomt klick avmarkerar enligt dokumenterad policy. Panelklick skapar varken move eller ändrad selection. Selection-ID:n/reset är rena.

**Tester:** Träff/priority, övergång building/unit, tillåtna commands och reset.

**Browserflöde:** Välj bas/barracks, starta båda produktionerna och växla till units under kamerapan.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-026 – Byggnadsselection och kontextuell command panel (planerad implementationschatt).

## RTS-027 – Rally points

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Ge nyproducerade units en avsedd destination.

**Dependencies:** RTS-026, RTS-024.

**Requirements:** Rally lagras per spelarproduktionsbyggnad. Högerklick i building-selection sätter world-mål via navigation. Grön rallymarkör visas för vald byggnad. Ogiltig destination avvisas med text och behåller tidigare giltigt rally. Validera statiskt nåbar route från möjlig spawn-utgång, oberoende av tillfällig unit-occupancy. Ny unit spawnar giltigt och får rally-move; arbetare får inga implicita gather-orders i denna slice.

**Non-goals:** Attack-/gather-rally, formationsrally och kö.

**Acceptance criteria:** Olika byggnaders rally hålls isär; unit-selection ger fortsatt vanlig move. Blockerat rally/spawn ger tydlig policy och ingen footprintinträngning. Om senare hinder blockerar rally spawnar unit säkert men får blockerad route och väntar på ny order/hinderrevision; kostnad/spawn påverkas inte. Restart rensar rally/error.

**Tester:** Spawn+rally, blockerad destination, byggnadsvis state och inputisolering.

**Browserflöde:** Välj barracks, sätt/byt rally, producera och följ unit runt hinder.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-027 – Rally points (planerad implementationschatt).

## RTS-028 – Stop-command och orderfeedback

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** S.

**Goal:** Avbryta markerade enheters arbete/rörelse med begriplig respons.

**Dependencies:** RTS-027, RTS-022.

**Requirements:** Stop avslutar route/attack/gather-delivery för markerade units och gör dem idle utan att kasta last. Global Stop-knapp är aktiv endast med valda units under spel. Målring visas för valda units: gul för aktiv move/gather/deliver/attack, röd för blockerad route. HUD visar orderfas och felorsak. Avmarkering döljer ring utan att ändra order; completion/död/reset tar bort den. Stop rensar även blockerad navigation så revision inte återstartar arbetet. Produktionsavbrytning ingår först i RTS-033.

**Non-goals:** Attack-move, orderkö och generella effekter.

**Acceptance criteria:** Endast markerade stannar; last och saldo bevaras. Ordermarkörer speglar aktiva/avvisade orders och försvinner vid completion/död/reset. Game over avvisar Stop.

**Tester:** Stop i varje orderfas, delta/orderbyte, markeringskrav och lastbevarande.

**Browserflöde:** Stop mitt i leverans och attack, återuppta och verifiera ny feedback.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-028 – Stop-command och orderfeedback (planerad implementationschatt).

## RTS-029 – Guldgruva och guldinsamling

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Lägga till gold med samma leveransmodell som wood.

**Dependencies:** RTS-028, RTS-021, RTS-026.

**Requirements:** Synlig ändlig gruva, resurstyp i config/order/last och gemensamt gold-saldo vid basleverans. Gruvan ligger vid (850,220), har 300 gold, radie 20, rate 1/s och samma capacity/range som wood. Last har en resurstyp; byte med partial/full last levererar tidigare last först och går sedan till nya noden. Move/Stop bevarar lasttyp. Saldo börjar gold=0. Uttömning levererar sista lasten. Ingen resurs får bytas bort. Nåbara arbetspositioner gäller även gruvan.

**Non-goals:** Guldpriser, handel, tredje resurs och AI-workers.

**Acceptance criteria:** Workers samlar/levererar båda typerna utan sammanblandning eller negativ nod; totalsumman per typ bevaras. Soldiers samlar inte. Uttömning, orderbyte och reset fungerar.

**Tester:** Typad last, resursbyte med partial/full last, depletion, nåbarhet och bevarande per typ.

**Browserflöde:** Samla gold/wood med olika workers, byt mål med last och avläs separata saldon.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-029 – Guldgruva och guldinsamling (planerad implementationschatt).

## RTS-030 – Kostnader i guld och trä

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Använda en gemensam atomisk kostnadsmodell för två resurser.

**Dependencies:** RTS-029, RTS-026.

**Requirements:** Kostnadsconfig för befintlig produktion/byggande och HUD. Preliminärt worker 20 wood, barracks 40 wood, soldier 20 wood + 5 gold. Behåll 5 s produktion och befintliga waves; speltesta två wood-workers och en gold-worker. Gemensam ResourceCost-config och canAfford/payCost används av produktion och placering; båda saldon valideras innan något dras. Avbruten preview kostar inget.

**Non-goals:** Uppgraderingar, kö/refund och nya byggnader.

**Acceptance criteria:** Godkänd start drar varje kostnad exakt en gång; otillräcklig ena resurs lämnar båda oförändrade. Priser/spärrskäl i panel matchar config; wave-survival har fungerande resursbudget.

**Tester:** Tvåresurs-atomicitet, exakta gränser, dubbelstart och ekonomi/reset-regression.

**Browserflöde:** Försök producera utan gold respektive wood; samla båda och bygg/producera.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-030 – Kostnader i guld och trä (planerad implementationschatt).

## RTS-031 – Byggande arbetare och byggtid

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Låta worker resa till och färdigställa ett placerat bygge.

**Dependencies:** RTS-030, RTS-024, RTS-021.

**Requirements:** Barracks kräver minst en vald worker; lägsta ID bland valda får build-order. Högst en barracks, 5 s arbete inom 24 px från footprintens utsida. Last/typ bevaras. Ingen refund/rivning: Stop/move/gather pausar, högerklick på ofärdig barracks tilldelar en vald worker och återupptar kvarvarande progress. Ett bygge har högst en aktiv builder; byte builder stoppar föregående build-order. Completion gör builder idle. Giltig placering reserverar footprint och drar kostnad enligt RTS-030; worker når utsida och arbetar. Produktionen aktiveras först vid färdig byggnad.

**Non-goals:** Reparation, flera builders som accelererar samma bygge, rivningsmeny och automatiskt fullrefund.

**Acceptance criteria:** Bygge kan inte starta utan giltig worker/resurser/position; arbetaren går inte in i footprint. Orders/Stop/otillgänglighet ger dokumenterat paus/avbrott utan ghost-progress. Unfinished building producerar inte och reset rensar allt.

**Tester:** Approach/byggtid, footprintreservation, orderbyte/Stop, kostnadsatomicitet och completion en gång.

**Browserflöde:** Placera barracks med worker, stoppa/återuppta och producera först efter completion.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-031 – Byggande arbetare och byggtid (planerad implementationschatt).

**Subtasks under samma ID:** 31a Placering/reservation och builder-order. 31b Byggprogress/paus/completion. 31c Commands och regressioner.

## RTS-032 – Farms och population cap

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Ge basbygget en begriplig kapacitetsgräns för armén.

**Dependencies:** RTS-031, RTS-030.

**Requirements:** Byggbar farm med footprint/byggtid och supply-config. Farm kostar 20 wood, footprint 2 × 2 tiles, byggtid 5 s, samma builder/pausmodell som barracks. Högst tre farms, med unika match-ID:n. Bas-cap 8, färdig farm +5; workers/soldiers använder 1 var. Aktivt/klart väntande produktionsjobb reserverar 1 direkt vid godkänd start. Ofärdig/pausad farm ger ingen cap. Om cap senare minskar behålls units och redan godkända jobb får slutföras; nya starter blockeras tills used+reserved+1 ≤ cap. Ny farmplacering får inte skära av tilldelade builders tidigare nåbara vägar till ofärdiga sites, även pausade. Ingen förstörelsemekanik före RTS-034. Inga befintliga units försvinner enbart av minskad cap.

**Non-goals:** Upkeep, matsamling, hunger eller automatisk unit-kill.

**Acceptance criteria:** Cap/used/reserved visas och spärrar produktion utan kostnad vid full cap. Färdig farm ökar cap en gång; ofärdig gör det inte. Alla units/aktiva jobb räknas korrekt; reset återställer supply.

**Tester:** Cap-gräns, reservation/completion, flera farms, pausad byggtid och över-cap-policy.

**Browserflöde:** Fyll cap, försök producera, bygg farm och fortsätt produktion.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-032 – Farms och population cap (planerad implementationschatt).

## RTS-033 – Produktionskö, avbrytning och återbetalning

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Köa och avbryta produktion per byggnad med korrekt ekonomi/supply.

**Dependencies:** RTS-032, RTS-027.

**Requirements:** Max tre jobb per byggnad inklusive aktivt; debitera båda resurser och reservera supply vid godkänd enqueue. Job-ID:n är monotona per byggnad. FIFO; endast head arbetar. Cancel på köat jobb ger 100 % av lagrad kostnad, aktivt jobb (även färdig blockerad spawn) ger 50 %. Cancel frigör jobbets reservation direkt och head-byte börjar nästa fulla timer; ingen retroaktiv arbetstid. Game over avvisar enqueue/cancel. Jobs har ID/order, tid och reserverad supply; olika byggnader tickar samtidigt. Blockerad spawn väntar utan duplicate-job/refund.

**Non-goals:** Automatiska oändliga repeat-orders, bonusproduktion och nya units.

**Acceptance criteria:** Köordning är stabil, varje job debiteras/spawnar/refundas högst en gång. Avbryt rätt job, frigör korrekt supply/resurser och visa timer/kö. UI/input, blockerad utgång och reset är konsekventa.

**Tester:** Flera jobb/tidssteg, queue-limit, cancel head/tail, refund-gränser, supply och blockerad spawn.

**Browserflöde:** Köa workers/soldiers samtidigt, avbryt mitt/första job och frigör blockerad utgång.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-033 – Produktionskö, avbrytning och återbetalning (planerad implementationschatt).

**Subtasks under samma ID:** 33a Job-/resurs-/supply-kontrakt. 33b Kö/timer/spawn. 33c Avbrytning/refund och panel.

## RTS-034 – HP, targeting och förstörelse för workers och byggnader

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Göra hela basen/arbetskraften till giltiga combat-mål med komplett cleanup.

**Dependencies:** RTS-033, RTS-031, RTS-022.

**Requirements:** HP/ägare/targeting för workers, bas, barracks, farms och byggprojekt. Worker HP 30, barracks 120, farm 80; projekt har samma HP som färdig byggnad, utan heal vid completion. Ägare är player/enemy. Enemy väljer närmaste levande player-target inom 140 px; lika distans prioriterar soldier, worker, byggnad och stabilt ID, annars bas. Cargo förloras vid worker-död och bokförs per typ som lostCargo. Ingen refund vid byggnads-/projektdöd; alla dess köjobb/reservations/rally rensas. Builder-död pausar kvarvarande projekt med builderId=null. Förstörelse/cleanup körs före produktion så död byggnad aldrig spawnar. Rensa selection, targetorders, rally, bygge/produktion, supply och hinderrevision; bevara jämförbara ID:n.

**Non-goals:** Reparation, ruiner som permanenta hinder, nya combattyper och full AI-ekonomi.

**Acceptance criteria:** HP 0 tar bort mål exakt en gång. Orders mot förstört mål upphör/omplaneras; inga jobs spawnar från död byggnad. Frigjort hinder möjliggör nya rutter; economy/supply följer dokumenterad döds-policy. Basdöd ger fortsatt defeat med företräde.

**Tester:** Död av varje måltyp i aktiva arbets-/bygg-/produktionsfaser, ID-referenser, refund/supply, route-revision och samtidig basdöd.

**Browserflöde:** Förstör lastad worker, underbygge och byggnad med kö; kontrollera panel, routes, supply och outcome.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-034 – HP, targeting och förstörelse för workers och byggnader (planerad implementationschatt).

**Subtasks under samma ID:** 34a HP/targetreferenser. 34b Worker/bygge/byggnadsdöd. 34c Kö/ekonomi/supply/rutt-cleanup.

## RTS-035 – Automatisk target acquisition och attack

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Minska behovet av nytt manuellt mål efter varje kill.

**Dependencies:** RTS-034, RTS-022.

**Requirements:** Idle soldiers söker levande, synliga och nåbara enemies inom 140 px från automatisk strids utgångspunkt. Närmaste centrum väljs, lika distans använder numeriskt stabilt enemy-ID; giltigt aktuellt mål behålls. Explicit attack ersätter automatisk strid och följs till död; Move ersätter jakt och tillåter auto efter arrival; Stop spärrar auto tills nytt Move/attack. Efter kill väljs nästa tillåtna mål; utan sådant återgår soldier till utgångspunkt via befintlig navigation. Osynligt, onåbart eller utanför leash avbryter automatisk jakt. EnemyVisibility-predicate förbereder fog; dagens default är fullt synlig karta. Delta 0 initierar ingen ny strid.

**Non-goals:** Attack-move, smart formations-AI och ranged units.

**Acceptance criteria:** Efter kill kan tillåten unit välja nästa giltiga target utan dold/otillgänglig jakt. Tie-break är stabil; Move/Stop/manuell order följer dokumenterad prioritet. Förstörda mål/reset lämnar inga attackreferenser.

**Tester:** Targetval, distans/tie-break, död/otillgänglighet, command-prioritet och visibility-predicate.

**Browserflöde:** Kämpa mot flera enemies utan nytt klick, avbryt med Move/Stop och ange manuellt target.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-035 – Automatisk target acquisition och attack (planerad implementationschatt).

## RTS-036 – Attack-move

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Kombinera destination och tillfälliga strider.

**Dependencies:** RTS-035, RTS-023.

**Requirements:** Knapp aktiverar destination med vänsterklick; Escape/högerklick avbryter utan orderbyte. Explicit attack-move behåller separat långsiktigt mål, angriper giltig enemy enligt RTS-035 och återupptar navigation efter strid. Endast selected soldiers får separata gruppdestinationer; workers behåller arbete. Move/Stop/manuell attack ersätter hela ordern. Otillgänglig destination avslutas med route-fel, ingen oändlig retry.

**Non-goals:** Patrol, orderscript, formationssystem och dynamisk collision.

**Acceptance criteria:** Unit stannar för strid och når sedan ursprungligt mål; Stop/ny move ersätter hela attack-move. Dött/blockerat/dolt target orsakar inte oändlig jakt. UI och reset rensar state.

**Tester:** Avbrott/återgång, targetbyte, blockering, gruppmål och orderprioritet.

**Browserflöde:** Attack-move över kartan förbi flera enemies, avbryt och jämför vanlig Move.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-036 – Attack-move (planerad implementationschatt).

## RTS-037 – Archer med distansattack och projektiler

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Lägga till en tydligt spelbar ranged-unit.

**Dependencies:** RTS-035, RTS-033, RTS-030.

**Requirements:** Träningsbar archer med config för pris, tid, supply, HP, range, hastighet och attackintervall. Fristående projectile/hit-logik. Fastställ line-of-sight, targettap/livstid och projektilpolicy före kod; framtida fog använder samma giltighetskontroll.

**Non-goals:** Homing-specialförmågor, ballistiksimulering och egna sprites.

**Acceptance criteria:** Archer kan produceras, väljas/flyttas och anfalla på avstånd utan damage utanför vald policy. Projektiler träffar/dör en gång, hanterar dött target och reset/game over. Archer samlar inte resurser.

**Tester:** Range/LOS, intervall, projectile-hit/lifetime, död target, tvåresurs/supply och reset.

**Browserflöde:** Producera archer, skjut rörligt mål runt hinder och spela mixed army-strid.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-037 – Archer med distansattack och projektiler (planerad implementationschatt).

**Subtasks under samma ID:** 37a Config/produktion/enhet. 37b Ranged/projektilregler. 37c Rendering/input/regressioner.

## RTS-038 – Catapult med områdesskada

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Lägga till en långsam siege-unit med testbar splash.

**Dependencies:** RTS-037, RTS-034.

**Requirements:** Produktion/stats/supply och nåbarhet för större kropp i config. Ange impactpunkt, splashradie/falloff, friendly-fire-policy och byggnadsskada innan kod. Återanvänd projectile-lifecycle; placeholders.

**Non-goals:** Specialammo, byggnadskollaps-animationer och avancerad siege-AI.

**Acceptance criteria:** Ett impact applicerar definierad områdesskada exakt en gång till giltiga mål; targets utanför radie skadas inte. Catapult navigerar/spawnar utan footprintintrång och samlar inte. Projectile/death/outcome/reset är konsekventa.

**Tester:** Radie/kant/friendly-fire, flera mål/buildings, större clearance, miss/död target och simultan basdöd.

**Browserflöde:** Producera catapult och bombardera grupp/byggnad; jämför kantmål och smal passage.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-038 – Catapult med områdesskada (planerad implementationschatt).

**Subtasks under samma ID:** 38a Stor unit/produktion/navigation. 38b Impact/splash. 38c Blandad armé och reset.

## RTS-039 – Uppgraderingsbyggnad för attack och försvar

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Ge en liten armé långsiktig progression.

**Dependencies:** RTS-038, RTS-031, RTS-030.

**Requirements:** Forge återanvänder workerbygge (40 wood/10 gold, 64 px, 5 s, HP 120, max en). Attack/defense max en nivå vardera, 40 wood/10 gold och 8 s, ett researchjobb utan kö. Attack ×1,25 damage och defense ×0,75 mottagen unit-damage gäller dynamiskt gamla/nya combat-units, inte workers/byggnader; ingen heal. Projektil behåller damage vid skott. Forge-död avbryter research utan refund, färdiga nivåer består vid rebuild. Global research-UI bevarar selection/orders; reset rensar nivåer och jobb.

**Non-goals:** Omfattande tech tree, spellcasters och flera tidsåldrar.

**Acceptance criteria:** Godkänd research betalar en gång och completion ger en bonus en gång till avsedda units. Spärrar/byggnadsdöd och restart följer dokumenterad policy; nya och befintliga units har konsekventa stats.

**Tester:** Research-cost/time/duplicates, statstackning, gamla/nya units och death/reset.

**Browserflöde:** Bygg, uppgradera och jämför attack/HP-regler före/efter i en liten strid.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-039 – Uppgraderingsbyggnad för attack och försvar (planerad implementationschatt).

## RTS-040 – Enhetsbalans och arméstrider

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Speltesta worker/soldier/archer/catapult som en liten armé.

**Dependencies:** RTS-039, RTS-036, RTS-017.

**Requirements:** Definiera upprepningsbara duel-/grupp-/siege-fixtures och speltesta priser, supply, HP, range, skada och produktionstid. Justera config efter observationer; markera valsiffror som speltestade, ej universellt slutbalanserade.

**Non-goals:** Nya units, full andra fraktionen och taktiska AI-omskrivningar.

**Acceptance criteria:** Minst tre dokumenterade matchup-/armétester ger begripliga roller och en ekonomi som kan spela wave-survival. Båda outcomes och reset fungerar med samtliga unittyper; inga nya balance-values saknar motivering.

**Tester:** Combat/economy-invarianter och repeatable matchup-regressioner utan att frysa godtyckliga DPS-tal.

**Browserflöde:** Spela melee/ranged/siege och full wave-match med blandad armé.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-040 – Enhetsbalans och arméstrider (planerad implementationschatt).

## RTS-041 – Attackbar och förstörbar fiendebas

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Introducera en fysisk fiendebas som kan belägras.

**Dependencies:** RTS-040, RTS-034, RTS-024.

**Requirements:** Fiendeägd bas med footprint/HP och giltiga attack-positioner. Spelarunits kan attackera/förstöra den med befintlig combat. Separat scenario/config förbereds; waves-segervillkor ändras inte.

**Non-goals:** Fiendeproduktion, AI-workers och skirmish-seger.

**Acceptance criteria:** Fiendebasen blockar navigation och tar korrekt skada; förstörd bas rensar alla target-/hinderreferenser. Spelaren får inga enemy-produktionscommands och wave-survival saknar oavsiktligt nytt victory-villkor.

**Tester:** Ägare/targeting, footprint/range, melee/ranged/splash och target/hinder-cleanup.

**Browserflöde:** Angrip fiendebas via nåbar väg och förstör den; jämför wave-scenariot.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-041 – Attackbar och förstörbar fiendebas (planerad implementationschatt).

## RTS-042 – Fiendeproduktion med begränsad resursbudget

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Låta fiendebasen producera utan gratis oändliga units.

**Dependencies:** RTS-041, RTS-033, RTS-030.

**Requirements:** En begränsad gold/wood-budget i enemy-config; använd gemensam produktion/kö/supply där tillämpligt. Produktionstid, kostnad och tillåtna units kommer från config. Ingen full worker-ekonomi eller dold budgetåterfyllning.

**Non-goals:** AI-insamling, obegränsade budgetar och flera fulla fraktioner.

**Acceptance criteria:** Varje enemy-job betalas/spawnar en gång; tom budget/full cap/blockad spawn ger säkert stopp/väntan. Basdöd stoppar active/köad produktion enligt RTS-034; restart återställer budget/timers.

**Tester:** Budget-atomicitet, simultan produktion, IDs, supply/spawn och död kö.

**Browserflöde:** Observera enemy-produktion tills budgeten tar slut och förstör basen under jobb.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-042 – Fiendeproduktion med begränsad resursbudget (planerad implementationschatt).

## RTS-043 – AI samlar och skickar anfallsgrupper

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Organisera producerad armé i begripliga anfall.

**Dependencies:** RTS-042, RTS-036.

**Requirements:** AI samlar stridsenheter i grupper, inte resurser med workers. Configstyrd samlingsplats, gruppstorlek/timeout och attack-move mot spelaren; grupper har explicit state/ID. Budgetmodellen från RTS-042 bevaras.

**Non-goals:** Full worker-ekonomi, avancerad scouting, formationer och oändlig resursinkomst.

**Acceptance criteria:** En unit tillhör högst en grupp; klar grupp skickas en gång och går runt hinder. Underbemannad grupp hanteras av dokumenterad timeout utan gratis units; död/reset städar medlem-/målreferenser.

**Tester:** Gruppstorlek/timer, medlemskap, orderutskick, döda medlemmar och slut på budget.

**Browserflöde:** Bygg försvar, observera minst två samlings-/anfallscykler och avskär deras väg.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-043 – AI samlar och skickar anfallsgrupper (planerad implementationschatt).

## RTS-044 – AI försvarar basen och ersätter förluster

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Ge fienden ett enkelt lokalt försvar utan att bryta ekonomin.

**Dependencies:** RTS-043, RTS-035.

**Requirements:** Hotnära-bas trigger, försvarsgrupp/reserv och config för prioritet mellan anfall/försvar. Ersätt förluster bara när budget/supply/tid medger det. Definiera gruppöverlämning och återgång; ingen omniscient fog-AI efter RTS-049.

**Non-goals:** AI-byggande, nya budgetkällor och avancerad strategisökning.

**Acceptance criteria:** Hot ger högst en aktuell försvarsorder per unit; inga dubbla gruppmedlemskap. Återgång fungerar efter hot, replacement drar faktisk budget och upphör vid slut/basdöd. Restart återställer AI-state.

**Tester:** Hottrigger, prioritet, grupptransfer, budgetbegränsad replacement och döda mål.

**Browserflöde:** Raid enemy-bas, dra dig tillbaka och följ försvar/ersättningsproduktion.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-044 – AI försvarar basen och ersätter förluster (planerad implementationschatt).

## RTS-045 – Skirmish med basförstörelse som segervillkor

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Erbjuda skirmish utan att ersätta färdigt wave-survival.

**Dependencies:** RTS-044, RTS-014, RTS-015.

**Requirements:** Separat scenario-config/mode för skirmish och wave-survival samt enkel valmöjlighet; full startmeny kommer i RTS-052. Skirmish-seger vid fiendebas förstörd, förlust vid spelarbas förstörd med defeat-företräde. Waves finns endast i wave-scenario.

**Non-goals:** Multiplayer, nya kartgeneratorer och kampanjpersistens.

**Acceptance criteria:** Valt scenario startar rätt ekonomi/AI/villkor. Skirmish kan vinnas/förloras utan wave-trigger; survival behåller ändliga waves och sitt victory-villkor. Game over fryser båda modes; restart återskapar valt scenario.

**Tester:** Policy per scenario, simultaneous base deaths, ingen wave/skirmish-korsläcka och full reset.

**Browserflöde:** Spela en skirmish-vinst/förlust och survival-vinst, restart respektive valt mode.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-045 – Skirmish med basförstörelse som segervillkor (planerad implementationschatt).

**Subtasks under samma ID:** 45a Scenario-data och minsta val. 45b Outcome-policy. 45c Båda mode-flödena och reset.

## RTS-046 – Konfigurerade svårighetsgrader

**Status:** Done.

**Priority:** P2.

**Uppskattad storlek:** M.

**Goal:** Ge begripligt valbar utmaning utan nya AI-system.

**Dependencies:** RTS-045, RTS-040.

**Requirements:** Preliminära easy/normal/hard-profiler för startbudget, produktion/grupptryck och survival-waves. Sätt gräns för vilka stats ändras och visa valet; speltesta utan hidden cheats.

**Non-goals:** Dynamisk svårighetsanpassning och ny AI-ekonomi.

**Acceptance criteria:** Vald profil ger rätt config i rätt scenario utan att mutera andra profiler. Normalprofil är verifierat spelbar; utmaningsskillnad dokumenteras med speltest. Restart behåller valet och återställer faktisk budget.

**Tester:** Config-isolering, scenario/profil-kombinationer, resursregler och reset.

**Browserflöde:** Jämför normal/easy/hard i båda modes och kontrollera budget/spawn/intervall.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-046 – Konfigurerade svårighetsgrader (planerad implementationschatt).

## RTS-047 – Minimap med kameraindikator och klicknavigation

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Visa kartöverblick och snabbt flytta kameran.

**Dependencies:** RTS-025, RTS-045, RTS-018.

**Requirements:** En enkel karta med terrain/byggregions/enhetsmarkörer och kameraindikator. Klick flyttar endast kamera via korrekt world/minimap-konvertering. Förbered visibility-filtrering inför RTS-049, inte egna gameplay-orders.

**Non-goals:** Fog-policy, minimap-orders, zoom och fantasy-art.

**Acceptance criteria:** Indikator/mapkoordinater är korrekta vid worldkanter; minimap-click ändrar varken selection eller orders. Restart/scenario-byte uppdaterar mapdata och kamera utan gamla markörer.

**Tester:** Koordinatskalning/clamp, kameraindikator, UI-isolering och state-refresh.

**Browserflöde:** Klicka i minimapens hörn, följ kamera och ge sedan move på main canvas.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-047 – Minimap med kameraindikator och klicknavigation (planerad implementationschatt).

## RTS-048 – Fog of war och utforskad terräng

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Beräkna teamvis synlighet och ihågkommen terräng.

**Dependencies:** RTS-047, RTS-040.

**Requirements:** Fristående fog-grid med aktuell visibility och persistent explored-data per team. Bestäm vision-radius, terräng/LOS och ev minne av buildings före kod. Overlay/fixture-rendering för validering; aktivera inte spelarens fog-läge före RTS-049:s fulla filtrering.

**Non-goals:** Fog som enbart visuell mask med informationsläckor, avancerad stealth och nätverkssynk.

**Acceptance criteria:** Vision från levande units/buildings uppdaterar korrekt; explored kvarstår när vision försvinner men återställs vid ny match. Död/ägare/scenario hanteras. Inget ofärdigt fog-läge levereras som döljer terrain men läcker enemy-data i panel/minimap.

**Tester:** Vision-union, kanter, LOS-policy, team-isolering, död/reset och explored-persistens under match.

**Browserflöde:** I märkt testfixture: utforska, lämna, döda observer och kontrollera explored/visible-overlay.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-048 – Fog of war och utforskad terräng (planerad implementationschatt).

**Subtasks under samma ID:** 48a Vision-/minnespolicy och griddata. 48b Uppdatering från units/buildings. 48c Overlay/testfixture; spelares aktivering väntar på RTS-049.

## RTS-049 – Synlighet styr rendering, targeting och minimap

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Göra fog till en konsekvent spelregel utan dolda enemy-läckor.

**Dependencies:** RTS-048, RTS-035, RTS-037, RTS-044.

**Requirements:** Gemensamt visibility-kontrakt filtrerar world-rendering, HP/labels, selection/target-acquisition, orders, HUD/command panel, AI-information och minimap. Definiera targettap/projectile-impact och ev last-seen-building-data; använd aldrig live HP/position för osynligt mål.

**Non-goals:** Mer avancerad fog-AI, stealth och informationsfusk.

**Acceptance criteria:** Dold enemy avslöjas inte via markör, HUD, targetdata, enemy-budget eller klickträff. Förlorad vision rensar/följer dokumenterad target-policy utan exakt dold tracking. Utforskad terrain kan visas; eventuella minnesmarkörer använder endast observerat state. Fog-läge är nu spelbart i båda scenarierna.

**Tester:** End-to-end visibility på alla informationsytor, hidden-click/acquisition, last-seen/destroyed target, projectile-policy, AI-team och reset.

**Browserflöde:** Upptäck enemy, lämna vision och prova klick/panel/minimap/autoattack; återvänd och jämför faktiska avslöjanden.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-049 – Synlighet styr rendering, targeting och minimap (planerad implementationschatt).

**Subtasks under samma ID:** 49a Render/HUD/minimap-filter. 49b Input/combat/AI-filter. 49c Targettap och full scenario-regression.

## RTS-050 – Shift-selection och kontrollgrupper

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Välja och återkalla grupper med tydliga modifierare.

**Dependencies:** RTS-049, RTS-026.

**Requirements:** Shift klick/drag adderar eller togglar enligt dokumenterad policy; grupper binder levande egna unit-ID:n. Återkalla grupp utan orders; döda/förstörda/dolda eller främmande targets filtreras enligt selection-regler.

**Non-goals:** Formation-editor, gruppspecifika stats och macros.

**Acceptance criteria:** Normal selection bevaras, modifierare fungerar i alla dragriktningar och grupper återkallar bara giltiga units. UI-input/camera/restart hanterar rätt state; inga ID-referenser överlever matchbyte.

**Tester:** Modifierad selection, gruppbind/recall, död ID, keyboard-focus och reset.

**Browserflöde:** Bygg blandad armé, add/toggle urval, bind/återkalla grupp efter förlust av en unit.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-050 – Shift-selection och kontrollgrupper (planerad implementationschatt).

## RTS-051 – Hotkeys och lättillgänglig kommandoguide

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** M.

**Goal:** Göra kommandon lättare att hitta och använda utan dubbel input.

**Dependencies:** RTS-050, RTS-028, RTS-036, RTS-033.

**Requirements:** Dokumenterad tangentmappning för selection/grupper, Stop, attack-move och kontextuella bygg-/produktionskommandon. Synliga labels/guide och keyboard-focus-hantering; välj språk/mappning före kod. Samma validering som knappar.

**Non-goals:** Macro-scripting, gamepad och omfattande rebinding-system.

**Acceptance criteria:** Hotkey och knapp ger samma order/kostnad en gång; textfält/pause/game over spärrar gameplay-input. Guide matchar faktisk mappning och felorsaker. Restart duplicerar inga keyboard-lyssnare.

**Tester:** Fokus/kontext/guard, repeat-key/debit, groups och listener/reset.

**Browserflöde:** Spela ekonomi/attack/Stop via tangentbord och kontrollera guide samt UI-focus.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-051 – Hotkeys och lättillgänglig kommandoguide (planerad implementationschatt).

## RTS-052 – Pause, matchstart och scenario-val

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Ge kompletta lokala start-/pause-/restart-flöden.

**Dependencies:** RTS-051, RTS-046, RTS-045.

**Requirements:** Välj survival/skirmish, karta där stödd och difficulty innan match. Pause fryser alla gameplay-timers/orders/projektiler/AI men tillåter meny-input enligt dokumenterad policy. Resume tillför inte elapsed wall-time; restart behåller val.

**Non-goals:** Konton, serverlobby, matchmaking och campaign-save.

**Acceptance criteria:** Alla scenario/profil-val ger korrekt initial state. Pause/resume bevarar matchen utan bonusprogress/damage och duplikatlyssnare; outcome/restart/new match går via tydliga stateövergångar.

**Tester:** Pause alla system, inputprioritet, lång wall-time-resume, configval och återstart.

**Browserflöde:** Starta båda modes, pausa mitt i bygge/projektil/produktion, vänta, resume och restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-052 – Pause, matchstart och scenario-val (planerad implementationschatt).

**Subtasks under samma ID:** 52a Startval. 52b Pause/resume/input. 52c Outcome/restart-menyer och regressioner.

## RTS-053 – Egna pixeltiles för terräng och resurser

**Status:** Done.

**Priority:** P2.

**Uppskattad storlek:** L.

**Goal:** Ersätta terräng/resurs-placeholders med egna pixelassets.

**Dependencies:** RTS-052, RTS-019, RTS-029.

**Requirements:** Egna PNG RGBA-tiles på 32 × 32 px, atlas och lokalt manifest med tile-ID/origin; nearest-neighbor och inga gameplayändringar. Wood/gold-nodframes 64 × 64 px med transparent bakgrund och dokumenterat ankare mot befintlig footprint. Enkla resource-states: tillgänglig/uttömd (en frame vardera); inget animationskrav.

**Non-goals:** Lånade originalspel-assets, nytt terrängsystem och map editor.

**Acceptance criteria:** Format/dimensioner/ankare är validerade; varje aktuell terrain/resource-ID har eget korrekt renderasset. Logic/walkability/nodmängd är oförändrade. Källor/exportfiler/palett och rätt att använda egna assets dokumenteras lokalt.

**Tester:** Manifest/frame-bounds/ID-mapping där meningsfullt och kart-/resursregressioner; inga pixel-snapshots som enda beteendebevis.

**Browserflöde:** Pan hela karta/minimap, samla båda resurserna till depletion och kontrollera fog/rendering.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-053 – Egna pixeltiles för terräng och resurser (planerad implementationschatt).

**Subtasks under samma ID:** 53a Palett och terrain-set. 53b Wood/gold-states. 53c Exportmanifest/integration.

## RTS-054 – Byggnadssprites och byggstadier

**Status:** Done.

**Priority:** P2.

**Uppskattad storlek:** L.

**Goal:** Göra basbygget läsbart genom egna sprites.

**Dependencies:** RTS-053, RTS-031, RTS-034, RTS-039.

**Requirements:** PNG RGBA för bas/barracks/farm/uppgraderingsbyggnad och enemy-varianter som delar logik. Standardframe 128 × 128 px (farm 64 × 64), native 32 px tile-skala och explicit footprint/ankare. Minst tre statiska byggframes (grund, halvbyggd, färdig); färdig frame är idle utan animationskrav.

**Non-goals:** Förändrade footprints/HP, andra fulla fraktionen och destruktionsfysik.

**Acceptance criteria:** Alla byggnadstyper/stadier/ägare har korrekt frame och ankare utan att ändra placement/hinder. HP/selection/fog överlappar inte vilseledande; förstörd byggnad lämnar ingen target/renderläcka. Export/source-manifest finns.

**Tester:** State→frame, ankare/frame-bounds, bygge/completion/death/fog-regressioner.

**Browserflöde:** Bygg/avbryt/färdigställ/förstör varje typ och verifiera selection/minimap/fog.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-054 – Byggnadssprites och byggstadier (planerad implementationschatt).

**Subtasks under samma ID:** 54a Byggnadsset/ägarmarkering. 54b Byggstadier. 54c Integration och footprint-regression.

## RTS-055 – Enhetssprites och animationer

**Status:** Done.

**Priority:** P2.

**Uppskattad storlek:** L.

**Goal:** Ge alla fyra unittyper egna läsbara pixelanimationer.

**Dependencies:** RTS-054, RTS-038, RTS-034.

**Requirements:** PNG RGBA-sheets: worker/soldier/archer 32 × 32 px per frame, catapult 64 × 64. Åtta riktningar, minst idle 1 frame, walk 4, attack 4 och death 4; worker dessutom gather/build 4 vardera. Manifest med frame-grid, anchor, facing, FPS/loop. Renderframe får inte tyst ändra hitbox/navigation-clearance; death-animation är presentation efter logical removal.

**Non-goals:** Nya combatregler, andra fulla fraktionen, skeletal-animation och grafikpolish utöver läsbarhet.

**Acceptance criteria:** Varje relevant unit-state/riktning har egna frames och tydlig teammarkering. Damage/byggprogress styrs av gameplay-tid, aldrig animationsevents. Dead/fogged units läcker inte selection/HP; restart städar animationsobjekt.

**Tester:** State/facing→animation, sheet-bounds, death-effect-lifecycle och combat/gather/reset-regressioner.

**Browserflöde:** Flytta i åtta riktningar, samla/bygg och melee/ranged/splash-strid; död och fog kontrolleras.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-055 – Enhetssprites och animationer (planerad implementationschatt).

**Subtasks under samma ID:** 55a Worker/soldier-set. 55b Archer/catapult-set. 55c Facing/animation/render-integration.

## RTS-056 – Ljudeffekter, musik och volymkontroller

**Status:** Done.

**Priority:** P2.

**Uppskattad storlek:** M.

**Goal:** Lägga till ett litet eget lokalt ljudpaket.

**Dependencies:** RTS-055, RTS-052.

**Requirements:** Lokal egen effekt/musik, master WAV och runtime-export OGG med validerad fallback enligt beslutat browserstöd; manifest anger loop/duration/volym. Separat master/effect/music-volym och mute. Starta ljud efter user gesture, hantera pause/outcome/restart och undvik effekter från dolda events som avslöjar enemy.

**Non-goals:** Tredjepartstjänster, voice acting och omfattande adaptiv soundtrack.

**Acceptance criteria:** Valda runtimeformat avkodas i stödda browsers utan autoplayfel; mute/volym fungerar direkt. Pause/game over/restart ger ingen dubbel musik eller gamla ljudevents och inga fog-läckor. Saknat ljud blockerar inte gameplay.

**Tester:** Volym/mute/eventguard och lifecycle där testbart; decode/user-gesture i browser.

**Browserflöde:** Starta match, mute/byta volym, pausa/resume, bli attackerad under fog och restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-056 – Ljudeffekter, musik och volymkontroller (planerad implementationschatt).

## RTS-057 – Fantasy-HUD och visuella stridseffekter

**Status:** Done.

**Priority:** P2.

**Uppskattad storlek:** M.

**Goal:** Ge presentationen en sammanhållen egen fantasy-stil utan att ändra spelregler.

**Dependencies:** RTS-056, RTS-049, RTS-018.

**Requirements:** Egna PNG RGBA-UI-ikoner 32 × 32, paneldelar med dokumenterade 16 px hörn/borders och originalpalett. Effektsheet 32 × 32 impact respektive 64 × 64 splash, minst 4 frames/effekt med explicit FPS/lifetime. Läsbara HP/order/range-signaler, keyboard-focus och HUD-layout.

**Non-goals:** Gameplay-omskrivning, kopierad Warcraft-HUD och effekter som driver damage.

**Acceptance criteria:** Alla kontroller/status är minst lika läsbara som tidigare HUD i valda viewportar. Fog döljer känsliga effekter/labels; effects slutar och städas vid death/reset. Klick/hotkeys/world-bounds fungerar efter skin.

**Tester:** Effect-lifecycle/visibility/input och återkommande HUD-regressioner.

**Browserflöde:** Full ekonomi/arméstrid i båda modes med pan/fog/keyboard och game over/restart.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-057 – Fantasy-HUD och visuella stridseffekter (planerad implementationschatt).

## RTS-058 – Tre korta uppdrag med olika mål

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Erbjuda tre handgjorda korta scenarier med begripliga objectives.

**Dependencies:** RTS-057, RTS-052, RTS-045.

**Requirements:** Planera tre uppdrag: överlev ändliga waves, förstör fiendebas och ett tredje mål som beslutas före kod (t.ex. försvara utpost under begränsad tid). Konfigurerade kartor/starts/objectives, tydlig instruktion och individuell reset; skirmish/survival kvar i valmenyn. Längd/mål/balans är preliminära tills speltestade.

**Non-goals:** Stor kampanj, nya units, nätverk och procedural generation.

**Acceptance criteria:** Tre valbara uppdrag med olika verifierbara win-conditions, förlust och defeat-företräde kan slutföras. Minst ett dokumenterat naturligt playthrough per uppdrag; start/restart läcker inte progress till annat scenario.

**Tester:** Objective-policy, timer/goal-gränser, simultaneous defeat och scenario-isolering.

**Browserflöde:** Spela alla tre från instruktion till win/loss, återstarta och växla scenario.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-058 – Tre korta uppdrag med olika mål (planerad implementationschatt).

**Subtasks under samma ID:** 58a Mål/kart/startdesign. 58b Tre objektiv-configs/integration. 58c Playthroughs/balans.

## RTS-059 – Lokal save/load med versionshanterat sparformat

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Återuppta en lokal match med korrekt komplett gameplay-state.

**Dependencies:** RTS-058, RTS-052, RTS-049, RTS-044.

**Requirements:** Versionerat validerat JSON-format och lokal lagring; antal slots/manual-autosave/export-policy beslutas före kod. Snapshot innehåller scenario/map/config-version, matchtid/outcome/pause, resurser/laster, units/HP/orders/IDs, byggprojekt, kö/rally/supply/research, projectiles, AI-budget/grupper, wave-progress och fog/explored. Navigation återvalideras mot laddade footprints; inga Phaser-objekt/listeners/caches serialiseras.

**Non-goals:** Cloud, backend, konton, cross-version-garanti utan migration och godtycklig extern kod i saves.

**Acceptance criteria:** Spara/ladda under arbete/produktion/strid ger motsvarande state utan dubbla kostnader/impact/spawns eller wall-time-bonus. Korrupt/okänd framtida version avvisas atomiskt utan att skada aktiv match; stödda versioner har dokumenterad migration/avvisning. Load/restart städar UI/render/listeners/fog och skapar giltiga referenser.

**Tester:** Roundtrip för varje system, mid-projectile/mid-job, validering/broken ID, migrations-fixtures, kvotfel, atomicitet och reset.

**Browserflöde:** Spara mitt i leverans/bygge/kö/strid/fog, reload sidan och ladda; prova trasigt/okänt save och starta ny match.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-059 – Lokal save/load med versionshanterat sparformat (planerad implementationschatt).

**Subtasks under samma ID:** 59a Schema/version/validering. 59b Snapshot/rekonstruktion/lagring. 59c UI/felfall/migration och full roundtrip.

## RTS-060 – Slutbalans, prestanda, regressioner och releaseverifiering

**Status:** Done.

**Priority:** P1.

**Uppskattad storlek:** L.

**Goal:** Verifiera den lilla kompletta tributen inför lokal release.

**Dependencies:** RTS-059, RTS-046, RTS-040.

**Requirements:** Definiera browser-/viewport-/enhetsbudget och stödd releaseprofil innan mätning. Speltesta survival/skirmish/tre uppdrag, alla difficulty-profiler och save/load; dokumentera balans och uppmätta CPU/frame/minne/bundle. Bedöm kvarstående bundle-varning mot budget, inte automatisk omskrivning. Verifiera clean-install/build lokalt och kända begränsningar.

**Non-goals:** Multiplayer, nya gameplayfeatures och spekulativ stor refaktorering. GitHub Pages-publicering ingår enligt användarens tillägg.

**Acceptance criteria:** Alla checks/full playthroughs och save/reset-regressioner redovisas med miljö/resultat. Uppmätta budgets uppfylls eller tasken lämnas öppen med konkreta hinder; inga okända blockerande fel. Assets/ljud/formats fungerar från lokal production-build, docs och release-checklista är aktuella.

**Tester:** Alla suites, clean-install/typecheck/build, scenariomatris, lång match/reset/heap och save-kompatibilitet.

**Browserflöde:** Spela lokal byggoutput i valda browsers/viewportar, alla modes/uppdrag/difficulties, pause/save/load/outcome/restart och belastningsfall.

**Docs:** [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [DECISIONS.md](DECISIONS.md), [DEV_LOG.md](DEV_LOG.md), [README.md](README.md).

**Primary Chat:** RTS-060 – Slutbalans, prestanda, regressioner och releaseverifiering (planerad implementationschatt).

**Pages:** Först efter godkända releasekontroller: Actions på push main/workflow_dispatch, npm ci/test/typecheck/build, officiella Pages-actions, minimala permissions/concurrency, Vite base /warcraft-2-tribute/ och basrelativa assets. Verifiera lokal produktion under subpath samt Actions/publicerad sida när åtkomst finns; rapportera annars ej kontrollerat. Localhost-saves flyttas inte mellan origins.

**Subtasks under samma ID:** 60a Mät-/releasekriterier. 60b Slutspeltest/balans. 60c Konkreta regressioner/prestandafynd. 60d Lokal releaseverifiering/dokumentation.

## RTS-155 – Ny kvalitetsnivå för sprites

**Status:** Done.

**Goal:** Ny kvalitetsnivå för sprites.

**Requirements:**

Förbättra först worker, melee-unit och huvudbyggnad som referens.
Tydliga silhuetter, konsekvent skala, lagfärger och animationer.
Granska i faktisk spelstorlek innan resten uppdateras.
Använd användarens godkända Humans-design om den finns tillgänglig.
Om referensen saknas: dokumentera behovet; hitta inte på dess innehåll.
Dela resterande assetarbete i subtasks per fraktion/assetgrupp.

**Verified references:** `docs/art/human-reference.png` covers the Human worker and melee silhouettes; `docs/art/buildings-reference.png` covers the main Human keep/base silhouette. No approved reference was available for other asset groups, so only those supported assets were updated.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Förbättra först worker, melee-unit och huvudbyggnad som referens. Tydliga silhuetter, konsekvent skala, lagfärger och animationer. Granska i faktisk spelstorlek innan resten uppdateras. Använd användarens godkända Humans-design om den finns tillgänglig. Om referensen saknas: dokumentera behovet; hitta inte på dess innehåll. Dela resterande assetarbete i subtasks per fraktion/assetgrupp.

**Dependencies:** RTS-154. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## Etapp 7–11 – Planerad fortsättning (ingen implementation i denna körning)

Fraktionsnamn, specialförmågor och exakta balansvärden är öppna beslut. Nya system måste inkludera restart, save/load och teamvisibilitet där relevant. Befintliga system återanvänds.

## RTS-061 – Speltest och kvalitetsgranskning av första versionen

**Status:** Done.

**Goal:** Dokumentera reproducerbara fynd från publicerad och lokal release.

**Requirements:** Spela ekonomi, basbygge, strid, missions, save/load och båda modes. Bedöm läsbarhet, tillgänglighet och verkliga större arméer. Ingen featureimplementation.

**Non-goals:** Features utanför målet, deploymentändring och fraktions-/sjöimplementation.

**Dependencies:** RTS-060.

**Acceptance criteria:** Prioriterad fyndlista med reproduktionssteg, miljö, förväntat/faktiskt beteende och severity; inga obekräftade buggar rapporteras som fakta.

**Tester:** Browsermatris och befintlig regression; dokumentationsgranskning.

**Docs:** [BACKLOG.md](BACKLOG.md), [DEV_LOG.md](DEV_LOG.md), [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md).

## RTS-062 – Prioriterade buggar och regressioner från granskningen

**Status:** Done.

**Goal:** Rätta bekräftade blockerande/högt prioriterade fynd.

**Requirements:** Välj begränsad fyndlista från RTS-061, ett reproduktionsfall och regression per beteendefel; bevara save-kompatibilitet eller dokumentera version.

**Non-goals:** Features utanför målet, deploymentändring och fraktions-/sjöimplementation.

**Dependencies:** RTS-061.

**Acceptance criteria:** Valda fynd är åtgärdade och verifierade; övriga fynd står kvar med prioritet.

**Tester:** Regression för varje fix, alla suites/typecheck/build och browser-repro.

**Docs:** [BACKLOG.md](BACKLOG.md), [DEV_LOG.md](DEV_LOG.md), [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md).

## RTS-063 – Förbättrad unit-separation och trängselhantering

**Status:** Done.

**Goal:** Minska överlappning utan att blockera orders.

**Requirements:** Besluta lokal separation med kroppsstorlek, determinism och begränsad beräkningskostnad; bevara pathfinding/orders/fog.

**Non-goals:** Features utanför målet, deploymentändring och fraktions-/sjöimplementation.

**Dependencies:** RTS-062.

**Acceptance criteria:** Större blandade grupper separeras; inga NaN, teleporteringar eller permanent stopp i öppet fält; restart/save/load korrekt.

**Tester:** Öppet fält, olika kroppsstorlekar, trängsel, tidssteg, save/reset och browser.

**Docs:** [BACKLOG.md](BACKLOG.md), [DEV_LOG.md](DEV_LOG.md), [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md).

## RTS-064 – Köbildning vid resurser och smala passager

**Status:** Done.

**Goal:** Låta arbetare och arméer ta sig fram i trängsel.

**Requirements:** Avgränsa köpolicy vid noder och passager; rättvis framdrift, avbrytning och döda refs. Ingen ny resursekonomi.

**Non-goals:** Features utanför målet, deploymentändring och fraktions-/sjöimplementation.

**Dependencies:** RTS-063.

**Acceptance criteria:** Begränsad genomströmning utan deadlock; resurser och last bevaras; nya orders bryter kön och saves återställs.

**Tester:** Kö/avbrytning/death, wood-konservation, smal passage och långt browserfall.

**Docs:** [BACKLOG.md](BACKLOG.md), [DEV_LOG.md](DEV_LOG.md), [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md).

## RTS-065 – Uppmätt prestandapass med större arméer

**Status:** Done.

**Goal:** Verifiera beräkningsbudget för större matcher.

**Requirements:** Definiera och mät konkreta unit-tal på dokumenterad enhet; profile gameplay/render/minne före optimering. Ingen spekulativ refaktor.

**Non-goals:** Features utanför målet, deploymentändring och fraktions-/sjöimplementation.

**Dependencies:** RTS-064.

**Acceptance criteria:** Före/efter-resultat med FPS/frame CPU/minne; budget klar eller konkreta hinder redovisas; gameplay/save/fog lika.

**Tester:** Belastning, långt spel/reset/heap, alla regressioner och production browser.

**Docs:** [BACKLOG.md](BACKLOG.md), [DEV_LOG.md](DEV_LOG.md), [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [DECISIONS.md](DECISIONS.md), [README.md](README.md).

## RTS-066 – Fraktionsdata för units, buildings och upgrades

**Status:** Done.

**Goal:** Införa två stabila fraktions-ID:n och fraktionsspecifika typ-ID:n ovanpå befintliga gemensamma gameplay-roller.

**Requirements:** Enkel TypeScript-katalog för worker/soldier/archer/catapult, base/barracks/farm/forge och attack/defense. Fraktion är skild från team/owner. Matchstart, restart och save/load bevarar teamens fraktion. Befintliga stats/kostnader och system behålls; inga kopierade fraktionssystem.

**Non-goals:** Fraktionsval i UI, ny grafik, fraktionsbalans, nya förmågor, AI-ekonomi och sjöstrid; dessa har egna efterföljande tasks.

**Dependencies:** RTS-065.

**Acceptance criteria:** Båda fraktioner har unika typ-ID:n med samma delade roller och kompletta data. Matchen lagrar player/enemy-fraktion oberoende av owner. Save v1 migreras atomiskt till v2 med tidigare standardfraktioner; okända/ogiltiga fraktioner/versioner avvisas tydligt. Befintliga matchflöden och numeriska värden är oförändrade.

**Tester:** Katalogens roller/ID:n och baslinjevärden, team/fraktionsoberoende, start/reset, save v1-migration/v2-roundtrip och avvisning utan mutation. Alla regressioner, typecheck/build och browserkontroll av migrerad Save/Load/start/restart.

**Docs:** [BACKLOG.md](BACKLOG.md), [DECISIONS.md](DECISIONS.md), [ARCHITECTURE.md](ARCHITECTURE.md), [GAME_DESIGN.md](GAME_DESIGN.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md).

## RTS-067 – Andra spelbara fraktionen med egna namn och assets

**Status:** Done.

**Goal:** Göra Kronförbundet och Järnklanen valbara med egna namn och urskiljbara originalsprites.

**Requirements:** Menyval för player-fraktion, motsatt enemy-fraktion i nya matcher. Egna human/orc-unit- och byggnadssprites för båda lagfärgerna, befintliga animationer/byggstadier. Fraktionsnamn i UI. Save/load/restart och ny match isolerar val; fog/death/selection/HP följer befintliga regler.

**Non-goals:** Fraktionsstats/kostnadsskillnader, nya förmågor, AI-ekonomi, nya kartor och sjöstrid.

**Dependencies:** RTS-066.

**Acceptance criteria:** Båda val kan starta, producera, samla/flytta/strida, laddas och startas om. Fraktionen syns som egen human/orc-silhuett/presentation oberoende av lagfärg. Alla erforderliga frames/byggstadier finns och tillåten ursprungs/licens dokumenteras. Inga saknade sprites eller fog-/inputregressioner.

**Tester:** Fraktionsval/state-isolering, namn/frame-val, båda fraktioner/teams/directions/actions/stadier i assetvalidering, save/reset och befintliga regressioner. Browser: båda menyalternativ, riktig ekonomi/produktion, animation/strid, Load/restart och screenshots.

**Docs:** [BACKLOG.md](BACKLOG.md), [DECISIONS.md](DECISIONS.md), [GAME_DESIGN.md](GAME_DESIGN.md), [ARCHITECTURE.md](ARCHITECTURE.md), [README.md](README.md), [DEV_LOG.md](DEV_LOG.md), [assets/README.md](assets/README.md).

## RTS-068 – Fraktionsspecifika stats, kostnader och produktionsregler

**Status:** Done.

**Goal:** Koppla båda fraktionernas unitrecept till gemensam betald produktion.

**Requirements:** Kostnad, tid, supply och producerad HP kommer från fraktionsconfig. Kronförbundet behåller baslinjen. Järnklanens yxkrigare har 66 HP, kostar 18 wood/6 gold och tar 6 s. Gemensamma kö-, refund-, spawn- och ID-regler återanvänds; bas/barracks kan producera samtidigt. Fiendens ändliga budget betalar egen fraktionskostnad, med difficulty-tid plus receptets avvikelse från 5 s. Befintlig svagare enemy-stridsprofil kvarstår. UI visar faktisk kostnad, tid och max-HP. Äldre betalda köjobb behåller originalkostnad/tid efter validerad migration. Nya jobb använder valt recept; restart är färsk.

**Non-goals:** Nya units/förmågor, AI-ekonomi, ändrad movement/gathering/footprints eller generell systemrefaktorering.

**Dependencies:** RTS-067.

**Acceptance criteria:** Båda fraktioner betalar och spawnar efter eget recept exakt en gång; otillräcklig ekonomi/population/kö blockerar. Refund använder betald kostnad. Save/load/restart bevarar fraktion och giltiga köjobb, avvisar manipulerad kostnad/tid. Browser visar båda receptens kostnad/tid/HP med fungerande produktion.

**Tester:** Båda fraktioners kostnad, tid, HP, timestep-equivalence, blockerad start, refund, samtidig produktion, ändlig enemy-budget och legacy/new save-validering. Befintliga tester, typecheck, build, browser och diffgranskning.

**Docs:** BACKLOG.md, DECISIONS.md, GAME_DESIGN.md, ARCHITECTURE.md, README.md och DEV_LOG.md.

## RTS-069 – En särskild enhet eller förmåga per fraktion

**Status:** Done.

**Goal:** Aktiverbara försvarshållning/raseri för markerade stridsenheter.

**Requirements:** Kronförbundet: 25 % mindre inkommande skada. Järnklanen: 25 % mer utgående skada, även ranged/siege vid skott. Effekt 5 gameplay-s, cooldown 20 s från aktivering, inga resurser. Knapp och E-hotkey använder samma guarded command; bara markerade levande combat-units utan cooldown aktiveras. Blandad selection påverkar inte workers. Selection/orders bevaras; UI visar namn och valda units effekt/cooldown. Inga dolda mål behövs; befintlig fog-filtered combat kvarstår. Timers fryser vid paus/game over, save/load bevarar dem och restart återställer. Stora delta delas vid effektslut och använder rätt damage per tidsdel. Config innehåller balansvärden.

**Non-goals:** Nya unittyper/assets, mana, AI-aktivering, AoE-buffs, nya målregler och generell combatrefaktorering.

**Dependencies:** RTS-068.

**Acceptance criteria:** Båda förmågor ger rätt skademultiplikator under exakt effektfönster, återaktivering blockeras tills cooldown slut, workers/andra units/orders påverkas inte. Ranged skada bevaras på avfyrad projektil. Pause/terminal och fog ger ingen extra effekt eller dold information; Save/load/restart fungerar.

**Tester:** Aktivering/mixed selection/repeat/cooldown, melee/ranged/defense och upgrades, tidssteg/expiry, fog, paus/outcome/save/reset och ogiltiga timers. Alla tidigare tester, typecheck/build, browserinput/diffgranskning.

**Docs:** BACKLOG.md, DECISIONS.md, GAME_DESIGN.md, ARCHITECTURE.md, README.md och DEV_LOG.md.

## RTS-070 – Fraktionsval och balans

**Status:** Done.

**Goal:** Verifiera att båda fraktionerna kan spelas till vinst/förlust med riktiga resurser och isolerade matchval.

**Requirements:** Speltestmatris över befintliga fem scenarios/tre svårigheter med båda fraktionerna; egna kostnader och förmågor, fog-begränsade kommandon, paus/save/load, bevarade resursledger och fresh restart. Inaktivt försvar ska kunna förlora utan injicerad skada. Browser: naturlig Utposten/Normal med economy/build/produktion/attack/förmåga för båda val; fraktionsbyte/reset och terminal input/freeze kontrolleras. Dokumentera faktiska tider, kostnader, HP, begränsningar och eventuella balansändringar. Ändra bara verifierade blockerande balansvärden om testen kräver det.

**Non-goals:** Nya regler, enheter, AI-ekonomi, nya kartor, skillnivågaranti och grafikpolish.

**Dependencies:** RTS-069.

**Acceptance criteria:** Båda fraktioner har dokumenterade legala vinster och verklig defeat från enemy-attacker; val/state isoleras mellan nya matcher. Befintlig regressionssvit, typecheck/build och browser passerar. Preliminär balans redovisas utan påstående om statistiskt bevisad jämnhet.

**Tester:** Båda fraktioners beteendematris, naturlig defeat, förmågeanvändning, resursledger, Save/pause/terminal freeze och faction/state-isolering. Browser och diffgranskning.

**Docs:** BACKLOG.md, DEV_LOG.md, DECISIONS.md, GAME_DESIGN.md, ARCHITECTURE.md, README.md och RELEASE_CHECKLIST.md.

## RTS-071 – Fiendearbetare samlar guld och trä

**Status:** Done.

**Goal:** Riktig fiendeekonomi genom delade ändliga noder, last och leverans.

**Requirements:** Två initiala synliga/angripbara enemy-workers i Skirmish/Belägringen, en för wood och en för gold. Återanvänd samma movement/gathering/capacity/rate/delivery-regler med enemy-basens faktiska footprint. Noderna är gemensamma; workers och båda saldon kan inte skapa resurser eller gå negativa. Enemy-production betalar sin kostnad ur banksaldo inklusive verkliga leveranser. Ingen ny automatisk income. Global servicekö/separation/fog gäller båda sidor; enemy-workers attackerar inte eller tas i stridsgrupper. Död bokför förlorad last; basdöd stoppar arbetet. Save/load/pause/game-over/reset fungerar; äldre snapshots får inga gratis nya workers vid Load. Developer-fixturen siege-test behåller den äldre isolerade budgetprofilen.

**Non-goals:** Worker-produktion, nya noder, byggande, expansion, retreat, ekonomiprioriteringar och vision-begränsad resursupptäckt (senare tasks).

**Dependencies:** RTS-070.

**Acceptance criteria:** Enemy-workers går till riktiga noder, samlar högst 5 och levererar inom 24 px från bas-footprint. Saldot ökar först vid leverans; delade resurser och alla laster/saldon/kostnader/lostCargo bevaras. Nyproduktion betalas av faktisk enemy-ekonomi. Workers är synliga med rätt fraktionssprite endast enligt fog och kan dö av spelarattacker. Load bevarar last/orders/bank utan extra income/units.

**Tester:** Delad nod/range/capacity/delivery/ledger, depletion/base death/worker death, betald produktion efter leverans, save/migration/freeze/reset/fog och båda fraktioner; tidigare regressioner/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DEV_LOG.md, DECISIONS.md, GAME_DESIGN.md, ARCHITECTURE.md och README.md.

## RTS-072 – AI bygger farms och produktionsbyggnader

**Status:** Done.

**Goal:** Betald AI-barracks och supply-farm med verkligt worker-bygge.

**Requirements:** Nya Skirmish/Belägringen-matcher bygger en barracks först (40 wood, 64px, 5s arbete); production kräver färdig barracks och spawn sker där. AI bygger högst en farm (20 wood, 64px, 5s, +5 supply) när used+reserved närmar sig bas-cap8. Workers räknas i fysisk population; difficulty army-cap kvarstår som ytterligare gräns. Återanvänd placement/cost/construction/supply. Bounded kandidatlista och retry; ogiltig plats drar inget. Builder byter till bygge och bevarar last; efteråt gathering. Död/blocked builder kan ersättas av levande worker; en site byggs i taget. Byggnader är enemy-owned, fog-filtrerade, angripbara och riktiga hinder. Save/load/pause/terminal/restart; gamla saves får inga gratis byggnader och behåller base-production tills restart. Siege-test behåller isolerad legacy-modell.

**Non-goals:** Forge/upgrades, flera produktionsbyggnader/farms, nya units/worker-produktion, expansion, ekonomiprioritering utöver barracks/supply och nya grafiktillgångar.

**Dependencies:** RTS-071.

**Acceptance criteria:** Kostnader betalas exakt en gång; giltiga footprints utan body-överlapp eller blockerad worker-väg. Byggtid tickar bara vid nåbar worker-kontakt. Ingen ny production/spawn före färdig barracks; verklig supply begränsar köstarter och färdig farm ger +5. Blockering/död bevarar site/kostnad och begränsade retries kan återuppta. Load ger inga gratis enheter/byggnader/resurser.

**Tester:** Betalning/ogiltig placement/byggkontakt/tid, blockerad och död builder, lastbevarande, barracks-gated production/spawn, used/reserved/farm-cap, byggnadsdöd/obstacle cleanup, save/migration/reset/freeze och regressioner/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DEV_LOG.md, DECISIONS.md, GAME_DESIGN.md, ARCHITECTURE.md och README.md.

## RTS-073 – AI prioriterar ekonomi, armé och uppgraderingar

**Status:** Done.

**Goal:** En verifierbar begränsad budgetpolicy för AI-ekonomi, armé och Forge.

**Requirements:** Barracks och nödvändig supply behåller prioritet. Bygg en betald Forge (40 wood/10 gold, 5s arbete) efter minst tre levande army-units; en site åt gången. Spara resurser för Forge, sedan attack1 och defense1 (40/10, 8s vardera), medan redan betalda köjobb fortsätter. Om levande armé sjunker under tre prioriteras ersättningsarmé före nya uppgraderingar. Två befintliga workers prioriterar wood när gold-riktvärdet är fyllt och wood saknas; byt bara idle/tomma gather-orders och bevara last. Återanvänd kostnad, bygge, research och configmultiplikatorer. Enemy-upgrades påverkar endast enemy-stridsenheter, aldrig workers/byggnader/spelaren. Fog-filter och begränsade retries kvarstår. Save/load/pause/terminal/reset och betald ledger; gamla saves får ingen ny policy eller gratis Forge/levels.

**Non-goals:** Nya units, worker-produktion, expansion, ny fraktionsbalans, obegränsad planering, debug-HUD och spelarens research-policy.

**Dependencies:** RTS-072.

**Acceptance criteria:** Dokumenterad prioritet växlar utan oändliga loops. Cost dras en gång, Forge/research kräver verkligt bank/builder/tid, buff först efter research. Betalda jobs fortsätter under budget-reservation. Arméförlust öppnar nyrekrytering. Last/wood/gold bevaras under resursbyte och alla betalningar. Båda fraktioner och äldre saves fungerar.

**Tester:** Prioritetsgränser/supply/army-loss, budget/cost/time, Forge-required och cancellation vid död, korrekt enemy-only attack/defense, workers resursbyte/last/ledger, save/migration/freeze/reset samt tidigare tester/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DEV_LOG.md, DECISIONS.md, GAME_DESIGN.md, ARCHITECTURE.md och README.md.

## RTS-074 – AI expanderar och återhämtar sig efter förluster

**Status:** Done.

**Goal:** Betald återhämtning av AI-ekonomin och avgränsad expansion.

**Requirements:** Basen ersätter förlorade workers till initialt två med spelarens worker-kostnad20 wood/träning5s, en betald produktion i taget, verklig supply och giltig spawn. Unika monotona ID:n, idle/tom last, inga gratis units. Ersättningsbehov prioriteras före nya army/research-betalningar; betalda jobb fortsätter. Befintlig byggpolicy återuppbygger förlorade sites med nya kostnader. Basdöd/game-over stoppar återhämtning. Save/load/restart bevarar/resetter verklig produktion och ledger. Användaren har valt extra resursbas: högst en enemy-outpost nära befintliga noder,80wood/20gold,96px-footprint/240HP,10s arbetarbygge. Betald efter färdig barracks, minst tre levande army och attack1/defense1; befintliga noder måste ha resurser. Färdig resursbas ger en alternativ närmaste nåbar leveranspunkt och +8 supply. Tre begränsade kandidater/1s retry. Ingen worker-produktion från extra basen; huvudbasens död behåller tidigare victory-villkor. Angripbar/fog/hinder, builderbyte, kostnadsbelagd återuppbyggnad, save/reset.

**Non-goals:** Gratis income/enheter, nya resursarter, obegränsad expansion, avancerad ekonomi, ersättning efter matchslut och information-systemet i RTS-075.

**Dependencies:** RTS-073.

**Acceptance criteria:** Betald ersättning efter en/båda worker-förluster utan dubbel kostnad/spawn, fungerande nytt arbete/bygge och supply. Byggnadsförlust kan återhämtas med verkliga resurser. Betald resursbas kräver byggtid; supply/leverans gäller enbart färdig levande bas. Förstörelse tar bort dessa effekter och återuppbyggnad kostar igen. Ingen gratis ny policy vid migration.

**Tester:** Worker-kostnad/tid/supply/ID/spawnblockering, betalda jobb och prioritet, ledger/last/död, återuppbyggnad, expansion, save/migration/pause/reset samt tidigare tester/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DECISIONS.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md och README.md.

## RTS-075 – AI utforskar och använder begränsad information

**Status:** Done.

**Goal:** AI-ekonomi och strategiska anfall utgår från egen upptäckt, inte dolda spelartillstånd.

**Requirements:** Ny match har enemyKnowledge med sist observerade noder och spelarbasposition. Uppdatera minne enbart från enemy-teamets syn; ingen uppdatering av dold nodmängd. Workers söker resurser via avgränsade fasta terräng-waypoints innan gather-order mot okänd nod. Ekonomi/budget/expansion använder kända nodvärden; faktisk extraction fortsätter följa fysisk nod och ger inga extra resurser. Anfallsgrupper söker via fasta terräng-waypoints tills spelarbasen observerats, sedan mot senaste kända plats. Inga attacker på osynliga targets. Egen ekonomi och statisk arena-terrain är kända; fysisk collision/placement/spawn-validering är fortsatt auktoritativ, inte strategiskt minne. Högst en scouting-worker, lastad/buildande worker avbryts inte. Save/load/pause/restart; äldre snapshots behåller sin policy utan tillagd gratis kunskap.

**Non-goals:** Slumpmässig planner, generell scouting-armé, avancerad information/AI-ekonomi, ändrad fog för spelaren och nya kartor.

**Dependencies:** RTS-074.

**Acceptance criteria:** Dolda nodmängder/spelarpositioner ändrar inte strategiska orders/minne; synlig upptäckt gör det. Begränsat scoutflöde upptäcker resurs och bas i befintlig arena. Förlorad scout ersätts med befintlig betald recovery. Fog/attack-filter och resource ledger bevaras. Sparbart minne valideras och restart rensar det.

**Tester:** Hidden-state-par, observerad uppdatering/sista kända position, scout-order/last/begränsning, grupp-anfall utan känd bas, ekonomi/expansion-policy, save/migration/paused/restart och tidigare tester/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DECISIONS.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md och README.md.

## RTS-076 – Tre skirmish-kartor med olika terräng och resurser

**Status:** Done.

**Goal:** Tre handgjorda skirmish-kartor med olika landterräng och resursfördelning.

**Requirements:** Befintlig arena bevaras; lägg till Skogspasset och Flodkröken som enkla TS-profiler. Samma1280x960/32px, startpositioner och wood/gold-nodpositioner; tydligt olika rock/water-patches och ändliga wood/gold-mängder (arena400/300, skog500/250, flod350/400). Ingen ny stock under match. Giltiga worker/army-spawns och vägar mellan baser/noder. Terränggrafik, minimap, fog-LOS och fysisk map måste använda samma profil. Enkelt kartval i Skirmish-menyn; övriga scenarios behåller arena. Båda fraktioner, befintlig ekonomi/produktion/AI, restart och save/load bevarar kartval/stock. Gamla saves migreras som arena; okända/inconsistent map-ID:n avvisas atomiskt.

**Non-goals:** Större värld, fler noder/resursarter, slumpkartor, editor, sjönavigation, nya missions och inställningspolish i RTS-077.

**Dependencies:** RTS-075.

**Acceptance criteria:** Tre spelbara distinkta profiler; båda fraktioner kan samla/bygga/producera/anfall i varje karta. Body-clearance/nåbarhet och finite ledger verifieras. Rendering/minimap/LOS matchar nav-hinder. Save/load och restart behåller karta utan att någon profilstock blandas med annan.

**Tester:** Profilstock/terrain, spawns/resources/routes/byggplatser, fraktionsekonomi och paid fullmatch-flöde, map-save/strict migration/restart samt tidigare tester/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DECISIONS.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md och README.md.

## RTS-077 – Matchinställningar för karta, fraktion och svårighet

**Status:** Done.

**Goal:** Befintliga val appliceras konsekvent och presenteras tydligt före Start.

**Requirements:** Återanvänd befintliga dropdowns. Ren atomisk validering av scenario/map/faction/difficulty; okända värden/fält och ogiltiga par avvisas utan att ändra session. Bara menu tillåter val. Scenario-byte från skirmish till mission/survival återgår till arena; explicit alternativ karta i icke-skirmish avvisas. Visa menyns aktuella profilstock, fraktionsförmåga och begriplig difficulty-beskrivning. Start använder samma val; aktiva val låses. Pause/load/restart bevarar faktiska val och Ny match kan välja nya. Båda fraktioner x tre kartor x tre difficulties fungerar vid initiering/save/restart; äldre missionflöden bevaras.

**Non-goals:** Nya spelvärden, balans, ekonomi-HUD-polish, fler inställningar, seed/editor, persistence av menypreferenser och implementering av resultatsystemet i RTS-078.

**Dependencies:** RTS-076.

**Acceptance criteria:** Validerade val motsvarar riktig factory-data; sammanfattning följer menuval, inga dolda inkonsistenta map/scenario-par. Felaktigt event/input eller ändring under match ändrar inte val/state. Save/load/restart bevarar scenario/map/faction/difficulty och Ny match isolerar förra matchens state.

**Tester:** Atomiska invalid-patches, giltiga kombinationer/normalisering, menylåsning,18 factory/save/restart-kombinationer, faktisk browser-menu/Start/pause/load/restart och tidigare tester/typecheck/build/diff.

**Docs:** BACKLOG.md, DECISIONS.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md och README.md.

## RTS-078 – Matchresultat med ekonomi- och stridsstatistik

**Status:** Done.

**Goal:** Visa matchresultat och verifierbar ekonomi/strid efter game over.

**Requirements:** Ren härledd statistik från befintlig finite stock/banker/last/loss-ledger och monotona spawn-counter; ingen separat eventhistorik eller dubbel persistent state. Visa outcome, gameplay-tid, scenario/map/fraktion/difficulty och båda teams insamlat, levererat och netto spenderat wood/gold, tillkomna enheter, enhetsförluster och besegrade enheter. Netto spenderat inkluderar avdrag minus refunds, även betalda ofärdiga jobb; enhetsstatistik utesluter byggnader och initiala units i tillkomna. Resultatvyn syns endast efter terminal outcome, aldrig dold enemy-ekonomi under match. Game-over freeze bevarar resultat; Save/load återskapar samma vy och restart/Ny match döljer/resetter den. Legacy-saves visar enbart data som kan härledas utan hittad historik. Bas/våg/producer/dead-worker-counters och ledger används enligt verkligt state. Tydlig decimalavrundning i resultatvyn.

**Non-goals:** Gross spend/refund-eventhistorik, damage/APM, byggnads-killhistorik, konto/highscore, export, match-arkiv, ombalansering och generell HUD-polish.

**Dependencies:** RTS-077.

**Acceptance criteria:** Verklig insamling/leverans/spending/refund och produktion/död ger korrekta totals; enemy-metrics duplicerar inte shared stock. UIresultat stämmer med model efter victory/defeat och bevaras under freeze/Save/load. Start/restart har noll nya units/insamling/spend/förluster och korrekt profil. Legacy utan ekonomi-ledger ges inga gratis incomesiffror.

**Tester:** Last vs leverans, betald/refunderad queue/site, verklig spawn/death/waves/recovery, finite resource-ledger, terminal/Save/restart, UI-presenter och tidigare tester/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DECISIONS.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md och README.md.

## RTS-079 – Balans för längre skirmish-matcher

**Status:** Done.

**Goal:** Verifiera spelbar och ändlig skirmish-ekonomi över längre matcher på alla tre kartor.

**Requirements:** Kör betalda spelarstrategier för tre kartor, två fraktioner och tre svårighetsgrader. Följ faktisk insamling, leverans, kostnader, laster och förluster genom hela matchen; ingen injicerad ekonomi eller HP. Kontrollera långvarigt passivt spel och att terminal simulation fryser. Dokumentera matchtider och utfall samt begränsningen till testade strategier. Justera endast config om konkreta balansfel påvisas. Behåll budget-/fog-/kostnadsregler, ingen gratis AI-inkomst. Save/load mitt i match och resultat vid slut ingår.

**Non-goals:** Nya enheter eller system, optimal AI, multiplayerbalans, garanterad lika vinstchans, schemaändring, grafik/HUD-polish och bundle-varningen.

**Dependencies:** RTS-078.

**Acceptance criteria:** Alla 18 konfigurationer har en betald vinnande strategi inom fem gameplay-minuter; ekonomin bevaras vid observationer och matchslut. Passivt spel ger dokumenterat terminalt utfall utan gratis resurser eller oändlig simulation. Faktiska längre browserflöden verifieras om möjligt. Balansvärden ändras endast med reproducerbar grund.

**Tester:** 18 hela command-baserade matcher med kontinuerlig resource-ledger och Save/load, passiva matcher och terminalfreeze; tidigare tester, typecheck/build, browser och diffgranskning.

**Docs:** BACKLOG.md, DEV_LOG.md, GAME_DESIGN.md, DECISIONS.md, ARCHITECTURE.md och README.md.

## RTS-080 – Verifierad release av tvåfraktionsversionen

**Status:** Done.

**Goal:** Verifiera och publicera den befintliga tvåfraktionsversionen.

**Requirements:** Sammanställ aktuell scenario/fraktion/difficulty- och skirmish/karta-matris. Kör befintliga tester/typecheck/build i ren kopia. Verifiera originalassets, manifester och licens/proveniens samt Save-migrationstester. Kontrollera publicerad Pages-version mot lokal dist och browser-menu/selection/orders/save/restart/assets/ljud. Mät befintliga belastningsfixtures och budget; dokumentera faktisk metod och begränsningar. Återanvänd tidigare kontroller utan påståenden om ännu ej testade browsers eller naturlig fullmatris.

**Non-goals:** Nya gameplay-system, nya assets, extern licensiering, andra browsermotorer/mobil, deploymentplattform-byte och bundle-varningsfix.

**Dependencies:** RTS-079.

**Acceptance criteria:** Ren installation och alla checks passerar; publicerad runtime motsvarar verifierad build; tvåfraktionsflöden, save-kompatibilitet, assets och prestandabudget redovisas korrekt utan blockerande fynd.

**Tester:** Befintlig fullsuite och Save/asset-regressioner, clean install/typecheck/build, lokal/public browser och befintlig profile-browser. Dokumentation-only kräver inga nya spegeltester.

**Docs:** BACKLOG.md, DEV_LOG.md, RELEASE_CHECKLIST.md, PERFORMANCE.md, README.md och assets/README.md vid behov.

## RTS-081 – Vattennavigation och kustregler

**Status:** Done.

**Goal:** Explicita och återanvändbara land/vatten/kustregler för nästa hamnslice.

**Requirements:** Härled vatten från kartprofilens verkliga terräng. Återanvänd befintlig square-body/swept-segment/BFS för en vattenadapter; vattenkroppar måste helt ligga i vatten, landkroppar behåller reglerna. World bounds, kroppsstorlek, sammanhängande vatten och byggnadsobstacles gäller. Definiera kustfootprint som inom världen, positiv area på både land och vatten, utan sten eller befintlig byggnad. Inga självständigt sparade terrängkopior. Save/load/reset rekonstruerar samma regler från befintlig map-ID. Testa orderplan/advance/replan och land-regressioner. Browser verifierar befintliga landorders vid vatten.

**Non-goals:** Fartygsenheter/UI/produktion (RTS-082), sjöstrid, transport, ny karta, diagonalnavigation och ändrad Save-schema.

**Dependencies:** RTS-080.

**Acceptance criteria:** Vattenroute når exakta mål inom sammanhängande vatten utan att korsa land, sten eller byggnader; fel domän/storlek/gränser blockerar. Kust har tydliga geometriska villkor och ingen påverkan på landnavigationen. Save/load/reset ger samma härledda routes, tidigare beteenden bevaras.

**Tester:** Domängränser/storlek/swept segments, anslutna/separerade vattenområden, giltig/ogiltig kust, route/order/revision, Save/reset och befintliga landnavigationstest; fullsuite/typecheck/build/browser/diff.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, DECISIONS.md, GAME_DESIGN.md och README.md.

## RTS-082 – Hamnplacering och fartygsproduktion

**Status:** Done.

**Goal:** Bygg en hamn vid synlig kust och producera ett styrbart fartyg med verklig ekonomi.

**Requirements:** En hamn per spelare,64x64/grid32,40 wood/10 gold,160HP och5s faktiskt workerbygge. Använd befintligt placement-preview/cancel, builder/order-state och kustregler; giltig workeråtkomst samt fri vattenutgång krävs. Fartyg40 wood/15 gold,8s,2 supply,32px kropp/110px/s/90HP; båda fraktioner samma preliminära recipe. Befintlig FIFO max3 och refundpolicy återanvänds, kostnad dras vid enqueue. Blockerad spawn väntar utan extra kostnad. Fartyg har unika ship-ID:n, börjar idle/omarkerat, stöder klick/drag och högerklickmove i vatten; land/gather/attack stöds inte i denna slice. UI bevarar selection/orders. Global supply omfattar land och fartyg inklusive alla reservations. Save/load/pause/game-over/restart omfattar hamn/job/ships utan duplicerad ekonomi. Placeholder-hamn/fartyg tydligt märkta tills RTS-089.

**Non-goals:** Sjöstrid (RTS-083), transport, sjö-AI, nya kartor, fraktionsbalans och färdiga sjöassets.

**Dependencies:** RTS-081.

**Acceptance criteria:** Faktiskt gather→kustbygge→betald produktion→vattenspawn→selection/move fungerar för båda fraktioner. Felaktig placering/start kostar inget, FIFO/refunds/supply och blockerad utgång är konsekventa. Save/load och restart bevarar/resetter hela aktuella state. Befintliga landflöden passerar.

**Tester:** Kust/builder/exit, kostnad och construction, queue/tid/refund/pop/spawn, ID/selection/orders, Save och reset, tidigare fullsuite/typecheck/build samt browser.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, DECISIONS.md, GAME_DESIGN.md och README.md.

## RTS-083 – Stridsfartyg med distansattack

**Status:** Done.

**Goal:** Manuell fog-säker fartygsattack och verkliga motmedel vid kusten.

**Requirements:** Markerade fartyg får attack-order vid högerklick på synlig befintlig fiende. Range192 world px till target-footprint,16 damage/1,5s, projektilspeed280/lifetime3/hitRadius20; båda fraktioner samma preliminära värden. Fartyg söker giltig vattenkontakt inom range och fri skottlinje; de går aldrig upp på land. Återanvänd befintliga fixed-aim/projectile/HP/delta-regler. Vatten blockerar inte marina projektiler, sten/byggnader gör det. Dolda/ogiltiga mål tas bort från order utan informationsläcka; målbyte/move/Stop fungerar och avmarkering avbryter inte attack. Fartyg och hamn blir giltiga mål för befintliga fiender; attacker kräver deras syn och fysisk kontakt från land. Befintliga army-upgrades gäller fartyg; fraktionsförmågan för landunits gör det inte. Döda fartyg/hamn städas med supply/refs/jobs/obstacles, projektilsaves återställs och terminal freeze bevaras. Visa HP med enkel text/placeholder-projektil.

**Non-goals:** Fiendeflotta/sjö-AI (RTS-086), transport, nya kartor, automatiska marina patrol/attack-move-orders, splash och slutliga assets/ljud.

**Dependencies:** RTS-082.

**Acceptance criteria:** Betalt fartyg kan skada/döda synlig fiende med tids/range/LOS-regler. Rörelse till skjutkontakt förblir i vatten och skott skadar inte osynliga mål. Fartyg kan skadas/dö från riktiga kustattacker och hamnens death städar korrekt. Match/save/reset/input och tidigare landcombat bevaras.

**Tester:** Range/movement/contact/cooldown, fixed aim/LOS/fog/projectiles, kustdamage/death/cleanup, delta-equivalence, orderbyten, Save/migration/terminalfreeze och tidigare fullsuite/typecheck/build/browser.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, DECISIONS.md, GAME_DESIGN.md och README.md.

## RTS-084 – Transportfartyg med lastning och landsättning

**Status:** Done.

**Goal:** Betalt transportfartyg som bär befintliga egna landenheter över vatten.

**Requirements:** Hamnens delade FIFO kan producera obeväpnad transport:40wood/10gold,8s,2supply,90HP,110px/s,32px body. Fyra passagerarplatser, alla befintliga egna landtyper. Flytta markerade landenheter till synlig kust inom64px och högerklicka transporten för omedelbar lastning; ingen automatisk boarding-kö. Giltig kropp/rak fri lastkontakt krävs, annars oförändrat. Lastade enheter behåller ID/HP/archetype/wood/gold-last men blir idle/omarkerade, tas ur marksimulation/syn/selection och behåller supply. Välj transport, Landsätt, vänsterklicka synlig fri landpunkt inom64px; atomisk placering av alla passagerare på giltiga separata landkroppar, annars ingen förändring. Escape/högerklick avbryter mode. Last påverkar inte andra orders. Transport kan röra sig men inte attackera. Sänkning dödar passagerarna och bokför förlorad resurslast en gång. Save/load/restart, grupper, statistik och freeze bevaras.

**Non-goals:** Automatisk boarding/pursuit, transport-AI, ny karta, särskilda transportassets/ljud, formationer eller ändrade landcombat-regler.

**Dependencies:** RTS-083.

**Acceptance criteria:** Betald transport lastar/förflyttar/lämnar av befintliga units utan dubblering, ID-förlust eller supply-exploit. Ogiltig/full/fjärran lastning och ogiltig landsättning är säkra. Loaded units simuleras inte på land. Sänkning och Save behåller korrekta cargo/refs/resultat.

**Tester:** Betalning/FIFO/spawn, lastkapacitet/range/LOS/selection, giltig/ogiltig landsättning/occupancy, identitet/last/supply, death/save/migration/freeze; alla tester/typecheck/build och browser.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md.

## RTS-085 – Ökarta med land- och sjöstrid

**Status:** Done.

**Goal:** Handgjord skirmish-karta där vatten skiljer baserna och en betald transport kan föra armén till fiendeön.

**Requirements:** Ny karta Öarna i menyn,1280x960/32px, två åtskilda landmassor och sammanhängande vatten runt/mellan dem. Befintliga bas-/worker-spawns, wood650180; gold flyttas på denna profil till600300. Ändliga800wood/400gold på spelarön gör hamn/transport/armé möjliga utan gratis resurser. Egna giltiga kustplatser, vattenrutter och enemy-öns landningsplatser. Inga markrutter över vattnet. Terräng/fog/minimap/Save/restart använder samma profil. Enemy land-scout-waypoints hålls på fiendeön utan dold basinformation. Verifiera faktiskt betald produktion/lastning/landstigning/landstrid till victory för båda fraktioner; befintliga landkartor bevaras.

**Non-goals:** Procedural generation, fler resursnoder, transport-/sjö-AI (RTS-086), nya balanssystem eller assets. Enemy använder befintligt ändligt startkapital och kan inte ta sig över före086.

**Dependencies:** RTS-084.

**Acceptance criteria:** Öarna kan slutföras med transport och landstrid utan fastlåst resurs-/supply-progression; vatten hindrar markväg men tillåter flotta, synlig giltig landning och full Save/restart.

**Tester:** Land/vatten-connectivity/coast/spawns/finite stock/profile positions, betald transport+armé+strid för båda fraktioner, Save/migration/minimap/fog/settings; tidigare landmatrix/typecheck/build och verkligt browserflöde.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md.

## RTS-086 – Sjö-AI och landstigningsanfall

**Status:** Done.

**Goal:** Ett verkligt betalt, fog-säkert AI-landstigningsanfall på Öarna.

**Requirements:** Färsk Öarna-match ger AI konfigurerat ändligt extra startkapital120wood/30gold för hamn/transport/landarmé, aldrig passiv inkomst. AI bygger hamn864320 med verklig worker-kontakt och betalar befintliga priser. Hamnens FIFO producerar högst en obeväpnad transport med samma8s/40wood/10gold/2supply som spelaren; verklig bank/supply/spawn används. Två befintliga betalda stridsenheter går till synlig kust, lastas, korsar vatten och landsätts på giltig synlig landpunkt. Preliminär starttid Easy260/Normal220/Hard190 gameplay-sekunder. Publika terrängvägpunkter styr utforskning innan en spelarbas faktiskt observerats; mål/skott/input lämnar inte dold state. Landstigna enheter använder befintlig landstrid och kan förstöra spelarbasen. Spelarens stridsfartyg kan sänka transporten; passagerare/counters/supply/refs/resultat städas utan gratis ersättning. Save/load mitt i bygge/kö/transport/landstigning och restart/gameover fungerar. Äldre saves får inte gratis kapital eller flotta.

**Non-goals:** AI-stridsfartyg/automatisk kanonflotta, flera samtidiga transporter, återuppbyggnad av sänkt transport, workertransport/resursnoder, ny generell AI-ekonomi eller nya slutliga assets. Balans följer087.

**Dependencies:** RTS-085.

**Acceptance criteria:** Betald AI-transport lastar riktiga producerade units och genomför ett fog-säkert landstigningsanfall till basdamage/defeat. Spelaren kan stoppa anfallet genom riktig skada på transporten. Inga enhets-/resurs-/supply-duplicationer och äldre landkartor/matchsaves bevaras.

**Tester:** Verkliga priser/kontakt/timer/supply/spawn/ID och resource-ledger, boarding/landing/HP/death/städning, begränsad syn/terrängvägpunkter, mellanfas-saves/legacy migration/restart/freeze, fullsuite/typecheck/build och browserattack/counterplay.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md.

## RTS-087 – Balans mellan landarmé, flotta och transporter

**Status:** Done.

**Goal:** Verifiera ändlig ekonomi, supply och fungerande motmedel på Öarna.

**Requirements:** Spela båda fraktioner × Easy/Normal/Hard med verklig insamling och betald kasern/armé/hamn/transport till victory. Verifiera passiv defeat och betalt kanonfartyg som stoppar landstigning. Dokumentera tider, resurskostnader och supply. Ändra endast configbalans om faktiskt blockerande resultat kräver det; inga gratis resurser eller enheter. Befintliga landkartor bevaras.

**Non-goals:** AI-kanonflotta, fler transporter, nya ekonomisystem, formationer, pathfindingändringar och grafikpolish.

**Dependencies:** RTS-086.

**Acceptance criteria:** Sex fraktions-/svårighetskombinationer kan vinna med betald transportarmé; passivt spel förlorar; betalt stridsfartyg kan stoppa transporten. Resurs-/supplykostnader och balansens begränsningar är dokumenterade.

**Tester:** Betalda sexmatchers victory/counter-matriser och sex passiva matcher, resource-ledger, tidsgränser, fullsuite/typecheck/build och verkligt browserflöde.

**Docs:** BACKLOG.md, DEV_LOG.md, GAME_DESIGN.md, DECISIONS.md och README.md.

## RTS-088 – Sjöuppdrag och save/load-/fog-of-war-regressioner

**Status:** Done.

**Goal:** Ett spelbart sjöuppdrag med säkert sparat transport-/stridstillstånd.

**Requirements:** Uppdrag4 – Överfarten använder fast Öarna-profil, befintlig betald transport/armé och målet förstörd fiendebas med egen bas vid liv. Startkapital20wood/10gold och samma ändliga naval-AI; inga nya objectivesystem. Meny/restart/save bevarar uppdrag/map/fraktion/svårighet. Save mitt i own/enemy-transport och marineprojektilflykt ska ge samma fortsatta resultat, utan fog-läckor. Paus/terminalfreeze/defeat priority och gamla saves bevaras.

**Non-goals:** Kampanj, nya kartor, gratis startflotta, escortsystem och nya combatregler.

**Dependencies:** RTS-087.

**Acceptance criteria:** Uppdraget kan vinnas med betald landstigning och förloras av basdöd; samtidig defeat prioriteras. Sparad överfart/skott återställs med samma last/ID/order och synliga mål; dold state visas inte efter load.

**Tester:** Meny/map-normalisering, båda fraktioners betalda uppdragsflöde, victory/defeat/priority/freeze, transport-/projektilresume/fog, migration, tidigare fullsuite/typecheck/build och browseruppdrag/save.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md.

## RTS-089 – Presentation och ljud för fartyg och kust

**Status:** Done.

**Goal:** Sammanhängande original pixelpresentation för befintlig sjöstrid.

**Requirements:** Ersätt geometriska own/Enemy-fartyg och hamnplaceholder med repoegna assets i befintlig palett. Strids-/transportfartyg har skilda silhuetter, åtta riktningar, idle/rörelse/attack/sjunkframes, lag- och fraktionsvarianter. Hamn har tre byggstadier. HP/selection/last/projektiler förblir läsbara. Befintlig kustterräng bevaras. Lägg original kanon-/sjunkljud genom befintliga gesture/mute/volym/paus-regler; dolda händelser/reveal/hide är tysta. Reset/fog städar sprites/effects utan simulationsevents från animationer. Dokumentera källor/licens/export.

**Non-goals:** Nya gameplayregler, AI-kanonfartyg, fraktionsbalans, vattenfysik och ny renderpipeline.

**Dependencies:** RTS-088.

**Acceptance criteria:** Betalda fartyg/hamn visas med läsbara original sprites/byggstadier och riktad rörelse/attack/sjunkning, korrekt lag/fog/reset. Sjöljud fungerar i browser efter gesture och följer mute/paus utan dold informationsläcka.

**Tester:** Frames/riktning/freeze/death, naval audio-eventvisibility/throttle och assetexport; fullsuite/typecheck/build, screenshots och browseranimation/ljudkontroll.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, README.md, assets/README.md och assets/licensdokument.

## RTS-090 – Verifierad release med sjöstrid

**Status:** Done.

**Goal:** Publicerad och verifierad sjörelease, med bevarad landversion.

**Requirements:** Slutlig fullsuite med land/sjö/fraktion/map/uppdrag/save/fog/restart-matriser; strict typecheck/build. Produktionsbrowser under Pages-subpath med korrekta assets/ljud, betalda navalflöden och lokal save/reload. Mät64/128 arméer samt naval render/combat med uttryckliga loadfixtures, JSheap och10restart. Behåll befintliga budgetar och bundlevarning. Granska diff/docs/refs och publicerad runtime/Actions. Dokumentera faktisk browserprofil, resultat och begränsningar.

**Non-goals:** Nytt gameplay, balanssystem, grafikpolish, fler browsermotorer och bundle-splitting.

**Dependencies:** RTS-089.

**Acceptance criteria:** Checks gröna; land- och navalmatris samt betald browsermatch/save fungerar. Uppmätt CPU/render/frame/heap och reset ligger inom befintliga budgetar. Pages-deploy lyckas och publicerade assets/runtime motsvarar verifierat bygge; dokumentation beskriver korrekt spel/release.

**Tester:** Fullsuite/typecheck/build/diff/docs, produktions-subpath/browser/saveload/audio och betalade sjömatcher,64/128 land/navalprofil och10restart, Actions/publicruntime-kontroll.

**Docs:** BACKLOG.md, DEV_LOG.md, README.md, GAME_DESIGN.md, ARCHITECTURE.md, RELEASE_CHECKLIST.md och PERFORMANCE.md.

## Milstolpe RTS-091–120 – Spelkänsla, design och användbarhet

Gemensamt: HUD/menyer fångar input; vänsterdrag selection, mittendrag kamera. Layout verifieras1280×720 och1920×1080, paus stoppar simulation, nya gameplay-inställningar bevaras av Save/restart. Skarp pixelgrafik och dokumenterat assetursprung/licens. Visuella tasks kräver granskade screenshots, ljudtasks faktisk lyssning. Saknade assets eller ej utförda checks får inte markeras klara. Taskvis checks, docs, granskning, commit/push utan force. Endast091–096 genomförs i denna körning.

## RTS-091 – Inventera befintlig presentation och kontroller

**Status:** Done.

**Goal:** Dokumentera brister och återanvändbara funktioner i UI, grafik, ljud, kamera och input.

**Requirements:** Dokumentera nuvarande UI/grafik/ljud/kamera/input med konkreta filreferenser, återanvändning, brister och prioritering.

**Non-goals:** Ingen runtimeändring, nya kontroller eller balans.

**Dependencies:** RTS-090

**Acceptance criteria:** Inventeringen skiljer faktiskt fungerande från planerat; täcker meny, HUD, assets, ljud, kamera, input, två upplösningar och tidigare verifieringsbegränsningar.

**Tester:** Dokumentgranskning, befintliga presentation/sessiontester, typecheck/build/diff; browserinventering med screenshots.

**Docs:** PRESENTATION_AUDIT.md, BACKLOG.md, DEV_LOG.md

## RTS-092 – Bestäm visuell riktning

**Status:** Done.

**Goal:** Skapa två referensvyer: startsida och spelvy. Definiera färgpalett, typografi och HUD-layout. Stil: klassiskt fantasy-RTS inspirerat av Warcraft 2, med egen identitet och egna eller licensierade assets.

**Requirements:** Skapa två granskningsbara referensvyer för startsida/spelvy. Definiera färgpalett, font-stack, HUD-layout och egen fantasyidentitet med befintliga originalassets.

**Non-goals:** Ingen spelimplementation, nya gameplayregler, kopierade originalassets eller extern fontdependency.

**Dependencies:** RTS-091

**Acceptance criteria:** Båda referensvyerna går att öppna, visar konsekvent typografi/palett/layout i båda målupplösningar och är granskade som screenshots. Framtida HUD-delar märks som planerade.

**Tester:** Visuell browsergranskning1280×720/1920×1080, inga doc-onlytester; relevanta befintliga tester/typecheck/build/diff.

**Docs:** VISUAL_DIRECTION.md, design/references.html, DECISIONS.md, BACKLOG.md, DEV_LOG.md

## RTS-093 – Skapa fantasy-startsida

**Status:** Done.

**Goal:** Sammanhängande design med titel och huvudmeny: Campaign, Skirmish, Load Game och Settings.

**Requirements:** Sammanhängande fantasy-startsida med Campaign, Skirmish, Load Game och Settings. Återanvänd fyra fristående uppdrag utan påhittad kampanjprogression, befintlig Save och ljudkontroller. Tangentåtkomst/back återställer menyn.

**Non-goals:** Nya uppdrag, kampanjprogression, HUD-ombyggnad, nya ljud eller persistens.

**Dependencies:** RTS-092

**Acceptance criteria:** Alla fyra ingångar fungerar; Campaign visar befintliga uppdrag, Skirmish befintliga lägen; Load använder validerad Save; Settings använder befintligt ljud. Menyinput ger inga orders och matchens paus/resultat förblir nåbara.

**Tester:** Menynavigationsbeteenden och sessionregressioner; browser fyra ingångar, load-fel, start/paus/återgång, screenshots i båda upplösningar; typecheck/build/diff.

**Docs:** README.md, GAME_DESIGN.md, ARCHITECTURE.md, BACKLOG.md, DEV_LOG.md

## RTS-094 – Matchinställningar

**Status:** Done.

**Goal:** Låt spelaren välja karta, fraktion, svårighet och spelhastighet. Visa kort beskrivning av karta och svårighetsgrad.

**Requirements:** Matchformulär med karta/fraktion/svårighet och separat spelhastighetsval. Visa karta/svårighetsbeskrivningar, bevara låsta uppdragskartor och validerade startval. I denna task är endast1× tillgängligt;0.75× införs funktionellt i108.

**Non-goals:** Beginner/balans107, tidskalning108, settingspersistens119, nya kartor.

**Dependencies:** RTS-093

**Acceptance criteria:** Startval motsvarar verklig match; kartlås och beskrivningar korrekta. Speed visar1× och förklarar framtida0.75× utan fungerande låtsasval. Save/restart behåller existerande options.

**Tester:** Options/sessiontester, beskrivningar/invalid/fixed map; browser fraktion/map/difficulty/start/restart, båda upplösningar; typecheck/build/diff.

**Docs:** README.md, GAME_DESIGN.md, ARCHITECTURE.md, DECISIONS.md, BACKLOG.md, DEV_LOG.md

## RTS-095 – Spelvy som fyller webbläsarfönstret

**Status:** Done.

**Goal:** Dölj startsidan helt när matchen börjar. Anpassa canvas och HUD vid resize. Verifiera korrekta input-koordinater efter storleksändring.

**Requirements:** Separat start- och spelvy; spelområdet använder fönstrets tillgängliga yta med responsiv canvas och nuvarande HUD. Resize uppdaterar Phaser-kamera/skalning utan att ändra world pixels/32pxgrid eller matchstate. Sessionknappar får egen spelverktygsrad.

**Non-goals:** Slutlig top/bottom HUD097–101, zoom, nya kameragester102–103 och fullscreen104.

**Dependencies:** RTS-094

**Acceptance criteria:** Startsida helt dold under match, canvas/HUD inom viewport i båda målupplösningar och efter resize; korrekta klick/drag/move/worldcoords med pan. Ingen gameplayinput genom HUD och paus/gameover bevaras.

**Tester:** Layoutmått/camerabounds och befintlig inputregression; browser resize medan playing/paused, klick/drag/move, HUD-isolering och Save/restart; screenshots; typecheck/build/diff.

**Docs:** README.md, ARCHITECTURE.md, DECISIONS.md, BACKLOG.md, DEV_LOG.md

## RTS-096 – Engelska i hela spelet

**Status:** Done.

**Goal:** Översätt menyer, HUD, tooltips, felmeddelanden, uppdrag, tutorial och resultat. Samla UI-texter på ett enkelt, konsekvent sätt.

**Requirements:** Engelska i all synlig meny/HUD/tooltips/feedback/uppdrag/tutorialguide/resultat samt dynamisk gameplayfeedback. Samla texter enkelt i konsekvent TypeScript-textmodul; stabila IDs och Saveformat bevaras. Docs kan vara svenska.

**Non-goals:** Nytt tutorialsyst109, i18nframework, nya språkval eller gameplayförändring.

**Dependencies:** RTS-095

**Acceptance criteria:** Synlig UI och användarvända fel är engelska; båda fraktioner/alla befintliga uppdrag/queue/resultat/Savefel omfattas. Inga språkberoende villkor eller bruten Save/ID.

**Tester:** Presentation/config/feedback/Save-sessionregressioner och textinventering; browser menu/match/paus/Savefel/resultat/uppdragsguide/screenshot; typecheck/build/diff.

**Docs:** README.md, GAME_DESIGN.md, ARCHITECTURE.md, DECISIONS.md, BACKLOG.md, DEV_LOG.md

## RTS-097 – Top bar

**Status:** Done.

**Goal:** Visa menyknapp, gold, wood och använd/max population utan att dominera världen.

**Requirements:**48px topprad med Menu, levererat gold/wood och population. Visa reserverad supply separat; inkludera fartyg/passagerare enligt befintlig matchPopulation, aldrig enemy/dolda resurser. Menu öppnar befintlig pausad sessionkontroll; playing visar bara kompakt rad. HUD-input får inte påverka selection/orders; pause/Save/restart/resize bevaras. Engelska texter och originalpalett.

**Non-goals:** Ny pausmeny104, bottom/action/grupp/minimap098–101, balans eller nya ekonomiregler.

**Dependencies:** RTS-096.

**Acceptance criteria:** Raden är läsbar och ryms1280×720/1920×1080, verklig insamling/produktion uppdaterar saldo/supply; Menu pausar och ger åtkomst till befintliga controls utan gameplayläckage. Inga dubbla fullstora ekonomirader i sidopanelen; detaljstatus kan vara kvar.

**Tester:** Bank vs cargo/fog, reserverad supply/ships, paus/Save/reset; relevanta presentation/session/economytester, typecheck/build/diff. Browser två upplösningar, gather/train/Menu/pause/Save/restart och granskade screenshots.

**Docs:** BACKLOG.md, DEV_LOG.md, README.md, GAME_DESIGN.md, ARCHITECTURE.md.

## RTS-098 – Bottom bar: selection-information

**Status:** Done.

**Goal:** Visa vald enhets eller byggnads namn, porträtt, HP och relevant statistik. Hantera tom selection.

**Requirements:**170px bottom bar med befintligt originalporträtt/frame, engelskt fraktionsnamn, aktuell/max HP och konfigurerad speed/supply/range/damage eller last/byggstatus. Befintliga valbara base/barracks/harbor och alla land-/sjöroller omfattas. Grupper visar antal och gemensam HP; inga nya selectionregler. Tom selection visar tydlig instruktion utan gammal data. Uppdateras vid damage/order/selection/restart; panelen får inte ge worldinput.

**Non-goals:** Gruppikoner/kö100, actions099, ny byggnadsselection, nya assets/stats/balans, enemyinspektion.

**Dependencies:** RTS-097.

**Acceptance criteria:** Läsbar170pxpanel1280×720/1920×1080 med canvas inom fönstret. Rätt fraktions-/rollnamn, porträtt och HP/stats för befintliga typer. Klick/drag/tom selection och buildingselection uppdaterar utan orders eller selectionläckage. Paus/Save/restart bevaras.

**Tester:** Pure panelmodel: empty/group, faction/roles, live HP/cargo, ships/buildings/missing selection, no hidden enemy data. Relevanta presentation/selection/Save/sessiontester; typecheck/build/diff. Browser två upplösningar, worker/base/group/empty/order/restart och granskade screenshots.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, README.md.

## RTS-099 – Kontextuell action panel

**Status:** Done.

**Goal:** Visa rätt actions för aktuell selection: bygga, träna, uppgradera och ge orders. Visa kostnader, hotkeys och orsaker till disabled actions.

**Requirements:** Befintliga knappar/callbacks flyttas till höger i bottom bar. Worker visar build/stop; landcombat attack-move/ability/stop; transport unload/stop; warship stop och befintlig right-click attack. Base visar workertraining samt forge-research (ingen ny forge-selection); barracks/harbor visar sina recept. Blandad selection visar unionen av relevanta actions. Visa faktiska kostnader, befintliga hotkeys och synlig disabled-reason. Ingen ny ordermekanik; instruktion för right-click move/gather/attack. Paus/outcome blockerar allt gameplay. Ny preview kräver tillräcklig bank; kostnaden dras fortfarande bara vid giltig placering.

**Non-goals:** Ny byggnadsselection, kö/grupp100, nya ordertyper/balans/assets, minimap101.

**Dependencies:** RTS-098.

**Acceptance criteria:** Inga irrelevanta actions för tom selection/annan roll. Kostnad/hotkey och blockeringsskäl stämmer med config/produktion/supply/byggstatus/ability. Panelen ryms båda målupplösningar; klick/hotkeys använder samma callbacks utan selection/orderläckage eller dubbel betalning. Research är tillgänglig via vald base och befintlig forge.

**Tester:** Context union och tom state, bank/supply/queue/construction/unique-building/research/cooldown/pause; relevanta action/production/placement/hotkey/sessiontester. Typecheck/build/diff. Browser worker/base/paidtraining/build/cancel/context/pause/restart och screenshot1280×720/1920×1080.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md, README.md.

## RTS-100 – Gruppselection och produktionskö

**Status:** Done.

**Goal:** Visa enhetsikoner för grupper samt produktionskö, progress och möjlighet att avbryta. Definiera hur blandad selection presenteras.

**Requirements:** Grupper visar en originalikon per markerad egen land-/sjöenhet i befintlig unitordning, med namn/ID/HP som tooltip/accessibel etikett; inga nya selectiongester. Blandad selection behåller total HP och union-actions från099. Vald base/barracks/harbor visar befintlig FIFO-kö med rollikon, active/queued, återstående tid och progress. Färdig blockerad spawn visas waiting for free exit. Klick avbryter samma jobb via befintlig callback/refund (active50%, queued100%). Paus/ended blockerar cancellation; timer/progress fryser. Rensa vid selectionbyte/död/restart.

**Non-goals:** Ny kö-/refundmekanik, portraitsassets, selection-subgrupper, nya orders/balans.

**Dependencies:** RTS-099.

**Acceptance criteria:** Blandad land/navygrupp och befintliga treköplatser visas korrekt. Exakt rätt jobb avbryts utan order/selectionläckage; refund/supply återanvänds. Progress följer gameplaytid, queued0%, färdig blockerad100%; pause/load/restart uppdateras. Panelen ryms1280×720/1920×1080, större grupper får intern scroll.

**Tester:** Group IDs/faction/role/HP och empty; selected queue/FIFO/progress/blocked/refund/pause. Befintliga queue/population/navy/selection/Save/sessiontester. Typecheck/build/diff. Browser verklig grupp, betald queue/progress/cancel/refund/pause/restart och screenshots båda målupplösningar.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md, README.md.

## RTS-101 – Minimap ovanpå spelvyn

**Status:** Done.

**Goal:** Placera minimap som overlay i nedre vänstra hörnet. Bevara kameraindikator, fog of war och klicknavigation. Undvik överlapp med actions och inputläckage till spelvärlden.

**Requirements:** Befintlig200×150 DOM-minimap i spelvyns nedre vänstra hörn, ovan canvas men ovanför bottom bar. Samma fog/kameraindikator och clamped vänsterklicknavigation. Egna navy-markers ska få verklig matchstate. Minimap högerklick ger varken context menu eller orders; UI-release avslutar worlddrag utan selection. Navigation bara under playing; paus/ended/menu blockerar den. Samma sceneägda listeners, borttagna på shutdown.

**Non-goals:** Ny minimaprendering/mapdata/zoom, kamera102–103, flytt av övrig statuspanel, nya orders/balans.

**Dependencies:** RTS-100.

**Acceptance criteria:** Overlay ryms1280×720/1920×1080 och överlappar inga bottom-actions; kameraindikator uppdateras när klick flyttar/clampas. Fog döljer enemy/nodeinfo som tidigare. Vänster-/höger-/mittklick på minimap ger inga selection/orders/byggplatser. Worlddrag-release på HUD avbryts. Resize/Save/load/restart bevaras utan dubbla listeners.

**Tester:** Befintliga minimap/fog/camera/viewport/navy/session/selectiontester; typecheck/build/diff. Browser båda upplösningar, hörnklick/kameraclamp, inputisolation inklusive worlddrag-release, pause/resize/Save/load/restart, granskade screenshots.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, README.md.

## RTS-102 – Kamerapanorering

**Status:** Done.

**Goal:** Inför kantpanorering, tangentbord och mittenknappsdrag. Behåll vänsterdrag för enhetsselection. Begränsa kameran till kartans gränser. Panorera inte när menyer eller HUD fångar input.

**Requirements:** Piltangenter och16px edge-zon innanför faktisk kameraviewport panorerar480worldpx/s (config), normaliserad diagonal. Keyboard tar företräde framför edge. Befintlig mittendrag bevaras; ingen automatisk pan under vänster-/mittendrag. Endast playing, aktivt fönster och worldinput; HUD/minimap/menu/fields/buttonfocus blockerar. Blur rensar held keys/gestures. Clampa världen vid varje pan och resize. Kameratid är riktig UI-delta (max100ms per frame), oberoende av framtida gameplay-speed. A/S/W/D behåller befintliga hotkeys.

**Non-goals:** Space/Home/preferences103, zoom/follow, minimapförändringar, order/selection/balans.

**Dependencies:** RTS-101.

**Acceptance criteria:** Fyra riktningar/diagonal och gränser fungerar, motsvarande realtid ger samma pan; viewport större än karta låses. Worlddrag selection och moveinput efter pan använder worldcoordinates. HUD/pause/blur ger ingen pan eller stale held key efter återkomst. Mittendrag förblir fungerande.

**Tester:** Pure direction/pan för keyboard/edge, motsatt input, diagonalhastighet, timestep/clamp. Relevanta camera/viewport/keyboard/selection/sessiontester, typecheck/build/diff. Browser båda målupplösningar: arrows/edge/middle, HUD/pause/blur/focus, worldclick/drag efter pan, restart/resize och screenshots.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md, README.md.

## RTS-103 – Kameragenvägar och inställningar

**Status:** Done.

**Goal:** Lägg till Space för selection, Home för basen samt inställningar för panhastighet och kantpanorering.

**Requirements:** Space centrerar valda egna enheter/gruppens bounding center eller befintlig vald byggnad; tom selection är no-op. Home centrerar egen bas. Clampa världens gränser. Gameplay-only keyboardfocusguard och ingen Ctrl/Meta/Alt/repeat-konflikt; ändrar inga orders/selection. Settings erbjuder240/480/720px/s och edge-pan on/off; standard480/on. Samma settings tillgängliga via pausade sessioncontrols och överlever restart/menynavigation inom appen. Ingen lokal persistence förrän119. Piltangenter/mittendrag fungerar med edge off.

**Non-goals:** LocalStorage/settings119, follow/zoom, nya order/selectiongester, pausmeny104.

**Dependencies:** RTS-102.

**Acceptance criteria:** Rätt center/clamp för grupp/building/base/empty, hotkeys blockerade i UI och paus. Ändrad speed används faktiskt av arrows/edge; edge off blockerar bara edge. Settings-input ger inga gameplayorders/selection och bevaras vid restart. Läsbart1280×720/1920×1080.

**Tester:** Pure focus/empty/group/building/navy/clamp, shortcutguards och preferencesvalidation/defaults. Relevanta camera/keyboard/hotkey/sessiontester; typecheck/build/diff. Browser båda upplösningar: Space/Home, verklig speed/edge-toggle, UI/pauseblockering, restart/preferences, screenshots.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md, README.md.

## RTS-104 – Pausmeny och fullscreen

**Status:** Done.

**Goal:** Esc öppnar pausmeny med Resume, Save, Load, Settings och Quit to Main Menu; separat fullscreen-val. Avbruten återgång bevarar matchen.

**Requirements:** Befintlig sessionpanel blir centrerad modal/backdrop med fokusfälla; callbacks/Save/result/restart återanvänds. Menu/P/Escape öppnar paus, tidigare Escape-previewcancel bevaras. Settings visar befintliga audio/camera/display-controls och Back. Quit öppnar confirm/cancel; endast Confirm anropar befintlig new-match. Escape/P backar subpage/confirmation utan quit, main resume. Paus fryser gameplay/kamera/input; resultat efter ended behålls. Separat fullscreen via browser-API från playing topbar och Settings, med ärlig unsupported/error-status, utan matchreset eller gameplay-speedpåverkan.

**Non-goals:** Saveformat/persistence119, nya ljud/gameplaysystem, browserdeployment/bundlefix.

**Dependencies:** RTS-103.

**Acceptance criteria:** Alla menyvägar och keyboardfocus fungerar i båda målupplösningar. Quit cancel lämnar match/order/selection/bank/queue/kamera bevarade och pausade; confirm går till home. Save/load återkommer pausad. Fullscreen enter/exit bevarar state och ResizeObserver/camera bounds. Inga dubbla listeners vid restart.

**Tester:** Pausnavigation/back/escape/quit-cancel utan resume; fullscreen request/exit/failure via adapter. Relevanta presentation/session/Savetester; typecheck/build/diff. Browser båda upplösningar: Escape/Menu, tabtrap, Settings/Back, Save/load, Quit cancel/confirm, fullscreen enter/exit, restart och screenshot.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md, README.md.

## RTS-105 – Order- och actionfeedback

**Status:** Done.

**Goal:** Visa tydliga move- och attack-markeringar. Ge begripliga besked, exempelvis Not enough gold, Population limit reached och Cannot build here.

**Requirements:** Befintliga selected-order markers får tydlig typ: green move-ring, red attack/attack-move crosshair, gold work-ring och red blocked-X. Navy stöds; inga dolda enemypositioner exponeras. Återanvänd aktuell orderstate, rensa vid completion/selection/death/restart. Synlig statusrad visar live placerings-/route-/rallyfel och modeinstruktioner; Cannot build here med befintligt skäl. Disabled actions anger wood/gold-brist korrekt och Population limit reached. Zero-cost-label är Free. Feedback är presentation utan debit/orderförändring; aria-status uppdateras bara vid förändring.

**Non-goals:** Attackvarningar106, nya order-/placementregler, nya bilder/ljud, stora refaktoreringar.

**Dependencies:** RTS-104.

**Acceptance criteria:** Move och attack visuellt åtskilda och följer verkliga orders. Hidden target ger ingen attackmarker; ingen stale marker efter nytt mål/Stop. Invalid placement och resurs/supplybrist är begripliga och lämnar ekonomin oförändrad. Status och HUD-actions ryms båda upplösningar; pause/restart rensar relevanta transientlabels.

**Tester:** Ordertyp/blocked/attack-move/visible target/cleanup; resource deficitwood/gold/båda, route/rally/placement/modefeedback utan mutation. Relevanta orders/navigation/placement/economy/presentationtester; typecheck/build/diff. Browser riktiga move/block/placement/moneyflöden och paid soldier/visibleattack om möjligt, screenshots båda upplösningar.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, README.md.

## RTS-106 – Attackvarningar

**Status:** Done.

**Goal:** Signalera faktisk skada mot egna basen, byggnader och enheter visuellt och med ljud utan spam.

**Requirements:** Phaserfri presentationpolicy jämför egna HP-snapshots, inklusive ships/passengers och förstörda objekt. Bas prioriteras framför andra byggnader/enheter. Synlig English status samt world-ring på senaste egna skadepositionen. Global varningscooldown3gameplaysekunder och visning4sekunder i config; inga attacker eller fiendepositioner röjs. Kort befintligt original-commandljud med lägre pitch används som varningscue via effects/mute. Paus/end/start/load/restart får inte skapa falska eller gamla varningar; presentationstate sparas inte. Ingen ändring av HP/orders/selection/kamera.

**Non-goals:** Nya gameplayregler, automatisk kameraflytt, ljudmix117, tal118, nya artwork eller balansändringar.

**Dependencies:** RTS-105.

**Acceptance criteria:** Verklig bas-/unit-skada signaleras även utan selection. Kontinuerlig skada utlöser högst en varningscue per3s. Friendly spawn/boarding/load/selection orsakar ingen varning. Paus/end tyst och restart rensad; mute/effects respekteras. Feedback ryms1280×720/1920×1080 och döljer inga controls.

**Tester:** HPminskning/destruction/prioritet/cooldown/expiry, nya objekt/boarding utan false positives, pause/end/reset och read-only. Relevanta presentation/audio/session/combat/navytester; typecheck/build/diff. Browser riktiga enemywaves som skadar workers/base, cooldown/paus/restart, audio decode/dispatch (ingen akustisk lyssningsclaim).

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, README.md.

## RTS-107 – Svårighetsgrader

**Status:** Done.

**Goal:** Fyra tydliga configstyrda profiler Beginner/Easy/Normal/Hard; Beginner ger längre prep, mindre anfall och långsammare armyutveckling.

**Requirements:** Beginner: enemy initial20wood/5gold, armycap3,12s produktion, group1, reserve0/maxdefenders1, förstattack120s (+befintlig economygrace),30s dispatchgap; survivalwaves120/180/240s en enhet pervåg. Custommissionwaves +30s/count−1(min1). Islands transportlaunch320s. Easy/Normal/Hard bibehålls exakt; custommissionjusteringar flyttas till samma profileconfig. Player costs/HP/gather/movement och gameplayspeed oförändrade. Menu/URL/summary/Save/load/restart accepterar Beginner; invalidval behåller befintliga defaults. Alla skillnader inklusive custommission/islandstider dokumenteras.

**Non-goals:** Separat speed108, tutorial109, empirisk nybörjarbalans110, statcheats, nya AIbeteenden/maps.

**Dependencies:** RTS-106.

**Acceptance criteria:** Verklig Beginner fördröjer första wave/dispatch och armyproduktion, färre/senare anfall än Easy. Alla fyra kan startas och laddas med rätt val; restart bevarar profil. Ingen regression av tre gamla profiler eller configmutation. Browser visar rätt English profile/details och inget tidigt anfall.

**Tester:** Alla profilegränser/cap/budget/produktion/dispatch, defaultval, missionjusteringar, navylaunch, Save/load/restart, stats/speedoförändring och configisolation. Relevanta difficulty/missions/settings/Save/session/navaltester samt fullsuite inför commit; typecheck/build/diff. Browser Beginner/Summary/prep/Save/load/restart vid båda upplösningar.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md, README.md.

## RTS-108 – Separat spelhastighet

**Status:** Done.

**Goal:** Spelhastighet0.75×/1× är separat från difficulty och skalar hela gameplay-steget gemensamt.

**Requirements:** Configtyp/validering för två speedvärden,1×default. Val i setup samt English summary. Session/options/Match metadata bevarar valet; låst under pågående match. En gemensam skalning av scene→gameplay-delta för updateMatch/animationer/attackwarningtimers. Movement/combat/gather/production/construction/research/AI/waves/navy får samma gameplaytid; ingen individuell eller dubbel skalning. UI/kamera/nativeAudio uppspelning oförändrad. Paus/menu/end/skipFrame=0tid. Restart och Save/load bevarar speed; äldre config16saves får1×via migration17. Invalidspeed avvisas.

**Non-goals:** Difficultybalansändring, live speedslider, tutorial109, ljudtempoändring, fixed timestep.

**Dependencies:** RTS-107.

**Acceptance criteria:** Samma realtid0.75× ger75% gameplaytid; motsvarande gameplaytid ger samma state över alla befintliga system. Difficulty/speed väljs oberoende. UIcamera reagerar lika; inga walltimehopp efter resume/load. Save/restart och äldre saves fungerar.

**Tester:** Speeddelta/default/invalid/phase/skipFrame, optionlock/isolation, alla systemsamma gameplaytid samt faktisk movement/gather/queue/AI/wave/combatprogress, Save17/16migration/tampering/restart. Relevanta session/Save/settings/timers/regressionstester; typecheck/build/diff. Browser båda speedval med riktigt move/produktion, pause/load/restart och kamera i båda upplösningar.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md, README.md.

## RTS-109 – Tutorial-uppdrag

**Status:** Done.

**Goal:** Ett guidat uppdrag lär ut selection, movement, woodleverans, byggande, produktion och manuell attack utan tidig anfallspress.

**Requirements:** Tutorial i Campaign, fast Arena och start40wood/10gold. Sex steg i ordning: välj worker; ge move-order och flytta minst32px; leverera20wood; färdigställ barracks; producera soldier; välj soldier och högerklicka träningsmålet tills det är dött. English mål/status visar aktuellt steg och genomförda steg. Alla vanliga inputs/economy gäller; inga gratis byggnader/units/debits. Ingen AI/wave före stridssteget. En stationary idle enemy spawnar på giltig ledig synlig position nära barracks först efter riktig produktion; soldier autoacquisition väntar på manuellt command i lektionen. Inga enemyattacks i tutorialen. Victory efter alla steg; defeat behåller företräde. Paus, Save/load och restart bevarar/återställer tutorialstate korrekt och ingen dubblerad target. Fristående progression/selection-positionmilestone och värden i config. Speed/difficulty oberoende, ingen ny balans för andra scenarios.

**Non-goals:** Guided overlays på varje control, inputlås, nya maps/assets, avancerat tutorialframework, verkligt nybörjarspeltest110.

**Dependencies:** RTS-108.

**Acceptance criteria:** En spelare kan genomföra sex tydliga mål och nå Victory med betald ekonomi, i båda fraktioner och speeds. Ingen tidsbaserad anfallspress även vid lång förberedelse. Gather räknar faktisk leverans, inte last/initialsaldo; movement kräver en move-order. Tutorial status/Englishcontrols ryms båda upplösningar. Save/load mitt i lektion och combat återupptar rätt steg/en enda target; restart fresh. Befintliga matcher ändras inte.

**Tester:** Progressionsgränser, fel order/last vsleverans, construction/paidspawn/manualattack, noearlyenemy/targetonce, pause/end/restart, Save18/17migration och invalid tutorialstate. Dedikerade faktiska betalda genomspelningar för två fraktioner/två speeds; legacy releasebots behåller alla gamla scenarios. Relevanta session/Save/mission/presentation/combat/ekonomitester, fullsuite/typecheck/build/diff. Browser hela sexstegsflödet inklusive Save/load/restart båda upplösningar.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md, README.md.

## RTS-110 – Speltest av Beginner

**Status:** Done. Användaren rapporterade 2026-10-03: ”speltestet är avklarat och det såg bra ut”. Övergripande godkännande; detaljer ej rapporterade dokumenteras i PLAYTEST.md. Ingen balansändring utan problemunderlag.

**Goal:** Verifiera att en ny spelare förstår kontrollerna, bygger ekonomi och producerar ett försvar före första Beginnerangreppet. Dokumentera observationer och justera endast utifrån resultat.

**Requirements:** En verklig spelare genomför Campaign → Tutorial och därefter Skirmish/Arena/Beginner/Crown/1× på publicerade109versionen. Dokumentera erfarenhetsnivå, browser/viewport om kända, vilka tutorialmål som var otydliga, om gather/leverans/build/train kunde hittas utan extern hjälp, om en soldier var färdig före första synliga angreppet samt bugs/frustration. Notera faktisk observation separat från automatiska kontroller och förväntade configvärden. Behövs balansändring: avgränsa den till Beginner och verifiera relevanta regressioner samt typecheck/build/browser. Låt användaren spela igen när ändringen påverkar testets slutsats.

**Non-goals:** Bot som ersättning för människan, uppdiktade observationer, automatiskt Done, nya mekaniker, obestyrkta balansändringar, grafik111–116 eller ljud117–118.

**Dependencies:** RTS-109.

**Acceptance criteria:** Verklig speltestrapport finns med tydlig slutsats för begriplighet och prep-time. Kända blockerande nybörjarproblem rättade eller uttryckligt kvarstående hinder. Eventuella ändringar har passerade kontroller och omspelat påverkat flöde. Automatiserade tester ersätter inte användarens speltest.

**Tester:** Baseline109: full822 tester, typecheck/build/diff, riktiga browserinputs i båda upplösningar och två betalda Save/load-checkpoints PASS. Dessa är tekniska kontroller, inte nybörjarobservationer. Humanprotokoll i PLAYTEST.md. Kör endast relevanta checks om faktisk kod/balans ändras; doc-only behöver inga nya tester.

**Docs:** [PLAYTEST.md](PLAYTEST.md), BACKLOG.md, DEV_LOG.md; GAME_DESIGN/DECISIONS om balans ändras.

## RTS-111 – Förbättrad pixelterräng

**Status:** Done.

**Goal:** Förbättra gräs, skog, vatten, kust och resurser med sammanhängande originalpixelgrafik.

**Requirements:** Fyra lågkontrast-gräsvarianter utan checkerboard, två vattenvarianter utan sömmar, strand/bergkanter endast mot annan terräng, diagonala kusthörn där land möter vatten. Världskanten skapar inte falsk strand. Förtydliga skogskrona/stam och gold/depleted-noder. Behåll 32px tiles, native nearest-rendering och befintliga resourceankare. Alla variationer deterministiska från tilekoordinater, inga runtime-mapgeneratorer. Exportera befintlig repo-lokal originalkälla/atlas/manifest.

**Non-goals:** Ny kartgeometri, blockerande dekor, gameplay/navigation/footprint/ekonomiändringar, animationer, byggnads-/enhetsart112–113, importerad spelgrafik.

**Dependencies:** RTS-110.

**Acceptance criteria:** Exponerade kanter och hörn följer faktisk terrain på alla fyra kartor; inga interna kustsömmar eller världskantstrand. Resource states och fog behåller modellen. Screenshots i1280×720/1920×1080 granskas för skärpa, övergångar och läsbarhet. Export, relevanta regressioner, fulltester/typecheck/build/diff passerar.

**Tester:** Frame- och kantval över alla kartor och världskanten; determinism och variation; resource states/ankare och exporterade framebounds. Befintliga navigation/maps/Save tester. Browser: terrain/fog/kamera, selection/gather, Save/load/restart; screenshots av kust och resurser i båda upplösningar.

**Docs:** BACKLOG, DEV_LOG, ARCHITECTURE, DECISIONS, assets/README och assets/ASSET_LICENSE.

## RTS-112 – Förbättrade byggnadssprites

**Status:** Done.

**Goal:** Gör byggnadstyper, byggstadier och skador tydliga med konsekvent originalpixelgrafik.

**Requirements:** Base/barracks/farm/forge/harbor för båda fraktioner och blå/röd lagfärg; tydliga egna typdetaljer även på clans. Behåll foundation/byggställning/complete och lägg ett statiskt damaged-utseende vid högst50%HP på färdiga byggnader. Construction behåller sitt steg. Samma ankare, footprint, native skala och ljus från övre vänster. Skadade portraits följer world-frame. Synliga enemies använder befintlig visionfilter; hidden HP ger ingen grafisk information. Export/manifest/licens uppdateras.

**Non-goals:** HP/balans/byggtidändringar, nya byggnader, eld/smoke-system, repair, unitart eller nya assets från originalspel.

**Dependencies:** RTS-111.

**Acceptance criteria:** Alla fem typer kan urskiljas i båda fraktioner; tre byggstadier och damaged är olika i granskade screenshots. HP-tröskel korrekt och fog/pause/Save/load/restart bevaras. Export, relevanta/fulltester, typecheck/build/diff PASS; browser/screenshot1280×720 och1920×1080 granskade.

**Tester:** Framecoverage/bounds/palett/transparens/ankare för samtliga typer/lag/fraktioner/steg; damaged-gräns och constructionprioritet; porträtt med HP. Browser: verklig betald barracksbyggnad/produktion, faktisk basskada, pause/Save/load/restart samt separat assetboard för alla framevarianter.

**Docs:** BACKLOG, DEV_LOG, ARCHITECTURE, DECISIONS, assets/README och assets/ASSET_LICENSE.

## RTS-113 – Förbättrade enhetssprites

**Status:** Done.

**Goal:** Förtydliga befintliga typer, riktningar, rörelse, attack och död, inklusive fartyg och båda fraktioner.

**Requirements:** Worker med verktyg/satchel, soldier med sköld/armor eller axe/bone, archer med hood/quiver/bow och catapult med läsbar arm/hjul. Sjötyper skiljs med lastdäck respektive kanon och fraktionsdetaljer. Förtydliga attackposer och gång/vak/sjunkning. Behåll1920land- och832navalframes, åtta riktningar, blå/röd färg, native32/64px och originalkällor. Inga animationsevents driver gameplay. Frame-ID:n, ankare, animationtimers, hitbox och fog/death lifecycle bevaras.

**Non-goals:** Nya units, stats/balans/combatändringar, ljud114/117, imported artwork, nya animation-/renderingsystem.

**Dependencies:** RTS-112.

**Acceptance criteria:** Typer urskiljbara utan selection i granskade artboards/worldscreenshots; åtta riktningar och walk/attack/death läsbara. Exportmetadata stämmer med PNG, palett/ankare/framecoverage korrekt. Relevant/fulltester/typecheck/build/diff PASS. Browser1280×720/1920×1080 med faktisk selection/move/produktion/combat samt navalflow där praktiskt; pause/Save/load/restart bevaras.

**Tester:** Exportcoverage/bounds/PNGmetadata; faktiska rastertyper/riktningar/states skiljer sig och har rätt palett/lagfärg/transparens. Animation/fog/death-regressioner; browser med betald tutorial och sjöproduktion/boarding/rörelse, separat artboard för samtliga typer/fraktioner/lag/riktningar/states.

**Docs:** BACKLOG, DEV_LOG, ARCHITECTURE, assets/README och assets/ASSET_LICENSE.

## RTS-114 – Förbättrade stridseffekter

**Status:** Done.

**Goal:** Förtydliga projektiler, träffar och död utan att skymma units/HP/selection.

**Requirements:** Riktningsorienterad arrow, stone respektive cannonball med korta trails; rent presentationsval från befintlig projectiledata. Synlig HP-minskning ger kort hit-feedback utan HP-/damageändring; inga effekter vid reveal/load/spawn. Befintliga visible landningar/misses/splash och death/sinking får läsbara lågkontrast-originalframes. Små death-dust endast för verkligt borttagna synliga landenheter; boarding/hide tysta. Cooldown/dedup/max64/livstid0.5s begränsar clutter. Markeffekter/dead sprites under units; projektiler underHP/ringar. Fog/pause/Save/load/restart och gameplay bevaras.

**Non-goals:** Combatbalans, nya vapen eller damage, gameplaytimrar/animationsevents, ljudeffekter117, gore, partikelmotor, nya externa assets.

**Dependencies:** RTS-113.

**Acceptance criteria:** Tre projektiltyper och hit/death läsbara i granskade screenshots; inga hidden-HP/reveal/deathfalsepositives. Boundedeffekter, enheter/HP/selection ovanför, paus fryser och restart/load städar. Relevant/fulltester/typecheck/build/diff PASS. Browser1280×720/1920×1080 med faktisk combat och visuellt separat riktad projectilefixture.

**Tester:** Projectileclassification/rotation, hit-HPdiff utan spawn/reveal/removefalses, pause/cooldown/max, befintliga projectile/visibility/deathregressioner, RGBA/palett/bounds/distinktaFXframes. Browserrealmanualcombat, basskada, paus/Save/load/restart; separat artboard av tre projektiltyper/faser mot unit/HP/ring.

**Docs:** BACKLOG, DEV_LOG, ARCHITECTURE, DECISIONS, assets/README och assets/ASSET_LICENSE.

## RTS-115 – En större referenskarta

**Status:** Done.

**Goal:** En handgjord större Skirmishkarta med basområden, expansionsresurser, alternativa vägar och strategiska passager.

**Requirements:** Frontier Valley1600×1152 (50×36 tiles) som nytt kartval; befintliga kartor oförändrade. Playerstart kvar, enemybase i nordöstra regionen. Norra flank,96px central torr passage och södra flank runt handritad vatten/ridge-terräng. Befintliga primaryresources plus två ändliga expansionsnoder (200wood/150gold) med unikaID:n. Återanvänd gathering/delivery, footprints, serviceköer och resourcefog/minimap/rendering för dessa noder; inget nytt resursslag eller automatiskt saldo. Mapstorlek används av placement, Save, camera/fog/minimap och terrainedges. Enemyknowledge/economy använder upptäckta noder och handskrivna scoutingvägar. Save19 validerar mapstorlek/nodkonfiguration/ledger och migrerar18/äldre kartor. Inga automatiska nya gameplayorders från UI.

**Non-goals:** Procedural generation, nya resurstyper, nya dropoffbyggnader, nyAIekonomi, ändrade enhetsstats, nya scenarios, ombyggnad av tidigare kartor116.

**Dependencies:** RTS-114.

**Acceptance criteria:** Spawns/noder/basefootprints/gatherapproaches nåbara; minst två oberoende bas-till-bas-vägar för40pxcatapult. Expansionsnoder kan upptäckas/samlas/levereras, blockerar placement och läcker inte dold mängd. Actual enemy economy bygger/producerar/anfaller; betald player-match till victory/defeat. Korrekt större camera/fog/minimap/placement och Save/load/restart. Relevant/fulltester/typecheck/build/diff PASS; browser1280/1920 och granskade kart-screenshots.

**Tester:** Kartgeometry/spawns/routes/strategisk passage, nodleverans och totalwood/gold, gemensam begränsadstock, resourcefog/minimap/placement, Save19/legacy18/tampering/nya världens gränser, paidmatch ochAI. Browsermenu→Frontier→exploration/expansionsgather→bygge/produktion, kamera/minimap/pause/Save/load/restart; actualgenomspelning ochscreenshots.

**Docs:** BACKLOG, DEV_LOG, ARCHITECTURE, DECISIONS, GAME_DESIGN och README.

## RTS-116 – Förbättra övriga kartor

**Status:** Done.

**Goal:** Kontrollera referenskartans kvalitetskriterier även på Arena, Forest Pass, River Bend och Islands; tydliga kartanpassade starttips.

**Requirements:** Inventera redan implementerade kartor och återanvänd deras geometri, resurser och AI. Startzoner ska ha nåbara noder och lediga64×64-byggplatser. Landkartor ska ha en40px-catapult-rutt mellan basregioner. Islands ska behålla separata landmassor, sammanhängande sjöväg, användbar harbor och landstigning. Lägg tydliga kartanpassade matchinstruktioner för de tre landkartorna; Islands har redan sjöinstruktion. Verifiera ekonomiska fullmatcher/AI och legacy Save18 på alla äldre kartor, fog/minimap och kamera. Åtgärda endast konkret upptäckta kartfel.

**Non-goals:** Ändra fungerande topologi/stock/balans utan fynd, nya expansioner på gamla kartor, nya AI-system, ny Save-version, större kartor131–133 eller presentationpolish.

**Dependencies:** RTS-115.

**Acceptance criteria:** Samtliga gamla mapstarts/spawns/noder och byggutrymme fungerar. Catapult når enemyregion på landkartorna; Islands land blockeras av hav men sjörutt/harbor/transport fungerar. Betald genomspelning och faktiskt AI-angrepp verifierade med relevanta befintliga tester. Config18-saves migrerar med samma karta och lager. Typecheck/build/tester/diff PASS; browser fyra kartor vid1280/1920 med granskade bilder och actual sjöproduktion/transport.

**Tester:** Geometry/resursapproach/byggyta/catapult/sea routes; legacy18 för alla äldre kartor. Befintliga maps/islands/navalBalance/regressioner och hela sviten. Browser fyra kartval/tips/fog/kamera samt betald Islands harbor/transport/ship, Save/load/restart.

**Docs:** BACKLOG, DEV_LOG, ARCHITECTURE, GAME_DESIGN och README.

## RTS-117 – Nya ljudeffekter och ljudmix

**Status:** Done — faktisk lyssning uppskjuten enligt användarens instruktion.

**Goal:** Läsbara, måttliga egna ljud för gathering, byggarbete, produktion och combat.

**Requirements:** Tre nya egna syntetiserade cues: gather, build, train; reuse befintlig musik/combat/complete/resultat. Cue från observerbar egen faktisk lastökning, minskad byggtid respektive färdig produktion, inte från order/spawn-reveal/load. Presentationssnapshot fristående från Phaser. Per-cue gain/cooldown i config; högst sex samtidiga vanliga effekter med reserverat utrymme för varning/resultat. Befintliga master/effects/music/mute och pause/menu/reset-lifecycle bevaras. Lokala PCM-masters + OGG/WAV fallback och licensdocs. Lyssna faktiskt genom gathering→bygg→produktion→combat i en match; redovisa teknisk kontroll separat från lyssningsbedömning.

**Non-goals:** Röster118, persistens119, nya gameplayevent/statvärden, ny musikkomposition, externa inspelningar eller ljudmiddleware.

**Dependencies:** RTS-116.

**Acceptance criteria:** Alla nya cues avfyras från rätt verklig aktivitet; idle/delivery/load/reveal/paus är tysta. Samtidiga workers/builders ger begränsad cuefrekvens och aktiv source-count hålls inom budget. Varning/resultat blockeras inte av lågprioriterade effekter. Volymer/mute/reset fungerar i browser och saknat OGG använder WAV utan att stoppa gameplay. Tester/typecheck/build/diff och assetvalidering PASS. Faktisk matchlyssning är uppskjuten till senare enligt användarens senaste instruktion; ingen lyssning hävdas.

**Tester:** Cargo/build/production-snapshotdiff, initial/paus/orderbyte/leverans, throttling/channelgain/concurrency/priority och engine-lifecycle med fake AudioContext; assetduration/peak/fallback. Browser faktisk tutorial gathering→building→production→combat/resultat, observerade cues och sourcebudget, pause/Save/load/restart och mute. Separat mänsklig lyssning i samma flöde.

**Docs:** BACKLOG, DEV_LOG, ARCHITECTURE, DECISIONS, README, assets/README och assets/ASSET_LICENSE.

**Verifieringsstatus:** Teknisk implementation,870tester/112filer, typecheck/build/diff, elva assetkontroller och browserflöde båda fraktionerna PASS. Användaren säger fortsätt; implementation levereras och återstående faktiska lyssning hålls öppen i RTS-120, utan påstående att den utförts. Statusraden visar korrekt11/11 från gemensam audioFiles-konfiguration.

**Senaste styrning:** Användaren skjuter upp ljudtester och matchlyssning till senare och säger gå vidare. Teknisk verifiering gäller; uppskjuten perceptuell kontroll blockerar inte senare tasks. Ingen påstådd lyssning.

## RTS-118 – Humoristiska engelska enhetsröster

**Status:** Done (lokal talsyntes; inspelade assets saknas och matchlyssning är uppskjuten).

**Goal:** Korta egna selection-/order-repliker med variation och personlighet.

**Requirements:** Egna engelska texter för worker/soldier/archer/catapult/transport/warship; tre variationer för selection och order, ingen omedelbar upprepning. En speaker per group-input; gemensam2.5s cooldown och ingen talqueue. Endast egen faktiskt vald unit eller ändrad accepterad order; UI utan unit-order, avmarkering, blockerad order, automation och fogreveal är tysta. Lokal engelsk browser-talsyntes (localService) återanvänds som uttryckligen redovisad ersättning när inspelade röstassets saknas. Ingen nätbaserad TTS eller originalspelinspelning. Mute/master/effects gäller tills separat voices-kanal119 införs. Paus/end/load/restart avbryter och rensar. Capability visas tydligt om lokal röst saknas; gameplay fortsätter.

**Non-goals:** Importera/generera olicensierade inspelningar, externa tjänster, nya fraktioner, dialogsystem, all gameplayhändelse-narration eller egen ljudmotor.

**Dependencies:** RTS-117 tekniskt implementerad; återstående lyssningsbedömning samlas i RTS-120.

**Acceptance criteria:** Variation/cooldown/en speaker/ingen queue testade; input-adapter bevarar gameplay och selection/orders. Mute/paus/reset och unavailable-fallback fungerar. Röstassetlucka redovisad; lokala voices verifieras där browsern tillhandahåller dem och faktisk röstlyssning redovisas separat i120. Relevanta tester/typecheck/build/diff och browserselection/order/regressioner PASS.

**Tester:** Speaker-role/group, accepterade orderdiffs/blocked/no-selection, variation/cooldown/busy, fake SpeechSynthesis lokala engelska röster/volym/cancel/capability; browser selection→move→gather→build→combat/Save/restart med oförändrat gameplay. Capability/faktisk hörbarhet skiljs från mockverifiering.

**Docs:** BACKLOG, DEV_LOG, ARCHITECTURE, DECISIONS, README, assets/README och assets/ASSET_LICENSE.

## RTS-119 – Inställningar och persistens

**Status:** Done.

**Goal:** Lokala användarinställningar över reload, med separat röstvolym.

**Requirements:** Versionerat separat preferences-slot för master/music/effects/voices/mute, pan speed/edge pan och menu-defaults faction/difficulty/game speed. Återanvänd audio/camera/settings; startup läser en gång och UI visar validerade värden. Spara endast explicita ändringar; ingen ändring av aktiv matchtid/saldo/orders eller Save-slot. Save/load/restart behåller egna matchoptions och skriver inte över framtida menyval. Ogiltig JSON/version/typ/range/enum ger säkra defaults per fält, storage exceptions påverkar inte sessionen. Voices följer master/mute men inte effects. Noll röstvolym/mute avbryter aktiv replik. Storagefel redovisas i settings-status utan blockerande dialog.

**Non-goals:** Campaignprogression/highscores, ny match-Save-version, fullscreen-autostart, renderingsupplösningar125, persistens av pågående selection/orders eller backend.

**Dependencies:** RTS-118.

**Acceptance criteria:** Reload bevarar fyra volymer/mute, kamera och menu-defaults; native UI återställs korrekt. Voice/effects/music-kanaler oberoende. Ogiltiga/saknade/future-version/blocked storage hanteras; ändringar gäller sessionen även när lagring misslyckas. Preferensläsning muterar inte saves/match och load påverkar inte lagrade menydefaults. Tester/typecheck/build/diff och browser settings→reload→match→pause/save/load/restart PASS.

**Tester:** Preference schema/defaults/per-field validation/storage fail/roundtrip/immutable snapshots, separata kanalgains och voice cancellation. Browser native controls, reload, saved match options versus preferences, storage failure/fallback och inga gameplay-inputeffekter.

**Docs:** BACKLOG, DEV_LOG, ARCHITECTURE, DECISIONS och README.

## RTS-120 – Samlat speltest och publicering

**Status:** Done — lyssningsdelen uppskjuten av användaren.

**Goal:** Verifiera startsida → matchval → spel → paus → resultat → ny match samt save/load. Granska grafik och lyssna igenom ljud. Verifiera GitHub Pages-versionen och publicera när checks passerar.

**Requirements:** Samlad regression av native tutorialflöde med ekonomi/produktion/combat/resultat, två fraktioner och två viewportstorlekar. Kontrollera paus/load/restart, inställningspersistens, lokal engelsk voice-capability och ljudens loader/phase/budget/fallback. Granska faktiskt renderad karta/enheter/UI. Kontrollera senaste Actions build/deploy och publikt bundle samt start/paus/save. Redovisa separat vad browserautomation kan verifiera och faktisk mänsklig lyssning av nya117/118-ljud; den senare kvarstår tills bedömning finns.

**Non-goals:** Ny gameplay, grafikpolish, nya ljud, bundleoptimering, Save-schemaändring eller implementation121 innan120 är färdig.

**Dependencies:** RTS-119; slutlig lyssningsbedömning117/118.

**Acceptance criteria:** Relevanta tester/typecheck/build/diff PASS, sammanhängande tutorialmatch och settings/save/load/restart utan pageerrors, visuellt granskad faktisk rendering, Pages senaste implementation verifierad. Lyssningsbedömning uppskjuten enligt användaren; teknisk röstacceptans eller audio-context-status är inte perceptuell lyssning. Eventuella begränsningar dokumenterade.

**Tester:** Återanvänd aktuell fullsvit878/114 från119 om inga implementationer ändras; native tutorial/audio-regression två viewports/fraktioner, settings/load-regression från119, publik Frontier→start→paus→Save, Actions och bundleverifiering. Inga tester för enbart docs.

**Docs:** BACKLOG, DEV_LOG och README med verifierad release och kvarstående kontroll.

**Verifieringsstatus:** Tekniska releasekontroller PASS:878tester/114filer, typecheck/build/diff, native tutorialmatch båda fraktioner/viewports, settings/save/load och renderingsgranskning. Actions a8c42c1 build/deploy success; publikt index-DiNwZpog.js verifierat via Voices→reload och Frontier→start→paus→Save utan pageerrors. Faktisk mänsklig lyssningsbedömning117/118 är uppskjuten enligt användaren;120 Done och etappen121–126 fortsätter.

**Senaste styrning:** Användaren skjuter upp ljudtester och matchlyssning till senare. Det tidigare lyssningskravet före Done/start121 är därmed upphävt; tekniska releasekontroller är uppfyllda och nästa etapp får börja. Detta är en senare instruktion, inte en utförd lyssningskontroll.

## Nästa godkända etapp – RTS-121–150

Användarens arbetslista: slutför RTS-115–120 först. Därefter inventering och implementation av RTS-121–126, en task åt gången, med taskvisa checks, browserverifiering, docs, commit med task-ID och push utan force. Kontrollera Pages-deploy där åtkomst finns. Historiskt etappstopp: RTS-127–150 var då endast planerade. Senaste fortsätt efter publicerad126 upphäver stoppet (se Current Focus). Fortsätt från Current Focus; denna etapp startar först efter RTS-120. Stora tasks delas i subtasks under samma ID. Saves bevaras via migration eller tydlig kontrollerad inkompatibilitetshantering. Ingen backend eller multiplayer.

Kartreferenser inför RTS-132–133 (åtkomst och faktisk granskning dokumenteras i GAME_DESIGN.md under132): [HoMM-kartor](http://modhomm3.free.fr/maps/map_english01.htm), [Warcraft II BNE](http://classic.battle.net/war2/lp/bne.shtml), [VGMaps](https://vgmaps.de/maps/pc/warcraft-ii-tides-of-darkness.php), [Fall of Lordaeron](https://www.blizzplanet.com/blog/comments/warcraft_ii_tides_of_darkness___orc_campaign_the_fall_of_lordaeron/warcraft-ii-the-fall-of-lordaeron-map). Använd geografi/expansioner/passager/tempo som referens, skapa egna kartor/assets och redovisa otillgängliga källor utan att hitta på innehåll.

## RTS-121 – Inventering och detaljplan

**Status:** Done.

**Goal:** Stäm av användarens feedback mot implementationen.

**Requirements:**

Stäm av användarens feedback mot implementationen.
Detaljera nästa etapp med acceptance criteria och tester.
Dokumentera saknade assets och öppna beslut.

**Non-goals:** Ingen ny gameplaykod eller markering av ofärdiga prerequisites som Done.

**Dependencies:** RTS-120.

**Acceptance criteria:** Stäm av användarens feedback mot implementationen. Detaljera nästa etapp med acceptance criteria och tester. Dokumentera saknade assets och öppna beslut. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Inventering mot faktisk kod och befintliga task-ID:n; dokumentlänkar och unik backlog; inga tester för enbart dokumentation. Dokumentera verkliga checks och tillgängliga assets. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Subtasks:** Inventera berörda befintliga system → implementera avgränsad vertikal slice → beteende/regressionstester → browser/granskning → docs/checks/commit/push.

## RTS-122 – Separat resultatvy

**Status:** Done.

**Goal:** Efter victory/defeat ersätts spelvyn helt av en resultatvy.

**Requirements:**

Efter victory/defeat ersätts spelvyn helt av en resultatvy.
Visa utfall, karta, fraktion, svårighet och matchtid.
Actions: Play Again, Main Menu och View Statistics.
Simulationen stoppas och matchens input avaktiveras.

**Non-goals:** Ingen ny scoringmodell, campaignprogression eller gameplaybalans.

**Dependencies:** RTS-121.

**Acceptance criteria:** Efter victory/defeat ersätts spelvyn helt av en resultatvy. Visa utfall, karta, fraktion, svårighet och matchtid. Actions: Play Again, Main Menu och View Statistics. Simulationen stoppas och matchens input avaktiveras. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Victory/defeat, stoppad simulation/input, Play Again/full reset, Main Menu och View Statistics; browser med båda utfallen, resize och Save/load. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Subtasks:** Inventera berörda befintliga system → implementera avgränsad vertikal slice → beteende/regressionstester → browser/granskning → docs/checks/commit/push.

**Detaljplan från121:** Återanvänd session ended och matchResults; separat fullskärmsresultat döljer canvas/HUD/minimap/top/bottom och pausbackdrop. Sammanfattning innehåller båda utfall, karta/fraktion/difficulty/tid. View Statistics växlar vy med Back; Play Again klickar befintlig restart, Main Menu befintlig new-match utan quit-confirm för redan avslutad match. Inga nya Savefält. Verifiera terminal load, dubbel rendering, båda utfall, tangentbord, ny match, reload/save och två viewports.

## RTS-123 – Utökad matchstatistik

**Status:** Done.

**Goal:** Visa insamlade/spenderade resurser, producerade/förlorade units,

**Requirements:**

Visa insamlade/spenderade resurser, producerade/förlorade units,
dödade fiender och byggda/förstörda byggnader.
Skilj egna borttagna units från förluster i combat.
Statistik fungerar med save/load och restart.

**Non-goals:** Ingen highscore/back-end eller egen borttagningsaction före RTS-147.

**Dependencies:** RTS-122.

**Acceptance criteria:** Visa insamlade/spenderade resurser, producerade/förlorade units, dödade fiender och byggda/förstörda byggnader. Skilj egna borttagna units från förluster i combat. Statistik fungerar med save/load och restart. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Kända resurs-/produktions-/combat-/byggtransaktioner räknas exakt en gång, egen borttagning skild från combatförlust; Save/load och restart; browserstatistik jämförs med genomförda handlingar. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Subtasks:** Inventera berörda befintliga system → implementera avgränsad vertikal slice → beteende/regressionstester → browser/granskning → docs/checks/commit/push.

**Detaljplan från121:** Summera alla noder i resursredovisningen och återanvänd befintlig unit-accounting. Lägg endast till counters som behövs för byggd/förstörd byggnad och separat egen borttagning; migration ska bevara gamla saves med uttrycklig historikbegränsning. Exakta once-per-event-tester för completion/destruction, expansion gathering, passenger/death, Save/load/restart och framtida borttagning skild från combat.

## RTS-124 – Version och changelog

**Status:** Done.

**Goal:** Visa aktuell releaseversion i top bar och huvudmeny.

**Requirements:**

Visa aktuell releaseversion i top bar och huvudmeny.
Använd en gemensam versionskälla.
Lägg till Changelog under menyn med större användarsynliga
förändringar per version.
Skilj releaseversion från senaste commit/build-ID.

**Non-goals:** Ingen omskrivning av git-historik; releaseversion är inte commit-hash.

**Dependencies:** RTS-123.

**Acceptance criteria:** Visa aktuell releaseversion i top bar och huvudmeny. Använd en gemensam versionskälla. Lägg till Changelog under menyn med större användarsynliga förändringar per version. Skilj releaseversion från senaste commit/build-ID. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Gemensam versionskälla används i båda vyerna, releaseversion skiljs från build-ID; changelognavigation och browserkontroll; relevanta regressioner. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras. Versionskälla och Changelog skapas inom tasken.

**Subtasks:** Inventera berörda befintliga system → implementera avgränsad vertikal slice → beteende/regressionstester → browser/granskning → docs/checks/commit/push.

**Detaljplan från121:** Gemensam config för release och användarsynlig changelog; rendera release på startsida och top bar. Build-ID hämtas separat vid build och får tydlig local/unknown fallback. Menylänk Changelog har Back/Escape; test av gemensam källa, lokal fallback, innehåll/navigering och browser. Inga ändrade match-Savefält.

## RTS-125 – Upplösning och skalning

**Status:** Done.

**Goal:** Erbjud renderingsupplösningar:

**Requirements:**

Erbjud renderingsupplösningar:
800x600, 1024x768, 1280x720, 1600x900, 1920x1080 och 2048x1332.
Behåll separat val för fullscreen och fönsteranpassning.
Bevara bildförhållandet; sträck inte bilden.
På mindre fönster skalas bilden ned utan klippt HUD.
Input, selection och minimap fungerar efter byte.
Inställningen sparas lokalt.
Kameran visar världen utifrån vald viewport;
kartstorlek är oberoende av upplösning.

**Non-goals:** Ingen ändrad kartstorlek/tile-storlek, viewportberoende gameplay eller bildsträckning.

**Dependencies:** RTS-124.

**Acceptance criteria:** Erbjud renderingsupplösningar: 800x600, 1024x768, 1280x720, 1600x900, 1920x1080 och 2048x1332. Behåll separat val för fullscreen och fönsteranpassning. Bevara bildförhållandet; sträck inte bilden. På mindre fönster skalas bilden ned utan klippt HUD. Input, selection och minimap fungerar efter byte. Inställningen sparas lokalt. Kameran visar världen utifrån vald viewport; kartstorlek är oberoende av upplösning. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Alla sex renderingsupplösningar, bildförhållande, skalad pointer→world-konvertering, klick/drag/minimap efter byte, fullscreen/fönsterläge, liten viewport och ogiltig lokal inställning; browserlayout utan klippt HUD. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Subtasks:** Inventera berörda befintliga system → implementera avgränsad vertikal slice → beteende/regressionstester → browser/granskning → docs/checks/commit/push.

**Detaljplan från121:** En gemensam upplösningspolicy för alla sex angivna presets och separat adapt-to-window. Skala hela DOM/canvas-layout med samma aspect-bevarande skala och centrerad letterbox; vald logisk viewport styr kamera utan world/tileändring. Persistera validerat display-val separat från match-Save; fullscreen kräver användarhandling. Testa alla presets mot små/stora fönster, pointer/drag/world/minimap, resize, Save/load och restart utan klippt HUD.

## RTS-126 – Flashigare startsida

**Status:** Done — perceptuell ljudtest uppskjuten enligt användaren.

**Goal:** Skapa egen fantasykomposition med motiv från:

**Requirements:**

Skapa egen fantasykomposition med motiv från:
Orcs, Humans, Elves, Dwarves och Goblins.
Tydlig titel och lättläst meny ovanpå illustrationen.
Diskreta animationer och stämningsljud med mute-stöd.
Förbered presentation för alla fem fraktioner utan att
visa ännu ospelbara fraktioner som tillgängliga.

**Non-goals:** Inga ospelbara fraktioner tillgängliga, inga originalspelsassets, inga nya fraktionsrosters före RTS-134.

**Dependencies:** RTS-125.

**Acceptance criteria:** Skapa egen fantasykomposition med motiv från: Orcs, Humans, Elves, Dwarves och Goblins. Tydlig titel och lättläst meny ovanpå illustrationen. Diskreta animationer och stämningsljud med mute-stöd. Förbered presentation för alla fem fraktioner utan att visa ännu ospelbara fraktioner som tillgängliga. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Originalasset/licensinventering, läsbar meny över kompositionen, endast spelbara fraktioner valbara, mute och paus/meny-lifecycle, reduced motion; browser vid små/stora upplösningar. Visuell granskning och faktisk lyssning redovisas separat. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Subtasks:** Inventera berörda befintliga system → implementera avgränsad vertikal slice → beteende/regressionstester → browser/granskning → docs/checks/commit/push.

**Detaljplan från121:** Återanvänd homeMenu och befintlig musik/gain/mute med diskreta animationer och reduced-motion. Original komposition med alla fem folk och läsbar meny; Crown/Clans är enda spelbara. Dokumentera källor/licens och saknade inspelade röster. Browser vid minsta/största upplösning samt navigation/load/mute/lifecycle. Perceptuell ljudtest uppskjuten enligt senaste instruktion.

## RTS-127 – Flera resursfyndigheter

**Status:** Done.

**Goal:** Kartdata stöder flera gold mines och flera wood-noder/skogsområden.

**Requirements:**

Kartdata stöder flera gold mines och flera wood-noder/skogsområden.
Varje fyndighet har unikt ID och egen återstående mängd.
Arbetare behåller rätt mål under gathering och leverans.
Uttömning av en fyndighet påverkar inte övriga.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-126, RTS-115.

**Acceptance criteria:** Kartdata stöder flera gold mines och flera wood-noder/skogsområden. Varje fyndighet har unikt ID och egen återstående mängd. Arbetare behåller rätt mål under gathering och leverans. Uttömning av en fyndighet påverkar inte övriga. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Flera noder med unika ID:n, egna ändliga lager, rätt orderreferens över leveransturer, oberoende uttömning och Save/load; återanvänd befintliga expansionstester. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:** Återanvänd RTS-115:s mapResources/resourceNodes, nodeId-orders och Save-validering. Verifiera alla kartors unika fyndighets-ID:n, separata lager för båda resurstyper, leverans/återgång till samma nod, oberoende uttömning och aktiv order efter Save/load. Inga nya kartor eller omstrukturering av fungerande gathering. Kör fulla checks och befintligt native Frontier-flöde.

**Verifierat:** 893 tester/119 filer PASS (156.20s), typecheck/build/diff PASS. Native Frontier-flöde 1280×720/Crown och1920×1080/Clans: primära/extra fyndigheter, leverans, minimap, Save/load och restart PASS utan browserfel. Äldre bred helper missade senare barracksplacering; den avgränsade resurskontrollen passerade. Diffgranskning utan blockerande fynd.

## RTS-128 – Selection av resurser

**Status:** Done.

**Goal:** Klick på resurs visar namn, typ och återstående mängd i bottom bar.

**Requirements:**

Klick på resurs visar namn, typ och återstående mängd i bottom bar.
Visa uttömd status.
Resursselection ersätter annan selection på ett konsekvent sätt.
Information om dolda resurser följer fog-of-war-reglerna.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-127.

**Acceptance criteria:** Klick på resurs visar namn, typ och återstående mängd i bottom bar. Visa uttömd status. Resursselection ersätter annan selection på ett konsekvent sätt. Information om dolda resurser följer fog-of-war-reglerna. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Klickselection ersätter unit/building-selection, korrekt typ/lager/uttömning, fog utan dold information; browser bottom bar. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:** Pure targetval återanvänder unit/building-hit och därefter utforskade resurser; klick på resurs ersätter selection även med Shift. Unit-/building-klick, drag och grupprecall rensar resursselection. Bottom bar visar namn/typ och synlig aktuell mängd/uttömning; utforskad men dold nod visar ingen aktuell stock. Resursselection är lokal presentation och återställs vid scenrestart/Load, utan Save-formatändring. Tester för prioritet/ersättning/fog/live stock samt native klickflöde.

**Verifierat:** 898tester/120filer PASS149.76s;18 riktade selection-regressioner PASS, typecheck/build/diff PASS. Native1280/1920: resurs/unit/bas/Shift/drag och orderbevarande PASS; separat fryst renderfixture verifierar Depleted/dold stock. Screenshot granskad utan klippt bottom bar. Inga browserfel eller blockerande diff-fynd.

## RTS-129 – Flera arbetare per resurs

**Status:** Done.

**Goal:** Flera workers kan arbeta på samma fyndighet.

**Requirements:**

Flera workers kan arbeta på samma fyndighet.
Definiera nåbara arbetsplatser och kö när alla är upptagna.
Förhindra negativa mängder och dubbel kreditering.
Workers ska vara visuellt urskiljbara vid resursen.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-128; inventera befintliga serviceköer innan ändring.

**Acceptance criteria:** Flera workers kan arbeta på samma fyndighet. Definiera nåbara arbetsplatser och kö när alla är upptagna. Förhindra negativa mängder och dubbel kreditering. Workers ska vara visuellt urskiljbara vid resursen. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Nåbara platser, tilldelning/kö, flera workers, begränsad stock utan dubbelt saldo, frigörande vid orderbyte/död och Save/load; browserurskiljbarhet. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:** RTS-064/067 har redan tre delade serviceplatser, tidsroterad kö, nåbarhetsfilter och separation. Återanvänd systemen; komplettera tester för separata samtidiga wood/gold-köer och blockerad worker utan att låsa nåbara workers. Befintliga tester täcker begränsad stock, orderbyte/död, Save/load och delning med fienden. Native betald workerproduktion ger fler än tre workers vid samma nod; granska urskiljbarhet och kö, utan fixturebank.

**Verifierat:** 900tester/120filer PASS139.56s;20 riktade kö/enemy-gatheringtester PASS; typecheck/build/diff PASS. Native1280/1920: fem betalda workers, gemensam fyndighet, leverans och kö PASS. Screenshot granskad med urskiljbara kroppar; inga browserfel/blockerande diff-fynd. Befintlig runtime återanvänd.

## RTS-130 – Visa resursbemanning

**Status:** Done.

**Goal:** Visa antal tilldelade workers och antal aktivt samlande workers.

**Requirements:**

Visa antal tilldelade workers och antal aktivt samlande workers.
Visa exempelvis “Workers: 5 assigned / 3 gathering”.
Uppdatera vid orderbyte, död, leverans och uttömning.
Vid selection kan arbetsplatser markeras diskret.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-129.

**Acceptance criteria:** Visa antal tilldelade workers och antal aktivt samlande workers. Visa exempelvis “Workers: 5 assigned / 3 gathering”. Uppdatera vid orderbyte, död, leverans och uttömning. Vid selection kan arbetsplatser markeras diskret. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Assigned/gathering vid resa, kö, gathering, leverans, död, orderbyte och uttömning; diskreta markeringar och fog-regler. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:** Härled bemanning från levande egna workers med gather/deliver-order till vald nod. Gathering kräver tillgänglig stock, fri lastkapacitet, fysisk interaktion/nådd serviceplats och aktiv serviceadmission. Återanvänd gemensam kö med enemy-workers så att upptagen plats räknas rätt. Visa Workers: N assigned / M gathering i bottom bar endast inom vision. Inga nya arbetsplatsmarkörer (valfria), köstate eller Save-fält. Tester för resa/kö/gather/delivery/order/death/depletion/fog samt native femworkersflöde.

**Verifierat:** 905tester/121filer PASS148.93s;20 riktade bemanning/selectiontester PASS efter worker-typavgränsning i fixture. Typecheck/build/diff PASS. Native1280/1920: fem betalda workers, live assigned/gathering över flera steg och orderbyte till0/0 PASS. Screenshot visar5/3 och läsbar text; inga pageerrors eller blockerande diff-fynd.

## RTS-131 – Stöd för större kartor

**Status:** Done.

**Goal:** Inför storlekarna 96x96 och 128x128 tiles i kartdata.

**Requirements:**

Inför storlekarna 96x96 och 128x128 tiles i kartdata.
Behåll befintlig tile-storlek om inget konkret problem kräver annat.
Verifiera kamera, minimap, fog of war, AI och save/load.
Mät pathfinding och rendering innan optimering.
Dokumentera prestandamål och testmiljö.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-130.

**Acceptance criteria:** Inför storlekarna 96x96 och 128x128 tiles i kartdata. Behåll befintlig tile-storlek om inget konkret problem kräver annat. Verifiera kamera, minimap, fog of war, AI och save/load. Mät pathfinding och rendering innan optimering. Dokumentera prestandamål och testmiljö. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** 96×96/128×128-kartor: gränser, kamera, minimap, fog, AI och Save/load; uppmätt pathfinding/rendering på dokumenterad miljö innan optimering. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:** Inför två enkla storlekslayouter Plains96/Plains128 (3072/4096 world pixels, tile32), med befintlig start-/AI-zon och ändliga primärresurser; full strategisk terräng hör till132/133. Verifiera hela gränser/detour, fog/minimap/kamera och gamla/nya Save. Save-config21 migrerar20 utan stateförlust. Mät synkrona routekommandon och browser update/render/RAF innan eventuell optimering; mål p95 route≤100ms, update/render≤16.7ms, RAF≤33.4ms i dokumenterad baseline-miljö. Korrigera endast konkreta storleksproblem. Browser native val/pan/order/Save-load/restart, plus aktiv AI och betald matchregression.

**Verifierat:** 934tester/122filer PASS142.57s;51 riktade map/navigation/Save/stats/setup-tester PASS efter korrigerad BFS-budget. Typecheck/build/diff PASS. Fyra production-browserkombinationer96/128×1280/1920: native karta/minimap/fjärrkamera/move/Save-load/restart PASS utan pageerrors. Profilering före/efter i PERFORMANCE.md; största1920-viewport omkring49FPS, ingen renderoptimering gjord. Diff/screenshotgranskning utan blockerande fynd. GitHub127–130 success och faktisk Pages130 native gather/selection/bemanning PASS.

## RTS-132 – Stor landkarta

**Status:** Done.

**Goal:** Handgjord karta med flera expansioner, skogar, gruvor,

**Requirements:**

Handgjord karta med flera expansioner, skogar, gruvor,
alternativa anfallsvägar och strategiska passager.
Ge startområden rimliga resurser och byggutrymme.
Dekorationer och höjdillusion får inte göra walkability otydlig.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-131.

**Acceptance criteria:** Handgjord karta med flera expansioner, skogar, gruvor, alternativa anfallsvägar och strategiska passager. Ge startområden rimliga resurser och byggutrymme. Dekorationer och höjdillusion får inte göra walkability otydlig. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Startzoner/resurser, alternativa nåbara anfallsvägar, byggutrymme och tydlig walkability; ekonomisk genomspelning, AI och browsergranskning. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:** Egen Highland Crossroads96×96, tre öppna landpassager i lång bergsrygg, lokala terrängfickor/vatten och flera ändliga wood/gold-expansioner. Befintlig spelarstart och generöst byggutrymme; egen nordöstlig enemy-zon med närresurser och författade scout/anfallswaypoints. Inga kopierade kartor/assets eller otydlig dekorativ collision. Läs/visuellt granska åtkomliga kartreferenser och dokumentera otillgängliga. Save-config22 migrerar21; verifiera nodreachability, tre oberoende korsningar för siege, byggutrymme, fog, AI/ekonomisk paid victory och native resurs-/kameraflöde.

**Resultat:** Egen96×96-karta, tre siege-passager, åtta noder, lokala AI-bygg-/samlingspunkter, verkliga produktionsgränser och Save22.958tester/124filer PASS148.96s; typecheck/build/diff och native1280/1920 resurs-, bygg-, kameraflöde/Save/restart PASS. Tidigare timeout/spawnfel rättade med regressioner. Referenser och begränsningar i GAME_DESIGN/DEV_LOG.

## RTS-133 – Stor kust- och ökarta

**Status:** Done.

**Goal:** Handgjord karta med landvägar, kust, öar och landstigningsplatser.

**Requirements:**

Handgjord karta med landvägar, kust, öar och landstigningsplatser.
Säkerställ att hamnar och transporter faktiskt kan användas.
Verifiera AI på kartan och undvik oavsiktliga dödlägen.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-132.

**Acceptance criteria:** Handgjord karta med landvägar, kust, öar och landstigningsplatser. Säkerställ att hamnar och transporter faktiskt kan användas. Verifiera AI på kartan och undvik oavsiktliga dödlägen. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Coastal placement, transport/boarding/landstigning, land-/sjörutter och AI utan oavsiktliga deadlocks; faktisk ekonomisk sjögenomspelning. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:** Egen128×128 Shattered Coast med separat västlig spelarö, nordöstlig landkust, sydlig kontinent och två resursöar i ett sammanhängande hav. Befintlig kort första överfart behåller landnings-/hamnprofil för verifierat AI-flöde; längre sjörutter leder till ändliga expansioner. Återanvänd naval-adapter med explicit map-profil och strikt Save23/migration22. Verifiera separata landmassor, coastal placement, sjörutter/boarding/landstigning på expansionsö, betald sjömatch och passiv AI-invasion, samt native hamn/transport/Save/restart. Inga nya fartyg eller AI-ekonomi-system.

**Resultat:** Egen4096×4096-kustkarta, sammanhängande hav, fyra separata landmassor plus spelarön, tio ändliga noder, explicit naval-profil och Save23.975tester/125filer PASS169.20s; typecheck/build/diff och native1280/1920 betald hamn/transport, lång sjöresa, landstigning/gathering/Save/restart PASS.

## RTS-134 – Fraktionsdesign och jämförelsematris

**Status:** Done.

**Goal:** Definiera Orcs, Humans, Elves, Dwarves och Goblins.

**Requirements:**

Definiera Orcs, Humans, Elves, Dwarves och Goblins.
Varje fraktion ska ha egna units, buildings och research.
Återanvänd tekniska grundsystem med olika data och beteenden.

Föreslagen identitet:
- Humans: balanserad armé och flexibel bas.
- Orcs: stark närstrid och offensiv.
- Elves: rörlighet och distansstrid.
- Dwarves: tålighet, försvar och siege.
- Goblins: snabb produktion, teknik och explosiva vapen.

Första roster per fraktion:
worker, melee, ranged, siege och en specialist.
Anpassa befintliga fartyg för alla fraktioner.
Definiera kostnader, styrkor, svagheter och research
innan respektive fraktion implementeras.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-133.

**Acceptance criteria:** Definiera Orcs, Humans, Elves, Dwarves och Goblins. Varje fraktion ska ha egna units, buildings och research. Återanvänd tekniska grundsystem med olika data och beteenden.  Föreslagen identitet: - Humans: balanserad armé och flexibel bas. - Orcs: stark närstrid och offensiv. - Elves: rörlighet och distansstrid. - Dwarves: tålighet, försvar och siege. - Goblins: snabb produktion, teknik och explosiva vapen.  Första roster per fraktion: worker, melee, ranged, siege och en specialist. Anpassa befintliga fartyg för alla fraktioner. Definiera kostnader, styrkor, svagheter och research innan respektive fraktion implementeras. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Jämförelsematris med fem distinkta rosters, specialist, buildings/research/fartyg, kostnader, styrkor och svagheter; docs/granskning utan implementationstester. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:** Dokumentera fem egna rosters med worker/melee/ranged/siege/specialist, stats/kostnader/tider/supply, building/research/fleet/prerequisites och styrkor/svagheter. Bevara Crown/Clans-ID:n med Humans/Orcs-presentation enligt meddelat standardförslag; inga nya runtime-fraktioner i design-tasken. Skillnad via verkliga data/combat-profiler, utan nya aura-/magisystem. Granska matrisen mot befintlig kod och task135–141, verifiera docreferenser/diff; inga tester som endast testar text.

**Resultat:** Fem fulla roster-/building-/research-/naval-matriser med stats, kostnader, specialistprofiler, prerequisites, strengths/weaknesses och legacy-ID-strategi i GAME_DESIGN. Design granskad mot befintlig kod; typecheck/build/diff/docreferenser PASS. Ingen runtime/Save-ändring eller texttest.

## RTS-135 – Fraktionsdata och research prerequisites

**Status:** Done.

**Goal:** Utöka befintligt fraktionssystem endast där det behövs.

**Requirements:**

Utöka befintligt fraktionssystem endast där det behövs.
Stöd olika rosters, byggnader, research och prerequisites.
UI visar korrekta namn, kostnader, ikoner och tillgängliga actions.
Save/load sparar stabila fraktions- och typ-ID:n.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-134.

**Acceptance criteria:** Utöka befintligt fraktionssystem endast där det behövs. Stöd olika rosters, byggnader, research och prerequisites. UI visar korrekta namn, kostnader, ikoner och tillgängliga actions. Save/load sparar stabila fraktions- och typ-ID:n. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Datadrivna rosters/prerequisites, UI-kostnad/namn/action/ikon, stabila ID:n, migrations- och Save/load-regressioner. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**135A config-roster/prerequisites och atomisk queue-admission;135B UI-namn/kostnader/ikoner/blockeringsorsak och specialistprofiler via befintlig combat;135C faction research/naval-data och stabila wire-typ-ID:n med migration;135D beteendetester/regression/browser/docs. Runtime-fraktioner läggs till i136–140, befintliga recept bevaras tills respektive fraktion införs. Ingen generell systemombyggnad; koppla faktisk data där hårdkodade värden blockerar matrisen. Done först när hela135 är verifierad.

**Verifiering:**990tester/129filer PASS166.07s; typecheck/build/diff och lokala doclänkar PASS. Native1280Crown/1920Clans betald prerequisites/research/specialist/movement/Save med explicit prototyproster PASS utan pageerrors. Dolda prototyper och generisk enemy-armé redovisas i docs.

## RTS-136 – Humans

**Status:** Done.

**Goal:** Komplettera befintliga Humans till den beslutade rostern.

**Requirements:**

Komplettera befintliga Humans till den beslutade rostern.
Egna byggnadsutseenden och research.
Verifiera ekonomi, produktion, combat och AI.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-135.

**Acceptance criteria:** Komplettera befintliga Humans till den beslutade rostern. Egna byggnadsutseenden och research. Verifiera ekonomi, produktion, combat och AI. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Humans ekonomi, roster/specialist, buildings, research, combat, AI, Save/load och egna assets i browser. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**136A aktivera fem Human-roller, siege/specialist-prerequisites, forsknings- och fartygsnamn enligt134 utan att ändra stabilt crown-ID.136B egen Banner Guard-silhuett/animation och bibehållen Human-bygggrafik.136C betald ekonomi/production/combat/AI-regression och Save24→25-migration som bevarar betalda jobb.136D native UI/browser, fulla checks, granskning/docs. AI:s befintliga betalda grundarmé verifieras här; full femrolls-AI/matchups ligger141. Done kräver synlig faktiskt användbar specialist och egna atlasramar, inte prototyp-alias.

**Verifiering:**994tester/130filer PASS165.29s; typecheck/build/diff/doclänkar PASS. Native1280/1920 Human-production/egna specialistbilder/research/movement/Save/load/attack/victory/restart PASS utan pageerrors. Betald enemy-grundproduktion/ekonomi och Human/Clans-regressioner passerar; full AI-roster141 enligt avgränsningen ovan.

## RTS-137 – Orcs

**Status:** Done.

**Goal:** Komplettera befintliga Orcs till den beslutade rostern.

**Requirements:**

Komplettera befintliga Orcs till den beslutade rostern.
Tydlig skillnad i spelstil, units, buildings och research.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-136.

**Acceptance criteria:** Komplettera befintliga Orcs till den beslutade rostern. Tydlig skillnad i spelstil, units, buildings och research. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Orcs ekonomi, roster/specialist, offensiv identitet, buildings/research, combat och AI; regressioner mot Humans. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**137A aktivera fem Orc-roller/stats/recept/namn från134, siege Forge och Raider attack1.137B egen Raider-animation/silhuett, bevara befintliga egna Orc-byggnadsbilder.137C Save25→26 bevarar äldre betalda siegejobb/tider och HP, nya jobb följer nya recept; beteende- och Human-regressioner inklusive faktiskt offensivt combat.137D native ekonomi/bygg/research/Raider/combat/Save/restart, fulla checks och granskning/docs. Full AI-roster/matchups fortsatt141; betald befintlig AI-ekonomi/grundarmé verifieras.

**Verifiering:**998tester/131filer PASS161.30s; typecheck/build/diff/doclänkar PASS. Native1280/1920 actual Orc-roster med egen Raider-art, korrigerad260/260HUD, paid economy/research/production/selection/movement/Save/combat/victory/restart PASS utan pageerrors. Paid Human/Orc-regressioner passerar; full AI-roster141 enligt avgränsning.

## RTS-138 – Elves

**Status:** Done.

**Goal:** Implementera den beslutade elf-rostern,

**Requirements:**

Implementera den beslutade elf-rostern,
byggnader, research och assets.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-137.

**Acceptance criteria:** Implementera den beslutade elf-rostern, byggnader, research och assets. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Elves ekonomi, roster/specialist, rörlighet/distansidentitet, buildings/research, combat/AI och assets; Save/load. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**138A elves-ID, fem roller/recept/stats/buildings/research/naval enligt134, True Shot och datastyrd prefix/meny.138B egna woodland-/leaf-/longbow-/ballista-unitbilder och tree/garden/workshop/dock samt naval-silhuetter i etablerade pixelkällor; export och rasterregression.138C Save26→27 med historisk ID-validering, stabila type-ID:n och beteende/ekonomi/production/projectile/buff/naval-regressioner, befintliga fraktioner oförändrade.138D nativebetald gathering/build/research/Marksman/combat/Save/restart, fulla checks/review/docs. Defaultopponent Humans via befintlig factionsForPlayer; full matchup/AI-roster141.

**Verifierat 2026-10-04:**1002tester/132filer PASS175.58s; typecheck/build/diff/doclänkar PASS. Native1280/1920 betald Tutorial/research/Marksman/combat/Save/restart samt Coast River Dock/Grove Ferry/landstigning/5wood/Save/restart PASS utan pageerrors. Originalsprites/raster granskade. Bundlevarning och uppskjuten ljudlyssning kvar; full AI141.

## RTS-139 – Dwarves

**Status:** Done.

**Goal:** Implementera den beslutade dwarf-rostern,

**Requirements:**

Implementera den beslutade dwarf-rostern,
byggnader, research och assets.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-138.

**Acceptance criteria:** Implementera den beslutade dwarf-rostern, byggnader, research och assets. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Dwarves ekonomi, roster/specialist, försvar/siegeidentitet, buildings/research, combat/AI och assets; Save/load. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**139A stabilt dwarves-ID/fem roller, alla134-recept/building/research/naval/Brace och meny.139B egna kompakt rustning/skägg/sköld/crossbow/cannon-, stone/metal-building- och ironclad/ferry-pixelbilder; ompacka unit-atlas till4096px bredd för att hålla båda dimensioner under8192.139C Save27→28 med historisk faction-validering, betald ekonomi/prerequisite/timing/försvar/projektil/naval/Save-regressioner, andra fraktioner bevarade.139D native betald ekonomi/build/research/Bulwark/combat/Save/restart, full checks/review/docs. Full NPC-roster och matchup141.

**Verifierat 2026-10-04:**1006tester/133filer PASS169.43s; typecheck/build/diff/doclänkar PASS. Native1280/1920 verklig gathering/build/Stone Plates/Bulwark/movement/Save/combat/victory/restart och separat Stone Dock/Heavy Ferry/landstigning/5wood/Save/restart PASS utan pageerrors. Spritebilder och diff granskade. Full AI141; ljudlyssning och bundlevarning oförändrade.

## RTS-140 – Goblins

**Status:** Done.

**Goal:** Implementera den beslutade goblin-rostern,

**Requirements:**

Implementera den beslutade goblin-rostern,
byggnader, research och assets.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-139.

**Acceptance criteria:** Implementera den beslutade goblin-rostern, byggnader, research och assets. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Goblins ekonomi, roster/specialist, produktion/teknik/explosiva vapen, buildings/research, combat/AI och assets; Save/load. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**140A stabilt goblins-ID/fem roller och134-recept/build/research/naval/Overcharge/meny.140B egna compact/goggle/scrap/slingshot/mortar/grenade-unit-, corrugated/scrap/lab-building- och junk/powder-shipbilder; ompacka naval till32kolumner för dimensioner under8192.140C Save28→29 historisk ID-validering, snabb produktion/atomisk ekonomi/prerequisites/splash/buff/naval/Save-regressioner, andra fraktioner bevarade.140D betalt native build/research/Grenadier/combat/Save/restart och sjöflöde, full checks/review/docs. Full NPC-roster/matchups141.

**Verifierat 2026-10-04:**1011tester/134filer PASS164.99s; typecheck/build/diff/doclänkar PASS. Native1280/1920 verklig gathering/build/Hot Powder/Grenadier/egen bild/movement/Save/combat/victory/restart och Junk Dock/Junk Ferry/landstigning/5wood/Save/restart PASS utan pageerrors. Atlasbilder/config/Save/UI-diff granskade; full NPC-roster/matchups141, ljudlyssning uppskjuten och bundlevarning kvar.

## RTS-141 – Fraktionsval, AI och balans

**Status:** Done.

**Goal:** Alla fem fraktioner fungerar som spelare och AI-motståndare.

**Requirements:**

Alla fem fraktioner fungerar som spelare och AI-motståndare.
Verifiera relevanta matchups och att AI kan använda respektive roster.
Fraktioner får inte bara vara namn- eller färgbyten.
Ingen fraktion markeras färdig med saknade gameplay-funktioner
eller tillfälliga assets utan tydlig redovisning.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-140.

**Acceptance criteria:** Alla fem fraktioner fungerar som spelare och AI-motståndare. Verifiera relevanta matchups och att AI kan använda respektive roster. Fraktioner får inte bara vara namn- eller färgbyten. Ingen fraktion markeras färdig med saknade gameplay-funktioner eller tillfälliga assets utan tydlig redovisning. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Relevanta spelar-/AI-matchups för fem fraktioner, faktisk rosteranvändning och betald ekonomi; dokumenterade balansresultat och assetluckor. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**141A val av player/enemy bland fem stabila fraktioner, alla25kombinationer möjliga, restart/Save bevarar identitet och UI ger inga orders.141B NPC-profil för faktiskt betalda melee/ranged/siege/specialist från full roster med completed prerequisites/research, rätt kostnad/tid/supply/HP/fart/range/projectile/splash; korrekta building/base/naval-recept och profiler. Behåll konfigurerade svårighets-/grupp-/ekonomi-/navalinvasionregler, inga ny avancerad AI-ekonomi.141C återanvänd combat/projektil/buff/navigation och assetroller för NPC, fog/own-target-policy/gameover/reset.141D kontrollerad Save30-migration som bevarar gamla betalda jobs/skadad HP/legacyprofiler utan healing/refund, stabila NPC-typ-ID:n och korrekta verifierade timers.141E fraktions-/roster-/atomic-economy/prerequisite/supply/combat/Save/matchup-regressioner, native betald spelare mot nya NPC-profiler, dokumenterade reproducibla balansresultat/begränsningar och fulla checks/review/docs innan Done.

**Konkreta acceptance criteria:** Alla25identitetskombinationer initialiseras/sparas/återställs; AI tränar faktiskt varje tillgänglig combatroll när dess betalda prerequisites är avslutade och använder egna profiler. Army/ships/workers räknas med faktisk supply; inga gratis units/research eller överdebitering. Ny NPC-ranged/siege/specialist använder rätt projektil/splash och visuell roll, HP/fart/attack/defense kommer från vald faction. Aktiva timers/research/AI/jobb överlever Save/load; äldre matchstate ändras inte retroaktivt. Native input/menu/matchflöde utan fångade runtime-fel. Initial balans dokumenteras med miljö/scenario/mätning utan obestyrkt löfte om lika win-rate. Fullsvit/typecheck/build/diff/doclänkar passerar.

## RTS-142 – Campaign-struktur och progression

**Status:** Done.

**Goal:** Återanvänd befintligt scenario-system.

**Requirements:**

Återanvänd befintligt scenario-system.
Campaign-meny visar uppdrag, upplåsning och genomförda nivåer.
Stöd briefing, mål och debriefing.
Spara progression lokalt; replay av avklarade uppdrag är möjligt.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-141.

**Acceptance criteria:** Återanvänd befintligt scenario-system. Campaign-meny visar uppdrag, upplåsning och genomförda nivåer. Stöd briefing, mål och debriefing. Spara progression lokalt; replay av avklarade uppdrag är möjligt. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Unlock/completion, replay, briefing/mål/debriefing, lokal progression med ogiltiga/saknade värden och Save/load. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**142A använd de fem befintliga scenarios som ordnad campaign med stabila mission-ID:n: Tutorial → Forest Watch → The Siege → The Outpost → The Crossing. Endast första uppdraget är initialt upplåst; faktisk victory låser nästa, defeat gör det inte. Avklarade uppdrag kan spelas om.142B lokal separat versionsmärkt progression med robust hantering av saknade/ogiltiga värden och storagefel; idempotent completion, ingen backend/scoring.142C Campaign-menyn visar låst/upplåst/avklarat, briefing och verkligt mål; låst start nekas även i logik. Resultat visar debriefing och upplåsning. Skirmish och äldre standalone/Save-flöden bevaras.142D campaign-run-ID följer paus/Save/load/restart och återställs vid ny Skirmish; kontrollerad Save31 från30 utan påhittad historisk progression.142E unlock/defeat/replay/corrupt storage/Save/reset-tester, native betald Tutorial → debriefing → nästa uppdrag → replay/Save/load och regressionschecks. Åtta uppdrag/story/fraktionsplan och nya måltyper hör till143–145, inte142.

## RTS-143 – Utöka campaign till minst åtta uppdrag

**Status:** Done.

**Goal:** Räkna in fungerande befintliga uppdrag.

**Requirements:**

Räkna in fungerande befintliga uppdrag.
Planera berättelse, spelbar fraktion, karta och mål för varje nivå.
Introducera alla fem fraktioner över campaignens gång.
Variera mål: bygga, försvara, eskortera, rädda,
erövra och landstiga.
Implementera nya måltyper först när ett uppdrag behöver dem.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-142.

**Acceptance criteria:** Räkna in fungerande befintliga uppdrag. Planera berättelse, spelbar fraktion, karta och mål för varje nivå. Introducera alla fem fraktioner över campaignens gång. Variera mål: bygga, försvara, eskortera, rädda, erövra och landstiga. Implementera nya måltyper först när ett uppdrag behöver dem. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Minst åtta planerade uppdrag inklusive fungerande befintliga, alla fraktioner och varierade mål; dependencies och måltyper verifieras mot kod. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**143A inventera de fem verkliga campaign-missions/scenarios och befintliga kartor/rosters/goaltyper.143B dokumentera åtta ordnade uppdrag under samma stabila fem första mission-ID:n, berättelse, player/enemy-faction, befintlig karta, initial ekonomi och exakt mål/failure för vart och ett.143C skilj återanvända tutorial/waves/enemy-base/timer från de tre nya missionmål som först implementeras vid användning i145: escort, rescue och capture.143D verifiera planens count/ID:n/fem fraktioner/kartreferenser/dependencies mot kod och dokument, uppdatera docs och commit/push. Inga nya uppdrag blir tillgängliga eller påstås spelbara i denna planeringsleverans.144 verifierar/färdigställer1–4;145 implementerar/färdigställer5–8;146 samlad genomgång.

## RTS-144 – Campaign, första halvan

**Status:** Done.

**Goal:** Färdigställ uppdrag 1–4 med kartor, briefings och tydliga mål.

**Requirements:**

Färdigställ uppdrag 1–4 med kartor, briefings och tydliga mål.
Successiv introduktion av systemen och rimlig svårighetskurva.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-143.

**Acceptance criteria:** Färdigställ uppdrag 1–4 med kartor, briefings och tydliga mål. Successiv introduktion av systemen och rimlig svårighetskurva. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Uppdrag 1–4 från briefing till success/defeat, rätt måltriggers, rimlig progression och Save/load/replay; browsergenomspelning. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**144A bind1–4 till143:s fyra fasta player/enemy-par, befintliga Arena/scenario-mål och initiala förråd; tydliga egna fraktions-/mål-/förmågebriefings och debriefings, ingen återimplementation av Tutorial/waves/base/timer.144B Campaign-menyn visar/avgränsar berättelseprofiler vid ny start utan att skriva om gamla spelbara campaign-Saves eller Skirmishval; paus/restart behåller faktiskt startad identitet.144C betalda reproducibla genomgångar för alla fyra mål, plus failure/defeat-precedence, progression, mid-match Save/load och replay. Egna producera-/försvarsförmågor används där lämpligt; inga gratis units/resurser eller nya målkrav.144D native briefing→success med1–4 där möjligt, dokumenterad grundbalans och begränsningar. Fullsvit/typecheck/build/browser/diff/docs före Done.5–8 och nya måltyper ligger145; scriptade raiders är fortfarande141:s redovisade förenkling.

**Slutverifiering:**33 riktade tester PASS; fullsvit1077tester/139filer PASS493.31s. Typecheck/build/diff/doclänkar PASS. Native betald1–4-kedja, profiler, Save/load/replay/restart/progression/browser-reload samt separat legacy-identitet/preferenser PASS i1280×720 och1920×1080 utan browserfel. Normal-baser260/220/300HP vid Forest/Siege/Outpost-vinst i browsern. Ingen ny goaltyp, balance-buff, Save-format eller wave-roster. Bundlevarning kvar; ljudlyssning uppskjuten.

## RTS-145 – Campaign, andra halvan

**Status:** Done.

**Goal:** Färdigställ uppdrag 5–8 med större operationer,

**Requirements:**

Färdigställ uppdrag 5–8 med större operationer,
fler fraktioner och land-/sjöstrid.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-144.

**Acceptance criteria:** Färdigställ uppdrag 5–8 med större operationer, fler fraktioner och land-/sjöstrid. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Uppdrag 5–8 med större land-/sjöoperationer, fraktioner, success/defeat, progression och Save/load/replay; browsergenomspelning. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**145A återanvänd The Crossing, bind Goblins→Humans och verifiera verklig betald harbor/transport/landstigning/base-victory.145B Ridge Convoy påHighlands: namngiven initial Orc-courier, två ändliga Dwarf-guards, courier levande inom64px från(1504,544) och båda guards döda; courier-död eller basdöd ger defeat.145C Valley Rescue påFrontier: två namngivna Orc-guards döda och levande egen Elven combat-enhet inom64px från(1088,640).145D Coastal Banner påCoast: betald Human landstigning, zon(1600,384)/64px med egen levande landcombat och ingen fiendelandcombat oavbrutet30s; frånvaro/contest nollställer.145E åtta briefing/mål/debrief/progress i ordning, synliga målmarkörer/status utan fogläcka, restart och strikt Save/load/migration med målstatus. Alla initialcourier/guards explicitconfig och korrekta initialstats/supply, inga gratis producerade units/rewards. Befintliga rörelse/strid/ekonomi/sjö/presentation återanvänds. Relevanta mål-/failure-/Save-/tidsstegs-/paid-regressionstester, fullsvit/typecheck/build/native/diff/docs krävs före Done; fullkedja och fördjupad blockeringstest146.

**Slutverifiering:** fullsvit1111tester/141filer PASS488.46s; strict typecheck/build/diff/doclänkar PASS. Native sammanhängande betald1–8-kedja utan admissionfixture PASS i1280×720 och1920×1080, med progression, verkliga mål/landstigning, Save/load/replay och utan browsererrors. Riktade goal/Save/paid/regressionstester PASS. Initialcourier/guards separata från produktion; inga rewards eller nya assets. Bundlevarning kvar och ljudlyssning uppskjuten. Fördjupad målstatus/failure/blockeringstest följer146.

## RTS-146 – Campaign-verifiering

**Status:** Done.

**Goal:** Verifiera victory/defeat, måltriggers, progression och replay.

**Requirements:**

Verifiera victory/defeat, måltriggers, progression och replay.
Save/load får inte tappa målstatus eller utlösa rewards två gånger.
Speltesta nivåerna för blockerande lägen och svårighet.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-145.

**Acceptance criteria:** Verifiera victory/defeat, måltriggers, progression och replay. Save/load får inte tappa målstatus eller utlösa rewards två gånger. Speltesta nivåerna för blockerande lägen och svårighet. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Samtliga måltriggers/victory/defeat, progression/replay, Save/load utan dubbla rewards; dokumenterat speltest av blockerande lägen och svårighet. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**146A återanvänd145:s verkliga betalda fullkedja1–8 i båda upplösningarna som speltestbas; redovisa difficulty och förenklingar utan att hävda alla svårigheter genomspelade.146B verifiera samtliga mål/failure, partial/ended Save/load, paus/replay och exakt en progressionregistrering utan ekonomi-/statistikrewards i riktade regressionsfall.146C native paidCoast: sparad delvis capturetid, paus utan framsteg, load, frånvaro/reset och ny full30s; inga injicerade objective-enheter/bank.146D dokumentera blockeringslägen och faktisk grundbalans; 145:s fullsvit återanvänds endast för oförändrad runtime, kompletterad med nya riktade tester; typecheck/build/diff/granskning och Pages-status. Inga nya uppdrag/balanssystem eller framtida kommandon.

**Slutverifiering:**59 riktade tester/3filer PASS1.50s(13nya fall); oförändrad runtime återanvänder145:s1111/141fullpass488.46s. Typecheck/build/diff/doclänkar PASS. Verklig fullkedja1–8 i båda upplösningarna från145 plus ny nativepaidCoast partialcapture/pause/Save-load/absence-reset/ny30s/victory PASS i1280/1920 utan browsererrors. NativeTutorialBeginner, övrigaNormal; paidgameplay allaNormal. Inga materiella rewards/runtimeändringar. Bundlevarning/uppskjuten lyssning kvar.

## RTS-147 – Ta bort egna enheter

**Status:** Done.

**Goal:** Inför en tydlig “Dismiss Unit”-action för egna units.

**Requirements:**

Inför en tydlig “Dismiss Unit”-action för egna units.
Delete begär action; bekräftelse anger antal berörda units.
Stöd gruppselection, men inte byggnader eller fiendeunits.
Borttagning frigör population och rensar orders, selection,
resurstilldelning och eventuell transportlast säkert.
Ingen resursåterbetalning och inga kill-/score-belöningar.
Egen borttagning räknas separat i statistiken.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-146, RTS-123.

**Acceptance criteria:** Inför en tydlig “Dismiss Unit”-action för egna units. Delete begär action; bekräftelse anger antal berörda units. Stöd gruppselection, men inte byggnader eller fiendeunits. Borttagning frigör population och rensar orders, selection, resurstilldelning och eventuell transportlast säkert. Ingen resursåterbetalning och inga kill-/score-belöningar. Egen borttagning räknas separat i statistiken. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Delete/bekräftelse/cancel, gruppselection, population/orders/cargo/passagerare/tilldelning städas; egna units endast, ingen refund/kill-score, separat statistik. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**147A ren proposal/confirmation för levande markerade egna landunits/ships; byggnader/enemy förbjudna. Transportens passagerare räknas tydligt som berörda och tas bort tillsammans med transporten.147B återanvänd befintlig cleanDestroyed-transaktion för cargo loss, build/resurs/target/navigation/group-referenser och supply; incrementera removed separat före cleanup, inga refunds/kills.147C Dismiss Unit/Delete öppnar fokuslåst bekräftelse med antal och cargo/passagerarvarning; simulation/gameplay-input fryses tills confirm/cancel/Escape. Confirm lägger inga andra orders; cancel bevarar exakt state. Delete ignoreras i UI-input/modifiers/repeat/paus/gameover.147D grupp/worker/combat/ship-cargo/byggare/kurir/capture/Save och inputtester, nativeconfirm/cancel/group/Save vid båda upplösningar, fullsvit/typecheck/build/review/docs. Ingen rivning eller framtida highscores.

**Slutverifiering:**26 riktade tester/4filer PASS549ms; en full slutkörning1132tester/143filer PASS483.26s. npm run build inklusive strict typecheck PASS; git diff --check och doclänkar PASS. Native1280/1920 gathering/cargo, Delete/cancel/Escape/freeze, confirm/grupp, byggnadsspärr, Save/load/restart PASS utan browsererrors. Review utan blockerande fynd. Befintlig bundlevarning kvar; ingen extra bred matchgenomspelning. Agent-/rollregler uppdaterade. Körningen stannar efter denna tasks commit/push;148 ej påbörjad.

## RTS-148 – Tydligare snabbkommandon

**Status:** Done.

**Goal:** Gruppera actions visuellt:

**Requirements:**

Gruppera actions visuellt:
Orders, Build, Train och Research.
Visa hotkey direkt på knappen och full förklaring i tooltip.
Hjälpvyn visar aktuella tangentbindningar.
Undvik konflikter med kamera, textinput och browserkommandon.
Disabled actions visar varför de är blockerade.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-147.

**Acceptance criteria:** Gruppera actions visuellt: Orders, Build, Train och Research. Visa hotkey direkt på knappen och full förklaring i tooltip. Hjälpvyn visar aktuella tangentbindningar. Undvik konflikter med kamera, textinput och browserkommandon. Disabled actions visar varför de är blockerade. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Aktuella hotkeys/tooltip/help synkade, Orders/Build/Train/Research, disabled reasons, textinput/kamera/browserkonflikter och browserkontroll. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**148A gruppera befintliga knappwrappers i Orders/Build/Train/Research med kontextstyrd synlighet.148B en källa för alla action-hotkeys och fulla beskrivningar, dynamiska fraktions-/cost-/disabledtips och synkad guide; inga nya gameplayactions.148C återanvänd samma handlers/fokus/modifier/repeat/camera-skydd; verifiera keyboard/button och disabled reasons i riktade UI-/integrationstester och browser vid1280/1920.148D faktisk testinventering: separat unit-urval och explicit MatchState-integrationurval, npm test fortfarande fullregression/CI. Hela unit-urvalet, relevant UI-integration, build/typecheck/diff/docs före commit; inga fulla matcher för denna UI-task.

**Slutverifiering:**424unit-tester/75filer PASS6.35s, build inklusive strict typecheck/diff/doclänkar PASS.22riktade UI-tester och14inputintegrationer PASS. Native1280/1920 grupper, alla18labels/tooltip/help, faktisk key/button/fokus/camera/disabled-flow PASS utan browsererrors; bilder granskade. Fullmatchsimuleringar ej körda eftersom gameplayregler är oförändrade. Fullregression kvar till150/CI. Review utan blockerande fynd, bundlevarning och uppskjuten lyssning kvar.

## RTS-149 – Lokala highscores

**Status:** Done.

**Goal:** Highscores per campaign-uppdrag och skirmish-karta.

**Requirements:**

Highscores per campaign-uppdrag och skirmish-karta.
Definiera och dokumentera en enkel scoring-modell.
Separera resultat efter svårighet och relevanta spelregler.
Spara fraktion, version, utfall, matchtid och statistik.
Förhindra dubbelregistrering efter load eller upprepad resultatvy.
Visa listan från huvudmenyn och resultatvyn.
Ingen backend eller global leaderboard i denna fas.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-148, RTS-123–124.

**Acceptance criteria:** Highscores per campaign-uppdrag och skirmish-karta. Definiera och dokumentera en enkel scoring-modell. Separera resultat efter svårighet och relevanta spelregler. Spara fraktion, version, utfall, matchtid och statistik. Förhindra dubbelregistrering efter load eller upprepad resultatvy. Visa listan från huvudmenyn och resultatvyn. Ingen backend eller global leaderboard i denna fas. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Scoring och partitionering efter karta/uppdrag/difficulty/regler, lokal persistens/ogiltiga värden, metadata, exakt en registrering över load/resultatvisning; båda listvyerna. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**149A enkel scoremodell: victory10000+max(0,3600-floor(gameplayseconds)), defeat0 (utfall visas separat); ingen kill/production/refundbonus.149B fullmetadata/statistik och partitionsnyckel per campaign-ID eller skirmishmap, difficulty/speed/player/enemy/config/scoremodell.149C stabil UUID för faktisk ny match i scene, bevarad via Save33/load; restart skapar ny. Äldre Save32 migrerar utan påhittad identitet och visas som ej registrerbar tills ny match.149D strikt lokal store/validation, en entry per match-ID, inga bortglömda dedup-ID:n vid top-listning; storagefel/sessionfallback/capacity redovisas.149E huvudmeny- och resultathighscores med relevanta grupper/metadata, ingen backend. Riktade score/storage/Save/resultat/restartintegrationer och fokuserad native paidTutorial→resultat/lista/load/replay; unit/build/diff/docs före Done. Fullregression150, inga all-matchsimuleringar i149.

**Slutverifiering:**431unit-tester/76filer PASS5.60s efter TS-target-rättning, build inklusive strict typecheck/diff/doclänkar PASS.36riktade score/Save/campaign/resultattester PASS; native två betalda Tutorial-segrar per1280/1920, listor, partial/ended Save/load/reload/dedup/replay-ID PASS utan browsererrors. Bilder och diff granskade utan blockerande fynd. Full regression150; bundlevarning/uppskjuten lyssning kvar.

## RTS-150 – Samlat speltest och release

**Status:** Done.

**Goal:** Samlad verifiering av fem fraktioner, kartor och campaign samt publicerad release0.2.0.

**Requirements:**

Verifiera fem fraktioner, stora kartor, campaign,
resultatvy, highscores, upplösningar och save/load.
Granska grafik och ljud.
Uppdatera changelog och releaseversion.
Verifiera GitHub Pages och publicera efter godkända checks.

**Non-goals:** Nya backend-tjänster, multiplayer eller andra tasks; återimplementera inte färdiga system.

**Dependencies:** RTS-149.

**Acceptance criteria:** Verifiera fem fraktioner, stora kartor, campaign, resultatvy, highscores, upplösningar och save/load. Granska grafik och ljud. Uppdatera changelog och releaseversion. Verifiera GitHub Pages och publicera efter godkända checks. Befintlig funktion bevaras, relevanta checks och verifieringar passerar och begränsningar redovisas.

**Tester:** Samlat browser-/gameplaytest av fem fraktioner, stora kartor, campaign/resultat/highscores/upplösningar/Save-load; grafikgranskning, tekniska audiochecks (faktisk lyssning uppskjuten av användaren), releaseversion/changelog och publicerad Pages-build. För implementation: relevanta tester, typecheck, build och git diff --check.

**Docs:** BACKLOG.md, DEV_LOG.md, ARCHITECTURE.md, GAME_DESIGN.md, DECISIONS.md och README.md; relevanta asset/licensdocs när assets ändras.

**Detaljplan:**150A inventera levererade funktioner och befintliga belägg utan återimplementation; uppdatera produkt/packageversion till0.2.0 och behåll0.1.0 i changelog.150B native aktuell paidcampaign1–8 i1280/1920, femfraktions-/storkarts-/Save-/restart-/grafik-/resolutionflöden samt återanvänd149:s scoreflöde där oförändrat.150C granska ljudassets/engine/policy men faktisk lyssning uppskjuten enligt användarens explicita styrning; detta undantag redovisas.150D en full slutregression inklusive integrationer/matchsimuleringar, build med strict typecheck, diff/doclänkar/review.150E publicera verifierad releasekandidat via befintlig Pages-CI, kontrollera faktisk release/build och avsluta docs/status med kort överlämning. Inga balans-/bundle-/MVP-utökningar. Stanna före151.

**Acceptance-förtydligande:** faktisk lyssning och matchlyssning är uppskjutna av användaren och får inte markeras verifierade. Teknisk audioverifiering och grafisk granskning ingår; kvarstående lyssning anges i överlämningen.

**Historisk RTS-150-kandidatkontroll före publicering:** full npm test1142tester/145filer PASS652.08s (hela unit+integration), en build inklusive strict typecheck/diff/doclänkar/packageidentitet PASS. Native aktuell full paidCampaign1–8 och femfraktions-/storkarts-/Save-restart-/sex-resolutionflöde PASS1280/1920 utan browsererrors. Teknisk audio11filer decode/mute/pause PASS; lyssning ej kontrollerad enligt användaren. Review utan blockerande fynd. Publicering återstår;150 fortfarande In Progress och151 inte påbörjad.

**Slutverifiering/publicering:** releasekandidat53267ef pushad och GitHub full npm test/build/deploy completed success [run37199039458](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37199039458). Faktisk [Pages](https://tobisen.github.io/warcraft-2-tribute/) visar0.2.0/Build53267ef. Publik native1280/1920 release/changelog/highscoremeny/åtta campaignkort, canvas/grafik, fysisk selection/move och Save33/load/restart-ID PASS utan HTTP-/browsererrors; bilder granskade. Task150 Done enligt uppdaterat lyssningsundantag.

**Överlämning:**148/6906f4a grupper/keys,149/e22a444 scores/Save33 och150/53267ef release0.2.0 verifierade/levererade. Alla tasks genom150 klara. Full regression1142/145 PASS652.08s, strict typecheck/build/diff/docs PASS; aktuell paidCampaign1–8 och femfraktions-/storkarts-/rendering-/Saveflöden PASS båda upplösningarna. Kvar: faktisk ljud-/matchlyssning uppskjuten av användaren; bundlevarning och mindre närliggande etikettöverlapp oförändrade. Ingen garanti om identisk balans för alla profiler/svårigheter. RTS-151 ej definierad eller påbörjad; nästa etapp kräver nytt uppdrag. Slutlig dokumentcommit ändrar endast Markdown/roller och återanvänder uttryckligen dessa kodchecks; publicerad kodbuild förblir53267ef.

## Ny beställd roadmap RTS-151–180 (2026-10-04)

Historik001–150 bevaras. Senare tasks är planering, inte implementationsmandat. Karteditor och JSON-import/export ligger efter180. Redan levererade system inventeras och återanvänds före varje senare task.

## RTS-151 – Speltest och kvalitetsinventering

**Status:** Done.

**Goal:** Speltest och kvalitetsinventering.

**Requirements:**

Granska version 150 och dokumentera konkreta brister i:
gameplay, sprites, terräng, ljud, kontroller och byggnadsinformation.
Skilj observerade problem från antaganden.
Prioritera fynd och koppla dem till relevanta tasks.
Ingen bred refaktorering eller nya features i denna task.

**Non-goals:** Ingen bred refaktorering, nya features eller balansändringar.

**Acceptance Criteria:** Inventering med reproduktion, prioritet, evidens och taskkoppling för samtliga sex områden; observerat skiljs från antaget.

**Dependencies:** RTS-150. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Browserinventering i faktisk spelstorlek; kontrollera aktuell kod och releasebelägg. Ljudlyssning redovisas separat. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

**Verifiering:** Ny browserinventering1280/1920 av femfraktionsflöden, sex upplösningar, selection/move/betald leverans/minimap/Save-load/restart och tekniskt audio. Se QUALITY_REVIEW.md för observerat/antaget och prioritering.431unit/76filer PASS5.72s; build inklusive strict typecheck PASS; faktisk lyssning ej utförd. Ingen runtime ändrad.

## RTS-152 – Alla byggnader kan inspekteras

**Status:** Done.

**Goal:** Alla byggnader kan inspekteras.

**Requirements:**

Alla egna byggnader kan klickas och visar:
namn, beskrivning, HP, funktion och relevanta actions.
Visa produktion, research och prerequisites där relevant.
Passiva byggnader, exempelvis farms, förklarar sin nytta.
Synliga fiendebyggnader kan inspekteras med begränsad information.
Ingen kontroll över fienden eller läckage av dold information.
Bevara befintlig unit- och resource-selection.

**Non-goals:** Ingen kontroll över fienden, dold information, nya byggnader eller gameplayregler.

**Acceptance Criteria:** Alla levande egna byggnader, inklusive varje farm och forge, kan inspekteras. Synliga enemybyggnader visar endast publika data; dold/död selection rensas. Unit/resource-selection och produktionsorders bevaras.

**Dependencies:** RTS-151. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Selection/prioritet, byggnadsmodeller, fog/död/fiendeorder-skydd; relevanta integrationer och browserklick. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

**Verifiering:**31riktade tester/5filer PASS;32selection/Save-integrationstester PASS;433unit/76filer PASS6.46s. Build inklusive strict typecheck PASS. Browser1280/1920 fysiska klick med uttryckliga presentationsfixtures för alla byggnadstyper/farms, enemyfog/order-skydd, unit/resource och restart/Save-load. Ny inspectionselection är transient; inget Save-schema ändrat.

## RTS-153 – Upplösning utan automatisk uppförstoring

**Status:** Done.

**Goal:** Upplösning utan automatisk uppförstoring.

**Requirements:**

Separera renderingsupplösning från visningsstorlek.
800x600 ska kunna visas som 800x600 CSS-pixlar, centrerat,
utan automatisk förstoring till hela fönstret.
Erbjud Native Size och Fit to Window som separata val.
Behåll befintliga upplösningar upp till 2048x1332.
Skala ned när fönstret är för litet; bevara proportionerna.
Ingen oavsiktlig utjämning av pixelgrafik.
Verifiera input, selection, HUD och minimap efter byte.
Definiera fullscreen-beteende för båda visningslägena.
Spara inställningen lokalt.

**Non-goals:** Ingen ändring av gameplay, tillgängliga upplösningar eller pixelgrafik.

**Acceptance Criteria:** Native800×600 håller800×600CSS vid tillräckligt fönster. Fit förstorar proportionerligt. Båda skalar ned vid behov, sparas lokalt och fungerar i fullscreen. Input/HUD/minimap verifieras efter byte.

**Dependencies:** RTS-152. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Geometri/persistens/migration/inputmapping; browser i flera fönsterstorlekar, fullscreen och båda lägena. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

**Verifiering:**435unit/76filer PASS5.91s, build inklusive strict typecheck PASS.10riktade display/preference/viewport-tester och18input/selection/minimap/fokus-tester PASS. Browser48 geometrier, API-fullscreen båda lägen, reload/persistens samt fysisk selection/move/building/minimap/Home/HUD i Native800/Fit800/stort nedskalat preset PASS utan browsererrors. Pekaravrundning vid nedskalning tolereras inom en fysisk pixel; faktisk monitor-fullscreen inte mänskligt testad.

**HUD-komplettering efter bildfynd:** Native800 visade klippt rubrik på lång byggnadsinfo. Begränsad/rullbar infopanel och mindre porträtt/actionbredd vid liten logisk upplösning.435unit PASS5.54s, ny build/strict typecheck och samma relevanta browserflöden PASS. Bilder granskade; rubrik/HP/funktion nu synliga och resten rullbart.

## RTS-154 – Ny titel och huvudmeny

**Status:** Done.

**Goal:** Ny titel och huvudmeny.

**Requirements:**

Använd arbetstiteln:
Iron & Timber — A Tribute to Warcraft II
Uppdatera synlig titel, browser title och relevant dokumentation.
Behåll repo-namn, GitHub-remote och Pages-adress.
Använd egen typografisk logotyp och visuell identitet.
Återanvänd befintlig meny; detta är ingen fullständig menyombyggnad.
Titeln är en arbetstitel, inte juridiskt granskad för kommersiell release.

**Non-goals:** Ingen full menyombyggnad, byte av repo/remote/Pages eller juridisk granskning.

**Acceptance Criteria:** Egen typografisk identitet visar Iron & Timber och undertiteln A Tribute to Warcraft II; browser title och relevanta docs synkade; befintliga menyflöden fungerar.

**Dependencies:** RTS-153. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Text/menyregression, browsergranskning i Native/Fit; unit/build och full regression vid etappslut. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

**Slutverifiering:**428unit/75filer PASS8.55s efter korrekt klassificering av ändrad selectionfil;6riktade meny/text/release-tester PASS. Full npm test1146tester/145filer PASS499.66s inklusive alla integrationer/matchsimuleringar. Build inklusive strict typecheck, diff och Markdownreferenser PASS. Fyra dev-Native/Fit-layouter samt två byggda subpath-previewlayouter PASS titel/sex menylänkar/åtta campaignkort/start/pause/quit utan browsererrors. Bilder och diff granskade. Repo/remote/Pages/storageidentitet oförändrade. Ingen ny version eller senare feature. Ljud-/fysisk monitorlyssning/check ej utförd; CI/ny publicerad Pages-build ej verifierad i denna etapp. Överlämning HANDOFF.md; stanna före155.

## RTS-155 – Ny kvalitetsnivå för sprites

**Status:** Done enligt senaste mandatet: alla landmotiv i de tillförda referenserna är adapterade och visuellt granskade. Sjöassets saknar referensunderlag och är oförändrade.

**Goal:** Ny kvalitetsnivå för sprites.

**Requirements:**

Förbättra först worker, melee-unit och huvudbyggnad som referens.
Tydliga silhuetter, konsekvent skala, lagfärger och animationer.
Granska i faktisk spelstorlek innan resten uppdateras.
Använd användarens godkända Humans-design om den finns tillgänglig.
Om referensen saknas: dokumentera behovet; hitta inte på dess innehåll.
Dela resterande assetarbete i subtasks per fraktion/assetgrupp.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Förbättra först worker, melee-unit och huvudbyggnad som referens. Tydliga silhuetter, konsekvent skala, lagfärger och animationer. Granska i faktisk spelstorlek innan resten uppdateras. Använd användarens godkända Humans-design om den finns tillgänglig. Om referensen saknas: dokumentera behovet; hitta inte på dess innehåll. Dela resterande assetarbete i subtasks per fraktion/assetgrupp.

**Dependencies:** RTS-154. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

**Korrigering2026-10-04:** Tidigare Current Focus/rapport om Done var inte
belagd mot designmålet och motsade taskens Todo. Bifogad spelskärmbild och
lokala godkända Human-/building-referenser granskade. Grundfel i källgrafiken;
export och rätt runtime-frames var korrekta. Egna64px Human-worker/soldier och
128px base med referensens kläder/material/heraldik, åtta riktningar och
befintliga animationer. Nya större silhuetter krävde Human-specifika HP/cargo-
offsets. Gameplay/footprints och separat bottom bar-fix bevaras.

**Ny visuell evidens:** [Före/efter](artifacts/rts-155/index.html), samma karta/
kamera/selection vid Native800×600 och1280×720. Worker och soldier separat och
 tillsammans, porträtt, fysisk selection, verklig movement, explicit granskade
 gather/build/attack/death-frames och base-stadier. Noll source/exportmismatchar,
 noll förändrade rasters utanför denna Human-slice. Slutlig unit431/76, build
 inklusive strict typecheck och diffcheck PASS. Inga campaign-/matchsimuleringar.
 [Protokoll/begränsningar](assets/sources/humans.md). Inga tekniska PASS används
 som ersättning för användarens visuella godkännande av det nya resultatet.

**Nytt underlag2026-10-04:** Användaren accepterar Human-resultatet för tillfället och ber att de åtta nya fraktionsbilderna används. Se [inventering och exakt omfattning](assets/sources/faction-references.md). Orcs/Elves/Dwarves är identifierade. Användaren har uttryckligen bekräftat teknikerreferensen för Goblins och att alla namn behålls. Worker/melee/base har nu egna64px/128px speladaptioner för dessa fyra fraktioner. Sjöreferenser saknas. [Före/efter](artifacts/rts-155/factions/index.html) och [käll-/atlasaudit](artifacts/rts-155/factions/source-export-audit.json) skiljer källgrafik, export och runtime åt. Slutlig unit433/77 och build inklusive strict typecheck PASS; browserkontroll före/efter för fyra fraktioner vid Native800×600 och1280×720 PASS. Slutliga bilder och kontaktblad visuellt granskade; diff-/länkkontroll PASS. Ingen campaign-/matchsimulering.

**Slutligt mandat2026-10-04:** Användaren ber att alla saker i samtliga rasers referensbilder används, därefter commit/push. Ranged/specialist/siege och barracks/farm/forge är nu adapterade för alla fem raser. Referensens separata ranged-byggnad bearbetas till en synlig ranged-del av befintlig barracks; ingen ny byggnadstyp/gameplay införs. Befintliga namn, combat och footprints bevaras. Sjöfart finns inte i underlaget och ingår inte i detta referensmandat.

**Slutlig evidens:** [Före/efter i samma spelvy](artifacts/rts-155/complete/index.html), Native800×600 och1280×720 för samtliga fem raser: roster, selection/porträtt, faktisk movement, attack/death-poser, alla riktningar/lag och byggnadsstadier. Slutliga bilder visuellt granskade. Audit3120 unitframes/120 buildingframes: noll source/exportmismatchar, noll orelaterade rasterändringar; frame-ID:n bevarade. Slutlig unit435/78 och build inklusive strict typecheck PASS; diff-/länkkontroll PASS. Ingen campaign-/matchsimulering, CI/Pages eller slutlig användarapproval av den nya grafiken hävdas. [Mapping och begränsningar](assets/sources/complete-references.md).

| Slice | Status |
| --- | --- |
| Humans, Orcs, Elves, Dwarves, Goblins: fem landroller och fyra befintliga landbyggnader | Referensadaptioner implementerade och visuellt granskade; Goblins använder teknikerbilderna med namnen kvar. |
| Separata ranged-byggnadsmotiv | Integrerade i respektive barracks, utan ny gameplaytyp. |
| Sjöassets | Oförändrade; inga sjömotiv i referenserna. |

Stanna efter denna leverans. RTS-156 och senare startas inte.

## Bugfix: HUD-layout – bottom bar horisontell layout och kompakt build-menu

**Status:** Done.

**Goal:** Förbättra bygg-/actionmenyn så att panelerna ligger bredvid varandra och inte skapar vertikal scroll vid 800×600.

**Summary:** CSS-baserad layout-fix för bottom bar utan gameplay-ändringar. Konverterade bottom bar från flex-rad till 3-kolumn grid (portrait | selection-info | actions). Utökade action-grid från 3 till 4 kolumner för kompaktare ikonlayout. Dolde gruppöverskrifter för att spara plats. Lägg till responsiva justeringar för mindre viewports (3 kolumner vid 800×600).

**Requirements:**

- Bottom bar paneler sitter horisontellt bredvid varandra utan vertikal scroll.
- Byggnadsalternativ visas som kompakta ikonknappar i multi-kolumn grid, inte vertikal lista.
- Alla tillgängliga byggalternativ rymms samtidigt vid 800×600, 1280×720, 1920×1080 och 2048×1332.
- Namn, kostnader och hotkeys visas i tooltips.
- Tydliga disabled-, selected- och hover-states bevaras.
- HUD-interaktion ger inte orders till spelvärlden.
- Native Size, Fit to Window och fullscreen-beteende bevaras.

**Non-goals:** Gameplay-ändringar, nytt asset-arbete, ny RTS-ID.

**Acceptance Criteria:** Panelerna sitter horisontellt. Ingen vertikal eller horisontell scroll i byggnadsmenyn. Alla åtgärder synliga vid samtliga testade viewport-storlekar. Hotkeyar och status i tooltips. Disabled-state visar orsak. HUD-klick döljer världsorder.

**Dependencies:** Ingen.

**Verification:** `npm run typecheck` PASS, `npm run build` PASS, `npm test` 1146/1146 tests PASS (145 files), `git diff --check` PASS. Manuel layout-verifiering vid 800×600, 1280×720, 1920×1080, 2048×1332 med worker-markering, byggalternativ synliga, hover/disabled-states fungerar. Ingen berörning av display-modes eller HUD-event-guards i BootScene.

**Docs:** Denna note i BACKLOG.md, motsvarande post i DEV_LOG.md.

## RTS-156 – Förbättrad kartgrafik

**Status:** Done.

**Goal:** Förbättrad kartgrafik.

**Leverans2026-10-04:** Detaljerad gräsyta, skum/vattenfleckar, ljus sand-/jordstrand, sammanhängande jordspår på fri mark, blommor/ormbunkar och skogskronor på Forest Pass befintliga blockerade bergsceller. Ingen walkability/ekonomi/kartgeometri ändras. Arenan granskades först; därefter alla nio kartor i Native800×600/1280×720. Revealed-map-fixture används uttryckligen för terränggranskning; vanliga fogregler ändras inte. [Bilder](artifacts/rts-156/after-arena-1280.png), före-arena och18 eftervyer i samma mapp. Riktade19/2, slutlig unit436/78 och build inklusive strict typecheck PASS; diffcheck PASS. Inga campaign-simuleringar. Sjöreferensbristen är separat dokumenterad i [spriteavstämningen](assets/sources/remaining-sprites.md).

**Requirements:**

Förbättra terrängövergångar, kust, vatten, skog,
vägar och dekorationer.
Walkability ska vara tydlig.
Verifiera stilen på en referenskarta innan övriga uppdateras.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Förbättra terrängövergångar, kust, vatten, skog, vägar och dekorationer. Walkability ska vara tydlig. Verifiera stilen på en referenskarta innan övriga uppdateras.

**Dependencies:** RTS-155. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-157 – Tydliga attackljud

**Status:** In Progress – teknisk del implementerad/verifierad; faktisk lyssning återstår.

**Goal:** Tydliga attackljud.

**Verifierad del2026-10-04:** Nya egna melee/bow/siege/buildingHit-WAV/OGG, befintliga cannon/impact. Public visibility-filtrerad shot/cooldown/HP-policy, avstånd256–1400px, familjcoalescing och befintligt max6/cooldown. Ingen gameplayändring. Riktade7/3 och7/2, unit439/79, build/strict typecheck och diffcheck PASS. Faktisk Chromium-stridsfixture med landstrid och navalcombat PASS:180 accepterade cues, mixpeak0.352,15 filer dekodade. [Lyssningsklipp](artifacts/rts-157/battle-preview.wav), [protokoll](assets/sources/attack-audio.md). Faktisk lyssning är efterfrågad men ännu inte utförd; tekniska belägg ersätter den inte. Tasken är inte Done. Oberoende158/159 fortsätter enligt mandat.

**Requirements:**

Ljud för melee, bågar, siege, fartyg, träffar och byggnadsskada.
Koppla ljud till rätt gameplay-händelse.
Hantera avstånd och begränsa samtidiga upprepningar.
Lyssna igenom större strider.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Ljud för melee, bågar, siege, fartyg, träffar och byggnadsskada. Koppla ljud till rätt gameplay-händelse. Hantera avstånd och begränsa samtidiga upprepningar. Lyssna igenom större strider.

**Dependencies:** RTS-156. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-158 – Fler humoristiska enhetskommentarer

**Status:** In Progress – dialog/routing verifierad; egna/licensierade inspelningar och lyssning saknas.

**Goal:** Fler humoristiska enhetskommentarer.

**Verifierad del2026-10-04:**380 egna engelska repliker, fem raser/sju roller, select/move/attack/work/repeat. Tredje klicket inom8s får repeat; cooldown/variation/separat röstvolym/pause/mute återanvänds. Lokal English speechSynthesis är fallback, inte inspelningar. [Manus och saknade assets](assets/sources/unit-voices-158.md) listar exakt380 recording/license-null. Unit441/79, build/strict typecheck och browsercanvas-routing med uttrycklig speech-mock PASS; diffcheck PASS. Röstlyssning och inspelningsdelen är blockerad av saknade filer/metadata. Tasken är inte Done;159 är oberoende och fortsätter.

**Requirements:**

Engelska repliker för selection, move, attack, arbete
och upprepade klick.
Personlighet per ras/unit-typ, variation och cooldown.
Egna/licensierade inspelningar och separat röstvolym.
Rapportera saknade röstassets tydligt.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Engelska repliker för selection, move, attack, arbete och upprepade klick. Personlighet per ras/unit-typ, variation och cooldown. Egna/licensierade inspelningar och separat röstvolym. Rapportera saknade röstassets tydligt.

**Dependencies:** RTS-157. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-159 – Levande värld

**Status:** Done.

**Goal:** Levande värld.

**Leverans2026-10-04:** Egna32px hjort/kanin/räv med idle/wander, stock/svamp/gräsdetaljer. Dekorativt, högst48 djur, inga gameplay-entiteter/observers/occupancy/selection eller jakt/ekonomi. Synlighetsfilter följer playerfog och aktuell byggnadskarta. Deterministiska statiska habitats och befintlig sparad matchtid ger exakt Save/Load-pose, pause och restart utan Saveversionändring. [Protokoll](assets/sources/wildlife-159.md), [spelvy](artifacts/rts-159/idle-800.png), kontakt-/browserdata i samma mapp. Riktade10/3; slutlig unit444/80, build/strict typecheck, Save/visibility38/3, resourceSelection7/1 och diffcheck PASS. Faktisk browser800/1280 med fysisk Save/Load/restart, fog/input och visuell granskning PASS. Inga campaign-simuleringar. Stanna efter159;157/158 asset-/lyssningsbrister är fortfarande öppna.

**Requirements:**

Neutrala djur och miljödetaljer med enkel idle-/wander-logik.
Djur blockerar inte viktiga vägar eller byggplatser.
Ingen scouting genom fog of war.
Första versionen är dekorativ utan jakt eller ny ekonomi.
Hantera save/load och restart.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Neutrala djur och miljödetaljer med enkel idle-/wander-logik. Djur blockerar inte viktiga vägar eller byggplatser. Ingen scouting genom fog of war. Första versionen är dekorativ utan jakt eller ny ekonomi. Hantera save/load och restart.

**Dependencies:** RTS-158. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-160 – Huvudbyggnad i tre nivåer

**Status:** Done.

**Leverans:** Nivå 1→2 kostar80 wood/60 gold och20s;2→3 kostar120/100 och30s. Base-workerproduktion pausas, accepterad kö/rally/selection behålls och återstående tid återupptas exakt. Övrig produktion fortsätter. HP/footprint ändras inte.80 nya nivåframes återanvänder godkända fraktionsdelar; ingen särskild nivåreferens finns. Browser800×600/1280×720 och fysisk save/load verifierade; screenshots och browserlog i artifacts/rts-160. Riktade40 tester PASS; slutchecks redovisas i DEV_LOG.

**Goal:** Huvudbyggnad i tre nivåer.

**Requirements:**

Kostnad, uppgraderingstid och tydlig visuell förändring.
Definiera produktionens beteende under uppgradering.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Kostnad, uppgraderingstid och tydlig visuell förändring. Definiera produktionens beteende under uppgradering.

**Dependencies:** RTS-159. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-161 – Prerequisites och tech tree

**Status:** Done.

**Leverans:** Gemensam evaluator för byggnads-, enhets-, research- och basnivåkrav från befintliga fraktionsdefinitioner. Byggnader kräver levande base; research färdig Forge, avancerade enheter befintliga forge/research-krav. Färdiga krav härleds från faktisk match, aldrig selection eller pågående jobb. Tech tree visar produktionsbyggnad och låsorsak med fraktionsnamn. Köjobb fortsätter efter prerequisite-förlust. Browser800/1280 och riktade20 tester verifierade; artifacts/rts-161.

**Goal:** Prerequisites och tech tree.

**Requirements:**

Stegvis upplåsning av buildings, units och research.
Begripligt tech tree och förklaring av låsta actions.
Återanvänd befintligt prerequisite-system.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Stegvis upplåsning av buildings, units och research. Begripligt tech tree och förklaring av låsta actions. Återanvänd befintligt prerequisite-system.

**Dependencies:** RTS-160. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-162 – Försvarstorn

**Status:** Done.

**Leverans:** Workerbyggda32px-torn,50 wood/20 gold,160HP,8s konstruktion. Närmaste synliga hostile unit inom176px, stabil ID-tie-break; fasta projektilmål och befintlig hinder/impact-logik. AI kan välja/skada/förstöra torn; navigation/fog/minimap/statistik uppdateras. Uppgradering40/30,10s, kräver färdig basnivå2/Forge:208px,16 skada mot10. Torn fortsätter skjuta på aktuell nivå under uppgradering. Strikt Save35 och34-migration.80 tornframes återanvänder godkända base-delar, men separat tornreferens saknas. Browser800/1280 och riktade58 tests PASS; artifacts/rts-162.

**Goal:** Försvarstorn.

**Requirements:**

Tydliga målregler och uppgraderingar.
Verifiera fog of war, projektiler och AI-targeting.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Tydliga målregler och uppgraderingar. Verifiera fog of war, projektiler och AI-targeting.

**Dependencies:** RTS-161. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-163 – Murar och portar

**Status:** Done.

**Leverans:** Mur10 wood/180HP/3s/32×32, port30 wood+5gold/240HP/5s/64×32. Worker bygger, förstörelse tar bort hinder. Port startar stängd; X/ikon öppnar/stänger utan kostnad. Öppen port släpper igenom spelarens befintliga lag, fiender måste gå runt eller förstöra. Routes invalidieras via revision; enemy-workers, AI, landning, spawn och separation använder ägarskapskontrollen. Instängning, obligatoriska leverans-/builder-/produktions-/wavevägar och kroppskollision kontrolleras; stängning över enhet spärras.32 fortifications sammanlagt. Strikt Save36/35-migration, öppen gate-state och navigationscache rekonstrueras.90 atlasframes från godkända base-delar; särskild godkänd mur/portreferens saknas. Riktade81 tests PASS, browser800/1280 med fysisk bygg/open/move/close/save; artifacts/rts-163.

**Goal:** Murar och portar.

**Requirements:**

Placering, förstörelse och öppning/stängning.
Navigation uppdateras korrekt.
Placering får inte skapa otillåtna instängningar.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Placering, förstörelse och öppning/stängning. Navigation uppdateras korrekt. Placering får inte skapa otillåtna instängningar.

**Dependencies:** RTS-162. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-164 – Reparation och försvarsbalans

**Status:** Done.

**Goal:** Reparation och försvarsbalans.

**Implementation:** Workers reparerar egna skadade byggnader med4HP/s,0.5wood+0.1gold per faktisk återställd HP. Max tre arbetande workers per byggnad; ytterligare workers väntar utan kostnad. Z/Repair och högerklick återanvänder navigation, avbrott och bygganimation. Full HP, förstörelse, död worker och tom bank stoppar ordern; pause fryser den. Last, selection och save/load bevaras; Save37 migrerar36. Uppgraderade torn har192px räckvidd (tidigare208), så alla fem befintliga siege-profiler kan skjuta utifrån. Siege gör1.5× skada mot tower/wall/gate, oförändrad skada mot vanliga byggnader/enheter.

**Verifiering:**77 riktade tester/8 filer PASS. Chromium800×600/1280×720 fysisk repair/Stop/Save/Load, full HP och siege-counter PASS; screenshots visuellt granskade i [artifacts/rts-164](artifacts/rts-164). Kontrollerad matchfixture använder befintlig enemy-outpost som spotter och normala fogregler. Ingen ny grafiktillgång behövs. Slutlig unit445/80 och full regression1193/155 PASS; build med strict typecheck PASS. Initiala två tidsgränsfel korrigerades genom att undvika onödig AI-bygg-BFS, utan höjda deadlines. Diff/länkkontroll före commit redovisas i DEV_LOG.

**Requirements:**

Workers reparerar egna byggnader för resurser.
Balansera försvar mot siege och expansion.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Workers reparerar egna byggnader för resurser. Balansera försvar mot siege och expansion.

**Dependencies:** RTS-163. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-165 – Magienheter och mana

**Status:** Done.

**Goal:** Magienheter och mana.

**Implementation:** Fem befintliga specialister kompletterade med fraktionsmana och support/control-roll utan namn-/strids-/kostnadsbyte. Max/initial/regen i config/mana och fraktionsdefinitionerna. HP-raden visar aktuell/max mana; gameplay-tid, pause/gameover/dead och transports hanteras. Save38 migrerar37. Spells166/167 återstår separat; inga nya castposer eller nya referenser hävdas. [Assetinventering](assets/sources/magic-165.md).

**Verifiering:** Riktade52/4 + fraktions18/4 PASS, slutlig unit445/80 och build med strict typecheck PASS. Chromium fem raser ×800×600/1280×720 fysisk produktion/selection, mana/regen/pause och Save/Load; screenshots i [artifacts/rts-165](artifacts/rts-165). Slutliga bilder visuellt granskade, fysisk selection och diffkontroll PASS.

**Requirements:**

En magienhet per fraktion med tydlig roll.
Mana, regeneration och UI integreras i befintliga system.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** En magienhet per fraktion med tydlig roll. Mana, regeneration och UI integreras i befintliga system.

**Dependencies:** RTS-164. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-166 – Spell-system

**Status:** Done.

**Verifiering:** Datadrivna Heal/Ward/Hex: targetingmarkör, mana/range/cooldown, aktuellt fog/ägarskap/levande markstridsmål, Escape/högerklick utan kostnad, tydlig blocked-tooltip och feedback. Save39 bevarar aktiva effekter/cooldowns och migrerar38. Heal, buff och debuff uppfyller användarens skärpta krav (backlogens tidigare ”eller”).72 riktade tester/7filer PASS; slutlig unit446/80 och build med strict typecheck PASS. Faktisk Chromium native800/1280, fysisk targeting/cancel/cast, blandad worker+specialist utan HUD-scroll samt Save/Load; screenshots visuellt granskade i artifacts/rts-166. Inga nya casting-sprites eller helmatchbalans hävdas.

**Goal:** Spell-system.

**Requirements:**

Targeting, räckvidd, mana-kostnad och cooldown.
Första spells: healing, buff eller debuff.
Hantera avbruten targeting och ogiltiga mål.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Targeting, räckvidd, mana-kostnad och cooldown. Första spells: healing, buff eller debuff. Hantera avbruten targeting och ogiltiga mål.

**Dependencies:** RTS-165. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-167 – Fraktionsmagi, effekter och AI

**Status:** Done.

**Verifiering:** Fem skilda spell-loadouts konkretiserar134-rollerna; offensiv/defensiv/support/alkemi. Gemensam caster/target/fog/mana/range-validering även för AI, max två beslut/s, heal vid skada, debuff av synlig stridsenhet och buff endast nära synligt stridshot. En buff+en debuff, refresh ersätter kanal, exakta tidsgränser för expiry och Save40/39-migration bevarar äldre spells utan omtolkning.78 riktade tester/7filer och95 strids-/AI-/profiltester/6filer PASS; unit446/80 och build med strict typecheck PASS. Faktisk browser fem raser ×native800/1280, fysisk cast, status/ringar, mana/cooldown, faktisk AI-update, Save/Load/expiry/restart och HUD-scrollmått.20 bilder och browser.json i artifacts/rts-167; fem native800-effectbilder och Goblin1280-AI visuellt granskade. Ingen ny castpose eller mänsklig helmatchbalans hävdas.

**Goal:** Fraktionsmagi, effekter och AI.

**Requirements:**

Olika spells per fraktion.
Tydliga effekter och varaktighet.
AI använder spells genom enkla, testbara regler.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Olika spells per fraktion. Tydliga effekter och varaktighet. AI använder spells genom enkla, testbara regler.

**Dependencies:** RTS-166. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-168 – Flygande enheter och anti-air

**Status:** Done för godkänd första gameplayversion med uttryckligen tillåtna TEMP-ikoner; slutlig flygargrafik Pending.

**Historisk blockerare (upphävd av användaren 2026-10-05):** Användarens krav är flygare enligt befintlig faction-plan, men134-planen/runtime definierar enbart fem landroller samt transport/warship. Ingen luftroster eller godkänd flygarsilhuett/animation/porträtt finns i registrerade referenser. Designfråga ställd, obesvarad. Behöver enhetsidentiteter/roller/produktionsprereqs och land/sea/air/anti-air-beslut samt referens eller beslut om nytt originalunderlag. Se assets/sources/air-168.md. Nytt beslut godkänner Gryphon Rider/Wyvern Rider/Great Eagle/Gyrocopter/Airship och tillfälliga ikoner; inga slutliga sprites godkända.

**Resultat 2026-10-05:** En betald air-roll per ras i befintlig barracks, Forge+attack1+defense1; alla raser har grundarcher utan dessa techkrav. Explicit land/sea/air/building-mask, hinderfri lokal luftnavigation, bounds, vision/minimap, selection, produktion/kö/rally, AI-produktion/anti-airförsvar samt Save41/restart. Melee/siege träffar inte luft; rangedtorn gör det; transport/spells är uttryckligen markbegränsade. Sjö-AI:s två landplatser spärrar inte flygare. Originala TEMP-ikoner/porträtt med24px höjd och skugga.

**Verifiering:** Riktade luft-/strids-/AI-/save-/naval-/UI-tester och Chromium fem raser ×800/1280, fysisk produktion/selection/rörelse/Save/Load/restart, kö-/panelscrollmått. screenshots och browser.json i artifacts/rts-168; granskade visuellt. Slutchecks redovisas i DEV_LOG före commit. Ingen mänsklig balansgenomspelning.

**Kvarstående grafik:** Fem godkända slutliga silhuetter, idle/fly/attack/death-animationer och porträtt; TEMP-ikonerna uppfyller endast användarens uttryckligen begränsade implementationstillstånd. Se assets/sources/air-168.md.

**Goal:** Flygande enheter och anti-air.

**Requirements:**

Luftnavigation och tydliga mark-/sjö-/luft-targetingregler.
Silhuetter och skuggor visar flyghöjd.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Luftnavigation och tydliga mark-/sjö-/luft-targetingregler. Silhuetter och skuggor visar flyghöjd.

**Dependencies:** RTS-167. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-169 – Balans för mark, sjö, luft och magi

**Status:** Done – första preliminära balanspasset verifierat2026-10-05. Mänskligt speltest och slutlig flygargrafik återstår separat; historisk blockerare är upphävd.

**Resultat 2026-10-05:** Första combined-arms-pass med89 deterministiska scenarier:25 korsras ground-AA/air,16 flygdueller,10 faktisk-water sjögrupper, mark/siege/magic och betald AI-produktion/counterköer. Warships får luftmask med0.75× skada; Eagle får1.25× mot luft, behåller svag markattack. Bomber-escort och melee-counters fungerar i kostnadsjämförbara fixtures. Två AI-preflightkontroller korrigerade så flygare inte blockerar markbyggen. Save42 migrerar41 utan omprissättning av köer/projektiler. Rapport och exakta values i artifacts/rts-169/balance-review.md och results.json.

**Verifiering:** Riktade122/5 PASS; tidigare felande tre islandsfall och The Crossing PASS efter testbotar filtrerar lagliga mål utan svagare asserts. AI-browser fem raser faktisk betald airproduktion/defense/fog-release PASS. Chromium alla fem navalprofiler ×800/1280 fysisk luftattack, faktiskt12damage, inflightSave/Load och20 före/efterbilder visuellt stickprovsgranskade. Slutlig unit435/79, build inklusive strict typecheck, full regression1320/160(526.62s), diff och lokala docslänkar PASS. Ingen extra fristående kampanjbatch; projektets obligatoriska etappregression körs på slutlig kod.

**Kvar:** Balansen är preliminär, ingen mänsklig helmatch/kiting/strategispeltest eller ny CI/Pages. Slutlig flygargrafik saknas enligt168:s uttryckliga TEMP-mandat. Äldre casting-/sjöreferens-/ljud-/röstbegränsningar kvarstår.170 startas inte i körningen. Historisk delinventering i partial-review.md ersätts för nuvarande balansstatus av nya rapporten.

**Goal:** Balans för mark, sjö, luft och magi.

**Requirements:**

Verifiera counters, kostnader och kombinerade arméer.
Bevara användbara roller för olika enhetstyper.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Verifiera counters, kostnader och kombinerade arméer. Bevara användbara roller för olika enhetstyper.

**Dependencies:** RTS-168. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-170 – Hold Position, Patrol och köade orders

**Status:** Done.

**Leverans:** Bestående Hold/Patrol och max32 kompatibla Shift-order för land/air/workers/ships. Normal order och Stop rensar, avmarkering bevarar; definierade target loss/blockering/återgång och nästa simulationssteg. Save43 migrerar42, restart rensar. F6/F7, kompakta order/köstatus och tooltip. Riktade142/14 samt slutliga commandOrders10/1 PASS; unit435/79 och build inklusive strict typecheck PASS. Fysisk Chromium800/1280 kö/Hold-strid/Patrol/Stop/Escape/Save/Load/restart PASS; sex screenshots/browser.json i [artifacts](artifacts/rts-170). Queue800 och Hold-combat1280 visuellt granskade.

**Goal:** Hold Position, Patrol och köade orders.

**Requirements:**

Shift lägger orders i kö.
Definiera avbrott, target loss och autoattack.
Visa aktuella orders.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Shift lägger orders i kö. Definiera avbrott, target loss och autoattack. Visa aktuella orders.

**Dependencies:** RTS-169. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-171 – Formationer och gruppnavigation

**Status:** Done.

**Leverans:** Gemensam stabil formationsallocator för land/air/ships, storleksanpassad spacing och bounded kandidatfält upp till17×17. Blockerad central plats använder kroppssäkra nåbara alternativ; större kroppar först, separata domänplatser och en bounded multi-goal-BFS per enhet/kommando. Befintlig trafik/separation/routelivscykel bevaras; inga formationsomtag per frame. Shift-kö och Patrol får separata slutplatser. Riktade58/7, unit435/79 och build med strict typecheck PASS. Chromium4/24 units×800/1280 fysisk drag/rightclick och öppen own-gatepassage PASS; [artefakter](artifacts/rts-171).128 blandade enheter och water-safe ships verifierade i tester.

**Goal:** Formationer och gruppnavigation.

**Requirements:**

Förbättra destinationer, separation och trängsel.
Anpassa formationer vid passager och combat.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Förbättra destinationer, separation och trängsel. Anpassa formationer vid passager och combat.

**Dependencies:** RTS-170. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-172 – AI-personligheter

**Status:** Done.

**Leverans:** Datadriven Defensive/Offensive/Economic samt befintlig Standard. Separat från difficulty; egna armémål/researchprioritet/expansionsvillkor och attack/grupp/reserv/försvarsregler. Samma kostnader, tech, fog och produktionssystem. Val/description i matchmeny, sessionstatus/preferenser/Save44/restart och highscorepartition. Riktade152/10, unit435/79 och build inklusive strict typecheck PASS. Chromium tre profiler×800/1280 fysisk selection, oberoende difficulty, Save/Load/restart och betald produktion/research/expansion PASS; [artefakter](artifacts/rts-172), Economic800 visuellt granskad. Deterministiska matchuppdateringar och faktisk dispatchtiming testade.

**Goal:** AI-personligheter.

**Requirements:**

Defensiv, offensiv och ekonomisk AI via config.
Personlighet och svårighet är separata val.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Defensiv, offensiv och ekonomisk AI via config. Personlighet och svårighet är separata val.

**Dependencies:** RTS-171. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-173 – AI med kombinerade arméer

**Status:** Done.

**Leverans:** Fogbegränsad rollplan, betald front/ranged/siege/magic/air, synlig försvarsprioritet, omgruppering och befintlig naval transport/spells. Save45. Riktade104/7, final68/5 och air/group/orders37/3 PASS; slutlig unit435/79, build inklusive strict typecheck och full regression1355/163 PASS527.48s. Browser fem fraktioner betald sammansättning/fog/spells/siege/omgruppering PASS. Slutliga170-orderfixar och171 outside-world-guard verifierade. Begränsningar och nästa174 i [HANDOFF](HANDOFF.md).

**Goal:** AI med kombinerade arméer.

**Requirements:**

AI använder siege, magi och relevanta luft-/sjöenheter.
Verifiera targeting och resursanvändning.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** AI använder siege, magi och relevanta luft-/sjöenheter. Verifiera targeting och resursanvändning.

**Dependencies:** RTS-172. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## PRIO-01 – Fungerande musklick på actions

**Status:** Done.

**Leverans:** Per-frame textnodeersättning avbröt native click. Gemensam stabil actionLabel bevarar textnod/children även vid räknarändringar; world-pointerdown avvisar HUD-targets. Fysisk live browser800/1280 build/unit/research/upgrade/disabled/busy/full/hotkey/noEnter/ingen dubbeldebitering PASS. Riktade34/6, unit451/80 och build/typecheck/diff PASS. Bilder/rapport i artifacts/prio-01. Ny CI följs efter push; ingen ny fullcampaignbatch för UI.

Nu går det inte att klicka på knappar för att producera enheter eller bygga byggnader. Användaren måste använda snabbkommando och sedan Enter.

Åtgärda grundorsaken:
- Klick på enhetsproduktion ska starta produktion eller lägga till i kön enligt befintliga regler.
- Klick på en byggnadsknapp ska direkt aktivera placeringspreview.
- Vänsterklick på giltig mark ska placera byggnaden.
- Forskning och uppgraderingar ska också kunna startas med musklick.
- Inget extra Enter ska behövas efter ett knappklick.
- Snabbkommandon ska fortsätta fungera.

Undersök eventhantering, pointer-events, överlappande element, fokus och om canvasen fångar HUD-klick.
Mus och tangentbord ska använda samma action-logik och validering.

HUD-klick får inte samtidigt ge order på kartan, ändra selection eller debitera dubbelt. Otillgängliga actions ska visa orsaken.

Browserverifiera verkliga musklick för byggnad, enhet, forskning och uppgradering, inklusive otillräckliga resurser och upptagen/full kö.

**Checks/leverans:** Riktade beteendetester, faktisk browserkontroll när relevant, unit-suite, build med strict typecheck och diffkontroll. Uppdatera BACKLOG/DEV_LOG/HANDOFF; commit/push efter verifierad task. Inga orelaterade roadmap-features.

## PRIO-02 – Tydliga och olika action-ikoner

**Status:** Done.

**Leverans:** 31 särskilda actionbilder per fraktion: tight crop av riktiga byggnads-/unitassets, egna command/spell-glyphs och tydliga research/upgrade-märken. Cache utan per-frame canvasarbete; befintliga Textnoder/kompakt grid bevaras. Prerequisites även efter unlock, aktiv preview/research/upgrade och markerad producerande typ. Riktade19/4, unit457/81, build/typecheck/diff PASS. Live clickregression800/1280 PASS; browser alla fem fraktioner31unique, sex kontexter800/1280 utan scroll/klipp PASS, representativa bilder granskade. artifacts/prio-02. Air fortsatt godkänd TEMP.

- Varje byggnad och enhet ska ha en egen igenkännbar ikon som visar vad man bygger eller producerar.
- Forskning och uppgraderingar ska också kunna skiljas åt visuellt.
- Återanvänd rätt godkända assets när de fungerar som ikoner.
- Använd inte samma generiska bild på flera olika actions.
- Visa kort namn eller tooltip, kostnad, snabbkommando och prerequisites.
- Gör disabled, aktiv action och produktion tydliga.
- Bevara den kompakta horisontella bottom bar-layouten utan scroll eller klippta actions.

Granska ikoner i faktisk knappstorlek vid native 800×600 och större visningsläge.

**Checks/leverans:** Riktade beteendetester, faktisk browserkontroll när relevant, unit-suite, build med strict typecheck och diffkontroll. Uppdatera BACKLOG/DEV_LOG/HANDOFF; commit/push efter verifierad task. Inga orelaterade roadmap-features.

## PRIO-03 – Kartdesign med mer djup och naturliga former

**Status:** Done.

**Avgränsning:** Frontier Valley är spelbar referenskarta. Ny authored terränglayout, egna tile-/skogskällor; övriga kartor behåller sin layout/grafik tills referensen verifierats. Befintliga stockar/IDs/start/objectives bevaras; äldre Frontier-saves behåller sin ursprungliga layout via explicit migration.

Referens:
https://classic.battle.net/war2/lp/c2-4.shtml

Öppna och granska de faktiska kartbilderna som sidan hänvisar till. Om bilderna inte går att nå, säg det uttryckligen och använd inte sidans kartnamn som bevis för visuell granskning.

Målet är Warcraft II-inspirerad terräng med sammanhängande skogar, organiska stränder, varierad mark och tydliga strategiska områden. Skapa egna kartor och egna assets.

Börja med en befintlig karta som referenskarta för förbättringen:

Skogar:
- Skapa sammanhängande skogspartier med varierade kanter, täthet och små gläntor.
- Träd ska upplevas som en skog, inte en samling isolerade symboler.
- Bevara resursmängder, worker-åtkomst och gathering-regler.
- Avverkning ska öppna skogen visuellt och uppdatera navigation där det behövs.
- Dekorativa träd får inte förväxlas med skördbara resurser.

Vatten:
- Skapa oregelbundna kustlinjer, vikar, floder och öar.
- Använd strandövergångar, hörnvarianter och grunda vattenkanter.
- Behåll tilebaserad logik men undvik stora synliga rektanglar som enda vattenform.
- Grafik och land-/sjö-navigation ska stämma överens.
- Kontrollera hamnplacering, fartygspassage och åtkomst till resurser.

Visuellt djup:
- Variera gräs, jord, sand och sten med sammanhängande övergångar.
- Lägg till begripliga skuggor, skogsbryn, klippkanter och sparsamma dekorationer.
- Undvik slumpmässigt visuellt brus och upprepade mönster.
- Enheter, resurser och byggbara områden ska fortfarande vara lätta att läsa.
- Inför inte ett nytt gameplay-system för höjd i denna task.

Kartlayout:
- Skapa tydliga basområden, expansionsplatser, alternativa vägar och strategiska passager.
- Kontrollera att startpositioner och obligatoriska objectives fortfarande fungerar.
- Bevara fog of war, minimap och save/load.

Visa före/efter av samma områden i browsern. Slutför och verifiera referenskartan innan du sprider lösningen till fler kartor.

**Checks/leverans:** Riktade beteendetester, faktisk browserkontroll när relevant, unit-suite, build med strict typecheck och diffkontroll. Uppdatera BACKLOG/DEV_LOG/HANDOFF; commit/push efter verifierad task. Inga orelaterade roadmap-features.

**Godkänt förtydligande:** Två bifogade kartbilder styr formspråket: sammanhängande skogar, organiska kustlinjer, strand/grunt/djupt vatten och diskret marktextur. Både grafik och layout förbättras; fler isolerade träd på enfärgad mark räcker inte. Egna assets och karta, ingen kopierad bakgrund. Spelbar referenskarta först med närbilder av skogsbryn/kust och översikt, grafik/resurser/byggbarhet/land-/sjönavigation verifieras före spridning.

Leverans: spelbar Frontier-referenskarta med egna reproducerbara terrängassets, sammanhängande skördbara groves, glänta, oregelbundna flodbasiner/strand/djup/ö, tre landvägar och befintliga stockar. Avverkning öppnar kroppssäkra ytor och reviderar routes endast när hinder ändras. Save46 bevarar äldre Frontier-layout och fogminne; minimap/AI-scoutpunkter följer ny layout. Alla12 faktiska referensbilder granskade; inget raster importerat. Riktade75/8 inklusive två betalda matcher till seger PASS; slutliga ändringschecks60/6 + overlap3/1 PASS, unit457/81/build strict/diff PASS. Browser800/1280 fysisk skogsselection/gather, faktisk avverkning, SaveLoad/restart samt betald naval-fixture hamn/produktion/sjöpassage PASS. Före/efter samma forest/coast/overview i artifacts/prio-03; alla tre slutliga vyer visuellt granskade. Endast referenskartan sprids här; inget nytt höjdgameplay.

CI-tillägg: push0ab2436 GitHub37309876585 föll på config20-testfixturen som använde ny referensterräng. Fixturen återskapar nu ursprunglig terräng/resources och tar bort senare fields; migration/ledger/view-asserts oförändrade. Isolerat mot03: targeted1/unit457/81/build strict/diff PASS. Korrigeringspushb5a3100: faktisk GitHub37312395555 SUCCESS (fulltest/build/Pagesdeploy).04:s påbörjade ändringar bevaras ocommitade.

## PRIO-04 – Interaktiva djur

**Status:** Done. Kartor och djurljud godkända av användaren 2026-10-05; ljuden accepterade tills resterande ljudarbete.

Utöka befintliga NPC-djur:
- Vänsterklick på ett synligt djur visar namn och HP samt spelar ett passande djurljud.
- Begränsa ljudupprepning så att snabba klick inte ger ljudspam.
- Markerade stridsenheter kan attackera ett djur med högerklick.
- Djur har HP, tar skada och dör med tydlig återkoppling.
- När djuret dör ska mål och selection hanteras korrekt.
- Djur ger inga resurser eller vanliga enemy-kills/highscore-poäng i denna version.
- De ger ingen vision och ska inte blockera viktiga vägar eller byggplatser.
- Bevara wandering, save/load och restart.

Djuren ska gå att klicka på även när egna enheter är markerade. Interaktionen får inte oavsiktligt ge en markorder.
Använd egna eller korrekt licensierade ljud och provlyssna på dem.

**Checks/leverans:** Riktade beteendetester, faktisk browserkontroll när relevant, unit-suite, build med strict typecheck och diffkontroll. Uppdatera BACKLOG/DEV_LOG/HANDOFF; commit/push efter verifierad task. Inga orelaterade roadmap-features.

Teknisk del: synligt sprite-/huvudklick visar namn/HP och rätt eget läte, behåller troopselection. Typad hunt för soldater/luft/krigsfartyg, Shift-kö, vanlig replace/Stop, samma combat/marine approach och profildamage; dead/hidden/unreachable cleanup och normal idle. Ingen neutral ekonomi/killscore/vision/occupancy. Hit/corpsefeedback, oförändrad wanderclock, Save47 health/hunt/queue och restart. Riktade65/8 före sjöstöd, slutliga76/6 inkl. naval/acquisition/queue/Save PASS. Slutlig unit458/82/build strict/diff PASS. Browser800/1280 physical inspection/headclick/tre ljud/hunt/skada/död/score/SaveLoad/restart samt shore-warship PASS; huvudvy/död granskade. Ljudfil/mixeruppspelning är tekniskt verifierad, användaren har därefter godkänt de tre djurljuden. Full etappregression på slutlig kod1394/169 PASS588.49s. Även verklig löpande Scene.update-browser800/1280 PASS för vandrande huvudklick/jakt/död/idle/corpsefade. Taskleverans med commit/push enligt mandat.174 vilande.

## RTS-174 – Flera AI-spelare

**Status:** Done.

**Goal:** Flera AI-spelare.

**Requirements:**

Ownership och relationer för flera spelare.
Verifiera targeting, fog of war, minimap och statistik.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Ownership och relationer för flera spelare. Verifiera targeting, fog of war, minimap och statistik.

**Dependencies:** RTS-173. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

**Leverans2026-10-05:** En människa + två självständiga AI på validerade Plains96/128-startplatser. Stabilt owner-ID, individuell ras/färg/bank/supply/kö/research/AI/fog; gemensamma relationer och scoped återanvändning av befintlig AI/combat. AI strider mot AI, projektiler/skademodifierare och offensiva spell-effekter bevaras hos rätt ägare. Setup, minimap och statistik per spelare; Save48 strikt validerade aktörsdokument/ägarreferenser och äldre47-migration. Riktade97/6 + modifierare31/3 PASS, slutlig unit461/83/build inklusive strict typecheck/diff PASS. Browser800/1280 faktiska menyval/betalda AI-banker, explicit AI-stridsfixture, save/load med mål/ägare och två omstarter PASS; settings800/AI-colors1280 granskade. artifacts/rts-174. Övriga kartor erbjuder fortsatt två spelare; lag och lagresultat levereras separat175/176. Ingen mänsklig helmatch/FPS-mätning hävdas.

## RTS-175 – Lag och allierad AI

**Status:** Done.

**Goal:** Lag och allierad AI.

**Requirements:**

Fasta lag, tydliga färger och definierad delning av vision.
Allierade attackerar inte varandra automatiskt.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Fasta lag, tydliga färger och definierad delning av vision. Allierade attackerar inte varandra automatiskt.

**Dependencies:** RTS-174. Befintliga relevanta system återanvänds efter inventering.

**Leverans:** Individuella team-ID:n, delad aktuell/utforskad vision, central ally/enemy-regel för attack/spells/splash, egen kontroll/repair och allierad passage genom öppna portar. AI hjälper vid synliga angrepp nära allierad bas. Save49 sparar relationer/vision; lagutfall hör till176. Native800/1280 verifierat i artifacts/rts-175/browser.json.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-176 – Lagmatchers resultat

**Status:** Done.

**Goal:** Lagmatchers resultat.

**Requirements:**

Seger/förlust, utslagna spelare och lagstatistik.
Hantera fortsatt match efter förstörd allierad bas.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Seger/förlust, utslagna spelare och lagstatistik. Hantera fortsatt match efter förstörd allierad bas.

**Dependencies:** RTS-175. Befintliga relevanta system återanvänds efter inventering.

**Leverans:** Lagutfall på befintlig individuell baseliminering, inerta eliminerade aktörer, spectator med lagvision utan order, separat owner-/teamstatistik och idempotenta highscores. Save50 inklusive strikt49-lagutfallsmigration, restart och menu-cleanup. Browser800/1280 PASS i artifacts/rts-176/browser.json; full slutregression1426/173 PASS609.57s, unit461/83, strict build/diff PASS.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-177 – Design för längre uppdrag

**Status:** Done (2026-10-05), design enligt [CAMPAIGN_DESIGN.md](CAMPAIGN_DESIGN.md).

**Goal:** Design för längre uppdrag.

**Requirements:**

Utvalda uppdrag siktar på cirka 20–40 minuter vid normalt tempo.
Flera delmål, expansioner och förändrade situationer.
Förläng inte genom enbart mer HP eller väntetid.
Speltider är designuppskattningar enligt användarens förtydligande; faktisk mänsklig tidsverifiering hör till RTS-179.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Utvalda uppdrag siktar på cirka 20–40 minuter vid normalt tempo. Flera delmål, expansioner och förändrade situationer. Förläng inte genom enbart mer HP eller väntetid. Speltider är designuppskattningar enligt användarens förtydligande; faktisk mänsklig tidsverifiering hör till RTS-179.

**Dependencies:** RTS-176. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

## RTS-178 – Implementera längre uppdrag

**Status:** Done (2026-10-05). Sju utökade missioner enligt CAMPAIGN_DESIGN.md; First Steps bevarad.

**Goal:** Implementera längre uppdrag.

**Requirements:**

Flerfasuppdrag med tydliga mål, briefings och uppdateringar.
Delmål fungerar korrekt efter save/load.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Flerfasuppdrag med tydliga mål, briefings och uppdateringar. Delmål fungerar korrekt efter save/load.

**Dependencies:** RTS-177. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

**Verifiering178:** Slutliga Save/campaign/team93/6 PASS; fas-/engångstryck19/1 PASS, tidigare berörda115/9 PASS. Alla sju betalda Normal-genomspelningar passerar i riktade körningar; detta är automation, inte mänsklig tid/balans. Slutlig unit461/83 och build/strict typecheck PASS; diff/manifest PASS. Browser native800/1280:14 nya starter, faktisk mål-HUD, explicit fas-/explorationfixture, fysiska Save/load/restart/meny. Aktiva och pausedbilder granskade; artifacts/rts-178. Save51 bevarar phase/wave-start; gamla50 behåller legacy-mål/kartor. Samlad Beginner/Normal-kampanjgranskning i179.

## RTS-179 – Campaign- och presentationsgranskning

**Status:** Done (2026-10-05), teknisk kampanj-/presentationsgranskning. Mänsklig speltid, svårighetskänsla, underhållningsvärde och ny mixlyssning är uttryckligen återstående enligt användarens avgränsning.

**Goal:** Campaign- och presentationsgranskning.

**Requirements:**

Speltesta tempo, Beginner, grafik, ljud och längre matcher.
Åtgärda prioriterade problem.
Skilj automatiska simuleringar från mänskligt speltest.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Speltesta tempo, Beginner, grafik, ljud och längre matcher. Åtgärda prioriterade problem. Skilj automatiska simuleringar från mänskligt speltest.

**Dependencies:** RTS-178. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.

**Verifiering179:** Samlad slutlig kampanj/fog/load53/6 PASS85.95s: alla åtta Beginner och Normal via betald automation, fas-Saves och faktiska goals. Unit461/83 PASS15.51s; build/strict typecheck PASS508ms; diff/manifest PASS. Browser800/1280 för fem raser: fysisk selection/right-click/F6/Stop, samtliga synliga action-ikoner inom bottom bar och tydlig objective.18 faktiska audioassets decode utan clipped samples, riktig appinstans paused/suspended. Highlands3072 explicit64/128-unit stressfixtur: CPU p95 efter9.4/18.9ms, FPS60.0/50.9; före16.1/50.1ms och49.7/23.3FPS. Avgränsad fog-unionoptimering med relations/occlusion/removaltest37/4. Artefakter i artifacts/rts-179. Ingen mänsklig20–40min eller allhårdvaru-/långmatch-FPS-claim.

## RTS-180 – Samlad release

**Status:** Done (2026-10-05). Release0.3.0/Build6a96227 publicerad och faktiskt browserkontrollerad.

**Goal:** Samlad release.

**Requirements:**

Verifiera gameplay, campaign, save/load, restart,
visningsstorlekar, fullscreen och GitHub Pages.
Uppdatera releaseversion, changelog och docs.
Publicera efter godkända kontroller.

**Non-goals:** Inga andra roadmap-features; återimplementera inte fungerande system.

**Acceptance Criteria:** Verifiera gameplay, campaign, save/load, restart, visningsstorlekar, fullscreen och GitHub Pages. Uppdatera releaseversion, changelog och docs. Publicera efter godkända kontroller.

**Dependencies:** RTS-179. Befintliga relevanta system återanvänds efter inventering.

**Tests:** Riktade beteendetester och berörda integrationer; browser-/speltest för kriterierna. Slutlig unit-suite, build inklusive strict typecheck och diffkontroll före kodcommit; docs-only kontrolleras för text/länkar/diff. Ej utförda checks redovisas.

**Docs:** BACKLOG.md, DEV_LOG.md och relevant README/GAME_DESIGN/ARCHITECTURE; meningsfulla beslut i DECISIONS.md.


**Verifiering180:** Slutlig full regression1458/176 PASS415.95s; unit465/84 PASS10.76s; strict typecheck/build PASS388ms; diff/manifest/länkar PASS. Faktisk [GitHub CI/Pages](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37355621323) SUCCESS. Public browser: fyra Native/Fit-fall, kampanj/save/load/result/replay, skirmishdefeat, lag-spectator/save/defeat, pause/menu cleanup, sex resolutionsval, fullscreen och reload. Alla18 ljudfiler och34 asset-URLs laddade i varje fall utan HTTP-/browserfel. Resultateliminering använder explicita fixtures; betald genomspelning är179:s separata belägg. Se [publiceringskontroll](artifacts/rts-180/public.md). Slutöverlämningen ändrar endast Markdown och återanvänder verifieringen av oförändrad kod.


## RTS-181 — Startinställning1920×1080 / Fit to Window

**Status:** Done (2026-10-05).

**Krav/acceptance:** Första start utan sparade preferenser använder1920×1080 och Fit to Window. Giltiga sparade val, inklusive lägre upplösning/Native, bevaras. Saknade/ogiltiga fält använder nya standardvärden; äldre adaptToWindow-migrering bevaras.

**Non-goals:** Övriga förbättringar i bifogad meny-/kampanjplan, nya resolutionsval och gameplay.

**Verifiering:** Riktade display/preference-tester, unit-suite, build inklusive strict typecheck, browser första start och sparat val/reload samt diffkontroll före commit/push.

**Resultat181:** Riktade display/preferences10/2 PASS; unit466/84 PASS9.53s; build inklusive strict typecheck PASS (befintlig bundlevarning). Lokal Chrome vid800×600/1920×1080: ny start1920×1080/Fit, proportionell appgeometri och sparat800×600/Native efter reload PASS utan pageerrors. Diff granskad. Ingen ny full campaign-/matchregression, CI eller Pages-verifiering;180:s belägg är historiska.


## RTS-182 — Titel och rasnamn

**Status:** Done.

**Krav/acceptance:** Warborn — A Tribute to Warcraft II. Synliga Human/Orcs; ta bort Crown Alliance/Iron Clan från spelartext. Kontrollera startsida, inställningar, HUD, briefing och resultat. Bevara tekniska ID:n, repo/Pages och saves.

**Non-goals:** Andra tasks, karteditor, ny backend eller ändring av användarens CSS/docs.

**Verifiering:** Riktade system-/integrationstester och verkliga browserflöden. Slutlig unit/build med strict typecheck/diff före commit. Full regression vid etappslut. Gemensam meny/HUD/input vid800×600,1920×1080,3440×1440. Inga fulla kampanjsimuleringar för rena menyändringar.

**Docs:** BACKLOG, DECISIONS, DEV_LOG, HANDOFF och relevanta systemdefinitioner. Taskvis commit/push utan force.

**Verifiering182:** Riktade9/3, unit466/84, build med strict typecheck/diff PASS. Lokal Chrome800/1920: titel, rasval och match-HUD utan gamla rasnamn/pageerrors PASS;800-HUD visuellt granskad. Tekniska IDs/saves oförändrade. Ingen ny CI/Pages eller helkampanjsimulering.


## RTS-183 — Highscores per karta och svårighet

**Status:** Done.

**Krav/acceptance:** Tabell med filter karta/svårighet och separata campaign/skirmish. Placering, poäng, ras, resultat, tid och känd datum/version. Befintlig sortering och tie-break; bevara data och redovisa okänd metadata. Ingen dubbelregistrering vid replay/save/load/återbesök.

**Non-goals:** Andra tasks, karteditor, ny backend eller ändring av användarens CSS/docs.

**Verifiering:** Riktade system-/integrationstester och verkliga browserflöden. Slutlig unit/build med strict typecheck/diff före commit. Full regression vid etappslut. Gemensam meny/HUD/input vid800×600,1920×1080,3440×1440. Inga fulla kampanjsimuleringar för rena menyändringar.

**Docs:** BACKLOG, DECISIONS, DEV_LOG, HANDOFF och relevanta systemdefinitioner. Taskvis commit/push utan force.


**Verifiering183:** Highscore/save/team23/3, unit467/84, strict build/diff PASS. Chrome800 faktisk tabell/filter/map/difficulty/mode/empty/legacy PASS; screenshot granskad. Äldre datum Unknown; configversion och partition bevaras. Match-ID-dedup oförändrad.

## RTS-184 — Större upplösningar och ultrawide

**Status:** Done.

**Krav/acceptance:** Behåll800×600 och befintliga val; lägg till2560×1440,2560×1080,3440×1440,3840×1600,3840×2160 och rendering efter tillgänglig fönsteryta. Native/Fit proportionella; större karta utan stretched sprites. HUD/minimap/input/fullscreen, förklaring/sparade val och prestandakontroll.

**Non-goals:** Andra tasks, karteditor, ny backend eller ändring av användarens CSS/docs.

**Verifiering:** Riktade system-/integrationstester och verkliga browserflöden. Slutlig unit/build med strict typecheck/diff före commit. Full regression vid etappslut. Gemensam meny/HUD/input vid800×600,1920×1080,3440×1440. Inga fulla kampanjsimuleringar för rena menyändringar.

**Docs:** BACKLOG, DECISIONS, DEV_LOG, HANDOFF och relevanta systemdefinitioner. Taskvis commit/push utan force.


**Verifiering184:** Display/preferences11/2 och camera10/2, unit468/84, strict build/diff PASS. Chrome800/1920/3440/3840: Native logical camera520/1640/3160/3560, physical worker/minimap, fullscreen och windowresize/reload PASS.3440bild granskad. Kort60-frame startmatchprobe≈60FPS; ingen massarmé/hårdvarugaranti. Testflödets initiala Survival→map-timeout och felaktiga FPS-formel rättades i extern harness före slutlig PASS.

## RTS-185 — Separat kampanjprogression

**Status:** Done.

**Krav/acceptance:** Separata serier/progression för campaign-ID, ras och difficulty. Egen berättelse/mål för alla spelbara raser. Första tillgänglig, sekventiell upplåsning och replay utan sänkt/cross progression. Save-identitet bevaras. Inventera/migrera legacy utan att tillskriva okänd progression.

**Non-goals:** Andra tasks, karteditor, ny backend eller ändring av användarens CSS/docs.

**Verifiering:** Riktade system-/integrationstester och verkliga browserflöden. Slutlig unit/build med strict typecheck/diff före commit. Full regression vid etappslut. Gemensam meny/HUD/input vid800×600,1920×1080,3440×1440. Inga fulla kampanjsimuleringar för rena menyändringar.

**Docs:** BACKLOG, DECISIONS, DEV_LOG, HANDOFF och relevanta systemdefinitioner. Taskvis commit/push utan force.


**Verifiering185:** Campaign/series/phases/highscores/save88/6, unit468/84, strict build/diff PASS.40 new campaign starts/saves via riktade tester, Human/Beginner isolation/replay/legacy preservation. Chrome1920 alla fem rasstarter/fysisk SaveLoad, terminalfixture för Human/Beginner och Orcs/Normal isolation PASS; progressionbild granskad. Ingen mänsklig helkampanj/tids-/balansclaim.

## RTS-186 — Kampanjflöde och successiva upplåsningar

**Status:** Done.

**Krav/acceptance:** Ras → difficulty → continue/start → briefing → mission. Engelska faktabaserade ras/difficultybeskrivningar. Aktuellt/tidigare uppdrag spelbara; framtida låsta. Alla rasers nivåer introducerar nytt innehåll via definierad plan; UI/gameplay/hotkeys spärrade separat från matchprerequisites. Replay använder missionens plan; skirmish oberoende. Dela vid behov i subtasks och redovisa saknat innehåll.

**Non-goals:** Andra tasks, karteditor, ny backend eller ändring av användarens CSS/docs.

**Verifiering:** Riktade system-/integrationstester och verkliga browserflöden. Slutlig unit/build med strict typecheck/diff före commit. Full regression vid etappslut. Gemensam meny/HUD/input vid800×600,1920×1080,3440×1440. Inga fulla kampanjsimuleringar för rena menyändringar.

**Docs:** BACKLOG, DECISIONS, DEV_LOG, HANDOFF och relevanta systemdefinitioner. Taskvis commit/push utan force.


**Verifiering186:** Riktade138/12, unit468/84, strict build/diff PASS. Fem raser×800/1920/3440 verkliga staged menus/briefings/SaveLoad/keyboardlocks och skirmishindependence PASS; positiv Barracks-hotkeykontroll PASS med explicit100wood-fixtur.800briefing visuellt granskad. Contenttests betalar tillåtna queues och observerar40 taktiska mål med explicita fixtures; inga40 fullkampanjer eller mänskliga tider hävdas.

## RTS-187 — Skirmish med flera AI-motståndare

**Status:** Done (2026-10-05).

**Krav/acceptance:** Undersök meny/matchstart. Faktiska startplatser styr max; tydlig kapacitet/orsak, per-AI ras/difficulty/profil/lag enligt system. Unika starter/giltiga lag; alla AI startar. Minst en karta human+2AI, rasbeskrivningar och samlade avancerade val.

**Non-goals:** Andra tasks, karteditor, ny backend eller ändring av användarens CSS/docs.

**Verifiering:** Riktade system-/integrationstester och verkliga browserflöden. Slutlig unit/build med strict typecheck/diff före commit. Full regression vid etappslut. Gemensam meny/HUD/input vid800×600,1920×1080,3440×1440. Inga fulla kampanjsimuleringar för rena menyändringar.

**Docs:** BACKLOG, DECISIONS, DEV_LOG, HANDOFF och relevanta systemdefinitioner. Taskvis commit/push utan force.


**Verifiering187/etappslut:** Riktade127/7 PASS. Slutlig unit468/84 PASS10.28s; build inklusive strict typecheck PASS360ms (befintlig bundlevarning); full regression1489/178 PASS419.51s på slutlig spelkod. Diff/manifest84unit+94integration/länkar/browser-script-syntax PASS. Chrome native800/1920/3440: faktiska två AI med egna raser/profile/team och Beginner/Hard, unika baspositioner, SaveLoad och fysisk worker/minimap/HUD PASS. Campaignbrowser fem raser×tre storlekar återkontrollerad efter omgruppering PASS; Highscore800/Native filters/legacy/tomläge/AI-config-rubrik PASS. Actual SaveLoad→terminalfixture→PlayAgain→completed-replay/current-only behåller identitet/policy/progress och exakt en score PASS. Representativa settings/tabell/briefingbilder visuellt granskade. Ingen ny CI/Pages eller mänsklig helkampanj-/balans-/ljudclaim.

**Stopp:** RTS-182–187 klara; fasen avslutad. Inga nya roadmaptasks eller karteditor. HANDOFF/QUALITY_REVIEW skiljer ny verifiering från RTS-180:s historiska releasebelägg. CSS/docs bevaras.
