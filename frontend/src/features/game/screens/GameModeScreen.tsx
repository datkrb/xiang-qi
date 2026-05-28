import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface GameModeScreenProps {
  onBack: () => void;
  onStartGame: (config: GameConfig) => void;
  mode: "offline" | "ai" | "online";
}

export interface GameConfig {
  mode: "pvp" | "ai" | "online";
  playerColor: "red" | "black" | "random";
  aiDifficulty?: "easy" | "medium" | "hard" | "expert";
  timeLimit: "unlimited" | "10" | "15" | "30";
}

export default function GameModeScreen({
  onBack,
  onStartGame,
  mode,
}: GameModeScreenProps) {
  const [playerColor, setPlayerColor] = useState<"red" | "black" | "random">(
    "random",
  );
  const [aiDifficulty, setAiDifficulty] = useState<
    "easy" | "medium" | "hard" | "expert"
  >("medium");
  const [timeLimit, setTimeLimit] = useState<"unlimited" | "10" | "15" | "30">(
    "unlimited",
  );

  const handleStartGame = () => {
    const config: GameConfig = {
      mode: mode === "offline" ? "pvp" : mode === "ai" ? "ai" : "online",
      playerColor,
      aiDifficulty: mode === "ai" ? aiDifficulty : undefined,
      timeLimit,
    };
    onStartGame(config);
  };

  return (
    <div className="w-full p-8 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-3 bg-surface-opaque hover:bg-surface-hover text-muted hover:text-main rounded-xl transition-colors border border-border"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-bold font-heading text-main">Game Settings</h1>
        </div>

        <div className="glass-panel p-8 border-border space-y-8">
          {/* Player Color */}
          <div>
            <label className="block text-main font-heading text-lg font-semibold mb-4">
              Choose Your Color
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(["red", "black", "random"] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => setPlayerColor(color)}
                  className={`p-4 rounded-xl border transition-all ${
                    playerColor === color
                      ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                      : "bg-surface-opaque border-transparent hover:border-primary/50 text-muted hover:text-main"
                  }`}
                >
                  <span className="capitalize font-semibold">{color}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Difficulty */}
          {mode === "ai" && (
            <div>
              <label className="block text-main font-heading text-lg font-semibold mb-4">
                AI Difficulty
              </label>
              <div className="grid grid-cols-2 gap-4">
                {(["easy", "medium", "hard", "expert"] as const).map(
                  (difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => setAiDifficulty(difficulty)}
                      className={`p-4 rounded-xl border transition-all ${
                        aiDifficulty === difficulty
                          ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                          : "bg-surface-opaque border-transparent hover:border-primary/50 text-muted hover:text-main"
                      }`}
                    >
                      <span className="capitalize font-semibold">
                        {difficulty}
                      </span>
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          {/* Time Limit */}
          <div>
            <label className="block text-main font-heading text-lg font-semibold mb-4">
              Time Limit
            </label>
            <div className="grid grid-cols-4 gap-4">
              {(["unlimited", "10", "15", "30"] as const).map((time) => (
                <button
                  key={time}
                  onClick={() => setTimeLimit(time)}
                  className={`p-4 rounded-xl border transition-all ${
                    timeLimit === time
                      ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                      : "bg-surface-opaque border-transparent hover:border-primary/50 text-muted hover:text-main"
                  }`}
                >
                  <span className="font-semibold">
                    {time === "unlimited" ? "Unlimited" : `${time} min`}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onBack}
              className="flex-1 bg-surface-opaque hover:bg-surface-hover border border-border text-main p-4 rounded-xl transition-all font-semibold text-lg"
            >
              Back
            </button>
            <button
              onClick={handleStartGame}
              className="flex-1 btn-primary p-4 rounded-xl transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
