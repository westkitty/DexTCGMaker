
import React, { useState, useMemo } from 'react';
import { Card, Deck, Rarity } from '../types';
import { Button, Input, CardWrapper, Badge } from '../components/Common';
import { ICONS } from '../constants';
import CardVisualizer from '../components/CardVisualizer';

interface DecksProps {
  decks: Deck[];
  setDecks: (decks: Deck[]) => void;
  cards: Card[];
}

const Decks: React.FC<DecksProps> = ({ decks, setDecks, cards }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterRarity, setFilterRarity] = useState<string>('all');

  const emptyDeck: Deck = {
    id: `d-${Date.now()}`,
    name: 'Unlabeled Strategy',
    cardIds: [],
    constraints: { maxSize: 60, minSize: 30, maxCopies: 3 },
    tags: []
  };

  const [form, setForm] = useState<Deck>(emptyDeck);

  const handleCreate = () => {
    const fresh = { ...emptyDeck, id: `d-${Date.now()}` };
    setEditingId(fresh.id);
    setForm(fresh);
  };

  const handleEdit = (deck: Deck) => {
    setEditingId(deck.id);
    setForm(deck);
  };

  const handleSave = () => {
    const exists = decks.find(d => d.id === form.id);
    if (exists) {
      setDecks(decks.map(d => d.id === form.id ? form : d));
    } else {
      setDecks([...decks, form]);
    }
    setEditingId(null);
  };

  const hints = useMemo(() => {
    const deckCards = form.cardIds.map(id => cards.find(c => c.id === id)).filter(Boolean) as Card[];
    const lowCost = deckCards.filter(c => c.cost <= 2).length;
    const legendaries = deckCards.filter(c => c.rarity === Rarity.LEGENDARY).length;
    const units = deckCards.filter(c => c.type === 'Unit').length;
    
    const issues = [];
    if (deckCards.length > 0 && deckCards.length < form.constraints.minSize) {
      issues.push({ text: `Under minimum size (${deckCards.length}/${form.constraints.minSize})`, type: 'error' });
    }
    if (lowCost < deckCards.length / 4 && deckCards.length > 10) {
      issues.push({ text: "Vulnerable to Aggro: Low count of 1-2 cost cards", type: 'warn' });
    }
    if (units < deckCards.length / 2 && deckCards.length > 10) {
      issues.push({ text: "Strategy Risk: Low unit count (less than 50%)", type: 'warn' });
    }
    if (legendaries > 3) {
      issues.push({ text: "Rule Conflict: Too many unique Legendaries", type: 'warn' });
    }
    
    return issues;
  }, [form.cardIds, cards, form.constraints.minSize]);

  const addCard = (cardId: string) => {
    const count = form.cardIds.filter(id => id === cardId).length;
    if (count < form.constraints.maxCopies && form.cardIds.length < form.constraints.maxSize) {
      setForm({ ...form, cardIds: [...form.cardIds, cardId] });
    }
  };

  const removeCard = (cardId: string) => {
    const idx = form.cardIds.indexOf(cardId);
    if (idx > -1) {
      const newIds = [...form.cardIds];
      newIds.splice(idx, 1);
      setForm({ ...form, cardIds: newIds });
    }
  };

  const filteredCards = cards.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesRarity = filterRarity === 'all' || c.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  });

  const cardCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    form.cardIds.forEach(id => {
      counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }, [form.cardIds]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black mb-1 tracking-tighter">Deck Strategy Lab</h2>
          <p className="text-slate-400 text-lg">Validate synergy, curves, and rule compliance.</p>
        </div>
        {!editingId && (
          <Button onClick={handleCreate} className="flex items-center gap-3 px-6 h-12 rounded-xl">
            <ICONS.Plus className="w-5 h-5" /> Create New Design
          </Button>
        )}
      </div>

      {!editingId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {decks.map(deck => (
            <CardWrapper key={deck.id} className="hover:border-blue-500/50 transition-all cursor-pointer group bg-slate-900/40 p-0 overflow-hidden flex flex-col h-full border-slate-800">
              <div className="p-6 flex-1">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight">{deck.name}</h3>
                      <div className="flex gap-2 mt-2">
                         <Badge color="bg-blue-600/20 text-blue-400">{deck.cardIds.length} Cards</Badge>
                         <Badge color="bg-slate-800 text-slate-500">{deck.cardIds.length >= deck.constraints.minSize ? 'VALID' : 'DRAFT'}</Badge>
                      </div>
                    </div>
                 </div>
                 <div className="flex gap-1 h-12 items-end mb-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="flex-1 bg-slate-800 rounded-t-sm" style={{ height: `${Math.random() * 100}%` }} />
                    ))}
                 </div>
              </div>
              <div className="p-4 bg-slate-950/50 flex gap-2 border-t border-slate-800">
                <Button onClick={() => handleEdit(deck)} variant="secondary" className="flex-1 rounded-xl">Edit Project</Button>
                <button onClick={() => setDecks(decks.filter(d => d.id !== deck.id))} className="w-12 h-10 flex items-center justify-center bg-red-950/30 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><ICONS.Trash /></button>
              </div>
            </CardWrapper>
          ))}
          {decks.length === 0 && (
            <div className="col-span-full py-24 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center text-slate-600">
               <ICONS.Decks className="w-16 h-16 mb-4 opacity-10" />
               <p className="font-bold uppercase tracking-[0.3em]">No Deck Projects</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-right-4">
          {/* Builder Sidebar */}
          <div className="w-full lg:w-96 flex flex-col gap-6">
            <CardWrapper className="bg-slate-900/60 border-slate-800">
              <h3 className="font-black text-xs text-slate-500 uppercase tracking-widest mb-4">Validator AI</h3>
              <div className="space-y-3">
                {hints.map((h, i) => (
                  <div key={i} className={`p-4 rounded-xl border-l-4 text-xs font-bold leading-relaxed ${h.type === 'warn' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 border-l-amber-500' : 'bg-red-500/10 border-red-500/20 text-red-500 border-l-red-500'}`}>
                    {h.text}
                  </div>
                ))}
                {hints.length === 0 && form.cardIds.length > 0 && <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">Rule engine reports no balance conflicts.</div>}
              </div>
            </CardWrapper>

            <CardWrapper className="flex-1 flex flex-col overflow-hidden bg-slate-900/80 border-slate-700 shadow-2xl">
               <Input label="Project Name" value={form.name} onChange={v => setForm({ ...form, name: v })} className="mb-6" />
               
               <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-black text-slate-500 uppercase">Composition</span>
                 <span className="text-[10px] font-mono text-blue-400 font-bold">{form.cardIds.length} / {form.constraints.maxSize}</span>
               </div>
               
               <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                 {Object.entries(cardCounts).map(([id, count]) => {
                    const card = cards.find(c => c.id === id);
                    return (
                      <div key={id} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 group">
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-slate-200 truncate max-w-[140px]">{card?.name}</span>
                           <span className="text-[8px] font-mono text-slate-600 uppercase">Cost {card?.cost}</span>
                        </div>
                        <div className="flex items-center gap-3">
                           <span className="font-black text-blue-400 text-lg">x{count}</span>
                           <div className="flex gap-1">
                              <button onClick={() => addCard(id)} className="w-6 h-6 flex items-center justify-center bg-slate-800 rounded-md hover:bg-blue-600 text-[10px] transition-colors">+</button>
                              <button onClick={() => removeCard(id)} className="w-6 h-6 flex items-center justify-center bg-slate-800 rounded-md hover:bg-red-600 text-[10px] transition-colors">-</button>
                           </div>
                        </div>
                      </div>
                    )
                 })}
                 {form.cardIds.length === 0 && (
                    <div className="h-40 flex items-center justify-center text-slate-700 text-xs italic font-bold uppercase tracking-widest text-center">
                       Draft your strategy<br/>by adding cards
                    </div>
                 )}
               </div>
               
               <div className="pt-6 mt-4 border-t border-slate-700 flex gap-3">
                <Button onClick={handleSave} className="flex-1 h-12 rounded-xl">Commit Build</Button>
                <Button onClick={() => setEditingId(null)} variant="ghost" className="h-12 rounded-xl">Cancel</Button>
              </div>
            </CardWrapper>
          </div>

          {/* Card Selection Grid */}
          <div className="flex-1 flex flex-col gap-6">
            <CardWrapper className="bg-slate-900/40 p-4 border-slate-800 flex flex-wrap gap-4 items-center">
               <div className="flex-1 min-w-[200px]">
                  <Input placeholder="Search card titles..." value={search} onChange={setSearch} />
               </div>
               <select 
                 value={filterRarity} 
                 onChange={e => setFilterRarity(e.target.value)}
                 className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-400"
               >
                 <option value="all">All Rarities</option>
                 {Object.values(Rarity).map(r => <option key={r} value={r}>{r}</option>)}
               </select>
            </CardWrapper>
            
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto max-h-[70vh] pr-4 custom-scrollbar">
              {filteredCards.map(card => {
                const count = cardCounts[card.id] || 0;
                const limitReached = count >= form.constraints.maxCopies;
                return (
                  <div 
                    key={card.id} 
                    className={`relative group transition-all ${limitReached ? 'opacity-50 grayscale' : 'hover:-translate-y-2'}`}
                  >
                    <CardVisualizer card={card} />
                    <div 
                      onClick={() => !limitReached && addCard(card.id)}
                      className={`absolute inset-0 bg-blue-600/30 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all rounded-2xl border-4 border-blue-500/50 cursor-pointer ${limitReached ? 'hidden' : ''}`}
                    >
                       <div className="bg-slate-950 p-4 rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-300">
                          <ICONS.Plus className="w-8 h-8 text-blue-400" />
                       </div>
                       <span className="mt-4 font-black uppercase text-sm tracking-widest text-white drop-shadow-lg">Inject to Deck</span>
                    </div>
                    {count > 0 && (
                      <div className="absolute -top-3 -right-3 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-xl border-4 border-slate-950 shadow-2xl z-20">
                        {count}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Decks;
