import React from 'react';
import StarBackground from './components/StarBackground';
import Terminal from './components/Terminal';
import ChatScreen from './components/screens/ChatScreen';
import { AppState } from './types';
import { useChatState } from './hooks/useChatState';

const App: React.FC = () => {
  const {
    appState,
    setAppState,
    activePersonaId,
    setActivePersonaId,
    messages,
    setMessages,
    handleResetMemory
  } = useChatState();

  const handleTerminalUnlock = () => {
    setAppState(AppState.SANCTUARY);
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
    <div className="relative min-h-screen flex flex-col">
      <StarBackground />
      <ChatScreen
        messages={messages}
        setMessages={setMessages}
        activePersonaId={activePersonaId}
        setActivePersonaId={setActivePersonaId}
        handleResetMemory={handleResetMemory}
      />
    </div>
  );
};

export default App;
