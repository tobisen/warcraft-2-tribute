import type {MapId} from '../../config/maps';
import {createMatch,type MatchState} from '../match';
import {bodyFits} from '../map';
import {combatUnitStats} from '../../config/unit';
import type {Soldier,Worker} from '../gathering';

/** Explicit load fixture: extra units/HP, beyond supply; never a paid playthrough. */
export function createLoadFixture(total:64|128,map:MapId='arena'):MatchState {
  const match=createMatch('skirmish','easy',undefined,map);
  match.combat.enemies=match.combat.enemies.filter(e=>e.kind!=='worker');
  match.enemyProduction!.wood=0;
  match.enemyProduction!.gold=0;
  const workers:Worker[]=Array.from({length:8},(_,i)=>({
    kind:'worker',owner:'player',id:`unit-${i+1}`,hp:10000,selected:false,cargo:0,
    position:{x:500+i%4*32,y:220+Math.floor(i/4)*32},target:{...match.gathering.node.position},
    order:{kind:'gather',nodeId:match.gathering.node.id},
  }));
  const soldiers:Soldier[]=[];
  for(let row=0;soldiers.length<total-20&&row<16;row++)for(let column=0;column<14&&soldiers.length<total-20;column++){
    const i=soldiers.length,archetype=i%8===0?'catapult':i%3===0?'archer':undefined;
    const position={x:240+column*40,y:280+row*40};
    if(!bodyFits(match.map,position,combatUnitStats({archetype}).size/2))continue;
    soldiers.push({kind:'soldier',owner:'player',archetype,id:`unit-${i+9}`,hp:10000,cargo:0,selected:false,
      position,target:{x:740,y:300},order:{kind:'attack',enemyId:`load-enemy-${i%12}`}});
  }
  match.gathering.units=[...workers,...soldiers];
  match.production.nextUnitNumber=match.soldierProduction.nextUnitNumber=match.gathering.units.length+1;
  match.combat.enemies.push(...Array.from({length:12},(_,i)=>({
    id:`load-enemy-${i}`,kind:'unit' as const,owner:'enemy' as const,hp:10000,
    position:{x:720+i%4*28,y:300+Math.floor(i/4)*28},
    order:{kind:'attack-move' as const,destination:{...match.gathering.base}},
  })));
  return match;
}

/** Explicit naval stress fixture: injected hulls/HP above supply, never a paid-match claim. */
export function createNavalLoadFixture(total:64|128):MatchState {
 const match=createMatch('skirmish','easy',undefined,'islands');
 delete match.enemyNaval;delete match.enemyProduction;delete match.enemyAI;delete match.enemyConstruction;delete match.enemyPolicy;delete match.enemyRecovery;delete match.enemyKnowledge;
 const fleet=total/2,land=total-fleet-12;
 match.gathering.units=Array.from({length:land},(_,i)=>({kind:'soldier' as const,owner:'player' as const,id:`unit-${i+4}`,hp:10000,cargo:0,selected:false,position:{x:96+i%10*48,y:560+Math.floor(i/10)*40},target:{x:96+i%10*48,y:560+Math.floor(i/10)*40},order:{kind:'idle' as const}}));
 match.production.nextUnitNumber=match.soldierProduction.nextUnitNumber=land+4;
 match.combat.enemies=match.combat.enemies.filter(e=>e.kind==='base');
 match.combat.enemies.push(...Array.from({length:12},(_,i)=>({id:`load-naval-enemy-${i}`,kind:'ship' as const,owner:'enemy' as const,hp:10000,position:{x:880,y:112+i*64},order:{kind:'idle' as const}})));
 match.navy={harbor:null,production:{remainingSeconds:null,nextUnitNumber:fleet+1},ships:Array.from({length:fleet},(_,i)=>{const position={x:720+i%4*40,y:112+Math.floor(i/4)*44};return {id:`ship-${i+1}`,kind:'ship' as const,owner:'player' as const,role:i%4===0?'transport' as const:'warship' as const,hp:10000,selected:false,position,target:{...position},order:i%4===0?{kind:'idle' as const}:{kind:'attack' as const,enemyId:`load-naval-enemy-${Math.floor(i/4)%12}`}};})};
 return match;
}
