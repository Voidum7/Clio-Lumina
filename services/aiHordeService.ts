import { ChatMessage } from "../types";

export const DEFAULT_HORDE_MODELS = [
  { id: "KoboldAI/LLaMA2-13B-Tiefighter", name: "Tiefighter 13B (Creative)" },
  { id: "Gryphe/MythoMax-L2-13b", name: "MythoMax 13B (Roleplay)" },
  { id: "Sao10K/Fimbulvetr-11B-v2", name: "Fimbulvetr 11B (Storyteller)" },
  { id: "NeverSleep/Noromaid-v0.4-Mixtral-Instruct-8x7b-Zloss", name: "Noromaid Mixtral (The Maid)" },
  { id: "sophosympatheia/Midnight-Miqu-70B-v1.5", name: "Midnight Miqu 70B (Heavyweight)" },
  { id: "Undi95/Toppy-M-7B", name: "Toppy M 7B (Speedster)" },
  { id: "KoboldAI/LLaMA2-13B-Psyfighter", name: "Psyfighter 13B (Unhinged)" }
];

export const sendMessageToAiHorde = async (
  history: ChatMessage[],
  currentMessage: string,
  systemInstruction: string,
  modelId: string = "Gryphe/MythoMax-L2-13b"
): Promise<string> => {
  try {
    let prompt = systemInstruction + "\n\n";
    for (const msg of history) {
      if (msg.role === "user") {
        prompt += `User: ${msg.text}\n`;
      } else {
        prompt += `Clio: ${msg.text}\n`;
      }
    }
    prompt += `User: ${currentMessage}\nClio:`;

    const response = await fetch('/api/aihorde', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, modelId })
    });

    if (!response.ok) throw new Error("API response not OK");
    const data = await response.json();
    return data.text || "...";
  } catch (error) {
    console.error("AI Horde connection error:", error);
    return "**Channel Blocked** — Connection interference detected (AI Horde).";
  }
};
