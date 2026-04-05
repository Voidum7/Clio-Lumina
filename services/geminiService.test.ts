import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the GoogleGenAI module
vi.mock('@google/genai', () => {
  const mockGenerateContent = vi.fn();
  return {
    GoogleGenAI: class {
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
    // Export mock to access in tests
    mockGenerateContent,
  };
});

import { sendMessageToClio, generateSpeech } from './geminiService';
import { PERSONAS } from '../constants';
import { ChatMessage } from '../types';
import * as GoogleGenAIModule from '@google/genai';

// Retrieve the mocked fn
const mockGenerateContent = (GoogleGenAIModule as any).mockGenerateContent;

describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('sendMessageToClio', () => {
    const defaultHistory: ChatMessage[] = [
      { id: '1', role: 'user', text: 'Hello', timestamp: new Date() },
      { id: '2', role: 'model', text: 'Hi there', timestamp: new Date() },
    ];
    const defaultPersona = PERSONAS[0].id;

    it('should successfully generate a response', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: 'This is a mocked response',
      });

      const response = await sendMessageToClio(defaultHistory, 'How are you?', defaultPersona);

      expect(response).toBe('This is a mocked response');
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.model).toBe('gemini-2.5-flash');
      expect(callArgs.contents).toHaveLength(3); // 2 history + 1 current message
      expect(callArgs.contents[2].parts[0].text).toBe('How are you?');
      expect(callArgs.config.systemInstruction).toContain(PERSONAS[0].name);
    });

    it('should handle API errors and return a fallback message', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('API Error'));

      const response = await sendMessageToClio([], 'Test message', defaultPersona);

      expect(response).toContain('**Channel Blocked**');
    });

    it('should fall back to the first persona if an invalid persona ID is provided', async () => {
      mockGenerateContent.mockResolvedValueOnce({ text: 'Response' });

      await sendMessageToClio([], 'Test message', 'invalid-persona-id');

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.config.systemInstruction).toContain(PERSONAS[0].name);
    });

    it('should handle missing response text', async () => {
      mockGenerateContent.mockResolvedValueOnce({ text: undefined });

      const response = await sendMessageToClio([], 'Test', defaultPersona);
      expect(response).toBe('...');
    });
  });

  describe('generateSpeech', () => {
    it('should successfully generate speech', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        candidates: [
          {
            content: {
              parts: [
                {
                  inlineData: {
                    data: 'base64-encoded-audio-data',
                  },
                },
              ],
            },
          },
        ],
      });

      const response = await generateSpeech('Hello world');

      expect(response).toBe('base64-encoded-audio-data');
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.model).toBe('gemini-2.5-flash-preview-tts');
      expect(callArgs.contents[0].parts[0].text).toBe('Hello world');
      expect(callArgs.config.responseModalities).toEqual(['AUDIO']);
    });

    it('should handle API errors and return undefined', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('API Error'));

      const response = await generateSpeech('Test message');

      expect(response).toBeUndefined();
    });

    it('should handle unexpected response structure', async () => {
      mockGenerateContent.mockResolvedValueOnce({});

      const response = await generateSpeech('Test message');

      expect(response).toBeUndefined();
    });
  });
});
