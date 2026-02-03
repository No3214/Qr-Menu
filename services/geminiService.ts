/**
 * AI Service - Menu Assistant Functions
 *
 * Uses multi-provider fallback: Gemini -> Groq -> OpenRouter -> DeepSeek
 * All functions automatically retry with the next provider if one fails.
 */

import { generateAIText, parseAIJson } from './aiProvider';

export const generateTaglines = async (restaurantName: string, vibe: string): Promise<string[]> => {
  try {
    const prompt = `Generate 3 short, elegant, and inviting call-to-action phrases (max 5-7 words each) for a QR code display at a hotel restaurant.
    Restaurant Name: "${restaurantName}"
    Vibe/Atmosphere: "${vibe}"

    Return ONLY the phrases as a JSON array of strings. Do not include markdown formatting like \`\`\`json.`;

    const text = await generateAIText(prompt);

    try {
      return parseAIJson<string[]>(text);
    } catch {
      return text.split('\n').filter(line => line.length > 0).slice(0, 3);
    }
  } catch {
    return [
      "Scan to view our menu",
      "Experience our flavors",
      "Your table awaits"
    ];
  }
};

export const getProductPairing = async (productName: string, category: string): Promise<{ pairing: string, reason: string }> => {
  try {
    const prompt = `Suggest a perfect drink or side dish pairing for this menu item: "${productName}" (${category}).
    Return a JSON object with two fields:
    - "pairing": Name of the suggested item (keep it generic if not known, e.g., "Red Wine" or "French Fries")
    - "reason": A short, appetizing 1-sentence explanation of why they go well together.

    Do not include markdown.`;

    const text = await generateAIText(prompt);
    return parseAIJson<{ pairing: string, reason: string }>(text);
  } catch {
    return { pairing: "Chef's Special", reason: "Our chef recommends this combination." };
  }
};

export const getChatResponse = async (message: string, context: string = ""): Promise<string> => {
  try {
    const prompt = `You are a helpful, sophisticated waiter at "Kozbeyli Konağı".
    Context: ${context}
    User asked: "${message}"

    Answer briefly (max 2-3 sentences), warmly, and professionally. Recommend items if appropriate.`;

    return await generateAIText(prompt);
  } catch {
    return "I am currently offline, please ask a staff member.";
  }
};
