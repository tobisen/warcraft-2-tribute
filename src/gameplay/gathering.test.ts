import { describe, expect, it } from 'vitest';
import { gatheringConfig } from '../config/gathering';
import { orderUnits, updateGathering, isNodeHit, type GatheringState, type Worker } from './gathering';
import { selectUnitsInRectangle } from './selection';

const worker = (x = 0, selected = true): Worker => ({
  kind: 'worker', id: `worker-${x}`, position: { x, y: 0 }, target: { x: 0, y: 0 }, selected,
  order: { kind: 'gather', nodeId: 'wood' }, cargo: 0,
});
const state = (units = [worker()], remaining = 100): GatheringState => ({
  units, node: { id: 'wood', position: { x: 0, y: 0 }, remaining }, base: { x: 1000, y: 0 }, wood: 0,
});

describe('wood gathering', () => {
  it('does not collect until reaching the range', () => {
    const result = updateGathering(state([worker(184)]), 0.5);
    expect(result.wood).toBe(0);
    expect(result.node.remaining).toBe(100);
    expect(result.units[0].position.x).toBe(104);
  });

  it('collects at the 24 pixel boundary and not just outside it with delta zero', () => {
    expect(updateGathering(state([worker(24)]), 1).units[0].cargo).toBe(1);
    expect(updateGathering(state([worker(24.01)]), 0).wood).toBe(0);
  });

  it('collects only the part of a step after arriving in range', () => {
    const result = updateGathering(state([worker(184)]), 1.5);
    expect(result.units[0].position.x).toBe(24);
    expect(result.units[0].cargo).toBeCloseTo(0.5);
  });

  it.each([1, 10, 60])('collects the same amount across %s time steps including approach', steps => {
    let result = state([worker(184)]);
    for (let i = 0; i < steps; i++) result = updateGathering(result, 3 / steps);
    expect(result.units[0].cargo).toBeCloseTo(2, 10);
    expect(result.node.remaining).toBeCloseTo(98, 10);
  });

  it('gathers one wood per second for every worker', () => {
    const result = updateGathering(state([worker(0), worker(10), worker(20)]), 2.5);
    expect(result.units.reduce((sum, w) => sum + w.cargo, 0)).toBe(7.5);
    expect(result.node.remaining).toBe(92.5);
  });

  it('shares a limited amount without negative resources and starts final delivery', () => {
    const result = updateGathering(state([worker(0), worker(10), worker(1000)], 1.5), 2);
    expect(result.wood).toBe(0);
    expect(result.units.reduce((sum, w) => sum + w.cargo, 0)).toBe(1.5);
    expect(result.node.remaining).toBe(0);
    expect(result.units.filter(w => w.cargo > 0).every(w => w.order.kind === 'deliver')).toBe(true);
    expect(updateGathering(result, 10).wood).toBe(1.5);
  });

  it('loads exactly the node decrease and does not mutate the original state', () => {
    const original = state([worker(0), worker(10)], 0.7);
    original.wood = 5;
    const result = updateGathering(original, 0.5);
    expect(result.units.reduce((sum, w) => sum + w.cargo, 0)).toBeCloseTo(original.node.remaining - result.node.remaining);
    expect(result.wood).toBe(5);
    expect(original.node.remaining).toBe(0.7);
    expect(original.units[0].order.kind).toBe('gather');
  });

  it('move order cancels gathering for selected units only and becomes idle on arrival', () => {
    const original = state([worker(0), worker(10, false)]);
    original.units = orderUnits(original.units, { x: 160, y: 0 });
    expect(original.units.map(w => w.order.kind)).toEqual(['move', 'gather']);
    const result = updateGathering(original, 1);
    expect(result.wood).toBe(0);
    expect(result.units.at(-1)!.cargo).toBe(1);
    expect(result.units[0].position).toEqual({ x: 160, y: 0 });
    expect(result.units[0].order.kind).toBe('idle');
  });

  it('gather order targets the node and replaces a move order', () => {
    const original = state();
    const moved = orderUnits(original.units, { x: 500, y: 500 });
    const gathered = orderUnits(moved, { x: 10, y: 10 }, original.node);
    expect(gathered[0].order).toEqual({ kind: 'gather', nodeId: 'wood' });
    expect(gathered[0].target).toEqual(original.node.position);
  });

  it('deselection preserves gathering and rejects new move commands', () => {
    const original = state();
    const cleared = selectUnitsInRectangle(original.units, { x: 100, y: 100 }, { x: 200, y: 200 });
    const result = updateGathering({ ...original, units: orderUnits(cleared, { x: 500, y: 500 }) }, 1);
    expect(result.units[0].selected).toBe(false);
    expect(result.units[0].order.kind).toBe('gather');
    expect(result.wood).toBe(0);
    expect(result.units.at(-1)!.cargo).toBe(1);
  });

  it('commands to an exhausted node leave units idle', () => {
    const original = state([worker()], 0);
    expect(orderUnits(original.units, { x: 0, y: 0 }, original.node)[0].order.kind).toBe('idle');
  });

  it('hit-tests the visible node including its boundary', () => {
    const node = state().node;
    expect(isNodeHit({ x: gatheringConfig.nodeRadius, y: 0 }, node)).toBe(true);
    expect(isNodeHit({ x: gatheringConfig.nodeRadius + 1, y: 0 }, node)).toBe(false);
  });
});
