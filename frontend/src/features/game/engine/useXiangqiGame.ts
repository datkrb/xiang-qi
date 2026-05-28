import { useCallback, useMemo, useState } from "react";
import { INITIAL_PIECES } from "./initialPieces";
import {
  getLegalMoves,
  isInCheck,
  getGameResult,
  GameResult,
} from "./moves";
import { decodeFEN } from "./fen";
import { Coord, Piece, PieceColor } from "@features/xiangqi";

export interface MoveRecord {
  piece: Piece;
  from: Coord;
  to: Coord;
  captured: Piece | null;
}

export interface XiangqiGame {
  pieces: Piece[];
  currentTurn: PieceColor;
  selectedPiece: Coord | null;
  validMoves: Coord[];
  captured: { red: Piece[]; black: Piece[] };
  moveHistory: MoveRecord[];
  /** Bên đang đi có bị chiếu không */
  isCheck: boolean;
  /** Kết quả ván cờ (ongoing / checkmate / captured / stalemate) */
  gameResult: GameResult;
  /** Game đã kết thúc chưa */
  isGameOver: boolean;
  getPieceAt: (x: number, y: number) => Piece | null;
  handleClick: (x: number, y: number) => void;
  /** Di chuyển quân trực tiếp (dùng cho AI, không qua UI select) */
  makeMove: (fromX: number, fromY: number, toX: number, toY: number) => void;
  /** Load a position from FEN string (for syncing opponent moves) */
  loadFEN: (fen: string) => void;
  reset: () => void;
}

export function useXiangqiGame(): XiangqiGame {
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_PIECES);
  const [currentTurn, setCurrentTurn] = useState<PieceColor>("red");
  const [selectedPiece, setSelectedPiece] = useState<Coord | null>(null);
  const [validMoves, setValidMoves] = useState<Coord[]>([]);
  const [captured, setCaptured] = useState<{ red: Piece[]; black: Piece[] }>({
    red: [],
    black: [],
  });
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);

  // Tính check và game result từ state hiện tại
  const isCheck = useMemo(
    () => isInCheck(pieces, currentTurn),
    [pieces, currentTurn],
  );
  const gameResult = useMemo(
    () => getGameResult(pieces, currentTurn),
    [pieces, currentTurn],
  );
  const isGameOver = gameResult.type !== "ongoing";

  const getPieceAt = useCallback(
    (x: number, y: number): Piece | null =>
      pieces.find((p) => p.position[0] === x && p.position[1] === y) || null,
    [pieces],
  );

  const movePiece = useCallback(
    (from: Coord, to: Coord) => {
      const piece = getPieceAt(from[0], from[1]);
      if (!piece) return;
      const capturedPiece = getPieceAt(to[0], to[1]);

      setPieces((prev) => {
        const filtered = prev.filter(
          (p) =>
            !(p.position[0] === from[0] && p.position[1] === from[1]) &&
            !(p.position[0] === to[0] && p.position[1] === to[1]),
        );
        return [...filtered, { ...piece, position: to }];
      });

      if (capturedPiece) {
        setCaptured((cp) => ({
          ...cp,
          [capturedPiece.color]: [...cp[capturedPiece.color], capturedPiece],
        }));
      }

      setMoveHistory((prev) => [
        ...prev,
        { piece, from, to, captured: capturedPiece },
      ]);
      setCurrentTurn((prev) => (prev === "red" ? "black" : "red"));
    },
    [getPieceAt],
  );

  const handleClick = useCallback(
    (x: number, y: number) => {
      // Không cho đi nếu game đã kết thúc
      if (isGameOver) return;

      const piece = getPieceAt(x, y);

      // Nếu đã chọn quân và click vào ô hợp lệ → di chuyển
      if (
        selectedPiece &&
        validMoves.some(([mx, my]) => mx === x && my === y)
      ) {
        movePiece(selectedPiece, [x, y]);
        setSelectedPiece(null);
        setValidMoves([]);
        return;
      }

      // Chọn quân của mình → tính legal moves (lọc nước tự chiếu)
      if (piece && piece.color === currentTurn) {
        setSelectedPiece([x, y]);
        const legal = getLegalMoves(piece, pieces);
        setValidMoves(legal);
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
      }
    },
    [
      currentTurn,
      getPieceAt,
      movePiece,
      selectedPiece,
      validMoves,
      isGameOver,
      pieces,
    ],
  );

  /** Di chuyển quân trực tiếp từ (fromX,fromY) đến (toX,toY). Dùng cho AI. */
  const makeMove = useCallback(
    (fromX: number, fromY: number, toX: number, toY: number) => {
      if (isGameOver) return;
      movePiece([fromX, fromY], [toX, toY]);
      setSelectedPiece(null);
      setValidMoves([]);
    },
    [movePiece, isGameOver],
  );

  const reset = useCallback(() => {
    setPieces(INITIAL_PIECES);
    setCurrentTurn("red");
    setSelectedPiece(null);
    setValidMoves([]);
    setCaptured({ red: [], black: [] });
    setMoveHistory([]);
  }, []);

  /** Load a position from FEN string (for syncing opponent moves in online games) */
  const loadFEN = useCallback((fen: string) => {
    try {
      const { pieces: newPieces, currentTurn: newTurn } = decodeFEN(fen);
      console.log(
        `Loading FEN - Pieces found: ${newPieces.length}, Turn: ${newTurn}`,
        newPieces,
      );
      setPieces(newPieces);
      setCurrentTurn(newTurn);
      setSelectedPiece(null);
      setValidMoves([]);
      // Note: We don't reset moveHistory or captured pieces - those are maintained separately
    } catch (error) {
      console.error("Failed to load FEN:", error, "FEN:", fen);
    }
  }, []);

  return useMemo(
    () => ({
      pieces,
      currentTurn,
      selectedPiece,
      validMoves,
      captured,
      moveHistory,
      isCheck,
      gameResult,
      isGameOver,
      getPieceAt,
      handleClick,
      makeMove,
      loadFEN,
      reset,
    }),
    [
      pieces,
      currentTurn,
      selectedPiece,
      validMoves,
      captured,
      moveHistory,
      isCheck,
      gameResult,
      isGameOver,
      getPieceAt,
      handleClick,
      makeMove,
      loadFEN,
      reset,
    ],
  );
}
