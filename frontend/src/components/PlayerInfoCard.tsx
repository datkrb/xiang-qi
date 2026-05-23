import React from "react";
import { Bot, Clock, Loader2 } from "lucide-react";
import { CapturedTray } from "./xiangqi/CapturedTray";

interface Player {
  name: string;
  color: "red" | "black";
  timeRemaining: number;
}

interface PlayerInfoCardProps {
  player: Player;
  isAI: boolean;
  isThinking: boolean;
  aiDifficulty?: string;
  capturedPieces: any[];
  capturedColor: "red" | "black";
}

export const PlayerInfoCard: React.FC<PlayerInfoCardProps> = React.memo(
  ({
    player,
    isAI,
    isThinking,
    aiDifficulty,
    capturedPieces,
    capturedColor,
  }) => {
    const formatTime = (seconds: number) => {
      if (seconds === 0) return "∞";
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
      <div
        className={`bg-gradient-to-r ${
          player.color === "red"
            ? "from-red-700 to-red-600"
            : "from-gray-800 to-gray-700"
        } p-4 rounded-xl shadow-lg border border-white/10 transition-all duration-300 ${
          isThinking
            ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-transparent scale-[1.01]"
            : ""
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full ${
                player.color === "red" ? "bg-red-500" : "bg-gray-900"
              } border-2 border-white flex items-center justify-center text-white font-bold transition-transform duration-300 hover:scale-105`}
            >
              {isAI ? <Bot className="w-6 h-6 animate-pulse" /> : player.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold">{player.name}</h3>
                {isAI && aiDifficulty ? (
                  <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-semibold shadow-sm animate-in fade-in duration-300">
                    AI {aiDifficulty}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                {isThinking ? (
                  <div className="flex items-center gap-2 text-amber-300 font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang nghĩ...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(player.timeRemaining)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <CapturedTray pieces={capturedPieces} color={capturedColor} />
        </div>
      </div>
    );
  }
);

PlayerInfoCard.displayName = "PlayerInfoCard";
