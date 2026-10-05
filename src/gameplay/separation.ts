import {enemyNavigationMap} from './map';
import { separationConfig as config } from '../config/separation';
import type { Position } from './movement';
import type { WorldMap } from './map';
import { segmentFits } from './navigation';
export interface SeparationBody { id:string; position:Position; half:number;fixed?:boolean }
/** No saved/hidden state. Stable IDs settle ties; square bodies match navigation clearance. */
export function separateBodies(map:WorldMap, bodies:readonly SeparationBody[], delta:number):Map<string,Position> {
  const moved=new Map<string,Position>(), budget=config.speed*Math.max(0,delta);
  if(!Number.isFinite(budget)||budget===0)return moved;
  const actors=bodies.filter(b=>Number.isFinite(b.position.x)&&Number.isFinite(b.position.y)&&b.half>0)
    .map(b=>({...b,position:{...b.position},spent:0})).sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}));
  const tie=(a:string,b:string)=>{let n=0;for(const c of `${a}|${b}`)n=(n*31+c.charCodeAt(0))>>>0;return n;};
  const shift=(actor:typeof actors[number],axis:'x'|'y',direction:number,wanted:number):number=>{
    if(actor.fixed)return 0;
    const amount=Math.min(wanted,Math.max(0,budget-actor.spent));if(amount<=config.epsilon)return 0;
    const point=(distance:number)=>({...actor.position,[axis]:actor.position[axis]+direction*distance});
    let allowed=amount;const actorMap=actor.id.startsWith('enemy:')?enemyNavigationMap(map):map;
    if(!segmentFits(actorMap,actor.position,point(amount),actor.half)){
      let low=0,high=amount;for(let i=0;i<7;i++){const mid=(low+high)/2;if(segmentFits(actorMap,actor.position,point(mid),actor.half))low=mid;else high=mid;}allowed=low;
    }
    if(allowed<=config.epsilon)return 0;
    actor.position=point(allowed);actor.spent+=allowed;return allowed;
  };
  for(let pass=0;pass<config.passes;pass++){
    const cells=new Map<string,typeof actors>();
    for(const actor of actors){const key=`${Math.floor(actor.position.x/config.cellSize)},${Math.floor(actor.position.y/config.cellSize)}`;const list=cells.get(key)??[];list.push(actor);cells.set(key,list);}
    for(const a of actors){
      const cx=Math.floor(a.position.x/config.cellSize),cy=Math.floor(a.position.y/config.cellSize),near:typeof actors=[];
      for(let y=cy-1;y<=cy+1;y++)for(let x=cx-1;x<=cx+1;x++)near.push(...(cells.get(`${x},${y}`)??[]));
      near.sort((b,c)=>Math.hypot(b.position.x-a.position.x,b.position.y-a.position.y)-Math.hypot(c.position.x-a.position.x,c.position.y-a.position.y)||b.id.localeCompare(c.id,'en',{numeric:true}));
      for(const b of near.filter(b=>b!==a).slice(0,config.neighbors)){
        if(a.id.localeCompare(b.id,'en',{numeric:true})>=0)continue;
        const dx=b.position.x-a.position.x,dy=b.position.y-a.position.y,sum=a.half+b.half,ox=sum-Math.abs(dx),oy=sum-Math.abs(dy);
        if(ox<=config.epsilon||oy<=config.epsilon)continue;
        const hash=tie(a.id,b.id),first: 'x'|'y'=Math.abs(ox-oy)<config.epsilon?(hash%2?'x':'y'):ox<oy?'x':'y';
        for(const axis of [first,first==='x'?'y':'x'] as const){
          const component=axis==='x'?dx:dy,penetration=axis==='x'?ox:oy,direction=component===0?(hash%4<2?1:-1):Math.sign(component);
          const left=shift(a,axis,-direction,penetration/2+config.epsilon),right=shift(b,axis,direction,penetration-left+config.epsilon);
          if(left+right>config.epsilon){if(right<penetration-left)shift(a,axis,-direction,penetration-left-right+config.epsilon);break;}
        }
      }
    }
  }
  for(const actor of actors)if(actor.spent>0)moved.set(actor.id,actor.position);
  return moved;
}
