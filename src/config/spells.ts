import type {FactionId} from './factions';
export const spellIds=['heal','ward','hex'] as const;
export type SpellId=typeof spellIds[number];
export interface SpellDefinition {name:string;kind:'heal'|'buff'|'debuff';targetTeam:'ally'|'enemy';targetType:'ground-combat';manaCost:number;range:number;cooldown:number;duration:number;healHP?:number;attackMultiplier?:number;defenseMultiplier?:number}
export const spells:Record<SpellId,SpellDefinition>={
 heal:{name:'Heal',kind:'heal',targetTeam:'ally',targetType:'ground-combat',manaCost:20,range:160,cooldown:6,duration:0,healHP:25},
 ward:{name:'Ward',kind:'buff',targetTeam:'ally',targetType:'ground-combat',manaCost:25,range:160,cooldown:8,duration:6,defenseMultiplier:.75},
 hex:{name:'Hex',kind:'debuff',targetTeam:'enemy',targetType:'ground-combat',manaCost:20,range:192,cooldown:8,duration:5,attackMultiplier:.75},
};
export const spellDefinition=(id:SpellId,_faction:FactionId):SpellDefinition=>spells[id];
