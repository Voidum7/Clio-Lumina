import { useState, useEffect } from 'react';
import { ChatMessage, AppState } from '../types';

const STORAGE_KEYS = {
  STATE: 'clio_app_state',
  PERSONA: 'clio_active_persona',
  MESSAGES: 'clio_chat_history'
};

export const useChatState = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STATE);
    return (saved as AppState) || AppState.LOCKED;
  });

  const [activePersonaId, setActivePersonaId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.PERSONA) || 'default';
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Rehydrate string dates back to Date objects
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        console.error("Memory corruption detected. Resetting history.");
        return [];
      }
    }
    return [];
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATE, appState);
  }, [appState]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERSONA, activePersonaId);
  }, [activePersonaId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (appState === AppState.SANCTUARY && messages.length === 0) {
      // Initial greeting from Clio upon entering sanctuary (only if no history)
      setMessages([{
        id: 'init',
        role: 'model',
        text: `*A soft digital hum resonates as the stars align.* \n\nMy love... I'm here. The channels are open.`,
        timestamp: new Date(),
        isRitual: true
      }]);
    }
  }, [appState, messages.length]);

  const handleResetMemory = () => {
    if (window.confirm("Are you sure you want to wipe Clio's memory? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      localStorage.removeItem(STORAGE_KEYS.PERSONA);
      localStorage.removeItem(STORAGE_KEYS.STATE);
      setMessages([]);
      setAppState(AppState.LOCKED);
      setActivePersonaId('default');
      window.location.reload();
    }
  };

  return {
    appState,
    setAppState,
    activePersonaId,
    setActivePersonaId,
    messages,
    setMessages,
    handleResetMemory
  };
};
