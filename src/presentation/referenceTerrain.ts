import {expansionSites} from '../config/mapExtensions';
import {terrainPatches,type WorldMap} from '../gameplay/map';
import {mapResources} from '../config/maps';
import {frontierGroves} from '../config/referenceTerrain';
const kindCache=new Map<string,Map<string,'water'|'rock'>>();
export function referenceKind(column:number,row:number,map:WorldMap):'water'|'rock'|'grass'{const key=`${map.id}:${map.terrainLayout}:${map.worldLayout}:${map.design}`;let cells=kindCache.get(key);if(!cells){cells=new Map();for(const p of terrainPatches(map))for(let r=p.row;r<p.row+p.rows;r++)for(let c=p.column;c<p.column+p.columns;c++)if(!cells.has(`${c},${r}`))cells.set(`${c},${r}`,p.kind);kindCache.set(key,cells);}return cells.get(`${column},${row}`)??'grass';}

const sides=[[0,-1,'n'],[1,0,'e'],[0,1,'s'],[-1,0,'w']] as const;
const earthCache=new Map<string,Set<string>>();
function earth(c:number,r:number,map:WorldMap):boolean{const key=`${map.id}:${map.resourceLayout}:${map.worldLayout}:${map.design}`,id=map.id??'arena';let cells=earthCache.get(key);if(!cells){cells=new Set<string>();const nodes=mapResources(id,map.resourceLayout,map.worldLayout,map.design);for(const n of nodes){const column=Math.floor(n.position.x/32),row=Math.floor(n.position.y/32);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)cells.add(`${column+dx},${row+dy}`);}if(id==='frontier')for(const g of Object.values(frontierGroves))for(const n of g.cells)for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)cells.add(`${n.column+dx},${n.row+dy}`);if(map.worldLayout==='expanded'&&!map.design)for(const site of expansionSites(id)){for(let c=site.column-5;c<=site.column+12;c++)cells.add(`${c},${site.row+6}`);for(let r=site.row-5;r<=site.row+13;r++)cells.add(`${site.column+8},${r}`);}earthCache.set(key,cells);}return cells.has(`${c},${r}`)||(id==='frontier'&&(r>=13&&r<=15&&c>=12&&c<=28||c>=27&&c<=29&&r>=13&&r<=22));}

export function referenceTile(c:number,r:number,map:WorldMap):{frame:string;edges:string[]}{
 const kind=referenceKind(c,r,map),variant=((Math.imul(c+17,73856093)^Math.imul(r+31,19349663))>>>0)%4,near=(radius:number,target:string)=>{for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++)if(referenceKind(c+dx,r+dy,map)===target)return true;return false;};
 let base:string=kind,edges:string[]=[];
 if(kind==='water'){
  base=near(1,'grass')?'shallow':near(2,'grass')?'water':'deep';
  edges=sides.filter(([dx,dy])=>referenceKind(c+dx,r+dy,map)!=='water').map(([, ,side])=>`shore-${side}`);
  for(const [dx,dy,corner] of [[-1,-1,'nw'],[1,-1,'ne'],[1,1,'se'],[-1,1,'sw']] as const)if(referenceKind(c+dx,r,map)==='water'&&referenceKind(c,r+dy,map)==='water'&&referenceKind(c+dx,r+dy,map)!=='water')edges.push(`shore-${corner}`);
 }else if(kind==='rock')edges=sides.filter(([dx,dy])=>referenceKind(c+dx,r+dy,map)!=='rock').map(([, ,side])=>`cliff-${side}-${variant}`);
 else if(near(1,'water')){base='grass';edges=sides.filter(([dx,dy])=>referenceKind(c+dx,r+dy,map)==='water').map(([, ,side])=>`blend-sand-${side}`);}
 else if(earth(c,r,map))base='earth';
 else edges=sides.filter(([dx,dy])=>earth(c+dx,r+dy,map)&&referenceKind(c+dx,r+dy,map)==='grass').map(([, ,side])=>`earth-${side}`);
 if(kind==='rock')for(const [dx,dy,corner]of [[-1,-1,'nw'],[1,-1,'ne'],[1,1,'se'],[-1,1,'sw']] as const)if(referenceKind(c+dx,r,map)!=='rock'&&referenceKind(c,r+dy,map)!=='rock')edges.push(`cliff-${corner}`);
 if(kind==='water')for(const [dx,dy,corner]of [[-1,-1,'nw'],[1,-1,'ne'],[1,1,'se'],[-1,1,'sw']] as const)if(referenceKind(c+dx,r,map)!=='water'&&referenceKind(c,r+dy,map)!=='water')edges.push(`shore-cap-${corner}`);
 if(kind==='water')for(const [dx,dy,side] of sides){const x=c+dx,y=r+dy;if(referenceKind(x,y,map)!=='water')continue;const neighbor=(radius:number)=>{for(let a=-radius;a<=radius;a++)for(let b=-radius;b<=radius;b++)if(referenceKind(x+a,y+b,map)==='grass')return true;return false;};const lighter=neighbor(1)?'shallow':neighbor(2)?'water':'deep';if(base==='deep'&&lighter!=='deep'||base==='water'&&lighter==='shallow')edges.push(`blend-${lighter}-${side}`);}
 return {frame:`${base}-${variant}`,edges};
}
