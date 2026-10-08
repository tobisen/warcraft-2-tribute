// Published local voice/SFX files, real match input and lifecycle; no audio quality claim.
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const script=JSON.parse(await readFile('assets/sources/audio-identity/all-factions-voices.json','utf8'));
const clips=script.entries;
const browser=await chromium.launch({headless:true,executablePath:process.env.W2T_BROWSER_EXECUTABLE??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const out=process.env.W2T_VOICE_OUTPUT??'artifacts/rts-240';
await mkdir(out,{recursive:true});
const results=[];
try{
 for(const faction of ['crown','clans','elves','dwarves','goblins']){
  const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[],audioFailures=[];
  page.on('response',r=>{if(r.url().includes('/audio/')&&!r.ok())audioFailures.push({url:r.url(),status:r.status()});});
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/src/main.ts*',async r=>{const res=await r.fetch();await r.fulfill({response:res,body:(await res.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
  await page.route('**/src/presentation/audio.ts*',async r=>{const res=await r.fetch();await r.fulfill({response:res,body:(await res.text())+'\nwindow.__audio=gameAudio;'});});
  await page.addInitScript(()=>localStorage.clear());await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5179/',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__gameCheck?.scene.keys.BootScene?.session?.phase==='menu');await page.locator('#menu-skirmish').click();await page.selectOption('#faction-select',faction);await page.selectOption('#map-select','arena');await page.locator('#start-match').click();
  await page.waitForFunction(()=>window.__gameCheck.scene.keys.BootScene.session.phase==='playing'&&!window.__gameCheck.scene.keys.BootScene.restartPending);
  await page.evaluate(()=>window.__audio.unlock());assert.equal(await page.evaluate(()=>window.__audio.voices.status.recordings),405);
  await page.evaluate(async(clips)=>{
   const a=window.__audio;await a.unlock();a.setSettings({music:0});
   a.voices.reset();window.__voiceEvents=[];
   const play=a.playVoice.bind(a);a.playVoice=(clip,gain,end)=>{const ok=play(clip,gain,end);if(ok)window.__voiceEvents.push({id:clip.id,gain});return ok;};
  },clips);
  const point=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene,c=s.cameras.main,u=s.gathering.units[0];return {x:c.x+(u.position.x-c.scrollX)*c.zoom,y:c.y+(u.position.y-c.scrollY)*c.zoom};});
  const box=await page.locator('#game canvas').boundingBox();assert(box);const pixels=await page.locator('#game canvas').evaluate(c=>({width:c.width,height:c.height}));const scale={x:box.width/pixels.width,y:box.height/pixels.height};
  await page.mouse.click(box.x+point.x*scale.x,box.y+point.y*scale.y);
  assert.equal(await page.evaluate(()=>window.__voiceEvents.length),1);
  assert((await page.evaluate(()=>window.__voiceEvents[0].id)).startsWith(faction+'-worker-selection-'));
  for(let i=0;i<8;i++)await page.mouse.click(box.x+point.x*scale.x,box.y+point.y*scale.y);
  assert.equal(await page.evaluate(()=>window.__voiceEvents.length),1);
  const groupBounds=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene,c=s.cameras.main,units=s.gathering.units;return {x:c.x+(Math.min(...units.map(u=>u.position.x))-24-c.scrollX)*c.zoom,y:c.y+(Math.min(...units.map(u=>u.position.y))-24-c.scrollY)*c.zoom,right:c.x+(Math.max(...units.map(u=>u.position.x))+24-c.scrollX)*c.zoom,bottom:c.y+(Math.max(...units.map(u=>u.position.y))+24-c.scrollY)*c.zoom};});
  const beforeDrag=await page.evaluate(()=>window.__voiceEvents.length);
  await page.mouse.move(box.x+groupBounds.x*scale.x,box.y+groupBounds.y*scale.y);await page.mouse.down();await page.mouse.move(box.x+groupBounds.right*scale.x,box.y+groupBounds.bottom*scale.y,{steps:8});await page.mouse.up();
  const groupSelection=await page.evaluate(()=>({selected:window.__gameCheck.scene.keys.BootScene.gathering.units.filter(u=>u.selected).length,events:window.__voiceEvents.length}));assert(groupSelection.selected>=2);assert(groupSelection.events-beforeDrag<=1);
  await page.waitForFunction(()=>!window.__audio.voices.status.speaking&&window.__audio.context.currentTime-window.__audio.voices.last>=1.2);
  const beforeGroupOrder=await page.evaluate(()=>window.__voiceEvents.length);
  const dest=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene,c=s.cameras.main;const u=s.gathering.units[0];return {x:c.x+(u.position.x+100-c.scrollX)*c.zoom,y:c.y+(u.position.y+60-c.scrollY)*c.zoom};});
  await page.mouse.click(box.x+dest.x*scale.x,box.y+dest.y*scale.y,{button:'right'});
  const afterGroup=await page.evaluate(()=>window.__voiceEvents.slice());assert.equal(afterGroup.length,beforeGroupOrder+1);assert(afterGroup.at(-1).id.startsWith(faction+'-worker-move-'));
  const additions=await page.evaluate(async(faction)=>{
   const a=window.__audio,rows=[];
   for(const role of ['worker','soldier','archer'])for(const cue of ['selection','humor','move']){
    a.voices.reset();a.voices.history.set(`${faction}:${role}:${cue}`,`${faction}-${role}-${cue}-03`);
    for(const suffix of ['04','05']){
     a.voices.last=-Infinity;a.voices.lastOrder=-Infinity;a.voices.lastHumor=-Infinity;
     const action=cue==='selection'?'select':cue==='humor'?'repeat':'move';
     if(!a.voices.speak(role,action,faction))throw Error('New clip failed');
     const clip=window.__voiceEvents.at(-1),buffer=a.voiceBuffers.get(clip.id);
     if(clip.id!==`${faction}-${role}-${cue}-${suffix}`||!buffer||buffer.duration<=0)throw Error('Missing new PCM');
     rows.push({id:clip.id,duration:buffer.duration});await new Promise(r=>setTimeout(r,45));a.stopVoice();
    }
   }
   a.voices.reset();a.voices.history.set(`${faction}:worker:humor`,`${faction}-worker-humor-03`);
   if(!a.voices.speak('worker','repeat',faction))throw Error('Humor did not start');
   return rows;
  },faction);
  assert.equal(additions.length,18);
  const humorId=await page.evaluate(()=>window.__voiceEvents.at(-1).id);assert(humorId.endsWith('-humor-04'));
  // A physical changed order must replace this currently playing joke immediately.
  const interrupt=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene,c=s.cameras.main;const u=s.gathering.units[0];return {x:c.x+(u.position.x+120-c.scrollX)*c.zoom,y:c.y+(u.position.y+80-c.scrollY)*c.zoom};});
  await page.mouse.click(box.x+interrupt.x*scale.x,box.y+interrupt.y*scale.y,{button:'right'});
  await page.waitForFunction(()=>window.__voiceEvents.at(-1).id.includes('-move-'));
  const immediateOrder=await page.evaluate(()=>({id:window.__voiceEvents.at(-1).id,speaking:window.__audio.voices.status.speaking,oneSource:!!window.__audio.voiceSource}));
  assert(immediateOrder.speaking&&immediateOrder.oneSource);
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
  assert.deepEqual(errors,[]);assert.deepEqual(audioFailures,[]);console.log('PASS published audio match '+faction);results.push({faction,publishedRecordings:405,selection:afterGroup[0],groupOrder:afterGroup.at(-1),groupSelection,rapidClicksAccepted:1,additions,humorInterruptedByPhysicalOrder:immediateOrder,lifecycle,errors});await page.close();
 }
 await writeFile(`${out}/browser.json`,JSON.stringify({method:'Actual Chromium match input, published public/audio files with no candidate/silent-buffer routes; actual decode/playback of405 local voice files and22 SFX/music files. Technical routing only; final listening unverified',results,listeningVerified:false},null,2)+'\n');
 console.log('PASS five-faction selection/group/clickspam/Voice-SFX/mute/volume/pause/reset routing. Published405 local voice WAVs; no listening evidence.');
}finally{await browser.close();}
