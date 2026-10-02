# RTS-070 – Fraktionsspeltest, 2026-10-03

Verifierad profil: lokal produktionsbuild, macOS arm64 och headless Chromium, 1280×900 med native 800×600 canvas. Andra browsermotorer och multiplayerbalans är inte verifierade.

## Beteendematris

[Matristester](src/gameplay/factionBalance.test.ts) använder [kommandostrategin](src/gameplay/testHelpers/releaseBot.ts): faktiska startresurser, upptäckta noder, gathering/delivery, betald byggnad/produktion och bara synliga attackmål. Ingen extra wood/gold, HP eller enhet injiceras. Delta 0,05 s, högst 300 gameplay-s; förmågan används vid kontakt med ett synligt mål. Varje rad testar Victory, korrekt fraktion, paus/save-load vid 45 s, terminal freeze, och total wood/gold inklusive last, kostnader och förlorad last.

| Scenario | Kronförbundet Easy/Normal/Hard | Järnklanen Easy/Normal/Hard |
| --- | --- | --- |
| Wave-survival | Victory / Victory / Victory | Victory / Victory / Victory |
| Skirmish | Victory / Victory / Victory | Victory / Victory / Victory |
| Skogsvakten | Victory / Victory / Victory | Victory / Victory / Victory |
| Belägringen | Victory / Victory / Victory | Victory / Victory / Victory |
| Utposten | Victory / Victory / Victory | Victory / Victory / Victory |

Alla 30 slutliga kombinationer passerar. Två ytterligare tester låter oskyddade baser förlora genom verklig enemy movement/attack, utan injicerad skada; nästa match byter fraktion/scenario/svårighet och börjar utan gamla units, selection, köjobb eller förmågetimers. Hela sviten: **535 tester/71 filer**, typecheck, build och diffkontroll passerar.

Den första strategin förlorade Järnklanens Hard Skirmish vid 118,9 s: 6-gold-receptet försenade första försvararen, och strategin väntade sedan på en större armé trots störd ekonomi. Fraktionsspeltestet samlar gold redan under byggandet, använder en annan worker som builder, retirerar hotade workers tidigare, skyddar dem med synliga mål och går efter 120 s vidare med en överlevande arméenhet. Detta är spelarens legala kommandostrategi i testhelpern; inga runtime-AI-, balans- eller startresursvärden ändrades. Tidigare release-strategi utan de explicita fraktionsvalen behåller sitt tidigare beteende.

## Naturliga browsermatcher

Två separata Utposten/Normal-matcher i vanlig browserhastighet: DOM-val av fraktion, verkliga drag/klick, utforskning, wood/gold-gathering och leverans, betalt bygge och soldier/archer/catapult, synliga attackmål samt fraktionsknapp. Inga gameplay-state-fixtures eller accelererad klocka i dessa matcher. Temporär observation av scenen användes endast för att välja redan synliga mål och kontrollera state.

| Mått | Kronförbundet | Järnklanen |
| --- | ---: | ---: |
| Utfall / gameplay-tid | Victory / 90 s | Victory / 90 s |
| Bas-HP | 240 | 240 |
| Första soldier/yxkrigare | 23,81 s | 24,72 s |
| Betald wood / gold | 120 / 35 | 118 / 36 |
| Producerade army-units / överlevande | 3 / 3 | 3 / 3 |
| Överlevande workers | 3 | 3 |
| Knappaktiveringar förmåga | 3 | 3 |
| Lost cargo wood / gold | 0 / 0 | 0 / 0 |

Båda såg alla tre waves, hade samtliga tre army-typer och exakt ledger 440 wood/310 gold inklusive saldo/nod/last/kostnader. Restart återställde startresurser och fraktion. Screenshots av ekonomi, bygge, strid och resultat granskades. Inga page-, console- eller requestfel.

Separat browserkontroll accelererade endast klockan i två nya orörda Survival/Hard-matcher, utan injicerad skada/resurser/units. Verklig defeat kom vid cirka 91,55 s för Kronförbundet och 91,60 s för Järnklanen. Högerklick/E och ytterligare simulation efter game over ändrade inte modellen. Restart och nytt val av motsatt fraktion återställde hela matchen. Dessa är inte naturliga UI-förlustmatcher.

## Balansbedömning och gränser

Båda fraktioner har verifierade legala vinstvägar och kan förlora om basen lämnas oskyddad. Ingen blockerande balansändring behövdes för denna arena. Det är en deterministisk spelbarhetskontroll och två naturliga Normal-matcher, inte statistiskt bevis på jämn styrka. Järnklanens +HP/wood-avvägning kräver mer gold och tar längre tid; försvarshållning/raseri, attackerade workers och resursskötsel påverkar utfallet. Enemy-units har fortfarande den äldre svagare stridsprofilen och aktiverar inga förmågor; enemy-production använder en ändlig startbudget. Verklig enemy gathering kommer i RTS-071.

Mjuk separation är inte full collision avoidance, andra browsermotorer/mobil och akustisk lyssning är ej verifierade, och befintlig bundle-varning kvarstår. [Tidigare releasekontroller](RELEASE_CHECKLIST.md) och [performanceprofil](PERFORMANCE.md) gäller sina dokumenterade byggen; ingen ny FPS-garanti påstås här.

## Uppföljning RTS-071

Rapportens tidigare RTS-070-resultat avser budgetmodellen innan verkliga
fiendearbetare. Efter RTS-071 delar två enemy-workers noderna och betalar
produktion genom levererad income. Efter dokumenterat +20s till första
gruppanfall passerar samma 30 fraktions/scenario/difficulty-vinstfall och
15 release-basfall med oförändrad spelarstrategi. Ledger inkluderar nu
fiendens verkliga extraktion. Ingen ny naturlig fullmatch eller statistisk
fraktionsbalansstudie genomförd; browser verifierade ekonomi/save/restart
med accelererad klocka och riktiga starter.
