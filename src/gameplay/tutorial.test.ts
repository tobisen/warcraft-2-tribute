import {legacyTerrainFixture} from './testHelpers/legacyTerrainFixture';
import {expect,it} from 'vitest';
import {createMatch,updateMatch} from './match';
import {createTutorial,updateTutorial,tutorialDeliveredWood} from './tutorial';
import {factions,factionsForPlayer} from '../config/factions';
import {gameplayDelta} from './session';
import {commandGroupMove} from './groupMovement';
import {orderUnits} from './gathering';
import {beginPlacement,placeBuilding,placementObstacles} from './placement';
import {enqueueProduction} from './productionQueue';
import {orderAttack} from './combat';
import {encodeSave,decodeSave} from './save';
import {matchLabels} from '../presentation/hud';
import {tutorialMessage} from '../presentation/tutorial';
const view={camera:{x:0,y:0},building:null};
it('has no enemy pressure, requires move-order and counts delivered wood rather than cargo/starting balance',()=>{
 let m=createMatch('tutorial','hard');m=updateMatch(m,600);expect(m.outcome).toBe('playing');expect(m.combat.enemies).toEqual([]);expect(m.enemyAI).toBeUndefined();expect(m.waves.nextWave).toBe(0);expect(m.tutorial?.step).toBe(0);
 m.gathering.units[2].selected=true;m=updateMatch(m,0);expect(m.tutorial?.step).toBe(1);m.gathering.units[2].position.x+=40;expect(updateTutorial(m).tutorial?.step).toBe(1);m.gathering.units[2].order={kind:'move'};m=updateTutorial(m);expect(m.tutorial?.step).toBe(2);
 m.gathering.node.remaining=380;m.gathering.units[2].cargo=5;expect(tutorialDeliveredWood(m)).toBe(15);expect(updateTutorial(m).tutorial?.step).toBe(2);m.gathering.units[2].cargo=0;m=updateTutorial(m);expect(m.tutorial?.step).toBe(3);expect(tutorialMessage(m)).toContain('Completed: Select a worker');
 m.paused=true;expect(updateTutorial(m)).toBe(m);expect(createTutorial()).toEqual({step:0});
});
for(const faction of ['crown','clans'] as const)for(const speed of [.75,1] as const)it(`paid tutorial ${faction}/${speed} completes all six stages, Save and fresh restart`,()=>{
 let m=createMatch('tutorial','beginner',factionsForPlayer(faction),'arena',speed);
 const step=()=>{m=updateMatch(m,gameplayDelta('playing',.25,false,speed));};const wait=(condition:()=>boolean)=>{for(let i=0;i<1600&&!condition();i++)step();expect(condition()).toBe(true);};
 const roundtrip=()=>{const saved=decodeSave(encodeSave({...m,paused:true},view));expect(saved.ok,saved.ok?'':saved.error).toBe(true);if(saved.ok){expect(updateMatch(saved.match,100)).toBe(saved.match);m={...saved.match,paused:false};}};
 m.gathering.units=m.gathering.units.map(u=>({...u,selected:true}));m=updateMatch(m,0);expect(m.tutorial?.step).toBe(1);roundtrip();m.gathering.units=commandGroupMove(m.gathering.units,{x:600,y:240},m.map);wait(()=>m.tutorial?.step===2);wait(()=>m.gathering.units.every(u=>u.order.kind==='idle'));
 m.gathering.units=orderUnits(m.gathering.units,m.gathering.node.position,m.gathering.node);wait(()=>m.tutorial?.step===3);expect(m.gathering.wood).toBeGreaterThanOrEqual(60);roundtrip();expect(m.combat.enemies).toEqual([]);
 const placed=placeBuilding(beginPlacement(m.placement),{x:576,y:352},m.gathering.wood,placementObstacles(m.gathering),{map:m.map,gathering:m.gathering,enemies:m.combat.enemies});expect(placed.placement.barracks).not.toBeNull();expect(placed.wood).toBeCloseTo(m.gathering.wood-40);m={...m,placement:placed.placement,gathering:placed.gathering!,map:placed.map!};wait(()=>m.tutorial?.step===4);expect(m.combat.enemies).toEqual([]);
 const before=m.gathering.wood,queued=enqueueProduction(m.gathering,m.soldierProduction,{kind:'barracks',footprint:m.placement.barracks});expect(queued.gathering.wood).toBeCloseTo(before-factions[faction].units.soldier.cost.wood);m={...m,gathering:queued.gathering, soldierProduction:queued.production};wait(()=>m.tutorial?.step===5);expect(m.combat.enemies).toHaveLength(1);expect(m.gathering.units.find(u=>u.kind==='soldier')?.selected).toBe(false);const hp=m.combat.enemies[0].hp;for(let i=0;i<40;i++)step();expect(m.combat.enemies[0].hp).toBe(hp);expect(m.combat.baseHP).toBe(factions[faction].buildings.base.hp);roundtrip();expect(m.combat.enemies).toHaveLength(1);
 m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.kind==='soldier'}));m.gathering.units=orderAttack(m.gathering.units,'enemy-1');wait(()=>m.outcome==='victory');expect(m.tutorial?.step).toBe(6);expect(matchLabels(m).wave).toBe('Tutorial: 6 / 6');expect(m.combat.enemies).toEqual([]);expect(updateMatch(m,1000)).toBe(m);roundtrip();expect(m.outcome).toBe('victory');
 const restart=createMatch('tutorial','beginner',factionsForPlayer(faction),'arena',speed);expect(restart.tutorial?.step).toBe(0);expect(restart.gathering.wood).toBe(40);expect(restart.gathering.units).toHaveLength(3);expect(restart.combat.enemies).toEqual([]);
},30000);
it('validates tutorial snapshots and migrates old17; defeat wins over completed tutorial',()=>{
 const m=createMatch('tutorial');const json=encodeSave(m,view);for(const mutate of [(d:any)=>d.state.tutorial.step=7,(d:any)=>d.state.tutorial={step:1,workerId:'missing',moveStart:{x:10,y:10},moveOrdered:true},(d:any)=>d.state.tutorial={step:6},(d:any)=>delete d.state.tutorial]){const d=JSON.parse(json);mutate(d);expect(decodeSave(JSON.stringify(d)).ok).toBe(false);}
 const old=JSON.parse(encodeSave(createMatch(),view));legacyTerrainFixture(old);old.configVersion='tribute-config-17';delete old.state.statLedger;expect(decodeSave(JSON.stringify(old)).ok).toBe(true);const defeated=updateMatch({...m,combat:{...m.combat,baseHP:0},tutorial:{step:6}},0);expect(defeated.outcome).toBe('defeat');
});

it('rebases the movement lesson when the player chooses another worker',()=>{
 let m=createMatch('tutorial');m.gathering.units[0].selected=true;m=updateMatch(m,0);m.gathering.units=m.gathering.units.map(u=>({...u,selected:u.id==='unit-3'}));m=updateMatch(m,0);expect(m.tutorial?.workerId).toBe('unit-3');m.gathering.units=commandGroupMove(m.gathering.units,{x:600,y:240},m.map);for(let i=0;i<5;i++)m=updateMatch(m,.1);expect(m.tutorial?.step).toBe(2);
});

it('wood delivered stays valid across secondary-node cargo and completed tutorial Save',()=>{
 let m=createMatch('tutorial');const secondary=m.gathering.extraNodes!.find(n=>(n.resource??'wood')==='wood')!;expect(secondary).toBeDefined();
 m.gathering.node.remaining-=20;m.tutorial={step:2};m=updateTutorial(m);expect(m.tutorial?.step).toBe(3);expect(tutorialDeliveredWood(m)).toBeCloseTo(20);
 const u=m.gathering.units[0];if(u.kind!=='worker')throw Error('Worker required');u.cargo=5;u.cargoType='wood';u.target={...secondary.position};u.order={kind:'deliver',nodeId:secondary.id};secondary.remaining-=5;
 expect(tutorialDeliveredWood(m)).toBeCloseTo(20);expect(decodeSave(encodeSave(m,view)).ok).toBe(true);
 u.cargo=0;u.cargoType=undefined;expect(tutorialDeliveredWood(m)).toBeCloseTo(25);expect(decodeSave(encodeSave(m,view)).ok).toBe(true);
});
