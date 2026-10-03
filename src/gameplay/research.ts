import {productionFaction,factions,type FactionId} from '../config/factions';
import { upgradeConfig } from '../config/upgrades';
import { canAfford,payCost } from './economy';
import type { GatheringState } from './gathering';
import type { PlacementState } from './placement';
export type ResearchKind='attack'|'defense';
export interface ResearchState {attack:number;defense:number;job:{kind:ResearchKind;remainingSeconds:number}|null}
export const createResearch=():ResearchState=>({attack:0,defense:0,job:null});
export function forgeReady(p:PlacementState){return !!p.forge&&(p.forge.hp??0)>0&&p.forge.construction.remainingSeconds===0;}
export function canResearch(g:GatheringState,r:ResearchState,p:PlacementState,kind:ResearchKind,playing=true){return playing&&forgeReady(p)&&!r.job&&r[kind]<productionFaction(g).upgrades[kind].maxLevel&&canAfford(g,productionFaction(g).upgrades[kind].cost);}
export function startResearch(g:GatheringState,r:ResearchState,p:PlacementState,kind:ResearchKind,playing=true){
 return canResearch(g,r,p,kind,playing)?{gathering:payCost(g,productionFaction(g).upgrades[kind].cost),research:{...r,job:{kind,remainingSeconds:productionFaction(g).upgrades[kind].durationSeconds}}}:{gathering:g,research:r};
}
export function updateResearch(r:ResearchState,p:PlacementState,delta:number,playing=true,faction:FactionId='crown'):ResearchState {
 if(!playing||!r.job)return r;
 if(!forgeReady(p))return {...r,job:null};
 const remainingSeconds=Math.max(0,r.job.remainingSeconds-Math.max(0,delta));
 return remainingSeconds>1e-10?{...r,job:{...r.job,remainingSeconds}}:{...r,[r.job.kind]:Math.min(factions[faction].upgrades[r.job.kind].maxLevel,r[r.job.kind]+1),job:null};
}
