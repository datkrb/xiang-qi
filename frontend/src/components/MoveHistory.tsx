import { useGame } from "../context/GameContext";

export function MoveHistory() {
  const { gameState } = useGame();

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <h3 className="font-bold text-amber-900 mb-3">Lịch sử nước đi</h3>

      {gameState.moveHistory.length === 0 ? (
        <p className="text-sm text-gray-600">Chưa có nước đi nào.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {gameState.moveHistory.map((move, idx) => (
            <div key={idx} className="text-sm text-gray-700 py-1 border-b pb-1">
              <span className="font-bold text-gray-800">{idx + 1}.</span> (
              {move.from.x},{move.from.y}) → ({move.to.x},{move.to.y})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
