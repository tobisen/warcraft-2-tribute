# PRIO-04 — interactive woodland animals

Existing original deer/rabbit/fox pixels and absolute-time wandering are retained.
No external game sprite or recording is imported. `config/wildlife.ts` defines
neutral names/HP. Sparse `MatchState.wildlife` saves only HP and hit/death times;
positions still come from the original habitat and saved gameplay clock.

Visible sprites use a32×32 click rectangle aligned to the existing(.5,.75)
anchor, including heads. Inspection preserves marked troops. Hunting uses the
ordinary combat approach, faction weapon/upgrade/ability/spell stats and cooldowns;
warships reuse the existing marine firing-position and occlusion logic.
Transports/workers keep their orders. Shift supports queued hunts; ordinary
orders/Stop replace them. Hidden, dead or unreachable targets end the hunt.
Animals never become enemy entities, economy entries, blockers, minimap markers
or vision observers. Neutral ranged hits apply profile damage directly, with
attack animation/impact flash; animal projectiles and loot are outside this task.
Corpse pose/cross fades after1.5 gameplay seconds. Save47 migrates46 without
altering the wander clock, and restart restores full HP.

`export-wildlife-audio.py` composes three original stylized mono24kHz/16bit PCM
calls. Masters live in assets/audio, identical runtime WAVs in public/audio.
`wildlife-manifest.json` records provenance/format/duration. Run the standalone
export with Python standard library; `npm run audio:export` also includes it
(after the existing exporter, whose optional soundfile dependency remains).
The project artwork/audio usage license applies. The engine uses these WAVs
directly, the existing effect mix/master/mute/pause, a1s per-species limit and
an additional0.8s shared animal limit to prevent alternating-click spam.

Technical PCM/mixer/browser checks prove files/routing/rate limit, not listening.
Actual listening was requested with all three reviewable WAV links and remains
pending until the user reports listening. PRIO-04 is not Done on technical
checks alone. See BACKLOG/DEV_LOG/HANDOFF for current verification/status.
