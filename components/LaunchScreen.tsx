
import React from 'react';
import { Button } from './Common';

interface LaunchScreenProps {
  onStart: () => void;
}

const LaunchScreen: React.FC<LaunchScreenProps> = ({ onStart }) => {
  const MASCOT_URL = "https://raw.githubusercontent.com/google/generative-ai-docs/main/site/en/docs/static/dog_with_cards.png";

  return (
    <div className="fixed inset-0 z-[500] bg-slate-950 flex flex-col items-center justify-center p-8 overflow-y-auto scrollbar-hide">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-1000">
        {/* Welcoming Mascot Logo */}
        <div className="mb-10 relative group">
          <div className="absolute inset-0 bg-blue-600/40 blur-3xl rounded-full scale-150 opacity-50 group-hover:opacity-80 transition-opacity duration-700"></div>
          <img 
            src={MASCOT_URL} 
            alt="DexTCGMaker Mascot" 
            className="w-56 h-56 md:w-72 md:h-72 object-contain relative z-10 drop-shadow-[0_25px_25px_rgba(0,0,0,0.5)] transform group-hover:scale-110 transition-transform duration-1000"
          />
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm uppercase">
          DexTCGMaker
        </h1>
        
        <div className="mb-12 space-y-6">
          <p className="text-2xl md:text-3xl font-black text-slate-100 max-w-2xl leading-tight mx-auto tracking-tight">
            Your Ultimate TCG Design & Simulation Lab.
          </p>
          
          {/* Acronym Explanations */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { short: "TCG", long: "Trading Card Game", color: "text-blue-400 border-blue-500/20 bg-blue-500/5" },
              { short: "DSL", long: "Domain-Specific Language", color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5" },
              { short: "FAQ", long: "Frequently Asked Questions", color: "text-amber-400 border-amber-500/20 bg-amber-500/5" }
            ].map(item => (
              <div key={item.short} className={`px-6 py-2 border rounded-2xl flex flex-col items-center ${item.color} backdrop-blur-sm transition-transform hover:scale-105 shadow-xl`}>
                <span className="text-sm font-black tracking-widest">{item.short}</span>
                <span className="text-[10px] font-bold opacity-60 uppercase">{item.long}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-14 text-left">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-md transition-all hover:bg-slate-900/60 hover:border-blue-500/30">
            <h3 className="text-blue-400 font-black uppercase tracking-widest text-xs mb-4">Step 1: Architecting</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Head to the **Ruleset Lab** to configure the core logic. Define card stats and unique behaviors in the **Card Lab** using our specialized **DSL**.
            </p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-md transition-all hover:bg-slate-900/60 hover:border-indigo-500/30">
            <h3 className="text-indigo-400 font-black uppercase tracking-widest text-xs mb-4">Step 2: Prototyping</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              Create builds in the **Deck Builder** and enter the **Sandbox** to battle. Refer to the **FAQ** in the Rules Library for syntax help.
            </p>
          </div>
        </div>

        <Button 
          onClick={onStart} 
          className="px-20 py-6 text-2xl rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_20px_80px_rgba(59,130,246,0.5)] transform hover:scale-105 active:scale-95 transition-all font-black tracking-tighter uppercase"
        >
          Initialize Studio
        </Button>
        
        <p className="mt-12 text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] opacity-50">
          Build 0.5.1 Alpha • Powered by Gemini & Google AI Studio
        </p>
      </div>
    </div>
  );
};

export default LaunchScreen;
