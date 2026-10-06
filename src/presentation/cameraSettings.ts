import {getPreferences,updatePreferences} from './preferences';
export {panSpeeds,validateCameraPreferences,defaultCameraPreferences,type CameraPreferences} from './cameraPreferences';
export const getCameraPreferences=()=>getPreferences().camera;
export function bindCameraSettings():void{
 const speed=document.getElementById('camera-speed') as HTMLSelectElement,edge=document.getElementById('camera-edge') as HTMLInputElement,p=getCameraPreferences();speed.value=String(p.speed);edge.checked=false;edge.disabled=true;edge.closest('label')?.setAttribute('hidden','');
 const change=()=>{updatePreferences({camera:{speed:Number(speed.value),edgePan:edge.checked}});const next=getCameraPreferences();speed.value=String(next.speed);edge.checked=next.edgePan;};speed.addEventListener('change',change);edge.addEventListener('change',change);
}
