import type {FactionId} from './factions';
import type {AttackDomains} from './domains';
interface AirRecipe extends AttackDomains {name:string;cost:{wood:number;gold:number};durationSeconds:number;supply:number;hp:number;speed:number;damage:number;attackInterval:number;range:number;splashRadius?:number}
export const airConfig:Record<FactionId,AirRecipe>={
 crown:{name:'Gryphon Rider',cost:{wood:65,gold:35},durationSeconds:14,supply:3,hp:130,speed:160,damage:18,attackInterval:1.3,range:160,targets:['land','sea','air','building']},
 clans:{name:'Wyvern Rider',cost:{wood:60,gold:40},durationSeconds:13,supply:3,hp:90,speed:170,damage:24,attackInterval:1.4,range:160,targets:['land','sea','air','building']},
 elves:{name:'Great Eagle',cost:{wood:45,gold:35},durationSeconds:12,supply:2,hp:60,speed:215,damage:14,attackInterval:.9,range:176,targets:['land','air','building'],damageByDomain:{land:.45,building:.45,air:1.25}},
 dwarves:{name:'Gyrocopter',cost:{wood:65,gold:40},durationSeconds:15,supply:3,hp:95,speed:175,damage:12,attackInterval:1,range:192,targets:['land','air','building'],damageByDomain:{land:.65,building:.65,air:1.5}},
 goblins:{name:'Airship',cost:{wood:75,gold:45},durationSeconds:18,supply:4,hp:140,speed:90,damage:30,attackInterval:2,range:160,splashRadius:40,targets:['land','building']},
};
export const airPresentation={height:24,size:28,placeholder:true};
