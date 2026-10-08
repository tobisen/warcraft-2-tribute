# RTS-221 healer art

Original built-in imagegen, 2026-10-08, CC0 dedication. `healers.png` uses
repository-owned `crown.png` as style reference, no external game sprites.
Prompt: transparent five-row/four-column detailed fantasy RTS pixel atlas,
elevated southeast, idle/left-step/right-step/green healing-cast poses.
Rows: ivory/blue/gold Human Chaplain with staff/book; green tusked fur/bead
Orc Spirit Mender with bone staff/herbs; leaf-robed Elf Grove Healer with
branch staff/flowers; red-bearded blue/bronze Dwarf Rune Priest with rune
staff/scrolls; goggled cream-apron Goblin Field Medic with medical staff,
bandages and satchel. Consistent characters, blue team accents, whole bodies,
no text/grid/background/watermark. Generated alpha preserved.

`export-healers.mjs` reuses existing connected-component crop, alpha-area
reduction and team recoloring. 64px cells/32,44 anchor, reviewed row boundaries.
Two walk poses and casting pose; west mirrors/north shades, death collapses/
fades. No eight independently painted perspectives/final death animation claim.
Runtime green heal pulse occurs on caster and recipient. Native800 gameplay/
icons/portrait reviewed, evidence `artifacts/rts-221`. No human balance claim.
