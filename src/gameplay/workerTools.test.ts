import {expect,it} from 'vitest';
import {createMatch,updateMatch} from './match';
import {createResearch,startResearch,updateResearch,canResearch} from './research';
import {updateGathering,type Worker,type GatheringState} from './gathering';
import {workerToolsConfig} from '../config/workerTools';
import {factionIds} from '../config/factions';
import {encodeSave,decodeSave} from './save';
import {trainBaseWorker} from './extraBases';
import {matchPlayers} from './players';
import {selectionInfo} from '../presentation/selectionInfo';
import {actionPanel} from '../presentation/actionPanel';
import {technologyView} from '../presentation/technologyView';
const view={camera:{x:0,y:0},building:null};
const work=(level:number):GatheringState=>{const m=createMatch();const node={id:'tools-tree',position:{x:300,y:300},remaining:100};const u:Worker={...m.gathering.units[0],kind:'worker',order:{kind:'gather',nodeId:node.id},position:{...node.position},target:{...node.position},cargo:0};return {...m.gathering,node,extraNodes:[],gold:undefined,units:[u],workerToolsLevel:level};};
it('all five factions research I–III in order, pay each recipe once, share one job and stop at III',()=>{
 for(const faction of factionIds){const m=createMatch();let g:GatheringState={...m.gathering,faction,wood:1000,goldBalance:1000},r=createResearch();
  for(const [i,recipe]of workerToolsConfig.entries()){
   const old=g,started=startResearch(g,r,m.placement,'workerTools');g=started.gathering;r=started.research;
   expect(r.job).toEqual({kind:'workerTools',remainingSeconds:recipe.durationSeconds});expect(g.wood).toBe(old.wood-recipe.cost.wood);expect(g.goldBalance).toBe(old.goldBalance!-recipe.cost.gold);
   expect(startResearch(g,r,m.placement,'workerTools').gathering).toBe(g);expect(updateResearch(r,m.placement,recipe.durationSeconds-1).workerTools??0).toBe(i);
   r=updateResearch(r,m.placement,recipe.durationSeconds);expect(r.workerTools).toBe(i+1);
  }
  expect(canResearch(g,r,m.placement,'workerTools')).toBe(false);expect(canResearch(g,createResearch(),m.placement,'workerTools',false)).toBe(false);expect(canResearch(g,createResearch(),m.placement,'workerTools',true,false)).toBe(false);
  expect(canResearch({...g,wood:59},createResearch(),m.placement,'workerTools')).toBe(false);expect(canResearch({...g,goldBalance:29},createResearch(),m.placement,'workerTools')).toBe(false);
 }
});
it('gathering takes exactly90/80/70% of baseline for wood and gold, without stacking or changing capacity',()=>{
 for(const level of [0,1,2,3])for(const resource of ['wood','gold'] as const){const g=work(level);g.node={...g.node,resource};const seconds=5*(level===0?1:workerToolsConfig[level-1].timeMultiplier);
  const partial=updateGathering(g,seconds-.001);expect(partial.units[0].cargo).toBeLessThan(5);expect(partial.units[0].order.kind).toBe('gather');
  const full=updateGathering(partial,.001);expect(full.units[0].cargo).toBeCloseTo(5);expect(full.units[0].order.kind).toBe('deliver');
 }
});
it('existing and newly produced workers use the owner level; a new match resets it',()=>{
 let m=createMatch();m.research!.workerTools=3;m.gathering.wood=200;m.gathering.goldBalance=100;m=trainBaseWorker(m,'base');m=updateMatch(m,5);
 expect(m.gathering.units).toHaveLength(4);expect(m.gathering.workerToolsLevel).toBe(3);
 const g=work(3),fresh=m.gathering.units[3] as Worker;g.units.push({...fresh,position:{...g.node.position},order:{kind:'gather',nodeId:g.node.id},cargo:0});
 const next=updateGathering(g,1);expect(next.units.map(u=>u.cargo)).toEqual([1/.7,1/.7]);expect(createMatch().research?.workerTools??0).toBe(0);
});
it('main bases expose one research lane and tech tree lists all sequential tools dependencies',()=>{
 const m=createMatch();m.gathering.wood=1000;m.gathering.goldBalance=1000;
 expect(actionPanel(m,'base',true)['research-workerTools'].reason).toBe('');expect(actionPanel(m,'base',true)['research-workerTools'].summary).toContain('Next: 10%');expect(selectionInfo(m,'base').stats.join(' ')).toContain('Worker Tools 0/3 · Next: 10%');m.research=startResearch(m.gathering,m.research!,m.placement,'workerTools').research;
 expect(actionPanel(m,'base',true)['research-workerTools'].reason).toBe('Research in progress');
 m.placement.bases=[{id:'base-1',owner:'player',hp:300,footprint:{x:512,y:384,width:64,height:64},construction:{remainingSeconds:0,builderId:null},production:{remainingSeconds:null,nextUnitNumber:4}}];
 expect(actionPanel(m,'base-1',true)['research-workerTools'].reason).toBe('Research in progress');
 const nodes=technologyView(m).nodes.filter(n=>n.id.startsWith('research-workerTools-'));expect(nodes).toHaveLength(3);expect(nodes[1].dependencies).toContain('Worker Tools I');expect(nodes[2].dependencies).toContain('Worker Tools II');
});
it('roundtrips active/finished tools and rejects invalid levels/timers without requiring a forge',()=>{
 for(const level of [0,1,2,3]){let m=createMatch();m.research!.workerTools=level;if(level<3){m.gathering.wood=1000;m.gathering.goldBalance=1000;const started=startResearch(m.gathering,m.research!,m.placement,'workerTools');m={...m,gathering:started.gathering,research:started.research};}
  const raw=encodeSave(m,view),loaded=decodeSave(raw);expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(loaded.ok){expect(loaded.match.research).toEqual(m.research);expect(loaded.match.gathering.workerToolsLevel??0).toBe(level);}
  const bad=JSON.parse(raw);bad.state.research.workerTools=4;expect(decodeSave(JSON.stringify(bad)).ok).toBe(false);
 }
 const m=createMatch();m.research!.workerTools=1;const raw=JSON.parse(encodeSave(m,view));raw.state.research.job={kind:'workerTools',remainingSeconds:21};expect(decodeSave(JSON.stringify(raw)).ok).toBe(false);
});
it('allied/hostile players keep independent tools research through the existing multiplayer save',()=>{
 const roster=matchPlayers(undefined,undefined,3);roster[2].teamId=1;const m=createMatch('skirmish','normal',undefined,'plains96',1,'balanced',roster);
 m.research!.workerTools=1;m.multiplePlayers!.ai[0].state.enemyPolicy!.research.workerTools=2;m.multiplePlayers!.ai[1].state.enemyPolicy!.research.workerTools=3;
 const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(loaded.ok){expect(loaded.match.research!.workerTools).toBe(1);expect(loaded.match.multiplePlayers!.ai.map(a=>a.state.enemyPolicy!.research.workerTools)).toEqual([2,3]);}
},15000);

it('tools finish on the match research boundary without a forge and cancel if every own base is destroyed',()=>{
 let m=createMatch();m.research!.job={kind:'workerTools',remainingSeconds:.1};m=updateMatch(m,.2);expect(m.research!.workerTools).toBe(1);expect(m.gathering.workerToolsLevel).toBe(1);
 const dead=createMatch();dead.research!.job={kind:'workerTools',remainingSeconds:.1};dead.combat.baseHP=0;const stopped=updateMatch(dead,.1);expect(stopped.research!.job).toBeNull();expect(stopped.research!.workerTools??0).toBe(0);
 const paused=createMatch();paused.research!.job={kind:'workerTools',remainingSeconds:1};paused.paused=true;expect(updateMatch(paused,2)).toBe(paused);
});

it('enemy gathering uses its own tools, never the human level',async()=>{
 const {updateEnemyGathering}=await import('./enemyGathering');const {createClassicMatch}=await import('./testHelpers/classicMatch');
 const m=createClassicMatch('skirmish','normal',undefined,'plains96');m.map.obstacles=[];m.enemyKnowledge=undefined;m.gathering.node={id:'tools-node',position:{x:300,y:300},remaining:100};m.gathering.extraNodes=[];m.gathering.gold=undefined;
 m.combat.enemies=m.combat.enemies.filter(e=>e.kind!=='worker');m.combat.enemies.push({id:'enemy-worker-1',kind:'worker',owner:'enemy',hp:30,position:{x:256,y:300},work:{target:{x:300,y:300},cargo:0,order:{kind:'gather',nodeId:'tools-node'}}});
 m.research!.workerTools=3;const basic=updateEnemyGathering(m,1,undefined,new Map());m.enemyPolicy!.research.workerTools=3;const improved=updateEnemyGathering(m,1,undefined,new Map());
 const cargo=(s:typeof m)=>s.combat.enemies.find(e=>e.id==='enemy-worker-1')!.work!.cargo;
 expect(cargo(basic)).toBeGreaterThan(0);expect(cargo(improved)).toBeCloseTo(cargo(basic)/.7);
});
