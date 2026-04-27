import * as Phaser from 'phaser';

const TUNNEL_SCENES = [null, 'Tunnel1', 'Tunnel2', 'Tunnel3', 'Tunnel4', 'Tunnel5', 'Tunnel6'];

export class TunnelTransition extends Phaser.Scene {
  constructor() { super('TunnelTransition'); }

  init(data) { this.tunnelIndex = data.tunnel || 1; }

  create() {
    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    // Dark background
    this.add.rectangle(cx, cy, 1280, 720, 0x000008);

    // Data stream effect
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * 1280;
      const char = this.add.text(x, -20, String.fromCharCode(0x30A0 + Math.random() * 96), {
        fontFamily: 'monospace', fontSize: (8 + Math.random() * 12) + 'px',
        color: '#00f5ff'
      }).setAlpha(Math.random() * 0.4 + 0.1);

      this.tweens.add({
        targets: char, y: 740,
        duration: 800 + Math.random() * 1200,
        delay: Math.random() * 600,
        ease: 'Power1'
      });
    }

    // Player falling
    const player = this.add.image(cx, -60, 'player_fall').setScale(2);
    this.tweens.add({
      targets: player, y: 780, rotation: Math.PI * 4,
      duration: 1500, ease: 'Power2.easeIn'
    });

    // Level name
    const names = [null, 'TUTORIAL GROVE', 'CYBER LIBRARY', 'CYBERNETIC GRID', 'MAKER WORKSHOP', 'MACHINE FACTORY', 'NEON ARCADE'];
    const name = names[this.tunnelIndex] || 'UNKNOWN';
    const label = this.add.text(cx, cy, 'ENTERING: ' + name, {
      fontFamily: '"Press Start 2P"', fontSize: '14px', color: '#00ff88'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: label, alpha: 1, duration: 400, delay: 600,
      onComplete: () => {
        this.time.delayedCall(800, () => {
          this.cameras.main.fadeOut(400, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start(TUNNEL_SCENES[this.tunnelIndex]);
          });
        });
      }
    });
  }
}
