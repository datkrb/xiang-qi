import { Coord, Piece, PieceColor } from '@features/xiangqi';

export type GetPieceAt = (x: number, y: number) => Piece | null;

/**
 * Kiểm tra tọa độ có nằm trong bàn cờ không (9 cột x 10 hàng).
 */
function inBoard(x: number, y: number): boolean {
  return x >= 0 && x < 9 && y >= 0 && y < 10;
}

/**
 * Tính các nước đi hợp lệ cho Tướng/Soái (General/King).
 * - Di chuyển 1 ô theo 4 hướng (lên, xuống, trái, phải)
 * - Chỉ ở trong cung (3-5, 0-2 cho Đỏ | 3-5, 7-9 cho Đen)
 * - Thêm rule "đối mặt Tướng": có thể ăn Tướng đối phương nếu
 *   cùng cột và không có quân nào chắn giữa
 */
function generalMoves(piece: Piece, x: number, y: number, getPieceAt: GetPieceAt): Coord[] {
  const moves: Coord[] = [];
  const palaceYMin = piece.color === 'red' ? 0 : 7;
  const palaceYMax = piece.color === 'red' ? 2 : 9;

  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 3 && nx <= 5 && ny >= palaceYMin && ny <= palaceYMax) {
      const t = getPieceAt(nx, ny);
      if (!t || t.color !== piece.color) moves.push([nx, ny]);
    }
  }

  // Flying General: ăn Tướng đối phương nếu đối mặt trực tiếp (cùng cột, không quân chắn)
  const oppDir = piece.color === 'red' ? 1 : -1;
  let scanY = y + oppDir;
  while (inBoard(x, scanY)) {
    const t = getPieceAt(x, scanY);
    if (t) {
      if (t.type === 'general' && t.color !== piece.color) {
        moves.push([x, scanY]);
      }
      break;
    }
    scanY += oppDir;
  }

  return moves;
}

/**
 * Tính các nước đi hợp lệ cho Sĩ (Advisor).
 * - Di chuyển 1 ô theo đường chéo
 * - Chỉ ở trong cung
 */
function advisorMoves(piece: Piece, x: number, y: number, getPieceAt: GetPieceAt): Coord[] {
  const moves: Coord[] = [];
  const palaceYMin = piece.color === 'red' ? 0 : 7;
  const palaceYMax = piece.color === 'red' ? 2 : 9;

  for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 3 && nx <= 5 && ny >= palaceYMin && ny <= palaceYMax) {
      const t = getPieceAt(nx, ny);
      if (!t || t.color !== piece.color) moves.push([nx, ny]);
    }
  }

  return moves;
}

/**
 * Tính các nước đi hợp lệ cho Tượng/Tướng (Elephant).
 * - Di chuyển 2 ô theo đường chéo (hình chữ "田")
 * - Không được qua sông (Đỏ: y 0-4 | Đen: y 5-9)
 * - Bị chặn nếu có quân ở "mắt tượng" (ô chéo giữa)
 */
function elephantMoves(piece: Piece, x: number, y: number, getPieceAt: GetPieceAt): Coord[] {
  const moves: Coord[] = [];
  const yMin = piece.color === 'red' ? 0 : 5;
  const yMax = piece.color === 'red' ? 4 : 9;

  for (const [dx, dy] of [[2, 2], [2, -2], [-2, 2], [-2, -2]]) {
    const nx = x + dx;
    const ny = y + dy;
    // Ô "mắt tượng" (blocking eye)
    const blockX = x + dx / 2;
    const blockY = y + dy / 2;

    if (!inBoard(nx, ny)) continue;
    if (ny < yMin || ny > yMax) continue; // không qua sông
    if (getPieceAt(blockX, blockY)) continue; // bị chặn mắt

    const t = getPieceAt(nx, ny);
    if (!t || t.color !== piece.color) moves.push([nx, ny]);
  }

  return moves;
}

/**
 * Tính các nước đi hợp lệ cho Mã (Horse/Knight).
 * - Di chuyển theo hình chữ "日" (1 ô thẳng + 1 ô chéo)
 * - Bị chặn nếu có quân ở ô liền kề theo hướng đi thẳng ("cản mã")
 */
function horseMoves(piece: Piece, x: number, y: number, getPieceAt: GetPieceAt): Coord[] {
  const moves: Coord[] = [];

  // [dx_straight, dy_straight, dx_final, dy_final]
  // Mã đi 1 bước thẳng rồi 1 bước chéo
  const jumps: [number, number, number, number][] = [
    // Đi lên (dy=+1), rồi chéo trái/phải
    [0, 1, -1, 2],
    [0, 1, 1, 2],
    // Đi xuống (dy=-1), rồi chéo trái/phải
    [0, -1, -1, -2],
    [0, -1, 1, -2],
    // Đi phải (dx=+1), rồi chéo lên/xuống
    [1, 0, 2, 1],
    [1, 0, 2, -1],
    // Đi trái (dx=-1), rồi chéo lên/xuống
    [-1, 0, -2, 1],
    [-1, 0, -2, -1],
  ];

  for (const [bx, by, dx, dy] of jumps) {
    // Kiểm tra "cản mã" ở ô liền kề
    const blockX = x + bx;
    const blockY = y + by;
    if (getPieceAt(blockX, blockY)) continue;

    const nx = x + dx;
    const ny = y + dy;
    if (!inBoard(nx, ny)) continue;

    const t = getPieceAt(nx, ny);
    if (!t || t.color !== piece.color) moves.push([nx, ny]);
  }

  return moves;
}

/**
 * Tính các nước đi hợp lệ cho Xe (Chariot/Rook).
 * - Di chuyển theo hàng hoặc cột, không giới hạn khoảng cách
 * - Dừng khi gặp quân (ăn nếu là quân đối phương)
 */
function chariotMoves(piece: Piece, x: number, y: number, getPieceAt: GetPieceAt): Coord[] {
  const moves: Coord[] = [];

  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    let nx = x + dx;
    let ny = y + dy;
    while (inBoard(nx, ny)) {
      const t = getPieceAt(nx, ny);
      if (!t) {
        moves.push([nx, ny]);
      } else {
        if (t.color !== piece.color) moves.push([nx, ny]);
        break;
      }
      nx += dx;
      ny += dy;
    }
  }

  return moves;
}

/**
 * Tính các nước đi hợp lệ cho Pháo (Cannon).
 *
 * Luật Pháo:
 * - Di chuyển giống Xe (theo hàng/cột, không giới hạn khoảng cách)
 * - NHƯNG khi ĂN phải nhảy qua đúng 1 quân ("ngòi pháo" / "gun mount")
 * - Không thể ăn quân mà không có ngòi, không thể dừng ở ô có quân khi di chuyển thường
 *
 * Cách tính:
 * 1. Quét theo từng hướng (lên/xuống/trái/phải)
 * 2. Phase 1 (chưa gặp quân): thêm ô trống vào danh sách di chuyển
 * 3. Khi gặp quân đầu tiên → đó là "ngòi pháo", chuyển sang Phase 2
 * 4. Phase 2 (đã có ngòi): bỏ qua ô trống, khi gặp quân:
 *    - Quân đối phương → ăn được (thêm vào moves)
 *    - Quân cùng phe → không ăn được
 *    - Dù ăn hay không → dừng quét hướng này
 */
function cannonMoves(piece: Piece, x: number, y: number, getPieceAt: GetPieceAt): Coord[] {
  const moves: Coord[] = [];

  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    let nx = x + dx;
    let ny = y + dy;
    let foundMount = false; // đã tìm thấy "ngòi pháo" chưa?

    while (inBoard(nx, ny)) {
      const t = getPieceAt(nx, ny);

      if (!foundMount) {
        // Phase 1: chưa có ngòi
        if (!t) {
          // Ô trống → di chuyển bình thường
          moves.push([nx, ny]);
        } else {
          // Gặp quân đầu tiên → quân này là "ngòi pháo"
          foundMount = true;
        }
      } else {
        // Phase 2: đã có ngòi, tìm mục tiêu ăn
        if (t) {
          // Gặp quân sau ngòi → ăn nếu là đối phương
          if (t.color !== piece.color) {
            moves.push([nx, ny]);
          }
          // Dù ăn hay không, dừng quét hướng này
          break;
        }
        // Ô trống → tiếp tục quét
      }

      nx += dx;
      ny += dy;
    }
  }

  return moves;
}

/**
 * Tính các nước đi hợp lệ cho Tốt/Binh (Soldier/Pawn).
 * - Trước khi qua sông: chỉ đi thẳng 1 ô
 * - Sau khi qua sông: đi thẳng hoặc ngang 1 ô (không lùi)
 */
function soldierMoves(piece: Piece, x: number, y: number, getPieceAt: GetPieceAt): Coord[] {
  const moves: Coord[] = [];
  const fwd = piece.color === 'red' ? 1 : -1;

  // Luôn có thể đi thẳng
  const ny = y + fwd;
  if (inBoard(x, ny)) {
    const t = getPieceAt(x, ny);
    if (!t || t.color !== piece.color) moves.push([x, ny]);
  }

  // Qua sông mới được đi ngang
  const crossed =
    (piece.color === 'red' && y >= 5) || (piece.color === 'black' && y <= 4);
  if (crossed) {
    for (const dx of [-1, 1]) {
      const nx = x + dx;
      if (inBoard(nx, y)) {
        const t = getPieceAt(nx, y);
        if (!t || t.color !== piece.color) moves.push([nx, y]);
      }
    }
  }

  return moves;
}

/**
 * Entry point: tính tất cả nước đi hợp lệ cho 1 quân cờ.
 */
export function calculateValidMoves(piece: Piece, getPieceAt: GetPieceAt): Coord[] {
  const [x, y] = piece.position;

  switch (piece.type) {
    case 'general':
      return generalMoves(piece, x, y, getPieceAt);
    case 'advisor':
      return advisorMoves(piece, x, y, getPieceAt);
    case 'elephant':
      return elephantMoves(piece, x, y, getPieceAt);
    case 'horse':
      return horseMoves(piece, x, y, getPieceAt);
    case 'chariot':
      return chariotMoves(piece, x, y, getPieceAt);
    case 'cannon':
      return cannonMoves(piece, x, y, getPieceAt);
    case 'soldier':
      return soldierMoves(piece, x, y, getPieceAt);
    default:
      return [];
  }
}

// ============================================================
// Check / Checkmate / Game Result
// ============================================================

/**
 * Tìm Tướng của một bên.
 */
function findGeneral(pieces: Piece[], color: PieceColor): Piece | null {
  return pieces.find((p) => p.type === 'general' && p.color === color) || null;
}

/**
 * Helper: tạo getPieceAt từ Piece[].
 */
function makeLookup(pieces: Piece[]): GetPieceAt {
  return (x: number, y: number) =>
    pieces.find((p) => p.position[0] === x && p.position[1] === y) || null;
}

/**
 * Kiểm tra xem bên `color` có đang bị chiếu không.
 *
 * Cách kiểm tra: duyệt tất cả quân đối phương,
 * tính nước đi hợp lệ, nếu bất kỳ nước nào nhắm vào Tướng → bị chiếu.
 */
export function isInCheck(pieces: Piece[], color: PieceColor): boolean {
  const general = findGeneral(pieces, color);
  if (!general) return false; // Tướng đã bị ăn → xử lý ở nơi khác

  const [gx, gy] = general.position;
  const opponentColor: PieceColor = color === 'red' ? 'black' : 'red';
  const getPieceAt = makeLookup(pieces);

  for (const piece of pieces) {
    if (piece.color !== opponentColor) continue;

    const moves = calculateValidMoves(piece, getPieceAt);
    if (moves.some(([mx, my]) => mx === gx && my === gy)) {
      return true;
    }
  }

  return false;
}

/**
 * Mô phỏng di chuyển 1 quân và trả về Piece[] mới.
 */
function simulateMove(pieces: Piece[], from: Coord, to: Coord): Piece[] {
  const piece = pieces.find(
    (p) => p.position[0] === from[0] && p.position[1] === from[1]
  );
  if (!piece) return pieces;

  return pieces
    .filter(
      (p) =>
        !(p.position[0] === from[0] && p.position[1] === from[1]) &&
        !(p.position[0] === to[0] && p.position[1] === to[1])
    )
    .concat([{ ...piece, position: to }]);
}

/**
 * Lọc các nước đi hợp lệ: bỏ những nước đi mà sau khi đi, Tướng mình bị chiếu.
 */
export function getLegalMoves(piece: Piece, pieces: Piece[]): Coord[] {
  const getPieceAt = makeLookup(pieces);
  const rawMoves = calculateValidMoves(piece, getPieceAt);

  return rawMoves.filter(([tx, ty]) => {
    const newPieces = simulateMove(pieces, piece.position, [tx, ty]);
    return !isInCheck(newPieces, piece.color);
  });
}

/**
 * Kiểm tra xem bên `color` có bị chiếu hết không.
 *
 * Chiếu hết = đang bị chiếu + không có nước đi nào thoát chiếu.
 */
export function isCheckmate(pieces: Piece[], color: PieceColor): boolean {
  if (!isInCheck(pieces, color)) return false;

  // Thử tất cả nước đi có thể của bên `color`
  for (const piece of pieces) {
    if (piece.color !== color) continue;

    const legalMoves = getLegalMoves(piece, pieces);
    if (legalMoves.length > 0) return false; // Còn nước thoát
  }

  return true; // Không có nước thoát → chiếu hết
}

/**
 * Kiểm tra bế tắc (stalemate): không bị chiếu nhưng không có nước đi hợp lệ.
 */
export function isStalemate(pieces: Piece[], color: PieceColor): boolean {
  if (isInCheck(pieces, color)) return false;

  for (const piece of pieces) {
    if (piece.color !== color) continue;

    const legalMoves = getLegalMoves(piece, pieces);
    if (legalMoves.length > 0) return false;
  }

  return true;
}

export type GameResult =
  | { type: 'ongoing' }
  | { type: 'checkmate'; winner: PieceColor; loser: PieceColor }
  | { type: 'captured'; winner: PieceColor; loser: PieceColor }
  | { type: 'stalemate' };

/**
 * Kiểm tra kết quả ván cờ sau khi di chuyển.
 *
 * @param pieces - trạng thái bàn cờ hiện tại
 * @param nextTurn - lượt tiếp theo (bên vừa CHƯA đi)
 */
export function getGameResult(pieces: Piece[], nextTurn: PieceColor): GameResult {
  const prevTurn: PieceColor = nextTurn === 'red' ? 'black' : 'red';

  // 1. Tướng bị ăn → thua ngay
  if (!findGeneral(pieces, 'red')) {
    return { type: 'captured', winner: 'black', loser: 'red' };
  }
  if (!findGeneral(pieces, 'black')) {
    return { type: 'captured', winner: 'red', loser: 'black' };
  }

  // 2. Chiếu hết
  if (isCheckmate(pieces, nextTurn)) {
    return { type: 'checkmate', winner: prevTurn, loser: nextTurn };
  }

  // 3. Bế tắc (hòa)
  if (isStalemate(pieces, nextTurn)) {
    return { type: 'stalemate' };
  }

  return { type: 'ongoing' };
}
