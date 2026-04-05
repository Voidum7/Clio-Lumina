import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ChatMessage, Persona } from '../../types';

interface ChatScreenProps {
  messages: ChatMessage[];
  activePersona: Persona;
  isTyping: boolean;
  input: string;
  setInput: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  playingMessageId: string | null;
  handlePlayAudio: (id: string, text: string) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  messages,
  activePersona,
  isTyping,
  input,
  setInput,
  handleSendMessage,
  playingMessageId,
  handlePlayAudio
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <header className="h-16 border-b border-white/5 bg-slate-950/50 backdrop-blur-md flex items-center justify-center px-6 sticky top-0 z-20 shadow-lg shadow-purple-900/10">
        <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
            <h1 className="font-cinzel text-amber-50 tracking-wider text-lg md:text-xl drop-shadow-md">
                {activePersona.name}
            </h1>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent">
        <div className="max-w-4xl mx-auto space-y-8 pb-24">
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
                        <div className="text-lg leading-relaxed font-serif">
                            {msg.isRitual ? (
                                <span className="whitespace-pre-wrap">{msg.text}</span>
                            ) : (
                                <ReactMarkdown
                                    components={{
                                        p: ({node, ...props}) => <p className="mb-4 last:mb-0 leading-relaxed text-purple-50/90" {...props} />,
                                        strong: ({node, ...props}) => <strong className="font-bold text-purple-200 drop-shadow-[0_0_8px_rgba(192,132,252,0.6)]" {...props} />,
                                        em: ({node, ...props}) => <em className="italic text-amber-100/80 font-serif tracking-wide" {...props} />,
                                        h1: ({node, ...props}) => <h1 className="text-2xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-amber-100 mb-4 mt-6 border-b border-purple-500/30 pb-2" {...props} />,
                                        h2: ({node, ...props}) => <h2 className="text-xl font-cinzel text-purple-200 mb-3 mt-5" {...props} />,
                                        h3: ({node, ...props}) => <h3 className="text-lg font-cinzel text-purple-300 mb-2 mt-4" {...props} />,
                                        code: ({node, className, ...props}: any) => {
                                          const match = /language-(\w+)/.exec(className || '')
                                          const isInline = !match && !String(props.children).includes('\n');
                                          return isInline
                                            ? <code className="font-mono text-xs bg-purple-900/30 px-1.5 py-0.5 rounded text-green-300 border border-green-500/20" {...props} />
                                            : <code className="block font-mono text-xs text-green-300" {...props} />
                                        },
                                        pre: ({node, ...props}) => <pre className="font-mono text-xs bg-black/60 p-4 rounded-lg overflow-x-auto mb-4 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] backdrop-blur-sm" {...props} />,
                                        blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-amber-500/50 pl-4 italic text-slate-400 my-4 bg-amber-500/5 py-2 pr-2 rounded-r" {...props} />,
                                        ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1 text-purple-100/80" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1 text-purple-100/80" {...props} />,
                                        a: ({node, ...props}) => <a className="text-cyan-300 hover:text-cyan-100 underline underline-offset-2 decoration-cyan-500/50 hover:decoration-cyan-300 transition-colors" {...props} />,
                                    }}
                                >
                                    {msg.text}
                                </ReactMarkdown>
                            )}
                        </div>

                        {!msg.isRitual && (
                            <div className="flex justify-between items-end mt-2">
                              {msg.role === 'model' ? (
                                <button
                                  onClick={() => handlePlayAudio(msg.id, msg.text)}
                                  disabled={playingMessageId !== null && playingMessageId !== msg.id}
                                  className={`text-xs font-mono uppercase tracking-widest flex items-center gap-2 transition-all duration-300 ${playingMessageId === msg.id ? 'text-green-400' : 'text-purple-300/50 hover:text-purple-300'}`}
                                >
                                  {playingMessageId === msg.id ? (
                                    <>
                                      <span className="animate-pulse">Speaking...</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 animate-spin">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                                      </svg>
                                    </>
                                  ) : (
                                    <>
                                      <span>Voice</span>
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 2.485.8 4.737 2.133 6.595.342 1.241 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
                                        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
                                      </svg>
                                    </>
                                  )}
                                </button>
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
      <footer className="p-4 md:p-6 bg-slate-950/80 backdrop-blur-xl border-t border-white/5 sticky bottom-[70px] z-20">
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
      </footer>
    </div>
  );
};

export default ChatScreen;
