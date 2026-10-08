import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.W2T_BROWSER_EXECUTABLE??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const out='artifacts/rts-233';await mkdir(out,{recursive:true});const results=[];
try{for(const faction of ['crown']){
 const page=await browser.newPage({viewport:{width:800,height:600}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.clear());await page.route('**/src/main.ts*',async r=>{const res=await r.fetch();await r.fulfill({response:res,body:(await res.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
 await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5180');await page.locator('#menu-settings').click();await page.selectOption('#display-resolution','800x600');await page.selectOption('#display-mode','native');await page.locator('#menu-back').click();await page.locator('#menu-skirmish').click();await page.selectOption('#faction-select',faction);await page.selectOption('#map-select','arena');await page.locator('#start-match').click();await page.waitForFunction(()=>window.__gameCheck?.scene.keys.BootScene.session.phase==='playing'&&!window.__gameCheck.scene.keys.BootScene.restartPending);
 const point=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.update=()=>{};s.sys.sceneUpdate=()=>{};s.gathering.wood=1000;s.gathering.goldBalance=1000;s.cameras.main.setScroll(s.gathering.base.x-320,s.gathering.base.y-220);s.syncVisuals();const c=s.cameras.main;return {x:c.x+(s.gathering.base.x-c.scrollX)*c.zoom,y:c.y+(s.gathering.base.y-c.scrollY)*c.zoom};});
 const box=await page.locator('#game canvas').boundingBox(),size=await page.locator('#game canvas').evaluate(c=>({w:c.width,h:c.height}));await page.mouse.click(box.x+point.x*box.width/size.w,box.y+point.y*box.height/size.h);


 await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.selectedBuilding=null;s.gathering.units=[{kind:'soldier',archetype:'archer',id:'unit-20',hp:40,cargo:0,selected:true,position:{x:320,y:320},target:{x:320,y:320},order:{kind:'idle'}}];s.research.attack=1;s.syncVisuals();});
 assert.match(await page.locator('#selection-health').textContent(),/HP 40/);assert.match(await page.locator('#unit-attack-details').textContent(),/Projectile.*15 damage\/hit.*160px.*1s cooldown/);assert.match(await page.locator('#selection-name').textContent(),/Archer/);await page.screenshot({path:`${out}/solo-800.png`});
 await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.gathering.units.push({...s.gathering.units[0],id:'unit-21',position:{x:352,y:320}});s.syncVisuals();});assert.equal(await page.locator('#unit-attack-details').isVisible(),false);assert.match(await page.locator('#selection-name').textContent(),/2 units selected/);await page.screenshot({path:`${out}/group-800.png`});assert.deepEqual(errors,[]);results.push({soloActualStats:true,groupCompact:true,errors});await page.close();
}await writeFile(`${out}/browser.json`,JSON.stringify(results,null,2)+'\n');}finally{await browser.close();}
