import {hotkeys} from './hotkeys';
/** Keep the pressed button's text node alive across HUD frames, including countdown changes. */
export function setActionLabel(button:HTMLButtonElement,label:string):void {
 const key=hotkeys.find(h=>h.button===button.id)?.key;
 const plain=label.replace(/\s+\[[A-Z0-9]+\]$/,'');
 button.dataset.shortLabel=plain.replace(/^(Build|Train|Research)\s+/,'').replace(/\s*[:(–].*$/,'');
 const text=key?`${plain} [${key}]`:plain;
 const node=Array.from(button.childNodes).find(n=>n.nodeType===3);
 if(node){if(node.textContent!==text)node.textContent=text;}
 else button.appendChild(button.ownerDocument.createTextNode(text));
}
