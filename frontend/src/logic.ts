import { Board, Position, Piece, Color, PieceType } from "./types";

let winLossStats = { redWins: 0, blackWins: 0 };

export function initialBoard(): Board {
  const board: Board = Array.from({ length: 10 }, () => Array(9).fill(null));

  const redBackRow: Piece[] = ["r", "n", "b", "a", "k", "a", "b", "n", "r"].map(
    (t) => ({
      t: t as PieceType,
      c: "red",
    }),
  );
  const blackBackRow: Piece[] = [
    "r",
    "n",
    "b",
    "a",
    "k",
    "a",
    "b",
    "n",
    "r",
  ].map((t) => ({
    t: t as PieceType,
    c: "black",
  }));

  board[0] = blackBackRow;
  board[2][1] = board[2][7] = { t: "c", c: "black" };
  [0, 2, 4, 6, 8].forEach((c) => (board[3][c] = { t: "s", c: "black" }));

  board[9] = redBackRow;
  board[7][1] = board[7][7] = { t: "c", c: "red" };
  [0, 2, 4, 6, 8].forEach((c) => (board[6][c] = { t: "s", c: "red" }));

  return board;
}

export function applyMove(board: Board, from: Position, to: Position): Board {
  const newBoard = board.map((row) => row.slice());
  newBoard[to[0]][to[1]] = newBoard[from[0]][from[1]];
  newBoard[from[0]][from[1]] = null;
  return newBoard;
}

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < 10 && c >= 0 && c < 9;
}

function clearPath(board: Board, r1: number, r2: number, c: number): boolean {
  const min = Math.min(r1, r2);
  const max = Math.max(r1, r2);
  for (let i = min + 1; i < max; i++) {
    if (board[i][c]) return false;
  }
  return true;
}

export function getLegalMovesFiltered(
  board: Board,
  r: number,
  c: number,
): Position[] {
  const piece = board[r][c];
  if (!piece) return [];
  const { t, c: color } = piece;
  const enemy: Color = color === "red" ? "black" : "red";
  const moves: Position[] = [];

  switch (t) {
    case "k": {
      const range = color === "red" ? [7, 9] : [0, 2];
      [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].forEach(([dr, dc]) => {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= range[0] && nr <= range[1] && nc >= 3 && nc <= 5) {
          const target = board[nr][nc];
          if (!target || target.c === enemy) moves.push([nr, nc]);
        }
      });
      // flying general (face-to-face)
      for (let i = r + 1; i < 10; i++) {
        const p = board[i][c];
        if (p) {
          if (p.t === "k" && p.c !== color && clearPath(board, r, i, c))
            moves.push([i, c]);
          break;
        }
      }
      for (let i = r - 1; i >= 0; i--) {
        const p = board[i][c];
        if (p) {
          if (p.t === "k" && p.c !== color && clearPath(board, i, r, c))
            moves.push([i, c]);
          break;
        }
      }
      break;
    }
    case "a": {
      const range = color === "red" ? [7, 9] : [0, 2];
      [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
      ].forEach(([dr, dc]) => {
        const nr = r + dr,
          nc = c + dc;
        if (nr >= range[0] && nr <= range[1] && nc >= 3 && nc <= 5) {
          const target = board[nr][nc];
          if (!target || target.c === enemy) moves.push([nr, nc]);
        }
      });
      break;
    }
    case "b": {
      [
        [2, 2],
        [2, -2],
        [-2, 2],
        [-2, -2],
      ].forEach(([dr, dc]) => {
        const mr = r + dr / 2,
          mc = c + dc / 2;
        const nr = r + dr,
          nc = c + dc;
        if (inBounds(nr, nc) && board[Math.floor(mr)][Math.floor(mc)] == null) {
          if ((color === "red" && nr >= 5) || (color === "black" && nr <= 4)) {
            const target = board[nr][nc];
            if (!target || target.c === enemy) moves.push([nr, nc]);
          }
        }
      });
      break;
    }
    case "n": {
      [
        [1, 2],
        [1, -2],
        [-1, 2],
        [-1, -2],
        [2, 1],
        [2, -1],
        [-2, 1],
        [-2, -1],
      ].forEach(([dr, dc]) => {
        const mx = r + dr / 2,
          my = c + dc / 2;
        const nr = r + dr,
          nc = c + dc;
        if (inBounds(nr, nc) && board[Math.floor(mx)][Math.floor(my)] == null) {
          const target = board[nr][nc];
          if (!target || target.c === enemy) moves.push([nr, nc]);
        }
      });
      break;
    }
    case "r": {
      for (let nr = r + 1; nr < 10; nr++) {
        const target = board[nr][c];
        if (!target) moves.push([nr, c]);
        else {
          if (target.c === enemy) moves.push([nr, c]);
          break;
        }
      }
      for (let nr = r - 1; nr >= 0; nr--) {
        const target = board[nr][c];
        if (!target) moves.push([nr, c]);
        else {
          if (target.c === enemy) moves.push([nr, c]);
          break;
        }
      }
      for (let nc = c + 1; nc < 9; nc++) {
        const target = board[r][nc];
        if (!target) moves.push([r, nc]);
        else {
          if (target.c === enemy) moves.push([r, nc]);
          break;
        }
      }
      for (let nc = c - 1; nc >= 0; nc--) {
        const target = board[r][nc];
        if (!target) moves.push([r, nc]);
        else {
          if (target.c === enemy) moves.push([r, nc]);
          break;
        }
      }
      break;
    }
    case "c": {
      const tryJump = (nr: number, nc: number) => {
        if (!inBounds(nr, nc)) return;
        let captureCount = 0;
        for (let sr = Math.min(r, nr) + 1; sr < Math.max(r, nr); sr++) {
          if (r !== nr && board[sr][c]) captureCount++;
        }
        for (let sc = Math.min(c, nc) + 1; sc < Math.max(c, nc); sc++) {
          if (c !== nc && board[r][sc]) captureCount++;
        }
        if (captureCount <= 1) {
          const target = board[nr][nc];
          if (!target || target.c === enemy) moves.push([nr, nc]);
        }
      };
      for (let nr = r + 1; nr < 10; nr++) {
        const target = board[nr][c];
        if (!target) moves.push([nr, c]);
        else {
          tryJump(nr + 1, c);
          break;
        }
      }
      for (let nr = r - 1; nr >= 0; nr--) {
        const target = board[nr][c];
        if (!target) moves.push([nr, c]);
        else {
          tryJump(nr - 1, c);
          break;
        }
      }
      for (let nc = c + 1; nc < 9; nc++) {
        const target = board[r][nc];
        if (!target) moves.push([r, nc]);
        else {
          tryJump(r, nc + 1);
          break;
        }
      }
      for (let nc = c - 1; nc >= 0; nc--) {
        const target = board[r][nc];
        if (!target) moves.push([r, nc]);
        else {
          tryJump(r, nc - 1);
          break;
        }
      }
      break;
    }
    case "s": {
      [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].forEach(([dr, dc]) => {
        const nr = r + dr,
          nc = c + dc;
        if (
          nr >= 0 &&
          nr < 10 &&
          nc >= 0 &&
          nc < 9 &&
          (nr < 3 || nr > 6 || (nc >= 3 && nc <= 5))
        ) {
          const target = board[nr][nc];
          if (!target || target.c === enemy) moves.push([nr, nc]);
        }
      });
      break;
    }
  }

  return moves;
}

export function findKing(board: Board, color: Color): Position | null {
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.t === "k" && piece.c === color) return [r, c];
    }
  }
  return null;
}

export function isInCheck(board: Board, color: Color): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const enemy: Color = color === "red" ? "black" : "red";
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.c === enemy) {
        const moves = getLegalMovesFiltered(board, r, c);
        if (moves.some((m) => m[0] === kingPos[0] && m[1] === kingPos[1]))
          return true;
      }
    }
  }
  return false;
}

export function hasAnyLegalMoves(board: Board, color: Color): boolean {
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.c === color) {
        const moves = getLegalMovesFiltered(board, r, c);
        for (const [nr, nc] of moves) {
          const testBoard = applyMove(board, [r, c], [nr, nc]);
          if (!isInCheck(testBoard, color)) return true;
        }
      }
    }
  }
  return false;
}

export function isCheckmate(board: Board, color: Color): boolean {
  return isInCheck(board, color) && !hasAnyLegalMoves(board, color);
}

export function isStalemate(board: Board, color: Color): boolean {
  return !isInCheck(board, color) && !hasAnyLegalMoves(board, color);
}

export function evaluateBoard(board: Board): number {
  const pieceValues: Record<PieceType, number> = {
    k: 0,
    a: 2,
    b: 3,
    n: 3,
    r: 5,
    c: 4,
    s: 2,
  };
  let score = 0;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece) {
        const value = pieceValues[piece.t];
        score += piece.c === "red" ? value : -value;
      }
    }
  }
  return score;
}

export function getWinLossStats() {
  return { redWins: winLossStats.redWins, blackWins: winLossStats.blackWins };
}

export function recordWin(color: Color) {
  if (color === "red") winLossStats.redWins++;
  else winLossStats.blackWins++;
}

// Simple AI that picks a random legal move
export function getAIMoveAdaptive(
  board: Board,
  color: Color,
  skill: number = 3,
): Position[] | null {
  const moves: Array<[Position, Position]> = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.c === color) {
        const legalMoves = getLegalMovesFiltered(board, r, c);
        for (const to of legalMoves) {
          const testBoard = applyMove(board, [r, c], to);
          if (!isInCheck(testBoard, color)) {
            moves.push([[r, c], to]);
          }
        }
      }
    }
  }
  if (moves.length === 0) return null;
  const randomMove = moves[Math.floor(Math.random() * moves.length)];
  return randomMove;
}
