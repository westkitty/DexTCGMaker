
import React, { useState, useEffect } from 'react';
import { CardWrapper, Badge, Button } from '../components/Common';
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black mb-2 tracking-tight">Design Overview</h2>
          <p className="text-slate-400">Welcome to DexTCGMaker. Design, simulate, and balance your next TCG hit.</p>
        </div>
        <Badge color="bg-blue-600/20 text-blue-400 font-mono">v1.0.0 STABLE</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CardWrapper className="bg-gradient-to-br from-blue-600/10 to-transparent">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Library Size</p>
          <div className="text-4xl font-black mt-2">{cards.length} Cards</div>
        </CardWrapper>
        <CardWrapper>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Saved Decks</p>
          <div className="text-4xl font-black mt-2">{decks.length} Decks</div>
        </CardWrapper>
        <CardWrapper>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stored Scenarios</p>
          <div className="text-4xl font-black mt-2">{scenarios.length} States</div>
        </CardWrapper>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
           <h3 className="text-xl font-bold flex items-center gap-3">
             <span className="p-2 bg-slate-800 rounded-lg"><ICONS.Cards /></span>
             Lab Manual & Quick Start
           </h3>
           <CardWrapper className="space-y-6 bg-slate-900/40">
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                 <div>
                    <h4 className="text-sm font-bold text-slate-200">Configure Ruleset</h4>
                    <p className="text-xs text-slate-400 mt-1">Visit the <strong>Ruleset Lab</strong> to enable keywords like Rush, Taunt, or Lifesteal. These will be automatically enforced in the Sandbox.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                 <div>
                    <h4 className="text-sm font-bold text-slate-200">Draft Card Logic</h4>
                    <p className="text-xs text-slate-400 mt-1">In the <strong>Card Lab</strong>, use the DSL Snippets to add behavior (e.g., <em>OnPlay: Draw 1 card</em>). Save to update your library.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                 <div>
                    <h4 className="text-sm font-bold text-slate-200">Stress Test</h4>
                    <p className="text-xs text-slate-400 mt-1">Launch the <strong>Sandbox</strong> to play against the Greedy AI. The engine will parse your DSL rules in real-time.</p>
                 </div>
              </div>
           </CardWrapper>
        </div>

        <div className="space-y-6">
           <h3 className="text-xl font-bold flex items-center gap-3">
             <span className="p-2 bg-slate-800 rounded-lg"><ICONS.Sandbox /></span>
             Saved Scenarios
           </h3>
           <div className="space-y-3">
             {scenarios.map(scen => (
               <div key={scen.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between group">
                  <div>
                    <p className="font-bold text-sm">{scen.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Turn {scen.state.turnCount} • {new Date(scen.timestamp).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => onLoadScenario(scen)} variant="secondary" className="px-3 py-1 text-[10px]">Load</Button>
                    <button onClick={() => deleteScenario(scen.id)} className="p-1 text-slate-600 hover:text-red-500 transition-colors"><ICONS.Trash /></button>
                  </div>
               </div>
             ))}
             {scenarios.length === 0 && <p className="text-center py-8 text-xs text-slate-500 italic">No saved scenarios yet.</p>}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
