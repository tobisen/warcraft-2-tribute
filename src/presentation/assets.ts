import { arenaConfig } from '../config/arena';
export function terrainFrame(column:number,row:number):'grass-a'|'grass-b'|'rock'|'water' {
 const patch=arenaConfig.terrain.find(p=>column>=p.column&&column<p.column+p.columns&&row>=p.row&&row<p.row+p.rows);
 return patch?.kind??((column+row)%2?'grass-a':'grass-b');
}
export function resourceFrame(type:'wood'|'gold',remaining:number,visible:boolean):string{return `${type}-${visible&&remaining<=0?'depleted':'available'}`;}
export const resourceOrigin={x:.5,y:.625};

/** Only exposed edges of a contiguous patch receive shoreline/rock blending. */
export function terrainEdges(column:number,row:number):string[]{const kind=terrainFrame(column,row);if(kind!=='water'&&kind!=='rock')return [];return ([[0,-1,'n'],[1,0,'e'],[0,1,'s'],[-1,0,'w']] as const).filter(([dx,dy])=>terrainFrame(column+dx,row+dy)!==kind).map(([, ,side])=>`edge-${kind}-${side}`);}
