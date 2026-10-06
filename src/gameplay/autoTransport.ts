import {hasMainBase} from './extraBases';
import {navyConfig} from '../config/navy';
import {bodyFits,tileCenter} from './map';
import {domainMap,planDomainRoute} from './terrainNavigation';
import {allocateFormation} from './formations';
import {isAir} from './domains';
import {unitStats,combatUnitStats} from '../config/unit';
import {unitBody} from './spawning';
import {placementVisible} from './visibility';
import {loadTransport,unloadTransport} from './transport';
import type {MatchState} from './match';
import type {Position} from './movement';
import type {Unit} from './gathering';
export interface TransportTransfer {kind:'load'|'unload';shore:Position;water:Position;unitIds:string[];goals:Record<string,Position>;remainingSeconds:number}
const size=(u:Unit)=>u.kind==='worker'?unitStats.size:combatUnitStats(u).size;
const distance=(a:Position,b:Position)=>Math.hypot(a.x-b.x,a.y-b.y);
/** Local visible coast search; routes are tested only after geometry and landing clearance. */
export function requestTransport(m:MatchState,shipId:string,kind:'load'|'unload'):MatchState {
 if(m.paused||m.outcome!=='playing'||!hasMainBase(m))return m;
 const ship=m.navy?.ships.find(s=>s.id===shipId&&s.role==='transport'&&s.hp>0);if(!ship)return m;
 if(kind==='load'){const immediate=loadTransport(m,shipId);if(immediate!==m)return requestTransport(immediate,shipId,kind);}
 const units=m.gathering.units.filter(u=>u.selected&&!isAir(u)&&(u.hp??1)>0).slice(0,navyConfig.transport.capacity-(ship.passengers?.length??0));
 if(kind==='load'&&!units.length||kind==='unload'&&!ship.passengers?.length)return m;
 const land=domainMap(m.map,'land'),water=domainMap(m.map,'water'),radius=navyConfig.transport.searchRadius,candidates:Position[]=[];
 for(let row=Math.max(0,Math.floor((ship.position.y-radius)/32));row<=Math.floor((ship.position.y+radius)/32);row++)for(let column=Math.max(0,Math.floor((ship.position.x-radius)/32));column<=Math.floor((ship.position.x+radius)/32);column++){
  const p=tileCenter(m.map,{column,row});if(p&&distance(p,ship.position)<=radius&&bodyFits(land,p,12)&&(!m.fog||placementVisible(m.fog,unitBody(p,24))))candidates.push(p);
 }
 candidates.sort((a,b)=>distance(a,ship.position)-distance(b,ship.position)||a.y-b.y||a.x-b.x);
 for(const shore of candidates){
  const waterPoints:Position[]=[];
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const p={x:shore.x+dx*32,y:shore.y+dy*32};if(bodyFits(water,p,16)&&distance(p,shore)<=navyConfig.transport.contactRange)waterPoints.push(p);}
  waterPoints.sort((a,b)=>distance(a,ship.position)-distance(b,ship.position));
  for(const point of waterPoints){
   const preview={...m,navy:{...m.navy!,ships:m.navy!.ships.map(s=>s.id===shipId?{...s,position:point,selected:true}:s)}};
   if(kind==='unload'&&unloadTransport(preview,shipId,shore)===preview)continue;
   if(kind==='load'&&units.some(u=>distance(u.position,shore)>navyConfig.transport.boardingRadius))continue;
   const routes=kind==='load'?allocateFormation(units.map(u=>({id:u.id,position:u.position,half:size(u)/2,domain:'land',map:land,commandNumber:(u.navigation?.commandNumber??0)+1})),shore):new Map();
   if(kind==='load'&&(routes.size!==units.length||units.some(u=>{const r=routes.get(u.id);return !r||r.status==='blocked'||distance(r.destination,point)>navyConfig.transport.contactRange;})))continue;
   const navigation=planDomainRoute(m.map,'water',ship.position,point,16,(ship.navigation?.commandNumber??0)+1);if(navigation.status==='blocked')continue;
   const transfer:TransportTransfer={kind,shore,water:point,unitIds:kind==='load'?units.map(u=>u.id):[],goals:Object.fromEntries([...routes].map(([id,r])=>[id,r.destination])),remainingSeconds:navyConfig.transport.transferSeconds};
   return {...m,navy:{...m.navy!,ships:m.navy!.ships.map(s=>s===ship?{...s,transfer,navigation,target:point,commandMode:undefined,orderQueue:undefined,order:{kind:navigation.status==='moving'?'move' as const:'idle' as const}}:s)},gathering:{...m.gathering,units:m.gathering.units.map(u=>{const r=routes.get(u.id);return r?{...u,navigation:r,target:r.destination,commandMode:undefined,orderQueue:undefined,...(u.kind==='soldier'?{attackMoveTarget:undefined,autoOrigin:undefined,autoDisabled:true}:{}),order:{kind:r.status==='moving'?'move' as const:'idle' as const}}:u;})}};
  }
 }
 return m;
}
/** Pending work is tied to the original commands; new orders cancel it rather than stealing units. */
export function updateTransportTransfers(initial:MatchState,delta:number):MatchState {
 let m=initial;
 for(const original of initial.navy?.ships??[]){const transfer=original.transfer;if(!transfer)continue;
  const cancel=()=>{m={...m,navy:{...m.navy!,ships:m.navy!.ships.map(s=>s.id===original.id?{...s,transfer:undefined}:s)}};};
  const units=m.gathering.units.filter(u=>transfer.unitIds.includes(u.id)),remainingSeconds=transfer.remainingSeconds-delta;
  if(remainingSeconds<=0||original.navigation?.status==='blocked'||distance(original.target,transfer.water)>1||transfer.kind==='load'&&(units.length!==transfer.unitIds.length||units.some(u=>!['move','idle'].includes(u.order.kind)||distance(u.target,transfer.goals[u.id])>1))){cancel();continue;}
  if(original.order.kind==='move'||distance(original.position,transfer.water)>1){m={...m,navy:{...m.navy!,ships:m.navy!.ships.map(s=>s.id===original.id?{...s,transfer:{...transfer,remainingSeconds}}:s)}};continue;}
  if(transfer.kind==='load'&&units.some(u=>u.order.kind==='move')){m={...m,navy:{...m.navy!,ships:m.navy!.ships.map(s=>s.id===original.id?{...s,transfer:{...transfer,remainingSeconds}}:s)}};continue;}
  const selected=new Map(m.gathering.units.map(u=>[u.id,u.selected])),shipSelections=new Map(m.navy!.ships.map(s=>[s.id,s.selected]));
  const view={...m,gathering:{...m.gathering,units:m.gathering.units.map(u=>({...u,selected:transfer.kind==='load'&&transfer.unitIds.includes(u.id)}))},navy:{...m.navy!,ships:m.navy!.ships.map(s=>({...s,selected:s.id===original.id}))}};
  const after=transfer.kind==='load'?loadTransport(view,original.id):unloadTransport(view,original.id,transfer.shore);
  if(after===view){cancel();continue;}
  m={...after,gathering:{...after.gathering,units:after.gathering.units.map(u=>({...u,selected:selected.get(u.id)??false}))},navy:{...after.navy!,ships:after.navy!.ships.map(s=>({...s,selected:shipSelections.get(s.id)??false,...(s.id===original.id?{transfer:undefined}:{})}))}};
 }
 return m;
}

export function cancelSelectedTransfers(m:MatchState):MatchState {
 return m.navy?{...m,navy:{...m.navy,ships:m.navy.ships.map(s=>s.transfer&&(s.selected||m.gathering.units.some(u=>u.selected&&s.transfer!.unitIds.includes(u.id)))?{...s,transfer:undefined}:s)}}:m;
}
