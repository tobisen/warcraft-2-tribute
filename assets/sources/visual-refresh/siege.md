# RTS-229 — Siege Works and Ballista

Two original transparent painted master sheets, generated with the built-in
imagegen skill/tool using `crown.png` as a style reference, October 8 2026.
Project-owned assets dedicated CC0, consistent with the approved refreshed art.

- `ballistas.png`: four poses by five factions, substantial wheeled crossbows
  and matching crews; idle, two movement poses, firing/recoil.
- `siege-works.png`: five faction buildings; timber human workshop, tusked orc
  workshop, elven living-wood grove, dwarven stone foundry, goblin scrap yard.

Prompts specified the existing richly shaded miniature RTS style, three-quarter
view, blue player trim, real transparent alpha, whole sprites within equal
cells, no text, no sketches or placeholders. Building prompt required visible
catapult/crossbow construction bays. Ballista prompt required a giant horizontal
crossbow (no catapult mechanic). Sources reviewed before export and native
800 browser reviewed in `artifacts/rts-229/`.

`scripts/export-ballistas.mjs` / `export-siege-works.mjs` use the existing
alpha/component crop and reduction pipeline, mirrored western facings and
northern shading, four-stage death collapse/fade, blue-to-red enemy recoloring;
building construction uses alpha stages and damage uses tint/cracks. These are
four actual source poses, not eight separately painted directions or full
independent death animations. Existing bow/siege sounds and crew voice policy
are reused; no new recordings, listening session or human balance claim.
