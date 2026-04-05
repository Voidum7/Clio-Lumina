import { ChatMessage } from "../types";

export interface LLMService {
  (
    history: ChatMessage[],
    currentMessage: string,
    systemInstruction: string,
    modelId?: string,
    personaId?: string
  ): Promise<string>;
}
