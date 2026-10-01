import { barracksConfig, worldConfig } from '../config/buildings';
import { gatheringConfig } from '../config/gathering';
import type { GatheringState } from './gathering';
import type { Position } from './movement';

export interface Footprint extends Position {
  width: number;
  height: number;
}
export interface PlacementState {
  active: boolean;
  barracks: Footprint | null;
}

export function barracksFootprint(point: Position): Footprint {
  const size = barracksConfig.tileSize * barracksConfig.footprintTiles;
  return {
    x: Math.floor(point.x / barracksConfig.tileSize) * barracksConfig.tileSize,
    y: Math.floor(point.y / barracksConfig.tileSize) * barracksConfig.tileSize,
    width: size, height: size,
  };
}

export function placementObstacles(state: GatheringState): Footprint[] {
  return [
    { x: state.base.x - gatheringConfig.baseSize / 2, y: state.base.y - gatheringConfig.baseSize / 2,
      width: gatheringConfig.baseSize, height: gatheringConfig.baseSize },
    { x: state.node.position.x - gatheringConfig.nodeRadius, y: state.node.position.y - gatheringConfig.nodeRadius,
      width: gatheringConfig.nodeRadius * 2, height: gatheringConfig.nodeRadius * 2 },
  ];
}

export function beginPlacement(state: PlacementState): PlacementState {
  return state.barracks ? state : { ...state, active: true };
}

export function cancelPlacement(state: PlacementState): PlacementState {
  return { ...state, active: false };
}

export function placementError(state: PlacementState, point: Position, wood: number, obstacles: Footprint[]): string | null {
  if (state.barracks) return 'En barracks finns redan';
  const rect = barracksFootprint(point);
  if (rect.x < 0 || rect.y < 0 || rect.x + rect.width > worldConfig.width || rect.y + rect.height > worldConfig.height) {
    return 'Utanför världen';
  }
  if (obstacles.some(other => rect.x < other.x + other.width && rect.x + rect.width > other.x
    && rect.y < other.y + other.height && rect.y + rect.height > other.y)) {
    return 'Överlappar bas eller resursnod';
  }
  if (wood < barracksConfig.cost) return 'Otillräckligt wood';
  return null;
}

export function placeBarracks(state: PlacementState, point: Position, wood: number, obstacles: Footprint[]) {
  if (!state.active || placementError(state, point, wood, obstacles)) return { placement: state, wood };
  return {
    placement: { active: false, barracks: barracksFootprint(point) },
    wood: wood - barracksConfig.cost,
  };
}
