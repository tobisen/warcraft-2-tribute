# Projektets pixelassets

Alla frames är nya repo-lokala pixelkompositioner skapade för warcraft-2-tribute.
Ingen rasterbild, originalspel-sprite, extern font eller tredjepartsart har
importerats. Källorna består av egna integer-pixelpenslar och kompositioner;
exporten använder endast Node:s inbyggda zlib/fs. Assets är framställda för
användning, ändring och distribution med projektet. Denna task ändrar inte
projektets övergripande licens eller publicerar assets någon annanstans.

- [Palett](palette.json): alla opaka RGBA-färger (alpha 255).
- [World-källa](sources/world.mjs): handkomponerade tiles/noder, inga runtime-mapgeneratorer.
- [Pixelpenslar/PNG-export](../scripts/pixelArt.mjs): heltal, hårda pixelkanter, PNG 8-bit RGBA.
- [Exportkommando](../scripts/export-assets.mjs): `npm run assets:export`.
- [Manifest](../public/assets/manifest.json): stabila frame-ID:n, atlas, källa/origin och ankare.
- [Atlas-data](../public/assets/world-atlas.json) och [PNG](../public/assets/world-atlas.png).

Atlas 256 × 128 px, scale 1, inga trim/rotations. `grass-a`, `grass-b`, `rock`
och `water` är 32 × 32 med top-left-origin (0,0). De fyra resource-framesen
är 64 × 64 transparent RGBA: wood/gold × available/depleted. Ankare (32,40)
mappar till nodens befintliga world-center; Phaser-origin är (0.5,0.625).
Den oförändrade logiska footprinten är 40 × 40 kring nodcentrum (nodeRadius 20).
Kronor/stenar är dekor utanför footprinten, inte nya hinder/klickytor.

Phaser använder pixelArt/nearest-neighbor och roundPixels endast för rendering.
Positioner/ranges/timers förblir world-floats; resurser börjar fortsatt på
400 wood/300 gold och kräver faktisk gathering/delivery. Fog döljer okända
områden och visar resource-depletion bara med current vision; utanför vision
används en statisk known-resource-symbol utan dold depletion-information.
Minimapens markörer och footprintdata behåller befintlig modell.

RTS-053-tillägg: native gräs med enhetlig grundton, pixelstrand/bergskanter endast vid exponerade patchkanter och egna skogs-/gruvresurser. Övergångar ändrar inte navigation eller footprints. Exporten omfattar 16 world-frames.

## RTS-054 – Byggnadssprites

Egen RGBA-atlas från assets/sources/buildings.mjs: bas, barracks, farm och Forge med blå/röd heraldik och tre statiska frames (grund, halvbygge, färdig). 128 px standard, farm 64 px; ankare är (.5,.75) vid logisk footprint-center. Native rendering utan skalning; befintliga footprints (spelbas 48 px, fiendebas 96 px, andra byggnader 64 px), HP och byggtid ändras inte. Foundation används över halva återstående byggtiden; halvbygge därefter, färdig vid noll. Enemy-varianter finns för alla typer men inga nya enemy-byggsystem införs. Fog/death tar bort renderobjekt; selection följer footprint, bas/fiendebas har synlig HP-text. Källor/palett/atlas/manifest exporteras med assets:export, ingen extern spelgrafik.

## RTS-055 – Enhetsanimationer

960 egna RGBA-frames i units-atlas från assets/sources/units.mjs: worker med verktyg, armored soldier/sköld, archer/båge och träcatapult. Blå/röda lagfärger, åtta riktningar (E, SE, S, SW, W, NW, N, NE), idle 1 och walk/attack/death 4 frames; worker gather/build 4. Humanframes 32 px med ankare (16,22), catapult 64 px (32,40). Walk/work/attack loopar i 8 FPS, death är en separat 0,5 s presentationsrest efter logical removal, utan HP/selection/target. Fog hiding skapar ingen död; dolda/dead renderobjekt och rests städas vid reset. Facing/state/frame väljs i presentation/animation.ts; simulationstiden styr bildtid, paus fryser även frames. Damage, gathering och construction drivs fortfarande enbart av gameplay-delta, aldrig animationsevents. Hitboxes/navigation/supply är oförändrade. Källor är egen originalkomposition, inga importerade spelsprites.

## RTS-056 – Eget ljud

16 s originalkomposition och command/impact/complete/victory/defeat från scripts/export-audio.py, PCM WAV-masters (mono 24 kHz/16 bit) och lokala Vorbis OGG med WAV-fallback. Manifest beskriver loop/duration/normaliseringsvolym. Appens enda Web Audio-graf skapas efter första klick/tangent eller Aktivera ljud; separata master/effects/music och mute verkar direkt, inställningar bevaras vid scene-restart. Pause suspenderar grafen; menu/game over/reset stoppar gamla källor. Musiken loopar exakt 16 s och exkluderar codec-padding. Throttle och looplängd finns i config/audio.ts. Public damage/completion hörs; enemy-händelser kräver syn både före och efter, och hidden removal/reveal är tyst. Saknat ljud blockerar inte gameplay.

Chromium-desktop är verifierad ljudprofil (OGG och WAV); andra browsermotorer är ännu inte verifierade. Exportverktyget soundfile används endast utanför projektets runtime/npm-dependencies: skapa en temporär Python-venv, installera soundfile där och kör scripts/export-audio.py, eller npm run audio:export med sådan miljö. Färdiga assets är incheckade; npm ci/build behöver inget Python-ljudverktyg.

Alla egna pixel- och ljudassets får användas, ändras och distribueras tillsammans med detta projekt. Ingen extern inspelning eller spelgrafik ingår och ingen tredjepartsattribution behövs. Ljudexportens optional soundfile/libsndfile är verktyg, inte inkluderade runtimebibliotek.

## RTS-057 – Fantasy-HUD och effekter

Original trä-/mässingspanel med 16-px border, åtta 32-px ikoner och läsbara blå/röda lagfärger. Desktop (1280×900) har 280-px scrollande kommandopanel intill native 800×600 world; under 1120 px staplas world/HUD, inga worldkoordinater skalas. Georgia/systemfont är lokala standardfonts, inga externa font-/assetanrop. Hover/pressed/disabled/focus är olika; text/labels och keyboard-guide finns kvar, aria-pressed visar modes. HP är kompakta staplar; worker-last visas vid markerad worker, detaljer kvar i status.

Impact 32 px och splash 64 px har fyra egna frames i 8 FPS, 0,5 s bounded lifetime/max 64 effekter. Presentation visar synliga projektilers landningspunkt, även en synlig miss, utan att läsa dold HP eller driva damage. Fog/pause/reset styr effekternas syn/livstid; gameplay och inputfunktioner är oförändrade. Exportkälla assets/sources/ui.mjs, manifest/panel/atlas under public/assets.

## RTS-067 – Originalfraktioner

Kronförbundets människosprites behåller ursprungliga frame-ID:n. Järnklanens orcher har `clans-`-prefix: grönt skinn, betar/öron, axelpartier, yxkrigare och benprydda stenmaskiner; byggnader har träpalisader, hudtak och benheraldik. Samma native ankare och footprints gäller för båda blå/röda lagvarianterna. Exporten innehåller 1 920 unit-frames i 2048×4096 RGBA och 48 byggframes i 1024×768 RGBA. Manifestet anger varje frames fraktion. Alla bilder är egna repo-lokala pixelkompositioner och får ändras/distribueras med projektet enligt samma villkor som tidigare assets; ingen spelgrafik importerades. Befintliga world/UI/ljudassets är oförändrade.
