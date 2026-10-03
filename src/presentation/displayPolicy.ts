export const resolutions={ '800x600':{width:800,height:600},'1024x768':{width:1024,height:768},'1280x720':{width:1280,height:720},'1600x900':{width:1600,height:900},'1920x1080':{width:1920,height:1080},'2048x1332':{width:2048,height:1332} } as const;
export type Resolution=keyof typeof resolutions;
export interface DisplaySettings {resolution:Resolution;adaptToWindow:boolean}
export const defaultDisplaySettings:DisplaySettings={resolution:'1280x720',adaptToWindow:true};
export function validateDisplaySettings(value:unknown):DisplaySettings {
 const v=value&&typeof value==='object'?value as Record<string,unknown>:{};
 return {resolution:typeof v.resolution==='string'&&Object.hasOwn(resolutions,v.resolution)?v.resolution as Resolution:defaultDisplaySettings.resolution,adaptToWindow:typeof v.adaptToWindow==='boolean'?v.adaptToWindow:defaultDisplaySettings.adaptToWindow};
}
export function displayGeometry(settings:DisplaySettings,windowSize:{width:number;height:number}) {
 const available={width:Math.max(1,windowSize.width),height:Math.max(1,windowSize.height)};
 const viewport=settings.adaptToWindow?{width:Math.max(800,Math.floor(available.width)),height:Math.max(600,Math.floor(available.height))}:resolutions[settings.resolution];
 const scale=Math.min(1,available.width/viewport.width,available.height/viewport.height);
 return {...viewport,scale,left:(available.width-viewport.width*scale)/2,top:(available.height-viewport.height*scale)/2};
}
/** Shared physical-client to logical-canvas mapping for camera and minimap. */
export function clientPoint(point:{x:number;y:number},box:{left:number;top:number;width:number;height:number},logical:{width:number;height:number}) {
 return {x:(point.x-box.left)*logical.width/Math.max(1,box.width),y:(point.y-box.top)*logical.height/Math.max(1,box.height)};
}
