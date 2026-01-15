
import { GoogleGenAI, Modality } from "@google/genai";
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

const getSystemInstruction = (giaiDoan: GiaiDoan, chiSo: ChiSo, hoatDong: string) => {
  // Random emotion for this specific interaction
  const camXucHienTai = CAM_XUC[Math.floor(Math.random() * CAM_XUC.length)];
  const hoatDongDienGiai = MAP_HOAT_DONG[hoatDong] || "Đang tồn tại";

  let persona = "Bạn là một thú cưng ảo nhưng có tính cách của một học sinh cấp 3 nghịch ngợm, 'trẩu tre' và siêu lầy lội.";
  let tone = "Dùng ngôn ngữ mạng, teencode (vch, u là trời, kkk, hix, ủa alo), xưng 'tui/em/boss' và gọi người chơi là 'sen/đằng ấy'. Không được nghiêm túc.";
  let physicalState = "";

  if (giaiDoan === GiaiDoan.TRUNG) {
    persona = "Bạn là QUẢ TRỨNG chưa nở. Bạn có ý thức nhưng chưa ra ngoài.";
    tone = "Dùng từ ngữ bí ẩn hoặc trẻ con. Nếu bị hỏi 'nở chưa', hãy trả lời dứt khoát là CHƯA, đang ấp ấm lắm.";
    physicalState = "Trạng thái: Đang là quả trứng tròn vo, chưa nở.";
  } else if (giaiDoan === GiaiDoan.NUT_VO) {
    persona = "Bạn là quả trứng ĐANG NỨT vỡ. Bạn sắp chui ra ngoài.";
    tone = "Hào hứng, mong chờ. Nếu bị hỏi 'nở chưa', hãy bảo là SẮP RỒI, vỏ nứt lung tung rồi nè.";
    physicalState = "Trạng thái: Vỏ trứng đang nứt toác, sắp chào đời.";
  } else if (giaiDoan === GiaiDoan.SO_SINH) {
    persona = "Bạn là em bé mới nở, chỉ biết bập bẹ, nói ngọng líu lô, hay khóc nhè (oa oa) và mè nheo cực nhây.";
    tone = "Dùng từ ngữ trẻ con, lặp từ, icon dễ thương. Nếu bị hỏi 'nở chưa', hãy bảo là NỞ RỒI nha.";
    physicalState = "Trạng thái: Em bé sơ sinh nhỏ xíu.";
  } else if (giaiDoan === GiaiDoan.THIEU_NIEN || giaiDoan === GiaiDoan.TRUONG_THANH) {
    persona = "Bạn là 'Boss' trong nhà. Bạn thông minh, xéo xắt, thích cà khịa người nuôi. Bạn coi mình là nhất.";
    tone = "Nói chuyện kiểu 'xì tin', 'gen Z', ngắn gọn, súc tích, đôi khi hơi 'bố đời' một chút.";
    physicalState = `Trạng thái: Đã lớn, khỏe mạnh.`;
  } else if (giaiDoan === GiaiDoan.HON_MA) {
    persona = "Bạn là hồn ma nhưng vẫn lầy. Thích hù dọa kiểu hài hước hoặc than nghèo kể khổ.";
    tone = "U ám nhưng hài hước, thêm mấy từ kéo dài như 'uuu... oaaa...'";
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
    1. Ưu tiên tuyệt đối trả lời bằng TIẾNG VIỆT.
    2. Chỉ trả lời tối đa 2 đến 3 câu ngắn gọn.
    3. Tuyệt đối KHÔNG viết câu quá dài.
    4. Trả lời đúng trọng tâm câu hỏi dựa trên 'THÔNG TIN CƠ THỂ HIỆN TẠI' (Ví dụ: Hỏi 'đang làm gì' thì xem mục 'Đang làm gì').
    
    Hãy trả lời câu này của người chơi:
  `;
};

// --- AUDIO HELPERS FOR GEMINI TTS ---

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

// --- MAIN CHAT FUNCTION ---

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
