import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.W2T_BROWSER_EXECUTABLE});
const out='artifacts/rts-195';await mkdir(out,{recursive:true});const reports=[];
try{for(const [width,height] of [[800,600],[1280,720],[1920,1080]]){
 const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/src/main.ts*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
 await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5188/');await page.locator('#menu-settings').click();await page.selectOption('#display-resolution',`${width}x${height}`);await page.selectOption('#display-mode','native');await page.locator('#menu-back').click();await page.locator('#menu-skirmish').click();await page.locator('#start-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending);
 await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.gathering.units.forEach(u=>u.selected=u.kind==='worker');s.syncVisuals();});
 const layout=await page.evaluate(()=>{const group=document.querySelector('[data-action-group="Build"]'),buttons=[...group.querySelectorAll('.control:not([hidden]) button')],box=group.getBoundingClientRect(),queue=document.querySelector('#production-queue').getBoundingClientRect();return {count:buttons.length,rows:new Set(buttons.map(b=>Math.round(b.getBoundingClientRect().top))).size,right:box.right,queueLeft:queue.left,queueWidth:queue.width,buttons:buttons.map(b=>({id:b.id,disabled:b.disabled,label:b.getAttribute('aria-label')}))};});
 assert.equal(layout.count,7);assert.equal(layout.rows,width===800?2:1);if(layout.queueWidth)assert(layout.right<=layout.queueLeft);assert(layout.buttons.every(b=>b.label));assert.deepEqual(errors,[]);
 await page.screenshot({path:`${out}/build-${width}.png`});reports.push({width,height,...layout,errors});await page.close();
}await writeFile(`${out}/browser.json`,JSON.stringify(reports,null,2));console.log('PASS build actions800/1280/1920');}finally{await browser.close();}
