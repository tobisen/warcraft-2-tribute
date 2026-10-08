import {playerTargets} from './targets';
import type {BuildingSelection} from './buildingSelection';
import {hasMainBase} from './extraBases';
import {updateMatch,type MatchState} from './match';
import {createStatLedger} from './statLedger';
export interface DismissProposal {ids:string[];count:number;passengers:number;building?:Exclude<BuildingSelection,null>;lastBase?:boolean}
export function dismissProposal(m:MatchState,building:BuildingSelection=null):DismissProposal|null {
 if(m.paused||m.outcome!=='playing'||!!m.multiplePlayers&&!hasMainBase(m))return null;
 if(building){const target=playerTargets(m.gathering,m.combat,m.placement,m.navy).find(t=>t.id===building&&!['worker','soldier','ship'].includes(t.kind)&&t.owner==='player');if(!target)return null;const lastBase=target.kind==='base'&&(building==='base'?!!(m.campaignRun||m.campaignMission)||!(m.placement.bases??[]).some(b=>b.hp>0&&b.construction.remainingSeconds===0):m.combat.baseHP<=0&&!(m.placement.bases??[]).some(b=>b.id!==building&&b.hp>0&&b.construction.remainingSeconds===0));return {ids:[],count:1,passengers:0,building,lastBase};}
 const units=m.gathering.units.filter(u=>u.selected&&(u.hp??1)>0&&(!u.owner||u.owner==='player'));
 const ships=m.navy?.ships.filter(s=>s.selected&&s.hp>0&&s.owner==='player')??[];
 const passengers=ships.reduce((n,s)=>n+(s.passengers?.filter(u=>(u.hp??1)>0).length??0),0);
 const ids=[...units,...ships].map(u=>u.id);return ids.length?{ids,count:ids.length+passengers,passengers}:null;
}
/** Confirmed own IDs only. The existing destruction transaction cleans all references. */
export function dismissUnits(m:MatchState,ids:readonly string[]):MatchState {
 if(m.paused||m.outcome!=='playing'||!!m.multiplePlayers&&!hasMainBase(m))return m;
 const requested=new Set(ids),land=m.gathering.units.filter(u=>requested.has(u.id)&&(u.hp??1)>0&&(!u.owner||u.owner==='player'));
 const ships=m.navy?.ships.filter(s=>requested.has(s.id)&&s.hp>0&&s.owner==='player')??[];
 const count=land.length+ships.length+ships.reduce((n,s)=>n+(s.passengers?.filter(u=>(u.hp??1)>0).length??0),0);if(!count)return m;
 const removed=new Set([...land,...ships].map(u=>u.id)),ledger=m.statLedger??createStatLedger(true);
 return updateMatch({...m,statLedger:{...ledger,player:{...ledger.player,removed:ledger.player.removed+count}},gathering:{...m.gathering,units:m.gathering.units.map(u=>removed.has(u.id)?{...u,hp:0}:u)},...(m.navy?{navy:{...m.navy,ships:m.navy.ships.map(s=>removed.has(s.id)?{...s,hp:0}:s)}}:{})},0);
}

/** Confirmed building ID is revalidated; normal destruction handles jobs, obstacles and defeat. */
export function dismissBuilding(m:MatchState,id:Exclude<BuildingSelection,null>):MatchState {
 if(!dismissProposal(m,id))return m;
 let next=m;
 if(id==='base')next={...m,combat:{...m.combat,baseHP:0}};
 else if(id==='barracks')next={...m,placement:{...m.placement,barracksHP:0}};
 else if(id==='harbor')next={...m,navy:{...m.navy!,harbor:{...m.navy!.harbor!,hp:0}}};
 else if(id==='forge'||id==='academy'||id==='stable'||id==='aviary'||id==='siegeWorks')next={...m,placement:{...m.placement,[id]:{...m.placement[id]!,hp:0}}};
 else next={...m,placement:{...m.placement,producers:m.placement.producers?.map(b=>b.id===id?{...b,hp:0}:b),bases:m.placement.bases?.map(b=>b.id===id?{...b,hp:0}:b),farms:m.placement.farms?.map(b=>b.id===id?{...b,hp:0}:b),defenses:m.placement.defenses?.map(b=>b.id===id?{...b,hp:0}:b)}};
 return updateMatch(next,0);
}
