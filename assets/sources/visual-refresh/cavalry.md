# RTS-220 revised cavalry and Stable art

Built-in imagegen, 2026-10-08, original project assets, CC0 dedication.
Style reference: repository-owned `crown.png` (approved visual refresh).
Masters: `cavalry.png` and `stables.png`; genuine generated alpha preserved.
No external game sprites, paid stock, or API/CLI generation.

Cavalry prompt: transparent original fantasy RTS sheet, five rows/four columns,
elevated southeast detailed painted pixel miniatures, matching the supplied
Human reference finish. Rows: blue/gold armored Knight on chestnut horse;
tusked Orc axe rider on gray wolf; leaf-armored Elf sword rider on antlered
stag; red-bearded Dwarf hammer rider on woolly curled-horn ram; goggled Goblin
cleaver rider on bristled tusked boar. Columns idle, left-step, right-step,
melee strike. Whole mounts, generous padding, blue team cloth, no text/grid.

Stable prompt: same miniature style/camera, transparent five-row one-column
sheet: blue-roof stone/timber horse stable; tusk/timber Wolf Den; living leaf
Stag Sanctuary; granite/brass Ram Enclosure; patched tin/timber Boar Pen.
Animal signs/heads, stalls, harnesses, small blue team banners; no terrain.

Export uses existing connected-component cropping/alpha-area reduction and
cloth recoloring from `frames.mjs`, explicit reviewed row boundaries, unchanged
64px unit/96px building cells and logical bodies. Runtime atlas includes genuine
walking/attack poses; western facing mirrors, northern facing shades. Death
collapses/fades, not separately painted death or eight independent perspectives.
Foundation/building stages retain original editable procedural art; completed/
damaged Stable uses painted art plus damage cracks. Portraits/actions use the
same atlas. `scripts/export-cavalry.mjs` rebuilds deterministically without
exporting or modifying the user's `units.mjs`.

Browser evidence: `artifacts/rts-220-art`, native800×600 for all five factions,
paid production via resource-cheat-funded actual clicks and gameplay ticks,
move/attack, Tech Tree, Save/Load/restart. Art inspection is distinct from tests;
no human balance or user approval of these revised assets claimed.
