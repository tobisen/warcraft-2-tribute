import {bindHomeMenu} from './presentation/homeMenu';
import {applySkin} from './presentation/skin';
import {bindAudioControls} from './presentation/audio';
import './style.css';
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { viewportConfig } from './config/camera';

bindAudioControls();applySkin();bindHomeMenu();

new Phaser.Game({
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  parent: 'game',
  width: viewportConfig.width,
  height: viewportConfig.height,
  backgroundColor: '#182028',
  scene: [BootScene],
});
