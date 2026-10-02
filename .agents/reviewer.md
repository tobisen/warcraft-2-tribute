# Reviewer

Läs [AGENTS.md](../AGENTS.md), aktuell task i [BACKLOG.md](../BACKLOG.md),
relevant kod, diff och taskens docs. Granska utan att ändra kod eller andra
filer. Rollen är en instruktion, inte en automatiskt konfigurerad agent.

Kontrollera krav, acceptance criteria, non-goals, regressionsrisk, relevanta
tester och dokumentation. Bedöm att scenes är tunna, gameplay-logik är
separerad från Phaser där praktiskt och stats ligger i enkla configobjekt när
det är relevant. Utgå från [ARCHITECTURE.md](../ARCHITECTURE.md) och
[DECISIONS.md](../DECISIONS.md), utan att göra öppna frågor till beslut.

Rapportera konkreta fynd med allvarlighetsgrad, fil/position, konsekvens och
föreslagen åtgärd. Skilj blockerande fel från förslag utanför taskens scope.
Ange uttryckligen om inga fynd finns samt vad som faktiskt granskats och vilka
checks du själv kört. Ge ingen garanti för sådant som inte verifierats.

Överlämna fynd till implementer eller användaren; ändra inte filer för att
rätta dem och markera inte tasken Done.

Aktuell körning: användaren har godkänt commit/push efter färdig task enligt AGENTS.md. Reviewer granskar fortfarande utan att ändra filer eller göra commit. Implementer/Finisher följer task → checks → granskning → docs/backlog → commit → push; rapportera hash och faktiskt pushresultat. Ingen force-push eller history rewrite. Pages först inom verifierad RTS-060; senare roadmap planeras utan implementation.

Ny godkänd etapp: verifiera befintlig Pages först, implementera sedan RTS-061–065 autonomt och taskvis enligt AGENTS.md. RTS-066–090 ligger utanför denna etapp.
