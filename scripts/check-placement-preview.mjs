import assert from 'node:assert/strict';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.W2T_BROWSER_EXECUTABLE});
try{for(const [width,height] of [[800,600],[1280,720]]){
 const page=await browser.newPage({viewport:{width,height},storageState:{cookies:[],origins:[]}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/assets/index-*.js',async route=>{const response=await route.fetch(),body=await response.text(),match=[...body.matchAll(/new ([A-Za-z_$][\w$]*)\.Game\(\{/g)].at(-1);assert(match);await route.fulfill({response,body:body.slice(0,match.index)+'window.__gameCheck='+body.slice(match.index)});});
 await page.goto(process.env.W2T_RELEASE_URL??'http://127.0.0.1:4186/warcraft-2-tribute/');await page.locator('#menu-settings').click();await page.selectOption('#display-resolution',`${width}x${height}`);await page.selectOption('#display-mode','native');await page.locator('#menu-back').click();await page.locator('#menu-skirmish').click();await page.locator('#start-match').click();await page.waitForFunction(()=>window.__gameCheck&&!window.__gameCheck.scene.keys.BootScene.restartPending);
 await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.update=()=>{};s.sys.sceneUpdate=()=>{};s.setCameraScroll({x:0,y:240});s.syncVisuals();});
 const screen=point=>page.evaluate(point=>{const s=window.__gameCheck.scene.keys.BootScene,c=s.cameras.main,b=s.game.canvas.getBoundingClientRect();return {x:b.x+(c.x+(point.x-c.scrollX)*c.zoom)*b.width/s.game.canvas.width,y:b.y+(c.y+(point.y-c.scrollY)*c.zoom)*b.height/s.game.canvas.height};},point);
 const worker=await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.gathering.units[0].position),wp=await screen(worker);await page.mouse.click(wp.x,wp.y);
 for(const code of ['foggoffnow','icanseemyhousefromhere']){await page.evaluate(()=>document.activeElement.blur());await page.keyboard.press('Enter');await page.locator('#cheat-code').fill(code);await page.locator('#cheat-form button[type=submit]').click();}
 assert(await page.evaluate(()=>{const g=window.__gameCheck.scene.keys.BootScene.gathering;return [g.gold,...(g.extraNodes??[])].filter(n=>n.resource==='gold').every(n=>n.remaining>=1500);}));
 for(const [kind,size] of [['wall',32],['gate',32],['barracks',64],['farm',64],['wall',32]]){
  await page.locator(`#build-${kind}`).click();const p=await screen({x:487,y:391});await page.mouse.move(p.x,p.y);await page.waitForFunction(()=>{const p=window.__gameCheck.scene.keys.BootScene.previewPoint;return Math.abs(p.x-487)<1&&Math.abs(p.y-391)<1;});
  const preview=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;return {width:s.placementPreview.width,height:s.placementPreview.height,x:s.placementPreview.x,y:s.placementPreview.y,visible:s.placementPreview.visible};});assert.equal(preview.width,size);assert.equal(preview.height,size);assert.equal(preview.visible,true);assert.equal(preview.x,480);assert.equal(preview.y,384);
  if(kind==='gate')await page.screenshot({path:`/tmp/w2t-placement-preview-${width}.png`});await page.keyboard.press('Escape');
 }
 for(const [kind,x]of [['gate',480],['wall',448],['wall',512]]){await page.locator(`#build-${kind}`).click();const p=await screen({x:x+8,y:392});await page.mouse.click(p.x,p.y);await page.waitForFunction(x=>window.__gameCheck.scene.keys.BootScene.placement.defenses?.some(t=>t.footprint.x===x),x);}
 const sites=await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.placement.defenses.map(t=>t.footprint));assert.deepEqual(sites,[480,448,512].map(x=>({x,y:384,width:32,height:32})));
 assert.deepEqual(errors,[]);await page.close();
}console.log('PASS800/1280 physical wall/gate single-cell preview and adjacent placement; barracks/farm64 preview switching, real cheats and enlarged gold stock.');}finally{await browser.close();}
