import type {MatchState} from '../gameplay/match';
import type {Position} from '../gameplay/movement';
import {isVisible} from '../gameplay/fog';
import {factions} from '../config/factions';
import {audioConfig} from '../config/audio';
import type {Sound} from './audioPolicy';
export interface AudibleBody {id:string;hp:number;position:Position;building:boolean}
export interface AudibleAttack {id:string;position:Position;visible:boolean;cooldown:number;sound:'melee'|'bow'|'siege'|'cannon';target?:string;range:number}
export interface CombatAudioSnapshot {bodies:AudibleBody[];attacks:AudibleAttack[];shots:{id:string;shooter?:string;visible:boolean}[]}
/** Public presentation snapshot only; never publishes hidden units or creates observers. */
export function combatAudioSnapshot(m:MatchState):CombatAudioSnapshot{
 const seen=(p:Position)=>!m.fog||isVisible(m.fog,'player',p),p=m.placement,n=m.navy;
 const bodies:AudibleBody[]=[{id:'base',hp:m.combat.baseHP,position:m.gathering.base,building:true},...m.gathering.units.map(u=>({id:u.id,hp:u.hp??30,position:{...u.position},building:false})),...(n?.ships??[]).map(u=>({id:u.id,hp:u.hp,position:{...u.position},building:false})),...m.combat.enemies.filter(e=>seen(e.position)).map(e=>({id:e.id,hp:e.hp,position:{...e.position},building:!!e.footprint}))];
 const building=(id:string,hp:number,rect:{x:number;y:number;width:number;height:number})=>bodies.push({id,hp,position:{x:rect.x+rect.width/2,y:rect.y+rect.height/2},building:true});
 if(p.barracks)building('barracks',p.barracksHP??factions[m.factions?.player??'crown'].buildings.barracks.hp,p.barracks);
 for(const f of p.farms??[])building(f.id,f.hp??factions[m.factions?.player??'crown'].buildings.farm.hp,f.footprint);
 if(p.academy)building('academy',p.academy.hp,p.academy.footprint);if(p.forge)building('forge',p.forge.hp,p.forge.footprint);if(n?.harbor)building('harbor',n.harbor.hp,n.harbor.footprint);
 for(const t of p.defenses??[])building(t.id,t.hp,t.footprint);
 const attacks:AudibleAttack[]=[];
 for(const t of p.defenses??[])if(t.kind==='tower'&&t.hp>0&&t.construction.remainingSeconds===0){const position={x:t.footprint.x+16,y:t.footprint.y+16};attacks.push({id:t.id,position,visible:seen(position),cooldown:t.cooldown,sound:'bow',range:t.level===2?192:176});}
 for(const [team,units]of [['player',m.gathering.units],['enemy',m.combat.enemies]] as const)for(const u of units){
  if(u.kind==='worker'||u.kind==='base'||u.kind==='building'||'footprint'in u&&u.footprint)continue;
  const type='archetype'in u?u.archetype??'soldier':'role'in u?u.role??'soldier':'soldier',stats=factions[m.factions?.[team]??'crown'].units[type==='archer'||type==='catapult'||type==='specialist'?type:'soldier'];
  const sound=u.kind==='ship'?'cannon':type==='catapult'?'siege':stats.projectileSpeed?'bow':'melee';
  const target='order'in u&&u.order?.kind==='attack'&&'enemyId'in u.order?u.order.enemyId:u.navigation?.targetId;
  attacks.push({id:u.id,position:{...u.position},visible:seen(u.position),cooldown:u.attackCooldown??0,sound,target,range:stats.range??32});
 }
 for(const u of n?.ships??[])if(u.role!=='transport')attacks.push({id:u.id,position:{...u.position},visible:seen(u.position),cooldown:u.attackCooldown??0,sound:'cannon',target:u.order.kind==='attack'?u.order.enemyId:undefined,range:220});
 return {bodies:bodies.filter(b=>seen(b.position)),attacks:attacks.filter(a=>a.visible),shots:(m.combat.projectiles??[]).map(s=>({id:s.id,shooter:s.shooterId,visible:seen(s.position)}))};
}
export function combatDistanceGain(position:Position,listener:Position):number{
 const distance=Math.hypot(position.x-listener.x,position.y-listener.y);
 return Math.max(0,Math.min(1,(audioConfig.audibleRadius-distance)/(audioConfig.audibleRadius-audioConfig.nearRadius)));
}
/** Coalesce by family, use the closest event; initial/load/reveal/pause are silent. */
export function combatAudioCues(before:CombatAudioSnapshot|undefined,next:CombatAudioSnapshot,listener:Position,playing:boolean):{sound:Sound;gain:number}[]{
 if(!before||!playing)return [];
 const cues=new Map<Sound,number>(),emit=(sound:Sound,p:Position)=>{const gain=combatDistanceGain(p,listener);if(gain>0)cues.set(sound,Math.max(cues.get(sound)??0,gain));};
 const damaged=next.bodies.filter(b=>{const old=before.bodies.find(p=>p.id===b.id);return old&&b.hp<old.hp;});
 for(const b of damaged)emit(b.building?'buildingHit':'impact',b.position);
 for(const a of next.attacks){const old=before.attacks.find(p=>p.id===a.id);if(!old)continue;
  if(a.sound!=='melee'){
   const fresh=next.shots.some(s=>s.visible&&s.shooter===a.id&&!before.shots.some(p=>p.id===s.id));
   if(fresh||a.cooldown>old.cooldown+1e-6)emit(a.sound,a.position);
  }else{const victim=damaged.find(b=>b.id===(a.target??old.target));if(victim&&Math.hypot(victim.position.x-a.position.x,victim.position.y-a.position.y)<=a.range+64)emit('melee',a.position);}
 }
 return [...cues].map(([sound,gain])=>({sound,gain}));
}
