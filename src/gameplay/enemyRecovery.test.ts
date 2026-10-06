import {createClassicMatch as createMatch} from './testHelpers/classicMatch';
import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {legacyEnemyFixture} from './testHelpers/legacyEnemyFixture';
import {expect,it} from 'vitest';
import {updateMatch} from './match';
import {cleanDestroyed} from './destruction';
import {prepareEnemyRecovery,advanceEnemyRecovery} from './enemyRecovery';
import {enemyPriority,prepareEnemyPolicy} from './enemyPolicy';
import {prepareEnemyGathering} from './enemyGathering';
import {enemyPopulation} from './enemyConstruction';
import {encodeSave,decodeSave} from './save';
import {spawnCandidates} from './spawning';
const view={camera:{x:0,y:0},building:null};
function loss(both=false){let m=createMatch('skirmish','normal');for(const e of m.combat.enemies)if(e.kind==='worker'&&(both||e.id==='enemy-worker-1'))e.hp=0;delete m.enemyKnowledge;return cleanDestroyed(m);}
it('pays once, waits five seconds, spawns one empty unselected worker outside actual base',()=>{
 let m=loss();expect(enemyPriority(m)).toBe('workers');m=prepareEnemyRecovery(m);expect(m.enemyProduction!.wood).toBe(60);expect(m.enemyProduction!.spent!.wood).toBe(20);expect(enemyPopulation(m).reserved).toBe(1);expect(prepareEnemyRecovery(m).enemyProduction!.wood).toBe(60);m=advanceEnemyRecovery(m,4.9);expect(m.combat.enemies.filter(e=>e.kind==='worker')).toHaveLength(1);m=advanceEnemyRecovery(m,.1);const w=m.combat.enemies.find(e=>e.id==='enemy-worker-3')!;expect(w.work).toEqual({cargo:0,target:w.position,order:{kind:'idle'}});expect(w.position.x).toBeGreaterThanOrEqual(1068);expect(advanceEnemyRecovery(m,20).combat.enemies.filter(e=>e.kind==='worker')).toHaveLength(2);expect(prepareEnemyGathering(m).combat.enemies.find(e=>e.id===w.id)!.work!.order.kind).toBe('gather');
});
it('replaces two workers sequentially, with monotonic IDs and conserved paid bank',()=>{
 let m=loss(true);m=advanceEnemyRecovery(prepareEnemyRecovery(m),5);expect(m.enemyProduction!.wood).toBe(60);expect(m.combat.enemies.filter(e=>e.kind==='worker').map(e=>e.id)).toEqual(['enemy-worker-3']);m=advanceEnemyRecovery(prepareEnemyRecovery(m),5);expect(m.enemyProduction!.wood).toBe(40);expect(m.enemyProduction!.spent!.wood).toBe(40);expect(m.combat.enemies.filter(e=>e.kind==='worker').map(e=>e.id)).toEqual(['enemy-worker-3','enemy-worker-4']);expect(prepareEnemyRecovery(m).enemyProduction!.wood).toBe(40);
});
it('insufficient bank and occupied supply do not charge or start',()=>{
 const m=loss();m.enemyProduction!.wood=19;expect(prepareEnemyRecovery(m)).toBe(m);m.enemyProduction!.wood=80;m.combat.enemies.push(...Array.from({length:7},(_,i)=>({id:`army-${i}`,owner:'enemy' as const,hp:36,position:{x:700+i*30,y:500}})));expect(prepareEnemyRecovery(m)).toBe(m);
});
it('small and large training steps produce the same worker and bank',()=>{
 let small=prepareEnemyRecovery(loss());for(let i=0;i<50;i++)small=advanceEnemyRecovery(small,.1);const large=advanceEnemyRecovery(prepareEnemyRecovery(loss()),5);expect(small.combat.enemies).toEqual(large.combat.enemies);expect(small.enemyProduction).toEqual(large.enemyProduction);
});
it('save/load paid timer and later workers; pause, legacy and restart remain explicit',()=>{
 const m=advanceEnemyRecovery(prepareEnemyRecovery(loss()),2);m.paused=true;const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok).toBe(true);if(!loaded.ok)return;expect(loaded.match.enemyRecovery).toEqual(m.enemyRecovery);expect(updateMatch(loaded.match,100)).toBe(loaded.match);const spawned=advanceEnemyRecovery({...loaded.match,paused:false},3);expect(decodeSave(encodeSave(spawned,view)).ok).toBe(true);expect(createMatch('skirmish').enemyRecovery!.production.nextUnitNumber).toBe(3);
 const old=createMatch('skirmish');delete old.enemyRecovery;delete old.enemyKnowledge;const doc=JSON.parse(encodeSave(old,view));legacyTerrainFixture(doc);doc.configVersion='tribute-config-7';legacyEnemyFixture(doc);delete doc.state.statLedger;const legacy=decodeSave(JSON.stringify(doc));expect(legacy.ok).toBe(true);if(legacy.ok)expect(legacy.match.enemyRecovery).toBeUndefined();for(const mutate of [(d:any)=>d.state.enemyRecovery.production.nextUnitNumber=2,(d:any)=>d.state.enemyRecovery.production.queue[0].cost.wood=0,(d:any)=>d.configVersion='tribute-config-7']){const d=JSON.parse(encodeSave(m,view));mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}
});
it('base death cancels the paid replacement without refund and terminal match freezes',()=>{
 let m=prepareEnemyRecovery(loss());m.combat.enemies.find(e=>e.kind==='base')!.hp=0;m=cleanDestroyed(m);expect(m.enemyRecovery!.production.remainingSeconds).toBeNull();expect(m.enemyProduction!.wood).toBe(60);expect(advanceEnemyRecovery(m,100)).toBe(m);m.outcome='victory';expect(updateMatch(m,100)).toBe(m);
});

it('blocked spawn retains the paid ready job and resumes once without another payment',()=>{
 let m=prepareEnemyRecovery(loss());const base=m.combat.enemies.find(e=>e.kind==='base')!;const blockers=spawnCandidates(m.map,base.footprint!,'base').map((position,i)=>({id:`blocker-${i}`,owner:'enemy' as const,hp:36,position}));m.combat.enemies.push(...blockers);m=advanceEnemyRecovery(m,5);expect(m.enemyRecovery!.production.remainingSeconds).toBe(0);expect(m.combat.enemies.filter(e=>e.kind==='worker')).toHaveLength(1);m=advanceEnemyRecovery(m,50);expect(m.combat.enemies.filter(e=>e.kind==='worker')).toHaveLength(1);m.combat.enemies=m.combat.enemies.filter(e=>!e.id.startsWith('blocker-'));m=advanceEnemyRecovery(m,0);expect(m.combat.enemies.filter(e=>e.kind==='worker')).toHaveLength(2);expect(m.enemyProduction!.spent!.wood).toBe(20);expect(m.enemyRecovery!.production.remainingSeconds).toBeNull();
});

it('a replacement cohort retains a wood worker even after both original IDs are gone',()=>{
 let m=loss(true);m=advanceEnemyRecovery(prepareEnemyRecovery(m),5);m=advanceEnemyRecovery(prepareEnemyRecovery(m),5);m.enemyProduction!.gold=0;m=prepareEnemyPolicy(m);expect(m.combat.enemies.find(e=>e.id==='enemy-worker-3')!.work!.order).toEqual({kind:'gather',nodeId:'wood-1'});expect(m.combat.enemies.find(e=>e.id==='enemy-worker-4')!.work!.order).toEqual({kind:'gather',nodeId:'gold-1'});
});
