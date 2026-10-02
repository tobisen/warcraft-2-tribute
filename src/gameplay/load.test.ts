import {expect,it} from 'vitest';
import {createLoadFixture} from './testHelpers/loadFixture';
import {createMatch,updateMatch} from './match';
import {bodyFits} from './map';
import {combatUnitStats,unitStats} from '../config/unit';
import {entityVisible} from './visibility';
for(const total of [64,128] as const)it(`mixed ${total}-body load keeps bounded world positions, resource ledger and a fresh reset`,()=>{
  let m=createLoadFixture(total);
  expect(m.gathering.units.length+m.combat.enemies.filter(e=>e.kind!=='base').length).toBe(total);
  for(let i=0;i<120;i++){
    m=updateMatch(m,1/30);
    expect(m.outcome).toBe('playing');
    for(const u of m.gathering.units){expect(Number.isFinite(u.position.x)&&Number.isFinite(u.position.y)).toBe(true);expect(bodyFits(m.map,u.position,(u.kind==='worker'?unitStats:combatUnitStats(u)).size/2)).toBe(true);}
    expect(m.gathering.node.remaining+m.gathering.wood+m.gathering.units.reduce((n,u)=>n+u.cargo,0)+(m.gathering.lostCargo?.wood??0)).toBeCloseTo(400,6);
    expect(m.fog!.teams.player.visible.filter(Boolean).length).toBeGreaterThan(0);
    expect(entityVisible(m.fog!,'player',{position:{x:1200,y:920}})).toBe(false);
  }
  m.paused=true;expect(updateMatch(m,500)).toBe(m);
  const fresh=createMatch('skirmish','easy');expect(fresh.gathering.units).toHaveLength(3);expect(fresh.gathering.node.remaining).toBe(400);expect(fresh.waves.elapsedSeconds).toBe(0);
},30000); // Shared CI is slower; CPU budgets are asserted in the browser profiler.
