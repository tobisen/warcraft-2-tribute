export const forgeConfig={cost:{wood:40,gold:10},tileSize:32,footprintTiles:2,constructionSeconds:5,constructionRange:24,hp:120};
export const upgradeConfig={cost:{wood:40,gold:10},durationSeconds:8,maxLevel:2,attackMultiplier:1.25,defenseMultiplier:.75};

export const academyConfig={cost:{wood:80,gold:40},tileSize:32,footprintTiles:2,constructionSeconds:10,constructionRange:24,hp:140};
export function upgradeMultiplier(multiplier:number,level=0){return Math.pow(multiplier,Math.max(0,Math.min(2,level)));}
