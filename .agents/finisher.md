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

Kör fulla slutchecks en gång på slutlig kod: npm test, npm run build (inkluderar strict typecheck) och git diff --check. Dubblera inte typecheck eller breda simuleringar. Upprepa endast kontroller som nya kodändringar, fel eller konkreta fynd motiverar. Redovisa riktade checks, fullchecks, misslyckade försök och återanvänd evidens ärligt.

Den stora körningen är pausad. Endast påbörjad RTS-147 får slutföras; efter verifierad commit/push och kort överlämning ska arbetet stanna. Börja inte RTS-148. Denna instruktion har företräde framför äldre etapp-/fortsätttext ovan.
