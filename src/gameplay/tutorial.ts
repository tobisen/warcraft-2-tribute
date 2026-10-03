import {tutorialConfig} from '../config/tutorial';
import {maps} from '../config/maps';
import {combatConfig} from '../config/combat';
import {combatUnitStats,unitStats} from '../config/unit';
import {barracksReady} from './construction';
import {spawnCandidates,unitBody} from './spawning';
import {overlaps} from './map';
import {isVisible} from './fog';
import type {MatchState} from './match';
import type {Position} from './movement';
export interface TutorialState {step:number;workerId?:string;moveStart?:Position;moveOrdered?:boolean}
export const createTutorial=():TutorialState=>({step:0});
export function tutorialDeliveredWood(m:MatchState):number {
 const cargo=[...m.gathering.units,...(m.navy?.ships??[]).flatMap(s=>s.passengers??[])].reduce((n,u)=>n+(u.kind==='worker'&&(u.cargoType??'wood')==='wood'?u.cargo:0),0);
 return maps[m.map.id??'arena'].wood-m.gathering.node.remaining-cargo-(m.gathering.lostCargo?.wood??0);
}
/** Sequential milestones observe real orders/economy; no wall clock or free units. */
export function updateTutorial(m:MatchState):MatchState {
 if(m.scenario!=='tutorial'||!m.tutorial||m.paused||m.outcome!=='playing')return m;
 const t=m.tutorial;
 if(t.step===0){const worker=m.gathering.units.find(u=>u.selected&&u.kind==='worker');return worker?{...m,tutorial:{step:1,workerId:worker.id,moveStart:{...worker.position},moveOrdered:worker.order.kind==='move'}}:m;}
 if(t.step===1){const worker=m.gathering.units.find(u=>u.id===t.workerId),selected=m.gathering.units.find(u=>u.kind==='worker'&&u.selected);
  if(selected&&!worker?.selected&&selected.id!==t.workerId)return {...m,tutorial:{step:1,workerId:selected.id,moveStart:{...selected.position},moveOrdered:selected.order.kind==='move'}};
  const ordered=t.moveOrdered||worker?.order.kind==='move';
  if(worker&&ordered&&t.moveStart&&Math.hypot(worker.position.x-t.moveStart.x,worker.position.y-t.moveStart.y)+1e-8>=tutorialConfig.moveDistance)return {...m,tutorial:{step:2}};
  return ordered&&!t.moveOrdered?{...m,tutorial:{...t,moveOrdered:true}}:m;
 }
 if(t.step===2)return tutorialDeliveredWood(m)+1e-8>=tutorialConfig.deliveredWood?{...m,tutorial:{step:3}}:m;
 if(t.step===3)return barracksReady(m.placement)?{...m,tutorial:{step:4}}:m;
 if(t.step===4){const soldiers=m.gathering.units.filter(u=>u.kind==='soldier');if(!soldiers.length||!m.placement.barracks)return m;
  const position=spawnCandidates(m.map,m.placement.barracks,'barracks',combatConfig.enemySize).find(p=>(!m.fog||isVisible(m.fog,'player',p))&&!m.gathering.units.some(u=>overlaps(unitBody(p,combatConfig.enemySize),unitBody(u.position,u.kind==='worker'?unitStats.size:combatUnitStats(u).size))));
  if(!position)return m;
  return {...m,tutorial:{step:5},waves:{...m.waves,nextEnemyNumber:2},combat:{...m.combat,enemies:[...m.combat.enemies,{id:'enemy-1',kind:'unit',owner:'enemy',order:{kind:'idle'},hp:tutorialConfig.targetHP,position:{...position}}]},gathering:{...m.gathering,units:m.gathering.units.map(u=>u.kind==='soldier'?{...u,autoDisabled:true}:u)}};
 }
 if(t.step===5&&!m.combat.enemies.some(e=>e.id==='enemy-1'&&e.hp>0))return {...m,tutorial:{step:6}};
 return m;
}
