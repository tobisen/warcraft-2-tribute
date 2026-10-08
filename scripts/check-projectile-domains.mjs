import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({headless:true,executablePath:process.env.W2T_BROWSER_EXECUTABLE??'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const out='artifacts/rts-234';await mkdir(out,{recursive:true});const results=[];
try{for(const faction of ['crown']){
 const page=await browser.newPage({viewport:{width:800,height:600}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.clear());await page.route('**/src/main.ts*',async r=>{const res=await r.fetch();await r.fulfill({response:res,body:(await res.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
 await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5180');await page.locator('#menu-settings').click();await page.selectOption('#display-resolution','800x600');await page.selectOption('#display-mode','native');await page.locator('#menu-back').click();await page.locator('#menu-skirmish').click();await page.selectOption('#faction-select',faction);await page.selectOption('#map-select','arena');await page.locator('#start-match').click();await page.waitForFunction(()=>window.__gameCheck?.scene.keys.BootScene.session.phase==='playing'&&!window.__gameCheck.scene.keys.BootScene.restartPending);
 const point=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene;s.update=()=>{};s.sys.sceneUpdate=()=>{};s.gathering.wood=1000;s.gathering.goldBalance=1000;s.cameras.main.setScroll(s.gathering.base.x-320,s.gathering.base.y-220);s.syncVisuals();const c=s.cameras.main;return {x:c.x+(s.gathering.base.x-c.scrollX)*c.zoom,y:c.y+(s.gathering.base.y-c.scrollY)*c.zoom};});
 const box=await page.locator('#game canvas').boundingBox(),size=await page.locator('#game canvas').evaluate(c=>({w:c.width,h:c.height}));await page.mouse.click(box.x+point.x*box.width/size.w,box.y+point.y*box.height/size.h);



 const hits=[];for(const domain of ['land','sea','air']){
 const result=await page.evaluate(async domain=>{const s=window.__gameCheck.scene.keys.BootScene,{updateCombat}=await import('/src/gameplay/combat.ts'),{createMap}=await import('/src/gameplay/map.ts'),{matchFog}=await import('/src/gameplay/matchFog.ts');s.selectedBuilding=null;s.map=createMap('islands','legacy');s.gathering.units=[{kind:'soldier',archetype:'archer',id:'unit-4',hp:40,cargo:0,selected:true,position:{x:672,y:208},target:{x:672,y:208},order:{kind:'attack',enemyId:'enemy-1'}}];s.combat.enemies=[{id:'enemy-1',hp:1000,position:domain==='sea'?{x:752,y:208}:{x:672,y:288},...(domain==='sea'?{kind:'ship'}:domain==='air'?{kind:'unit',role:'air'}:{kind:'unit'}),order:{kind:'idle'}}];s.cameras.main.setScroll(400,80);s.fog=matchFog(s.currentMatch());s.fog.revealed=true;s.applyMatch({...s.currentMatch(),...updateCombat(s.gathering,s.combat,.1,s.map,s.placement)});s.syncVisuals();await new Promise(resolve=>setTimeout(resolve,80));const shots=s.combat.projectiles.length;s.applyMatch({...s.currentMatch(),...updateCombat(s.gathering,s.combat,.4,s.map,s.placement)});s.syncVisuals();return {domain,shots,hp:s.combat.enemies[0].hp};},domain);assert(result.shots>0);assert(result.hp<1000);hits.push(result);await page.screenshot({path:`${out}/${domain}-800.png`});}
 assert.deepEqual(errors,[]);results.push({hits,errors});await page.close();
}await writeFile(`${out}/browser.json`,JSON.stringify(results,null,2)+'\n');}finally{await browser.close();}
