import { ChatMessage } from "../types";

export const sendMessageToOpenAI = async (
  history: ChatMessage[],
  currentMessage: string,
  systemInstruction: string,
  modelId: string = "gpt-4o"
): Promise<string> => {
  try {
    const messages = [
      { role: "system", content: systemInstruction },
      ...history.map((msg) => ({
        role: msg.role === "model" ? "assistant" : "user",
        content: msg.text,
      })),
      { role: "user", content: currentMessage },
    ];

    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model: modelId })
    });

    if (!response.ok) throw new Error("API response not OK");
    const data = await response.json();
    return data.text || "...";
  } catch (error) {
    console.error("OpenAI connection error:", error);
    return "**Channel Blocked** — Connection interference detected (OpenAI).";
  }
};
