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
Placeholders är tillåtna före asset-etappen; RTS-053–057 kräver sammanhängande pixelgrafik, animationer och ljud enligt backlog och användarens tillägg. Se [ARCHITECTURE.md](ARCHITECTURE.md) och
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

## Godkänd leverans i aktuell körning

Användaren har uttryckligen godkänt commit och push till befintlig remote efter varje färdig task. Kontrollera branch/remote/arbetskatalog; bevara andra ändringar. Kör tester, typecheck, build och git diff --check, granska och uppdatera docs/backlog före commit. Pusha utan force, history rewrite eller amend av pushade commits. Rapportera hash/push. Vid kvarstående check- eller pushfel: stanna vid task-gränsen. Pages-publicering är godkänd inom RTS-060 efter releasekontroller; Den tidigare körningen stannade vid RTS-060. Användaren har nu godkänt autonom implementation av RTS-061–065 efter verifierad Pages-publicering, med commit/push efter varje klar task. RTS-066–090 förblir planerade.
