import { useCallback, useEffect, useRef, useState } from 'react';
import { Piece, PieceColor } from "@features/xiangqi";


interface AIMove {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

interface UseAIEngineOptions {
  /** Màu quân mà AI điều khiển */
  aiColor: PieceColor;
  /** Độ khó: easy (depth 2), medium (depth 3), hard (depth 4) */
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  /** Có bật AI không */
  enabled: boolean;
}

interface UseAIEngineReturn {
  /** AI đang nghĩ nước đi */
  isThinking: boolean;
  /** Engine đã sẵn sàng chưa */
  isReady: boolean;
  /** Tên engine đang dùng */
  engineName: string;
  /** Màu quân AI điều khiển */
  aiColor: PieceColor;
  /** Yêu cầu AI tìm nước đi */
  requestMove: (pieces: Piece[], currentTurn: PieceColor) => void;
  /** Nước đi tốt nhất AI tìm được (null khi chưa có) */
  bestMove: AIMove | null;
  /** Reset bestMove về null */
  clearBestMove: () => void;
}

/**
 * React hook để giao tiếp với AI engine (Web Worker).
 *
 * Usage:
 * ```tsx
 * const ai = useAIEngine({ aiColor: 'black', difficulty: 'medium', enabled: true });
 *
 * useEffect(() => {
 *   if (game.currentTurn === ai.aiColor && ai.isReady) {
 *     ai.requestMove(game.pieces, game.currentTurn);
 *   }
 * }, [game.currentTurn]);
 *
 * useEffect(() => {
 *   if (ai.bestMove) {
 *     game.handleClick(ai.bestMove.fromX, ai.bestMove.fromY); // select piece
 *     setTimeout(() => {
 *       game.handleClick(ai.bestMove.toX, ai.bestMove.toY); // make move
 *       ai.clearBestMove();
 *     }, 300);
 *   }
 * }, [ai.bestMove]);
 * ```
 */
export function useAIEngine({ aiColor, difficulty, enabled }: UseAIEngineOptions): UseAIEngineReturn {
  const workerRef = useRef<Worker | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [engineName, setEngineName] = useState('');
  const [bestMove, setBestMove] = useState<AIMove | null>(null);

  // Khởi tạo Web Worker
  useEffect(() => {
    if (!enabled) {
      setIsReady(false);
      return;
    }

    const worker = new Worker(
      new URL('./engine.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (e: MessageEvent) => {
      const { type, payload } = e.data;

      switch (type) {
        case 'ready':
          setIsReady(true);
          setEngineName(payload?.engine || 'unknown');
          break;

        case 'bestmove':
          setBestMove(payload);
          setIsThinking(false);
          break;

        case 'error':
          console.error('[AI Engine]', payload?.message);
          setIsThinking(false);
          break;
      }
    };

    worker.onerror = (err) => {
      console.error('[AI Engine Worker Error]', err);
      setIsThinking(false);
    };

    workerRef.current = worker;
    worker.postMessage({ type: 'init' });

    return () => {
      worker.postMessage({ type: 'quit' });
      worker.terminate();
      workerRef.current = null;
      setIsReady(false);
    };
  }, [enabled]);

  const requestMove = useCallback(
    (pieces: Piece[], currentTurn: PieceColor) => {
      if (!workerRef.current || !isReady || currentTurn !== aiColor) return;

      setIsThinking(true);
      setBestMove(null);

      // Serialize pieces for the worker
      const serializedPieces = pieces.map((p) => ({
        type: p.type,
        color: p.color,
        position: [...p.position],
      }));

      workerRef.current.postMessage({
        type: 'search',
        payload: {
          pieces: serializedPieces,
          aiColor,
          difficulty,
        },
      });
    },
    [aiColor, difficulty, isReady]
  );

  const clearBestMove = useCallback(() => {
    setBestMove(null);
  }, []);

  return {
    isThinking,
    isReady,
    engineName,
    aiColor,
    requestMove,
    bestMove,
    clearBestMove,
  };
}
