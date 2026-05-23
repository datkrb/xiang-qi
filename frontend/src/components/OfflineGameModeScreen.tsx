import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { GameConfig } from "./GameModeScreen";

interface OfflineGameModeScreenProps {
  onBack: () => void;
  onStartGame: (config: GameConfig) => void;
}

export const OfflineGameModeScreen: React.FC<OfflineGameModeScreenProps> =
  React.memo(({ onBack, onStartGame }) => {
    const [playerColor, setPlayerColor] = useState<"red" | "black" | "random">(
      "random",
    );
    const [timeLimit, setTimeLimit] = useState<
      "unlimited" | "10" | "15" | "30"
    >("unlimited");

    const handleStartGame = () => {
      const config: GameConfig = {
        mode: "pvp",
        playerColor,
        timeLimit,
      };
      onStartGame(config);
    };

    return (
      <div className="min-h-screen bg-surface p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={onBack}
              className="p-3 bg-surface-opaque rounded-xl transition-all shadow-md hover:shadow-lg border border-surface cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-4xl font-extrabold text-primary tracking-tight">
              Offline Match Settings
            </h1>
          </div>

          <div className="bg-surface-opaque backdrop-blur-md rounded-3xl p-8 border border-surface shadow-2xl space-y-8 animate-in zoom-in-95 duration-200">
            {/* Player Color */}
            <div>
              <label className="block text-amber-100 text-lg font-semibold mb-4">
                Choose Your Color
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(["red", "black", "random"] as const).map((color) => (
                  <button
                    key={color}
                    onClick={() => setPlayerColor(color)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer font-bold ${
                      playerColor === color
                        ? "bg-primary border-primary text-on-primary shadow-lg"
                        : "bg-surface-opaque border-surface text-muted hover:bg-surface-opaque"
                    }`}
                  >
                    <span className="capitalize font-semibold">{color}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Limit */}
            <div>
              <label className="block text-muted text-lg font-semibold mb-4">
                Time Limit
              </label>
              <div className="grid grid-cols-4 gap-4">
                {(["unlimited", "10", "15", "30"] as const).map((time) => (
                  <button
                    key={time}
                    onClick={() => setTimeLimit(time)}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer font-bold ${
                      timeLimit === time
                        ? "bg-primary border-primary text-on-primary shadow-lg"
                        : "bg-surface-opaque border-surface text-muted hover:bg-surface-opaque"
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
                className="flex-1 bg-surface-opaque text-muted p-4 rounded-xl transition-all font-semibold text-lg cursor-pointer shadow-md"
              >
                Back
              </button>
              <button
                onClick={handleStartGame}
                className="flex-1 btn-primary p-4 rounded-xl transition-all font-black text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.03] cursor-pointer"
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  });

OfflineGameModeScreen.displayName = "OfflineGameModeScreen";
