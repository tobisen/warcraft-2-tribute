import {createFog} from './fog';
import {matchFog} from './matchFog';
import type {MatchState} from './match';
export const resourceCheatCode='icanseemyhousefromhere';
/** Granted resources are not gathered income; retain the existing statistics. */
export function applyResourceCheat(m:MatchState,code:string):MatchState {
 if((m.gathering.resourceCheatUses??0)>=1000000||m.paused||m.outcome!=='playing'||code.trim().toLowerCase()!==resourceCheatCode)return m;
 return {...m,gathering:{...m.gathering,resourceCheatUses:(m.gathering.resourceCheatUses??0)+1,wood:m.gathering.wood+100000,goldBalance:(m.gathering.goldBalance??0)+100000}};
}

export const fogCheatCode='foggoffnow';
/** Reveal player vision permanently for this match, including subsequent fog updates. */
export function applyCheat(m:MatchState,code:string):MatchState {
 if(m.paused||m.outcome!=='playing')return m;
 if(code.trim().toLowerCase()!==fogCheatCode)return applyResourceCheat(m,code);
 const next={...m,fog:{...(m.fog??createFog(m.map)),revealed:true as const}};
 return {...next,fog:matchFog(next)};
}
