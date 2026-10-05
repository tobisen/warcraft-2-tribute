# Warborn — A Tribute to Warcraft II

Arbetstiteln är inte juridiskt granskad för kommersiell release. Reponamnet
`warcraft-2-tribute`, GitHub-remote och Pages-adress är oförändrade.

Browserbaserat singleplayer-RTS inspirerat av Warcraft 2, Age of Empires 2 och
Command & Conquer. Phaser, strict TypeScript och Vite; local-first, gameplay
före grafik. Egna terräng-, byggnads- och enhetsassets, animationer, ljud och fantasy-HUD. Aktuell version är0.3.0. Taskstatus finns i [BACKLOG.md](BACKLOG.md).

## Installation och lokal start

Använd Node.js 20.19+ inom version 20, eller 22.12+ och npm:

```sh
npm ci
npm run dev
```

Öppna adressen Vite skriver ut, normalt http://localhost:5173/.
De mindre kartorna är1280×960 world pixels; Frontier Valley1600×1152, Highlands/Plains96 är3072×3072 och Coast/Plains128 är4096×4096. Spelvyn fyller fönstret med responsiv canvas, befintlig280px sidopanel och sessionrad. Dra med mittenmusknappen för begränsad pan; zoom är1. Vid större viewport centreras hela kartan utan att sprites förstoras. Sidopanelen scrollas. Verifierade layoutstorlekar är1280×720 och1920×1080.

## Spela matchen

I huvudmenyn väljer du Campaign eller Skirmish (med separat Wave-survival-val). Campaign går via ras → svårighet → start/fortsätt → briefing. Alla fem raser har varsin åttauppdragsserie med egen berättelse och taktiska mål; progression är separat för kampanj, ras och svårighet. Skirmish låter dig välja fem raser, karta och AI-spelare. Välj Beginner/Easy/Normal/Hard och gameplayhastighet. Nya kampanjstarter har permanenta faser: preparation, spaning, försvar, passage, transport, eskort, räddning och kustkontroll. Läs aktuellt engelskt phasegoal. Fristående scenarier och äldre kampanj-saves behåller tidigare villkor. Förlust vid basens död har företräde.

1. Välj workers och utforska nära basen. Högerklicka upptäckt wood/gold. På de flesta kartor finns wood vid(650,180), gold vid(850,220); på kust-/ö-kartor ligger startgruvan vid(600,300). Workers samlar och levererar automatiskt.
2. Välj en worker och Build Barracks. Placera grön preview nära basen, exempelvis(528,400) om platsen är fri. Worker bygger; ge därefter ny gather-order. Kostnader/tider varierar med fraktion och visas på knapparna. Escape/högerklick avbryter preview.
3. Välj barracks och träna en betald armé. Bygg farm för supply, och forge/research vid behov. Orders/Build/Train/Research grupperar relevanta actions. Arbetare och stridsenheter produceras parallellt i sina byggnader.
4. Klick eller drag väljer trupper; högerklick ger move eller attack på synlig fiende. Attack Move/Stop/förmåga har knapp och hotkey. Skydda workers/bas och uppfyll briefingens mål. På naval-uppdrag behövs harbor, transport, boarding och fri synlig landstigningsyta.
5. Victory/Defeat fryser gameplay. Visa statistik/highscores, Play Again för helt ny match, eller Main Menu. Save/load bevarar pågående mål och match-ID; äldre Saves förblir spelbara utan highscore-registrering.

Vänsterklick väljer en unit eller valfri egen byggnad (även varje farm och forge).
Synliga fiendebyggnader visar namn/HP i en begränsad inspektionsvy utan orders.
Farm förklarar supply; forge visar research och produktionsbyggnader visar kö/prerequisites. Units har företräde vid
överlapp; byggnadsval och unit-selection är exklusiva. Tom mark avmarkerar.
Drag ersätter selection med units vars centrum ligger i rektangeln, inklusive
kanten. Gester under 5 screen pixels är klick. Ringar/byggnadsram visar val.

Högerklick på mark med valda units ger separata nåbara slutpositioner kring
klickmålet med enhetens fraktionsspecifika config-hastighet. Ny order ersätter föregående; avmarkering stoppar inte
rörelse/arbete. Stop avbryter valda units men bevarar last. Gul målring visar
aktiv order, röd ring blockerad route; HUD visar fas och felorsak.

Högerklick med vald bas/barracks sätter dess rally för framtida units. Grön
markör visar målet. Ogiltigt mål behåller föregående rally. Spawnade units
börjar omarkerade; utan rally är de idle, annars får de move. Worker-rally
innebär ingen automatisk gathering.

Startnoder och extra förråd varierar mellan kartor. Insamlingshastighet och lastkapacitet följer fraktionens worker-config; för Humans är rate1/s och kapacitet5;
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
vid död; byggnadsdöd ger ingen refund och tar bort kö/rally/footprint. Soldiers stöder manuell attack, automatisk lokal targeting och attack-move.
Units kan överlappa under gång; ingen full collision avoidance eller avancerad AI-ekonomi finns.
Ljud och lokal save/load är implementerade i RTS-056/059. Balans och verifierade flöden finns i DEV_LOG och RELEASE_CHECKLIST.

## Checks

```sh
npm test
npm run typecheck
npm run build
```

Vitest testar rena gameplay-/presentationregler i Node. Typecheck kör strict
TypeScript; build kontrollerar typer och skriver till `dist/`. Dependencies
låses i package-lock; `node_modules/` och `dist/` ignoreras. Den befintliga
varningen om stor Phaser-bundle kvarstår inom releasebudgeten. Pages-workflow kör verifiering och publicering på main.

## Dokumentation

- [AGENTS.md](AGENTS.md): arbetsregler och Definition of Done.
- [BACKLOG.md](BACKLOG.md): historiska tasks, roadmap RTS-151–180 och Current Focus.
- [GAME_DESIGN.md](GAME_DESIGN.md): regler och framtida mål.
- [ARCHITECTURE.md](ARCHITECTURE.md): faktisk struktur.
- [DECISIONS.md](DECISIONS.md): beslut och öppna frågor.
- [DEV_LOG.md](DEV_LOG.md): checks, speltester och märkta fixtures.
- [Implementer](.agents/implementer.md), [Reviewer](.agents/reviewer.md) och
  [Finisher](.agents/finisher.md): rollinstruktioner, inte automatiska agenter.

RTS-066 är klar. Användaren har godkänt fortsatt arbete med återstående roadmap; nästa task är RTS-067. Multiplayer, backend,
konton, procedural generation och modding ingår inte. Pages-publicering ingår enligt användarens godkända tillägg.

RTS-031: välj worker innan placering. Barracks reserveras direkt och kräver
5 s arbete efter approach. Stop/ny order pausar utan refund. Högerklicka
ofärdigt bygge med vald worker för att återuppta; produktion kräver completion.
Builder blir idle när färdig – ge ny gather-order.

Population börjar på 3/8. Worker/soldier/archer använder 1 supply och catapult 2; ett jobb
reserverar sin unit-typs supply. Vid full cap: välj worker och ”Bygg farm – 20 wood”; färdig farm
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

## RTS-037 – Archer

Välj färdig barracks och Träna archer (20 wood/10 gold, 6 s, supply 1).
Archer är blå med etikett, 40 HP, speed 140, range 160 och aggro 200.
Befintlig klick/dragselection, Move, Stop, automatisk attack, manuell attack
och attack-move gäller; resource-klick ger aldrig gather/cargo. Barracks
delar FIFO-kön mellan soldier/archer och bevarar jobbens typ/tid/kostnader.
Pilar: 12 damage varje sekund, speed 300, lifetime 2 s. Fast aim point gör
att rörliga targets kan undvika träff (16 px hit-radius). LOS krävs vid skott
och längs flygsegment; dött/osynligt target tar bort pilen. Damage sker bara
vid ett giltigt impact. Game over fryser simulation och döljer pilar; restart
rensar projektile-state, cooldown och rendering.

## RTS-038 – Catapult

Färdig barracks tränar catapult: 40 wood/20 gold, 10 s, supply 2. Lila
40 px kropp, 80 HP, speed 80, range 224/aggro 260. Samma orders som övriga
combat-units och ingen gathering. Navigation/spawn/klickträff använder faktisk
kropp; 32 px passage som fungerar för worker/soldier kan blockera catapult.
Fast impactpunkt, 24 damage var 2 s, projectile speed 180/lifetime 3 s.
Splash 48 px inklusive kanten, utan falloff eller friendly fire; avstånd till
byggnads-footprint används. Dött initialmål tar inte bort siege-skottet,
som fortfarande kan skada andra synliga enemies vid impact. Terrain stoppar
flygsegment. Fiendebyggnads-targets kan ta skada och deras hinder rensas;
en faktisk fiendebas/match kommer i RTS-041. Dessa värden är preliminära.

## RTS-039 – Forge och uppgraderingar

Välj worker och bygg Forge: 40 wood/10 gold, 64 px footprint, 5 s arbete,
HP 120 och högst en. Stop/ny order pausar; högerklick med worker återupptar.
Färdig Forge öppnar globala researchknappar, utan ändrad selection/order.
Attack och defense har en nivå vardera (40 wood/10 gold, 8 s, ett jobb utan
kö). Attack ger ×1,25 damage; defense ger ×0,75 mottagen damage för combat-
units. Workers/byggnader påverkas inte och inga HP återställs. Bonusar gäller
både gamla och nya units dynamiskt. Redan avfyrade projektiler behåller
sin damage. Död Forge stoppar research utan refund; färdiga bonusar består
vid rebuild. Game over spärrar research, restart återställer hela trädet.

## RTS-041 – Fiendebas

Default survival är oförändrat. För belägring öppna ?scenario=siege-test:
96 px enemy-base vid 960,96 med 240 HP. Den blockerar navigation och kan
attackeras av alla combat-typer via giltig approach/LOS. Död rensar footprint,
revision och targetorders. Klick ger aldrig spelarens produktions-/rally-UI.
Testscenariot behåller finite waves; förstörd enemy-base ger inte separat
victory och stationär bas räknas inte som kvarvarande wave-unit. Riktig
skirmish-seger och scenario-val kommer i RTS-045. Restart behåller URL-valet.

## RTS-042 – Fiendeproduktion

Siege-test har ändlig basbudget 80 wood/20 gold, cap 6, FIFO max tre och
soldier-liknande enemies för 20 wood/5 gold och 5 s. Högst fyra units kan
produceras; ingen refill eller worker-ekonomi. Produktion/reservations/spawn
är atomiska och använder gemensamma regler. Blockad utgång väntar utan
dubbel debitering; player-ekonomin ändras inte. Basdöd rensar jobb utan refund
och restart återställer budget/IDs/timers. Producerade units står idle tills
AI-grupper införs i RTS-043; wave-enemies behåller sitt befintliga beteende.
Default survival får ingen fiendeproduktion.

## RTS-043 – AI-grupper

Producerade enemies samlas nära 896,320 i tvåunitsgrupper med separata
säkra destinationspunkter. Full och ankommen grupp blir ready; 15 s timeout
gör överlevande underbemannad/blockerad grupp ready. Första dispatch tidigast
60 s, därefter minst 15 s mellan grupper. En grupp får en attack-move-order
mot player-bas, med befintlig lokal targeting/navigation. Inga gratis units:
80 wood/20 gold begränsar produktionen till fyra. Wave-enemies ingår inte i
grupperna. Döda medlem-/destinationsreferenser och tomma grupper rensas även
vid game over; restart återställer timer/ID:n/grupper.

## RTS-044 – Lokalt basförsvar

En producerad unit är reserve nära enemy-base. Hot är levande synliga och
nåbara combat-units inom 256 px från basens footprint; workers räknas inte
som hot. Högst två defenders prioriterar reserve, befintliga defenders och
närmaste tillgängliga units med stabilt ID. Giltigt mål behålls. Borrowed
unit tas ur anfallsgruppen och återgår dit om det finns plats, annars till
ny samling; reserve går tillbaka till säkert home utanför basen. Ny dispatch
pausas under hot; övriga redan skickade units fortsätter. Förluster kan
ersättas endast ur kvarvarande budget, supply och produktionstid. Vid budget
0 tillkommer inga units. Basdöd släpper reserve till grupp-AI och stoppar
produktion utan refund. Visibility-kontrakt förbereder RTS-049; fog är ännu
inte aktiv. Död target och restart rensar försvarsreferenser.

## RTS-046 – Svårighetsgrad

Välj Easy, Normal eller Hard i startmenyn. Val ändras via ”Ny match / meny”
och ”Starta match”; restart behåller båda valen. Normal bevarar hittills speltestad balans. Alla har samma
player-resurser, priser och combat-stats. Fienden får ingen extra påfyllning.

| Profil | Skirmish-budget wood/gold | Produktion | Första grupp / gap | Survival tid: antal |
| --- | --- | --- | --- | --- |
| Easy | 40 / 10, cap 4 | 7 s | 75 / 20 s, grupp 2 | 75:1, 110:1, 145:2 |
| Normal | 80 / 20, cap 6 | 5 s | 60 / 15 s, grupp 2 | 60:1, 90:2, 120:3 |
| Hard | 120 / 30, cap 8 | 4 s | 50 / 12 s, grupp 3 | 50:2, 80:3, 110:4 |

Profilerna är preliminära. Easy ger längre uppbyggnad och högst två fiende-
soldater i Skirmish; Normal fyra, Hard sex. Gruppens anfall kan dröja tills
samling/timeout är klar. Lokal reserve och försvarsprioritet gäller alla.

## RTS-047 – Minimap

Den lilla kartan i HUD visar hela världen, byggnader, resurser och levande
units. Vit ram visar viewport. Vänsterklick centrerar kameran kring punkten
och begränsar den vid världens kanter. Selection och orders bevaras.
Minimapen är separat från spelcanvas; ingen gameplay-order ges där.

## RTS-048 – Fog-modellens fixture

RTS-048 införde modellen före aktivering. Från RTS-049 är player-fog aktiv i
vanligt spel. `?fog-preview=player` eller `?scenario=skirmish&fog-preview=enemy`
är märkt utvecklarfixture för teamets mask; objektinformationen använder
fortfarande player-filtrering. Svart är okänt, mörkt är explored utan vision.

## RTS-049 – Fog som spelregel

Enheter/HP/marker visas endast med current vision; inget enemy-minne sparas.
Attack släpps när target blir osynligt. Autoattack återgår till origin/
attack-move, och pilar försvinner vid förlorat mål; siege fortsätter mot sin fasta
siktpunkt utan dold tracking. Splash skadar inte dolda
enemies. Enemy-AI använder egen teamvision och kan utforska mot kartans
konfigurerade basmål. Minimapen filtreras; resursernas återstående mängd är
`?` utan current vision, men utforskad resurs kan fortfarande beordras.
Byggplacering kräver current vision över hela footprinten.

## RTS-050 – Shift och kontrollgrupper

Shift-klick togglar en unit; Shift-drag lägger till träffar. Tomma Shift-
gester bevarar urval. Normal selection fungerar som tidigare. Modifieraren
låses vid gesture-start. Byggnadsklick behåller exklusivt byggnadsval.
Ctrl/Cmd+1–9 binder valda levande egna units; 1–9 ersätter urval med gruppens
giltiga units och ger ingen order/kameraflytt. Tom grupp avmarkerar. Recall
avbryter aktiva placement/attack-move-preview; pågående orders fortsätter.
Tangent-repeat, Alt, textfält, editable och fokuserade knappar/select ignoreras
för gameplay. Klicka spelcanvas för tangentfokus. Döda ID:n rensas, dolda/
främmande units filtreras. Restart/lägesbyte nollställer grupper.

## RTS-051 – Tangenter och guide

Öppna ”Tangenter och kommandon” i HUD; samma tangenter visas på knapparna.
S Stop, A attack-move, B barracks/F farm/G Forge med worker vald, W worker
med bas vald, T soldier/R archer/C catapult med barracks vald, U/D research
med färdig Forge. Escape avbryter preview; Shift och grupper enligt ovan.
Klicka spelcanvas för fokus. En grå knapp spärrar även sin hotkey; knappar
och status visar kostnad/saknat saldo, population, byggnadsval och kö. Repeat,
modifierade bokstavstangenter och UI/text-fokus ger inga gameplay-actions.
Pause-guard är nu inkopplad i RTS-052:s sessionflöde.

## RTS-052 – Start, pause och ny match

Startmenyn har två modes, tre profiler och den enda handgjorda arenan.
P eller ”Pausa” fryser gameplay. ”Återuppta”/P fortsätter utan pausens wall-
time; first resume-frame ger ingen progress. Escape cancellerar aktiv
placement/attack-preview först, annars pausar/återupptar. UI/text-focus
skyddar tangenterna. Under pause kan meny, guide och minimapkamera användas;
orders/selection/ekonomi är spärrade och ocommitterade preview cancelleras.
”Starta om” från pause/game over behåller val och resetter hela matchen.
”Ny match / meny” fryser den gamla matchen och låter dig välja före nästa Start.

## RTS-053 – Egna pixelassets

Terrain är 32 × 32 RGBA-tiles; wood/gold har 64 × 64 transparenta available/
depleted-frames. Nearest-neighbor i native world-skala; gameplay/footprints
är oförändrade. Exportera på nytt med `npm run assets:export`; PNG/atlas/
manifest är incheckningsbara filer och behövs inte genereras vid varje dev-
start. [Källor, palett, ankare och provenance](assets/README.md) finns lokalt.
Assetkonformitet körs med vanliga `npm test`; inga nya dependencies.

RTS-053-tillägg: native gräs med enhetlig grundton, pixelstrand/bergskanter endast vid exponerade patchkanter och egna skogs-/gruvresurser. Övergångar ändrar inte navigation eller footprints. Exporten omfattar 16 world-frames.

## RTS-054 – Byggnadssprites

Egen RGBA-atlas från assets/sources/buildings.mjs: bas, barracks, farm och Forge med blå/röd heraldik och tre statiska frames (grund, halvbygge, färdig). 128 px standard, farm 64 px; ankare är (.5,.75) vid logisk footprint-center. Native rendering utan skalning; befintliga footprints (spelbas 48 px, fiendebas 96 px, andra byggnader 64 px), HP och byggtid ändras inte. Foundation används över halva återstående byggtiden; halvbygge därefter, färdig vid noll. Enemy-varianter finns för alla typer men inga nya enemy-byggsystem införs. Fog/death tar bort renderobjekt; selection följer footprint, bas/fiendebas har synlig HP-text. Källor/palett/atlas/manifest exporteras med assets:export, ingen extern spelgrafik.

## RTS-055 – Enhetsanimationer

960 egna RGBA-frames i units-atlas från assets/sources/units.mjs: worker med verktyg, armored soldier/sköld, archer/båge och träcatapult. Blå/röda lagfärger, åtta riktningar (E, SE, S, SW, W, NW, N, NE), idle 1 och walk/attack/death 4 frames; worker gather/build 4. Humanframes 32 px med ankare (16,22), catapult 64 px (32,40). Walk/work/attack loopar i 8 FPS, death är en separat 0,5 s presentationsrest efter logical removal, utan HP/selection/target. Fog hiding skapar ingen död; dolda/dead renderobjekt och rests städas vid reset. Facing/state/frame väljs i presentation/animation.ts; simulationstiden styr bildtid, paus fryser även frames. Damage, gathering och construction drivs fortfarande enbart av gameplay-delta, aldrig animationsevents. Hitboxes/navigation/supply är oförändrade. Källor är egen originalkomposition, inga importerade spelsprites.

## RTS-056 – Eget ljud

16 s originalkomposition och command/impact/complete/victory/defeat från scripts/export-audio.py, PCM WAV-masters (mono 24 kHz/16 bit) och lokala Vorbis OGG med WAV-fallback. Manifest beskriver loop/duration/normaliseringsvolym. Appens enda Web Audio-graf skapas efter första klick/tangent eller Aktivera ljud; separata master/effects/music och mute verkar direkt, inställningar bevaras vid scene-restart. Pause suspenderar grafen; menu/game over/reset stoppar gamla källor. Musiken loopar exakt 16 s och exkluderar codec-padding. Throttle och looplängd finns i config/audio.ts. Public damage/completion hörs; enemy-händelser kräver syn både före och efter, och hidden removal/reveal är tyst. Saknat ljud blockerar inte gameplay.

Chromium-desktop är verifierad ljudprofil (OGG och WAV); andra browsermotorer är ännu inte verifierade. Exportverktyget soundfile används endast utanför projektets runtime/npm-dependencies: skapa en temporär Python-venv, installera soundfile där och kör scripts/export-audio.py, eller npm run audio:export med sådan miljö. Färdiga assets är incheckade; npm ci/build behöver inget Python-ljudverktyg.

## RTS-057 – Fantasy-HUD och effekter

Original trä-/mässingspanel med 16-px border, åtta 32-px ikoner och läsbara blå/röda lagfärger. Desktop (1280×900) har 280-px scrollande kommandopanel intill native 800×600 world; under 1120 px staplas world/HUD, inga worldkoordinater skalas. Georgia/systemfont är lokala standardfonts, inga externa font-/assetanrop. Hover/pressed/disabled/focus är olika; text/labels och keyboard-guide finns kvar, aria-pressed visar modes. HP är kompakta staplar; worker-last visas vid markerad worker, detaljer kvar i status.

Impact 32 px och splash 64 px har fyra egna frames i 8 FPS, 0,5 s bounded lifetime/max 64 effekter. Presentation visar synliga projektilers landningspunkt, även en synlig miss, utan att läsa dold HP eller driva damage. Fog/pause/reset styr effekternas syn/livstid; gameplay och inputfunktioner är oförändrade. Exportkälla assets/sources/ui.mjs, manifest/panel/atlas under public/assets.

## RTS-058 – Tre uppdrag

Startmenyn behåller Survival/Skirmish och lägger till Skogsvakten (besegra tre vågor, 20 wood/10 gold), Belägringen (förstör fiendebasen, 20/10) och Utposten (håll basen vid liv i 90 gameplay-sekunder, 40/10). Instruktion och start är explicita scenario-configs på befintlig handgjord arena. Utpostens normal-vågor är 30/60/80 s (1/2/2 fiender); Easy senare/färre och Hard tidigare/fler. Andra missions använder befintlig difficulty-pressure.

Måltid använder gameplay-delta; stora steg delas vid deadline så seger stannar exakt vid 90 s. Defeat har alltid företräde vid samma boundary. Levande fiender hindrar inte timerseger. Scenario/map/objective/start kan återställas individuellt och menuval påverkar först ny match; pause fryser även mål. Ingen kampanj, ny unittyp eller terränggenerator införs.

## RTS-059 – Lokal sparning

Spara lokalt skriver en manuell slot i denna browsers localStorage. Ladda sparning fungerar även från startmenyn och öppnar en levande match pausad; välj Återuppta. Ingen autosave eller filimport/export. Slot finns kvar efter restart/ny match och sidreload; privat läge/rensad webbläsarlagring kan göra den otillgänglig. Localhost och Pages har olika origins och delar inte sparningar.

Schema 1 / tribute-config-1 innehåller hela modellen, scenario/arena/tid/outcome/pause, resurslaster/saldo, units/orders/IDs/HP, byggtid, FIFO-kostnader/rally/reservationer, research, projektiler, AI-budget/grupper/waves och fog/explored samt kamera/byggnadsselection. Navigation och render/audio/listeners/blocked-spawn-cache lagras inte. Matchens dynamiska footprints valideras mot sparade byggnader/resurser; enheternas clearance, ID-referenser, queue/config och fog-form granskas innan state byts atomiskt. Navigation planeras om från orders, current vision räknas om medan explored bevaras.

Save v1/config1 migreras atomiskt till v2/config2 med standardfraktionerna crown/clans. Korrupt/okänd äldre/framtida schema eller annan config-version avvisas. Aktiv match och tidigare slot förblir oförändrade vid load-/storagefel. Load rensar uncommitted previews och återskapar scenens render/listeners, ger ingen wall-time-bonus och laddar terminala matcher som terminala. save.ts och config/save.ts är Phaser-fria. Fog-factory sparar nu endast deklarerade worlddimensioner, inte oavsiktliga gamla map-obstacles.


## Release och GitHub Pages – RTS-060

[Releasekontroller och mätningar](RELEASE_CHECKLIST.md) beskriver stödd desktopprofil, full scenariomatris, budget och begränsningar. RTS-001–065 är implementerade; RTS-066–090 förblir planerade.

Lokal produktionskontroll:

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run preview
```

Öppna preview-adressen med `/warcraft-2-tribute/`, normalt http://localhost:4173/warcraft-2-tribute/. Dev fortsätter använda rotadressen som Vite skriver ut. [vite.config.ts](vite.config.ts) sätter projektets subpath för build/preview; sprites/ljud/CSS hämtas från samma bas.

Spelet är publicerat och browserkontrollerat på [warcraft-2-tribute på Pages](https://tobisen.github.io/warcraft-2-tribute/). Efter godkända lokala releasechecks kör [Pages-workflowen](.github/workflows/pages.yml) på push till main eller manuellt workflow_dispatch: låst npm ci, alla tester, typecheck och build före uppladdning/deploy. GitHub Pages använder GitHub Actions som källa. Inga konton/backend krävs för att spela; publicerad origin har en egen lokal sparslot och tar inte över localhost-saves. Faktiskt publiceringsresultat anges i DEV_LOG.

Hard kräver tidig ekonomi/armé och aktiva order; samla gärna wood med alla tre först, bygg barracks och flytta sedan en till gold. Gold nära fiendebasen i Skirmish behöver skydd. Ingen balansändring behövdes för release-matrisens segrar; ett vunnet skriptflöde är inte generell garanti om svårighetsgrad. Andra browsermotorer/mobil och akustisk lyssning är ännu inte verifierade. Bundle-varningen är kvar inom fastställd storleksbudget.


## RTS-061: kvalitetsgranskning

[QA_REVIEW.md](QA_REVIEW.md) beskriver verifierad Pages, betald större blandad armé, prioriterade fynd och browser-/tillgänglighetsgränser. Inga blockerande/P1-regressioner; överlappning och resurs-trängsel hanteras i RTS-063/064. Ny godkänd etapp fortsätter till RTS-065; RTS-066–090 är endast planerade.


RTS-062: QA-granskningen gav ingen bekräftad P0/P1-fixlista; gameplay/save-format är oförändrade. Överlappning och köer hanteras taskvis i RTS-063/064 enligt QA_REVIEW.md.


## RTS-063: lokal separation

[separation.ts](src/gameplay/separation.ts) och [config](src/config/separation.ts) separerar kvadratiska unit-kroppar deterministiskt med max48 px/s correction, spatiala64px-celler/två pass/12 grannar. Terräng/world bounds respekteras; orders/last/selection/HP bevaras. Rörda pathcaches planeras om, blockerade kommandoresultat behålls utan automatisk fallback. Fog uppdateras efter separation; paus/game-over fryser. Save schema/config1 behålls utan ny persistent state. Kortvarig kontakt vid rörelse och omöjlig packning i trång terräng kan kvarstå; resource/passage-köer följer i RTS-064.

RTS-064 kompletterar mjuk separation med resurskö vid fler än tre workers på samma nod och begränsad insläppning i smala passager. Prioritet följer gameplay-tid; save/load och nya orders fungerar utan nya sparade köfält. Vanlig insamling med upp till tre workers behåller tidigare beteende.

RTS-065: uppmätt optimering av routesökning; se [PERFORMANCE.md](PERFORMANCE.md) för före/efter, 64/128-kroppars budget och reproducerbar browserprofil. RTS-066–090 är fortsatt planerade, utanför den avslutade etappen.

## RTS-066: fraktionsgrund och save v2

Två tekniska fraktions-ID:n (`crown`, `clans`) har egna typ-ID:n för samma delade unit-/building-/upgrade-roller i [factions.ts](src/config/factions.ts). Fraktion lagras separat från player/enemy-owner och bevaras genom Save/Load/restart. Den vanliga matchens stats/ekonomi/grafik är tills vidare oförändrade; valbara namn/assets införs i RTS-067 och fraktionsbalans i RTS-068.

Sparformat v2 stöder migration av tidigare v1-sparningar i samma lokala slot. Load skriver inte över den gamla sloten; nästa manuella Save lagrar v2. Okända fraktioner/versioner eller korrupta data avvisas utan att påverka aktiv match.

RTS-067: startmenyn erbjuder **Kronförbundet** och **Järnklanen**, med egna originalsprites och namn. Nya matcher väljer motsatt fiendefraktion; sparning och omstart behåller sidval. Båda använder ännu samma spelvärden. `npm run assets:export` exporterar båda fraktionernas atlasvarianter; `npm test` kontrollerar samtliga frames och befintlig gameplay.

RTS-068: Kronförbundets soldat kostar **20 wood + 5 gold**, tar **5 s** och har **60 HP**. Järnklanens yxkrigare kostar **18 wood + 6 gold**, tar **6 s** och har **66 HP**. Övriga enhetsrecept är oförändrade. Save använder config3 och migrerar tidigare config1/config2 med redan betalda köjobb bevarade; sloten och kommandona är samma.

RTS-069: markera stridsenheter och tryck **E** eller fraktionsknappen. **Försvarshållning** (Kronförbundet) minskar inkommande skada 25 %; **Raseri** (Järnklanen) ökar utgående skada 25 %. Effekt 5 s, cooldown 20 s från aktivering, ingen resurskostnad. Status visar valda units timers; paus/Save/load bevarar dem och restart återställer. Save-config är nu 4 med migration från tidigare configversioner.

RTS-070: [fraktionsspeltest](FACTION_BALANCE.md) verifierar båda val i alla fem scenarios/tre svårigheter, verklig defeat, fraktionsbyte och två naturliga Utposten/Normal-vinster. Järnklanens gold-behov gör tidig insamling och worker-skydd viktiga. Balansen är preliminär inför enemy-ekonomi; inga spelvärden ändrades i speltesttasken.

## RTS-071: delade resurser

I Skirmish och Belägringen har fienden två arbetare (30 HP), en per resurs.
De bär högst 5, samlar 1/s och levererar vid sin bas. Du kan angripa synliga
arbetare för att minska fiendens inkomster. Noderna är samma ändliga noder
som dina arbetare använder. Arbetare på leveranstur upptar ingen arbetsplats
vid noden. AI:ns första gruppanfall väntar 20 s extra i dessa nya ekonomimatcher
(Easy 95, Normal 80, Hard 70); försvar och lokal attack kan ske tidigare.
Save config5 bevarar fiendelast, orders, bank och bokföring. Äldre saves
laddas utan extra arbetare eller income; restart använder den nya starten.

## RTS-072: AI bygger sin produktion

I nya Skirmish/Belägringen bygger fienden en barracks för 40 wood med
5s worker-arbete innan den kan producera. En farm för 20 wood och 5s
byggarbete ger +5 supply när populationen närmar sig basens cap8.
Fiendearbetare räknas i supply; difficulty-army-cap gäller samtidigt.
Du kan angripa synliga byggen och färdiga byggnader. AI kan återuppta
blockerade byggen eller byta builder utan att betala samma site igen.
Save config6 bevarar byggen/last/timing. Äldre saves behåller sin tidigare
base-production och får inga gratis byggnader; restart använder nya regler.

## RTS-073: AI prioriterar och forskar

AI prioriterar barracks/supply, minst tre levande stridsenheter, Forge,
attack1 och defense1. Forge kostar 40 wood/10 gold och 5s worker-arbete;
varje research kostar 40/10 och tar 8s. Nya army-jobb pausas medan banken
sparar till ett obetalt bygge/research; betalda jobb fortsätter. Efter
betald research-start kan army-produktion fortsätta samtidigt. Under tre
levande stridsenheter prioriteras ersättning före ny forskning.
Enemy-attack ger +25% skada, defense minskar inkommande skada 25%, enbart
för stridsenheter. Workers/byggnader får ingen bonus. Save config7
bevarar forskningen; gamla snapshots får inga gratis uppgraderingar.

RTS-074: AI ersätter förlorade workers för20wood/5s till två levande.
Efter färdig barracks, tre army och båda uppgraderingar kan den bygga
en extra resursbas för80wood/20gold/10s. Färdig bas ger +8 supply och
närmare leverans vid befintliga ändliga noder. Angripbar och möjlig att
återuppbygga med ny kostnad. Save config8 bevarar betalda worker-jobb,
extra bas och retry; äldre saves får inga nya units/baser gratis.

RTS-075: fienden söker okända resurser med en tom arbetare och
utforskar med anfallsgrupper innan spelarbasen setts. Dolda nodmängder
uppdaterar inte minnet. Save config9 bevarar upptäckt; restart rensar den.
Äldre saves behåller sin tidigare AI-policy.

## RTS-076: tre skirmish-kartor

Välj Skirmish i menyn och sedan karta: Handgjord arena(400wood/300gold),
Skogspasset(500/250) eller Flodkröken(350/400). Kartorna har olika hand-
placerade rock/water-patches men samma1280x960/32px, baser och nodpositioner.
Båda fraktioner stöds. Andra scenarios använder originalarenan.
Save config10 bevarar kartvalet; Load och restart använder samma profil.
Äldre saves migreras som arena utan ny resursstock.

RTS-077: menyn sammanfattar karta/resursstock, fraktion/förmåga och
svårighetsgrad före Start. Alla18 skirmish-kombinationer stöds.
Valen är låsta under match och bevaras vid pause/Load/restart; Ny match
öppnar valen igen. Byte till mission/Survival använder originalarenan.

RTS-078: efter Victory/Defeat visas gameplay-tid och ekonomi-/enhetsstatistik
för båda lag. Insamlat skiljs från levererat; netto spenderat betyder
betalning minus refunds och inkluderar ofärdiga jobb. Enhetsstatistiken
räknar tillkomna/förlorade/besegrade enheter, utan byggnader och
startenheter i tillkomna. Save/load bevarar resultat; restart rensar det.

## Längre skirmish-kontroller

RTS-079 provar betalda spelarorder på alla tre kartor, båda fraktionerna
och alla difficulties. Det är en avgränsad strategi, inte ett mått på lika
vinstchans. Passivt spel kontrollerar fiendens kostnader/insamling och
terminalfreeze. Sökrutten använder giltig mark på samtliga kartor.

RTS-080-release: [spela på GitHub Pages](https://tobisen.github.io/warcraft-2-tribute/).
Två fraktioner, tre skirmish-kartor, betald AI-ekonomi och matchresultat
är publicerade. Aktuella releasekontroller och begränsningar finns i
[RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md). Sjösystem kommer i nästa etapp.

Vatten/kust-reglernas grund finns i RTS-081: ruttadapter och kroppsgiltighet
är testade utan ändrad landrörelse. Spelbara hamnar/fartyg följer i
RTS-082; inga fartygsknappar är införda i grundslicen.

RTS-082: välj worker → Bygg hamn på synlig kust → låt bygget
färdigställas → välj hamnen → Bygg fartyg. Hamn40wood/10gold;
fartyg40wood/15gold,8s och2 supply i gemensam FIFO/population.
Välj fartyg med klick/drag och högerklicka i sammanhängande vatten.
Stop/grupper/Save/restart fungerar; transport är nästa slice. Hamn/fartyg är tydligt märkta kodritade placeholders.


RTS-083: markerat fartyg + högerklick på synlig fiende ger kanonattack.
Fartyget håller sig i vatten och söker fri skottlinje inom192px;16 damage
var1,5s. Move/Stop ersätter attack. Kustfiender kan skada fartyg och hamn.
Save config12 omfattar attack/cooldown/skott och äldre saves migreras.
Ingen fiendeflotta eller automatisk naval attack-move i denna slice.


RTS-084: hamnen kan bygga transport (40wood/10gold,8s,2supply).
Flytta valda landunits till kusten inom64px och högerklicka transporten
för att lasta upp till fyra. Välj transport → Landsätt → klicka synlig
fri landpunkt inom64px. Alla får giltiga platser eller ingen lämnar båten.
Esc/högerklick avbryter landsättningsläget. ID/HP/resurslast bevaras,
supply kvarstår ombord; en sänkt transport förlorar även passagerarna.
Save config13 bevarar lasten; ingen automatisk boarding eller transport-AI.


RTS-085: Skirmish → Öarna kräver sjötransport. Samla wood på650180 och
gold på600300, bygg kasern/armé och hamn på östkusten (t.ex.672320).
Lastkontakt: armé688432/transport720432. Segla till880432, landsätt
på912432 och angrip fiendebasen i nordöst.800wood/400gold är ändliga;
ingen markväg går över havet. Save config14/restart bevarar Öarna.
Befintlig fiende-land-AI stannar på sin ö fram till sjö-AI i086.

## RTS-086: AI-landstigning på Öarna

På färska Skirmish-matcher på Öarna bygger AI en betald hamn och transport
med ändligt extra startkapital120wood/30gold. Två producerade soldater kan
landsättas och förstöra basen. Tidigast Easy260/Normal220/Hard190 sekunder;
balansen verifieras i RTS-087. Motmedel: bygg hamn och stridsfartyg, segla
inom syn/skjutavstånd och högerklicka den synliga transporten. AI har en
transport, inga stridsfartyg och ingen gratis ersättning efter sänkning.
Save/load bevarar passagerare och produktion. Äldre Öarna-saves behåller
sin gamla ekonomi utan den nya flottan; restart aktiverar den nya profilen.

## Sjöstrategi

På Öarna: två workers samlar wood och en gold. För landstigning räcker
kasern + tre soldater + hamn + transport inom8supply (180wood/35gold för
Kronförbundet,174wood/38gold för klanerna). Mot AI-transporten kan en tidig
hamn + kanonbåt för80wood/25gold stoppa anfallet. Högerklicka tomt vatten
för transportens överfart, välj den och landsätt på synlig fri kust inom64px.
En transport kan inte attackera ett fiendefartyg; välj en annan vattenpunkt
om fienden ligger på önskad destination. Victory kräver förstörd fiendebas.

## Uppdrag 4 – Överfarten

Välj sjöuppdraget i menyn: kartan låses till Öarna, med20wood/10gold
startkapital. Samla, bygg hamn/transport och landsätt en betald armé på
fiendeön. Förstör fiendebasen och håll din egen vid liv. Båda fraktioner
har samma sjömål; fraktionspriser och svårighetsgrad gäller. Save/load
bevarar även transportlast och pågående kanonskott.

## Sjöassets och ljud

Hamnar, stridsfartyg och transporter använder egna pixelassets med lag- och
fraktionsfärger, åtta riktningar och synliga rörelse-/attack-/sjunkframes.
Kanon- och sjunkljud använder samma Ljud-panel, mute och volym som övrigt
spel. Assets/källor/export beskrivs i [assets/README.md](assets/README.md)
och [assets/ASSET_LICENSE.md](assets/ASSET_LICENSE.md).

## Aktuell sjörelease

RTS-001–090 är klara. Spela på
[GitHub Pages](https://tobisen.github.io/warcraft-2-tribute/), eller starta
lokalt enligt ovan. Välj Överfarten för ett fast sjöuppdrag eller Skirmish/
Öarna. Samla wood/gold, bygg kasern och soldater samt hamn/transport,
flytta armén till synlig kust, lasta och landsätt på fiendeön. Skydda basen
mot AI-landstigning; kanonbåt kan sänka fiendens transport. Förstör
fiendebasen för victory. Save/load ligger lokalt per browserorigin.

Senaste verifiering:748 tester, typecheck/build, betalda land-/sjömatriser,
public browser/save/ljud och64/128-belastning. Detaljer och faktisk
verifieringsprofil: [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md),
[PERFORMANCE.md](PERFORMANCE.md). Bundlevarningen kvarstår avsiktligt.
Chromium desktop är verifierad; andra browsermotorer och mobil är ej testade.

## Startsida – RTS-093

Huvudmenyn erbjuder Campaign (fyra befintliga fristående uppdrag), Skirmish (Skirmish eller Wave-survival), Load Game (lokal validerad slot) och Settings (befintliga ljudnivåer/mute). Back eller Escape återgår till huvudmenyn före matchstart. Matchens paus/save/load/restart fungerar som tidigare. Campaign har ingen kampanjprogression.

RTS-094: Campaign/Skirmish visar karta, fraktion, svårighet och separat Game speed. Kartan är låst för uppdrag/survival och valbar för Skirmish. Korta beskrivningar förklarar kartan och fiendetrycket. Endast1× stöds nu;0.75× införs i planerade RTS-108.

RTS-095: startsidan är helt dold under match. Den separata spelvyn fyller fönstret med en responsiv canvas, scrollande befintlig sidopanel och sessionrad. World pixels/grid/zoom1 bevaras; om fönstret är större än hela kartan centreras kartan med ramyta. Resize och mittendrag bevarar korrekta klick-/drag-/orderkoordinater.

## Aktuellt engelskt gränssnitt – RTS-096

Spelets menyer, HUD, tooltips, fel, guide, fraktionsnamn, uppdrag och resultat är engelska. Dokumenten kan vara svenska och äldre slice-avsnitt beskriver historisk UI. Human / Orcs och Arena / Forest Pass / River Bend / Islands är aktuella visningsnamn; interna ID:n och sparformat är samma.

Välj Campaign för Mission1–4 eller Skirmish för Skirmish/Wave-survival. Start Match startar, Pause/Resume [P] stoppar/återupptar simulation; Save locally/Load save använder befintlig slot. Load återkommer pausad, Restart återställer matchen, New match / menu öppnar startsidan. Settings har befintligt ljud. Keys and commands visar den engelska kontrollguiden. Ingen ny stegvis tutorial är implementerad (109).

RTS-091–104 är klara. Fortsatt arbete följer roadmapen taskvis; nästa är order/actionfeedback105. Matchens48px topprad visar levererat Gold/Wood och population inklusive köreservationer. Menu [P] öppnar pausade sessionkontroller för Resume/Save/restart.

Bottenpanelen visar markerad enhet/byggnads porträtt, HP och grundstatistik. Grupper visar total HP, tom selection ger instruktion. Stats är baseline; uppgraderingar/förmågemodifierare ingår inte i dessa etiketter.

Actions visas till höger om selectioninformationen: välj worker för byggande, base/barracks/harbor för produktion och landcombat för attack-move/ability. Research finns vid vald base och kräver färdig forge. Blockerade actions visar orsaken.

Grupper har rollikoner med namn/HP via hover. Vald produktionsbyggnad visar köikoner, progress och Cancel. Avbruten active produktion ger50% refund, queued100%; paus blockerar cancellation.

Minimappen ligger i spelvyns nedre vänstra hörn. Vänsterklick flyttar kameran under spel; paus blockerar minimapnavigation.

Kamera: piltangenter, mittenknappsdrag eller hover vid världsvyns kant. Klicka världen för keyboardfocus; HUD/paus blockerar panorering. A/S/W/D behåller actionhotkeys.

Space centrerar selection, Home basen. Settings har camera speed240/480/720px/s och Edge panning; valen gäller appsessionen och bevaras vid restart, men lagras ännu inte över sidreload.

Menu/P/Escape öppnar pausmenyn med Resume, Save, Load, Settings och Quit to Main Menu. Quit kräver confirmation; Cancel bevarar matchen. Fullscreen finns separat i top bar och Settings. Escape avbryter först aktiv placement/orderpreview.

Orderfeedback: green = move, red = attack, gold = work; blocked orders show a red X. The status panel explains placement/routing errors and action buttons explain missing resources or population capacity.

Own damage triggers a red attack warning and short effects cue (at most once per3gameplayseconds). Pause/end are silent; restart/load clears alerts. Audio dispatch/decode/mute has been checked in Chromium; acoustic listening remains for RTS-117.

Difficulty: Beginner adds longer preparation, smaller enemy armies and slower training. Easy/Normal/Hard retain their existing pressure. Choose in setup or use `?difficulty=beginner`; the profile survives Save/load and restart. See GAME_DESIGN.md for exact timings and mission/naval exceptions.

Game speed: choose 0.75× or 1× in setup, independently of difficulty. Simulation and animations slow together; camera, UI and audio keep their normal speed. Save/load and restart preserve the choice; older saves migrate to 1×.

Start learning in **Campaign → Tutorial – First Steps**. Follow the six objectives: selection, movement, wood delivery, building barracks, training a soldier and attacking the training target. The target appears after production and never attacks. Use ordinary controls and costs; Save/load preserves your progress and Restart starts fresh. Both factions and game speeds work.

## Frontier Valley

Välj Skirmish och Frontier Valley för den större referenskartan. Utforska
öster om floden: extra wood finns vid(1216,896) och gold vid(1184,640).
De levereras till den befintliga basen. Norra, centrala och södra landpassager
ger alternativa anfallsvägar. Förstör fiendebasen vid(1360,144) för Victory.
Totalt600wood/450gold är ändliga och delas med fienden.

Arena, Forest Pass och River Bend visar nu korta starttips om basutrymme,
workerleder och anfallsvägar. Islands kräver fortfarande harbor och transport
över havet. Alla fyra äldre kartor behåller sin terräng, resursmängd och regler.

## Ljudflöde (RTS-117)

Gathering, byggarbete och färdig enhetsproduktion har egna korta ljud.
Aktivera ljud efter ett klick; master, effects, music och mute finns i menyn.
Arbetsljud upprepas högst var0.8s, vanliga effekter har fyra samtidiga slots
med två reserverade för varning/resultat. Paus fryser ljudgrafen; load/restart
rensar gamla sources. Musik och ljudpitch påverkas inte av spelhastigheten.
RTS-117:s tekniska kontroller är separata från återstående mänsklig lyssning.

## Enhetsrepliker (RTS-118)

Egna korta engelska repliker följer selection och accepterade manuella orders.
En speaker per grupp,2.5s cooldown och inga köade repliker. Stop/grupprecall
stöds; automatiska leveransturer talar inte. Paus, mute, load och restart
avbryter tal. Lokala engelska browser/OS-röster används; inspelade röstassets
saknas. Om sådan röst inte finns visar ljudstatus “Unit voices unavailable”
och gameplay fungerar tyst. Röstklang varierar mellan plattformar. Slutlig
matchlyssning är uppskjuten till senare enligt användaren.

## Lokala inställningar (RTS-119)

Master, music, effects, voices och mute sparas lokalt, liksom kamerans pan speed
och edge panning samt vald fraktion, svårighet och spelhastighet som menydefaults.
Röster har separat volym. Inställningarna återkommer vid reload; ogiltiga eller
saknade värden använder defaults. Blockerad lagring hindrar inte sessionen och
visas när en ändring inte kan sparas. Inställningar är separata från matchsave.
Load/restart behåller matchens sparade spelregler och skriver inte över dina
framtida menyval. Varje browser/origin har egna inställningar; localhost och
GitHub Pages delar inte lagring.

RTS-120:s tekniska releasekontroll och Pages-publicering är verifierade. RTS-119:s lokala preferences och separata
Voices-reglage är implementerade; tutorialmatch, Save/load/restart och
settings→reload är browserverifierade. Slutlig lyssning av117/118 återstår;
accepterade native speech requests är inte en bedömning av hörbarhet/klang.

Publicerad RTS-119/120-implementation: [Spela på GitHub Pages](https://tobisen.github.io/warcraft-2-tribute/).
Actions build/deploy för a8c42c1 passerar; public settings→reload och
Frontier→start→paus→Save verifierade utan browserfel. Slutlig faktisk
lyssningsbedömning117/118 är uppskjuten och blockerar inte senare etapp.

Användaren har skjutit upp ljudtest och matchlyssning till senare. RTS-120
är avslutad med tekniska kontroller; nästa godkända etapp är121–126.
Inventeringen i ARCHITECTURE beskriver faktisk kod, assetluckor och
verifieringsplan. RTS-127–150 är endast planerade i denna körning.

Efter Victory/Defeat visas nu en separat resultatsida. Play Again startar om
med samma matchval, Main Menu går till startsidan och View Statistics visar
matchstatistiken med Back/Escape tillbaka. Avslutad match kan sparas/laddas;
spelvärld och gameplay-input är avstängda i resultatläget.

Resultatstatistik omfattar nu färdigställda och förstörda byggnader och
separata owner-removals (action kommer senare), samt resurser från samtliga
noder inklusive Frontier-expansioner. Äldre saves migreras med bibehållen
match; saknad bygg-/borttagningshistorik före migration redovisas tydligt.

Releaseversion visas i startsida och top bar; Changelog finns i huvudmenyn.
Produktversionen kommer från src/config/release.ts. Separat build-ID visas
i changelog och versionsetikettens tooltip: local i dev, HEAD-hash vid build
eller unknown om git saknas. Saveconfig är oberoende av releaseversion.

Settings → Display: välj renderingsupplösning800×600,1024×768,1280×720,
1600×900,1920×1080 eller2048×1332. Native Size (default) visar den valda
upplösningen i CSS-pixlar utan förstoring, centrerat; Fit to Window skalar
proportionellt till fönstret. Båda skalar ned när utrymmet är för litet.
HUD/canvas/minimap följer samma skala med pixelated canvas. Fullscreen behåller
upplösning och visningsläge: Native lämnar marginaler, Fit fyller proportionellt.
Inställningarna sparas lokalt; äldre Adapt to Window migreras till Fit/Native.
Kartstorlek och match-Save ändras inte. Hög upplösning på liten skärm ger liten
text; välj lägre upplösning vid behov.

Startsidan har original fantasyillustration med fem folk och diskreta embers
(med reduced-motion-stöd). Crown Alliance/Iron Clan är fortfarande de enda
spelbara fraktionerna. Mute ambience använder samma sparade mute som
Settings; befintlig musikloop börjar först efter användarinteraktion, med
lägre gain i menyn. Perceptuell ljudtest/matchlyssning är uppskjuten, inte utförd.

RTS-127 verifierar flera oberoende fyndigheter på Frontier Valley, med leverans till samma mål och bevarade orderreferenser vid Save/load.

Vänsterklick på en utforskad resurs visar namn, typ och mängd i bottom bar. Aktuell mängd/Depleted visas bara inom synfältet. Klicket avmarkerar units men avbryter inte deras arbete.

Flera workers kan samla vid samma fyndighet. Vid hög belastning används nåbara arbetsplatser och en tidsroterad kö; leveranser och orderbyte frigör plats.

Valda synliga resurser visar också tilldelade och aktivt samlande egna workers. Resa, kö och leverans ingår bara i assigned; orderbyte och uttömning uppdaterar bemanningen.

RTS-131: Skirmish har Plains96×96 och Plains128×128, enkla storlekslayouter inför kommande strategiska kartor. Tiles förblir32px; kamera/minimap/orders/fog stödjer hela världen. Save-config21 migrerar befintliga saves till samma slot utan stateförlust. Se PERFORMANCE.md för faktisk mätning; största kartan vid1920×1080 låg omkring49FPS i headless-miljön.

Highland Crossroads (RTS-132) är en egen96×96-landkarta med tre landpassager, fyra wood-groves/fyra gold mines och nordöstlig fiendebas. Använd Skirmish; utforska västra expansionen eller korsa bergsryggen. Save-config22 bevarar befintliga saves.

## RTS-133 – Shattered Coast

Skirmish: välj Shattered Coast för den stora kust-/ökartan. Samla wood/gold, välj worker och bygg Harbor på östkusten (672,320 är ett giltigt exempel), träna Transport. För enheter till stranden, högerklicka transporten för boarding, välj skeppet och ge sjömål. Unload öppnar landstigningsval på synlig kust. Fienden ligger öster om första kanalen; avlägsna öar har ändliga resurser. Last följer arbetaren i transport men levereras först vid spelarens bas. Save-config23 migrerar befintliga saves.

## RTS-134 – Fraktionsdesign

Nästa fraktionsetapp är planerad i GAME_DESIGN.md: Humans, Orcs, Elves, Dwarves och Goblins med fem units vardera, byggnader/research/fartyg och olika spelstilar. Vid designleveransen134 visade menyn bara Crown/Clans; respektive implementation nedan anger nu tillgängliga fraktioner. Stable ID:n bevaras för gamla fraktioner, nya factions görs tillgängliga först efter sina verifierade implementationer136–140.

## RTS-135 – Fraktionsgrund

Roster, produktions-prerequisites, research och naval-recept är datastyrda. UI visar fraktionens namn/kostnader och en orsak när prerequisites saknas. Save24 validerar stabila typ-ID:n och migrerar tidigare saves. Vid leverans av135 hade vanliga spelet Crown/Clans och fyra roller; dolda specialistprototyper och återanvänd soldatgrafik är förberedelser inför136/137. Full fienderoster kommer141. Kommandon för test/typecheck/build är oförändrade.

## RTS-136 – Humans

Välj Human (stabilt ID crown). Fem roller: Worker, Guard, Archer, Catapult och Banner Guard. Catapult kräver färdig Forge. Banner Guard kräver Forge och färdig Plate Craft:30wood/15gold,8s,2supply,100HP,130px/s och14DPS. Bygg Forge40wood/10gold och välj basen för research; Tempered Arms/Plate Craft kostar40wood/10gold och tar8s. Befintlig Defensive Stance bevaras. Human-warship heter Cutter. Banner Guard har egna riktnings-/animationsbilder; Human-byggnader behåller sina egna befintliga sten-/trä-/heraldikbilder. Save25 migrerar24 utan att avbryta betalda jobb. Fiendens fulla femrolls-AI återstår till141.

## RTS-137 – Orcs

Välj Orcs (stabilt clans-ID). Peon35HP/155px/s, Axe Warrior20DPS, Hunter kortare144px range och Stone Thrower26damage/2.1s med11s produktion. Raider kräver färdig Smithy och War Blades, kostar26wood/12gold, tar7s och använder2supply:80HP,175px/s,24DPS. War Blades35wood/15gold,8s,+30% damage; Hide Armor40wood/10gold,8s,20% mindre inkommande skada. Fury ger fortsatt+25% outgoing i5s. Stronghold260HP; War Dock170HP, War Barge/Raft100HP och105px/s. Egen Raider-grafik med två yxor; befintliga Orc-byggnadsbilder återanvänds. Save26 bevarar äldre betalda siege-tider och befintlig skadad HP. Full AI-roster ligger141.

## RTS-138 – Elves

Välj Elves för snabbare, lättare units med längre båg-/ballistaräckvidd. Bygg Ranger Lodge och Moon Workshop45wood/10gold, forska True Aim40wood/15gold vid Grove Hall och träna Marksman30wood/20gold (8s,2supply). True Shot [E] ger+20% utgående skada i5s. River Dock och Swift Sail/Grove Ferry använder egna woodlandbilder och80HP/125px/s. Save27 bevarar äldre matcher; full femfraktions-AI återstår i141. Test/typecheck/build-kommandon är oförändrade.

## RTS-139 – Dwarves

Välj Dwarves för långsam, tålig armé och stark Cannon. Bygg Guard Hall45wood och Foundry45wood/15gold; välj Stone Hold för Stone Plates45wood/15gold (10s), träna Bulwark45wood/20gold (10s,2supply,140HP). Brace [E] reducerar inkommande skada35% i5s,25s cooldown. Stone Dock45/10 tränar Ironclad50/15 på10s eller Heavy Ferry45/10 på8s; fartyg120HP/85px/s. Egna originalpixelbilder, Save28 migrerar tidigare matcher. Full femfraktions-AI återstår141.

## RTS-140 – Goblins

Välj Goblins för snabb, billig och ömtålig armé med splashvapen. Bygg Scrap Yard35wood och Lab35wood/15gold; forska Hot Powder30wood/20gold (6s), träna Grenadier25wood/25gold (7s,2supply). Overcharge [E] ger+35% outgoing men+20% incoming damage i4s,20s cooldown. Mortar kräver Lab och har64px splash. Junk Dock35/10 tränar Powder Boat35/20 på6s eller Junk Ferry35/10 på8s;65HP/135px/s. Egna originalpixelbilder och Save29 som migrerar äldre matcher. Full femfraktions-AI/matchups hör till141.

## RTS-141 – Välj motståndare

Startmenyn har Enemy faction för alla fem fraktioner, även samma som din egen. Automatic opponent använder tidigare standardval. Ny Skirmish/basmission har betald fraktionsarmé med egna roller, forskning, projektiler och självbuff. Bygg supply och en tillräcklig armé; den tidigare fyrsoldatsstrategin räcker inte alltid. Land-AI har längre förberedelse före första gruppanfall, men reagerar när dess bas hotas. Äldre Save migreras till config30 med befintliga profiler, HP och betalda timers bevarade. Scripted waves och diagnostiskt Siege test behåller generiska raiders; sjö-AI:s enda tvåpassagerar-invasion är fortsatt begränsad.

Matchsimulationerna i `npm test` körs med högst två Vitest-workers så CPU-tunga spelgenomgångar inte konkurrerar med obegränsat många tester om sina deadlines. `vitest.config.ts` styr enbart testkonkurrensen.

## RTS-142 – Campaign progression

Öppna **Campaign**, läs briefing/objektiv och starta **Tutorial – First Steps**. Seger låser upp nästa operation: Forest Watch → The Siege → The Outpost → The Crossing → Ridge Convoy → Valley Rescue → Coastal Banner. Menyn visar Available, Locked och Completed · Replay. Återspela avklarade uppdrag via missionknappen; Play Again startar samma uppdrag med friskt matchstate. Resultatvyn visar debriefing.

Framsteg sparas i den här browsern, separat från matchens lokala Save. Save/load bevarar campaign-uppdraget och dess pågående state; gamla Saves ger ingen påhittad completion. Vid storagefel visas att progression bara finns för sessionen. Skirmish och Survival påverkar inte campaignprogression.RTS-142 återanvände fem befintliga uppdrag; RTS-145 har utökat kedjan till åtta.

## RTS-143 – Nästa campaign-etapp

Planen omfattar åtta uppdrag: de fem befintliga plus Ridge Convoy, Valley Rescue och Coastal Banner. Alla fem fraktioner introduceras och större operationer använder Highland Crossroads, Frontier Valley och Shattered Coast. Se [GAME_DESIGN.md](GAME_DESIGN.md) för berättelse, fraktionspar, ekonomi och konkreta mål. Planen från RTS-143 är implementerad i RTS-144–145: runtime-menyn har åtta nivåer. Ytterligare mål- och regressionsverifiering följer i RTS-146.

## RTS-144 – Campaign 1–4

De första fyra operationerna har fasta berättelseprofiler: Humans → Orcs, Orcs → Humans, Elves → Goblins och Dwarves → Goblins. Läs briefingarna för mål, ekonomi och egna förmågor. The Siege kräver en tillräcklig betald armé och supply; The Outpost kräver en levande bas vid90gameplay-sekunder. Fraktionsfälten låses enbart inför ny Campaign-start. Skirmishval och tidigare sparade campaign-matchers fraktioner bevaras. Den andra halvan är implementerad i RTS-145, se nedan.

## RTS-145 – Campaign 5–8

Campaign har nu åtta operationer. Efter The Outpost: The Crossing(Goblins, betald transport/landstigning) → Ridge Convoy(Orcs, skydda Ridge Courier och slå ut båda passvakterna) → Valley Rescue(Elves, slå ut båda camp guards och nå rescue-zonen med combat-enhet) → Coastal Banner(Humans, landstig och håll kustzonen oavbrutet30s). Briefingarna och målstatus visar platser och villkor.

Välj/flytta courier manuellt efter att armén säkrat passagen. Vid banner-zonen måste minst en levande egen landcombat-enhet stanna kvar; enemy combatants eller egen frånvaro nollställer tiden. Workers, ships och embarked units räknas inte. Courier-/basdöd ger defeat där tillämpligt; Save/load/restart bevarar eller återställer målstatus enligt matchflödet. Nya Saves använder config32; äldre Saves och tidigare progression bevaras. Målsymbolerna är enkla namngivna ringar med befintlig grafik.

## RTS-146 – Kampanjens verifierade flöde

Hela kedjan1–8 har genomspelats med betald ekonomi i1280×720 och1920×1080. NativeTutorial kördes påBeginner, övriga sju påNormal; automatiska paid-tester täcker alla åtta påNormal. Detta är ingen garanti om identisk balans på alla svårigheter. De tre nya operationerna har två fasta fraktionsvakterna vardera, utan skalande AI-ekonomi eller vågor.

Vid eskort: skicka först stridsenheter genom passet och skydda den namngivna kuriren. Vid rescue: båda namngivna guards måste dö och egen combat-enhet nå zonen. PåCoast: transportera en betald armé, välj fri landstigningsyta och håll zonen30s utan avbrott. Blockerad strand avvisar hela unload och behåller passagerarna; välj en annan synlig strand. Ships/workers/passagerare håller inte zonen. Save/load ska bevara delvis holdtid; paus ger ingen tid och frånvaro/contest nollställer den. Completion ger endast lokal upplåsning, inga resurser eller units.

## RTS-147 – Dismiss Unit

Markera egna enheter och välj **Dismiss Unit [DELETE]**, eller tryck Delete med fokus i spelvärlden. Bekräftelsen anger antalet som tas bort. En markerad transport inkluderar alla sina passagerare; last går förlorad. Cancel eller Escape bevarar enheterna och deras orders. Simulation och gameplay-input fryses under bekräftelsen.

Borttagning frigör population utan återbetalning eller kill credit. Statistik visar den separat som Units removed. Byggnader och fiender kan inte dismissas. En borttagen byggare lämnar sin byggplats pausad för annan arbetare. Dismiss av Ridge Courier förlorar eskortuppdraget; sista banner-hållarens borttagning nollställer capturetid.

## RTS-148 – Commands och verifiering

Actions är grupperade under Orders, Build, Train och Research. Tangent visas på knappen; håll musen över för mekanik, cost och eventuell blockeringsorsak. Keys and commands visar samma bindningar. Nya keys: H harbor, J transport, K warship, L unload, V specialist. Fokus ska vara i spelvärlden; text/UI-fokus, modifiers och repeat ger inga gameplayorders.

`npm run test:unit` kör hela urvalet av isolerade komponent-/asset-testfiler. `node scripts/test-unit.mjs --list` visar unit/integration-klassificeringen. Kör berörda integrationer med `npm test -- src/gameplay/orders.test.ts src/gameplay/controlGroups.test.ts` som exempel. `npm test` kör fortsatt full regression med alla integrationer och matchsimuleringar vid etappslut/CI. Build innehåller strict typecheck.

## RTS-149 – Lokala highscores

Local Highscores finns i huvudmenyn och på resultatvyn. Campaign grupperas per uppdrag, Skirmish per karta; svårighet, gameplayhastighet, båda fraktionerna, configversion och scoremodell separerar listorna. Seger ger `10000 + max(0, 3600 - floor(gameplaysekunder))`; förlust ger0. Statistik ger inga poängbonusar. Top10 visas per grupp.

Nya matcher får ett UUID som Save33 bevarar. Första avslutade resultatet för ett match-ID registreras en gång även efter load eller upprepad resultatvisning. Replay/restart skapar en ny match. Äldre Saves migreras utan påhittad identitet och kan spelas vidare men inte registrera highscores. Lokal lagring behåller upp till5000 resultat inklusive dedup-ID:n; vid full lagring registreras inget nytt resultat. Storagefel visas och nya resultat behålls endast under sessionen. Inga globala eller manipulationssäkra resultat garanteras.

## RTS-150 – Release0.2.0 och överlämning

Produkt/packageversion0.2.0 samlar fem fraktioner, större kartor, åtta campaign-operationer, grupperade hotkeys, Dismiss Unit och lokala highscores. Huvudmenyns Changelog bevarar föregående0.1.0; versionsetikettens tooltip visar faktisk buildhash. Save-ruleconfig33 är separat från produktversion. Publik adress: [GitHub Pages](https://tobisen.github.io/warcraft-2-tribute/). Publiceringsbelägg och slutlig taskstatus finns i BACKLOG/DEV_LOG.

Full regression körs vid denna etappgräns; unit+berörda integrationer räcker för löpande tasks enligt AGENTS. Faktisk ljudlyssning och matchlyssning är uppskjutna av användaren. Teknisk ljudkontroll ersätter inte lyssning. Bundlevarningen är kvar enligt uppdraget. Nästa RTS-151 är inte påbörjad eller scopebestämd här.

Release0.2.0 är publicerad som Build53267ef efter grön [CI/Pages-run](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37199039458). Publik nativekontroll i1280/1920 verifierade version/changelog/menyer, canvas, faktisk selection/movement och Save/load/restart utan HTTP- eller browserfel. RTS-150 är historiskt Done; nytt uppdrag återställer151–180 och genomför151–154. Full lokal regression1142tester/145filer samt strict typecheck/build är godkända.

## RTS-151–154: presentation och inspektion

Arbetstiteln är Warborn — A Tribute to Warcraft II. Alla egna byggnader
kan inspekteras; synliga fiendebyggnader ger en begränsad vy utan orders eller
privat information. Display har separata Native Size/Fit to Window-val med
fast renderingsupplösning och lokalt sparat visningsläge.

[QUALITY_REVIEW.md](QUALITY_REVIEW.md) redovisar kvalitetsinventeringens belägg,
prioriteringar och begränsningar. [HANDOFF.md](HANDOFF.md) samlar denna etapps
leveranser, verifiering och nästa task RTS-155. Roadmap151–180 finns i
[BACKLOG.md](BACKLOG.md); uppdraget omfattar endast151–154.

## Release0.3.0 — Kampanj, AI och lag

Välj Campaign för åtta upplåsbara uppdrag; First Steps är kort introduktion.
Nya Forest Watch/Outpost startar på Frontier och Siege på Highlands. Övriga
missioner behåller Islands/Highlands/Frontier/Coast. Phasegoals visas i HUD.
Scoutmål kräver faktiskt utforskad grove/mine; resursdepåer finns inte, så workers
levererar till den ursprungliga basen. Finite waves börjar efter preparation och
spaning. Kurirens död ger defeat. Banner kräver30s obruten marknärvaro utan
fiendekontest; passagerare/ships/workers håller inte zonen.

Shift köar move, gather, attack, attack-move, hold och patrol; vanliga order
ersätter kön. F6 Hold stannar utan förföljelse; F7 Patrol väljer andra punkten.
Stop ersätter order/kö. Synliga knappar och tooltips visar spelbara villkor,
tech, kostnader och hotkeys. Save51 bevarar faser, order och lag; äldre campaign
saves återupptar sina ursprungliga mål/kartor, utan nya gratis completion/rewards.

Skirmish på Plains96/128 erbjuder You+2AI; andra kartor erbjuder endast två
validerade starts. Välj varje ras/profil/lag i befintlig meny. Ras och färg är
separata. Allierade delar aktuell/utforskad vision men inte ekonomi, supply,
forskning eller unitcontrol. Friendly ground spells stöder allierade; repair
och gate-control är egna. Öppna portar släpper igenom allierade, stängda portar
blockerar alla. Laget förlorar när alla baser i laget är utslagna. Om du förlorar din
bas medan ally lever fortsätter AI; du kan följa lagvision/kamera, pausa/spara
eller lämna, men inte ge gameplay-order. Resultatsidan visar individuella och
lagstatistik samt separata kills/losses/dismissals.

Versionsetiketten använder `src/config/release.ts`; buildhash är separat och
visas i tooltip.0.2.0 och0.1.0 ligger kvar som historiska changelog-versioner.
Publicering använder befintlig GitHub Pages-workflow och Vite-base
`/warcraft-2-tribute/`, inga nya hostingtjänster.

**Kända begränsningar:**20–40min/ordinarie Normal-mission är designuppskattning,
inte mänskligt uppmätt speltid. Human tempo/difficulty/fun och ny lång mixlyssning
återstår. Flyerart/animationer är temporära; vissa caster/navalassets och egna
slutliga voices saknas enligt tidigare assetinventering. Frontier har den nya
godkända sammanhängande terrängen; andra kartor behåller äldre presentation.
Mätt64/128-unit Highlands-stress gäller kort headless Chrome-fixtur, inte generell
hårdvaru-/långmatchgaranti. Användarens lokala style.css/docs är bevarade och
ingår inte i taskcommits. Se HANDOFF.md och QUALITY_REVIEW.md för faktisk
release-/Pages-verifiering.


Release **0.3.0 / Build6a96227** är [publicerad på GitHub Pages](https://tobisen.github.io/warcraft-2-tribute/), med [grön CI/Pages-körning](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37355621323) och faktisk [browserkontroll](artifacts/rts-180/public.md). Se HANDOFF.md för slutstatus och återstående mänsklig tids-/balans-/ljudgranskning.


## RTS-182–187 — Meny och kampanj

Spelets visningstitel är **Warborn — A Tribute to Warcraft II**. Human och Orcs har fortsatt stabila interna ID:n crown/clans. Repo, Pages-adress och lokala datanycklar bevaras.

Local Highscores har mode-, kart- och svårighetsfilter och tabeller för jämförbara rulesgrupper. Poäng sorteras fallande, sedan gameplaytid stigande och stabilt match-ID. Äldre poster behåller metadata; datum som inte sparats visas som Unknown. Registrering sker en gång per match-ID. Nya resultat får registreringsdatum; multiplayergrupper visar ras/difficulty/profil/lag.

Display behåller800×600 som lägsta val och erbjuder dessutom2560×1440,2560×1080,3440×1440,3840×1600 och3840×2160. Available window area följer fönstret inom800×600–3840×2160. Native visar vald rendering i motsvarande CSS-storlek när den ryms; Fit skalar proportionellt. Större rendering visar mer karta med samma spritepixlar. Valet sparas.

Campaign visar bara aktuellt uppdrag och klarade replay-val. Briefing beskriver mål, introducerat innehåll och nästa victoryupplåsning. Innehållsplanen i [CAMPAIGN_DESIGN.md](CAMPAIGN_DESIGN.md) gäller både UI och gameplay, inklusive hotkeys; prerequisites inom matchen gäller fortfarande. Replay använder valt uppdrags plan; Skirmish behåller hela sitt techträd. Äldre metadatafria progressionv1 bevaras separat från de nya serierna och kopieras inte till okända ras-/svårighetskombinationer. Äldre saves behåller legacykampanjen; Save53 bevarar campaign-ID, ras/difficulty och AI2:s egna difficultyval.

Skirmish öppnas i Skirmish-läge. Kartans faktiska authored startplatser avgör kapaciteten. Plains96/128 erbjuder människan + två AI; övriga kartor har två platser. Menyn förklarar begränsningen och har ett direktval för Plains96 med två AI. Varje AI har ras/profil/difficulty och lagval i trepersonsmatcher; AI2 kan följa AI1:s difficulty eller ha eget val. Advanced match settings samlar lagförklaring och gameplayhastighet.

Browserregressioner: [kampanjmeny](scripts/check-campaign-menu.mjs) och [skirmishmeny](scripts/check-skirmish-menu.mjs), med extern Playwright/Chrome via W2T_PLAYWRIGHT_MODULE/W2T_BROWSER_EXECUTABLE och W2T_UI_URL. Menytester och explicita fixtures är inte mänskliga helkampanjer eller balans-/speltidsbelägg. Se [HANDOFF.md](HANDOFF.md) för aktuella checks och begränsningar.
