/** One delegated tooltip for all contextual controls, including disabled buttons. */
export function bindActionTooltips():void {
 const root=document.getElementById('bottom-bar')!,tip=document.createElement('div');
 tip.id='action-tooltip';tip.role='tooltip';tip.hidden=true;document.body.append(tip);
 let active:HTMLElement|null=null,timer:ReturnType<typeof setTimeout>|undefined;
 const hide=()=>{clearTimeout(timer);tip.hidden=true;active=null;};
 const render=()=>{
  if(!active||!active.dataset.tooltip||active.closest('[hidden]')||!active.getClientRects().length){hide();return;}
  tip.textContent=active.dataset.tooltip;tip.hidden=false;
  const rect=active.getBoundingClientRect();
  tip.style.left=`${Math.max(8,Math.min(rect.left,window.innerWidth-tip.offsetWidth-8))}px`;
  tip.style.top=`${Math.max(8,rect.top-tip.offsetHeight-8)}px`;
 };
 const control=(target:EventTarget|null)=>target instanceof Element?target.closest<HTMLElement>('[data-tooltip]'):null;
 const show=(next:HTMLElement|null,immediate=false)=>{
  if(next===active)return;
  hide();if(!next)return;active=next;
  if(immediate)render();else timer=setTimeout(render,120);
 };
 root.addEventListener('pointerover',event=>show(control(event.target)));
 root.addEventListener('pointerout',event=>{if(control(event.relatedTarget)!==active)hide();});
 root.addEventListener('focusin',event=>show(control(event.target),true));
 root.addEventListener('focusout',hide);
 document.addEventListener('pointerdown',hide);
 document.addEventListener('keydown',event=>{if(event.key==='Escape')hide();});
 window.addEventListener('blur',hide);
 window.addEventListener('resize',hide);
 document.addEventListener('scroll',hide,true);
 new MutationObserver(()=>{if(active&&!tip.hidden)render();}).observe(root,{subtree:true,attributes:true,attributeFilter:['data-tooltip','hidden']});
}
