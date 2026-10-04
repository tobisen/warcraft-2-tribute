# Finisher

Läs [AGENTS.md](../AGENTS.md), aktuell task i [BACKLOG.md](../BACKLOG.md),
ändringarna och granskningsresultatet. Rollen är en instruktion, inte en
automatiskt konfigurerad agent.

Verifiera acceptance criteria och Definition of Done. Kör befintliga checks
som är relevanta för ändringen och kontrollera dokumentens konsekvens och
filreferenser. Skapa inga tester för enbart dokumentation. Redovisa faktiska
kommandon och resultat samt sådant som inte kunnat verifieras.

Uppdatera relevanta docs, BACKLOG.md och [DEV_LOG.md](../DEV_LOG.md) före eventuell
commit. Markera Done bara när kraven är uppfyllda. Om verifiering misslyckas,
rapportera hindret och lämna tasken ofärdig för åtgärd; dölj inte fel eller
utöka implementationens scope för att få checks att passera.

Avsluta med ändringar, checks, öppna beslut och nästa steg. Commit och push
kräver att de ingår i användarens uppdrag.

Aktuell körning: användaren har godkänt commit/push efter färdig task enligt AGENTS.md. Reviewer granskar fortfarande utan att ändra filer eller göra commit. Implementer/Finisher följer task → checks → granskning → docs/backlog → commit → push; rapportera hash och faktiskt pushresultat. Ingen force-push eller history rewrite. Pages först inom verifierad RTS-060; senare roadmap planeras utan implementation.

Ny godkänd etapp: verifiera befintlig Pages först, implementera sedan RTS-061–065 autonomt och taskvis enligt AGENTS.md. RTS-066–090 ligger utanför denna etapp.

Senaste styrning efter publicerad RTS-065: användaren har godkänt fortsatt arbete. Följ nästa Current Focus och samma taskvisa checks/dokumentation/commit/push; tidigare etappstopp gäller inte längre. Rollernas ansvar är oförändrat.

## Senaste styrning: effektiva checks och paus

Kör hela unit-testsuiten, typecheck, build och git diff --check en gång på slutlig kod, plus berörda integrationer och fokuserad browserkontroll. Build inkluderar strict typecheck. Följ AGENTS.md:s åtskillnad mellan unit-tests och nuvarande breda npm test. Kör full regression vid etappgräns; inte alla kampanj-/matchsimuleringar efter varje task. Upprepa passerade checks endast efter relevanta ändringar, fel eller konkret osäkerhet. Rapportera kontroller och varför de kördes, verifierat/ej kontrollerat/kända problem samt en kort etappöverlämning.

Senaste mandat återupptar taskvis arbete genom RTS-150 med dessa effektivare checks och commit/push efter verifierad task. RTS-147 är färdig. Efter150 skriv slutrapport/överlämning och stanna före151. Tidigare paus före148 är upphävd. Denna styrning har företräde framför äldre etapptext.

Etappslut: RTS-148–150 är klara och0.2.0/Build53267ef är verifierad på Pages. Aktuell körning stannar före151; ingen ny task startas. Följ slutlig BACKLOG/DEV_LOG-överlämning för verifierade checks, återanvända belägg, uppskjuten faktisk ljud-/matchlyssning och kvarstående begränsningar.
