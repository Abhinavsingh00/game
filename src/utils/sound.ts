class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmInterval: ReturnType<typeof setInterval> | null = null;
  private soundOn: boolean = true;
  private musicOn: boolean = true;

  public setSoundEnabled(enabled: boolean) {
    this.soundOn = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicOn = enabled;
    if (!enabled) {
      this.stopBgm();
    }
  }

  private init(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public playClick() {
    if (!this.soundOn) return;
    try {
      const ctx = this.init();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // AudioContext fails silently if user has not interacted yet
    }
  }

  public playEat() {
    if (!this.soundOn) return;
    try {
      const ctx = this.init();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }

  public playPowerUp() {
    if (!this.soundOn) return;
    try {
      const ctx = this.init();
      const now = ctx.currentTime;

      [280, 420, 560, 840].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.0, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.1);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.1);
      });
    } catch {}
  }

  public playGameOver() {
    if (!this.soundOn) return;
    try {
      const ctx = this.init();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch {}
  }

  public playVictory() {
    if (!this.soundOn) return;
    try {
      const ctx = this.init();
      const now = ctx.currentTime;
      const chords = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];

      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.1, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.25);
      });
    } catch {}
  }

  public startBgm(theme: string) {
    if (!this.musicOn) return;
    this.stopBgm();
    try {
      const ctx = this.init();

      // Low synth notes based on theme
      let notes = [110, 110, 165, 165, 110, 110, 146, 146]; // A2, E3, D3
      let oscType: OscillatorType = 'triangle';
      let speed = 400;

      if (theme === 'cosmic' || theme === 'crystal') {
        notes = [130, 196, 220, 196, 260, 196, 220, 196]; // C3, G3, A3, C4
        oscType = 'sine';
        speed = 500;
      } else if (theme === 'volcano' || theme === 'lava') {
        notes = [82, 82, 110, 82, 98, 82, 110, 98]; // E2, A2, G2
        oscType = 'sawtooth';
        speed = 300;
      } else if (theme === 'desert' || theme === 'stone') {
        notes = [146, 220, 146, 196, 220, 196, 146, 146]; // D3, A3, G3
        oscType = 'triangle';
        speed = 450;
      } else if (theme === 'snow') {
        notes = [196, 246, 293, 246, 196, 246, 293, 246]; // G3, B3, D4
        oscType = 'sine';
        speed = 600;
      }

      let step = 0;
      const playStep = () => {
        if (!this.musicOn) return;
        const note = notes[step % notes.length];
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.type = oscType;
        osc.frequency.setValueAtTime(note, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(350, ctx.currentTime);

        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (speed - 50) / 1000);

        osc.start();
        osc.stop(ctx.currentTime + speed / 1000);

        step++;
      };

      playStep();
      this.bgmInterval = setInterval(playStep, speed);
    } catch {}
  }

  public stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const soundManager = new SoundManager();
export default soundManager;
