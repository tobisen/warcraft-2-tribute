import {expect,it} from 'vitest';
import {updateCombat,type CombatState,type Enemy} from './combat';
import {updateGathering,orderUnits,type GatheringState,type Soldier,type Worker} from './gathering';
import {canDefend,defending,defenseTarget} from './selfDefense';
import {stopSelected} from './orders';
import {createMatch} from './match';
import {encodeSave,decodeSave} from './save';
import {issueOrder} from './commandOrders';
import {createNavy} from './navy';
const unit=(extra:Partial<Soldier>={}):Soldier=>({id:'unit-1',kind:'soldier',hp:60,cargo:0,selected:true,position:{x:100,y:100},target:{x:300,y:100},order:{kind:'move'},...extra});
const enemy=(extra:Partial<Enemy>={}):Enemy=>({id:'enemy-1',owner:'enemy',kind:'unit',hp:100,position:{x:124,y:100},order:{kind:'defend',targetId:'unit-1'},...extra});
const economy=(u:GatheringState['units'][number]):GatheringState=>({faction:'crown',units:[u],wood:0,base:{x:400,y:400},node:{id:'wood',position:{x:100,y:100},remaining:100}});
const combat=(e=enemy()):CombatState=>({baseHP:240,enemies:[e]});
it('melee damage interrupts movement, counters without moving, then resumes the preserved destination',()=>{
 const u=unit(),g=economy(u);let r=updateCombat(g,combat(),.1);
 expect(defending(r.gathering.units[0])).toBe(true);expect(r.gathering.units[0].order).toBe(u.order);
 const before=r.combat.enemies[0].hp;r=updateCombat(updateGathering(r.gathering,.2),r.combat,.2);
 expect(r.combat.enemies[0].hp).toBeLessThan(before);expect(r.gathering.units[0].position).toEqual(u.position);
 r=updateCombat(r.gathering,{...r.combat,enemies:[]},.1);expect(r.gathering.units[0].selfDefense).toBeUndefined();
 expect(updateGathering(r.gathering,.2).units[0].position.x).toBeGreaterThan(100);
});
it('ranged impact identifies its shooter, retaliates with ranged weapons and does not pursue',()=>{
 const u=unit({archetype:'archer'}),c=combat(enemy({role:'archer',position:{x:200,y:100}}));
 c.projectiles=[{id:'enemy-arrow-1',owner:'enemy',shooterId:'enemy-1',targetId:'unit-1',position:{x:100,y:100},destination:{x:100,y:100},speed:200,remainingLife:1,damage:1,hitRadius:12}];
 let r=updateCombat(economy(u),c,.1);expect(r.gathering.units[0].selfDefense?.attackerId).toBe('enemy-1');
 r=updateCombat(r.gathering,r.combat,.2);expect(r.combat.projectiles?.some(p=>p.shooterId==='unit-1')).toBe(true);expect(r.gathering.units[0].position).toEqual(u.position);
 const far={...r.combat.enemies[0],position:{x:1000,y:100}};r=updateCombat(r.gathering,{...r.combat,enemies:[far]},.1);expect(r.gathering.units[0].selfDefense).toBeUndefined();
});
it('gatherers retain cargo/node and resume working; enemy gatherers also counter from their post',()=>{
 const u:Worker={...unit(),kind:'worker',cargo:3,order:{kind:'gather',nodeId:'wood'}};
 let r=updateCombat(economy(u),combat(enemy({position:{x:112,y:100}})),.1);expect(defending(r.gathering.units[0])).toBe(true);
 expect(updateGathering(r.gathering,1).units[0].cargo).toBe(3);
 r=updateCombat(r.gathering,{...r.combat,enemies:[]},.1);expect(updateGathering(r.gathering,1).units[0].cargo).toBeGreaterThan(3);
 const worker=enemy({id:'enemy-worker-1',kind:'worker',position:{x:112,y:100},order:undefined,work:{cargo:2,target:{x:112,y:100},order:{kind:'gather',nodeId:'wood'}}});
 r=updateCombat(economy(unit({order:{kind:'attack',enemyId:worker.id}})),combat(worker),.1);expect(r.combat.enemies[0].selfDefense?.attackerId).toBe('unit-1');
 const hp=r.gathering.units[0].hp!;r=updateCombat(r.gathering,r.combat,.1);expect(r.gathering.units[0].hp).toBeLessThan(hp);expect(r.combat.enemies[0].work?.cargo).toBe(2);
});
it('death, concealment, missing and incompatible targets clear defense; scouts and transports never retaliate',()=>{
 const u=unit();u.selfDefense={attackerId:'enemy-1',order:u.order};
 for(const enemies of [[],[enemy({hp:0})],[enemy({role:'air'})]])expect(defenseTarget(u,enemies,'crown')).toBeUndefined();
 expect(defenseTarget(u,[enemy()],'crown',undefined,()=>false)).toBeUndefined();
 expect(updateCombat(economy(u),combat(),.1,undefined,undefined,()=>false).gathering.units[0].selfDefense).toBeUndefined();
 expect(canDefend(unit({archetype:'scout'}),enemy(),'crown')).toBe(false);
 expect(canDefend({id:'ship-1',kind:'ship',role:'transport',owner:'player',selected:true,hp:100,position:u.position,target:u.target,order:{kind:'move'}},enemy(),'crown')).toBe(false);
});
it('new move/stop/queued orders cancel defense, while selection alone preserves it',()=>{
 const u=unit();u.selfDefense={attackerId:'enemy-1',order:u.order};
 expect(defending(Object.assign({},u,{selected:false}))).toBe(true);
 expect(defending(orderUnits([u],{x:500,y:100})[0])).toBe(false);expect(defending(stopSelected([u],true)[0])).toBe(false);
 let m=createMatch('skirmish');m.gathering.units=[u];expect(issueOrder(m,{kind:'hold'}).gathering.units[0].selfDefense).toBeUndefined();expect(issueOrder(m,{kind:'move',destination:{x:500,y:100}},true).gathering.units[0].selfDefense).toBeUndefined();
});
it('warships respond to an actual hit, keep their move order, and hold position',()=>{
 const u=unit(),ship={id:'ship-1',kind:'ship' as const,owner:'player' as const,hp:100,selected:true,position:u.position,target:u.target,order:{kind:'move' as const}};
 const e=enemy({position:{x:140,y:100},role:'archer',order:{kind:'defend',targetId:'ship-1'}}),c=combat(e);
 c.projectiles=[{id:'enemy-arrow-1',owner:'enemy',shooterId:e.id,targetId:ship.id,targets:['sea'],position:u.position,destination:u.position,speed:200,remainingLife:1,damage:1,hitRadius:12}];
 let r=updateCombat({...economy(u),units:[]},c,.1,undefined,undefined,undefined,undefined,undefined,undefined,{...createNavy(),ships:[ship]});
 expect(defending(r.navy!.ships[0])).toBe(true);r=updateCombat(r.gathering,r.combat,.2,undefined,undefined,undefined,undefined,undefined,undefined,r.navy);expect(r.navy!.ships[0].order).toEqual(ship.order);expect(r.navy!.ships[0].position).toEqual(ship.position);
});
it('Save/Load preserves the underlying order and resets transient defense; restart starts clean',()=>{
 const m=createMatch('skirmish');const u=m.gathering.units[0];u.selfDefense={attackerId:'enemy-1',order:u.order};
 const json=encodeSave(m,{building:null,camera:{x:0,y:0}});expect(json).not.toContain('selfDefense');
 const loaded=decodeSave(json);expect(loaded.ok).toBe(true);if(loaded.ok){expect(loaded.match.gathering.units[0].order).toEqual(u.order);expect(loaded.match.gathering.units[0].selfDefense).toBeUndefined();}
 expect(createMatch(m.scenario).gathering.units.every(u=>!u.selfDefense)).toBe(true);
});
import {matchPlayers} from './players';
import {projectMultiplePlayers} from './multiplePlayers';
import {updateMatch} from './match';
it('shared combat preserves owner IDs and does not retaliate against allied units',()=>{
 for(const allied of [false,true]){
  const roster=matchPlayers(undefined,undefined,3);if(allied)roster[1].teamId=1;
  let m=createMatch('skirmish','normal',undefined,'plains96',1,'balanced',roster);
  const w=m.gathering.units[0];w.position={x:500,y:500};w.target={...w.position};w.order={kind:'gather',nodeId:'wood-1'};
  const bot=m.multiplePlayers!.ai[0];bot.state.combat.enemies.push(enemy({id:'enemy-produced-1',role:'soldier',position:{x:524,y:500},order:{kind:'defend',targetId:w.id}}));
  m=updateMatch(projectMultiplePlayers(m),.1);
  expect(!!m.gathering.units.find(u=>u.id===w.id)?.selfDefense).toBe(!allied);
  if(!allied)expect(m.gathering.units.find(u=>u.id===w.id)?.selfDefense?.attackerId).toBe('enemy-produced-1');
 }
});
it('a dead attacker releases defense without discarding an unfinished move order',()=>{
 const u=unit();u.selfDefense={attackerId:'enemy-1',order:u.order};const r=updateCombat(economy(u),combat(enemy({hp:1})),1);
 expect(r.combat.enemies).toHaveLength(0);expect(r.gathering.units[0].order).toEqual(u.order);expect(r.gathering.units[0].selfDefense).toBeUndefined();
});
