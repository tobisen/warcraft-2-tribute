import type { Position } from './movement';

export interface CommandState {
  selected: boolean;
  target: Position;
}

export function selectAt(
  state: CommandState,
  click: Position,
  unitPosition: Position,
  unitSize: number,
): CommandState {
  return {
    ...state,
    selected: Math.abs(click.x - unitPosition.x) <= unitSize / 2
      && Math.abs(click.y - unitPosition.y) <= unitSize / 2,
  };
}

export function commandMove(state: CommandState, target: Position): CommandState {
  return state.selected ? { ...state, target: { ...target } } : state;
}

export interface SelectableUnit extends CommandState {
  id: string;
  position: Position;
}

export function selectionRectangle(start: Position, end: Position) {
  return {
    x: Math.min(start.x, end.x), y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x), height: Math.abs(end.y - start.y),
  };
}

/** Screen positions are CSS/client pixels, independent of canvas scaling. */
export function isSelectionDrag(start: Position, end: Position): boolean {
  return Math.hypot(end.x - start.x, end.y - start.y) >= 5;
}

export function selectUnitsInRectangle<T extends SelectableUnit>(units: T[], start: Position, end: Position): T[] {
  const rect = selectionRectangle(start, end);
  return units.map(unit => ({
    ...unit,
    selected: unit.position.x >= rect.x && unit.position.x <= rect.x + rect.width
      && unit.position.y >= rect.y && unit.position.y <= rect.y + rect.height,
  }));
}

export function selectUnitAt<T extends SelectableUnit>(units: T[], click: Position, size: number): T[] {
  // Last rendered unit wins when placeholders overlap.
  const hit = [...units].reverse().find(unit => selectAt(unit, click, unit.position, size).selected);
  return units.map(unit => ({ ...unit, selected: unit.id === hit?.id }));
}

export function commandSelectedUnits(units: SelectableUnit[], target: Position): SelectableUnit[] {
  return units.map(unit => ({ ...unit, ...commandMove(unit, target) }));
}
