import {matchAnimals} from './wildlife';
import type {Position} from './movement';
import type {Unit} from './gathering';
import type {Ship} from './navy';
import {commandShips} from './navy';
import {attackShips} from './navy';
import type {MatchState} from './match';
import {commandGroupMove} from './groupMovement';
import {commandAttackMove} from './attackMove';
import {orderUnits,resourceNodes} from './gathering';
import {orderAttack} from './combat';
import {entityVisible} from './visibility';
export type QueuedOrder = {kind:'move'|'attack-move'|'patrol';destination:Position}|{kind:'attack';enemyId:string}|{kind:'gather';nodeId:string}|{kind:'hold'}|{kind:'hunt';animalId:string};
export interface OrderState {
 orderQueue?:QueuedOrder[];
 commandMode?:{kind:'hold'}|{kind:'patrol';origin:Position;destination:Position;returning:boolean};
}
export const orderQueueLimit=32;
function supports(u:Unit|Ship,o:QueuedOrder):boolean {
 return o.kind==='hunt'?u.kind==='soldier'||u.kind==='ship'&&u.role!=='transport':o.kind==='gather'?u.kind==='worker':o.kind==='attack-move'?u.kind==='soldier':o.kind==='attack'?u.kind==='soldier'||u.kind==='ship'&&u.role!=='transport':true;
}
function start(m:MatchState,u:Unit|Ship,o:QueuedOrder):Unit|Ship {
 if(o.kind==='hunt'&&(u.kind==='soldier'||u.kind==='ship'&&u.role!=='transport')){const animal=matchAnimals(m).find(a=>a.id===o.animalId);return {...u,commandMode:undefined,orderQueue:undefined,navigation:undefined,...(u.kind==='soldier'?{attackMoveTarget:undefined,autoOrigin:undefined,autoDisabled:false}:{}),target:{...(animal?.position??u.position)},order:animal?.hp?{kind:'hunt',animalId:o.animalId}:{kind:'idle'}};}
 const selected={...u,selected:true,commandMode:undefined,orderQueue:undefined,navigation:undefined};
 if(o.kind==='hold')return {...selected,selected:u.selected,target:{...u.position},order:{kind:'idle'},...(u.kind==='soldier'?{autoDisabled:false,autoOrigin:undefined,attackMoveTarget:undefined}:{}),commandMode:{kind:'hold'}};
 if(u.kind==='ship'){
  const single={...m,navy:{...m.navy!,ships:[selected as Ship]}};
  const moved=o.kind==='attack'?attackShips(single,o.enemyId)?.ships[0]:o.kind==='move'||o.kind==='patrol'?commandShips(single,o.destination)?.ships[0]:selected;
  return {...moved!,...(o.kind==='patrol'?{commandMode:{kind:'patrol' as const,origin:{...u.position},destination:{...moved!.target},returning:false}}:{}),selected:u.selected};
 }
 const land=selected as Unit;
 const next=o.kind==='attack'?orderAttack([land],o.enemyId)[0]:o.kind==='gather'?orderUnits([land],u.position,resourceNodes(m.gathering).find(n=>n.id===o.nodeId))[0]:o.kind==='attack-move'||o.kind==='patrol'&&u.kind==='soldier'?commandAttackMove([land],o.destination,m.map)[0]:o.kind==='move'||o.kind==='patrol'?commandGroupMove([land],o.destination,m.map)[0]:land;
 return {...next,selected:u.selected,...(o.kind==='patrol'?{commandMode:{kind:'patrol' as const,origin:{...u.position},destination:{...next.target},returning:false}}:{})};
}
/** Shift appends only supported commands. Selection never changes as orders advance. */
export function issueOrder(m:MatchState,o:QueuedOrder,append=false):MatchState {
 if(m.paused||m.outcome!=='playing')return m;
 const destination='destination' in o?o.destination:undefined;
 const group=destination?new Map((o.kind==='attack-move'?commandAttackMove:commandGroupMove)(m.gathering.units,destination,m.map).map(u=>[u.id,u])):undefined;
 const shipGroup=destination&&o.kind!=='attack-move'?new Map((commandShips(m,destination)?.ships??[]).map(u=>[u.id,u])):undefined;
 const apply=(u:Unit|Ship):Unit|Ship=>{
  if(!u.selected||!supports(u,o))return u;
  const allocated=u.kind==='ship'?shipGroup?.get(u.id):group?.get(u.id);
  const command=destination&&allocated?{...o,destination:{...allocated.target}} as QueuedOrder:o;
  if(append&&(u.order.kind!=='idle'||u.commandMode||u.orderQueue?.length))return {...u,orderQueue:[...(u.orderQueue??[]),structuredClone(command)].slice(0,orderQueueLimit)};
  return (o.kind==='move'||o.kind==='attack-move')&&allocated?{...allocated,selected:u.selected}:start(m,u,command);
 };
 return {...m,gathering:{...m.gathering,units:m.gathering.units.map(u=>apply(u) as Unit)},...(m.navy?{navy:{...m.navy,ships:m.navy.ships.map(u=>apply(u) as Ship)}}:{})};
}
/** Completion starts the next order on the next simulation step, without inventing elapsed work. */
export function prepareOrders(m:MatchState):MatchState {
 const apply=(original:Unit|Ship):Unit|Ship=>{
  const u=original.order.kind==='attack'&&original.navigation?.status==='blocked'&&original.orderQueue?.length&&!original.commandMode?{...original,order:{kind:'idle' as const},navigation:undefined}:original;
  if(u.commandMode?.kind==='hold')return u;
  if(u.commandMode?.kind==='patrol'&&u.order.kind==='idle'&&!(u.kind==='soldier'&&u.attackMoveTarget)){
   const mode=u.commandMode;
   // A blocked patrol rests until terrain changes; never spin through unreachable endpoints.
   if(u.navigation?.status==='blocked'&&u.navigation.revision===m.map.revision)return u;
   const leg=mode.returning?mode.origin:mode.destination;
   const arrived=Math.hypot(u.position.x-leg.x,u.position.y-leg.y)<1;
   const returning=arrived?!mode.returning:mode.returning,destination=returning?mode.origin:mode.destination;
   const next=start(m,u,{kind:u.kind==='soldier'?'attack-move':'move',destination});
   return {...next,commandMode:{...mode,returning,...(returning?{origin:{...next.target}}:{destination:{...next.target}})},orderQueue:u.orderQueue};
  }
  if(u.order.kind!=='idle'||u.kind==='soldier'&&u.attackMoveTarget||!u.orderQueue?.length)return u;
  const pending=[...u.orderQueue];
  while(pending.length){const o=pending.shift()!;
   if(o.kind==='attack'&&!m.combat.enemies.some(e=>e.id===o.enemyId&&e.hp>0&&(!m.fog||entityVisible(m.fog,'player',e))))continue;
   if(o.kind==='hunt'&&!matchAnimals(m).some(a=>a.id===o.animalId&&a.hp>0&&(!m.fog||entityVisible(m.fog,'player',a))))continue;
   if(o.kind==='gather'&&!resourceNodes(m.gathering).some(n=>n.id===o.nodeId))continue;
   return {...start(m,u,o),orderQueue:pending.length?pending:undefined};
  }
  return {...u,orderQueue:undefined};
 };
 return {...m,gathering:{...m.gathering,units:m.gathering.units.map(u=>apply(u) as Unit)},...(m.navy?{navy:{...m.navy,ships:m.navy.ships.map(u=>apply(u) as Ship)}}:{})};
}
export function orderSummary(u:Unit|Ship):string {
 const current=u.commandMode?.kind??(u.kind==='soldier'&&u.attackMoveTarget?'attack-move':u.order.kind);
 return `Order: ${current}${u.orderQueue?.length?` · Queue ${u.orderQueue.length}: ${u.orderQueue.map(o=>o.kind).join(' → ')}`:''}`;
}
