# PRIO-03: original Frontier terrain

`reference-terrain.mjs` contains original integer-pixel brushes and a local color
palette. `scripts/export-reference-terrain.mjs` produces the separate PNG/JSON
atlas reproducibly; `assets:export` also includes it. No raster is imported,
traced or used as the game background. Project-local artwork license applies.

The user approved the two attached Warcraft II maps as visual references.
All twelve actual JPGs linked from https://classic.battle.net/war2/lp/c2-4.shtml
were retrieved and visually inspected, with River Fork inspected at full size.
They informed connected crowns, irregular contours, glades, quiet ground and
shallow/deep banks. The third-party images remain outside the repository.

Only newly started Frontier Valley matches use this authored layout. Save46
migrates older Frontier saves to the original `legacy` layout. The dry central
crossing divides the two river basins; ships cannot sail across dry land. The
southern lake contains a small land island and the northern channel rock islets.
The three land approaches, original resource IDs/positions and600wood/450gold
remain. Harvestable crowns share those finite stocks; no decorative fake forest
or extra resource is added. At depletion the resource entrance and crowns open.

Before/after screenshots use identical camera positions with an explicit fully
revealed art fixture, separate from the physical gathering/naval browser checks.
See `artifacts/prio-03/`. Existing maps keep their previous artwork/layout.

## Kartkorrigering2026-10-06

Originalkodade lövträd, klippkrön och kantvarianter i samma atlas. River Fork-bilden från den dokumenterade Battle.net-sidan hämtad och faktiskt granskad; tidigare användarbilagor saknas lokalt. Inga originalpixlar kopieras. Frontier organic-layout och Save63 separat från äldre geometri. Faktiska före/efterbilder: artifacts/map-correction; kvaliteten är enklare och mer regelbunden än originalet.
