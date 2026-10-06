import {createClassicMatch} from './testHelpers/classicMatch';
import {expect,it} from 'vitest';
import {createMatch,updateMatch} from './match';
import {orderAttack,updateCombat,type Enemy} from './combat';
import {updateGathering} from './gathering';
import {issueOrder} from './commandOrders';
import {workerCombatConfig} from '../config/unit';
import {replaceObstacles,bodyFits} from './map';
import {encodeSave,decodeSave} from './save';
import {beginPlacement,placeBuilding,placementObstacles} from './placement';
const view={camera:{x:0,y:0},building:null} as const;
const target=():Enemy=>({id:'enemy-1',kind:'unit',role:'soldier',owner:'enemy',hp:36,position:{x:304,y:300},order:{kind:'idle'}});
function fixture(classic=false){const m=(classic?createClassicMatch:createMatch)();m.gathering.units.forEach((u,i)=>u.selected=i===0);m.combat.enemies=[target()];m.waves.nextEnemyNumber=2;return m;}
it('manual workers deal 2 melee damage per second alongside selected soldiers, with no military research multiplier',()=>{
 const m=fixture(),worker=m.gathering.units[0];const soldier={...worker,id:'unit-4',kind:'soldier' as const,hp:60,cargo:0 as const,cargoType:undefined,order:{kind:'idle' as const},selected:true};
 const workers=updateCombat({...m.gathering,units:orderAttack([worker],'enemy-1')},m.combat,1,m.map);expect(workers.combat.enemies[0].hp).toBeCloseTo(34);
 const mixed=updateCombat({...m.gathering,units:orderAttack([worker,soldier],'enemy-1')},m.combat,1,m.map);expect(mixed.combat.enemies[0].hp).toBeCloseTo(16);
 const upgraded=updateCombat({...m.gathering,units:orderAttack([worker],'enemy-1')},{...m.combat,upgrades:{attack:1,defense:1}},1,m.map);expect(upgraded.combat.enemies[0].hp).toBeCloseTo(34);expect(workerCombatConfig.range).toBe(16);
});
it('preserves carried resources when interrupting work and allows a new gather order',()=>{
 let m=fixture();m.gathering.node.remaining-=3;m.gathering.units[0].cargo=3;m.gathering.units[0].order={kind:'gather',nodeId:m.gathering.node.id};
 m=issueOrder(m,{kind:'attack',enemyId:'enemy-1'});expect(m.gathering.units[0].order.kind).toBe('attack');const original=m.gathering.node.remaining;
 const gathering=updateGathering(m.gathering,1,m.map);expect(gathering.node.remaining).toBe(original);expect(gathering.units[0].cargo).toBe(3);
 m=updateMatch(m,.2);expect(m.gathering.units[0].cargo).toBe(3);expect(m.combat.enemies[0].hp).toBeLessThan(36);
 m=issueOrder(m,{kind:'gather',nodeId:m.gathering.node.id});expect(m.gathering.units[0].order.kind).toBe('gather');expect(m.gathering.units[0].cargo).toBe(3);
});
it('never acquires targets automatically, cannot attack air/sea, and stops when vision is lost',()=>{
 const m=fixture(),worker=m.gathering.units[0];expect(updateCombat(m.gathering,m.combat,1,m.map).combat.enemies[0].hp).toBe(36);
 for(const enemy of [{...target(),role:'air' as const},{...target(),kind:'ship' as const}]){const result=updateCombat({...m.gathering,units:orderAttack([worker],enemy.id)},{...m.combat,enemies:[enemy]},1,m.map);expect(result.combat.enemies[0].hp).toBe(36);expect(result.gathering.units[0].order.kind).toBe('idle');}
 const hidden=updateCombat({...m.gathering,units:orderAttack([worker],'enemy-1')},m.combat,1,m.map,undefined,()=>false);expect(hidden.combat.enemies[0].hp).toBe(36);expect(hidden.gathering.units[0].order.kind).toBe('idle');
});
it('cannot melee through a wall and uses a body-safe approach after access opens',()=>{
 const m=fixture(),worker=m.gathering.units[0],enemy={...target(),position:{x:400,y:300}};
 const blocked=replaceObstacles(m.map,[{x:320,y:0,width:32,height:m.map.height}]);let result=updateCombat({...m.gathering,units:orderAttack([worker],enemy.id)},{...m.combat,enemies:[enemy]},3,blocked);
 expect(result.combat.enemies[0].hp).toBe(36);expect(result.gathering.units[0].position).toEqual(worker.position);expect(result.gathering.units[0].navigation?.status).toBe('blocked');
 result=updateCombat(result.gathering,result.combat,1,replaceObstacles(blocked,[]));expect(result.combat.enemies[0].hp).toBeLessThan(36);expect(bodyFits({...blocked,obstacles:[]},result.gathering.units[0].position,12)).toBe(true);
});
it('roundtrips current and queued worker attacks, validates refs, and rejects relabelled old-version attacks',()=>{
 let m=issueOrder(fixture(),{kind:'attack',enemyId:'enemy-1'});m=issueOrder(m,{kind:'attack',enemyId:'enemy-1'},true);
 const raw=JSON.parse(encodeSave(m,view)),loaded=decodeSave(JSON.stringify(raw));expect(loaded.ok).toBe(true);if(!loaded.ok)throw Error(loaded.error);expect(loaded.match.gathering.units[0].orderQueue).toEqual([{kind:'attack',enemyId:'enemy-1'}]);expect(updateMatch(loaded.match,.2).combat.enemies[0].hp).toBeLessThan(36);
 const forged=structuredClone(raw);forged.state.gathering.units[0].order.enemyId='missing';expect(decodeSave(JSON.stringify(forged)).ok).toBe(false);
 for(const version of [57,58]){const old=structuredClone(raw);old.configVersion=`tribute-config-${version}`;expect(decodeSave(JSON.stringify(old)).ok).toBe(false);}
 const genuine=JSON.parse(encodeSave(fixture(true),view));genuine.configVersion='tribute-config-58';expect(decodeSave(JSON.stringify(genuine)).ok).toBe(true);
});
it('target death clears manual worker attacks and construction can be interrupted',()=>{
 const m=fixture(),gathering={...m.gathering,units:orderAttack(m.gathering.units,'enemy-1')};const dead=updateCombat(gathering,{...m.combat,enemies:[{...target(),hp:1}]},1,m.map);expect(dead.combat.enemies).toHaveLength(0);expect(dead.gathering.units[0].order.kind).toBe('idle');
 const building=createMatch();building.gathering.units.forEach((u,i)=>u.selected=i===2);building.gathering.wood=60;building.placement=beginPlacement(building.placement,'farm');const placed=placeBuilding(building.placement,{x:560,y:416},60,placementObstacles(building.gathering),{map:building.map,gathering:building.gathering,enemies:building.combat.enemies});expect(placed.gathering?.units[2].order.kind).toBe('build');
 const interrupted=issueOrder({...building,placement:placed.placement,gathering:placed.gathering!,map:placed.map!},{kind:'attack',enemyId:'enemy-1'});expect(interrupted.gathering.units[2].order.kind).toBe('attack');expect(interrupted.placement.farms).toHaveLength(1);
});

it('uses the same weak melee damage against buildings',()=>{
 const m=fixture(),enemy:Enemy={...target(),kind:'building',buildingType:'outpost',footprint:{x:292,y:284,width:32,height:32},position:{x:308,y:300}};
 const result=updateCombat({...m.gathering,units:orderAttack([m.gathering.units[0]],enemy.id)},{...m.combat,enemies:[enemy]},1,m.map);expect(result.combat.enemies[0].hp).toBeCloseTo(34);
});
