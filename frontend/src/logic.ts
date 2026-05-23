import { GameState, Piece, Position, Color, Move } from "./types";

export function initialBoard(): (Piece | null)[][] {
  const board: (Piece | null)[][] = Array(10)
    .fill(null)
    .map(() => Array(9).fill(null));

  // Red pieces (bottom)
  board[9][0] = { type: "chariot", color: "red", position: { x: 0, y: 9 } };
  board[9][1] = { type: "horse", color: "red", position: { x: 1, y: 9 } };
  board[9][2] = { type: "elephant", color: "red", position: { x: 2, y: 9 } };
  board[9][3] = { type: "advisor", color: "red", position: { x: 3, y: 9 } };
  board[9][4] = { type: "king", color: "red", position: { x: 4, y: 9 } };
  board[9][5] = { type: "advisor", color: "red", position: { x: 5, y: 9 } };
  board[9][6] = { type: "elephant", color: "red", position: { x: 6, y: 9 } };
  board[9][7] = { type: "horse", color: "red", position: { x: 7, y: 9 } };
  board[9][8] = { type: "chariot", color: "red", position: { x: 8, y: 9 } };
  board[7][1] = { type: "cannon", color: "red", position: { x: 1, y: 7 } };
  board[7][7] = { type: "cannon", color: "red", position: { x: 7, y: 7 } };
  board[6][0] = { type: "soldier", color: "red", position: { x: 0, y: 6 } };
  board[6][2] = { type: "soldier", color: "red", position: { x: 2, y: 6 } };
  board[6][4] = { type: "soldier", color: "red", position: { x: 4, y: 6 } };
  board[6][6] = { type: "soldier", color: "red", position: { x: 6, y: 6 } };
  board[6][8] = { type: "soldier", color: "red", position: { x: 8, y: 6 } };

  // Black pieces (top)
  board[0][0] = { type: "chariot", color: "black", position: { x: 0, y: 0 } };
  board[0][1] = { type: "horse", color: "black", position: { x: 1, y: 0 } };
  board[0][2] = { type: "elephant", color: "black", position: { x: 2, y: 0 } };
  board[0][3] = { type: "advisor", color: "black", position: { x: 3, y: 0 } };
  board[0][4] = { type: "king", color: "black", position: { x: 4, y: 0 } };
  board[0][5] = { type: "advisor", color: "black", position: { x: 5, y: 0 } };
  board[0][6] = { type: "elephant", color: "black", position: { x: 6, y: 0 } };
  board[0][7] = { type: "horse", color: "black", position: { x: 7, y: 0 } };
  board[0][8] = { type: "chariot", color: "black", position: { x: 8, y: 0 } };
  board[2][1] = { type: "cannon", color: "black", position: { x: 1, y: 2 } };
  board[2][7] = { type: "cannon", color: "black", position: { x: 7, y: 2 } };
  board[3][0] = { type: "soldier", color: "black", position: { x: 0, y: 3 } };
  board[3][2] = { type: "soldier", color: "black", position: { x: 2, y: 3 } };
  board[3][4] = { type: "soldier", color: "black", position: { x: 4, y: 3 } };
  board[3][6] = { type: "soldier", color: "black", position: { x: 6, y: 3 } };
  board[3][8] = { type: "soldier", color: "black", position: { x: 8, y: 3 } };

  return board;
}

export function isValidPosition(pos: Position): boolean {
  return pos.x >= 0 && pos.x < 9 && pos.y >= 0 && pos.y < 10;
}

export function getLegalMoves(
  board: (Piece | null)[][],
  position: Position,
): Position[] {
  const piece = board[position.y]?.[position.x];
  if (!piece) return [];

  const moves: Position[] = [];

  if (piece.type === "king") {
    // King moves 1 step within palace
    const palaceX = [3, 4, 5];
    const palaceY = piece.color === "red" ? [7, 8, 9] : [0, 1, 2];

    [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ].forEach(([dx, dy]) => {
      const newPos = { x: position.x + dx, y: position.y + dy };
      if (palaceX.includes(newPos.x) && palaceY.includes(newPos.y)) {
        if (
          !board[newPos.y][newPos.x] ||
          board[newPos.y][newPos.x]?.color !== piece.color
        ) {
          moves.push(newPos);
        }
      }
    });
  } else if (piece.type === "advisor") {
    // Advisor moves 1 step diagonally within palace
    const palaceX = [3, 4, 5];
    const palaceY = piece.color === "red" ? [7, 8, 9] : [0, 1, 2];

    [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ].forEach(([dx, dy]) => {
      const newPos = { x: position.x + dx, y: position.y + dy };
      if (palaceX.includes(newPos.x) && palaceY.includes(newPos.y)) {
        if (
          !board[newPos.y][newPos.x] ||
          board[newPos.y][newPos.x]?.color !== piece.color
        ) {
          moves.push(newPos);
        }
      }
    });
  }

  return moves;
}

export function applyMove(
  gameState: GameState,
  from: Position,
  to: Position,
): GameState {
  const newBoard = gameState.board.map((row) => [...row]);
  const piece = newBoard[from.y][from.x];

  if (!piece) return gameState;

  const newCapturedPieces = {
    red: [...gameState.capturedPieces.red],
    black: [...gameState.capturedPieces.black],
  };

  // Capture piece if exists
  if (newBoard[to.y][to.x]) {
    const captured = newBoard[to.y][to.x]!;
    newCapturedPieces[captured.color] = [
      ...newCapturedPieces[captured.color],
      captured,
    ];
  }

  const updatedPiece = {
    ...piece,
    position: to,
  };

  newBoard[to.y][to.x] = updatedPiece;
  newBoard[from.y][from.x] = null;

  return {
    ...gameState,
    board: newBoard,
    capturedPieces: newCapturedPieces,
    currentPlayer: gameState.currentPlayer === "red" ? "black" : "red",
    moveHistory: [...gameState.moveHistory, { from, to }],
  };
}

export function isInCheck(
  _board: (Piece | null)[][],
  _kingColor: Color,
): boolean {
  // Placeholder
  return false;
}

export function isCheckmate(_gameState: GameState, _kingColor: Color): boolean {
  // Placeholder
  return false;
}

export function evaluateBoard(_board: (Piece | null)[][]): number {
  // Placeholder AI evaluation
  return 0;
}

export function getAIMoveAdaptive(_gameState: GameState): Move | null {
  // Placeholder AI move generation
  return null;
}
