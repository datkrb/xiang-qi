import React from "react";

interface PlayerCardProps {
  playerName: string;
  timeRemaining: string;
  capturedCount: number;
}

export const PlayerCardRed: React.FC<PlayerCardProps> = React.memo(
  ({ playerName, timeRemaining, capturedCount }) => {
    return (
      <div className="bg-surface p-4 rounded-2xl border border-surface shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-surface flex items-center justify-center bg-primary text-on-primary font-bold text-lg">
              {playerName.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold">{playerName}</h3>
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
      <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white rounded-2xl p-4 border border-white/10 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center bg-slate-900 font-bold text-lg">
              {playerName.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold">{playerName}</h3>
              <p className="text-white/70 text-sm flex items-center gap-1">
                ⏱️ {timeRemaining}
              </p>
            </div>
          </div>
          <div className="text-sm text-white/50">
            {capturedCount > 0 ? `${capturedCount} pieces` : "No captures"}
          </div>
        </div>
      </div>
    );
  },
);
PlayerCardBlack.displayName = "PlayerCardBlack";
