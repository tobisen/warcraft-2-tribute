# Arkitektur

## Status och teknik

Detta är planerad arkitektur, inte en beskrivning av redan implementerad kod.
Teknikvalet är Phaser + strict TypeScript + Vite. Applikationen ska köras i
webbläsaren som ett local-first singleplayer-spel utan backend eller konton.

## Ansvarsfördelning

- Tunna Phaser-scenes hanterar scenlivscykel, input och presentation.
- Gameplay-logik separeras från Phaser där praktiskt så att regler kan
  verifieras utan rendering.
- Stats definieras i enkla TypeScript-configobjekt. Inför inget modding- eller
  externt datasystem för detta.
- Grafik kan vara placeholders. Struktur och abstraktioner införs när aktuell
  task behöver dem, utan spekulativ refaktorering.

RTS-001 etablerar endast ett minimalt projektskelett, strict TypeScript,
Vite/Phaser-start och dokumenterade utvecklingschecks. Konkreta kataloger och
kommandon dokumenteras efter implementation; inga källkodsfiler eller
dependencies finns ännu.

## Öppna frågor inför movement

Gridstorlek, koordinatmodell och tidsmodell är öppna beslut. Movement-tasken
måste ta ställning till dessa innan beroende beteende implementeras. Anta
inte ett visst grid, koordinatsystem eller fast/variabelt tidssteg nu.
Beslut och motiv ska registreras i [DECISIONS.md](DECISIONS.md).

## Verifiering

Använd relevanta tester för gameplay-regler och relevanta projektchecks för
typkontroll och build när dessa finns. Exakta verktyg och kommandon etableras
i RTS-001. Dokumentationsändringar verifieras genom konsekvens och giltiga
filreferenser, utan nya tester.

Se [GAME_DESIGN.md](GAME_DESIGN.md) för MVP och [BACKLOG.md](BACKLOG.md) för scope.
