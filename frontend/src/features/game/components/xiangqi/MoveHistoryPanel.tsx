import { pieceNames } from './constants';
import { MoveRecord } from './useXiangqiGame';

interface MoveHistoryPanelProps {
  moves: MoveRecord[];
  className?: string;
}

const fileLabel = (x: number) => String.fromCharCode(65 + x); // A..I
const rankLabel = (y: number) => `${y + 1}`;

export function MoveHistoryPanel({ moves, className = '' }: MoveHistoryPanelProps) {
  return (
    <div className={`glass-panel rounded-2xl p-4 shadow-xl border border-border ${className}`}>
      <h3 className="text-lg font-bold font-heading text-main mb-3">Lịch sử nước đi</h3>
      <div className="max-h-72 overflow-y-auto pr-1">
        {moves.length === 0 ? (
          <p className="text-sm text-muted">Chưa có nước đi nào.</p>
        ) : (
          <ol className="space-y-1 text-sm">
            {moves.map((m, i) => {
              const glyph = pieceNames[m.piece.type][m.piece.color];
              const from = `${fileLabel(m.from[0])}${rankLabel(m.from[1])}`;
              const to = `${fileLabel(m.to[0])}${rankLabel(m.to[1])}`;
              return (
                <li
                  key={i}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-xl hover:bg-surface-hover transition-colors text-main"
                >
                  <span className="text-muted font-bold w-8 text-right font-heading">{i + 1}.</span>
                  <span
                    className={`w-6 text-center font-bold text-lg ${
                      m.piece.color === 'red' ? 'text-danger' : 'text-main'
                    }`}
                    style={{ fontFamily: 'serif' }}
                  >
                    {glyph}
                  </span>
                  <span className="text-main/80 font-medium">
                    {from} → {to}
                  </span>
                  {m.captured && (
                    <span
                      className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${
                        m.captured.color === 'red'
                          ? 'text-danger border-danger/30 bg-danger/10'
                          : 'text-main border-border bg-surface-opaque'
                      }`}
                      style={{ fontFamily: 'serif' }}
                    >
                      ăn {pieceNames[m.captured.type][m.captured.color]}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
