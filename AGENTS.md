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

## Effektiva checks och aktuellt stopp

Senaste användarinstruktionen gäller framför äldre fortsätt-mandat: den stora
körningen är pausad. Slutför endast påbörjad RTS-147, verifiera, commit:a och
pusha, skriv en kort överlämning och stanna. Börja inte RTS-148.

- Under implementation: kör tester för ändrade system och berörda beroenden.
- Före commit av kod: kör hela unit-testsuiten, typecheck, build och
  `git diff --check` en gång på slutlig kod. Nuvarande build inkluderar strict
  typecheck; den kontrollen behöver inte köras separat en andra gång.
- Kör integrationstester för berörda system. Browserkontrollen fokuserar på
  ändrat spelarflöde och konkreta regressionsrisker.
- Kör inte samtliga campaign- eller matchsimuleringar efter varje task.
  Välj relevanta simuleringar när ekonomi, combat, AI, navigation,
  uppdragsmål eller gameplay-tid påverkas. UI-text, grafik och dokumentation
  kräver normalt inte fullständiga matchsimuleringar.
- `npm test` kör idag även integrationer och breda matchsimuleringar. Kalla
  därför inte dess resultat enbart unit-tests. Vid nästa kodtask ska den
  faktiska unit-testmängden väljas utifrån testernas innehåll, utan att tyst
  utelämna unit-tester; berörda integrationer väljs separat. Inför ingen
  ny testuppdelning eller ändrade scripts som en del av ren instruktionstext.
- Behåll full regression (`npm test`, typecheck/build och diffkontroll) vid
  etappens slut. Dela stora återstående tasks i subtasks under samma ID vid behov.
- Upprepa passerade checks endast efter nya relevanta ändringar, upptäckta fel
  eller konkret osäkerhet. Dokumentera orsaken till extra verifiering.
- Gör review och uppdatera docs/backlog före commit. Rapportera kort vad som
  kördes och varför; skilj verifierat, ej kontrollerat och kända problem.
  Markera inte acceptance criteria som uppfyllda utan belägg.
- Vid etappgränsen: lämna aktuell status, nästa task och kvarstående problem
  så att en ny session kan ta över. För en ren dokumentuppdatering kontrolleras
  textens konsekvens och filreferenser; redan passerade kodchecks återanvänds
  endast med tydlig upplysning om att ingen ny kodverifiering körts.

## Godkänd leverans i aktuell körning

Användaren har uttryckligen godkänt commit och push till befintlig remote efter varje färdig task. Kontrollera branch/remote/arbetskatalog; bevara andra ändringar. Kör tester, typecheck, build och git diff --check, granska och uppdatera docs/backlog före commit. Pusha utan force, history rewrite eller amend av pushade commits. Rapportera hash/push. Vid kvarstående check- eller pushfel: stanna vid task-gränsen. Pages-publicering är godkänd inom RTS-060 efter releasekontroller; Den tidigare körningen stannade vid RTS-060. Användaren har nu godkänt autonom implementation av RTS-061–065 efter verifierad Pages-publicering, med commit/push efter varje klar task. RTS-066–090 förblir planerade.

Efter avslutad och publicerad RTS-065 har användaren sagt ”fortsätt gärna”. Fortsätt därför med återstående roadmap i ordning, en task åt gången, med samma godkända commit/push/checks. Tidigare stopp vid RTS-065 är upphävt. Detaljera varje aktuell task före implementation. Ta upp öppna fraktions-/förmågebeslut innan beroende kod byggs; fortsätt oberoende arbete under tiden.
