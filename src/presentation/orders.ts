import type { GatheringState } from '../gameplay/gathering';
import type { CombatState } from '../gameplay/combat';
import type { Footprint, Farm } from '../gameplay/placement';
import type { Position } from '../gameplay/movement';
export interface OrderMarker { id:string; position:Position; blocked:boolean }
export function orderMarkers(gathering:GatheringState, combat:CombatState, playing:boolean, barracks?:Footprint|null,farms:readonly Farm[]=[],forge?:Footprint):OrderMarker[] {
  if (!playing) return [];
  return gathering.units.flatMap<OrderMarker>(u=>{
    if (!u.selected) return [];
    const blocked=u.navigation?.status==='blocked';
    if (blocked) return [{id:u.id,position:{...u.navigation!.destination},blocked:true}];
    const build=u.order.kind==='build' ? u.order.buildingId==='forge'?forge:u.order.buildingId==='barracks'?barracks:farms.find(f=>u.order.kind==='build'&&f.id===u.order.buildingId)?.footprint : null;
    const position=build ? {x:build.x+build.width/2,y:build.y+build.height/2} : u.order.kind==='move' ? u.target
      : u.order.kind==='gather' ? [gathering.node,gathering.gold].find(n=>n && u.order.kind==='gather' && n.id===u.order.nodeId)?.position
      : u.order.kind==='deliver' ? gathering.base
      : u.order.kind==='attack' ? combat.enemies.find(e=>u.order.kind==='attack' && e.id===u.order.enemyId)?.position : undefined;
    return position ? [{id:u.id,position:{...position},blocked:false}] : [];
  });
}
