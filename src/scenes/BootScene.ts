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
import { soldierStats, unitStats } from '../config/unit';
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
  private map!: WorldMap;
  private baseVisual!:Phaser.GameObjects.Rectangle;
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
  private enemyVisuals = new Map<string, { body: Phaser.GameObjects.Rectangle; label: Phaser.GameObjects.Text }>();

  private gathering!: GatheringState;
  private placement: PlacementState = { active: false, barracks: null };
  private previewPoint: Position = { x: 0, y: 0 };
  private placementClick = false;
  private placementPreview!: Phaser.GameObjects.Rectangle;
  private barracksVisual?: Phaser.GameObjects.Rectangle;
  private farmVisuals = new Map<string, Phaser.GameObjects.Rectangle>();
  private farmButton!:HTMLButtonElement;
  private buildButton!: HTMLButtonElement;
  private placementStatus!: HTMLElement;
  private production: ProductionState = { remainingSeconds: null, nextUnitNumber: 4 };
  private soldierProduction: ProductionState = { remainingSeconds: null, nextUnitNumber: 4 };
  private soldierButton!: HTMLButtonElement;
  private soldierProductionStatus!: HTMLElement;
  private trainButton!: HTMLButtonElement;
  private productionStatus!: HTMLElement;
  private goldVisual!: Phaser.GameObjects.Arc;
  private nodeVisual!: Phaser.GameObjects.Arc;

  private visuals = new Map<string, { body: Phaser.GameObjects.Rectangle; ring: Phaser.GameObjects.Arc; cargo: Phaser.GameObjects.Text }>();
  private drag?: { world: Position; screen: Position; active: boolean };
  private dragBox!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('BootScene');
  }

  create(): void {
    this.applyMatch(createMatch());
    this.attackMoveMode=false;
    this.attackMoveButton=document.querySelector<HTMLButtonElement>('#attack-move')!;
    const beginAttackMove=()=>{
      if(this.outcome!=='playing'||!this.gathering.units.some(u=>u.kind==='soldier'&&u.selected))return;
      this.attackMoveMode=true;this.placement=cancelPlacement(this.placement);this.drag=undefined;
      this.dragBox.setVisible(false);this.syncVisuals();
    };
    this.attackMoveButton.addEventListener('click',beginAttackMove);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>this.attackMoveButton.removeEventListener('click',beginAttackMove));
    this.queueSignature = '';
    this.queuePanel=document.getElementById('production-queue')!;
    const cancelJob=(event:MouseEvent)=>{
      if(this.outcome!=='playing'||!this.selectedBuilding)return;
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
    this.orderVisuals.clear();
    this.farmVisuals.clear();
    this.stopButton = document.querySelector<HTMLButtonElement>('#stop-units')!;
    const stop = () => { this.attackMoveMode=false; this.gathering.units = stopSelected(this.gathering.units, this.outcome === 'playing'); this.syncVisuals(); };
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
    const restart = () => {
      if (this.outcome === 'playing' || this.restartPending) return;
      this.restartPending = true;
      this.restartButton.disabled = true;
      this.scene.restart();
    };
    this.restartButton.addEventListener('click', restart);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.restartButton.removeEventListener('click', restart);
    });
    this.enemyVisuals.clear();
    for (let row = 0; row < Math.ceil(this.map.height / this.map.tileSize); row++) {
      for (let column = 0; column < Math.ceil(this.map.width / this.map.tileSize); column++) {
        const rect = tileFootprint(this.map, { column, row })!;
        const patch = arenaConfig.terrain.find(p => column >= p.column && column < p.column + p.columns
          && row >= p.row && row < p.row + p.rows);
        this.add.rectangle(rect.x, rect.y, rect.width, rect.height,
          patch?.kind === 'rock' ? 0x66727b : patch?.kind === 'water' ? 0x315e86 : (column + row) % 2 ? 0x263c30 : 0x294233)
          .setOrigin(0).setDepth(-10);
      }
    }
    this.baseVisual=this.add.rectangle(this.gathering.base.x, this.gathering.base.y,
      gatheringConfig.baseSize, gatheringConfig.baseSize, 0x537eb5);
    this.baseLabel=this.add.text(this.gathering.base.x, this.gathering.base.y + 30, 'Base',
      { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5, 0);
    this.nodeVisual = this.add.circle(this.gathering.node.position.x, this.gathering.node.position.y,
      gatheringConfig.nodeRadius, 0x9a683b);
    this.goldVisual = this.add.circle(this.gathering.gold!.position.x, this.gathering.gold!.position.y,
      gatheringConfig.nodeRadius, 0xd8b64c);
    this.add.text(this.gathering.gold!.position.x, this.gathering.gold!.position.y+26, 'Gold',
      {fontSize:'16px',color:'#ffffff'}).setOrigin(.5,0);
    this.visuals.clear();
    this.drag = undefined;
    this.dragBox = this.add.rectangle(0, 0, 0, 0, 0xffdc73, 0.1)
      .setOrigin(0).setStrokeStyle(1, 0xffdc73).setVisible(false).setDepth(10);
    this.placementClick = false;
    this.barracksVisual = undefined;
    const buildingSize = barracksConfig.tileSize * barracksConfig.footprintTiles;
    this.placementPreview = this.add.rectangle(0, 0, buildingSize, buildingSize)
      .setOrigin(0).setStrokeStyle(2, 0xffffff).setVisible(false).setDepth(20);
    this.buildButton = document.querySelector<HTMLButtonElement>('#build-barracks')!;
    this.placementStatus = document.querySelector<HTMLElement>('#placement-status')!;
    this.buildButton.textContent = `Bygg barracks – ${costLabel(costs.barracks)}`;
    const begin = (kind:'barracks'|'farm'='barracks') => {
      if (this.outcome !== 'playing') return;
      if (!this.gathering.units.some(u=>u.kind==='worker' && u.selected)) return;
      this.attackMoveMode=false;
      this.placement = beginPlacement(this.placement,kind);
      this.drag = undefined;
      this.dragBox.setVisible(false);
      this.previewPoint = this.worldPoint(this.input.activePointer);
      this.syncVisuals();
    };
    const cancel = () => {
      if (this.outcome !== 'playing') return;
      this.attackMoveMode=false;
      this.placement = cancelPlacement(this.placement);
      this.syncVisuals();
    };
    const beginBarracks=()=>begin();
    const beginFarm=()=>begin('farm');
    this.farmButton=document.querySelector<HTMLButtonElement>('#build-farm')!;
    this.farmButton.textContent=`Bygg farm – ${costLabel(costs.farm)}`;
    this.farmButton.addEventListener('click',beginFarm);
    this.buildButton.addEventListener('click', beginBarracks);
    this.input.keyboard?.on('keydown-ESC', cancel);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.buildButton.removeEventListener('click', beginBarracks);
      this.farmButton.removeEventListener('click',beginFarm);
      this.input.keyboard?.off('keydown-ESC', cancel);
    });
    this.trainButton = document.querySelector<HTMLButtonElement>('#train-worker')!;
    this.productionStatus = document.querySelector<HTMLElement>('#production-status')!;
    this.trainButton.textContent = `Träna arbetare – ${costLabel(costs.worker)}`;
    const train = () => {
      if (!allowsProduction(this.selectedBuilding, 'base', true, this.outcome === 'playing')) return;
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
      if (!allowsProduction(this.selectedBuilding, 'barracks', this.placement.barracks !== null, this.outcome === 'playing')) return;
      const result = enqueueProduction(this.gathering, this.soldierProduction,
        { kind: 'barracks', footprint: this.placement.barracks, ready:barracksReady(this.placement) },populationState(this.gathering,this.placement,[this.production,this.soldierProduction]));
      this.gathering = result.gathering;
      this.soldierProduction = result.production;
      this.syncVisuals();
    };
    this.soldierButton.addEventListener('click', trainSoldier);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.soldierButton.removeEventListener('click', trainSoldier);
    });
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
    if (this.outcome !== 'playing') return;
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
      this.drag = { world, screen: this.screenPoint(pointer), active: false };
    } else if (pointer.button === 2) {
      if (this.selectedBuilding) {
        if (this.selectedBuilding === 'base') this.production = setRally(this.production, world, this.map,
          baseFootprint(this.gathering.base), 'base');
        else this.soldierProduction = setRally(this.soldierProduction, world, this.map, this.placement.barracks, 'barracks');
        this.syncVisuals();
        return;
      }
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
      const enemy = enemyAt(this.combat.enemies, world);
      const resource = [this.gathering.node,this.gathering.gold].find(n=>n && isNodeHit(world,n));
      this.gathering.units = enemy ? orderAttack(this.gathering.units, enemy.id)
        : resource ? orderUnits(this.gathering.units, world, resource)
          : commandGroupMove(this.gathering.units, world, this.map);
    }
  }

  private handleMove(pointer: Phaser.Input.Pointer): void {
    if (this.outcome !== 'playing') return;
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
    if (this.outcome !== 'playing') return;
    if (pointer.button === 1) { this.cameraDrag = undefined; return; }
    if (this.cameraDrag) return;
    if (this.placementClick) {
      this.placementClick = false;
      return;
    }
    if (this.placement.active || pointer.button !== 0 || !this.drag) return;
    if (pointer.event.target instanceof Element && pointer.event.target.closest('#hud')) {
      this.drag = undefined;
      this.dragBox.setVisible(false);
      return;
    }
    this.handleMove(pointer);
    const end = this.worldPoint(pointer);
    if (this.drag.active) {
      this.gathering.units = selectUnitsInRectangle(this.gathering.units, this.drag.world, end);
      this.selectedBuilding = null;
    } else {
      const selected = selectPlayerTarget(this.gathering.units, end, this.gathering.base,
        this.placement.barracks, unitStats.size);
      this.gathering.units = selected.units;
      this.selectedBuilding = selected.building;
    }
    this.drag = undefined;
    this.dragBox.setVisible(false);
    this.syncVisuals();
  }

  private syncPlacement(): void {
    if(!this.placement.barracks&&this.barracksVisual){this.barracksVisual.destroy();this.barracksVisual=undefined;}
    const rect = buildingFootprint(this.previewPoint,this.placement.kind??'barracks');
    const error = this.placement.active ? placementError(this.placement, this.previewPoint, this.gathering.wood, placementObstacles(this.gathering),
      {map:this.map,gathering:this.gathering,enemies:this.combat.enemies}) : null;
    this.placementPreview.setPosition(rect.x, rect.y)
      .setFillStyle(error ? 0xe05b5b : 0x7bd389, 0.4).setVisible(this.placement.active);
    this.buildButton.disabled = this.outcome !== 'playing' || this.placement.active || this.placement.barracks !== null || !this.gathering.units.some(u=>u.kind==='worker'&&u.selected);
    this.placementStatus.textContent = this.placement.active
      ? `${error ?? 'Giltig plats'} – klicka för placering, Esc/högerklick avbryter`
      : this.outcome !== 'playing' ? 'Matchen är avslutad' : this.placement.barracks ? barracksReady(this.placement) ? 'Barracks färdig' : `Bygge: ${this.placement.construction!.remainingSeconds.toFixed(1)} s arbete kvar – högerklick med worker återupptar` : !this.gathering.units.some(u=>u.kind==='worker'&&u.selected) ? 'Välj en worker för att bygga' : `Kostar ${costLabel(costs.barracks)} – välj plats`;
    if (this.placement.barracks && !this.barracksVisual) {
      const building = this.placement.barracks;
      this.barracksVisual = this.add.rectangle(building.x, building.y, building.width, building.height, 0x9474b5).setOrigin(0);
    }
    this.farmButton.disabled=this.outcome!=='playing'||this.placement.active
      ||(this.placement.farms?.length??0)>=farmConfig.maxCount||!this.gathering.units.some(u=>u.kind==='worker'&&u.selected);
    document.getElementById('farm-status')!.textContent=(this.placement.farms??[]).map(f=>`${f.id}: ${Math.ceil(f.hp??combatConfig.farmHP)} HP · ${f.construction.remainingSeconds===0?'färdig (+5)':f.construction.remainingSeconds.toFixed(1)+' s kvar'}`).join(' · ') || 'Välj worker – färdig farm ger +5 population';
    for(const [id,visual] of this.farmVisuals)if(!this.placement.farms?.some(f=>f.id===id)){visual.destroy();this.farmVisuals.delete(id);}
    for(const farm of this.placement.farms??[]) {
      if(!this.farmVisuals.has(farm.id))this.farmVisuals.set(farm.id,this.add.rectangle(farm.footprint.x,farm.footprint.y,farm.footprint.width,farm.footprint.height).setOrigin(0));
      this.farmVisuals.get(farm.id)!.setFillStyle(farm.construction.remainingSeconds===0?0x798d50:0x6a606c);
    }
    this.barracksVisual?.setFillStyle(barracksReady(this.placement)?0x9474b5:0x6a606c);
  }

  private syncVisuals(): void {
    if(this.selectedBuilding==='barracks'&&!this.placement.barracks||this.selectedBuilding==='base'&&this.combat.baseHP<=0)this.selectedBuilding=null;
    this.baseVisual.setVisible(this.combat.baseHP>0);this.baseLabel.setVisible(this.combat.baseHP>0);
    if (this.outcome !== 'playing') {
      this.attackMoveMode=false;
      this.cameraDrag = undefined;
      this.drag = undefined;
      this.dragBox.setVisible(false);
    }
    this.attackMoveButton.disabled=this.outcome!=='playing'||!this.gathering.units.some(u=>u.kind==='soldier'&&u.selected);
    this.attackMoveButton.textContent=this.attackMoveMode?'Attack-move: klicka mål (Esc avbryter)':'Attack-move';
    this.stopButton.disabled = this.outcome !== 'playing' || !this.gathering.units.some(u=>u.selected);
    const markers = orderMarkers(this.gathering, this.combat, this.outcome === 'playing',this.placement.barracks,this.placement.farms);
    for (const [id, visual] of this.orderVisuals) {
      if (!markers.some(m=>m.id===id)) { visual.destroy(); this.orderVisuals.delete(id); }
    }
    for (const marker of markers) {
      if (!this.orderVisuals.has(marker.id)) this.orderVisuals.set(marker.id,
        this.add.circle(0,0,5).setDepth(7));
      this.orderVisuals.get(marker.id)!.setPosition(marker.position.x,marker.position.y)
        .setStrokeStyle(2,marker.blocked?0xe05b5b:0xffdc73);
    }
    this.restartButton.hidden = this.outcome === 'playing';
    this.restartButton.disabled = this.restartPending;
    this.matchStatus.textContent = this.outcome === 'defeat' ? 'Defeat – basen är förstörd'
      : this.outcome === 'victory' ? 'Victory – alla vågor besegrade' : 'Försvara basen';
    this.syncPlacement();
    this.goldVisual.setFillStyle(this.gathering.gold!.remaining > 0 ? 0xd8b64c : 0x555555);
    this.nodeVisual.setFillStyle(this.gathering.node.remaining > 0 ? 0x9a683b : 0x555555);
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
        button.disabled=this.outcome!=='playing';
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
    this.trainButton.disabled = !allowsProduction(this.selectedBuilding, 'base', true, this.outcome === 'playing') || this.outcome !== 'playing' || !canEnqueue(this.gathering, this.production,{kind:'base'},population);
    this.productionStatus.textContent = productionLabel(this.gathering, this.production, this.outcome,{kind:'base'},population);
    const barracks = { kind: 'barracks' as const, footprint: this.placement.barracks, ready:barracksReady(this.placement) };
    this.soldierButton.disabled = !allowsProduction(this.selectedBuilding, 'barracks', this.placement.barracks !== null, this.outcome === 'playing') || this.outcome !== 'playing' || !canEnqueue(this.gathering, this.soldierProduction, barracks,population);
    this.soldierProductionStatus.textContent = productionLabel(this.gathering, this.soldierProduction, this.outcome, barracks,population);
    const labels = matchLabels({ map: this.map, gathering: this.gathering, combat: this.combat, waves: this.waves,
      production: this.production, soldierProduction: this.soldierProduction, placement: this.placement, outcome: this.outcome });
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
      if (!this.combat.enemies.some(e => e.id === id)) {
        visual.body.destroy(); visual.label.destroy(); this.enemyVisuals.delete(id);
      }
    }
    for (const enemy of this.combat.enemies) {
      if (!this.enemyVisuals.has(enemy.id)) this.enemyVisuals.set(enemy.id, {
        body: this.add.rectangle(enemy.position.x, enemy.position.y, combatConfig.enemySize, combatConfig.enemySize, combatConfig.enemyColor),
        label: this.add.text(0, 0, '', { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5, 0),
      });
      const visual = this.enemyVisuals.get(enemy.id)!;
      visual.body.setPosition(enemy.position.x, enemy.position.y);
      visual.label.setPosition(enemy.position.x, enemy.position.y - 32).setText(`Enemy ${Math.ceil(enemy.hp)} HP`);
    }
    for (const unit of this.gathering.units) {
      if (!this.visuals.has(unit.id)) {
        const ring = this.add.circle(unit.position.x, unit.position.y, 20)
          .setStrokeStyle(2, 0xffdc73).setVisible(false);
        const stats = unit.kind === 'worker' ? unitStats : soldierStats;
        const body = this.add.rectangle(unit.position.x, unit.position.y, stats.size, stats.size, stats.color);
        const cargo = this.add.text(unit.position.x, unit.position.y - 32, '',
          { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5, 0);
        this.visuals.set(unit.id, { body, ring, cargo });
      }
      const visual = this.visuals.get(unit.id)!;
      visual.body.setPosition(unit.position.x, unit.position.y);
      visual.ring.setPosition(unit.position.x, unit.position.y).setVisible(unit.selected);
      visual.cargo.setPosition(unit.position.x, unit.position.y - 32)
        .setText(unit.kind === 'worker' ? `${unit.cargo.toFixed(1)}/${gatheringConfig.capacity} ${unit.cargoType ?? 'wood'} · ${Math.ceil(unit.hp??combatConfig.workerHP)} HP` : `Soldier ${Math.ceil(unit.hp)} HP`);
    }
    // DOM controls can move the canvas (restart visibility, wrapping, scrolling).
    this.scale.updateBounds();
  }

  update(_time: number, delta: number): void {
    const match = updateMatch({
      map: this.map, gathering: this.gathering, combat: this.combat, waves: this.waves,
      production: this.production, soldierProduction: this.soldierProduction,
      placement: this.placement, outcome: this.outcome,
    }, delta / 1000);
    this.applyMatch(match);
    this.syncVisuals();
  }

  private applyMatch(match: MatchState): void {
    this.map = match.map;
    this.gathering = match.gathering;
    this.combat = match.combat;
    this.waves = match.waves;
    this.production = match.production;
    this.soldierProduction = match.soldierProduction;
    this.placement = match.placement;
    this.outcome = match.outcome;
  }
}
