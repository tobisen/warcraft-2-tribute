export const resolutions={ '800x600':{width:800,height:600},'1024x768':{width:1024,height:768},'1280x720':{width:1280,height:720},'1600x900':{width:1600,height:900},'1920x1080':{width:1920,height:1080},'2048x1332':{width:2048,height:1332},'2560x1440':{width:2560,height:1440},'2560x1080':{width:2560,height:1080},'3440x1440':{width:3440,height:1440},'3840x1600':{width:3840,height:1600},'3840x2160':{width:3840,height:2160} } as const;
export type Resolution=keyof typeof resolutions|'window';
export type DisplayMode='native'|'fit';
export interface DisplaySettings {resolution:Resolution;mode:DisplayMode}
export const defaultDisplaySettings:DisplaySettings={resolution:'1920x1080',mode:'fit'};
export function validateDisplaySettings(value:unknown):DisplaySettings {
 const v=value&&typeof value==='object'?value as Record<string,unknown>:{};
 const mode=v.mode==='native'||v.mode==='fit'?v.mode:typeof v.adaptToWindow==='boolean'?v.adaptToWindow?'fit':'native':defaultDisplaySettings.mode;
 return {resolution:typeof v.resolution==='string'&&(v.resolution==='window'||Object.hasOwn(resolutions,v.resolution))?v.resolution as Resolution:defaultDisplaySettings.resolution,mode};
}
/** Presets stay fixed; window rendering is bounded to the supported minimum and 4K maximum. */
export function displayGeometry(settings:DisplaySettings,windowSize:{width:number;height:number}) {
 const available={width:Math.max(1,windowSize.width),height:Math.max(1,windowSize.height)};
 const viewport=settings.resolution==='window'?{width:Math.min(3840,Math.max(800,Math.floor(available.width))),height:Math.min(2160,Math.max(600,Math.floor(available.height)))}:resolutions[settings.resolution];
 const fit=Math.min(available.width/viewport.width,available.height/viewport.height);
 const scale=settings.mode==='fit'?fit:Math.min(1,fit);
 return {...viewport,scale,left:(available.width-viewport.width*scale)/2,top:(available.height-viewport.height*scale)/2};
}
/** Shared physical-client to logical-canvas mapping for camera and minimap. */
export function clientPoint(point:{x:number;y:number},box:{left:number;top:number;width:number;height:number},logical:{width:number;height:number}) {
 return {x:(point.x-box.left)*logical.width/Math.max(1,box.width),y:(point.y-box.top)*logical.height/Math.max(1,box.height)};
}
