import {it,expect} from 'vitest';
import {resolutions,displayGeometry,clientPoint,validateDisplaySettings,type Resolution} from './displayPolicy';
import {createPreferenceStore} from './preferences';
it('all six rendering viewports fit small/large windows without stretching or changing their logical dimensions',()=>{
 for(const id of Object.keys(resolutions) as Resolution[])for(const windowSize of [{width:640,height:480},{width:1280,height:720},{width:2560,height:1440}]){
  const v=displayGeometry({resolution:id,mode:'native'},windowSize);expect({width:v.width,height:v.height}).toEqual(resolutions[id]);expect(v.width*v.scale).toBeLessThanOrEqual(windowSize.width);expect(v.height*v.scale).toBeLessThanOrEqual(windowSize.height);
  const logical=clientPoint({x:v.left+v.width*v.scale*.4,y:v.top+v.height*v.scale*.6},{left:v.left,top:v.top,width:v.width*v.scale,height:v.height*v.scale},v);expect(logical.x).toBeCloseTo(v.width*.4);expect(logical.y).toBeCloseTo(v.height*.6);
 }
});
it('window adaptation has safe minimum HUD geometry and invalid stored settings fall back per field',()=>{
 expect(displayGeometry({resolution:'800x600',mode:'fit'},{width:400,height:300})).toMatchObject({width:800,height:600,scale:.5});
 expect(validateDisplaySettings({resolution:'stretch',mode:'native'})).toEqual({resolution:'1920x1080',mode:'native'});expect(validateDisplaySettings(null).mode).toBe('fit');
});
it('display preferences persist independently of audio and match settings',()=>{
 let data:string|null=null;const host={getItem:()=>data,setItem:(_k:string,v:string)=>{data=v;}};const first=createPreferenceStore(()=>host);first.load();first.update({display:{resolution:'2048x1332',mode:'native'}});const second=createPreferenceStore(()=>host);second.load();expect(second.get().display).toEqual({resolution:'2048x1332',mode:'native'});expect(second.get().audio).toEqual(first.get().audio);expect(second.get().game).toEqual(first.get().game);
});

it('native never enlarges; fit scales proportionally while keeping the rendering preset',()=>{
 const native=displayGeometry({resolution:'800x600',mode:'native'},{width:1920,height:1080});expect(native).toEqual({width:800,height:600,scale:1,left:560,top:240});
 const fit=displayGeometry({resolution:'800x600',mode:'fit'},{width:1920,height:1080});expect(fit).toEqual({width:800,height:600,scale:1.8,left:240,top:0});
 for(const mode of ['native','fit'] as const)expect(displayGeometry({resolution:'800x600',mode},{width:600,height:400}).scale).toBeCloseTo(2/3);
});
it('migrates window adaptation to display mode and validates explicit mode independently',()=>{
 expect(validateDisplaySettings({resolution:'800x600',adaptToWindow:true})).toEqual({resolution:'800x600',mode:'fit'});
 expect(validateDisplaySettings({adaptToWindow:false})).toEqual({resolution:'1920x1080',mode:'native'});
 expect(validateDisplaySettings({mode:'native',adaptToWindow:true}).mode).toBe('native');
 expect(validateDisplaySettings({mode:'stretch'}).mode).toBe('fit');
});

it('fresh installs start at 1920x1080 fit while saved lower native choices survive reload',()=>{
 let data:string|null=null;const host={getItem:()=>data,setItem:(_key:string,value:string)=>{data=value;}};
 const first=createPreferenceStore(()=>host);first.load();expect(first.get().display).toEqual({resolution:'1920x1080',mode:'fit'});
 first.update({display:{resolution:'800x600',mode:'native'}});const returning=createPreferenceStore(()=>host);returning.load();expect(returning.get().display).toEqual({resolution:'800x600',mode:'native'});
});
