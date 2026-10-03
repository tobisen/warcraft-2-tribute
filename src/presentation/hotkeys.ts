import {text as uiText} from '../text';
import { gameplayKeyAllowed,type KeyContext } from './keyboard';
export const hotkeys=[
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
