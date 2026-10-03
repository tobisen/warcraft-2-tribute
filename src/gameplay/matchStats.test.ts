import {expect,it} from 'vitest';
import {createMatch,updateMatch} from './match';
import {matchStats} from './matchStats';
import {updateGathering} from './gathering';
import {enqueueProduction,cancelProduction,updateQueuedProduction} from './productionQueue';
import {updateEnemyProduction} from './enemyProduction';
import {updateEnemyGathering} from './enemyGathering';
import {updateCombat} from './combat';
import {encodeSave,decodeSave} from './save';
import {releasePlaythrough} from './testHelpers/releaseBot';
import {resultRows} from '../presentation/matchResults';
function playerGather(){const m=createMatch('skirmish');const u=m.gathering.units[0];u.position={x:688,y:176};u.order={kind:'gather',nodeId:'wood-1'};return m;}
it('fresh profiles do not count stocks, starting units or enemy budget as income/training/spending',()=>{
 for(const map of ['arena','forest','river'] as const){const m=createMatch('skirmish','hard',undefined,map);const stats=matchStats(m);expect(stats.seconds).toBe(0);for(const team of [stats.player,stats.enemy])expect(team).toEqual({wood:{gathered:0,delivered:0,spent:0},gold:{gathered:0,delivered:0,spent:0},added:0,lost:0,killed:0,built:0,destroyed:0,removed:0});}
});
it('gathered cargo becomes delivered only at actual delivery and does not invent spending',()=>{
 const m=playerGather();m.gathering=updateGathering(m.gathering,5,m.map);expect(matchStats(m).player.wood).toEqual({gathered:5,delivered:0,spent:0});m.gathering.units[0].position={x:464,y:450};m.gathering.units[0].navigation=undefined;m.gathering=updateGathering(m.gathering,1,m.map);expect(matchStats(m).player.wood).toEqual({gathered:5,delivered:5,spent:0});
});
it('paid queue and partial/full refunds report net spend, while cancelled units are not added',()=>{
 const m=playerGather();m.gathering=updateGathering(m.gathering,200,m.map);expect(m.gathering.wood).toBeGreaterThanOrEqual(40);for(let i=0;i<2;i++){const r=enqueueProduction(m.gathering,m.production);m.gathering=r.gathering;m.production=r.production;}expect(matchStats(m).player.wood.spent).toBeCloseTo(40);let r=cancelProduction(m.gathering,m.production,m.production.queue![1].id);m.gathering=r.gathering;m.production=r.production;expect(matchStats(m).player.wood.spent).toBeCloseTo(20);r=cancelProduction(m.gathering,m.production,m.production.queue![0].id);m.gathering=r.gathering;m.production=r.production;expect(matchStats(m).player.wood.spent).toBeCloseTo(10);expect(matchStats(m).player.added).toBe(0);
});
it('actual worker production and enemy attack count one added unit and one loss/kill',()=>{
 let m=playerGather();m.gathering=updateGathering(m.gathering,200,m.map);const start=enqueueProduction(m.gathering,m.production),born=updateQueuedProduction(start.gathering,start.production,5,{kind:'base'},{map:m.map,enemies:m.combat.enemies});m={...m,gathering:born.gathering,production:born.production};expect(matchStats(m).player.added).toBe(1);const e=updateEnemyProduction(m.enemyProduction!,m.combat,m.gathering,m.map,6,'clans');m={...m,enemyProduction:e.state,combat:e.combat};const attacker=m.combat.enemies.find(e=>e.id==='enemy-produced-1')!;const target=m.gathering.units.find(u=>u.id==='unit-4')!;target.position={x:460,y:450};target.order={kind:'idle'};attacker.position={x:490,y:450};attacker.order=undefined;attacker.navigation=undefined;const result=updateCombat(m.gathering,m.combat,5,m.map,m.placement);m={...m,gathering:result.gathering,combat:result.combat};expect(matchStats(m).player.lost).toBe(1);expect(matchStats(m).enemy.killed).toBe(1);expect(matchStats(m).enemy.added).toBe(1);
});
it('enemy extraction is not attributed to player or delivered before cargo reaches a base',()=>{
 let m=createMatch('skirmish');delete m.enemyKnowledge;const worker=m.combat.enemies.find(e=>e.id==='enemy-worker-1')!;worker.position={x:688,y:176};worker.work!.order={kind:'gather',nodeId:'wood-1'};m=updateEnemyGathering(m,1);expect(matchStats(m).enemy.wood).toEqual({gathered:1,delivered:0,spent:0});expect(matchStats(m).player.wood.gathered).toBe(0);
});
it('paid victory totals match command expenses, preserve Save/freeze and reset fresh',()=>{
 const r=releasePlaythrough('skirmish','normal',undefined,{faction:'clans',map:'forest',abilities:true}),m=r.match;expect(m.outcome).toBe('victory');const stats=matchStats(m);expect(stats.player.wood.spent).toBeCloseTo(r.spentWood);expect(stats.player.gold.spent).toBeCloseTo(r.spentGold);expect(stats.player.added).toBeGreaterThan(0);expect(stats.player.killed).toBeGreaterThan(0);expect(stats.enemy.lost).toBe(stats.player.killed);expect(matchStats(updateMatch(m,1000))).toEqual(stats);const loaded=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(loaded.ok).toBe(true);if(loaded.ok)expect(matchStats(loaded.match)).toEqual(stats);expect(matchStats(createMatch('skirmish','normal',undefined,'forest')).player.wood.gathered).toBe(0);
},30_000);
it('legacy bank without extraction records shows paid finite budget, without invented gathering',()=>{
 const m=createMatch('siege-test');const r=updateEnemyProduction(m.enemyProduction!,m.combat,m.gathering,m.map,0,'clans');m.enemyProduction=r.state;expect(matchStats(m).enemy.wood.spent).toBe(54);expect(matchStats(m).enemy.gold.spent).toBe(18);expect(matchStats(m).enemy.wood.gathered).toBe(0);expect(matchStats(m).enemy.wood.delivered).toBe(0);
});
it('result rows label net spending and use bounded decimals for fractional gathering',()=>{
 const m=playerGather();m.gathering=updateGathering(m.gathering,.123456,m.map);const rows=resultRows(matchStats(m));expect(rows).toHaveLength(12);expect(rows[0]).toEqual({label:'Gathered wood',player:'0.1',enemy:'0'});expect(rows.some(r=>r.label==='Net spent wood')).toBe(true);
});
