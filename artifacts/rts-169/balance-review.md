# RTS-169 – preliminär combined-arms-review

2026-10-05. Gameplay enligt godkänt168-mandat; slutliga flygarsprites Pending.

## Metod och begränsningar

Deterministic .1s actual combat. Open-field land fixtures, actual-water naval fixtures; wood/gold equal weight, nearest rounded whole-unit cost. Both research1 for land/air, no research in naval. Nearest legal focus, no kiting, local fog for spells. Separate paid AI adapter tests. Not human playtest or paid full economy.

Arméer är explicita komponentfixtures, inte gratis trupper i spelets produktion. Fem separata AI-admissionfall debiterar samma recipes;17 lufttester och befintliga economy/production/save-integrationer kontrollerar supply/prereqs/FIFO. Wood+gold är en redovisningsmodell med lika vikt; varje faktisk resurskostnad står separat i results.json. Enhetsantal avrundas till närmaste budget, så avvikelse upp till en halv recipe är möjlig. Inga hypotetiska slutliga sprites eller mänskliga speltaktiker påstås verifierade.

Land/air får båda attack1/defense1, ingen E-kiting eller automatisk retreat. Mana/markspells tickas på riktigt; stödgruppernas resultat visar situationsberoende användning, inte garanterad vinst mot ren melee. Sea använder faktisk islands-water men ingen research. Scenariolängd högst90s med0.1s steg; detta är inga fulla campaign-simuleringar.

## Ändrade värden

| Value | Före | Efter | Belägg |
| --- | --- | --- | --- |
| Warship luftmask/skada | Ingen luftattack | air tillåtet; damage×0.75=12 | Fem1v1-baselines hade ingen returattack. Kostnadsjämförbara grupper vinner alla10 actual-water-fall. Land/sea/buildingdamage16 består. |
| Great Eagle luftskada |14×1 |14×1.25=17.5 | Förlorade alla korsrasairdueller utan micro. Nu vinst mot Wyvern men förlust mot Gryphon/Gyrocopter vid400-budget. |
| AI barracks/outpost-air occupancy | Flygare kunde spärra första markplatsen | Ignoreras i markpreflight | Två tester med markenhet som positiv blockeringskontroll. |

Kostnader, supply, produktionstid, range, fart och maxHP oförändrade. Save42 bevarar41-köer/skott och migrerar äldre kedja. Transport explicit targets=[], spells fortfarande markstrid.

## Representativa slutresultat

| Scenario | Ras | Own wood/gold | Enemy wood/gold | Överlevare own/enemy | Tid |
| --- | --- | --- | --- | --- | --- |
| groundAA-v-air | crown/crown |140/70|130/70|5/0|4.4s|
| melee-v-AA-close | crown/crown |160/40|140/70|8/0|2.4s|
| groundAA-v-air | clans/clans |140/70|120/80|5/0|3.5s|
| melee-v-AA-close | clans/clans |162/54|140/70|9/0|2.2s|
| groundAA-v-air | elves/elves |110/60|90/70|5/0|2.4s|
| melee-v-AA-close | elves/elves |140/42|110/60|7/0|2.8s|
| groundAA-v-air | dwarves/dwarves |144/60|130/80|6/0|3.6s|
| melee-v-AA-close | dwarves/dwarves |168/35|144/60|7/0|4s|
| groundAA-v-air | goblins/goblins |162/72|150/90|5/0|4s|
| melee-v-AA-close | goblins/goblins |192/48|162/72|12/0|1.7s|
| bomber-v-interceptor | goblins/elves |150/90|135/105|0/3|4.9s|
| bomber-with-ground-AA-escort | goblins/elves |147/77|135/105|5/0|3.7s|

Alla25 ground-AA-korsrasfall vinner. Alla fem nära meleegrupper slår AA. Siege vinner fyra av fem attacker mot AA; Elves ranged vinner sin siege-fixture, vilket visar att en enda counterregel inte avgör alla matcher. Gyro vinner alla korsrasflygdueller i dessa förhållanden, men förlorar mot billig mark-AA och har0.65× markskada; den rollen behöver mänsklig kontroll över range/kiting.

Två oskyddade bombare mot tre Eagles:0/3 överlevare och Eagles180HP. En bombare+fyra Slingers mot tre Eagles:5/0. Spells gör inte stödkompositioner automatiskt överlägsna i nära markstrid; alla fem casterfall får lagliga betalda casts, men grupperna förlorar mot motsvarande melee. Supportpositionering/mana och mänsklig taktisk balans återstår.

## Verifiering

scripts/check-combined-arms.mjs:73 PASS,89 scenarier i results.json. Baseline.json har tidiga floor-budgetfall före AA-tuning och ska inte användas som identisk post-budgetjämförelse. Sea1v1 är direkt jämförbara före/efter. Riktade integrationer122/5 PASS efter final AI-placeringsfix.

Chromium fem raser ×800×600/1280×720: fysisk warshipselection och elevated air targeting, shot marine+airborne, Save42/Load identisk inflightshot och12 faktiska HP-skada.20 PNG och browser-naval-aa.json; Human före/efter800, Dwarf-after1280 och Goblin-after800 visuellt granskade. Aircraft TEMP; befintliga sjöassets är preliminära och inte referensstyrt uppgraderade.

Obligatoriska slutchecks redovisas i DEV_LOG/HANDOFF. Teknisk verifiering och deterministisk simulering hålls skilda från mänskligt speltest (saknas). Ingen ny CI/Pages-/ljudgranskning.

AI-browser kompletterad för fem raser native800: verklig Scene.update debiterar/producerar air efter explicita completed-tech/bank/army-preconditions, groundarcher försvarar mot synlig air, hotet släpps när enheten lämnar fog.5PNG/browser-ai-air.json; Elf/Goblin visuell granskning. Inte mänskligt speltest eller normal helmatchekonomi.

Fullregression upptäckte äldre naval/campaign-testbotar som manuellt valde air/sea för melee. De filtrerar nu lagliga synliga mål via gemensam domänregel; inga victory/ekonomi/Save-asserts försvagades. Tre tidigare felande islandsfall och The Crossing PASS riktat. Slutlig unit435/79/build-strict/diff/lokala docsreferenser PASS; full regression1320/160 PASS526.62s efter äldre rosterasserts uppdaterats till hela nya luftrostern. Riktade Human/AI-roster32/2 PASS; slutunit435/79 PASS12.08s, build med strict typecheck PASS. Ingen ny runtimeändring efter browserkontrollerna.
