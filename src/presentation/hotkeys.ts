import { gameplayKeyAllowed,type KeyContext } from './keyboard';
export const hotkeys=[
 {key:'S',button:'stop-units',label:'Stop – valda units'},
 {key:'A',button:'attack-move',label:'Attack-move – välj combat-unit, klicka mål'},
 {key:'B',button:'build-barracks',label:'Bygg barracks – välj worker'},
 {key:'F',button:'build-farm',label:'Bygg farm – välj worker'},
 {key:'G',button:'build-forge',label:'Bygg Forge – välj worker'},
 {key:'W',button:'train-worker',label:'Träna worker – välj bas'},
 {key:'T',button:'train-soldier',label:'Träna soldier – välj barracks'},
 {key:'R',button:'train-archer',label:'Träna archer – välj barracks'},
 {key:'C',button:'train-catapult',label:'Träna catapult – välj barracks'},
 {key:'U',button:'research-attack',label:'Attack-research – färdig Forge'},
 {key:'D',button:'research-defense',label:'Defense-research – färdig Forge'},
] as const;
export function hotkeyButton(key:string,context:KeyContext&{ctrlKey?:boolean;metaKey?:boolean}):string|null {
 if(!gameplayKeyAllowed(context)||context.ctrlKey||context.metaKey)return null;
 return hotkeys.find(h=>h.key===key.toUpperCase())?.button??null;
}
export const commandGuide=['Shift-klick: toggle · Shift-drag: addera','Ctrl/Cmd+1–9: bind grupp · 1–9: återkalla','P: pausa/återuppta · Escape: avbryt preview, annars pausa/återuppta',...hotkeys.map(h=>`${h.key}: ${h.label}`),'Grå knapp = kommandot spärrat; se byggnadsval, saldo, population, kö och status.','Klicka spelcanvas för tangentfokus. UI/textfält, repeat, pause och game over spärrar gameplay-tangenter.'].join('\n');
/** Same disabled button and same click handler: costs/order rules have one implementation. */
export function dispatchHotkey(key:string,context:KeyContext&{ctrlKey?:boolean;metaKey?:boolean},button:(id:string)=>{disabled:boolean;click:()=>void}|null):boolean {
 const id=hotkeyButton(key,context),control=id?button(id):null;if(!control||control.disabled)return false;control.click();return true;
}
