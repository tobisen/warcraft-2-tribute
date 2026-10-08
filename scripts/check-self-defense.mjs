const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
import {mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
try{
 const page=await browser.newPage({viewport:{width:800,height:600}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/src/main.ts*',async r=>{const res=await r.fetch();await r.fulfill({response:res,body:(await res.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
 await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5189/');await page.locator('#menu-skirmish').click();await page.selectOption('#map-select','arena');await page.locator('#start-match').click();await page.waitForFunction(()=>window.__gameCheck?.scene.keys.BootScene?.session.phase==='playing'&&!window.__gameCheck.scene.keys.BootScene.restartPending);
 const result=await page.evaluate(async()=>{
  const s=window.__gameCheck.scene.keys.BootScene,{createMatch,updateMatch}=await import('/src/gameplay/match.ts'),{defending}=await import('/src/gameplay/selfDefense.ts');
  s.sys.sceneUpdate=()=>{s.syncVisuals();};
  let m=createMatch('skirmish');m.fog.revealed=true;const u={...m.gathering.units[0],kind:'soldier',hp:60,cargo:0};u.position={x:240,y:320};u.target={x:400,y:320};u.selected=true;u.order={kind:'move'};m.gathering.units=[u];m.combat.enemies=[...m.combat.enemies.filter(e=>e.footprint),{id:'enemy-1',kind:'unit',role:'soldier',owner:'enemy',hp:100,position:{x:272,y:320},order:{kind:'defend',targetId:u.id}}];
  m=updateMatch(m,.01);if(!defending(m.gathering.units[0]))throw Error('No defense after hit '+JSON.stringify({unit:m.gathering.units[0],enemy:m.combat.enemies[0],fog:m.fog.teams.player.visible.filter(Boolean).length}));const start={...m.gathering.units[0].position},hp=m.combat.enemies.find(e=>e.id==='enemy-1').hp;
  m=updateMatch(m,.3);if(m.combat.enemies.find(e=>e.id==='enemy-1').hp>=hp)throw Error('No counterattack');if(Math.hypot(m.gathering.units[0].position.x-start.x,m.gathering.units[0].position.y-start.y)>1e-6)throw Error('Defense moved');
  s.applyMatch(m);s.selectedBuilding=null;s.syncVisuals();window.__defenseFixture=m;return {start,hpBefore:hp,hpAfter:m.combat.enemies.find(e=>e.id==='enemy-1').hp,order:m.gathering.units[0].order};
 });
 await mkdir('artifacts/rts-239',{recursive:true});await page.screenshot({path:'artifacts/rts-239/defense-800.png'});
 const box=await page.locator('#game canvas').boundingBox(),point=await page.evaluate(()=>{const s=window.__gameCheck.scene.keys.BootScene,c=s.cameras.main;return {x:c.x+(500-c.scrollX)*c.zoom,y:c.y+(350-c.scrollY)*c.zoom};}),pixels=await page.locator('#game canvas').evaluate(c=>({w:c.width,h:c.height}));
 await page.mouse.click(box.x+point.x*box.width/pixels.w,box.y+point.y*box.height/pixels.h,{button:'right'});
 await page.waitForTimeout(100);
 const order=await page.evaluate(async()=>{const s=window.__gameCheck.scene.keys.BootScene,{defending}=await import('/src/gameplay/selfDefense.ts');return {pointer:{x:s.input.activePointer.x,y:s.input.activePointer.y,button:s.input.activePointer.button},active:s.gameplayActive(),phase:s.session.phase,selected:s.gathering.units[0].selected,building:s.selectedBuilding,target:s.gathering.units[0].target,kind:s.gathering.units[0].order.kind,defending:defending(s.gathering.units[0])};});assert.equal(order.defending,false);assert.equal(order.kind,'move');
 const resumed=await page.evaluate(async()=>{const {updateMatch}=await import('/src/gameplay/match.ts');let m=window.__defenseFixture;m.combat.enemies=m.combat.enemies.filter(e=>e.footprint);m=updateMatch(m,.01);const x=m.gathering.units[0].position.x;m=updateMatch(m,.2);return m.gathering.units[0].position.x>x;});assert(resumed);assert.deepEqual(errors,[]);
 await writeFile('artifacts/rts-239/browser.json',JSON.stringify({viewport:'800x600',...result,physicalRightClick:order,resumed,errors},null,2)+'\n');
 console.log(JSON.stringify({result,order,resumed,errors}));
}finally{await browser.close();}
