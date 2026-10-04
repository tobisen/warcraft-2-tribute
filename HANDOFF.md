# Överlämning efter RTS-165–167; RTS-168/169 blockerade

Datum2026-10-05. Bifogat mandat165–173 anger uttryckligen etappstopp efter169
för ny chatt170–173.165–167 är färdiga och pushade;168 och169 har centrala
krav kvar och markeras inte Done. Nästa arbete är att lösa168:s saknade
luftdesign/underlag.170–173 är inte startade. Ingen agentdelegering.

## Leverans

| Task | Status/resultat | Commit |
| --- | --- | --- |
| RTS-165 | Done: befintlig specialist per ras kompletterad med mana, regeneration, HUD, betald produktion/prereqs och Save38. | `838f729`, pushad |
| RTS-166 | Done: datadrivna heal/buff/debuff, targeting/cancel/fog/range/mana/cooldown, Save39. | `2cd36a6`, pushad |
| RTS-167 | Done: fem skilda spell-loadouts, effektstatus/expiry/stackregler, AI med samma validering, Save40. | `fd9dfd3`, pushad |
| RTS-168 | Blocked: ingen befintlig luftroster och inga godkända flygarreferenser; inga nya flygare implementerade eller visuellt verifierade. | Dokumenterad i separat överlämningscommit |
| RTS-169 | Blocked av168: oberoende mark/sjö/magi-inventering genomförd, luft/anti-air/combined-arms-verifiering kvar. Inga169-stats ändrade. | Dokumenterad i separat överlämningscommit |

160–164 inventerades som Done, faktisk implementation och dokumenterade checks
matchade status:7d7290c/b7439ae/4658a0d/efbdd7d/874f761. De återimplementerades
inte. Historisk164-regression1193/155 är separat från nya checks nedan.

## Implementerat beteende

- Mana på Banner Guard/Raider/Marksman/Bulwark/Grenadier med bevarade namn,
  stridsprofiler, costs/tider/supply och godkända assets. Max/initial/regen:
  Humans100/60/1, Orcs80/40/1, Elves120/60/1.25, Dwarves100/50/0.8,
  Goblins80/40/1. Gameplay-tid, pause/gameover, cap, levande/embarked ingår.
- Aktuellt utbud: Human Heal/Ward/Hex, Orc War Cry/Intimidate, Elf Renew/Wither,
  Dwarf Mend/Rune Shield, Goblin Overclock/Corrode. Configdata och konkret
  kostnad/range/cooldown/effekt finns i src/config/spells.ts och GAME_DESIGN.md.
  Detta konkretiserar dokumenterade134-roller; ingen historisk färdig spellista
  eller ny magikerroster hittas på. Tidigare designfråga: arbetsantagandet var
  att komplettera befintliga specialister enligt165-mandatet.
- F2/F3/F4 är heal-/buff-/debuffslots; tomma slots döljs. Grön/röd markör,
  range-cirkel, Escape/högerklick utan kostnad. Cast validerar aktuellt ID,
  team, levande markstridsmål, aktuell fog, range, mana/cooldown/fullHP.
  Workers/byggnader/skepp/embarked är inte giltiga mål. Casterordern består.
- Högst en buff och en debuff per mål. Återapplicering ersätter samma kanal
  och duration; effekter upphör med gameplay-tid inklusive ombord, även efter
  casterdöd. Namn/tid i selection, separata cyan/lila ringar. E-abilities och
  research är separata multiplikatorer; projektilstyrka sparas vid skottet.
  Overclock ökar både attack1.4× och inkommande skada1.2×.
- AI: högst en cast per caster/beslut, två beslut/s från sparad matchklocka.
  Heal lägst HP-fraktion under70%, annars synlig debuff, annars buff nära
  synligt stridshot. Aktiv kanal med mer än1s hindrar meningslös refresh.
  Samma castSpell-validering som spelaren. Match delas vid expiry/AI-beslut.
- Save config40 migrerar39 och hela tidigare kedjan. Gamla tre speldefinitioner
  kvar så deras aktiva effekter/cooldowns inte omtolkas; nytt fraktionsutbud
  valideras vid cast. Schema2 och lokal slot består. Load/restart utan läckage.

## Ny verifiering

-165 riktade52/4 och fraktions18/4 PASS; unit445/80/build strict PASS.
-166 riktade72/7 och feedback/spellcheck14/2 PASS; slutlig unit446/80/build
  strict PASS. Faktisk browser fann ett feedbackproblem; rättat och testat.
-167 riktade78/7 och strids-/AI-/profil95/6 PASS (inklusive relevanta befintliga
  factionBalance-genomspelningar då gameplay/AI ändras). Slutlig unit446/80
  och build inklusive strict typecheck PASS. Manifestet validerat.
- Full regression vid etappgränsen:1227tester/158filer PASS (477.49s).
  git diff --check och lokala Markdownreferenser PASS.
  Ingen ny kod ändrad efter slutliga167-checks; efter fd9dfd3 endast docs.
- Faktisk Chromium native800×600 och1280×720.165: fem raser, betald production,
  fysisk selection/mana/regen/pause/Save/Load/cap.166: fysisk targeting/invalid/
  cancel/heal/buff/debuff, mana/CD/Save/Load och blandad worker+caster-HUD.
 167: fem raser, fysiska casts, distinkta slots/status, verklig Scene.update med
  AI-cast, Save/Load/expiry/restart och HUD-scrollmått. Noll pageerrors.
- [165 bilder/rapport](artifacts/rts-165), [166](artifacts/rts-166),
  [167](artifacts/rts-167). Alla fem native800-mana- och effectbilder samt
  representativa större vyer visuellt granskade.167 innehåller20screenshots.
  Skript: scripts/check-mana.mjs, check-spells.mjs, check-faction-spells.mjs.
  Extern Playwright/Chromium anges med W2T_PLAYWRIGHT_MODULE och
  W2T_BROWSER_EXECUTABLE; ingen skeppad debug-API.
- Lokal devserver http://127.0.0.1:5182/. Ingen ny CI-/Pages-build eller fysisk
  ljudlyssning kontrollerad. Befintlig bundlevarning kvar.

## Exakt blockering och kvarstående arbete

[RTS-168-underlag](assets/sources/air-168.md) anger saknat luftrosterbeslut:
enhetsidentiteter/roller per ras, produktion/prereqs och land/sea/air/anti-air.
De tio godkända landreferenserna innehåller bara redan använda landroller;
separata flygarsilhuetter/porträtt/animationer saknas. Designfrågan är ställd
men obesvarad. Kräver befintligt faktiskt underlag eller nytt uttryckligt
luftdesign-/originalassetbeslut. Hitta inte på en historisk plan, ändra inte
namn på marksprites till ”godkända flygare”, markera inga placeholders Done.

[RTS-169 delreview](artifacts/rts-169/partial-review.md) skiljer faktiska
stats/manabegränsningar och167-testresultat från historisk164-siege-balans.
Ingen mänsklig helmatchbalans utförd. Full169 behöver168, kombinerade
mark/sjö/luft/magi-scenarier, anti-air-tillgång, AI och kostnad/supply-counters.
Buff+E+research-kombinationerna behöver ingå i den stridsbudgeten. Inga
spekulativa169-statsjusteringar eller falsk färdigmarkering.

Övriga tidigare begränsningar består: separata casting-poser saknas enligt
[magiprotokollet](assets/sources/magic-165.md); befintliga godkända unitassets
räcker för levererade magiflöden men en ny castanimation hävdas inte.
RTS-155 landassets implementerade; sjöreferenser saknas enligt
[spriteinventeringen](assets/sources/remaining-sprites.md). RTS-157 fortsatt
In Progress (faktisk ljudlyssning); RTS-158 fortsatt In Progress (380
inspelningar/licensposter, repliker/fallback är inte inspelade röster).

Användarens src/style.css är byte-identisk med etappstart, SHA256
95c3725250221ef8386519adecfb05db601103697d421e78e1b2bdf057141a5e.
Otrackade docs/ bevaras utanför våra commits. main/origin/main används utan
force, amend eller history rewrite. Nästa task168 är blockerad enligt ovan;
170–173 lämnas till ny chatt när165–169-etappen faktiskt är klar.
