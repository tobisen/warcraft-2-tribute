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

Högerklick skickar samma move-command till alla markerade enheter och ersätter
deras tidigare mål. Avmarkering stoppar inte pågående rörelse eller ändrar
målen. Omarkerade enheter ignorerar nya kommandon. Rörelsen är fortsatt rak,
delta-baserad och stannar exakt utan overshoot. Enheter får överlappa vid samma
mål; inga formationer eller collision avoidance finns.

Shift-selection, kontrollgrupper, pathfinding och HUD ingår inte i denna slice.

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
