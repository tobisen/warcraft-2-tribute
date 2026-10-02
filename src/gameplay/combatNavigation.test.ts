import { describe, expect, it } from 'vitest';
import { createMatch, updateMatch } from './match';
import { updateCombat, orderAttack } from './combat';
import { replaceObstacles, bodyFits } from './map';
import { combatConfig } from '../config/combat';
import type { Soldier } from './gathering';
const soldier=(x:number,y:number):Soldier=>({id:'s',kind:'soldier',hp:60,cargo:0,selected:true,
  position:{x,y},target:{x,y},order:{kind:'attack',enemyId:'e'}});

describe('combat navigation', () => {
  it('pursues around terrain, respects bodies and destroys targets without stale routes', () => {
    let s=createMatch();s.gathering.units=[soldier(240,144)];
    s.combat.enemies=[{id:'e',hp:36,position:{x:48,y:144}}];
    for(let i=0;i<300 && s.combat.enemies.length;i++){
      const result=updateCombat(s.gathering,s.combat,.05,s.map);s={...s,...result};
      for(const unit of s.gathering.units)expect(bodyFits(s.map,unit.position,12)).toBe(true);
      for(const enemy of s.combat.enemies)expect(bodyFits(s.map,enemy.position,12)).toBe(true);
    }
    expect(s.combat.enemies).toHaveLength(0);
    expect(s.gathering.units[0].order.kind).toBe('idle');expect(s.gathering.units[0].navigation).toBeUndefined();
  });
  it('sealed wall prevents damage; relevant revision opens pursuit', () => {
    let s=createMatch();s.gathering.units=[soldier(240,144)];s.combat.enemies=[{id:'e',hp:36,position:{x:48,y:144}}];
    s.map=replaceObstacles(s.map,[...s.map.obstacles,{x:208,y:0,width:16,height:s.map.height}]);
    const blocked=updateCombat(s.gathering,s.combat,10,s.map);
    expect(blocked.combat.enemies[0].hp).toBe(36);expect(blocked.gathering.units[0].navigation?.status).toBe('blocked');
    expect(blocked.combat.baseHP).toBe(combatConfig.baseHP);
    s={...s,...blocked,map:replaceObstacles(s.map,s.map.obstacles.slice(0,-1))};
    for(let i=0;i<300 && s.combat.enemies.length;i++)s={...s,...updateCombat(s.gathering,s.combat,.05,s.map)};
    expect(s.combat.enemies).toHaveLength(0);
  });
  it('no melee through thin terrain even inside nominal range', () => {
    const s=createMatch();s.gathering.units=[soldier(300,200)];
    s.combat.enemies=[{id:'e',hp:36,position:{x:340,y:200}}];
    const m=replaceObstacles(s.map,[...s.map.obstacles,{x:316,y:0,width:8,height:s.map.height}]);
    const result=updateCombat(s.gathering,s.combat,1,m);
    expect(result.combat.enemies[0].hp).toBe(36);expect(result.gathering.units[0].kind==='soldier' && result.gathering.units[0].hp).toBe(60);
  });
  it('follows moved targets with cached cooldown instead of searching every frame', () => {
    const s=createMatch();s.gathering.units=[soldier(300,300)];s.combat.enemies=[{id:'e',hp:36,position:{x:700,y:100}}];
    const first=updateCombat(s.gathering,s.combat,.01,s.map);
    const before=first.gathering.units[0].navigation!.goalKey;
    first.combat.enemies[0].position={x:720,y:110};
    const next=updateCombat(first.gathering,first.combat,.01,s.map);
    expect(next.gathering.units[0].navigation?.goalKey).toBe(before);
    const replanned=updateCombat(next.gathering,next.combat,.3,s.map);
    expect(replanned.gathering.units[0].navigation?.goalKey).not.toBe(before);
    replanned.combat.enemies=[];
    const cleared=updateCombat(replanned.gathering,replanned.combat,.1,s.map);
    expect(cleared.gathering.units[0].navigation).toBeUndefined();expect(cleared.gathering.units[0].order.kind).toBe('idle');
  });
  it('enemies reach and damage the base via open routes, with no enclosed-base remote damage', () => {
    const s=createMatch();s.combat.enemies=[{id:'e',hp:36,position:{x:740,y:60}}];
    const reachable=updateCombat(s.gathering,s.combat,20,s.map);
    expect(reachable.combat.baseHP).toBeLessThan(combatConfig.baseHP);
    expect(bodyFits(s.map,reachable.combat.enemies[0].position,12)).toBe(true);
    const m=replaceObstacles(s.map,[...s.map.obstacles,
      {x:340,y:390,width:120,height:20},{x:340,y:490,width:120,height:20},
      {x:340,y:410,width:20,height:80},{x:440,y:410,width:20,height:80}]);
    const sealed=updateCombat(s.gathering,s.combat,20,m);
    expect(sealed.combat.baseHP).toBe(combatConfig.baseHP);expect(sealed.combat.enemies[0].navigation?.status).toBe('blocked');
  });
  it('new attack leaves worker orders intact and restart owns no pursuit cache', () => {
    const s=createMatch();const worker=s.gathering.units[0];
    s.gathering.units.push(soldier(300,300));
    const ordered=orderAttack(s.gathering.units,'new-target');expect(ordered[0]).toBe(worker);
    expect(createMatch().combat.enemies).toHaveLength(0);
  });
  it('actual footprint match keeps defeat priority for simultaneous base/last-enemy death', () => {
    const s=createMatch();s.waves.nextWave=3;s.waves.elapsedSeconds=120;s.combat.baseHP=6;
    s.gathering.units=[soldier(596,450)];s.combat.enemies=[{id:'e',hp:18,position:{x:436,y:450}}];
    const ended=updateMatch(s,2);
    expect(ended.combat.baseHP).toBe(0);expect(ended.combat.enemies).toHaveLength(0);
    expect(ended.outcome).toBe('defeat');expect(updateMatch(ended,100)).toBe(ended);
  });

});
