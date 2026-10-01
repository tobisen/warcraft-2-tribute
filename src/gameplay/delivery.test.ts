import { describe, expect, it } from 'vitest';
import { orderWorkers, updateGathering, type GatheringState, type Worker } from './gathering';
import { selectUnitsInRectangle } from './selection';

const worker = (cargo = 0): Worker => ({
  id: 'worker-1', position: { x: 24, y: 0 }, target: { x: 0, y: 0 },
  selected: true, cargo, order: { kind: 'gather', nodeId: 'wood' },
});
const state = (cargo = 0, remaining = 100): GatheringState => ({
  workers: [worker(cargo)], node: { id: 'wood', position: { x: 0, y: 0 }, remaining },
  base: { x: 208, y: 0 }, wood: 0,
});
const total = (s: GatheringState) => s.wood + s.node.remaining + s.workers.reduce((sum, w) => sum + w.cargo, 0);

describe('wood delivery loop', () => {
  it('loads five wood without crediting the balance, then delivers within base range', () => {
    const full = updateGathering(state(), 5);
    expect(full.workers[0].cargo).toBe(5);
    expect(full.workers[0].order.kind).toBe('deliver');
    expect(full.wood).toBe(0);
    const approaching = updateGathering(full, 0.5);
    expect(approaching.wood).toBe(0);
    expect(approaching.workers[0].cargo).toBe(5);
    const delivered = updateGathering(approaching, 0.5);
    expect(delivered.wood).toBe(5);
    expect(delivered.workers[0].cargo).toBe(0);
    expect(delivered.workers[0].position.x).toBe(184);
    expect(delivered.workers[0].order.kind).toBe('gather');
  });

  it('delivers partial cargo when depleted and then becomes idle', () => {
    const depleted = updateGathering(state(0, 2.5), 2.5);
    expect(depleted.node.remaining).toBe(0);
    expect(depleted.workers[0].cargo).toBe(2.5);
    expect(depleted.wood).toBe(0);
    const delivered = updateGathering(depleted, 1);
    expect(delivered.wood).toBe(2.5);
    expect(delivered.workers[0].cargo).toBe(0);
    expect(delivered.workers[0].order.kind).toBe('idle');
  });

  it.each([1, 14, 140])('returns and completes two trips across %s steps', steps => {
    let result = state();
    for (let i = 0; i < steps; i++) result = updateGathering(result, 14 / steps);
    expect(result.wood).toBeCloseTo(10, 9);
    expect(result.node.remaining).toBeCloseTo(90, 9);
    expect(result.workers[0].cargo).toBeCloseTo(0, 9);
    expect(total(result)).toBeCloseTo(100, 9);
  });

  it('move interrupts delivery and preserves cargo even after arrival', () => {
    const full = updateGathering(state(), 5);
    const commanded = { ...full, workers: orderWorkers(full.workers, { x: 400, y: 0 }) };
    const moved = updateGathering(commanded, 10);
    expect(moved.workers[0].cargo).toBe(5);
    expect(moved.workers[0].order.kind).toBe('idle');
    expect(moved.wood).toBe(0);
  });

  it('moving manually to the base does not implicitly deliver retained cargo', () => {
    const original = state(3);
    original.workers = orderWorkers(original.workers, original.base);
    const moved = updateGathering(original, 10);
    expect(moved.workers[0].cargo).toBe(3);
    expect(moved.workers[0].order.kind).toBe('idle');
    expect(moved.wood).toBe(0);
  });

  it('gather with full cargo delivers first, including when node is empty', () => {
    for (const remaining of [100, 0]) {
      const original = state(5, remaining);
      original.workers = orderWorkers(original.workers, original.node.position, original.node);
      expect(original.workers[0].order.kind).toBe('deliver');
      const result = updateGathering(original, 1);
      expect(result.wood).toBe(5);
      expect(result.node.remaining).toBe(remaining);
      expect(result.workers[0].cargo).toBe(0);
    }
  });

  it('partial cargo survives move and resumes gathering without overfilling', () => {
    const original = state(3);
    const moved = orderWorkers(original.workers, { x: 300, y: 0 });
    expect(moved[0].cargo).toBe(3);
    const resumed = orderWorkers(moved, original.node.position, original.node);
    const result = updateGathering({ ...original, workers: resumed }, 2);
    expect(result.workers[0].cargo).toBe(5);
    expect(result.node.remaining).toBe(98);
    expect(result.workers[0].order.kind).toBe('deliver');
  });

  it('deselection preserves the automatic loop', () => {
    const original = state();
    original.workers = selectUnitsInRectangle(original.workers, { x: 500, y: 500 }, { x: 600, y: 600 });
    expect(updateGathering(original, 14).wood).toBe(10);
  });

  it('conserves all wood through repeated multi-worker trips and final partial deliveries', () => {
    let result = state(0, 12.3);
    result.workers = [0, 1, 2].map(i => ({ ...worker(), id: `worker-${i}` }));
    for (let i = 0; i < 1000; i++) {
      result = updateGathering(result, 0.1);
      expect(result.workers.every(w => w.cargo >= 0 && w.cargo <= 5)).toBe(true);
      expect(result.node.remaining).toBeGreaterThanOrEqual(0);
      expect(total(result)).toBeCloseTo(12.3, 9);
    }
    expect(result.wood).toBeCloseTo(12.3, 9);
    expect(result.node.remaining).toBe(0);
    expect(result.workers.every(w => w.cargo === 0 && w.order.kind === 'idle')).toBe(true);
  });
});
