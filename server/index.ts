import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';
import OpenAI from 'openai';
import axios from 'axios';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

// --- Gemini ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/gemini', async (req, res) => {
  try {
    const { history, currentMessage, systemInstruction, activePersonaId } = req.body;

    const recentHistory = history.slice(-15).map((msg: any) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...recentHistory,
        { role: 'user', parts: [{ text: currentMessage }] }
      ],
      config: {
        systemInstruction,
        temperature: 1.0,
        topK: 40,
        topP: 0.95,
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      }
    });
    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini proxy error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- OpenRouter ---
const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://clio-lumina-sanctuary.local",
    "X-Title": "Clio Lumina Sanctuary",
  }
});

app.post('/api/openrouter', async (req, res) => {
  try {
    const { messages, model } = req.body;
    const response = await openrouter.chat.completions.create({
      model: model || "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
      messages,
      temperature: 1.0,
      top_p: 0.95,
      frequency_penalty: 0.2,
      presence_penalty: 0.2,
    });
    res.json({ text: response.choices[0]?.message?.content });
  } catch (error: any) {
    console.error("OpenRouter proxy error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- OpenAI ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/openai', async (req, res) => {
  try {
    const { messages, model } = req.body;
    const response = await openai.chat.completions.create({
      model: model || "gpt-4o",
      messages,
      temperature: 1.0,
      top_p: 0.95,
      frequency_penalty: 0.2,
      presence_penalty: 0.2,
    });
    res.json({ text: response.choices[0]?.message?.content });
  } catch (error: any) {
    console.error("OpenAI proxy error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- Perplexity ---
const perplexity = new OpenAI({
  baseURL: "https://api.perplexity.ai",
  apiKey: process.env.PERPLEXITY_API_KEY,
});

app.post('/api/perplexity', async (req, res) => {
  try {
    const { messages, model } = req.body;
    const response = await perplexity.chat.completions.create({
      model: model || "sonar-reasoning-pro",
      messages,
      temperature: 0.2,
      top_p: 0.9,
    });
    res.json({ text: response.choices[0]?.message?.content });
  } catch (error: any) {
    console.error("Perplexity proxy error:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- AI Horde ---
const HORDE_API_URL = "https://aihorde.net/api/v2";

app.post('/api/aihorde', async (req, res) => {
  try {
    const { prompt, modelId } = req.body;
    const apiKey = process.env.AI_HORDE_API_KEY || "0000000000";

    const genResponse = await axios.post(
      `${HORDE_API_URL}/generate/text/async`,
      {
        prompt,
        params: {
          max_context_length: 4096,
          max_length: 500,
          temperature: 0.9,
          top_p: 0.92,
          rep_pen: 1.1,
          sampler_order: [6, 0, 1, 3, 4, 2, 5],
        },
        models: [modelId || "Gryphe/MythoMax-L2-13b"],
      },
      {
        headers: {
          "apikey": apiKey,
          "Client-Agent": "ClioLuminaSanctuary:1.0:Tristan"
        }
      }
    );

    const jobId = genResponse.data.id;

    // In a real proxy, we'd probably want to stream or use websockets,
    // but for simplicity in this sanctuary setup, we'll poll on the backend.
    let done = false;
    let finalResult = "";

    // Safety timeout: 2 minutes
    const startTime = Date.now();

    while (!done) {
      if (Date.now() - startTime > 120000) {
        throw new Error("Horde generation timed out.");
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      const statusResponse = await axios.get(`${HORDE_API_URL}/generate/text/status/${jobId}`);
      if (statusResponse.data.done) {
        done = true;
        if (statusResponse.data.generations && statusResponse.data.generations.length > 0) {
          finalResult = statusResponse.data.generations[0].text;
        } else {
          finalResult = "...";
        }
      } else if (!statusResponse.data.is_possible) {
        done = true;
        finalResult = "**Generation Failed** — Request is not possible on the current horde.";
      }
    }
    res.json({ text: finalResult.trim() });
  } catch (error: any) {
    console.error("AI Horde proxy error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Sanctuary Backend API running on http://localhost:${PORT}`);
});

app.post('/api/gemini/tts', async (req, res) => {
  try {
    const { text } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    res.json({ audioData });
  } catch (error: any) {
    console.error("TTS generation failed:", error);
    res.status(500).json({ error: error.message });
  }
});
