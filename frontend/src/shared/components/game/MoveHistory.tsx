import { useGame } from "@app/providers/GameProvider";

export function MoveHistory() {
  const { gameState } = useGame();

  return (
    <div className="glass-panel p-4 border-border shadow-lg">
      <h3 className="font-bold font-heading text-main mb-3">Lịch sử nước đi</h3>

      {gameState.moveHistory.length === 0 ? (
        <p className="text-sm text-muted">Chưa có nước đi nào.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {gameState.moveHistory.map((move, idx) => (
            <div key={idx} className="text-sm text-muted py-1 border-b border-border pb-1">
              <span className="font-bold text-main">{idx + 1}.</span> (
              {move.from.x},{move.from.y}) → ({move.to.x},{move.to.y})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
