import './style.css';
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { viewportConfig } from './config/camera';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: viewportConfig.width,
  height: viewportConfig.height,
  backgroundColor: '#182028',
  scene: [BootScene],
});
