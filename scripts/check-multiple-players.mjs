import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.W2T_BROWSER_EXECUTABLE});
const out='artifacts/rts-174';await mkdir(out,{recursive:true});const reports=[];
try {
 for(const width of [800,1280]){
  const height=width===800?600:720,page=await browser.newPage({viewport:{width,height}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/src/main.ts*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
  await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5186/');
  await page.locator('#menu-settings').click();await page.selectOption('#display-resolution',`${width}x${height}`);await page.selectOption('#display-mode','native');await page.locator('#menu-back').click();await page.locator('#menu-skirmish').click();await page.selectOption('#scenario-select','skirmish');
  await page.selectOption('#map-select','frontier');assert.equal(await page.locator('#player-count-select option').count(),1);
  await page.selectOption('#map-select','plains96');await page.selectOption('#player-count-select','3');await page.selectOption('#ai-2-faction-select','dwarves');await page.selectOption('#ai-2-profile-select','economic');
  await page.locator('#ai-2-profile-select').scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/settings-${width}.png`});
  await page.locator('#start-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending);
  const initial=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;return s.currentMatch().multiplePlayers.roster;});assert.equal(initial.length,3);assert.equal(initial[2].faction,'dwarves');assert.equal(initial[2].profile,'economic');
  await page.evaluate(async()=>{const {updatePreferences}=await import('/src/presentation/preferences.ts');updatePreferences({camera:{edgePan:false}});const s=window.__gameCheck.scene.keys.BootScene;s.update=()=>{};s.sys.sceneUpdate=()=>{};const {updateMatch}=await import('/src/gameplay/match.ts');s.applyMatch(updateMatch(s.currentMatch(),10));s.syncVisuals();});
  const banks=await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.currentMatch().multiplePlayers.ai.map(bot=>({id:bot.id,bank:bot.state.enemyProduction,base:bot.state.combat.enemies.find(e=>e.kind==='base').position})));
  assert(banks.every(bot=>bot.bank.spent.wood>0));assert.notDeepEqual(banks[0].base,banks[1].base);
  const fixture=await page.evaluate(async()=>{const {projectMultiplePlayers}=await import('/src/gameplay/multiplePlayers.ts'),s=window.__gameCheck.scene.keys.BootScene,m=s.currentMatch();for(const [i,bot] of m.multiplePlayers.ai.entries()){const position={x:1400+i*30,y:500};bot.state.combat.enemies.push({id:'enemy-produced-1',owner:'enemy',kind:'unit',role:'soldier',hp:i===0?60:80,position,order:{kind:'attack-move',destination:{x:1430-i*30,y:500}}});bot.state.enemyProduction.production.nextUnitNumber=Math.max(2,bot.state.enemyProduction.production.nextUnitNumber);}s.applyMatch(projectMultiplePlayers(m));s.cameras.main.centerOn(1415,500);for(const team of Object.values(s.fog.teams)){team.visible.fill(true);team.explored.fill(true);}s.syncVisuals();return m.multiplePlayers.ai.map(bot=>bot.state.combat.enemies.find(e=>e.id==='enemy-produced-1').hp);});
  await page.screenshot({path:`${out}/ai-colors-${width}.png`});
  const fought=await page.evaluate(async()=>{const {updateMatch}=await import('/src/gameplay/match.ts'),s=window.__gameCheck.scene.keys.BootScene;s.applyMatch(updateMatch(s.currentMatch(),.5));s.syncVisuals();return s.currentMatch().multiplePlayers.ai.map(bot=>bot.state.combat.enemies.find(e=>e.id==='enemy-produced-1').hp);});assert(fought.every((hp,i)=>hp<fixture[i]));
  await page.locator('#match-menu-button').click();await page.evaluate(async()=>{const {encodeSave}=await import('/src/gameplay/save.ts');encodeSave(window.__gameCheck.scene.keys.BootScene.currentMatch(),{camera:{x:0,y:0},building:null});});await page.locator('#save-match').click();assert.match(await page.locator('#save-status').innerText(),/saved/i);await page.locator('#load-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending);
  const loaded=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;return {roster:s.multiplePlayers.roster,hp:s.multiplePlayers.ai.map(bot=>bot.state.combat.enemies.find(e=>e.id==='enemy-produced-1').hp),paused:s.currentMatch().paused};});assert.deepEqual(loaded.roster,initial);assert.deepEqual(loaded.hp,fought);assert(loaded.paused);
  await page.screenshot({path:`${out}/loaded-${width}.png`});
  for(let i=0;i<2;i++){await page.locator('#restart-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending);assert.equal(await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.multiplePlayers.ai.every(bot=>bot.state.enemyProduction.acceptedJobs===0)),true);await page.locator('#match-menu-button').click();}
  assert.deepEqual(errors,[]);reports.push({width,height,menuThreePlayers:true,mapCountConstraint:true,separatePaidBanks:banks,independentRacesProfiles:true,aiAgainstAI:{before:fixture,after:fought},saveLoadOwners:true,pausedLoad:true,twoRestarts:true,explicitCombatFixture:true,errors});await page.close();
 }
 await writeFile(`${out}/browser.json`,JSON.stringify(reports,null,2));console.log('PASS native800/1280 three-player settings, paid separate AI economies, AI-versus-AI fixture, SaveLoad and repeated restart.');
}finally{await browser.close();}
