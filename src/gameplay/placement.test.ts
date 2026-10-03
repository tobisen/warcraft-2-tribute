import { describe, expect, it } from 'vitest';
import {
  barracksFootprint, beginPlacement, cancelPlacement, placeBarracks,
  placementError, placementObstacles, type PlacementState,
} from './placement';
import { gatheringConfig } from '../config/gathering';

const idle = (): PlacementState => ({ active: false, barracks: null });
const obstacles = placementObstacles({
  units: [], wood: 100, base: gatheringConfig.basePosition,
  node: { id: 'wood', position: gatheringConfig.nodePosition, remaining: 100 },
});

describe('barracks placement', () => {
  it.each([
    [0, 0, 0, 0], [31.9, 63.9, 0, 32], [32, 64, 32, 64], [-1, -1, -32, -32],
  ])('snaps (%s,%s) to top-left (%s,%s)', (x, y, sx, sy) => {
    expect(barracksFootprint({x,y})).toEqual({ x: sx, y: sy, width: 64, height: 64 });
  });

  it.each([{x:0,y:0}, {x:736,y:512}])('accepts fully in-world placement including edges: %j', point => {
    expect(placementError(beginPlacement(idle()), point, 40, obstacles)).toBeNull();
  });

  it.each([{x:-1,y:0}, {x:0,y:-1}, {x:1248,y:0}, {x:0,y:928}, {x:1280,y:960}])
    ('rejects crossing a world edge: %j', point => {
      expect(placementError(beginPlacement(idle()), point, 100, obstacles)).toBe('Outside the world');
    });

  it.each([{x:384,y:448}, {x:608,y:160}])('rejects base/node overlap: %j', point => {
    expect(placementError(beginPlacement(idle()), point, 100, obstacles)).toBe('Overlaps the base or a resource node');
  });

  it('uses centered base and node bounding-box footprints, including depleted node', () => {
    expect(obstacles).toEqual([
      {x:376,y:426,width:48,height:48}, {x:630,y:160,width:40,height:40},
    ]);
    expect(placementObstacles({units:[],wood:0,base:gatheringConfig.basePosition,
      node:{id:'wood',position:gatheringConfig.nodePosition,remaining:0}})).toEqual(obstacles);
  });

  it('allows edge contact without area overlap', () => {
    const custom = [{x:64,y:0,width:48,height:48}];
    expect(placementError(beginPlacement(idle()), {x:0,y:0}, 40, custom)).toBeNull();
    expect(placementError(beginPlacement(idle()), {x:32,y:0}, 40, custom)).not.toBeNull();
  });

  it('places once and charges exactly once', () => {
    const active = beginPlacement(idle());
    const placed = placeBarracks(active, {x:100,y:100}, 100, obstacles);
    expect(placed.wood).toBe(60);
    expect(placed.placement).toEqual({active:false,barracks:{x:96,y:96,width:64,height:64},barracksOwner:'player',barracksHP:120});
    expect(placeBarracks(placed.placement, {x:200,y:200}, placed.wood, obstacles)).toEqual(placed);
    expect(beginPlacement(placed.placement)).toEqual(placed.placement);
    expect(placeBarracks({...placed.placement,active:true}, {x:200,y:200}, 100, obstacles).wood).toBe(100);
    expect(active.barracks).toBeNull();
  });

  it.each([{x:-1,y:0}, {x:384,y:448}, {x:608,y:160}])('invalid place leaves state and funds unchanged: %j', point => {
    const active = beginPlacement(idle());
    expect(placeBarracks(active, point, 100, obstacles)).toEqual({placement:active,wood:100});
  });

  it('checks current balance at placement, including balance spent after entering mode', () => {
    const active = beginPlacement(idle());
    expect(placementError(active,{x:100,y:100},39.99,obstacles)).toBe('Not enough wood or gold');
    expect(placeBarracks(active,{x:100,y:100},39.99,obstacles)).toEqual({placement:active,wood:39.99});
    expect(placeBarracks(active,{x:100,y:100},40,obstacles).wood).toBe(0);
  });

  it('cancel is free and inactive modes cannot place', () => {
    const active = beginPlacement(idle());
    const cancelled = cancelPlacement(active);
    expect(cancelled).toEqual(idle());
    expect(placeBarracks(cancelled,{x:100,y:100},100,obstacles)).toEqual({placement:cancelled,wood:100});
    expect(active.active).toBe(true);
  });
});
