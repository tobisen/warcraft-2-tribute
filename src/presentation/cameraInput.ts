import {clientPoint} from './displayPolicy';
import {getCameraPreferences} from './cameraSettings';
import {cameraPanConfig} from '../config/camera';
import {cameraDirection,panCamera,zoomCamera} from './camera';
import {gameplayKeyAllowed,keyboardContext} from './keyboard';
import type {Position} from '../gameplay/movement';
interface View {zoom:number;scroll:Position;world:{width:number;height:number};camera:{x:number;y:number;width:number;height:number}}
/** App DOM handles intent; the scene supplies only phase, camera geometry and scroll adapter. */
export function bindCameraInput(canvas:HTMLCanvasElement,getView:()=>View,canPan:()=>boolean,setScroll:(p:Position)=>void,setZoom:(zoom:number,p:Position,anchor:Position)=>void){
 const keys=new Set<string>();let pointer:Position|null=null,overUI=false;
 const keydown=(e:KeyboardEvent)=>{if(!e.key.startsWith('Arrow')||e.ctrlKey||e.metaKey||!gameplayKeyAllowed(keyboardContext(e,canPan())))return;e.preventDefault();keys.add(e.key);};
 const keyup=(e:KeyboardEvent)=>keys.delete(e.key);
 const move=(e:PointerEvent)=>{overUI=e.target!==canvas;pointer=overUI?null:{x:e.clientX,y:e.clientY};};
 const reset=()=>{keys.clear();pointer=null;overUI=false;};
 const focus=(e:FocusEvent)=>{if(e.target!==canvas)keys.clear();};
 const wheel=(e:WheelEvent)=>{
  if(!canPan()||e.ctrlKey||e.metaKey||!Number.isFinite(e.deltaY)||e.deltaY===0)return;
  const view=getView(),box=canvas.getBoundingClientRect(),logical=clientPoint({x:e.clientX,y:e.clientY},box,{width:canvas.width,height:canvas.height}),point={x:logical.x-view.camera.x,y:logical.y-view.camera.y};
  if(point.x<0||point.y<0||point.x>=view.camera.width||point.y>=view.camera.height)return;
  e.preventDefault();const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?view.camera.height:1),next=zoomCamera(view.scroll,point,view.world,view.camera,view.zoom,delta);setZoom(next.zoom,next.scroll,{x:next.scroll.x+point.x/next.zoom,y:next.scroll.y+point.y/next.zoom});
 };
 canvas.addEventListener('wheel',wheel,{passive:false});
 window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('pointermove',move);window.addEventListener('blur',reset);window.addEventListener('focusin',focus);document.addEventListener('pointerleave',reset);
 return {update:(seconds:number)=>{const active=document.activeElement;if(!canPan()||!document.hasFocus()||overUI||active&&active!==canvas&&active!==document.body){keys.clear();return;}const settings=getCameraPreferences(),view=getView(),box=canvas.getBoundingClientRect(),logical=pointer?clientPoint(pointer,box,{width:canvas.width,height:canvas.height}):null,point=logical?{x:logical.x-view.camera.x,y:logical.y-view.camera.y}:null,direction=cameraDirection([...keys],settings.edgePan?point:null,view.camera,cameraPanConfig.edgePixels);const next=panCamera(view.scroll,direction,view.world,{width:view.camera.width/view.zoom,height:view.camera.height/view.zoom},Math.min(cameraPanConfig.maxDeltaSeconds,Math.max(0,seconds)),settings.speed);if(next.x!==view.scroll.x||next.y!==view.scroll.y)setScroll(next);},destroy:()=>{canvas.removeEventListener('wheel',wheel);window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup);window.removeEventListener('pointermove',move);window.removeEventListener('blur',reset);window.removeEventListener('focusin',focus);document.removeEventListener('pointerleave',reset);reset();}};
}
