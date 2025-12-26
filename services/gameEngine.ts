import { SimulatorState, GamePhase, PlayerState, Card, BoardInstance, MechanicDefinition } from '../types';
import { DSLEngine, DSLEffect } from './dslEngine';

export const calculateWinProbability = (state: SimulatorState): number => {
  const p1 = state.players[0];
  const p2 = state.players[1];
  
  // Heuristic evaluation: Health + Board Presence + Card Advantage
  const p1Power = p1.health + 
    (p1.board.reduce((acc, u) => acc + u.currentAtk + u.currentHp, 0) * 1.5) + 
    (p1.hand.length * 2);
    
  const p2Power = p2.health + 
    (p2.board.reduce((acc, u) => acc + u.currentAtk + u.currentHp, 0) * 1.5) + 
    (p2.hand.length * 2);
    
  const total = p1Power + p2Power;
  if (total === 0) return 50;
  
  const prob = Math.round((p1Power / total) * 100);
  return Math.max(5, Math.min(95, prob));
};

export const createInitialState = (p1Deck: string[], p2Deck: string[], mechanics: MechanicDefinition[]): SimulatorState => {
  const p1: PlayerState = {
    id: 'p1', name: 'Designer (P1)', health: 30, maxHealth: 30, mana: 1, maxMana: 1,
    deck: [...p1Deck], hand: [], board: [], grave: [], aiType: 'None',
    scores: { lore: 0 }, counters: { poison: 0 }, objectives: []
  };
  const p2: PlayerState = {
    id: 'p2', name: 'Opponent (AI)', health: 30, maxHealth: 30, mana: 1, maxMana: 1,
    deck: [...p2Deck], hand: [], board: [], grave: [], aiType: 'Greedy',
    scores: { lore: 0 }, counters: { poison: 0 }, objectives: []
  };

  // Starting hand size
  const startHand = 3;
  p1.hand = p1.deck.splice(0, startHand);
  p2.hand = p2.deck.splice(0, startHand);

  return {
    players: [p1, p2],
    turnOwnerIndex: 0,
    phase: GamePhase.MAIN,
    turnCount: 1,
    logs: [{ timestamp: Date.now(), message: 'Lab Simulation Started.', type: 'info' }],
    victoryStatus: { winner: null, reason: null },
    history: [],
    globalRules: {},
    weather: undefined
  };
};

export const gameReducer = (
  state: SimulatorState, 
  action: { type: string; payload?: any },
  mechanics: MechanicDefinition[],
  cardLibrary: Card[]
): SimulatorState => {
  if (state.victoryStatus.winner !== null && action.type !== 'RESET') return state;

  const snapshot = JSON.parse(JSON.stringify(state));
  const playerIdx = state.turnOwnerIndex;
  const oppIdx = (playerIdx + 1) % 2;

  switch (action.type) {
    case 'NEXT_PHASE': {
      let newState = { ...state, history: [...state.history, snapshot] };
      const phases = [GamePhase.DRAW, GamePhase.MAIN, GamePhase.COMBAT, GamePhase.END];
      
      // Inject Auction if enabled
      if (mechanics.find(m => m.id === 'auction_phase')?.isEnabled) {
        if (!phases.includes(GamePhase.AUCTION)) phases.unshift(GamePhase.AUCTION);
      }

      const currentIdx = phases.indexOf(state.phase);
      let nextPhase = phases[(currentIdx + 1) % phases.length];
      let nextTurnOwner = state.turnOwnerIndex;
      let nextTurnCount = state.turnCount;

      if (state.phase === GamePhase.END) {
        newState = processTrigger(newState, 'OnEndTurn', playerIdx, cardLibrary);
        nextTurnOwner = (state.turnOwnerIndex + 1) % 2;
        if (nextTurnOwner === 0) nextTurnCount++;
        nextPhase = phases[0];
      }

      newState = { ...newState, phase: nextPhase, turnOwnerIndex: nextTurnOwner, turnCount: nextTurnCount };
      
      if (nextPhase === GamePhase.DRAW) {
        newState = applyDrawPhaseLogic(newState, mechanics);
      }

      return checkAllWinConditions(newState, mechanics);
    }

    case 'PLAY_CARD': {
      const { cardIndex, card, targetId } = action.payload;
      const p = { ...state.players[playerIdx] };
      const c = card as Card;
      
      if (p.mana < c.cost) return state;
      p.hand = p.hand.filter((_, i) => i !== cardIndex);
      p.mana -= c.cost;

      let newState: SimulatorState = { 
        ...state, 
        players: state.players.map((pl, i) => i === playerIdx ? p : pl),
        history: [...state.history, snapshot],
        logs: [...state.logs, { timestamp: Date.now(), message: `${p.name} played ${c.name}`, type: 'action' }] 
      };

      const effects = DSLEngine.parse(c.dsl);
      newState = applyDSLEffects(newState, effects, playerIdx, targetId, cardLibrary);

      if (c.type === 'Unit') {
        const keywords = DSLEngine.getKeywords(c.dsl);
        const newUnit: BoardInstance = {
          instanceId: `inst-${Date.now()}-${Math.random()}`,
          cardId: c.id,
          currentHp: c.hp || 1,
          currentAtk: c.atk || 0,
          isExhausted: !keywords.some(k => k.toLowerCase() === 'rush'),
          keywords
        };
        newState.players[playerIdx].board = [...newState.players[playerIdx].board, newUnit];
      }

      return checkAllWinConditions(newState, mechanics);
    }

    case 'ATTACK': {
      const { attackerId, targetId } = action.payload;
      let newState = { ...state, history: [...state.history, snapshot] };
      const p = newState.players[playerIdx];
      const opp = newState.players[oppIdx];
      
      const attacker = p.board.find(u => u.instanceId === attackerId);
      if (!attacker || attacker.isExhausted) return state;

      const hasTaunt = opp.board.some(u => u.keywords.some(k => k.toLowerCase() === 'taunt'));
      const targetUnit = opp.board.find(u => u.instanceId === targetId);
      
      if (hasTaunt && (!targetUnit || !targetUnit.keywords.some(k => k.toLowerCase() === 'taunt'))) {
        newState.logs.push({ timestamp: Date.now(), message: 'Combat Blocked: Must attack Taunt!', type: 'rule' });
        return state;
      }

      if (targetId === opp.id) {
        opp.health -= attacker.currentAtk;
        if (attacker.keywords.some(k => k.toLowerCase() === 'lifesteal')) {
          p.health = Math.min(p.maxHealth, p.health + attacker.currentAtk);
        }
        // Fix: Changed attacker.attackerId to attacker.instanceId because BoardInstance doesn't have attackerId
        newState.logs.push({ timestamp: Date.now(), message: `${attacker.instanceId || 'Unit'} attacks Face for ${attacker.currentAtk}`, type: 'damage' });
      } else if (targetUnit) {
        targetUnit.currentHp -= attacker.currentAtk;
        attacker.currentHp -= targetUnit.currentAtk;
        if (attacker.keywords.some(k => k.toLowerCase() === 'lifesteal')) {
          p.health = Math.min(p.maxHealth, p.health + attacker.currentAtk);
        }
        newState.logs.push({ timestamp: Date.now(), message: `Combat: ${attackerId} vs ${targetId}`, type: 'damage' });
      }

      attacker.isExhausted = true;
      newState = cleanupDeadUnits(newState, cardLibrary);
      return checkAllWinConditions(newState, mechanics);
    }

    case 'BID': {
      if (state.phase !== GamePhase.AUCTION) return state;
      const { amount } = action.payload;
      const p = { ...state.players[playerIdx] };
      if (p.mana < amount) return state;
      p.mana -= amount;
      let newState = { ...state, history: [...state.history, snapshot] };
      newState.players[playerIdx] = p;
      newState.logs.push({ timestamp: Date.now(), message: `${p.name} bids ${amount} resource!`, type: 'action' });
      return newState;
    }

    case 'UNDO':
      return state.history.length > 0 ? state.history[state.history.length - 1] : state;

    case 'RESET':
      return createInitialState(state.players[0].deck, state.players[1].deck, mechanics);

    default:
      return state;
  }
};

const applyDSLEffects = (state: SimulatorState, effects: DSLEffect[], playerIdx: number, targetId?: string, cardLibrary?: Card[]): SimulatorState => {
  let newState = { ...state };
  const oppIdx = (playerIdx + 1) % 2;

  effects.forEach(eff => {
    if (eff.trigger === 'OnPlay' || eff.trigger === 'Victory' || eff.trigger === 'Global') {
      const action = eff.action.toLowerCase();
      
      // Damage handling
      if (action.includes('deal') || action.includes('damage')) {
        const val = eff.value || 0;
        if (targetId === newState.players[oppIdx].id) {
          newState.players[oppIdx].health -= val;
        } else {
          const unit = newState.players[oppIdx].board.find(u => u.instanceId === targetId);
          if (unit) unit.currentHp -= val;
        }
      }

      // Draw handling
      if (action.includes('draw')) {
        const val = eff.value || 1;
        for (let i = 0; i < val; i++) {
          const p = newState.players[playerIdx];
          if (p.deck.length > 0) p.hand.push(p.deck.shift()!);
        }
      }

      // Buff handling
      if (action.includes('buff') || action.includes('gain')) {
        const val = eff.value || 1;
        const unit = newState.players[playerIdx].board.find(u => u.instanceId === targetId);
        if (unit) {
          unit.currentAtk += val;
          unit.currentHp += val;
        }
      }

      // Score Handling
      if (action.includes('addscore')) {
        const type = eff.params?.scoreType || 'lore';
        const val = eff.params?.amount || 1;
        newState.players[playerIdx].scores[type] = (newState.players[playerIdx].scores[type] || 0) + val;
      }
      
      // Weather handling
      if (action === 'setweather') {
        newState.weather = eff.params?.name || 'Clear';
      }
    }
  });

  return newState;
};

const cleanupDeadUnits = (state: SimulatorState, cardLibrary: Card[]): SimulatorState => {
  let newState = { ...state };
  newState.players.forEach((p, pIdx) => {
    const deadUnits = p.board.filter(u => u.currentHp <= 0);
    deadUnits.forEach(u => {
      p.grave.push(u.cardId);
      const card = cardLibrary.find(c => c.id === u.cardId);
      if (card) {
        newState = processTrigger(newState, 'OnDeath', pIdx, cardLibrary, card);
      }
    });
    p.board = p.board.filter(u => u.currentHp > 0);
  });
  return newState;
};

const processTrigger = (state: SimulatorState, triggerType: string, playerIdx: number, cardLibrary: Card[], specificCard?: Card): SimulatorState => {
  let newState = { ...state };
  
  const applyForCard = (card: Card, ownerIdx: number) => {
    const effects = DSLEngine.parse(card.dsl);
    effects.forEach(eff => {
      if (eff.trigger.toLowerCase() === triggerType.toLowerCase()) {
        newState = applyDSLEffects(newState, [eff], ownerIdx, undefined, cardLibrary);
      }
    });
  };

  if (specificCard) {
    applyForCard(specificCard, playerIdx);
  } else {
    // Board-wide trigger check
    newState.players.forEach((p, pIdx) => {
      p.board.forEach(u => {
        const card = cardLibrary.find(c => c.id === u.cardId);
        if (card) applyForCard(card, pIdx);
      });
    });
  }

  return newState;
};

const applyDrawPhaseLogic = (state: SimulatorState, mechanics: MechanicDefinition[]): SimulatorState => {
  const pIdx = state.turnOwnerIndex;
  const p = { ...state.players[pIdx] };
  
  const manaMech = mechanics.find(m => m.id === 'm2' || m.id === 'mana_pool');
  const cap = manaMech?.isEnabled ? (manaMech.parameters.cap || 10) : 10;
  
  p.maxMana = Math.min(cap, state.turnCount);
  p.mana = p.maxMana;

  const newState = { ...state };
  if (p.deck.length > 0) {
    p.hand.push(p.deck.shift()!);
  } else {
    const millMech = mechanics.find(m => m.id === 'win_con_mill' || m.id === 'm3');
    if (millMech?.isEnabled) {
       newState.victoryStatus = { winner: (pIdx + 1) % 2, reason: 'Deck Exhaustion (Mill)' };
    }
  }

  newState.players[pIdx] = p;
  // Reset unit exhaustion
  newState.players[pIdx].board.forEach(u => u.isExhausted = false);

  return newState;
};

const checkAllWinConditions = (state: SimulatorState, mechanics: MechanicDefinition[]): SimulatorState => {
  if (state.victoryStatus.winner !== null) return state;

  for (const player of state.players) {
    const pIdx = state.players.indexOf(player);
    const oppIdx = (pIdx + 1) % 2;

    // Standard Health Win
    if (player.health <= 0) return { ...state, victoryStatus: { winner: oppIdx, reason: 'Health Depleted' } };

    // Point Scoring (Lore/Points)
    const scoreMech = mechanics.find(m => m.id === 'win_con_score');
    if (scoreMech?.isEnabled) {
      const type = scoreMech.parameters.scoreType || 'lore';
      const target = scoreMech.parameters.target || 20;
      if ((player.scores[type] || 0) >= target) {
        return { ...state, victoryStatus: { winner: pIdx, reason: `Reached ${target} ${type}` } };
      }
    }

    // Unit Swarm
    const unitMech = mechanics.find(m => m.id === 'win_con_units');
    if (unitMech?.isEnabled && player.board.length >= (unitMech.parameters.count || 7)) {
       return { ...state, victoryStatus: { winner: pIdx, reason: `Swarm Control (${player.board.length} Units)` } };
    }

    // Time/Turn Limit
    const timeMech = mechanics.find(m => m.id === 'win_con_time');
    if (timeMech?.isEnabled && state.turnCount >= (timeMech.parameters.turn || 15)) {
       // Usually whoever has more health wins at time
       const winner = state.players[0].health >= state.players[1].health ? 0 : 1;
       return { ...state, victoryStatus: { winner, reason: 'Time Limit (Turn Cap)' } };
    }

    // Counters (Poison etc)
    const counterMech = mechanics.find(m => m.id === 'win_con_counters');
    if (counterMech?.isEnabled) {
      const type = counterMech.parameters.counter || 'poison';
      const threshold = counterMech.parameters.threshold || 10;
      if ((player.counters[type] || 0) >= threshold) {
        return { ...state, victoryStatus: { winner: oppIdx, reason: `Excessive ${type} counters` } };
      }
    }
  }

  return state;
};