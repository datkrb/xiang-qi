import React from "react";
import { BookOpen, Compass, Shield, ArrowLeft } from "lucide-react";

interface TutorialScreenProps {
  onBack: () => void;
}

export const TutorialScreen: React.FC<TutorialScreenProps> = React.memo(({ onBack }) => {
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

        {/* Hero Section */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 border-border space-y-8">
          <div className="flex items-center gap-4 border-b border-border pb-6">
            <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold font-heading text-main tracking-tight">
                Xiangqi Guide
              </h1>
              <p className="text-muted text-sm md:text-base mt-1">
                Learn the rules, pieces, and strategies of Chinese Chess.
              </p>
            </div>
          </div>

          {/* Tutorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Board */}
            <div className="bg-surface/50 p-6 rounded-2xl border border-border space-y-3">
              <div className="flex items-center gap-3 text-main font-bold font-heading text-lg">
                <Compass className="w-5 h-5 text-primary" />
                <h2>The Battlefield (Bàn Cờ)</h2>
              </div>
              <p className="text-muted text-sm leading-relaxed">
                Xiangqi is played on a 9x10 grid. The board features two main regions:
              </p>
              <ul className="list-disc list-inside text-sm text-muted space-y-1">
                <li>
                  <strong className="text-main">The River (Sông):</strong> The central line dividing the board. Certain pieces cannot cross the river.
                </li>
                <li>
                  <strong className="text-main">The Palace (Cung):</strong> A 3x3 marked area on each side. The General and Advisors must never leave it.
                </li>
              </ul>
            </div>

            {/* Pieces Rules */}
            <div className="bg-surface/50 p-6 rounded-2xl border border-border space-y-3">
              <div className="flex items-center gap-3 text-main font-bold font-heading text-lg">
                <Shield className="w-5 h-5 text-primary" />
                <h2>Piece Movements</h2>
              </div>
              <p className="text-muted text-sm leading-relaxed">
                Every piece has unique movement laws based on ancient military:
              </p>
              <ul className="list-disc list-inside text-sm text-muted space-y-1">
                <li>
                  <strong className="text-main">General (Tướng):</strong> Moves 1 step orthogonally within the Palace.
                </li>
                <li>
                  <strong className="text-main">Chariot (Xe):</strong> Moves any distance orthogonally (like the Rook).
                </li>
                <li>
                  <strong className="text-main">Cannon (Pháo):</strong> Moves like a Chariot, but captures by jumping over exactly one piece.
                </li>
                <li>
                  <strong className="text-main">Horse (Mã):</strong> Moves in an L-shape (like the Knight), but can be blocked by adjacent pieces.
                </li>
              </ul>
            </div>
          </div>

          {/* Interactive Card */}
          <div className="bg-primary/10 p-6 rounded-2xl border border-primary/20 text-center space-y-4">
            <h3 className="text-xl font-bold font-heading text-main">Ready to play?</h3>
            <p className="text-sm text-muted max-w-lg mx-auto leading-relaxed">
              Start an Offline PvP match to practice with a friend or test your wits against the dynamic AI.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

TutorialScreen.displayName = "TutorialScreen";
