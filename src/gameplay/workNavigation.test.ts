import { describe, expect, it } from 'vitest';
import { createMatch } from './match';
import { orderUnits, updateGathering, type GatheringState } from './gathering';
import { bodyFits, replaceObstacles } from './map';
import { placementObstacles } from './placement';
import { approachRoute, canInteract } from './approach';
import { commandMappedMove } from './navigation';

function working() {
  const match=createMatch();
  match.gathering.units=match.gathering.units.map(u=>({...u,selected:true}));
  match.gathering.units=orderUnits(match.gathering.units,match.gathering.node.position,match.gathering.node);
  return match;
}
const total=(state:GatheringState)=>state.wood+state.node.remaining+state.units.reduce((sum,u)=>sum+u.cargo,0);
describe('navigated gathering and delivery', () => {
  it('takes nothing before reaching a body-safe work position outside the node', () => {
    const s=working();const untouched=updateGathering(s.gathering,.1,s.map);
    expect(untouched.node.remaining).toBe(s.gathering.node.remaining);
    expect(untouched.wood).toBe(0);
    const after=updateGathering(s.gathering,8,s.map);
    expect(after.node.remaining).toBeLessThan(400);
    for(const u of after.units)expect(bodyFits(s.map,u.position,12)).toBe(true);
    expect(total(after)).toBeCloseTo(400);
  });
  it('delivers full and final partial loads then idles after depletion', () => {
    const s=working();s.gathering.node.remaining=17;
    const after=updateGathering(s.gathering,40,s.map);
    expect(after.wood).toBeCloseTo(17);expect(after.node.remaining).toBe(0);
    expect(after.units.every(u=>u.cargo===0 && u.order.kind==='idle')).toBe(true);
    expect(total(after)).toBeCloseTo(17);
  });
  it('repeated trips conserve wood and equivalent time steps finish identically', () => {
    const s=working();s.gathering.units=s.gathering.units.slice(0,1);s.gathering.node.remaining=24;
    const large=updateGathering(s.gathering,60,s.map);
    let small=s.gathering;
    for(let i=0;i<600;i++)small=updateGathering(small,.1,s.map);
    expect(large.wood).toBeCloseTo(24);expect(small.wood).toBeCloseTo(24);
    expect(large.units[0].position.x).toBeCloseTo(small.units[0].position.x);
    expect(total(small)).toBeCloseTo(24);
  });
  it('selects reachable sides and never extracts through an enclosing wall', () => {
    const s=working(),node=placementObstacles(s.gathering)[1];
    const side=replaceObstacles(s.map,[...s.map.obstacles,{x:590,y:120,width:28,height:120}]);
    expect(approachRoute(side,s.gathering.units[0].position,node,24).status).not.toBe('blocked');
    const sealed=replaceObstacles(s.map,[...s.map.obstacles,
      {x:590,y:120,width:120,height:20},{x:590,y:220,width:120,height:20},
      {x:590,y:140,width:20,height:80},{x:690,y:140,width:20,height:80}]);
    const blocked=updateGathering(s.gathering,30,sealed);
    expect(blocked.node.remaining).toBe(400);expect(blocked.wood).toBe(0);
    expect(blocked.units.every(u=>u.navigation?.status==='blocked')).toBe(true);
    expect(canInteract(sealed,{x:730,y:180},node,80)).toBe(false);
    const opened=replaceObstacles(sealed,s.map.obstacles);
    expect(updateGathering(blocked,30,opened).wood).toBeGreaterThan(0);
  });
  it('blocked drop-off retains cargo, move/new gather preserves it and full loads cannot overfill', () => {
    const s=working();s.gathering.units=s.gathering.units.slice(0,1);
    const worker=s.gathering.units[0];if(worker.kind!=='worker')throw Error();
    worker.cargo=5;worker.order={kind:'deliver',nodeId:s.gathering.node.id};
    const blocked=replaceObstacles(s.map,[...s.map.obstacles,
      {x:340,y:390,width:120,height:20},{x:340,y:490,width:120,height:20},
      {x:340,y:410,width:20,height:80},{x:440,y:410,width:20,height:80}]);
    let gathering=updateGathering(s.gathering,20,blocked);
    expect(gathering.wood).toBe(0);expect(gathering.units[0].cargo).toBe(5);
    gathering.units=commandMappedMove(gathering.units,{x:600,y:300},blocked);
    gathering=updateGathering(gathering,3,blocked);
    expect(gathering.units[0].cargo).toBe(5);
    gathering.units=orderUnits(gathering.units,gathering.node.position,gathering.node);
    const resumed=updateGathering(gathering,20,replaceObstacles(blocked,s.map.obstacles));
    expect(resumed.wood).toBeGreaterThanOrEqual(5);
    expect(resumed.units[0].cargo).toBeLessThanOrEqual(5);expect(total(resumed)).toBeCloseTo(405);
  });
});
