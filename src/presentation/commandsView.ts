import {hotkeys} from './hotkeys';
export const commandCategories=['Selection','Movement','Combat','Economy','Building','Camera'] as const;
export type CommandCategory=typeof commandCategories[number];
export interface CommandRow {category:CommandCategory;command:string;gesture:string;explanation:string;action?:string}
const basics:CommandRow[]=[
 {category:'Economy',command:'Enter cheat code',gesture:'Enter',explanation:'Open code input; Enter applies and Escape cancels.'},
 {category:'Selection',command:'Select',gesture:'Left click',explanation:'Select a unit, building, resource or animal.'},
 {category:'Selection',command:'Select group',gesture:'Left drag',explanation:'Select own units inside the rectangle.'},
 {category:'Selection',command:'Toggle / add',gesture:'Shift + click / drag',explanation:'Toggle one unit or add the dragged units.'},
 {category:'Selection',command:'Assign / recall group',gesture:'Ctrl/Cmd + 1–9 / 1–9',explanation:'Store the selected group or select its surviving units.'},
 {category:'Selection',command:'Pause / cancel',gesture:'P / Escape',explanation:'Pause or resume; Escape cancels a pending target or placement first. Escape closes this view.'},
 {category:'Movement',command:'Move',gesture:'Right click ground',explanation:'Send selected units to reachable ground.'},
 {category:'Movement',command:'Queue order',gesture:'Shift + right click',explanation:'Append a move, attack or gather order; hold and patrol can also be queued.'},
 {category:'Movement',command:'Board transport',gesture:'Right click own transport',explanation:'Selected troops approach a reachable boarding shore.'},
 {category:'Combat',command:'Attack / hunt',gesture:'Right click visible enemy / animal',explanation:'Combat units attack; workers can make weak manual attacks.'},
 {category:'Economy',command:'Gather',gesture:'Right click tree / gold mine',explanation:'Selected workers gather and deliver finite resources.'},
 {category:'Building',command:'Place building',gesture:'Build button or key → left click',explanation:'Preview the selected building, then place at a visible legal site. Escape cancels.'},
 {category:'Building',command:'Rally point',gesture:'Select production building → right click',explanation:'Set a destination for newly trained units.'},
 {category:'Camera',command:'Zoom',gesture:'Mouse wheel over map',explanation:'Zoom around the point under the mouse.'},
 {category:'Camera',command:'Pan',gesture:'Arrow keys / middle drag',explanation:'Move the camera within map bounds.'},
 {category:'Camera',command:'Minimap',gesture:'Left click minimap',explanation:'Move the camera to that map position.'},
 {category:'Camera',command:'Focus selection',gesture:'Space',explanation:'Center the camera on your selected units or building.'},
 {category:'Camera',command:'Focus base',gesture:'Home',explanation:'Center the camera on your main base.'},
];
function category(id:string):CommandCategory{return id==='dismiss-units'?'Selection':id==='repair-building'||id==='train-worker'||id.startsWith('research-')?'Economy':id.startsWith('build-')||id.startsWith('upgrade-')?'Building':['stop-units','patrol-units','unload-transport','train-transport'].includes(id)?'Movement':'Combat';}
export function commandRows():CommandRow[]{return [...basics,...hotkeys.map(h=>({category:category(h.button),command:h.button.split('-').map((w,i)=>i===0?w[0]!.toUpperCase()+w.slice(1):w).join(' '),gesture:h.key,explanation:h.label.split(/(?<=\.)\s+/)[0]!,action:h.button}))];}
export function renderCommandsView():void{
 const panel=document.getElementById('pause-commands-panel')!;if(panel.hidden||panel.childElementCount)return;
 const tabs=document.createElement('nav');tabs.className='command-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Command sections');panel.append(tabs);
 const buttons:HTMLButtonElement[]=[],sections:HTMLElement[]=[];
 const activate=(index:number,focus=false)=>{buttons.forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;sections[i]!.hidden=i!==index;});panel.scrollTop=0;if(focus)buttons[index]!.focus();};
 for(const category of commandCategories){const section=document.createElement('section'),h=document.createElement('h3'),table=document.createElement('table'),head=document.createElement('thead'),header=document.createElement('tr');h.textContent=category;
  const button=document.createElement('button'),index=buttons.length;button.type='button';button.textContent=category;button.id=`commands-tab-${category.toLowerCase()}`;button.setAttribute('role','tab');button.setAttribute('aria-controls',`commands-section-${category.toLowerCase()}`);
  section.id=`commands-section-${category.toLowerCase()}`;section.setAttribute('role','tabpanel');section.setAttribute('aria-labelledby',button.id);section.tabIndex=0;
  button.addEventListener('click',()=>activate(index));button.addEventListener('keydown',event=>{const next=event.key==='ArrowRight'?(index+1)%commandCategories.length:event.key==='ArrowLeft'?(index+commandCategories.length-1)%commandCategories.length:event.key==='Home'?0:event.key==='End'?commandCategories.length-1:null;if(next===null)return;event.preventDefault();event.stopPropagation();activate(next,true);});buttons.push(button);sections.push(section);tabs.append(button);
  for(const name of ['Command','Key / gesture','What it does']){const th=document.createElement('th');th.scope='col';th.textContent=name;header.append(th);}head.append(header);table.append(head);const body=document.createElement('tbody');
  for(const row of commandRows().filter(r=>r.category===category)){const tr=document.createElement('tr');if(row.action)tr.dataset.commandAction=row.action;for(const value of [row.command,row.gesture,row.explanation]){const td=document.createElement('td');td.textContent=value;tr.append(td);}body.append(tr);}table.append(body);section.append(h,table);panel.append(section);
 }
 activate(0);
}
