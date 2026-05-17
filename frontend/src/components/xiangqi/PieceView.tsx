import { PIECE, pieceNames, px, py } from './constants';
import { Piece } from './types';

interface PieceViewProps {
  piece: Piece;
  selected?: boolean;
  capturable?: boolean;
  inCheck?: boolean;
  onClick: (x: number, y: number) => void;
}

export function PieceView({ piece, selected, capturable, inCheck, onClick }: PieceViewProps) {
  const [x, y] = piece.position;
  const ring = selected
    ? 'ring-4 ring-blue-500'
    : capturable
    ? 'ring-4 ring-green-500'
    : inCheck && piece.type === 'general'
    ? 'ring-4 ring-yellow-400'
    : '';

  return (
    <button
      onClick={() => onClick(x, y)}
      className="absolute"
      style={{
        left: px(x) - PIECE / 2,
        top: py(y) - PIECE / 2,
        width: PIECE,
        height: PIECE,
        padding: 0,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
      }}
    >
      <span
        className={`flex items-center justify-center rounded-full shadow-lg select-none
          ${piece.color === 'red'
            ? 'bg-amber-50 text-red-700 border-2 border-red-700'
            : 'bg-amber-50 text-gray-900 border-2 border-gray-900'}
          ${ring}
        `}
        style={{
          width: PIECE,
          height: PIECE,
          fontSize: 28,
          fontWeight: 700,
          fontFamily: 'serif',
          lineHeight: 1,
        }}
      >
        {pieceNames[piece.type][piece.color]}
      </span>
    </button>
  );
}
