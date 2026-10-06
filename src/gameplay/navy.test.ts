import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {expect,it} from 'vitest';
import {createMatch,updateMatch,type MatchState} from './match';
import {placeHarbor,harborPlacementError,trainShip,canTrainShip,commandShips,matchPopulation,updateNavy,resumeHarbor} from './navy';
import {beginPlacement,placeBuilding,placementObstacles,placementError} from './placement';
import {bindGroup,recallGroup} from './controlGroups';
import {stopShips} from './navy';
import {cancelProduction} from './productionQueue';
import {selectUnitAt,selectUnitsInRectangle} from './selection';
import {encodeSave,decodeSave} from './save';
import {replaceObstacles} from './map';
import {navyConfig} from '../config/navy';
import {factionsForPlayer} from '../config/factions';
import {orderUnits,updateGathering} from './gathering';
import {matchStats} from './matchStats';
import {cleanDestroyed} from './destruction';
const point={x:192,y:416},view={camera:{x:0,y:0},building:'harbor' as const};
function start(faction:'crown'|'clans'='crown'){const m=createMatch('mission-outpost','easy',factionsForPlayer(faction));m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.id==='unit-1'}));m.placement={...m.placement,active:true,kind:'harbor'};return m;}
function built(faction:'crown'|'clans'='crown'){
 let m=placeHarbor(start(faction),point);expect(m.navy?.harbor).toBeTruthy();for(let i=0;i<200&&m.navy!.harbor!.construction.remainingSeconds>0;i++)m=updateMatch(m,.05);expect(m.navy!.harbor!.construction.remainingSeconds).toBe(0);expect(matchStats(m).player.built).toBe(1);return m;
}
/** Real extraction/delivery; no injected balance for paid jobs. Fog/path discovery is tested in browser. */
function funded(faction:'crown'|'clans'='crown'){
 let m=built(faction);m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.id!=='unit-3'}));m.gathering.units=orderUnits(m.gathering.units,m.gathering.node.position,m.gathering.node);
 m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.id==='unit-3'}));m.gathering.units=orderUnits(m.gathering.units,m.gathering.gold!.position,m.gathering.gold!);
 m.gathering=updateGathering(m.gathering,120,m.map);expect(m.gathering.wood).toBeGreaterThanOrEqual(40);expect(m.gathering.goldBalance).toBeGreaterThanOrEqual(15);return m;
}
it('coast placement pays once, invalid/cancelled/insufficient placement does not change state',()=>{
 const m=start();expect(harborPlacementError(m,point)).toBeNull();const placed=placeHarbor(m,point);expect(placed.gathering.wood).toBe(0);expect(placed.gathering.goldBalance).toBe(0);expect(placed.navy!.harbor!.footprint).toEqual({x:192,y:416,width:64,height:64});expect(placeHarbor(placed,point)).toBe(placed);
 for(const bad of [{...m,placement:{...m.placement,active:false}},{...m,gathering:{...m.gathering,wood:39}},{...m,gathering:{...m.gathering,goldBalance:9}}])expect(placeHarbor(bad,point)).toBe(bad);expect(placeHarbor(m,{x:400,y:400})).toBe(m);
});
it('builder contact requires real movement/work; interrupted work resumes without a second cost',()=>{
 let m=placeHarbor(start(),point);const initial=m.navy!.harbor!.construction.remainingSeconds;m=updateNavy(m,.01);expect(m.navy!.harbor!.construction.remainingSeconds).toBe(initial);m.gathering.units=orderUnits(m.gathering.units,{x:400,y:300});const paused=updateNavy(m,100);expect(paused.navy!.harbor!.construction.remainingSeconds).toBe(initial);const resumed=resumeHarbor(paused);expect(resumed.gathering.wood).toBe(0);expect(updateNavy(resumed,100).navy!.harbor!.construction.remainingSeconds).toBe(0);
});
for(const faction of ['crown','clans'] as const)it(`${faction} pays production once, waits eight seconds, spawns idle unselected unique ships`,()=>{
 let m=funded(faction),wood=m.gathering.wood,gold=m.gathering.goldBalance!;m=trainShip(m);expect(m.gathering.wood).toBe(wood-40);expect(m.gathering.goldBalance).toBe(gold-15);expect(matchPopulation(m).reserved).toBe(2);expect(updateNavy(m,7.99).navy!.ships).toHaveLength(0);m=updateNavy(m,8);expect(m.navy!.ships).toHaveLength(1);expect(m.navy!.ships[0]).toMatchObject({id:'ship-1',selected:false,order:{kind:'idle'},hp:faction==='clans'?100:90});expect(updateNavy(m,100).navy!.ships).toHaveLength(1);expect(matchPopulation(m).used).toBe(5);expect(matchStats(m).player.added).toBe(1);expect(matchStats(m).player.wood.spent).toBeCloseTo(80);expect(matchStats(m).player.gold.spent).toBeCloseTo(25);
 m=trainShip(m);m=updateNavy(m,8);expect(m.navy!.ships.map(s=>s.id)).toEqual(['ship-1','ship-2']);
});
it('global supply and insufficient resources block starts; FIFO refund policy is shared',()=>{
 let m=funded();const poor={...m,gathering:{...m.gathering,wood:39}};expect(trainShip(poor)).toBe(poor);m=trainShip(m);m=trainShip(m);expect(matchPopulation(m).reserved).toBe(4);expect(canTrainShip(m)).toBe(false);const before=m.gathering.wood,p=m.navy!.production;const tail=cancelProduction(m.gathering,p,p.queue![1].id);expect(tail.gathering.wood).toBe(before+40);const head=cancelProduction(tail.gathering,tail.production,p.queue![0].id);expect(head.gathering.wood).toBe(before+60);
});
it('blocked spawn retains the paid head at zero and releases exactly one ship once space opens',()=>{
 let m=trainShip(funded());const bank=m.gathering.wood,original=m.map;m.map=replaceObstacles(m.map,[...m.map.obstacles,{x:96,y:448,width:128,height:96}]);m=updateNavy(m,100);expect(m.navy!.ships).toHaveLength(0);expect(m.navy!.production.remainingSeconds).toBe(0);expect(m.gathering.wood).toBe(bank);m.map={...original,revision:m.map.revision+1};m=updateNavy(m,0);expect(m.navy!.ships).toHaveLength(1);expect(m.gathering.wood).toBe(bank);
});
it('selected ships move only in water, use delta, preserve orders on deselection and reject land',()=>{
 let m=updateNavy(trainShip(funded()),8);const ship=m.navy!.ships[0];m.navy={...m.navy!,ships:selectUnitAt(m.navy!.ships,ship.position,navyConfig.ship.size)};m.navy=commandShips(m,{x:144,y:512});const once=updateNavy(m,1);let stepped=m;for(let i=0;i<10;i++)stepped=updateNavy(stepped,.1);expect(stepped.navy!.ships[0].position.x).toBeCloseTo(once.navy!.ships[0].position.x);expect(stepped.navy!.ships[0].position.y).toBeCloseTo(once.navy!.ships[0].position.y);
 const deselected=selectUnitsInRectangle(m.navy!.ships,{x:0,y:0},{x:10,y:10});expect(deselected[0].order).toEqual(m.navy!.ships[0].order);m.navy={...m.navy!,ships:deselected};expect(commandShips(m,{x:400,y:450})!.ships[0]).toBe(deselected[0]);m.navy.ships=m.navy.ships.map(s=>({...s,selected:true}));m.navy=commandShips(m,{x:400,y:450});expect(m.navy!.ships[0].navigation!.status).toBe('blocked');
});
it('Save/load persists build, paid queue, ship movement; strict coast/recipe/identity and reset',()=>{
 for(const m of [placeHarbor(start(),point),trainShip(funded()),updateNavy(trainShip(funded()),8)]){
  const json=encodeSave(m,view),loaded=decodeSave(json);expect(loaded.ok).toBe(true);if(loaded.ok){const expected=JSON.parse(json).state.navy;for(const ship of expected.ships)delete ship.typeId;expect(loaded.match.navy).toEqual(expected);}
  for(const mutate of [(d:any)=>d.state.navy.harbor.footprint.x=400,(d:any)=>d.state.navy.production.nextUnitNumber=0,(d:any)=>d.configVersion='tribute-config-10']){const d=JSON.parse(json);mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}
 }
 const fresh=createMatch('mission-outpost');expect(fresh.navy).toBeUndefined();const old=JSON.parse(encodeSave(fresh,{...view,building:null}));legacyTerrainFixture(old);old.configVersion='tribute-config-10';delete old.state.statLedger;expect(decodeSave(JSON.stringify(old)).ok).toBe(true);
});
it('pause and game over freeze naval state; dead builder/harbor cleanup removes refs and reservations',()=>{
 const m=trainShip(funded());expect(updateNavy({...m,paused:true},100).navy).toBe(m.navy);expect(updateNavy({...m,outcome:'defeat'},100).navy).toBe(m.navy);const dead={...m,navy:{...m.navy!,harbor:{...m.navy!.harbor!,hp:0}}};const cleaned=cleanDestroyed(dead);expect(cleaned.navy!.harbor).toBeNull();expect(cleaned.navy!.production.queue).toEqual([]);expect(cleaned.gathering.wood).toBe(m.gathering.wood);
});

it('a paid farm enables three FIFO ship jobs; queue cap and timestep equivalence hold',()=>{
 let m=funded();m.gathering=updateGathering(m.gathering,120,m.map);m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.id==='unit-1'}));
 const errors:string[]=[];
 for(const point of [{x:512,y:448},{x:400,y:544},{x:512,y:384}]){errors.push(placementError(beginPlacement(m.placement,'farm'),point,m.gathering.wood,placementObstacles(m.gathering),{map:m.map,gathering:m.gathering,enemies:m.combat.enemies})??'valid');const result=placeBuilding(beginPlacement(m.placement,'farm'),point,m.gathering.wood,placementObstacles(m.gathering),{map:m.map,gathering:m.gathering,enemies:m.combat.enemies});if(result.gathering&&result.placement.farms?.length){m={...m,map:result.map!,gathering:result.gathering,placement:result.placement};break;}}
 expect(m.placement.farms,JSON.stringify(errors)).toHaveLength(1);for(let i=0;i<400&&m.placement.farms![0].construction.remainingSeconds>0;i++)m=updateMatch(m,.05);expect(matchPopulation(m).cap).toBe(13);
 m=trainShip(trainShip(trainShip(m)));expect(m.navy!.production.queue).toHaveLength(3);expect(trainShip(m)).toBe(m);expect(matchPopulation(m).reserved).toBe(6);
 const once=updateNavy(m,24);let stepped=m;for(let i=0;i<240;i++)stepped=updateNavy(stepped,.1);expect(stepped.navy!.ships).toEqual(once.navy!.ships);expect(once.navy!.ships).toHaveLength(3);
});
it('ship control groups/stop survive Save and prune when a ship dies',()=>{
 let m=updateNavy(trainShip(funded()),8);m.navy={...m.navy!,ships:m.navy!.ships.map(s=>({...s,selected:true}))};m.controlGroups=bindGroup({},'1',m.navy.ships);m.navy=commandShips(m,{x:144,y:512});m.navy=stopShips(m.navy);expect(m.navy!.ships[0].order.kind).toBe('idle');expect(recallGroup(m.controlGroups,'1',m.navy!.ships)[0].selected).toBe(true);expect(decodeSave(encodeSave(m,view)).ok).toBe(true);m.navy!.ships[0].hp=0;expect(cleanDestroyed(m).controlGroups!['1']).toEqual([]);
});

it('lost harbor builder pauses work and another worker resumes the already paid site',()=>{
 let m=placeHarbor(start(),point);m.gathering.units[0].hp=0;m=cleanDestroyed(m);expect(m.navy!.harbor!.construction.builderId).toBeNull();expect(updateNavy(m,100).navy!.harbor!.construction.remainingSeconds).toBe(5);m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.id==='unit-2'}));m=resumeHarbor(m);expect(m.gathering.wood).toBe(0);expect(m.navy!.harbor!.construction.builderId).toBe('unit-2');expect(decodeSave(encodeSave(m,view)).ok).toBe(true);
});
it('naval Save rejects forged cost/supply/job IDs and land ship positions',()=>{
 const m=trainShip(funded()),json=encodeSave(m,view);
 for(const mutate of [(d:any)=>d.state.navy.production.queue[0].supply=1,(d:any)=>d.state.navy.production.queue[0].cost.wood=0,(d:any)=>d.state.navy.production.queue[0].id='base-job-1']){const d=JSON.parse(json);mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}
 const d=JSON.parse(encodeSave(updateNavy(m,8),view));d.state.navy.ships[0].position={x:400,y:300};expect(decodeSave(JSON.stringify(d)).ok).toBe(false);
});
