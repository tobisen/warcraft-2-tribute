import {hasEnemyBase} from './enemyBases';
import {hasMainBase} from './extraBases';
import type {PlayerId} from '../config/players';
import type {MatchState,MatchOutcome} from './match';
import {playerTeam} from './players';
/** Existing base-elimination rule; surviving assets remain inert, without artificial losses. */
export function playerEliminated(m:MatchState,id:PlayerId):boolean{
 if(id==='player')return !hasMainBase(m);
 const bot=m.multiplePlayers?.ai.find(p=>p.id===id);
 return !!bot&&!hasEnemyBase(bot.state.combat,bot.state.map);
}
export function teamOutcome(m:MatchState):MatchOutcome{
 const roster=m.multiplePlayers!.roster,own=playerTeam('player',roster);
 const active=roster.filter(p=>!playerEliminated(m,p.id));
 return !active.some(p=>playerTeam(p.id,roster)===own)?'defeat':!active.some(p=>playerTeam(p.id,roster)!==own)?'victory':'playing';
}
export function isSpectating(m:MatchState):boolean{return !!m.multiplePlayers&&m.outcome==='playing'&&playerEliminated(m,'player');}
