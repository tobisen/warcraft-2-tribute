import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
import {expect,it} from 'vitest';
const read=p=>readFileSync(new URL(`../${p}`,import.meta.url));
const palette=JSON.parse(read('assets/palette.json')),manifest=JSON.parse(read('public/assets/manifest.json'));
function sheet(kind){
 const atlas=JSON.parse(read(`public/assets/${kind}-atlas.json`)),png=read(`public/assets/${kind}-atlas.png`),chunks=[];
 for(let at=8;at<png.length;){const n=png.readUInt32BE(at);if(png.subarray(at+4,at+8).toString()==='IDAT')chunks.push(png.subarray(at+8,at+8+n));at+=n+12;}
 const raw=inflateSync(Buffer.concat(chunks)),width=png.readUInt32BE(16),height=png.readUInt32BE(20),stride=width*4+1;
 expect(manifest.atlases[kind]).toMatchObject({width,height});
 return id=>{const f=atlas.frames[id].frame,data=Buffer.alloc(f.w*f.h*4);for(let y=0;y<f.h;y++)raw.copy(data,y*f.w*4,(f.y+y)*stride+1+f.x*4,(f.y+y)*stride+1+(f.x+f.w)*4);return data;};
}
for(const atlas of ['units','naval'])it(`${atlas}: actual role/facing/motion/combat/death rasters are readable and palette-only`,()=>{
 const frame=sheet(atlas),directions=['e','se','s','sw','w','nw','n','ne'],types=atlas==='units'?['worker','soldier','archer','catapult']:['transport','warship'],colors=new Set(Object.values(palette));
 for(const faction of ['crown','clans','elves'])for(const owner of ['player','enemy']){
  const prefix=faction==='crown'?'':`${faction}-`,roles=[];
  const roster=atlas==='units'?[...types,'specialist']:types;
  for(const role of roster){
   const id=(dir,state,n)=>`${prefix}${role}-${owner}-${dir}-${state}-${n}`;
   const idle=frame(id('s','idle',0));roles.push(idle.toString('base64'));expect(idle[3]).toBe(0);
   const seen=new Set();for(let i=0;i<idle.length;i+=4)if(idle[i+3]){const c='#'+idle.subarray(i,i+3).toString('hex');expect(colors.has(c)).toBe(true);seen.add(c);}
   expect(seen.has(owner==='player'?palette.teamBlue:palette.teamRed)).toBe(true);
   expect(new Set(directions.map(dir=>frame(id(dir,'idle',0)).toString('base64'))).size,`${faction}/${owner}/${role}/idle-facing`).toBe(8);
   for(const dir of directions)for(const state of ['walk','attack','death']){
    const variants=new Set([0,1,2,3].map(n=>frame(id(dir,state,n)).toString('base64')));
    if(role==='transport'&&state==='attack')continue; // Noncombat transport has no attack action.
    expect(variants.size,`${faction}/${owner}/${role}/${dir}/${state}`).toBeGreaterThanOrEqual(3);
   }
  }
  expect(new Set(roles).size).toBe(roster.length);
 }
});
