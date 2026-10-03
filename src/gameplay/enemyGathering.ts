import {enemyEconomyConfig} from '../config/enemyEconomy';
import {combatConfig} from '../config/combat';
import {defaultFactions} from '../config/factions';
import {chooseSpawn} from './spawning';
import {orderUnits,updateGathering,type GatheringState,type Worker} from './gathering';
import type {Enemy,EnemyWork} from './combat';
import type {MatchState} from './match';
import type {ResourceService} from './resourceQueue';
import type {GateFor} from './traffic';
export function enemyWorker(e:Enemy):Worker|null {return e.kind==='worker'&&e.work?{id:e.id,owner:'player',kind:'worker',hp:e.hp,selected:false,position:e.position,target:e.work.target,cargo:e.work.cargo,cargoType:e.work.cargoType,order:e.work.order,navigation:e.navigation}:null;}
export function addEnemyWorkers(m:MatchState):void {
 const base=m.combat.enemies.find(e=>e.kind==='base');if(!base?.footprint||!m.enemyProduction)return;
 for(let i=0;i<enemyEconomyConfig.workerCount;i++){
  const position=chooseSpawn(m.map,base.footprint,'barracks',m.gathering.units,m.combat.enemies);if(!position)throw Error('No enemy worker spawn');
  m.combat.enemies.push({id:`enemy-worker-${i+1}`,owner:'enemy',kind:'worker',hp:combatConfig.workerHP,position,work:{target:{...position},cargo:0,order:{kind:'idle'}}});
 }
 m.enemyProduction={...m.enemyProduction,extracted:{wood:0,gold:0},spent:{wood:0,gold:0},lostCargo:{wood:0,gold:0}};
}
/** Assign jobs before the shared queue and passage scheduler take their snapshot. */
export function prepareEnemyGathering(m:MatchState):MatchState {
 if(!m.combat.enemies.some(e=>e.kind==='base'&&e.hp>0))return m;
 return {...m,combat:{...m.combat,enemies:m.combat.enemies.map(e=>{
  if(!e.work||e.hp<=0||e.work.order.kind!=='idle')return e;
  const resource=enemyEconomyConfig.resources[(Number(e.id.split('-').at(-1))-1)%enemyEconomyConfig.resources.length],node=resource==='wood'?m.gathering.node:m.gathering.gold;
  if(!node||node.remaining<=0)return e;
  const u=orderUnits([{...enemyWorker(e)!,selected:true}],node.position,node)[0] as Worker;
  return {...e,work:{...e.work,target:u.target,order:u.order as EnemyWork['order']}};
 })}};
}
/** Temporary view reuses gathering; enemy workers remain authoritative combat entities. */
export function updateEnemyGathering(m:MatchState,delta:number,gateFor?:GateFor,services?:Map<string,ResourceService>):MatchState {
 const workers=m.combat.enemies.flatMap(e=>{const worker=enemyWorker(e);return worker?[worker]:[];}),bank=m.enemyProduction;
 if(!workers.length||!bank)return m;
 const base=m.combat.enemies.find(e=>e.kind==='base'&&e.hp>0);
 if(!base?.footprint)return {...m,combat:{...m.combat,enemies:m.combat.enemies.map(e=>e.work?{...e,navigation:undefined,work:{...e.work,order:{kind:'idle'}}}:e)}};
 let g:GatheringState={units:workers,wood:bank.wood,goldBalance:bank.gold,base:base.position,baseSize:base.footprint.width,dropoffs:m.combat.enemies.filter(e=>e.buildingType==='outpost'&&e.hp>0&&e.construction?.remainingSeconds===0).map(e=>e.footprint!),faction:(m.factions??defaultFactions).enemy,node:m.gathering.node,gold:m.gathering.gold};
 for(const worker of workers){if(worker.order.kind!=='idle')continue;const index=Number(worker.id.split('-').at(-1))-1,resource=enemyEconomyConfig.resources[index%enemyEconomyConfig.resources.length],node=resource==='wood'?g.node:g.gold;if(node&&node.remaining>0)g.units=orderUnits(g.units.map(u=>({...u,selected:u.id===worker.id})),node.position,node);}
 g=updateGathering(g,delta,m.map,{elapsedSeconds:m.waves.elapsedSeconds,gateFor,team:'enemy',services});
 const byId=new Map(g.units.map(u=>[u.id,u as Worker]));
 return {...m,gathering:{...m.gathering,node:g.node,...(g.gold?{gold:g.gold}:{})},enemyProduction:{...bank,wood:g.wood,gold:g.goldBalance??0,extracted:{wood:(bank.extracted?.wood??0)+m.gathering.node.remaining-g.node.remaining,gold:(bank.extracted?.gold??0)+(m.gathering.gold?.remaining??0)-(g.gold?.remaining??0)}},combat:{...m.combat,enemies:m.combat.enemies.map(e=>{const u=byId.get(e.id);return u?{...e,position:u.position,navigation:u.navigation,work:{cargo:u.cargo,cargoType:u.cargoType,target:u.target,order:u.order as EnemyWork['order']}}:e;})}};
}
