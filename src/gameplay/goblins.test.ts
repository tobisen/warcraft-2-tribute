import {createClassicMatch as createMatch} from './testHelpers/classicMatch';
import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {saveConfig as currentSaveConfig} from '../config/save';
import {expect,it} from 'vitest';
import {factions,factionsForPlayer} from '../config/factions';

import {enqueueProduction,updateQueuedProduction} from './productionQueue';
import {updateGathering,type Soldier} from './gathering';
import {startResearch,updateResearch} from './research';
import {useAbility,advanceAbilities} from './abilities';
import {updateCombat} from './combat';
import {placeHarbor,trainShip,updateNavy} from './navy';
import {encodeSave,decodeSave} from './save';
import {matchLabels} from '../presentation/hud';

it('Goblins actually produce fast cheap workers and move with their fragile mobile profile',()=>{
 const f=factions.goblins,m=createMatch('tutorial','beginner',factionsForPlayer('goblins'));
 expect(matchLabels(m).health).toBe('Workshop Hall: 200 / 200 HP');expect(m.gathering.units[0].hp).toBe(24);
 const worker={...m.gathering.units[0],position:{x:200,y:200},target:{x:400,y:200},order:{kind:'move' as const}};
 expect(updateGathering({...m.gathering,units:[worker]},1).units[0].position.x).toBe(380);
 m.gathering.wood=100;const b={kind:'base' as const},start=enqueueProduction(m.gathering,m.production,b);expect(start.gathering.wood).toBe(82);
 expect(updateQueuedProduction(start.gathering,start.production,3.99,b).gathering.units).toHaveLength(3);expect(updateQueuedProduction(start.gathering,start.production,4,b).gathering.units.at(-1)).toMatchObject({hp:24,selected:false});
 expect(f.units.soldier).toMatchObject({cost:{wood:16,gold:4},durationSeconds:4,hp:40,speed:180,damagePerSecond:16});
 expect(f.units.archer).toMatchObject({hp:30,speed:175,damage:10,attackInterval:.8});expect(f.units.catapult).toMatchObject({hp:55,durationSeconds:8,damage:26,splashRadius:64});
 expect(f.buildings.barracks).toMatchObject({hp:90,cost:{wood:35,gold:0}});expect(f.buildings.forge).toMatchObject({hp:90,cost:{wood:35,gold:15}});
});
it('Hot Powder costs once and unlocks an exactly seven-second Grenadier after research completes',()=>{
 const m=createMatch('tutorial','beginner',factionsForPlayer('goblins'));m.gathering.wood=150;m.gathering.goldBalance=100;
 m.placement.forge={id:'forge',owner:'player',hp:90,footprint:{x:608,y:384,width:64,height:64},construction:{remainingSeconds:0,builderId:null}};
 const research=startResearch(m.gathering,m.research!,m.placement,'attack');expect(research.gathering).toMatchObject({wood:120,goldBalance:80});expect(research.research.job?.remainingSeconds).toBe(6);
 expect(startResearch(research.gathering,research.research,m.placement,'attack').gathering).toBe(research.gathering);expect(updateResearch(research.research,m.placement,5.99,true,'goblins').attack).toBe(0);
 const completed=updateResearch(research.research,m.placement,6,true,'goblins');const b={kind:'barracks' as const,footprint:{x:512,y:384,width:64,height:64},unitType:'specialist' as const};
 expect(enqueueProduction(research.gathering,m.soldierProduction,{...b,technology:{buildings:['forge' as const],research:{}}}).gathering).toBe(research.gathering);
 const start=enqueueProduction(research.gathering,m.soldierProduction,{...b,technology:{buildings:['forge' as const],research:{attack:completed.attack}}});expect(start.gathering).toMatchObject({wood:95,goldBalance:55});
 expect(updateQueuedProduction(start.gathering,start.production,6.99,b).gathering.units).toHaveLength(3);const done=updateQueuedProduction(start.gathering,start.production,7,b);
 expect(done.gathering.units.at(-1)).toMatchObject({hp:35,archetype:'specialist',selected:false,order:{kind:'idle'}});expect(updateQueuedProduction(done.gathering,done.production,10,b).gathering.units).toHaveLength(4);
});
it('Grenadier splash damages both visible enemy bodies without friendly fire; Overcharge snapshots research',()=>{
 const m=createMatch('survival','normal',factionsForPlayer('goblins'));
 const u:Soldier={id:'unit-4',kind:'soldier',archetype:'specialist',owner:'player',position:{x:200,y:200},target:{x:200,y:200},hp:35,cargo:0,selected:true,order:{kind:'attack',enemyId:'dummy'}};
 const worker={...m.gathering.units[0],position:{x:318,y:200},selected:true};const g=useAbility({...m.gathering,units:[worker,u]});expect(g.units[0]).toBe(worker);
 const enemies=[{id:'dummy',kind:'base' as const,hp:100,position:{x:300,y:200},footprint:{x:296,y:196,width:8,height:8}},{id:'nearby',kind:'base' as const,hp:100,position:{x:320,y:200},footprint:{x:316,y:196,width:8,height:8}}];
 const first=updateCombat(g,{baseHP:200,enemies,upgrades:{attack:1,defense:0}},.01);expect(first.combat.projectiles![0]).toMatchObject({damage:35.1,speed:180,splashRadius:32,hitRadius:16});
 const impact=updateCombat(first.gathering,first.combat,.8);expect(impact.combat.enemies.map(e=>e.hp)).toEqual([64.9,64.9]);expect(impact.gathering.units[0].hp).toBe(24);
 expect(advanceAbilities(g,4).units[1]).toMatchObject({ability:{activeSeconds:0,cooldownSeconds:16},order:u.order});
 const melee=updateCombat(g,{baseHP:200,enemies:[{id:'dummy',position:{x:224,y:200},hp:100}],upgrades:{attack:0,defense:1}},1);expect(melee.gathering.units[1].hp).toBeCloseTo(35-6*.85*1.2);
});
it('Goblins pay Junk Dock/Powder Boat/Junk Ferry recipes, with six/eight-second spawn and real HP',()=>{
 let m=createMatch('mission-outpost','easy',factionsForPlayer('goblins'));m.gathering.wood=200;m.gathering.goldBalance=100;m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.id==='unit-1'}));m.placement={...m.placement,active:true,kind:'harbor'};
 m=placeHarbor(m,{x:192,y:416});expect(m.gathering).toMatchObject({wood:165,goldBalance:90});expect(m.navy!.harbor!.hp).toBe(130);m=updateNavy(m,100);
 m=trainShip(m,'warship');expect(m.gathering).toMatchObject({wood:130,goldBalance:70});expect(updateNavy(m,5.99).navy!.ships).toHaveLength(0);m=updateNavy(m,6);expect(m.navy!.ships[0]).toMatchObject({hp:65,selected:false});
 m=trainShip(m,'transport');expect(m.gathering).toMatchObject({wood:95,goldBalance:60});m=updateNavy(m,8);expect(m.navy!.ships[1]).toMatchObject({role:'transport',hp:65});expect(factions.goblins.naval.units.transport.speed).toBe(135);
 expect(decodeSave(encodeSave(m,{camera:{x:0,y:0},building:'harbor'})).ok).toBe(true);
});
it('Save29 preserves explosive projectiles/Overcharge/type IDs and rejects historical Goblin identity',()=>{
 const m=createMatch('survival','normal',factionsForPlayer('goblins'));m.gathering.wood=150;m.gathering.goldBalance=100;
 const b={kind:'barracks' as const,footprint:{x:512,y:384,width:64,height:64},unitType:'specialist' as const,technology:{buildings:['forge' as const],research:{attack:1}}};const start=enqueueProduction(m.gathering,m.soldierProduction,b),done=updateQueuedProduction(start.gathering,start.production,7,b);
 m.gathering=useAbility({...done.gathering,units:done.gathering.units.map(u=>({...u,selected:u.kind==='soldier'}))});m.soldierProduction=done.production;m.production.nextUnitNumber=done.production.nextUnitNumber;
 m.combat.projectiles=[{id:'arrow-1',shooterId:'unit-4',targetId:'historical-enemy',position:{x:200,y:200},destination:{x:300,y:200},speed:180,remainingLife:2,damage:35.1,hitRadius:16,splashRadius:32}];m.combat.nextProjectileNumber=2;
 const d=JSON.parse(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(d.configVersion).toBe(currentSaveConfig.configVersion);expect(d.state.gathering.units.at(-1).typeId).toBe('goblins:unit:specialist');expect(decodeSave(JSON.stringify(d)).ok).toBe(true);
 legacyTerrainFixture(d);d.configVersion='tribute-config-28';expect(decodeSave(JSON.stringify(d)).ok).toBe(false);
 const old=JSON.parse(encodeSave(createMatch('survival','normal',factionsForPlayer('dwarves')),{camera:{x:0,y:0},building:null}));legacyTerrainFixture(old);old.configVersion='tribute-config-28';expect(decodeSave(JSON.stringify(old)).ok).toBe(true);
});
