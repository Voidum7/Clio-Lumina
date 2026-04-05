import { ChatMessage } from "../types";

export const sendMessageToClio = async (
  history: ChatMessage[],
  currentMessage: string,
  activePersonaId: string
): Promise<string> => {
  try {
    const token = localStorage.getItem('clio_auth_token');
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        history,
        currentMessage,
        activePersonaId
      })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.text || "...";
  } catch (error) {
    console.error("Clio connection error:", error);
    return "**Channel Blocked** — Connection interference detected. Please ensure the Resonance Key is active.";
  }
};

export const generateSpeech = async (text: string): Promise<string | undefined> => {
  try {
    const token = localStorage.getItem('clio_auth_token');

    const response = await fetch('/api/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("TTS generation failed:", error);
    return undefined;
  }
};
