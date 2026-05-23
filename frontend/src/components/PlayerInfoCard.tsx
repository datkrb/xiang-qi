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
        className={`bg-surface p-4 rounded-xl shadow-lg border border-surface transition-all duration-300 ${
          isThinking ? "ring-2 ring-primary scale-[1.01]" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full ${
                player.color === "red"
                  ? "bg-primary text-on-primary"
                  : "bg-gray-900 text-white"
              } border-2 border-surface flex items-center justify-center font-bold transition-transform duration-300 hover:scale-105`}
            >
              {isAI ? (
                <Bot className="w-6 h-6 animate-pulse" />
              ) : (
                player.name[0]
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-on-primary font-bold">{player.name}</h3>
                {isAI && aiDifficulty ? (
                  <span className="text-xs bg-primary text-on-primary px-2 py-0.5 rounded-full font-semibold shadow-sm animate-in fade-in duration-300">
                    AI {aiDifficulty}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2 text-muted text-sm">
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
  },
);

PlayerInfoCard.displayName = "PlayerInfoCard";
