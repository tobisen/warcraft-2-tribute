# Överlämning – RTS-151–154

Datum:2026-10-04. Uppdrag: återställa151–180, implementera endast151–154,
commit/push taskvis och stanna. Nästa task är **RTS-155 – Ny kvalitetsnivå för sprites**;
den är planerad, inte påbörjad.

## Levererat

- 151: full roadmap och QUALITY_REVIEW.md med prioriterade observerade brister,
  kodfynd/antaganden och uttryckliga begränsningar. Commit29b49e7 pushad.
- 152: alla egna byggnader och synliga enemybyggnader kan inspekteras. Farm/forge,
  HP/funktion/research/prerequisites/köstatus, fog-/order-skydd och transient UI-Save.
  Commitb8291ca pushad.
- 153: fast renderingspreset med Native/Fit, proportionalitet/centrering/nedskalning,
  localpreferences/migration/fullscreenpolicy och läsbart litet HUD.
  Commit71938fb och HUD-komplettering58bf3fe pushade.
- 154: Iron & Timber — A Tribute to Warcraft II, typografisk identitet och browser title.
  Befintlig meny, package/repo/remote/Pages/storagekeys bevarade. Verifierad och klar; taskcommit/push redovisas i slutrapporten.

## Verifiering

151:431unit/76filer, build/strict typecheck; ny browser1280/1920 femfraktions-
selection/move/woodleverans/minimap/Save-load/restart och sex presets. Sista Goblin-
endpoint missades intermittent i matrisen men separat identisk omkörning passerade.
152:31riktade/5filer,32selection/Save-fall,433unit/76filer; build/strict typecheck.
Browserfixtures för all byggnadsinspektion/fog/orderblock/unit/resource, giltig
restart/Save-load båda upplösningar. Fixtures är inte betalda genomspelningar.
153:435unit/76filer före manifestkorrigering, riktade display/preference/viewport
och selection/input/minimap/fokus. Browser48geometrier(six presets/four windows/two modes),
fullscreen API/persistens/reload och faktisk spelinput i800Native/Fit och stort
nedskalat preset. Efter HUD-bildfynd kördes unit/build/browser igen med godkänt resultat.
154: slutligt428unit/75filer PASS8.55s,6riktade meny/text/release-tester PASS;
build inklusive strict typecheck PASS. Full npm test1146tester/145filer PASS499.66s.
Fyra dev-Native/Fit-menyflöden och två byggda subpath-previewflöden PASS titel,
sex menylänkar/åtta campaignkort/start/pause/quit utan browsererrors. Diffkontroll
 och Markdownreferenser PASS; bilder/diff granskade utan blockerande fynd.
Etappen är avslutad. Ingen kodcheck har återanvänts utan redovisning.
Testmanifest: resourceSelection.test.ts flyttas till integration eftersom den
ändrade filen kombinerar MatchState, fog, inspektionsmodell och actionPanel. Inga tester
raderas; full npm test innehåller fortsatt alla filer.

## Kända begränsningar och nästa steg

- Faktisk ljud-/matchlyssning är inte utförd. Tekniskt audio är kontrollerat;
  prioriterade lyssningskrav ligger157/179. Ingen mänsklig20–40minutersgenomspelning utförd.
- Fullscreen har kontrollerats via Chromium API/layout, inte mänskligt på fysisk monitor.
- Bundlevarningen kvarstår. Närliggande worldlabels/minimap kan överlappa,
  redan inventerat; ingen bred presentationsrefaktorering ingår.
- Nya farm/forge/enemy-inspektionsval återställs vid Load; gameplaystate och äldre
  producentval sparas. Ingen Saveversionhöjning.
- Humans-designreferensen är inte bifogad.155 ska söka godkänt underlag, granska
  worker/melee/huvudbyggnad i faktisk spelstorlek och redovisa saknat underlag.
- Produktversion är fortsatt0.2.0. Push till main startar befintlig CI/Pages;
  ny publicerad build får inte hävdas verifierad utan separat faktisk kontroll.

RTS-155–180 är Todo; ingen senare roadmap-feature implementerad. Karteditor och
JSON-import/export ligger efter180. BACKLOG.md styr nästa uppdrag.
