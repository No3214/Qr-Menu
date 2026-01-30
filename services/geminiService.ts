import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Set VITE_GEMINI_API_KEY in .env");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTaglines = async (restaurantName: string, vibe: string): Promise<string[]> => {
  try {
    const ai = getClient();
    const prompt = `Generate 3 short, elegant, and inviting call-to-action phrases (max 5-7 words each) for a QR code display at a hotel restaurant. 
    Restaurant Name: "${restaurantName}"
    Vibe/Atmosphere: "${vibe}"
    
    Return ONLY the phrases as a JSON array of strings. Do not include markdown formatting like \`\`\`json.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    const text = response.text || "[]";
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

export const getProductPairing = async (productName: string, category: string): Promise<{ pairing: string, reason: string }> => {
  try {
    const ai = getClient();
    const prompt = `Suggest a perfect drink or side dish pairing for this menu item: "${productName}" (${category}).
    Return a JSON object with two fields:
    - "pairing": Name of the suggested item (keep it generic if not known, e.g., "Red Wine" or "French Fries")
    - "reason": A short, appetizing 1-sentence explanation of why they go well together.
    
    Do not include markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    const text = response.text?.replace(/```json/g, '').replace(/```/g, '').trim() || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Pairing Error:", error);
    return { pairing: "Chef's Special", reason: "Our chef recommends this combination." };
  }
};

export const getChatResponse = async (message: string, context: string = ""): Promise<string> => {
  try {
    const ai = getClient();
    const prompt = `You are a helpful, sophisticated waiter at "Kozbeyli Konağı". 
    Context: ${context}
    User asked: "${message}"
    
    Answer briefly (max 2-3 sentences), warmly, and professionally. Recommend items if appropriate.`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
    });

    return response.text || "I'm sorry, I didn't quite catch that. Could you please repeat?";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I am currently offline, please ask a staff member.";
  }
};