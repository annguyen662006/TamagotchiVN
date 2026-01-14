
class SoundManager {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  private async ensureContext() {
     if (this.audioCtx && this.audioCtx.state === 'suspended') {
         await this.audioCtx.resume();
     }
  }

  // Hàm cơ bản để phát một nốt nhạc
  private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0, vol: number = 0.1) {
    if (!this.audioCtx || this.isMuted) return;

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + startTime);
    
    // Hiệu ứng Fade out
    gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime + startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + startTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start(this.audioCtx.currentTime + startTime);
    osc.stop(this.audioCtx.currentTime + startTime + duration);
  }

  // 1. CHO ĂN (EATING)
  public async playEat() {
    await this.ensureContext();
    if (!this.audioCtx || this.isMuted) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sawtooth'; 
    osc.frequency.setValueAtTime(300, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.audioCtx.currentTime + 0.1); 

    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.1);
  }

  // 2. NGỦ (SLEEP)
  public async playSleep() {
    await this.ensureContext();
    this.playTone(400, 'sine', 0.5, 0, 0.05);
    this.playTone(300, 'sine', 0.5, 0.5, 0.05);
  }

  // 3. DỌN VỆ SINH (CLEAN)
  public async playClean() {
    await this.ensureContext();
    if (!this.audioCtx || this.isMuted) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'square'; 
    osc.frequency.setValueAtTime(100, this.audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, this.audioCtx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.2);
  }

  // 4. CHƠI (PLAY)
  public async playPlay() {
    await this.ensureContext();
    this.playTone(523.25, 'square', 0.1, 0, 0.05); // Do (C5)
    this.playTone(659.25, 'square', 0.1, 0.1, 0.05); // Mi (E5)
    this.playTone(783.99, 'square', 0.2, 0.2, 0.05); // Sol (G5)
  }

  // 5. UỐNG THUỐC (HEAL)
  public async playHeal() {
    await this.ensureContext();
    if (!this.audioCtx || this.isMuted) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sine'; 
    osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(1200, this.audioCtx.currentTime + 0.5); 

    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.5);
  }
  
  // 6. CHẾT (DIE)
  public async playDie() {
    await this.ensureContext();
    if (!this.audioCtx || this.isMuted) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(400, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.audioCtx.currentTime + 1); 

    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 1);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 1);
  }

  // UI Sound
  public async playSelect() {
      await this.ensureContext();
      this.playTone(440, 'square', 0.1, 0, 0.1);
  }
  
  public async playWake() {
      await this.ensureContext();
      this.playTone(400, 'triangle', 0.1, 0, 0.1);
      this.playTone(500, 'triangle', 0.1, 0.1, 0.1);
      this.playTone(600, 'triangle', 0.3, 0.2, 0.1);
  }

  public async playEvolve() {
    await this.ensureContext();
    this.playTone(523, 'square', 0.1, 0, 0.1);
    this.playTone(523, 'square', 0.1, 0.15, 0.1);
    this.playTone(523, 'square', 0.1, 0.30, 0.1);
    this.playTone(698, 'square', 0.4, 0.45, 0.1);
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
  }
}

export const soundManager = new SoundManager();
