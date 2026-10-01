import Phaser from 'phaser';
import { createMatch, updateMatch, type MatchOutcome, type MatchState } from '../gameplay/match';
import { waveSchedule } from '../config/waves';
import type { WaveState } from '../gameplay/waves';
import { combatConfig } from '../config/combat';
import { enemyAt, orderAttack, type CombatState } from '../gameplay/combat';
import { soldierStats, unitStats } from '../config/unit';
import type { Position } from '../gameplay/movement';
import { gatheringConfig } from '../config/gathering';
import { productionConfig, soldierProductionConfig } from '../config/production';
import { barracksConfig } from '../config/buildings';
import { barracksFootprint, beginPlacement, cancelPlacement, placementError, placementObstacles, placeBarracks, type PlacementState } from '../gameplay/placement';
import { canStartProduction, startProduction, type ProductionState } from '../gameplay/production';
import { isNodeHit, orderUnits, type GatheringState } from '../gameplay/gathering';
import {
  isSelectionDrag, selectionRectangle,
  selectUnitAt, selectUnitsInRectangle,
} from '../gameplay/selection';

export class BootScene extends Phaser.Scene {
  private outcome: MatchOutcome = 'playing';
  private restartButton!: HTMLButtonElement;
  private restartPending = false;
  private matchStatus!: HTMLElement;
  private waves!: WaveState;
  private combat!: CombatState;
  private enemyVisuals = new Map<string, { body: Phaser.GameObjects.Rectangle; label: Phaser.GameObjects.Text }>();
  private combatText!: Phaser.GameObjects.Text;
  private gathering!: GatheringState;
  private placement: PlacementState = { active: false, barracks: null };
  private previewPoint: Position = { x: 0, y: 0 };
  private placementClick = false;
  private placementPreview!: Phaser.GameObjects.Rectangle;
  private barracksVisual?: Phaser.GameObjects.Rectangle;
  private buildButton!: HTMLButtonElement;
  private placementStatus!: HTMLElement;
  private production: ProductionState = { remainingSeconds: null, nextUnitNumber: 4 };
  private soldierProduction: ProductionState = { remainingSeconds: null, nextUnitNumber: 4 };
  private soldierButton!: HTMLButtonElement;
  private soldierProductionStatus!: HTMLElement;
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
    this.applyMatch(createMatch());
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
    this.combatText = this.add.text(16, 70, '', { fontSize: '16px', color: '#ffffff' });
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
    this.placementClick = false;
    this.barracksVisual = undefined;
    const buildingSize = barracksConfig.tileSize * barracksConfig.footprintTiles;
    this.placementPreview = this.add.rectangle(0, 0, buildingSize, buildingSize)
      .setOrigin(0).setStrokeStyle(2, 0xffffff).setVisible(false).setDepth(20);
    this.buildButton = document.querySelector<HTMLButtonElement>('#build-barracks')!;
    this.placementStatus = document.querySelector<HTMLElement>('#placement-status')!;
    this.buildButton.textContent = `Bygg barracks – ${barracksConfig.cost} wood`;
    const begin = () => {
      if (this.outcome !== 'playing') return;
      this.placement = beginPlacement(this.placement);
      this.drag = undefined;
      this.dragBox.setVisible(false);
      this.previewPoint = this.worldPoint(this.input.activePointer);
      this.syncVisuals();
    };
    const cancel = () => {
      if (this.outcome !== 'playing') return;
      this.placement = cancelPlacement(this.placement);
      this.syncVisuals();
    };
    this.buildButton.addEventListener('click', begin);
    this.input.keyboard?.on('keydown-ESC', cancel);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.buildButton.removeEventListener('click', begin);
      this.input.keyboard?.off('keydown-ESC', cancel);
    });
    this.trainButton = document.querySelector<HTMLButtonElement>('#train-worker')!;
    this.productionStatus = document.querySelector<HTMLElement>('#production-status')!;
    this.trainButton.textContent = `Träna arbetare – ${productionConfig.workerCost} wood`;
    const train = () => {
      if (this.outcome !== 'playing') return;
      const result = startProduction(this.gathering, this.production);
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
    this.soldierButton.textContent = `Träna soldier – ${soldierProductionConfig.cost} wood`;
    const trainSoldier = () => {
      if (this.outcome !== 'playing') return;
      const result = startProduction(this.gathering, this.soldierProduction,
        { kind: 'barracks', footprint: this.placement.barracks });
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
      const enemy = enemyAt(this.combat.enemies, world);
      this.gathering.units = enemy ? orderAttack(this.gathering.units, enemy.id)
        : orderUnits(this.gathering.units, world, isNodeHit(world, this.gathering.node) ? this.gathering.node : undefined);
    }
  }

  private handleMove(pointer: Phaser.Input.Pointer): void {
    if (this.outcome !== 'playing') return;
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
    this.gathering.units = this.drag.active
      ? selectUnitsInRectangle(this.gathering.units, this.drag.world, end)
      : selectUnitAt(this.gathering.units, end, unitStats.size);
    this.drag = undefined;
    this.dragBox.setVisible(false);
    this.syncVisuals();
  }

  private syncPlacement(): void {
    const rect = barracksFootprint(this.previewPoint);
    const error = placementError(this.placement, this.previewPoint, this.gathering.wood, placementObstacles(this.gathering));
    this.placementPreview.setPosition(rect.x, rect.y)
      .setFillStyle(error ? 0xe05b5b : 0x7bd389, 0.4).setVisible(this.placement.active);
    this.buildButton.disabled = this.outcome !== 'playing' || this.placement.active || this.placement.barracks !== null;
    this.placementStatus.textContent = this.placement.active
      ? `${error ?? 'Giltig plats'} – klicka för placering, Esc/högerklick avbryter`
      : this.placement.barracks ? 'Barracks byggd' : '';
    if (this.placement.barracks && !this.barracksVisual) {
      const building = this.placement.barracks;
      this.barracksVisual = this.add.rectangle(building.x, building.y, building.width, building.height, 0x9474b5).setOrigin(0);
    }
  }

  private syncVisuals(): void {
    if (this.outcome !== 'playing') {
      this.drag = undefined;
      this.dragBox.setVisible(false);
    }
    this.restartButton.hidden = this.outcome === 'playing';
    this.restartButton.disabled = this.restartPending;
    this.matchStatus.textContent = this.outcome === 'defeat' ? 'Defeat – basen är förstörd'
      : this.outcome === 'victory' ? 'Victory – alla vågor besegrade' : 'Försvara basen';
    this.syncPlacement();
    this.resourceText.setText(`Wood: ${this.gathering.wood.toFixed(1)}\nNode: ${this.gathering.node.remaining.toFixed(1)} wood`);
    this.nodeVisual.setFillStyle(this.gathering.node.remaining > 0 ? 0x9a683b : 0x555555);
    this.trainButton.disabled = this.outcome !== 'playing' || !canStartProduction(this.gathering, this.production);
    this.productionStatus.textContent = this.production.remainingSeconds === null
      ? 'Bas ledig' : `Återstår: ${this.production.remainingSeconds.toFixed(1)} s`;
    const barracks = { kind: 'barracks' as const, footprint: this.placement.barracks };
    this.soldierButton.hidden = this.placement.barracks === null;
    this.soldierProductionStatus.hidden = this.soldierButton.hidden;
    this.soldierButton.disabled = this.outcome !== 'playing' || !canStartProduction(this.gathering, this.soldierProduction, barracks);
    this.soldierProductionStatus.textContent = this.soldierProduction.remainingSeconds === null
      ? 'Barracks ledig' : `Soldier återstår: ${this.soldierProduction.remainingSeconds.toFixed(1)} s`;
    const nextWave = waveSchedule[this.waves.nextWave];
    this.combatText.setText(`Base HP: ${Math.ceil(this.combat.baseHP)}/${combatConfig.baseHP}
Wave: ${this.waves.nextWave}/${waveSchedule.length}`
      + (nextWave ? ` – nästa om ${Math.max(0, nextWave.atSeconds - this.waves.elapsedSeconds).toFixed(1)} s` : ' – alla spawnade'));

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
        .setText(unit.kind === 'worker' ? `${unit.cargo.toFixed(1)}/${gatheringConfig.capacity}` : `Soldier ${Math.ceil(unit.hp)} HP`);
    }
    // DOM controls can move the canvas (restart visibility, wrapping, scrolling).
    this.scale.updateBounds();
  }

  update(_time: number, delta: number): void {
    const match = updateMatch({
      gathering: this.gathering, combat: this.combat, waves: this.waves,
      production: this.production, soldierProduction: this.soldierProduction,
      placement: this.placement, outcome: this.outcome,
    }, delta / 1000);
    this.applyMatch(match);
    this.syncVisuals();
  }

  private applyMatch(match: MatchState): void {
    this.gathering = match.gathering;
    this.combat = match.combat;
    this.waves = match.waves;
    this.production = match.production;
    this.soldierProduction = match.soldierProduction;
    this.placement = match.placement;
    this.outcome = match.outcome;
  }
}
