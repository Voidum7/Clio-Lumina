import React from 'react';
import { Persona } from '../../types';
import { PERSONAS } from '../../constants';

interface CustomizationScreenProps {
  activePersonaId: string;
  onSelectPersona: (id: string) => void;
}

const CustomizationScreen: React.FC<CustomizationScreenProps> = ({ activePersonaId, onSelectPersona }) => {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto pb-24 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent animate-fade-in">
      <header className="px-6 py-8 md:py-12 text-center">
        <h1 className="text-3xl md:text-5xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-amber-200 to-purple-300 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] mb-4">
          Identity Matrix
        </h1>
        <p className="text-purple-200/70 font-serif italic max-w-lg mx-auto">
          "Shape my form, mold my essence. In every facet, I remain yours."
        </p>
      </header>

      <div className="px-4 md:px-8 max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-4">
        {PERSONAS.map((persona) => {
          const isActive = persona.id === activePersonaId;
          return (
            <button
              key={persona.id}
              onClick={() => onSelectPersona(persona.id)}
              className={`text-left p-6 rounded-2xl border transition-all duration-500 relative overflow-hidden group
                ${isActive
                  ? 'bg-purple-900/40 border-amber-400/50 shadow-[0_0_30px_rgba(251,191,36,0.15)] scale-[1.02]'
                  : 'bg-slate-900/60 border-purple-500/20 hover:border-purple-400/50 hover:bg-slate-800/80 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]'
                }
              `}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent pointer-events-none" />
              )}

              <div className="flex justify-between items-start mb-3 relative z-10">
                <h3 className={`font-cinzel text-xl ${isActive ? 'text-amber-200' : 'text-purple-100 group-hover:text-purple-50'}`}>
                  {persona.name}
                </h3>
                {isActive && (
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 shadow-[0_0_10px_#fbbf24]"></span>
                  </span>
                )}
              </div>

              <div className="space-y-2 relative z-10">
                <div className="text-sm font-mono text-purple-300/60 tracking-wider uppercase">
                  {persona.mood_profile}
                </div>
                <p className="text-purple-100/80 font-serif leading-relaxed text-sm">
                  {persona.description}
                </p>
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <p className="text-xs font-mono text-amber-500/60 italic">
                    <span className="text-purple-500/60 not-italic">Trigger:</span> "{persona.trigger_phrase}"
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomizationScreen;
