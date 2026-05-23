import React from "react";
import {
  Undo2,
  Redo2,
  Lightbulb,
  Save,
  FolderOpen,
  RotateCcw,
  Handshake,
  Flag,
  MessageSquare,
  Pause,
} from "lucide-react";

interface GameControlPanelProps {
  mode: string;
  onUndo?: () => void;
  onRedo?: () => void;
  onHint?: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  onRestart?: () => void;
  onDrawOffer: () => void;
  onResign: () => void;
  onChat?: () => void;
  onPause: () => void;
}

export const GameControlPanel: React.FC<GameControlPanelProps> = React.memo(
  ({
    mode,
    onUndo,
    onRedo,
    onHint,
    onSave,
    onLoad,
    onRestart,
    onDrawOffer,
    onResign,
    onChat,
    onPause,
  }) => {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-amber-200 space-y-3">
        <h3 className="text-xl font-bold text-amber-900 mb-4">
          Game Controls
        </h3>

        <button
          onClick={onUndo}
          className="w-full flex items-center gap-3 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Undo2 className="w-5 h-5" />
          <span>Undo</span>
        </button>

        <button
          onClick={onRedo}
          className="w-full flex items-center gap-3 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Redo2 className="w-5 h-5" />
          <span>Redo</span>
        </button>

        <button
          onClick={onHint}
          className="w-full flex items-center gap-3 p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
        >
          <Lightbulb className="w-5 h-5" />
          <span>Hint</span>
        </button>

        <div className="border-t border-amber-200 my-4" />

        <button
          onClick={onSave}
          className="w-full flex items-center gap-3 p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
        >
          <Save className="w-5 h-5" />
          <span>Save Game</span>
        </button>

        <button
          onClick={onLoad}
          className="w-full flex items-center gap-3 p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
        >
          <FolderOpen className="w-5 h-5" />
          <span>Load Game</span>
        </button>

        <button
          onClick={onRestart}
          className="w-full flex items-center gap-3 p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Restart</span>
        </button>

        <div className="border-t border-amber-200 my-4" />

        <button
          onClick={onDrawOffer}
          className="w-full flex items-center gap-3 p-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors"
        >
          <Handshake className="w-5 h-5" />
          <span>Offer Draw</span>
        </button>

        <button
          onClick={onResign}
          className="w-full flex items-center gap-3 p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <Flag className="w-5 h-5" />
          <span>Resign</span>
        </button>

        {mode === "online" ? (
          <button
            onClick={onChat}
            className="w-full flex items-center gap-3 p-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors animate-in fade-in zoom-in-95 duration-200"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Chat</span>
          </button>
        ) : null}

        <div className="border-t border-amber-200 my-4" />

        <button
          onClick={onPause}
          className="w-full flex items-center gap-3 p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <Pause className="w-5 h-5" />
          <span>Pause Menu</span>
        </button>
      </div>
    );
  }
);

GameControlPanel.displayName = "GameControlPanel";
