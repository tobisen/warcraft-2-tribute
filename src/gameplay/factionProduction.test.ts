import {describe,it,expect} from 'vitest';
import {createMatch,updateMatch} from './match';
import {factionsForPlayer,factions} from '../config/factions';
import {enqueueProduction,cancelProduction,updateQueuedProduction} from './productionQueue';
import {encodeSave,decodeSave} from './save';
import {updateEnemyProduction} from './enemyProduction';
const view={camera:{x:0,y:0},building:null};
const bar={kind:'barracks' as const,footprint:{x:512,y:384,width:64,height:64},ready:true};
function ready(id:'crown'|'clans'){const m=createMatch('skirmish','normal',factionsForPlayer(id));m.gathering.wood=100;m.gathering.goldBalance=50;m.placement={...m.placement,barracks:bar.footprint,barracksHP:120,barracksOwner:'player',construction:{remainingSeconds:0,builderId:null}};m.map.obstacles.push(bar.footprint);return m;}
describe('shared faction production recipes',()=>{
 it.each(['crown','clans'] as const)('%s debits once, spawns once at its deadline with own HP across time steps',id=>{
  for(const steps of [1,10,120]){const m=ready(id),r=enqueueProduction(m.gathering,m.soldierProduction,bar),recipe=factions[id].units.soldier;
   expect(r.gathering.wood).toBe(100-recipe.cost.wood);expect(r.gathering.goldBalance).toBe(50-recipe.cost.gold);expect(r.production.remainingSeconds).toBe(recipe.durationSeconds);
   let g=r.gathering,p=r.production;for(let i=0;i<steps;i++){const n=updateQueuedProduction(g,p,(recipe.durationSeconds-.1)/steps,bar);g=n.gathering;p=n.production;}expect(g.units).toHaveLength(3);
   const done=updateQueuedProduction(g,p,.1,bar);expect(done.gathering.units).toHaveLength(4);expect(done.gathering.units[3].hp).toBe(recipe.hp);expect(done.gathering.units[3].selected).toBe(false);expect(updateQueuedProduction(done.gathering,done.production,100,bar).gathering.units).toHaveLength(4);
  }
 });
 it('blocks missing gold, full population and full queue; refunds stored clan payments',()=>{
  const m=ready('clans');expect(enqueueProduction({...m.gathering,goldBalance:5},m.soldierProduction,bar).production).toBe(m.soldierProduction);
  expect(enqueueProduction(m.gathering,m.soldierProduction,bar,{used:8,reserved:0,cap:8}).production).toBe(m.soldierProduction);
  let r=enqueueProduction(m.gathering,m.soldierProduction,bar);r=enqueueProduction(r.gathering,r.production,bar);r=enqueueProduction(r.gathering,r.production,bar);expect(enqueueProduction(r.gathering,r.production,bar).production).toBe(r.production);
  const refund=cancelProduction(r.gathering,r.production,r.production.queue![0].id);expect(refund.gathering.wood).toBe(55);expect(refund.gathering.goldBalance).toBe(35);expect(refund.production.remainingSeconds).toBe(6);
 });
 it('runs base and barracks together and validates own recipes across Save/Load/restart',()=>{
  let m=ready('clans');const worker=enqueueProduction(m.gathering,m.production);const soldier=enqueueProduction(worker.gathering,m.soldierProduction,bar);m={...m,gathering:soldier.gathering,production:worker.production,soldierProduction:soldier.production};
  const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok).toBe(true);if(!loaded.ok)return;m=updateMatch(loaded.match,5);expect(m.gathering.units).toHaveLength(4);m=updateMatch(m,1);expect(m.gathering.units).toHaveLength(5);expect(new Set(m.gathering.units.map(u=>u.id)).size).toBe(5);expect(m.gathering.units.find(u=>u.kind==='soldier')?.hp).toBe(66);expect(decodeSave(encodeSave(m,view)).ok).toBe(true);
  const reset=createMatch('skirmish','normal',m.factions);expect(reset.gathering.faction).toBe('clans');expect(reset.soldierProduction.queue).toBeUndefined();
 });
 it('migrates old paid clan jobs, keeps their timer/refund and rejects forged recipe data',()=>{
  const m=ready('clans'),r=enqueueProduction(m.gathering,m.soldierProduction,bar);m.gathering=r.gathering;m.soldierProduction=r.production;
  const d=JSON.parse(encodeSave(m,view));d.configVersion='tribute-config-2';delete d.state.statLedger;delete d.state.enemyConstruction;delete d.state.enemyPolicy;delete d.state.enemyRecovery;delete d.state.enemyKnowledge;d.state.combat.enemies=d.state.combat.enemies.filter((e:any)=>e.kind!=='worker');delete d.state.enemyProduction.extracted;delete d.state.enemyProduction.spent;delete d.state.enemyProduction.lostCargo;Object.assign(d.state.soldierProduction.queue[0],{cost:{wood:20,gold:5},durationSeconds:5,remainingSeconds:3});d.state.soldierProduction.remainingSeconds=3;const json=JSON.stringify(d),loaded=decodeSave(json);expect(loaded.ok).toBe(true);if(!loaded.ok)return;
  expect(loaded.match.soldierProduction.queue![0]).toMatchObject({legacyRecipe:true,cost:{wood:20,gold:5},remainingSeconds:3});expect(decodeSave(encodeSave(loaded.match,view)).ok).toBe(true);const refunded=cancelProduction(loaded.match.gathering,loaded.match.soldierProduction,'barracks-job-1');expect(refunded.gathering.wood).toBe(m.gathering.wood+10);expect(refunded.gathering.goldBalance).toBe(m.gathering.goldBalance!+2.5);expect(JSON.stringify(d)).toBe(json);
  for(const change of [(x:any)=>x.cost.wood=0,(x:any)=>x.durationSeconds=1]){const bad=JSON.parse(json);change(bad.state.soldierProduction.queue[0]);expect(decodeSave(JSON.stringify(bad)).ok).toBe(false);}
 });
 it('enemy faction pays its own finite recipe budget and adjusted difficulty duration',()=>{
  const m=ready('crown');const r=updateEnemyProduction(m.enemyProduction!,m.combat,m.gathering,m.map,0,'clans');expect(r.state.wood).toBe(26);expect(r.state.gold).toBe(2);expect(r.state.production.queue).toHaveLength(3);expect(r.state.production.remainingSeconds).toBe(6);
  const roundtrip=decodeSave(encodeSave({...m,enemyProduction:r.state},view));expect(roundtrip.ok).toBe(true);
 });
});
