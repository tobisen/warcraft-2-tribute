import assert from 'node:assert/strict';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({executablePath:process.env.W2T_BROWSER_EXECUTABLE,headless:true});
try{for(const view of ['units','buildings'])for(const owner of ['player','enemy']){
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/src/main.ts*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('new Phaser.Game({','window.__gameCheck=new Phaser.Game({')});});
 await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5186');await page.locator('#menu-settings').click();await page.selectOption('#display-resolution','1280x720');await page.selectOption('#display-mode','native');await page.locator('#menu-back').click();await page.locator('#menu-skirmish').click();await page.locator('#start-match').click();await page.waitForFunction(()=>window.__gameCheck?.scene.keys.BootScene?.session.phase==='playing');
 const report=await page.evaluate(async({view,owner})=>{
  const scene=window.__gameCheck.scene.keys.BootScene;scene.update=()=>{};scene.sys.sceneUpdate=()=>{};scene.cameras.main.setScroll(0,0);
  const {factionIds,factions}=await import('/src/config/factions.ts'),{unitFrame,motion,artAtlas,unitOrigin}=await import('/src/presentation/animation.ts'),{buildingFrame,buildingOrigin}=await import('/src/presentation/assets.ts');
  const graphics=scene.add.graphics().setScrollFactor(0).setDepth(500);graphics.fillStyle(0x304c39).fillRect(0,0,1280,720);const missing=[];
  const put=(atlas,frame,x,y,origin)=>{const texture=scene.textures.get(atlas);if(!texture.has(frame))missing.push(`${atlas}/${frame}`);scene.add.image(x,y,atlas,frame).setOrigin(origin.x,origin.y).setScrollFactor(0).setDepth(501);};
  for(const [row,faction] of factionIds.entries()){
   scene.add.text(8,8+row*99,`${factions[faction].label} · ${owner}`,{fontSize:'12px',color:'#fff1cc'}).setScrollFactor(0).setDepth(502);
   if(view==='units')for(const [col,role]of ['worker','soldier','archer','specialist','catapult','air','warship','transport'].entries()){
    const frame=unitFrame(motion(undefined,{x:0,y:0},'idle',0,role,owner,undefined,faction),0);put(artAtlas(role),frame,140+col*142,68+row*99,unitOrigin(role));
    scene.add.text(100+col*142,77+row*99,role,{fontSize:'11px',color:'#d6dcc7'}).setScrollFactor(0).setDepth(502);
   }else for(const [col,kind]of ['base','barracks','farm','forge','harbor','tower','academy','wall','gate'].entries()){
    put('buildings',buildingFrame(kind,owner,0,5,faction),100+col*130,92+row*99,buildingOrigin(kind));
   }
  }
  // Exercise every runtime texture key, including attack/death/team/facing keys.
  const manifest=await (await fetch('/assets/manifest.json')).json();for(const [id,m]of Object.entries(manifest.frames))if(['units','naval','buildings','air'].includes(m.atlas)&&!scene.textures.get(m.atlas).has(id))missing.push(`${m.atlas}/${id}`);
  return {missing};
 },{view,owner});assert.deepEqual(report.missing,[]);await page.screenshot({path:`/tmp/rts189-${view}-${owner}.png`});assert.deepEqual(errors,[]);await page.close();
}console.log('189 all-five-faction land/air/naval/building player/enemy native galleries and exhaustive runtime frame coverage PASS');}finally{await browser.close();}
