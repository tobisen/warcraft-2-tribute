import {text as uiText} from '../text';
import { gameplayKeyAllowed,type KeyContext } from './keyboard';
export const hotkeys=[
 {key:'F15',button:'research-cavalryArmor',label:'Cavalry Armor:20% less incoming damage for your existing and future cavalry,45 wood/30 gold/12s,Forge+Stable.'},
 {key:'F16',button:'research-healerTraining',label:'Healer Training:+50 maximum mana only,45 wood/30 gold/12s,Forge+Academy.'},
 {key:'F17',button:'research-scoutOptics',label:'Scout Optics:128px submarine detection in current team vision,45 wood/30 gold/12s,Forge+flight building.'},
 {key:'F14',button:'upgrade-tower-air',label:'Permanently specialize this tower as Anti-Air: air-only,256px range; base II,Forge,attack I. Inactive for10s.'},
 {key:'F18',button:'build-siegeWorks',label:'Build the dedicated siege workshop after Forge and base II.'},
 {key:'F19',button:'train-ballista',label:'Train a direct-shot ballista at the siege workshop; double building damage.'},
 {key:'F13',button:'build-aviary',label:'Build a dedicated flight producer after base II; 80 wood, 40 gold, 12 seconds.'},
 {key:'END',button:'train-scout',label:'Train an unarmed flyer at the flight building after base II.'},
 {key:'PAGEUP',button:'scout-route',label:'Add multiple waypoints, click this action again to start repeating Scout Route.'},
 {key:'PAGEDOWN',button:'auto-scout',label:'Explore using your own explored map; manual orders cancel.'},
 {key:'INSERT',button:'train-giant',label:'Train a slow heavy building-smashing giant at Academy after base III and research II.'},
 {key:'F11',button:'train-healer',label:'Train healing support in Academy.'},
 {key:'F12',button:'autocast-heal',label:'Toggle healer autocast: visible damaged biological allies only.'},
 {key:'X',button:'build-stable',label:'Build the faction stable after main building level II.'},
 {key:'F10',button:'train-cavalry',label:'Train mounted cavalry at a completed stable; infantry counters cavalry.'},
 {key:'F9',button:'research-workerTools',label:'Research Worker Tools I–III at a completed main building. Wood/gold gathering takes 10/20/30% less time; each level replaces the previous bonus. Capacity remains 5.'},
 {key:'F8',button:'build-academy',label:'Build a military academy after completing a forge and attack/defense I. Unlocks paid attack/defense II.'},
 {key:'Y',button:'build-base',label:'Build an additional main base with a worker: 100 wood + 60 gold, 12 seconds. Separate worker queue and rally; shared resources, supply and technology.'},
 {key:'F6',button:'hold-position',label:'Hold position: attack visible targets in range without pursuing. Normal orders replace the queue; Shift adds move, attack, attack-move, gather, hold or patrol (max 32). Hold and patrol continue until replaced or stopped.'},
 {key:'F7',button:'patrol-units',label:'Patrol between your current position and the clicked point; combat units attack-move and resume after target loss. Shift appends.'},
 {key:'F5',button:'train-air',label:'Train the faction flyer at a completed flight building; Base III,Academy and both research II required; 95 wood,75 gold,30 seconds,4 supply.'},
 {key:'F2',button:'cast-heal',label:'Healing spell (faction loadout): choose a visible damaged allied ground combat unit in spell range. Escape or right-click cancels without cost.'},
 {key:'F3',button:'cast-ward',label:'Buff spell (faction loadout): choose a visible allied ground combat unit in spell range. Escape or right-click cancels without cost.'},
 {key:'F4',button:'cast-hex',label:'Debuff spell (faction loadout): choose a visible hostile ground combat unit in spell range. Escape or right-click cancels without cost.'},
 {key:'Z',button:'repair-building',label:'Select workers, then choose an own damaged building to repair. Costs 0.5 wood + 0.1 gold per restored HP, 4 HP/s per worker, at most three active workers per building.'},
 {key:'M',button:'build-wall',label:'Build a wall with a selected worker. Placement preserves mandatory routes and exits.'},
 {key:'Q',button:'build-gate',label:'Build a gate with a selected worker. Completed gates automatically admit your troops and allies; enemies remain blocked.'},
 {key:'O',button:'build-tower',label:'Build a defense tower with a selected worker at a visible legal site.'},
 {key:'N',button:'upgrade-tower',label:'Permanently specialize this tower as Ground Defense: ground-only,24 damage; base II,Forge,attack I. Inactive for10s.'},
 {key:'I',button:'upgrade-base',label:'Upgrade the selected base. All main-building worker queues pause and resumes with its remaining time intact.'},
 {key:'H',button:'build-harbor',label:'Build a harbor with a selected worker at a visible, valid coastal site. Pay the displayed cost at placement.'},
 {key:'J',button:'train-transport',label:'Train a transport at the selected completed harbor. Requires resources, supply and a free queue slot.'},
 {key:'K',button:'train-ship',label:'Train a warship at the selected completed harbor. Requires resources, supply and a free queue slot.'},
 {key:'L',button:'unload-transport',label:'Unload at the nearest visible reachable coast within 256px. All passengers must fit; choose land manually if no coast is found.'},
 {key:'V',button:'train-specialist',label:'Train the faction specialist at selected barracks. Requires its forge/research prerequisites, resources, supply and queue capacity.'},
 {key:'DELETE',button:'dismiss-units',label:'Dismiss selected own units. Confirmation includes transport passengers; no refund or kill credit.'},
 {key:'E',button:'unit-ability',label:uiText.factionAbilitySelectedCombatUnitsThatAreReady},
 {key:'S',button:'stop-units',label:uiText.stopSelectedUnits},
 {key:'A',button:'attack-move',label:uiText.attackMoveSelectACombatUnitThenClick},
 {key:'B',button:'build-barracks',label:uiText.buildBarracksSelectAWorker},
 {key:'F',button:'build-farm',label:uiText.buildFarmSelectAWorker},
 {key:'G',button:'build-forge',label:uiText.buildForgeSelectAWorker},
 {key:'W',button:'train-worker',label:uiText.trainWorkerSelectTheBase},
 {key:'T',button:'train-soldier',label:uiText.trainSoldierSelectBarracks},
 {key:'R',button:'train-archer',label:uiText.trainArcherSelectBarracks},
 {key:'C',button:'train-catapult',label:uiText.trainCatapultSelectBarracks},
 {key:'U',button:'research-attack',label:uiText.attackResearchCompletedForge},
 {key:'D',button:'research-defense',label:uiText.defenseResearchCompletedForge},
] as const;
export function hotkeyButton(key:string,context:KeyContext&{ctrlKey?:boolean;metaKey?:boolean}):string|null {
 if(!gameplayKeyAllowed(context)||context.ctrlKey||context.metaKey)return null;
 return hotkeys.find(h=>h.key===key.toUpperCase())?.button??null;
}
export const commandGuide=[uiText.cameraControls,uiText.shiftClickToggleShiftDragAdd,uiText.ctrlCmd19AssignGroup19,uiText.pPauseResumeEscapeCancelPreviewOtherwisePause,...hotkeys.map(h=>`${h.key}: ${h.label}`),uiText.aDisabledButtonMeansTheActionIsUnavailable,uiText.clickTheWorldForKeyboardFocusUiFields].join('\n');
/** Same disabled button and same click handler: costs/order rules have one implementation. */
export function dispatchHotkey(key:string,context:KeyContext&{ctrlKey?:boolean;metaKey?:boolean},button:(id:string)=>{disabled:boolean;click:()=>void}|null):boolean {
 const id=hotkeyButton(key,context),control=id?button(id):null;if(!control||control.disabled)return false;control.click();return true;
}
