import type { GatheringState } from '../gameplay/gathering';
import type { CombatState } from '../gameplay/combat';
import type { Footprint, Farm } from '../gameplay/placement';
import type { Position } from '../gameplay/movement';
export interface OrderMarker { id:string; position:Position; blocked:boolean;kind:'move'|'attack'|'work'|'blocked' }
export function orderMarkers(gathering:GatheringState, combat:CombatState, playing:boolean, barracks?:Footprint|null,farms:readonly Farm[]=[],forge?:Footprint,harbor?:Footprint,bases:readonly import('../gameplay/placement').ExtraBase[]=[]):OrderMarker[] {
  if (!playing) return [];
  return gathering.units.flatMap<OrderMarker>(u=>{
    if (!u.selected) return [];
    if(u.order.kind==='attack'&&!combat.enemies.some(e=>u.order.kind==='attack'&&e.id===u.order.enemyId))return [];
    const blocked=u.navigation?.status==='blocked';
    if (blocked) return [{id:u.id,position:{...u.navigation!.destination},blocked:true,kind:'blocked'}];
    const build=u.order.kind==='build' ? u.order.buildingId==='harbor'?harbor:u.order.buildingId==='forge'?forge:u.order.buildingId==='barracks'?barracks:bases.find(b=>u.order.kind==='build'&&b.id===u.order.buildingId)?.footprint??farms.find(f=>u.order.kind==='build'&&f.id===u.order.buildingId)?.footprint : null;
    const position=build ? {x:build.x+build.width/2,y:build.y+build.height/2} : u.order.kind==='move' ? u.target
      : u.order.kind==='gather' ? [gathering.node,gathering.gold].find(n=>n && u.order.kind==='gather' && n.id===u.order.nodeId)?.position
      : u.order.kind==='deliver' ? u.navigation?.destination??gathering.base
      : u.order.kind==='hunt'?u.target:u.order.kind==='attack' ? combat.enemies.find(e=>u.order.kind==='attack' && e.id===u.order.enemyId)?.position : undefined;
    return position ? [{id:u.id,position:{...position},blocked:false,kind:u.order.kind==='hunt'||u.order.kind==='attack'||u.kind==='soldier'&&u.attackMoveTarget?'attack':u.order.kind==='move'?'move':'work'}] : [];
  });
}

import type {NavyState} from '../gameplay/navy';
/** Combat must already be filtered to visible enemies, as for land markers. */
export function navalOrderMarkers(navy:NavyState|undefined,combat:CombatState,playing:boolean):OrderMarker[]{
 if(!playing)return [];return (navy?.ships??[]).flatMap<OrderMarker>(ship=>{if(!ship.selected)return [];const enemy=ship.order.kind==='attack'?combat.enemies.find(e=>ship.order.kind==='attack'&&e.id===ship.order.enemyId):undefined;if(ship.order.kind==='attack'&&!enemy)return [];const hunt=ship.order.kind==='hunt',blocked=ship.navigation?.status==='blocked';return hunt||enemy||ship.navigation?.status==='moving'||blocked?[{id:ship.id,position:{...(enemy?.position??ship.target)},blocked,kind:blocked?'blocked':enemy||hunt?'attack':'move'}]:[];});
}
