import {workerStats,combatUnitStats} from '../config/unit';
import {segmentFits} from './navigation';
import {mapDiscoveries,discoveryConfig,type Discovery} from '../config/discoveries';
import type {MatchState} from './match';
import type {Soldier} from './gathering';
import {factionForTeam} from '../config/factions';
import {isAir} from './domains';
import {isVisible} from './fog';
import {matchFog} from './matchFog';
import {hasPopulation} from './population';
import {matchPopulation} from './navy';
import {chooseSpawn} from './spawning';
export interface DiscoveryState {version:1;claimed:string[];recruits:Record<string,string>}
export const createDiscoveries=():DiscoveryState=>({version:1,claimed:[],recruits:{}});
export function discoveryBonus(m:Pick<MatchState,'discoveries'|'map'>){
 const claimed=m.discoveries?.claimed??[],count=mapDiscoveries(m.map.id??'arena').filter(d=>d.kind==='treasure'&&claimed.includes(d.id)).length;
 return {wood:count*discoveryConfig.reward.wood,gold:count*discoveryConfig.reward.gold};
}
export function recruitReason(m:MatchState,d:Discovery):string|null {
 const recipe=factionForTeam(m,'player').units.soldier;
 if(!hasPopulation(matchPopulation(m),recipe.supply))return 'Need free population';
 if(m.gathering.units.length>=128)return 'Unit limit reached';
 return chooseSpawn(m.map,{x:d.position.x-8,y:d.position.y-8,width:16,height:16},'barracks',m.gathering.units,m.combat.enemies,recipe.size,p=>segmentFits(m.map,d.position,p,recipe.size/2))?null:'Waiting for a free position';
}
/** Finite authored finds: camera movement is never vision, and each reward is applied once. */
export function updateDiscoveries(m:MatchState):MatchState {
 if(!m.discoveries||m.scenario!=='skirmish'||m.campaignRun||m.campaignMission||m.outcome!=='playing'||m.paused||!m.fog)return m;
 let next=m;
 for(const d of mapDiscoveries(m.map.id??'arena')){
  if(next.discoveries!.claimed.includes(d.id)||!isVisible(next.fog!,'player',d.position)||!next.gathering.units.some(u=>!isAir(u)&&(u.hp??1)>0&&Math.hypot(u.position.x-d.position.x,u.position.y-d.position.y)<=discoveryConfig.range&&segmentFits(next.map,u.position,d.position,(u.kind==='worker'?workerStats(next.factions?.player):combatUnitStats(u,next.factions?.player)).size/2)))continue;
  if(d.kind==='treasure'){
   next={...next,gathering:{...next.gathering,wood:next.gathering.wood+discoveryConfig.reward.wood,goldBalance:(next.gathering.goldBalance??0)+discoveryConfig.reward.gold},discoveries:{...next.discoveries!,claimed:[...next.discoveries!.claimed,d.id]}};
  }else{
   if(recruitReason(next,d))continue;
   const faction=factionForTeam(next,'player'),position=chooseSpawn(next.map,{x:d.position.x-8,y:d.position.y-8,width:16,height:16},'barracks',next.gathering.units,next.combat.enemies,faction.units.soldier.size,p=>segmentFits(next.map,d.position,p,faction.units.soldier.size/2))!;
   const number=Math.max(next.production.nextUnitNumber,next.soldierProduction.nextUnitNumber),id=`unit-${number}`;
   const unit:Soldier={id,kind:'soldier',owner:'player',hp:faction.units.soldier.hp,cargo:0,selected:false,position,target:{...position},order:{kind:'idle'}};
   next={...next,gathering:{...next.gathering,units:[...next.gathering.units,unit]},production:{...next.production,nextUnitNumber:number+1},soldierProduction:{...next.soldierProduction,nextUnitNumber:number+1},placement:{...next.placement,...(next.placement.bases?{bases:next.placement.bases.map(b=>({...b,production:{...b.production,nextUnitNumber:number+1}}))}:{})},discoveries:{version:1,claimed:[...next.discoveries!.claimed,d.id],recruits:{...next.discoveries!.recruits,[d.id]:id}}};
   next={...next,fog:matchFog(next)};
  }
 }
 return next;
}
