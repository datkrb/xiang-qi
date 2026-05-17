export type Color = "red" | "black";
export type PieceType =
  | "king"
  | "advisor"
  | "elephant"
  | "horse"
  | "chariot"
  | "cannon"
  | "soldier";

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  type: PieceType;
  color: Color;
  position: Position;
}

export interface Move {
  from: Position;
  to: Position;
}

export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: Color;
  selectedSquare: Position | null;
  legalMoves: Position[];
  moveHistory: Move[];
  capturedPieces: {
    red: Piece[];
    black: Piece[];
  };
  isGameOver: boolean;
  winner: Color | null;
}

export interface AIConfig {
  enabled: boolean;
  level: "easy" | "medium" | "hard";
  depth: number;
}
