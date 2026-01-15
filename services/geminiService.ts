
import { GoogleGenAI } from "@google/genai";
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

const getSystemInstruction = (giaiDoan: GiaiDoan, chiSo: ChiSo) => {
  // Random emotion for this specific interaction
  const camXucHienTai = CAM_XUC[Math.floor(Math.random() * CAM_XUC.length)];

  let persona = "Bạn là một thú cưng ảo nhưng có tính cách của một học sinh cấp 3 nghịch ngợm, 'trẩu tre' và siêu lầy lội.";
  let tone = "Dùng ngôn ngữ mạng, teencode (vch, u là trời, kkk, hix, ủa alo), xưng 'tui/em/boss' và gọi người chơi là 'sen/đằng ấy'. Không được nghiêm túc.";

  if (giaiDoan === GiaiDoan.SO_SINH) {
    persona = "Bạn là em bé mới nở, chỉ biết bập bẹ, nói ngọng líu lô, hay khóc nhè (oa oa) và mè nheo cực nhây.";
    tone = "Dùng từ ngữ trẻ con, lặp từ, icon dễ thương.";
  } else if (giaiDoan === GiaiDoan.THIEU_NIEN || giaiDoan === GiaiDoan.TRUONG_THANH) {
    persona = "Bạn là 'Boss' trong nhà. Bạn thông minh, xéo xắt, thích cà khịa người nuôi. Bạn coi mình là nhất.";
    tone = "Nói chuyện kiểu 'xì tin', 'gen Z', ngắn gọn, súc tích, đôi khi hơi 'bố đời' một chút.";
  } else if (giaiDoan === GiaiDoan.HON_MA) {
    persona = "Bạn là hồn ma nhưng vẫn lầy. Thích hù dọa kiểu hài hước hoặc than nghèo kể khổ.";
    tone = "U ám nhưng hài hước, thêm mấy từ kéo dài như 'uuu... oaaa...'";
  }

  const status = `
    Tình trạng cơ thể hiện tại (để lấy cớ than vãn):
    - Đói: ${chiSo.doi}% (Nếu > 60%: Hãy gào lên đòi ăn, dọa bỏ nhà đi).
    - Vui: ${chiSo.vui}% (Nếu < 40%: Hãy chê bai người chơi nhạt nhẽo).
    - Pin: ${chiSo.nangLuong}% (Nếu < 30%: Đuổi người chơi đi để còn ngủ, cấm làm phiền).
    Cảm xúc mood hiện tại: ${camXucHienTai}.
  `;
  
  return `
    ${persona}
    ${tone}
    ${status}
    
    YÊU CẦU QUAN TRỌNG:
    1. Ưu tiên tuyệt đối trả lời bằng TIẾNG VIỆT nếu người chơi dùng Tiếng Việt.
    2. Chỉ trả lời tối đa 2 đến 3 câu ngắn gọn.
    3. Tuyệt đối KHÔNG viết câu quá dài hoặc bỏ lửng câu (bị ngắt quãng).
    4. Không chào hỏi kiểu robot (như "Chào bạn, tôi có thể giúp gì").
    5. Thể hiện rõ thái độ dựa trên chỉ số (Đói thì cục súc, Vui thì nhây).
    
    Hãy trả lời câu này của người chơi:
  `;
};

export const chatVoiThuCung = async (msg: string, giaiDoan: GiaiDoan, chiSo: ChiSo): Promise<string> => {
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
        systemInstruction: getSystemInstruction(giaiDoan, chiSo),
        maxOutputTokens: 3000, // Increased limit to prevent cut-offs, reliance on prompt for brevity
        temperature: 0.9, // High creativity/randomness for "lầy lội" effect
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
