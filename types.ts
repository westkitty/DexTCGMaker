
export enum CardType {
  UNIT = 'Unit',
  SPELL = 'Spell',
  ARTIFACT = 'Artifact',
  LAND = 'Land'
}

export enum Rarity {
  COMMON = 'Common',
  UNCOMMON = 'Uncommon',
  RARE = 'Rare',
  EPIC = 'Epic',
  LEGENDARY = 'Legendary'
}

export type MechanicCategory = 'Structural' | 'Interaction' | 'Victory' | 'Resource' | 'Combat' | 'Keyword' | 'Win Condition' | 'Advanced Extension';

export interface MechanicDefinition {
  id: string;
  name: string;
  category: MechanicCategory;
  description: string;
  faq: string;
  dslExample: string;
  triggers: string[];
  isEnabled: boolean;
  parameters: Record<string, any>;
}

export interface Card {
  id: string;
  name: string;
  cost: number;
  atk?: number;
  hp?: number;
  type: CardType;
  rarity: Rarity;
  dsl: string;
  tags: string[];
  notes: string;
  favorite: boolean;
  version: number;
  history: { date: number; change: string }[];
}

export interface Deck {
  id: string;
  name: string;
  cardIds: string[];
  constraints: {
    maxSize: number;
    minSize: number;
    maxCopies: number;
  };
  tags: string[];
}

export interface BoardInstance { 
  instanceId: string; 
  cardId: string; 
  currentHp: number; 
  currentAtk: number; 
  isExhausted: boolean;
  keywords: string[];
}

export interface PlayerState {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  deck: string[];
  hand: string[];
  board: BoardInstance[];
  grave: string[];
  aiType?: 'None' | 'Greedy' | 'Random';
  // New: Global tracking
  scores: Record<string, number>;
  counters: Record<string, number>;
  objectives: string[];
}

export enum GamePhase {
  DRAW = 'Draw',
  MAIN = 'Main',
  COMBAT = 'Combat',
  END = 'End',
  AUCTION = 'Auction' // Added for advanced mechanics
}

export interface SimulatorState {
  players: PlayerState[];
  turnOwnerIndex: number;
  phase: GamePhase;
  turnCount: number;
  logs: { timestamp: number; message: string; type: 'info' | 'action' | 'damage' | 'rule' }[];
  victoryStatus: { winner: number | null; reason: string | null };
  history: any[];
  // New: Global Rules
  globalRules: Record<string, any>;
  weather?: string;
}

export interface Scenario {
  id: string;
  name: string;
  timestamp: number;
  state: SimulatorState;
}

export type ViewType = 'Overview' | 'Mechanics' | 'Cards' | 'Decks' | 'Sandbox' | 'Analytics';
