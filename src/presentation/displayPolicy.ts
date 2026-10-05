export const resolutions={ '800x600':{width:800,height:600},'1024x768':{width:1024,height:768},'1280x720':{width:1280,height:720},'1600x900':{width:1600,height:900},'1920x1080':{width:1920,height:1080},'2048x1332':{width:2048,height:1332} } as const;
export type Resolution=keyof typeof resolutions;
export type DisplayMode='native'|'fit';
export interface DisplaySettings {resolution:Resolution;mode:DisplayMode}
export const defaultDisplaySettings:DisplaySettings={resolution:'1920x1080',mode:'fit'};
export function validateDisplaySettings(value:unknown):DisplaySettings {
 const v=value&&typeof value==='object'?value as Record<string,unknown>:{};
 const mode=v.mode==='native'||v.mode==='fit'?v.mode:typeof v.adaptToWindow==='boolean'?v.adaptToWindow?'fit':'native':defaultDisplaySettings.mode;
 return {resolution:typeof v.resolution==='string'&&Object.hasOwn(resolutions,v.resolution)?v.resolution as Resolution:defaultDisplaySettings.resolution,mode};
}
/** Rendering dimensions stay fixed. Only CSS presentation scales, including fullscreen. */
export function displayGeometry(settings:DisplaySettings,windowSize:{width:number;height:number}) {
 const available={width:Math.max(1,windowSize.width),height:Math.max(1,windowSize.height)};
 const viewport=resolutions[settings.resolution];
 const fit=Math.min(available.width/viewport.width,available.height/viewport.height);
 const scale=settings.mode==='fit'?fit:Math.min(1,fit);
 return {...viewport,scale,left:(available.width-viewport.width*scale)/2,top:(available.height-viewport.height*scale)/2};
}
/** Shared physical-client to logical-canvas mapping for camera and minimap. */
export function clientPoint(point:{x:number;y:number},box:{left:number;top:number;width:number;height:number},logical:{width:number;height:number}) {
 return {x:(point.x-box.left)*logical.width/Math.max(1,box.width),y:(point.y-box.top)*logical.height/Math.max(1,box.height)};
}
