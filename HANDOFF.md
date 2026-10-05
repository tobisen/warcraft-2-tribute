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
