import {navyConfig} from '../config/navy';
import {enemyUnitStats} from './enemyUnits';
import {unitBody} from './spawning';
import type {Enemy} from './combat';
/** One physical footprint for naval and land target contact/hit tests. */
export const enemySize=(enemy:Enemy)=>enemy.kind==='ship'?navyConfig.ship.size:enemy.kind==='worker'?24:enemyUnitStats(enemy).size;
export const enemyBody=(enemy:Enemy)=>enemy.footprint??unitBody(enemy.position,enemySize(enemy));
