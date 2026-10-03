import {inflateSync} from 'node:zlib';
import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';
const read=p=>JSON.parse(readFileSync(new URL(`../${p}`,import.meta.url))),m=read('public/assets/manifest.json'),a=read('public/assets/ui-atlas.json');
describe('original fantasy UI exports',()=>{
 it('has eight native icons, a 16px panel and four frames per effect with valid bounds',()=>{expect(Object.keys(a.frames)).toHaveLength(21);for(const [id,f] of Object.entries(a.frames)){expect(f.frame.x+f.frame.w).toBeLessThanOrEqual(512);expect(f.frame.y+f.frame.h).toBeLessThanOrEqual(160);expect(m.frames[id].width).toBe(f.frame.w);if(id.startsWith('icon-'))expect(f.frame.w).toBe(32);}expect(m.frames.panel).toMatchObject({width:48,height:48,border:16});for(let n=0;n<4;n++){expect(m.frames[`impact-${n}`].width).toBe(32);expect(m.frames[`dust-${n}`].width).toBe(32);expect(m.frames[`splash-${n}`].width).toBe(64);}expect(m.atlases.ui).toMatchObject({effectFPS:8,effectLifetime:.5});});
 it('uses original sources and an actual PNG panel',()=>{expect(readFileSync(new URL('../assets/sources/ui.mjs',import.meta.url),'utf8')).toContain('Original');const png=readFileSync(new URL('../public/assets/panel.png',import.meta.url));expect(png[25]).toBe(6);expect(png.readUInt32BE(16)).toBe(48);});
 it('keeps transient effects sparse, transparent, palette-only and distinct across four phases',()=>{
  const png=readFileSync(new URL('../public/assets/ui-atlas.png',import.meta.url)),chunks=[];
  for(let pos=8;pos<png.length;){const n=png.readUInt32BE(pos);if(png.subarray(pos+4,pos+8).toString()==='IDAT')chunks.push(png.subarray(pos+8,pos+8+n));pos+=n+12;}
  const raw=inflateSync(Buffer.concat(chunks)),stride=512*4+1,colors=new Set(Object.values(read('assets/palette.json')));
  for(const kind of ['impact','splash','dust']){
   const variants=[];
   for(let n=0;n<4;n++){
    const f=a.frames[`${kind}-${n}`].frame,bytes=Buffer.alloc(f.w*f.h*4);let opaque=0;
    for(let y=0;y<f.h;y++)for(let x=0;x<f.w;x++){const p=(f.y+y)*stride+1+(f.x+x)*4,at=(y*f.w+x)*4;raw.copy(bytes,at,p,p+4);if(raw[p+3]){opaque++;expect(colors.has('#'+raw.subarray(p,p+3).toString('hex'))).toBe(true);}}
    expect(bytes[3]).toBe(0);expect(opaque).toBeGreaterThan(0);expect(opaque/(f.w*f.h)).toBeLessThan(.15);variants.push(bytes.toString('base64'));
   }
   expect(new Set(variants).size).toBe(4);
  }
 });

});
