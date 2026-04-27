import * as Phaser from 'phaser';
import { PlayerController } from '../sprites/PlayerController.js';
import { HUD } from '../utils/HUD.js';
import { MobileControls } from '../utils/MobileControls.js';
import { createBiomeBg } from '../utils/Backgrounds.js';
import { RESUME, TUNNEL_THEMES } from '../data/resumeData.js';
import { playBossBGM, playBGM, playSound, stopBGM } from '../utils/SoundGen.js';

export function setupTunnel(scene, config) {
  scene._transitioning = false;
  const W = config.width || 3200;
  const H = 720;
  const GY = H - 48;

  scene.cameras.main.fadeIn(500);
  scene.physics.world.setBounds(0, 0, W, H);

  createBiomeBg(scene, W, config.theme);

  const ground = scene.physics.add.staticGroup();
  for (let x = 0; x < W; x += 48) {
    ground.create(x + 24, GY + 24, 'ground');
  }
  scene.groundGroup = ground;

  scene.hud = new HUD(scene);
  scene.hud.setLevel(config.levelName);

  scene.player = new PlayerController(scene, 80, GY - 100);
  scene.physics.add.collider(scene.player.sprite, ground);

  const tunnelNum = config.tunnelNum || 1;
  const theme = TUNNEL_THEMES[tunnelNum];
  if (theme) {
    scene.player.hasPower = true;
    if (tunnelNum === 6 && scene.player.enableThanosPowers) {
      scene.player.enableThanosPowers();
    } else {
      scene.player.powerType = theme.powerKey;
      scene.player.powerColor = theme.powerColor;
    }

    const powerLines = tunnelNum === 6
      ? ['[ POWER ONLINE ]', 'MULTI-POWER LOADOUT', '[1-6] SWITCH  [E] ATTACK', '[Q] ALL POWERS']
      : ['[ POWER ONLINE ]', theme.power, 'PRESS [E] TO ATTACK'];

    const powerText = scene.add.text(210, GY - 205, powerLines.join('\n'), {
      fontFamily: '"Press Start 2P"',
      fontSize: tunnelNum === 6 ? '9px' : '12px',
      color: '#' + theme.powerColor.toString(16).padStart(6, '0'),
      align: 'center',
      lineSpacing: 8,
      backgroundColor: '#0a0a2ecc',
      padding: { x: 12, y: 8 }
    }).setOrigin(0.5).setDepth(50);

    scene.tweens.add({
      targets: powerText,
      alpha: 0.72,
      y: GY - 218,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  playBGM(tunnelNum);

  scene.cameras.main.setBounds(0, 0, W, H);
  scene.cameras.main.startFollow(scene.player.sprite, true, 0.08, 0.08);

  if (config.showSkills !== false) {
    scene.hud.setSkillLoadout(RESUME.skills.featured, { title: 'PROJECT SKILLS', limit: 10 });
  }

  const exit = scene.physics.add.staticImage(W - 80, GY - 48, 'exit_gate');
  exit.setAlpha(0.35);
  exit.body.enable = false;
  scene.exitGate = exit;

  const exitText = scene.add.text(W - 80, GY - 165, 'EXIT LOCKED\nDEFEAT BOSS', {
    fontFamily: '"Press Start 2P"',
    fontSize: '10px',
    color: '#00ff88',
    align: 'center',
    lineSpacing: 6
  }).setOrigin(0.5);
  scene.exitText = exitText;

  scene.physics.add.overlap(scene.player.sprite, exit, () => {
    if (!scene._transitioning && exit.body.enable && Phaser.Input.Keyboard.JustDown(scene.player.enterKey)) {
      scene._transitioning = true;
      stopBGM();
      playSound('enter');
      scene.cameras.main.fadeOut(400);
      scene.cameras.main.once('camerafadeoutcomplete', () => {
        scene.scene.start('Overworld');
      });
    }
  });

  scene.mobileControls = new MobileControls(scene, scene.player);

  return { ground, GY, W };
}

export function addPlatform(scene, x, y, key, ground) {
  const plat = scene.physics.add.staticImage(x, y, key || 'platform');
  scene.physics.add.collider(scene.player.sprite, plat);
  return plat;
}

export function addBackgroundInfo(scene, x, y, lines, color) {
  const panelColor = Phaser.Display.Color.HexStringToColor(color || '#ffffff').color;
  const maxLen = Math.max(...lines.map(line => line.length));
  const width = Phaser.Math.Clamp(maxLen * 8 + 56, 280, 430);
  const height = lines.length * 20 + 34;

  const bg = scene.add.rectangle(x, y, width, height, 0x080816, 0.86)
    .setStrokeStyle(1, panelColor, 0.65)
    .setDepth(5);
  const text = scene.add.text(x, y, lines.join('\n'), {
    fontFamily: '"Press Start 2P"',
    fontSize: '11px',
    color: color || '#ffffff',
    align: 'center',
    lineSpacing: 10
  }).setOrigin(0.5).setAlpha(1).setDepth(6);

  scene.tweens.add({
    targets: [bg, text],
    y: y - 8,
    duration: 2500,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
  });

  return { bg, text };
}

export function addInfoBlock(scene, x, y, lines, color) {
  return addBackgroundInfo(scene, x, y, lines, color);
}

export function addBoxInfoBlock(scene, x, y, lines, color) {
  const bg = scene.add.image(x, y, 'tablet').setScale(1.4).setDepth(5);
  const text = scene.add.text(x, y, lines.join('\n'), {
    fontFamily: '"Press Start 2P"',
    fontSize: '10px',
    color: color || '#00f5ff',
    align: 'center',
    wordWrap: { width: 250 },
    lineSpacing: 8
  }).setOrigin(0.5).setDepth(6);
  return { bg, text };
}

export function addSkillPanel(scene, x, y, title, skills, color = '#00ff88') {
  const panelColor = Phaser.Display.Color.HexStringToColor(color).color;
  const rows = Math.ceil(skills.length / 2);
  const width = 430;
  const height = 62 + rows * 30;
  const bg = scene.add.rectangle(x, y, width, height, 0x061423, 0.92)
    .setStrokeStyle(2, panelColor, 0.65)
    .setDepth(20);
  const header = scene.add.text(x, y - height / 2 + 22, title.toUpperCase(), {
    fontFamily: '"Press Start 2P"',
    fontSize: '11px',
    color,
    align: 'center'
  }).setOrigin(0.5).setDepth(21);

  const nodes = [bg, header];
  skills.forEach((skill, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const sx = x - 105 + col * 210;
    const sy = y - height / 2 + 56 + row * 30;
    const chip = scene.add.image(sx - 82, sy, 'skill_chip').setScale(0.72).setTint(panelColor).setDepth(21);
    const labelBg = scene.add.rectangle(sx + 6, sy, 174, 21, 0x0a0a1e, 0.78)
      .setStrokeStyle(1, panelColor, 0.28)
      .setDepth(20);
    const label = scene.add.text(sx + 6, sy, skill.toUpperCase(), {
      fontFamily: '"Press Start 2P"',
      fontSize: '7px',
      color: '#d8fff0',
      align: 'center',
      wordWrap: { width: 160 }
    }).setOrigin(0.5).setDepth(21);

    nodes.push(chip, labelBg, label);
    scene.tweens.add({
      targets: chip,
      angle: 360,
      duration: 2600 + index * 90,
      repeat: -1,
      ease: 'Linear'
    });
  });

  scene.tweens.add({
    targets: nodes,
    y: '-=6',
    duration: 2000,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
  });

  return nodes;
}

export function addQuestionBlock(scene, x, y, skillName, ground, hud) {
  const block = scene.add.image(x, y, 'skill_chip').setScale(1.2).setDepth(20);
  const label = scene.add.text(x, y - 34, skillName, {
    fontFamily: '"Press Start 2P"',
    fontSize: '8px',
    color: '#00ff88',
    backgroundColor: '#0a0a2ecc',
    padding: { x: 6, y: 4 }
  }).setOrigin(0.5).setDepth(21);

  scene.tweens.add({
    targets: [block, label],
    y: '-=8',
    duration: 1300,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
  });

  if (hud) hud.addSkill(skillName);
  return block;
}

const BOSS_POWER_META = {
  mirror: { label: 'MIRROR DAGGERS', color: 0x58ff74, cadence: 112, windup: 420, damage: 12 },
  laser: { label: 'OMEGA LASER', color: 0xff2f2f, cadence: 132, windup: 520, damage: 18 },
  mist: { label: 'HOLO MIST', color: 0xa45cff, cadence: 124, windup: 540, damage: 14 },
  pounce: { label: 'VIBRANIUM POUNCE', color: 0xffc83d, cadence: 104, windup: 360, damage: 16 },
  cube: { label: 'TESSERACT BOLT', color: 0x00e6ff, cadence: 116, windup: 460, damage: 18 },
  shockwave: { label: 'INFINITY GAUNTLET', color: 0xc45cff, cadence: 128, windup: 560, damage: 20 }
};

const INFINITY_STONES = [
  { key: 'space', label: 'SPACE STONE', color: 0x3d7bff, windup: 420 },
  { key: 'mind', label: 'MIND STONE', color: 0xffd447, windup: 460 },
  { key: 'reality', label: 'REALITY STONE', color: 0xff4040, windup: 520 },
  { key: 'power', label: 'POWER STONE', color: 0xc45cff, windup: 560 },
  { key: 'time', label: 'TIME STONE', color: 0x34ff7a, windup: 520 },
  { key: 'soul', label: 'SOUL STONE', color: 0xff8a2e, windup: 500 }
];

const THANOS_TIME_REVERSE_PCT = 0.25;

const toHex = (color) => '#' + color.toString(16).padStart(6, '0');

function getBossMeta(theme) {
  const key = theme.villainPowerKey || 'mirror';
  return {
    key,
    label: (theme.villainPower || BOSS_POWER_META[key]?.label || 'BOSS POWER').toUpperCase(),
    color: theme.villainColor || 0xff4444,
    cadence: 120,
    windup: 450,
    damage: 15,
    ...(BOSS_POWER_META[key] || {})
  };
}

function getThanosStoneMeta(v, bossMeta) {
  const stone = INFINITY_STONES[v.thanosStoneIndex % INFINITY_STONES.length];
  v.thanosStoneIndex = (v.thanosStoneIndex + 1) % INFINITY_STONES.length;
  return {
    ...bossMeta,
    key: 'thanos-' + stone.key,
    label: stone.label,
    color: stone.color,
    windup: stone.windup,
    damage: 20,
    stone
  };
}

function addFloatingCombatText(scene, x, y, text, color) {
  const popup = scene.add.text(x, y, text, {
    fontFamily: '"Press Start 2P"',
    fontSize: '9px',
    color: toHex(color),
    stroke: '#050510',
    strokeThickness: 4
  }).setOrigin(0.5).setDepth(80);

  scene.tweens.add({
    targets: popup,
    y: y - 38,
    alpha: 0,
    duration: 900,
    ease: 'Cubic.easeOut',
    onComplete: () => popup.destroy()
  });
}

function addImpactPulse(scene, x, y, color, radius = 32) {
  const core = scene.add.circle(x, y, radius * 0.28, color, 0.4).setDepth(35).setBlendMode(Phaser.BlendModes.ADD);
  const ring = scene.add.circle(x, y, radius, color, 0)
    .setStrokeStyle(3, color, 0.8)
    .setDepth(36)
    .setBlendMode(Phaser.BlendModes.ADD);

  scene.tweens.add({
    targets: core,
    scale: 2.4,
    alpha: 0,
    duration: 360,
    ease: 'Cubic.easeOut',
    onComplete: () => core.destroy()
  });
  scene.tweens.add({
    targets: ring,
    scale: 1.8,
    alpha: 0,
    duration: 440,
    ease: 'Cubic.easeOut',
    onComplete: () => ring.destroy()
  });
}

function addBossTelegraph(scene, v, meta, radius = 46) {
  const x = v.sprite.x;
  const y = v.sprite.y - 6;
  const glow = scene.add.circle(x, y, radius, meta.color, 0.14)
    .setDepth(12)
    .setBlendMode(Phaser.BlendModes.ADD);
  const ring = scene.add.circle(x, y, radius, meta.color, 0)
    .setStrokeStyle(3, meta.color, 0.9)
    .setDepth(13)
    .setBlendMode(Phaser.BlendModes.ADD);
  const label = scene.add.text(x, y - radius - 26, meta.label, {
    fontFamily: '"Press Start 2P"',
    fontSize: '8px',
    color: toHex(meta.color),
    align: 'center',
    stroke: '#050510',
    strokeThickness: 4
  }).setOrigin(0.5).setDepth(70);

  scene.tweens.add({
    targets: glow,
    scale: 1.28,
    alpha: 0.28,
    duration: meta.windup * 0.45,
    yoyo: true,
    ease: 'Sine.easeInOut'
  });
  scene.tweens.add({
    targets: ring,
    scale: 1.42,
    alpha: 0,
    duration: meta.windup,
    ease: 'Cubic.easeOut',
    onComplete: () => ring.destroy()
  });
  scene.tweens.add({
    targets: label,
    y: label.y - 12,
    alpha: 0,
    delay: Math.max(80, meta.windup - 260),
    duration: 260,
    ease: 'Sine.easeOut',
    onComplete: () => label.destroy()
  });
  scene.time.delayedCall(meta.windup + 60, () => {
    if (glow.active) glow.destroy();
  });
}

function addBossAfterImage(scene, sprite, tint) {
  const ghost = scene.add.image(sprite.x, sprite.y, sprite.texture.key)
    .setScale(sprite.scaleX, sprite.scaleY)
    .setFlipX(sprite.flipX)
    .setAlpha(0.34)
    .setTint(tint)
    .setDepth(sprite.depth - 1)
    .setBlendMode(Phaser.BlendModes.ADD);

  scene.tweens.add({
    targets: ghost,
    alpha: 0,
    scaleX: sprite.scaleX * 1.12,
    scaleY: sprite.scaleY * 0.9,
    duration: 300,
    ease: 'Sine.easeOut',
    onComplete: () => ghost.destroy()
  });
}

function createDamageZone(scene, x, y, width, height, damage, duration, onHit) {
  const zone = scene.add.zone(x, y, width, height);
  scene.physics.add.existing(zone);
  zone.body.setAllowGravity(false);
  zone.body.setImmovable(true);

  let hasHit = false;
  const overlap = scene.physics.add.overlap(scene.player.sprite, zone, () => {
    if (hasHit || scene.player.isDead) return;
    hasHit = true;
    scene.player.takeDamage(damage);
    if (onHit) onHit();
  });

  scene.time.delayedCall(duration, () => {
    overlap.destroy();
    if (zone.active) zone.destroy();
  });

  return zone;
}

function createBossProjectile(scene, v, x, y, targetX, targetY, options = {}) {
  const color = options.color || 0xff4444;
  const trailColor = options.trailColor || color;
  const speed = options.speed || 420;
  const damage = options.damage || 15;
  const scale = options.scale || 3;
  const lifespan = options.lifespan || 2200;
  const angle = Phaser.Math.Angle.Between(x, y, targetX, targetY);
  const proj = scene.physics.add.image(x, y, 'particle')
    .setScale(scale)
    .setTint(color)
    .setDepth(30)
    .setBlendMode(Phaser.BlendModes.ADD);

  proj.body.setAllowGravity(false);
  proj.setRotation(angle);
  proj.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);

  const pulseTween = scene.tweens.add({
    targets: proj,
    scaleX: scale * 1.35,
    scaleY: scale * 1.35,
    duration: 120,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
  });

  const trailEvent = scene.time.addEvent({
    delay: 42,
    loop: true,
    callback: () => {
      if (!proj.active) return;
      const dot = scene.add.circle(proj.x, proj.y, scale * 4, trailColor, 0.26)
        .setDepth(24)
        .setBlendMode(Phaser.BlendModes.ADD);
      scene.tweens.add({
        targets: dot,
        scale: 0.25,
        alpha: 0,
        duration: 280,
        ease: 'Sine.easeOut',
        onComplete: () => dot.destroy()
      });
    }
  });

  let cleaned = false;
  const cleanup = (impact = false) => {
    if (cleaned) return;
    cleaned = true;
    pulseTween.stop();
    trailEvent.remove(false);
    overlap.destroy();
    if (impact && proj.active) addImpactPulse(scene, proj.x, proj.y, color, 24 + scale * 4);
    if (proj.active) proj.destroy();
  };

  const overlap = scene.physics.add.overlap(scene.player.sprite, proj, () => {
    if (!v.alive || !proj.active || scene.player.isDead) return;
    scene.player.takeDamage(damage);
    cleanup(true);
  });

  scene.time.delayedCall(lifespan, () => cleanup(false));
  return proj;
}

function fireLokiPower(v, facing, meta) {
  const scene = v.scene;
  const player = scene.player.sprite;
  [-72, 0, 72].forEach((offset, index) => {
    const clone = scene.add.image(v.sprite.x - facing * 18, v.sprite.y + offset * 0.18, v.sprite.texture.key)
      .setScale(3)
      .setFlipX(v.sprite.flipX)
      .setTint(meta.color)
      .setAlpha(index === 1 ? 0.52 : 0.3)
      .setDepth(9)
      .setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
      targets: clone,
      x: clone.x - facing * (42 + index * 18),
      y: clone.y - 18 + offset * 0.25,
      alpha: 0,
      duration: 560,
      ease: 'Cubic.easeOut',
      onComplete: () => clone.destroy()
    });

    scene.time.delayedCall(index * 95, () => {
      if (!v.alive) return;
      createBossProjectile(scene, v, v.sprite.x + facing * 34, v.sprite.y - 20 + offset * 0.3, player.x, player.y + offset * 0.35, {
        color: meta.color,
        trailColor: 0xaaff9a,
        speed: 430 + index * 25,
        damage: meta.damage,
        scale: 2.7,
        lifespan: 1900
      });
    });
  });
}

function fireUltronPower(v, facing, meta) {
  const scene = v.scene;
  const length = 820;
  const x = v.sprite.x + facing * (length / 2 + 38);
  const y = v.sprite.y - 12;
  const beam = scene.add.rectangle(x, y, length, 22, meta.color, 0.56)
    .setDepth(25)
    .setBlendMode(Phaser.BlendModes.ADD);
  const core = scene.add.rectangle(x, y, length, 6, 0xffffff, 0.9)
    .setDepth(26)
    .setBlendMode(Phaser.BlendModes.ADD);

  createDamageZone(scene, x, y, length, 76, meta.damage, 240, () => addImpactPulse(scene, scene.player.sprite.x, scene.player.sprite.y, meta.color, 36));

  for (let i = 0; i < 12; i++) {
    const sparkX = v.sprite.x + facing * (90 + i * 58);
    const spark = scene.add.circle(sparkX, y + Phaser.Math.Between(-18, 18), Phaser.Math.Between(3, 7), 0xffffff, 0.75)
      .setDepth(27)
      .setBlendMode(Phaser.BlendModes.ADD);
    scene.tweens.add({
      targets: spark,
      y: spark.y + Phaser.Math.Between(-30, 30),
      alpha: 0,
      duration: 260 + i * 18,
      ease: 'Sine.easeOut',
      onComplete: () => spark.destroy()
    });
  }

  scene.tweens.add({
    targets: [beam, core],
    scaleY: 0.1,
    alpha: 0,
    duration: 280,
    ease: 'Expo.easeOut',
    onComplete: () => {
      beam.destroy();
      core.destroy();
    }
  });
}

function fireMysterioPower(v, meta) {
  const scene = v.scene;
  const targetX = scene.player.sprite.x;
  const targetY = scene.player.sprite.y;
  const colors = [0x44ffcc, meta.color, 0xffffff];

  createDamageZone(scene, targetX, targetY, 190, 190, meta.damage, 620, () => addImpactPulse(scene, targetX, targetY, meta.color, 58));

  colors.forEach((color, index) => {
    const ring = scene.add.circle(targetX, targetY, 22 + index * 10, color, 0)
      .setStrokeStyle(3 - index * 0.5, color, 0.76)
      .setDepth(25 + index)
      .setBlendMode(Phaser.BlendModes.ADD);
    scene.tweens.add({
      targets: ring,
      scale: 3.8 + index * 0.55,
      angle: 160 + index * 80,
      alpha: 0,
      duration: 700 + index * 80,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy()
    });
  });

  for (let i = 0; i < 10; i++) {
    const angle = Phaser.Math.DegToRad(i * 36);
    const mist = scene.add.circle(targetX + Math.cos(angle) * 16, targetY + Math.sin(angle) * 16, 8, i % 2 ? meta.color : 0x44ffcc, 0.28)
      .setDepth(24)
      .setBlendMode(Phaser.BlendModes.ADD);
    scene.tweens.add({
      targets: mist,
      x: targetX + Math.cos(angle) * Phaser.Math.Between(70, 112),
      y: targetY + Math.sin(angle) * Phaser.Math.Between(42, 92),
      alpha: 0,
      scale: 0.25,
      duration: 620,
      ease: 'Sine.easeOut',
      onComplete: () => mist.destroy()
    });
  }
}

function fireKillmongerPower(v, facing, meta) {
  const scene = v.scene;
  const startX = v.sprite.x;
  const slashX = startX + facing * 180;
  const slashY = v.sprite.y - 10;

  const afterEvent = scene.time.addEvent({
    delay: 48,
    repeat: 5,
    callback: () => {
      if (v.alive) addBossAfterImage(scene, v.sprite, meta.color);
    }
  });

  v.sprite.setVelocityX(facing * 720);
  scene.time.delayedCall(250, () => {
    afterEvent.remove(false);
    if (v.alive) v.sprite.setVelocityX(0);
  });

  const slash = scene.add.text(slashX, slashY, '///', {
    fontFamily: 'Arial Black',
    fontSize: '72px',
    fontStyle: 'bold',
    color: toHex(meta.color),
    stroke: '#ffffff',
    strokeThickness: 2
  }).setOrigin(0.5).setDepth(35).setBlendMode(Phaser.BlendModes.ADD);
  if (facing < 0) slash.setScale(-1, 1);

  createDamageZone(scene, slashX, slashY, 280, 120, meta.damage, 280, () => addImpactPulse(scene, scene.player.sprite.x, scene.player.sprite.y, meta.color, 42));

  scene.tweens.add({
    targets: slash,
    x: slashX + facing * 70,
    alpha: 0,
    scaleY: 0.72,
    duration: 320,
    ease: 'Cubic.easeOut',
    onComplete: () => slash.destroy()
  });
}

function fireRedSkullPower(v, facing, meta) {
  const scene = v.scene;
  const player = scene.player.sprite;
  const cube = scene.add.rectangle(v.sprite.x + facing * 34, v.sprite.y - 34, 26, 26, 0x00e6ff, 0.82)
    .setStrokeStyle(2, 0xffffff, 0.9)
    .setDepth(32)
    .setBlendMode(Phaser.BlendModes.ADD);

  scene.tweens.add({
    targets: cube,
    angle: 180,
    scale: 1.35,
    duration: 220,
    yoyo: true,
    ease: 'Sine.easeInOut'
  });

  scene.time.delayedCall(130, () => {
    if (!v.alive) return;
    createBossProjectile(scene, v, cube.x, cube.y, player.x, player.y - 18, {
      color: 0xff1f3d,
      trailColor: meta.color,
      speed: 500,
      damage: meta.damage,
      scale: 4,
      lifespan: 2100
    });
  });

  scene.tweens.add({
    targets: cube,
    alpha: 0,
    y: cube.y - 16,
    duration: 560,
    ease: 'Cubic.easeOut',
    onComplete: () => cube.destroy()
  });
}

function showInfinityStoneOrbit(scene, v, activeStone) {
  INFINITY_STONES.forEach((stoneData, index) => {
    const angle = Phaser.Math.DegToRad(index * 60);
    const isActive = stoneData.key === activeStone.key;
    const stone = scene.add.circle(
      v.sprite.x + Math.cos(angle) * 42,
      v.sprite.y - 34 + Math.sin(angle) * 20,
      isActive ? 7 : 5,
      stoneData.color,
      isActive ? 1 : 0.68
    )
      .setDepth(34)
      .setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
      targets: stone,
      x: v.sprite.x,
      y: v.sprite.y - 10,
      scale: isActive ? 2.4 : 1.45,
      alpha: 0,
      duration: 360 + index * 30,
      ease: 'Cubic.easeIn',
      onComplete: () => stone.destroy()
    });
  });
}

function fireThanosPower(v, facing, meta) {
  const scene = v.scene;
  const player = scene.player.sprite;
  const stone = meta.stone || INFINITY_STONES[0];
  showInfinityStoneOrbit(scene, v, stone);

  if (stone.key === 'space') {
    const oldX = v.sprite.x;
    const oldY = v.sprite.y;
    const bounds = scene.physics.world.bounds;
    const targetX = Phaser.Math.Clamp(player.x - facing * 250, 140, bounds.width - 140);
    const portalA = scene.add.circle(oldX, oldY - 20, 30, stone.color, 0.12)
      .setStrokeStyle(4, stone.color, 0.9)
      .setDepth(32)
      .setBlendMode(Phaser.BlendModes.ADD);
    const portalB = scene.add.circle(targetX, oldY - 20, 30, stone.color, 0.12)
      .setStrokeStyle(4, stone.color, 0.9)
      .setDepth(32)
      .setBlendMode(Phaser.BlendModes.ADD);

    v.sprite.setPosition(targetX, oldY);
    addBossAfterImage(scene, v.sprite, stone.color);
    scene.tweens.add({ targets: [portalA, portalB], scale: 2.2, alpha: 0, duration: 520, ease: 'Cubic.easeOut', onComplete: () => { portalA.destroy(); portalB.destroy(); } });

    scene.time.delayedCall(120, () => {
      if (!v.alive) return;
      createBossProjectile(scene, v, v.sprite.x + facing * 34, v.sprite.y - 18, player.x, player.y - 18, {
        color: stone.color,
        trailColor: 0x96c7ff,
        speed: 620,
        damage: meta.damage,
        scale: 3.6,
        lifespan: 1600
      });
    });
    return;
  }

  if (stone.key === 'mind') {
    [-90, 0, 90].forEach((offset, index) => {
      scene.time.delayedCall(index * 110, () => {
        if (!v.alive) return;
        createBossProjectile(scene, v, v.sprite.x + facing * 28, v.sprite.y - 18, player.x, player.y + offset * 0.45, {
          color: stone.color,
          trailColor: 0xffffff,
          speed: 430 + index * 70,
          damage: meta.damage,
          scale: 2.7,
          lifespan: 1900
        });
      });
    });
    return;
  }

  if (stone.key === 'reality') {
    const targetX = player.x;
    const targetY = player.y;
    [-150, 0, 150].forEach((offset, index) => {
      const shard = scene.add.rectangle(targetX + offset, targetY + 8, 58, 210, stone.color, 0.28)
        .setAngle(Phaser.Math.Between(-16, 16))
        .setStrokeStyle(2, 0xffffff, 0.5)
        .setDepth(28)
        .setBlendMode(Phaser.BlendModes.ADD);
      createDamageZone(scene, targetX + offset, targetY + 8, 82, 220, meta.damage, 430, () => addImpactPulse(scene, player.x, player.y, stone.color, 48));
      scene.tweens.add({
        targets: shard,
        scaleY: 1.45,
        alpha: 0,
        delay: index * 55,
        duration: 520,
        ease: 'Cubic.easeOut',
        onComplete: () => shard.destroy()
      });
    });
    return;
  }

  if (stone.key === 'power') {
    scene.time.delayedCall(180, () => {
      if (!v.alive) return;
      const wave = scene.add.circle(v.sprite.x, v.sprite.y + 30, 28, stone.color, 0.16)
        .setStrokeStyle(4, stone.color, 0.95)
        .setDepth(28)
        .setBlendMode(Phaser.BlendModes.ADD);
      createDamageZone(scene, v.sprite.x, v.sprite.y + 24, 720, 210, meta.damage, 560, () => addImpactPulse(scene, player.x, player.y, stone.color, 64));
      scene.cameras.main.shake(300, 0.022);
      scene.tweens.add({
        targets: wave,
        scaleX: 12.4,
        scaleY: 3.6,
        alpha: 0,
        duration: 700,
        ease: 'Cubic.easeOut',
        onComplete: () => wave.destroy()
      });
    });
    return;
  }

  if (stone.key === 'time') {
    const targetX = player.x;
    const targetY = player.y;
    for (let i = 0; i < 4; i++) {
      const ring = scene.add.circle(targetX, targetY, 24 + i * 15, stone.color, 0)
        .setStrokeStyle(3, stone.color, 0.8 - i * 0.12)
        .setDepth(30 + i)
        .setBlendMode(Phaser.BlendModes.ADD);
      scene.tweens.add({
        targets: ring,
        scale: 2.4 + i * 0.5,
        angle: 180 + i * 70,
        alpha: 0,
        duration: 740 + i * 80,
        ease: 'Cubic.easeOut',
        onComplete: () => ring.destroy()
      });
    }
    scene.time.delayedCall(260, () => {
      if (!v.alive) return;
      player.setVelocityX(player.body.velocity.x * 0.18);
      createDamageZone(scene, targetX, targetY, 240, 240, meta.damage, 520, () => addImpactPulse(scene, targetX, targetY, stone.color, 66));
    });
    return;
  }

  if (stone.key === 'soul') {
    const startX = v.sprite.x + facing * 30;
    const startY = v.sprite.y - 24;
    const endX = player.x;
    const endY = player.y;
    const beamLength = Phaser.Math.Distance.Between(startX, startY, endX, endY);
    const beam = scene.add.rectangle((startX + endX) / 2, (startY + endY) / 2, beamLength, 12, stone.color, 0.72)
      .setRotation(Phaser.Math.Angle.Between(startX, startY, endX, endY))
      .setDepth(31)
      .setBlendMode(Phaser.BlendModes.ADD);
    const core = scene.add.rectangle(beam.x, beam.y, beamLength, 4, 0xffffff, 0.82)
      .setRotation(beam.rotation)
      .setDepth(32)
      .setBlendMode(Phaser.BlendModes.ADD);

    createDamageZone(scene, endX, endY, 180, 180, meta.damage, 420, () => {
      v.health = Math.min(v.maxHealth, v.health + 4);
      v.updateHealthBar();
      addFloatingCombatText(scene, v.sprite.x, v.sprite.y - 58, '+4 SOUL', stone.color);
      addImpactPulse(scene, endX, endY, stone.color, 54);
    });

    scene.tweens.add({
      targets: [beam, core],
      scaleY: 0.1,
      alpha: 0,
      duration: 420,
      ease: 'Expo.easeOut',
      onComplete: () => {
        beam.destroy();
        core.destroy();
      }
    });
  }
}

function fireVillainPower(v, facing, meta) {
  if (meta.stone) {
    fireThanosPower(v, facing, meta);
    return;
  }

  switch (meta.key) {
    case 'mirror':
      fireLokiPower(v, facing, meta);
      break;
    case 'laser':
      fireUltronPower(v, facing, meta);
      break;
    case 'mist':
      fireMysterioPower(v, meta);
      break;
    case 'pounce':
      fireKillmongerPower(v, facing, meta);
      break;
    case 'cube':
      fireRedSkullPower(v, facing, meta);
      break;
    case 'shockwave':
      fireThanosPower(v, facing, { ...meta, stone: INFINITY_STONES[3] });
      break;
    default:
      createBossProjectile(v.scene, v, v.sprite.x + facing * 30, v.sprite.y, v.scene.player.sprite.x, v.scene.player.sprite.y, {
        color: meta.color,
        damage: meta.damage
      });
      break;
  }
}

function escapeToHireScreen(scene) {
  if (scene._transitioning) return;
  scene._transitioning = true;
  stopBGM();
  playSound('select');
  scene.cameras.main.fadeOut(360, 0, 0, 0);
  scene.cameras.main.once('camerafadeoutcomplete', () => {
    scene.scene.start('Citadel');
  });
}

function reverseThanosTime(v) {
  const scene = v.scene;
  if (!v.alive) return;

  scene.player.restoreHealth();
  v.health = v.maxHealth;
  v.attackTimer = 0;
  v.isCasting = false;
  v.timeReverseActive = false;
  v.updateHealthBar();
  v.updateChargeBar();

  playSound('power');
  scene.cameras.main.flash(520, 60, 255, 120);
  addFloatingCombatText(scene, v.sprite.x, v.sprite.y - 76, 'TIME REVERSED', 0x34ff7a);
  addFloatingCombatText(scene, scene.player.sprite.x, scene.player.sprite.y - 76, 'RESTORED', 0x34ff7a);
}

function showThanosTimeReversePrompt(v) {
  const scene = v.scene;
  if (v.timeReverseActive || scene._transitioning || !v.alive) return;

  v.timeReverseActive = true;
  v.isCasting = true;
  v.sprite.setVelocity(0, 0);
  scene.player.sprite.setVelocity(0, 0);
  scene.player.invulnerable = Math.max(scene.player.invulnerable, 220);

  playSound('power');
  scene.cameras.main.shake(280, 0.016);

  const cam = scene.cameras.main;
  const cx = cam.width / 2;
  const cy = cam.height / 2;
  const overlay = scene.add.rectangle(cx, cy, cam.width, cam.height, 0x050510, 0.72)
    .setScrollFactor(0)
    .setDepth(240);
  const panel = scene.add.rectangle(cx, cy, 620, 260, 0x12071f, 0.96)
    .setStrokeStyle(2, 0x34ff7a, 0.9)
    .setScrollFactor(0)
    .setDepth(241);
  const title = scene.add.text(cx, cy - 82, 'THANOS IS REVERSING TIME', {
    fontFamily: '"Press Start 2P"',
    fontSize: '15px',
    color: '#34ff7a',
    align: 'center',
    stroke: '#050510',
    strokeThickness: 5
  }).setOrigin(0.5).setScrollFactor(0).setDepth(242);
  const message = scene.add.text(cx, cy - 32, '3 SECONDS TO ESCAPE THE LOOP', {
    fontFamily: '"Press Start 2P"',
    fontSize: '10px',
    color: '#ffffff',
    align: 'center',
    stroke: '#050510',
    strokeThickness: 4
  }).setOrigin(0.5).setScrollFactor(0).setDepth(242);
  const countdown = scene.add.text(cx, cy + 8, '3', {
    fontFamily: '"Press Start 2P"',
    fontSize: '28px',
    color: '#ffd447',
    stroke: '#050510',
    strokeThickness: 6
  }).setOrigin(0.5).setScrollFactor(0).setDepth(242);
  const button = scene.add.rectangle(cx, cy + 78, 330, 54, 0xff00ff, 0.22)
    .setStrokeStyle(2, 0xff00ff, 0.95)
    .setInteractive({ useHandCursor: true })
    .setScrollFactor(0)
    .setDepth(242);
  const buttonText = scene.add.text(cx, cy + 78, 'HIRE KRISH', {
    fontFamily: '"Press Start 2P"',
    fontSize: '15px',
    color: '#ffffff',
    stroke: '#050510',
    strokeThickness: 4
  }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setScrollFactor(0).setDepth(243);

  const nodes = [overlay, panel, title, message, countdown, button, buttonText];
  let secondsLeft = 3;
  let resolved = false;

  const cleanup = () => {
    tick.remove(false);
    timer.remove(false);
    nodes.forEach(node => {
      if (node.active) node.destroy();
    });
  };

  const resolve = (escaped) => {
    if (resolved) return;
    resolved = true;
    cleanup();
    if (escaped) {
      escapeToHireScreen(scene);
    } else {
      reverseThanosTime(v);
    }
  };

  button.on('pointerover', () => {
    button.setFillStyle(0xff00ff, 0.42);
    playSound('hover');
  });
  button.on('pointerout', () => button.setFillStyle(0xff00ff, 0.22));
  button.on('pointerdown', () => resolve(true));
  buttonText.on('pointerdown', () => resolve(true));

  const tick = scene.time.addEvent({
    delay: 1000,
    repeat: 2,
    callback: () => {
      secondsLeft--;
      countdown.setText(String(Math.max(0, secondsLeft)));
      scene.tweens.add({
        targets: countdown,
        scaleX: 1.18,
        scaleY: 1.18,
        duration: 120,
        yoyo: true,
        ease: 'Sine.easeOut'
      });
    }
  });
  const timer = scene.time.delayedCall(3000, () => resolve(false));
}

function maybeStartThanosTimeReverse(v) {
  if (!v.isThanos || !v.alive || v.timeReverseActive || !v.scene.player) return;

  const player = v.scene.player;
  const playerLow = player.health / player.maxHealth <= THANOS_TIME_REVERSE_PCT;
  const thanosLow = v.health / v.maxHealth <= THANOS_TIME_REVERSE_PCT;

  if (playerLow && thanosLow) {
    v.health = Math.max(1, v.health);
    v.updateHealthBar();
    showThanosTimeReversePrompt(v);
  }
}

export function addVillain(scene, x, y, tunnelNum) {
  const theme = TUNNEL_THEMES[tunnelNum];
  if (!theme) return null;
  const bossMeta = getBossMeta(theme);

  const v = {
    alive: true,
    health: 100,
    maxHealth: 100,
    scene,
    sprite: scene.physics.add.sprite(x, y, 'villain_' + tunnelNum).setScale(3),
    isThanos: tunnelNum === 6,
    thanosStoneIndex: 0,
    timeReverseActive: false,
    bgmTriggered: false,
    attackTimer: 0,
    attackCadence: bossMeta.cadence,
    isCasting: false,
    update: function() {
      if (!this.alive || !scene.player || scene.player.isDead || this.timeReverseActive) return;

      const dist = scene.player.sprite.x - this.sprite.x;
      const inRange = Math.abs(dist) < 820;
      const facing = dist > 0 ? 1 : -1;

      if (inRange && !this.bgmTriggered) {
        this.bgmTriggered = true;
        playBossBGM();
      }

      if (inRange) {
        this.sprite.setFlipX(facing > 0);

        if (this.isCasting) {
          this.sprite.setVelocityX(0);
        } else {
          this.sprite.setVelocityX(facing * 115);

          if (Math.random() < 0.012 && this.sprite.body.onFloor()) {
            this.sprite.setVelocityY(-430);
          }

          this.attackTimer++;
          if (this.attackTimer >= this.attackCadence) {
            const activeMeta = this.isThanos ? getThanosStoneMeta(this, bossMeta) : bossMeta;
            this.attackTimer = 0;
            this.isCasting = true;
            this.sprite.setVelocityX(0);
            playSound('power');
            addBossTelegraph(scene, this, activeMeta, this.isThanos ? 64 : 46);
            scene.tweens.add({
              targets: this.sprite,
              scaleX: 3.12,
              scaleY: 2.88,
              duration: 110,
              yoyo: true,
              repeat: 1,
              ease: 'Sine.easeInOut'
            });
            scene.time.delayedCall(activeMeta.windup, () => {
              if (!this.alive || this.timeReverseActive) return;
              fireVillainPower(this, facing, activeMeta);
              this.isCasting = false;
            });
            scene.time.delayedCall(activeMeta.windup + 700, () => {
              if (this.alive && !this.timeReverseActive) this.isCasting = false;
            });
          }
        }
      } else {
        this.sprite.setVelocityX(0);
        this.attackTimer = Math.max(0, this.attackTimer - 2);
      }

      this.updateChargeBar();
      this.checkTimeReverse();
    },
    takeDamage: function(amount = 15) {
      if (!this.alive) return;
      this.health -= amount;
      playSound('hit');

      this.sprite.setTintFill(0xffffff);
      addImpactPulse(scene, this.sprite.x, this.sprite.y, bossMeta.color, 38);
      addFloatingCombatText(scene, this.sprite.x, this.sprite.y - 54, '-' + amount + (this.isThanos ? '%' : ''), bossMeta.color);
      scene.time.delayedCall(90, () => {
        if (this.alive) this.sprite.setTint(theme.villainColor);
      });

      this.updateHealthBar();

      if (this.isThanos && this.health <= this.maxHealth * THANOS_TIME_REVERSE_PCT && scene.player.health / scene.player.maxHealth <= THANOS_TIME_REVERSE_PCT) {
        this.health = Math.max(1, this.health);
        this.updateHealthBar();
        this.checkTimeReverse();
        return;
      }

      if (this.health <= 0) {
        this.alive = false;
        this.sprite.setVelocity(0, 0);
        this.sprite.body.enable = false;
        playSound('kill');
        scene.cameras.main.shake(400, 0.03);
        if (this.auraTween) this.auraTween.stop();

        scene.tweens.add({
          targets: this.sprite,
          alpha: 0,
          scaleX: 4,
          scaleY: 0,
          duration: 800,
          onComplete: () => {
            this.sprite.destroy();
            this.nameText.destroy();
            this.powerText.destroy();
            this.hBg.destroy();
            this.hBar.destroy();
            this.chargeBg.destroy();
            this.chargeBar.destroy();
            this.aura.destroy();
          }
        });
        scene.hud.addXP(100);

        const vt = scene.add.text(this.sprite.x, this.sprite.y - 40, 'BOSS DEFEATED!', {
          fontFamily: '"Press Start 2P"',
          fontSize: '18px',
          color: '#ffd700'
        }).setOrigin(0.5).setDepth(50);
        scene.tweens.add({ targets: vt, y: vt.y - 100, alpha: 0, duration: 3000 });

        if (scene.exitGate) {
          scene.exitGate.setAlpha(1);
          scene.exitGate.body.enable = true;
          scene.exitText.setText('EXIT OPEN\nPRESS ENTER');

          const gt = scene.add.text(scene.exitGate.x, scene.exitGate.y - 80, 'EXIT OPENED!', {
            fontFamily: '"Press Start 2P"',
            fontSize: '14px',
            color: '#00ff88'
          }).setOrigin(0.5).setDepth(50);
          scene.tweens.add({ targets: gt, y: gt.y - 50, alpha: 0, duration: 2000 });
        }
      } else {
        this.sprite.setVelocityY(-200);
        this.sprite.setVelocityX(this.sprite.x > scene.player.sprite.x ? 200 : -200);
      }
    },
    updateHealthBar: function() {
      const pct = Phaser.Math.Clamp(Math.max(0, this.health) / this.maxHealth, 0, 1);
      this.hBar.width = pct * 120;
      this.hBar.setFillStyle(pct < 0.35 ? 0xffdd33 : 0xff3333, 1);
    },
    updateChargeBar: function() {
      const pct = Phaser.Math.Clamp(this.attackTimer / this.attackCadence, 0, 1);
      this.chargeBar.width = pct * 120;
      this.chargeBar.setFillStyle(pct > 0.78 ? 0xffee66 : bossMeta.color, pct > 0.02 ? 1 : 0.45);
    },
    checkTimeReverse: function() {
      maybeStartThanosTimeReverse(this);
    }
  };

  v.sprite.setTint(theme.villainColor);
  v.sprite.setCollideWorldBounds(true);
  if (scene.groundGroup) {
    scene.physics.add.collider(v.sprite, scene.groundGroup);
  }

  v.nameText = scene.add.text(0, -50, theme.villain + ' BOSS', {
    fontFamily: '"Press Start 2P"',
    fontSize: '12px',
    color: '#ffdfdf',
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0.5).setDepth(9);

  v.powerText = scene.add.text(0, -50, theme.villainPower || bossMeta.label, {
    fontFamily: '"Press Start 2P"',
    fontSize: '7px',
    color: toHex(bossMeta.color),
    stroke: '#000000',
    strokeThickness: 3
  }).setOrigin(0.5).setDepth(9);

  v.hBg = scene.add.rectangle(0, -30, 124, 10, 0x220010, 0.95).setStrokeStyle(1, bossMeta.color, 0.9).setDepth(9);
  v.hBar = scene.add.rectangle(-60, -30, 120, 6, 0xff3333).setOrigin(0, 0.5).setDepth(10);
  v.chargeBg = scene.add.rectangle(0, -18, 124, 5, 0x080812, 0.92).setStrokeStyle(1, bossMeta.color, 0.42).setDepth(9);
  v.chargeBar = scene.add.rectangle(-60, -18, 0, 3, bossMeta.color).setOrigin(0, 0.5).setDepth(10);
  v.updateHealthBar();

  scene.events.on('update', () => {
    if (!v.alive) return;
    v.update();
    v.nameText.setPosition(v.sprite.x, v.sprite.y - 70);
    v.powerText.setPosition(v.sprite.x, v.sprite.y - 54);
    v.hBg.setPosition(v.sprite.x, v.sprite.y - 38);
    v.hBar.setPosition(v.sprite.x - 60, v.sprite.y - 38);
    v.chargeBg.setPosition(v.sprite.x, v.sprite.y - 25);
    v.chargeBar.setPosition(v.sprite.x - 60, v.sprite.y - 25);
  });

  scene.physics.add.overlap(scene.player.sprite, v.sprite, () => {
    if (v.alive) scene.player.takeDamage(15);
  });

  scene.villainObj = v;
  return v;
}

export function addObstacles(scene, positions, GY) {
  // Intentionally empty: this portfolio focuses on exploration and boss fights.
}
