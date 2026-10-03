import {bindHomeMenu} from './presentation/homeMenu';
import {applySkin} from './presentation/skin';
import {bindAudioControls} from './presentation/audio';
import './style.css';
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { viewportConfig } from './config/camera';

bindAudioControls();applySkin();bindHomeMenu();

const game=new Phaser.Game({
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  parent: 'game',
  width: viewportConfig.width,
  height: viewportConfig.height,
  backgroundColor: '#182028',
  scene: [BootScene],
});

const gameContainer=document.getElementById('game')!;
const resizeGame=()=>{const {width,height}=gameContainer.getBoundingClientRect();if(width>0&&height>0&&(game.scale.width!==Math.floor(width)||game.scale.height!==Math.floor(height)))game.scale.resize(Math.floor(width),Math.floor(height));};
new ResizeObserver(resizeGame).observe(gameContainer);
window.addEventListener('resize',resizeGame);
