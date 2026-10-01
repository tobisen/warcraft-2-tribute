import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { worldConfig } from './config/buildings';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: worldConfig.width,
  height: worldConfig.height,
  backgroundColor: '#182028',
  scene: [BootScene],
});
