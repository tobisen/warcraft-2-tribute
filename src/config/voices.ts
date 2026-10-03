/** Original dialogue; no recordings from commercial games and no remote voice service. */
export const voiceConfig={cooldownSeconds:2.5,rate:1.05,gain:.9};
export const voiceLines={
 worker:{select:['My hammer has seniority.','Payroll says I am essential.','Wood today, complaints tomorrow.'],order:['Tools out. Opinions later.','Another scenic commute.','I charge extra for splinters.']},
 soldier:{select:['Armor polished. Courage pending.','I brought the pointy argument.','Standing heroically is tiring.'],order:['Marching solves most meetings.','Diplomacy, with a sharp edge.','I will file a pointed objection.']},
 archer:{select:['The bow has strong opinions.','Please stand beyond my elbow.','Accuracy beats enthusiasm.'],order:['Taking the long-distance approach.','I prefer arguments from afar.','A little aim goes a long way.']},
 catapult:{select:['Subtlety weighs several tons.','I specialize in urgent deliveries.','Wheels checked. Brakes optional.'],order:['Sending a strongly worded boulder.','Rolling through the agenda.','Express delivery. No signature.']},
 transport:{select:['Passengers, mind the dramatic waves.','No refunds for wet boots.','The manifest says mostly heroes.'],order:['All aboard the questionable plan.','Scenic route, sea permitting.','Keeping the passengers approximately dry.']},
 warship:{select:['The cannon handles customer service.','Hull intact. Confidence inflated.','We take nautical disputes seriously.'],order:['Charting an explosive conversation.','The sea is our meeting room.','Turning broadside to the problem.']},
} as const;
export type VoiceRole=keyof typeof voiceLines;
export type VoiceAction='select'|'order';
