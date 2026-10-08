export const armyRoles=['soldier','archer','catapult','ballista','specialist','air','cavalry','healer','giant','scout'] as const;
export type ArmyRole=typeof armyRoles[number];
export const combinedArmyConfig={decisionSeconds:1,groupSize:6,musterTimeout:30,retreatAfterSeconds:10,blockedAfterSeconds:5,weights:{ballista:1,soldier:3,archer:2,catapult:1,specialist:1,air:1,cavalry:1,healer:1,giant:1,scout:1}};
