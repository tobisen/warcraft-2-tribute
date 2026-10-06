import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {legacyEnemyFixture} from './testHelpers/legacyEnemyFixture';
import {encodeSave,decodeSave} from './save';
import {expect,it} from 'vitest';
import {createClassicMatch as createMatch} from './testHelpers/classicMatch';
import {updateMatch} from './match';
import {factionsForPlayer} from '../config/factions';
import {enemyStartingBudget} from '../config/enemyNaval';
import {difficultyProfiles} from '../config/difficulty';
import {enemyPopulation} from './enemyConstruction';
import {domainBodyFits} from './terrainNavigation';
it('a finite paid fleet builds, boards real produced units, lands and defeats an undefended base',()=>{
 let m=createMatch('skirmish','normal',factionsForPlayer('crown'),'islands');const budget=enemyStartingBudget(difficultyProfiles.normal.budget,true),phases=new Set<string>();
 expect(m.enemyProduction!.wood).toBe(budget.wood);expect(m.enemyProduction!.gold).toBe(budget.gold);
 for(let i=0;i<2500&&m.outcome==='playing';i++){m=updateMatch(m,.2);if(!phases.has(m.enemyNaval!.phase)){const loaded=decodeSave(encodeSave({...m,paused:true},{camera:{x:0,y:0},building:null}));expect(loaded.ok).toBe(true);if(loaded.ok)m={...loaded.match,paused:false};}phases.add(m.enemyNaval!.phase);const bank=m.enemyProduction!;expect(bank.wood+bank.spent!.wood).toBeCloseTo(budget.wood);expect(bank.gold+bank.spent!.gold).toBeCloseTo(budget.gold);const pop=enemyPopulation(m);expect(pop.used+pop.reserved).toBeLessThanOrEqual(pop.cap);for(const ship of m.combat.enemies.filter(e=>e.kind==='ship'))expect(domainBodyFits(m.map,'water',ship.position,16)).toBe(true);}
 expect([...phases],JSON.stringify({naval:m.enemyNaval,enemies:m.combat.enemies})).toEqual(expect.arrayContaining(['waiting','loading','sailing','landed']));expect(m.outcome,JSON.stringify({time:m.waves.elapsedSeconds,naval:m.enemyNaval,enemies:m.combat.enemies,bank:m.enemyProduction})).toBe('defeat');expect(m.enemyProduction!.acceptedJobs).toBeGreaterThanOrEqual(2);expect(m.enemyNaval!.production.nextUnitNumber).toBe(2);expect(m.gathering.wood).toBe(0);
},30000);

it('paid carrier cargo dies once when real cannon damage sinks the transport',()=>{
 let m=createMatch('skirmish','normal',factionsForPlayer('crown'),'islands');for(let i=0;i<1600&&m.enemyNaval!.phase!=='sailing';i++)m=updateMatch(m,.2);expect(m.enemyNaval!.passengers).toHaveLength(2);
 // Explicit combat precondition: two defender hulls, not a paid-production claim.
 const boat=m.combat.enemies.find(e=>e.kind==='ship')!;boat.order={kind:'idle'};m.navy={harbor:null,production:{remainingSeconds:null,nextUnitNumber:3},ships:[0,1].map(i=>({id:`ship-${i+1}`,kind:'ship' as const,owner:'player' as const,hp:90,position:{x:800,y:432+i*32},target:{x:800,y:432+i*32},selected:true,order:{kind:'attack' as const,enemyId:boat.id}}))};
 for(let i=0;i<60&&m.combat.enemies.some(e=>e.kind==='ship');i++)m=updateMatch(m,.1);expect(m.combat.enemies.some(e=>e.kind==='ship')).toBe(false);expect(m.enemyNaval!.passengers).toEqual([]);expect(m.enemyNaval!.phase).toBe('finished');const spent=m.enemyProduction!.spent;for(let i=0;i<100;i++)m=updateMatch(m,.1);expect(m.enemyNaval!.production.nextUnitNumber).toBe(2);expect(m.enemyNaval!.production.queue??[]).toEqual([]);expect(m.enemyProduction!.spent!.wood).toBeGreaterThanOrEqual(spent!.wood);
},30000);
it('naval saves strictly validate identities/phase/cargo/recipes; old14 gets no free budget',()=>{
 let m=createMatch('skirmish','easy',factionsForPlayer('clans'),'islands');for(let i=0;i<1800&&m.enemyNaval!.phase!=='sailing';i++)m=updateMatch(m,.2);const json=encodeSave(m,{camera:{x:0,y:0},building:null});expect(decodeSave(json).ok).toBe(true);
 for(const mutate of [(d:any)=>d.state.enemyNaval.passengers.push(d.state.enemyNaval.passengers[0]),(d:any)=>d.state.enemyNaval.phase='waiting',(d:any)=>d.state.enemyNaval.production.nextUnitNumber=1,(d:any)=>d.state.enemyProduction.wood+=1,(d:any)=>d.configVersion='tribute-config-14']){const d=JSON.parse(json);mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}
 const old=createMatch('skirmish','normal',factionsForPlayer('crown'),'islands');delete old.enemyNaval;old.enemyProduction!.wood-=120;old.enemyProduction!.gold-=30;const d=JSON.parse(encodeSave(old,{camera:{x:0,y:0},building:null}));legacyTerrainFixture(d);d.configVersion='tribute-config-14';legacyEnemyFixture(d);delete d.state.statLedger;const loaded=decodeSave(JSON.stringify(d));expect(loaded.ok).toBe(true);if(loaded.ok){expect(loaded.match.enemyNaval).toBeUndefined();expect(loaded.match.enemyProduction!.wood).toBe(difficultyProfiles.normal.budget.wood);}
},30000);
it('naval simulation freezes on pause/end and a restart starts with a fresh empty fleet',()=>{
 const m=createMatch('skirmish','hard',factionsForPlayer('clans'),'islands');expect(updateMatch({...m,paused:true},100)).toEqual({...m,paused:true});expect(updateMatch({...m,outcome:'defeat'},100)).toEqual({...m,outcome:'defeat'});expect(createMatch('skirmish','hard',factionsForPlayer('clans'),'islands').enemyNaval!.passengers).toEqual([]);
});

it('a ship sunk during boarding releases the surviving ground army to existing AI',()=>{
 let m=createMatch('skirmish','normal',factionsForPlayer('crown'),'islands');for(let i=0;i<1600&&m.enemyNaval!.phase!=='loading';i++)m=updateMatch(m,.2);expect(m.enemyNaval!.phase).toBe('loading');m.combat.enemies.find(e=>e.kind==='ship')!.hp=0;m=updateMatch(m,.1);expect(m.enemyNaval!.phase).toBe('finished');expect(m.combat.enemies.filter(e=>e.kind==='unit')).toHaveLength(2);expect(m.combat.enemies.some(e=>e.navalLanding)).toBe(false);expect(decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null})).ok).toBe(true);
},30000);
