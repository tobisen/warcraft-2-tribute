import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({executablePath:process.env.W2T_BROWSER_EXECUTABLE,headless:true});
const out='artifacts/rts-205',stage=process.env.W2T_ART_STAGE??'after';await mkdir(out,{recursive:true});const reports=[];
try{for(const [width,height]of [[800,600],[1280,720]]){
 const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/src/main.ts*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
 if(stage==='before')for(const atlas of ['units','buildings','naval','air','world','reference-terrain'])await page.route(`**/assets/${atlas}-atlas.png`,r=>r.fulfill({contentType:'image/png',body:execFileSync('git',['show',`${process.env.W2T_ART_BASELINE??'76d05c9'}:public/assets/${atlas}-atlas.png`],{maxBuffer:32*1024*1024})}));
 await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5190');await page.locator('#menu-settings').click();await page.selectOption('#display-resolution',`${width}x${height}`);await page.selectOption('#display-mode','native');await page.locator('#menu-back').click();await page.locator('#menu-skirmish').click();await page.locator('#start-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending);
 const oldChest=stage==='before'?execFileSync('git',['show',`${process.env.W2T_ART_BASELINE??'76d05c9'}:src/presentation/discoveries.ts`],{encoding:'utf8'}).split('export function paintDiscoveryChest')[1].replace('(ctx:CanvasRenderingContext2D,opened:boolean):void','(ctx,opened)'):null;
 const report=await page.evaluate(async({width,oldChest})=>{
  const s=window.__gameCheck.scene.keys.BootScene;s.update=()=>{};s.sys.sceneUpdate=()=>{};s.cameras.main.setScroll(0,0);
  const {unitFrame,motion,unitOrigin}=await import('/src/presentation/animation.ts'),{buildingFrame,buildingOrigin}=await import('/src/presentation/assets.ts');
  const g=s.add.graphics().setScrollFactor(0).setDepth(500);g.fillStyle(0x426b35).fillRect(0,0,width,600);
  const sprites=[],put=(atlas,frame,x,y,origin,label)=>{assertTexture(atlas,frame);const img=s.add.image(x,y,atlas,frame).setOrigin(origin.x,origin.y).setScrollFactor(0).setDepth(501);s.add.text(x-30,y+20,label,{fontSize:'11px',color:'#fff1cc'}).setScrollFactor(0).setDepth(502);sprites.push({atlas,frame,scale:img.scaleX,origin:{x:img.originX,y:img.originY}});},assertTexture=(a,f)=>{if(!s.textures.get(a).has(f))throw new Error(`${a}/${f}`);};
  ['worker','soldier','archer'].forEach((role,i)=>put('units',unitFrame(motion(undefined,{x:0,y:0},'idle',0,role,'player'),0),75+i*105,90,unitOrigin(role),role));
  ['base','barracks'].forEach((kind,i)=>put('buildings',buildingFrame(kind,'player'),440+i*170,115,buildingOrigin(kind),kind));
  put('reference-terrain','tree-0',95,260,{x:.5,y:1},'tree');put('reference-terrain','forest-0',195,260,{x:.5,y:1},'grove');put('reference-terrain','mine-full',340,260,{x:.5,y:.75},'gold mine');if(oldChest){const t=s.textures.createCanvas('baseline-chest',32,32);new Function(`return function ${oldChest}`)()(t.context,false);t.refresh();}put(oldChest?'baseline-chest':'reference-terrain',oldChest?'__BASE':'chest-closed',465,260,{x:.5,y:.75},'treasure');
  s.gathering.units.forEach(u=>u.selected=u.kind==='worker');s.syncVisuals();
  return {width,sprites};
 },{width,oldChest});assert(report.sprites.every(s=>s.scale===1));await page.screenshot({path:`${out}/${stage}-sample-${width}.png`});if(stage!=='before'){
  await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;for(const o of [...s.children.list])if(o.depth>=500)o.destroy();s.gathering.units.forEach(u=>u.selected=false);s.selectedBuilding=null;s.cameras.main.centerOn(s.gathering.units[0].position.x,s.gathering.units[0].position.y);s.syncVisuals();});
  const click=async position=>{const p=await page.evaluate(p=>{const s=window.__gameCheck.scene.keys.BootScene,c=s.cameras.main,r=s.game.canvas.getBoundingClientRect();return {x:r.left+(p.x-c.worldView.x)*r.width/s.game.canvas.width,y:r.top+(p.y-c.worldView.y)*r.height/s.game.canvas.height};},position);await page.mouse.click(p.x,p.y);};
  await click(await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.gathering.units[0].position));assert(await page.locator('#selection-portrait').isVisible());assert(await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.gathering.units[0].selected));await page.screenshot({path:`${out}/${stage}-worker-world-${width}.png`});
  const mine=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene,n=s.gathering.gold;for(const t of Object.values(s.fog.teams)){t.visible.fill(true);t.explored.fill(true);}s.cameras.main.centerOn(n.position.x,n.position.y);s.syncVisuals();return n.position;});await click(mine);assert.match(await page.locator('#selection-name').textContent(),/Gold mine/);assert(await page.locator('#selection-portrait').isVisible());await page.screenshot({path:`${out}/${stage}-mine-world-${width}.png`});report.physicalWorkerAndMineSelection=true;report.resourcePortrait=true;
 }
 assert.deepEqual(errors,[]);reports.push({...report,errors});await page.close();
}await writeFile(`${out}/${stage}-browser.json`,JSON.stringify(reports,null,2));console.log(`${stage} representative native800/1280 textures, scales, anchors and errors PASS`);}finally{await browser.close();}
