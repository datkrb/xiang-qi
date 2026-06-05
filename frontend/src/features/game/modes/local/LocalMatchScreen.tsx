import { useState, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import { GameConfig } from "../../screens/GameModeScreen";
import { XiangqiBoard } from "@features/xiangqi";
import { useXiangqiGame } from "../../engine/useXiangqiGame";

// Decomposed components
import { MoveHistoryPanel } from "../../components/MoveHistoryPanel";
import { GameControlPanel } from "../../components/GameControlPanel";
import { PlayerInfoCard } from "../../components/PlayerInfoCard";
import { TurnIndicator } from "../../components/TurnIndicator";
import {
  ResignConfirmDialog,
  DrawOfferDialog,
  PauseMenuDialog,
  GameResultDialog,
} from "../../components/GameDialogs";

interface LocalMatchScreenProps {
  config: GameConfig;
  onExit: () => void;
}

interface Player {
  name: string;
  color: "red" | "black";
  timeRemaining: number;
}

export default function LocalMatchScreen({
  config,
  onExit,
}: LocalMatchScreenProps) {
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [showResignConfirm, setShowResignConfirm] = useState(false);
  const [showDrawOffer, setShowDrawOffer] = useState(false);
  const [showGameResult, setShowGameResult] = useState(false);

  const game = useXiangqiGame();

  const playerColor = config.playerColor === "random"
    ? Math.random() > 0.5 ? "red" : "black"
    : config.playerColor;

  const [player1] = useState<Player>({
    name: "Player 1",
    color: playerColor,
    timeRemaining: config.timeLimit === "unlimited" ? 0 : parseInt(config.timeLimit) * 60,
  });

  const [player2] = useState<Player>({
    name: "Player 2",
    color: playerColor === "red" ? "black" : "red",
    timeRemaining: config.timeLimit === "unlimited" ? 0 : parseInt(config.timeLimit) * 60,
  });

  // Handle Game Over
  if (game.isGameOver && !showGameResult) {
    setShowGameResult(true);
  }

  // Check indicator text
  const checkMessage =
    game.isCheck && !game.isGameOver
      ? `⚠️ Chiếu Tướng! ${game.currentTurn === "red" ? "Đỏ" : "Đen"} đang bị chiếu!`
      : null;

  // Dialog Event Handlers
  const handleDrawOffer = useCallback(() => setShowDrawOffer(true), []);
  const handleResign = useCallback(() => setShowResignConfirm(true), []);
  const handlePause = useCallback(() => setShowPauseMenu(true), []);
  const handleCancelResign = useCallback(() => setShowResignConfirm(false), []);
  
  const handleConfirmResign = useCallback(() => {
    setShowResignConfirm(false);
    onExit();
  }, [onExit]);

  const handleDeclineDraw = useCallback(() => setShowDrawOffer(false), []);
  
  const handleAcceptDraw = useCallback(() => {
    setShowDrawOffer(false);
    onExit();
  }, [onExit]);

  const handleResumeGame = useCallback(() => setShowPauseMenu(false), []);
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
    <div className="w-full p-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
          <div className="space-y-4">
            {checkMessage && (
              <div className="bg-danger/20 text-danger border border-danger/50 px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <span className="font-bold text-lg">{checkMessage}</span>
              </div>
            )}

            <PlayerInfoCard
              player={player2}
              isAI={false}
              isThinking={false}
              capturedPieces={game.captured[player2.color === "red" ? "black" : "red"]}
              capturedColor={player2.color === "red" ? "black" : "red"}
            />

            <div className="relative flex justify-center">
              <XiangqiBoard
                pieces={game.pieces}
                selectedPiece={game.selectedPiece}
                validMoves={game.validMoves}
                isCheck={game.isCheck}
                perspective={playerColor}
                onPointClick={(x, y) => game.handleClick(x, y)}
              />
              <TurnIndicator turn={game.currentTurn} />
            </div>

            <PlayerInfoCard
              player={player1}
              isAI={false}
              isThinking={false}
              capturedPieces={game.captured[player1.color === "red" ? "black" : "red"]}
              capturedColor={player1.color === "red" ? "black" : "red"}
            />

            <MoveHistoryPanel moves={game.moveHistory} className="lg:hidden" />
          </div>

          <div className="lg:w-80 space-y-4">
            <MoveHistoryPanel moves={game.moveHistory} className="hidden lg:block" />
            <GameControlPanel
              mode="pvp"
              onDrawOffer={handleDrawOffer}
              onResign={handleResign}
              onPause={handlePause}
            />
          </div>
        </div>
      </div>

      <ResignConfirmDialog isOpen={showResignConfirm} onCancel={handleCancelResign} onConfirm={handleConfirmResign} />
      <DrawOfferDialog isOpen={showDrawOffer} onDecline={handleDeclineDraw} onAccept={handleAcceptDraw} />
      <PauseMenuDialog isOpen={showPauseMenu} onResume={handleResumeGame} onExit={handleExitGame} />
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
