// Web Audio API Synthesizer for high-tech launcher and transition SFX
class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // High-tech mechanical click when pressing buttons
  public playClick(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }

  // Hover tick
  public playHover(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {}
  }

  // Cinematic warp transition whoosh + bass impact
  public playWarpTransition(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;

      // 1. Rising Energy Sweep
      const sweepOsc = ctx.createOscillator();
      const sweepGain = ctx.createGain();
      sweepOsc.type = 'sawtooth';
      sweepOsc.frequency.setValueAtTime(120, now);
      sweepOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.6);

      sweepGain.gain.setValueAtTime(0.01, now);
      sweepGain.gain.linearRampToValueAtTime(0.18, now + 0.45);
      sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      // Lowpass filter for smooth sci-fi feel
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(4000, now + 0.6);

      sweepOsc.connect(filter);
      filter.connect(sweepGain);
      sweepGain.connect(ctx.destination);
      sweepOsc.start(now);
      sweepOsc.stop(now + 0.85);

      // 2. Deep Sub-Bass Impact when Logo Hits
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(110, now + 0.55);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 1.2);

      subGain.gain.setValueAtTime(0.001, now + 0.55);
      subGain.gain.linearRampToValueAtTime(0.35, now + 0.6);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now + 0.55);
      subOsc.stop(now + 1.45);

      // 3. Shimmer Chime for Logo Reveal
      const chimeOsc = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(587.33, now + 0.65); // D5
      chimeOsc.frequency.setValueAtTime(880, now + 0.75); // A5
      chimeGain.gain.setValueAtTime(0.08, now + 0.65);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chimeOsc.start(now + 0.65);
      chimeOsc.stop(now + 1.5);
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
