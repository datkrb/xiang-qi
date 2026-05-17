import { useCallback, useMemo, useState } from 'react';
import { INITIAL_PIECES } from './initialPieces';
import { calculateValidMoves } from './moves';
import { Coord, Piece, PieceColor } from './types';

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
  isCheck: boolean;
  getPieceAt: (x: number, y: number) => Piece | null;
  handleClick: (x: number, y: number) => void;
  reset: () => void;
}

export function useXiangqiGame(): XiangqiGame {
  const [pieces, setPieces] = useState<Piece[]>(INITIAL_PIECES);
  const [currentTurn, setCurrentTurn] = useState<PieceColor>('red');
  const [selectedPiece, setSelectedPiece] = useState<Coord | null>(null);
  const [validMoves, setValidMoves] = useState<Coord[]>([]);
  const [captured, setCaptured] = useState<{ red: Piece[]; black: Piece[] }>({ red: [], black: [] });
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [isCheck] = useState(false);

  const getPieceAt = useCallback(
    (x: number, y: number): Piece | null =>
      pieces.find((p) => p.position[0] === x && p.position[1] === y) || null,
    [pieces]
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
            !(p.position[0] === to[0] && p.position[1] === to[1])
        );
        return [...filtered, { ...piece, position: to }];
      });

      if (capturedPiece) {
        setCaptured((cp) => ({
          ...cp,
          [capturedPiece.color]: [...cp[capturedPiece.color], capturedPiece],
        }));
      }

      setMoveHistory((prev) => [...prev, { piece, from, to, captured: capturedPiece }]);
      setCurrentTurn((prev) => (prev === 'red' ? 'black' : 'red'));
    },
    [getPieceAt]
  );

  const handleClick = useCallback(
    (x: number, y: number) => {
      const piece = getPieceAt(x, y);
      if (selectedPiece && validMoves.some(([mx, my]) => mx === x && my === y)) {
        movePiece(selectedPiece, [x, y]);
        setSelectedPiece(null);
        setValidMoves([]);
        return;
      }
      if (piece && piece.color === currentTurn) {
        setSelectedPiece([x, y]);
        setValidMoves(calculateValidMoves(piece, getPieceAt));
      } else {
        setSelectedPiece(null);
        setValidMoves([]);
      }
    },
    [currentTurn, getPieceAt, movePiece, selectedPiece, validMoves]
  );

  const reset = useCallback(() => {
    setPieces(INITIAL_PIECES);
    setCurrentTurn('red');
    setSelectedPiece(null);
    setValidMoves([]);
    setCaptured({ red: [], black: [] });
    setMoveHistory([]);
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
      getPieceAt,
      handleClick,
      reset,
    }),
    [pieces, currentTurn, selectedPiece, validMoves, captured, moveHistory, isCheck, getPieceAt, handleClick, reset]
  );
}
