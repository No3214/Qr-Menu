import { GoogleGenerativeAI } from "@google/generative-ai";

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenerativeAI(apiKey);
};

export const generateTaglines = async (restaurantName: string, vibe: string): Promise<string[]> => {
  try {
    const ai = getClient();
    const prompt = `Generate 3 short, elegant, and inviting call-to-action phrases (max 5-7 words each) for a QR code display at a hotel restaurant. 
    Restaurant Name: "${restaurantName}"
    Vibe/Atmosphere: "${vibe}"
    
    Return ONLY the phrases as a JSON array of strings. Do not include markdown formatting like \`\`\`json.`;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text() || "[]";
    // Clean up if model includes markdown code blocks despite instructions
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      return JSON.parse(cleanText);
    } catch (e) {
      console.warn("Failed to parse JSON from Gemini, returning raw splits", e);
      return cleanText.split('\n').filter(line => line.length > 0).slice(0, 3);
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [
      "Scan to view our menu",
      "Experience our flavors",
      "Your table awaits"
    ];
  }
};