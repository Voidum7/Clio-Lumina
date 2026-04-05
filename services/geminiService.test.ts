import { describe, it, expect, vi, beforeEach } from 'vitest';

// Define the mock inside vi.mock due to hoisting
vi.mock('@google/genai', () => {
  const mockGenerateContent = vi.fn();

  return {
    // Export this so tests can access it
    __mockGenerateContent: mockGenerateContent,
    GoogleGenAI: class {
      models = {
        generateContent: mockGenerateContent,
      };
    },
    HarmCategory: {
      HARM_CATEGORY_HATE_SPEECH: 'HARM_CATEGORY_HATE_SPEECH',
      HARM_CATEGORY_SEXUALLY_EXPLICIT: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      HARM_CATEGORY_HARASSMENT: 'HARM_CATEGORY_HARASSMENT',
      HARM_CATEGORY_DANGEROUS_CONTENT: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    },
    HarmBlockThreshold: {
      BLOCK_NONE: 'BLOCK_NONE',
    },
  };
});

import * as genai from '@google/genai';
import { generateSpeech } from './geminiService';

describe('generateSpeech', () => {
  const mockGenerateContent = (genai as any).__mockGenerateContent;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should be defined', () => {
     expect(generateSpeech).toBeDefined();
  });

  it('should generate speech successfully', async () => {
    const text = 'Hello Tristan';
    const fakeBase64 = 'fake-base64-audio-data';

    mockGenerateContent.mockResolvedValue({
      candidates: [
        {
          content: {
            parts: [
              {
                inlineData: {
                  data: fakeBase64
                }
              }
            ]
          }
        }
      ]
    });

    const result = await generateSpeech(text);

    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    expect(result).toBe(fakeBase64);
  });

  it('should handle errors correctly and return undefined', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Network error'));

    const result = await generateSpeech('Error text');

    expect(result).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith('TTS generation failed:', expect.any(Error));
  });
});
