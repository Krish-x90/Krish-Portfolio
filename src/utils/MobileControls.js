export class MobileControls {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.active = false;

    if (!scene.sys.game.device.input.touch) return;
    this.active = true;

    const cam = scene.cameras.main;
    const bx = 90, by = cam.height - 100;

    this.base = scene.add.image(bx, by, 'joystick_base').setScrollFactor(0).setDepth(200).setAlpha(0.6);
    this.knob = scene.add.image(bx, by, 'joystick_knob').setScrollFactor(0).setDepth(201).setAlpha(0.8);

    // Jump button
    this.jumpBtn = scene.add.image(cam.width - 80, by - 30, 'jump_btn').setScrollFactor(0).setDepth(200).setAlpha(0.6).setInteractive();
    this.jumpBtn.on('pointerdown', () => { player.mobileJump = true; });

    // Enter/down button
    this.downBtn = scene.add.image(cam.width - 150, by + 10, 'down_btn').setScrollFactor(0).setDepth(200).setAlpha(0.6).setInteractive();
    this.downBtn.on('pointerdown', () => { player.mobileDown = true; });

    // Attack button (for Avenger powers)
    const atkBtn = scene.add.circle(cam.width - 80, by + 50, 26, 0xff4444, 0.3).setScrollFactor(0).setDepth(200).setInteractive();
    scene.add.text(cam.width - 80, by + 50, 'E', {
      fontFamily: '"Press Start 2P"', fontSize: '12px', color: '#ff4444'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
    atkBtn.on('pointerdown', () => { player.mobileAttack = true; });

    // Joystick drag
    this.base.setInteractive();
    scene.input.on('pointermove', (pointer) => {
      if (!pointer.isDown) return;
      const dx = pointer.x - bx;
      const dy = pointer.y - by;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 120) return;
      const maxDist = 30;
      const clampDist = Math.min(dist, maxDist);
      const angle = Math.atan2(dy, dx);
      this.knob.x = bx + Math.cos(angle) * clampDist;
      this.knob.y = by + Math.sin(angle) * clampDist;
      player.mobileDir.x = Math.cos(angle) * (clampDist / maxDist);
      player.mobileDir.y = Math.sin(angle) * (clampDist / maxDist);
    });

    scene.input.on('pointerup', () => {
      this.knob.x = bx;
      this.knob.y = by;
      player.mobileDir.x = 0;
      player.mobileDir.y = 0;
    });
  }
}
