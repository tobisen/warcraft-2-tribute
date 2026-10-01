import Phaser from 'phaser';
import { unitStats } from '../config/unit';
import { moveTowards, type Position } from '../gameplay/movement';

export class BootScene extends Phaser.Scene {
  private position: Position = { x: 400, y: 300 };
  private target: Position = { x: 400, y: 300 };
  private unit!: Phaser.GameObjects.Rectangle;

  constructor() {
    super('BootScene');
  }

  create(): void {
    this.position = { x: 400, y: 300 };
    this.target = { ...this.position };
    this.unit = this.add.rectangle(this.position.x, this.position.y, 24, 24, 0x7bd389);
    this.input.mouse?.disableContextMenu();
    this.input.on('pointerdown', this.handleCommand, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off('pointerdown', this.handleCommand, this);
    });
  }

  private handleCommand(pointer: Phaser.Input.Pointer): void {
    if (!pointer.rightButtonDown()) return;
    pointer.updateWorldPoint(this.cameras.main);
    this.target = { x: pointer.worldX, y: pointer.worldY };
  }

  update(_time: number, delta: number): void {
    this.position = moveTowards(this.position, this.target, unitStats.speed, delta / 1000);
    this.unit.setPosition(this.position.x, this.position.y);
  }
}
