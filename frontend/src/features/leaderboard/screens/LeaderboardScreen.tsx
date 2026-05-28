import React from "react";
import { Award, Trophy, ArrowLeft, Star } from "lucide-react";

interface LeaderboardScreenProps {
  onBack: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = React.memo(
  ({ onBack }) => {
    const leaders = [
      {
        rank: 1,
        name: "Master Chen",
        score: 2850,
        wins: 145,
        title: "Grandmaster",
      },
      { rank: 2, name: "Dragon King", score: 2720, wins: 128, title: "Master" },
      {
        rank: 3,
        name: "Phoenix Rider",
        score: 2690,
        wins: 112,
        title: "Master",
      },
      { rank: 4, name: "Wise Monk", score: 2580, wins: 98, title: "Expert" },
      { rank: 5, name: "Swift Knight", score: 2450, wins: 87, title: "Expert" },
    ];

    return (
      <div className="w-full p-6 md:p-12 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <button
            onClick={onBack}
            className="mb-8 flex items-center gap-2 px-5 py-2.5 bg-surface-opaque hover:bg-surface-hover text-muted hover:text-main rounded-xl font-medium transition-all border border-border"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Menu</span>
          </button>

          {/* Board Container */}
          <div className="glass-panel rounded-3xl p-8 md:p-10 space-y-8">
            <div className="flex items-center justify-between border-b border-border pb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold font-heading text-main tracking-tight">
                    Leaderboard
                  </h1>
                  <p className="text-muted mt-1 text-sm">
                    Rankings of the top Xiangqi warriors globally.
                  </p>
                </div>
              </div>
              <Award className="w-10 h-10 text-amber-400/30 hidden sm:block" />
            </div>

            {/* Leaders List */}
            <div className="space-y-4">
              {leaders.map((player) => {
                return (
                  <div
                    key={player.rank}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.01] ${
                      player.rank === 1
                        ? "glass-panel-interactive border-primary shadow-[0_0_15px_rgba(14,165,233,0.2)]"
                        : "bg-surface-opaque border-border"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-2xl font-black w-8 flex items-center justify-center ${
                          player.rank === 1
                            ? "text-primary"
                            : player.rank === 2
                              ? "text-muted"
                              : player.rank === 3
                                ? "text-primary/70"
                                : "text-muted/70"
                        }`}
                      >
                        {player.rank === 1 ? (
                          <Trophy className="w-6 h-6 text-primary animate-pulse" />
                        ) : (
                          `#${player.rank}`
                        )}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl text-main font-bold">
                            {player.name}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-surface-opaque border border-border rounded-full font-medium text-muted">
                            {player.title}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-8 text-sm mt-3 sm:mt-0 text-muted w-full sm:w-auto justify-between sm:justify-end border-t border-surface/20 sm:border-0 pt-3 sm:pt-0">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-400" />
                        <span>
                          Rating:{" "}
                          <strong className="text-amber-200 font-extrabold">
                            {player.score}
                          </strong>
                        </span>
                      </div>
                      <div>
                        Wins:{" "}
                        <strong className="text-amber-200 font-extrabold">
                          {player.wins}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

LeaderboardScreen.displayName = "LeaderboardScreen";
