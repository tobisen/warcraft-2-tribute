import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
import {directions,unitOrigin,unitFrame,motion} from '../src/presentation/animation';
const manifest=JSON.parse(readFileSync(new URL('../public/assets/manifest.json',import.meta.url),'utf8')),atlas=JSON.parse(readFileSync(new URL('../public/assets/units-atlas.json',import.meta.url),'utf8'));
describe('original eight-way unit sheets',()=>{
 it('covers every type/team/facing/state, with bounded frames and native anchors',()=>{
  let count=0;for(const faction of ['crown','clans','elves'])for(const type of ['worker','soldier','archer','catapult','specialist'])for(const owner of ['player','enemy'])for(const direction of directions)for(const state of type==='worker'?['idle','walk','attack','death','gather','build']:['idle','walk','attack','death'])for(let n=0;n<(state==='idle'?1:4);n++){
   const id=`${faction==='crown'?'':`${faction}-`}${type}-${owner}-${direction}-${state}-${n}`,m=manifest.frames[id],f=atlas.frames[id].frame,size=type==='catapult'?64:32,origin=unitOrigin(type);expect(m).toMatchObject({faction,type,owner,direction,state,frame:n,width:size,height:size,anchor:{x:size*origin.x,y:size*origin.y}});expect(f.x+f.w).toBeLessThanOrEqual(2048);expect(f.y+f.h).toBeLessThanOrEqual(7040);expect(motion(undefined,{x:0,y:0},'idle',0,type,owner).type).toBe(type);count++;
  }expect(Object.keys(atlas.frames)).toHaveLength(count);expect(count).toBe(3504);
 });
 it('maps runtime animation frames to real exported IDs and declares FPS/loop',()=>{for(const faction of ['crown','clans','elves'])for(const type of ['worker','soldier','archer','catapult','specialist'])for(const owner of ['player','enemy'])for(const facing of directions)for(const action of type==='worker'?['idle','walk','attack','death','gather','build']:['idle','walk','attack','death'])for(const time of [0,.125,.25,.375,1])expect(manifest.frames[unitFrame({position:{x:0,y:0},since:0,faction,type,owner,facing,action},time)]).toBeDefined();expect(manifest.atlases.units.animations.death).toEqual({frames:4,fps:8,loop:false});});
 it('exports actual RGBA PNG and source with no game imports',()=>{const png=readFileSync(new URL('../public/assets/units-atlas.png',import.meta.url));expect(png[25]).toBe(6);expect(png.readUInt32BE(16)).toBe(2048);expect(readFileSync(new URL('../assets/sources/units.mjs',import.meta.url),'utf8')).toContain('Original');});
});
