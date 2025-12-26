import { MechanicDefinition } from '../types';

export const MECHANIC_LIBRARY: MechanicDefinition[] = [
  // --- WIN CONDITIONS ---
  {
    id: 'win_con_mill',
    name: 'Deck Exhaustion (Mill)',
    category: 'Win Condition',
    description: 'A player loses when they attempt to draw from an empty deck.',
    faq: 'Checked during every draw attempt. If deck count is 0, the drawer loses immediately.',
    dslExample: 'wincon: deck_exhaustion',
    triggers: ['onDrawAttempt'],
    isEnabled: true,
    parameters: {}
  },
  {
    id: 'win_con_resource',
    name: 'Resource Threshold',
    category: 'Win Condition',
    description: 'Win when a player reaches a specified resource amount.',
    faq: 'Checked after any event that increases player resources.',
    dslExample: 'wincon: resource_threshold { resource: "energy", amount: 10 }',
    triggers: ['onResourceChange'],
    isEnabled: false,
    parameters: { resource: 'energy', amount: 10 }
  },
  {
    id: 'win_con_score',
    name: 'Point Scoring',
    category: 'Win Condition',
    description: 'Win when a player reaches a specific point target (e.g. 20 lore).',
    faq: 'Used in racing-style TCGs. You can define custom score types.',
    dslExample: 'wincon: score_target { scoreType: "lore", target: 20 }',
    triggers: ['onScoreUpdate'],
    isEnabled: false,
    parameters: { scoreType: 'lore', target: 20 }
  },
  {
    id: 'win_con_units',
    name: 'Unit Control',
    category: 'Win Condition',
    description: 'Win if a player controls X units simultaneously.',
    faq: 'Encourages swarm or token strategies. Checked after phase changes.',
    dslExample: 'wincon: unit_control { count: 7 }',
    triggers: ['onBoardChange'],
    isEnabled: false,
    parameters: { count: 7 }
  },
  {
    id: 'win_con_objective',
    name: 'Objective Completion',
    category: 'Win Condition',
    description: 'Win when a game state meets a designer objective.',
    faq: 'E.g. "Control 3 Artifacts". Checks card tags on the board.',
    dslExample: 'wincon: objective_complete { tag: "artifact", count: 3 }',
    triggers: ['onStateChange'],
    isEnabled: false,
    parameters: { tag: 'artifact', count: 3 }
  },
  {
    id: 'win_con_hand',
    name: 'High Hand Win',
    category: 'Win Condition',
    description: 'Win if a player ends their turn with a full hand.',
    faq: 'Encourages control/hoarding strategies.',
    dslExample: 'wincon: hand_size_end { size: 7 }',
    triggers: ['onTurnEnd'],
    isEnabled: false,
    parameters: { size: 7 }
  },
  {
    id: 'win_con_counters',
    name: 'Counter Threshold',
    category: 'Win Condition',
    description: 'Win when specific counters reach a limit.',
    faq: 'E.g. 20 Poison counters or 20 Growth counters.',
    dslExample: 'wincon: counter_target { counter: "poison", threshold: 10 }',
    triggers: ['onCounterUpdate'],
    isEnabled: false,
    parameters: { counter: 'poison', threshold: 10 }
  },
  {
    id: 'win_con_pattern',
    name: 'Board Pattern Win',
    category: 'Win Condition',
    description: 'Win by achieving specific board states (e.g. full front row).',
    faq: 'Positional win condition.',
    dslExample: 'wincon: board_pattern { pattern: "full_frontline" }',
    triggers: ['onBoardChange'],
    isEnabled: false,
    parameters: { pattern: 'full_frontline' }
  },
  {
    id: 'win_con_time',
    name: 'Time-Based Win',
    category: 'Win Condition',
    description: 'Win if the game reaches turn X with a specific lead.',
    faq: 'Prevents infinite games.',
    dslExample: 'wincon: time_based { turn: 10, condition: "score_lead" }',
    triggers: ['onTurnStart'],
    isEnabled: false,
    parameters: { turn: 10, condition: 'score_lead' }
  },

  // --- ADVANCED EXTENSIONS ---
  {
    id: 'dynamic_rules',
    name: 'Dynamic Rule Mutation',
    category: 'Advanced Extension',
    description: 'Cards can modify global game rules mid-simulation.',
    faq: 'Allows for "Fluxx" style mechanics where hand size or draw amount changes.',
    dslExample: 'mechanic: dynamic_rule { rule: "max_hand_size=8" }',
    triggers: ['onPlay'],
    isEnabled: false,
    parameters: {}
  },
  {
    id: 'fog_of_war',
    name: 'Fog of War',
    category: 'Advanced Extension',
    description: 'Hides card information in specific zones (e.g. facedown units).',
    faq: 'Requires "Reveal" effects to interact.',
    dslExample: 'mechanic: fog_of_war { zone: "board" }',
    triggers: ['onStateRender'],
    isEnabled: false,
    parameters: {}
  },
  {
    id: 'weather_effects',
    name: 'Weather / Field Effects',
    category: 'Advanced Extension',
    description: 'Global persistent effects lasting multiple turns (Fog, Storm).',
    faq: 'Affects stats or triggers for all players.',
    dslExample: 'event: weather { name: "fog", duration: 3 }',
    triggers: ['onTurnStart'],
    isEnabled: false,
    parameters: { duration: 3 }
  },
  {
    id: 'interrupt_system',
    name: 'Reaction / Interrupt',
    category: 'Advanced Extension',
    description: 'Play actions during an opponent turn or in response to triggers.',
    faq: 'Enables complex interactive stack manipulation.',
    dslExample: 'mechanic: interrupt { trigger: "onPlay", effect: "counter" }',
    triggers: ['onOpponentAction'],
    isEnabled: false,
    parameters: {}
  },
  {
    id: 'auction_phase',
    name: 'Auction / Bidding',
    category: 'Advanced Extension',
    description: 'Add a dedicated phase where players bid resources.',
    faq: 'Used for determining turn order or special drafting.',
    dslExample: 'mechanic: phase_add { type: "Auction" }',
    triggers: ['onRoundStart'],
    isEnabled: false,
    parameters: {}
  },
  {
    id: 'sacrifice_core',
    name: 'Sacrifice Mechanics',
    category: 'Advanced Extension',
    description: 'Voluntarily destroy your own assets for amplified benefits.',
    faq: 'Core mechanic for many "Death" themed factions.',
    dslExample: 'OnSacrifice: GainResource { amount: 3 }',
    triggers: ['onSelfDestruction'],
    isEnabled: true,
    parameters: {}
  },
  {
    id: 'tag_synergy',
    name: 'Tag Synergy',
    category: 'Advanced Extension',
    description: 'Dynamic bonuses for cards sharing specific tags.',
    faq: 'E.g. Dragons gain +1 Attack for each other Dragon.',
    dslExample: 'mechanic: synergy { tag: "dragon", bonus: "+1/+1" }',
    triggers: ['onBoardUpdate'],
    isEnabled: true,
    parameters: {}
  },
  {
    id: 'deck_mutation',
    name: 'Deck Mutation',
    category: 'Advanced Extension',
    description: 'Permanently alter cards in the deck or graveyard during play.',
    faq: 'Stat changes that persist across zones.',
    dslExample: 'OnPlay: Mutate { target: "deck", cost: -1 }',
    triggers: ['onPlay'],
    isEnabled: false,
    parameters: {}
  },
  {
    id: 'phase_skip',
    name: 'Phase Skip',
    category: 'Advanced Extension',
    description: 'Effects that force a player to bypass a specific turn phase.',
    faq: 'Powerful disruptive tool.',
    dslExample: 'mechanic: skip_phase { targetPhase: "Combat" }',
    triggers: ['onTurnStart'],
    isEnabled: false,
    parameters: {}
  },
  {
    id: 'faction_alignment',
    name: 'Faction / Alignment System',
    category: 'Advanced Extension',
    description: 'Complex interactions based on card faction tags.',
    faq: 'Incentivizes mono-faction or multi-faction builds.',
    dslExample: 'mechanic: faction_bonus { faction: "undead", bonus: "hp+2" }',
    triggers: ['onDeckValidation', 'onPlay'],
    isEnabled: false,
    parameters: {}
  },
  {
    id: 'signature_cards',
    name: 'Signature Cards',
    category: 'Advanced Extension',
    description: 'Define unique cards that have special deck-limit rules.',
    faq: 'Forces a "1 per deck" limit regardless of general copy rules.',
    dslExample: 'system:signature_limit(1)',
    triggers: ['onDeckValidation'],
    isEnabled: false,
    parameters: {}
  }
];