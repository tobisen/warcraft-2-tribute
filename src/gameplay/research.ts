import {roleResearchConfig,isRoleResearch,type RoleResearchKind} from '../config/roleResearch';
import {workerToolsConfig} from '../config/workerTools';
import {contentReason} from '../config/campaignContent';
import {researchAvailability} from './productionPrerequisites';
import {productionFaction,factions,type FactionId} from '../config/factions';
import { canAfford,payCost } from './economy';
import type { GatheringState } from './gathering';
import type { PlacementState } from './placement';
export type ResearchKind=RoleResearchKind|'attack'|'defense'|'workerTools';
export interface ResearchState {queue?:ResearchKind[];cavalryArmor?:number;healerTraining?:number;scoutOptics?:number;submarineDesign?:number;attack:number;defense:number;workerTools?:number;job:{kind:ResearchKind;remainingSeconds:number}|null}
export const createResearch=():ResearchState=>({attack:0,defense:0,job:null});
export function forgeReady(p:PlacementState){return !!p.forge&&(p.forge.hp??0)>0&&p.forge.construction.remainingSeconds===0;}
export function academyReady(p:PlacementState){return !!p.academy&&p.academy.hp>0&&p.academy.construction.remainingSeconds===0||!!p.producers?.some(b=>b.kind==='academy'&&b.hp>0&&b.construction.remainingSeconds===0);}
export const researchLevel=(r:ResearchState,kind:ResearchKind)=>r[kind]??0;
export function researchRecipe(f:import('../config/factions').FactionDefinition,kind:ResearchKind,level:number){
 if(isRoleResearch(kind))return roleResearchConfig[kind];
 if(kind==='workerTools')return workerToolsConfig[Math.min(2,level)]!;
 const r=f.upgrades[kind];return level>=1?{...r,cost:{wood:r.cost.wood*2,gold:r.cost.gold*2},durationSeconds:12}:r;
}
export function canResearch(g:GatheringState,r:ResearchState,p:PlacementState,kind:ResearchKind,playing=true,mainReady=true){
 const level=researchLevel(r,kind),f=productionFaction(g);
 const available=isRoleResearch(kind)?!contentReason(g.campaignContent,'research',kind)&&roleResearchConfig[kind].buildings.every(b=>{const site=p[b];return !!site&&site.hp>0&&site.construction.remainingSeconds===0||!!p.producers?.some(s=>s.kind===b&&s.hp>0&&s.construction.remainingSeconds===0);}):kind==='workerTools'?mainReady:!contentReason(g.campaignContent,'research',kind)&&researchAvailability(f,kind,{buildings:[...(forgeReady(p)?['forge' as const]:[]),...(academyReady(p)?['academy' as const]:[])],research:r})===null;
 return playing&&available&&r.job?.kind!==kind&&!(r.queue??[]).includes(kind)&&level<(isRoleResearch(kind)?1:kind==='workerTools'?3:f.upgrades[kind].maxLevel)&&canAfford(g,researchRecipe(f,kind,level).cost);
}
export function startResearch(g:GatheringState,r:ResearchState,p:PlacementState,kind:ResearchKind,playing=true,mainReady=true){
 const recipe=researchRecipe(productionFaction(g),kind,researchLevel(r,kind));
 return canResearch(g,r,p,kind,playing,mainReady)?{gathering:payCost(g,recipe.cost),research:r.job?{...r,queue:[...(r.queue??[]),kind]}:{...r,job:{kind,remainingSeconds:recipe.durationSeconds}}}:{gathering:g,research:r};
}
export function updateResearch(r:ResearchState,p:PlacementState,delta:number,playing=true,faction:FactionId='crown',mainReady=true):ResearchState {
 if(!playing)return r;
 const valid=(kind:ResearchKind)=>isRoleResearch(kind)?roleResearchConfig[kind].buildings.every(b=>{const site=p[b];return !!site&&site.hp>0&&site.construction.remainingSeconds===0||!!p.producers?.some(s=>s.kind===b&&s.hp>0&&s.construction.remainingSeconds===0);}):kind==='workerTools'?mainReady:forgeReady(p)&&(researchLevel(r,kind)<1||academyReady(p));
 let queue=(r.queue??[]).filter(valid),job=r.job;
 if(job&&!valid(job.kind))job=null;
 let next:ResearchState={...r,job,...(r.queue?{queue}: {})};
 let time=Math.max(0,delta);
 while(job||queue.length){
  if(!job){const kind=queue.shift()!;job={kind,remainingSeconds:researchRecipe(factions[faction],kind,researchLevel(next,kind)).durationSeconds};}
  const left=Math.max(0,job.remainingSeconds-time);
  if(left>1e-10){job={...job,remainingSeconds:left};break;}
  time=Math.max(0,time-job.remainingSeconds);
  const kind=job.kind;
  next={...next,[kind]:Math.min(isRoleResearch(kind)?1:kind==='workerTools'?3:factions[faction].upgrades[kind].maxLevel,researchLevel(next,kind)+1)};job=null;
 }
 if(!r.job&&!r.queue?.length)return r;
 return {...next,job,...(r.queue?{queue}: {})};
}

export function researchSummary(r:ResearchState,faction:FactionId='crown'):string {
 const f=factions[faction],label=(kind:ResearchKind)=>isRoleResearch(kind)?roleResearchConfig[kind].name:kind==='workerTools'?'Worker Tools':f.upgrades[kind].name;
 const job=r.job;
 const active=job?`${label(job.kind)} ${Math.round(100*(1-job.remainingSeconds/researchRecipe(f,job.kind,researchLevel(r,job.kind)).durationSeconds))}% · ${job.remainingSeconds.toFixed(1)}s remaining`:'Research idle';
 return active+(r.queue?.length?' · Queue: '+r.queue.map((kind,i)=>`${i+1}. ${label(kind)}`).join(' → '):'');
}
