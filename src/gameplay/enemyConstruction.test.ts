import {updateEnemyProduction} from './enemyProduction';
import {expect,it} from 'vitest';
import {createMatch,updateMatch} from './match';
import {prepareEnemyConstruction,updateEnemyConstruction,enemyPopulation} from './enemyConstruction';
import {cleanDestroyed} from './destruction';
import {decodeSave,encodeSave} from './save';
import {enemyConstructionConfig} from '../config/enemyConstruction';
import {replaceObstacles} from './map';
const view={camera:{x:0,y:0},building:null};
it('pays for one valid barracks exactly once, keeps builder cargo and blocks production before completion',()=>{
 let m=createMatch('skirmish');const w=m.combat.enemies.find(e=>e.kind==='worker')!;w.work!.cargo=2;w.work!.cargoType='wood';m.enemyProduction!.extracted!.wood=2;m.gathering.node.remaining-=2;
 m=prepareEnemyConstruction(m);const bar=m.combat.enemies.find(e=>e.buildingType==='barracks')!;expect(bar).toBeDefined();expect(bar.footprint!.x%32).toBe(0);expect(bar.construction!.remainingSeconds).toBe(5);expect(m.enemyProduction!.wood).toBe(40);expect(m.enemyProduction!.spent!.wood).toBe(40);expect(m.combat.enemies.find(e=>e.id===w.id)!.work!.cargo).toBe(2);expect(prepareEnemyConstruction(m).enemyProduction!.wood).toBe(40);
 m=updateMatch(m,.1);expect(m.enemyProduction!.acceptedJobs).toBe(0);expect(m.combat.enemies.filter(e=>e.id.startsWith('enemy-produced-'))).toHaveLength(0);
 for(let i=0;i<150&&!m.combat.enemies.some(e=>e.id.startsWith('enemy-produced-'));i++)m=updateMatch(m,.1);
 expect(m.combat.enemies.find(e=>e.buildingType==='barracks')!.construction!.remainingSeconds).toBe(0);expect(m.combat.enemies.some(e=>e.id.startsWith('enemy-produced-'))).toBe(true);expect(decodeSave(encodeSave(m,view)).ok).toBe(true);
});
it('blocked placements and insufficient funds leave finances and entities unchanged, with bounded retry',()=>{
 const m=createMatch('skirmish');m.map=replaceObstacles(m.map,[...m.map.obstacles,...enemyConstructionConfig.candidates.map(p=>({...p,width:64,height:64}))]);const n=prepareEnemyConstruction(m);expect(n.enemyProduction).toEqual(m.enemyProduction);expect(n.combat).toEqual(m.combat);expect(n.enemyConstruction!.nextAttemptSeconds).toBe(1);expect(prepareEnemyConstruction(n)).toBe(n);
 const poor=createMatch('skirmish','easy');poor.enemyProduction!.wood=39;expect(prepareEnemyConstruction(poor).combat.enemies.some(e=>e.buildingType)).toBe(false);expect(poor.enemyProduction!.wood).toBe(39);
});
it('builder death reassigns an already paid unfinished site to the remaining worker',()=>{
 let m=prepareEnemyConstruction(createMatch('skirmish'));const bar=m.combat.enemies.find(e=>e.buildingType==='barracks')!,builder=bar.construction!.builderId!;m.combat.enemies.find(e=>e.id===builder)!.hp=0;m=cleanDestroyed(m);expect(m.combat.enemies.find(e=>e.id===bar.id)!.construction!.builderId).toBeNull();m.waves.elapsedSeconds=1;m=prepareEnemyConstruction(m);expect(m.combat.enemies.find(e=>e.id===bar.id)!.construction!.builderId).toBe('enemy-worker-2');expect(m.enemyProduction!.wood).toBe(40);
});
it('blocked builder is retried after geometry changes without another payment',()=>{
 let m=prepareEnemyConstruction(createMatch('skirmish'));const bar=m.combat.enemies.find(e=>e.buildingType==='barracks')!;const wall={x:1100,y:200,width:104,height:104};m.map=replaceObstacles(m.map,[...m.map.obstacles,wall]);m=updateEnemyConstruction(m,1).match;expect(m.combat.enemies.find(e=>e.id===bar.id)!.construction!.remainingSeconds).toBe(5);m.map=replaceObstacles(m.map,m.map.obstacles.filter(o=>o.x!==wall.x||o.y!==wall.y||o.width!==wall.width||o.height!==wall.height));m.waves.elapsedSeconds=2;m=prepareEnemyConstruction(m);for(let i=0;i<100;i++)m=updateEnemyConstruction(m,.1).match;expect(m.combat.enemies.find(e=>e.id===bar.id)!.construction!.remainingSeconds).toBe(0);expect(m.enemyProduction!.wood).toBe(40);
});
it('a large delta counts only time after barracks completion toward production',()=>{
 const m=prepareEnemyConstruction(createMatch('skirmish'));const bar=m.combat.enemies.find(e=>e.buildingType==='barracks')!,w=m.combat.enemies.find(e=>e.id===bar.construction!.builderId)!;w.position={x:bar.footprint!.x-24,y:bar.position.y};w.navigation=undefined;const r=updateEnemyConstruction(m,7);expect(r.match.combat.enemies.find(e=>e.id===bar.id)!.construction!.remainingSeconds).toBe(0);expect(r.productionDelta).toBeCloseTo(2);
});
it('workers and queued units use real supply; only a complete paid farm adds five',()=>{
 let m=prepareEnemyConstruction(createMatch('skirmish','hard'));m.combat.enemies.find(e=>e.buildingType==='barracks')!.construction={remainingSeconds:0,builderId:null};m.combat.enemies.find(e=>e.work)!.work!.order={kind:'idle'};
 m.combat.enemies.push(...Array.from({length:5},(_,i)=>({id:`enemy-produced-${i+1}`,kind:'unit' as const,owner:'enemy' as const,hp:36,position:{x:700+i*30,y:500}})));expect(enemyPopulation(m)).toMatchObject({cap:8,used:7,reserved:0});m.waves.elapsedSeconds=2;m=prepareEnemyConstruction(m);expect(m.combat.enemies.filter(e=>e.buildingType==='farm')).toHaveLength(1);expect(m.enemyProduction!.wood).toBe(60);expect(enemyPopulation(m).cap).toBe(8);for(let i=0;i<150;i++)m=updateEnemyConstruction(m,.1).match;expect(enemyPopulation(m).cap).toBe(13);expect(m.enemyProduction!.spent!.wood).toBe(60);
});
it('destroying a site clears its obstacle and worker order without refund',()=>{
 let m=prepareEnemyConstruction(createMatch('skirmish'));const bar=m.combat.enemies.find(e=>e.buildingType==='barracks')!;bar.hp=0;m=cleanDestroyed(m);expect(m.combat.enemies.some(e=>e.id===bar.id)).toBe(false);expect(m.map.obstacles.some(o=>o.x===bar.footprint!.x&&o.y===bar.footprint!.y)).toBe(false);expect(m.combat.enemies.filter(e=>e.work).every(e=>e.work!.order.kind==='idle')).toBe(true);expect(m.enemyProduction!.wood).toBe(40);
});
it('saves construction/cargo/timers, freezes on pause and restart resets the whole policy',()=>{
 const m=prepareEnemyConstruction(createMatch('skirmish'));m.paused=true;const r=decodeSave(encodeSave(m,view));expect(r.ok).toBe(true);if(!r.ok)return;expect(r.match.enemyConstruction).toEqual(m.enemyConstruction);expect(r.match.combat.enemies).toEqual(m.combat.enemies);expect(updateMatch(r.match,100)).toBe(r.match);expect(createMatch('skirmish').combat.enemies.some(e=>e.buildingType)).toBe(false);
});
it('config five migrates without free buildings or changing existing base production',()=>{
 const m=createMatch('skirmish');delete m.enemyConstruction;const d=JSON.parse(encodeSave(m,view));d.configVersion='tribute-config-5';const r=decodeSave(JSON.stringify(d));expect(r.ok).toBe(true);if(!r.ok)return;expect(r.match.enemyConstruction).toBeUndefined();const next=updateMatch(r.match,6);expect(next.combat.enemies.some(e=>e.buildingType)).toBe(false);expect(next.combat.enemies.some(e=>e.id.startsWith('enemy-produced-'))).toBe(true);
});

it('saves farm money near supply limit while paid production continues; completed farm permits more jobs',()=>{
 const m=prepareEnemyConstruction(createMatch('skirmish','hard'));const bar=m.combat.enemies.find(e=>e.buildingType==='barracks')!;bar.construction={remainingSeconds:0,builderId:null};m.enemyProduction!.wood=100;m.enemyProduction!.gold=50;
 m.combat.enemies.push(...Array.from({length:5},(_,i)=>({id:`enemy-produced-${i+1}`,kind:'unit' as const,owner:'enemy' as const,hp:36,position:{x:700+i*30,y:500}})));
 const blocked=updateEnemyProduction(m.enemyProduction!,m.combat,m.gathering,m.map,0,'clans',{site:bar,population:enemyPopulation(m),reserveForFarm:1});expect(blocked.state.acceptedJobs).toBe(0);expect(blocked.state.wood).toBe(100);
 const open=updateEnemyProduction(m.enemyProduction!,m.combat,m.gathering,m.map,0,'clans',{site:bar,population:{...enemyPopulation(m),cap:13}});expect(open.state.production.queue).toHaveLength(3);expect(open.state.acceptedJobs).toBe(3);expect(open.state.wood).toBe(46);
});
it('rejects invalid building size, construction references, and spoofed new model in an old save',()=>{
 const json=encodeSave(prepareEnemyConstruction(createMatch('skirmish')),view);
 for(const mutate of [(d:any)=>d.state.combat.enemies.find((e:any)=>e.buildingType).footprint.width=32,(d:any)=>d.state.combat.enemies.find((e:any)=>e.buildingType).construction.builderId='unit-1',(d:any)=>d.configVersion='tribute-config-5']){const d=JSON.parse(json);mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}
});
