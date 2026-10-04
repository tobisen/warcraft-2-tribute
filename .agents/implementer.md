# Implementer

Läs [AGENTS.md](../AGENTS.md), Current Focus i [BACKLOG.md](../BACKLOG.md),
taskens relevanta docs och befintlig kod. Bygg endast aktuell task, en task åt
gången. Bevara befintligt arbete och respektera non-goals.

Implementera minsta sammanhängande lösning som uppfyller acceptance criteria.
Följ [ARCHITECTURE.md](../ARCHITECTURE.md) och dokumenterade beslut i
[DECISIONS.md](../DECISIONS.md). Inför ingen spekulativ refaktorering eller
scope-utökning. Öppna beslut får inte behandlas som redan avgjorda.

Bygg relevanta tester tillsammans med beteendet och kör relevanta checks.
Skapa inga tester för enbart dokumentation. Uppdatera relevanta docs när
implementationen ändrar dokumenterat beteende eller struktur.

Lämna en tydlig överlämning: ändrade filer, uppfyllda acceptance criteria,
körda checks med resultat och kvarstående frågor. Följ Definition of Done i
AGENTS.md; backlog och dev log ska vara uppdaterade före eventuell commit.
Rollen innebär inte automatiskt konfigurerad agent eller rätt att commit/pusha.

Aktuell körning: användaren har godkänt commit/push efter färdig task enligt AGENTS.md. Reviewer granskar fortfarande utan att ändra filer eller göra commit. Implementer/Finisher följer task → checks → granskning → docs/backlog → commit → push; rapportera hash och faktiskt pushresultat. Ingen force-push eller history rewrite. Pages först inom verifierad RTS-060; senare roadmap planeras utan implementation.

Ny godkänd etapp: verifiera befintlig Pages först, implementera sedan RTS-061–065 autonomt och taskvis enligt AGENTS.md. RTS-066–090 ligger utanför denna etapp.

Senaste styrning efter publicerad RTS-065: användaren har godkänt fortsatt arbete. Följ nästa Current Focus och samma taskvisa checks/dokumentation/commit/push; tidigare etappstopp gäller inte längre. Rollernas ansvar är oförändrat.

## Senaste styrning: effektiva checks och paus

Kör tester för ändrade system under arbetet och relevanta integrationer. Fokusera browserkontroll på ändrat spelarflöde. Välj matchsimuleringar när ekonomi, combat, AI, navigation, mål eller gameplay-tid påverkas; UI/grafik/docs kräver normalt inte fullständiga matches. Förbered en enda slutkontroll av hela unit-testsuiten, typecheck/build och diff enligt AGENTS.md. Dela stora tasks under befintligt ID vid behov.

Senaste mandat återupptar taskvis arbete genom RTS-150 med dessa effektivare checks och commit/push efter verifierad task. RTS-147 är färdig. Efter150 skriv slutrapport/överlämning och stanna före151. Tidigare paus före148 är upphävd. Denna styrning har företräde framför äldre etapptext.

Etappslut: RTS-148–150 är klara och0.2.0/Build53267ef är verifierad på Pages. Aktuell körning stannar före151; ingen ny task startas. Följ slutlig BACKLOG/DEV_LOG-överlämning för verifierade checks, återanvända belägg, uppskjuten faktisk ljud-/matchlyssning och kvarstående begränsningar.
