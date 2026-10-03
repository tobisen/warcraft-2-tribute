import {cameraPanConfig} from '../config/camera';
import {cameraDirection,panCamera} from './camera';
import {gameplayKeyAllowed,keyboardContext} from './keyboard';
import type {Position} from '../gameplay/movement';
interface View {scroll:Position;world:{width:number;height:number};camera:{x:number;y:number;width:number;height:number}}
/** App DOM handles intent; the scene supplies only phase, camera geometry and scroll adapter. */
export function bindCameraInput(canvas:HTMLCanvasElement,getView:()=>View,canPan:()=>boolean,setScroll:(p:Position)=>void){
 const keys=new Set<string>();let pointer:Position|null=null,overUI=false;
 const keydown=(e:KeyboardEvent)=>{if(!e.key.startsWith('Arrow')||e.ctrlKey||e.metaKey||!gameplayKeyAllowed(keyboardContext(e,canPan())))return;e.preventDefault();keys.add(e.key);};
 const keyup=(e:KeyboardEvent)=>keys.delete(e.key);
 const move=(e:PointerEvent)=>{overUI=e.target!==canvas;pointer=overUI?null:{x:e.clientX,y:e.clientY};};
 const reset=()=>{keys.clear();pointer=null;overUI=false;};
 const focus=(e:FocusEvent)=>{if(e.target!==canvas)keys.clear();};
 window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('pointermove',move);window.addEventListener('blur',reset);window.addEventListener('focusin',focus);document.addEventListener('pointerleave',reset);
 return {update:(seconds:number)=>{const active=document.activeElement;if(!canPan()||!document.hasFocus()||overUI||active&&active!==canvas&&active!==document.body){keys.clear();return;}const view=getView(),box=canvas.getBoundingClientRect(),point=pointer?{x:pointer.x-box.left-view.camera.x,y:pointer.y-box.top-view.camera.y}:null,direction=cameraDirection([...keys],point,view.camera,cameraPanConfig.edgePixels);const next=panCamera(view.scroll,direction,view.world,view.camera,Math.min(cameraPanConfig.maxDeltaSeconds,Math.max(0,seconds)),cameraPanConfig.speed);if(next.x!==view.scroll.x||next.y!==view.scroll.y)setScroll(next);},destroy:()=>{window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('pointermove',move);window.removeEventListener('blur',reset);window.removeEventListener('focusin',focus);document.removeEventListener('pointerleave',reset);reset();}};
}
