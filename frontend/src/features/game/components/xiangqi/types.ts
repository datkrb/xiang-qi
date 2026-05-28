export type PieceType =
  | 'general'
  | 'advisor'
  | 'elephant'
  | 'horse'
  | 'chariot'
  | 'cannon'
  | 'soldier';

export type PieceColor = 'red' | 'black';

export type Coord = [number, number];

export interface Piece {
  type: PieceType;
  color: PieceColor;
  position: Coord;
}
