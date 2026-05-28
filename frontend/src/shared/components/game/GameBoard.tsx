import { useMemo } from "react";
import { useGame } from "@app/providers/GameProvider";
import { Piece } from "@shared/types/game";

const PIECE_SYMBOLS: Record<string, string> = {
  chariot_red: "俥",
  chariot_black: "車",
  horse_red: "馬",
  horse_black: "馬",
  elephant_red: "相",
  elephant_black: "象",
  advisor_red: "仕",
  advisor_black: "士",
  king_red: "帥",
  king_black: "將",
  cannon_red: "砲",
  cannon_black: "炮",
  soldier_red: "兵",
  soldier_black: "卒",
};

const getPieceSymbol = (piece: Piece | null): string => {
  if (!piece) return "";
  const key = `${piece.type}_${piece.color}`;
  return PIECE_SYMBOLS[key] || "";
};

export function GameBoard() {
  const { gameState, selectedSquare, handleSquareClick } = useGame();

  // Memoize board rendering to prevent unnecessary re-renders
  const boardGrid = useMemo(() => {
    return gameState.board.map((row, y) =>
      row.map((piece, x) => (
        <div
          key={`${x}-${y}`}
          onClick={() => handleSquareClick({ x, y })}
          className={`
            relative aspect-square flex items-center justify-center cursor-pointer
            transition-all duration-200
            ${
              selectedSquare?.x === x && selectedSquare?.y === y
                ? "ring-4 ring-yellow-400"
                : "hover:ring-2 hover:ring-yellow-300"
            }
          `}
        >
          {piece && (
            <button
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-[22px] font-bold
                leading-none select-none border transition-all hover:scale-110
                ${
                  piece.color === "red"
                    ? "bg-danger/20 border-danger/40 text-danger shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                    : "bg-surface-opaque border-border text-main shadow-md"
                }
              `}
              style={{
                fontFamily:
                  '"Noto Serif SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", serif',
                lineHeight: 1,
                writingMode: "horizontal-tb",
                textOrientation: "mixed",
              }}
            >
              {getPieceSymbol(piece)}
            </button>
          )}
        </div>
      )),
    );
  }, [gameState.board, selectedSquare, handleSquareClick]);

  return (
    <div className="glass-panel p-4 shadow-2xl border-border">
      <div className="relative bg-surface/50 border border-border rounded-lg p-4">
        <div className="relative aspect-[9/10]">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 8 9"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <rect
              x={0}
              y={0}
              width={8}
              height={9}
              fill="none"
              stroke="#8B6F47"
              strokeWidth={0.08}
            />
            {Array.from({ length: 9 }, (_, index) => (
              <g key={`v-${index}`}>
                <line
                  x1={index}
                  y1={0}
                  x2={index}
                  y2={4}
                  stroke="#8B6F47"
                  strokeWidth={0.05}
                />
                <line
                  x1={index}
                  y1={5}
                  x2={index}
                  y2={9}
                  stroke="#8B6F47"
                  strokeWidth={0.05}
                />
              </g>
            ))}
            {Array.from({ length: 10 }, (_, index) => (
              <line
                key={`h-${index}`}
                x1={0}
                y1={index}
                x2={8}
                y2={index}
                stroke="#8B6F47"
                strokeWidth={0.05}
              />
            ))}
            <line
              x1={3}
              y1={0}
              x2={5}
              y2={2}
              stroke="#8B6F47"
              strokeWidth={0.05}
            />
            <line
              x1={5}
              y1={0}
              x2={3}
              y2={2}
              stroke="#8B6F47"
              strokeWidth={0.05}
            />
            <line
              x1={3}
              y1={7}
              x2={5}
              y2={9}
              stroke="#8B6F47"
              strokeWidth={0.05}
            />
            <line
              x1={5}
              y1={7}
              x2={3}
              y2={9}
              stroke="#8B6F47"
              strokeWidth={0.05}
            />
          </svg>

          <div className="absolute inset-0 grid grid-cols-9 grid-rows-10">
            {boardGrid}
          </div>

          <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-900 font-bold text-xl opacity-40 pointer-events-none">
            楚河
          </div>
          <div className="absolute left-3/4 top-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-900 font-bold text-xl opacity-40 pointer-events-none">
            漢界
          </div>
        </div>
      </div>
    </div>
  );
}
