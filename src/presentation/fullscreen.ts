import {text as uiText} from '../text';
interface FullscreenHost {active:()=>boolean;enter:()=>Promise<void>;exit:()=>Promise<void>}
export async function toggleFullscreen(host:FullscreenHost):Promise<{ok:boolean;error?:string}>{try{await (host.active()?host.exit():host.enter());return {ok:true};}catch{return {ok:false,error:uiText.fullscreenError};}}
export function bindFullscreen():void{
 const buttons=['fullscreen-button','fullscreen-settings-button'].map(id=>document.getElementById(id) as HTMLButtonElement),status=document.getElementById('fullscreen-status')!,notice=document.getElementById('fullscreen-notice')!,supported=typeof document.documentElement.requestFullscreen==='function'&&typeof document.exitFullscreen==='function';
 const sync=()=>{for(const b of buttons){b.disabled=!supported;b.textContent=document.fullscreenElement?uiText.exitFullscreen:uiText.fullscreen;b.setAttribute('aria-pressed',String(!!document.fullscreenElement));}if(!supported){status.textContent=uiText.fullscreenUnavailable;notice.hidden=false;notice.textContent=uiText.fullscreenUnavailableShort;}};
 const toggle=async()=>{if(!supported)return;const result=await toggleFullscreen({active:()=>!!document.fullscreenElement,enter:()=>document.documentElement.requestFullscreen(),exit:()=>document.exitFullscreen()});status.textContent=result.ok?'':result.error!;notice.hidden=result.ok;notice.textContent=result.ok?'':uiText.fullscreenFailedShort;sync();};
 for(const b of buttons)b.addEventListener('click',toggle);document.addEventListener('fullscreenchange',sync);sync();
}
