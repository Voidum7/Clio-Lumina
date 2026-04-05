import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendMessageToClio } from './geminiService';

// To fix "Cannot access before initialization", we use vi.hoisted
const { mockGenerateContent } = vi.hoisted(() => {
  return { mockGenerateContent: vi.fn() };
});

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class MockGoogleGenAI {
      models = {
        generateContent: mockGenerateContent,
      };
      constructor() {}
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

describe('geminiService', () => {
  describe('sendMessageToClio', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      // Suppress console.error during tests to keep output clean
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    it('should return the response text on success', async () => {
      const mockResponseText = 'Hello Tristan, I am here.';
      mockGenerateContent.mockResolvedValueOnce({
        text: mockResponseText,
      });

      const response = await sendMessageToClio([], 'Hello', 'default');

      expect(response).toBe(mockResponseText);
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
    });

    it('should return a fallback string when the API throws an error', async () => {
      // Missing Error Path Test: sendMessageToClio
      // Rationale: Easily testable by mocking ai.models.generateContent to throw an error.
      const mockError = new Error('API connection failed');
      mockGenerateContent.mockRejectedValueOnce(mockError);

      const response = await sendMessageToClio([], 'Hello', 'default');

      expect(response).toBe('**Channel Blocked** — Connection interference detected. Please ensure the Resonance Key is active.');
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith('Clio connection error:', mockError);
    });
  });
});
