
import React, { useState } from 'react';
import { MechanicDefinition, MechanicCategory } from '../types';
import { CardWrapper, Button, Badge, Input } from '../components/Common';
import { ICONS } from '../constants';

interface MechanicsProps {
  mechanics: MechanicDefinition[];
  setMechanics: (mechanics: MechanicDefinition[]) => void;
}

const Mechanics: React.FC<MechanicsProps> = ({ mechanics, setMechanics }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'Core' | 'Win Conditions' | 'Extensions'>('Core');

  const toggleMechanic = (id: string) => {
    setMechanics(mechanics.map(m => m.id === id ? { ...m, isEnabled: !m.isEnabled } : m));
  };

  const filtered = mechanics.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    if (activeTab === 'Core') {
      return matchesSearch && !['Win Condition', 'Advanced Extension'].includes(m.category);
    }
    if (activeTab === 'Win Conditions') {
      return matchesSearch && m.category === 'Win Condition';
    }
    return matchesSearch && m.category === 'Advanced Extension';
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black mb-2 tracking-tight">Ruleset Lab</h2>
          <p className="text-slate-400 text-lg">Define how your game is won and which advanced subsystems are active.</p>
        </div>
        <div className="flex gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          {(['Core', 'Win Conditions', 'Extensions'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <CardWrapper className="bg-slate-900/40 p-4 border-slate-800 flex items-center gap-6">
        <div className="flex-1">
          <Input 
            placeholder={`Search ${activeTab.toLowerCase()}...`} 
            value={search} 
            onChange={setSearch} 
          />
        </div>
        <div className="text-[10px] font-bold text-slate-500 uppercase flex gap-4">
           <span>Total: {filtered.length}</span>
           <span className="text-blue-400">Enabled: {filtered.filter(f => f.isEnabled).length}</span>
        </div>
      </CardWrapper>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filtered.map(m => (
          <CardWrapper key={m.id} className={`flex flex-col h-full border-t-8 transition-all duration-300 ${m.isEnabled ? 'border-t-blue-500 bg-blue-500/5' : 'border-t-slate-800'}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <Badge color="bg-slate-950/80 text-slate-500 mb-2 border border-slate-800">{m.category}</Badge>
                <h3 className="text-2xl font-bold tracking-tight leading-tight">{m.name}</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={m.isEnabled} onChange={() => toggleMechanic(m.id)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <p className="text-slate-400 text-sm flex-1 mb-8 leading-relaxed">
              {m.description}
            </p>

            <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800/50">
               <div className="flex items-center justify-between mb-4">
                 <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Logic Hook</h4>
                 <div className="flex gap-1">
                   {m.triggers.map(t => <span key={t} className="text-[8px] font-mono bg-blue-900/30 text-blue-400 px-1.5 py-0.5 rounded">@{t}</span>)}
                 </div>
               </div>
               
               <div className="space-y-3 mb-6">
                 {Object.entries(m.parameters).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between group">
                      <span className="text-[11px] font-mono text-slate-500">{key}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg text-blue-400">
                          {JSON.stringify(val)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {Object.keys(m.parameters).length === 0 && <p className="text-[10px] italic text-slate-700">Static implementation.</p>}
               </div>

               <div className="pt-4 border-t border-slate-800/50">
                 <p className="text-[10px] font-bold text-slate-600 uppercase mb-2">DSL Syntax</p>
                 <code className="text-[10px] font-mono text-blue-300 block bg-slate-900 p-2 rounded border border-blue-500/10 truncate">
                   {m.dslExample}
                 </code>
               </div>
            </div>
          </CardWrapper>
        ))}
      </div>
    </div>
  );
};

export default Mechanics;
