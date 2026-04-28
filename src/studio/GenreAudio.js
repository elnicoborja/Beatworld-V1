/** Ported from Replit V1 genre-audio.ts — all genre profiles preserved */

/**
 * @typedef {Object} GenreProfile
 * @property {number[]} scale
 * @property {number} rootHz
 * @property {number} swing
 * @property {Object} kick
 * @property {Object} snare
 * @property {Object} hat
 * @property {Object} perc
 * @property {Object} bass
 * @property {Object} lead
 * @property {Object} chord
 * @property {Object} arp
 * @property {Object} pad
 * @property {number[]} demo
 */

/**
 * @typedef {Object} CityProfileOverrides
 * @property {number} [rootHz]
 * @property {number} [swing]
 * @property {Object} [kick]
 * @property {Object} [snare]
 * @property {Object} [hat]
 * @property {Object} [perc]
 * @property {Object} [bass]
 * @property {Object} [lead]
 * @property {Object} [chord]
 * @property {Object} [arp]
 * @property {Object} [pad]
 * @property {number[]} [scale]
 */

const P = (s) => {
  const out = [];
  for (let oct = 0; oct < 3; oct++) for (const n of s) out.push(n + oct * 12);
  return out;
};

const CITY_PROFILES = {
  "new-york": {
    rootHz: 440,
    swing: 0.55,
    kick: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.1, frequency: 60, fm: 80 },
    snare: { attack: 0.005, decay: 0.15, sustain: 0, release: 0.05, frequency: 180 },
    hat: { attack: 0.002, decay: 0.08, sustain: 0, release: 0.02, frequency: 10000 },
    perc: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1, frequency: 2000 },
    bass: { attack: 0.02, decay: 0.3, sustain: 0.1, release: 0.15, frequency: 60, fm: 20 },
    lead: { attack: 0.05, decay: 0.4, sustain: 0.3, release: 0.2, frequency: 800, fm: 200 },
    chord: { attack: 0.08, decay: 0.5, sustain: 0.4, release: 0.3, frequency: 300, fm: 50 },
    arp: { attack: 0.02, decay: 0.25, sustain: 0.1, release: 0.15, frequency: 600 },
    pad: { attack: 0.5, decay: 1, sustain: 0.8, release: 1, frequency: 150, fm: 30 }
  },
  "los-angeles": {
    rootHz: 440,
    swing: 0.52,
    kick: { attack: 0.015, decay: 0.45, sustain: 0, release: 0.12, frequency: 55, fm: 70 },
    snare: { attack: 0.006, decay: 0.18, sustain: 0, release: 0.06, frequency: 200 },
    hat: { attack: 0.0025, decay: 0.09, sustain: 0, release: 0.025, frequency: 11000 },
    perc: { attack: 0.012, decay: 0.22, sustain: 0, release: 0.12, frequency: 2200 },
    bass: { attack: 0.025, decay: 0.35, sustain: 0.12, release: 0.18, frequency: 55, fm: 25 },
    lead: { attack: 0.06, decay: 0.45, sustain: 0.35, release: 0.25, frequency: 900, fm: 220 },
    chord: { attack: 0.09, decay: 0.55, sustain: 0.45, release: 0.35, frequency: 320, fm: 55 },
    arp: { attack: 0.025, decay: 0.28, sustain: 0.12, release: 0.18, frequency: 650 },
    pad: { attack: 0.55, decay: 1.1, sustain: 0.85, release: 1.1, frequency: 160, fm: 35 }
  },
  "detroit": {
    rootHz: 440,
    swing: 0.5,
    kick: { attack: 0.005, decay: 0.4, sustain: 0, release: 0.08, frequency: 80, fm: 100 },
    snare: { attack: 0.004, decay: 0.12, sustain: 0, release: 0.04, frequency: 150 },
    hat: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.015, frequency: 12000 },
    perc: { attack: 0.008, decay: 0.18, sustain: 0, release: 0.08, frequency: 2500 },
    bass: { attack: 0.015, decay: 0.25, sustain: 0.05, release: 0.1, frequency: 80, fm: 40 },
    lead: { attack: 0.04, decay: 0.35, sustain: 0.2, release: 0.15, frequency: 1000, fm: 250 },
    chord: { attack: 0.07, decay: 0.45, sustain: 0.3, release: 0.25, frequency: 400, fm: 80 },
    arp: { attack: 0.02, decay: 0.22, sustain: 0.08, release: 0.12, frequency: 800 },
    pad: { attack: 0.45, decay: 0.9, sustain: 0.7, release: 0.9, frequency: 200, fm: 50 }
  },
  "puerto-rico": {
    rootHz: 445,
    swing: 0.58,
    kick: { attack: 0.012, decay: 0.35, sustain: 0.02, release: 0.15, frequency: 70, fm: 60 },
    snare: { attack: 0.008, decay: 0.2, sustain: 0.01, release: 0.08, frequency: 220 },
    hat: { attack: 0.003, decay: 0.1, sustain: 0, release: 0.03, frequency: 9000 },
    perc: { attack: 0.01, decay: 0.25, sustain: 0.02, release: 0.1, frequency: 1800 },
    bass: { attack: 0.02, decay: 0.3, sustain: 0.15, release: 0.2, frequency: 65, fm: 30 },
    lead: { attack: 0.05, decay: 0.4, sustain: 0.3, release: 0.2, frequency: 700, fm: 150 },
    chord: { attack: 0.08, decay: 0.5, sustain: 0.4, release: 0.3, frequency: 280, fm: 45 },
    arp: { attack: 0.022, decay: 0.26, sustain: 0.12, release: 0.16, frequency: 550 },
    pad: { attack: 0.5, decay: 1, sustain: 0.8, release: 1, frequency: 140, fm: 28 }
  },
  "medellin": {
    rootHz: 442,
    swing: 0.56,
    kick: { attack: 0.01, decay: 0.38, sustain: 0.01, release: 0.12, frequency: 75, fm: 65 },
    snare: { attack: 0.007, decay: 0.18, sustain: 0, release: 0.07, frequency: 190 },
    hat: { attack: 0.0028, decay: 0.085, sustain: 0, release: 0.028, frequency: 9500 },
    perc: { attack: 0.009, decay: 0.23, sustain: 0.01, release: 0.09, frequency: 1900 },
    bass: { attack: 0.018, decay: 0.32, sustain: 0.12, release: 0.18, frequency: 70, fm: 28 },
    lead: { attack: 0.048, decay: 0.38, sustain: 0.28, release: 0.18, frequency: 750, fm: 160 },
    chord: { attack: 0.078, decay: 0.48, sustain: 0.38, release: 0.28, frequency: 300, fm: 50 },
    arp: { attack: 0.021, decay: 0.24, sustain: 0.11, release: 0.15, frequency: 600 },
    pad: { attack: 0.48, decay: 0.98, sustain: 0.78, release: 0.98, frequency: 155, fm: 32 }
  },
  "dominican-republic": {
    rootHz: 444,
    swing: 0.59,
    kick: { attack: 0.011, decay: 0.36, sustain: 0.015, release: 0.13, frequency: 72, fm: 62 },
    snare: { attack: 0.0075, decay: 0.19, sustain: 0.005, release: 0.075, frequency: 210 },
    hat: { attack: 0.003, decay: 0.095, sustain: 0, release: 0.032, frequency: 9200 },
    perc: { attack: 0.0095, decay: 0.24, sustain: 0.015, release: 0.095, frequency: 1750 },
    bass: { attack: 0.019, decay: 0.31, sustain: 0.13, release: 0.19, frequency: 68, fm: 29 },
    lead: { attack: 0.051, decay: 0.39, sustain: 0.31, release: 0.19, frequency: 720, fm: 155 },
    chord: { attack: 0.081, decay: 0.49, sustain: 0.41, release: 0.31, frequency: 290, fm: 48 },
    arp: { attack: 0.0225, decay: 0.255, sustain: 0.115, release: 0.165, frequency: 580 },
    pad: { attack: 0.5, decay: 1, sustain: 0.8, release: 1, frequency: 148, fm: 30 }
  },
  "rio": {
    rootHz: 443,
    swing: 0.57,
    kick: { attack: 0.013, decay: 0.42, sustain: 0.02, release: 0.14, frequency: 65, fm: 55 },
    snare: { attack: 0.0085, decay: 0.22, sustain: 0.01, release: 0.085, frequency: 240 },
    hat: { attack: 0.0035, decay: 0.105, sustain: 0, release: 0.035, frequency: 8800 },
    perc: { attack: 0.011, decay: 0.28, sustain: 0.02, release: 0.11, frequency: 1600 },
    bass: { attack: 0.022, decay: 0.36, sustain: 0.16, release: 0.22, frequency: 62, fm: 26 },
    lead: { attack: 0.055, decay: 0.44, sustain: 0.36, release: 0.22, frequency: 680, fm: 140 },
    chord: { attack: 0.085, decay: 0.54, sustain: 0.44, release: 0.36, frequency: 260, fm: 42 },
    arp: { attack: 0.024, decay: 0.288, sustain: 0.128, release: 0.176, frequency: 520 },
    pad: { attack: 0.52, decay: 1.04, sustain: 0.82, release: 1.04, frequency: 130, fm: 26 }
  },
  "fortaleza": {
    rootHz: 443,
    swing: 0.59,
    kick: { attack: 0.012, decay: 0.39, sustain: 0.018, release: 0.135, frequency: 68, fm: 58 },
    snare: { attack: 0.008, decay: 0.21, sustain: 0.008, release: 0.08, frequency: 225 },
    hat: { attack: 0.0032, decay: 0.1, sustain: 0, release: 0.03, frequency: 9000 },
    perc: { attack: 0.0105, decay: 0.26, sustain: 0.018, release: 0.105, frequency: 1700 },
    bass: { attack: 0.021, decay: 0.34, sustain: 0.15, release: 0.21, frequency: 65, fm: 27 },
    lead: { attack: 0.052, decay: 0.41, sustain: 0.33, release: 0.21, frequency: 710, fm: 148 },
    chord: { attack: 0.082, decay: 0.51, sustain: 0.41, release: 0.33, frequency: 275, fm: 45 },
    arp: { attack: 0.0235, decay: 0.267, sustain: 0.119, release: 0.161, frequency: 560 },
    pad: { attack: 0.51, decay: 1.02, sustain: 0.81, release: 1.02, frequency: 138, fm: 28 }
  },
  "sao-paulo": {
    rootHz: 441,
    swing: 0.55,
    kick: { attack: 0.014, decay: 0.44, sustain: 0.022, release: 0.15, frequency: 62, fm: 52 },
    snare: { attack: 0.009, decay: 0.24, sustain: 0.012, release: 0.09, frequency: 255 },
    hat: { attack: 0.0038, decay: 0.114, sustain: 0, release: 0.038, frequency: 8500 },
    perc: { attack: 0.012, decay: 0.3, sustain: 0.022, release: 0.12, frequency: 1500 },
    bass: { attack: 0.024, decay: 0.39, sustain: 0.18, release: 0.24, frequency: 58, fm: 23 },
    lead: { attack: 0.06, decay: 0.48, sustain: 0.4, release: 0.24, frequency: 650, fm: 130 },
    chord: { attack: 0.09, decay: 0.58, sustain: 0.48, release: 0.4, frequency: 245, fm: 39 },
    arp: { attack: 0.026, decay: 0.312, sustain: 0.14, release: 0.184, frequency: 490 },
    pad: { attack: 0.54, decay: 1.08, sustain: 0.85, release: 1.08, frequency: 125, fm: 25 }
  },
  "luanda": {
    rootHz: 445,
    swing: 0.61,
    kick: { attack: 0.016, decay: 0.48, sustain: 0.025, release: 0.16, frequency: 75, fm: 70 },
    snare: { attack: 0.01, decay: 0.26, sustain: 0.014, release: 0.1, frequency: 270 },
    hat: { attack: 0.004, decay: 0.12, sustain: 0, release: 0.04, frequency: 10500 },
    perc: { attack: 0.014, decay: 0.32, sustain: 0.025, release: 0.14, frequency: 2000 },
    bass: { attack: 0.026, decay: 0.42, sustain: 0.2, release: 0.26, frequency: 75, fm: 32 },
    lead: { attack: 0.065, decay: 0.52, sustain: 0.44, release: 0.26, frequency: 800, fm: 180 },
    chord: { attack: 0.095, decay: 0.62, sustain: 0.52, release: 0.44, frequency: 320, fm: 60 },
    arp: { attack: 0.028, decay: 0.336, sustain: 0.152, release: 0.2, frequency: 640 },
    pad: { attack: 0.56, decay: 1.12, sustain: 0.88, release: 1.12, frequency: 170, fm: 36 }
  },
  "bogota": {
    rootHz: 441,
    swing: 0.54,
    kick: { attack: 0.011, decay: 0.37, sustain: 0.012, release: 0.125, frequency: 78, fm: 68 },
    snare: { attack: 0.0078, decay: 0.195, sustain: 0.006, release: 0.078, frequency: 175 },
    hat: { attack: 0.0028, decay: 0.084, sustain: 0, release: 0.028, frequency: 9800 },
    perc: { attack: 0.009, decay: 0.234, sustain: 0.012, release: 0.093, frequency: 2100 },
    bass: { attack: 0.019, decay: 0.296, sustain: 0.11, release: 0.186, frequency: 72, fm: 31 },
    lead: { attack: 0.049, decay: 0.371, sustain: 0.276, release: 0.186, frequency: 770, fm: 168 },
    chord: { attack: 0.079, decay: 0.461, sustain: 0.371, release: 0.276, frequency: 310, fm: 52 },
    arp: { attack: 0.0209, decay: 0.234, sustain: 0.108, release: 0.155, frequency: 620 },
    pad: { attack: 0.49, decay: 0.98, sustain: 0.78, release: 0.98, frequency: 160, fm: 33 }
  },
  "london": {
    rootHz: 440,
    swing: 0.51,
    kick: { attack: 0.008, decay: 0.42, sustain: 0, release: 0.1, frequency: 65, fm: 75 },
    snare: { attack: 0.005, decay: 0.14, sustain: 0, release: 0.05, frequency: 160 },
    hat: { attack: 0.002, decay: 0.07, sustain: 0, release: 0.02, frequency: 11500 },
    perc: { attack: 0.009, decay: 0.2, sustain: 0, release: 0.09, frequency: 2800 },
    bass: { attack: 0.017, decay: 0.28, sustain: 0.08, release: 0.13, frequency: 65, fm: 35 },
    lead: { attack: 0.042, decay: 0.37, sustain: 0.25, release: 0.17, frequency: 950, fm: 240 },
    chord: { attack: 0.072, decay: 0.47, sustain: 0.35, release: 0.27, frequency: 380, fm: 70 },
    arp: { attack: 0.019, decay: 0.235, sustain: 0.095, release: 0.145, frequency: 760 },
    pad: { attack: 0.47, decay: 0.94, sustain: 0.75, release: 0.94, frequency: 180, fm: 40 }
  },
  "buenos-aires": {
    rootHz: 440,
    swing: 0.53,
    kick: { attack: 0.009, decay: 0.41, sustain: 0.005, release: 0.11, frequency: 70, fm: 78 },
    snare: { attack: 0.0055, decay: 0.16, sustain: 0.002, release: 0.055, frequency: 195 },
    hat: { attack: 0.0022, decay: 0.078, sustain: 0, release: 0.022, frequency: 11200 },
    perc: { attack: 0.0095, decay: 0.22, sustain: 0.005, release: 0.095, frequency: 2600 },
    bass: { attack: 0.018, decay: 0.295, sustain: 0.09, release: 0.14, frequency: 68, fm: 36 },
    lead: { attack: 0.045, decay: 0.385, sustain: 0.27, release: 0.18, frequency: 920, fm: 235 },
    chord: { attack: 0.075, decay: 0.485, sustain: 0.37, release: 0.28, frequency: 370, fm: 68 },
    arp: { attack: 0.0205, decay: 0.245, sustain: 0.1, release: 0.15, frequency: 740 },
    pad: { attack: 0.48, decay: 0.96, sustain: 0.76, release: 0.96, frequency: 175, fm: 38 }
  },
  "santiago": {
    rootHz: 441,
    swing: 0.52,
    kick: { attack: 0.0085, decay: 0.405, sustain: 0.004, release: 0.107, frequency: 72, fm: 80 },
    snare: { attack: 0.0052, decay: 0.158, sustain: 0.0015, release: 0.052, frequency: 205 },
    hat: { attack: 0.0021, decay: 0.075, sustain: 0, release: 0.021, frequency: 11400 },
    perc: { attack: 0.0092, decay: 0.215, sustain: 0.004, release: 0.092, frequency: 2700 },
    bass: { attack: 0.0175, decay: 0.288, sustain: 0.085, release: 0.135, frequency: 70, fm: 37 },
    lead: { attack: 0.043, decay: 0.375, sustain: 0.26, release: 0.175, frequency: 940, fm: 242 },
    chord: { attack: 0.073, decay: 0.473, sustain: 0.36, release: 0.27, frequency: 375, fm: 70 },
    arp: { attack: 0.0198, decay: 0.239, sustain: 0.097, release: 0.147, frequency: 755 },
    pad: { attack: 0.475, decay: 0.95, sustain: 0.755, release: 0.95, frequency: 178, fm: 39 }
  },
  "mexico-city": {
    rootHz: 442,
    swing: 0.555,
    kick: { attack: 0.0105, decay: 0.39, sustain: 0.01, release: 0.13, frequency: 73, fm: 63 },
    snare: { attack: 0.0072, decay: 0.185, sustain: 0.004, release: 0.072, frequency: 205 },
    hat: { attack: 0.003, decay: 0.092, sustain: 0, release: 0.03, frequency: 9400 },
    perc: { attack: 0.0102, decay: 0.248, sustain: 0.015, release: 0.102, frequency: 1850 },
    bass: { attack: 0.0195, decay: 0.325, sustain: 0.135, release: 0.195, frequency: 69, fm: 29 },
    lead: { attack: 0.0505, decay: 0.395, sustain: 0.305, release: 0.195, frequency: 735, fm: 158 },
    chord: { attack: 0.0805, decay: 0.495, sustain: 0.405, release: 0.305, frequency: 295, fm: 49 },
    arp: { attack: 0.0228, decay: 0.263, sustain: 0.118, release: 0.168, frequency: 590 },
    pad: { attack: 0.495, decay: 0.99, sustain: 0.79, release: 0.99, frequency: 150, fm: 31 }
  },
  "monterrey": {
    rootHz: 441,
    swing: 0.545,
    kick: { attack: 0.01, decay: 0.375, sustain: 0.008, release: 0.12, frequency: 75, fm: 65 },
    snare: { attack: 0.007, decay: 0.18, sustain: 0.003, release: 0.07, frequency: 215 },
    hat: { attack: 0.0029, decay: 0.088, sustain: 0, release: 0.029, frequency: 9600 },
    perc: { attack: 0.009, decay: 0.238, sustain: 0.012, release: 0.09, frequency: 1950 },
    bass: { attack: 0.018, decay: 0.31, sustain: 0.125, release: 0.18, frequency: 71, fm: 30 },
    lead: { attack: 0.047, decay: 0.38, sustain: 0.285, release: 0.18, frequency: 760, fm: 165 },
    chord: { attack: 0.077, decay: 0.48, sustain: 0.38, release: 0.285, frequency: 305, fm: 51 },
    arp: { attack: 0.0215, decay: 0.253, sustain: 0.113, release: 0.163, frequency: 610 },
    pad: { attack: 0.48, decay: 0.96, sustain: 0.77, release: 0.96, frequency: 155, fm: 32 }
  },
  "tulum": {
    rootHz: 443,
    swing: 0.58,
    kick: { attack: 0.0115, decay: 0.365, sustain: 0.014, release: 0.14, frequency: 71, fm: 61 },
    snare: { attack: 0.0082, decay: 0.208, sustain: 0.008, release: 0.082, frequency: 228 },
    hat: { attack: 0.0033, decay: 0.103, sustain: 0, release: 0.033, frequency: 8900 },
    perc: { attack: 0.0108, decay: 0.272, sustain: 0.02, release: 0.108, frequency: 1680 },
    bass: { attack: 0.0215, decay: 0.338, sustain: 0.152, release: 0.215, frequency: 66, fm: 28 },
    lead: { attack: 0.053, decay: 0.408, sustain: 0.322, release: 0.215, frequency: 705, fm: 152 },
    chord: { attack: 0.083, decay: 0.508, sustain: 0.408, release: 0.322, frequency: 283, fm: 46 },
    arp: { attack: 0.0232, decay: 0.277, sustain: 0.123, release: 0.169, frequency: 565 },
    pad: { attack: 0.505, decay: 1.01, sustain: 0.805, release: 1.01, frequency: 142, fm: 29 }
  },
  "amsterdam": {
    rootHz: 440,
    swing: 0.49,
    kick: { attack: 0.006, decay: 0.38, sustain: 0, release: 0.075, frequency: 90, fm: 110 },
    snare: { attack: 0.004, decay: 0.11, sustain: 0, release: 0.038, frequency: 140 },
    hat: { attack: 0.0015, decay: 0.058, sustain: 0, release: 0.015, frequency: 12500 },
    perc: { attack: 0.007, decay: 0.16, sustain: 0, release: 0.07, frequency: 3000 },
    bass: { attack: 0.014, decay: 0.23, sustain: 0.06, release: 0.11, frequency: 90, fm: 50 },
    lead: { attack: 0.038, decay: 0.32, sustain: 0.2, release: 0.13, frequency: 1100, fm: 280 },
    chord: { attack: 0.068, decay: 0.42, sustain: 0.3, release: 0.22, frequency: 420, fm: 90 },
    arp: { attack: 0.017, decay: 0.205, sustain: 0.08, release: 0.125, frequency: 840 },
    pad: { attack: 0.44, decay: 0.88, sustain: 0.7, release: 0.88, frequency: 210, fm: 50 }
  },
  "paris": {
    rootHz: 440,
    swing: 0.5,
    kick: { attack: 0.007, decay: 0.39, sustain: 0, release: 0.08, frequency: 85, fm: 100 },
    snare: { attack: 0.0045, decay: 0.125, sustain: 0, release: 0.045, frequency: 155 },
    hat: { attack: 0.0018, decay: 0.065, sustain: 0, release: 0.018, frequency: 12200 },
    perc: { attack: 0.0082, decay: 0.19, sustain: 0, release: 0.082, frequency: 2900 },
    bass: { attack: 0.0158, decay: 0.263, sustain: 0.07, release: 0.125, frequency: 85, fm: 45 },
    lead: { attack: 0.041, decay: 0.35, sustain: 0.23, release: 0.15, frequency: 1050, fm: 265 },
    chord: { attack: 0.071, decay: 0.45, sustain: 0.33, release: 0.25, frequency: 400, fm: 80 },
    arp: { attack: 0.0185, decay: 0.235, sustain: 0.095, release: 0.14, frequency: 800 },
    pad: { attack: 0.45, decay: 0.9, sustain: 0.72, release: 0.9, frequency: 200, fm: 45 }
  },
  "berlin": {
    rootHz: 440,
    swing: 0.48,
    kick: { attack: 0.005, decay: 0.35, sustain: 0, release: 0.07, frequency: 100, fm: 120 },
    snare: { attack: 0.0038, decay: 0.105, sustain: 0, release: 0.035, frequency: 130 },
    hat: { attack: 0.0013, decay: 0.052, sustain: 0, release: 0.013, frequency: 13000 },
    perc: { attack: 0.006, decay: 0.15, sustain: 0, release: 0.06, frequency: 3200 },
    bass: { attack: 0.012, decay: 0.21, sustain: 0.04, release: 0.09, frequency: 100, fm: 60 },
    lead: { attack: 0.035, decay: 0.3, sustain: 0.18, release: 0.12, frequency: 1200, fm: 320 },
    chord: { attack: 0.065, decay: 0.4, sustain: 0.27, release: 0.2, frequency: 460, fm: 105 },
    arp: { attack: 0.015, decay: 0.19, sustain: 0.07, release: 0.115, frequency: 920 },
    pad: { attack: 0.42, decay: 0.84, sustain: 0.67, release: 0.84, frequency: 230, fm: 60 }
  },
  "moscow": {
    rootHz: 439,
    swing: 0.49,
    kick: { attack: 0.0065, decay: 0.375, sustain: 0, release: 0.082, frequency: 95, fm: 115 },
    snare: { attack: 0.004, decay: 0.118, sustain: 0, release: 0.04, frequency: 145 },
    hat: { attack: 0.0016, decay: 0.06, sustain: 0, release: 0.016, frequency: 12800 },
    perc: { attack: 0.0075, decay: 0.175, sustain: 0, release: 0.075, frequency: 3100 },
    bass: { attack: 0.0145, decay: 0.245, sustain: 0.055, release: 0.105, frequency: 95, fm: 55 },
    lead: { attack: 0.0385, decay: 0.335, sustain: 0.215, release: 0.14, frequency: 1150, fm: 300 },
    chord: { attack: 0.0685, decay: 0.435, sustain: 0.315, release: 0.235, frequency: 440, fm: 95 },
    arp: { attack: 0.018, decay: 0.22, sustain: 0.085, release: 0.13, frequency: 880 },
    pad: { attack: 0.44, decay: 0.88, sustain: 0.7, release: 0.88, frequency: 215, fm: 52 }
  },
  "newcastle": {
    rootHz: 440,
    swing: 0.505,
    kick: { attack: 0.0075, decay: 0.395, sustain: 0, release: 0.085, frequency: 82, fm: 92 },
    snare: { attack: 0.0048, decay: 0.135, sustain: 0, release: 0.048, frequency: 168 },
    hat: { attack: 0.002, decay: 0.07, sustain: 0, release: 0.02, frequency: 11800 },
    perc: { attack: 0.0088, decay: 0.205, sustain: 0, release: 0.088, frequency: 2750 },
    bass: { attack: 0.0172, decay: 0.276, sustain: 0.078, release: 0.135, frequency: 82, fm: 40 },
    lead: { attack: 0.0438, decay: 0.365, sustain: 0.255, release: 0.16, frequency: 1025, fm: 250 },
    chord: { attack: 0.0738, decay: 0.465, sustain: 0.355, release: 0.27, frequency: 390, fm: 75 },
    arp: { attack: 0.0195, decay: 0.248, sustain: 0.103, release: 0.15, frequency: 780 },
    pad: { attack: 0.46, decay: 0.92, sustain: 0.735, release: 0.92, frequency: 192, fm: 42 }
  },
  "brighton": {
    rootHz: 440,
    swing: 0.51,
    kick: { attack: 0.0082, decay: 0.408, sustain: 0, release: 0.092, frequency: 80, fm: 88 },
    snare: { attack: 0.005, decay: 0.14, sustain: 0, release: 0.05, frequency: 172 },
    hat: { attack: 0.0021, decay: 0.073, sustain: 0, release: 0.021, frequency: 11600 },
    perc: { attack: 0.0092, decay: 0.217, sustain: 0, release: 0.092, frequency: 2650 },
    bass: { attack: 0.0182, decay: 0.286, sustain: 0.082, release: 0.142, frequency: 80, fm: 38 },
    lead: { attack: 0.0458, decay: 0.381, sustain: 0.268, release: 0.168, frequency: 1000, fm: 242 },
    chord: { attack: 0.0768, decay: 0.481, sustain: 0.368, release: 0.282, frequency: 375, fm: 72 },
    arp: { attack: 0.0205, decay: 0.259, sustain: 0.108, release: 0.157, frequency: 750 },
    pad: { attack: 0.47, decay: 0.94, sustain: 0.745, release: 0.94, frequency: 185, fm: 40 }
  },
  "sydney": {
    rootHz: 441,
    swing: 0.54,
    kick: { attack: 0.0095, decay: 0.425, sustain: 0.005, release: 0.115, frequency: 76, fm: 82 },
    snare: { attack: 0.0053, decay: 0.163, sustain: 0.002, release: 0.053, frequency: 198 },
    hat: { attack: 0.0024, decay: 0.082, sustain: 0, release: 0.024, frequency: 11000 },
    perc: { attack: 0.0105, decay: 0.227, sustain: 0.008, release: 0.105, frequency: 2500 },
    bass: { attack: 0.019, decay: 0.305, sustain: 0.095, release: 0.15, frequency: 76, fm: 39 },
    lead: { attack: 0.046, decay: 0.395, sustain: 0.285, release: 0.18, frequency: 900, fm: 225 },
    chord: { attack: 0.076, decay: 0.495, sustain: 0.385, release: 0.295, frequency: 360, fm: 68 },
    arp: { attack: 0.0215, decay: 0.265, sustain: 0.112, release: 0.16, frequency: 720 },
    pad: { attack: 0.48, decay: 0.96, sustain: 0.76, release: 0.96, frequency: 180, fm: 38 }
  }
};

const mergeProfile = (base, overrides) => {
  if (!overrides) return base;
  const result = { ...base };
  for (const key in overrides) {
    if (overrides[key] !== undefined) {
      if (typeof overrides[key] === 'object' && !Array.isArray(overrides[key])) {
        result[key] = { ...result[key], ...overrides[key] };
      } else {
        result[key] = overrides[key];
      }
    }
  }
  return result;
};

const GENRE_PROFILES = {
  "Hip Hop": {
    scale: P([0, 3, 5, 7, 10]),
    rootHz: 110,
    swing: 0.55,
    kick: { attack: 0.01, decay: 0.5, sustain: 0, release: 0.1, frequency: 60, fm: 80 },
    snare: { attack: 0.005, decay: 0.15, sustain: 0, release: 0.05, frequency: 180 },
    hat: { attack: 0.002, decay: 0.08, sustain: 0, release: 0.02, frequency: 10000 },
    perc: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.1, frequency: 2000 },
    bass: { attack: 0.02, decay: 0.3, sustain: 0.1, release: 0.15, frequency: 60, fm: 20 },
    lead: { attack: 0.05, decay: 0.4, sustain: 0.3, release: 0.2, frequency: 800, fm: 200 },
    chord: { attack: 0.08, decay: 0.5, sustain: 0.4, release: 0.3, frequency: 300, fm: 50 },
    arp: { attack: 0.02, decay: 0.25, sustain: 0.1, release: 0.15, frequency: 600 },
    pad: { attack: 0.5, decay: 1, sustain: 0.8, release: 1, frequency: 150, fm: 30 },
    demo: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
  },
  "West Coast Hip Hop": {
    scale: P([0, 3, 7]),
    rootHz: 110,
    swing: 0.52,
    kick: { attack: 0.015, decay: 0.45, sustain: 0, release: 0.12, frequency: 55, fm: 70 },
    snare: { attack: 0.006, decay: 0.18, sustain: 0, release: 0.06, frequency: 200 },
    hat: { attack: 0.0025, decay: 0.09, sustain: 0, release: 0.025, frequency: 11000 },
    perc: { attack: 0.012, decay: 0.22, sustain: 0, release: 0.12, frequency: 2200 },
    bass: { attack: 0.025, decay: 0.35, sustain: 0.12, release: 0.18, frequency: 55, fm: 25 },
    lead: { attack: 0.06, decay: 0.45, sustain: 0.35, release: 0.25, frequency: 900, fm: 220 },
    chord: { attack: 0.09, decay: 0.55, sustain: 0.45, release: 0.35, frequency: 320, fm: 55 },
    arp: { attack: 0.025, decay: 0.28, sustain: 0.12, release: 0.18, frequency: 650 },
    pad: { attack: 0.55, decay: 1.1, sustain: 0.85, release: 1.1, frequency: 160, fm: 35 },
    demo: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
  },
  "Techno": {
    scale: P([0, 3, 5, 7, 10]),
    rootHz: 130,
    swing: 0.5,
    kick: { attack: 0.005, decay: 0.4, sustain: 0, release: 0.08, frequency: 80, fm: 100 },
    snare: { attack: 0.004, decay: 0.12, sustain: 0, release: 0.04, frequency: 150 },
    hat: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.015, frequency: 12000 },
    perc: { attack: 0.008, decay: 0.18, sustain: 0, release: 0.08, frequency: 2500 },
    bass: { attack: 0.015, decay: 0.25, sustain: 0.05, release: 0.1, frequency: 80, fm: 40 },
    lead: { attack: 0.04, decay: 0.35, sustain: 0.2, release: 0.15, frequency: 1000, fm: 250 },
    chord: { attack: 0.07, decay: 0.45, sustain: 0.3, release: 0.25, frequency: 400, fm: 80 },
    arp: { attack: 0.02, decay: 0.22, sustain: 0.08, release: 0.12, frequency: 800 },
    pad: { attack: 0.45, decay: 0.9, sustain: 0.7, release: 0.9, frequency: 200, fm: 50 },
    demo: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
  },
  "Reggaeton": {
    scale: P([0, 3, 5, 7, 10]),
    rootHz: 100,
    swing: 0.58,
    kick: { attack: 0.012, decay: 0.35, sustain: 0.02, release: 0.15, frequency: 70, fm: 60 },
    snare: { attack: 0.008, decay: 0.2, sustain: 0.01, release: 0.08, frequency: 220 },
    hat: { attack: 0.003, decay: 0.1, sustain: 0, release: 0.03, frequency: 9000 },
    perc: { attack: 0.01, decay: 0.25, sustain: 0.02, release: 0.1, frequency: 1800 },
    bass: { attack: 0.02, decay: 0.3, sustain: 0.15, release: 0.2, frequency: 65, fm: 30 },
    lead: { attack: 0.05, decay: 0.4, sustain: 0.3, release: 0.2, frequency: 700, fm: 150 },
    chord: { attack: 0.08, decay: 0.5, sustain: 0.4, release: 0.3, frequency: 280, fm: 45 },
    arp: { attack: 0.022, decay: 0.26, sustain: 0.12, release: 0.16, frequency: 550 },
    pad: { attack: 0.5, decay: 1, sustain: 0.8, release: 1, frequency: 140, fm: 28 },
    demo: [0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1]
  },
  "Fast Dembow": {
    scale: P([0, 3, 7]),
    rootHz: 108,
    swing: 0.62,
    kick: { attack: 0.008, decay: 0.28, sustain: 0.015, release: 0.12, frequency: 75, fm: 65 },
    snare: { attack: 0.006, decay: 0.16, sustain: 0.008, release: 0.06, frequency: 240 },
    hat: { attack: 0.002, decay: 0.08, sustain: 0, release: 0.02, frequency: 8500 },
    perc: { attack: 0.009, decay: 0.22, sustain: 0.01, release: 0.09, frequency: 1700 },
    bass: { attack: 0.018, decay: 0.26, sustain: 0.12, release: 0.18, frequency: 70, fm: 28 },
    lead: { attack: 0.048, decay: 0.36, sustain: 0.28, release: 0.18, frequency: 750, fm: 160 },
    chord: { attack: 0.078, decay: 0.46, sustain: 0.36, release: 0.28, frequency: 300, fm: 50 },
    arp: { attack: 0.021, decay: 0.23, sustain: 0.11, release: 0.15, frequency: 600 },
    pad: { attack: 0.48, decay: 0.96, sustain: 0.78, release: 0.96, frequency: 155, fm: 32 },
    demo: [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0]
  },
  "Baile Funk": {
    scale: P([0, 5, 7, 10]),
    rootHz: 130,
    swing: 0.61,
    kick: { attack: 0.01, decay: 0.32, sustain: 0.018, release: 0.14, frequency: 72, fm: 62 },
    snare: { attack: 0.0075, decay: 0.19, sustain: 0.005, release: 0.075, frequency: 210 },
    hat: { attack: 0.003, decay: 0.095, sustain: 0, release: 0.032, frequency: 9200 },
    perc: { attack: 0.0095, decay: 0.24, sustain: 0.015, release: 0.095, frequency: 1750 },
    bass: { attack: 0.019, decay: 0.31, sustain: 0.13, release: 0.19, frequency: 68, fm: 29 },
    lead: { attack: 0.051, decay: 0.39, sustain: 0.31, release: 0.19, frequency: 720, fm: 155 },
    chord: { attack: 0.081, decay: 0.49, sustain: 0.41, release: 0.31, frequency: 290, fm: 48 },
    arp: { attack: 0.0225, decay: 0.255, sustain: 0.115, release: 0.165, frequency: 580 },
    pad: { attack: 0.5, decay: 1, sustain: 0.8, release: 1, frequency: 148, fm: 30 },
    demo: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
  },
  "Psytrance": {
    scale: P([0, 2, 4, 5, 7, 9, 11]),
    rootHz: 135,
    swing: 0.5,
    kick: { attack: 0.003, decay: 0.35, sustain: 0, release: 0.06, frequency: 90, fm: 120 },
    snare: { attack: 0.003, decay: 0.1, sustain: 0, release: 0.03, frequency: 120 },
    hat: { attack: 0.0008, decay: 0.05, sustain: 0, release: 0.01, frequency: 13000 },
    perc: { attack: 0.006, decay: 0.15, sustain: 0, release: 0.06, frequency: 3000 },
    bass: { attack: 0.01, decay: 0.2, sustain: 0.03, release: 0.08, frequency: 90, fm: 50 },
    lead: { attack: 0.03, decay: 0.3, sustain: 0.15, release: 0.12, frequency: 1100, fm: 300 },
    chord: { attack: 0.06, decay: 0.4, sustain: 0.25, release: 0.2, frequency: 450, fm: 100 },
    arp: { attack: 0.018, decay: 0.2, sustain: 0.07, release: 0.11, frequency: 900 },
    pad: { attack: 0.4, decay: 0.8, sustain: 0.65, release: 0.85, frequency: 220, fm: 60 },
    demo: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
  },
  "Minimal Techno": {
    scale: P([0, 5, 7]),
    rootHz: 125,
    swing: 0.5,
    kick: { attack: 0.004, decay: 0.35, sustain: 0, release: 0.07, frequency: 100, fm: 130 },
    snare: { attack: 0.0035, decay: 0.095, sustain: 0, release: 0.035, frequency: 100 },
    hat: { attack: 0.0009, decay: 0.048, sustain: 0, release: 0.009, frequency: 13500 },
    perc: { attack: 0.005, decay: 0.12, sustain: 0, release: 0.05, frequency: 3500 },
    bass: { attack: 0.012, decay: 0.22, sustain: 0.04, release: 0.09, frequency: 100, fm: 60 },
    lead: { attack: 0.035, decay: 0.32, sustain: 0.18, release: 0.13, frequency: 1200, fm: 340 },
    chord: { attack: 0.065, decay: 0.42, sustain: 0.28, release: 0.22, frequency: 500, fm: 120 },
    arp: { attack: 0.02, decay: 0.21, sustain: 0.08, release: 0.12, frequency: 1000 },
    pad: { attack: 0.42, decay: 0.84, sustain: 0.68, release: 0.88, frequency: 250, fm: 70 },
    demo: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
  },
  "Kuduro": {
    scale: P([0, 3, 7, 10]),
    rootHz: 128,
    swing: 0.6,
    kick: { attack: 0.009, decay: 0.3, sustain: 0.016, release: 0.13, frequency: 80, fm: 68 },
    snare: { attack: 0.007, decay: 0.18, sustain: 0.006, release: 0.07, frequency: 230 },
    hat: { attack: 0.0028, decay: 0.09, sustain: 0, release: 0.03, frequency: 8900 },
    perc: { attack: 0.01, decay: 0.25, sustain: 0.018, release: 0.1, frequency: 1700 },
    bass: { attack: 0.018, decay: 0.29, sustain: 0.13, release: 0.18, frequency: 75, fm: 31 },
    lead: { attack: 0.049, decay: 0.38, sustain: 0.3, release: 0.19, frequency: 740, fm: 158 },
    chord: { attack: 0.079, decay: 0.48, sustain: 0.39, release: 0.3, frequency: 310, fm: 52 },
    arp: { attack: 0.0215, decay: 0.245, sustain: 0.11, release: 0.155, frequency: 620 },
    pad: { attack: 0.49, decay: 0.98, sustain: 0.79, release: 0.98, frequency: 160, fm: 33 },
    demo: [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1]
  },
  "Drum & Bass": {
    scale: P([0, 2, 5, 7, 10]),
    rootHz: 150,
    swing: 0.53,
    kick: { attack: 0.003, decay: 0.28, sustain: 0, release: 0.05, frequency: 85, fm: 110 },
    snare: { attack: 0.002, decay: 0.08, sustain: 0, release: 0.025, frequency: 160 },
    hat: { attack: 0.0008, decay: 0.045, sustain: 0, release: 0.008, frequency: 13200 },
    perc: { attack: 0.004, decay: 0.12, sustain: 0, release: 0.04, frequency: 3100 },
    bass: { attack: 0.008, decay: 0.18, sustain: 0.02, release: 0.07, frequency: 85, fm: 45 },
    lead: { attack: 0.028, decay: 0.26, sustain: 0.12, release: 0.1, frequency: 1050, fm: 280 },
    chord: { attack: 0.058, decay: 0.36, sustain: 0.22, release: 0.18, frequency: 420, fm: 85 },
    arp: { attack: 0.016, decay: 0.18, sustain: 0.065, release: 0.1, frequency: 840 },
    pad: { attack: 0.38, decay: 0.76, sustain: 0.62, release: 0.8, frequency: 210, fm: 52 },
    demo: [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0]
  },
  "Drum and Bass": {
    scale: P([0, 2, 5, 7, 10]),
    rootHz: 150,
    swing: 0.53,
    kick: { attack: 0.003, decay: 0.28, sustain: 0, release: 0.05, frequency: 85, fm: 110 },
    snare: { attack: 0.002, decay: 0.08, sustain: 0, release: 0.025, frequency: 160 },
    hat: { attack: 0.0008, decay: 0.045, sustain: 0, release: 0.008, frequency: 13200 },
    perc: { attack: 0.004, decay: 0.12, sustain: 0, release: 0.04, frequency: 3100 },
    bass: { attack: 0.008, decay: 0.18, sustain: 0.02, release: 0.07, frequency: 85, fm: 45 },
    lead: { attack: 0.028, decay: 0.26, sustain: 0.12, release: 0.1, frequency: 1050, fm: 280 },
    chord: { attack: 0.058, decay: 0.36, sustain: 0.22, release: 0.18, frequency: 420, fm: 85 },
    arp: { attack: 0.016, decay: 0.18, sustain: 0.065, release: 0.1, frequency: 840 },
    pad: { attack: 0.38, decay: 0.76, sustain: 0.62, release: 0.8, frequency: 210, fm: 52 },
    demo: [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0]
  },
  "Tech House": {
    scale: P([0, 3, 5, 7, 10]),
    rootHz: 128,
    swing: 0.52,
    kick: { attack: 0.006, decay: 0.38, sustain: 0, release: 0.075, frequency: 90, fm: 110 },
    snare: { attack: 0.004, decay: 0.11, sustain: 0, release: 0.038, frequency: 140 },
    hat: { attack: 0.0015, decay: 0.058, sustain: 0, release: 0.015, frequency: 12500 },
    perc: { attack: 0.007, decay: 0.16, sustain: 0, release: 0.07, frequency: 3000 },
    bass: { attack: 0.014, decay: 0.23, sustain: 0.06, release: 0.11, frequency: 90, fm: 50 },
    lead: { attack: 0.038, decay: 0.32, sustain: 0.2, release: 0.13, frequency: 1100, fm: 280 },
    chord: { attack: 0.068, decay: 0.42, sustain: 0.3, release: 0.22, frequency: 420, fm: 90 },
    arp: { attack: 0.017, decay: 0.205, sustain: 0.08, release: 0.125, frequency: 840 },
    pad: { attack: 0.44, decay: 0.88, sustain: 0.7, release: 0.88, frequency: 210, fm: 50 },
    demo: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
  },
  "Trap": {
    scale: P([0, 3, 5, 7, 10]),
    rootHz: 85,
    swing: 0.51,
    kick: { attack: 0.008, decay: 0.38, sustain: 0.002, release: 0.1, frequency: 65, fm: 75 },
    snare: { attack: 0.005, decay: 0.14, sustain: 0, release: 0.05, frequency: 160 },
    hat: { attack: 0.002, decay: 0.07, sustain: 0, release: 0.02, frequency: 11500 },
    perc: { attack: 0.009, decay: 0.2, sustain: 0, release: 0.09, frequency: 2800 },
    bass: { attack: 0.017, decay: 0.28, sustain: 0.08, release: 0.13, frequency: 65, fm: 35 },
    lead: { attack: 0.042, decay: 0.37, sustain: 0.25, release: 0.17, frequency: 950, fm: 240 },
    chord: { attack: 0.072, decay: 0.47, sustain: 0.35, release: 0.27, frequency: 380, fm: 70 },
    arp: { attack: 0.019, decay: 0.235, sustain: 0.095, release: 0.145, frequency: 760 },
    pad: { attack: 0.47, decay: 0.94, sustain: 0.75, release: 0.94, frequency: 180, fm: 40 },
    demo: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
  },
  "Cumbia": {
    scale: P([0, 3, 7, 10]),
    rootHz: 105,
    swing: 0.56,
    kick: { attack: 0.013, decay: 0.42, sustain: 0.02, release: 0.14, frequency: 65, fm: 55 },
    snare: { attack: 0.0085, decay: 0.22, sustain: 0.01, release: 0.085, frequency: 240 },
    hat: { attack: 0.0035, decay: 0.105, sustain: 0, release: 0.035, frequency: 8800 },
    perc: { attack: 0.011, decay: 0.28, sustain: 0.02, release: 0.11, frequency: 1600 },
    bass: { attack: 0.022, decay: 0.36, sustain: 0.16, release: 0.22, frequency: 62, fm: 26 },
    lead: { attack: 0.055, decay: 0.44, sustain: 0.36, release: 0.22, frequency: 680, fm: 140 },
    chord: { attack: 0.085, decay: 0.54, sustain: 0.44, release: 0.36, frequency: 260, fm: 42 },
    arp: { attack: 0.024, decay: 0.288, sustain: 0.128, release: 0.176, frequency: 520 },
    pad: { attack: 0.52, decay: 1.04, sustain: 0.82, release: 1.04, frequency: 130, fm: 26 },
    demo: [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0]
  },
  "Tribal": {
    scale: P([0, 2, 5, 7]),
    rootHz: 120,
    swing: 0.57,
    kick: { attack: 0.012, decay: 0.39, sustain: 0.018, release: 0.135, frequency: 68, fm: 58 },
    snare: { attack: 0.008, decay: 0.21, sustain: 0.008, release: 0.08, frequency: 225 },
    hat: { attack: 0.0032, decay: 0.1, sustain: 0, release: 0.03, frequency: 9000 },
    perc: { attack: 0.0105, decay: 0.26, sustain: 0.018, release: 0.105, frequency: 1700 },
    bass: { attack: 0.021, decay: 0.34, sustain: 0.15, release: 0.21, frequency: 65, fm: 27 },
    lead: { attack: 0.052, decay: 0.41, sustain: 0.33, release: 0.21, frequency: 710, fm: 148 },
    chord: { attack: 0.082, decay: 0.51, sustain: 0.41, release: 0.33, frequency: 275, fm: 45 },
    arp: { attack: 0.0235, decay: 0.267, sustain: 0.119, release: 0.161, frequency: 560 },
    pad: { attack: 0.51, decay: 1.02, sustain: 0.81, release: 1.02, frequency: 138, fm: 28 },
    demo: [0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0]
  },
  "Organic House": {
    scale: P([0, 2, 4, 5, 7, 9, 11]),
    rootHz: 118,
    swing: 0.54,
    kick: { attack: 0.014, decay: 0.44, sustain: 0.022, release: 0.15, frequency: 62, fm: 52 },
    snare: { attack: 0.009, decay: 0.24, sustain: 0.012, release: 0.09, frequency: 255 },
    hat: { attack: 0.0038, decay: 0.114, sustain: 0, release: 0.038, frequency: 8500 },
    perc: { attack: 0.012, decay: 0.3, sustain: 0.022, release: 0.12, frequency: 1500 },
    bass: { attack: 0.024, decay: 0.39, sustain: 0.18, release: 0.24, frequency: 58, fm: 23 },
    lead: { attack: 0.06, decay: 0.48, sustain: 0.4, release: 0.24, frequency: 650, fm: 130 },
    chord: { attack: 0.09, decay: 0.58, sustain: 0.48, release: 0.4, frequency: 245, fm: 39 },
    arp: { attack: 0.026, decay: 0.312, sustain: 0.14, release: 0.184, frequency: 490 },
    pad: { attack: 0.54, decay: 1.08, sustain: 0.85, release: 1.08, frequency: 125, fm: 25 },
    demo: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
  },
  "Trance": {
    scale: P([0, 2, 4, 5, 7, 9, 11]),
    rootHz: 128,
    swing: 0.5,
    kick: { attack: 0.004, decay: 0.36, sustain: 0, release: 0.068, frequency: 95, fm: 125 },
    snare: { attack: 0.0038, decay: 0.105, sustain: 0, release: 0.035, frequency: 130 },
    hat: { attack: 0.0013, decay: 0.052, sustain: 0, release: 0.013, frequency: 13000 },
    perc: { attack: 0.006, decay: 0.15, sustain: 0, release: 0.06, frequency: 3200 },
    bass: { attack: 0.012, decay: 0.21, sustain: 0.04, release: 0.09, frequency: 100, fm: 60 },
    lead: { attack: 0.035, decay: 0.3, sustain: 0.18, release: 0.12, frequency: 1200, fm: 320 },
    chord: { attack: 0.065, decay: 0.4, sustain: 0.27, release: 0.2, frequency: 460, fm: 105 },
    arp: { attack: 0.015, decay: 0.19, sustain: 0.07, release: 0.115, frequency: 920 },
    pad: { attack: 0.42, decay: 0.84, sustain: 0.67, release: 0.84, frequency: 230, fm: 60 },
    demo: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
  },
  "French Touch": {
    scale: P([0, 3, 5, 7, 10]),
    rootHz: 120,
    swing: 0.5,
    kick: { attack: 0.007, decay: 0.39, sustain: 0, release: 0.08, frequency: 85, fm: 100 },
    snare: { attack: 0.0045, decay: 0.125, sustain: 0, release: 0.045, frequency: 155 },
    hat: { attack: 0.0018, decay: 0.065, sustain: 0, release: 0.018, frequency: 12200 },
    perc: { attack: 0.0082, decay: 0.19, sustain: 0, release: 0.082, frequency: 2900 },
    bass: { attack: 0.0158, decay: 0.263, sustain: 0.07, release: 0.125, frequency: 85, fm: 45 },
    lead: { attack: 0.041, decay: 0.35, sustain: 0.23, release: 0.15, frequency: 1050, fm: 265 },
    chord: { attack: 0.071, decay: 0.45, sustain: 0.33, release: 0.25, frequency: 400, fm: 80 },
    arp: { attack: 0.0185, decay: 0.235, sustain: 0.095, release: 0.14, frequency: 800 },
    pad: { attack: 0.45, decay: 0.9, sustain: 0.72, release: 0.9, frequency: 200, fm: 45 },
    demo: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
  },
  "Hard Techno": {
    scale: P([0, 3, 5, 7, 10]),
    rootHz: 140,
    swing: 0.48,
    kick: { attack: 0.005, decay: 0.35, sustain: 0, release: 0.07, frequency: 100, fm: 120 },
    snare: { attack: 0.0038, decay: 0.105, sustain: 0, release: 0.035, frequency: 130 },
    hat: { attack: 0.0013, decay: 0.052, sustain: 0, release: 0.013, frequency: 13000 },
    perc: { attack: 0.006, decay: 0.15, sustain: 0, release: 0.06, frequency: 3200 },
    bass: { attack: 0.012, decay: 0.21, sustain: 0.04, release: 0.09, frequency: 100, fm: 60 },
    lead: { attack: 0.035, decay: 0.3, sustain: 0.18, release: 0.12, frequency: 1200, fm: 320 },
    chord: { attack: 0.065, decay: 0.4, sustain: 0.27, release: 0.2, frequency: 460, fm: 105 },
    arp: { attack: 0.015, decay: 0.19, sustain: 0.07, release: 0.115, frequency: 920 },
    pad: { attack: 0.42, decay: 0.84, sustain: 0.67, release: 0.84, frequency: 230, fm: 60 },
    demo: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  },
  "Jungle": {
    scale: P([0, 2, 5, 7, 10]),
    rootHz: 155,
    swing: 0.56,
    kick: { attack: 0.0025, decay: 0.25, sustain: 0, release: 0.04, frequency: 95, fm: 125 },
    snare: { attack: 0.0015, decay: 0.06, sustain: 0, release: 0.02, frequency: 170 },
    hat: { attack: 0.0006, decay: 0.04, sustain: 0, release: 0.008, frequency: 13500 },
    perc: { attack: 0.003, decay: 0.1, sustain: 0, release: 0.03, frequency: 3300 },
    bass: { attack: 0.006, decay: 0.15, sustain: 0.015, release: 0.06, frequency: 95, fm: 50 },
    lead: { attack: 0.025, decay: 0.23, sustain: 0.1, release: 0.08, frequency: 1150, fm: 310 },
    chord: { attack: 0.055, decay: 0.33, sustain: 0.2, release: 0.16, frequency: 460, fm: 100 },
    arp: { attack: 0.014, decay: 0.16, sustain: 0.06, release: 0.09, frequency: 920 },
    pad: { attack: 0.35, decay: 0.7, sustain: 0.58, release: 0.76, frequency: 230, fm: 58 },
    demo: [1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0]
  },
  "Broken Beat": {
    scale: P([0, 3, 5, 7, 10]),
    rootHz: 115,
    swing: 0.58,
    kick: { attack: 0.0095, decay: 0.365, sustain: 0.008, release: 0.118, frequency: 78, fm: 88 },
    snare: { attack: 0.0062, decay: 0.163, sustain: 0.003, release: 0.062, frequency: 192 },
    hat: { attack: 0.0024, decay: 0.082, sustain: 0, release: 0.024, frequency: 11000 },
    perc: { attack: 0.0105, decay: 0.227, sustain: 0.008, release: 0.105, frequency: 2500 },
    bass: { attack: 0.019, decay: 0.305, sustain: 0.095, release: 0.15, frequency: 76, fm: 39 },
    lead: { attack: 0.046, decay: 0.395, sustain: 0.285, release: 0.18, frequency: 900, fm: 225 },
    chord: { attack: 0.076, decay: 0.495, sustain: 0.385, release: 0.295, frequency: 360, fm: 68 },
    arp: { attack: 0.0215, decay: 0.265, sustain: 0.112, release: 0.16, frequency: 720 },
    pad: { attack: 0.48, decay: 0.96, sustain: 0.76, release: 0.96, frequency: 180, fm: 38 },
    demo: [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0]
  },
  "Deep House": {
    scale: P([0, 3, 5, 7, 10]),
    rootHz: 110,
    swing: 0.54,
    kick: { attack: 0.01, decay: 0.42, sustain: 0.005, release: 0.11, frequency: 70, fm: 78 },
    snare: { attack: 0.0055, decay: 0.16, sustain: 0.002, release: 0.055, frequency: 195 },
    hat: { attack: 0.0022, decay: 0.078, sustain: 0, release: 0.022, frequency: 11200 },
    perc: { attack: 0.0095, decay: 0.22, sustain: 0.005, release: 0.095, frequency: 2600 },
    bass: { attack: 0.018, decay: 0.295, sustain: 0.09, release: 0.14, frequency: 68, fm: 36 },
    lead: { attack: 0.045, decay: 0.385, sustain: 0.27, release: 0.18, frequency: 920, fm: 235 },
    chord: { attack: 0.075, decay: 0.485, sustain: 0.37, release: 0.28, frequency: 370, fm: 68 },
    arp: { attack: 0.0205, decay: 0.245, sustain: 0.1, release: 0.15, frequency: 740 },
    pad: { attack: 0.48, decay: 0.96, sustain: 0.76, release: 0.96, frequency: 175, fm: 38 },
    demo: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
  }
};

const getCityProfile = (genreName, cityName) => {
  const profile = GENRE_PROFILES[genreName] || GENRE_PROFILES["Hip Hop"];
  if (!cityName || !CITY_PROFILES[cityName]) {
    return profile;
  }
  return mergeProfile(profile, CITY_PROFILES[cityName]);
};

export { GENRE_PROFILES, CITY_PROFILES, getCityProfile, mergeProfile };
