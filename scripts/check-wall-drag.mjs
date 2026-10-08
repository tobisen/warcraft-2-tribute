import assert from 'node:assert/strict';import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({headless:true,...(process.env.W2T_BROWSER_EXECUTABLE?{executablePath:process.env.W2T_BROWSER_EXECUTABLE}:{})});
const out=process.env.W2T_ARTIFACT_DIR??'artifacts/wall-drag';await mkdir(out,{recursive:true});
try{const results=[];for(const width of [800,1280]){
 const page=await browser.newPage({viewport:{width,height:width===800?600:720}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(width=>localStorage.setItem('warcraft-2-tribute.preferences.v1',JSON.stringify({version:1,settings:{display:{resolution:`${width}x${width===800?600:720}`,mode:'native'}}})),width);
 await page.route('**/src/main.ts*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
 await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5188/');await page.locator('#menu-skirmish').click();await page.locator('#start-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending);
 await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.gathering.wood=200;s.gathering.units.forEach((u,i)=>u.selected=i===0);s.cameras.main.centerOn(512,384);s.syncVisuals();});
 const screen=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene,c=s.cameras.main,canvas=s.game.canvas.getBoundingClientRect(),p=s.visibleCamera();return {x:canvas.x+c.x+(480-p.x)*c.zoom,y:canvas.y+c.y+(384-p.y)*c.zoom,step:32*c.zoom};});
 const state=()=>page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;return {wood:s.gathering.wood,count:s.placement.defenses?.length??0,remaining:s.placement.defenses?.map(t=>t.construction.remainingSeconds),order:s.gathering.units[0].order,drag:!!s.wallDrag};});
 await page.locator('#build-wall').click();await page.mouse.move(screen.x+4,screen.y+4);await page.mouse.down();await page.mouse.move(screen.x+screen.step*2+4,screen.y+4,{steps:8});
 assert.equal((await state()).count,0);assert((await state()).drag);await page.screenshot({path:`${out}/preview-${width}.png`});await page.mouse.up();
 const placed=await state();assert.equal(placed.count,3);assert.equal(placed.wood,170);assert(!placed.drag);assert.equal(placed.order.buildingId,'wall-1');
 await page.locator('#match-menu-button').click();await page.locator('#save-match').click();await page.locator('#load-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending);assert.equal((await state()).count,3);
 // Finish via real simulation, independent of wall-clock waiting.
 await page.evaluate(async()=>{const s=window.__gameCheck.scene.keys.BootScene,{updateMatch}=await import('/src/gameplay/match.ts');let m=s.currentMatch();m.paused=false;for(let i=0;i<400;i++)m=updateMatch(m,.1);s.applyMatch({...m,paused:true});s.syncVisuals();});
 assert.deepEqual((await state()).remaining,[0,0,0]);await page.locator('#resume-match').click();
 // Cancel a drag with Escape: no sites or payment.
 await page.locator('#build-wall').click();await page.mouse.move(screen.x+4,screen.y+screen.step+4);await page.mouse.down();await page.mouse.move(screen.x+screen.step*2+4,screen.y+screen.step+4,{steps:4});await page.keyboard.press('Escape');await page.mouse.up();assert.equal((await state()).count,3);assert.equal((await state()).wood,170);
 const finished=await state();await page.screenshot({path:`${out}/built-${width}.png`});
 await page.locator('#match-menu-button').click();await page.locator('#restart-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending);
 await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.gathering.wood=15;s.gathering.units.forEach((u,i)=>u.selected=i===0);s.cameras.main.setZoom(1.5);s.cameras.main.centerOn(512,384);s.syncVisuals();});
 const zoom=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene,c=s.cameras.main,r=s.game.canvas.getBoundingClientRect(),p=s.visibleCamera();return {x:r.x+c.x+(484-p.x)*c.zoom,y:r.y+c.y+(388-p.y)*c.zoom,step:32*c.zoom};});
 await page.locator('#build-wall').click();await page.mouse.move(zoom.x,zoom.y);await page.mouse.down();await page.mouse.move(zoom.x+2*zoom.step,zoom.y);await page.mouse.click(zoom.x+2*zoom.step,zoom.y,{button:'right'});await page.mouse.up();assert.equal((await state()).count,0);assert.equal((await state()).wood,15);
 await page.locator('#build-wall').click();await page.mouse.move(zoom.x,zoom.y);await page.mouse.down();await page.mouse.move(10,width===800?570:690);await page.mouse.up();assert.equal((await state()).count,0);assert.equal((await state()).wood,15);await page.keyboard.press('Escape');
 await page.locator('#build-wall').click();await page.mouse.click(zoom.x,zoom.y);assert.equal((await state()).count,1);assert.equal((await state()).wood,5);
 assert.deepEqual(errors,[]);results.push({width,placed,finished,zoomSingle:await state(),errors});await page.close();
}await writeFile(`${out}/browser.json`,JSON.stringify({browser:browser.version(),results},null,2));console.log(JSON.stringify(results));}finally{await browser.close();}
