import Phaser from 'phaser';
import { unitStats } from '../config/unit';
import type { Position } from '../gameplay/movement';
import { gatheringConfig } from '../config/gathering';
import { productionConfig } from '../config/production';
import { barracksConfig } from '../config/buildings';
import { barracksFootprint, beginPlacement, cancelPlacement, placementError, placementObstacles, placeBarracks, type PlacementState } from '../gameplay/placement';
import { canStartProduction, startProduction, updateProduction, type ProductionState } from '../gameplay/production';
import { isNodeHit, orderWorkers, updateGathering, type GatheringState } from '../gameplay/gathering';
import {
  isSelectionDrag, selectionRectangle,
  selectUnitAt, selectUnitsInRectangle,
} from '../gameplay/selection';

export class BootScene extends Phaser.Scene {
  private gathering!: GatheringState;
  private placement: PlacementState = { active: false, barracks: null };
  private previewPoint: Position = { x: 0, y: 0 };
  private placementClick = false;
  private placementPreview!: Phaser.GameObjects.Rectangle;
  private barracksVisual?: Phaser.GameObjects.Rectangle;
  private buildButton!: HTMLButtonElement;
  private placementStatus!: HTMLElement;
  private production: ProductionState = { remainingSeconds: null, nextWorkerNumber: 4 };
  private trainButton!: HTMLButtonElement;
  private productionStatus!: HTMLElement;
  private nodeVisual!: Phaser.GameObjects.Arc;
  private resourceText!: Phaser.GameObjects.Text;
  private visuals = new Map<string, { body: Phaser.GameObjects.Rectangle; ring: Phaser.GameObjects.Arc; cargo: Phaser.GameObjects.Text }>();
  private drag?: { world: Position; screen: Position; active: boolean };
  private dragBox!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('BootScene');
  }

  create(): void {
    this.gathering = {
      workers: [280, 400, 520].map((x, index) => ({
        id: `unit-${index + 1}`, position: { x, y: 300 }, target: { x, y: 300 },
        selected: false, order: { kind: 'idle' }, cargo: 0,
      })),
      node: { id: 'wood-1', position: { ...gatheringConfig.nodePosition }, remaining: gatheringConfig.initialWood },
      wood: 0,
      base: { ...gatheringConfig.basePosition },
    };
    this.add.rectangle(this.gathering.base.x, this.gathering.base.y,
      gatheringConfig.baseSize, gatheringConfig.baseSize, 0x537eb5);
    this.add.text(this.gathering.base.x, this.gathering.base.y + 30, 'Base',
      { fontSize: '16px', color: '#ffffff' }).setOrigin(0.5, 0);
    this.nodeVisual = this.add.circle(this.gathering.node.position.x, this.gathering.node.position.y,
      gatheringConfig.nodeRadius, 0x9a683b);
    this.resourceText = this.add.text(16, 16, '', { fontSize: '18px', color: '#ffffff' });
    this.visuals.clear();
    this.drag = undefined;
    this.dragBox = this.add.rectangle(0, 0, 0, 0, 0xffdc73, 0.1)
      .setOrigin(0).setStrokeStyle(1, 0xffdc73).setVisible(false).setDepth(10);
    this.placement = { active: false, barracks: null };
    this.placementClick = false;
    this.barracksVisual = undefined;
    const buildingSize = barracksConfig.tileSize * barracksConfig.footprintTiles;
    this.placementPreview = this.add.rectangle(0, 0, buildingSize, buildingSize)
      .setOrigin(0).setStrokeStyle(2, 0xffffff).setVisible(false).setDepth(20);
    this.buildButton = document.querySelector<HTMLButtonElement>('#build-barracks')!;
    this.placementStatus = document.querySelector<HTMLElement>('#placement-status')!;
    this.buildButton.textContent = `Bygg barracks – ${barracksConfig.cost} wood`;
    const begin = () => {
      this.placement = beginPlacement(this.placement);
      this.drag = undefined;
      this.dragBox.setVisible(false);
      this.previewPoint = this.worldPoint(this.input.activePointer);
      this.syncVisuals();
    };
    const cancel = () => {
      this.placement = cancelPlacement(this.placement);
      this.syncVisuals();
    };
    this.buildButton.addEventListener('click', begin);
    this.input.keyboard?.on('keydown-ESC', cancel);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.buildButton.removeEventListener('click', begin);
      this.input.keyboard?.off('keydown-ESC', cancel);
    });
    this.production = { remainingSeconds: null, nextWorkerNumber: 4 };
    this.trainButton = document.querySelector<HTMLButtonElement>('#train-worker')!;
    this.productionStatus = document.querySelector<HTMLElement>('#production-status')!;
    this.trainButton.textContent = `Träna arbetare – ${productionConfig.workerCost} wood`;
    const train = () => {
      const result = startProduction(this.gathering, this.production);
      this.gathering = result.gathering;
      this.production = result.production;
      this.syncVisuals();
    };
    this.trainButton.addEventListener('click', train);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.trainButton.removeEventListener('click', train);
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
    const world = this.worldPoint(pointer);
    if (this.placement.active) {
      this.placementClick = true;
      this.previewPoint = world;
      if (pointer.button === 2) {
        this.placement = cancelPlacement(this.placement);
      } else if (pointer.button === 0) {
        const result = placeBarracks(this.placement, world, this.gathering.wood, placementObstacles(this.gathering));
        this.placement = result.placement;
        this.gathering = { ...this.gathering, wood: result.wood };
      }
      this.syncVisuals();
      return;
    }
    if (pointer.button === 0) {
      this.drag = { world, screen: this.screenPoint(pointer), active: false };
    } else if (pointer.button === 2) {
      this.gathering.workers = orderWorkers(this.gathering.workers, world,
        isNodeHit(world, this.gathering.node) ? this.gathering.node : undefined);
    }
  }

  private handleMove(pointer: Phaser.Input.Pointer): void {
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
    if (this.placementClick) {
      this.placementClick = false;
      return;
    }
    if (this.placement.active || pointer.button !== 0 || !this.drag) return;
    if (pointer.event.target instanceof Element && pointer.event.target.closest('#production-controls')) {
      this.drag = undefined;
      this.dragBox.setVisible(false);
      return;
    }
    this.handleMove(pointer);
    const end = this.worldPoint(pointer);
    this.gathering.workers = this.drag.active
      ? selectUnitsInRectangle(this.gathering.workers, this.drag.world, end)
      : selectUnitAt(this.gathering.workers, end, unitStats.size);
    this.drag = undefined;
    this.dragBox.setVisible(false);
    this.syncVisuals();
  }

  private syncPlacement(): void {
    const rect = barracksFootprint(this.previewPoint);
    const error = placementError(this.placement, this.previewPoint, this.gathering.wood, placementObstacles(this.gathering));
    this.placementPreview.setPosition(rect.x, rect.y)
      .setFillStyle(error ? 0xe05b5b : 0x7bd389, 0.4).setVisible(this.placement.active);
    this.buildButton.disabled = this.placement.active || this.placement.barracks !== null;
    this.placementStatus.textContent = this.placement.active
      ? `${error ?? 'Giltig plats'} – klicka för placering, Esc/högerklick avbryter`
      : this.placement.barracks ? 'Barracks byggd' : '';
    if (this.placement.barracks && !this.barracksVisual) {
      const building = this.placement.barracks;
      this.barracksVisual = this.add.rectangle(building.x, building.y, building.width, building.height, 0x9474b5).setOrigin(0);
    }
  }

  private syncVisuals(): void {
    this.syncPlacement();
    this.resourceText.setText(`Wood: ${this.gathering.wood.toFixed(1)}\nNode: ${this.gathering.node.remaining.toFixed(1)} wood`);
    this.nodeVisual.setFillStyle(this.gathering.node.remaining > 0 ? 0x9a683b : 0x555555);
    this.trainButton.disabled = !canStartProduction(this.gathering, this.production);
    this.productionStatus.textContent = this.production.remainingSeconds === null
      ? 'Bas ledig' : `Återstår: ${this.production.remainingSeconds.toFixed(1)} s`;
    for (const unit of this.gathering.workers) {
      if (!this.visuals.has(unit.id)) {
        const ring = this.add.circle(unit.position.x, unit.position.y, 20)
          .setStrokeStyle(2, 0xffdc73).setVisible(false);
        const body = this.add.rectangle(unit.position.x, unit.position.y, unitStats.size, unitStats.size, 0x7bd389);
        const cargo = this.add.text(unit.position.x, unit.position.y - 32, '',
          { fontSize: '14px', color: '#ffffff' }).setOrigin(0.5, 0);
        this.visuals.set(unit.id, { body, ring, cargo });
      }
      const visual = this.visuals.get(unit.id)!;
      visual.body.setPosition(unit.position.x, unit.position.y);
      visual.ring.setPosition(unit.position.x, unit.position.y).setVisible(unit.selected);
      visual.cargo.setPosition(unit.position.x, unit.position.y - 32)
        .setText(`${unit.cargo.toFixed(1)}/${gatheringConfig.capacity}`);
    }
  }

  update(_time: number, delta: number): void {
    this.gathering = updateGathering(this.gathering, delta / 1000);
    const result = updateProduction(this.gathering, this.production, delta / 1000);
    this.gathering = result.gathering;
    this.production = result.production;
    this.syncVisuals();
  }
}
