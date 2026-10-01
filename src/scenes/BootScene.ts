import Phaser from 'phaser';
import { unitStats } from '../config/unit';
import { moveTowards, type Position } from '../gameplay/movement';
import {
  commandSelectedUnits, isSelectionDrag, selectionRectangle,
  selectUnitAt, selectUnitsInRectangle, type SelectableUnit,
} from '../gameplay/selection';

export class BootScene extends Phaser.Scene {
  private units: SelectableUnit[] = [];
  private visuals = new Map<string, { body: Phaser.GameObjects.Rectangle; ring: Phaser.GameObjects.Arc }>();
  private drag?: { world: Position; screen: Position; active: boolean };
  private dragBox!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('BootScene');
  }

  create(): void {
    this.units = [280, 400, 520].map((x, index) => ({
      id: `unit-${index + 1}`, position: { x, y: 300 }, target: { x, y: 300 }, selected: false,
    }));
    this.visuals.clear();
    this.drag = undefined;
    for (const unit of this.units) {
      const ring = this.add.circle(unit.position.x, unit.position.y, 20)
        .setStrokeStyle(2, 0xffdc73).setVisible(false);
      const body = this.add.rectangle(unit.position.x, unit.position.y, unitStats.size, unitStats.size, 0x7bd389);
      this.visuals.set(unit.id, { body, ring });
    }
    this.dragBox = this.add.rectangle(0, 0, 0, 0, 0xffdc73, 0.1)
      .setOrigin(0).setStrokeStyle(1, 0xffdc73).setVisible(false);
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
    if (pointer.button === 0) {
      this.drag = { world, screen: this.screenPoint(pointer), active: false };
    } else if (pointer.button === 2) {
      this.units = commandSelectedUnits(this.units, world);
    }
  }

  private handleMove(pointer: Phaser.Input.Pointer): void {
    if (!this.drag) return;
    this.drag.active ||= isSelectionDrag(this.drag.screen, this.screenPoint(pointer));
    const rect = selectionRectangle(this.drag.world, this.worldPoint(pointer));
    this.dragBox.setPosition(rect.x, rect.y).setSize(rect.width, rect.height)
      .setVisible(this.drag.active);
  }

  private handleUp(pointer: Phaser.Input.Pointer): void {
    if (pointer.button !== 0 || !this.drag) return;
    this.handleMove(pointer);
    const end = this.worldPoint(pointer);
    this.units = this.drag.active
      ? selectUnitsInRectangle(this.units, this.drag.world, end)
      : selectUnitAt(this.units, end, unitStats.size);
    this.drag = undefined;
    this.dragBox.setVisible(false);
    this.syncVisuals();
  }

  private syncVisuals(): void {
    for (const unit of this.units) {
      const visual = this.visuals.get(unit.id)!;
      visual.body.setPosition(unit.position.x, unit.position.y);
      visual.ring.setPosition(unit.position.x, unit.position.y).setVisible(unit.selected);
    }
  }

  update(_time: number, delta: number): void {
    for (const unit of this.units) {
      unit.position = moveTowards(unit.position, unit.target, unitStats.speed, delta / 1000);
    }
    this.syncVisuals();
  }
}
