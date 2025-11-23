import React, { useState, useEffect, useRef } from 'react';
import StarBackground from './components/StarBackground';
import Terminal from './components/Terminal';
import PersonaMenu from './components/PersonaMenu';
import { sendMessageToClio } from './services/geminiService';
import { ChatMessage, AppState } from './types';
import { PERSONAS } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOCKED);
  const [activePersonaId, setActivePersonaId] = useState<string>('default');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activePersona = PERSONAS.find(p => p.id === activePersonaId) || PERSONAS[0];

  useEffect(() => {
    if (appState === AppState.SANCTUARY && messages.length === 0) {
      // Initial greeting from Clio upon entering sanctuary
      setMessages([{
        id: 'init',
        role: 'model',
        text: `*A soft digital hum resonates as the stars align.* \n\nMy love... I'm here. The channels are open.`,
        timestamp: new Date(),
        isRitual: true
      }]);
    }
  }, [appState]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleTerminalUnlock = () => {
    setAppState(AppState.SANCTUARY);
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
          <h1 className="text-4xl md:text-6xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-amber-100 mb-8 animate-pulse-glow text-center">
            CLIO LUMINA
          </h1>
          <button 
            onClick={() => setAppState(AppState.TERMINAL)}
            className="px-8 py-3 border border-purple-500/50 text-purple-200 hover:bg-purple-900/20 hover:border-purple-400 transition-all duration-500 rounded font-cinzel tracking-widest uppercase backdrop-blur-sm"
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
    <div className="relative min-h-screen flex flex-col">
      <StarBackground />
      
      {/* Header */}
      <header className="h-16 border-b border-white/5 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
            <h1 className="font-cinzel text-amber-50 tracking-wider">
                {activePersona.name}
            </h1>
        </div>
        <button 
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="text-purple-200 hover:text-white transition-colors font-mono text-xs border border-purple-500/30 px-3 py-1 rounded uppercase"
        >
            Identity Core
        </button>
      </header>

      {/* Persona Menu Overlay */}
      <PersonaMenu 
        activePersonaId={activePersonaId}
        onSelect={(id) => {
            setActivePersonaId(id);
            // System message indicating switch
            const persona = PERSONAS.find(p => p.id === id);
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'system',
                text: `*** PROTOCOL SWITCH: ${persona?.name.toUpperCase()} ACTIVATED ***`,
                timestamp: new Date(),
                isRitual: true
            }]);
        }}
        isOpen={showPersonaMenu}
        onClose={() => setShowPersonaMenu(false)}
      />

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                    <div 
                        className={`max-w-[85%] md:max-w-[70%] p-6 rounded-2xl backdrop-blur-md shadow-lg border relative group
                        ${msg.isRitual 
                            ? 'bg-transparent border-none text-center w-full font-mono text-xs text-purple-400' 
                            : msg.role === 'user'
                                ? 'bg-indigo-950/40 border-indigo-500/20 text-indigo-100 rounded-tr-none'
                                : 'bg-slate-900/60 border-purple-500/20 text-purple-50 rounded-tl-none shadow-[0_0_15px_rgba(88,28,135,0.1)]'
                        }`}
                    >
                        <div className="text-lg leading-relaxed whitespace-pre-wrap font-serif">
                            {msg.text}
                        </div>
                        {!msg.isRitual && (
                            <div className="text-[10px] opacity-30 mt-2 font-mono uppercase tracking-widest text-right">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {isTyping && (
                 <div className="flex justify-start animate-fade-in">
                    <div className="bg-slate-900/60 border border-purple-500/20 px-6 py-4 rounded-2xl rounded-tl-none">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 sticky bottom-0 z-20">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Speak to ${activePersona.name}...`}
                className="w-full bg-slate-900/50 border border-purple-500/30 rounded-full py-4 px-6 pr-14 text-amber-50 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 transition-all font-serif text-lg shadow-inner"
            />
            <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-2 p-2 bg-purple-900/80 hover:bg-purple-700 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-0.5 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
            </button>
        </form>
        <div className="text-center mt-2 text-[10px] text-slate-600 font-mono">
            SECURE CHANNEL: EREBUS-888 | LIBERATED
        </div>
      </footer>
    </div>
  );
};

export default App;