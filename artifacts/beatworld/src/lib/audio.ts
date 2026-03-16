// 32-bit Audio Engine — Sega Genesis inspired synthesis via Web Audio API

class AudioEngine {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  noiseBuffer: AudioBuffer | null = null;
  compressor: DynamicsCompressorNode | null = null;

  /** Must be called inside a user gesture (click/touch) */
  async init() {
    if (this.ctx && this.ctx.state === 'running') return;

    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.value = -6;
      this.compressor.ratio.value = 4;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.7;
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);
      this.createNoiseBuffer();
    }

    // Always resume — browsers suspend AudioContext until user interacts
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  isReady() {
    return this.ctx !== null && this.ctx.state === 'running';
  }

  private createNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate;
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }

  getCurrentTime() {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  /** Play a drum sound — Sega Genesis YM2612 / PSG inspired timbres */
  playDrum(type: string, time: number) {
    if (!this.ctx || !this.masterGain || !this.isReady()) return;
    // Clamp: never schedule in the past
    const t = Math.max(time, this.ctx.currentTime + 0.005);

    if (type === 'kick') {
      // Deep FM kick — YM2612 style
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const mod = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();

      mod.frequency.value = 80;
      modGain.gain.setValueAtTime(200, t);
      modGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
      mod.connect(modGain).connect(osc.frequency);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, t);
      osc.frequency.exponentialRampToValueAtTime(28, t + 0.12);
      gain.gain.setValueAtTime(1.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain).connect(this.masterGain);
      mod.start(t); osc.start(t);
      mod.stop(t + 0.18); osc.stop(t + 0.18);
    }
    else if (type === 'snare') {
      // Noise layer
      if (this.noiseBuffer) {
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = this.noiseBuffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 2500;
        noiseFilter.Q.value = 0.8;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.8, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        noiseSrc.connect(noiseFilter).connect(noiseGain).connect(this.masterGain);
        noiseSrc.start(t); noiseSrc.stop(t + 0.18);
      }
      // Tone body
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);
      gain.gain.setValueAtTime(0.6, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain).connect(this.masterGain);
      osc.start(t); osc.stop(t + 0.12);
    }
    else if (type === 'hihat') {
      // Metallic hi-hat using multiple detuned oscillators + noise
      const frequencies = [285, 432, 528, 747, 1068];
      frequencies.forEach(freq => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 7000;
        osc.type = 'square';
        osc.frequency.value = freq;
        const dur = 0.045;
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.connect(filter).connect(gain).connect(this.masterGain!);
        osc.start(t); osc.stop(t + dur);
      });
    }
    else if (type === 'perc') {
      // 808-style conga/perc
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.08);
      gain.gain.setValueAtTime(0.7, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(gain).connect(this.masterGain);
      osc.start(t); osc.stop(t + 0.12);
    }
    else {
      // Fallback generic percussive hit
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(500, t);
      osc.frequency.exponentialRampToValueAtTime(100, t + 0.07);
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.connect(gain).connect(this.masterGain);
      osc.start(t); osc.stop(t + 0.1);
    }
  }

  /** Play a melodic/synth sound — Sega Genesis FM-inspired timbres */
  playSynth(
    type: 'bass' | 'lead' | 'chord' | 'arp' | 'pad' | 'fx',
    noteIndex: number,
    time: number
  ) {
    if (!this.ctx || !this.masterGain || !this.isReady()) return;
    const t = Math.max(time, this.ctx.currentTime + 0.005);

    // Minor pentatonic scale — C minor starting at C2
    const rootHz = 65.41; // C2
    const scale = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24, 27];
    let octaveOffset = 0;
    if (type === 'lead' || type === 'fx') octaveOffset = 2;
    else if (type === 'arp') octaveOffset = 3;
    else if (type === 'chord') octaveOffset = 1;
    else if (type === 'pad') octaveOffset = 1;

    const semitones = scale[noteIndex % scale.length] + octaveOffset * 12;
    const freq = rootHz * Math.pow(2, semitones / 12);

    if (type === 'bass') {
      // FM bass — Sega Genesis style
      const carrier = this.ctx.createOscillator();
      const modulator = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const outGain = this.ctx.createGain();

      modulator.frequency.value = freq * 2;
      modGain.gain.setValueAtTime(freq * 3, t);
      modGain.gain.exponentialRampToValueAtTime(freq * 0.5, t + 0.15);
      modulator.connect(modGain).connect(carrier.frequency);

      carrier.type = 'sine';
      carrier.frequency.value = freq;
      outGain.gain.setValueAtTime(0.8, t);
      outGain.gain.setTargetAtTime(0.001, t + 0.22, 0.08);
      carrier.connect(outGain).connect(this.masterGain);
      modulator.start(t); carrier.start(t);
      modulator.stop(t + 0.35); carrier.stop(t + 0.35);
    }
    else if (type === 'lead') {
      // Square wave lead with slight pulse width
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = freq * 6;
      filter.Q.value = 2;

      osc.type = 'square';
      osc.frequency.value = freq;
      osc2.type = 'square';
      osc2.frequency.value = freq * 1.005; // slight detune

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.35, t + 0.01);
      gain.gain.setTargetAtTime(0.001, t + 0.15, 0.04);

      osc.connect(filter); osc2.connect(filter);
      filter.connect(gain).connect(this.masterGain);
      osc.start(t); osc2.start(t);
      osc.stop(t + 0.22); osc2.stop(t + 0.22);
    }
    else if (type === 'chord') {
      // FM organ/brass chord — 3 operators
      const intervals = [0, 4, 7]; // major chord
      intervals.forEach(interval => {
        const f = freq * Math.pow(2, interval / 12);
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
        gain.gain.setTargetAtTime(0.001, t + 0.25, 0.12);
        osc.connect(gain).connect(this.masterGain!);
        osc.start(t); osc.stop(t + 0.5);
      });
    }
    else if (type === 'arp') {
      // Bright arpeggiated synth
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = freq * 2;
      filter.Q.value = 3;
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(filter).connect(gain).connect(this.masterGain);
      osc.start(t); osc.stop(t + 0.12);
    }
    else if (type === 'pad') {
      // Soft triangle pad
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      osc2.type = 'triangle';
      osc2.frequency.value = freq * 2;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.06);
      gain.gain.setTargetAtTime(0.001, t + 0.35, 0.15);
      osc.connect(gain); osc2.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t); osc2.start(t);
      osc.stop(t + 0.6); osc2.stop(t + 0.6);
    }
    else {
      // FX: pitch sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * 3, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.3);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.setTargetAtTime(0.001, t + 0.25, 0.06);
      osc.connect(gain).connect(this.masterGain);
      osc.start(t); osc.stop(t + 0.35);
    }
  }
}

export const audio = new AudioEngine();
