import {validMatchOptions,patchMatchOptions} from './matchSettings';
import {initialGameSpeed,type GameSpeed} from '../config/gameSpeed';
import type {MapId} from '../config/maps';
import type {FactionId} from '../config/factions';
import type { Difficulty } from '../config/difficulty';
import type { MatchScenario } from '../config/scenarios';
export type SessionPhase='menu'|'playing'|'paused'|'ended';
export interface MatchOptions {scenario:MatchScenario;difficulty:Difficulty;map:MapId;faction?:FactionId;enemyFaction?:FactionId;speed?:GameSpeed}
export interface MatchSession {phase:SessionPhase;options:MatchOptions}
export type SessionAction='start'|'pause'|'resume'|'restart'|'new-match'|'end';
export function createSession(options:MatchOptions):MatchSession{if(!validMatchOptions(options))throw Error('Invalid match settings');return {phase:'menu',options:{...options}};}
export function sessionTransition(session:MatchSession,action:SessionAction):MatchSession {
 const p=session.phase;
 const phase:SessionPhase=action==='start'&&p==='menu'||action==='resume'&&p==='paused'||action==='restart'&&(p==='paused'||p==='ended')?'playing'
  :action==='pause'&&p==='playing'?'paused':action==='new-match'?'menu':action==='end'&&p==='playing'?'ended':p;
 return phase===p?session:{...session,phase};
}
export function changeOptions(session:MatchSession,options:Partial<MatchOptions>):MatchSession{if(session.phase!=='menu')return session;const next=patchMatchOptions(session.options,options);return next?{...session,options:next}:session;}
/** No accumulator: the resume/start frame is intentionally discarded, including long wall-time deltas. */
export function gameplayDelta(phase:SessionPhase,deltaSeconds:number,skipFrame:boolean,speed:GameSpeed=1):number{return phase==='playing'&&!skipFrame?Math.max(0,deltaSeconds)*initialGameSpeed(speed):0;}
