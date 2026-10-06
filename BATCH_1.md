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

205 slutchecks: `npm run test:unit`479/87 PASS14.69s;
`npm run build` med strict typecheck PASS (befintlig bundlevarning);
`git diff --check` PASS. Sampler-/crop, asset/source, resource-selection och
fyndintegrationer riktat PASS; faktisk browser enligt ovan. Taskcommit a87d781 pushad till origin/main.

## RTS-206 — actiongrupper

Orders / Actions, Build, Train, Research och Spells har synliga rubriker och
egna ramar. Orders skiljs visuellt från Build; grupper utan relevanta actions
för selection döljs.40px ikonraster/40–44px visning och minst44px klickytor;
befintliga click handlers/hotkeydispatch oförändrade. Äldre mixed-caster-regeln
som plattade ut grupper och satte36px knappar ersätts. Bottom bar är184px,
216px enbart när worker/caster behöver både Build och Spells; horisontell
panelordning och minimap består, kartviewport anpassas via befintlig observer.

Native800×600/1280×720: worker, bas med full3-jobbkö, barracks, forge,
worker+caster och tom selection, samtliga utan scroll/klippning/överlapp.
Fysiskt farmclick och F via ordinarie callback startar samma placement,
Escape avbryter, order/selection bevaras. Explicit fryst UI-fixture med bank,
byggnader och caster är inte en betald full match.
[Browserverifiering](artifacts/rts-206/browser.json),
[worker](artifacts/rts-206/worker-800.png),
[mixed](artifacts/rts-206/mixed-800.png),
[full queue](artifacts/rts-206/base-full-queue-800.png).
Riktade actionPanel/selectionCollection/hotkeys18/3 PASS.

206 slutlig unit479/87 PASS16.44s, build inklusive strict typecheck PASS446ms,
`git diff --check` PASS. Granskning utan kvarvarande layout-/actionfynd.
206 Done;207 nästa. Full regression vid batchslut.

## RTS-207 — Tech Tree och Commands

Separata knappar direkt efter Mission; samma releasekälla består. Fyra
grenar (Settlement, Army, Fleet, Research), tre nivåer med namngivna beroenden,
valbara noder, kostnad/tid/supply, funktion, alla saknade krav och kampanjlås.
Owned/ready är Unlocked, affordable är Available, saknade prerequisites eller
kampanjadmission är Locked. Techview använder befintliga recipes och admission;
redan forskade nivåer förblir upplåsta även när Forge/Academy förstörts.
Detaljer visas under trädet; nodområdet har avgränsad vertikal scroll vid
behov. Ingen lång osorterad techtext i bottom bar.

Commands har Selection/Movement/Combat/Economy/Building/Camera med tre tydliga
kolumner. Alla actiontangenter kommer från hotkeys; mus/kamera följer befintlig
input. Dialogen pausar, fångar fokus och blockerar kartklick. Direkt öppnad
hjälp stängs till spelet med Escape/Close; redan pausad meny går tillbaka till
pausmenyn. Mission använder samma öppnings-/stängningsmönster.

Native800/1280 top bar även med10000-resursbank och full kö, tre techstatusar,
branch/nodeval, kostnad/prereq/campaign, samtliga visade hotkeys samt Escape,
Close och kartklickisolering PASS utan pageerrors.
[Browserreport](artifacts/rts-207/browser.json),
[Tech Tree](artifacts/rts-207/settlement-locked-800.png),
[research available](artifacts/rts-207/research-available-800.png),
[campaign restriction](artifacts/rts-207/campaign-locked-800.png),
[Commands](artifacts/rts-207/commands-800.png).
Första dialogens detaljer kom för långt ned i800; tätare header och separat
nodscroll rättade detta och slutbilderna granskades.31/5 riktade PASS;
unit481/88 PASS15.96s; build med strict typecheck PASS487ms och befintlig
bundlevarning. Slutlig `npm test`:1616/192 PASS652.44s; `git diff --check` och Markdownreferenser PASS. Actiongrupps-browsern återkörd efter topbarändringen PASS;206-bilderna visar slutlig207-topbar. Ingen ny CI-/Pages-/releaseverifiering. Batch1 avslutad; stanna före208.
