import * as Phaser from 'phaser';
import { setupTunnel, addPlatform, addInfoBlock, addBoxInfoBlock, addVillain } from '../utils/TunnelHelpers.js';

export class Tunnel5Scene extends Phaser.Scene {
  constructor() { super('Tunnel5'); }

  create() {
    const { ground, GY } = setupTunnel(this, {
      width: 4800, theme: 'factory', levelName: 'MACHINE FACTORY', tunnelNum: 5
    });

    for (let i = 0; i < 6; i++) {
      const gx = 300 + i * 600;
      this.add.circle(gx, 120, 30, 0x333344, 0.3).setDepth(-8);
      this.add.circle(gx, 120, 25, 0x222233, 0.5).setDepth(-8);
      const needle = this.add.rectangle(gx, 120, 2, 20, 0xff4444, 0.6).setOrigin(0.5, 1).setDepth(-7);
      this.tweens.add({ targets: needle, angle: 80, duration: 3000 + i * 500, yoyo: true, repeat: -1 });
    }

    for (let i = 0; i < 8; i++) {
      const sx = 200 + i * 500;
      const steam = this.add.circle(sx, GY - 60, 8, 0xaaaaaa, 0);
      this.tweens.add({
        targets: steam,
        y: GY - 160,
        alpha: 0.15,
        scaleX: 3,
        scaleY: 3,
        duration: 2000,
        repeat: -1,
        delay: i * 800
      });
    }

    addVillain(this, 4500, GY - 80, 5);

    const makeFloorTitle = (x, text, color) => {
      const title = this.add.text(x, GY - 60, '--- ' + text + ' ---', {
        fontFamily: '"Press Start 2P"',
        fontSize: '12px',
        color
      }).setOrigin(0.5);
      this.tweens.add({ targets: title, alpha: 0.6, duration: 1100, yoyo: true, repeat: -1 });
    };

    const f0x = 500;
    makeFloorTitle(f0x, 'ALL INDIA RADIO', '#ff4444');
    for (let i = 0; i < 3; i++) {
      this.add.image(f0x - 100 + i * 100, GY - 20, 'antenna').setScale(0.8).setAlpha(0.6);
    }
    for (let i = 0; i < 4; i++) {
      const swp = this.physics.add.image(f0x - 150 + i * 120, GY - 120, 'platform');
      swp.body.setAllowGravity(false);
      swp.body.setImmovable(true);
      this.physics.add.collider(this.player.sprite, swp);
      this.tweens.add({
        targets: swp,
        y: GY - 120 + Math.sin(i) * 30,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
    addInfoBlock(this, f0x + 300, GY - 160, [
      'ALL INDIA RADIO',
      'Student Trainee',
      'Jul 2022',
      '',
      'Observed broadcasting systems',
      'Audio transmission systems'
    ], '#ff6666');

    const f1x = 1500;
    makeFloorTitle(f1x, 'SUBROS LTD', '#ffaa00');
    for (let i = 0; i < 2; i++) {
      const conv = this.add.image(f1x - 100 + i * 200, GY - 30, 'conveyor');
      this.tweens.add({ targets: conv, x: conv.x + 16, duration: 500, yoyo: true, repeat: -1 });
    }
    addPlatform(this, f1x - 100, GY - 140, 'platform', ground);
    addPlatform(this, f1x + 100, GY - 200, 'platform', ground);
    addPlatform(this, f1x + 300, GY - 260, 'platform', ground);

    this.time.addEvent({
      delay: 2500,
      loop: true,
      callback: () => {
        const box = this.add.rectangle(f1x + Math.random() * 200 - 100, GY - 400, 24, 24, 0xffaa00, 0.4);
        this.tweens.add({ targets: box, y: GY - 50, duration: 2000, onComplete: () => box.destroy() });
      }
    });

    addInfoBlock(this, f1x + 400, GY - 200, [
      'SUBROS LTD',
      'QA Tester | Jan 2023',
      '',
      'Automotive AC hoses testing',
      'Manufacturing quality control',
      'Functional & safety compliance'
    ], '#ffcc44');

    const f2x = 2500;
    makeFloorTitle(f2x, 'UCN CABLE NETWORK', '#00f5ff');
    for (let i = 0; i < 8; i++) {
      const cx = f2x - 200 + i * 60;
      const cy1 = GY - 300 + Math.random() * 100;
      const cy2 = cy1 + 50 + Math.random() * 100;
      this.add.rectangle(cx, cy1, 2, cy2 - cy1, 0x00f5ff, 0.15).setDepth(-5);
      this.add.circle(cx, cy1, 3, 0x00f5ff, 0.2).setDepth(-5);
    }

    addPlatform(this, f2x - 150, GY - 140, 'platform', ground);
    addPlatform(this, f2x, GY - 220, 'platform', ground);
    addPlatform(this, f2x + 150, GY - 300, 'platform', ground);

    addInfoBlock(this, f2x + 400, GY - 340, [
      'UCN CABLE NETWORK',
      'Intern | Jan-Apr 2024',
      '',
      'Maintained network infrastructure',
      'Optimized signal distribution',
      'Rapid outage resolution'
    ], '#00f5ff');

    const f3x = 3600;
    makeFloorTitle(f3x, 'SB JAIN COLLEGE', '#88ccff');
    
    // Draw college building outline
    for (let i = 0; i < 4; i++) {
      this.add.rectangle(f3x - 120 + i * 80, GY - 70, 16, 100, 0x88ccff, 0.2).setStrokeStyle(1, 0x88ccff, 0.6).setDepth(-5);
    }
    this.add.triangle(f3x, GY - 160, 0, 80, 160, 0, 320, 80, 0x88ccff, 0.2).setStrokeStyle(2, 0x88ccff, 0.8).setDepth(-5);
    this.add.rectangle(f3x, GY - 15, 340, 30, 0x88ccff, 0.2).setStrokeStyle(2, 0x88ccff, 0.8).setDepth(-5);

    // Floating particles animation
    for (let i = 0; i < 6; i++) {
      const particle = this.add.rectangle(f3x - 150 + Math.random() * 300, GY - 120 + Math.random() * 80, 8, 8, 0x88ccff, 0.4);
      this.tweens.add({
        targets: particle,
        y: '-=60',
        alpha: 0,
        angle: 180,
        duration: 2000 + Math.random() * 1000,
        repeat: -1
      });
    }

    addPlatform(this, f3x - 150, GY - 140, 'platform', ground);
    addPlatform(this, f3x + 150, GY - 220, 'platform', ground);
    
    addBoxInfoBlock(this, f3x + 350, GY - 220, [
      'Technical Head',
      'FEETA Forum',
      'SB Jain College',
      '',
      '2025 - 2026',
      '',
      'Team Leadership',
      '& Coordination'
    ], '#88ccff');

    this.hud.addXP(15);
    this.hud.setPower('CAPTAIN AMERICA SHIELD');
  }

  update() { this.player.update(); }
}
