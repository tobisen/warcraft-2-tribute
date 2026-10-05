# RTS-180 — Public release verification

Observed version **v0.3.0**, tooltip **Build 6a96227**, on
[GitHub Pages](https://tobisen.github.io/warcraft-2-tribute/).
[Release code](https://github.com/tobisen/warcraft-2-tribute/commit/6a96227) and
[CI / Pages run](https://github.com/tobisen/warcraft-2-tribute/actions/runs/37355621323).

Actual headless Chrome against the public production page; four isolated browser
contexts. The external test script instruments the downloaded Phaser bootstrap
only to inspect state and introduce explicit terminal fixtures. No debug API or
fixture is shipped. Completed-phase victory, base elimination and spectator/team
defeat are fixtures; paid mission completion is separately recorded in RTS-179.

|Window|Rendering resolution|Mode|Physical app size|Loaded asset URLs|Audio files|Result|
|---|---|---|---|---|---|---|
|800×600|800x600|native|800×600|34|18|PASS|
|1280×720|1280x720|native|1280×720|34|18|PASS|
|1600×900|800x600|native|800×600|34|18|PASS|
|1600×900|800x600|fit|1200×900|34|18|PASS|

Physical menu → campaign start → paused Save/load → completed-phase victory →
result → Play Again → quit/menu; standalone skirmish defeat and a human+AI team
spectator Save/load followed by team defeat/statistics. Restart clears campaign
phase; Main Menu clears live multiplayer state. Paused and completed simulation
remain frozen. Campaign result on the moved Frontier map writes exactly one
actual highscore entry for its match ID, including after repeated result refresh.

All six rendering resolutions were selected in the1280 case. Fullscreen entered
and exited through the physical button, preserving resolution/mode. Native Size
and Fit preserve aspect ratio and expected scale; map canvas dimensions match its
client viewport while the full resolution includes HUD. Minimap is visible.

Both home and match top bar show the expected release/build. Changelog loads.
Sprites/terrain and18 audio files load under the existing project base with no
HTTP or page errors. Reload retains version and display settings. Screenshots
were captured locally for visual inspection; this Markdown preserves measured
results without triggering another Pages build for binary evidence files.

This is browser/technical verification, not human play duration, perceived
balance, subjective audio listening or a general hardware/performance guarantee.
Temporary flyer art, remaining voices and broader human testing remain listed in
HANDOFF.md and QUALITY_REVIEW.md. User-local CSS/docs are excluded from release;
this check uses the actual published committed CSS.
