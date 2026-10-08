import {factions,defaultFactions} from '../config/factions';
import {airMap} from './domains';
import {bodyFits} from './map';
import {commandMappedMove,planRoute} from './navigation';
import {hasMainBase} from './extraBases';
import type {MatchState} from './match';
import type {Position} from './movement';
import type {Soldier} from './gathering';
import type {Enemy} from './combat';
export interface ScoutState {mode:'route'|'auto';waypoints:Position[];index:number;nextPlanSeconds:number}
export const scoutRules={maxWaypoints:16,replanSeconds:5,sampleStride:4};
const selectedScout=(u:import('./gathering').Unit):u is Soldier=>u.kind==='soldier'&&u.archetype==='scout'&&u.hp>0&&u.selected;
export function setScoutRoute(m:MatchState,points:readonly Position[]):MatchState{if(m.paused||m.outcome!=='playing'||!hasMainBase(m)||points.length<2||points.length>scoutRules.maxWaypoints||points.some(p=>!Number.isFinite(p.x)||!Number.isFinite(p.y)||!bodyFits(airMap(m.map),p,11)))return m;return {...m,gathering:{...m.gathering,units:m.gathering.units.map(u=>selectedScout(u)?{...u,commandMode:undefined,orderQueue:undefined,attackMoveTarget:undefined,scouting:{mode:'route',waypoints:points.map(p=>({...p})),index:0,nextPlanSeconds:0},navigation:undefined}:u)}};}
export function autoScout(m:MatchState):MatchState{if(m.paused||m.outcome!=='playing'||!hasMainBase(m))return m;return {...m,gathering:{...m.gathering,units:m.gathering.units.map(u=>selectedScout(u)?{...u,commandMode:undefined,orderQueue:undefined,attackMoveTarget:undefined,scouting:{mode:'auto',waypoints:[],index:0,nextPlanSeconds:m.waves.elapsedSeconds},navigation:undefined}:u)}};}
/** Reads only own/team explored bits, bounds and current scout position; never entity/economy knowledge. */
export function autoScoutGoal(m:Pick<MatchState,'fog'|'map'>,position:Position,team:'player'|'enemy',previous?:Position):Position{
 const fog=m.fog,step=fog?.tileSize??32,columns=fog?.columns??Math.ceil(m.map.width/step),rows=fog?.rows??Math.ceil(m.map.height/step);let best:Position|undefined,score=Infinity;
 const fit=(p:Position)=>({x:Math.max(11,Math.min(m.map.width-11,p.x)),y:Math.max(11,Math.min(m.map.height-11,p.y))});
 for(let row=0;row<rows;row+=scoutRules.sampleStride)for(let col=0;col<columns;col+=scoutRules.sampleStride){if(fog?.teams[team].explored[row*columns+col])continue;const p=fit({x:(col+.5)*step,y:(row+.5)*step}),d=Math.hypot(p.x-position.x,p.y-position.y);if(d<24||previous&&Math.hypot(p.x-previous.x,p.y-previous.y)<24)continue;if(d<score){best=p;score=d;}}
 if(best)return best;
 return [{x:m.map.width*.2,y:m.map.height*.2},{x:m.map.width*.8,y:m.map.height*.2},{x:m.map.width*.8,y:m.map.height*.8},{x:m.map.width*.2,y:m.map.height*.8}].map(fit).sort((a,b)=>Math.hypot(b.x-position.x,b.y-position.y)-Math.hypot(a.x-position.x,a.y-position.y))[0];
}
function nextState(m:MatchState,u:{position:Position;scouting?:ScoutState},team:'player'|'enemy'):ScoutState|undefined{const old=u.scouting;if(!old)return;let index=old.index,goal=old.waypoints[index];const arrived=goal&&Math.hypot(goal.x-u.position.x,goal.y-u.position.y)<1e-6;
 if(old.mode==='route')return arrived?{...old,index:(index+1)%old.waypoints.length}:old;
 if(goal&&!arrived||m.waves.elapsedSeconds+1e-9<old.nextPlanSeconds)return old;
 return {mode:'auto',waypoints:[autoScoutGoal(m,u.position,team,goal)],index:0,nextPlanSeconds:m.waves.elapsedSeconds+scoutRules.replanSeconds};
}
/** Bounded decisions; actual movement uses the existing air navigation and gameplay delta. */
export function prepareScouting(m:MatchState,side?:'player'|'enemy'):MatchState{if(m.paused||m.outcome!=='playing')return m;
 const units=side==='enemy'?m.gathering.units:m.gathering.units.map(u=>{if(u.kind!=='soldier'||u.archetype!=='scout'||u.hp<=0||!u.scouting)return u;const scouting=nextState(m,u,'player')!,goal=scouting.waypoints[scouting.index];if(!goal)return {...u,scouting};if(u.navigation&&u.target.x===goal.x&&u.target.y===goal.y)return {...u,scouting};const moved=commandMappedMove([{...u,selected:true}],goal,m.map)[0] as Soldier;return {...moved,selected:u.selected,scouting,autoDisabled:true};});
 const enemies=side==='player'?m.combat.enemies:m.combat.enemies.map((e):Enemy=>{if(e.role!=='scout'||e.hp<=0||!e.scouting)return e;const scouting=nextState(m,e,'enemy')!,goal=scouting.waypoints[scouting.index];if(!goal)return {...e,scouting};const same=e.order?.kind==='muster'&&e.order.destination.x===goal.x&&e.order.destination.y===goal.y;return {...e,scouting,order:{kind:'muster',destination:{...goal}},navigation:same&&e.navigation?e.navigation:planRoute({...airMap(m.map),bodyHalf:factions[e.faction??(m.factions??defaultFactions).enemy].units.scout.size/2},e.position,goal)};});
 return {...m,gathering:{...m.gathering,units},combat:{...m.combat,enemies}};
}
