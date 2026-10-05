# Aktuellt mandat RTS-174–176

174 Done enligt slutliga riktade97/6, unit461/83, strict typecheck/build/diff och browser800/1280 i artifacts/rts-174. Push416cfa9, faktisk CI37321500841 success.175 Done enligt nedan;176 nästa. Nytt mandat ersätter tidigare paus/stopp efterPRIO04. Bevara användarens CSS/docs; ingen delegering. Efter176 slutlig fullregression/HANDOFF och stopp före177.

Tre spelare stöds på Plains96/128 skirmish; andra kartor fortsatt två. Separata AI-banker/tech/queues/knowledge/fog, FFA relationer, distinct playercolors, cross-AI combat/projectiles och strikt Save48. Lokal browser använder explicit stridsfixture och delvis fryst Scene.update men ordinarie updateMatch, inga nya mänskliga balans-/FPS-/publik Pages-browserbelägg.168–173 ochPRIO01–04 färdiga enligt historiken nedan; tidigare asset-/balansbegränsningar kvarstår.

175 Done: team-ID/menu, shared current/explored vision, individual economy/control, allied immunity (inklusive spells/splash), friendly spells och öppna allierade portar. AI hjälper synliga hot nära allierad bas. Save49. Riktade152/8 och sista43/3 PASS, unit461/83, strict build/diff PASS. Native800/1280 i artifacts/rts-175/browser.json PASS; teams800/shared-vision1280 granskade. Lagutfall/spectator/statistiksummor genomförs i176.

---

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
