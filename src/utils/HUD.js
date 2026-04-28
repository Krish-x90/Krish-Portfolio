import { isSoundEnabled, playSound, setSoundEnabled } from './SoundGen.js';

export class HUD {
  constructor(scene) {
    this.scene = scene;
    this.xp = 0;
    this.maxXp = 100;
    this.score = 0;
    this.levelName = '';
    this.items = [];
    this.skillNodes = [];
    this.lastPowerReady = false;

    const cam = scene.cameras.main;
    const isMobile = scene.sys.game.device.input.touch;
    const isPortrait = cam.height > cam.width;

    // --- Mobile portrait layout (stacked rows to avoid overlap) ---
    // Row 1: MENU button (center)        y = 68
    // Row 2: XP (left) | Level (right)   y = 108
    // Row 3: XP bar (center)             y = 130
    // Row 4: Sound (right)               y = 150
    // Row 5: Health bar (left)           y = 175
    const menuY   = isMobile && isPortrait ? 68  : 0;   // hidden on desktop via alpha
    const topY    = isMobile && isPortrait ? 108 : 16;
    const xpBarY  = isMobile && isPortrait ? 130 : 20;
    const topY2   = isMobile && isPortrait ? 150 : 48;

    this.levelText = scene.add.text(cam.width - 20, topY, '', {
      fontFamily: '"Press Start 2P"', fontSize: '14px', color: '#00f5ff',
      stroke: '#0a0a1a', strokeThickness: 4
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    // Score (top left)
    this.scoreText = scene.add.text(20, topY, 'XP: 0', {
      fontFamily: '"Press Start 2P"', fontSize: '14px', color: '#ffd700',
      stroke: '#0a0a1a', strokeThickness: 4
    }).setScrollFactor(0).setDepth(100);

    // XP bar background
    this.xpBarBg = scene.add.rectangle(cam.width / 2, xpBarY, 300, 14, 0x111122)
      .setScrollFactor(0).setDepth(100).setStrokeStyle(1, 0x00f5ff, 0.5);

    // XP bar fill
    this.xpBarFill = scene.add.rectangle(cam.width / 2 - 148, xpBarY, 0, 10, 0x00ff88)
      .setScrollFactor(0).setDepth(101).setOrigin(0, 0.5);

    // Power hint (bottom)
    this.powerBg = scene.add.rectangle(cam.width - 16, cam.height - 16, 278, 48, 0x070712, 0.72)
      .setOrigin(1, 1).setScrollFactor(0).setDepth(99)
      .setStrokeStyle(1, 0xff8800, 0.45).setAlpha(0);
    this.powerText = scene.add.text(cam.width - 20, cam.height - 20, '', {
      fontFamily: '"Press Start 2P"', fontSize: '10px', color: '#ff8800',
      stroke: '#0a0a1a', strokeThickness: 3
    }).setOrigin(1, 1).setScrollFactor(0).setDepth(100);
    this.powerCooldownBg = scene.add.rectangle(cam.width - 262, cam.height - 18, 216, 5, 0x1b1b2c, 0.95)
      .setOrigin(0, 1).setScrollFactor(0).setDepth(100).setAlpha(0);
    this.powerCooldownFill = scene.add.rectangle(cam.width - 262, cam.height - 18, 216, 3, 0xff8800, 1)
      .setOrigin(0, 1).setScrollFactor(0).setDepth(101).setAlpha(0);

    // Sound toggle
    this.soundText = scene.add.text(cam.width - 20, topY2, 'SOUND ON', {
      fontFamily: '"Press Start 2P"', fontSize: '9px', color: '#00ff88',
      backgroundColor: '#0a0a2ecc', padding: { x: 8, y: 5 }
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100).setInteractive({ useHandCursor: true });
    this.soundText.on('pointerover', () => {
      this.soundText.setColor('#ffd700');
      playSound('hover');
    });
    this.soundText.on('pointerout', () => this.updateSoundText());
    this.soundText.on('pointerdown', () => {
      setSoundEnabled(!isSoundEnabled());
      this.updateSoundText();
      playSound(isSoundEnabled() ? 'select' : 'error');
    });

    this.inventoryIcons = [];

    // MENU button — shown on ALL mobile scenes (top center)
    if (isMobile) {
      const btnY = isPortrait ? menuY : 16;
      const menuBtn = scene.add.text(cam.width / 2, btnY, '≡ MENU', {
        fontFamily: '"Press Start 2P"', fontSize: isPortrait ? '13px' : '9px', color: '#ffffff',
        backgroundColor: '#1a1a3acc', padding: { x: 14, y: 7 },
        stroke: '#00f5ff', strokeThickness: 1
      }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(200).setInteractive({ useHandCursor: true });

      menuBtn.on('pointerdown', () => {
        const currentKey = scene.scene.key;
        scene.scene.pause(currentKey);
        scene.scene.launch('Pause', { pausedScene: currentKey });
      });

      scene.tweens.add({
        targets: menuBtn,
        alpha: 0.65,
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }
  }

  updateSoundText() {
    this.soundText.setText(isSoundEnabled() ? 'SOUND ON' : 'SOUND OFF');
    this.soundText.setColor(isSoundEnabled() ? '#00ff88' : '#ff6666');
  }

  setLevel(name) {
    this.levelName = name;
    this.levelText.setText('LEVEL: ' + name);
  }

  addXP(amount) {
    this.xp = Math.min(this.xp + amount, this.maxXp);
    this.score += amount;
    this.scoreText.setText('XP: ' + this.score);
    this.xpBarFill.width = (this.xp / this.maxXp) * 296;
    this.scene.tweens.add({
      targets: this.scoreText,
      scaleX: 1.08,
      scaleY: 1.08,
      duration: 80,
      yoyo: true,
      ease: 'Sine.easeOut'
    });
  }

  addSkill(name) {
    if (this.items.includes(name)) {
      this.flashSkill(name);
      return;
    }
    this.items.push(name);
    this.setSkillLoadout(this.items);
    this.flashSkill(name);
    playSound('skill');
    this.addXP(5);
  }

  setSkillLoadout(skills, options = {}) {
    this.items = [...skills];
    this.skillNodes.forEach(node => node.destroy());
    this.skillNodes = [];
  }

  flashSkill(name) {
    const popup = this.scene.add.text(this.scene.cameras.main.width / 2, this.scene.cameras.main.height - 88, '+ ' + name, {
      fontFamily: '"Press Start 2P"', fontSize: '10px', color: '#00ff88',
      stroke: '#07110d', strokeThickness: 4
    }).setOrigin(0.5).setScrollFactor(0).setDepth(120);
    this.scene.tweens.add({
      targets: popup,
      y: popup.y - 34,
      alpha: 0,
      duration: 900,
      ease: 'Sine.easeOut',
      onComplete: () => popup.destroy()
    });
  }

  setPower(text, options = {}) {
    const label = options.raw ? text : '[E] ' + text;
    const wide = options.wide || label.includes('\n') || label.length > 28;
    this.powerText.setText(label);
    this.powerText.setLineSpacing(label.includes('\n') ? 5 : 0);
    this.powerBg.width = wide ? 460 : 278;
    this.powerBg.height = label.includes('\n') ? 64 : 48;
    this.powerBg.setAlpha(1);
    this.powerCooldownBg.setAlpha(1);
    this.powerCooldownFill.setAlpha(1);
  }

  setPowerCooldown(progress, ready, color = 0xff8800) {
    const pct = Math.max(0, Math.min(1, progress));
    this.powerCooldownFill.width = pct * 216;
    this.powerCooldownFill.setFillStyle(color, ready ? 1 : 0.72);
    this.powerBg.setStrokeStyle(1, color, ready ? 0.8 : 0.35);
    this.powerText.setColor(ready ? '#ffffff' : '#' + color.toString(16).padStart(6, '0'));
    this.powerText.setAlpha(ready ? 1 : 0.72);

    if (ready && !this.lastPowerReady && !this.powerReadyPulse) {
      this.powerReadyPulse = true;
      this.scene.tweens.add({
        targets: [this.powerBg, this.powerText],
        alpha: { from: 0.68, to: 1 },
        duration: 220,
        yoyo: true,
        ease: 'Sine.easeOut',
        onComplete: () => {
          this.powerReadyPulse = false;
          this.powerBg.setAlpha(1);
          this.powerText.setAlpha(1);
        }
      });
    }
    this.lastPowerReady = ready;
  }

  destroy() {
    this.levelText.destroy();
    this.scoreText.destroy();
    this.xpBarBg.destroy();
    this.xpBarFill.destroy();
    this.powerBg.destroy();
    this.powerText.destroy();
    this.powerCooldownBg.destroy();
    this.powerCooldownFill.destroy();
    this.soundText.destroy();
    this.inventoryIcons.forEach(i => i.destroy());
  }
}
