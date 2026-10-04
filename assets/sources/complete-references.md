# RTS-155 – Alla landmotiv från referenserna

Användaren bad efter referensslicen uttryckligen att alla saker i bilderna för
alla raser används, följt av commit/push. Detta pass avslutar återstående land-
assets inom RTS-155. De tio lokala referensernas SHA256 finns i
[auditrapporten](../../artifacts/rts-155/complete/source-export-audit.json).
Human-bilder beskrivs i [Human-protokollet](humans.md), andra bilder identifieras
med filnamn i [fraktionsprotokollet](faction-references.md). Originalen i docs/art
bevaras lokalt och otrackade.

## Komplett koppling till spelets roller

| Fraktion | Ranged: befintligt namn och referensmotiv | Specialist: befintligt namn och referensmotiv | Siege: befintligt namn och referensmotiv |
| --- | --- | --- | --- |
| Humans | Archer: blå huva, quiver och båge | Banner Guard: Knight-rustning, plym, cape och svärd | Catapult: timmerkastarm, sten, hjul och besättning |
| Orcs | Hunter: Spearthrower med red bandana och kastspjut | Raider: svart hår, betar, tung rustning, cape och svärd | Stone Thrower: timmerkastarm, sten och grön besättning |
| Elves | Longbow: grön huva, quiver och båge | Marksman: Warden-rustning, guld, plym och cape; behåller båge för befintlig ranged-combat | Ballista: bred armbåge, bult, trä, hjul och besättning |
| Dwarves | Crossbow: skägg, hjälm och armborst | Bulwark: Hammer Guard, tung rustning, stor sköld och rune-hammare | Cannon: metallpipa, kopparringar, hjul och besättning |
| Goblins | Slinger: Rifleman-mössa, goggles och rifle-grafik; befintlig projectile-combat kvar | Grenadier: Engineer-mössa, vitt skägg, goggles, brass-pack och skiftnyckel; befintlig granatattack kvar | Mortar: upphöjd pipa, mässing, hjul och teknikerbesättning |

Worker, melee och huvudbyggnad är redan adapterade för alla fem fraktioner och
bevaras pixel för pixel i detta pass. Samtliga fem referenskolumner har alltså
motsvarande befintlig spelroll. Namn, combat-mode, stats, prerequisites, abilities,
träning, supply, selection och input ändras inte för att efterlikna en bildtext.

Alla fem byggnadsmotiv används per fraktion:

- Base behåller den redan granskade referensadaptionen.
- Barracks använder huvudmotivet och en synlig ranged-wing med torn, targets,
  vapenställ och utrustning från den separata ranged-byggnaden. Inga nya
  byggnadstyper, recipes eller gameplayfunktioner införs.
- Farm har vindkvarn/halmtak/vete (Humans), rund burrow/betar/vete (Orcs),
  gröna tak/rötter/garden (Elves), sten/koppar/blått tak/grain-crane (Dwarves),
  turkos greenhouse, mässing/vindkvarn/garden (Goblins).
- Forge har skorsten/ugn/anvil (Humans), stor forge-wheel/betar/ugn (Orcs),
  crystal/gold/levande trä (Elves), sten/koppar/furnace (Dwarves), samt brass
  boiler, pipes, greenhouse-cylinder, gear och crane (Goblins).

## Källgrafik, export och runtime

[roster-complete.mjs](roster-complete.mjs) och
[settlement-complete.mjs](settlement-complete.mjs) är egna integer-pixel-
kompositioner med befintliga materialpenslar. Inga importerade illustrations-
raster, nedskalade helbilder eller godtyckliga crops av animationsframes.
Nya ranged/specialist/siege har64px celler i befintliga64px atlasslots.
Unit-ankare är(32,44), siege(32,40), oförändrat normaliserat origin. Farm
behåller64px/ankare(32,48); övriga byggnader128px/ankare(64,96). Alla logiska
footprints, atlas-ID:n och antal5840unit/200buildingframes behålls.

Åtta riktningar och befintliga idle/walk/attack/death samt worker gather/build.
Ranged har draw/recoil/throw; specialister har swing/bomb-pose, siege har
kastarm/recoil/bult och besättning. Building foundation/building/complete/damaged
är separata poser. HP-barer flyttas över de nya silhuetterna; navals original-
offsets kvar. Test kontrollerar att labels inte överlappar levande poser.

[audit-complete-art.mjs](../../scripts/audit-complete-art.mjs) jämför baseline
987eaad och aktuell källgrafik mot exporterade PNG:3120 ändrade unitframes,
120 buildingframes. Noll source/exportmismatchar före/efter, noll förändrade
raster utanför dessa återstående assetgrupper. Tidigare worker/melee/base,
harbor/naval och andra atlasser är bevarade. Referensbilderna används som
stilunderlag; deras stora illustrerade mikrodetaljer är inte pixelidentiskt
överförda till de mindre spelassetsen.

## Visuell evidens och avgränsning

[Före/efter-galleri](../../artifacts/rts-155/complete/index.html) visar samma
arena/kamera/positionsfixture, alla fem raser vid Native800×600 och1280×720.
[check-roster-art.mjs](../../scripts/check-roster-art.mjs) använder riktig
Phaser/Vite med extern Playwright/Chromium och tillfällig browser-routing för
inspektion; fixture och hook ingår inte i appen. Fysiska klick verifierar
ranged/specialist/siege och barracks/farm/forge selection, namn och porträtt.
Movement använder ordinarie update med verifierade walk-frames, skalor och
atlas-koordinater. Attack/death är **explicit valda poser**, inte påstådd betald
combat eller full matchregression. Kontaktblad visar alla roller/riktningar och
lag, alla animationsframes, samt base/barracks/farm/forge i samtliga fyra stadier.
I byggnadsfixturen döljs basbilden för att visa de tre nya byggnaderna tydligt;
basen och tidigare sprites är fortsatt med i kontaktblad/roster-vyn.

Kör med W2T_PLAYWRIGHT_MODULE, W2T_BROWSER_EXECUTABLE, W2T_UI_URL och
W2T_ART_FACTION (crown/clans/elves/dwarves/goblins). W2T_ART_STAGE=before
hämtar atlaser från987eaad. PNG och before-/after-rendering.json finns i
artifacts/rts-155/complete per fraktion.

Under arbetet upptäcktes och korrigerades en täckt Orc forge-lagfärg, för hög
nordlig siege-attackpose och vindkvarnsarm vid cellkanten. Ett uttömmande test
hade fler individuella kantassertions än dess5000ms-budget tillät; det
kontrollerar nu alla samma kantpixlar i en samlad assertion per frame.
Tekniska tester ersätter inte visuell kvalitetsbedömning. Ingen senare RTS-task,
ny fraktion eller gameplayfunktion startas. Bottom bar-fixen är separat.
Sjöassets saknar motiv i de tio referensbilderna och ingår inte i denna
referensleverans. Ingen ny CI/Pages eller campaign-/matchsimulering påstås.

## Slutliga checks

Slutlig `npm run test:unit`:435 tester/78 filer PASS. `npm run build` inklusive strict typecheck PASS (befintlig bundlevarning). Slutlig audit och browserföre/efter för fem raser vid800×600/1280×720 PASS; slutbilder visuellt granskade. Dokumentlänkar och `git diff --check` PASS. Inga campaign-simuleringar eller nya CI/Pages-checks. RTS-155 Done enligt referensmandatet; inga senare tasks startas.
