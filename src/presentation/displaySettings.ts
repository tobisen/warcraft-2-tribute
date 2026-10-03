import {getPreferences,updatePreferences} from './preferences';
import {displayGeometry,type Resolution} from './displayPolicy';
export function bindDisplayControls():void {
 const root=document.getElementById('app')!,select=document.getElementById('display-resolution') as HTMLSelectElement,adapt=document.getElementById('display-window') as HTMLInputElement;
 const apply=()=>{const settings=getPreferences().display,v=displayGeometry(settings,{width:window.innerWidth,height:window.innerHeight});
  root.style.width=`${v.width}px`;root.style.height=`${v.height}px`;root.style.left=`${v.left}px`;root.style.top=`${v.top}px`;root.style.transform=`scale(${v.scale})`;root.style.setProperty('--display-width',`${v.width}px`);root.style.setProperty('--display-height',`${v.height}px`);
  select.value=settings.resolution;select.disabled=settings.adaptToWindow;adapt.checked=settings.adaptToWindow;
  document.getElementById('display-status')!.textContent=`${v.width} × ${v.height} · ${Math.round(v.scale*100)}% display scale · fullscreen is separate`;
  window.dispatchEvent(new Event('displaychange'));
 };
 select.addEventListener('change',()=>{updatePreferences({display:{resolution:select.value as Resolution}});apply();});
 adapt.addEventListener('change',()=>{updatePreferences({display:{adaptToWindow:adapt.checked}});apply();});
 window.addEventListener('resize',apply);apply();
}
