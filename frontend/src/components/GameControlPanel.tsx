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
      <div className="glass-panel p-6 shadow-2xl border-border space-y-3">
        <h3 className="text-xl font-bold font-heading text-main mb-6">
          Game Controls
        </h3>

        <button
          onClick={onUndo}
          className="w-full flex items-center gap-3 p-3 bg-surface-opaque hover:bg-surface-hover border border-border text-main rounded-xl transition-colors group"
        >
          <Undo2 className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
          <span className="font-semibold">Undo</span>
        </button>

        <button
          onClick={onRedo}
          className="w-full flex items-center gap-3 p-3 bg-surface-opaque hover:bg-surface-hover border border-border text-main rounded-xl transition-colors group"
        >
          <Redo2 className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
          <span className="font-semibold">Redo</span>
        </button>

        <button
          onClick={onHint}
          className="w-full flex items-center gap-3 p-3 bg-surface-opaque hover:bg-surface-hover border border-border text-main rounded-xl transition-colors group"
        >
          <Lightbulb className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
          <span className="font-semibold">Hint</span>
        </button>

        <div className="border-t border-border my-5" />

        <button
          onClick={onSave}
          className="w-full flex items-center gap-3 p-3 bg-surface-opaque hover:bg-surface-hover border border-border text-main rounded-xl transition-colors group"
        >
          <Save className="w-5 h-5 text-muted group-hover:text-success transition-colors" />
          <span className="font-semibold">Save Game</span>
        </button>

        <button
          onClick={onLoad}
          className="w-full flex items-center gap-3 p-3 bg-surface-opaque hover:bg-surface-hover border border-border text-main rounded-xl transition-colors group"
        >
          <FolderOpen className="w-5 h-5 text-muted group-hover:text-success transition-colors" />
          <span className="font-semibold">Load Game</span>
        </button>

        <button
          onClick={onRestart}
          className="w-full flex items-center gap-3 p-3 bg-surface-opaque hover:bg-surface-hover border border-border text-main rounded-xl transition-colors group"
        >
          <RotateCcw className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
          <span className="font-semibold">Restart</span>
        </button>

        <div className="border-t border-border my-5" />

        <button
          onClick={onDrawOffer}
          className="w-full flex items-center gap-3 p-3 bg-surface-opaque hover:bg-surface-hover border border-border text-main rounded-xl transition-colors group"
        >
          <Handshake className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
          <span className="font-semibold">Offer Draw</span>
        </button>

        <button
          onClick={onResign}
          className="w-full flex items-center gap-3 p-3 bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger rounded-xl transition-colors group"
        >
          <Flag className="w-5 h-5 text-danger" />
          <span className="font-semibold">Resign</span>
        </button>

        {mode === "online" ? (
          <button
            onClick={onChat}
            className="w-full flex items-center gap-3 p-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary rounded-xl transition-colors group mt-3 animate-in fade-in zoom-in-95 duration-200"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-semibold">Chat</span>
          </button>
        ) : null}

        <div className="border-t border-border my-5" />

        <button
          onClick={onPause}
          className="w-full flex items-center gap-3 p-3 bg-surface-opaque hover:bg-surface-hover border border-border text-main rounded-xl transition-colors group"
        >
          <Pause className="w-5 h-5 text-muted group-hover:text-main transition-colors" />
          <span className="font-semibold">Pause Menu</span>
        </button>
      </div>
    );
  }
);

GameControlPanel.displayName = "GameControlPanel";
