import {regionProtected} from './mapRegions';
import type {MapId,MapResource,TerrainPatch} from './maps';
import {frontierGroves} from './referenceTerrain';

export type TerrainDesign='organic'|'regions';
type Shape=readonly [number,number,number,number];
/** Authored regions, in tiles: center x/y and radii. Shared contours, distinct geography. */
const valleys:Record<MapId,{water:readonly Shape[];rock:readonly Shape[];woods:readonly Shape[]}>= {
 frontier:{water:[[31,10,5,10],[28,30,4,7],[60,57,12,9],[82,83,7,18],[106,38,11,8]],rock:[[20,13,3,4],[9,26,6,4],[48,20,5,7],[52,66,6,14],[98,87,12,6]],woods:[[19,3,10,5],[40,26,8,5],[17,50,13,9],[42,83,11,14],[70,29,15,8],[108,63,12,13],[78,105,18,8]]},
 arena:{water:[[21,25,6,4],[43,14,5,7],[49,49,7,5]],rock:[[31,35,3,8],[15,46,5,4]],woods:[[17,5,7,4],[8,29,5,7],[35,21,6,5],[36,50,8,5],[52,34,6,7]]},
 forest:{water:[[19,28,10,5],[63,65,12,8],[79,25,7,10]],rock:[[39,45,4,17],[56,22,7,5]],woods:[[9,10,5,8],[29,9,9,6],[24,47,12,10],[46,75,15,9],[66,42,12,11],[83,78,7,8]]},
 river:{water:[[30,40,20,6],[58,50,18,7],[81,67,12,17],[99,87,16,6],[21,95,11,12]],rock:[[16,12,4,7],[62,31,11,5],[69,82,5,13]],woods:[[21,6,8,4],[10,56,6,11],[48,17,12,7],[43,79,15,9],[101,42,12,13],[61,107,16,8]]},
 highlands:{water:[[14,67,11,8],[68,57,12,8],[100,34,10,11]],rock:[[41,8,5,7],[41,32,6,11],[41,65,5,15],[41,108,6,14],[72,82,15,6],[101,62,6,15]],woods:[[22,8,9,6],[14,40,7,8],[60,23,12,8],[64,101,13,8],[104,88,13,8]]},
 plains96:{water:[[41,36,10,8],[66,72,16,8],[107,46,10,13]],rock:[[25,54,6,10],[78,28,8,5],[91,95,12,6]],woods:[[20,6,9,4],[12,37,7,9],[42,86,13,10],[69,48,14,9],[105,77,11,10],[64,109,16,7]]},
 plains128:{water:[[29,57,7,17],[70,37,16,7],[94,86,14,9]],rock:[[53,68,5,14],[102,27,9,6],[67,103,14,5]],woods:[[20,5,9,4],[16,31,9,9],[50,24,12,9],[40,99,15,9],[81,63,16,10],[110,62,10,12]]},
 islands:{water:[],rock:[[8,5,4,4],[35,24,4,5],[61,56,8,5],[88,88,5,9]],woods:[[16,5,5,3],[9,22,5,4],[35,11,4,5],[59,44,9,5],[72,75,11,8],[109,95,9,9],[42,104,13,6]]},
 coast:{water:[],rock:[[8,5,4,4],[35,24,4,5],[58,11,7,6],[21,73,5,14],[10,99,7,5],[98,89,5,6]],woods:[[16,5,5,3],[9,22,5,4],[48,9,5,4],[14,52,8,7],[28,102,10,7],[98,94,10,8]]},
};
export const organicWorld=(id:MapId)=>({width:id==='arena'?2048:id==='forest'?3072:4096,height:id==='arena'?2048:id==='forest'?3072:4096});
function contains(c:number,r:number,[x,y,rx,ry]:Shape,index:number){const angle=Math.atan2((r-y)/ry,(c-x)/rx),edge=1+.12*Math.sin(angle*3+index)+.07*Math.cos(angle*5-index);return ((c-x)/rx)**2+((r-y)/ry)**2<edge*edge;}
const missionPoints:Partial<Record<MapId,readonly (readonly [number,number])[]>>={frontier:[[26,5],[37,20],[34,20]],highlands:[[47,17],[28,27],[54,46],[83,10]],coast:[[50,12],[54,14]],islands:[[30,15]]};
function safe(c:number,r:number,id:MapId,design:TerrainDesign){if(design==='organic')return c>=5&&c<=21&&r>=7&&r<=17||(missionPoints[id]??[[26,5]]).some(([x,y])=>Math.hypot(c-x,r-y)<3.5);const t=Math.max(0,Math.min(1,((c-17)*9+(r-10)*-4)/97)),resourceLane=Math.hypot(c-(17+9*t),r-(10-4*t))<1.8,w=Math.max(0,Math.min(1,((c-17)*3+(r-10)*-5)/34)),woodLane=Math.hypot(c-(17+3*w),r-(10-5*w))<1.8;return c>=21&&c<=25&&r<=10||resourceLane||woodLane|| c>=5&&c<=21&&r>=7&&r<=17||(missionPoints[id]??[[26,5]]).some(([x,y])=>Math.hypot(c-x,r-y)<3.5);}
/** Merge identical row spans vertically; collision remains tile exact and bounded. */
export function patchesFromCells(cells:Map<string,TerrainPatch['kind']>):TerrainPatch[]{const result:TerrainPatch[]=[],active=new Map<string,TerrainPatch>();const rows=new Map<number,Map<number,TerrainPatch['kind']>>();for(const [key,kind]of cells){const [c,r]=key.split(',').map(Number),row=rows.get(r)??new Map();row.set(c,kind);rows.set(r,row);}for(const [r,row]of [...rows].sort((a,b)=>a[0]-b[0])){const columns=[...row.keys()].sort((a,b)=>a-b);for(let i=0;i<columns.length;){const c=columns[i],kind=row.get(c)!,start=c;let end=c;i++;while(i<columns.length&&columns[i]===end+1&&row.get(columns[i])===kind)end=columns[i++];const key=`${start}:${end}:${kind}`,previous=active.get(key);if(previous&&previous.row+previous.rows===r)previous.rows++;else{const patch={column:start,row:r,columns:end-start+1,rows:1,kind};result.push(patch);active.set(key,patch);}}}return result;}
export function organicTerrain(id:MapId,design:TerrainDesign='organic'):TerrainPatch[]{const cells=new Map<string,TerrainPatch['kind']>(),size=organicWorld(id).width/32,v=valleys[id];for(let r=0;r<size;r++)for(let c=0;c<size;c++){
 let kind:TerrainPatch['kind']|undefined;
 if(id==='islands'||id==='coast'){
  // Western starting island, eastern shore, a winding southern sea and islands.
  const channel=design==='organic'?24+Math.round(2*Math.sin(r*.24)):22+(r>=8&&r<=18?0:Math.round(2*Math.sin(r*.24)));
  if(r<2||c<2||c>=size-2||r<30&&c>=channel&&c<channel+6||r>=30&&r<40+Math.round(3*Math.sin(c*.13)))kind='water';
  if(r>=40){if(id==='islands'){if(c>42&&!(contains(c,r,[65,56,15,11],1)||contains(c,r,[84,87,20,17],2)||contains(c,r,[112,108,10,11],3)))kind='water';}else if(c>40&&!(contains(c,r,[62,61,14,10],2)||contains(c,r,[99,96,17,15],3)))kind='water';}
 }
 if(v.water.some((s,i)=>contains(c,r,s,i)))kind='water';
 if(v.rock.some((s,i)=>contains(c,r,s,i+3)))kind='rock';
 if(kind&&!(design==='regions'&&regionProtected(c,r,id))&&!safe(c,r,id,design)&&!(id==='frontier'&&Object.values(frontierGroves).some(g=>g.cells.some(p=>p.column===c&&p.row===r))))cells.set(`${c},${r}`,kind);
 }return patchesFromCells(cells);}
export function organicResources(id:MapId,existing:readonly MapResource[],terrain:readonly TerrainPatch[],design:TerrainDesign='organic'):MapResource[]{const nodes:MapResource[]=[],occupied=new Set(existing.filter(n=>n.tree).map(n=>`${Math.floor(n.position.x/32)},${Math.floor(n.position.y/32)}`)),blocked=(c:number,r:number)=>terrain.some(p=>c>=p.column&&c<p.column+p.columns&&r>=p.row&&r<p.row+p.rows);const size=organicWorld(id).width/32;
 for(const [i,shape]of valleys[id].woods.entries())for(let r=2;r<size-2;r++)for(let c=2;c<size-2;c++){
 if(!contains(c,r,shape,i)||(design==='regions'&&regionProtected(c,r,id))||safe(c,r,id,design)||blocked(c,r)||occupied.has(`${c},${r}`)||existing.some(n=>!n.tree&&Math.hypot(n.position.x-(c+.5)*32,n.position.y-(r+.5)*32)<96))continue;
 if(id==='frontier'&&Object.values(frontierGroves).some(g=>g.cells.some(p=>p.column===c&&p.row===r)))continue;
 // A few authored glades cut into each connected grove, not random isolated trees.
 if(contains(c,r,[shape[0]+2,shape[1]+1,2,2.5],0))continue;
 occupied.add(`${c},${r}`);nodes.push({id:`organic-${i}-tree-${c}-${r}`,resource:'wood',tree:true,position:{x:(c+.5)*32,y:(r+.5)*32},amount:8});
 }
 for(const [i,[c,r]]of [[23,51],[43,73],[72,25],[104,64],[73,105]].entries()){if(c>=size-4||r>=size-4||blocked(c,r))continue;const position={x:(c+.5)*32,y:(r+.5)*32};if(existing.some(n=>Math.hypot(n.position.x-position.x,n.position.y-position.y)<128)||nodes.some(n=>Math.hypot(n.position.x-position.x,n.position.y-position.y)<96))continue;nodes.push({id:`organic-mine-${i}`,resource:'gold',mine:true,position,amount:2500});}return nodes;
}
