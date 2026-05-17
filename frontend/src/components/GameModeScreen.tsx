import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface GameModeScreenProps {
  onBack: () => void;
  onStartGame: (config: GameConfig) => void;
  mode: 'offline' | 'ai' | 'online';
}

export interface GameConfig {
  mode: 'pvp' | 'ai' | 'online';
  playerColor: 'red' | 'black' | 'random';
  aiDifficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  timeLimit: 'unlimited' | '10' | '15' | '30';
}

export default function GameModeScreen({ onBack, onStartGame, mode }: GameModeScreenProps) {
  const [playerColor, setPlayerColor] = useState<'red' | 'black' | 'random'>('random');
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [timeLimit, setTimeLimit] = useState<'unlimited' | '10' | '15' | '30'>('unlimited');

  const handleStartGame = () => {
    const config: GameConfig = {
      mode: mode === 'offline' ? 'pvp' : mode === 'ai' ? 'ai' : 'online',
      playerColor,
      aiDifficulty: mode === 'ai' ? aiDifficulty : undefined,
      timeLimit,
    };
    onStartGame(config);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-amber-900 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-3 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-4xl font-bold text-amber-100">Game Settings</h1>
        </div>

        <div className="bg-red-800/50 backdrop-blur-sm rounded-2xl p-8 border border-red-700/50 space-y-8">
          {/* Player Color */}
          <div>
            <label className="block text-amber-100 text-lg font-semibold mb-4">
              Choose Your Color
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(['red', 'black', 'random'] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => setPlayerColor(color)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    playerColor === color
                      ? 'bg-amber-400 border-amber-300 text-red-900'
                      : 'bg-red-700/50 border-red-600 text-amber-100 hover:bg-red-700'
                  }`}
                >
                  <span className="capitalize font-semibold">{color}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Difficulty */}
          {mode === 'ai' && (
            <div>
              <label className="block text-amber-100 text-lg font-semibold mb-4">
                AI Difficulty
              </label>
              <div className="grid grid-cols-2 gap-4">
                {(['easy', 'medium', 'hard', 'expert'] as const).map((difficulty) => (
                  <button
                    key={difficulty}
                    onClick={() => setAiDifficulty(difficulty)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      aiDifficulty === difficulty
                        ? 'bg-amber-400 border-amber-300 text-red-900'
                        : 'bg-red-700/50 border-red-600 text-amber-100 hover:bg-red-700'
                    }`}
                  >
                    <span className="capitalize font-semibold">{difficulty}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Time Limit */}
          <div>
            <label className="block text-amber-100 text-lg font-semibold mb-4">
              Time Limit
            </label>
            <div className="grid grid-cols-4 gap-4">
              {(['unlimited', '10', '15', '30'] as const).map((time) => (
                <button
                  key={time}
                  onClick={() => setTimeLimit(time)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    timeLimit === time
                      ? 'bg-amber-400 border-amber-300 text-red-900'
                      : 'bg-red-700/50 border-red-600 text-amber-100 hover:bg-red-700'
                  }`}
                >
                  <span className="font-semibold">
                    {time === 'unlimited' ? 'Unlimited' : `${time} min`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-xl
                       transition-all font-semibold text-lg"
            >
              Back
            </button>
            <button
              onClick={handleStartGame}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400
                       hover:to-amber-500 text-red-900 p-4 rounded-xl transition-all font-bold text-lg
                       shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
