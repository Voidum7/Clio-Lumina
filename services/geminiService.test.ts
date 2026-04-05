import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGenerateContent } = vi.hoisted(() => {
  return { mockGenerateContent: vi.fn() };
});

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: mockGenerateContent,
      };
      constructor() {}
    },
    HarmCategory: {},
    HarmBlockThreshold: {},
  };
});

import { generateSpeech } from './geminiService';

describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('generateSpeech', () => {
    it('should return undefined and log error when generateContent fails', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('API Error'));

      const result = await generateSpeech('hello');

      expect(result).toBeUndefined();
      expect(console.error).toHaveBeenCalledWith('TTS generation failed:', expect.any(Error));
    });

    it('should return audio data when successful', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        candidates: [
          {
            content: {
              parts: [
                {
                  inlineData: {
                    data: 'audio_base64_data',
                  },
                },
              ],
            },
          },
        ],
      });

      const result = await generateSpeech('hello');

      expect(result).toBe('audio_base64_data');
    });
  });
});
