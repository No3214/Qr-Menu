/**
 * Multi-Provider AI Service
 *
 * Fallback chain: Gemini -> Groq -> OpenRouter -> DeepSeek
 * Each provider uses its own API format.
 * If one fails, the next provider is tried automatically.
 */

import { GoogleGenAI } from "@google/genai";

// ---------- Types ----------
export type AIProvider = 'gemini' | 'groq' | 'openrouter' | 'deepseek';

interface ProviderConfig {
  name: AIProvider;
  enabled: boolean;
  model: string;
}

// ---------- Provider configs ----------
const PROVIDERS: ProviderConfig[] = [
  {
    name: 'gemini',
    enabled: !!import.meta.env.VITE_GEMINI_API_KEY,
    model: 'gemini-1.5-flash',
  },
  {
    name: 'groq',
    enabled: !!import.meta.env.VITE_GROQ_API_KEY,
    model: 'llama-3.1-8b-instant',
  },
  {
    name: 'openrouter',
    enabled: !!import.meta.env.VITE_OPENROUTER_API_KEY,
    model: 'meta-llama/llama-3.1-8b-instruct:free',
  },
  {
    name: 'deepseek',
    enabled: !!import.meta.env.VITE_DEEPSEEK_API_KEY,
    model: 'deepseek-chat',
  },
];

function getEnabledProviders(): ProviderConfig[] {
  return PROVIDERS.filter(p => p.enabled);
}

// ---------- Provider implementations ----------

async function callGemini(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt,
  });
  return response.text || "";
}

async function callOpenAICompatible(
  url: string,
  apiKey: string,
  model: string,
  prompt: string,
  extraHeaders?: Record<string, string>
): Promise<string> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      ...extraHeaders,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

async function callGroq(prompt: string, model: string): Promise<string> {
  return callOpenAICompatible(
    'https://api.groq.com/openai/v1/chat/completions',
    import.meta.env.VITE_GROQ_API_KEY,
    model,
    prompt
  );
}

async function callOpenRouter(prompt: string, model: string): Promise<string> {
  return callOpenAICompatible(
    'https://openrouter.ai/api/v1/chat/completions',
    import.meta.env.VITE_OPENROUTER_API_KEY,
    model,
    prompt,
    {
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Kozbeyli Konagi Digital Menu',
    }
  );
}

async function callDeepSeek(prompt: string, model: string): Promise<string> {
  return callOpenAICompatible(
    'https://api.deepseek.com/chat/completions',
    import.meta.env.VITE_DEEPSEEK_API_KEY,
    model,
    prompt
  );
}

// ---------- Main dispatch ----------

async function callProvider(provider: ProviderConfig, prompt: string): Promise<string> {
  switch (provider.name) {
    case 'gemini':
      return callGemini(prompt);
    case 'groq':
      return callGroq(prompt, provider.model);
    case 'openrouter':
      return callOpenRouter(prompt, provider.model);
    case 'deepseek':
      return callDeepSeek(prompt, provider.model);
    default:
      throw new Error(`Unknown provider: ${provider.name}`);
  }
}

/**
 * Generate AI text with automatic fallback across providers.
 * Tries each enabled provider in order: Gemini -> Groq -> OpenRouter -> DeepSeek
 */
export async function generateAIText(prompt: string): Promise<string> {
  const providers = getEnabledProviders();

  if (providers.length === 0) {
    throw new Error("No AI providers configured. Add API keys to .env");
  }

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      console.log(`[AI] Trying ${provider.name}...`);
      const result = await callProvider(provider, prompt);
      if (result) {
        console.log(`[AI] Success with ${provider.name}`);
        return result;
      }
    } catch (error) {
      console.warn(`[AI] ${provider.name} failed:`, error);
      lastError = error as Error;
    }
  }

  throw lastError || new Error("All AI providers failed");
}

/**
 * Parse JSON from AI response text (handles markdown code blocks)
 */
export function parseAIJson<T>(text: string): T {
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Get current active provider info for display
 */
export function getAvailableProviders(): string[] {
  return getEnabledProviders().map(p => p.name);
}
