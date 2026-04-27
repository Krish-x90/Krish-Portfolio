import * as Phaser from 'phaser';
import { PlayerController } from '../sprites/PlayerController.js';
import { HUD } from '../utils/HUD.js';
import { MobileControls } from '../utils/MobileControls.js';
import { createCitySkyline } from '../utils/Backgrounds.js';
import { playBGM, playSound } from '../utils/SoundGen.js';
import { RESUME } from '../data/resumeData.js';

export class OverworldScene extends Phaser.Scene {
  constructor() { super('Overworld'); }

  create() {
    this._transitioning = false;
    this._activePipe = null;
    const WORLD_W = 5600;
    const H = 720;
    const GROUND_Y = H - 48;

    this.cameras.main.fadeIn(500);
    this.physics.world.setBounds(0, 0, WORLD_W, H);

    createCitySkyline(this, WORLD_W);

    playBGM(0); // Overworld music

    const ground = this.physics.add.staticGroup();
    for (let x = 0; x < WORLD_W; x += 48) {
      ground.create(x + 24, GROUND_Y + 24, 'ground');
    }

    // Determine spawn X based on last tunnel
    let spawnX = 120;
    if (window.lastTunnelEntered) {
      spawnX = 500 + (window.lastTunnelEntered - 1) * 750;
    }

    // Player
    this.player = new PlayerController(this, spawnX, GROUND_Y - 100);
    this.physics.add.collider(this.player.sprite, ground);

    // HUD
    this.hud = new HUD(this);
    this.hud.setLevel('NEO-TOKYO OVERWORLD');
    this.hud.setSkillLoadout(RESUME.skills.featured, { title: 'PROJECT SKILLS', limit: 10 });

    // Camera
    this.cameras.main.setBounds(0, 0, WORLD_W, H);
    this.cameras.main.startFollow(this.player.sprite, true, 0.08, 0.08);

    // 6 Pipes - BIGGER labels
    const pipeLabels = ['ABOUT ME', 'EDUCATION', 'SKILLS', 'PROJECTS', 'EXPERIENCE', 'EXTRAS'];
    this.pipes = [];

    this.addStarterDossier(GROUND_Y);

    for (let i = 0; i < 6; i++) {
      const px = 500 + i * 750;
      const pipe = this.physics.add.staticImage(px, GROUND_Y - 48, 'pipe');
      pipe.body.setSize(48, 16);
      pipe.body.setOffset(8, 0);

      // BIGGER pipe sign
      const sign = this.add.image(px, GROUND_Y - 120, 'pipe_sign').setScale(1.3);
      const signText = this.add.text(px, GROUND_Y - 120, (i + 1) + '. ' + pipeLabels[i], {
        fontFamily: '"Press Start 2P"', fontSize: '9px', color: '#00f5ff'
      }).setOrigin(0.5);
      this.tweens.add({
        targets: [sign, signText],
        y: GROUND_Y - 126,
        duration: 1100 + i * 80,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      const glow = this.add.circle(px, GROUND_Y - 48, 40, 0x00f5ff, 0.08);
      this.tweens.add({ targets: glow, alpha: 0.15, duration: 1500, yoyo: true, repeat: -1 });

      // ENTER hint instead of down arrow
      const hint = this.add.text(px, GROUND_Y - 150, 'ENTER', {
        fontFamily: '"Press Start 2P"', fontSize: '10px', color: '#ffd700'
      }).setOrigin(0.5).setAlpha(0);
      this.tweens.add({ targets: hint, y: GROUND_Y - 140, duration: 600, yoyo: true, repeat: -1 });

      this.pipes.push({ pipe, hint, index: i + 1 });
    }

    // Pipe overlap detection
    this.pipes.forEach(p => {
      this.physics.add.overlap(this.player.sprite, p.pipe, () => {
        this.player.onPipe = p.index;
        p.hint.setAlpha(1);
      });
    });

    // Citadel at the end
    const citadel = this.add.image(WORLD_W - 200, GROUND_Y - 160, 'citadel');
    this.add.text(WORLD_W - 200, GROUND_Y - 340, 'TECH CITADEL', {
      fontFamily: '"Press Start 2P"', fontSize: '14px', color: '#00f5ff'
    }).setOrigin(0.5);
    const citadelGlow = this.add.circle(WORLD_W - 200, GROUND_Y - 100, 80, 0x00f5ff, 0.05);
    this.tweens.add({ targets: citadelGlow, alpha: 0.12, scaleX: 1.1, scaleY: 1.1, duration: 2000, yoyo: true, repeat: -1 });

    const citadelZone = this.add.zone(WORLD_W - 200, GROUND_Y - 80, 120, 160);
    this.physics.add.existing(citadelZone, true);
    this.physics.add.overlap(this.player.sprite, citadelZone, () => {
      if (!this._transitioning) {
        this._transitioning = true;
        this.scene.start('Citadel');
      }
    });

    this.addDecorations(WORLD_W, GROUND_Y);
    this.mobileControls = new MobileControls(this, this.player);
  }

  addStarterDossier(groundY) {
    const x = 230;
    const y = groundY - 250;
    const bg = this.add.rectangle(x, y, 360, 178, 0x07111f, 0.88)
      .setStrokeStyle(2, 0x00f5ff, 0.55)
      .setDepth(4);
    const text = this.add.text(x, y, [
      'PLAYER DOSSIER',
      RESUME.name.toUpperCase(),
      'Full-stack developer',
      'ECE engineer',
      'AI + Web + Embedded',
      'Enter pipes for details'
    ].join('\n'), {
      fontFamily: '"Press Start 2P"',
      fontSize: '9px',
      color: '#d8ffff',
      align: 'center',
      lineSpacing: 9
    }).setOrigin(0.5).setDepth(5);
    this.tweens.add({
      targets: [bg, text],
      y: y - 8,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  addDecorations(worldW, groundY) {
    for (let x = 200; x < worldW; x += 300 + Math.random() * 200) {
      const g = this.add.graphics();
      g.fillStyle(0x333344); g.fillRect(x - 2, groundY - 100, 4, 100);
      g.fillStyle(0xffaa00, 0.6); g.fillCircle(x, groundY - 105, 8);
      this.add.circle(x, groundY - 20, 40, 0xffaa00, 0.03).setDepth(-1);
    }
    for (let i = 0; i < 15; i++) {
      const dx = 100 + Math.random() * (worldW - 200);
      this.add.rectangle(dx, groundY - 4, 8 + Math.random() * 12, 3, 0x222233, 0.5).setDepth(1);
    }
  }

  update() {
    this.player.update();

    let onAnyPipe = false;
    let currentPipe = null;
    this.pipes.forEach(p => {
      const playerBounds = this.player.sprite.getBounds();
      const pipeBounds = p.pipe.getBounds();
      if (Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, pipeBounds)) {
        onAnyPipe = true;
        currentPipe = p.index;
        this.player.onPipe = p.index;
        p.hint.setAlpha(1);
      } else {
        p.hint.setAlpha(0);
      }
    });
    if (currentPipe && currentPipe !== this._activePipe) {
      playSound('hover');
    }
    this._activePipe = currentPipe;
    if (!onAnyPipe) this.player.onPipe = null;
  }
}
