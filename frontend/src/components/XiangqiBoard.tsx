import React from "react";
import { BoardGrid } from "./xiangqi/BoardGrid";
import { Intersection } from "./xiangqi/Intersection";
import { PieceView } from "./xiangqi/PieceView";
import { TurnIndicator } from "./xiangqi/TurnIndicator";
import { BOARD_H, BOARD_W, COLS, ROWS } from "./xiangqi/constants";
import { XiangqiGame, useXiangqiGame } from "./xiangqi/useXiangqiGame";
import { PieceColor } from "./xiangqi/types";

interface XiangqiBoardProps {
  game?: XiangqiGame;
  showTurnIndicator?: boolean;
  /** Bên nào ở phía dưới bàn cờ (mặc định: 'red') */
  perspective?: PieceColor;
  /** Bên mà người chơi này điều khiển (cho online multiplayer) */
  playerColor?: PieceColor;
}

const XiangqiBoard: React.FC<XiangqiBoardProps> = React.memo(
  ({
    game: externalGame,
    showTurnIndicator = true,
    perspective = "red",
    playerColor,
  }) => {
    const internalGame = useXiangqiGame();
    const game = externalGame ?? internalGame;
    const {
      pieces,
      selectedPiece,
      validMoves,
      currentTurn,
      isCheck,
      getPieceAt,
      handleClick,
    } = game;

    // Khi perspective='black', lật bàn cờ 180° (Đen ở dưới)
    const flipped = perspective === "black";

    // Wrapper for handleClick: only allow moving own pieces (for multiplayer)
    const handleClickWithValidation = (x: number, y: number) => {
      if (playerColor) {
        const piece = getPieceAt(x, y);
        if (piece && piece.color !== playerColor && validMoves.length === 0) {
          return; // Can't select opponent's pieces
        }
      }
      handleClick(x, y);
    };

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
                    onClick={handleClickWithValidation}
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
                  onClick={handleClickWithValidation}
                  flipped={flipped}
                />
              );
            })}
          </div>

          {showTurnIndicator ? <TurnIndicator turn={currentTurn} /> : null}
        </div>
      </div>
    );
  }
);

XiangqiBoard.displayName = "XiangqiBoard";

export default XiangqiBoard;
