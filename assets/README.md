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
