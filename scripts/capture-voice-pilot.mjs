// Real local voice files in a running combat fixture; technical capture, never auditory approval.
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.W2T_BROWSER_EXECUTABLE??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const revision=process.env.W2T_AUDIO_REVISION==='2',production=process.env.W2T_AUDIO_REVISION==='production';
const output=production?'artifacts/audio-identity/production-match':revision?'artifacts/audio-identity/revision-2':'artifacts/audio-identity';
const results=[];await mkdir(output,{recursive:true});
try{
 for(const faction of (production?['crown','clans','elves','dwarves','goblins']:['crown','clans'])){
  const p=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(()=>localStorage.clear());
  await p.route('**/src/main.ts*',async r=>{const res=await r.fetch();await r.fulfill({response:res,body:(await res.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
  await p.route('**/src/presentation/audio.ts*',async r=>{const res=await r.fetch();await r.fulfill({response:res,body:(await res.text())+'\nwindow.__audio=gameAudio;'});});
  await p.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5179/',{waitUntil:'domcontentloaded'});
  await p.waitForFunction(()=>window.__gameCheck?.scene.keys.BootScene?.session?.phase==='menu');
  await p.locator('#menu-skirmish').click();await p.selectOption('#faction-select',faction);await p.selectOption('#map-select','arena');await p.locator('#start-match').click();
  await p.waitForFunction(()=>window.__gameCheck.scene.keys.BootScene.session.phase==='playing'&&!window.__gameCheck.scene.keys.BootScene.restartPending);
  await p.evaluate(async({revision,production})=>{
   const a=window.__audio;await a.unlock();a.setSettings({master:.65,voices:.8,effects:.7,music:0});
   for(const name of (production?[]:revision?['melee','build','bow','siege','buildingHit','impact']:['melee','build'])){const res=await fetch(`/artifacts/audio-identity/${revision?'revision-2/':''}${name}.wav`);a.buffers.set(name,await a.context.decodeAudioData(await res.arrayBuffer()));}
   if(revision){
    // Candidate comparison only: replace three existing pilot buffer IDs.
    const identity=document.querySelector('#faction-select').value;
    for(const [i,action] of ['selection','move','attack'].entries()){
     const res=await fetch(`/artifacts/audio-identity/revision-2/${identity==='clans'?'clans-adam':'crown'}-${i+1}.wav`);
     a.voiceBuffers.set(`${identity}-worker-${action}-01`,await a.context.decodeAudioData(await res.arrayBuffer()));
    }
   }
   const s=window.__gameCheck.scene.keys.BootScene,w={...s.gathering.units[0]},roles=['soldier','archer','catapult'];
   s.gathering.units=Array.from({length:12},(_,i)=>({...w,id:'unit-'+(i+1),kind:'soldier',archetype:roles[i%3],hp:3000,selected:false,position:{x:430+i%4*32,y:330+Math.floor(i/4)*38},target:{x:430+i%4*32,y:330+Math.floor(i/4)*38},order:{kind:'attack',enemyId:'enemy-'+(i%9)}}));
   const base=s.combat.enemies.find(e=>e.kind==='base');s.combat.enemies=Array.from({length:9},(_,i)=>({id:'enemy-'+i,kind:'unit',role:roles[i%3],hp:3000,position:{x:520+i%3*32,y:350+Math.floor(i/3)*38},order:{kind:'defend',targetId:'unit-'+(i%12+1)}}));if(base)s.combat.enemies.push(base);
   s.fog.teams.player.visible.fill(true);s.fog.teams.player.explored.fill(true);s.cameras.main.setScroll(180,160);s.syncVisuals();a.voices.reset();
   // PCM from the graph, without lossy Opus or MediaRecorder conversion.
   const code=`class Capture extends AudioWorkletProcessor {
    process(inputs,outputs){const channels=inputs[0];if(channels?.length){const mono=new Float32Array(channels[0].length);for(const channel of channels)for(let i=0;i<mono.length;i++)mono[i]+=channel[i]/channels.length;this.port.postMessage(mono,[mono.buffer]);}return true;}
   }registerProcessor('w2t-pcm-capture',Capture);`;
   const url=URL.createObjectURL(new Blob([code],{type:'text/javascript'}));
   await a.context.audioWorklet.addModule(url);URL.revokeObjectURL(url);
   const node=new AudioWorkletNode(a.context,'w2t-pcm-capture'),silent=a.context.createGain();silent.gain.value=0;
   const chunks=[];node.port.onmessage=e=>chunks.push(e.data);
   a.mix.connect(node);node.connect(silent);silent.connect(a.context.destination);
   window.__capture={node,chunks,silent};
  },{revision,production});
  await p.waitForTimeout(100);
  const cues=[];
  for(const action of (revision?['select','move','attack']:['select','move','attack','gather','repeat'])){
   const cue=await p.evaluate(({action,faction})=>{const a=window.__audio;a.voices.reset();const ok=a.voices.speak('worker',action,faction);return {action,ok,duration:a.voiceSource?.buffer.duration??0};},{action,faction});
   assert(cue.ok,`${faction} ${action} unavailable`);cues.push(cue);await p.waitForTimeout(Math.round(cue.duration*1000)+450);
  }
  const capture=await p.evaluate(async()=>{
   const {node,chunks,silent}=window.__capture,a=window.__audio;
   a.mix.disconnect(node);
   await new Promise(resolve=>setTimeout(resolve,100));
   node.disconnect();silent.disconnect();
   return {samples:chunks.flatMap(c=>Array.from(c)),sampleRate:a.context.sampleRate,recordings:a.voices.status.recordings};
  });
  capture.duration=capture.samples.length/capture.sampleRate;
  const wav=Buffer.alloc(44+capture.samples.length*2);wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(capture.sampleRate,24);wav.writeUInt32LE(capture.sampleRate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(wav.length-44,40);
  let peak=0;capture.samples.forEach((v,i)=>{peak=Math.max(peak,Math.abs(v));wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,v))*32767),44+i*2);});assert(peak<.98,'mix clips');assert.deepEqual(errors,[]);
  const path=`${output}/${production?'match':'pilot'}-${faction}-match.wav`;await writeFile(path,wav);results.push({faction,path,cues,duration:capture.duration,peak,recordings:capture.recordings,errors,listeningVerified:false});console.log(`PASS ${faction} actual local voice files/combat graph capture; peak ${peak.toFixed(3)}; NOT listened.`);await p.close();
 }
 await writeFile(`${output}/capture.json`,JSON.stringify({production,method:'Live combat fixture, direct voice-presentation cues, real PCM assets (production=true uses published files without audition overrides), AudioWorklet direct PCM tap of actual post-compressor game mix (music muted); no Opus conversion. Revision2 replaces six combat cue buffers with recorded-material candidates and three pilot lines with revised Human/Orc-adam candidates; not production assets. Not human listening.',results,listeningVerified:false},null,2)+'\n');
}finally{await browser.close();}
