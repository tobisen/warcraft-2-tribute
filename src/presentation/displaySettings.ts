import {getPreferences,updatePreferences} from './preferences';
import {displayGeometry,type Resolution,type DisplayMode} from './displayPolicy';
export function bindDisplayControls():void {
 const root=document.getElementById('app')!,select=document.getElementById('display-resolution') as HTMLSelectElement,mode=document.getElementById('display-mode') as HTMLSelectElement;
 const apply=()=>{const settings=getPreferences().display,v=displayGeometry(settings,{width:window.innerWidth,height:window.innerHeight});
  root.style.width=`${v.width}px`;root.style.height=`${v.height}px`;root.style.left=`${v.left}px`;root.style.top=`${v.top}px`;root.style.transform=`scale(${v.scale})`;root.style.setProperty('--display-width',`${v.width}px`);root.style.setProperty('--display-height',`${v.height}px`);
  select.value=settings.resolution;mode.value=settings.mode;
  document.getElementById('display-status')!.textContent=`${v.width} × ${v.height} · ${Math.round(v.scale*100)}% display scale · ${settings.mode==='native'?'Native Size':'Fit to Window'}`;
  window.dispatchEvent(new Event('displaychange'));
 };
 select.addEventListener('change',()=>{updatePreferences({display:{resolution:select.value as Resolution}});apply();});
 mode.addEventListener('change',()=>{updatePreferences({display:{mode:mode.value as DisplayMode}});apply();});
 window.addEventListener('resize',apply);document.addEventListener('fullscreenchange',apply);apply();
}
