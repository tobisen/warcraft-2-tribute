import { expect, it } from 'vitest';
import { playableScenarios, scenarioConfig } from '../config/scenarios';
import { createMatch, updateMatch } from './match';
import { releasePlaythrough } from './testHelpers/releaseBot';
for (const scenario of playableScenarios.filter(id=>id!=='tutorial'&&scenarioConfig[id].map==='arena')) for (const difficulty of ['easy', 'normal', 'hard'] as const) {
  it(`release ${scenario}/${difficulty}: legal economy, combat, pause/save, outcome and fresh restart`, () => {
    const { match, spentWood, spentGold, saved } = releasePlaythrough(scenario, difficulty);
    console.info(`${scenario}/${difficulty}: ${match.outcome} ${match.waves.elapsedSeconds.toFixed(2)}s base=${match.combat.baseHP.toFixed(1)}`);
    expect(match.outcome).toBe('victory'); expect(saved).toBe(true);
    expect(match.combat.baseHP).toBeGreaterThan(0);
    expect(updateMatch(match, 999)).toBe(match);
    const cargo = (resource: string) => match.gathering.units.reduce((n,u) => n + (u.kind === 'worker' && (u.cargoType ?? 'wood') === resource ? u.cargo : 0), 0);
    expect(match.gathering.wood + match.gathering.node.remaining + cargo('wood') + (match.enemyProduction?.extracted?.wood ?? 0) + spentWood + (match.gathering.lostCargo?.wood ?? 0)).toBeCloseTo(400 + scenarioConfig[scenario].initial.wood);
    expect((match.gathering.goldBalance ?? 0) + match.gathering.gold!.remaining + cargo('gold') + (match.enemyProduction?.extracted?.gold ?? 0) + spentGold + (match.gathering.lostCargo?.gold ?? 0)).toBeCloseTo(300 + scenarioConfig[scenario].initial.gold);
    const restart = createMatch(scenario, difficulty);
    expect(restart.outcome).toBe('playing'); expect(restart.waves.elapsedSeconds).toBe(0);
    expect(restart.gathering.units).toHaveLength(3); expect(restart.gathering.wood).toBe(scenarioConfig[scenario].initial.wood);
  }, 30_000);
}
