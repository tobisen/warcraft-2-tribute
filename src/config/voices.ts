/** Original dialogue; no recordings from commercial games and no remote voice service. */
export const voiceConfig={cooldownSeconds:2.5,rate:1.05,gain:.9};
const originalLines={
 worker:{select:['My hammer has seniority.','Payroll says I am essential.','Wood today, complaints tomorrow.'],order:['Tools out. Opinions later.','Another scenic commute.','I charge extra for splinters.']},
 soldier:{select:['Armor polished. Courage pending.','I brought the pointy argument.','Standing heroically is tiring.'],order:['Marching solves most meetings.','Diplomacy, with a sharp edge.','I will file a pointed objection.']},
 archer:{select:['The bow has strong opinions.','Please stand beyond my elbow.','Accuracy beats enthusiasm.'],order:['Taking the long-distance approach.','I prefer arguments from afar.','A little aim goes a long way.']},
 catapult:{select:['Subtlety weighs several tons.','I specialize in urgent deliveries.','Wheels checked. Brakes optional.'],order:['Sending a strongly worded boulder.','Rolling through the agenda.','Express delivery. No signature.']},
 transport:{select:['Passengers, mind the dramatic waves.','No refunds for wet boots.','The manifest says mostly heroes.'],order:['All aboard the questionable plan.','Scenic route, sea permitting.','Keeping the passengers approximately dry.']},
 warship:{select:['The cannon handles customer service.','Hull intact. Confidence inflated.','We take nautical disputes seriously.'],order:['Charting an explosive conversation.','The sea is our meeting room.','Turning broadside to the problem.']},
} as const;
export type VoiceRole=keyof typeof originalLines|'specialist';
export type VoiceAction='select'|'order'|'move'|'attack'|'work'|'repeat';
const activityLines:Record<VoiceRole,Record<'move'|'attack'|'work'|'repeat',readonly string[]>>={
 worker:{move:['The boots voted against this.','A scenic route to overtime.'],attack:['This was not in my contract.','The hammer has a second job.'],work:['Measure twice. Complain three times.','Splinters are our local currency.'],repeat:['Yes, I am still billable.','Every click adds a minute of paperwork.']},
 soldier:{move:['Heavy boots, light planning.','The shield gets the window seat.'],attack:['Presenting my steel rebuttal.','We tried the polite option.'],work:['Guarding the people with useful skills.','I am a very expensive fence.'],repeat:['The armor cannot nod any harder.','My attention is fully armored.']},
 archer:{move:['Mind the arrows on the way past.','Walking is bad for my aim.'],attack:['Special delivery, point first.','Let us settle this at a distance.'],work:['Keeping the worksite arrow-free.','The bow is supervising.'],repeat:['I heard you three arrows ago.','Repeated clicking does not improve accuracy.']},
 specialist:{move:['Expertise coming through.','My cape requires turning space.'],attack:['Time for the expensive solution.','Special training, ordinary paperwork.'],work:['Consulting is mostly standing nearby.','The specialist fee includes supervision.'],repeat:['Special does not mean endlessly available.','That consultation will be invoiced.']},
 catapult:{move:['Please allow a wide turning circle.','The wheels are holding a committee.'],attack:['One boulder, strongly expressed.','Your complaint is now airborne.'],work:['Waiting for load-bearing instructions.','I lift morale and large rocks.'],repeat:['The wheels heard the first click.','We do not offer faster shipping.']},
 transport:{move:['Next stop: drier socks.','The tide approved this route.'],attack:['I transport arguments, not win them.','Please use the armed boat.'],work:['Boarding passes, approximately.','Cargo first, heroic speeches later.'],repeat:['Please stop ringing the ships bell.','Your reservation is already confirmed.']},
 warship:{move:['All hands, mostly on deck.','Navigation by confident guessing.'],attack:['A broadside of customer feedback.','The cannon has the final word.'],work:['Keeping the harbor bureaucrats afloat.','Naval security, with dramatic hats.'],repeat:['The captain has acknowledged the bell.','That is enough nautical enthusiasm.']},
};
export const voiceLines={...originalLines,specialist:{select:['Expertise is expensive.','I brought the advanced argument.'],order:['A specialist solution, on its way.','Consulting with the sharp end.']}};
const factionRemarks={
 crown:{select:['For crown and lunch break.','Royal standards, ordinary wages.'],order:['The crown has approved the paperwork.'],move:['The kingdom is larger on foot.'],attack:['A royal objection.'],work:['By appointment to the payroll.'],repeat:['His Majesty only asked once.']},
 clans:{select:['Big muscles, small meetings.','The clan respects a loud answer.'],order:['Less talking, more doing.'],move:['Boots first. Plans later.'],attack:['Diplomacy is a sturdy axe.'],work:['A bigger hammer fixes most things.'],repeat:['Still here. Still loud.']},
 elves:{select:['Ancient wisdom, fresh complaints.','The trees are listening.'],order:['Elegance takes the scenic route.'],move:['Mind the centuries-old flowers.'],attack:['A very refined disagreement.'],work:['Sustainably annoyed.'],repeat:['Patience is not an endless resource.']},
 dwarves:{select:['Beard checked. Tools counted.','Short stature, long invoice.'],order:['A sound plan needs more rivets.'],move:['Uphill costs another ale.'],attack:['Solid steel, solid point.'],work:['Craftsmanship before lunchtime.'],repeat:['The beard heard you.']},
 goblins:{select:['Warranty void if victorious.','Innovation with optional insurance.'],order:['The prototype usually works.'],move:['Testing the portable version.'],attack:['An explosive peer review.'],work:['One more gear should fix it.'],repeat:['The button passed its stress test.']},
} as const;
/** Dialogue only. The local speech fallback is not a recorded voice asset. */
export function dialogue(role:VoiceRole,action:VoiceAction,faction:keyof typeof factionRemarks):readonly string[]{
 const base=action==='select'||action==='order'?voiceLines[role][action]:activityLines[role][action];
 return base.map((line,i)=>line+' '+factionRemarks[faction][action][i%factionRemarks[faction][action].length]);
}
