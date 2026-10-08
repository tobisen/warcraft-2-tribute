// Routing only: silent in-memory buffers are never exported as voice assets.
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const script=JSON.parse(await readFile('assets/sources/audio-identity/all-factions-voices.json','utf8'));
const clips=script.entries.map(e=>({...e,recording:`audio/voices/${e.id}.wav`,author:'In-memory silent browser fixture',source:'Test only. No recorded performance.',license:'Test only; no production asset',processing:'Zero samples; not audio quality evidence',listeningVerified:false}));
const browser=await chromium.launch({headless:true,executablePath:process.env.W2T_BROWSER_EXECUTABLE??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
await mkdir('artifacts/audio-identity',{recursive:true});
const runtime=JSON.parse(await readFile('public/audio/voices/manifest.json','utf8'));const publishedCount=runtime.entries.filter(e=>e.recording).length;
const results=[];
try{
 for(const faction of ['crown','clans','elves','dwarves','goblins']){
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/src/main.ts*',async r=>{const res=await r.fetch();await r.fulfill({response:res,body:(await res.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
  await page.route('**/src/presentation/audio.ts*',async r=>{const res=await r.fetch();await r.fulfill({response:res,body:(await res.text())+'\nwindow.__audio=gameAudio;'});});
  await page.addInitScript(()=>localStorage.clear());await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5179/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__gameCheck?.scene.keys.BootScene?.session?.phase==='menu');await page.locator('#menu-skirmish').click();await page.selectOption('#faction-select',faction);await page.selectOption('#map-select','arena');await page.locator('#start-match').click();
  await page.waitForFunction(()=>window.__gameCheck.scene.keys.BootScene.session.phase==='playing'&&!window.__gameCheck.scene.keys.BootScene.restartPending);
  await page.evaluate(()=>window.__audio.unlock());assert.equal(await page.evaluate(()=>window.__audio.voices.status.recordings),publishedCount);
  await page.evaluate(async(clips)=>{
   const a=window.__audio;await a.unlock();a.setSettings({music:0});
   for(const clip of clips)a.voiceBuffers.set(clip.id,a.context.createBuffer(1,Math.round(.4*a.context.sampleRate),a.context.sampleRate));
   a.voices.setClips(clips);a.voices.reset();window.__voiceEvents=[];
   const play=a.playVoice.bind(a);a.playVoice=(clip,gain,end)=>{const ok=play(clip,gain,end);if(ok)window.__voiceEvents.push({id:clip.id,gain});return ok;};
  },clips);
  const point=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene,c=s.cameras.main,u=s.gathering.units[0];return {x:c.x+(u.position.x-c.scrollX)*c.zoom,y:c.y+(u.position.y-c.scrollY)*c.zoom};});
  const box=await page.locator('#game canvas').boundingBox();assert(box);const pixels=await page.locator('#game canvas').evaluate(c=>({width:c.width,height:c.height}));const scale={x:box.width/pixels.width,y:box.height/pixels.height};
  await page.mouse.click(box.x+point.x*scale.x,box.y+point.y*scale.y);
  assert.equal(await page.evaluate(()=>window.__voiceEvents.length),1);
  assert((await page.evaluate(()=>window.__voiceEvents[0].id)).startsWith(faction+'-worker-selection-'));
  for(let i=0;i<8;i++)await page.mouse.click(box.x+point.x*scale.x,box.y+point.y*scale.y);
  assert.equal(await page.evaluate(()=>window.__voiceEvents.length),1);
  await page.waitForTimeout(1300);
  const dest=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene,c=s.cameras.main;s.gathering.units.forEach(u=>u.selected=true);const u=s.gathering.units[0];return {x:c.x+(u.position.x+100-c.scrollX)*c.zoom,y:c.y+(u.position.y+60-c.scrollY)*c.zoom};});
  await page.mouse.click(box.x+dest.x*scale.x,box.y+dest.y*scale.y,{button:'right'});
  const afterGroup=await page.evaluate(()=>window.__voiceEvents.slice());assert.equal(afterGroup.length,2);assert(afterGroup[1].id.startsWith(faction+'-worker-move-'));
  const lifecycle=await page.evaluate(async(faction)=>{
   const a=window.__audio;a.voices.reset();a.voices.speak('worker','attack',faction);await new Promise(r=>setTimeout(r,120));
   const duck=a.effectGain.gain.value,voice=a.voiceGain.gain.value,music=a.musicGain.gain.value;
   a.setSettings({effects:0});const independent=a.voiceGain.gain.value;
   a.setSettings({muted:true});await new Promise(r=>setTimeout(r,120));const mutedSourceAbsent=!a.voiceSource;const mute=mutedSourceAbsent&&a.settings.muted&&!a.voices.speak('worker','select',faction);
   a.setSettings({muted:false,voices:.2,effects:.7});a.voices.reset();a.voices.speak('worker','ready',faction);await new Promise(r=>setTimeout(r,120));
   const volume=a.voiceGain.gain.value;
   const scene=window.__gameCheck.scene.keys.BootScene;scene.session.phase='paused';a.setPhase('paused');await a.context.suspend();const pause=!a.voiceSource&&a.context.state==='suspended';
   a.reset();scene.session.phase='playing';a.setPhase('playing');await a.context.resume();a.voices.reset();const restart=a.voices.speak('worker','error',faction);
   return {duck,voice,music,independent,mute,mutedSourceAbsent,volume,pause,restart,sourceCount:a.voiceSource?1:0};
  },faction);
  assert(lifecycle.duck>0&&lifecycle.duck<.65*.7);assert.equal(lifecycle.voice,lifecycle.independent);assert.equal(lifecycle.music,0);assert(lifecycle.mute&&lifecycle.pause&&lifecycle.restart,JSON.stringify(lifecycle));assert(Math.abs(lifecycle.volume-.65*.2*.9)<1e-6);assert.equal(lifecycle.sourceCount,1);
  await page.evaluate(()=>window.__pilotContext=window.__audio.context);
  await page.keyboard.press('Escape');await page.waitForFunction(()=>window.__gameCheck.scene.keys.BootScene.session.phase==='paused');
  assert.equal(await page.evaluate(()=>window.__audio.voices.status.speaking),false);
  await page.locator('#restart-match').click();await page.waitForFunction(()=>window.__gameCheck.scene.keys.BootScene.session.phase==='playing'&&!window.__gameCheck.scene.keys.BootScene.restartPending);
  const actualRestart=await page.evaluate(faction=>{const a=window.__audio;return {sameContext:a.context===window.__pilotContext,recordings:a.voices.status.recordings,settings:{...a.settings},canSpeak:a.voices.speak('worker','select',faction)};},faction);
  assert(actualRestart.sameContext&&actualRestart.canSpeak);assert.equal(actualRestart.recordings,405);assert.equal(actualRestart.settings.voices,.2);
  lifecycle.actualSceneRestart=actualRestart;
  assert.deepEqual(errors,[]);console.log('PASS technical fixture '+faction);results.push({faction,productionRecordings:publishedCount,selection:afterGroup[0],groupOrder:afterGroup[1],rapidClicksAccepted:1,lifecycle,errors});await page.close();
 }
 await writeFile('artifacts/audio-identity/browser-routing.json',JSON.stringify({method:'Actual Chromium match input and Web Audio graph with IN-MEMORY SILENT FIXTURE BUFFERS. No human/AI voice audio; no auditory evidence. Does not verify recorded file loading.',results,listeningVerified:false},null,2)+'\n');
 console.log('PASS five-faction selection/group/clickspam/Voice-SFX/mute/volume/pause/reset routing. Silent fixtures only; no listening evidence.');
}finally{await browser.close();}
