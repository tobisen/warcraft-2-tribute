import {describe,it,expect} from 'vitest';
import {reduceSprite} from '../assets/sources/visual-refresh/sample.mjs';
describe('native material reduction',()=>{
 it('retains a thin feature between nearest-neighbor sample positions',()=>{
  const data=new Uint8Array(4*4*4);for(let y=0;y<4;y++)for(let x=0;x<4;x++)data.set(x===1?[240,200,80,255]:[40,60,80,255],(y*4+x)*4);
  const out=reduceSprite({x:0,y:0,width:4,height:4,sheet:{width:4,data}},2,2);
  expect([...out.subarray(0,4)]).toEqual([140,130,80,255]);expect([...out.subarray(4,8)]).toEqual([40,60,80,255]);
 });
 it('does not bleed hidden transparent RGB into material edges',()=>{
  const data=new Uint8Array([200,100,40,255,0,255,0,0,200,100,40,255,0,255,0,0]);
  expect([...reduceSprite({x:0,y:0,width:2,height:2,sheet:{width:2,data}},1,1)]).toEqual([200,100,40,160]);
 });
});
