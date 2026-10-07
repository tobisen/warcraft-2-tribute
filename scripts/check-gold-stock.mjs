import assert from 'node:assert/strict';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
// launch() uses a temporary profile. Each test additionally has an explicitly empty,
// isolated context: none of these saves come from or persist in a user's browser.
const browser=await chromium.launch({headless:true,executablePath:process.env.W2T_BROWSER_EXECUTABLE});
try{for(const [width,height]of [[800,600],[1280,720]])for(const map of ['arena','frontier','coast','plains128']){
 const context=await browser.newContext({viewport:{width,height},storageState:{cookies:[],origins:[]}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/src/main.ts*',async r=>{const response=await r.fetch();await r.fulfill({response,body:(await response.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
 await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5190');await page.locator('#menu-skirmish').click();await page.selectOption('#map-select',map);await page.locator('#start-match').click();await page.waitForFunction(()=>!!window.__gameCheck&&!window.__gameCheck.scene.keys.BootScene.restartPending);
 const initial=await page.evaluate(async()=>{const s=window.__gameCheck.scene.keys.BootScene,{applyCheat}=await import('/src/gameplay/cheats.ts'),{resourceNodes}=await import('/src/gameplay/gathering.ts');s.update=()=>{};s.sys.sceneUpdate=()=>{};s.applyMatch(applyCheat(s.currentMatch(),'foggoffnow'));s.gathering.units=s.gathering.units.map(u=>({...u,selected:false}));s.selectedBuilding=null;s.selectedResource='gold-1';s.syncVisuals();return {gold:s.gathering.gold.remaining,all:resourceNodes(s.gathering).filter(n=>n.resource==='gold').map(n=>n.remaining)};});
 assert.equal(initial.gold,map==='coast'?4000:3000);assert(initial.all.every(n=>n>=1500));assert.equal(await page.locator('#selection-name').textContent(),'Gold mine');assert.equal(await page.locator('#selection-detail').textContent(),`${initial.gold} remaining`);
 if(map==='arena'){
  await page.keyboard.press('p');await page.locator('#save-match').click();assert.match(await page.locator('#save-status').textContent(),/saved/i);
  // This fixture changes only this test context's own freshly created save.
  await page.evaluate(async()=>{const {saveConfig}=await import('/src/config/save.ts'),{mapResources}=await import('/src/config/maps.ts');const raw=JSON.parse(localStorage.getItem(saveConfig.key));
   const old=doc=>{const g=doc.state.gathering,m=doc.state.map,resources=mapResources(doc.map,m.resourceLayout,m.worldLayout,m.design);delete g.expandedGoldStock;for(const n of [g.gold,...g.extraNodes,...(doc.state.enemyKnowledge?.nodes??[])])if(n.resource==='gold')n.remaining-=resources.find(r=>r.id===n.id).amount*.9;g.gold.remaining-=5;g.goldBalance+=5;return doc;};
   if(raw.multiplePlayers){raw.human=JSON.stringify(old(JSON.parse(raw.human)));for(const bot of raw.ai)bot.document=JSON.stringify(old(JSON.parse(bot.document)));}else old(raw);localStorage.setItem(saveConfig.key,JSON.stringify(raw));
  });
  await page.locator('#load-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending&&window.__gameCheck.scene.keys.BootScene.gathering.expandedGoldStock);
  const actual=await page.evaluate(async()=>{const s=window.__gameCheck.scene.keys.BootScene,{matchStats}=await import('/src/gameplay/matchStats.ts');s.selectedResource='gold-1';s.syncVisuals();return {remaining:s.gathering.gold.remaining,stats:matchStats(s.currentMatch()).player.gold};});assert.equal(actual.remaining,initial.gold-5);assert.equal(actual.stats.gathered,5);
  assert.equal(await page.locator('#selection-detail').textContent(),`${initial.gold-5} remaining`);await page.locator('#save-match').click();await page.locator('#load-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending);assert.equal(await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.gathering.gold.remaining),initial.gold-5);
 }
 assert.deepEqual(errors,[]);await context.close();
}console.log('PASS isolated empty contexts800/1280 Arena/Frontier/Coast/Plains128 enlarged mines and labels; test-save migration preserves five mined gold and applies once');}finally{await browser.close();}
