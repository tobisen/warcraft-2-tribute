import { describe, expect, it } from 'vitest';
import { moveTowards } from './movement';
import { commandMove, selectAt, type CommandState } from './selection';

const position = { x: 400, y: 300 };
const initial: CommandState = { selected: false, target: position };

describe('click selection and commands', () => {
  it.each([{ x: 400, y: 300 }, { x: 388, y: 288 }, { x: 412, y: 312 }])
    ('selects a hit on the square including its edges: %j', click => {
      expect(selectAt(initial, click, position, 24).selected).toBe(true);
      expect(initial.selected).toBe(false);
    });

  it.each([{ x: 413, y: 300 }, { x: 400, y: 313 }, { x: 100, y: 100 }])
    ('deselects on empty ground: %j', click => {
      expect(selectAt({ ...initial, selected: true }, click, position, 24).selected).toBe(false);
    });

  it('rejects move commands while unselected', () => {
    expect(commandMove(initial, { x: 700, y: 300 })).toEqual(initial);
  });

  it('accepts and replaces move commands while selected', () => {
    const selected = selectAt(initial, position, position, 24);
    const moving = commandMove(selected, { x: 700, y: 300 });
    expect(moving.target).toEqual({ x: 700, y: 300 });
    expect(commandMove(moving, { x: 200, y: 150 }).target).toEqual({ x: 200, y: 150 });
  });

  it('preserves an existing order and movement after deselection', () => {
    const moving = commandMove({ ...initial, selected: true }, { x: 700, y: 300 });
    const deselected = selectAt(moving, { x: 100, y: 100 }, position, 24);
    expect(deselected.selected).toBe(false);
    expect(deselected.target).toEqual(moving.target);
    const ignored = commandMove(deselected, { x: 200, y: 150 });
    expect(ignored.target).toEqual(moving.target);
    expect(moveTowards(position, ignored.target, 160, 0.5)).toEqual({ x: 480, y: 300 });
  });

  it('hit-tests the current unit position after movement', () => {
    const moved = { x: 600, y: 300 };
    expect(selectAt(initial, position, moved, 24).selected).toBe(false);
    expect(selectAt(initial, moved, moved, 24).selected).toBe(true);
  });
});
