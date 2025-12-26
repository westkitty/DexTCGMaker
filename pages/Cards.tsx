
import React, { useState } from 'react';
import { Card, CardType, Rarity } from '../types';
import { Button, Input, CardWrapper } from '../components/Common';
import CardVisualizer from '../components/CardVisualizer';
import { ICONS } from '../constants';

interface CardsProps {
  cards: Card[];
  setCards: (cards: Card[]) => void;
}

const DSL_SNIPPETS = [
  { label: 'Battlecry: Damage', code: 'OnPlay: Deal 2 damage to an enemy.' },
  { label: 'Keyword: Taunt', code: 'Keyword: Taunt' },
  { label: 'Keyword: Rush', code: 'Keyword: Rush' },
  { label: 'Deathrattle: Draw', code: 'OnDeath: Draw 1 card.' },
  { label: 'Lifesteal', code: 'Keyword: Lifesteal' },
];

const Cards: React.FC<CardsProps> = ({ cards, setCards }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const emptyCard: Card = {
    id: `c-${Date.now()}`,
    name: 'New Card',
    cost: 1,
    atk: 1,
    hp: 1,
    type: CardType.UNIT,
    rarity: Rarity.COMMON,
    dsl: '',
    tags: [],
    notes: '',
    favorite: false,
    version: 1,
    history: []
  };

  const [form, setForm] = useState<Card>(emptyCard);

  const handleCreate = () => {
    const fresh = { ...emptyCard, id: `c-${Date.now()}` };
    setEditingId(fresh.id);
    setForm(fresh);
  };

  const handleEdit = (card: Card) => {
    setEditingId(card.id);
    setForm(card);
  };

  const handleSave = () => {
    const exists = cards.find(c => c.id === form.id);
    const historyEntry = { date: Date.now(), change: exists ? 'Modified parameters' : 'Created card' };
    const newForm = { ...form, version: exists ? form.version + 1 : 1, history: [...form.history, historyEntry] };
    
    if (exists) {
      setCards(cards.map(c => c.id === form.id ? newForm : c));
    } else {
      setCards([...cards, newForm]);
    }
    setEditingId(null);
  };

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(cards, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dextcgm_collection.json';
    a.click();
  };

  const importAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target?.result as string);
          if (Array.isArray(imported)) setCards(imported);
        } catch (err) {
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredCards = cards.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-1">Card Lab</h2>
          <p className="text-slate-400">Design mechanics and visuals for your collection.</p>
        </div>
        <div className="flex gap-2">
          <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-all text-sm border border-slate-700">
            Import JSON
            <input type="file" className="hidden" onChange={importAll} accept=".json" />
          </label>
          <Button onClick={exportAll} variant="secondary">Export Library</Button>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <ICONS.Plus /> New Card
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <Input 
          className="flex-1"
          placeholder="Search cards..."
          value={search}
          onChange={setSearch}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCards.map(card => (
          <div key={card.id} className="group relative">
            <CardVisualizer card={card} />
            <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 transition-opacity duration-200 rounded-2xl">
              <span className="text-xs text-slate-500 mb-2">v{card.version}.0 • {card.history.length} Edits</span>
              <div className="flex gap-2">
                <Button onClick={() => handleEdit(card)} variant="secondary">Edit</Button>
                <Button onClick={() => setCards(cards.filter(c => c.id !== card.id))} variant="danger">Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-8 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
            <div className="flex-1 p-8 overflow-y-auto space-y-6 border-r border-slate-700">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold">Edit Card</h3>
                <span className="text-[10px] font-mono bg-slate-800 px-2 py-1 rounded text-slate-400">ID: {form.id}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Name" value={form.name} onChange={(v) => setForm({...form, name: v})} />
                <Input label="Cost" type="number" value={form.cost} onChange={(v) => setForm({...form, cost: parseInt(v)})} />
                
                <div className="flex flex-col gap-1.5">
                   <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</label>
                   <select 
                    value={form.type} 
                    onChange={(e) => setForm({...form, type: e.target.value as CardType})}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    {Object.values(CardType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                   <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rarity</label>
                   <select 
                    value={form.rarity} 
                    onChange={(e) => setForm({...form, rarity: e.target.value as Rarity})}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    {Object.values(Rarity).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {form.type === CardType.UNIT && (
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Attack" type="number" value={form.atk || 0} onChange={(v) => setForm({...form, atk: parseInt(v)})} />
                  <Input label="Health" type="number" value={form.hp || 1} onChange={(v) => setForm({...form, hp: parseInt(v)})} />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">DSL Rules</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {DSL_SNIPPETS.map(snip => (
                    <button 
                      key={snip.label}
                      onClick={() => setForm({...form, dsl: form.dsl + (form.dsl ? '\n' : '') + snip.code})}
                      className="text-[10px] bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-2 py-1 rounded transition-colors"
                    >
                      + {snip.label}
                    </button>
                  ))}
                </div>
                <textarea 
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono text-sm h-32 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  value={form.dsl}
                  onChange={(e) => setForm({...form, dsl: e.target.value})}
                  placeholder="OnPlay: Deal 1 damage..."
                />
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
                <Button onClick={handleSave}>Save Changes</Button>
                <Button onClick={() => setEditingId(null)} variant="ghost">Cancel</Button>
              </div>
            </div>

            <div className="w-full md:w-[350px] bg-slate-950 flex flex-col items-center justify-center p-8 gap-8">
              <div className="flex flex-col items-center gap-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Live Preview</p>
                <CardVisualizer card={form} scale={1.1} />
              </div>
              
              <div className="w-full space-y-2">
                 <p className="text-[10px] font-bold text-slate-600 uppercase">Version Timeline</p>
                 <div className="max-h-32 overflow-y-auto space-y-1 pr-2">
                   {form.history.slice().reverse().map((h, i) => (
                     <div key={i} className="text-[9px] text-slate-500 border-l border-slate-800 pl-2">
                       {new Date(h.date).toLocaleDateString()} - {h.change}
                     </div>
                   ))}
                   {form.history.length === 0 && <p className="text-[9px] italic text-slate-600">No history available.</p>}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
