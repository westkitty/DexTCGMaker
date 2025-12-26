
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setView: (view: ViewType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const MASCOT_URL = "https://raw.githubusercontent.com/google/generative-ai-docs/main/site/en/docs/static/dog_with_cards.png";

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
      <div className="p-8 flex items-center gap-4">
        <div className="relative group shrink-0">
          <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full group-hover:bg-blue-500/50 transition-all duration-700"></div>
          <img 
            src={MASCOT_URL} 
            alt="Dex Mascot" 
            className="w-12 h-12 object-contain relative z-10 drop-shadow-2xl transition-transform group-hover:scale-110"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tighter bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent uppercase">
            DexTCG
          </h1>
          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Maker Lab</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 mt-4">
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
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-900/10' 
                  : 'text-slate-500 hover:text-slate-100 hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`${isActive ? 'text-blue-400 scale-110' : 'text-slate-600 group-hover:text-slate-300'} transition-all`} />
              <span className="text-sm font-bold tracking-tight">{item.label}</span>
              
              {/* Added Mascot Logo to active tab */}
              {isActive && (
                <div className="ml-auto relative w-6 h-6 flex items-center justify-center">
                  <img src={MASCOT_URL} className="w-5 h-5 object-contain animate-in fade-in zoom-in-50 duration-500" alt="" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
           <img src={MASCOT_URL} className="w-6 h-6 opacity-30 grayscale" alt="" />
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-600 uppercase">System Integrity</span>
              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                v0.5.1 Online
              </span>
           </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-slate-800 bg-slate-900/30 flex-col relative z-20">
        <NavContent />
      </aside>

      {/* Mobile Nav Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/90 border-b border-slate-800 z-50 flex items-center justify-between px-6 backdrop-blur-md">
         <div className="flex items-center gap-3">
            <img src={MASCOT_URL} alt="Logo" className="w-8 h-8" />
            <h1 className="font-black text-lg tracking-tighter uppercase">DexTCG</h1>
         </div>
         <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400 hover:text-white transition-colors">
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            )}
         </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-950 pt-16 flex flex-col animate-in slide-in-from-top duration-300">
           <NavContent />
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900/40 via-slate-950 to-slate-950 pt-16 lg:pt-0 scroll-smooth">
        <div className="max-w-7xl mx-auto p-6 md:p-10 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
