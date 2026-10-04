import type {FactionId} from './factions';
export const spellSlots=['heal','ward','hex'] as const;
export type SpellSlot=typeof spellSlots[number];
export const spellIds=['heal','ward','hex','rally','intimidate','renew','wither','mend','rune','overclock','corrode'] as const;
export type SpellId=typeof spellIds[number];
export interface SpellDefinition {name:string;kind:'heal'|'buff'|'debuff';targetTeam:'ally'|'enemy';targetType:'ground-combat';manaCost:number;range:number;cooldown:number;duration:number;healHP?:number;attackMultiplier?:number;defenseMultiplier?:number}
export const spells:Record<SpellId,SpellDefinition>={
 heal:{name:'Heal',kind:'heal',targetTeam:'ally',targetType:'ground-combat',manaCost:20,range:160,cooldown:6,duration:0,healHP:25},
 ward:{name:'Ward',kind:'buff',targetTeam:'ally',targetType:'ground-combat',manaCost:25,range:160,cooldown:8,duration:6,defenseMultiplier:.75},
 hex:{name:'Hex',kind:'debuff',targetTeam:'enemy',targetType:'ground-combat',manaCost:20,range:192,cooldown:8,duration:5,attackMultiplier:.75},
 rally:{name:'War Cry',kind:'buff',targetTeam:'ally',targetType:'ground-combat',manaCost:25,range:160,cooldown:10,duration:5,attackMultiplier:1.3},
 intimidate:{name:'Intimidate',kind:'debuff',targetTeam:'enemy',targetType:'ground-combat',manaCost:20,range:160,cooldown:10,duration:5,attackMultiplier:.7},
 renew:{name:'Renew',kind:'heal',targetTeam:'ally',targetType:'ground-combat',manaCost:25,range:192,cooldown:8,duration:0,healHP:30},
 wither:{name:'Wither',kind:'debuff',targetTeam:'enemy',targetType:'ground-combat',manaCost:25,range:224,cooldown:10,duration:4,attackMultiplier:.65},
 mend:{name:'Mend',kind:'heal',targetTeam:'ally',targetType:'ground-combat',manaCost:15,range:128,cooldown:8,duration:0,healHP:20},
 rune:{name:'Rune Shield',kind:'buff',targetTeam:'ally',targetType:'ground-combat',manaCost:30,range:160,cooldown:12,duration:6,defenseMultiplier:.6},
 overclock:{name:'Overclock',kind:'buff',targetTeam:'ally',targetType:'ground-combat',manaCost:25,range:160,cooldown:12,duration:5,attackMultiplier:1.4,defenseMultiplier:1.2},
 corrode:{name:'Corrode',kind:'debuff',targetTeam:'enemy',targetType:'ground-combat',manaCost:20,range:192,cooldown:10,duration:5,defenseMultiplier:1.25},
};
export const factionSpells:Record<FactionId,readonly SpellId[]>={crown:['heal','ward','hex'],clans:['rally','intimidate'],elves:['renew','wither'],dwarves:['mend','rune'],goblins:['overclock','corrode']};
export const spellDefinition=(id:SpellId,_faction:FactionId):SpellDefinition=>spells[id];
export function spellForSlot(faction:FactionId,slot:SpellSlot):SpellId|undefined{return factionSpells[faction].find(id=>spells[id].kind===(slot==='heal'?'heal':slot==='ward'?'buff':'debuff'));}
export function spellDescription(id:SpellId,faction:FactionId):string{const c=spellDefinition(id,faction);return c.kind==='heal'?`Restore ${c.healHP} HP`:['Attack '+(c.attackMultiplier??1)+'×','Incoming damage '+(c.defenseMultiplier??1)+'×',`${c.duration}s; replaces same effect channel`].join(' · ');}
export const spellAIConfig={decisionSeconds:.5,healBelowFraction:.7,refreshBelowSeconds:1,engagementRange:192};
