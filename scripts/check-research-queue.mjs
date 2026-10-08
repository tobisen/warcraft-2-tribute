import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.W2T_BROWSER_EXECUTABLE??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const out='artifacts/rts-232';await mkdir(out,{recursive:true});const results=[];
try{for(const faction of ['crown']){
 const page=await browser.newPage({viewport:{width:800,height:600}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.clear());await page.route('**/src/main.ts*',async r=>{const res=await r.fetch();await r.fulfill({response:res,body:(await res.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
 await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5180');await page.locator('#menu-settings').click();await page.selectOption('#display-resolution','800x600');await page.selectOption('#display-mode','native');await page.locator('#menu-back').click();await page.locator('#menu-skirmish').click();await page.selectOption('#faction-select',faction);await page.selectOption('#map-select','arena');await page.locator('#start-match').click();await page.waitForFunction(()=>window.__gameCheck?.scene.keys.BootScene.session.phase==='playing'&&!window.__gameCheck.scene.keys.BootScene.restartPending);
 const point=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.update=()=>{};s.sys.sceneUpdate=()=>{};s.gathering.wood=1000;s.gathering.goldBalance=1000;s.cameras.main.setScroll(s.gathering.base.x-320,s.gathering.base.y-220);s.syncVisuals();const c=s.cameras.main;return {x:c.x+(s.gathering.base.x-c.scrollX)*c.zoom,y:c.y+(s.gathering.base.y-c.scrollY)*c.zoom};});
 const box=await page.locator('#game canvas').boundingBox(),size=await page.locator('#game canvas').evaluate(c=>({w:c.width,h:c.height}));await page.mouse.click(box.x+point.x*box.width/size.w,box.y+point.y*box.height/size.h);

 await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;const footprint={x:256,y:384,width:64,height:64};s.placement.forge={id:'forge',owner:'player',hp:120,footprint,construction:{remainingSeconds:0,builderId:null}};s.map.obstacles.push(footprint);s.syncVisuals();});
 await page.locator('#research-attack').click();await page.locator('#research-defense').click();await page.locator('#research-workerTools').click();
 assert.deepEqual(await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.research.queue),['defense','workerTools']);assert(await page.locator('#research-defense').isDisabled());
 assert.match(await page.locator('#research-queue-summary').textContent(),/0%.*8.0s.*1.*2/);
 await page.evaluate(async()=>{const s=window.__gameCheck.scene.keys.BootScene,{updateMatch}=await import('/src/gameplay/match.ts');s.applyMatch(updateMatch(s.currentMatch(),3));s.syncVisuals();});
 assert.match(await page.locator('#research-queue-summary').textContent(),/38%.*5.0s/);await page.screenshot({path:`${out}/queue-800.png`});
 await page.keyboard.press('p');await page.locator('#save-match').click();assert.match(await page.locator('#save-status').textContent(),/saved/i);await page.locator('#load-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending&&window.__gameCheck.scene.keys.BootScene.session.phase==='paused');
 assert.deepEqual(await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.research.queue),['defense','workerTools']);
 await page.evaluate(async()=>{const s=window.__gameCheck.scene.keys.BootScene,{updateMatch}=await import('/src/gameplay/match.ts');s.applyMatch(updateMatch({...s.currentMatch(),paused:false},5));s.syncVisuals();});assert.match(await page.locator('#research-queue-summary').textContent(),/Plate Craft.*0%.*8.0s/);
 await page.locator('#restart-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending&&window.__gameCheck.scene.keys.BootScene.session.phase==='playing');assert.equal(await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.research.job),null);assert.deepEqual(errors,[]);results.push({physicalClicks:true,FIFO:true,progress:true,saveLoadRestart:true,errors});await page.close();
}await writeFile(`${out}/browser.json`,JSON.stringify(results,null,2)+'\n');}finally{await browser.close();}
