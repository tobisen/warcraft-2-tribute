import {panSpeeds,cameraPanConfig} from '../config/camera';
export {panSpeeds};
export interface CameraPreferences {speed:number;edgePan:boolean}
export const defaultCameraPreferences:Readonly<CameraPreferences>={speed:cameraPanConfig.speed,edgePan:true};
export function validateCameraPreferences(value:unknown):CameraPreferences {
 const v=value&&typeof value==='object'?value as Partial<CameraPreferences>:{};
 return {speed:panSpeeds.includes(v.speed as typeof panSpeeds[number])?v.speed!:defaultCameraPreferences.speed,edgePan:typeof v.edgePan==='boolean'?v.edgePan:defaultCameraPreferences.edgePan};
}
let preferences={...defaultCameraPreferences};
export const getCameraPreferences=():CameraPreferences=>({...preferences});
export function bindCameraSettings():void{
 const speed=document.getElementById('camera-speed') as HTMLSelectElement,edge=document.getElementById('camera-edge') as HTMLInputElement;speed.value=String(preferences.speed);edge.checked=preferences.edgePan;
 const change=()=>{preferences=validateCameraPreferences({speed:Number(speed.value),edgePan:edge.checked});speed.value=String(preferences.speed);edge.checked=preferences.edgePan;};speed.addEventListener('change',change);edge.addEventListener('change',change);
}
