import {audioConfig,effectMix} from '../config/audio';
export interface AudioSettings {master:number;effects:number;music:number;muted:boolean}
export const defaultAudio:AudioSettings={master:.65,effects:.7,music:.35,muted:false};
export function volume(value:number):number{return Number.isFinite(value)?Math.max(0,Math.min(1,value)):0;}
export function audioGain(settings:AudioSettings,channel:'effects'|'music'):number{return settings.muted?0:volume(settings.master)*volume(settings[channel]);}
export type Sound=keyof typeof effectMix;
export function allowEffect(name:Sound,now:number,last:number|undefined,active:number):boolean{
 const priority=name==='warning'||name==='victory'||name==='defeat';
 return now-(last??-Infinity)>=effectMix[name].cooldown&&active<(priority?audioConfig.maxEffects:audioConfig.maxEffects-2);
}
export interface AudioSnapshot {work?:Record<string,number>;construction?:Record<string,number>;production?:number;navalShots?:{id:string;audible:boolean}[];baseHP:number;own:Record<string,number>;visibleEnemies:Record<string,number>;completed:string[];outcome:'playing'|'victory'|'defeat'}
/** Intersect enemy visibility across snapshots: reveal/hide/death never leaks a hidden event. */
export function audioEvents(previous:AudioSnapshot|undefined,next:AudioSnapshot,playing:boolean):Sound[]{
 if(!previous||!playing)return [];
 if(previous.outcome==='playing'&&next.outcome!=='playing')return [next.outcome];
 if(next.outcome!=='playing')return [];
 const events:Sound[]=[];
 if(Object.entries(next.work??{}).some(([id,cargo])=>previous.work?.[id]!==undefined&&cargo>previous.work[id]!+1e-9))events.push('gather');
 if(Object.entries(next.construction??{}).some(([id,time])=>time>0&&previous.construction?.[id]!==undefined&&time<previous.construction[id]!))events.push('build');
 if(previous.production!==undefined&&next.production!==undefined&&next.production>previous.production)events.push('train');
 if(next.navalShots?.some(s=>s.audible&&!previous.navalShots?.some(p=>p.id===s.id)))events.push('cannon');
 if(next.baseHP<previous.baseHP||Object.entries(next.own).some(([id,hp])=>previous.own[id]!==undefined&&hp<previous.own[id]!)||Object.entries(next.visibleEnemies).some(([id,hp])=>previous.visibleEnemies[id]!==undefined&&hp<previous.visibleEnemies[id]!))events.push('impact');
 if(next.completed.some(id=>!previous.completed.includes(id)))events.push('complete');
 return events;
}
