import type {FactionId} from './factions';
/** Based on the implemented recipes and abilities, not artwork lore. */
export const factionDescriptions:Record<FactionId,string>={
 crown:'A balanced army with sturdy buildings and defensive melee troops. Banner Guards and Plate Craft reward a protected formation; the roster has fewer speed advantages than Orcs or Elves.',
 clans:'Fast, aggressive melee troops and Raiders. Fury raises outgoing damage for short assaults. Hunters have shorter range, so close the distance and support the front line.',
 elves:'Long-range bows, quick Marksmen and True Shot favor scouting and careful positioning. Lighter troops and buildings need protection from close assaults.',
 dwarves:'Durable infantry, Bulwarks, strong buildings and armored ships. Brace supports holding ground. Slower units and ships make repositioning and pursuit harder.',
 goblins:'Low-cost structures, Grenadier splash and aggressive Overcharge favor raids and mixed firepower. Fragile units and buildings are vulnerable; Overcharge also increases incoming damage.',
};
