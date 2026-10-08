import {describe,it,expect} from 'vitest';
import {factionIds,factions,factionsForPlayer} from '../config/factions';
import {createMatch,updateMatch} from './match';
import {trainCavalry,cavalryBuilding,updateCavalryProduction} from './cavalry';
import {enqueueProduction,cancelProduction} from './productionQueue';
import {beginPlacement,placeBuilding,placementObstacles} from './placement';
import {technologyFor,buildingAvailability} from './productionPrerequisites';
import {matchPopulation} from './navy';
import {encodeSave,decodeSave} from './save';
import {cleanDestroyed} from './destruction';
import {updateCombat} from './combat';
import {combatUnitStats,rangedStats} from '../config/unit';
import {commandMappedMove} from './navigation';
import {prepareEnemyConstruction,updateEnemyConstruction} from './enemyConstruction';
import {advanceEnemyRecovery} from './enemyRecovery';
import {updateEnemyProduction} from './enemyProduction';
const view={camera:{x:0,y:0},building:null};
function ready(id= 'crown' as typeof factionIds[number]){const m=createMatch('skirmish','normal',factionsForPlayer(id));m.gathering.wood=200;m.gathering.goldBalance=200;m.combat.baseDevelopment={level:2,remainingSeconds:null};const footprint={x:512,y:384,width:64,height:64};m.placement.stable={id:'stable',owner:'player',hp:160,footprint,construction:{remainingSeconds:0,builderId:null},production:{remainingSeconds:null,nextUnitNumber:4}};m.map.obstacles.push(footprint);return m;}
describe('RTS-220 mounted cavalry',()=>{
 it.each(factionIds)('%s uses paid stable production with supply and exact deadline/save/restart',id=>{
  const m=ready(id),recipe=factions[id].units.cavalry;let next=trainCavalry(m);expect(next.gathering.wood).toBe(155);expect(next.gathering.goldBalance).toBe(175);expect(matchPopulation(next).reserved).toBe(2);
  expect(enqueueProduction(m.gathering,m.soldierProduction,{...cavalryBuilding(m),producer:'barracks'}).production).toBe(m.soldierProduction);
  const load=decodeSave(encodeSave(next,view));expect(load).toMatchObject({ok:true});if(!load.ok)return;next=updateCavalryProduction(load.match,11.9);expect(next.gathering.units).toHaveLength(3);next=updateCavalryProduction(next,.1);const u=next.gathering.units.at(-1)!;if(u.kind!=='soldier')throw Error('Expected cavalry');expect(u).toMatchObject({archetype:'cavalry',hp:recipe.hp,faction:id});expect(rangedStats(u)).toBeNull();expect(combatUnitStats(u).speed).toBe(230);expect(matchPopulation(next).used).toBe(5);expect(new Set(next.gathering.units.map(u=>u.id)).size).toBe(4);expect(decodeSave(encodeSave(next,view))).toMatchObject({ok:true});expect(createMatch('skirmish','normal',factionsForPlayer(id)).placement.stable).toBeUndefined();
 });
 it('requires completed base II/stable, cost and supply; queue refunds once',()=>{
  const m=ready();m.combat.baseDevelopment!.level=1;expect(trainCavalry(m).gathering).toBe(m.gathering);expect(buildingAvailability(factions.crown,'stable',technologyFor(m,'player'))).toMatch(/level 2/);m.combat.baseDevelopment!.level=2;m.placement.stable!.construction.remainingSeconds=1;expect(trainCavalry(m).gathering).toBe(m.gathering);m.placement.stable!.construction.remainingSeconds=0;m.gathering.goldBalance=24;expect(trainCavalry(m).gathering).toBe(m.gathering);m.gathering.goldBalance=200;const b=cavalryBuilding(m);expect(enqueueProduction(m.gathering,m.placement.stable!.production,b,{cap:4,used:3,reserved:0}).gathering).toBe(m.gathering);
  const next=trainCavalry(m),p=next.placement.stable!.production,j=p.queue![0];const r=cancelProduction(next.gathering,p,j.id);expect(r.gathering.wood).toBe(177.5);expect(cancelProduction(r.gathering,r.production,j.id).gathering).toBe(r.gathering);
 });
 it('places stable through ordinary builder geometry and removes its body/queue when destroyed',()=>{
  const m=ready();delete m.placement.stable;m.map.obstacles=m.map.obstacles.filter(o=>o.x!==512||o.y!==384);m.gathering.units[0].selected=true;const r=placeBuilding(beginPlacement(m.placement,'stable'),{x:512,y:384},200,placementObstacles(m.gathering),{map:m.map,gathering:m.gathering,enemies:m.combat.enemies,technology:technologyFor(m,'player')});expect(r.placement.stable?.construction.remainingSeconds).toBe(10);expect(r.wood).toBe(130);expect(r.gathering?.goldBalance).toBe(170);
  const started=trainCavalry(ready());started.placement.stable!.hp=0;const dead=cleanDestroyed(started);expect(dead.placement.stable).toBeUndefined();expect(dead.map.obstacles).not.toContainEqual({x:512,y:384,width:64,height:64});expect(matchPopulation(dead).reserved).toBe(0);
 });
 it('moves faster than infantry and infantry counters cavalry symmetrically',()=>{
  const m=ready(),made=updateCavalryProduction(trainCavalry(m),12),c=made.gathering.units.at(-1)!;if(c.kind!=='soldier')throw Error('Expected cavalry');const infantry={...c,archetype:undefined,hp:60};expect(combatUnitStats(c).speed).toBeGreaterThan(combatUnitStats(infantry).speed);
  const moved=commandMappedMove([{...c,position:{x:600,y:500},target:{x:600,y:500},selected:true}],{x:750,y:500},m.map);expect(moved[0].navigation?.status).not.toBe('blocked');
  const g={...m.gathering,units:[{...infantry,position:{x:600,y:500},target:{x:600,y:500},order:{kind:'attack' as const,enemyId:'enemy-1'}}]};const combat={baseHP:280,enemies:[{id:'enemy-1',kind:'unit' as const,role:'cavalry' as const,hp:110,position:{x:620,y:500}}]};const r=updateCombat(g,combat,1);expect(r.combat.enemies[0].hp).toBe(83); // 18 DPS × 1.5
  const counter=updateCombat({...g,units:[{...c,position:{x:600,y:500},order:{kind:'idle' as const}}]}, {...combat,enemies:[{...combat.enemies[0],role:'soldier',hp:66}]},1,undefined,undefined,undefined,()=>true,undefined,undefined,undefined,undefined,'clans');expect(counter.gathering.units[0].hp).toBe(80);
 });
 it('AI trains cavalry from its stable at the same price and duration',()=>{
  const m=ready();const stable={id:'enemy-stable',kind:'building' as const,buildingType:'stable' as const,hp:160,position:{x:1000,y:500},footprint:{x:968,y:468,width:64,height:64},construction:{remainingSeconds:0,builderId:null}};m.combat.enemies.push(stable);const technology={baseLevel:2,buildings:['base','stable'] as const,research:{}};const result=updateEnemyProduction({...m.enemyProduction!,wood:45,gold:25,acceptedJobs:5,roster:true},m.combat,m.gathering,m.map,12,'clans',{technology:{...technology,buildings:[...technology.buildings]},site:stable,population:{cap:8,used:0,reserved:0}});expect(result.state.wood).toBe(0);expect(result.state.gold).toBe(0);expect(result.combat.enemies.some(e=>e.role==='cavalry')).toBe(true);
 });
});

it('AI pays base II once, preserves its upgrade clock and pauses accepted worker training',()=>{
 const m=createMatch('skirmish');m.campaignMission='the-siege';const b=m.combat.enemies.find(e=>e.kind==='base')!;m.combat.enemies.push({...b,id:'enemy-forge',kind:'building',buildingType:'forge',hp:120,footprint:{x:1024,y:512,width:64,height:64},position:{x:1056,y:544},construction:{remainingSeconds:0,builderId:null}});m.enemyProduction!.wood=80;m.enemyProduction!.gold=60;const started=prepareEnemyConstruction(m);expect(started.enemyProduction).toMatchObject({wood:0,gold:0,baseDevelopment:{level:1,remainingSeconds:20}});expect(prepareEnemyConstruction(started).enemyProduction!.baseDevelopment).toEqual(started.enemyProduction!.baseDevelopment);
 started.enemyRecovery!.production={remainingSeconds:5,nextUnitNumber:3};const paused=advanceEnemyRecovery(started,1);expect(paused.enemyRecovery!.production.remainingSeconds).toBe(5);const finished=updateEnemyConstruction(started,20).match;expect(finished.enemyProduction!.baseDevelopment).toEqual({level:2,remainingSeconds:null});
});
it('old army weight snapshots default cavalry and malformed new weights reject',()=>{
 const m=updateMatch(createMatch('skirmish'),.1),doc=JSON.parse(encodeSave(m,view));delete doc.state.armyPlan.weights.cavalry;const loaded=decodeSave(JSON.stringify(doc));expect(loaded).toMatchObject({ok:true});if(loaded.ok)expect(loaded.match.armyPlan!.weights.cavalry).toBe(1);doc.state.armyPlan.weights.cavalry=0;expect(decodeSave(JSON.stringify(doc))).toMatchObject({ok:false});
});
