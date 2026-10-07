import type {MapId,MapResource,TerrainPatch} from './maps';
export const expandedWorld={width:4096,height:4096};
const inlandSites=[...([12,34,54,82,106] as const).flatMap(column=>([46,76,106] as const).map(row=>({column,row}))),...([62,88,110] as const).flatMap(column=>([10,28] as const).map(row=>({column,row})))];
export const expansionSites=(id:MapId):readonly {column:number;row:number}[]=>id==='coast'?[{column:8,row:52},{column:8,row:84},{column:26,row:106},{column:90,row:84}]:id==='islands'?inlandSites.filter(s=>s.row>=40):inlandSites;

/** Authored sector motifs: finite woods/mines beside ponds and broken ridges, with wide connecting land. */
export function extensionTerrain(id:MapId):TerrainPatch[]{
 if(id==='coast')return [];const patches:TerrainPatch[]=[];
 for(const [i,s] of expansionSites(id).entries()){
  patches.push({column:s.column-5,row:s.row-5,columns:3,rows:9,kind:'rock'},
   {column:s.column-5,row:s.row+7,columns:3,rows:7,kind:'rock'},
   {column:s.column+10,row:s.row-4,columns:8,rows:5,kind:'water'},
   {column:s.column+14,row:s.row+6,columns:4,rows:5,kind:i%2?'water':'rock'});
 }
 if(id==='islands')patches.push({column:0,row:30,columns:128,rows:10,kind:'water'},{column:40,row:0,columns:88,rows:30,kind:'water'},{column:0,row:40,columns:2,rows:88,kind:'water'},{column:126,row:40,columns:2,rows:88,kind:'water'});
 if(id==='highlands')patches.push({column:40,row:96,columns:4,rows:32,kind:'rock'});
 return patches;
}
export function extensionResources(id:MapId,terrain:readonly TerrainPatch[],existing:readonly MapResource[]):MapResource[]{
 const blocked=(x:number,y:number)=>terrain.some(p=>x>=p.column*32-16&&x<=(p.column+p.columns)*32+16&&y>=p.row*32-16&&y<=(p.row+p.rows)*32+16)||existing.some(n=>Math.abs(n.position.x-x)<96&&Math.abs(n.position.y-y)<96);
 const result:MapResource[]=[];
 for(const [index,site]of expansionSites(id).entries()){
  for(let dy=0;dy<5;dy++)for(let dx=0;dx<7;dx++){
   // Uneven corners make each grove legible while maintaining a dense interior.
   if((dx===0||dx===6)&&(dy===0||dy===4))continue;
   const position={x:(site.column+dx+.5)*32,y:(site.row+dy+.5)*32};if(!blocked(position.x,position.y))result.push({id:`expansion-${index+1}-tree-${dx}-${dy}`,resource:'wood',tree:true,position,amount:20});
  }
  const position={x:(site.column+10+.5)*32,y:(site.row+7+.5)*32};if(!blocked(position.x,position.y))result.push({id:`expansion-${index+1}-gold`,resource:'gold',mine:true,position,amount:1500});
 }
 return result;
}
