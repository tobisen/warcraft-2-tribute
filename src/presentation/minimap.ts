import type {BossId} from '../config/bosses';
import {isExplored} from '../gameplay/fog';
import {bossEnemies,bossLootPosition} from '../gameplay/bosses';
import {visibleDiscoveries} from './discoveries';
import {forestVisuals} from './forestVisuals';
import {terrainPatches} from '../gameplay/map';
import {isAir} from '../gameplay/domains';
import {resourceNodes} from '../gameplay/gathering';
import { createMap } from '../gameplay/map';
import { entityPresented,knownResource } from '../gameplay/visibility';
import type { Position } from '../gameplay/movement';
import type { Footprint } from '../gameplay/placement';
import type { MatchState } from '../gameplay/match';
import { baseFootprint } from '../gameplay/buildingSelection';
import { clampCamera } from './camera';
export interface MapSize {width:number;height:number}
export interface MinimapMarker {id:string;boss?:string;owner:'player'|'enemy'|'neutral';position:Position;footprint?:Footprint;color:string}
export type MinimapVisibility=(marker:MinimapMarker)=>boolean;
export const minimapSize={width:160,height:160};
/** Fit the map without stretching; the surrounding canvas is a square overview. */
export function minimapContent(world:MapSize,size:MapSize=minimapSize){
 const scale=Math.min(size.width/world.width,size.height/world.height),width=world.width*scale,height=world.height*scale;
 return {x:(size.width-width)/2,y:(size.height-height)/2,width,height};
}
export function worldToMinimap(point:Position,world:MapSize,size:MapSize=minimapSize):Position {
 const area=minimapContent(world,size);
 return {x:area.x+Math.max(0,Math.min(world.width,point.x))/world.width*area.width,y:area.y+Math.max(0,Math.min(world.height,point.y))/world.height*area.height};
}
export function minimapToWorld(point:Position,world:MapSize,size:MapSize=minimapSize):Position {
 const area=minimapContent(world,size);
 return {x:Math.max(0,Math.min(world.width,(point.x-area.x)/area.width*world.width)),y:Math.max(0,Math.min(world.height,(point.y-area.y)/area.height*world.height))};
}
export function minimapCamera(point:Position,world:MapSize,viewport:MapSize,size:MapSize=minimapSize):Position {
 const center=minimapToWorld(point,world,size);return clampCamera({x:center.x-viewport.width/2,y:center.y-viewport.height/2},world,viewport);
}
export function cameraIndicator(scroll:Position,world:MapSize,viewport:MapSize,size:MapSize=minimapSize):Footprint {
 const position=worldToMinimap(clampCamera(scroll,world,viewport),world,size);
 return {...position,width:Math.min(world.width,viewport.width)/world.width*minimapContent(world,size).width,height:Math.min(world.height,viewport.height)/world.height*minimapContent(world,size).height};
}
/** Fresh marker snapshots and an explicit visibility filter; no selection/order mutations. */
export function minimapData(state:MatchState,visible:MinimapVisibility=()=>true){
 const markers:MinimapMarker[]=[];
 const rect=(id:string,owner:MinimapMarker['owner'],footprint:Footprint,color:string)=>markers.push({id,owner,footprint:{...footprint},position:{x:footprint.x+footprint.width/2,y:footprint.y+footprint.height/2},color});
 if(state.combat.baseHP>0)rect('base','player',baseFootprint(state.gathering.base),'#5fa9df');
 for(const b of state.placement.bases??[])rect(b.id,'player',b.footprint,'#5fa9df');
 if(state.placement.barracks)rect('barracks','player',state.placement.barracks,'#d09153');
 if(state.placement.siegeWorks)rect('siegeWorks','player',state.placement.siegeWorks.footprint,'#cbbb82');
 if(state.placement.aviary)rect('aviary','player',state.placement.aviary.footprint,'#cbbb82');
 if(state.placement.stable)rect('stable','player',state.placement.stable.footprint,'#cbbb82');
 if(state.placement.academy)rect('academy','player',state.placement.academy.footprint,'#cbbb82');
 if(state.placement.forge)rect('forge','player',state.placement.forge.footprint,'#989ea8');
 for(const t of state.placement.defenses??[])rect(t.id,t.owner,t.footprint,'#d09153');
 for(const farm of state.placement.farms??[])rect(farm.id,'player',farm.footprint,'#80b65a');
 if(state.navy?.harbor)rect('harbor','player',state.navy.harbor.footprint,'#77c4cf');
 for(const ship of state.navy?.ships??[])markers.push({id:ship.id,owner:'player',position:{...ship.position},color:'#77c4cf'});
 for(const node of resourceNodes(state.gathering))if(node)markers.push({id:node.id,owner:'neutral',position:{...node.position},color:(node.resource??'wood')==='wood'?'#b8894e':'#e0bf4d'});
 for(const unit of state.gathering.units)markers.push({id:unit.id,owner:'player',position:{...unit.position},color:isAir(unit)?'#86dbe6':'#9cda8f'});
 for(const enemy of [...state.combat.enemies,...bossEnemies(state)])markers.push({id:enemy.id,...(enemy.boss?{boss:enemy.boss}:{}),owner:'enemy',position:{...enemy.position},...(enemy.footprint?{footprint:{...enemy.footprint}}:{}),color:enemy.boss||enemy.seaMonster?'#e6c16e':state.multiplePlayers?.roster.find(p=>p.id===enemy.playerId)?.color??(isAir(enemy)?'#edb0e9':'#f47c70')});
 const scenery=state.map.terrainLayout==='reference'?[...terrainPatches(state.map).map(p=>({x:p.column*32,y:p.row*32,width:p.columns*32,height:p.rows*32,color:p.kind==='water'?'#30667f':'#787d78'})),...(state.fog?forestVisuals(state.gathering,state.fog).filter(c=>c.frame!=='stump').map(c=>({x:c.x-16,y:c.y-32,width:32,height:32,color:'#173d2a'})):[])]:[];
 return {scenery,world:{width:state.map.width,height:state.map.height},terrain:createMap(state.map.id,state.map.terrainLayout??'legacy',state.map.resourceLayout??'groves',state.map.worldLayout??'original',state.map.design).obstacles.map(o=>({...o})),markers:markers.filter(visible).map(marker=>state.multiplePlayers&&marker.owner==='player'?{...marker,color:state.multiplePlayers.roster[0].color}:marker)};
}
export type MinimapData=ReturnType<typeof visibleMinimapData>;

export function visibleMinimapData(state:MatchState){
 const fog=state.fog;
 const data=minimapData(state,m=>!fog||m.owner==='player'||(m.owner==='enemy'?entityPresented(fog,'player',m):knownResource(fog,m.position)));
 for(const [id,v]of Object.entries(state.bosses?.guardians??{})){const position=bossLootPosition(id as BossId);if(v.hp<=0&&(!fog||isExplored(fog,'player',position)))data.markers.push({id:`boss-loot-${id}`,owner:'neutral',position,color:v.claimed?'#82775b':'#ebc863'});}
 data.markers.push(...visibleDiscoveries(state).map(d=>({id:d.id,owner:'neutral' as const,position:d.position,color:d.opened?'#82775b':'#ebc863'})));
 return {...data,...(fog?{fog:{tileSize:fog.tileSize,columns:fog.columns,rows:fog.rows,visible:[...fog.teams.player.visible],explored:[...fog.teams.player.explored]}}:{})};
}
