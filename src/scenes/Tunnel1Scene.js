import * as Phaser from 'phaser';
import { setupTunnel, addPlatform, addInfoBlock, addBoxInfoBlock, addVillain, addObstacles } from '../utils/TunnelHelpers.js';
import { RESUME } from '../data/resumeData.js';

export class Tunnel1Scene extends Phaser.Scene {
  constructor() { super('Tunnel1'); }

  create() {
    const { ground, GY, W } = setupTunnel(this, {
      width: 3200, theme: 'grove', levelName: 'TUTORIAL GROVE', tunnelNum: 1
    });

    // Bioluminescent mushrooms
    for (let i = 0; i < 12; i++) {
      const mx = 200 + i * 240 + Math.random() * 80;
      const mScale = 1.5 + Math.random() * 2;
      this.add.image(mx, GY - 10, 'mushroom_bg').setScale(mScale).setDepth(-5);
      const glow = this.add.circle(mx, GY - 30 * mScale, 30 * mScale, 0xcc44ff, 0.06);
      this.tweens.add({ targets: glow, alpha: 0.12, duration: 2000 + Math.random() * 1000, yoyo: true, repeat: -1 });
    }

    // Light particles
    for (let i = 0; i < 25; i++) {
      const p = this.add.circle(Math.random() * W, Math.random() * 500, 2, 0x88ff88, 0.15);
      this.tweens.add({ targets: p, y: p.y - 40, x: p.x + (Math.random() - 0.5) * 30, alpha: 0, duration: 4000 + Math.random() * 3000, repeat: -1 });
    }

    // LOKI villain (Marvel) - Single boss
    addVillain(this, 2800, GY - 80, 1);

    // Platforms
    addPlatform(this, 350, GY - 120, 'platform', ground);
    addPlatform(this, 600, GY - 180, 'platform', ground);
    addPlatform(this, 900, GY - 140, 'platform', ground);
    addPlatform(this, 1500, GY - 160, 'platform', ground);

    // Stone tablet 1 - BIGGER text
    addBoxInfoBlock(this, 500, GY - 260, [
      'KRISH SARODE',
      '',
      'Nagpur, Maharashtra',
      'India',
      '',
      'Electronics & Communication',
      'Engineer',
    ], '#88ffaa');

    // Stone tablet 2 - BIGGER text
    addBoxInfoBlock(this, 1200, GY - 180, [
      'OBJECTIVE',
      '',
      'Full-stack Developer',
      'Innovator & Builder',
      '',
      'Building innovative',
      'software solutions',
    ], '#88ffaa');

    // Contact billboard - BIGGER text, active links removed (no portfolio)
    const bbx = W - 350;
    this.add.rectangle(bbx, GY - 200, 320, 200, 0x0a1a0a, 0.9).setStrokeStyle(2, 0x44ff88);
    this.add.text(bbx, GY - 280, '[ CONTACT ]', {
      fontFamily: '"Press Start 2P"', fontSize: '14px', color: '#44ff88'
    }).setOrigin(0.5);

    this.add.text(bbx, GY - 210, 'krishsarode18@gmail.com\n\nLinkedIn | GitHub\nHackerRank', {
      fontFamily: '"Press Start 2P"', fontSize: '9px', color: '#aaffcc',
      align: 'center', lineSpacing: 8
    }).setOrigin(0.5);

    this.hud.addXP(10);
    this.hud.setPower('THOR LIGHTNING');
  }

  update() { this.player.update(); }
}
