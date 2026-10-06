import {bindActionTooltips} from './presentation/actionTooltip';
import './presentation/actionTooltip.css';
import './presentation/playerUI.css';
import {bindDisplayControls} from './presentation/displaySettings';
import {bindReleaseInfo} from './presentation/releaseInfo';
import {bindResultScreen} from './presentation/resultScreen';
import {initializePreferences} from './presentation/preferences';
import {applyEnglishText} from './text';
import {bindHomeMenu} from './presentation/homeMenu';
import {applySkin} from './presentation/skin';
import {bindAudioControls} from './presentation/audio';
import './style.css';
import './presentation/menuImprovements.css';
import './presentation/spells.css';
import './presentation/actionIcons.css';
import './presentation/matchWorkspace.css';
import './presentation/actionGroups.css';
import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { viewportConfig } from './config/camera';

applyEnglishText();initializePreferences();bindAudioControls();applySkin();bindHomeMenu();bindResultScreen();bindReleaseInfo();bindDisplayControls();bindActionTooltips();

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
const resizeGame=()=>{const width=gameContainer.clientWidth,height=gameContainer.clientHeight;if(width>0&&height>0&&(game.scale.width!==Math.floor(width)||game.scale.height!==Math.floor(height)))game.scale.resize(Math.floor(width),Math.floor(height));game.scale.refresh();};
new ResizeObserver(resizeGame).observe(gameContainer);
window.addEventListener('resize',resizeGame);

window.addEventListener('displaychange',resizeGame);
