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
      <div className="w-full p-8 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={onBack}
              className="p-3 bg-surface-opaque rounded-xl transition-all border border-border text-muted hover:text-main hover:border-primary cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-4xl font-extrabold font-heading text-main tracking-tight">
              Offline Match Settings
            </h1>
          </div>

          <div className="glass-panel rounded-3xl p-8 border-border space-y-8 animate-in zoom-in-95 duration-200">
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
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer font-bold ${
                      playerColor === color
                        ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(14,165,233,0.5)] scale-105"
                        : "bg-surface-opaque border-border hover:border-primary text-muted hover:text-main"
                    }`}
                  >
                    <span className="capitalize font-semibold">{color}</span>
                  </button>
                ))}
              </div>
            </div>

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
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer font-bold ${
                      timeLimit === time
                        ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(14,165,233,0.5)] scale-105"
                        : "bg-surface-opaque border-border hover:border-primary text-muted hover:text-main"
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
                className="flex-1 bg-surface-opaque hover:bg-surface-hover border border-border text-main p-4 rounded-xl transition-all font-semibold text-lg cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleStartGame}
                className="flex-1 btn-primary p-4 rounded-xl transition-all font-black text-lg shadow-lg cursor-pointer"
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
