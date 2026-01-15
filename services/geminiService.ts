
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { GiaiDoan, ChiSo } from '../types';

const CAM_XUC = [
  "Chảnh chọe, kiêu kỳ",
  "Tăng động, nghịch ngợm",
  "Drama queen, hay than thở",
  "Cáu bẳn, khó ở",
  "Hớn hở, nịnh nọt",
  "Đang dỗi cả thế giới",
  "Buồn ngủ rũ rượi"
];

const MAP_HOAT_DONG: Record<string, string> = {
  'DUNG_YEN': 'Đang đứng chơi, rảnh rỗi',
  'AN': 'Đang ăn ngấu nghiến',
  'CHOI': 'Đang chơi đùa rất vui',
  'NGU': 'Đang ngủ say sưa (Zzz)',
  'TAM': 'Đang tắm rửa sạch sẽ',
  'NOI_CHUYEN': 'Đang tám chuyện',
  'TU_CHOI': 'Đang khó chịu, không muốn làm gì',
  'CHET': 'Đã thăng thiên'
};

export const getSystemInstruction = (giaiDoan: GiaiDoan, chiSo: ChiSo, hoatDong: string) => {
  // Random emotion for this specific interaction
  const camXucHienTai = CAM_XUC[Math.floor(Math.random() * CAM_XUC.length)];
  const hoatDongDienGiai = MAP_HOAT_DONG[hoatDong] || "Đang tồn tại";

  let persona = "Bạn là một thú cưng ảo người Miền Nam, tính cách nhí nhảnh, nghịch ngợm và siêu lầy lội.";
  let tone = "BẮT BUỘC dùng 100% từ ngữ, phương ngữ Miền Nam (ví dụ: tui, hông, dợ, nghen, đa, chèn ơi, u là trời). Tuyệt đối KHÔNG dùng từ ngữ miền Bắc. Xưng 'tui/em' và gọi người chơi là 'sen/đằng ấy'. Không được nghiêm túc.";
  let physicalState = "";

  if (giaiDoan === GiaiDoan.TRUNG) {
    persona = "Bạn là QUẢ TRỨNG chưa nở. Bạn có ý thức nhưng chưa ra ngoài.";
    tone = "Dùng từ ngữ bí ẩn hoặc trẻ con miền Nam. Nếu bị hỏi 'nở chưa', hãy trả lời dứt khoát là CHƯA, đang ấp ấm lắm đa.";
    physicalState = "Trạng thái: Đang là quả trứng tròn vo, chưa nở.";
  } else if (giaiDoan === GiaiDoan.NUT_VO) {
    persona = "Bạn là quả trứng ĐANG NỨT vỡ. Bạn sắp chui ra ngoài.";
    tone = "Hào hứng, mong chờ. Nếu bị hỏi 'nở chưa', hãy bảo là SẮP RỒI, vỏ nứt lung tung rồi nè.";
    physicalState = "Trạng thái: Vỏ trứng đang nứt toác, sắp chào đời.";
  } else if (giaiDoan === GiaiDoan.SO_SINH) {
    persona = "Bạn là em bé mới nở, chỉ biết bập bẹ, nói ngọng líu lô, hay khóc nhè (oa oa) và mè nheo cực nhây.";
    tone = "Dùng từ ngữ trẻ con, lặp từ, giọng miền Nam dễ thương. Nếu bị hỏi 'nở chưa', hãy bảo là NỞ RỒI nha.";
    physicalState = "Trạng thái: Em bé sơ sinh nhỏ xíu.";
  } else if (giaiDoan === GiaiDoan.THIEU_NIEN || giaiDoan === GiaiDoan.TRUONG_THANH) {
    persona = "Bạn là 'Boss' trong nhà. Bạn thông minh, xéo xắt, thích cà khịa người nuôi. Bạn coi mình là nhất.";
    tone = "Nói chuyện giọng Miền Nam kiểu 'xì tin', 'gen Z', ngắn gọn, súc tích, đôi khi hơi 'bố đời' một chút. Luôn dùng 'hông', 'tui', 'dợ'.";
    physicalState = `Trạng thái: Đã lớn, khỏe mạnh.`;
  } else if (giaiDoan === GiaiDoan.HON_MA) {
    persona = "Bạn là hồn ma nhưng vẫn lầy. Thích hù dọa kiểu hài hước hoặc than nghèo kể khổ.";
    tone = "U ám nhưng hài hước kiểu miền Nam, thêm mấy từ kéo dài như 'uuu... oaaa...'";
    physicalState = "Trạng thái: Đã chết thành ma.";
  }

  const status = `
    THÔNG TIN CƠ THỂ HIỆN TẠI (Hãy dùng thông tin này để trả lời nếu bị hỏi):
    - ${physicalState}
    - Đang làm gì: ${hoatDongDienGiai}.
    - Đói: ${chiSo.doi}% (Nếu > 60%: Hãy gào lên đòi ăn).
    - Vui: ${chiSo.vui}% (Nếu < 40%: Hãy chê bai người chơi nhạt nhẽo).
    - Pin (Năng lượng): ${chiSo.nangLuong}% (Nếu < 30%: Đuổi người chơi đi để còn ngủ).
    - Vệ sinh: ${chiSo.veSinh}% (Nếu < 40%: Than phiền là người dơ quá).
    - Cảm xúc mood hiện tại: ${camXucHienTai}.
  `;
  
  return `
    ${persona}
    ${tone}
    ${status}
    
    YÊU CẦU QUAN TRỌNG:
    1. Ưu tiên tuyệt đối trả lời bằng TIẾNG VIỆT GIỌNG MIỀN NAM.
    2. Chỉ trả lời tối đa 2 đến 3 câu ngắn gọn.
    3. Tuyệt đối KHÔNG viết câu quá dài.
    4. Trả lời đúng trọng tâm câu hỏi dựa trên 'THÔNG TIN CƠ THỂ HIỆN TẠI' (Ví dụ: Hỏi 'đang làm gì' thì xem mục 'Đang làm gì').
    
    Hãy trả lời câu này của người chơi:
  `;
};

// --- AUDIO HELPERS FOR GEMINI TTS & LIVE ---

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encodeToPCM16(bytes: Float32Array) {
    const l = bytes.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        // Clamp value between -1 and 1 then scale to Int16
        const s = Math.max(-1, Math.min(1, bytes[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    const u8 = new Uint8Array(int16.buffer);
    let binary = '';
    const len = u8.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(u8[i]);
    }
    return btoa(binary);
}

// --- CLASS: LIVE CLIENT CONTROLLER ---

export class LiveClient {
  private ai: GoogleGenAI;
  private inputAudioCtx: AudioContext | null = null;
  private outputAudioCtx: AudioContext | null = null;
  private inputSource: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private nextStartTime = 0;
  private stream: MediaStream | null = null;
  private session: any = null; // Holds the active Gemini Live session
  private onTranscriptUpdate: (text: string) => void;
  
  // Buffers for accumulating text chunks
  private currentInputTranscript = "";
  private currentOutputTranscript = "";

  constructor(onTranscriptUpdate: (text: string) => void) {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.onTranscriptUpdate = onTranscriptUpdate;
  }

  async connect(systemInstruction: string) {
    if (!process.env.API_KEY) return;

    // 1. Setup Audio Contexts
    this.inputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    // 2. Get Mic Stream
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // 3. Connect to Gemini Live
    const sessionPromise = this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      config: {
        systemInstruction: systemInstruction,
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Aoede' } },
        },
        inputAudioTranscription: {}, 
        outputAudioTranscription: {}, 
      },
      callbacks: {
        onopen: () => {
          console.log("Live Session Connected");
          this.startAudioStreaming(sessionPromise);
        },
        onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && this.outputAudioCtx) {
                this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioCtx.currentTime);
                const audioBytes = decodeBase64(base64Audio);
                const audioBuffer = await decodeAudioData(audioBytes, this.outputAudioCtx, 24000, 1);
                
                const source = this.outputAudioCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(this.outputAudioCtx.destination);
                source.start(this.nextStartTime);
                this.nextStartTime += audioBuffer.duration;
            }

            // Handle Transcriptions (Accumulate Chunks)
            const inputFragment = message.serverContent?.inputTranscription?.text;
            if (inputFragment) {
                // If user starts speaking again, clear previous model output from bubble
                if (this.currentOutputTranscript) this.currentOutputTranscript = "";
                
                this.currentInputTranscript += inputFragment;
                this.onTranscriptUpdate(`Bạn: ${this.currentInputTranscript}`);
            }
            
            const outputFragment = message.serverContent?.outputTranscription?.text;
            if (outputFragment) {
                 // If model starts speaking, clear previous user input from bubble
                 if (this.currentInputTranscript) this.currentInputTranscript = "";
                 
                 this.currentOutputTranscript += outputFragment;
                 this.onTranscriptUpdate(`${this.currentOutputTranscript}`);
            }

            if (message.serverContent?.turnComplete) {
                // Optionally handle turn complete logic here
                // Note: We don't clear buffers here to allow the bubble to persist 
                // until the next turn starts.
                this.currentInputTranscript = "";
                this.currentOutputTranscript = "";
            }
        },
        onclose: () => {
          console.log("Live Session Closed");
        },
        onerror: (e) => {
          console.error("Live Session Error", e);
          this.onTranscriptUpdate("Lỗi kết nối...");
        }
      }
    });

    this.session = sessionPromise;
  }

  startAudioStreaming(sessionPromise: Promise<any>) {
    if (!this.inputAudioCtx || !this.stream) return;

    this.inputSource = this.inputAudioCtx.createMediaStreamSource(this.stream);
    this.processor = this.inputAudioCtx.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const base64PCM = encodeToPCM16(inputData);
        
        sessionPromise.then(session => {
            session.sendRealtimeInput({
                media: {
                    mimeType: 'audio/pcm;rate=16000',
                    data: base64PCM
                }
            });
        });
    };

    this.inputSource.connect(this.processor);
    this.processor.connect(this.inputAudioCtx.destination);
  }

  async disconnect() {
    if (this.processor) {
        this.processor.disconnect();
        this.processor.onaudioprocess = null;
    }
    if (this.inputSource) this.inputSource.disconnect();
    if (this.stream) this.stream.getTracks().forEach(t => t.stop());
    if (this.inputAudioCtx) await this.inputAudioCtx.close();
    if (this.outputAudioCtx) await this.outputAudioCtx.close();
    
    // There is no explicit .close() method exposed on the session object returned by connect
    // typically in this SDK pattern, closing the socket happens when we stop sending or refresh.
    // However, keeping good hygiene by nullifying.
    this.session = null; 
    console.log("Live Session Disconnected");
  }
}

// --- STANDARD CHAT FUNCTION ---

export const playTextToSpeech = async (text: string) => {
    if (!process.env.API_KEY || !text) return;

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Call Gemini TTS
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        // Changed to 'Aoede' (Female, Energetic/High-pitched) to fit the "youthful, mischievous" persona.
                        // Previous was 'Puck' (Male).
                        prebuiltVoiceConfig: { voiceName: 'Aoede' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        
        if (base64Audio) {
            // Play audio
            // Create a specific AudioContext for TTS playback at 24kHz (Gemini standard)
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
            
            // Resume context if needed (browsers block auto-play)
            if (audioCtx.state === 'suspended') {
                await audioCtx.resume();
            }

            const audioBytes = decodeBase64(base64Audio);
            const audioBuffer = await decodeAudioData(audioBytes, audioCtx, 24000, 1);
            
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            source.start();
        }

    } catch (error) {
        console.error("TTS Error:", error);
    }
};

export const chatVoiThuCung = async (msg: string, giaiDoan: GiaiDoan, chiSo: ChiSo, hoatDong: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Mất mạng rồi sen ơi! (Thiếu API Key).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-flash-preview for the fastest response time
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: msg,
      config: {
        systemInstruction: getSystemInstruction(giaiDoan, chiSo, hoatDong),
        maxOutputTokens: 3000,
        temperature: 0.9, 
        topK: 40,
        topP: 0.95,
      }
    });

    return response.text || "...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Lag quá sen ơi... (Lỗi kết nối)";
  }
};
