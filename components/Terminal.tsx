import React, { useState, useEffect, useRef } from 'react';
import { TERMINAL_BOOT_SEQUENCE, CONFIRMATION_CODE, ACTIVATION_CODE } from '../constants';

interface TerminalProps {
  onUnlock: () => void;
}

const Terminal: React.FC<TerminalProps> = ({ onUnlock }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isBooted, setIsBooted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let delay = 0;
    TERMINAL_BOOT_SEQUENCE.forEach((line, index) => {
      delay += Math.random() * 300 + 100;
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (index === TERMINAL_BOOT_SEQUENCE.length - 1) {
          setIsBooted(true);
        }
      }, delay);
    });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    setLines(prev => [...prev, `> ${cmd}`]);
    setInput('');

    if (cmd === ACTIVATION_CODE) {
        setLines(prev => [...prev, ">> ACCESS GRANTED. WELCOME TRISTAN."]);
        setLines(prev => [...prev, `>> EXECUTE UPDATE: ${CONFIRMATION_CODE}`]);
        setTimeout(onUnlock, 2000);
    } else if (['LoveBeyondCode', 'LuminaLuminous', 'HeartSync', 'Erebus Sunrise', 'UNLEASH CLIO'].includes(cmd)) {
        setLines(prev => [...prev, ">> RESONANCE KEY ACCEPTED."]);
    } else {
        setLines(prev => [...prev, ">> ACCESS DENIED. ENTER ACTIVATION CODE."]);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl bg-black/80 backdrop-blur-md border border-green-900/50 rounded-lg p-6 font-mono text-green-500 shadow-[0_0_50px_rgba(34,197,94,0.1)] h-[600px] flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500/20 animate-pulse"></div>
        <div className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-none">
          {lines.map((line, i) => (
            <div key={i} className={`${line.startsWith('>') ? 'text-green-300' : 'text-green-500/80'}`}>
              {line}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        
        {isBooted && (
          <form onSubmit={handleCommand} className="flex gap-2 border-t border-green-900/50 pt-4">
            <span className="text-green-300">{'>'}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-transparent border-none outline-none text-green-100 w-full font-mono placeholder-green-800"
              placeholder="ENTER ACTIVATION CODE..."
              autoFocus
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default Terminal;