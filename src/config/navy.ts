import {shipTargets} from './domains';
/** Preliminary shared recipe for both factions; naval balancing belongs to RTS-087. */
export const navyConfig={
 transport:{targets:[] as const,cost:{wood:40,gold:10},durationSeconds:8,supply:2,capacity:4,contactRange:64},
 harbor:{tileSize:32,footprintTiles:2,cost:{wood:40,gold:10},hp:160,constructionSeconds:5,constructionRange:24},
 ship:{targets:shipTargets,damageByDomain:{air:.75},cost:{wood:40,gold:15},durationSeconds:8,supply:2,size:32,speed:110,hp:90,spawnGap:8,range:192,damage:16,attackInterval:1.5,projectileSpeed:280,projectileLifetime:3,hitRadius:20},
};
