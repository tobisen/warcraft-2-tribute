import {expect,it} from 'vitest';
import {maps} from '../config/maps';
import {factionsForPlayer} from '../config/factions';
import {createMatch,updateMatch,type MatchState} from './match';
import {bodyFits} from './map';
import {findRoute} from './navigation';
import {coastalFootprint,findDomainRoute} from './terrainNavigation';
import {orderUnits} from './gathering';
import {beginPlacement,placeBuilding,placementObstacles} from './placement';
import {enqueueProduction} from './productionQueue';
import {placeHarbor,trainShip,commandShips,matchPopulation} from './navy';
import {loadTransport,unloadTransport} from './transport';
import {commandGroupMove} from './groupMovement';
import {commandAttackMove} from './attackMove';
import {knownResource,entityVisible} from './visibility';
import {orderAttack} from './combat';
import {encodeSave,decodeSave} from './save';
const view={camera:{x:0,y:0},building:null};
it('islands have reachable finite resources, separate landmasses and one connected sea',()=>{
 const m=createMatch('skirmish','normal',factionsForPlayer('crown'),'islands');expect(m.gathering.gold!.position).toEqual({x:600,y:300});expect(m.gathering.node.remaining).toBe(800);expect(m.gathering.gold!.remaining).toBe(400);for(const u of [...m.gathering.units,...m.combat.enemies.filter(e=>!e.footprint)])expect(bodyFits(m.map,u.position,12)).toBe(true);expect(findRoute(m.map,{x:688,y:432},{x:912,y:432}).ok).toBe(false);expect(findDomainRoute(m.map,'water',{x:720,y:432},{x:880,y:432},16).ok).toBe(true);expect(findDomainRoute(m.map,'water',{x:720,y:432},{x:1152,y:32},16).ok).toBe(true);expect(coastalFootprint(m.map,{x:672,y:320,width:64,height:64})).toBe(true);
});
for(const faction of ['crown','clans'] as const)it(`${faction} gathers, pays for army/harbor/transport, lands and wins through land combat`,()=>{
 let m=createMatch('skirmish','normal',factionsForPlayer(faction),'islands');
 const select=(id:string)=>{m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.id===id}));if(m.navy)m.navy.ships=m.navy.ships.map(s=>({...s,selected:s.id===id}));};
 const until=(goal:(m:MatchState)=>boolean,max=4000)=>{for(let i=0;i<max&&!goal(m)&&m.outcome==='playing';i++)m=updateMatch(m,.1);expect(goal(m),`time ${m.waves.elapsedSeconds}; ${JSON.stringify({navy:m.navy,units:m.gathering.units,production:m.soldierProduction})}`).toBe(true);};
 for(let i=0;i<2400&&(m.gathering.wood<180||m.gathering.goldBalance!<60);i++){
  for(const worker of m.gathering.units){if(worker.kind!=='worker')continue;const node=worker.id==='unit-3'?m.gathering.gold!:m.gathering.node;if(worker.order.kind==='gather'||worker.order.kind==='deliver')continue;select(worker.id);m.gathering.units=knownResource(m.fog!,node.position)?orderUnits(m.gathering.units,node.position,node):commandGroupMove(m.gathering.units,{x:600,y:220},m.map);}
  m=updateMatch(m,.1);
 }
 expect(m.gathering.wood).toBeGreaterThanOrEqual(180);select('unit-1');const placed=placeBuilding(beginPlacement(m.placement),{x:512,y:384},m.gathering.wood,placementObstacles(m.gathering),{map:m.map,gathering:m.gathering,enemies:m.combat.enemies.filter(e=>entityVisible(m.fog!,'player',e))});expect(placed.gathering).toBeTruthy();m={...m,map:placed.map!,gathering:placed.gathering!,placement:placed.placement};until(m=>m.placement.construction!.remainingSeconds===0);
 for(let i=0;i<3;i++){const p=enqueueProduction(m.gathering,m.soldierProduction,{kind:'barracks',footprint:m.placement.barracks},matchPopulation(m));expect(p.production).not.toBe(m.soldierProduction);m={...m,gathering:p.gathering,soldierProduction:p.production};}
 select('unit-1');m.placement={...m.placement,active:true,kind:'harbor'};m=placeHarbor(m,{x:672,y:320});expect(m.navy!.harbor).toBeTruthy();until(m=>m.navy!.harbor!.construction.remainingSeconds===0&&m.gathering.units.filter(u=>u.kind==='soldier').length===3);m=trainShip(m,'transport');expect(m.navy!.production.queue).toHaveLength(1);until(m=>m.navy!.ships.length===1);
 select('ship-1');m.navy=commandShips(m,{x:720,y:432});until(m=>m.navy!.ships[0].order.kind==='idle');
 m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.kind==='soldier'}));m.gathering.units=orderUnits(m.gathering.units,{x:688,y:432});until(m=>m.gathering.units.filter(u=>u.kind==='soldier').every(u=>Math.hypot(u.position.x-720,u.position.y-432)<=64));m=loadTransport(m,'ship-1');expect(m.navy!.ships[0].passengers).toHaveLength(3);expect(matchPopulation(m).used).toBe(8);
 const loaded=decodeSave(encodeSave({...m,paused:true},view));expect(loaded.ok).toBe(true);if(!loaded.ok)throw Error(loaded.error);m={...loaded.match,paused:false};select('ship-1');m.navy=commandShips(m,{x:880,y:432});until(m=>m.navy!.ships[0].order.kind==='idle');m=unloadTransport(m,'ship-1',{x:912,y:432});expect(m.navy!.ships[0].passengers).toEqual([]);expect(m.gathering.units.filter(u=>u.kind==='soldier')).toHaveLength(3);
 m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.kind==='soldier'}));m.gathering.units=commandAttackMove(m.gathering.units,{x:944,y:208},m.map);
 for(let i=0;i<1500&&m.outcome==='playing';i++){
  if(i%5===0){const visible=m.combat.enemies.filter(e=>e.hp>0&&entityVisible(m.fog!,'player',e));for(const unit of m.gathering.units.filter(u=>u.kind==='soldier')){select(unit.id);const target=visible.filter(e=>Math.hypot(e.position.x-unit.position.x,e.position.y-unit.position.y)<=160).sort((a,b)=>Number(!!a.footprint)-Number(!!b.footprint)||Math.hypot(a.position.x-unit.position.x,a.position.y-unit.position.y)-Math.hypot(b.position.x-unit.position.x,b.position.y-unit.position.y))[0];if(target)m.gathering.units=orderAttack(m.gathering.units,target.id);else if(unit.order.kind==='idle')m.gathering.units=commandAttackMove(m.gathering.units,{x:944,y:208},m.map);}}
  m=updateMatch(m,.1);
 }
 expect(m.outcome).toBe('victory');expect(m.enemyProduction!.acceptedJobs).toBeGreaterThan(0);expect(m.combat.baseHP).toBe(240);const woodSpent=faction==='crown'?180:174,goldSpent=faction==='crown'?35:38;const cargo=(type:'wood'|'gold')=>m.gathering.units.reduce((n,u)=>n+(u.kind==='worker'&&(u.cargoType??'wood')===type?u.cargo:0),0);expect(m.gathering.wood+m.gathering.node.remaining+cargo('wood')+m.gathering.lostCargo!.wood+m.enemyProduction!.extracted!.wood+woodSpent).toBeCloseTo(800);expect(m.gathering.goldBalance!+m.gathering.gold!.remaining+cargo('gold')+m.gathering.lostCargo!.gold+m.enemyProduction!.extracted!.gold+goldSpent).toBeCloseTo(400);expect(updateMatch(m,100)).toBe(m);expect(m.gathering.node.remaining).toBeGreaterThan(0);expect(m.gathering.gold!.remaining).toBeGreaterThan(0);expect(decodeSave(encodeSave(m,view)).ok).toBe(true);
},30000);
it('island profile and map-specific resource positions cannot be forged as old saves',()=>{const m=createMatch('skirmish','easy',factionsForPlayer('clans'),'islands'),json=encodeSave(m,view);for(const mutate of [(d:any)=>d.state.gathering.gold.position={x:850,y:220},(d:any)=>d.configVersion='tribute-config-13',(d:any)=>d.state.scenario='survival']){const d=JSON.parse(json);mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}const d=JSON.parse(encodeSave(createMatch(),view));d.configVersion='tribute-config-13';expect(decodeSave(JSON.stringify(d)).ok).toBe(true);expect(maps.islands.enemyAttackWaypoints).toHaveLength(3);});
