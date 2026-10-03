import {getPreferences,updatePreferences} from '../presentation/preferences';
import {voiceSpeaker,voiceOrders,orderedSpeaker} from '../presentation/voicePolicy';
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
import {attackShips,harborPlacementError,placeHarbor,trainShip,canTrainShip,commandShips,resumeHarbor,stopShips,matchPopulation,type NavyState,type Ship} from '../gameplay/navy';
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
import {motion,unitFrame,unitOrigin,artAtlas,deathEffect,effectAlive,type Motion,type DeathEffect,type Action,type UnitArt} from '../presentation/animation';
import { buildingFrame,buildingOrigin,terrainImageFrame,terrainEdges,resourceFrame,resourceOrigin } from '../presentation/assets';
import { createSession,sessionTransition,changeOptions,gameplayDelta,type MatchSession,type SessionAction } from '../gameplay/session';
import { hotkeys,hotkeyButton,dispatchHotkey,commandGuide } from '../presentation/hotkeys';
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
import { allowsProduction, baseFootprint, selectPlayerTarget, type BuildingSelection } from '../gameplay/buildingSelection';
import { dragCamera, type CameraDrag } from '../presentation/camera';
import { commandGroupMove } from '../gameplay/groupMovement';
import { arenaConfig } from '../config/arena';
import { tileFootprint, type WorldMap } from '../gameplay/map';
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
import { buildingFootprint, beginPlacement, cancelPlacement, placementError, placementObstacles, placeBuilding, type PlacementState } from '../gameplay/placement';
import { canStartProduction, startProduction, type ProductionState } from '../gameplay/production';
import { isNodeHit, orderUnits, resourceNodes, type GatheringState, type Unit } from '../gameplay/gathering';
import {
  isSelectionDrag, selectionRectangle,
  selectUnitsInRectangle,
} from '../gameplay/selection';

export class BootScene extends Phaser.Scene {
  private factions:MatchFactions=factionsForPlayer(getPreferences().game.faction);
  private controlGroups:ControlGroups={};
  private fog!:FogState;
  private fogOverlay?:Phaser.GameObjects.Graphics;
  private fogPreview:Team|null=(()=>{const q=new URLSearchParams(window.location.search).get('fog-preview');return q==='player'||q==='enemy'?q:null;})();
  private minimap?:ReturnType<typeof bindMinimap>;
  private enemyAI?:EnemyAIState;
  private enemyProduction?:EnemyProductionState;
  private scenario:MatchScenario=initialScenario(new URLSearchParams(window.location.search).get('scenario'));
  private difficulty:Difficulty=initialDifficulty(new URLSearchParams(window.location.search).get('difficulty')??getPreferences().game.difficulty);
  private session:MatchSession=createSession({scenario:this.scenario,difficulty:this.difficulty,map:scenarioConfig[this.scenario].map,faction:this.factions.player,speed:getPreferences().game.speed});
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
  private attackMoveMode=false;
  private attackMoveButton!:HTMLButtonElement;
  private stopButton!: HTMLButtonElement;
  private selectedBuilding: BuildingSelection = null;
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
  private previewPoint: Position = { x: 0, y: 0 };
  private placementClick = false;
  private placementPreview!: Phaser.GameObjects.Rectangle;
  private barracksVisual?: Phaser.GameObjects.Image;
  private farmVisuals = new Map<string, Phaser.GameObjects.Image>();
  private farmButton!:HTMLButtonElement;
  private buildButton!: HTMLButtonElement;
  private placementStatus!: HTMLElement;
  private production: ProductionState = { remainingSeconds: null, nextUnitNumber: 4 };
  private soldierProduction: ProductionState = { remainingSeconds: null, nextUnitNumber: 4 };
  private catapultButton!:HTMLButtonElement;
  private archerButton!:HTMLButtonElement;
  private projectileVisuals=new Map<string,Phaser.GameObjects.Graphics>();
  private soldierButton!: HTMLButtonElement;
  private soldierProductionStatus!: HTMLElement;
  private trainButton!: HTMLButtonElement;
  private productionStatus!: HTMLElement;
  private goldVisual!: Phaser.GameObjects.Image;
  private nodeVisual!: Phaser.GameObjects.Image;
  private extraResourceVisuals=new Map<string,{body:Phaser.GameObjects.Image;label:Phaser.GameObjects.Text}>();

  private visuals = new Map<string, { body: Phaser.GameObjects.Image; ring: Phaser.GameObjects.Arc; cargo: Phaser.GameObjects.Text }>();
  private awaitingLoadedResume=false;
  private pendingLoad?:{match:MatchState;view:SavedView};
  private hpBars?:Phaser.GameObjects.Graphics;
  private impacts=new Map<number,{impact:Impact;visual:Phaser.GameObjects.Image}>();
  private nextImpact=1;
  private audioSnapshot?:AudioSnapshot;
  private visualTime=0;
  private hitSnapshot?:HealthSample[];
  private motions=new Map<string,Motion>();
  private deaths=new Map<string,{effect:DeathEffect;visual:Phaser.GameObjects.Image}>();
  private drag?: { world: Position; screen: Position; active: boolean;shift:boolean };
  private dragBox!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('BootScene');
  }

  preload():void {for(const key of ['world','buildings','units','ui','naval'])if(!this.textures.exists(key))this.load.atlas(key,`${import.meta.env.BASE_URL}assets/${key}-atlas.png`,`${import.meta.env.BASE_URL}assets/${key}-atlas.json`);}

  create(): void {
    this.audioSnapshot=undefined;gameAudio.setPhase('menu');gameAudio.reset();
    this.warningState=createWarningState();this.warningVisual=this.add.graphics().setDepth(9);
    this.visualTime=0;this.extraResourceVisuals.clear();this.hitSnapshot=undefined;this.motions.clear();this.deaths.clear();this.impacts.clear();this.nextImpact=1;
    this.hpBars=this.add.graphics().setDepth(7);
    const loaded=this.pendingLoad;this.pendingLoad=undefined;
    if(!loaded)document.getElementById('save-status')!.textContent='';
    this.applyMatch(loaded?.match??createMatch(this.scenario,this.difficulty,this.factions,this.session.options.map,this.session.options.speed??1));
    this.game.canvas.tabIndex=0;this.game.canvas.setAttribute('aria-label',uiText.gameWorld);
    const groupKey=(event:KeyboardEvent)=>{
      if(!gameplayKeyAllowed(keyboardContext(event,this.gameplayActive()))||!validGroup(event.key))return;
      event.preventDefault();
      if(event.ctrlKey||event.metaKey)this.controlGroups=bindGroup(this.controlGroups,event.key,this.allSelectable(),u=>entityVisible(this.fog,'player',u));
      else{this.setSelectable(recallGroup(this.controlGroups,event.key,this.allSelectable(),u=>entityVisible(this.fog,'player',u)));this.selectedBuilding=null;this.attackMoveMode=false;this.placement=cancelPlacement(this.placement);this.drag=undefined;this.dragBox.setVisible(false);gameAudio.say(voiceSpeaker(this.allSelectable()),'select',this.factions.player);}
      this.syncVisuals();
    };window.addEventListener('keydown',groupKey);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>window.removeEventListener('keydown',groupKey));
    this.fogOverlay=this.add.graphics().setDepth(40);
    const fixture=document.getElementById('fog-fixture')!;fixture.hidden=!this.fogPreview;fixture.textContent=`FOG FIXTURE (${this.fogPreview}) – model preview; information filtering uses the player team`;
    this.scenarioSelect=document.querySelector<HTMLSelectElement>('#scenario-select')!;
    this.scenarioSelect.replaceChildren(...playableScenarios.map(id=>{const option=document.createElement('option');option.value=id;option.textContent=scenarioConfig[id].label;return option;}));
    this.scenarioSelect.value=this.scenario==='siege-test'?'survival':this.scenario;
    const changeScenario=()=>{if(!playableScenarios.includes(this.scenarioSelect.value as MatchScenario))return;this.session=changeOptions(this.session,{scenario:this.scenarioSelect.value as MatchScenario});this.scenario=this.session.options.scenario;this.syncSession();};
    const mapSelect=document.querySelector<HTMLSelectElement>('#map-select')!;
    const changeMap=()=>{if(this.session.phase==='menu'&&this.session.options.scenario==='skirmish'&&isMapId(mapSelect.value)){this.session=changeOptions(this.session,{map:mapSelect.value});this.syncSession();}};
    mapSelect.addEventListener('change',changeMap);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>mapSelect.removeEventListener('change',changeMap));
    this.scenarioSelect.addEventListener('change',changeScenario);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.scenarioSelect.removeEventListener('change',changeScenario));

    const difficultySelect=document.querySelector<HTMLSelectElement>('#difficulty-select')!;difficultySelect.value=this.difficulty;
    const speedSelect=document.querySelector<HTMLSelectElement>('#speed-select')!;const changeSpeed=()=>{const speed=Number(speedSelect.value);if(!isGameSpeed(speed))return;this.session=changeOptions(this.session,{speed});this.saveGamePreferences();this.syncSession();};speedSelect.addEventListener('change',changeSpeed);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>speedSelect.removeEventListener('change',changeSpeed));
    const changeDifficulty=()=>{if(!Object.hasOwn(difficultyProfiles,difficultySelect.value))return;this.session=changeOptions(this.session,{difficulty:difficultySelect.value as Difficulty});this.difficulty=this.session.options.difficulty;this.saveGamePreferences();this.syncSession();};
    difficultySelect.addEventListener('change',changeDifficulty);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>difficultySelect.removeEventListener('change',changeDifficulty));

    const factionSelect=document.querySelector<HTMLSelectElement>('#faction-select')!;
    const changeFaction=()=>{if(this.session.phase!=='menu'||!isFactionId(factionSelect.value))return;this.session=changeOptions(this.session,{faction:factionSelect.value});this.factions=factionsForPlayer(factionSelect.value);this.saveGamePreferences();this.syncSession();};
    factionSelect.addEventListener('change',changeFaction);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>factionSelect.removeEventListener('change',changeFaction));

    this.minimap=bindMinimap(document.querySelector<HTMLCanvasElement>('#minimap')!,()=>({data:visibleMinimapData(this.currentMatch()),scroll:{x:this.cameras.main.scrollX,y:this.cameras.main.scrollY},viewport:{width:this.cameras.main.width,height:this.cameras.main.height}}),point=>this.cameras.main.setScroll(point.x,point.y),()=>this.gameplayActive());
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.minimap?.destroy());

    this.unloadMode=null;this.attackMoveMode=false;
    this.attackMoveButton=document.querySelector<HTMLButtonElement>('#attack-move')!;
    const beginAttackMove=()=>{
      if(!this.gameplayActive()||!this.gathering.units.some(u=>u.kind==='soldier'&&u.selected))return;
      this.attackMoveMode=true;this.placement=cancelPlacement(this.placement);this.drag=undefined;
      this.dragBox.setVisible(false);this.syncVisuals();
    };
    this.attackMoveButton.addEventListener('click',beginAttackMove);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.attackMoveButton.removeEventListener('click',beginAttackMove));
    this.queuePanel=document.getElementById('production-queue')!;
    const cancelJob=(event:MouseEvent)=>{
      if(!this.gameplayActive()||!this.selectedBuilding)return;
      const button=event.target instanceof Element?event.target.closest<HTMLButtonElement>('button[data-job-id]'):null;
      if(!button||!this.queuePanel.contains(button))return;
      const p=this.selectedBuilding==='harbor'?this.navy!.production:this.selectedBuilding==='base'?this.production:this.soldierProduction;
      const result=cancelProduction(this.gathering,p,button.dataset.jobId!,true);
      this.gathering=result.gathering;
      if(this.selectedBuilding==='harbor')this.navy={...this.navy!,production:result.production};else if(this.selectedBuilding==='base')this.production=result.production;else this.soldierProduction=result.production;
      this.syncVisuals();
    };
    this.queuePanel.addEventListener('click',cancelJob);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.queuePanel.removeEventListener('click',cancelJob));
    this.shipLabels.clear();this.shipVisuals.clear();this.harborVisual=undefined;this.harborLabel=undefined;this.navyGraphics=this.add.graphics().setDepth(effectConfig.selectionDepth);
    this.projectileVisuals.clear();
    this.orderVisuals.clear();
    this.farmVisuals.clear();
    this.stopButton = document.querySelector<HTMLButtonElement>('#stop-units')!;
    const stop = () => { const before=voiceOrders(this.allSelectable());this.attackMoveMode=false; this.gathering.units = stopSelected(this.gathering.units, this.gameplayActive());if(this.gameplayActive())this.navy=stopShips(this.navy);gameAudio.say(orderedSpeaker(before,this.allSelectable()),'order',this.factions.player); this.syncVisuals(); };
    this.stopButton.addEventListener('click', stop);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.stopButton.removeEventListener('click', stop));
    this.selectedBuilding = loaded?.view.building??null;
    this.rallyMarker = this.add.circle(0, 0, 8).setStrokeStyle(2, 0x7bd389).setDepth(6).setVisible(false);
    this.buildingRing = this.add.rectangle(0, 0, 0, 0).setOrigin(0).setStrokeStyle(2, 0xffdc73).setDepth(effectConfig.selectionDepth).setVisible(false);
    this.cameras.main.setBounds(0, 0, this.map.width, this.map.height).setZoom(1).setScroll(loaded?.view.camera.x??0,loaded?.view.camera.y??0);
    const resizeCamera=()=>{const v=viewportGeometry(this.scale.width,this.scale.height,this.map);const camera=this.cameras.main;camera.setViewport(v.camera.x,v.camera.y,v.camera.width,v.camera.height);camera.setBounds(0,0,this.map.width,this.map.height);camera.setScroll(Math.max(0,Math.min(camera.scrollX,this.map.width-camera.width)),Math.max(0,Math.min(camera.scrollY,this.map.height-camera.height)));this.drag=undefined;this.cameraDrag=undefined;this.dragBox?.setVisible(false);};
    resizeCamera();this.scale.on(Phaser.Scale.Events.RESIZE,resizeCamera);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.scale.off(Phaser.Scale.Events.RESIZE,resizeCamera));
    this.cameraDrag = undefined;
    this.cameraInput=bindCameraInput(this.game.canvas,()=>{const c=this.cameras.main;return {scroll:{x:c.scrollX,y:c.scrollY},world:this.map,camera:{x:c.x,y:c.y,width:c.width,height:c.height}};},()=>this.gameplayActive()&&!this.cameraDrag&&!this.drag,p=>{this.cameras.main.setScroll(p.x,p.y);if(this.placement.active)this.previewPoint=this.worldPoint(this.input.activePointer);});
    const cameraKey=(event:KeyboardEvent)=>{const shortcut=cameraShortcut(event.key,{...keyboardContext(event,this.gameplayActive()),ctrlKey:event.ctrlKey,metaKey:event.metaKey});if(!shortcut||this.drag||this.cameraDrag)return;event.preventDefault();const c=this.cameras.main,target=cameraFocus(shortcut==='base'?[this.gathering.base]:selectionFocusPoints(this.currentMatch(),this.selectedBuilding),this.map,{width:c.width,height:c.height});if(target){c.setScroll(target.x,target.y);if(this.placement.active)this.previewPoint=this.worldPoint(this.input.activePointer);this.syncVisuals();}};
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
    for (let row = 0; row < Math.ceil(this.map.height / this.map.tileSize); row++) {
      for (let column = 0; column < Math.ceil(this.map.width / this.map.tileSize); column++) {
        const rect = tileFootprint(this.map, { column, row })!;
        this.add.image(rect.x,rect.y,'world',terrainImageFrame(column,row,this.map.id)).setOrigin(0).setDepth(-10);
        for(const edge of terrainEdges(column,row,this.map.id))this.add.image(rect.x,rect.y,'world',edge).setOrigin(0).setDepth(-9);
      }
    }
    this.baseVisual=this.add.image(this.gathering.base.x,this.gathering.base.y,'buildings',buildingFrame('base','player',0,5,this.factions.player)).setOrigin(.5,.75);
    this.baseLabel=this.add.text(this.gathering.base.x, this.gathering.base.y + 30, 'Base',
      { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5, 0);
    this.nodeVisual=this.add.image(this.gathering.node.position.x,this.gathering.node.position.y,'world','wood-available').setOrigin(resourceOrigin.x,resourceOrigin.y);
    this.goldVisual=this.add.image(this.gathering.gold!.position.x,this.gathering.gold!.position.y,'world','gold-available').setOrigin(resourceOrigin.x,resourceOrigin.y);
    this.add.text(this.gathering.gold!.position.x, this.gathering.gold!.position.y+26, 'Gold',
      {fontSize:'16px',color:'#ffffff'}).setOrigin(.5,0);
    this.visuals.clear();
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
    this.buildButton.textContent = `Build ${factions[this.factions.player].buildingNames.barracks} – ${costLabel(costs.barracks)}`;
    const begin = (kind:'harbor'|'barracks'|'farm'|'forge'='barracks') => {
      if (!this.gameplayActive()) return;
      if (!this.gathering.units.some(u=>u.kind==='worker' && u.selected)) return;
      this.unloadMode=null;this.attackMoveMode=false;
      if(kind==='harbor'&&this.navy?.harbor)return;
      this.placement = beginPlacement(this.placement,kind);
      this.drag = undefined;
      this.dragBox.setVisible(false);
      this.previewPoint = this.worldPoint(this.input.activePointer);
      this.syncVisuals();
    };
    const cancel = (event?:KeyboardEvent) => {
      if(event&&!gameplayKeyAllowed(keyboardContext(event,this.gameplayActive())))return;
      if (!this.gameplayActive()) return;
      this.unloadMode=null;this.attackMoveMode=false;
      this.placement = cancelPlacement(this.placement);
      this.syncVisuals();
    };
    const beginBarracks=()=>begin();
    this.forgeVisual=undefined;
    const beginForge=()=>begin('forge');
    this.forgeButton=document.querySelector<HTMLButtonElement>('#build-forge')!;
    this.forgeButton.textContent=`Build ${factions[this.factions.player].buildingNames.forge} – ${costLabel(costs.forge)}`;
    this.forgeButton.addEventListener('click',beginForge);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.forgeButton.removeEventListener('click',beginForge));
    this.researchButtons.clear();
    for(const kind of ['attack','defense'] as const){
      const button=document.querySelector<HTMLButtonElement>(`#research-${kind}`)!;
      const research=()=>{const result=startResearch(this.gathering,this.research,this.placement,kind,this.gameplayActive());this.gathering=result.gathering;this.research=result.research;this.syncVisuals();};
      this.researchButtons.set(kind,button);button.addEventListener('click',research);
      this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>button.removeEventListener('click',research));
    }
    const beginFarm=()=>begin('farm');
    this.farmButton=document.querySelector<HTMLButtonElement>('#build-farm')!;
    this.farmButton.textContent=`Build ${factions[this.factions.player].buildingNames.farm} – ${costLabel(costs.farm)}`;
    this.farmButton.addEventListener('click',beginFarm);
    this.buildButton.addEventListener('click', beginBarracks);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.buildButton.removeEventListener('click', beginBarracks);
      this.farmButton.removeEventListener('click',beginFarm);
    });
    this.harborButton=document.querySelector<HTMLButtonElement>('#build-harbor')!;this.shipButton=document.querySelector<HTMLButtonElement>('#train-ship')!;
    const transportButton=document.querySelector<HTMLButtonElement>('#train-transport')!,unloadButton=document.querySelector<HTMLButtonElement>('#unload-transport')!;
    const trainTransport=()=>{if(!this.gameplayActive()||this.selectedBuilding!=='harbor')return;this.applyMatch(trainShip(this.currentMatch(),'transport'));this.syncVisuals();};
    const beginUnload=()=>{const ship=this.navy?.ships.find(s=>s.selected&&s.role==='transport'&&s.passengers?.length);if(!this.gameplayActive()||!ship)return;this.unloadMode=ship.id;this.placement=cancelPlacement(this.placement);this.attackMoveMode=false;this.drag=undefined;this.dragBox.setVisible(false);this.syncVisuals();};
    transportButton.addEventListener('click',trainTransport);unloadButton.addEventListener('click',beginUnload);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{transportButton.removeEventListener('click',trainTransport);unloadButton.removeEventListener('click',beginUnload);});
    const beginHarbor=()=>begin('harbor'),ship=()=>{if(!this.gameplayActive()||this.selectedBuilding!=='harbor')return;this.applyMatch(trainShip(this.currentMatch()));this.syncVisuals();};
    this.harborButton.addEventListener('click',beginHarbor);this.shipButton.addEventListener('click',ship);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{this.harborButton.removeEventListener('click',beginHarbor);this.shipButton.removeEventListener('click',ship);});
    this.trainButton = document.querySelector<HTMLButtonElement>('#train-worker')!;
    this.productionStatus = document.querySelector<HTMLElement>('#production-status')!;
    this.trainButton.textContent = `Train ${factions[this.factions.player].unitNames.worker} – ${costLabel(factions[this.factions.player].units.worker.cost)}`;
    const train = () => {
      if (!allowsProduction(this.selectedBuilding, 'base', true, this.gameplayActive())) return;
      const result = enqueueProduction(this.gathering, this.production,{kind:'base'},matchPopulation(this.currentMatch()));
      this.gathering = result.gathering;
      this.production = result.production;
      this.syncVisuals();
    };
    this.trainButton.addEventListener('click', train);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.trainButton.removeEventListener('click', train);
    });
    this.soldierButton = document.querySelector<HTMLButtonElement>('#train-soldier')!;
    this.soldierProductionStatus = document.querySelector<HTMLElement>('#soldier-production-status')!;
    this.soldierButton.textContent = `Train ${factions[this.factions.player].unitNames.soldier} – ${costLabel(factions[this.factions.player].units.soldier.cost)} · ${factions[this.factions.player].units.soldier.durationSeconds} s`;
    const trainSoldier = () => {
      if (!allowsProduction(this.selectedBuilding, 'barracks', this.placement.barracks !== null, this.gameplayActive())) return;
      const result = enqueueProduction(this.gathering, this.soldierProduction,
        { kind: 'barracks', footprint: this.placement.barracks, ready:barracksReady(this.placement) },matchPopulation(this.currentMatch()));
      this.gathering = result.gathering;
      this.soldierProduction = result.production;
      this.syncVisuals();
    };
    this.archerButton=document.querySelector<HTMLButtonElement>('#train-archer')!;
    this.archerButton.textContent=`Train ${factions[this.factions.player].unitNames.archer} – ${costLabel(factions[this.factions.player].units.archer.cost)}`;
    const trainArcher=()=>{
      if(!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive()))return;
      const result=enqueueProduction(this.gathering,this.soldierProduction,
        {kind:'barracks',footprint:this.placement.barracks,ready:barracksReady(this.placement),unitType:'archer'},
        matchPopulation(this.currentMatch()));
      this.gathering=result.gathering;this.soldierProduction=result.production;this.syncVisuals();
    };
    this.catapultButton=document.querySelector<HTMLButtonElement>('#train-catapult')!;
    this.catapultButton.textContent=`Train ${factions[this.factions.player].unitNames.catapult} – ${costLabel(factions[this.factions.player].units.catapult.cost)}`;
    const trainCatapult=()=>{
      if(!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive()))return;
      const result=enqueueProduction(this.gathering,this.soldierProduction,
        {kind:'barracks',footprint:this.placement.barracks,ready:barracksReady(this.placement),unitType:'catapult'},
        matchPopulation(this.currentMatch()));
      this.gathering=result.gathering;this.soldierProduction=result.production;this.syncVisuals();
    };
    this.catapultButton.addEventListener('click',trainCatapult);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.catapultButton.removeEventListener('click',trainCatapult));
    this.archerButton.addEventListener('click',trainArcher);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.archerButton.removeEventListener('click',trainArcher));
    this.soldierButton.addEventListener('click', trainSoldier);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.soldierButton.removeEventListener('click', trainSoldier);
    });
    const abilityButton=document.querySelector<HTMLButtonElement>('#unit-ability')!;
    const activateAbility=()=>{this.gathering=useAbility(this.gathering,this.gameplayActive());this.syncVisuals();};
    abilityButton.addEventListener('click',activateAbility);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>abilityButton.removeEventListener('click',activateAbility));
    const saveButton=document.getElementById('save-match') as HTMLButtonElement;
    const loadButton=document.getElementById('load-match') as HTMLButtonElement;
    const save=()=>{if(this.session.phase==='menu'||this.restartPending)return;const result=storeSave(()=>window.localStorage,this.currentMatch(),{camera:{x:this.cameras.main.scrollX,y:this.cameras.main.scrollY},building:this.selectedBuilding});document.getElementById('save-status')!.textContent=result.ok?uiText.savedLocallyInSlot1:uiText.couldNotSaveLocallyCheckBrowserStorage;};
    const load=()=>{if(this.restartPending)return;const result=readSave(()=>window.localStorage);if(!result.ok){document.getElementById('save-status')!.textContent=result.code==='missing'?result.error:result.code==='version'?uiText.thisSaveUsesAnUnsupportedFormatOrGame:uiText.couldNotReadTheSaveTheActiveMatch;return;}this.awaitingLoadedResume=result.match.outcome==='playing';this.pendingLoad={match:{...result.match,paused:true},view:result.view};this.scenario=result.match.scenario!;this.difficulty=result.match.difficulty!;this.session={options:{scenario:this.scenario,difficulty:this.difficulty,map:result.match.map.id??'arena',faction:result.match.factions?.player??defaultFactions.player,speed:result.match.speed??1},phase:result.match.outcome==='playing'?'paused':'ended'};this.skipGameplayFrame=true;this.restartPending=true;this.restartButton.disabled=true;gameAudio.setPhase(this.session.phase);document.getElementById('save-status')!.textContent=result.match.outcome==='playing'?uiText.loadedPausedNoGameplayTimePassesUntilResume:uiText.loadedCompletedMatch;this.scene.restart();};
    saveButton.addEventListener('click',save);loadButton.addEventListener('click',load);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{saveButton.removeEventListener('click',save);loadButton.removeEventListener('click',load);});
    for(const [id,action] of [['start-match','start'],['pause-match','pause'],['resume-match','resume'],['new-match','new-match']] as const){const button=document.getElementById(id)!;const handler=()=>this.sessionAction(action);button.addEventListener('click',handler);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>button.removeEventListener('click',handler));}
    document.getElementById('command-guide-text')!.textContent=commandGuide;
    const actionKey=(event:KeyboardEvent)=>{
      const menuContext={...keyboardContext(event,this.session.phase==='playing'||this.session.phase==='paused'),ctrlKey:event.ctrlKey,metaKey:event.metaKey};
      if(!event.ctrlKey&&!event.metaKey&&gameplayKeyAllowed(menuContext)&&(event.key.toLowerCase()==='p'||event.key==='Escape'&&(this.session.phase==='paused'||!this.placement.active&&!this.attackMoveMode&&!this.unloadMode))){event.preventDefault();this.sessionAction(this.session.phase==='paused'?'resume':'pause');return;}
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

  private gameplayActive():boolean{return this.session.phase==='playing'&&this.outcome==='playing'&&!this.restartPending;}
  private sessionAction(action:SessionAction):void {
    const next=sessionTransition(this.session,action);if(next===this.session||this.restartPending)return;
    this.session=action==='new-match'?changeOptions(next,getPreferences().game):next;gameAudio.setPhase(next.phase);
    if(action==='start')this.factions=factionsForPlayer(next.options.faction??defaultFactions.player);
    if(action==='start'||action==='restart'){this.awaitingLoadedResume=false;this.scenario=next.options.scenario;this.difficulty=next.options.difficulty;this.skipGameplayFrame=true;this.restartPending=true;this.restartButton.disabled=true;this.scene.restart();return;}
    if(action==='resume'){this.skipGameplayFrame=true;if(this.awaitingLoadedResume){document.getElementById('save-status')!.textContent=uiText.loadedMatchResumed;this.awaitingLoadedResume=false;}}
    if(action==='pause'||action==='new-match'){this.placement=cancelPlacement(this.placement);this.unloadMode=null;this.attackMoveMode=false;this.drag=undefined;this.cameraDrag=undefined;this.dragBox.setVisible(false);}
    this.syncVisuals();
  }
  private saveGamePreferences():void {if(this.session.phase==='menu')updatePreferences({game:{difficulty:this.session.options.difficulty,faction:this.session.options.faction??defaultFactions.player,speed:this.session.options.speed??1}});}

  private syncSession():void {
    gameAudio.setPhase(this.session.phase);
    if(gameAudio.status.loaded)document.getElementById('audio-status')!.textContent=`${gameAudio.status.loaded}/${audioFiles.length} sounds loaded · ${gameAudio.settings.muted?uiText.muted:this.session.phase==='paused'?'paused':'ready'}${gameAudio.voices.status.available?'':' · Unit voices unavailable'}`;
    (document.getElementById('save-match') as HTMLButtonElement).disabled=this.session.phase==='menu'||this.restartPending;
    (document.getElementById('load-match') as HTMLButtonElement).disabled=this.restartPending;
    const phase=this.session.phase,menu=phase==='menu';
    renderMatchResults(document.getElementById('match-results')!,this.currentMatch(),phase==='ended');
    const details=matchSettingDetails(this.session.options);document.getElementById('map-description')!.textContent=details.map;document.getElementById('difficulty-description')!.textContent=details.difficulty;
    const summary=document.getElementById('match-options-summary')!;summary.textContent=matchSettingsSummary(this.session.options);summary.hidden=!menu;
    const mapSelect=document.querySelector<HTMLSelectElement>('#map-select')!;mapSelect.disabled=!menu||this.session.options.scenario!=='skirmish';mapSelect.value=this.session.options.map;
    const factionSelect=document.querySelector<HTMLSelectElement>('#faction-select')!;factionSelect.disabled=!menu;factionSelect.value=this.session.options.faction??defaultFactions.player;
    this.scenarioSelect.disabled=!menu;this.scenarioSelect.value=this.session.options.scenario==='siege-test'?'survival':this.session.options.scenario;
    const speed=document.querySelector<HTMLSelectElement>('#speed-select')!;speed.disabled=!menu;speed.value=String(this.session.options.speed??1);
    const difficulty=document.querySelector<HTMLSelectElement>('#difficulty-select')!;difficulty.disabled=!menu;difficulty.value=this.session.options.difficulty;
    for(const [id,show] of [['start-match',menu],['pause-match',phase==='playing'],['resume-match',phase==='paused'],['new-match',!menu],['restart-match',phase==='paused'||phase==='ended']] as const)(document.getElementById(id) as HTMLButtonElement).hidden=!show;
    (document.getElementById('gameplay-controls') as HTMLFieldSetElement).disabled=!this.gameplayActive();
    document.getElementById('hud')!.hidden=menu;const game=document.getElementById('game')!,wasHidden=game.hidden;game.hidden=menu;
    if(wasHidden&&!menu)this.scale.refresh();
    document.getElementById('mission-instruction')!.textContent=this.session.options.scenario==='skirmish'?(maps[this.session.options.map??'arena'].instruction??scenarioConfig.skirmish.instruction):scenarioConfig[this.session.options.scenario].instruction;
    document.getElementById('session-status')!.textContent=menu?uiText.chooseAScenarioAndDifficultyThenStartMatch:phase==='paused'?uiText.pausedSimulationIsFrozen:phase==='ended'?uiText.theMatchHasEndedRestartOrChooseA:`${scenarioConfig[this.session.options.scenario].label} · ${this.session.options.difficulty} · ${maps[this.session.options.map].label}`;
    syncHomeMenu(phase);
  }

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
    gameAudio.say(orderedSpeaker(before,this.allSelectable()),'order',this.factions.player);
  }

  private processDown(pointer: Phaser.Input.Pointer): void {
    if (!this.gameplayActive()) return;
    const camera=this.cameras.main;if(pointer.x<camera.x||pointer.y<camera.y||pointer.x>=camera.x+camera.width||pointer.y>=camera.y+camera.height)return;
    this.game.canvas.focus({preventScroll:true});
    if (pointer.button === 1) {
      if (this.drag) return;
      this.cameraDrag = { screen: { x: pointer.x, y: pointer.y },
        scroll: { x: this.cameras.main.scrollX, y: this.cameras.main.scrollY } };
      return;
    }
    if (this.cameraDrag) return;
    const world = this.worldPoint(pointer);
    if(this.unloadMode&&(pointer.button===0||pointer.button===2)){this.placementClick=true;if(pointer.button===2)this.unloadMode=null;else{const before=this.currentMatch(),after=unloadTransport(before,this.unloadMode,world);if(after!==before){this.applyMatch(after);this.unloadMode=null;}}this.syncVisuals();return;}
    if(this.attackMoveMode&&(pointer.button===0||pointer.button===2)) {
      this.unloadMode=null;this.attackMoveMode=false;this.placementClick=true;
      if(pointer.button===0)this.gathering.units=commandAttackMove(this.gathering.units,world,this.map);
      this.syncVisuals();return;
    }
    if (this.placement.active) {
      this.placementClick = true;
      this.previewPoint = world;
      if (pointer.button === 2) {
        this.placement = cancelPlacement(this.placement);
      } else if (pointer.button === 0) {
        if(!placementVisible(this.fog,buildingFootprint(world,this.placement.kind??'barracks'))){this.syncVisuals();return;}
        if(this.placement.kind==='harbor'){this.applyMatch(placeHarbor(this.currentMatch(),world));this.syncVisuals();return;}
        const result = placeBuilding(this.placement, world, this.gathering.wood, placementObstacles(this.gathering),
          {map:this.map,gathering:this.gathering,enemies:this.combat.enemies});
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
        if(this.selectedBuilding==='harbor'){this.syncVisuals();return;}
        if (this.selectedBuilding === 'base') this.production = setRally(this.production, world, this.map,
          baseFootprint(this.gathering.base), 'base');
        else this.soldierProduction = setRally(this.soldierProduction, world, this.map, this.placement.barracks, 'barracks');
        this.syncVisuals();
        return;
      }
      const transport=this.navy?.ships.find(s=>s.role==='transport'&&Math.abs(world.x-s.position.x)<=navyConfig.ship.size/2&&Math.abs(world.y-s.position.y)<=navyConfig.ship.size/2);if(transport&&this.gathering.units.some(u=>u.selected)){this.applyMatch(loadTransport(this.currentMatch(),transport.id));this.syncVisuals();return;}
      const harbor=this.navy?.harbor;if(harbor&&harbor.construction.remainingSeconds>0&&world.x>=harbor.footprint.x&&world.x<=harbor.footprint.x+64&&world.y>=harbor.footprint.y&&world.y<=harbor.footprint.y+64){this.applyMatch(resumeHarbor(this.currentMatch()));this.syncVisuals();return;}
      const forge=this.placement.forge;
      if(forge&&forge.construction.remainingSeconds>0&&world.x>=forge.footprint.x&&world.x<=forge.footprint.x+forge.footprint.width&&world.y>=forge.footprint.y&&world.y<=forge.footprint.y+forge.footprint.height){const result=resumeConstruction(this.gathering,this.placement,this.map,'forge');this.gathering=result.gathering;this.placement=result.placement;this.syncVisuals();return;}
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
      const enemy = enemyAt(this.combat.enemies.filter(e=>entityVisible(this.fog,'player',e)), world);
      const resource = resourceNodes(this.gathering).find(n=> knownResource(this.fog,n.position)&&isNodeHit(world,n));
      if(enemy)this.navy=attackShips(this.currentMatch(),enemy.id);
      if(!enemy&&!resource)this.navy=commandShips(this.currentMatch(),world);
      this.gathering.units = enemy ? orderAttack(this.gathering.units, enemy.id)
        : resource ? orderUnits(this.gathering.units, world, resource)
          : commandGroupMove(this.gathering.units, world, this.map);
    }
  }

  private handleMove(pointer: Phaser.Input.Pointer): void {
    if (!this.gameplayActive()) return;
    if(pointer.event.target instanceof Element&&pointer.event.target.closest('#hud, #match-menu, #game-toolbar, #minimap-overlay, #top-bar, #bottom-bar'))return;
    if (this.cameraDrag) {
      const scroll = dragCamera(this.cameraDrag, { x: pointer.x, y: pointer.y }, this.map,
        { width: this.cameras.main.width, height: this.cameras.main.height });
      this.cameras.main.setScroll(scroll.x, scroll.y);
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
    if (pointer.event.target instanceof Element && pointer.event.target.closest('#hud, #match-menu, #game-toolbar, #minimap-overlay, #top-bar, #bottom-bar')) {
      this.drag = undefined;
      this.dragBox.setVisible(false);
      return;
    }
    this.handleMove(pointer);
    const end = this.worldPoint(pointer);
    if (this.drag.active) {
      const all=this.allSelectable(),hits=selectUnitsInRectangle(all, this.drag.world, end);
      this.setSelectable(this.drag.shift?combineSelection(all,hits,'add'):hits);
      if(!this.drag.shift||this.allSelectable().some(u=>u.selected))this.selectedBuilding = null;
    } else {
      const selected = selectPlayerTarget(this.allSelectable(), end, this.gathering.base,
        this.placement.barracks, u=>u.kind==='ship'?navyConfig.ship.size:u.kind==='worker'?unitStats.size:combatUnitStats(u).size,this.navy?.harbor?.footprint);
      if(this.drag.shift&&!selected.building){
        this.setSelectable(combineSelection(this.allSelectable(),selected.units,'toggle'));
        if(selected.units.some(u=>u.selected))this.selectedBuilding=null;
      }else{this.setSelectable(selected.units);this.selectedBuilding=selected.building;}
    }
    this.drag = undefined;
    this.dragBox.setVisible(false);
    this.syncVisuals();
  }

  private syncPlacement(): void {
    const forge=this.placement.forge;
    if(!forge&&this.forgeVisual){this.forgeVisual.destroy();this.forgeVisual=undefined;}
    if(forge&&!this.forgeVisual)this.forgeVisual=this.add.image(forge.footprint.x+forge.footprint.width/2,forge.footprint.y+forge.footprint.height/2,'buildings',buildingFrame('forge','player',forge.construction.remainingSeconds,5,this.factions.player,forge.hp)).setOrigin(.5,.75);
    if(forge)this.forgeVisual!.setFrame(buildingFrame('forge','player',forge.construction.remainingSeconds,5,this.factions.player,forge.hp));
    this.forgeButton.disabled=!this.gameplayActive()||this.placement.active||!!forge||!this.gathering.units.some(u=>u.kind==='worker'&&u.selected);
    document.getElementById('research-status')!.textContent=forge?`Forge ${Math.ceil(forge.hp)} HP · construction ${forge.construction.remainingSeconds.toFixed(1)} s · Attack ${this.research.attack} / Defense ${this.research.defense}${this.research.job?` · ${this.research.job.kind} ${this.research.job.remainingSeconds.toFixed(1)} s`:''}`:uiText.buildAForgeForUpgrades;
    for(const [kind,button] of this.researchButtons){button.disabled=!canResearch(this.gathering,this.research,this.placement,kind,this.gameplayActive());button.textContent=`${kind==='attack'?'Attack +25 %':'Defense −25 %'} – ${costLabel(upgradeConfig.cost)}`;}

    if(!this.placement.barracks&&this.barracksVisual){this.barracksVisual.destroy();this.barracksVisual=undefined;}
    const rect = buildingFootprint(this.previewPoint,this.placement.kind??'barracks');
    const error = this.placement.active ? !placementVisible(this.fog,rect)?uiText.theSiteMustBeVisible:this.placement.kind==='harbor'?harborPlacementError(this.currentMatch(),this.previewPoint):placementError(this.placement, this.previewPoint, this.gathering.wood, placementObstacles(this.gathering),
      {map:this.map,gathering:this.gathering,enemies:this.combat.enemies}) : null;
    this.placementFeedbackError=error;
    this.placementPreview.setPosition(rect.x, rect.y)
      .setFillStyle(error ? 0xe05b5b : 0x7bd389, 0.4).setVisible(this.placement.active);
    this.buildButton.setAttribute('aria-pressed',String(this.placement.active&&(!this.placement.kind||this.placement.kind==='barracks')));
    this.farmButton?.setAttribute('aria-pressed',String(this.placement.active&&this.placement.kind==='farm'));this.forgeButton.setAttribute('aria-pressed',String(this.placement.active&&this.placement.kind==='forge'));
    this.buildButton.disabled = !this.gameplayActive() || this.placement.active || this.placement.barracks !== null || !this.gathering.units.some(u=>u.kind==='worker'&&u.selected);
    this.placementStatus.textContent = this.placement.active
      ? `${error ?? uiText.validSite} – click to place, Escape/right-click to cancel`
      : !this.gameplayActive() ? this.session.phase==='paused'?uiText.pausedSimulationIsFrozen:uiText.theMatchHasEnded : this.placement.barracks ? barracksReady(this.placement) ? uiText.barracksComplete : `Construction: ${this.placement.construction!.remainingSeconds.toFixed(1)} s work remaining – right-click with a worker to resume` : !this.gathering.units.some(u=>u.kind==='worker'&&u.selected) ? uiText.selectAWorkerToBuild : `Costs ${costLabel(costs.barracks)} – choose a site`;
    if (this.placement.barracks && !this.barracksVisual) {
      const building = this.placement.barracks;
      this.barracksVisual = this.add.image(building.x+building.width/2,building.y+building.height/2,'buildings',buildingFrame('barracks','player',this.placement.construction?.remainingSeconds,5,this.factions.player,this.placement.barracksHP??combatConfig.barracksHP)).setOrigin(.5,.75);
    }
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

  private paintPortrait(canvas:HTMLCanvasElement,asset:{atlas:string;frame:string}|null):void {
    const ctx=canvas.getContext('2d')!;ctx.clearRect(0,0,canvas.width,canvas.height);if(!asset)return;
    const frame=this.textures.get(asset.atlas).get(asset.frame);ctx.imageSmoothingEnabled=false;
    const scale=Math.min(3,canvas.width/frame.cutWidth,canvas.height/frame.cutHeight),w=frame.cutWidth*scale,h=frame.cutHeight*scale;
    ctx.drawImage(frame.source.image as HTMLImageElement,frame.cutX,frame.cutY,frame.cutWidth,frame.cutHeight,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
  }

  private syncVisuals(): void {
    if(this.selectedBuilding==='harbor'&&!this.navy?.harbor||this.selectedBuilding==='barracks'&&!this.placement.barracks||this.selectedBuilding==='base'&&this.combat.baseHP<=0)this.selectedBuilding=null;
    this.baseVisual.setFrame(buildingFrame('base','player',0,5,this.factions.player,this.combat.baseHP)).setVisible(this.combat.baseHP>0);this.baseLabel.setVisible(this.combat.baseHP>0).setText(`${factions[this.factions.player].buildingNames.base} ${Math.ceil(this.combat.baseHP)} HP`);
    if (!this.gameplayActive()) {
      this.unloadMode=null;this.attackMoveMode=false;
      this.cameraDrag = undefined;
      this.drag = undefined;
      this.dragBox.setVisible(false);
    }
    this.attackMoveButton.disabled=!this.gameplayActive()||!this.gathering.units.some(u=>u.kind==='soldier'&&u.selected);
    this.attackMoveButton.setAttribute('aria-pressed',String(this.attackMoveMode));
    this.attackMoveButton.textContent=this.attackMoveMode?uiText.attackMoveClickADestinationEscapeCancels:'Attack-move';
    this.stopButton.disabled = !this.gameplayActive() || !this.allSelectable().some(u=>u.selected);
    this.hpBars?.clear();
    const visibleEnemies=this.combat.enemies.filter(e=>entityVisible(this.fog,'player',e));
    const markers = orderMarkers(this.gathering, {...this.combat,enemies:visibleEnemies}, this.outcome==='playing',this.placement.barracks,this.placement.farms,this.placement.forge?.footprint,this.navy?.harbor?.footprint);
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
    this.matchStatus.textContent=this.outcome==='defeat'?uiText.defeatYourBaseWasDestroyed:this.outcome==='victory'?definition.victory==='enemy-base'?uiText.victoryTheEnemyBaseWasDestroyed:definition.victory==='timer'?uiText.victoryTheOutpostSurvivedFor90Seconds:uiText.victoryAllWavesDefeated:this.scenario==='skirmish'?(maps[this.map.id??'arena'].instruction??definition.instruction):definition.instruction;
    this.syncPlacement();this.syncNavy();
    this.goldVisual.setFrame(resourceFrame('gold',this.gathering.gold!.remaining,isVisible(this.fog,'player',this.gathering.gold!.position)));
    this.nodeVisual.setFrame(resourceFrame('wood',this.gathering.node.remaining,isVisible(this.fog,'player',this.gathering.node.position)));
    for(const node of this.gathering.extraNodes??[]){
      const type=node.resource??'wood',visible=isVisible(this.fog,'player',node.position),known=knownResource(this.fog,node.position);
      if(!this.extraResourceVisuals.has(node.id))this.extraResourceVisuals.set(node.id,{body:this.add.image(node.position.x,node.position.y,'world',resourceFrame(type,node.remaining,visible)).setOrigin(resourceOrigin.x,resourceOrigin.y),label:this.add.text(node.position.x,node.position.y-64,'',{fontSize:'12px',color:'#d6eef1'}).setOrigin(.5)});
      const visual=this.extraResourceVisuals.get(node.id)!;visual.body.setFrame(resourceFrame(type,node.remaining,visible)).setVisible(known);visual.label.setVisible(known).setText(`${type==='wood'?'Wood':'Gold'}${visible?' '+Math.ceil(node.remaining):''}`);
    }
    this.trainButton.parentElement!.style.visibility = this.selectedBuilding === 'base' ? 'visible' : 'hidden';
    this.soldierButton.parentElement!.style.visibility = this.selectedBuilding === 'barracks' ? 'visible' : 'hidden';
    const selectedProduction = this.selectedBuilding === 'base' ? this.production
      : this.selectedBuilding === 'barracks' ? this.soldierProduction : this.selectedBuilding==='harbor'?this.navy!.production:null;
    renderSelectedQueue(selectedQueue(this.currentMatch(),this.selectedBuilding,this.gameplayActive()),(canvas,asset)=>this.paintPortrait(canvas,asset));
    this.rallyMarker.setVisible(selectedProduction?.rally !== undefined);
    if (selectedProduction?.rally) this.rallyMarker.setPosition(selectedProduction.rally.x, selectedProduction.rally.y);
    const selectedFootprint = this.selectedBuilding === 'base' ? baseFootprint(this.gathering.base)
      : this.selectedBuilding === 'barracks' ? this.placement.barracks : this.selectedBuilding==='harbor'?this.navy!.harbor!.footprint:null;
    this.buildingRing.setVisible(selectedFootprint !== null);
    if (selectedFootprint) this.buildingRing.setPosition(selectedFootprint.x, selectedFootprint.y)
      .setSize(selectedFootprint.width, selectedFootprint.height);
    const info=selectionInfo(this.currentMatch(),this.selectedBuilding);renderSelectionInfo(info);
    const portrait=document.getElementById('selection-portrait') as HTMLCanvasElement;portrait.hidden=!info.portrait;this.paintPortrait(portrait,info.portrait);
    renderSelectedIcons(selectedIcons(this.currentMatch()),(canvas,asset)=>this.paintPortrait(canvas,asset));
    renderTopBar(this.currentMatch());
    const population=matchPopulation(this.currentMatch());
    this.trainButton.disabled = !allowsProduction(this.selectedBuilding, 'base', true, this.gameplayActive()) || !this.gameplayActive() || !canEnqueue(this.gathering, this.production,{kind:'base'},population);
    this.productionStatus.textContent = productionLabel(this.gathering, this.production, this.outcome,{kind:'base'},population);
    const barracks = { kind: 'barracks' as const, footprint: this.placement.barracks, ready:barracksReady(this.placement) };
    this.soldierButton.disabled = !allowsProduction(this.selectedBuilding, 'barracks', this.placement.barracks !== null, this.gameplayActive()) || !this.gameplayActive() || !canEnqueue(this.gathering, this.soldierProduction, barracks,population);
    this.catapultButton.disabled=!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive())||!canEnqueue(this.gathering,this.soldierProduction,{...barracks,unitType:'catapult'},population);
    this.archerButton.disabled=!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive())||!canEnqueue(this.gathering,this.soldierProduction,{...barracks,unitType:'archer'},population);
    this.soldierProductionStatus.textContent = productionLabel(this.gathering, this.soldierProduction, this.outcome, barracks,population);
    const ability=abilityFor(this.gathering),abilityButton=document.querySelector<HTMLButtonElement>('#unit-ability')!;
    abilityButton.textContent=`${ability.label} · ${ability.description} · ${ability.durationSeconds} s`;abilityButton.disabled=!this.gameplayActive()||!this.gathering.units.some(u=>u.selected&&abilityReady(u));
    document.getElementById('ability-status')!.textContent=abilityStatus(this.gathering);
    const labels = matchLabels(this.currentMatch());
    for (const [id, text] of [['resource-status', labels.economy], ['health-status', labels.health],
      ['wave-status', labels.wave],['population-status',`Population: ${population.used} + ${population.reserved} reserved / ${population.cap}`], ['selection-status', this.selectedBuilding ? `${(this.selectedBuilding==='harbor'?uiText.harbor:factions[this.factions.player].buildingNames[this.selectedBuilding])} selected (${Math.ceil(this.selectedBuilding==='harbor'?this.navy!.harbor!.hp:this.selectedBuilding==='base'?this.combat.baseHP:this.placement.barracksHP??combatConfig.barracksHP)} HP) ${this.selectedBuilding==='harbor'?uiText.shipQueue:uiText.rightClickSetsRally2}${selectedProduction?.rallyError ? ': ' + uiText.theRallyDestinationIsBlockedOrUnreachable : ''}` : (this.navy?.ships.some(s=>s.selected)?`${this.allSelectable().filter(u=>u.selected).length} units selected · ships`:labels.selected)]]) {
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
        body: enemy.footprint?this.add.image(enemy.position.x,enemy.position.y,'buildings',buildingFrame((enemy.buildingType==='outpost'?'base':enemy.buildingType)??'base','enemy',enemy.construction?.remainingSeconds??0,enemy.buildingType==='outpost'?10:5,this.factions.enemy)).setOrigin(buildingOrigin((enemy.buildingType==='outpost'?'base':enemy.buildingType)??'base').x,buildingOrigin((enemy.buildingType==='outpost'?'base':enemy.buildingType)??'base').y):enemy.kind==='ship'?this.add.image(enemy.position.x,enemy.position.y,'naval',`${this.factions.enemy==='clans'?'clans-':''}transport-enemy-s-idle-0`).setOrigin(.5,40/64):this.add.image(enemy.position.x,enemy.position.y,'units',`${this.factions.enemy==='clans'?'clans-':''}${enemy.kind==='worker'?'worker':'soldier'}-enemy-s-idle-0`).setOrigin(.5,22/32),
        label: this.add.text(0, 0, '', { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5, 0),
      });
      const visual = this.enemyVisuals.get(enemy.id)!;
      visual.body.setPosition(enemy.position.x, enemy.position.y);
      if(enemy.footprint)visual.body.setFrame(buildingFrame(enemy.buildingType==='outpost'?'base':enemy.buildingType??'base','enemy',enemy.construction?.remainingSeconds??0,enemy.buildingType==='outpost'?10:5,this.factions.enemy,enemy.hp));
      if(enemy.kind==='ship')this.animateUnit(enemy.id,visual.body,enemy.position,'idle','transport','enemy');
      if(!enemy.footprint&&enemy.kind!=='ship'){const target=enemy.order?.kind==='defend'?this.gathering.units.find(u=>enemy.order?.kind==='defend'&&u.id===enemy.order.targetId)?.position:enemy.navigation?.targetId==='base'?this.gathering.base:undefined;const action:Action=enemy.navigation?.targetId&&enemy.navigation.targetId!=='explore-goal'&&enemy.navigation.status==='arrived'?'attack':enemy.work?.order.kind==='gather'?'gather':'idle';this.animateUnit(enemy.id,visual.body,enemy.position,action,enemy.kind==='worker'?'worker':'soldier','enemy',target);}
      visual.label.setPosition(enemy.position.x,enemy.position.y-(enemy.kind==='ship'?48:90)).setVisible(!!enemy.footprint||enemy.kind==='ship').setText(`${enemy.buildingType==='outpost'?uiText.resourceOutpost:''}${enemy.kind==='ship'?'Transport':enemy.buildingType==='harbor'?uiText.harbor:factions[this.factions.enemy].buildingNames[(enemy.buildingType==='outpost'?'base':enemy.buildingType)??'base']} ${Math.ceil(enemy.hp)} HP`);
      this.drawHP(enemy.position,enemy.hp,enemy.kind==='ship'?navyConfig.ship.hp:enemy.buildingType==='harbor'?navyConfig.harbor.hp:enemy.kind==='base'||enemy.buildingType==='outpost'?combatConfig.baseHP:enemy.buildingType==='barracks'?combatConfig.barracksHP:enemy.buildingType==='forge'?forgeConfig.hp:enemy.buildingType==='farm'?combatConfig.farmHP:enemy.kind==='worker'?combatConfig.workerHP:combatConfig.enemyHP,enemy.footprint?64:24,enemy.footprint?70:29,0xcf7770);
    }
    for (const unit of this.gathering.units) {
      if (!this.visuals.has(unit.id)) {
        const ring = this.add.circle(unit.position.x, unit.position.y, unit.kind==='soldier'?Math.max(20,combatUnitStats(unit).size*.75):20)
          .setStrokeStyle(2, 0xffdc73).setDepth(effectConfig.selectionDepth).setVisible(false);
        const art:UnitArt=unit.kind==='worker'?'worker':unit.archetype??'soldier';const origin=unitOrigin(art);
        const body=this.add.image(unit.position.x,unit.position.y,'units',`${this.factions.player==='clans'?'clans-':''}${art}-player-s-idle-0`).setOrigin(origin.x,origin.y);
        const cargo = this.add.text(unit.position.x, unit.position.y - 32, '',
          { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5, 0);
        this.visuals.set(unit.id, { body, ring, cargo });
      }
      const visual = this.visuals.get(unit.id)!;
      visual.body.setPosition(unit.position.x, unit.position.y);
      const marker=orderMarkers({ ...this.gathering,units:[{...unit,selected:true}] },{...this.combat,enemies:visibleEnemies},true,this.placement.barracks,this.placement.farms,this.placement.forge?.footprint)[0];
      const enemy=unit.order.kind==='attack'?visibleEnemies.find(e=>unit.order.kind==='attack'&&e.id===unit.order.enemyId):undefined;
      const attackRange=unit.kind==='soldier'?(unit.archetype==='archer'?archerConfig.range:unit.archetype==='catapult'?catapultConfig.range:combatConfig.soldierRange):0;
      const action:Action=unit.order.kind==='attack'&&enemy&&canInteract(this.map,unit.position,enemyBody(enemy),attackRange)?'attack':unit.order.kind==='gather'&&marker&&Math.hypot(marker.position.x-unit.position.x,marker.position.y-unit.position.y)<=gatheringConfig.nodeRadius+gatheringConfig.range?'gather':unit.order.kind==='build'&&unit.navigation?.status==='arrived'?'build':'idle';
      this.animateUnit(unit.id,visual.body,unit.position,action,unit.kind==='worker'?'worker':unit.archetype??'soldier','player',enemy?.position??marker?.position);
      visual.ring.setPosition(unit.position.x, unit.position.y).setVisible(unit.selected);
      visual.cargo.setPosition(unit.position.x, unit.position.y - 48)
        .setVisible(unit.kind==='worker'&&unit.selected).setText(unit.kind==='worker'?`${unit.cargo.toFixed(1)}/${gatheringConfig.capacity} ${unit.cargoType??'wood'}`:'');
      this.drawHP(unit.position,unit.hp??combatConfig.workerHP,unit.kind==='worker'?combatConfig.workerHP:factions[this.factions.player].units[unit.archetype??'soldier'].hp,unit.kind==='soldier'&&unit.archetype==='catapult'?40:24,unit.kind==='soldier'&&unit.archetype==='catapult'?39:29,0x7398c1);
    }
    const publicHealth=[...warningSnapshot(this.currentMatch()),...visibleEnemies.map(e=>({id:e.id,hp:e.hp,position:{...e.position}}))].filter(p=>isVisible(this.fog,'player',p.position));
    for(const hit of hitEffects(this.hitSnapshot,publicHealth,this.visualTime,this.gameplayActive()))this.addImpact(hit);
    this.hitSnapshot=publicHealth;
    for(const [id,e] of this.impacts){if(!impactAlive(e.impact,this.visualTime,p=>isVisible(this.fog,'player',p))){e.visual.destroy();this.impacts.delete(id);}else e.visual.setFrame(impactFrame(e.impact,this.visualTime));}
    for(const [id,d] of this.deaths){if(!effectAlive(d.effect,this.visualTime,isVisible(this.fog,'player',d.effect.motion.position))){d.visual.destroy();this.deaths.delete(id);}else d.visual.setFrame(unitFrame(d.effect.motion,this.visualTime));}
    if(this.fogOverlay)drawFog(this.fogOverlay,this.fog,this.fogPreview??'player');
    for(const shortcut of hotkeys){const button=document.getElementById(shortcut.button)!;button.textContent=`${button.textContent?.replace(/\s+\[[A-Z]\]$/,'')} [${shortcut.key}]`;button.title=shortcut.label;}
    renderActionPanel(actionPanel(this.currentMatch(),this.selectedBuilding,this.gameplayActive()));
    renderTutorial(this.currentMatch());
    renderCommandFeedback(commandFeedback(this.currentMatch(),this.selectedBuilding,{placementError:this.placementFeedbackError,attackMove:this.attackMoveMode,unload:!!this.unloadMode}));
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
    const dt=gameplayDelta(this.session.phase,delta/1000,this.skipGameplayFrame,this.session.options.speed??1);this.visualTime+=dt;
    const match = updateMatch(this.currentMatch(),dt);
    this.skipGameplayFrame=false;
    this.applyMatch(match);
    for(const impact of landedEffects(previousShots,this.combat.projectiles??[],dt,this.visualTime,p=>isVisible(this.fog,'player',p)))this.addImpact(impact);
    if(this.outcome!=='playing')this.session=sessionTransition(this.session,'end');
    this.syncVisuals();
  }

  private currentMatch():MatchState {return {tutorial:this.tutorial,speed:this.session.options.speed??1,enemyNaval:this.enemyNaval,navy:this.navy,factions:{...this.factions},map:this.map,gathering:this.gathering,combat:this.combat,waves:this.waves,production:this.production,soldierProduction:this.soldierProduction,placement:this.placement,outcome:this.outcome,paused:!this.gameplayActive(),controlGroups:this.controlGroups,fog:this.fog,research:this.research,scenario:this.scenario,difficulty:this.difficulty,enemyProduction:this.enemyProduction,enemyAI:this.enemyAI,enemyConstruction:this.enemyConstruction,enemyPolicy:this.enemyPolicy,enemyRecovery:this.enemyRecovery,enemyKnowledge:this.enemyKnowledge};}

  private addImpact(impact:Impact):void {
    if(!canAddImpact([...this.impacts.values()].map(e=>e.impact),impact))return;
    this.impacts.set(this.nextImpact++,{impact,visual:this.add.image(impact.position.x,impact.position.y,'ui',impactFrame(impact,this.visualTime)).setOrigin(.5).setDepth(effectConfig.groundDepth).setAlpha(effectConfig.groundAlpha)});
  }

  private drawHP(position:Position,hp:number,max:number,width:number,offset:number,color:number):void {this.hpBars?.fillStyle(0x172422).fillRect(position.x-width/2-1,position.y-offset-1,width+2,5).fillStyle(color).fillRect(position.x-width/2,position.y-offset,width*Math.max(0,Math.min(1,hp/max)),3);}

  private syncAudio(visibleEnemies:typeof this.combat.enemies):void {
    const next=matchAudioSnapshot(this.currentMatch(),visibleEnemies);
    const wasPlaying=this.session.phase==='playing'||this.audioSnapshot?.outcome==='playing'&&this.outcome!=='playing';
    for(const event of audioEvents(this.audioSnapshot,next,!!wasPlaying)){if(event==='victory'||event==='defeat'){gameAudio.setPhase('ended');gameAudio.play(event,true);}else gameAudio.play(event);}
    this.audioSnapshot=next;
  }

  private animateUnit(id:string,body:Phaser.GameObjects.Image,position:Position,action:Action,type:UnitArt,owner:'player'|'enemy',aim?:Position):void {
    const previous=this.motions.get(id);
    if(previous&&!this.gameplayActive()){body.setFrame(unitFrame(previous,this.visualTime));return;}
    // syncVisuals also runs on DOM input; preserve walk pose until the next simulation frame.
    const m=motion(previous,position,action,this.visualTime,type,owner,aim,this.factions[owner]);
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
    const transportButton=document.querySelector<HTMLButtonElement>('#train-transport')!,unloadButton=document.querySelector<HTMLButtonElement>('#unload-transport')!;transportButton.parentElement!.style.visibility=this.selectedBuilding==='harbor'?'visible':'hidden';transportButton.disabled=this.selectedBuilding!=='harbor'||!canTrainShip(this.currentMatch(),'transport');const selectedTransport=this.navy?.ships.find(s=>s.selected&&s.role==='transport');unloadButton.disabled=!this.gameplayActive()||!selectedTransport?.passengers?.length;if(this.unloadMode&&!this.navy?.ships.some(s=>s.id===this.unloadMode&&s.selected&&s.passengers?.length))this.unloadMode=null;document.getElementById('transport-status')!.textContent=this.unloadMode?uiText.clickAVisibleFreeLandingWithin64Px:selectedTransport?`Transport: ${selectedTransport.passengers?.length??0}/4 – move land units to the coast, then right-click the transport to board`:uiText.selectATransportToBoardOrUnload;
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
    for(const ship of this.navy?.ships??[]){const p=ship.position,type=ship.role==='transport'?'transport':'warship';this.drawHP(p,ship.hp,navyConfig.ship.hp,32,40,0x77c4cf);if(ship.selected)this.navyGraphics.lineStyle(2,0xffdf73).strokeCircle(p.x,p.y,22);
      if(!this.shipVisuals.has(ship.id))this.shipVisuals.set(ship.id,this.add.image(p.x,p.y,'naval',`${this.factions.player==='clans'?'clans-':''}${type}-player-s-idle-0`).setOrigin(.5,40/64).setDepth(1));const body=this.shipVisuals.get(ship.id)!;body.setPosition(p.x,p.y);const target=ship.order.kind==='attack'?this.combat.enemies.find(e=>ship.order.kind==='attack'&&e.id===ship.order.enemyId&&entityVisible(this.fog,'player',e))?.position:undefined;this.animateUnit(ship.id,body,p,target?'attack':'idle',type,'player',target);
      if(!this.shipLabels.has(ship.id))this.shipLabels.set(ship.id,this.add.text(p.x,p.y-48,uiText.warship,{fontSize:'10px',color:'#d6eef1'}).setOrigin(.5).setDepth(7));this.shipLabels.get(ship.id)!.setPosition(p.x,p.y-48).setText(`${ship.role==='transport'?'Transport '+(ship.passengers?.length??0)+'/4':uiText.warship} ${Math.ceil(ship.hp)} HP`);
    }
  }
  private applyMatch(match: MatchState): void {
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
    this.gathering = match.gathering;
    this.combat = match.combat;
    this.waves = match.waves;
    this.production = match.production;
    this.soldierProduction = match.soldierProduction;
    this.placement = match.placement;
    this.outcome = match.outcome;
  }
}
