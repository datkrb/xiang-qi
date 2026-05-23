import React from "react";
import { Award, Trophy, ArrowLeft, Star } from "lucide-react";

interface LeaderboardScreenProps {
  onBack: () => void;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = React.memo(({ onBack }) => {
  const leaders = [
    { rank: 1, name: "Master Chen", score: 2850, wins: 145, title: "Grandmaster" },
    { rank: 2, name: "Dragon King", score: 2720, wins: 128, title: "Master" },
    { rank: 3, name: "Phoenix Rider", score: 2690, wins: 112, title: "Master" },
    { rank: 4, name: "Wise Monk", score: 2580, wins: 98, title: "Expert" },
    { rank: 5, name: "Swift Knight", score: 2450, wins: 87, title: "Expert" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-950 via-red-900 to-amber-950 p-6 md:p-12 text-amber-100 animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 px-5 py-2.5 bg-red-800/80 hover:bg-red-700/90 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg border border-red-700/50 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Menu</span>
        </button>

        {/* Board Container */}
        <div className="bg-red-900/30 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-amber-500/20 shadow-2xl space-y-8">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-amber-200 tracking-tight">
                  Leaderboard
                </h1>
                <p className="text-amber-200/70 text-sm mt-1">
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
                      ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/15 border-amber-400/40 shadow-lg shadow-amber-500/5"
                      : player.rank === 2
                        ? "bg-gradient-to-r from-slate-300/15 to-slate-400/10 border-slate-400/25"
                        : player.rank === 3
                          ? "bg-gradient-to-r from-amber-800/15 to-amber-900/10 border-amber-800/25"
                          : "bg-red-950/40 border-amber-500/10"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-2xl font-black w-8 flex items-center justify-center ${
                        player.rank === 1
                          ? "text-amber-400"
                          : player.rank === 2
                            ? "text-slate-300"
                            : player.rank === 3
                              ? "text-amber-600"
                              : "text-amber-200/55"
                      }`}
                    >
                      {player.rank === 1 ? (
                        <Trophy className="w-6 h-6 text-amber-400 animate-pulse" />
                      ) : (
                        `#${player.rank}`
                      )}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl text-amber-100 font-bold">
                          {player.name}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-red-950/80 border border-amber-500/20 rounded-full font-medium text-amber-300/80">
                          {player.title}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-8 text-sm mt-3 sm:mt-0 text-amber-200/80 w-full sm:w-auto justify-between sm:justify-end border-t border-amber-500/10 sm:border-0 pt-3 sm:pt-0">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400" />
                      <span>
                        Rating: <strong className="text-amber-200 font-extrabold">{player.score}</strong>
                      </span>
                    </div>
                    <div>
                      Wins: <strong className="text-amber-200 font-extrabold">{player.wins}</strong>
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
});

LeaderboardScreen.displayName = "LeaderboardScreen";
