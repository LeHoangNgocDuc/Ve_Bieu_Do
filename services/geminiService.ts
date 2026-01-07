
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Shape } from '../types';

// Always use named parameter for apiKey and use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to decode audio bytes from Gemini TTS
function decode(base64: string) {
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

export const geminiService = {
  async parseGeometry(prompt: string): Promise<{ shapes: Shape[], explanation: string }> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Phân tích đề bài toán hình học sau và xuất ra tọa độ SVG tương ứng để vẽ trên canvas 800x600.
      
      Đề bài: "${prompt}"
      
      Yêu cầu:
      1. Trả về JSON chứa: 
         - "shapes": Mảng các đối tượng hình học (line, circle, polygon, text).
         - "explanation": Một đoạn văn ngắn giải thích cách vẽ.
      2. Tọa độ (0,0) ở góc trên bên trái. Canvas là 800x600. Hãy căn giữa hình vẽ nếu có thể.
      3. Mỗi shape cần có các thuộc tính: id, type, color, strokeWidth, strokeStyle, pattern (mặc định 'none').
      4. Đối với 'line': x1, y1, x2, y2.
      5. Đối với 'circle': cx, cy, r.
      6. Đối với 'polygon': points: [{x, y}, ...].
      7. Đối với 'text': x, y, content.
      
      Phản hồi phải là JSON thuần túy.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            shapes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  color: { type: Type.STRING },
                  strokeWidth: { type: Type.NUMBER },
                  strokeStyle: { type: Type.STRING },
                  pattern: { type: Type.STRING },
                  x1: { type: Type.NUMBER },
                  y1: { type: Type.NUMBER },
                  x2: { type: Type.NUMBER },
                  y2: { type: Type.NUMBER },
                  cx: { type: Type.NUMBER },
                  cy: { type: Type.NUMBER },
                  r: { type: Type.NUMBER },
                  points: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        x: { type: Type.NUMBER },
                        y: { type: Type.NUMBER }
                      }
                    }
                  },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  content: { type: Type.STRING },
                  fontSize: { type: Type.NUMBER }
                }
              }
            },
            explanation: { type: Type.STRING }
          }
        }
      }
    });

    try {
      // Accessing response text directly via .text property
      const text = response.text || "{}";
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse AI response:", e);
      throw new Error("Không thể phân tích phản hồi từ AI.");
    }
  },

  async speakExplanation(text: string): Promise<void> {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Đọc lời giải thích sau một cách tự nhiên: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
    }
  }
};
