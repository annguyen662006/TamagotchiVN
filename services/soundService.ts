
// Web Audio API implementation for Retro 8-bit SFX

let audioCtx: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

// Helper to play a single tone
const playTone = (freq: number, type: OscillatorType, duration: number, startTime: number, vol: number = 0.1) => {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(vol, startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
};

export const playSound = (action: 'FEED' | 'SLEEP' | 'CLEAN' | 'PLAY' | 'CURE' | 'WAKE' | 'SELECT' | 'EVOLVE' | 'DIE') => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  switch (action) {
    case 'FEED':
      // Crunch sound: Short, fast sawtooths descending
      playTone(600, 'sawtooth', 0.1, now);
      playTone(500, 'sawtooth', 0.1, now + 0.1);
      playTone(400, 'sawtooth', 0.1, now + 0.2);
      break;

    case 'SLEEP':
      // Lullaby: Slow sine waves dropping
      playTone(600, 'sine', 0.5, now, 0.2);
      playTone(500, 'sine', 0.5, now + 0.4, 0.2);
      playTone(400, 'sine', 1.0, now + 0.8, 0.1);
      break;

    case 'WAKE':
      // Rooster/Alarm: Sharp square waves rising
      playTone(400, 'square', 0.1, now);
      playTone(600, 'square', 0.1, now + 0.1);
      playTone(800, 'square', 0.3, now + 0.2);
      break;

    case 'CLEAN':
      // Sparkle/Sweep: High pitched sines rapid
      playTone(800, 'sine', 0.1, now);
      playTone(1000, 'sine', 0.1, now + 0.05);
      playTone(1200, 'sine', 0.1, now + 0.1);
      playTone(1500, 'sine', 0.2, now + 0.15);
      break;

    case 'PLAY':
      // Happy Arpeggio: Major chord square wave
      playTone(523.25, 'square', 0.1, now);       // C5
      playTone(659.25, 'square', 0.1, now + 0.1); // E5
      playTone(783.99, 'square', 0.1, now + 0.2); // G5
      playTone(1046.50, 'square', 0.2, now + 0.3); // C6
      break;

    case 'CURE':
      // Recovery: Triangle wave sliding up (simulated)
      playTone(300, 'triangle', 0.1, now);
      playTone(400, 'triangle', 0.1, now + 0.1);
      playTone(500, 'triangle', 0.1, now + 0.2);
      playTone(600, 'triangle', 0.4, now + 0.3);
      break;
      
    case 'SELECT':
        // UI Select Blip
        playTone(440, 'square', 0.1, now);
        break;

    case 'EVOLVE':
        // Victory Fanfare
        playTone(523, 'square', 0.1, now);
        playTone(523, 'square', 0.1, now + 0.15);
        playTone(523, 'square', 0.1, now + 0.30);
        playTone(698, 'square', 0.4, now + 0.45);
        break;
        
    case 'DIE':
        // Sad descent
        playTone(300, 'sawtooth', 0.3, now);
        playTone(250, 'sawtooth', 0.3, now + 0.3);
        playTone(200, 'sawtooth', 0.3, now + 0.6);
        playTone(150, 'sawtooth', 0.6, now + 0.9);
        break;
  }
};
