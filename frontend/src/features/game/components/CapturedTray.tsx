import { pieceNames, Piece, PieceColor } from "@features/xiangqi";

interface CapturedTrayProps {
  pieces: Piece[];
  color: PieceColor;
  label?: string;
  className?: string;
}

export function CapturedTray({ pieces, color, label, className = '' }: CapturedTrayProps) {
  const colorClasses =
    color === 'red'
      ? 'bg-amber-50 text-red-700 border-red-700'
      : 'bg-amber-50 text-gray-900 border-gray-900';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {label && <span className="text-xs text-white/70 mr-1">{label}</span>}
      <div className="flex gap-1 flex-wrap">
        {pieces.length === 0 && <span className="text-xs text-white/50">—</span>}
        {pieces.map((p, i) => (
          <span
            key={`${p.type}-${i}`}
            className={`w-7 h-7 rounded-full border flex items-center justify-center font-bold ${colorClasses}`}
            style={{ fontSize: 14, fontFamily: 'serif', lineHeight: 1 }}
          >
            {pieceNames[p.type][p.color]}
          </span>
        ))}
      </div>
    </div>
  );
}
