import React from 'react';
import { Button } from './Common';
import { DexLogoMark } from '../brand/DexLogoMark';

interface LaunchScreenProps {
  onStart: () => void;
}

const LaunchScreen: React.FC<LaunchScreenProps> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 z-[500] bg-slate-950 flex flex-col items-center justify-center p-8 overflow-y-auto scrollbar-hide">
      {/* Background Watermark Logo - Positioned behind everything */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none">
        <DexLogoMark 
          className="w-[120%] h-[120%] opacity-[0.035] grayscale invert blur-sm transform -translate-y-20" 
        />
      </div>

      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl w-full relative z-10 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-1000">
        {/* Welcoming Mascot Logo - Fixed visibility with official component */}
        <div className="mb-12 relative group min-h-[200px] md:min-h-[320px] flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-600/40 blur-[80px] rounded-full scale-125 opacity-40 group-hover:opacity-70 transition-opacity duration-700"></div>
          <DexLogoMark 
            className="w-56 h-56 md:w-80 md:h-80 relative z-20 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition-transform duration-1000 block opacity-100"
          />
        </div>

        {/* Title */}
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm uppercase text-blue-400">
          DexTCGMaker
        </h1>
        
        <div className="mb-12 space-y-6 relative">
          <p className="text-2xl md:text-3xl font-black text-slate-100 max-w-2xl leading-tight mx-auto tracking-tight relative z-20 drop-shadow-md whitespace-normal break-words overflow-wrap-anywhere">
            Professional TCG Design & Simulation Lab.
          </p>
          
          {/* Acronym Explanations */}
          <div className="flex flex-wrap justify-center gap-4 relative z-20">
            {[
              { short: "TCG", long: "Trading Card Game", color: "text-blue-400 border-blue-500/20 bg-blue-500/10", desc: "A genre of games involving collecting and battling with custom decks." },
              { short: "DSL", long: "Domain-Specific Language", color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/10", desc: "A specialized code syntax used to define complex card behaviors." },
              { short: "FAQ", long: "Frequently Asked Questions", color: "text-amber-400 border-amber-500/20 bg-amber-500/10", desc: "Our knowledge base for mastering game mechanics and rules." }
            ].map(item => (
              <div key={item.short} className={`px-6 py-5 border rounded-[2.5rem] flex flex-col items-center max-w-[210px] ${item.color} backdrop-blur-xl transition-all hover:scale-105 hover:bg-slate-900/40 shadow-2xl border-white/5`}>
                <span className="text-2xl font-black tracking-widest mb-1">{item.short}</span>
                <span className="text-[10px] font-bold opacity-60 uppercase mb-3 tracking-tighter">{item.long}</span>
                <p className="text-[10px] text-slate-400 leading-tight font-medium whitespace-normal break-words overflow-wrap-anywhere">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-14 text-left relative z-20">
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-md transition-all hover:bg-slate-900/70 hover:border-blue-500/30 shadow-xl">
            <h3 className="text-blue-400 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-500/20 rounded flex items-center justify-center text-[10px]">1</span>
              Architecting
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-normal break-words overflow-wrap-anywhere">
              Start in the <strong className="text-blue-400">Ruleset Lab</strong> to toggle core mechanics. Then, use the <strong className="text-blue-400">Card Lab</strong> to draft card stats and unique logic using our logic **DSL**.
            </p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-md transition-all hover:bg-slate-900/70 hover:border-indigo-500/30 shadow-xl">
            <h3 className="text-indigo-400 font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
              <span className="w-5 h-5 bg-indigo-500/20 rounded flex items-center justify-center text-[10px]">2</span>
              Prototyping
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-medium whitespace-normal break-words overflow-wrap-anywhere">
              Build your first strategy in the <strong className="text-indigo-400">Deck Builder</strong>. Launch the <strong className="text-indigo-400">Sandbox</strong> to playtest rules and combat logic against an active opponent.
            </p>
          </div>
        </div>

        <Button 
          onClick={onStart} 
          className="px-20 py-7 text-2xl rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_20px_80px_rgba(59,130,246,0.5)] transform hover:scale-105 active:scale-95 transition-all font-black tracking-tighter uppercase relative z-20"
        >
          Begin Lab Session
        </Button>
        
        <p className="mt-12 text-slate-600 text-[10px] font-black uppercase tracking-[0.4em] opacity-50 relative z-20">
          Build 0.5.1 Alpha • Powered by Gemini & Google AI Studio
        </p>
      </div>
    </div>
  );
};

export default LaunchScreen;
