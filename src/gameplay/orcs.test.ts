import {matchLabels} from '../presentation/hud';
import {expect,it} from 'vitest';
import {factions,factionsForPlayer} from '../config/factions';
import {createMatch} from './match';
import {updateCombat} from './combat';
import {useAbility} from './abilities';
import {enqueueProduction,updateQueuedProduction} from './productionQueue';
import {updateGathering,type Soldier} from './gathering';
import {replaceObstacles} from './map';
import {encodeSave,decodeSave} from './save';
import {unitFrame,motion} from '../presentation/animation';

it('Orc identity and recipes implement a distinct five-role offensive roster',()=>{
 const f=factions.clans,m=createMatch('tutorial','beginner',factionsForPlayer('clans'));
 expect(f.label).toContain('Orcs');expect(f.roster).toEqual(['worker','soldier','archer','catapult','specialist']);
 expect(f.units.worker).toMatchObject({hp:35,speed:155});expect(m.combat.baseHP).toBe(260);expect(matchLabels(m).health).toBe('Stronghold: 260 / 260 HP');expect(m.gathering.units[0].hp).toBe(35);
 expect(f.units.soldier).toMatchObject({cost:{wood:18,gold:6},hp:66,durationSeconds:6,damagePerSecond:20});
 expect(f.units.archer).toMatchObject({hp:45,speed:135,range:144,attackInterval:1.1});
 expect(f.units.catapult).toMatchObject({hp:90,speed:75,range:208,damage:26,attackInterval:2.1,durationSeconds:11});
 expect(f.units.specialist).toMatchObject({art:'specialist',hp:80,speed:175,damagePerSecond:24,cost:{wood:26,gold:12},durationSeconds:7,supply:2});
 expect(f.upgrades.attack).toMatchObject({name:'War Blades',cost:{wood:35,gold:15},multiplier:1.3});expect(f.upgrades.defense).toMatchObject({name:'Hide Armor',multiplier:.8});
 expect(f.naval.harbor).toMatchObject({name:'War Dock',hp:170});expect(f.naval.units.transport).toMatchObject({name:'Raft',hp:100,speed:105});
 expect(unitFrame(motion(undefined,{x:0,y:0},'idle',0,'specialist','player',undefined,'clans'),0)).toBe('clans-specialist-player-s-idle-0');
 const worker={...m.gathering.units[0],position:{x:200,y:200},target:{x:400,y:200},order:{kind:'move' as const}};
 expect(updateGathering({...m.gathering,units:[worker]},1).units[0].position.x).toBe(355);
});
it('Raider pays its own cost once, requires attack research and combines Fury with War Blades',()=>{
 const m=createMatch();m.gathering={...m.gathering,faction:'clans',wood:100,goldBalance:50};
 const b={kind:'barracks' as const,footprint:{x:512,y:384,width:64,height:64},unitType:'specialist' as const,technology:{buildings:['forge' as const],research:{defense:1}}};
 expect(enqueueProduction(m.gathering,m.soldierProduction,b).gathering).toBe(m.gathering);
 const accepted=enqueueProduction(m.gathering,m.soldierProduction,{...b,technology:{...b.technology,research:{attack:1}}});
 expect(accepted.gathering).toMatchObject({wood:74,goldBalance:38});expect(updateQueuedProduction(accepted.gathering,accepted.production,6.99,b).gathering.units).toHaveLength(3);
 const done=updateQueuedProduction(accepted.gathering,accepted.production,7,b),raider=done.gathering.units.at(-1)! as Soldier;
 const fighter={...raider,position:{x:200,y:200},selected:true,order:{kind:'attack' as const,enemyId:'enemy-1'}};
 const g=useAbility({...done.gathering,units:[fighter]});const result=updateCombat(g,{baseHP:260,upgrades:{attack:1,defense:0},enemies:[{id:'enemy-1',kind:'base',hp:100,position:{x:228,y:200},footprint:{x:220,y:192,width:16,height:16}}]},1);
 expect(result.combat.enemies[0].hp).toBeCloseTo(61); // 24 DPS ×1.3 research ×1.25 Fury.
 expect(raider).toMatchObject({hp:80,selected:false,order:{kind:'idle'}});
});
it('new Stone Thrower jobs require Forge, take eleven seconds and Save accepts their real cooldown',()=>{
 const m=createMatch('survival','normal',factionsForPlayer('clans'));m.gathering.wood=100;m.gathering.goldBalance=50;
 const b={kind:'barracks' as const,footprint:{x:512,y:384,width:64,height:64},unitType:'catapult' as const};
 expect(enqueueProduction(m.gathering,m.soldierProduction,b).production).toBe(m.soldierProduction);
 const start=enqueueProduction(m.gathering,m.soldierProduction,{...b,technology:{buildings:['forge' as const],research:{}}});
 expect(start.production.remainingSeconds).toBe(11);expect(updateQueuedProduction(start.gathering,start.production,10,b).gathering.units).toHaveLength(3);
 const done=updateQueuedProduction(start.gathering,start.production,11,b);m.gathering=done.gathering;m.soldierProduction=done.production;m.production.nextUnitNumber=done.production.nextUnitNumber;
 const siege=m.gathering.units.at(-1)!;if(siege.kind==='soldier')siege.attackCooldown=2.1;
 expect(decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null})).ok).toBe(true);
});
it('Save25 keeps older paid siege time and injured HP; new orders use the new recipe',()=>{
 const m=createMatch('survival','normal',factionsForPlayer('clans')),footprint={x:512,y:384,width:64,height:64};
 m.gathering.wood=100;m.gathering.goldBalance=50;m.gathering.units.forEach(u=>u.hp=30);m.combat.baseHP=240;
 m.placement={...m.placement,barracks:footprint,barracksHP:120,barracksOwner:'player',construction:{remainingSeconds:0,builderId:null}};m.map=replaceObstacles(m.map,[...m.map.obstacles,footprint]);
 const b={kind:'barracks' as const,footprint,unitType:'catapult' as const,technology:{buildings:['forge' as const],research:{}}};
 const start=enqueueProduction(m.gathering,m.soldierProduction,b);m.gathering=start.gathering;m.soldierProduction=start.production;
 const d=JSON.parse(encodeSave(m,{camera:{x:0,y:0},building:'barracks'}));d.configVersion='tribute-config-25';d.state.soldierProduction.queue[0].durationSeconds=10;d.state.soldierProduction.queue[0].remainingSeconds=4;d.state.soldierProduction.remainingSeconds=4;
 const loaded=decodeSave(JSON.stringify(d));expect(loaded.ok).toBe(true);if(!loaded.ok)return;
 expect(loaded.match.combat.baseHP).toBe(240);expect(loaded.match.gathering.units[0].hp).toBe(30);expect(loaded.match.gathering.wood).toBe(60);
 expect(loaded.match.soldierProduction.queue![0]).toMatchObject({durationSeconds:10,remainingSeconds:4,legacyRecipe:true,cost:{wood:40,gold:20}});
 expect(decodeSave(encodeSave(loaded.match,{camera:{x:0,y:0},building:'barracks'})).ok).toBe(true);
 const done=updateQueuedProduction(loaded.match.gathering,loaded.match.soldierProduction,4,b);expect(done.gathering.units.at(-1)).toMatchObject({archetype:'catapult',hp:90});expect(done.gathering.wood).toBe(60);
 const invalid=structuredClone(d);invalid.state.soldierProduction.queue[0].cost.wood=1;expect(decodeSave(JSON.stringify(invalid)).ok).toBe(false);
});
