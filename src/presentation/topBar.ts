import {matchPopulation} from '../gameplay/navy';
import type {MatchState} from '../gameplay/match';
/** Spendable player bank only. Cargo, resource nodes and enemy state are never exposed. */
export function topBarLabels(match:MatchState){
 const population=matchPopulation(match);
 return {gold:`Gold ${Math.floor(match.gathering.goldBalance??0)}`,wood:`Wood ${Math.floor(match.gathering.wood)}`,population:`Population ${population.used} / ${population.cap}`,reserved:population.reserved?` (+${population.reserved} queued)`:''};
}
export function renderTopBar(match:MatchState):void{
 const labels=topBarLabels(match);
 document.getElementById('top-gold')!.textContent=labels.gold;document.getElementById('top-wood')!.textContent=labels.wood;document.getElementById('top-population')!.textContent=labels.population+labels.reserved;
}
