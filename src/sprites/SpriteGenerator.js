// Generates all game textures procedurally using Phaser graphics
export function generateTextures(scene) {
  const g = scene.make.graphics({ add: false });

  // --- PLAYER SPRITE (idle) ---
  createPlayerFrame(scene, 'player_idle_1', 0);
  createPlayerFrame(scene, 'player_idle_2', 1);
  createPlayerFrame(scene, 'player_run_1', 2);
  createPlayerFrame(scene, 'player_run_2', 3);
  createPlayerFrame(scene, 'player_run_3', 4);
  createPlayerFrame(scene, 'player_run_4', 5);
  createPlayerFrame(scene, 'player_jump', 6);
  createPlayerFrame(scene, 'player_fall', 7);

  // --- GROUND TILE ---
  g.clear();
  g.fillStyle(0x1a1a2e); g.fillRect(0, 0, 48, 48);
  g.fillStyle(0x16213e); g.fillRect(2, 2, 44, 44);
  g.lineStyle(1, 0x00f5ff, 0.3);
  g.strokeRect(0, 0, 48, 48);
  g.generateTexture('ground', 48, 48);

  // --- NEON PIPE ---
  g.clear();
  g.fillStyle(0x0d1b2a); g.fillRect(0, 0, 64, 96);
  g.fillStyle(0x1b2838); g.fillRect(4, 0, 56, 92);
  g.lineStyle(2, 0x00f5ff, 0.8);
  g.strokeRect(2, 0, 60, 96);
  g.fillStyle(0x00f5ff); g.fillRect(0, 0, 64, 8);
  g.generateTexture('pipe', 64, 96);

  // --- PIPE GLOW (sign above pipe) ---
  g.clear();
  g.fillStyle(0x0a0a1a); g.fillRect(0, 0, 80, 28);
  g.lineStyle(1, 0x00f5ff, 0.6); g.strokeRect(0, 0, 80, 28);
  g.generateTexture('pipe_sign', 80, 28);

  // --- QUESTION BLOCK ---
  g.clear();
  g.fillStyle(0x2a1a4e); g.fillRect(0, 0, 48, 48);
  g.lineStyle(2, 0xff00ff, 0.8); g.strokeRect(1, 1, 46, 46);
  g.fillStyle(0xff00ff);
  g.fillRect(18, 10, 12, 4); g.fillRect(26, 14, 4, 8);
  g.fillRect(18, 22, 12, 4); g.fillRect(18, 26, 4, 8);
  g.fillRect(18, 38, 12, 4);
  g.generateTexture('question_block', 48, 48);

  // --- COIN / COLLECTIBLE ---
  g.clear();
  g.fillStyle(0xffd700); g.fillCircle(12, 12, 10);
  g.fillStyle(0xffed4a); g.fillCircle(10, 10, 6);
  g.generateTexture('coin', 24, 24);

  // --- SKILL CHIP ---
  g.clear();
  g.fillStyle(0x00ff88); g.fillRect(0, 0, 32, 32);
  g.fillStyle(0x003322); g.fillRect(4, 4, 24, 24);
  g.fillStyle(0x00ff88);
  g.fillRect(8, 8, 6, 6); g.fillRect(18, 8, 6, 6);
  g.fillRect(8, 18, 6, 6); g.fillRect(18, 18, 6, 6);
  g.generateTexture('skill_chip', 32, 32);

  // --- PLATFORM (floating) ---
  g.clear();
  g.fillStyle(0x16213e); g.fillRect(0, 0, 128, 24);
  g.lineStyle(1, 0x00f5ff, 0.5); g.strokeRect(0, 0, 128, 24);
  g.fillStyle(0x00f5ff); g.fillRect(0, 0, 128, 3);
  g.generateTexture('platform', 128, 24);

  // --- BOOK PLATFORM ---
  g.clear();
  g.fillStyle(0x8b4513); g.fillRect(0, 0, 120, 20);
  g.fillStyle(0xdeb887); g.fillRect(4, 2, 112, 16);
  g.lineStyle(1, 0xffd700, 0.4); g.strokeRect(2, 1, 116, 18);
  g.generateTexture('book_platform', 120, 20);

  // --- MUSHROOM (bioluminescent) ---
  g.clear();
  g.fillStyle(0x8844aa); g.fillRect(14, 20, 8, 16);
  g.fillStyle(0xcc44ff); g.fillCircle(18, 16, 16);
  g.fillStyle(0xff66ff); g.fillCircle(18, 14, 10);
  g.generateTexture('mushroom_bg', 36, 36);

  // --- ENEMY (flying inkwell) ---
  g.clear();
  g.fillStyle(0x220033); g.fillCircle(16, 16, 14);
  g.fillStyle(0x6600aa); g.fillCircle(16, 14, 10);
  g.fillStyle(0xff00ff); g.fillCircle(12, 12, 3); g.fillCircle(20, 12, 3);
  g.fillStyle(0xffffff); g.fillCircle(12, 12, 1); g.fillCircle(20, 12, 1);
  g.generateTexture('enemy_inkwell', 32, 32);

  // --- CONVEYOR BELT ---
  g.clear();
  g.fillStyle(0x333344); g.fillRect(0, 0, 128, 16);
  g.fillStyle(0xffaa00);
  for (let i = 0; i < 8; i++) g.fillRect(i * 16 + 2, 4, 8, 8);
  g.generateTexture('conveyor', 128, 16);

  // --- GEAR ---
  g.clear();
  g.fillStyle(0x555566); g.fillCircle(24, 24, 22);
  g.fillStyle(0x333344); g.fillCircle(24, 24, 14);
  g.fillStyle(0x777788); g.fillCircle(24, 24, 6);
  g.generateTexture('gear', 48, 48);

  // --- STONE TABLET ---
  g.clear();
  g.fillStyle(0x444455); g.fillRect(0, 0, 200, 120);
  g.fillStyle(0x555566); g.fillRect(4, 4, 192, 112);
  g.lineStyle(2, 0x00f5ff, 0.3); g.strokeRect(2, 2, 196, 116);
  g.generateTexture('tablet', 200, 120);

  // --- VINYL RECORD ---
  g.clear();
  g.fillStyle(0x111111); g.fillCircle(32, 32, 30);
  g.lineStyle(1, 0x333333, 0.5);
  for (let r = 8; r < 28; r += 4) g.strokeCircle(32, 32, r);
  g.fillStyle(0xff0044); g.fillCircle(32, 32, 6);
  g.generateTexture('vinyl', 64, 64);

  // --- TV SCREEN ---
  g.clear();
  g.fillStyle(0x222233); g.fillRect(0, 0, 64, 48);
  g.fillStyle(0x0066ff); g.fillRect(4, 4, 56, 40);
  g.lineStyle(1, 0x00f5ff, 0.6); g.strokeRect(0, 0, 64, 48);
  g.generateTexture('tv_screen', 64, 48);

  // --- ANTENNA ---
  g.clear();
  g.fillStyle(0x888899); g.fillRect(14, 0, 4, 64);
  g.fillStyle(0xff4444); g.fillCircle(16, 4, 6);
  g.generateTexture('antenna', 32, 64);

  // --- ARCADE CABINET ---
  g.clear();
  g.fillStyle(0x1a0a2e); g.fillRect(0, 0, 48, 80);
  g.fillStyle(0x00ff88); g.fillRect(6, 8, 36, 28);
  g.fillStyle(0x0a0a1a); g.fillRect(10, 12, 28, 20);
  g.lineStyle(1, 0xff00ff, 0.6); g.strokeRect(0, 0, 48, 80);
  g.fillStyle(0xff0044); g.fillCircle(18, 50, 4);
  g.fillStyle(0x00f5ff); g.fillCircle(30, 50, 4);
  g.generateTexture('arcade_cabinet', 48, 80);

  // --- EXIT GATE ---
  g.clear();
  g.fillStyle(0x1a1a2e); g.fillRect(0, 0, 64, 96);
  g.lineStyle(3, 0x00ff88, 0.8); g.strokeRect(2, 2, 60, 92);
  g.fillStyle(0x00ff88); g.fillRect(8, 8, 48, 4);
  g.fillStyle(0x00ff88);
  g.fillTriangle(32, 40, 20, 60, 44, 60);
  g.fillRect(28, 60, 8, 16);
  g.generateTexture('exit_gate', 64, 96);

  // --- PARTICLE ---
  g.clear();
  g.fillStyle(0xffffff); g.fillRect(0, 0, 4, 4);
  g.generateTexture('particle', 4, 4);

  // --- CITADEL ---
  g.clear();
  g.fillStyle(0x0d1b2a); g.fillRect(0, 0, 256, 320);
  g.lineStyle(2, 0x00f5ff, 0.8); g.strokeRect(2, 2, 252, 316);
  g.fillStyle(0x00f5ff); g.fillRect(60, 20, 136, 8);
  for (let i = 0; i < 5; i++) {
    g.fillStyle(0x162a3e);
    g.fillRect(20 + i * 46, 60 + Math.sin(i) * 20, 36, 50);
    g.lineStyle(1, 0x00f5ff, 0.4);
    g.strokeRect(20 + i * 46, 60 + Math.sin(i) * 20, 36, 50);
  }
  g.fillStyle(0xff00ff); g.fillRect(104, 260, 48, 40);
  g.generateTexture('citadel', 256, 320);

  // --- MOBILE CONTROLS ---
  g.clear();
  g.fillStyle(0xffffff); g.setAlpha(0.15);
  g.fillCircle(40, 40, 38);
  g.setAlpha(1);
  g.generateTexture('joystick_base', 80, 80);

  g.clear();
  g.fillStyle(0x00f5ff); g.setAlpha(0.4);
  g.fillCircle(20, 20, 18);
  g.setAlpha(1);
  g.generateTexture('joystick_knob', 40, 40);

  g.clear();
  g.fillStyle(0x00f5ff); g.setAlpha(0.3);
  g.fillCircle(30, 30, 28);
  g.setAlpha(1);
  g.fillStyle(0xffffff); g.setAlpha(0.5);
  g.fillTriangle(30, 14, 18, 34, 42, 34);
  g.setAlpha(1);
  g.generateTexture('jump_btn', 60, 60);

  g.clear();
  g.fillStyle(0xff8800); g.setAlpha(0.3);
  g.fillCircle(24, 24, 22);
  g.setAlpha(1);
  g.fillStyle(0xffffff); g.setAlpha(0.5);
  g.fillTriangle(24, 18, 24, 30, 14, 24);
  g.fillTriangle(24, 42, 24, 30, 34, 36);
  g.setAlpha(1);
  g.generateTexture('down_btn', 48, 48);

  g.destroy();
}

function createPlayerFrame(scene, key, frameIndex) {
  const g = scene.make.graphics({ add: false });
  const w = 40, h = 56;

  // Shadow / base
  g.fillStyle(0x0a0a14);
  g.fillRect(0, 0, w, h);

  // Body
  g.fillStyle(0x1a1a2e); g.fillRect(10, 20, 20, 22); // torso
  g.fillStyle(0x111122); g.fillRect(8, 20, 4, 20);    // left jacket
  g.fillStyle(0x111122); g.fillRect(28, 20, 4, 20);   // right jacket

  // Green tie
  g.fillStyle(0x44ff44); g.fillRect(18, 22, 4, 16);
  g.fillStyle(0x33dd33); g.fillRect(17, 22, 6, 3);

  // Head
  g.fillStyle(0xf0c8a0); g.fillRect(12, 4, 16, 16);   // face
  g.fillStyle(0x222233);                                // hair
  g.fillRect(10, 0, 20, 8);
  g.fillRect(8, 2, 4, 6);
  g.fillRect(28, 2, 4, 8);
  g.fillRect(12, 0, 4, 2); // spiky bits
  g.fillRect(20, -2, 4, 4);
  g.fillRect(26, 0, 4, 3);

  // Glasses
  g.fillStyle(0x333355);
  g.fillRect(13, 10, 6, 4); g.fillRect(21, 10, 6, 4);
  g.fillStyle(0x88ccff);
  g.fillRect(14, 11, 4, 2); g.fillRect(22, 11, 4, 2);
  g.fillStyle(0x333355); g.fillRect(19, 11, 2, 1);

  // Legs based on frame
  if (frameIndex <= 1) {
    // Idle
    g.fillStyle(0x222244);
    g.fillRect(12, 42, 7, 12); g.fillRect(21, 42, 7, 12);
    g.fillStyle(0x111133);
    g.fillRect(12, 52, 8, 4); g.fillRect(21, 52, 8, 4);
  } else if (frameIndex <= 5) {
    // Running frames
    const offsets = [[0,4],[4,0],[2,2],[0,4]];
    const off = offsets[frameIndex - 2];
    g.fillStyle(0x222244);
    g.fillRect(12, 42 + off[0], 7, 12 - off[0]);
    g.fillRect(21, 42 + off[1], 7, 12 - off[1]);
    g.fillStyle(0x111133);
    g.fillRect(12, 52, 8, 4); g.fillRect(21, 52, 8, 4);
  } else if (frameIndex === 6) {
    // Jump
    g.fillStyle(0x222244);
    g.fillRect(10, 40, 8, 8); g.fillRect(22, 40, 8, 8);
    g.fillStyle(0x111133);
    g.fillRect(10, 46, 8, 4); g.fillRect(22, 46, 8, 4);
  } else {
    // Fall
    g.fillStyle(0x222244);
    g.fillRect(12, 42, 7, 14); g.fillRect(21, 42, 7, 14);
  }

  // Arms
  g.fillStyle(0xf0c8a0);
  if (frameIndex === 6) {
    g.fillRect(4, 16, 6, 4); g.fillRect(30, 16, 6, 4);
  } else {
    g.fillRect(4, 24, 6, 4); g.fillRect(30, 24, 6, 4);
  }

  g.generateTexture(key, w, h);
  g.destroy();
}
