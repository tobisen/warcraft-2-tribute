import {populationState} from './population';
import {expect,it} from 'vitest';
import {factions} from '../config/factions';
import {createMatch} from './match';
import {updateGathering,type Soldier} from './gathering';
import {updateCombat} from './combat';
import {beginPlacement,placeBuilding,placementObstacles} from './placement';
import {startResearch,updateResearch} from './research';
import {actionPanel} from '../presentation/actionPanel';
import {placeHarbor,trainShip,updateNavy,commandShips,canTrainShip} from './navy';
import {encodeSave,decodeSave} from './save';

it('worker speed and ordinary melee/ranged combat read the selected faction without duplicating unit state',()=>{
 const original=factions.crown;
 factions.crown={...original,units:{...original.units,worker:{...original.units.worker,speed:100},soldier:{...original.units.soldier,range:64,damagePerSecond:10},archer:{...original.units.archer,range:240,damage:30}}};
 try{
  const m=createMatch();const worker={...m.gathering.units[0],position:{x:100,y:100},target:{x:300,y:100},order:{kind:'move' as const}};
  expect(updateGathering({...m.gathering,units:[worker]},1).units[0].position).toEqual({x:200,y:100});
  const soldier:Soldier={kind:'soldier',id:'unit-4',hp:60,cargo:0,selected:true,position:{x:200,y:200},target:{x:200,y:200},order:{kind:'attack',enemyId:'enemy-1'}};
  expect(updateCombat({...m.gathering,units:[soldier]},{baseHP:240,enemies:[{id:'enemy-1',hp:100,position:{x:250,y:200}}]},1).combat.enemies[0].hp).toBe(90);
  const ranged=updateCombat({...m.gathering,units:[{...soldier,archetype:'archer'}]},{baseHP:240,enemies:[{id:'enemy-1',kind:'base',hp:100,position:{x:400,y:200},footprint:{x:380,y:180,width:40,height:40}}]},1);
  expect(ranged.combat.enemies[0].hp).toBe(70);expect(ranged.gathering.units[0].position).toEqual({x:200,y:200});
 }finally{factions.crown=original;}
});
it('building cost, HP, construction and Save limits follow faction data',()=>{
 const original=factions.crown;factions.crown={...original,buildings:{...original.buildings,barracks:{...original.buildings.barracks,cost:{wood:28,gold:4},hp:150,constructionSeconds:7}}};
 try{
  const m=createMatch();m.gathering.wood=100;m.gathering.goldBalance=100;m.gathering.units[0].selected=true;
  expect(actionPanel(m,null,true)['build-barracks'].cost).toBe('28 wood + 4 gold');
  const r=placeBuilding(beginPlacement(m.placement),{x:512,y:384},100,placementObstacles(m.gathering),{map:m.map,gathering:m.gathering,enemies:[]});
  expect(r.gathering?.wood).toBe(72);expect(r.gathering?.goldBalance).toBe(96);expect(r.placement).toMatchObject({barracksHP:150,construction:{remainingSeconds:7}});
  m.gathering=r.gathering!;m.map=r.map!;m.placement=r.placement;expect(decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null})).ok).toBe(true);
 }finally{factions.crown=original;}
});
it('research charges its recipe once, uses its time and applies its actual modifier',()=>{
 const original=factions.crown;factions.crown={...original,upgrades:{...original.upgrades,attack:{...original.upgrades.attack,cost:{wood:70,gold:15},durationSeconds:10,multiplier:2}}};
 try{
  const m=createMatch();m.placement.forge={id:'forge',owner:'player',hp:120,footprint:{x:512,y:384,width:64,height:64},construction:{remainingSeconds:0,builderId:null}};m.gathering.wood=100;m.gathering.goldBalance=100;
  expect(actionPanel(m,'base',true)['research-attack'].cost).toBe('70 wood + 15 gold');
  const r=startResearch(m.gathering,m.research!,m.placement,'attack');expect(r.gathering.wood).toBe(30);expect(r.gathering.goldBalance).toBe(85);expect(r.research.job!.remainingSeconds).toBe(10);
  expect(startResearch(r.gathering,r.research,m.placement,'attack').gathering).toBe(r.gathering);
  const before=updateResearch(r.research,m.placement,9);expect(before.attack).toBe(0);const completed=updateResearch(before,m.placement,1);expect(completed.attack).toBe(1);
  const unit:Soldier={kind:'soldier',id:'unit-4',hp:60,cargo:0,selected:false,position:{x:200,y:200},target:{x:200,y:200},order:{kind:'attack',enemyId:'enemy-1'}};
  expect(updateCombat({...m.gathering,units:[unit]},{baseHP:240,upgrades:completed,enemies:[{id:'enemy-1',hp:100,position:{x:228,y:200}}]},1).combat.enemies[0].hp).toBe(64);
 }finally{factions.crown=original;}
});
it('transport recipe, HP and speed are independent from warship data and survive Save',()=>{
 const original=factions.crown;factions.crown={...original,naval:{...original.naval,units:{...original.naval.units,transport:{...original.naval.units.transport,cost:{wood:25,gold:7},durationSeconds:10,hp:110,speed:80}}}};
 try{
  let m=createMatch('skirmish','beginner',undefined,'islands');m.gathering.wood=100;m.gathering.goldBalance=100;m.gathering.units[0]={...m.gathering.units[0],position:{x:640,y:352},target:{x:640,y:352},selected:true};m.fog!.teams.player.visible.fill(true);m.fog!.teams.player.explored.fill(true);m.placement={...m.placement,active:true,kind:'harbor'};
  m=placeHarbor(m,{x:672,y:320});m.navy!.harbor!.construction={remainingSeconds:0,builderId:null};m.gathering.units[0].order={kind:'idle'};
  const started=trainShip(m,'transport');expect(started.gathering.wood).toBe(m.gathering.wood-25);expect(started.gathering.goldBalance).toBe(m.gathering.goldBalance!-7);
  expect(updateNavy(started,9).navy!.ships).toHaveLength(0);m=updateNavy(started,10);expect(m.navy!.ships[0].hp).toBe(110);const p=m.navy!.ships[0].position;
  m.navy!.ships[0].selected=true;m.navy=commandShips(m,{x:p.x,y:p.y+160});const step=updateNavy(m,1);expect(step.navy!.ships[0].position.y-p.y).toBeCloseTo(80);
  const json=encodeSave(step,{camera:{x:0,y:0},building:'harbor'});expect(JSON.parse(json).state.navy.ships[0].typeId).toBe('crown:naval:transport');expect(decodeSave(json).ok).toBe(true);
 }finally{factions.crown=original;}
});

it('ground and naval admission use each role supply from the selected faction',()=>{
 const original=factions.clans;
 factions.clans={...original,units:{...original.units,soldier:{...original.units.soldier,supply:2},archer:{...original.units.archer,supply:3}},naval:{...original.naval,units:{...original.naval.units,transport:{...original.naval.units.transport,supply:6}}}};
 try{
  const m=createMatch('skirmish','beginner',{player:'clans',enemy:'crown'},'islands');
  const soldier:Soldier={kind:'soldier',id:'unit-4',hp:66,cargo:0,selected:false,position:{x:200,y:200},target:{x:200,y:200},order:{kind:'idle'}};
  expect(populationState({...m.gathering,units:[soldier,{...soldier,id:'unit-5',archetype:'archer'}]},m.placement,[]).used).toBe(5);
  m.gathering.wood=100;m.gathering.goldBalance=100;
  m.navy={harbor:{owner:'player',hp:160,footprint:{x:672,y:320,width:64,height:64},construction:{remainingSeconds:0,builderId:null}},production:{remainingSeconds:null,nextUnitNumber:1},ships:[]};
  expect(canTrainShip(m,'warship')).toBe(true);expect(canTrainShip(m,'transport')).toBe(false);
  expect(trainShip(m,'transport')).toBe(m);
 }finally{factions.clans=original;}
});

it('Save cooldown limits follow the actual projectile profile',()=>{
 const original=factions.crown;factions.crown={...original,units:{...original.units,archer:{...original.units.archer,attackInterval:3.5}}};
 try{
  const m=createMatch();m.gathering.units.push({kind:'soldier',owner:'player',id:'unit-4',archetype:'archer',hp:original.units.archer.hp,cargo:0,selected:false,position:{x:280,y:340},target:{x:280,y:340},order:{kind:'idle'},attackCooldown:3});
  m.production.nextUnitNumber=5;m.soldierProduction.nextUnitNumber=5;
  expect(decodeSave(encodeSave(m,{camera:{x:0,y:0},building:null})).ok).toBe(true);
  const archer=m.gathering.units.at(-1)!;if(archer.kind==='soldier')archer.attackCooldown=4;
  expect(()=>encodeSave(m,{camera:{x:0,y:0},building:null})).toThrow(/cooldown/);
 }finally{factions.crown=original;}
});
