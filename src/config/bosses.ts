import type {MapId} from './maps';
/** Optional player encounters. Rooted guardians never join the enemy player's army. */
export const bossDefinitions={
 bramblemaw:{id:'bramblemaw',name:'Bramblemaw',map:'frontier',position:{x:2352,y:2640},hp:1100,damage:24,attackInterval:1.2,splashRadius:16,reward:{wood:300,gold:200},tint:0xd2ae65},
 gravelheart:{id:'gravelheart',name:'Gravelheart',map:'highlands',position:{x:2800,y:2832},hp:1400,damage:28,attackInterval:1.6,splashRadius:20,reward:{wood:200,gold:350},tint:0xc0a0ef},
} as const;
export type BossId=keyof typeof bossDefinitions;
export const bossRules={size:64,range:360,projectileSpeed:500,projectileLifetime:2,lootOffset:96,collectRange:48};
export const mapBosses=(id:MapId)=>Object.values(bossDefinitions).filter(b=>b.map===id);
export const bossEnemyId=(id:BossId)=>`enemy-boss-${id}`;
