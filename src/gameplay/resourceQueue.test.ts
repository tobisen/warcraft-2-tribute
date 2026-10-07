import {expect,it} from 'vitest';
import {resourceServices} from './resourceQueue';
import {updateGathering,orderUnits,type GatheringState,type Worker} from './gathering';
import type {WorldMap} from './map';
import {createMatch,updateMatch} from './match';
import {encodeSave,decodeSave} from './save';
const map:WorldMap={width:800,height:600,tileSize:32,revision:0,obstacles:[{x:380,y:180,width:40,height:40}]};
function fixture():GatheringState{return {node:{id:'wood',position:{x:400,y:200},remaining:100},base:{x:200,y:400},wood:0,units:Array.from({length:8},(_,i):Worker=>({id:`worker-${i+1}`,kind:'worker',selected:false,hp:30,position:{x:320,y:250+i*25},target:{x:400,y:200},order:{kind:'gather',nodeId:'wood'},cargo:0}))};}
it('admits at most three workers, with distinct contact and waiting points outside range',()=>{const s=fixture(),places=resourceServices(s,map,0);expect([...places.values()].filter(p=>p.working)).toHaveLength(3);expect(new Set([...places.values()].map(p=>`${p.point.x},${p.point.y}`)).size).toBe(8);s.units=s.units.map(u=>({...u,position:places.get(u.id)!.point}));const next=updateGathering(s,1,map,{elapsedSeconds:0});expect(next.node.remaining).toBe(97);expect(next.units.filter(u=>u.cargo>0)).toHaveLength(3);});
it('rotates service fairly, conserves wood, delivers the final cargo and leaves no stranded orders',()=>{let s=fixture();const served=new Set<string>();for(let i=0;i<2400;i++){s=updateGathering(s,.05,map,{elapsedSeconds:i*.05});for(const u of s.units)if(u.cargo>0)served.add(u.id);expect(s.node.remaining+s.wood+s.units.reduce((a,u)=>a+u.cargo,0)).toBeCloseTo(100,8);expect(s.node.remaining).toBeGreaterThanOrEqual(0);}expect(served.size).toBe(8);expect(s.node.remaining).toBe(0);expect(s.wood).toBeCloseTo(100);expect(s.units.every(u=>u.cargo===0&&u.order.kind==='idle')).toBe(true);});
it('new orders and dead workers leave service immediately; cancellation retains cargo',()=>{const s=fixture();s.units[0]={...(s.units[0] as Worker),selected:true,cargo:2};s.units=orderUnits(s.units,{x:300,y:400});s.units[1].hp=0;const services=resourceServices(s,map,0);expect(services.has('worker-1')).toBe(false);expect(services.has('worker-2')).toBe(false);expect(s.units[0].cargo).toBe(2);expect([...services.values()].filter(p=>p.working)).toHaveLength(3);});
it('service is derived identically after save/load and pause does not rotate it',()=>{let m=createMatch('skirmish');m.gathering.units=Array.from({length:8},(_,i)=>({...m.gathering.units[i%3],id:`unit-${i+1}`,position:{x:300+i*28,y:300}}));m.production.nextUnitNumber=9;m.soldierProduction.nextUnitNumber=9;m.waves.elapsedSeconds=7;m.gathering.units=m.gathering.units.map(u=>u.kind==='worker'?({...u,order:{kind:'gather',nodeId:m.gathering.node.id}}):u);m=updateMatch(m,.5);const saved=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(saved.ok).toBe(true);if(!saved.ok)return;expect(resourceServices(saved.match.gathering,saved.match.map,saved.match.waves.elapsedSeconds)).toEqual(resourceServices(m.gathering,m.map,m.waves.elapsedSeconds));expect(resourceServices(m.gathering,m.map,m.waves.elapsedSeconds).size).toBe(8);const resumed=updateMatch({...saved.match,paused:false},.05),continued=updateMatch(m,.05);expect(resumed.gathering.units.map(u=>[u.id,u.order,u.cargo])).toEqual(continued.gathering.units.map(u=>[u.id,u.order,u.cargo]));expect(resumed.gathering.node.remaining).toBeCloseTo(continued.gathering.node.remaining);for(let i=0;i<resumed.gathering.units.length;i++){const a=resumed.gathering.units[i],b=continued.gathering.units[i];expect(Math.hypot(a.position.x-b.position.x,a.position.y-b.position.y)).toBeLessThanOrEqual(10.4);}m.paused=true;expect(updateMatch(m,10)).toBe(m);});
it('delivery trips release service slots so the remaining gatherers can work',()=>{const s=fixture();s.units=s.units.map((u,i)=>u.kind==='worker'&&i<5?{...u,order:{kind:'deliver',nodeId:'wood'}}:u);const services=resourceServices(s,map,0);expect([...services.values()].some(p=>p.working)).toBe(false);expect(services.has('worker-6')).toBe(false);});
it('returning carriers cannot bypass the shared slot limit inside a large delta',()=>{const s=fixture();s.units=s.units.map((u,i)=>u.kind==='worker'&&i<5?{...u,position:{x:260,y:400},cargo:1,order:{kind:'deliver',nodeId:'wood'}}:u);const next=updateGathering(s,20,map,{elapsedSeconds:0});expect(next.wood).toBeGreaterThanOrEqual(5);expect(next.units.slice(0,5).every(u=>u.cargo===0&&u.order.kind==='gather')).toBe(true);});

it('separate wood and gold deposits admit independent cohorts with reachable distinct places',()=>{
 const s=fixture();s.gold={id:'gold',resource:'gold',position:{x:600,y:400},remaining:100};s.goldBalance=0;
 s.units.push(...s.units.map((u,i):Worker=>({...u as Worker,id:`gold-worker-${i+1}`,position:{x:520,y:200+i*25},target:{x:600,y:400},order:{kind:'gather',nodeId:'gold'}})));
 const services=resourceServices(s,map,0);
 for(const prefix of ['worker-','gold-worker-']){
  const cohort=[...services].filter(([id])=>id.startsWith(prefix));
  expect(cohort).toHaveLength(8);expect(cohort.filter(([,p])=>p.working)).toHaveLength(3);
  expect(new Set(cohort.map(([,p])=>`${p.point.x},${p.point.y}`)).size).toBe(8);
 }
 const placed={...s,units:s.units.map(u=>({...u,position:services.get(u.id)!.point}))};
 const next=updateGathering(placed,1,map,{elapsedSeconds:0});
 expect(next.node.remaining).toBe(97);expect(next.gold!.remaining).toBe(97);
 expect(next.units.filter(u=>u.cargo>0)).toHaveLength(6);
 expect(next.wood).toBe(0);expect(next.goldBalance).toBe(0);
});
it('an isolated worker waits without occupying a reachable worker’s service place',()=>{
 const s=fixture();s.units[0].position={x:100,y:100};
 const blocked={...map,revision:1,obstacles:[...map.obstacles,{x:150,y:0,width:32,height:600}]};
 const services=resourceServices(s,blocked,0);
 expect(services.get('worker-1')!.working).toBe(false);
 expect([...services.values()].filter(p=>p.working)).toHaveLength(3);
});

it('Save retains partial wood while changing trees, then resumes normal full-load deliveries',async()=>{
 const {approachRoute}=await import('./approach'),{resourceNodes}=await import('./gathering'),{syncForestObstacles}=await import('./forestTerrain');let m=createMatch('survival');
 const first=resourceNodes(m.gathering).find(n=>n.tree&&approachRoute(m.map,m.gathering.units[0].position,{x:n.position.x-16,y:n.position.y-16,width:32,height:32},24).status!=='blocked')!;
 first.remaining=1;const position=approachRoute(m.map,m.gathering.units[0].position,{x:first.position.x-16,y:first.position.y-16,width:32,height:32},24).destination;
 m.gathering.units=[{...m.gathering.units[0] as Worker,position,target:{...first.position},cargo:2,cargoType:'wood',order:{kind:'gather',nodeId:first.id},selected:true}];m.research!.workerTools=3;
 const before=m.gathering;m.gathering=updateGathering({...before,workerToolsLevel:3},.7,m.map);m.map=syncForestObstacles(before,m.gathering,m.map);
 const u=m.gathering.units[0];expect(u.cargo).toBeCloseTo(3);expect(u.order.kind).toBe('gather');expect(u.order).not.toEqual({kind:'gather',nodeId:first.id});
 const loaded=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(loaded.ok).toBe(true);if(!loaded.ok)return;
 expect(loaded.match.gathering.units[0]).toMatchObject({id:u.id,cargo:u.cargo,cargoType:'wood',order:u.order,target:u.target});expect(loaded.match.research!.workerTools).toBe(3);
 let resumed=loaded.match.gathering;const total=(s:GatheringState)=>s.wood+resourceNodes(s).filter(n=>(n.resource??'wood')==='wood').reduce((n,x)=>n+x.remaining,0)+s.units.reduce((n,x)=>n+x.cargo,0),initial=total(resumed),deliveries:number[]=[];
 for(let i=0;i<400;i++){const prev=resumed;resumed=updateGathering(resumed,.05,loaded.match.map,{elapsedSeconds:i*.05});if(prev.units[0].order.kind==='gather'&&resumed.units[0].order.kind==='deliver')deliveries.push(resumed.units[0].cargo);expect(total(resumed)).toBeCloseTo(initial,8);}
 expect(deliveries.length).toBeGreaterThan(0);expect(deliveries.every(n=>n===5)).toBe(true);expect(resumed.wood).toBeGreaterThanOrEqual(5);
});
