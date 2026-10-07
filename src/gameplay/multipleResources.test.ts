import {expect,it} from 'vitest';
import {maps,mapResources,type MapId} from '../config/maps';
import {resourceNodes,orderUnits,updateGathering,type GatheringState,type Worker} from './gathering';
import {createMatch} from './match';
import {encodeSave,decodeSave} from './save';

it('every authored map has unique resource IDs and independent fresh stock',()=>{
 for(const id of Object.keys(maps) as MapId[]){
  const first=mapResources(id),second=mapResources(id);
  expect(new Set(first.map(n=>n.id)).size).toBe(first.length);
  expect(first.every(n=>n.amount>0)).toBe(true);
  first[0].amount=0;first[0].position.x=0;
  expect(second).toEqual(mapResources(id));
 }
});

function fixture():GatheringState{
 const nodes=mapResources('frontier').map(n=>({id:n.id,resource:n.resource,position:{x:0,y:0},remaining:n.amount}));
 const units=nodes.map((n,i):Worker=>({id:`unit-${i+1}`,kind:'worker',selected:true,position:{x:0,y:0},target:{x:0,y:0},cargo:0,order:{kind:'gather',nodeId:n.id}}));
 return {node:nodes[0],gold:nodes[1],extraNodes:nodes.slice(2),base:{x:100,y:0},wood:0,goldBalance:0,units};
}

it.each([1,40])('four independent deposits preserve their targets through repeated deliveries (%s steps)',steps=>{
 let state=fixture();const original=state;
 for(let i=0;i<steps;i++)state=updateGathering(state,20/steps);
 const nodes=resourceNodes(state);
 for(const [i,node] of nodes.entries()){
  const worker=state.units[i] as Worker;
  expect(worker.order).toMatchObject({nodeId:node.id});
  expect(node.remaining).toBeLessThan(resourceNodes(original)[i].remaining-5);
  expect(worker.cargoType===undefined||worker.cargoType===node.resource).toBe(true);
 }
 for(const type of ['wood','gold'] as const){
  const cargo=state.units.reduce((sum,u)=>sum+(u.kind==='worker'&&u.cargoType===type?u.cargo:0),0);
  const stock=nodes.filter(n=>n.resource===type).reduce((sum,n)=>sum+n.remaining,0);
  expect(stock+cargo+(type==='wood'?state.wood:state.goldBalance!)).toBeCloseTo(type==='wood'?600:4500);
 }
 expect(original.extraNodes![0].remaining).toBe(200);
});

it('wood expansion depletion retains partial cargo at the other deposit; gold still delivers and idles',()=>{
 for(const index of [0,1]){
  let state=fixture();state.extraNodes![index].remaining=0.5;
  const initial=resourceNodes(state).reduce((n,r)=>n+r.remaining,0);
  state=updateGathering(state,3);
  const exhausted=state.units[index+2] as Worker,other=state.units[index] as Worker;
  expect(state.extraNodes![index].remaining).toBe(0);
  expect(exhausted.order).toEqual(index===0?{kind:'gather',nodeId:'wood-1'}:{kind:'idle'});
  expect(exhausted.cargo).toBeCloseTo(index===0?3:0);
  expect(other.order).toMatchObject({kind:'gather',nodeId:index===0?'wood-1':'gold-1'});
  expect(resourceNodes(state)[index].remaining).toBeGreaterThan(0);
  expect(index===0?state.wood:state.goldBalance).toBeCloseTo(index===0?0:0.5);
  expect(resourceNodes(state).reduce((n,r)=>n+r.remaining,0)+state.units.reduce((n,u)=>n+u.cargo,0)+state.wood+state.goldBalance!).toBeCloseTo(initial);
 }
});

it('Save/load preserves active expansion delivery targets and rejects unknown deposit references',()=>{
 const m=createMatch('skirmish','beginner',undefined,'frontier');
 for(const [i,node] of m.gathering.extraNodes!.slice(0,m.gathering.units.length).entries()){
  const worker=m.gathering.units[i] as Worker;
  worker.cargo=5;worker.cargoType=node.resource;worker.selected=true;
  m.gathering.units[i]=orderUnits([worker],node.position,node)[0];
 }
 const json=encodeSave(m,{camera:{x:0,y:0},building:null}),loaded=decodeSave(json);
 expect(loaded.ok).toBe(true);
 if(loaded.ok){
  expect(loaded.match.gathering.extraNodes).toEqual(m.gathering.extraNodes);
  for(let i=0;i<2;i++)expect(loaded.match.gathering.units[i].order).toEqual({kind:'deliver',nodeId:m.gathering.extraNodes![i].id});
 }
 const invalid=JSON.parse(json);invalid.state.gathering.units[0].order.nodeId='missing-deposit';
 expect(decodeSave(JSON.stringify(invalid)).ok).toBe(false);
});
