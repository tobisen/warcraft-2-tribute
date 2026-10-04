import type {FactionId} from './factions';
export interface ManaDefinition {max:number;initial:number;regenerationPerSecond:number;role:string}
/** Existing specialists keep their identities, combat recipes and approved art. */
export const manaConfig:Record<FactionId,ManaDefinition>={
 crown:{max:100,initial:60,regenerationPerSecond:1,role:'Protective support'},
 clans:{max:80,initial:40,regenerationPerSecond:1,role:'Offensive battle magic'},
 elves:{max:120,initial:60,regenerationPerSecond:1.25,role:'Ranged woodland control'},
 dwarves:{max:100,initial:50,regenerationPerSecond:.8,role:'Defensive rune support'},
 goblins:{max:80,initial:40,regenerationPerSecond:1,role:'Alchemical disruption'},
};
