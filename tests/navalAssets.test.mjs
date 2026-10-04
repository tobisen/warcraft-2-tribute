import {readFileSync} from 'node:fs';
import {expect,it} from 'vitest';
import {motion,unitFrame,artAtlas} from '../src/presentation/animation';
const read=p=>JSON.parse(readFileSync(new URL(`../${p}`,import.meta.url),'utf8'));
const atlas=read('public/assets/naval-atlas.json'),manifest=read('public/assets/manifest.json');
it('every naval role/team/faction/facing/action resolves to a bounded original RGBA sprite',()=>{
 expect(Object.keys(atlas.frames)).toHaveLength(2080);const png=readFileSync(new URL('../public/assets/naval-atlas.png',import.meta.url));expect(png[25]).toBe(6);expect(png.readUInt32BE(16)).toBe(atlas.meta.size.w);expect(png.readUInt32BE(20)).toBe(atlas.meta.size.h);
 for(const faction of ['crown','clans','elves','dwarves','goblins'])for(const owner of ['player','enemy'])for(const role of ['warship','transport'])for(let direction=0;direction<8;direction++)for(const action of ['idle','walk','attack','death'])for(let index=0;index<(action==='idle'?1:4);index++){
  const m=motion(undefined,{x:0,y:0},action,0,role,owner,{x:Math.cos(direction*Math.PI/4),y:Math.sin(direction*Math.PI/4)},faction),id=unitFrame(m,index/8+.01),f=atlas.frames[id]?.frame;expect(f,id).toBeDefined();expect(artAtlas(role)).toBe('naval');expect(f.x+f.w).toBeLessThanOrEqual(atlas.meta.size.w);expect(f.y+f.h).toBeLessThanOrEqual(atlas.meta.size.h);expect(manifest.frames[id]).toMatchObject({kind:'ship',owner,faction,role,anchor:{x:32,y:40}});
 }
 expect(readFileSync(new URL('../assets/sources/naval.mjs',import.meta.url),'utf8')).toContain('Original');
});
