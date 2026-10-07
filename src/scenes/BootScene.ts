import {applyResourceCheat} from '../gameplay/cheats';
import {bindCheatInput} from '../presentation/cheatInput';
import {renderTechnologyView} from '../presentation/technologyView';
import {renderCommandsView} from '../presentation/commandsView';
import {spriteCrop} from '../presentation/spriteCrop';
import {regionDefinition} from '../config/mapRegions';
import {visibleDiscoveries} from '../presentation/discoveries';
import type {DiscoveryState} from '../gameplay/discoveries';
import {workerCombatConfig} from '../config/unit';
import {cancelSelectedTransfers,requestTransport} from '../gameplay/autoTransport';
import {syncSkirmishMenu} from '../presentation/skirmishMenu';
import {campaignActionReason,campaignContentFor} from '../config/campaignContent';
import {identityFor,seriesMissionPlan} from '../config/campaignSeries';
import {campaignPlans} from '../config/campaignPhases';
import {campaignObjective} from '../gameplay/campaignPhases';
import {isSpectating,playerEliminated} from '../gameplay/teamResults';
import {supportedPlayerCounts} from '../config/players';
import {matchPlayers} from '../gameplay/players';
import type {MultiplePlayers} from '../gameplay/multiplePlayers';
import {animalAt,visibleAnimals,type WildlifeState} from '../gameplay/wildlife';
import {referenceKind,referenceTile} from '../presentation/referenceTerrain';
import {forestVisuals} from '../presentation/forestVisuals';
import {renderActionIcons} from '../presentation/actionIcons';
import {setActionLabel} from '../presentation/actionLabel';
import {aiProfiles,isAIProfile} from '../config/aiProfiles';
import {issueOrder} from '../gameplay/commandOrders';
import {airPresentation} from '../config/air';
import {isAir} from '../gameplay/domains';
import {spellDefinition,spellForSlot,spellSlots,type SpellId} from '../config/spells';
import {castSpell,selectedSpellCaster,spellCasterReason,spellTargetAt,spellTargetReason} from '../gameplay/spells';
import {orderRepair} from '../gameplay/repair';
import {toggleGate,gateToggleReason} from '../gameplay/gates';import {defenseConfig} from '../config/defenses';
import {placeTower,towerPreviewError,towerPlacementError,upgradeTower,towerUpgradeReason} from '../gameplay/towers';
import {buildingAvailability} from '../gameplay/productionPrerequisites';
import {baseDevelopment,startBaseUpgrade,baseUpgradeReason} from '../gameplay/baseUpgrade';
import {wildlifeHabitats,wildlifeDetails,type Habitat} from '../presentation/wildlife';
import {combatAudioSnapshot,combatAudioCues,type CombatAudioSnapshot} from '../presentation/combatAudio';
import {inspectBuildingAt,inspectedBuilding,savedBuildingSelection} from '../gameplay/buildingInspection';
import {highscoreStore,renderHighscorePanels} from '../presentation/highscores';
import {dismissProposal,dismissUnits,type DismissProposal} from '../gameplay/dismiss';
import {dismissMessage} from '../presentation/dismiss';
import {renderOperation,operationMarkers} from '../presentation/operations';
import type {CaptureState} from '../gameplay/operations';
import {campaignMissionForScenario,type CampaignMissionId} from '../config/campaign';
import {startCampaignMission} from '../gameplay/campaign';
import {campaignStore} from '../presentation/campaign';
import {currentHomePage} from '../presentation/homeMenu';
import {enemyMaximumHP} from '../gameplay/enemyUnits';
import {technologyFor} from '../gameplay/productionPrerequisites';
import {selectWorldTarget} from '../gameplay/resourceSelection';
import type {StatLedger} from '../gameplay/statLedger';
import {syncResultScreen} from '../presentation/resultScreen';
import {getPreferences,updatePreferences} from '../presentation/preferences';
import {voiceSpeaker,voiceOrders,orderedSpeaker,failedOrderSpeaker,readyVoiceSpeaker,voiceOrderAction} from '../presentation/voicePolicy';
import {audioFiles} from '../config/audio';
import {matchAudioSnapshot} from '../presentation/audioSnapshot';
import {renderTutorial} from '../presentation/tutorial';
import type {TutorialState} from '../gameplay/tutorial';
import {isGameSpeed} from '../config/gameSpeed';
import {commandFeedback,renderCommandFeedback} from '../presentation/commandFeedback';
import {createWarningState,warningSnapshot,updateAttackWarnings,renderAttackWarning} from '../presentation/attackWarnings';
import {orderFeedbackConfig,attackWarningConfig} from '../config/feedback';
import {cameraShortcut,cameraFocus,selectionFocusPoints} from '../presentation/cameraFocus';
import {bindCameraInput} from '../presentation/cameraInput';
import {selectedIcons,selectedQueue,renderSelectedIcons,renderSelectedQueue} from '../presentation/selectionCollection';
import {actionPanel,renderActionPanel} from '../presentation/actionPanel';
import {selectionInfo,renderSelectionInfo} from '../presentation/selectionInfo';
import {renderTopBar} from '../presentation/topBar';
import {text as uiText} from '../text';
import {viewportGeometry} from '../presentation/viewport';
import {syncHomeMenu} from '../presentation/homeMenu';
import {enemyBody} from '../gameplay/enemyBody';
import type {EnemyNavalState} from '../gameplay/enemyNaval';
import {loadTransport,unloadTransport} from '../gameplay/transport';
import {navyConfig} from '../config/navy';
import {attackShips,harborPreviewError,harborPlacementError,placeHarbor,trainShip,canTrainShip,commandShips,resumeHarbor,stopShips,matchPopulation,type NavyState,type Ship} from '../gameplay/navy';
import {renderMatchResults} from '../presentation/matchResults';
import {matchSettingDetails,matchSettingsSummary} from '../presentation/matchSettings';
import {maps,isMapId} from '../config/maps';
import type {EnemyKnowledgeState} from '../gameplay/enemyKnowledge';
import type {EnemyRecoveryState} from '../gameplay/enemyRecovery';
import type {EnemyPolicyState} from '../gameplay/enemyPolicy';
import type {EnemyConstructionState} from '../gameplay/enemyConstruction';
import {useAbility,abilityFor,abilityReady,abilityStatus} from '../gameplay/abilities';
import {storeSave,readSave,type SavedView} from '../gameplay/save';
import {landedEffects,impactFrame,impactAlive,hitEffects,canAddImpact,drawProjectile,type Impact,type HealthSample} from '../presentation/effects';
import {effectConfig} from '../config/effects';
import {gameAudio} from '../presentation/audio';
import {audioEvents,type AudioSnapshot} from '../presentation/audioPolicy';
import {archerConfig} from '../config/archer';
import {catapultConfig} from '../config/catapult';
import {canInteract} from '../gameplay/approach';
import {motion,unitFrame,unitOrigin,unitOverlayOffsets,artAtlas,deathEffect,effectAlive,type Motion,type DeathEffect,type Action,type UnitArt} from '../presentation/animation';
import { buildingFrame,buildingOrigin,terrainImageFrame,terrainEdges,terrainDetails,resourceFrame,resourceOrigin } from '../presentation/assets';
import { createSession,sessionTransition,changeOptions,gameplayDelta,type MatchSession,type SessionAction } from '../gameplay/session';
import { hotkeys,hotkeyButton,dispatchHotkey } from '../presentation/hotkeys';
import { bindGroup,recallGroup,combineSelection,validGroup,type ControlGroups } from '../gameplay/controlGroups';
import { gameplayKeyAllowed,keyboardContext } from '../presentation/keyboard';
import { entityVisible,knownResource,placementVisible } from '../gameplay/visibility';
import { isVisible } from '../gameplay/fog';
import { drawFog } from '../presentation/fogView';
import { createFog,type FogState,type Team } from '../gameplay/fog';
import { visibleMinimapData } from '../presentation/minimap';
import { bindMinimap } from '../presentation/minimapView';
import { initialDifficulty,difficultyProfiles,type Difficulty } from '../config/difficulty';
import { type EnemyAIState } from '../gameplay/enemyAI';
import { type EnemyProductionState } from '../gameplay/enemyProduction';
import { initialScenario,scenarioConfig,playableScenarios,type MatchScenario } from '../config/scenarios';
import { forgeConfig,upgradeConfig } from '../config/upgrades';
import { createResearch,startResearch,canResearch,type ResearchState,type ResearchKind } from '../gameplay/research';
import { commandAttackMove } from '../gameplay/attackMove';
import { enqueueProduction, cancelProduction, canEnqueue } from '../gameplay/productionQueue';
import { populationState } from '../gameplay/population';
import { barracksReady, resumeConstruction } from '../gameplay/construction';
import { costs } from '../config/economy';
import { costLabel } from '../gameplay/economy';
import { stopSelected } from '../gameplay/orders';
import { orderMarkers,navalOrderMarkers } from '../presentation/orders';
import { setRally } from '../gameplay/rally';
import { allowsProduction, baseFootprint, type BuildingSelection } from '../gameplay/buildingSelection';
import { clampCamera, cameraScroll, visibleCamera, dragCamera, type CameraDrag } from '../presentation/camera';
import { commandGroupMove } from '../gameplay/groupMovement';
import { arenaConfig } from '../config/arena';
import {createMap,bodyFits, tileFootprint, type WorldMap } from '../gameplay/map';
import { matchLabels, productionLabel } from '../presentation/hud';
import Phaser from 'phaser';
import { createMatch, updateMatch, type MatchOutcome, type MatchState } from '../gameplay/match';
import type { WaveState } from '../gameplay/waves';
import {defaultFactions,factions,factionsForPlayer,isFactionId,type MatchFactions} from '../config/factions';
import { combatConfig } from '../config/combat';
import { enemyAt, orderAttack, type CombatState } from '../gameplay/combat';
import { soldierStats, combatUnitStats, unitStats } from '../config/unit';
import type { Position } from '../gameplay/movement';
import { gatheringConfig } from '../config/gathering';
import { productionConfig, soldierProductionConfig } from '../config/production';
import { barracksConfig, farmConfig } from '../config/buildings';
import {hasMainBase,selectedBase,trainBaseWorker} from '../gameplay/extraBases';
import {workerToolsConfig} from '../config/workerTools';
import {researchRecipe,researchLevel} from '../gameplay/research';
import {extraBaseConfig} from '../config/extraBases';
import { buildingFootprint, beginPlacement, cancelPlacement, placementPreviewError, placementError, placementObstacles, placeBuilding, type PlacementState } from '../gameplay/placement';
import { canStartProduction, startProduction, type ProductionState } from '../gameplay/production';
import { isNodeHit, orderUnits, resourceNodes, type GatheringState, type Unit } from '../gameplay/gathering';
import {
  isSelectionDrag, selectionRectangle,
  selectUnitsInRectangle,
} from '../gameplay/selection';

export class BootScene extends Phaser.Scene {
  private matchId?:string;
  private pendingDismiss?:DismissProposal;
  private capture?:CaptureState;
  private operationGraphics?:Phaser.GameObjects.Graphics;
  private operationLabels:Phaser.GameObjects.Text[]=[];
  private campaignRun?:MatchState['campaignRun'];
  private campaignMission?:CampaignMissionId;
  private statLedger?:StatLedger;
  private factions:MatchFactions=factionsForPlayer(getPreferences().game.faction,getPreferences().game.enemyFaction);
  private controlGroups:ControlGroups={};
  private fog!:FogState;
  private fogOverlay?:Phaser.GameObjects.Graphics;
  private fogPreview:Team|null=(()=>{const q=new URLSearchParams(window.location.search).get('fog-preview');return q==='player'||q==='enemy'?q:null;})();
  private minimap?:ReturnType<typeof bindMinimap>;
  private enemyAI?:EnemyAIState;
  private enemyProduction?:EnemyProductionState;
  private scenario:MatchScenario=initialScenario(new URLSearchParams(window.location.search).get('scenario'));
  private difficulty:Difficulty=initialDifficulty(new URLSearchParams(window.location.search).get('difficulty')??getPreferences().game.difficulty);
  private armyPlan?:import('../gameplay/combinedArmy').ArmyPlan;
  private session:MatchSession=createSession({aiProfile:getPreferences().game.aiProfile,scenario:this.scenario,difficulty:this.difficulty,map:scenarioConfig[this.scenario].map,faction:this.factions.player,enemyFaction:getPreferences().game.enemyFaction,speed:getPreferences().game.speed});
  private skipGameplayFrame=true;
  private scenarioSelect!:HTMLSelectElement;
  private research:ResearchState=createResearch();
  private forgeButton!:HTMLButtonElement;
  private forgeVisual?:Phaser.GameObjects.Image;
  private researchButtons=new Map<ResearchKind,HTMLButtonElement>();
  private map!: WorldMap;
  private baseVisual!:Phaser.GameObjects.Image;
  private baseLabel!:Phaser.GameObjects.Text;
  private queuePanel!:HTMLElement;
  private orderVisuals = new Map<string, Phaser.GameObjects.Graphics>();
  private warningState=createWarningState();
  private tutorial?:TutorialState;
  private warningVisual?:Phaser.GameObjects.Graphics;
  private enemyNaval?:EnemyNavalState;
  private unloadMode:string|null=null;
  private patrolMode=false;
  private attackMoveMode=false;
  private attackMoveButton!:HTMLButtonElement;
  private stopButton!: HTMLButtonElement;
  private defenseVisuals=new Map<string,Phaser.GameObjects.Image>();
  private repairMode=false;
  private spellMode:SpellId|null=null;
  private spellFeedback='';
  private spellFeedbackError=false;
  private spellGraphics?:Phaser.GameObjects.Graphics;
  private selectedBuilding: BuildingSelection = null;
  private selectedResource:string|null=null;
  private selectedAnimal:string|null=null;
  private wildlife:WildlifeState={};
  private discoveries?:DiscoveryState;
  private discoveryVisuals=new Map<string,{image:Phaser.GameObjects.Image;label:Phaser.GameObjects.Text}>();
  private animalFeedback?:Phaser.GameObjects.Graphics;
  private animalHP=new Map<string,number>();
  private rallyMarker!: Phaser.GameObjects.Arc;
  private buildingRing!: Phaser.GameObjects.Rectangle;
  private cameraDrag?: CameraDrag;
  private cameraInput?:ReturnType<typeof bindCameraInput>;
  private outcome: MatchOutcome = 'playing';
  private restartButton!: HTMLButtonElement;
  private restartPending = false;
  private matchStatus!: HTMLElement;
  private waves!: WaveState;
  private combat!: CombatState;
  private enemyPolicy?:EnemyPolicyState;
  private enemyRecovery?:EnemyRecoveryState;
  private multiplePlayers?:MultiplePlayers;
  private enemyKnowledge?:EnemyKnowledgeState;
  private enemyConstruction?:EnemyConstructionState;
  private enemyVisuals = new Map<string, { body: Phaser.GameObjects.Image; label: Phaser.GameObjects.Text }>();

  private navy?:NavyState;
  private navyGraphics!:Phaser.GameObjects.Graphics;
  private harborLabel?:Phaser.GameObjects.Text;
  private shipVisuals=new Map<string,Phaser.GameObjects.Image>();
  private harborVisual?:Phaser.GameObjects.Image;
  private shipLabels=new Map<string,Phaser.GameObjects.Text>();
  private harborButton!:HTMLButtonElement;
  private shipButton!:HTMLButtonElement;
  private gathering!: GatheringState;
  private placement: PlacementState = { active: false, barracks: null };
  private placementFeedbackError:string|null=null;
  private placementAttempt:{x:number;y:number;reason:string}|null=null;
  private previewPoint: Position = { x: 0, y: 0 };
  private placementClick = false;
  private placementPreview!: Phaser.GameObjects.Rectangle;
  private barracksVisual?: Phaser.GameObjects.Image;
  private farmVisuals = new Map<string, Phaser.GameObjects.Image>();
  private academyVisual?:Phaser.GameObjects.Image;
  private extraBaseVisuals=new Map<string,{body:Phaser.GameObjects.Image;label:Phaser.GameObjects.Text}>();
  private farmButton!:HTMLButtonElement;
  private buildButton!: HTMLButtonElement;
  private placementStatus!: HTMLElement;
  private production: ProductionState = { remainingSeconds: null, nextUnitNumber: 4 };
  private soldierProduction: ProductionState = { remainingSeconds: null, nextUnitNumber: 4 };
  private specialistButton!: HTMLButtonElement;
  private catapultButton!:HTMLButtonElement;
  private archerButton!:HTMLButtonElement;
  private projectileVisuals=new Map<string,Phaser.GameObjects.Graphics>();
  private soldierButton!: HTMLButtonElement;
  private soldierProductionStatus!: HTMLElement;
  private trainButton!: HTMLButtonElement;
  private productionStatus!: HTMLElement;
  private goldVisual!: Phaser.GameObjects.Image;
  private nodeVisual!: Phaser.GameObjects.Image;
  private forestImages=new Map<string,Phaser.GameObjects.Image>();
  private extraResourceVisuals=new Map<string,{body:Phaser.GameObjects.Image;label:Phaser.GameObjects.Text}>();

  private visuals = new Map<string, { body: Phaser.GameObjects.Image; ring: Phaser.GameObjects.Arc; cargo: Phaser.GameObjects.Text }>();
  private awaitingLoadedResume=false;
  private pendingLoad?:{match:MatchState;view:SavedView};
  private hpBars?:Phaser.GameObjects.Graphics;
  private impacts=new Map<number,{impact:Impact;visual:Phaser.GameObjects.Image}>();
  private nextImpact=1;
  private habitats:Habitat[]=[];
  private wildlifeVisuals=new Map<string,Phaser.GameObjects.Image>();
  private wildlifeProps:Phaser.GameObjects.Image[]=[];
  private audioSnapshot?:AudioSnapshot;
  private combatSoundSnapshot?:CombatAudioSnapshot;
  private visualTime=0;
  private hitSnapshot?:HealthSample[];
  private motions=new Map<string,Motion>();
  private deaths=new Map<string,{effect:DeathEffect;visual:Phaser.GameObjects.Image}>();
  private drag?: { world: Position; screen: Position; active: boolean;shift:boolean };
  private dragBox!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('BootScene');
  }

  preload():void {for(const key of ['world','buildings','units','ui','naval','air','reference-terrain'])if(!this.textures.exists(key))this.load.atlas(key,`${import.meta.env.BASE_URL}assets/${key}-atlas.png`,`${import.meta.env.BASE_URL}assets/${key}-atlas.json`);}

  create(): void {
    this.audioSnapshot=undefined;this.combatSoundSnapshot=undefined;gameAudio.setPhase('menu');gameAudio.reset();
    this.spellGraphics=this.add.graphics().setDepth(45);
    this.warningState=createWarningState();this.warningVisual=this.add.graphics().setDepth(9);
    this.forestImages.clear();this.habitats=[];this.wildlifeVisuals.clear();this.wildlifeProps=[];this.visualTime=0;this.extraResourceVisuals.clear();this.hitSnapshot=undefined;this.motions.clear();this.deaths.clear();this.impacts.clear();this.nextImpact=1;
    this.hpBars=this.add.graphics().setDepth(7);this.animalFeedback=this.add.graphics().setDepth(7);this.animalHP.clear();this.selectedAnimal=null;
    this.operationGraphics=this.add.graphics().setDepth(6);this.operationLabels=[];
    const loaded=this.pendingLoad;this.pendingLoad=undefined;
    if(!loaded)document.getElementById('save-status')!.textContent='';
    const fresh=()=>({matchId:crypto.randomUUID(),...createMatch(this.scenario,this.difficulty,this.factions,(this.campaignMission?campaignPlans[this.campaignMission]?.map:undefined)??this.session.options.map,this.session.options.speed??1,this.session.options.aiProfile,this.session.options.players,this.campaignMission),...(this.campaignMission?{campaignMission:this.campaignMission,...(this.campaignRun?.campaignId?{campaignRun:{version:1 as const,phase:0,campaignId:this.campaignRun.campaignId}}:{})}:{})});
    this.applyMatch(loaded?.match??fresh());
    this.discoveryVisuals.clear();
    this.game.canvas.tabIndex=0;this.game.canvas.setAttribute('aria-label',uiText.gameWorld);
    const groupKey=(event:KeyboardEvent)=>{
      if(!gameplayKeyAllowed(keyboardContext(event,this.gameplayActive()))||!validGroup(event.key))return;
      event.preventDefault();
      if(event.ctrlKey||event.metaKey)this.controlGroups=bindGroup(this.controlGroups,event.key,this.allSelectable(),u=>entityVisible(this.fog,'player',u));
      else{this.setSelectable(recallGroup(this.controlGroups,event.key,this.allSelectable(),u=>entityVisible(this.fog,'player',u)));this.selectedBuilding=null;this.selectedResource=null;this.selectedAnimal=null;this.attackMoveMode=false;this.patrolMode=false;this.placement=cancelPlacement(this.placement);this.drag=undefined;this.dragBox.setVisible(false);gameAudio.say(voiceSpeaker(this.allSelectable()),'select',this.factions.player);}
      this.syncVisuals();
    };window.addEventListener('keydown',groupKey);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>window.removeEventListener('keydown',groupKey));
    this.fogOverlay=this.add.graphics().setDepth(40);
    const fixture=document.getElementById('fog-fixture')!;fixture.hidden=!this.fogPreview;fixture.textContent=`FOG FIXTURE (${this.fogPreview}) – model preview; information filtering uses the player team`;
    this.scenarioSelect=document.querySelector<HTMLSelectElement>('#scenario-select')!;
    this.scenarioSelect.replaceChildren(...playableScenarios.map(id=>{const option=document.createElement('option');option.value=id;option.textContent=scenarioConfig[id].label;return option;}));
    this.scenarioSelect.value=this.scenario==='siege-test'?'survival':this.scenario;
    const changeScenario=()=>{if(!playableScenarios.includes(this.scenarioSelect.value as MatchScenario))return;this.session=changeOptions(this.session,{scenario:this.scenarioSelect.value as MatchScenario});this.scenario=this.session.options.scenario;this.syncSession();};
    const playerCount=document.getElementById('player-count-select') as HTMLSelectElement;
    const secondFaction=document.getElementById('ai-2-faction-select') as HTMLSelectElement,secondProfile=document.getElementById('ai-2-profile-select') as HTMLSelectElement;
    const secondDifficulty=document.getElementById('ai-2-difficulty-select') as HTMLSelectElement;
    const teamSelects=['player','enemy','ai-2'].map(id=>document.getElementById(`${id}-team-select`) as HTMLSelectElement);
    const changePlayers=()=>{if(this.session.phase!=='menu')return;const count=Number(playerCount.value),roster=matchPlayers(this.factions,this.session.options.aiProfile,count);if(count===3&&isFactionId(secondFaction.value)&&isAIProfile(secondProfile.value)){roster[2]={...roster[2],faction:secondFaction.value,profile:secondProfile.value,...(Object.hasOwn(difficultyProfiles,secondDifficulty.value)?{difficulty:secondDifficulty.value as Difficulty}:{})};}for(let i=0;i<roster.length;i++)roster[i].teamId=Number(teamSelects[i].value);const map=count===3&&!supportedPlayerCounts(this.session.options.map,this.session.options.scenario).includes(3)?'plains96':this.session.options.map;this.session=changeOptions(this.session,{map,players:count===3?roster:undefined});this.syncSession();};
    for(const select of [playerCount,secondFaction,secondProfile,secondDifficulty,...teamSelects]){select.addEventListener('change',changePlayers);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>select.removeEventListener('change',changePlayers));}
    const mapSelect=document.querySelector<HTMLSelectElement>('#map-select')!;
    const changeMap=()=>{if(this.session.phase==='menu'&&this.session.options.scenario==='skirmish'&&isMapId(mapSelect.value)){this.session=changeOptions(this.session,{map:mapSelect.value});this.syncSession();}};
    mapSelect.addEventListener('change',changeMap);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>mapSelect.removeEventListener('change',changeMap));
    this.scenarioSelect.addEventListener('change',changeScenario);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.scenarioSelect.removeEventListener('change',changeScenario));

    const difficultySelect=document.querySelector<HTMLSelectElement>('#difficulty-select')!;difficultySelect.value=this.difficulty;
    const speedSelect=document.querySelector<HTMLSelectElement>('#speed-select')!;const changeSpeed=()=>{const speed=Number(speedSelect.value);if(!isGameSpeed(speed))return;this.session=changeOptions(this.session,{speed});this.saveGamePreferences();this.syncSession();};speedSelect.addEventListener('change',changeSpeed);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>speedSelect.removeEventListener('change',changeSpeed));
    const aiSelect=document.getElementById('ai-profile-select') as HTMLSelectElement,changeAI=()=>{if(!isAIProfile(aiSelect.value))return;this.session=changeOptions(this.session,{aiProfile:aiSelect.value});this.saveGamePreferences();this.syncSession();};aiSelect.addEventListener('change',changeAI);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>aiSelect.removeEventListener('change',changeAI));
    const changeDifficulty=()=>{if(!Object.hasOwn(difficultyProfiles,difficultySelect.value))return;this.session=changeOptions(this.session,{difficulty:difficultySelect.value as Difficulty});this.difficulty=this.session.options.difficulty;this.saveGamePreferences();this.syncSession();};
    difficultySelect.addEventListener('change',changeDifficulty);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>difficultySelect.removeEventListener('change',changeDifficulty));

    const factionSelect=document.querySelector<HTMLSelectElement>('#faction-select')!;
    const changeFaction=()=>{if(this.session.phase!=='menu'||!isFactionId(factionSelect.value))return;this.session=changeOptions(this.session,{faction:factionSelect.value});this.factions=factionsForPlayer(factionSelect.value,this.session.options.enemyFaction);this.saveGamePreferences();this.syncSession();};
    factionSelect.addEventListener('change',changeFaction);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>factionSelect.removeEventListener('change',changeFaction));
    const enemyFactionSelect=document.querySelector<HTMLSelectElement>('#enemy-faction-select')!;
    const changeEnemyFaction=()=>{if(this.session.phase!=='menu'||enemyFactionSelect.value!==''&&!isFactionId(enemyFactionSelect.value))return;const enemyFaction=isFactionId(enemyFactionSelect.value)?enemyFactionSelect.value:undefined;this.session=changeOptions(this.session,{enemyFaction});this.factions=factionsForPlayer(this.session.options.faction??defaultFactions.player,enemyFaction);this.saveGamePreferences();this.syncSession();};
    enemyFactionSelect.addEventListener('change',changeEnemyFaction);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>enemyFactionSelect.removeEventListener('change',changeEnemyFaction));

    this.minimap=bindMinimap(document.querySelector<HTMLCanvasElement>('#minimap')!,()=>({data:visibleMinimapData(this.currentMatch()),scroll:this.visibleCamera(),viewport:this.visibleCamera()}),point=>this.setCameraScroll(point),()=>this.simulationActive());
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.minimap?.destroy());

    this.unloadMode=null;this.attackMoveMode=false;this.patrolMode=false;this.repairMode=false;this.spellMode=null;this.spellFeedback='';
    this.attackMoveButton=document.querySelector<HTMLButtonElement>('#attack-move')!;
    const beginAttackMove=()=>{
      if(!this.gameplayActive()||!this.gathering.units.some(u=>u.kind==='soldier'&&u.selected))return;
      this.spellMode=null;this.spellFeedback='';this.repairMode=false;this.patrolMode=false;this.attackMoveMode=true;this.placement=cancelPlacement(this.placement);this.drag=undefined;
      this.dragBox.setVisible(false);this.syncVisuals();
    };
    this.attackMoveButton.addEventListener('click',beginAttackMove);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.attackMoveButton.removeEventListener('click',beginAttackMove));
    this.queuePanel=document.getElementById('production-queue')!;
    const cancelJob=(event:MouseEvent)=>{
      if(!this.gameplayActive()||!selectedBase(this.currentMatch(),this.selectedBuilding)&&!['barracks','harbor'].includes(this.selectedBuilding??''))return;
      const button=event.target instanceof Element?event.target.closest<HTMLButtonElement>('button[data-job-id]'):null;
      if(!button||!this.queuePanel.contains(button))return;
      const p=this.selectedBuilding==='harbor'?this.navy!.production:selectedBase(this.currentMatch(),this.selectedBuilding)?.production??this.soldierProduction;
      const result=cancelProduction(this.gathering,p,button.dataset.jobId!,true);
      this.gathering=result.gathering;
      if(this.selectedBuilding==='harbor')this.navy={...this.navy!,production:result.production};else if(this.selectedBuilding==='base')this.production=result.production;else if(this.selectedBuilding?.startsWith('base-'))this.placement={...this.placement,bases:this.placement.bases!.map(b=>b.id===this.selectedBuilding?{...b,production:result.production}:b)};else this.soldierProduction=result.production;
      this.syncVisuals();
    };
    this.queuePanel.addEventListener('click',cancelJob);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.queuePanel.removeEventListener('click',cancelJob));
    this.shipLabels.clear();this.shipVisuals.clear();this.harborVisual=undefined;this.harborLabel=undefined;this.navyGraphics=this.add.graphics().setDepth(effectConfig.selectionDepth);
    this.projectileVisuals.clear();
    this.orderVisuals.clear();
    this.farmVisuals.clear();
    this.stopButton = document.querySelector<HTMLButtonElement>('#stop-units')!;
    const stop = () => { const before=voiceOrders(this.allSelectable());this.attackMoveMode=false;this.patrolMode=false;this.repairMode=false;this.spellMode=null;this.spellFeedback=''; if(this.gameplayActive())this.navy=cancelSelectedTransfers(this.currentMatch()).navy;this.gathering.units = stopSelected(this.gathering.units, this.gameplayActive());if(this.gameplayActive())this.navy=stopShips(this.navy);gameAudio.say(orderedSpeaker(before,this.allSelectable()),voiceOrderAction(orderedSpeaker(before,this.allSelectable())),this.factions.player); this.syncVisuals(); };
    for(const id of ['hold-position','patrol-units']){const button=document.getElementById(id)!,handler=()=>{if(!this.gameplayActive())return;if(id==='hold-position'){this.applyMatch(issueOrder(this.currentMatch(),{kind:'hold'},this.input.keyboard?.addKey('SHIFT').isDown??false));}else{this.patrolMode=!this.patrolMode;this.attackMoveMode=false;this.repairMode=false;this.spellMode=null;this.placement=cancelPlacement(this.placement);}this.syncVisuals();};button.addEventListener('click',handler);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>button.removeEventListener('click',handler));}
    this.stopButton.addEventListener('click', stop);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.stopButton.removeEventListener('click', stop));
    this.selectedResource=null;this.selectedAnimal=null;
    this.selectedBuilding = loaded?.view.building??null;
    this.rallyMarker = this.add.circle(0, 0, 8).setStrokeStyle(2, 0x7bd389).setDepth(6).setVisible(false);
    this.buildingRing = this.add.rectangle(0, 0, 0, 0).setOrigin(0).setStrokeStyle(2, 0xffdc73).setDepth(effectConfig.selectionDepth).setVisible(false);
    this.cameras.main.setBounds(0, 0, this.map.width, this.map.height).setZoom(1).setScroll(loaded?.view.camera.x??0,loaded?.view.camera.y??0);
    const resizeCamera=()=>{const oldView=this.visibleCamera(),v=viewportGeometry(this.scale.width,this.scale.height,this.map);const camera=this.cameras.main;camera.setViewport(v.camera.x,v.camera.y,v.camera.width,v.camera.height);camera.setBounds(0,0,this.map.width,this.map.height);this.setCameraScroll(clampCamera(oldView,this.map,this.visibleCamera()));this.drag=undefined;this.cameraDrag=undefined;this.dragBox?.setVisible(false);};
    resizeCamera();this.scale.on(Phaser.Scale.Events.RESIZE,resizeCamera);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.scale.off(Phaser.Scale.Events.RESIZE,resizeCamera));
    this.cameraDrag = undefined;
    this.cameraInput=bindCameraInput(this.game.canvas,()=>{const c=this.cameras.main;return {zoom:c.zoom,scroll:this.visibleCamera(),world:this.map,camera:{x:c.x,y:c.y,width:c.width,height:c.height}};},()=>this.simulationActive()&&!this.cameraDrag&&!this.drag,p=>{this.setCameraScroll(p);if(this.placement.active)this.previewPoint=this.worldPoint(this.input.activePointer);},(zoom,p,anchor)=>{this.cameras.main.setZoom(zoom);this.setCameraScroll(p);if(this.placement.active){this.previewPoint=anchor;this.syncPlacement();}});
    const cameraKey=(event:KeyboardEvent)=>{const shortcut=cameraShortcut(event.key,{...keyboardContext(event,this.gameplayActive()),ctrlKey:event.ctrlKey,metaKey:event.metaKey});if(!shortcut||this.drag||this.cameraDrag)return;event.preventDefault();const c=this.cameras.main,target=cameraFocus(shortcut==='base'?[this.gathering.base]:selectionFocusPoints(this.currentMatch(),this.selectedBuilding),this.map,this.visibleCamera());if(target){this.setCameraScroll(target);if(this.placement.active)this.previewPoint=this.worldPoint(this.input.activePointer);this.syncVisuals();}};
    window.addEventListener('keydown',cameraKey);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>window.removeEventListener('keydown',cameraKey));
    const clearCameraGestures=()=>{this.cameraDrag=undefined;this.drag=undefined;this.dragBox?.setVisible(false);};window.addEventListener('blur',clearCameraGestures);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{this.cameraInput?.destroy();window.removeEventListener('blur',clearCameraGestures);});
    const preventMiddle = (event: MouseEvent) => { if (event.button === 1) event.preventDefault(); };
    this.game.canvas.addEventListener('mousedown', preventMiddle);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.game.canvas.removeEventListener('mousedown', preventMiddle));
    this.restartPending = false;
    this.previewPoint = { x: 0, y: 0 };
    this.matchStatus = document.querySelector<HTMLElement>('#match-status')!;
    this.restartButton = document.querySelector<HTMLButtonElement>('#restart-match')!;
    const restart = () => this.sessionAction('restart');
    this.restartButton.addEventListener('click', restart);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.restartButton.removeEventListener('click', restart);
    });
    this.enemyVisuals.clear();
    this.habitats=wildlifeHabitats(this.map);
    const sceneryMap=createMap(this.map.id,this.map.terrainLayout??'legacy',this.map.resourceLayout??'groves',this.map.worldLayout??'original',this.map.design);
    const terrainChunks=new Map<string,Phaser.Textures.CanvasTexture>();
    const terrainOverlays:{texture:Phaser.Textures.CanvasTexture;edge:string;x:number;y:number}[]=[];
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{for(const key of terrainChunks.keys())this.textures.remove(key);});
    for (let row = 0; row < Math.ceil(this.map.height / this.map.tileSize); row++) {
      for (let column = 0; column < Math.ceil(this.map.width / this.map.tileSize); column++) {
        const detail=wildlifeDetails(column,row,sceneryMap);if(detail)this.wildlifeProps.push(this.add.image((column+.5)*this.map.tileSize,(row+.5)*this.map.tileSize,'world',detail).setOrigin(.5,.75).setDepth(-1));
        const rect = tileFootprint(this.map, { column, row })!;
        if(this.map.terrainLayout==='reference'){const chunkX=Math.floor(rect.x/512)*512,chunkY=Math.floor(rect.y/512)*512,key=`map-terrain-${chunkX}-${chunkY}`;let texture=terrainChunks.get(key);if(!texture){texture=this.textures.createCanvas(key,Math.min(512,this.map.width-chunkX),Math.min(512,this.map.height-chunkY))!;texture.setFilter(Phaser.Textures.FilterMode.NEAREST);terrainChunks.set(key,texture);this.add.image(chunkX,chunkY,key).setOrigin(0).setDepth(-10);}const tile=referenceTile(column,row,sceneryMap);texture.drawFrame('reference-terrain',tile.frame,rect.x-chunkX,rect.y-chunkY,false);for(const edge of tile.edges)terrainOverlays.push({texture,edge,x:rect.x-chunkX,y:rect.y-chunkY});if(referenceKind(column,row,sceneryMap)==='rock'&&(column+row)%2===0&&[[0,-1],[1,0],[0,1],[-1,0]].every(([dx,dy])=>referenceKind(column+dx,row+dy,sceneryMap)==='rock'))this.add.image(rect.x+12+((column*13^row*7)%9),rect.y+20+((column*11^row*17)%7),'reference-terrain',`crag-${((Math.imul(column+17,73856093)^Math.imul(row+31,19349663))>>>8)%4}`).setOrigin(.5,.75).setDepth(-9+row/this.map.height);continue;}
        this.add.image(rect.x,rect.y,'world',terrainImageFrame(column,row,this.map.id)).setOrigin(0).setDepth(-10);
        for(const detail of terrainDetails(column,row,this.map.id))this.add.image(rect.x,rect.y,'world',detail).setOrigin(0).setDepth(-9.5);
        for(const edge of terrainEdges(column,row,this.map.id))this.add.image(rect.x,rect.y,'world',edge).setOrigin(0).setDepth(-9);
      }
    }
    for(const o of terrainOverlays)o.texture.drawFrame('reference-terrain',o.edge,o.x,o.y,false);
    for(const texture of terrainChunks.values())texture.refresh();
    const upgradeButton=document.getElementById('upgrade-base') as HTMLButtonElement;
    const upgrade=()=>{if(selectedBase(this.currentMatch(),this.selectedBuilding)&&this.gameplayActive()){this.applyMatch(startBaseUpgrade(this.currentMatch()));this.syncVisuals();}};
    upgradeButton.addEventListener('click',upgrade);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>upgradeButton.removeEventListener('click',upgrade));
    this.baseVisual=this.add.image(this.gathering.base.x,this.gathering.base.y,'buildings',buildingFrame('base','player',0,5,this.factions.player)).setOrigin(.5,.75);
    this.baseLabel=this.add.text(this.gathering.base.x, this.gathering.base.y + 30, 'Base',
      { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5, 0);
    this.nodeVisual=this.add.image(this.gathering.node.position.x,this.gathering.node.position.y,'world','wood-available').setOrigin(resourceOrigin.x,resourceOrigin.y);
    this.goldVisual=this.add.image(this.gathering.gold!.position.x,this.gathering.gold!.position.y,'world','gold-available').setOrigin(resourceOrigin.x,resourceOrigin.y);
    this.add.text(this.gathering.gold!.position.x, this.gathering.gold!.position.y+26, 'Gold',
      {fontSize:'16px',color:'#ffffff'}).setOrigin(.5,0);
    this.academyVisual=undefined;this.extraBaseVisuals.clear();this.visuals.clear();this.defenseVisuals.clear();this.repairMode=false;this.spellMode=null;this.spellFeedback='';
    this.drag = undefined;
    this.dragBox = this.add.rectangle(0, 0, 0, 0, 0xffdc73, 0.1)
      .setOrigin(0).setStrokeStyle(1, 0xffdc73).setVisible(false).setDepth(60);
    this.placementClick = false;
    this.barracksVisual = undefined;
    const buildingSize = barracksConfig.tileSize * barracksConfig.footprintTiles;
    this.placementPreview = this.add.rectangle(0, 0, buildingSize, buildingSize)
      .setOrigin(0).setStrokeStyle(2, 0xffffff).setVisible(false).setDepth(50);
    this.buildButton = document.querySelector<HTMLButtonElement>('#build-barracks')!;
    this.placementStatus = document.querySelector<HTMLElement>('#placement-status')!;
    setActionLabel(this.buildButton,`Build ${factions[this.factions.player].buildingNames.barracks} – ${costLabel(factions[this.factions.player].buildings.barracks.cost)}`);
    const begin = (kind:'academy'|'base'|'harbor'|'barracks'|'farm'|'forge'|'tower'|'wall'|'gate'='barracks') => {
      if (!this.gameplayActive()) return;
      if (!this.gathering.units.some(u=>u.kind==='worker' && u.selected)) return;
      this.unloadMode=null;this.attackMoveMode=false;this.patrolMode=false;this.repairMode=false;this.spellMode=null;this.spellFeedback='';
      if(campaignActionReason(this.currentMatch(),`build-${kind}`))return;
      if(kind==='harbor'&&this.navy?.harbor)return;
      if(buildingAvailability(factions[this.factions.player],kind==='tower'||kind==='wall'||kind==='gate'?'base':kind,technologyFor(this.currentMatch(),'player')))return;
      this.placement = beginPlacement(this.placement,kind);
      this.drag = undefined;
      this.dragBox.setVisible(false);
      this.previewPoint = this.worldPoint(this.input.activePointer);
      this.syncVisuals();
    };
    const repairBegin=()=>{if(!this.gameplayActive()||!this.gathering.units.some(u=>u.kind==='worker'&&u.selected))return;this.unloadMode=null;this.attackMoveMode=false;this.patrolMode=false;this.placement=cancelPlacement(this.placement);this.repairMode=!this.repairMode;this.syncVisuals();};
    document.getElementById('repair-building')!.addEventListener('click',repairBegin);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>document.getElementById('repair-building')!.removeEventListener('click',repairBegin));
    const wallBuild=()=>begin('wall'),gateBuild=()=>begin('gate'),gateToggle=()=>{if(this.gameplayActive()&&this.selectedBuilding){this.applyMatch(toggleGate(this.currentMatch(),this.selectedBuilding));this.syncVisuals();}},towerBuild=()=>begin('tower'),towerUpgrade=()=>{if(this.gameplayActive()&&this.selectedBuilding)this.applyMatch(upgradeTower(this.currentMatch(),this.selectedBuilding));this.syncVisuals();};
    for(const [id,handler] of [['build-wall',wallBuild],['build-gate',gateBuild],['toggle-gate',gateToggle],['build-tower',towerBuild],['upgrade-tower',towerUpgrade]] as const){document.getElementById(id)!.addEventListener('click',handler);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>document.getElementById(id)!.removeEventListener('click',handler));}
    const cancel = (event?:KeyboardEvent) => {
      if(event&&!gameplayKeyAllowed(keyboardContext(event,this.gameplayActive())))return;
      if (!this.gameplayActive()) return;
      this.unloadMode=null;this.attackMoveMode=false;this.patrolMode=false;this.repairMode=false;this.spellMode=null;this.spellFeedback='';
      this.placement = cancelPlacement(this.placement);
      this.syncVisuals();
    };
    const beginBarracks=()=>begin();
    this.forgeVisual=undefined;
    const beginForge=()=>begin('forge');
    this.forgeButton=document.querySelector<HTMLButtonElement>('#build-forge')!;
    setActionLabel(this.forgeButton,`Build ${factions[this.factions.player].buildingNames.forge} – ${costLabel(factions[this.factions.player].buildings.forge.cost)}`);
    this.forgeButton.addEventListener('click',beginForge);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.forgeButton.removeEventListener('click',beginForge));
    this.researchButtons.clear();
    for(const kind of ['workerTools','attack','defense'] as const){
      const button=document.querySelector<HTMLButtonElement>(`#research-${kind}`)!;
      const research=()=>{const result=startResearch(this.gathering,this.research,this.placement,kind,this.gameplayActive(),hasMainBase(this.currentMatch()));this.gathering=result.gathering;this.research=result.research;this.syncVisuals();};
      this.researchButtons.set(kind,button);button.addEventListener('click',research);
      this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>button.removeEventListener('click',research));
    }
    const academyButton=document.getElementById('build-academy') as HTMLButtonElement,beginAcademy=()=>begin('academy');setActionLabel(academyButton,`Build ${factions[this.factions.player].buildingNames.academy} – ${costLabel(factions[this.factions.player].buildings.academy.cost)}`);academyButton.addEventListener('click',beginAcademy);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>academyButton.removeEventListener('click',beginAcademy));
    const beginBase=()=>begin('base'),baseButton=document.getElementById('build-base') as HTMLButtonElement;setActionLabel(baseButton,`Build ${factions[this.factions.player].buildingNames.base} – ${costLabel(extraBaseConfig.cost)}`);baseButton.addEventListener('click',beginBase);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>baseButton.removeEventListener('click',beginBase));
    const beginFarm=()=>begin('farm');
    this.farmButton=document.querySelector<HTMLButtonElement>('#build-farm')!;
    setActionLabel(this.farmButton,`Build ${factions[this.factions.player].buildingNames.farm} – ${costLabel(factions[this.factions.player].buildings.farm.cost)}`);
    this.farmButton.addEventListener('click',beginFarm);
    this.buildButton.addEventListener('click', beginBarracks);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.buildButton.removeEventListener('click', beginBarracks);
      this.farmButton.removeEventListener('click',beginFarm);
    });
    this.harborButton=document.querySelector<HTMLButtonElement>('#build-harbor')!;this.shipButton=document.querySelector<HTMLButtonElement>('#train-ship')!;
    const transportButton=document.querySelector<HTMLButtonElement>('#train-transport')!,unloadButton=document.querySelector<HTMLButtonElement>('#unload-transport')!;
    const naval=factions[this.factions.player].naval;
    setActionLabel(this.harborButton,`Build ${naval.harbor.name} – ${costLabel(naval.harbor.cost)}`);
    setActionLabel(this.shipButton,`Train ${naval.units.warship.name} – ${costLabel(naval.units.warship.cost)}`);
    setActionLabel(transportButton,`Train ${naval.units.transport.name} – ${costLabel(naval.units.transport.cost)}`);
    const trainTransport=()=>{if(!this.gameplayActive()||this.selectedBuilding!=='harbor')return;this.applyMatch(trainShip(this.currentMatch(),'transport'));this.syncVisuals();};
    const beginUnload=()=>{const ship=this.navy?.ships.find(s=>s.selected&&s.role==='transport'&&s.passengers?.length);if(!this.gameplayActive()||!ship)return;const before=this.currentMatch(),after=requestTransport(before,ship.id,'unload');this.applyMatch(after);this.unloadMode=after===before?ship.id:null;this.placement=cancelPlacement(this.placement);this.attackMoveMode=false;this.patrolMode=false;this.drag=undefined;this.dragBox.setVisible(false);this.syncVisuals();};
    transportButton.addEventListener('click',trainTransport);unloadButton.addEventListener('click',beginUnload);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{transportButton.removeEventListener('click',trainTransport);unloadButton.removeEventListener('click',beginUnload);});
    const beginHarbor=()=>begin('harbor'),ship=()=>{if(!this.gameplayActive()||this.selectedBuilding!=='harbor')return;this.applyMatch(trainShip(this.currentMatch()));this.syncVisuals();};
    this.harborButton.addEventListener('click',beginHarbor);this.shipButton.addEventListener('click',ship);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{this.harborButton.removeEventListener('click',beginHarbor);this.shipButton.removeEventListener('click',ship);});
    this.trainButton = document.querySelector<HTMLButtonElement>('#train-worker')!;
    this.productionStatus = document.querySelector<HTMLElement>('#production-status')!;
    setActionLabel(this.trainButton,`Train ${factions[this.factions.player].unitNames.worker} – ${costLabel(factions[this.factions.player].units.worker.cost)}`);
    const train = () => {
      if(!this.gameplayActive())return;
      this.applyMatch(trainBaseWorker(this.currentMatch(),this.selectedBuilding));
      this.syncVisuals();
    };
    this.trainButton.addEventListener('click', train);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.trainButton.removeEventListener('click', train);
    });
    this.soldierButton = document.querySelector<HTMLButtonElement>('#train-soldier')!;
    this.soldierProductionStatus = document.querySelector<HTMLElement>('#soldier-production-status')!;
    setActionLabel(this.soldierButton,`Train ${factions[this.factions.player].unitNames.soldier} – ${costLabel(factions[this.factions.player].units.soldier.cost)} · ${factions[this.factions.player].units.soldier.durationSeconds} s`);
    const trainSoldier = () => {
      if (!allowsProduction(this.selectedBuilding, 'barracks', this.placement.barracks !== null, this.gameplayActive())) return;
      const result = enqueueProduction(this.gathering, this.soldierProduction,
        { kind: 'barracks', bounds:this.map,technology:technologyFor(this.currentMatch(),'player'), footprint: this.placement.barracks, ready:barracksReady(this.placement) },matchPopulation(this.currentMatch()));
      this.gathering = result.gathering;
      this.soldierProduction = result.production;
      this.syncVisuals();
    };
    this.archerButton=document.querySelector<HTMLButtonElement>('#train-archer')!;
    setActionLabel(this.archerButton,`Train ${factions[this.factions.player].unitNames.archer} – ${costLabel(factions[this.factions.player].units.archer.cost)}`);
    const trainArcher=()=>{
      if(!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive()))return;
      const result=enqueueProduction(this.gathering,this.soldierProduction,
        {kind:'barracks',bounds:this.map,technology:technologyFor(this.currentMatch(),'player'),footprint:this.placement.barracks,ready:barracksReady(this.placement),unitType:'archer'},
        matchPopulation(this.currentMatch()));
      this.gathering=result.gathering;this.soldierProduction=result.production;this.syncVisuals();
    };
    this.catapultButton=document.querySelector<HTMLButtonElement>('#train-catapult')!;
    setActionLabel(this.catapultButton,`Train ${factions[this.factions.player].unitNames.catapult} – ${costLabel(factions[this.factions.player].units.catapult.cost)}`);
    const trainCatapult=()=>{
      if(!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive()))return;
      const result=enqueueProduction(this.gathering,this.soldierProduction,
        {kind:'barracks',bounds:this.map,technology:technologyFor(this.currentMatch(),'player'),footprint:this.placement.barracks,ready:barracksReady(this.placement),unitType:'catapult'},
        matchPopulation(this.currentMatch()));
      this.gathering=result.gathering;this.soldierProduction=result.production;this.syncVisuals();
    };
    this.specialistButton=document.querySelector<HTMLButtonElement>('#train-specialist')!;
    const specialist=factions[this.factions.player].units.specialist;
    setActionLabel(this.specialistButton,`Train ${factions[this.factions.player].unitNames.specialist} – ${costLabel(specialist.cost)} · ${specialist.durationSeconds} s`);
    const trainSpecialist=()=>{
      if(!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive()))return;
      const result=enqueueProduction(this.gathering,this.soldierProduction,
        {kind:'barracks',bounds:this.map,technology:technologyFor(this.currentMatch(),'player'),footprint:this.placement.barracks,ready:barracksReady(this.placement),unitType:'specialist'},matchPopulation(this.currentMatch()));
      this.gathering=result.gathering;this.soldierProduction=result.production;this.syncVisuals();
    };
    this.specialistButton.addEventListener('click',trainSpecialist);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.specialistButton.removeEventListener('click',trainSpecialist));
    this.catapultButton.addEventListener('click',trainCatapult);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.catapultButton.removeEventListener('click',trainCatapult));
    this.archerButton.addEventListener('click',trainArcher);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.archerButton.removeEventListener('click',trainArcher));
    this.soldierButton.addEventListener('click', trainSoldier);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.soldierButton.removeEventListener('click', trainSoldier);
    });
    for(const slot of spellSlots){const button=document.getElementById(`cast-${slot}`) as HTMLButtonElement,begin=()=>{const id=spellForSlot(this.factions.player,slot);if(!id)return;const caster=selectedSpellCaster(this.currentMatch(),id);if(!caster||spellCasterReason(this.currentMatch(),caster.id,id))return;this.placement=cancelPlacement(this.placement);this.unloadMode=null;this.attackMoveMode=false;this.patrolMode=false;this.repairMode=false;this.spellMode=this.spellMode===id?null:id;this.spellFeedback='';this.syncVisuals();};button.addEventListener('click',begin);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>button.removeEventListener('click',begin));}
    const airButton=document.getElementById('train-air') as HTMLButtonElement,trainAir=()=>{if(!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive()))return;const result=enqueueProduction(this.gathering,this.soldierProduction,{kind:'barracks',bounds:this.map,technology:technologyFor(this.currentMatch(),'player'),footprint:this.placement.barracks,ready:barracksReady(this.placement),unitType:'air'},matchPopulation(this.currentMatch()));this.gathering=result.gathering;this.soldierProduction=result.production;this.syncVisuals();};airButton.addEventListener('click',trainAir);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>airButton.removeEventListener('click',trainAir));
    const abilityButton=document.querySelector<HTMLButtonElement>('#unit-ability')!;
    const activateAbility=()=>{this.gathering=useAbility(this.gathering,this.gameplayActive());this.syncVisuals();};
    abilityButton.addEventListener('click',activateAbility);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>abilityButton.removeEventListener('click',activateAbility));
    const saveButton=document.getElementById('save-match') as HTMLButtonElement;
    const loadButton=document.getElementById('load-match') as HTMLButtonElement;
    const save=()=>{if(this.session.phase==='menu'||this.restartPending)return;const result=storeSave(()=>window.localStorage,this.currentMatch(),{camera:{x:this.visibleCamera().x,y:this.visibleCamera().y},building:savedBuildingSelection(this.selectedBuilding)});document.getElementById('save-status')!.textContent=result.ok?uiText.savedLocallyInSlot1:uiText.couldNotSaveLocallyCheckBrowserStorage;};
    const load=()=>{if(this.restartPending)return;const result=readSave(()=>window.localStorage);if(!result.ok){document.getElementById('save-status')!.textContent=result.code==='missing'?result.error:result.code==='version'?uiText.thisSaveUsesAnUnsupportedFormatOrGame:uiText.couldNotReadTheSaveTheActiveMatch;return;}this.awaitingLoadedResume=result.match.outcome==='playing';this.pendingLoad={match:{...result.match,paused:true},view:result.view};this.scenario=result.match.scenario!;this.difficulty=result.match.difficulty!;this.session={options:{players:result.match.multiplePlayers?.roster,aiProfile:result.match.aiProfile,scenario:this.scenario,difficulty:this.difficulty,map:result.match.map.id??'arena',faction:result.match.factions?.player??defaultFactions.player,enemyFaction:result.match.factions?.enemy??defaultFactions.enemy,speed:result.match.speed??1},phase:result.match.outcome==='playing'?'paused':'ended'};this.skipGameplayFrame=true;this.restartPending=true;this.restartButton.disabled=true;gameAudio.setPhase(this.session.phase);document.getElementById('save-status')!.textContent=result.match.outcome==='playing'?uiText.loadedPausedNoGameplayTimePassesUntilResume:uiText.loadedCompletedMatch;this.scene.restart();};
    saveButton.addEventListener('click',save);loadButton.addEventListener('click',load);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{saveButton.removeEventListener('click',save);loadButton.removeEventListener('click',load);});
    for(const [id,action] of [['start-match','start'],['pause-match','pause'],['resume-match','resume'],['new-match','new-match']] as const){const button=document.getElementById(id)!;const handler=()=>this.sessionAction(action);button.addEventListener('click',handler);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>button.removeEventListener('click',handler));}
    const dismissButton=document.getElementById('dismiss-units') as HTMLButtonElement,dialog=document.getElementById('dismiss-dialog') as HTMLDialogElement,cancelDismiss=document.getElementById('dismiss-cancel')!,confirmDismiss=document.getElementById('dismiss-confirm')!;
    const closeDismiss=()=>{this.pendingDismiss=undefined;dialog.close();this.skipGameplayFrame=true;this.syncVisuals();this.game.canvas.focus();};
    const requestDismiss=()=>{const proposal=dismissProposal(this.currentMatch());if(!proposal||this.pendingDismiss)return;this.pendingDismiss=proposal;this.drag=undefined;this.cameraDrag=undefined;this.dragBox.setVisible(false);document.getElementById('dismiss-message')!.textContent=dismissMessage(proposal);dialog.showModal();this.syncVisuals();};
    const confirm=()=>{const proposal=this.pendingDismiss;if(!proposal)return;closeDismiss();this.applyMatch(dismissUnits(this.currentMatch(),proposal.ids));if(this.outcome!=='playing')this.session=sessionTransition(this.session,'end');this.syncVisuals();};
    const cancelDialog=(event:Event)=>{event.preventDefault();closeDismiss();};
    dismissButton.addEventListener('click',requestDismiss);cancelDismiss.addEventListener('click',closeDismiss);confirmDismiss.addEventListener('click',confirm);dialog.addEventListener('cancel',cancelDialog);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{dismissButton.removeEventListener('click',requestDismiss);cancelDismiss.removeEventListener('click',closeDismiss);confirmDismiss.removeEventListener('click',confirm);dialog.removeEventListener('cancel',cancelDialog);this.pendingDismiss=undefined;dialog.close();});
    const unbindCheat=bindCheatInput(()=>this.gameplayActive()&&!this.pendingDismiss,code=>{
      const before=this.currentMatch(),after=applyResourceCheat(before,code);
      if(after===before)return false;
      this.applyMatch(after);this.syncVisuals();return true;
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,unbindCheat);
    const actionKey=(event:KeyboardEvent)=>{
      if(this.pendingDismiss)return;
      const menuContext={...keyboardContext(event,this.session.phase==='playing'||this.session.phase==='paused'),ctrlKey:event.ctrlKey,metaKey:event.metaKey};
      if(!event.ctrlKey&&!event.metaKey&&gameplayKeyAllowed(menuContext)&&(event.key.toLowerCase()==='p'||event.key==='Escape'&&(this.session.phase==='paused'||!this.placement.active&&!this.attackMoveMode&&!this.patrolMode&&!this.repairMode&&!this.spellMode&&!this.unloadMode))){event.preventDefault();this.sessionAction(this.session.phase==='paused'?'resume':'pause');return;}
      const context={...keyboardContext(event,this.gameplayActive()),ctrlKey:event.ctrlKey,metaKey:event.metaKey};
      if(event.key==='Escape'&&!event.ctrlKey&&!event.metaKey&&gameplayKeyAllowed(context)){event.preventDefault();cancel(event);return;}
      if(!hotkeyButton(event.key,context))return;event.preventDefault();
      dispatchHotkey(event.key,context,id=>document.querySelector<HTMLButtonElement>(`#${id}`));
    };window.addEventListener('keydown',actionKey);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>window.removeEventListener('keydown',actionKey));
    this.syncVisuals();
    this.input.mouse?.disableContextMenu();
    this.input.on('pointerdown', this.handleDown, this);
    this.input.on('pointermove', this.handleMove, this);
    this.input.on('pointerup', this.handleUp, this);
    this.input.on('pointerupoutside', this.handleUp, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off('pointerdown', this.handleDown, this);
      this.input.off('pointermove', this.handleMove, this);
      this.input.off('pointerup', this.handleUp, this);
      this.input.off('pointerupoutside', this.handleUp, this);
    });
  }

  private simulationActive():boolean{return this.session.phase==='playing'&&this.outcome==='playing'&&!this.restartPending&&!this.pendingDismiss;}
  private gameplayActive():boolean{return this.simulationActive()&&(!this.multiplePlayers||hasMainBase(this.currentMatch()));}
  private sessionAction(action:SessionAction):void {
    if(this.pendingDismiss)return;
    if(action==='start'&&this.session.phase==='menu'&&!this.restartPending){
      const mission=currentHomePage()==='campaign'?campaignMissionForScenario(this.session.options.scenario):undefined;
      if(currentHomePage()==='campaign'&&!mission)return;
      if(mission){const start=startCampaignMission(campaignStore.get(identityFor(this.session.options.faction??defaultFactions.player,this.session.options.difficulty)),mission.id,this.session.options.difficulty,factionsForPlayer(this.session.options.faction??defaultFactions.player,this.session.options.enemyFaction),this.session.options.speed??1);if(!start)return;this.campaignRun=start.campaignRun;this.session=changeOptions(this.session,{faction:start.factions!.player,enemyFaction:start.factions!.enemy});}
      this.campaignMission=mission?.id;if(!mission)this.campaignRun=undefined;
    }
    const next=sessionTransition(this.session,action);if(next===this.session||this.restartPending)return;
    this.session=action==='new-match'?changeOptions(next,getPreferences().game):next;gameAudio.setPhase(next.phase);
    if(action==='start')this.factions=factionsForPlayer(next.options.faction??defaultFactions.player,next.options.enemyFaction);
    if(action==='start'||action==='restart'){this.awaitingLoadedResume=false;this.scenario=next.options.scenario;this.difficulty=next.options.difficulty;this.skipGameplayFrame=true;this.restartPending=true;this.restartButton.disabled=true;this.scene.restart();return;}
    if(action==='resume'){this.skipGameplayFrame=true;if(this.awaitingLoadedResume){document.getElementById('save-status')!.textContent=uiText.loadedMatchResumed;this.awaitingLoadedResume=false;}}
    if(action==='pause'||action==='new-match'){this.placement=cancelPlacement(this.placement);this.unloadMode=null;this.attackMoveMode=false;this.patrolMode=false;this.repairMode=false;this.spellMode=null;this.spellFeedback='';this.drag=undefined;this.cameraDrag=undefined;this.dragBox.setVisible(false);}
    if(action==='new-match'){if(this.session.options.scenario!=='skirmish')this.session={...this.session,options:{...this.session.options,map:scenarioConfig[this.session.options.scenario].map}};this.applyMatch(createMatch(this.session.options.scenario,this.session.options.difficulty,factionsForPlayer(this.session.options.faction??defaultFactions.player,this.session.options.enemyFaction),this.session.options.map,this.session.options.speed??1,this.session.options.aiProfile));this.selectedBuilding=null;this.controlGroups={};}
    this.syncVisuals();
  }
  private saveGamePreferences():void {if(this.session.phase==='menu')updatePreferences({game:{aiProfile:this.session.options.aiProfile,difficulty:this.session.options.difficulty,faction:this.session.options.faction??defaultFactions.player,enemyFaction:this.session.options.enemyFaction,speed:this.session.options.speed??1}});}

  private syncSession():void {
    gameAudio.setPhase(this.session.phase);
    if(gameAudio.status.loaded)document.getElementById('audio-status')!.textContent=`${gameAudio.status.loaded}/${audioFiles.length} sounds loaded · ${gameAudio.settings.muted?uiText.muted:this.session.phase==='paused'?'paused':'ready'}${gameAudio.voices.status.available?'':' · Unit voices unavailable'}`;
    (document.getElementById('save-match') as HTMLButtonElement).disabled=this.session.phase==='menu'||this.restartPending;
    (document.getElementById('load-match') as HTMLButtonElement).disabled=this.restartPending;
    const phase=this.session.phase,menu=phase==='menu';
    if(phase==='ended'){campaignStore.record(this.currentMatch());highscoreStore.record(this.currentMatch());}
    renderHighscorePanels(this.currentMatch(),phase==='ended');
    renderMatchResults(document.getElementById('match-results')!,this.currentMatch(),phase==='ended');
    const inCampaign=menu&&currentHomePage()==='campaign';
    const chosenMission=campaignMissionForScenario(this.session.options.scenario);
    const shown=inCampaign&&chosenMission?{...this.session.options,map:seriesMissionPlan(chosenMission.id,identityFor(this.session.options.faction??defaultFactions.player,this.session.options.difficulty).campaignId).map}:this.session.options;
    const details=matchSettingDetails(shown);document.getElementById('map-description')!.textContent=details.map;document.getElementById('difficulty-description')!.textContent=details.difficulty;
    const summary=document.getElementById('match-options-summary')!;summary.textContent=matchSettingsSummary(shown);summary.hidden=!menu;
    // Native menus keep a tentative selection until Enter/click commits it.
    const syncSelectValue=(select:HTMLSelectElement,value:string)=>{if(!select.matches(':open')&&select.value!==value)select.value=value;};
    const syncSelectDisabled=(select:HTMLSelectElement,disabled:boolean)=>{if(select.disabled!==disabled)select.disabled=disabled;};
    const counts=this.session.options.scenario==='skirmish'?[2,3]:[2],playerCount=document.getElementById('player-count-select') as HTMLSelectElement;
    if(playerCount.dataset.map!==counts.join(',')){playerCount.replaceChildren(...counts.map(n=>new Option(`You + ${n-1} AI`,String(n))));playerCount.dataset.map=counts.join(',');}
    playerCount.parentElement!.hidden=this.session.options.scenario!=='skirmish';
    syncSelectValue(playerCount,String(this.session.options.players?.length??2));syncSelectDisabled(playerCount,!menu);
    document.getElementById('additional-ai-settings')!.hidden=!this.session.options.players;
    document.getElementById('team-settings')!.hidden=!this.session.options.players;
    if(this.session.options.players)for(const p of this.session.options.players){const select=document.getElementById(`${p.id}-team-select`) as HTMLSelectElement;syncSelectValue(select,String(p.teamId));syncSelectDisabled(select,!menu);}
    const secondFaction=document.getElementById('ai-2-faction-select') as HTMLSelectElement,secondProfile=document.getElementById('ai-2-profile-select') as HTMLSelectElement;
    const secondDifficulty=document.getElementById('ai-2-difficulty-select') as HTMLSelectElement;
    for(const select of [secondFaction,secondProfile,secondDifficulty])syncSelectDisabled(select,!menu);
    if(this.session.options.players){syncSelectValue(secondFaction,this.session.options.players[2].faction);syncSelectValue(secondProfile,this.session.options.players[2].profile);syncSelectValue(secondDifficulty,this.session.options.players[2].difficulty??'');}
    const legend=document.getElementById('minimap-player-legend')!;legend.replaceChildren(...(this.session.options.players??[]).map(p=>{const span=document.createElement('span');span.textContent=`${p.id==='player'?'You':p.id==='enemy'?'AI1':'AI2'} T${p.teamId}`;const eliminated=!!this.multiplePlayers&&playerEliminated(this.currentMatch(),p.id);if(eliminated)span.textContent+=' ×';span.title=eliminated?'Eliminated: base destroyed; surviving assets inactive':'Active player';span.style.color=p.color;return span;}));
    document.getElementById('player-color-summary')!.textContent=this.session.options.players?this.session.options.players.map(p=>`${p.id==='player'?'Blue: You':p.id==='enemy'?'Red: AI 1':'Gold: AI 2'} · Team ${p.teamId}`).join(' / '):'Blue: You · Red: AI 1';
    const mapSelect=document.querySelector<HTMLSelectElement>('#map-select')!;syncSelectDisabled(mapSelect,!menu||this.session.options.scenario!=='skirmish');syncSelectValue(mapSelect,shown.map);
    const factionSelect=document.querySelector<HTMLSelectElement>('#faction-select')!;syncSelectDisabled(factionSelect,!menu);syncSelectValue(factionSelect,shown.faction??defaultFactions.player);const enemyFactionSelect=document.querySelector<HTMLSelectElement>('#enemy-faction-select')!;syncSelectDisabled(enemyFactionSelect,!menu||inCampaign);syncSelectValue(enemyFactionSelect,shown.enemyFaction??'');
    syncSelectDisabled(this.scenarioSelect,!menu);syncSelectValue(this.scenarioSelect,this.session.options.scenario==='siege-test'?'survival':this.session.options.scenario);
    const speed=document.querySelector<HTMLSelectElement>('#speed-select')!;syncSelectDisabled(speed,!menu);syncSelectValue(speed,String(this.session.options.speed??1));
    const aiSelect=document.getElementById('ai-profile-select') as HTMLSelectElement;syncSelectValue(aiSelect,this.session.options.aiProfile??'balanced');syncSelectDisabled(aiSelect,!menu);document.getElementById('ai-profile-description')!.textContent=aiProfiles[this.session.options.aiProfile??'balanced'].description;
    const difficulty=document.querySelector<HTMLSelectElement>('#difficulty-select')!;syncSelectDisabled(difficulty,!menu);syncSelectValue(difficulty,this.session.options.difficulty);
    for(const [id,show] of [['start-match',menu],['pause-match',phase==='playing'],['resume-match',phase==='paused'],['new-match',!menu],['restart-match',phase==='paused'||phase==='ended']] as const)(document.getElementById(id) as HTMLButtonElement).hidden=!show;
    (document.getElementById('gameplay-controls') as HTMLFieldSetElement).disabled=!this.gameplayActive();
    document.getElementById('hud')!.hidden=menu||phase==='ended';const game=document.getElementById('game')!,wasHidden=game.hidden;game.hidden=menu||phase==='ended';
    if(wasHidden&&!menu)this.scale.refresh();
    document.getElementById('mission-instruction')!.textContent=this.session.options.scenario==='skirmish'?(regionDefinition(this.session.options.map??'arena',maps[this.session.options.map??'arena'],'regions').instruction??scenarioConfig.skirmish.instruction):scenarioConfig[this.session.options.scenario].instruction;
    document.getElementById('session-status')!.textContent=isSpectating(this.currentMatch())?"Spectating your team · Your base was destroyed. Camera only; no gameplay orders. Use the match menu to leave.":menu?uiText.chooseAScenarioAndDifficultyThenStartMatch:phase==='paused'?uiText.pausedSimulationIsFrozen:phase==='ended'?uiText.theMatchHasEndedRestartOrChooseA:`${scenarioConfig[this.session.options.scenario].label} · ${this.session.options.difficulty} · ${aiProfiles[this.session.options.aiProfile??'balanced'].label} AI · ${maps[(menu?this.session.options.map:this.map.id)??'arena'].label}`;
    syncHomeMenu(phase);syncSkirmishMenu(menu&&currentHomePage()==='skirmish',this.session.options);syncResultScreen(phase);
  }

  private visibleCamera(){const c=this.cameras.main;return visibleCamera({x:c.scrollX,y:c.scrollY},c,c.zoom);}
  private setCameraScroll(point:Position):void {const c=this.cameras.main,p=cameraScroll(point,c,c.zoom);c.setScroll(p.x,p.y);}

  private worldPoint(pointer: Phaser.Input.Pointer): Position {
    pointer.updateWorldPoint(this.cameras.main);
    return { x: pointer.worldX, y: pointer.worldY };
  }

  private screenPoint(pointer: Phaser.Input.Pointer): Position {
    const event = pointer.event;
    const point = 'clientX' in event ? event : event.changedTouches[0];
    return { x: point.clientX, y: point.clientY };
  }

  private handleDown(pointer: Phaser.Input.Pointer): void {
    if(!this.gameplayActive())return;
    const before=voiceOrders(this.allSelectable());
    this.processDown(pointer);
    gameAudio.say(orderedSpeaker(before,this.allSelectable()),voiceOrderAction(orderedSpeaker(before,this.allSelectable())),this.factions.player);
    gameAudio.say(failedOrderSpeaker(before,this.allSelectable()),'error',this.factions.player);
  }

  private processDown(pointer: Phaser.Input.Pointer): void {
    if (!this.gameplayActive()) return;
    if(pointer.event.target instanceof Element&&pointer.event.target.closest('#hud, #match-menu, #game-toolbar, #minimap-overlay, #top-bar, #bottom-bar'))return;
    const camera=this.cameras.main;if(pointer.x<camera.x||pointer.y<camera.y||pointer.x>=camera.x+camera.width||pointer.y>=camera.y+camera.height)return;
    this.game.canvas.focus({preventScroll:true});
    if (pointer.button === 1) {
      if (this.drag) return;
      this.cameraDrag = { screen: { x: pointer.x, y: pointer.y },
        scroll: this.visibleCamera() };
      return;
    }
    if (this.cameraDrag) return;
    const world = this.worldPoint(pointer);
    const animal=animalAt(this.currentMatch(),world);
    if(animal&&!this.placement.active&&!this.spellMode&&!this.unloadMode&&!this.repairMode&&!this.patrolMode&&!this.attackMoveMode&&(pointer.button===0||pointer.button===2)){
      this.drag=undefined;this.placementClick=true;
      if(pointer.button===0){this.selectedAnimal=animal.id;this.selectedBuilding=null;this.selectedResource=null;gameAudio.play(`animal-${animal.type}`);}
      else this.applyMatch(issueOrder(this.currentMatch(),{kind:'hunt',animalId:animal.id},'shiftKey' in pointer.event&&pointer.event.shiftKey));
      this.syncVisuals();return;
    }

    if(this.spellMode&&(pointer.button===0||pointer.button===2)){this.placementClick=true;if(pointer.button===2){this.spellMode=null;this.spellFeedback='';}else{const id=this.spellMode,caster=selectedSpellCaster(this.currentMatch(),id),target=spellTargetAt(this.currentMatch(),id,world);const result=caster&&target?castSpell(this.currentMatch(),caster.id,id,target):{match:this.currentMatch(),reason:'Choose a valid visible target'};this.spellFeedbackError=!!result.reason;this.spellFeedback=result.reason??`${spellDefinition(id,this.factions.player).name} cast`;if(!result.reason){this.applyMatch(result.match);this.spellMode=null;}}this.syncVisuals();return;}
    if(this.unloadMode&&(pointer.button===0||pointer.button===2)){this.placementClick=true;if(pointer.button===2)this.unloadMode=null;else{const before=this.currentMatch(),after=unloadTransport(before,this.unloadMode,world);if(after!==before){this.applyMatch(after);this.unloadMode=null;}}this.syncVisuals();return;}
    if(this.repairMode&&(pointer.button===0||pointer.button===2)){this.repairMode=false;this.spellMode=null;this.spellFeedback='';this.placementClick=true;this.applyMatch(orderRepair(this.currentMatch(),inspectBuildingAt(this.currentMatch(),world)));this.syncVisuals();return;}
    if(this.patrolMode&&(pointer.button===0||pointer.button===2)){this.patrolMode=false;this.placementClick=true;if(pointer.button===0)this.applyMatch(issueOrder(this.currentMatch(),{kind:'patrol',destination:world},'shiftKey' in pointer.event&&pointer.event.shiftKey));this.syncVisuals();return;}
    if(this.attackMoveMode&&(pointer.button===0||pointer.button===2)) {
      this.unloadMode=null;this.attackMoveMode=false;this.patrolMode=false;this.repairMode=false;this.spellMode=null;this.spellFeedback='';this.placementClick=true;
      if(pointer.button===0)this.applyMatch(issueOrder(this.currentMatch(),{kind:'attack-move',destination:world},'shiftKey' in pointer.event&&pointer.event.shiftKey));
      this.syncVisuals();return;
    }
    if (this.placement.active) {
      this.placementClick = true;
      this.previewPoint = world;
      if (pointer.button === 2) {
        this.placement = cancelPlacement(this.placement);
      } else if (pointer.button === 0) {
        if(!placementVisible(this.fog,buildingFootprint(world,this.placement.kind??'barracks'))){this.syncVisuals();return;}
        if(this.placement.kind==='tower'||this.placement.kind==='wall'||this.placement.kind==='gate'){const match=this.currentMatch(),next=placeTower(match,world);if(next===match)this.rememberPlacementError(world,towerPlacementError(match,world));this.applyMatch(next);this.syncVisuals();return;}
        if(this.placement.kind==='harbor'){const match=this.currentMatch(),next=placeHarbor(match,world);if(next===match)this.rememberPlacementError(world,harborPlacementError(match,world));this.applyMatch(next);this.syncVisuals();return;}
        const result = placeBuilding(this.placement, world, this.gathering.wood, placementObstacles(this.gathering),
          {technology:technologyFor(this.currentMatch(),'player'),map:this.map,gathering:this.gathering,enemies:this.combat.enemies});
        if(result.placement===this.placement)this.rememberPlacementError(world,placementError(this.placement,world,this.gathering.wood,placementObstacles(this.gathering),{technology:technologyFor(this.currentMatch(),'player'),map:this.map,gathering:this.gathering,enemies:this.combat.enemies}));
        if (result.map) this.map = result.map;
        this.placement = result.placement;
        this.gathering = 'gathering' in result && result.gathering ? result.gathering : { ...this.gathering, wood: result.wood };
      }
      this.syncVisuals();
      return;
    }
    if (pointer.button === 0) {
      this.drag = { world, screen: this.screenPoint(pointer), active: false,shift:'shiftKey' in pointer.event&&pointer.event.shiftKey };
    } else if (pointer.button === 2) {
      if(this.selectedBuilding||this.gathering.units.some(u=>u.selected))gameAudio.play('command');
      if (this.selectedBuilding) {
        if(!selectedBase(this.currentMatch(),this.selectedBuilding)&&this.selectedBuilding!=='barracks'){this.syncVisuals();return;}
        if (this.selectedBuilding === 'base') this.production = setRally(this.production, world, this.map,
          baseFootprint(this.gathering.base), 'base');
        else if(this.selectedBuilding.startsWith('base-'))this.placement={...this.placement,bases:this.placement.bases!.map(b=>b.id===this.selectedBuilding?{...b,production:setRally(b.production,world,this.map,b.footprint,'base')}:b)};
        else this.soldierProduction = setRally(this.soldierProduction, world, this.map, this.placement.barracks, 'barracks');
        this.syncVisuals();
        return;
      }
      const transport=this.navy?.ships.find(s=>s.role==='transport'&&Math.abs(world.x-s.position.x)<=navyConfig.ship.size/2&&Math.abs(world.y-s.position.y)<=navyConfig.ship.size/2);if(transport&&this.gathering.units.some(u=>u.selected)){this.applyMatch(requestTransport(this.currentMatch(),transport.id,'load'));this.syncVisuals();return;}
      const harbor=this.navy?.harbor;if(harbor&&harbor.construction.remainingSeconds>0&&world.x>=harbor.footprint.x&&world.x<=harbor.footprint.x+64&&world.y>=harbor.footprint.y&&world.y<=harbor.footprint.y+64){this.applyMatch(resumeHarbor(this.currentMatch()));this.syncVisuals();return;}
      const tower=this.placement.defenses?.find(t=>t.construction.remainingSeconds>0&&world.x>=t.footprint.x&&world.x<=t.footprint.x+t.footprint.width&&world.y>=t.footprint.y&&world.y<=t.footprint.y+32);if(tower){const result=resumeConstruction(this.gathering,this.placement,this.map,tower.id);this.gathering=result.gathering;this.placement=result.placement;this.syncVisuals();return;}
      const forge=this.placement.forge;
      if(forge&&forge.construction.remainingSeconds>0&&world.x>=forge.footprint.x&&world.x<=forge.footprint.x+forge.footprint.width&&world.y>=forge.footprint.y&&world.y<=forge.footprint.y+forge.footprint.height){const result=resumeConstruction(this.gathering,this.placement,this.map,'forge');this.gathering=result.gathering;this.placement=result.placement;this.syncVisuals();return;}
      const academy=this.placement.academy;if(academy&&academy.construction.remainingSeconds>0&&world.x>=academy.footprint.x&&world.x<=academy.footprint.x+64&&world.y>=academy.footprint.y&&world.y<=academy.footprint.y+64){const r=resumeConstruction(this.gathering,this.placement,this.map,'academy');this.gathering=r.gathering;this.placement=r.placement;this.syncVisuals();return;}
      const expansion=this.placement.bases?.find(b=>b.construction.remainingSeconds>0&&world.x>=b.footprint.x&&world.x<=b.footprint.x+b.footprint.width&&world.y>=b.footprint.y&&world.y<=b.footprint.y+b.footprint.height);if(expansion){const r=resumeConstruction(this.gathering,this.placement,this.map,expansion.id);this.gathering=r.gathering;this.placement=r.placement;this.syncVisuals();return;}
      const farm=this.placement.farms?.find(f=>f.construction.remainingSeconds>0 && world.x>=f.footprint.x && world.x<=f.footprint.x+f.footprint.width && world.y>=f.footprint.y && world.y<=f.footprint.y+f.footprint.height);
      if (farm) {
        const result=resumeConstruction(this.gathering,this.placement,this.map,farm.id);
        this.gathering=result.gathering;this.placement=result.placement;this.syncVisuals();return;
      }
      const bar=this.placement.barracks;
      if (bar && !barracksReady(this.placement) && world.x>=bar.x && world.x<=bar.x+bar.width && world.y>=bar.y && world.y<=bar.y+bar.height) {
        const result=resumeConstruction(this.gathering,this.placement,this.map);
        this.gathering=result.gathering;this.placement=result.placement;this.syncVisuals();return;
      }
      const ownBuilding=inspectBuildingAt(this.currentMatch(),world);if(ownBuilding&&inspectedBuilding(this.currentMatch(),ownBuilding)?.team==='player'&&this.gathering.units.some(u=>u.kind==='worker'&&u.selected)){this.applyMatch(orderRepair(this.currentMatch(),ownBuilding));this.syncVisuals();return;}
      const enemy = enemyAt(this.combat.enemies.filter(e=>entityVisible(this.fog,'player',e)), world);
      const resource = resourceNodes(this.gathering).find(n=> (knownResource(this.fog,n.position)||!!n.grove&&isVisible(this.fog,'player',world))&&isNodeHit(world,n));
      this.applyMatch(issueOrder(this.currentMatch(),enemy?{kind:'attack',enemyId:enemy.id}:resource?{kind:'gather',nodeId:resource.id}:{kind:'move',destination:world},'shiftKey' in pointer.event&&pointer.event.shiftKey));
    }
  }

  private handleMove(pointer: Phaser.Input.Pointer): void {
    if (!this.gameplayActive()) return;
    if(pointer.event.target instanceof Element&&pointer.event.target.closest('#hud, #match-menu, #game-toolbar, #minimap-overlay, #top-bar, #bottom-bar'))return;
    if(this.spellMode){this.syncSpellPreview(this.worldPoint(pointer));return;}
    if (this.cameraDrag) {
      const scroll = dragCamera(this.cameraDrag, { x: pointer.x, y: pointer.y }, this.map,
        { width: this.cameras.main.width, height: this.cameras.main.height },this.cameras.main.zoom);
      this.setCameraScroll(scroll);
      if (this.placement.active) {
        this.previewPoint = this.worldPoint(pointer);
        this.syncPlacement();
      }
      return;
    }
    if (this.placement.active) {
      this.previewPoint = this.worldPoint(pointer);
      this.syncPlacement();
      return;
    }
    if (!this.drag) return;
    this.drag.active ||= isSelectionDrag(this.drag.screen, this.screenPoint(pointer));
    const rect = selectionRectangle(this.drag.world, this.worldPoint(pointer));
    this.dragBox.setPosition(rect.x, rect.y).setSize(rect.width, rect.height)
      .setVisible(this.drag.active);
  }

  private handleUp(pointer: Phaser.Input.Pointer): void {
    const selects=this.gameplayActive()&&pointer.button===0&&!!this.drag&&!this.cameraDrag&&!this.placement.active&&!this.placementClick&&!(pointer.event.target instanceof Element&&pointer.event.target.closest('#hud, #match-menu, #game-toolbar, #minimap-overlay, #top-bar, #bottom-bar'));
    this.processUp(pointer);
    if(selects)gameAudio.say(voiceSpeaker(this.allSelectable()),'select',this.factions.player);
  }

  private processUp(pointer: Phaser.Input.Pointer): void {
    if (!this.gameplayActive()) return;
    if (pointer.button === 1) { this.cameraDrag = undefined; return; }
    if (this.cameraDrag) return;
    if (this.placementClick) {
      this.placementClick = false;
      return;
    }
    if (this.placement.active || pointer.button !== 0 || !this.drag) return;
    this.selectedAnimal=null;
    if (pointer.event.target instanceof Element && pointer.event.target.closest('#hud, #match-menu, #game-toolbar, #minimap-overlay, #top-bar, #bottom-bar')) {
      this.drag = undefined;
      this.dragBox.setVisible(false);
      return;
    }
    this.handleMove(pointer);
    const end = this.worldPoint(pointer);
    if (this.drag.active) {
      this.selectedResource=null;this.selectedAnimal=null;
      const all=this.allSelectable(),hits=selectUnitsInRectangle(all, this.drag.world, end);
      this.setSelectable(this.drag.shift?combineSelection(all,hits,'add'):hits);
      if(!this.drag.shift||this.allSelectable().some(u=>u.selected))this.selectedBuilding = null;
    } else {
      const selected = selectWorldTarget(this.allSelectable(), end, this.gathering.base,
        this.placement.barracks, u=>u.kind==='ship'?navyConfig.ship.size:u.kind==='worker'?unitStats.size:combatUnitStats(u).size,this.navy?.harbor?.footprint,resourceNodes(this.gathering),n=>knownResource(this.fog,n.position)||!!n.grove&&isVisible(this.fog,'player',end));
      if(!selected.units.some(u=>u.selected)){const building=inspectBuildingAt(this.currentMatch(),end);selected.building=building;if(building)selected.resource=null;}
      this.selectedResource=selected.resource;
      if(this.drag.shift&&!selected.building&&!selected.resource){
        this.setSelectable(combineSelection(this.allSelectable(),selected.units,'toggle'));
        if(selected.units.some(u=>u.selected))this.selectedBuilding=null;
      }else{this.setSelectable(selected.units);this.selectedBuilding=selected.building;}
    }
    this.drag = undefined;
    this.dragBox.setVisible(false);
    this.syncVisuals();
  }

  private rememberPlacementError(point:Position,reason:string|null):void {
    const rect=buildingFootprint(point,this.placement.kind??'barracks');
    this.placementAttempt=reason?{x:rect.x,y:rect.y,reason}:null;
    if(reason)gameAudio.say(voiceSpeaker(this.allSelectable()),'error',this.factions.player);
  }

  private syncDiscoveries():void {
    const finds=visibleDiscoveries(this.currentMatch()),ids=new Set(finds.map(d=>d.id));
    for(const [id,v]of this.discoveryVisuals)if(!ids.has(id)){v.image.destroy();v.label.destroy();this.discoveryVisuals.delete(id);}
    for(const d of finds){
      const frame=d.kind==='recruit'?unitFrame(motion(undefined,d.position,'idle',0,'soldier','player',undefined,this.factions.player),0):d.opened?'chest-open':'chest-closed',key=d.kind==='recruit'?'units':'reference-terrain';
      let v=this.discoveryVisuals.get(d.id);if(!v){v={image:this.add.image(d.position.x,d.position.y,key,frame).setOrigin(.5,d.kind==='recruit'?22/32:.75),label:this.add.text(d.position.x,d.position.y-30,d.label,{fontSize:'11px',color:'#efdaa4',backgroundColor:'#17271dcc'}).setOrigin(.5,1)};this.discoveryVisuals.set(d.id,v);}
      v.image.setTexture(key,frame).setDepth(1+d.position.y/this.map.height*4);if(d.kind==='recruit')v.image.setTint(0xd5c391);
      v.label.setText(d.label).setDepth(8);
    }
  }

  private syncPlacement(): void {
    const forge=this.placement.forge;
    if(!forge&&this.forgeVisual){this.forgeVisual.destroy();this.forgeVisual=undefined;}
    if(forge&&!this.forgeVisual)this.forgeVisual=this.add.image(forge.footprint.x+forge.footprint.width/2,forge.footprint.y+forge.footprint.height/2,'buildings',buildingFrame('forge','player',forge.construction.remainingSeconds,5,this.factions.player,forge.hp)).setOrigin(.5,.75);
    if(forge)this.forgeVisual!.setFrame(buildingFrame('forge','player',forge.construction.remainingSeconds,5,this.factions.player,forge.hp));
    this.forgeButton.disabled=!this.gameplayActive()||this.placement.active||!!forge||!this.gathering.units.some(u=>u.kind==='worker'&&u.selected);
    document.getElementById('research-status')!.textContent=forge?`Forge ${Math.ceil(forge.hp)} HP · construction ${forge.construction.remainingSeconds.toFixed(1)} s · Attack ${this.research.attack} / Defense ${this.research.defense}${this.research.job?` · ${this.research.job.kind} ${this.research.job.remainingSeconds.toFixed(1)} s`:''}`:uiText.buildAForgeForUpgrades;
    for(const [kind,button] of this.researchButtons){
      const level=researchLevel(this.research,kind),recipe=researchRecipe(factions[this.factions.player],kind,level);
      button.disabled=!canResearch(this.gathering,this.research,this.placement,kind,this.gameplayActive(),hasMainBase(this.currentMatch()));
      setActionLabel(button,kind==='workerTools'?`Worker Tools ${['I','II','III'][Math.min(2,level)]} – level ${level}/3 · ${level>=3?'Complete':`${Math.round((1-workerToolsConfig[level]!.timeMultiplier)*100)}% shorter gathering · ${costLabel(recipe.cost)} · ${recipe.durationSeconds}s`}${this.research.job?.kind==='workerTools'?` · ${this.research.job.remainingSeconds.toFixed(1)}s left`:''}`:`${factions[this.factions.player].upgrades[kind].name} ${level===0?'I':'II'} – ${costLabel(recipe.cost)}`);
    }

    if(!this.placement.barracks&&this.barracksVisual){this.barracksVisual.destroy();this.barracksVisual=undefined;}
    const rect = buildingFootprint(this.previewPoint,this.placement.kind??'barracks');
    let error = this.placement.active ? !placementVisible(this.fog,rect)?uiText.theSiteMustBeVisible:this.placement.kind==='tower'||this.placement.kind==='wall'||this.placement.kind==='gate'?towerPreviewError(this.currentMatch(),this.previewPoint):this.placement.kind==='harbor'?harborPreviewError(this.currentMatch(),this.previewPoint):placementPreviewError(this.placement, this.previewPoint, this.gathering.wood, placementObstacles(this.gathering),
      {technology:technologyFor(this.currentMatch(),'player'),map:this.map,gathering:this.gathering,enemies:this.combat.enemies}) : null;
    if(!this.placement.active||this.placementAttempt&&(this.placementAttempt.x!==rect.x||this.placementAttempt.y!==rect.y))this.placementAttempt=null;
    error=error??this.placementAttempt?.reason??null;
    this.placementFeedbackError=error;
    this.placementPreview.setPosition(rect.x, rect.y)
      .setFillStyle(error ? 0xe05b5b : 0x7bd389, 0.4).setVisible(this.placement.active);
    this.buildButton.setAttribute('aria-pressed',String(this.placement.active&&(!this.placement.kind||this.placement.kind==='barracks')));
    this.farmButton?.setAttribute('aria-pressed',String(this.placement.active&&this.placement.kind==='farm'));this.forgeButton.setAttribute('aria-pressed',String(this.placement.active&&this.placement.kind==='forge'));
    this.buildButton.disabled = !this.gameplayActive() || this.placement.active || this.placement.barracks !== null || !this.gathering.units.some(u=>u.kind==='worker'&&u.selected);
    this.placementStatus.textContent = this.placement.active
      ? `${error ?? uiText.validSite} – click to place, Escape/right-click to cancel`
      : !this.gameplayActive() ? this.session.phase==='paused'?uiText.pausedSimulationIsFrozen:uiText.theMatchHasEnded : this.placement.barracks ? barracksReady(this.placement) ? uiText.barracksComplete : `Construction: ${this.placement.construction!.remainingSeconds.toFixed(1)} s work remaining – right-click with a worker to resume` : !this.gathering.units.some(u=>u.kind==='worker'&&u.selected) ? uiText.selectAWorkerToBuild : `Costs ${costLabel(factions[this.factions.player].buildings.barracks.cost)} – choose a site`;
    if (this.placement.barracks && !this.barracksVisual) {
      const building = this.placement.barracks;
      this.barracksVisual = this.add.image(building.x+building.width/2,building.y+building.height/2,'buildings',buildingFrame('barracks','player',this.placement.construction?.remainingSeconds,5,this.factions.player,this.placement.barracksHP??combatConfig.barracksHP)).setOrigin(.5,.75);
    }
    const academy=this.placement.academy;if(!academy&&this.academyVisual){this.academyVisual.destroy();this.academyVisual=undefined;}if(academy){if(!this.academyVisual)this.academyVisual=this.add.image(academy.footprint.x+32,academy.footprint.y+32,'buildings',buildingFrame('academy','player',academy.construction.remainingSeconds,10,this.factions.player,academy.hp)).setOrigin(.5,.75);this.academyVisual.setFrame(buildingFrame('academy','player',academy.construction.remainingSeconds,10,this.factions.player,academy.hp)).setDepth(1+(academy.footprint.y+32)/this.map.height*4);}
    const academyButton=document.getElementById('build-academy') as HTMLButtonElement;academyButton.disabled=!this.gameplayActive()||this.placement.active||!!academy||!this.gathering.units.some(u=>u.kind==='worker'&&u.selected);academyButton.setAttribute('aria-pressed',String(this.placement.active&&this.placement.kind==='academy'));
    (document.getElementById('build-base') as HTMLButtonElement).disabled=!this.gameplayActive()||this.placement.active||(this.placement.bases?.length??0)>=extraBaseConfig.maxCount||!this.gathering.units.some(u=>u.kind==='worker'&&u.selected);
    this.farmButton.disabled=!this.gameplayActive()||this.placement.active
      ||(this.placement.farms?.length??0)>=farmConfig.maxCount||!this.gathering.units.some(u=>u.kind==='worker'&&u.selected);
    document.getElementById('farm-status')!.textContent=(this.placement.farms??[]).map(f=>`${f.id}: ${Math.ceil(f.hp??combatConfig.farmHP)} HP · ${f.construction.remainingSeconds===0?uiText.complete5:f.construction.remainingSeconds.toFixed(1)+uiText.sRemaining}`).join(' · ') || uiText.selectAWorkerACompletedFarmAdds5;
    for(const [id,visual] of this.farmVisuals)if(!this.placement.farms?.some(f=>f.id===id)){visual.destroy();this.farmVisuals.delete(id);}
    for(const farm of this.placement.farms??[]) {
      if(!this.farmVisuals.has(farm.id))this.farmVisuals.set(farm.id,this.add.image(farm.footprint.x+farm.footprint.width/2,farm.footprint.y+farm.footprint.height/2,'buildings',buildingFrame('farm','player',farm.construction.remainingSeconds,5,this.factions.player,farm.hp??combatConfig.farmHP)).setOrigin(buildingOrigin('farm').x,buildingOrigin('farm').y));
      this.farmVisuals.get(farm.id)!.setFrame(buildingFrame('farm','player',farm.construction.remainingSeconds,5,this.factions.player,farm.hp??combatConfig.farmHP));
    }
    this.barracksVisual?.setFrame(buildingFrame('barracks','player',this.placement.construction?.remainingSeconds,5,this.factions.player,this.placement.barracksHP??combatConfig.barracksHP));
  }

  private portraitCrops=new Map<string,ReturnType<typeof spriteCrop>>();
  private paintPortrait(canvas:HTMLCanvasElement,asset:{atlas:string;frame:string}|null):void {
    const ctx=canvas.getContext('2d')!;ctx.clearRect(0,0,canvas.width,canvas.height);if(!asset)return;
    const frame=this.textures.get(asset.atlas).get(asset.frame);ctx.imageSmoothingEnabled=false;
    const key=`${asset.atlas}/${asset.frame}`;let crop=this.portraitCrops.get(key);
    if(!crop){const c=document.createElement('canvas');c.width=frame.cutWidth;c.height=frame.cutHeight;const context=c.getContext('2d')!;context.drawImage(frame.source.image as HTMLImageElement,frame.cutX,frame.cutY,frame.cutWidth,frame.cutHeight,0,0,c.width,c.height);crop=spriteCrop(context.getImageData(0,0,c.width,c.height).data,c.width,c.height);this.portraitCrops.set(key,crop);}
    const scale=Math.min((canvas.width-4)/crop.width,(canvas.height-4)/crop.height),w=crop.width*scale,h=crop.height*scale;
    ctx.drawImage(frame.source.image as HTMLImageElement,frame.cutX+crop.x,frame.cutY+crop.y,crop.width,crop.height,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
  }

  private syncVisuals(): void {
    const liveDefenses=new Set<string>((this.placement.defenses??[]).map(t=>t.id));for(const [id,image]of this.defenseVisuals)if(!liveDefenses.has(id)){image.destroy();this.defenseVisuals.delete(id);}
    for(const t of this.placement.defenses??[]){let image=this.defenseVisuals.get(t.id);if(!image){image=this.add.image(t.footprint.x+t.footprint.width/2,t.footprint.y+16,'buildings').setOrigin(.5,.75);this.defenseVisuals.set(t.id,image);}image.setFrame(t.kind==='gate'&&t.open?`${factions[this.factions.player].artPrefix}gate-player-open`:buildingFrame(t.kind,'player',t.construction.remainingSeconds,defenseConfig[t.kind].seconds,this.factions.player,t.hp,t.level));}
    for(const kind of ['tower','wall','gate'] as const)(document.getElementById(`build-${kind}`) as HTMLButtonElement).disabled=!this.gameplayActive()||!this.gathering.units.some(u=>u.kind==='worker'&&u.selected)||this.placement.active||this.gathering.wood<defenseConfig[kind].cost.wood||(this.gathering.goldBalance??0)<defenseConfig[kind].cost.gold;
    const gateButton=document.getElementById('toggle-gate') as HTMLButtonElement;gateButton.disabled=!!gateToggleReason(this.currentMatch(),this.selectedBuilding??'');setActionLabel(gateButton,this.placement.defenses?.find(t=>t.id===this.selectedBuilding)?.open?'Close gate':'Open gate');
    const repairButton=document.getElementById('repair-building') as HTMLButtonElement;repairButton.disabled=!this.gameplayActive()||!this.gathering.units.some(u=>u.kind==='worker'&&u.selected)||this.gathering.wood<=0||(this.gathering.goldBalance??0)<=0;repairButton.setAttribute('aria-pressed',String(this.repairMode));
    (document.getElementById('upgrade-tower') as HTMLButtonElement).disabled=!!towerUpgradeReason(this.currentMatch(),this.selectedBuilding??'');
    renderTechnologyView(this.currentMatch());renderCommandsView();
    const development=baseDevelopment(this.currentMatch()),upgradeButton=document.getElementById('upgrade-base') as HTMLButtonElement;
    upgradeButton.disabled=!!baseUpgradeReason(this.currentMatch());setActionLabel(upgradeButton,development.remainingSeconds!==null?`Upgrading to level ${development.level+1}: ${Math.ceil(development.remainingSeconds)}s; training paused`:`Upgrade base to level ${Math.min(3,development.level+1)}`);
    const animalPoses=visibleAnimals(this.currentMatch()),animalIds=new Set(animalPoses.map(p=>p.id));
    for(const id of this.animalHP.keys())if(!animalIds.has(id))this.animalHP.delete(id);
    this.animalFeedback?.clear();if(this.selectedAnimal&&!animalPoses.some(a=>a.id===this.selectedAnimal&&a.hp>0))this.selectedAnimal=null;
    for(const [id,image]of this.wildlifeVisuals)if(!animalIds.has(id))image.setVisible(false);
    for(const pose of animalPoses){let image=this.wildlifeVisuals.get(pose.id);if(!image){image=this.add.image(pose.position.x,pose.position.y,'world',pose.frame).setOrigin(.5,.75).setDepth(-.5);this.wildlifeVisuals.set(pose.id,image);}image.setPosition(pose.position.x,pose.position.y).setFrame(pose.frame).setFlipX(pose.flipX).setAngle(pose.hp<=0?90:0).setAlpha(pose.hp<=0?.6:1).setVisible(true);
      if(this.animalHP.has(pose.id)&&pose.hp<this.animalHP.get(pose.id)!&&this.gameplayActive())gameAudio.play('impact');this.animalHP.set(pose.id,pose.hp);
      const p=pose.position,hit=pose.hurtAt!==undefined&&this.waves.elapsedSeconds-pose.hurtAt<.25;
      if(hit)this.animalFeedback?.lineStyle(2,0xe4ab71).strokeCircle(p.x,p.y,17);
      if(pose.hp<=0)this.animalFeedback?.lineStyle(2,0xc27555,.8).lineBetween(p.x-7,p.y-7,p.x+7,p.y+7).lineBetween(p.x+7,p.y-7,p.x-7,p.y+7);
      if(this.selectedAnimal===pose.id){this.animalFeedback?.lineStyle(2,0xffdc73).strokeEllipse(p.x,p.y,30,14).fillStyle(0x172422).fillRect(p.x-14,p.y-30,28,4).fillStyle(0x8cb56b).fillRect(p.x-14,p.y-30,28*pose.hp/pose.maxHP,4);}
    }
    for(const image of this.wildlifeProps)image.setVisible(isVisible(this.fog,'player',image)&&bodyFits(this.map,image,12));
    if(this.selectedBuilding&&!inspectedBuilding(this.currentMatch(),this.selectedBuilding))this.selectedBuilding=null;
    for(const [id,v] of this.extraBaseVisuals)if(!this.placement.bases?.some(b=>b.id===id)){v.body.destroy();v.label.destroy();this.extraBaseVisuals.delete(id);}
    for(const b of this.placement.bases??[]){const x=b.footprint.x+b.footprint.width/2,y=b.footprint.y+b.footprint.height/2;let v=this.extraBaseVisuals.get(b.id);if(!v){v={body:this.add.image(x,y,'buildings',buildingFrame('base','player',b.construction.remainingSeconds,12,this.factions.player,b.hp,development.level)).setOrigin(.5,.75),label:this.add.text(x,y+30,'',{fontSize:'12px',color:'#fff'}).setOrigin(.5)};this.extraBaseVisuals.set(b.id,v);}v.body.setFrame(buildingFrame('base','player',b.construction.remainingSeconds,12,this.factions.player,b.hp,development.level)).setDepth(1+y/this.map.height*4);v.label.setText(`${factions[this.factions.player].buildingNames.base} · ${b.id} · ${Math.ceil(b.hp)} HP${b.construction.remainingSeconds>0?' · '+Math.ceil(b.construction.remainingSeconds)+'s':''}`).setDepth(10);}
    this.baseVisual.setFrame(buildingFrame('base','player',0,5,this.factions.player,this.combat.baseHP,baseDevelopment(this.currentMatch()).level)).setVisible(this.combat.baseHP>0);this.baseLabel.setVisible(this.combat.baseHP>0).setText(`${factions[this.factions.player].buildingNames.base} · L${development.level} · ${Math.ceil(this.combat.baseHP)} HP`);
    if (!this.gameplayActive()) {
      this.unloadMode=null;this.attackMoveMode=false;this.patrolMode=false;this.repairMode=false;this.spellMode=null;this.spellFeedback='';
      this.cameraDrag = undefined;
      this.drag = undefined;
      this.dragBox.setVisible(false);
    }
    this.attackMoveButton.disabled=!this.gameplayActive()||!this.gathering.units.some(u=>u.kind==='soldier'&&u.selected);
    this.attackMoveButton.setAttribute('aria-pressed',String(this.attackMoveMode));
    setActionLabel(this.attackMoveButton,this.attackMoveMode?uiText.attackMoveClickADestinationEscapeCancels:'Attack-move');
    this.stopButton.disabled = !this.gameplayActive() || !this.allSelectable().some(u=>u.selected);
    (document.getElementById('dismiss-units') as HTMLButtonElement).disabled=!dismissProposal(this.currentMatch());
    this.hpBars?.clear();
    const visibleEnemies=this.combat.enemies.filter(e=>entityVisible(this.fog,'player',e));
    const markers = orderMarkers(this.gathering, {...this.combat,enemies:visibleEnemies}, this.outcome==='playing',this.placement.barracks,this.placement.farms,this.placement.forge?.footprint,this.navy?.harbor?.footprint,this.placement.bases,this.placement.academy?.footprint);
    markers.push(...navalOrderMarkers(this.navy,{...this.combat,enemies:visibleEnemies},this.outcome==='playing'));
    for (const [id, visual] of this.orderVisuals) {
      if (!markers.some(m=>m.id===id)) { visual.destroy(); this.orderVisuals.delete(id); }
    }
    for (const marker of markers) {
      if(!this.orderVisuals.has(marker.id))this.orderVisuals.set(marker.id,this.add.graphics().setDepth(7));
      const visual=this.orderVisuals.get(marker.id)!,r=orderFeedbackConfig.radius;visual.clear().setPosition(marker.position.x,marker.position.y).lineStyle(orderFeedbackConfig.lineWidth,orderFeedbackConfig.colors[marker.kind]);
      if(marker.kind==='blocked'){visual.lineBetween(-r,-r,r,r).lineBetween(-r,r,r,-r);}
      else {visual.strokeCircle(0,0,r);if(marker.kind==='attack')visual.lineBetween(-r-4,0,-r+3,0).lineBetween(r-3,0,r+4,0).lineBetween(0,-r-4,0,-r+3).lineBetween(0,r-3,0,r+4);}
    }
    this.restartButton.hidden = this.session.phase!=='paused'&&this.session.phase!=='ended';
    this.restartButton.disabled = this.restartPending;
    const definition=scenarioConfig[this.scenario];
    this.matchStatus.textContent=this.campaignRun?(this.outcome==='victory'?'Victory — all campaign objectives complete.':this.outcome==='defeat'?'Defeat — your base or required courier was lost.':campaignObjective(this.currentMatch())):this.outcome==='defeat'?uiText.defeatYourBaseWasDestroyed:this.outcome==='victory'?definition.victory==='enemy-base'?uiText.victoryTheEnemyBaseWasDestroyed:definition.victory==='timer'?uiText.victoryTheOutpostSurvivedFor90Seconds:uiText.victoryAllWavesDefeated:this.scenario==='skirmish'?(regionDefinition(this.map.id??'arena',maps[this.map.id??'arena'],this.map.design).instruction??definition.instruction):definition.instruction;
    this.syncPlacement();this.syncNavy();this.syncDiscoveries();
    const crowns=forestVisuals(this.gathering,this.fog),crownIds=new Set(crowns.map(c=>c.id));for(const [id,image] of this.forestImages)if(!crownIds.has(id)){image.destroy();this.forestImages.delete(id);}for(const crown of crowns){if(!this.forestImages.has(crown.id))this.forestImages.set(crown.id,this.add.image(crown.x,crown.y,'reference-terrain',crown.frame).setOrigin(.5,1));this.forestImages.get(crown.id)!.setFrame(crown.frame).setDepth(1+crown.y/this.map.height*4);}
    const gold=this.gathering.gold!;if(gold.mine)this.goldVisual.setTexture('reference-terrain',gold.remaining<=0&&isVisible(this.fog,'player',gold.position)?'mine-empty':'mine-full').setOrigin(.5,.75).setDepth(1+(gold.position.y+20)/this.map.height*4);else this.goldVisual.setFrame(resourceFrame('gold',gold.remaining,isVisible(this.fog,'player',gold.position)));
    this.nodeVisual.setVisible(!this.gathering.node.tree&&knownResource(this.fog,this.gathering.node.position));
    if(this.gathering.node.grove)this.nodeVisual.setTexture('reference-terrain',this.gathering.node.remaining<=0&&isVisible(this.fog,'player',this.gathering.node.position)?'stump':'forest-0').setOrigin(.5,.75);else this.nodeVisual.setFrame(resourceFrame('wood',this.gathering.node.remaining,isVisible(this.fog,'player',this.gathering.node.position)));
    for(const node of this.gathering.extraNodes??[]){
      if(node.tree)continue;
      const type=node.resource??'wood',visible=isVisible(this.fog,'player',node.position),known=knownResource(this.fog,node.position);
      if(!this.extraResourceVisuals.has(node.id))this.extraResourceVisuals.set(node.id,{body:this.add.image(node.position.x,node.position.y,'world',resourceFrame(type,node.remaining,visible)).setOrigin(resourceOrigin.x,resourceOrigin.y),label:this.add.text(node.position.x,node.position.y-64,'',{fontSize:'12px',color:'#d6eef1'}).setOrigin(.5)});
      const visual=this.extraResourceVisuals.get(node.id)!;if(node.mine)visual.body.setTexture('reference-terrain',node.remaining<=0&&visible?'mine-empty':'mine-full').setOrigin(.5,.75).setDepth(1+(node.position.y+20)/this.map.height*4);else if(node.grove)visual.body.setTexture('reference-terrain',node.remaining<=0&&visible?'stump':'forest-1').setOrigin(.5,.75);else visual.body.setFrame(resourceFrame(type,node.remaining,visible));visual.body.setVisible(known);visual.label.setVisible(known).setText(`${type==='wood'?'Wood':'Gold'}${visible?' '+Math.ceil(node.remaining):''}`);
    }
    const baseSelection=selectedBase(this.currentMatch(),this.selectedBuilding);
    this.trainButton.parentElement!.style.visibility = baseSelection ? 'visible' : 'hidden';
    this.soldierButton.parentElement!.style.visibility = this.selectedBuilding === 'barracks' ? 'visible' : 'hidden';
    const selectedProduction = baseSelection ? baseSelection.production
      : this.selectedBuilding === 'barracks' ? this.soldierProduction : this.selectedBuilding==='harbor'?this.navy!.production:null;
    renderSelectedQueue(selectedQueue(this.currentMatch(),this.selectedBuilding,this.gameplayActive()),(canvas,asset)=>this.paintPortrait(canvas,asset));
    this.rallyMarker.setVisible(selectedProduction?.rally !== undefined);
    if (selectedProduction?.rally) this.rallyMarker.setPosition(selectedProduction.rally.x, selectedProduction.rally.y);
    const selectedFootprint = inspectedBuilding(this.currentMatch(),this.selectedBuilding)?.footprint??null;
    this.buildingRing.setVisible(selectedFootprint !== null);
    if (selectedFootprint) this.buildingRing.setPosition(selectedFootprint.x, selectedFootprint.y)
      .setSize(selectedFootprint.width, selectedFootprint.height);
    const info=selectionInfo(this.currentMatch(),this.selectedBuilding,this.selectedResource,this.selectedAnimal);renderSelectionInfo(info);
    const portrait=document.getElementById('selection-portrait') as HTMLCanvasElement;portrait.hidden=!info.portrait;this.paintPortrait(portrait,info.portrait);
    renderSelectedIcons(selectedIcons(this.currentMatch()),(canvas,asset)=>this.paintPortrait(canvas,asset));
    renderTopBar(this.currentMatch());
    const population=matchPopulation(this.currentMatch());
    this.trainButton.disabled = !baseSelection || !this.gameplayActive() || !canEnqueue(this.gathering,baseSelection?.production??this.production,{kind:'base',ready:baseSelection?('construction' in baseSelection?baseSelection.construction.remainingSeconds===0:baseSelection.ready):false},population);
    this.productionStatus.textContent = productionLabel(this.gathering,baseSelection?.production??this.production, this.outcome,{kind:'base'},population);
    const barracks = { kind: 'barracks' as const, bounds:this.map,technology:technologyFor(this.currentMatch(),'player'), footprint: this.placement.barracks, ready:barracksReady(this.placement) };
    this.soldierButton.disabled = !allowsProduction(this.selectedBuilding, 'barracks', this.placement.barracks !== null, this.gameplayActive()) || !this.gameplayActive() || !canEnqueue(this.gathering, this.soldierProduction, barracks,population);
    const airButton=document.getElementById('train-air') as HTMLButtonElement;setActionLabel(airButton,`Train ${factions[this.factions.player].unitNames.air}`);airButton.disabled=!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive())||!canEnqueue(this.gathering,this.soldierProduction,{...barracks,unitType:'air'},population);
    this.specialistButton.disabled=!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive())||!canEnqueue(this.gathering,this.soldierProduction,{...barracks,unitType:'specialist'},population);
    this.catapultButton.disabled=!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive())||!canEnqueue(this.gathering,this.soldierProduction,{...barracks,unitType:'catapult'},population);
    this.archerButton.disabled=!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive())||!canEnqueue(this.gathering,this.soldierProduction,{...barracks,unitType:'archer'},population);
    this.soldierProductionStatus.textContent = productionLabel(this.gathering, this.soldierProduction, this.outcome, barracks,population);
    const ability=abilityFor(this.gathering),abilityButton=document.querySelector<HTMLButtonElement>('#unit-ability')!;
    setActionLabel(abilityButton,`${ability.label} · ${ability.description} · ${ability.durationSeconds} s`);abilityButton.disabled=!this.gameplayActive()||!this.gathering.units.some(u=>u.selected&&abilityReady(u));
    document.getElementById('ability-status')!.textContent=abilityStatus(this.gathering);
    const labels = matchLabels(this.currentMatch());
    for (const [id, text] of [['resource-status', labels.economy], ['health-status', labels.health],
      ['wave-status', labels.wave],['population-status',`Population: ${population.used} + ${population.reserved} reserved / ${population.cap}`], ['selection-status', this.selectedBuilding ? `${info.name} selected (${Math.ceil(info.hp??0)} HP)` : (this.selectedAnimal?`${info.name} ${Math.ceil(info.hp??0)} HP`:this.selectedResource?info.name:this.navy?.ships.some(s=>s.selected)?`${this.allSelectable().filter(u=>u.selected).length} units selected · ships`:labels.selected)]]) {
      document.getElementById(id)!.textContent = text;
    }

    for (const [id, visual] of this.visuals) {
      if (!this.gathering.units.some(u => u.id === id)) {
        this.removedVisual(id,!this.navy?.ships.some(s=>s.passengers?.some(u=>u.id===id)));visual.body.destroy(); visual.ring.destroy(); visual.cargo.destroy(); this.visuals.delete(id);
      }
    }
    for (const [id, visual] of this.enemyVisuals) {
      if (!visibleEnemies.some(e => e.id === id)) {
        this.removedVisual(id,!this.combat.enemies.some(e=>e.id===id)&&!this.enemyNaval?.passengers.some(e=>e.id===id));visual.body.destroy(); visual.label.destroy(); this.enemyVisuals.delete(id);
      }
    }
    const visibleShots=this.outcome==='playing'?(this.combat.projectiles??[]).filter(p=>isVisible(this.fog,'player',p.position)):[];
    for(const [id,visual] of this.projectileVisuals)if(!visibleShots.some(p=>p.id===id)){visual.destroy();this.projectileVisuals.delete(id);}
    for(const shot of visibleShots){if(!this.projectileVisuals.has(shot.id))this.projectileVisuals.set(shot.id,this.add.graphics().setDepth(effectConfig.projectileDepth));drawProjectile(this.projectileVisuals.get(shot.id)!,shot);}
    for (const enemy of visibleEnemies) {
      if (!this.enemyVisuals.has(enemy.id)) this.enemyVisuals.set(enemy.id, {
        body: enemy.footprint?this.add.image(enemy.position.x,enemy.position.y,'buildings',buildingFrame((enemy.buildingType==='outpost'?'base':enemy.buildingType)??'base','enemy',enemy.construction?.remainingSeconds??0,enemy.buildingType==='outpost'||enemy.buildingType==='academy'?10:5,(enemy.faction??this.factions.enemy))).setOrigin(buildingOrigin((enemy.buildingType==='outpost'?'base':enemy.buildingType)??'base').x,buildingOrigin((enemy.buildingType==='outpost'?'base':enemy.buildingType)??'base').y):enemy.kind==='ship'?this.add.image(enemy.position.x,enemy.position.y,'naval',`${factions[(enemy.faction??this.factions.enemy)].artPrefix}transport-enemy-s-idle-0`).setOrigin(.5,40/64):this.add.image(enemy.position.x,enemy.position.y,isAir(enemy)?'air':'units',isAir(enemy)?`${(enemy.faction??this.factions.enemy)}-air-enemy-s-idle-0`:`${factions[(enemy.faction??this.factions.enemy)].artPrefix}${enemy.kind==='worker'?'worker':enemy.role??'soldier'}-enemy-s-idle-0`).setOrigin(unitOrigin(enemy.kind==='worker'?'worker':enemy.role??'soldier').x,unitOrigin(enemy.kind==='worker'?'worker':enemy.role??'soldier').y),
        label: this.add.text(0, 0, '', { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5, 0),
      });
      const playerColor=this.multiplePlayers?.roster.find(p=>p.id===enemy.playerId)?.color;
      const tint=playerColor?Number.parseInt(playerColor.slice(1),16):0xcf7770;
      this.hpBars?.lineStyle(2,tint,.9).strokeEllipse(enemy.position.x,enemy.position.y+8,enemy.footprint?80:28,enemy.footprint?24:10);
      const visual = this.enemyVisuals.get(enemy.id)!;
      visual.body.setPosition(enemy.position.x, enemy.position.y);
      if(enemy.footprint)visual.body.setFrame(buildingFrame(enemy.buildingType==='outpost'?'base':enemy.buildingType??'base','enemy',enemy.construction?.remainingSeconds??0,enemy.buildingType==='outpost'||enemy.buildingType==='academy'?10:5,(enemy.faction??this.factions.enemy),enemy.hp));
      if(enemy.kind==='ship')this.animateUnit(enemy.id,visual.body,enemy.position,'idle','transport','enemy',undefined,enemy.faction);
      if(!enemy.footprint&&enemy.kind!=='ship'){const target=enemy.order?.kind==='defend'?this.gathering.units.find(u=>enemy.order?.kind==='defend'&&u.id===enemy.order.targetId)?.position:enemy.navigation?.targetId==='base'?this.gathering.base:undefined;const action:Action=enemy.navigation?.targetId&&enemy.navigation.targetId!=='explore-goal'&&enemy.navigation.status==='arrived'?'attack':enemy.work?.order.kind==='gather'?'gather':'idle';this.animateUnit(enemy.id,visual.body,enemy.position,action,enemy.kind==='worker'?'worker':enemy.role??'soldier','enemy',target,enemy.faction);}
      visual.label.setPosition(enemy.position.x,enemy.position.y-(enemy.kind==='ship'?48:90)).setVisible(!!enemy.footprint||enemy.kind==='ship').setText(`${enemy.buildingType==='outpost'?uiText.resourceOutpost:''}${enemy.kind==='ship'?'Transport':enemy.buildingType==='harbor'?uiText.harbor:factions[(enemy.faction??this.factions.enemy)].buildingNames[(enemy.buildingType==='outpost'?'base':enemy.buildingType)??'base']} ${Math.ceil(enemy.hp)} HP`);
      for(const kind of ['buff','debuff'])if(enemy.spellEffects?.some(e=>spellDefinition(e.spell,e.sourceFaction).kind===kind))this.hpBars?.lineStyle(2,kind==='buff'?0x86dbe6:0xc18ce5,.9).strokeCircle(enemy.position.x,enemy.position.y,kind==='buff'?18:21);
      if(isAir(enemy)){visual.body.setY(enemy.position.y-airPresentation.height).setDepth(12);this.hpBars?.fillStyle(0x091311,.45).fillEllipse(enemy.position.x,enemy.position.y,28,9);}
      this.drawHP(enemy.position,enemy.hp,enemyMaximumHP(enemy,(enemy.faction??this.factions.enemy)),enemy.footprint?64:24,enemy.footprint?70:enemy.kind==='ship'?29:unitOverlayOffsets(enemy.kind==='worker'?'worker':enemy.role??'soldier',(enemy.faction??this.factions.enemy)).hp,tint);
    }
    for (const unit of this.gathering.units) {
      if (!this.visuals.has(unit.id)) {
        const ring = this.add.circle(unit.position.x, unit.position.y, unit.kind==='soldier'?Math.max(20,combatUnitStats(unit).size*.75):20)
          .setStrokeStyle(2, 0xffdc73).setDepth(effectConfig.selectionDepth).setVisible(false);
        const art:UnitArt=unit.kind==='worker'?'worker':unit.archetype??'soldier';const origin=unitOrigin(art);
        const body=this.add.image(unit.position.x,unit.position.y,art==='air'?'air':'units',art==='air'?`${this.factions.player}-air-player-s-idle-0`:`${factions[this.factions.player].artPrefix}${art}-player-s-idle-0`).setOrigin(origin.x,origin.y);
        const cargo = this.add.text(unit.position.x, unit.position.y - 32, '',
          { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5, 0);
        this.visuals.set(unit.id, { body, ring, cargo });
      }
      const visual = this.visuals.get(unit.id)!;
      visual.body.setPosition(unit.position.x, unit.position.y);
      const marker=orderMarkers({ ...this.gathering,units:[{...unit,selected:true}] },{...this.combat,enemies:visibleEnemies},true,this.placement.barracks,this.placement.farms,this.placement.forge?.footprint)[0];
      const enemy=unit.order.kind==='attack'?visibleEnemies.find(e=>unit.order.kind==='attack'&&e.id===unit.order.enemyId):undefined;
      const attackRange=unit.kind==='soldier'?(unit.archetype==='archer'?archerConfig.range:unit.archetype==='catapult'?catapultConfig.range:combatConfig.soldierRange):workerCombatConfig.range;
      const animalTarget=unit.order.kind==='hunt'?animalPoses.find(a=>unit.order.kind==='hunt'&&a.id===unit.order.animalId):undefined;
      const action:Action=unit.order.kind==='hunt'&&unit.navigation?.status==='arrived'?'attack':unit.order.kind==='attack'&&enemy&&canInteract(this.map,unit.position,enemyBody(enemy),attackRange)?'attack':unit.order.kind==='gather'&&marker&&Math.hypot(marker.position.x-unit.position.x,marker.position.y-unit.position.y)<=gatheringConfig.nodeRadius+gatheringConfig.range?'gather':(unit.order.kind==='build'||unit.order.kind==='repair')&&unit.navigation?.status==='arrived'?'build':'idle';
      this.animateUnit(unit.id,visual.body,unit.position,action,unit.kind==='worker'?'worker':unit.archetype??'soldier','player',animalTarget?.position??enemy?.position??marker?.position);
      visual.ring.setPosition(unit.position.x, unit.position.y).setVisible(unit.selected);
      visual.cargo.setPosition(unit.position.x, unit.position.y - unitOverlayOffsets(unit.kind==='worker'?'worker':unit.archetype??'soldier',this.factions.player).cargo)
        .setVisible(unit.kind==='worker'&&unit.selected).setText(unit.kind==='worker'?`${unit.cargo.toFixed(1)}/${gatheringConfig.capacity} ${unit.cargoType??'wood'}`:'');
      if(unit.kind==='soldier')for(const kind of ['buff','debuff'])if(unit.spellEffects?.some(e=>spellDefinition(e.spell,e.sourceFaction).kind===kind))this.hpBars?.lineStyle(2,kind==='buff'?0x86dbe6:0xc18ce5,.9).strokeCircle(unit.position.x,unit.position.y,kind==='buff'?18:21);
      if(isAir(unit)){visual.body.setY(unit.position.y-airPresentation.height).setDepth(12);this.hpBars?.fillStyle(0x091311,.45).fillEllipse(unit.position.x,unit.position.y,28,9);}
      this.drawHP(unit.position,unit.hp??combatConfig.workerHP,unit.kind==='worker'?factions[this.factions.player].units.worker.hp:factions[this.factions.player].units[unit.archetype??'soldier'].hp,unit.kind==='soldier'&&unit.archetype==='catapult'?40:24,unitOverlayOffsets(unit.kind==='worker'?'worker':unit.archetype??'soldier',this.factions.player).hp,0x7398c1);
    }
    const publicHealth=[...warningSnapshot(this.currentMatch()),...visibleEnemies.map(e=>({id:e.id,hp:e.hp,position:{...e.position}}))].filter(p=>isVisible(this.fog,'player',p.position));
    for(const hit of hitEffects(this.hitSnapshot,publicHealth,this.visualTime,this.gameplayActive()))this.addImpact(hit);
    this.hitSnapshot=publicHealth;
    for(const [id,e] of this.impacts){if(!impactAlive(e.impact,this.visualTime,p=>isVisible(this.fog,'player',p))){e.visual.destroy();this.impacts.delete(id);}else e.visual.setFrame(impactFrame(e.impact,this.visualTime));}
    for(const [id,d] of this.deaths){if(!effectAlive(d.effect,this.visualTime,isVisible(this.fog,'player',d.effect.motion.position))){d.visual.destroy();this.deaths.delete(id);}else d.visual.setFrame(unitFrame(d.effect.motion,this.visualTime));}
    if(this.fogOverlay)drawFog(this.fogOverlay,this.fog,this.fogPreview??'player');
    for(const slot of spellSlots){const id=spellForSlot(this.factions.player,slot),button=document.getElementById(`cast-${slot}`) as HTMLButtonElement,caster=id?selectedSpellCaster(this.currentMatch(),id):undefined;button.disabled=!id||!caster||!!spellCasterReason(this.currentMatch(),caster.id,id);setActionLabel(button,id?spellDefinition(id,this.factions.player).name:'Unavailable');button.setAttribute('aria-pressed',String(!!id&&this.spellMode===id));}
    for(const shortcut of hotkeys){const button=document.getElementById(shortcut.button) as HTMLButtonElement;setActionLabel(button,`${button.textContent?.replace(/\s+\[[A-Z0-9]+\]$/,'')} [${shortcut.key}]`);}
    for(const id of ['hold-position','patrol-units'])(document.getElementById(id) as HTMLButtonElement).disabled=!this.gameplayActive()||!this.allSelectable().some(u=>u.selected);
    renderActionIcons(this.factions.player,(atlas,name)=>{const f=this.textures.get(atlas).get(name);return {image:f.source.image as HTMLImageElement,x:f.cutX,y:f.cutY,width:f.cutWidth,height:f.cutHeight};});
    renderActionPanel(actionPanel(this.currentMatch(),this.selectedBuilding,this.gameplayActive()));

    this.syncSpellPreview(this.worldPoint(this.input.activePointer));
    if(this.spellMode||this.spellFeedback)document.getElementById('action-hint')!.textContent=this.spellFeedback||`${spellDefinition(this.spellMode!,this.factions.player).name}: choose a target; Escape/right-click cancels`;
    if(this.patrolMode)document.getElementById('action-hint')!.textContent='Patrol: click endpoint; Shift appends. Escape/right-click cancels.';
    if(this.repairMode)document.getElementById('action-hint')!.textContent='Repair: click an own damaged building. Escape cancels.';
    renderTutorial(this.currentMatch());
    renderOperation(this.currentMatch());
    const goalMarkers=operationMarkers(this.currentMatch());this.operationGraphics?.clear();
    while(this.operationLabels.length>goalMarkers.length)this.operationLabels.pop()!.destroy();
    for(const [index,marker] of goalMarkers.entries()){
      this.operationGraphics?.lineStyle(2,marker.color,1).strokeCircle(marker.position.x,marker.position.y,marker.radius);
      if(!this.operationLabels[index])this.operationLabels[index]=this.add.text(0,0,'',{fontSize:'14px',color:'#f4d87a',backgroundColor:'#192b28'}).setOrigin(.5,1).setDepth(6);
      this.operationLabels[index].setText(marker.label).setPosition(marker.position.x,marker.position.y-marker.radius-4);
    }

    renderCommandFeedback(commandFeedback(this.currentMatch(),this.selectedBuilding,{spell:this.spellMode||this.spellFeedback?{message:this.spellFeedback||`${spellDefinition(this.spellMode!,this.factions.player).name}: choose a target; Escape/right-click cancels`,error:!!this.spellFeedback&&this.spellFeedbackError}:undefined,placementError:this.placementFeedbackError,attackMove:this.attackMoveMode,unload:!!this.unloadMode}));
    const feedback=updateAttackWarnings(this.warningState,warningSnapshot(this.currentMatch()),this.visualTime,this.gameplayActive());
    this.warningState=feedback.state;renderAttackWarning(feedback.state.warning);if(feedback.sound)gameAudio.play('warning');
    this.warningVisual?.clear();const warning=feedback.state.warning;
    if(warning)this.warningVisual?.lineStyle(3,attackWarningConfig.color).strokeCircle(warning.position.x,warning.position.y,attackWarningConfig.radius);
    document.getElementById('group-status')!.textContent=Object.entries(this.controlGroups).map(([slot,ids])=>`${slot}: ${ids.length}`).join(' · ')||uiText.groupsCtrl19Assign19Recall;
    this.syncAudio(visibleEnemies);
    this.minimap?.render();
    this.syncSession();
    // DOM controls can move the canvas (restart visibility, wrapping, scrolling).
    this.scale.updateBounds();
  }

  update(_time: number, delta: number): void {
    if(this.restartPending)return;
    this.cameraInput?.update(delta/1000);
    const previousShots=this.combat.projectiles??[];
    const dt=gameplayDelta(this.pendingDismiss?'paused':this.session.phase,delta/1000,this.skipGameplayFrame,this.session.options.speed??1);this.visualTime+=dt;
    const match = updateMatch(this.currentMatch(),dt);
    this.skipGameplayFrame=false;
    this.applyMatch(match);
    for(const impact of landedEffects(previousShots,this.combat.projectiles??[],dt,this.visualTime,p=>isVisible(this.fog,'player',p)))this.addImpact(impact);
    if(this.outcome!=='playing')this.session=sessionTransition(this.session,'end');
    this.syncVisuals();
  }

  private currentMatch():MatchState {return {discoveries:this.discoveries,...(this.session.options.aiProfile&&this.session.options.aiProfile!=='balanced'?{aiProfile:this.session.options.aiProfile}:{}),multiplePlayers:this.multiplePlayers,wildlife:this.wildlife,armyPlan:this.armyPlan,matchId:this.matchId,capture:this.capture,campaignMission:this.campaignMission,campaignRun:this.campaignRun,statLedger:this.statLedger,tutorial:this.tutorial,speed:this.session.options.speed??1,enemyNaval:this.enemyNaval,navy:this.navy,factions:{...this.factions},map:this.map,gathering:this.gathering,combat:this.combat,waves:this.waves,production:this.production,soldierProduction:this.soldierProduction,placement:this.placement,outcome:this.outcome,paused:!this.simulationActive(),controlGroups:this.controlGroups,fog:this.fog,research:this.research,scenario:this.scenario,difficulty:this.difficulty,enemyProduction:this.enemyProduction,enemyAI:this.enemyAI,enemyConstruction:this.enemyConstruction,enemyPolicy:this.enemyPolicy,enemyRecovery:this.enemyRecovery,enemyKnowledge:this.enemyKnowledge};}

  private addImpact(impact:Impact):void {
    if(!canAddImpact([...this.impacts.values()].map(e=>e.impact),impact))return;
    this.impacts.set(this.nextImpact++,{impact,visual:this.add.image(impact.position.x,impact.position.y,'ui',impactFrame(impact,this.visualTime)).setOrigin(.5).setDepth(effectConfig.groundDepth).setAlpha(effectConfig.groundAlpha)});
  }

  private syncSpellPreview(point:Position):void{this.spellGraphics?.clear();if(!this.spellMode||!this.gameplayActive())return;const m=this.currentMatch(),id=this.spellMode,caster=selectedSpellCaster(m,id);if(!caster)return;const target=spellTargetAt(m,id,point),valid=target&&!spellTargetReason(m,caster.id,id,target),cfg=spellDefinition(id,this.factions.player);this.spellGraphics!.lineStyle(1,0x86dbe6,.6).strokeCircle(caster.position.x,caster.position.y,cfg.range).lineStyle(2,valid?0x71edb0:0xee8a86,1).strokeCircle(point.x,point.y,16).lineBetween(point.x-22,point.y,point.x+22,point.y).lineBetween(point.x,point.y-22,point.x,point.y+22);}

  private drawHP(position:Position,hp:number,max:number,width:number,offset:number,color:number):void {this.hpBars?.fillStyle(0x172422).fillRect(position.x-width/2-1,position.y-offset-1,width+2,5).fillStyle(color).fillRect(position.x-width/2,position.y-offset,width*Math.max(0,Math.min(1,hp/max)),3);}

  private syncAudio(visibleEnemies:typeof this.combat.enemies):void {
    const next=matchAudioSnapshot(this.currentMatch(),visibleEnemies);
    const ready=readyVoiceSpeaker(this.audioSnapshot?.readyUnits,next.readyUnits??[],this.gameplayActive());
    if(ready)gameAudio.voices.speak(ready.role,'ready',ready.faction);
    const wasPlaying=this.session.phase==='playing'||this.audioSnapshot?.outcome==='playing'&&this.outcome!=='playing';
    for(const event of audioEvents(this.audioSnapshot,next,!!wasPlaying)){if(event==='victory'||event==='defeat'){gameAudio.setPhase('ended');gameAudio.play(event,true);}else if(event!=='impact'&&event!=='cannon')gameAudio.play(event);}
    const combatNext=combatAudioSnapshot(this.currentMatch(),this.combatSoundSnapshot),camera=this.cameras.main;
    for(const cue of combatAudioCues(this.combatSoundSnapshot,combatNext,{x:camera.scrollX+camera.width/2,y:camera.scrollY+camera.height/2},this.gameplayActive()))gameAudio.play(cue.sound,false,cue.gain);
    this.combatSoundSnapshot=combatNext;
    this.audioSnapshot=next;
  }

  private animateUnit(id:string,body:Phaser.GameObjects.Image,position:Position,action:Action,type:UnitArt,owner:'player'|'enemy',aim?:Position,artFaction?:import('../config/factions').FactionId):void {
    body.setDepth(1+position.y/this.map.height*4);
    const previous=this.motions.get(id);
    if(previous&&!this.gameplayActive()){body.setFrame(unitFrame(previous,this.visualTime));return;}
    // syncVisuals also runs on DOM input; preserve walk pose until the next simulation frame.
    const m=motion(previous,position,action,this.visualTime,type,owner,aim,artFaction??this.factions[owner]);
    this.motions.set(id,m);body.setFrame(unitFrame(m,this.visualTime));
  }
  private removedVisual(id:string,removed:boolean):void {
    const previous=this.motions.get(id);this.motions.delete(id);if(!previous)return;
    const effect=deathEffect(previous,this.visualTime,isVisible(this.fog,'player',previous.position),removed);
    if(effect){if(artAtlas(previous.type)==='naval')gameAudio.play('splash');else this.addImpact({kind:'dust',position:{...previous.position},since:this.visualTime});const origin=unitOrigin(previous.type);this.deaths.set(id,{effect,visual:this.add.image(previous.position.x,previous.position.y,artAtlas(previous.type),unitFrame(effect.motion,this.visualTime)).setOrigin(origin.x,origin.y).setDepth(effectConfig.groundDepth)});}
  }

  private allSelectable():(Unit|Ship)[]{return [...this.gathering.units,...(this.navy?.ships??[])];}
  private setSelectable(units:(Unit|Ship)[]):void {this.gathering.units=units.filter((u):u is Unit=>u.kind!=='ship');if(this.navy)this.navy={...this.navy,ships:units.filter((u):u is Ship=>u.kind==='ship')};}
  private syncNavy():void {
    const harbor=this.navy?.harbor;this.navyGraphics.clear();
    const transportButton=document.querySelector<HTMLButtonElement>('#train-transport')!,unloadButton=document.querySelector<HTMLButtonElement>('#unload-transport')!;transportButton.parentElement!.style.visibility=this.selectedBuilding==='harbor'?'visible':'hidden';transportButton.disabled=this.selectedBuilding!=='harbor'||!canTrainShip(this.currentMatch(),'transport');const selectedTransport=this.navy?.ships.find(s=>s.selected&&s.role==='transport');unloadButton.disabled=!this.gameplayActive()||!selectedTransport?.passengers?.length;if(this.unloadMode&&!this.navy?.ships.some(s=>s.id===this.unloadMode&&s.selected&&s.passengers?.length))this.unloadMode=null;document.getElementById('transport-status')!.textContent=this.unloadMode?uiText.clickAVisibleFreeLandingWithin64Px:selectedTransport?`Transport: ${selectedTransport.passengers?.length??0}/4 – ${selectedTransport.transfer?`Moving to coast to ${selectedTransport.transfer.kind}`:'Right-click with troops to board; Unload finds nearby land'}`:uiText.selectATransportToBoardOrUnload;
    this.harborButton.disabled=!this.gameplayActive()||this.placement.active||!!harbor||!this.gathering.units.some(u=>u.kind==='worker'&&u.selected);
    this.harborButton.setAttribute('aria-pressed',String(this.placement.active&&this.placement.kind==='harbor'));
    this.shipButton.parentElement!.style.visibility=this.selectedBuilding==='harbor'?'visible':'hidden';this.shipButton.disabled=this.selectedBuilding!=='harbor'||!canTrainShip(this.currentMatch());
    document.getElementById('harbor-status')!.textContent=harbor?`Harbor ${Math.ceil(harbor.hp)} HP · ${harbor.construction.remainingSeconds>0?uiText.construction3+harbor.construction.remainingSeconds.toFixed(1)+' s':this.navy!.production.remainingSeconds!==null?this.navy!.production.remainingSeconds===0?uiText.waitingForAFreeWaterExit:uiText.production+this.navy!.production.remainingSeconds.toFixed(1)+' s':'complete'} · ships use 2 supply`:uiText.selectAWorkerPlaceOnAVisibleCoast;
    if(!harbor&&this.harborLabel){this.harborLabel.destroy();this.harborLabel=undefined;}
    if(!harbor&&this.harborVisual){this.harborVisual.destroy();this.harborVisual=undefined;}
    if(harbor){const r=harbor.footprint;if(!this.harborLabel)this.harborLabel=this.add.text(r.x+32,r.y-30,uiText.harbor,{fontSize:'12px',color:'#d6eef1'}).setOrigin(.5).setDepth(7);
      if(!this.harborVisual)this.harborVisual=this.add.image(r.x+32,r.y+32,'buildings',buildingFrame('harbor','player',harbor.construction.remainingSeconds,5,this.factions.player,harbor.hp)).setOrigin(.5,.75).setDepth(1);this.harborVisual.setFrame(buildingFrame('harbor','player',harbor.construction.remainingSeconds,5,this.factions.player,harbor.hp));}
    for(const [id,body] of this.shipVisuals)if(!this.navy?.ships.some(s=>s.id===id)){this.removedVisual(id,true);body.destroy();this.shipVisuals.delete(id);}
    for(const [id,label] of this.shipLabels)if(!this.navy?.ships.some(s=>s.id===id)){label.destroy();this.shipLabels.delete(id);}
    for(const ship of this.navy?.ships??[]){const p=ship.position,type=ship.role==='transport'?'transport':'warship';this.drawHP(p,ship.hp,factions[this.factions.player].naval.units[ship.role??'warship'].hp,32,40,0x77c4cf);if(ship.selected)this.navyGraphics.lineStyle(2,0xffdf73).strokeCircle(p.x,p.y,22);
      if(!this.shipVisuals.has(ship.id))this.shipVisuals.set(ship.id,this.add.image(p.x,p.y,'naval',`${factions[this.factions.player].artPrefix}${type}-player-s-idle-0`).setOrigin(.5,40/64).setDepth(1));const body=this.shipVisuals.get(ship.id)!;body.setPosition(p.x,p.y);const target=ship.order.kind==='hunt'?visibleAnimals(this.currentMatch()).find(a=>ship.order.kind==='hunt'&&a.id===ship.order.animalId)?.position:ship.order.kind==='attack'?this.combat.enemies.find(e=>ship.order.kind==='attack'&&e.id===ship.order.enemyId&&entityVisible(this.fog,'player',e))?.position:undefined;this.animateUnit(ship.id,body,p,target?'attack':'idle',type,'player',target);
      if(!this.shipLabels.has(ship.id))this.shipLabels.set(ship.id,this.add.text(p.x,p.y-48,uiText.warship,{fontSize:'10px',color:'#d6eef1'}).setOrigin(.5).setDepth(7));this.shipLabels.get(ship.id)!.setPosition(p.x,p.y-48).setText(`${ship.role==='transport'?'Transport '+(ship.passengers?.length??0)+'/4':uiText.warship} ${Math.ceil(ship.hp)} HP`);
    }
  }
  private applyMatch(match: MatchState): void {
    this.multiplePlayers=match.multiplePlayers;
    this.discoveries=match.discoveries;this.wildlife=match.wildlife??{};this.armyPlan=match.armyPlan;
    this.matchId=match.matchId;
    this.capture=match.capture;
    this.campaignMission=match.campaignMission;this.campaignRun=match.campaignRun;
    this.statLedger=match.statLedger;
    this.tutorial=match.tutorial;
    this.navy=match.navy;this.enemyNaval=match.enemyNaval;
    this.factions={...(match.factions??defaultFactions)};
    this.controlGroups=match.controlGroups??{};
    this.enemyAI=match.enemyAI;
    this.enemyConstruction=match.enemyConstruction;
    this.enemyPolicy=match.enemyPolicy;this.enemyRecovery=match.enemyRecovery;this.enemyKnowledge=match.enemyKnowledge;
    this.enemyProduction=match.enemyProduction;
    if(this.session.phase!=='menu'){this.scenario=match.scenario??'survival';this.difficulty=match.difficulty??'normal';}
    this.research=match.research??createResearch();
    this.map = match.map;
    this.fog=match.fog??createFog(match.map);
    this.gathering = {...match.gathering,campaignContent:campaignContentFor(match)};
    this.combat = match.combat;
    this.waves = match.waves;
    this.production = match.production;
    this.soldierProduction = match.soldierProduction;
    this.placement = match.placement;
    this.outcome = match.outcome;
  }
}
