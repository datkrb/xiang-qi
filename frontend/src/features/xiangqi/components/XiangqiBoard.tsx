import React, { useCallback } from "react";
import { BoardGrid } from "./BoardGrid";
import { Intersection } from "./Intersection";
import { PieceView } from "./PieceView";
import { BOARD_H, BOARD_W, COLS, ROWS } from "../utils/constants";
import { Piece, PieceColor, Coord } from "../types";

export interface XiangqiBoardProps {
  pieces: Piece[];
  selectedPiece?: Coord | null;
  validMoves?: Coord[];
  isCheck?: boolean;
  /** Bên nào ở phía dưới bàn cờ (mặc định: 'red') */
  perspective?: PieceColor;
  onPointClick?: (x: number, y: number) => void;
}

const XiangqiBoard: React.FC<XiangqiBoardProps> = React.memo(
  ({
    pieces,
    selectedPiece = null,
    validMoves = [],
    isCheck = false,
    perspective = "red",
    onPointClick,
  }) => {
    // Khi perspective='black', lật bàn cờ 180° (Đen ở dưới)
    const flipped = perspective === "black";

    const getPieceAt = useCallback(
      (x: number, y: number) => pieces.find((p) => p.position[0] === x && p.position[1] === y) || null,
      [pieces]
    );

    const handleClick = useCallback(
      (x: number, y: number) => {
        if (onPointClick) {
          onPointClick(x, y);
        }
      },
      [onPointClick]
    );

    return (
      <div className="flex items-center justify-center p-4">
        <div className="relative select-none">
          {/* Bàn cờ gỗ cổ kính */}
          <div
            className="relative rounded-lg shadow-2xl border-4 border-amber-800"
            style={{
              width: BOARD_W,
              height: BOARD_H,
              background: "linear-gradient(180deg, #f3d9a4 0%, #e9c587 100%)",
              transform: flipped ? "rotate(180deg)" : undefined,
            }}
          >
            <BoardGrid />

            {Array.from({ length: ROWS }).map((_, y) =>
              Array.from({ length: COLS }).map((_, x) => {
                const isValid = validMoves.some(
                  ([mx, my]) => mx === x && my === y
                );
                const occupied = !!getPieceAt(x, y);
                return (
                  <Intersection
                    key={`hit-${x}-${y}`}
                    x={x}
                    y={y}
                    showDot={isValid && !occupied}
                    onClick={handleClick}
                  />
                );
              })
            )}

            {pieces.map((p) => {
              const [x, y] = p.position;
              const selected =
                !!selectedPiece &&
                selectedPiece[0] === x &&
                selectedPiece[1] === y;
              const capturable = validMoves.some(
                ([mx, my]) => mx === x && my === y
              );
              return (
                <PieceView
                  key={`${p.color}-${p.type}-${x}-${y}`}
                  piece={p}
                  selected={selected}
                  capturable={capturable}
                  inCheck={isCheck}
                  onClick={handleClick}
                  flipped={flipped}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

XiangqiBoard.displayName = "XiangqiBoard";

export default XiangqiBoard;
