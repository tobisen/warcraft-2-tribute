/** Hand-authored arena. Positions stay in world pixels; tiles are 32 pixels. */
export const arenaConfig = {
  tileSize: 32,
  base: { x: 400, y: 450 },
  node: { x: 650, y: 180 },
  workers: [{ x: 280, y: 300 }, { x: 400, y: 300 }, { x: 520, y: 300 }],
  enemyEntry: { x: 740, y: 60, spacing: 40 },
  terrain: [
    { column: 3, row: 3, columns: 3, rows: 4, kind: 'rock' },
    { column: 30, row: 22, columns: 3, rows: 4, kind: 'rock' },
    { column: 34, row: 9, columns: 4, rows: 3, kind: 'water' },
    { column: 3, row: 14, columns: 4, rows: 3, kind: 'water' },
  ],
} as const;
