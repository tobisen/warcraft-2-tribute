import {expect,it} from 'vitest';
import {factions,type FactionDefinition} from '../config/factions';
import {unitAvailability,technologyFor} from './productionPrerequisites';
import {createMatch} from './match';
import {enqueueProduction,updateQueuedProduction} from './productionQueue';

const definition=():FactionDefinition=>({...factions.crown,units:{...factions.crown.units,catapult:{...factions.crown.units.catapult,prerequisites:{buildings:['forge'],research:{attack:1}}}}});
it('roster admission and named construction/research requirements are independent',()=>{
 const f=definition();
 expect(unitAvailability({...f,roster:['worker']},'catapult')).toBe('Unit unavailable for this faction');
 expect(unitAvailability(f,'catapult')).toBe('Complete Forge');
 expect(unitAvailability(f,'catapult',{buildings:['forge'],research:{}})).toBe('Research attack 1');
 expect(unitAvailability(f,'catapult',{buildings:['forge'],research:{attack:1}})).toBeNull();
 expect(unitAvailability(f,'soldier')).toBeNull();
});
it('failed prerequisites reject atomically, accepted jobs survive later prerequisite loss',()=>{
 const original=factions.crown;factions.crown=definition();
 try{
  const m=createMatch('skirmish');const g={...m.gathering,wood:100,goldBalance:100};
  const b={kind:'barracks' as const,footprint:{x:512,y:384,width:64,height:64},unitType:'catapult' as const,producer:'siegeWorks' as const,bounds:m.map};
  const rejected=enqueueProduction(g,m.soldierProduction,b);
  expect(rejected.gathering).toBe(g);expect(rejected.production).toBe(m.soldierProduction);
  const accepted=enqueueProduction(g,m.soldierProduction,{...b,technology:{buildings:['forge'],research:{attack:1}}});
  expect(accepted.gathering.wood).toBe(60);expect(accepted.gathering.goldBalance).toBe(80);
  expect(accepted.production.queue).toHaveLength(1);
  const done=updateQueuedProduction(accepted.gathering,accepted.production,10,b);
  expect(done.gathering.units.at(-1)).toMatchObject({kind:'soldier',archetype:'catapult'});
  expect(done.gathering.units).toHaveLength(4);expect(done.gathering.wood).toBe(60);
 }finally{factions.crown=original;}
});

it('technology requires completed live buildings and completed levels for each owner',()=>{
 const m=createMatch('skirmish');
 m.placement.forge={id:'forge',owner:'player',hp:120,footprint:{x:512,y:384,width:64,height:64},construction:{remainingSeconds:3,builderId:null}};
 m.research!.job={kind:'attack',remainingSeconds:1};
 expect(technologyFor(m,'player')).toEqual({academyAllowed:true,buildings:['base'],research:{attack:0,defense:0}});
 m.placement.forge.construction.remainingSeconds=0;m.research!.attack=1;
 expect(technologyFor(m,'player')).toEqual({academyAllowed:true,buildings:['base','forge'],research:{attack:1,defense:0}});
 m.placement.forge.hp=0;expect(technologyFor(m,'player').buildings).not.toContain('forge');
 m.combat.enemies.push({id:'enemy-forge',kind:'building',buildingType:'forge',hp:120,position:{x:1000,y:400},construction:{remainingSeconds:0,builderId:null}});
 m.enemyPolicy!.research.defense=1;
 expect(technologyFor(m,'enemy').buildings).toContain('forge');expect(technologyFor(m,'enemy').research.defense).toBe(1);
 m.combat.enemies.at(-1)!.hp=0;expect(technologyFor(m,'enemy').buildings).not.toContain('forge');
});

it('shared requirements list all missing dependencies and only completed base levels count',async()=>{
 const {missingPrerequisites,buildingAvailability,researchAvailability,techTree}=await import('./productionPrerequisites');
 const f=factions.crown,m=createMatch();
 expect(missingPrerequisites(f,{baseLevel:3,buildings:['forge'],research:{attack:1}},technologyFor(m,'player'))).toEqual(['Upgrade Keep to level 3','Complete Forge','Research attack 1']);
 expect(buildingAvailability(f,'forge',{buildings:[],research:{}})).toBe('Complete Keep');
 expect(researchAvailability(f,'defense',technologyFor(m,'player'))).toBe('Complete Forge');
 m.combat.baseDevelopment={level:1,remainingSeconds:1};expect(technologyFor(m,'player').baseLevel).toBe(1);
 expect(techTree(m).join('\n')).toContain('Complete Forge');
});
