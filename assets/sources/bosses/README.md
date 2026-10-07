# RTS-212 — original guardian sprites

Author: OpenAI image generation for this project's user, 2026-10-07. Sources:
`bramblemaw.png`, `gravelheart.png`. Generated with the built-in imagegen tool;
no third-party franchise art or subscription stock was imported. These original
outputs and their exports are dedicated to CC0-1.0 by the project for public
repository/browser distribution; this dedication applies to the outputs, not
the generation model. OpenAI service terms remain separate from asset licensing.

Prompt set: original medieval-fantasy, detailed pixel-art RTS guardian, top-down
three-quarter camera, transparent background, four horizontal cells: idle,
wind-up, attack, defeated. Bramblemaw: rooted thornwood beast, moss/bark armour,
clawed branch arms, amber eyes and tooth-lined hollow mouth. Gravelheart:
rooted granite guardian, rectangular stone fists, geometric rune cracks and
violet eyes, collapsed rubble when dead. No text, scenery, ground or franchise
characters. Source images were inspected before exporting.

Processing: `scripts/export-boss-assets.mjs` uses the existing RGBA decoder and
alpha-weighted area reducer. Equal source cells, shared 72×96 scale, centred
96×96 runtime frames; four poses per guardian in `bosses-atlas.png/.json`.
Original source images remain unchanged. No synthetic movement poses: guardians
are stationary. Attack poses and existing projectile/hit effects supply combat
feedback; frame3 is a persistent defeated corpse. Agent browser inspection is recorded
in `artifacts/rts-212/browser.json`, separately from automated asset checks.
