import { describe, expect, it } from 'vitest';
import { waveSchedule } from '../config/waves';
import { gatheringConfig } from '../config/gathering';
import { barracksConfig, worldConfig } from '../config/buildings';
import { soldierProductionConfig } from '../config/production';
import { combatConfig } from '../config/combat';
import { updateWaves, type WaveState } from './waves';
import type { CombatState } from './combat';
const initial = (): { waves: WaveState; combat: CombatState } => ({
  waves: {elapsedSeconds:0,nextWave:0,nextEnemyNumber:1}, combat:{baseHP:240,enemies:[]},
});
describe('finite waves', () => {
  it('spawns at the boundary, never before, and never duplicates a wave', () => {
    const before=updateWaves(initial().waves,initial().combat,59.9);
    expect(before.combat.enemies).toHaveLength(0);
    const at=updateWaves(before.waves,before.combat,0.1);
    expect(at.combat.enemies).toHaveLength(1);
    expect(at.waves.nextWave).toBe(1);
    expect(updateWaves(at.waves,at.combat,0).combat.enemies).toEqual(at.combat.enemies);
  });
  it.each([1,120,7200])('crossing all waves over %s steps produces the same six enemies', steps => {
    let result=initial();
    for(let i=0;i<steps;i++) result=updateWaves(result.waves,result.combat,120/steps);
    expect(result.waves.nextWave).toBe(waveSchedule.length);
    expect(result.combat.enemies).toHaveLength(6);
    expect(new Set(result.combat.enemies.map(e=>e.id)).size).toBe(6);
    expect(updateWaves(result.waves,result.combat,1000).combat.enemies).toEqual(result.combat.enemies);
  });
  it('does not reuse IDs after enemies die and keeps spawn bodies inside the arena', () => {
    const first=updateWaves(initial().waves,initial().combat,60);
    const next=updateWaves(first.waves,{...first.combat,enemies:[]},60);
    expect(next.combat.enemies.map(e=>e.id)).toEqual(['enemy-2','enemy-3','enemy-4','enemy-5','enemy-6']);
    for(const enemy of next.combat.enemies){
      expect(enemy.position.x-combatConfig.enemySize/2).toBeGreaterThanOrEqual(0);
      expect(enemy.position.x+combatConfig.enemySize/2).toBeLessThanOrEqual(worldConfig.width);
      expect(enemy.position.y-combatConfig.enemySize/2).toBeGreaterThanOrEqual(0);
      expect(enemy.position.y+combatConfig.enemySize/2).toBeLessThanOrEqual(worldConfig.height);
    }
  });
  it('resource budget supports barracks and multiple replacement soldiers', () => {
    expect(gatheringConfig.initialWood-barracksConfig.cost).toBeGreaterThanOrEqual(10*soldierProductionConfig.cost);
  });
});
