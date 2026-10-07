import {updateAutomaticGates,withGateRules} from './gates';
import {orderUnits} from './gathering';
import {it,expect} from 'vitest';import {createMatch,updateMatch} from './match';import {placeTower,towerPlacementError} from './towers';import {toggleGate,gateToggleReason,fortificationSafety} from './gates';import {bodyFits,enemyNavigationMap,replaceObstacles} from './map';import {findRoute} from './navigation';import {cleanDestroyed} from './destruction';import {encodeSave,decodeSave} from './save';import {updateCombat} from './combat';import type {MatchState} from './match';
const gate=()=>{const m=createMatch('skirmish');m.gathering.wood=200;m.gathering.goldBalance=100;m.gathering.units[0].selected=true;m.placement={...m.placement,kind:'gate',active:true};const placed=placeTower(m,{x:480,y:384});expect(placed.placement.defenses).toHaveLength(1);placed.placement.defenses![0].construction={remainingSeconds:0,builderId:null};return placed;};
it('places wall/gate with correct cost, HP and construction and rejects overlaps',()=>{
 const m=gate();expect(m.placement.defenses![0]).toMatchObject({kind:'gate',hp:240,open:false,footprint:{width:32,height:32}});expect(m.gathering.wood).toBe(170);expect(m.gathering.goldBalance).toBe(95);
 const wall=placeTower({...m,placement:{...m.placement,kind:'wall',active:true}},{x:448,y:384});expect(wall.placement.defenses![1]).toMatchObject({kind:'wall',hp:180,construction:{remainingSeconds:3}});expect(wall.gathering.wood).toBe(160);
 const opened=toggleGate(m,'gate-1');expect(towerPlacementError({...opened,placement:{...opened.placement,active:true,kind:'wall'}},{x:480,y:384})).not.toBeNull();
});
it('open gates permit only own-team bodies; close invalidates routes and blocks occupancy',()=>{
 const closed=gate(),opened=toggleGate(closed,'gate-1');expect(opened.map.revision).toBeGreaterThan(closed.map.revision);expect(bodyFits(closed.map,{x:496,y:400},12)).toBe(false);expect(bodyFits(opened.map,{x:496,y:400},12)).toBe(true);expect(bodyFits(enemyNavigationMap(opened.map),{x:496,y:400},12)).toBe(false);
 const occupied={...opened,gathering:{...opened.gathering,units:opened.gathering.units.map((u,i)=>i===0?{...u,position:{x:496,y:400}}:u)}};expect(gateToggleReason(occupied,'gate-1')).toBe('Overlaps a unit');expect(toggleGate(occupied,'gate-1')).toBe(occupied);
 expect(toggleGate(opened,'gate-1').placement.defenses![0].open).toBe(false);
});
it('save/load reconstructs ownership navigation; destruction removes physical and team blocks',()=>{
 const m=toggleGate(gate(),'gate-1'),loaded=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(loaded.ok){expect(loaded.match.placement.defenses![0].open).toBe(true);expect(bodyFits(enemyNavigationMap(loaded.match.map),{x:496,y:400},12)).toBe(false);}
 m.placement.defenses![0].hp=0;const dead=cleanDestroyed(m);expect(dead.placement.defenses).toEqual([]);expect(bodyFits(enemyNavigationMap(dead.map),{x:496,y:400},12)).toBe(true);
});
it('rejects a final enclosure around combat units, including mandatory delivery connectivity',()=>{
 const m=createMatch('skirmish');m.gathering.units=[{...m.gathering.units[0],kind:'soldier',hp:60,cargo:0,position:{x:496,y:400},target:{x:496,y:400},order:{kind:'idle'}}];m.combat.enemies=[];
 m.map=replaceObstacles(m.map,[{x:448,y:352,width:128,height:32},{x:448,y:384,width:32,height:96},{x:544,y:384,width:32,height:96}]);
 expect(fortificationSafety(m,{x:480,y:448,width:64,height:32})).toMatch(/trap|route/);
});
it('enemy muster cannot cross open gate while own navigation can use its passage',()=>{
 const m=toggleGate(gate(),'gate-1');m.map=replaceObstacles(m.map,[...m.map.obstacles,{x:0,y:384,width:480,height:32},{x:512,y:384,width:m.map.width-512,height:32}]);
 expect(findRoute(m.map,{x:496,y:350},{x:496,y:450},12).ok).toBe(true);expect(findRoute(enemyNavigationMap(m.map),{x:496,y:350},{x:496,y:450},12).ok).toBe(false);
 m.gathering.units=[];m.combat.enemies=[{id:'enemy-muster',hp:36,position:{x:496,y:350},order:{kind:'muster',destination:{x:496,y:450}}}];const moved=updateCombat(m.gathering,m.combat,3,m.map,m.placement);expect(moved.combat.enemies[0].position.y).toBeLessThan(384);
});

it('automatically admits own troops through a complete gate without manual toggling, while enemies remain blocked',()=>{
 let m=gate();m.map=replaceObstacles(m.map,[...m.map.obstacles,{x:0,y:384,width:480,height:32},{x:512,y:384,width:m.map.width-512,height:32}]);
 const closed=withGateRules(m);expect(closed.placement.defenses![0].open).toBe(false);
 expect(findRoute(closed.map,{x:496,y:350},{x:496,y:450},12).ok).toBe(true);
 expect(findRoute(enemyNavigationMap(closed.map),{x:496,y:350},{x:496,y:450},12).ok).toBe(false);
 m={...m,gathering:{...m.gathering,units:m.gathering.units.slice(0,1).map(u=>({...u,selected:true,position:{x:496,y:350},target:{x:496,y:350}}))}};
 m={...m,gathering:{...m.gathering,units:orderUnits(m.gathering.units,{x:496,y:450})}};
 for(let i=0;i<12;i++)m=updateMatch(m,.25);
 expect(m.gathering.units[0].position.y).toBeGreaterThan(432);
 expect(bodyFits(enemyNavigationMap(m.map),{x:496,y:400},12)).toBe(false);
 const away={...m,gathering:{...m.gathering,units:m.gathering.units.map(u=>({...u,position:{x:496,y:600}}))}};
 expect(updateAutomaticGates(away).placement.defenses![0].open).toBe(false);
});
it('unfinished gates remain physical blockers; old completed closed-gate saves load with automatic passage',()=>{
 const m=gate();m.placement.defenses![0].construction={remainingSeconds:1,builderId:null};
 expect(bodyFits(withGateRules(m).map,{x:496,y:400},12)).toBe(false);
 m.placement.defenses![0].construction={remainingSeconds:0,builderId:null};
 const loaded=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(loaded.ok).toBe(true);if(!loaded.ok)throw Error(loaded.error);
 expect(bodyFits(loaded.match.map,{x:496,y:400},12)).toBe(true);expect(bodyFits(enemyNavigationMap(loaded.match.map),{x:496,y:400},12)).toBe(false);
});
it('hostile proximity never opens the door; allied navigation can pass a visually closed gate',()=>{
 const m=gate();m.combat.enemies.push({id:'enemy-near',kind:'unit',hp:36,position:{x:496,y:350},order:{kind:'idle'}});
 expect(updateAutomaticGates({...m,aiContext:{buildSites:[],muster:{x:0,y:0},attackWaypoints:[],gateFriendly:true,visionSide:'player'}}).placement.defenses![0].open).toBe(false);
 const friendly=withGateRules({...m,aiContext:{buildSites:[],muster:{x:0,y:0},attackWaypoints:[],gateFriendly:true,visionSide:'enemy'}});
 expect(bodyFits(enemyNavigationMap(friendly.map),{x:496,y:400},12)).toBe(true);
});
it('can Save/load while an own unit occupies an automatic gate passage',()=>{
 const m=gate();m.gathering.units[0]={...m.gathering.units[0],position:{x:496,y:400},target:{x:496,y:400},navigation:undefined,order:{kind:'idle'}};
 const loaded=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);
 if(loaded.ok)expect(bodyFits(loaded.match.map,loaded.match.gathering.units[0].position,12)).toBe(true);
});

it('permits the final automatic gate in an own enclosure while still refusing a solid closing wall',()=>{
 const m=createMatch('skirmish');m.gathering.units=[{...m.gathering.units[0],kind:'soldier',hp:60,cargo:0,position:{x:496,y:400},target:{x:496,y:400},order:{kind:'idle'}}];m.combat.enemies=[];
 m.map=replaceObstacles(m.map,[{x:448,y:352,width:128,height:32},{x:448,y:384,width:32,height:96},{x:544,y:384,width:32,height:96}]);
 const passage={x:480,y:448,width:64,height:32};expect(fortificationSafety(m,passage,true)).toBeNull();expect(fortificationSafety(m,passage)).not.toBeNull();
});
it('does not accept duplicate legacy gate obstacle references during Save migration',()=>{
 const m=gate(),doc=JSON.parse(encodeSave(m,{camera:{x:0,y:0},building:null}));doc.state.map.obstacles.push(m.placement.defenses![0].footprint);
 expect(decodeSave(JSON.stringify(doc)).ok).toBe(false);
});

it('retains the map and traffic cache identity when automatic passage rules have not changed',()=>{
 const plain=createMatch();expect(withGateRules(plain)).toBe(plain);
 const automatic=withGateRules(gate());expect(withGateRules(automatic).map).toBe(automatic.map);
});

it('keeps wide gates from older saves usable without moving their neighboring walls',()=>{
 const m=gate(),t=m.placement.defenses![0],old=t.footprint;t.footprint={...old,width:64};m.map=replaceObstacles(m.map,m.map.obstacles.map(o=>o.x===old.x&&o.y===old.y? t.footprint:o));
 const loaded=decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null}));expect(loaded.ok,loaded.ok?'':loaded.error).toBe(true);if(loaded.ok)expect(loaded.match.placement.defenses![0].footprint.width).toBe(64);
});
