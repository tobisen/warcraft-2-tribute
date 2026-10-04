// Run with external Playwright/Chromium; no browser dependency ships with the game.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const out=process.env.W2T_SCREENSHOTS??'/tmp/w2t-bottom-bar';await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.W2T_BROWSER_EXECUTABLE});
const results=[];
try {
 for(const [width,height,resolution,mode] of [[800,600,'800x600','native'],[1280,720,'1280x720','native'],[1920,1080,'1920x1080','native'],[1920,1080,'800x600','fit']]){
  const page=await browser.newPage({viewport:{width,height}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/src/main.ts*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
  await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5178/',{waitUntil:'networkidle'});
  await page.locator('#menu-settings').click();await page.locator('#display-resolution').selectOption(resolution);await page.locator('#display-mode').selectOption(mode);await page.locator('#menu-back').click();await page.locator('#menu-skirmish').click();await page.locator('#start-match').click();
  await page.waitForFunction(()=>window.__gameCheck.scene.keys.BootScene.session.phase==='playing'&&!window.__gameCheck.scene.keys.BootScene.restartPending);
  await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.gathering.wood=10000;s.gathering.goldBalance=10000;s.gathering.units.forEach((u,i)=>u.selected=i===0);s.selectedBuilding=null;s.syncVisuals();});
  const capture=async state=>{
   await page.waitForTimeout(100);
   const metrics=await page.evaluate(()=>{
    const ids=['bottom-bar','selection-info','context-actions','production-queue','minimap-overlay'];
    const nodes=[...ids.map(id=>document.getElementById(id)),...document.querySelectorAll('#bottom-bar [data-action-group],#bottom-bar .control,#bottom-bar button')].filter(e=>e.getClientRects().length);
    const bar=document.getElementById('bottom-bar').getBoundingClientRect();
    return nodes.map(e=>{const r=e.getBoundingClientRect();return {id:e.id||e.dataset.actionGroup||e.className,sw:e.scrollWidth,cw:e.clientWidth,sh:e.scrollHeight,ch:e.clientHeight,x:r.x,y:r.y,right:r.right,bottom:r.bottom,inside:r.x>=bar.x-.1&&r.right<=bar.right+.1&&r.y>=bar.y-.1&&r.bottom<=bar.bottom+.1};});
   });
   for(const m of metrics){assert(m.sw<=m.cw+1,`${state} horizontal ${JSON.stringify(m)}`);assert(m.sh<=m.ch+1,`${state} vertical ${JSON.stringify(m)}`);assert(m.inside,`${state} outside ${JSON.stringify(m)}`);}
   const panels=metrics.filter(m=>['selection-info','Orders','context-actions','production-queue','minimap-overlay'].includes(m.id)).sort((a,b)=>a.x-b.x);
   for(let i=1;i<panels.length;i++){assert(panels[i].x>=panels[i-1].right-1,'panel overlap');assert(Math.abs(panels[i].y-panels[0].y)<1,'panel stacked');}
   await page.screenshot({path:`${out}/${resolution}-${mode}-${state}.png`});results.push({width,height,resolution,mode,state,metrics});
  };
  for(const id of ['build-barracks','build-farm','build-forge','build-harbor'])assert(await page.locator(`#${id}`).isVisible());
  for(const id of ['build-barracks','build-farm','build-forge','build-harbor']){const tip=await page.locator(`#${id}`).getAttribute('title');assert(tip.includes('Cost:'));assert(tip.includes('Key:'));assert(await page.locator(`#${id}`).isEnabled());}
  const idle=await page.locator('#build-farm').evaluate(e=>getComputedStyle(e).backgroundColor);await page.locator('#build-farm').hover();await page.waitForTimeout(150);assert.notEqual(await page.locator('#build-farm').evaluate(e=>getComputedStyle(e).backgroundColor),idle);
  await capture('worker');
  // Physical HUD click and keyboard: selection persists, placement starts and cancels.
  await page.locator('#build-farm').click();assert(await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.placement.active));await page.locator('#game canvas').focus();await page.keyboard.press('Escape');
  assert(await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.gathering.units[0].selected));
  await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.gathering.units.forEach(u=>u.selected=false);s.selectedBuilding='base';s.placement.forge={id:'forge',owner:'player',hp:120,footprint:{x:512,y:384,width:64,height:64},construction:{remainingSeconds:0,builderId:null}};s.syncVisuals();});
  for(let i=0;i<3;i++)await page.locator('#train-worker').click();
  assert.equal(await page.locator('#production-queue button').count(),3);assert(await page.locator('#train-worker').isDisabled());assert(await page.locator('#research-attack').isEnabled());
  await capture('base-research-full-queue');
  await page.locator('#research-attack').click();assert(await page.locator('#research-defense').isDisabled());await capture('research-active-full-queue');
  await page.locator('#production-queue button').last().click();assert.equal(await page.locator('#production-queue button').count(),2);
  assert.deepEqual(errors,[]);await page.close();
 }
 await writeFile(`${out}/metrics.json`,JSON.stringify(results,null,2));console.log(`PASS ${results.length} layout states; screenshots/metrics: ${out}`);
}finally{await browser.close();}
