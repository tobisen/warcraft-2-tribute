import { gatheringConfig } from '../config/gathering';
import type { Position } from './movement';
import type { Footprint } from './placement';
import { selectUnitAt, type SelectableUnit } from './selection';

export type BuildingSelection = 'base' | 'barracks' | null;
export function baseFootprint(base: Position): Footprint {
  const size = gatheringConfig.baseSize;
  return { x:base.x-size/2, y:base.y-size/2, width:size, height:size };
}
export function selectPlayerTarget<T extends SelectableUnit>(units:T[], point:Position,
  base:Position, barracks:Footprint|null, size:number|((unit:T)=>number)): { units:T[]; building:BuildingSelection } {
  const selected = selectUnitAt(units, point, size);
  if (selected.some(u => u.selected)) return { units:selected, building:null };
  const hit = (r:Footprint) => point.x>=r.x && point.x<=r.x+r.width && point.y>=r.y && point.y<=r.y+r.height;
  return { units:selected, building:barracks && hit(barracks) ? 'barracks' : hit(baseFootprint(base)) ? 'base' : null };
}
export function allowsProduction(selected:BuildingSelection, kind:'base'|'barracks', exists:boolean, playing:boolean):boolean {
  return playing && exists && selected===kind;
}
