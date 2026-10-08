import {navyConfig} from '../config/navy';
import { barracksConfig, farmConfig } from '../config/buildings';
import type { GateFor } from './traffic';
import { approachRoute, canInteract } from './approach';
import { advanceRoute } from './navigation';
import { unitStats,workerStats } from '../config/unit';
import type { GatheringState, Unit } from './gathering';
import type { PlacementState, ConstructionJob, Footprint } from './placement';
import type { WorldMap } from './map';
type SiteId = `producer-${number}`| `base-${number}`|`wall-${number}`|`gate-${number}`|`tower-${number}`| 'siegeWorks'|'aviary'|'stable'|'academy'|'harbor'|'outpost'|'barracks'|'forge'|`farm-${number}`;
export function barracksReady(placement:PlacementState):boolean {
  return placement.barracks!==null && (!placement.construction || placement.construction.remainingSeconds===0);
}
export function resumeConstruction(gathering:GatheringState,placement:PlacementState,map:WorldMap,id:SiteId='barracks') {
  const producer=placement.producers?.find(p=>p.id===id);
  const tower=placement.defenses?.find(t=>t.id===id);
  const expansion=placement.bases?.find(b=>b.id===id);
  const farm=producer??expansion??tower??(id==='siegeWorks'?placement.siegeWorks:undefined)??(id==='aviary'?placement.aviary:undefined)??(id==='stable'?placement.stable:undefined)??(id==='academy'?placement.academy:undefined)??(id==='forge'?placement.forge:placement.farms?.find(f=>f.id===id));
  const rect=id==='barracks'?placement.barracks:farm?.footprint;
  const job=id==='barracks'?placement.construction:farm?.construction;
  if (!rect || !job || job.remainingSeconds<=0) return {gathering,placement};
  const builder=gathering.units.filter(u=>u.kind==='worker'&&u.selected)
    .sort((a,b)=>a.id.localeCompare(b.id,'en',{numeric:true}))[0];
  if (!builder || approachRoute(map,builder.position,rect,barracksConfig.constructionRange).status==='blocked') return {gathering,placement};
  const updated={...job,builderId:builder.id};
  return {placement:producer?{...placement,producers:placement.producers!.map(p=>p.id===id?{...p,construction:updated}:p)}:id==='barracks'?{...placement,construction:updated}
      :id==='siegeWorks'?{...placement,siegeWorks:{...placement.siegeWorks!,construction:updated}}:id==='aviary'?{...placement,aviary:{...placement.aviary!,construction:updated}}:id==='stable'?{...placement,stable:{...placement.stable!,construction:updated}}:id==='academy'?{...placement,academy:{...placement.academy!,construction:updated}}:expansion?{...placement,bases:placement.bases!.map(b=>b.id===id?{...b,construction:updated}:b)}:tower?{...placement,defenses:placement.defenses!.map(t=>t.id===id?{...t,construction:updated}:t)}:id==='forge'?{...placement,forge:{...placement.forge!,construction:updated}}:{...placement,farms:placement.farms!.map(f=>f.id===id?{...f,construction:updated}:f)},
    gathering:{...gathering,units:gathering.units.map((u):Unit=>u.id===builder.id&&u.kind==='worker'
      ? {...u,commandMode:undefined,orderQueue:undefined,navigation:undefined,order:{kind:'build',buildingId:id}}
      : u.order.kind==='build'&&u.order.buildingId===id?{...u,navigation:undefined,target:{...u.position},order:{kind:'idle'}}:u)}};
}
export function updateSite(gathering:GatheringState,job:ConstructionJob,rect:Footprint,id:SiteId,map:WorldMap,delta:number,gateFor?:GateFor) {
  if (job.remainingSeconds<=0) return {gathering,job};
  const builder=gathering.units.find(u=>u.id===job.builderId && u.kind==='worker' && u.order.kind==='build'&&u.order.buildingId===id);
  if (!builder) return {gathering,job};
  const range=id==='harbor'?navyConfig.harbor.constructionRange:id==='barracks'?barracksConfig.constructionRange:farmConfig.constructionRange;
  const goalKey=`build:${id}`,cached=builder.navigation;
  const route=cached?.goalKey===goalKey&&cached.revision===map.revision?cached
    : {...approachRoute(map,builder.position,rect,range),goalKey};
  const step=advanceRoute(map,builder.position,route,workerStats(gathering.faction).speed,Math.max(0,delta),gateFor?.(`player:${builder.id}`));
  const remainingSeconds=step.route.status==='arrived'&&canInteract(map,step.position,rect,range)
    ? Math.max(0,job.remainingSeconds-step.remaining):job.remainingSeconds;
  const done=remainingSeconds<=1e-10;
  return {completedAfterSeconds:done?Math.max(0,delta-step.remaining+job.remainingSeconds):undefined,job:{...job,remainingSeconds:done?0:remainingSeconds,builderId:done?null:job.builderId},
    gathering:{...gathering,units:gathering.units.map((u):Unit=>u.id!==builder.id || u.kind!=='worker'?u:
      {...u,position:step.position,target:{...step.position},navigation:done?undefined:{...step.route,goalKey},order:done?{kind:'idle'}:u.order})}};
}
const readyTimes=new WeakMap<ConstructionJob,number>();
export function productionTimeAfterConstruction(job:ConstructionJob,delta:number){const readyAfter=readyTimes.get(job)??0;readyTimes.delete(job);return job.remainingSeconds>0?0:Math.max(0,delta-readyAfter);}
export function updateConstruction(gathering:GatheringState,placement:PlacementState,map:WorldMap,delta:number,gateFor?:GateFor) {
  let next=gathering,construction=placement.construction;
  const producers=placement.producers?.map(p=>{const r=updateSite(next,p.construction,p.footprint,p.id,map,delta,gateFor);next=r.gathering;if(r.completedAfterSeconds!==undefined)readyTimes.set(r.job,r.completedAfterSeconds);return {...p,construction:r.job};});
  let barracksReadyAfter:number|undefined;
  if (construction && placement.barracks) {
    const result=updateSite(next,construction,placement.barracks,'barracks',map,delta,gateFor);next=result.gathering;construction=result.job;barracksReadyAfter='completedAfterSeconds' in result?result.completedAfterSeconds:undefined;
  }
  let siegeWorks=placement.siegeWorks;if(siegeWorks){const r=updateSite(next,siegeWorks.construction,siegeWorks.footprint,'siegeWorks',map,delta,gateFor);next=r.gathering;siegeWorks={...siegeWorks,construction:r.job};}
  let aviary=placement.aviary;if(aviary){const r=updateSite(next,aviary.construction,aviary.footprint,'aviary',map,delta,gateFor);next=r.gathering;aviary={...aviary,construction:r.job};}
  let stable=placement.stable;if(stable){const r=updateSite(next,stable.construction,stable.footprint,'stable',map,delta,gateFor);next=r.gathering;stable={...stable,construction:r.job};}
  let academy=placement.academy;if(academy){const r=updateSite(next,academy.construction,academy.footprint,'academy',map,delta,gateFor);next=r.gathering;academy={...academy,construction:r.job};}
  let forge=placement.forge;
  if(forge){const result=updateSite(next,forge.construction,forge.footprint,'forge',map,delta,gateFor);next=result.gathering;forge={...forge,construction:result.job};}
  const bases=placement.bases?.map(b=>{const result=updateSite(next,b.construction,b.footprint,b.id,map,delta,gateFor);next=result.gathering;return {...b,construction:result.job};});
  const farms=placement.farms?.map(f=>{
    const result=updateSite(next,f.construction,f.footprint,f.id,map,delta,gateFor);next=result.gathering;
    return {...f,construction:result.job};
  });
  return {barracksReadyAfter,gathering:next,placement:{...placement,...(producers?{producers}:{}),...(siegeWorks?{siegeWorks}:{}),...(aviary?{aviary}:{}),...(stable?{stable}:{}),...(academy?{academy}:{}),...(bases?{bases}:{}),...(construction?{construction}:{}),...(farms?{farms}:{}),...(forge?{forge}:{})}};
}
