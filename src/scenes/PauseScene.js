import * as Phaser from 'phaser';
import { playSound, stopBGM } from '../utils/SoundGen.js';

export class PauseScene extends Phaser.Scene {
  constructor() { super('Pause'); }

  init(data) {
    this.pausedScene = data.pausedScene;
  }

  create() {
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    this.add.rectangle(cx, cy, 1280, 720, 0x000000, 0.8);

    this.add.text(cx, cy - 150, 'PAUSED', {
      fontFamily: '"Orbitron"', fontSize: '60px', color: '#00f5ff'
    }).setOrigin(0.5);

    const createBtn = (y, text, callback) => {
      const btn = this.add.text(cx, y, text, {
        fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#ffffff',
        backgroundColor: '#222244', padding: { x: 20, y: 10 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      
      btn.on('pointerover', () => {
        playSound('hover');
        btn.setStyle({ color: '#ffd700', backgroundColor: '#444466' });
      });
      btn.on('pointerout', () => btn.setStyle({ color: '#ffffff', backgroundColor: '#222244' }));
      btn.on('pointerdown', () => {
        playSound('select');
        callback();
      });
      return btn;
    };

    createBtn(cy - 20, 'RESUME', () => {
      this.scene.stop();
      if (this.pausedScene) this.scene.resume(this.pausedScene);
    });

    createBtn(cy + 60, 'RETURN TO MAP', () => {
      stopBGM();
      this.scene.stop();
      this.scene.manager.getScenes(false).forEach(s => {
        if (s.scene.key !== 'Boot' && s.scene.key !== 'Title') s.scene.stop();
      });
      this.scene.start('Overworld');
    });

    createBtn(cy + 140, 'RETURN TO START', () => {
      stopBGM();
      this.scene.stop();
      this.scene.manager.getScenes(false).forEach(s => {
        if (s.scene.key !== 'Boot') s.scene.stop();
      });
      this.scene.start('Title');
    });

    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.stop();
      if (this.pausedScene) this.scene.resume(this.pausedScene);
    });
  }
}
