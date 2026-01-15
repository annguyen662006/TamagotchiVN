

// Web Audio API implementation for Retro 8-bit SFX

let audioCtx: AudioContext | null = null;
let bgmGainNode: GainNode | null = null;
let bgmOscillator: OscillatorNode | null = null;
let nextNoteTime = 0;
let bgmTimer: number | null = null;
let isBgmPlaying = false;

// BGM Melody Sequence (Frequency, Duration)
// Giai điệu Lo-fi Chill 8-bit đơn giản
const BGM_SEQUENCE = [
  { freq: 196.00, dur: 0.4 }, // G3
  { freq: 246.94, dur: 0.4 }, // B3
  { freq: 293.66, dur: 0.4 }, // D4
  { freq: 392.00, dur: 0.8 }, // G4
  { freq: 329.63, dur: 0.4 }, // E4
  { freq: 293.66, dur: 0.4 }, // D4
  { freq: 246.94, dur: 0.4 }, // B3
  { freq: 220.00, dur: 0.8 }, // A3
  
  { freq: 174.61, dur: 0.4 }, // F3
  { freq: 220.00, dur: 0.4 }, // A3
  { freq: 261.63, dur: 0.4 }, // C4
  { freq: 349.23, dur: 0.8 }, // F4
  { freq: 329.63, dur: 0.4 }, // E4
  { freq: 261.63, dur: 0.4 }, // C4
  { freq: 220.00, dur: 0.4 }, // A3
  { freq: 196.00, dur: 0.8 }, // G3
];

let currentNoteIndex = 0;

export const getAudioContext = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// Hàm khởi tạo để resume context khi user tương tác
export const initAudio = () => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
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

// --- BGM LOGIC ---

const scheduleNextNote = () => {
  const ctx = getAudioContext();
  const tempo = 1.2; // Hệ số tốc độ (càng cao càng chậm)
  
  // Lookahead: Schedule notes slightly ahead
  while (nextNoteTime < ctx.currentTime + 0.1) {
    const note = BGM_SEQUENCE[currentNoteIndex];
    playBgmNote(note.freq, note.dur * tempo, nextNoteTime);
    nextNoteTime += note.dur * tempo;
    
    currentNoteIndex++;
    if (currentNoteIndex === BGM_SEQUENCE.length) {
      currentNoteIndex = 0;
    }
  }
  
  if (isBgmPlaying) {
    bgmTimer = window.setTimeout(scheduleNextNote, 25);
  }
};

const playBgmNote = (freq: number, duration: number, time: number) => {
  if (!bgmGainNode || !audioCtx) return;

  const osc = audioCtx.createOscillator();
  osc.type = 'triangle'; // Soft sound
  osc.frequency.setValueAtTime(freq, time);
  
  // Envelope cho từng nốt nhạc nền để nghe êm hơn
  const noteGain = audioCtx.createGain();
  noteGain.gain.setValueAtTime(0, time);
  noteGain.gain.linearRampToValueAtTime(0.05, time + 0.05); // Attack
  noteGain.gain.linearRampToValueAtTime(0.03, time + duration - 0.05); // Sustain
  noteGain.gain.linearRampToValueAtTime(0, time + duration); // Release

  osc.connect(noteGain);
  noteGain.connect(bgmGainNode);
  
  osc.start(time);
  osc.stop(time + duration);
};

export const startBGM = () => {
  const ctx = getAudioContext();
  if (isBgmPlaying) return;
  
  isBgmPlaying = true;
  currentNoteIndex = 0;
  nextNoteTime = ctx.currentTime + 0.1;
  
  // Master Gain cho BGM
  if (!bgmGainNode) {
    bgmGainNode = ctx.createGain();
    bgmGainNode.gain.value = 0.4; // Master volume for BGM
    bgmGainNode.connect(ctx.destination);
  }
  
  scheduleNextNote();
};

export const stopBGM = () => {
  isBgmPlaying = false;
  if (bgmTimer) {
    clearTimeout(bgmTimer);
    bgmTimer = null;
  }
  // Không cần disconnect gain node để tránh lỗi khi bật lại
};

// --- SFX LOGIC ---

export const playSound = (action: 'FEED' | 'SLEEP' | 'CLEAN' | 'PLAY' | 'CURE' | 'WAKE' | 'SELECT' | 'EVOLVE' | 'DIE' | 'REFUSE' | 'WARNING' | 'EGG_TOUCH') => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // SFX volume is independent of BGM volume
  switch (action) {
    case 'FEED':
      playTone(600, 'sawtooth', 0.1, now);
      playTone(500, 'sawtooth', 0.1, now + 0.1);
      playTone(400, 'sawtooth', 0.1, now + 0.2);
      break;

    case 'SLEEP':
      playTone(600, 'sine', 0.5, now, 0.2);
      playTone(500, 'sine', 0.5, now + 0.4, 0.2);
      playTone(400, 'sine', 1.0, now + 0.8, 0.1);
      break;

    case 'WAKE':
      playTone(400, 'square', 0.1, now);
      playTone(600, 'square', 0.1, now + 0.1);
      playTone(800, 'square', 0.3, now + 0.2);
      break;

    case 'CLEAN':
      playTone(800, 'sine', 0.1, now);
      playTone(1000, 'sine', 0.1, now + 0.05);
      playTone(1200, 'sine', 0.1, now + 0.1);
      playTone(1500, 'sine', 0.2, now + 0.15);
      break;

    case 'PLAY':
      playTone(523.25, 'square', 0.1, now);       // C5
      playTone(659.25, 'square', 0.1, now + 0.1); // E5
      playTone(783.99, 'square', 0.1, now + 0.2); // G5
      playTone(1046.50, 'square', 0.2, now + 0.3); // C6
      break;

    case 'CURE':
      playTone(300, 'triangle', 0.1, now);
      playTone(400, 'triangle', 0.1, now + 0.1);
      playTone(500, 'triangle', 0.1, now + 0.2);
      playTone(600, 'triangle', 0.4, now + 0.3);
      break;
      
    case 'SELECT':
        playTone(440, 'square', 0.1, now);
        break;

    case 'EVOLVE':
        playTone(523, 'square', 0.1, now);
        playTone(523, 'square', 0.1, now + 0.15);
        playTone(523, 'square', 0.1, now + 0.30);
        playTone(698, 'square', 0.4, now + 0.45);
        break;
        
    case 'DIE':
        playTone(300, 'sawtooth', 0.3, now);
        playTone(250, 'sawtooth', 0.3, now + 0.3);
        playTone(200, 'sawtooth', 0.3, now + 0.6);
        playTone(150, 'sawtooth', 0.6, now + 0.9);
        break;

    case 'REFUSE':
        playTone(150, 'sawtooth', 0.15, now, 0.2);
        playTone(100, 'sawtooth', 0.15, now + 0.15, 0.2);
        break;

    case 'WARNING':
        playTone(880, 'square', 0.1, now, 0.05);
        playTone(0, 'square', 0.1, now + 0.1, 0); // Silence
        playTone(880, 'square', 0.1, now + 0.2, 0.05);
        break;

    case 'EGG_TOUCH':
        playTone(330, 'sine', 0.08, now, 0.1);
        playTone(330, 'sine', 0.08, now + 0.12, 0.05);
        break;
  }
};
