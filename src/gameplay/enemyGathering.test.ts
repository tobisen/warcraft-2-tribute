import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {legacyEnemyFixture} from './testHelpers/legacyEnemyFixture';
import {expect,it} from 'vitest';
import {createMatch,updateMatch} from './match';
import {prepareEnemyGathering,updateEnemyGathering} from './enemyGathering';
import {updateEnemyProduction} from './enemyProduction';
import {cleanDestroyed} from './destruction';
import {updateCombat,orderAttack} from './combat';
import {encodeSave,decodeSave} from './save';
import {resourceServices} from './resourceQueue';
import {enemyWorker} from './enemyGathering';
const view={camera:{x:0,y:0},building:null};
const economy=()=>{const m=createMatch('skirmish','normal');delete m.enemyKnowledge;return prepareEnemyGathering(m);};
it('starts two distinct real workers only in playable enemy-base scenarios',()=>{
 for(const scenario of ['skirmish','mission-base'] as const){const m=createMatch(scenario);expect(m.combat.enemies.filter(e=>e.kind==='worker')).toHaveLength(2);expect(m.gathering.units).toHaveLength(3);expect(m.combat.enemies.filter(e=>e.work).every(e=>e.hp===35&&e.work!.cargo===0)).toBe(true);}
 expect(createMatch('survival').combat.enemies).toHaveLength(0);expect(createMatch('siege-test').combat.enemies).toHaveLength(1);
});
it('requires contact, carries at most five and credits only actual base deliveries',()=>{
 let m=economy();const bank=m.enemyProduction!.wood;
 m=updateEnemyGathering(m,.1);expect(m.gathering.node.remaining).toBe(400);expect(m.enemyProduction!.wood).toBe(bank);
 let carried=false,delivered=false;
 for(let i=0;i<400;i++){m=updateEnemyGathering(m,.1);const w=m.combat.enemies.find(e=>e.id==='enemy-worker-1')!;expect(w.work!.cargo).toBeLessThanOrEqual(5);if(w.work!.cargo>0&&!delivered){carried=true;expect(m.enemyProduction!.wood).toBe(bank);}if(m.enemyProduction!.wood>bank){delivered=true;break;}}
 expect(carried).toBe(true);expect(delivered).toBe(true);expect(m.enemyProduction!.wood).toBe(bank+5);expect(m.enemyProduction!.extracted!.wood).toBeCloseTo(5);
});
it.each([.05,.1,.5])('repeats finite shared wood/gold deliveries with timestep %s',delta=>{
 let m=economy();delete m.gathering.extraNodes;m.gathering.node.remaining=7;m.gathering.gold!.remaining=7;
 for(let t=0;t<40;t+=delta)m=updateEnemyGathering(m,delta);
 expect(m.gathering.node.remaining).toBe(0);expect(m.gathering.gold!.remaining).toBe(0);expect(m.enemyProduction!.wood).toBeCloseTo(87);expect(m.enemyProduction!.gold).toBeCloseTo(27);expect(m.combat.enemies.filter(e=>e.work).every(e=>e.work!.cargo===0&&e.work!.order.kind==='idle')).toBe(true);
});
it('shared queue caps service places across both owners and never duplicates node amounts',()=>{
 let m=economy();m.gathering.units=m.gathering.units.map(u=>u.kind!=='worker'?u:({...u,order:{kind:'gather',nodeId:'wood-1'},target:{...m.gathering.node.position}}));
 const workers=m.combat.enemies.flatMap(e=>{const w=enemyWorker(e);return w?[w]:[];});const services=resourceServices({...m.gathering,units:[...m.gathering.units,...workers]},m.map,0);
 expect([...services.values()].filter(s=>s.working)).toHaveLength(3);expect(services.size).toBe(4);
 for(let i=0;i<250;i++)m=updateMatch(m,.1);
 const bank=m.enemyProduction!,cargo=m.combat.enemies.reduce((n,e)=>n+(e.work?.cargoType==='wood'?e.work.cargo:0),0);
 expect(bank.wood+bank.spent!.wood+cargo+bank.lostCargo!.wood).toBeCloseTo(80+bank.extracted!.wood);expect(m.gathering.node.remaining).toBeGreaterThanOrEqual(0);
});
it('combat death removes a worker and accounts for its cargo once',()=>{
 let m=economy();const w=m.combat.enemies.find(e=>e.kind==='worker')!;w.position={x:600,y:300};w.work!.cargo=3;w.work!.cargoType='wood';m.enemyProduction!.extracted!.wood=3;m.gathering.node.remaining-=3;
 m.gathering.units=[{id:'unit-4',owner:'player',kind:'soldier',hp:60,cargo:0,selected:true,position:{x:568,y:300},target:{x:568,y:300},order:{kind:'idle'}}];m.gathering.units=orderAttack(m.gathering.units,w.id);w.hp=1;
 const fight=updateCombat(m.gathering,m.combat,.1);m=cleanDestroyed({...m,...fight});expect(m.combat.enemies.some(e=>e.id===w.id)).toBe(false);expect(m.enemyProduction!.lostCargo!.wood).toBe(3);expect(cleanDestroyed(m).enemyProduction!.lostCargo!.wood).toBe(3);
});
it('destroying the base clears work, preserves cargo and freezes the match',()=>{
 let m=economy();const w=m.combat.enemies.find(e=>e.work)!;w.work!.cargo=2;w.work!.cargoType='wood';m.enemyProduction!.extracted!.wood=2;m.gathering.node.remaining-=2;m.combat.enemies.find(e=>e.kind==='base')!.hp=0;m=updateMatch(m,0);expect(m.outcome).toBe('victory');expect(m.combat.enemies.filter(e=>e.work).every(e=>e.work!.order.kind==='idle')).toBe(true);expect(updateMatch(m,100)).toBe(m);expect(decodeSave(encodeSave(m,view)).ok).toBe(true);
});
it('only delivered income funds new production after the original budget is spent',()=>{
 let m=economy();m.enemyProduction!.wood=0;m.enemyProduction!.gold=0;m.enemyProduction!.spent={wood:80,gold:20};
 let r=updateEnemyProduction(m.enemyProduction!,m.combat,m.gathering,m.map,0,'clans');expect(r.state.acceptedJobs).toBe(0);
 for(let t=0;t<50;t+=.1)m=updateEnemyGathering(m,.1);
 expect(m.enemyProduction!.wood).toBeGreaterThanOrEqual(18);expect(m.enemyProduction!.gold).toBeGreaterThanOrEqual(6);r=updateEnemyProduction(m.enemyProduction!,m.combat,m.gathering,m.map,0,'clans');expect(r.state.acceptedJobs).toBeGreaterThan(0);expect(r.state.spent!.wood).toBe(80+r.state.acceptedJobs*18);
});
it('roundtrips orders/cargo/ledger, pauses, resets, and rejects forged worker state',()=>{
 let m=economy();for(let i=0;i<45;i++)m=updateMatch(m,.1);m.paused=true;const json=encodeSave(m,view),loaded=decodeSave(json);expect(loaded.ok).toBe(true);if(!loaded.ok)return;expect(updateMatch(loaded.match,100)).toBe(loaded.match);expect(loaded.match.combat.enemies.map(e=>e.work)).toEqual(m.combat.enemies.map(e=>e.work));expect(loaded.match.enemyProduction).toEqual(m.enemyProduction);
 for(const mutate of [(d:any)=>d.state.combat.enemies.find((e:any)=>e.work).work.cargo=6,(d:any)=>d.state.enemyProduction.wood+=1,(d:any)=>d.state.combat.enemies.find((e:any)=>e.work).work.order.nodeId='missing']){const d=JSON.parse(json);mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}
 expect(createMatch('skirmish').enemyProduction!.extracted).toEqual({wood:0,gold:0});
});
it('migrates config four without adding free workers or income',()=>{
 const d=JSON.parse(encodeSave(createMatch('siege-test'),view));legacyTerrainFixture(d);d.configVersion='tribute-config-4';legacyEnemyFixture(d);delete d.state.statLedger;const loaded=decodeSave(JSON.stringify(d));expect(loaded.ok).toBe(true);if(loaded.ok){expect(loaded.match.combat.enemies).toHaveLength(1);expect(loaded.match.enemyProduction!.extracted).toBeUndefined();expect(decodeSave(encodeSave(loaded.match,view)).ok).toBe(true);}
});
it('workers never attack or join army groups and forged military membership is rejected',()=>{
 const m=economy(),w=m.combat.enemies.find(e=>e.work)!;w.position={x:400,y:400};m.combat.enemies=[w];const fight=updateCombat(m.gathering,m.combat,10);expect(fight.combat.baseHP).toBe(240);expect(fight.gathering.units.map(u=>u.hp)).toEqual([30,30,30]);
 const d=JSON.parse(encodeSave(createMatch('skirmish'),view));d.state.enemyAI.reserve=['enemy-worker-1'];expect(decodeSave(JSON.stringify(d)).ok).toBe(false);
});
