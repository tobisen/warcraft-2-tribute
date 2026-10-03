import {expect,it} from 'vitest';
import {factions,factionsForPlayer} from '../config/factions';
import {createMatch} from './match';
import {enqueueProduction,updateQueuedProduction} from './productionQueue';
import {updateCombat} from './combat';
import {populationState} from './population';
import {encodeSave,decodeSave} from './save';
import type {Soldier} from './gathering';
import {combatUnitStats} from '../config/unit';

for(const id of ['crown','clans'] as const)it(`${id} prototype specialist uses its own recipe, movement, melee and stable Save identity`,()=>{
 const original=factions[id];factions[id]={...original,roster:[...original.roster,'specialist']};
 try{
  const m=createMatch('survival','normal',factionsForPlayer(id));const recipe=factions[id].units.specialist;
  const building={kind:'barracks' as const,unitType:'specialist' as const,footprint:{x:512,y:384,width:64,height:64},technology:{buildings:['forge' as const],research:{attack:1,defense:1}}};
  const g={...m.gathering,wood:100,goldBalance:100};const started=enqueueProduction(g,m.soldierProduction,building);
  expect(started.gathering.wood).toBe(100-recipe.cost.wood);expect(started.gathering.goldBalance).toBe(100-recipe.cost.gold);
  const done=updateQueuedProduction(started.gathering,started.production,recipe.durationSeconds,building);
  const u=done.gathering.units.at(-1)! as Soldier;
  expect(u).toMatchObject({kind:'soldier',archetype:'specialist',faction:id,hp:recipe.hp,selected:false,cargo:0,order:{kind:'idle'}});
  expect(combatUnitStats(u).speed).toBe(recipe.speed);expect(populationState(done.gathering,m.placement,[]).used).toBe(5);
  const fighter={...u,position:{x:200,y:200},target:{x:200,y:200},order:{kind:'attack' as const,enemyId:'enemy-1'}};
  const combat=updateCombat({...done.gathering,units:[fighter]},{baseHP:240,enemies:[{id:'enemy-1',kind:'unit',hp:100,position:{x:228,y:200}}]},1);
  expect(combat.combat.enemies[0].hp).toBeCloseTo(100-recipe.damagePerSecond!);
  m.gathering=done.gathering;m.soldierProduction=done.production;m.production.nextUnitNumber=done.production.nextUnitNumber;
  const json=encodeSave(m,{camera:{x:0,y:0},building:null});const wire=JSON.parse(json);expect(wire.state.gathering.units.at(-1).typeId).toBe(`${id}:unit:specialist`);
  const loaded=decodeSave(json);expect(loaded.ok).toBe(true);if(loaded.ok)expect(loaded.match.gathering.units.at(-1)).toEqual(u);
 }finally{factions[id]=original;}
});
it('projectile specialist can use the existing splash scheduler without changing other archetypes',()=>{
 const original=factions.crown;
 factions.crown={...original,units:{...original.units,specialist:{...original.units.specialist,combatMode:'projectile',range:128,aggroRange:168,damage:20,attackInterval:1.5,projectileSpeed:180,projectileLifetime:3,splashRadius:32}}};
 try{
  const m=createMatch();const unit:Soldier={id:'unit-4',faction:'crown',kind:'soldier',archetype:'specialist',hp:100,cargo:0,selected:true,position:{x:200,y:200},target:{x:200,y:200},order:{kind:'attack',enemyId:'enemy-1'}};
  const result=updateCombat({...m.gathering,units:[unit]},{baseHP:240,enemies:[{id:'enemy-1',hp:100,position:{x:250,y:200}},{id:'enemy-2',hp:100,position:{x:264,y:200}}]},1);
  expect(result.combat.enemies.map(e=>e.hp)).toEqual([80,80]);expect(result.gathering.units[0]).toMatchObject({archetype:'specialist'});
 }finally{factions.crown=original;}
});
