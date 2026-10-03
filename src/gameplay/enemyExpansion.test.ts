import {expect,it} from 'vitest';
import {createMatch,updateMatch,type MatchState} from './match';
import {prepareEnemyConstruction,enemyPopulation} from './enemyConstruction';
import {prepareEnemyExpansion,updateEnemyExpansion,wantsEnemyExpansion} from './enemyExpansion';
import {updateEnemyGathering} from './enemyGathering';
import {enemyPriority} from './enemyPolicy';
import {cleanDestroyed} from './destruction';
import {encodeSave,decodeSave} from './save';
import {enemyExpansionConfig} from '../config/enemyExpansion';
const view={camera:{x:0,y:0},building:null};
/** Ready initial barracks/learned upgrades/three army: explicit component preconditions. */
export function fixture():MatchState {
 const m=prepareEnemyConstruction(createMatch('skirmish','normal'));
 const bar=m.combat.enemies.find(e=>e.buildingType==='barracks')!;bar.construction={remainingSeconds:0,builderId:null};
 m.combat.enemies.find(e=>e.id==='enemy-worker-1')!.position={x:720,y:144};for(const e of m.combat.enemies)if(e.work)e.work.order={kind:'idle'};
 m.combat.enemies.push(...Array.from({length:3},(_,i)=>({id:`army-${i}`,owner:'enemy' as const,hp:36,position:{x:700+i*30,y:500},order:{kind:'idle' as const}})));
 m.enemyPolicy!.research={attack:1,defense:1,job:null};m.enemyProduction!.wood=100;m.enemyProduction!.gold=40;m.enemyProduction!.extracted={wood:234,gold:68};m.enemyProduction!.spent={wood:214,gold:48};m.gathering.node.remaining-=234;m.gathering.gold!.remaining-=68;m.waves.elapsedSeconds=2;return m;
}
it('expands only after army, upgrades and surviving economy; one site and one payment',()=>{
 expect(wantsEnemyExpansion(createMatch('skirmish'))).toBe(false);let m=fixture();expect(enemyPriority(m)).toBe('expansion');m=prepareEnemyExpansion(m);expect(m.enemyProduction!.wood).toBe(20);expect(m.enemyProduction!.gold).toBe(20);expect(m.combat.enemies.find(e=>e.id==='enemy-outpost')!.footprint).toEqual({x:736,y:96,width:96,height:96});expect(prepareEnemyExpansion(m).enemyProduction!.wood).toBe(20);expect(m.combat.enemies.filter(e=>e.buildingType==='outpost')).toHaveLength(1);
});
it('insufficient bank and blocked candidates cost nothing; a site cannot start beside another build',()=>{
 let m=fixture();m.enemyProduction!.wood=79;expect(prepareEnemyExpansion(m).enemyProduction!.wood).toBe(79);expect(prepareEnemyExpansion(m).combat.enemies.some(e=>e.buildingType==='outpost')).toBe(false);m=fixture();m.map.obstacles.push(...enemyExpansionConfig.candidates.map(p=>({...p,width:96,height:96})));expect(prepareEnemyExpansion(m).enemyProduction!.wood).toBe(100);expect(prepareEnemyExpansion(m).combat.enemies.some(e=>e.buildingType==='outpost')).toBe(false);m=fixture();m.combat.enemies.find(e=>e.buildingType==='barracks')!.construction!.remainingSeconds=1;expect(prepareEnemyExpansion(m).combat.enemies.some(e=>e.buildingType==='outpost')).toBe(false);
});
it('requires ten seconds of builder contact; supply and delivery activate only after completion',()=>{
 let m=prepareEnemyExpansion(fixture());const cap=enemyPopulation(m).cap;m=updateEnemyExpansion(m,9.9);expect(m.combat.enemies.find(e=>e.id==='enemy-outpost')!.construction!.remainingSeconds).toBeCloseTo(.1);expect(enemyPopulation(m).cap).toBe(cap);m=updateEnemyExpansion(m,.1);expect(enemyPopulation(m).cap).toBe(cap+8);const worker=m.combat.enemies.find(e=>e.id==='enemy-worker-1')!;worker.work={cargo:5,cargoType:'wood',target:worker.position,order:{kind:'deliver',nodeId:'wood-1'}};const before=m.enemyProduction!.wood;m=updateEnemyGathering(m,0);expect(m.enemyProduction!.wood).toBe(before+5);expect(m.combat.enemies.find(e=>e.id===worker.id)!.work!.cargo).toBe(0);
});
it('builder death pauses then a paid replacement can resume without paying for the site twice',()=>{
 let m=prepareEnemyExpansion(fixture());m.combat.enemies.find(e=>e.id==='enemy-worker-1')!.hp=0;m=cleanDestroyed(m);const cost=m.enemyProduction!.spent!.wood;expect(updateEnemyExpansion(m,100).combat.enemies.find(e=>e.id==='enemy-outpost')!.construction!.remainingSeconds).toBe(10);m.waves.elapsedSeconds=4;m=prepareEnemyExpansion(m);expect(m.combat.enemies.find(e=>e.id==='enemy-outpost')!.construction!.builderId).toBe('enemy-worker-2');expect(m.enemyProduction!.spent!.wood).toBe(cost);
});
it('destroyed expansion removes delivery/supply/footprint and rebuilt base pays again',()=>{
 let m=updateEnemyExpansion(prepareEnemyExpansion(fixture()),10);const out=m.combat.enemies.find(e=>e.id==='enemy-outpost')!;out.hp=0;m=cleanDestroyed(m);expect(m.map.obstacles.some(o=>o.x===736&&o.y===96&&o.width===96)).toBe(false);expect(enemyPopulation(m).cap).toBe(8);m.enemyProduction!.wood=100;m.enemyProduction!.gold=40;m.waves.elapsedSeconds=4;m=prepareEnemyExpansion(m);expect(m.enemyProduction!.wood).toBe(20);expect(m.enemyProduction!.spent!.wood).toBe(374);
});
it('save/load in construction and after completion, strict timers, pause and restart',()=>{
 const m=updateEnemyExpansion(prepareEnemyExpansion(fixture()),3);m.paused=true;const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok).toBe(true);if(!loaded.ok)return;expect(loaded.match.enemyRecovery).toEqual(m.enemyRecovery);expect(updateMatch(loaded.match,100)).toBe(loaded.match);const completed=updateEnemyExpansion({...loaded.match,paused:false},7);expect(decodeSave(encodeSave(completed,view)).ok).toBe(true);expect(createMatch('skirmish').combat.enemies.some(e=>e.buildingType==='outpost')).toBe(false);for(const mutate of [(d:any)=>d.state.combat.enemies.find((e:any)=>e.id==='enemy-outpost').construction.remainingSeconds=11,(d:any)=>d.state.combat.enemies.find((e:any)=>e.id==='enemy-outpost').footprint.width=64,(d:any)=>delete d.state.enemyRecovery]){const d=JSON.parse(encodeSave(m,view));mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}
});

it('unfinished or destroyed dropoff cannot credit cargo and a loaded carrier keeps its wood',()=>{
 let m=prepareEnemyExpansion(fixture());const worker=m.combat.enemies.find(e=>e.id==='enemy-worker-2')!;worker.position={x:720,y:160};worker.work={cargo:5,cargoType:'wood',target:worker.position,order:{kind:'deliver',nodeId:'wood-1'}};const before=m.enemyProduction!.wood;m=updateEnemyGathering(m,0);expect(m.enemyProduction!.wood).toBe(before);expect(m.combat.enemies.find(e=>e.id===worker.id)!.work!.cargo).toBe(5);m=updateEnemyExpansion(m,10);m.combat.enemies.find(e=>e.id==='enemy-outpost')!.hp=0;m=cleanDestroyed(m);m=updateEnemyGathering(m,0);expect(m.enemyProduction!.wood).toBe(before);expect(m.combat.enemies.find(e=>e.id===worker.id)!.work!.cargo).toBe(5);expect(m.combat.enemies.find(e=>e.id===worker.id)!.navigation!.goalKey).toContain('960:96');
});
