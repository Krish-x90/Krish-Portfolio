import * as Phaser from 'phaser';

// Helper: build multi-layer parallax background
export function createParallax(scene, layers, worldWidth) {
  const result = [];
  layers.forEach((layer, i) => {
    const depth = -10 + i;
    const scrollFactor = 0.1 + i * 0.15;
    const tilesNeeded = Math.ceil(worldWidth / layer.width) + 2;

    for (let t = 0; t < tilesNeeded; t++) {
      const img = scene.add.rectangle(
        t * layer.width, layer.y,
        layer.width, layer.height,
        layer.color, layer.alpha || 1
      ).setOrigin(0, 1).setScrollFactor(scrollFactor, 0).setDepth(depth);
      result.push(img);
    }
  });
  return result;
}

// Draw city skyline as parallax background
export function createCitySkyline(scene, worldWidth) {
  const cam = scene.cameras.main;
  const h = cam.height;

  // Deep background - gradient sky
  for (let i = 0; i < 20; i++) {
    const color = Phaser.Display.Color.Interpolate.ColorWithColor(
      new Phaser.Display.Color(10, 10, 30),
      new Phaser.Display.Color(40, 20, 60),
      20, i
    );
    const hex = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
    scene.add.rectangle(0, i * (h / 20), worldWidth, h / 20 + 1, hex)
      .setOrigin(0, 0).setScrollFactor(0).setDepth(-20);
  }

  // Stars
  for (let i = 0; i < 80; i++) {
    const star = scene.add.circle(
      Math.random() * 1280, Math.random() * h * 0.6,
      Math.random() * 2 + 0.5, 0xffffff, Math.random() * 0.6 + 0.2
    ).setScrollFactor(0.02).setDepth(-19);
    scene.tweens.add({
      targets: star, alpha: 0.1, duration: 1000 + Math.random() * 2000,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });
  }

  // Far buildings
  for (let i = 0; i < Math.ceil(worldWidth / 120); i++) {
    const bh = 100 + Math.random() * 180;
    const bw = 40 + Math.random() * 60;
    const building = scene.add.rectangle(i * 120 + Math.random() * 40, h - 48, bw, bh, 0x0a0a1e)
      .setOrigin(0.5, 1).setScrollFactor(0.15).setDepth(-15);
    // Windows
    for (let wy = 0; wy < bh - 20; wy += 16) {
      for (let wx = -bw / 2 + 8; wx < bw / 2 - 8; wx += 12) {
        if (Math.random() > 0.4) {
          const wColor = Math.random() > 0.7 ? 0xffaa00 : 0x00f5ff;
          scene.add.rectangle(i * 120 + Math.random() * 40 + wx, h - 48 - bh + wy + 10, 6, 8, wColor, 0.3)
            .setOrigin(0.5, 0).setScrollFactor(0.15).setDepth(-14);
        }
      }
    }
  }

  // Closer buildings
  for (let i = 0; i < Math.ceil(worldWidth / 100); i++) {
    const bh = 60 + Math.random() * 120;
    const bw = 50 + Math.random() * 50;
    scene.add.rectangle(i * 100 + Math.random() * 30, h - 48, bw, bh, 0x111128)
      .setOrigin(0.5, 1).setScrollFactor(0.3).setDepth(-12);
  }

  // Neon signs on some buildings
  const signs = ['NEO', 'TOKYO', 'KRISH', '2027', 'CODE', 'DEV'];
  for (let i = 0; i < 6; i++) {
    const colors = [0xff0044, 0x00f5ff, 0xff00ff, 0xffd700, 0x00ff88, 0xff6600];
    scene.add.text(300 + i * 700, h - 200 - Math.random() * 100, signs[i], {
      fontFamily: '"Press Start 2P"', fontSize: '10px', color: '#' + colors[i].toString(16).padStart(6, '0')
    }).setScrollFactor(0.2).setDepth(-11).setAlpha(0.6);
  }
}

// Underground biome background
export function createBiomeBg(scene, worldWidth, theme) {
  const cam = scene.cameras.main;
  const h = cam.height;

  const themes = {
    grove: { bg: 0x0a1a0a, mid: 0x0d2a0d, accent: 0x44ff88 },
    library: { bg: 0x1a0f0a, mid: 0x2a1a0f, accent: 0xffd700 },
    circuit: { bg: 0x0a0a2e, mid: 0x0d0d3e, accent: 0x00f5ff },
    workshop: { bg: 0x1a1a1a, mid: 0x2a2222, accent: 0xff8800 },
    factory: { bg: 0x1a0a0a, mid: 0x2a1111, accent: 0xff4444 },
    arcade: { bg: 0x1a0a2e, mid: 0x2a0d3e, accent: 0xff00ff }
  };

  const t = themes[theme] || themes.circuit;

  // Solid background
  scene.add.rectangle(worldWidth / 2, h / 2, worldWidth, h, t.bg).setScrollFactor(0).setDepth(-20);

  // Midground texture lines
  for (let i = 0; i < 30; i++) {
    scene.add.rectangle(
      Math.random() * worldWidth, Math.random() * h,
      Math.random() * 200 + 50, 1, t.accent, 0.05
    ).setScrollFactor(0.1).setDepth(-18);
  }

  // Accent particles floating
  for (let i = 0; i < 40; i++) {
    const p = scene.add.circle(
      Math.random() * worldWidth, Math.random() * h,
      Math.random() * 3 + 1, t.accent, Math.random() * 0.15 + 0.05
    ).setScrollFactor(0.05 + Math.random() * 0.1).setDepth(-17);
    scene.tweens.add({
      targets: p, y: p.y - 30 - Math.random() * 50,
      duration: 3000 + Math.random() * 4000,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });
  }

  return t;
}
