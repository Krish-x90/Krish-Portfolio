import * as Phaser from 'phaser';
import { setupTunnel, addPlatform, addInfoBlock, addVillain, addObstacles } from '../utils/TunnelHelpers.js';
import { RESUME } from '../data/resumeData.js';

export class Tunnel2Scene extends Phaser.Scene {
  constructor() { super('Tunnel2'); }

  create() {
    const { ground, GY, W } = setupTunnel(this, {
      width: 3600, theme: 'library', levelName: 'CYBER LIBRARY', tunnelNum: 2
    });

    // Background gears
    for (let i = 0; i < 8; i++) {
      const gear = this.add.image(200 + i * 400, GY - 300 + Math.random() * 200, 'gear').setScale(2 + Math.random() * 2).setAlpha(0.1).setDepth(-8);
      this.tweens.add({ targets: gear, rotation: Math.PI * 2, duration: 8000 + i * 2000, repeat: -1 });
    }

    // Stained glass
    const glassColors = [0xffd700, 0xff4444, 0x4488ff, 0x44ff88];
    for (let i = 0; i < 6; i++) {
      this.add.rectangle(300 + i * 500, 100 + Math.random() * 100, 80, 120, glassColors[i % 4], 0.04).setDepth(-9);
    }

    // Book platforms
    const bookPos = [[300, GY-100], [500, GY-160], [750, GY-220], [1000, GY-280], [1200, GY-200], [1450, GY-140], [1700, GY-180], [1950, GY-240], [2200, GY-300], [2500, GY-200], [2800, GY-160]];
    bookPos.forEach(([x, y]) => addPlatform(this, x, y, 'book_platform', ground));

    // ULTRON villain - Single Boss
    addVillain(this, 3200, GY - 80, 2);

    // Education seals - BIGGER text
    RESUME.education.forEach((edu, i) => {
      const sx = 800 + i * 800;
      const sy = GY - 320 - i * 30;

      const seal = this.add.circle(sx, sy, 28, 0xffd700, 0.3);
      this.add.text(sx, sy, edu.year, {
        fontFamily: '"Press Start 2P"', fontSize: '12px', color: '#ffd700'
      }).setOrigin(0.5);
      this.tweens.add({ targets: seal, alpha: 0.6, scaleX: 1.2, scaleY: 1.2, duration: 1500, yoyo: true, repeat: -1 });

      // Detail screen - BIGGER
      const detail = this.add.container(sx, sy - 90).setAlpha(1);
      const dbg = this.add.rectangle(0, 0, 280, 90, 0x1a0f0a, 0.95).setStrokeStyle(1, 0xffd700);
      const dtxt = this.add.text(0, 0, edu.school + '\n' + edu.degree + '\n' + edu.year, {
        fontFamily: '"Press Start 2P"', fontSize: '8px', color: '#ffd700',
        align: 'center', lineSpacing: 8
      }).setOrigin(0.5);
      detail.add([dbg, dtxt]);
    });

    this.hud.addXP(10);
    this.hud.setPower('IRON MAN REPULSOR');
  }

  update() { this.player.update(); }
}
