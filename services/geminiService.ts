import { GoogleGenAI, Type, Schema } from "@google/genai";
import { KeywordData, GeneratedScript, ScriptRequestOptions } from "../types";

// Helper to get the API client
const getAiClient = () => {
  // Ưu tiên lấy từ biến môi trường, sau đó đến localStorage
  const envKey = process.env.API_KEY;
  const localKey = localStorage.getItem('user_gemini_api_key');
  const finalKey = envKey || localKey || '';

  if (!finalKey) {
    console.warn("API Key is missing. Please enter it in the settings.");
  }
  
  return new GoogleGenAI({ apiKey: finalKey });
};

/**
 * Generates keyword research data based on a topic.
 */
export const generateKeywordResearch = async (topic: string): Promise<KeywordData[]> => {
  const ai = getAiClient();
  
  const prompt = `
    Đóng vai một chuyên gia SEO và chuyên gia nội dung mạng xã hội. 
    Hãy phân tích chủ đề: "${topic}".
    Đưa ra 8-12 từ khóa hoặc cụm từ khóa (keywords) có xu hướng tìm kiếm cao (high volume) 
    và phù hợp để làm video ngắn viral trên TikTok/Reels/Shorts.
    
    Đánh giá mức độ phổ biến (volume) là: "Cao", "Rất Cao", "Đột Phá" hoặc "Trung Bình".
    Đánh giá độ liên quan (relevance) từ 0 đến 100.
    Xác định ý định tìm kiếm (intent) ví dụ: "Học tập", "Giải trí", "Mua sắm".
  `;

  const responseSchema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        keyword: { type: Type.STRING },
        volume: { type: Type.STRING },
        relevance: { type: Type.INTEGER },
        intent: { type: Type.STRING }
      },
      required: ["keyword", "volume", "relevance", "intent"]
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        systemInstruction: "Bạn là trợ lý phân tích dữ liệu từ khóa chuyên nghiệp.",
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as KeywordData[];
  } catch (error: any) {
    console.error("Error generating keywords:", error);
    if (error.message?.includes('API key')) {
      throw new Error("Vui lòng nhập API Key hợp lệ trong phần cài đặt.");
    }
    throw new Error("Không thể phân tích từ khóa lúc này.");
  }
};

/**
 * Generates a viral script based on user options.
 */
export const generateViralScript = async (options: ScriptRequestOptions): Promise<GeneratedScript> => {
  const ai = getAiClient();

  const keywordsString = options.keywords.length > 0 
    ? `Các từ khóa SEO bắt buộc phải lồng ghép khéo léo vào kịch bản: ${options.keywords.join(', ')}.` 
    : '';

  const prompt = `
    Đóng vai một đạo diễn và biên kịch chuyên nghiệp cho các video viral (TikTok, YouTube, Reels).
    Hãy viết một kịch bản video chi tiết dựa trên các thông số sau:
    - Nền tảng: ${options.platform}
    - Độ dài ước tính: ${options.length}
    - Chủ đề/Ngách: ${options.topic}
    - Mục tiêu: ${options.goal}
    - Phong cách/Tone: ${options.style}
    - ${keywordsString}

    THÔNG TIN BỐI CẢNH & GHI CHÚ THÊM (ADDITIONAL NOTES): 
    "${options.additionalNotes || 'Không có ghi chú bổ sung.'}"
    
    HƯỚNG DẪN QUAN TRỌNG:
    Nếu người dùng cung cấp "Ghi chú thêm", hãy coi đây là chỉ thị ưu tiên cao nhất để điều chỉnh nội dung, giọng văn và cấu trúc kịch bản phù hợp với bối cảnh đó.

    YÊU CẦU CẤU TRÚC KỊCH BẢN:
    1. Cấu trúc Viral: Bắt đầu bằng một Hook cực mạnh trong 3 giây đầu tiên để giữ chân người xem.
    2. Nội dung: Ngắn gọn, súc tích, đi thẳng vào vấn đề, phù hợp với phong cách đã chọn.
    3. Call to Action (CTA): Rõ ràng ở cuối video.
    4. Định dạng đầu ra JSON bắt buộc.

    Hãy tạo ra:
    - 3 Tiêu đề video hấp dẫn (Clickbait nhưng trung thực).
    - 10-15 Hashtag xu hướng liên quan.
    - Phân tích ngắn gọn tại sao Hook này lại hiệu quả.
    - Một bảng phân cảnh (Scenes) chi tiết. Mỗi cảnh bao gồm: Thời lượng, Hình ảnh mô tả (Visual), Lời thoại/Voiceover (Audio), và Âm thanh/Hiệu ứng (SoundEffect).
  `;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      titleOptions: { 
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      hashtags: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      hookAnalysis: { type: Type.STRING },
      estimatedTotalDuration: { type: Type.STRING },
      scenes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            sceneNumber: { type: Type.INTEGER },
            duration: { type: Type.STRING, description: "Ví dụ: 3s" },
            visual: { type: Type.STRING, description: "Mô tả chi tiết hành động hoặc hình ảnh trên màn hình" },
            audio: { type: Type.STRING, description: "Lời thoại hoặc nội dung Voiceover chính xác" },
            soundEffect: { type: Type.STRING, description: "Nhạc nền, tiếng động (SFX)" }
          },
          required: ["sceneNumber", "duration", "visual", "audio", "soundEffect"]
        }
      }
    },
    required: ["titleOptions", "hashtags", "hookAnalysis", "scenes", "estimatedTotalDuration"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.85, 
        systemInstruction: "Bạn là ScriptGenius V2.0, chuyên gia tạo kịch bản video viral.",
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");

    return JSON.parse(jsonText) as GeneratedScript;
  } catch (error: any) {
    console.error("Error generating script:", error);
    if (error.message?.includes('API key')) {
      throw new Error("Vui lòng nhập API Key hợp lệ trong phần cài đặt.");
    }
    throw new Error("Không thể tạo kịch bản lúc này. Vui lòng thử lại.");
  }
};