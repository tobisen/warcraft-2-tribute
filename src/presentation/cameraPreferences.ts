import {panSpeeds,cameraPanConfig} from '../config/camera';
export {panSpeeds};
export interface CameraPreferences {speed:number;edgePan:boolean}
export const defaultCameraPreferences:Readonly<CameraPreferences>={speed:cameraPanConfig.speed,edgePan:true};
export function validateCameraPreferences(value:unknown):CameraPreferences {
 const v=value&&typeof value==='object'?value as Partial<CameraPreferences>:{};
 return {speed:panSpeeds.includes(v.speed as typeof panSpeeds[number])?v.speed!:defaultCameraPreferences.speed,edgePan:typeof v.edgePan==='boolean'?v.edgePan:defaultCameraPreferences.edgePan};
}
