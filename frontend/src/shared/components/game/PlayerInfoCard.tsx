import React from "react";
import { Bot, Clock, Loader2 } from "lucide-react";
import { CapturedTray } from "@shared/components/game/xiangqi/CapturedTray";

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
        className={`glass-panel p-4 shadow-lg border-border transition-all duration-300 ${
          isThinking ? "ring-2 ring-primary scale-[1.01] shadow-[0_0_15px_rgba(14,165,233,0.3)]" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold font-heading text-lg transition-transform duration-300 hover:scale-105 border ${
                player.color === "red"
                  ? "bg-danger/20 text-danger border-danger/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                  : "bg-surface-opaque text-main border-border shadow-md"
              }`}
            >
              {isAI ? (
                <Bot className="w-7 h-7 animate-pulse" />
              ) : (
                player.name[0]
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-main font-bold font-heading text-lg">{player.name}</h3>
                {isAI && aiDifficulty ? (
                  <span className="text-xs bg-primary/20 border border-primary/30 text-primary px-2.5 py-0.5 rounded-lg font-semibold shadow-sm animate-in fade-in duration-300">
                    AI {aiDifficulty}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2 text-muted text-sm">
                {isThinking ? (
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang nghĩ...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{formatTime(player.timeRemaining)}</span>
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
