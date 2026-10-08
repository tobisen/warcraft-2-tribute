import {productionTimeAfterConstruction} from './construction';
import {enqueueProduction,updateQueuedProduction,cancelProduction} from './productionQueue';
import {matchPopulation,trainShip,updateNavy} from './navy';
import {hasMainBase} from './extraBases';
import {technologyFor} from './productionPrerequisites';
import {factionForTeam,type UnitRole} from '../config/factions';
import {hasPopulation} from './population';
import type {MatchState} from './match';
import type {ExtraProducer} from './placement';
export const extraProducer=(m:MatchState,id:string|null)=>m.placement.producers?.find(p=>p.id===id&&p.hp>0);
export const producerBuilding=(m:MatchState,p:ExtraProducer,role:Exclude<UnitRole,'worker'>)=>({kind:'barracks' as const,producer:p.kind==='harbor'?'barracks' as const:p.kind,unitType:role,footprint:p.footprint,ready:p.hp>0&&p.construction.remainingSeconds===0,bounds:m.map,technology:technologyFor(m,'player')});
export function setExtraProducer(m:MatchState,p:ExtraProducer):MatchState{return {...m,placement:{...m.placement,producers:m.placement.producers!.map(b=>b.id===p.id?p:b)}};}
export function trainExtraProducer(m:MatchState,id:string,role:UnitRole|'warship'|'transport'|'submarine'):MatchState{
 const p=extraProducer(m,id);if(p)productionTimeAfterConstruction(p.construction,0);if(!p||m.paused||m.outcome!=='playing'||!hasMainBase(m))return m;
 if(p.kind==='harbor'){
  if(!['warship','transport','submarine'].includes(role)||!hasPopulation(matchPopulation(m),factionForTeam(m,'player').naval.units[role as 'warship'].supply))return m;
  const temporary={...m,placement:{...m.placement,producers:m.placement.producers!.filter(b=>b.id!==id)},navy:{...m.navy!,harbor:{owner:'player' as const,hp:p.hp,footprint:p.footprint,construction:p.construction},production:p.production}};
  const result=trainShip(temporary,role as 'warship');return setExtraProducer({...m,gathering:result.gathering},{...p,production:result.navy!.production});
 }
 if(['warship','transport','submarine'].includes(role))return m;
 const cfg=factionForTeam(m,'player').units[role as UnitRole];if(cfg.trainedAt!==p.kind)return m;
 const r=enqueueProduction(m.gathering,p.production,producerBuilding(m,p,role as Exclude<UnitRole,'worker'>),matchPopulation(m));return setExtraProducer({...m,gathering:r.gathering},{...p,production:r.production});
}
export function cancelExtraProduction(m:MatchState,id:string,job:string):MatchState{const p=extraProducer(m,id);if(!p)return m;const r=cancelProduction(m.gathering,p.production,job,!m.paused&&m.outcome==='playing');return setExtraProducer({...m,gathering:r.gathering},{...p,production:r.production});}
export function updateExtraProducers(m:MatchState,delta:number):MatchState{
 for(const site of m.placement.producers??[]){const p=extraProducer(m,site.id);if(!p||!hasMainBase(m))continue;
  const productionDelta=productionTimeAfterConstruction(p.construction,delta);
  if(p.kind==='harbor'){
   if(p.construction.remainingSeconds>0||!m.navy)continue;
   const result=updateNavy({...m,navy:{...m.navy,ships:m.navy.ships.map(s=>({...s,order:{kind:'idle' as const}})),harbor:{owner:'player',hp:p.hp,footprint:p.footprint,construction:p.construction},production:{...p.production,nextUnitNumber:m.navy.production.nextUnitNumber}},gathering:{...m.gathering,units:m.gathering.units.map(u=>({...u,selected:false}))}},productionDelta);
   m=setExtraProducer({...m,navy:{...m.navy,ships:[...m.navy.ships,...result.navy!.ships.slice(m.navy.ships.length)],production:{...m.navy.production,nextUnitNumber:result.navy!.production.nextUnitNumber}}},{...p,production:result.navy!.production});continue;
  }
  const counter=Math.max(m.production.nextUnitNumber,m.soldierProduction.nextUnitNumber,...m.gathering.units.map(u=>Number(u.id.slice(5))+1));
  const r=updateQueuedProduction(m.gathering,{...p.production,nextUnitNumber:counter},productionDelta,producerBuilding(m,p,(p.production.queue?.[0]?.kind??'soldier') as Exclude<UnitRole,'worker'>),{map:m.map,enemies:m.combat.enemies});
  m=setExtraProducer({...m,gathering:r.gathering,production:{...m.production,nextUnitNumber:r.production.nextUnitNumber},soldierProduction:{...m.soldierProduction,nextUnitNumber:r.production.nextUnitNumber}},{...p,production:r.production});
 }
 const nextUnitNumber=Math.max(m.production.nextUnitNumber,m.soldierProduction.nextUnitNumber);
 const shipCounter=m.navy?.production.nextUnitNumber??1;
 return {...m,placement:{...m.placement,...(m.placement.stable?{stable:{...m.placement.stable,production:{...m.placement.stable.production,nextUnitNumber}}}:{}),...(m.placement.academy?.production?{academy:{...m.placement.academy,production:{...m.placement.academy.production,nextUnitNumber}}}:{}),...(m.placement.aviary?{aviary:{...m.placement.aviary,production:{...m.placement.aviary.production,nextUnitNumber}}}:{}),...(m.placement.siegeWorks?{siegeWorks:{...m.placement.siegeWorks,production:{...m.placement.siegeWorks.production,nextUnitNumber}}}:{}),bases:m.placement.bases?.map(b=>({...b,production:{...b.production,nextUnitNumber}})),producers:m.placement.producers?.map(p=>({...p,production:{...p.production,nextUnitNumber:p.kind==='harbor'?shipCounter:nextUnitNumber}}))}};
}
