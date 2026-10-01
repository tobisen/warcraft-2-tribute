# Arkitektur

## Status och teknik

RTS-001 har implementerat en minimal bootstrap med Phaser 4.2.1, strict
TypeScript 7.0.2 och Vite 8.3.2. Appen körs i webbläsaren utan backend eller
konton. RTS-002 inför movement, RTS-003 klickselection, RTS-004 dragselection
och gruppkommandon, RTS-005 gathering, RTS-006 bas och leverans samt RTS-007
arbetarproduktion. Ansvarsfördelningen nedan styr
både nuvarande och kommande arbete.

## Ansvarsfördelning

- Tunna Phaser-scenes hanterar scenlivscykel, input och presentation.
- Gameplay-logik separeras från Phaser där praktiskt så att regler kan
  verifieras utan rendering.
- Stats definieras i enkla TypeScript-configobjekt. Inför inget modding- eller
  externt datasystem för detta.
- Grafik kan vara placeholders. Struktur och abstraktioner införs när aktuell
  task behöver dem, utan spekulativ refaktorering.

## Implementerad struktur

- [index.html](index.html) är Vites startpunkt med containern `#game` och
  separata DOM-kontroller för arbetarproduktion utanför canvasen.
- [src/main.ts](src/main.ts) skapar Phaser.Game med automatisk renderer, en
  mörk bakgrund och en canvas på 800 × 600 pixlar.
- [src/scenes/BootScene.ts](src/scenes/BootScene.ts) skapar tre gröna placeholders
  (24 × 24 px) med ID unit-1, unit-2 och unit-3 vid (280, 300), (400, 300) och
  (520, 300). Varje arbetare har position, mål, order och selected-state separat från
  renderobjekten, som kopplas via en Map med ID som nyckel.
  Scenen adapterar pointer-input, visar dragrektangel och ringar, konverterar
  delta till sekunder och synkar rendering av arbetare, lasttext, bas, resursnod och saldotext.
  Gathering och produktion uppdateras med samma gameplay-delta. Nya arbetares
  renderobjekt skapas efter spawn. Input- och knapplyssnare tas bort vid shutdown.
- [src/gameplay/movement.ts](src/gameplay/movement.ts) är en ren funktion utan
  Phaser-beroende: normaliserad riktning × hastighet × delta i sekunder,
  begränsat till återstående avstånd. Samma start/mål och delta=0 är säkra.
- [src/gameplay/gathering.ts](src/gameplay/gathering.ts) innehåller WorkerOrder
  (idle/move/gather/deliver), last, ResourceNode och GatheringState samt fristående order-
  och uppdateringsfunktioner. Move använder arbetarnas target, gather refererar
  till nod-ID; deliver minns samma nod för återgång. Idle utför inget arbete. Endast markerade får nya order.
  Ny move-order ersätter arbetsloopen och bevarar last; selection-funktionerna
  bevarar order-state och last.
- [src/config/gathering.ts](src/config/gathering.ts) anger 100 initial wood,
  24 px gather-/leveransräckvidd, 1 wood/s, lastkapacitet 5, nodradie 20 px,
  nodposition (650, 180), basposition (400, 450) och basstorlek 48 px.
- [src/gameplay/gathering.test.ts](src/gameplay/gathering.test.ts) verifierar
  räckvidd, tidssteg, begränsad resurs, last, uttömning och orderbyte.
  [src/gameplay/delivery.test.ts](src/gameplay/delivery.test.ts) verifierar
  leverans, återgång, upprepade turer, totalbevarande och avbruten loop.
- [src/gameplay/production.ts](src/gameplay/production.ts) hanterar startspärr,
  omedelbar kostnad, countdown och exakt en spawn utan Phaser-beroende.
  ProductionState lagrar återstående tid (null när ledig) och nästa ID-nummer.
- [src/config/production.ts](src/config/production.ts) anger 20 wood,
  5 sekunders produktion och spawn-offset (60, 0) relativt basen.
- [src/gameplay/production.test.ts](src/gameplay/production.test.ts) verifierar
  startspärrar, kostnad, tid, spawn, unika ID:n och ny arbetares gameplay.
- [src/config/unit.ts](src/config/unit.ts) anger hastighet 160 px/s och storlek 24 px.
- [src/gameplay/selection.ts](src/gameplay/selection.ts) hanterar selection och
  kommandon utan Phaser. Klick använder kvadratisk träffyta och ersätter selection
  med en enhet; vid överlapp väljs sist renderade enheten. Dragrektangeln
  normaliseras med min/max och väljer centrum inklusive kanten. Tomt urval
  avmarkerar alla. Gruppkommandon ändrar mål enbart på markerade enheter.
  Befintliga selection/command-tester behålls. Scenen använder nu orderWorkers
  för idle/move/gather/deliver; selectUnitAt och selectUnitsInRectangle bevarar även
  arbetarnas utökade state via generisk typning.
- [src/gameplay/selection.test.ts](src/gameplay/selection.test.ts) och
  [src/gameplay/groupSelection.test.ts](src/gameplay/groupSelection.test.ts)
  verifierar klick, rektanglar, tröskel, ersatt selection och gruppkommandon.
- [src/gameplay/movement.test.ts](src/gameplay/movement.test.ts) verifierar
  movement-regler i Vitest utan browser eller rendering.
- [tsconfig.json](tsconfig.json) aktiverar strict och bundler-resolution samt
  typkontroll utan emittering. `skipLibCheck` hoppar över dependencies interna
  deklarationskontroll; projektkoden kontrolleras fortfarande med strict.
- [package.json](package.json) definierar dependencies och scripts;
  [package-lock.json](package-lock.json) låser installationen.
- [.gitignore](.gitignore) ignorerar dependencies, byggoutput och lokala loggar.

Vite använder standardinställningarna och behöver ingen separat configfil.
Ingen framtida systemstruktur har skapats. Movement ligger separat från
bootstrap och scene. Canvasstorleken avgör inte kartans storlek.

## Koordinater och tid

Positioner och mål anges i world pixels. Framtida tiles är 32 × 32 px, men inget
grid finns. Scenen omvandlar Phasers delta till sekunder (`delta / 1000`);
movement använder delta-baserade steg utan fixed timestep. Funktionen arbetar
med ändliga positioner, icke-negativ hastighet och delta från scenen.
Högerklick ersätter målet på alla markerade enheter. Alla börjar omarkerade.
Avmarkering stoppar inte movement och ringarna är inte klickytor.
Vänsterknappens down/up avgränsar selection-gesten; selection ändras vid release.
Drag börjar när avståndet från start når 5 CSS/client-pixlar och förblir drag
även om musen återvänder. Kortare gester behandlas som klick vid releasepositionen.
Tröskeln använder DOM-eventets client-koordinater, oberoende av skalad canvas;
rektangeln och träfftesterna använder world pixels. Pointerup utanför canvas
avslutar också gesten. Scenen håller endast gest- och renderadapterstate.
Det finns ingen shift-selection, formation, collision avoidance, kontrollgrupp,
ekonomi-UI utöver enkel saldotext och produktionsknapp, pathfinding, hinderhantering, karta,
kameraimplementation eller AI.
Enheterna kan överlappa vid samma mål.
Se [DECISIONS.md](DECISIONS.md).

## Gathering och leverans (RTS-006)

Högerklick på nodens cirkel ger gather-order, övriga högerklick ger move-order.
Varje arbetare har kontinuerlig last (cargo) från 0 till 5 wood. Gathering
överför nod → last inom 24 px från nodcentrum med 1 wood/s. Full last byter
automatiskt till deliver. Inom 24 px från basens centrum överförs hela lasten
till gemensamt saldo; bara denna övergång krediterar saldot.

Deliver minns resursnodens ID. Efter leverans återgår arbetaren till noden om
wood finns, annars idle. Vid uttömning levereras även partiallast; tomma arbetare
blir idle. Ny gather-order med full last levererar först. Gather mot tom nod
levererar kvarvarande last eller blir idle om lasten är tom. Move avbryter
loopen utan att kasta eller leverera lasten, även om målet ligger vid basen.
Avmarkering ändrar varken order eller last.

Uppdateringen förbrukar delta över approach, gathering, leverans och återgång,
så ett långt steg kan innehålla flera övergångar. Arbetarna behandlas i stabil
listordning vid delning av den begränsade noden. Uttag begränsas både av nodens
mängd och ledig lastkapacitet. Summa nod + laster + saldo bevaras inom
flyttalstolerans. Depletion efter en senare arbetare dirigerar även tidigare
arbetares kvarvarande gather-order till slutleverans.

Basen är en fast blå placeholder. Text vid varje arbetare visar last/kapacitet
med en decimal, och saldotext visar wood och nodens mängd. Ingen byggplacering,
byggkostnader, manuell leveransorder eller collision införs. Den tidigare
direkta krediteringen från RTS-005 har ersatts av denna leveransmodell.

## Arbetarproduktion från basen (RTS-007)

En DOM-knapp ”Träna arbetare – 20 wood” ligger utanför canvasen. Den är disabled
när saldo är under 20 wood eller basen redan producerar. startProduction
kontrollerar samma regler oberoende av UI och drar kostnaden bara vid godkänd
start. Ett nytt klick under pågående produktion köas inte och debiterar inte.

updateProduction använder gameplay-delta i sekunder, samma delta som gathering.
Countdown visas med en decimal. Efter 5 sekunder skapas en arbetare vid basens
position + (60, 0), med cargo 0, idle och selected=false. Monotont nästa ID-nummer
samt kontroll mot befintliga ID:n förhindrar kollisioner. Ett avslutat steg
skapar bara en arbetare även med stort delta; resttid startar ingen ny produktion.
Nya arbetare går genom samma selection, movement, gathering och leverans som de
befintliga. Float-tolerans används enbart vid timeravslut.

Knappens click-handler anropar bara produktionslogiken. Canvas-input lyssnar på
canvasen; release över produktionskontrollerna avbryter en eventuell draggest
utan att ändra selection. UI-klick kan därför inte ge order eller avmarkera.
Scenen synkar knapp, tidstext och renderobjekt och tar bort DOM-lyssnaren vid
shutdown. Ingen kö, avbrytning/refund, rally point, population cap eller separat
produktionsbyggnad införs.

## Verifiering

`npm run typecheck` kör `tsc --noEmit`. `npm run build` kör typkontroll och
`vite build`, med output i `dist/`. `npm run dev` startar lokal utveckling.
Installation görs med `npm ci`, se [README.md](README.md).

`npm test` kör `vitest run` en gång i Node-miljö. Testfiler ligger intill
gameplay-logiken och omfattas även av typkontrollen. Ingen separat testconfig
behövs. Browserkontrollen kompletterar unit-testerna med input och rendering.
Inga tester som speglar bootstrap-koden har skapats. Dokumentationsändringar
verifieras genom konsekvens och giltiga filreferenser.

Se [GAME_DESIGN.md](GAME_DESIGN.md) för MVP och [BACKLOG.md](BACKLOG.md) för scope.
