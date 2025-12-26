import React, { useState, useEffect } from 'react';
import { CardWrapper, Badge, Button, DexLogoMark, DexLogo } from '../components/Common';
import { Card, Deck, Scenario } from '../types';
import { StorageService } from '../services/storage';
import { ICONS } from '../constants';

interface OverviewProps {
  cards: Card[];
  decks: Deck[];
  onLoadScenario: (scen: Scenario) => void;
}

const Overview: React.FC<OverviewProps> = ({ cards, decks, onLoadScenario }) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  useEffect(() => {
    setScenarios(StorageService.getScenarios());
  }, []);

  const deleteScenario = (id: string) => {
    const updated = scenarios.filter(s => s.id !== id);
    setScenarios(updated);
    StorageService.saveScenarios(updated);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row items-center gap-8 justify-between bg-slate-900/30 p-8 rounded-[3rem] border border-slate-800/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] pointer-events-none group-hover:bg-blue-600/10 transition-colors"></div>
        
        <div className="flex items-center gap-6 relative z-10">
          <DexLogoMark className="w-24 h-24 animate-bounce duration-[3000ms]" />
          <div>
            <h2 className="text-5xl font-black mb-2 tracking-tighter uppercase italic">Design Overview</h2>
            <p className="text-slate-400 font-medium max-w-lg leading-relaxed">
              Welcome back to the lab. Your collection is ready for further iteration, simulation, and balancing.
            </p>
          </div>
        </div>
        
        <Badge color="bg-blue-600/20 text-blue-400 font-mono px-6 py-2 rounded-2xl text-xs border border-blue-500/20 shadow-xl relative z-10">
          v0.5.1 STABLE BUILD
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardWrapper className="bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/20">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Collection</p>
          <div className="text-5xl font-black mt-2 text-blue-400">{cards.length} <span className="text-xl text-slate-600">Cards</span></div>
        </CardWrapper>
        <CardWrapper className="bg-gradient-to-br from-indigo-600/10 to-transparent border-indigo-500/20">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Saved Strategy Projects</p>
          <div className="text-5xl font-black mt-2 text-indigo-400">{decks.length} <span className="text-xl text-slate-600">Decks</span></div>
        </CardWrapper>
        <CardWrapper className="bg-gradient-to-br from-emerald-600/10 to-transparent border-emerald-500/20">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Sim Snapshots</p>
          <div className="text-5xl font-black mt-2 text-emerald-400">{scenarios.length} <span className="text-xl text-slate-600">States</span></div>
        </CardWrapper>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
           <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tight text-slate-400">
             <span className="p-2 bg-slate-800 rounded-lg"><ICONS.Cards /></span>
             Lab Operating Procedures
           </h3>
           <CardWrapper className="space-y-6 bg-slate-900/40 p-8">
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-500/20">1</div>
                 <div>
                    <h4 className="text-sm font-bold text-slate-200">Refine Ruleset</h4>
                    <p className="text-xs text-slate-400 mt-1">Visit the <strong>Ruleset Lab</strong> to toggle advanced subsystems like Auction Phases or Fog of War.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-500/20">2</div>
                 <div>
                    <h4 className="text-sm font-bold text-slate-200">Iterate on DSL</h4>
                    <p className="text-xs text-slate-400 mt-1">Draft new behaviors in the <strong>Card Lab</strong>. Use the holographic preview to verify visual hierarchy.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-500/20">3</div>
                 <div>
                    <h4 className="text-sm font-bold text-slate-200">Battle Simulation</h4>
                    <p className="text-xs text-slate-400 mt-1">Launch the <strong>Sandbox</strong>. The rule engine dynamically parses your logic during every interaction.</p>
                 </div>
              </div>
           </CardWrapper>
        </div>

        <div className="space-y-6">
           <h3 className="text-xl font-black flex items-center gap-3 uppercase tracking-tight text-slate-400">
             <span className="p-2 bg-slate-800 rounded-lg"><ICONS.Sandbox /></span>
             Scenario Archives
           </h3>
           <div className="space-y-3">
             {scenarios.map(scen => (
               <div key={scen.id} className="p-5 bg-slate-900/60 rounded-3xl border border-slate-800/80 flex items-center justify-between group hover:border-blue-500/30 transition-all shadow-lg">
                  <div className="flex items-center gap-4">
                    <DexLogo className="w-10 h-10 opacity-40 group-hover:opacity-100 transition-opacity" />
                    <div>
                      <p className="font-black text-slate-200">{scen.name}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">Turn {scen.state.turnCount} • {new Date(scen.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => onLoadScenario(scen)} variant="secondary" className="px-5 py-2 text-[10px] rounded-xl">Load</Button>
                    <button onClick={() => deleteScenario(scen.id)} className="p-2 text-slate-600 hover:text-red-500 transition-colors"><ICONS.Trash /></button>
                  </div>
               </div>
             ))}
             {scenarios.length === 0 && (
               <div className="py-20 border-2 border-dashed border-slate-800 rounded-[3rem] flex flex-col items-center justify-center opacity-40">
                  <DexLogo className="w-12 h-12 mb-4" />
                  <p className="text-xs font-black uppercase tracking-[0.3em]">No Simulation Records</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
