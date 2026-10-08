import {factionForTeam,type UnitPrerequisites} from '../config/factions';
import {baseUpgradeConfig} from '../config/baseUpgrade';
import {extraBaseConfig} from '../config/extraBases';
import {defenseConfig} from '../config/defenses';
import {campaignActionReason} from '../config/campaignContent';
import {costLabel,canAfford} from '../gameplay/economy';
import {technologyFor,missingPrerequisites} from '../gameplay/productionPrerequisites';
import {hasMainBase} from '../gameplay/extraBases';
import {workerToolsConfig} from '../config/workerTools';
import {researchRecipe} from '../gameplay/research';
import type {MatchState} from '../gameplay/match';
import {actionPanel,type ActionId} from './actionPanel';
export const technologyBranches=['Settlement','Army','Fleet','Research'] as const;
export type TechnologyBranch=typeof technologyBranches[number];
export interface TechnologyNode {id:string;label:string;branch:TechnologyBranch;tier:1|2|3;dependencies:string[];missing:string[];status:'unlocked'|'available'|'locked';cost:string;purpose:string;blocker:string;campaign:string|null}
export function technologyView(m:MatchState){
 const f=factionForTeam(m,'player'),tech=technologyFor(m,'player'),nodes:TechnologyNode[]=[];
 const panels={none:actionPanel(m,null,true),stable:actionPanel(m,'stable',true),base:actionPanel(m,'base',true),barracks:actionPanel(m,'barracks',true),harbor:actionPanel(m,'harbor',true)};
 const deps=(r?:UnitPrerequisites)=>[...(r?.buildings??[]).map(b=>f.buildingNames[b]),...(r?.baseLevel?[`${f.buildingNames.base} level ${r.baseLevel}`]:[]),...Object.entries(r?.research??{}).map(([k,v])=>`${f.upgrades[k as 'attack'|'defense'].name} ${v===1?'I':'II'}`)];
 const add=(input:Omit<TechnologyNode,'status'|'campaign'>,owned=false,action?:ActionId,campaignOverride?:string|null)=>{
  const campaign=campaignOverride??(action?campaignActionReason(m,action):null),missing=campaign?[...input.missing,campaign]:owned?[]:input.missing;
  nodes.push({...input,missing,campaign,status:missing.length?'locked':owned?'unlocked':input.blocker?'unlocked':'available'});
 };
 const purposes={stable:'Trains fast mounted raiders; infantry deals 50% more melee damage to cavalry.',base:'Trains workers and receives delivered resources.',barracks:'Trains your faction’s combat roster.',farm:'Provides population capacity.',forge:'Unlocks research and advanced units.',academy:'Unlocks attack and defense II.',harbor:'Trains transports and warships at a coastal exit.'};
 for(const kind of ['base','barracks','farm','forge','academy','stable','harbor'] as const){
  const naval=kind==='harbor',r=naval?{buildings:['base'] as const}:f.buildings[kind].prerequisites,owned=naval?!!m.navy?.harbor&&m.navy.harbor.hp>0&&m.navy.harbor.construction.remainingSeconds===0:tech.buildings.includes(kind);
  const recipe=naval?f.naval.harbor:f.buildings[kind],a=kind==='base'?undefined:panels.none[`build-${kind}`];
  add({id:`building-${kind}`,label:naval?f.naval.harbor.name:f.buildingNames[kind],branch:naval?'Fleet':'Settlement',tier:kind==='academy'?3:kind==='forge'||kind==='stable'||naval?2:1,dependencies:deps(r),missing:missingPrerequisites(f,r,tech),cost:`${costLabel(recipe.cost)} · ${recipe.constructionSeconds}s`,purpose:purposes[kind],blocker:owned?'Built':a?.reason??''},owned,kind==='base'?undefined:`build-${kind}`);
 }
 add({id:'build-base',label:'Additional main base',branch:'Settlement',tier:1,dependencies:[f.buildingNames.base,'Worker'],missing:[],cost:`${costLabel(extraBaseConfig.cost)} · ${extraBaseConfig.constructionSeconds}s`,purpose:'Separate worker queue and rally; shared economy and technology.',blocker:panels.none['build-base'].reason},false,'build-base');
 for(const kind of ['wall','gate','tower'] as const){const r=defenseConfig[kind];add({id:`building-${kind}`,label:kind[0]!.toUpperCase()+kind.slice(1),branch:'Settlement',tier:1,dependencies:['Worker'],missing:[],cost:`${costLabel(r.cost)} · ${r.seconds}s`,purpose:kind==='wall'?'Blocks movement until destroyed.':kind==='gate'?'A controllable passage for your team.':'Attacks visible enemies in range.',blocker:panels.none[`build-${kind}`].reason},false,`build-${kind}`);}
 for(const role of f.roster){
  const r=f.units[role],prereq={...r.prerequisites,buildings:[...new Set([r.trainedAt,...r.prerequisites?.buildings??[]])]},a=panels[r.trainedAt][`train-${role}`];
  add({id:`unit-${role}`,label:f.unitNames[role],branch:role==='worker'?'Settlement':'Army',tier:role==='air'?3:role==='specialist'||role==='catapult'||role==='cavalry'?2:1,dependencies:deps(prereq),missing:missingPrerequisites(f,prereq,tech),cost:`${costLabel(r.cost)} · ${r.durationSeconds}s · ${r.supply} supply`,purpose:role==='worker'?'Gathers, builds, repairs and makes weak melee attacks.':`${role==='cavalry'?'Fast mounted raider; infantry deals +50% melee damage against cavalry':role==='air'?'Flying combat':role==='specialist'?'Specialist with faction spells':role==='catapult'?'Siege':role==='archer'?'Ranged combat':'Melee combat'} unit · ${r.hp} HP · ${r.range??24}px range.`,blocker:a.reason},false,`train-${role}`);
 }
 for(const role of ['transport','warship'] as const){const r=f.naval.units[role],harbor=!!m.navy?.harbor&&m.navy.harbor.hp>0&&m.navy.harbor.construction.remainingSeconds===0;add({id:`unit-${role}`,label:r.name,branch:'Fleet',tier:2,dependencies:[f.naval.harbor.name],missing:harbor?[]:[`Complete ${f.naval.harbor.name}`],cost:`${costLabel(r.cost)} · ${r.durationSeconds}s · ${r.supply} supply`,purpose:role==='transport'?'Carries troops between reachable shores.':'Fights at sea with the existing cannon attack.',blocker:panels.harbor[role==='transport'?'train-transport':'train-ship'].reason},false,role==='transport'?'train-transport':'train-ship');}
 for(const kind of ['attack','defense'] as const)for(const level of [1,2] as const){
  const recipe=researchRecipe(f,kind,level-1),r:UnitPrerequisites=level===1?f.upgrades[kind].prerequisites??{}:{buildings:['forge','academy'],research:{[kind]:1}},done=(tech.research[kind]??0)>=level;
  add({id:`research-${kind}-${level}`,label:`${f.upgrades[kind].name} ${level===1?'I':'II'}`,branch:'Research',tier:level===1?2:3,dependencies:deps(r),missing:missingPrerequisites(f,r,tech),cost:`${costLabel(recipe.cost)} · ${recipe.durationSeconds}s`,purpose:`Military ${kind} improvement, level ${level}. Workers do not receive research bonuses.`,blocker:done?'Researched':m.research?.job?'Research in progress':canAfford(m.gathering,recipe.cost)?'':'Not enough wood or gold'},done,`research-${kind}`,level===2?campaignActionReason(m,'build-academy'):null);
 }
 for(const level of [1,2,3] as const){const recipe=workerToolsConfig[level-1],current=m.research?.workerTools??0,done=current>=level;
  add({id:`research-workerTools-${level}`,label:recipe.name,branch:'Research',tier:level,dependencies:[f.buildingNames.base,...(level>1?[workerToolsConfig[level-2]!.name]:[])],missing:[...(!hasMainBase(m)?['Complete main building']:[]),...(current<level-1?[`Research ${workerToolsConfig[level-2]!.name}`]:[])],cost:`${costLabel(recipe.cost)} · ${recipe.durationSeconds}s`,purpose:`${Math.round((1-recipe.timeMultiplier)*100)}% shorter wood and gold gathering time. Replaces previous tools bonus; capacity 5 unchanged.`,blocker:done?'Researched':m.research?.job?'Research in progress':canAfford(m.gathering,recipe.cost)?'':'Not enough wood or gold'},done,'research-workerTools');
 }
 for(const level of [2,3] as const){const current=tech.baseLevel??1,r=baseUpgradeConfig[level],done=current>=level;add({id:`base-level-${level}`,label:`${f.buildingNames.base} level ${level}`,branch:'Settlement',tier:level,dependencies:[`${f.buildingNames.base} level ${level-1}`],missing:current<level-1?[`Upgrade ${f.buildingNames.base} to level ${level-1}`]:[],cost:`${costLabel(r.cost)} · ${r.seconds}s`,purpose:'Develops your main buildings; worker queues pause during the upgrade.',blocker:done?'Upgraded':m.combat.baseDevelopment?.remainingSeconds!=null?'Upgrade in progress':canAfford(m.gathering,r.cost)?'':'Not enough wood or gold'},done,'upgrade-base');}
 const towerRequirements:UnitPrerequisites={buildings:['forge'],baseLevel:2};
 add({id:'tower-level-2',label:'Tower level 2',branch:'Settlement',tier:2,dependencies:['Tower',...deps(towerRequirements)],missing:[...missingPrerequisites(f,towerRequirements,tech),...(m.placement.defenses?.some(t=>t.kind==='tower'&&t.hp>0&&t.construction.remainingSeconds===0)?[]:['Complete a tower'])],cost:`${costLabel(defenseConfig.upgrade.cost)} · ${defenseConfig.upgrade.seconds}s`,purpose:`Improves tower range to ${defenseConfig.upgrade.range}px and damage to ${defenseConfig.upgrade.damage}.`,blocker:canAfford(m.gathering,defenseConfig.upgrade.cost)?'':'Not enough wood or gold'},m.placement.defenses?.some(t=>t.kind==='tower'&&t.level===2),'upgrade-tower');
 return {faction:f.label,nodes};
}
let branch:TechnologyBranch='Settlement',selected='building-base',signature='';
export function renderTechnologyView(m:MatchState):void {
 const panel=document.getElementById('pause-tech-panel')!;if(panel.hidden)return;
 const model=technologyView(m),next=JSON.stringify(model);if(next===signature&&panel.childElementCount)return;signature=next;
 const title=document.createElement('h3');title.textContent=`${model.faction} technology`;
 const legend=document.createElement('p');legend.className='tech-legend';legend.textContent='Unlocked: owned or ready technology · Available: affordable now · Locked: missing requirements';
 const tabs=document.createElement('nav');tabs.setAttribute('aria-label','Technology branches');
 for(const name of technologyBranches){const b=document.createElement('button');b.type='button';b.textContent=name;b.dataset.techBranch=name;b.setAttribute('aria-pressed',String(name===branch));b.addEventListener('click',()=>{branch=name;signature='';renderTechnologyView(m);document.querySelector<HTMLButtonElement>(`[data-tech-branch="${name}"]`)?.focus();});tabs.append(b);}
 const tree=document.createElement('div');tree.className='technology-tiers';
 const branchNodes=model.nodes.filter(n=>n.branch===branch);if(!branchNodes.some(n=>n.id===selected))selected=branchNodes[0]!.id;
 for(const tier of [1,2,3] as const){const col=document.createElement('section'),h=document.createElement('h4');h.textContent=`${tier}. ${['Foundations','Development','Advanced'][tier-1]}`;col.append(h);
  for(const node of branchNodes.filter(n=>n.tier===tier)){const b=document.createElement('button');b.type='button';b.className='technology-node';b.dataset.techNode=node.id;b.dataset.status=node.status;b.setAttribute('aria-pressed',String(node.id===selected));const name=document.createElement('strong'),state=document.createElement('span'),dependency=document.createElement('small');name.textContent=node.label;state.textContent=node.status[0]!.toUpperCase()+node.status.slice(1);dependency.textContent=node.dependencies.length?`← ${node.dependencies.join(' + ')}`:'Starting technology';b.append(name,state,dependency);b.addEventListener('click',()=>{selected=node.id;signature='';renderTechnologyView(m);document.querySelector<HTMLButtonElement>(`[data-tech-node="${selected}"]`)?.focus();});col.append(b);}
  tree.append(col);
 }
 const node=model.nodes.find(n=>n.id===selected)!,details=document.createElement('section');details.id='technology-details';details.setAttribute('aria-live','polite');const h=document.createElement('h3');h.textContent=node.label;details.append(h);
 for(const text of [node.cost,node.purpose,`Requires: ${node.dependencies.join(' + ')||'None'}`,`Missing: ${node.missing.join('; ')||'None'}`,...node.campaign?[`Campaign: ${node.campaign}`]:[],...node.blocker&&!node.missing.length?[`State: ${node.blocker}`]:[]]){const p=document.createElement('p');p.textContent=text;details.append(p);}
 panel.replaceChildren(title,legend,tabs,tree,details);
}
