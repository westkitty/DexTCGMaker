import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { ViewType, Card, MechanicDefinition, Deck, Scenario } from './types';
import { StorageService } from './services/storage';
import { INITIAL_CARDS } from './constants';
import { MECHANIC_LIBRARY } from './mechanics/registry';

// Pages
import Overview from './pages/Overview';
import Mechanics from './pages/Mechanics';
import Cards from './pages/Cards';
import Sandbox from './pages/Sandbox';
import Decks from './pages/Decks';
import Analytics from './pages/Analytics';

// Components
import MechanicFAQModal from './components/MechanicFAQModal';
import LaunchScreen from './components/LaunchScreen';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('Overview');
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);

  const [cards, setCards] = useState<Card[]>([]);
  const [mechanics, setMechanics] = useState<MechanicDefinition[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  
  const [loadedScenario, setLoadedScenario] = useState<Scenario | null>(null);

  useEffect(() => {
    const loadedCards = StorageService.getCards();
    const loadedMechanics = StorageService.getMechanics();
    const loadedDecks = StorageService.getDecks();

    setCards(loadedCards.length > 0 ? loadedCards : INITIAL_CARDS);
    setMechanics(loadedMechanics.length > 0 ? loadedMechanics : MECHANIC_LIBRARY);
    setDecks(loadedDecks);

    const hasSeen = sessionStorage.getItem('dextcgm_launched');
    if (hasSeen) {
      setShowLaunchScreen(false);
    }
  }, []);

  useEffect(() => {
    if (cards.length > 0) StorageService.saveCards(cards);
  }, [cards]);

  useEffect(() => {
    if (mechanics.length > 0) StorageService.saveMechanics(mechanics);
  }, [mechanics]);

  useEffect(() => {
    if (decks.length > 0) StorageService.saveDecks(decks);
  }, [decks]);

  const handleLoadScenario = (scen: Scenario) => {
    setLoadedScenario(scen);
    setActiveView('Sandbox');
  };

  const handleStartApp = () => {
    setShowLaunchScreen(false);
    sessionStorage.setItem('dextcgm_launched', 'true');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'Overview':
        return <Overview cards={cards} decks={decks} onLoadScenario={handleLoadScenario} />;
      case 'Mechanics':
        return <Mechanics mechanics={mechanics} setMechanics={setMechanics} />;
      case 'Cards':
        return <Cards cards={cards} setCards={setCards} />;
      case 'Sandbox':
        return <Sandbox cards={cards} mechanics={mechanics} />;
      case 'Decks':
        return <Decks decks={decks} setDecks={setDecks} cards={cards} />;
      case 'Analytics':
        return <Analytics cards={cards} decks={decks} />;
      default:
        return <Overview cards={cards} decks={decks} onLoadScenario={handleLoadScenario} />;
    }
  };

  return (
    <div className="relative">
      {showLaunchScreen && <LaunchScreen onStart={handleStartApp} />}
      
      {!showLaunchScreen && (
        <Layout activeView={activeView} setView={setActiveView}>
          <div className="absolute top-8 right-8 z-10">
            <button 
              onClick={() => setIsFAQOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 text-slate-300 rounded-xl transition-all shadow-xl backdrop-blur-sm group"
            >
              <span className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-[10px] font-bold text-white group-hover:scale-110 transition-transform">?</span>
              <span className="text-sm font-semibold tracking-tight">Rules Library</span>
            </button>
          </div>
          {renderContent()}
          {isFAQOpen && <MechanicFAQModal onClose={() => setIsFAQOpen(false)} />}
        </Layout>
      )}
    </div>
  );
};

export default App;
