import {isAir} from '../gameplay/domains';
import {selectedSpellCaster,spellCasterReason} from '../gameplay/spells';
import {spellDefinition,spellDescription,spellForSlot,type SpellSlot} from '../config/spells';
import {gateToggleReason} from '../gameplay/gates';
import {towerUpgradeReason} from '../gameplay/towers';import {defenseConfig} from '../config/defenses';
import {baseDevelopment,baseUpgradeReason} from '../gameplay/baseUpgrade';
import {baseUpgradeConfig} from '../config/baseUpgrade';
import {technologyFor,unitAvailability,buildingAvailability,researchAvailability} from '../gameplay/productionPrerequisites';
import {text as uiText} from '../text';
import type {ResourceCost} from '../config/economy';
import {factionForTeam} from '../config/factions';
import {costs} from '../config/economy';
import {farmConfig} from '../config/buildings';
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
export const actionIds=['cast-heal','cast-ward','cast-hex','repair-building','build-wall','build-gate','toggle-gate','build-tower','upgrade-tower','upgrade-base','train-worker','train-soldier','train-archer','train-catapult','train-specialist','train-air','train-transport','train-ship','build-barracks','build-farm','build-forge','build-harbor','research-attack','research-defense','attack-move','unit-ability','unload-transport','stop-units','dismiss-units'] as const;
type ActionId=typeof actionIds[number];
export const actionGroups=['Orders','Build','Train','Research','Spells'] as const;
export function actionGroup(id:ActionId):typeof actionGroups[number]{return id.startsWith('cast-')?'Spells':id.startsWith('build-')?'Build':id.startsWith('train-')?'Train':id.startsWith('research-')||id.startsWith('upgrade-')?'Research':'Orders';}
export function actionTooltip(id:ActionId,action:ActionPresentation,label:string):string{
 const shortcut=hotkeys.find(h=>h.button===id);
 return [label,shortcut?.label,action.cost?`Cost: ${action.cost}`:null,shortcut?`Key: ${shortcut.key}`:null,action.reason?`Unavailable: ${action.reason}`:null].filter(Boolean).join(' · ');
}
export interface ActionPresentation {visible:boolean;reason:string;cost?:string}
export function affordabilityReason(balance:{wood:number;goldBalance?:number},cost:ResourceCost):string {
 const wood=balance.wood<cost.wood,gold=(balance.goldBalance??0)<cost.gold;return wood&&gold?uiText.notEnoughWoodAndGold:wood?uiText.notEnoughWood:gold?uiText.notEnoughGold:'';
}
export function actionPanel(m:MatchState,building:BuildingSelection,playing:boolean):Record<ActionId,ActionPresentation>{
 const land=m.gathering.units.filter(u=>u.selected),ships=m.navy?.ships.filter(u=>u.selected)??[],worker=land.some(u=>u.kind==='worker'),combat=land.some(u=>u.kind==='soldier'),transport=ships.find(u=>u.role==='transport'),any=land.length+ships.length>0,base=building==='base',barracks=building==='barracks',harbor=building==='harbor';
 const faction=factionForTeam(m,'player'),population=matchPopulation(m);
 const result={} as Record<ActionId,ActionPresentation>;
 for(const id of actionIds){let visible=false,reason='',cost;
  if(id.startsWith('cast-')){const spell=spellForSlot(faction.id,id.slice(5) as SpellSlot),caster=spell?selectedSpellCaster(m,spell):undefined;visible=!!caster;if(spell){const cfg=spellDefinition(spell,faction.id);cost=`${cfg.manaCost} mana · Range ${cfg.range}px · Cooldown ${cfg.cooldown}s · ${spellDescription(spell,faction.id)}`;reason=caster?spellCasterReason(m,caster.id,spell)??'':'Select a specialist';}}
  else if(id==='repair-building'){visible=worker;cost='0.5 wood + 0.1 gold per restored HP';reason=m.gathering.wood<=0||(m.gathering.goldBalance??0)<=0?'Not enough wood or gold':'';}
  else if(id==='toggle-gate'){visible=!!building?.startsWith('gate-');reason=gateToggleReason(m,building??'')??'';}
  else if(id==='build-wall'||id==='build-gate'){visible=worker;cost=costLabel(defenseConfig[id==='build-wall'?'wall':'gate'].cost);reason=m.placement.active?'Finish or cancel placement':affordabilityReason(m.gathering,defenseConfig[id==='build-wall'?'wall':'gate'].cost);}
  else if(id==='upgrade-tower'){visible=!!building?.startsWith('tower-');cost=costLabel(defenseConfig.upgrade.cost);reason=towerUpgradeReason(m,building??'')??'';}
  else if(id==='build-tower'){visible=worker;cost=costLabel(defenseConfig.tower.cost);reason=m.placement.active?'Finish or cancel placement':affordabilityReason(m.gathering,defenseConfig.tower.cost);}
  else if(id==='upgrade-base'){visible=base;const b=baseDevelopment(m);cost=b.level<3?costLabel(baseUpgradeConfig[(b.level+1) as 2|3].cost):undefined;reason=baseUpgradeReason(m)??'';}
  else if(id.startsWith('build-')){visible=worker;const kind=id.slice(6) as 'barracks'|'farm'|'forge'|'harbor';const recipe=kind==='harbor'?faction.naval.harbor.cost:faction.buildings[kind].cost;cost=costLabel(recipe);reason=buildingAvailability(faction,kind,technologyFor(m,'player'))??(m.placement.active?'Finish or cancel placement':kind==='barracks'&&m.placement.barracks||kind==='forge'&&m.placement.forge||kind==='harbor'&&m.navy?.harbor?'Already built':kind==='farm'&&(m.placement.farms?.length??0)>=farmConfig.maxCount?'Farm limit reached':affordabilityReason(m.gathering,recipe));}
  else if(id.startsWith('train-')){
   const role=id==='train-ship'?'warship':id.slice(6) as 'worker'|'soldier'|'archer'|'catapult'|'specialist'|'air'|'transport',naval=role==='transport'||role==='warship';
   visible=(role==='worker'?base:naval?harbor:barracks)&&(naval||faction.roster.includes(role as 'worker'|'soldier'|'archer'|'catapult'|'specialist'|'air'));
   const recipe=naval?faction.naval.units[role as 'transport'|'warship']:faction.units[role];cost=costLabel(recipe.cost);
   const production=role==='worker'?m.production:naval?m.navy?.production:m.soldierProduction;
   const remaining=role==='worker'?0:naval?m.navy?.harbor?.construction.remainingSeconds??1:m.placement.construction?.remainingSeconds??0;
   const prerequisite=naval?null:unitAvailability(faction,role,technologyFor(m,'player'));
   reason=remaining>0?'Construction unfinished':prerequisite??(production&&productionJobCount(production)>=queueConfig.maxJobs?'Queue full':!hasPopulation(population,recipe.supply)?uiText.populationLimitReached:affordabilityReason(m.gathering,recipe.cost));
  }
  else if(id.startsWith('research-')){visible=base||building==='forge';const kind=id==='research-attack'?'attack':'defense';cost=costLabel(faction.upgrades[kind].cost);reason=researchAvailability(faction,kind,technologyFor(m,'player'))??(m.research?.job?'Research in progress':(m.research?.[kind]??0)>=faction.upgrades[kind].maxLevel?'Already researched':affordabilityReason(m.gathering,faction.upgrades[kind].cost));}
  else if(id==='attack-move')visible=combat;
  else if(id==='unit-ability'){visible=land.some(u=>u.kind==='soldier'&&!isAir(u));reason=!land.some(abilityReady)?'Ability cooling down':'';}
  else if(id==='unload-transport'){visible=!!transport;reason=!transport?.passengers?.length?'Transport is empty':'';}
  else visible=any;
  result[id]={visible,reason:visible&&!playing?'Match is paused or ended':reason,cost};
 }
 return result;
}
/** Reparent existing controls once; callbacks and shutdown ownership remain in BootScene. */
export function bindActionPanel():void{
 const fieldset=document.getElementById('gameplay-controls')!,bar=document.getElementById('bottom-bar')!;document.getElementById('action-panel')!.append(fieldset);
 const actions=document.createElement('section');actions.id='context-actions';actions.setAttribute('aria-label','Build, train and research');fieldset.append(actions);
 document.getElementById('selection-info')!.prepend(document.getElementById('selection-portrait')!);
 bar.append(document.getElementById('minimap-overlay')!);
 for(const group of actionGroups){const section=document.createElement('section'),heading=document.createElement('h3');section.dataset.actionGroup=group;section.setAttribute('aria-label',group);heading.textContent=group;section.append(heading);(group==='Orders'?fieldset:actions).append(section);}
 for(const id of actionIds){const button=document.getElementById(id)!;let wrapper=button.parentElement!;if(!wrapper.classList.contains('control')){wrapper=document.createElement('div');wrapper.className='control';button.before(wrapper);wrapper.append(button);}const reason=document.createElement('span');reason.id=`${id}-reason`;reason.className='action-reason';button.setAttribute('aria-describedby',reason.id);wrapper.append(reason);fieldset.querySelector(`[data-action-group="${actionGroup(id)}"]`)!.append(wrapper);}
 bar.append(document.getElementById('production-queue')!);
}
/** Called after authoritative gameplay disabled-state sync. */
export function renderActionPanel(model:ReturnType<typeof actionPanel>):void{
 for(const id of actionIds){const button=document.getElementById(id) as HTMLButtonElement,action=model[id],wrapper=button.parentElement!,reason=document.getElementById(`${id}-reason`)!;wrapper.hidden=!action.visible;button.disabled=button.disabled||!action.visible||!!action.reason;reason.textContent=button.disabled?(action.reason||'Action unavailable'):'';
  const hotkey=hotkeys.find(h=>h.button===id)?.key;button.title=actionTooltip(id,{...action,reason:reason.textContent},button.textContent??'');button.setAttribute('aria-label',button.title);if(hotkey){button.dataset.hotkey=hotkey;if(!button.textContent!.includes(`[${hotkey}]`))button.textContent+=` [${hotkey}]`;}
 }
 for(const group of actionGroups)(document.querySelector(`[data-action-group="${group}"]`) as HTMLElement).hidden=!actionIds.some(id=>actionGroup(id)===group&&model[id].visible);
 document.getElementById('context-actions')!.classList.toggle('spell-context',actionIds.some(id=>id.startsWith('cast-')&&model[id].visible));
 const productionSelected=actionIds.some(id=>id.startsWith('train-')&&model[id].visible);document.getElementById('production-queue')!.hidden=!productionSelected;
 document.getElementById('action-hint')!.textContent=model['train-transport'].visible?'Ships spawn at a free harbor exit. Select a ship to command it.':productionSelected?'Right-click the world to set a production rally point.':Object.values(model).some(x=>x.visible)?'Right-click: move, gather (workers), attack (combat). Escape: cancel placement.':'Select a unit or production building for actions.';
}
