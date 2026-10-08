import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {describe,it,expect} from 'vitest';
import {armyRoles,combinedArmyConfig} from '../config/combinedArmy';
import {prepareArmyPlan,compositionRole} from './combinedArmy';
import {createMatch,updateMatch} from './match';
import {createEnemyProduction,updateEnemyProduction} from './enemyProduction';
import {encodeSave,decodeSave} from './save';
import {matchFog} from './matchFog';
import {factions,type FactionId,type TechnologyState} from '../config/factions';
import {updateCombat,type Enemy} from './combat';
import {createEnemyAI,updateEnemyAI} from './enemyAI';
import {enemyAIConfig} from '../config/enemyAI';
const tech:TechnologyState={baseLevel:2,buildings:['base','barracks','forge','farm','stable'],research:{attack:1,defense:1}};
const view={camera:{x:0,y:0},building:null};
describe('adaptive paid combined armies',()=>{
 it('observes visible threats only and limits plan decisions to one per second',()=>{
  let m=createMatch('skirmish');const base=m.combat.enemies.find(e=>e.kind==='base')!;const air={id:'unit-4',kind:'soldier' as const,archetype:'air' as const,owner:'player' as const,hp:100,cargo:0 as const,selected:false,position:{x:300,y:300},target:{x:300,y:300},order:{kind:'idle' as const}};m.gathering.units.push(air);m.fog=matchFog(m);m=prepareArmyPlan(m);expect(m.armyPlan!.weights.archer).toBe(2);
  air.position={x:base.position.x-60,y:base.position.y};air.target={...air.position};m={...m,gathering:{...m.gathering,units:m.gathering.units.map(u=>u.id===air.id?air:u)},waves:{...m.waves,elapsedSeconds:.9}};m.fog=matchFog(m);expect(prepareArmyPlan(m)).toBe(m);
  m={...m,waves:{...m.waves,elapsedSeconds:1}};m=prepareArmyPlan(m);expect(m.armyPlan!.weights.archer).toBe(4);
  m={...m,waves:{...m.waves,elapsedSeconds:2},gathering:{...m.gathering,units:m.gathering.units.filter(u=>u.id!==air.id)}};m.fog=matchFog(m);expect(prepareArmyPlan(m).armyPlan!.weights.archer).toBe(2);
 });
 it('prioritizes visible defenses for siege composition and respects locked recipes/naval seats',()=>{
  let m=createMatch('skirmish');delete m.fog;m.placement.defenses=[{id:'tower-1',kind:'tower',owner:'player',hp:160,level:1,cooldown:0,upgradeRemaining:null,footprint:{x:600,y:300,width:32,height:32},construction:{remainingSeconds:0,builderId:null}}];m=prepareArmyPlan(m);expect(m.armyPlan!.weights.catapult).toBe(3);
  const plan=m.armyPlan!,production={remainingSeconds:null,nextUnitNumber:1};expect(compositionRole(plan,m.combat,production,'crown',{buildings:['base','barracks'],research:{}})).toBe('soldier');
  const queue=armyRoles.map((kind,i)=>({id:`test-${i}`,kind,cost:{wood:0,gold:0},durationSeconds:1,remainingSeconds:1,supply:1}));const role=compositionRole(plan,m.combat,{...production,queue},'crown',tech,2,2);expect(role).toBe('air');
 });
 it.each(Object.keys(factions) as FactionId[])('produces front/ranged/siege/magic/air for %s with exact paid reservations',faction=>{
  const m=createMatch('skirmish','normal',{player:'crown',enemy:faction});const f=factions[faction],state={...createEnemyProduction(undefined,true),wood:1000,gold:1000,cap:100,spent:{wood:0,gold:0}},base=m.combat.enemies.find(e=>e.kind==='base')!,site={...base,construction:{remainingSeconds:0,builderId:null}},plan={weights:{...combinedArmyConfig.weights},nextDecisionSeconds:1};
  const result=updateEnemyProduction(state,{...m.combat,enemies:[base,{...base,id:'enemy-stable',kind:'building',buildingType:'stable',construction:{remainingSeconds:0,builderId:null}}]},m.gathering,m.map,100,faction,{armyPlan:plan,technology:tech,site,population:{cap:100,used:0,reserved:0}});const roles=new Set(result.combat.enemies.map(e=>e.role));for(const role of armyRoles)expect(roles.has(role)).toBe(true);
  expect(result.state.wood+result.state.spent!.wood).toBe(1000);expect(result.state.gold+result.state.spent!.gold).toBe(1000);expect(result.state.acceptedJobs).toBeGreaterThan(5);expect(result.combat.enemies.filter(e=>e.role).every(e=>e.hp===f.units[e.role!].hp)).toBe(true);
 });
 it('siege supports attacks by shooting a visible tower before a closer worker, never a hidden tower',()=>{
  const m=createMatch();const worker={...m.gathering.units[0],position:{x:580,y:300}};m.gathering.units=[worker];m.placement.defenses=[{id:'tower-1',kind:'tower',owner:'player',hp:160,level:1,cooldown:0,upgradeRemaining:null,footprint:{x:400,y:284,width:32,height:32},construction:{remainingSeconds:0,builderId:null}}];const enemy:Enemy={id:'enemy-produced-1',kind:'unit',owner:'enemy',role:'catapult',hp:90,position:{x:600,y:300},order:{kind:'attack-move',destination:m.gathering.base}};
  const visible=updateCombat(m.gathering,{...m.combat,enemies:[enemy]},.1,undefined,m.placement,undefined,()=>true,undefined,undefined,undefined,undefined,'crown');expect(visible.combat.projectiles?.some(p=>p.owner==='enemy'&&p.targetId==='tower-1')).toBe(true);
  const hidden=updateCombat(m.gathering,{...m.combat,enemies:[enemy]},.1,undefined,m.placement,undefined,t=>t.kind!=='tower',undefined,undefined,undefined,undefined,'crown');expect(hidden.combat.projectiles?.some(p=>p.targetId==='tower-1')).toBe(false);
 });
 it.each(['loss','blocked'] as const)('regroups %s on a bounded tactical decision, allowing reinforcements and retry',reason=>{
  const m=createMatch('skirmish'),members:Enemy[]=Array.from({length:reason==='loss'?1:4},(_,i)=>({id:`enemy-produced-${i+1}`,hp:36,position:{x:900+i*32,y:400},order:{kind:'attack-move',destination:m.gathering.base},...(reason==='blocked'?{navigation:{commandNumber:1,destination:m.gathering.base,waypoints:[],revision:m.map.revision,status:'blocked' as const,error:'unreachable' as const}}:{})})),group={id:'enemy-group-1',status:'attack' as const,members:members.map(e=>e.id),destinations:Object.fromEntries(members.map(e=>[e.id,e.position])),startedAt:0,dispatchedAt:0},state={...createEnemyAI(),elapsedSeconds:11.9,groups:[group]},settings={...enemyAIConfig,groupSize:6,reserveCount:0,regroup:true};
  const r=updateEnemyAI(state,{...m.combat,enemies:[...m.combat.enemies.filter(e=>e.kind==='base'),...members]},m.map,m.gathering.base,.1,[],settings);expect(r.state.groups[0].status).toBe('muster');expect(r.combat.enemies.filter(e=>e.id.startsWith('enemy-produced')).every(e=>e.order?.kind==='muster')).toBe(true);
  const again=updateEnemyAI(r.state,r.combat,m.map,m.gathering.base,.1,[],settings);expect(again.state.groups[0].startedAt).toBe(r.state.groups[0].startedAt);
 });
 it('saves planning/decision clock and migrates older matches without free units or jobs',()=>{
  let m=prepareArmyPlan(createMatch('skirmish'));const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok).toBe(true);if(loaded.ok)expect(loaded.match.armyPlan).toEqual(m.armyPlan);
  const raw=JSON.parse(encodeSave(createMatch('skirmish'),view));legacyTerrainFixture(raw);raw.configVersion='tribute-config-44';const old=decodeSave(JSON.stringify(raw));expect(old.ok).toBe(true);if(old.ok)expect(old.match.gathering.units).toHaveLength(3);
  m={...m,paused:true};expect(updateMatch(m,10)).toBe(m);expect(prepareArmyPlan(m)).toBe(m);
 });
});
it('a healthy force dispatched below nominal group size crosses a large map without repeated recall',()=>{
 const m=createMatch('skirmish','normal',undefined,'highlands'),member:Enemy={id:'enemy-produced-1',role:'soldier',hp:66,position:{x:2000,y:544},order:{kind:'attack-move',destination:{x:1504,y:544}}};
 const group={id:'enemy-group-1',status:'attack' as const,members:[member.id],destinations:{[member.id]:member.position},startedAt:0,dispatchedAt:0,dispatchedSize:1};
 const r=updateEnemyAI({...createEnemyAI(),elapsedSeconds:11.9,groups:[group]},{...m.combat,enemies:[...m.combat.enemies.filter(e=>e.kind==='base'),member]},m.map,m.gathering.base,.1,[],{...enemyAIConfig,muster:{x:2592,y:512},groupSize:6,reserveCount:0,regroup:true});expect(r.state.groups[0].status).toBe('attack');expect(r.combat.enemies.find(e=>e.id===member.id)!.order?.kind).toBe('attack-move');
});
it('the short introductory route retains its existing regroup threshold',()=>{
 const m=createMatch('skirmish'),member:Enemy={id:'enemy-produced-1',role:'soldier',hp:66,position:{x:900,y:400},order:{kind:'attack-move',destination:m.gathering.base}},group={id:'enemy-group-1',status:'attack' as const,members:[member.id],destinations:{[member.id]:member.position},startedAt:0,dispatchedAt:0,dispatchedSize:1};
 const r=updateEnemyAI({...createEnemyAI(),elapsedSeconds:11.9,groups:[group]},{...m.combat,enemies:[...m.combat.enemies.filter(e=>e.kind==='base'),member]},m.map,m.gathering.base,.1,[],{...enemyAIConfig,groupSize:6,reserveCount:0,regroup:true});expect(r.state.groups[0].status).toBe('muster');
});
