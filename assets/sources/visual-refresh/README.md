# RTS-189: approved visual refresh (2026-10-06)

The user said “bilderna ser bra ut” after seeing the first generated air, Human,
Orc and building sheets. The same detailed fantasy pixel style continues across
Elf, Dwarf, Goblin and naval sheets. All images were made with the built-in
imagegen tool (no API/CLI, no imported game sprites). Source PNGs live here;
`scripts/export-visual-refresh.mjs` packs them after `npm run assets:export`.
The generated alpha is preserved; low-alpha fringe is omitted at native scale.
No gameplay bodies, costs, stats, visibility rules or Save format are changed.

## Prompt set

Shared land prompt: production transparent original fantasy RTS pixel sprite
atlas, exactly five rows/four columns, same unit in four distinct poses (idle,
left-foot walk, right-foot walk, attack), elevated southeast view, beautifully
shaded crisp detailed pixels, clear equipment/role silhouette, generous cell
padding, blue team accents, no background/text/grid/watermark. Readable at64px.

- `crown.png`: medieval blue/gold worker with hammer/wood pack, sword/kite-shield
  soldier, longbow archer, banner guard, crewed timber catapult.
- `clans.png`: green tusked peon with axe/sack, spiked axe warrior, bow hunter,
  dual-axe raider, rough crewed stone thrower.
- `elves.png`: pale slender grove tender, sword/leaf-shield warden, hooded
  longbow ranger, ornate elite marksman, silver/timber ballista.
- `dwarves.png`: broad red-bearded miner, iron axe guard, crossbow shooter,
  hammer/tower-shield bulwark, crewed brass cannon.
- `goblins.png`: small green pointed-ear tinkerer, salvaged-shield scrapper,
  slinger, goggled grenadier, crewed wheeled mortar.
- `air.png`: five rows/four flight poses: Human Gryphon Rider, Orc Wyvern Rider,
  Elf Great Eagle, Dwarf Gyrocopter, Goblin Airship. Same southeast viewpoint,
  transparent alpha, no TEMP/text diamonds, consistent scale and clear distinct
  wing/rotor/balloon silhouettes. Wings/rotor high, halfway, extended, low poses.
- `buildings.png`: five faction rows/six columns: keep, barracks, farm, forge,
  harbor, tower. Human blue-roof stone, Orc tusk/timber, Elf living trees/leaf
  roofs, Dwarf granite/brass, Goblin pipes/rivets/teal roofs. Detail-rich elevated
  southeast sprites, warm doors/furnaces, small blue team flags, no terrain/text.
- `naval.png`: five faction rows/four columns: warship idle/fire, transport
  idle/rocking. Distinct royal blue/white, rugged tusk/red sail, leaf-green,
  brass armored, teal patched steam ship silhouettes; no water background.

## Export and limits

Source row boundaries are explicitly reviewed; connected-component cropping removes disconnected scraps from neighboring cells; bounding boxes fit each pose
into existing atlas cells, with unchanged anchors and footprints. Blue cloth
is quantized to the existing blue team palette and remapped for enemy teams. Existing construction foundation/building stages
and walls/gates remain editable native source art. Completed/damaged buildings
use the new silhouettes; cracks and level markers remain explicit.

The generated poses face southeast. Western facing is mirrored and northern
facing shaded; these are eight facing *keys*, not eight independently painted
perspectives. Work/attack loops use idle/strike poses; death uses a bounded
collapse/fade from the new art. There are genuine two walking poses and four
flight poses; no claim of fully authored eight-direction animation sheets.
Fog, action timing, death lifetime, team tint and selection use existing systems.
