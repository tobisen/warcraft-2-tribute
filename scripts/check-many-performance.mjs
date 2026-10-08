// Explicit above-supply stress fixture; never changes production limits or shipped APIs.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({headless:true,
 ...(process.env.W2T_BROWSER_EXECUTABLE?{executablePath:process.env.W2T_BROWSER_EXECUTABLE}:{}),
});
const stage=process.env.W2T_PERFORMANCE_STAGE??'after';
assert(/^[a-z0-9-]+$/.test(stage));
const out='artifacts/performance-many';
try {
 const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>localStorage.setItem('warcraft-2-tribute.preferences.v1',JSON.stringify({version:1,settings:{display:{resolution:'1280x720',mode:'native'}}})));
 await page.route('**/src/main.ts*',async route=>{
  const response=await route.fetch();
  await route.fulfill({response,body:(await response.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});
 });
 await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5188/');
 await page.locator('#menu-skirmish').click();
 await page.selectOption('#map-select','highlands');
 await page.locator('#start-match').click();
 await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending);
 await page.evaluate(async()=>{
  const scene=window.__gameCheck.scene.keys.BootScene;
  const {createLoadFixture}=await import('/src/gameplay/testHelpers/loadFixture.ts');
  const match=createLoadFixture(128,'highlands');
  match.placement.defenses=Array.from({length:32},(_,i)=>({
   id:`wall-${i+1}`,kind:'wall',owner:'player',
   footprint:{x:96+i%16*32,y:96+Math.floor(i/16)*32,width:32,height:32},
   hp:160,construction:{remainingSeconds:0,builderId:null},level:1,upgradeRemaining:null,cooldown:0,
  }));
  scene.applyMatch(match);scene.syncVisuals();
  window.__metrics={};let tick=0,last=0;
  scene.sys.events.on('preupdate',()=>tick=performance.now());
  scene.sys.events.on('postupdate',()=>{(window.__metrics.update??=[]).push(performance.now()-tick);});
  scene.game.events.on('step',now=>{if(last)(window.__metrics.frame??=[]).push(now-last);last=now;});
  for(const name of ['syncVisuals','syncAudio','syncSession','syncNavy']){
   const original=scene[name];scene[name]=function(...args){
    const start=performance.now(),result=original.apply(this,args);
    (window.__metrics[name]??=[]).push(performance.now()-start);return result;
   };
  }
 });
 const cdp=await page.context().newCDPSession(page);
 await cdp.send('Profiler.enable');await cdp.send('Profiler.start');
 await page.waitForTimeout(10000);
 const {profile}=await cdp.send('Profiler.stop');
 const metrics=await page.evaluate(()=>{
  const scene=window.__gameCheck.scene.keys.BootScene;
  return {
   timings:Object.fromEntries(Object.entries(window.__metrics).map(([key,values])=>{
    values=values.slice(5).sort((a,b)=>a-b);
    return [key,{samples:values.length,median:values[Math.floor(values.length*.5)],p95:values[Math.floor(values.length*.95)],mean:values.reduce((a,b)=>a+b,0)/values.length}];
   })),
   canvas:{width:scene.game.canvas.width,height:scene.game.canvas.height},
   units:scene.gathering.units.length,enemies:scene.combat.enemies.filter(e=>!e.footprint).length,
   walls:scene.placement.defenses.length,elapsed:scene.waves.elapsedSeconds,outcome:scene.outcome,
  };
 });
 assert.equal(metrics.units,116);assert.equal(metrics.enemies,12);assert.equal(metrics.walls,32);
 assert(metrics.elapsed>0);assert.equal(metrics.outcome,'playing');assert(metrics.timings.update.samples>=30);
 assert.deepEqual(errors,[]);
 await mkdir(out,{recursive:true});
 await writeFile(`${out}/${stage}.json`,JSON.stringify({metrics,errors,browser:browser.version(),headless:true},null,2));
 // CPU profiles are deliberately opt-in and external to the repository artifacts.
 if(process.env.W2T_CPU_PROFILE_FILE)await writeFile(process.env.W2T_CPU_PROFILE_FILE,JSON.stringify(profile));
 await page.screenshot({path:`${out}/${stage}.png`});
 console.log(JSON.stringify({metrics,errors}));
} finally {await browser.close();}
