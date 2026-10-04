# RTS-157 – attackljud och lyssningsstatus

Fyra nya egna deterministiskt syntetiserade effekter: melee (metall/slag), bow (sträng/vind), siege (trä/låg mekanisk energi) och buildingHit (sten/bråte). Befintlig cannon för fartyg och impact för unitträffar återanvänds. PCM-masters i assets/audio, OGG/WAV i public/audio; inga externa ljudreferenser eller inspelningar har tillförts. Dessa effekter är syntes, inte inspelade Foley- eller röstassets.

combatAudioSnapshot innehåller enbart synliga attacker/HP/positioner, med befintlig projectile-/cooldownstate. Melee följer verklig HP-minskning på order-/navigationtarget i räckvidd; ranged följer nytt skott eller cooldownreset (även när projektilen redan landat). Reveal, initial/load och pause ger inte nya cues. BuildingHP inkluderar base/barracks/farm/forge/harbor och synliga enemybyggnader. Ingen combatregel ändras. Saknad/bortrensad död kropp ger inte en påhittad HP-händelse; befintligt dödssystem behålls.

Avstånd mäts till kamerans mitt: full gain inom256px, linjär dämpning till tyst vid1400px. En cue per familj och frame, närmaste vinner. Befintliga cooldowns och max6 källor (två reserverade för alerts/results) återanvänds. Hidden units ger ingen ljudscouting. Ursprungliga elva WAV/OGG bevaras byte-identiska; exporten skriver inte om oförändrade OGG.

## Evidens och kvarstående kontroll

Riktade7/3 sound/engine/assets samt7/2 snapshot/policy PASS. Slutlig unit439/79 och build inklusive strict typecheck PASS. Faktisk Chromium-stridsfixture använder befintlig gameplay-update,15 egna landunits mot12 enemyunits plus bas; skilda accepterade ljudfamiljer och faktisk Web Audio-decode dokumenteras i artifacts/rts-157/browser-audio.json. Offline-capture av accepterade källor skapar battle-preview.wav för lyssning, inte bevis på hörselgranskning. Inga campaign-simuleringar.

**Faktisk lyssning återstår tills användaren har lyssnat och lämnat bedömning.** Ingen hörselåtkomst finns i denna agentkörning; decode, amplitud och cue-loggar kan inte ersätta lyssning. RTS-157 hålls In Progress med verifierad teknisk del. Röstinspelningar hanteras separat inom158.
