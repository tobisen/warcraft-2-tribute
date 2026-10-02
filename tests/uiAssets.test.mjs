import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
const read=p=>JSON.parse(readFileSync(new URL(`../${p}`,import.meta.url))),m=read('public/assets/manifest.json'),a=read('public/assets/ui-atlas.json');
describe('original fantasy UI exports',()=>{
 it('has eight native icons, a 16px panel and four frames per effect with valid bounds',()=>{expect(Object.keys(a.frames)).toHaveLength(17);for(const [id,f] of Object.entries(a.frames)){expect(f.frame.x+f.frame.w).toBeLessThanOrEqual(512);expect(f.frame.y+f.frame.h).toBeLessThanOrEqual(128);expect(m.frames[id].width).toBe(f.frame.w);if(id.startsWith('icon-'))expect(f.frame.w).toBe(32);}expect(m.frames.panel).toMatchObject({width:48,height:48,border:16});for(let n=0;n<4;n++){expect(m.frames[`impact-${n}`].width).toBe(32);expect(m.frames[`splash-${n}`].width).toBe(64);}expect(m.atlases.ui).toMatchObject({effectFPS:8,effectLifetime:.5});});
 it('uses original sources and an actual PNG panel',()=>{expect(readFileSync(new URL('../assets/sources/ui.mjs',import.meta.url),'utf8')).toContain('Original');const png=readFileSync(new URL('../public/assets/panel.png',import.meta.url));expect(png[25]).toBe(6);expect(png.readUInt32BE(16)).toBe(48);});
});
