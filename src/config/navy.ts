import {shipTargets} from './domains';
/** Preliminary shared recipe for both factions; naval balancing belongs to RTS-087. */
export const navyConfig={
 transport:{searchRadius:256,boardingRadius:512,transferSeconds:30,targets:[] as const,cost:{wood:40,gold:10},durationSeconds:8,supply:2,capacity:4,contactRange:64},
 harbor:{tileSize:32,footprintTiles:2,cost:{wood:40,gold:10},hp:160,constructionSeconds:5,constructionRange:24},
 submarine:{targets:['sea'] as const,cost:{wood:75,gold:50},durationSeconds:20,supply:3,size:32,speed:125,hp:100,spawnGap:8,range:160,damage:24,attackInterval:1.8,projectileSpeed:280,projectileLifetime:3,hitRadius:20},
 ship:{targets:shipTargets,damageByDomain:{air:.75},cost:{wood:40,gold:15},durationSeconds:8,supply:2,size:32,speed:110,hp:90,spawnGap:8,range:192,damage:16,attackInterval:1.5,projectileSpeed:280,projectileLifetime:3,hitRadius:20},
};
