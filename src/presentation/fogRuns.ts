import type {FogState,Team} from '../gameplay/fog';
/** Coalesce adjacent cells of identical opacity without changing any covered pixels. */
export function forEachFogRun(fog:FogState,team:Team,draw:(x:number,y:number,width:number,height:number,alpha:number)=>void):void {
 const layer=fog.teams[team];
 for(let row=0;row<fog.rows;row++){
  let col=0;
  while(col<fog.columns){
   const i=row*fog.columns+col;
   if(layer.visible[i]){col++;continue;}
   const explored=!!layer.explored[i],start=col++;
   while(col<fog.columns&&!layer.visible[row*fog.columns+col]&&!!layer.explored[row*fog.columns+col]===explored)col++;
   const x=start*fog.tileSize,y=row*fog.tileSize;
   draw(x,y,Math.min(col*fog.tileSize,fog.width)-x,Math.min(fog.tileSize,fog.height-y),explored?.55:1);
  }
 }
}
