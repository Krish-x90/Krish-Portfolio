export class MobileControls {
  constructor(scene, player) {
    this.scene = scene;
    this.player = player;
    this.active = false;

    if (!scene.sys.game.device.input.touch) return;
    this.active = true;

    const cam = scene.cameras.main;
    const isPortrait = cam.height > cam.width;
    
    // In portrait, buttons are bigger and lower in the black space.
    const scale = isPortrait ? 2.2 : 1.2;
    const bx = isPortrait ? 180 : 100;
    const by = isPortrait ? cam.height - 280 : cam.height - 90;

    // Joystick
    this.base = scene.add.image(bx, by, 'joystick_base').setScrollFactor(0).setDepth(200).setAlpha(0.5).setScale(scale);
    this.knob = scene.add.image(bx, by, 'joystick_knob').setScrollFactor(0).setDepth(201).setAlpha(0.8).setScale(scale);

    const btnRadius = isPortrait ? 46 : 28;
    const rightCx = cam.width - (isPortrait ? 200 : 120);
    const rightCy = by;
    const offset = isPortrait ? 90 : 60;

    // Helper for retro buttons
    const createBtn = (x, y, color, label, key) => {
      const bezelOffset = isPortrait ? 8 : 4;
      const bezel = scene.add.circle(x, y + bezelOffset, btnRadius, 0x111111, 0.9).setScrollFactor(0).setDepth(199);
      const btn = scene.add.circle(x, y, btnRadius, color, 0.85).setScrollFactor(0).setDepth(200).setInteractive();
      btn.setStrokeStyle(isPortrait ? 8 : 4, 0xffffff, 1);
      
      const txt = scene.add.text(x, y, label, {
        fontFamily: '"Press Start 2P"', fontSize: isPortrait ? '14px' : '9px', color: '#ffffff'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
      
      const press = () => {
        if (btn.y === y) {
          btn.y += bezelOffset;
          txt.y += bezelOffset;
          btn.setFillStyle(color, 1);
        }
        if (key === 'jump') player.mobileJump = true;
        if (key === 'enter') player.mobileDown = true;
        if (key === 'attack') player.mobileAttack = true;
        if (key === 'switch' && player.multiPowerMode) {
          player.selectPower((player.selectedPowerIndex + 1) % player.availablePowers.length);
        }
      };
      const release = () => {
        if (btn.y > y) {
          btn.y -= bezelOffset;
          txt.y -= bezelOffset;
          btn.setFillStyle(color, 0.85);
        }
      };

      btn.on('pointerdown', press);
      btn.on('pointerup', release);
      btn.on('pointerout', release);
      
      return btn;
    };

    // SNES Diamond Layout
    // Bottom - Jump
    createBtn(rightCx, rightCy + offset, 0x22cc44, 'JUMP', 'jump');
    // Right - Enter
    createBtn(rightCx + offset, rightCy, 0x2244cc, 'ENTER', 'enter');
    // Left - Attack
    createBtn(rightCx - offset, rightCy, 0xcc2222, 'ATK', 'attack');
    
    if (player.multiPowerMode) {
      // Y (Top) - Switch Power
      createBtn(rightCx, rightCy - offset, 0xaaaa22, 'SW', 'switch');
      
      // All Powers - Start/Select style in the bottom center
      const allX = cam.width / 2;
      const allY = isPortrait ? cam.height - 140 : cam.height - 40;
      
      const bezelOffset = isPortrait ? 6 : 3;
      const allW = isPortrait ? 220 : 120;
      const allH = isPortrait ? 56 : 32;
      
      const allBezel = scene.add.rectangle(allX, allY + bezelOffset, allW, allH, 0x111111, 0.9).setScrollFactor(0).setDepth(199).setInteractive();
      const allBtn = scene.add.rectangle(allX, allY, allW, allH, 0xcc6622, 0.85).setScrollFactor(0).setDepth(200).setInteractive();
      allBtn.setStrokeStyle(isPortrait ? 4 : 2, 0xffffff, 0.6);
      const allTxt = scene.add.text(allX, allY, 'ALL POWERS', {
        fontFamily: '"Press Start 2P"', fontSize: isPortrait ? '14px' : '8px', color: '#ffffff'
      }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
      
      const pressAll = () => {
        if (allBtn.y === allY) {
          allBtn.y += bezelOffset;
          allTxt.y += bezelOffset;
          allBtn.setFillStyle(0xcc6622, 1);
        }
        player.mobileAll = true;
      };
      const releaseAll = () => {
        if (allBtn.y > allY) {
          allBtn.y -= bezelOffset;
          allTxt.y -= bezelOffset;
          allBtn.setFillStyle(0xcc6622, 0.85);
        }
      };
      
      allBtn.on('pointerdown', pressAll);
      allBtn.on('pointerup', releaseAll);
      allBtn.on('pointerout', releaseAll);
    }

    // Joystick drag
    this.base.setInteractive();
    scene.input.on('pointermove', (pointer) => {
      if (!pointer.isDown) return;
      const dx = pointer.x - bx;
      const dy = pointer.y - by;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const dragLimit = 120 * (isPortrait ? 1.5 : 1);
      if (dist > dragLimit) return;
      const maxDist = 30 * scale;
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
