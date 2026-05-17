import { useState } from 'react';
import "./App.css";
import HomeScreen from './components/HomeScreen';
import GameModeScreen, { GameConfig } from './components/GameModeScreen';
import MainGameScreen from './components/MainGameScreen';
import LoadGameScreen from './components/LoadGameScreen';
import AllScreensShowcase from './components/AllScreensShowcase';

type Screen = 'home' | 'offline' | 'online' | 'ai' | 'game' | 'load' | 'tutorial' | 'leaderboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [gameConfig, setGameConfig] = useState<GameConfig | null>(null);
  const [showAll, setShowAll] = useState(false);

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleStartGame = (config: GameConfig) => {
    setGameConfig(config);
    setCurrentScreen('game');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
    setGameConfig(null);
  };

  const handleLoadGame = (gameId: string) => {
    // In a real implementation, this would load the game state
    console.log('Loading game:', gameId);
    setCurrentScreen('game');
  };

  return (
    <div className="size-full">
      <button
        onClick={() => setShowAll((v) => !v)}
        className="fixed bottom-4 right-4 z-50 px-4 py-2 bg-amber-900 hover:bg-amber-800 text-amber-50 rounded-full shadow-lg font-semibold"
      >
        {showAll ? 'Exit Showcase' : 'Show All Screens'}
      </button>

      {showAll && <AllScreensShowcase />}

      {!showAll && currentScreen === 'home' && <HomeScreen onNavigate={handleNavigate} />}

      {!showAll && currentScreen === 'offline' && (
        <GameModeScreen
          mode="offline"
          onBack={handleBackToHome}
          onStartGame={handleStartGame}
        />
      )}

      {!showAll && currentScreen === 'online' && (
        <GameModeScreen
          mode="online"
          onBack={handleBackToHome}
          onStartGame={handleStartGame}
        />
      )}

      {!showAll && currentScreen === 'ai' && (
        <GameModeScreen
          mode="ai"
          onBack={handleBackToHome}
          onStartGame={handleStartGame}
        />
      )}

      {!showAll && currentScreen === 'game' && gameConfig && (
        <MainGameScreen config={gameConfig} onExit={handleBackToHome} />
      )}

      {!showAll && currentScreen === 'load' && (
        <LoadGameScreen onBack={handleBackToHome} onLoadGame={handleLoadGame} />
      )}

      {!showAll && currentScreen === 'tutorial' && (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-amber-900 p-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleBackToHome}
              className="mb-8 px-6 py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              ← Back to Menu
            </button>
            <div className="bg-red-800/50 backdrop-blur-sm rounded-2xl p-8 border border-red-700/50">
              <h1 className="text-4xl font-bold text-amber-100 mb-6">Xiangqi Tutorial</h1>
              <div className="space-y-4 text-amber-100">
                <p className="text-lg">Welcome to Xiangqi (Chinese Chess)!</p>
                <p>This tutorial will guide you through the rules and strategies of this ancient game.</p>
                <p className="text-amber-200/70 italic">Tutorial content coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showAll && currentScreen === 'leaderboard' && (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-amber-900 p-8">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleBackToHome}
              className="mb-8 px-6 py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              ← Back to Menu
            </button>
            <div className="bg-red-800/50 backdrop-blur-sm rounded-2xl p-8 border border-red-700/50">
              <h1 className="text-4xl font-bold text-amber-100 mb-6">Leaderboard</h1>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Master Chen', score: 2850, wins: 145 },
                  { rank: 2, name: 'Dragon King', score: 2720, wins: 128 },
                  { rank: 3, name: 'Phoenix Rider', score: 2690, wins: 112 },
                  { rank: 4, name: 'Wise Monk', score: 2580, wins: 98 },
                  { rank: 5, name: 'Swift Knight', score: 2450, wins: 87 },
                ].map((player) => (
                  <div
                    key={player.rank}
                    className="flex items-center justify-between p-4 bg-red-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl font-bold text-amber-400 w-8">#{player.rank}</span>
                      <span className="text-xl text-amber-100 font-semibold">{player.name}</span>
                    </div>
                    <div className="flex gap-8 text-amber-200">
                      <span>Score: <strong>{player.score}</strong></span>
                      <span>Wins: <strong>{player.wins}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
