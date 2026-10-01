import { combatConfig } from '../config/combat';
import { waveSchedule, waveSpawn } from '../config/waves';
import type { CombatState, Enemy } from './combat';

export interface WaveState { elapsedSeconds: number; nextWave: number; nextEnemyNumber: number }

export function updateWaves(waves: WaveState, combat: CombatState, deltaSeconds: number) {
  const elapsedSeconds = waves.elapsedSeconds + Math.max(0, deltaSeconds);
  let nextWave = waves.nextWave;
  let nextEnemyNumber = waves.nextEnemyNumber;
  const spawned: Enemy[] = [];
  while (nextWave < waveSchedule.length && elapsedSeconds + 1e-10 >= waveSchedule[nextWave].atSeconds) {
    const wave = waveSchedule[nextWave];
    for (let i = 0; i < wave.count; i++) spawned.push({
      id: `enemy-${nextEnemyNumber++}`, hp: combatConfig.enemyHP,
      position: { x: waveSpawn.x, y: waveSpawn.y + i * waveSpawn.spacing },
    });
    nextWave++;
  }
  return {
    waves: { elapsedSeconds, nextWave, nextEnemyNumber },
    combat: { ...combat, enemies: [...combat.enemies, ...spawned] },
  };
}
