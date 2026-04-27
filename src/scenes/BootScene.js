import * as Phaser from 'phaser';
import { generateTextures } from '../sprites/SpriteGenerator.js';
import { generateVillains } from '../sprites/VillainGenerator.js';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    this.load.image('krish_raw', '/assets/krish.png');
  }

  create() {
    generateTextures(this);
    generateVillains(this);
    this.createCharacterFrames();

    const cx = this.cameras.main.centerX;
    const cy = this.cameras.main.centerY;

    this.add.text(cx, cy - 40, 'LOADING...', {
      fontFamily: '"Press Start 2P"', fontSize: '20px', color: '#00f5ff'
    }).setOrigin(0.5);

    const bar = this.add.rectangle(cx - 100, cy + 10, 0, 16, 0x00ff88).setOrigin(0, 0.5);
    this.tweens.add({
      targets: bar, width: 200, duration: 800, ease: 'Power2',
      onComplete: () => { this.scene.start('Title'); }
    });
  }

  createCharacterFrames() {
    const source = this.textures.get('krish_raw').getSourceImage();
    const sw = source.width;
    const sh = source.height;

    // Spritesheet is 4 columns x 2 rows = 8 frames
    const cols = 4, rows = 2;
    const cellW = sw / cols;
    const cellH = sh / rows;

    const frameKeys = [
      'player_idle_1', 'player_idle_2',
      'player_run_1', 'player_run_2',
      'player_run_3', 'player_run_4',
      'player_jump', 'player_fall'
    ];

    frameKeys.forEach((key, i) => {
      if (this.textures.exists(key)) {
        this.textures.remove(key);
      }

      const col = i % cols;
      const row = Math.floor(i / cols);

      const fw = 80, fh = 100;
      const canvas = document.createElement('canvas');
      canvas.width = fw;
      canvas.height = fh;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, fw, fh);

      // Extract this frame from the spritesheet
      const srcX = col * cellW;
      const srcY = row * cellH;

      // Scale to fit frame
      const scale = Math.min(fw / cellW, fh / cellH) * 0.95;
      const drawW = cellW * scale;
      const drawH = cellH * scale;
      const dx = (fw - drawW) / 2;
      const dy = (fh - drawH) / 2;

      ctx.drawImage(source, srcX, srcY, cellW, cellH, dx, dy, drawW, drawH);

      // Chroma key - remove green background (aggressive to catch edges)
      const imageData = ctx.getImageData(0, 0, fw, fh);
      const data = imageData.data;
      for (let p = 0; p < data.length; p += 4) {
        const r = data[p], g = data[p + 1], b = data[p + 2];
        // Pure green (#00FF00) and variants
        if (g > 100 && g > r * 1.2 && g > b * 1.2) {
          // Calculate how "green" this pixel is
          const greenness = g / Math.max(1, (r + b) / 2);
          if (greenness > 1.5) {
            data[p + 3] = 0; // Fully transparent
          } else if (greenness > 1.2) {
            data[p + 3] = Math.floor(data[p + 3] * 0.3); // Semi-transparent edge
          }
        }
        // Bright green catch-all
        if (g > 180 && r < 100 && b < 100) {
          data[p + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);

      this.textures.addCanvas(key, canvas);
    });
  }
}
