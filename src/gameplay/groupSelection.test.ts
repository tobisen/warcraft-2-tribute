import { describe, expect, it } from 'vitest';
import {
  commandSelectedUnits, isSelectionDrag, selectionRectangle,
  selectUnitAt, selectUnitsInRectangle, type SelectableUnit,
} from './selection';
import { moveTowards } from './movement';

const units: SelectableUnit[] = [10, 20, 40].map((x, i) => ({
  id: `unit-${i}`, position: { x, y: 20 }, target: { x, y: 20 }, selected: false,
}));
const selectedIds = (items: SelectableUnit[]) => items.filter(u => u.selected).map(u => u.id);

describe('group selection', () => {
  it.each([
    [{ x: 10, y: 10 }, { x: 20, y: 20 }],
    [{ x: 20, y: 10 }, { x: 10, y: 20 }],
    [{ x: 10, y: 20 }, { x: 20, y: 10 }],
    [{ x: 20, y: 20 }, { x: 10, y: 10 }],
  ])('normalizes every drag direction and includes centers on edges', (start, end) => {
    expect(selectionRectangle(start, end)).toEqual({ x: 10, y: 10, width: 10, height: 10 });
    expect(selectedIds(selectUnitsInRectangle(units, start, end))).toEqual(['unit-0', 'unit-1']);
  });

  it('replaces existing selection, preserves targets and leaves inputs unchanged', () => {
    const previous = units.map(u => ({ ...u, selected: true }));
    const next = selectUnitsInRectangle(previous, { x: 35, y: 15 }, { x: 45, y: 25 });
    expect(selectedIds(next)).toEqual(['unit-2']);
    expect(next.map(u => u.target)).toEqual(previous.map(u => u.target));
    expect(selectedIds(previous)).toHaveLength(3);
  });

  it('an empty rectangle deselects every unit', () => {
    expect(selectedIds(selectUnitsInRectangle(units.map(u => ({ ...u, selected: true })),
      { x: 100, y: 100 }, { x: 200, y: 200 }))).toEqual([]);
  });

  it('uses centers rather than partially intersecting unit bodies', () => {
    expect(selectedIds(selectUnitsInRectangle(units, { x: 11, y: 19 }, { x: 19, y: 21 }))).toEqual([]);
  });

  it.each([
    [0, 0, false], [4.99, 0, false], [3, 3, false],
    [5, 0, true], [3, 4, true], [-5, 0, true], [0, -6, true],
  ])('screen displacement (%s,%s) has drag=%s', (x, y, expected) => {
    expect(isSelectionDrag({ x: 100, y: 100 }, { x: 100 + x, y: 100 + y })).toBe(expected);
  });

  it('click selects just the hit unit and empty ground clears all', () => {
    const clicked = selectUnitAt(units, { x: 40, y: 20 }, 8);
    expect(selectedIds(clicked)).toEqual(['unit-2']);
    expect(selectedIds(selectUnitAt(clicked, { x: 100, y: 100 }, 8))).toEqual([]);
  });

  it('overlapping click picks the last rendered unit only', () => {
    const overlapping = units.map(u => ({ ...u, position: { x: 10, y: 20 } }));
    expect(selectedIds(selectUnitAt(overlapping, { x: 10, y: 20 }, 8))).toEqual(['unit-2']);
  });

  it('commands only selected units and preserves movement after deselection', () => {
    const selected = selectUnitsInRectangle(units, { x: 0, y: 0 }, { x: 25, y: 25 });
    const target = { x: 100, y: 100 };
    const commanded = commandSelectedUnits(selected, target);
    expect(commanded.map(u => u.target)).toEqual([target, target, units[2].target]);
    const cleared = selectUnitsInRectangle(commanded, { x: 200, y: 200 }, { x: 300, y: 300 });
    const ignored = commandSelectedUnits(cleared, { x: 0, y: 0 });
    expect(ignored.map(u => u.target)).toEqual(commanded.map(u => u.target));
    expect(moveTowards(ignored[0].position, ignored[0].target, 160, 10)).toEqual(target);
    expect(units[0].target).toEqual({ x: 10, y: 20 });
  });
});
