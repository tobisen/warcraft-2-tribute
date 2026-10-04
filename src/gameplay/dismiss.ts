import {updateMatch,type MatchState} from './match';
import {createStatLedger} from './statLedger';
export interface DismissProposal {ids:string[];count:number;passengers:number}
export function dismissProposal(m:MatchState):DismissProposal|null {
 if(m.paused||m.outcome!=='playing')return null;
 const units=m.gathering.units.filter(u=>u.selected&&(u.hp??1)>0&&(!u.owner||u.owner==='player'));
 const ships=m.navy?.ships.filter(s=>s.selected&&s.hp>0&&s.owner==='player')??[];
 const passengers=ships.reduce((n,s)=>n+(s.passengers?.filter(u=>(u.hp??1)>0).length??0),0);
 const ids=[...units,...ships].map(u=>u.id);return ids.length?{ids,count:ids.length+passengers,passengers}:null;
}
/** Confirmed own IDs only. The existing destruction transaction cleans all references. */
export function dismissUnits(m:MatchState,ids:readonly string[]):MatchState {
 if(m.paused||m.outcome!=='playing')return m;
 const requested=new Set(ids),land=m.gathering.units.filter(u=>requested.has(u.id)&&(u.hp??1)>0&&(!u.owner||u.owner==='player'));
 const ships=m.navy?.ships.filter(s=>requested.has(s.id)&&s.hp>0&&s.owner==='player')??[];
 const count=land.length+ships.length+ships.reduce((n,s)=>n+(s.passengers?.filter(u=>(u.hp??1)>0).length??0),0);if(!count)return m;
 const removed=new Set([...land,...ships].map(u=>u.id)),ledger=m.statLedger??createStatLedger(true);
 return updateMatch({...m,statLedger:{...ledger,player:{...ledger.player,removed:ledger.player.removed+count}},gathering:{...m.gathering,units:m.gathering.units.map(u=>removed.has(u.id)?{...u,hp:0}:u)},...(m.navy?{navy:{...m.navy,ships:m.navy.ships.map(s=>removed.has(s.id)?{...s,hp:0}:s)}}:{})},0);
}
