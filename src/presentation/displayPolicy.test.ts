import {it,expect} from 'vitest';
import {resolutions,displayGeometry,clientPoint,validateDisplaySettings,type Resolution} from './displayPolicy';
import {createPreferenceStore} from './preferences';
it('all six rendering viewports fit small/large windows without stretching or changing their logical dimensions',()=>{
 for(const id of Object.keys(resolutions) as Resolution[])for(const windowSize of [{width:640,height:480},{width:1280,height:720},{width:2560,height:1440}]){
  const v=displayGeometry({resolution:id,adaptToWindow:false},windowSize);expect({width:v.width,height:v.height}).toEqual(resolutions[id]);expect(v.width*v.scale).toBeLessThanOrEqual(windowSize.width);expect(v.height*v.scale).toBeLessThanOrEqual(windowSize.height);
  const logical=clientPoint({x:v.left+v.width*v.scale*.4,y:v.top+v.height*v.scale*.6},{left:v.left,top:v.top,width:v.width*v.scale,height:v.height*v.scale},v);expect(logical.x).toBeCloseTo(v.width*.4);expect(logical.y).toBeCloseTo(v.height*.6);
 }
});
it('window adaptation has safe minimum HUD geometry and invalid stored settings fall back per field',()=>{
 expect(displayGeometry({resolution:'2048x1332',adaptToWindow:true},{width:400,height:300})).toMatchObject({width:800,height:600,scale:.5});
 expect(validateDisplaySettings({resolution:'stretch',adaptToWindow:false})).toEqual({resolution:'1280x720',adaptToWindow:false});expect(validateDisplaySettings(null).adaptToWindow).toBe(true);
});
it('display preferences persist independently of audio and match settings',()=>{
 let data:string|null=null;const host={getItem:()=>data,setItem:(_k:string,v:string)=>{data=v;}};const first=createPreferenceStore(()=>host);first.load();first.update({display:{resolution:'2048x1332',adaptToWindow:false}});const second=createPreferenceStore(()=>host);second.load();expect(second.get().display).toEqual({resolution:'2048x1332',adaptToWindow:false});expect(second.get().audio).toEqual(first.get().audio);expect(second.get().game).toEqual(first.get().game);
});
