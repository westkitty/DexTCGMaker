import React from 'react';
import { Card, CardType, Rarity } from '../types';

const CardVisualizer: React.FC<{ card: Card; scale?: number }> = ({ card, scale = 1 }) => {
  const MASCOT_URL = "https://raw.githubusercontent.com/google/generative-ai-docs/main/site/en/docs/static/dog_with_cards.png";

  const rarityStyles = {
    [Rarity.COMMON]: 'border-slate-700 text-slate-300 bg-slate-900 shadow-2xl',
    [Rarity.UNCOMMON]: 'border-emerald-900/50 text-emerald-300 bg-slate-900 shadow-emerald-900/10 shadow-2xl',
    [Rarity.RARE]: 'border-blue-900/50 text-blue-300 bg-slate-900 shadow-blue-900/10 shadow-2xl',
    [Rarity.EPIC]: 'border-purple-900/50 text-purple-300 bg-slate-900 shadow-purple-900/10 shadow-2xl',
    [Rarity.LEGENDARY]: 'border-amber-500/40 text-amber-200 bg-slate-950 shadow-[0_0_50px_-10px_rgba(251,191,36,0.3)]',
  };

  return (
    <div 
      style={{ transform: `scale(${scale})` }}
      className={`w-full aspect-[2/3] max-w-[280px] border-[6px] rounded-[3rem] flex flex-col p-5 relative overflow-hidden group transition-all duration-500 select-none ${rarityStyles[card.rarity]}`}
    >
      {/* Texture Layer */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* Header */}
      <div className="flex justify-between items-start mb-3 z-10 relative">
        <h3 className="font-black text-sm uppercase tracking-tighter leading-tight line-clamp-2 pr-10">{card.name}</h3>
        <div className="absolute top-0 right-0 w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center border-2 border-current font-black text-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
          {card.cost}
        </div>
      </div>

      {/* Art Area */}
      <div className="aspect-[4/3] bg-slate-800 rounded-[2rem] mb-4 flex items-center justify-center relative overflow-hidden shadow-inner border border-white/5 group-hover:border-white/10 transition-colors">
        <img 
          src={`https://picsum.photos/seed/${card.id}/400/300`} 
          alt={card.name} 
          className="object-cover w-full h-full opacity-60 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-90 grayscale group-hover:grayscale-0" 
        />
        <div className="absolute top-3 left-3 bg-slate-950/90 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-800 backdrop-blur-md shadow-lg">
          {card.type}
        </div>
        {/* Mascot Branding Watermark */}
        <img 
          src={MASCOT_URL} 
          className="absolute bottom-3 right-3 w-8 h-8 opacity-20 group-hover:opacity-40 pointer-events-none transition-opacity duration-700 invert" 
          alt="" 
        />
      </div>

      {/* Text/Rules Area - Advanced Anti-Truncation */}
      <div className="bg-slate-950/60 p-4 rounded-[1.5rem] flex-1 border border-white/5 z-10 flex flex-col overflow-hidden backdrop-blur-sm group-hover:bg-slate-950/80 transition-colors">
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
          <p className="text-[11px] leading-relaxed font-bold italic text-slate-300 break-words whitespace-pre-wrap">
            {card.dsl || "No specialized rules detected for this design."}
          </p>
        </div>
      </div>

      {/* Stats Footer */}
      {card.type === CardType.UNIT && (
        <div className="flex justify-between mt-4 px-3 z-10">
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">ATK</span>
            <div className="flex items-center gap-1.5 text-amber-400 font-black text-3xl drop-shadow-[0_4px_10px_rgba(251,191,36,0.3)] group-hover:scale-110 transition-transform">
              {card.atk}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">HP</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-black text-3xl drop-shadow-[0_4px_10px_rgba(52,211,153,0.3)] group-hover:scale-110 transition-transform">
              {card.hp}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardVisualizer;