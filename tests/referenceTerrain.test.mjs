import {readFileSync} from 'node:fs';
import {expect,it} from 'vitest';
import {Surface,png} from '../scripts/pixelArt.mjs';
import {referenceFrames} from '../assets/sources/reference-terrain.mjs';
import {decodeSave} from '../src/gameplay/save';
import {createMap} from '../src/gameplay/map';
it('genuine Save45 retains original Frontier geometry and loads before the new layout exists',()=>{
 const save=readFileSync(new URL('../artifacts/prio-03/before-save45.json',import.meta.url),'utf8'),loaded=decodeSave(save);expect(loaded.ok).toBe(true);
 if(loaded.ok){expect(loaded.match.map.terrainLayout).toBe('legacy');expect(loaded.match.gathering.node.grove).toBeUndefined();for(const o of createMap('frontier','legacy').obstacles)expect(loaded.match.map.obstacles).toContainEqual(o);}
});
it('the original raster atlas reproduces byte-for-byte from its own pixel sources',()=>{
 const sources=referenceFrames(Surface),atlas=JSON.parse(readFileSync(new URL('../public/assets/reference-terrain-atlas.json',import.meta.url),'utf8')),image=new Surface(atlas.meta.size.w,atlas.meta.size.h);
 expect(Object.keys(atlas.frames)).toHaveLength(sources.length);for(const f of sources){const rect=atlas.frames[f.id].frame;expect(rect.w).toBe(f.image.width);expect(rect.h).toBe(f.image.height);image.blit(f.image,rect.x,rect.y);}expect(png(image)).toEqual(readFileSync(new URL('../public/assets/reference-terrain-atlas.png',import.meta.url)));
});
