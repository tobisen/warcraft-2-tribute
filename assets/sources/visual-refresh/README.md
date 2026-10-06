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

## RTS-190 wildlife

`wildlife.png`: built-in imagegen followed by a background-extraction edit.
Prompt: transparent original fantasy RTS atlas, three rows (spotted amber deer
with antlers, expressive ivory/pink-eared rabbit, mischievous russet fox with
bushy white-tipped tail) and six columns (idle alert, grazing/sniffing, two
walk steps, stretched leap, landing). Charming natural forest animals, same
detailed fantasy style, no clothing/background/text; generous cell margins.
The final selected source contains real alpha; hidden RGB can appear brown in
a preview but is not drawn by the game. No opaque background is packed.

Existing32px cells and anchor(16,24) remain. Deer22px, rabbit18px, fox20px max
body height; six distinct source poses. Existing wander clock/flip and
selection/hunt/HP/death-fade/fog/save/audio behavior is unchanged. Terrain and
resources retain their original palette; new wildlife uses its source colors.


## RTS-205 native readability

The approved sheets remain the source for all five factions. Alpha-weighted area
reduction in [sample.mjs](sample.mjs) replaces nearest-neighbor decimation of the
large illustrations. This preserves narrow weapon edges and broad material
shading without increasing sprite size. Saturated blue cloth retains its source
highlights; only enemy cloth changes hue. Cell dimensions, anchor positions,
frame keys, loops and logical bodies remain unchanged. Portraits crop opaque
bounds rather than shrinking empty atlas margins; resource portraits now use
the same tree/mine frame as the world.

New original resource source: [resources-205.png](resources-205.png), generated
with the built-in imagegen tool. Prompt: transparent original fantasy RTS sheet,
three columns/two rows, oak/mine/closed chest then stump/depleted mine/open empty
chest; elevated southeast view, upper-left light, detailed crisp material
clusters and strong native48/96/32px silhouettes, no text/grid/copied game art.
[resources.mjs](resources.mjs) uses reviewed source bounds and the same reduction.
Actual alpha is retained; hidden RGB gradients are not rendered. Reference
terrain, legacy world resources and treasure rendering share these motifs.
No terrain geometry, resource quantities, collision, balance or save format
changes. The map rebuild remains paused.

Remaining authored animation limits: mirrored west/shaded north views rather
than separately painted eight directions, derived collapse/death poses and
existing strike/work poses. These are preserved, not claimed to be new final
animation artwork. See [batch report](../../../BATCH_1.md) for browser evidence,
source inventory and any remaining supplemental-art limits.


Supplement: [fortifications-205.png](fortifications-205.png), built-in imagegen,
original transparent five-faction/four-column sheet: academy with open-book
relief, short wall, closed gate and the same gate open. Human blue stone,
Orc tusk/red timber, Elf leaf/living wood, Dwarf granite/brass and Goblin
teal/rivet/pipe designs, upper-left light and southeast view, no text/grid.
Reviewed source columns preserve complete silhouettes. Completed/damaged/open
frames share the source; construction stages remain the existing native art.
Midtone team cloth uses the canonical palette while retaining dark/highlight
shading; an unobtrusive three-pixel team band covers motifs without blue cloth
(e.g. the Elven eagle), and Orc supplemental buildings retain a small team flag.
No wall footprint or gate passage changes in205; snapping belongs to209.
