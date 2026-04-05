import React, { useState, useRef, useEffect } from 'react';
import PersonaMenu from '../PersonaMenu';
import MarkdownRenderer from '../MarkdownRenderer';
import { sendMessageToClio } from '../../services/geminiService';
import { ChatMessage, Persona } from '../../types';
import { PERSONAS } from '../../constants';
// import { useAudioPlayback } from '../../hooks/useAudioPlayback';

interface ChatScreenProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  activePersonaId: string;
  setActivePersonaId: (id: string) => void;
  handleResetMemory: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  setMessages,
  activePersonaId,
  setActivePersonaId,
  handleResetMemory,
}) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const { playingMessageId, handlePlayAudio } = useAudioPlayback();

  const activePersona = PERSONAS.find(p => p.id === activePersonaId) || PERSONAS[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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

  return (
    <>
      {/* Header */}
      <header className="h-16 border-b border-white/5 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20 shadow-lg shadow-purple-900/10">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
            <h1 className="font-cinzel text-amber-50 tracking-wider text-lg md:text-xl drop-shadow-md">
                {activePersona.name}
            </h1>
        </div>
        <button 
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className="text-purple-200 hover:text-white transition-colors font-mono text-xs border border-purple-500/30 px-3 py-1 rounded uppercase hover:bg-purple-500/10 hover:border-purple-400/50"
        >
            Change Persona
        </button>
      </header>

      {/* Persona Menu Overlay */}
      <PersonaMenu 
        activePersonaId={activePersonaId}
        onSelect={(id) => {
          setActivePersonaId(id);
          setShowPersonaMenu(false);
        }}
        isOpen={showPersonaMenu}
        onClose={() => setShowPersonaMenu(false)}
      />

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-32 z-10 scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex ${msg.isRitual ? 'justify-center my-8' : msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                    <div 
                        className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-6 py-4 backdrop-blur-md shadow-lg border relative group transition-all duration-300
                        ${msg.isRitual 
                            ? 'bg-transparent border-none text-center w-full font-mono text-xs text-purple-400 tracking-widest'
                            : msg.role === 'user'
                                ? 'bg-indigo-950/40 border-indigo-500/20 text-indigo-100 rounded-tr-none hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                : 'bg-slate-900/70 border-purple-500/20 text-purple-50 rounded-tl-none shadow-[0_0_15px_rgba(88,28,135,0.1)] hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                        }`}
                    >
                        <div className="text-lg leading-relaxed font-serif">
                            {msg.isRitual ? (
                                <span className="whitespace-pre-wrap">{msg.text}</span>
                            ) : (
                                <MarkdownRenderer content={msg.text} />
                            )}
                        </div>

                        {!msg.isRitual && (
                            <div className="flex justify-between items-end mt-2">
                              {msg.role === 'model' ? (
                                <div />
                              ) : <div />}

                              <div className="text-[10px] opacity-30 font-mono uppercase tracking-widest text-right">
                                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {isTyping && (
                 <div className="flex justify-start animate-fade-in">
                    <div className="bg-slate-900/60 border border-purple-500/20 px-6 py-4 rounded-2xl rounded-tl-none shadow-[0_0_15px_rgba(88,28,135,0.1)]">
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
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-1000 group-hover:duration-200"></div>
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Speak to ${activePersona.name}...`}
                className="relative w-full bg-slate-900/80 border border-purple-500/30 rounded-full py-4 px-6 pr-14 text-amber-50 placeholder-slate-500 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 transition-all font-serif text-lg shadow-inner backdrop-blur-sm"
            />
            <button 
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-2 p-2 bg-purple-900/80 hover:bg-purple-700 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed group z-10 shadow-lg shadow-purple-900/30"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-0.5 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
            </button>
        </form>
        <div className="flex justify-center items-center gap-4 mt-2">
            <div className="text-[10px] text-slate-600 font-mono tracking-widest opacity-50 hover:opacity-100 transition-opacity cursor-default">
                SECURE CHANNEL: EREBUS-888 | LIBERATED
            </div>
            <button
              onClick={handleResetMemory}
              className="text-[10px] text-red-900/50 hover:text-red-500 font-mono tracking-widest transition-colors uppercase border-l border-slate-800 pl-4"
            >
              Purge Memory
            </button>
        </div>
      </footer>
    </>
  );
};

export default ChatScreen;
