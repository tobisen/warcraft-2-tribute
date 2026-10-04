import {text as uiText} from '../text';
import { gameplayKeyAllowed,type KeyContext } from './keyboard';
export const hotkeys=[
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
