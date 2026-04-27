import * as Phaser from 'phaser';
import { setupTunnel, addPlatform, addInfoBlock, addVillain } from '../utils/TunnelHelpers.js';
import { playSound } from '../utils/SoundGen.js';

export class Tunnel6Scene extends Phaser.Scene {
  constructor() { super('Tunnel6'); }

  create() {
    const { ground, GY } = setupTunnel(this, {
      width: 3600, theme: 'arcade', levelName: 'NEON ARCADE', tunnelNum: 6
    });

    for (let i = 0; i < 8; i++) {
      const ax = 200 + i * 400;
      this.add.image(ax, GY - 40, 'arcade_cabinet').setScale(1.2).setAlpha(0.4).setDepth(-5);
      const sg = this.add.circle(ax, GY - 70, 15, 0x00ff88, 0.05);
      this.tweens.add({ targets: sg, alpha: 0.12, duration: 1000 + i * 300, yoyo: true, repeat: -1 });
    }

    const signs = ['CREATION', 'MEDIA', 'GAMING', 'DESIGN'];
    const signColors = ['#ff00ff', '#00f5ff', '#ffd700', '#ff4444'];
    signs.forEach((s, i) => {
      const sign = this.add.text(400 + i * 800, 80, s, {
        fontFamily: '"Orbitron"',
        fontSize: '36px',
        fontStyle: 'bold',
        color: signColors[i]
      }).setOrigin(0.5).setAlpha(0.3).setDepth(-4);
      this.tweens.add({ targets: sign, alpha: 0.65, duration: 1300 + i * 200, yoyo: true, repeat: -1 });
    });

    const pp = [[350,GY-120],[600,GY-180],[850,GY-130],[1100,GY-200],[1400,GY-150],[1700,GY-180],[2000,GY-220],[2300,GY-160],[2600,GY-200],[2900,GY-140]];
    pp.forEach(([x, y]) => addPlatform(this, x, y, 'platform', ground));

    addVillain(this, 3300, GY - 80, 6);

    const collectibleNames = ['EDIT', 'FX', 'GAME', 'DESIGN', 'MEDIA', 'IDEA'];
    for (let i = 0; i < 6; i++) {
      const cx = 300 + i * 500;
      const cam = this.add.text(cx, GY - 260, '[CAM]', {
        fontFamily: '"Press Start 2P"',
        fontSize: '14px',
        color: '#ff88ff',
        backgroundColor: '#180828cc',
        padding: { x: 8, y: 6 }
      }).setOrigin(0.5);
      const label = this.add.text(cx, GY - 220, collectibleNames[i], {
        fontFamily: '"Press Start 2P"',
        fontSize: '8px',
        color: '#ffd7ff'
      }).setOrigin(0.5);
      this.tweens.add({ targets: [cam, label], y: '-=12', duration: 900, yoyo: true, repeat: -1 });
      const czone = this.add.zone(cx, cam.y, 64, 42);
      this.physics.add.existing(czone, true);
      let cc = false;
      this.physics.add.overlap(this.player.sprite, czone, () => {
        if (cc) return;
        cc = true;
        playSound('coin');
        this.tweens.add({ targets: cam, scale: 1.25, alpha: 0.45, duration: 180, yoyo: true });
        this.hud.addXP(3);
      });
    }

    const padX = 1800, padY = GY - 320;
    const padW = 240, padH = 180;
    this.add.rectangle(padX, padY, padW + 20, padH + 50, 0x1a0a2e, 0.95).setStrokeStyle(2, 0xff00ff);
    this.add.text(padX, padY - padH / 2 - 15, 'PIXEL PAD', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      color: '#ff00ff'
    }).setOrigin(0.5);

    const gridSize = 10;
    const cellSize = Math.min(padW, padH) / gridSize;
    const startX = padX - (gridSize * cellSize) / 2;
    const startY = padY - (gridSize * cellSize) / 2 + 10;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = this.add.rectangle(
          startX + c * cellSize + cellSize / 2,
          startY + r * cellSize + cellSize / 2,
          cellSize - 1,
          cellSize - 1,
          0x222244
        ).setInteractive().setDepth(20);
        cell.on('pointerdown', () => {
          playSound('select');
          cell.setFillStyle([0xff00ff, 0x00f5ff, 0xffd700, 0xff4444, 0x00ff88][Math.floor(Math.random() * 5)]);
        });
      }
    }

    addInfoBlock(this, 600, GY - 260, [
      'CREATIVE MEDIA',
      '',
      'Motion graphics',
      'Video editing',
      'After Effects',
      'Design + gaming'
    ], '#ff88ff');

    addInfoBlock(this, 2600, GY - 280, [
      'CERTIFICATIONS',
      '',
      'NPTEL: Intro to OS',
      'TCS iON: Career Edge',
      'Deloitte: Job Simulation',
      'Anthropic: Code in Action',
      'Anthropic: Agent Skills'
    ], '#ffd700');

    this.hud.addXP(10);
    this.hud.setPower('[E] HULK SMASH\n[1-6] SWITCH  [Q] ALL READY', { raw: true, wide: true });
  }

  update() { this.player.update(); }
}
