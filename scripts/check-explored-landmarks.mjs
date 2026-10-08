import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({headless:true,...(process.env.W2T_BROWSER_EXECUTABLE?{executablePath:process.env.W2T_BROWSER_EXECUTABLE}:{})});
const out='artifacts/explored-landmarks';
try {
 await mkdir(out,{recursive:true});const results=[];
 for(const width of [800,1280]){
  const page=await browser.newPage({viewport:{width,height:width===800?600:720}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(width=>localStorage.setItem('warcraft-2-tribute.preferences.v1',JSON.stringify({version:1,settings:{display:{resolution:`${width}x${width===800?600:720}`,mode:'native'}}})),width);
  await page.route('**/src/main.ts*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
  await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5188/');
  await page.locator('#menu-skirmish').click();await page.selectOption('#map-select','frontier');
  await page.locator('#start-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending);
  await page.locator('#match-menu-button').click();
  const before=await page.evaluate(async()=>{
   const s=window.__gameCheck.scene.keys.BootScene,{visibleMinimapData}=await import('/src/presentation/minimap.ts');
   return {boss:s.enemyVisuals.has('enemy-boss-bramblemaw'),finds:s.discoveryVisuals.size,enemyBuilding:s.enemyVisuals.has('enemy-base'),markers:visibleMinimapData(s.currentMatch()).markers.filter(m=>m.id.includes('discovery')||m.boss||m.id==='enemy-base').length};
  });assert.deepEqual(before,{boss:false,finds:0,enemyBuilding:false,markers:0});
  const explored=await page.evaluate(async()=>{
   const s=window.__gameCheck.scene.keys.BootScene,m=s.currentMatch(),start={...m.gathering.units[0].position};
   const {matchFog}=await import('/src/gameplay/matchFog.ts'),{bossDefinitions,bossEnemyId}=await import('/src/config/bosses.ts');
   const {bossLootPosition}=await import('/src/gameplay/bosses.ts'),{mapDiscoveries}=await import('/src/config/discoveries.ts');
   const {isVisible,isExplored}=await import('/src/gameplay/fog.ts'),{visibleMinimapData}=await import('/src/presentation/minimap.ts');
   const boss=bossDefinitions.bramblemaw,building=m.combat.enemies.find(e=>e.kind==='base'),finds=mapDiscoveries(m.map.id,m.map.design);
   for(const p of [{x:boss.position.x-80,y:boss.position.y+40},bossLootPosition('bramblemaw'),{x:building.footprint.x-80,y:building.position.y},...finds.map(d=>d.position)]){
    m.gathering.units[0]={...m.gathering.units[0],position:{...p},target:{...p},order:{kind:'idle'},navigation:undefined};m.fog=matchFog(m);
   }
   m.gathering.units[0]={...m.gathering.units[0],position:start,target:start};m.fog=matchFog(m);s.applyMatch(m);s.syncVisuals();
   const ids=visibleMinimapData(s.currentMatch()).markers.map(m=>m.id);
   return {boss:s.enemyVisuals.has(bossEnemyId('bramblemaw')),building:s.enemyVisuals.has(building.id),finds:finds.every(d=>s.discoveryVisuals.has(d.id)),currentSight:[boss.position,building.position,...finds.map(d=>d.position)].some(p=>isVisible(s.fog,'player',p)),explored:[boss.position,building.position,...finds.map(d=>d.position)].every(p=>isExplored(s.fog,'player',p)),bossMarker:ids.includes(bossEnemyId('bramblemaw')),buildingMarker:ids.includes(building.id),findMarkers:finds.every(d=>ids.includes(d.id)),ordinaryTroops:m.combat.enemies.filter(e=>!e.footprint).some(e=>s.enemyVisuals.has(e.id)),claimed:m.discoveries.claimed.length};
  });assert.deepEqual(explored,{boss:true,building:true,finds:true,currentSight:false,explored:true,bossMarker:true,buildingMarker:true,findMarkers:true,ordinaryTroops:false,claimed:0});
  for(const kind of ['boss','treasure','recruit','building']){
   await page.evaluate(async kind=>{const s=window.__gameCheck.scene.keys.BootScene,{bossDefinitions}=await import('/src/config/bosses.ts'),{mapDiscoveries}=await import('/src/config/discoveries.ts');const finds=mapDiscoveries(s.map.id,s.map.design),p=kind==='boss'?bossDefinitions.bramblemaw.position:kind==='building'?s.combat.enemies.find(e=>e.kind==='base').position:finds[kind==='recruit'?2:0].position;s.cameras.main.centerOn(p.x,p.y);s.syncVisuals();for(const id of ['pause-backdrop','game-toolbar'])document.getElementById(id).style.visibility='hidden';},kind);
   await page.screenshot({path:`${out}/${kind}-${width}.png`});
  }
  await page.evaluate(()=>{for(const id of ['pause-backdrop','game-toolbar'])document.getElementById(id).style.visibility='';});
  await page.locator('#save-match').click();await page.locator('#load-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending);
  const loaded=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;return {boss:s.enemyVisuals.has('enemy-boss-bramblemaw'),building:s.enemyVisuals.has('enemy-base'),finds:s.discoveryVisuals.size};});assert.deepEqual(loaded,{boss:true,building:true,finds:3});
  await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.bosses.guardians.bramblemaw.hp=0;s.syncVisuals();});
  assert(await page.evaluate(()=>window.__gameCheck.scene.keys.BootScene.bossLootVisuals.has('bramblemaw')));
  await page.locator('#restart-match').click();await page.waitForFunction(()=>!window.__gameCheck.scene.keys.BootScene.restartPending);
  const reset=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;return {boss:s.enemyVisuals.has('enemy-boss-bramblemaw'),finds:s.discoveryVisuals.size,loot:s.bossLootVisuals.size};});assert.deepEqual(reset,{boss:false,finds:0,loot:0});
  assert.deepEqual(errors,[]);results.push({width,before,explored,loaded,reset,errors});await page.close();
 }
 await writeFile(`${out}/browser.json`,JSON.stringify({browser:browser.version(),results},null,2));console.log(JSON.stringify(results));
}finally{await browser.close();}
