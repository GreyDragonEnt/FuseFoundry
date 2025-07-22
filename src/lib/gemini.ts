// Gemini AI API integration for FuseFoundry
// This utility provides a clean interface to interact with Google's Gemini AI

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
      role: string;
    };
    finishReason: string;
    avgLogprobs?: number;
  }>;
  usageMetadata: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
  modelVersion: string;
  responseId: string;
}

export class GeminiAPI {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GOOGLE_AI_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('Google AI API key is required. Please set GOOGLE_AI_API_KEY in your environment variables.');
    }
  }

  async generateContent(
    prompt: string,
    model: string = 'gemini-2.0-flash'
  ): Promise<GeminiResponse> {
    const url = `${this.baseUrl}/models/${model}:generateContent`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': this.apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getSimpleResponse(prompt: string, model?: string): Promise<string> {
    try {
      const response = await this.generateContent(prompt, model);
      return response.candidates[0]?.content.parts[0]?.text || 'No response generated';
    } catch (error) {
      console.error('Error getting Gemini response:', error);
      throw error;
    }
  }
}

// Export a default instance for easy use
export const gemini = new GeminiAPI();
