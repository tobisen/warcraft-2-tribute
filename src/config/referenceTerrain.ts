import type {TerrainPatch} from './maps';
/** Original authored Frontier layout. Row contours become non-overlapping tile rectangles. */
const rows=(kind:TerrainPatch['kind'],segments:readonly (readonly [number,number,number])[]):TerrainPatch[]=>segments.map(([row,column,columns])=>({row,column,columns,rows:1,kind}));
export const frontierReferenceTerrain:readonly TerrainPatch[]=[
 ...rows('water',[[2,31,4],[3,30,6],[4,30,6],[5,30,2],[6,30,2],[7,30,3],[8,29,5],[9,28,6],[10,28,5],[11,27,6],[12,27,5],[13,26,6],[14,25,7],[15,25,7],[16,26,6],[17,27,5],
 [22,25,5],[23,24,6],[24,24,6],[25,23,8],[26,22,10],[27,21,11],[28,20,6],[28,28,4],[29,20,6],[29,28,4],[30,21,10],[31,22,8],[32,24,5]]),
 ...rows('water',[[8,44,3],[9,43,5],[10,43,5],[11,44,3]]),
 ...rows('rock',[[10,19,3],[11,18,4],[12,19,3],[5,32,3],[6,32,3],[7,33,2],
 [24,8,4],[25,7,6],[26,8,5],[27,9,3],[18,45,3],[19,44,5],[20,45,4],[21,46,3]])
];
export type GroveId='frontier-west'|'frontier-east';
export interface ForestCell {column:number;row:number}
function groveCells(segments:readonly (readonly [number,number,number])[],clearing:(column:number,row:number)=>boolean):ForestCell[]{return segments.flatMap(([row,column,count])=>Array.from({length:count},(_,i)=>({row,column:column+i}))).filter(c=>!clearing(c.column,c.row));}
export const frontierGroves:Record<GroveId,{nodeId:string;stock:number;cells:readonly ForestCell[]}>= {
 'frontier-west':{nodeId:'wood-1',stock:400,cells:groveCells([[1,12,10],[2,10,14],[3,9,16],[4,9,16],[5,10,14],[6,11,13],[7,13,11],[8,15,8]],(c,r)=>c>=19&&c<=21&&r>=5)},
 'frontier-east':{nodeId:'wood-2',stock:200,cells:groveCells([[23,37,6],[24,35,9],[25,34,12],[26,34,12],[27,35,11],[28,35,10]],(c,r)=>c<=38&&r>=27)}
};
export function groveForNode(id:string):GroveId|undefined{return id==='wood-1'?'frontier-west':id==='wood-2'?'frontier-east':undefined;}
