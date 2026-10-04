/** Original masonry, timber and heraldry; native pixels, shared team variants. */
export function buildingFrames(Surface, p) {
  const frames = [];
  for (const faction of ["crown", "clans", "elves", "dwarves", "goblins"])
    for (const owner of ["player", "enemy"])
      for (const kind of ["base", "barracks", "farm", "forge", "harbor"])
        for (const exportedStage of [
          "foundation",
          "building",
          "complete",
          "damaged",
        ]) {
          const stage =
            exportedStage === "damaged" ? "complete" : exportedStage;
          const size = kind === "farm" ? 64 : 128,
            s = new Surface(size, size),
            cx = size / 2,
            ground = kind === "farm" ? 48 : 96,
            team = owner === "player" ? p.teamBlue : p.teamRed,
            light = owner === "player" ? p.teamBlueLight : p.teamRedLight;
          const width = kind === "farm" ? 48 : kind === "base" ? 56 : 64,
            left = cx - width / 2,
            top = ground - 24;
          s.ellipse(cx, ground + 14, width / 2 + 4, 7, p.earth);
          s.rect(left, top, width, 38, p.rockDark);
          for (let row = 0; row < 3; row++)
            for (let col = 0; col < width / 12; col++) {
              const x = left + col * 12 + (row % 2 ? 4 : 0);
              s.rect(x, top + row * 11, 10, 9, row % 2 ? p.rock : p.rockLight);
            }
          if (stage === "foundation") {
            s.rect(left + 4, top + 4, width - 8, 26, p.earth);
            s.rect(left - 3, ground + 4, 20, 4, p.bark);
            s.line(cx - 4, ground - 5, cx + 8, ground + 7, p.barkLight);
          } else {
            s.rect(left + 4, top - 20, width - 8, 44, p.barkDark);
            s.rect(left + 7, top - 17, width - 14, 38, p.bark);
            for (let x = left + 9; x < left + width - 6; x += 10)
              s.rect(x, top - 17, 2, 38, p.barkLight);
            s.rect(cx - 8, ground - 15, 16, 27, p.ink);
            s.rect(cx - 6, ground - 13, 12, 24, p.barkDark);
            s.pixel(cx + 3, ground - 1, p.gold);
            if (stage === "building") {
              for (const x of [left - 3, left + width]) {
                s.rect(x, top - 38, 3, 60, p.barkLight);
                s.line(x, top - 18, x + 10, ground + 10, p.bark);
              }
              s.rect(left - 4, top - 30, width + 10, 3, p.barkLight);
              s.rect(left - 4, top - 5, width + 10, 3, p.barkLight);
            } else {
              const roofTop =
                top - (kind === "base" ? 43 : kind === "farm" ? 26 : 32);
              s.polygon(
                [
                  [left - 7, top - 13],
                  [cx, roofTop],
                  [left + width + 7, top - 13],
                  [left + width + 3, top - 5],
                  [left - 3, top - 5],
                ],
                p.ink,
              );
              s.polygon(
                [
                  [left - 4, top - 14],
                  [cx, roofTop + 3],
                  [left + width + 4, top - 14],
                  [left + width, top - 9],
                  [left, top - 9],
                ],
                team,
              );
              for (let y = roofTop + 10; y < top - 10; y += 6)
                s.line(cx - (y - roofTop), y, cx + (y - roofTop), y, light);
              for (const x of [left + 10, left + width - 18]) {
                s.rect(x, top - 8, 8, 11, p.ink);
                s.rect(x + 2, top - 6, 4, 7, p.goldDark);
              }
              if (kind === "base") {
                for (const x of [left - 5, left + width - 10]) {
                  s.rect(x, top - 32, 15, 55, p.rockDark);
                  s.rect(x + 2, top - 30, 11, 51, p.rock);
                  for (let y = top - 28; y < ground; y += 10)
                    s.rect(x + 3, y, 7, 2, p.rockLight);
                  s.rect(x - 1, top - 38, 17, 8, team);
                  for (let dx = 0; dx < 17; dx += 6)
                    s.rect(x - 1 + dx, top - 43, 4, 7, p.rockLight);
                }
              }
              if (kind === "barracks") {
                s.line(
                  left + 10,
                  top + 1,
                  left + 22,
                  ground - 8,
                  p.rockHighlight,
                );
                s.line(
                  left + 22,
                  top + 1,
                  left + 10,
                  ground - 8,
                  p.rockHighlight,
                );
                s.rect(left + 9, ground - 5, 15, 2, p.gold);
              }
              if (kind === "forge") {
                s.rect(left + width - 17, roofTop - 10, 11, 27, p.rockDark);
                s.rect(left + width - 15, roofTop - 8, 7, 21, p.rock);
                s.rect(cx - 6, ground - 9, 12, 17, p.goldDark);
                s.rect(cx - 3, ground - 7, 6, 13, p.goldLight);
                s.rect(left + 8, ground - 1, 17, 4, p.rockHighlight);
                s.rect(left + 13, ground + 3, 7, 7, p.rockDark);
              }
              if (kind === "farm") {
                s.rect(left + 3, ground + 12, width - 6, 3, p.barkLight);
                for (let x = left + 4; x < left + width - 4; x += 9)
                  s.rect(x, ground + 7, 3, 13, p.bark);
                s.rect(left + 4, ground + 4, 8, 5, p.gold);
              }
              s.rect(cx + width / 2 + 3, top - 35, 2, 36, p.barkLight);
              s.polygon(
                [
                  [cx + width / 2 + 5, top - 34],
                  [cx + width / 2 + 20, top - 31],
                  [cx + width / 2 + 5, top - 23],
                ],
                team,
              );
              s.pixel(cx + width / 2 + 8, top - 29, light);
            }
          }
          if (faction === "clans") {
            // Original hide roofs, palisades and bone heraldry, with independent silhouettes.
            if (stage !== "foundation") {
              s.rect(left - 4, top - 18, width + 8, 44, p.barkDark);
              s.rect(left, top - 15, width, 38, p.bark);
              for (let x = left; x < left + width; x += 8) {
                s.line(x, top - 15, x, ground + 10, p.barkLight);
                s.polygon(
                  [
                    [x - 2, top - 17],
                    [x + 1, top - 26],
                    [x + 4, top - 17],
                  ],
                  p.rockHighlight,
                );
              }
              s.rect(cx - 7, ground - 15, 14, 27, p.ink);
              if (stage === "complete") {
                s.polygon(
                  [
                    [left - 8, top - 10],
                    [left + 8, top - 36],
                    [cx, top - 27],
                    [left + width - 8, top - 36],
                    [left + width + 8, top - 10],
                  ],
                  team,
                );
                s.line(left + 8, top - 34, cx, top - 12, light);
                s.line(left + width - 8, top - 34, cx, top - 12, light);
                s.rect(cx - 5, top - 22, 10, 8, p.rockHighlight);
                s.pixel(cx - 2, top - 19, p.ink);
                s.pixel(cx + 2, top - 19, p.ink);
                s.rect(cx - 2, top - 14, 4, 3, p.rockHighlight);
                if (kind === "forge") {
                  s.rect(cx - 5, ground - 12, 10, 15, p.goldDark);
                  s.rect(cx - 2, ground - 10, 4, 10, p.goldLight);
                  s.rect(left + 5, ground - 1, 14, 4, p.rockHighlight);
                }
                if (kind === "farm") {
                  s.rect(left - 3, ground + 8, width + 6, 3, p.barkLight);
                  for (let x = left; x < left + width; x += 8)
                    s.rect(x, ground + 3, 2, 14, p.bark);
                  s.ellipse(cx + 10, ground + 5, 6, 3, p.rockLight);
                }
              }
            }
          }
          if (kind === "harbor") {
            s.data.fill(0);
            s.rect(32, 75, 64, 44, p.barkDark);
            for (let x = 34; x < 95; x += 6) s.rect(x, 77, 4, 40, p.barkLight);
            for (const x of [34, 90]) {
              s.rect(x, 72, 4, 52, p.barkDark);
              s.rect(x, 72, 4, 4, p.rockHighlight);
            }
            s.rect(39, 74, 50, 3, p.rock);
            s.rect(39, 92, 50, 2, p.bark);
            if (stage !== "foundation") {
              s.rect(42, 54, 35, 24, p.bark);
              s.rect(45, 57, 29, 18, p.barkDark);
              s.rect(48, 62, 11, 14, p.ink);
              if (stage === "complete") {
                s.polygon(
                  [
                    [38, 55],
                    [57, 39],
                    [80, 55],
                  ],
                  team,
                );
                s.line(41, 53, 75, 53, light);
                s.rect(66, 61, 7, 10, p.goldDark);
                s.rect(68, 63, 3, 6, p.goldLight);
              } else {
                s.rect(40, 39, 2, 44, p.barkLight);
                s.rect(79, 39, 2, 44, p.barkLight);
                s.rect(40, 44, 41, 2, p.barkLight);
              }
            }
            s.rect(83, 47, 3, 49, p.barkDark);
            s.line(65, 47, 90, 47, p.barkLight);
            s.line(65, 47, 84, 67, p.barkLight);
            s.line(67, 49, 67, 88, p.rockHighlight);
            s.rect(63, 87, 8, 6, p.rockDark);
            s.rect(41, 102, 10, 9, p.goldDark);
            s.rect(43, 104, 6, 5, p.gold);
            s.ellipse(83, 105, 5, 4, p.barkDark);
            s.line(79, 104, 87, 104, p.rockHighlight);
            if (stage === "complete") {
              s.rect(60, 37, 2, 20, p.barkLight);
              s.polygon(
                [
                  [62, 37],
                  [76, 40],
                  [62, 47],
                ],
                team,
              );
              if (faction === "clans") s.rect(66, 40, 4, 3, p.rockHighlight);
              else s.rect(66, 41, 5, 1, p.gold);
            }
          }
          if (stage === "complete") {
            // Readable type details survive both faction silhouettes; light is upper-left.
            if (kind === "barracks") {
              s.rect(left + 5, ground - 5, 19, 3, p.barkDark);
              s.line(
                left + 8,
                ground - 18,
                left + 20,
                ground - 7,
                p.rockHighlight,
              );
              s.line(left + 20, ground - 18, left + 8, ground - 7, p.rockLight);
              s.rect(left + width - 17, ground - 15, 10, 13, team);
              s.line(
                left + width - 16,
                ground - 15,
                left + width - 9,
                ground - 15,
                light,
              );
            }
            if (kind === "base" && faction === "clans") {
              for (const x of [left - 6, left + width - 6]) {
                s.rect(x, top - 29, 12, 50, p.barkDark);
                s.rect(x + 2, top - 27, 4, 46, p.barkLight);
                s.polygon(
                  [
                    [x - 2, top - 29],
                    [x + 5, top - 43],
                    [x + 14, top - 29],
                  ],
                  p.rockHighlight,
                );
              }
            }
            if (kind === "forge") {
              s.rect(left + width - 16, top - 44, 10, 31, p.rockDark);
              s.rect(left + width - 14, top - 42, 3, 26, p.rockLight);
              s.rect(left + 8, ground - 4, 17, 4, p.rockHighlight);
              s.rect(left + 13, ground, 5, 8, p.rockDark);
              s.rect(cx - 4, ground - 6, 8, 12, p.goldDark);
              s.rect(cx - 2, ground - 4, 4, 7, p.goldLight);
            }
            if (kind === "farm") {
              s.ellipse(cx + 8, ground + 5, 6, 3, p.goldDark);
              s.line(cx + 3, ground + 4, cx + 12, ground + 4, p.gold);
              s.rect(left + 3, ground + 9, width - 6, 2, p.barkLight);
            }
            if (kind === "harbor") {
              s.line(36, 80, 90, 80, p.barkLight);
              s.rect(73, 95, 12, 10, p.barkDark);
              s.line(75, 97, 82, 103, p.barkLight);
              s.line(82, 97, 75, 103, p.barkLight);
            }
          }
          if (faction === "elves") {
            // Authored living wood structures: roots, canopy, garden and moon workshop.
            s.data.fill(0);
            s.ellipse(cx, ground + 13, width / 2 + 6, 7, p.earth);
            const low = ground - 25,
              roof = kind === "base" ? ground - 66 : ground - 52;
            for (const x of [left + 3, left + width - 9]) {
              s.rect(x, low - 17, 7, 48, p.barkDark);
              s.rect(x + 1, low - 15, 2, 42, p.barkLight);
              s.line(x + 3, ground + 8, x - 8, ground + 15, p.bark);
              s.line(x + 3, ground + 8, x + 12, ground + 15, p.bark);
            }
            s.rect(left + 4, ground - 2, width - 8, 13, p.barkDark);
            s.line(
              left + 4,
              ground - 1,
              left + width - 4,
              ground - 1,
              p.barkLight,
            );
            if (stage !== "foundation") {
              s.rect(left + 8, low, width - 16, 27, p.bark);
              s.rect(cx - 7, low + 5, 14, 24, p.ink);
              s.rect(cx - 5, low + 8, 10, 21, p.barkDark);
              s.line(left + 6, low, left + 6, ground + 5, p.leaf);
              s.line(
                left + width - 6,
                low,
                left + width - 6,
                ground + 5,
                p.leafHighlight,
              );
              if (stage === "building") {
                s.line(left, roof + 16, cx, roof, p.barkLight);
                s.line(cx, roof, left + width, roof + 16, p.barkLight);
                s.line(left, roof + 16, left + width, roof + 16, p.bark);
              } else {
                for (const [x, y, r] of [
                  [cx, roof + 10, width / 2 + 6],
                  [left + 10, roof + 21, 18],
                  [left + width - 10, roof + 21, 18],
                ]) {
                  s.ellipse(x, y, r, 14, p.leafDark);
                  s.ellipse(x - 2, y - 3, r - 3, 11, p.leaf);
                  s.ellipse(x - 5, y - 6, r - 8, 6, p.leafHighlight);
                }
                for (const x of [left + 11, left + width - 18]) {
                  s.rect(x, low + 4, 7, 9, p.goldDark);
                  s.rect(x + 2, low + 5, 3, 6, p.goldLight);
                }
                const flagTop = Math.max(2, roof - 6);
                s.line(cx, flagTop, cx, flagTop + 27, p.barkLight);
                s.polygon(
                  [
                    [cx + 1, flagTop],
                    [cx + 14, flagTop + 3],
                    [cx + 1, flagTop + 10],
                  ],
                  team,
                );
                s.pixel(cx + 4, flagTop + 4, p.goldLight);
                if (kind === "barracks") {
                  s.line(
                    left + 3,
                    ground - 15,
                    left + 3,
                    ground + 7,
                    p.barkLight,
                  );
                  s.line(
                    left + 3,
                    ground - 15,
                    left + 11,
                    ground - 4,
                    p.barkLight,
                  );
                  s.line(
                    left + 11,
                    ground - 4,
                    left + 3,
                    ground + 7,
                    p.barkLight,
                  );
                  s.line(
                    left + 3,
                    ground - 15,
                    left + 3,
                    ground + 7,
                    p.rockLight,
                  );
                }
                if (kind === "forge") {
                  s.ellipse(cx, roof + 24, 12, 10, p.rockHighlight);
                  s.ellipse(cx + 4, roof + 22, 10, 9, p.leafDark);
                  s.rect(left + width - 18, ground - 2, 14, 3, p.rockLight);
                  s.rect(left + width - 13, ground + 1, 4, 7, p.barkDark);
                }
              }
            }
            if (kind === "farm") {
              s.rect(left + 2, ground + 7, width - 4, 13, p.barkDark);
              for (let x = left + 5; x < left + width - 4; x += 7) {
                s.line(x, ground + 9, x, ground + 18, p.leaf);
                s.pixel(x, ground + 10, p.goldLight);
                s.pixel(x + 1, ground + 16, p.leafHighlight);
              }
            }
            if (kind === "harbor") {
              s.rect(32, ground - 1, 64, 25, p.barkDark);
              for (let x = 34; x < 95; x += 6)
                s.rect(x, ground + 1, 3, 22, p.barkLight);
              s.line(32, ground + 10, 95, ground + 10, p.leafDark);
              for (const x of [33, 91]) {
                s.rect(x, ground - 8, 3, 31, p.bark);
                s.ellipse(x, ground - 10, 5, 3, p.leaf);
              }
            }
          }
          if (faction === "dwarves") {
            // Low stone vaults, buttresses, metal roofs and a furnace, not woodland silhouettes.
            s.data.fill(0);
            s.ellipse(cx, ground + 14, width / 2 + 8, 7, p.earth);
            s.rect(left - 3, ground - 2, width + 6, 16, p.rockDark);
            for (let x = left; x < left + width; x += 10)
              s.rect(x, ground, 8, 10, p.rock);
            if (stage !== "foundation") {
              s.rect(left, top - 15, width, 39, p.rockDark);
              for (let y = top - 12; y < ground + 7; y += 9)
                for (let x = left + 3; x < left + width - 4; x += 11)
                  s.rect(x, y, 9, 7, p.rockLight);
              s.rect(cx - 8, ground - 16, 16, 29, p.ink);
              s.rect(cx - 6, ground - 14, 12, 25, p.barkDark);
              for (const x of [left - 5, left + width - 4]) {
                s.rect(x, top - 18, 9, 49, p.rockDark);
                s.rect(x + 2, top - 16, 3, 43, p.rock);
              }
              if (stage === "building") {
                s.rect(left - 7, top - 25, width + 14, 3, p.barkLight);
                s.line(left - 5, top - 25, left - 5, ground + 10, p.bark);
                s.line(
                  left + width + 4,
                  top - 25,
                  left + width + 4,
                  ground + 10,
                  p.bark,
                );
              } else {
                s.polygon(
                  [
                    [left - 8, top - 17],
                    [left + 6, top - 33],
                    [left + width - 6, top - 33],
                    [left + width + 8, top - 17],
                  ],
                  p.rockDark,
                );
                s.line(
                  left + 7,
                  top - 30,
                  left + width - 7,
                  top - 30,
                  p.rockHighlight,
                );
                s.rect(left - 5, top - 19, width + 10, 4, p.goldDark);
                s.rect(cx - 11, top - 30, 22, 9, team);
                s.line(cx - 9, top - 28, cx + 8, top - 28, light);
                s.rect(cx - 2, top - 29, 4, 6, p.gold);
                if (kind === "base") {
                  s.rect(left + 2, top - 36, 10, 8, p.rock);
                  s.rect(left + width - 12, top - 36, 10, 8, p.rock);
                }
                if (kind === "barracks") {
                  s.rect(left + 4, ground - 13, 10, 13, p.rockDark);
                  s.rect(left + 6, ground - 11, 6, 8, team);
                  s.line(
                    left + 9,
                    ground - 10,
                    left + 9,
                    ground - 5,
                    p.goldLight,
                  );
                }
                if (kind === "forge") {
                  s.rect(left + width - 15, top - 45, 10, 27, p.rockDark);
                  s.rect(left + width - 13, top - 43, 3, 23, p.rockLight);
                  s.rect(cx - 5, ground - 9, 10, 17, p.goldDark);
                  s.rect(cx - 3, ground - 7, 6, 12, p.goldLight);
                  s.rect(left + 3, ground - 2, 14, 4, p.rockHighlight);
                }
              }
            }
            if (kind === "farm") {
              s.rect(left + 3, ground + 7, width - 6, 10, p.barkDark);
              for (let x = left + 6; x < left + width - 5; x += 9) {
                s.rect(x, ground + 7, 7, 8, p.goldDark);
                s.line(x, ground + 9, x + 6, ground + 9, p.gold);
              }
            }
            if (kind === "harbor") {
              s.rect(30, ground - 1, 68, 25, p.rockDark);
              for (let x = 32; x < 98; x += 11)
                s.rect(x, ground + 1, 9, 21, p.rock);
              s.line(31, ground + 8, 96, ground + 8, p.rockHighlight);
              for (const x of [33, 91]) {
                s.rect(x, ground - 8, 4, 31, p.rockDark);
                s.rect(x, ground - 8, 4, 3, p.gold);
              }
            }
          }
          if (faction === "goblins") {
            // Patchwork tin, bent timber, pipes and explosive stores distinguish the junk settlement.
            s.data.fill(0);
            s.ellipse(cx, ground + 13, width / 2 + 7, 7, p.earth);
            s.rect(left - 2, ground - 1, width + 4, 14, p.barkDark);
            for (let x = left; x < left + width; x += 9)
              s.rect(x, ground + 1, 7, 8, p.bark);
            if (stage !== "foundation") {
              s.rect(left, top - 10, width, 35, p.barkDark);
              for (let x = left + 2; x < left + width - 2; x += 8) {
                s.rect(x, top - 8, 6, 31, p.rockDark);
                s.line(x, top - 6, x, ground + 8, p.rockLight);
              }
              s.rect(cx - 7, ground - 15, 14, 28, p.ink);
              s.rect(cx - 5, ground - 13, 10, 23, p.barkDark);
              if (stage === "building") {
                s.rect(left - 4, top - 25, 3, 54, p.barkLight);
                s.rect(left + width + 1, top - 25, 3, 54, p.barkLight);
                s.line(left - 4, top - 24, left + width + 3, top - 16, p.bark);
              } else {
                s.polygon(
                  [
                    [left - 7, top - 10],
                    [left + 6, top - 30],
                    [cx + 6, top - 24],
                    [left + width - 5, top - 33],
                    [left + width + 8, top - 10],
                  ],
                  p.rockDark,
                );
                for (let x = left; x < left + width; x += 8)
                  s.line(x, top - 23, x + 6, top - 11, p.rockLight);
                s.rect(cx - 12, top - 17, 24, 8, team);
                s.line(cx - 11, top - 16, cx + 10, top - 16, light);
                s.pixel(cx, top - 13, p.goldLight);
                if (kind === "base") {
                  s.rect(left + width - 8, top - 47, 2, 40, p.barkLight);
                  s.line(
                    left + width - 15,
                    top - 43,
                    left + width + 1,
                    top - 43,
                    p.rockLight,
                  );
                  s.ellipse(left + width - 7, top - 39, 4, 3, p.goldDark);
                }
                if (kind === "barracks") {
                  s.line(
                    left + 4,
                    ground - 15,
                    left + 15,
                    ground - 4,
                    p.rockHighlight,
                  );
                  s.line(
                    left + 15,
                    ground - 15,
                    left + 4,
                    ground - 4,
                    p.barkLight,
                  );
                  s.rect(left + 3, ground - 2, 13, 3, p.rockDark);
                }
                if (kind === "forge") {
                  s.rect(left + width - 12, top - 41, 7, 30, p.rockDark);
                  s.rect(left + width - 10, top - 39, 2, 25, p.rockLight);
                  s.rect(left + 5, ground - 6, 13, 9, p.barkDark);
                  s.ellipse(left + 10, ground - 11, 4, 6, p.rockLight);
                  s.ellipse(left + 10, ground - 9, 2, 3, p.leafHighlight);
                  s.rect(cx - 4, ground - 7, 8, 13, p.goldDark);
                }
              }
            }
            if (kind === "farm") {
              for (const x of [left + 4, left + width - 13]) {
                s.ellipse(x + 4, ground + 7, 5, 7, p.rockDark);
                s.line(x, ground + 4, x + 8, ground + 4, p.goldDark);
                s.line(x, ground + 10, x + 8, ground + 10, p.gold);
              }
            }
            if (kind === "harbor") {
              s.rect(31, ground - 1, 66, 25, p.barkDark);
              for (let x = 33; x < 95; x += 7)
                s.rect(x, ground + 1, 4, 21, p.barkLight);
              s.rect(50, ground + 3, 12, 16, p.rock);
              s.line(53, ground + 4, 53, ground + 17, p.rockLight);
              for (const x of [33, 91]) {
                s.rect(x, ground - 8, 3, 31, p.barkDark);
                s.rect(x, ground - 8, 3, 4, p.goldDark);
              }
            }
          }
          if (exportedStage === "damaged") {
            // Static broken roof beams, masonry cracks and ground rubble; no simulation.
            const roofY = kind === "harbor" ? 48 : top - 17;
            s.polygon(
              [
                [cx - 14, roofY],
                [cx - 2, roofY + 3],
                [cx + 4, roofY + 15],
                [cx - 10, roofY + 12],
              ],
              p.ink,
            );
            s.line(cx - 12, roofY + 2, cx - 5, roofY + 12, p.bark);
            s.line(cx - 11, roofY + 2, cx - 5, roofY + 10, p.barkLight);
            s.line(
              left + width - 7,
              ground - 14,
              left + width - 12,
              ground - 6,
              p.ink,
            );
            s.line(
              left + width - 12,
              ground - 6,
              left + width - 8,
              ground + 3,
              p.ink,
            );
            for (const [x, y] of [
              [left - 3, ground + 14],
              [cx + 11, ground + 16],
              [left + width + 1, ground + 10],
            ]) {
              s.rect(x, y, 4, 3, p.rockDark);
              s.rect(x, y, 3, 1, p.rockLight);
            }
          }
          frames.push({
            id: `${faction === "crown" ? "" : faction + "-"}${kind}-${owner}-${exportedStage}`,
            image: s,
            x: (frames.length % 8) * 128,
            y: Math.floor(frames.length / 8) * 128,
            anchor: { x: cx, y: ground },
            kind: "building",
            faction,
            owner,
            buildingType: kind,
            stage: exportedStage,
            logicalFootprint: {
              width: kind === "base" ? (owner === "player" ? 48 : 96) : 64,
              height: kind === "base" ? (owner === "player" ? 48 : 96) : 64,
            },
          });
        }
  return frames;
}
