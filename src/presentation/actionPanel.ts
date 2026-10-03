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
export const actionIds=['train-worker','train-soldier','train-archer','train-catapult','train-transport','train-ship','build-barracks','build-farm','build-forge','build-harbor','research-attack','research-defense','attack-move','unit-ability','unload-transport','stop-units'] as const;
type ActionId=typeof actionIds[number];
export interface ActionPresentation {visible:boolean;reason:string;cost?:string}
export function affordabilityReason(balance:{wood:number;goldBalance?:number},cost:ResourceCost):string {
 const wood=balance.wood<cost.wood,gold=(balance.goldBalance??0)<cost.gold;return wood&&gold?uiText.notEnoughWoodAndGold:wood?uiText.notEnoughWood:gold?uiText.notEnoughGold:'';
}
export function actionPanel(m:MatchState,building:BuildingSelection,playing:boolean):Record<ActionId,ActionPresentation>{
 const land=m.gathering.units.filter(u=>u.selected),ships=m.navy?.ships.filter(u=>u.selected)??[],worker=land.some(u=>u.kind==='worker'),combat=land.some(u=>u.kind==='soldier'),transport=ships.find(u=>u.role==='transport'),any=land.length+ships.length>0,base=building==='base',barracks=building==='barracks',harbor=building==='harbor';
 const faction=factionForTeam(m,'player'),population=matchPopulation(m);
 const result={} as Record<ActionId,ActionPresentation>;
 for(const id of actionIds){let visible=false,reason='',cost;
  if(id.startsWith('build-')){visible=worker;const kind=id.slice(6) as 'barracks'|'farm'|'forge'|'harbor';const recipe=kind==='harbor'?navyConfig.harbor.cost:costs[kind];cost=costLabel(recipe);reason=m.placement.active?'Finish or cancel placement':kind==='barracks'&&m.placement.barracks||kind==='forge'&&m.placement.forge||kind==='harbor'&&m.navy?.harbor?'Already built':kind==='farm'&&(m.placement.farms?.length??0)>=farmConfig.maxCount?'Farm limit reached':affordabilityReason(m.gathering,recipe);}
  else if(id.startsWith('train-')){const role=id==='train-ship'?'warship':id.slice(6) as 'worker'|'soldier'|'archer'|'catapult'|'transport',naval=role==='transport'||role==='warship';visible=role==='worker'?base:naval?harbor:barracks;const recipe=naval?role==='transport'?navyConfig.transport:navyConfig.ship:faction.units[role];cost=costLabel(recipe.cost);const production=role==='worker'?m.production:naval?m.navy?.production:m.soldierProduction;const remaining=role==='worker'?0:naval?m.navy?.harbor?.construction.remainingSeconds??1:m.placement.construction?.remainingSeconds??0;reason=remaining>0?'Construction unfinished':production&&productionJobCount(production)>=queueConfig.maxJobs?'Queue full':!hasPopulation(population,recipe.supply)?uiText.populationLimitReached:affordabilityReason(m.gathering,recipe.cost);}
  else if(id.startsWith('research-')){visible=base;const kind=id==='research-attack'?'attack':'defense';cost=costLabel(upgradeConfig.cost);reason=!forgeReady(m.placement)?'Build and complete a forge':m.research?.job?'Research in progress':(m.research?.[kind]??0)>=upgradeConfig.maxLevel?'Already researched':affordabilityReason(m.gathering,upgradeConfig.cost);}
  else if(id==='attack-move')visible=combat;
  else if(id==='unit-ability'){visible=combat;reason=!land.some(abilityReady)?'Ability cooling down':'';}
  else if(id==='unload-transport'){visible=!!transport;reason=!transport?.passengers?.length?'Transport is empty':'';}
  else visible=any;
  result[id]={visible,reason:visible&&!playing?'Match is paused or ended':reason,cost};
 }
 return result;
}
/** Reparent existing controls once; callbacks and shutdown ownership remain in BootScene. */
export function bindActionPanel():void{
 const fieldset=document.getElementById('gameplay-controls')!;document.getElementById('action-panel')!.append(fieldset);
 for(const id of actionIds){const button=document.getElementById(id)!;let wrapper=button.parentElement!;if(!wrapper.classList.contains('control')){wrapper=document.createElement('div');wrapper.className='control';button.before(wrapper);wrapper.append(button);}const reason=document.createElement('span');reason.id=`${id}-reason`;reason.className='action-reason';button.setAttribute('aria-describedby',reason.id);wrapper.append(reason);}
}
/** Called after authoritative gameplay disabled-state sync. */
export function renderActionPanel(model:ReturnType<typeof actionPanel>):void{
 for(const id of actionIds){const button=document.getElementById(id) as HTMLButtonElement,action=model[id],wrapper=button.parentElement!,reason=document.getElementById(`${id}-reason`)!;wrapper.hidden=!action.visible;button.disabled=button.disabled||!action.visible||!!action.reason;reason.textContent=button.disabled?(action.reason||'Action unavailable'):'';
  const hotkey=hotkeys.find(h=>h.button===id)?.key;button.title=[action.cost,hotkey?`[${hotkey}]`:null,reason.textContent].filter(Boolean).join(' · ');if(hotkey&&!button.textContent!.includes(`[${hotkey}]`))button.textContent+=` [${hotkey}]`;
 }
 const productionSelected=actionIds.some(id=>id.startsWith('train-')&&model[id].visible);document.getElementById('production-queue')!.hidden=!productionSelected;
 document.getElementById('action-hint')!.textContent=model['train-transport'].visible?'Ships spawn at a free harbor exit. Select a ship to command it.':productionSelected?'Right-click the world to set a production rally point.':Object.values(model).some(x=>x.visible)?'Right-click: move, gather (workers), attack (combat). Escape: cancel placement.':'Select a unit or production building for actions.';
}
