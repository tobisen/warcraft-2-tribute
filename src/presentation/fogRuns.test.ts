import {expect,it} from 'vitest';
import {createFog} from '../gameplay/fog';
import {forEachFogRun} from './fogRuns';
it('preserves every pixel and opacity, including clipped edges and both teams',()=>{
 const fog=createFog({width:103,height:71},16);
 for(const team of ['player','enemy'] as const){
  const layer=fog.teams[team];layer.visible=layer.visible.map((_,i)=>i%(team==='player'?3:5)===0);layer.explored=layer.explored.map((_,i)=>i%4<2);
  const pixels=Array<number>(fog.width*fog.height).fill(0);
  forEachFogRun(fog,team,(x,y,width,height,alpha)=>{expect(x+width).toBeLessThanOrEqual(fog.width);expect(y+height).toBeLessThanOrEqual(fog.height);for(let row=y;row<y+height;row++)for(let col=x;col<x+width;col++){expect(pixels[row*fog.width+col]).toBe(0);pixels[row*fog.width+col]=alpha;}});
  for(let y=0;y<fog.height;y++)for(let x=0;x<fog.width;x++){const i=Math.floor(y/fog.tileSize)*fog.columns+Math.floor(x/fog.tileSize);expect(pixels[y*fog.width+x]).toBe(layer.visible[i]?0:layer.explored[i]?.55:1);}
 }
});
it('draws uniform fog once per row and immediately reflects changed visibility',()=>{
 const fog=createFog({width:4096,height:4096});let calls=0;forEachFogRun(fog,'player',()=>calls++);expect(calls).toBe(fog.rows);
 fog.teams.player.visible.fill(true);calls=0;forEachFogRun(fog,'player',()=>calls++);expect(calls).toBe(0);
 fog.teams.player.visible[0]=false;fog.teams.player.explored[0]=true;let opacity=0;forEachFogRun(fog,'player',(_x,_y,_w,_h,a)=>opacity=a);expect(opacity).toBe(.55);
});
