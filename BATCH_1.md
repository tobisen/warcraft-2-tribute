# Batch 1 — grafik och tydligare UI (2026-10-06)

Mandat: RTS-205–207; kartombyggnaden pausad, befintlig geometri bevarad.
RTS-208–211 hör till nästa chatt/batch2, RTS-212–213 till batch3.
Användarens style.css/units.mjs/docs ändras eller inkluderas inte i taskcommits.

## RTS-205 — läsbarhet

Orsak: stora godkända raster reducerades med enstaka nearest-pixelprov och blå
material plattades till en färg. Det gav brus och tappade vapen-/tygdetaljer.
Porträtt krympte hela atlassloten med tomma marginaler. Area-reduktion med
alpha-viktning behåller material, silhuetter och tunna detaljer vid befintlig
skala. Kanonisk lagfärg finns i mellantoner/band utan att ta bort alla skuggor.
Porträtt beskär den synliga kroppen; träd/gruvor får matchande porträtt.

Inventering: fem fraktioner × worker/melee/ranged/specialist/siege/flyer/warship/
transport; base/barracks/farm/forge/harbor/tower/academy/wall/gate, inklusive
befintliga nivå-/bygg-/damage/open-stadier. Gemensam resursgrafik gäller både
moderna reference- och äldre world-frames. Alla spelar-/fiendeframes laddas
utan saknade texturer. Atlas-ID:n, dimensioner, ankare, footprints, hitboxar,
HP/stats, stock, animationstider och Save-format bevaras. Djur och övriga
world-raster är pixelidentiska med76d05c9; bara fyra resursframes ändras där.

Godkända fem-fraktionsark behålls. Två nya originalark med inbyggt imagegen:
[resources-205](assets/sources/visual-refresh/resources-205.png) och
[fortifications-205](assets/sources/visual-refresh/fortifications-205.png).
[Provenance/promptset](assets/sources/visual-refresh/README.md) beskriver
alpha, granskade crops och export. Warcraft II River Fork-referensen granskades
som läsbarhets-/perspektivunderlag, inte importerad eller spårad spelgrafik.

Representativ Native800/1280-slice granskades före spridningen till alla typer.
[Före](artifacts/rts-205/before-sample-800.png) /
[efter](artifacts/rts-205/after-sample-800.png),
[units före](artifacts/rts-205/before-units.png) /
[efter](artifacts/rts-205/after-units.png),
[byggnader före](artifacts/rts-205/before-buildings.png) /
[efter](artifacts/rts-205/after-buildings.png).
Fysisk [worker-selection](artifacts/rts-205/after-worker-world-800.png) och
[gruvselection/porträtt](artifacts/rts-205/after-mine-world-800.png) PASS.
[Browserreport](artifacts/rts-205/after-browser.json) anger explicit fryst
bildfixture; verklig upptäckt/öppning/rekrytering/SaveLoad i levande update
verifieras separat i [fyndreport](artifacts/rts-205/discoveries/browser.json).
Ingen mänsklig helmatch-/balans- eller ljudverifiering hävdas.

Konkret kvarvarande grafik: nordliga/västliga riktningar är fortfarande
skuggade/speglade poser; death är härledd collapse/fade; gather/build/casting
återanvänder befintliga strikeposer. Foundation/building använder äldre egna
pixelkompositioner. Separat målade fullständiga riktnings-/casting-/deathark
saknas, inte dolda bakom ett påstående om slutliga animationer. Objektens
läsbarhet är visuellt granskad; pixelidentisk Warcraft II-kvalitet hävdas inte.

Checks och taskhashar kompletteras vid respektive leverans. Full regression
körs samlat efter207; inga breda kampanjsimuleringar under grafik/UI-arbetet.

205 slutchecks: `npm run test:unit`479/87 PASS16.44s;
`npm run build` med strict typecheck PASS (befintlig bundlevarning);
`git diff --check` PASS. Sampler-/crop, asset/source, resource-selection och
fyndintegrationer riktat PASS; faktisk browser enligt ovan. Taskhash efter push.
