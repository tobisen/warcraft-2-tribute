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

## Enkel resurssamling (RTS-005)

De tre befintliga enheterna är placeholder-arbetare. En brun resursnod vid
(650, 180) innehåller 100 wood. Markera arbetare och högerklicka på noden för
att ersätta deras order med gather. De går till noden och samlar inom 24 world
pixels från centrum, med 1 wood/sekund per arbetare.

Wood krediteras direkt till spelarens gemensamma saldo. Detta är en förenkling
för denna slice: ingen bas, leverans eller bärkapacitet finns. Insamlingen är
kontinuerlig; enkel text visar saldo och nodens återstående mängd med en decimal.
Flera arbetare delar samma begränsade mängd utan att den blir negativ.

Vid uttömning blir arbetare med gather-order till noden idle, även om de ännu
är på väg dit. Noden blir grå och ligger kvar med 0 wood. Ny move-order avbryter
gathering; avmarkering påverkar inte ordern. Högerklick på en tom nod ger idle.
Inga animationer, collision, pathfinding, byggnader eller ekonomi-UI införs.

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
