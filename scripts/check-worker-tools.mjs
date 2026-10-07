import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.W2T_BROWSER_EXECUTABLE??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const out='artifacts/rts-215';await mkdir(out,{recursive:true});const results=[];
try{for(const faction of ['crown','clans','elves','dwarves','goblins']){
 const page=await browser.newPage({viewport:{width:800,height:600}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.clear());await page.route('**/src/main.ts*',async r=>{const res=await r.fetch();await r.fulfill({response:res,body:(await res.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
 await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5180');await page.locator('#menu-settings').click();await page.selectOption('#display-resolution','800x600');await page.selectOption('#display-mode','native');await page.locator('#menu-back').click();await page.locator('#menu-skirmish').click();await page.selectOption('#faction-select',faction);await page.selectOption('#map-select','arena');await page.locator('#start-match').click();await page.waitForFunction(()=>window.__gameCheck?.scene.keys.BootScene.session.phase==='playing'&&!window.__gameCheck.scene.keys.BootScene.restartPending);
 const point=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.update=()=>{};s.sys.sceneUpdate=()=>{};s.gathering.wood=1000;s.gathering.goldBalance=1000;s.cameras.main.setScroll(s.gathering.base.x-320,s.gathering.base.y-220);s.syncVisuals();const c=s.cameras.main;return {x:c.x+(s.gathering.base.x-c.scrollX)*c.zoom,y:c.y+(s.gathering.base.y-c.scrollY)*c.zoom};});
 const box=await page.locator('#game canvas').boundingBox(),size=await page.locator('#game canvas').evaluate(c=>({w:c.width,h:c.height}));await page.mouse.click(box.x+point.x*box.width/size.w,box.y+point.y*box.height/size.h);
 assert.equal(await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.selectedBuilding),'base');assert.match(await page.locator('#selection-stats').textContent(),/Worker Tools 0\/3.*10%.*15s/);assert.match(await page.locator('#research-workerTools').getAttribute('aria-label'),/Level 0\/3.*Next: 10%/);
 for(const [level,time,wood,gold]of [[1,15,60,30],[2,20,100,60],[3,30,140,100]]){
  const before=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;return {wood:s.gathering.wood,gold:s.gathering.goldBalance};});
  await page.locator('#research-workerTools').click();const started=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;return {job:s.research.job,wood:s.gathering.wood,gold:s.gathering.goldBalance};});
  assert.deepEqual(started.job,{kind:'workerTools',remainingSeconds:time});assert.equal(started.wood,before.wood-wood);assert.equal(started.gold,before.gold-gold);assert(await page.locator('#research-workerTools').isDisabled());
  await page.screenshot({path:`${out}/${faction}-level-${level}.png`});
  await page.evaluate(async time=>{const s=window.__gameCheck.scene.keys.BootScene,{updateMatch}=await import('/src/gameplay/match.ts');s.applyMatch(updateMatch(s.currentMatch(),time));s.syncVisuals();},time);
  assert.equal(await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.research.workerTools),level);
 }
 assert(await page.locator('#research-workerTools').isDisabled());
 await page.locator('#tech-tree-button').click();await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.syncVisuals());await page.getByRole('button',{name:'Research',exact:true}).click();await page.locator('[data-tech-node="research-workerTools-3"]').click();assert.match(await page.locator('#technology-details').textContent(),/30% shorter/);await page.screenshot({path:`${out}/${faction}-tech-tree.png`});await page.keyboard.press('Escape');
 await page.keyboard.press('p');await page.locator('#save-match').click();assert.match(await page.locator('#save-status').textContent(),/saved/i);await page.locator('#load-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending&&window.__gameCheck.scene.keys.BootScene.session.phase==='paused');assert.equal(await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.research.workerTools),3);
 await page.locator('#restart-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending&&window.__gameCheck.scene.keys.BootScene.session.phase==='playing');assert.equal(await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.research.workerTools??0),0);
 assert.deepEqual(errors,[]);results.push({faction,physicalBaseSelection:true,threeMouseResearchLevels:true,exactCosts:true,techTree:true,saveLoad:true,restart:true,errors});console.log('PASS Worker Tools '+faction);await page.close();
}await writeFile(`${out}/browser.json`,JSON.stringify(results,null,2)+'\n');}finally{await browser.close();}
