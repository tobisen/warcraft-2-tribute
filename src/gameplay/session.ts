import type {FactionId} from '../config/factions';
import type { Difficulty } from '../config/difficulty';
import type { MatchScenario } from '../config/scenarios';
export type SessionPhase='menu'|'playing'|'paused'|'ended';
export interface MatchOptions {scenario:MatchScenario;difficulty:Difficulty;map:'arena';faction?:FactionId}
export interface MatchSession {phase:SessionPhase;options:MatchOptions}
export type SessionAction='start'|'pause'|'resume'|'restart'|'new-match'|'end';
export function createSession(options:MatchOptions):MatchSession{return {phase:'menu',options:{...options}};}
export function sessionTransition(session:MatchSession,action:SessionAction):MatchSession {
 const p=session.phase;
 const phase:SessionPhase=action==='start'&&p==='menu'||action==='resume'&&p==='paused'||action==='restart'&&(p==='paused'||p==='ended')?'playing'
  :action==='pause'&&p==='playing'?'paused':action==='new-match'?'menu':action==='end'&&p==='playing'?'ended':p;
 return phase===p?session:{...session,phase};
}
export function changeOptions(session:MatchSession,options:Partial<MatchOptions>):MatchSession{return session.phase==='menu'?{...session,options:{...session.options,...options}}:session;}
/** No accumulator: the resume/start frame is intentionally discarded, including long wall-time deltas. */
export function gameplayDelta(phase:SessionPhase,deltaSeconds:number,skipFrame:boolean):number{return phase==='playing'&&!skipFrame?Math.max(0,deltaSeconds):0;}
