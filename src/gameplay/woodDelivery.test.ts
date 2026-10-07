import {expect,it} from 'vitest';
import {orderUnits,resourceNodes,updateGathering,type GatheringState,type Worker} from './gathering';
import type {WorldMap} from './map';
import {resourceServices} from './resourceQueue';

const worker=(id='worker-1',cargo=0):Worker=>({id,kind:'worker',selected:true,hp:30,position:{x:276,y:200},target:{x:300,y:200},order:{kind:'gather',nodeId:'tree-1'},cargo,cargoType:cargo?'wood':undefined});
const fixture=(remaining=1,units=[worker()]):GatheringState=>({node:{id:'tree-1',tree:true,resource:'wood',position:{x:300,y:200},remaining},extraNodes:[{id:'tree-2',tree:true,resource:'wood',position:{x:400,y:200},remaining:100}],units,base:{x:100,y:400},wood:0});
const total=(s:GatheringState)=>s.wood+resourceNodes(s).filter(n=>(n.resource??'wood')==='wood').reduce((n,x)=>n+x.remaining,0)+s.units.reduce((n,u)=>n+(u.kind==='worker'&&(u.cargoType??'wood')==='wood'?u.cargo:0),0);
const map:WorldMap={width:800,height:600,tileSize:32,revision:0,obstacles:[]};

it.each([0,1,2,3])('level %s carries partial wood to a reachable tree, then delivers exactly five',level=>{
 const s={...fixture(1,[worker('worker-1',2)]),workerToolsLevel:level},original=structuredClone(s),initial=total(s);
 const switched=updateGathering(s,.9*(1-level*.1));expect(switched.units[0].cargo).toBeCloseTo(2.9);expect(switched.units[0].order).toEqual({kind:'gather',nodeId:'tree-1'});
 const next=updateGathering(switched,.1*(1-level*.1));expect(next.units[0].cargo).toBeCloseTo(3);expect(next.units[0].order).toEqual({kind:'gather',nodeId:'tree-2'});expect(next.wood).toBe(0);expect(total(next)).toBeCloseTo(initial);
 let result=next;const departures:number[]=[];for(let i=0;i<200;i++){const before=result;result=updateGathering(result,.05);if(before.units[0].order.kind==='gather'&&result.units[0].order.kind==='deliver')departures.push(result.units[0].cargo);expect(total(result)).toBeCloseTo(initial,8);}
 expect(departures.length).toBeGreaterThan(0);expect(departures.every(n=>n===5)).toBe(true);expect(result.wood).toBeGreaterThanOrEqual(5);expect(s).toEqual(original);
});
it('depletion redirects earlier workers in the same group without sending their partial cargo home',()=>{
 const a={...worker('worker-1',2),position:{x:100,y:200}},b=worker('worker-2',1),s=fixture(.2,[a,b]);const result=updateGathering(s,.2);
 expect(result.node.remaining).toBe(0);for(const u of result.units)expect(u.order).toEqual({kind:'gather',nodeId:'tree-2'});expect(result.units[0].cargo).toBe(2);expect(result.units[1].cargo).toBeCloseTo(1.2);expect(total(result)).toBeCloseTo(total(s));
});
it('already-depleted wood redirects partial cargo while gold depletion still delivers its remainder',()=>{
 const s=fixture(0,[worker('worker-1',2)]);expect(updateGathering(s,0).units[0]).toMatchObject({cargo:2,order:{kind:'gather',nodeId:'tree-2'}});
 const gold={...s,node:{...s.node,resource:'gold' as const,tree:undefined},units:[{...worker('worker-1',2),cargoType:'gold' as const}]};expect(updateGathering(gold,0).units[0]).toMatchObject({cargo:2,order:{kind:'deliver',nodeId:'tree-1'}});expect(updateGathering(gold,10).units[0].cargo).toBe(0);
});
it('skips an isolated nearer tree and chooses a reachable tree without dropping cargo',()=>{
 const s=fixture(0,[worker('worker-1',2)]);s.extraNodes!.push({id:'tree-3',tree:true,resource:'wood',position:{x:300,y:400},remaining:20});
 const blocked={...map,obstacles:[{x:350,y:0,width:32,height:600}]};const result=updateGathering(s,0,blocked);expect(result.units[0]).toMatchObject({cargo:2,order:{kind:'gather',nodeId:'tree-3'},target:{x:300,y:400}});expect(total(result)).toBe(total(s));
});
it('delivers the final partial load and idles when all remaining wood is unreachable',()=>{
 const s=fixture(0,[worker('worker-1',2)]),blocked={...map,obstacles:[{x:350,y:0,width:32,height:600}]};const delivering=updateGathering(s,0,blocked);expect(delivering.units[0].order.kind).toBe('deliver');
 const done=updateGathering(delivering,10,blocked);expect(done.wood).toBe(2);expect(done.units[0]).toMatchObject({cargo:0,order:{kind:'idle'}});expect(done.extraNodes![0].remaining).toBe(100);expect(total(done)).toBe(total(s));
});
it('felling a tree opens the only passage to the next tree within the same update',()=>{
 const s=fixture(1,[worker('worker-1',2)]);s.node.position={x:304,y:208};s.units[0].position={x:264,y:208};s.units[0].target={...s.node.position};s.extraNodes![0].position={x:432,y:208};
 const corridor={...map,obstacles:[{x:288,y:0,width:32,height:192},{x:288,y:224,width:32,height:376},{x:288,y:192,width:32,height:32}]};const result=updateGathering(s,1,corridor);expect(result.node.remaining).toBe(0);expect(result.units[0]).toMatchObject({cargo:3,order:{kind:'gather',nodeId:'tree-2'}});
});
it('waiting for service, changing work positions and a traffic gate retain partial cargo',()=>{
 const s=fixture(100,[{...worker('worker-1',2),position:{x:260,y:200}}]);const waiting=new Map([['worker-1',{point:{x:260,y:200},working:false}]]);const stalled=updateGathering(s,5,map,{elapsedSeconds:0,services:waiting});expect(stalled.units[0]).toMatchObject({cargo:2,order:{kind:'gather',nodeId:'tree-1'}});expect(stalled.wood).toBe(0);
 const moved=updateGathering(stalled,1,map,{elapsedSeconds:1,services:new Map([['worker-1',{point:{x:330,y:230},working:false}]]),gateFor:()=>()=>0});expect(moved.units[0].cargo).toBe(2);expect(moved.units[0].order.kind).toBe('gather');expect(total(moved)).toBe(total(s));
 const admitted=updateGathering(moved,1,map,{elapsedSeconds:2,services:new Map([['worker-1',{point:{x:260,y:200},working:true}]])});expect(admitted.units[0].cargo).toBeGreaterThan(2);expect(admitted.units[0].order.kind).toBe('gather');
});
it.each(['same','different'] as const)('multiple workers on %s trees conserve stock through normal five-wood departures',layout=>{
 let s=fixture(6,Array.from({length:6},(_,i)=>({...worker(`worker-${i+1}`),position:{x:260,y:200},...(layout==='different'&&i%2?{position:{x:360,y:200},target:{x:400,y:200},order:{kind:'gather' as const,nodeId:'tree-2'}}:{})})));const initial=total(s),departures:number[]=[];let partialSwitch=false;
 for(let i=0;i<1800;i++){const before=s;s=updateGathering(s,.05,map,{elapsedSeconds:i*.05});for(let n=0;n<s.units.length;n++){const a=before.units[n],b=s.units[n];if(a.order.kind==='gather'&&b.order.kind==='deliver'&&s.extraNodes![0].remaining>0)departures.push(b.cargo);if(a.order.kind==='gather'&&b.order.kind==='gather'&&a.order.nodeId!==b.order.nodeId&&b.cargo>0&&b.cargo<5)partialSwitch=true;}expect(total(s)).toBeCloseTo(initial,8);expect(s.units.every(u=>u.cargo>=0&&u.cargo<=5)).toBe(true);}
 expect(partialSwitch).toBe(true);expect(departures.length).toBeGreaterThan(3);expect(departures.every(n=>n===5)).toBe(true);expect(s.wood).toBeCloseTo(initial);expect(s.units.every(u=>u.cargo===0&&u.order.kind==='idle')).toBe(true);
});
it('a resource group with excess demand waits for bounded work slots and never sends partial loads home',()=>{
 const s=fixture(100,Array.from({length:8},(_,i)=>({...worker(`worker-${i+1}`,2),position:{x:220,y:200+i*25}}))),services=resourceServices(s,map,0);expect([...services.values()].filter(v=>v.working)).toHaveLength(3);
 const placed={...s,units:s.units.map(u=>({...u,position:services.get(u.id)!.point}))};const result=updateGathering(placed,1,map,{elapsedSeconds:0});expect(result.units.every(u=>u.order.kind==='gather')).toBe(true);expect(result.units.filter(u=>u.cargo===2)).toHaveLength(5);expect(result.wood).toBe(0);expect(total(result)).toBeCloseTo(total(s));
});
it('manual move, explicit partial delivery and resource-type change retain their existing rules',()=>{
 const s=fixture(100,[worker('worker-1',2)]),moved=updateGathering({...s,units:orderUnits(s.units,s.base)},10);expect(moved.units[0]).toMatchObject({cargo:2,order:{kind:'idle'}});expect(moved.wood).toBe(0);
 const delivered=updateGathering({...s,units:[{...worker('worker-1',2),order:{kind:'deliver',nodeId:'tree-1'}}]},2);expect(delivered.wood).toBe(2);expect(total(delivered)).toBe(total(s));
 const gold={id:'gold-1',resource:'gold' as const,position:{x:500,y:400},remaining:100},ordered=orderUnits(s.units,gold.position,gold);expect(ordered[0]).toMatchObject({cargo:2,cargoType:'wood',order:{kind:'deliver',nodeId:'gold-1'}});
});
it('automatic wood retargeting never uses hidden enemy knowledge',()=>{
 const s=fixture(0,[worker('worker-1',2)]);expect(updateGathering(s,0,map,{elapsedSeconds:0,nodeVisible:n=>n.id!=='tree-2'}).units[0].order.kind).toBe('deliver');expect(s.extraNodes![0].remaining).toBe(100);
});
