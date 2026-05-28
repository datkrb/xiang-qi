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
    <div className="w-full p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onBack}
            className="p-3 bg-surface-opaque rounded-xl transition-colors border border-border text-muted hover:text-main"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-bold font-heading text-main">Load Saved Game</h1>
        </div>

        {/* Saved games list */}
        <div className="space-y-4">
          {savedGames.length === 0 ? (
            <div className="glass-panel p-12 text-center border-border">
              <p className="text-main text-xl font-heading font-semibold">No saved games found</p>
              <p className="text-muted mt-2">
                Start playing to create save files!
              </p>
            </div>
          ) : (
            savedGames.map((game) => (
              <div
                key={game.id}
                className="glass-panel-interactive p-6 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold font-heading text-main mb-2">
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
                      className="px-6 py-3 btn-primary rounded-xl font-bold"
                    >
                      Load
                    </button>
                    <button className="p-3 bg-surface-opaque hover:bg-surface-hover text-muted hover:text-main rounded-xl border border-transparent hover:border-border transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-danger/10 hover:bg-danger text-danger hover:text-white rounded-xl transition-colors">
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
          className="mt-8 w-full bg-surface-opaque hover:bg-surface-hover border border-border text-main p-4 rounded-xl transition-all font-semibold text-lg"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}
