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
