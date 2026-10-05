import { combatConfig } from '../config/combat';
import { waveSchedule, waveSpawn } from '../config/waves';
import type { CombatState, Enemy } from './combat';

export interface WaveState { elapsedSeconds: number; nextWave: number; nextEnemyNumber: number }

export function updateWaves(waves: WaveState, combat: CombatState, deltaSeconds: number,schedule:readonly {atSeconds:number;count:number}[]=waveSchedule,spawn:{x:number;y:number;spacing:number}=waveSpawn) {
  const elapsedSeconds = waves.elapsedSeconds + Math.max(0, deltaSeconds);
  let nextWave = waves.nextWave;
  let nextEnemyNumber = waves.nextEnemyNumber;
  const spawned: Enemy[] = [];
  while (nextWave < schedule.length && elapsedSeconds + 1e-10 >= schedule[nextWave].atSeconds) {
    const wave = schedule[nextWave];
    for (let i = 0; i < wave.count; i++) spawned.push({
      owner:'enemy',id: `enemy-${nextEnemyNumber++}`, hp: combatConfig.enemyHP,
      position: { x: spawn.x, y: spawn.y + i * spawn.spacing },
    });
    nextWave++;
  }
  return {
    waves: { elapsedSeconds, nextWave, nextEnemyNumber },
    combat: { ...combat, enemies: [...combat.enemies, ...spawned] },
  };
}
