import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import XiangqiBoard from "./XiangqiBoard";
import { GameConfig } from "./GameModeScreen";
import { useXiangqiGame } from "./xiangqi/useXiangqiGame";
import { MoveHistoryPanel } from "./xiangqi/MoveHistoryPanel";
import { useAIEngine } from "./xiangqi/useAIEngine";
import { useGame } from "../context/GameContext";
import { encodeFEN } from "./xiangqi/fen";

// Decomposed components
import { GameControlPanel } from "./GameControlPanel";
import { PlayerInfoCard } from "./PlayerInfoCard";
import {
  ResignConfirmDialog,
  DrawOfferDialog,
  PauseMenuDialog,
  GameResultDialog,
} from "./GameDialogs";

interface MainGameScreenProps {
  config: GameConfig;
  onExit: () => void;
}

interface Player {
  name: string;
  color: "red" | "black";
  timeRemaining: number;
}

export default function MainGameScreen({
  config,
  onExit,
}: MainGameScreenProps) {
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [showResignConfirm, setShowResignConfirm] = useState(false);
  const [showDrawOffer, setShowDrawOffer] = useState(false);
  const [showGameResult, setShowGameResult] = useState(false);

  const game = useXiangqiGame();
  const {
    makeMove: sendMoveToOpponent,
    roomId,
    playerColor: assignedPlayerColor,
    currentFen,
  } = useGame();

  // Compute player color: for online mode, use assigned color from server; for other modes, use config
  const playerColor = useMemo<"red" | "black">(() => {
    if (config.mode === "online" && assignedPlayerColor) {
      return assignedPlayerColor;
    }
    // For offline/AI modes
    return config.playerColor === "random"
      ? Math.random() > 0.5
        ? "red"
        : "black"
      : config.playerColor;
  }, [config.mode, config.playerColor, assignedPlayerColor]);

  const [player1] = useState<Player>({
    name: "Player 1",
    color: playerColor,
    timeRemaining:
      config.timeLimit === "unlimited" ? 0 : parseInt(config.timeLimit) * 60,
  });

  const [player2] = useState<Player>({
    name: config.mode === "ai" ? "AI Player" : "Player 2",
    color: playerColor === "red" ? "black" : "red",
    timeRemaining:
      config.timeLimit === "unlimited" ? 0 : parseInt(config.timeLimit) * 60,
  });

  // AI Engine integration
  const isAIMode = config.mode === "ai";
  const aiColor = playerColor === "red" ? "black" : "red";
  const ai = useAIEngine({
    aiColor,
    difficulty: config.aiDifficulty || "medium",
    enabled: isAIMode,
  });

  // Send moves to opponent (for online games)
  const lastMoveCountRef = useRef(0);
  useEffect(() => {
    if (config.mode !== "online" || !roomId) return;
    if (game.moveHistory.length <= lastMoveCountRef.current) return;

    const lastMove = game.moveHistory[game.moveHistory.length - 1];
    if (lastMove) {
      const fen = encodeFEN(game.pieces, game.currentTurn);
      const moveData = {
        fromX: lastMove.from[0],
        fromY: lastMove.from[1],
        toX: lastMove.to[0],
        toY: lastMove.to[1],
      };
      sendMoveToOpponent(moveData, fen);
      lastMoveCountRef.current = game.moveHistory.length;
    }
  }, [
    game.moveHistory,
    game.pieces,
    game.currentTurn,
    config.mode,
    roomId,
    sendMoveToOpponent,
  ]);

  // Apply opponent's moves (for online games)
  const lastFenRef = useRef("");
  useEffect(() => {
    if (config.mode !== "online" || !currentFen || !roomId) return;
    if (currentFen === lastFenRef.current) return;

    // FEN changed - opponent made a move or initial load
    console.log("Applying FEN:", currentFen);
    game.loadFEN(currentFen);
    lastFenRef.current = currentFen;
  }, [config.mode, currentFen, roomId]);

  // Trigger AI search when it's AI's turn
  const aiRequestedRef = useRef(false);
  useEffect(() => {
    if (!isAIMode || !ai.isReady || ai.isThinking) return;
    if (game.currentTurn === ai.aiColor && !aiRequestedRef.current) {
      aiRequestedRef.current = true;
      // Delay nhẹ để UI cập nhật trước
      const timer = setTimeout(() => {
        ai.requestMove(game.pieces, game.currentTurn);
      }, 400);
      return () => clearTimeout(timer);
    }
    if (game.currentTurn !== ai.aiColor) {
      aiRequestedRef.current = false;
    }
  }, [
    isAIMode,
    ai.isReady,
    ai.isThinking,
    game.currentTurn,
    ai.aiColor,
    game.pieces,
  ]);

  // Apply AI's best move directly (bypass UI click selection)
  useEffect(() => {
    if (!ai.bestMove) return;
    const { fromX, fromY, toX, toY } = ai.bestMove;

    // Delay nhẹ để người chơi thấy AI "nghĩ" trước khi đi
    const timer = setTimeout(() => {
      game.makeMove(fromX, fromY, toX, toY);
      ai.clearBestMove();
      aiRequestedRef.current = false;
    }, 200);

    return () => clearTimeout(timer);
  }, [ai.bestMove]);

  // Auto-show victory screen when game ends
  useEffect(() => {
    if (game.isGameOver && !showGameResult) {
      // Delay nhẹ để người chơi thấy nước cuối trước khi hiển popup
      const timer = setTimeout(() => setShowGameResult(true), 600);
      return () => clearTimeout(timer);
    }
  }, [game.isGameOver, showGameResult]);

  // Check indicator text
  const checkMessage =
    game.isCheck && !game.isGameOver
      ? `⚠️ Chiếu Tướng! ${game.currentTurn === "red" ? "Đỏ" : "Đen"} đang bị chiếu!`
      : null;

  // Check if a player is the AI
  const isAIPlayer = useCallback(
    (player: Player) => isAIMode && player.color === ai.aiColor,
    [isAIMode, ai.aiColor]
  );

  // Dialog Event Handlers with stabilized references using useCallback
  const handleDrawOffer = useCallback(() => {
    setShowDrawOffer(true);
  }, []);

  const handleResign = useCallback(() => {
    setShowResignConfirm(true);
  }, []);

  const handlePause = useCallback(() => {
    setShowPauseMenu(true);
  }, []);

  const handleCancelResign = useCallback(() => {
    setShowResignConfirm(false);
  }, []);

  const handleConfirmResign = useCallback(() => {
    setShowResignConfirm(false);
    onExit();
  }, [onExit]);

  const handleDeclineDraw = useCallback(() => {
    setShowDrawOffer(false);
  }, []);

  const handleAcceptDraw = useCallback(() => {
    setShowDrawOffer(false);
    onExit();
  }, [onExit]);

  const handleResumeGame = useCallback(() => {
    setShowPauseMenu(false);
  }, []);

  const handleExitGame = useCallback(() => {
    setShowPauseMenu(false);
    onExit();
  }, [onExit]);

  const handleRestartGame = useCallback(() => {
    setShowGameResult(false);
    game.reset();
  }, [game]);

  const handleExitAfterResult = useCallback(() => {
    setShowGameResult(false);
    onExit();
  }, [onExit]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 p-4 animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
          {/* Main board area */}
          <div className="space-y-4">
            {/* Check warning banner */}
            {checkMessage ? (
              <div className="bg-red-600 text-white px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse shadow-lg">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <span className="font-bold text-lg">{checkMessage}</span>
              </div>
            ) : null}

            {/* Top player = opponent */}
            <PlayerInfoCard
              player={player2}
              isAI={isAIPlayer(player2)}
              isThinking={isAIPlayer(player2) && ai.isThinking}
              aiDifficulty={config.aiDifficulty}
              capturedPieces={game.captured[player2.color === "red" ? "black" : "red"]}
              capturedColor={player2.color === "red" ? "black" : "red"}
            />

            {/* Game board */}
            <XiangqiBoard
              game={game}
              perspective={playerColor}
              playerColor={config.mode === "online" ? playerColor : undefined}
            />

            {/* Bottom player = you */}
            <PlayerInfoCard
              player={player1}
              isAI={isAIPlayer(player1)}
              isThinking={isAIPlayer(player1) && ai.isThinking}
              aiDifficulty={config.aiDifficulty}
              capturedPieces={game.captured[player1.color === "red" ? "black" : "red"]}
              capturedColor={player1.color === "red" ? "black" : "red"}
            />

            {/* Move history below the board on small screens */}
            <MoveHistoryPanel moves={game.moveHistory} className="lg:hidden" />
          </div>

          {/* Side column: history + controls */}
          <div className="lg:w-80 space-y-4">
            <MoveHistoryPanel
              moves={game.moveHistory}
              className="hidden lg:block"
            />
            <GameControlPanel
              mode={config.mode}
              onDrawOffer={handleDrawOffer}
              onResign={handleResign}
              onPause={handlePause}
            />
          </div>
        </div>
      </div>

      {/* Dialog Modals */}
      <ResignConfirmDialog
        isOpen={showResignConfirm}
        onCancel={handleCancelResign}
        onConfirm={handleConfirmResign}
      />

      <DrawOfferDialog
        isOpen={showDrawOffer}
        onDecline={handleDeclineDraw}
        onAccept={handleAcceptDraw}
      />

      <PauseMenuDialog
        isOpen={showPauseMenu}
        onResume={handleResumeGame}
        onExit={handleExitGame}
      />

      <GameResultDialog
        isOpen={showGameResult}
        isGameOver={game.isGameOver}
        gameResult={game.gameResult}
        moveHistoryLength={game.moveHistory.length}
        onRestart={handleRestartGame}
        onExit={handleExitAfterResult}
      />
    </div>
  );
}
