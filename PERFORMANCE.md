# Prestanda – RTS-065

Mätmiljö: MacBook Air, macOS 15.7.4 arm64, Node 20.20/npm 10.8.2,
Chromium 147.0.7727.15 headless. Lokal Vite production-build med native
800×600 canvas i 1280×900 desktop. CPU/GPU-modell och total process/GPU-minne
har inte mätts; resultaten är denna miljös observationer, ingen allmän FPS-garanti.

## Belastning och budget

[Belastningsfixture](src/gameplay/testHelpers/loadFixture.ts) har 8 gather-workers,
44 respektive 108 soldier/archer/catapult och 12 enemies: totalt 64/128 rörliga
kroppar, plus fast enemy base. Fog, projektiler, gathering/leverans, strid,
separation och HUD är aktiva. Extra units/HP är injicerad belastning över supply,
inte betald produktion eller nya spelvärden. Ordinarie ekonomi/matcher verifieras
separat i release-matrisen och browserflöden.

Budget fastställd i [DECISIONS.md](DECISIONS.md) före mätning:
64 update CPU p95 ≤16,7 ms, render CPU p95 ≤16,7 ms, RAF p95 ≤33,4 ms;
128 update CPU p95 ≤33,4 ms. GC-heap ≤128 MiB och tillväxt efter tio restarts
≤16 MiB. Stressfallet har ingen 60-FPS-garanti. JS ≤1,7 MB, gzip ≤450 KB,
dist ≤5 MiB; befintlig bundle-varning ligger kvar.

Scene pre/post-update omfattar gameplay och visual/HUD-sync. Game pre/post-render
mäter renderarens CPU, inte GPU-tid. Game step-intervall följer RAF;
FPS är 1000/medelintervall. Minst 300 frames efter 60 warmup-frames.
Max inkluderar warmup/initial routesökning. JS-heap efter explicit CDP GC,
inte processens totala minne. Tio riktiga DOM-restarts följer profileringen.

## Före och efter

| Mätvärde | 64 före | 64 efter | 128 före | 128 efter |
|---|---:|---:|---:|---:|
| Update CPU p95, ms | 43,90 | 8,70 | 91,90 | 24,40 |
| Render CPU p95, ms | 0,70 | 0,80 | 0,80 | 0,90 |
| RAF p95, ms | 50,10 | 17,60 | 100,00 | 34,70 |
| Observerad FPS | 34,03 | 59,46 | 23,53 | 39,12 |
| Update CPU max, ms | 144,90 | 21,20 | 552,60 | 47,70 |
| GC-heap, MiB | 9,27 | 9,41 | 11,92 | 11,58 |
| Mätframes efter warmup | 309 | 330 | 314 | 312 |

Samma fixtures/buildprofil före och efter; olika wall-time/frame-intervall ger
olika framskriden gameplay-tid, så detta är en profil av aktiv simulation och
inte ett deterministiskt identiskt replay. Alla kroppar levde och matchen var
playing i båda profilerna. Mätningen före hade överträdda CPU-budgetar;
efter håller 64 alla budgetar och 128 sin separata CPU-budget.
128 har kvar långsammare frame-intervall och enstaka dyra initialframes.

Chromiums CPU-profiler pekade på `findRoute` under combat `approachRoute`.
Två avgränsade ändringar:

- Separation bevarar en moving-route om nästa sträcka fortfarande är fri.
  Revision/clearance-fel och flyttad arrived-position räknas om; blocked results bevaras.
- Approach provar kandidater efter rak avståndsgräns och hoppar över BFS som
  inte kan förbättra den funna vägen. Tidigare tie-ordning behålls. Sex golden
  routes från RTS-064 verifierar exakt samma mål/waypoints/status, inklusive
  omvägar, stor kropp och unreachable start.

Inga nya balansvärden, orders, sparade fält eller save/config-versioner.
Navigation är fortfarande härledd cache; Load kan välja annan likvärdig väg
från samma sparade position. Queue-prioritet, order/last och ledger bevaras.

## Upprepa mätningen

[scripts/profile-browser.mjs](scripts/profile-browser.mjs) bygger endast en
temporär fixture-bundle och instrumenterar browserns hämtade JS-svar. Ingen
debug-hook eller testbundle byggs in i spelet. Playwright Core och Chromium
behöver finnas som externa verifieringsverktyg; de är inga projektdependencies.
Ange modulens absoluta path och browserbinary om de inte hittas automatiskt.

```sh
npm run build
npm run preview -- --host 127.0.0.1
# I annan terminal, med externa Playwright/Chromium installerade:
W2T_PLAYWRIGHT_MODULE=/absolute/path/to/playwright-core/index.mjs \
W2T_BROWSER_EXECUTABLE=/absolute/path/to/chromium \
W2T_LONG_RUN=1 node scripts/profile-browser.mjs
```

Default-URL är http://127.0.0.1:4173/warcraft-2-tribute/;
`W2T_PROFILE_URL` kan ange annan lokal/publicerad production-URL.
JSON-resultat skrivs till stdout och budgetfel ger felstatus.
Screenshots ligger i systemets tempdir. `W2T_CPU_PROFILE=1` kör endast
64-fallet med CDP sampling; `W2T_CPU_PROFILE_FILE` kan ange JSON-filen.
`W2T_LONG_RUN=1` lägger till 30 sekunders faktisk browserbelastning och heapcheck.
Headless Chromium är verifierad; andra motorer/mobil och akustisk lyssning kvarstår.

Slutlig omkörning med det incheckade skriptet och budgetasserts: 64 CPU p95
8,50 ms/render0,70/RAF17,30/FPS59,40/heap9,88 MiB; 128 CPU24,50/
render0,80/RAF34,30/FPS39,37/heap11,26 MiB. Ytterligare 30 s verklig
128-belastning gav GC-heap10,33 →11,27 MiB (+0,94). Tio restarts gav
8,37 →9,39 MiB (+1,01), max10,29 MiB. Inga browserfel. Samtliga
fastställda budgetasserts passerade. Slutlig JS1 512,93 KB/gzip397,31 KB;
dist3240 KiB. Testbundle/debuginstrumentering ingår inte i dist.

CI-uppföljning: workflows för RTS-063/064 stoppade på ett 10 s timeout i den
4 500-frame långa match-integrationen, inte på en behavior-assert. Timeout är
nu 30 s för denna integration och nya load-integrationer. Det är körmarginal
på delad CI, inte sänkt gameplay/prestandakrav; profileringsskriptets CPU-budgetar
är oförändrade och testerna kräver fortfarande victory/conservation/fog/reset.
