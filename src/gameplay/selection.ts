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
