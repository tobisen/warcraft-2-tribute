import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const {chromium}=await import(process.env.W2T_PLAYWRIGHT_MODULE??'playwright-core');
const browser=await chromium.launch({headless:true,...(process.env.W2T_BROWSER_EXECUTABLE?{executablePath:process.env.W2T_BROWSER_EXECUTABLE}:{})});
const phase=process.env.W2T_MEASUREMENT??'after',out='artifacts/placement-performance';await mkdir(out,{recursive:true});
try{const results=[];for(const kind of ['wall','gate','tower','wall-many','gate-many','tower-many']){
 const page=await browser.newPage();await page.goto(process.env.W2T_UI_URL??'http://127.0.0.1:5188/');
 const result=await page.evaluate(async label=>{
  const kind=label.split('-')[0],many=label.endsWith('-many');
  const {createMatch}=await import('/src/gameplay/match.ts'),{placeTower,towerPlacementError}=await import('/src/gameplay/towers.ts'),{placeWallLine,wallLine}=await import('/src/gameplay/wallDrag.ts'),{fortificationSafety}=await import('/src/gameplay/gates.ts'),{buildingFootprint}=await import('/src/gameplay/placement.ts');
  let m=createMatch('skirmish');m.gathering.wood=1000;m.gathering.goldBalance=1000;m.gathering.units[0].selected=true;m.placement={...m.placement,active:true,kind:'wall'};
  if(many){const worker=m.gathering.units[0];for(let i=0;i<96;i++)m.gathering.units.push({...worker,id:`worker-perf-${i}`,selected:false,position:{x:200+i%10*16,y:240+Math.floor(i/10)*16},target:{x:200+i%10*16,y:240+Math.floor(i/10)*16},order:{kind:'idle'}});}
  let time=performance.now();const row=placeWallLine(m,wallLine({x:480,y:384},{x:544,y:384}));const rowMs=performance.now()-time;m=row.match;
  m.placement={...m.placement,active:true,kind};const p={x:576,y:384},rect=buildingFootprint(p,kind);
  time=performance.now();const coldPlaced=placeTower(m,p),coldPlaceMs=performance.now()-time;
  time=performance.now();const safety=fortificationSafety(m,rect,kind==='gate'),safetyMs=performance.now()-time;
  time=performance.now();const error=towerPlacementError(m,p),checkMs=performance.now()-time;
  time=performance.now();const placed=placeTower(m,p),placeMs=performance.now()-time;
  return {kind,label,rowCount:row.count,rowReason:row.reason,rowMs,safety,safetyMs,error,checkMs,coldPlaceMs,placeMs,placed:placed!==m,footprint:placed.placement.defenses?.at(-1)?.footprint,map:{width:m.map.width,height:m.map.height},actors:m.gathering.units.length+m.combat.enemies.length};
 },kind);assert.equal(result.rowCount,3);assert.equal(result.error,null);assert(result.placed);results.push(result);await page.close();
}await writeFile(`${out}/${phase}.json`,JSON.stringify({browser:browser.version(),results},null,2));console.log(JSON.stringify(results));}finally{await browser.close();}
