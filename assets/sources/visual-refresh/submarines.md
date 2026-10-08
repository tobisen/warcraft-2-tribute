# RTS-227 submarine artwork

Original AI-created artwork generated with the imagegen skill on2026-10-08,
using this project's approved original Crown sheet as style reference.
No third-party game sprites or external artwork. Project-original generated
assets follow the existing CC0 asset distribution policy.

Source: `submarines.png`, five evenly spaced faction rows × four poses.
Names: Tide Stalker, Deepfang, Shadowfin, Iron Depth, Sea Sneak.
Prompt requested polished painted isometric medieval blue/gold, red/tusk,
green/moonwood, bronze/runic and rusty/goblin diving craft with periscopes and
torpedo tubes. Transparent isolated hulls, no sails/crew/text/ocean; four
idle/propulsion/firing poses, matching the approved detailed unit art.

`node scripts/export-submarines.mjs` exports64px frames and manifest. Full
export pipeline also packs ballistas and siege workshops from RTS-229.
At native800 the hull remains distinguishable from surface ships. Source
has four painted poses of one southeast view, mirrored west and shaded north;
these are not eight separately painted directions. Death collapse/fade is a
procedural export transition. Cannon projectile/sound and existing movement/
voice feedback are reused; no new recordings or actual listening claimed.
