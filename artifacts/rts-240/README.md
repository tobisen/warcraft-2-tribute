# RTS-240 — teknisk verifiering och återstående lyssning

90 egna nya repliker,18 per ras, för worker/soldier/archer och
selection/humor/move. Fem varianter för dessa cues, tre för övriga;
405 aktiva lokala WAVs. Tidigare315 entries och630 master/runtimefiler
kontrollerades byte-identiska mot RTS-239/HEAD före denna task.

Offlineauthoring:

- `generate-unit-voices.py --model-dir /private/tmp/w2t-voice-model --only-missing`:90 baser/58.3s.
- De90 nya baserna kopierades till den befintliga tillfälliga basmappen.
- `convert-character-voices.py --checkout /private/tmp/w2t-openvoice --model-dir /private/tmp/w2t-openvoice-model --base-dir /private/tmp/w2t-kokoro-base --only-new`:72 nya non-human filer/26.7s;252 äldre konverteringar bevarades.
- `python3 scripts/export-voice-manifest.py`:405 WAVs,0 missing inom tre roller.

Externa redan tillgängliga modeller/venv är authoringverktyg, inga nya
runtime-dependencies. Per-file hashes, text, källor, licenser och processing
finns i assets/sources/audio-identity/{all-factions-voices,generated-voices,
converted-voices}.json. Dwarf-adaptationer behåller CC-BY-SA-3.0, totalt81.
Nya mono PCM16-filer:peak0.528–0.750, ingen digital clipping. Detta säger
inte att talets klang eller tydlighet är bra.

[Browserprotokollet](browser.json) kördes med scripts/check-recorded-voices.mjs
mot lokal Vite på5189 och extern Playwright/Google Chrome. Det läser public
WAV-filer direkt utan kandidat-routes/tysta buffertar. Fem raser: fysisk
selection/snabbklick/draggrupp, en grupporder-speaker,18 nya filvarianter/ras,
fysisk order som avbryter aktiv humor, mute/master/voices/SFX-duck/pause/reset
samt faktisk scene-restart. Återkörningen kompletterade fysisk gruppmarkering;
första passerade protokollet använde direkt gruppval innan fysisk grupporder.

**Ingen faktisk agentlyssning eller mänsklig kvalitetsbedömning har genomförts.**
Browsern verifierar decoding/uppspelningsstart och routing i headless-läge;
den ersätter inte hörbar provlyssning. [Lyssningssidan](listen.html) har25
representativa nya klipp. Öppna `/artifacts/rts-240/listen.html` via Vite för
hörbar granskning av uttal, nivå, rasidentitet och humor. Bedöm även ordinarie
matchmix innan dessa nya90 kallas kvalitetsgodkända.

Specialist/siege/transport/warship och övriga rosterroller har fortsatt inte
egna kompletta inspelningspaket. Deras manus eller silent fallback räknas
inte som inspelningar. Ingen ny release/CI/Pages-verifiering hävdas.
