import { describe, expect, it } from 'vitest';
import { worldConfig } from '../config/buildings';
import { soldierStats } from '../config/unit';
import { orderUnits, updateGathering, type GatheringState } from './gathering';
import { canStartProduction, soldierSpawn, startProduction, updateProduction, type ProductionBuilding, type ProductionState } from './production';
import { selectUnitAt, selectUnitsInRectangle } from './selection';

const state = (wood = 60): GatheringState => ({
  units: [{ kind: 'worker', id: 'unit-1', position: { x: 100, y: 100 }, target: { x: 100, y: 100 }, selected: true, cargo: 0, order: { kind: 'idle' } }],
  node: { id: 'wood', position: { x: 300, y: 100 }, remaining: 100 },
  base: { x: 400, y: 450 }, wood,
});
const idle = (): ProductionState => ({ remainingSeconds: null, nextUnitNumber: 2 });
const barracks: ProductionBuilding = { kind: 'barracks', footprint: { x: 96, y: 96, width: 64, height: 64 } };
const spawn = () => {
  const started = startProduction(state(), idle(), barracks);
  return updateProduction(started.gathering, started.production, 5, barracks);
};

describe('soldier production', () => {
  it('requires a placed barracks, sufficient funds and an idle building', () => {
    for (const [gathering, production, building] of [
      [state(), idle(), { kind: 'barracks', footprint: null }],
      [state(19.99), idle(), barracks],
      [state(), { ...idle(), remainingSeconds: 1 }, barracks],
    ] as [GatheringState, ProductionState, ProductionBuilding][]) {
      expect(canStartProduction(gathering, production, building)).toBe(false);
      expect(startProduction(gathering, production, building)).toEqual({ gathering, production });
    }
    const original = state(20);
    const started = startProduction(original, idle(), barracks);
    expect(started.gathering.wood).toBe(0);
    expect(started.gathering.units).toEqual(original.units);
    expect(started.production.remainingSeconds).toBe(5);
    expect(startProduction(started.gathering, started.production, barracks)).toEqual(started);
  });

  it('spawns exactly once after five seconds, idle with no cargo or selection', () => {
    let result = startProduction(state(), idle(), barracks);
    result = updateProduction(result.gathering, result.production, 0, barracks);
    result = updateProduction(result.gathering, result.production, 4.99, barracks);
    expect(result.gathering.units).toHaveLength(1);
    result = updateProduction(result.gathering, result.production, 0.01, barracks);
    expect(result.gathering.units.at(-1)).toMatchObject({ kind: 'soldier', selected: false, cargo: 0, order: { kind: 'idle' } });
    expect(updateProduction(result.gathering, result.production, 100, barracks).gathering.units).toHaveLength(2);
  });

  it.each([1, 10, 300])('produces the same result over %s time steps', steps => {
    let result = startProduction(state(), idle(), barracks);
    for (let i = 0; i < steps; i++) result = updateProduction(result.gathering, result.production, 5 / steps, barracks);
    expect(result).toEqual(spawn());
  });

  it('allows concurrent base/barracks jobs and repeated jobs with globally unique IDs', () => {
    const workerStart = startProduction(state(), idle());
    const soldierStart = startProduction(workerStart.gathering, idle(), barracks);
    expect(soldierStart.gathering.wood).toBe(20);
    const workerDone = updateProduction(soldierStart.gathering, workerStart.production, 5);
    const soldierDone = updateProduction(workerDone.gathering, soldierStart.production, 5, barracks);
    const nextStart = startProduction(soldierDone.gathering, soldierDone.production, barracks);
    const nextDone = updateProduction(nextStart.gathering, nextStart.production, 5, barracks);
    expect(nextDone.gathering.units.map(u => u.kind)).toEqual(['worker', 'worker', 'soldier', 'soldier']);
    expect(new Set(nextDone.gathering.units.map(u => u.id)).size).toBe(4);
    expect(nextDone.gathering.wood).toBe(0);
  });

  it.each([{ x: 0, y: 0 }, { x: 736, y: 0 }, { x: 0, y: 512 }, { x: 736, y: 512 }])('spawns outside edge footprint %j with the whole body inside the world', position => {
    const footprint = { ...position, width: 64, height: 64 };
    const p = soldierSpawn(footprint)!;
    const half = soldierStats.size / 2;
    expect(p).not.toBeNull();
    expect(p.x - half).toBeGreaterThanOrEqual(0);
    expect(p.y - half).toBeGreaterThanOrEqual(0);
    expect(p.x + half).toBeLessThanOrEqual(worldConfig.width);
    expect(p.y + half).toBeLessThanOrEqual(worldConfig.height);
    expect(p.x + half <= footprint.x || p.x - half >= footprint.x + footprint.width
      || p.y + half <= footprint.y || p.y - half >= footprint.y + footprint.height).toBe(true);
  });

  it('supports click/drag and movement while resource clicks preserve soldier orders', () => {
    let gathering = spawn().gathering;
    const soldier = gathering.units.at(-1)!;
    gathering.units = selectUnitAt(gathering.units, soldier.position, soldierStats.size);
    expect(gathering.units.filter(u => u.selected).map(u => u.id)).toEqual([soldier.id]);
    gathering.units = orderUnits(gathering.units, { x: 200, y: 200 });
    gathering = updateGathering(gathering, 1);
    expect(gathering.units.at(-1)!.position).toEqual({ x: 200, y: 200 });
    gathering.units = selectUnitsInRectangle(gathering.units, { x: 0, y: 0 }, { x: 400, y: 400 });
    gathering.units = orderUnits(gathering.units, { x: 700, y: 500 });
    const before = gathering.units.at(-1)!;
    gathering.units = orderUnits(gathering.units, gathering.node.position, gathering.node);
    expect(gathering.units[0].order.kind).toBe('gather');
    expect(gathering.units.at(-1)).toEqual(before);
    const soldierOnly = updateGathering({ ...gathering, units: [before] }, 20);
    expect(soldierOnly.node.remaining).toBe(100);
    expect(soldierOnly.wood).toBe(gathering.wood);
    expect(soldierOnly.units[0].cargo).toBe(0);
    expect(soldierOnly.units[0].order.kind).toBe('idle');
  });
});
