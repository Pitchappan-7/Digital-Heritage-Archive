import { GoogleGenAI } from '@google/genai';
import { getServerEnv, isGeminiConfigured } from '../utils/environment';
import { ArchiveError } from '../utils/errors';

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!isGeminiConfigured()) {
    throw new ArchiveError(
      'GEMINI_NOT_CONFIGURED',
      'GEMINI_API_KEY is not configured. Set it in the server environment.',
      { service: 'gemini' }
    );
  }

  if (!client) {
    client = new GoogleGenAI({
      apiKey: getServerEnv().geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'digital-heritage-archive',
        },
      },
    });
  }

  return client;
}

export interface GeminiGenerateOptions {
  model?: string;
  systemInstruction?: string;
  temperature?: number;
}

/**
 * Server-only Gemini service. Never import this into browser code.
 */
export const geminiService = {
  isConfigured(): boolean {
    return isGeminiConfigured();
  },

  async generateText(prompt: string, options: GeminiGenerateOptions = {}): Promise<string> {
    const ai = getClient();
    const model = options.model || 'gemini-3.5-flash';

    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: options.systemInstruction,
          temperature: options.temperature ?? 0.5,
        },
      });

      const text = response.text;
      if (!text) {
        throw new ArchiveError('GEMINI_ERROR', 'Gemini returned an empty response.', {
          service: 'gemini',
        });
      }
      return text;
    } catch (err) {
      if (err instanceof ArchiveError) throw err;
      const message = err instanceof Error ? err.message : 'Gemini request failed';
      throw new ArchiveError('GEMINI_ERROR', message, { service: 'gemini', cause: err });
    }
  },

  getRawClient(): GoogleGenAI {
    return getClient();
  },
};
