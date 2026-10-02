export interface KeyContext {playing:boolean;repeat:boolean;focusedTag?:string;contentEditable?:boolean;altKey?:boolean;paused?:boolean}
export function gameplayKeyAllowed(context:KeyContext):boolean {
 return context.playing&&!context.paused&&!context.repeat&&!context.altKey&&!context.contentEditable&&!['INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(context.focusedTag?.toUpperCase()??'');
}
export function keyboardContext(event:KeyboardEvent,playing:boolean):KeyContext {
 const target=event.target instanceof HTMLElement?event.target:null;
 return {playing,repeat:event.repeat,altKey:event.altKey,focusedTag:target?.tagName,contentEditable:!!target?.closest('[contenteditable="true"]')};
}
