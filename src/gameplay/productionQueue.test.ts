import { describe, expect, it } from 'vitest';
import { createMatch, updateMatch } from './match';
import { enqueueProduction, cancelProduction, updateQueuedProduction } from './productionQueue';
import { populationState } from './population';
import { spawnCandidates, unitBody } from './spawning';
import { baseFootprint } from './buildingSelection';
import { overlaps } from './map';
const ready=()=>{const s=createMatch();s.gathering.wood=200;s.gathering.goldBalance=50;return s;};
const population=(s:ReturnType<typeof createMatch>)=>populationState(s.gathering,s.placement,[s.production,s.soldierProduction]);
const enqueue=(s:ReturnType<typeof ready>)=>{const r=enqueueProduction(s.gathering,s.production,{kind:'base'},population(s));return {...s,gathering:r.gathering,production:r.production};};
describe('production FIFO and refunds',()=>{
  it('debits and reserves every accepted job, rejects queue limit and insufficient funds atomically',()=>{
    let s=ready();for(let i=0;i<3;i++)s=enqueue(s);
    expect(s.gathering.wood).toBe(140);expect(population(s).reserved).toBe(3);
    expect(s.production.queue!.map(j=>j.id)).toEqual(['base-job-1','base-job-2','base-job-3']);
    expect(enqueue(s).production).toBe(s.production);expect(enqueue(s).gathering).toBe(s.gathering);
    const poor=ready();poor.gathering.wood=19;expect(enqueue(poor).gathering).toBe(poor.gathering);
  });
  it.each([1,10,300])('completes FIFO exactly once over %s time steps',steps=>{
    let s=ready();for(let i=0;i<3;i++)s=enqueue(s);
    for(let i=0;i<steps;i++)s=updateMatch(s,15/steps);
    expect(s.gathering.units.map(u=>u.id)).toEqual(['unit-1','unit-2','unit-3','unit-4','unit-5','unit-6']);
    expect(s.production.queue).toEqual([]);expect(s.production.remainingSeconds).toBeNull();expect(population(s).reserved).toBe(0);
    expect(updateMatch(s,1).gathering.units).toHaveLength(6);
  });
  it('refunds a queued middle job fully and active job halfway exactly once, promoting the next full timer',()=>{
    let s=ready();for(let i=0;i<3;i++)s=enqueue(s);s=updateMatch(s,2);
    const middle=cancelProduction(s.gathering,s.production,'base-job-2');
    expect(middle.gathering.wood).toBe(160);expect(middle.production.remainingSeconds).toBe(3);
    const head=cancelProduction(middle.gathering,middle.production,'base-job-1');
    expect(head.gathering.wood).toBe(170);expect(head.production.remainingSeconds).toBe(5);
    expect(head.production.queue!.map(j=>j.id)).toEqual(['base-job-3']);
    expect(cancelProduction(head.gathering,head.production,'base-job-1').gathering).toBe(head.gathering);
    const next=enqueueProduction(head.gathering,head.production);expect(next.production.queue![1].id).toBe('base-job-4');
  });
  it('refunds stored gold and wood costs and keeps building job IDs distinct',()=>{
    const s=ready(),bar={kind:'barracks' as const,footprint:{x:512,y:384,width:64,height:64}};
    const a=enqueueProduction(s.gathering,s.soldierProduction,bar);const b=enqueueProduction(a.gathering,a.production,bar);
    const queued=cancelProduction(b.gathering,b.production,b.production.queue![1].id);
    expect(queued.gathering.wood).toBe(180);expect(queued.gathering.goldBalance).toBe(45);
    const active=cancelProduction(queued.gathering,queued.production,queued.production.queue![0].id);
    expect(active.gathering.wood).toBe(190);expect(active.gathering.goldBalance).toBe(47.5);
    expect(cancelProduction(active.gathering,active.production,'base-job-1').production).toBe(active.production);
  });
  it('runs independent queues concurrently with global unique unit IDs',()=>{
    let s=ready();s.placement.barracks={x:512,y:384,width:64,height:64};s.map.obstacles.push(s.placement.barracks);
    s=enqueue(enqueue(s));let bar=enqueueProduction(s.gathering,s.soldierProduction,{kind:'barracks',footprint:s.placement.barracks},population(s));
    s={...s,gathering:bar.gathering,soldierProduction:bar.production};
    expect(population(s).reserved).toBe(3);s=updateMatch(s,10);
    expect(new Set(s.gathering.units.map(u=>u.id)).size).toBe(6);expect(s.gathering.units).toHaveLength(6);
    expect(s.gathering.units.filter(u=>u.kind==='soldier')).toHaveLength(1);
  });
  it('keeps a blocked ready head, freezes later timers and releases all reservations on cancellation',()=>{
    let s=enqueue(enqueue(ready()));const candidates=spawnCandidates(s.map,baseFootprint(s.gathering.base),'base');
    s.gathering.units=candidates.map((position,i)=>({...s.gathering.units[0],id:`block-${i}`,position,selected:false}));
    const blocked=updateQueuedProduction(s.gathering,s.production,10,{kind:'base'},{map:s.map,enemies:[]});
    expect(blocked.production.remainingSeconds).toBe(0);expect(blocked.production.queue![1].remainingSeconds).toBe(5);
    expect(blocked.production.blockedSpawnKey).toBeTruthy();
    const freed={...blocked.gathering,units:blocked.gathering.units.filter(u=>!overlaps(unitBody(u.position,24),unitBody(candidates[0],24)))};
    const spawned=updateQueuedProduction(freed,blocked.production,0,{kind:'base'},{map:s.map,enemies:[]});
    expect(spawned.gathering.units).toHaveLength(freed.units.length+1);expect(spawned.production.remainingSeconds).toBe(5);
    const cancelled=cancelProduction(spawned.gathering,spawned.production,spawned.production.queue![0].id);
    expect(cancelled.production.queue).toEqual([]);expect(cancelled.production.remainingSeconds).toBeNull();
  });
  it('rejects enqueue/cancel after game over and resets IDs, timers and reservations',()=>{
    let s=enqueue(ready());const id=s.production.queue![0].id;
    expect(enqueueProduction(s.gathering,s.production,{kind:'base'},population(s),false).gathering).toBe(s.gathering);
    expect(cancelProduction(s.gathering,s.production,id,false).production).toBe(s.production);
    s.outcome='defeat';expect(updateMatch(s,20)).toBe(s);
    const reset=createMatch();expect(reset.production.queue).toBeUndefined();expect(population(reset).reserved).toBe(0);
    expect(enqueue({...reset,gathering:{...reset.gathering,wood:20}}).production.queue![0].id).toBe('base-job-1');
  });
});
