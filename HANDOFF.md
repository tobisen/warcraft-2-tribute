# Överlämning efter RTS-164

Datum 2026-10-04. Användarens uppdrag RTS-160–164 avslutas här. Nästa task är RTS-165 (Todo); starta den bara med nytt mandat. En task i taget, ingen agentdelegering. RTS-159 är Done enligt användaren och faktisk djur-/dekorationsimplementation har inventerats.

## Leverans

| Task | Resultat | Commit |
| --- | --- | --- |
| RTS-160 | Done: tre visuella basnivåer, kostnad/tid, produktionen pausar under uppgradering; kö/selection/save/load bevaras. | `7d7290c`, pushad |
| RTS-161 | Done: gemensamma prerequisites för byggnader/enheter/research, tech tree och konkreta låsskäl. | `b7439ae`, pushad |
| RTS-162 | Done: byggbara torn, synligt målval, projektiler, nivå2 och AI-targeting. | `4658a0d`, pushad |
| RTS-163 | Done: murar/portar, ägarstyrd passage, säker placering/stängning, navigation/save/load. | `efbdd7d`, pushad |
| RTS-164 | Done: reparation och siege-counter, browser/riktade tester och slutchecks verifierade. | Committen som innehåller denna överlämning; hash/push i slutrapport |

## Beteende och verifieringsunderlag

- RTS-160: bas1→2 kostar80wood/60gold och20s,2→3 kostar120/100 och30s. Endast workerproduktion i huvudbyggnaden pausar. HP/footprint oförändrade. Riktade40 PASS; unit444/80 och build med strict typecheck PASS.
- RTS-161: befintliga fraktionsdefinitioner används. Accepterade jobb fortsätter efter förlorade prerequisites. Riktade20 PASS; unit445/80/build PASS.
- RTS-162: torn50wood/20gold,160HP,8s; grundräckvidd176 och10skada/1.2s. Nivå2 kräver bas2+Forge, kostar40/30 och10s,16skada. Slutlig räckvidd192 efter164. Riktade58/7 PASS; unit445/80/build PASS.
- RTS-163: mur10wood/180HP/3s, port30wood+5gold/240HP/5s. Max 32 fortifications. X öppnar/stänger; öppen passage är för egna laget. Enhetskroppar, obligatoriska spawn-/leveransvägar och allas land-connectivity skyddas. Cache för motståndarens navigation härleds efter Load. Riktade81/9 PASS; unit445/80/build PASS.
- RTS-164:4HP/s per worker,0.5wood+0.1gold per återställd HP, max tre aktiva workers per byggnad. Z/Repair eller högerklick. Extra workers väntar utan kostnad. Avbrott/full HP/förstörd byggnad/tom bank hanteras; cargo/selection och order i Save bevaras. Siege1.5× endast mot tower/wall/gate och alla fem siege-profiler outrangar nivå2-torn. Riktade77/8 PASS.
- Save config37 migrerar tidigare36 och hela äldre kedjan. Befintlig lokal slot/schema2 behålls. Äldre projektiler utan försvarsbonus har ursprunglig skada.
- Faktisk Chromium native800×600 och1280×720 för varje task. Fysiska selection-, action-, placement-, queue-, gate-, movement- och Save/Load-flöden testade för berörd task. Screenshots visuellt granskade; script/report/bilder finns i [artifacts/rts-160](artifacts/rts-160), [rts-161](artifacts/rts-161), [rts-162](artifacts/rts-162), [rts-163](artifacts/rts-163), [rts-164](artifacts/rts-164). Kontrollskript i scripts/check-base-upgrade.mjs, check-tech-tree.mjs, check-towers.mjs, check-gates.mjs och check-repair.mjs. Extern Playwright/Chromium krävs; miljövariabler anges i skripten.
- RTS-164 browser: fysisk Repair/Stop, animation/kostnad, lokal Save/Load och full HP; kontrollerad siege-match med faktisk fog/projektiler och befintlig outpost som spotter. Noll pageerrors. Detta är inte ett mänskligt helmatchspeltest.

## Slutchecks

Unit445/80 och build inklusive strict typecheck PASS på slutlig kod. Första fulla regressionen hade två tidsgränsfel: onödig AI-bygg-BFS från portintegrationen begränsades till öppna portar. Strict fixture-typing rättades också. Riktad omkontroll46/5 och ny browser gates/repair800/1280 PASS; inga testtidsgränser höjdes. Slutlig full regression1193tester/155filer PASS. git diff --check och lokala Markdownlänkar PASS. Full regression körs en gång vid etappgränsen eftersom ekonomi, AI, navigation och strid påverkas. Ingen ny CI-/Pages-publicering verifieras här.

## Kvar och begränsningar

- Huvudbyggnadsnivåer/torn/murar/portar använder egna pixelkompositioner av befintliga godkända fraktionsdelar. Separata godkända referensbilder för de nya försvarsbyggnaderna/nivåerna saknas. Browsergranskningen bekräftar lokal läsbarhet; den innebär inte ett nytt användargodkännande av stilen.
- RTS-155 landassets är implementerade; separat warship/transport/harbor-referens för fem raser saknas. Se [spriteinventeringen](assets/sources/remaining-sprites.md). Befintliga sjöassets återanvänds.
- RTS-157 är fortsatt In Progress: faktisk ljudlyssning saknas. Se [attackljud](assets/sources/attack-audio.md) och [lokalt stridsklipp](artifacts/rts-157/battle-preview.wav).
- RTS-158 är fortsatt In Progress: 380 inspelningar/licensposter saknas. Repliktexter/routing och lokal speech-fallback är inte inspelade röster. Se [manus](assets/sources/voice-recording-script.json) och [begränsningar](assets/sources/unit-voices-158.md).
- Försvarsbalansen är riktat testad för fem siege-profiler, inte mänskligt helmatchbalanserad. Elf-counter tar längre tid mot tre repairers.
- Befintlig bundlevarning kvar. Produktversion 0.2.0. Ingen ny fysisk ljudlyssning eller CI-/Pages-build granskad.
- Användarens ändrade src/style.css är byte-identisk med etappstart; otrackade docs/ bevaras utanför våra commits. Lokal devserver startad på http://127.0.0.1:5182/.

Stanna efter RTS-164. RTS-165–180 är inte påbörjade i denna körning.
