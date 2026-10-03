import {selectPlayerTarget,type BuildingSelection} from './buildingSelection';
import {isNodeHit,type ResourceNode} from './gathering';
import type {Position} from './movement';
import type {Footprint} from './placement';
import type {SelectableUnit} from './selection';

/** Player entities win overlapping hits. Resources replace selection and never issue orders. */
export function selectWorldTarget<T extends SelectableUnit>(units:T[],point:Position,base:Position,
 barracks:Footprint|null,size:number|((unit:T)=>number),harbor:Footprint|null|undefined,
 nodes:readonly ResourceNode[],known:(node:ResourceNode)=>boolean):{units:T[];building:BuildingSelection;resource:string|null}{
 const own=selectPlayerTarget(units,point,base,barracks,size,harbor);
 const resource=own.building||own.units.some(u=>u.selected)?null:nodes.find(n=>known(n)&&isNodeHit(point,n))?.id??null;
 return {...own,resource};
}
