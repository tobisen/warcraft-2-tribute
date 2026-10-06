import type {MatchState} from './match';
import type {BuildingSelection} from './buildingSelection';
import {baseFootprint} from './buildingSelection';
import {enqueueProduction,updateQueuedProduction} from './productionQueue';
import {matchPopulation} from './navy';
/** Foundations cannot keep an otherwise defeated player alive. Campaign protects the original base. */
export function hasMainBase(m:Pick<MatchState,'combat'|'placement'>):boolean{return m.combat.baseHP>0||(m.placement.bases??[]).some(b=>b.hp>0&&b.construction.remainingSeconds===0);}
export function syncDropoffs(m:MatchState):MatchState{if(!m.placement.bases?.length&&m.gathering.primaryDropoff===undefined)return m;return {...m,gathering:{...m.gathering,primaryDropoff:m.combat.baseHP>0,dropoffs:[...(m.placement.bases??[]).filter(b=>b.hp>0&&b.construction.remainingSeconds===0).map(b=>b.footprint),...(m.aiContext?.helpBases??[])]}};}
export function selectedBase(m:MatchState,id:BuildingSelection){return id==='base'?{footprint:baseFootprint(m.gathering.base),ready:m.combat.baseHP>0,production:m.production}:m.placement.bases?.find(b=>b.id===id);}
export function trainBaseWorker(m:MatchState,id:BuildingSelection):MatchState{
 const b=selectedBase(m,id);if(!b||('construction' in b?b.construction.remainingSeconds!==0||b.hp<=0:!b.ready)||m.paused||m.outcome!=='playing')return m;
 const r=enqueueProduction(m.gathering,b.production,{kind:'base',footprint:b.footprint},matchPopulation(m));
 return {...m,gathering:r.gathering,...(id==='base'?{production:r.production}:{placement:{...m.placement,bases:m.placement.bases!.map(b=>b.id===id?{...b,production:r.production}:b)}})};
}
export function updateExtraBaseProduction(m:MatchState,delta:number):MatchState{
 if(!m.placement.bases?.length)return m;
 let gathering=m.gathering,nextUnitNumber=Math.max(m.production.nextUnitNumber,m.soldierProduction.nextUnitNumber,...(m.placement.bases??[]).map(b=>b.production.nextUnitNumber));
 const bases=m.placement.bases?.map(b=>{const result=updateQueuedProduction(gathering,{...b.production,nextUnitNumber},delta,{kind:'base',footprint:b.footprint,ready:b.hp>0&&b.construction.remainingSeconds===0},{map:m.map,enemies:m.combat.enemies});gathering=result.gathering;nextUnitNumber=Math.max(nextUnitNumber,result.production.nextUnitNumber);return {...b,production:result.production};});
 return {...m,gathering,production:{...m.production,nextUnitNumber},soldierProduction:{...m.soldierProduction,nextUnitNumber},placement:{...m.placement,...(bases?{bases:bases.map(b=>({...b,production:{...b.production,nextUnitNumber}}))}:{})}};
}
