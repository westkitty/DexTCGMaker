
import React, { useReducer, useState, useMemo, useEffect } from 'react';
import { Card, SimulatorState, GamePhase, BoardInstance, MechanicDefinition } from '../types';
import { createInitialState, gameReducer, calculateWinProbability } from '../services/gameEngine';
import { Button, CardWrapper, Badge } from '../components/Common';
import { ICONS } from '../constants';

interface SandboxProps {
  cards: Card[];
  mechanics: MechanicDefinition[];
}

const Sandbox: React.FC<SandboxProps> = ({ cards, mechanics }) => {
  const p1Deck = cards.map(c => c.id);
  const p2Deck = [...cards].reverse().map(c => c.id);
  
  const [state, dispatch] = useReducer(
    (s: SimulatorState, a: any) => gameReducer(s, a, mechanics, cards), 
    createInitialState(p1Deck, p2Deck, mechanics)
  );
  
  const [selectedAttacker, setSelectedAttacker] = useState<string | null>(null);
  const [pendingPlay, setPendingPlay] = useState<{ index: number; card: Card } | null>(null);

  const turnOwner = state.players[state.turnOwnerIndex];
  const opponent = state.players[(state.turnOwnerIndex + 1) % 2];
  const isP1Turn = state.turnOwnerIndex === 0;
  
  const winProb = useMemo(() => calculateWinProbability(state), [state]);

  const handleUnitClick = (inst: BoardInstance, isPlayerOwn: boolean) => {
    if (state.victoryStatus.winner !== null) return;
    
    if (isPlayerOwn) {
      if (state.phase === GamePhase.COMBAT && !inst.isExhausted && isP1Turn) {
        setSelectedAttacker(selectedAttacker === inst.instanceId ? null : inst.instanceId);
      }
    } else {
      if (selectedAttacker && isP1Turn && state.phase === GamePhase.COMBAT) {
        dispatch({ type: 'ATTACK', payload: { attackerId: selectedAttacker, targetId: inst.instanceId } });
        setSelectedAttacker(null);
      } else if (pendingPlay && isP1Turn) {
        dispatch({ type: 'PLAY_CARD', payload: { ...pendingPlay, targetId: inst.instanceId } });
        setPendingPlay(null);
      }
    }
  };

  const handleFaceClick = (targetPlayerId: string) => {
    if (state.victoryStatus.winner !== null) return;
    
    if (targetPlayerId === opponent.id) {
      if (selectedAttacker && isP1Turn && state.phase === GamePhase.COMBAT) {
        dispatch({ type: 'ATTACK', payload: { attackerId: selectedAttacker, targetId: opponent.id } });
        setSelectedAttacker(null);
      } else if (pendingPlay && isP1Turn) {
        dispatch({ type: 'PLAY_CARD', payload: { ...pendingPlay, targetId: opponent.id } });
        setPendingPlay(null);
      }
    }
  };

  const handlePlayCard = (card: Card, index: number) => {
    const targetingPhrases = ['deal', 'damage', 'buff', 'target', 'gain'];
    const needsTarget = targetingPhrases.some(p => card.dsl.toLowerCase().includes(p));
    
    if (needsTarget) {
      setPendingPlay({ index, card });
      setSelectedAttacker(null);
    } else {
      dispatch({ type: 'PLAY_CARD', payload: { cardIndex: index, card } });
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex-1 bg-slate-950 rounded-3xl border border-slate-800 flex flex-col overflow-hidden relative shadow-2xl">
        {/* Victory Screen */}
        {state.victoryStatus.winner !== null && (
          <div className="absolute inset-0 z-[100] bg-slate-950/98 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-1000">
             <div className="text-9xl mb-6 animate-bounce">👑</div>
             <h2 className="text-6xl font-black text-white mb-2 tracking-tighter">
               {state.players[state.victoryStatus.winner].name} WINS
             </h2>
             <p className="text-2xl text-blue-400 font-bold mb-12 uppercase tracking-[0.2em] opacity-70">
               {state.victoryStatus.reason}
             </p>
             <div className="flex gap-4">
                <Button onClick={() => dispatch({ type: 'RESET' })} variant="primary" className="px-16 py-4 text-xl rounded-2xl">Replay Lab</Button>
                <Button onClick={() => window.location.reload()} variant="ghost" className="px-16 py-4 text-xl rounded-2xl">Exit Sandbox</Button>
             </div>
          </div>
        )}

        {/* Prediction Meter */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-96 bg-slate-900/50 rounded-r-3xl overflow-hidden shadow-2xl border-y border-r border-slate-800 z-10">
           <div 
             style={{ height: `${winProb}%` }} 
             className="w-full bg-gradient-to-t from-blue-700 via-blue-500 to-cyan-400 absolute bottom-0 transition-all duration-1000 shadow-[0_0_20px_rgba(34,211,238,0.5)]" 
           />
           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[8px] font-black text-white/50 -rotate-90 whitespace-nowrap">WIN PROB</span>
           </div>
        </div>

        {/* Global Weather / Status */}
        <div className="absolute top-6 left-12 z-20 flex gap-4 items-center">
           {state.weather && (
             <Badge color="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-2 text-xs">
                🌍 Weather: {state.weather}
             </Badge>
           )}
           <div className="px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Turn {state.turnCount} • {state.phase} Phase
           </div>
        </div>

        {/* Arena Viewport */}
        <div className="flex-1 flex flex-col p-12 gap-12 justify-center items-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/20 to-slate-950 overflow-y-auto relative">
           {/* Opponent Zone */}
           <div className="flex flex-col items-center gap-6 group">
              <div 
                onClick={() => handleFaceClick(opponent.id)}
                className={`w-28 h-28 rounded-3xl border-4 flex flex-col items-center justify-center bg-slate-900 cursor-pointer transition-all duration-500 relative ${pendingPlay || selectedAttacker ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse scale-105' : 'border-slate-800 hover:border-slate-700'}`}
              >
                <div className="absolute -top-3 bg-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">Opponent</div>
                <span className="text-3xl font-black text-red-500 drop-shadow-lg">{opponent.health}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Health</span>
              </div>
              
              <div className="flex gap-6 min-h-[160px] items-center px-8">
                {opponent.board.map(inst => (
                  <div 
                    key={inst.instanceId} 
                    onClick={() => handleUnitClick(inst, false)}
                    className={`w-28 h-40 bg-slate-900/90 rounded-2xl border-2 flex flex-col items-center justify-center p-3 cursor-pointer transition-all duration-300 relative ${pendingPlay || selectedAttacker ? 'border-red-500 ring-8 ring-red-500/10 scale-105 shadow-2xl' : 'border-slate-800 opacity-80'}`}
                  >
                    <div className="text-[10px] font-black text-center text-slate-400 mb-2 line-clamp-2 px-1 leading-tight">{cards.find(c => c.id === inst.cardId)?.name}</div>
                    <div className="flex flex-wrap gap-1 justify-center mb-2">
                      {inst.keywords.map(k => <span key={k} className="text-[7px] uppercase font-black bg-red-900/40 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">{k}</span>)}
                    </div>
                    <div className="mt-auto flex justify-between w-full font-mono text-xs font-black">
                      <span className="text-slate-500">⚔️ {inst.currentAtk}</span>
                      <span className="text-red-400">❤️ {inst.currentHp}</span>
                    </div>
                  </div>
                ))}
                {opponent.board.length === 0 && <div className="w-28 h-40 border-2 border-dashed border-slate-800/30 rounded-2xl flex items-center justify-center text-[10px] text-slate-800 uppercase font-black">Empty Row</div>}
              </div>
           </div>

           <div className="w-full max-w-4xl border-t-2 border-slate-800/20 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-10 text-[11px] font-black text-slate-700 uppercase tracking-[0.3em] border border-slate-800/40 rounded-full py-2 shadow-xl">The Frontline</div>
           </div>

           {/* Player Zone */}
           <div className="flex flex-col items-center gap-6">
              <div className="flex gap-6 min-h-[160px] items-center px-8">
                {turnOwner.board.map(inst => (
                  <div 
                    key={inst.instanceId} 
                    onClick={() => handleUnitClick(inst, true)}
                    className={`w-28 h-40 bg-slate-900 rounded-2xl border-2 flex flex-col items-center justify-center p-3 cursor-pointer transition-all duration-300 relative shadow-xl ${selectedAttacker === inst.instanceId ? 'border-blue-400 scale-115 shadow-[0_0_40px_rgba(59,130,246,0.4)] z-10' : inst.isExhausted ? 'opacity-40 border-slate-800 grayscale scale-95' : 'border-blue-600/30 hover:border-blue-400'}`}
                  >
                    {!inst.isExhausted && isP1Turn && state.phase === GamePhase.COMBAT && <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce border-2 border-slate-950">🔥</div>}
                    <div className="text-[10px] font-black text-center text-blue-200 mb-2 line-clamp-2 px-1 leading-tight">{cards.find(c => c.id === inst.cardId)?.name}</div>
                    <div className="flex flex-wrap gap-1 justify-center mb-2">
                      {inst.keywords.map(k => <span key={k} className="text-[7px] uppercase font-black bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">{k}</span>)}
                    </div>
                    <div className="mt-auto flex justify-between w-full font-mono text-xs font-black">
                      <span className="text-amber-400">⚔️ {inst.currentAtk}</span>
                      <span className="text-emerald-400">❤️ {inst.currentHp}</span>
                    </div>
                  </div>
                ))}
                {turnOwner.board.length === 0 && <div className="w-28 h-40 border-2 border-dashed border-slate-800/30 rounded-2xl flex items-center justify-center text-[10px] text-slate-800 uppercase font-black">Tactical Opening</div>}
              </div>
              
              <div 
                className={`w-28 h-28 rounded-3xl border-4 border-blue-600/40 flex flex-col items-center justify-center bg-slate-900 relative transition-all duration-500 ${isP1Turn ? 'shadow-[0_0_40px_rgba(37,99,235,0.2)] scale-105 border-blue-500' : 'opacity-60 border-slate-800'}`}
              >
                <div className="absolute -bottom-3 bg-blue-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">Designer (P1)</div>
                <span className="text-3xl font-black text-blue-400 drop-shadow-lg">{state.players[0].health}</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Health</span>
              </div>
           </div>
        </div>

        {/* Dynamic Action Bar */}
        <div className="p-8 bg-slate-900/95 border-t border-slate-800/80 backdrop-blur-2xl flex flex-col gap-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Mana Pool</span>
                  <div className="flex gap-1.5">
                    {[...Array(turnOwner.maxMana)].map((_, i) => (
                      <div key={i} className={`w-4 h-4 rounded-md border-2 ${i < turnOwner.mana ? 'bg-blue-600 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800 border-slate-700'}`} />
                    ))}
                    <span className="ml-2 text-sm font-black text-blue-400">{turnOwner.mana}/{turnOwner.maxMana}</span>
                  </div>
               </div>
               
               {pendingPlay && (
                 <div className="flex items-center gap-3 animate-in slide-in-from-left-4">
                    <div className="w-1 h-8 bg-amber-500 rounded-full" />
                    <div className="text-sm font-bold text-amber-500">Select a target for <span className="underline decoration-2">{pendingPlay.card.name}</span></div>
                    <Button onClick={() => setPendingPlay(null)} variant="ghost" className="text-xs h-8">Cancel</Button>
                 </div>
               )}
               
               {selectedAttacker && (
                 <div className="flex items-center gap-3 animate-in slide-in-from-left-4">
                    <div className="w-1 h-8 bg-blue-500 rounded-full" />
                    <div className="text-sm font-bold text-blue-400">Choose destination for the attack...</div>
                    <Button onClick={() => setSelectedAttacker(null)} variant="ghost" className="text-xs h-8">Cancel</Button>
                 </div>
               )}
            </div>
            
            <div className="flex items-center gap-4">
               <div className="flex flex-col items-end mr-4">
                  <span className="text-[9px] font-black text-slate-600 uppercase mb-0.5">Player Advantage</span>
                  <span className="text-xl font-black text-slate-200">{winProb}%</span>
               </div>
               <Button 
                onClick={() => {
                  setPendingPlay(null);
                  setSelectedAttacker(null);
                  dispatch({ type: 'NEXT_PHASE' });
                }} 
                className="h-14 px-12 rounded-2xl bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 shadow-2xl transition-all active:scale-95 group"
                disabled={!isP1Turn}
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs font-black tracking-widest group-hover:tracking-widest">NEXT PHASE</span>
                  <span className="text-[9px] opacity-60 font-bold uppercase">{state.phase}</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Hand Display */}
          <div className="flex gap-4 overflow-x-auto pb-4 h-48 items-end scroll-smooth custom-scrollbar">
            {turnOwner.hand.map((cardId, i) => {
              const card = cards.find(c => c.id === cardId);
              if (!card) return null;
              const canPlay = turnOwner.mana >= card.cost && state.phase === GamePhase.MAIN && isP1Turn;
              return (
                <div 
                  key={`${cardId}-${i}`} 
                  onClick={() => canPlay && handlePlayCard(card, i)}
                  className={`flex-shrink-0 w-28 h-40 bg-slate-950 rounded-2xl border-2 p-4 flex flex-col relative transition-all duration-300 group/card ${canPlay ? 'border-blue-500/50 hover:border-blue-400 hover:-translate-y-8 shadow-2xl cursor-pointer hover:z-50' : 'opacity-40 border-slate-800 grayscale cursor-not-allowed'}`}
                >
                  <span className="absolute -top-3 -right-3 w-10 h-10 bg-blue-600 rounded-xl text-sm flex items-center justify-center font-black border-4 border-slate-900 shadow-xl group-hover/card:scale-110 transition-transform">{card.cost}</span>
                  <div className="flex-1 text-[11px] font-black text-center flex items-center justify-center text-slate-100 leading-tight group-hover/card:text-blue-200">{card.name}</div>
                  {card.type === 'Unit' && (
                    <div className="flex justify-between mt-auto font-mono text-[10px] font-black opacity-80">
                      <span className="text-amber-400">{card.atk}</span>
                      <span className="text-emerald-400">{card.hp}</span>
                    </div>
                  )}
                </div>
              );
            })}
            {turnOwner.hand.length === 0 && (
              <div className="w-full flex items-center justify-center py-10 opacity-20 italic text-sm font-bold tracking-widest text-slate-500 uppercase">Empty Hand</div>
            )}
          </div>
        </div>
      </div>

      {/* Side HUD */}
      <div className="w-96 flex flex-col gap-6">
        <CardWrapper className="flex-1 flex flex-col overflow-hidden bg-slate-900/40 border-slate-800 shadow-2xl backdrop-blur-xl">
           <div className="flex items-center justify-between mb-6 border-b border-slate-800/50 pb-4">
             <div className="flex flex-col">
                <h3 className="font-black text-slate-200 text-xs uppercase tracking-[0.2em]">Simulation Log</h3>
                <span className="text-[9px] text-slate-500 font-bold">Event Stream v1.2</span>
             </div>
             <div className="flex gap-2">
                <button 
                  onClick={() => dispatch({ type: 'UNDO' })} 
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <ICONS.History className="w-3 h-3" /> Rollback
                </button>
             </div>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar">
             {state.logs.slice().reverse().map((log, i) => (
               <div key={i} className={`p-4 rounded-2xl border-l-4 shadow-lg animate-in slide-in-from-right-4 duration-300 bg-slate-950/40 border-slate-800/50 ${log.type === 'action' ? 'border-l-blue-500' : log.type === 'damage' ? 'border-l-red-500' : log.type === 'rule' ? 'border-l-amber-500' : 'border-l-slate-600'}`}>
                 <div className="flex justify-between items-start mb-1">
                    <Badge color={log.type === 'action' ? 'bg-blue-500/10 text-blue-400' : log.type === 'damage' ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-500'}>{log.type}</Badge>
                    <span className="text-[8px] font-mono text-slate-600">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                 </div>
                 <p className="text-[11px] font-bold text-slate-300 leading-relaxed">{log.message}</p>
               </div>
             ))}
           </div>
        </CardWrapper>

        {/* Global Tracker Card */}
        <CardWrapper className="bg-slate-900/60 border-slate-800 shadow-xl p-5">
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[8px] font-black text-slate-600 uppercase">P1 Lore Score</span>
                <div className="text-2xl font-black text-blue-400">{state.players[0].scores.lore || 0}</div>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[8px] font-black text-slate-600 uppercase">P2 Lore Score</span>
                <div className="text-2xl font-black text-red-400">{state.players[1].scores.lore || 0}</div>
              </div>
           </div>
           <div className="mt-4 pt-4 border-t border-slate-800">
             <div className="flex justify-between items-center mb-2">
                <span className="text-[8px] font-black text-slate-600 uppercase">Poison Counters</span>
                <div className="flex gap-2">
                  <Badge color="bg-emerald-500/10 text-emerald-400">{state.players[0].counters.poison || 0}</Badge>
                  <Badge color="bg-emerald-500/10 text-emerald-400">{state.players[1].counters.poison || 0}</Badge>
                </div>
             </div>
           </div>
        </CardWrapper>
      </div>
    </div>
  );
};

export default Sandbox;
