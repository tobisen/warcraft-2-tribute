import {text as uiText} from '../text';
import { gameplayKeyAllowed,type KeyContext } from './keyboard';
export const hotkeys=[
 {key:'F6',button:'hold-position',label:'Hold position: attack visible targets in range without pursuing. Normal orders replace the queue; Shift adds move, attack, attack-move, gather, hold or patrol (max 32). Hold and patrol continue until replaced or stopped.'},
 {key:'F7',button:'patrol-units',label:'Patrol between your current position and the clicked point; combat units attack-move and resume after target loss. Shift appends.'},
 {key:'F5',button:'train-air',label:'Train the faction flyer at a completed barracks; Forge and both research upgrades required.'},
 {key:'F2',button:'cast-heal',label:'Healing spell (faction loadout): choose a visible damaged allied ground combat unit in spell range. Escape or right-click cancels without cost.'},
 {key:'F3',button:'cast-ward',label:'Buff spell (faction loadout): choose a visible allied ground combat unit in spell range. Escape or right-click cancels without cost.'},
 {key:'F4',button:'cast-hex',label:'Debuff spell (faction loadout): choose a visible hostile ground combat unit in spell range. Escape or right-click cancels without cost.'},
 {key:'Z',button:'repair-building',label:'Select workers, then choose an own damaged building to repair. Costs 0.5 wood + 0.1 gold per restored HP, 4 HP/s per worker, at most three active workers per building.'},
 {key:'M',button:'build-wall',label:'Build a wall with a selected worker. Placement preserves mandatory routes and exits.'},
 {key:'Q',button:'build-gate',label:'Build a gate with a selected worker. It starts closed.'},
 {key:'X',button:'toggle-gate',label:'Open or close the selected gate. Only your team may use an open gate; closing over units or required routes is blocked.'},
 {key:'O',button:'build-tower',label:'Build a defense tower with a selected worker at a visible legal site.'},
 {key:'N',button:'upgrade-tower',label:'Upgrade the selected tower after completing base level 2 and a Forge.'},
 {key:'I',button:'upgrade-base',label:'Upgrade the selected base. Its worker queue pauses and resumes with its remaining time intact.'},
 {key:'H',button:'build-harbor',label:'Build a harbor with a selected worker at a visible, valid coastal site. Pay the displayed cost at placement.'},
 {key:'J',button:'train-transport',label:'Train a transport at the selected completed harbor. Requires resources, supply and a free queue slot.'},
 {key:'K',button:'train-ship',label:'Train a warship at the selected completed harbor. Requires resources, supply and a free queue slot.'},
 {key:'L',button:'unload-transport',label:'Unload the selected transport. Click a visible free landing within 64 world pixels; all passengers must fit.'},
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
