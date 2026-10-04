import {legacyEnemyFixture} from './testHelpers/legacyEnemyFixture';
import {expect,it} from 'vitest';
import {maps,mapResources,mapResourceTotals} from '../config/maps';
import {createMatch,updateMatch} from './match';
import {bodyFits,overlaps,createMap} from './map';
import {approachRoute} from './approach';
import {findRoute} from './navigation';
import {placementObstacles} from './placement';
import {resourceNodes} from './gathering';
import {encodeSave,decodeSave} from './save';
import {releasePlaythrough} from './testHelpers/releaseBot';

it('authored highlands have clear start/build zones, finite reachable independent expansion pockets',()=>{
 const m=createMatch('skirmish','beginner',undefined,'highlands');
 expect(m.map).toMatchObject({width:3072,height:3072,tileSize:32});expect(mapResourceTotals('highlands')).toEqual({wood:1150,gold:850});
 const nodes=resourceNodes(m.gathering);expect(nodes.filter(n=>n.resource==='wood')).toHaveLength(4);expect(nodes.filter(n=>n.resource==='gold')).toHaveLength(4);
 for(const rect of m.map.obstacles)expect(rect.x>=0&&rect.y>=0&&rect.x+rect.width<=3072&&rect.y+rect.height<=3072).toBe(true);
 for(const u of [...m.gathering.units,...m.combat.enemies.filter(e=>!e.footprint)])expect(bodyFits(m.map,u.position,12)).toBe(true);
 for(const node of nodes){const rect={x:node.position.x-20,y:node.position.y-20,width:40,height:40};expect(createMap('highlands').obstacles.some(o=>overlaps(o,rect))).toBe(false);expect(approachRoute(m.map,m.gathering.units[0].position,rect,24).status).not.toBe('blocked');}
 for(const rect of [{x:512,y:384,width:64,height:64},{x:576,y:384,width:64,height:64},{x:2816,y:192,width:64,height:64}])expect([...m.map.obstacles,...placementObstacles(m.gathering),...m.combat.enemies.flatMap(e=>e.footprint?[e.footprint]:[])].some(o=>overlaps(o,rect))).toBe(false);
 for(const point of [maps.highlands.enemyMuster!,...maps.highlands.enemyAttackWaypoints!,...maps.highlands.enemyResourceWaypoints!])expect(bodyFits(m.map,point,12)).toBe(true);
});
it('all three crossings independently connect siege-sized bodies and closing all separates the ridge',()=>{
 const m=createMatch('skirmish','beginner',undefined,'highlands'),ys=[544,1504,2720],closures=[{x:1280,y:480,width:128,height:160},{x:1280,y:1440,width:128,height:160},{x:1280,y:2656,width:128,height:416}];
 for(let i=0;i<3;i++){const map={...m.map,obstacles:[...m.map.obstacles,...closures.filter((_,j)=>i!==j)]};expect(findRoute(map,{x:1248,y:ys[i]},{x:1456,y:ys[i]},20).ok).toBe(true);}
 expect(findRoute({...m.map,obstacles:[...m.map.obstacles,...closures]},{x:1248,y:544},{x:1456,y:544},20).ok).toBe(false);
});
it('strict save preserves the new authored map and migrates21 without rewriting existing maps',()=>{
 const m=createMatch('skirmish','beginner',undefined,'highlands'),view={camera:{x:1700,y:1800},building:null},json=encodeSave(m,view),loaded=decodeSave(json);expect(loaded.ok).toBe(true);if(loaded.ok){expect(loaded.match.gathering.extraNodes).toEqual(m.gathering.extraNodes);expect(loaded.view).toEqual(view);}
 for(const mutate of [(d:any)=>d.configVersion='tribute-config-21',(d:any)=>d.state.gathering.extraNodes[2].remaining=251,(d:any)=>d.state.map.obstacles.pop(),(d:any)=>d.map='plains96']){const d=JSON.parse(json);mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}
 const old=createMatch('skirmish','beginner',undefined,'plains128'),d=JSON.parse(encodeSave(old,{camera:{x:2000,y:2200},building:null}));d.configVersion='tribute-config-21';legacyEnemyFixture(d);const migrated=decodeSave(JSON.stringify(d));expect(migrated.ok).toBe(true);if(migrated.ok){expect(migrated.match.map).toEqual(old.map);expect(migrated.match.statLedger).toEqual(old.statLedger);}
});
for(const faction of ['crown','clans'] as const)it(`${faction}: paid finite-resource highlands skirmish reaches victory`,()=>{
 const result=releasePlaythrough('skirmish','normal',undefined,{map:'highlands',faction,abilities:true}),m=result.match;
 expect(m.outcome).toBe('victory');expect(result.spentWood).toBeGreaterThan(40);expect(result.spentGold).toBeGreaterThan(0);expect(m.enemyProduction!.acceptedJobs).toBeGreaterThan(0);
 for(const type of ['wood','gold'] as const){const cargo=m.gathering.units.reduce((n,u)=>n+(u.kind==='worker'&&(u.cargoType??'wood')===type?u.cargo:0),0),stock=resourceNodes(m.gathering).filter(n=>n.resource===type).reduce((n,node)=>n+node.remaining,0);expect(stock+cargo+(type==='wood'?m.gathering.wood:m.gathering.goldBalance!)+(type==='wood'?result.spentWood:result.spentGold)+(m.enemyProduction?.extracted?.[type]??0)+(m.gathering.lostCargo?.[type]??0)).toBeCloseTo(mapResourceTotals('highlands')[type]);}
 expect(decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null})).ok).toBe(true);expect(updateMatch(m,10)).toBe(m);
 expect(createMatch('skirmish','normal',undefined,'highlands').gathering.extraNodes!.map(n=>n.remaining)).toEqual(mapResources('highlands').slice(2).map(n=>n.amount));
},60_000);
it('enemy scouts nearby authored resources, funds an army and reaches the player across the ridge',()=>{
 let m=createMatch('skirmish','normal',undefined,'highlands');for(let i=0;i<1200&&m.outcome==='playing';i++)m=updateMatch(m,.25);
 const barracks=m.combat.enemies.find(e=>e.buildingType==='barracks');expect(barracks?.footprint?.x).toBeGreaterThan(2400);
 expect(m.enemyKnowledge!.nodes.some(n=>n.id==='wood-4'||n.id==='gold-4')).toBe(true);expect(m.enemyProduction!.acceptedJobs).toBeGreaterThan(0);expect(m.combat.baseHP).toBeLessThan(240);
},30_000);
