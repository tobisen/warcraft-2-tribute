import {gameplayKeyAllowed,keyboardContext} from './keyboard';
export function bindCheatInput(active:()=>boolean,apply:(code:string)=>boolean):()=>void {
 const dialog=document.querySelector<HTMLDialogElement>('#cheat-dialog')!,input=document.querySelector<HTMLInputElement>('#cheat-code')!,form=document.querySelector<HTMLFormElement>('#cheat-form')!,cancel=document.querySelector<HTMLButtonElement>('#cheat-cancel')!,result=document.getElementById('cheat-result')!;
 const close=()=>{dialog.close();document.querySelector<HTMLCanvasElement>('#game canvas')?.focus();};
 const submit=(event:Event)=>{event.preventDefault();if(active()&&apply(input.value))close();else result.textContent=active()?'Unknown cheat code.':'Cheats require an active match.';};
 const key=(event:KeyboardEvent)=>{
  if(dialog.open){event.stopImmediatePropagation();if(event.key==='Escape'){event.preventDefault();close();}else if(event.key==='Enter'){event.preventDefault();if(!event.repeat){if(event.target===cancel)close();else submit(event);}}return;}
  if(event.key!=='Enter'||event.ctrlKey||event.metaKey||!gameplayKeyAllowed(keyboardContext(event,active()))||document.querySelector('dialog[open]'))return;
  event.preventDefault();event.stopImmediatePropagation();input.value='';result.textContent='';dialog.showModal();input.focus();
 };
 window.addEventListener('keydown',key,true);form.addEventListener('submit',submit);cancel.addEventListener('click',close);
 return ()=>{window.removeEventListener('keydown',key,true);form.removeEventListener('submit',submit);cancel.removeEventListener('click',close);if(dialog.open)dialog.close();};
}
