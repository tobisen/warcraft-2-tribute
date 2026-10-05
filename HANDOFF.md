# RTS-186 klar

185 push7b7e9fc;186 flöde/innehållsspärrar klar. Riktade138/12, unit468/84, strict build/diff och fem raser×800/1920/3440 browser PASS. UI+gameplay+hotkeys spärrade; positiv hotkeykontroll.40 nya taktiska mål/queues fixturetestade, inte40 mänskligt/betalt genomspelade kampanjer. Nästa187 flera AI-menyn och slutregression. CSS/docs bevaras.

# RTS-185 klar

184 push289cc9f;185 fem separata kampanjer/Save52 klar. Riktade88/6, unit468/84, strict build/diff och Chrome1920 fem starts/SaveLoad/isolation PASS.40 saveidentiteter testade; ingen40-kampanjgenomspelning/mänsklig balans. Nästa186 flöde/innehållsspärr. Legacyv1 sparad utan gissad ras/difficulty. CSS/docs bevaras.

# RTS-184 klar

183 pushc3f691b;184 ultrawide/window klar. Riktade21/4, unit468/84, strict build/diff och Chrome800/1920/3440/3840 PASS. Kort≈60FPS startmatch, ingen massarmégaranti. Nästa185 separat progression. CSS/docs bevaras.

# RTS-183 klar

182 push90df09f;183 tabell/filter klar. Riktade23/3, unit467/84, strict build/diff och Chrome800 filters/legacy/empty PASS. Nästa184. CSS/docs bevaras.

# Aktuell fas RTS-182–187

182 Done;183 nästa. RTS-180:s releasebelägg är historiska.182: riktade9/3, unit466/84, strict build/diff och Chrome800/1920 home/skirmish/HUD PASS. CSS/docs bevaras. Ingen ny CI/Pages.

# Överlämning RTS-181 — startinställning

2026-10-05: avgränsad senaste begäran klar. Första start använder1920×1080
och Fit to Window. Sparade upplösningar/lägen bevaras.

Ny verifiering: display/preferences10/2, unit466/84 och build inklusive strict
typecheck PASS. Lokal Chrome800×600/1920×1080: första start, proportionell
appgeometri och sparat800×600/Native efter reload PASS utan pageerrors.
Diff granskad; befintlig bundlevarning kvar. Ingen ny CI/Pages-verifiering,
full match-/kampanjregression eller screenshotgranskning. CSS/docs bevarade.
Bilagans bredare meny-/kampanjförbättringar återstår; detta uppdrag är avgränsat
till startinställningen. Inga andra tasks påbörjade.

Nedan historisk RTS-180-överlämning; dess releasebelägg är inte ny verifiering.

# Överlämning RTS-177–180 — avslutad och publicerad

Datum: 2026-10-05.177–180 Done. Stanna efter180; inga nya roadmaptasks eller karteditor.

- **177** `8fafce5`: åtta kampanjmissioner inventerade och designade i CAMPAIGN_DESIGN.md.
- **178** `598478f`: sju utökade fasplaner, permanent progression/Save51, legacy/replay bevarade.
- **179** `686c1e6`: betalda Beginner/Normal-genomspelningar, fem rasers UI/audio och avgränsad fogoptimering.
- **180** `6a96227`: gemensam0.3.0-version, changelog, releasechecks och scorefix för flyttade kampanjkartor.

## Faktisk verifiering

Samlad179-kampanj/fog/load53/6 PASS: alla åtta Beginner/Normal genom betald automation,
fas-Saves och landstigningar. Browser800/1280 för fem raser kontrollerar fysiska
order/ikoner/HUD och18 decoded audioassets; riktig appinstans paused/suspended.
Kort Highlands64/128-stress:60.0/50.9FPS, CPU p959.4/18.9ms. Ingen generell hårdvarugaranti.

Slutlig full regression1458/176 PASS415.95s, unit465/84 PASS10.76s, strict
TypeScript/build PASS388ms; diff/manifest/länkar PASS. Lokal production-browser PASS.
[GitHub CI/Pages37355621323](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37355621323)
faktiskt SUCCESS: npm test620s, build och deploy gröna.

[Publicerat spel](https://tobisen.github.io/warcraft-2-tribute/) visar **v0.3.0 / Build6a96227**.
Fyra publicerade Native/Fit-fall: kampanj/save/load/result/replay, skirmishdefeat,
lag-spectator/save/defeat/statistik, pause/menu cleanup, sex resolutionsval,
fullscreenEnterExit och reload.34 asset-URLs/18 ljudfiler i varje fall; inga HTTP-
eller browserfel. Slutfaser/eliminering är explicita fixtures; faktisk betald
missioncompletion kommer från179. Resultat registreras exakt en gång och fryser
simulation. Närbilder/resultat granskade lokalt; [mätprotokoll](artifacts/rts-180/public.md).

Den slutliga överlämningen ändrar endast Markdown. Ingen ny kodverifiering körs;
ovanstående slutchecks återanvänds eftersom releasekoden är oförändrad.
Dokumentationscommit ändrar inte den publicerade kodens Build6a96227.

## Kvarstående begränsningar

20–40min/mission är designuppskattning, inte mänskligt uppmätt. Mänsklig tempo-/
svårighets-/underhållningsgranskning och ny längre mixlyssning återstår.
Slutlig flyerart/animationer, vissa caster/navalassets och egna voices återstår.
Kartor/djurljud är tidigare användargodkända; Frontier har ny sammanhängande terräng,
övriga kartor äldre presentation. Tre spelare endast Plains96/128 skirmish;
ingen campaign-teamkonfigurator, nya depots eller gratis rescue-arméer.
Användarens src/style.css och otrackade docs/ är bevarade och inte committade.
CSS SHA25695c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e.
Publiceringskontrollen använder faktiskt publicerad, committad CSS.

---

Historiska överlämningar nedan, ersatta av denna aktuella etapp.

# Överlämning RTS-174–176

Datum: 2026-10-05.174–176 Done.174/175 är pushade;176 levereras i taskcommitten `RTS-176: resolve team outcomes and support eliminated spectators`, vars hash redovisas i slutrapporten efter push. Stopp före177; inget fortsatt roadmapmandat. Ingen delegering.

- **RTS-174 `416cfa9`:** stabila spelar-ID:n, två självständiga AI-ekonomier/produktion/tech/AI/fog, separata raser/färger, AI-mot-AI-strid, validerade starter, matchinställningar/statistik och Save48.
- **RTS-175 `0a5b422`:** lagval, aktuell/utforskad lagvision, egen ekonomi/supply/tech/kontroll, gemensamt allied-skydd för attacker/spells/splash, friendly ground spells, allierad passage genom öppna portar och AI-försvar av observerade hot nära allierad bas. Save49.
- **RTS-176:** individuell baseliminering och lagutfall, stoppad eliminerad aktör, begränsad spectator med synlig status/minimapkamera/paus/save/leave, separat resultatvy med player-/teamstats och idempotenta roster-partitionerade highscores. Save50 migrerar även49:s äldre individuella utfall till korrekta lagutfall; aktuell vision bygger på levande lagobservatörer. Överlevare står kvar inerta utan syntetiska losses/dismissals/kills. Restart/menu rensar live-state.

## Verifiering

174: riktade97/6 + modifiers31/3, unit461/83, build inklusive strict typecheck/diff PASS.175: riktade152/8 + sista43/3, unit461/83, strict build/diff PASS.176: retirement/order/spell93/9 och sista Save-migration62/6 PASS; slutlig unit461/83 PASS13.93s, strict build PASS378ms och diff PASS. Manifest83 unit/90 integrationfiler validerat. Full etappregression på slutlig kod PASS:1426 tester/173 filer,609.57s. De två avbrutna fullkörningarna räknas inte som PASS. De avbröts efter konkreta reviewfynd om pensionerat AI-basminne respektive Save49-lagutfall.

Native Chrome800/1280 PASS: [174](artifacts/rts-174/browser.json) två betalda AI-banker/strid/ägare/Save/restart; [175](artifacts/rts-175/browser.json) faktisk teammeny/lagvision/ingen allied-kontroll eller attack/friendlyheal/port/save; [176](artifacts/rts-176/browser.json) allied-eliminering med fortsatt human, human-eliminering med faktisk framåtrörelse/konstruktion hos ally och frysta humanunits, spectator/minimap/rightclickspärr, fysisk paused SaveLoad inklusive config49-migration, victory/defeat, separat statistik, frozen ended simulation, endast en highscorepost, tre restarts och quit som rensar roster/clock. Representative settings800/AI-colors1280, teams800/shared-vision1280, victory800 och spectator800 granskade visuellt. Explicita fixtures och ordinarie updateMatch/Scene.update; ingen mänsklig helmatch-/FPS-mätning eller ny publik Pages-browser hävdas.

Faktisk GitHub fulltest/build/Pages: [174](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37321500841) och [175](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37324774940) SUCCESS.Ny176-CI efter taskpush redovisas separat i slutrapporten; inga äldre CI-belägg gäller automatiskt för den.

## Begränsningar och nästa steg

Tre spelare erbjuds endast på Plains96/128 skirmish; övriga kartor har två validerade platser. Inga nya samtidiga campaign-objectives eller delad ekonomi/kontroll. Friendly spells gäller allierade markenheter enligt befintliga spellvillkor; repair/gatekontroll förblir egna. Öppna portar släpper igenom allierade, stängda blockerar alla. Äldre49-defeat med levande allierad kan laddas som fortsatt spectator; äldre playing med enbart eget lag kvar blir victory.

168–173 ochPRIO01–04 är historiskt Done. Final flygargrafik/animationer, vissa caster/navalassets, mänsklig balans/FPS och äldre återstående ljud-/röstunderlag kvarstår enligt tidigare överlämning; inga nya assetclaim. Kartorna och djurljuden är användargodkända. Dessa blockerar inte174–176.

Användarens ändrade src/style.css och otrackade docs/ bevarade/undantagna från taskcommits. CSS SHA256:95c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e. Nästa roadmaptask177 är Todo och får inte startas utan nytt uppdrag.

---

Historiska mandat/belägg nedan är ersatta av överlämningen ovan.


# Aktuellt mandat PRIO-01–04

PRIO-01–04 Done. Användaren godkände kartorna och djurljuden 2026-10-05; ljuden accepteras tills resterande ljudarbete. RTS-174–176 vilande och174 startas inte. Användarens bifogade uppdrag och två godkända terrängreferenser återges i BACKLOG. En task åt gången, verifiering/docs/commit/push; stopp efter04. Ingen agentdelegering.

01: native click avbröts av per-frame textnodeersättning. Stabil actionLabel/HUD-pointerguard, samma callbacks/betalning. Riktade34/6, unit451/80, build inklusive strict typecheck/diff PASS. [Live browser800/1280](artifacts/prio-01/browser.json): faktiska långsamma bygg-/unit-/research-/upgradeklick utan Enter, spärrar/fullkö/hotkeys/exakta kostnader/selection PASS; sex PNG, representativ800bild granskad. Ingen ny helcampaignbatch. CSS/docs bevarade. Ny CI efter taskpush redovisas separat; tidigare grön CI nedan är historiskt belägg.

02:31specifika ikoner per fraktion via rätt sprites/egna commandglyphs, prerequisites och active/producing/disabled. Riktade19/4, unit457/81, build/typecheck/diff PASS. [Ikonbrowser](artifacts/prio-02/browser.json) alla fem fraktioner, native800/1280 kontextlayout utan scroll/klipp;16bilder, worker800/barracks1280 granskade. [Live klickregression](artifacts/prio-02/click-regression/browser.json) PASS.01 push476ddd6 och faktisk CI37304407683 success.02ad2259f faktisk CI37305471122 success.03 referenskarta levererad nedan,174 fortsatt vilande.

03: Frontier reference-layout/original pixelatlas, harvestable connectedgroves/fogmemory/Save46legacy/minimap/land+waterpassages. Riktade75/8 och slutliga60/6+3/1 PASS; unit457/81/build strict/diff PASS. [Fysisk browser800/1280](artifacts/prio-03/gameplay-browser.json) crownselection/gather/depletion/SaveLoad/restart och betald hamn-/warship-fixture PASS. [Skog](artifacts/prio-03/after-forest.png), [kust](artifacts/prio-03/after-coast.png), [översikt](artifacts/prio-03/after-overview.png) visuellt granskade; motsvarande before i samma katalog. Alla12 faktiska tredjepartsreferenser granskade, inget raster kopierat. Endast Frontier spridd; annan layout/äldre saves bevaras. 03push0ab2436 CI37309876585 föll på syntetisk config20-fixtur (ny referensterräng märkt som20). Fixture rättad till faktisk legacygeometri med oförändrade migration/ledger/view-asserts; isolerad riktad1PASS/unit457/81/buildstrict/diff PASS. Korrigeringspushb5a3100: faktisk GitHub37312395555 SUCCESS (fulltest/build/Pagesdeploy).04 nu klar enligt nedan, inga174-starts.

04: Done efter användarens godkännande av djurljuden. Taskcommit med titeln `PRIO-04: interact with neutral wildlife and preserve hunt orders`; hash rapporteras efter push. Neutrala sprite-/huvudklick behåller trupper, visar namn/HP/porträtt och egna tre WAVs; shared0.8s/per-art1s audio-spärr. Hunt/orderkö för land/luft/krigsfartyg återanvänder navigation/vapen/marina attackStep, normal idle efter målcleanup. Djur håller separat HP-state/Save47 och ger inga scores/resources/vision/blockers. Riktade65/8 + slutliga76/6 och unit458/82/build strict/diff PASS. [Browser800/1280](artifacts/prio-04/browser.json) physical huvudclick, inspection/soundrouting/spamlimit, hunt/hurt/death, score, SaveLoad/restart och naval shorehunt PASS; representativ deer800/dead1280 granskade. Sparse health/corpse tillåter fortfarande wandering på sparad clock. Neutral ranged damage är direkt, med attack-/impactfeedback.

**Slutkontroll:** Full regression på slutlig kod PASS:1394 tester/169 filer,588.49s. Löpande Scene.update-browser800/1280 PASS för vandrande huvudklick, jakt/skada/död, normal idle och corpsefade; artifacts/prio-04/live-browser.json. Användaren godkände hjort-, kanin- och rävläten efter länkarna; detta användargodkännande är separat från tekniska PCM/AudioContext-checks. Inga nya kodändringar efter slutchecks; endast slutlig statusdokumentation ändrad. Etappen avslutad; stanna före174. CSS/docs bevaras.

---

# Överlämning RTS-170–173

Datum 2026-10-05. Uppdraget omfattar endast170–173; nästa roadmaptask är174 och startas inte. Ingen agentdelegering. RTS-170–173 är Done.170–172 är pushade;173 ingår i commit med titeln `RTS-173: compose and regroup AI armies`. Dess hash redovisas i slutrapporten och kan hämtas med `git log -1 --format=%h --grep="RTS-173: compose"`.

## Leverans

- RTS-170 `31df7e6`: Hold utan förföljelse, Patrol och Shift-FIFO med32 order, kompakt status, avbrott/targetloss, Save43 och restart. Slutlig173-korrigering väntar på attack-move-slutmål före nästa köorder och adopterar nåbart Patrol-fallbackmål efter hinderändring.
- RTS-171 `bcebde1`: separata kroppssäkra mål för mark/sjö/luft, nåbara alternativ och en bounded multi-goal-BFS per medlem/kommando. Befintlig trafik/separation används under rörelse.
- RTS-172 `4b40f38`: Standard/Defensive/Offensive/Economic skilda från difficulty, datadriven expansion/produktion/försvar/anfall, preferences/highscores/Save44/restart.
- RTS-173: fogbegränsad rollplan för front/ranged/siege/magic/air med egna betalade köer/tech, ett beslut per gameplaysekund, synligt försvar prioriteras av siege och försvagade/blockerade anfall omgrupperas. Befintliga meningsfulla spells och betald naval transport/landning återanvänds. Save45 migrerar44. Ingen ny enemy-warship-AI.

RTS-160–164 är historiskt Done/pushade7d7290c/b7439ae/4658a0d/efbdd7d/874f761;168/16983d01fe/756b768 återimplementerades inte. Dessa historiska belägg är inte nya checks.

## Ny verifiering

Taskvisa riktade tester:170142/14,17158/7,172152/10 PASS.173 targeted104/7 och final68/5 PASS, slutliga ordertester12/1 och air/groupMovement/orders37/3 PASS. Slutlig unit435/79 PASS8.89s; build inklusive strict typecheck PASS356ms med befintlig bundlevarning. Full etappregression1355 tester/163 filer PASS527.48s på slutlig kod. `git diff --check` PASS före dokumentavslut.

Chromium:170 fysisk queue/Hold/Patrol/Stop/avmarkering/SaveLoad/restart800/1280;1714/24 arbetare genom64px öppen port800/1280;172tre profiler×800/1280 med oberoende difficulty/SaveLoad/restart och faktisk betald profilproduktion;173fem fraktioners betalda femrollsproduktion, fog-AA-release, fem meningsfulla casts, siege-towerskada och omgruppering PASS. Representativa screenshots visuellt granskade. Orderflöden återkontrollerade efter173:s orderkorrigering;173-browser återkontrollerad efter sista outside-world-fix.

[170](artifacts/rts-170/browser.json), [171](artifacts/rts-171/browser.json), [172](artifacts/rts-172/browser.json), [173](artifacts/rts-173/browser.json), [orderregression](artifacts/rts-173/order-regression/browser.json). Browserharness använder extern Playwright/Chrome via W2T_PLAYWRIGHT_MODULE/W2T_BROWSER_EXECUTABLE och lokal Vite5184. Explicit bank/tech/supply/camera-fixture används; ingen mänsklig helmatchekonomi eller FPS-mätning hävdas. Ingen skeppad debug-API.

Regressionen avslöjade att testbotens enda Forge-plats blockerades av egen soldier. Botens tre lagliga kända byggplatser och betalda AA vid synligt lufthot löser detta utan ändrade gameplaykostnader, HP, seger-/Save-/ledgerasserts eller deadlines. Första fullkörningen avbröts för konkret orderkorrigering. Nästa1355/163 gav1349PASS/6FAIL: outside-world avbröt pågående flygorder (rättat) och äldre mixed-domain-test krävde idle trots171:s nya fallback (assertar nu kroppssäkra move-mål). Slutregression1355/163 PASS på rättad kod; misslyckade/avbrutna körningar räknas inte som PASS.

## Kvar och stopp

- [Slutlig airgrafik](assets/sources/air-168.md) kvar: godkända TEMP-ikoner/porträtt är statiska, inte slutliga sprites/animationer. [Casting-poser](assets/sources/magic-165.md) och [sjöreferenser](assets/sources/remaining-sprites.md) kvarstår.
- RTS-157 faktisk ljudlyssning och RTS-158 egna/licensierade380 röstinspelningar/lyssning kvar; RTS-159 användaraccepterad Done.
- Mänskligt balansspeltest, naturlig helmatchekonomi och uppmätt prestanda i stora matcher saknas. Normala supply/difficultycaps begränsar samtidiga roller; femrolls-browsern använder uttrycklig bank/tech/cap. Sjö-AI använder befintlig transportinvasion, inte en ny offensiv flotta.
- Täta arbetarnas befintliga cargotexter kan överlappa; kropparnas separata platser verifierades. Ny CI/Pages-publicering och faktisk ljudlyssning har inte kontrollerats i denna etapp.
- Användarens src/style.css SHA256 `95c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e` och otrackade docs/ bevarade, utanför våra commits. main/origin utan force/amend/history rewrite.

Nästa task RTS-174 är Todo och kräver nytt uppdrag. Inga senare tasks har startats.

## CI-korrigering efter överlämningen

Af8ec31:s faktiska [GitHub-körning](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37282536894) fallerade på factionArt-testets5000ms-timeout. Lokal regression ovan ska inte tolkas som CI-PASS. Samma test delas nu i16 animationsfall med gemensam atlas-init och oförändrade uttömmande assertions; timeout förblir default. Riktade17/1, unit450/79 och build/typecheck/diff PASS lokalt. Fix `b79d1fd` pushad. Ny [GitHub-körning](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37300780990) **success**: full `npm test` PASS12m05s, build med strict typecheck PASS, Pages-deploy PASS. Publicerad sida har inte separat browsergranskats i CI-fixen. Ingen gameplay/asset/browserändring,174 fortsatt ej startad.
