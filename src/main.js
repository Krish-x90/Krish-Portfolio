import * as Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { OverworldScene } from './scenes/OverworldScene.js';
import { TunnelTransition } from './scenes/TunnelTransition.js';
import { Tunnel1Scene } from './scenes/Tunnel1Scene.js';
import { Tunnel2Scene } from './scenes/Tunnel2Scene.js';
import { Tunnel3Scene } from './scenes/Tunnel3Scene.js';
import { Tunnel4Scene } from './scenes/Tunnel4Scene.js';
import { Tunnel5Scene } from './scenes/Tunnel5Scene.js';
import { Tunnel6Scene } from './scenes/Tunnel6Scene.js';
import { CitadelScene } from './scenes/CitadelScene.js';
import { PauseScene } from './scenes/PauseScene.js';

import './style.css';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 1280,
  height: 720,
  pixelArt: true,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 900 }, debug: false }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [
    BootScene, TitleScene, OverworldScene, TunnelTransition,
    Tunnel1Scene, Tunnel2Scene, Tunnel3Scene,
    Tunnel4Scene, Tunnel5Scene, Tunnel6Scene, CitadelScene,
    PauseScene
  ]
};

new Phaser.Game(config);
