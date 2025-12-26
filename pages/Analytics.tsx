
import React, { useState } from 'react';
import { Card, CardType, Rarity, Deck } from '../types';
import { CardWrapper, Button } from '../components/Common';

interface AnalyticsProps {
  cards: Card[];
  decks: Deck[];
}

const Analytics: React.FC<AnalyticsProps> = ({ cards, decks }) => {
  const [compareA, setCompareA] = useState<string | null>(null);
  const [compareB, setCompareB] = useState<string | null>(null);

  // General Stats
  const manaCurve = new Array(11).fill(0);
  cards.forEach(c => {
    const cost = Math.min(10, c.cost);
    manaCurve[cost]++;
  });
  const maxMana = Math.max(...manaCurve, 1);

  const getDeckStats = (deckId: string) => {
    const deck = decks.find(d => d.id === deckId);
    if (!deck) return null;
    const deckCards = deck.cardIds.map(id => cards.find(c => c.id === id)).filter(Boolean) as Card[];
    const avgCost = deckCards.reduce((acc, c) => acc + c.cost, 0) / (deckCards.length || 1);
    const avgAtk = deckCards.reduce((acc, c) => acc + (c.atk || 0), 0) / (deckCards.length || 1);
    const avgHp = deckCards.reduce((acc, c) => acc + (c.hp || 0), 0) / (deckCards.length || 1);
    return { avgCost, avgAtk, avgHp, count: deckCards.length };
  };

  const statsA = compareA ? getDeckStats(compareA) : null;
  const statsB = compareB ? getDeckStats(compareB) : null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold mb-1">Analytics Dashboard</h2>
        <p className="text-slate-400">Quantitative insights for balancing your collection and decks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CardWrapper>
          <h3 className="text-lg font-bold mb-8">Global Mana Curve</h3>
          <div className="flex items-end gap-2 h-40 px-4">
            {manaCurve.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div style={{ height: `${(count / maxMana) * 100}%` }} className="w-full bg-blue-600 rounded-t-sm min-h-[2px]" />
                <span className="text-[9px] font-bold text-slate-500">{i}</span>
              </div>
            ))}
          </div>
        </CardWrapper>

        <CardWrapper>
          <h3 className="text-lg font-bold mb-6">Deck Comparison Tool</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <select 
              value={compareA || ''} 
              onChange={e => setCompareA(e.target.value)}
              className="bg-slate-900 border border-slate-700 p-2 rounded text-xs"
            >
              <option value="">Select Deck A</option>
              {decks.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <select 
              value={compareB || ''} 
              onChange={e => setCompareB(e.target.value)}
              className="bg-slate-900 border border-slate-700 p-2 rounded text-xs"
            >
              <option value="">Select Deck B</option>
              {decks.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div className="space-y-4">
             {[
               { label: 'Avg Cost', key: 'avgCost' },
               { label: 'Avg Attack', key: 'avgAtk' },
               { label: 'Avg Health', key: 'avgHp' }
             ].map(stat => (
               <div key={stat.label} className="flex items-center gap-4">
                 <span className="text-[10px] font-bold text-slate-500 uppercase w-20">{stat.label}</span>
                 <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 bg-slate-950 h-6 rounded flex items-center px-3 relative overflow-hidden">
                       <div style={{ width: `${((statsA?.[stat.key as keyof typeof statsA] || 0) / 10) * 100}%` }} className="absolute left-0 top-0 h-full bg-blue-500/30" />
                       <span className="text-[10px] font-mono z-10">{statsA?.[stat.key as keyof typeof statsA]?.toFixed(1) || '0.0'}</span>
                    </div>
                    <div className="flex-1 bg-slate-950 h-6 rounded flex items-center px-3 relative overflow-hidden text-right justify-end">
                       <div style={{ width: `${((statsB?.[stat.key as keyof typeof statsB] || 0) / 10) * 100}%` }} className="absolute right-0 top-0 h-full bg-purple-500/30" />
                       <span className="text-[10px] font-mono z-10">{statsB?.[stat.key as keyof typeof statsB]?.toFixed(1) || '0.0'}</span>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        </CardWrapper>
      </div>
    </div>
  );
};

export default Analytics;
