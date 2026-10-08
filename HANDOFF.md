## 2026-10-08 — Dragbygge av murar — Done

Välj Wall, håll vänster musknapp och dra en sammanhängande gridlinje;
släpp över spelvärlden för att lägga betalda sites. Vanligt klick lägger en
mur. Första ogiltiga/obetalbara segment stoppar raden; placerade segment
består. Samma arbetare bygger i turordning, med befintliga builderId-fält
över Save/Load, utan ny Saveversion. Stop/orderbyte återstartar inte jobb;
ny placering av fortification frigör tidigare tilldelade mursites. Kostnad,
byggtid, fog, route/producer-säkerhet, grafik och cap32 består.

Riktade `npm test -- src/gameplay/towers.test.ts src/gameplay/gates.test.ts
src/gameplay/construction.test.ts src/gameplay/orders.test.ts
src/presentation/commandFeedback.test.ts`:38/5 PASS10,61s. Slutlig unit515/90
PASS30,61s och `npm run build` inklusive strict typecheck PASS1,30s med
befintlig chunkvarning. Ny unit/build efter synlig draginstruktion och
blur/resize-cancel; bred regression startade före dessa slutliga UI-ändringar.
`npm test`:1805/207 PASS606,94s. Slutliga UI-ändringar verifierades separat
av riktade38/5, slutlig unit/build och browser enligt ovan. Syntax/diff och
dokumentreferenser PASS. Knappordning commit/push ecc2482; murdrag separat.
Båda småsakerna avslutade, inget ytterligare arbete startas.

Faktisk Chrome800/1280 preview/no-early-payment,3paidwalls, första buildorder,
Save/Load, alla tre färdiga via riktig updateMatch, Escape, högerklick,
HUD-släpp och singleclick zoom1,5 PASS0pageerrors. [Browserresultat/bilder](artifacts/wall-drag/browser.json)
via `scripts/check-wall-drag.mjs`; 800-preview/1280-complete granskade.
Byggslutförande är en avgränsad teknisk simulering, inte ett mänskligt
fullmatchspeltest. Review av gameplay/input/save/caps/diff utan kvarstående
fynd. Befintlig style.css/units.mjs/docs/:memory:.ses bevaras. Ingen ny
roadmaptask, version eller separat CI/Pages-/ljudverifiering påstås.

## 2026-10-08 — Logisk knappordning — Done

Fast bygg-/forskningsordning efter prerequisites, med startbyggen och
Worker Tools/basuppgradering först. Train/order-beteende och hotkeys består.
Riktade actionPanel/technologyView16/2 PASS, unit515/90 PASS14,88s, strict
build PASS723ms, diffcheck PASS. Chrome800/1280 faktisk researchbetalning
och två-raders Research PASS0pageerrors; 800-bilder visuellt granskade.
[Resultat/bilder](artifacts/action-order/browser.json),
`scripts/check-action-order.mjs`. Ingen ny bred campaign/fullregression.
Nästa användarbeställda småsak: dra flera murar. CSS/units.mjs/docs bevaras.

## 2026-10-08 — Scoutade bossar/fynd/byggnader — Done

Bossar, skatter, orekryterade karaktärer/hjältefynd och byggnader visas nu
även i explored utan current vision, på karta och minimap. Bossloot omfattas.
Svart outforskad fog döljer dem fortfarande; vanliga fiendetrupper kräver
current vision. Combat/input/rewards/audio fortsätter använda entityVisible;
entityPresented är separat. Befintlig explored-Save återanvänds. Visning
följer aktuell landmark-state, utan nytt last-seen- eller hero-enhetssystem.
Öppnade kistor består; rekryterade fyndkaraktärer försvinner från platsen.

Ny riktad54/5 PASS8,62s, unit515/90 PASS14,07s, strict build491ms och
syntax/diff/länkchecks PASS. Faktisk Chrome800/1280 dark-hidden/scout/retreat,
alla sprites/markörer, ordinary-troop-hidden, ingen remote claim, fysisk
Save/Load/restart och bossloot PASS. [Browserresultat/bilder](artifacts/explored-landmarks/browser.json)
via `scripts/check-explored-landmarks.mjs`; fyra representativa bilder granskade.
Ingen ny bred fullregression/campaign för ren presentation; tidigare1800/207
är historisk verifiering av prestandauppdraget. Befintlig chunkvarning kvar.

User CSS/units.mjs/docs/ och :memory:.ses bevarade. Ingen ny CI/Pages,
release eller roadmaptask; stanna efter detta avgränsade uppdrag.

## 2026-10-08 — Prestanda för stora arméer/byggnader — Done

Användarens avgränsade uppdrag är klart. Framevis kartresursgenerering,
identiska combat-hinderlistor/index, spatiala uppslag, ID-collations och
fogrektanglar optimerade. Grafikkvalitet, assets, upplösning, animationer,
gameplay-/siktuppdateringar och samtliga unit/building-maxtak bevaras.
Ingen roadmaptask, kartombyggnad, ny version eller release startad.

Ny faktisk Chrome155 stressprofil:128 aktörer+32 murar, Native1280×720
(canvas1280×488), update median56,3→14,4ms/p9562,5→18,3ms; observerad
FPS16,81→58,70. Detta är en explicit ovan-supply-fixture, inte betald
utbyggnad eller hårdvaruoberoende FPS-garanti. [PERFORMANCE.md](PERFORMANCE.md)
har före/efter-JSON/bilder och två reproducerbara browserharness.

Slutliga nya checks: full1800/207 PASS524,55s, unit515/90 PASS19,50s,
strict build PASS565ms och diff/länkchecks PASS. Riktade combat/navigation/
approach/separation/gates/traffic67/7 samt extra combat-cachetest8/1 PASS.
Native800/1280 fysisk selection/rightclick/movement, pausad Save/Load,
Tech Tree/Commands/Close/scroll/keyboard och researchlayout PASS.
Gamla/nya GPU-fog-PNG:er byteidentiska vid båda teamen×fyra zoomnivåer.
Slutlig review utan blockerande fynd; ingen agentdelegering.

Befintlig chunkvarning kvarstår. Tidiga harness-timeouts/ogiltig test-speed
är rättade; första fullregressionen avbröts för den belagda andra
optimeringen och räknas inte som PASS. Ingen ny CI/Pages eller mänsklig
match-/balans-/ljudverifiering hävdas. User style.css/units.mjs/docs/ och
:memory:.ses är bevarade utanför leveransen. Stanna efter detta uppdrag.

## 2026-10-08 — Release0.5.0 published and verified

[Play0.5.0](https://tobisen.github.io/warcraft-2-tribute/) actually shows
**v0.5.0 / Buildb957568**. Release commit `b957568` pushed to origin/main.
[Actions37768721009](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37768721009)
passed npm ci, full npm test (789s), strict build and Pages deploy for the
same SHA. Deploy completed2026-10-08 13:28:03 Europe/Stockholm.

New clean local verification: full1795/206 PASS553.39s, unit511/89
PASS22.83s, strict build867ms; exact committed rebuild453ms PASS.
Production browser candidate/exact/public:800/1280 Native and1600 Native/
Fit PASS0runtime/asset failures, version/Changelog/Scout+Ballista TechTree,
campaign/skirmish/team/spectator fixtures, pause/Save/Load/replay/menu,
fullscreen/resolutions/reload and PNG/audio HTTP. These bounded fixtures
are technical checks, not natural human full-match balance or listening.
Actual public800 TechTree screenshot visually reviewed.

Public JS index-CpfwM26v.js is byte-identical to exact local production,
SHA2565022bd9e80911d3aeaa5141f07cbfffb2a607abc61f6cbc65c1be8b4d42984e1.
Public CSS index-B3bLsssL.css also matches,
SHA256b062f3e0d0aabf4c0d5c9a9223672d239b27ef74749a9b97e32702f302b0024b.
Evidence: /private/tmp/w2t-release050-public/browser.json and
/tmp/w2t-release050-public-hashes.json; existing scripts/check-release.mjs
with explicit URL/version/build and temporary isolated browser contexts.

Known limits: ~64MiB dist,2.06MB JS/540207bytes gzip exceeds historical
early-game size budgets; no budget PASS claimed. Painted animation pose/
direction coverage, human match timing/balance, other browser engines and
new listening remain documented. No speculative asset/architecture changes.

This final update is Markdown only: verified code checks are explicitly
reused, text/link/diff checks are new. User style.css/units.mjs/docs/
:memory:.ses are preserved and excluded. Existing Pages practice used
without new tag infrastructure. Release mandate complete; no further task
or map rebuild/cleanup is started.

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

## 2026-10-08 — CI-fix efter RTS-220

GitHub Actions37718031065 för15bd869 fallerade i Human-roster-testet:
förväntningen saknade cavalry. humans.test.ts uppdaterad till den nya
explicita rostern; inga runtimeändringar. Lokal verifiering: Human4/1,
unit511/89, full regression1717/200, strict build och diffcheck PASS.
Ny CI-status efter fixpush rapporteras separat; tidigare220-uppgifter om
lokala checks innebär inte att dess GitHubkörning passerade. RTS-221–228
är fortsatt Todo. Användarens tidigare ändringar är bevarade.

## 2026-10-08 — RTS-220 levererad; RTS-221–228 återstår

Användarens aktuella uppdrag omfattar RTS-220–228. Endast RTS-220 är
implementerad, verifierad och pushad i denna leverans: `15bd869` till
befintlig `origin/main`. Uppdraget som helhet är inte färdigt. Nästa task är
RTS-221 (Healer), sedan RTS-222–228 i BACKLOG-ordning. Ingen release,
städning eller kartombyggnad har startats. Ingen delegering.

RTS-220: fem fraktionsunika cavalry-/Stable-varianter, bas-II-prerequisite,
shared production/cost/supply, melee-motvikt, AI, campaign-unlocks,
selection/Tech Tree/musklick/hotkeys, save/load och egna CC0 pixelassets.
Grundstats: 45wood/25gold, 12s, 2supply, 110HP, 230speed; infantry-melee
har 1.5× skada mot cavalry. Stable kostar 70wood/30gold, tar 10s och har
160HP. GAME_DESIGN/BACKLOG/DEV_LOG och assetkällor beskriver detaljer.

Ny verifiering för220: riktade98/8 PASS, unit511/89 PASS, build inklusive
strict typecheck PASS och diffcheck PASS. Browser vid native800×600 för
samtliga fem fraktioner: faktisk mouse build/train/move/attack, Tech Tree,
Save/Load och restart PASS. Artifacts finns i `artifacts/rts-220/`.
Sprites/ikoner är enkel procedural pixelart; delad ridergrundform och
upprepade deathframes är konkreta begränsningar. Ingen mänsklig balans-
eller slutanimationsverifiering hävdas. Full regression för hela etappen
återstår; ingen ny CI/Pages-/releaseverifiering har gjorts.

RTS-221 påbörjades lokalt men var ofärdig och gav fyra typecheckfel i
UI-kopplingarna. Den försöksändringen återställdes till verifierad220-kod;
healer är Todo och inga ofärdiga healer-assets/gameplay lämnas som leverans.
Föreslagen startpunkt är befintlig Academy och Heal-spell, med separata
målregler för levande biologiska egna/allierade enheter, manuell Heal och
valbar autocast. Byggnader, själv, döda och mekaniska enheter måste undantas;
nya tester måste täcka samtidiga healers, mana/cooldown och teams/vision.
Detta är en implementation att göra, inte redan verifierat beteende.

Befintliga ändringar i `src/style.css`, `assets/sources/units.mjs`,
`docs/` och `:memory:.ses` är bevarade och inte inkluderade i taskcommit.
Nedanstående äldre överlämning är historisk och ersätter inte detta mandat.

## 2026-10-07 — RTS-212 två hemliga bossar färdiga

Nytt uttryckligt uppdrag efter219: genomför212, sedan stopp före213. Två
originalväktare på befintliga regionskartor, för single-player Skirmish och
kampanj: Bramblemaw på Frontier2352/2640 (1100HP,24skada/1.2s,16px splash,
300wood/200gold); Gravelheart på Highlands2800/2832 (1400HP,28skada/1.6s,
20px splash,200wood/350gold). Platserna är kroppssäkra/nåbara och ligger
långt från starter och obligatoriska mål; ingen kartombyggnad.

Stationära väktare med360px hemområde. De väcks först av faktisk playersikt;
fortsätter försvara området medan egna enheter/byggnader är kvar där. Hela
styrkans reträtt återställer HP och engagement. Arcing projektiler kan slå
land/luft/sjö/byggnader och kringgå terrängskydd; range överstiger vanliga
båg-/belägringsenheter så permanent utsidesbeskjutning inte är gratis.
De är immuna mot riktade spells; vanliga melee/ranged/naval-/towerattacker
samt buffs på den egna armén använder befintlig combat. Ingen ny neutral-AI.

BossState hålls separat från fiendespelarens trupper/produktion/grupper/
fog/statistik/vinstmål. En kort combatprojektion använder vanliga Enemy/
projektil-/skadefunktioner, därefter återförs HP/cooldown/engagement och
väktarna tas ur fiendearmén. Fiende-AI ignorerar dem, kan inte ta deras skatt
eller användas för att döda dem gratis. Bossar blockerar inte guard/wave/
base-victory; escort-victory med levande guardian testad. Byggpreview/klick
respekterar väktarens64px kropp. Minimap/namn/HP/range/poses visas bara via
befintlig fog; inga dolda platsmarkörer.

Efter död: kvarliggande originalcorpse och betydande skatt96px söderut.
En levande egen marktrupp inom48px, sikt och fri access krävs för hämtning;
trupp som redan står där kan hämta samma tick. Claimed-ledger bevarar en
belöning även efter Save. Bonus hålls separat från utvunnen/levererad wood.
Save65 migrerar64; nya Savefält valideras (map/roster/version/HP/cooldown/
engagement/claim/exploration), gamla regions-solo-sparningar aktiveras vid
Load. Originalkartor och multiplayer får inga nya bossar; restart/replay är
ett nytt möte med full HP och tom claimledger. Ingen spelversionshöjning.

Två egna imagegen-källor och åtta exporterade poses: idle/wind-up/attack/dead.
Transparenta original sparade lokalt; befintlig alpha-area-reducer/exporter
återanvänds. [Källa/prompt/CC0/bearbetning](assets/sources/bosses/README.md),
asset-credits/manifest uppdaterade. Inga externa spelbilder/ljud eller betald
stock. Befintliga godkända material-/impact-/treasuresljud återanvänds;
agenten har inte gjort ny faktisk ljudlyssning.

Ny verifiering: focused75/7 PASS35.15s, collision13/2 PASS2.72s, slutliga
boss/air/tower/WorkerTools39/4 PASS3.84s; unit507/87 PASS17.42s; strict build
PASS640ms med befintlig bundlevarning. Manifest87unit/109integration disjunkt.
Native800 browser båda kampanjmöten PASS: riktig menu/mission/musattack,
finansiering registrerad i cheatledger men byggnader och14 soldater via
betalda gameplay-API:er, trupper staged nära väktaren. Faktiska matchticks,
HP-fall/förluster, wounded Save/Load med projektiler, defeated/loot, claimed
Save/Load/pause/restart. Bramblemaw11 respektive Gravelheart12 överlevande;
exakta300/200 och200/350 bonusar. [Browserbelägg](artifacts/rts-212/browser.json)
och [kontroll](scripts/check-bosses.mjs). Båda sprites/strid/corpse/loot visuellt
granskade; ingen naturlig fullkampanj eller mänsklig balansbedömning hävdas.
Tidiga diagnoser: speed0/no-map gav NaN innan stationär attackgren; för stor
splash justerades mot solo/armé-prover. Browserformation låg först utanför
canvas/sikt, korrigerad med kroppsgiltig synlig staging; direkt loot kunde
legitimt ske när en överlevande redan stod vid skatten, assertion korrigerad.

Slutlig `npm test`1682/196 PASS542.56s. Byte-identisk boss-onlyexport av
PNG/atlasJSON/manifest PASS; länk/syntax/diff och egen diffgranskning PASS.
212 Done, levereras med denna commit/push; inga öppna blockerande fynd. CSS/units.mjs/docs/ och
:memory:.ses bevarade.213,208–211 och release startas inte av detta uppdrag.
Ny212-CI/Pages är ännu inte verifierad. Föregående219/993a637:s
[CI37642322214](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37642322214)
är röd av runner-tilldelningsfel efter5försök; tester/build startade inte.
Detta är inget rapporterat assertions-/gameplayfel. Workflow ändras inte
utan sådant belägg;212-push ger ett nytt workflowförsök.

## 2026-10-07 — RTS-219 kampanjfynd färdiga

Användaren beställer att befintliga fynd slås på efter218. Samma authored
kartplatser, renderer och ljud används i alla fem raskampanjer: två skatter
à20wood/10gold och en fraktionsgrundsoldat per karta/uppdragsstart. Inga
nya kartlayouter, externa assets eller slumpade bonusar. Vision, levande egen
marktrupp inom48px och kroppsgiltig access krävs; supply/spawn kan skjuta upp
rekrytering. Claimed/recruit-ledger och ordinarie unitcounters bevarar engångs-
belöningar, Save och vanlig statistik. Fynd blir aldrig ett separat vinstkrav.

Save64 accepterar kampanjledger; befintliga expanderade kampanjsparningar
utan ledger får en tom vid Load efter validering. Ingen omedelbar belöning,
ändrad mission/progression eller Save-/versionshöjning. Historiska original-
kartor och äldre skirmishsparningar behåller kompatibilitet utan nya fynd.
Tutorialens wood-lektion använder utvunnen/levererad wood; träningslektionen
filtrerar bort found recruit-ID:n och kräver en producerad soldier.

Ny verifiering: discoveries14/1 PASS9.38s (alla5×8 kampanjstarter/claim/Save/
restart och tutorialspärr), berörda campaignPhases/Series/Early/Late/tutorial
53/5 PASS88.26s, unit506/87 PASS31.03s, build med strict typecheck PASS1.08s
med befintlig bundlevarning. Native800 browser alla fem PASS: fysisk scout-
selection/order, faktisk matchuppdatering, dold före sikt, skatt20/10, rekryt,
Save/Load/pause/restart. Fixture placerar en scout56–80px från authored fynd;
ingen naturlig långkampanj eller mänsklig balansbedömning hävdas. Orc-kista/
Elven-rekryt skärmbilder visuellt granskade. [Belägg](artifacts/rts-219/browser.json)
och [kontroll](scripts/check-campaign-discoveries.mjs).
Slutlig `npm test`1671/195 PASS758.71s; syntax/länk/diff och egen
diffgranskning utan fynd PASS. Done, levereras med denna commit/push.
Tidiga testfixturefel
använde0s (inga match-loop-fynd) och har korrigerats; browserfixture söker nu
fri scoutaccess runt fyndet. Gameplay-navigation ändrades inte.

RTS-212:s två bossar saknar implementation och har inte aktiverats här;
användaren har fått separat scopefråga. Kartombyggnad/release fortfarande
pausade. Befintlig CSS/units.mjs/docs/ och :memory:.ses bevaras. Föregående
218/81bedea har nu faktiskt grön [CI/Pages37626840058](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37626840058);
Ny219-CI/Pages är inte verifierad i denna leverans. Tidigare stopp efter218
ersätts endast för aktuellt beställda kampanjfynd.

## 2026-10-07 — RTS-215–218 färdiga, stopp

Nytt bifogat mandat ersatte tidigare stopp: fyra avgränsade tasks före release.
215 Worker Tools I/II/III levererad/pushad **b4f97cf**;216 större minimap-overlay
**31d0d6a**;217 begripliga selection-namn/gruppantal **1049b40**.218 är klar
och levereras med denna slutcommit: full wood-last/trädbyte, riktade tester,
Save-räknarkorrigering, browser och grön slutregression.
Ingen release, versionshöjning, kartombyggnad eller automatisk nästa task.

Worker Tools:60/30,100/60,140/100 wood/gold;15/20/30s; gatheringtid90/80/70%
för wood/gold, ersättande nivåer. Egen per-player research och delad lane mellan
egna huvudbyggnader; Save/Load/restart, framtida workers och fem raser täckta.
Native800 verkliga bas-/researchmusklick för alla fem PASS. Minimap160×160,
proportionell karta/letterbox, inputcapture; Native/Fit/fullscreen-API vid800
och3440 PASS med selection/order oförändrade. Selection visar rasnamn och
synliga namn × antal; interna IDs kvar i state/save/devtools. Alla fem raser
worker/fighter/gruppdrag PASS. Separat CSS bevarar användarens style.css.

218:s grundorsak: uttömning gav leverans på positiva laster. Nu behålls
partial wood och nästa nåbara träd väljs; bara full5 är normalleverans.
Saknas nåbar ved levereras restlast, sedan förklarande idle. Samma regel för
flera workers/depletion, guld/manual/traffic bevarade. Skogskollision återanvänds
för passage som öppnas av fällt träd. Inget nytt Saveformat/ljudframework.
Riktade112/9, unit506/87, slutlig strict build och browser PASS. Browsersexworker:
35 partialträdbyten,15 normala fulla avfärder,21 deposits,98 wood bevarad,
verklig Save/Load, faktisk resource-service-väntan och tydlig idle. [Belägg](artifacts/rts-218/browser.json).
Fullregression upptäckte även tutorialens gamla primary-only-leveransräknare:
sekundär last kunde underkänna en redan klar fas vid Save. Räknaren använder
nu befintlig matchStats wood.delivered. Tutorial8/1 och First Steps + två
räknarprov3 PASS (övriga13 skipped), ny unit/strict build PASS.
Faktisk tutorial-wizard/Save/Load med sekundärcargo PASS;
[belägg](artifacts/rts-218/tutorial-browser.json). Fullregressionens återstående
fynd: gamla resurslabel-/wood-idle-förväntningar uppdaterade, conservation kvar;
The Siege Normal kräver nu betald återhämtning efter arméförlust. Befintlig
naval-preparation återanvänds på land inom samma max4-anfall; inga stridsvärden,
resurser/HP/enheter injiceras. Riktade12/2 och Siege1/12 skipped PASS.
1660/4-fail-regressionen och två avbrutna försök är diagnostik. Slutlig
**npm test1664/195 PASS551.70s**, unit506/87 PASS17.98s, build inklusive
strict typecheck PASS475ms, syntax/länk/diff/review PASS. Unit återanvänds
efter sista integration-/testcontrollerändringarna; fullregression täcker dem.

Ny largeMaps-minimapförväntning
riktat2 PASS (övriga7 skipped).215 GitHub faktiskt grön37618831308;
216 röd37620255382 på gamla200×150-förväntningar, korrigerade här.
Ny218-CI/Pages är inte verifierad. Historiska release-/ljudbelägg hålls isär.
Browserproven är korta instrumenterade ekonomiska/input-scenarier i Chrome,
inte mänskligt balans-/ljudspeltest eller fysisk3440-monitor. Ljudens tidigare
användargodkännande kvar; ingen ny ljudändring. Befintlig bundlevarning kvar.
Användarens units.mjs/style.css/docs/ och scratch :memory:.ses bevaras.

Efter218: **stanna**. Roadmap208+, kartarbete och releasestädning kräver
nytt uppdrag. Se senaste BACKLOG/DEV_LOG för aktuellt verifieringsläge.

## 2026-10-07 — CI-korrigering verifierad på GitHub

Fix67f1cc7 är pushad till origin/main. [Actions37598064764](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37598064764)
är faktiskt grön för samma SHA: `npm test` full regression, build och
Pages-deploy PASS. Det återkommande spectator-testets5000ms-timeout är
åtgärdat med individuell30000ms-budget utan ändrade assertions/gameplay.
Ljuden är godkända av användaren. Tidigare röda körningar är historik;
inget påstående om att de har körts om. Ingen ny versionsrelease gjord.

Denna avslutande statusuppdatering ändrar bara Markdown. Text-/länk-/
diffgranskning PASS; ovanstående kodkontroller återanvänds uttryckligen,
inga nya kodtester/browserchecks behövs. CSS/units.mjs/docs/ bevarade.

## 2026-10-07 — Ljud godkänt och återkommande CI-timeout

Användaren har faktiskt lyssnat och godkänner ljuden. Detta ersätter tidigare
notering om saknat godkännande av slutljuden; agenten har inte själv lyssnat.
Historiska `listeningVerified:false` i authoring-/captureunderlagen behålls
som korrekt ursprunglig agentstatus, inte aktuellt användargodkännande.

De fyra senaste misslyckade Actions-körningarna37528182361/37530827720/
37532984153/37595976772 rapporterar samma5000ms-timeout i
`src/gameplay/teamResults.test.ts`, spectator/aktiv-allierad/Save-testet.
Senast grönt37527447120; felet föregår ljudcommit21a8f6b. Build/deploy
hoppades över på grund av testfelet. Just testets wall-clockbudget höjs
från5000 till30000ms; fixture,10s gameplaytid, assertions, defaulttimeout
för övriga tester och workerantal är oförändrade. Ingen gameplayändring.
Ny lokal verifiering: spectator/lag/Save-integration11/1 PASS10.93s,
unit482/86 PASS13.49s, build inklusive strict typecheck PASS och
diffgranskning/check PASS. Endast timeout och kommentar ändrade i testet.
Ingen ny browserkontroll behövs för testdeadline/dokumentation. Tidigare
ljudleverans full regression1630/193 är historiskt belägg; ingen ny lokal
full regression körd. Ny full regression körs och följs på GitHub efter push.

## 2026-10-07 — Full ljudimplementation, användarens nya mandat

Alla 315 lokala engelska repliker är aktiva: fem raser × worker/soldier/archer ×
selection/move/attack/gather/ready/error/humor × tre varianter. Goblins behåller
repots identitet med snabb uppfinnarton; Humans torr tjänstehumor, Orcs ohövlig
bokstavlighet, Elves överlägsen elegans och Dwarves korthugget hantverk.
Kostnadsfri offline Kokoro-generering och OpenVoice V2-karaktärskonvertering
använder de godkända fria tonreferenserna. Detta är neuralgenererade repliker,
inte nya mänskliga inspelningar. Dvärgarnas 63 bearbetningar är CC-BY-SA-3.0;
övriga nya röster/effekter CC0, med modellernas egna notices separat.
Per-asset upphov, källa, licens, bearbetning och hash finns i
[ljudunderlaget](assets/sources/audio-identity/README.md). Credits följer med spelet.

13 effektfamiljer ersatta med inspelade materiallager, inklusive melee/build,
trä/sten, projektiler, kanon/vatten, skatt och byggnadsras. Befintlig AudioContext
återanvänds: en representativ grupporder, cooldown/variantrotation/sällsynt humor,
separat Voice/SFX, mjuk ducking och gemensam kompressor. Audio-unlock, mute,
pause och restart bevaras. Alla ljud laddas lokalt; inga betalda tjänster.

[Lyssna på slutversionen](artifacts/audio-identity/final/index.html): fem verkliga
matchmixar och egna repliker från varje ras. Tekniska browser-/PCM-kontroller
är skilda från lyssning: slutpaketens faktiska ljudkvalitet är **ej verifierad**.
Användaren har godkänt tonriktningen och beställt full implementation samt
commit/push; detta utgör inte hörselgranskning av samtliga slutklipp.
Kartarbete och roadmapbatch2 startas inte. Befintlig style.css, units.mjs och
docs/ bevaras. Ingen ny release hävdas.

### Ny verifiering av slutversionen

- `npm run test:unit`:482/86 PASS; `npm run build`:PASS inklusive strict
  typecheck (befintlig bundle-storleksvarning).
- `check-recorded-voices.mjs`:fem raser PASS med315 verkliga public-WAVs,
  grupporder/klickspam, Voice/SFX/mute/volym/pause och faktisk scenrestart.
- `capture-voice-pilot.mjs` med `W2T_AUDIO_REVISION=production`:fem matchmixar
  PASS tekniskt, post-kompressor PCM peak0.435/0.358/0.357/0.374/0.363,
  ej faktiskt lyssnade. Första capture avbröts av HMR medan koden ändrades;
  slutkörningen gjordes efter fryst spelkod.
- Assettest4 PASS194ms:315 unika hashes, runtime/master byte-lika, korrekta
  derivatlicenser;13 SFX-familjers källhashes och slut-WAV/OGG kontrollerade.
  Gammalt manifest-count15 korrigerat till faktisk config19. Nytt assettest
  överskred först timeout på Buffers djupjämförelse; Buffer.equals verifierar
  samma byte-likhet utan onödig serialisering. Tidig full regression avbröts
  inför korrigeringen och räknas inte som PASS.
- Python/JS-syntax,315 PCM/headroom och53 lyssningssidans ljudlänkar PASS.
  Slutlig `npm test`:1630/193 PASS524.67s. Slutlig build efter licensnotisändringen PASS inklusive strict typecheck; `git diff --cached --check` PASS.
  Review: ingen bred refaktorering eller ändrad gameplaylogik; synlighets-/materialrouting och lifecycle täcks. Ingen ny CI/Pages/release verifierad.

### Historiska ljudprov nedan — ersatta av implementationen ovan

## 2026-10-07 — Godkänd Orc-ton, nya rasjämförelser

Användaren godkänner exakt tonen i Tim Rockks inlästa Orc-prov och beställer
motsvarande karaktärstoner för gnomes/elves/dvärgar. Godkännandet gäller
riktning/framförande, inte eget315-replikers manus, full actiontäckning eller
matchmix. Repots femte ras är fortsatt Goblins (Tinkerer/Scrapper/uppfinnare);
fråga ställd om gnome avser röstinspiration eller rasbyte. Ingen ras ändrad.

Tio faktiskt inlästa fria kandidater exporterade med per-asset källa/upphov/
licens/hash/bearbetning till
[lyssningssidan](artifacts/audio-identity/character-tones/index.html), med
Orc som godkänd jämförelse. Dvärg: MaximB, tre Drunk Dwarf-prov under
CC-BY-SA3.0; bearbetningar behåller samma licens och credits/licenslänk.
Goblin: artisticdude tre CC0-vokaler + xathien CC0-Minion. Elf: Hydroque
CC0 Elf From Dragnor + två xathien CC0-Archer-kandidater. Archer är inte
explicit Elf, vokaler är inte egna engelska orderrepliker; faktisk ton och
text behöver lyssningsbedömas. Inga kandidater framställs som kompletta
paket. Alla bearbetningar behåller ursprunglig tonhöjd/samplingsfrekvens,
mono/DC-borttagning/8ms fades och nivåmål .085/peakcap .45.

Soundsnap-gnomereferensen kunde inte öppnas i webtool. Den officiella
[licensen](https://www.soundsnap.com/licence) förbjuder distribution där
ljudet kan extraheras/återanvändas separat; därför inga imports till råa
publika repoassets, ingen prenumeration. CC-BY-SA-text sparad lokalt.

Ny exportsyntax/10 hash- och PCM-kontroller samt diff PASS. Ingen spelkod
ändrad, tidigare unit/build återanvänds utan nya sådana körningar. Faktisk
lyssning för dessa nya kandidater är ej verifierad. Ingen commit/push/release
innan hela ljuduppdraget är klart; oberoende användarändringar bevarade.

## 2026-10-07 — Nya ljudreferenser och inläst Orc-jämförelse

Prov2 är enligt användaren bättre men inte helt rätt; kvalitetsgrinden är
inte godkänd. Warcraft Wiki-kategorin svarar403 vid direkt läsning;
[fillicenspolicyn](https://warcraft.wiki.gg/wiki/Warcraft_Wiki:Copyrights)
skiljer textlicens från enskilda ljudfiler. Ingen fri Blizzard-ljudlicens
verifierad. [fondlez/wow-sounds](https://github.com/fondlez/wow-sounds) är
MIT-licensierade textlistor/filnamn, inte ljudinspelningar eller rättigheter
till Blizzard-assets. [Pixabay](https://pixabay.com/service/license-summary/)
tillåter gratis användning/bearbetning men förbjuder standalone-distribution
och påpekar möjliga tredjepartsrättigheter. Ingen därifrån importerad utan
verifierad assetkälla och förenlig repodistribution.

Hittade ett separat faktiskt inläst [Orc-prov av Tim Rockk](https://opengameart.org/content/orc-voice)
med uttrycklig CC0. Två original sparade, mono/nivåjusterade kopior och
per-asset upphov/licens/källa/bearbetning/hash exporterade genom
[scripts/export-orc-reference.py](scripts/export-orc-reference.py).
[Lyssningssida](artifacts/audio-identity/acted-orc/index.html).
Författarens repliker, inte projektets egna eller en AI-klon: en jämförelse
av framförande, inte färdigt rasröstpaket. Ingen produktionsaktivering eller
provlyssning hävdas. Alla fem rasers slutliga framförande återstår; den
nuvarande fasta AI-modellen klarar inte styrbar growl/acting.

Ny verifiering: två original/exporters SHA256, monoPCM16/44.1kHz, peaks
under0.451 och Python-syntax/diff PASS. Ingen spelkod ändrad i denna
källgranskning; tidigare unit/build återanvänds, inga nya sådana checks.
Ingen commit/push/release eftersom ljuduppdraget inte är klart.

## 2026-10-07 — Ljudprov2 efter underkänd lyssning (In Progress)

Användaren hör mycket brus/sprak i matchmixen, underkänner melee/build och
vill ha tydligare förväntad raskaraktär, särskilt extremt ohövlig Orc. Detta
ersätter tidigare pilot som kvalitetskandidat; ingen femrasspridning.
Wowhead/Epidemic granskade som referenser. Ingen verifierad fri Blizzard-
licens för spel/repo hittad; Epidemic kräver köpt licens. Inga ljud därifrån
importerade, inga abonnemang startade.

[scripts/export-audio-revision.py](scripts/export-audio-revision.py) ger nio
nya Kenney CC0-kandidater med materiallager i stället för syntetiskt vitt
brus; melee metall+dov träff, build träslag+knarr. Fem ytterligare original
sparade med källa/hash per asset i revision-2/manifest.json. Kandidatröster:
Human torr formell, Elves arrogant, Dwarves korthuggen, Goblins snabb uppfinnare;
Orc har tre separata neuralpresets (adam/onyx/fenrir) på samma grövre egna
repliker. Modellen har ingen styrbar growl/acting; detta är jämförelseprov,
inte färdigt röstskådespel. Ursprungliga315 masters/runtime ändras inte.

[Lyssningssida](artifacts/audio-identity/revision-2/index.html) samlar separata
SFX, sju röstprov och två matchmixar. Matchcapture använder nu direkt
AudioWorklet-PCM, utan tidigare Opus-omkodning. Sex stridsljud ersätts i
browserfixture med kandidater och tre Human/Orc-adam-repliker spelas via
befintlig voicekanal. Live match/voice/SFX-capture PASS,0pageerrors, peak
0.222/0.226, ingen klippning. De kvarvarande gamla synteseffekterna är en
möjlig bruskälla; exakt orsak till användarens sprak är inte fastställd.
Faktisk lyssning av prov2 återstår. Produktionsljud är inte aktiverade.

Endast exportscripts/kandidatassets/docs ändrade i denna revision; tidigare
unit484/88 och strict build återanvänds för oförändrad spelkod, inte som ny
ljudkvalitetskontroll. Python/Node-syntax, metadata/PCM/hash och diffcheck
kontrolleras. Ingen commit/push/release före färdigt uppdrag.

## 2026-10-07 — Kostnadsfria AI-röster, kandidatleverans (In Progress)

Användaren godkände kostnadsfria AI-genererade röster. Kokoro-82M kördes
lokalt utan betald tjänst:315 unika PCM-WAVs,63 per ras, för worker/soldier/
archer och sju actions med tre varianter. Fem separata röstembeddingar:
Human bm_george, Orc am_fenrir, Elf bf_emma, Dwarf bm_fable, Goblin am_puck.
Per-asset källa, upphov, licens, bearbetning och SHA256 finns i
[ljudunderlaget](assets/sources/audio-identity/README.md). Projektets nya
ljudoutput erbjuds under CC0 i den mån projektet innehar rättigheterna;
Kokoro-modellen är Apache-2.0, exportbiblioteket MIT. Licenstexter sparade;
modeller/bibliotek distribueras inte och spelet gör inga externa ljudanrop.

Alla315 masters finns lokalt, men endast tio Human/Orc-pilotklipp är
aktiverade. Fem raspreviews och två faktisk-matchinspelningar med strids-SFX
finns i artifacts/audio-identity. Matchinspelning är inte provlyssning:
lyssningsfeedback efterfrågad enligt användarens krav ”Provlyssna i faktisk
match innan samma kvalitet sprids.” Övriga305 är kandidater. Ingen mänsklig
ljudkvalitet, taltydlighet under strid eller färdigt femraspaket hävdas.

Verifierat:315 olika hashvärden, mono PCM16/24kHz, inga tysta/klippta filer;
riktade21 tester/5 filer PASS, unit484/88 PASS16.60s och build med strict
typecheck PASS (Vite517ms, befintlig bundlevarning). Browser med riktiga315
kandidatfiler: alla fem rasers selection/grupporder/klickspam, mute/Voice-
volym, pause/restart PASS utan pageerrors. Två matchcaptures har peak under
0.38 utan klippning. Automatiska kontroller verifierar teknik, inte hörsel.

Tre Kenney CC0-Foleyprov finns; sex ytterligare RPG Audio-original och
licens är hämtade. Production-SFX är ännu inte ersatta. Kvar: lyssningsgrind,
aktivering/ljudjustering och återstående material-/effektarbete. Ingen
commit/push/release nu; användaren beställde dessa först när uppdraget är
färdigt. style.css, units.mjs och docs/ bevarade. Ingen nästa roadmaptask.

# Historiskt ljuduppdrag — alla fem raser, 2026-10-06

**In Progress, inte fem färdiga hörbara röstpaket.** Uppföljningen ”fixa alla
fem tack” har315 egna engelska repliker för Human/Orc/Elf/Dwarf/Goblin ×
worker/melee/ranged × selection/move/attack/gather/ready/error/humor ×3.
[Gemensam källa/status](assets/sources/audio-identity/README.md), lokal
voice-manifest/export och playback i befintlig Web Audio-graf implementerade.
En gruppröst,1.2s cooldown, variantrotation, sällsynt humor, separat Voice/SFX,
SFX-ducking, mute/pause/reset/stale-callbackspärr. Unitfaction prioriteras;
ready/error kopplade till publika arrival/failed-order/placementhändelser.
Browser-TTS/pitch-fallback är borttagen.315 inspelningar saknas fortfarande;
utan filer visas voices unavailable och ingen ersättningsröst spelas.

Riktade21/5 PASS; build med strict typecheck PASS/Vite400ms (befintlig
bundlevarning), slutlig unit484/88 PASS13.60s. Faktisk Chromium1280:
femras-selection/grupporder/klickspam och mixer/mute/volym/pause/reset PASS
med tysta testbuffertar; [protokoll](artifacts/audio-identity/browser-routing.json).
Fysisk Escape-paus och Restart-knapp dessutom PASS för samtliga fem:
samma AudioContext, kvarvarande testbuffertar/Voicevolym och fungerande ny
selectionröst efter faktisk scene-restart. Ingen omkörning av unit behövdes
för denna extra browserharnesscheck; spelkoden var oförändrad.
Detta är routing, inte röstfiler/fileloading, stridslyssning eller ljudkvalitet.
Återstående verkliga röstfiler, SFX-integration och faktisk
prov-/matchlyssning blockerar Done. Fråga ställd om kostnadsfria offline-
AI-röstprov får användas eller enbart mänskliga inspelningar; inget svar ännu.
Ingen modell installerad eller AI-röstasset skapad. Ingen commit/push eller
release före färdigt uppdrag; CSS/units.mjs/docs bevarade. Ingen batch2.

---

# Första ljudinventering/prov — historiskt underlag i samma uppdrag

In Progress, ej färdigt. Nuvarande fem rasers röster är samma lokala
browser-TTS med pitchskillnader; inspelningar saknas. Femte rasen är Goblins.
[Provunderlag](assets/sources/audio-identity/README.md) innehåller 84 egna
Human/Orc-worker/soldierrepliker och tre bearbetade Kenney CC0-Foley-WAVs,
originalfiler/licens samt manifest med källa/upphov/bearbetning/hashes.
Spelkod och runtimeassets oförändrade. Inga nya ljudpaket markeras Done.

Nästa beroende steg: Human/Orc-inspelningar med distributionsrättigheter och
faktisk matchlyssning på pilot före spridning. Fråga om underlag ställd till
användaren; inget svar/underlag har ännu levererats. Voice-mixer, ready/error,
sällsynt humor och materialrouting återstår i befintligt ljudsystem, sedan
övriga raser/effekter och kort femras-verifiering. Faktisk lyssning och nya
browserflöden ej verifierade; inga TTS/mock-checks räknas som ljudkvalitet.
Riktade befintliga audio18/5 och pilotdata/PCM/hashes/ändpunkter PASS.
Ny unit481/88 PASS13.57s, build inklusive strict typecheck PASS/Vite475ms
(befintlig bundlevarning), diff och provets lokala länkar PASS.
Ingen full kampanjregression behövs för detta förberedande ljudprov.
Ingen commit/push eftersom uppdraget inte är färdigt; ingen release.
style.css, units.mjs och docs/ bevarade; ingen batch2/kartombyggnad.

---

# Tidigare tillägg — RTS-214 resurscheat (2026-10-06)

Användarens `icanseemyhousefromhere` ger +100000 guld och +100000 trä per
användning. Enter under aktiv match öppnar rutan; Enter/Apply bekräftar och
Escape/Cancel avbryter. Gameplayhotkeys blockeras medan man skriver. Grant-
räknaren sparas, valideras och ingår i spending men inte gathering-statistik.
Gamla saves utan räknare fortsätter fungera. README/Commands beskriver Enter.

Riktade59/6 PASS27.18s; unit481/88 PASS22.59s; strict build PASS489ms med
befintlig bundlevarning; browser800/1280 inklusive faktisk två-AI Save/Load,
upprepning, Enter/Apply/Cancel/Escape/paused/felkod PASS. Ny full regression1621/193 PASS740.85s;
slutlig diff/review PASS. RTS-214 Done; taskhash rapporteras efter push. Misslyckad Save-browserfixture tryckte Enter
på Resume innan Save; korrigerad harness, ingen produktändring för det felet.

Batch2 RTS-208–211 startas inte. CSS/units.mjs/docs är bevarade. Ingen ny
release-/Pages-verifiering.

---

# Aktuell överlämning — batch 1 RTS-205–207 (2026-10-06)

Batch 1 är klar. Kartombyggnaden är pausad; redan gjorda ändringar bevaras.
205 förbättrar native atlasexport, lagfärg och porträtt samt ger träd/gruva/skatt
ny egen källgrafik.206 separerar actiongrupper och större ikoner.207 ger
separata Tech Tree/Commands med noddetaljer, faktiska bindings och blockerande
stängbara hjälpdialoger. [BATCH_1.md](BATCH_1.md) samlar före/efterbilder,
proveniens och taskvis verifiering.205 push a87d781;206 push a1b5cd7.
207 push e4343b9.

Ny verifiering: full `npm test`1616/192 PASS652.44s; slutlig unit481/88
PASS15.96s; build inklusive strict typecheck PASS487ms (befintlig bundlevarning);
riktade207-tester31/5 PASS och faktisk Chrome800/1280 för grafik, actiongrupper,
tech/commands och Escape/Close/kartklickisolering PASS. Slutlig diff- och
Markdownreferenskontroll PASS.206-browser återkörd efter207; dess snapshots
visar slutlig topbar. Inga kvarstående blockerande reviewfynd.

Separat målade riktnings-/casting-/death/collapseframes och vissa gamla
byggstadier är fortfarande slutgrafikbegränsningar; tekniskt fungerande
härledda animationer räknas inte som ny slutgrafik. Ingen ny mänsklig balans-/
ljudgranskning, CI-/Pages-verifiering eller release hävdas. `style.css`,
`assets/sources/units.mjs` och användarens otrackade `docs/` bevaras utanför
leveranscommits; inga nya terränglayouter eller gameplay-/Saveändringar.

**Stanna här.** Nästa chatt: batch 2 RTS-208–211 (Next Mission, murar,
farm/supply/guld, namn). Batch 3 RTS-212–213 är endast planerad.

---

# Historik: tidigare kart-/HUD-etapp

# Aktuell överlämning — kart-/HUD-korrigering 2026-10-06

A–C avslutade. Ingen ny roadmaptask eller karteditor. [MAP_CORRECTION.md](MAP_CORRECTION.md) samlar9 kartor/40 campaignstarter, faktiska färdvägar, betalda AI-expansioner, före/efterbilder och begränsningar. Native800/3440 knappar minst44px utan klippning/scroll. Fullregression1603/188, unit475/85 och strict build/diff PASS; aktuell fysisk browser PASS. Referensens konstnärliga kvalitet uppnås inte fullt, och originalbilagorna saknas. Style.css/units.mjs/docs bevaras. Ny C-CI/Pages skiljs från lokala kontroller; ursprunglig CI-timeoutfix370cf02 är verifierat grön. A4bd5737/B509fb79 pushade; C hash i slutrapport.

---

# Historik: del A och tidigare etapper

## Kartkorrigering A — 2026-10-06

Frontier Valley använder ny organic-design: separata konturer för sjöar/klippryggar, sammanhängande skogar med gläntor och individuellt skördbara träd. Gemensam atlas får lövkronor, klippkrön med ovansida/vägg/skugga och kusthörn. Terrängoverlays målas efter marken. Save63 behåller äldre geometri utan designflagga; begränsad strukturgräns200000 stödjer fullt observerade täta skogar (bytesgränsen2MB består). Tidigare kartbilagor saknas i repo; dokumenterad Battle.net River Fork hämtad/granskad i denna körning, utan import/spårning av originalbilden.

Ny riktad regression58/5 PASS, unit475/85 PASS13.10s, senare atlas/design4/2 PASS och strict build PASS. Slutliga grafikändringar motiverade extra asset/buildcheck; tidigare gameplay/browserbelägg gäller oförändrad simulering. Native800/1280 fysisk selection/gather/depletion/open-ground/SaveLoad PASS; artifacts/map-correction/part-A/browser.json. Faktiska forest/coast/crestbilder visuellt granskade, inklusive korrigerad ritordning. assets/sources/reference-terrain.mjs är egna pixelpenslar. Resultatet är fortfarande mer regelbundet och enklare än Warcraft II-originalet; likvärdig konstnärlig kvalitet hävdas inte. B/C återstår. Style.css/units.mjs/docs bevarade. Full regression efter C.

---

# RTS-195–204 klara — stopp efter gameplayfasen

## CI-timeoutkorrigering efter RTS-204 — 2026-10-06

Senaste [GitHub-körningen](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37491093989) fallerade på två tidsgränser: multiplePlayers betalda två-AI/60s-simulering (15000ms) och extraBases team/construction/Save (5000ms). Build/Pages hoppades över; lokal204-PASS är inte CI-PASS. Endast dessa integrationers wall-clockbudget ändras till60000/30000ms. Gameplaytid, fixtures och assertions är oförändrade; standardtimeout och workerantal består.

Ny lokal verifiering: riktade23/2 PASS13.56s (före ändringen23/2 PASS11.04s), unit475/85 PASS15.09s och build inklusive strict typecheck PASS med befintlig bundlevarning. Diffgranskning utan fynd; git diff --check PASS. Full regression körs i nya GitHub-jobbet och dess resultat rapporteras separat. Ingen ny browserkontroll behövs för enbart testtimeout. Befintlig style.css, units.mjs och docs/ bevaras. Inga nya roadmaptasks.


Alla tio beställda gameplaytasks är Done.203 push485e9e5;204 taskcommit/hash rapporteras efter push. [GAMEPLAY_PHASE.md](GAMEPLAY_PHASE.md) samlar ändringar, taskhashar, före/efterbilder och begränsningar. Kartfasens nio kartor och tidigare/nya dimensioner finns i [MAP_PHASE.md](MAP_PHASE.md); inga kartdimensioner ändras i denna gameplayfas.

204: en fraktionsakademi efter forge+attack/försvar I,80wood+40gold/10s/64×64/140HP; nivå II kostar2× fraktionens nivå I och tar12s. Militärbonus använder multiplikator^nivå; workers förblir2DPS utan researchbonus. Betalda jobb/byggnad/damage/repair/fog/minimap/selection/UI/AI/Save62 ingår. Kampanjadmission från mission6 gäller även äldre storyidentiteter; övriga legacyregler bevaras.40 egna academyframes,450 tidigare byggnadssprites pixel-identiska. Separatexport bevarar samtidig unitkällredigering.

Slutlig fullregression1586/186 PASS472.93s, unit475/85 PASS19.65s och slutlig strict build PASS416ms efter metadataassertionsjusteringarna. Diff/text/länkar kontrollerade. Riktade academy/AI/earlycampaign/expandedMaps58/4 PASS24.90s; senare två metadataassertions ingår i fullregressionen. Native800/1280 fysisk workerbuild/attack-II/defense-II/SaveLoad mitt under forskning, två/en byggrader och0pageerrors PASS på slutlig spelkod. Alla fem actual game academyvarianter och kompakt800/1280 visuellt granskade. artifacts/rts-204/browser.json och bilder. Ingen ny CI/Pages-release eller faktisk ljud-/mänsklig balansgranskning hävdas; bundlevarningen består.

Första kompletta regressionen1582PASS/2FAIL hittade legacy-storyAI som fick avancerad teknik i earlymission samt moderna discoveries i Save56-testfixture. Isolerad203-baseline verifierade skillnaden. Korrigeringarna och nya legacyadmissionstester passerar; fullregression omkörd på slutlig kod. Tidigare avbrutna/failed browser/checkkörningar räknas inte PASS; DEV_LOG redovisar orsakerna.

Kända begränsningar: lokala transportmöten256/512px med30s gräns; skatter/rekrutt endast i nya skirmishmatcher och AI samlar inte fynd; zoom återställs1× vid Load; BFS+smoothing garanterar inte globalt kortaste Euclidean-väg; inga nya unitroller. Kampanjgenomspelningar är tekniska completiontester, inte mänsklig balans-/tidsgranskning.195–204-mandatet avslutas här, ingen nästa task startas.

Användarens src/style.css (SHA2568f6e1323…), assets/sources/units.mjs (a24680e7…) och otrackade docs/ bevaras utanför commit. docs-fasen väntade tills sprites/grafik var klar. Befintlig remote origin/main, utan force/amend/history rewrite.

---

# RTS-203 klar — fortsätt204

203 betalda extra huvudbyggnader: max två extras,100wood+60gold/12s, separata workerköer/rally, delad supply/tech/ekonomi, färdiga basleveranser/vision, destruction/repair/team och Save61. Campaign skyddar originalbasen, skirmish sista färdiga basen. Riktade243/22 före sista selectionguard + slutliga32/4, unit475/85, strict build/diff och Native800/1280 fysisk build/queue/rally/SaveLoad PASS; artifacts/rts-203.202 push7954e2e;203 hash rapporteras vid push. Slutlig browser efter ikon/selectionguard inklusive borttagen markerad bas PASS utan errors. Nästa204 avgränsat bygg-/techpaket ska detaljeras före kod. Fullregression vid etappslut; inga CI/Pages-/mänsklig balansclaims. CSS/docs och samtidigt ändrad assets/sources/units.mjs bevaras utanför commit.

---

# RTS-202 klar — fortsätt203

202 nya skirmishfynd på alla nio kartor: två20wood+10goldkistor och en grundsoldat, vision/närkontakt/supply/säker spawn/Save60. Unit475/85, riktade86/7 och tidigare47/5, strict build/diff, Chrome800/1280 fysisk utforskning/claim/recruit/SaveLoad PASS; artifacts/rts-202.201 pushd95468b;202 hash rapporteras vid push. Nästa203 fler huvudbyggnader: detaljera kostnad/kö/dropoff/defeat före implementation. Campaign/äldre matcher får inga nya fynd; AI samlar dem inte. CSS/docs bevarade; fullregression vid etappslut.

---

# RTS-201 klar — fortsätt202

201 manuellt workermelee2DPS/16px, cargo/orderbyte/fog/domän/Save59. Riktade89/7 + slutlig workercombat7/1, unit475/85, strict build/diff och fysisk Chrome800/1280 attack/SaveLoad/gather PASS; artifacts/rts-201.200 push30f9734;201 hash rapporteras vid push. Nästa202: detaljera begränsade skatter/upptäckbara enheter före config/state/assets. Ingen autonom enemyworkercombat. CSS/docs bevarade; samlad fullregression vid etappslut.

---

# RTS-200 klar — fortsätt201

200 säkra diagonala delsträckor runt hinder och stabil arrived-grupp. Unit475/85, riktade97/10, strict build/diff, fysisk Chrome800/1280 tre workers och793-träd stress3/18workers PASS; artifacts/rts-200. Median3.6/4ms,59.8/59.2fps.199 push4b2ad55;200 hash rapporteras vid push. Nästa201 svaga workerattacker. BFS fortsatt fyrgrannar + säker smoothing, ingen garanti om globalt kortaste Euclidean-väg. CSS/docs bevarade; samlad fullregression vid etappslut.

---

# RTS-199 klar — fortsätt200

199 mushjulzoom0.5×–2× med pointerankare, zoomkorrekt minimap/pan/input/Save. Unit475/85, riktade15/3, strict build/diff och fysisk Chrome800/1280 selection/farm/SaveLoad/bounds PASS; artifacts/rts-199.198 pushc4376d6;199 hash rapporteras vid push. Nästa200 diagonala vägar. Zoom återställs1× vid Load, utsnittets top-left bevaras. CSS/docs orörda; ingen ny CI/Pages/fullregressionclaim.

---

# RTS-198 klar — fortsätt199

198 kort snabb action-tooltip, disabled fokus och live blockeringsorsak. ActionPanel9/1, unit473/85, strict build/diff och Chrome Native800/1280 PASS; artifacts/rts-198.197 push66fe7dd;198 hash rapporteras vid push. Nästa199 mushjulzoom med kamera/minimap/inputverifiering. CSS SHA256 oförändrad/docs bevarade. Inga nya CI/Pages/fullregressionclaims; samlad regression vid etappslut.

---

# RTS-197 klar — fortsätt198

197 snabb placementpreview med full klickvalidering. Riktade45/4, unit472/85, strict build/diff och Chromeprofil/fysisk farmplacering PASS. Frontier Native1280 från38.75 till60fps; artifacts/rts-197 före/efter. 195 e7cef16 och196 18be41e pushade;197 hash rapporteras vid push. Nästa198 kort snabb hoverhjälp. CSS/docs bevarade. Fullregression vid gameplayetappslut; ingen ny CI/Pages.

---

# Gameplayfas RTS-195–204 pågår

195 Done: sju byggknappar en rad1280/1920, två800, faktisk Chromegranskning och screenshots artifacts/rts-195. Unit472/85, strict build/diff PASS. 196 Done: automatisk strandkontakt256px/boarding512px, vanliga land-/sjövägar, Stop/Hold/dödsavbrott, Save58. Slutlig riktad63/5, unit472/85, strict build/diff och Chrome800/1280 fysisk Stop/ny boarding/Unload/SaveLoad PASS; artifacts/rts-196.195 push e7cef16;196 hash rapporteras vid taskpush. Nästa197 placementprestanda. Nya innehållsbeslut för204 inväntar användarens svar eller avgränsat förslag före implementation. Nytt mandat ersätter kartfasens stopp; CSS/docs bevaras, inga agenter. Kartfasens checks nedan är historiska.

---

# Kartfas RTS-191–194 avslutad

2026-10-06. Alla fyra tasks är Done.191 push036e306,192 push461597e,193 push1b06889;194 levereras i denna commit (hash rapporteras vid push). Alla nio skirmish-/kampanjkartunderlag är128×128 tiles/4096²px med32px tiles. [MAP_PHASE.md](MAP_PHASE.md) redovisar alla gamla/nya dimensioner, avverkning, kompatibilitet och före/efterbilder. Stanna här: inga nya tasks eller karteditor.

Slutlig fullregression `npm test`1528/181 PASS523.12s. Unit `npm run test:unit`472/85 PASS18.33s; `npm run build` med strict typecheck PASS785ms, befintlig bundlevarning. Unit/browser/prestanda återanvänds efter enbart två integrationscontrollerändringar; spelkoden och buildens spelbundle är oförändrade. Manifest85/96, syntax, Markdownfilreferenser och diff PASS; egen diff-/kravgranskning utan kvarvarande blockerande fynd.

Native800/1280 Frontier fysisk selection/gather/uttömning/öppnad mark/mine-depth/SaveLoad PASS. Alla nio kartors native1280 galleri/minimap/SaveLoad och första/sista expansionsgruvors landvägar på sju inlandskartor PASS; Islands/Coast är transportberoende.793träd,3/18 arbetande workers: median3.8/4.1ms, p954.5/4.6ms,59.8/59.4fps på~300 varma frames; artifacts/rts-194/performance.json. Kort faktisk Phaser-test, ingen lång mänsklig match. Browser körd med användarens befintliga CSS, som inte ingår i kartcommits.

Tidigare regression601.82s hade1526PASS/2FAIL; navalcontrollers rättades med betald ersättning och en andra faktisk färjetur. Riktade fall samt ny sammanhängande fullregression PASS. Inga fiender/skadevärden/objectives/stock/Save-krav ändrades för att få tester gröna; misslyckat Overcharge-controllerförsök återtaget. Äldre avbrutna/fallande checks räknas inte PASS.

Save57 behåller äldre sparningars originalgeometri och avvisar gamla versionsmarkeringar med expanded layout. Originalstarts/objectives/triggers består. Mänsklig introduktions-/helkampanjbalans, speltid, ljud och långtidsperformance på annan hårdvara återstår; ingen ny CI/Pages/release hävdas. Användarens style.css SHA25695c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e och otrackade docs/ bevaras.

---

# RTS-193 klar — kartfas fortsätter med194

191 push036e306,192 push461597e.193 alla nio skirmishkartor och kampanjernas kartunderlag använder reference ground/tree/mines, med bibehållna layouts/dimensions. Forest Pass21 tidigare dekorativa tiles är21×10wood actual resources utöver500. Save56 behåller historiska geometrival. Riktade73/6 +60/5, slutlig unit471/85, strict build/diff PASS. Native1280 actual-size36bilder + fysisk SaveLoad på alla nio kartor PASS i artifacts/rts-193. Nästa194 förstorar mindre till128×128/4096px, strategiska extensions, versionsskydd, slutregression och performance. CSS/docs bevarade; ingen ny CI/Pagesclaim.

---

# RTS-192 klar — kartfas fortsätter med193

191 push036e306.192 Frontier-gruva/berg/korrekt workerdepth/Save55 klar: riktade18/3, unit471/85, strict build/diff och fysisk Chrome800/1280 PASS. Före/efter artifacts/rts-191/rts-192. Gruva96px visuell storlek,40px collision/arbete bevaras. Nästa193 sprider systemet till alla spelkartor;194 förstorar och samlar slutregression/performance. CSS/docs bevarade, ingen CI/Pagesclaim.

---

# Pågående kartfas RTS-191–194

191 klar:142 individuellt valbara/skördbara Frontierträd, bevarad600woodtotal,32px collision, stubbe/öppnad mark, nåbart nästa träd och AI-val, per-träd fog/Save54. Äldre sparningar behåller groves. Riktade65/7, unit471/85, strict build/diff och Chrome800/1280 PASS; artifacts/rts-191 har före/efter och browser.json. Nästa192 gruva/berg i Frontier, därefter193 spridning och194 verklig kartförstoring till128×128/4096px. CSS/docs bevarade. Ingen ny CI/Pages eller fullregression hävdas; slutregression/prestanda efter194. Stanna efter194.

---

# Överlämning RTS-188–190 — grafik/layout klar

2026-10-06. Användaren beställde bättre spelgrafik inklusive saknade flyg, tydligare spelyta utan sidebar och roligare djur; bildstilen accepterades (“bilderna ser bra ut”).188–190 är Done, inga nya tasks startas.

- **188** `0779d8b`, pushad: full-width karta, tech tree/commands i matchmenyn, topbar Mission öppnar pausad beskrivning/mål/status. Back/Escape/Resume och actions/minimap/feedback består. Ny separat CSS-fil; style.css orörd.
- **189** `9af4724`, pushad: fem fraktioners fulla landroster, complete/damaged byggnader, sjö och flyg med imagegen-källark/export, team/ankare/footprint/porträtt/fog. TEMP-flygikoner ersatta av riktig air-atlas.1280 flyg-,5840 land-,180 byggnads- och2080 sjöframes.
- **190** levereras med `feat(art): give forest wildlife expressive sprites`: spotted deer, ivory rabbit, bushy-tail fox,18 nya idle/walk/leap-poses i befintliga32px-celler. Interaktion/jakt/skada/död/Save/ljud/timing oförändrade; hash rapporteras efter commit/push.

## Ny faktisk verifiering

Full regression1497/180 PASS391.02s; slutlig unit476/86 PASS10.18s; build med strict typecheck PASS328ms; manifest86unit/94integration; syntax/diff/Markdown-/assetreferenser PASS. Reproducerbar full assets:export16 PNG/JSON bytevis oförändrade PASS, så passerade kodchecks upprepas inte efter exporten. Befintlig bundlevarning kvar.

188 riktade11/3 och Chrome Native800/1280/1920 samt Fit800 full kartbredd/mission/tech/paus/Escape/resume PASS.189 art33/6 och runtime37/4 PASS; alla fem fraktioners native1280-spelcanvas-gallerier med båda teams/uttömmande framecoverage visuellt granskade. Actual Chrome fem flygare×800/1280 paid production/elevated selection/flight over building/SaveLoad/full queue/restart PASS.190 wildlife15/3, nya rastertester och Chrome Native800/1280 physical inspection/cues/rate limit/hunt/damage/death/no resources-score/SaveLoad/restart/warship hunt PASS; deer/rabbit/fox-bilder granskade.

Första asset-unitkontrollerna förväntade äldre155-kodsprites och en global gammal palett. Testernas källa följer nu den nya adaptern; native terrain/resource/construction-palettkrav består. Nya bilder tillåter sina källfärger; clip/alpha/HP/team/geometry/pose/keys valideras. Första sådana fall räknas inte som PASS. Konkret granskning rättade beskärningsgränser, grannfragment och marginaler före slutchecks. Extern Playwright-miljö återställd efter miljöbyte; saknad-modul-körning räknas inte som PASS.

## Källor, harness och gränser

Källbilder, promptset och packning: [visual-refresh](assets/sources/visual-refresh/README.md). Built-in imagegen användes, ingen CLI/API eller importerade spelsprites. Källor ligger i projektet, inte bara generated_images. Animationsgrund är SE-poser med spegling/skuggning: alla åtta facing-nycklar finns, men inte åtta oberoende målade perspektiv. Work/attack/death är adapterade; fyra riktiga flygposer, två walkposer för mark och sex poser per djur. Native construction/walls/gates kvarstår; separata casting-/voiceassets och äldre mänsklig balans-/ljudgranskning är inte avslutade av detta uppdrag.

Browserharness: [workspace](scripts/check-match-workspace.mjs), [art gallery](scripts/check-refreshed-art.mjs), [flyg](scripts/check-air.mjs), [djur](scripts/check-interactive-wildlife.mjs). Extern W2T_PLAYWRIGHT_MODULE/W2T_BROWSER_EXECUTABLE/W2T_UI_URL; W2T_AIR_ARTIFACTS och W2T_WILDLIFE_ARTIFACTS väljer separat output för nya belägg. Artefakter lokalt/tmp/rts189-*, /tmp/rts189-air, /tmp/rts190-wildlife. Ingen skeppad debug-API.

Ingen ny CI/Pages/release eller faktisk ljudlyssning hävdas. Historisk RTS-180-release är separat. Browserchecks använder arbetskopian inklusive användarens CSS; style.css SHA25695c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e och otrackade docs/ bevarade/ej staged. Stanna efter190; fortsatt finputs kräver nästa uppdrag.

---

# Överlämning RTS-182–187 — avslutad meny-/kampanjfas

2026-10-05. Bilagans sex tasks genomförda i ordning. RTS-181 fanns redan;182–187 lades till utan att skriva över tasks. RTS-180 är historiskt Done/publicerad0.3.0/Build6a96227, inte ny releaseverifiering. Stanna efter denna fas; inga nya tasks/karteditor.

- **182** `90df09f`: Warborn — A Tribute to Warcraft II, Human/Orcs. Interna IDs/repo/Pages/saves bevarade.
- **183** `c3f691b`: highscoretabell, mode/map/difficulty-filter, rulespartition/tie-break och Unknown för äldre datum.
- **184** `289cc9f`: ultrawide/4K och sparat bounded window rendering; Native/Fit bevarade.
- **185** `7b7e9fc`: fem egna berättelser/taktiska åttauppdragsserier och separat campaign-ID/faction/difficulty-progression. Save52.
- **186** `ae5e361` + beläggskorrigering `f43688d`: staged campaignflöde och missionvis contentadmission i UI/gameplay/hotkeys.
- **187** levereras med commit `RTS-187: expose multiple AI slots and persist independent difficulty`; hash redovisas efter push. DefaultSkirmish, authoredkapacitet, direkt Plains96+2AI, grupperade ras/profile/difficulty/team-inställningar, Save53 och tydliga highscorerostergrupper.

## Ny faktisk verifiering

Taskvisa riktade:182:9/3,183:23/3,184:21/4,185:88/6,186:138/12,187:127/7 PASS. Slutlig unit468/84 PASS10.28s; build inklusive strict TypeScript PASS360ms; full regression1489/178 PASS419.51s. Manifest84 unit/94 integration, diff, Markdownlänkar och browserharnesssyntax PASS. Befintlig bundlevarning kvar. Första fullkörningen avbröts för konkret scoregrupp-rubrikfynd och räknas inte som PASS.

Lokal Chrome: fem rasers staged campaign/briefing/SaveLoad/hotkeylocks och positiv B-kontroll vid800×600,1920×1080,3440×1440. Separat actual SaveLoad→terminalfixture→PlayAgain→menyreplay bevarar identitet/policy/progress, endast current/completed och exakt en score. Highscore800/Native map/difficulty/mode/legacy-date/empty/AI2-config PASS. Skirmish vid samma tre native-storlekar startar två verkliga självständiga aktörer med olika raser/Beginner/Hard/profiler/lag, unika baser, fysisk worker/minimap och SaveLoad PASS.184:s separata fullscreen/windowresize/reload/4K-probe PASS; kamera520/1640/3160/3560 logical pixels och kort≈60FPS startmatch, ingen massarmégaranti. Representativa tabell/briefing/settings/HUD-bilder granskade.

[scripts/check-campaign-menu.mjs](scripts/check-campaign-menu.mjs), [replay](scripts/check-campaign-replay.mjs), [skirmish](scripts/check-skirmish-menu.mjs), [highscores](scripts/check-highscore-menu.mjs) använder extern Playwright/Chrome via W2T_PLAYWRIGHT_MODULE/W2T_BROWSER_EXECUTABLE och lokal W2T_UI_URL. Debuggame exponeras endast genom browserroute i harnessen. Screenshots/loggar finns lokalt i /tmp/rts18*. Ingen skeppad debug-API.

## Migration och begränsningar

V1-progression har bara mission-ID:n. Den gamla mixed-serien bevaras separat/oförändrad och kopieras inte till okända ras-/svårighetskombinationer. V2 partitions campaign-ID/faction/difficulty. Äldre saves behåller legacyregler; nya run-ID:n valideras mot ras och sparad difficulty. Härledd innehållspolicy serialiseras inte. Save53 migrerar51/52 multi-envelopes med befintlig difficulty, utan fabricerade AI-overrides. Gamla highscoreposter behåller config/statistik/dedup; saknade datum förblir Unknown.

De40 nya missionsvarianternas identiteter, tillåtna betalda queues och taktiska livekrav är riktat testade med explicita fixtures. Detta är inte40 betalda helgenomspelningar eller mänskligt tempo-/balansspeltest. Full regression inkluderar de befintliga kampanj-/matchsimuleringarna. Nya längre mänskliga playthroughs/ljudlyssning och tidigare återstående caster/naval/flyer/voiceassets kvarstår; inga nya assetclaim. Tre spelarplatser fortfarande endast Plains96/128. Menyerna kan scrolla i Native800.

Ingen ny CI-/Pages-build verifierad i denna fas. Lokala browser/buildchecks använder arbetskatalogen inklusive användarens befintliga CSS. `src/style.css` SHA25695c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e och otrackade docs/ är bevarade och inte committade.

---

Historiska överlämningar följer nedan.

# RTS-186 klar

185 push7b7e9fc;186 flöde/innehållsspärrar klar. Riktade138/12, unit468/84, strict build/diff och fem raser×800/1920/3440 browser PASS. UI+gameplay+hotkeys spärrade; positiv hotkeykontroll PASS med explicit100wood-fixtur.40 nya taktiska mål/queues fixturetestade, inte40 mänskligt/betalt genomspelade kampanjer. Nästa187 flera AI-menyn och slutregression. CSS/docs bevaras.

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

## 2026-10-05 — Dropdownregression efter RTS-186/187

Rättat framevis reparenting i kampanjflödet och upprepade disabled/value-skrivningar på setup-selects. Native popup stängdes av disabled-skrivningen även när värdet var oförändrat; synkning ändrar nu endast faktisk skillnad och lämnar öppet preliminärt val ifred. Skirmishens difficulty-label skrivs bara vid textändring. Browserharness scripts/check-native-dropdowns.mjs använder synlig Chrome, fysisk öppning och :open efter600ms med ordinarie sceneuppdateringar;800/1280 kampanj/skirmish ras/svårighet PASS. Värdepersistens verifieras separat med selectOption; faktisk klickad popup-rad är inte verifierad av harnessen. Tidigare RTS-browserbelägg med selectOption fångade inte native-popupfelet. Headless :open samt syntetiska tangenttryck i macOS-popup fungerade inte som testmetod; de misslyckade harnessförsöken räknas inte som PASS.

Ny unit468/84 och build inklusive strict typecheck PASS; diffkontroll PASS. Ingen gameplay-/saveändring eller bred campaign/fullregression; tidigare187-fullregression är historisk. Användarens style.css/docs bevarade. Ingen ny CI/Pages-verifiering hävdas.

## 2026-10-05 — AI-antal utan extra genvägsknapp

Användarens rapport: extra två-AI-knapp kvar och AI-dropdown utan val. Knappen och dess handler borttagna. Skirmish-dropdown erbjuder alltid You+1/2AI; två AI på karta utan tredje start väljer Plains96 i samma optionsändring. Text förklarar kartbytet; Survival behåller fasta starter och dold antalväljare. Inga startpositioner/AI-/Save-format ändrade.

Ny unit468/84 PASS, riktade session/multiplePlayers/matchSettings97/4 PASS och build inklusive strict typecheck/diff PASS. Chrome800/1920/3440: knapp saknas, dropdown3→Plains96→AI2config→faktisk tvåAIstart med skilda baser/difficulty/profile/team→SaveLoad PASS. Synlig native Chrome800/1280: kampanj/skirmish ras/svårighet samt AI-antal-popup förblir :open efter600ms; separata selectOption-val består. Första parallella browserkörningen tappade fokus och räknas inte som PASS; ensam omkörning PASS. Faktiskt klick på OS-popup-rad automatiseras fortfarande inte.800-bild granskad.

Review rättade kapacitetstexten så Survival inte erbjuder kartbyte; build omkörd efter textändringen, passerade unit/integration återanvända. CSS SHA25695c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e/docs bevarade. Ingen ny fullregression/CI/Pages hävdas, inga senare tasks startas.

## Kartkorrigering B — 2026-10-06

Alla nio kartor använder gemensam regiondesign, nåbara startresurser och avlägsna AI-starter. Betald utpost fortsätter ekonomi/produktion/försvar och förhindrar förtida victory vid huvudbasförlust. Normal dispatch får90s extra; gamla Saves behåller layout via Save64. Pointerkantpanorering borttagen. MAP_CORRECTION.md innehåller inventering av40 campaignstarter, faktiska färdvägar, renderade före/efterbilder och begränsningar. Riktade map/campaign40 PASS; final mapRegions/enemyNaval17/2 PASS, unit475/85 PASS15.96s och strict build PASS400ms. Native1280 fysisk building/gather/open-ground/arrows/edge och naturlig betald AI-utpost PASS, bilder granskade. Grafiken är fortfarande enklare/mer regelbunden än referensen. Historiska tests med fasta koordinater använder explicit classic-fixture. C och full regression återstår; style.css/units.mjs/docs bevarade.

## Kartkorrigering C — 2026-10-06

Native44×44 klickytor/36px ikoner; breda kontextknappar64×64/40px och kortnamn. Begränsad selectionyta, horisontella huvudpaneler, tydligare disabled-ikoner och befintliga tooltip/hotkeys. Faktisk Chrome800×600/3440×1440: nio byggknappar två/en rad, tre betalda köjobb, fem armyactions, fysisk klick/HUD-isolation och inga överlapp/scroll/errors PASS. Aktuella bilder granskade.

Slutregression hittade blockerad vågspawn, gamla resurstotaler i matchStats, fyndplatser som hamnat i hinder/utanför mindre Arena och ändrade organic63-regler. Rättade; historiska koordinat-/deadlinefixtures använder explicit classic, assertions kvarstår. Riktade component147/15, metadata149/7, discoveries/organic/mapRegions24/3 och modern kampanjquality8/1 PASS. Genuine63 terrain/resurs-ID/bas testade. Faktisk workerutforskning/rekryt/engångsbonus/SaveLoad800/1280 och naturlig betald utpost/gathering/produktion/försvar PASS; naval landväg272→2250/2057px.

Slutlig npm test1603/188 PASS551.00s, unit475/85 PASS20.92s, build med strict typecheck PASS425ms, diff/manifest/scriptsyntax/15 docreferenser PASS. Egen review utan blockerande kodfynd; docs efter kodchecks. Bilder/alla nio kartor/40 campaignstarter och undantag finns i MAP_CORRECTION.md. Grafiken är fortfarande enklare och mer regelbunden än Warcraft II; originalbilagorna saknas. Ingen mänsklig balans-/tempo-/ljudclaim. Ursprunglig timeoutfix370cf02 faktiskt grön CI; nya kart-/Pages-körningar skiljs från detta. A4bd5737/B509fb79 pushade, C hash rapporteras efter push. CSS/units.mjs/docs bevarade. Stopp efter korrigeringen.


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
