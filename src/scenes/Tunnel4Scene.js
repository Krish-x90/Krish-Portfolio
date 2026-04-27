import * as Phaser from 'phaser';
import { setupTunnel, addPlatform, addBackgroundInfo, addVillain } from '../utils/TunnelHelpers.js';

export class Tunnel4Scene extends Phaser.Scene {
  constructor() { super('Tunnel4'); }

  create() {
    const { ground, GY } = setupTunnel(this, {
      width: 5200, theme: 'workshop', levelName: 'MAKER WORKSHOP', tunnelNum: 4
    });

    for (let i = 0; i < 6; i++) {
      const rx = 300 + i * 800;
      const arm = this.add.graphics().setDepth(-5);
      arm.fillStyle(0x555566);
      arm.fillRect(rx, GY - 200, 8, 80);
      arm.fillRect(rx - 20, GY - 210, 48, 12);
      arm.fillStyle(0xff8800, 0.3);
      arm.fillCircle(rx + 4, GY - 216, 6);
    }

    addVillain(this, 5000, GY - 80, 4);

    const makeTitle = (x, label, color) => {
      const title = this.add.text(x, GY - 360, '[ ' + label + ' ]', {
        fontFamily: '"Press Start 2P"',
        fontSize: '12px',
        color
      }).setOrigin(0.5);
      this.tweens.add({ targets: title, alpha: 0.55, duration: 900, yoyo: true, repeat: -1 });
      return title;
    };

    const z1 = 500;
    makeTitle(z1, 'AUTOMATED TRADING BOT', '#00ff88');
    addPlatform(this, z1 - 100, GY - 120, 'platform', ground);
    addPlatform(this, z1 + 100, GY - 200, 'platform', ground);
    addBackgroundInfo(this, z1 + 150, GY - 200, [
      'AUTOMATED TRADING BOT', '',
      'Python + JavaScript',
      'Alpaca + Coinbase API', '',
      'EMA, RSI, MACD',
      'Politician Follow', '',
      'Realtime dashboard',
      'Risk management'
    ], '#00ff88');

    const z2 = 1500;
    makeTitle(z2, 'LUMINA TOUR', '#44aaff');
    addPlatform(this, z2 - 100, GY - 120, 'platform', ground);
    addPlatform(this, z2 + 100, GY - 200, 'platform', ground);
    addBackgroundInfo(this, z2 + 150, GY - 200, [
      'LUMINA TOUR', '',
      'React + TypeScript',
      'Google Gemini API', '',
      'AI landmark explorer',
      'Audio guides',
      'Historical timelines',
      'Image search'
    ], '#44aaff');

    const z3 = 2500;
    makeTitle(z3, 'MICKY MUSIC', '#ff4488');
    for (let i = 0; i < 3; i++) {
      const vx = z3 - 100 + i * 150;
      const vinyl = this.add.image(vx, GY - 120 - i * 60, 'vinyl').setScale(1.5).setAlpha(0.6).setDepth(-5);
      this.tweens.add({ targets: vinyl, rotation: Math.PI * 2, duration: 4000, repeat: -1 });
    }
    addBackgroundInfo(this, z3 + 150, GY - 200, [
      'MICKY MUSIC', '',
      'React + Django',
      'Firebase + JioSaavn',
      'Full-stack streaming', '',
      '[ LIVE ]'
    ], '#ff4488');

    const z4 = 3500;
    makeTitle(z4, 'POTATO TV', '#4488ff');
    for (let i = 0; i < 3; i++) {
      this.add.image(z4 - 100 + i * 120, GY - 200 - i * 40, 'tv_screen').setScale(1.5);
    }
    addBackgroundInfo(this, z4 + 150, GY - 200, [
      'POTATO TV', '',
      'React + Node.js',
      'MongoDB',
      'Auth + watchlists',
      'Anime streaming', '',
      '[ LIVE ]'
    ], '#4488ff');

    const z5 = 4200;
    makeTitle(z5, 'QUADCOPTER', '#00ff88');
    addPlatform(this, z5 - 100, GY - 150, 'platform', ground);
    addPlatform(this, z5 + 50, GY - 260, 'platform', ground);
    addBackgroundInfo(this, z5 + 150, GY - 250, [
      'QUADCOPTER', '',
      'Arduino controller',
      'Custom drone build',
      'C++ flight logic'
    ], '#00ff88');

    const z6 = 4800;
    makeTitle(z6, 'PID BOT', '#ffaa00');
    for (let i = 0; i < 3; i++) {
      const mp = this.physics.add.image(z6 - 100 + i * 200, GY - 150, 'platform');
      mp.body.setAllowGravity(false);
      mp.body.setImmovable(true);
      this.physics.add.collider(this.player.sprite, mp);
      this.tweens.add({
        targets: mp,
        x: mp.x + 80,
        duration: 1500 + i * 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
    addBackgroundInfo(this, z6 + 150, GY - 250, [
      'PID LINE BOT', '',
      'Teensy 4.1',
      'High speed motor',
      'Embedded C',
      'Fast control loop'
    ], '#ffaa00');

    this.hud.addXP(10);
    this.hud.setPower('BLACK PANTHER SLASH');
  }

  update() { this.player.update(); }
}
