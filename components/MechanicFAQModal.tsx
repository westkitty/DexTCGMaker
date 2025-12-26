
import React, { useState } from 'react';
import { MECHANIC_LIBRARY } from '../mechanics/registry';
import { CardWrapper, Badge, DexLogoMark } from './Common';
import { ICONS } from '../constants';

interface MechanicFAQModalProps {
  onClose: () => void;
}

const MechanicFAQModal: React.FC<MechanicFAQModalProps> = ({ onClose }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');

  const filtered = MECHANIC_LIBRARY.filter(m => 
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase())) &&
    (activeTab === 'all' || m.category.toLowerCase() === activeTab.toLowerCase())
  );

  const categories = ['all', ...Array.from(new Set(MECHANIC_LIBRARY.map(m => m.category.toLowerCase())))];

  const copyDSL = (dsl: string) => {
    navigator.clipboard.writeText(dsl);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/98 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 overflow-hidden animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-7xl h-full rounded-[3rem] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
        {/* Branding Watermark */}
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] opacity-[0.02] pointer-events-none grayscale invert">
          {/* Fix: changed 'size' to 'className' to match DexLogoMark prop definition */}
          <DexLogoMark className="w-full h-full" />
        </div>

        {/* Header */}
        <div className="p-10 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-6">
            {/* Fix: changed 'size' to 'className' to match DexLogoMark prop definition */}
            <DexLogoMark className="w-16 h-16" />
            <div>
              <h2 className="text-4xl font-black flex items-center gap-4 tracking-tighter uppercase">
                Rules Library
              </h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">Advanced Knowledge Base & DSL Reference</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-800 rounded-[2rem] text-slate-400 hover:text-white transition-all active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-10 py-6 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center gap-6 relative z-10">
          <div className="relative flex-1 min-w-[300px]">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <ICONS.Search className="w-5 h-5" />
            </span>
            <input 
              type="text" 
              placeholder="Search game mechanics, logic hooks, or FAQ entries..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-[1.5rem] pl-12 pr-6 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'bg-slate-800 text-slate-500 hover:text-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 custom-scrollbar">
          {filtered.map(mech => (
            <CardWrapper key={mech.id} className="flex flex-col border-slate-800 hover:border-blue-500/30 transition-all group h-fit min-h-[300px]">
              <div className="flex items-start justify-between mb-4">
                <Badge color="bg-slate-950/80 border border-slate-800 text-slate-500 font-black">{mech.category}</Badge>
                <div className="flex gap-1.5">
                  {mech.triggers.map(t => <span key={t} className="text-[9px] text-blue-500 font-black uppercase tracking-tighter">@{t}</span>)}
                </div>
              </div>
              <h3 className="text-2xl font-black mb-3 text-slate-100 group-hover:text-blue-400 transition-colors uppercase tracking-tight leading-none">{mech.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 font-medium whitespace-normal break-words overflow-wrap-anywhere">{mech.description}</p>
              
              <div className="bg-slate-950/80 rounded-[1.5rem] p-5 border border-slate-800 mb-6 flex-1 shadow-inner group-hover:bg-slate-950 transition-colors">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-3">Architect Note</p>
                <p className="text-[11px] text-slate-300 font-medium italic leading-relaxed whitespace-normal break-words overflow-wrap-anywhere">{mech.faq}</p>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">DSL Syntax Reference</p>
                   <button 
                    onClick={() => copyDSL(mech.dslExample)} 
                    className="text-[9px] font-black text-blue-500 hover:text-blue-400 flex items-center gap-2 uppercase tracking-widest group/btn"
                   >
                     <svg className="w-3 h-3 transition-transform group-hover/btn:scale-110" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                     Copy
                   </button>
                </div>
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-blue-300 border border-blue-500/10 shadow-lg break-all overflow-hidden text-ellipsis">
                  {mech.dslExample}
                </div>
              </div>
            </CardWrapper>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-32 text-slate-600">
               <ICONS.Search className="w-20 h-20 mb-6 opacity-10" />
               <p className="font-black uppercase tracking-[0.4em] text-sm">No mechanics found matching search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MechanicFAQModal;
