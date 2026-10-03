import {text as uiText} from '../text';
import {routeErrors} from './hud';
import type {MatchState} from '../gameplay/match';
import type {BuildingSelection} from '../gameplay/buildingSelection';
export function commandFeedback(m:MatchState,building:BuildingSelection,modes:{placementError:string|null;attackMove:boolean;unload:boolean}){
 if(m.paused||m.outcome!=='playing')return {message:'',error:false};
 if(m.placement.active)return {message:modes.placementError?`${uiText.cannotBuildHere} · ${modes.placementError}`:'Valid site · Click to build. Escape/right-click cancels.',error:!!modes.placementError};
 if(modes.attackMove)return {message:'Attack-move · Click a destination. Escape/right-click cancels.',error:false};
 if(modes.unload)return {message:'Unload · Click a visible landing within 64 px. Escape/right-click cancels.',error:false};
 const errors=[...m.gathering.units,...(m.navy?.ships??[])].filter(u=>u.selected&&u.navigation?.error).map(u=>`${u.id}: ${routeErrors[u.navigation!.error!]}`);
 const p=building==='base'?m.production:building==='barracks'?m.soldierProduction:undefined;
 if(p?.rallyError)errors.push('Rally point: blocked or unreachable.');
 return {message:errors.length?errors.join(' · '):uiText.orderLegend,error:errors.length>0};
}
export function renderCommandFeedback(feedback:ReturnType<typeof commandFeedback>):void {const el=document.getElementById('command-feedback')!;if(el.textContent!==feedback.message)el.textContent=feedback.message;el.dataset.error=String(feedback.error);}
