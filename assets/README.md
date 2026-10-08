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

## RTS-089 – Sjöpresentation

[assets/sources/naval.mjs](sources/naval.mjs) ger832 original64px RGBA-frames:
stridsfartyg med bogkanon och transport med lådor/lastdäck, båda fraktioner,
båda lag och åtta riktningar. Idle1, rörelse/attack/sjunk4,8FPS; ankare32,40.
Timber, heraldiska segel, vaken och synlig sjunkning använder samma palett.
Hamnens egna brygga/kran/magasin/lyktor har tre byggstadier och lagvarianter
från befintlig building-source (60frames,1024x1024). Navalatlas1024x3328.
Fysiska32px-fartyg/64px-hamn, HP/supply/navigation och timrar är oförändrade.

Två originalsynteser cannon0,4s och splash0,5s i samma exporter/PCM24kHz
med OGG/WAV-alternativ. Sjunkljud kräver verklig synlig death; hide/reveal/
boarding är tyst. Nya synliga kanonskott hörs, sparad redan flygande
projektil/reveal ger ingen ny avfyrningssignal. Befintlig gesture, mute,
volym och pause/reset-graf används. Originalkällor/bruk finns i
[ASSET_LICENSE.md](ASSET_LICENSE.md). `npm run assets:export` och optional
`PYTHONPATH=/tmp/w2t-audio-tools npm run audio:export` återskapar exporter;
tmp-path är verifieringsmiljön, ingen projektdependency.

## RTS-111 – Terrängvariation och kust

World-atlas är nu 256×192 RGBA med23 frames: fyra lågkontrast-gräsvarianter,
två vattenvarianter, rock, åtta exponerade kanter, fyra konkava kusthörn och
fyra resource states. terrainFrame bevarar patchernas rock/water-identitet;
terrainImageFrame väljer vattenvariation separat. Coordinatehash väljer
statiska gräsdetaljer; kartan genereras inte proceduralt. Vatten har gemensam
grundton utan tilebreda mörka ränder. Kanten har jord/foam och samma djup vid
tileändar; diagonala landkontakter får ett hörn även mellan två vattengrannar.
Utanför världen fortsätter samma terräng, så världskanten ger ingen falsk kust.
Skogskronor, stam och gruvsprickor har originaldetaljer från samma palett.

Navigation, resursmängder, hitboxes, 40px nodefootprint, ankare32,40, fog och
Saveformat ändras inte. Små grässtrån är dekor, aldrig hinder. Native32px,
nearest/roundPixels och repo-lokal källa/export/licens gäller fortfarande.

## RTS-112 – Byggnadstyper och synlig skada

Buildingatlas1024×1280 innehåller80 originalframes: fem byggnadstyper,
båda fraktioner/lag och foundation/building/complete/damaged. Warhut har
vapenställ och sköld, Stronghold benprydda torn, Smithy skorsten/anvil/ugn,
Cattlepen foder/staket och Harbor bryggdetaljer/lådor. Motsvarande Crown-
detaljer använder samma ljus från övre vänster, skala och blå/röd heraldik.

buildingFrame väljer damaged vid0<HP≤50% av typens befintliga maxHP, endast
när byggnaden är färdig. Tröskeln är presentationsconfig i buildingArt.ts.
Trasiga takbjälkar, sprickor och spillror är statiska; ingen eld, repair,
skadeberäkning eller timer tillkommer. Own portraits använder samma frame.
Synlig enemybase/outpost följer också HP; befintligt entityVisible-filter
körs före frameval, så dold skada avslöjas inte. Construction och removed/
dead/fog-renderobjekt följer befintlig lifecycle. Save behåller endast HP,
inte bildstate; frame härleds på load/restart. Ankare/footprints är oförändrade.

## RTS-113 – Läsbara enhetstyper och animationer

Worker har verktyg, brätte, rem och satchel; soldier har armor/axelplåtar,
Crown-hjälmprydnad/sköld eller Clans-axe/bone. Archer får hood/quiver och
animerad bågsträng i attack. Catapult har tydligare tvärbalk/teamplåt och
hjulekrar som följer gångposer. Naval hull/lastdäck/kanon/heraldik skiljer
roller och fraktioner; kanon får rekyl och gångvak har tre synliga faser.
Spiked Clans-bog respektive Crown-bogdetaljer renderas före vapen/last.

1920land- och832navalframes, stabilaID:n, åtta riktningar, native32/64px,
ankare16,22/32,40, palett och befintlig8FPS/0.5sdeath-lifecycle kvarstår.
Stats, gameplay, hitboxes, fog, selection, Save och eventtiming ändras inte.
Enbart egna repo-lokala pixelkällor, inga importerade bilder. Unitsmanifestets
width korrigeras från4096 till faktiskPNG2048; height4096 är oförändrad.
Rasterregressioner kontrollerar typ/riktningsvariation och minst tre olika
walk/attack/death-frames; icke-stridande transport har inget attackbeteende.

## RTS-114 – Begränsad combat-feedback

Presentation/effects.ts väljer arrow/stone/cannonball från befintlig projectile;
marine har företräde framför splash. Arrow har riktad14px shaft/fjäder/spets,
stone4px och cannonball3px har kort8px trail och highlight. Draw använder
PhaserGraphics i presentation; inga gameplayfält eller damageevents ändras.
Visible landningar/misses ger befintliga impact/splash. PublicHealth-samples
från own warningSnapshot och entityVisible-enemies ger hit endast vid faktiskt
minskad positivHP i två konsekutiva synliga snapshots; spawn/reveal/heal/hide/
remove/load är inte hits. Samples seedas om på reset och paus är tyst.

FX-sprites är glesa original32/64px med fyra8FPS-faser,0.5s livstid och
max64. Nearby samma kind mergeas inom8px/0.15s. Synlig faktisk death ger
land-dust eller befintlig naval-sinking; boarding/fog hiding ger ingen death.
Ground-effects/dead sprites på depth−1 underunits0; projectile5, selection6,
HP7 och fog40. Alpha0.8 och glesa sprites bevarar läsbarheten. UI-atlas512×160
med21frames. Save lagrar fortfarande inte temporära effekter: load/restart
rensar dem, paus fryser bildtid och terminal match stoppar simulationen.

## RTS-117 – Original arbets- och produktionsljud

Tre ytterligare cues från scripts/export-audio.py: gather0.12s, build0.16s och
train0.35s. Totalt11 originalkompositioner/effekter, mono24kHz/16-bit WAV-masters
med lokala OGG och identisk WAV-fallback. Peak för nya cues0.156/0.227/0.098;
alla filer är icke-tysta och utan sample-clipping. Befintliga OGG-filer bevaras
för att undvika encoder-serialbrus vid ny export. Effektmix ligger i config,
inte i assetmanifestets grundvolym. Ingen extern röst/ljudinspelning tillkommer.
Faktisk mänsklig matchlyssning är uppskjuten till senare enligt användaren; teknisk verifiering är utförd.

## RTS-118 – Egna texter, inga inspelade röstassets

config/voices.ts innehåller36 originaltexter för selection/order. Inga nya
röst-WAV/OGG-filer eller originalspelinspelningar har tillförts. Browserns
lokala engelska SpeechSynthesis kan läsa dem; remote voices väljs inte.
Native capability/funktion verifieras separat från mänsklig lyssning.
Om lokal voice saknas är funktionen tyst och tydligt otillgänglig i status.

## RTS-126 – Genererad originalillustration

[Source/provenance](sources/home-fantasy-126.md),
[PNG-master](sources/home-fantasy-126.png),
[JPEG-runtime](../public/assets/home-fantasy-126.jpg). Inbyggt imagegen, inga
externa referensbilder; fem fantasyfolk och original landscape/costumes.
Master1672×941, runtime JPEG85 exporterad med sips. HTML-menu/title läggs
ovanpå i appen och finns inte i bilden. Befintlig musik används för ambience;
ingen ytterligare ljud-/röstasset. Lyssning uppskjuten enligt användaren.

## RTS-136 – Human Banner Guard

Egen32px specialist med guldrustning, bred kite shield och fana i sources/units.mjs. Två teamägare, åtta riktningar, idle1 och walk/attack/death4frames vardera, samma8FPS. Ingen extern rasterreferens eller ny genererad illustration; utökar etablerade repo-native pixelkällor.2128frames i2048×4352atlas, metadata/PNG uppdaterade tillsammans. Befintliga Human-stenbyggnader, tak, heraldik och byggfaser återanvänds; deras logiska player-base48px/enemy-base96px bevaras. Rastertester verifierar distinct specialist-silhuett, åtta riktningar, minst tre motion/combat/death-faser och projektpalett.

## RTS-137 – Orc Raider

Original32px Raider i sources/units.mjs med bar hud/huvud, lätt läderrustning och andra yxan.208egna frames för två ägare/åtta riktningar/idle-walk-attack-death, samma8FPS/palett/anchors. Unit-atlas2048×4736 har2336frames för två femrolls-rosters; PNG/metadatamanifest exporterade tillsammans. Rastertester skiljer silhuett/riktningar och minst tre animationsfaser. Befintliga Orc-spik/tusk-/träbyggnader och navalbilder återanvänds. Ingen extern rasterreferens, ingen ny AI-bild eller attribution.

## RTS-138 – Original woodland-roster

Elves har egna leaf-cloaks/öron, verktyg, Warden-spear/leafshield, Longbow/quiver, Marksman-guld/vit headband och Ballista med riktad bult. Building-källan ger root/pillar/canopy, Garden, Moon Workshop och River Dock; fyra separata bygg/damagefaser. Naval har carved leaf-prow/sails och transportcanopy. Två lagägare/åtta unit- och fartygsriktningar; samma anchors/palett/animationer. Export:3504unitframes2048×7040,120buildingframes1024×1920,1248navalframes1024×4992. PNG/metadatamanifest exporterade tillsammans, alla dimensioner under8192px. Egna repo-native kompositioner utan externa rasterreferenser.

## RTS-139 – Original Dwarf-pixelgrafik

Dwarves har egna korta/breda skägg-/metal-/hammer-/shield-/crossbow-silhuetter och Cannon utan stonebasket. Stone-vaults, buttresses, Storehouse-crates, Foundry-furnace och Stone Dock; armored slab naval-hull och metallkabin. Två teamägare/åtta unit/fartygs-riktningar, samma native32/64px,8FPS och fyra buildingstages. Unit-atlas4096×4672/4672frames packas64kolumner för texturegränsen; byggatlas1024×2560/160, naval1024×6656/1664. Befintliga ID:n/anchors bevaras och PNG/JSON/manifest exporteras tillsammans. Samma egna repo-native källor/palett/villkor.

## RTS-140 – Original Goblin-pixelgrafik

Egen liten green/goggle/nose/ear-roster, verktyg/scrap/slingshot/grenade och låg rekyl-/flash-Mortar. Patchwork tin/bent timber, antenn, förrådsfat, Lab-vial/pipes och Junk Dock. Naval har jagged hull/metalpatch/drums och olika cannon/cargo-deck. Två ägare/åtta unit/fartygsriktningar och etablerade animationsfaser. Fem rosters:5840unitframes4096×5888,200buildingframes1024×3200,2080navalframes2048×4160. Naval packas32kolumner istället för16; metadata-ID:n/anchors/logiska bodies bevaras och alla dimensioner under8192. PNG/JSON/manifest exporterade tillsammans i samma originalpalett/källmodell.


## RTS-155 – Samtliga landreferenser

Alla fem landroller för samtliga fem fraktioner har egna64×64-celler i befintliga atlasslots. Ankare är(32,44), siege(32,40); origin/logiska bodies bevaras. HP/cargo anpassas till silhuetterna. Base/barracks/forge är128px, farm64px; footprints och frame-ID:n bevaras. Ranged-byggnadens motiv integreras i befintlig barracks. Referenser är stilunderlag; inga illustrationscrops importeras.

RTS-155 är Done enligt användarens mandat för alla motiv i de tio landreferenserna. Sjöassets saknar underlag och är oförändrade. [Slutligt protokoll](sources/complete-references.md), [före/efter](../artifacts/rts-155/complete/index.html). Tidigare [Human](sources/humans.md) och [fraktionspass](sources/faction-references.md) är historiska delpass.


RTS-156: world-atlas256×256 med30 frames. Originalgräs/vatten/kust och sju nya väg-/dekor-/skogframes i world.mjs. Export via npm run assets:export. Faktisk browsergranskning och bilder i artifacts/rts-156.


RTS-157:15 lokala ljudfiler; export med PYTHONPATH till optional soundfile-miljö. Nya melee/bow/siege/buildingHit är egna synteseffekter. Faktisk lyssning återstår; se sources/attack-audio.md och artifacts/rts-157/battle-preview.wav.

RTS-158: utökad originaldialog med aktivitet/ras/rollvariation och lokal speech-fallback.380 inspelnings-ID:n saknar samtliga recording/license. Se sources/unit-voices-158.md; texter är inte röstassets.


RTS-159: worldatlas256×384/51 frames. wildlife.mjs innehåller egna32px djur/props; inga rasterreferenser. Två idle- och fyra gångposer. Se sources/wildlife-159.md och artifacts/rts-159. Kart-/djurgranskning är separat från kvarstående attackljudslyssning och saknade röstinspelningar.

PRIO-04: scripts/export-wildlife-audio.py exporterar egna stiliserade hjort-/kanin-/rävläten med endast Python-standardbibliotek. `npm run audio:export` inkluderar även dessa efter det befintliga soundfile-exportsteget. Mono24kHz/16bit WAV-masters/runtime och public/audio/wildlife-manifest.json; ingen OGG behövs för dessa korta clips. Se sources/interactive-wildlife.md för provenance, neutral gameplay och kvarstående faktisk lyssning.


## RTS-220 — Cavalry och Stable

[sources/cavalry.mjs](sources/cavalry.mjs) är ny egen integer-pixelkomposition
(CC0), exporterad med [export-cavalry](../scripts/export-cavalry.mjs). Inga
externa bilder eller modifieringar av användarens units.mjs. Separat atlas
innehåller fem mounts (horse/wolf/stag/ram/boar), teamfärger, åtta riktningar,
idle/walk/attack/death och fyra byggstadier för fem Stable-motsvarigheter.
Ikoner/porträtt croppar samma sprites. Detta är enkel procedural native-art;
fyra deathframes använder samma fallna pose och riders återanvänder grundform.
Ingen separat målad slutanimation eller mänskligt kvalitetsgodkännande hävdas.

RTS-220 rättelse2026-10-08: färdiga cavalry/Stable sprites ersatta med egna
imagegen-målade rasterkällor i befintlig visual-refresh-stil. Se
[sources/visual-refresh/cavalry.md](sources/visual-refresh/cavalry.md) för
prompter/källor/licens/export och faktiska begränsningar. Den äldre procedural-
leveransen ovan beskriver förebilden och gäller endast construction stages.

## RTS-221 — Healers

[Source, prompts and CC0](sources/visual-refresh/healers.md). Original painted
five-faction atlas, blue/red teams, genuine walk/cast poses in existing style.
`export-healers.mjs` packs only the new atlas; user units.mjs is preserved.
