import React from "react";
import { BookOpen, Compass, Shield, ArrowLeft } from "lucide-react";

interface TutorialScreenProps {
  onBack: () => void;
}

export const TutorialScreen: React.FC<TutorialScreenProps> = React.memo(({ onBack }) => {
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

        {/* Hero Section */}
        <div className="bg-red-900/30 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-amber-500/20 shadow-2xl space-y-8">
          <div className="flex items-center gap-4 border-b border-amber-500/20 pb-6">
            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/30">
              <BookOpen className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-amber-200 tracking-tight">
                Xiangqi Guide
              </h1>
              <p className="text-amber-200/70 text-sm md:text-base mt-1">
                Learn the rules, pieces, and strategies of Chinese Chess.
              </p>
            </div>
          </div>

          {/* Tutorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Board */}
            <div className="bg-red-950/40 p-6 rounded-2xl border border-amber-500/10 space-y-3">
              <div className="flex items-center gap-3 text-amber-300 font-bold text-lg">
                <Compass className="w-5 h-5 text-amber-400" />
                <h2>The Battlefield (Bàn Cờ)</h2>
              </div>
              <p className="text-amber-100/80 text-sm leading-relaxed">
                Xiangqi is played on a 9x10 grid. The board features two main regions:
              </p>
              <ul className="list-disc list-inside text-sm text-amber-200/70 space-y-1">
                <li>
                  <strong className="text-amber-200">The River (Sông):</strong> The central line dividing the board. Certain pieces cannot cross the river.
                </li>
                <li>
                  <strong className="text-amber-200">The Palace (Cung):</strong> A 3x3 marked area on each side. The General and Advisors must never leave it.
                </li>
              </ul>
            </div>

            {/* Pieces Rules */}
            <div className="bg-red-950/40 p-6 rounded-2xl border border-amber-500/10 space-y-3">
              <div className="flex items-center gap-3 text-amber-300 font-bold text-lg">
                <Shield className="w-5 h-5 text-amber-400" />
                <h2>Piece Movements</h2>
              </div>
              <p className="text-amber-100/80 text-sm leading-relaxed">
                Every piece has unique movement laws based on ancient military:
              </p>
              <ul className="list-disc list-inside text-sm text-amber-200/70 space-y-1">
                <li>
                  <strong className="text-amber-200">General (Tướng):</strong> Moves 1 step orthogonally within the Palace.
                </li>
                <li>
                  <strong className="text-amber-200">Chariot (Xe):</strong> Moves any distance orthogonally (like the Rook).
                </li>
                <li>
                  <strong className="text-amber-200">Cannon (Pháo):</strong> Moves like a Chariot, but captures by jumping over exactly one piece.
                </li>
                <li>
                  <strong className="text-amber-200">Horse (Mã):</strong> Moves in an L-shape (like the Knight), but can be blocked by adjacent pieces.
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive Card */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-6 rounded-2xl border border-amber-400/20 text-center space-y-4">
            <h3 className="text-xl font-bold text-amber-300">Ready to play?</h3>
            <p className="text-sm text-amber-100/80 max-w-lg mx-auto leading-relaxed">
              Start an Offline PvP match to practice with a friend or test your wits against the dynamic AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

TutorialScreen.displayName = "TutorialScreen";
