import { createMap } from '../gameplay/map';
import { entityVisible,knownResource } from '../gameplay/visibility';
import type { Position } from '../gameplay/movement';
import type { Footprint } from '../gameplay/placement';
import type { MatchState } from '../gameplay/match';
import { baseFootprint } from '../gameplay/buildingSelection';
import { clampCamera } from './camera';
export interface MapSize {width:number;height:number}
export interface MinimapMarker {id:string;owner:'player'|'enemy'|'neutral';position:Position;footprint?:Footprint;color:string}
export type MinimapVisibility=(marker:MinimapMarker)=>boolean;
export const minimapSize={width:200,height:150};
export function worldToMinimap(point:Position,world:MapSize,size:MapSize=minimapSize):Position {
 return {x:Math.max(0,Math.min(size.width,point.x/world.width*size.width)),y:Math.max(0,Math.min(size.height,point.y/world.height*size.height))};
}
export function minimapToWorld(point:Position,world:MapSize,size:MapSize=minimapSize):Position {
 const bounded=worldToMinimap(point,size,world);return bounded;
}
export function minimapCamera(point:Position,world:MapSize,viewport:MapSize,size:MapSize=minimapSize):Position {
 const center=minimapToWorld(point,world,size);return clampCamera({x:center.x-viewport.width/2,y:center.y-viewport.height/2},world,viewport);
}
export function cameraIndicator(scroll:Position,world:MapSize,viewport:MapSize,size:MapSize=minimapSize):Footprint {
 const position=worldToMinimap(clampCamera(scroll,world,viewport),world,size);
 return {...position,width:Math.min(world.width,viewport.width)/world.width*size.width,height:Math.min(world.height,viewport.height)/world.height*size.height};
}
/** Fresh marker snapshots and an explicit visibility filter; no selection/order mutations. */
export function minimapData(state:MatchState,visible:MinimapVisibility=()=>true){
 const markers:MinimapMarker[]=[];
 const rect=(id:string,owner:MinimapMarker['owner'],footprint:Footprint,color:string)=>markers.push({id,owner,footprint:{...footprint},position:{x:footprint.x+footprint.width/2,y:footprint.y+footprint.height/2},color});
 rect('base','player',baseFootprint(state.gathering.base),'#5fa9df');
 if(state.placement.barracks)rect('barracks','player',state.placement.barracks,'#d09153');
 if(state.placement.forge)rect('forge','player',state.placement.forge.footprint,'#989ea8');
 for(const farm of state.placement.farms??[])rect(farm.id,'player',farm.footprint,'#80b65a');
 if(state.navy?.harbor)rect('harbor','player',state.navy.harbor.footprint,'#77c4cf');
 for(const ship of state.navy?.ships??[])markers.push({id:ship.id,owner:'player',position:{...ship.position},color:'#77c4cf'});
 for(const node of [state.gathering.node,state.gathering.gold])if(node)markers.push({id:node.id,owner:'neutral',position:{...node.position},color:node===state.gathering.node?'#b8894e':'#e0bf4d'});
 for(const unit of state.gathering.units)markers.push({id:unit.id,owner:'player',position:{...unit.position},color:'#9cda8f'});
 for(const enemy of state.combat.enemies)markers.push({id:enemy.id,owner:'enemy',position:{...enemy.position},...(enemy.footprint?{footprint:{...enemy.footprint}}:{}),color:'#f47c70'});
 return {world:{width:state.map.width,height:state.map.height},terrain:createMap(state.map.id).obstacles.map(o=>({...o})),markers:markers.filter(visible)};
}
export type MinimapData=ReturnType<typeof visibleMinimapData>;

export function visibleMinimapData(state:MatchState){
 const fog=state.fog;
 const data=minimapData(state,m=>!fog||m.owner==='player'||(m.owner==='enemy'?entityVisible(fog,'player',m):knownResource(fog,m.position)));
 return {...data,...(fog?{fog:{tileSize:fog.tileSize,columns:fog.columns,rows:fog.rows,visible:[...fog.teams.player.visible],explored:[...fog.teams.player.explored]}}:{})};
}
