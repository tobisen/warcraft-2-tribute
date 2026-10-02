import type { SelectableUnit } from './selection';
export type ControlGroups=Record<string,string[]>;
export interface GroupUnit extends SelectableUnit {hp?:number;owner?:string}
const valid=(unit:GroupUnit)=>(unit.hp??1)>0&&(!unit.owner||unit.owner==='player');
export const validGroup=(slot:string)=>/^[1-9]$/.test(slot);
export function bindGroup<T extends GroupUnit>(groups:ControlGroups,slot:string,units:T[],visible:(u:T)=>boolean=()=>true):ControlGroups {
 if(!validGroup(slot))return groups;
 return {...groups,[slot]:[...new Set(units.filter(u=>u.selected&&valid(u)&&visible(u)).map(u=>u.id))]};
}
export function recallGroup<T extends GroupUnit>(groups:ControlGroups,slot:string,units:T[],visible:(u:T)=>boolean=()=>true):T[]{
 if(!validGroup(slot))return units;
 const ids=new Set(groups[slot]??[]);return units.map(u=>({...u,selected:ids.has(u.id)&&valid(u)&&visible(u)}));
}
export function pruneGroups<T extends GroupUnit>(groups:ControlGroups,units:T[]):ControlGroups {
 const live=new Set(units.filter(valid).map(u=>u.id));return Object.fromEntries(Object.entries(groups).filter(([slot])=>validGroup(slot)).map(([slot,ids])=>[slot,[...new Set(ids.filter(id=>live.has(id)))]]));
}
/** Shift-click toggles just the hit; Shift-drag adds hits; empty modifiers preserve selection. */
export function combineSelection<T extends SelectableUnit>(current:T[],hits:T[],mode:'toggle'|'add'):T[]{
 const ids=new Set(hits.filter(u=>u.selected).map(u=>u.id));return current.map(u=>({...u,selected:mode==='toggle'?(ids.has(u.id)?!u.selected:u.selected):u.selected||ids.has(u.id)}));
}
