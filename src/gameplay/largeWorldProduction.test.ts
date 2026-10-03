import {expect,it} from 'vitest';
import {createMatch} from './match';
import {canStartProduction,soldierSpawn} from './production';
import {canEnqueue,enqueueProduction,updateQueuedProduction} from './productionQueue';
import {bodyFits} from './map';

it('remote barracks accepts paid production and spawns inside its actual large world',()=>{
 const m=createMatch('skirmish','normal',undefined,'highlands');
 const building={kind:'barracks' as const,footprint:{x:2816,y:192,width:64,height:64},bounds:m.map};
 const gathering={...m.gathering,wood:100,goldBalance:100};
 expect(canStartProduction(gathering,m.soldierProduction,building)).toBe(true);
 expect(canEnqueue(gathering,m.soldierProduction,building)).toBe(true);
 const started=enqueueProduction(gathering,m.soldierProduction,building);
 expect(started.gathering.wood).toBeLessThan(100);
 const done=updateQueuedProduction(started.gathering,started.production,20,building,{map:m.map,enemies:m.combat.enemies});
 const soldier=done.gathering.units.at(-1)!;
 expect(done.gathering.units).toHaveLength(gathering.units.length+1);
 expect(soldier.kind).toBe('soldier');expect(soldier.selected).toBe(false);
 expect(soldier.position.x).toBeGreaterThan(2700);expect(bodyFits(m.map,soldier.position,12)).toBe(true);
 expect(updateQueuedProduction(done.gathering,done.production,20,building,{map:m.map,enemies:m.combat.enemies}).gathering.units).toHaveLength(done.gathering.units.length);
});
it('spawn eligibility retains bounded-world rejection and checks every edge',()=>{
 const footprint={x:2816,y:192,width:64,height:64};
 expect(soldierSpawn(footprint)).toBeNull();
 expect(soldierSpawn(footprint,24,{width:3072,height:3072})).not.toBeNull();
 expect(soldierSpawn({x:0,y:0,width:64,height:64},24,{width:64,height:64})).toBeNull();
 const p=soldierSpawn({x:3008,y:3008,width:64,height:64},24,{width:3072,height:3072})!;
 expect(p.x-12).toBeGreaterThanOrEqual(0);expect(p.y-12).toBeGreaterThanOrEqual(0);
 expect(p.x+12).toBeLessThanOrEqual(3072);expect(p.y+12).toBeLessThanOrEqual(3072);
});
