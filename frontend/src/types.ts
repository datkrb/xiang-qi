// Type definitions for Xiangqi game

export type PieceType = "k" | "a" | "b" | "n" | "r" | "c" | "s";
export type Color = "red" | "black";
export type Position = [number, number];

export interface Piece {
  t: PieceType;
  c: Color;
}

export type Board = (Piece | null)[][];

export interface Move {
  from: Position;
  to: Position;
  captured?: Piece;
}

export interface GameState {
  board: Board;
  currentPlayer: Color;
  selectedPosition: Position | null;
  legalMoves: Position[];
  moveHistory: Move[];
  capturedPieces: {
    red: Piece[];
    black: Piece[];
  };
  gameStatus: "playing" | "checkmate" | "stalemate" | "draw";
  evaluation: number;
}

export interface AIConfig {
  skill: number;
  isEnabled: boolean;
}
