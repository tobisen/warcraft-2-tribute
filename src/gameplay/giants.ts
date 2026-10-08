import type {MatchState} from './match';
import {enqueueProduction} from './productionQueue';
import {healerBuilding} from './healers';
import {hasMainBase} from './extraBases';
import {matchPopulation} from './navy';
/** Shares the completed Academy FIFO with healers, including paid reservations and exit rules. */
export function trainGiant(m:MatchState):MatchState{const a=m.placement.academy;if(!a||m.paused||m.outcome!=='playing'||!hasMainBase(m))return m;const p=a.production??{remainingSeconds:null,queue:[],nextUnitNumber:Math.max(m.production.nextUnitNumber,m.soldierProduction.nextUnitNumber)},r=enqueueProduction(m.gathering,p,{...healerBuilding(m),unitType:'giant'},matchPopulation(m));return {...m,gathering:r.gathering,placement:{...m.placement,academy:{...a,production:r.production}}};}
