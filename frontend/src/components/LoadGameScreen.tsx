import { ArrowLeft, Trash2, Edit2 } from "lucide-react";
import { useState } from "react";

interface SavedGame {
  id: string;
  name: string;
  date: string;
  moves: number;
  players: string;
}

interface LoadGameScreenProps {
  onBack: () => void;
  onLoadGame: (gameId: string) => void;
}

export default function LoadGameScreen({
  onBack,
  onLoadGame,
}: LoadGameScreenProps) {
  const [savedGames] = useState<SavedGame[]>([
    {
      id: "1",
      name: "Quick Match vs AI",
      date: "2026-05-15 14:30",
      moves: 45,
      players: "Player 1 vs AI (Medium)",
    },
    {
      id: "2",
      name: "Championship Game",
      date: "2026-05-14 18:20",
      moves: 67,
      players: "Player 1 vs Player 2",
    },
    {
      id: "3",
      name: "Practice Session",
      date: "2026-05-13 10:15",
      moves: 23,
      players: "Player 1 vs AI (Easy)",
    },
  ]);

  return (
    <div className="min-h-screen bg-surface p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-3 bg-surface-opaque rounded-lg transition-colors border border-surface"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-4xl font-bold text-primary">Load Saved Game</h1>
        </div>

        {/* Saved games list */}
        <div className="space-y-4">
          {savedGames.length === 0 ? (
            <div className="bg-surface-opaque backdrop-blur-sm rounded-2xl p-12 text-center border border-surface">
              <p className="text-muted text-xl">No saved games found</p>
              <p className="text-muted/70 mt-2">
                Start playing to create save files!
              </p>
            </div>
          ) : (
            savedGames.map((game) => (
              <div
                key={game.id}
                className="bg-surface-opaque backdrop-blur-sm rounded-xl p-6 border border-surface hover:bg-surface-opaque transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-on-primary mb-2">
                      {game.name}
                    </h3>
                    <div className="space-y-1 text-muted">
                      <p className="text-sm">
                        <span className="font-semibold">Date:</span> {game.date}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Moves:</span>{" "}
                        {game.moves}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Players:</span>{" "}
                        {game.players}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onLoadGame(game.id)}
                      className="px-6 py-3 btn-primary rounded-lg font-bold transition-all transform hover:scale-105"
                    >
                      Load
                    </button>
                    <button className="p-3 bg-surface-opaque hover:bg-surface-opaque text-muted rounded-lg transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-danger hover:bg-danger text-white rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back button */}
        <button
          onClick={onBack}
          className="mt-8 w-full bg-gray-700 hover:bg-gray-600 text-white p-4 rounded-xl
                   transition-all font-semibold text-lg"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}
