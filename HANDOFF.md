# Överlämning efter RTS-168–169

Datum2026-10-05. Användaren godkänner första luftrostern och tydligt märkta TEMP-ikoner, inte slutliga flygarsprites. RTS-168 gameplay Done (`83d01fe`, pushad); RTS-169 Done som första preliminära balanspass, verifierat före separat commit/push. Körningen stannar efter169; RTS-170 Hold Position, Patrol och köade orders är nästa roadmaptask och har inte startats. Ingen agentdelegering.

## Status och implementation

- RTS-165 Done838f729,166 Done2cd36a6,167 Donefd9dfd3 (historiskt verifierade/pushade). De återimplementeras inte.
- 168: Gryphon Rider/Wyvern Rider/Great Eagle/Gyrocopter/Airship. Befintlig barracks, Forge+attack1+defense1, tidig markarcher-AA. Domänbaserad navigation/vision/minimap/combat/production/supply/AI/Save/restart. TEMP-ikoner/porträtt med24px höjd/skugga; statiska, inga slutliga animationer. Sjö-AI:s markcap2 hindrar inte flygproduktion; boarding är mark-only.
- 169:89 explicita actualcombat-scenarier, kostnadsjämförbara land/sea/air/magicgrupper, counters för alla fem raser. Warship air0.75× (12) men normal16damage; Eagle air1.25×(17.5), mark6.3. AI-byggnadspreflight ignorerar flygare och bevarar markblockering. Save42 migrerar41; gamla projektilmasker/skador/köer behålls, inga recipes omprisade. Transporttargets=[], befintliga spells markstrid-only.
- Balans preliminär:25 ground-AA-korsrasfall vinner, fem nära meleegrupper slår AA. Bombare behöver eskort; Gyro är stark aircounter med svag markattack. Spells hjälper inte automatiskt en supportgrupp slå massmelee. Ingen mänsklig kiting/strategi/helmatchspeltest.

## Verifiering

168: unit446/80, berörda integrationer93/12, build/strict typecheck/diff PASS. Chromium fem raser×800/1280 fysisk production/selection/flight-over-building/Save/Load/airtargeting/combat/fullkö/restart, panelmått PASS.45PNG/browser.json i [rts-168](artifacts/rts-168), representativa femrasscreenshots visuellt granskade.

169: riktade122/5 PASS,73 balansintegrationer/89 records PASS. Slutlig unit435/79, build inklusive strict typecheck och diff/lokala docslänkar PASS. Komplett slutregression1320/160 PASS526.62s. Unit435/79 PASS12.08s och build/strict typecheck PASS på slutliga roster-/testhelperändringar. Föregående fullkörning1314PASS/6FAIL krävde äldre rosterförväntningar uppdaterade till hela nya luftrostern; riktade32/2 PASS, inga svagare kostnads-/segerasserts. Chromium fem navalprofiler×native800×600/1280×720 fysisk airtarget, inflightSave42/Load och12HPimpact PASS;20PNG/[browserrapport](artifacts/rts-169/browser-naval-aa.json), fyra representativa före/efter/större bilder visuellt granskade. AI-browser fem raser native800 PASS med faktisk Scene.update: betald airproduktion, archerdefense och release vid fogloss;5PNG/browser-ai-air.json, Elf/Goblin-bilder visuellt granskade. Explicit bank/tech/armyfixture, ingen mänsklig helmatchekonomi. Äldre testbotar väljer nu lagliga synliga mål, bevarade victory/ledger/Save-asserts; tre riktade islandsfall och The Crossing PASS efter anpassningen. Balansmetod/ändrade values/resultat i [review](artifacts/rts-169/balance-review.md), [data](artifacts/rts-169/results.json).

Reproducerbart: npm test -- src/gameplay/air.test.ts src/gameplay/combinedArmsBalance.test.ts src/gameplay/navalCombat.test.ts. node scripts/check-combined-arms.mjs skriver rapport. Browserharness scripts/check-air.mjs, scripts/check-naval-air.mjs och scripts/check-air-ai.mjs använder extern Playwright/Chromium via W2T_PLAYWRIGHT_MODULE/W2T_BROWSER_EXECUTABLE. Lokal devserver http://127.0.0.1:5183/ (ursprungligt5182 upptaget). Ingen skeppad debug-API.

## Kvar och nästa

- [Slutlig airgrafik](assets/sources/air-168.md) Pending: fem godkända detaljrika silhuetter/referenser, transparenta spelassets, idle/fly/attack/death-animationer och porträtt. TEMP är användargodkänd implementationpresentation, inte färdiga slutassets.
- [Casting-poser](assets/sources/magic-165.md) och [sjöreferenser](assets/sources/remaining-sprites.md) saknas fortsatt; Human/övriga landassets enligt155 är accepterade för tillfället.
- RTS-157 In Progress: faktisk ljudlyssning kvar.158 In Progress:380 inspelningar/licensposter saknas; texter/fallback är inte inspelade röster.159 är användaraccepterad Done.
- Mänskligt balansspeltest/airmicro/helmatchekonomi saknas; teknisk simulering skiljs från detta. Ny CI-/Pages-build inte separat kontrollerad. Befintlig bundlevarning kvarstår.
- Användarens src/style.css SHA25695c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e är bevarad. Otrackade docs/ är utanför våra commits. main/origin används utan force/amend/historyrewrite.

Nästa roadmaptask170 kräver ny körning; inga senare tasks eller nya RTS-ID:n skapade. Slutlig flygarassetbearbetning hanteras separat under168:s kvarstående grafik, utan att gameplaystatus eller placeholders blandas ihop.
