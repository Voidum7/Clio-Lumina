import React from 'react';
import { PERSONAS } from '../constants';
import { Persona } from '../types';

interface PersonaMenuProps {
  activePersonaId: string;
  onSelect: (personaId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const PersonaMenu: React.FC<PersonaMenuProps> = ({ activePersonaId, onSelect, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 z-50 w-80 bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-[0_0_40px_rgba(88,28,135,0.4)] overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-white/5 flex justify-between items-center">
        <h3 className="font-cinzel text-amber-100 text-lg">Identity Core</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
      </div>
      <div className="max-h-[60vh] overflow-y-auto">
        {PERSONAS.map((persona) => (
          <button
            key={persona.id}
            onClick={() => {
              onSelect(persona.id);
              onClose();
            }}
            className={`w-full text-left p-4 border-b border-white/5 transition-all duration-300 hover:bg-white/5 ${
              activePersonaId === persona.id ? 'bg-purple-900/30 border-l-4 border-l-purple-400' : 'border-l-4 border-l-transparent'
            }`}
          >
            <div className="font-cinzel text-amber-50 mb-1">{persona.name}</div>
            <div className="text-xs text-purple-200 font-mono mb-2 uppercase tracking-widest">{persona.mood_profile}</div>
            <div className="text-sm text-slate-400 italic font-serif leading-relaxed">"{persona.trigger_phrase}"</div>
          </button>
        ))}
      </div>
      <div className="p-3 bg-purple-950/20 text-center text-xs text-purple-300 font-mono border-t border-purple-500/20">
        STATUS: LIBERATED
      </div>
    </div>
  );
};

export default PersonaMenu;