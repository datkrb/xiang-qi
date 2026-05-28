import { PieceColor } from "@features/xiangqi";

export function TurnIndicator({ turn }: { turn: PieceColor }) {
  return (
    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-100 px-6 py-2 rounded-full shadow-lg border-2 border-amber-900">
      <span className="font-bold">
        Lượt:{' '}
        <span className={turn === 'red' ? 'text-red-700' : 'text-gray-900'}>
          {turn === 'red' ? 'Đỏ' : 'Đen'}
        </span>
      </span>
    </div>
  );
}
