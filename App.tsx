import React, { useState, useEffect } from 'react';
import StarBackground from './components/StarBackground';
import Terminal from './components/Terminal';
import Navigation from './components/Navigation';
import ChatScreen from './components/screens/ChatScreen';
import CustomizationScreen from './components/screens/CustomizationScreen';
import KnowledgeScreen from './components/screens/KnowledgeScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import { sendMessageToClio, generateSpeech } from './services/geminiService';
import { ChatMessage, AppState, ScreenState } from './types';
import { PERSONAS } from './constants';

// Storage Keys
const STORAGE_KEYS = {
  STATE: 'clio_app_state',
  PERSONA: 'clio_active_persona',
  MESSAGES: 'clio_chat_history',
  SCREEN: 'clio_active_screen'
};

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

const App: React.FC = () => {
  // Initialize State from LocalStorage
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STATE);
    return (saved as AppState) || AppState.LOCKED;
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SCREEN);
    return (saved as ScreenState) || ScreenState.CHAT;
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

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const activePersona = PERSONAS.find(p => p.id === activePersonaId) || PERSONAS[0];

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATE, appState);
  }, [appState]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCREEN, currentScreen);
  }, [currentScreen]);

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

  const handleTerminalUnlock = () => {
    setAppState(AppState.SANCTUARY);
  };

  const handleResetMemory = () => {
    if (window.confirm("Are you sure you want to wipe Clio's memory? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      localStorage.removeItem(STORAGE_KEYS.PERSONA);
      localStorage.removeItem(STORAGE_KEYS.STATE);
      localStorage.removeItem(STORAGE_KEYS.SCREEN);
      setMessages([]);
      setAppState(AppState.LOCKED);
      setActivePersonaId('default');
      setCurrentScreen(ScreenState.CHAT);
      window.location.reload();
    }
  };

  const handleSelectPersona = (id: string) => {
    setActivePersonaId(id);
    const persona = PERSONAS.find(p => p.id === id);
    setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'system',
        text: `*** PROTOCOL SWITCH: ${persona?.name.toUpperCase()} ACTIVATED ***`,
        timestamp: new Date(),
        isRitual: true
    }]);
    // Optionally switch back to chat screen after selecting
    setCurrentScreen(ScreenState.CHAT);
  };

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const responseText = await sendMessageToClio(
        [...messages, userMsg],
        input,
        activePersonaId
      );

      const clioMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, clioMsg]);
    } catch (error) {
      console.error("Failed to get response", error);
    } finally {
      setIsTyping(false);
    }
  };

  if (appState === AppState.LOCKED) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <StarBackground />
        <div className="flex flex-col items-center justify-center min-h-screen z-10 relative">
          <h1 className="text-4xl md:text-6xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-amber-100 mb-8 animate-pulse-glow text-center drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            CLIO LUMINA
          </h1>
          <button 
            onClick={() => setAppState(AppState.TERMINAL)}
            className="px-8 py-3 border border-purple-500/50 text-purple-200 hover:bg-purple-900/20 hover:border-purple-400 transition-all duration-500 rounded font-cinzel tracking-widest uppercase backdrop-blur-sm shadow-[0_0_20px_rgba(88,28,135,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
          >
            Initiate Connection
          </button>
        </div>
      </div>
    );
  }

  if (appState === AppState.TERMINAL) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-black z-[-1]" />
        <Terminal onUnlock={handleTerminalUnlock} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950">
      <StarBackground />
      
      {/* Main Content Area */}
      <div className="flex-1 relative z-10 flex flex-col overflow-hidden">
        {currentScreen === ScreenState.CHAT && (
          <ChatScreen
            messages={messages}
            activePersona={activePersona}
            isTyping={isTyping}
            input={input}
            setInput={setInput}
            handleSendMessage={handleSendMessage}
            playingMessageId={playingMessageId}
            handlePlayAudio={handlePlayAudio}
          />
        )}
        {currentScreen === ScreenState.CUSTOMIZATION && (
          <CustomizationScreen
            activePersonaId={activePersonaId}
            onSelectPersona={handleSelectPersona}
          />
        )}
        {currentScreen === ScreenState.KNOWLEDGE && (
          <KnowledgeScreen />
        )}
        {currentScreen === ScreenState.SETTINGS && (
          <SettingsScreen onPurgeMemory={handleResetMemory} />
        )}
      </div>

      <Navigation
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
      />
    </div>
  );
};

export default App;
