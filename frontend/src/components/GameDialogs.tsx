import React from "react";
import { Swords, Trophy } from "lucide-react";

// --- RESIGN CONFIRM DIALOG ---
interface ResignConfirmDialogProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ResignConfirmDialog: React.FC<ResignConfirmDialogProps> =
  React.memo(({ isOpen, onCancel, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
        <div className="bg-surface rounded-2xl p-8 max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border border-surface">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Confirm Resignation
          </h2>
          <p className="text-muted mb-6">
            Are you sure you want to resign? This will end the game.
          </p>
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 p-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 p-3 bg-danger hover:bg-red-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  });
ResignConfirmDialog.displayName = "ResignConfirmDialog";

// --- DRAW OFFER DIALOG ---
interface DrawOfferDialogProps {
  isOpen: boolean;
  onDecline: () => void;
  onAccept: () => void;
}

export const DrawOfferDialog: React.FC<DrawOfferDialogProps> = React.memo(
  ({ isOpen, onDecline, onAccept }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
        <div className="bg-surface rounded-2xl p-8 max-w-md shadow-2xl animate-in zoom-in-95 duration-200 border border-surface">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Draw Offer</h2>
          <p className="text-muted mb-6">
            Your opponent offers a draw. Do you accept?
          </p>
          <div className="flex gap-4">
            <button
              onClick={onDecline}
              className="flex-1 p-3 bg-danger hover:bg-red-600 text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="flex-1 p-3 bg-success hover:bg-green-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    );
  },
);
DrawOfferDialog.displayName = "DrawOfferDialog";

// --- PAUSE MENU DIALOG ---
interface PauseMenuDialogProps {
  isOpen: boolean;
  onResume: () => void;
  onSave?: () => void;
  onSettings?: () => void;
  onExit: () => void;
}

export const PauseMenuDialog: React.FC<PauseMenuDialogProps> = React.memo(
  ({ isOpen, onResume, onSave, onSettings, onExit }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
        <div className="bg-surface rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-3 animate-in zoom-in-95 duration-200 border border-surface">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Paused
          </h2>

          <button
            onClick={onResume}
            className="w-full p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Resume
          </button>

          <button
            onClick={onSave}
            className="w-full p-3 btn-primary rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Save Game
          </button>

          <button
            onClick={onSettings}
            className="w-full p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Settings
          </button>

          <button
            onClick={onExit}
            className="w-full p-3 bg-danger hover:bg-red-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Exit to Menu
          </button>
        </div>
      </div>
    );
  },
);
PauseMenuDialog.displayName = "PauseMenuDialog";

// --- GAME RESULT DIALOG ---
interface GameResult {
  type: string;
  winner?: string;
}

interface GameResultDialogProps {
  isOpen: boolean;
  isGameOver: boolean;
  gameResult: GameResult;
  moveHistoryLength: number;
  onRestart: () => void;
  onExit: () => void;
}

export const GameResultDialog: React.FC<GameResultDialogProps> = React.memo(
  ({
    isOpen,
    isGameOver,
    gameResult,
    moveHistoryLength,
    onRestart,
    onExit,
  }) => {
    if (!isOpen || !isGameOver) return null;

    const isStalemate = gameResult.type === "stalemate";

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-300">
        <div className="bg-surface rounded-3xl p-10 max-w-lg shadow-2xl border-4 border-surface animate-in zoom-in-95 duration-300">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            {isStalemate ? (
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <Swords className="w-10 h-10 text-gray-600" />
              </div>
            ) : (
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg animate-bounce duration-1000">
                <Trophy className="w-10 h-10 text-on-primary" />
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-center mb-2">
            {isStalemate
              ? "Hòa cờ!"
              : gameResult.type === "checkmate"
                ? "Chiếu hết!"
                : "Chiến thắng!"}
          </h2>

          {/* Winner info */}
          {!isStalemate ? (
            <p className="text-center text-xl mb-4">
              <span
                className={`font-bold ${
                  gameResult.winner === "red" ? "text-red-600" : "text-gray-800"
                }`}
              >
                {gameResult.winner === "red" ? "Quân Đỏ" : "Quân Đen"}
              </span>{" "}
              giành chiến thắng!
            </p>
          ) : null}

          {/* Details */}
          <div className="bg-surface rounded-xl p-4 mb-6 space-y-2 text-muted border border-surface">
            <p>
              <strong>Kết quả:</strong>{" "}
              {gameResult.type === "checkmate" ? "Chiếu hết (Checkmate)" : null}
              {gameResult.type === "captured"
                ? "Ăn Tướng (đối phương mất Tướng)"
                : null}
              {gameResult.type === "stalemate"
                ? "Bế tắc (Stalemate) - Hòa cờ"
                : null}
            </p>
            <p>
              <strong>Tổng số nước đi:</strong> {moveHistoryLength}
            </p>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onRestart}
              className="p-4 btn-primary rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.03] cursor-pointer"
            >
              Chơi lại
            </button>
            <button
              onClick={onExit}
              className="p-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold text-lg
                       shadow-lg hover:shadow-xl transition-all hover:scale-[1.03] cursor-pointer"
            >
              Về Menu
            </button>
          </div>
        </div>
      </div>
    );
  },
);
GameResultDialog.displayName = "GameResultDialog";
