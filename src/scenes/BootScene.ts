import { buildingFrame,buildingOrigin,terrainFrame,terrainEdges,resourceFrame,resourceOrigin } from '../presentation/assets';
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
import { initialDifficulty,type Difficulty } from '../config/difficulty';
import { type EnemyAIState } from '../gameplay/enemyAI';
import { type EnemyProductionState } from '../gameplay/enemyProduction';
import { initialScenario,type MatchScenario } from '../config/scenarios';
import { forgeConfig,upgradeConfig } from '../config/upgrades';
import { createResearch,startResearch,canResearch,type ResearchState,type ResearchKind } from '../gameplay/research';
import { commandAttackMove } from '../gameplay/attackMove';
import { enqueueProduction, cancelProduction, canEnqueue } from '../gameplay/productionQueue';
import { queueConfig } from '../config/production';
import { populationState } from '../gameplay/population';
import { barracksReady, resumeConstruction } from '../gameplay/construction';
import { costs } from '../config/economy';
import { costLabel } from '../gameplay/economy';
import { stopSelected } from '../gameplay/orders';
import { orderMarkers } from '../presentation/orders';
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
import { combatConfig } from '../config/combat';
import { enemyAt, orderAttack, type CombatState } from '../gameplay/combat';
import { soldierStats, combatUnitStats, unitStats } from '../config/unit';
import type { Position } from '../gameplay/movement';
import { gatheringConfig } from '../config/gathering';
import { productionConfig, soldierProductionConfig } from '../config/production';
import { barracksConfig, farmConfig } from '../config/buildings';
import { buildingFootprint, beginPlacement, cancelPlacement, placementError, placementObstacles, placeBuilding, type PlacementState } from '../gameplay/placement';
import { canStartProduction, startProduction, type ProductionState } from '../gameplay/production';
import { isNodeHit, orderUnits, type GatheringState } from '../gameplay/gathering';
import {
  isSelectionDrag, selectionRectangle,
  selectUnitsInRectangle,
} from '../gameplay/selection';

export class BootScene extends Phaser.Scene {
  private controlGroups:ControlGroups={};
  private fog!:FogState;
  private fogOverlay?:Phaser.GameObjects.Graphics;
  private fogPreview:Team|null=(()=>{const q=new URLSearchParams(window.location.search).get('fog-preview');return q==='player'||q==='enemy'?q:null;})();
  private minimap?:ReturnType<typeof bindMinimap>;
  private enemyAI?:EnemyAIState;
  private enemyProduction?:EnemyProductionState;
  private scenario:MatchScenario=initialScenario(new URLSearchParams(window.location.search).get('scenario'));
  private difficulty:Difficulty=initialDifficulty(new URLSearchParams(window.location.search).get('difficulty'));
  private session:MatchSession=createSession({scenario:this.scenario,difficulty:this.difficulty,map:'arena'});
  private skipGameplayFrame=true;
  private scenarioSelect!:HTMLSelectElement;
  private research:ResearchState=createResearch();
  private forgeButton!:HTMLButtonElement;
  private forgeVisual?:Phaser.GameObjects.Image;
  private researchButtons=new Map<ResearchKind,HTMLButtonElement>();
  private map!: WorldMap;
  private baseVisual!:Phaser.GameObjects.Image;
  private baseLabel!:Phaser.GameObjects.Text;
  private queueSignature = '';
  private queuePanel!:HTMLElement;
  private orderVisuals = new Map<string, Phaser.GameObjects.Arc>();
  private attackMoveMode=false;
  private attackMoveButton!:HTMLButtonElement;
  private stopButton!: HTMLButtonElement;
  private selectedBuilding: BuildingSelection = null;
  private rallyMarker!: Phaser.GameObjects.Arc;
  private buildingRing!: Phaser.GameObjects.Rectangle;
  private cameraDrag?: CameraDrag;
  private outcome: MatchOutcome = 'playing';
  private restartButton!: HTMLButtonElement;
  private restartPending = false;
  private matchStatus!: HTMLElement;
  private waves!: WaveState;
  private combat!: CombatState;
  private enemyVisuals = new Map<string, { body: Phaser.GameObjects.Rectangle|Phaser.GameObjects.Image; label: Phaser.GameObjects.Text }>();

  private gathering!: GatheringState;
  private placement: PlacementState = { active: false, barracks: null };
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
  private projectileVisuals=new Map<string,Phaser.GameObjects.Arc>();
  private soldierButton!: HTMLButtonElement;
  private soldierProductionStatus!: HTMLElement;
  private trainButton!: HTMLButtonElement;
  private productionStatus!: HTMLElement;
  private goldVisual!: Phaser.GameObjects.Image;
  private nodeVisual!: Phaser.GameObjects.Image;

  private visuals = new Map<string, { body: Phaser.GameObjects.Rectangle; ring: Phaser.GameObjects.Arc; cargo: Phaser.GameObjects.Text }>();
  private drag?: { world: Position; screen: Position; active: boolean;shift:boolean };
  private dragBox!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('BootScene');
  }

  preload():void {for(const key of ['world','buildings'])if(!this.textures.exists(key))this.load.atlas(key,`/assets/${key}-atlas.png`,`/assets/${key}-atlas.json`);}

  create(): void {
    this.applyMatch(createMatch(this.scenario,this.difficulty));
    this.game.canvas.tabIndex=0;this.game.canvas.setAttribute('aria-label','Spelvärld');
    const groupKey=(event:KeyboardEvent)=>{
      if(!gameplayKeyAllowed(keyboardContext(event,this.gameplayActive()))||!validGroup(event.key))return;
      event.preventDefault();
      if(event.ctrlKey||event.metaKey)this.controlGroups=bindGroup(this.controlGroups,event.key,this.gathering.units,u=>entityVisible(this.fog,'player',u));
      else{this.gathering.units=recallGroup(this.controlGroups,event.key,this.gathering.units,u=>entityVisible(this.fog,'player',u));this.selectedBuilding=null;this.attackMoveMode=false;this.placement=cancelPlacement(this.placement);this.drag=undefined;this.dragBox.setVisible(false);}
      this.syncVisuals();
    };window.addEventListener('keydown',groupKey);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>window.removeEventListener('keydown',groupKey));
    this.fogOverlay=this.add.graphics().setDepth(40);
    const fixture=document.getElementById('fog-fixture')!;fixture.hidden=!this.fogPreview;fixture.textContent=`FOG FIXTURE (${this.fogPreview}) – modellpreview; informationsfiltrering använder player-team`;
    this.scenarioSelect=document.querySelector<HTMLSelectElement>('#scenario-select')!;
    this.scenarioSelect.value=this.scenario==='siege-test'?'survival':this.scenario;
    const changeScenario=()=>{this.session=changeOptions(this.session,{scenario:this.scenarioSelect.value==='skirmish'?'skirmish':'survival'});this.scenario=this.session.options.scenario;this.syncSession();};
    this.scenarioSelect.addEventListener('change',changeScenario);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.scenarioSelect.removeEventListener('change',changeScenario));

    const difficultySelect=document.querySelector<HTMLSelectElement>('#difficulty-select')!;difficultySelect.value=this.difficulty;
    const changeDifficulty=()=>{this.session=changeOptions(this.session,{difficulty:initialDifficulty(difficultySelect.value)});this.difficulty=this.session.options.difficulty;this.syncSession();};
    difficultySelect.addEventListener('change',changeDifficulty);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>difficultySelect.removeEventListener('change',changeDifficulty));

    this.minimap=bindMinimap(document.querySelector<HTMLCanvasElement>('#minimap')!,()=>({data:visibleMinimapData({fog:this.fog,map:this.map,gathering:this.gathering,combat:this.combat,placement:this.placement,production:this.production,soldierProduction:this.soldierProduction,waves:this.waves,outcome:this.outcome}),scroll:{x:this.cameras.main.scrollX,y:this.cameras.main.scrollY},viewport:{width:this.cameras.main.width,height:this.cameras.main.height}}),point=>this.cameras.main.setScroll(point.x,point.y));
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.minimap?.destroy());

    this.attackMoveMode=false;
    this.attackMoveButton=document.querySelector<HTMLButtonElement>('#attack-move')!;
    const beginAttackMove=()=>{
      if(!this.gameplayActive()||!this.gathering.units.some(u=>u.kind==='soldier'&&u.selected))return;
      this.attackMoveMode=true;this.placement=cancelPlacement(this.placement);this.drag=undefined;
      this.dragBox.setVisible(false);this.syncVisuals();
    };
    this.attackMoveButton.addEventListener('click',beginAttackMove);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.attackMoveButton.removeEventListener('click',beginAttackMove));
    this.queueSignature = '';
    this.queuePanel=document.getElementById('production-queue')!;
    const cancelJob=(event:MouseEvent)=>{
      if(!this.gameplayActive()||!this.selectedBuilding)return;
      const button=event.target instanceof Element?event.target.closest<HTMLButtonElement>('button[data-job-id]'):null;
      if(!button||!this.queuePanel.contains(button))return;
      const p=this.selectedBuilding==='base'?this.production:this.soldierProduction;
      const result=cancelProduction(this.gathering,p,button.dataset.jobId!,true);
      this.gathering=result.gathering;
      if(this.selectedBuilding==='base')this.production=result.production;else this.soldierProduction=result.production;
      this.syncVisuals();
    };
    this.queuePanel.addEventListener('click',cancelJob);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.queuePanel.removeEventListener('click',cancelJob));
    this.projectileVisuals.clear();
    this.orderVisuals.clear();
    this.farmVisuals.clear();
    this.stopButton = document.querySelector<HTMLButtonElement>('#stop-units')!;
    const stop = () => { this.attackMoveMode=false; this.gathering.units = stopSelected(this.gathering.units, this.gameplayActive()); this.syncVisuals(); };
    this.stopButton.addEventListener('click', stop);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.stopButton.removeEventListener('click', stop));
    this.selectedBuilding = null;
    this.rallyMarker = this.add.circle(0, 0, 8).setStrokeStyle(2, 0x7bd389).setDepth(6).setVisible(false);
    this.buildingRing = this.add.rectangle(0, 0, 0, 0).setOrigin(0).setStrokeStyle(2, 0xffdc73).setDepth(5).setVisible(false);
    this.cameras.main.setBounds(0, 0, this.map.width, this.map.height).setZoom(1).setScroll(0, 0);
    this.cameraDrag = undefined;
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
        this.add.image(rect.x,rect.y,'world',terrainFrame(column,row)).setOrigin(0).setDepth(-10);
        for(const edge of terrainEdges(column,row))this.add.image(rect.x,rect.y,'world',edge).setOrigin(0).setDepth(-9);
      }
    }
    this.baseVisual=this.add.image(this.gathering.base.x,this.gathering.base.y,'buildings',buildingFrame('base','player')).setOrigin(.5,.75);
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
    this.buildButton.textContent = `Bygg barracks – ${costLabel(costs.barracks)}`;
    const begin = (kind:'barracks'|'farm'|'forge'='barracks') => {
      if (!this.gameplayActive()) return;
      if (!this.gathering.units.some(u=>u.kind==='worker' && u.selected)) return;
      this.attackMoveMode=false;
      this.placement = beginPlacement(this.placement,kind);
      this.drag = undefined;
      this.dragBox.setVisible(false);
      this.previewPoint = this.worldPoint(this.input.activePointer);
      this.syncVisuals();
    };
    const cancel = (event?:KeyboardEvent) => {
      if(event&&!gameplayKeyAllowed(keyboardContext(event,this.gameplayActive())))return;
      if (!this.gameplayActive()) return;
      this.attackMoveMode=false;
      this.placement = cancelPlacement(this.placement);
      this.syncVisuals();
    };
    const beginBarracks=()=>begin();
    this.forgeVisual=undefined;
    const beginForge=()=>begin('forge');
    this.forgeButton=document.querySelector<HTMLButtonElement>('#build-forge')!;
    this.forgeButton.textContent=`Bygg Forge – ${costLabel(costs.forge)}`;
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
    this.farmButton.textContent=`Bygg farm – ${costLabel(costs.farm)}`;
    this.farmButton.addEventListener('click',beginFarm);
    this.buildButton.addEventListener('click', beginBarracks);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.buildButton.removeEventListener('click', beginBarracks);
      this.farmButton.removeEventListener('click',beginFarm);
    });
    this.trainButton = document.querySelector<HTMLButtonElement>('#train-worker')!;
    this.productionStatus = document.querySelector<HTMLElement>('#production-status')!;
    this.trainButton.textContent = `Träna arbetare – ${costLabel(costs.worker)}`;
    const train = () => {
      if (!allowsProduction(this.selectedBuilding, 'base', true, this.gameplayActive())) return;
      const result = enqueueProduction(this.gathering, this.production,{kind:'base'},populationState(this.gathering,this.placement,[this.production,this.soldierProduction]));
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
    this.soldierButton.textContent = `Träna soldier – ${costLabel(costs.soldier)}`;
    const trainSoldier = () => {
      if (!allowsProduction(this.selectedBuilding, 'barracks', this.placement.barracks !== null, this.gameplayActive())) return;
      const result = enqueueProduction(this.gathering, this.soldierProduction,
        { kind: 'barracks', footprint: this.placement.barracks, ready:barracksReady(this.placement) },populationState(this.gathering,this.placement,[this.production,this.soldierProduction]));
      this.gathering = result.gathering;
      this.soldierProduction = result.production;
      this.syncVisuals();
    };
    this.archerButton=document.querySelector<HTMLButtonElement>('#train-archer')!;
    this.archerButton.textContent=`Träna archer – ${costLabel(costs.archer)}`;
    const trainArcher=()=>{
      if(!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive()))return;
      const result=enqueueProduction(this.gathering,this.soldierProduction,
        {kind:'barracks',footprint:this.placement.barracks,ready:barracksReady(this.placement),unitType:'archer'},
        populationState(this.gathering,this.placement,[this.production,this.soldierProduction]));
      this.gathering=result.gathering;this.soldierProduction=result.production;this.syncVisuals();
    };
    this.catapultButton=document.querySelector<HTMLButtonElement>('#train-catapult')!;
    this.catapultButton.textContent=`Träna catapult – ${costLabel(costs.catapult)}`;
    const trainCatapult=()=>{
      if(!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive()))return;
      const result=enqueueProduction(this.gathering,this.soldierProduction,
        {kind:'barracks',footprint:this.placement.barracks,ready:barracksReady(this.placement),unitType:'catapult'},
        populationState(this.gathering,this.placement,[this.production,this.soldierProduction]));
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
    for(const [id,action] of [['start-match','start'],['pause-match','pause'],['resume-match','resume'],['new-match','new-match']] as const){const button=document.getElementById(id)!;const handler=()=>this.sessionAction(action);button.addEventListener('click',handler);this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>button.removeEventListener('click',handler));}
    document.getElementById('command-guide-text')!.textContent=commandGuide;
    const actionKey=(event:KeyboardEvent)=>{
      const menuContext={...keyboardContext(event,this.session.phase==='playing'||this.session.phase==='paused'),ctrlKey:event.ctrlKey,metaKey:event.metaKey};
      if(!event.ctrlKey&&!event.metaKey&&gameplayKeyAllowed(menuContext)&&(event.key.toLowerCase()==='p'||event.key==='Escape'&&(this.session.phase==='paused'||!this.placement.active&&!this.attackMoveMode))){event.preventDefault();this.sessionAction(this.session.phase==='paused'?'resume':'pause');return;}
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
    this.session=next;
    if(action==='start'||action==='restart'){this.scenario=next.options.scenario;this.difficulty=next.options.difficulty;this.skipGameplayFrame=true;this.restartPending=true;this.restartButton.disabled=true;this.scene.restart();return;}
    if(action==='resume')this.skipGameplayFrame=true;
    if(action==='pause'||action==='new-match'){this.placement=cancelPlacement(this.placement);this.attackMoveMode=false;this.drag=undefined;this.cameraDrag=undefined;this.dragBox.setVisible(false);}
    this.syncVisuals();
  }
  private syncSession():void {
    const phase=this.session.phase,menu=phase==='menu';
    this.scenarioSelect.disabled=!menu;this.scenarioSelect.value=this.session.options.scenario==='siege-test'?'survival':this.session.options.scenario;
    const difficulty=document.querySelector<HTMLSelectElement>('#difficulty-select')!;difficulty.disabled=!menu;difficulty.value=this.session.options.difficulty;
    for(const [id,show] of [['start-match',menu],['pause-match',phase==='playing'],['resume-match',phase==='paused'],['new-match',!menu],['restart-match',phase==='paused'||phase==='ended']] as const)(document.getElementById(id) as HTMLButtonElement).hidden=!show;
    (document.getElementById('gameplay-controls') as HTMLFieldSetElement).disabled=!this.gameplayActive();
    document.getElementById('hud')!.hidden=menu;const game=document.getElementById('game')!,wasHidden=game.hidden;game.hidden=menu;
    if(wasHidden&&!menu)this.scale.refresh();
    document.getElementById('session-status')!.textContent=menu?'Välj scenario och svårighetsgrad, sedan Starta match':phase==='paused'?'Pausad – matchen är fryst':phase==='ended'?'Matchen är avslutad – starta om eller välj ny match':`${this.session.options.scenario==='skirmish'?'Skirmish':'Wave-survival'} · ${this.session.options.difficulty} · handgjord arena`;
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
    if (!this.gameplayActive()) return;
    this.game.canvas.focus({preventScroll:true});
    if (pointer.button === 1) {
      if (this.drag) return;
      this.cameraDrag = { screen: { x: pointer.x, y: pointer.y },
        scroll: { x: this.cameras.main.scrollX, y: this.cameras.main.scrollY } };
      return;
    }
    if (this.cameraDrag) return;
    const world = this.worldPoint(pointer);
    if(this.attackMoveMode&&(pointer.button===0||pointer.button===2)) {
      this.attackMoveMode=false;this.placementClick=true;
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
      if (this.selectedBuilding) {
        if (this.selectedBuilding === 'base') this.production = setRally(this.production, world, this.map,
          baseFootprint(this.gathering.base), 'base');
        else this.soldierProduction = setRally(this.soldierProduction, world, this.map, this.placement.barracks, 'barracks');
        this.syncVisuals();
        return;
      }
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
      const resource = [this.gathering.node,this.gathering.gold].find(n=>n && knownResource(this.fog,n.position)&&isNodeHit(world,n));
      this.gathering.units = enemy ? orderAttack(this.gathering.units, enemy.id)
        : resource ? orderUnits(this.gathering.units, world, resource)
          : commandGroupMove(this.gathering.units, world, this.map);
    }
  }

  private handleMove(pointer: Phaser.Input.Pointer): void {
    if (!this.gameplayActive()) return;
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
    if (!this.gameplayActive()) return;
    if (pointer.button === 1) { this.cameraDrag = undefined; return; }
    if (this.cameraDrag) return;
    if (this.placementClick) {
      this.placementClick = false;
      return;
    }
    if (this.placement.active || pointer.button !== 0 || !this.drag) return;
    if (pointer.event.target instanceof Element && pointer.event.target.closest('#hud, #match-menu')) {
      this.drag = undefined;
      this.dragBox.setVisible(false);
      return;
    }
    this.handleMove(pointer);
    const end = this.worldPoint(pointer);
    if (this.drag.active) {
      const hits=selectUnitsInRectangle(this.gathering.units, this.drag.world, end);
      this.gathering.units=this.drag.shift?combineSelection(this.gathering.units,hits,'add'):hits;
      if(!this.drag.shift||this.gathering.units.some(u=>u.selected))this.selectedBuilding = null;
    } else {
      const selected = selectPlayerTarget(this.gathering.units, end, this.gathering.base,
        this.placement.barracks, u=>u.kind==='worker'?unitStats.size:combatUnitStats(u).size);
      if(this.drag.shift&&!selected.building){
        this.gathering.units=combineSelection(this.gathering.units,selected.units,'toggle');
        if(selected.units.some(u=>u.selected))this.selectedBuilding=null;
      }else{this.gathering.units=selected.units;this.selectedBuilding=selected.building;}
    }
    this.drag = undefined;
    this.dragBox.setVisible(false);
    this.syncVisuals();
  }

  private syncPlacement(): void {
    const forge=this.placement.forge;
    if(!forge&&this.forgeVisual){this.forgeVisual.destroy();this.forgeVisual=undefined;}
    if(forge&&!this.forgeVisual)this.forgeVisual=this.add.image(forge.footprint.x+forge.footprint.width/2,forge.footprint.y+forge.footprint.height/2,'buildings',buildingFrame('forge','player',forge.construction.remainingSeconds)).setOrigin(.5,.75);
    if(forge)this.forgeVisual!.setFrame(buildingFrame('forge','player',forge.construction.remainingSeconds));
    this.forgeButton.disabled=!this.gameplayActive()||this.placement.active||!!forge||!this.gathering.units.some(u=>u.kind==='worker'&&u.selected);
    document.getElementById('research-status')!.textContent=forge?`Forge ${Math.ceil(forge.hp)} HP · bygge ${forge.construction.remainingSeconds.toFixed(1)} s · Attack ${this.research.attack} / Defense ${this.research.defense}${this.research.job?` · ${this.research.job.kind} ${this.research.job.remainingSeconds.toFixed(1)} s`:''}`:'Bygg Forge för uppgraderingar';
    for(const [kind,button] of this.researchButtons){button.disabled=!canResearch(this.gathering,this.research,this.placement,kind,this.gameplayActive());button.textContent=`${kind==='attack'?'Attack +25 %':'Defense −25 %'} – ${costLabel(upgradeConfig.cost)}`;}

    if(!this.placement.barracks&&this.barracksVisual){this.barracksVisual.destroy();this.barracksVisual=undefined;}
    const rect = buildingFootprint(this.previewPoint,this.placement.kind??'barracks');
    const error = this.placement.active ? !placementVisible(this.fog,rect)?'Platsen måste vara synlig':placementError(this.placement, this.previewPoint, this.gathering.wood, placementObstacles(this.gathering),
      {map:this.map,gathering:this.gathering,enemies:this.combat.enemies}) : null;
    this.placementPreview.setPosition(rect.x, rect.y)
      .setFillStyle(error ? 0xe05b5b : 0x7bd389, 0.4).setVisible(this.placement.active);
    this.buildButton.disabled = !this.gameplayActive() || this.placement.active || this.placement.barracks !== null || !this.gathering.units.some(u=>u.kind==='worker'&&u.selected);
    this.placementStatus.textContent = this.placement.active
      ? `${error ?? 'Giltig plats'} – klicka för placering, Esc/högerklick avbryter`
      : !this.gameplayActive() ? 'Matchen är avslutad' : this.placement.barracks ? barracksReady(this.placement) ? 'Barracks färdig' : `Bygge: ${this.placement.construction!.remainingSeconds.toFixed(1)} s arbete kvar – högerklick med worker återupptar` : !this.gathering.units.some(u=>u.kind==='worker'&&u.selected) ? 'Välj en worker för att bygga' : `Kostar ${costLabel(costs.barracks)} – välj plats`;
    if (this.placement.barracks && !this.barracksVisual) {
      const building = this.placement.barracks;
      this.barracksVisual = this.add.image(building.x+building.width/2,building.y+building.height/2,'buildings',buildingFrame('barracks','player',this.placement.construction?.remainingSeconds)).setOrigin(.5,.75);
    }
    this.farmButton.disabled=!this.gameplayActive()||this.placement.active
      ||(this.placement.farms?.length??0)>=farmConfig.maxCount||!this.gathering.units.some(u=>u.kind==='worker'&&u.selected);
    document.getElementById('farm-status')!.textContent=(this.placement.farms??[]).map(f=>`${f.id}: ${Math.ceil(f.hp??combatConfig.farmHP)} HP · ${f.construction.remainingSeconds===0?'färdig (+5)':f.construction.remainingSeconds.toFixed(1)+' s kvar'}`).join(' · ') || 'Välj worker – färdig farm ger +5 population';
    for(const [id,visual] of this.farmVisuals)if(!this.placement.farms?.some(f=>f.id===id)){visual.destroy();this.farmVisuals.delete(id);}
    for(const farm of this.placement.farms??[]) {
      if(!this.farmVisuals.has(farm.id))this.farmVisuals.set(farm.id,this.add.image(farm.footprint.x+farm.footprint.width/2,farm.footprint.y+farm.footprint.height/2,'buildings',buildingFrame('farm','player',farm.construction.remainingSeconds)).setOrigin(buildingOrigin('farm').x,buildingOrigin('farm').y));
      this.farmVisuals.get(farm.id)!.setFrame(buildingFrame('farm','player',farm.construction.remainingSeconds));
    }
    this.barracksVisual?.setFrame(buildingFrame('barracks','player',this.placement.construction?.remainingSeconds));
  }

  private syncVisuals(): void {
    if(this.selectedBuilding==='barracks'&&!this.placement.barracks||this.selectedBuilding==='base'&&this.combat.baseHP<=0)this.selectedBuilding=null;
    this.baseVisual.setVisible(this.combat.baseHP>0);this.baseLabel.setVisible(this.combat.baseHP>0).setText(`Bas ${Math.ceil(this.combat.baseHP)} HP`);
    if (!this.gameplayActive()) {
      this.attackMoveMode=false;
      this.cameraDrag = undefined;
      this.drag = undefined;
      this.dragBox.setVisible(false);
    }
    this.attackMoveButton.disabled=!this.gameplayActive()||!this.gathering.units.some(u=>u.kind==='soldier'&&u.selected);
    this.attackMoveButton.textContent=this.attackMoveMode?'Attack-move: klicka mål (Esc avbryter)':'Attack-move';
    this.stopButton.disabled = !this.gameplayActive() || !this.gathering.units.some(u=>u.selected);
    const visibleEnemies=this.combat.enemies.filter(e=>entityVisible(this.fog,'player',e));
    const markers = orderMarkers(this.gathering, {...this.combat,enemies:visibleEnemies}, this.outcome==='playing',this.placement.barracks,this.placement.farms,this.placement.forge?.footprint);
    for (const [id, visual] of this.orderVisuals) {
      if (!markers.some(m=>m.id===id)) { visual.destroy(); this.orderVisuals.delete(id); }
    }
    for (const marker of markers) {
      if (!this.orderVisuals.has(marker.id)) this.orderVisuals.set(marker.id,
        this.add.circle(0,0,5).setDepth(7));
      this.orderVisuals.get(marker.id)!.setPosition(marker.position.x,marker.position.y)
        .setStrokeStyle(2,marker.blocked?0xe05b5b:0xffdc73);
    }
    this.restartButton.hidden = this.session.phase!=='paused'&&this.session.phase!=='ended';
    this.restartButton.disabled = this.restartPending;
    this.matchStatus.textContent = this.outcome === 'defeat' ? 'Defeat – basen är förstörd'
      : this.outcome === 'victory' ? this.scenario==='skirmish'?'Victory – fiendebasen är förstörd':'Victory – alla vågor besegrade' : this.scenario==='skirmish'?'Förstör fiendebasen och skydda din egen':'Försvara basen';
    this.syncPlacement();
    this.goldVisual.setFrame(resourceFrame('gold',this.gathering.gold!.remaining,isVisible(this.fog,'player',this.gathering.gold!.position)));
    this.nodeVisual.setFrame(resourceFrame('wood',this.gathering.node.remaining,isVisible(this.fog,'player',this.gathering.node.position)));
    this.trainButton.parentElement!.style.visibility = this.selectedBuilding === 'base' ? 'visible' : 'hidden';
    this.soldierButton.parentElement!.style.visibility = this.selectedBuilding === 'barracks' ? 'visible' : 'hidden';
    const selectedProduction = this.selectedBuilding === 'base' ? this.production
      : this.selectedBuilding === 'barracks' ? this.soldierProduction : null;
    const queue=selectedProduction?.queue??[];
    const signature=`${this.selectedBuilding}:${this.outcome}:${queue.map(j=>j.id).join(',')}`;
    if(signature!==this.queueSignature){
      this.queueSignature=signature;this.queuePanel.replaceChildren();
      if(!queue.length)this.queuePanel.textContent=this.selectedBuilding?'Ingen produktion i kön':'Välj byggnad för produktion och avbrytning';
      queue.forEach((job,index)=>{
        const button=document.createElement('button');button.type='button';button.dataset.jobId=job.id;
        button.disabled=!this.gameplayActive();
        button.textContent=`${index===0?'Aktiv':'Köad'} ${job.kind} (${job.id}) – avbryt, ${Math.round((index===0?queueConfig.activeRefund:queueConfig.queuedRefund)*100)} % tillbaka`;
        this.queuePanel.append(button);
      });
    }
    this.rallyMarker.setVisible(selectedProduction?.rally !== undefined);
    if (selectedProduction?.rally) this.rallyMarker.setPosition(selectedProduction.rally.x, selectedProduction.rally.y);
    const selectedFootprint = this.selectedBuilding === 'base' ? baseFootprint(this.gathering.base)
      : this.selectedBuilding === 'barracks' ? this.placement.barracks : null;
    this.buildingRing.setVisible(selectedFootprint !== null);
    if (selectedFootprint) this.buildingRing.setPosition(selectedFootprint.x, selectedFootprint.y)
      .setSize(selectedFootprint.width, selectedFootprint.height);
    const population=populationState(this.gathering,this.placement,[this.production,this.soldierProduction]);
    this.trainButton.disabled = !allowsProduction(this.selectedBuilding, 'base', true, this.gameplayActive()) || !this.gameplayActive() || !canEnqueue(this.gathering, this.production,{kind:'base'},population);
    this.productionStatus.textContent = productionLabel(this.gathering, this.production, this.outcome,{kind:'base'},population);
    const barracks = { kind: 'barracks' as const, footprint: this.placement.barracks, ready:barracksReady(this.placement) };
    this.soldierButton.disabled = !allowsProduction(this.selectedBuilding, 'barracks', this.placement.barracks !== null, this.gameplayActive()) || !this.gameplayActive() || !canEnqueue(this.gathering, this.soldierProduction, barracks,population);
    this.catapultButton.disabled=!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive())||!canEnqueue(this.gathering,this.soldierProduction,{...barracks,unitType:'catapult'},population);
    this.archerButton.disabled=!allowsProduction(this.selectedBuilding,'barracks',this.placement.barracks!==null,this.gameplayActive())||!canEnqueue(this.gathering,this.soldierProduction,{...barracks,unitType:'archer'},population);
    this.soldierProductionStatus.textContent = productionLabel(this.gathering, this.soldierProduction, this.outcome, barracks,population);
    const labels = matchLabels({ map: this.map, gathering: this.gathering, combat: this.combat, waves: this.waves,
      production: this.production, soldierProduction: this.soldierProduction, placement: this.placement, outcome: this.outcome,scenario:this.scenario,difficulty:this.difficulty,fog:this.fog });
    for (const [id, text] of [['resource-status', labels.economy], ['health-status', labels.health],
      ['wave-status', labels.wave],['population-status',labels.population], ['selection-status', this.selectedBuilding ? `${this.selectedBuilding === 'base' ? 'Bas' : 'Barracks'} vald (${Math.ceil(this.selectedBuilding==='base'?this.combat.baseHP:this.placement.barracksHP??combatConfig.barracksHP)} HP) – högerklick sätter rally${selectedProduction?.rallyError ? ': ' + selectedProduction.rallyError : ''}` : labels.selected]]) {
      document.getElementById(id)!.textContent = text;
    }

    for (const [id, visual] of this.visuals) {
      if (!this.gathering.units.some(u => u.id === id)) {
        visual.body.destroy(); visual.ring.destroy(); visual.cargo.destroy(); this.visuals.delete(id);
      }
    }
    for (const [id, visual] of this.enemyVisuals) {
      if (!visibleEnemies.some(e => e.id === id)) {
        visual.body.destroy(); visual.label.destroy(); this.enemyVisuals.delete(id);
      }
    }
    const visibleShots=this.outcome==='playing'?(this.combat.projectiles??[]).filter(p=>isVisible(this.fog,'player',p.position)):[];
    for(const [id,visual] of this.projectileVisuals)if(!visibleShots.some(p=>p.id===id)){visual.destroy();this.projectileVisuals.delete(id);}
    for(const shot of visibleShots){if(!this.projectileVisuals.has(shot.id))this.projectileVisuals.set(shot.id,this.add.circle(0,0,shot.splashRadius?6:3,shot.splashRadius?0xb793d8:0xf9e7a0).setDepth(8));
      this.projectileVisuals.get(shot.id)!.setPosition(shot.position.x,shot.position.y);}
    for (const enemy of visibleEnemies) {
      if (!this.enemyVisuals.has(enemy.id)) this.enemyVisuals.set(enemy.id, {
        body: enemy.kind==='base'?this.add.image(enemy.position.x,enemy.position.y,'buildings',buildingFrame('base','enemy')).setOrigin(.5,.75):this.add.rectangle(enemy.position.x,enemy.position.y,combatConfig.enemySize,combatConfig.enemySize,combatConfig.enemyColor),
        label: this.add.text(0, 0, '', { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5, 0),
      });
      const visual = this.enemyVisuals.get(enemy.id)!;
      visual.body.setPosition(enemy.position.x, enemy.position.y);
      visual.label.setPosition(enemy.position.x, enemy.position.y - (enemy.kind==='base'?90:32)).setText(`${enemy.kind==='base'?'Enemy base':'Enemy'} ${Math.ceil(enemy.hp)} HP`);
    }
    for (const unit of this.gathering.units) {
      if (!this.visuals.has(unit.id)) {
        const ring = this.add.circle(unit.position.x, unit.position.y, unit.kind==='soldier'?Math.max(20,combatUnitStats(unit).size*.75):20)
          .setStrokeStyle(2, 0xffdc73).setVisible(false);
        const stats = unit.kind === 'worker' ? unitStats : combatUnitStats(unit);
        const body = this.add.rectangle(unit.position.x, unit.position.y, stats.size, stats.size, stats.color);
        const cargo = this.add.text(unit.position.x, unit.position.y - 32, '',
          { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5, 0);
        this.visuals.set(unit.id, { body, ring, cargo });
      }
      const visual = this.visuals.get(unit.id)!;
      visual.body.setPosition(unit.position.x, unit.position.y);
      visual.ring.setPosition(unit.position.x, unit.position.y).setVisible(unit.selected);
      visual.cargo.setPosition(unit.position.x, unit.position.y - 32)
        .setText(unit.kind === 'worker' ? `${unit.cargo.toFixed(1)}/${gatheringConfig.capacity} ${unit.cargoType ?? 'wood'} · ${Math.ceil(unit.hp??combatConfig.workerHP)} HP` : `${unit.archetype==='catapult'?'Catapult':unit.archetype==='archer'?'Archer':'Soldier'} ${Math.ceil(unit.hp)} HP`);
    }
    if(this.fogOverlay)drawFog(this.fogOverlay,this.fog,this.fogPreview??'player');
    for(const shortcut of hotkeys){const button=document.getElementById(shortcut.button)!;button.textContent=`${button.textContent?.replace(/\s+\[[A-Z]\]$/,'')} [${shortcut.key}]`;button.title=shortcut.label;}
    document.getElementById('group-status')!.textContent=Object.entries(this.controlGroups).map(([slot,ids])=>`${slot}: ${ids.length}`).join(' · ')||'Grupper: Ctrl+1–9 bind, 1–9 återkalla';
    this.minimap?.render();
    this.syncSession();
    // DOM controls can move the canvas (restart visibility, wrapping, scrolling).
    this.scale.updateBounds();
  }

  update(_time: number, delta: number): void {
    if(this.restartPending)return;
    const match = updateMatch({
      map: this.map, gathering: this.gathering, combat: this.combat, waves: this.waves,
      production: this.production, soldierProduction: this.soldierProduction,
      placement: this.placement, outcome: this.outcome,paused:!this.gameplayActive(),controlGroups:this.controlGroups,fog:this.fog,research:this.research,scenario:this.scenario,difficulty:this.difficulty,enemyProduction:this.enemyProduction,enemyAI:this.enemyAI,
    }, gameplayDelta(this.session.phase,delta/1000,this.skipGameplayFrame));
    this.skipGameplayFrame=false;
    this.applyMatch(match);
    if(this.outcome!=='playing')this.session=sessionTransition(this.session,'end');
    this.syncVisuals();
  }

  private applyMatch(match: MatchState): void {
    this.controlGroups=match.controlGroups??{};
    this.enemyAI=match.enemyAI;
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
