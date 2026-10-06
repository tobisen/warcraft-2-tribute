import type {MatchState} from './match';
export const resourceCheatCode='icanseemyhousefromhere';
/** Granted resources are not gathered income; retain the existing statistics. */
export function applyResourceCheat(m:MatchState,code:string):MatchState {
 if((m.gathering.resourceCheatUses??0)>=1000000||m.paused||m.outcome!=='playing'||code.trim().toLowerCase()!==resourceCheatCode)return m;
 return {...m,gathering:{...m.gathering,resourceCheatUses:(m.gathering.resourceCheatUses??0)+1,wood:m.gathering.wood+100000,goldBalance:(m.gathering.goldBalance??0)+100000}};
}
