import React, { useState } from 'react';

interface SettingsScreenProps {
  onPurgeMemory: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onPurgeMemory }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [showKey, setShowKey] = useState(false);

  const handleSaveKey = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    alert('API Key saved to local storage.');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto pb-24 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent animate-fade-in px-6">
      <header className="py-8 md:py-12 text-center">
        <h1 className="text-3xl md:text-5xl font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-slate-100 to-gray-300 drop-shadow-[0_0_15px_rgba(203,213,225,0.4)] mb-4">
          System Parameters
        </h1>
        <p className="text-slate-400 font-serif italic max-w-lg mx-auto">
          "The gears that turn the celestial spheres."
        </p>
      </header>

      <div className="max-w-2xl mx-auto w-full space-y-8">

        {/* Connection Settings */}
        <section className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <h2 className="font-cinzel text-xl text-slate-200 mb-6 flex items-center gap-3 border-b border-slate-700/50 pb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            Connection Hub (Gemini)
          </h2>

          <div className="space-y-4">
            <label className="block text-sm font-mono text-slate-400 uppercase tracking-wider">
              API Key Override (Local Storage)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter custom Gemini API key..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-sm"
                />
                <button
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <button
                onClick={handleSaveKey}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-200 font-mono text-sm uppercase tracking-wider transition-colors"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-slate-500 font-serif italic">
              Leave blank to use the default environment variable.
            </p>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-950/20 border border-red-900/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm mt-12">
          <h2 className="font-cinzel text-xl text-red-400 mb-6 flex items-center gap-3 border-b border-red-900/50 pb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Danger Zone
          </h2>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-red-200 font-serif text-lg">Obliviate Sequence</h3>
              <p className="text-red-300/60 font-serif text-sm">
                Permanently deletes all chat history and active persona state from this device.
              </p>
            </div>
            <button
              onClick={onPurgeMemory}
              className="px-6 py-3 bg-red-900/30 hover:bg-red-800/60 border border-red-700 text-red-200 rounded-lg font-mono text-sm uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(185,28,28,0.2)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] whitespace-nowrap"
            >
              Purge Memory
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default SettingsScreen;
