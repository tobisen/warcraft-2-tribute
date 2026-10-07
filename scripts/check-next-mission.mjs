const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.W2T_BROWSER_EXECUTABLE,headless:true});
try{for(const [width,height] of [[800,600],[1280,720]]){
 const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/src/main.ts*',async r=>{const response=await r.fetch();await r.fulfill({response,body:(await response.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
 await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5190');await page.locator('#menu-campaign').click();await page.locator('#campaign-next-faction').click();await page.locator('#campaign-next-difficulty').click();await page.locator('#campaign-continue').click();await page.locator('#start-match').click();
 await page.waitForFunction(()=>window.__gameCheck.scene.keys.BootScene.session.phase==='playing'&&!window.__gameCheck.scene.keys.BootScene.restartPending);
 const initial=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;return {factions:s.factions,difficulty:s.difficulty,speed:s.session.options.speed,campaignId:s.campaignRun.campaignId};});
 const finish=async(outcome)=>page.evaluate(outcome=>{const s=window.__gameCheck.scene.keys.BootScene;s.outcome=outcome;s.session.phase='ended';s.syncSession();},outcome);
 await finish('victory');await page.waitForFunction(()=>!document.getElementById('result-next-mission').hidden);assert(await page.locator('#result-next-mission').isVisible());await page.screenshot({path:`/tmp/w2t-next-${width}.png`});
 await page.locator('#save-match').click();await page.locator('#load-match').click();await page.waitForFunction(()=>window.__gameCheck.scene.keys.BootScene.session.phase==='ended'&&!window.__gameCheck.scene.keys.BootScene.restartPending);assert(await page.locator('#result-next-mission').isVisible());
 await page.locator('#result-next-mission').click();await page.waitForFunction(()=>window.__gameCheck.scene.keys.BootScene.campaignMission==='forest-watch'&&!window.__gameCheck.scene.keys.BootScene.restartPending);
 const next=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;return {factions:s.factions,difficulty:s.difficulty,speed:s.session.options.speed,campaignId:s.campaignRun.campaignId,phase:s.session.phase,outcome:s.outcome};});assert.deepEqual(next,{...initial,phase:'playing',outcome:'playing'});assert(!(await page.locator('#result-screen').isVisible()));
 await finish('defeat');assert(!(await page.locator('#result-next-mission').isVisible()));await page.locator('#result-play-again').click();await page.waitForFunction(()=>window.__gameCheck.scene.keys.BootScene.session.phase==='playing'&&!window.__gameCheck.scene.keys.BootScene.restartPending);assert.equal(await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.campaignMission),'forest-watch');
 await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.campaignMission='coastal-banner';s.scenario='mission-capture';s.outcome='victory';s.session.phase='ended';s.syncSession();});assert(!(await page.locator('#result-next-mission').isVisible()));
 assert.deepEqual(errors,[]);await page.close();
}console.log('PASS800/1280 campaign victory → Next Mission → playing successor; identity preserved; defeat/final hidden; retry works');}finally{await browser.close();}
