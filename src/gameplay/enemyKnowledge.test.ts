import {legacyEnemyFixture} from './testHelpers/legacyEnemyFixture';
import {expect,it} from 'vitest';
import {createMatch,updateMatch} from './match';
import {observeEnemyKnowledge,prepareEnemyScout,knownEnemyNode,enemyAttackDestination,updateEnemyExploration} from './enemyKnowledge';
import {prepareEnemyPolicy} from './enemyPolicy';
import {prepareEnemyGathering,updateEnemyGathering} from './enemyGathering';
import {fogIndex} from './fog';
import {encodeSave,decodeSave} from './save';
const view={camera:{x:0,y:0},building:null};
function reveal(m:ReturnType<typeof createMatch>,point:{x:number;y:number}){const i=fogIndex(m.fog!,point)!;m.fog!.teams.enemy.visible[i]=true;m.fog!.teams.enemy.explored[i]=true;}
it('records only observed nodes and keeps last seen amounts when hidden',()=>{
 let m=createMatch('skirmish');m.fog!.teams.enemy.visible.fill(false);m=observeEnemyKnowledge(m);expect(m.enemyKnowledge!.nodes).toEqual([]);reveal(m,m.gathering.node.position);m=observeEnemyKnowledge(m);expect(knownEnemyNode(m,m.gathering.node)!.remaining).toBe(400);m.fog!.teams.enemy.visible.fill(false);m.gathering.node.remaining=1;m=observeEnemyKnowledge(m);expect(knownEnemyNode(m,m.gathering.node)!.remaining).toBe(400);reveal(m,m.gathering.node.position);m=observeEnemyKnowledge(m);expect(knownEnemyNode(m,m.gathering.node)!.remaining).toBe(1);
});
it('hidden resource changes preserve strategic worker orders and search goals',()=>{
 const a=createMatch('skirmish'),b=createMatch('skirmish');a.fog!.teams.enemy.visible.fill(false);b.fog!.teams.enemy.visible.fill(false);b.gathering.node.remaining=0;b.gathering.gold!.remaining=0;const decision=(m:typeof a)=>prepareEnemyScout(prepareEnemyGathering(prepareEnemyPolicy(observeEnemyKnowledge(m))));const x=decision(a),y=decision(b);expect(y.enemyKnowledge).toEqual(x.enemyKnowledge);expect(y.combat.enemies.map(e=>e.work)).toEqual(x.combat.enemies.map(e=>e.work));expect(x.combat.enemies.filter(e=>e.work?.order.kind==='move')).toHaveLength(1);
});
it('scouting is bounded, preserves loaded/building workers and reuses a single moving scout',()=>{
 let m=createMatch('skirmish');const first=m.combat.enemies.find(e=>e.id==='enemy-worker-1')!;first.work!.cargo=4;let result=prepareEnemyScout(m);expect(result.combat.enemies.find(e=>e.id===first.id)!.work!.cargo).toBe(4);expect(result.combat.enemies.filter(e=>e.work?.order.kind==='move')).toHaveLength(1);first.work!.order={kind:'build',buildingId:'barracks'};result=prepareEnemyScout(result);expect(result.combat.enemies.filter(e=>e.work?.order.kind==='move')).toHaveLength(1);
});
it('unknown base uses search route; only observation records and retargets last known base',()=>{
 let m=createMatch('skirmish');m.fog!.teams.enemy.visible.fill(false);expect(enemyAttackDestination(m)).toEqual({x:704,y:480});m.combat.enemies.push({id:'searcher',owner:'enemy',hp:36,position:{x:704,y:480},order:{kind:'attack-move',destination:{x:704,y:480}}});m=updateEnemyExploration(m);expect(enemyAttackDestination(m)).toEqual({x:448,y:480});reveal(m,m.gathering.base);m=updateEnemyExploration(observeEnemyKnowledge(m));expect(m.combat.enemies.find(e=>e.id==='searcher')!.order).toEqual({kind:'attack-move',destination:{x:400,y:450}});m.fog!.teams.enemy.visible.fill(false);m.gathering.base={x:200,y:700};m=observeEnemyKnowledge(m);expect(enemyAttackDestination(m)).toEqual({x:400,y:450});
});
it('unseen depletion does not cancel a distant gather order before observation/contact',()=>{
 let m=createMatch('skirmish');m.enemyKnowledge!.nodes=[{...m.gathering.node,position:{...m.gathering.node.position}}];m.fog!.teams.enemy.visible.fill(false);m.gathering.node.remaining=0;const w=m.combat.enemies.find(e=>e.id==='enemy-worker-1')!;w.work!.order={kind:'gather',nodeId:'wood-1'};const result=updateEnemyGathering(m,0);expect(result.combat.enemies.find(e=>e.id===w.id)!.work!.order.kind).toBe('gather');expect(result.enemyProduction!.wood).toBe(m.enemyProduction!.wood);
});
it('real initial economy discovers wood by scouting and then gathers finite resources',()=>{
 let m=createMatch('skirmish');for(let i=0;i<250;i++)m=updateMatch(m,.1);expect(m.enemyKnowledge!.nodes.map(n=>n.id).sort()).toEqual(['gold-1','wood-1']);expect(m.enemyProduction!.extracted!.wood).toBeGreaterThan(0);expect(m.enemyProduction!.extracted!.gold).toBeGreaterThan(0);expect(m.combat.enemies.filter(e=>e.work?.order.kind==='move')).toHaveLength(0);
});
it('save/load preserves observed memory and rejects unseen forged refs; old eight has no new knowledge',()=>{
 let m=observeEnemyKnowledge(createMatch('skirmish'));m.paused=true;const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok).toBe(true);if(loaded.ok){expect(loaded.match.enemyKnowledge).toEqual(m.enemyKnowledge);expect(updateMatch(loaded.match,100)).toBe(loaded.match);}const d=JSON.parse(encodeSave(m,view));d.state.enemyKnowledge.playerBase={x:400,y:450};expect(decodeSave(JSON.stringify(d)).ok).toBe(false);const old=createMatch('skirmish');delete old.enemyKnowledge;const legacy=JSON.parse(encodeSave(old,view));legacy.configVersion='tribute-config-8';legacyEnemyFixture(legacy);delete legacy.state.statLedger;const r=decodeSave(JSON.stringify(legacy));expect(r.ok).toBe(true);if(r.ok)expect(r.match.enemyKnowledge).toBeUndefined();expect(createMatch('skirmish').enemyKnowledge!.nodes).toEqual([]);
});

it('delivery resumes from remembered availability instead of reading unseen depletion',()=>{
 let m=createMatch('skirmish');m.enemyKnowledge!.nodes=[{...m.gathering.node,position:{...m.gathering.node.position}}];m.fog!.teams.enemy.visible.fill(false);m.gathering.node.remaining=0;const w=m.combat.enemies.find(e=>e.id==='enemy-worker-1')!;w.position={x:1068,y:144};w.work={cargo:1,cargoType:'wood',target:w.position,order:{kind:'deliver',nodeId:'wood-1'}};const result=updateEnemyGathering(m,0);expect(result.combat.enemies.find(e=>e.id===w.id)!.work!.order).toEqual({kind:'gather',nodeId:'wood-1'});expect(result.enemyProduction!.wood).toBe(m.enemyProduction!.wood+1);
});

it('military search advances from a valid combat approach contact outside center-radius 56',()=>{
 const m=createMatch('skirmish');m.combat.enemies.push({id:'searcher',owner:'enemy',hp:36,position:{x:760,y:504},order:{kind:'attack-move',destination:{x:704,y:480}}});expect(updateEnemyExploration(m).enemyKnowledge!.attackScoutIndex).toBe(1);
});
it('normalizes an old saved search destination without changing observed knowledge',()=>{
 const m=createMatch('skirmish');m.combat.enemies.push({id:'searcher',owner:'enemy',hp:36,position:{x:896,y:320},order:{kind:'attack-move',destination:{x:704,y:400}}});
 const updated=updateEnemyExploration(m);expect(updated.enemyKnowledge).toEqual(m.enemyKnowledge);expect(updated.combat.enemies.at(-1)!.order).toEqual({kind:'attack-move',destination:{x:704,y:480}});
});
