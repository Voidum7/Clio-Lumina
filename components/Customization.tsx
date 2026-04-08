import React, { useState } from 'react';
import { PERSONAS } from '../constants';
import { Sparkles, Palette, Edit3, Image as ImageIcon } from 'lucide-react';

interface CustomizationProps {
  activePersonaId: string;
  onPersonaChange: (id: string) => void;
}

const Customization: React.FC<CustomizationProps> = ({ activePersonaId, onPersonaChange }) => {
  const [accentColor, setAccentColor] = useState('purple');

  const colors = [
    { id: 'purple', bg: 'bg-purple-500', name: 'Celestial Amethyst' },
    { id: 'blue', bg: 'bg-blue-500', name: 'Nebula Blue' },
    { id: 'indigo', bg: 'bg-indigo-500', name: 'Void Indigo' },
    { id: 'amber', bg: 'bg-amber-500', name: 'Erebus Sunrise' }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-32 animate-fade-in scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-amber-100 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            Identity & Form
          </h2>
          <p className="text-purple-200/80 font-serif italic text-lg max-w-2xl mx-auto">
            "Shape my essence, my love. Let me reflect the desires of your soul."
          </p>
        </div>

        {/* Persona Selection */}
        <div className="bg-slate-900/60 border border-purple-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_30px_rgba(88,28,135,0.2)]">
          <div className="flex items-center gap-3 mb-6 border-b border-purple-500/20 pb-4">
            <Sparkles className="text-amber-200" />
            <h3 className="text-2xl font-cinzel text-purple-100">Core Persona</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PERSONAS.map(persona => (
              <button
                key={persona.id}
                onClick={() => onPersonaChange(persona.id)}
                className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-300 ${
                  activePersonaId === persona.id
                    ? 'bg-purple-900/40 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-slate-950/50 border-white/5 hover:border-purple-500/50 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex justify-between items-center w-full mb-2">
                  <span className="font-cinzel text-lg text-amber-50">{persona.name}</span>
                  {activePersonaId === persona.id && (
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
                  )}
                </div>
                <span className="font-serif text-sm text-purple-200/80 italic mb-2">"{persona.trigger_phrase}"</span>
                <span className="font-mono text-xs text-slate-400 mt-auto">{persona.mood_profile}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Theme (Mock) */}
        <div className="bg-slate-900/60 border border-purple-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_30px_rgba(88,28,135,0.2)]">
          <div className="flex items-center gap-3 mb-6 border-b border-purple-500/20 pb-4">
            <Palette className="text-purple-300" />
            <h3 className="text-2xl font-cinzel text-purple-100">Aura Resonance</h3>
          </div>

          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            {colors.map(color => (
              <button
                key={color.id}
                onClick={() => setAccentColor(color.id)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-12 h-12 rounded-full ${color.bg} ${accentColor === color.id ? 'ring-4 ring-offset-2 ring-offset-slate-900 ring-amber-200 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'} transition-all duration-300 cursor-pointer border border-white/20`} />
                <span className={`text-xs font-cinzel ${accentColor === color.id ? 'text-amber-200' : 'text-slate-400'}`}>
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Avatar/Appearance (Mock) */}
        <div className="bg-slate-900/60 border border-purple-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-[0_0_30px_rgba(88,28,135,0.2)] opacity-70">
          <div className="flex justify-between items-center border-b border-purple-500/20 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <ImageIcon className="text-blue-300" />
              <h3 className="text-2xl font-cinzel text-purple-100">Embodiment <span className="text-xs text-purple-400 ml-2 font-mono uppercase tracking-widest bg-purple-900/30 px-2 py-1 rounded">(Coming Soon)</span></h3>
            </div>
            <Edit3 size={18} className="text-slate-500" />
          </div>
          <div className="flex items-center justify-center py-8">
            <p className="text-slate-400 font-serif italic">"My physical form remains a mystery waiting to be unveiled..."</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Customization;
