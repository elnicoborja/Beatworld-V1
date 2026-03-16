// 8-bit Audio Engine using Web Audio API

class AudioEngine {
  ctx: AudioContext | null = null;
  masterGain: GainNode | null = null;
  noiseBuffer: AudioBuffer | null = null;

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.5;
    this.masterGain.connect(this.ctx.destination);
    this.createNoiseBuffer();
  }

  createNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
  }

  playDrum(type: string, time: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.connect(gain);
    gain.connect(this.masterGain);

    if (type === 'kick') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.1);
      gain.gain.setValueAtTime(1, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      osc.start(time);
      osc.stop(time + 0.1);
    } 
    else if (type === 'snare' && this.noiseBuffer) {
      // Noise component
      const noiseSrc = this.ctx.createBufferSource();
      noiseSrc.buffer = this.noiseBuffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'highpass';
      noiseFilter.frequency.value = 1000;
      
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(1, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
      
      noiseSrc.connect(noiseFilter).connect(noiseGain).connect(this.masterGain);
      noiseSrc.start(time);
      
      // Tone component
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(250, time);
      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      osc.start(time);
      osc.stop(time + 0.2);
    }
    else if (type === 'hihat' && this.noiseBuffer) {
      const noiseSrc = this.ctx.createBufferSource();
      noiseSrc.buffer = this.noiseBuffer;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 5000;
      
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
      
      noiseSrc.connect(noiseFilter).connect(noiseGain).connect(this.masterGain);
      noiseSrc.start(time);
    }
    else if (type === 'perc') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(400, time);
      osc.frequency.exponentialRampToValueAtTime(200, time + 0.1);
      gain.gain.setValueAtTime(0.5, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      osc.start(time);
      osc.stop(time + 0.1);
    }
  }

  playSynth(type: 'bass' | 'lead' | 'chord' | 'arp' | 'pad' | 'fx', noteIndex: number, time: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Simple minor pentatonic scale starting at C2
    const baseFreq = 65.41; 
    const scale = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24];
    
    // Default octave shift based on type
    let octaveOffset = 0;
    if (type === 'lead') octaveOffset = 2;
    if (type === 'arp') octaveOffset = 3;
    if (type === 'chord' || type === 'pad') octaveOffset = 1;

    // Calculate frequency
    const semiTones = scale[noteIndex % scale.length] + (octaveOffset * 12);
    const freq = baseFreq * Math.pow(2, semiTones / 12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    if (type === 'bass') {
      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.7, time);
      gain.gain.setTargetAtTime(0.01, time + 0.2, 0.1);
      osc.start(time);
      osc.stop(time + 0.3);
    } else if (type === 'lead' || type === 'arp') {
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.4, time);
      gain.gain.setTargetAtTime(0.01, time + 0.1, 0.05);
      osc.start(time);
      osc.stop(time + 0.2);
    } else if (type === 'chord' || type === 'pad') {
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.linearRampToValueAtTime(0.4, time + 0.1);
      gain.gain.setTargetAtTime(0.01, time + 0.4, 0.2);
      osc.start(time);
      osc.stop(time + 0.5);
    } else {
      // FX
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq * 2, time);
      osc.frequency.exponentialRampToValueAtTime(freq / 2, time + 0.3);
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.setTargetAtTime(0.01, time + 0.3, 0.1);
      osc.start(time);
      osc.stop(time + 0.4);
    }
  }

  getCurrentTime() {
    return this.ctx ? this.ctx.currentTime : 0;
  }
}

export const audio = new AudioEngine();
