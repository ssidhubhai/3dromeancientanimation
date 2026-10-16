/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Procedural Roman Soundscape synthesized 100% via Web Audio API.
 * Zero external audio files, zero 404 errors, zero network latency.
 */
export class RomanSoundscape {
  private ctx: AudioContext | null = null;
  private isInitialized = false;
  private isMuted = false;
  private masterGain: GainNode | null = null;

  // Sound nodes
  private windGain: GainNode | null = null;
  private crowdGain: GainNode | null = null;
  private torchGain: GainNode | null = null;

  // Periodic triggers
  private lyreTimer: number | null = null;
  private lastFootstepTime = 0;

  public init() {
    if (this.isInitialized) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupWindAmbient();
      this.setupCrowdMurmur();
      this.setupTorchCrackle();
      this.scheduleLyreChords();

      this.isInitialized = true;
    } catch {
      // AudioContext unavailable or restricted
    }
  }

  public resume() {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.resume();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.isMuted ? 0 : 0.4,
        this.ctx.currentTime,
        0.08
      );
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  private setupWindAmbient() {
    if (!this.ctx || !this.masterGain) return;

    // Pink-noise buffer for warm Mediterranean breeze
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.windGain);
    this.windGain.connect(this.masterGain);

    whiteNoise.start();

    // Gentle LFO modulating wind intensity
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
  }

  private setupCrowdMurmur() {
    if (!this.ctx || !this.masterGain) return;

    // Multi-formant vocal murmur simulation for Forum Romanum activity
    const crowdFrequencies = [240, 380, 520, 680, 840];
    this.crowdGain = this.ctx.createGain();
    this.crowdGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    this.crowdGain.connect(this.masterGain);

    crowdFrequencies.forEach((freq, idx) => {
      if (!this.ctx || !this.crowdGain) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 15, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq, this.ctx.currentTime);
      filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      // Tremolo modulating the speech cadence
      const tremolo = this.ctx.createOscillator();
      tremolo.frequency.setValueAtTime(1.8 + idx * 0.45, this.ctx.currentTime);
      const tremGain = this.ctx.createGain();
      tremGain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      tremolo.connect(tremGain);
      tremGain.connect(oscGain.gain);
      tremolo.start();

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.crowdGain);
      osc.start();
    });
  }

  private setupTorchCrackle() {
    if (!this.ctx || !this.masterGain) return;

    // Low rumble + periodic tiny crackle pops
    const rumbleOsc = this.ctx.createOscillator();
    rumbleOsc.type = 'sine';
    rumbleOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.05, this.ctx.currentTime);

    this.torchGain = this.ctx.createGain();
    this.torchGain.gain.setValueAtTime(0.15, this.ctx.currentTime);

    rumbleOsc.connect(rumbleGain);
    rumbleGain.connect(this.torchGain);
    this.torchGain.connect(this.masterGain);
    rumbleOsc.start();

    // Spawn tiny sporadic crackle clicks
    setInterval(() => {
      if (!this.ctx || this.isMuted || !this.torchGain) return;
      if (Math.random() > 0.45) {
        const pop = this.ctx.createOscillator();
        pop.type = 'triangle';
        pop.frequency.setValueAtTime(800 + Math.random() * 2400, this.ctx.currentTime);

        const popGain = this.ctx.createGain();
        popGain.gain.setValueAtTime(0.035, this.ctx.currentTime);
        popGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.04);

        pop.connect(popGain);
        popGain.connect(this.torchGain);
        pop.start();
        pop.stop(this.ctx.currentTime + 0.05);
      }
    }, 180);
  }

  private scheduleLyreChords() {
    // Ancient Roman/Greek Dorian mode frequencies (D, E, F, G, A, B, C)
    const lyreNotes = [293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33];

    const playLyrePluck = (freq: number, delayMs: number) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted || !this.masterGain) return;
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 3.5, now);
        filter.frequency.exponentialRampToValueAtTime(freq * 0.9, now + 1.8);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.065, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 2.5);
      }, delayMs);
    };

    const triggerArpeggio = () => {
      if (!this.ctx || this.isMuted) return;
      const rootIndex = Math.floor(Math.random() * 4);
      const chord = [
        lyreNotes[rootIndex],
        lyreNotes[rootIndex + 2],
        lyreNotes[rootIndex + 4],
        lyreNotes[rootIndex + (Math.random() > 0.5 ? 5 : 7) % lyreNotes.length]
      ];

      chord.forEach((freq, idx) => {
        playLyrePluck(freq, idx * (180 + Math.random() * 90));
      });
    };

    // Trigger peaceful temple lyre arpeggios every 16 to 28 seconds
    const loopTimer = () => {
      const nextDelay = 16000 + Math.random() * 12000;
      this.lyreTimer = window.setTimeout(() => {
        triggerArpeggio();
        loopTimer();
      }, nextDelay);
    };

    loopTimer();
  }

  public playFootstep(isSprinting: boolean) {
    if (!this.ctx || this.isMuted || !this.masterGain) return;
    const now = performance.now();
    const interval = isSprinting ? 270 : 420;
    if (now - this.lastFootstepTime < interval) return;
    this.lastFootstepTime = now;

    const audioNow = this.ctx.currentTime;

    // Basalt cobblestone strike: short click + stone resonance
    const stoneOsc = this.ctx.createOscillator();
    stoneOsc.type = 'triangle';
    stoneOsc.frequency.setValueAtTime(140 + Math.random() * 30, audioNow);
    stoneOsc.frequency.exponentialRampToValueAtTime(45, audioNow + 0.08);

    const stoneGain = this.ctx.createGain();
    stoneGain.gain.setValueAtTime(isSprinting ? 0.09 : 0.055, audioNow);
    stoneGain.gain.exponentialRampToValueAtTime(0.0001, audioNow + 0.09);

    stoneOsc.connect(stoneGain);
    stoneGain.connect(this.masterGain);
    stoneOsc.start(audioNow);
    stoneOsc.stop(audioNow + 0.1);
  }

  public updateTimeOfDay(preset: string) {
    if (!this.windGain || !this.crowdGain || !this.torchGain || !this.ctx) return;
    const t = this.ctx.currentTime;

    if (preset === 'night') {
      this.crowdGain.gain.setTargetAtTime(0.02, t, 0.8);
      this.torchGain.gain.setTargetAtTime(0.35, t, 0.8);
      this.windGain.gain.setTargetAtTime(0.24, t, 0.8);
    } else if (preset === 'noon') {
      this.crowdGain.gain.setTargetAtTime(0.22, t, 0.8);
      this.torchGain.gain.setTargetAtTime(0.05, t, 0.8);
      this.windGain.gain.setTargetAtTime(0.14, t, 0.8);
    } else {
      this.crowdGain.gain.setTargetAtTime(0.14, t, 0.8);
      this.torchGain.gain.setTargetAtTime(0.2, t, 0.8);
      this.windGain.gain.setTargetAtTime(0.18, t, 0.8);
    }
  }

  public dispose() {
    if (this.lyreTimer) {
      clearTimeout(this.lyreTimer);
      this.lyreTimer = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
    this.isInitialized = false;
  }
}
