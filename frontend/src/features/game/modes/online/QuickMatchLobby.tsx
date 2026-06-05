import { ArrowLeft, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { useGame } from "@app/providers/GameProvider";
import MatchFoundDialog from "@features/game/components/MatchFoundDialog";

interface QuickMatchLobbyProps {
  onBack: () => void;
  onStartGame: () => void;
  userData: {
    userId: string;
    username: string;
    elo: number;
  };
}

export default function QuickMatchLobby({
  onBack,
  onStartGame,
  userData,
}: QuickMatchLobbyProps) {
  const { findMatch, roomId } = useGame();
  const [showMatchDialog, setShowMatchDialog] = useState(false);

  useEffect(() => {
    // Tự động tìm trận khi vào màn hình này
    const isPlayRed = Math.random() < 0.5;
    findMatch(userData, isPlayRed);
  }, [findMatch, userData]);

  // Listen for match found
  useEffect(() => {
    if (roomId) {
      // Match found, transition to game
      setShowMatchDialog(true);
      // short delay before transitioning so user sees dialog
      setTimeout(() => onStartGame(), 600);
    }
  }, [roomId, onStartGame]);

  return (
    <div className="w-full p-8 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-3 bg-surface-opaque hover:bg-surface-hover text-muted hover:text-main transition-colors rounded-xl border border-border"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-bold font-heading text-main">
            Quick Match
          </h1>
        </div>

        <div className="glass-panel rounded-2xl p-8 border-border">
          <div className="flex flex-col items-center justify-center space-y-6 py-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold font-heading text-main mb-2">
                Finding Opponent...
              </h2>
              <p className="text-muted">
                Searching for a player of similar skill level
              </p>
            </div>

            <div className="animate-spin">
              <Zap className="w-12 h-12 text-primary" />
            </div>

            <button
              onClick={onBack}
              className="bg-surface-opaque hover:bg-surface-hover text-main p-3 rounded-xl border border-border transition-colors mt-6 px-6"
            >
              Cancel
            </button>
          </div>
          
          {showMatchDialog && roomId && (
            <MatchFoundDialog
              roomId={roomId}
              onClose={() => setShowMatchDialog(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
