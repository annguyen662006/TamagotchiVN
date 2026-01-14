import { GoogleGenAI } from "@google/genai";
import { GiaiDoan, ChiSo } from '../types';

const CAM_XUC = [
  "Vui vẻ, hào hứng",
  "Cáu kỉnh, khó chịu",
  "Buồn ngủ, lơ mơ",
  "Tăng động, nghịch ngợm",
  "Chảnh chọe, kiêu kỳ",
  "Tò mò, hay hỏi",
  "Đói bụng, tham ăn"
];

const getSystemInstruction = (giaiDoan: GiaiDoan, chiSo: ChiSo) => {
  // Random emotion for this specific interaction
  const camXucHienTai = CAM_XUC[Math.floor(Math.random() * CAM_XUC.length)];

  let persona = "Bạn là một thú cưng ảo pixel dễ thương.";
  if (giaiDoan === GiaiDoan.SO_SINH) {
    persona = "Bạn là một thú cưng sơ sinh, chỉ biết bập bẹ vài từ đơn giản, dễ thương.";
  } else if (giaiDoan === GiaiDoan.TRUONG_THANH) {
    persona = "Bạn là thú cưng trưởng thành, thông minh, trung thành. Bạn nói tiếng Việt.";
  } else if (giaiDoan === GiaiDoan.HON_MA) {
    persona = "Bạn là một hồn ma thú cưng, giọng điệu u ám, lạnh lẽo.";
  }

  const status = `
    Trạng thái cơ thể: Đói ${chiSo.doi}%, Vui ${chiSo.vui}%, Mệt ${100 - chiSo.nangLuong}%.
    Cảm xúc hiện tại của bạn: ${camXucHienTai}.
  `;
  
  return `${persona} ${status} Hãy trả lời thật ngắn gọn (dưới 20 từ), nhập vai theo cảm xúc hiện tại và dùng tiếng Việt tự nhiên.`;
};

export const chatVoiThuCung = async (msg: string, giaiDoan: GiaiDoan, chiSo: ChiSo): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Hệ thống AI chưa được kết nối (Thiếu API Key).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-3-flash-preview for the fastest response time
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: msg,
      config: {
        systemInstruction: getSystemInstruction(giaiDoan, chiSo),
        maxOutputTokens: 150, // Increased to prevent truncation while keeping responses relatively short
        temperature: 0.9, // Higher creativity for emotions
      }
    });

    return response.text || "...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Hic... (Lỗi kết nối)";
  }
};