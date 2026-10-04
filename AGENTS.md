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

Senaste uppdraget genom RTS-150 är avslutat. RTS-001–150 är färdiga; återimplementera dem inte. Taskvis commit/push är levererad. Slutrapport och överlämning finns i BACKLOG/DEV_LOG; stanna före RTS-151. Tidigare paus före148 ersattes av denna nu avslutade etapp.

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
- `npm run test:unit` kör alla isolerade komponent-/asset-testfiler.
  `scripts/test-integration-files.json` klassificerar sammansatta MatchState-,
  Save/end-to-end- och matchgenomspelningsfiler separat; blandade filer ligger
  helt i integrationurvalet. `node scripts/test-unit.mjs --list` visar båda
  disjunkta urvalen och validerar manifestet. Alla testfiler i src/tests finns
  i exakt ett urval. Klassificera nya/ändrade testfiler utifrån innehållet.
  Berörda integrationer körs med riktade `npm test -- <fil...>`-kommandon.
  `npm test` utan filurval förblir full regression, inklusive alla integrationer.
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

## Avslutad etapp genom RTS-150

RTS-148–150 är verifierade och levererade;0.2.0/Build53267ef publicerad och kontrollerad på Pages. Aktuell körning är avslutad och stannar föreRTS-151. Ingen151-task är definierad eller påbörjad. Se slutlig BACKLOG/DEV_LOG-överlämning för checks, återanvända belägg, uppskjuten faktisk ljud-/matchlyssning och kända begränsningar. Rena Markdown/rollpushar kör text/länk/diffchecks; kod/config/assets/workflow kör fortsatt relevant unit/integration och full regression vid etappslut/CI.

## Nytt mandat 2026-10-04

Nytt uppdrag ersätter tidigare stopp före151: återställ roadmap151–180, genomför endast151–154 en task i taget med verifiering, docs och commit/push. Stanna efter154 och lämna över med nästa task155. Ingen automatisk agentdelegering. Historiska releasebelägg ska skiljas från ny verifiering.

## Avslutad etapp RTS-151–154

RTS-151–154 är färdiga. Roadmap151–180 är återställd, men aktuell körning avslutas
före155. HANDOFF.md och QUALITY_REVIEW.md redovisar kontroller och begränsningar.
Nästa task155 är Todo och kräver nytt uppdrag; äldre fortsättningsmandat startar
inte senare tasks. Full regression1146/145 PASS, slutlig unit428/75 och build med
strict typecheck PASS. Ny CI-/Pages-build är inte separat verifierad här.

## Mandat RTS-156–159

Användaren beställer156–159 en task i taget, med docs/checks/commit/push efter verifierad task och HANDOFF efter159. Tidigare stopp före156 är ersatt. Grafik kräver browsergranskning; ljud kräver faktisk lyssning. Saknade inspelningar/underlag redovisas, oberoende arbete fortsätter vid assetblockering. Inga breda campaign-simuleringar för grafik/ljud. Ingen automatisk delegering.

## Stopp efter RTS-159

Aktuellt156–159-mandat avslutas efter159.156/159 är klara;157 kräver faktisk lyssning och158 egna/licensierade röstinspelningar/lyssning. Verifierade tekniska delcommits får inte tolkas som Done för saknade assets. HANDOFF.md styr överlämningen;160+ startas inte automatiskt. Ingen ny CI/Pages eller broad campaign-regression hävdas.

## Mandat RTS-160–164

Användaren ersätter stoppet efter159 med160–164, en task i taget, riktad/browser-verifiering och docs/commit/push till befintlig origin/main efter varje färdig task. Stanna efter164 med HANDOFF.159 accepteras som Done. Befintlig CSS och otrackade docs bevaras. Ingen automatisk delegering.

## Mandat RTS-165–169

Användarens bifogade uppdrag beskriver165–173 men begär uttryckligt stopp och HANDOFF efter169 för ny chatt170–173. Genomför165–169 en task i taget, riktade tester/browser och slutlig unit/build/typecheck/diff samt docs/commit/push. Full regression vid etappgräns. Bevara CSS/docs. Öppna caster-/luftdesignfrågor tas upp före beroende kod. Ingen agentdelegering.
