# RTS-155 – Nya fraktionsreferenser

## Underlag och mandat

Användaren accepterade Human-worker/melee/base som tillräckligt bra för tillfället
2026-10-04 och bad att de nya bilderna för andra raser används. Bilderna nedan
har granskats visuellt och registreras som stilunderlag inom RTS-155.
Referensbilderna är lokala och otrackade; originalen bevaras. Worker, melee
och huvudbyggnad har nu egna spelassets utifrån dessa referenser; gameplay
och alla befintliga namn behålls.

## Identifierade bilder

### Orcs

Spelets fraktions-ID: `clans`.

- Units: [ChatGPT-bild 4 okt. 2026 18_20_19-1.png](<../../docs/art/ChatGPT-bild 4 okt. 2026 18_20_19-1.png>). SHA256 `6761c8d37b37d39edd0fdc6ea85ad15852f3f688e89b1c88ca6c9bcd3f2c63c3`.
- Buildings: [ChatGPT-bild 4 okt. 2026 18_20_19-2.png](<../../docs/art/ChatGPT-bild 4 okt. 2026 18_20_19-2.png>). SHA256 `c0ee1daf75a2f5abe7758948f282bc0a3a312592383f54cb4a42ed1853a4f444`.

### Elves

Spelets fraktions-ID: `elves`.

- Units: [ChatGPT-bild 4 okt. 2026 18_20_20-3.png](<../../docs/art/ChatGPT-bild 4 okt. 2026 18_20_20-3.png>). SHA256 `861ad2aa03735684c57178caa0a62f8e3d51dd52ac1abe0ff99ed56d987b8f9d`.
- Buildings: [ChatGPT-bild 4 okt. 2026 18_20_21-4.png](<../../docs/art/ChatGPT-bild 4 okt. 2026 18_20_21-4.png>). SHA256 `e6b1a6a0f5e25040945b95992eed8ec3ed4e05c00b86a7adaad6bea87cbd3367`.

### Dwarves

Spelets fraktions-ID: `dwarves`.

- Units: [ChatGPT-bild 4 okt. 2026 18_20_22-5.png](<../../docs/art/ChatGPT-bild 4 okt. 2026 18_20_22-5.png>). SHA256 `15d9c17ccdd4163160ed4a6576ee9183d76f450f1aba4ef251873ed8ac186328`.
- Buildings: [ChatGPT-bild 4 okt. 2026 18_20_23-6.png](<../../docs/art/ChatGPT-bild 4 okt. 2026 18_20_23-6.png>). SHA256 `594acb373616ac04fcee5ed26ff2fc590a04ba053f71db9a784d3420d0b41dea`.

### Goblins – teknikerreferensen

Spelets fraktions-ID: `goblins` (uttryckligen bekräftat av användaren2026-10-04; behåll namnen).

- Units: [ChatGPT-bild 4 okt. 2026 18_20_24-7.png](<../../docs/art/ChatGPT-bild 4 okt. 2026 18_20_24-7.png>). SHA256 `fcbae64895349f584b4b935a5e658827f90614672092477403179e1020fd9fa1`.
- Buildings: [ChatGPT-bild 4 okt. 2026 18_20_24-8.png](<../../docs/art/ChatGPT-bild 4 okt. 2026 18_20_24-8.png>). SHA256 `6c8c0e98620060fd97814e5688b0af941d4a53f711ac093d359113c23b9eb3cf`.

## Tillämpning på befintliga roller

- Orcs: grön hud, svart tofs, röd läderklädsel, grova yxor/sköldar; huvudbyggnad med timmer, röda tak, metallbeslag och betar.
- Elves: blondt hår, spetsiga öron, grönt/guld, slankare kropp och lövheraldik; huvudbyggnad med levande träd, gröna tak och ljusa valv.
- Dwarves: kortare bred kropp, kopparskägg, blått/guld, hjälm och hacka/yxa; huvudbyggnad med tung sten, blå tak, kopparbeslag och skorstenar.
- Den fjärde bildgruppen visar vita skägg, goggles, vinröda mössor och turkos/mässing. Användaren har bekräftat att den ska användas för Goblins med befintliga namn kvar.

Enhetskolumnernas visuella roller kan användas för worker, soldier, archer,
specialist och catapult utan att ändra stats, namn eller förmågor. Namnen i
bilderna motsvarar inte alltid spelets namn; de inför inga nya enhetstyper.
Byggnadsbilderna ger underlag för base, barracks, farm och forge. Den separata
ranged-byggnaden har ingen egen befintlig byggnadstyp och ska inte skapa en ny.

Bilderna visar riktningar och design, men inte kompletta gång-, attack-,
gather-, build- eller death-animationer. Dessa måste bearbetas till egna
spelassets och granskas; godtyckliga crops av illustrationsarket är inte
animationsframes. Sjöunits/harbor saknar underlag i dessa åtta bilder.

## Källa, export och rendering

De äldre fraktionsassetsen bestod av små generiska figurer och enklare byggnader.
Precis som Human-slicen var bristen främst källgrafikens detaljnivå och identitet;
korrekta atlas-ID:n gjorde inte dessa bilder referensenliga. Egna integer-pixel-
kompositioner i [faction-people.mjs](faction-people.mjs) och
[faction-bases.mjs](faction-bases.mjs) använder material, verktyg, kläder, heraldik
 och arkitektur från de nya referenserna. Human-kompositionerna är oförändrade;
 deras materialpenslar återanvänds. Inga illustrationsraster importeras eller
 godtyckliga crops används som animationer.

Worker och soldier använder64×64-celler, ankare(32,44), åtta riktningar och
befintliga idle/walk/attack/death samt worker gather/build. Sidoposer, speglade
västriktningar, steg och arbetssvingar är komponerade i källorna. Rustning och
kännetecken behålls vid kollaps. Byggnaderna använder128×128 med ankare(64,96)
och foundation/building/complete/damaged. TeamBlue/TeamRed syns i kläder,
sköldar och byggnadsbanners utöver fraktionens baspalett. HP/cargo-offsets
utvidgas till dessa högre sprites; body, movement, selection och footprints
48/96px för base ändras inte. Andra roller har fortfarande sina äldre assets.

[audit-faction-art.mjs](../../scripts/audit-faction-art.mjs) jämför originalkällor
från c5b3c71 och nya källor med respektive exporterade PNG. Samtliga2176 ändrade
unitframes och32 baseframes stämmer pixel för pixel. Noll mismatchar både före
 och efter, noll ändrade raster utanför dessa slices; alla frame-ID:n bevarade.
 [Auditrapport](../../artifacts/rts-155/factions/source-export-audit.json).

## Visuell granskning

[Före/efter-galleriet](../../artifacts/rts-155/factions/index.html) visar samma
arena/kamera/positionsfixture vid Native800×600 och1280×720 för samtliga fyra
fraktioner. [check-faction-art.mjs](../../scripts/check-faction-art.mjs) använder
riktig Phaser/Vite i extern Playwright/Chromium. Fraktion väljs genom ordinarie
meny; scriptet exponerar en tillfällig inspektionshook genom browser-routing.
Denna hook och scenfixture ingår inte i levererat spel. Före läser atlaser från
c5b3c71; efter läser nuvarande export. Browserloggen ligger i respektive
fraktionsmapps before-/after-rendering.json. Verktygsmiljön anges med
W2T_PLAYWRIGHT_MODULE, W2T_BROWSER_EXECUTABLE, W2T_UI_URL och W2T_ART_FACTION.
W2T_ART_STAGE=before väljer jämförelsebaseline.

Fysiska klick verifierar worker/melee/base selection och oförändrade namn.
Worker och melee visas separat med porträtt och tillsammans. Rörelse använder
verklig update och verifierar positionsändring, walk-frame, rätt atlas-koordinater
 och skala1. Gather/build/attack/death-bilder är **explicit valda poser**; de
 påstår inte betald gameplay/combat/death. Kontaktblad visar alla riktningar,
 fyra actionframes och båda lagens enheter/base-stadier. Canvas använder
 pixelated/nearest och porträtt har smoothing avstängt.

Visuell granskning omfattar normal spelstorlek mot gräs, labels/selection,
porträtt, movement och kontaktblad. Orcs är gröna med yxor/betar, Elves blonda
med smalare kroppar/gröna tak/träd, Dwarves bredare med skägg/sten/koppar,
Goblins vita skägg/goggles/turkos dome/verkstad. Källorna är speladaptioner med
färre mikrodetaljer än illustrationerna, inte pixelidentiska kopior.
Under arbetet korrigerades en klippt upphöjd attackpose, sidoprofil och
rustningskontinuitet vid död; slutliga screenshots/checks är gjorda efter dessa ändringar.
En initial scenfixture använde Human HP60 även för andra soldater. Den visuella
fixturen korrigerades till respektive fraktions riktiga maxHP och före/efter
kördes om; ingen gameplay-HP-kod ändrades. Slutlig browserkörning PASS i samtliga
fall utan pageerrors. Unit433/77 PASS, build inklusive strict typecheck PASS och
diff-/dokumentlänkkontroll PASS. Build har fortsatt befintlig bundlevarning.
Tekniska tester kontrollerar exakt export, transparenta kanter, anchors/footprints,
lagfärg, riktningar och animationsvariation. HP-barens nederkant ligger ovanför
samtliga levande spriteposer. Passerade tester ersätter inte estetisk bedömning.

## Status och avgränsning

Human-referensslicen är accepterad av användaren för tillfället. Worker/melee/base
för Orcs, Elves, Dwarves och Goblins är implementerade och visuellt granskade mot referenserna.
Detta delpass (987eaad) ändrade endast worker/melee/base. Återstående landmotiv är därefter adapterade enligt [slutprotokollet](complete-references.md); RTS-155 är Done enligt det senaste referensmandatet. Sjöreferenser saknas fortfarande och sjöassets är oförändrade. Ingen ny fraktion, enhetstyp, byggnadstyp eller förmåga införs. Bottom bar-fixen är separat. RTS-156 och senare startas inte. Ingen ny CI-/Pages-/kampanjverifiering hävdas.
