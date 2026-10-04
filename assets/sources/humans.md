# RTS-155 – Human-korrigering och visuell granskning

Human-slicen (worker, melee/soldier och huvudbyggnad) är korrigerad och granskad
2026-10-04. RTS-155 är fortsatt **In Progress** för användarens bedömning av det
nya visuella resultatet; tekniska PASS ersätter inte designgodkännande.
Ingen senare RTS-task eller ytterligare fraktion uppdateras i denna korrigering.

## Underlag och konstaterad orsak

De befintliga lokala referenserna är [Human](../../docs/art/human-reference.png)
och [byggnader](../../docs/art/buildings-reference.png). De lästes och granskades
som användarens godkända stilunderlag enligt uppdraget. Filerna låg redan i
otrackade docs/art och har inte ändrats eller lagts till i commit. Deras SHA-256
finns i [auditrapporten](../../artifacts/rts-155/source-export-audit.json), så att
använt underlag kan identifieras. Den bifogade spelskärmbilden visar den gamla
32px-workern och den enkla tvåtornsbyggnaden och stödjer användarens invändning.

Källbilderna var grundproblemet. Den gamla Human-workern/soldiern bestod av
små övermålningar av generiska rektangelfigurer i32×32. Base hade fortfarande
samma generiska frontala borg; tidigare byggnadskälländring var huvudsakligen
formatering. Referensen visar ljus skjorta/blå väst/skägg/tvåhandsverktyg,
stålrustning/blå plym/guldkantad sköld och en borg med flera blå tak och rik
sten-/träkomposition. Dessa drag saknades eller var för grovt reducerade.

Atlasexporten var korrekt även före korrigeringen: samtliga544 Human-unitframes
och8 baseframes överensstämmer pixel för pixel med respektive källkomposition.
Inga exportmismatchar hittades före eller efter. Runtime använder rätt typer,
frame-ID:n, atlasrektanglar, scale1, origin(.5,.6875) för units och(.5,.75) för
base. Ingen felaktig atlasrotation/trimning, texturskala eller smoothing
förklarade det tidigare resultatet. Det behövdes nya spelbilder, inte filnamnsbyte.

## Korrigering

[humans.mjs](humans.mjs) innehåller egna integer-pixelkompositioner. Ingen
illustration, referensruta eller godtycklig crop används som spelasset.

- Worker: ljusa ärmar/byxor, blå väst fram/bak, brunt hår/skägg, läderstövlar,
  bälte/pung och tvåhandsfattat metallverktyg. Materialen har separata skuggor
  och highlights. Gather/attack har verktygssving; build använder mindre hammare.
- Soldier: rundade stålaxlar, visor/guldrim, blå plym/tabard och egen guldkantad
  heraldisk sköld; svärdet har separata attackposer. Tydligt annan silhuett än worker.
- Unitceller:64×64, med transparent marginal och ankare(32,44). Åtta riktningar,
  fyra walk/attack/death-frames och fyra gather/build-frames för worker;
  västliga poser speglar östliga. Stride projiceras även i djupled. Death är
  egna fall-/liggposer, ingen nedskalning av idlebild eller crop av referensen.
- Base:128×128 med central keep, flera torn/tegeltak, stenfog, timberhall,
  portal/ekport, trappsteg, facklor, fanor och blå/guld-heraldik. Foundation,
  building och damaged har egna förråd/scaffolding/ruin-detaljer.
- Porträtt använder samma nya atlasbilder med befintlig nearest-neighbor-
  canvasritning; inga referensillustrationer kopplas in som porträtt.
- Renderingsanpassning: Human-worker/soldier behöver HP48px och cargo68px
  ovanför worldpositionen för att inte skriva över den högre silhuetten.
  [unitOverlayOffsets](../../src/presentation/animation.ts) används för egna
  och fientliga Human-enheter. Andra fraktioners offsets bevaras.

Base-footprints48/96px, unit-bodies, combat/ranges/navigation och selectionregler
ändras inte. Alla5840 unit- och200 building-ID:n behålls. Audit visar **noll
ändrade rasters utanför Human-worker/soldier/base**. Bottom bar-CSS/DOM/actionbindning
från879c1e6 är inte ändrad. Paletten utökas endast med Human-materialnyanser.

## Ny evidens

[Före/efter-väljare](../../artifacts/rts-155/index.html) visar samma spelvy vid
Native800×600 och1280×720: worker/porträtt, soldier/porträtt, tillsammans, base,
movement samt actionposer. Bilderna finns i samma artefaktkatalog med
before-/after-prefix. Bildskalning i jämförelseväljaren är för granskning;
öppna PNG-länken för exakt native pixelstorlek.

[scripts/check-human-art.mjs](../../scripts/check-human-art.mjs) startar spelet,
injicerar en uttrycklig visuell fixture och fryser ordinarie simulation mellan
bilderna. Fysiska klick verifierar worker, soldier och base-selection. Movement
stegas genom verklig BootScene.update; frame/position/atlas/scale kontrolleras.
Gather/build/attack/death väljs uttryckligen ur laddade Phaser-frames; det är
**poser/assetgranskning**, inte påstådd betald gameplay eller döds-/combatregression.
Contact sheets visar åtta riktningar och alla animationsframes samt base-stadier.

Browserkörningen PASS före/efter i båda upplösningar, utan pageerrors. Native
selection, läsbarhet mot gräs, porträtt, labels, rörelse och actionposer granskades
visuellt. Ingen klippning av sprites upptäcktes; tekniska tester verifierar även
transparent marginal på alla Human-frames. Layoutfixen är inte omarbetad.

[tests/humanArt.test.mjs](../../tests/humanArt.test.mjs) kontrollerar alla nya
Human-unit/base-frames mot källorna, transparens, trim/rotation, ankare och
logiska footprints. Befintliga raster-/animationstester täcker roller, lagfärg,
riktningar och verkligt olika animationsframes. Slutlig unit-suite431/76 PASS;
`npm run build` inklusive strict typecheck PASS, `git diff --check` PASS.
Inga fullständiga campaign-/matchsimuleringar kördes. Bundlevarningen kvarstår.

## Avgränsning och kvarstående bedömning

Den nya64px-adaptionen har färre mikrodetaljer än den stora referensillustrationen.
Detta är ett eget spelassetpass som använder referensens identitetsdrag, inte en
pixelidentisk kopia. Slutligt visuellt godkännande från användaren finns ännu
inte för dessa nya bilder; därför hålls RTS-155 öppen. Human-ranged/siege/specialist,
övriga byggnader/sjöassets och andra fraktioner är inte uppdaterade och har
fortfarande äldre skala/stil. De ska inte utges som färdiga genom detta pass.
Ingen senare task startas. Ingen ny CI-/Pages- eller fysisk monitorgranskning
påstås verifierad. Referensfilerna finns lokalt men är fortsatt otrackade.
