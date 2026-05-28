import React from "react";

interface PlayerCardProps {
  playerName: string;
  timeRemaining: string;
  capturedCount: number;
}

export const PlayerCardRed: React.FC<PlayerCardProps> = React.memo(
  ({ playerName, timeRemaining, capturedCount }) => {
    return (
      <div className="glass-panel p-4 border-border shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl border border-danger/30 flex items-center justify-center bg-danger/20 text-danger font-bold text-lg shadow-[0_0_10px_rgba(239,68,68,0.2)]">
              {playerName.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-main">{playerName}</h3>
              <p className="text-muted text-sm flex items-center gap-1">
                ⏱️ {timeRemaining}
              </p>
            </div>
          </div>
          <div className="text-sm text-muted">
            {capturedCount > 0 ? `${capturedCount} pieces` : "No captures"}
          </div>
        </div>
      </div>
    );
  },
);
PlayerCardRed.displayName = "PlayerCardRed";

export const PlayerCardBlack: React.FC<PlayerCardProps> = React.memo(
  ({ playerName, timeRemaining, capturedCount }) => {
    return (
      <div className="glass-panel p-4 border-border shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center bg-surface-opaque text-main font-bold text-lg">
              {playerName.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-main">{playerName}</h3>
              <p className="text-muted text-sm flex items-center gap-1">
                ⏱️ {timeRemaining}
              </p>
            </div>
          </div>
          <div className="text-sm text-muted">
            {capturedCount > 0 ? `${capturedCount} pieces` : "No captures"}
          </div>
        </div>
      </div>
    );
  },
);
PlayerCardBlack.displayName = "PlayerCardBlack";
