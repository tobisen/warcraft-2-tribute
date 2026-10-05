# RTS-177 — Expanded campaign design

## Mandate and evidence

This is the exact implementation specification for RTS-178: retain all eight
mission IDs and their faction pairings; keep First Steps as the short tutorial;
expand the other seven missions. Completion IDs, unlock order and replay survive.
Normal durations below are **design estimates**, not measured play time. RTS-179
must separate automated completion, browser inspection and human play testing.
The user's October 5 clarification permits estimates in RTS-177; it supersedes
the older backlog wording requiring measured duration at the design stage.

Inventory: First Steps already teaches six actions without pressure. Forest Watch
currently has only three waves; The Siege only destroys a base; The Outpost lasts
90 seconds. The Crossing requires transport but only one terminal goal. Ridge
Convoy, Valley Rescue and Coastal Banner have authored guards and zones, but no
staged preparation or expansion. All eight need clearer sequencing; the tutorial
needs no artificial lengthening. Existing gameplay evidence is historical and is
not evidence for the expanded missions.

## Shared rules

New campaign starts use a versioned phase state; old saves without it retain the
original mission. Standalone scenarios retain their maps and objectives. New
Forest Watch and The Outpost use Frontier Valley; The Siege uses Highland
Crossroads. Other maps remain Arena, Islands, Highlands, Frontier and Coast.
Frontier uses the approved reference terrain; the other maps retain their
existing assets and terrain. No copied reference background or new map editor.

Initial banks remain the existing scenario banks listed below. Beginner tuning
belongs to RTS-179, using existing difficulty rules and mission-specific pressure
where verification shows a need. Costs, HP, supply, technology and resources remain
real and finite. No gifted armies or recurring free income. Expansion means
securing remote resources and forward positions: player resource depots are not
implemented, so workers still deliver to the original base. Do not imply otherwise.

Preparation goals use living owned units/buildings, including passengers where
appropriate. Exploration requires actual player exploration, not hidden enemy
state. Remote-resource goals require discovery of the authored grove and mine;
collecting them remains a tactical choice, avoiding an objective that becomes
impossible when either side exhausts a finite node. Clearing objectives use stable
IDs and count dead/missing guards as cleared. No resurrections on load.

Each completed phase is permanent. Its transition fires once and is saved; a
transition may introduce only its explicitly specified finite threat. No endless
waves. Pre-cleared terminal targets remain completable when their phase arrives.
Losing the player's base has priority over victory. Losing the named courier is
an immediate defeat even before the escort phase, including a lost transport.
Other own casualties are recoverable through paid production. Destroyed required
buildings can be rebuilt. Final victory occurs only after all mission phases;
legacy wave/timer victory must not end an expanded mission early.

There are no controllable allied or neutral military actors in this specification.
The rescue camp and banner are objective markers; rescue grants no units. Wildlife
retains existing neutral hunt rules. All combatants use the existing central
ownership/relations rules. Campaign objectives take precedence over generic team
elimination; skirmish team rules remain unchanged. No campaign team configurator
is introduced. Coordinates in briefings describe known authored destinations;
live enemies and marker visibility still obey fog.

## Exact missions

| ID / role | Start | Normal estimate | Ordered goals and transition rules |
| --- | --- | --- | --- |
| first-steps / Humans learn command; Orc practice target | Arena, 40 wood / 10 gold; no pressure | 5–12 min | Existing select, move, deliver wood, build Barracks, train Guard, manual attack sequence. Existing tutorial completion/defeat. |
| forest-watch / Orcs protect a forest route from Human raiders | Frontier, 20 / 10 | 20–30 min | Build a War Hut and field two living land combatants; scout the eastern grove and mine (1216,896 and 1184,640); repel the existing three finite waves; return a living combatant to the eastern crossing (1088,640). No new repeat waves. |
| the-siege / Elves remove a Goblin stronghold | Highlands, 20 / 10 | 25–40 min | Build a Ranger Lodge and field two land combatants; discover the western expansion grove and mine (960,736 and 896,864); bring a combatant through the northern pass (1504,544); destroy the actual northeastern enemy base. Existing paid AI provides pressure and may recover while its base lives. |
| the-outpost / Dwarves establish a forward defensive position | Frontier, 40 / 10 | 20–30 min | Build a Guard Hall and field two land combatants; scout the eastern grove and mine; defeat the existing three finite raider groups; occupy the crossing (1088,640) with a living combatant. Replace the 90-second terminal wait with these completed goals; no HP inflation. |
| the-crossing / Goblins conduct a naval landing against Humans | Islands, 20 / 10 | 20–35 min | Build a Scrap Yard and field two land combatants; build a Junk Dock and a living Junk Ferry; land a living combatant on the eastern island (960,480); destroy the actual Human base. Transport loss permits rebuilding; embarked passengers do not count as landed. Existing paid naval AI remains. |
| ridge-convoy / Orcs escort a courier through Dwarf-held mountains | Highlands, 40 / 20; named courier and two guards | 20–35 min | Build a War Hut and field two land combatants; discover the western expansion grove and mine; defeat both named pass guards; escort the living Ridge Courier into the existing safe zone (1504,544). Courier loss immediately defeats the mission. |
| valley-rescue / Elves free a camp held by Orcs | Frontier, 40 / 20; two named guards | 20–30 min | Build a Ranger Lodge and field two land combatants; discover the eastern grove and mine; defeat both named camp guards; bring a living land combatant to the existing rescue camp (1088,640). Camp is a noncombat marker, not a reward army. |
| coastal-banner / Humans seize a Dwarf-held coast | Coast, 60 / 30; two named guards | 25–40 min | Build Barracks and field two land combatants; build Harbor and a living Transport; discover the eastern coastal grove and mine (1600,300 and 1728,448); clear the named banner guards; hold the existing banner zone (1600,384) for 30 uninterrupted gameplay seconds. Only living unembarked land combatants hold it; absence or hostile contest resets the timer. |

RTS-178 targeted playthrough correction: the two finite-wave missions reuse
existing counts and intervals, starting the finite schedule once preparation and
exploration are complete. The start timestamp persists; loading cannot replay it.
This avoids wiping the new economy before its preparation goals can be achieved.
No wave waits are added to achieve a duration.
Consequently their duration estimates carry particular risk: human testing may
show that they are much shorter than 20 minutes. Record that honestly rather than
pad the clock or label a fast simulation as measured Normal play time.

## English briefings and objective feedback

First Steps retains its current briefing. Expanded briefings must state the
ordered goals, actual faction names, map, base-loss rule and mission-specific loss
rule. Use the following narrative introductions, followed by the concrete goals
above, in the existing campaign menu:

- Forest Watch: “Secure the forest route. Prepare an escort, scout the eastern resources, repel the raiders and secure the crossing.”
- The Siege: “Break the mountain stronghold. Establish your army, scout the western resources, cross the northern pass and destroy the Goblin base.”
- The Outpost: “Open a forward route through the valley. Prepare defenders, scout the eastern resources, defeat the raiders and occupy the crossing.”
- The Crossing: “Take the far shore. Prepare troops, pay for a dock and ferry, land on the eastern island and destroy the Human base.”
- Ridge Convoy: “Bring Ridge Courier safely through the pass. Prepare an escort, scout the western resources, clear both guards and escort the courier to safety.”
- Valley Rescue: “Reach the occupied camp. Prepare your army, scout the eastern resources, clear both camp guards and bring a combatant into the camp.”
- Coastal Banner: “Secure the coastal banner. Prepare troops and transport, scout the eastern coastal resources, clear the guards and hold the banner uncontested.”

The match HUD displays phase number / total, current English objective and
completed-step feedback when it advances. No enemy positions or stock amounts are
revealed through the HUD. Zone markers keep the existing exploration visibility
rule. Final results keep the existing debrief, statistics, replay and menu flow.

## RTS-178 verification contract

Target every mission on fresh start, each phase transition and final victory;
verify defeat priority, dead/missing guards, rebuilding and courier loss in cargo.
Save/load at phase boundaries and during banner hold; resume without replaying
transitions, skipping goals or reverting maps. Reject malformed/out-of-range phase
state. Preserve legacy campaign saves and progress. Check current objectives and
transitions in the browser at native 800×600 and a larger viewport. RTS-179 adds
Beginner/Normal completion and presentation review; broad campaign regression
runs together once campaign changes are finished. Human duration, difficulty and
fun remain unverified until actual human play testing.

## RTS-179 review outcome

All eight missions complete in paid automated Beginner and Normal scenarios,
including phase saves and real landings. This does not verify the estimated
human duration or perceived difficulty. Human play testing remains, particularly
the finite-wave missions'20–40-minute design targets. Native800/1280 campaign UI
and actual audio asset loading/pause reviewed; no new listening claim. A bounded
fog union optimization improves measured64/128-unit Highlands stress performance
without changing visibility rules. See QUALITY_REVIEW.md and artifacts/rts-179.


## RTS-185 — Separata rasexpeditioner

Den gamla blandade serien och äldre saves behålls som legacy. Nya kampanjer använder åtta befintliga operationer/kartor och utökas med rasens egna taktiska mål i `src/config/campaignSeries.ts`. Varje serie har stabilt campaign-ID, egen berättelse och samma ras genom hela serien.

| Ras | Serie | Motståndare | Taktisk inriktning |
|---|---|---|---|
| Human | The Broken Oath | Orcs | Försvarsforskning, liten balanserad expedition |
| Orcs | Road of the Exiles | Human | Attackforskning, fler melee/specialist/siege |
| Elves | The Severed Roots | Goblins | Attackforskning, fler ranged/specialist/air |
| Dwarves | The Stone Road | Goblins | Försvarsforskning, fler durable escort/siege/warships |
| Goblins | The Last Contract | Dwarves | Attackforskning, större första warband/fleet/siege/air |

Varje mission får ett faktiskt observerat krav på levande trupper, färdig forskning eller fartyg. Kraven är permanenta fasövergångar och ersätter inte kartans base/waves/escort/rescue/capture-mål. Alla krav framgår av briefing och fas-HUD. Progression är separat för kampanj/ras/svårighet. Gamla uppdrags-ID:n saknar ras/difficulty och ger därför inga nya upplåsningar. Nya saves bevarar alla tre identitetsdelar; äldre fortsätter legacy-regler. Mänsklig tempo-/balansgranskning återstår.186 tillför missionvis innehållsplan och menyflöde.
