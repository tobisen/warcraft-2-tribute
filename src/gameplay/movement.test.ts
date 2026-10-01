import { describe, expect, it } from 'vitest';
import { moveTowards, type Position } from './movement';

describe('moveTowards', () => {
  it('moves diagonally in the target direction at pixels per second', () => {
    const start = { x: 10, y: 20 };
    const result = moveTowards(start, { x: 310, y: 420 }, 100, 0.5);
    expect(result.x).toBeCloseTo(40);
    expect(result.y).toBeCloseTo(60);
    expect(Math.hypot(result.x - start.x, result.y - start.y)).toBeCloseTo(50);
    expect(start).toEqual({ x: 10, y: 20 });
  });

  it('moves towards smaller coordinates as well', () => {
    expect(moveTowards({ x: 20, y: 30 }, { x: -80, y: 30 }, 40, 0.5))
      .toEqual({ x: 0, y: 30 });
  });

  it.each([1, 10])('stops exactly at the target with delta=%s without overshoot', delta => {
    const target = { x: 30, y: 40 };
    const result = moveTowards({ x: 0, y: 0 }, target, 50, delta);
    expect(result).toEqual(target);
    expect(moveTowards(result, target, 50, delta)).toEqual(target);
  });

  it('handles identical start and target without division by zero', () => {
    expect(moveTowards({ x: 7, y: 9 }, { x: 7, y: 9 }, 160, 1))
      .toEqual({ x: 7, y: 9 });
  });

  it('does not move when delta is zero', () => {
    expect(moveTowards({ x: 7, y: 9 }, { x: 20, y: 30 }, 160, 0))
      .toEqual({ x: 7, y: 9 });
  });

  it.each([0.5, 5])('equivalent elapsed time (%s seconds) gives equivalent movement', duration => {
    const start = { x: 10, y: 20 };
    const target = { x: 310, y: 420 };
    const advance = (steps: number): Position => {
      let position = start;
      for (let i = 0; i < steps; i++) {
        position = moveTowards(position, target, 160, duration / steps);
      }
      return position;
    };
    const singleStep = advance(1);
    for (const steps of [10, 30, 60]) {
      const result = advance(steps);
      expect(result.x).toBeCloseTo(singleStep.x, 9);
      expect(result.y).toBeCloseTo(singleStep.y, 9);
    }
  });

  it('uses the replacement target on the next movement step', () => {
    const position = moveTowards({ x: 0, y: 0 }, { x: 100, y: 0 }, 100, 0.5);
    expect(moveTowards(position, { x: 50, y: 100 }, 100, 0.5))
      .toEqual({ x: 50, y: 50 });
  });
});
