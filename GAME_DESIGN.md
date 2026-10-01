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

Exakta resurstyper, kostnader, stats, vågparametrar och villkor för win/loss
specificeras i relevanta framtida tasks. De är inte beslutade här.

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
med 100 wood, och en fast blå bas står vid (400, 450). Markera arbetare och
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
Enheter får överlappa. Byggplacering, byggkostnader och fler resurser,
pathfinding och collision ingår inte i denna slice.

## Arbetarproduktion från basen (RTS-007)

Knappen ”Träna arbetare – 20 wood” startar produktion från den befintliga basen.
Godkänd start drar 20 wood direkt från levererat saldo och tar 5 gameplay-
sekunder. Endast en produktion får pågå; otillräckligt saldo och upptagen bas
blockerar start. Återstående tid visas med enkel text; ingen kö finns.

Den nya arbetaren skapas nära basen vid (460, 450) med unikt ID, tom last,
idle och utan markering. Den kan klick-/dragmarkeras, flyttas och samla/leverera
precis som startarbetarna. Produktionsknappen ändrar inte selection eller ger
order. Spelaren markerar och kommenderar den nya arbetaren själv.

Ingen separat produktionsbyggnad, byggplacering, stridsenhet, avbrytning/refund,
rally point eller population cap införs. Den begränsade noden och produktions-
kostnaderna sätter naturliga gränser för antalet nya arbetare i denna slice.

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
