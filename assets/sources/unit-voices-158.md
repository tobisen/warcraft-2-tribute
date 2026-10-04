# RTS-158 – dialog och konkret inspelningsbrist

380 egna engelska repliker för fem fraktioner × sju unitroller × selection/move/attack/work/repeat, med minst två varianter per kombination. Specialister har egen roll; rasernas humor använder kunglig byråkrati, orcers direkta styrka, elf-etikett, dwarf-hantverk och Goblin-teknikerprototyper. Befintliga stop/order-repliker behålls separat. Orderevents skiljer move/attack/gather/build/deliver. Tredje selectionklicket på samma unit inom8s väljer repeat; global2.5s cooldown, aktiv tal-lane och ingen kö gäller fortsatt. Historiken är per ras/roll/action.

[Exakt inspelningsmanus](voice-recording-script.json) listar samtliga380 ID:n och texter. **Alla380 recording/license-fält är null.** Inga egna/licensierade inspelningar för dessa engelska repliker har levererats; public/audio innehåller musik/effekter men inga unitröstfiler. Underlag som behövs är inspelningar matchade till dessa ID:n, metadata om röstartist/ägare/licens samt verklig lyssningsgranskning. Detta blockerar inspelade röster och Done-status, inte den oberoende dekorativa världen159. Inget cloud-TTS eller kommersiellt spelljud antas.

Befintlig localService English speechSynthesis används som uttrycklig lokal fallback. Den är inte en inspelad röstasset och kan saknas i browsern. Separat röstvolym/master/mute/pause/reset återanvänds. Text/prestandatester och en mockad taladapter bevisar routing, inte hur rösten låter.

Slutlig unit441/79 och build/strict typecheck PASS. Browser med fysisk canvas-selection/move/resource/attack och explicit lokal speech-testadapter PASS select/repeat/move/work/attack. Se artifacts/rts-158/dialogue-browser.json. Faktisk röstlyssning och inspelningar saknas;158 In Progress/blockerad assetdel. Inga campaign-simuleringar.
