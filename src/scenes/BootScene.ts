import Phaser from 'phaser';
import { unitStats } from '../config/unit';
import { moveTowards, type Position } from '../gameplay/movement';
import { commandMove, selectAt, type CommandState } from '../gameplay/selection';

export class BootScene extends Phaser.Scene {
  private position: Position = { x: 400, y: 300 };
  private command: CommandState = { selected: false, target: { x: 400, y: 300 } };
  private unit!: Phaser.GameObjects.Rectangle;
  private selectionRing!: Phaser.GameObjects.Arc;

  constructor() {
    super('BootScene');
  }

  create(): void {
    this.position = { x: 400, y: 300 };
    this.command = { selected: false, target: { ...this.position } };
    this.selectionRing = this.add.circle(this.position.x, this.position.y, 20)
      .setStrokeStyle(2, 0xffdc73).setVisible(false);
    this.unit = this.add.rectangle(this.position.x, this.position.y, unitStats.size, unitStats.size, 0x7bd389);
    this.input.mouse?.disableContextMenu();
    this.input.on('pointerdown', this.handleCommand, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.off('pointerdown', this.handleCommand, this);
    });
  }

  private handleCommand(pointer: Phaser.Input.Pointer): void {
    pointer.updateWorldPoint(this.cameras.main);
    const click = { x: pointer.worldX, y: pointer.worldY };
    if (pointer.button === 0) {
      this.command = selectAt(this.command, click, this.position, unitStats.size);
      this.selectionRing.setVisible(this.command.selected);
    } else if (pointer.button === 2) {
      this.command = commandMove(this.command, click);
    }
  }

  update(_time: number, delta: number): void {
    this.position = moveTowards(this.position, this.command.target, unitStats.speed, delta / 1000);
    this.unit.setPosition(this.position.x, this.position.y);
    this.selectionRing.setPosition(this.position.x, this.position.y);
  }
}
