import { costs } from './economy';
export const worldConfig = { width: 1280, height: 960 };

export const barracksConfig = {
  cost: costs.barracks.wood,
  tileSize: 32,
  footprintTiles: 2,
  constructionSeconds: 5,
  constructionRange: 24,
};

export const farmConfig = {tileSize:32,footprintTiles:2,constructionSeconds:5,constructionRange:24,maxCount:5,largeMaxCount:10,largeMapSize:3072,supply:5};
export const populationConfig = {baseCap:8,unitSupply:1};

/** Large mission and skirmish maps allow a larger player economy. */
export function farmLimit(world:{width:number;height:number}=worldConfig):number {
 return Math.max(world.width,world.height)>=farmConfig.largeMapSize?farmConfig.largeMaxCount:farmConfig.maxCount;
}
