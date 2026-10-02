// External Playwright and Chromium are verification tools, not runtime dependencies.
import {build} from 'vite';
import {mkdtemp,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import assert from 'node:assert/strict';

const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const fixtureDir=await mkdtemp(join(tmpdir(),'w2t-profile-'));
let browser;
try {
  await build({configFile:false,logLevel:'error',build:{
    outDir:fixtureDir,emptyOutDir:true,
    lib:{entry:resolve('src/gameplay/testHelpers/loadFixture.ts'),name:'LoadCheck',formats:['iife'],fileName:'fixture'},
  }});
  browser=await chromium.launch({headless:true,
    ...(process.env.W2T_BROWSER_EXECUTABLE?{executablePath:process.env.W2T_BROWSER_EXECUTABLE}:{}),
  });
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  page.on('requestfailed',r=>errors.push(r.url()));
  // Temporary response instrumentation; no debug API is shipped in the app.
  await page.route('**/assets/index-*.js',async route=>{
    const response=await route.fetch();let body=await response.text();
    const matches=[...body.matchAll(/new ([A-Za-z_$][\w$]*)\.Game\(\{/g)],last=matches.at(-1);
    assert(last,'Phaser bootstrap not found');
    body=body.slice(0,last.index)+'window.__gameCheck='+body.slice(last.index);
    await route.fulfill({response,body});
  });
  await page.goto(process.env.W2T_PROFILE_URL??'http://127.0.0.1:4173/warcraft-2-tribute/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>!!window.__gameCheck?.scene.keys.BootScene);
  await page.evaluate(()=>window.__checkedScene=window.__gameCheck.scene.keys.BootScene);
  await page.addScriptTag({path:join(fixtureDir,'fixture.iife.js')});
  await page.locator('#scenario-select').selectOption('skirmish');
  await page.locator('#difficulty-select').selectOption('easy');
  await page.locator('#start-match').click();
  await page.waitForFunction(()=>!window.__checkedScene.restartPending&&window.__checkedScene.session.phase==='playing');
  const cdp=await page.context().newCDPSession(page);
  const heap=async()=>{
    await cdp.send('HeapProfiler.collectGarbage');
    return (await cdp.send('Runtime.getHeapUsage')).usedSize/1048576;
  };
  const baseline=await heap(),profiles=[];
  for(const total of (process.env.W2T_CPU_PROFILE?[64]:[64,128])) {
    if(process.env.W2T_CPU_PROFILE){await cdp.send('Profiler.enable');await cdp.send('Profiler.start');}
    await page.evaluate(total=>{
      const s=window.__checkedScene;if(window.__cleanup)window.__cleanup();
      s.applyMatch(LoadCheck.createLoadFixture(total));s.syncVisuals();
      window.__samples={cpu:[],render:[],raf:[]};let updateStart=0,renderStart=0,previous=0;
      const before=()=>updateStart=performance.now();
      const after=()=>window.__samples.cpu.push(performance.now()-updateStart);
      const preRender=()=>renderStart=performance.now();
      const postRender=()=>window.__samples.render.push(performance.now()-renderStart);
      const frame=now=>{if(previous)window.__samples.raf.push(now-previous);previous=now;};
      s.sys.events.on('preupdate',before);s.sys.events.on('postupdate',after);
      s.game.events.on('prerender',preRender);s.game.events.on('postrender',postRender);s.game.events.on('step',frame);
      window.__cleanup=()=>{
        s.sys.events.off('preupdate',before);s.sys.events.off('postupdate',after);
        s.game.events.off('prerender',preRender);s.game.events.off('postrender',postRender);s.game.events.off('step',frame);
      };
    },total);
    await page.waitForFunction(()=>window.__samples.cpu.length>=360,null,{timeout:180000,polling:500});
    if(process.env.W2T_CPU_PROFILE){
      const {profile}=await cdp.send('Profiler.stop');
      await writeFile(process.env.W2T_CPU_PROFILE_FILE??join(tmpdir(),'w2t-065-cpu-profile.json'),JSON.stringify(profile));
    }
    const result=await page.evaluate(()=>{
      window.__cleanup();const xs=window.__samples,s=window.__checkedScene,frames=xs.raf.slice(60);
      const p=(x,n)=>[...x].sort((a,b)=>a-b)[Math.floor((x.length-1)*n)];
      return {samples:xs.cpu.length-60,cpuP95:p(xs.cpu.slice(60),.95),cpuMedian:p(xs.cpu.slice(60),.5),
        cpuMax:Math.max(...xs.cpu),renderP95:p(xs.render.slice(60),.95),frameP95:p(frames,.95),
        fps:1000/(frames.reduce((a,b)=>a+b,0)/frames.length),elapsed:s.waves.elapsedSeconds,
        own:s.gathering.units.length,enemies:s.combat.enemies.filter(e=>e.kind!=='base').length,
        projectiles:s.combat.projectiles?.length??0,outcome:s.outcome};
    });
    result.total=total;result.heapMiB=await heap();profiles.push(result);
    console.log(JSON.stringify(result));assert.equal(result.outcome,'playing');
    assert.equal(result.own+result.enemies,total);
    await page.screenshot({path:join(tmpdir(),`w2t-065-load-${total}-${process.env.W2T_PROFILE_STAGE??'after'}.png`)});
  }
  // A longer real-time run catches frame/heap growth after the initial profile.
  if(process.env.W2T_LONG_RUN==='1') {
    const start=await heap();await page.waitForTimeout(30000);
    const end=await heap();console.log(JSON.stringify({longRunSeconds:30,startHeapMiB:start,endHeapMiB:end}));
    assert(end<=128);assert(end-start<=16);
  }
  const restartHeap=[];
  for(let i=0;i<10;i++) {
    await page.locator('#pause-match').click();await page.locator('#restart-match').click();
    await page.waitForFunction(()=>!window.__checkedScene.restartPending&&window.__checkedScene.session.phase==='playing');
    await page.waitForTimeout(100);restartHeap.push(await heap());
  }
  console.log(JSON.stringify({stage:process.env.W2T_PROFILE_STAGE??'after',chromium:browser.version(),
    baselineMiB:baseline,profiles,restartHeapMiB:restartHeap,errors}));
  assert(profiles[0].cpuP95<=16.7);assert(profiles[0].renderP95<=16.7);assert(profiles[0].frameP95<=33.4);
  if(profiles[1])assert(profiles[1].cpuP95<=33.4);
  assert(profiles.every(p=>p.heapMiB<=128));assert(restartHeap.at(-1)-baseline<=16);assert.deepEqual(errors,[]);
} finally {
  await browser?.close();await rm(fixtureDir,{recursive:true,force:true});
}
