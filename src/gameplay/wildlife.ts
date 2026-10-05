import type {TargetDomain} from '../config/domains';
import type {Ship} from './navy';
import {attackStep as marineAttackStep} from './navalCombat';
import type {Soldier} from './gathering';
import {combatConfig} from '../config/combat';
import {factions} from '../config/factions';
import {wildlifeConfig,wildlifeFeedbackSeconds} from '../config/wildlife';
import {wildlifeHabitats,wildlifePose} from '../presentation/wildlife';
import {isVisible} from './fog';
import {bodyFits,type WorldMap} from './map';
import {movementMap,canAttackDomain} from './domains';
import {combatApproach} from './combat';
import {combatUnitStats,rangedStats} from '../config/unit';
import {abilityEffects} from './abilities';
import {spellModifiers} from './spells';
import type {MatchState} from './match';
import type {Position} from './movement';
export interface AnimalState {hp:number;hurtAt?:number;deadAt?:number}
export type WildlifeState=Record<string,AnimalState>;
const homes=new Map<string,ReturnType<typeof wildlifeHabitats>>();
function habitats(map:WorldMap){const key=`${map.id}:${map.terrainLayout}:${map.width}:${map.height}:${map.tileSize}`;let value=homes.get(key);if(!value){value=wildlifeHabitats(map);homes.set(key,value);}return value;}
export function matchAnimals(m:MatchState){return habitats(m.map).map(h=>{const state=m.wildlife?.[h.id],stats=wildlifeConfig[h.type],pose=wildlifePose(h,state?.deadAt??m.waves.elapsedSeconds);return {...pose,type:h.type,name:stats.name,maxHP:stats.hp,hp:state?.hp??stats.hp,hurtAt:state?.hurtAt,deadAt:state?.deadAt};});}
export function animalAt(m:MatchState,p:Position){return matchAnimals(m).find(a=>a.hp>0&&Math.abs(p.x-a.position.x)<=16&&p.y>=a.position.y-24&&p.y<=a.position.y+8&&bodyFits(m.map,a.position,10)&&(!m.fog||isVisible(m.fog,'player',a.position)));}
export function visibleAnimals(m:MatchState){return matchAnimals(m).filter(a=>(a.hp>0||m.waves.elapsedSeconds-(a.deadAt??0)<wildlifeFeedbackSeconds)&&bodyFits(m.map,a.position,10)&&(!m.fog||isVisible(m.fog,'player',a.position)));}
/** Hunting uses ordinary combat approach/range/cooldowns; neutral damage never enters enemy ledgers. */
export function updateWildlife(m:MatchState,delta:number):MatchState{
 if(delta<=0||m.paused||m.outcome!=='playing'||!m.gathering.units.some(u=>u.kind==='soldier'&&u.order.kind==='hunt')&&!m.navy?.ships.some(s=>s.order.kind==='hunt'))return m;
 const animals=matchAnimals(m),wildlife={...m.wildlife};
 const apply=(u:Soldier|Ship):Soldier|Ship=>{
  if(u.order.kind!=='hunt')return u;
  const animal=animals.find(a=>u.order.kind==='hunt'&&a.id===u.order.animalId),hp=animal?(wildlife[animal.id]?.hp??animal.hp):0;
  const stop=()=>({...u,order:{kind:'idle' as const},navigation:undefined,target:{...u.position}});
  if(!animal||hp<=0||!canAttackDomain(u,{},m.gathering.faction??'crown')||!bodyFits(m.map,animal.position,10)||m.fog&&!isVisible(m.fog,'player',animal.position))return stop();
  const stats=u.kind==='ship'?factions[m.gathering.faction??'crown'].naval.units.warship:combatUnitStats(u,m.gathering.faction),ranged=u.kind==='ship'?factions[m.gathering.faction??'crown'].naval.units.warship:rangedStats(u,m.gathering.faction),range=ranged?.range??stats.range??combatConfig.soldierRange,step=u.kind==='ship'?marineAttackStep(u,{id:animal.id,kind:'unit',position:animal.position,hp},delta,m.map,factions[m.gathering.faction??'crown'].naval.units.warship):combatApproach({...movementMap(m.map,u),bodyHalf:stats.size/2},u.position,{x:animal.position.x-10,y:animal.position.y-10,width:20,height:20},animal.id,stats.speed,range,delta,u.navigation);
  if(step.navigation?.status==='blocked')return stop();
  const domainDamage:Partial<Record<TargetDomain,number>>=stats.damageByDomain??{};
  const multiplier=(m.combat.upgrades?.attack?factions[m.gathering.faction??'crown'].upgrades.attack.multiplier:1)*(domainDamage.land??1)*(u.kind==='soldier'?abilityEffects(m.gathering,u,delta).attackMultiplier*spellModifiers(u,delta).attack:1);
  let cooldown=Math.max(0,(u.attackCooldown??0)-(delta-step.attackSeconds)),time=step.attackSeconds,remainingHP=hp;
  if(!ranged)remainingHP=Math.max(0,hp-('damagePerSecond' in stats?stats.damagePerSecond??combatConfig.soldierDamagePerSecond:combatConfig.soldierDamagePerSecond)*time*multiplier);
  else while(remainingHP>0&&time>0&&time+1e-9>=cooldown){time=Math.max(0,time-cooldown);remainingHP=Math.max(0,remainingHP-ranged.damage*multiplier);cooldown=ranged.attackInterval;}
  if(remainingHP<hp)wildlife[animal.id]={hp:remainingHP,hurtAt:m.waves.elapsedSeconds,...(remainingHP===0?{deadAt:m.waves.elapsedSeconds}:{})};
  cooldown=Math.max(0,cooldown-time);return {...u,position:step.position,target:{...animal.position},navigation:step.navigation,...(ranged?{attackCooldown:cooldown}:{}),...(remainingHP===0?{order:{kind:'idle' as const},navigation:undefined,target:{...step.position}}:{})};
 };
 const units=m.gathering.units.map(u=>u.kind==='soldier'?apply(u) as Soldier:u),ships=m.navy?.ships.map(s=>apply(s) as Ship);
 const finish=(u:Soldier|Ship)=>u.order.kind==='hunt'&&wildlife[u.order.animalId]?.hp===0?{...u,order:{kind:'idle' as const},target:{...u.position},navigation:undefined}:u;
 return {...m,wildlife,gathering:{...m.gathering,units:units.map(u=>u.kind==='soldier'?finish(u) as Soldier:u)},...(m.navy?{navy:{...m.navy,ships:ships!.map(s=>finish(s) as Ship)}}:{})};
}
