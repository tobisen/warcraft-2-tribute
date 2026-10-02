# warcraft-2-tribute

Browserbaserat singleplayer-RTS inspirerat av Warcraft 2, Age of Empires 2 och
Command & Conquer. Phaser, strict TypeScript och Vite; local-first, gameplay
före grafik. Implementerat genom RTS-066 med egna terräng-, byggnads- och enhetsassets, animationer, ljud och fantasy-HUD.

## Installation och lokal start

Använd Node.js 20.19+ inom version 20, eller 22.12+ och npm:

```sh
npm ci
npm run dev
```

Öppna adressen Vite skriver ut, normalt http://localhost:5173/.
Världen är 1280 × 960 px, viewport 800 × 600. Dra med mittenmusknappen för
begränsad pan; zoom är 1. Kommandopanelen ligger bredvid canvas på desktop och staplas under i mindre fönster.
Små fönster kan scrollas.

## Spela matchen

I startmenyn: välj Wave-survival, Skirmish eller något av de tre uppdragen och Easy/Normal/Hard, sedan
”Starta match”. Byt val via ”Ny match / meny” och starta där en ny match. Survival har tre ändliga waves; i Skirmish finns inga waves och målet
är att förstöra fiendebasen vid (1008,144). Fienden producerar från sin
ändliga budget, samlar grupper och håller ett lokalt försvar. Restart behåller
valt läge. Förlust vid spelarbasens död har alltid företräde.

1. Fog är aktiv. Välj två blå workers och flytta mot (600,220) för att
   upptäcka wood; högerklicka sedan noden vid (650,180). Välj den tredje, pan
   åt höger och flytta mot (780,240) för att upptäcka gruvan vid (850,220);
   högerklicka gruvan.
   Workers samlar och levererar automatiskt till den blå basen vid (400,450).
2. Vid 40 levererade wood: välj en worker och ”Bygg barracks – 40 wood”. Placera grön
   preview, exempelvis vid (512,384) om platsen är fri. Escape/högerklick avbryter.
3. Efter 5 s byggarbete: ge builder ny gather-order. Välj barracks och träna blå soldiers för 20 wood + 5 gold och 5 gameplay-
   sekunder vardera. Välj basen för workers för 20 wood och 5 s. Tre FIFO-jobb per
   byggnad inklusive aktivt; bas och barracks kan producera samtidigt.
4. Välj soldiers och högerklicka på röda enemies för manuell attack. Ge nästa
   mål efter varje fiendedöd. På Normal anländer tre waves med 1/2/3 enemies vid
   60/90/120 gameplay-sekunder. Träna förstärkningar vid förluster.
5. Alla enemies döda efter sista wave ger Victory; basens HP 0 ger Defeat.
   Defeat har företräde vid samtidig utgång. Simulation och gameplay-input
   stoppas; ”Starta om” återställer hela matchen, inklusive kamera och rally.

Vänsterklick väljer en unit eller bas/barracks. Units har företräde vid
överlapp; byggnadsval och unit-selection är exklusiva. Tom mark avmarkerar.
Drag ersätter selection med units vars centrum ligger i rektangeln, inklusive
kanten. Gester under 5 screen pixels är klick. Ringar/byggnadsram visar val.

Högerklick på mark med valda units ger separata nåbara slutpositioner kring
klickmålet med enhetens config-hastighet (worker/soldier 160, archer 140 och catapult 80 px/s). Ny order ersätter föregående; avmarkering stoppar inte
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
- [BACKLOG.md](BACKLOG.md): RTS-001–066 klara, RTS-067–090 planerade och Current Focus.
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
