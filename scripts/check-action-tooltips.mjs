import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.W2T_BROWSER_EXECUTABLE});
const out='artifacts/rts-198';await mkdir(out,{recursive:true});const results=[];
try {for(const width of [800,1280]) {
const page=await browser.newPage({viewport:{width,height:720}});await page.route('**/src/main.ts*',async r=>{const response=await r.fetch();await r.fulfill({response,body:(await response.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5188/');await page.locator('#menu-settings').click();await page.selectOption('#display-resolution',width===800?'800x600':'1280x720');await page.selectOption('#display-mode','native');await page.locator('#menu-back').click();await page.locator('#menu-skirmish').click();await page.selectOption('#map-select','frontier');await page.selectOption('#difficulty-select','beginner');await page.locator('#start-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending);await page.evaluate(async()=>{const {updatePreferences}=await import('/src/presentation/preferences.ts');updatePreferences({camera:{edgePan:false}});const s=window.__gameCheck.scene.keys.BootScene;s.gathering.wood=100;s.gathering.goldBalance=20;s.gathering.units.forEach(u=>u.selected=u.id==='unit-3');s.syncVisuals();});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const farm=page.locator('#build-farm'),wrapper=farm.locator('..'),tooltip=page.locator('#action-tooltip');
await page.mouse.move(10,100);
await wrapper.evaluate(el=>el.addEventListener('pointerover',()=>window.__hoverAt=performance.now(),{once:true}));
await wrapper.hover();await tooltip.waitFor({state:'visible'});
const shown=await page.evaluate(()=>({delay:performance.now()-window.__hoverAt,text:document.getElementById('action-tooltip').textContent,rect:document.getElementById('action-tooltip').getBoundingClientRect().toJSON()}));
assert(shown.delay<400);assert(shown.text.includes('[F]'));assert(shown.text.includes('20 wood'));assert(!shown.text.includes('select a worker'));
assert(shown.rect.x>=0&&shown.rect.right<=width);assert.equal(await farm.getAttribute('title'),null);
await page.screenshot({path:`${out}/${width}-hover.png`});
await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.gathering.wood=0;s.syncVisuals();});
await page.waitForFunction(()=>document.getElementById('action-tooltip').textContent.includes('Not enough wood'));
assert(await farm.isDisabled());assert.equal(await wrapper.getAttribute('tabindex'),'0');
await page.mouse.move(10,100);await tooltip.waitFor({state:'hidden'});
await wrapper.focus();await tooltip.waitFor({state:'visible'});assert((await tooltip.textContent()).includes('Not enough wood'));
await page.screenshot({path:`${out}/${width}-disabled-focus.png`});
await page.keyboard.press('Escape');await tooltip.waitFor({state:'hidden'});
assert.deepEqual(errors,[]);results.push({width,hover:shown,disabledFocus:true,liveReason:true,escapeDismiss:true,errors});await page.close();
}await writeFile(`${out}/browser.json`,JSON.stringify(results,null,2));console.log(JSON.stringify(results));}finally{await browser.close();}
