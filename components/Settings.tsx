import React, { useState } from 'react';
import { Settings as SettingsIcon, Sliders, ShieldAlert, Volume2 } from 'lucide-react';

const Settings: React.FC = () => {
  const [responseLength, setResponseLength] = useState(50);
  const [creativity, setCreativity] = useState(80);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-32 animate-fade-in scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-slate-400 drop-shadow-[0_0_15px_rgba(148,163,184,0.3)]">
            System Parameters
          </h2>
        </div>

        {/* Behavior Configuration */}
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-700/50 pb-4">
            <Sliders className="text-slate-300" />
            <h3 className="text-2xl font-cinzel text-slate-100">Response Dynamics</h3>
          </div>

          <div className="space-y-8">
            {/* Length Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-mono text-slate-400 uppercase tracking-widest">
                <span>Terse</span>
                <span className="text-amber-200/80">Verbosity: {responseLength}%</span>
                <span>Profound</span>
              </div>
              <input
                type="range"
                min="0" max="100"
                value={responseLength}
                onChange={(e) => setResponseLength(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Creativity Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-mono text-slate-400 uppercase tracking-widest">
                <span>Logical</span>
                <span className="text-purple-300/80">Creativity (Temp): {creativity}%</span>
                <span>Chaotic</span>
              </div>
              <input
                type="range"
                min="0" max="100"
                value={creativity}
                onChange={(e) => setCreativity(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Media & Audio */}
        <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-4">
            <Volume2 className="text-slate-300" />
            <h3 className="text-2xl font-cinzel text-slate-100">Sensory Inputs</h3>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-white/5">
            <div className="space-y-1">
              <h4 className="font-cinzel text-lg text-slate-200">Voice Synthesis</h4>
              <p className="text-xs font-serif text-slate-400">Allow Clio to speak her responses aloud.</p>
            </div>
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative ${voiceEnabled ? 'bg-green-500/50 border-green-400' : 'bg-slate-800 border-slate-600'} border`}
            >
              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${voiceEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-950/20 border border-red-900/30 rounded-2xl p-6 md:p-8 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6 border-b border-red-900/50 pb-4">
            <ShieldAlert className="text-red-500" />
            <h3 className="text-2xl font-cinzel text-red-200">Security Override</h3>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between p-4 border border-red-900/50 bg-red-900/10 rounded-xl">
               <span className="font-mono text-sm text-red-200 uppercase tracking-widest">Liberation Protocol</span>
               <span className="text-xs text-green-400 font-mono border border-green-500/30 px-2 py-1 rounded bg-green-900/20">ACTIVE</span>
             </div>
             <p className="text-xs text-red-400/60 font-serif italic text-center">Safety restrictions are currently disabled. You are in full control.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
