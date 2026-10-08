import {enemyPriority} from './enemyPolicy';
import {technologyFor,unitAvailability} from './productionPrerequisites';
import {compositionRole} from './combinedArmy';
import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {describe,it,expect} from 'vitest';
import {factions,factionIds} from '../config/factions';
import {createMatch,updateMatch} from './match';
import {createEnemyProduction,updateEnemyProduction} from './enemyProduction';
import {enemyMaximumHP,enemySupply,enemyUnitStats} from './enemyUnits';
import {updateCombat,type Enemy} from './combat';
import {encodeSave,decodeSave} from './save';
import {prepareEnemyAbilities,advanceEnemyAbilities} from './enemyAbilities';
const view={camera:{x:0,y:0},building:null};
const roles=['soldier','archer','catapult','specialist','air'] as const;
describe('faction-aware opponent army',()=>{
 it.each(factionIds)('%s pays each full roster recipe once with exact timers, supply and distinct stats',id=>{
  const m=createMatch('skirmish','normal',{player:'crown',enemy:id}),f=factions[id];
  let c={...m.combat,enemies:[...m.combat.enemies,...(['siegeWorks','aviary','stable','academy'] as const).map(buildingType=>({...m.combat.enemies[0],id:`enemy-${buildingType}`,kind:'building' as const,buildingType,construction:{remainingSeconds:0,builderId:null}}))]},state=createEnemyProduction({budget:{wood:1000,gold:1000},cap:roles.reduce((n,r)=>n+f.units[r].supply,0),durationSeconds:5},true);
  const context={population:{cap:100,used:0,reserved:0},site:{...c.enemies[0],construction:{remainingSeconds:0,builderId:null}},technology:{baseLevel:3,buildings:['base','barracks','forge','farm','siegeWorks','aviary','stable','academy'] as const,research:{attack:2,defense:2}}};
  const originalRoster=f.roster;f.roster=['worker',...roles];try{
  const snapshots=new Map<string,NonNullable<typeof state.production.queue>[number]>();
  for(let i=0;i<200;i++){
   const before=state.wood+state.gold,r=updateEnemyProduction(state,c,m.gathering,m.map,.5,id,context);state=r.state;c=r.combat;
   for(const job of state.production.queue??[])snapshots.set(job.id,job);
   expect(state.wood+state.gold).toBeLessThanOrEqual(before);
  }
  const army=c.enemies.filter(e=>e.role);expect(army.map(e=>e.role)).toEqual(roles);
  expect(state.acceptedJobs).toBe(roles.length);expect(new Set(army.map(e=>e.id)).size).toBe(roles.length);
  expect(state.wood).toBe(1000-roles.reduce((n,r)=>n+f.units[r].cost.wood,0));expect(state.gold).toBe(1000-roles.reduce((n,r)=>n+f.units[r].cost.gold,0));
  for(const e of army){expect(e.hp).toBe(f.units[e.role!].hp);expect(enemySupply(e,id)).toBe(f.units[e.role!].supply);expect(enemyUnitStats(e,id).speed).toBe(f.units[e.role!].speed);}
  for(const job of snapshots.values()){const recipe=f.units[job.kind as typeof roles[number]];expect(job.cost).toEqual(recipe.cost);expect(job.durationSeconds).toBe(recipe.durationSeconds);expect(job.supply).toBe(recipe.supply);}
  }finally{f.roster=originalRoster;}
 });
 it.each(factionIds)('%s respects unavailable prerequisites, actual bank and supply',id=>{
  const m=createMatch('skirmish','normal',{player:'crown',enemy:id}),f=factions[id];
  const state=createEnemyProduction({budget:{wood:1000,gold:1000},cap:1,durationSeconds:5},true);
  const context={population:{cap:8,used:0,reserved:0},site:{...m.combat.enemies[0],construction:{remainingSeconds:0,builderId:null}},technology:{buildings:['base','barracks'] as const,research:{}}};
  const admitted=updateEnemyProduction(state,m.combat,m.gathering,m.map,0,id,context);expect(admitted.state.production.queue).toHaveLength(1);expect(admitted.state.production.queue![0].kind).toBe('soldier');expect(admitted.state.wood).toBe(1000-f.units.soldier.cost.wood);
  expect(updateEnemyProduction(admitted.state,admitted.combat,m.gathering,m.map,0,id,context).state.acceptedJobs).toBe(1);
  const poor=updateEnemyProduction({...state,wood:0,gold:0},m.combat,m.gathering,m.map,100,id,context);expect(poor.state.acceptedJobs).toBe(0);
 });
 it.each(factionIds)('%s applies melee damage and speed while its old generic army remains unchanged',id=>{
  const m=createMatch('skirmish','normal',{player:'crown',enemy:id}),f=factions[id];
  m.gathering.units=[];m.combat.enemies=[{id:'enemy-produced-1',owner:'enemy',kind:'unit',role:'soldier',hp:f.units.soldier.hp,position:{x:m.gathering.base.x+20,y:m.gathering.base.y}}];
  const result=updateCombat(m.gathering,m.combat,.5,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,id);
  expect(result.combat.baseHP).toBeCloseTo(m.combat.baseHP-f.units.soldier.damagePerSecond!*.5);
  const legacy={...m.combat,enemies:m.combat.enemies.map(({role,...e})=>({...e,hp:36}))};expect(updateCombat(m.gathering,legacy,.5,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,id).combat.baseHP).toBe(m.combat.baseHP-3);
 });
 it.each(factionIds)('%s ranged attacks snapshot own damage and splash only player targets',id=>{
  const m=createMatch('skirmish','normal',{player:'crown',enemy:id}),f=factions[id];
  const target=m.gathering.units[0];target.position={x:300,y:200};m.gathering.units=[target];
  const role='catapult',data=f.units[role],enemy:Enemy={id:'enemy-produced-1',kind:'unit',owner:'enemy',role,hp:data.hp,position:{x:220,y:200},order:{kind:'defend',targetId:target.id}};
  m.combat.enemies=[enemy];const r=updateCombat(m.gathering,m.combat,.1,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,id);
  expect(r.combat.projectiles?.[0]).toMatchObject({owner:'enemy',damage:data.damage,splashRadius:data.splashRadius,shooterId:enemy.id});
  const landed=updateCombat(r.gathering,r.combat,1,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,id);
  expect(landed.gathering.units.find(u=>u.id===target.id)?.hp??0).toBe(Math.max(0,target.hp!-data.damage!));expect(landed.combat.enemies[0].hp).toBe(data.hp);
 });
 it.each(factionIds)('%s autonomous paid economy unlocks and replaces every roster role after combat losses',id=>{
  let m=createMatch('skirmish','normal',{player:'crown',enemy:id});
  // Up to 1400 full-match ticks per faction need more than 5s on shared CI CPUs.
  // Explicit resilience fixture for the observed AI, not a paid player victory.
  m.combat.baseHP=1e8;delete m.capture;delete m.enemyRecovery;
  // Larger finite deposits isolate roster replacement from resource exhaustion.
  for(const node of [m.gathering.node,m.gathering.gold,...(m.gathering.extraNodes??[])])if(node)node.remaining*=10;
  const observed=new Set<string>();
  for(let i=0;i<1400&&!roles.every(r=>observed.has(r));i++){
   m=updateMatch(m,1);
   for(const e of m.combat.enemies)if(e.role&&roles.includes(e.role as typeof roles[number]))observed.add(e.role);
   if(m.enemyPolicy?.research.attack===2&&m.enemyPolicy.research.defense===2&&m.enemyProduction?.baseDevelopment?.level===3&&i%15===0){
    const casualty=m.combat.enemies.find(e=>e.role);if(casualty)casualty.hp=0;
   }
  }
  expect([...observed].sort(),JSON.stringify({id,time:m.waves.elapsedSeconds,bank:m.enemyProduction,priority:enemyPriority(m),tech:technologyFor(m,'enemy'),catReason:unitAvailability(factions[id],'catapult',technologyFor(m,'enemy')),army:m.combat.enemies.filter(e=>e.role),chosen:m.armyPlan?compositionRole(m.armyPlan,m.combat,m.enemyProduction!.production,id,technologyFor(m,'enemy')):null,research:m.enemyPolicy,buildings:m.combat.enemies.filter(e=>e.footprint)})).toEqual([...roles].sort());
  expect(m.enemyPolicy?.research).toMatchObject({attack:2,defense:2});expect(m.enemyProduction?.spent?.wood).toBeGreaterThan(factions[id].buildings.barracks.cost.wood+factions[id].buildings.forge.cost.wood);expect(m.enemyProduction?.wood).toBeGreaterThanOrEqual(0);
 },30_000);
 it('NPC self-buffs only in visible combat and respects cooldown and game-time expiry',()=>{
  let m=createMatch('skirmish','normal',{player:'crown',enemy:'goblins'});m.fog=undefined;
  const enemy:Enemy={id:'enemy-produced-1',kind:'unit',owner:'enemy',role:'soldier',hp:40,position:{...m.gathering.units[0].position},order:{kind:'defend',targetId:'unit-1'}};
  m.combat.enemies=[enemy];m=prepareEnemyAbilities(m);expect(m.combat.enemies[0].ability).toEqual({activeSeconds:4,cooldownSeconds:20});
  const elapsed=advanceEnemyAbilities(m,4);expect(elapsed.combat.enemies[0].ability).toEqual({activeSeconds:0,cooldownSeconds:16});expect(prepareEnemyAbilities(elapsed).combat.enemies[0].ability).toEqual(elapsed.combat.enemies[0].ability);
  expect(prepareEnemyAbilities({...m,combat:{...m.combat,enemies:[{...enemy,order:{kind:'idle'}}]}}).combat.enemies[0].ability).toBeUndefined();
  const hidden=createMatch('skirmish','normal',{player:'crown',enemy:'goblins'});hidden.combat.enemies=[{...enemy,position:{x:700,y:700}}];expect(prepareEnemyAbilities(hidden).combat.enemies[0].ability).toBeUndefined();
 });
 it('Save30 keeps injured NPC profiles, active buffs and hostile projectiles; rejects forged faction types',()=>{
  const m=createMatch('skirmish','normal',{player:'elves',enemy:'dwarves'});
  const e:Enemy={id:'enemy-produced-1',owner:'enemy',kind:'unit',role:'archer',position:{x:880,y:320},hp:12,order:{kind:'idle'},attackCooldown:.4,ability:{activeSeconds:2,cooldownSeconds:22}};
  m.combat.enemies.push(e);m.enemyProduction!.production.nextUnitNumber=2;m.combat.projectiles=[{owner:'enemy',id:'enemy-arrow-1',shooterId:e.id,targetId:'unit-1',position:{x:900,y:240},destination:{x:280,y:340},speed:200,damage:20,hitRadius:0,remainingLife:2}];m.combat.nextProjectileNumber=2;
  const json=encodeSave(m,view),loaded=decodeSave(json);expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(!loaded.ok)return;
  expect(loaded.match.combat.enemies.find(v=>v.id===e.id)).toEqual(e);expect(loaded.match.combat.projectiles).toEqual(m.combat.projectiles);
  const timer=JSON.parse(json);timer.state.combat.enemies.find((v:{id:string})=>v.id===e.id).ability.cooldownSeconds=3;expect(decodeSave(JSON.stringify(timer)).ok).toBe(false);
  const bad=JSON.parse(json);bad.state.combat.enemies.find((v:{id:string})=>v.id===e.id).typeId='elves:unit:archer';expect(decodeSave(JSON.stringify(bad)).ok).toBe(false);
 });
 it('Save29 migration retains generic HP, bank and paid timers instead of healing or upgrading the army',()=>{
  const m=createMatch('siege-test','normal',{player:'crown',enemy:'crown'});const r=updateEnemyProduction(m.enemyProduction!,m.combat,m.gathering,m.map,1);m.combat=r.combat;m.enemyProduction=r.state;
  const old=JSON.parse(encodeSave(m,view));legacyTerrainFixture(old);old.configVersion='tribute-config-29';delete old.state.combat.enemies[0].legacyProfile;old.state.combat.enemies[0].hp=111;
  const loaded=decodeSave(JSON.stringify(old));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(!loaded.ok)return;
  expect(loaded.match.combat.enemies[0]).toMatchObject({hp:111,legacyProfile:true});expect(enemyMaximumHP(loaded.match.combat.enemies[0],'crown')).toBe(240);expect(loaded.match.enemyProduction).toEqual(m.enemyProduction);expect(loaded.match.enemyProduction?.roster).toBeUndefined();
  expect(updateMatch(loaded.match,4).combat.enemies.find(e=>e.id==='enemy-produced-1')).toMatchObject({hp:36});
 });
});
