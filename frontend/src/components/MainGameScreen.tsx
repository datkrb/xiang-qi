import { useState, useEffect, useRef } from 'react';
import {
  Undo2, Redo2, Lightbulb, Save, FolderOpen, RotateCcw,
  Handshake, Flag, MessageSquare, Pause, Clock, Bot, Loader2, Trophy, Swords, AlertTriangle
} from 'lucide-react';
import XiangqiBoard from './XiangqiBoard';
import { GameConfig } from './GameModeScreen';
import { useXiangqiGame } from './xiangqi/useXiangqiGame';
import { CapturedTray } from './xiangqi/CapturedTray';
import { MoveHistoryPanel } from './xiangqi/MoveHistoryPanel';
import { useAIEngine } from './xiangqi/useAIEngine';

interface MainGameScreenProps {
  config: GameConfig;
  onExit: () => void;
}

interface Player {
  name: string;
  color: 'red' | 'black';
  timeRemaining: number;
}

export default function MainGameScreen({ config, onExit }: MainGameScreenProps) {
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [showResignConfirm, setShowResignConfirm] = useState(false);
  const [showDrawOffer, setShowDrawOffer] = useState(false);
  const [showGameResult, setShowGameResult] = useState(false);

  const game = useXiangqiGame();

  // Compute player color once (stable across renders via useState)
  const [playerColor] = useState<'red' | 'black'>(() =>
    config.playerColor === 'random' ? (Math.random() > 0.5 ? 'red' : 'black') : config.playerColor
  );

  const [player1] = useState<Player>({
    name: 'Player 1',
    color: playerColor,
    timeRemaining: config.timeLimit === 'unlimited' ? 0 : parseInt(config.timeLimit) * 60,
  });

  const [player2] = useState<Player>({
    name: config.mode === 'ai' ? 'AI Player' : 'Player 2',
    color: playerColor === 'red' ? 'black' : 'red',
    timeRemaining: config.timeLimit === 'unlimited' ? 0 : parseInt(config.timeLimit) * 60,
  });

  // AI Engine integration
  const isAIMode = config.mode === 'ai';
  const aiColor = playerColor === 'red' ? 'black' : 'red';
  const ai = useAIEngine({
    aiColor,
    difficulty: config.aiDifficulty || 'medium',
    enabled: isAIMode,
  });

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
  }, [isAIMode, ai.isReady, ai.isThinking, game.currentTurn, ai.aiColor, game.pieces]);

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

  const formatTime = (seconds: number) => {
    if (seconds === 0) return '∞';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Check if a player is the AI
  const isAIPlayer = (player: Player) =>
    isAIMode && player.color === ai.aiColor;

  const PlayerInfo = ({ player }: { player: Player }) => {
    // Pieces this player has captured = opponent's pieces in the captured tray
    const capturedByMe = game.captured[player.color === 'red' ? 'black' : 'red'];
    const isAI = isAIPlayer(player);
    const isCurrentlyThinking = isAI && ai.isThinking;

    return (
      <div
        className={`bg-gradient-to-r ${
          player.color === 'red' ? 'from-red-700 to-red-600' : 'from-gray-800 to-gray-700'
        } p-4 rounded-xl shadow-lg border border-white/10 ${
          isCurrentlyThinking ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-transparent' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full ${
                player.color === 'red' ? 'bg-red-500' : 'bg-gray-900'
              } border-2 border-white flex items-center justify-center text-white font-bold`}
            >
              {isAI ? <Bot className="w-6 h-6" /> : player.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-bold">{player.name}</h3>
                {isAI && (
                  <span className="text-xs bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full font-semibold">
                    AI {config.aiDifficulty || 'medium'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                {isCurrentlyThinking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang nghĩ...</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(player.timeRemaining)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <CapturedTray
            pieces={capturedByMe}
            color={player.color === 'red' ? 'black' : 'red'}
          />
        </div>
      </div>
    );
  };

  // Auto-show victory screen when game ends
  useEffect(() => {
    if (game.isGameOver && !showGameResult) {
      // Delay nhẹ để người chơi thấy nước cuối trước khi hiển popup
      const timer = setTimeout(() => setShowGameResult(true), 600);
      return () => clearTimeout(timer);
    }
  }, [game.isGameOver, showGameResult]);

  // Check indicator text
  const checkMessage = game.isCheck && !game.isGameOver
    ? `⚠️ Chiếu Tướng! ${game.currentTurn === 'red' ? 'Đỏ' : 'Đen'} đang bị chiếu!`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
          {/* Main board area */}
          <div className="space-y-4">
            {/* Check warning banner */}
            {checkMessage && (
              <div className="bg-red-600 text-white px-4 py-3 rounded-xl flex items-center gap-3 animate-pulse shadow-lg">
                <AlertTriangle className="w-6 h-6 flex-shrink-0" />
                <span className="font-bold text-lg">{checkMessage}</span>
              </div>
            )}

            {/* Top player = opponent (their pieces at far side) */}
            <PlayerInfo player={player2} />

            {/* Game board — lật khi người chơi chọn Đen */}
            <XiangqiBoard config={config} game={game} perspective={playerColor} />

            {/* Bottom player = you (your pieces at near side) */}
            <PlayerInfo player={player1} />

            {/* Move history below the board on small screens */}
            <MoveHistoryPanel moves={game.moveHistory} className="lg:hidden" />
          </div>

          {/* Side column: history + controls */}
          <div className="lg:w-80 space-y-4">
            <MoveHistoryPanel moves={game.moveHistory} className="hidden lg:block" />
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-200 space-y-3">
            <h3 className="text-xl font-bold text-amber-900 mb-4">Game Controls</h3>

            <button className="w-full flex items-center gap-3 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              <Undo2 className="w-5 h-5" />
              <span>Undo</span>
            </button>

            <button className="w-full flex items-center gap-3 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
              <Redo2 className="w-5 h-5" />
              <span>Redo</span>
            </button>

            <button className="w-full flex items-center gap-3 p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors">
              <Lightbulb className="w-5 h-5" />
              <span>Hint</span>
            </button>

            <div className="border-t border-amber-200 my-4" />

            <button className="w-full flex items-center gap-3 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
              <Save className="w-5 h-5" />
              <span>Save Game</span>
            </button>

            <button className="w-full flex items-center gap-3 p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors">
              <FolderOpen className="w-5 h-5" />
              <span>Load Game</span>
            </button>

            <button className="w-full flex items-center gap-3 p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
              <RotateCcw className="w-5 h-5" />
              <span>Restart</span>
            </button>

            <div className="border-t border-amber-200 my-4" />

            <button
              onClick={() => setShowDrawOffer(true)}
              className="w-full flex items-center gap-3 p-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
            >
              <Handshake className="w-5 h-5" />
              <span>Offer Draw</span>
            </button>

            <button
              onClick={() => setShowResignConfirm(true)}
              className="w-full flex items-center gap-3 p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <Flag className="w-5 h-5" />
              <span>Resign</span>
            </button>

            {config.mode === 'online' && (
              <button className="w-full flex items-center gap-3 p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span>Chat</span>
              </button>
            )}

            <div className="border-t border-amber-200 my-4" />

            <button
              onClick={() => setShowPauseMenu(true)}
              className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              <Pause className="w-5 h-5" />
              <span>Pause Menu</span>
            </button>
          </div>
          </div>
        </div>
      </div>

      {/* Resign Confirmation Popup */}
      {showResignConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirm Resignation</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to resign? This will end the game.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowResignConfirm(false)}
                className="flex-1 p-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowResignConfirm(false);
                  onExit();
                }}
                className="flex-1 p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Draw Offer Popup */}
      {showDrawOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Draw Offer</h2>
            <p className="text-gray-600 mb-6">Your opponent offers a draw. Do you accept?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDrawOffer(false)}
                className="flex-1 p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => {
                  setShowDrawOffer(false);
                  onExit();
                }}
                className="flex-1 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pause Menu */}
      {showPauseMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md shadow-2xl space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Paused</h2>

            <button
              onClick={() => setShowPauseMenu(false)}
              className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              Resume
            </button>

            <button className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors">
              Save Game
            </button>

            <button className="w-full p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors">
              Settings
            </button>

            <button
              onClick={() => {
                setShowPauseMenu(false);
                onExit();
              }}
              className="w-full p-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              Exit to Menu
            </button>
          </div>
        </div>
      )}

      {/* Game Result Popup */}
      {showGameResult && game.isGameOver && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-white to-amber-50 rounded-3xl p-10 max-w-lg shadow-2xl border-4 border-amber-400 animate-in">
            {/* Trophy icon */}
            <div className="flex justify-center mb-4">
              {game.gameResult.type === 'stalemate' ? (
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <Swords className="w-10 h-10 text-gray-600" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-10 h-10 text-amber-900" />
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className="text-4xl font-bold text-center mb-2">
              {game.gameResult.type === 'stalemate'
                ? 'Hòa cờ!'
                : game.gameResult.type === 'checkmate'
                ? 'Chiếu hết!'
                : 'Chiến thắng!'}
            </h2>

            {/* Winner info */}
            {game.gameResult.type !== 'stalemate' && (
              <p className="text-center text-xl mb-4">
                <span className={`font-bold ${
                  game.gameResult.winner === 'red' ? 'text-red-600' : 'text-gray-800'
                }`}>
                  {game.gameResult.winner === 'red' ? 'Quân Đỏ' : 'Quân Đen'}
                </span>
                {' '}giành chiến thắng!
              </p>
            )}

            {/* Details */}
            <div className="bg-white rounded-xl p-4 mb-6 space-y-2 text-gray-700 border border-amber-200">
              <p>
                <strong>Kết quả:</strong>{' '}
                {game.gameResult.type === 'checkmate' && 'Chiếu hết (Checkmate)'}
                {game.gameResult.type === 'captured' && 'Ăn Tướng (đối phương mất Tướng)'}
                {game.gameResult.type === 'stalemate' && 'Bế tắc (Stalemate) - Hòa cờ'}
              </p>
              <p><strong>Tổng số nước đi:</strong> {game.moveHistory.length}</p>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  setShowGameResult(false);
                  game.reset();
                }}
                className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500
                         text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all
                         transform hover:scale-105"
              >
                Chơi lại
              </button>
              <button
                onClick={() => {
                  setShowGameResult(false);
                  onExit();
                }}
                className="p-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-lg
                         shadow-lg transition-all"
              >
                Về Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
