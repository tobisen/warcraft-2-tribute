import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {replaceObstacles} from './map';
import {createNavy} from './navy';
import {prepareNavalCombat} from './navalCombat';
import {describe,it,expect} from 'vitest';
import {createMatch,updateMatch} from './match';
import {issueOrder,prepareOrders,orderSummary} from './commandOrders';
import {encodeSave,decodeSave} from './save';
import {stopSelected} from './orders';
import type {Soldier} from './gathering';
import {separateBodies} from './separation';
import {updateCombat} from './combat';
import {acquireTargets} from './acquisition';
const view={camera:{x:0,y:0},building:null} as const;
function fixture(){const m=createMatch();m.gathering.units=m.gathering.units.map(u=>({...u,selected:true}));return m;}
describe('persistent commands and FIFO',()=>{
 it('keeps movement and selection unchanged when Shift appends; starts next once',()=>{
  let m=issueOrder(fixture(),{kind:'move',destination:{x:400,y:300}});const first=m.gathering.units[0];
  m=issueOrder(m,{kind:'move',destination:{x:600,y:300}},true);expect(m.gathering.units[0].target).toEqual(first.target);expect(m.gathering.units[0].orderQueue).toHaveLength(1);
  m.gathering.units[0]={...m.gathering.units[0],position:{...first.target},order:{kind:'idle'},selected:false};
  m=prepareOrders(m);expect(m.gathering.units[0].target).toEqual({x:600,y:300});expect(m.gathering.units[0].selected).toBe(false);expect(m.gathering.units[0].orderQueue).toBeUndefined();
 });
 it('normal order and Stop clear continuing modes and queue; cargo survives',()=>{
  let m=issueOrder(fixture(),{kind:'hold'});m=issueOrder(m,{kind:'move',destination:{x:400,y:300}},true);
  expect(orderSummary(m.gathering.units[0])).toContain('Queue 1');m=issueOrder(m,{kind:'move',destination:{x:300,y:300}});expect(m.gathering.units[0].commandMode).toBeUndefined();expect(m.gathering.units[0].orderQueue).toBeUndefined();
  m=issueOrder(m,{kind:'hold'});m=issueOrder(m,{kind:'move',destination:{x:400,y:300}},true);m.gathering.units=stopSelected(m.gathering.units,true);expect(m.gathering.units.every(u=>!u.commandMode&&!u.orderQueue)).toBe(true);
 });
 it('holds a soldier in range while firing; ignores out-of-range and invisible targets',()=>{
  const soldier:Soldier={id:'unit-3',kind:'soldier',archetype:'archer',hp:40,cargo:0,position:{x:300,y:300},target:{x:300,y:300},selected:true,order:{kind:'idle'},commandMode:{kind:'hold'}};
  const enemies=[{id:'enemy-1',hp:100,position:{x:340,y:300},order:{kind:'idle' as const}}];
  const m=fixture();const fight=updateCombat({...m.gathering,units:[soldier]}, {...m.combat,enemies},.2);
  expect(fight.gathering.units[0].position).toEqual(soldier.position);expect(fight.combat.enemies[0].hp).toBeLessThan(100);
  expect(acquireTargets([soldier],[{...enemies[0],position:{x:600,y:300}}])[0].order.kind).toBe('idle');expect(acquireTargets([soldier],enemies,undefined,()=>false)[0].order.kind).toBe('idle');
 });
 it('patrol resumes the current leg after combat then reverses at endpoint',()=>{
  let m=issueOrder(fixture(),{kind:'patrol',destination:{x:400,y:300}});const u=m.gathering.units[0];expect(u.commandMode?.kind).toBe('patrol');
  m.gathering.units[0]={...u,order:{kind:'idle'}};m=prepareOrders(m);expect(m.gathering.units[0].target).toEqual({x:400,y:300});
  m.gathering.units[0]={...m.gathering.units[0],position:{x:400,y:300},order:{kind:'idle'}};m=prepareOrders(m);expect(m.gathering.units[0].target).toEqual(u.position);
 });
 it('skips lost attack targets and missing nodes without hanging the queue',()=>{
  const m=fixture();const u=m.gathering.units[0];u.orderQueue=[{kind:'gather',nodeId:'missing'},{kind:'move',destination:{x:400,y:300}}];expect(prepareOrders(m).gathering.units[0].order.kind).toBe('move');
 });
 it('preserves modes/queue via strict Save/load; rejects invalid state and resets new matches',()=>{
  let m=issueOrder(fixture(),{kind:'patrol',destination:{x:400,y:300}});m=issueOrder(m,{kind:'hold'},true);const loaded=decodeSave(encodeSave(m,view));expect(loaded.ok).toBe(true);if(loaded.ok){expect(loaded.match.gathering.units[0].commandMode).toEqual(m.gathering.units[0].commandMode);expect(loaded.match.gathering.units[0].orderQueue).toEqual([{kind:'hold'}]);}
  const raw=JSON.parse(encodeSave(m,view));raw.state.gathering.units[0].orderQueue=[{kind:'attack',enemyId:'x'}];expect(decodeSave(JSON.stringify(raw)).ok).toBe(false);
  expect(createMatch().gathering.units.every(u=>!u.commandMode&&!u.orderQueue)).toBe(true);
 });
 it('completed move advances in the real match loop and fixed Hold resists separation',()=>{
  let m=issueOrder(fixture(),{kind:'move',destination:{x:400,y:300}});m=issueOrder(m,{kind:'hold'},true);m=updateMatch(m,10);m=updateMatch(m,.1);expect(m.gathering.units[0].commandMode?.kind).toBe('hold');
  const p=m.gathering.units[0].position;const separated=separateBodies(m.map,[{id:'player:a',position:p,half:8,fixed:true},{id:'player:b',position:p,half:8}],1);expect(separated.has('player:a')).toBe(false);
 });
 it('migrates config42 without pretending old saves contained command modes',()=>{
  const raw=JSON.parse(encodeSave(fixture(),view));legacyTerrainFixture(raw);raw.configVersion='tribute-config-42';expect(decodeSave(JSON.stringify(raw)).ok).toBe(true);raw.state.gathering.units[0].commandMode={kind:'hold'};expect(decodeSave(JSON.stringify(raw)).ok).toBe(false);
 });
 it('ships hold and fire in range without land pursuit; transports only queue movement',()=>{
  let m=createMatch('mission-outpost','easy');m.navy={...createNavy(),ships:[{id:'ship-1',kind:'ship',owner:'player',hp:90,selected:true,position:{x:208,y:512},target:{x:208,y:512},order:{kind:'idle'}}]};
  m=issueOrder(m,{kind:'hold'});const nearby={id:'enemy-1',hp:36,position:{x:320,y:512},order:{kind:'idle' as const}};
  const shot=prepareNavalCombat(m.navy,[nearby],.1,m.map,1);expect(shot.shots).toHaveLength(1);expect(shot.navy!.ships[0].position).toEqual({x:208,y:512});
  const far=prepareNavalCombat(m.navy,[{...nearby,position:{x:850,y:220}}],2,m.map,1);expect(far.shots).toHaveLength(0);expect(far.navy!.ships[0].position).toEqual({x:208,y:512});
  m=issueOrder(m,{kind:'move',destination:{x:144,y:512}},true);expect(m.navy!.ships[0].orderQueue).toHaveLength(1);
  m.navy!.ships[0].role='transport';m=issueOrder(m,{kind:'attack',enemyId:'enemy-1'},true);expect(m.navy!.ships[0].orderQueue).toHaveLength(1);
 });
 it('finishes attack-move destination after target loss before starting the next Shift order',()=>{
  const m=fixture();const soldier:Soldier={id:'unit-4',kind:'soldier',hp:60,cargo:0,position:{x:300,y:300},target:{x:500,y:300},attackMoveTarget:{x:500,y:300},selected:false,order:{kind:'idle'},orderQueue:[{kind:'hold'}]};m.gathering.units=[soldier];
  const pending=prepareOrders(m).gathering.units[0];expect(pending.commandMode).toBeUndefined();expect(pending.orderQueue).toEqual([{kind:'hold'}]);expect(pending.kind==='soldier'&&pending.attackMoveTarget).toEqual({x:500,y:300});
  m.gathering.units=[{...soldier,position:{x:500,y:300},attackMoveTarget:undefined}];const completed=prepareOrders(m).gathering.units[0];expect(completed.commandMode?.kind).toBe('hold');expect(completed.selected).toBe(false);
 });
 it('patrol adopts a reachable changed endpoint and reverses after arriving there',()=>{
  const m=fixture(),u=m.gathering.units[0];u.commandMode={kind:'patrol',origin:{x:200,y:300},destination:{x:400,y:300},returning:false};u.position={x:300,y:300};u.order={kind:'idle'};m.map=replaceObstacles(m.map,[...m.map.obstacles,{x:400,y:284,width:64,height:64}]);
  const moved=prepareOrders(m).gathering.units[0];expect(moved.target).not.toEqual({x:400,y:300});expect(moved.commandMode?.kind==='patrol'&&moved.commandMode.destination).toEqual(moved.target);
  m.gathering.units=[{...moved,position:{...moved.target},order:{kind:'idle'}}];const reversed=prepareOrders(m).gathering.units[0];expect(reversed.commandMode?.kind==='patrol'&&reversed.commandMode.returning).toBe(true);expect(reversed.target).toEqual({x:200,y:300});
 });
 it('paused matches neither accept nor advance commands; blocks runaway queue growth',()=>{
  let m=issueOrder(fixture(),{kind:'hold'});for(let i=0;i<50;i++)m=issueOrder(m,{kind:'hold'},true);expect(m.gathering.units[0].orderQueue).toHaveLength(32);
  m={...m,paused:true};expect(issueOrder(m,{kind:'move',destination:{x:400,y:300}})).toBe(m);expect(updateMatch(m,5)).toBe(m);
 });
});
