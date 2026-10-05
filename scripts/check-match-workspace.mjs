import assert from 'node:assert/strict';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({executablePath:process.env.W2T_BROWSER_EXECUTABLE,headless:true});
try {for(const [width,height,resolution,mode] of [[800,600,'800x600','native'],[1280,720,'1280x720','native'],[1920,1080,'1920x1080','native'],[800,600,'1920x1080','fit']]) {
 const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5185');
 await page.locator('#menu-settings').click();await page.selectOption('#display-resolution',resolution);await page.selectOption('#display-mode',mode);await page.locator('#menu-back').click();
 await page.locator('#menu-skirmish').click();await page.locator('#start-match').click();
 await page.waitForFunction(()=>document.body.dataset.phase==='playing');assert(!(await page.locator('#hud').isVisible()));
 const bounds=await page.locator('#game').boundingBox();assert(bounds.width>=width-2);assert(bounds.x<2);
 await page.locator('#mission-button').click();assert(await page.locator('#pause-mission-panel').isVisible());assert((await page.locator('#mission-instruction').innerText()).length>0);
 assert.equal(await page.evaluate(()=>document.body.dataset.phase),'paused');await page.keyboard.press('Escape');assert(await page.locator('#resume-match').isVisible());
 await page.locator('#pause-tech-button').click();assert(await page.locator('#tech-tree-text').isVisible());assert((await page.locator('#tech-tree-text').innerText()).length>0);
 await page.locator('#pause-back-button').click();await page.locator('#resume-match').click();await page.waitForFunction(()=>document.body.dataset.phase==='playing');
 await page.screenshot({path:`/tmp/rts188-match-${width}.png`});assert.deepEqual(errors,[]);await page.close();
}console.log('188 full-width map, top Mission pause/back/Escape, Menu tech tree/resume Native800/1280/1920 and Fit800 PASS');}finally{await browser.close();}
