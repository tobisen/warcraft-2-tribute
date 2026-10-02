import { describe, expect, it } from 'vitest';
import { productionConfig } from '../config/production';
import { canStartProduction, startProduction, updateProduction, type ProductionState } from './production';
import { orderUnits, updateGathering, type GatheringState } from './gathering';
import { selectUnitAt, selectUnitsInRectangle } from './selection';

const state = (wood = 40): GatheringState => ({
  units: [1, 2, 3].map(i => ({
    kind: 'worker', id: `unit-${i}`, position: { x: 100 * i, y: 0 }, target: { x: 100 * i, y: 0 },
    selected: i === 1, cargo: 0, order: { kind: 'idle' },
  })),
  node: { id: 'wood', position: { x: 300, y: 100 }, remaining: 100 },
  base: { x: 100, y: 100 }, wood,
});
const production = (): ProductionState => ({ remainingSeconds: null, nextUnitNumber: 4 });

describe('worker production', () => {
  it('deducts cost immediately, exactly once, preserving units and selection', () => {
    const original = state();
    const started = startProduction(original, production());
    expect(started.gathering.wood).toBe(20);
    expect(started.gathering.units).toEqual(original.units);
    expect(started.production.remainingSeconds).toBe(5);
    const again = startProduction(started.gathering, started.production);
    expect(again).toEqual(started);
    expect(original.wood).toBe(40);
  });

  it.each([0, 19.99])('rejects insufficient wood=%s without changing state', wood => {
    const original = state(wood);
    const idle = production();
    expect(canStartProduction(original, idle)).toBe(false);
    expect(startProduction(original, idle)).toEqual({ gathering: original, production: idle });
  });

  it('allows exactly the required cost and blocks a busy base even with excess wood', () => {
    const started = startProduction(state(20), production());
    expect(started.gathering.wood).toBe(0);
    expect(canStartProduction(state(100), started.production)).toBe(false);
    expect(startProduction(state(100), started.production).gathering.wood).toBe(100);
  });

  it('does not spawn before completion or during zero delta, then spawns exactly once', () => {
    const started = startProduction(state(), production());
    const zero = updateProduction(started.gathering, started.production, 0);
    expect(zero.gathering.units).toHaveLength(3);
    const before = updateProduction(zero.gathering, zero.production, 4.999);
    expect(before.gathering.units).toHaveLength(3);
    const done = updateProduction(before.gathering, before.production, 0.001);
    expect(done.gathering.units).toHaveLength(4);
    expect(done.production.remainingSeconds).toBeNull();
    expect(updateProduction(done.gathering, done.production, 100).gathering.units).toHaveLength(4);
  });

  it.each([1, 10, 300])('equal gameplay time across %s steps gives the same spawn', steps => {
    let result = startProduction(state(), production());
    for (let i = 0; i < steps; i++) result = updateProduction(result.gathering, result.production, 5 / steps);
    expect(result.gathering.units).toHaveLength(4);
    expect(result.production.remainingSeconds).toBeNull();
    expect(result.gathering.wood).toBe(20);
  });

  it('spawns near the base with empty cargo, idle and unselected', () => {
    const started = startProduction(state(), production());
    const done = updateProduction(started.gathering, started.production, 6);
    const worker = done.gathering.units.at(-1)!;
    expect(worker).toEqual({
      kind: 'worker', owner:'player',hp:30, id: 'unit-4', position: { x: 160, y: 100 }, target: { x: 160, y: 100 },
      selected: false, cargo: 0, order: { kind: 'idle' },
    });
  });

  it('repeated production uses unique IDs and skips existing IDs', () => {
    const original = state();
    original.units[0].id = 'unit-4';
    let result = startProduction(original, production());
    result = updateProduction(result.gathering, result.production, 5);
    result = startProduction(result.gathering, result.production);
    result = updateProduction(result.gathering, result.production, 5);
    expect(result.gathering.units.slice(-2).map(w => w.id)).toEqual(['unit-5', 'unit-6']);
    expect(new Set(result.gathering.units.map(w => w.id)).size).toBe(5);
    expect(result.gathering.wood).toBe(0);
  });

  it('new worker supports click/drag selection, movement, gathering and delivery', () => {
    const started = startProduction(state(), production());
    let result = updateProduction(started.gathering, started.production, productionConfig.durationSeconds);
    const worker = result.gathering.units.at(-1)!;
    result.gathering.units = selectUnitAt(result.gathering.units, worker.position, 24);
    expect(result.gathering.units.filter(w => w.selected).map(w => w.id)).toEqual(['unit-4']);
    result.gathering.units = orderUnits(result.gathering.units, { x: 200, y: 100 });
    result.gathering = updateGathering(result.gathering, 1);
    expect(result.gathering.units.at(-1)!.position).toEqual({ x: 200, y: 100 });
    result.gathering.units = selectUnitsInRectangle(result.gathering.units, { x: 190, y: 90 }, { x: 210, y: 110 });
    result.gathering.units = orderUnits(result.gathering.units, result.gathering.node.position, result.gathering.node);
    result.gathering = updateGathering(result.gathering, 10);
    expect(result.gathering.wood).toBeGreaterThan(20);
    expect(result.gathering.node.remaining).toBeLessThan(100);
    expect(result.gathering.units.slice(0, 3).every(w => w.order.kind === 'idle')).toBe(true);
  });
});
