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

## Överlämning RTS-165–167 och blockering168/169

165–167 är Done och pushade838f729/2cd36a6/fd9dfd3. Full regression1227/158,
unit446/80 och build med strict typecheck PASS; lokal browser800/1280 för
magiflöden granskad.168 Blocked: den befintliga134-planen/referenserna saknar
luftroster och flygarassets; designfråga ställd men obesvarad.169:s centrala
luft/anti-air/combined-arms-verifiering är också blockerad. Se HANDOFF.md och
assets/sources/air-168.md. Inga flygplaceholders eller full169-balans hävdas.
Nästa task är att lösa168:s underlag, inte170.170–173 har inte startats.

## Mandat RTS-170–173

Nytt uttryckligt uppdrag ersätter tidigare stopp efter169. HANDOFF:s senaste168/169-leverans gäller framför den äldre blockeringsnoteringen ovan. Genomför170–173 en task åt gången, återanvänd befintliga system, bevara style.css/docs/, verifiera riktat och i browser samt slutlig unit/build med strict typecheck/diff, docs och taskvis commit/push till origin/main utan force. Full regression vid etappgräns. Stanna efter173 med HANDOFF;174 startas inte. Ingen automatisk delegering.

## Stopp efter RTS-173

RTS-170–173 är Done och verifierade. Full regression1355/163, unit435/79 och build inklusive strict typecheck PASS; riktade browserflöden granskade. HANDOFF.md redovisar commits och begränsningar. Aktuellt mandat avslutas efter173;174 är Todo och startas inte utan nytt uppdrag. Användarens CSS/docs bevarade. Ingen ny CI/Pages-/ljud-/mänsklig balansverifiering hävdas.

## Prioriterat mandat PRIO-01–04

Användaren pausar174–176 och beställer separata PRIO-01–04 enligt BACKLOG. Musklick, egna särskiljbara actionikoner, spelbar referenskarta med godkända terrängbilder och interaktiva djur. En task åt gången, relevant verifiering/browser, docs och commit/push till origin/main. Bevara befintlig CSS/docs, ingen automatisk delegering. Stanna efter04;174 startas inte.

## Mandat RTS-174–176

Nytt uttryckligt uppdrag återupptar174–176 efter färdiga PRIO-01–04. En task åt gången med riktade tester/browser, slutlig unit/build inklusive strict typecheck/diff, docs och commit/push till origin/main utan force. Full regression vid etappslut. HANDOFF efter176; stanna före177. Bevara användarens style.css och docs/. Ingen automatisk delegering.

## Avslutad etapp RTS-174–176

174–176 är Done. Slutlig fullregression1426/173, unit461/83, build inklusive strict typecheck/diff och native browser800/1280 PASS. HANDOFF.md redovisar lag/spectator/Save50, kontroller och begränsningar. Stoppa före177; tidigare fortsättningsmandat startar inte senare tasks. Användarens style.css/docs bevaras. Ny176-CI efter taskpush rapporteras separat från174/175:s faktiskt gröna GitHubkörningar.

## Mandat RTS-177–180

Användarens nya uppdrag ersätter stoppet efter176. Genomför177–180 en task i taget med riktade tester/browser, slutchecks, docs och commit/push.177 anger uppskattad speltid; mänskligt speltest får inte ersättas av snabb simulering. Samlad kampanjregression när ändringarna är klara, full releasekontroll vid180. HANDOFF och QUALITY_REVIEW efter180; stanna utan nya tasks/karteditor. CSS/docs bevaras; ingen automatisk delegering.


## Stopp efter RTS-180

RTS-177–180 är avslutade och0.3.0/Build6a96227 är publicerad med faktisk CI/Pages/browser-verifiering. HANDOFF.md och QUALITY_REVIEW.md skiljer tekniska belägg från kvarstående mänsklig tids-/balans-/ljudgranskning och slutliga assets. Stanna efter180; inga nya roadmaptasks eller karteditor utan nytt uppdrag. Användarens CSS/docs är fortsatt bevarade.
