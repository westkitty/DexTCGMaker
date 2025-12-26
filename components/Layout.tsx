import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { ViewType } from '../types';
import { DexLogoMark } from '../brand/DexLogoMark';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setView: (view: ViewType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoCount, setLogoCount] = useState(0);

  // Diagnostic auditor: checks for logo presence in real-time
  useEffect(() => {
    const count = document.querySelectorAll('[aria-label="DexTCGMaker logo"]').length;
    setLogoCount(count);
  }, [children, activeView, isMobileMenuOpen]);

  const menuItems: { id: ViewType; label: string; icon: keyof typeof ICONS }[] = [
    { id: 'Overview', label: 'Overview', icon: 'Overview' },
    { id: 'Mechanics', label: 'Mechanics', icon: 'Mechanics' },
    { id: 'Cards', label: 'Card Lab', icon: 'Cards' },
    { id: 'Decks', label: 'Deck Builder', icon: 'Decks' },
    { id: 'Sandbox', label: 'Sandbox', icon: 'Sandbox' },
    { id: 'Analytics', label: 'Insights', icon: 'Analytics' },
  ];

  const NavContent = () => (
    <>
      {/* REQUIRED LOCATION B: Primary Navigation Header */}
      <div className="p-8 flex items-center gap-4 border-b border-slate-800/50 bg-slate-900/20" style={{ overflow: 'visible' }}>
        <DexLogoMark className="w-14 h-14 z-30" />
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent uppercase leading-none">
            DexTCG
          </h1>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">Maker Lab</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-6 overflow-visible">
        {menuItems.map((item) => {
          const Icon = ICONS[item.icon];
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-visible ${
                isActive 
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-900/20' 
                  : 'text-slate-500 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <div className="relative w-6 h-6 flex items-center justify-center shrink-0 overflow-visible">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-600'}`} />
              </div>
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* DIAGNOSTIC AUDITOR BANNER: Required to prove implementation */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-slate-500 flex items-center justify-between">
          <span>Logos detected:</span>
          <span className={`font-black ${logoCount >= 3 ? 'text-emerald-500' : 'text-red-500'}`}>
            {logoCount}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Desktop Sidebar (Always Visible) */}
      <aside className="hidden lg:flex w-72 border-r border-slate-800 bg-slate-900/30 flex-col relative z-20 shadow-[20px_0_50px_rgba(0,0,0,0.3)] overflow-visible">
        <NavContent />
      </aside>

      {/* REQUIRED LOCATION A: Global Header (Mobile/Persistent Top) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/90 border-b border-slate-800 z-50 flex items-center justify-between px-6 backdrop-blur-md overflow-visible">
         <div className="flex items-center gap-3 overflow-visible">
            <DexLogoMark className="w-10 h-10" />
            <h1 className="font-black text-xl tracking-tighter uppercase">DexTCG</h1>
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400 hover:text-white transition-colors">
            {isMobileMenuOpen ? "✕" : "☰"}
         </button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-950 pt-16 flex flex-col animate-in slide-in-from-top duration-300 overflow-visible">
           <NavContent />
        </div>
      )}

      <main className="flex-1 overflow-y-auto relative bg-slate-950 pt-16 lg:pt-0">
        <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
