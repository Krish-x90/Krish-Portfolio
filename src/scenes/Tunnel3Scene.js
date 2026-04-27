import * as Phaser from 'phaser';
import { setupTunnel, addPlatform, addSkillPanel, addVillain, addObstacles } from '../utils/TunnelHelpers.js';
import { RESUME } from '../data/resumeData.js';

export class Tunnel3Scene extends Phaser.Scene {
  constructor() { super('Tunnel3'); }

  create() {
    const { ground, GY, W } = setupTunnel(this, {
      width: 4000, theme: 'circuit', levelName: 'CYBERNETIC GRID', tunnelNum: 3
    });

    // Circuit pattern walls
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * W, y = Math.random() * (GY - 100);
      const len = 50 + Math.random() * 150;
      const h = Math.random() > 0.5;
      this.add.rectangle(x, y, h ? len : 2, h ? 2 : len, 0x00f5ff, 0.08).setDepth(-6);
      this.add.circle(x, y, 3, 0x00f5ff, 0.12).setDepth(-6);
    }

    // Binary code scrolling
    for (let i = 0; i < 10; i++) {
      const bStr = Array.from({ length: 30 }, () => Math.random() > 0.5 ? '1' : '0').join(' ');
      const bt = this.add.text(Math.random() * W, 50 + i * 60, bStr, {
        fontFamily: 'monospace', fontSize: '10px', color: '#0033aa'
      }).setAlpha(0.15).setDepth(-7);
      this.tweens.add({ targets: bt, x: bt.x - 200, duration: 10000 + i * 2000, repeat: -1 });
    }

    // Platforms
    const pp = [[350,GY-100],[550,GY-180],[800,GY-130],[1100,GY-200],[1400,GY-150],[1700,GY-220],[2000,GY-160],[2300,GY-200],[2600,GY-140],[2900,GY-180],[3200,GY-220]];
    pp.forEach(([x, y]) => addPlatform(this, x, y, 'platform', ground));

    // MYSTERIO villain - Single Boss
    addVillain(this, 3600, GY - 80, 3);

    this.hud.setSkillLoadout(RESUME.skills.projectBased, { title: 'SKILLS FROM PROJECTS', limit: 10 });

    RESUME.skills.categories.forEach((category, i) => {
      const x = 430 + i * 730;
      const y = GY - 335 + (i % 2) * 54;
      const colors = ['#00ff88', '#00f5ff', '#ffd700', '#ff8800', '#ff66cc'];
      addSkillPanel(this, x, y, category.title, category.items, colors[i % colors.length]);
    });

    // Skill artifacts are visible immediately. Touching them only gives a small XP flourish.
    const items = [
      { x: 500, name: 'AI CHIP', color: 0x00ff88 },
      { x: 1500, name: 'LINE BOT', color: 0xff8800 },
      { x: 2500, name: 'FILM REEL', color: 0xff00ff }
    ];
    items.forEach(item => {
      const chip = this.add.image(item.x, GY - 300, 'skill_chip').setTint(item.color).setScale(1.5);
      this.tweens.add({ targets: chip, y: chip.y - 10, duration: 1000, yoyo: true, repeat: -1 });
      this.add.text(item.x, GY - 245, item.name, {
        fontFamily: '"Press Start 2P"', fontSize: '9px', color: '#' + item.color.toString(16).padStart(6, '0'),
        backgroundColor: '#0a0a2ecc', padding: { x: 8, y: 5 }
      }).setOrigin(0.5);
      const zone = this.add.zone(item.x, GY - 300, 40, 40);
      this.physics.add.existing(zone, true);
      let c = false;
      this.physics.add.overlap(this.player.sprite, zone, () => {
        if (c) return; c = true;
        this.tweens.add({ targets: chip, scale: 2, alpha: 0.45, duration: 300, yoyo: true });
        this.hud.addXP(3);
      });
    });

    this.hud.addXP(10);
    this.hud.setPower('SPIDER-MAN WEB');
  }

  update() { this.player.update(); }
}
