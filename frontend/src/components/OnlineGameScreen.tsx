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
    <div className="min-h-screen bg-red-900 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-3 bg-red-700 hover:bg-red-600 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-4xl font-bold text-amber-100">
            {selectedMode === "menu" && "Play Online"}
            {selectedMode === "quickmatch" && "Quick Match"}
            {selectedMode === "room" && "Play with Friend"}
          </h1>
        </div>

        <div className="bg-red-800/50 backdrop-blur-sm rounded-2xl p-8 border border-red-700/50">
          {/* Main Menu */}
          {selectedMode === "menu" && (
            <div className="space-y-4">
              {/* Quick Match */}
              <button
                onClick={handleQuickMatch}
                className="w-full bg-yellow-600 hover:bg-yellow-500
                         text-white p-6 rounded-xl flex items-center gap-4 transition-all transform hover:scale-105
                         shadow-lg hover:shadow-xl border border-yellow-500/30"
              >
                <Zap className="w-8 h-8" />
                <div className="text-left">
                  <div className="text-xl font-bold">Quick Match</div>
                  <div className="text-sm text-white/80">
                    Play with random opponent
                  </div>
                </div>
              </button>

              {/* Play with Friend */}
              <button
                onClick={() => setSelectedMode("room")}
                className="w-full bg-blue-600 hover:bg-blue-500
                         text-white p-6 rounded-xl flex items-center gap-4 transition-all transform hover:scale-105
                         shadow-lg hover:shadow-xl border border-blue-500/30"
              >
                <Users className="w-8 h-8" />
                <div className="text-left">
                  <div className="text-xl font-bold">Play with Friend</div>
                  <div className="text-sm text-white/80">
                    Create or join a room
                  </div>
                </div>
              </button>

              {/* Back Button */}
              <button
                onClick={onBack}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-xl
                         transition-all font-semibold text-lg"
              >
                Back to Menu
              </button>
            </div>
          )}

          {/* Quick Match Waiting */}
          {selectedMode === "quickmatch" && (
            <div className="flex flex-col items-center justify-center space-y-6 py-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-amber-100 mb-2">
                  Finding Opponent...
                </h2>
                <p className="text-amber-200/70">
                  Searching for a player of similar skill level
                </p>
              </div>

              <div className="animate-spin">
                <Zap className="w-12 h-12 text-yellow-400" />
              </div>

              <button
                onClick={() => {
                  setSelectedMode("menu");
                }}
                className="bg-red-700 hover:bg-red-600 text-white p-3 rounded-lg transition-colors"
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
                className="flex items-center gap-2 text-amber-100 hover:text-amber-50 transition-colors mb-4"
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
