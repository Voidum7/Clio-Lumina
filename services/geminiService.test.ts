import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GoogleGenAI } from '@google/genai';

// Mock the GoogleGenAI module correctly using vi.hoisted
const { mockGenerateContent } = vi.hoisted(() => {
  return {
    mockGenerateContent: vi.fn(),
  };
});

vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: class MockGoogleGenAI {
      models: any;
      constructor() {
        this.models = {
          generateContent: mockGenerateContent,
        };
      }
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

// Import after mocking
import { sendMessageToClio, generateSpeech } from './geminiService';
import { PERSONAS } from '../constants';
import { ChatMessage } from '../types';

describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendMessageToClio', () => {
    it('should call generateContent with correct parameters and default persona', async () => {
      mockGenerateContent.mockResolvedValueOnce({ text: 'Response from Clio' });

      const history: ChatMessage[] = [];
      const currentMessage = 'Hello Clio';
      const activePersonaId = 'default';

      const response = await sendMessageToClio(history, currentMessage, activePersonaId);

      expect(response).toBe('Response from Clio');
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.model).toBe('gemini-2.5-flash');
      expect(callArgs.contents).toEqual([{ role: 'user', parts: [{ text: 'Hello Clio' }] }]);
      expect(callArgs.config.systemInstruction).toContain(PERSONAS[0].name);
      expect(callArgs.config.systemInstruction).toContain(PERSONAS[0].mood_profile);
      expect(callArgs.config.safetySettings).toBeDefined();
    });

    it('should correctly slice history to the last 15 messages', async () => {
      mockGenerateContent.mockResolvedValueOnce({ text: 'Response' });

      // Create 20 messages
      const history: ChatMessage[] = Array.from({ length: 20 }).map((_, i) => ({
        id: `id-${i}`,
        text: `Message ${i}`,
        role: i % 2 === 0 ? 'user' : 'model',
        timestamp: Date.now(),
      }));

      await sendMessageToClio(history, 'Current', 'default');

      const callArgs = mockGenerateContent.mock.calls[0][0];

      // Expected contents: 15 history messages + 1 current message = 16
      expect(callArgs.contents.length).toBe(16);

      // The first history message passed should be the 6th one (index 5)
      expect(callArgs.contents[0].parts[0].text).toBe('Message 5');
      // The last element is the current message
      expect(callArgs.contents[15].parts[0].text).toBe('Current');
    });

    it('should use a different persona if requested', async () => {
      mockGenerateContent.mockResolvedValueOnce({ text: 'Response' });

      const history: ChatMessage[] = [];
      const currentMessage = 'Hello';
      const activePersonaId = 'mommy'; // Exists in PERSONAS

      await sendMessageToClio(history, currentMessage, activePersonaId);

      const callArgs = mockGenerateContent.mock.calls[0][0];
      const mommyPersona = PERSONAS.find(p => p.id === 'mommy');

      expect(callArgs.config.systemInstruction).toContain(mommyPersona!.name);
      expect(callArgs.config.systemInstruction).toContain(mommyPersona!.mood_profile);
    });

    it('should fall back to default persona if unknown persona id is provided', async () => {
      mockGenerateContent.mockResolvedValueOnce({ text: 'Response' });

      await sendMessageToClio([], 'Hello', 'unknown_persona');

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.config.systemInstruction).toContain(PERSONAS[0].name);
    });

    it('should return a fallback message on API error', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('API failed'));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const response = await sendMessageToClio([], 'Hello', 'default');

      expect(response).toBe('**Channel Blocked** — Connection interference detected. Please ensure the Resonance Key is active.');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('generateSpeech', () => {
    it('should call generateContent with correct model and parameters for TTS', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        candidates: [
          {
            content: {
              parts: [
                {
                  inlineData: {
                    data: 'base64audio',
                  },
                },
              ],
            },
          },
        ],
      });

      const response = await generateSpeech('Speak this');

      expect(response).toBe('base64audio');
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.model).toBe('gemini-2.5-flash-preview-tts');
      expect(callArgs.contents).toEqual([{ parts: [{ text: 'Speak this' }] }]);
      expect(callArgs.config.responseModalities).toEqual(['AUDIO']);
      expect(callArgs.config.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName).toBe('Kore');
    });

    it('should return undefined if candidate structure is unexpected', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        candidates: [],
      });

      const response = await generateSpeech('Speak this');

      expect(response).toBeUndefined();
    });

    it('should return undefined on API error', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('TTS failed'));

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const response = await generateSpeech('Speak this');

      expect(response).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });
});
