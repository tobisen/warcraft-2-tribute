import type {MatchState} from './match';
export interface StatLedger {player:{built:number;destroyed:number;removed:number};enemy:{built:number;destroyed:number;removed:number};playerBaseLost:boolean;legacy:boolean}
export const createStatLedger=(legacy=false):StatLedger=>({player:{built:0,destroyed:0,removed:0},enemy:{built:0,destroyed:0,removed:0},playerBaseLost:false,legacy});
/** Starting bases do not count as construction. Completed sites count before combat. */
export function readyBuildings(m:MatchState):{player:Set<string>;enemy:Set<string>} {
 const p=m.placement;
 return {player:new Set([...(p.bases??[]).filter(b=>b.hp>0&&b.construction.remainingSeconds===0).map(b=>b.id),
  ...(p.barracks&&(p.barracksHP??1)>0&&p.construction?.remainingSeconds===0?['barracks']:[]),
  ...(p.forge&&p.forge.hp>0&&p.forge.construction.remainingSeconds===0?['forge']:[]),
  ...(p.defenses??[]).filter(t=>t.hp>0&&t.construction.remainingSeconds===0).map(t=>t.id),
  ...(p.farms??[]).filter(f=>(f.hp??1)>0&&f.construction.remainingSeconds===0).map(f=>f.id),
  ...(m.navy?.harbor&&m.navy.harbor.hp>0&&m.navy.harbor.construction.remainingSeconds===0?['harbor']:[]),
 ]),enemy:new Set(m.combat.enemies.filter(e=>e.buildingType&&e.hp>0&&e.construction?.remainingSeconds===0).map(e=>e.id))};
}
export function recordCompletions(before:ReturnType<typeof readyBuildings>,m:MatchState):StatLedger {
 const ledger=m.statLedger??createStatLedger(true),after=readyBuildings(m);
 return {...ledger,player:{...ledger.player,built:ledger.player.built+[...after.player].filter(id=>!before.player.has(id)).length},enemy:{...ledger.enemy,built:ledger.enemy.built+[...after.enemy].filter(id=>!before.enemy.has(id)).length}};
}
export function recordBuildingDeaths(m:MatchState,playerSites:number,enemySites:number):StatLedger|undefined {
 const base=m.combat.baseHP<=0&&!m.statLedger?.playerBaseLost;
 if(!playerSites&&!enemySites&&!base)return m.statLedger;
 const ledger=m.statLedger??createStatLedger(true);
 return {...ledger,playerBaseLost:ledger.playerBaseLost||base,player:{...ledger.player,destroyed:ledger.player.destroyed+playerSites+Number(base)},enemy:{...ledger.enemy,destroyed:ledger.enemy.destroyed+enemySites}};
}
