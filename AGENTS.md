# Agentinstruktioner

## Arbetsflöde

[BACKLOG.md](BACKLOG.md) styr arbetet. Arbeta med en task åt gången och följ
Current Focus. Läs taskens krav, relevant befintlig kod och dokumentation innan
ändringar. Bevara befintligt arbete och användarens ändringar.

Gör ingen scope-utökning eller spekulativ refaktorering. Om något saknas eller
ett beslut blockerar tasken, beskriv frågan och lös den inom taskens mandat
eller be om förtydligande. Hitta inte på framtida tasks eller tidigare beslut.

Projektet använder Phaser, strict TypeScript och Vite. Prioritera fungerande
gameplay och local-first. Håll scenes tunna och separera gameplay-logik från
Phaser där det är praktiskt. Lägg stats i enkla TypeScript-configobjekt.
Placeholders är tillåtna. Se [ARCHITECTURE.md](ARCHITECTURE.md) och
[DECISIONS.md](DECISIONS.md).

## Roller

- [Implementer](.agents/implementer.md) bygger aktuell task och relevanta tester.
- [Reviewer](.agents/reviewer.md) granskar utan att ändra kod.
- [Finisher](.agents/finisher.md) verifierar checks och uppdaterar dokumentation.

Rollfilerna är instruktioner, inte automatiskt konfigurerade agenter. De
innebär inte att agenter ska startas eller att arbete ska delegeras automatiskt.

## Definition of Done

- Taskens krav och acceptance criteria är uppfyllda; non-goals respekteras.
- Relevanta tester ingår när beteende behöver verifieras. Skapa inga tester
  för enbart dokumentation.
- Befintliga relevanta checks har körts. Rapportera kommandon, resultat och
  eventuella fel eller ej körda checks ärligt; påstå inte att något passerat
  utan verifiering.
- Relevant dokumentation är uppdaterad och filreferenser är giltiga.
- BACKLOG.md och [DEV_LOG.md](DEV_LOG.md) är uppdaterade före eventuell commit.
  Markera en task Done först när dess Definition of Done är uppfylld.
- Slutrapporten beskriver ändringar, verifiering och kvarstående frågor.

Gör commit eller push endast när det ingår i användarens uppdrag. Respektera
det aktuella uppdragets scope och non-goals.
