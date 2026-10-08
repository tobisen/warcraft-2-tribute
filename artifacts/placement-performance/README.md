# Fortificationplacering 2026-10-08

Isolerad baseline HEAD1042b23 via `git archive` i /private/tmp/w2t-placement-before,
Vite5189; ändrad workspace via Vite5188. Samma lokala headless Chrome och
`scripts/check-fortification-performance.mjs`, separat körning för före/efter.
`W2T_UI_URL`, `W2T_MEASUREMENT=before|after`, externa Playwright/Chrome-env.
Cold place är första fulla placeringen vid angränsande576/384 efter tre
betalda mursites480–544/384. Preview/snap ingår inte i den mätta validatorn.
Alla svar/footprints/antal är jämförda och lika i före/efter-JSON.

Normal:6aktörer. many:102aktörer, inklusive96 injicerade idle-workers i
kontrollerad startregion för att isolera skalningen. Inga sänkta riktiga
caps/stats. En enda kall mätning per fall, inga hårdvaruoberoende garantier.
Tre-segmentstid är verklig placeWallLine med bank1000/1000 och ordinarie
fog/admission; all work betalas och tar fortsatt ordinarie byggtid.

| Fall | Före kall placering ms | Efter ms | Före3 murar ms | Efter ms |
| --- | ---: | ---: | ---: | ---: |
| wall | 86.1 | 25.6 | 433.5 | 89.4 |
| gate | 46.7 | 19.3 | 405.5 | 99.2 |
| tower | 64.4 | 25.1 | 406.7 | 91.4 |
| wall-many | 1337.4 | 144.4 | 8201.3 | 459.6 |
| gate-many | 876.6 | 82.2 | 8201.9 | 460.2 |
| tower-many | 1309.2 | 143.5 | 8190.7 | 460.1 |

`scripts/check-placement-clicks.mjs`: fysisk musplacering bredvid raden,
99egna enheter/native800/1280; handler inkluderar scene syncVisuals.
Alla6klick betalar rätt och lägger exakt ett wall/gate/tower,0pageerrors.
Se clicks.json:88,5–172,8ms. Detta är kontrollerade fixtureklick,
inte en naturlig fullmatch eller alla kartor/maskiner.

`scripts/check-wall-drag.mjs` med `W2T_ARTIFACT_DIR=artifacts/placement-performance/wall-drag`
verifierar kostnader,3sites, Save/Load, sekventiellt färdigbygge, Escape,
högerklick, HUD-släpp och singleclick vidzoom1,5. Inga nya assets eller Savefält.
