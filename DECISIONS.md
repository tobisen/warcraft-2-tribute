# Beslut

## Fastställda beslut

| Beslut | Innebörd och motiv |
| --- | --- |
| Browserbaserat singleplayer-RTS | Inspiration från Warcraft 2, AoE2 och C&C; scope hålls till en lokal spelupplevelse. |
| Phaser + strict TypeScript + Vite | Fastställd teknik för kommande implementation. |
| Local-first, gameplay före grafik | Funktion verifieras tidigt; placeholders är tillåtna. |
| Tunna scenes | Separera gameplay-logik från Phaser där praktiskt för tydliga ansvar och verifierbara regler. |
| Stats i enkla TypeScript-configobjekt | Håll datadefinitioner enkla utan extra konfigurationssystem. |
| MVP | En karta, drag selection, move commands, gathering, bas, produktionsbyggnad, stridsenhet, enkla fiendevågor och win/loss. |
| Utvecklingsordning | Movement → selection → resources → buildings → combat → AI, efter projektinitialisering. |
| Första task | RTS-001 – Initialize project structure; Current Focus är Todo. |
| Save/load efter MVP | Persistens utökar inte MVP. Local-first innebär inte att save/load redan finns. |
| Avgränsningar | Ingen multiplayer, backend, konton, procedural generation, modding eller deployment. |
| Agentarbete | BACKLOG styr; en task åt gången; inga scope-utökningar eller spekulativ refaktorering. Relevanta tester och docs ingår i Definition of Done. |
| Rollfiler | Implementer bygger och testar, Reviewer granskar utan kodändringar, Finisher verifierar och uppdaterar docs. Filerna konfigurerar inte automatiskt agenter. |

## Öppna beslut inför movement

| Fråga | Status | När den ska lösas |
| --- | --- | --- |
| Gridstorlek | Öppen; inget värde fastställt. | Inför implementation av movement. |
| Koordinatmodell | Öppen; inget koordinatsystem fastställt. | Inför implementation av movement. |
| Tidsmodell | Öppen; fast eller variabelt tidssteg är inte valt. | Inför implementation av movement. |

Dokumentera valet, motivet och konsekvenserna när respektive fråga avgörs.
Detta dokument registrerar inga antagna tidigare beslut. Se
[ARCHITECTURE.md](ARCHITECTURE.md) och [BACKLOG.md](BACKLOG.md).
