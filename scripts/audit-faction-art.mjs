import {readFileSync,writeFileSync,mkdtempSync,mkdirSync,rmSync} from 'node:fs';import {execFileSync} from 'node:child_process';import {inflateSync} from 'node:zlib';import {createHash} from 'node:crypto';import {Surface,png} from './pixelArt.mjs';import {tmpdir} from 'node:os';import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)).replace(/\/$/,''),p=JSON.parse(readFileSync(`${root}/assets/palette.json`));
const head=file=>execFileSync('git',['show',`${process.env.W2T_ART_BASELINE??'c5b3c71'}:${file}`],{cwd:root,maxBuffer:32*1024*1024});
function sheet(bytes,atlas){const chunks=[];for(let at=8;at<bytes.length;){const n=bytes.readUInt32BE(at);if(bytes.subarray(at+4,at+8).toString()==='IDAT')chunks.push(bytes.subarray(at+8,at+8+n));at+=n+12;}const raw=inflateSync(Buffer.concat(chunks)),stride=bytes.readUInt32BE(16)*4+1;return id=>{const f=atlas.frames[id].frame,data=Buffer.alloc(f.w*f.h*4);for(let y=0;y<f.h;y++)raw.copy(data,y*f.w*4,(f.y+y)*stride+1+f.x*4,(f.y+y)*stride+1+(f.x+f.w)*4);return {data,w:f.w,h:f.h};};}
const out=`${root}/artifacts/rts-155/factions`;mkdirSync(out,{recursive:true});
const references=execFileSync('rg',['--files',`${root}/docs/art`],{encoding:'utf8'}).trim().split('\n').filter(p=>p.includes('ChatGPT'));
const result={baseline:process.env.W2T_ART_BASELINE??'c5b3c71',references:Object.fromEntries(references.map(file=>[file.split('/').at(-1),createHash('sha256').update(readFileSync(file)).digest('hex')])),atlases:{}};
const temp=mkdtempSync(`${tmpdir()}/w2t-faction-source-`);for(const file of ['units','buildings','humans'])writeFileSync(`${temp}/${file}.mjs`,head(`assets/sources/${file}.mjs`));
try {
for(const kind of ['units','buildings']){
 const src=`assets/sources/${kind}.mjs`,oldModule=await import(`${temp}/${kind}.mjs`),newModule=await import(`${root}/${src}`),name=kind==='units'?'unitFrames':'buildingFrames';
 const oldSources=oldModule[name](Surface,p),newSources=newModule[name](Surface,p),oldAtlas=JSON.parse(head(`public/assets/${kind}-atlas.json`)),newAtlas=JSON.parse(readFileSync(`${root}/public/assets/${kind}-atlas.json`)),old=sheet(head(`public/assets/${kind}-atlas.png`),oldAtlas),current=sheet(readFileSync(`${root}/public/assets/${kind}-atlas.png`),newAtlas);
 const changed=kind==='units'?id=>/^(clans|elves|dwarves|goblins)-(worker|soldier)-/.test(id):id=>/^(clans|elves|dwarves|goblins)-base-/.test(id);
 const beforeMismatch=oldSources.filter(f=>changed(f.id)&&!old(f.id).data.equals(Buffer.from(f.image.data))).map(f=>f.id),afterMismatch=newSources.filter(f=>changed(f.id)&&!current(f.id).data.equals(Buffer.from(f.image.data))).map(f=>f.id),unrelatedChanges=newSources.filter(f=>!changed(f.id)&&!current(f.id).data.equals(old(f.id).data)).map(f=>f.id);
 result.atlases[kind]={beforeSourceExportMismatches:beforeMismatch,afterSourceExportMismatches:afterMismatch,unrelatedRasterChanges:unrelatedChanges,frameIdsPreserved:Object.keys(oldAtlas.frames).every(id=>newAtlas.frames[id]),changedFactionFrames:newSources.filter(f=>changed(f.id)&&!current(f.id).data.equals(old(f.id).data)).length};
 for(const faction of ['clans','elves','dwarves','goblins']) {
 const ids=kind==='units'?[`${faction}-worker-player-s-idle-0`,`${faction}-soldier-player-s-idle-0`]:[`${faction}-base-player-complete`];
 for(const stage of ['before','after']){const board=new Surface(384,256);for(const [n,id]of ids.entries()){const exportFrame=(stage==='before'?old:current)(id),exportSurface=new Surface(exportFrame.w,exportFrame.h);exportSurface.data=exportFrame.data;const source=(stage==='before'?oldSources:newSources).find(f=>f.id===id);board.blit(source.image,n*128,0);board.blit(exportSurface,n*128,128);}writeFileSync(`${root}/artifacts/rts-155/${faction}/${stage}-${kind}-source-export.png`,png(board));}
 }

}
writeFileSync(`${out}/source-export-audit.json`,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));

} finally {rmSync(temp,{recursive:true,force:true});}
