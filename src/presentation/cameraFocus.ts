import {inspectedBuilding} from '../gameplay/buildingInspection';
import type {MatchState} from '../gameplay/match';
import type {BuildingSelection} from '../gameplay/buildingSelection';
import type {Position} from '../gameplay/movement';
import {clampCamera} from './camera';
import {gameplayKeyAllowed,type KeyContext} from './keyboard';
export function cameraShortcut(key:string,context:KeyContext&{ctrlKey?:boolean;metaKey?:boolean}):'selection'|'base'|null {
 if(!gameplayKeyAllowed(context)||context.ctrlKey||context.metaKey)return null;return key===' '?'selection':key==='Home'?'base':null;
}
export function cameraFocus(points:readonly Position[],world:{width:number;height:number},viewport:{width:number;height:number}):Position|null {
 if(!points.length)return null;const x=(Math.min(...points.map(p=>p.x))+Math.max(...points.map(p=>p.x)))/2,y=(Math.min(...points.map(p=>p.y))+Math.max(...points.map(p=>p.y)))/2;return clampCamera({x:x-viewport.width/2,y:y-viewport.height/2},world,viewport);
}
export function selectionFocusPoints(m:MatchState,building:BuildingSelection):Position[]{
 const points=[...m.gathering.units,...(m.navy?.ships??[])].filter(u=>u.selected).map(u=>({...u.position}));if(points.length)return points;
 const footprint=inspectedBuilding(m,building)?.footprint;return footprint?[{x:footprint.x+footprint.width/2,y:footprint.y+footprint.height/2}]:[];
}
