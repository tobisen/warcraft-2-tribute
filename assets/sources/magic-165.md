# RTS-165: mana på befintliga specialister

Alla fem godkända land-specialistsprites/porträtt återanvänds, med befintliga namn,
logical bodies, ankare och idle/walk/attack/death. Banner Guard får skyddande
supportroll, Raider offensiv battle magic, Marksman woodland control, Bulwark
runförsvar och Grenadier alchemical disruption. Detta kompletterar RTS-134:s
stridsroller; inga nya magikersprites, illustration-crops eller namn införs.

Mana/initial/regen per gameplay-sekund: Humans100/60/1, Orcs80/40/1,
Elves120/60/1.25, Dwarves100/50/0.8, Goblins80/40/1. Befintliga kostnader,
produktionstider, supply och prerequisites består. Spells implementeras166/167;
165 hävdar inga färdiga heal/buff/debuff eller nya castanimationer.

Separata casting-poser och nya casterreferenser saknas. Befintliga godkända
specialistassets räcker för mana-slicens selection/idle/movement/strid; en
ny specifik castpose får inte hävdas som levererad. Luftroster och luftreferenser
för168 saknas i den dokumenterade fraktionsplanen och är en separat öppen fråga.

Chromium800×600/1280×720 för samtliga fem raser, fysisk train/selection/Save/Load,
HUD, initial mana/regen/pause/cap. Bilder och rapport i artifacts/rts-165;
regression i scripts/check-mana.mjs. Avgränsad fixture ger färdig truppbyggnad,
forge och research, men betalar riktig träning med faktiska recipes.
