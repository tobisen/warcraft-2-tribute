# RTS-159 – dekorativ levande värld

Egna integer-pixelbilder för hjort, kanin och räv: två idleblinkframes och fyra gångposer,32px med(16,24)-ankare. Stockar, svamp och gräs-/vassdetaljer använder samma materialpalett. Inga externa djurreferenser har tillförts; dessa är egna separata spelassets, inte illustrationscrops eller inspelade röster. Worldatlas256×384 med51 frames; tidigare unit/building/naval-rasters bevaras.

Habitat hämtas deterministiskt från kartans fasta terräng, högst48 djur; lokalt idle/wander inom18×12px kring hemmet. De är endast presentation: ingen collision/occupancy, selection, HP, ekonomi, jakt, minimapmarkör eller fogobservatör. Bara synliga positioner visas. Byggnader över habitat/props döljer grafiken; de påverkar aldrig byggvalideringen. Inga nya pathfindingregler.

Rörelse/frames är rena funktioner av habitat och befintlig waves.elapsedSeconds. Save återställer samma tid och därmed samma pose, pause fryser och restart återställer t=0. Ingen ny savefield/version. Habitats/props skapas från statisk terräng även efter Load; aktuell obstaclemap filtrerar synlighet, så förstörda byggnader kan återexponera dekorationen.

## Verifiering

Riktade10/3 wildlife/save/atlas PASS. Slutlig unit444/80, build inklusive strict typecheck och diffcheck PASS. Save/visibility/wildlifeSave38/3 och resourceSelection7/1 PASS. Ny sammansatt wildlifeSave.test.ts klassificeras som integration i manifestet. All-map unitkontroll verifierar nativebounds/framecoverage/cap/stabilitet; faktisk Chromium-native800×600/1280×720 verifierar idle/wander, fysisk selection, ingen fog/obstacle-/rosterändring, fysisk Save/Load med exakt pose, paus, restart och byggnadstäckning. Bilder i artifacts/rts-159 är visuellt granskade; kontaktblad visar riktiga exporter/animationer. Revealed-fixturen är separat från normal fog-vy.

Review hittade två korrigeringar: dynamiska byggnader fick inte påverka permanent seedlista/propplatser efter Load, och worldmanifestets width blev fel vid höjdändring. Dessa är rättade; ny PNG/metadata-invariant tillagd. Slutliga unit/build upprepades efter respektive konkreta korrigering, inte som rutinmässig dubbelcheck. Metadatafixen ändrade inga rasters/poser; passerad slutlig browserkontroll återanvänds med det angivet.

Ingen broad campaign-/matchsimulering, full npm test eller ny CI/Pages körd. RTS-159 Done, stopp efter159. Ljudlyssning157 och380 saknade inspelningar158 är separata kvarstående krav, inte färdigmarkerade.
