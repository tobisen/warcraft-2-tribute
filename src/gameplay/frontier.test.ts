import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {expect,it} from 'vitest';
import {maps,mapResources,mapResourceTotals} from '../config/maps';
import {factionsForPlayer} from '../config/factions';
import {createMatch,updateMatch} from './match';
import {createMap,bodyFits,overlaps} from './map';
import {findRoute} from './navigation';
import {approachRoute} from './approach';
import {placementObstacles,placementError,beginPlacement} from './placement';
import {resourceNodes,orderUnits,updateGathering} from './gathering';
import {encodeSave,decodeSave} from './save';
import {matchFog} from './matchFog';
import {knownResource} from './visibility';
import {visibleMinimapData} from '../presentation/minimap';
import {releasePlaythrough} from './testHelpers/releaseBot';
const view={camera:{x:600,y:650},building:null};
it('has authored base zones, finite expansion sites and three catapult-clear crossings',()=>{
 const m=createMatch('skirmish','beginner',factionsForPlayer('crown'),'frontier');
 expect(m.map).toMatchObject({width:4096,height:4096});expect(mapResourceTotals('frontier').wood).toBeCloseTo(600);expect(mapResourceTotals('frontier').gold).toBe(450);
 const base=m.combat.enemies.find(e=>e.kind==='base')!;expect(base.position).toEqual({x:1360,y:144});
 for(const u of [...m.gathering.units,...m.combat.enemies.filter(e=>!e.footprint)])expect(bodyFits(m.map,u.position,12)).toBe(true);
 for(const rect of resourceNodes(m.gathering).filter(n=>n.id==='wood-1'||n.resource==='gold'&&!n.id.startsWith('expansion-')).map(n=>({x:n.position.x-(n.tree?16:20),y:n.position.y-(n.tree?16:20),width:n.tree?32:40,height:n.tree?32:40})))expect(approachRoute(m.map,m.gathering.units[0].position,rect,24).status).not.toBe('blocked');
 // Each authored lane admits a40px land body across the river independently.
 for(const y of [32,640,1104])expect(findRoute(m.map,{x:736,y},{x:1120,y},20).ok,`lane ${y}`).toBe(true);
 expect(m.map.obstacles.every(f=>f.x>=0&&f.y>=0&&f.x+f.width<=4096&&f.y+f.height<=4096)).toBe(true);
 expect(maps.frontier.terrain.some(p=>p.kind==='water')).toBe(true);
});
it('expansion stock delivers through the ordinary capacity model and is conserved',()=>{
 const m=createMatch('skirmish','beginner',undefined,'frontier');const node=resourceNodes(m.gathering).find(n=>n.id==='wood-2')!;
 const state={...m.gathering,base:{x:1100,y:896},node:{...m.gathering.node,remaining:0},units:[{...m.gathering.units[0],position:{x:1168,y:896},target:{x:1168,y:896},selected:true}],extraNodes:[{...node}]};
 state.units=orderUnits(state.units,node.position,node);
 const result=updateGathering(state,60,m.map),after=result.extraNodes![0].remaining;
 expect(after).toBeLessThan(node.remaining);expect(result.wood).toBeGreaterThan(0);
 expect(after+result.wood+result.units.reduce((n,u)=>n+u.cargo,0)).toBeCloseTo(node.remaining);
 expect(resourceNodes(m.gathering).find(n=>n.id===node.id)!.remaining).toBe(node.remaining);
});
it('unknown expansions stay off the minimap; explored nodes appear and block construction',()=>{
 let m=createMatch('skirmish','beginner',undefined,'frontier');const node=resourceNodes(m.gathering).find(n=>n.id==='wood-2')!;
 expect(knownResource(m.fog!,node.position)).toBe(false);expect(visibleMinimapData(m).markers.some(n=>n.id===node.id)).toBe(false);
 m.gathering.units[0].position={x:1168,y:896};m.fog=matchFog(m);
 expect(visibleMinimapData(m).markers.some(n=>n.id===node.id)).toBe(true);
 const rect={x:node.position.x-16,y:node.position.y-16,width:64,height:64};expect(placementObstacles(m.gathering).some(f=>overlaps(f,rect))).toBe(true);
 expect(placementError(beginPlacement(m.placement),rect,100,placementObstacles(m.gathering),{map:m.map,gathering:{...m.gathering,wood:100},enemies:m.combat.enemies})).not.toBeNull();
});
it('Save19 handles extended bounds/resources and rejects map/stock/reference/bounds tampering',()=>{
 const m=createMatch('skirmish','beginner',undefined,'frontier'),json=encodeSave(m,view),loaded=decodeSave(json);expect(loaded.ok).toBe(true);
 if(loaded.ok){expect(loaded.match.map.width).toBe(4096);expect(loaded.match.gathering.extraNodes).toEqual(m.gathering.extraNodes);expect(loaded.view.camera).toEqual(view.camera);}
 for(const mutate of [(d:any)=>d.state.map.width=1280,(d:any)=>d.state.gathering.extraNodes[0].remaining=201,(d:any)=>d.state.gathering.extraNodes[0].id='wood-1',(d:any)=>d.state.gathering.extraNodes=[],(d:any)=>d.state.gathering.units[0].target={x:4096,y:10},(d:any)=>d.view.camera={x:4096,y:0},(d:any)=>d.configVersion='tribute-config-18']){
  const d=JSON.parse(json);mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);
 }
 const old=createMatch();const d=JSON.parse(encodeSave(old,{camera:{x:240,y:180},building:null}));legacyTerrainFixture(d);d.configVersion='tribute-config-18';delete d.state.statLedger;expect(decodeSave(JSON.stringify(d)).ok).toBe(true);
 d.state.gathering.units[0].target={x:1400,y:300};expect(decodeSave(JSON.stringify(d)).ok).toBe(false);
 // Camera clamping depends on the live viewport, not the former800×600 bootstrap.
 expect(decodeSave(encodeSave(old,{camera:{x:280,y:458},building:null})).ok).toBe(true);
});
for(const faction of ['crown','clans'] as const)it(`${faction}: a paid finite-resource frontier match reaches victory with actual enemy economy`,()=>{
 const result=releasePlaythrough('skirmish','normal',undefined,{faction,abilities:true,map:'frontier'}),m=result.match;
 expect(m.outcome).toBe('victory');expect(result.spentWood).toBeGreaterThan(40);expect(result.spentGold).toBeGreaterThan(0);expect(m.enemyProduction!.acceptedJobs).toBeGreaterThan(0);
 for(const type of ['wood','gold'] as const){const cargo=m.gathering.units.reduce((n,u)=>n+(u.kind==='worker'&&(u.cargoType??'wood')===type?u.cargo:0),0),remaining=resourceNodes(m.gathering).filter(n=>n.resource===type).reduce((n,node)=>n+node.remaining,0),bank=type==='wood'?m.gathering.wood:m.gathering.goldBalance!,spent=type==='wood'?result.spentWood:result.spentGold;
  expect(bank+remaining+cargo+spent+(m.enemyProduction?.extracted?.[type]??0)+(m.gathering.lostCargo?.[type]??0)).toBeCloseTo(mapResourceTotals('frontier','trees','expanded')[type]);
 }
 expect(decodeSave(encodeSave(m,view)).ok).toBe(true);expect(updateMatch(m,100)).toBe(m);
 const fresh=createMatch('skirmish','normal',factionsForPlayer(faction),'frontier');expect(fresh.gathering.extraNodes!.map(n=>n.remaining)).toEqual(mapResources('frontier','trees','expanded').slice(2).map(n=>n.amount));expect(fresh.gathering.units.every(u=>!u.selected&&u.order.kind==='idle')).toBe(true);
},60_000);
it('the configured enemy can fund an army and reach the player base across the valley',()=>{
 let m=createMatch('skirmish','normal',undefined,'frontier');
 for(let i=0;i<1600&&m.outcome==='playing'&&m.combat.baseHP===240;i++)m=updateMatch(m,.25);
 expect(m.enemyProduction!.acceptedJobs).toBeGreaterThan(0);
 expect(m.combat.baseHP).toBeLessThan(240);
},30_000);
