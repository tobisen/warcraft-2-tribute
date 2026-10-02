import {expect,it} from 'vitest';
import {separateBodies,type SeparationBody} from './separation';
import {bodyFits,type WorldMap} from './map';
import {createMatch,updateMatch} from './match';
import {encodeSave,decodeSave} from './save';
import {planRoute,segmentFits} from './navigation';
const map:WorldMap={width:800,height:600,tileSize:32,revision:0,obstacles:[]};
const bodies=(half=12):SeparationBody[]=>[{id:'a',position:{x:300,y:300},half},{id:'b',position:{x:300,y:300},half}];
function step(bs:SeparationBody[],dt:number,m=map){const p=separateBodies(m,bs,dt);return bs.map(b=>({...b,position:p.get(b.id)??b.position}));}
it('separates coincident bodies without changing input and bounds each correction by elapsed time',()=>{const bs=bodies(),before=structuredClone(bs),next=step(bs,.1);expect(bs).toEqual(before);for(const b of next)expect(Math.hypot(b.position.x-300,b.position.y-300)).toBeLessThanOrEqual(4.800001);expect(next[0].position).not.toEqual(next[1].position);expect(separateBodies(map,bs,0).size).toBe(0);expect(separateBodies(map,bs,-1).size).toBe(0);});
it('settles different body sizes and is stable under array permutation',()=>{const bs=bodies();bs[1].half=20;let normal=bs,reverse=[...bs].reverse();for(let i=0;i<20;i++){normal=step(normal,.05);reverse=step(reverse,.05);}expect(Object.fromEntries(normal.map(b=>[b.id,b.position]))).toEqual(Object.fromEntries(reverse.map(b=>[b.id,b.position])));const [a,b]=normal;expect(Math.max(Math.abs(a.position.x-b.position.x),Math.abs(a.position.y-b.position.y))).toBeGreaterThanOrEqual(32-1e-6);});
it('settles a pair equally across large/small timesteps, keeping separated bodies still',()=>{let small=bodies();for(let i=0;i<20;i++)small=step(small,.05);const large=step(bodies(),1);for(let i=0;i<2;i++){expect(small[i].position.x).toBeCloseTo(large[i].position.x);expect(small[i].position.y).toBeCloseTo(large[i].position.y);}expect(separateBodies(map,large,.1).size).toBe(0);});
it('never crosses terrain/world boundaries and uses the free axis in a narrow passage',()=>{const corridor={...map,obstacles:[{x:0,y:0,width:288,height:600},{x:320,y:0,width:480,height:600}]};let bs=bodies().map(b=>({...b,position:{x:304,y:300}}));for(let i=0;i<30;i++)bs=step(bs,.05,corridor);expect(bs.every(b=>bodyFits(corridor,b.position,b.half))).toBe(true);expect(Math.abs(bs[0].position.y-bs[1].position.y)).toBeGreaterThanOrEqual(24-1e-6);});
it('a crowded mixed group makes bounded progress in open ground without NaN',()=>{let bs=Array.from({length:20},(_,i)=>({id:`unit-${i}`,position:{x:300,y:300},half:i%5===0?20:12}));for(let i=0;i<120;i++)bs=step(bs,.05);expect(bs.every(b=>bodyFits(map,b.position,b.half))).toBe(true);let worst=0;for(let i=0;i<bs.length;i++)for(let j=i+1;j<bs.length;j++){const a=bs[i],b=bs[j],sum=a.half+b.half;worst=Math.max(worst,Math.min(sum-Math.abs(a.position.x-b.position.x),sum-Math.abs(a.position.y-b.position.y)));}expect(worst).toBeLessThan(.2);});
it('match keeps orders/cargo/selection and derives separation across pause/save/restart',()=>{let m=createMatch('skirmish');m.gathering.units[1]={...m.gathering.units[1],position:{...m.gathering.units[0].position}};m.gathering.units[0]={...m.gathering.units[0],kind:'worker',order:{kind:'idle'},cargo:3,selected:true};const moved=updateMatch(m,.1);expect(moved.gathering.units[0].cargo).toBe(3);expect(moved.gathering.units[0].selected).toBe(true);expect(moved.gathering.units[0].order.kind).toBe('idle');expect(moved.gathering.units[0].position).not.toEqual(moved.gathering.units[1].position);const result=decodeSave(encodeSave(moved,{camera:{x:0,y:0},building:null}));expect(result.ok).toBe(true);moved.paused=true;expect(updateMatch(moved,10)).toBe(moved);expect(createMatch('skirmish').gathering.units[0].position).toEqual({x:280,y:300});});
it('a corrected moving unit retains its clear next leg, while a displaced arrived route is invalidated',()=>{
 const m=createMatch('skirmish');m.enemyConstruction=undefined;const original=m.gathering.units[0];
 const target={x:600,y:300};const route={...planRoute(m.map,original.position,target),goalKey:'keep-clear-leg',commandNumber:42};
 m.gathering.units[0]={...original,target,order:{kind:'move'},navigation:route};
 m.gathering.units[1]={...m.gathering.units[1],position:{...original.position},target:{...original.position},order:{kind:'idle'},navigation:{...planRoute(m.map,original.position,original.position),goalKey:'displaced-arrival'}};
 const next=updateMatch(m,.05),moving=next.gathering.units[0],idle=next.gathering.units[1];
 expect(moving.navigation?.goalKey).toBe('keep-clear-leg');expect(moving.navigation?.commandNumber).toBe(42);expect(moving.order.kind).toBe('move');
 expect(segmentFits(next.map,moving.position,moving.navigation!.waypoints[0],12)).toBe(true);
 expect(idle.position).not.toEqual(original.position);expect(idle.navigation).toBeUndefined();expect(idle.order.kind).toBe('idle');
});
