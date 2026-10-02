import { createMap } from './map';
import { describe, expect, it } from 'vitest';
import { orderAttack } from './combat';
import { placeBarracks, placementObstacles } from './placement';
import { combatConfig } from '../config/combat';
import { createMatch, updateMatch, type MatchState } from './match';
import { startProduction } from './production';

const initial = (): MatchState => ({
  map:createMap(), outcome:'playing', placement:{active:false,barracks:null},
  production:{remainingSeconds:null,nextUnitNumber:2},soldierProduction:{remainingSeconds:null,nextUnitNumber:2},
  waves:{elapsedSeconds:0,nextWave:0,nextEnemyNumber:1},
  combat:{baseHP:combatConfig.baseHP,enemies:[]},
  gathering:{goldBalance:100,wood:40,base:{x:400,y:450},node:{id:'wood',position:{x:650,y:180},remaining:400},
    units:[{kind:'worker',id:'unit-1',position:{x:690,y:180},target:{x:690,y:180},selected:true,cargo:0,order:{kind:'gather',nodeId:'wood'}}]},
});

describe('match defeat and freeze', () => {
  it('base HP zero triggers defeat, clearing placement and work orders against the destroyed base', () => {
    const state=initial();state.combat.baseHP=0;state.placement.active=true;
    const result=updateMatch(state,10);
    expect(result.outcome).toBe('defeat');expect(result.placement.active).toBe(false);
    expect(result.gathering.units.every(u=>u.order.kind==='idle')).toBe(true);
    expect(result.gathering.wood).toBe(state.gathering.wood);
    expect(result.waves).toEqual(state.waves);
  });
  it('damage to the base triggers defeat and freezes every gameplay system thereafter', () => {
    const state=initial();state.combat.baseHP=1;
    state.combat.enemies=[{id:'e',hp:36,position:{x:400,y:450}}];
    state.production.remainingSeconds=5;
    state.gathering.units.push({kind:'soldier',id:'s',hp:60,cargo:0,selected:true,position:{x:0,y:0},target:{x:100,y:100},order:{kind:'move'}});
    const defeated=updateMatch(state,1);
    expect(defeated.outcome).toBe('defeat');
    expect(defeated.combat.baseHP).toBe(0);
    expect(updateMatch(defeated,500)).toBe(defeated);
    expect(defeated.production.remainingSeconds).toBeNull();
    expect(defeated.production.queue).toEqual([]);
    expect(defeated.waves.nextWave).toBe(0);
  });
  it('positive base HP keeps play going, and zero/negative delta advances nothing', () => {
    const state=initial();
    expect(updateMatch(state,0)).toEqual(state);
    expect(updateMatch(state,-5)).toEqual(state);
    expect(updateMatch(state,1).outcome).toBe('playing');
  });
  it('new enemies receive no movement or damage before the time they spawn', () => {
    const state=initial();state.gathering.units=[];
    const atWave=updateMatch(state,60);
    expect(atWave.combat.baseHP).toBe(240);
    expect(atWave.combat.enemies[0].position).toEqual({x:740,y:60});
    const justAfter=updateMatch(atWave,1);
    expect(justAfter.combat.enemies[0].position.x).toBeLessThan(740);
    expect(justAfter.combat.baseHP).toBe(240);
  });
  it('IDs stay unique across buildings after combat deaths', () => {
    let state=initial();state.gathering.units=[];
    state.placement.barracks={x:96,y:96,width:64,height:64};
    const started=startProduction(state.gathering,state.soldierProduction,{kind:'barracks',footprint:state.placement.barracks});
    state={...state,gathering:started.gathering,soldierProduction:started.production};
    state=updateMatch(state,5);
    expect(state.gathering.units[0].id).toBe('unit-2');
    state.gathering.units=[];
    const worker=startProduction(state.gathering,state.production);
    state={...state,gathering:worker.gathering,production:worker.production};
    expect(updateMatch(state,5).gathering.units[0].id).toBe('unit-3');
  });
});

describe('victory and outcome precedence', () => {
  it('no victory with future waves or a surviving enemy', () => {
    const state=initial();state.waves.nextWave=2;state.waves.elapsedSeconds=100;
    expect(updateMatch(state,0).outcome).toBe('playing');
    state.waves.nextWave=3;
    state.combat.enemies=[{id:'last',hp:36,position:{x:700,y:50}}];
    expect(updateMatch(state,0).outcome).toBe('playing');
  });
  it('last enemy death after final wave gives victory and freezes all systems', () => {
    const state=initial();state.waves.nextWave=3;state.waves.elapsedSeconds=120;
    state.combat.enemies=[{id:'last',hp:18,position:{x:432,y:450}}];
    state.gathering.units.push({kind:'soldier',id:'s',hp:60,cargo:0,selected:true,
      position:{x:400,y:450},target:{x:400,y:450},order:{kind:'attack',enemyId:'last'}});
    const won=updateMatch(state,1);
    expect(won.outcome).toBe('victory');
    expect(won.combat.enemies).toHaveLength(0);
    expect(updateMatch(won,500)).toBe(won);
  });
  it('defeat wins when last enemy and base die in the same step', () => {
    const state=initial();state.waves.nextWave=3;state.waves.elapsedSeconds=120;
    state.combat.baseHP=6;state.combat.enemies=[{id:'last',hp:18,position:{x:400,y:450}}];
    // Soldier is outside enemy aggro but has enough delta to arrive and kill.
    state.gathering.units.push({kind:'soldier',id:'s',hp:60,cargo:0,selected:true,
      position:{x:560,y:450},target:{x:560,y:450},order:{kind:'attack',enemyId:'last'}});
    const ended=updateMatch(state,2);
    expect(ended.combat.enemies).toHaveLength(0);
    expect(ended.combat.baseHP).toBe(0);
    expect(ended.outcome).toBe('defeat');
    const both={...initial(),combat:{baseHP:0,enemies:[]},waves:{elapsedSeconds:120,nextWave:3,nextEnemyNumber:7}};
    expect(updateMatch(both,0).outcome).toBe('defeat');
  });
});

it('plays economy → barracks → soldiers → all waves to victory with conserved wood', () => {
  let state=createMatch();
  state.gathering.units=state.gathering.units.map((u,i)=>u.kind==='worker'?{...u,
    target:{x:650,y:180},selected:false,cargo:0,order:{kind:'gather',nodeId:i===2?state.gathering.gold!.id:state.gathering.node.id}}:u);
  state.production.nextUnitNumber=4;state.soldierProduction.nextUnitNumber=4;
  let spent=0,spentGold=0;
  for(let step=0;step<150*30 && state.outcome==='playing';step++){
    if(!state.placement.barracks && state.gathering.wood>=40){
      state.gathering.units=state.gathering.units.map(u=>({...u,selected:u.id==='unit-3'}));
      const placed=placeBarracks({...state.placement,active:true},{x:520,y:390},state.gathering.wood,placementObstacles(state.gathering),{map:state.map,gathering:state.gathering,enemies:state.combat.enemies});
      if(placed.placement.barracks) {
      state={...state,map:placed.map!,placement:placed.placement,gathering:placed.gathering!};spent+=40;
      }
    }
    state.gathering.units=state.gathering.units.map(u=>u.kind==='worker' && u.order.kind==='idle' ? {...u,order:{kind:'gather',nodeId:u.id==='unit-3'?state.gathering.gold!.id:state.gathering.node.id}}:u);
    if(state.placement.barracks && (!state.placement.construction||state.placement.construction.remainingSeconds===0) && state.gathering.units.filter(u=>u.kind==='soldier').length<4){
      const result=startProduction(state.gathering,state.soldierProduction,{kind:'barracks',footprint:state.placement.barracks});
      spent+=state.gathering.wood-result.gathering.wood;spentGold+=(state.gathering.goldBalance??0)-(result.gathering.goldBalance??0);
      state={...state,gathering:result.gathering,soldierProduction:result.production};
    }
    state.gathering.units=state.gathering.units.map(u=>({...u,selected:u.kind==='soldier'}));
    if(state.combat.enemies.length) state.gathering.units=orderAttack(state.gathering.units,state.combat.enemies[0].id);
    state=updateMatch(state,1/30);
  }
  expect(state.outcome).toBe('victory');
  expect(state.waves.nextWave).toBe(3);
  expect(state.combat.baseHP).toBeGreaterThan(0);
  expect(state.gathering.wood+state.gathering.node.remaining+state.gathering.units.reduce((sum,u)=>sum+(u.kind==='worker'&&(u.cargoType??'wood')==='wood'?u.cargo:0),0)+spent+(state.gathering.lostCargo?.wood??0)).toBeCloseTo(400);
  expect((state.gathering.goldBalance??0)+state.gathering.gold!.remaining+state.gathering.units.reduce((sum,u)=>sum+(u.kind==='worker'&&u.cargoType==='gold'?u.cargo:0),0)+spentGold+(state.gathering.lostCargo?.gold??0)).toBeCloseTo(300);
},30_000); // 4,500 frames: CI exceeded 10s; browser profiling owns CPU budgets.

describe('fresh match and restart state', () => {
  it('starts with exact economy, buildings, health, units and independent clocks/IDs', () => {
    const state=createMatch();
    expect(state.outcome).toBe('playing');
    expect(state.gathering.wood).toBe(0);
    expect(state.gathering.node.remaining).toBe(400);
    expect(state.gathering.units.map(u=>u.id)).toEqual(['unit-1','unit-2','unit-3']);
    expect(state.gathering.units.every(u=>u.kind==='worker' && u.order.kind==='idle' && !u.selected && u.cargo===0)).toBe(true);
    expect(state.combat).toEqual({baseOwner:'player',baseHP:240,enemies:[]});
    expect(state.waves).toEqual({elapsedSeconds:0,nextWave:0,nextEnemyNumber:1});
    expect(state.placement).toEqual({active:false,barracks:null,farms:[],nextFarmNumber:1});
    expect(state.production).toEqual({remainingSeconds:null,nextUnitNumber:4});
    expect(state.soldierProduction).toEqual(state.production);
    expect(state.soldierProduction).not.toBe(state.production);
  });
  it.each(['victory','defeat'] as const)('new state cannot retain data from %s', outcome => {
    const ended=createMatch();ended.outcome=outcome;
    ended.gathering.wood=300;ended.gathering.node.remaining=0;
    ended.gathering.units[0].cargo=5;ended.gathering.units[0].selected=true;
    ended.gathering.units[0].position.x=1;ended.gathering.units[0].target.x=2;
    ended.gathering.base.x=3;ended.gathering.node.position.x=4;
    ended.combat.baseHP=0;ended.combat.enemies=[{id:'e',position:{x:1,y:2},hp:1}];
    ended.waves={elapsedSeconds:125,nextWave:3,nextEnemyNumber:7};
    ended.placement={active:true,barracks:{x:96,y:96,width:64,height:64}};
    ended.production={remainingSeconds:2,nextUnitNumber:20};
    ended.soldierProduction={remainingSeconds:3,nextUnitNumber:20};
    const restarted=createMatch();
    expect(restarted).toEqual(createMatch());
    expect(restarted.gathering.units[0].position).toEqual({x:280,y:300});
    expect(restarted.gathering.base).toEqual({x:400,y:450});
    expect(restarted.gathering.node.position).toEqual({x:650,y:180});
    expect(restarted.gathering.units[0].position).not.toBe(ended.gathering.units[0].position);
    const selected={...restarted.gathering,wood:20};
    const started=startProduction(selected,restarted.production);
    const next=updateMatch({...restarted,gathering:started.gathering,production:started.production},5);
    expect(next.gathering.units.at(-1)?.id).toBe('unit-4');
    expect(next.outcome).toBe('playing');
    expect(next.waves.elapsedSeconds).toBe(5);
  });
});
