import {terrainPatches,type WorldMap} from '../gameplay/map';
import {frontierGroves} from '../config/referenceTerrain';
export function referenceKind(column:number,row:number,map:WorldMap):'water'|'rock'|'grass'{return terrainPatches(map).find(p=>column>=p.column&&column<p.column+p.columns&&row>=p.row&&row<p.row+p.rows)?.kind??'grass';}
const sides=[[0,-1,'n'],[1,0,'e'],[0,1,'s'],[-1,0,'w']] as const;
function earth(c:number,r:number):boolean{return Object.values(frontierGroves).some(g=>g.cells.some(t=>Math.abs(t.column-c)<=1&&Math.abs(t.row-r)<=1))||r>=13&&r<=15&&c>=12&&c<=28||c>=27&&c<=29&&r>=13&&r<=22;}
export function referenceTile(c:number,r:number,map:WorldMap):{frame:string;edges:string[]}{
 const kind=referenceKind(c,r,map),variant=((Math.imul(c+17,73856093)^Math.imul(r+31,19349663))>>>0)%4,near=(radius:number,target:string)=>{for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++)if(referenceKind(c+dx,r+dy,map)===target)return true;return false;};
 let base:string=kind,edges:string[]=[];
 if(kind==='water'){
  base=near(1,'grass')?'shallow':near(2,'grass')?'water':'deep';
  edges=sides.filter(([dx,dy])=>referenceKind(c+dx,r+dy,map)!=='water').map(([, ,side])=>`shore-${side}`);
  for(const [dx,dy,corner] of [[-1,-1,'nw'],[1,-1,'ne'],[1,1,'se'],[-1,1,'sw']] as const)if(referenceKind(c+dx,r,map)==='water'&&referenceKind(c,r+dy,map)==='water'&&referenceKind(c+dx,r+dy,map)!=='water')edges.push(`shore-${corner}`);
 }else if(kind==='rock')edges=sides.filter(([dx,dy])=>referenceKind(c+dx,r+dy,map)!=='rock').map(([, ,side])=>`cliff-${side}`);
 else if(near(1,'water')){base='grass';edges=sides.filter(([dx,dy])=>referenceKind(c+dx,r+dy,map)==='water').map(([, ,side])=>`blend-sand-${side}`);}
 else if(earth(c,r))base='earth';
 else edges=sides.filter(([dx,dy])=>earth(c+dx,r+dy)&&referenceKind(c+dx,r+dy,map)==='grass').map(([, ,side])=>`earth-${side}`);
 if(kind==='water')for(const [dx,dy,side] of sides){const x=c+dx,y=r+dy;if(referenceKind(x,y,map)!=='water')continue;const neighbor=(radius:number)=>{for(let a=-radius;a<=radius;a++)for(let b=-radius;b<=radius;b++)if(referenceKind(x+a,y+b,map)==='grass')return true;return false;};const lighter=neighbor(1)?'shallow':neighbor(2)?'water':'deep';if(base==='deep'&&lighter!=='deep'||base==='water'&&lighter==='shallow')edges.push(`blend-${lighter}-${side}`);}
 return {frame:`${base}-${variant}`,edges};
}
