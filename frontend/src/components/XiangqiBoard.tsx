import { GameConfig } from './GameModeScreen';
import { BoardGrid } from './xiangqi/BoardGrid';
import { Intersection } from './xiangqi/Intersection';
import { PieceView } from './xiangqi/PieceView';
import { TurnIndicator } from './xiangqi/TurnIndicator';
import { BOARD_H, BOARD_W, COLS, ROWS } from './xiangqi/constants';
import { XiangqiGame, useXiangqiGame } from './xiangqi/useXiangqiGame';

interface XiangqiBoardProps {
  config?: GameConfig;
  game?: XiangqiGame;
  onGameEnd?: (result: GameResult) => void;
  showTurnIndicator?: boolean;
}

export interface GameResult {
  winner: 'red' | 'black' | 'draw';
  reason: string;
  moves: number;
  duration: number;
}

export default function XiangqiBoard({ game: externalGame, showTurnIndicator = true }: XiangqiBoardProps) {
  const internalGame = useXiangqiGame();
  const game = externalGame ?? internalGame;
  const { pieces, selectedPiece, validMoves, currentTurn, isCheck, getPieceAt, handleClick } = game;

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative">
        <div
          className="relative rounded-lg shadow-2xl border-4 border-amber-900"
          style={{
            width: BOARD_W,
            height: BOARD_H,
            background: 'linear-gradient(180deg, #f3d9a4 0%, #e9c587 100%)',
          }}
        >
          <BoardGrid />

          {Array.from({ length: ROWS }).map((_, y) =>
            Array.from({ length: COLS }).map((_, x) => {
              const isValid = validMoves.some(([mx, my]) => mx === x && my === y);
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
            const selected = !!selectedPiece && selectedPiece[0] === x && selectedPiece[1] === y;
            const capturable = validMoves.some(([mx, my]) => mx === x && my === y);
            return (
              <PieceView
                key={`${p.color}-${p.type}-${x}-${y}`}
                piece={p}
                selected={selected}
                capturable={capturable}
                inCheck={isCheck}
                onClick={handleClick}
              />
            );
          })}
        </div>

        {showTurnIndicator && <TurnIndicator turn={currentTurn} />}
      </div>
    </div>
  );
}
