import { Piece, PieceColor, PieceType } from "@features/xiangqi";

/**
 * Xiangqi FEN encoding/decoding.
 *
 * FEN format: "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1"
 *
 * Piece letters (UCI standard for Xiangqi):
 *   Red (uppercase): R=Chariot, H=Horse, E=Elephant, A=Advisor, K=King/General, C=Cannon, P=Soldier
 *   Black (lowercase): r, h, e, a, k, c, p
 *
 * Board: 10 ranks (top=rank9 Black's side → bottom=rank0 Red's side), 9 files
 * Our internal coordinate: x=0..8 (file), y=0..9 (rank, y=0 is Red's back rank)
 * FEN rank order: rank 9 (y=9, top/Black) first → rank 0 (y=0, bottom/Red) last
 */

const PIECE_TO_FEN: Record<PieceType, { red: string; black: string }> = {
  chariot: { red: "R", black: "r" },
  horse: { red: "N", black: "n" }, // Standard Xiangqi FEN uses N for horse (like chess)
  elephant: { red: "B", black: "b" }, // Standard Xiangqi FEN uses B for elephant (like chess bishop)
  advisor: { red: "A", black: "a" },
  general: { red: "K", black: "k" },
  cannon: { red: "C", black: "c" },
  soldier: { red: "P", black: "p" },
};

const FEN_TO_PIECE: Record<string, { type: PieceType; color: PieceColor }> = {};
for (const [type, chars] of Object.entries(PIECE_TO_FEN)) {
  FEN_TO_PIECE[chars.red] = { type: type as PieceType, color: "red" };
  FEN_TO_PIECE[chars.black] = { type: type as PieceType, color: "black" };
}

/**
 * Encode Piece[] + current turn → FEN string.
 */
export function encodeFEN(
  pieces: Piece[],
  currentTurn: PieceColor,
  moveCount = 1,
): string {
  // Build 10x9 grid (y=0..9, x=0..8)
  const grid: (string | null)[][] = Array.from({ length: 10 }, () =>
    Array(9).fill(null),
  );

  for (const p of pieces) {
    const [x, y] = p.position;
    grid[y][x] = PIECE_TO_FEN[p.type][p.color];
  }

  // FEN ranks: y=9 (top, Black back rank) → y=0 (bottom, Red back rank)
  const ranks: string[] = [];
  for (let y = 9; y >= 0; y--) {
    let rank = "";
    let emptyCount = 0;
    for (let x = 0; x < 9; x++) {
      const cell = grid[y][x];
      if (cell) {
        if (emptyCount > 0) {
          rank += emptyCount;
          emptyCount = 0;
        }
        rank += cell;
      } else {
        emptyCount++;
      }
    }
    if (emptyCount > 0) rank += emptyCount;
    ranks.push(rank);
  }

  const activeColor = currentTurn === "red" ? "w" : "b";
  return `${ranks.join("/")} ${activeColor} - - 0 ${moveCount}`;
}

/**
 * Decode FEN string → { pieces, currentTurn }.
 */
export function decodeFEN(fen: string): {
  pieces: Piece[];
  currentTurn: PieceColor;
} {
  const parts = fen.split(" ");
  const rankStrings = parts[0].split("/");
  const currentTurn: PieceColor = parts[1] === "b" ? "black" : "red";

  const pieces: Piece[] = [];

  // FEN ranks: index 0 = y=9, index 9 = y=0
  for (let ri = 0; ri < rankStrings.length; ri++) {
    const y = 9 - ri;
    let x = 0;
    for (const ch of rankStrings[ri]) {
      if (ch >= "1" && ch <= "9") {
        x += parseInt(ch);
      } else {
        const info = FEN_TO_PIECE[ch];
        if (info) {
          pieces.push({ type: info.type, color: info.color, position: [x, y] });
        }
        x++;
      }
    }
  }

  return { pieces, currentTurn };
}

/**
 * Convert UCI move string (e.g. "e2e4", "a0a1") to [fromX, fromY, toX, toY].
 *
 * UCI notation for xiangqi: file (a-i) + rank (0-9)
 * file a=0, b=1, ..., i=8
 * rank 0=Red's back rank (our y=0), rank 9=Black's back rank (our y=9)
 */
export function parseUCIMove(
  uciMove: string,
): [number, number, number, number] {
  const fromFile = uciMove.charCodeAt(0) - 97; // 'a' = 0
  const fromRank = parseInt(uciMove[1]);
  const toFile = uciMove.charCodeAt(2) - 97;
  const toRank = parseInt(uciMove[3]);
  return [fromFile, fromRank, toFile, toRank];
}

/**
 * Convert board coordinates [fromX, fromY, toX, toY] → UCI move string.
 */
export function toUCIMove(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): string {
  return (
    String.fromCharCode(97 + fromX) +
    fromY +
    String.fromCharCode(97 + toX) +
    toY
  );
}

/** Starting FEN for Xiangqi */
export const STARTING_FEN =
  "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1";
