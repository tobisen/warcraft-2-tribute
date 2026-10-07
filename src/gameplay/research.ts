import {workerToolsConfig} from '../config/workerTools';
import {contentReason} from '../config/campaignContent';
import {researchAvailability} from './productionPrerequisites';
import {productionFaction,factions,type FactionId} from '../config/factions';
import { upgradeConfig } from '../config/upgrades';
import { canAfford,payCost } from './economy';
import type { GatheringState } from './gathering';
import type { PlacementState } from './placement';
export type ResearchKind='attack'|'defense'|'workerTools';
export interface ResearchState {attack:number;defense:number;workerTools?:number;job:{kind:ResearchKind;remainingSeconds:number}|null}
export const createResearch=():ResearchState=>({attack:0,defense:0,job:null});
export function forgeReady(p:PlacementState){return !!p.forge&&(p.forge.hp??0)>0&&p.forge.construction.remainingSeconds===0;}
export function academyReady(p:PlacementState){return !!p.academy&&p.academy.hp>0&&p.academy.construction.remainingSeconds===0;}
export const researchLevel=(r:ResearchState,kind:ResearchKind)=>r[kind]??0;
export function researchRecipe(f:import('../config/factions').FactionDefinition,kind:ResearchKind,level:number){
 if(kind==='workerTools')return workerToolsConfig[Math.min(2,level)]!;
 const r=f.upgrades[kind];return level>=1?{...r,cost:{wood:r.cost.wood*2,gold:r.cost.gold*2},durationSeconds:12}:r;
}
export function canResearch(g:GatheringState,r:ResearchState,p:PlacementState,kind:ResearchKind,playing=true,mainReady=true){
 const level=researchLevel(r,kind),f=productionFaction(g);
 const available=kind==='workerTools'?mainReady:!contentReason(g.campaignContent,'research',kind)&&researchAvailability(f,kind,{buildings:[...(forgeReady(p)?['forge' as const]:[]),...(academyReady(p)?['academy' as const]:[])],research:r})===null;
 return playing&&available&&!r.job&&level<(kind==='workerTools'?3:f.upgrades[kind].maxLevel)&&canAfford(g,researchRecipe(f,kind,level).cost);
}
export function startResearch(g:GatheringState,r:ResearchState,p:PlacementState,kind:ResearchKind,playing=true,mainReady=true){
 const recipe=researchRecipe(productionFaction(g),kind,researchLevel(r,kind));
 return canResearch(g,r,p,kind,playing,mainReady)?{gathering:payCost(g,recipe.cost),research:{...r,job:{kind,remainingSeconds:recipe.durationSeconds}}}:{gathering:g,research:r};
}
export function updateResearch(r:ResearchState,p:PlacementState,delta:number,playing=true,faction:FactionId='crown',mainReady=true):ResearchState {
 if(!playing||!r.job)return r;
 const kind=r.job.kind,level=researchLevel(r,kind);
 if(kind==='workerTools'?!mainReady:!forgeReady(p)||level>=1&&!academyReady(p))return {...r,job:null};
 const remainingSeconds=Math.max(0,r.job.remainingSeconds-Math.max(0,delta));
 return remainingSeconds>1e-10?{...r,job:{...r.job,remainingSeconds}}:{...r,[kind]:Math.min(kind==='workerTools'?3:factions[faction].upgrades[kind].maxLevel,level+1),job:null};
}
