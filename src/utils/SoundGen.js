// ZzFX - Zuper Zmall Zound Zynth - Micro Edition
export const zzfx = (...t) => {
  let e = zzfxX.createBufferSource(), r = zzfxX.createBuffer(1, 99225, 44100), a = r.getChannelData(0), i = 0, s = 0, o = 0, c = 0, n = 0, l = 0, u = 0, f = 0, m = 0, z = 0, d = 0, h = 0, x = 0, y = 0, p = 0, b = 0, v = 0, M = 0, w = 0, A = t[0] || 1, g = t[1] || .05, k = t[2] || 220, C = (t[3] || 0) * Math.PI / 180, P = t[4] || 0, j = t[5] || 0, q = t[6] || 0, F = t[7] || 0, I = t[8] || 0, R = t[9] || 0, V = t[10] || 0, B = t[11] || 0, D = t[12] || 0, E = t[13] || 0, G = t[14] || 0, H = t[15] || 0, J = t[16] || 0, K = t[17] || 0, L = t[18] || 0, N = t[19] || 0;
  for (let O = 99225; O--;) {
    if (m = o = c + n, z = l + u, d = f, n += (z - n) * R, u += (d - u) * R, f += ((c ? c > 0 ? 1 : -1 : 0) - f) * R, x = j + q * Math.sin(y), y += P, M = V * Math.sin(w), w += B, A = 1, h = k + x + M, x = 44100 / h, M = 0 == I ? x / 2 : I * x, y = C += h * Math.PI / 22050, h = 0 == R ? Math.sin(C) : R > 0 ? (C % (2 * Math.PI) > Math.PI ? -1 : 1) : Math.random() * 2 - 1, h = Math.sign(h) * Math.pow(Math.abs(h), 1 - E), C %= 2 * Math.PI, g > i && i < 44100 * g ? A = i / (44100 * g) : i > 44100 * (g + F) && (A = 1 - (i - 44100 * (g + F)) / (44100 * J)), A < 0 && (A = 0), a[i++] = A * h * Math.cos(D * i / 44100) * Math.exp(-G * i / 44100), 0 == A && i > 44100 * (g + F)) break;
  }
  return e.buffer = r, e.connect(zzfxX.destination), e.start(), e;
};
export const zzfxX = new (window.AudioContext || window.webkitAudioContext)();

let soundEnabled = true;

const ensureAudio = () => {
  if (!soundEnabled) return false;
  if (zzfxX.state !== 'running') zzfxX.resume();
  return true;
};

export const setSoundEnabled = (enabled) => {
  soundEnabled = enabled;
  if (!soundEnabled) stopBGM();
};

export const isSoundEnabled = () => soundEnabled;

export const playSound = (type) => {
  if (!ensureAudio()) return;
  switch (type) {
    case 'jump': zzfx(1, 0.1, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0, 0, 0); break;
    case 'land': zzfx(0.5, 0.03, 90, 0, 0, 0.05, 1, 0.2, 0, -0.2, 0, 0, 0, 0, 0, 0, 0.08, 0, 0, 0); break;
    case 'hit': zzfx(1, 0.1, 100, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0.2, 0, 0, 0); break;
    case 'kill': zzfx(1.5, 0.2, 150, 0, 0, 0, 0, 0, 0, -0.5, 0, 0, 0, 0, 0, 0, 0.8, 0, 0, 0); break;
    case 'enter': zzfx(1, 0.1, 300, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0, 0, 0, 0, 0.4, 0, 0, 0); break;
    case 'start': zzfx(1, 0.08, 220, 0, 0.05, 0.05, 1, 0.1, 0, 1.2, 0, 0, 0, 0, 0, 0, 0.35, 0, 0, 0); break;
    case 'hover': zzfx(0.35, 0.02, 760, 0, 0, 0, 0, 0, 0, 0.2, 0, 0, 0, 0, 0, 0, 0.05, 0, 0, 0); break;
    case 'select': zzfx(0.8, 0.04, 540, 0, 0.02, 0, 1, 0.08, 0, 0.5, 0, 0, 0, 0, 0, 0, 0.18, 0, 0, 0); break;
    case 'skill': zzfx(0.9, 0.04, 880, 0, 0.08, 0.05, 1, 0.2, 0, 1, 0, 0, 0, 0, 0, 0, 0.22, 0, 0, 0); break;
    case 'coin': zzfx(0.7, 0.03, 980, 0, 0.02, 0, 1, 0.1, 0, 0.9, 0, 0, 0, 0, 0, 0, 0.12, 0, 0, 0); break;
    case 'power': zzfx(1, 0.06, 520, 0, 0.04, 0.05, 1, 0.3, 0, 0.7, 0, 0, 0, 0, 0, 0, 0.28, 0, 0, 0); break;
    case 'error': zzfx(0.5, 0.04, 120, 0, 0, 0.04, 0, 0.1, 0, -0.6, 0, 0, 0, 0, 0, 0, 0.1, 0, 0, 0); break;
    
    // Custom Avenger Sounds
    case 'lightning': zzfx(2, 0.05, 50, 0, 2, 0.5, 2, 1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0.5, 0, 0, 0); break; // thunder crash
    case 'repulsor': zzfx(1.2, 0.1, 800, 0, 0.1, 0, 1, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0.2, 0, 0, 0); break; // high laser
    case 'web': zzfx(1, 0.05, 1200, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0.1, 0, 0, 0); break; // THWIP
    case 'slash': zzfx(1.5, 0.05, 200, 0, 0.1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0.1, 0, 0, 0); break; // sharp shing
    case 'shield': zzfx(1, 0.1, 600, 0, 0.2, 0, 0.5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3, 0, 0, 0); break; // metal ring
    case 'smash': zzfx(2.5, 0.2, 80, 0, 0, 0.5, 0, 0.5, 0.1, 0, 0, 0, 0, 0, 0, 0, 0.6, 0, 0, 0); break; // low boom
  }
};

let bgmInt = null;

export const playBGM = (tunnelNum) => {
  stopBGM();
  if (!ensureAudio()) return;

  const scales = [
    [196.00, 261.63, 329.63, 392.00, 523.25], [220.00, 261.63, 329.63, 440.00],
    [293.66, 349.23, 440.00, 587.33], [329.63, 392.00, 493.88, 659.25],
    [261.63, 311.13, 392.00, 523.25], [392.00, 493.88, 587.33, 783.99]
  ];
  
  const track = Number.isFinite(tunnelNum) ? tunnelNum : 0;
  const scaleIndex = track <= 0 ? 0 : (track - 1) % scales.length;
  const scale = scales[scaleIndex];
  let step = 0;
  const interval = track <= 0 ? 520 : 360;

  bgmInt = setInterval(() => {
    if (!soundEnabled) return;
    const note = scale[Math.floor(Math.random() * scale.length)];
    const accent = step % 8 === 0 ? 1.7 : 1;
    zzfx(0.08 * accent, 0.03, note, 0, 0.02, 0, 0.7, 0.05, 0, 0, 0, 0, 0, 0, 0, 0, track <= 0 ? 0.25 : 0.14, 0, 0, 0);
    step++;
  }, interval);
};

export const playBossBGM = () => {
  stopBGM();
  if (!ensureAudio()) return;
  
  const scale = [150, 160, 200, 220];
  let step = 0;
  
  bgmInt = setInterval(() => {
    if (!soundEnabled) return;
    const note = scale[step % scale.length] * (Math.random() > 0.8 ? 2 : 1);
    zzfx(0.2, 0.1, note, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.1, 0, 0, 0);
    step++;
  }, 150);
};

export const stopBGM = () => {
  if (bgmInt) {
    clearInterval(bgmInt);
    bgmInt = null;
  }
};
