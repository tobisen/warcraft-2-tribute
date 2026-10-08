import {defenseConfig} from '../config/defenses';
import {maps,type MapId} from '../config/maps';
import {factions,type FactionId} from '../config/factions';
import { arenaConfig } from '../config/arena';
import {buildingArtConfig} from '../config/buildingArt';
import {combatConfig} from '../config/combat';
import {forgeConfig} from '../config/upgrades';
import {navyConfig} from '../config/navy';
import {worldConfig} from '../config/buildings';
export function terrainFrame(column:number,row:number,mapId:MapId='arena'):'grass-a'|'grass-b'|'grass-c'|'grass-d'|'rock'|'water' {
 const patch=maps[mapId].terrain.find(p=>column>=p.column&&column<p.column+p.columns&&row>=p.row&&row<p.row+p.rows);
 if(patch)return patch.kind;
 // Sparse coordinate variation, shared background; no alternating checkerboard.
 let hash=Math.imul(column+17,73856093)^Math.imul(row+31,19349663);
 hash=Math.imul(hash^(hash>>>16),2246822519);hash^=hash>>>13;
 return (['grass-a','grass-b','grass-c','grass-d'] as const)[(hash>>>0)%4];
}
export function terrainImageFrame(column:number,row:number,mapId:MapId='arena'):string {
 const frame=terrainFrame(column,row,mapId);
 if(frame==='rock'&&mapId==='forest')return 'forest-rock';
 return frame==='water'&&(column*3+row*5)%7<3?'water-b':frame;
}
export function resourceFrame(type:'wood'|'gold',remaining:number,visible:boolean):string{return `${type}-${visible&&remaining<=0?'depleted':'available'}`;}
export const resourceOrigin={x:.5,y:.625};

/** Neighbors outside the world continue the tile: never invent a shoreline there. */
export function terrainEdges(column:number,row:number,mapId:MapId='arena'):string[]{
 const kind=terrainFrame(column,row,mapId);if(kind!=='water'&&kind!=='rock')return [];
 const same=(dx:number,dy:number)=>{const x=column+dx,y=row+dy;return x<0||y<0||x>=(maps[mapId].world??worldConfig).width/arenaConfig.tileSize||y>=(maps[mapId].world??worldConfig).height/arenaConfig.tileSize||terrainFrame(x,y,mapId)===kind;};
 const edges=([[0,-1,'n'],[1,0,'e'],[0,1,'s'],[-1,0,'w']] as const).filter(([dx,dy])=>!same(dx,dy)).map(([, ,side])=>`edge-${kind}-${side}`);
 // Fill concave corners even when both cardinal neighbors are water.
 if(kind==='water')for(const [dx,dy,corner] of [[-1,-1,'nw'],[1,-1,'ne'],[1,1,'se'],[-1,1,'sw']] as const)
  if(same(dx,0)&&same(0,dy)&&!same(dx,dy))edges.push(`corner-water-${corner}`);
 return edges;
}

export type BuildingKind='siegeWorks'|'aviary'|'stable'|'academy'|'wall'|'gate'|'tower'|'base'|'barracks'|'farm'|'forge'|'harbor';
export function buildingFrame(kind:BuildingKind,owner:'player'|'enemy',remaining=0,total=5,faction:FactionId='crown',hp?:number,level=1):string{
 const maxHP=kind==='tower'||kind==='wall'||kind==='gate'?defenseConfig[kind].hp:kind==='harbor'?factions[faction].naval.harbor.hp:factions[faction].buildings[kind].hp;
 const stage=remaining>total/2?'foundation':remaining>0?'building':hp!==undefined&&hp>0&&hp<=maxHP*buildingArtConfig.damagedFraction?'damaged':'complete';
 return `${factions[faction].artPrefix}${kind}${(kind==='base'||kind==='tower')&&level>1?'-level'+level:''}-${owner}-${stage}`;
}
export function buildingOrigin(kind:BuildingKind){return kind==='farm'?{x:.5,y:.75}:{x:.5,y:.75};}

/** Sparse flowers/ferns and connected dirt tracks only on free terrain. No collision or resources. */
export function terrainDetails(column:number,row:number,mapId:MapId='arena'):string[]{
 if(!terrainFrame(column,row,mapId).startsWith('grass'))return [];
 const road=(x:number,y:number)=>x>=12&&x<=28&&y===14||x===28&&y>=10&&y<=14;
 if(road(column,row))return ([[0,-1,'n'],[1,0,'e'],[0,1,'s'],[-1,0,'w']] as const)
  .filter(([dx,dy])=>road(column+dx,row+dy)&&terrainFrame(column+dx,row+dy,mapId).startsWith('grass')).map(([, ,d])=>'road-'+d);
 const hash=(Math.imul(column+9,73856093)^Math.imul(row+11,19349663))>>>0;
 return hash%83===0?['flowers']:hash%101===0?['fern']:[];
}
