import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {prepareNavalArmy} from './testHelpers/navalArmy';
import {useAbility} from './abilities';
import {expect,it} from 'vitest';
import {scenarioConfig} from '../config/scenarios';
import {maps,mapResourceTotals} from '../config/maps';
import {factions,factionsForPlayer} from '../config/factions';
import {createClassicMatch as createMatch} from './testHelpers/classicMatch';
import {updateMatch,type MatchState} from './match';
import {bodyFits,createMap,overlaps} from './map';
import {findRoute} from './navigation';
import {coastalFootprint,findDomainRoute} from './terrainNavigation';
import {orderUnits,resourceNodes} from './gathering';
import {beginPlacement,placeBuilding,placementObstacles} from './placement';
import {enqueueProduction} from './productionQueue';
import {placeHarbor,trainShip,commandShips,matchPopulation} from './navy';
import {loadTransport,unloadTransport} from './transport';
import {commandGroupMove} from './groupMovement';
import {commandAttackMove} from './attackMove';
import {knownResource,entityVisible} from './visibility';
import {orderAttack} from './combat';
import {encodeSave,decodeSave} from './save';
const view={camera:{x:0,y:0},building:null};
it('coast has reachable finite resources, separate landmasses and one connected sea',()=>{
 const m=createMatch('skirmish','normal',factionsForPlayer('crown'),'coast');expect(m.gathering.gold!.position).toEqual({x:600,y:300});expect(m.gathering.node.remaining).toBe(800);expect(m.gathering.gold!.remaining).toBe(400);for(const u of [...m.gathering.units,...m.combat.enemies.filter(e=>!e.footprint)])expect(bodyFits(m.map,u.position,12)).toBe(true);expect(findRoute(m.map,{x:688,y:432},{x:912,y:432}).ok).toBe(false);expect(findDomainRoute(m.map,'water',{x:720,y:432},{x:880,y:432},16).ok).toBe(true);expect(findDomainRoute(m.map,'water',{x:720,y:432},{x:1152,y:32},16).ok).toBe(true);expect(coastalFootprint(m.map,{x:672,y:320,width:64,height:64})).toBe(true);
});
for(const scenario of ['skirmish'] as const)for(const difficulty of ['normal'] as const)for(const faction of ['crown','clans'] as const)it(`${scenario}/${difficulty}/${faction} gathers, pays for army/harbor/transport, lands and wins through land combat`,()=>{
 let m=createMatch(scenario,difficulty,factionsForPlayer(faction),'coast');
 const select=(id:string)=>{m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.id===id}));if(m.navy)m.navy.ships=m.navy.ships.map(s=>({...s,selected:s.id===id}));};
 const until=(goal:(m:MatchState)=>boolean,max=4000)=>{for(let i=0;i<max&&!goal(m)&&m.outcome==='playing';i++)m=updateMatch(m,.1);expect(goal(m),`time ${m.waves.elapsedSeconds}; ${JSON.stringify({navy:m.navy,units:m.gathering.units,production:m.soldierProduction})}`).toBe(true);};
 m=prepareNavalArmy(m);
 select('unit-1');m.placement={...m.placement,active:true,kind:'harbor'};m=placeHarbor(m,{x:672,y:320});expect(m.navy!.harbor).toBeTruthy();until(m=>m.navy!.harbor!.construction.remainingSeconds===0&&m.gathering.units.filter(u=>u.kind==='soldier').length===4);m=trainShip(m,'transport');expect(m.navy!.production.queue).toHaveLength(1);until(m=>m.navy!.ships.length===1);
 select('ship-1');m.navy=commandShips(m,{x:720,y:432});until(m=>m.navy!.ships[0].order.kind==='idle');
 m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.kind==='soldier'}));m.gathering.units=orderUnits(m.gathering.units,{x:688,y:432});until(m=>m.gathering.units.filter(u=>u.kind==='soldier').every(u=>Math.hypot(u.position.x-720,u.position.y-432)<=64));m=loadTransport(m,'ship-1');expect(m.navy!.ships[0].passengers).toHaveLength(4);expect(matchPopulation(m).used).toBe(m.gathering.units.filter(u=>u.kind==='worker').length+6);
 const loaded=decodeSave(encodeSave({...m,paused:true},view));expect(loaded.ok).toBe(true);if(!loaded.ok)throw Error(loaded.error);m={...loaded.match,paused:false};select('ship-1');m.navy=commandShips(m,{x:880,y:432});until(m=>m.navy!.ships[0].order.kind==='idle');m=unloadTransport(m,'ship-1',{x:912,y:432});expect(m.navy!.ships[0].passengers).toEqual([]);expect(m.gathering.units.filter(u=>u.kind==='soldier')).toHaveLength(4);
 m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.kind==='soldier'}));m.gathering.units=commandAttackMove(m.gathering.units,{x:944,y:208},m.map);
 for(let i=0;i<1500&&m.outcome==='playing';i++){
  if(i%5===0){const visible=m.combat.enemies.filter(e=>e.hp>0&&entityVisible(m.fog!,'player',e));for(const unit of m.gathering.units.filter(u=>u.kind==='soldier')){select(unit.id);const target=visible.filter(e=>Math.hypot(e.position.x-unit.position.x,e.position.y-unit.position.y)<=160).sort((a,b)=>Number(a.kind==='worker')-Number(b.kind==='worker')||Number(!!a.footprint)-Number(!!b.footprint)||Math.hypot(a.position.x-unit.position.x,a.position.y-unit.position.y)-Math.hypot(b.position.x-unit.position.x,b.position.y-unit.position.y))[0];if(target){if(Math.hypot(target.position.x-unit.position.x,target.position.y-unit.position.y)<80)m.gathering=useAbility(m.gathering);m.gathering.units=orderAttack(m.gathering.units,target.id);}else if(unit.order.kind==='idle')m.gathering.units=commandAttackMove(m.gathering.units,{x:944,y:208},m.map);}}
  m=updateMatch(m,.1);
 }
 expect(m.outcome).toBe('victory');expect(m.enemyProduction!.acceptedJobs).toBeGreaterThan(0);expect(m.combat.baseHP).toBeGreaterThan(0);const woodSpent=factions[faction].buildings.barracks.cost.wood+factions[faction].buildings.farm.cost.wood+factions[faction].naval.harbor.cost.wood+factions[faction].naval.units.transport.cost.wood+(m.soldierProduction.nextJobNumber!-1)*factions[faction].units.soldier.cost.wood,goldSpent=factions[faction].naval.harbor.cost.gold+factions[faction].naval.units.transport.cost.gold+(m.soldierProduction.nextJobNumber!-1)*factions[faction].units.soldier.cost.gold;const cargo=(type:'wood'|'gold')=>m.gathering.units.reduce((n,u)=>n+(u.kind==='worker'&&(u.cargoType??'wood')===type?u.cargo:0),0);expect(m.gathering.wood+resourceNodes(m.gathering).filter(n=>n.resource==='wood').reduce((sum,n)=>sum+n.remaining,0)+cargo('wood')+m.gathering.lostCargo!.wood+m.enemyProduction!.extracted!.wood+woodSpent).toBeCloseTo(mapResourceTotals('coast','trees','expanded').wood+scenarioConfig[scenario].initial.wood);expect(m.gathering.goldBalance!+resourceNodes(m.gathering).filter(n=>n.resource==='gold').reduce((sum,n)=>sum+n.remaining,0)+cargo('gold')+m.gathering.lostCargo!.gold+m.enemyProduction!.extracted!.gold+goldSpent).toBeCloseTo(mapResourceTotals('coast','trees','expanded').gold+scenarioConfig[scenario].initial.gold);expect(updateMatch(m,100)).toBe(m);expect(m.gathering.node.remaining).toBeGreaterThan(0);expect(m.gathering.gold!.remaining).toBeGreaterThan(0);expect(decodeSave(encodeSave(m,view)).ok).toBe(true);
},60000);
it('island profile and map-specific resource positions cannot be forged as old saves',()=>{const m=createMatch('skirmish','easy',factionsForPlayer('clans'),'coast'),json=encodeSave(m,view);for(const mutate of [(d:any)=>d.state.gathering.gold.position={x:850,y:220},(d:any)=>d.configVersion='tribute-config-22',(d:any)=>d.state.scenario='survival']){const d=JSON.parse(json);mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}const d=JSON.parse(encodeSave(createMatch(),view));legacyTerrainFixture(d);d.configVersion='tribute-config-22';delete d.state.statLedger;expect(decodeSave(JSON.stringify(d)).ok).toBe(true);expect(maps.coast.enemyAttackWaypoints).toHaveLength(3);});

it('large sea connects every expansion coast while land masses stay separate and resources avoid terrain',()=>{
 const m=createMatch('skirmish','normal',undefined,'coast');
 expect(m.map).toMatchObject({width:4096,height:4096,tileSize:32});
 const terrain=createMap('coast').obstacles,water=maps.coast.terrain.filter(p=>p.kind==='water').map(p=>({x:p.column*32,y:p.row*32,width:p.columns*32,height:p.rows*32}));
 for(const rect of terrain)expect(rect.x>=0&&rect.y>=0&&rect.x+rect.width<=4096&&rect.y+rect.height<=4096).toBe(true);
 for(let i=0;i<water.length;i++)for(let j=i+1;j<water.length;j++)expect(overlaps(water[i],water[j])).toBe(false);
 for(const n of resourceNodes(m.gathering))expect(terrain.some(o=>overlaps(o,{x:n.position.x-20,y:n.position.y-20,width:40,height:40}))).toBe(false);
 for(const p of [{x:720,y:432},{x:1296,y:1504},{x:1696,y:1920},{x:2784,y:2816},{x:4000,y:3600}])expect(findDomainRoute(m.map,'water',{x:720,y:432},p,16).ok).toBe(true);
 for(const p of [{x:960,y:432},{x:800,y:1600},{x:1920,y:1920},{x:3104,y:2816}])expect(findRoute(m.map,{x:688,y:432},p).ok).toBe(false);
 for(const n of resourceNodes(m.gathering).filter(n=>!n.id.startsWith('expansion-')))expect(bodyFits(m.map,{x:n.position.x-48,y:n.position.y},12)).toBe(true);
 for(const rect of [{x:672,y:320,width:64,height:64},{x:864,y:320,width:64,height:64},{x:1696,y:1856,width:64,height:64},{x:2784,y:2752,width:64,height:64}])expect(coastalFootprint(m.map,rect)).toBe(true);
 expect(coastalFootprint(m.map,{x:1800,y:1800,width:64,height:64})).toBe(false);
});
it('worker transport reaches a distant resource island, gathers and returns preserved cargo for delivery',()=>{
 // Explicit transport precondition; the other two tests cover paid production from a fresh match.
 let m=createMatch('skirmish','beginner',undefined,'coast');
 m.gathering.units=m.gathering.units.map((u,i)=>({...u,selected:i===0,...(i===0?{position:{x:688,y:432},target:{x:688,y:432}}:{})}));
 m.navy={harbor:null,production:{remainingSeconds:null,nextUnitNumber:2},ships:[{id:'ship-1',kind:'ship',role:'transport',owner:'player',hp:90,position:{x:720,y:432},target:{x:720,y:432},selected:true,order:{kind:'idle'},passengers:[]}]};
 const reveal=()=>{m.fog!.teams.player.visible.fill(true);m.fog!.teams.player.explored.fill(true);};reveal();
 const until=(goal:()=>boolean)=>{for(let i=0;i<1000&&!goal();i++)m=updateMatch(m,.1);expect(goal()).toBe(true);reveal();};
 m=loadTransport(m,'ship-1');expect(m.navy!.ships[0].passengers).toHaveLength(1);
 m.navy=commandShips(m,{x:1696,y:1920});until(()=>m.navy!.ships[0].order.kind==='idle');
 m=unloadTransport(m,'ship-1',{x:1760,y:1920});expect(m.navy!.ships[0].passengers).toHaveLength(0);
 const select=()=>{m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.id==='unit-1'}));};select();
 const node=resourceNodes(m.gathering).find(n=>n.id==='wood-4')!;
 m.gathering.units=orderUnits(m.gathering.units,node.position,node);until(()=>m.gathering.units.find(u=>u.id==='unit-1')!.cargo===5);
 expect(m.gathering.wood).toBe(0);select();m.gathering.units=commandGroupMove(m.gathering.units,{x:1760,y:1920},m.map);until(()=>Math.hypot(m.gathering.units.find(u=>u.id==='unit-1')!.position.x-1760,m.gathering.units.find(u=>u.id==='unit-1')!.position.y-1920)<1);
 select();m=loadTransport(m,'ship-1');expect(m.navy!.ships[0].passengers![0].cargo).toBe(5);
 m.navy=commandShips(m,{x:720,y:432});until(()=>m.navy!.ships[0].order.kind==='idle');m=unloadTransport(m,'ship-1',{x:688,y:432});select();m.gathering.units=orderUnits(m.gathering.units,m.gathering.node.position,m.gathering.node);until(()=>m.gathering.wood>=5);
 expect(resourceNodes(m.gathering).find(n=>n.id==='wood-4')!.remaining).toBeCloseTo(195);
},30_000);
it('the paid coastal AI fleet boards, crosses, lands and can defeat an undefended player',()=>{
 let m=createMatch('skirmish','normal',undefined,'coast');const phases=new Set<string>();
 for(let i=0;i<2400&&m.outcome==='playing';i++){m=updateMatch(m,.25);if(!phases.has(m.enemyNaval!.phase))expect(decodeSave(encodeSave(m,view)).ok).toBe(true);phases.add(m.enemyNaval!.phase);}
 expect([...phases]).toEqual(expect.arrayContaining(['loading','sailing','landed']));expect(m.outcome).toBe('defeat');expect(m.enemyProduction!.acceptedJobs).toBeGreaterThanOrEqual(2);
},30_000);
