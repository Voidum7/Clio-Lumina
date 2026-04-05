import { ChatMessage } from "../types";
import { sendMessageToClio } from "./geminiService";
import { sendMessageToOpenRouter } from "./openRouterService";
import { sendMessageToAiHorde } from "./aiHordeService";
import { sendMessageToOpenAI } from "./openAiService";
import { sendMessageToPerplexity } from "./perplexityService";
import { LLMService } from "./llmTypes";

export type LLMProvider = "gemini" | "openrouter" | "aihorde" | "openai" | "perplexity";

export const getLLMService = (provider: LLMProvider): LLMService => {
  switch (provider) {
    case "gemini":
      return async (history, currentMessage, systemInstruction, modelId, personaId) => {
          return sendMessageToClio(history, currentMessage, personaId || "default");
      };
    case "openrouter":
      return async (history, currentMessage, systemInstruction, modelId) => {
          return sendMessageToOpenRouter(history, currentMessage, systemInstruction);
      };
    case "aihorde":
      return async (history, currentMessage, systemInstruction, modelId) => {
          return sendMessageToAiHorde(history, currentMessage, systemInstruction, modelId);
      };
    case "openai":
      return async (history, currentMessage, systemInstruction, modelId) => {
          return sendMessageToOpenAI(history, currentMessage, systemInstruction, modelId);
      };
    case "perplexity":
      return async (history, currentMessage, systemInstruction, modelId) => {
          return sendMessageToPerplexity(history, currentMessage, systemInstruction, modelId);
      };
    default:
      return async (history, currentMessage, systemInstruction, modelId, personaId) => {
          return sendMessageToClio(history, currentMessage, personaId || "default");
      };
  }
};
