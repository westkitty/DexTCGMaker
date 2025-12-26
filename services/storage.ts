
// Fix: Change 'Mechanic' to 'MechanicDefinition' as defined in types.ts
import { Card, Deck, MechanicDefinition, Scenario } from '../types';

const STORAGE_KEYS = {
  CARDS: 'dextcgm_cards',
  DECKS: 'dextcgm_decks',
  MECHANICS: 'dextcgm_mechanics',
  SCENARIOS: 'dextcgm_scenarios'
};

export const StorageService = {
  save: <T,>(key: string, data: T): void => {
    localStorage.setItem(key, JSON.stringify(data));
  },

  load: <T,>(key: string, defaultValue: T): T => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  },

  getCards: () => StorageService.load<Card[]>(STORAGE_KEYS.CARDS, []),
  saveCards: (cards: Card[]) => StorageService.save(STORAGE_KEYS.CARDS, cards),

  getDecks: () => StorageService.load<Deck[]>(STORAGE_KEYS.DECKS, []),
  saveDecks: (decks: Deck[]) => StorageService.save(STORAGE_KEYS.DECKS, decks),

  // Fix: Update type from Mechanic to MechanicDefinition
  getMechanics: () => StorageService.load<MechanicDefinition[]>(STORAGE_KEYS.MECHANICS, []),
  saveMechanics: (mechanics: MechanicDefinition[]) => StorageService.save(STORAGE_KEYS.MECHANICS, mechanics),

  getScenarios: () => StorageService.load<Scenario[]>(STORAGE_KEYS.SCENARIOS, []),
  saveScenarios: (scenarios: Scenario[]) => StorageService.save(STORAGE_KEYS.SCENARIOS, scenarios)
};