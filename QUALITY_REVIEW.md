# RTS-151 – Kvalitetsinventering av version 0.2.0

Inventerad 2026-10-04 på kodbas0d9cf64 (publicerad kod53267ef). Ingen gameplaykod ändrad.
RTS-150 är avslutad enligt releasebelägg i BACKLOG/DEV_LOG, men detta innebär inte
att ljud har lyssnats igenom eller att alla svårigheter är balanserade.

## Metod och begränsningar

Ny Chromiumkontroll:1280×720 och1920×1080, fem fraktioner på Highlands,
Frontier, Coast, Plains96 och Plains128. Fysisk selection/move, betald woodleverans,
minimap/kamerafokus, Save/load/restart och sex upplösningsval. Tekniskt audio:
11 assets laddade, mute/pause fungerar. Browserautomation är inte mänskligt
speltest; ingen faktisk lyssning, stridslyssning eller lång campaigngenomspelning
utförd i151. Visuell granskning av aktuella screenshots i faktisk spelstorlek.
Kodinspektion av selection, displaypolicy, audio och röster kompletterar browsern.

## Prioriterade fynd

| ID / prioritet | Område och konkret fynd | Evidens / reproduktion | Koppling |
| --- | --- | --- | --- |
|151-01 / P1|Farm och forge saknar klickinspektion; nyttan går inte att läsa i selectionpanelen.|Observerat i buildingSelection/selectWorldTarget: endast base/barracks/harbor tillåtna. Klicka passiv byggnad efter byggnation.|152|
|151-02 / P1|Synliga enemybyggnader kan inte väljas för en säker informationsvy.|Observerat i selectionmodellen; enemyhit används för attack men inte vänsterklickinspektion.|152|
|151-03 / P1|Adapt to window ersätter vald renderingsupplösning; separat Fit to Window saknas.|Observerat i displayGeometry och browser. Native fixed resolution finns redan; återanvänd dess nedskalning.|153|
|151-04 / P2|Huvudmeny/browser använder reponamnet som produktnamn.|Observerat i index.html och browserstart.|154|
|151-05 / P1|Workers är mycket små relativt bas och porträtt; verktyg/lagfärg är svåra att läsa på spelplanen.|Visuell observation1280 Highlands och1920 screenshots; bedömning av läsbarhet, inte bevis för felaktiga logiska hitboxar.|155: referensworker/melee/huvudbyggnad i faktisk storlek|
|151-06 / P2|Mark upprepar samma grässtruktur; fogkanter är tydligt tileformade. Walkability/vatten måste granskas med terrängövergångarna.|Visuell observationHighlands/Coast; fog är avsiktlig spelinformation, inte automatiskt ett fel.|156: referenskarta först|
|151-07 / P1|Melee/bågar saknar separata namngivna attackassets; gemensam impactmix begränsar ljudidentitet.|Kod-/assetobservation i audioConfig. Hörbar tydlighet är EJ verifierad.|157: events, avstånd, samtidighet och faktisk stridslyssning|
|151-08 / P2|Repliker är select/order och browser speech synthesis; inspelade röster och separata attack/work/repeated-click-grupper saknas.|Observerat i voices.ts/audio.ts. Uttal/kvalitet varierar sannolikt per browser men detta är antagande tills lyssnat.|158|
|151-09 / P2|Resurslasttext ligger nära träd/unit/selectionringar och kan bli svårläst.|Visuell observationHighlands1280, inte belägg för generell HUD-blockering.|155/156 och179 presentationsgranskning|

## Gameplay och kontroller

De kontrollerade flödena fungerade: unitselection, move, insamling/leverans,
minimap, Home-fokus, Save/load och restart utan browserfel. Ingen ny blockerande
runtimebug observerad. Detta täcker inte fulla strider eller alla campaignprofiler.
Tidigare betalda campaign1–8/fullregressionsbelägg finns i150; de är historiska.
Ingen slutsats om20–40minuters uppdrag dras från dessa korta kontroller.
Formation/trängsel, flera AI och magi är framtida krav170–176, inte automatiskt
buggar i150. Kontrollernas hitmapping behöver ny verifiering efter153.

## Öppna underlag

Humans-designreferensen är inte bifogad i detta uppdrag.155 måste söka tillgängligt
underlag och redovisa om det saknas; dess innehåll är inte rekonstruerat här.
Ljud- och större matchlyssning kvarstår för157/179. Bundlevarningen kvarstår.
Inventeringen ger inga nya features eller bred refaktorering i151.
