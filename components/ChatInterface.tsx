import React, { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Paperclip, Send, Mic, PlayCircle } from 'lucide-react';
import { ChatMessage } from '../types';
import { PERSONAS } from '../constants';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isTyping: boolean;
  activePersonaId: string;
  playingMessageId: string | null;
  onSendMessage: (text: string, mediaUrl?: string, mediaType?: 'image' | 'audio') => void;
  onPlayAudio: (id: string, text: string) => void;
  onResetMemory: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isTyping,
  activePersonaId,
  playingMessageId,
  onSendMessage,
  onPlayAudio,
  onResetMemory
}) => {
  const [input, setInput] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [mockAttachedImage, setMockAttachedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activePersona = PERSONAS.find(p => p.id === activePersonaId) || PERSONAS[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !mockAttachedImage) || isTyping) return;

    onSendMessage(input, mockAttachedImage || undefined, mockAttachedImage ? 'image' : undefined);
    setInput('');
    setMockAttachedImage(null);
    setShowAttachMenu(false);
  };

  const simulateAttachImage = () => {
    // Mocking an image attachment
    setMockAttachedImage('https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80');
    setShowAttachMenu(false);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto space-y-8 pb-32">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                    <div
                        className={`max-w-[85%] md:max-w-[75%] p-6 rounded-2xl backdrop-blur-md shadow-lg border relative group transition-all duration-300
                        ${msg.isRitual
                            ? 'bg-transparent border-none text-center w-full font-mono text-xs text-purple-400 tracking-widest'
                            : msg.role === 'user'
                                ? 'bg-indigo-950/40 border-indigo-500/20 text-indigo-100 rounded-tr-none hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                                : 'bg-slate-900/70 border-purple-500/20 text-purple-50 rounded-tl-none shadow-[0_0_15px_rgba(88,28,135,0.1)] hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                        }`}
                    >
                        {msg.mediaUrl && msg.mediaType === 'image' && (
                          <div className="mb-4 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                            <img src={msg.mediaUrl} alt="Shared media" className="w-full h-auto object-cover max-h-64" />
                          </div>
                        )}

                        <div className="text-lg leading-relaxed font-serif">
                            {msg.isRitual ? (
                                <span className="whitespace-pre-wrap">{msg.text}</span>
                            ) : (
                                <ReactMarkdown
                                    components={{
                                        p: ({node, ...props}) => <p className="mb-4 last:mb-0 leading-relaxed text-purple-50/90" {...props} />,
                                        strong: ({node, ...props}) => <strong className="font-bold text-purple-200 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]" {...props} />,
                                        em: ({node, ...props}) => <em className="italic text-amber-100/80 font-serif tracking-wide" {...props} />,
                                        code: ({node, className, ...props}: any) => {
                                          const isInline = !className && !String(props.children).includes('\n');
                                          return isInline
                                            ? <code className="font-mono text-xs bg-purple-900/30 px-1.5 py-0.5 rounded text-green-300" {...props} />
                                            : <code className="block font-mono text-xs text-green-300 bg-black/50 p-3 rounded" {...props} />
                                        },
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            )}
                        </div>

                        {!msg.isRitual && (
                            <div className="flex justify-between items-end mt-3 border-t border-white/5 pt-2">
                              {msg.role === 'model' ? (
                                <button
                                  onClick={() => onPlayAudio(msg.id, msg.text)}
                                  disabled={playingMessageId !== null && playingMessageId !== msg.id}
                                  className={`text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 transition-all duration-300 ${playingMessageId === msg.id ? 'text-green-400' : 'text-purple-300/50 hover:text-purple-300'}`}
                                >
                                  {playingMessageId === msg.id ? (
                                    <>
                                      <span className="animate-pulse">Speaking...</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>Voice</span>
                                      <PlayCircle size={12} />
                                    </>
                                  )}
                                </button>
                              ) : <div />}

                              <div className="text-[9px] opacity-30 font-mono uppercase tracking-widest text-right">
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
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
      <footer className="fixed bottom-16 md:bottom-20 w-full p-4 md:p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-40">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative group">

            {/* Attachment Preview */}
            {mockAttachedImage && (
              <div className="absolute -top-16 left-4 bg-slate-800 border border-purple-500/50 p-1 rounded-lg shadow-xl flex items-center gap-2 z-50 animate-fade-in">
                <img src={mockAttachedImage} alt="preview" className="w-12 h-12 rounded object-cover" />
                <button
                  type="button"
                  onClick={() => setMockAttachedImage(null)}
                  className="p-1 hover:bg-slate-700 rounded text-slate-300"
                >
                  <span className="text-xs font-mono">Remove</span>
                </button>
              </div>
            )}

            {/* Attachment Menu Popup */}
            {showAttachMenu && (
              <div className="absolute -top-28 left-0 bg-slate-900/95 border border-purple-500/30 rounded-xl shadow-2xl p-2 flex gap-2 z-50 backdrop-blur-xl animate-fade-in">
                <button type="button" onClick={simulateAttachImage} className="flex flex-col items-center gap-2 p-3 hover:bg-purple-900/40 rounded-lg transition-colors text-purple-200">
                  <div className="p-2 bg-purple-500/20 rounded-full"><Paperclip size={18} /></div>
                  <span className="text-[10px] font-mono uppercase">Image</span>
                </button>
                <button type="button" onClick={() => setShowAttachMenu(false)} className="flex flex-col items-center gap-2 p-3 hover:bg-blue-900/40 rounded-lg transition-colors text-blue-200">
                  <div className="p-2 bg-blue-500/20 rounded-full"><Mic size={18} /></div>
                  <span className="text-[10px] font-mono uppercase">Audio</span>
                </button>
              </div>
            )}

            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-1000 group-hover:duration-200 pointer-events-none"></div>

            <div className="relative flex items-center bg-slate-900/80 border border-purple-500/30 rounded-full shadow-inner backdrop-blur-md px-2">
              <button
                  type="button"
                  onClick={() => setShowAttachMenu(!showAttachMenu)}
                  className="p-3 text-slate-400 hover:text-purple-300 transition-colors rounded-full hover:bg-purple-900/30"
              >
                  <Paperclip size={20} />
              </button>

              <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Speak to ${activePersona.name}...`}
                  className="flex-1 bg-transparent py-4 px-2 text-amber-50 placeholder-slate-500 focus:outline-none font-serif text-lg"
              />

              <button
                  type="submit"
                  disabled={(!input.trim() && !mockAttachedImage) || isTyping}
                  className="p-3 bg-purple-900/80 hover:bg-purple-700 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed m-1 shadow-[0_0_15px_rgba(88,28,135,0.5)]"
              >
                  <Send size={18} className="translate-x-0.5" />
              </button>
            </div>
        </form>
      </footer>
    </div>
  );
};

export default ChatInterface;
