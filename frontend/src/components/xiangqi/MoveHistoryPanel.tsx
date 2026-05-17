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
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-amber-200 ${className}`}>
      <h3 className="text-lg font-bold text-amber-900 mb-3">Lịch sử nước đi</h3>
      <div className="max-h-72 overflow-y-auto pr-1">
        {moves.length === 0 ? (
          <p className="text-sm text-amber-800/60">Chưa có nước đi nào.</p>
        ) : (
          <ol className="space-y-1 text-sm">
            {moves.map((m, i) => {
              const glyph = pieceNames[m.piece.type][m.piece.color];
              const from = `${fileLabel(m.from[0])}${rankLabel(m.from[1])}`;
              const to = `${fileLabel(m.to[0])}${rankLabel(m.to[1])}`;
              return (
                <li
                  key={i}
                  className="flex items-center gap-2 py-1 px-2 rounded hover:bg-amber-100/60"
                >
                  <span className="text-amber-700 w-8 text-right">{i + 1}.</span>
                  <span
                    className={`w-6 text-center font-bold ${
                      m.piece.color === 'red' ? 'text-red-700' : 'text-gray-900'
                    }`}
                    style={{ fontFamily: 'serif' }}
                  >
                    {glyph}
                  </span>
                  <span className="text-gray-700">
                    {from} → {to}
                  </span>
                  {m.captured && (
                    <span
                      className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${
                        m.captured.color === 'red'
                          ? 'text-red-700 border-red-700'
                          : 'text-gray-900 border-gray-900'
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
