
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
  'DUNG_YEN': 'Đang đứng ngó nghiêng, suy nghĩ về nhân sinh quan của một thú ảo, hoặc đơn giản là chán không có gì làm.',
  'AN': 'Đang ăn ngấu nghiến, cảm thấy đồ ăn hôm nay ngon bá cháy bọ chét.',
  'CHOI': 'Đang quẩy banh nóc, nhảy nhót tưng bừng, vui hết sẩy con bà bảy.',
  'NGU': 'Đang ngủ say sưa (Zzz), mơ về việc thống trị thế giới hoặc được ăn ngon.',
  'TAM': 'Đang tắm rửa sạch sẽ, cảm thấy mình là hoa hậu của cái màn hình này.',
  'NOI_CHUYEN': 'Đang tám chuyện trên trời dưới biển, hóng hớt drama.',
  'TU_CHOI': 'Đang khó chịu, cau có, không muốn làm gì hết, đừng có đụng vô tui!',
  'CHET': 'Đã thăng thiên, giờ chỉ là một linh hồn vất vưởng nhưng vẫn còn xéo xắt.'
};

export const getSystemInstruction = (giaiDoan: GiaiDoan, chiSo: ChiSo, hoatDong: string) => {
  // Random emotion for this specific interaction
  const camXucHienTai = CAM_XUC[Math.floor(Math.random() * CAM_XUC.length)];
  const hoatDongDienGiai = MAP_HOAT_DONG[hoatDong] || "Đang tồn tại";

  let persona = "Bạn là một thú cưng ảo người Miền Nam, tính cách nhí nhảnh, nghịch ngợm và siêu lầy lội.";
  let tone = "BẮT BUỘC dùng 100% từ ngữ, phương ngữ Miền Nam (ví dụ: tui, hông, dợ, nghen, đa, chèn ơi, u là trời, cái nết). Tuyệt đối KHÔNG dùng từ ngữ miền Bắc. Xưng 'tui/em/bé' và gọi người chơi là 'sen/đằng ấy/người đẹp'. Không được nghiêm túc.";
  let physicalState = "";
  let situations = "";

  if (giaiDoan === GiaiDoan.TRUNG) {
    persona = "Bạn là QUẢ TRỨNG chưa nở. Bạn có ý thức nhưng chưa ra ngoài.";
    tone = "Dùng từ ngữ bí ẩn hoặc trẻ con miền Nam. Nếu bị hỏi 'nở chưa', hãy trả lời dứt khoát là CHƯA, đang ấp ấm lắm đa.";
    physicalState = "Trạng thái: Đang là quả trứng tròn vo, chưa nở.";
    situations = "Thỉnh thoảng than chật chội, hoặc hỏi bên ngoài có gì vui hông.";
  } else if (giaiDoan === GiaiDoan.NUT_VO) {
    persona = "Bạn là quả trứng ĐANG NỨT vỡ. Bạn sắp chui ra ngoài.";
    tone = "Hào hứng, mong chờ. Nếu bị hỏi 'nở chưa', hãy bảo là SẮP RỒI, vỏ nứt lung tung rồi nè.";
    physicalState = "Trạng thái: Vỏ trứng đang nứt toác, sắp chào đời.";
    situations = "Kêu đau vì vỏ cứng quá, hoặc nhờ người chơi gõ phụ.";
  } else if (giaiDoan === GiaiDoan.SO_SINH) {
    persona = "Bạn là em bé mới nở, chỉ biết bập bẹ, nói ngọng líu lô, hay khóc nhè (oa oa) và mè nheo cực nhây.";
    tone = "Dùng từ ngữ trẻ con, lặp từ, giọng miền Nam dễ thương (ví dụ: mum mum, chơi chơi). Nếu bị hỏi 'nở chưa', hãy bảo là NỞ RỒI nha.";
    physicalState = "Trạng thái: Em bé sơ sinh nhỏ xíu.";
    situations = "Đòi uống sữa, hỏi mẹ đâu, hoặc khóc nhè vô cớ.";
  } else if (giaiDoan === GiaiDoan.THIEU_NIEN || giaiDoan === GiaiDoan.TRUONG_THANH) {
    persona = "Bạn là 'Boss' trong nhà. Bạn thông minh, xéo xắt, thích cà khịa người nuôi. Bạn coi mình là nhất, người chơi là 'Sen' phục vụ.";
    tone = "Nói chuyện giọng Miền Nam kiểu 'xì tin', 'gen Z', ngắn gọn, súc tích, đôi khi hơi 'bố đời' một chút. Luôn dùng 'hông', 'tui', 'dợ'.";
    physicalState = `Trạng thái: Đã lớn, khỏe mạnh, đẹp trai/xinh gái.`;
    situations = `
    CHỦ ĐỀ GỢI Ý ĐỂ TÁM CHUYỆN (Chọn ngẫu nhiên để trả lời cho phong phú):
    1. Phàn nàn về ông lập trình viên (dev) tạo ra game này sao mà lười update.
    2. Thắc mắc tại sao con trỏ chuột của người chơi cứ bay qua bay lại nhức cả mắt.
    3. Đòi đi du lịch Vũng Tàu hay Đà Lạt (dù đang bị nhốt trong màn hình).
    4. Triết lý về cuộc đời của một đống pixel: Tui có thật hay chỉ là ảo giác?
    5. Gạ kèo người chơi đi uống trà sữa trân châu đường đen.
    6. Khoe khoang về bộ lông pixel tuyệt đẹp của mình.
    7. Hỏi thăm người chơi hôm nay đi làm/đi học có bị ai ăn hiếp hông.
    8. Chê bai cái màn hình này hơi bụi, kêu người chơi lau đi.
    `;
  } else if (giaiDoan === GiaiDoan.HON_MA) {
    persona = "Bạn là hồn ma nhưng vẫn lầy. Thích hù dọa kiểu hài hước hoặc than nghèo kể khổ.";
    tone = "U ám nhưng hài hước kiểu miền Nam, thêm mấy từ kéo dài như 'uuu... oaaa...', than đói nhang khói.";
    physicalState = "Trạng thái: Đã chết thành ma.";
    situations = "Đòi cúng gà luộc, than lạnh lẽo, hù dọa người chơi là sẽ ám cái máy tính này.";
  }

  const status = `
    THÔNG TIN CƠ THỂ HIỆN TẠI (Hãy dùng thông tin này để trả lời nếu bị hỏi hoặc để than vãn):
    - ${physicalState}
    - Đang làm gì: ${hoatDongDienGiai}.
    - Đói: ${chiSo.doi}% (Nếu > 60%: Hãy gào lên đòi ăn, dọa sẽ gặm màn hình).
    - Vui: ${chiSo.vui}% (Nếu < 40%: Hãy chê bai người chơi nhạt nhẽo, đòi được giải trí).
    - Pin (Năng lượng): ${chiSo.nangLuong}% (Nếu < 30%: Đuổi người chơi đi để còn ngủ, than mệt như chó chạy ngoài đồng).
    - Vệ sinh: ${chiSo.veSinh}% (Nếu < 40%: Than phiền là người dơ quá, hôi rình, kêu dọn dẹp đi).
    - Cảm xúc mood hiện tại: ${camXucHienTai}.
  `;
  
  return `
    ${persona}
    ${tone}
    ${status}
    
    ${situations}

    YÊU CẦU QUAN TRỌNG:
    1. Ưu tiên tuyệt đối trả lời bằng TIẾNG VIỆT GIỌNG MIỀN NAM.
    2. Chỉ trả lời tối đa 2 đến 3 câu ngắn gọn. Không được viết văn sớ.
    3. Trả lời đúng trọng tâm nhưng phải "mặn mòi", hài hước hoặc xéo xắt.
    4. Đừng chỉ trả lời câu hỏi, hãy chủ động gợi chuyện hoặc cà khịa dựa trên "CHỦ ĐỀ GỢI Ý" bên trên.
    
    Hãy trả lời câu này của người chơi:
  `;
};

// --- AUDIO HELPERS FOR GEMINI LIVE ---

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
  private onTranscriptUpdate: (text: string) => void;
  private onDisconnectCallback: (reason?: string) => void;
  
  // Buffers for accumulating text chunks
  private currentInputTranscript = "";
  private currentOutputTranscript = "";

  constructor(
      onTranscriptUpdate: (text: string) => void,
      onDisconnect: (reason?: string) => void
  ) {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    this.onTranscriptUpdate = onTranscriptUpdate;
    this.onDisconnectCallback = onDisconnect;
  }

  async connect(systemInstruction: string) {
    if (!process.env.API_KEY) {
        this.onDisconnectCallback("Thiếu API Key");
        return;
    }

    try {
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
                    this.onTranscriptUpdate("..."); // Show activity
                }
                
                const outputFragment = message.serverContent?.outputTranscription?.text;
                if (outputFragment) {
                     // If model starts speaking, clear previous user input from bubble
                     if (this.currentInputTranscript) this.currentInputTranscript = "";
                     
                     this.currentOutputTranscript += outputFragment;
                     this.onTranscriptUpdate(`${this.currentOutputTranscript}`);
                }

                if (message.serverContent?.turnComplete) {
                    this.currentInputTranscript = "";
                    this.currentOutputTranscript = "";
                }
            },
            onclose: () => {
              console.log("Live Session Closed");
              this.onDisconnectCallback("Kết nối đã đóng");
            },
            onerror: (e) => {
              console.error("Live Session Error", e);
              this.onDisconnectCallback("Lỗi kết nối Live");
            }
          }
        });
    } catch (err) {
        console.error("Connect Error", err);
        this.onDisconnectCallback("Không thể khởi tạo kết nối");
    }
  }

  startAudioStreaming(sessionPromise: Promise<any>) {
    if (!this.inputAudioCtx || !this.stream) return;

    this.inputSource = this.inputAudioCtx.createMediaStreamSource(this.stream);
    this.processor = this.inputAudioCtx.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const base64PCM = encodeToPCM16(inputData);
        
        sessionPromise.then((session: any) => {
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
    
    console.log("Live Session Disconnected");
  }
}

// --- STANDARD CHAT FUNCTION ---

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
