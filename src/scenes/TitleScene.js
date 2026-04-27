import * as Phaser from 'phaser';
import { playSound, stopBGM } from '../utils/SoundGen.js';

export class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    stopBGM();
    this.started = false;
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    this.add.rectangle(cx, cy, 1280, 720, 0x0a0a14);

    for (let i = 0; i < 20; i++) {
      const line = this.add.rectangle(0, i * 40 + 100, 1280, 1, 0x00f5ff, 0.06).setOrigin(0, 0);
      this.tweens.add({ targets: line, alpha: 0.15, duration: 1500 + i * 200, yoyo: true, repeat: -1 });
    }

    for (let i = 0; i < 30; i++) {
      const p = this.add.circle(Math.random() * 1280, Math.random() * 720, 2, 0x00f5ff, 0.2);
      this.tweens.add({ targets: p, y: p.y - 60, alpha: 0, duration: 3000 + Math.random() * 3000, repeat: -1, delay: Math.random() * 2000 });
    }

    const title = this.add.text(cx, cy - 150, 'KRISH SARODE', {
      fontFamily: '"Orbitron"', fontSize: '60px', fontStyle: 'bold',
      color: '#ffffff', stroke: '#00f5ff', strokeThickness: 3
    }).setOrigin(0.5);

    const subtitle = this.add.text(cx, cy - 70, 'PORTFOLIO QUEST', {
      fontFamily: '"Press Start 2P"', fontSize: '24px', color: '#00f5ff'
    }).setOrigin(0.5);

    this.add.text(cx, cy - 35, 'FULL-STACK DEV  |  EMBEDDED BUILDER  |  CREATIVE TECH', {
      fontFamily: '"Press Start 2P"', fontSize: '9px', color: '#aaffff',
      align: 'center'
    }).setOrigin(0.5);

    // Character preview
    const player = this.add.image(cx, cy + 50, 'player_idle_1').setScale(3.5).setAlpha(0);

    const promptBg = this.add.rectangle(cx, cy + 178, 430, 42, 0x1a1430, 0.84)
      .setStrokeStyle(2, 0xffd700, 0.7)
      .setInteractive({ useHandCursor: true });
    const prompt = this.add.text(cx, cy + 180, '[ ENTER / TAP TO START ]', {
      fontFamily: '"Press Start 2P"', fontSize: '14px', color: '#ffd700'
    }).setOrigin(0.5);

    this.add.text(cx, cy + 240, 'WASD / ARROWS = MOVE  |  SPACE = JUMP', {
      fontFamily: '"Press Start 2P"', fontSize: '10px', color: '#555577'
    }).setOrigin(0.5);
    this.add.text(cx, cy + 270, 'ENTER = ENTER PIPE  |  E = AVENGER POWER', {
      fontFamily: '"Press Start 2P"', fontSize: '10px', color: '#555577'
    }).setOrigin(0.5);

    this.tweens.add({ targets: title, y: cy - 160, duration: 800, ease: 'Back.easeOut' });
    this.tweens.add({ targets: subtitle, scaleX: 1.04, scaleY: 1.04, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: player, alpha: 1, y: cy + 40, duration: 600, delay: 600 });
    this.tweens.add({ targets: [promptBg, prompt], scaleX: 1.03, scaleY: 1.03, duration: 800, yoyo: true, repeat: -1 });

    promptBg.on('pointerover', () => {
      promptBg.setFillStyle(0xffd700, 0.18);
      playSound('hover');
    });
    promptBg.on('pointerout', () => promptBg.setFillStyle(0x1a1430, 0.84));
    promptBg.on('pointerdown', () => this.startGame());

    this.input.keyboard.on('keydown-ENTER', () => this.startGame());
    this.input.keyboard.on('keydown-SPACE', () => this.startGame());
    this.input.on('pointerdown', () => this.startGame());
  }

  startGame() {
    if (this.started) return;
    this.started = true;
    playSound('start');
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => { this.scene.start('Overworld'); });
  }
}
