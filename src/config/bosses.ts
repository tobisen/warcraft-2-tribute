import type {MapId} from './maps';
/** Optional player encounters. Rooted guardians never join the enemy player's army. */
export const bossDefinitions={
 bramblemaw:{id:'bramblemaw',name:'Bramblemaw',map:'frontier',position:{x:2352,y:2640},strength:'Bark armor: non-siege projectile damage ×0.60',weakness:'Chopping melee damage ×1.25',incoming:{melee:1.25,projectile:.6,siege:1},hp:1100,damage:24,attackInterval:1.2,splashRadius:16,reward:{wood:300,gold:200},tint:0xd2ae65},
 gravelheart:{id:'gravelheart',name:'Gravelheart',map:'highlands',position:{x:2800,y:2832},strength:'Stone armor: melee damage ×0.60',weakness:'Catapult/ballista damage ×1.60',incoming:{melee:.6,projectile:1,siege:1.6},hp:1400,damage:28,attackInterval:1.6,splashRadius:20,reward:{wood:200,gold:350},tint:0xc0a0ef},
} as const;
export type BossId=keyof typeof bossDefinitions;
export const bossRules={size:64,range:360,projectileSpeed:500,projectileLifetime:2,lootOffset:96,collectRange:48};
export const mapBosses=(id:MapId)=>Object.values(bossDefinitions).filter(b=>b.map===id);
export const bossEnemyId=(id:BossId)=>`enemy-boss-${id}`;

export type BossDamageProfile='melee'|'projectile'|'siege';
export const bossDamageProfile=(role:string|undefined,ranged=false):BossDamageProfile=>role==='catapult'||role==='ballista'?'siege':ranged?'projectile':'melee';
export const bossIncoming=(id:BossId,profile:BossDamageProfile)=>bossDefinitions[id].incoming[profile];

/** Shared neutral encounter tuning; Easy deliberately shares Beginner pressure. */
export const seaMonsterRules={name:"Kraken",hp:240,size:32,speed:48,range:96,aggroRange:224,shoreRange:32,damage:18,attackInterval:1.5};
export const seaMonsterCounts={beginner:1,easy:1,normal:2,hard:3} as const;
export const seaMonsterEnemyId=(id:string)=>`enemy-sea-monster-${id}`;
