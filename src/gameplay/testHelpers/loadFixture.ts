import {createMatch,type MatchState} from '../match';
import {bodyFits} from '../map';
import {combatUnitStats} from '../../config/unit';
import type {Soldier,Worker} from '../gathering';

/** Explicit load fixture: extra units/HP, beyond supply; never a paid playthrough. */
export function createLoadFixture(total:64|128):MatchState {
  const match=createMatch('skirmish','easy');
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
