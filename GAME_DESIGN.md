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

## Implementerat selection- och command-beteende (RTS-003)

Den befintliga placeholder-enheten börjar omarkerad. Vänsterklick på dess
kvadratiska yta markerar och visar en enkel ring. Vänsterklick på tom mark
avmarkerar; ringen i sig räknas inte som enhetens klickyta.

Högerklick ger move-command endast när enheten är markerad. Ett nytt kommando
ersätter föregående mål. Avmarkering tar bort ringen men stoppar inte pågående
rörelse och ändrar inte målet. Den omarkerade enheten ignorerar nya högerklick
tills den markeras igen. Rörelsen är fortsatt rak, delta-baserad och stannar
exakt vid målet utan overshoot.

Dragselection, flera enheter, shift-selection, grupper och HUD är inte
implementerade i denna slice; dragselection kvarstår i MVP-målet.

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
