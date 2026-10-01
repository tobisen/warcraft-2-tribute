# Game design

## Inriktning

Ett browserbaserat singleplayer-RTS inspirerat av Warcraft 2, Age of Empires 2
och Command & Conquer. Spelaren samlar resurser, bygger upp sin bas,
producerar stridsenheter och möter fiendevågor. Local-first och gameplay före
grafik styr arbetet. Placeholders är tillåtna.

## MVP

- En karta.
- Drag selection och move commands.
- Gathering av resurser.
- En bas och en produktionsbyggnad.
- En stridsenhet.
- Enkla fiendevågor.
- Tydliga win/loss-tillstånd.

Kostnader, stats, vågor och win/loss beskrivs i implementerade slices nedan
och definieras i TypeScript-config.

## Implementerat selection- och command-beteende (RTS-004)

Tre placeholder-enheter med unika ID:n börjar omarkerade på separata positioner.
Vänsterklick på en enhets kvadratiska yta ersätter selection med den enheten.
Vänsterklick på tom mark avmarkerar alla. Ringarna är inte klickytor; vid
överlapp väljer klick den sist renderade enheten.

Vänsterdrag visar en markeringsrektangel i alla riktningar. Vid release ersätts
selection med enheter vars centrum ligger inom rektangeln inklusive kanten.
Tom rektangel avmarkerar alla. Gester under 5 screen pixels behandlas som klick;
vid 5 pixlar eller mer blir gesten drag. En gest som nått tröskeln förblir drag
även om pekaren återvänder. Varje markerad enhet får en ring som följer rörelsen.

Högerklick på tom mark skickar samma move-command till alla markerade enheter och ersätter
deras tidigare mål. Avmarkering stoppar inte pågående rörelse eller ändrar
målen. Omarkerade enheter ignorerar nya kommandon. Rörelsen är fortsatt rak,
delta-baserad och stannar exakt utan overshoot. Enheter får överlappa vid samma
mål; inga formationer eller collision avoidance finns.

Shift-selection, kontrollgrupper, pathfinding och HUD ingår inte i denna slice.

## Resurssamling med bas och leverans (RTS-006)

De tre enheterna är placeholder-arbetare. Den bruna noden vid (650, 180) börjar
med 400 wood efter RTS-012 (ursprungligen 100), och en fast blå bas står vid (400, 450). Markera arbetare och
högerklicka på noden för gather. Inom 24 world pixels från nodcentrum samlar
varje arbetare 1 wood/sekund till sin last, högst 5 wood. Text vid arbetaren
visar last/kapacitet med en decimal.

Full last startar en automatisk tur till basen. Inom 24 px från bascentrum
levereras hela lasten till gemensamt saldo. Arbetaren går sedan tillbaka till
sin resursnod om wood finns. Vid uttömning levereras även delvis fylld last,
sedan blir arbetaren idle. Enkla texter visar saldo och nodens återstående wood.
Den tidigare direkta krediteringen från RTS-005 är ersatt: saldo ökar först
vid leverans. Nod, laster och saldo bevarar totalt wood.

Move-order avbryter arbetsloopen men bevarar lasten. En ny gather-order med
full last levererar först; partiallast fortsätter fyllas om noden har wood.
Gather på uttömd nod levererar eventuell kvarvarande last och avslutas sedan.
Avmarkering påverkar inte loopen. Det finns ingen manuell leveransorder.
Enheter får överlappa. Arbetsloopen har ingen pathfinding eller collision och
använder endast wood.

## Arbetarproduktion från basen (RTS-007)

Knappen ”Träna arbetare – 20 wood” startar produktion från den befintliga basen.
Godkänd start drar 20 wood direkt från levererat saldo och tar 5 gameplay-
sekunder. Endast en produktion får pågå; otillräckligt saldo och upptagen bas
blockerar start. Återstående tid visas med enkel text; ingen kö finns.

Den nya arbetaren skapas nära basen vid (460, 450) med unikt ID, tom last,
idle och utan markering. Den kan klick-/dragmarkeras, flyttas och samla/leverera
precis som startarbetarna. Produktionsknappen ändrar inte selection eller ger
order. Spelaren markerar och kommenderar den nya arbetaren själv.

Basproduktionen har ingen avbrytning/refund,
rally point eller population cap införs. Den begränsade noden och produktions-
kostnaderna sätter naturliga gränser för antalet nya arbetare i denna slice.

## Barracks-placering (RTS-008)

”Bygg barracks – 40 wood” öppnar placeringsläge med synlig preview. Barracks
är 2 × 2 tiles och dess övre vänstra hörn snappas till 32 px-grid. Grön preview
är giltig; röd preview och text visar fel. Vänsterklick placerar direkt om hela
footprinten ligger i världen, inte överlappar bas/nod och saldo är minst 40.
Kostnaden dras exakt en gång vid lyckad placering; bara en barracks får byggas.

Escape eller högerklick avbryter gratis. Ogiltiga klick stannar i placeringsläge
utan debitering. Selection och unit-orders ändras inte av placeringsinput.
Byggknappen kan öppna preview vid lågt saldo; det kontrolleras vid placering.
Basens och nodens footprints samt kantkontakt beskrivs i [DECISIONS.md](DECISIONS.md).
Arbetare blockerar inte platsen. Basproduktion påverkas inte av placeringsläget.

Ingen byggtid, byggande arbetare, rivning, pathfinding,
unit-collision eller generell byggmeny ingår.

## Soldier-produktion från barracks (RTS-009)

Efter placering visas ”Träna soldier – 20 wood”. Godkänd start drar 20 wood
omedelbart och tar 5 gameplay-sekunder. En produktion åt gången per byggnad,
ingen kö; bas och barracks kan producera samtidigt. Otillräckligt saldo eller
upptagen barracks blockerar start. Återstående tid visas bredvid knappen.

Soldier skapas strax utanför barracks footprint, med hela kroppen inom världen,
unikt ID, idle, utan markering och utan last. Orange färg och texten Soldier
skiljer den från gröna workers. Klick-/dragselection och movement fungerar som
för workers. Soldier kan inte samla eller bära wood. Vid blandad selection och
högerklick på resursnoden får workers gather-order medan soldiers behåller sina
order. UI-interaktion ändrar varken selection eller unit-orders.

I RTS-009 tillkom bara produktion/movement. Combat, HP och fiender har sedan
införts i RTS-010/011. Rally point, kö, population cap, collision och pathfinding
ingår fortfarande inte. Spelaren markerar och kommenderar soldaten själv.

## Utvecklingsordning

Efter projektinitialisering: movement → selection → resources → buildings →
combat → AI. [BACKLOG.md](BACKLOG.md) definierar genomförbara tasks; ordningen
är inte en färdig tasklista.

## Avgränsningar

Ingen multiplayer, backend, konton, procedural generation, modding eller
deployment. Save/load ligger efter MVP. Grafikproduktion är inte ett krav
för att verifiera gameplay.

Se [DECISIONS.md](DECISIONS.md) för beslut och [ARCHITECTURE.md](ARCHITECTURE.md)
för tekniska principer.

## Manuell melee (RTS-010)

Markera soldiers och högerklicka på en röd enemy för att angripa. Soldiers går
rakt till 32 px centrumavstånd och skadar med 18 HP/s. En enemy börjar med
36 HP; soldier med 60 HP. HP visas vid kropparna. Fiende med HP 0 försvinner
och soldiers blir idle. Attack följer mål-ID; move avbryter, avmarkering och
resursklick gör det inte. Workers angriper inte och behåller sin arbetsorder.
En stillastående övningsfiende används tills wave-slicen ersätter den.

## Enemy AI (RTS-011)

Röda enemies går mot basen eller närmaste soldier inom 140 px. De gör 6 HP/s
inom 32 px och rör sig med 65 px/s. Basen börjar med 240 HP och visar återstående
HP. Soldiers med HP 0 försvinner. Båda sidor kan dö samtidigt. Workers och
barracks angrips inte; soldiers måste fortfarande få manuell attack-order.

## Arena och waves (RTS-012)

Den enda kartan är en öppen 800 × 600-arena med befintlig bas/wood-nod.
Noden har nu 400 wood (tidigare 100). Samla från start, placera barracks och
producera flera soldiers före första vågen. Tre vågor anländer efter 60, 90 och
120 gameplay-sekunder med 1, 2 och 3 enemies från övre högra delen. Wave/countdown
visas vid basens HP. Endast dessa sex enemies spawnar; inga oändliga vågor.
Övningsfienden från RTS-010/011 är borttagen.

## Defeat (RTS-013)

När basens HP når 0 visas ”Defeat – basen är förstörd”. Simulation och gameplay-
input stoppas, inklusive insamling, enheter, produktion och waves. Selection
bevaras, pågående placeringsläge/dragpreview avslutas. Slutläget visas på arenan.

## Victory (RTS-014)

Efter sista vågens spawn: besegra alla kvarvarande enemies för ”Victory – alla
vågor besegrade”. Inga fler vågor anländer. Defeat har företräde om basen
förstörs samtidigt som sista enemy dör. Victory stoppar simulation/input precis
som defeat. Alla soldiers angriper manuellt; ge nytt mål när föregående dör.

## Starta om (RTS-015)

Efter victory eller defeat visas ”Starta om”. En ny match börjar direkt utan
sidomladdning: 240 bas-HP, 400 wood i noden, saldo 0 och tre omarkerade idle-
workers. Byggnader, soldiers, enemies, last, produktion, orders, markering,
waves och alla timers/ID-räknare återställs. Börja samla och bygg nytt försvar.

## Spela hela MVP-matchen

1. Dragmarkera de tre gröna workers och högerklicka på bruna noden. De samlar
   och levererar automatiskt. Avmarkering avbryter inte deras arbete.
2. Vid 40 wood: placera barracks, till exempel omkring (512, 384), fri från
   bas/nod. Fortsätt samla och träna soldiers för 20 wood och 5 sekunder vardera.
3. Markera orange soldiers med klick/drag. Högerklicka på röda enemies för
   manuell attack; ge nästa mål när den föregående dör. Workers i samma urval
   behåller sin arbetsorder när högerklicket träffar en enemy.
4. Försvara basen mot tre vågor efter 60/90/120 sekunder. Alla sex enemies döda
   efter sista spawn ger victory; bas-HP 0 ger defeat. Restart börjar om.

Inga formationer, collision eller pathfinding finns. Workers och barracks
angrips inte; soldiers har ingen automatisk attack. Överlappande kroppar/ringar
kan göra separata enheter svåra att se; gruppurval fungerar ändå. Grafik/ljud,
save/load och avancerad AI ingår inte.
