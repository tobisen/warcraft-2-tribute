import {readFileSync} from 'node:fs';
import {expect,it} from 'vitest';
import {readRGBA} from '../scripts/read-rgba-png.mjs';
import {unitFrame,motion,directions} from '../src/presentation/animation';
const atlas=JSON.parse(readFileSync(new URL('../public/assets/air-atlas.json',import.meta.url))),image=readRGBA(new URL('../public/assets/air-atlas.png',import.meta.url));
function pixels(id){const f=atlas.frames[id]?.frame;expect(f,id).toBeDefined();expect(f.x+f.w).toBeLessThanOrEqual(image.width);expect(f.y+f.h).toBeLessThanOrEqual(image.height);const data=Buffer.alloc(f.w*f.h*4);for(let y=0;y<f.h;y++)data.set(image.data.subarray(((f.y+y)*image.width+f.x)*4,((f.y+y)*image.width+f.x+f.w)*4),y*f.w*4);return data;}
it.each(['crown','clans','elves','dwarves','goblins'])('%s flyer has actual transparent flight/attack/death frames for both teams and all facing keys',faction=>{
 for(const owner of ['player','enemy'])for(const direction of directions)for(const action of ['idle','walk','attack','death']){
  const variants=[];for(let i=0;i<4;i++){const m=motion(undefined,{x:0,y:0},action,0,'air',owner,undefined,faction);m.facing=direction;const frame=unitFrame(m,i/8+.001),data=pixels(frame);expect(frame).not.toContain('placeholder');expect(data.some((v,j)=>j%4===3&&v>128)).toBe(true);expect(Array.from({length:64},(_,j)=>[[j,0],[j,63],[0,j],[63,j]]).flat().every(([x,y])=>data[(y*64+x)*4+3]===0)).toBe(true);variants.push(data.toString('base64'));}
  expect(new Set(variants).size).toBeGreaterThanOrEqual(3);
 }
 expect(pixels(`${faction}-air-player-s-idle-0`).equals(pixels(`${faction}-air-enemy-s-idle-0`))).toBe(false);
});
