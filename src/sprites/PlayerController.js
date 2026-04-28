import * as Phaser from 'phaser';
import { playSound } from '../utils/SoundGen.js';

const THANOS_PLAYER_POWERS = [
  { key: 'lightning', label: 'THOR LIGHTNING', color: 0x44aaff },
  { key: 'repulsor', label: 'IRON MAN REPULSOR', color: 0xff4444 },
  { key: 'web', label: 'SPIDER-MAN WEB', color: 0xffffff },
  { key: 'slash', label: 'BLACK PANTHER SLASH', color: 0x8844ff },
  { key: 'shield', label: 'CAP SHIELD', color: 0x3366ff },
  { key: 'smash', label: 'HULK SMASH', color: 0x33cc33 }
];

export class PlayerController {
  constructor(scene, x, y) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, 'player_idle_1');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setScale(1.2);
    // Adjusted bounding box to keep feet perfectly on the ground
    this.sprite.body.setSize(40, 80);
    this.sprite.body.setOffset(20, 20);
    this.sprite.setDepth(10);
    this.sprite.setMaxVelocity(320, 900);
    this.sprite.setDragX(1800);

    this.speed = 320;
    this.acceleration = 2300;
    this.airAcceleration = 1550;
    this.friction = 1800;
    this.airFriction = 220;
    this.jumpForce = -520;
    this.canJump = true;
    this.facing = 1;
    this.onPipe = null;
    this.wasOnGround = false;

    // Player can lose health, but never dies in the portfolio tunnels.
    this.health = 100;
    this.maxHealth = 100;
    this.isDead = false;
    this.invulnerable = 0;

    // Health Bar - only show inside Tunnels!
    if (scene.hud && scene.scene.key.startsWith('Tunnel')) {
      this.healthBg = scene.add.rectangle(150, 70, 200, 14, 0x330000).setScrollFactor(0).setDepth(100).setStrokeStyle(1, 0xff0000);
      this.healthBar = scene.add.rectangle(50, 70, 200, 10, 0xff0000).setScrollFactor(0).setDepth(101).setOrigin(0, 0.5);
      this.healthBar.width = 200;
      this.healthText = scene.add.text(50, 55, 'PLAYER HEALTH', { fontFamily: '"Press Start 2P"', fontSize: '8px', color: '#ffaaaa' }).setScrollFactor(0).setDepth(101);
    }

    // Avenger power
    this.powerCooldown = 0;
    this.powerCooldownMax = 60;
    this.hasPower = false;
    this.powerType = null;
    this.powerColor = 0xff8800;
    this.multiPowerMode = false;
    this.availablePowers = [];
    this.selectedPowerIndex = 0;
    this.allPowerCooldown = 0;
    this.allPowerCooldownMax = 480;

    // Movement enhancements
    this.coyoteTime = 0;
    this.jumpBuffer = 0;

    // Animations
    if (!scene.anims.exists('idle')) {
      scene.anims.create({ key: 'idle', frames: [{ key: 'player_idle_1' }, { key: 'player_idle_2' }], frameRate: 3, repeat: -1 });
      scene.anims.create({ key: 'run', frames: [{ key: 'player_run_1' }, { key: 'player_run_2' }, { key: 'player_run_3' }, { key: 'player_run_4' }], frameRate: 10, repeat: -1 });
      scene.anims.create({ key: 'jump', frames: [{ key: 'player_jump' }], frameRate: 1, repeat: 0 });
      scene.anims.create({ key: 'fall', frames: [{ key: 'player_fall' }], frameRate: 1, repeat: 0 });
    }

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.wasd = {
      up: scene.input.keyboard.addKey('W'), down: scene.input.keyboard.addKey('S'),
      left: scene.input.keyboard.addKey('A'), right: scene.input.keyboard.addKey('D')
    };
    this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.attackKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.allPowerKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.powerSwitchKeys = [
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE),
      scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX)
    ];
    this.escKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

    this.mobileDir = { x: 0, y: 0 };
    this.mobileJump = false; this.mobileDown = false; this.mobileAttack = false; this.mobileAll = false;

    this.dustEmitter = scene.add.particles(0, 0, 'particle', {
      speed: { min: 20, max: 60 }, scale: { start: 0.8, end: 0 },
      lifespan: 300, alpha: { start: 0.5, end: 0 }, tint: 0x888899,
      emitting: false, quantity: 2
    });
    this.dustEmitter.setDepth(9);
  }

  update() {
    if (this.isDead) return;

    const body = this.sprite.body;
    const onGround = body.onFloor() || body.touching.down;
    let moveDir = 0;

    const left = this.cursors.left.isDown || this.wasd.left.isDown || this.mobileDir.x < -0.3;
    const right = this.cursors.right.isDown || this.wasd.right.isDown || this.mobileDir.x > 0.3;
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.spaceKey) || Phaser.Input.Keyboard.JustDown(this.cursors.up) || Phaser.Input.Keyboard.JustDown(this.wasd.up) || this.mobileJump;
    const enterPressed = Phaser.Input.Keyboard.JustDown(this.enterKey) || this.mobileDown;
    
    // Pause Game
    if (Phaser.Input.Keyboard.JustDown(this.escKey)) {
      const currentKey = this.scene.scene.key;
      this.scene.scene.pause(currentKey);
      this.scene.scene.launch('Pause', { pausedScene: currentKey });
    }

    if (left) { moveDir = -1; this.facing = -1; }
    else if (right) { moveDir = 1; this.facing = 1; }

    this.sprite.setAccelerationX(moveDir * (onGround ? this.acceleration : this.airAcceleration));
    this.sprite.setDragX(moveDir === 0 ? (onGround ? this.friction : this.airFriction) : 0);
    this.sprite.setFlipX(this.facing === -1);

    // Coyote Time & Jump Buffer
    if (onGround) this.coyoteTime = 10; else this.coyoteTime--;
    if (jumpPressed) this.jumpBuffer = 10; else this.jumpBuffer--;

    if (this.jumpBuffer > 0 && this.coyoteTime > 0) {
      this.sprite.setVelocityY(this.jumpForce);
      this.coyoteTime = 0;
      this.jumpBuffer = 0;
      this.scene.tweens.add({
        targets: this.sprite,
        scaleX: 1.1,
        scaleY: 1.3,
        duration: 80,
        yoyo: true,
        ease: 'Sine.easeOut'
      });
      playSound('jump');
    }
    
    // Variable jump height
    if (!this.spaceKey.isDown && !this.mobileJump && !this.cursors.up.isDown && !this.wasd.up.isDown && body.velocity.y < -100) {
      this.sprite.setVelocityY(body.velocity.y * 0.9);
    }

    if (onGround && !this.wasOnGround) {
      playSound('land');
      this.dustEmitter.emitParticleAt(this.sprite.x, this.sprite.y + 34, 10);
      this.scene.cameras.main.shake(80, 0.003);
      this.scene.tweens.add({
        targets: this.sprite,
        scaleX: 1.26,
        scaleY: 1.08,
        duration: 70,
        yoyo: true,
        ease: 'Sine.easeOut'
      });
    }

    // Animation
    if (!onGround) {
      this.sprite.play(body.velocity.y < 0 ? 'jump' : 'fall', true);
    } else if (Math.abs(body.velocity.x) > 20) {
      this.sprite.play('run', true);
      this.dustEmitter.emitParticleAt(this.sprite.x, this.sprite.y + 34);
    } else {
      this.sprite.play('idle', true);
    }

    // Pipe entry via ENTER
    if (enterPressed && this.onPipe !== null && onGround) {
      playSound('enter');
      this.enterPipe(this.onPipe);
    }

    // Invulnerability frames
    if (this.invulnerable > 0) {
      this.invulnerable--;
      this.sprite.setAlpha(this.invulnerable % 10 < 5 ? 0.5 : 1);
    } else {
      this.sprite.setAlpha(1);
    }

    // Power attack
    if (this.powerCooldown > 0) this.powerCooldown--;
    if (this.allPowerCooldown > 0) this.allPowerCooldown--;
    if (this.multiPowerMode) {
      this.handlePowerSwitching();
      if ((Phaser.Input.Keyboard.JustDown(this.allPowerKey) || this.mobileAll) && this.allPowerCooldown <= 0) {
        this.useAllPowers();
      }
    }
    if ((Phaser.Input.Keyboard.JustDown(this.attackKey) || this.mobileAttack) && this.hasPower && this.powerCooldown <= 0) {
      this.usePower();
    }
    if (this.scene.hud && this.hasPower) {
      this.updatePowerHud();
    }

    this.wasOnGround = onGround;
    this.mobileJump = false; this.mobileDown = false; this.mobileAttack = false; this.mobileAll = false;
  }

  takeDamage(amount) {
    if (this.invulnerable > 0 || this.isDead) return;
    
    const hitDamage = this.maxHealth * 0.05;
    this.health = Math.max(1, this.health - hitDamage);
    this.updateHealthBar();

    playSound('hit');
    this.invulnerable = 60;
    this.sprite.setVelocityY(-250);
    this.sprite.setVelocityX(this.facing * -200);
    this.scene.cameras.main.shake(200, 0.02);

    if (this.scene.villainObj && this.scene.villainObj.checkTimeReverse) {
      this.scene.villainObj.checkTimeReverse();
    }
  }

  restoreHealth() {
    this.health = this.maxHealth;
    this.updateHealthBar();
  }

  updateHealthBar() {
    if (!this.healthBar) return;
    const pct = Phaser.Math.Clamp(this.health / this.maxHealth, 0, 1);
    this.healthBar.width = pct * 200;
    this.healthBar.setFillStyle(pct <= 0.25 ? 0xffdd33 : 0xff0000, 1);
  }

  createCastFX(px, py, color) {
    const scene = this.scene;
    const glow = scene.add.circle(this.sprite.x + this.facing * 18, py, 18, color, 0.18)
      .setDepth(18)
      .setBlendMode(Phaser.BlendModes.ADD);
    const ring = scene.add.circle(this.sprite.x + this.facing * 18, py, 24, color, 0)
      .setStrokeStyle(3, color, 0.85)
      .setDepth(19)
      .setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
      targets: glow,
      scale: 2.8,
      alpha: 0,
      duration: 340,
      ease: 'Cubic.easeOut',
      onComplete: () => glow.destroy()
    });
    scene.tweens.add({
      targets: ring,
      scale: 2.1,
      alpha: 0,
      duration: 360,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy()
    });
    scene.tweens.add({
      targets: this.sprite,
      scaleX: 1.32,
      scaleY: 1.08,
      duration: 80,
      yoyo: true,
      ease: 'Sine.easeOut'
    });

    for (let i = 0; i < 7; i++) {
      const angle = Phaser.Math.DegToRad(i * 51 + Phaser.Math.Between(-12, 12));
      const spark = scene.add.circle(px, py, Phaser.Math.Between(2, 4), color, 0.75)
        .setDepth(20)
        .setBlendMode(Phaser.BlendModes.ADD);
      scene.tweens.add({
        targets: spark,
        x: px + Math.cos(angle) * Phaser.Math.Between(32, 64),
        y: py + Math.sin(angle) * Phaser.Math.Between(20, 48),
        alpha: 0,
        duration: 320,
        ease: 'Sine.easeOut',
        onComplete: () => spark.destroy()
      });
    }
  }

  createPowerImpact(x, y, color, radius = 34) {
    const scene = this.scene;
    const pulse = scene.add.circle(x, y, radius * 0.35, color, 0.34)
      .setDepth(26)
      .setBlendMode(Phaser.BlendModes.ADD);
    const ring = scene.add.circle(x, y, radius, color, 0)
      .setStrokeStyle(3, color, 0.8)
      .setDepth(27)
      .setBlendMode(Phaser.BlendModes.ADD);

    scene.tweens.add({
      targets: pulse,
      scale: 2.2,
      alpha: 0,
      duration: 360,
      ease: 'Cubic.easeOut',
      onComplete: () => pulse.destroy()
    });
    scene.tweens.add({
      targets: ring,
      scale: 1.8,
      alpha: 0,
      duration: 420,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy()
    });
  }

  attachProjectileFX(proj, color, radius = 9) {
    const scene = this.scene;
    proj.trailEvent = scene.time.addEvent({
      delay: 36,
      loop: true,
      callback: () => {
        if (!proj.active) return;
        const dot = scene.add.circle(proj.x, proj.y, radius, color, 0.3)
          .setDepth(18)
          .setBlendMode(Phaser.BlendModes.ADD);
        scene.tweens.add({
          targets: dot,
          scale: 0.22,
          alpha: 0,
          duration: 260,
          ease: 'Sine.easeOut',
          onComplete: () => dot.destroy()
        });
      }
    });
    proj.pulseTween = scene.tweens.add({
      targets: proj,
      scaleX: proj.scaleX * 1.18,
      scaleY: proj.scaleY * 1.18,
      duration: 100,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  enableThanosPowers() {
    this.hasPower = true;
    this.multiPowerMode = true;
    this.availablePowers = THANOS_PLAYER_POWERS;
    this.powerCooldownMax = 75;
    this.allPowerCooldownMax = 480;
    this.selectPower(5, true);
  }

  getCurrentPower() {
    return this.availablePowers[this.selectedPowerIndex] || {
      key: this.powerType,
      label: 'POWER',
      color: this.powerColor || 0xff8800
    };
  }

  selectPower(index, silent = false) {
    if (!this.availablePowers[index]) return;
    this.selectedPowerIndex = index;
    const power = this.getCurrentPower();
    this.powerType = power.key;
    this.powerColor = power.color;
    if (!silent) {
      playSound('select');
      this.scene.tweens.add({
        targets: this.sprite,
        scaleX: 1.34,
        scaleY: 1.02,
        duration: 90,
        yoyo: true,
        ease: 'Sine.easeOut'
      });
    }
    this.updatePowerHud();
  }

  handlePowerSwitching() {
    this.powerSwitchKeys.forEach((key, index) => {
      if (Phaser.Input.Keyboard.JustDown(key)) {
        this.selectPower(index);
      }
    });
  }

  getPowerDamage() {
    return this.scene.villainObj && this.scene.villainObj.isThanos ? 5 : 15;
  }

  updatePowerHud() {
    if (!this.scene.hud || !this.hasPower) return;

    if (this.multiPowerMode) {
      const power = this.getCurrentPower();
      const allStatus = this.allPowerCooldown <= 0 ? 'READY' : Math.ceil(this.allPowerCooldown / 60) + 'S';
      this.scene.hud.setPower('[E] ' + power.label + '\n[1-6] SWITCH  [Q] ALL ' + allStatus, { raw: true, wide: true });
      this.scene.hud.setPowerCooldown(1 - this.powerCooldown / this.powerCooldownMax, this.powerCooldown <= 0, power.color);
      return;
    }

    this.scene.hud.setPowerCooldown(1 - this.powerCooldown / this.powerCooldownMax, this.powerCooldown <= 0, this.powerColor || 0xff8800);
  }

  usePower() {
    if (!this.hasPower || this.powerCooldown > 0) return;
    this.powerCooldown = this.powerCooldownMax; // 1 second cooldown
    const selectedPower = this.multiPowerMode ? this.getCurrentPower() : {
      key: this.powerType,
      color: this.powerColor || 0xff8800
    };
    
    // Play specific sound for the power
    if (selectedPower.key) playSound(selectedPower.key);
    else playSound('power');

    this.castPower(selectedPower.key, selectedPower.color, this.getPowerDamage());
  }

  useAllPowers() {
    if (!this.multiPowerMode || this.allPowerCooldown > 0) return;
    this.allPowerCooldown = this.allPowerCooldownMax;
    this.powerCooldown = Math.max(this.powerCooldown, 120);
    playSound('power');

    const scene = this.scene;
    const blastText = scene.add.text(this.sprite.x, this.sprite.y - 112, 'ALL POWERS', {
      fontFamily: '"Press Start 2P"',
      fontSize: '13px',
      color: '#ffffff',
      stroke: '#0a0a1a',
      strokeThickness: 5
    }).setOrigin(0.5).setDepth(80);

    scene.cameras.main.flash(220, 255, 255, 255);
    scene.tweens.add({
      targets: blastText,
      y: blastText.y - 52,
      alpha: 0,
      duration: 950,
      ease: 'Cubic.easeOut',
      onComplete: () => blastText.destroy()
    });

    this.availablePowers.forEach((power, index) => {
      scene.time.delayedCall(index * 65, () => {
        if (!this.sprite.active || this.isDead) return;
        this.castPower(power.key, power.color, 0);
      });
    });

    scene.time.delayedCall(240, () => {
      const villain = scene.villainObj;
      if (!villain || !villain.alive) return;
      const blastBounds = new Phaser.Geom.Rectangle(this.sprite.x - 540, this.sprite.y - 260, 1080, 520);
      if (Phaser.Geom.Intersects.RectangleToRectangle(blastBounds, villain.sprite.getBounds())) {
        villain.takeDamage(10);
        this.createPowerImpact(villain.sprite.x, villain.sprite.y, 0xffffff, 90);
      }
    });

    this.updatePowerHud();
  }

  castPower(powerType, color, damage) {
    if (!powerType) return;

    const scene = this.scene;
    const px = this.sprite.x + this.facing * 40;
    const py = this.sprite.y;
    this.createCastFX(px, py, color);

    // Realistic animated powers
    let proj = null;

    if (powerType === 'lightning') { // Thor
      proj = scene.add.rectangle(px + this.facing * 150, py, 22, 720, 0x44aaff, 0.82)
        .setOrigin(0.5, 1)
        .setDepth(24)
        .setBlendMode(Phaser.BlendModes.ADD);
      const core = scene.add.rectangle(proj.x, py, 7, 720, 0xffffff, 0.95)
        .setOrigin(0.5, 1)
        .setDepth(25)
        .setBlendMode(Phaser.BlendModes.ADD);
      for (let i = 0; i < 7; i++) {
        const branch = scene.add.rectangle(proj.x + Phaser.Math.Between(-32, 32), py - i * 86, 6, Phaser.Math.Between(42, 92), 0x9be7ff, 0.62)
          .setAngle(Phaser.Math.Between(-35, 35))
          .setDepth(24)
          .setBlendMode(Phaser.BlendModes.ADD);
        scene.tweens.add({ targets: branch, alpha: 0, scaleY: 0.2, duration: 260 + i * 15, ease: 'Cubic.easeOut', onComplete: () => branch.destroy() });
      }
      scene.tweens.add({ targets: [proj, core], scaleX: 0, alpha: 0, duration: 320, ease: 'Expo.easeOut', onComplete: () => { proj.destroy(); core.destroy(); } });
      scene.cameras.main.flash(200, 200, 200, 255);
      this.checkVillainHit(proj.getBounds(), damage);
      
    } else if (powerType === 'repulsor') { // Iron Man
      proj = scene.add.rectangle(px, py, 430, 14, 0xff4444, 0.7).setOrigin(0, 0.5).setDepth(24).setBlendMode(Phaser.BlendModes.ADD);
      const core = scene.add.rectangle(px, py, 430, 4, 0xfff1aa, 1).setOrigin(0, 0.5).setDepth(25).setBlendMode(Phaser.BlendModes.ADD);
      if (this.facing === -1) proj.setScale(-1, 1);
      if (this.facing === -1) core.setScale(-1, 1);
      scene.tweens.add({ targets: [proj, core], scaleY: 0, alpha: 0, duration: 380, ease: 'Expo.easeOut', onComplete: () => { proj.destroy(); core.destroy(); } });
      this.createPowerImpact(px + this.facing * 80, py, 0xff4444, 26);
      this.checkVillainHit(proj.getBounds(), damage);
      
    } else if (powerType === 'web') { // Spider-Man
      proj = scene.physics.add.image(px, py, 'particle').setScale(3).setTint(0xffffff);
      proj.body.setAllowGravity(false); proj.setVelocityX(this.facing * 600);
      this.attachProjectileFX(proj, 0xffffff, 8);
      const strand = scene.add.rectangle(px + this.facing * 115, py, 230, 2, 0xffffff, 0.55).setDepth(17);
      if (this.facing < 0) strand.setScale(-1, 1);
      scene.tweens.add({ targets: strand, alpha: 0, scaleY: 5, duration: 260, ease: 'Sine.easeOut', onComplete: () => strand.destroy() });
      this.createProjectileCollider(proj, damage);
      scene.time.delayedCall(1400, () => this.destroyProjectile(proj, false));
      
    } else if (powerType === 'slash') { // Black Panther
      proj = scene.add.text(px + this.facing*40, py, '///', { fontSize: '60px', color: '#8844ff', fontStyle: 'bold' }).setOrigin(0.5);
      proj.setDepth(25).setBlendMode(Phaser.BlendModes.ADD);
      if (this.facing === -1) proj.setScale(-1, 1);
      scene.tweens.add({ targets: proj, x: proj.x + this.facing*120, alpha: 0, scaleY: 0.68, duration: 320, ease: 'Cubic.easeOut', onComplete: () => proj.destroy() });
      this.createPowerImpact(px + this.facing * 90, py, 0x8844ff, 40);
      this.checkVillainHit(new Phaser.Geom.Rectangle(px - 100, py - 100, 200, 200), damage);

    } else if (powerType === 'shield') { // Cap America
      proj = scene.physics.add.image(px, py, 'particle').setScale(4).setTint(0x3366ff);
      proj.body.setAllowGravity(false); proj.setVelocityX(this.facing * 500);
      this.attachProjectileFX(proj, 0x87a8ff, 10);
      const spinTween = scene.tweens.add({ targets: proj, angle: 360, duration: 400, repeat: -1 });
      proj.spinTween = spinTween;
      scene.time.delayedCall(400, () => {
        if (proj.active && proj.body) {
          proj.setVelocityX(this.facing * -500);
        }
      });
      scene.time.delayedCall(800, () => {
        if (proj.spinTween) {
          proj.spinTween.stop();
          proj.spinTween = null;
        }
        this.destroyProjectile(proj, false);
      });
      this.createProjectileCollider(proj, damage);

    } else if (powerType === 'smash') { // Hulk
      proj = scene.add.circle(px, py + 30, 10, 0x33cc33);
      proj.setDepth(23).setBlendMode(Phaser.BlendModes.ADD);
      const dust = scene.add.circle(px, py + 48, 22, 0xd6ff7a, 0.16).setDepth(22);
      scene.tweens.add({ targets: proj, scaleX: 16, scaleY: 4.4, alpha: 0, duration: 460, ease: 'Cubic.easeOut', onComplete: () => proj.destroy() });
      scene.tweens.add({ targets: dust, scaleX: 9, scaleY: 1.8, alpha: 0, duration: 520, ease: 'Cubic.easeOut', onComplete: () => dust.destroy() });
      scene.cameras.main.shake(300, 0.03);
      this.checkVillainHit(new Phaser.Geom.Rectangle(px - 150, py - 150, 300, 300), damage);
    }
  }

  createProjectileCollider(proj, damage = 15) {
    if (!this.scene.villainObj) return;
    const collider = this.scene.physics.add.overlap(proj, this.scene.villainObj.sprite, () => {
      if (!proj.active || !this.scene.villainObj.alive) return;
      collider.destroy();
      if (damage > 0) this.scene.villainObj.takeDamage(damage);
      this.destroyProjectile(proj, true);
    });
  }

  destroyProjectile(proj, impact = true) {
    if (!proj || !proj.active) return;
    if (proj.spinTween) {
      proj.spinTween.stop();
      proj.spinTween = null;
    }
    if (proj.pulseTween) {
      proj.pulseTween.stop();
      proj.pulseTween = null;
    }
    if (proj.trailEvent) {
      proj.trailEvent.remove(false);
      proj.trailEvent = null;
    }
    if (impact) this.createPowerImpact(proj.x, proj.y, proj.tintTopLeft || this.powerColor || 0xff8800, 30);
    if (proj.body) {
      proj.body.enable = false;
      proj.setVelocity(0, 0);
    }
    proj.destroy();
  }

  checkVillainHit(bounds, damage = 15) {
    if (!this.scene.villainObj) return;
    const vBounds = this.scene.villainObj.sprite.getBounds();
    if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, vBounds)) {
      if (damage > 0) this.scene.villainObj.takeDamage(damage);
    }
  }

  enterPipe(tunnelIndex) {
    if (this.scene._transitioning) return;
    this.scene._transitioning = true;
    this.sprite.setVelocity(0, 0);
    this.sprite.body.enable = false;

    // Save current tunnel so we return to it!
    window.lastTunnelEntered = tunnelIndex;

    this.scene.tweens.add({
      targets: this.sprite, y: this.sprite.y + 96, alpha: 0, duration: 600, ease: 'Power2',
      onComplete: () => { this.scene.scene.start('TunnelTransition', { tunnel: tunnelIndex }); }
    });
  }

  destroy() {
    if (this.dustEmitter) this.dustEmitter.destroy();
    if (this.healthBg) { this.healthBg.destroy(); this.healthBar.destroy(); this.healthText.destroy(); }
  }
}
