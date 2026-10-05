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

## RTS-179 — Ny kampanj- och presentationsgranskning 2026-10-05

Ny verifiering på178:s kampanj plus179:s fogoptimering; äldre151-belägg ovan är
historiska. Samlad slutlig53/6 PASS innehåller alla åtta Beginner/Normal-missioner
med betald produktion, faktiska order/landstigningar och fas-/resultat-Saves.
First Steps är tryckfri introduktion. Forest Watch/Outpost ger preparation och
exploration före finite waves; Beginner minskar antal och senarelägger start.
Forest Watch har längre intervall; Outpost behåller sina authored intervall.
HP, movement och kostnader är oförändrade. Övriga missioner behåller paid AI eller fasta två guards.
Inga fler bank-/HP-/coständringar motiverades av dessa scenarier. Återhämtning
betyder återbyggnad/träning med finite resurser; kurirförlust är explicit defeat.

Chrome native800/1280: tio kampanjfall över alla fem raser; fysisk workerselect,
högerklick move, F6hold och fysisk Stop med bibehållen selection. Synliga ikoner
laddade för rätt ras och ligger inom bottom bar. Engelska phasegoals synliga utan
dold enemyposition/stock. Elf/Dwarf800 och Goblin1280 samt stress128-bilden
visuellt granskade; artifacts/rts-179 har tio UI-bilder, två stressbilder och JSON.
Frontier behåller godkänd sammanhängande skog; Highlands/Islands/Coast har äldre
terrängpresentation och befintliga sprites. Ingen ny assetkvalitet hävdas.

Faktisk appaudioinstans:18 assets decode, ingen PCMsample >=1 (maxpeak cirka.467),
standardmaster.65/effects.7/music.35/voices.65; context suspended och phase paused
vid paus. Detta är teknisk nivå-/laddningskontroll, inte mänsklig mixlyssning.
Tidigare användargodkännande av kartor/djurljud kvarstår; egna slutliga voices och
flygaranimationer samt ny lång stridslyssning är fortfarande kvalitetsbegränsningar.

Prestandafynd och åtgärd: fog gjorde redundant LoS för varje överlappande observer.
Celler som redan är synliga för samma ägare i samma frame behöver inte en andra
LoS. Per-frame/per-owner union bevaras; tests verifierar occluders, ground/air,
reordered observers, borttagning och explored memory samt team/Spectator.

| Explicit Highlands3072 load | CPU p95 före → efter | FPS före → efter |
| --- | --- | --- |
|64 combat units + base|16.1 → 9.4ms|49.7 → 60.0|
|128 combat units + base|50.1 → 18.9ms|23.3 → 50.9|

150+ frameprover efter30 warmup i headless Chrome på denna dator. Extra HP/units
över supply används uttryckligen som stressfixtur. Inte betald armé, mänsklig
långmatch eller generell hårdvarugaranti. Baseline/efter i performance JSON;
profileringen visar faktisk Scene.update och frame-tid, inte bara kodantaganden.

**Mänskligt speltest återstår:** faktisk20–40min/mission, upplevd svårighet,
underhållningsvärde och längre mixlyssning. Särskilt waveuppdragen riskerar kortare
tid.179 slutför teknisk granskning enligt användarens uttryckliga tillåtelse att
dokumentera mänskligt test som återstående; dessa aspekter markeras inte verifierade.
Slutlig unit461/83/build/typecheck/diff PASS, full release-regression i180.

## RTS-180 — Lokal release0.3.0 och publiceringsförberedelse

Versionen kommer från befintlig gemensam release.ts; package/lock är0.3.0 och
versionsregression jämför dem. Changelog bevarar0.2.0/0.1.0 som historik och
anger uttryckligen temporary flyers och mänsklig qualitypending. README beskriver
phasegoals, order/Shift, relationer, spectator, Save51 och faktiska kartval.

Slutgranskning hittade en highscore-regression från178:s tre nya kartval:
validatorn accepterade bara Arena för dessa missioner. Avgränsad fix accepterar
planens authored map från config51 och framåt, samtidigt som gamla kartor/records
bevaras. Tre nya result/dedup/legacy-rule-testfall och riktig Frontier-resultpost
i browser täcker detta.29/3 riktade PASS. Den första fullregressionen1455/176
PASS408.19s gäller före scorefix; därför körs en ny full slutregression på final
kod. Ingen omkörning enbart för Markdown.

Final lokal production-browser på Pages-base: fyra native/fit-cases vid800/1280/
1600, sex render-resolutionval, fysisk fullscreenEnterExit med bevarade settings,
physical selection/pause/Save/load/replay/menu. Explicit completed-phase fixture
går till campaignVictory; resultat fryser simulation och registrerar exakt en
faktisk match-ID-post. Skirmishdefeat och lagSpectatorSaveDefeat har egna fixtures;
meny rensar multi/campaign-state.18 audiofiles och34 asset-URLs laddas, reload
behåller version/displaysettings, inga HTTP-/browserfel. Aktuella localbilder i
artifacts/rts-180/local granskade, inte ersättning för179:s paid completion.

Pages-workflow oförändrad: npm ci/test/build, dist-artifact och befintlig
Pages-deploy med OIDC/pageswrite. Vitebase/producerade HTML assetpaths verifierade
som/warcraft-2-tribute/, inga/asset-rootläckor eller nya hostingtjänster.
178CI/Pages37350880157 och17937352527511 är faktiskt success.180:s nya publicering
är ännu inte verifierad; status uppdateras efter releasepush. Lokala userCSS/docs
är bevarade och ingår inte i releasecommits/publicerad CSS.

Slutlig scorefixkod: full1458/176 PASS415.95s, unit465/84 PASS10.76s, strict
typecheck/build PASS388ms, manifest/länk/diff PASS. Dessa är nya releasebelägg;
första1455-körningen ovan är uttryckligen pre-fix. Ny production-browser kräver
en faktisk sparad match-ID-post för moved-map-campaign och verifierar dedup.
Public0.3.0-deployment/browser kvarstår före Done.


## RTS-180 — avslutad publiceringskontroll, 2026-10-05

Releasecommit6a96227 pushad utan force. Faktisk [CI/Pages37355621323](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37355621323) SUCCESS: full test620s, build och deploy gröna. Publicerad sida visar v0.3.0 / Build6a96227. Fyra public-browserfall Native/Fit passerar kampanj/save/load/result/replay, skirmishdefeat, lag-spectator/save/defeat/statistik, pause/menu cleanup, resolutionsval, fullscreen och reload.34 asset-URLs/18 ljudfiler per fall, inga HTTP-/browserfel. Första800-kontrollen hann först bara nio ljudförfrågningar; kompletterad kontroll väntar uttryckligen på alla18 och passerar. Ingen spelkod ändrad för detta. Publicerade resultatvyer visuellt granskade. [Mätprotokoll](artifacts/rts-180/public.md).

Terminala mål/eliminering är fixtures, inte mänsklig genomspelning.179:s betalda åtta Beginner/Normal-genomspelningar är separat belägg. Mänskliga20–40min/timing/balans/fun/lång mixlyssning och tidigare slutliga flygar-/voiceassets återstår. Dessa markeras inte verifierade. Tidigare pending-publiceringstext ovan beskriver läget före releasepush och ersätts av denna slutstatus.

Slutlig kodverifiering: full1458/176 PASS415.95s, unit465/84 PASS10.76s, strict typecheck/build PASS388ms, diff/manifest/länkar PASS. Slutöverlämningen ändrar endast Markdown; ingen ny test/build-körning, beläggen återanvänds för oförändrad kod. HANDOFF/BACKLOG/README/QUALITY_REVIEW uppdaterade, stopp efter180 utan nya tasks/karteditor. UserCSS/docs bevaras och ingår inte i publicerad kod.
