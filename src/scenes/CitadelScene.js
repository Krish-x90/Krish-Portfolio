import * as Phaser from 'phaser';
import { RESUME } from '../data/resumeData.js';
import { playSound, stopBGM } from '../utils/SoundGen.js';

export class CitadelScene extends Phaser.Scene {
  constructor() { super('Citadel'); }

  create() {
    stopBGM();
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    this.cameras.main.fadeIn(800);
    this.add.rectangle(cx, cy, 1280, 720, 0x050510);

    for (let i = 0; i < 30; i++) {
      const line = this.add.rectangle(0, i * 25, 1280, 1, 0x00f5ff, 0.03).setOrigin(0, 0);
      this.tweens.add({ targets: line, alpha: 0.08, duration: 2000 + i * 100, yoyo: true, repeat: -1 });
    }
    for (let i = 0; i < 40; i++) {
      const line = this.add.rectangle(i * 35, 0, 1, 720, 0x00f5ff, 0.02).setOrigin(0, 0);
      this.tweens.add({ targets: line, alpha: 0.06, duration: 2500 + i * 80, yoyo: true, repeat: -1 });
    }
    for (let i = 0; i < 40; i++) {
      const p = this.add.circle(Math.random() * 1280, Math.random() * 720, 1.5, 0x00f5ff, 0.15);
      this.tweens.add({ targets: p, y: p.y - 50, alpha: 0, duration: 4000 + Math.random() * 3000, repeat: -1 });
    }

    this.add.rectangle(cx, cy, 920, 560, 0x0a0a1e, 0.95).setStrokeStyle(2, 0x00f5ff, 0.8);
    this.add.text(cx, cy - 246, 'TECH CITADEL', {
      fontFamily: '"Press Start 2P"',
      fontSize: '22px',
      color: '#00f5ff'
    }).setOrigin(0.5);
    this.add.text(cx, cy - 214, '[ MAINFRAME CONSOLE ]', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#555577'
    }).setOrigin(0.5);

    const avatar = this.add.image(cx, cy - 145, 'player_idle_1').setScale(3);
    this.tweens.add({ targets: avatar, y: cy - 155, duration: 1100, yoyo: true, repeat: -1 });

    this.add.text(cx, cy - 88, RESUME.name.toUpperCase(), {
      fontFamily: '"Orbitron"',
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffffff',
      stroke: '#00f5ff',
      strokeThickness: 2
    }).setOrigin(0.5);
    this.add.text(cx, cy - 56, RESUME.location, {
      fontFamily: '"Press Start 2P"',
      fontSize: '9px',
      color: '#888899'
    }).setOrigin(0.5);

    const buildSummary = this.add.text(cx, cy - 24, 'AI + WEB + FINTECH + EMBEDDED + CREATIVE SYSTEMS', {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      color: '#00ff88'
    }).setOrigin(0.5);
    this.tweens.add({ targets: buildSummary, alpha: 0.45, duration: 1200, yoyo: true, repeat: -1 });

    const links = [
      { label: 'EMAIL', url: 'mailto:' + RESUME.email, color: '#ff4444' },
      { label: 'LINKEDIN', url: RESUME.links.linkedin, color: '#0088ff' },
      { label: 'GITHUB', url: RESUME.links.github, color: '#ffffff' },
      { label: 'HACKERRANK', url: RESUME.links.hackerrank, color: '#00ff88' }
    ];

    links.forEach((link, i) => {
      const ly = cy + 22 + i * 42;
      const btn = this.add.rectangle(cx, ly, 360, 34, 0x111128, 0.9)
        .setStrokeStyle(1, Phaser.Display.Color.HexStringToColor(link.color).color, 0.5)
        .setInteractive({ useHandCursor: true });
      this.add.text(cx, ly, link.label, {
        fontFamily: '"Press Start 2P"',
        fontSize: '12px',
        color: link.color
      }).setOrigin(0.5);

      btn.on('pointerover', () => {
        playSound('hover');
        btn.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(link.color).color, 1);
        btn.setFillStyle(0x1b1b38, 0.98);
      });
      btn.on('pointerout', () => {
        btn.setStrokeStyle(1, Phaser.Display.Color.HexStringToColor(link.color).color, 0.5);
        btn.setFillStyle(0x111128, 0.9);
      });
      btn.on('pointerdown', () => {
        playSound('select');
        window.open(link.url, '_blank');
      });
    });

    const hireY = cy + 214;
    const hireBg = this.add.rectangle(cx, hireY, 320, 50, 0xff0000, 0.2)
      .setStrokeStyle(2, 0xff0000)
      .setInteractive({ useHandCursor: true });
    const hireText = this.add.text(cx, hireY, 'RESTART GAME', {
      fontFamily: '"Press Start 2P"',
      fontSize: '16px',
      color: '#ff0000'
    }).setOrigin(0.5);

    this.tweens.add({ targets: [hireBg, hireText], scaleX: 1.05, scaleY: 1.05, duration: 800, yoyo: true, repeat: -1 });

    hireBg.on('pointerover', () => {
      playSound('hover');
      hireBg.setFillStyle(0xff0000, 0.4);
      hireText.setColor('#ffffff');
    });
    hireBg.on('pointerout', () => {
      hireBg.setFillStyle(0xff0000, 0.2);
      hireText.setColor('#ff0000');
    });
    hireBg.on('pointerdown', () => {
      playSound('select');
      window.lastTunnelEntered = null;
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Title'));
    });

    const backBtn = this.add.text(cx, cy + 258, '[ PRESS ESC TO RETURN ]', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#555577'
    }).setOrigin(0.5);
    this.tweens.add({ targets: backBtn, alpha: 0.3, duration: 1000, yoyo: true, repeat: -1 });

    this.input.keyboard.on('keydown-ESC', () => {
      playSound('select');
      this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Overworld'));
    });
  }
}
