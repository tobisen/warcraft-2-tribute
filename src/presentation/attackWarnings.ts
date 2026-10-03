import {attackWarningConfig} from '../config/feedback';
import type {MatchState} from '../gameplay/match';
import type {Position} from '../gameplay/movement';
type Kind='base'|'building'|'unit';
interface OwnTarget {id:string;kind:Kind;hp:number;position:Position}
export interface AttackWarning {id:string;kind:Kind;position:Position;expiresAt:number}
export interface WarningState {previous?:OwnTarget[];nextAllowed:number;warning:AttackWarning|null}
export function createWarningState():WarningState{return {nextAllowed:0,warning:null};}
/** Include transported passengers so boarding/unloading cannot look like a death. */
export function warningSnapshot(m:MatchState):OwnTarget[]{
 const result:OwnTarget[]=[{id:'base',kind:'base',hp:m.combat.baseHP,position:{...m.gathering.base}}];
 const building=(id:string,hp:number|undefined,rect:{x:number;y:number;width:number;height:number}|null|undefined)=>{if(rect&&hp!==undefined)result.push({id,kind:'building',hp,position:{x:rect.x+rect.width/2,y:rect.y+rect.height/2}});};
 building('barracks',m.placement.barracksHP,m.placement.barracks);
 for(const f of m.placement.farms??[])building(f.id,f.hp,f.footprint);
 building('forge',m.placement.forge?.hp,m.placement.forge?.footprint);
 building('harbor',m.navy?.harbor?.hp,m.navy?.harbor?.footprint);
 for(const u of [...m.gathering.units,...(m.navy?.ships??[])])result.push({id:u.id,kind:'unit',hp:u.hp??0,position:{...u.position}});
 for(const ship of m.navy?.ships??[])for(const u of ship.passengers??[])result.push({id:u.id,kind:'unit',hp:u.hp??0,position:{...ship.position}});
 return result;
}
/** Only own HP loss/removal triggers feedback. No enemy knowledge or gameplay mutation. */
export function updateAttackWarnings(state:WarningState,next:OwnTarget[],time:number,playing:boolean):{state:WarningState;sound:boolean}{
 let warning=playing&&state.warning&&time<state.warning.expiresAt?state.warning:null;
 const damaged=(state.previous??[]).filter(p=>p.hp>0&&(next.find(n=>n.id===p.id)?.hp??0)<p.hp)
  .sort((a,b)=>priority(a.kind)-priority(b.kind));
 const target=playing&&time>=state.nextAllowed?damaged[0]:undefined;
 if(target){const current=next.find(n=>n.id===target.id)??target;warning={id:target.id,kind:target.kind,position:{...current.position},expiresAt:time+attackWarningConfig.visibleSeconds};}
 return {state:{previous:next,nextAllowed:target?time+attackWarningConfig.cooldownSeconds:state.nextAllowed,warning},sound:!!target};
}
function priority(kind:Kind):number{return kind==='base'?0:kind==='building'?1:2;}
export function warningMessage(warning:AttackWarning|null):string{return warning?warning.kind==='base'?'Your base is under attack!':warning.kind==='building'?'Your building is under attack!':'Your units are under attack!':'';}
export function renderAttackWarning(warning:AttackWarning|null):void {const el=document.getElementById('attack-warning')!;const message=warningMessage(warning);if(el.textContent!==message)el.textContent=message;el.hidden=!warning;}
