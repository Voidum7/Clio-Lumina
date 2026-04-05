import { useState } from 'react';
import { generateSpeech } from '../services/geminiService';

// Helper: Decode base64 string to Uint8Array
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper: Convert PCM data to AudioBuffer
async function pcmToAudioBuffer(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const useAudioPlayback = () => {
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioContext) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      setAudioContext(ctx);
      return ctx;
    }
    return audioContext;
  };

  const handlePlayAudio = async (messageId: string, text: string) => {
    if (playingMessageId === messageId) return; // Prevent multiple clicks on same message

    setPlayingMessageId(messageId);

    try {
      const base64Audio = await generateSpeech(text);
      if (!base64Audio) throw new Error("Audio generation failed");

      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const audioBytes = decodeBase64(base64Audio);
      const audioBuffer = await pcmToAudioBuffer(audioBytes, ctx);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setPlayingMessageId(null);
      source.start();
    } catch (error) {
      console.error("Playback failed:", error);
      setPlayingMessageId(null);
    }
  };

  return { playingMessageId, handlePlayAudio };
};
