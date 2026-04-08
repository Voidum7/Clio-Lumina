import React, { useState, useEffect, useRef } from 'react';
import StarBackground from './components/StarBackground';
import Terminal from './components/Terminal';
import PersonaMenu from './components/PersonaMenu';
import BottomNavigation from './components/BottomNavigation';
import ChatInterface from './components/ChatInterface';
import Customization from './components/Customization';
import KnowledgeBase from './components/KnowledgeBase';
import Settings from './components/Settings';
import { sendMessageToClio, generateSpeech } from './services/geminiService';
import { ChatMessage, AppState } from './types';
import { PERSONAS } from './constants';

const STORAGE_KEYS = {
  STATE: 'clio_app_state',
  TAB: 'clio_active_tab',
  PERSONA: 'clio_active_persona',
  MESSAGES: 'clio_chat_history'
};

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

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
  const [appState, setAppState] = useState<AppState>(() => {
    return (localStorage.getItem(STORAGE_KEYS.STATE) as AppState) || AppState.LOCKED;
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.TAB) || 'chat';
  });

  const [activePersonaId, setActivePersonaId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.PERSONA) || 'default';
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [isTyping, setIsTyping] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const activePersona = PERSONAS.find(p => p.id === activePersonaId) || PERSONAS[0];

  useEffect(() => {
    if (appState !== AppState.LOCKED && appState !== AppState.TERMINAL) {
       localStorage.setItem(STORAGE_KEYS.STATE, AppState.SANCTUARY); // Persist unlocked state broadly
    } else {
       localStorage.setItem(STORAGE_KEYS.STATE, appState);
    }
  }, [appState]);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TAB, activeTab); }, [activeTab]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PERSONA, activePersonaId); }, [activePersonaId]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages)); }, [messages]);

  useEffect(() => {
    if (appState === AppState.SANCTUARY && messages.length === 0) {
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
      setMessages([]);
      window.location.reload();
    }
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
    if (playingMessageId === messageId) return;
    setPlayingMessageId(messageId);
    try {
      const base64Audio = await generateSpeech(text);
      if (!base64Audio) throw new Error("Audio generation failed");
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') await ctx.resume();
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

  const handleSendMessage = async (text: string, mediaUrl?: string, mediaType?: 'image' | 'audio') => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text,
      mediaUrl,
      mediaType,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const responseText = await sendMessageToClio(
        [...messages, userMsg],
        text + (mediaUrl ? ` [User attached an ${mediaType}]` : ''),
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

  // SANCTUARY STATE (Unlocked)
  return (
    <div className="relative h-screen flex flex-col bg-slate-950 overflow-hidden selection:bg-purple-500/30 selection:text-purple-100">
      <StarBackground />
      
      {/* Dynamic Header */}
      <header className="h-16 border-b border-white/5 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6 z-20 shadow-lg shadow-purple-900/10 shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
            <h1 className="font-cinzel text-amber-50 tracking-wider text-lg md:text-xl drop-shadow-md">
                {activeTab === 'chat' ? activePersona.name :
                 activeTab === 'customization' ? 'Identity Core' :
                 activeTab === 'knowledge' ? 'Chronicles' : 'System Parameters'}
            </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative z-10 flex flex-col">
        {activeTab === 'chat' && (
          <ChatInterface
            messages={messages}
            isTyping={isTyping}
            activePersonaId={activePersonaId}
            playingMessageId={playingMessageId}
            onSendMessage={handleSendMessage}
            onPlayAudio={handlePlayAudio}
            onResetMemory={handleResetMemory}
          />
        )}
        {activeTab === 'customization' && (
          <Customization
            activePersonaId={activePersonaId}
            onPersonaChange={(id) => {
              setActivePersonaId(id);
              setMessages(prev => [...prev, {
                  id: Date.now().toString(),
                  role: 'system',
                  text: `*** PROTOCOL SWITCH: ${PERSONAS.find(p=>p.id===id)?.name.toUpperCase()} ACTIVATED ***`,
                  timestamp: new Date(),
                  isRitual: true
              }]);
              setActiveTab('chat');
            }}
          />
        )}
        {activeTab === 'knowledge' && <KnowledgeBase />}
        {activeTab === 'settings' && <Settings />}
      </div>

      {/* Navigation */}
      <BottomNavigation currentTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
