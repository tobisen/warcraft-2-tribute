import {readFileSync} from 'node:fs';
import {expect,it} from 'vitest';
import {readRGBA} from '../scripts/read-rgba-png.mjs';
const atlas=JSON.parse(readFileSync(new URL('../public/assets/world-atlas.json',import.meta.url))),image=readRGBA(new URL('../public/assets/world-atlas.png',import.meta.url));
it.each(['deer','rabbit','fox'])('%s has six distinct transparent, unclipped source poses at its existing anchor',type=>{
 const variants=[];for(const action of ['idle','walk'])for(let index=0;index<(action==='idle'?2:4);index++){
  const f=atlas.frames[`critter-${type}-${action}-${index}`].frame,data=Buffer.alloc(32*32*4),colors=new Set();expect(f).toMatchObject({w:32,h:32});
  for(let y=0;y<32;y++)for(let x=0;x<32;x++){const source=((f.y+y)*image.width+f.x+x)*4,target=(y*32+x)*4;data.set(image.data.subarray(source,source+4),target);if(data[target+3]>128)colors.add(data.subarray(target,target+3).toString('hex'));}
  expect(colors.size).toBeGreaterThan(16);expect(Array.from({length:32},(_,i)=>[[i,0],[i,31],[0,i],[31,i]]).flat().every(([x,y])=>data[(y*32+x)*4+3]===0)).toBe(true);variants.push(data.toString('base64'));
 }
 expect(new Set(variants).size).toBe(6);
});
