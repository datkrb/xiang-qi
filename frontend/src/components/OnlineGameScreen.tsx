import { ArrowLeft, Zap, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { GameRoom } from "./GameRoom";
import MatchFoundDialog from "./MatchFoundDialog";

interface OnlineGameScreenProps {
  onBack: () => void;
  onStartGame: () => void;
  userData: {
    userId: string;
    username: string;
    elo: number;
  };
}

export default function OnlineGameScreen({
  onBack,
  onStartGame,
  userData,
}: OnlineGameScreenProps) {
  const [selectedMode, setSelectedMode] = useState<
    "menu" | "quickmatch" | "room"
  >("menu");
  const { findMatch, roomId } = useGame();
  const [showMatchDialog, setShowMatchDialog] = useState(false);

  const handleQuickMatch = () => {
    // Randomly assign player color for quick match
    const isPlayRed = Math.random() < 0.5;
    findMatch(userData, isPlayRed);
    setSelectedMode("quickmatch");
  };

  // Listen for match found
  useEffect(() => {
    if (roomId && selectedMode === "quickmatch") {
      // Match found, transition to game
      setShowMatchDialog(true);
      // short delay before transitioning so user sees dialog
      setTimeout(() => onStartGame(), 600);
    }
  }, [roomId, selectedMode, onStartGame]);

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
            {selectedMode === "menu" && "Play Online"}
            {selectedMode === "quickmatch" && "Quick Match"}
            {selectedMode === "room" && "Play with Friend"}
          </h1>
        </div>

        <div className="glass-panel rounded-2xl p-8 border-border">
          {/* Main Menu */}
          {selectedMode === "menu" && (
            <div className="space-y-4">
              {/* Quick Match */}
              <button
                onClick={handleQuickMatch}
                className="w-full glass-panel-interactive text-main p-6 rounded-2xl flex items-center gap-6 group"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Zap className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold font-heading mb-1 group-hover:text-primary transition-colors">Quick Match</div>
                  <div className="text-sm text-muted">
                    Play with random opponent
                  </div>
                </div>
              </button>

              {/* Play with Friend */}
              <button
                onClick={() => setSelectedMode("room")}
                className="w-full glass-panel-interactive text-main p-6 rounded-2xl flex items-center gap-6 group"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Users className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold font-heading mb-1 group-hover:text-primary transition-colors">Play with Friend</div>
                  <div className="text-sm text-muted">
                    Create or join a room
                  </div>
                </div>
              </button>

              {/* Back Button */}
              <button
                onClick={onBack}
                className="w-full bg-surface-opaque hover:bg-surface-hover border border-border text-main p-4 rounded-xl transition-colors font-semibold text-lg mt-4"
              >
                Back to Menu
              </button>
            </div>
          )}

          {/* Quick Match Waiting */}
          {selectedMode === "quickmatch" && (
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
                onClick={() => {
                  setSelectedMode("menu");
                }}
                className="bg-surface-opaque hover:bg-surface-hover text-main p-3 rounded-xl border border-border transition-colors mt-6 px-6"
              >
                Cancel
              </button>
            </div>
          )}

          {showMatchDialog && roomId && (
            <MatchFoundDialog
              roomId={roomId}
              onClose={() => setShowMatchDialog(false)}
            />
          )}

          {/* Room Selection */}
          {selectedMode === "room" && (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedMode("menu")}
                className="flex items-center gap-2 text-muted hover:text-main transition-colors mb-4"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>

              <GameRoom userData={userData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
