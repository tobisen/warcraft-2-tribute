import { describe, expect, it } from 'vitest';
import { createMatch, updateMatch } from './match';
import { cleanDestroyed } from './destruction';
import { playerTargets } from './targets';
import { enqueueProduction } from './productionQueue';
import { populationState } from './population';
import { commandMappedMove } from './navigation';
const ready=()=>{
  const s=createMatch();s.gathering.wood=100;s.gathering.goldBalance=20;
  s.placement.barracks={x:512,y:384,width:64,height:64};s.placement.barracksHP=120;s.placement.barracksOwner='player';
  s.placement.farms=[{id:'farm-1',owner:'player',hp:80,footprint:{x:256,y:384,width:64,height:64},construction:{remainingSeconds:0,builderId:null}}];
  s.map.obstacles.push(s.placement.barracks,s.placement.farms[0].footprint);return s;
};
describe('HP, targeting and destruction cleanup',()=>{
  it.each(['wood','gold'] as const)('worker death loses cargo once and pauses its build for %s',type=>{
    let s=ready();const u=s.gathering.units[0];if(u.kind!=='worker')throw Error();
    u.cargo=3;u.cargoType=type;u.hp=0;u.order={kind:'build',buildingId:'barracks'};
    s.placement.construction={remainingSeconds:3,builderId:u.id};
    s=cleanDestroyed(s);expect(s.gathering.units.some(w=>w.id===u.id)).toBe(false);
    expect(s.gathering.lostCargo![type]).toBe(3);expect(cleanDestroyed(s).gathering.lostCargo![type]).toBe(3);
    expect(s.placement.construction).toEqual({remainingSeconds:3,builderId:null});
    expect(updateMatch(s,1).placement.construction!.remainingSeconds).toBe(3);
  });
  it('allows enemies to kill a loaded worker using reachable melee and clears pursuit references',()=>{
    let s=createMatch();const worker=s.gathering.units[0];if(worker.kind!=='worker')throw Error();s.gathering.units=[{...worker,position:{x:300,y:300},target:{x:300,y:300},hp:1,cargo:2}];
    s.combat.enemies=[{id:'enemy',owner:'enemy',position:{x:340,y:300},hp:36}];
    s=updateMatch(s,1);expect(s.gathering.units).toEqual([]);expect(s.gathering.lostCargo!.wood).toBe(2);
    expect(s.combat.enemies[0].navigation).toBeUndefined();expect(s.combat.baseHP).toBe(240);
  });
  it('destroys a building with queue without spawn/refund and cleans rally, orders, reservation and footprint',()=>{
    let s=ready();const b={kind:'barracks' as const,footprint:s.placement.barracks};
    const a=enqueueProduction(s.gathering,s.soldierProduction,b),c=enqueueProduction(a.gathering,a.production,b);
    s={...s,gathering:c.gathering,soldierProduction:{...c.production,rally:{x:700,y:300},remainingSeconds:.01}};
    s.gathering.units[0].order={kind:'build',buildingId:'barracks'};s.placement.barracksHP=1;
    s.combat.enemies=[{id:'enemy',owner:'enemy',position:{x:600,y:416},hp:36}];
    const funds={wood:s.gathering.wood,gold:s.gathering.goldBalance};s=updateMatch(s,1);
    expect(s.placement.barracks).toBeNull();expect(s.soldierProduction.queue).toEqual([]);expect(s.soldierProduction.rally).toBeUndefined();
    expect(s.gathering.units.filter(u=>u.kind==='soldier')).toEqual([]);expect(s.gathering.units[0].order.kind).toBe('idle');
    expect({wood:s.gathering.wood,gold:s.gathering.goldBalance}).toEqual(funds);expect(s.map.revision).toBe(1);
    expect(s.soldierProduction.nextJobNumber).toBe(3);expect(populationState(s.gathering,s.placement,[s.production,s.soldierProduction]).reserved).toBe(0);
  });
  it('removes farm/project targets exactly once, reduces cap and opens blocked navigation',()=>{
    let s=ready();const rect=s.placement.farms![0].footprint;
    s.gathering.units[0].selected=true;s.gathering.units=commandMappedMove(s.gathering.units,{x:rect.x+32,y:rect.y+32},s.map);
    expect(s.gathering.units[0].navigation!.status).toBe('blocked');
    s.placement.farms![0].hp=0;s=cleanDestroyed(s);expect(s.placement.farms).toEqual([]);
    expect(s.map.obstacles).not.toContainEqual(rect);expect(s.map.revision).toBe(1);expect(cleanDestroyed(s).map.revision).toBe(1);
    expect(populationState(s.gathering,s.placement,[s.production,s.soldierProduction]).cap).toBe(8);
    s=updateMatch(s,1);expect(s.gathering.units[0].position).toEqual({x:288,y:416});
  });
  it('destroys an unfinished project and stops the builder without refund or completion',()=>{
    let s=ready();s.placement.construction={remainingSeconds:4,builderId:'unit-1'};s.placement.barracksHP=0;
    s.gathering.units[0].order={kind:'build',buildingId:'barracks'};s=updateMatch(s,1);
    expect(s.placement.construction).toBeUndefined();expect(s.gathering.units[0].order.kind).toBe('idle');expect(s.gathering.wood).toBe(100);
  });
  it('lets an enemy destroy a farm project and clears its builder without adding supply',()=>{
    let s=ready();s.placement.farms![0].hp=1;s.placement.farms![0].construction={remainingSeconds:3,builderId:'unit-1'};
    s.gathering.units[0].order={kind:'build',buildingId:'farm-1'};
    s.combat.enemies=[{id:'enemy',owner:'enemy',position:{x:240,y:416},hp:36}];s=updateMatch(s,1);
    expect(s.placement.farms).toEqual([]);expect(s.gathering.units[0].order.kind).toBe('idle');
    expect(s.combat.enemies[0].navigation).toBeUndefined();expect(s.map.revision).toBe(1);
    expect(populationState(s.gathering,s.placement,[s.production,s.soldierProduction]).cap).toBe(8);
  });
  it('base death cancels all producers before they can spawn and keeps defeat precedence',()=>{
    let s=ready();const w=enqueueProduction(s.gathering,s.production);s={...s,gathering:w.gathering,production:{...w.production,remainingSeconds:0}};
    s.combat.baseHP=0;s.waves.nextWave=3;s.combat.enemies=[];s=updateMatch(s,1);
    expect(s.outcome).toBe('defeat');expect(s.gathering.units).toHaveLength(3);expect(s.production.queue).toEqual([]);
    expect(s.map.revision).toBe(1);expect(updateMatch(s,20)).toBe(s);
    const fresh=createMatch();expect(fresh.gathering.lostCargo).toEqual({wood:0,gold:0});expect(fresh.gathering.units.every(u=>u.hp===30&&u.owner==='player')).toBe(true);
    expect(playerTargets(fresh.gathering,fresh.combat,fresh.placement).map(t=>t.id)).toEqual(['unit-1','unit-2','unit-3','base']);
  });
});
