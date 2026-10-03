import {navyConfig} from '../config/navy';
import {combatConfig} from '../config/combat';
import {unitBody} from './spawning';
import type {Enemy} from './combat';
/** One physical footprint for naval and land target contact/hit tests. */
export const enemySize=(enemy:Enemy)=>enemy.kind==='ship'?navyConfig.ship.size:combatConfig.enemySize;
export const enemyBody=(enemy:Enemy)=>enemy.footprint??unitBody(enemy.position,enemySize(enemy));
