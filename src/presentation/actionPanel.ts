import {roleResearchConfig,isRoleResearch} from '../config/roleResearch';
import {canResearch} from '../gameplay/research';
import {workerToolsConfig} from '../config/workerTools';
import {researchRecipe} from '../gameplay/research';
import {extraBaseConfig} from '../config/extraBases';
import {hasMainBase,selectedBase} from '../gameplay/extraBases';
import {campaignActionReason} from '../config/campaignContent';
import {setActionLabel} from './actionLabel';
import {isAir} from '../gameplay/domains';
import {selectedSpellCaster,spellCasterReason,selectedSpellForSlot} from '../gameplay/spells';
import {spellDefinition,spellDescription,spellForSlot,type SpellSlot} from '../config/spells';
import {towerUpgradeReason} from '../gameplay/towers';import {defenseConfig} from '../config/defenses';
import {baseDevelopment,baseUpgradeReason} from '../gameplay/baseUpgrade';
import {baseUpgradeConfig} from '../config/baseUpgrade';
import {technologyFor,unitAvailability,buildingAvailability,researchAvailability} from '../gameplay/productionPrerequisites';
import {text as uiText} from '../text';
import type {ResourceCost} from '../config/economy';
import {factionForTeam,type UnitPrerequisites} from '../config/factions';
import {costs} from '../config/economy';
import {farmLimit} from '../config/buildings';
import {navyConfig} from '../config/navy';
import {queueConfig} from '../config/production';
import {upgradeConfig} from '../config/upgrades';
import {costLabel} from '../gameplay/economy';
import {matchPopulation} from '../gameplay/navy';
import {hasPopulation} from '../gameplay/population';
import {productionJobCount} from '../gameplay/productionQueue';
import {abilityReady} from '../gameplay/abilities';
import {forgeReady} from '../gameplay/research';
import type {BuildingSelection} from '../gameplay/buildingSelection';
import type {MatchState} from '../gameplay/match';
import {hotkeys} from './hotkeys';
export const actionIds=['train-submarine','research-submarineDesign','build-siegeWorks','train-ballista','research-cavalryArmor','research-healerTraining','research-scoutOptics','build-aviary','train-scout','scout-route','auto-scout','train-giant','train-healer','autocast-heal','build-stable','train-cavalry','cast-heal','cast-ward','cast-hex','repair-building','build-wall','build-gate','build-tower','upgrade-tower','upgrade-tower-air','upgrade-base','train-worker','train-soldier','train-archer','train-catapult','train-specialist','train-air','train-transport','train-ship','build-academy','build-base','build-barracks','build-farm','build-forge','build-harbor','research-workerTools','research-attack','research-defense','attack-move','unit-ability','unload-transport','hold-position','patrol-units','stop-units','dismiss-units'] as const;
export type ActionId=typeof actionIds[number];
export const actionGroups=['Orders','Build','Train','Research','Spells'] as const;
export function actionGroup(id:ActionId):typeof actionGroups[number]{return id.startsWith('cast-')||id==='autocast-heal'?'Spells':id.startsWith('build-')?'Build':id.startsWith('train-')?'Train':id.startsWith('research-')||id.startsWith('upgrade-')?'Research':'Orders';}
export function actionDescription(id:ActionId,action:ActionPresentation,label:string):string{
 const shortcut=hotkeys.find(h=>h.button===id);
 return [label,action.summary,shortcut?.label,action.cost?`Cost: ${action.cost}`:null,shortcut?`Key: ${shortcut.key}`:null,action.prerequisites?`Requires: ${action.prerequisites}`:null,action.producing?'Production in progress':null,action.reason?`Unavailable: ${action.reason}`:null].filter(Boolean).join(' · ');
}
export function actionTooltip(id:ActionId,action:ActionPresentation,label:string):string{
 const key=hotkeys.find(h=>h.button===id)?.key;
 const name=label.replace(/\s*\[[A-Z0-9]+\]$/,'').split(/\s+[–·]\s+|;/)[0];
 const cost=action.cost?.split(' · ')[0];
 return [`${name}${key?` [${key}]`:''}`,action.summary,cost,action.reason].filter(Boolean).join(' · ');
}
function prerequisiteLabel(p?:UnitPrerequisites):string|undefined {const labels=[...(p?.buildings??[]).map(b=>`Completed ${b}`),...(p?.baseLevel?[`Base level ${p.baseLevel}`]:[]),...Object.entries(p?.research??{}).map(([kind,level])=>`${kind} ${level}`)];return labels.length?labels.join(', '):undefined;}
export interface ActionPresentation {summary?:string;visible:boolean;reason:string;cost?:string;prerequisites?:string;producing?:boolean;active?:boolean}
export function affordabilityReason(balance:{wood:number;goldBalance?:number},cost:ResourceCost):string {
 const wood=balance.wood<cost.wood,gold=(balance.goldBalance??0)<cost.gold;return wood&&gold?uiText.notEnoughWoodAndGold:wood?uiText.notEnoughWood:gold?uiText.notEnoughGold:'';
}
export function actionPanel(m:MatchState,building:BuildingSelection,playing:boolean):Record<ActionId,ActionPresentation>{
 const land=m.gathering.units.filter(u=>u.selected),ships=m.navy?.ships.filter(u=>u.selected)??[],worker=land.some(u=>u.kind==='worker'),combat=land.some(u=>u.kind==='soldier'),transport=ships.find(u=>u.role==='transport'),any=land.length+ships.length>0,base=!!selectedBase(m,building),barracks=building==='barracks',harbor=building==='harbor';
 const faction=factionForTeam(m,'player'),population=matchPopulation(m);
 const result={} as Record<ActionId,ActionPresentation>;
 for(const id of actionIds){let visible=false,reason='',cost,summary:string|undefined,prerequisites:string|undefined,producing=false,active:boolean|undefined;
  if(id.startsWith('cast-')){const spell=selectedSpellForSlot(m,id.slice(5) as SpellSlot),caster=spell?selectedSpellCaster(m,spell):undefined;visible=!!caster;if(spell){const cfg=spellDefinition(spell,faction.id);cost=`${cfg.manaCost} mana · Range ${cfg.range}px · Cooldown ${cfg.cooldown}s · ${spellDescription(spell,faction.id)}`;reason=caster?spellCasterReason(m,caster.id,spell)??'':'Select a specialist';}}
  else if(id==='scout-route'||id==='auto-scout'){visible=land.some(u=>u.kind==='soldier'&&u.archetype==='scout');summary=id==='scout-route'?'Add 2–16 waypoints; click Scout Route again to start a loop. Right-click/Escape cancels input. Manual orders stop scouting.':'Explore from your own fog map, with replanning at most every 5s. Manual orders stop scouting.';active=id==='auto-scout'&&land.some(u=>u.kind==='soldier'&&u.scouting?.mode==='auto');}
  else if(id==='autocast-heal'){const healers=land.filter(u=>u.kind==='soldier'&&u.archetype==='healer');visible=healers.length>0;active=healers.every(u=>u.kind==='soldier'&&u.healAutocast);summary='Toggle automatic Heal: visible damaged biological allies only; 20 mana, 6s cooldown';}
  else if(id==='repair-building'){visible=worker;cost='0.5 wood + 0.1 gold per restored HP';reason=m.gathering.wood<=0||(m.gathering.goldBalance??0)<=0?'Not enough wood or gold':'';}
  else if(id==='build-wall'||id==='build-gate'){visible=worker;cost=costLabel(defenseConfig[id==='build-wall'?'wall':'gate'].cost);reason=m.placement.active?'Finish or cancel placement':affordabilityReason(m.gathering,defenseConfig[id==='build-wall'?'wall':'gate'].cost);}
  else if((id==='upgrade-tower'||id==='upgrade-tower-air')){visible=!!building?.startsWith('tower-');summary=id==='upgrade-tower-air'?'Permanent Anti-Air: air-only, 256px range, 16 damage; inactive during 10s upgrade':'Permanent Ground Defense: ground-only, 192px range, 24 damage; inactive during 10s upgrade';cost=costLabel(defenseConfig.upgrade.cost);reason=towerUpgradeReason(m,building??'')??'';}
  else if(id==='build-tower'){visible=worker;cost=costLabel(defenseConfig.tower.cost);reason=m.placement.active?'Finish or cancel placement':affordabilityReason(m.gathering,defenseConfig.tower.cost);}
  else if(id==='upgrade-base'){visible=base;const b=baseDevelopment(m);cost=b.level<3?costLabel(baseUpgradeConfig[(b.level+1) as 2|3].cost):undefined;reason=(m.placement.bases?.find(b=>b.id===building)?.construction.remainingSeconds??0)>0?'Construction unfinished':baseUpgradeReason(m)??'';}
  else if(id==='build-base'){visible=worker;cost=costLabel(extraBaseConfig.cost);reason=m.placement.active?'Finish or cancel placement':(m.placement.bases?.length??0)>=extraBaseConfig.maxCount?'Maximum three main buildings':affordabilityReason(m.gathering,extraBaseConfig.cost);}
  else if(id.startsWith('build-')){visible=worker;const kind=id.slice(6) as 'siegeWorks'|'aviary'|'stable'|'academy'|'barracks'|'farm'|'forge'|'harbor';const recipe=kind==='harbor'?faction.naval.harbor.cost:faction.buildings[kind].cost;cost=costLabel(recipe);reason=buildingAvailability(faction,kind,technologyFor(m,'player'))??(m.placement.active?'Finish or cancel placement':kind==='siegeWorks'&&m.placement.siegeWorks||kind==='aviary'&&m.placement.aviary||kind==='stable'&&m.placement.stable||kind==='academy'&&m.placement.academy||kind==='barracks'&&m.placement.barracks||kind==='forge'&&m.placement.forge||kind==='harbor'&&m.navy?.harbor?'Already built':kind==='farm'&&(m.placement.farms?.length??0)>=farmLimit(m.map)?'Farm limit reached':affordabilityReason(m.gathering,recipe));}
  else if(id.startsWith('train-')){
   const role=id==='train-ship'?'warship':id.slice(6) as 'worker'|'soldier'|'archer'|'catapult'|'ballista'|'specialist'|'air'|'cavalry'|'healer'|'giant'|'scout'|'transport'|'submarine',naval=role==='submarine'||role==='transport'||role==='warship';
   visible=(role==='worker'?base:naval?harbor:role==='healer'||role==='giant'?building==='academy':role==='catapult'||role==='ballista'?building==='siegeWorks':role==='cavalry'?building==='stable':role==='air'||role==='scout'?building==='aviary':barracks)&&(naval||faction.roster.includes(role as 'worker'|'soldier'|'archer'|'catapult'|'ballista'|'specialist'|'air'|'cavalry'|'healer'|'giant'|'scout'));
   const recipe=naval?faction.naval.units[role as 'transport'|'warship'|'submarine']:faction.units[role];cost=costLabel(recipe.cost);const landPrereq=role!=='transport'&&role!=='warship'&&role!=='submarine'?faction.units[role].prerequisites:undefined;prerequisites=naval?role==='submarine'?'Completed harbor + Submarine Design':'Completed harbor':prerequisiteLabel({...landPrereq,buildings:[...new Set([...(landPrereq?.buildings??[]),role==='worker'?'base':role==='healer'||role==='giant'?'academy':role==='catapult'||role==='ballista'?'siegeWorks':role==='cavalry'?'stable':role==='air'||role==='scout'?'aviary':'barracks'] as const)]});
   const production=role==='worker'?selectedBase(m,building)?.production:naval?m.navy?.production:role==='healer'||role==='giant'?m.placement.academy?.production:role==='catapult'||role==='ballista'?m.placement.siegeWorks?.production:role==='cavalry'?m.placement.stable?.production:role==='air'||role==='scout'?m.placement.aviary?.production:m.soldierProduction;
   producing=!!production?.queue?.some(j=>j.kind===role);
   const remaining=role==='worker'?(m.placement.bases?.find(b=>b.id===building)?.construction.remainingSeconds??0):naval?m.navy?.harbor?.construction.remainingSeconds??1:role==='healer'||role==='giant'?m.placement.academy?.construction.remainingSeconds??1:role==='catapult'||role==='ballista'?m.placement.siegeWorks?.construction.remainingSeconds??1:role==='cavalry'?m.placement.stable?.construction.remainingSeconds??1:role==='air'||role==='scout'?m.placement.aviary?.construction.remainingSeconds??1:m.placement.construction?.remainingSeconds??0;
   if(role==='submarine')summary='Stealth sea unit · ships only · 160px torpedoes · 24 damage /1.8s · detected by warships96px or Scout Optics128px in current vision; firing does not reveal';
   if(role==='ballista')summary='Direct bolt · 224px · 22 damage /2s · 2× building damage · no splash · land/buildings only';
   if(role==='air')summary='Heavy combat flyer · 95 wood +75 gold · 30s ·4 supply ·base III,Academy,research II · attacks ground and air; bows/Anti-Air towers counter';
   if(role==='scout')summary='Unarmed flying scout · 35 HP · 240px/s · 288px vision · 1 supply · 6s · base II';
   if(role==='giant')summary='Heavy ground siege bruiser · 320 HP · 65px/s · 4 supply · 24s · 2.5× building damage; vulnerable to focused ranged fire';
   if(role==='healer')summary='Healing support · 55 HP · 100 max mana · Heal 25 HP, 20 mana, 160px, 6s cooldown · no self, buildings or mechanical targets';
   if(role==='cavalry')summary='Fast mounted melee raider · 110 HP · 230 px/s · 20 DPS · 2 supply · 12s · infantry deals +50% melee damage';
   const prerequisite=naval?role==='submarine'&&!m.research?.submarineDesign?'Research Submarine Design':null:unitAvailability(faction,role,technologyFor(m,'player'));
   reason=remaining>0?'Construction unfinished':prerequisite??(production&&productionJobCount(production)>=queueConfig.maxJobs?'Queue full':!hasPopulation(population,recipe.supply)?uiText.populationLimitReached:affordabilityReason(m.gathering,recipe.cost));
  }
  else if(id.startsWith('research-')&&isRoleResearch(id.slice(9))){const kind=id.slice(9) as import('../config/roleResearch').RoleResearchKind,cfg=roleResearchConfig[kind],level=m.research?.[kind]??0;visible=base||building==='forge'||building==='academy'||building==='stable'||building==='aviary';cost=costLabel(cfg.cost);summary=cfg.description+` · ${cfg.durationSeconds}s`;prerequisites=cfg.buildings.map(b=>faction.buildingNames[b]).join(' + ');reason=level?'Already researched':m.research?.job?'Research in progress':!canResearch(m.gathering,m.research!,m.placement,kind,playing,hasMainBase(m))?'Complete prerequisites and afford research':'';active=m.research?.job?.kind===kind;}
  else if(id==='research-workerTools'){visible=base;const level=m.research?.workerTools??0,recipe=workerToolsConfig[Math.min(2,level)]!;cost=level>=3?undefined:costLabel(recipe.cost);summary=`Level ${level}/3 · ${level>=3?'30% shorter wood/gold gathering · Complete':`Next: ${Math.round((1-recipe.timeMultiplier)*100)}% shorter wood/gold gathering · ${recipe.durationSeconds}s research`}`;reason=level>=3?'Already researched':!hasMainBase(m)?'Base destroyed':(m.placement.bases?.find(b=>b.id===building)?.construction.remainingSeconds??0)>0?'Construction unfinished':m.research?.job?'Research in progress':affordabilityReason(m.gathering,recipe.cost);prerequisites=level>0?`Worker Tools ${['I','II','III'][level-1]}`:'Completed main building';active=m.research?.job?.kind==='workerTools';}
  else if(id.startsWith('research-')){visible=base||building==='forge'||building==='academy';const kind=id==='research-attack'?'attack':'defense';cost=costLabel(researchRecipe(faction,kind,m.research?.[kind]??0).cost);reason=(m.research?.[kind]??0)>=faction.upgrades[kind].maxLevel?'Already researched':researchAvailability(faction,kind,technologyFor(m,'player'))??(m.research?.job?'Research in progress':(m.research?.[kind]??0)>=faction.upgrades[kind].maxLevel?'Already researched':affordabilityReason(m.gathering,researchRecipe(faction,kind,m.research?.[kind]??0).cost));}
  else if(id==='attack-move')visible=land.some(u=>u.kind==='soldier'&&u.archetype!=='scout');
  else if(id==='unit-ability'){visible=land.some(u=>u.kind==='soldier'&&!isAir(u));reason=!land.some(abilityReady)?'Ability cooling down':'';}
  else if(id==='unload-transport'){visible=!!transport;reason=!transport?.passengers?.length?'Transport is empty':'';}
  else visible=any;
  if(id.startsWith('build-')){const kind=id.slice(6);active=!!m.placement.active&&(m.placement.kind??'barracks')===kind;if(kind==='stable'||kind==='academy'||kind==='barracks'||kind==='farm'||kind==='forge')prerequisites=prerequisiteLabel(faction.buildings[kind].prerequisites);}
  if(id.startsWith('research-')&&id!=='research-workerTools'&&!isRoleResearch(id.slice(9))){const kind=id==='research-attack'?'attack':'defense';prerequisites=prerequisiteLabel((m.research?.[kind]??0)>=1?{buildings:['forge','academy']}:faction.upgrades[kind].prerequisites);active=m.research?.job?.kind===kind;}
  if(id==='upgrade-base')active=baseDevelopment(m).remainingSeconds!==null;
  if((id==='upgrade-tower'||id==='upgrade-tower-air'))active=!!m.placement.defenses?.find(t=>t.id===building)?.upgradeRemaining;
  reason=campaignActionReason(m,id)??reason;
  result[id]={visible,reason:visible&&!playing?'Match is paused or ended':reason,cost,summary,prerequisites,producing,active};
 }
 return result;
}
/** Reparent existing controls once; callbacks and shutdown ownership remain in BootScene. */
export function bindActionPanel():void{
 const fieldset=document.getElementById('gameplay-controls')!,bar=document.getElementById('bottom-bar')!;document.getElementById('action-panel')!.append(fieldset);
 const actions=document.createElement('section');actions.id='context-actions';actions.setAttribute('aria-label','Build, train and research');fieldset.append(actions);
 document.getElementById('selection-info')!.prepend(document.getElementById('selection-portrait')!);
 document.getElementById('app')!.append(document.getElementById('minimap-overlay')!);
 for(const group of actionGroups){const section=document.createElement('section'),heading=document.createElement('h3');section.dataset.actionGroup=group;section.setAttribute('aria-label',group);heading.textContent=group==='Orders'?'Orders / Actions':group;section.append(heading);(group==='Orders'?fieldset:actions).append(section);}
 for(const id of actionIds){const button=document.getElementById(id)!;let wrapper=button.parentElement!;if(!wrapper.classList.contains('control')){wrapper=document.createElement('div');wrapper.className='control';button.before(wrapper);wrapper.append(button);}const reason=document.createElement('span');reason.id=`${id}-reason`;reason.className='action-reason';button.setAttribute('aria-describedby',reason.id);wrapper.append(reason);fieldset.querySelector(`[data-action-group="${actionGroup(id)}"]`)!.append(wrapper);}
 bar.append(document.getElementById('production-queue')!);
}
/** Called after authoritative gameplay disabled-state sync. */
export function renderActionPanel(model:ReturnType<typeof actionPanel>):void{
 for(const id of actionIds){const button=document.getElementById(id) as HTMLButtonElement,action=model[id],wrapper=button.parentElement!,reason=document.getElementById(`${id}-reason`)!;wrapper.hidden=!action.visible;button.disabled=button.disabled||!action.visible||!!action.reason;reason.textContent=button.disabled?(action.reason||'Action unavailable'):'';
  const hotkey=hotkeys.find(h=>h.button===id)?.key;button.dataset.producing=String(!!action.producing);if(action.active!==undefined)button.setAttribute('aria-pressed',String(action.active));const presentation={...action,reason:reason.textContent},label=button.textContent??'',tip=actionTooltip(id,presentation,label);button.removeAttribute('title');button.setAttribute('aria-label',actionDescription(id,presentation,label));if(wrapper.dataset.tooltip!==tip)wrapper.dataset.tooltip=tip;wrapper.setAttribute('tabindex',button.disabled?'0':'-1');wrapper.setAttribute('aria-label',button.getAttribute('aria-label')!);if(hotkey){button.dataset.hotkey=hotkey;setActionLabel(button,button.textContent??'');}
 }
 for(const group of actionGroups)(document.querySelector(`[data-action-group="${group}"]`) as HTMLElement).hidden=!actionIds.some(id=>actionGroup(id)===group&&model[id].visible);
 document.getElementById('context-actions')!.classList.toggle('spell-context',actionIds.some(id=>id.startsWith('cast-')&&model[id].visible));
 const productionSelected=actionIds.some(id=>id.startsWith('train-')&&model[id].visible);document.getElementById('production-queue')!.hidden=!productionSelected;
 document.getElementById('action-hint')!.textContent=model['train-transport'].visible?'Ships spawn at a free harbor exit. Select a ship to command it.':productionSelected?'Right-click the world to set a production rally point.':Object.values(model).some(x=>x.visible)?'Right-click: move, gather (workers), attack (workers and combat). Escape: cancel placement.':'Select a unit or production building for actions.';
}
