/**
 * Web Worker script cho Xiangqi AI Engine.
 *
 * Hỗ trợ 2 mode:
 * 1. WASM engine (Pikafish/Fairy-Stockfish) — nếu có file .wasm
 * 2. Built-in JS engine (minimax + alpha-beta) — fallback khi không có WASM
 *
 * Giao tiếp qua postMessage:
 *   Main → Worker: { type: 'init' | 'search' | 'stop' | 'quit', ... }
 *   Worker → Main: { type: 'ready' | 'bestmove' | 'info' | 'error', ... }
 */

// ============================================================
// Built-in Minimax Engine (Fallback khi không có WASM)
// ============================================================

interface SimplePiece {
  type: string;
  color: 'red' | 'black';
  x: number;
  y: number;
}

// Điểm giá trị từng quân
const PIECE_VALUES: Record<string, number> = {
  general: 10000,
  chariot: 900,
  cannon: 450,
  horse: 400,
  elephant: 200,
  advisor: 200,
  soldier: 100,
};

// Bonus khi Tốt đã qua sông
const SOLDIER_CROSSED_BONUS = 80;

// Position bonus tables (simplified) — khuyến khích quân kiểm soát trung tâm
const CENTER_BONUS: Record<string, number[][]> = {
  chariot: generateCenterTable(10, 5),
  cannon: generateCenterTable(8, 3),
  horse: generateCenterTable(12, 4),
};

function generateCenterTable(maxBonus: number, spread: number): number[][] {
  const table: number[][] = [];
  for (let y = 0; y < 10; y++) {
    const row: number[] = [];
    for (let x = 0; x < 9; x++) {
      const dx = Math.abs(x - 4);
      const dy = Math.abs(y - 4.5);
      const dist = Math.sqrt(dx * dx + dy * dy);
      row.push(Math.max(0, Math.round(maxBonus * (1 - dist / (spread + 3)))));
    }
    table.push(row);
  }
  return table;
}

function inBoard(x: number, y: number): boolean {
  return x >= 0 && x < 9 && y >= 0 && y < 10;
}

function getPieceAt(pieces: SimplePiece[], x: number, y: number): SimplePiece | null {
  return pieces.find((p) => p.x === x && p.y === y) || null;
}

function generateMoves(pieces: SimplePiece[], color: 'red' | 'black'): { piece: SimplePiece; tx: number; ty: number }[] {
  const moves: { piece: SimplePiece; tx: number; ty: number }[] = [];
  const myPieces = pieces.filter((p) => p.color === color);

  for (const piece of myPieces) {
    const { type, x, y } = piece;

    switch (type) {
      case 'general': {
        const pyMin = color === 'red' ? 0 : 7;
        const pyMax = color === 'red' ? 2 : 9;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 3 && nx <= 5 && ny >= pyMin && ny <= pyMax) {
            const t = getPieceAt(pieces, nx, ny);
            if (!t || t.color !== color) moves.push({ piece, tx: nx, ty: ny });
          }
        }
        break;
      }
      case 'advisor': {
        const pyMin = color === 'red' ? 0 : 7;
        const pyMax = color === 'red' ? 2 : 9;
        for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 3 && nx <= 5 && ny >= pyMin && ny <= pyMax) {
            const t = getPieceAt(pieces, nx, ny);
            if (!t || t.color !== color) moves.push({ piece, tx: nx, ty: ny });
          }
        }
        break;
      }
      case 'elephant': {
        const yMin = color === 'red' ? 0 : 5;
        const yMax = color === 'red' ? 4 : 9;
        for (const [dx, dy] of [[2, 2], [2, -2], [-2, 2], [-2, -2]]) {
          const nx = x + dx, ny = y + dy;
          if (!inBoard(nx, ny) || ny < yMin || ny > yMax) continue;
          if (getPieceAt(pieces, x + dx / 2, y + dy / 2)) continue;
          const t = getPieceAt(pieces, nx, ny);
          if (!t || t.color !== color) moves.push({ piece, tx: nx, ty: ny });
        }
        break;
      }
      case 'horse': {
        const jumps: [number, number, number, number][] = [
          [0, 1, -1, 2], [0, 1, 1, 2], [0, -1, -1, -2], [0, -1, 1, -2],
          [1, 0, 2, 1], [1, 0, 2, -1], [-1, 0, -2, 1], [-1, 0, -2, -1],
        ];
        for (const [bx, by, dx, dy] of jumps) {
          if (getPieceAt(pieces, x + bx, y + by)) continue;
          const nx = x + dx, ny = y + dy;
          if (!inBoard(nx, ny)) continue;
          const t = getPieceAt(pieces, nx, ny);
          if (!t || t.color !== color) moves.push({ piece, tx: nx, ty: ny });
        }
        break;
      }
      case 'chariot': {
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          let nx = x + dx, ny = y + dy;
          while (inBoard(nx, ny)) {
            const t = getPieceAt(pieces, nx, ny);
            if (!t) { moves.push({ piece, tx: nx, ty: ny }); }
            else { if (t.color !== color) moves.push({ piece, tx: nx, ty: ny }); break; }
            nx += dx; ny += dy;
          }
        }
        break;
      }
      case 'cannon': {
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          let nx = x + dx, ny = y + dy;
          let foundMount = false;
          while (inBoard(nx, ny)) {
            const t = getPieceAt(pieces, nx, ny);
            if (!foundMount) {
              if (!t) moves.push({ piece, tx: nx, ty: ny });
              else foundMount = true;
            } else {
              if (t) { if (t.color !== color) moves.push({ piece, tx: nx, ty: ny }); break; }
            }
            nx += dx; ny += dy;
          }
        }
        break;
      }
      case 'soldier': {
        const fwd = color === 'red' ? 1 : -1;
        const ny = y + fwd;
        if (inBoard(x, ny)) {
          const t = getPieceAt(pieces, x, ny);
          if (!t || t.color !== color) moves.push({ piece, tx: x, ty: ny });
        }
        const crossed = (color === 'red' && y >= 5) || (color === 'black' && y <= 4);
        if (crossed) {
          for (const dx of [-1, 1]) {
            const nx = x + dx;
            if (inBoard(nx, y)) {
              const t = getPieceAt(pieces, nx, y);
              if (!t || t.color !== color) moves.push({ piece, tx: nx, ty: y });
            }
          }
        }
        break;
      }
    }
  }

  return moves;
}

function evaluate(pieces: SimplePiece[], aiColor: 'red' | 'black'): number {
  let score = 0;
  for (const p of pieces) {
    let value = PIECE_VALUES[p.type] || 0;

    // Soldier bonus khi qua sông
    if (p.type === 'soldier') {
      const crossed = (p.color === 'red' && p.y >= 5) || (p.color === 'black' && p.y <= 4);
      if (crossed) value += SOLDIER_CROSSED_BONUS;
    }

    // Position bonus
    const table = CENTER_BONUS[p.type];
    if (table) {
      value += table[p.y][p.x];
    }

    score += p.color === aiColor ? value : -value;
  }
  return score;
}

function applyMove(pieces: SimplePiece[], piece: SimplePiece, tx: number, ty: number): SimplePiece[] {
  return pieces
    .filter((p) => !(p.x === piece.x && p.y === piece.y) && !(p.x === tx && p.y === ty))
    .concat([{ ...piece, x: tx, y: ty }]);
}

function minimax(
  pieces: SimplePiece[],
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  aiColor: 'red' | 'black'
): number {
  if (depth === 0) return evaluate(pieces, aiColor);

  const color = isMaximizing ? aiColor : (aiColor === 'red' ? 'black' : 'red');
  const moves = generateMoves(pieces, color);

  if (moves.length === 0) return isMaximizing ? -99999 : 99999;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const m of moves) {
      const newPieces = applyMove(pieces, m.piece, m.tx, m.ty);
      const evalScore = minimax(newPieces, depth - 1, alpha, beta, false, aiColor);
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const m of moves) {
      const newPieces = applyMove(pieces, m.piece, m.tx, m.ty);
      const evalScore = minimax(newPieces, depth - 1, alpha, beta, true, aiColor);
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

/**
 * Tìm nước đi tốt nhất cho AI.
 *
 * @param piecesData - Array of { type, color, x, y }
 * @param aiColor - Màu của AI
 * @param depth - Độ sâu tìm kiếm (2=easy, 3=medium, 4=hard)
 * @returns { fromX, fromY, toX, toY } hoặc null
 */
function findBestMove(
  piecesData: SimplePiece[],
  aiColor: 'red' | 'black',
  depth: number
): { fromX: number; fromY: number; toX: number; toY: number } | null {
  const moves = generateMoves(piecesData, aiColor);
  if (moves.length === 0) return null;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  // Move ordering: ưu tiên ăn quân có giá trị cao
  moves.sort((a, b) => {
    const capturedA = getPieceAt(piecesData, a.tx, a.ty);
    const capturedB = getPieceAt(piecesData, b.tx, b.ty);
    const valA = capturedA ? (PIECE_VALUES[capturedA.type] || 0) : 0;
    const valB = capturedB ? (PIECE_VALUES[capturedB.type] || 0) : 0;
    return valB - valA;
  });

  for (const m of moves) {
    const newPieces = applyMove(piecesData, m.piece, m.tx, m.ty);
    const score = minimax(newPieces, depth - 1, -Infinity, Infinity, false, aiColor);
    if (score > bestScore) {
      bestScore = score;
      bestMove = m;
    }
  }

  return {
    fromX: bestMove.piece.x,
    fromY: bestMove.piece.y,
    toX: bestMove.tx,
    toY: bestMove.ty,
  };
}

// ============================================================
// Worker Message Handler
// ============================================================

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'init':
      self.postMessage({ type: 'ready', payload: { engine: 'builtin-minimax' } });
      break;

    case 'search': {
      const { pieces, aiColor, difficulty } = payload;
      const depthMap: Record<string, number> = {
        easy: 2,
        medium: 3,
        hard: 4,
        expert: 4,
      };
      const depth = depthMap[difficulty] || 3;

      // Convert Piece[] from main thread to SimplePiece[]
      const simplePieces: SimplePiece[] = pieces.map((p: { type: string; color: string; position: [number, number] }) => ({
        type: p.type,
        color: p.color as 'red' | 'black',
        x: p.position[0],
        y: p.position[1],
      }));

      const result = findBestMove(simplePieces, aiColor, depth);

      if (result) {
        self.postMessage({
          type: 'bestmove',
          payload: result,
        });
      } else {
        self.postMessage({
          type: 'error',
          payload: { message: 'No valid moves found' },
        });
      }
      break;
    }

    case 'stop':
    case 'quit':
      break;
  }
};
