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

## RTS-230 — Sea serpent

Original integer-pixel drawing in `scripts/export-boss-assets.mjs`, authored
2026-10-08 for this project and dedicated to CC0-1.0. No imported raster or
third-party character. Four96×96 cells in the third atlas row: two swimming
coil poses, raised bite, sinking silhouette. The shared land guardian sources
and their first two atlas rows remain unchanged. This small code-drawn creature
has two swim frames, not separately painted directions;
there is no new creature-specific sound. Browser evidence: artifacts/rts-230.

## RTS-231 — Kraken replaces the sea serpent artwork

Original `kraken.png`, generated with the built-in imagegen tool on 2026-10-08
for this project. The user-provided illustrations were anatomy references;
no third-party image was imported into the repository. The generated original
and its exports are dedicated to CC0-1.0 on the same terms as the guardians.

Prompt set: original game-ready detailed pixel-art Kraken, medieval fantasy
RTS, matching existing guardian atlas painterly clustered pixels, dark outlines,
restrained highlights and three-quarter overhead camera. Armored squid/octopus
head with slate-blue and muted violet chitin plates, glowing amber-orange eyes,
six chunky curling tentacles, pale suction cups and small teal water ripples.
Four equal horizontal cells, common scale/waterline: idle swim, alternate swim,
raised-tentacle attack, defeated sinking pose. Transparent background, generous
padding, no serpent anatomy, text, ships, scenery, logos or watermark.

Source inspected before export. The existing alpha-weighted reducer exports
four 72×96 cells centered in 96×96 runtime frames; the historical `sea-serpent-*`
frame keys remain for compatibility. Land guardian atlas rows are byte-exact
unchanged. Gameplay, collision size, stats, map locations and Save69 remain.
Two swimming poses and one attack/death pose; no separately painted directions
or new audio. Browser evidence: artifacts/rts-231/browser.json.
The earlier RTS-230 code-drawn serpent description above is historical.
