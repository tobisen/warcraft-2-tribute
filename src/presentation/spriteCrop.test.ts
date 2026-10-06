import {describe,it,expect} from 'vitest';
import {spriteCrop} from './spriteCrop';
describe('portrait bounds',()=>{
 it('uses opaque subject bounds and ignores low-alpha fringe',()=>{
  const pixels=new Uint8ClampedArray(8*8*4);pixels[(2*8+3)*4+3]=255;pixels[(5*8+6)*4+3]=255;pixels[3]=20;
  expect(spriteCrop(pixels,8,8)).toEqual({x:3,y:2,width:4,height:4});
 });
 it('falls back safely for an empty sprite',()=>expect(spriteCrop(new Uint8ClampedArray(16),2,2)).toEqual({x:0,y:0,width:2,height:2}));
});
