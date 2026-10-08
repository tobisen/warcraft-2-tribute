## 2026-10-08 — Release0.5.0 in progress

User explicitly authorizes the next release. Product/package/lock0.5.0
and new Changelog describe completed RTS-220–229. Existing Pages workflow
and release practice are reused; no new roadmap/terrain/cleanup work.

Clean clone excludes user CSS/units.mjs/docs/:memory:.ses. Full1795/206
PASS553.39s, unit511/89 PASS22.83s, strict build867ms PASS. Production
Native800/1280 and1600 Native/Fit PASS0runtime/asset errors for version,
Changelog, Scout/Ballista TechTree, campaign/skirmish/team/spectator
fixtures, pause/Save/Load/replay/menu/fullscreen/resolutions/reload.
Candidate reports /private/tmp/w2t-release050-local/browser.json.
Existing size budget is exceeded (~64MiB dist,2.06MB JS/540208bytes gzip),
recorded without claiming budget PASS. Human balance/listening and animation
direction coverage remain concrete limitations.

Release commit, exact rebuild and actual CI/Pages/public verification follow
below before publication Done. Older release-paused text is historical.

## 2026-10-08 — RTS-220–229 current delivery

The full requested scope is implemented. Dedicated Aviary produces every
aircraft; dedicated faction Siege Works produces Catapult and the new
Ballista. Stable/cavalry artwork was replaced with painted assets matching
the approved style. Healer, Giant, Scout, tower specializations, heavier
aircraft prerequisites/stats, role research, Submarine/detection, and both
existing neutral bosses are integrated with production, AI, UI and Save.

Task commits: cavalry15bd869/artd4ed302/CIb9a2939; healer a683049;
giant7c7bfca; scout/Aviaryd2f2e10; towers1101e38; heavyAir40e9591;
research1d6b000; SiegeWorks/Ballista7bcba02; Submarine0d2e5b1.
RTS-228 is Done and pushed: `c157717`. CI follow-up `5851044` is pushed and actually green on GitHub.

GitHub verification is now complete: [Actions37764843004](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37764843004)
for `5851044` passed npm test, strict build and the existing Pages deployment.
Code/gameplay delivery `c157717`; targeted CI deadline fix `5851044`, both
pushed to origin/main. The prior failed run37762745212 is superseded, not
reported as green. No new version/release task or live Pages browser check
was performed. This final update is Markdown only: code checks and browser
evidence above are reused explicitly; text/link/diff checks are new.
The mandate through RTS-229 is complete; no further task is started.



Final local verification: npm test1795/206 PASS597.61s; npm run test:unit
511/89 PASS25.59s; npm run build (strict TypeScript included) PASS610ms;
git diff --check, test classification and browser-script syntax PASS.
Native800 both boss encounters PASS0pageerrors after final projectile fix.
First full run1794PASS/1FAIL574.46s is historical, not the final result.
Final self-review covered scoped projectiles, fog, paid producers, owner
reward ledgers, attack references, save migration and readable world labels;
no unresolved blocking findings. GitHub status after final push is recorded
separately; local green results do not imply CI success.



Native800 browser exercises all five factions' paid actions, queue/rally,
Tech Tree, Save/Load/Restart for the new roles. Both guardian encounters
use actual mouse attack and worker collection. Fixtures use tracked cheat
funding, seed prerequisite tech/producers and stage legal unit positions;
they establish UI/system behavior rather than natural match balance.
Mechanics: [GAME_DESIGN.md](GAME_DESIGN.md). Browser evidence:
[cavalry art](artifacts/rts-220-art/browser.json), [healer](artifacts/rts-221/browser.json),
[giant](artifacts/rts-222/browser.json), [Scout/Aviary](artifacts/rts-223/browser.json),
[towers](artifacts/rts-224/browser.json), [heavy air](artifacts/rts-225/browser.json),
[research](artifacts/rts-226/browser.json), [Submarine](artifacts/rts-227/browser.json),
[boss workers](artifacts/rts-228/browser.json), [siege](artifacts/rts-229/browser.json).

Concrete limits: painted four-pose units, mirrored west/shaded north and
existing/reused sounds; no new human listening or human balance/playtime
sign-off. Existing terrain layouts and optional boss/victory separation
remain. No new version, release task, map rebuild or cleanup is started.
Existing Pages workflow runs on code push; its result is reported separately.
Preserved user changes: src/style.css, assets/sources/units.mjs, docs/ and
:memory:.ses. They are excluded from these task commits. No delegation.

# RTS-212 — två valfria väktare,2026-10-07

Bramblemaw/Frontier och Gravelheart/Highlands har egna transparenta original-
sprites, namn/HP/combatposes, synligt hemområde och engångsskatt. Befintlig
combat/projektiler/fog/spawnstorlek används; separat guardianstate håller dem
utanför enemyproduktion, grupper, statistik och kampanjvictory. Save65 täcker
HP/cooldown/engagement/claim och migrerar64. Riktade spells är undantagna;
vanliga attacker och buffs på egna trupper fungerar. No broad map/refactor.

Riktade75/7, collision13/2, slutliga39/4, unit507/87 och strict build PASS.
Native800 båda kampanjmöten PASS med fysisk attack,14 betalda normaltrupper,
finansierings-/stagingfixture, faktisk combat, wounded/claimed Save/Load och
restart. Båda sprites/strid/corpse/loot visuellt granskade. [Belägg](artifacts/rts-212/browser.json).
Slutlig fullregression1682/196 PASS542.56s; byte-identisk boss-onlyexport,
länk/syntax/diff och egen review PASS.212 Done. Inga nya
ljudassets; tidigare användargodkända ljud återanvänds. Ny agentljudlyssning,
naturlig matchutforskning och mänsklig balansbedömning har inte gjorts.

Föregående219/993a637:s [CI37642322214](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37642322214)
är röd på infrastrukturfelen "job was not started ... failed to be acquired
(5 attempts)": inga tester/build startade. Ny212-CI/Pages ej verifierad.
Workflow ändras inte utifrån ett runner-tilldelningsfel.213/release samt
208–211 startas inte; användarens CSS/units.mjs/docs/ bevaras.

---

# Gameplayfas RTS-195–204 — avslutad2026-10-06

Slutlig fullregression1586/186 PASS472.93s, unit475/85 PASS19.65s, strict build PASS och slutlig fysisk Chrome Native800/1280 PASS. Akademin/nivå II integrerar building/worker/navigation/repair/targets/destruction/AI/team/fog/minimap/UI/Save. Alla fem fraktioners melee/armor/workeravgränsning/academyHP täcks. Två nya legacy-storyadmissionsfall skyddar introduktionsuppdragen. Paid campaigngenomspelningar och gamla koordinatversioner ingår i fullregressionen; mänsklig balans/tid är separat.

450 tidigare byggnadssprites behållna pixel för pixel,40 egna transparenta fyrastegs academyframes tillagda; reproducerbar building-onlyexport på tre byte-identiska artifacts. Slutlig browser ger betalt bygge, faktiskt workerarbete, både nivå II och SaveLoad under paid research samt två/en byggrader. Alla fem academyvarianter och native800/1280 visuellt granskade. Före/efter, commitlista och gränser i [GAMEPLAY_PHASE.md](GAMEPLAY_PHASE.md), rådata artifacts/rts-204.

Review hittade och korrigerade legacy-storyadmission, gamla atlasbounds/count, native paletteavvikelse, enemyacademyHP fallback, Save56-fixture med moderna skatter och genomspelningsbottens nivå-I-val. Första fullregressionens två fel och omkörning redovisas i DEV_LOG/HANDOFF; ingen misslyckad kontroll räknas PASS. Inga kvarstående blockerande reviewfynd. Ingen ny CI/Pages/ljud-/mänsklig matchbalans hävdas. Native akademier är egna kodmålade pixelvarianter; ingen ny roster eller separat kampanjbalansetapp. Bundlevarning kvarstår. Användar-CSS/unitkällor/docs bevaras. Stanna efter204.

---

# Kartfas RTS-191–194 — verifieringsgränser2026-10-06

Individuella träd, gruventré/klickpolygon/djup, gemensam verklig terräng och128² geometri finns på samtliga nio kartor. Browserinput, Save/legacy, navigation/collision, gruvåtkomst, minimap och koordinatberoende kampanjpunkter har riktade belägg. Spelkodens unit472/85 och strict build PASS; slutlig fullregression1528/181 PASS523.12s efter två korrigerade navalcontrollers. Detaljer och bilder i [MAP_PHASE.md](MAP_PHASE.md), [HANDOFF.md](HANDOFF.md) och [DEV_LOG.md](DEV_LOG.md).

Chrome793träd/18workers visar~59.4fps/4.1ms median/4.6ms p95 över~300 varma frames. Detta stöder kort spelbarhet i tät skog på testmaskinen; det är ingen långtids- eller hårdvarugaranti. Kampanjtesternas betalda ersättningsanfall är teknisk completion, inte mänsklig balans-/tidsgranskning. Historiska CI/Pages/ljud- och releasebelägg återanvänds inte som ny kontroll. CSS/docs bevaras. Fasstopp efter194.

---

# RTS-188–190 — Grafik och tydligare spelyta (2026-10-06)

Lokala belägg:188 full-width Native800/1280/1920 och Fit800, Mission→paus→Back/Escape samt Menu→Tech tree→Resume PASS.189 alla fem faction-land/byggnad/sjö/flyg-gallerier båda teams, uttömmande runtimeframe-coverage och faktisk paid flygproduktion/selection/flight/SaveLoad vid800/1280 PASS.190 fysisk djurinspection/hunt/damage/death/SaveLoad/restart/warship hunt vid800/1280 PASS. Ny unit476/86 och build med strict typecheck PASS. Fullregression1497/180 PASS391.02s; reproducerbar full assetexport16 PNG/JSON bytevis oförändrade PASS.

Review korrigerade fel cellgränser/disconnected grannfragment i genererade ark och transparenta marginaler. Användaren godkände bildstilen. Mark/sjö/flyg har nya motiv, medan native construction/walls/gates kvarstår. Grundposerna är SE; övriga riktningar använder spegling/skuggning. Ingen claim om åtta separat målade perspektiv, kompletta casting-/death-sheetanimationer eller mänsklig balans-/ljudgranskning. Alla facing-nycklar och befintliga body/HP/footprint/fog/Save-regler är bevarade. Källor och promptset finns i [visual-refresh](assets/sources/visual-refresh/README.md).

Äldre155-tester jämförde med ersatta kodsprites. Source-jämförelser följer nu den nya adaptern; geometri/alpha/clip/HP/team/unik roster/nycklar/anim valideras fortfarande. Native palette-only-krav behålls för terräng, resources och construction; nya rastermotiv tillåter källpaletten. Åtta facing-keys innebär minstfyra härledda vyer, uttryckligt i sourceprotokollet. Detta är ett visuellt kvalitetssteg, inte ett påstående att alla perspektiv är slutligt handanimerade.

Användarens style.css/docs bevarade och undantagna från commits. Browserbeläggen använder lokala CSS-arbetskopian; inga nya CI-/Pages-belägg hävdas. Historiska RTS-180-releasebelägg nedan är separata.

---

# RTS-182–187 — Ny teknisk slutgranskning2026-10-05

Full regression1489/178, unit468/84, strict build/diff/manifest/länkar PASS. Riktade/native browserflöden för fem campaignraser, scoped Save/replay/progression, content/hotkeys och två verkliga AI-aktörer med olika difficulty/profile/team PASS vid800/1920/3440. Highscorefilter/tabell/legacydatum och3840-rendering/fullscreen/windowläge verifierade separat. Se [HANDOFF.md](HANDOFF.md) för exakta belägg, commits och harness.

Slutgranskningen rättade identiska rubriker för separata AI-config-scoregrupper. Tidigare positiv B-hotkeyrapport var för tidig: fixture saknade resurser; korrigerad explicit100wood/återställning och actual fysisk B→Escape plus negativa hotkeys passerar. Första fullkörningen och misslyckade browserharnessförsök räknas inte som PASS. Inga återstående blockerande kodfynd i granskad diff.

40 nya missionsvarianter är fixture-/queue-/Save-testade, inte40 hela betalda eller mänskliga genomspelningar. Mänsklig tempo/balans/ljudgranskning och tidigare återstående assets kvarstår. Ingen ny CI/Pages-verifiering;180:s releasebelägg är historiska. Användarens CSS/docs bevarade. Fasen avslutas efter187.

---

Historisk kvalitetsinventering nedan.

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


## 2026-10-08 — Release0.4.0: slutlig lokal regression grön

Releasecommit02e2396 är pushad till origin/main. Exakt separat checkout med
användarens lokala CSS/units.mjs/docs/:memory:.ses exkluderade verifierad:
`npm test`1706/199 PASS830.01s efter rättade gamla stockassertions. Detta ersätter
den tidigare lokala fullsuite-felkörningens aktuella status; den behålls som
korrekt felsökningshistorik. Unit511/89 PASS och strict build PASS (slutlig
precommit615ms; exakt releasebuild efter commit också PASS). Node_modules från
samma lock återanvänds lokalt; CI gör npm ci. Browser på exakt0.4.0/Build02e2396
800/1280 samt1600 Native/Fit PASS för version/changelog, kampanj/lag/skirmish,
Save/Load, pause/replay/menu/fullscreen/upplösningar/reload/assets. Tomma
isolerade kontexter, enbart testsparningar; inga runtime-/assetfel.

[Faktisk releasepipeline](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37692443176)
är fortfarande pending bakom äldre98128bc/37687789454. Ingen CI/Pages-PASS eller
publicerad0.4.0 hävdas ännu. API-inloggning saknas för att avbryta den äldre
körningen; credential lookup gav ingen credential och visade inga hemligheter.
RTS-213 förblir In Progress tills faktisk publicering är verifierad.
Ingen ny roadmaptask eller GitHub-release/tagpraxis startas; befintlig
produktversion/Pages-praktik gäller. Återstående mänsklig kampanjtid/balans och
temporär enhetsgrafik är fortsatt dokumenterade begränsningar.


## 2026-10-08 — Release0.4.0 publicerad och verifierad (RTS-213 Done)

[Spela0.4.0](https://tobisen.github.io/warcraft-2-tribute/) visar faktiskt
**v0.4.0 / Buildd003daa**. Slutlig [CI/Pages37696240941](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37696240941)
är SUCCESS för samma SHA: npm ci, full npm test (879s), strict build och deploy
PASS. Deploy avslutad2026-10-08 00:48:07 svensk tid. Första0.4.0-kandidaten02e2396
var också grön37692443176, men d003daa inkluderar den faktiska32×32-previewfixen.
Äldre98128bc-körningens failure och pending-noteringarna ovan är historik,
inte aktuell releasestatus. RTS-213 Done; inga nästa roadmaptasks startas.

Ny verifiering: lokal full1706/199 PASS830.01s på02e2396; efter den enda scen-
previewändringen återanvänds gameplayresultaten och exakt slutcommit kör full
regression i CI till PASS. Lokal slutlig unit511/89 PASS13.69s, exact release
strict build529ms, manifest/script-syntax/diff/review PASS. Medveten befintlig
bundlevarning kvar. Separat checkout exkluderar lokala användarändringar.

Faktisk public production-browser på samma slutbuild:800/1280 samt1600 Native/
Fit PASS för version/changelog, kampanj/lag/skirmish-resultatfixtures, selection,
pause, Save/Load/replay/menu, fullscreen/upplösningar, reload och PNG/audio-HTTP.
Fyra rapporter visarv0.4.0/Buildd003daa,0runtimefel och0failed assets.
Extra public800/1280 PASS: faktiskt32×32 wall/gate-preview, byte till64×64
barracks/farm och tillbaka, tre intilliggande betalda byggplatser via musklick,
Enter/Apply fogcheat/resourcecheat och goldstock>=1500. Separat public Next
Mission800/1280 PASS: victory→successor, bevarad identitet/SaveLoad, defeat/final
hidden och replay. Alla kontexter tomma/temporära; endast egna testsaves.
Första två extra public-harness startade före fjärrassets/bootstrap var klara;
/tmp-varianter väntar networkidle före menyklick och passerar. Ingen produktkod
ändrad efter slutcommit. Public800-resultat och1280-previewbilder granskade.

Public JavaScript index-5bSU7xkd.js är byte-identisk med lokal exact build,
SHA2567265847a900f3666d5e8cd63c7b0249328ddf88f64bce0e968ec2642e2002b1a.
Public CSS index-B3bLsssL.css också byte-identisk,
SHA256b062f3e0d0aabf4c0d5c9a9223672d239b27ef74749a9b97e32702f302b0024b.
Browser/hashes-underlag finns i /tmp/w2t-release040-public/browser.json och
/tmp/w2t-release040-public-hashes.json; kommandon återanvänder scripts/check-release.mjs
och scripts/check-placement-preview.mjs med explicit release-URL/version/build.

Mänsklig kampanjtid/balans och kvarvarande temporär artwork är fortfarande
begränsningar; tekniska fixtures/simuleringar ersätter inte mänskliga helmatcher.
Tidigare ljudgodkännande från användaren består; ingen ny agentlyssning hävdas.
Slutuppdateringen ändrar enbart Markdown och återanvänder ovanstående faktiskt
passerade kodchecks. CSS/units.mjs/docs/:memory:.ses bevaras och lämnas utanför.
Befintlig Pages-praktik/version/changelog används utan ny tag/releaseinfrastruktur.
