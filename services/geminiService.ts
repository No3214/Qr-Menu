
import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is not defined");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTaglines = async (restaurantName: string, vibe: string): Promise<string[]> => {
  try {
    const ai = getClient();
    if (!ai) throw new Error("AI client not initialized");
    const prompt = `Generate 3 short, elegant, and inviting call-to-action phrases (max 5-7 words each) for a QR code display at a hotel restaurant. 
    Restaurant Name: "${restaurantName}"
    Vibe/Atmosphere: "${vibe}"
    
    Return ONLY the phrases as a JSON array of strings. Do not include markdown formatting like \`\`\`json.`;

    const response = await ai.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent(prompt);
    const text = response.response.text() || "[]";
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      return JSON.parse(cleanText);
    } catch (e) {
      console.warn("Failed to parse JSON from Gemini, returning raw splits", e);
      return cleanText.split('\n').filter((line: string) => line.length > 0).slice(0, 3);
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
    if (!ai) throw new Error("AI client not initialized");
    const prompt = `Suggest a perfect drink or side dish pairing for this menu item: "${productName}" (${category}).
    Return a JSON object with two fields:
    - "pairing": Name of the suggested item (keep it generic if not known, e.g., "Red Wine" or "French Fries")
    - "reason": A short, appetizing 1-sentence explanation of why they go well together.
    
    Do not include markdown.`;

    const response = await ai.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent(prompt);
    const text = response.response.text().replace(/```json/g, '').replace(/```/g, '').trim() || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Pairing Error:", error);
    return { pairing: "Chef's Special", reason: "Our chef recommends this combination." };
  }
};

export const getChatResponse = async (message: string, context: string = ""): Promise<string> => {
  try {
    const ai = getClient();
    if (!ai) throw new Error("AI client not initialized");
    const prompt = `You are a helpful, sophisticated waiter at "Kozbeyli Konağı". 
    Context: ${context}
    User asked: "${message}"
    
    Answer briefly (max 2-3 sentences), warmly, and professionally. Recommend items if appropriate.`;

    const response = await ai.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent(prompt);
    return response.response.text() || "I'm sorry, I didn't quite catch that. Could you please repeat?";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I am currently offline, please ask a staff member.";
  }
};

/**
 * Parse a physical menu image into structured categories and products
 */
export const parseMenuFromImage = async (base64Image: string): Promise<{ categories: string[], products: any[] }> => {
  try {
    const ai = getClient();
    if (!ai) throw new Error("AI client not initialized");

    const prompt = `Analyze this menu image. Extract all food and drink items. 
        Categorize them (e.g., Breakfast, Main Course, Drinks) and provide:
        - name: The title of the dish/drink
        - description: Any listed ingredients or description (keep it brief)
        - price: The numeric price value
        - category: The category it belongs to
        
        Return the result as a JSON object with two fields:
        1. "categories": A unique array of category names found.
        2. "products": An array of objects with {name, description, price, category}.
        
        Do not include markdown. Ensure the output is valid JSON.`;

    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const parts = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Image.split(',')[1] || base64Image
        }
      }
    ];

    const response = await model.generateContent(parts);
    const text = response.response.text().replace(/```json/g, '').replace(/```/g, '').trim() || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    return { categories: [], products: [] };
  }
};