import { describe, it, expect, vi, beforeEach } from 'vitest';

// First mock the module
vi.mock('@google/genai', () => {
  const mockGenerateContent = vi.fn();

  class MockGoogleGenAI {
    models = {
      generateContent: mockGenerateContent,
    };
  }

  return {
    GoogleGenAI: MockGoogleGenAI,
    HarmCategory: {},
    HarmBlockThreshold: {},
  };
});

// Then import the service which uses the mocked module
import { generateSpeech } from './geminiService';
import { GoogleGenAI } from '@google/genai';

describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateSpeech', () => {
    it('should return undefined when the API call fails', async () => {
      // Since ai client is instantiated at module scope in geminiService.ts,
      // we need to access its mocked implementation via the module import.
      // The previous test passed but wasn't strictly correct because it created
      // a new client instead of modifying the module-scoped client's mock.

      // We need to access the mock generated content function directly
      // In Vitest, vi.mocked gets the mock object for a function
      const genAI = new GoogleGenAI({apiKey: 'foo'});
      vi.mocked(genAI.models.generateContent).mockRejectedValueOnce(new Error('API failure'));

      // We also want to mock console.error to avoid noise in the test output
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = await generateSpeech('test text');

      expect(result).toBeUndefined();
      expect(consoleSpy).toHaveBeenCalledWith('TTS generation failed:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });
});
