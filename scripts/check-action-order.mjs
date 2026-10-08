import assert from 'node:assert/strict';import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({headless:true,...(process.env.W2T_BROWSER_EXECUTABLE?{executablePath:process.env.W2T_BROWSER_EXECUTABLE}:{})});
const out='artifacts/action-order';await mkdir(out,{recursive:true});
try{const results=[];for(const width of [800,1280]){
 const page=await browser.newPage({viewport:{width,height:width===800?600:720}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(width=>localStorage.setItem('warcraft-2-tribute.preferences.v1',JSON.stringify({version:1,settings:{display:{resolution:`${width}x${width===800?600:720}`,mode:'native'}}})),width);
 await page.route('**/src/main.ts*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
 await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5188/');await page.locator('#menu-skirmish').click();await page.locator('#start-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending);
 await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.gathering.wood=1000;s.gathering.goldBalance=1000;s.gathering.units.forEach((u,i)=>u.selected=i===0);s.syncVisuals();});
 const build=await page.locator('[data-action-group="Build"]').evaluate(e=>[...e.querySelectorAll('button')].filter(b=>!b.parentElement.hidden).map(b=>({id:b.id,disabled:b.disabled})));
 assert.deepEqual(build.map(b=>b.id),['build-farm','build-barracks','build-wall','build-gate','build-tower','build-forge','build-harbor','build-base','build-stable','build-aviary','build-siegeWorks','build-academy']);assert(!build[0].disabled);assert(build.find(b=>b.id==='build-stable').disabled);assert(build.find(b=>b.id==='build-academy').disabled);
 await page.screenshot({path:`${out}/build-${width}.png`});
 await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.gathering.units.forEach(u=>u.selected=false);s.selectedBuilding='base';s.syncVisuals();});
 const research=await page.locator('[data-action-group="Research"]').evaluate(e=>[...e.querySelectorAll('button')].filter(b=>!b.parentElement.hidden).map(b=>({id:b.id,disabled:b.disabled,row:Math.round(b.getBoundingClientRect().y)})));
 assert.deepEqual(research.map(b=>b.id),['research-workerTools','upgrade-base','research-attack','research-defense','research-cavalryArmor','research-scoutOptics','research-healerTraining','research-submarineDesign']);assert(!research[0].disabled);assert(!research[1].disabled);assert(research[2].disabled);assert(new Set(research.map(b=>b.row)).size<=2);
 await page.screenshot({path:`${out}/research-${width}.png`});
 const before=await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.gathering.wood);await page.locator('#research-workerTools').click({delay:150});const paid=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;return {wood:s.gathering.wood,job:s.research.job?.kind};});assert.equal(paid.wood,before-60);assert.equal(paid.job,'workerTools');
 assert.deepEqual(errors,[]);results.push({width,build,research,paid,errors});await page.close();
}await writeFile(`${out}/browser.json`,JSON.stringify({browser:browser.version(),results},null,2));console.log(JSON.stringify(results));}finally{await browser.close();}
